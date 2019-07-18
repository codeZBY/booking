export default {
    path: "/main/miniMember",
    name: "MiniMember",
    component: () => import("@/views/Main/MiniMember/index"),
    redirect: "/main/miniMember/home",
    children: [
        {
            path: "/main/miniMember/home",
            name: "Home",
            component: () =>
                import("@/views/Main/MiniMember/Home/index")
        },
        {
            path: "/main/miniMember/activity",
            name: "Activity",
            component: () =>
                import("@/views/Main/MiniMember/Activity/index")
        },
        {
            path: "/main/miniMember/shortcut",
            name: "Shortcut",
            component: () =>
                import("@/views/Main/MiniMember/Shortcut/index")
        },
        {
            path: "/main/miniMember/serveType",
            name: "ServeType",
            component: () =>
                import("@/views/Main/MiniMember/ServeType/index"),
            redirect: "/main/miniMember/serveType/list",
            children: [{ // 项目列表
                path: '/main/miniMember/serveType/list',
                name: 'List',
                component: () =>
                    import("@/views/Main/MiniMember/ServeType/List/index")
            },
            { // 项目列表子类
                path: '/main/miniMember/serveType/listItem/:id?',
                name: 'listItem',
                component: () =>
                    import("@/views/Main/MiniMember/ServeType/ListItem/index")
            }
            ]
        },
        { // 优秀员工
            path: "/main/miniMember/employee",
            name: "Employee",
            component: () =>
                import("@/views/Main/MiniMember/Employee/index")
        },
        { // 为您推荐
            path: "/main/miniMember/recommend",
            name: "Recommend",
            component: () =>
                import("@/views/Main/MiniMember/Recommend/index")
        },
        { // 门店
            path: "/main/miniMember/stores",
            name: "Stores",
            component: () =>
                import("@/views/Main/MiniMember/Stores/index")
        },
        { // 公司美图
            path: "/main/miniMember/beautifulPic",
            name: "BeautifulPic",
            component: () =>
                import("@/views/Main/MiniMember/BeautifulPic/index")
        },
        { // 预约设置
            path: "/main/miniMember/orderSet",
            name: "OrderSet",
            component: () =>
                import("@/views/Main/MiniMember/OrderSet/index")
        },
    ]
}