import mongoose from 'mongoose';
import xlsx from 'xlsx';
import { Ward } from '../models/ward';
import { City } from '../models/city';
import { District } from '../models/district';
import { prisma } from '../services/prisma';

interface CityData {
  code: string;
  name: string;
}

interface DistrictData {
  code: string;
  city_code: string;
  don_vi: string;
  name: string;
  full_name: string;
}

interface WardData {
  code: string;
  city_code: string;
  district_code: string;
  don_vi: string;
  name: string;
}

const filePath = './Addresses.xlsx';

const readDataFromFile = (filePath: string) => {
  const wb = xlsx.readFile(filePath);

  const provinceWs = wb.Sheets['Province Code'];
  const districtWs = wb.Sheets['District Code'];
  const wardWs = wb.Sheets['Ward code'];

  const provinceData: CityData[] = xlsx.utils.sheet_to_json(provinceWs);
  const districtData: DistrictData[] = xlsx.utils.sheet_to_json(districtWs);
  const wardData: WardData[] = xlsx.utils.sheet_to_json(wardWs);

  return {
    provinceData,
    districtData,
    wardData,
  };
};

const MONGO_URI =
  'mongodb+srv://tiendat0274:3pH70PNk20qcgP0N@cluster0.ktdb8s1.mongodb.net/my-client?retryWrites=true&w=majority';

const seedAddressToMongoDb = async () => {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    const { provinceData, districtData, wardData } = readDataFromFile(filePath);

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

// seedAddressToMongoDb();

const seedAddressToNeonDb = async () => {
  try {
    const { provinceData, districtData, wardData } = readDataFromFile(filePath);

    await prisma.city.createMany({ data: provinceData, skipDuplicates: true });
    await prisma.district.createMany({ data: districtData, skipDuplicates: true });
    await prisma.ward.createMany({ data: wardData, skipDuplicates: true });

    const allCityData = await prisma.city.findMany({});
    const allDistrictData = await prisma.district.findMany({});
    const allWardData = await prisma.ward.findMany({ include: { district: true } });

    console.log(allCityData);
    console.log(allDistrictData);
    console.log(allWardData);

    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
  }
};

seedAddressToNeonDb();
