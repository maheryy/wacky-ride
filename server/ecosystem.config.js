module.exports = {
  apps: [
    {
      name: "wacky-ride",
      script: "dist/index.js",
      watch: "dist",
      env: {
        PORT: 3000,
        APP_ENV: "production",
      },
    },
  ],
};
