import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: {
      name: "login",
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    beforeEnter: (to, from, next) => {
      if (sessionStorage.getItem("userData")) {
        next({
          name: "map-viewer",
        });
      } else {
        next();
      }
    },
  },
  {
    path: "/map-viewer",
    name: "map-viewer",
    component: () => import("@/views/MapViewer.vue"),
    beforeEnter: (to, from, next) => {
      if (!sessionStorage.getItem("userData")) {
        next({
          name: "login",
        });
      } else {
        next();
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
