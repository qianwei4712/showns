<template>
    <div class="blog">
        <el-container style="height: 100%">
            <!-- 引入头部 -->
            <Header/>
            <!--博客页面侧边栏、右侧主页面区-->
            <router-view></router-view>
        </el-container>
    </div>
</template>

<script>
    import Header from '../incloude/Header';
    export default {
        name: "Blog",
        components: {
            Header
        }
    }
</script>

<style scoped>

</style>

