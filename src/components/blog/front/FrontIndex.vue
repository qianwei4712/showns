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
                            <li v-on:click="handleChangeView($event)" class="EChartsMapFlyLine" id="frame">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='EChartsMapFlyLine'}">ECharts绘制地图飞线</a>
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
    import HomePage from "./FrontHome";
    import EChartsMapFlyLine from './frame/EChartsMapFlyLine.md';

    export default {
        name: "frontIndex",
        components:{
            HomePage, EChartsMapFlyLine
        },
        data(){
            return {
                title:'首页',
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
