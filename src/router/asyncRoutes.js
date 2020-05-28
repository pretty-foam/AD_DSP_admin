import Layout from '@/layout'


export const asyncRoutes = [
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [{
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '数据概览', icon: 'dashboard' ,roles:['admin']}
      }]
    },
  ]