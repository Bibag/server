import { BadRequestError, currentUser, NotFoundError, requireAuth, validateRequest } from '../common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';

const router = express.Router();

router.put(
  '/api/users/update-profile',
  currentUser,
  requireAuth,
  [
    body('email').trim().isEmail().withMessage('Email must be valid'),
    body('name').trim().isLength({ min: 3, max: 255 }).withMessage('Name must be between 3 and 255 characters'),
    body('avatar').trim().notEmpty().withMessage('You must supply avatar'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, name, avatar } = req.body;

    const user = await User.findById(req.currentUser!.id);

    if (!user) {
      throw new NotFoundError();
    }

    if (email !== user.email) {
      throw new BadRequestError('Email cannot be changed');
    }

    user.set({ name, avatar });

    await user.save();

    res.status(200).send(user);
  }
);

export { router as updateProfile };
