## 策略模式

> 节选自《Head First 设计模式》+自力更生

观察者模式定义了对象之间的一对多依赖，当一个对象状态改变时，它的依赖者都会收到通知并自动更新。

**个人理解：在主题内定义一个观察者容器，在数据更新时，遍历容器内成员，并调用观察者接口的方法**

缺点：若需要通知的观察者较多，通知方法执行时间太长

将观察者模式分成数据提供方“主题”，数据获取方“观察者”。

实际关系类比 报社自动送订阅app推送。Java.util已经内置了这个设计模式，在文章后半段将会讲解。

### 基本原理

- ![Image text](http://oss.huqianwei.com/data/ObserverMode1.png)

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

### java.util观察者模式



java.util 实现的观察者模式更加安全，并实现了基本功能，并进行了拓展。

#### 推模型和拉模型

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

- ![Image text](http://oss.huqianwei.com/data/ObserverMode2.png)

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
