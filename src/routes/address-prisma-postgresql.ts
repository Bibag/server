import express, { Request, Response } from 'express';
import { BadRequestError, validateRequest } from '../common';
import { body } from 'express-validator';

import { match } from '../ultils/search';
import { prisma } from '../services/prisma';

const router = express.Router();

router.post(
  '/api/address/city',
  [
    body('code').trim().notEmpty().withMessage('You must supply city code'),
    body('name').trim().isLength({ min: 3, max: 255 }).withMessage('Name must be between 3 and 255 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { code, name } = req.body;

    const existingCity = await prisma.city.findFirst({ where: { code } });

    if (existingCity) {
      throw new BadRequestError('City already exist!');
    }

    const city = await prisma.city.create({
      data: {
        code,
        name,
      },
    });

    res.status(201).send(city);
  }
);

router.get('/api/address/city', async (req: Request, res: Response) => {
  const cities = await prisma.city.findMany({});

  res.status(201).json(cities);
});

router.post(
  '/api/address/district',
  [
    body('code').trim().notEmpty().withMessage('You must supply district code'),
    body('city_code').trim().notEmpty().withMessage('You must supply city code'),
    body('don_vi').trim().notEmpty().withMessage('You must supply don vi'),
    body('name').trim().isLength({ min: 3, max: 255 }).withMessage('Name must be between 3 and 255 characters'),
    body('full_name')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage('Full name must be between 3 and 255 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { code, name, city_code, don_vi, full_name } = req.body;

    const existingDistrict = await prisma.district.findFirst({ where: { code } });

    if (existingDistrict) {
      throw new BadRequestError('District already exist!');
    }

    const district = await prisma.district.create({ data: { code, name, city_code, don_vi, full_name } });

    res.status(201).send(district);
  }
);

router.get('/api/address/district', async (req: Request, res: Response) => {
  const { city_code } = req.query;
  const districts = await prisma.district.findMany({ where: { city_code: { equals: city_code.toString() } } });

  res.status(201).json(districts);
});

router.post(
  '/api/address/ward',
  [
    body('code').trim().notEmpty().withMessage('You must supply ward code'),
    body('city_code').trim().notEmpty().withMessage('You must supply city code'),
    body('district_code').trim().notEmpty().withMessage('You must supply district code'),
    body('don_vi').trim().notEmpty().withMessage('You must supply don vi'),
    body('name').trim().isLength({ min: 3, max: 255 }).withMessage('Name must be between 3 and 255 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { code, name, district_code, city_code, don_vi } = req.body;

    const existingWard = await prisma.ward.findFirst({ where: { code } });

    if (existingWard) {
      throw new BadRequestError('Ward already exist!');
    }

    const ward = await prisma.ward.create({
      data: {
        code,
        name,
        district_code,
        city_code,
        don_vi,
      },
    });

    res.status(201).send(ward);
  }
);

router.get('/api/address/ward', async (req: Request, res: Response) => {
  const { city_code, district_code } = req.query;
  const wards = await prisma.ward.findMany({
    where: { city_code: { equals: city_code.toString() }, district_code: { equals: district_code.toString() } },
  });

  res.status(201).json(wards);
});

router.get('/api/address/search', async (req: Request, res: Response) => {
  const { search_key, search_term } = req.query;
  const results = [];

  if (!search_term) {
    res.status(201).json(results);
  }

  try {
    switch (search_key) {
      case 'city':
        {
          const cities = await prisma.city.findMany({});
          cities.forEach((city) => {
            if (match(city.name, search_term as string)) {
              results.push({ value: city.name });
            }
          });
        }
        break;
      case 'district':
        {
          const districts = await prisma.district.findMany({});
          districts.forEach((district) => {
            if (match(district.name, search_term as string)) {
              results.push({ value: `${district.full_name}` });
            }
          });
        }
        break;
      case 'ward':
        {
          const wards = await prisma.ward.findMany({ include: { district: true } });
          wards.forEach((ward) => {
            if (match(ward.name, search_term as string)) {
              results.push({
                value: `${ward.name}, ${ward?.district?.full_name}`,
              });
            }
          });
        }
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(error);
  }

  res.status(201).json(results);
});

export { router as addressPrismaPostgrSqlRouter };
