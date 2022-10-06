const cron = require("node-cron");
const deviceModel = require("../db/devicesModel");
const dumpsModel = require("../db/dumpsModel");
const { parse } = require('json2csv');
const fields = ['google_id', 'package_name', 'package_installed_at', 'client_ip', 'createdAt'];
const opts = { fields };
var moment = require('moment');
const {writeFile, rm} = require('fs').promises;
const awsApi = require("../api/aws");

const dumpsCron = {
  startService() {
    setTimeout(dumpData, 1000);
    cron.schedule('30 0 * * *', dumpData);

    setTimeout(diskCleanup, 10000);
    cron.schedule('0 22 * * *', diskCleanup);
  }
}

const dumpsBasePath = "dump/";

async function dumpData() {
  const todayStartDate = moment().startOf('day');
  const yesterdayStartDate = moment().subtract(1, 'day').startOf('day');

  const devices = await deviceModel.find({createdAt: {$gte: yesterdayStartDate.toISOString(), $lt: todayStartDate.toISOString()}});
  if (devices.length === 0) return;
  try {
    const csv = parse(devices, opts);
    const filename = `${yesterdayStartDate.format("DD-MM-YYYY")} - ${todayStartDate.format("DD-MM-YYYY")} devices data.csv`;
    await writeCSV(filename, csv);
    await deviceModel.deleteMany({createdAt: {$gte: yesterdayStartDate.toISOString(), $lt: todayStartDate.toISOString()}});
    await (new dumpsModel({filename, dumpDate: new Date(yesterdayStartDate.toISOString())})).save();
    await awsApi.uploadFileFromDump(filename);
  } catch (err) {
    console.error(err);
  }
}

async function writeCSV(filename, data){
  	await writeFile(`${dumpsBasePath}/${filename}`, data, 'utf8');
    console.log("CSV File created", filename);
}

async function diskCleanup() {
  const todayStartDate = moment().startOf('day');
  const yesterdayStartDate = moment().subtract(1, 'day').startOf('day');
  const dumpFile = await dumpsModel.findOne({dumpDate: {$gte: yesterdayStartDate.toISOString(), $lt: todayStartDate.toISOString()}, removed: {$exists: false}}).lean();

  if (!dumpFile) return;

  try {
    rm(`${dumpsBasePath}/${dumpFile.filename}`);
    await dumpsModel.updateOne({_id: dumpFile._id}, {...dumpFile, removed: true});
    console.log("File removed from local storage", dumpFile.filename);
  } catch (e) {
    console.error(`Error deleting file ${dumpFile.filename} from local storage`, e);
  }
}

module.exports = dumpsCron;