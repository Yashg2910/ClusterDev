const deviceModel = require("../db/devicesModel");
let ejs = require('ejs');

const packageStatsCtrl = {
  get: async (request, response) => {
    const devices = await deviceModel.aggregate([{
      $group: {
        _id: "$package_name",
        unique_devices: {$count: {}}
      }
    }]);
    response.render("packagesStatsView", {devices})
  }
}

module.exports = packageStatsCtrl;