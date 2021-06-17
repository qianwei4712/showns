<div class="catalog">

- [概述](#t0)
- [LockSupport 属性](#t1)
- [核心方法](#t2)
- [park 相关方法](#t21)
  - [unpark 方法](#t22)
- [LockSupport示例说明](#t3)
  - [使用wait/notify实现线程同步](#t31)
  - [使用park/unpark实现线程同步](#t32)
  - [中断响应](#t33)
- [参考文章](#te)

</div>



## <span id="t0">概述</span>

LockSupport 是 JUC 包中的一个工具类，是用来创建锁和其他同步类的基本线程阻塞原语。

因为 LockSupport 是锁中的基础。比如 AQS 中就需要用到，所以先了解一哈。 

先把源码放上：<a href="https://gitee.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/concurrent/locks/LockSupport.java" target="_blank">JDK8 LockSupport 源码带注释</a>

好了，现在开始。。。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/QQ图片20210610222905.jpg)

LockSupport 类的核心方法其实就两个： `park()` 和 `unpark()` 

-  `LockSupport.park()` 方法用来阻塞当前调用线程
-  `LockSupport.unpark()` 方法用于唤醒指定线程。

LockSupport 没有开放构造方法，所以只能通过 **静态方法** 来使用。 

```java
 private LockSupport() {} // 私有构造函数，无法实例化。
```



<br/>

## <span id="t1">LockSupport 属性</span>



```java
    // Hotspot implementation via intrinsics API
    private static final sun.misc.Unsafe UNSAFE;
    private static final long parkBlockerOffset;
    private static final long SEED;
    private static final long PROBE;
    private static final long SECONDARY;
    static {
        try {
            // 获取Unsafe实例
            UNSAFE = sun.misc.Unsafe.getUnsafe();
            // 线程类类型
            Class<?> tk = Thread.class;
            // 获取 Thread 的 parkBlocker 字段的内存偏移地址
            parkBlockerOffset = UNSAFE.objectFieldOffset(tk.getDeclaredField("parkBlocker"));
            // 获取 Thread 的 threadLocalRandomSeed 字段的内存偏移地址
            SEED = UNSAFE.objectFieldOffset(tk.getDeclaredField("threadLocalRandomSeed"));
            // 获取 Thread 的 threadLocalRandomProbe 字段的内存偏移地址
            PROBE = UNSAFE.objectFieldOffset(tk.getDeclaredField("threadLocalRandomProbe"));
            // 获取 Thread 的 threadLocalRandomSecondarySeed 字段的内存偏移地址
            SECONDARY = UNSAFE.objectFieldOffset(tk.getDeclaredField("threadLocalRandomSecondarySeed"));
        } catch (Exception ex) { throw new Error(ex); }
    }
```

`UNSAFE` 字段介绍可以翻一翻：<a href="https://blog.csdn.net/m0_46144826/article/details/117636668" target="_blank">CAS、Unsafe、Atomic原子类，一波带走</a> 

这些字段和属性的作用可以总结为：**为 LockSupport 提供 CAS 机制。**



<br/>

## <span id="t2">核心方法</span>

因为 `LockSupport` 底层使用 `UnSafe` 类实现，而核心函数就是下面两个：

```java
public native void park(boolean isAbsolute, long time);
public native void unpark(Thread thread);
```

> - park函数：阻塞线程，并且该线程在下列情况发生之前都会被阻塞: 
>   - ① 调用unpark函数，释放该线程的许可。
>   - ② 该线程被中断。
>   - ③ 设置的时间到了。并且，当time为绝对时间时，isAbsolute 为 true，否则，isAbsolute 为 false。当time为0时，表示无限等待，直到unpark发生。
> - unpark函数：释放线程的许可，即激活调用park后阻塞的线程。这个函数不是安全的，调用这个函数时要确保线程依旧存活。



<br/>

### <span id="t21">park 相关方法</span>

首先是基础 park 方法，提供了永久等待、定时等待、确定截至时间，三种方式。

```java
	// 除非许可，否则出于线程调度目的禁用当前线程。
	public static void park() {
        UNSAFE.park(false, 0L);
    }
	// 为线程调度目的禁用当前线程，直至指定的等待时间，除非许可可用。
	public static void parkNanos(long nanos) {
        if (nanos > 0)
            UNSAFE.park(false, nanos);
    }
	// 出于线程调度目的禁用当前线程，直到指定的截止日期，除非许可可用。
	public static void parkUntil(long deadline) {
        UNSAFE.park(true, deadline);
    }
```

这些的使用方法就比较明显，然后有点区别的是带 blocker 的方法：

```java
    // 除非许可，否则出于线程调度目的禁用当前线程。添加同步对象
	public static void park(Object blocker) {
       // 获取当前线程
        Thread t = Thread.currentThread();
        // 设置Blocker
        setBlocker(t, blocker);
        // 获取许可
        UNSAFE.park(false, 0L);
        // 重新可运行后再此设置Blocker
        setBlocker(t, null);
    }
```



调用park函数时，首先获取当前线程，然后设置当前线程的parkBlocker字段，即调用setBlocker函数，之后调用Unsafe类的park函数，之后再调用setBlocker函数。

那么问题来了，为什么要在此park函数中要调用两次setBlocker函数呢? 

原因其实很简单，调用 park 函数时，当前线程首先设置好 parkBlocker 字段，然后再调用 Unsafe 的 park 函数，此后，当前线程就已经阻塞了，等待该线程的unpark函数被调用，所以后面的一个setBlocker函数无法运行，unpark函数被调用，该线程获得许可后，就可以继续运行了，也就运行第二个setBlocker，把该线程的parkBlocker字段设置为null，这样就完成了整个park函数的逻辑。

如果没有第二个 setBlocker，那么之后没有调用 park(Object blocker)，而直接调用 getBlocker函数，得到的还是前一个 park(Object blocker) 设置的 blocker，显然是不符合逻辑的。

总之，必须要保证在 park(Object blocker) 整个函数执行完后，该线程的 parkBlocker 字段又恢复为 null。所以，park(Object)型函数里必须要调用setBlocker函数两次。setBlocker方法如下。



<br/>

### <span id="t22">unpark 方法</span>

此函数表示如果给定线程的许可尚不可用，则使其可用。

> **如果线程在 park 上受阻塞，则它将解除其阻塞状态。否则，保证下一次调用 park 不会受阻塞。**

如果给定线程尚未启动，则无法保证此操作有任何效果。具体函数如下:

```java
    /**
     * 使给定线程的许可可用（如果它尚不可用）。
     * 如果线程在 {@code park} 上被阻塞，那么它将解除阻塞。
     * 否则，它对 {@code park} 的下一次调用保证不会阻塞。如果给定的线程尚未启动，则无法保证此操作有任何效果。
     * @param thread 线程非null情况下，取消线程停放
     */
    public static void unpark(Thread thread) {
        if (thread != null)
            UNSAFE.unpark(thread);
    }
```



<br/>

## <span id="t3">LockSupport示例说明</span>





### <span id="t31">使用wait/notify实现线程同步</span>

```java
class MyThread extends Thread {
    
    public void run() {
        synchronized (this) {
            System.out.println("before notify");            
            notify();
            System.out.println("after notify");    
        }
    }
}

public class WaitAndNotifyDemo {
    public static void main(String[] args) throws InterruptedException {
        MyThread myThread = new MyThread();            
        synchronized (myThread) {
            try {        
                myThread.start();
                // 主线程睡眠3s
                Thread.sleep(3000);
                System.out.println("before wait");
                // 阻塞主线程
                myThread.wait();
                System.out.println("after wait");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }            
        }        
    }
}
```

运行结果

```
before wait
before notify
after notify
after wait
```



使用wait/notify实现同步时，必须先调用wait，后调用notify，如果先调用notify，再调用wait，将起不了作用。具体代码如下



```java
class MyThread extends Thread {
    public void run() {
        synchronized (this) {
            System.out.println("before notify");            
            notify();
            System.out.println("after notify");    
        }
    }
}

public class WaitAndNotifyDemo {
    public static void main(String[] args) throws InterruptedException {
        MyThread myThread = new MyThread();        
        myThread.start();
        // 主线程睡眠3s
        Thread.sleep(3000);
        synchronized (myThread) {
            try {        
                System.out.println("before wait");
                // 阻塞主线程
                myThread.wait();
                System.out.println("after wait");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }            
        }        
    }
}
```

运行结果:

```
before notify
after notify
before wait
```

说明: 由于先调用了notify，再调用的wait，此时主线程还是会一直阻塞。



<br/>



### <span id="t32">使用park/unpark实现线程同步</span>

```java
class MyThread extends Thread {
    private Object object;

    public MyThread(Object object) {
        this.object = object;
    }

    public void run() {
        System.out.println("before unpark");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // 获取blocker
        System.out.println("Blocker info " + LockSupport.getBlocker((Thread) object));
        // 释放许可
        LockSupport.unpark((Thread) object);
        // 休眠500ms，保证先执行park中的setBlocker(t, null);
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // 再次获取blocker
        System.out.println("Blocker info " + LockSupport.getBlocker((Thread) object));

        System.out.println("after unpark");
    }
}

public class test {
    public static void main(String[] args) {
        MyThread myThread = new MyThread(Thread.currentThread());
        myThread.start();
        System.out.println("before park");
        // 获取许可
        LockSupport.park("ParkAndUnparkDemo");
        System.out.println("after park");
    }
}
```

运行结果：

```
before park
before unpark
Blocker info ParkAndUnparkDemo
after park
Blocker info null
after unpark
```

说明:  本程序先执行park，然后在执行unpark，进行同步，并且在unpark的前后都调用了getBlocker，可以看到两次的结果不一样，并且第二次调用的结果为null，这是因为在调用unpark之后，执行了Lock.park(Object blocker)函数中的setBlocker(t, null)函数，所以第二次调用getBlocker时为null。

上例是先调用park，然后调用unpark，现在修改程序，先调用unpark，然后调用park，看能不能正确同步。具体代码如下：

```java
class MyThread extends Thread {
    private Object object;

    public MyThread(Object object) {
        this.object = object;
    }

    public void run() {
        System.out.println("before unpark");        
        // 释放许可
        LockSupport.unpark((Thread) object);
        System.out.println("after unpark");
    }
}

public class ParkAndUnparkDemo {
    public static void main(String[] args) {
        MyThread myThread = new MyThread(Thread.currentThread());
        myThread.start();
        try {
            // 主线程睡眠3s
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("before park");
        // 获取许可
        LockSupport.park("ParkAndUnparkDemo");
        System.out.println("after park");
    }
}
```



运行结果:

```
before unpark
after unpark
before park
after park
```

说明: 可以看到，在先调用unpark，再调用park时，仍能够正确实现同步，不会造成由wait/notify调用顺序不当所引起的阻塞。因此 park/unpark 相比 wait/notify 更加的灵活。

<br/>

### <span id="t33">中断响应</span>

```java
class MyThread extends Thread {
    private Object object;

    public MyThread(Object object) {
        this.object = object;
    }

    public void run() {
        System.out.println("before interrupt");        
        try {
            // 休眠3s
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }    
        Thread thread = (Thread) object;
        // 中断线程
        thread.interrupt();
        System.out.println("after interrupt");
    }
}

public class InterruptDemo {
    public static void main(String[] args) {
        MyThread myThread = new MyThread(Thread.currentThread());
        myThread.start();
        System.out.println("before park");
        // 获取许可
        LockSupport.park("ParkAndUnparkDemo");
        System.out.println("after park");
    }
}
```

运行结果:	

```html
before park
before interrupt
after interrupt
after park
```

说明: 可以看到，在主线程调用park阻塞后，在myThread线程中发出了中断信号，此时主线程会继续运行，也就是说明此时interrupt起到的作用与unpark一样。





![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/QQ图片20210605155047.jpg)

<br/>

## <span id="te">参考文章</span>

<a href="" target="_blank"></a>

<a href="https://segmentfault.com/a/1190000015562456" target="_blank">Java多线程进阶（五）—— J.U.C之locks框架：LockSupport</a>

<a href="https://www.pdai.tech/md/java/thread/java-thread-x-lock-LockSupport.html" target="_blank">JUC锁: LockSupport详解 | Java 全栈知识体系 (pdai.tech)</a>

