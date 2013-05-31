require([
  'angular',
  'domReady',
  'moment',
  'fe-be-utils',
  'view-models',
  'angularResource',
  'd3',
  'es5shim',
  'overlay'
],
  function (angular, domReady, moment, feBeUtils, viewModels) {
    'use strict';


    var dashboardApp = angular.module('bpn.apps.dashboard', ['ngResource']);

    dashboardApp.factory('sharedDataService', function(){
      return {
        activeOverlay : undefined,
        modalOptions : {
          backdropFade: true,
          dialogFade: true,
          dialogClass : 'overlay'
        }
      };
    });

    dashboardApp.controller('bpn.controllers.dashboard.Main',
      [
        '$scope',
        '$filter',
        '$http',
        'sharedDataService',
        function ($scope, $filter, GrowPlanModel, sharedDataService) {
          $scope.sharedDataService = sharedDataService;

          // First, transform the data into viewModel-friendly formats
          bpn.pageData.controls.forEach(function (control) {
            viewModels.initControlViewModel(control);
          });

          viewModels.initGrowPlanInstanceViewModel(bpn.pageData.growPlanInstance, bpn.pageData.controls);


          // Raise sensorLog readings to be hashes keyed by sensor code
          bpn.pageData.latestSensorLogs.forEach(function (sensorLog) {
            sensorLog.logs.forEach(function (log) {
              sensorLog[log.sCode] = log.val;
            });
            // delete array to save memory, since we're not going to use it anymore
            delete sensorLog.logs;
          });

          $scope.getLatestSensorLogsByDate = function (sensorLogs, date) {
            // since sensorLog array is in desc date order, decrement through the array,
            // stopping if we've found the date or if we've found a date less than date
            var dateMoment = moment(date),
              dateDiff;

            for (var i = sensorLogs.length; i--;) {
              dateDiff = dateMoment.diff(sensorLogs[i].timestamp, 'days')
              if (dateDiff == 0) {
                return sensorLogs[i]
              } else if (dateDiff > 0) {
                return [];
              }
            }
          };

       
          $scope.triggerImmediateAction = function(actionId){
            $http.post(
              '/api/grow-plan-instances/' + $scope.growPlanInstance._id + '/immediate-actions',
              {
                actionId : actionId,
                message : "Triggered from dashboard"
              }
            )
            .success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              console.log(data);
            })
            .error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              console.log(data);
            });
          }

          // Set up functions and watchers

          $scope.getGrowPlanInstancePhaseFromDate = function (date) {
            var dateMoment = moment(date),
              growPlanInstancePhases = $scope.growPlanInstance.phases,
              i,
              phaseStart;

            for (i = growPlanInstancePhases.length; i--;) {
              phaseStart = growPlanInstancePhases[i].startDate;
              if (dateMoment.isAfter(phaseStart)) {
                return growPlanInstancePhases[i];
              }
            }
          };


          /**
           * Based on activeDte, refresh the latest sensor logs & control actions
           */
          $scope.loadActiveDateData = function () {
            var date = $scope.activeDate.date;

            $scope.activeDate.latestSensorLogs = $scope.getLatestSensorLogsByDate($scope.latestSensorLogs, date);
            $scope.activeDate.growPlanInstancePhase = $scope.getGrowPlanInstancePhaseFromDate(date);
            $scope.activeDate.growPlanPhase = $scope.activeDate.growPlanInstancePhase.phase;
          };

          $scope.$watch('activeDate.date', function () {
            // get the day's GrowPlan Phase
            // get the day's GrowPlanInstance.phase.daySummary
            // If not today, clear out the activeDate.latestSensorLogs property to make the sensor values blank out. not going to get past day's sensorLogs just yet
            $scope.loadActiveDateData();

            // TODO POST-MVP : get the day's sensorLogs through a service call
            // TODO POST-MVP : get the device-controlled actions for the day's phase, bind those
            // TODO POST-MVP : get the sensors for the day's phase (union of device sensors and Phase's IdealRanges.sCode)
          });

          // Finally, set the scope models
          $scope.controls = bpn.pageData.controls;
          $scope.sensors = bpn.pageData.sensors;
          $scope.growPlanInstance = bpn.pageData.growPlanInstance;
          $scope.latestSensorLogs = bpn.pageData.latestSensorLogs;
          $scope.activeDate = {
            date:new Date(),
            daySummary:{},
            latestSensorLogs:{},
            growPlanInstancePhase:{},
            growPlanPhase:{}
          };
          $scope.loadActiveDateData();
        }
      ]
    );


    dashboardApp.controller('bpn.controllers.dashboard.DayOverview',
      [
        '$scope',
        '$filter',
        function ($scope, $filter) {
          // TODO: Add functions to handle interactions on anything in the DayOverview sidebar (clicks to open sensor detail overlay)

          $scope.getIdealRangeForSensor = function (sensor) {
            var idealRanges = $scope.activeDate.growPlanPhase.idealRanges,
              i;
            // TODO : factor in time of day, for idealRange.applicableTimeSpan
            for (i = idealRanges.length; i--;) {
              if (idealRanges[0].sCode === sensor.code) {
                return idealRanges[0];
              }
            }
          };


          $scope.getSensorBlockClassNames = function (sensor) {
            var sensorCode = sensor.code,
              classNames = ['sensor', 'data-module', sensorCode],
              idealRange = $scope.getIdealRangeForSensor(sensor),
              sensorValue = $scope.activeDate.latestSensorLogs ? $scope.activeDate.latestSensorLogs[sensorCode] : undefined;

            // Determine whether we need to add the "warning" class
            if (idealRange) {
              if ((sensorValue < idealRange.valueRange.min) ||
                  (sensorValue > idealRange.valueRange.max)
                ) {
                classNames.push('warning');
              }
            }

            if (typeof sensorValue === 'undefined') {
              classNames.push('warning');
            }

            return classNames.join(' ');
          };
        }
      ]
    );


    dashboardApp.controller('bpn.controllers.dashboard.PhasesGraph',
      [
        '$scope',
        '$filter',
        'sharedDataService',
        function ($scope, $filter, sharedDataService) {
          $scope.sharedDataService = sharedDataService;
          // TODO: Add functions to handle interactions on the phase graph.

          // TODO : function to set $scope.activeDate (will be called based on clicks or mouseovers on sections of the phaseGraph).
          // Since $scope is inherited from parent, this'll set Main controller's $scope.activeDate,
          // which in turn will update the DayOverview sidebar

          $scope.getPhaseClass = function (data, index) {
            var status = data.data.status;

            switch(status){
              case feBeUtils.PHASE_DAY_SUMMARY_STATUSES.GOOD : 
                return "good";
              case feBeUtils.PHASE_DAY_SUMMARY_STATUSES.GOOD : 
                return "bad";
              default : 
                return "empty";
            }
          };

          $scope.drawBarSet = function (target, barWidth, barLength, barSpacing, numBars) {
            var svg,
              startLoc = 0,
              totalHeight = ((barWidth * numBars) + (barSpacing * (numBars - 1))),
            //startLoc = ((barWidth*numBars) + (barSpacing*numBars))/-2,
              bar,
              barGroup;

            svg = d3.select(target).append('svg:g').attr('class', 'barberPoleCont');

            barGroup = svg
              .attr('width', barLength)
              .attr('height', ((barWidth * numBars) + (barSpacing * (numBars - 1))))
              .append('svg:g')
              .attr('class', 'barberPolePattern');

            for (var i = 0; i < numBars; i++) {
              barGroup
                .append("svg:rect")
                .attr('x', (barLength / -2))
                .attr('y', ((startLoc + (barWidth * i) + (barSpacing * i)) + (totalHeight / -2)  ))
                .attr('width', barLength)
                .attr('height', barWidth);
            }
          };

          $scope.drawPhaseGraphs = function () {
            var phases = $scope.growPlanInstance.phases,
              phaseCount = phases.length,
              $container = $('#phases-graph'),
              outerMargin = 80,
              width = $container.width() - (outerMargin * 2),
              height = width,
              radius = width / 2,
              innerWhitespaceRadius = radius / (phaseCount + 1),
              // sum of all arcSpans must fit between outer boundary and inner whitespace
              arcSpan = (radius - innerWhitespaceRadius) / phaseCount,
              arcMargin = 0,
              colorScale = d3.scale.category20c(),
              equalPie = d3.layout.pie();


            // disable data sorting & force all slices to be the same size
            equalPie
              .sort(null)
              .value(function (d) {
                return 1;
              });

            var svg = d3.select('#phases-graph')
              .append('svg:svg')
              .attr('width', width)
              .attr('height', height);

            //$('#phases-graph').append($('.barberPolePattern'));

            $.each(phases, function (index, phase) {
              var arc = d3.svg.arc(),
                className = 'phase' + index,
                phaseGroup;

              arc.outerRadius(radius - (arcSpan * index) - arcMargin)
                .innerRadius(radius - (arcSpan * (index + 1)) - arcMargin);

              phaseGroup = svg.append('svg:g')
                .classed(className, true)
                .attr('transform', 'translate(' + (width / 2) + ',' + (width / 2) + ')');

              var allArcs = phaseGroup.selectAll('path')
                .data(equalPie(phase.daySummaries));

              allArcs
                .enter()
                .append('svg:g')
                .append('svg:path')
                .attr('d', arc)
                .attr('class', $scope.getPhaseClass);

              allArcs
                .on('click', function (d, i) {
                  var barberPoleCont = $('.barberPoleCont');
                  var barberPolePattern = $('.barberPolePattern');
                  var angle = d.startAngle + ((d.endAngle - d.startAngle) / 2);
                  var centroidX = arc.centroid(d)[0] + width / 2;
                  var centroidY = arc.centroid(d)[1] + width / 2;

                  barberPolePattern.attr('transform', 'rotate(' + (Math.degrees(angle) + 45) + ')');

                  //barberPole.attr('transform', 'translate(' + centroidX + ',' + centroidY + ') rotate(' + (Math.degrees(angle) + 45) + ')');
                  barberPoleCont.css('mask', 'url(#mask-' + $(this).attr('id') + ')');
                  barberPoleCont.attr('transform', 'translate(' + (width / 2) + ',' + (width / 2) + ')');


                  //console.log("WIDTH " + width);

                  //barberPole.attr('transform', 'translate(' + arc.centroid(d) + ') rotate(' + (Math.degrees(angle) + 45) + ')');
                });

              var maskGroup = svg.append('defs')
                .append('g')
                .attr('transform', 'translate(' + (width / 2) + ',' + (width / 2) + ')');

              var allMasks = maskGroup.selectAll('mask')
                .data(equalPie(phase.daySummaries));

              allMasks
                .enter()
                .append('svg:mask')
                .append('svg:path')
                .attr('d', arc)
                .attr('class', $scope.getPhaseClass);
            });
          };

          $scope.drawPhaseGraphs();
        }
      ]
    );


    dashboardApp.controller('bpn.controllers.dashboard.Controls',
      [
        '$scope',
        '$filter',
        'sharedDataService',
        function ($scope, $filter, sharedDataService) {
          $scope.sharedDataService = sharedDataService;
          // TODO: Add functions to handle interactions with control widgets. Launch control overlay.

          // NOTE: This is not currently in use
          $scope.makeDayProgressClock = function (svg, radius, triangleSize) {
            var triHeight = Math.cos(Math.PI / 6) * triangleSize,
              width = svg.clientWidth,
              height = svg.clientHeight;

            var circleCont = d3.select(svg)
              .append('svg:g')
              .attr('class', 'timeProgressThumb')
              .attr('width', width)
              .attr('height', height)
              //.attr("transform", "rotate(90, 250, 250)")
              .append("svg:polygon")
              .attr('stroke', 'black')
              .attr("points", width / 2 + "," + radius + " " + ((width / 2) + (triangleSize / 2)) + "," + (triHeight + radius) + " " + ((width / 2) - (triangleSize / 2)) + "," + (triHeight + radius));
          };
        }
      ]
    );

    dashboardApp.controller('bpn.controllers.dashboard.ControlOverlay',
      [
        '$scope',
        'sharedDataService',
        function($scope, sharedDataService){
          console.log('control overlay');
          $scope.sharedDataService = sharedDataService;

          $scope.close = function(){
            $scope.sharedDataService.activeOverlay = undefined;
          };
        }
      ]
    );

    dashboardApp.controller('bpn.controllers.dashboard.Notifications',
      [
        '$scope',
        '$filter',
        function ($scope, $filter) {

        }
      ]
    );


    dashboardApp.controller('bpn.controllers.dashboard.SensorDetailOverlay',
      [
        '$scope',
        function ($scope) {

          $scope.drawSparkGraph = function (svgCont, setData, idealLow, idealHigh, belowResolution) {
            var width = 400;
            var height = 100;

            var yExtent = d3.extent(setData, function (d) { return d.value; });

            var xScale = d3.scale.linear()
              .domain(d3.extent(setData, function (d) {
              return d.time;
            }));
            xScale.range([0, width]);
            //.nice();      

            var yScale = d3.scale.linear()
              .domain(d3.extent(setData, function (d) { return d.value; }))
              .range([height, 0]);

            var yColorScale = d3.scale.linear()
              .domain([yExtent[0], idealLow, idealLow, idealHigh, idealHigh, yExtent[1]])
              .range(['red', 'red', 'green', 'green', 'red', 'red']);

            var line = d3.svg.line()
              .x(function (d) {
                return xScale(d.time);
              })
              .y(function (d) {
                return yScale(d.value);
              });

            var sparkGraph = d3.select(svgCont)
              .append('svg:svg')
              .attr('width', width)
              .attr('height', height);

            var arraySections = [];
            var curArr = [];

            var crossTime = '';
            var crossPercent = '';
            var crossPoint = '';

            var testScale = d3.scale.linear()
              .domain([yExtent[0], idealLow - belowResolution, idealLow, idealHigh, idealHigh + belowResolution, yExtent[1]])
              .range(['low', 'low', 'normal', 'normal', 'high', 'high']);

            for (var i = 0; i < setData.length; i++) {
              if (curArr.length == 0) {
                curArr.push(setData[i]);
              } else {
                if (testScale(setData[i - 1].value) != testScale(setData[i].value)) {
                  if ((testScale(setData[i - 1].value) == 'low' || testScale(setData[i - 1].value) == 'normal') && (testScale(setData[i].value) == 'low' || testScale(setData[i].value) == 'normal')) {
                    crossPercent = Math.abs(idealLow - setData[i - 1].value) / Math.abs(setData[i].value - setData[i - 1].value)
                    crossTime = ((setData[i].time - setData[i - 1].time) * crossPercent ) + setData[i - 1].time;

                    crossPoint = {'time':crossTime, 'value':idealLow - belowResolution};
                  } else if ((testScale(setData[i - 1].value) == 'high' || testScale(setData[i - 1].value) == 'normal') && (testScale(setData[i].value) == 'high' || testScale(setData[i].value) == 'normal')) {
                    crossPercent = Math.abs(idealHigh - setData[i - 1].value) / Math.abs(setData[i].value - setData[i - 1].value)
                    crossTime = ((setData[i].time - setData[i - 1].time) * crossPercent ) + setData[i - 1].time;

                    crossPoint = {'time':crossTime, 'value':idealHigh + belowResolution};
                  } else {
                    console.log("NOT SUPPOSED TO!! i-1 " + testScale(setData[i - 1].value) + " i " + testScale(setData[i - 1].value));
                  }

                  curArr.push(crossPoint);
                  arraySections.push(curArr);
                  curArr = [];
                  curArr.push(crossPoint);
                  curArr.push(setData[i]);
                } else {
                  curArr.push(setData[i]);
                }
              }
            }

            arraySections.push(curArr);

            sparkGraph
              .append('line')
              .attr('x1', 0)
              .attr('y1', yScale(idealLow))
              .attr('x2', width)
              .attr('y2', yScale(idealLow))
              .attr('stroke-width', 1)
              .attr('stroke', 'black');

            sparkGraph
              .append('line')
              .attr('x1', 0)
              .attr('y1', yScale(idealHigh))
              .attr('x2', width)
              .attr('y2', yScale(idealHigh))
              .attr('stroke-width', 1)
              .attr('stroke', 'black');


            sparkGraph.selectAll('path')
              .data(arraySections)
              .enter().append("path")
              .attr('stroke', function (d, i) {
                return yColorScale(d[1].value);
              })
              .attr('fill', 'none')
              .attr('stroke-width', '1')

              .attr("d", line);

            /*sparkGraph.append("path")
             .datum(setData)
             //.attr("class", "line")
             .attr('stroke', 'red')
             .attr('fill', 'none')
             .attr('stroke-width', '1')
             .attr("d", line);*/
          };
        }
      ]
    );


    dashboardApp.directive('bpnDirectivesControlActionGraph', function() { 
      return {
        restrict : "EA",
        template : '<div class="control ring-graph {{controlAction.control.className}}"></div>',
        replace : true,
        scope : {
          controlAction : "="
        },
        controller : function ($scope, $element, $attrs, $transclude){
          $scope.getPathClassName = function (data, index) {
            var num = parseInt(data.data.value, 10);

            if (num == 0) {
              return 'off';
            } else {
              return 'on';
            }
          };


        },
        link: function (scope, element, attrs, controller) { 
          // link is where we have a created directive element as
          // well as populated scope to work with
          // element is a jQuery wrapper on the element

          var outerMargin = 0,
              width = element.width() - (outerMargin * 2),
              height = width,
              radius = width / 2,
              innerWhitespaceRadius = radius / 2,
              arcSpan = (radius - innerWhitespaceRadius),
              arcMargin = 0,
              colorScale = d3.scale.category20c(),
              pie = d3.layout.pie(),
              dayMilliseconds = 24 * 60 * 60 * 1000,
              svg,
              arc,
              className,
              svgGroup,
              cycleStates,
              cyclesInADay,
              cycleGraphData = [],
              i;

          // disable data sorting & force all slices to be the same size
          pie
          .sort(null)
          .value(function (d) {
            return d.milliseconds || 1; // don't allow a 0 duration. d3 can't draw it
          });

          svg = d3.select(element[0])
          .append('svg:svg')
          .attr('width', width)
          .attr('height', height);

          arc = d3.svg.arc();
          className = 'control-' + scope.controlAction.control.className;

          cycleStates = scope.controlAction.cycle.states.map(function(state){
            return {
              value : parseInt(state.controlValue, 10),
              milliseconds : moment.duration(state.duration || 0, state.durationType || '').asMilliseconds()
            }
          });

          if (scope.controlAction.overallDurationInMilliseconds === 0){
            // then it's a single-state cycle with no duration (aka, just set to VALUE and leave forever)
            cyclesInADay = 1;
          } else {
            cyclesInADay = dayMilliseconds / scope.controlAction.overallDurationInMilliseconds;
          }
          
          for (i = 0; i < cyclesInADay; i++) {
            cycleGraphData = cycleGraphData.concat(cycleStates);
          }

          arc
          .outerRadius(radius - arcMargin)
          .innerRadius(radius - arcSpan - arcMargin);

          svgGroup = svg.append('svg:g')
          .classed(className, true)
          .attr('transform', 'translate(' + (width / 2) + ',' + (width / 2) + ')');          

          svgGroup.selectAll('path')
          .data(pie(cycleGraphData))
          .enter()
          .append('svg:path')
          .attr('d', arc)
          .attr('class', scope.getPathClassName)
          //.attr('stroke', '#fff')
          //.attr('stroke-width', 1)
          //.attr('fill', scope.getControlFillColor)
          
        }
      };
    });

    domReady(function () {
      angular.bootstrap(document, ['bpn.apps.dashboard']);
    });

  });
