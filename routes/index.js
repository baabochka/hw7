var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "zaqsca",
  database: "hw7"
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

  con.connect(function(err) {
    if (err) throw err;
    var sql = 'SELECT as1.club, as1.pos, as1.player, as1.a, as1.gs ' +
        'FROM assists as1 WHERE club = ? AND pos = ? AND ' +
        'a = (select max(a) from assists as2 where as1.club = as2.club)';
    con.query(sql, [club,pos],function (err, result, fields) {
      if (err) throw err;
      console.log('>> result: ', result );
      var string=JSON.stringify(result);
      console.log('>> string: ', string );
      var json =  JSON.parse(string);
      console.log('>> json: ', json);
      console.log('>> player: ', json[0].player);

      console.log(result);
    });
  });
  res.json({ club: club, pos: pos, max_assists: max_assists, player: player, avg_assists: avg_assists});
});


module.exports = router;
