<div class="catalog">

- [代理模式](#t1)
- [适配器模式](#t2)
- [桥接模式](#t3)
- [装饰者模式](#t4)
- [外观模式](#t5)
- [享元模式](#t6)
- [组合模式](#t7)

</div>


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

### <span id="t2">适配器模式</span>

> 适配器模式的定义如下：将一个类的接口转换成客户希望的另外一个接口，使得原本由于接口不兼容而不能一起工作的那些类能一起工作。
>
> 适配器模式分为类结构型模式和对象结构型模式两种，前者类之间的耦合度比后者高，且要求程序员了解现有组件库中的相关组件的内部结构，所以应用相对较少些。


**适配器模式的优点**

- 客户端通过适配器可以透明地调用目标接口。
- 复用了现存的类，程序员不需要修改原有代码而重用现有的适配者类。
- 将目标类和适配者类解耦，解决了目标类和适配者类接口不一致的问题。

**适配器模式的缺点**

对类适配器来说，更换适配器的实现过程比较复杂。

**适配器模式的结构与实现**

1. Target（目标抽象类）：目标抽象类定义客户所需接口，可以是一个抽象类或接口，也可以是具体类。
2. Adapter（适配器类）：适配器可以调用另一个接口，作为一个转换器，对Adaptee和Target进行适配，适配器类是适配器模式的核心，在对象适配器中，它通过继承Target并关联一个Adaptee对象使二者产生联系。
3. Adaptee（适配者类）：适配者即被适配的角色，它定义了一个已经存在的接口，这个接口需要适配，适配者类一般是一个具体类，包含了客户希望使用的业务方法，在某些情况下可能没有适配者类的源代码。


**类结构型模式**

<img src="@/assets/blog/img/designpattern/StructuralMode1.jpg"/>


目标接口:
```java
interface Target {
    public void request();
}
```

适配者类:
```java
class Adaptee {
    public void specificRequest() {
        System.out.println("适配者中的业务代码被调用！");
    }
}
```

适配器类:
```java
class ClassAdapter extends Adaptee implements Target {
    @Override
    public void request() {
        super.specificRequest();
    }    
}
```

客户端调用:
```java
public static void main(String[] args) {
        Target target = new ClassAdapter();
        target.request();
    }
```


**对象结构型模式**

<img src="@/assets/blog/img/designpattern/StructuralMode2.jpg"/>

目标接口和适配者类保持不变，更改适配器如下：
```java
class ObjectAdapter implements Target {

    private Adaptee adaptee;
    public ObjectAdapter(Adaptee adaptee) {
        this.adaptee=adaptee;
    }

    @Override
    public void request() {
        adaptee.specificRequest();
    }
}
```

客户端调用：
```java
public static void main(String[] args) {
        Target target = new ObjectAdapter(new Adaptee());
        target.request();
    }
```

<br>

### <span id="t3">桥接模式</span>

> 桥接模式的定义如下：将抽象与实现分离，使它们可以独立变化。它是用组合关系代替继承关系来实现，从而降低了抽象和实现这两个可变维度的耦合度。

桥接模式的优点是：
 - 由于抽象与实现分离，所以扩展能力强；
 - 其实现细节对客户透明。

缺点是：由于聚合关系建立在抽象层，要求开发者针对抽象化进行设计与编程，这增加了系统的理解与设计难度。

桥接（Bridge）模式包含以下主要角色。
1. 抽象化（Abstraction）角色：定义抽象类，并包含一个对实现化对象的引用。
2. 扩展抽象化（Refined    Abstraction）角色：是抽象化角色的子类，实现父类中的业务方法，并通过组合关系调用实现化角色中的业务方法。
3. 实现化（Implementor）角色：定义实现化角色的接口，供扩展抽象化角色调用。
4. 具体实现化（Concrete Implementor）角色：给出实现化角色接口的具体实现。

<img src="@/assets/blog/img/designpattern/StructuralMode3.jpg"/>

实现化（Implementor）角色：
```java
interface Implementor {
    public void operationImpl();
}
```

具体实现化（Concrete Implementor）角色：
```java
public class ConcreteImplementor implements Implementor {
    @Override
    public void operationImpl() {
        System.out.println("具体实现化(Concrete Implementor)角色被访问" );
    }
}
```

抽象化（Abstraction）角色：
```java
abstract class Abstraction {
    protected Implementor imple;
    protected Abstraction(Implementor imple) {
        this.imple=imple;
    }
    public abstract void operation();
}
```

扩展抽象化（Refined    Abstraction）角色：
```java
class RefinedAbstraction extends Abstraction{

    protected RefinedAbstraction(Implementor imple) {
        super(imple);
    }

    @Override
    public void operation() {
        System.out.println("扩展抽象化(Refined Abstraction)角色被访问" );
        imple.operationImpl();
    }
}
```

客户端调用：
```java
public static void main(String[] args) {
        Implementor imple = new ConcreteImplementor();
        Abstraction abs = new RefinedAbstraction(imple);
        abs.operation();
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

<br>

### <span id="t5">外观模式</span>

> 外观模式的定义：是一种通过为多个复杂的子系统提供一个一致的接口，而使这些子系统更加容易被访问的模式。
> 该模式对外有一个统一接口，外部应用程序不用关心内部子系统的具体的细节，这样会大大降低应用程序的复杂度，提高了程序的可维护性。


外观模式是“迪米特法则”的典型应用，它有以下主要优点。
1. 降低了子系统与客户端之间的耦合度，使得子系统的变化不会影响调用它的客户类。
2. 对客户屏蔽了子系统组件，减少了客户处理的对象数目，并使得子系统使用起来更加容易。
3. 降低了大型软件系统中的编译依赖性，简化了系统在不同平台之间的移植过程，因为编译一个子系统不会影响其他的子系统，也不会影响外观对象。

外观模式的主要缺点如下。
1. 不能很好地限制客户使用子系统类。
2. 增加新的子系统可能需要修改外观类或客户端的源代码，违背了“开闭原则”。


外观模式的结构比较简单，主要是定义了一个高层接口。它包含了对各个子系统的引用，客户端可以通过它访问各个子系统的功能。现在来分析其基本结构和实现方法。

外观（Facade）模式包含以下主要角色。
1. 外观（Facade）角色：为多个子系统对外提供一个共同的接口。
2. 子系统（Sub System）角色：实现系统的部分功能，客户可以通过外观角色访问它。
3. 客户（Client）角色：通过一个外观角色访问各个子系统的功能。

<img src="@/assets/blog/img/designpattern/StructuralMode4.jpg"/>

子系统（Sub System）角色：
```java
class SubSystem01 {
    public void method1() {
        System.out.println("子系统01的method1()被调用！");
    }
}

class SubSystem02 {
    public void method2() {
        System.out.println("子系统02的method2()被调用！");
    }
}
```

外观（Facade）角色：
```java
class Facade {
    private SubSystem01 obj1 = new SubSystem01();
    private SubSystem02 obj2 = new SubSystem02();

    public void method() {
        obj1.method1();
        obj2.method2();
    }
}
```


客户（Client）角色：
```java
public static void main(String[] args) {
        Facade f = new Facade();
        f.method();
    }
```


<br>


### <span id="t6">享元模式</span>

> 享元模式的定义：运用共享技术来有効地支持大量细粒度对象的复用。它通过共享已经存在的又橡来大幅度减少需要创建的对象数量、避免大量相似类的开销，从而提高系统资源的利用率。

享元模式的主要优点是：相同对象只要保存一份，这降低了系统中对象的数量，从而降低了系统中细粒度对象给内存带来的压力。

其主要缺点是：
1. 为了使对象可以共享，需要将一些不能共享的状态外部化，这将增加程序的复杂性。
2. 读取享元模式的外部状态会使得运行时间稍微变长。

享元模式中存在以下两种状态：
**内部状态**，即不会随着环境的改变而改变的可共享部分；
**外部状态**，指随环境改变而改变的不可以共享的部分。享元模式的实现要领就是区分应用中的这两种状态，并将外部状态外部化。下面来分析其基本结构和实现方法。

享元模式的主要角色有如下。
1. 抽象享元角色（Flyweight）:是所有的具体享元类的基类，为具体享元规范需要实现的公共接口，非享元的外部状态以参数的形式通过方法传入。
2. 具体享元（Concrete Flyweight）角色：实现抽象享元角色中所规定的接口。
3. 非享元（Unsharable Flyweight)角色：是不可以共享的外部状态，它以参数的形式注入具体享元的相关方法中。
4. 享元工厂（Flyweight Factory）角色：负责创建和管理享元角色。当客户对象请求一个享元对象时，享元工厂检査系统中是否存在符合要求的享元对象，如果存在则提供给客户；如果不存在的话，则创建一个新的享元对象。

<img src="@/assets/blog/img/designpattern/StructuralMode5.jpg"/>


抽象享元角色（Flyweight）:
```java
interface Flyweight {
    //定义业务操作
    public void operation(UnsharedConcreteFlyweight state);
}
```

具体享元（Concrete Flyweight）角色：
```java
class ConcreteFlyweight implements Flyweight {

    private String key;

    //接受外部状态
    public ConcreteFlyweight(String key) {
        this.key=key;
        System.out.println("具体享元"+key+"被创建！");
    }

    public void operation(UnsharedConcreteFlyweight outState) {
        System.out.print("具体享元"+key+"被调用，");
        System.out.println("非享元信息是:"+outState.getInfo());
    }
}
```

非享元（Unsharable Flyweight)角色：
```java
class UnsharedConcreteFlyweight {
    private String info;

    UnsharedConcreteFlyweight(String info) {
        this.info=info;
    }
    public String getInfo() {
        return info;
    }
    public void setInfo(String info) {
        this.info=info;
    }
}
```


享元工厂（Flyweight Factory）角色：
```java
class FlyweightFactory {
    //定义一个池容器
    private static HashMap<String, Flyweight> pool = new HashMap<>();

    //享元工厂
    public static Flyweight getFlyweight(String key) {
        Flyweight flyweight = pool.get(key);
        if(flyweight!=null) {
            System.out.println("具体享元"+key+"已经存在，被成功获取！");
        } else {
            flyweight = new ConcreteFlyweight(key);
            pool.put(key, flyweight);
        }
        return flyweight;
    }
}
```

客户端调用：
```java
 public static void main(String[] args) {
        Flyweight f01 = FlyweightFactory.getFlyweight("a");
        Flyweight f02 = FlyweightFactory.getFlyweight("a");
        Flyweight f11 = FlyweightFactory.getFlyweight("b");
        Flyweight f12 = FlyweightFactory.getFlyweight("b");
        f01.operation(new UnsharedConcreteFlyweight("第1次调用a。"));
        f02.operation(new UnsharedConcreteFlyweight("第2次调用a。"));
        f11.operation(new UnsharedConcreteFlyweight("第1次调用b。"));
        f12.operation(new UnsharedConcreteFlyweight("第2次调用b。"));
    }
```



<br>


### <span id="t7">组合模式</span>

> 组合模式的定义：有时又叫作部分-整体模式，它是一种将对象组合成树状的层次结构的模式，用来表示“部分-整体”的关系，使用户对单个对象和组合对象具有一致的访问性。


组合模式的主要优点有：
1. 组合模式使得客户端代码可以一致地处理单个对象和组合对象，无须关心自己处理的是单个对象，还是组合对象，这简化了客户端代码；
2. 更容易在组合体内加入新的对象，客户端不会因为加入了新的对象而更改源代码，满足“开闭原则”；

其主要缺点是：
1. 设计较复杂，客户端需要花更多时间理清类之间的层次关系；
2. 不容易限制容器中的构件；
3. 不容易用继承的方法来增加构件的新功能；

组合模式包含以下主要角色。
1. 抽象构件（Component）角色：它的主要作用是为树叶构件和树枝构件声明公共接口，并实现它们的默认行为。在透明式的组合模式中抽象构件还声明访问和管理子类的接口；在安全式的组合模式中不声明访问和管理子类的接口，管理工作由树枝构件完成。
2. 树叶构件（Leaf）角色：是组合中的叶节点对象，它没有子节点，用于实现抽象构件角色中 声明的公共接口。
3. 树枝构件（Composite）角色：是组合中的分支节点对象，它有子节点。它实现了抽象构件角色中声明的接口，它的主要作用是存储和管理子部件，通常包含 Add()、Remove()、GetChild() 等方法。


组合模式分为透明式的组合模式和安全式的组合模式。

**组合模式之透明方式**

<img src="@/assets/blog/img/designpattern/StructuralMode6.jpg"/>

抽象构件（Component）角色：
```java
interface Component {
    public void add(Component c);
    public void remove(Component c);
    public Component getChild(int i);
    public void operation();
}
```

树叶构件（Leaf）角色：
```java
class Leaf implements Component {

    private String name;
    public Leaf(String name) {
        this.name=name;
    }

    @Override
    public void add(Component c) { }

    @Override
    public void remove(Component c) { }

    @Override
    public Component getChild(int i) {
        return null;
    }

    @Override
    public void operation() {
        System.out.println("树叶"+name+"：被访问！");
    }
}
```

树枝构件（Composite）角色：
```java
class Composite implements Component {

    private ArrayList<Component> children = new ArrayList<>();

    @Override
    public void add(Component c) {
        children.add(c);
    }

    @Override
    public void remove(Component c) {
        children.remove(c);
    }

    @Override
    public Component getChild(int i) {
        return children.get(i);
    }

    @Override
    public void operation() {
        for(Object obj : children) {
            ((Component)obj).operation();
        }
    }
}

```

客户端调用：
```java
public static void main(String[] args) {
        Component c0=new Composite();
        Component c1=new Composite();
        Component leaf1=new Leaf("1");
        Component leaf2=new Leaf("2");
        Component leaf3=new Leaf("3");
        c0.add(leaf1);
        c0.add(c1);
        c1.add(leaf2);
        c1.add(leaf3);
        c0.operation();
    }
```



**组合模式之安全方式**

<img src="@/assets/blog/img/designpattern/StructuralMode7.jpg"/>

抽象构件（Component）角色：
```java
interface Component {
    public void operation();
}
```

树叶构件（Leaf）角色：
```java
class Leaf implements Component {

    private String name;
    public Leaf(String name) {
        this.name=name;
    }

    @Override
    public void operation() {
        System.out.println("树叶"+name+"：被访问！");
    }
}
```

树枝构件（Composite）角色：
```java
class Composite implements Component {

    private ArrayList<Component> children = new ArrayList<>();

    public void add(Component c) {
        children.add(c);
    }

    public void remove(Component c) {
        children.remove(c);
    }

    public Component getChild(int i) {
        return children.get(i);
    }

    @Override
    public void operation() {
        for(Object obj : children) {
            ((Component)obj).operation();
        }
    }
}

```
