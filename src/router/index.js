import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const home = () => import('../components/Home');
const blog = () => import('../components/blog/Blog');
const chest = () => import('../components/chest/Chest');
const javaIndex = () => import('../components/blog/java/JavaIndex');
const deployIndex = () => import('../components/blog/deploy/DeployIndex');
const springIndex = () => import('../components/blog/spring/SpringIndex');
const applyIndex = () => import('../components/blog/apply/ApplyIndex');
const resourceNavigation = () => import('../components/chest/ResourceNavigation');

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
                path: 'apply/:typeName',
                name: 'ApplyType',
                components: {default: applyIndex}
            }, {
                path: 'deploy/:typeName',
                name: 'DeployType',
                components: {default: deployIndex}
            }, {
                path: 'spring/:typeName',
                name: 'Spring',
                components: {default: springIndex}
            }]
        }, {
            path: '/chest',
            name: 'chestHome',
            component: chest,
            children: [{
                path: 'resourceNavigation',
                name: 'resourceNavigation',
                components: {default: resourceNavigation}
            }]
        }, {
            path: '*',
            redirect: ''
        }]
    });
export default router
