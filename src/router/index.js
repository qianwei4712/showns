import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const home = () => import('../components/Home');
const blog = () => import('../components/blog/Blog');
const javaIndex = () => import('../components/blog/java/JavaIndex');
const frontIndex = () => import('../components/blog/front/FrontIndex');
const deployIndex = () => import('../components/blog/deploy/DeployIndex');
const methodologyIndex = () => import('../components/blog/methodology/MethodologyIndex');

const router = new Router({
    mode: 'history',
    routes: [{
            path: '',
            name: 'home',
            component: home,
        }, {
            path: '/blog',
            name: 'blogHome',
            component: blog,
            children: [{
                path: 'java/:typeName',
                name: 'JavaType',
                components: {default: javaIndex}
            }, {
                path: 'front/:typeName',
                name: 'FrontType',
                components: {default: frontIndex}
            }, {
                path: 'deploy/:typeName',
                name: 'DeployType',
                components: {default: deployIndex}
            }, {
                path: 'methodology/:typeName',
                name: 'MethodologyType',
                components: {default: methodologyIndex}
            }]
        }, {
            path: '*',
            redirect: ''
        }]
    });
export default router
