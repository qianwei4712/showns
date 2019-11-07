import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const blog = () => import('../components/blog/Blog');
const javaIndex = () => import('../components/blog/java/JavaIndex');
const javaHome = () => import('../components/blog/java/JavaHome');
const frontIndex = () => import('../components/blog/front/FrontIndex');
const frontHome = () => import('../components/blog/front/FrontHome');

const router = new Router({
    mode: 'history',
    routes: [{
        path: '/blog',
        name: 'blogHome',
        component: blog,
        children: [
            {
                path: 'java/:typeName',
                name: 'JavaType',
                components: {
                    default: javaIndex,
                    main_catiner: javaHome
                }
            },
            {
                path: 'front/:typeName',
                name: 'FrontType',
                components: {
                    default: frontIndex,
                    main_catiner: frontHome
                }
            },
        ]
    },  {
        path: '*',
        redirect: '/blog/java/a'
    }]
});
export default router
