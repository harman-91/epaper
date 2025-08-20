module.exports = {
  apps: [
    {
      name: "prod",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        APP_ENV: "production",
        PORT: 3001,
      },
    },
    {
      name: "stg",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        APP_ENV: "stg",
        PORT: 3001,
      },
    },
    {
      name: "dev",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        APP_ENV: "development",
        PORT: 3001,
      },
    },
  ],
};
