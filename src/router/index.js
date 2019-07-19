import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


const modulesFiles = require.context('../views', true, /\.vue$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
    const value = modulesFiles(modulePath);
    modules[moduleName] = value.default;
    return modules
}, {});
//console.log(modules);
let _router = [];
for (let key in modules) {
    let item = modules[key];
    let sss = ["@/views/" + key + ".vue"]
    _router.push(
        {
            name: item.name,
            path: '/' + item.name,
            component: resolve => require(["@/views/" + key + ".vue"], resolve),
            meta: {title: item.name}
        }
    )
}
//console.log(_router);
export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/e404'),
        hidden: true
    },
    {
        path: '/403',
        component: () => import('@/views/e403'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        meta: {title: 'asdas'},
        redirect: '/dashboard',
        children: [
            ..._router,
        ]
    },
    {path: '*', redirect: '/e404', hidden: true}
];

export const asyncRoutes = []


const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutes
})

const router = createRouter()


// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
