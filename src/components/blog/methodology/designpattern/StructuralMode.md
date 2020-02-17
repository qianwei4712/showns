
- [代理（Proxy）模式](#t1)
- 适配器（Adapter）模式
- 桥接（Bridge）模式
- [装饰者（Decorator）模式](#t4)
- 外观（Facade）模式
- 享元（Flyweight）模式
- 组合（Composite）模式

<br>

### <span id="t1">代理模式</span>

> 代理模式的定义：由于某些原因需要给某对象提供一个代理以控制对该对象的访问。这时，访问对象不适合或者不能直接引用目标对象，代理对象作为访问对象和目标对象之间的中介。

代理模式的主要优点有：
- 代理模式在客户端与目标对象之间起到一个中介作用和保护目标对象的作用；
- 代理对象可以扩展目标对象的功能；
- 代理模式能将客户端与目标对象分离，在一定程度上降低了系统的耦合度；

其主要缺点是：
- 在客户端和目标对象之间增加一个代理对象，会造成请求处理速度变慢；
- 增加了系统的复杂度；


#### 代理模式的应用场景

- 远程代理，这种方式通常是为了隐藏目标对象存在于不同地址空间的事实，方便客户端访问。例如，用户申请某些网盘空间时，会在用户的文件系统中建立一个虚拟的硬盘，用户访问虚拟硬盘时实际访问的是网盘空间。
- 虚拟代理，这种方式通常用于要创建的目标对象开销很大时。例如，下载一幅很大的图像需要很长时间，因某种计算比较复杂而短时间无法完成，这时可以先用小比例的虚拟代理替换真实的对象，消除用户对服务器慢的感觉。
- 安全代理，这种方式通常用于控制不同种类客户对真实对象的访问权限。
- 智能指引，主要用于调用目标对象时，代理附加一些额外的处理功能。例如，增加计算真实对象的引用次数的功能，这样当该对象没有被引用时，就可以自动释放它。
- 延迟加载，指为了提高系统的性能，延迟对目标的加载。例如，Hibernate 中就存在属性的延迟加载和关联表的延时加载。


#### 代理模式的结构

代理模式的主要角色如下。
1. 抽象主题（Subject）类：通过接口或抽象类声明真实主题和代理对象实现的业务方法。
2. 真实主题（Real Subject）类：实现了抽象主题中的具体业务，是代理对象所代表的真实对象，是最终要引用的对象。
3. 代理（Proxy）类：提供了与真实主题相同的接口，其内部含有对真实主题的引用，它可以访问、控制或扩展真实主题的功能。



**静态代理**

<img src="@/assets/blog/img/designpattern/StrategyMode2.jpg"/>

抽象主题类:
```java
interface Subject {
    void business();
}
```

实际主题类:
```java
class RealSubject implements Subject {
    @Override
    public void business() {
        System.out.println("具体主题实现业务功能");
    }
}
```

代理对象：
```java
class ProxyManager implements Subject {

    private Subject realSubject;

    public ProxyManager(Subject subject) {
        super();
        this.realSubject = subject;
    }

    @Override
    public void business() {
        System.out.println("代理管理器业务功能,实际由主题完成");
        realSubject.business();
    }
}
```

客户端调用：
```java
 public static void main(String[] args) {
        ProxyManager proxyManager = new ProxyManager(new RealSubject());
        proxyManager.business();
    }
```



**动态代理**

动态代理的主题类不变，更改代理对象类，客户端调用涉及了jdk的三个类
```java
java.lang.reflect.InvocationHandler;
java.lang.reflect.Method;
java.lang.reflect.Proxy;
```

下面贴下代码：
```java
class ProxyManager implements InvocationHandler {

    private Subject realSubject;

    public ProxyManager(Subject subject) {
        super();
        this.realSubject = subject;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("代理管理器业务功能,实际由主题完成");
        return method.invoke(realSubject, args);
    }
}
```

客户端调用：
```java
public static void main(String[] args) {
     ProxyManager proxyManager = new ProxyManager(new RealSubject());
     Subject subject = (Subject) Proxy.newProxyInstance(Subject.class.getClassLoader(), new Class[]{Subject.class}, proxyManager);
     subject.business();
 }
```


<br>

### <span id="t4">装饰者模式</span>

> 装饰者模式动态地将责任附加到对象上。若要扩展功能，装饰者提供了比继承更有弹性的替代方案。

个人理解：装饰产品类（最终得到的对象）包含对基本对象（**被装饰者和其他装饰产品类都行**）的引用，覆盖引用的责任方法，并添加特有，并调用基本对象的责任方法。


缺点：需要维护太多的类，对于刚使用这部分代码的程序员造成困扰。

java.io 流是典型的装饰模式。

#### 基本原理

装饰者模式可以分成以下几个部分：

- Component 类通常当抽象角色（抽象类或者接口），也是装饰者和装饰对象的**基本类型**。
- ConcreteComponent  为具体实现类，也是**被装饰者**。
- Decorator  是**装饰类**，实现了Component 接口，**通常用抽象类实现**。同时内部维护了一个ConcreteComponent 实例，一般通过构造函数初始化。最后的产品继承Decorator  ，并真正得到装饰产品。
- ConcreteDecorator 是具体的**装饰产品类**，也就是装饰后的结果。重写Component 的方法，作为装饰添加功能。

<img src="@/assets/blog/img/designpattern/DecoratorMode.png"/>

下面是摘自菜鸟教程的例子

```java
interface Shape {
	void draw();
}
class Circle implements Shape{
	@Override
	public void draw() {
		System.out.println("Shape: Circle");		
	}
}

```

```java
abstract class ShapeDecorator implements Shape{
	protected Shape decoratedShape;
	public ShapeDecorator(Shape decoratedShape) {
		super();
		this.decoratedShape = decoratedShape;
	}
	
	@Override
	public void draw() { decoratedShape.draw(); }
}
```

```java
class RedShapeDecorator extends ShapeDecorator {
	public RedShapeDecorator(Shape decoratedShape) {
		super(decoratedShape);
	}

	@Override
	public void draw() {
		decoratedShape.draw();
		setRedBorder(decoratedShape);
	}

	private void setRedBorder(Shape decoratedShape) {
		System.out.println("Border Color: Red");
	}
}
```

实际情况下，使用装饰者模式的情况

```java
private static final Logger logger = LoggerFactory.getLogger(Component.class);
logger.error(string);
```







