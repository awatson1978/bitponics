Bitponics.pages.growplans = {
    init: function() {
    },

    app: angular.module( "GrowPlanModule", [ "ngResource" ] ),

    GrowPlanController : ['$scope', '$filter', '$resource', function($scope, $filter, $resource){
        $scope.plants = Bitponics.plants;
        $scope.filteredPlantList = angular.copy($scope.plants);
        $scope.controls = Bitponics.controls;
        $scope.sensors = Bitponics.sensors;
        $scope.plantSelections = {};
        $scope.selectedPlants = [];
        $scope.plantQuery = '';
        $scope.growSystems = Bitponics.growSystems;
        $scope.growSystemSelections = {};
        $scope.currentGrowPlanDay = 0;
        $scope.growPlans = Bitponics.growPlans;
        $scope.filteredGrowPlanList = angular.copy($scope.growPlans);
        $scope.timesOfDayList = Bitponics.Utils.generateTimesOfDayArray();
        $scope.actionDurationTypeOptions = Bitponics.Utils.durationTypes,
        $scope.actionWithNoAccessoryDurationTypeOptions = ['days','weeks','months'];

        //Wrapping our ng-model vars {}
        //This is necessary so ng-change always fires, due to: https://github.com/angular/angular.js/issues/1100
        $scope.selected = {
            growSystem: undefined,
            growPlan: undefined,
            plant: {}
        };

        var GrowPlanModel = $resource(
            '/api/grow_plans/',
            {},
            {
                'query':  { method: 'GET', isArray: true }
            }
        );
    
        
        $scope.setSelectedGrowPlan = function() {
            $scope.selectedGrowPlan = $filter('filter')($scope.growPlans, { _id: $scope.selected.growPlan });

            if (!$scope.selectedGrowPlan.length) { 
                $scope.selectedGrowPlan = Bitponics.growPlanDefault; 
            }
            
            Bitponics.pages.growplans.initGrowPlanViewModel($scope.selectedGrowPlan);

            // Update grow plan plants.
            $scope.selectedPlants.forEach(function(plant, index){
                if (!$scope.selectedGrowPlan.plants.some(function(gpPlant){ gpPlant.name === plant.name })){
                    $scope.selectedGrowPlan.plants.push(plant);
                }
            });
            $scope.selectedGrowPlan.plants.sort(function(a, b) { return a.name < b.name; });
            
            $scope.expectedGrowPlanDuration = $scope.selectedGrowPlan.phases.reduce(function(prev, cur){ return prev.expectedNumberOfDays + cur.expectedNumberOfDays;});
        };

        $scope.selectedSensors = function() {
            var list = [];
            angular.forEach($scope.sensors, function(sensor) {
              list.push(sensor);
            });
            return list;
        };

        $scope.updateSelectedGrowSystem = function(){
            $scope.selectedGrowSystem = $filter('filter')($scope.growSystems, { _id: $scope.selected.growSystem })[0];
            if($scope.selectedPlants.length){
                $scope.updatefilteredGrowPlans();
            }
        };

        $scope.filterPlantList = function(){
            var filteredPlantList = $filter('filter')($scope.plants, { name : $scope.plantQuery });
            $scope.filteredPlantList = filteredPlantList;
        };

        $scope.addPlant = function(){
            var newPlant = {name : $scope.plantQuery };
            $scope.filteredPlantList.push(newPlant);
            $scope.selectedPlants.push(newPlant);
        };  

        $scope.updateSelectedPlants = function(){
            for (var i = $scope.plants.length; i--;) {
                Object.keys($scope.selected.plant).forEach(function(_id) {
                    if ($scope.selected.plant[_id] && $scope.plants[i]._id == _id) {
                        $scope.selectedPlants.push($scope.plants[i]);
                    }
                });
            }
            $scope.updatefilteredGrowPlans();
        };

        $scope.updatefilteredGrowPlans = function(){
            var selectedPlantIds = $scope.selectedPlants.map(function(plant) { return plant._id }),
                growPlanDefault = new GrowPlanModel(Bitponics.growPlanDefault);

            //hit API with params to filter grow plans
            $scope.filteredGrowPlanList = GrowPlanModel.query({
                plants: selectedPlantIds,
                growSystem: $scope.selectedGrowSystem._id
            }, function(){
                //add default to end of filtered grow plan array
                $scope.filteredGrowPlanList.splice($scope.filteredGrowPlanList.length, 0, growPlanDefault);
                console.log('GrowPlanModel: ',$scope.filteredGrowPlanList);
            });
        };
        
        $scope.updatePhaseDurations = function(){
            var currentExpectedPlanDuration = $scope.selectedGrowPlan.phases.reduce(function(prev, cur){ return prev.expectedNumberOfDays + cur.expectedNumberOfDays;}),
                difference = $scope.expectedGrowPlanDuration - currentExpectedPlanDuration,
                phases = $scope.selectedGrowPlan.phases,
                i, phase;
            
            
            // If it's a positive change, just add all the days onto the last phase
            if (difference > 0){
                phases[phases.length - 1].expectedNumberOfDays += difference;
            } else if (difference < 0){
                // If it's a negative change, decrement from the final phase first, preserving a min of 1 day duration. Then start
                // removing days from earlier phases. Preserve at least 1 day in all phases
                for (i = phases.length; i--;){
                    phase = phases[i];
                    while (phase.expectedNumberOfDays > 1 && difference < 0){
                        phase.expectedNumberOfDays--;
                        difference++;        
                    } 
                }
            }
            
            $scope.expectedGrowPlanDuration = $scope.selectedGrowPlan.phases.reduce(function(prev, cur){ return prev.expectedNumberOfDays + cur.expectedNumberOfDays;});
        };


        $scope.addIdealRange = function(e){
            var phase = e.phase,
                newIdealRange = {
                    _id : phase.idealRanges.length.toString() + '-' + (Date.now().toString()), // this is just to make it unique in the UI. The server will detect that this is not an ObjectId and create a new IdealRange
                    valueRange : {
                        min : 0,
                        max : 1
                    }
                };
            // Unshift to make it show up first
            phase.idealRanges.unshift(newIdealRange);
        };


        $scope.addAction = function(e){
            var phase = e.phase,
                newAction = {
                    _id : phase.actions.length.toString() + '-' + (Date.now().toString()) // this is just to make it unique in the UI. The server will detect that this is not an ObjectId and create a new Action
                };
            // Unshift to make it show up first
            phase.actions.unshift(newAction);
        };

        $scope.submit = function(){
            if($scope.selectedGrowPlan){
                console.log('submit!');
                console.log(compileGrowPlanViewModelToServerModel($scope.selectedGrowPlan));
            }
        }
    }],


    /**
     * Adds/calculates properties necessary for UI presentation
     */
    initGrowPlanViewModel : function (growPlan){
        var initActionViewModel = Bitponics.pages.growplans.initActionViewModel;

        growPlan.phases.forEach(function(phase, index){
            phase.idealRanges.forEach(function(idealRange, idealRangeIndex){
                if (!idealRange.applicableTimeSpan){
                    idealRange.noApplicableTimeSpan = true;
                }
            });
            
            phase.actionsViewModel = [];
            phase.actions.forEach(function(action){
                phase.actionsViewModel.push(initActionViewModel(action, 'phaseStart'));
            });
            phase.phaseEndActions.forEach(function(action){
                phase.actionsViewModel.push(initActionViewModel(action, 'phaseEnd'));
            });
        });
        return growPlan;
    },

    /**
     * Adds/calculates properties necessary for UI presentation
     * Properties for control vs no-control presentation,
     * daily vs non-daily cycles. Makes changes in-plase on the provided Action.
     * 
     * Adds the following properties:
     * action.scheduleType (string) : 'phaseStart' || 'phaseEnd' || 'repeat'
     * action.isDailyControlCycle (boolean)
     * action.dailyOnTime (set if isDailyControlCycle)
     * action.dailyOffTime (set if isDailyControlCycle)
     * action.message (set if a no-control action)
     * action.offsetTimeOfDay (set if a repeating action with an offset)
     * action.overallDuration
     * action.overallDurationType (months||weeks||days||hours||minutes||seconds)
     *
     * @param action
     * @param source (optional): 'phaseStart' || 'phaseEnd'
     * 
     * @return action. The modified Action object.
     */
    initActionViewModel: function(action, source){
        var overallDuration = 0,
            asMonths,
            asWeeks,
            asDays,
            asHours,
            asMinutes,
            asSeconds;
        
        // Set scheduleType
        if (source === 'phaseStart'){
            if (action.cycle.repeat){
                action.scheduleType = 'repeat';
            } 
            else {
                action.scheduleType = 'phaseStart';
            }
        } else {
            action.scheduleType = 'phaseEnd';
        }

        // Set overallDuration
        action.isDailyControlCycle = false;
        action.cycle.states.forEach(function(state){
            overallDuration += moment.duration(state.duration || 0, state.durationType || '').asMilliseconds();
        });
        overallDuration = Bitponics.Utils.getLargestWholeNumberDurationObject(overallDuration);

        action.overallDuration = overallDuration.duration;
        action.overallDurationType = overallDuration.durationType;

        if (action.overallDurationType === 'days' && action.overallDuration === 1){
            // If it's an accessory with a daily cycle, we want to show daily 
            // on/off times
            if (action.control){
                action.isDailyControlCycle = true;
                if (action.cycle.states[0].controlValue === '0'){
                    if (action.cycle.states.length === 3){
                        // Through server-side validation, we're guaranteed that state[0] and state[3] have the same controlValue
                        action.dailyOnTime = moment.duration(action.cycle.states[0].duration, action.cycle.states[0].durationType).asMilliseconds();
                        // if first state is off, then OFF trigger time is actually later in the day than ON time. 
                        // Add ON duration to ON trigger time to get OFF trigger time
                        // ON is state[1]
                        action.dailyOffTime = action.dailyOnTime + moment.duration(action.cycle.states[1].duration, action.cycle.states[1].durationType).asMilliseconds();
                    } else {
                        action.dailyOffTime = 0;
                        action.dailyOnTime = moment.duration(action.cycle.states[0].duration, action.cycle.states[0].durationType).asMilliseconds();
                    }
                } else {
                    // else first state of ON cycle
                    if (action.cycle.states.length === 3){
                        // Through server-side validation, we're guaranteed that state[0] and state[3] have the same controlValue
                        action.dailyOffTime = moment.duration(action.cycle.states[0].duration, action.cycle.states[0].durationType).asMilliseconds();
                        // if first state is ON, then ON trigger time is actually later in the day than OFF time. 
                        // Add OFF duration to OFF trigger time to get ON trigger time
                        // OFF is state[1]
                        action.dailyOnTime = action.dailyOffTime + moment.duration(action.cycle.states[1].duration, action.cycle.states[1].durationType).asMilliseconds();
                    } else {
                        action.dailyOnTime = 0;
                        action.dailyOffTime = moment.duration(action.cycle.states[0].duration, action.cycle.states[0].durationType).asMilliseconds();
                    }
                }
            }
        }

        if (action.cycle.states.length === 3){
            action.offsetTimeOfDay = moment.duration(action.cycle.states[0].duration || 0, action.cycle.states[0].durationType || '').asMilliseconds();    
        }
        
        // If no control, then this is just a repeating notification. 
        // Get the message from the state that has a message
        if (!action.control && action.cycle && action.cycle.states.length){
            for (var stateIndex = 0, statesLength = action.cycle.states.length; stateIndex < statesLength; stateIndex++){
                if (action.cycle.states[stateIndex].message){
                    action.message = action.cycle.states[stateIndex].message;
                    break;
                }
            }
        }
        
        return action;
    },    


    /**
     * Convert GrowPlan ViewModel back to server model
     */
    compileGrowPlanViewModelToServerModel: function (growPlan){
        growPlan.phases.forEach(function(phase, index){
            phase.idealRanges.forEach(function(idealRange, idealRangeIndex){
                if (idealRange.noApplicableTimespan){
                    idealRange.applicableTimespan = undefined;   
                }
            });

            phase.actions = [];
            phase.phaseEndActions = [];

            phase.actionsViewModel.forEach(function(actionViewModel){
                switch(actionViewModel.scheduleType){
                    case 'phaseStart':
                    case 'repeat':
                        phase.actions.push(Bitponics.pages.growplans.compileActionViewModelToServerModel(actionViewModel));
                        break;
                    case 'phaseEnd':
                        phase.phaseEndActions.push(Bitponics.pages.growplans.compileActionViewModelToServerModel(actionViewModel));
                        break;
                }
            });

            delete phase.actionsViewModel;
        });
        return growPlan;             
    },


    /**
     * Convert Action ViewModel back to server model
     *
     * Converts the following viewModel properties back to server model format:
     * action.scheduleType (string) : 'phaseStart' || 'phaseEnd' || 'repeat'
     * action.isDailyControlCycle (boolean)
     * action.dailyOnTime (set if isDailyControlCycle)
     * action.dailyOffTime (set if isDailyControlCycle)
     * action.message (set if a no-control action)
     * action.offsetTimeOfDay (set if a repeating action with an offset)
     * action.overallDuration
     * action.overallDurationType (months||weeks||days||hours||minutes||seconds)
     *
     * 
     */
    compileActionViewModelToServerModel: function (action){
        var ACCESSORY_ON = Bitponics.Utils.accessoryValues.ON,
            ACCESSORY_OFF = Bitponics.Utils.accessoryValues.OFF,
            dailyOnTimeAsMilliseconds,
            dailyOffTimeAssMilliseconds;
        if (action.scheduleType === 'repeat'){
            action.cycle.repeat = true;
            if (action.control) {
                // Non-daily control cycles need no special treatment...the Angular data-binding
                // sets the correct properties straight-away
                if (action.isDailyControlCycle) {
                    action.cycle.states = [];
                    if (action.dailyOnTime < action.dailyOffTime){
                        action.cycle.states.push({
                            controlValue : ACCESSORY_OFF,
                            durationType : 'hours',
                            duration : moment.duration(action.dailyOnTime).asHours()
                        });
                        action.cycle.states.push({
                            controlValue : ACCESSORY_ON,
                            durationType : 'hours',
                            duration : moment.duration(action.dailyOffTime - action.dailyOnTime).asHours()
                        });
                        action.cycle.states.push({
                            controlValue : ACCESSORY_OFF,
                            durationType : 'hours',
                            duration : (24 - moment.duration(action.dailyOffTime).asHours())
                        });
                    } else {
                        action.cycle.states.push({
                            controlValue : ACCESSORY_ON,
                            durationType : 'hours',
                            duration : moment.duration(action.dailyOffTime).asHours()
                        });
                        action.cycle.states.push({
                            controlValue : ACCESSORY_OFF,
                            durationType : 'hours',
                            duration : moment.duration(action.dailyOnTime - action.dailyOffTime).asHours()
                        });
                        action.cycle.states.push({
                            controlValue : ACCESSORY_ON,
                            durationType : 'hours',
                            duration : (24 - moment.duration(action.dailyOnTime).asHours())
                        });
                    }
                }
            } else {
                // action does not have a control
                action.cycle.states = [];
                var overallDurationAsMoment = moment.duration(action.overallDuration, action.overallDurationType),
                    lastStateDurationType = action.overallDurationType,
                    lastStateDuration = action.overallDuration,
                    lastStateDurationAsMilliseconds,
                    lastStateDurationObject;
                
                if (action.overallDurationType === 'days' && action.offsetTimeOfDay){
                    action.cycle.states.push({
                        durationType : 'hours',
                        duration: moment.duration(action.offsetTimeOfDay).asHours()
                    });

                    lastStateDurationAsMilliseconds = (moment.duration(lastStateDuration, lastStateDurationType).asMilliseconds() - moment.duration(action.offsetTimeOfDay).asMilliseconds());
                    lastStateDurationObject = Bitponics.Utils.getLargestWholeNumberDurationObject(lastStateDurationAsMilliseconds);
                    lastStateDurationType = lastStateDurationObject.durationType;
                    lastStateDuration = lastStateDurationObject.duration;
                }

                action.cycle.states.push({
                    message: action.message
                });
                
                overallDurationAsMoment
                action.cycle.states.push({
                    durationType : lastStateDurationType,
                    duration : lastStateDuration
                });
            }
        }

        delete action.scheduleType;
        delete action.isDailyControlCycle;
        delete action.dailyOnTime;
        delete action.dailyOffTime;
        delete action.message;
        delete action.offsetTimeOfDay;
        delete action.overallDuration;
        delete action.overallDurationType;

        return action;
    }
};

$(function () {
    Bitponics.pages.growplans.init();
});

