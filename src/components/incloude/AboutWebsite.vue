<template>
    <div class="about-content-div">
        <div class="title-div text-center">
            本站里程碑
        </div>
        <div>
            <el-timeline>
                <el-timeline-item timestamp="2019/11/14" placement="top">
                    <el-card>
                        初步完成静态页面，部署上线，开始逐步添加文章
                    </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2019/11/4" placement="top">
                    <el-card>
                        工作需要，开始学习Vue.js，了解Vue Router，Vue cli3
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>
        <div class="copy-font">
            人生没有白走的路
        </div>
    </div>
</template>

<script>
    export default {
        name: "AboutWebsite",
        data() {
            return {}
        }
    }
</script>

<style scoped>
    .about-content-div{
        padding:5px 20px 0 20px;
    }
    .title-div{
        text-indent: 2em;
        font-family: cursive;
        font-weight: bolder;
        font-size: 21px;
        margin-bottom: 20px;
    }
    .copy-font{
        padding-top: 20px;
        font-family: cursive;
        text-indent: 2em;
        font-weight: bolder;
        font-size: 21px;
    }
</style>
