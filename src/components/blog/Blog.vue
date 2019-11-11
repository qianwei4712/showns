<template>
    <div class="blog">
        <el-container style="height: 100%">
            <!-- 引入头部 -->
            <Header/>
            <!--博客页面侧边栏、右侧主页面区-->
            <router-view></router-view>
            <!-- 返回顶部组件 -->
            <BackTop/>
        </el-container>
    </div>
</template>

<script>
    import Header from '../incloude/Header';
    import BackTop from "../incloude/BackTop";
    export default {
        name: "Blog",
        components: {
            Header, BackTop
        }
    }
</script>

<style scoped>

</style>

