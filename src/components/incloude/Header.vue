<template>
    <div class="Header">
        <el-header class="head-fixed read-only">
            <!--页头左侧大标题-->
            <router-link :to="{ name: 'home'}">
                <span class="head-title">路的尽头在哪</span>
            </router-link>
            <!--页头右侧搜索框、分类-->
            <div class="head-right-div" style="float: right">

                <!--java类分类-->
                <router-link :to="{ name: 'JavaType', params: { typeName: 'HomePage' }}">
                    <el-dropdown class="head-type-ele">
                            <span class="el-dropdown-link">Java<i class="el-icon-caret-bottom el-icon--right"></i></span>
                        <el-dropdown-menu slot="dropdown">
                            <router-link :to="{ name: 'JavaType', params: { typeName: 'oopbase' }}">
                                <el-dropdown-item>Java面向对象基础</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'JavaType', params: { typeName: 'collections' }}">
                                <el-dropdown-item>Java集合知识体系</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'JavaType', params: { typeName: 'iokonwledge' }}">
                                <el-dropdown-item>Java I/O知识体系</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'JavaType', params: { typeName: 'thread' }}">
                                <el-dropdown-item>Java多线程与并发</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'JavaType', params: { typeName: 'jvm' }}">
                                <el-dropdown-item>Java虚拟机</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'JavaType', params: { typeName: 'fqa' }}">
                                <el-dropdown-item divided>散记</el-dropdown-item>
                            </router-link>
                        </el-dropdown-menu>
                    </el-dropdown>
                </router-link>

                <!--Spring全家桶-->
                <router-link :to="{ name: 'Spring', params: { typeName: 'HomePage' }}">
                    <el-dropdown class="head-type-ele">
                        <span class="el-dropdown-link">Spring<i class="el-icon-caret-bottom el-icon--right"></i></span>
                        <el-dropdown-menu slot="dropdown">
                            <router-link :to="{ name: 'Spring', params: { typeName: 'base' }}">
                                <el-dropdown-item>Spring 基础</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'Spring', params: { typeName: 'boot' }}">
                                <el-dropdown-item>Spring Boot</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'Spring', params: { typeName: 'cloud' }}">
                                <el-dropdown-item>Spring cloud</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'Spring', params: { typeName: 'fqa' }}">
                                <el-dropdown-item divided>Spring FQA</el-dropdown-item>
                            </router-link>
                        </el-dropdown-menu>
                    </el-dropdown>
                </router-link>

                <!--安装部署类-->
                <router-link :to="{ name: 'DeployType', params: { typeName: 'HomePage' }}">
                    <el-dropdown class="head-type-ele">
                            <span class="el-dropdown-link">攻城狮<i class="el-icon-caret-bottom el-icon--right"></i></span>
                        <el-dropdown-menu slot="dropdown">
                          <router-link :to="{ name: 'DeployType', params: { typeName: 'netbase' }}">
                            <el-dropdown-item >网络基础</el-dropdown-item>
                          </router-link>
                            <router-link :to="{ name: 'DeployType', params: { typeName: 'server' }}">
                                <el-dropdown-item >服务器</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'DeployType', params: { typeName: 'database' }}">
                                <el-dropdown-item>数据库</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'DeployType', params: { typeName: 'middleware' }}">
                                <el-dropdown-item>中间件</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'DeployType', params: { typeName: 'designpattern' }}">
                                <el-dropdown-item>设计与方法论</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'DeployType', params: { typeName: 'structure' }}">
                              <el-dropdown-item>算法与数据结构</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'DeployType', params: { typeName: 'fqa' }}">
                              <el-dropdown-item>散记</el-dropdown-item>
                            </router-link>
                        </el-dropdown-menu>
                    </el-dropdown>
                </router-link>

                <!--百宝箱-->
                <router-link :to="{ name: 'resourceNavigation'}">
                    <el-dropdown class="head-type-ele">
                            <span class="el-dropdown-link">
                                百宝箱<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                        <el-dropdown-menu slot="dropdown">
                            <router-link :to="{ name: 'resourceNavigation'}">
                                <el-dropdown-item>资源导航</el-dropdown-item>
                            </router-link>
                        </el-dropdown-menu>
                    </el-dropdown>
                </router-link>

                <!--静态资源介绍-->
                <el-dropdown class="head-type-ele">
                        <span class="el-dropdown-link">
                          关于<i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-on:click.native="openDrawer($event)" class="AboutWebsite">网站介绍</el-dropdown-item>
                        <el-dropdown-item v-on:click.native="openDrawer($event)" class="AboutMe">作者简介</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-header>
        <el-drawer :title="title" :visible.sync="drawer" direction="rtl" class="read-only">
          <component :is="aboutView"></component>
        </el-drawer>
    </div>
</template>

<script>

    import AboutMe from "./AboutMe";
    import AboutWebsite from "./AboutWebsite";

    export default {
        name: "Header",
        components:{
            AboutMe, AboutWebsite
        },
        data(){
            return {
                drawer: false,
                title:'',
                aboutView:''
            }
        },
        methods:{
            openDrawer: function($event){
                this.title = event.currentTarget.textContent;
                this.aboutView = event.currentTarget.className.split(" ")[1];
                this.drawer = true;
            }
        }
    }
</script>

<style scoped>

</style>
