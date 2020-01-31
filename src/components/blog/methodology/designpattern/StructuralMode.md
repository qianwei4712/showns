
- 代理（Proxy）模式
- 适配器（Adapter）模式
- 桥接（Bridge）模式
- [装饰者（Decorator）模式](#t4)
- 外观（Facade）模式
- 享元（Flyweight）模式
- 组合（Composite）模式


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

<img src="@/assets/blog/img/DecoratorMode.png"/>

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







