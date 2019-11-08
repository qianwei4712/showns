## synchronized 介绍
“非线程安全”问题存在于“实例变量”中，如果是方法内的私有变量，则不存在线程安全问题。

用变量的作用域解释：
>方法内变量在方法内声明，方法结束后就进行释放。<br>
实例变量的回收是在该实例对象不再被引用。若实例对象还在被线程使用，则不会进行释放

`synchronized`的使用并不复杂，实际上就是
>拿到对应锁的线程可以执行该锁的部分代码。

```java
class AgeTest{
	
	synchronized public void t1() {
		System.out.println("锁添加在常规方法上");
	}
	
	synchronized public static void t2() {
		System.out.println("锁添加在第一个静态方法上");
	}
	
	synchronized public static void t3() {
		System.out.println("锁添加在第二个静态方法上");
	}
	
	public void t4(String string) {
		synchronized (string) {
			System.out.println("锁添加在第一段代码块上");
		}
	}
	
	public void t5() {
		synchronized (this) {
			System.out.println("锁添加在第二段代码块上");
		}
	}
	
	synchronized public void t6() {
		int i = 1/0;
		System.out.println("出现异常，锁自动释放");
	}

}
```

上面有六个加锁的方法，**最后一个就是用来提一下出现异常会自动释放锁**,不参与下面讨论。

下面开始讲一下实际上是如何进行调度的。

**首先，每个`synchronized`都有一个锁对象，就像是一个锁头，钥匙只有一把，拿到钥匙的这个线程就可以打开这个锁。**

上述方法4中，代码块`synchronized(srting)`，这个`string`就是一个锁头。

上述方法中,
> t1,t5中的代码块，其实用的是同一把锁，锁的是**当前对象**，也就是这两部分代码同一时刻，只能有一部分在执行。<br>

> t2,t3的锁加在`static`方法上，锁的是**整个Class**，对所有的`AgeTest.Class`的实例，都是同一把锁<br>

> t4的锁取决于参数，传入不同参数则对应不同的锁

因此，`synchronized`通过锁的对象区分不同的锁，持有不同的锁可以才可以解锁。

## synchronized 值得注意的地方

### synchronized如何判断是否是同一个锁

**`synchronized`锁对象，若为同一对象则为同一把锁，而判断同一对象是通过 == 来判断的，就是指向同一地址的才是同一把锁。**

下面的例子是用来证明的

```java
class ServiceMethod {

	public void print(String string) {
		try {
			synchronized (string) {
				for (int i = 0; i < 3; i++) {
					System.out.println("当前线程：" + Thread.currentThread().getName() + ",循环值i=" + i);
					Thread.sleep(1000);
				}
			}
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
}
```

```java
class TestClass {
	
	public static void main(String[] args) {
		
		ServiceMethod service1 = new ServiceMethod();
		String threadA = "thread";
		String threadB = "thread";
//		String threadA = new String("thread");
//		String threadB = new String("thread");
		
		System.out.println(threadA == threadB);
		System.out.println(threadA.equals(threadB));
		
		Thread thread1 = new Thread(new Runnable() {
			@Override
			public void run() {
				service1.print(threadA);
			}
		},"threadA");
		thread1.start();
		
		Thread thread2 = new Thread(new Runnable() {
			@Override
			public void run() {
				service1.print(threadB);
			}
		},"threadB");
		thread2.start();
		
	}

}
```
因为JVM的关系，构造`thread`字符串之前会先去寻找是否已经创建该字符串，所以这样创建的两个字符串指向同一个地址。可见代码块是同步的，他们的锁是同一个。
```java
true
true
当前线程：threadA,循环值i=0
当前线程：threadA,循环值i=1
当前线程：threadA,循环值i=2
当前线程：threadB,循环值i=0
当前线程：threadB,循环值i=1
当前线程：threadB,循环值i=2
```
将字符串的构造切换，输出异步，两把锁不同。
```java
false
true
当前线程：threadA,循环值i=0
当前线程：threadB,循环值i=0
当前线程：threadA,循环值i=1
当前线程：threadB,循环值i=1
当前线程：threadB,循环值i=2
当前线程：threadA,循环值i=2
```

### 锁对象变化

下面的例子，用来解释何时进行锁判断。
```java
class ServiceMethod {

	private String lock = "123";
	public void print() {
		try {
			synchronized (lock) {
				System.out.println("当前线程：" + Thread.currentThread().getName() + ",当前时间：" + System.currentTimeMillis());
				lock = "456";
				Thread.sleep(2000);
				System.out.println("当前线程：" + Thread.currentThread().getName() + ",当前时间：" + System.currentTimeMillis());
			}
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
}
```

```java

class TestClass {
	
	public static void main(String[] args) throws InterruptedException {
		
		ServiceMethod service1 = new ServiceMethod();
		
		Thread thread1 = new Thread(new Runnable() {
			@Override
			public void run() {
				service1.print();
			}
		},"threadA");
		Thread thread2 = new Thread(new Runnable() {
			@Override
			public void run() {
				service1.print();
			}
		},"threadB");
		
		thread1.start();
		thread2.start();
		
	}

}

```
输出结果是同步的。
```java
当前线程：threadA,当前时间：1532265295221
当前线程：threadA,当前时间：1532265297223
当前线程：threadB,当前时间：1532265297223
当前线程：threadB,当前时间：1532265299223
```

因此，在检测到锁的时候，当时锁对象做为唯一标准，无论后面对象是否进行变化。
