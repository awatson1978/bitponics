var loggly = {
      subdomain : 'bitponics',
      tokens : {
        local : 'c8593ee1-8a09-426f-acd6-871b70b91fd0',
        development : '5cc07897-f3f8-46ab-aaa1-888f88ae6683',
        production : '437fee23-8d8a-4171-ab17-7e211c176003'
      }  
    },
    mongo = { 
      "hostname": "localhost",
      "port": 27017,
      "username": "", 
      "password": "",
      "name": "",
      "db":"bitponics"
    },
    generateMongoUrl = function(app){
      /*
      obj.hostname = (obj.hostname || 'localhost');
      obj.port = (obj.port || 27017);
      obj.db = (obj.db || 'test');
      console.log('mongodb db is:' + obj.db);

      if(obj.username && obj.password){
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
      } else{
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
      }*/

      var result = process.env.MONGOLAB_URI;

      if (result){
        return result;
      } else {
        switch(app.settings.env){
          case 'local':
            return 'mongodb://admin:1SHar3db1t@ds033097.mongolab.com:33097/bitponics-local';
          case 'development':
            return 'mongodb://admin:1SHar3db1t@ds037597.mongolab.com:37597/bitponics-development';  
          case 'staging':
            return 'mongodb://admin:1SHar3db1t@ds037617.mongolab.com:37617/bitponics-staging';
          case 'production':
            return 'mongodb://admin:1SHar3db1t@ds037587.mongolab.com:37587/bitponics-production';
          // no default. app.settings.env defaults to 'development' if NODE_ENV isn't explicitly set
        }  
      }
  };

/**
 * module.exports : function to be immediately invoked when this file is require()'ed 
 * 
 * @param app : app instance. Will have the configs appended to a .config property. 
 */
module.exports = function(app) {
  //var // on local machine, routing bitponics.com to localhost in order to have external oauth's (goog, fb) route back without complaining 
      //PORT = process.env.PORT || 80, // run node as sudo to use port 80
      //HOST = process.env.HOST || 'bitponics.com', // update host file with the line "127.0.0.1 bitponics.com"

      console.log("ENVIRONMENT VARIABLES");
      console.log(process.env);
      
  app.config = {
    auth : require('./auth-config'),
    css : require('./css-config'),
    appUrl : 'not set yet',
    js : require('./js-config'),
    loggly : loggly,
    mongoUrl : generateMongoUrl(app)
  };

  require('./boot-mongo')(app);
  require('./app-config')(app);
};

