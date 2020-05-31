<div class="catalog">

- [前言](#t0)
- [总体架构](#t1)
  - [核心容器](#t11)
  - [数据访问/集成](#t12)
  - [Web](#t13)
  - [其他](#t14)
- [重点词汇及简称](#t2)
- [本地环境搭建](#t3)
- [参考文章](#t4)

</div>



### <span id="t0">前言</span>

> Spring Framework 阅读版本为 5.2.x

Spring 在现代 Java 中的地位，那是当之无愧的武林盟主。

网上抄了点 Spring 的优势，作为本系列的开始：

- Spring 可以使开发人员使用 POJOs 开发企业级的应用程序。只使用 POJOs 的好处是你不需要一个 EJB 容器产品，比如一个应用程序服务器，但是你可以选择使用一个健壮的 servlet 容器，比如 Tomcat 或者一些商业产品。

- Spring 在一个单元模式中是有组织的。即使包和类的数量非常大，你只要担心你需要的，而其它的就可以忽略了。

- Spring 不会让你白费力气做重复工作，它真正的利用了一些现有的技术，像 ORM 框架、日志框架、JEE、Quartz 和 JDK 计时器，其他视图技术。

- 测试一个用 Spring 编写的应用程序很容易，因为环境相关的代码被移动到这个框架中。此外，通过使用 JavaBean-style POJOs，它在使用依赖注入注入测试数据时变得更容易。

- Spring 的 web 框架是一个设计良好的 web MVC 框架，它为比如 Structs 或者其他工程上的或者不怎么受欢迎的 web 框架提供了一个很好的供替代的选择。MVC模式导致应用程序的不同方面(输入逻辑，业务逻辑和UI逻辑)分离，同时提供这些元素之间的松散耦合。

  - 模型(Model)封装了应用程序数据，通常它们将由POJO类组成。

  - 视图(View)负责渲染模型数据，一般来说它生成客户端浏览器可以解释HTML输出。

  - 控制器(Controller)负责处理用户请求并构建适当的模型，并将其传递给视图进行渲染。

- Spring 对JavaEE开发中非常难用的一些API（JDBC、JavaMail、远程调用等），都提供了封装，使这些API应用难度大大降低。

- 轻量级的 IOC 容器往往是轻量级的，例如，特别是当与 EJB 容器相比的时候。这有利于在内存和 CPU 资源有限的计算机上开发和部署应用程序。

- Spring提供了一致的事务管理接口，可向下扩展到（使用一个单一的数据库，例如）本地事务并扩展到全局事务（例如，使用 JTA）。



<br>

### <span id="t1">总体架构</span>

![Spring 总体架构](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/spring-overview.png.pagespeed.ce.XVe1noRCMt.png)

 Spring 总共大约有 20 个模块，由 1300 多个不同的文件构成。而这些组件被分别整合在核心容器
（Core Container）、AOP（Aspect Oriented Programming）和设备支持（Instrmentation）、
数据访问及集成（Data Access/Integeration）、Web、报文发送（Messaging）、Test，6 个模块
集合中。

Spring 的核心是一个 *容器*，通常称为 *Spring 应用程序上下文*，用于创建和管理应用程序组件。这些组件（或 bean）在 Spring 应用程序上下文中连接在一起以构成一个完整的应用程序。

然后再贴下 W3CSchool 的总结，没办法，Spring 的博客实在太多了，随便一搜都有结论。

<br>

#### <span id="t11">核心容器</span>

核心容器由**spring-core，spring-beans，spring-context，spring-context-support和spring-expression**（SpEL，Spring表达式语言，Spring Expression Language）等模块组成，它们的细节如下：

- **spring-core**模块提供了框架的基本组成部分，包括 IoC 和依赖注入功能。

- **spring-beans** 模块提供 BeanFactory，工厂模式的微妙实现，它移除了编码式单例的需要，并且可以把配置和依赖从实际编码逻辑中解耦。

- **context**模块建立在由**core**和 **beans** 模块的基础上建立起来的，它以一种类似于JNDI注册的方式访问对象。Context模块继承自Bean模块，并且添加了国际化（比如，使用资源束）、事件传播、资源加载和透明地创建上下文（比如，通过Servelet容器）等功能。Context模块也支持Java EE的功能，比如EJB、JMX和远程调用等。**ApplicationContext**接口是Context模块的焦点。**spring-context-support**提供了对第三方库集成到Spring上下文的支持，比如缓存（EhCache, Guava, JCache）、邮件（JavaMail）、调度（CommonJ, Quartz）、模板引擎（FreeMarker, JasperReports, Velocity）等。

- **spring-expression**模块提供了强大的表达式语言，用于在运行时查询和操作对象图。它是JSP2.1规范中定义的统一表达式语言的扩展，支持set和get属性值、属性赋值、方法调用、访问数组集合及索引的内容、逻辑算术运算、命名变量、通过名字从Spring IoC容器检索对象，还支持列表的投影、选择以及聚合等。

它们的完整依赖关系如下图所示：

![Spring 核心容器依赖关系](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/1540290875453691.png)



<br>

#### <span id="t12">数据访问/集成</span>

数据访问/集成层包括 JDBC，ORM，OXM，JMS 和事务处理模块，它们的细节如下：

- **JDBC** 模块提供了JDBC抽象层，它消除了冗长的JDBC编码和对数据库供应商特定错误代码的解析。

- **ORM** 模块提供了对流行的对象关系映射API的集成，包括JPA、JDO和Hibernate等。通过此模块可以让这些ORM框架和spring的其它功能整合，比如前面提及的事务管理。

- **OXM** 模块提供了对OXM实现的支持，比如JAXB、Castor、XML Beans、JiBX、XStream等。

- **JMS** 模块包含生产（produce）和消费（consume）消息的功能。从Spring 4.1开始，集成了spring-messaging模块。。

- **事务**模块为实现特殊接口类及所有的 POJO 支持编程式和声明式事务管理。（注：编程式事务需要自己写beginTransaction()、commit()、rollback()等事务管理方法，声明式事务是通过注解或配置由spring自动处理，编程式事务粒度更细）

<br>

#### <span id="t13">Web</span>

Web 层由 Web，Web-MVC，Web-Socket 和 Web-Portlet 组成，它们的细节如下：

- **Web** 模块提供面向web的基本功能和面向web的应用上下文，比如多部分（multipart）文件上传功能、使用Servlet监听器初始化IoC容器等。它还包括HTTP客户端以及Spring远程调用中与web相关的部分。。

- **Web-MVC** 模块为web应用提供了模型视图控制（MVC）和REST Web服务的实现。Spring的MVC框架可以使领域模型代码和web表单完全地分离，且可以与Spring框架的其它所有功能进行集成。

- **Web-Socket** 模块为 WebSocket-based 提供了支持，而且在 web 应用程序中提供了客户端和服务器端之间通信的两种方式。

- **Web-Portlet** 模块提供了用于Portlet环境的MVC实现，并反映了spring-webmvc模块的功能。



<br>

#### <span id="t14">其他</span>

还有其他一些重要的模块，像 AOP，Aspects，Instrumentation，Web 和测试模块，它们的细节如下：

- **AOP** 模块提供了面向方面的编程实现，允许你定义方法拦截器和切入点对代码进行干净地解耦，从而使实现功能的代码彻底的解耦出来。使用源码级的元数据，可以用类似于.Net属性的方式合并行为信息到代码中。

- **Aspects** 模块提供了与 **AspectJ** 的集成，这是一个功能强大且成熟的面向切面编程（AOP）框架。

- **Instrumentation** 模块在一定的应用服务器中提供了类 instrumentation 的支持和类加载器的实现。

- **Messaging** 模块为 STOMP 提供了支持作为在应用程序中 WebSocket 子协议的使用。它也支持一个注解编程模型，它是为了选路和处理来自 WebSocket 客户端的 STOMP 信息。

- **测试**模块支持对具有 JUnit 或 TestNG 框架的 Spring 组件的测试。



<br>

### <span id="t2">重点词汇及简称</span>

Spring 中的一些常见简称，要是这些都不会，装逼都装不过别人。

- 控制反转 IOC（ Inversion of Control ）
- 依赖注入 DI（ Dependency Injection ）
- 面向切面变成 AOP（ Aspect Oriented Programming ）
- Spring表达式语言 SpEL（ Spring Expression Language ）
- 对象关系映射 ORM（ Object Relational Mapping ）
- 对象XML映射 OXM（ Object XML Mapping ）
- Java数据库连接 JDBC（ Java Data Base Connectivity ）
- 简单Java对象 POJO（ Plain Ordinary Java Object ）
- 企业Java Beans EJB（ Enterprise Java Beans ）

<br>

### <span id="t3">本地环境搭建</span>

我在本地搭建的是 Spring 5.2.x 版本，需要以下环境准备：

- Gradle，因为 Spring 是基于 Gradle 构建的，和 Maven 大同小异，我下载了 5.6.4 版本（版本太高好像也会出问题）: <a href="https://gradle.org/releases/" target="_blank">https://gradle.org/releases/</a>
- JDK 8 以上，我的 idea 版本是 2019.3
- Spring 源码，可以在分支中自行选择版本：<a href="https://github.com/spring-projects/spring-framework/tree/5.2.x" target="_blank">https://github.com/spring-projects/spring-framework/tree/5.2.x</a>

<br>

**Gradle 安装**

下载，解压后，需要配置环境变量（对于 Java 开发来说，应该是轻车熟路了）

> GRADLE_USER_HOME 的作用是存放 Jar 包，相当于一个仓库

![环境变量配置](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/053112240229_01.png)

然后命令行 `gradle -v` 验证是否安装成功。

<br>

**本地构建**

Spring 源码解压后，我啥也没动，然后阅读根目录下自带文件 **import-into-idea.md** ，这可是官方说明哦。

> _Within your locally cloned spring-framework working directory:_
>
> 1. Precompile `spring-oxm` with `./gradlew :spring-oxm:compileTestJava`
> 2. Import into IntelliJ (File -> New -> Project from Existing Sources -> Navigate to directory -> Select build.gradle)
> 3. When prompted exclude the `spring-aspects` module (or after the import via File-> Project Structure -> Modules)
> 4. Code away

官方步骤，我先试了下，除了第一步出现了 git 错误，其他应该没啥问题。

我的 Idea 导入后， build 耗时为 1小时10分钟。

然后测试下是否成功，直接打开最最最常见的注解 `Component` ，没有报错，一切正常。

<br>

**构建错误汇总**

**Build scan background action failed**

这是因为我下载下来的包没有在 git 环境中，在当前目录下提交到 git 就行了：

```shell
git init
git add .
git commit -m "init"
```

然后重新进行构建 `./gradlew :spring-oxm:compileTestJava`

<br>

### <span id="t4">参考文章</span>

<a href="https://blog.csdn.net/lj1314ailj/article/details/80118372" target="_blank">https://blog.csdn.net/lj1314ailj/article/details/80118372</a>

<a href="https://blog.csdn.net/zhaokai0130/article/details/81008719" target="_blank">https://blog.csdn.net/zhaokai0130/article/details/81008719</a>

<a href="https://www.cnblogs.com/runnable/p/11846372.html" target="_blank">https://www.cnblogs.com/runnable/p/11846372.html</a>

<a href="https://my.oschina.net/u/3080373/blog/891918" target="_blank">https://my.oschina.net/u/3080373/blog/891918</a>

<a href="https://gitee.com/java-mindmap/mapSource" target="_blank">https://gitee.com/java-mindmap/mapSource</a>















