var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var Memcached = require('memcached');
var memcached = new Memcached();

var lifetime = 86400; // 24 hrs

memcached.connect('127.0.0.1:11211', function(err,conn){
  if(err) {
  console.log(conn.server);
  }
});
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "zaqsca",
  database: "hw7"
});
con.connect(function(err) {
  if (err) {
    console.log("Error while connecting to MySQL");
    throw err;
  }

});
var memcachedMiddleware = (duration) => {
    return  (req,res,next) => {
        let key = "__express__" + req.originalUrl || req.url;
        memcached.get(key, function(err,data){
            if(data){
                res.send(data);
                return;
            }else{
                res.sendResponse = res.send;
                res.send = (body) => {
                    memcached.set(key, body, (duration*60), function(err){
                        //
                    });
                    res.sendResponse(body);
                }
                next();
            }
        });
    }
};
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET hw7 page. */
router.get('/hw7', memcachedMiddleware(20), function(req, res, next) {
  var club = req.query.club;
  var pos = req.query.pos
  var max_assists = 0;
  var player = 0;
  var avg_assists = 0;

  var sql = 'SELECT club, pos, player, a, gs  FROM assists WHERE club = ? AND pos = ? ORDER BY a DESC, gs DESC, player ASC';
  con.query(sql, [club,pos],function (err, result, fields) {
    if (err) throw err;
    var string=JSON.stringify(result);
    var json =  JSON.parse(string);
    player = json[0].player;
    max_assists = json[0].a;
    
    var avg = 'SELECT AVG(a) AS avg_a FROM assists WHERE club = ? AND pos = ?';
    con.query(avg, [club,pos],function (err, result, fields) {
      if (err) throw err;
      var string=JSON.stringify(result);
      var json =  JSON.parse(string);
      avg_as = json[0].avg_a;
      
      res.json({ club: club, pos: pos, max_assists: max_assists, player: player, avg_assists: avg_as});
    });
  });

});

router.post('/hw7', function(req, res, next) {
  var club = req.query.club;
  var pos = req.query.pos;
  var max_assists = 0;
  var player = 0;
  var avg_assists = 0;


  var sql = 'SELECT club, pos, player, a, gs, gp FROM assists WHERE club = ? AND pos = ? ORDER BY a DESC, gs DESC, gp DESC limit 1';
  con.query(sql, [club,pos],function (err, result, fields) {
      if (err) throw err;
      console.log('>> result: ', result );
      var string=JSON.stringify(result);
      console.log('>> string: ', string );
      var json =  JSON.parse(string);
      console.log('>> json: ', json);
      console.log('>> player: ', json[0].player);
      console.log('>> player: ', json[0].a);
      player = json[0].player;
      max_assists = json[0].a;
      console.log(result);
      var avg = 'SELECT AVG(a) AS avg_a FROM assists WHERE club = ? AND pos = ?';
        con.query(avg, [club,pos],function (err, result, fields) {
        if (err) throw err;
        console.log('>> AVG result: ', result );
        var string=JSON.stringify(result);
        console.log('>> AVG string: ', string );
        var json =  JSON.parse(string);
        console.log('>> AVG json: ', json);
        console.log('>> AVG? ', json[0].avg_a);
        avg_as = json[0].avg_a;
        console.log(result);
        res.json({ club: club, pos: pos, max_assists: max_assists, player: player, avg_assists: avg_as});
      });
    });


});


module.exports = router;
