/**
 * Subscriptions to service plans.
 */

var mongoose = require('mongoose'),
  mongooseTypes = require('mongoose-types'),
  Schema = mongoose.Schema,
  ObjectIdSchema = Schema.ObjectId,
  mongoosePlugins = require('../lib/mongoose-plugins'),
  useTimestamps = mongoosePlugins.useTimestamps,
  winston = require('winston'),
  mongooseConnection = require('../config/mongoose-connection').defaultConnection,
  ServicePlanSubscriptionModel,
  ServicePlanSubscriptionSchema;


var ServicePlanSubscriptionSchema = new Schema(
  {
    owner : { type : ObjectIdSchema, ref: "User" },

    servicePlan : { type : String, ref: "Product" },

    order : { type : ObjectIdSchema, ref: "Order" },

    
    /** 
     * Optional to allow for preorders where we activate a subscription at a later date.
     */
    braintreeSubscriptionId : { type : ObjectIdSchema, required: false },

    activatedAt : { type : Date },

    cancelledAt : { type : Date },

    /**
     * Optional
     */
    //activeDevice : { type : String, ref : "Device" },

    activeGarden : { type : ObjectIdSchema, ref : "GrowPlanInstance" },

    gardenActivationHistory : [
      {
        garden : { type : ObjectIdSchema, ref: "GrowPlanInstance" },
        startedAt : { type : Date },
        endedAt : { type : Date }
      }
    ]
  },
  { id : false }
);

ServicePlanSubscriptionSchema.plugin(useTimestamps);
ServicePlanSubscriptionSchema.plugin(mongoosePlugins.recoverableRemove);


ServicePlanSubscriptionSchema.index({ 'owner' : 1 });

exports.schema = ServicePlanSubscriptionSchema;
exports.model = ServicePlanSubscriptionModel = mongooseConnection.model('ServicePlanSubscription', ServicePlanSubscriptionSchema);