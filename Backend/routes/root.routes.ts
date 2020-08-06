import express, { Router } from 'express';
import { rootController } from '../controllers/root.controller';

const rootRoutes: Router = express.Router();

rootRoutes.get('/', rootController.root);

export {rootRoutes};