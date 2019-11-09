<template>
    <div class="home">
        <el-container style="height: 100%">
            <!-- 引入头部 -->
            <Header/>
            <el-container>
                <!-- 主页面区 -->
                <el-main>Main</el-main>
                <!-- 底部 -->
                <Footer/>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import Header from './incloude/Header'
    import Footer from './incloude/Footer'
    export default {
        name: "home",
        components:{
            Header, Footer
        }
    }
</script>

<style scoped>

</style>
