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
    import OpenSourceLicense from './fqa/OpenSourceLicense.md';
    import EbookOnline from './fqa/EbookOnline.md';
    import UMLClassDi from './designpattern/UMLClassDi.md';
    import CreationMode from './designpattern/CreationMode.md';
    import StructuralMode from './designpattern/StructuralMode.md';
    import BehavioralMode from './designpattern/BehavioralMode.md';
    import SortingAlgorithm from './algorithm/SortingAlgorithm.md';
    import WhatisHash from './structure/WhatisHash.md';
    import TreeAndCommons from './structure/TreeAndCommons.md';
    import WhatisHeap from './structure/WhatisHeap.md';
    import HeapAndStack from './structure/HeapAndStack.md';


    export default {
        name: "methodologyIndex",
        components:{
            HomePage,
            OpenSourceLicense, EbookOnline, UMLClassDi, CreationMode, StructuralMode, BehavioralMode,
            SortingAlgorithm, WhatisHash, TreeAndCommons, WhatisHeap, HeapAndStack
        },
        data(){
            return {
                title:'程序员方法论',
                activeIndex: '',
                currentView: HomePage,
                allArtyles:[
                    {
                        title:'操作系统及协议',
                        data:[
                            {title:'TCP/IP 协议详解', class:'tcpip', id:"systemAndAgreement" }
                        ]
                    },  {
                        title:'架构设计',
                        data:[
                        ]
                    }, {
                        title:'数据结构',
                        data:[
                            {title:'到底什么是 Hash', class:'WhatisHash', id:"structure" },
                            {title:'各类常用树的介绍', class:'TreeAndCommons' },
                            {title:'数据结构 - 堆（Heap）', class:'WhatisHeap' },
                            {title:'操作系统中heap和stack的区别', class:'HeapAndStack'}
                        ]
                    }, {
                        title:'算法',
                        data:[
                            {title:'排序算法', class:'SortingAlgorithm', id:"algorithm" }
                        ]
                    }, {
                        title:'设计模式',
                        data:[
                            {title:'UML类图', class:'UMLClassDi', id:"designpattern" },
                            {title:'创建型模式', class:'CreationMode'},
                            {title:'结构型模式', class:'StructuralMode' },
                            {title:'行为型模式', class:'BehavioralMode' }
                        ]
                    }, {
                        title:'FQA',
                        data:[
                            {title:'开源协议详解', class:'OpenSourceLicense', id:"fqa" },
                            {title:'在线电子书', class:'EbookOnline'}
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
