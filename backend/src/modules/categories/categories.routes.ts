import { Router } from 'express';

import { requireAuth } from '../../middleware/auth.middleware.js';
import {
  createCategoryController,
  deleteCategoryController,
  getCategoryController,
  listCategoriesController,
  updateCategoryController,
} from './categories.controller.js';

export const categoriesRoutes = Router();

categoriesRoutes.get('/', listCategoriesController);
categoriesRoutes.get('/:id', getCategoryController);
categoriesRoutes.post('/', requireAuth, createCategoryController);
categoriesRoutes.patch('/:id', requireAuth, updateCategoryController);
categoriesRoutes.delete('/:id', requireAuth, deleteCategoryController);
