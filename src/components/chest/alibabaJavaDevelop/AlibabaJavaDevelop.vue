<template>
    <div class="alibabaJavaDevelop">
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
                                <ul class="sidebar-links sidebar-group-items">
                                    <li v-for="item in eachType.data">
                                        <a :href="'#'+item.title" class="sidebar-link">{{item.title}}</a>
                                    </li>
                                </ul>
                            </section>
                        </a>
                    </li>
                </ul>
            </div>
            <!--功能主题-->
            <div class="tools-body">
                <div>
                    <h2>简要介绍</h2>
                    <div>
                        12345
                    </div>
                </div>
                <div>
                    <h2 id="编程规约">编程规约</h2>
                    <div>
                        <h3 id="命名风格">命名风格</h3>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                代码中的命名均不能以<span class="color-blue font-bold">下划线或美元符号</span>开始，也不能以<span class="color-blue font-bold">下划线或美元符号</span>结束。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span><span class="color-red">_name / __name / $name / name_ / name$ / name__</span>
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                代码中的命名严禁使用拼音与英文混合的方式，更不允许直接使用中文的方式。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>正确的英文拼写和语法可以让阅读者易于理解，避免歧义。注意，纯拼音命名方式更要避免采用。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>renminbi / alibaba / taobao / youku / hangzhou 等国际通用的名称，可视同英文。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>DaZhePromotion [打折] / getPingfenByName() [评分] / int 某变量 = 3
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                类名使用 UpperCamelCase 风格，但以下情形例外：DO / BO / DTO / VO / AO / PO / UID 等。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>JavaServerlessPlatform / UserDO / XmlService / TcpUdpDeal / TaPromotion
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>javaserverlessplatform / UserDo / XMLService / TCPUDPDeal / TAPromotion
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                方法名、参数名、成员变量、局部变量都统一使用 lowerCamelCase 风格，必须遵从驼峰形式。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>localValue / getHttpMessage() / inputUserId
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                常量命名全部大写，单词间用下划线隔开，力求语义表达完整清楚，不要嫌名字长。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>MAX_STOCK_COUNT / CACHE_EXPIRED_TIME
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>MAX_COUNT / EXPIRED_TIME
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                抽象类命名使用 Abstract 或 Base 开头；异常类命名使用 Exception 结尾；测试类命名以它要测试的类的名称开始，以 Test 结尾。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                类型与中括号紧挨相连来表示数组。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>定义整形数组 int[] arrayDemo;
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>在 main 参数中，使用 String args[]来定义。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                POJO 类中布尔类型变量都不要加 is 前缀，否则部分框架解析会引起序列化错误。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>在本文 MySQL 规约中的建表约定第一条，表达是与否的值采用 is_xxx 的命名方式，所以，需要在 resultMap 标签设置从 is_xxx 到 xxx 的映射关系。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>renminbi / alibaba / taobao / youku / hangzhou 等国际通用的名称，可视同英文。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>DaZhePromotion [打折] / getPingfenByName() [评分] / int 某变量 = 3
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                包名统一使用小写，点分隔符之间有且仅有一个自然语义的英语单词。包名统一使用<span class="color-blue font-bold">单数</span>形式，但是类名如果有复数含义，类名可以使用复数形式。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>应用工具类包名为 com.alibaba.ai.util、类名为 MessageUtils（此规则参考 spring 的框架结构）
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                避免在子父类的成员变量之间、或者不同代码块的局部变量之间采用完全相同的命名，使可读性降低。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>子类、父类成员变量名相同，即使是 public 类型的变量也是能够通过编译，而局部变量在同一方法内的不同代码块中同名也是合法的，但是要避免使用。对于非 setter/getter 的参数名称也要避免与成员变量名称相同。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>
                            </div>
                        </div>






                    </div>
                </div>
            </div>
        </el-main>
    </div>
</template>

<script>
    export default {
        name: "AlibabaJavaDevelop",
        data(){
            return {
                allTypes:[
                    {
                        name:'编程规约',
                        data:[
                            {title:'命名风格' }, {title:'常量定义' }, {title:'代码格式' }, {title:'OOP 规约' }, {title:'集合处理' }, {title:'并发处理' },
                            {title:'控制语句' }, {title:'注释规约' }, {title:'其它' }
                        ]
                    },{
                        name:'异常日志',
                        data:[
                            {title:'异常处理' }, {title:'日志规约' }
                        ]
                    },{
                        name:'单元测试'
                    },{
                        name:'安全规约'
                    },{
                        name:'MySQL 数据库',
                        data:[
                            {title:'建表规约' }, {title:'索引规约' }, {title:'SQL 语句' }, {title:'ORM 映射' }
                        ]
                    },{
                        name:'工程结构',
                        data:[
                            {title:'应用分层' }, {title:'二方库依赖' }, {title:'服务器' }
                        ]
                    },{
                        name:'设计规约'
                    },{
                        name:'附录',
                        data:[
                            {title:'附 1：版本历史' }, {title:'附 2：专有名词解释' }
                        ]
                    }
                ]
            }
        }
    }
</script>

<style scoped>
    li{
        list-style: none;
    }
    .tools-navige{
        z-index: 9999;
        top: 90px;
        bottom: 0;
        position: fixed;
        padding-left: 20px;
        overflow-y: scroll;
        background-color: white;
    }
    .tools-navige::-webkit-scrollbar {
        display: none;
    }
    .tools-body{
        position: fixed;
        left: 300px;
        top: 90px;
        bottom: 0;
        right: 50px;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .tools-body::-webkit-scrollbar {
        display: none;
    }
    .java-stand-content{
        font-size: 18px;
        margin-bottom: 40px;
    }
    .java-stand-content-item{
        text-indent: 20px;
        margin-bottom: 15px;
    }
    .java-stand-must{
        color: red;
        font-size: large;
        font-weight: bold;
    }
    .font-bold-20{
        font-size: 20px;
    }
    .font-bold{
        font-weight: bold;
    }
    .color-red{
        color: #ff0948;
    }
    .color-orange{
        color: #f32610;
    }
    .color-yellow{
        color: #ffa01f;
    }
    .color-green{
        color: green;
    }
    .color-blue{
        color: blue;
    }

</style>
