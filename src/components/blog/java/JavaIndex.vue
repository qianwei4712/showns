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
    import RunTimeReflect from './oopbase/RunTimeReflect.md';
    import Java8NewChara from './oopbase/Java8NewChara.md';
    import OldBoysThoughts from './fqa/OldBoysThoughts.md';
    import SomethingNotes from './fqa/SomethingNotes.md';
    import ThreadTheoryBase from './thread/ThreadTheoryBase.md';
    import ThreadBaseConcept from './thread/ThreadBaseConcept.md';
    import Synchronized from './thread/Synchronized.md';
    import CollectionRelationDiagram from './collections/CollectionRelationDiagram.md';
    import ArrayListSource from './collections/ArrayListSource.md';
    import LinkedListSource from './collections/LinkedListSource.md';
    import CollectionComparison from './collections/CollectionComparison.md';
    import VectorSource from './collections/VectorSource.md';
    import StackAndQueue from './collections/StackAndQueue.md';
    import PriorityQueueSource from './collections/PriorityQueueSource.md';
    import HashMapSource from './collections/HashMapSource.md';
    import AboutUtilSet from './collections/AboutUtilSet.md';
    import TreeMapSource from './collections/TreeMapSource.md';
    import JudgeThreadPoolDone from './fqa/JudgeThreadPoolDone.md';
    import CookieAndSession from './fqa/CookieAndSession.md';
    import LinkedHashMap from './collections/LinkedHashMap.md';
    import WeakHashMap from './collections/WeakHashMap.md';
    import JvmTotalSee from './jvm/JvmTotalSee.md';
    import ByteCodeFile from './jvm/ByteCodeFile.md';
    import ClassLoader from './jvm/ClassLoader.md';
    import RuntimeStruc from './jvm/RuntimeStruc.md';
    import ExecutionEngine from './jvm/ExecutionEngine.md';
    import GarbageCollection from './jvm/GarbageCollection.md';
    import GcAlgorithmn from './jvm/GcAlgorithmn.md';
    import MonitorTools from './jvm/MonitorTools.md';
    import Volatile from './thread/Volatile.md';
    import AtomicCasUnSafe from './thread/AtomicCasUnSafe.md';


    export default {
        name: "javaIndex",
        components:{
            HomePage,
            SomethingNotes, CommonMethodAndEnum, RunTimeReflect, Java8NewChara,
            OldBoysThoughts, ThreadBaseConcept,
            JavaAnnotation, EncapInheritPolymo, InterAbstInner, ExceptionAndSerializable,
            CollectionRelationDiagram, ArrayListSource, LinkedListSource, CollectionComparison, VectorSource,
            StackAndQueue, PriorityQueueSource, ThreadTheoryBase, HashMapSource, AboutUtilSet,
            TreeMapSource, JudgeThreadPoolDone, CookieAndSession, LinkedHashMap, WeakHashMap,
            JvmTotalSee, ByteCodeFile, ClassLoader, RuntimeStruc, ExecutionEngine, GarbageCollection, GcAlgorithmn,
            Synchronized, MonitorTools, Volatile, AtomicCasUnSafe
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
                            {title:'类型信息、反射', class:'RunTimeReflect'},
                            {title:'Java 8 新特性', class:'Java8NewChara'}
                        ]
                    }, {
                        title:'Java集合知识体系',
                        data:[
                            {title:'集合类的关系图', class:'CollectionRelationDiagram', id:"collections" },
                            {title:'Collection - ArrayList 源码分析', class:'ArrayListSource' },
                            {title:'Collection - LinkedList 源码分析', class:'LinkedListSource' },
                            {title:'Collection - Vector 源码分析', class:'VectorSource' },
                            {title:'Collection - ArrayDeque 栈和队列的首选对象', class:'StackAndQueue' },
                            {title:'Collection - PriorityQueue 源码分析', class:'PriorityQueueSource' },
                            {title:'Map - 侃晕面试官的HashMap源码', class:'HashMapSource' },
                            {title:'Map - TreeMap 源码解读', class:'TreeMapSource' },
                            {title:'Collection - HashSet & TreeSet', class:'AboutUtilSet' },
                            {title:'Map - LinkedHashMap 源码解读', class:'LinkedHashMap' },
                            {title:'Map - WeakHashMap 源码解读', class:'WeakHashMap' },
                            {title:'集合类常见比较', class:'CollectionComparison' }
                        ]
                    }, {
                        title:'Java I/O知识体系',
                        data:[]
                    }, {
                        title:'Java多线程与并发',
                        data:[
                            {title:'并发理论基础', class:'ThreadTheoryBase', id:"thread" },
                            {title:'Java 线程基础概念', class:'ThreadBaseConcept' },
                            {title:'关键字 synchronized 介绍', class:'Synchronized' },
                            {title:'关键字 volatile 介绍', class:'Volatile' },
                            {title:'JUC原子类: CAS、Unsafe、原子类详解', class:'AtomicCasUnSafe' }
                        ]
                    }, {
                        title:'Java虚拟机',
                        data:[
                            {title:'JVM 资料汇总', class:'JvmTotalSee', id:"jvm" },
                            {title:'JVM 基础：虚拟机及字节码文件', class:'ByteCodeFile' },
                            {title:'JVM 基础：类加载机制介绍', class:'ClassLoader' },
                            {title:'JVM 基础：运行时数据区模型解读', class:'RuntimeStruc' },
                            {title:'JVM 基础：执行引擎工作原理', class:'ExecutionEngine' },
                            {title:'JVM 基础：垃圾回收算法和概念', class:'GcAlgorithmn' },
                            {title:'JVM 基础：垃圾收集器', class:'GarbageCollection' },
                            {title:'调优排错：性能监控命令及工具', class:'MonitorTools' }
                        ]
                    }, {
                        title:'散记',
                        data:[
                            {title:'大佬们的思想 - 博客汇总', class:'OldBoysThoughts', id:"fqa" },
                            {title:'发在 CSDN 不配单独提出来', class:'SomethingNotes'},
                            {title:'判断线程池任务全部完成的姿势', class:'JudgeThreadPoolDone'},
                            {title:'cookie 和 session 解读', class:'CookieAndSession'}
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
