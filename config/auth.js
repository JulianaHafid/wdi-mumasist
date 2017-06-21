// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '243826342776089', // your App ID
        'clientSecret'    : 'ac34d373fbf01b39581693cd26243da7', // your App Secret
        'callbackURL'     : 'http://localhost:3000/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

    },

    'googleAuth' : {
        'clientID'         : '243994486842-71qquf7oqt27f2ar8vrj17io5dk3c1a3.apps.googleusercontent.com',
        'clientSecret'     : 'SvfbjwWrnxqtUC92XOf9KulS',
        'callbackURL'      : 'http://localhost:3000/auth/google/callback'
    }

};
