import { createRouter, createWebHistory } from "vue-router"
import MainLayout from "./layouts/MainLayout.vue"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: () => import("./modules/Home.vue"),
			meta: {
				layout: MainLayout
			}
		},
    {
      path: "/d3-force",
      name: "d3-force-index",
      component: () => import("./modules/D3Force.vue"),
			meta: {
				layout: MainLayout
			}
    },
	],
})

export default router
