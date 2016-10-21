import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { getByAuthenticationDetails as getUserByAuthenticationDetails } from '../components/user/user-controller';

const options = {
};

passport.use(new JwtStrategy(options, (jwtPayload, done) => {
