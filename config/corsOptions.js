const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
  origin: (origin, callback) => {
    // only allowed for website which is listed in "allowedOrigins", not even for postmen as well.
    // if(allowedOrigins.indexOf(origin) !== -1)

    // allowed for listed website in "allowedOrigin" and postmen or any desktop application which will not provide origin, so to allow those application use below.
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), true);
    }
  },
  credential: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
