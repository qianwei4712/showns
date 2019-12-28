<template>
    <div class="about-content-div">
        <div class="website-content-div" style="padding-bottom: 0">
            本站使用Vue cli3脚手架搭建，使用Element UI框架，文章为markdown文件，使用插件转化为html。
        </div>
        <div class="website-content-div" style="padding-bottom: 0">
            本站参考自  <a href="https://www.pdai.tech/" target="_blank" class="origin">https://www.pdai.tech/</a>
        </div>
        <div class="website-content-div">
            目前部署于GitHub CNAME，速度略慢，请见谅
        </div>
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
                <el-timeline-item timestamp="2019/11/6" placement="top">
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
    .origin{
        text-decoration: none;
        color: #00b0e8;
    }
    .about-content-div{
        padding:5px 20px 0 20px;
    }
    .website-content-div{
        line-height: 34px;
        text-indent: 2em;
        font-family: cursive;
        font-weight: bolder;
        color: rgb(158, 158, 158);
        font-size: 21px;
        padding-bottom: 20px;
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
