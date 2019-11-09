<template>
    <div class="javaIndex">
        <el-aside width="330px">
            <div style="height: 20px;">
                <!-- 空出一部分位置 -->
            </div>
            <ul class="sidebar-ul-padding">
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>Java面向对象基础</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li v-on:click="handleChangeView('OverrideEquals20180706', $event)">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='OverrideEquals20180706'}">重写equals方法</a>
                            </li>
                            <li v-on:click="handleChangeView('OverrideHashCode20180709', $event)">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='OverrideHashCode20180709'}">重写hashCode方法</a>
                            </li>
                            <li v-on:click="handleChangeView('UseEnumReplaceIntConst', $event)">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='UseEnumReplaceIntConst'}">用enum代替int常量</a>
                            </li>
                            <li v-on:click="handleChangeView('JavaAnnotation', $event)">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='JavaAnnotation'}">Java注解学习</a>
                            </li>
                            <li v-on:click="handleChangeView('HeapAndStack', $event)">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='HeapAndStack'}">操作系统中 heap 和 stack 的区别</a>
                            </li>
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>Java集合知识体系</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>Java I/O知识体系</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>Java多线程与并发</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li v-on:click="handleChangeView('ThreadInterrupt', $event)">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='ThreadInterrupt'}">Thread学习之线程中断</a>
                            </li>
                            <li v-on:click="handleChangeView('ThreadGuard', $event)">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='ThreadGuard'}">Thread学习之优先级及线程守护</a>
                            </li>
                            <li v-on:click="handleChangeView('ThreadSynchronized', $event)">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='ThreadSynchronized'}">Thread学习之synchronized</a>
                            </li>
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>Java虚拟机</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>Java框架使用</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li v-on:click="handleChangeView('SpringBootBindCustomPorps', $event)">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='SpringBootBindCustomPorps'}">SpringBoot配置文件自定义参数绑定失效</a>
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
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='SomethingNotes'}">平时用到的一些细节记录</a>
                            </li>
                            <li v-on:click="handleChangeView('EclipseSVNPrevious20181104', $event)">
                                <a href="javascript:void(0);" class="sidebar-link" v-bind:class="{ active:activeIndex==='EclipseSVNPrevious20181104'}">SVN - Previous operation has not finished异常</a>
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

    import javaHome from './JavaHome';
    import OverrideHashCode20180709 from './oopbase/OverrideHashCode20180709.md';
    import OverrideEquals20180706 from './oopbase/OverrideEquals20180706.md';
    import UseEnumReplaceIntConst from './oopbase/UseEnumReplaceIntConst.md';
    import JavaAnnotation from './oopbase/JavaAnnotation.md';
    import HeapAndStack from './oopbase/HeapAndStack.md';
    import EclipseSVNPrevious20181104 from './fqa/EclipseSVNPrevious20181104.md';
    import SomethingNotes from './fqa/SomethingNotes.md';
    import SpringBootBindCustomPorps from './frame/SpringBootBindCustomPorps.md';
    import ThreadInterrupt from './thread/ThreadInterrupt.md';
    import ThreadGuard from './thread/ThreadGuard.md';
    import ThreadSynchronized from './thread/ThreadSynchronized.md';


    export default {
        name: "javaIndex",
        components:{
            javaHome,
            OverrideEquals20180706, OverrideHashCode20180709, EclipseSVNPrevious20181104, SomethingNotes,
            SpringBootBindCustomPorps, UseEnumReplaceIntConst, ThreadInterrupt, ThreadGuard, ThreadSynchronized,
            JavaAnnotation, HeapAndStack
        },
        data(){
            return {
                title:'首页',
                activeIndex: '',
                currentView: javaHome
            }
        },
        methods:{
            handleChangeView:function(component, $event){
                this.currentView = component;
                this.activeIndex = component;
                this.title = event.currentTarget.firstElementChild.innerHTML;
            }
        }
    }
</script>

<style scoped>

</style>
