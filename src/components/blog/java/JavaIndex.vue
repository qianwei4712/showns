<template>
    <div class="javaIndex">
        <el-aside width="300px">
            <div style="height: 20px;">
                <!-- 空出一部分位置 -->
            </div>
            <ul class="sidebar-ul-padding">
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>Java面向对象基础</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <router-link :to="{ name: 'OverrideEquals20180706'}">
                                <li><a href="javascript:void(0);" class="sidebar-link">重写equals方法</a></li>
                            </router-link>
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>Java集合知识体系</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li><a href="/" class="sidebar-link">关于 - 文档的内容</a></li>
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>Java I/O知识体系</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li><a href="/" class="sidebar-link">关于 - 文档的内容</a></li>
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>Java多线程与并发</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li><a href="/" class="sidebar-link">关于 - 文档的内容</a></li>
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>Java虚拟机</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li><a href="/" class="sidebar-link">关于 - 我</a></li>
                        </ul>
                    </section>
                </li>
                <li>
                    <section class="sidebar-group">
                        <p class="sidebar-heading">
                            <span>Java框架使用</span>
                        </p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li><a href="/" class="sidebar-link">关于 - 我</a></li>
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
                        </ul>
                    </section>
                </li>
            </ul>
        </el-aside>
    </div>
</template>

<script>
    export default {
        name: "javaIndex"
    }
</script>

<style scoped>

</style>
