<template>
    <div class="frontIndex">
        <el-aside width="330px">
            <div style="height: 20px;">
                <!-- 空出一部分位置 -->
            </div>
            <ul class="sidebar-ul-padding">
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>Vue.js</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>框架工具</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li v-on:click="handleChangeView('EChartsMapFlyLine', $event)">
                                <a href="javascript:void(0);" class="sidebar-link">ECharts绘制地图飞线</a>
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
                            <li><a href="/" class="sidebar-link">关于 - 我</a></li>
                            <li><a href="/" class="sidebar-link">关于 - 如何构建知识体系</a></li>
                            <li><a href="/" class="sidebar-link">关于 - 如何自我驱动</a></li>
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
    import FrontHome from "./FrontHome";
    import EChartsMapFlyLine from './frame/EChartsMapFlyLine.md';

    export default {
        name: "frontIndex",
        components:{
            EChartsMapFlyLine
        },
        data(){
            return {
                title:'首页',
                currentView: FrontHome
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
