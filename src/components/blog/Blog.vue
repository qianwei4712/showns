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
                            <router-link :to="{ name: 'JavaType', params: { typeName: 'oopbase' }}">Java<i class="el-icon-caret-bottom el-icon--right"></i></router-link>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <router-link :to="{ name: 'JavaType', params: { typeName: 'oopbase' }}">
                                <el-dropdown-item>Java面向对象基础</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'JavaType', params: { typeName: 'collections' }}">
                                <el-dropdown-item>Java集合知识体系</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'JavaType', params: { typeName: 'iokonwledge' }}">
                                <el-dropdown-item>Java I/O知识体系</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'JavaType', params: { typeName: 'thread' }}">
                                <el-dropdown-item>Java多线程与并发</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'JavaType', params: { typeName: 'jvm' }}">
                                <el-dropdown-item>Java虚拟机</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'JavaType', params: { typeName: 'frame' }}">
                                <el-dropdown-item divided>Java框架使用</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'JavaType', params: { typeName: 'fqa' }}">
                                <el-dropdown-item divided>FQA</el-dropdown-item>
                            </router-link>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <!--前端知识分类-->
                    <el-dropdown class="head-type-ele">
                        <span class="el-dropdown-link">
                            <router-link :to="{ name: 'FrontType', params: { typeName: 'vuejs' }}">前端<i class="el-icon-caret-bottom el-icon--right"></i></router-link>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <router-link :to="{ name: 'FrontType', params: { typeName: 'vuejs' }}">
                                <el-dropdown-item>Vue.js</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'FrontType', params: { typeName: 'frame' }}">
                                <el-dropdown-item divided>框架工具</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'FrontType', params: { typeName: 'fqa' }}">
                                <el-dropdown-item divided>FQA</el-dropdown-item>
                            </router-link>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <!--安装部署类-->
                    <el-dropdown class="head-type-ele">
                        <span class="el-dropdown-link">
                            <router-link :to="{ name: 'DeployType', params: { typeName: 'database' }}">安装/部署<i class="el-icon-caret-bottom el-icon--right"></i></router-link>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <router-link :to="{ name: 'DeployType', params: { typeName: 'database' }}">
                                <el-dropdown-item>数据库</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'DeployType', params: { typeName: 'server' }}">
                                <el-dropdown-item divided>服务器</el-dropdown-item>
                            </router-link>
                            <router-link :to="{ name: 'DeployType', params: { typeName: 'fqa' }}">
                                <el-dropdown-item divided>FQA</el-dropdown-item>
                            </router-link>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <!--方法论-->
                    <el-dropdown class="head-type-ele">
                        <span class="el-dropdown-link">
                            <router-link :to="{ name: 'MethodologyType', params: { typeName: 'designpattern' }}">方法论<i class="el-icon-caret-bottom el-icon--right"></i></router-link>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <router-link :to="{ name: 'MethodologyType', params: { typeName: 'designpattern' }}">
                                <el-dropdown-item>设计模式</el-dropdown-item>
                            </router-link>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <!--静态资源介绍-->
                    <el-dropdown class="head-type-ele">
                        <span class="el-dropdown-link">
                          关于<i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>我也不知道要写啥</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <!--博客页面侧边栏、右侧主页面区-->
            <router-view></router-view>
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
    .router-link-active{
        text-decoration: none;
        color: #7e7e80;
    }
</style>

