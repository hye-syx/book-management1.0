import { authClient } from '#/lib/auth-client'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_user')({
  component: RouteComponent,
  beforeLoad: async () => {
     const session = await authClient.getSession();
     if(!(session.data?.user.role === 'admin')) {
      throw redirect({ to: '/dashboard' });
     }
  },
})

function RouteComponent() {
  return <Outlet />
}
