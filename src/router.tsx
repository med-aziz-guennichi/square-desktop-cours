import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import FullPageLoader from './components/full-page-loader';
import AppLayout from './layout/app-layout';
import GlobalLayout from './layout/global-layout';
import { PrivateRoute, PublicRoute } from './lib/route-guard';

import { QueryClient } from '@tanstack/react-query';
import { getOneLesson } from './apis/lesson/query-slice';
import { getMeetByName } from './apis/video-conferance/query-slice';
import Login from './pages/auth/login';
import ErrorPage from './pages/error';

const MatierePage = lazy(() => import('./pages/matiere/matier-page'));
const ClassePage = lazy(() => import('./pages/classe/classe-page'));
const CourPage = lazy(() => import('./pages/cours/cour-page'));
const AjouterCoursPage = lazy(() => import('./pages/cours/ajouter-cours'));
const CoursLayout = lazy(() => import('./pages/cours/cours-layout'));
const CoursDetailsPage = lazy(() => import('./pages/cours/cours-details'));
const CoursDetailsLayout = lazy(() => import('./layout/cours-details-layout'));
const NotificationPage = lazy(() => import("./pages/notification/notification-page"));
// ----------------------------------------------- VIDEO CONFERANCE
const VideoConferancePage = lazy(
  () => import('./pages/video-conferance/video-conferance-page'),
);
const MeetPage = lazy(() => import('./pages/video-conferance/meet-page'));

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
            path: 'conferance',
            element: withSuspense(<VideoConferancePage />),
          },
          {
            path: 'notifications',
            element: withSuspense(<NotificationPage />),
          },
          {
            path: 'meet/:roomName',
            element: withSuspense(<MeetPage />),
            loader: async ({ params }) => {
              const queryClient = new QueryClient();
              try {
                await queryClient.prefetchQuery({
                  queryKey: ['meet', params.roomName],
                  queryFn: () => getMeetByName(params.roomName!),
                });
              } catch (error) {
                console.error(error);
              }
            },
          },
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
              {
                path: 'modifier-cours/:coursId',
                element: withSuspense(<AjouterCoursPage />),
                loader: async ({ params }) => {
                  const queryClient = new QueryClient();
                  try {
                    await queryClient.prefetchQuery({
                      queryKey: ['cours', params.coursId],
                      queryFn: () => getOneLesson(params.coursId!),
                    });
                  } catch (error) {
                    console.error(error);
                  }
                },
              },
              {
                path: 'cours/:coursId',
                element: withSuspense(<CoursDetailsLayout />),
                children: [
                  {
                    path: 'chapitre/:chapitreId',
                    element: withSuspense(<CoursDetailsPage />),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
