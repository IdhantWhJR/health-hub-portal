import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { setAuthTokenGetter } from '@workspace/api-client-react';

import { PublicLayout } from './components/layout/public-layout';
import { AdminLayout } from './components/layout/admin-layout';

import Home from './pages/public/home';
import Recipes from './pages/public/recipes';
import RecipeDetail from './pages/public/recipe-detail';
import Blog from './pages/public/blog';
import BlogDetail from './pages/public/blog-detail';
import Consultations from './pages/public/consultations';

import AdminLogin from './pages/admin/login';
import Dashboard from './pages/admin/dashboard';
import AdminRecipes from './pages/admin/recipes';
import AdminBlog from './pages/admin/blog';
import AdminTimeslots from './pages/admin/timeslots';
import AdminBookings from './pages/admin/bookings';

// Set up auth token getter for generated API client
setAuthTokenGetter(() => localStorage.getItem('admin_token'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path="/">
        <PublicLayout><Home /></PublicLayout>
      </Route>
      <Route path="/recipes">
        <PublicLayout><Recipes /></PublicLayout>
      </Route>
      <Route path="/recipes/:id">
        <PublicLayout><RecipeDetail /></PublicLayout>
      </Route>
      <Route path="/blog">
        <PublicLayout><Blog /></PublicLayout>
      </Route>
      <Route path="/blog/:id">
        <PublicLayout><BlogDetail /></PublicLayout>
      </Route>
      <Route path="/consultations">
        <PublicLayout><Consultations /></PublicLayout>
      </Route>

      {/* Admin Auth */}
      <Route path="/admin">
        <AdminLogin />
      </Route>

      {/* Admin Dashboard */}
      <Route path="/admin/dashboard">
        <AdminLayout><Dashboard /></AdminLayout>
      </Route>
      <Route path="/admin/recipes">
        <AdminLayout><AdminRecipes /></AdminLayout>
      </Route>
      <Route path="/admin/blog">
        <AdminLayout><AdminBlog /></AdminLayout>
      </Route>
      <Route path="/admin/timeslots">
        <AdminLayout><AdminTimeslots /></AdminLayout>
      </Route>
      <Route path="/admin/bookings">
        <AdminLayout><AdminBookings /></AdminLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
