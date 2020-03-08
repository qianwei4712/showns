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
                            {title:'Linux公社', href:'https://www.linuxidc.com/', img:require('@/assets/chest/img/linuxidc.jpg'), desc:'Linux系统门户网站' },
                            {title:'掘金', href:'https://juejin.im/', img:require('@/assets/chest/img/juejin.svg'), desc:'掘金是一个帮助开发者成长的社区，是一个面向互联网技术人的内容分享平台' },
                            {title:'知否', href:'https://segmentfault.com/', img:require('@/assets/chest/img/segmentfault.png'), desc:'中国领先的开发者技术社区' },
                            {title:'V2EX', href:'https://www.v2ex.com/', img:require('@/assets/chest/img/V2EX.png'), desc:'程序猿灌水社区' }
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
                            {title:'Maven', href:'https://mvnrepository.com/', img:require('@/assets/chest/img/maven.png'), desc:'Maven 仓库检索, 非常常用' }
                        ]
                    },
                    {
                        name:'前端开发',
                        data:[
                            {title:'Layui', href:'https://www.layui.com/doc/', img:require('@/assets/chest/img/layui.png'), desc:'一款采用自身模块规范编写的前端 UI 框架' },
                            {title:'VUE', href:'https://cn.vuejs.org/', img:require('@/assets/chest/img/vuejs.png'), desc:'渐进式JavaScript 框架' },
                            {title:'Element-UI', href:'https://element.eleme.cn/#/zh-CN', img:require('@/assets/chest/img/element.png'), desc:'Element，一套为开发者、设计师和产品经理准备的基于 Vue 2.0 的桌面端组件库' },
                            {title:'JQuery API', href:'http://jquery.cuishifeng.cn/', img:require('@/assets/chest/img/jquery.png'), desc:'一个快速、简洁的JavaScript框架' },
                            {title:'ECharts', href:'https://www.echartsjs.com/examples/zh/index.html', img:require('@/assets/chest/img/echarts.png'), desc:'百度开发的可定制的数据可视化图表, 已经捐给Apache' }
                        ]
                    },
                    {
                        name:'其他资源',
                        data:[
                            {title:'Java规约', href:'/chest/alibabaJavaDevelop', img:require('@/assets/chest/img/alibabajava.jpg'), desc:'Java 开发手册-华山版，阿里巴巴以及社区开发者共同完成' },
                            {title:'脚本之家', href:'http://tools.jb51.net/', img:require('@/assets/chest/img/jiaobenzhijia.png'), desc:'脚本之家旗下的工具箱' },
                            {title:'iconfont', href:'https://www.iconfont.cn/', img:require('@/assets/chest/img/iconfont.png'), desc:'阿里妈妈MUX倾力打造的矢量图标管理、交流平台。设计师将图标上传到Iconfont平台，用户可以自定义下载多种格式的icon，平台也可将图标转换为字体，便于前端工程师自由调整与调用' },
                            {title:'智图', href:'https://zhitu.isux.us/', img:require('@/assets/chest/img/zhitu.png'), desc:'腾讯出品在线图片压缩 支持转成 webP 处理静态图片时候很好用' },
                            {title:'processOn', href:'https://www.processon.com/', img:require('@/assets/chest/img/processOn.png'), desc:'免费在线作图、实时协作，支持流程图、思维导图、原型图、UML、网络拓扑图、组织结构图等' },
                            {title:'墨刀', href:'https://modao.cc/', img:require('@/assets/chest/img/modao.svg'), desc:'专业、可靠、简洁、易懂的在线产品原型设计与协作平台' },
                            {title:'On Java 8', href:'https://lingcoder.gitee.io/onjava8/', img:require('@/assets/chest/img/onjava8.jpg'), desc:'Java编程思想第五版，大神翻译中文版' },
                            {title:'三顿ppt', href:'https://sandunppt.com/', img:require('@/assets/chest/img/sandun.jpg'), desc:'一站式PPT导航站点' },
                            {title:'Smartpdf', href:'https://smallpdf.com/cn', img:require('@/assets/chest/img/smartpdf.svg'), desc:'功能一应俱全、简单好用的线上PDF工具' },
                            {title:'百度翻译', href:'https://fanyi.baidu.com/', img:require('@/assets/chest/img/baidufanyi.svg'), desc:'英语渣的无地自容' }
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
