<template>
    <div class="deployHome">
        <div style="text-align: center">
            <el-image class="java-route" :src="src" :preview-src-list="srcList"></el-image>
        </div>
    </div>
</template>

<script>
    export default {
        name: "deployHome",
        data(){
            return {
                src:require('@/assets/blog/img/deploy.png'),
                srcList:[
                    require('@/assets/blog/img/deploy.png')
                ]
            }
        }
    }
</script>

<style scoped>

</style>
