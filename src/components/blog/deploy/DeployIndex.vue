<template>
    <div class="DeployIndex">
        <el-aside width="300px">
            <div style="height: 20px;">
                <!-- 空出一部分位置 -->
            </div>
            <ul class="sidebar-ul-padding">
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>数据库</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li><a href="/" class="sidebar-link active">关于 - 我</a></li>
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>服务器</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li><a href="/" class="sidebar-link">关于 - 我</a></li>
                            <li><a href="/" class="sidebar-link">关于 - 如何自我驱动</a></li>
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>FQA</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li><a href="/" class="sidebar-link">关于 - 我</a></li>
                            <li><a href="/" class="sidebar-link">关于 - 如何构建知识体系</a></li>
                            <li><a href="/" class="sidebar-link">关于 - 如何自我驱动</a></li>
                        </ul>
                    </section>
                </li>
            </ul>
        </el-aside>
    </div>
</template>

<script>
    export default {
        name: "deployIndex",
        components:{
        },
        data(){
            return {
                currentView: ''
            }
        },
        methods:{
            handleChangeView:function(component){
                this.currentView = component;
            }
        }
    }
</script>

<style scoped>

</style>
