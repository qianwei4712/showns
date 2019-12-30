<template>
    <div class="developeToolsHome">
        <!-- 主页面区 -->
        <el-main>
            <!--导航div-->
            <div class="tools-navige read-only">
                <ul class="sidebar-ul-padding">
                    <li>
                        <h2>目录</h2>
                    </li>
                    <li v-for="eachType in allTypes">
                        <a :href="'#'+eachType.name">
                            <section class="sidebar-group">
                                <p class="sidebar-heading">
                                    <span>{{eachType.name}}</span>
                                </p>
                            </section>
                        </a>
                    </li>
                </ul>
            </div>
            <!--功能主题-->
            <div class="tools-body">
                <div v-for="eachType in allTypes">
                    <h2 :id="eachType.name">{{eachType.name}}</h2>
                    <div>
                        <el-row :gutter="36">
                            <el-col :span="4" v-for="(tool, index) in eachType.data" :key="index">
                                <a :href="tool.href" target="_blank">
                                    <el-card shadow="hover">
                                        {{tool.title}}
                                    </el-card>
                                </a>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
        </el-main>
    </div>
</template>

<script>
    export default {
        name: "DevelopeToolsHome",
        data(){
            return {
                allTypes:[
                    {
                        name:'开发工具',
                        data:[
                            {title:'正则验证测试' },
                            {title:'二维码生成器' },
                            {title:'时间戳格式转换' },
                            {title:'颜色格式转化' },
                            {title:'cron表达式' }
                        ]
                    },{
                        name:'编码转换',
                        data:[
                        ]
                    },{
                        name:'加密解密',
                        data:[
                        ]
                    },{
                        name:'代码格式化',
                        data:[
                            {title:'Json格式化' },
                            {title:'xml格式化' },
                            {title:'sql格式化' }
                        ]
                    },{
                        name:'图片工具',
                        data:[
                            {title:'Base64图片转换' }
                        ]
                    },{
                        name:'其他工具',
                        data:[
                            {title:'数字转大写/人民币' },
                            {title:'地图经纬度获取' },
                            {title:'键值/编码对照表' },
                            {title:'身份证生成器' }
                        ]
                    }
                ]
            }
        }
    }
</script>

<style scoped>
    .el-col-4{
        padding-bottom: 20px;
    }
    li{
        list-style: none;
    }
    .tools-navige{
        z-index: 9999;
        position: fixed;
        padding-left: 20px;
    }
    .tools-body{
        width: 100%;
        padding-left: 300px;
    }
</style>
