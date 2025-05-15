const bedroomData = require("./bedroomProducts");
const diningData = require("./diningProducts");
const livingData = require("./livingProducts");
const featuredProducts = require("./featuredProducts");
const allProducts = {
  bedroom: bedroomData,
  dining: diningData,
  living: livingData,
  feature: featuredProducts,
};

module.exports = allProducts;
