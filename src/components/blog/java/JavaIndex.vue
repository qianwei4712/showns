<template>
    <div class="javaIndex">
        <el-aside width="300px">
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
                            <li v-on:click="handleChangeView('OverrideEquals20180706', $event)"><a href="javascript:void(0);" class="sidebar-link">重写equals方法</a></li>
                            <li v-on:click="handleChangeView('OverrideHashCode20180709', $event)"><a href="javascript:void(0);" class="sidebar-link">重写hashCode方法</a></li>
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>Java集合知识体系</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li><a href="/" class="sidebar-link">关于 - 文档的内容</a></li>
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>Java I/O知识体系</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li><a href="/" class="sidebar-link">关于 - 文档的内容</a></li>
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>Java多线程与并发</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li><a href="/" class="sidebar-link">关于 - 文档的内容</a></li>
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>Java虚拟机</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li><a href="/" class="sidebar-link">关于 - 我</a></li>
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>Java框架使用</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li><a href="/" class="sidebar-link">关于 - 我</a></li>
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


    export default {
        name: "javaIndex",
        components:{
            javaHome,
            OverrideEquals20180706,
            OverrideHashCode20180709
        },
        data(){
            return {
                title:'首页',
                currentView: javaHome
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
