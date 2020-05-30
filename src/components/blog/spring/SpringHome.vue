<template>
    <div class="springHome">
        <div style="text-align: center">
            <el-image class="java-route" :src="src" :preview-src-list="srcList"></el-image>
        </div>
    </div>
</template>

<script>
    export default {
        name: "springHome",
        data(){
            return {
                src:require('@/assets/blog/img/Spring.png'),
                srcList:[
                    require('@/assets/blog/img/Spring.png')
                ]
            }
        }
    }
</script>

<style scoped>

</style>
