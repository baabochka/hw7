var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "zaqsca",
  database: "hw7",
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
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
  let club = req.query.club;
  let pos = req.query.pos;
  let max_assists = 0;
  let player = 0;
  let avg_assists = 0;
  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM assists", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
  res.json({ club: club, pos: pos, max_assists: max_assists, player: player, avg_assists: avg_assists});
});


module.exports = router;
