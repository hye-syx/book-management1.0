import { createRouter, RouterProvider } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';
import { TanstackProvider } from './lib/tanstack-provider';
import { routeTree } from './routeTree.gen';
import { Toaster } from 'sonner';

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('app')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <TanstackProvider>
      <RouterProvider router={router} />
      <Toaster />
    </TanstackProvider>,
  );
}
