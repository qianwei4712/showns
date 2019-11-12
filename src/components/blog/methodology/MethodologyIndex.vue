<template>
    <div class="methodologyIndex">
        <el-aside width="330px">
            <div style="height: 20px;">
                <!-- 空出一部分位置 -->
            </div>
            <ul class="sidebar-ul-padding">
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>设计模式</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li v-on:click="handleChangeView($event)" class="StrategyMode" id="designpattern">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='StrategyMode'}">策略模式</a>
                            </li>
                            <li v-on:click="handleChangeView($event)" class="ObserverMode">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='ObserverMode'}">观察者模式</a>
                            </li>
                            <li v-on:click="handleChangeView($event)" class="DecoratorMode">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='DecoratorMode'}">装饰者模式</a>
                            </li>
                            <li v-on:click="handleChangeView($event)" class="FactoryAndSingletonsMode">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='FactoryAndSingletonsMode'}">工厂模式和单例模式</a>
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
