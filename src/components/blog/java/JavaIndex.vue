<template>
    <div class="javaIndex">
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

    import HomePage from './JavaHome';
    import EncapInheritPolymo from './oopbase/EncapInheritPolymo.md';
    import InterAbstInner from './oopbase/InterAbstInner.md';
    import ExceptionAndSerializable from './oopbase/ExceptionAndSerializable.md';
    import CommonMethodAndEnum from './oopbase/CommonMethodAndEnum.md';
    import JavaAnnotation from './oopbase/JavaAnnotation.md';
    import HeapAndStack from './oopbase/HeapAndStack.md';
    import RunTimeReflect from './oopbase/RunTimeReflect.md';
    import EclipseSVNPrevious20181104 from './fqa/EclipseSVNPrevious20181104.md';
    import SomethingNotes from './fqa/SomethingNotes.md';
    import ThreadInterrupt from './thread/ThreadInterrupt.md';
    import ThreadGuard from './thread/ThreadGuard.md';
    import ThreadSynchronized from './thread/ThreadSynchronized.md';
    import CollectionRelationDiagram from './collections/CollectionRelationDiagram.md';
    import ArrayListSource from './collections/ArrayListSource.md';
    import LinkedListSource from './collections/LinkedListSource.md';
    import CollectionComparison from './collections/CollectionComparison.md';
    import VectorSource from './collections/VectorSource.md';
    import StackAndQueue from './collections/StackAndQueue.md';


    export default {
        name: "javaIndex",
        components:{
            HomePage,
            EclipseSVNPrevious20181104, SomethingNotes, CommonMethodAndEnum, RunTimeReflect,
            ThreadInterrupt, ThreadGuard, ThreadSynchronized,
            JavaAnnotation, HeapAndStack, EncapInheritPolymo, InterAbstInner, ExceptionAndSerializable,
            CollectionRelationDiagram, ArrayListSource, LinkedListSource, CollectionComparison, VectorSource,
            StackAndQueue
        },
        data(){
            return {
                title:'Java学习结构图',
                activeIndex: '',
                currentView: HomePage,
                allArtyles:[
                    {
                        title:'Java面向对象基础',
                        data:[
                            {title:'封装、继承、多态', class:'EncapInheritPolymo', id:"oopbase" },
                            {title:'接口、抽象类、内部类', class:'InterAbstInner'},
                            {title:'Java注解学习', class:'JavaAnnotation'},
                            {title:'异常、序列化', class:'ExceptionAndSerializable'},
                            {title:'Object通用方法、枚举', class:'CommonMethodAndEnum'},
                            {title:'类型信息、反射', class:'RunTimeReflect'}
                        ]
                    }, {
                        title:'Java集合知识体系',
                        data:[
                            {title:'集合类的关系图', class:'CollectionRelationDiagram', id:"collections" },
                            {title:'ArrayList 源码分析', class:'ArrayListSource' },
                            {title:'LinkedList 源码分析', class:'LinkedListSource' },
                            {title:'Vector 源码分析', class:'VectorSource' },
                            {title:'ArrayDeque 栈和队列的首选对象', class:'StackAndQueue' },
                            {title:'集合类常见比较', class:'CollectionComparison' }
                        ]
                    }, {
                        title:'Java I/O知识体系',
                        data:[]
                    }, {
                        title:'Java多线程与并发',
                        data:[
                            {title:'Thread学习之线程中断', class:'ThreadInterrupt', id:"thread" },
                            {title:'Thread学习之优先级及线程守护', class:'ThreadGuard'},
                            {title:'Thread学习之synchronized', class:'ThreadSynchronized'}
                        ]
                    }, {
                        title:'Java虚拟机',
                        data:[]
                    }, {
                        title:'FQA',
                        data:[
                            {title:'平时用到的一些细节记录', class:'SomethingNotes', id:"fqa" },
                            {title:'操作系统中heap和stack的区别', class:'HeapAndStack'},
                            {title:'SVN - Previous operation has not finished异常', class:'EclipseSVNPrevious20181104' }
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
