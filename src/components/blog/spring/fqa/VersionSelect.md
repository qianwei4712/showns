<div class="catalog">

- [废话开头](#t0)
- [SpringBoot 版本](#t1)
- [SpringCloud 版本](#t2)
- [对应关系](#t3)
  - [如何选择](#t31)
  - [注意事项](#t32)
- [参考文章](#te)

</div>



## <span id="t0">废话开头</span>

> 当前时间 20210320，

众所周知，`SpringBoot` 与 `SpringCloud` 需要版本对应，否则将会出现很多异常，一般都是找不到对应依赖。

`SpringBoot` 与 `SpringCloud` 是分别定义版本号的，可以在以下两个网站查到还在维护的最新版本。

<a href="https://spring.io/projects/spring-boot#learn" target=
"_blank">https://spring.io/projects/spring-boot#learn</a>

<a href="https://spring.io/projects/spring-cloud#learn" target=
"_blank">https://spring.io/projects/spring-cloud#learn</a>

如果已经放弃维护了，尽量不要使用，老版本时间过长也建议更新版本。



<br>

## <span id="t1">SpringBoot 版本</span>

**Spring Boot的版本以数字表示。**

> 例如：`Spring Boot 2.2.5.RELEASE` 表示 `主版本.次版本.增量版本（Bug修复）` 

下面是版本号介绍：

- Alpha：不建议使用，主要是以实现软件功能为主，通常只在软件开发者内部交流，Bug较多；
- Beta：该版本相对于α版已有了很大的改进，消除了严重的错误，但还是存在着一些缺陷，需要经过多次测试来进一步消除；
- GA：General Availability，正式版本，官方推荐使用此版本，在国外都是用GA来说明release版本；
- M：又叫里程碑版本，表示该版本较之前版本有功能上的重大更新；
- PRE(不建议使用)：预览版，内部测试版，主要是给开发人员和测试人员测试和找BUG用的；
- Release：最终版本，Release不会以单词形式出现在软件封面上，取而代之的是符号(R)；
- RC：该版本已经相当成熟了，基本上不存在导致错误的BUG，与即将发行的正式版相差无几；
- SNAPSHOT：快照版，可以稳定使用，且仍在继续改进版本。
- SR.X：修正版，服务版本，当项目发布积累到一定程度，需要修复该版本中的某个错误后以此来命名，X表示数字。



<br>

## <span id="t2">SpringCloud 版本</span>

Spring Cloud 为了要管理每个版本的子项目清单，避免版本名与子项目的发布号混淆，所以没有采用版本号的方式，而是通过命名的方式。

这些版本名字采用了伦敦地铁站的名字，根据字母表的顺序来对应版本时间顺序，比如：最早的Release版本：Angel，第二个Release版本：Brixton，以此类推……

不过现在已经改为按日期为格式 **CalVer** ，例如：2020.0.0；

*CalVer 不是基于任意数字，而是基于项目发布日期 的版本控制约定。*

首先， 版本的各部分：

- **主要** - 版本中的第一个数字。2 和 3 是 Python 的著名  主要版本。主要部分是基于日历的最常见组件。
- **次要** - 版本中的第二个数字。7 是 Python 的最受欢迎的  次要版本。
- **微小** - 版本中的第三个且通常是最终数字。有时  称为 “补丁” 部分。
- **修饰符** - 可选的文本标记，例如 “dev”、“alpha”、“beta”、  “rc1”，依此类推。

绝大多数现代版本标识符是由两个或 三个数字段组成，以及可选的修饰符。通常 建议不要使用四个数字段的版本。

项目发现了不止一种有用的方法在版本中使用日期。 作为对比，CalVer 并未像 “语义化版本” 那样选择单一方案， 而是引入了开发人员的 标准术语：

- **`YYYY`** - 年份全称 - 2006、2016、2106
- **`YY`** - 年份缩写 - 6、16、106
- **`0Y`** - 以零填充的年份 - 06、16、106
- **`MM`** - 月份缩写 - 1、2 ... 11、12
- **`0M`** - 以零填充的月份 - 01、02 ... 11、12
- **`WW`** - 星期（自年初开始）- 1、2、33、52
- **`0W`** - 以零填充的星期 - 01、02、33、52
- **`DD`** - 日 - 1、2 ... 30、31
- **`0D`** - 以零填充的日 - 01、02 ... 30、31

传统的递增版本号是从 0 开始， 而日期段是从 1 开始的，且年份缩写和以零填充的年份 是相对于 2000 年。还请注意，星期的使用 通常与月/日互斥。

<br>



## <span id="t3">对应关系</span>

首先要说的是，最好还是别用不再维护的版本了，所以对于一些不维护的版本就没怎么关注。

### <span id="t31">如何选择</span>

- 首先是简易方式，在 `https://spring.io/projects/spring-cloud#learn` 的对应版本号后，点击 `Reference Doc.` 。能看到很明显的 `Supported Boot Version` 字样。

- 官网 json 方式：

通过打开 <a href="https://start.spring.io/actuator/info" target=
"_blank">https://start.spring.io/actuator/info </a> 可以得到一串json。
主要识别到 springcloud 相关的：

```
"spring-cloud": {
    "Hoxton.SR10": "Spring Boot >=2.2.0.RELEASE and <2.3.10.BUILD-SNAPSHOT",
    "Hoxton.BUILD-SNAPSHOT": "Spring Boot >=2.3.10.BUILD-SNAPSHOT and <2.4.0.M1",
    "2020.0.0-M3": "Spring Boot >=2.4.0.M1 and <=2.4.0.M1",
    "2020.0.0-M4": "Spring Boot >=2.4.0.M2 and <=2.4.0-M3",
    "2020.0.0": "Spring Boot >=2.4.0.M4 and <=2.4.0",
    "2020.0.1": "Spring Boot >=2.4.1 and <2.5.0-M1",
    "2020.0.2-SNAPSHOT": "Spring Boot >=2.4.5-SNAPSHOT"
}
```



<br>

### <span id="t32">注意事项</span>

- 坚决不能选择 **非稳定版本/ end-of-life（不维护）版本**
- release 版本刚出来时，等别人探探雷
- **SR2 以后的版本可以放心使用**



<br>



## <span id="te">参考文章</span>

<a href="https://www.jianshu.com/p/99c45499fb6e" target="_blank">https://www.jianshu.com/p/99c45499fb6e</a>

<a href="https://blog.csdn.net/star1210644725/article/details/104686007/" target="_blank">https://blog.csdn.net/star1210644725/article/details/104686007/</a>

<a href="https://zhuanlan.zhihu.com/p/147899433" target="_blank">https://zhuanlan.zhihu.com/p/147899433</a>

<a href="https://blog.didispace.com/springcloud-version/" target="_blank">https://blog.didispace.com/springcloud-version/</a>

<a href="https://blog.csdn.net/weixin_49527334/article/details/113338257" target="_blank">https://blog.csdn.net/weixin_49527334/article/details/113338257</a>

<a href="https://calver.org/overview_zhcn.html" target="_blank">https://calver.org/overview_zhcn.html</a>



