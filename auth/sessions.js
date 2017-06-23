module.exports = function(passport) {
  const mongoose = require('mongoose'),
    User = mongoose.model('User');

  passport.serializeUser(function(profile, done) {
    //console.log('Store the user id:', profile.id, ' and provider:', profile.provider,' in session data store');
    const sessionData = {
      id: profile.id
    };
    done(null, sessionData);
  });

  passport.deserializeUser(function(sessionData, done) {
    //console.log("got session id. found session data : ", sessionData);
    // find user using ID stored in session data store and fill in user details in done
    User.findOne({ id: sessionData.id })
    .then((result) => {
        //console.log("got user data through session data : ", result);
        if(result) {
          done(null, result);
        } else {
          done(null, null);
        }
    })
    .catch((err) => {
      console.log(err);
      done(err);
    });
  });
}
