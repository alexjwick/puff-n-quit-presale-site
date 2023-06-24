const path = require("path");

module.exports = {
  entry: "./resources/scripts/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};
