<template>
    <div class="javaHome">
        <div style="text-align: center">
            <el-image class="java-route" :src="src" :preview-src-list="srcList"></el-image>
        </div>
    </div>
</template>

<script>
    export default {
        name: "javaHome",
        data(){
            return {
                src:require('@/assets/blog/img/Java.png'),
                srcList:[
                    require('@/assets/blog/img/Java.png')
                ]
            }
        }
    }
</script>

<style scoped>

</style>
