<template>
    <div class="Footer">
        <el-footer>
            <div class="footer-div">
                <div class="footer-record-left">
                    浙ICP备18006899号 | ©shiva - Made with <span class="footer-span-heart">♥</span> for the people of the internet.
                </div>
                //TODO 底部功能区，发送邮件，之类的
                <div class="footer-func-right">
                    浙ICP备18006899号-1 | © 2019-present shiva- Made with ♥ for the people of the internet.
                </div>
            </div>
        </el-footer>
    </div>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style scoped>
    .footer-div{
        height: calc(100% - 1px);
        border-top: 1px solid rgba(224,224,224,1);
    }
    .footer-span-heart{
        color: red;
        font-size: 20px;
    }
    .footer-record-left{
        text-align: center;
        color: rgb(158, 158, 158);
        line-height: 59px;
        width: 70%
    }
    .footer-func-right{

    }
</style>
