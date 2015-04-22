var express = require('express');
var router = express.Router();

function getBucket(req) {
  return req.cluster.openBucket("thread")
}

router.get('/list', function(req, res) {
	var key = req.params.key 
	var limit = req.params.limit == null ? 20 : req.params.limit;
  	var skip = req.params.page == null ? 0 : req.params.limit * (req.params.page - 1);
  	var query = req.ViewQuery.from('dev_thread', 'by_id').skip(skip).limit(limit).key(key);
  	getBucket(req).query(query, function(err, results){
  		var resultArray = []
  		if(err == null) {
  			results.forEach(function(item) {
  				resultArray.push(item.value)
  			})
  		}
  		res.send(resultArray)
  	});
});

router.get('/resolve', function(req, res) {
  getBucket(req).get(req.params.threadId, function(err, result){
    if(result != null) {
        res.send(result.value);
    } else {
      res.send({});
    }
  });
});

module.exports = router;