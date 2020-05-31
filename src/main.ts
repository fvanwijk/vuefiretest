import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { firestorePlugin } from 'vuefire';
import VueRouter from 'vue-router';

import App from './App.vue';

Vue.config.productionTip = false;
// firebase.firestore.setLogLevel('debug');
firebase.initializeApp({
  databaseURL: 'https://vuefire-testproject.firebaseio.com',
  projectId: 'vuefire-testproject',
});

let shouldUseEmulator = location.hostname === 'localhost';
// Emulator doesn't work on my machine
shouldUseEmulator = false;

if (shouldUseEmulator) {
  const db = firebase.firestore();
  console.info('Firestore is emulated');
  db.settings({
    host: 'localhost:8080',
    ssl: false,
    experimentalForceLongPolling: true,
  });
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', name: 'Overview', component: () => import('@/components/Overview.vue') },
    { path: '/detail', name: 'Detail', component: () => import('@/components/Detail.vue') },
  ],
});
Vue.use(VueRouter);
Vue.use(firestorePlugin, { wait: true });

new Vue({
  render: h => h(App),
  router,
}).$mount('#app');
