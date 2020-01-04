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
                    <h1>简要介绍</h1>
                    <div>
                        《Java 开发手册》是阿里巴巴集团技术团队的集体智慧结晶和经验总结，经历了多次大规模一线实战的检验及不断完善，公开到业界后，众多社区开发者踊跃参与，共同打磨完善，系统化地整理成册。现代软件行业的高速发展对开发者的综合素质要求越来越高，因为不仅是编程知识点，其它维度的知识点也会影响到软件的最终交付质量。
                    </div>
                </div>
                <div>
                    <h1 id="编程规约">编程规约</h1>
                    <div>
                        <h2 id="命名风格">命名风格</h2>
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
                                <br>
                                <img :src="java1" alt=""/>
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                杜绝完全不规范的缩写，避免望文不知义。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>AbstractClass“缩写”命名成 AbsClass；condition“缩写”命名成 condi，此类随意缩写严重降低了代码的可阅读性。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>
                                为了达到代码自解释的目标，任何自定义编程元素在命名时，使用尽量完整的单词组合来表达其意。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>在 JDK 中，表达原子更新的类名为：AtomicReferenceFieldUpdater。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>int a 的随意命名方式。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>
                                在常量与变量的命名时，表示类型的名词放在词尾，以提升辨识度。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>startTime / workQueue / nameList / TERMINATED_THREAD_COUNT
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>startedAt / QueueOfWork / listName / COUNT_TERMINATED_THREAD
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>
                                如果模块、接口、类、方法使用了设计模式，在命名时需体现出具体模式。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>将设计模式体现在名字中，有利于阅读者快速理解架构设计理念。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>public class OrderFactory;  public class LoginProxy;  public class ResourceObserver;
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>
                                接口类中的方法和属性不要加任何修饰符号（public 也不要加），保持代码的简洁性，并加上有效的 Javadoc 注释。尽量不要在接口里定义变量，如果一定要定义变量，肯定是与接口方法相关，并且是整个应用的基础常量。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>接口方法签名 void commit();  接口基础常量 String COMPANY = "alibaba";
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>接口方法定义 public abstract void f();
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>JDK8 中接口允许有默认实现，那么这个 default 方法，是对所有实现类都有价值的默认实现。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                对于 Service 和 DAO 类，基于 SOA 的理念，暴露出来的服务一定是接口，内部的实现类用 Impl 的后缀与接口区别。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>CacheServiceImpl 实现 CacheService 接口。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>
                                如果是形容能力的接口名称，取对应的形容词为接口名（通常是–able 的形容词）。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>AbstractTranslator 实现 Translatable 接口。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-refer">【参考】</span>
                                枚举类名带上 Enum 后缀，枚举成员名称需要全大写，单词间用下划线隔开。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>枚举其实就是特殊的类，域成员均为常量，且构造方法被默认强制是私有。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>枚举名字为 ProcessStatusEnum 的成员名称：SUCCESS / UNKNOWN_REASON。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-refer">【参考】</span>
                                Service/DAO 层方法命名规约
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>
                            </div>
                            <div class="java-stand-content-item">
                                1） 获取单个对象的方法用 get 做前缀。
                            </div>
                            <div class="java-stand-content-item">
                                2） 获取多个对象的方法用 list 做前缀，复数形式结尾如：listObjects。
                            </div>
                            <div class="java-stand-content-item">
                                3） 获取统计值的方法用 count 做前缀。
                            </div>
                            <div class="java-stand-content-item">
                                4） 插入的方法用 save/insert 做前缀。
                            </div>
                            <div class="java-stand-content-item">
                                5） 删除的方法用 remove/delete 做前缀。
                            </div>
                            <div class="java-stand-content-item">
                                6） 修改的方法用 update 做前缀。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-refer">【参考】</span>
                                领域模型命名规约
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>
                            </div>
                            <div class="java-stand-content-item">
                                1） 数据对象：xxxDO，xxx 即为数据表名。
                            </div>
                            <div class="java-stand-content-item">
                                2） 数据传输对象：xxxDTO，xxx 为业务领域相关的名称。
                            </div>
                            <div class="java-stand-content-item">
                                3） 展示对象：xxxVO，xxx 一般为网页名称。
                            </div>
                            <div class="java-stand-content-item">
                                4） POJO 是 DO/DTO/BO/VO 的统称，禁止命名成 xxxPOJO。
                            </div>
                        </div>


                        <h2 id="常量定义">常量定义</h2>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                不允许任何魔法值（即未经预先定义的常量）直接出现在代码中。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>String key = "Id#taobao_" + tradeId;    cache.put(key, value);
                                <span class="color-green">// 缓存 get 时，由于在代码复制时，漏掉下划线，导致缓存击穿而出现问题</span>
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                在 long 或者 Long 赋值时，数值后使用大写的 L，不能是小写的 l，小写容易跟数 字 1 混淆，造成误解。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>Long a = 2l; 写的是数字的 21，还是 Long 型的 2。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>
                                不要使用一个常量类维护所有常量，要按常量功能进行归类，分开维护。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>大而全的常量类，杂乱无章，使用查找功能才能定位到修改的常量，不利于理解和维护。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>缓存相关常量放在类 CacheConsts 下；系统配置相关常量放在类 ConfigConsts 下。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>常量的复用层次有五层：跨应用共享常量、应用内共享常量、子工程内共享常量、 包内共享常量、类内共享常量。<br>
                            </div>
                            <div class="java-stand-content-item font-bold-20">
                                1） 跨应用共享常量：放置在二方库中，通常是 client.jar 中的 constant 目录下。<br>
                            </div>
                            <div class="java-stand-content-item font-bold-20">
                                2） 应用内共享常量：放置在一方库中，通常是子模块中的 constant 目录下。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>易懂变量也要统一定义成应用内共享常量，两位工程师在两个类中分别定义了“YES”的变量：
                            </div>
                            <div class="java-stand-content-item">
                                类 A 中：public static final String YES = "yes";
                            </div>
                            <div class="java-stand-content-item">
                                类 B 中：public static final String YES = "y";
                            </div>
                            <div class="java-stand-content-item">
                                A.YES.equals(B.YES)，预期是 true，但实际返回为 false，导致线上问题。
                            </div>
                            <div class="java-stand-content-item font-bold-20">
                                3） 子工程内部共享常量：即在当前子工程的 constant 目录下。
                            </div>
                            <div class="java-stand-content-item font-bold-20">
                                4） 包内共享常量：即在当前包下单独的 constant 目录下。
                            </div>
                            <div class="java-stand-content-item font-bold-20">
                                5） 类内共享常量：直接在类内部 private static final 定义。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>
                                如果变量值仅在一个固定范围内变化用 enum 类型来定义。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>如果存在名称之外的延伸属性应使用 enum 类型，下面正例中的数字就是延伸信息，表示一年中的第几个季节。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>
                                <br>
                                <img :src="java2" alt=""/>
                            </div>
                        </div>


                        <h2 id="代码格式">代码格式</h2>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                如果是大括号内为空，则简洁地写成{}即可，大括号中间无需换行和空格；如果是非空代码块则：<br>
                            </div>
                            <div class="java-stand-content-item font-bold-20">
                                1） 左大括号前不换行。
                            </div>
                            <div class="java-stand-content-item font-bold-20">
                                2） 左大括号后换行。
                            </div>
                            <div class="java-stand-content-item font-bold-20">
                                3） 右大括号前换行。
                            </div>
                            <div class="java-stand-content-item font-bold-20">
                                4） 右大括号后还有 else 等代码则不换行；表示终止的右大括号后必须换行。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                左小括号和字符之间不出现空格；同样，右小括号和字符之间也不出现空格；而左大括号前需要空格。详见第 5 条下方正例提示。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>if (空格 a == b 空格)
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                if/for/while/switch/do 等保留字与括号之间都必须加空格。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                任何二目、三目运算符的左右两边都需要加一个空格。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>运算符包括赋值运算符=、逻辑运算符&&、加减乘除符号等。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                采用 4 个空格缩进，禁止使用 tab 字符。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>（涉及 1-5 点）
                                <br>
                                <img :src="java3" alt=""/>
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                注释的双斜线与注释内容之间有且仅有一个空格。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>// 这是示例注释，请注意在双斜线之后有一个空格
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                在进行类型强制转换时，右括号与强制转换值之间不需要任何空格隔开。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>long first = 1000000000000L;  int second = (int)first + 2;
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                单行字符数限制不超过 120 个，超出需要换行，换行时遵循如下原则：
                            </div>
                            <div class="java-stand-content-item font-bold-20">
                                1）第二行相对第一行缩进 4 个空格，从第三行开始，不再继续缩进，参考示例。<br>
                            </div>
                            <div class="java-stand-content-item font-bold-20">
                                2）运算符与下文一起换行。<br>
                            </div>
                            <div class="java-stand-content-item font-bold-20">
                                3）方法调用的点符号与下文一起换行。<br>
                            </div>
                            <div class="java-stand-content-item font-bold-20">
                                4）方法调用中的多个参数需要换行时，在逗号后进行。<br>
                            </div>
                            <div class="java-stand-content-item font-bold-20">
                                5）在括号前不要换行，见反例。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>
                                <br>
                                <img :src="java4" alt=""/>
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>
                                <br>
                                <img :src="java5" alt=""/>
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                方法参数在定义和传入时，多个参数逗号后边必须加空格。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>例中实参的 args1，后边必须要有一个空格。 method(args1, args2, args3);
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                IDE 的 text file encoding 设置为 UTF-8; IDE 中文件的换行符使用 Unix 格式，不要使用 Windows 格式。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>
                                单个方法的总行数不超过 80 行。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>除注释之外的方法签名、左右大括号、方法内代码、空行、回车及任何不可见字符的总行数不超过80行。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>代码逻辑分清红花和绿叶，个性和共性，绿叶逻辑单独出来成为额外方法，使主干代码更加清晰；共性逻辑抽取成为共性方法，便于复用和维护。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>
                                没有必要增加若干空格来使变量的赋值等号与上一行对应位置的等号对齐。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>
                                <br>
                                <img :src="java6" alt=""/>
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>增加 sb 这个变量，如果需要对齐，则给 one、two、three 都要增加几个空格，在变量比较多的情况下，是非常累赘的事情。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>
                                不同逻辑、不同语义、不同业务的代码之间插入一个空行分隔开来以提升可读性。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>任何情形，没有必要插入<span class="color-blue font-bold">多个空行</span>进行隔开。
                            </div>
                        </div>



                        <h2 id="OOP 规约">OOP 规约</h2>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                避免通过一个类的对象引用访问此类的静态变量或静态方法，无谓增加编译器解析成本，直接用<span class="color-blue font-bold">类名</span>来访问即可。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                所有的覆写方法，必须加@Override 注解。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>getObject()与 get0bject()的问题。一个是字母的 O，一个是数字的 0，加@Override 可以准确判断是否覆盖成功。另外，如果在抽象类中对方法签名进行修改，其实现类会马上编译报错。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                相同参数类型，相同业务含义，才可以使用 Java 的可变参数，避免使用 Object。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>可变参数必须放置在参数列表的最后。（提倡同学们尽量不用可变参数编程）
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>public List&gt;User&lt; listUsers(String type, Long... ids) {...}
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                外部正在调用或者二方库依赖的接口，不允许修改方法签名，避免对接口调用方产生影响。接口过时必须加@Deprecated 注解，并清晰地说明采用的新接口或者新服务是什么。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                不能使用过时的类或方法。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>java.net.URLDecoder 中的方法 decode(String encodeStr) 这个方法已经过时，应该使用双参数 decode(String source, String encode)。接口提供方既然明确是过时接口，那么有义务同时提供新的接口；作为调用方来说，有义务去考证过时方法的新实现是什么。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                Object 的 equals 方法容易抛空指针异常，应使用常量或确定有值的对象来调用equals。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>public List&lt;User&gt; listUsers(String type, Long... ids) {...}
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>object.equals("test");
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>"test".equals(object);
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                所有整型包装类对象之间<span class="color-blue font-bold">值的比较</span>，全部使用 equals 方法比较。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>对于 Integer var = ? 在<span class="color-blue font-bold">-128 至 127</span> 范围内的赋值，Integer 对象是在 IntegerCache.cache 产生，会复用已有对象，这个区间内的 Integer 值可以直接使用==进行判断，但是这个区间之外的所有数据，都会在堆上产生，并不会复用已有对象，这是一个大坑，推荐使用 equals 方法进行判断。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                浮点数之间的等值判断，基本数据类型不能用==来比较，包装数据类型不能用equals 来判断。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>浮点数采用“尾数+阶码”的编码方式，类似于科学计数法的“有效数字+指数”的表示方式。二进制无法精确表示大部分的十进制小数，具体原理参考《码出高效》。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>
                                <br>
                                <img :src="java7" alt=""/>
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>
                                <br>
                                <img :src="java8" alt=""/>
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                定义数据对象 DO 类时，属性类型要与数据库字段类型相匹配。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>数据库字段的 bigint 必须与类属性的 Long 类型相对应。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>某个案例的数据库表 id 字段定义类型 bigint unsigned，实际类对象属性为 Integer，随着 id 越来越大，超过 Integer 的表示范围而溢出成为负数。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                为了防止精度损失，禁止使用构造方法 BigDecimal(double)的方式把 double 值转化为 BigDecimal 对象。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>BigDecimal(double)存在精度损失风险，在精确计算或值比较的场景中可能会导致业务逻辑异常。 如：BigDecimal g = new BigDecimal(0.1f); 实际的存储值为：0.10000000149
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>
                                <br>
                                <img :src="java7" alt=""/>
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>优先推荐入参为 String 的构造方法，或使用 BigDecimal 的 valueOf 方法，此方法内部其实执行了 Double 的 toString，而 Double 的 toString 按 double 的实际能表达的精度对尾数进行了截断。<br>
                                BigDecimal recommend1 = new BigDecimal("0.1");<br>
                                BigDecimal recommend2 = BigDecimal.valueOf(0.1);
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                关于基本数据类型与包装数据类型的使用标准如下：
                            </div>
                            <div class="java-stand-content-item">
                                1）<span class="java-stand-must">【强制】</span>所有的 POJO 类属性必须使用包装数据类型。
                            </div>
                            <div class="java-stand-content-item">
                                2）<span class="java-stand-must">【强制】</span>RPC 方法的返回值和参数必须使用包装数据类型。
                            </div>
                            <div class="java-stand-content-item">
                                3）<span class="java-stand-recom">【推荐】</span>所有的局部变量使用基本数据类型。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>POJO 类属性没有初值是提醒使用者在需要使用时，必须自己显式地进行赋值，任何 NPE 问题，或者入库检查，都由使用者来保证。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-green">正例：</span>数据库的查询结果可能是 null，因为自动拆箱，用基本数据类型接收有 NPE 风险。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>比如显示成交总额涨跌情况，即正负 x%，x 为基本数据类型，调用的 RPC 服务，调用不成功时，返回的是默认值，页面显示为 0%，这是不合理的，应该显示成中划线。所以包装数据类型的 null 值，能够表示额外的信息，如：远程调用失败，异常退出。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                定义 DO/DTO/VO 等 POJO 类时，不要设定任何属性<span class="font-bold color-blue">默认值</span> 。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>POJO 类的 createTime 默认值为 new Date()，但是这个属性在数据提取时并没有置入具体值，在更新其它字段时又附带更新了此字段，导致创建时间被修改成当前时间。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                序列化类新增属性时，请不要修改 serialVersionUID 字段，避免反序列失败；如果完全不兼容升级，避免反序列化混乱，那么请修改 serialVersionUID 值。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>注意 serialVersionUID 不一致会抛出序列化运行时异常。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                构造方法里面禁止加入任何业务逻辑，如果有初始化逻辑，请放在 init 方法中。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                POJO 类必须写 toString 方法。使用 IDE 中的工具：source> generate toString 时，如果继承了另一个 POJO 类，注意在前面加一下 super.toString。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>在方法执行抛出异常时，可以直接调用 POJO 的 toString()方法打印其属性值，便于排查问题。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-must">【强制】</span>
                                禁止在 POJO 类中，同时存在对应属性 xxx 的 isXxx()和 getXxx()方法。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>框架在调用属性 xxx 的提取方法时，并不能确定哪个方法一定是被优先调用到。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>
                                使用索引访问用 String 的 split 方法得到的数组时，需做最后一个分隔符后有无内容的检查，否则会有抛 IndexOutOfBoundsException 的风险。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>
                                <br>
                                <img :src="java9" alt=""/>
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>
                                当一个类有多个构造方法，或者多个同名方法，这些方法应该按顺序放置在一起，便于阅读，此条规则优先于下一条。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>
                                类内方法定义的顺序依次是：公有方法或保护方法 > 私有方法 > getter / setter 方法。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>公有方法是类的调用者和维护者最关心的方法，首屏展示最好；保护方法虽然只是子类关心，也可能是“模板设计模式”下的核心方法；而私有方法外部一般不需要特别关心，是一个黑盒实现；因为承载的信息价值较低，所有 Service 和 DAO 的 getter/setter 方法放在类体最后。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>
                                setter 方法中，参数名称与类成员变量名称一致，this.成员名 = 参数名。在 getter/setter 方法中，不要增加业务逻辑，增加排查问题的难度。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>
                                <br>
                                <img :src="java10" alt=""/>
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>
                                循环体内，字符串的连接方式，使用 StringBuilder 的 append 方法进行扩展。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>下例中，反编译出的字节码文件显示每次循环都会 new 出一个 StringBuilder 对象，然后进行 append 操作，最后通过 toString 方法返回 String 对象，造成内存资源浪费。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-orange">反例：</span>
                                <br>
                                <img :src="java11" alt=""/>
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>
                                final 可以声明类、成员变量、方法、以及本地变量，下列情况使用 final 关键字：
                            </div>
                            <div class="java-stand-content-item">
                                1） 不允许被继承的类，如：String 类。
                            </div>
                            <div class="java-stand-content-item">
                                2） 不允许修改引用的域对象。
                            </div>
                            <div class="java-stand-content-item">
                                3） 不允许被覆写的方法，如：POJO 类的 setter 方法。
                            </div>
                            <div class="java-stand-content-item">
                                4） 不允许运行过程中重新赋值的局部变量。
                            </div>
                            <div class="java-stand-content-item">
                                5） 避免上下文重复使用一个变量，使用 final 可以强制重新定义一个变量，方便更好地进行重构。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>
                                慎用 Object 的 clone 方法来拷贝对象。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>对象 clone 方法默认是浅拷贝，若想实现深拷贝需覆写 clone 方法实现域对象的深度遍历式拷贝。
                            </div>
                        </div>
                        <div class="java-stand-content">
                            <div class="java-stand-content-item font-bold-20">
                                <span class="java-stand-recom">【推荐】</span>
                                类成员与方法访问控制从严：
                            </div>
                            <div class="java-stand-content-item">
                                1） 如果不允许外部直接通过 new 来创建对象，那么构造方法必须是 private。
                            </div>
                            <div class="java-stand-content-item">
                                2） 工具类不允许有 public 或 default 构造方法。
                            </div>
                            <div class="java-stand-content-item">
                                3） 类非 static 成员变量并且与子类共享，必须是 protected。
                            </div>
                            <div class="java-stand-content-item">
                                4） 类非 static 成员变量并且仅在本类使用，必须是 private。
                            </div>
                            <div class="java-stand-content-item">
                                5） 类 static 成员变量如果仅在本类使用，必须是 private。
                            </div>
                            <div class="java-stand-content-item">
                                6） 若是 static 成员变量，考虑是否为 final。
                            </div>
                            <div class="java-stand-content-item">
                                7） 类成员方法只供类内部调用，必须是 private。
                            </div>
                            <div class="java-stand-content-item">
                                8） 类成员方法只对继承类公开，那么限制为 protected。
                            </div>
                            <div class="java-stand-content-item">
                                <span class="color-yellow">说明：</span>任何类、方法、参数、变量，严控访问范围。过于宽泛的访问范围，不利于模块解耦。思考：如果是一个 private 的方法，想删除就删除，可是一个 public 的 service 成员方法或成员变量，删除一下，不得手心冒点汗吗？变量像自己的小孩，尽量在自己的视线内，变量作用域太大，无限制的到处跑，那么你会担心的。
                            </div>
                        </div>


                        <h2 id="集合处理">集合处理</h2>



                        <h2 id="并发处理">并发处理</h2>


                        <h2 id="控制语句">控制语句</h2>


                        <h2 id="注释规约">注释规约</h2>


                        <h2 id="其它">其它</h2>


                        <h1 id="异常日志">异常日志</h1>
                        <h2 id="异常处理">异常处理</h2>
                        <h2 id="日志规约">日志规约</h2>


                        <h1 id="单元测试">单元测试</h1>


                        <h1 id="安全规约">安全规约</h1>


                        <h1 id="MySQL 数据库">MySQL 数据库</h1>
                        <h2 id="建表规约">建表规约</h2>
                        <h2 id="索引规约">索引规约</h2>
                        <h2 id="SQL 语句">SQL 语句</h2>
                        <h2 id="ORM 映射">ORM 映射</h2>


                        <h1 id="工程结构">工程结构</h1>
                        <h2 id="应用分层">应用分层</h2>
                        <h2 id="二方库依赖">二方库依赖</h2>
                        <h2 id="服务器">服务器</h2>


                        <h1 id="设计规约">设计规约</h1>


                        <h1 id="附录">附录</h1>
                        <h2 id="附 1：版本历史">附 1：版本历史</h2>
                        <h2 id="附 2：专有名词解释">附 2：专有名词解释</h2>


                    </div>
                </div>
                <el-divider><span style="color: gray">我是有底线的</span></el-divider>
                <el-backtop target=".tools-body" :bottom="100"></el-backtop>
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
                        data:[ {title:'异常处理' }, {title:'日志规约' } ]
                    },{
                        name:'单元测试'
                    },{
                        name:'安全规约'
                    },{
                        name:'MySQL 数据库',
                        data:[ {title:'建表规约' }, {title:'索引规约' }, {title:'SQL 语句' }, {title:'ORM 映射' } ]
                    },{
                        name:'工程结构',
                        data:[ {title:'应用分层' }, {title:'二方库依赖' }, {title:'服务器' } ]
                    },{
                        name:'设计规约'
                    },{
                        name:'附录',
                        data:[ {title:'附 1：版本历史' }, {title:'附 2：专有名词解释' } ]
                    }
                ],
                java1:require('@/assets/chest/javaDevelope/java1.jpg'),
                java2:require('@/assets/chest/javaDevelope/java2.png'),
                java3:require('@/assets/chest/javaDevelope/java3.png'),
                java4:require('@/assets/chest/javaDevelope/java4.jpg'),
                java5:require('@/assets/chest/javaDevelope/java5.jpg'),
                java6:require('@/assets/chest/javaDevelope/java6.png'),
                java7:require('@/assets/chest/javaDevelope/java7.png'),
                java8:require('@/assets/chest/javaDevelope/java8.png'),
                java9:require('@/assets/chest/javaDevelope/java9.png'),
                java10:require('@/assets/chest/javaDevelope/java10.png'),
                java11:require('@/assets/chest/javaDevelope/java11.png')
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
    }
    .tools-navige::-webkit-scrollbar {
        display: none;
    }
    .tools-body{
        position: fixed;
        left: 300px;
        top: 90px;
        bottom: 0;
        right: 0;
        padding-right: 40px;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .java-stand-content{
        font-size: 18px;
        margin-bottom: 40px;
    }
    .java-stand-content-item{
        margin-bottom: 15px;
    }
    .java-stand-must{
        color: red;
        font-size: large;
        font-weight: bold;
    }
    .java-stand-recom{
        color: #ffd21a;
        font-size: large;
        font-weight: bold;
    }
    .java-stand-refer{
        color: #2fff7b;
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

    .alibabaJavaDevelop .tools-body::-webkit-scrollbar {
        width : 10px;
        height: 1px;
    }
    .alibabaJavaDevelop .tools-body::-webkit-scrollbar-thumb {
        border-radius   : 10px;
        background-color: #73b967;
    }
    .alibabaJavaDevelop .tools-body::-webkit-scrollbar-track {
        box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
        background   : #ededed;
        border-radius: 10px;
    }
</style>
