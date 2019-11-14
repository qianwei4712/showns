<template>
    <div class="DeployIndex">
        <el-aside width="330px">
            <div style="height: 20px;">
                <!-- 空出一部分位置 -->
            </div>
            <ul class="sidebar-ul-padding">
                <li>
                    <section class="sidebar-group">
                        <p class="HomePage sidebar-heading" v-on:click="handleChangeView($event)" >
                            <span>总览</span>
                        </p>
                        <p class="sidebar-heading">
                            <span>服务器</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li v-on:click="handleChangeView($event)" class="CommonSoftwareDeploy" id="server">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='CommonSoftwareDeploy'}">常用软件安装</a>
                            </li>
                            <li v-on:click="handleChangeView($event)" class="NginxBindPortWithDomain">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='NginxBindPortWithDomain'}">nginx域名转发并配置SSL证书</a>
                            </li>
                            <li v-on:click="handleChangeView($event)" class="LinuxRunJarBackground">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='LinuxRunJarBackground'}">Linux服务器后台运行jar包</a>
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
                            <li v-on:click="handleChangeView($event)" class="MysqldumpBackupSql" id="database">
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
    import MysqldumpBackupSql from './database/MysqldumpBackupSql.md';

    export default {
        name: "deployIndex",
        components:{
            HomePage,
            SomethingNotes, LinuxRunJarBackground, NginxBindPortWithDomain, MysqldumpBackupSql, CommonSoftwareDeploy
        },
        data(){
            return {
                title:'平时工作中涉及到的安装部署',
                activeIndex: '',
                currentView: HomePage
            }
        },
        mounted() {
            this.afterMounted();
        }
    }
</script>

<style scoped>

</style>
