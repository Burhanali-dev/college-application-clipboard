module.exports = function (app, passport, db) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });
  app.get('/form', function (req, res) {
    res.render('form.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('options').find(
      // { 'user': req.user.local.email }
    ).toArray((err, result) => {
      if (err) return console.log(err)
      if (result[0]?.user == req.user.local.email) {
        console.log(result)
        res.render('profile.ejs', {
          user: req.user,
          options: result
        })
      } else {
        res.render('profile.ejs', {
          user: req.user,
          options: []
        })
      }
    })
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout(() => {
      console.log('User has logged out!')
    });
    res.redirect('/');
  });

  // message board routes ===============================================================

  app.post('/create', (req, res) => {
    const collection = db.collection('options')
    console.log("Body :", req.body)
    collection.insertMany([{
      name: req.body.name,
      location: req.body.location,
      tuiton: req.body.tuiton,
      compensation: req.body.compensation,
      classsize: req.body.classsize,
      program: req.body.program,
      user: req.user.local.email 
    }])
    console.log('saved to database')
    res.redirect('/profile')
  })

  app.put('/update', (req, res) => {
    db.collection('options')
      .updateOne({ name: req.body.name }, {
        $set: {
          name: req.body.name,
          location: req.body.location,
          tuiton: req.body.tuiton,
          compensation: req.body.compensation,
          classsize: req.body.classsize,
          program: req.body.program,
          user: req.user.local.email 
        }
      }, {
        sort: { _id: -1 },
        upsert: true
      })
    res.send(200)
  })

  app.delete('/delete', (req, res) => {
    db.collection('options').findOneAndDelete({
      name: req.body.name,
      location: req.body.location,
      tuiton: req.body.tuiton,
      compensation: req.body.compensation,
      classsize: req.body.classsize,
      program: req.body.program,
      user: req.user.local.email 
    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
