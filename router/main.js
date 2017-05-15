module.exports = function(app, fs) {
    app.get('/', function(req, res) {
      var sess = req.session;

        res.render('index', {
            title: "My Homepage",
            length: 5,
            id: sess.id,
            name: sess.name
        })
    });

    app.get('/list', function (req, res) {
      fs.readFile(__dirname + "/../data/user.json", 'utf8', function(err, data) {
        console.log(data);
        res.end(data);
      });
    });

    app.get('/getUser/:username', function(req, res) {
      fs.readFile(__dirname + "/../data/user.json", 'utf8', function(err, data) {
        console.log(data);
        var users = JSON.parse(data);
        res.json(users[req.params.username]);
      });
    });

    app.post('/addUser', function(req, res) {
      var result = {};

      if (!req.body["id"] || !req.body["passwd"] || !req.body["name"]) {
        result['stauts'] = 400;
        result['e_msg'] = "Invalid Request";
        res.status(400).json(result);
        return;
      }

      id = req.body['id'];
      pw = req.body['passwd'];
      name = req.body['name'];

      fs.readFile(__dirname + "/../data/user.json", 'utf8', function(err, data) {
        var users = JSON.parse(data);
        if (users[id]) {
          result['stauts'] = 400;
          result['e_msg'] = "Duplicate Found";
          res.status(400).json(result);
          return;
        }

        user = {}
        user['password'] = pw;
        user['name'] = name;

        users[id] = user;

        fs.writeFile(__dirname + "/../data/user.json",
        JSON.stringify(users, null, '\t'), 'utf8', function(err, data) {
          result['status'] = 200;
          result['e_msg'] = "OK"
          res.status(200).json(result);
          return;
        });
      });
    });

    app.put('/updateUser', function(req, res) {
      result = {};

      if (!req.body["id"] || !req.body["passwd"] || !req.body["name"]) {
        result['stauts'] = 400;
        result['e_msg'] = "Invalid Request";
        res.status(400).json(result);
        return;
      }

      id = req.body['id'];
      pw = req.body['passwd'];
      name = req.body['name'];

      fs.readFile(__dirname + '/../data/user.json', 'utf8', function(err, data) {
        users = JSON.parse(data);

        if(!users[id]) {
          result['status'] = 400;
          result['e_msg'] = "No Such User";
          res.status(400).json(result);
          return;
        }

        user = {};
        user['password'] = pw;
        user['name'] = name;

        users[id] = user;

        fs.writeFile(__dirname + "/../data/user.json",
        JSON.stringify(users, null, '\t'), 'utf8', function(err, data) {
          result['status'] = 200;
          result['e_msg'] = "OK"
          res.status(200).json(result);
          return;
        });
      });
    });
    // DELETE /deleteUser / body: {id}
    app.delete('/deleteUser', function(req, res) {
        var result = {};

        if (!req.body["id"]) {
          result['stauts'] = 400;
          result['e_msg'] = "Invalid Request";
          res.status(400).json(result);
          return;
        }

        id = req.body['id'];

        fs.readFile(__dirname + "/../data/user.json", 'utf8', function(err, data) {
          var users = JSON.parse(data);

          if(!users[id]) {
            result['status'] = 400;
            result['e_msg'] = 'No Such User';
            res.status(400).json(result);
            return;
          }

          delete users[id];
          fs.writeFile(__dirname + "/../data/user.json",
          JSON.stringify(users, null, '\t'), 'utf8', function(err, data){
            result['status'] = 200;
            result['e_msg'] = 'OK';
            res.status(200).json(result);
            return;
          });

        });
    });

    app.post('/login', function(req, res) {
      var result = {};

      var sess;
      sess = req.session;

      if (!req.body["id"] || !req.body['passwd']) {
        result['stauts'] = 400;
        result['e_msg'] = "Invalid Request";
        res.status(400).json(result);
        return;
      }

      id = req.body['id'];
      pw = req.body['passwd'];

      fs.readFile(__dirname + '/../data/user.json', 'utf8', function(err, data) {
        var users = JSON.parse(data);

        if(!users[id]) {
          result['status'] = 400;
          result['e_msg'] = 'No Such User';
          res.status(400).json(result);
          return;
        }

        if (users[id]['password'] == pw) {
          sess.id = id;
          sess.name = users[id]['name'];
          res.status(200).redirect('/');
        }

        else {
          result['status'] = 400;
          result['e_msg'] = 'Incorrect Password';
          res.status(400).json(result);
          return;
        }
      });
    });

    app.get('/logout', function(req, res) {
      sess = req.session;

      if(sess.id) {
        req.session.destroy(function(err) {
          if (err) {
            console.log(err);
          }
          else {
            res.status(200).redirect('/');
          }
        });
      }

      else {
        res.status(200).redirect('/');
      }
    })

    app.get('/error', function(req, res) {
      res.status(400).render("about.html");
    })

}
