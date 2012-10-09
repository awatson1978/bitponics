var ObjectId = mongoose = require('mongoose').Schema.ObjectId;

module.exports = [
		{
			_id : '506de30b8eebf7524342cb6d',
			sCode: "full",
			valueRange: {
				min: 2000,
				max: 10000
			},
			applicableTimeSpan: {
				startTime: 21600000, //6am
				endTime: 64800000 //10pm
			},
			actionBelowMin : "506de2fb8eebf7524342cb28",
			actionAboveMax : "506de2fb8eebf7524342cb29"
		},
		{
			_id : '506de30b8eebf7524342cb6e',
			sCode: "full",
			valueRange: {
				min: 2000,
				max: 10000
			},
			applicableTimeSpan: {
				startTime: 28800000, //8am
				endTime: 72000000 //8pm
			},
			actionBelowMin : "506de2fb8eebf7524342cb28",
			actionAboveMax : "506de2fb8eebf7524342cb29"
		},
		{
			_id : '506de30b8eebf7524342cb6f',
			sCode: "air",
			valueRange: {
				min: 30,
				max: 60
			},
			actionBelowMin : "506de2fc8eebf7524342cb2b",
			actionAboveMax : "506de2fb8eebf7524342cb2a"
		},
		{
			// Water temperature for "All-Purpose Seedling" phase
			_id : '506de30c8eebf7524342cb71',
			sCode: "water",
			valueRange: {
				min: 18.33, // 65 fahrenheit
				max: 21.11 // 70 fahrenheit
			},
			actionBelowMin : "506de30c8eebf7524342cb73",
			actionAboveMax : "506de30d8eebf7524342cb75"
		},
		{
			// Air temp for "All-Purpose Seedling" phase
			_id : '506de30d8eebf7524342cb76',
			sCode: "air",
			valueRange: {
				min: 12.77, // 55 fahrenheit
				max: 21.11 // 70 fahrenheit
			},
			actionBelowMin : "506de2fc8eebf7524342cb2b",
			actionAboveMax : "506de2fb8eebf7524342cb2a"
		},
	];