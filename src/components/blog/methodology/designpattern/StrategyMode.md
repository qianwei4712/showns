### 策略模式

> 节选自《Head First 设计模式》+自力更生



策略模式定义了算法族，分别封装起来，让它们之间可以相互替换，此设计模式让算法的变化独立于使用算法的客户。    ------《Head First 设计模式》 P.24



个人理解：对于某一个算法或者业务，预先实现不同的方案，通过接口，调用不同实例，来获得不同的结果。



缺点也非常明显，所有的算法都是唯一确定的，都是事先已经实现的，策略模式只是在选择。



<img src="@/assets/blog/img/StrategyMode1.png"/>



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

