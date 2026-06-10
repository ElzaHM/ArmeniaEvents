import { createBrowserRouter, Navigate } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import HomePage from '../pages/HomePage';
import EventsPage from '../pages/EventsPage';
import EventDetailsPage from '../pages/EventDetailsPage';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import AdminPage from '../pages/admin/AdminPage';
import AdminEventsPage from '../pages/admin/AdminEventsPage';
import AdminCreateEventPage from '../pages/admin/AdminCreateEventPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import AdminProfilePage from '../pages/admin/AdminProfilePage';
import AdminSearchPage from '../pages/admin/AdminSearchPage';
import NotFoundPage from '../pages/NotFoundPage';
import CreateEventPage from '../pages/CreateEventPage';
import AboutPage from '../pages/AboutPage';
import FavoritesPage from '../pages/FavoritesPage';
import { RequireAuth, RequireGuest } from './guards';
import ContactPage from '../pages/ContactPage';
import { AppRoot } from '../providers/app-root';

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
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'favorites',
        element: (
          <RequireAuth>
            <FavoritesPage />
          </RequireAuth>
        ),
      },
      {
        path: 'contact',
        element: <ContactPage />,
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
      {
        path: 'privacy-policy',
        element: <PrivacyPolicyPage />,
      },
      {
        path: 'forgot-password',
        element: (
          <RequireGuest>
            <ForgotPasswordPage />
          </RequireGuest>
        ),
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />,
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
        path: 'events/create',
        element: <AdminCreateEventPage />,
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
