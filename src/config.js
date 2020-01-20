// const dotenv = require('dotenv')

// // require and configure dotenv, will load vars in .env in PROCESS.ENV
// if (process.env.NODE_STAGE !== 'production') {
//   dotenv.config()
// }

const config = {
  staging: { GRAPHQL_URL: process.env.STAGING_GRAPHQL_URL },
  production: {
    GRAPHQL_URL: process.env.PRODUCTION_GRAPHQL_URL
  }
};

const flattenedConfig = {
  ...config,
  ...config[process.env.GATSBY_NODE_STAGE]
};

module.exports.config = flattenedConfig;
module.exports.getEnvVars = () => flattenedConfig;
