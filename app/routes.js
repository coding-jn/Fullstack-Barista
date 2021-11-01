const { ObjectID, ObjectId } = require('bson');

module.exports = function(app, passport, db) {

// normal routes ===============================================================
    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        db.collection('orders').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('form.ejs', {
            user : req.user,
            orders: result,
          })
        })
    });

    // PROFILE SECTION =========================
    app.get('/completed', function(req, res) {
        db.collection('orders').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('completed.ejs', {
            user : req.user,
            orders: result,
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/', (req, res) => {
      db.collection('orders').insertOne({customer: req.body.customer, item: req.body.item, cream: req.body.cream, half: req.body.half, sugar: req.body.sugar, status: 'in progress', barista: null}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        setTimeout(() => {res.redirect('/')}, 500)
      })
    })

    app.put('/', isLoggedIn, (req, res) => { 
        if(req.body.status === 'in progress'){
            db.collection('orders').
            findOneAndUpdate({_id: ObjectId(req.body.id)},        
                {
                $set: {
                    status: 'completed',
                    barista: req.body.barista
                }
              }, (err, result) => {
                if (err) return res.send(err)
                res.send(result)
            })  
        } else if(req.body.status === 'completed'){
            db.collection('orders').
            findOneAndUpdate({_id: ObjectId(req.body.id)},        
                {
                $set: {
                    status: 'picked up',
                }
              }, (err, result) => {
                if (err) return res.send(err)
                res.send(result)
            })  
        } else{
            db.collection('orders').
            findOneAndUpdate({_id: ObjectId(req.body.id)},        
                {
                $set: {
                    status: 'finished',
                }
              }, (err, result) => {
                if (err) return res.send(err)
                res.send(result)
            })  
        }
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/completed', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/completed', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/orders');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next(null, true);

    res.redirect('/');
}
