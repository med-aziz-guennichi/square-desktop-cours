
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Error from './pages/error';
import Login from './pages/auth/login';
import { PrivateRoute, PublicRoute } from './lib/route-guard';
import ErrorElement from './components/errors/error-element';
import AppLayout from './layout/app-layout';
import ClassePage from './pages/classe/classe-page';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      // cacheTime: 1000,
    },
  },
});
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <PublicRoute><Login /></PublicRoute>
      ),
      errorElement: <Error />,
    },
    {
      path: "/classes",
      element: (
        <PrivateRoute><AppLayout><ClassePage /></AppLayout></PrivateRoute>
      ),
    }
  ])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
