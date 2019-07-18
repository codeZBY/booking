import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

import miniMember from './main/miniMember.js'
import booking from './main/booking.js'
import orderFood from './mobile/orderFood.js'

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: '/home' // 默认给重定向
        },
        // {
        //     path: "/test",
        //     name: "Test",
        //     component: () => import("@/views/Test/index")
        // },
        {
            path: "/mobileBooking",
            name: "MobileBooking",
            component: () => import("@/views/MobileBooking/index")
        },
        {
            path: "/webBooking",
            name: "WebBooking",
            component: () => import("@/views/WebBooking/index")
        },
        {
            path: "/mobile",
            name: "Mobile",
            component: () => import("@/views/Mobile/index"),
            children: [
                orderFood,
                {
                    path: "/mobile/mobileLogin",
                    name: "MobileLogin",
                    component: () => import("@/views/Mobile/MobileLogin/index"),
                }
            ]
        },
        {
            path: "/main",
            name: "Main",
            component: () => import("@/views/Main/index"),
                children: [
                    miniMember,
                    booking
                ]
        },
    ]
});