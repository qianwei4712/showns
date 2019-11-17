<template>
    <div class="frontIndex">
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
    import HomePage from "./FrontHome";
    import EChartsMapFlyLine from './frame/EChartsMapFlyLine.md';

    export default {
        name: "frontIndex",
        components:{
            HomePage, EChartsMapFlyLine
        },
        data(){
            return {
                title:'前端界面开发记录',
                activeIndex: '',
                currentView: HomePage,
                allArtyles:[
                    {
                        title:'Vue.js',
                        data:[]
                    }, {
                        title:'框架工具',
                        data:[
                            {title:'ECharts绘制地图飞线', class:'EChartsMapFlyLine', id:"frame" }

                        ]
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
