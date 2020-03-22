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
                    </section>
                </li>
                <li v-for="artType in allArtyles">
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>{{artType.title}}</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li v-on:click="handleChangeView($event)" v-for="item in artType.data" :class="item.class" :id="item.id">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex===item.class}">{{item.title}}</a>
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
    import LinuxCommonCommand from './server/LinuxCommonCommand.md';
    import DockerInstall from './server/DockerInstall.md';
    import MysqldumpBackupSql from './database/MysqldumpBackupSql.md';
    import MysqlOptimization from './database/MysqlOptimization.md';
    import NginxLoadBalancing from './middleware/NginxLoadBalancing.md';

    export default {
        name: "deployIndex",
        components:{
            HomePage,
            SomethingNotes, LinuxRunJarBackground, NginxBindPortWithDomain, MysqldumpBackupSql, CommonSoftwareDeploy,
            LinuxCommonCommand, MysqlOptimization, NginxLoadBalancing, DockerInstall
        },
        data(){
            return {
                title:'平时工作中涉及到的安装部署',
                activeIndex: '',
                currentView: HomePage,
                allArtyles:[
                    {
                        title:'服务器',
                        data:[
                            {title:'常用软件安装', class:'CommonSoftwareDeploy', id:"server" },
                            {title:'Linux常用命令', class:'LinuxCommonCommand' },
                            {title:'nginx域名转发并配置SSL证书', class:'NginxBindPortWithDomain' },
                            {title:'Linux服务器后台运行jar包', class:'LinuxRunJarBackground'},
                            {title:'docker安装及基本用法', class:'DockerInstall'}
                        ]
                    }, {
                        title:'数据库',
                        data:[
                            {title:'MySQL优化原则', class:'MysqlOptimization', id:"database" },
                            {title:'使用mysqldump定时备份sql', class:'MysqldumpBackupSql'}
                        ]
                    }, {
                        title:'中间件',
                        data:[
                            {title:'Nginx负载均衡及双机主从模式', class:'NginxLoadBalancing', id:"middleware" }
                        ]
                    }, {
                        title:'FQA',
                        data:[
                            {title:'常用软件下载链接', class:'SomethingNotes', id:"fqa" }
                        ]
                    }
                ]
            }
        },
        mounted() {
            this.afterMounted();
        }
    }
</script>

<style scoped>

</style>
