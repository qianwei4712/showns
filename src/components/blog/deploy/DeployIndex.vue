<template>
    <div class="DeployIndex">
        <el-aside width="330px">
            <div style="height: 20px;">
                <!-- 空出一部分位置 -->
            </div>
            <ul class="sidebar-ul-padding">
                <li>
                    <section class="sidebar-group">
                        <p class="HomePage sidebar-heading" v-on:click="handleChangeView($event)" >
                            <span>后续学习清单 💀</span>
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

    import HomePage from "./DeployHome";
    import SomethingNotes from './fqa/SomethingNotes.md';
    import CommonSoftwareDeploy from './server/CommonSoftwareDeploy.md';
    import LinuxRunJarBackground from './server/LinuxRunJarBackground.md';
    import NginxBindPortWithDomain from './server/NginxBindPortWithDomain.md';
    import LinuxCommonCommand from './server/LinuxCommonCommand.md';
    import DockerInstall from './server/DockerInstall.md';
    import CompareGetPsot from './fqa/CompareGetPsot.md';
    import UMLClassDi from './designpattern/UMLClassDi.md';
    import CreationMode from './designpattern/CreationMode.md';
    import StructuralMode from './designpattern/StructuralMode.md';
    import BehavioralMode from './designpattern/BehavioralMode.md';
    import SortingAlgorithm from './designpattern/SortingAlgorithm.md';
    import WhatisHash from './structure/WhatisHash.md';
    import TreeAndCommons from './structure/TreeAndCommons.md';
    import WhatisHeap from './structure/WhatisHeap.md';
    import HeapAndStack from './structure/HeapAndStack.md';
    import OpenSourceLicense from './fqa/OpenSourceLicense.md';
    import EbookOnline from './fqa/EbookOnline.md';
    import CommonlyUsedVocabulary from './fqa/CommonlyUsedVocabulary.md';
    import RegularExpression from './designpattern/RegularExpression.md';

    export default {
        name: "deployIndex",
        components:{
            HomePage,
            SomethingNotes, LinuxRunJarBackground, NginxBindPortWithDomain, CommonSoftwareDeploy,
            LinuxCommonCommand, DockerInstall, OpenSourceLicense, EbookOnline, UMLClassDi, CreationMode,
            StructuralMode, BehavioralMode, SortingAlgorithm, WhatisHash, TreeAndCommons, WhatisHeap, HeapAndStack,
            CompareGetPsot, RegularExpression, CommonlyUsedVocabulary
        },
        data(){
            return {
                title:'Java 从入门到入土👻',
                activeIndex: '',
                currentView: HomePage,
                allArtyles:[
                    {
                        title:'服务器',
                        data:[
                            {title:'常用软件安装', class:'CommonSoftwareDeploy', id:"server" },
                            {title:'Linux 常用命令', class:'LinuxCommonCommand' },
                            {title:'nginx 域名转发并配置SSL证书', class:'NginxBindPortWithDomain' },
                            {title:'Linux 服务器后台运行jar包', class:'LinuxRunJarBackground'},
                            {title:'docker 安装及基本用法', class:'DockerInstall'}
                        ]
                    }, {
                        title:'设计与方法论',
                        data:[
                          {title:'UML类图', class:'UMLClassDi', id:"designpattern" },
                          {title:'创建型模式', class:'CreationMode'},
                          {title:'结构型模式', class:'StructuralMode' },
                          {title:'行为型模式', class:'BehavioralMode' },
                          {title:'常用详解：正则表达式', class:'RegularExpression' }
                        ]
                    }, {
                        title:'算法与数据结构',
                        data:[
                          {title:'到底什么是 Hash', class:'WhatisHash', id:"structure" },
                          {title:'各类常用树的介绍', class:'TreeAndCommons' },
                          {title:'数据结构 - 堆（Heap）', class:'WhatisHeap' },
                          {title:'操作系统中heap和stack的区别', class:'HeapAndStack'},
                          {title:'排序算法', class:'SortingAlgorithm' }
                        ]
                      }, {
                        title:'散记',
                        data:[
                            {title:'常用软件下载链接', class:'SomethingNotes', id:"fqa" },
                            {title:'GET 和 POST 的真正区别', class:'CompareGetPsot' },
                            {title:'开源协议详解', class:'OpenSourceLicense'},
                            {title:'常见词汇和简写说明', class:'CommonlyUsedVocabulary'},
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
