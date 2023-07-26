import express, { Request, Response } from 'express';
import { City } from '../models/city';
import { BadRequestError, validateRequest } from '../common';
import { body } from 'express-validator';
import { Ward } from '../models/ward';
import { District } from '../models/district';

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

    const existingCity = await City.findOne({ code });

    if (existingCity) {
      throw new BadRequestError('City already exist!');
    }

    const city = City.build({ code, name });
    await city.save();

    res.status(201).send(city);
  }
);

router.get('/api/address/city', async (req: Request, res: Response) => {
  const cities = await City.find({});

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

    const existingDistrict = await District.findOne({ code });

    if (existingDistrict) {
      throw new BadRequestError('District already exist!');
    }

    const district = District.build({ code, name, city_code, don_vi, full_name });
    await district.save();

    res.status(201).send(district);
  }
);

router.get('/api/address/district', async (req: Request, res: Response) => {
  const { city_code } = req.query;
  const districts = await District.find({ city_code });

  res.status(201).json(districts?.filter((district) => district.city_code === city_code));
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

    const existingWard = await Ward.findOne({ code });

    if (existingWard) {
      throw new BadRequestError('Ward already exist!');
    }

    const ward = Ward.build({
      code,
      name,
      district_code,
      city_code,
      don_vi,
    });
    await ward.save();

    res.status(201).send(ward);
  }
);

router.get('/api/address/ward', async (req: Request, res: Response) => {
  const { city_code, district_code } = req.query;
  const wards = await Ward.find({ city_code, district_code });

  res.status(201).json(wards);
});

router.get('/api/address/search', async (req: Request, res: Response) => {
  const { search_key, search_term } = req.query;
  switch (search_key) {
    case 'city':
      const cities = await City.find({ search: { $regex: search_term, $options: 'i' } });
      res.status(201).json(cities);
      break;
    case 'district':
      const districts = await District.find({ search: { $regex: search_term, $options: 'i' } });
      res.status(201).json(districts);
      break;
    case 'ward':
      const wards = await Ward.find({ search: { $regex: search_term, $options: 'i' } });
      res.status(201).json(wards);
      break;
    default:
      break;
  }

  res.status(201).json({});
});

export { router as addressRouter };
