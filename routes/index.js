
var Service    = require('../models/service');
module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.pug');
    });



    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// Seek-Help Form  ==================================================
// =============================================================================
  // PROFILE SECTION =========================
  app.get('/services', isLoggedIn, function(req, res) {
      res.render('services.pug', {
        user : req.user
    });
});


// =============================================================================
// Seek-Help Form  ==================================================
// =============================================================================

    //Seek-Help form =========================
    app.get('/seekhelp', isLoggedIn, function(req, res) {
        console.log('test');
        res.render('seekhelp.pug', {
            user : req.user
        });
    });

    app.post('/seekhelp', function (req, res) {

        const name = req.body.name;
        const comments = req.body.comments;
        const subject = req.body.subject;
        const servicelist_household = req.body.cb_household;
        const servicelist_market = req.body.cb_market;
        const servicelist_elderly = req.body.cb_elderly;
        const servicelist_babysit = req.body.cb_babysit;
        const servicelist = [];
        if(servicelist_household)
        {
          servicelist.push("household chores")
        }
        if(servicelist_babysit)
        {
          servicelist.push("babysit")
        }
        if(servicelist_elderly)
        {
          servicelist.push("elderly care")
        }
        if(servicelist_market)
        {
          servicelist.push("marketing")
        }
        console.log("services: " + servicelist);
        const service = new Service({
          name: name,
          subject: subject,
          comments: comments,
          servicelist: servicelist

      });

      service.save((err, service) => {

        if(err){
          console.log(err);
          res.render('seekhelp.pug', {
            title: 'Seek Help'
          });
        }
        res.redirect('/adverts');
      });

    });

    // =============================================================================
    // Adverts Page  ==================================================
    // =============================================================================

        //Seek-Help form =========================

        app.get('/adverts', function(req, res){
          Service.find(function(err, result) {
            //console.log("service here: " + result);
            if (err) return next(err);
            res.render('adverts.pug', {
              data : result
              //servicelist1 : result.servicelist
            })
          });
        });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.pug', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/services', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.pug', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/services', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/services',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // // send to twitter to do the authentication
        // app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));
        //
        // // handle the callback after twitter has authenticated the user
        // app.get('/auth/twitter/callback',
        //     passport.authenticate('twitter', {
        //         successRedirect : '/profile',
        //         failureRedirect : '/'
        //     }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/services',
                failureRedirect : '/'
            }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================
    //
    // // locally --------------------------------
    //     app.get('/connect/local', function(req, res) {
    //         res.render('login-local.pug', { message: req.flash('loginMessage') });
    //     });
    //     app.post('/connect/local', passport.authenticate('local-signup', {
    //         successRedirect : '/profile', // redirect to the secure profile section
    //         failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
    //         failureFlash : true // allow flash messages
    //     }));




    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/services',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // // send to twitter to do the authentication
        // app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));
        //
        // // handle the callback after twitter has authorized the user
        // app.get('/connect/twitter/callback',
        //     passport.authorize('twitter', {
        //         successRedirect : '/profile',
        //         failureRedirect : '/'
        //     }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/services',
                failureRedirect : '/'
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
            res.redirect('/services');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/services');
        });
    });

    // twitter --------------------------------
    // app.get('/unlink/twitter', isLoggedIn, function(req, res) {
    //     var user           = req.user;
    //     user.twitter.token = undefined;
    //     user.save(function(err) {
    //         res.redirect('/profile');
    //     });
    // });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/services');
        });
    });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
