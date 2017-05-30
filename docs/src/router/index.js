import Vue from 'vue';
import Router from 'vue-router';
import OrchestrationRunner from '@/components/pages/orchestration-runner';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/run',
      name: 'OrchestrationRunner',
      component: OrchestrationRunner
    },
    // base '/' redirect
    {
      path: '/',
      redirect: { name: 'OrchestrationRunner' }
    }
  ]
});
