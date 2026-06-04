import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { categoryCreateSchema, categoryUpdateSchema } from './categories.schema.js';
import * as categoriesService from './categories.service.js';

const idSchema = z.object({ id: z.string().uuid() });

export async function listCategoriesController(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await categoriesService.listCategories();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
}

export async function getCategoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idSchema.parse(req.params);
    const category = await categoriesService.getCategoryById(id);
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
}

export async function createCategoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = categoryCreateSchema.parse(req.body);
    const category = await categoriesService.createCategory(payload);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
}

export async function updateCategoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idSchema.parse(req.params);
    const payload = categoryUpdateSchema.parse(req.body);
    const category = await categoriesService.updateCategory(id, payload);
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
}

export async function deleteCategoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idSchema.parse(req.params);
    await categoriesService.deleteCategory(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
