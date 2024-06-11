import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config()
const FRONTEND=process.env.FRONTEND || 'http://localhost:3030/'
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      fontSrc: [
        "'self'",
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
      ],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
      connectSrc: ["'self'", FRONTEND],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  frameguard: {
    action: "deny",
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: {
    policy: "no-referrer",
  },
  dnsPrefetchControl: {
    allow: false,
  },
  ieNoOpen: true,
  noSniff: true,
  xssFilter: true,
});
