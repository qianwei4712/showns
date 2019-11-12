<template>
    <div class="home">
        <el-container style="height: 100%">
            <!-- 引入头部 -->
            <Header/>
            <el-container>
                <!-- 主页面区 -->
                <el-main>
                    <div style="height: 100%">
                        <!--首页描述区域-->
                        <div class="discr">
                            <div class="discr-content read-only">
                                做人最重要的是开心
                            </div>
                            <div class="discr-pic">
                                <img :src="src" alt=""/>
                            </div>
                            <router-link :to="{ name: 'JavaType', params: { typeName: 'HomePage' }}">
                                <el-button type="primary">快速开始<i class="el-icon-right el-icon--right"></i></el-button>
                            </router-link>
                        </div>
                        <div class="fes">
                            <div class="fe" v-for="item in fes">
                                <div class="fe-title read-only" >
                                    <h2>{{item.title}}</h2>
                                    <p>{{item.content}}</p>
                                </div>
                            </div>
                        </div>
                        <div class="show">
                            <div class="show-content read-only">
                                show
                            </div>
                        </div>
                    </div>
                    <BackTop/>
                </el-main>
                <!-- 底部 -->
                <Footer/>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import Header from './incloude/Header'
    import Footer from './incloude/Footer'
    import BackTop from "./incloude/BackTop";
    export default {
        name: "home",
        components:{
            Header, Footer, BackTop
        },
        data(){
            return{
                src:require('@/assets/home/img/happy1.jpg'),
                fes:[
                    {title:"基础还是要有的", content:"基本的Java、Html、Linux和DB使用是基础，该会的先得学会"},
                    {title:"知识需要有条理", content:"原本我也是用到什么学什么，后来遇到问题就得一遍遍查资料"},
                    {title:"相关信息多了解", content:"很多知识都是有关系的，涉及内容不会也得有印象"}
                ]
            }
        }
    }
</script>

<style scoped>
    .discr{
        margin: 0 auto;
        width: 800px;
        text-align: center;
        border-bottom: 2px solid #eaecef;
    }
    .discr-content{
        padding: 30px 0;
        height: 40px;
        font-size: 30px;
        font-weight: bold;
        font-family: "Source Sans Pro", Helvetica, Arial, sans-serif;
    }
    .discr-pic{
        padding: 10px 0 40px 0;
    }
    .el-button{
        margin-bottom: 50px;
    }
    .fes{
        width: 800px;
        margin: 0 auto;
        min-height: 230px;
        border-bottom: 2px solid #eaecef;
    }
    .fe{
        width: calc(33.333% - 30px);
        float: left;
        padding: 0 15px 0 15px;
        margin-top: 30px;
    }
    .fe-title h2{
        font-size: 1.4rem;
        font-weight: 500;
        border-bottom: none;
        padding-bottom: 0;
        color: #3a5169;
    }
    .fe-title p{
        color: #4e6e8e;
        font-size: 17px;
        margin-top: 30px;
    }
    .show{
        margin: 0 auto;
        width: 800px;
        text-align: center;
    }
    .show-content{
        padding: 15px 0;
        height: 40px;
        font-size: 30px;
        font-weight: bold;
        color: deeppink;
        font-family: "Source Sans Pro", Helvetica, Arial, sans-serif;
    }
</style>
