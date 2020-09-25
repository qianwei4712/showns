<template>
    <div class="Footer">
        <el-footer>
            <div class="footer-div">
                <div class="footer-record-left read-only">
                    Made with <span class="footer-span-heart">♥</span> for the people of the internet
                    <a href="http://beian.miit.gov.cn/" target="_blank" style="color: rgb(158, 158, 158);margin-left: 40px">浙ICP备18006899号-2 </a> &nbsp;|&nbsp;
                    <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33028302000356" style="color: rgb(158, 158, 158);display:inline-block;text-decoration:none;height:20px;line-height:20px;"><img :src="gaba" style="float:left;"/>浙公网安备 33028302000356号</a>
                </div>
                <div class="footer-func-right">
                    <a href="mailto:qianwei4712@163.com" title="Email联系作者">
                        <i class="el-icon-message"></i>
                    </a>
                    <el-popover
                            placement="top-start"
                            title="如果开心的话，就请作者喝杯咖啡吧"
                            width="350" trigger="hover">
                        <el-image :src="src"></el-image>
                        <i class="el-icon-present" slot="reference"></i>
                    </el-popover>
                </div>
            </div>
        </el-footer>
    </div>
</template>

<script>
    export default {
        name: "Footer",
        data(){
            return{
                src:require('@/assets/home/img/thanks.png'),
                gaba:require('@/assets/home/img/gaba.png')
            }
        }
    }
</script>

<style scoped>
    .footer-div{
        height: 59px;
        border-top: 1px solid rgba(224,224,224,1);
    }
    .footer-span-heart{
        color: red;
        font-size: 20px;
    }
    .footer-record-left{
        text-align: center;
        color: rgb(158, 158, 158);
        line-height: 57px;
        width: 50%;
        float: left;
    }
    .footer-func-right{
        text-align: center;
        line-height: 57px;
        width: 30%;
        float: right;
    }
    i{
        color: #7e7e80;
        font-size: 22px;
        margin-right: 15px;
    }
</style>
