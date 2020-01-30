const dotenv = require("dotenv");

// require and configure dotenv, will load vars in .env in PROCESS.ENV
if (process.env.NODE_STAGE !== "production") {
  dotenv.config();
}

const config = {
  staging: { GRAPHQL_URL: process.env.REACT_APP_STAGING_GRAPHQL_URL },
  production: {
    GRAPHQL_URL: process.env.REACT_APP_PRODUCTION_GRAPHQL_URL
  },
  slackUrl: process.env.REACT_APP_SLACK_URL
};

const flattenedConfig = {
  ...config,
  ...config[process.env.REACT_APP_STAGE]
};

export default flattenedConfig;
