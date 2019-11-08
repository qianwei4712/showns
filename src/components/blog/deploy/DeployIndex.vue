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
                            <span>数据库</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li v-on:click="handleChangeView('MysqldumpBackupSql', $event)">
                                <a href="javascript:void(0);" class="sidebar-link">使用mysqldump定时备份sql</a>
                            </li>
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>服务器</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li v-on:click="handleChangeView('LinuxRunJarBackground', $event)">
                                <a href="javascript:void(0);" class="sidebar-link">Linux服务器后台运行jar包</a>
                            </li>
                            <li v-on:click="handleChangeView('NginxBindPortWithDomain', $event)">
                                <a href="javascript:void(0);" class="sidebar-link">nginx将多个不同域名转发到不同端口</a>
                            </li>
                            <li v-on:click="handleChangeView('NginxAndTomcatConfigSSL', $event)">
                                <a href="javascript:void(0);" class="sidebar-link">nginx+tomcat配置项目https加密</a>
                            </li>
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>FQA</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li v-on:click="handleChangeView('SomethingNotes', $event)">
                                <a href="javascript:void(0);" class="sidebar-link">平时用到的一些细节记录</a>
                            </li>
                        </ul>
                    </section>
                </li>
            </ul>
        </el-aside>
        <!-- 主页面区 -->
        <el-main>
            <div class="markdown-body main-md-body">
                <h1 v-html="title">首页</h1>
                <component :is="currentView"></component>
            </div>
        </el-main>
    </div>
</template>

<script>

    import deployHome from "./DeployHome";
    import SomethingNotes from './fqa/SomethingNotes.md';
    import LinuxRunJarBackground from './server/LinuxRunJarBackground.md';
    import NginxBindPortWithDomain from './server/NginxBindPortWithDomain.md';
    import NginxAndTomcatConfigSSL from './server/NginxAndTomcatConfigSSL.md';
    import MysqldumpBackupSql from './database/MysqldumpBackupSql.md';

    export default {
        name: "deployIndex",
        components:{
            deployHome,
            SomethingNotes, LinuxRunJarBackground, NginxBindPortWithDomain, NginxAndTomcatConfigSSL,
            MysqldumpBackupSql
        },
        data(){
            return {
                title:'首页',
                currentView: deployHome
            }
        },
        methods:{
            handleChangeView:function(component, $event){
                this.currentView = component;
                this.title = event.currentTarget.firstElementChild.innerHTML;
            }
        }
    }
</script>

<style scoped>

</style>
