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

    import HomePage from './SpringHome'
    import DataSummary from './base/DataSummary.md'
    import ArchitectureIntro from './base/ArchitectureIntro.md'
    import IoCAndDI from './base/IoCAndDI.md'
    import BeanConfigoure from './base/BeanConfigoure.md'

    export default {
        name: "springIndex",
        components:{
            HomePage,
            DataSummary, ArchitectureIntro, IoCAndDI, BeanConfigoure
        },
        data(){
            return {
                title:'Spring全家桶',
                activeIndex: '',
                currentView: HomePage,
                allArtyles:[
                    {
                        title:'Spring 基础',
                        data:[
                            {title:'Spring 资料汇总', class:'DataSummary', id:"base" },
                            {title:'Spring 架构介绍及本地搭建', class:'ArchitectureIntro' },
                            {title:'控制反转（IoC）、依赖注入（DI）', class:'IoCAndDI' },
                            {title:'Bean 管理，创建、注入方式', class:'BeanConfigoure' }
                        ]
                    },  {
                        title:'Spring Boot',
                        data:[]
                    }, {
                        title:'Spring cloud',
                        data:[]
                    }, {
                        title:'FQA',
                        data:[]
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
