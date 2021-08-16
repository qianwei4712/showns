<template>
    <div class="springIndex">
        <el-aside width="330px">
            <div style="height: 20px;">
                <!-- 空出一部分位置 -->
            </div>
            <ul class="sidebar-ul-padding">
                <li>
                    <section class="sidebar-group">
                        <p class="HomePage sidebar-heading" v-on:click="handleChangeView($event)" >
                            <span>Spring 资料汇总</span>
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

    import HomePage from './SpringHome'
    import ArchitectureIntro from './base/ArchitectureIntro.md'
    import IoCAndDI from './base/IoCAndDI.md'
    import BeanConfigoure from './base/BeanConfigoure.md'
    import VersionSelect from './fqa/VersionSelect.md'
    import SomethingNotes from './fqa/SomethingNotes.md'
    import LogbackIntegre from './boot/LogbackIntegre.md'
    import ActiveMqIntegre from './boot/ActiveMqIntegre.md'

    export default {
        name: "springIndex",
        components:{
            HomePage,
            ArchitectureIntro, IoCAndDI, BeanConfigoure, VersionSelect, SomethingNotes,
            LogbackIntegre, ActiveMqIntegre
        },
        data(){
            return {
                title:'Spring 全家桶',
                activeIndex: '',
                currentView: HomePage,
                allArtyles:[
                    {
                        title:'Spring 基础',
                        data:[
                            {title:'Spring 架构介绍及本地搭建', class:'ArchitectureIntro', id:"base"  },
                            {title:'控制反转（IoC）、依赖注入（DI）', class:'IoCAndDI' },
                            {title:'Bean 管理，创建、注入方式', class:'BeanConfigoure' }
                        ]
                    },  {
                        title:'Spring Boot',
                        data:[
                          {title:'SpringBoot - logback 日志配置', class:'LogbackIntegre', id:"boot"  },
                          {title:'SpringBoot - activeMQ 消息队列', class:'ActiveMqIntegre'}
                        ]
                    }, {
                        title:'Spring cloud',
                        data:[]
                    }, {
                        title:'FQA',
                        data:[
                          {title:'SpringCloud 版本及对应关系', class:'VersionSelect', id:"fqa" },
                          {title:'发在 CSDN 不配单独提出来', class:'SomethingNotes'}
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
