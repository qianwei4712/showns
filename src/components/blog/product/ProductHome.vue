<template>
    <div class="productHome read-only">
        <el-row :gutter="36">
            <el-col :span="6" v-for="(outerChain, index) in chanpins" :key="index">
                <a :href="outerChain.href" target="_blank">
                    <el-card shadow="hover">
                        <div class="item-title">
                            <span class="item-title-name">{{outerChain.title}}</span>
                            <span :title="outerChain.desc" class="item-desc">{{outerChain.desc}}</span>
                        </div>
                    </el-card>
                </a>
            </el-col>
        </el-row>
        <el-divider><span style="color: gray">我是有底线的</span></el-divider>
    </div>
</template>

<script>
    export default {
        name: "productHome",
        data(){
            return {
                chanpins:[
                    {title:'人人都是产品经理', href:'http://www.woshipm.com/', desc:'产品爱好者学习交流平台' },
                    {title:'阿猫阿狗导航', href:'https://dh.woshipm.com/', desc:'产品汪、运营喵必备' },
                    {title:'三顿PPT', href:'http://sandunppt.com/', desc:'一站式搞定 PPT 设计' },
                    {title:'PMCAFF', href:'https://coffee.pmcaff.com/', desc:'提供众多产品干货、资料及工具下载' },
                    {title:'36氪', href:'https://36kr.com/', desc:'上 36Kr，让一部分人先看到未来' },
                    {title:'墨刀', href:'https://www.modao.cc/', desc:'一款在线原型设计和远程协作平台' },
                    {title:'processOn', href:'https://www.processon.com/', desc:'免费在线作图、实时协作' },
                ]
            }
        }
    }
</script>

<style>
    .productHome .el-card__body {
        padding: 10px;
    }
    .productHome .el-col-6 {
        padding-bottom: 20px;
    }
</style>

<style scoped>
    .item-title{
        font-size: 15px;
        margin: 5px 0;
        color: #3eaf7c;
        white-space: nowrap;
    }
    .item-title-name{
        font-weight: bold;
    }
    .item-desc{
        font-size: 13px;
        color: #999;
        overflow: hidden;
        margin-left: 8px;
    }
</style>
