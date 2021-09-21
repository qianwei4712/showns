<div class="catalog">

- [Bean 概念](#t0)
- [元数据 BeanDefinition](#t1)
- [IoC 容器创建 Bean](#t2)
  - [XML 配置文件方式](#t21)
  - [注解配置方式](#t22)
  - [Java 类配置方式](#t23)
- [Bean 注入方式](#t3)
  - [注解注入](#t31)
  - [Bean 自动装配](#t32)
- [参考文章](#t4)

</div>



## <span id="t0">Bean 概念</span>

> Spring Framework 阅读版本为 5.2.x

**由 IoC 容器管理的那些组成你应用程序的对象我们就叫它 Bean。**

其实意思就是，每个我们加上注解交给 Spring 的类，都叫做 Bean。

Bean 由 Spring容器初始化、装配及管理的对象，除此之外，bean 就与应用程序中的其他对象没有什么区别了。

![BeanConfigoure0](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/BeanConfigoure0.png)


<br>

## <span id="t1">元数据 BeanDefinition</span>

**Bean 是由用容器提供的配置元数据 BeanDefinition 创建的。**

BeanDefinition 继承了 `BeanMetadataElement` 和 `AttributeAccessor` 接口，对于他们的作用嘛，我也是看别人说的，就贴一下过去略过：

- `BeanMetadataElement`  ：bean 元数据，读取配置资源的能力。
- `AttributeAccessor`  ：Spring 定义的属性访问器，对 Bean 的属性进行操作的 API；例如设置属性、获取属性、判断是否存在该属性，返回 bean 所有的属性名称等。

对于 IoC 容器而言，它需要完全掌握 bean ，首先需要了解：

- 如何创建一个 bean
- bean 的生命周期的详细信息
- bean 的依赖关系

而这些具体的信息，都由元数据来定义。

**BeanDefinition** 只是一个接口，实际产生作用的实现类有很多，比如下面的继承关系图：

![BeanConfigoure1](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/BeanConfigoure1.png)


首先，先介绍下 **BeanDefinition** ，源码是看不懂的，这辈子都不可能了；只能大致介绍下它的功能，这个接口的设计包含了一个 Bean 最基础的特征，**AbstractBeanDefinition** 包含以下字段，以下列了一些个人认为重要的；

具体可以参考：<a href="https://www.cnblogs.com/warehouse/p/9380375.html" target="_blank">https://www.cnblogs.com/warehouse/p/9380375.html</a>

|           属性            |                             描述                             |
| :-----------------------: | :----------------------------------------------------------: |
|         beanClass         |    这个属性是强制性的，并且指定用来创建 bean 的 bean 类。    |
|           name            | 类名，这个属性指定唯一的 bean 标识符。在基于 XML 的配置元数据中，你可以使用 ID 和/或 name 属性来指定 bean 标识符。 |
|           scope           |       这个属性指定由特定的 bean 定义创建的对象的作用域       |
|         lazyInit          | 是否延迟加载，对应 bean 属性lazy-init;<br>延迟初始化的 bean 告诉 IoC 容器在它第一次被请求时，而不是在启动时去创建一个 bean 实例。 |
|      autowiring mode      |             自动注入模式，它是用来注入依赖关系的             |
|         dependsOn         | 用来表示一个 bean 的实例化依赖另一个 bean 先实例化，对应 bean 属性 depend-on |
|          primary          | 自动装配时出现多个bean候选者时，将作为首选者，对应bean属性primary |
| constructorArgumentValues |      记录构造函数注入属性，对应bean属性constructor-arg       |
|      propertyValues       |                         普通属性集合                         |
|      initMethodName       |            初始化方法，对应 bean 属性 init-method            |
|     destroyMethodName     |             销毁方法，对应bean属性destroy-method             |

**所以只需要拿到 BeanDefinition， Spring IoC 容器就可以根据这些信息反射创建对象。**

![BeanConfigoure2](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/BeanConfigoure2.png)


然后它的几个实现类分别具有不同的分工：

1. **AbstractBeanDefinition** ：它是基础抽象类，实现了 **BeanDefinition** 的基本功能，使得其他实现类不需要从头实现
2. **GenericBeanDefinition** ：通用的bean实现，自2.5以后新加入的bean文件配置属性定义类，是`ChildBeanDefinition` 和 `RootBeanDefinition` 更好的替代者
3. **ScannedGenericBeanDefinition** : 被包扫描到的 bean 定义，`@Component` 注解生成
4. **AnnotatedGenericBeanDefinition** ： 查找类注解初始化的定义，`@Configuration` 注解生成
5. **RootBeanDefinition** ：代表一个从配置源（ `XML` ，`Java Config` 等）中生成的 `BeanDefinition`
6. **ChildBeanDefinition** ：可以从父 `BeanDefinition` 中集成构造方法，属性等

它们发挥作用的位置是在 IoC 容器中，使用 Map 存储 Bean 时，例如 `DefaultListableBeanFactory` ：

```java
    /** bean 的名字为键，BeanDefinition为值，初始容量为256 */
    private final Map<String, BeanDefinition> beanDefinitionMap = 
        new ConcurrentHashMap<String, BeanDefinition>(256);
```

> 至于更详细的工作原理，以后有兴趣了再去研究，先往下学重要的。这里简单提几个关键词：
>
> 1. **BeanDefinitionRegistryPostProcessor** 接口
> 2. **DefaultListableBeanFactory**
> 3. **PostProcessorRegistrationDelegate** 类的 **invokeBeanFactoryPostProcessors** 方法

<br>

## <span id="t2">IoC 容器创建 Bean</span>

上面图片中已经画出来了，Bean 配置信息的三种方式：

- XML 配置文件方式
- 注解配置方式
- Java 类配置方式

下面来主要讲这三个方式。

<br>

### <span id="t21">XML 配置文件方式</span>

XML 配置方式现在已经不推荐使用了，不过可能一些老项目维护还需要，把使用方式介绍下。

**在 Spring 配置文件中，使用 bean 标签，标签里添加对应属性，就可以实现对象创建。**

bean 中有很多属性，基本都是和上面 **AbstractBeanDefinition** 列的对应，稍微列几个常用的：

- **id** ：唯一标识，`ApplicationContext.getBean` 获取时的 bean 参数
- **class** ：创建对象类的全路径
- **name** ：名称属性，和 id 属性类似，不过 id 不能加特殊符号，name 可以；比较早期的属性，基本没人用了
- **property** ：属性参数注入，name 中加属性名
- **scope** ：作用域，常用的有两种：singleton 表示单例，prototype 表示多实例，默认为单例 singleton 。用的比较少的，并且只支付 WebApplicationContext 环境的： `request` （每次HTTP请求都会创建一个新的Bean）、`session` （同一个HTTP Session共享一个Bean，不同Session使用不同的Bean）、`global-session` （一般用于Portlet应用环境）



下面继续。。。。

<br>

1. 在绝大部分情况下，我们使用最基本的配置就可以满足需求，如下：

```xml
<bean id="user" class="cn.shiva.demo1.User"/>
```

**这个方式使用的是无参构造器进行 Bean 的实例化，如果该类不存在无参构造器，则会发生异常。**

然后是有参构造的话，假设有个 `String s` 参数，一定要先创建构造方法：

```xml
<!-- 构造器方式 -->
<bean id="user" class="cn.shiva.demo1.User">
    <constructor-arg name="s" value="bean property s属性"/>
</bean>
```

然后就是通过 set 方式注入：

```xml
<!-- 属性注入方式 -->
<bean id="user" class="cn.shiva.demo1.User">
    <property name="s" value="bean property s属性" />
</bean>
```

<br>

2. 使用工厂模式配合 XML 配置

```java
   public class UserFactory {
　　    // 静态方法，返回User对象
　　    public static User getUser() {
 　　       return new User();
　　    }
　　}
```

使用 xml 配置文件 bean 属性：

```xml
<bean id="user" class="cn.shiva.demo1.UserFactory" factory-method="getUser"/>
```

然后注入的其他类型，外联对象、数组、Map、List 什么的都差不多。

<br>

### <span id="t22">注解配置方式</span>

注解配置可以简化 xml 配置。

Spring  针对 Bean 创建对象提供了以下几种注解：

- **@Component** ：表示是一个普通的 Bean 组件
- **@Service** ：作用于业务逻辑层
- **@Controller** ：作用于控制层，spring-mvc 的注解，进行前端请求的处理，转发，重定向
- **@Repository** ：作用于持久层，作为DAO对象（数据访问对象，Data Access Objects），这些类可以直接对数据库进行操作

四个注解都用来创建 Bean 实例，`Component` 是基础注解，其他三个都是继承自它，然后再扩展功能。

<br>

### <span id="t23">Java 类配置方式</span>

最后就是使用  **@Configuration** 的 Java 配置方式了，

通过 @Configuration 注解来表明该类是一个 Spring 的配置;

其实就是一个简化的 xml 配置文件

```java
@Configuration
@ComponentScan(basePackages = "cn.shiva.demo3")
public class SpringConfig {
    // 通过@Bean注解来表明是一个Bean对象，相当于xml中的<bean>
    @Bean
    public UserDAO getUserDAO() {
        return new UserDAO(); // 直接new对象做演示
    }
}
```

<br>

## <span id="t3">Bean 注入方式</span>

Bean 注入方式其实和创建方式类似。

XML 注入方式也有构造函数注入、setter 方法注入、工厂注入；这些就不讲了，现在 SpringBoot 已经没见过这种玩意儿了。

<br>

### <span id="t31">注解注入</span>

这几种注解，我估计所有人都已经熟得不能再熟了：

- **@AutoWired** ：根据属性的类型 `byType` 自动注入，基础用法；
- **@Qualifier** ：根据属性的名称 `byName` 自动注入；

使用这个注解的时候，需要和 `AutoWired` 一起使用。

如果一个 `UserService` ，存在两个实现类 `UserServiceImpl1` 和 `UserServiceImpl2` ，就需要根据名称来进行选择注入;

使用示例：

```java
@AutoWired
@Qualifier(value = "userServiceImpl2")
private UserService userService;
```

- **@Resource** ：可以根据类型注入，也可以根据名称注入；默认使用属性的名称

`Resource` 是 Javax 的注解，Spring 官方肯定建议我们使用它自己的注解，但是功能是可以实现的；用法相同。

- **@Value** ：注入普通类型属性，我个人用得比较多的是在 SpringBoot 中读取配置文件的自定义配置



<br>

### <span id="t32">Bean 自动装配</span>

Spring 提供了四种自动装配的类型，在接口 `AutowireCapableBeanFactory` 进行了列举：

- no： 显式指明不使用 Spring 的自动装配功能
- byName：根据属性和组件的名称匹配关系来实现bean的自动装配
- byType：根据属性和组件的类型匹配关系来实现bean的自动装配，有多个适合类型的对象时装配失败
- constructor：与 byType 类似是根据类型进行自动装配，但是要求待装配的 bean 有相应的构造函数

一般来说，我们接触到的就 `byName` 根据属性的名称 和 `byType` 根据属性的类型两种装配方式。

自动装配的原理以后再讲，Spring 的源码实在是。。。看不懂。



<br>

## <span id="t4">参考文章</span>


<a target="_blank" href="https://blog.csdn.net/prestigeding/article/details/80490206">https://blog.csdn.net/prestigeding/article/details/80490206</a>

<a target="_blank" href="https://www.cnblogs.com/warehouse/p/9380375.html">https://www.cnblogs.com/warehouse/p/9380375.html</a>

<a target="_blank" href="https://www.jianshu.com/p/bcad005b6d8a">https://www.jianshu.com/p/bcad005b6d8a</a>

<a target="_blank" href="https://baijiahao.baidu.com/s?id=1641004110489963465">https://baijiahao.baidu.com/s?id=1641004110489963465</a>

<a target="_blank" href="https://www.cnblogs.com/xb1223/p/10154895.html">https://www.cnblogs.com/xb1223/p/10154895.html</a>

<a target="_blank" href="http://www.cicoding.cn/spring/whats-the-difference-between-component-repository-service-controller-annotations-in/">http://www.cicoding.cn/spring/whats-the-difference-between-component-repository-service-controller-annotations-in/</a>

<a target="_blank" href="https://www.cnblogs.com/linjiqin/p/9655649.html">https://www.cnblogs.com/linjiqin/p/9655649.html</a>

<a target="_blank" href="https://blog.csdn.net/zhuchencn/article/details/103823867">https://blog.csdn.net/zhuchencn/article/details/103823867</a>

<a target="_blank" href="https://blog.csdn.net/qq_20398345/article/details/82767896">https://blog.csdn.net/qq_20398345/article/details/82767896</a>

<a target="_blank" href="https://blog.csdn.net/a909301740/article/details/78379720">https://blog.csdn.net/a909301740/article/details/78379720</a>

<a target="_blank" href="https://www.jianshu.com/p/2f1c9fad1d2d">https://www.jianshu.com/p/2f1c9fad1d2d</a>
