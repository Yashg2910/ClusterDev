const cron = require("node-cron");
const deviceModel = require("../db/models");
const { parse } = require('json2csv');
const fields = ['google_id', 'package_name', 'package_installed_at', 'client_ip', 'createdAt'];
const opts = { fields };
var moment = require('moment');
const {writeFile} = require('fs').promises;


const dumpsCron = {
  startService() {
    setTimeout(dumpData, 1000);
    cron.schedule('30 0 * * *', dumpData);
  }
}

async function dumpData() {
  const todayStartDate = moment().startOf('day');
  const yesterdayStartDate = moment().add(1, 'day').startOf('day');

  const devices = await deviceModel.find({createdAt: {$gte: todayStartDate.toISOString(), $lt: yesterdayStartDate.toISOString()}});
  try {
    const csv = parse(devices, opts);
    await writeCSV(`${yesterdayStartDate.format("DD-MM-YYYY")} - ${todayStartDate.format("DD-MM-YYYY")} devices data.csv`, csv);
    await deviceModel.deleteMany({createdAt: {$gte: todayStartDate.toISOString(), $lt: yesterdayStartDate.toISOString()}});
  } catch (err) {
    console.error(err);
  }
}

async function writeCSV(fileName, data){
  	await writeFile(`dump/${fileName}`, data, 'utf8');
    console.log("CSV File created", fileName);
}

module.exports = dumpsCron;