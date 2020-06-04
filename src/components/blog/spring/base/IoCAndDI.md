
<div class="catalog">


- [IOC 概念](#t0)
- [依赖注入和依赖查找](#t1)
- [Spring 的 IoC 容器](#t2)
  - [BeanFactory 容器](#t21)
  - [ApplicationContext 容器](#t22)
- [参考文章](#te)

</div>


<img src="@/assets/blog/img/spring/Spring IoC.png"/>


### <span id="t0">IOC 概念</span>


> Spring Framework 阅读版本为 5.2.x

**控制反转 IOC（ Inversion Of Control ）** ：是一种设计思想，它的主要作用是减轻系统的耦合度。实现方式就是，通过一个专门的调控系统，来管理所有对象的生命周期，在某个对象需要依赖其他对象时，由这个调控系统来进行传递。

<br>

然后就是经典的、最常见的关于 IOC 的四个问题：

1. 谁控制谁？
2. 控制什么？
3. 为何是反转？
4. 哪些方面反转了？

先来用最常见的订单业务举个例子，需要完成的业务是根据订单编号计算订单内的货物总价：

```java
public class GoodsService {
    public Object getById(String id){
        //假设获得商品
        return null;
    }
}
```

上面是最常见的，根据 货物ID 获得货物实体。然后再看传统的订单业务写法：

```java
public class OrderService {
    private GoodsService goodsService;
    public void setGoodsService(GoodsService goodsService) {
        this.goodsService = goodsService;
    }
    public BigDecimal calc(String orderId){
//        根据订单ID获得货物列表...
//        根据货物ID查询货物，再进行计算
//        goodsService.getById("");
        return null;
    }
}
```

现在我们需要完成的业务是，在 Controller 根据 订单ID 计算该订单价格；看看假设代码：

```java
public static void main(String[] args) {
    //假设需要完成一个计算订单价格的业务（假设哦，可能和实际业务不一样，栗子没举好）
    //假设这个main 方法是 controller 入口
    OrderService orderService = new OrderService();
    GoodsService goodsService = new GoodsService();
    orderService.setGoodsService(goodsService);
    BigDecimal orderCount = orderService.calc("orderId");
}
```

从这里可以发现，在传统的设计中，我们都是直接通过 new 的方式创建需要依赖的对象，这是程序主动创建对象。

但是在 Spring 中如何完成？

将两个业务类都给 Spring IOC 容器管理，goodsService 省略了，一样加上 `@Service` 注解， `@Autowired` 注入：

```java
@Service
public class OrderService {
    @Autowired
    private GoodsService goodsService;
    public BigDecimal calc(String orderId){
//        根据订单ID获得货物列表...
//        根据货物ID查询货物，再进行计算
//        goodsService.getById("");
        return null;
    }
}
```

```java
//在 Controller中注入 OrderService
BigDecimal orderCount = orderService.calc("orderId");
```

这两个注解相信大家都很熟悉了。那么现在可以思考下上面的四个问题了。。。。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/TIM%E6%88%AA%E5%9B%BE20200602231032.png)

对比下两种方式，应该很好理解上面的四个问题，我就直接写答案了：

1. **谁控制谁：** 原本传统的 new 创建对象，是由创建方直接控制期生命周期；有了 IOC 后，变为 IOC 容器来控制所有被依赖对象的生命周期；
2. **控制什么：** 控制的是被依赖的对象；
3. **为何是反转：** 传统 new 方式，我们都是自己在对象中主动创建被依赖的对象，这是正转；有了 IOC 后，所依赖的对象由 IOC 容器创建后注入到被注入的对象中，依赖的对象由原来的主动获取变成被动接受，所以是反转；
4. **哪些方面反转了：** 所依赖对象的获取被反转了。

以上就是以 Spring 作为例子的 IOC 实现。



<br>

### <span id="t1">依赖注入和依赖查找</span>

> 这一部分只做下概念介绍

每次问到 Spring 控制反转，都会带上依赖注入 DI，其实依赖注入在上面的例子中已经介绍过实际作用了，它是 IOC 的一种实现方式。

IOC 有依赖注入（Depedency Injection，DI）和依赖查找（Dependency Lookup，DL）两种实现方式，分别介绍下：

**被放弃的依赖查找** ：实现方式为，容器中的受控对象通过容器的 API 来查找自己所依赖的资源和协作对象，这种方式虽然降低了对象间的依赖，但是同时也使用到了容器的 API。

**Spring 选用的依赖注入** ：由容器负责组件的装配，它会把符合依赖关系的对象通过属性( JavaBean 中的 setter ）或者是构造子传递给需要的对象。

更详细的有关依赖注入和依赖查找的区别可以参考：<a href="https://www.jianshu.com/p/26654a18d1fe" target="_blank">https://www.jianshu.com/p/26654a18d1fe</a>

<span style="color: red; "> **所以说，对 Spring 框架来说，控制反转 IoC 是目的（为了解耦），依赖注入 DI 是手段（自动装配）。** </span>

到这，应该两个最重要的概念就介绍完了，是不是发现 Spring 的思想也就这么回事？其实 Spring 的核心思想并不复杂，但是这只是开始。。。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/unc/auwnksnda.jpg)

<br>

### <span id="t2">Spring 的 IoC 容器</span>

**IoC 容器是 Spring 框架的核心。** 后面直接称呼为 容器...

容器创建了所有对象，并管理着他们的整个生命周期，从创建到销毁。然后通过依赖注入来组装。

**我们把这些对象成为 Spring Beans** 。后面就直接用 beans 称呼了.......好嘞，然后继续

<font color="red">Spring 提供了两种容器：**Spring BeanFactory 容器** 和 **Spring ApplicationContext 容器** 。</font>

- BeanFactory 是 Spring 里面最底层的接口，包含了各种 Bean 的定义，读取 bean 配置文档，管理 bean 的加载、实例化，控制 bean 的生命周期，维护 bean 之间的依赖关系。
- ApplicationContext 是 BeanFactory 的子接口，也被成为 Spring 上下文。在 BeanFactory 基础上增加了国际化策略、事件机制、资源加载和对 Context 透明创建的支持。

<br>

#### <span id="t21">BeanFactory 容器</span>

BeanFactory 是 Spring 容器最基础、最顶级的接口。

BeanFacoty 有三个直接子类：

- `ListableBeanFactory` ：扩展 BeanFactory 使其支持迭代Ioc容器持有的Bean对象
- `HierarchicalBeanFactory` ：这个工厂接口非常简单，实现了Bean工厂的分层
- `AutowireCapableBeanFactory` ：实现了对存在实例的管理。可以使用这个接口集成其它框架,捆绑并填充并不由 Spring 管理生命周期并已存在的实例

但是 `DefaultListableBeanFactory` 才是最终的默认实现，它实现了所有接口。



![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/spring/TIM%E6%88%AA%E5%9B%BE20200603231836.png)



<br>

#### <span id="t22">ApplicationContext 容器</span>

这个就是大名鼎鼎的 Spring 容器，它叫做应用上下文，她继承 BeanFactory，所以它是 BeanFactory 的扩展升级版。

如果BeanFactory 是屌丝的话，那么 ApplicationContext 则是名副其实的白富美。

由于 ApplicationContext 的结构就决定了它与 BeanFactory 的不同，其主要区别有：

1. 继承 MessageSource，提供国际化的标准访问策略。
2. 继承 ApplicationEventPublisher ，提供强大的事件机制。
3. 扩展 ResourceLoader，可以用来加载多个 Resource，可以灵活访问不同的资源。
4. 对 Web 应用的支持

她的常用实现类如下：

- `ClassPathXmlApplicationContext` ：可以加载类路径下的配置文件，不在的话加载不了
- `FileSystemXmlApplicationContext` ：可以加载磁盘任意路径下的配置文件（必须有访问权限）
- `AnnotationConfigApplicationContext` ： 用于读取注解创建容器的




![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/spring/TIM%E6%88%AA%E5%9B%BE20200603233237.png)




<br>

### <span id="te">参考文章</span>


<a target="_blank" href="http://cmsblogs.com/?p=4047&vip=1">http://cmsblogs.com/?p=4047&vip=1</a>

<a target="_blank" href="https://www.bilibili.com/video/BV1RE411N7xk">https://www.bilibili.com/video/BV1RE411N7xk</a>

<a target="_blank" href="https://www.w3cschool.cn/wkspring/pesy1icl.html">https://www.w3cschool.cn/wkspring/pesy1icl.html</a>

<a target="_blank" href="https://www.jianshu.com/p/26654a18d1fe">https://www.jianshu.com/p/26654a18d1fe</a>

<a target="_blank" href="https://www.jianshu.com/p/17b66e6390fd">https://www.jianshu.com/p/17b66e6390fd</a>

<a target="_blank" href="https://www.jianshu.com/p/fd8e441b98c8">https://www.jianshu.com/p/fd8e441b98c8</a>

<a target="_blank" href="https://www.jianshu.com/p/2854d8984dfc">https://www.jianshu.com/p/2854d8984dfc</a>

<a target="_blank" href="https://blog.csdn.net/iteye_14104/article/details/82672514">https://blog.csdn.net/iteye_14104/article/details/82672514</a>









