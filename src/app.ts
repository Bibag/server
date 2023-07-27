import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError } from './common';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { updatePasswordRouter } from './routes/update-password';
import { updateProfile } from './routes/update-profile';
import { uploadSingle } from './routes/upload-single';
import { addressRouter } from './routes/address';
import { addressPrismaPostgrSqlRouter } from './routes/address-prisma-postgresql';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: true,
    keys: [process.env.COOKIE_SESSION_KEY || ''],
    secure: process.env.NODE_ENV === 'production',
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(updatePasswordRouter);
app.use(updateProfile);
app.use(uploadSingle);
app.use(addressPrismaPostgrSqlRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
