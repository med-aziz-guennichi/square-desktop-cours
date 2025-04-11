import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import FullPageLoader from './components/full-page-loader';
import AppLayout from './layout/app-layout';
import GlobalLayout from './layout/global-layout';
import { PrivateRoute, PublicRoute } from './lib/route-guard';
import Login from './pages/auth/login';
import Error from './pages/error';
const MatierePage = React.lazy(() => import('./pages/matiere/matier-page'));
const ClassePage = React.lazy(() => import('./pages/classe/classe-page'));
const CourPage = React.lazy(() => import('./pages/cours/cour-page'));

export const router = createBrowserRouter([
  {
    element: <GlobalLayout />,
    errorElement: <Error />,
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
        path: '/dashboard/classes',
        element: (
          <PrivateRoute>
            <AppLayout>
              <Suspense fallback={<FullPageLoader />}>
                <ClassePage />
              </Suspense>
            </AppLayout>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <FullPageLoader />,
      },
      {
        path: '/dashboard/classes/matiere/:classeId',
        // loader: matiereLoader,
        element: (
          <PrivateRoute>
            <AppLayout>
              <Suspense fallback={<FullPageLoader />}>
                <MatierePage />
              </Suspense>
            </AppLayout>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <FullPageLoader />,
      },
      {
        path: '/dashboard/classes/:matiereId/cours',
        element: (
          <PrivateRoute>
            <AppLayout>
              <Suspense fallback={<FullPageLoader />}>
                <CourPage />
              </Suspense>
            </AppLayout>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <FullPageLoader />,
      },
    ],
  },
]);
