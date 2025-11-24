import { createRouter, createWebHistory } from 'vue-router';
import TheLayout from '@/layouts/TheLayout.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: TheLayout,
      children: [
        {
          path: '',
          redirect: '/customers'
        },
        {
          path: 'customers',
          name: 'Customers',
          component: () => import('@/views/customer/CustomerList.vue')
        },
        {
          path: 'customers/add',
          name: 'CustomerCreate',
          component: () => import('@/views/customer/CustomerForm.vue')
        },
        {
          path: 'customers/:id/edit',
          name: 'CustomerEdit',
          component: () => import('@/views/customer/CustomerForm.vue'),
          props: true
        },
        {
          path: 'customers/import',
          name: 'CustomerImport',
          component: () => import('@/views/customer/CustomerImportFile.vue')
        },
          // Unfinished features route to FeatureInDevelopment
          {
            path: 'products',
            name: 'Products',
            component: () => import('@/pages/FeatureInDevelopment.vue')
          },
        {
          path: 'opportunities',
          name: 'Opportunities',
          component: () => import('@/pages/FeatureInDevelopment.vue')
        },
        {
          path: 'quotes',
          name: 'Quotes',
          component: () => import('@/pages/FeatureInDevelopment.vue')
        },
        {
          path: 'orders',
          name: 'Orders',
          component: () => import('@/pages/FeatureInDevelopment.vue')
        },
        {
          path: 'reports',
          name: 'Reports',
          component: () => import('@/pages/FeatureInDevelopment.vue')
        },
        {
          path: 'all',
          name: 'All',
          component: () => import('@/pages/FeatureInDevelopment.vue')
        },
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFoundPage',
      component: () => import('@/pages/NotFoundPage.vue')
    }
  ]
});

export default router;
