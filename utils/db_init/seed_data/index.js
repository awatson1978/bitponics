var data = {


	users: [
		{
			email : "jack.bishop1@gmail.com",
		  	name : "Jack Bishop",
		  	locale: "en_US",
		  	active : true,
		  	admin :  true,
		  	activationToken : "1234567890",
		  	sentEmail : false
		},
		{
			email : "jack@bitponics.com",
		  	name : "Jack Bishop",
		  	locale: "en_US",
		  	active : true,
		  	admin :  true,
		  	activationToken : "12345678900",
		  	sentEmail : true
		},
	],


	sensors: [
		{
			name : "pH",
			unit: "pH",
			code: "ph"
		},
		{
			name: "Electrical Conductivity",
			abbrev: "EC",
			unit: "Microsiemens", //=> µs
			code: "ec"
		},
		{
			name: "Total Dissolved Solids",
			abbrev: "TDS",
			unit: "parts per million",
			code: "tds"
		},
		{	name: "Salinity",
			abbrev: "SAL",
			unit: "percentage",
			code: "sal"
		}, 
		{
			name: "Air Temperature",
			unit: "celsius",
			code: "air"
		},
		{
			name: "Water Temperature",
			unit: "celsius",
			code: "water"
		},
		{
			name: "Humidity",
			unit: "percentage",
			code: "hum"
		},
		{
			name: "Carbon Dioxide",
			abbrev: "CO2",
			unit: "parts per million",
			code: "co2"
		},
		{
			name: "Lux",
			abbrev: "Lux",
			unit: "Lumens",
			code: "lux"
		},
		{
			name: "Infrared",
			abbrev: "IR",
			unit: "Lumens",
			code: "ir"
		},
		{
			name: "Full Light",
			unit: "Lumens",
			code: "full"
		},
		{
			name: "Visible Light",
			unit: "Lumens",
			code: "vis"
		}
	],


	controls: [
		{
			name: "Water Pump"
		},
		{
			name: "Humidifier"
		},
		{
			name: "Heater"
		},
		{
			name: "Fan"
		},
		{
			name: "Air Conditioner"
		},
		{
			name: "Light"
		}
	],


	nutrients: [
		{
			brand: "Humbolt Nutrients",
			name: "Grow"
		},
		{
			brand: "Humbolt Nutrients",
			name: "Bloom"
		},
		{
			brand: "Humbolt Nutrients",
			name: "Micro"
		},
	],


	deviceTypes: [
		{
			name: "Bitponics Beta Device 1",
			firmwareVersion: "0.1",
			microprocessor: "blah",
			sensorMap: [
				{ 
					outletId: "ph",
					sensor: "savedObjectIds['sensors']['ph']" // ref to pH Sensor instance"s ObjectId
				},
				{	outletId: "ec",
					sensor:	"savedObjectIds['sensors']['ec']"
				},
				{
					outletId: "tds",
					sensor: "savedObjectIds['sensors']['tds']"
				},
				{
					outletId: "sal",
					sensor: "savedObjectIds['sensors']['sal']"
				},
				{
					outletId: "air",
					sensor: "savedObjectIds['sensors']['air']"
				},
				{
					outletId: "water",
					sensor: "savedObjectIds['sensors']['water']"
				},
				{
					outletId: "hum",
					sensor: "savedObjectIds['sensors']['hum']"
				},
				{
					outletId: "co2",
					sensor: "savedObjectIds['sensors']['co2']"
				},
				{
					outletId: "lux",
					sensor: "savedObjectIds['sensors']['lux']"
				},
				{
					outletId: "ir",
					sensor: "savedObjectIds['sensors']['ir']"
				},
				{	
					outletId: "full",
					sensor: "savedObjectIds['sensors']['full']"
				},
				{
					outletId: "vis",
					sensor: "savedObjectIds['sensors']['vis']"
				}
			]
		}
	],

	devices: [
		{
			id: "1234567890", //mac address
			deviceType: "savedObjectIds['deviceTypes']['Bitponics Beta Device 1']",
			name : "Bitponics Device 1",
			users : ["savedObjectIds['users']['jack@bitponics.com']"],
			// sensorMap : [
		 //      { 
			//     sensor : { type: ObjectId, ref: 'Sensor' },
			//     outletId : { type: String }
			//   }
			// ],
			controlMap : [ 
			  {
			    control : "savedObjectIds['control']['Fan']",
			    outletId : "0"
			  },
			  {
			    control : "savedObjectIds['control']['Humidifier']",
			    outletId : "1"
			  }
			]
		}
	],

	lights: [
		{
			type: "fluorescent",
			watts: 40,
			brand : "lights.com",
			name : "fluorescent"
		},
		{
			type: "compact fluorescent",
			watts: 40,
			brand : "lights.com",
			name : "compact fluorescent"
		},
		{
			type: "metal halide",
			watts: 250,
			brand : "lights.com",
			name : "metal halide"
		},
		{
			type: "high pressure sodium (HPS)",
			watts: 300,
			brand : "lights.com",
			name : "high pressure sodium (HPS)"
		},
		{
			type: "LED",
			watts: 10,
			brand : "lights.com",
			name : "LED"
		},
		{
			type: "LED",
			watts: 10,
			brand : "lights.com",
			name : "LED"
		}
	],


	growSystems: [
		{
			name: "Drip",
			description: "Drip system.",
			type: "deep water culture (DWC)",
			reservoirSize: 5, //gallons?
			numberOfPlants: 6
		},
		{
			name: "ebb & flow",
			description: "ebb & flow system.",
			type: "ebb & flow",
			reservoirSize: 5,
			numberOfPlants: 6
		},
		{
			name: "aquaponics",
			description: "aquaponics system.",
			type: "aquaponics",
			reservoirSize: 90,
			numberOfPlants: 10
		},
		{
			name: "deep water culture (DWC)",
			description: "deep water culture (DWC) system.",
			type: "deep water culture (DWC)",
			reservoirSize: 5,
			numberOfPlants: 6
		}
	],


	actions: [
		{
			description: "Transplant seedlings into the grow bed",
			controlMessage: undefined,
			startTime: 0, // trigger as soon as the phase starts
			recurrence: undefined,
			cycle: undefined
		},
		{
			description: "Flush and refill reservoir. Discard any solution in the reservoir, rinse the entire system with water. Then refill the reservoir to capacity with water. Mix in ¼ cup Grow nutrient, then ¼ cup Bloom nutrient, then ¼ cup Micro nutrient.",
			controlMessage: undefined,
			startTime: 0, // trigger as soon as the phase starts
			cycle: undefined,
			recurrence: {
				repeatType: "Weekly",
				frequency: 4,
				numberOfTimes: undefined  // undefined for infinite recurrence
			}
		}, // end flush Action
		{
			description: "Water pump cycle",
			control: "savedObjectIds['controls']['Water Pump']", // reference to Pump control
			startTime: 0,
			cycle: {
				states: [
					{
						controlValue: 1,
						duration: 900000, // 15 min in milliseconds
						message: "Turn pump on for 15 minutes"
					},
					{
						controlValue: 0,
						duration: 900000, // 15 min in millisecond
						message: "Turn pump off for 15 minutes"
					}
				],
				stopAfterRepetitionCount : undefined
			},
			recurrence: undefined	
		}, // end "Water pump cycle" action	
		{
			description: "Turn light on",
			controlMessage: {
				controlReference : "savedObjectIds['lights']['fluorescent']",
				valueToSend: 255
			},
			startTime: 21600000, //6 hours
			recurrence: {
				repeatType: "Daily",
				frequency: 1,
				numOfTimes: undefined  // undefined for infinite recurrence
			}	
		}, // end "Turn light on." action	
		{
			description: "Turn light off",
			controlMessage: {
				controlReference : "savedObjectIds['lights']['fluorescent']",
				valueToSend: 0
			},
			startTime: 72000000, //20 hours
			recurrence: {
				repeatType: "Daily",
				frequency: 1,
				numOfTimes: undefined  // undefined for infinite recurrence
			}
		}, // end "Turn light off" action
		{
			description: "Light levels have dropped. Turn on supplemental lighting.",
			controlMessage: {
				controlReference: "savedObjectIds['lights']['fluorescent']",
				valueToSend: 255
			}
		},
		{
			description: "Light levels above recommendations. Turn off any supplemental lights.",
			controlMessage: {
				controlReference: "savedObjectIds['lights']['fluorescent']",
				valueToSend: 0
			}
		},
		{
			description: "Air temperature is too high. Turn on air conditioner.",
			controlMessage: {
				controlReference: "savedObjectIds['controls']['Air Conditioner']",
				valueToSend: 255
			}
		},
		{
			description: "Air temperature is too low. Turn on heater.",
			controlMessage: {
				controlReference: "savedObjectIds['controls']['Heater']",
				valueToSend: 255
			}
		},
		{
			message: "Pollinate any new blossoms using a watercolor brush to distribute",
			controlMessage: undefined,
			startTime: 0, // trigger as soon as the phase starts
			recurrence: {
				repeatType: "Weekly",
				frequency: 2,
				numberOfTimes: undefined  // undefined for infinite recurrence
			},
			cycle: undefined
		}

	],


	idealRanges: [
		{
			name: "Ideal Light - Vegetative",
			sensor: "savedObjectIds['lights']['fluorescent']",
			valueRange: {
				min: 2000,
				max: 10000
			},
			applicableTimeSpan: {
				startTime: 21600000, //6am
				endTime: 64800000 //10pm
			},
			actionBelowMin : "savedObjectIds['actions']['Light levels have dropped. Turn on supplemental lighting.']",
			actionAboveMax : "savedObjectIds['actions']['Light levels above recommendations. Turn off any supplemental lights.']"
		},
		{
			name: "Ideal Light - Bloom",
			sensor: "savedObjectIds['lights']['fluorescent']",
			valueRange: {
				min: 2000,
				max: 10000
			},
			applicableTimeSpan: {
				startTime: 28800000, //8am
				endTime: 72000000 //8pm
			},
			actionBelowMin : "savedObjectIds['actions']['Light levels have dropped. Turn on supplemental lighting.']",
			actionAboveMax : "savedObjectIds['actions']['Light levels above recommendations. Turn off any supplemental lights.']"
		},
		{
			name: "Ideal Air Temp",
			sensor: "savedObjectIds['sensors']['air']",
			valueRange: {
				min: 30,
				max: 60
			},
			actionBelowMin : "savedObjectIds['actions']['Air temperature is too low. Turn on heater.']",
			actionAboveMax : "savedObjectIds['actions']['Air temperature is too high. Turn on air conditioner.']"
		}
	],


	phases: [
		{
			name : 'Vegetative',
			description: 'Open-ended vegetative phase. Bring in any existing plants or seedlings with their first pair of true leaves.',
			expectedTimeSpan: undefined,
			lightingType: "savedObjectIds['lights']['metal halide']",
			actions: [
				"savedObjectIds['actions']['Transplant seedlings into the grow bed']",
				"savedObjectIds['actions']['Flush and refill reservoir. Discard any solution in the reservoir, rinse the entire system with water. Then refill the reservoir to capacity with water. Mix in ¼ cup Grow nutrient, then ¼ cup Bloom nutrient, then ¼ cup Micro nutrient.']",
				"savedObjectIds['actions']['Water pump cycle']",
				"savedObjectIds['actions']['Turn light on']",
				"savedObjectIds['actions']['Turn light off']"
			],
			idealRanges: [
				"savedObjectIds['idealRanges']['Ideal Light - Vegetative']",
				"savedObjectIds['idealRanges']['Ideal Air Temp']"
			]
		},
		{
			name : "Blooming",
			description: "Open-ended booming phase. After about 70 days, you should begin to see blossoms.",
			expectedTimeSpan: undefined,
			lightingType: "savedObjectIds['lights']['metal halide']",
			actions: [
				"savedObjectIds['actions']['Pollinate any new blossoms using a watercolor brush to distribute']",
				"savedObjectIds['actions']['Flush and refill reservoir. Discard any solution in the reservoir, rinse the entire system with water. Then refill the reservoir to capacity with water. Mix in ¼ cup Grow nutrient, then ¼ cup Bloom nutrient, then ¼ cup Micro nutrient.']",
				"savedObjectIds['actions']['Water pump cycle']",
				"savedObjectIds['actions']['Turn light on']",
				"savedObjectIds['actions']['Turn light off']"
			],
			idealRanges: [
				"savedObjectIds['idealRanges']['Ideal Light - Bloom']",
				"savedObjectIds['idealRanges']['Ideal Air Temp']"
			]
		},
		{
			name : "Fruiting",
			description: "Fruiting phase. Continue to pollinate blossoms and harvest fruit when fully ripened (red).",
			expectedTimeSpan: undefined,
			lightingType: "savedObjectIds['lights']['compact fluorescent']",
			actions: [
				"savedObjectIds['actions']['Flush and refill reservoir. Discard any solution in the reservoir, rinse the entire system with water. Then refill the reservoir to capacity with water. Mix in ¼ cup Grow nutrient, then ¼ cup Bloom nutrient, then ¼ cup Micro nutrient.']",
				"savedObjectIds['actions']['Water pump cycle']",
				"savedObjectIds['actions']['Turn light on']",
				"savedObjectIds['actions']['Turn light off']"
			],
			idealRanges: [
				"savedObjectIds['idealRanges']['Ideal Light - Bloom']",
				"savedObjectIds['idealRanges']['Ideal Air Temp']"
			]
		}
	],

	growPlans: [
		{
			//parentGrowPlanId: { type: ObjectId, ref: 'GrowPlan' },
			createdByUserId: "savedObjectIds['users']['jack@bitponics.com']",
			name: "Tomato",
			description: "Growing indeterminate organic tomatoes (Redfield Beauty OG) for year round fruiting. Growing in a 3’x3’ grow bed filled with 4\" of hydroton.",
			plants: ["tomatoes"],
			expertiseLevel: "intermediate",
			growSystem: "savedObjectIds['growSystems']['Drip']",
			growMedium: "hydroton",
			nutrients: [
				"savedObjectIds['nutrients']['Grow']",
				"savedObjectIds['nutrients']['Bloom']",
				"savedObjectIds['nutrients']['Micro']"
			],
			sensors: [
				"savedObjectIds['sensors']['ph']",
				"savedObjectIds['sensors']['air']",
				"savedObjectIds['sensors']['water']",
				"savedObjectIds['sensors']['ec']",
				"savedObjectIds['sensors']['humidity']"
			],
			controls: [
				"savedObjectIds['controls']['Light']"
			],
			phases: [
				"savedObjectIds['phases']['Vegetative']",
				"savedObjectIds['phases']['Blooming']",
				"savedObjectIds['phases']['Fruiting']"
			]
		}
	],


	growPlanInstances: [
		{
			users : [
				"savedObjectIds['users']['jack@bitponics.com']"
			],
			growPlan : "savedObjectIds['growPlans']['Tomato']",
			device : "savedObjectIds['devices']['1234567890']", //TODO: bitponics device
			startDate: 1347364818821, // 09/11/2012
			endDate: 1351742400000, // 11/01/2012
		    active: true,
			phases: [
				{
					phase: "savedObjectIds['phases']['Vegetative']",
					startDate: 1347364818821, // 09/11/2012
					endDate: 1351742400000, // 11/01/2012
					active: true
				},
				{
					phase: "savedObjectIds['phases']['Blooming']",
					startDate: 1351828800000, // 11/02/2012
					endDate: 1357016400000, // 01/01/2013
					active: false
				},
				{
					phase: "savedObjectIds['phases']['Fruiting']",
					startDate: 1357102800000, // 01/02/2013
					endDate: 1362200400000, // 03/01/2013
					active: false
				}
			],
			sensorLogs: [
				{
					sensor: "savedObjectIds['sensors']['ph']",
					value: 6.25
				},
				{
					sensor: "savedObjectIds['sensors']['ph']",
					value: 7.25
				},
				{
					sensor: "savedObjectIds['sensors']['ph']",
					value: 8.25
				},
				{
					sensor: "savedObjectIds['sensors']['ph']",
					value: 6.25
				},
				{
					sensor: "savedObjectIds['sensors']['ph']",
					value: 6.25
				},
				{
					sensor: "savedObjectIds['sensors']['air']",
					value: 30
				},
				{
					sensor: "savedObjectIds['sensors']['air']",
					value: 35
				},
				{
					sensor: "savedObjectIds['sensors']['water']",
					value: 25
				}
			],
			controlLogs: [
				{
					control: "savedObjectIds['controls']['Fan']",
					value: 0
				},
				{
					control: "savedObjectIds['controls']['Fan']",
					value: 1
				},
				{
					control: "savedObjectIds['controls']['Fan']",
					value: 0
				}
			],
			photoLogs: [
				{
					url: "http://cityexile.files.wordpress.com/2009/04/tomato_seedling1.jpg",
					tags: ["tomato, seedling, grow"]
				},
				{
					url: "http://blog.japantimes.co.jp/japan-pulse/files/2012/08/tomato1.jpg",
					tags: ["tomato, fruiting"]
				}
			],
			genericLogs: [
				{
					entry: "Tomatoes are awesome.",
					tags: ["awesome"],
					logType: ""
				}
			]
		}
	]

}

module.exports = data;