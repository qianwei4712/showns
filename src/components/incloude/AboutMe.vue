<template>
    <div class="about-content-div">
        <div class="text-center">
            <el-avatar :size="150" :src="src"></el-avatar>
        </div>
        <div class="show-label-div text-center">
            <el-tag v-for="item in showLabels" :key="item.index" class="show-label" type="danger" effect="plain">{{item}}</el-tag>
        </div>
        <div class="show-content">
            感谢这位小美女，在作者编写本站所有源码和文章时，在一旁端茶送水、洗衣叠被、捏肩捶腿、打扫卫生、陪吃陪喝、日以继夜......
        </div>
        <div class="show-content">
            秀秀同志，党和人民会永远记住你的！！！
        </div>
        <el-divider></el-divider>
        <div class="author-content">
            作者的技术栈都在站里有了，也就不比比了，想要本站源码的，可以邮箱索取。
        </div>
        <div class="text-center">
            <a href="mailto:qianwei4712@163.com" class="el-button el-button--primary">联系作者：qianwei4712@163.com</a>
        </div>
        <div class="copy-font">
            © 2019 shiva 版权所有
        </div>
    </div>
</template>

<script>
    export default {
        name: "AboutMe",
        data(){
            return {
                src:require('@/assets/home/img/show.png'),
                showLabels:['稀里糊涂', '傻里傻气', '迷迷糊糊', '懵懵懂懂']
            }
        }
    }
</script>

<style scoped>
    .about-content-div{
        padding:5px 20px 0 20px;
    }
    .show-label{
        margin-right: 15px;
    }
    .show-label-div{
        padding: 20px 0 20px 0;
    }
    .copy-font{
        color: rgb(158, 158, 158);
        padding-top: 20px;
    }
    .show-content{
        line-height: 34px;
        text-indent: 2em;
        font-family: cursive;
        font-weight: bolder;
        color: #ff4f4f;
        font-size: 21px;
    }
    .author-content{
        line-height: 34px;
        text-indent: 2em;
        font-family: cursive;
        font-weight: bolder;
        color: rgb(158, 158, 158);
        font-size: 21px;
        padding-bottom: 20px;
    }
    a{
        text-decoration: none;
    }
</style>
