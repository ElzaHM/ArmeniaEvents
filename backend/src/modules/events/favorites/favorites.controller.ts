import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import * as favoritesService from './favorites.service.js';

const idSchema = z.object({ id: z.string().uuid() });

export async function addFavoriteController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idSchema.parse(req.params);
    const userId = req.authUser!.id;
    const result = await favoritesService.addFavorite(userId, id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function removeFavoriteController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idSchema.parse(req.params);
    const userId = req.authUser!.id;
    const result = await favoritesService.removeFavorite(userId, id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getFavoriteStatusController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idSchema.parse(req.params);
    const userId = req.authUser!.id;
    const result = await favoritesService.getFavoriteStatus(userId, id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getUserFavoritesController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.authUser!.id;
    const eventIds = await favoritesService.getUserFavorites(userId);
    res.status(200).json(eventIds);
  } catch (error) {
    next(error);
  }
}
