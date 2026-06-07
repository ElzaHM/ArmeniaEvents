import { Router } from 'express';

import { requireAuth } from '../../../middleware/auth.middleware.js';
import {
  addFavoriteController,
  getFavoriteStatusController,
  getUserFavoritesController,
  removeFavoriteController,
} from './favorites.controller.js';

export const favoritesRoutes = Router();

favoritesRoutes.post('/:id/favorite', requireAuth, addFavoriteController);
favoritesRoutes.delete('/:id/favorite', requireAuth, removeFavoriteController);
favoritesRoutes.get('/:id/favorite', requireAuth, getFavoriteStatusController);

favoritesRoutes.get('/users/me/favorites', requireAuth, getUserFavoritesController);