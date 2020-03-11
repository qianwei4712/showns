<div class="catalog">

- [模板方法模式](#t1)
- [策略模式](#t2)
- [命令模式](#t3)
- 职责链模式
- 状态模式
- [观察者模式](#t6)
- 中介者模式
- 迭代器模式
- 访问者模式
- 备忘录模式
- 解释器模式

</div>

### <span id="t1">模板方法模式</span>

> 模板方法（Template Method）模式的定义如下：定义一个操作中的算法骨架，而将算法的一些步骤延迟到子类中，使得子类可以不改变该算法结构的情况下重定义该算法的某些特定步骤。它是一种类行为型模式。

该模式的主要优点如下。
1. 它封装了不变部分，扩展可变部分。它把认为是不变部分的算法封装到父类中实现，而把可变部分算法由子类继承实现，便于子类继续扩展。
2. 它在父类中提取了公共的部分代码，便于代码复用。
3. 部分方法是由子类实现的，因此子类可以通过扩展方式增加相应的功能，符合开闭原则。

该模式的主要缺点如下。
1. 对每个不同的实现都需要定义一个子类，这会导致类的个数增加，系统更加庞大，设计也更加抽象。
2. 父类中的抽象方法由子类实现，子类执行的结果会影响父类的结果，这导致一种反向的控制结构，它提高了代码阅读的难度。


模板方法模式包含以下主要角色:

1. 抽象类（Abstract Class）：负责给出一个算法的轮廓和骨架。它由一个模板方法和若干个基本方法构成。
2. 具体子类（Concrete Class）：实现抽象类中所定义的抽象方法和钩子方法，它们是一个顶级逻辑的一个组成步骤。

抽象类（Abstract Class）：
```java
abstract class AbstractClass {
    public void TemplateMethod() {
        //模板方法
        SpecificMethod();
        abstractMethod1();
        abstractMethod2();
    }
    public void SpecificMethod() {
        //具体方法
        System.out.println("抽象类中的具体方法被调用...");
    }
    public abstract void abstractMethod1(); //抽象方法1
    public abstract void abstractMethod2(); //抽象方法2
}
```

具体子类（Concrete Class）：
```java
class ConcreteClass extends AbstractClass {
    @Override
    public void abstractMethod1() {
        System.out.println("抽象方法1的实现被调用...");
    }
    @Override
    public void abstractMethod2() {
        System.out.println("抽象方法2的实现被调用...");
    }
}
```

客户端调用：
```java
public static void main(String[] args) {
        AbstractClass abstractClass = new ConcreteClass();
        abstractClass.abstractMethod1();
        abstractClass.SpecificMethod();
    }
```


<br>

### <span id="t2">策略模式</span>

> 策略模式定义了算法族，分别封装起来，让它们之间可以相互替换，此设计模式让算法的变化独立于使用算法的客户。    ------《Head First 设计模式》 P.24

个人理解：对于某一个算法或者业务，预先实现不同的方案，通过接口，调用不同实例，来获得不同的结果。

缺点也非常明显，所有的算法都是唯一确定的，都是事先已经实现的，策略模式只是在选择。

<img src="@/assets/blog/img/designpattern/StrategyMode1.png"/>


简单代码实现：

```java
//---------抽象类，父类----------------------------------------------------------------
abstract class Duck {
	protected FlyBehavior flyBehavior;
	
	public void swim() {};
	
	public void fly() {
		flyBehavior.fly();
	};
	
	public FlyBehavior getFlyBehavior() { return flyBehavior; }
	public void setFlyBehavior(FlyBehavior flyBehavior) { this.flyBehavior = flyBehavior; }
	
}
//---------算法接口----------------------------------------------------------------------
interface FlyBehavior {
	void fly();
}
//---------算法实现----------------------------------------------------------------------
class FlyWithRocket implements FlyBehavior {
	@Override
	public void fly() {
		System.out.println("火箭飞行");
	}
}

```



```java
class GreenHeadDuck extends Duck {
	public static void main(String[] args) {
		GreenHeadDuck duck = new GreenHeadDuck();
		duck.setFlyBehavior(new FlyWithRocket());
		duck.fly();
	}
}
```

<br>

### <span id="t3">命令模式</span>

> 命令（Command）模式的定义如下：将一个请求封装为一个对象，使发出请求的责任和执行请求的责任分割开。这样两者之间通过命令对象进行沟通，这样方便将命令对象进行储存、传递、调用、增加与管理。

命令模式的主要优点如下。
1. 降低系统的耦合度。命令模式能将调用操作的对象与实现该操作的对象解耦。
2. 增加或删除命令非常方便。采用命令模式增加与删除命令不会影响其他类，它满足“开闭原则”，对扩展比较灵活。
3. 可以实现宏命令。命令模式可以与组合模式结合，将多个命令装配成一个组合命令，即宏命令。
4. 方便实现 Undo 和 Redo 操作。命令模式可以与后面介绍的备忘录模式结合，实现命令的撤销与恢复。

其缺点是：可能产生大量具体命令类。因为计对每一个具体操作都需要设计一个具体命令类，这将增加系统的复杂性。

命令模式包含以下主要角色。
- 抽象命令类（Command）角色：声明执行命令的接口，拥有执行命令的抽象方法 execute()。
- 具体命令角色（Concrete Command）角色：是抽象命令类的具体实现类，它拥有接收者对象，并通过调用接收者的功能来完成命令要执行的操作。
- 实现者/接收者（Receiver）角色：执行命令功能的相关操作，是具体命令对象业务的真正实现者。
- 调用者/请求者（Invoker）角色：是请求的发送者，它通常拥有很多的命令对象，并通过访问命令对象来执行相关请求，它不直接访问接收者。


<img src="@/assets/blog/img/designpattern/BehavioralMode1.jpg"/>


抽象命令类（Command）角色：
```java
interface Command {
    public void execute();
}
```

实现者/接收者（Receiver）角色：
```java
class Receiver {
    public void action() {
        System.out.println("接收者的action()方法被调用...");
    }
}
```

具体命令角色（Concrete Command）角色：
```java
class ConcreteCommand implements Command {

    private Receiver receiver;

    public ConcreteCommand(Receiver receiver) {
        this.receiver = receiver;
    }

    @Override
    public void execute() {
        receiver.action();
    }
}
```

调用者/请求者（Invoker）角色：
```java
class Invoker {
    private Command command;

    public Invoker(Command command) {
        this.command = command;
    }

    public void setCommand(Command command) {
        this.command=command;
    }
    public void call() {
        System.out.println("调用者执行命令command...");
        command.execute();
    }
}
```

客户端调用：
```java
public static void main(String[] args) {
        Command cmd = new ConcreteCommand(new Receiver());
        Invoker ir = new Invoker(cmd);
        System.out.println("客户访问调用者的call()方法...");
        ir.call();
    }
```


<br>

### <span id="t6">观察者模式</span>

观察者模式定义了对象之间的一对多依赖，当一个对象状态改变时，它的依赖者都会收到通知并自动更新。

**个人理解：在主题内定义一个观察者容器，在数据更新时，遍历容器内成员，并调用观察者接口的方法**

缺点：若需要通知的观察者较多，通知方法执行时间太长

将观察者模式分成数据提供方“主题”，数据获取方“观察者”。

实际关系类比 报社自动送订阅app推送。Java.util已经内置了这个设计模式，在文章后半段将会讲解。

#### 基本原理

<img src="@/assets/blog/img/designpattern/ObserverMode1.png"/>

基本模型的代码实现。

```java
//---------主题接口----------------------------------------------------------------
interface Subject {
	void addObserver(Observer observer);
	void removeObserver(Observer observer);
	void notiy();
}
//---------观察者接口----------------------------------------------------------------
interface Observer {
	void update();
}
```

```java
//---------主题实现类----------------------------------------------------------------
class CommonSubject implements Subject {
	private ArrayList<Observer> observers;

	@Override
	public void addObserver(Observer observer) {
		observers.add(observer);
	}
	@Override
	public void removeObserver(Observer observer) {
		int index = observers.indexOf(observer);
		if (index>=0) {
			observers.remove(index);
		}
	}
	@Override
	public void notiy() {
		for (Observer observer : observers) {
			observer.update();
		}
	}
}
//---------观察者实现类----------------------------------------------------------------
public class OneObserver implements Observer {
	private Subject subject;
	
	@Override
	public void update() {
		System.out.println("更新方法被调用，主题通知了观察者");
	}
	public OneObserver(Subject subject) {
		super();
		this.subject = subject;
		subject.addObserver(this);
	}
	public Subject getSubject() { return subject; }
	public void setSubject(Subject subject) { this.subject = subject; }
	
}
```

#### java.util观察者模式



java.util 实现的观察者模式更加安全，并实现了基本功能，并进行了拓展。

##### 推模型和拉模型

- 推模型 <br>
  推模型由主题主动推送更新数据到观察者，不论观察者是否需要，主题都会强制推送。传递数据可以是全部或者部分。
- 拉模型 <br>
   观察者主动获取主题数据，主题将自身作为参数，添加到update()方法中。

主题继承`java.util.Observable`，观察者实现`java.util.Observer`

代码实现：
```java
//---------观察者----------------------------------------------------------------
class JavaObserver implements Observer {
	JavaSubject Subject;
	
	@Override
	public void update(Observable o, Object arg) {
		System.out.println(arg);
	}
}
//---------主题----------------------------------------------------------------
class JavaSubject extends Observable{
	//主题若有私有成员
	//推模型：主动推送数据
	//拉模型，根据传递的主题本身，观察者可以获得其私有成员
	public static void main(String[] args) {
		JavaSubject subject = new JavaSubject();//主题
		JavaObserver observer = new JavaObserver();//观察者
		//观察者订阅主题
		subject.addObserver(observer);
		
		//推模型
		//主题设置更新状态，若状态不更新，则不会通知观察者
		subject.setChanged();
		//通知所有观察者，不带参数
		subject.notifyObservers();
		//尝试带参数通知
		subject.setChanged();
		subject.notifyObservers("带参数通知，可以减少传递数据");
		
		//当然，对于拉模型，观察者可以主动拉取数据
		observer.update(observer.Subject, null);
	}
}
```

基本的使用方式上述main方法中都有涉及。下面讲接下`java.util`包的内部实现以及注意事项

<img src="@/assets/blog/img/designpattern/ObserverMode2.png"/>

主题实现类中，用于存放观察者的容器是 Vector 。Vector是线程安全的，内部通过数组实现，所以是有序的，但是由于线程安全，开销较大，因此在观察者较多情况下，效率变低。

基本的 新增观察者，删除观察者，观察者数量等方法就不过多赘述。

着重看下通知方法，

```java
        public void notifyObservers() {
            notifyObservers(null);
        }
        //带参数的通知方法，将任意参数，传入观察者更新方法
        public void notifyObservers(Object arg) {
	        Object[] arrLocal;
	        synchronized (this) {
	            //判断主题是否存在数据更新，因此在通知观察者之前，需要先更换标志位
	            if (!changed)
	                return;
	            //Vector内部由数组实现
	            arrLocal = obs.toArray();
	            clearChanged();
	        }
	        //遍历通知
	        for (int i = arrLocal.length-1; i>=0; i--)
	            ((Observer)arrLocal[i]).update(this, arg);
	    }
```

