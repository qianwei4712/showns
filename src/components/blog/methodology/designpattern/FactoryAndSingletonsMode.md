### 工厂模式

> 节选自《Head First 设计模式》+ 菜鸟教程


这个设计模式相对简单，所以就简略写下，毕竟不能白整理，总得留下点什么。


> 定义了一个创建对象的接口，但由子类决定要实例化的类是哪一个。工厂方法让类把实例化推迟到子类。

个人理解：存在生产和产品两个接口，工厂实现生产接口，重写生产方法，并返回具体产品，不同工厂返回不同的产品实现类。

<img src="@/assets/blog/img/FactoryAndSingletonsMode.png"/>

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


### 单例模式

> 单例模式确保了一个类只有一个实例，并提供了一个全局访问点。 

肯定不陌生，应该日常都在用。对于一些敏感资源，需要防止生成多个实例，例如**线程池，日志打印器**。

#### 内部实现

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
调用单例的方式就是通过`getInstance()`方法。

这个方式是比较主流的，使用比较广泛的，也是我比较常用的。

不过《effective java》里有个`enum`优于`static final`的原则，推荐使用下一个枚举方式。


#### 枚举方式
```java
public enum SingleObject {  
    INSTANCE;  
    public void method() {  
    }  
}
```
枚举方式，代码简单，并支持序列化，并且能避免线程安全问题。推荐使用。

#### 懒汉式
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


#### 双重线程检查模式
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



