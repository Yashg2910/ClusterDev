const deviceModel = require("../db/devicesModel");

const devicesCtrl = {
  get: async (request, response) => {
    const devices = await deviceModel.find({});
  
    try {
      response.status(200).send(devices);
    } catch (error) {
      response.status(500).send(error);
    }
  },
  create: async (request, response) => {
    /* For testing purpose, create documents in past.
    const date = new Date();
    date.setDate(date.getDate() - 1);
    request.body.createdAt = date;
    */

    const device = new deviceModel(request.body);
    try {
      await device.save();
      response.status(200).send({"result": "success"});
    } catch (error) {
      response.status(500).send(error);
    }
  }
}

module.exports = devicesCtrl;