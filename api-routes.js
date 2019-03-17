var sequelize = require("sequelize");

module.exports = function(app) {
  app.get(function(req, res) {
    products.findALL({ limit: 10 });
  });
};
