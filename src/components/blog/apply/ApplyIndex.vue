<template>
    <div class="ApplyIndex">
        <el-aside width="330px">
            <div style="height: 20px;">
                <!-- 空出一部分位置 -->
            </div>
            <ul class="sidebar-ul-padding">
                <li>
                    <section class="sidebar-group">
                        <p class="HomePage sidebar-heading" v-on:click="handleChangeView($event)" >
                            <span>遇到过的问题解决方案🔥</span>
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

    import HomePage from "./ApplyHome";
    import NginxLoadBalancing from './middleware/NginxLoadBalancing.md';
    import TomcatOptimize from './middleware/TomcatOptimize.md';
    import MqCompare from './middleware/MqCompare.md';
    import RabbitMqBase from './middleware/RabbitMqBase.md';
    import RabbitMqHighClass from './middleware/RabbitMqHighClass.md';
    import MybatisPlusDbs from './frame/MybatisPlusDbs.md';
    import MysqldumpBackupSql from './tool/MysqldumpBackupSql.md';
    import DockerGiteaMysql from './fqa/DockerGiteaMysql.md';
    import SomethingNotes from './fqa/SomethingNotes.md';
    import JenkinsGiteeNpmBuild from './tool/JenkinsGiteeNpmBuild.md';
    import JenkinsMavenDockerfile from './tool/JenkinsMavenDockerfile.md';

    export default {
        name: "applyIndex",
        components:{
            HomePage,
            NginxLoadBalancing, TomcatOptimize, MqCompare, MybatisPlusDbs, MysqldumpBackupSql,
            DockerGiteaMysql, JenkinsGiteeNpmBuild, JenkinsMavenDockerfile, SomethingNotes,
            RabbitMqBase, RabbitMqHighClass
        },
        data(){
            return {
                title:'不 996，住进 ICU 哪有钱看病❤',
                activeIndex: '',
                currentView: HomePage,
                allArtyles:[
                    {
                       title:'框架',
                       data:[
                         {title:'Mybatis-Plus 多数据源', class:'MybatisPlusDbs', id:"frame" }
                       ]
                    }, {
                        title:'中间件',
                        data:[
                            {title:'Nginx 负载均衡及双机主从模式', class:'NginxLoadBalancing', id:"middleware" },
                            {title:'Tomcat 8 参数配置性能优化', class:'TomcatOptimize' },
                            {title:'MQ 的作用及主流 MQ 对比', class:'MqCompare' },
                            {title:'RabbitMQ 安装及基础使用', class:'RabbitMqBase' },
                            {title:'RabbitMQ 死信队列、延迟队列', class:'RabbitMqHighClass' }
                        ]
                    },{
                        title:'工具',
                        data:[
                          {title:'使用mysqldump定时备份sql', class:'MysqldumpBackupSql', id:"tool" },
                          {title:'Jenkins、Gitee 自动化部署', class:'JenkinsGiteeNpmBuild' },
                          {title:'Jenkins、Dockerfile 容器部署', class:'JenkinsMavenDockerfile' }
                        ]
                    }, {
                        title:'散记',
                        data:[
                          {title:'发在 CSDN 不配单独提出来', class:'SomethingNotes', id:"fqa"},
                          {title:'Docker、Gitea、Mysql 企业仓库', class:'DockerGiteaMysql'}
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
