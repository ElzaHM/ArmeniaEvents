import { createBrowserRouter } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import HomePage from '../pages/HomePage';
import EventsPage from '../pages/EventsPage';
import EventDetailsPage from '../pages/EventDetailsPage';
import SignInPage from '../pages/SignInPage';
import AdminPage from '../pages/AdminPage';
import SignUpPage from '../pages/SignUpPage';
import AdminEventsPage from '../pages/AdminEventsPage';
import AdminCategoriesPage from '../pages/AdminCategoriesPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import AdminAnalyticsPage from '../pages/AdminAnalyticsPage';
import AdminSettingsPage from '../pages/AdminSettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'events',
        element: <EventsPage />,
      },
      {
        path: 'events/:id',
        element: <EventDetailsPage />,
      },
      {
        path: 'signin',
        element: <SignInPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
      {
        path: 'signup',
        element: <SignUpPage />,
      },
      {
        path: 'events',
        element: <AdminEventsPage />,
      },  
      {
        path: 'categories',
        element: <AdminCategoriesPage />,
      },
      {
        path: 'users',
        element: <AdminUsersPage />,
      },
      {
        path: 'analytics',
        element: <AdminAnalyticsPage />,
      },
      {
        path: 'settings',
        element: <AdminSettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
