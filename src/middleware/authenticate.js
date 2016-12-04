import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { getByAuthenticationDetails as getUserByAuthenticationDetails } from '../components/user/user-controller';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: process.env.CSBLOGS_JWT_SECRET
};

passport.use('jwt', new JwtStrategy(options, (jwtPayload, done) => {
  const authenticationProvider = jwtPayload.authenticationProvider;
  const authenticationId = jwtPayload.authenticationId;

  getUserByAuthenticationDetails(authenticationProvider, authenticationId)
    .then(user => {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
    .catch(error => {
      done(error, false);
    });
}));

passport.use('jwt-unregistered', new JwtStrategy(options, (jwtPayload, done) => {
  done(null, jwtPayload);
}));

export const authenticate = passport.authenticate('jwt', { session: false });
export const authenticateUnregistered = passport.authenticate('jwt-unregistered', { session: false });
