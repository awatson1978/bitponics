module.exports = {
	action: require('./action').model,
	control: require('./control').model,
	device: require('./device').model,
	deviceType: require('./deviceType').model,
	gardenPreaggregation: require('./gardenPreaggregation').model,
  growPlan: require('./growPlan').growPlan.model,
  growPlanHistory: require('./growPlanHistory').model,
	growPlanInstance: require('./garden').model,
	growSystem: require('./growSystem').model,
	plant: require('./plant').model,
	lightBulb: require('./lightBulb').model,
	lightFixture: require('./lightFixture').model,
  light: require('./light').model,
	notification: require('./notification').model,
	nutrient: require('./nutrient').model,
	photo : require('./photo').model,
	product: require('./product').model,
  sensor: require('./sensor').model,
	sensorLog: require('./sensorLog').model,
	user: require('./user').model,
	utils : require('./utils')
};
