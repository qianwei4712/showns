<template>
    <div class="methodologyIndex">
        <el-aside width="330px">
            <div style="height: 20px;">
                <!-- 空出一部分位置 -->
            </div>
            <ul class="sidebar-ul-padding">
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>设计模式</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li><a href="/" class="sidebar-link">关于 - 我</a></li>
                        </ul>
                    </section>
                </li>
            </ul>
        </el-aside>
    </div>
</template>

<script>
    export default {
        name: "methodologyIndex",
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
