
- [单例（Singleton）模式](#t1)
- [原型（Prototype）模式](#t2)
- [工厂方法（FactoryMethod）模式](#t3)
- [抽象工厂（AbstractFactory）模式](#t4)
- [建造者（Builder）模式](#t5)


创建型模式的主要关注点是“怎样创建对象？”，它的主要特点是“将对象的创建与使用分离”。
这样可以降低系统的耦合度，使用者不需要关注对象的创建细节，对象的创建由相关的工厂来完成。就像我们去商场购买商品时，不需要知道商品是怎么生产出来一样，因为它们由专门的厂商生产。

<br>

### <span id="t1">单例模式</span>

> 单例模式确保了一个类只有一个实例，并提供了一个全局访问点。 

肯定不陌生，应该日常都在用。对于一些敏感资源，需要防止生成多个实例，例如**线程池，缓存，处理偏好设置，日志打印器**。

#### 单例模式的内部实现

```java
public class SingleObject {
   //创建 SingleObject 的一个对象
   private static SingleObject instance = new SingleObject();
   
   //让构造函数为 private，这样该类就不会被实例化
   private SingleObject(){}
   
   //获取唯一可用的对象
   public static SingleObject getInstance(){
      return instance;
   }
   public void method(){ }
}
```
调用单例的方式就是通过 `getInstance()` 方法。这个方式是比较主流的，使用比较广泛的。


不过《effective java》里有个`enum`优于`static final`的原则，推荐使用下一个枚举方式。


#### 单例模式的枚举方式
```java
public enum SingleObject {  
    INSTANCE;  
    public void method() {  
    }  
}
```
枚举方式，代码简单，并支持序列化，并且能避免线程安全问题。推荐使用。

#### 单例模式的懒汉式
```java
public class Singleton {  
    private static Singleton instance;  
    private Singleton (){}  
    public static synchronized Singleton getInstance() {  
    if (instance == null) {  
        instance = new Singleton();  
    }  
    return instance;  
    }  
}
```
比较原始的实现方式，通过加锁效率低，在第一次调用才创建，避免内存浪费。


#### 单例模式的双重线程检查模式
```java
public class Singleton {  
    private volatile static Singleton singleton;  
    private Singleton (){}  
    public static Singleton getSingleton() {  
    if (singleton == null) {  
        synchronized (Singleton.class) {  
        if (singleton == null) {  
            singleton = new Singleton();  
        }  
        }  
    }  
    return singleton;  
    }  
}
```
这种方式采用双锁机制，安全且在多线程情况下能保持高性能，代码较为复杂。

<br>


### <span id="t2">原型模式</span>

> 原型模式（Prototype Pattern）是用于创建重复的对象，同时又能保证性能。用一个已经创建的实例作为原型，通过复制该原型对象来创建一个和原型相同或相似的新对象。

用这种方式创建对象非常高效，根本无须知道对象创建的细节。例如，Windows 操作系统的安装通常较耗时，如果复制就快了很多。

#### 原型模式的场景

使用new关键字创建类的时候必须指定类名，但是在开发过程中也会有“在不指定类名的前提下生成实例”的需求。例如，在下面这些情况下，就需要根据现有的实例来生成新的实例。

1. **资源优化场景。**
2. **类初始化需要消化非常多的资源，这个资源包括数据、硬件资源等。** 
3. **性能和安全要求的场景。**
4. **通过 new 产生一个对象需要非常繁琐的数据准备或访问权限，则可以使用原型模式。**
5. **一个对象多个修改者的场景。**
6. **一个对象需要提供给其他对象访问，而且各个调用者可能都需要修改其值时，可以考虑使用原型模式拷贝多个对象供调用者使用。**
7. **在实际项目中，原型模式很少单独出现，一般是和工厂方法模式一起出现，通过 clone 的方法创建一个对象，然后由工厂方法提供给调用者。原型模式已经与 Java 融为浑然一体，大家可以随手拿来使用。**

如果想要让生成实例的框架不再依赖于具体的类，这时，不能指定类名来生成实例，而要事先“注册”一个“原型”实例，然后通过复制该实例来生成新的实例。

> 优点：1、性能提高。 2、逃避构造函数的约束。
> 
> 缺点：配备克隆方法需要对类的功能进行通盘考虑，这对于全新的类不是很难，但对于已有的类不一定很容易，特别当一个类引用不支持串行化的间接对象，或者引用含有循环结构的时候。

#### 原型模式的实现

简单来说，就是实现 `Cloneable` 接口，然后调用 `clone()` 方法。下面类图中使用了浅拷贝，深拷贝参考本站: Java - Java面向对象基础 - Object通用方法、枚举。

<img src="@/assets/blog/img/designpattern/creationMod1.png"/>


首先创建基础原型类 `Prototype` :

```java
public abstract class Prototype implements Cloneable {
    public String s;
    public Integer i;

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

创建两个子类，作为复制的对象，这里对子类重写了 `clone()` 方法，实际情况需要详细更改 `clone()` 方法。
```java
public class Circle extends Prototype {
    public Circle(String s, Integer i) {
        this.s = s;
        this.i = i;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}

public class Square extends Prototype {
    public Square(String s, Integer i) {
        this.s = s;
        this.i = i;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

}
```

原型管理器如下：
```java
public class PrototypeManager {
    private HashMap<String, Prototype> hashMap = new HashMap<String,Prototype>();
    //构造函数预设可供拷贝的对象
    public PrototypeManager() {
        //假设预先在Map中存入对象
        hashMap.put("Circle",new Circle("圆", 1));
        hashMap.put("Square",new Square("方", 2));
    }
    //get方法进行实际拷贝
    public Prototype get(String key) {
        try {
            Prototype prototype = hashMap.get(key);
            return (Prototype) prototype.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static void main(String[] args) {
        PrototypeManager pm = new PrototypeManager();
        Prototype obj1 = (Circle)pm.get("Circle");
        Prototype obj2 = (Square)pm.get("Square");
    }
}
```

<br>

### <span id="t3">工厂方法模式</span>

这个设计模式相对简单，所以就简略写下，毕竟不能白整理，总得留下点什么。

> 定义了一个创建对象的接口，但由子类决定要实例化的类是哪一个。工厂方法让类把实例化推迟到子类。

个人理解：存在生产和产品两个接口，工厂实现生产接口，重写生产方法，并返回具体产品，不同工厂返回不同的产品实现类。

<img src="@/assets/blog/img/designpattern/FactoryAndSingletonsMode.png"/>

产品：

```java
//产品，工厂生产的产品
abstract class Product {
	public String name;
}
//实际产品，也可以直接用父类
class ConcreteProduct extends Product{
}
```

生产：

```java
interface Creator {
	//生产接口，制造产品
	Product productSomething();
}
//实际生产者，工厂
class ConcreteCreator implements Creator{
	@Override
	public Product productSomething() {
		Product product = new ConcreteProduct();
		product.name = "生产一个具体产品";
		return product;
	}
}
```

<br>

### <span id="t4">抽象工厂模式</span>

> 抽象工厂模式的定义：是一种为访问类提供一个创建一组相关或相互依赖对象的接口，且访问类无须指定所要产品的具体类就能得到同族的不同等级的产品的模式结构。

抽象工厂模式是工厂方法模式的升级版本，工厂方法模式只生产一个等级的产品，而抽象工厂模式可生产多个等级的产品。

使用抽象工厂模式一般要满足以下条件:
 - 系统中有多个产品族，每个具体工厂创建同一族但属于不同等级结构的产品。
 - 系统一次只可能消费其中某一族产品，即同族的产品一起使用。

抽象工厂模式除了具有工厂方法模式的优点外，其他主要优点如下:
 - 可以在类的内部对产品族中相关联的多等级产品共同管理，而不必专门引入多个新的类来进行管理。
 - 当增加一个新的产品族时不需要修改原代码，满足开闭原则。

其缺点是：当产品族中需要增加一个新的产品时，所有的工厂类都需要进行修改。


#### 抽象工厂模式的结构

抽象工厂模式的主要角色如下。
1. 抽象工厂（Abstract Factory）：提供了创建产品的接口，它包含多个创建产品的方法 newProduct()，可以创建多个不同等级的产品。
2. 具体工厂（Concrete Factory）：主要是实现抽象工厂中的多个抽象方法，完成具体产品的创建。
3. 抽象产品（Product）：定义了产品的规范，描述了产品的主要特性和功能，抽象工厂模式有多个抽象产品。
4. 具体产品（ConcreteProduct）：实现了抽象产品角色所定义的接口，由具体工厂来创建，它同具体工厂之间是多对一的关系。


<img src="@/assets/blog/img/designpattern/creationMode2.png"/>


抽象工厂类：
```java
interface CourseFactory {
    Video getVideo();
}
```


具体工厂类：
```java
class JavaCourseFactory implements CourseFactory {
    @Override
    public Video getVideo() {
        return new JavaVideo();
    }
}
class PythonCourseFactory implements CourseFactory {
    @Override
    public Video getVideo() {
        return new PythonVideo();
    }
}
```

抽象产品类：
```java
abstract class Video {
    public abstract void produce();
}
```

具体产品类：
```java
class JavaVideo extends Video {
    @Override
    public void produce() {
        System.out.println("录制Java课程视频");
    }
}
class PythonVideo extends Video {
    @Override
    public void produce() {
        System.out.println("Python课程视频");
    }
}
```

<br>


### <span id="t5">建造者模式</span>


> 建造者模式的定义：指将一个复杂对象的构造与它的表示分离，使同样的构建过程可以创建不同的表示，这样的设计模式被称为建造者模式。
> 它是将一个复杂的对象分解为多个简单的对象，然后一步一步构建而成。它将变与不变相分离，即产品的组成部分是不变的，但每一部分是可以灵活选择的。

该模式的主要优点如下：
1. 各个具体的建造者相互独立，有利于系统的扩展。
2. 客户端不必知道产品内部组成的细节，便于控制细节风险。

其缺点如下：
1. 产品的组成部分必须相同，这限制了其使用范围。
2. 如果产品的内部变化复杂，该模式会增加很多的建造者类。

建造者（Builder）模式和工厂模式的关注点不同：建造者模式注重零部件的组装过程，而工厂方法模式更注重零部件的创建过程，但两者可以结合使用。

使用场景可以从下面代码中得知好处：
```java
public class Click { 
    public static void main(String[] args) { 
        // 非 Builder 模式 
        Computer computer = new Computer(“cpu”, “screen”, “memory”, “mainboard”); 
        // Builder 模式 
        NewComputer newComputer = new NewComputer.Builder() 
        .cpu(“cpu”) 
        .screen(“screen”) 
        .memory(“memory”) 
        .mainboard(“mainboard”) 
        .build(); 
    } 
} 
```



#### 建造者模式的结构

建造者（Builder）模式的主要角色如下。
1. 产品角色（Product）：它是包含多个组成部件的复杂对象，由具体建造者来创建其各个滅部件。
2. 抽象建造者（Builder）：它是一个包含创建产品各个子部件的抽象方法的接口，通常还包含一个返回复杂产品的方法 getResult()。
3. 具体建造者(Concrete Builder）：实现 Builder 接口，完成复杂产品的各个部件的具体创建方法。
4. 指挥者（Director）：它调用建造者对象中的部件构造与装配方法完成复杂对象的创建，在指挥者中不涉及具体产品的信息。


<img src="@/assets/blog/img/designpattern/creationMode3.png"/>


产品角色：
```java
class Product {
    private String partA;
    private String partB;
    private String partC;
    public void setPartA(String partA){
        this.partA=partA;
    }
    public void setPartB(String partB){
        this.partB=partB;
    }
    public void setPartC(String partC){
        this.partC=partC;
    }
    public void show(){
        //显示产品的特性
    }
}
```

抽象建造者：
```java
abstract class Builder {

    //创建产品对象
    protected Product product = new Product();

    public abstract void buildPartA();
    public abstract void buildPartB();
    public abstract void buildPartC();
    //返回产品对象
    public Product getResult(){
        return product;
    }
}
```

具体建造者：
```java
public class ConcreteBuilder extends Builder {
    @Override
    public void buildPartA() {
        product.setPartA("建造 PartA");
    }

    @Override
    public void buildPartB() {
        product.setPartA("建造 PartB");
    }

    @Override
    public void buildPartC() {
        product.setPartA("建造 PartC");
    }
}
```


指挥者：
```java
public class Director {
    private Builder builder;
    public Director(Builder builder){
        this.builder=builder;
    }
    //产品构建与组装方法
    public Product construct(){
        builder.buildPartA();
        builder.buildPartB();
        builder.buildPartC();
        return builder.getResult();
    }
}
```

客户端调用：
```java
public class Client {
    public static void main(String[] args){
        Builder builder=new ConcreteBuilder();
        Director director=new Director(builder);
        Product product=director.construct();
        product.show();
    }
}
```



