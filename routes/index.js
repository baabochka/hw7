var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "zaqsca",
  database: "hw7"
});
con.connect(function(err) {
  if (err) throw err;
  concole.log("Error while connecting to MySQL");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET hw7 page. */
router.get('/hw7', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/hw7', function(req, res, next) {
  var club = req.query.club;
  var pos = req.query.pos;
  var max_assists = 0;
  var player = 0;
  var avg_assists = 0;


  var sql = 'SELECT club, pos, player, a, gs FROM assists WHERE club = ? AND pos = ? ORDER BY a DESC, gs DESC limit 1';
  con.query(sql, [club,pos],function (err, result, fields) {
      if (err) throw err;
      console.log('>> result: ', result );
      var string=JSON.stringify(result);
      console.log('>> string: ', string );
      var json =  JSON.parse(string);
      console.log('>> json: ', json);
      console.log('>> player: ', json[0].player);
      console.log('>> player: ', json[0].a);

      console.log(result);
    });
    var avg = 'SELECT AVG(a) FROM assists WHERE club = ? AND pos = ?';
    con.query(avg, [club,pos],function (err, result, fields) {
      if (err) throw err;
      console.log('>> AVG result: ', result );
      var string=JSON.stringify(result);
      console.log('>> AVG string: ', string );
      var json =  JSON.parse(string);
      console.log('>> AVG json: ', json);
      console.log('>> AVG? ', json[0]);

      console.log(result);
    });
  res.json({ club: club, pos: pos, max_assists: max_assists, player: player, avg_assists: avg});
});


module.exports = router;
