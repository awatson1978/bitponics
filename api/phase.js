var PhaseModel = require('../models/phase').model;

/**
 * module.exports : function to be immediately invoked when this file is require()'ed 
 * 
 * @param app : app instance. Will have the configs appended to a .config property. 
 */
module.exports = function(app) {

   //List phases
  app.get('/api/phase', function (req, res){
    return PhaseModel.find(function (err, phases) {
      if (!err) {
        return res.send(phases);
      } else {
        return console.log(err);
      }
    });
  });

  /*
   * Create single phase
   *
   *  Test with:
   *  jQuery.post("/api/phase", {
   *    "name": "Bloom",
   *    "expectedNumberOfDays": 25,
   *    "light": "lightid",
   *    "actions": ["actionid1", "actionid2", "actionid3"],
   *    "idealRanges": ["idealRangeid1", "idealRange2"],
   *  }, function (data, textStatus, jqXHR) {
   *    console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
   *  });
   */
  app.post('/api/phase', function (req, res){
    var phase;
    console.log("POST: ");
    console.log(req.body);
    phase = new PhaseModel({
      name: req.body.type,
      expectedNumberOfDays: req.body.expectedNumberOfDays,
      light: req.body.light,
      actions: req.body.actions,
      idealRanges: req.body.idealRanges,
    });
    phase.save(function (err) {
      if (!err) {
        return console.log("created phase");
      } else {
        return console.log(err);
      }
    });
    return res.send(phase);
  });

  /*
   * Read an phase
   *
   * To test:
   * jQuery.get("/api/phase/${id}", function(data, textStatus, jqXHR) {
   *     console.log("Get response:");
   *     console.dir(data);
   *     console.log(textStatus);
   *     console.dir(jqXHR);
   * });
   */
  app.get('/api/phase/:id', function (req, res){
    return PhaseModel.findById(req.params.id, function (err, phase) {
      if (!err) {
        return res.send(phase);
      } else {
        return console.log(err);
      }
    });
  });

  /*
   * Update an phase
   *
   * To test:
   * jQuery.ajax({
   *     url: "/api/phase/${id}",
   *     type: "PUT",
   *     data: {
   *       "actionBelowMin": "actionid"
   *     },
   *     success: function (data, textStatus, jqXHR) {
   *         console.log("Post response:");
   *         console.dir(data);
   *         console.log(textStatus);
   *         console.dir(jqXHR);
   *     }
   * });
   */
  app.put('/api/phase/:id', function (req, res){
    return PhaseModel.findById(req.params.id, function (err, phase) {
      phase.actionBelowMin = req.body.actionBelowMin;
      return phase.save(function (err) {
        if (!err) {
          console.log("updated phase");
        } else {
          console.log(err);
        }
        return res.send(phase);
      });
    });
  });

  /*
   * Delete an phase
   *
   * To test:
   * jQuery.ajax({
   *     url: "/api/phase/${id}", 
   *     type: "DELETE",
   *     success: function (data, textStatus, jqXHR) { 
   *         console.log("Post resposne:"); 
   *         console.dir(data); 
   *         console.log(textStatus); 
   *         console.dir(jqXHR); 
   *     }
   * });
   */
  app.delete('/api/phase/:id', function (req, res){
    return PhaseModel.findById(req.params.id, function (err, phase) {
      return phase.remove(function (err) {
        if (!err) {
          console.log("removed");
          return res.send('');
        } else {
          console.log(err);
        }
      });
    });
  });
};
