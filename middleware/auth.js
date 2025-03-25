import passport from "passport";

const jwtAuthMiddleware = passport.authenticate("jwt", { session: false });

export default jwtAuthMiddleware;
