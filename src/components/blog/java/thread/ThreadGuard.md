
## 线程优先级概述

`Thread`内有一个属性`priority`,类型为`int`，这个属性表示线程的优先级

线程优先级为1-10，数字越大优先级越高，线程的默认优先级为5.

线程内包含三个 ` static final` 变量，分别为1，5，10
```java
    public final static int MIN_PRIORITY = 1;
    public final static int NORM_PRIORITY = 5;
    public final static int MAX_PRIORITY = 10;
```

可以通过调用线程的`setPriority()`方法设置线程的优先级，方法内为
```java
    public final void setPriority(int newPriority) {
        ThreadGroup g;
        //判定当前运行的线程是否有权修改该线程
        checkAccess();
        if (newPriority > MAX_PRIORITY || newPriority < MIN_PRIORITY) {
            throw new IllegalArgumentException();
        }
        //获取该线程所属的线程组
        if((g = getThreadGroup()) != null) {
            // 判断是否高于此线程组的最高优先级
            if (newPriority > g.getMaxPriority()) {
                newPriority = g.getMaxPriority();
            }
            setPriority0(priority = newPriority);
        }
    }
```

这里引入了线程组的概念，
>线程组表示一个线程的集合。此外，线程组也可以包含其他线程组。线程组构成一棵树，在树中，除了初始线程组外，每个线程组都有一个父线程组。

>允许线程访问有关自己的线程组的信息，但是不允许它访问有关其线程组的父线程组或其他任何线程组的信息。

## 线程优先级的特性

### 继承性

线程具有继承性，比如A线程启动B线程，则B线程的优先级与A线程一样。

线程的 `init` 初始化方法，内有这么一句
```java
private void init(ThreadGroup g, Runnable target, String name,
                      long stackSize, AccessControlContext acc,
                      boolean inheritThreadLocals) {
         ...
        Thread parent = currentThread();
        ...
        this.priority = parent.getPriority();
        ...
    }
```
省略的其他多余代码，初始化线程，将启动线程的优先级传递到该线程。

### 规则性，随机性
这两个特性理解比较容易。也就不提供代码说明了

简单来说，线程的优先级，无法绝对保证优先级高的线程优先执行，

而是保证了，优先级高的线程获取CPU的资源概率比较高。

也体现了在规则下的随机性。


## 线程守护
>线程分为守护线程和用户线程。

>守护线程：具有"陪伴"特性，若进程中没有用户线程，则守护线程自动销毁。

```java
class DaemonThread extends Thread{

	@Override
	public void run() {
		super.run();
		try {
			for (int i = 0; i < 100000; i++) {
				Thread.sleep(1000);
				System.out.println(" i = " + i);
			}
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	public static void main(String[] args) {
		try {
			DaemonThread thread = new DaemonThread();
			thread.setDaemon(true);//将新线程设置为守护线程
			thread.start();
			Thread.sleep(5000);//等待五秒
			System.out.println("用户线程到这里结束，守护线程也就不继续输出了。。。。");//mian线程执行结束
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
}
```

输出结果为,并没有继续执行for循环
```java
 i = 0
 i = 1
 i = 2
 i = 3
用户线程到这里结束，守护线程也就不继续输出了。。。。
 i = 4
```



 