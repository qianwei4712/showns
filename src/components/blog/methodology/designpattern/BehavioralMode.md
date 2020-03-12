<div class="catalog">

- [模板方法模式](#t1)
- [策略模式](#t2)
- [命令模式](#t3)
- [职责链模式](#t4)
- [状态模式](#t5)
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


### <span id="t4">职责链模式</span>

> 责任链（Chain of Responsibility）模式的定义：为了避免请求发送者与多个请求处理者耦合在一起，将所有请求的处理者通过前一对象记住其下一个对象的引用而连成一条链；
当有请求发生时，可将请求沿着这条链传递，直到有对象处理它为止。

在责任链模式中，客户只需要将请求发送到责任链上即可，无须关心请求的处理细节和请求的传递过程，所以责任链将请求的发送者和请求的处理者解耦了。

责任链模式是一种对象行为型模式，其主要优点如下。
1. 降低了对象之间的耦合度。该模式使得一个对象无须知道到底是哪一个对象处理其请求以及链的结构，发送者和接收者也无须拥有对方的明确信息。
2. 增强了系统的可扩展性。可以根据需要增加新的请求处理类，满足开闭原则。
3. 增强了给对象指派职责的灵活性。当工作流程发生变化，可以动态地改变链内的成员或者调动它们的次序，也可动态地新增或者删除责任。
4. 责任链简化了对象之间的连接。每个对象只需保持一个指向其后继者的引用，不需保持其他所有处理者的引用，这避免了使用众多的 if 或者 if···else 语句。
5. 责任分担。每个类只需要处理自己该处理的工作，不该处理的传递给下一个对象完成，明确各类的责任范围，符合类的单一职责原则。

其主要缺点如下。
1. 不能保证每个请求一定被处理。由于一个请求没有明确的接收者，所以不能保证它一定会被处理，该请求可能一直传到链的末端都得不到处理。
2. 对比较长的职责链，请求的处理可能涉及多个处理对象，系统性能将受到一定影响。
3. 职责链建立的合理性要靠客户端来保证，增加了客户端的复杂性，可能会由于职责链的错误设置而导致系统出错，如可能会造成循环调用。

职责链模式主要包含以下角色。
- 抽象处理者（Handler）角色：定义一个处理请求的接口，包含抽象处理方法和一个后继连接。
- 具体处理者（Concrete Handler）角色：实现抽象处理者的处理方法，判断能否处理本次请求，如果可以处理请求则处理，否则将该请求转给它的后继者。
- 客户类（Client）角色：创建处理链，并向链头的具体处理者对象提交请求，它不关心处理细节和请求的传递过程。


<img src="@/assets/blog/img/designpattern/BehavioralMode2.png"/>

抽象处理者（Handler）角色：
```java
abstract class Handler {
    private Handler next;
    public void setNext(Handler next) {
        this.next=next;
    }
    public Handler getNext() {
        return next;
    }
    //处理请求的方法
    public abstract void handleRequest(String request);
}
```

具体处理者（Concrete Handler）角色：
```java
class ConcreteHandler1 extends Handler {
    @Override
    public void handleRequest(String request) {
        if(request.equals("one")) {
            System.out.println("具体处理者1负责处理该请求！");
        }else {
            if(getNext()!=null) {
                getNext().handleRequest(request);
            }else {
                System.out.println("没有人处理该请求！");
            }
        }
    }
}

public class ConcreteHandler2 extends Handler {
    @Override
    public void handleRequest(String request) {
        if(request.equals("two")) {
            System.out.println("具体处理者2负责处理该请求！");
        }else {
            if(getNext()!=null) {
                getNext().handleRequest(request);
            }else {
                System.out.println("没有人处理该请求！");
            }
        }
    }
}
```

客户类（Client）角色：
```java
public static void main(String[] args) {
        //组装责任链
        Handler handler1 = new ConcreteHandler1();
        Handler handler2 = new ConcreteHandler2();
        handler1.setNext(handler2);
        //提交请求
        handler1.handleRequest("two");
    }
```

<br>

### <span id="t5">状态模式</span>

> 状态（State）模式的定义：对有状态的对象，把复杂的“判断逻辑”提取到不同的状态对象中，允许状态对象在其内部状态发生改变时改变其行为。

状态模式是一种对象行为型模式，其主要优点如下。
1. 状态模式将与特定状态相关的行为局部化到一个状态中，并且将不同状态的行为分割开来，满足“单一职责原则”。
2. 减少对象间的相互依赖。将不同的状态引入独立的对象中会使得状态转换变得更加明确，且减少对象间的相互依赖。
3. 有利于程序的扩展。通过定义新的子类很容易地增加新的状态和转换。

状态模式的主要缺点如下。
1. 状态模式的使用必然会增加系统的类与对象的个数。
2. 状态模式的结构与实现都较为复杂，如果使用不当会导致程序结构和代码的混乱。

**状态模式把受环境改变的对象行为包装在不同的状态对象里，其意图是让一个对象在其内部状态改变的时候，其行为也随之改变。现在我们来分析其基本结构和实现方法。**

状态模式包含以下主要角色。
1. 环境（Context）角色：也称为上下文，它定义了客户感兴趣的接口，维护一个当前状态，并将与状态相关的操作委托给当前状态对象来处理。
2. 抽象状态（State）角色：定义一个接口，用以封装环境对象中的特定状态所对应的行为。
3. 具体状态（Concrete State）角色：实现抽象状态所对应的行为。

<img src="@/assets/blog/img/designpattern/BehavioralMode3.png"/>

环境（Context）角色：
```java
class Context {
    private State state;
    //定义环境类的初始状态
    public Context() {
        this.state=new ConcreteStateA();
    }
    //设置新状态
    public void setState(State state) {
        this.state=state;
    }
    //读取状态
    public State getState() {
        return(state);
    }
    //对请求做处理
    public void Handle() {
        state.Handle(this);
    }
}
```

抽象状态（State）角色：
```java
abstract class State {
    public abstract void Handle(Context context);
}
```

具体状态（Concrete State）角色：
```java
public class ConcreteStateA extends State{
    @Override
    public void Handle(Context context) {
        System.out.println("当前状态是 A.");
        context.setState(new ConcreteStateB());
    }
}

class ConcreteStateB extends State {
    @Override
    public void Handle(Context context) {
        System.out.println("当前状态是 B.");
        context.setState(new ConcreteStateA());
    }
}
```

客户端调用：
```java
    public static void main(String[] args) {
        Context context = new Context();    //创建环境
        context.Handle();    //处理请求
        context.Handle();
        context.Handle();
        context.Handle();
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

