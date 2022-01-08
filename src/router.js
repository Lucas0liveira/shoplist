import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "./supabase";
import Login from "./pages/Login.vue";
import Profile from "./pages/Profile.vue";
import Home from "./pages/Home.vue";
import List from "./pages/List.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/",
      component: Home,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/list",
      component: List,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/list/:id",
      component: List,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/profile",
      component: Profile,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const user = supabase.auth.user();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth) {
    if (requiresAuth && !user) {
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
