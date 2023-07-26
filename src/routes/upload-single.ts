import express, { Request, Response } from 'express';
const multer = require('multer');
import { storage } from '../services/cloudinary';
import { currentUser, requireAuth } from '../common';

interface MulterRequest extends Request {
  file: any;
}

const upload = multer({
  storage,
});

const router = express.Router();

router.post(
  '/api/upload/single',
  currentUser,
  requireAuth,
  upload.single('image'),
  async (req: Request, res: Response) => {
    res.status(201).send((req as MulterRequest).file);
  }
);

export { router as uploadSingle };
