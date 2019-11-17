<template>
    <div class="methodologyIndex">
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

    import HomePage from './MethodologyHome'
    import DecoratorMode from './designpattern/DecoratorMode.md';
    import FactoryAndSingletonsMode from './designpattern/FactoryAndSingletonsMode.md';
    import ObserverMode from './designpattern/ObserverMode.md';
    import StrategyMode from './designpattern/StrategyMode.md';


    export default {
        name: "methodologyIndex",
        components:{
            HomePage,
            DecoratorMode, FactoryAndSingletonsMode, ObserverMode, StrategyMode
        },
        data(){
            return {
                title:'程序员方法论',
                activeIndex: '',
                currentView: HomePage,
                allArtyles:[
                    {
                        title:'设计模式',
                        data:[
                            {title:'策略模式', class:'StrategyMode', id:"designpattern" },
                            {title:'观察者模式', class:'ObserverMode' },
                            {title:'装饰者模式', class:'DecoratorMode' },
                            {title:'工厂模式和单例模式', class:'FactoryAndSingletonsMode' }
                        ]
                    }, {
                        title:'排序算法',
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
