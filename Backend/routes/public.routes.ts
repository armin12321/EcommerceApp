import express, { Router } from 'express';
import { publicController } from '../controllers/public.controller';

const publicRoutes: Router = express.Router();

publicRoutes.get('/home', publicController.home);

publicRoutes.get('/about', publicController.about);

export {publicRoutes};
