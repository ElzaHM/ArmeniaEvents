import { createBrowserRouter, Navigate } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import HomePage from '../pages/HomePage';
import EventsPage from '../pages/EventsPage';
import EventDetailsPage from '../pages/EventDetailsPage';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import AdminPage from '../pages/admin/AdminPage';
import AdminEventsPage from '../pages/admin/AdminEventsPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import AdminProfilePage from '../pages/admin/AdminProfilePage';
import AdminSearchPage from '../pages/admin/AdminSearchPage';
import NotFoundPage from '../pages/NotFoundPage';
import CreateEventPage from '../pages/CreateEventPage';
import { RequireAuth, RequireGuest } from './guards';

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
        path: 'events/new',
        element: <CreateEventPage />,
      },
      {
        path: 'events/:id',
        element: <EventDetailsPage />,
      },
      {
        path: 'create-event',
        element: <CreateEventPage />,
      },
      {
        path: 'signin',
        element: (
          <RequireGuest>
            <SignInPage />
          </RequireGuest>
        ),
      },
      {
        path: 'signup',
        element: (
          <RequireGuest>
            <SignUpPage />
          </RequireGuest>
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <AdminPage />,
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
        path: 'search',
        element: <AdminSearchPage />,
      },
      {
        path: 'analytics',
        element: <AdminAnalyticsPage />,
      },
      {
        path: 'profile',
        element: <AdminProfilePage />,
      },
      {
        path: 'settings',
        element: <AdminSettingsPage />,
      },
    ],
  },
  {
    path: '/admin/signup',
    element: <Navigate to="/signup" replace />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
