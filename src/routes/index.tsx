import { createBrowserRouter } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout';
import HomePage from '../pages/HomePage';
import EventsPage from '../pages/EventsPage';
import EventDetailsPage from '../pages/EventDetailsPage';
import SignInPage from '../pages/SignInPage';
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
    path: '*',
    element: <NotFoundPage />,
  },
]);