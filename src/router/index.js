import { createWebHashHistory, createRouter } from 'vue-router';
// 创建router实例对象，让他去管理我们对应的关系
// const router = new VueRouter({
//     // vue-router 默认 hash 模式  当使⽤ history 模式时，URL 就像正常的 url。url去掉了#
//     mode: 'history',
//     routes: [
//         // {
//         //     path: '/home', //路径
//         //     component: Home, //组件
//         //     //好处和坏处：当一个路由出现问题的时候，会自动重定向到另外一个路由上去，保证你的数据畅通。
//         //     //    坏处：可能会出现一定的延时，造成网速变慢。但是一切都是由路由器的路由表自动控制的。
//         //     //路由重定向指的是：用户在访问地址A的时候，强制用户跳转到地址B，从而在展示特定的组件页面(相当于
//         //     //   在点击跳转一个页面的时候设置一个默认显示的内容区域)
//         //     //通过路由规则的redirect 属性,指定一个新的路由地址，可以很方便地设置路由的重定向
//         //     redirect: '/About' //路由重定向，
//         // },
//     ]
// });
const routes = [
    {
        path: '/',
        redirect: '/attack/Reconnaissance' // 当访问根路径时，自动重定向到 /home
    },
    {
        path: '/attack',
        component: () => import('../views/MainPage'),
        children: [
            {
                path: 'Reconnaissance',
                name: 'Reconnaissance',
                component: () => import('../views/Reconnaissance/Recon-naissance')
            },
            {
                path: 'filecheck',
                name: 'filecheck',
                component: () => import('../components/Reconnaissance/file-check.vue')
            },
            {
                path: 'bruteforce',
                name: 'bruteforce',
                component: () => import('../components/Reconnaissance/brute-force.vue')
            },
            {
                path: 'attackservice',
                name: 'attackservice',
                component: () => import('../components/Reconnaissance/attack-service.vue')
            },
            {
                path: 'firewall',
                name: 'firewall',
                component: () => import('../components/HostCommand/fire-wall.vue')
            },
            {
                path: 'attacktip',
                name: 'attacktip',
                component: () => import('../components/HTB/attack-tip.vue')
            },
            {
                path: 'domainpenetration',
                name: 'domainpenetration',
                component: () => import('../components/InternalNetwork/domain-penetration.vue')
            }
        ]
    }
    // { path: '/Reconnaissance', component: () => import('../views/Reconnaissance/Recon-naissance') }
];

const router = createRouter({
    scrollBehavior: () => ({ y: 0 }),
    history: createWebHashHistory(),
    routes
});

export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}
export default router;
