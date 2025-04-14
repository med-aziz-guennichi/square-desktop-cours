import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import FullPageLoader from './components/full-page-loader';
import AppLayout from './layout/app-layout';
import GlobalLayout from './layout/global-layout';
import { PrivateRoute, PublicRoute } from './lib/route-guard';

import Login from './pages/auth/login';
import ErrorPage from './pages/error';

const MatierePage = lazy(() => import('./pages/matiere/matier-page'));
const ClassePage = lazy(() => import('./pages/classe/classe-page'));
const CourPage = lazy(() => import('./pages/cours/cour-page'));
const AjouterCoursPage = lazy(() => import('./pages/cours/ajouter-cours'));
const CoursLayout = lazy(() => import('./pages/cours/cours-layout'));

const withSuspense = (Component: React.ReactNode) => (
  <Suspense fallback={<FullPageLoader />}>{Component}</Suspense>
);

export const router = createBrowserRouter([
  {
    element: <GlobalLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        ),
        children: [
          {
            path: 'classes',
            element: withSuspense(<ClassePage />),
          },
          {
            path: 'classes/matiere/:classeId',
            element: withSuspense(<MatierePage />),
          },
          {
            path: 'classes/:matiereId/cours',
            element: withSuspense(<CoursLayout />),
            children: [
              {
                index: true,
                element: withSuspense(<CourPage />),
              },
              {
                path: 'ajouter-cours',
                element: withSuspense(<AjouterCoursPage />),
              },
            ],
          },
        ],
      },
    ],
  },
]);
