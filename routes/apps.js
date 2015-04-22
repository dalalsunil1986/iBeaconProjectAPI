var express = require('express');
var router = express.Router();
var crypto = require('crypto');

function getBucket(req) {
  return req.cluster.openBucket("application")
}

// get application by key
router.get('/detail/:key', function(req, res) {
  getBucket(req).get(req.params.key, function(err, result) {
    if(result != null) {
      res.send(result.value);
    } else {
      res.send({});
    }
  });
});

// list applications
router.get('/list', function(req, res) {
  var limit = req.params.limit == null ? 20 : req.params.limit;
  var skip = req.params.page == null ? 0 : req.params.limit * (req.params.page - 1);
  var query = req.ViewQuery.from('dev_application', 'by_id').skip(skip).limit(limit);
  getBucket(req).query(query, function (err, results) {
    var resultArray = []
    if (err == null) {
      results.forEach(function (item) {
        resultArray.push(item.value)
      })
    }
    res.send(resultArray)
  });
});

// delete application by key
router.delete('/:key', function(req, res) {
  getBucket(req).remove(req.params.key, function(err, result) {
    res.send(200);
  });
});

// create or update an application
router.put('/register', function(req, res) {
  // increment the sequence and save the app
  var id = req.params.id
  if(id == null) { // if we don't have an id create one using name, type and timestamp
        console.log(req.param.name + req.param.appType + new Date().getTime);
    id = crypto.createHash('md5').update(req.param.name + req.param.appType + new Date().getTime()).digest('hex');
    console.log(id);
  }
  req.body.id = id // update id
  getBucket(req).upsert(id, req.body, function(err, meta) {
    if(err == null) {
      res.send(201);
    } else {
      console.log(err)
      res.send('{error : "An error occured"}')
    }
  });
});

module.exports = router;
