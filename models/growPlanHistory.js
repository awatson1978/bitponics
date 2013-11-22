/**
 * A means of storing past revisions of individial Grow Plans. 
 * Not in active use anywhere in the UI.
 */

 var mongoose = require('mongoose'),
	mongooseTypes = require('mongoose-types'),
	mongoosePlugins = require('../lib/mongoose-plugins'),
	useTimestamps = mongoosePlugins.useTimestamps,
	Schema = mongoose.Schema,
	ObjectIdSchema = Schema.ObjectId,
  ObjectId = mongoose.Types.ObjectId,
	async = require('async'),
  ModelUtils = require('./utils'),
	getObjectId = ModelUtils.getObjectId,
  mongooseConnection = require('../config/mongoose-connection').defaultConnection;
  

var GrowPlanHistoryModel,
	
GrowPlanHistorySchema = new Schema({

	/**
   * The GrowPlan from which this GrowPlan was branched and customized
   */
  growPlanId: { type: ObjectIdSchema, ref: 'GrowPlan' },
	

  /**
   * JSON dump of fully-populated Grow Plan
   */
  growPlanObject : Schema.Types.Mixed


},
{ id : false });

GrowPlanHistorySchema.plugin(useTimestamps);


GrowPlanHistoryModel = mongooseConnection.model('GrowPlanHistory', GrowPlanHistorySchema);
exports.schema = GrowPlanHistorySchema;
exports.model = GrowPlanHistoryModel;