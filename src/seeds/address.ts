import mongoose from 'mongoose';
import xlsx from 'xlsx';
import { Ward } from '../models/ward';
import { City } from '../models/city';
import { District } from '../models/district';

const wb = xlsx.readFile('./Addresses.xlsx');

const provinceWs = wb.Sheets['Province Code'];
const districtWs = wb.Sheets['District Code'];
const wardWs = wb.Sheets['Ward code'];

const provinceData = xlsx.utils.sheet_to_json(provinceWs);
const districtData = xlsx.utils.sheet_to_json(districtWs);
const wardData = xlsx.utils.sheet_to_json(wardWs);

const MONGO_URI =
  'mongodb+srv://tiendat0274:3pH70PNk20qcgP0N@cluster0.ktdb8s1.mongodb.net/my-client?retryWrites=true&w=majority';

const seedAddress = async () => {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDb');

    console.log('Start inserting province data');
    await City.insertMany(provinceData);
    console.log('Finished insert province data');

    console.log('Start inserting district data');
    await District.insertMany(districtData);
    console.log('Finished insert district data');

    console.log('Start inserting ward data');
    await Ward.insertMany(wardData);
    console.log('Finished insert ward data');

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

seedAddress();
