import session from "express-session";

const SESSION_SECRET = process.env.SESSION_SECRET || "badkey";

const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30,
  },
});

export default sessionMiddleware;
