import Vue from 'vue';
import Router from 'vue-router';
import OrchestrationRunner from '@/components/pages/orchestration-runner';
import OrchestrationBuilder from '@/components/pages/orchestration-builder';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/run',
      name: 'OrchestrationRunner',
      component: OrchestrationRunner
    },
    {
      path: '/build',
      name: 'OrchestrationBuilder',
      component: OrchestrationBuilder
    },
    // base '/' redirect
    {
      path: '/',
      redirect: { name: 'OrchestrationRunner' }
    }
  ]
});
