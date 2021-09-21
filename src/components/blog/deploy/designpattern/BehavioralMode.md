<div class="catalog">

- [模板方法模式](#t1)
- [策略模式](#t2)
- [命令模式](#t3)
- [职责链模式](#t4)
- [状态模式](#t5)
- [观察者模式](#t6)
- [中介者模式](#t7)
- [迭代器模式](#t8)
- [访问者模式](#t9)
- [备忘录模式](#t10)
- [解释器模式](#t11)

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

![StrategyMode1](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/StrategyMode1.png)


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


![BehavioralMode1](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/BehavioralMode1.jpg)

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


![BehavioralMode2](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/BehavioralMode2.png)

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

![BehavioralMode3](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/BehavioralMode3.png)

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

![ObserverMode1](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/ObserverMode1.png)

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

![ObserverMode2](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/ObserverMode2.png)

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


<br>

### <span id="t7">中介者模式</span>

> 中介者（Mediator）模式的定义：定义一个中介对象来封装一系列对象之间的交互，使原有对象之间的耦合松散，且可以独立地改变它们之间的交互。中介者模式又叫调停模式，它是迪米特法则的典型应用。

中介者模式是一种对象行为型模式，其主要优点如下。
1. 降低了对象之间的耦合性，使得对象易于独立地被复用。
2. 将对象间的一对多关联转变为一对一的关联，提高系统的灵活性，使得系统易于维护和扩展。

其主要缺点是：当同事类太多时，中介者的职责将很大，它会变得复杂而庞大，以至于系统难以维护。

中介者模式包含以下主要角色。
- 抽象中介者（Mediator）角色：它是中介者的接口，提供了同事对象注册与转发同事对象信息的抽象方法。
- 具体中介者（ConcreteMediator）角色：实现中介者接口，定义一个 List 来管理同事对象，协调各个同事角色之间的交互关系，因此它依赖于同事角色。
- 抽象同事类（Colleague）角色：定义同事类的接口，保存中介者对象，提供同事对象交互的抽象方法，实现所有相互影响的同事类的公共功能。
- 具体同事类（Concrete Colleague）角色：是抽象同事类的实现者，当需要与其他同事对象交互时，由中介者对象负责后续的交互。


![BehavioralMode4](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/BehavioralMode4.gif)


抽象中介者（Mediator）角色：
```java
abstract class Mediator{
    public abstract void register(Colleague colleague);
    public abstract void relay(Colleague cl); //转发
}
```

具体中介者（ConcreteMediator）角色：
```java
class ConcreteMediator extends Mediator {
    private List<Colleague> colleagues = new ArrayList<Colleague>();
    public void register(Colleague colleague) {
        if(!colleagues.contains(colleague)) {
            colleagues.add(colleague);
            colleague.setMedium(this);
        }
    }
    public void relay(Colleague cl) {
        for(Colleague ob:colleagues) {
            if(!ob.equals(cl)) {
                ((Colleague)ob).receive();
            }   
        }
    }
}
```

抽象同事类（Colleague）角色：
```java
abstract class Colleague {
    protected Mediator mediator;
    public void setMedium(Mediator mediator) {
        this.mediator=mediator;
    }   
    public abstract void receive();   
    public abstract void send();
}
```

具体同事类（Concrete Colleague）角色：
```java
class ConcreteColleague1 extends Colleague {
    public void receive() {
        System.out.println("具体同事类1收到请求。");
    }   
    public void send() {
        System.out.println("具体同事类1发出请求。");
        mediator.relay(this); //请中介者转发
    }
}

class ConcreteColleague2 extends Colleague {
    public void receive() {
        System.out.println("具体同事类2收到请求。");
    }   
    public void send() {
        System.out.println("具体同事类2发出请求。");
        mediator.relay(this); //请中介者转发
    }
}
```

客户端调用：
```java
public static void main(String[] args) {
        Mediator md=new ConcreteMediator();
        Colleague c1,c2;
        c1=new ConcreteColleague1();
        c2=new ConcreteColleague2();
        md.register(c1);
        md.register(c2);
        c1.send();
        System.out.println("-------------");
        c2.send();
    }
```


<br>

### <span id="t8">迭代器模式</span>

>迭代器（Iterator）模式的定义：提供一个对象来顺序访问聚合对象中的一系列数据，而不暴露聚合对象的内部表示。

迭代器模式是一种对象行为型模式，其主要优点如下。
1. 访问一个聚合对象的内容而无须暴露它的内部表示。
2. 遍历任务交由迭代器完成，这简化了聚合类。
3. 它支持以不同方式遍历一个聚合，甚至可以自定义迭代器的子类以支持新的遍历。
4. 增加新的聚合类和迭代器类都很方便，无须修改原有代码。
5. 封装性良好，为遍历不同的聚合结构提供一个统一的接口。

其主要缺点是：增加了类的个数，这在一定程度上增加了系统的复杂性。


**迭代器模式是通过将聚合对象的遍历行为分离出来，抽象成迭代器类来实现的，其目的是在不暴露聚合对象的内部结构的情况下，让外部代码透明地访问聚合的内部数据。现在我们来分析其基本结构与实现方法。**

迭代器模式主要包含以下角色。
- 抽象聚合（Aggregate）角色：定义存储、添加、删除聚合对象以及创建迭代器对象的接口。
- 具体聚合（ConcreteAggregate）角色：实现抽象聚合类，返回一个具体迭代器的实例。
- 抽象迭代器（Iterator）角色：定义访问和遍历聚合元素的接口，通常包含 hasNext()、first()、next() 等方法。
- 具体迭代器（Concretelterator）角色：实现抽象迭代器接口中所定义的方法，完成对聚合对象的遍历，记录遍历的当前位置。

![BehavioralMode5](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/BehavioralMode5.gif)

抽象聚合（Aggregate）角色：
```java
interface Aggregate { 
    public void add(Object obj); 
    public void remove(Object obj); 
    public Iterator getIterator(); 
}
```


具体聚合（ConcreteAggregate）角色：
```java
class ConcreteAggregate implements Aggregate { 
    private List<Object> list=new ArrayList<Object>(); 
    public void add(Object obj) { 
        list.add(obj); 
    }
    public void remove(Object obj) { 
        list.remove(obj); 
    }
    public Iterator getIterator() { 
        return(new ConcreteIterator(list)); 
    }     
}
```


抽象迭代器（Iterator）角色：
```java
interface Iterator {
    Object first();
    Object next();
    boolean hasNext();
}
```

具体迭代器（Concretelterator）角色：
```java
class ConcreteIterator implements Iterator { 
    private List<Object> list=null; 
    private int index=-1; 
    public ConcreteIterator(List<Object> list) { 
        this.list=list; 
    } 
    public boolean hasNext() { 
        if(index<list.size()-1) { 
            return true;
        }else {
            return false;
        }
    }
    public Object first() {
        index=0;
        Object obj=list.get(index);;
        return obj;
    }
    public Object next() { 
        Object obj=null; 
        if(this.hasNext()) { 
            obj=list.get(++index); 
        } 
        return obj; 
    }   
}
```

客户端调用：
```java
public static void main(String[] args) {
        Aggregate ag = new ConcreteAggregate(); 
        ag.add("中山大学"); 
        ag.add("华南理工"); 
        ag.add("韶关学院");
        System.out.print("聚合的内容有：");
        Iterator it=ag.getIterator(); 
        while(it.hasNext()) { 
            Object ob=it.next(); 
            System.out.print(ob.toString()+"\t"); 
        }
        Object ob=it.first();
        System.out.println("\nFirst："+ob.toString());
    }
```


<br>


### <span id="t9">访问者模式</span>

>访问者（Visitor）模式的定义：将作用于某种数据结构中的各元素的操作分离出来封装成独立的类，使其在不改变数据结构的前提下可以添加作用于这些元素的新的操作，为数据结构中的每个元素提供多种访问方式。
它将对数据的操作与数据结构进行分离，是行为类模式中最复杂的一种模式。

访问者（Visitor）模式是一种对象行为型模式，其主要优点如下。
1. 扩展性好。能够在不修改对象结构中的元素的情况下，为对象结构中的元素添加新的功能。
2. 复用性好。可以通过访问者来定义整个对象结构通用的功能，从而提高系统的复用程度。
3. 灵活性好。访问者模式将数据结构与作用于结构上的操作解耦，使得操作集合可相对自由地演化而不影响系统的数据结构。
4. 符合单一职责原则。访问者模式把相关的行为封装在一起，构成一个访问者，使每一个访问者的功能都比较单一。

访问者（Visitor）模式的主要缺点如下。
1. 增加新的元素类很困难。在访问者模式中，每增加一个新的元素类，都要在每一个具体访问者类中增加相应的具体操作，这违背了“开闭原则”。
2. 破坏封装。访问者模式中具体元素对访问者公布细节，这破坏了对象的封装性。
3. 违反了依赖倒置原则。访问者模式依赖了具体类，而没有依赖抽象类。

访问者模式包含以下主要角色。
- 抽象访问者（Visitor）角色：定义一个访问具体元素的接口，为每个具体元素类对应一个访问操作 visit() ，该操作中的参数类型标识了被访问的具体元素。
- 具体访问者（ConcreteVisitor）角色：实现抽象访问者角色中声明的各个访问操作，确定访问者访问一个元素时该做什么。
- 抽象元素（Element）角色：声明一个包含接受操作 accept() 的接口，被接受的访问者对象作为 accept() 方法的参数。
- 具体元素（ConcreteElement）角色：实现抽象元素角色提供的 accept() 操作，其方法体通常都是 visitor.visit(this) ，另外具体元素中可能还包含本身业务逻辑的相关操作。
- 对象结构（Object Structure）角色：是一个包含元素角色的容器，提供让访问者对象遍历容器中的所有元素的方法，通常由 List、Set、Map 等聚合类实现。


![BehavioralMode6](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/BehavioralMode6.gif)

抽象访问者（Visitor）角色：
```java
interface Visitor {
    void visit(ConcreteElementA element);
    void visit(ConcreteElementB element);
}
```

具体访问者（ConcreteVisitor）角色：
```java
class ConcreteVisitorA implements Visitor {
    public void visit(ConcreteElementA element) {
        System.out.println("具体访问者A访问-->"+element.operationA());
    }
    public void visit(ConcreteElementB element) {
        System.out.println("具体访问者A访问-->"+element.operationB());
    }
}

class ConcreteVisitorB implements Visitor {
    public void visit(ConcreteElementA element) {
        System.out.println("具体访问者B访问-->"+element.operationA());
    }
    public void visit(ConcreteElementB element) {
        System.out.println("具体访问者B访问-->"+element.operationB());
    }
}
```

抽象元素（Element）角色：
```java
interface Element {
    void accept(Visitor visitor);
}
```

具体元素（ConcreteElement）角色：
```java
class ConcreteElementA implements Element {
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
    public String operationA() {
        return "具体元素A的操作。";
    }
}

class ConcreteElementB implements Element {
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
    public String operationB() {
        return "具体元素B的操作。";
    }
}
```

对象结构（Object Structure）角色：
```java
class ObjectStructure {   
    private List<Element> list=new ArrayList<Element>();   
    public void accept(Visitor visitor) {
        Iterator<Element> i=list.iterator();
        while(i.hasNext()) {
            ((Element) i.next()).accept(visitor);
        }      
    }
    public void add(Element element) {
        list.add(element);
    }
    public void remove(Element element) {
        list.remove(element);
    }
}
```

客户端调用：
```java
 public static void main(String[] args) {
        ObjectStructure os=new ObjectStructure();
        os.add(new ConcreteElementA());
        os.add(new ConcreteElementB());
        Visitor visitor=new ConcreteVisitorA();
        os.accept(visitor);
        System.out.println("------------------------");
        visitor=new ConcreteVisitorB();
        os.accept(visitor);
    }
```

<br>


### <span id="t10">备忘录模式</span>

>备忘录（Memento）模式的定义：在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，以便以后当需要时能将该对象恢复到原先保存的状态。该模式又叫快照模式。

备忘录模式是一种对象行为型模式，其主要优点如下。
1. 提供了一种可以恢复状态的机制。当用户需要时能够比较方便地将数据恢复到某个历史的状态。
2. 实现了内部状态的封装。除了创建它的发起人之外，其他对象都不能够访问这些状态信息。
3. 简化了发起人类。发起人不需要管理和保存其内部状态的各个备份，所有状态信息都保存在备忘录中，并由管理者进行管理，这符合单一职责原则。

其主要缺点是：资源消耗大。如果要保存的内部状态信息过多或者特别频繁，将会占用比较大的内存资源。

备忘录模式的主要角色如下。
- 发起人（Originator）角色：记录当前时刻的内部状态信息，提供创建备忘录和恢复备忘录数据的功能，实现其他业务功能，它可以访问备忘录里的所有信息。
- 备忘录（Memento）角色：负责存储发起人的内部状态，在需要的时候提供这些内部状态给发起人。
- 管理者（Caretaker）角色：对备忘录进行管理，提供保存与获取备忘录的功能，但其不能对备忘录的内容进行访问与修改。

![BehavioralMode7](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/BehavioralMode7.gif)

发起人（Originator）角色：
```java
class Originator { 
    private String state;     
    public void setState(String state) { 
        this.state=state; 
    }
    public String getState() { 
        return state; 
    }
    public Memento createMemento() { 
        return new Memento(state); 
    } 
    public void restoreMemento(Memento m) { 
        this.setState(m.getState()); 
    } 
}
```

备忘录（Memento）角色：
```java
class Memento { 
    private String state; 
    public Memento(String state) { 
        this.state=state; 
    }     
    public void setState(String state) { 
        this.state=state; 
    }
    public String getState() { 
        return state; 
    }
}
```


管理者（Caretaker）角色：
```java
class Caretaker { 
    private Memento memento;       
    public void setMemento(Memento m) { 
        memento=m; 
    }
    public Memento getMemento() { 
        return memento; 
    }
}
```


客户端调用：
```java
public static void main(String[] args) {
        Originator or=new Originator();
        Caretaker cr=new Caretaker();       
        or.setState("S0"); 
        System.out.println("初始状态:"+or.getState());           
        cr.setMemento(or.createMemento()); //保存状态      
        or.setState("S1"); 
        System.out.println("新的状态:"+or.getState());        
        or.restoreMemento(cr.getMemento()); //恢复状态
        System.out.println("恢复状态:"+or.getState());
    }
```


<br>


### <span id="t11">解释器模式</span>

>解释器（Interpreter）模式的定义：给分析对象定义一个语言，并定义该语言的文法表示，再设计一个解析器来解释语言中的句子。
也就是说，用编译语言的方式来分析应用中的实例。这种模式实现了文法表达式处理的接口，该接口解释一个特定的上下文。


这里提到的文法和句子的概念同编译原理中的描述相同，“文法”指语言的语法规则，而“句子”是语言集中的元素。例如，汉语中的句子有很多，“我是中国人”是其中的一个句子，可以用一棵语法树来直观地描述语言中的句子。

解释器模式是一种类行为型模式，其主要优点如下。
1. 扩展性好。由于在解释器模式中使用类来表示语言的文法规则，因此可以通过继承等机制来改变或扩展文法。
2. 容易实现。在语法树中的每个表达式节点类都是相似的，所以实现其文法较为容易。

解释器模式的主要缺点如下。
1. 执行效率较低。解释器模式中通常使用大量的循环和递归调用，当要解释的句子较复杂时，其运行速度很慢，且代码的调试过程也比较麻烦。
2. 会引起类膨胀。解释器模式中的每条规则至少需要定义一个类，当包含的文法规则很多时，类的个数将急剧增加，导致系统难以管理与维护。
3. 可应用的场景比较少。在软件开发中，需要定义语言文法的应用实例非常少，所以这种模式很少被使用到。


解释器模式包含以下主要角色。
- 抽象表达式（Abstract Expression）角色：定义解释器的接口，约定解释器的解释操作，主要包含解释方法 interpret()。
- 终结符表达式（Terminal    Expression）角色：是抽象表达式的子类，用来实现文法中与终结符相关的操作，文法中的每一个终结符都有一个具体终结表达式与之相对应。
- 非终结符表达式（Nonterminal Expression）角色：也是抽象表达式的子类，用来实现文法中与非终结符相关的操作，文法中的每条规则都对应于一个非终结符表达式。
- 环境（Context）角色：通常包含各个解释器需要的数据或是公共的功能，一般用来传递被所有解释器共享的数据，后面的解释器可以从这里获取这些值。
- 客户端（Client）：主要任务是将需要分析的句子或表达式转换成使用解释器对象描述的抽象语法树，然后调用解释器的解释方法，当然也可以通过环境角色间接访问解释器的解释方法。


![BehavioralMode8](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/BehavioralMode8.gif)


抽象表达式（Abstract Expression）角色：
```java
interface AbstractExpression {
    public Object interpret(String info);    //解释方法
}
```

终结符表达式（Terminal    Expression）角色：
```java
class TerminalExpression implements AbstractExpression {
    public Object interpret(String info) {
        //对终结符表达式的处理
    }
}
```

非终结符表达式（Nonterminal Expression）角色：
```java
class NonterminalExpression implements AbstractExpression {
    private AbstractExpression exp1;
    private AbstractExpression exp2;
    public Object interpret(String info) {
        //非对终结符表达式的处理
    }
}
```

环境（Context）角色：
```java
class Context {
    private AbstractExpression exp;
    public Context() {
        //数据初始化
    }
    public void operation(String info) {
        //调用相关表达式类的解释方法
    }
}
```

