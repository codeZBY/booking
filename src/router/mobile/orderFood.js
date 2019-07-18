export default {
    path: "/mobile/orderFood",
    name: "OrderFood",
    component: () => import("@/views/Mobile/OrderFood/index"),
    // redirect: "/main/miniMember/home",
    // children: [
    //     {
    //         path: "/main/miniMember/home",
    //         name: "Home",
    //         component: () =>
    //             import("@/views/Main/MiniMember/Home/index")
    //     },
    // ]
}