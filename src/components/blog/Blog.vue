<template>
    <div class="blog">
        <el-container style="height: 100%">
            <el-header class="head-fixed">
                <!--页头左侧大标题-->
                <a href="/">
                    <span class="head-title">路的尽头在哪</span>
                </a>
                <!--页头右侧搜索框、分类-->
                <div class="head-right-div" style="float: right">

                    <!--搜索框，带提示效果-->
                    <!--<el-autocomplete
                            class="inline-input"
                            v-model="inputText" :fetch-suggestions="querySearch"
                            placeholder="请输入内容" :trigger-on-focus="false"
                            @select="handleSelect">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-autocomplete>-->

                    <!--java类分类-->
                    <el-dropdown class="head-type-ele">
                        <span class="el-dropdown-link">
                          Java<i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>Java面向对象基础</el-dropdown-item>
                            <el-dropdown-item>Java集合知识体系</el-dropdown-item>
                            <el-dropdown-item>Java I/O知识体系</el-dropdown-item>
                            <el-dropdown-item>Java多线程与并发</el-dropdown-item>
                            <el-dropdown-item>Java虚拟机</el-dropdown-item>
                            <el-dropdown-item divided>Java框架使用</el-dropdown-item>
                            <el-dropdown-item divided>FQA</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <!--前端知识分类-->
                    <el-dropdown class="head-type-ele">
                        <span class="el-dropdown-link">
                          前端<i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>JavaScript</el-dropdown-item>
                            <el-dropdown-item>Vue.js</el-dropdown-item>
                            <el-dropdown-item divided>框架工具</el-dropdown-item>
                            <el-dropdown-item divided>FQA</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <!--安装部署类-->
                    <el-dropdown class="head-type-ele">
                        <span class="el-dropdown-link">
                          安装/部署<i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>数据库</el-dropdown-item>
                            <el-dropdown-item divided>服务器</el-dropdown-item>
                            <el-dropdown-item divided>FQA</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <!--方法论-->
                    <el-dropdown class="head-type-ele">
                        <span class="el-dropdown-link">
                          方法论<i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>设计模式</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <!--静态资源介绍-->
                    <el-dropdown class="head-type-ele">
                        <a>
                            <span>关于</span>
                        </a>
                    </el-dropdown>
                </div>
            </el-header>
            <el-aside width="300px">
                <div style="height: 20px;">
                    <!-- 空出一部分位置 -->
                </div>
                <ul class="sidebar-ul-padding">
                    <li>
                        <section class="sidebar-group">
                            <p class="sidebar-heading">
                                <span>关于</span> <!---->
                            </p>
                            <ul class="sidebar-links sidebar-group-items">
                                <li><a href="/" class="sidebar-link active">关于 - 我</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 文档的内容</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 文档的排版</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 如何构建知识体系</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 如何自我驱动</a></li>
                            </ul>
                        </section>
                    </li>
                    <li>
                        <section class="sidebar-group">
                            <p class="sidebar-heading">
                                <span>关于</span> <!---->
                            </p>
                            <ul class="sidebar-links sidebar-group-items">
                                <li><a href="/" class="sidebar-link">关于 - 我</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 文档的内容</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 文档的排版</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 如何构建知识体系</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 如何自我驱动</a></li>
                            </ul>
                        </section>
                    </li>
                    <li>
                        <section class="sidebar-group">
                            <p class="sidebar-heading">
                                <span>关于</span> <!---->
                            </p>
                            <ul class="sidebar-links sidebar-group-items">
                                <li><a href="/" class="sidebar-link">关于 - 我</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 文档的内容</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 文档的排版</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 如何构建知识体系系系系系</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 如何自我驱动</a></li>
                            </ul>
                        </section>
                    </li>
                    <li>
                        <section class="sidebar-group">
                            <p class="sidebar-heading">
                                <span>关于</span> <!---->
                            </p>
                            <ul class="sidebar-links sidebar-group-items">
                                <li><a href="/" class="sidebar-link">关于 - 我</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 文档的内容</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 文档的排版</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 如何构建知识体系</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 如何自我驱动</a></li>
                            </ul>
                        </section>
                    </li>
                    <li>
                        <section class="sidebar-group">
                            <p class="sidebar-heading">
                                <span>关于</span> <!---->
                            </p>
                            <ul class="sidebar-links sidebar-group-items">
                                <li><a href="/" class="sidebar-link">关于 - 我</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 文档的内容</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 文档的排版</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 如何构建知识体系</a></li>
                                <li><a href="/" class="sidebar-link">关于 - 如何自我驱动</a></li>
                            </ul>
                        </section>
                    </li>
                </ul>
            </el-aside>
            <el-main>
                <!-- 主页面区 -->
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Blog",
        components: {
        }
    }
</script>

<style scoped>
    a {
        text-decoration: none
    }
</style>

