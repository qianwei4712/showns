<template>
    <div class="DeployIndex">
        <el-aside width="330px">
            <div style="height: 20px;">
                <!-- 空出一部分位置 -->
            </div>
            <ul class="sidebar-ul-padding">
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>服务器</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li v-on:click="handleChangeView($event)" class="CommonSoftwareDeploy" id="server">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='CommonSoftwareDeploy'}">常用软件安装</a>
                            </li>
                            <li v-on:click="handleChangeView($event)" class="LinuxRunJarBackground">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='LinuxRunJarBackground'}">Linux服务器后台运行jar包</a>
                            </li>
                            <li v-on:click="handleChangeView($event)" class="NginxBindPortWithDomain">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='NginxBindPortWithDomain'}">nginx将多个不同域名转发到不同端口</a>
                            </li>
                            <li v-on:click="handleChangeView($event)" class="NginxAndTomcatConfigSSL">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='NginxAndTomcatConfigSSL'}">nginx+tomcat配置项目https加密</a>
                            </li>
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>数据库</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li v-on:click="handleChangeView($event)" class="MysqldumpBackupSql" id="darabase">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='MysqldumpBackupSql'}">使用mysqldump定时备份sql</a>
                            </li>
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>中间件</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>FQA</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li v-on:click="handleChangeView($event)" class="SomethingNotes" id="fqa">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='SomethingNotes'}">常用软件下载链接</a>
                            </li>
                        </ul>
                    </section>
                </li>
            </ul>
        </el-aside>
        <!-- 主页面区 -->
        <el-main>
            <div class="markdown-body main-md-body">
                <h1 v-html="title"></h1>
                <component :is="currentView"></component>
            </div>
        </el-main>
    </div>
</template>

<script>

    import HomePage from "./DeployHome";
    import SomethingNotes from './fqa/SomethingNotes.md';
    import CommonSoftwareDeploy from './server/CommonSoftwareDeploy.md';
    import LinuxRunJarBackground from './server/LinuxRunJarBackground.md';
    import NginxBindPortWithDomain from './server/NginxBindPortWithDomain.md';
    import NginxAndTomcatConfigSSL from './server/NginxAndTomcatConfigSSL.md';
    import MysqldumpBackupSql from './database/MysqldumpBackupSql.md';

    export default {
        name: "deployIndex",
        components:{
            HomePage,
            SomethingNotes, LinuxRunJarBackground, NginxBindPortWithDomain, NginxAndTomcatConfigSSL,
            MysqldumpBackupSql, CommonSoftwareDeploy
        },
        data(){
            return {
                title:'平时工作中涉及到的安装部署',
                activeIndex: '',
                currentView: HomePage
            }
        },
        methods:{
            handleChangeView:function($event){
                const component = event.currentTarget.className;
                this.currentView = component;
                this.activeIndex = component;
                this.title = event.currentTarget.firstElementChild.innerHTML;
            }
        },
        mounted() {
            const typeName = this.$route.params.typeName;//获取参数params typeName
            if (typeName !== 'HomePage'){
                const domLi = document.getElementById(typeName);
                const component = domLi.className;
                this.currentView = component;
                this.activeIndex = component;
                this.title = domLi.firstElementChild.innerHTML;
            }
        }
    }
</script>

<style scoped>

</style>
