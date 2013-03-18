var ObjectIdSchema = require('mongoose').Schema.ObjectId;

module.exports = [
		{
			_id : '506de2fb8eebf7524342cb28',
			description: "Turn lights on",
			control: "506de2fd8eebf7524342cb32",
			cycle: {
				states: [
					{
						controlValue: '1'
					}
				]
			}
		},
		{
			_id : '506de2fb8eebf7524342cb29',
			description: "Turn lights off",
			control: "506de2fd8eebf7524342cb32",
			cycle: {
				states: [
					{
						controlValue: '0'
					}
				]
			}
		},
		{
			_id : '506de2fb8eebf7524342cb2a',
			description: "Turn air conditioner on",
			control: "506de2fd8eebf7524342cb31",
			cycle: {
				states: [
					{
						controlValue: '1'
					}
				]
			}
		},
		{
			_id : '50da4cab0a312499fae453e7',
			description: "Turn air conditioner off",
			control: "506de2fd8eebf7524342cb31",
			cycle: {
				states: [
					{
						controlValue: '0'
					}
				]
			}
		},
		{
			_id : '506de2fc8eebf7524342cb2b',
			description: "Turn heater on",
			control: "506de2fc8eebf7524342cb2f",
			cycle: {
				states: [
					{
						controlValue: '1'
					}
				]
			}
		},
		{
			_id : '50da4f1e0a312499fae453e9',
			description: "Turn heater off",
			control: "506de2fc8eebf7524342cb2f",
			cycle: {
				states: [
					{
						controlValue: '0'
					}
				]
			}
		},

		{
			_id : '50da4f650a312499fae453ea',
			description: "Turn water pump on",
			control: "506de2fc8eebf7524342cb2d",
			cycle: {
				states: [
					{
						controlValue: '1'
					}
				]
			}
		},
		{
			_id : '50da4f660a312499fae453eb',
			description: "Turn water pump off",
			control: "506de2fc8eebf7524342cb2d",
			cycle: {
				states: [
					{
						controlValue: '0'
					}
				]
			}
		},


		{
			_id : '50da532d0a312499fae453ec',
			description: "Turn humidifier on",
			control: "506de2fc8eebf7524342cb2e",
			cycle: {
				states: [
					{
						controlValue: '1'
					}
				]
			}
		},
		{
			_id : '50da532d0a312499fae453ed',
			description: "Turn humidifier off",
			control: "506de2fc8eebf7524342cb2e",
			cycle: {
				states: [
					{
						controlValue: '0'
					}
				]
			}
		},


		{
			_id : '50da53730a312499fae453ee',
			description: "Turn fan on",
			control: "506de2fd8eebf7524342cb30",
			cycle: {
				states: [
					{
						controlValue: '1'
					}
				]
			}
		},
		{
			_id : '50da53740a312499fae453ef',
			description: "Turn fan off",
			control: "506de2fd8eebf7524342cb30",
			cycle: {
				states: [
					{
						controlValue: '0'
					}
				]
			}
		},
		{
			_id : '506de30c8eebf7524342cb73',
			description: "Increase heat under seedlings, either by using a seedling heat mat or moving seedling tray to a warmer area, such as on top of a refrigerator.",
			control: "506de30d8eebf7524342cb74", // seedling heat mat
			cycle: {
				states: [
					{
						controlValue: '1'
					}
				]
			}
		},
		{
			_id : '506de30d8eebf7524342cb75',
			description: "Decrease heat under seedlings, either by turning off seedling heat mat or moving seedling tray to a cooler area.",
			control: "506de30d8eebf7524342cb74", // seedling heat mat
			cycle: {
				states: [
					{
						controlValue: '0'
					}
				]
			}
		},
		{
			_id : '506de2ec8eebf7524342cb24',
			description : "Transplant seedlings into the grow bed"
		},
		{
			_id : '506de3128eebf7524342cb87',
			description : "Water level check",
			cycle : {
				states : [
					{
						durationType: 'hours',
						duration: 8
					},
					{
						message: "Check water level in seed tray. Make sure there's a thin layer at the bottom of the tray to last the seedlings through the day."
					},
					{ 
						durationType : 'hours',
						duration: 16
					}
				],
				repeat : true
			}
		},
		{
			_id : '506de2ef8eebf7524342cb25',
			description: "Reservior refill cycle",
			cycle: {
				states: [
					{
						message: "Flush and refill reservoir. Discard any solution in the reservoir, rinse the entire system with water. Then refill the reservoir to capacity with water. Mix in ¼ cup Grow nutrient, then ¼ cup Bloom nutrient, then ¼ cup Micro nutrient."
					},
					{
						durationType: 'weeks',
						duration: 3
					}
				],
				repeat: true
			}
		}, // end flush Action
		{
			_id : '506de2f08eebf7524342cb26',
			description: "Water pump cycle",
			control: "506de2fc8eebf7524342cb2d", // reference to Pump control
			cycle: {
				states: [
					{
						controlValue: '1',
						durationType: 'minutes',
						duration: 15
					},
					{
						controlValue: '0',
						durationType: 'minutes',
						duration: 15
					}
				],
				repeat: true
			}
		}, // end "Water pump cycle" action	
		{
			_id : '506de2f18eebf7524342cb27',
			description: "Light cycle, with lights on between 6am and 10pm.",
			control: "506de2fd8eebf7524342cb32",
			cycle: {
				states: [
					// start the day with 6 hours off
					{
						controlValue: '0',
						durationType: 'hours',
						duration: 6
					},
					{
						controlValue: '1',
						durationType: 'hours',
						duration: 16
					},
					// finish off the 24 hour day with off
					{
						controlValue: '0',
						durationType: 'hours',
						duration: 2
					}
				],
				repeat: true
			}
		},
		{
			_id : '506de2fc8eebf7524342cb2c',
			description: "Pollinate any new blossoms. Use a small paintbrush or cotton swab brush to distribute pollen between flowers."
		}
	];