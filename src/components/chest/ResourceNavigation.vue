<template>
    <div class="resourceNavigation">
        <!-- 主页面区 -->
        <el-main>
            <div class="read-only">
                <div v-for="eachType in allTypes">
                    <h2>{{eachType.name}}</h2>
                    <div>
                        <el-row :gutter="36">
                            <el-col :span="4" v-for="(outerChain, index) in eachType.data" :key="index">
                                <a :href="outerChain.href" target="_blank">
                                    <el-card shadow="hover">
                                        <div class="item-title">
                                            <img :src="outerChain.img" class="item-title-img" alt="" />
                                            <div class="item-title-name">{{outerChain.title}}</div>
                                        </div>
                                        <div :title="outerChain.desc" class="item-desc">{{outerChain.desc}}</div>
                                    </el-card>
                                </a>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <el-divider><span style="color: gray">我是有底线的</span></el-divider>
            </div>
        </el-main>
    </div>
</template>

<script>
    export default {
        name: "resourceNavigation",
        components:{
        },
        data(){
            return {
                allTypes:[
                    {
                        name:'技术社区',
                        data:[
                            {title:'CDSN', href:'https://www.csdn.net/', img:require('@/assets/chest/img/csdn.gif'), desc:'中国专业IT社区CSDN' },
                            {title:'OSChina', href:'https://www.oschina.net/', img:require('@/assets/chest/img/oschina.gif'), desc:'中国最大的开源技术社区' },
                            {title:'', href:'https://stackoverflow.com/', img:require('@/assets/chest/img/stackoverflow.png'), desc:'Stack Overflow是一个与程序相关的IT技术问答网站' },
                            {title:'掘金', href:'https://juejin.im/', img:require('@/assets/chest/img/juejin.svg'), desc:'掘金是一个帮助开发者成长的社区，是一个面向互联网技术人的内容分享平台' },
                            {title:'知否', href:'https://segmentfault.com/', img:require('@/assets/chest/img/segmentfault.png'), desc:'中国领先的开发者技术社区' }
                        ]
                    },
                    {
                        name:'项目产品',
                        data:[
                          {title:'人人都是产品经理', href:'http://www.woshipm.com/', img:require('@/assets/chest/img/rrdscp.png'), desc:'产品爱好者学习交流平台' },
                          {title:'阿猫阿狗导航', href:'https://dh.woshipm.com/', img:require('@/assets/chest/img/amagdh.png'), desc:'产品汪、运营喵必备' },
                          {title:'三顿PPT', href:'http://sandunppt.com/', img:require('@/assets/chest/img/sdppt.png'), desc:'一站式搞定 PPT 设计' },
                          {title:'', href:'https://coffee.pmcaff.com/', img:require('@/assets/chest/img/pmcaff.png'), desc:'提供众多产品干货、资料及工具下载' },
                          {title:'36氪', href:'https://36kr.com/', img:require('@/assets/chest/img/36kr.png'), desc:'上 36Kr，让一部分人先看到未来' }
                        ]
                    },
                    {
                        name:'源码练习',
                        data:[
                            {title:'Gitee', href:'https://gitee.com/', img:require('@/assets/chest/img/gitee.png'), desc:'开源中国旗下的代码托管平台：码云' },
                            {title:'GitHub', href:'https://github.com/', img:require('@/assets/chest/img/github.png'), desc:'GitHub是一个面向开源及私有软件项目的托管平台' },
                            {title:'LeetCode', href:'https://leetcode-cn.com/problemset/all/', img:require('@/assets/chest/img/leetcode.svg'), desc:'leetcode中国区，算法在线训练' }
                        ]
                    },
                    {
                        name:'基础教程',
                        data:[
                            {title:'', href:'https://www.runoob.com/', img:require('@/assets/chest/img/cainiao.png'), desc:'菜鸟教程集合' },
                            {title:'W3School', href:'https://www.w3school.com.cn/', img:require('@/assets/chest/img/w3school.png'), desc:'W3School 是因特网上最大的 WEB 开发者资源，其中包括全面的教程、完善的参考手册以及庞大的代码库' },
                            {title:'W3Cschool', href:'https://www.w3cschool.cn/tutorial', img:require('@/assets/chest/img/w3cschool.png'), desc:'w3cschool主要为初学者技术的人员提供在线学习教程和日常技术资料查询服务' },
                            {title:'', href:'https://www.liaoxuefeng.com/', img:require('@/assets/chest/img/miaoxuefeng.png'), desc:'精品编程教程技术大牛博客' }
                        ]
                    },
                    {
                        name:'后台开发',
                        data:[
                            {title:'Spring', href:'https://spring.io/projects/spring-boot', img:require('@/assets/chest/img/spring.png'), desc:'Spring框架是一个开放源代码的J2EE应用程序框架' },
                            {title:'MyBatis', href:'http://www.mybatis.org/mybatis-3/zh/index.html', img:require('@/assets/chest/img/mybatis.png'), desc:'MyBatis 是一款优秀的持久层框架，它支持定制化 SQL、存储过程以及高级映射。' },
                            {title:'Maven', href:'https://mvnrepository.com/', img:require('@/assets/chest/img/maven.png'), desc:'Maven 仓库检索, 非常常用' },
                            {title:'Docker Hub', href:'https://hub.docker.com/', img:require('@/assets/chest/img/docker.png'), desc:'Docker源代码管理集成，也用于构建和测试工具来加速部署周期。' }
                        ]
                    },
                    {
                        name:'前端开发',
                        data:[
                            {title:'Layui', href:'https://www.layui.com/doc/', img:require('@/assets/chest/img/layui.png'), desc:'一款采用自身模块规范编写的前端 UI 框架' },
                            {title:'VUE', href:'https://cn.vuejs.org/', img:require('@/assets/chest/img/vuejs.png'), desc:'渐进式JavaScript 框架' },
                            {title:'Element-UI', href:'https://element.eleme.cn/#/zh-CN', img:require('@/assets/chest/img/element.png'), desc:'Element，一套为开发者、设计师和产品经理准备的基于 Vue 2.0 的桌面端组件库' },
                            {title:'Vant Weapp', href:'https://vant-contrib.gitee.io/vant-weapp/#/intro', img:require('@/assets/chest/img/vant weapp.png'), desc:'有赞出品移动端 Vue 组件库 Vant 的小程序版本，两者基于相同的视觉规范，提供一致的 API 接口，助力开发者快速搭建小程序应用' },
                            {title:'JQuery API', href:'http://jquery.cuishifeng.cn/', img:require('@/assets/chest/img/jquery.png'), desc:'一个快速、简洁的JavaScript框架' },
                            {title:'ECharts', href:'https://www.echartsjs.com/examples/zh/index.html', img:require('@/assets/chest/img/echarts.png'), desc:'百度开发的可定制的数据可视化图表, 已经捐给Apache' }
                        ]
                    },
                    {
                        name:'其他资源',
                        data:[
                            {title:'脚本之家', href:'http://tools.jb51.net/', img:require('@/assets/chest/img/jiaobenzhijia.png'), desc:'脚本之家旗下的工具箱' },
                            {title:'iconfont', href:'https://www.iconfont.cn/', img:require('@/assets/chest/img/iconfont.png'), desc:'阿里妈妈MUX倾力打造的矢量图标管理、交流平台。设计师将图标上传到Iconfont平台，用户可以自定义下载多种格式的icon，平台也可将图标转换为字体，便于前端工程师自由调整与调用' },
                            {title:'微信公众平台', href:'https://mp.weixin.qq.com/', img:require('@/assets/chest/img/wechat.png'), desc:'微信公众平台入口，小程序还是很好用的' },
                            {title:'百度翻译', href:'https://fanyi.baidu.com/', img:require('@/assets/chest/img/baidufanyi.svg'), desc:'英语渣的无地自容' },
                            {title:'', href:'https://www.json.cn/', img:require('@/assets/chest/img/Json.png'), desc:'Json 在线格式化' },
                            {title:'时间戳', href:'http://www.metools.info/code/c31.html', img:require('@/assets/chest/img/metools.png'), desc:'在线时间戳转化工具' }
                        ]
                    },
                    {
                        name:'友情链接',
                        data:[
                            {title:'Java 全栈知识体系', href:'https://www.pdai.tech/', img:require('@/assets/chest/img/pdai.jpg'), desc:'pdai 的个人博客，本站也是受此启发和激励才建立' },
                            {title:'技术驿站', href:'http://cmsblogs.com?vip=1', img:require('@/assets/chest/img/logo-cmsblogs.png'), desc:'死磕 Java 全系列，优质博客集中' }
                        ]
                    }
                ]
            }
        }
    }
</script>

<style scoped>
    .el-divider{
        margin-bottom: 0;
    }
    .el-col-4{
        padding-bottom: 20px;
    }
    .resourceNavigation{
        overflow: hidden;
    }
    .item-title{
        font-size: 15px;
        margin: 5px 0;
        height: 40px;
        line-height: 40px;
        color: #3eaf7c;
        white-space: nowrap;
    }
    .item-title-name{
        height: 40px;
        float: right;
        font-weight: bold;
    }
    .item-title-img{
        height: 35px;
    }
    .item-desc{
        margin-top: 10px;
        font-size: 13px;
        color: #999;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        height: 37px;
        margin-bottom: 5px;
        overflow: hidden;
    }
</style>
