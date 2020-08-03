
<div class="catalog">

- [前言](#t0)
- [线程的状态及状态转换](#t1)
- [线程的使用方式](#t2)
- [线程基础机制](#t3)
  - [priority 优先级](#t31)
  - [daemon 守护线程](#t32)
  - [sleep() 线程休眠](#t33)
  - [yield() 状态声明](#t34)
  - [其他 native 方法](#t35)
- [线程之间的协作方式](#t4)
  - [wait、notify 机制](#t41)
  - [join](#t42)
  - [await、signal](#t43)
- [线程中断机制](#t5)
  - [协作式和抢占式](#t51)
  - [isInterrupted()](#t52)
  - [interrupt()](#t53)
  - [interrupted()](#t54)
- [参考文章](#te)

</div>



## <span id="t0">前言</span>

在进入多线程和并发代码学习前，我们得先了解线程这玩意儿。通常需要了解的内容有：

- 线程有哪几种状态? 分别说明从一种状态到另一种状态转变有哪些方式?
- 通常线程有哪几种使用方式?
- 基础线程机制有哪些?
- 线程之间有哪些协作方式?
- 线程的中断机制？

首先讲一个老生常谈的概念，进程与线程：

- **进程** ：指在系统中正在运行的一个应用程序；程序一旦运行就是进程； **进程是资源分配的最小单位。**
- **线程** ：系统分配处理器时间资源的基本单元，或者说进程之内独立执行的一个单元执行流。 **线程是程序执行的最小单位。**

> **线程是一个操作系统级别的概念。 JAVA语言（包括其他编程语言）本身不创建线程；而是调用操作系统层提供的接口创建、控制、销毁线程实例。**

比如 `Thread` 的方法：

```java
private native void start0();
```

最底层方法用的是 `native` 方法，调用的是 `C、C++` 操作系统本地方法。

开始之前老规矩，把源码放上：

- Thread 源码解读注释：<a href="https://github.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/lang/Thread.java" target="_blank">https://github.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/lang/Thread.java</a>
- Object 源码解读注释：<a href="https://github.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/lang/Object.java" target="_blank">https://github.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/lang/Object.java</a>







<br>

## <span id="t1">线程的状态及状态转换</span>

操作系统层面，线程有以下状态：

![计算机层面的线程状态转换](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/thread/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E7%BA%BF%E7%A8%8B%E7%8A%B6%E6%80%81%E8%BD%AC%E6%8D%A2.png)

这五种状态是最基本的转换模型。在不同的编程语言中，会有细微区别。

![Java线程状态转换图](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/thread/Java%20%E7%BA%BF%E7%A8%8B%E7%8A%B6%E6%80%81%E8%BD%AC%E6%8D%A2%E5%9B%BE.png)

对 `Java` 来说，线程状态已经确定在了 **Thread** 内部类的枚举中：

```java
public enum State {
        NEW,//尚未启动的线程的线程状态
        RUNNABLE,//可运行线程的线程状态。处于可运行状态的线程正在Java虚拟机中执行，但可能正在等待来自操作系统的其他资源，例如处理器。
        BLOCKED,//阻塞状态
        WAITING,//等待线程的线程状态
        TIMED_WAITING,//具有指定等待时间的等待线程的线程状态
        TERMINATED;//终止线程的线程状态。线程已完成执行。
    }
```

> Blocking、 Waiting、Timed Waiting 其实都是休眠状态，在 Java 中进行了区分。
>
> 可运行状态和运行状态合并成 Runnable。

然后看看详细介绍

1. **New（新建）** 

线程对象被创建时，它只会短暂地处于这种状态。此时它已经分配了必须的系统资源，并执行了初始化。

相当于，这个线程还没有调用 `start()` 方法。

<br>

2. **Runnable（可运行/就绪/运行中）** 

`Runnable` 状态包括了操作系统线程状态中的 Running 和 Ready，也就是处于此状态的线程可能正在运行，也可能正在等待系统资源，如等待 CPU 为它分配时间片，如等待网络IO读取数据。

线程调度程序会从可运行线程池中选择一个线程作为当前线程。这也是线程进入运行状态的唯一一种方式。

所以线程只能从，可运行状态进入运行中状态。

- 调用线程的 `start()` 方法，此线程进入就绪状态。
- 当前线程时间片用完了，调用当前线程的 `yield()` 方法，当前线程进入就绪状态。
- 锁池里的线程拿到对象锁后，进入就绪状态。
- 当前线程 `sleep() `方法结束，其他线程 `join()` 结束，等待用户输入完毕，某个线程拿到对象锁，这些线程也将进入就绪状态。

<br>

3. **Blocking（阻塞）** 

Blocking 称为阻塞状态，或者说线程已经被挂起，原因通常是它在等待一个“锁”，当尝试进入一个 synchronized 语句块/方法时，锁已经被其它线程占有，就会被阻塞，直到另一个线程走完临界区或发生了相应锁对象的 wait() 操作后，它才有机会去争夺进入临界区的权利。

在 Java 代码中，需要考虑 synchronized 的粒度问题，否则一个线程长时间占用锁，其它争抢锁的线程会一直阻塞，直到拥有锁的线程释放锁。

处于 BLOCKED 状态的线程，即使对其调用 thread.interrupt() 也无法改变其阻塞状态，因为 interrupt() 方法只是设置线程的中断状态，即做一个标记，不能唤醒处于阻塞状态的线程。

<br>

4. **Waiting（无限期等待）** 

等待其它线程显式地唤醒，否则不会被分配 CPU 时间片。

| 进入方法                                   | 退出方法                             |
| :----------------------------------------- | ------------------------------------ |
| 没有设置 Timeout 参数的 Object.wait() 方法 | Object.notify() / Object.notifyAll() |
| 没有设置 Timeout 参数的 Thread.join() 方法 | 被调用的线程执行完毕                 |
| LockSupport.park() 方法                    | -                                    |

<br>

5. **Timed Waiting（限期等待）** 

无需等待其它线程显式地唤醒，在一定时间之后会被系统自动唤醒。

调用 `Thread.sleep()` 方法使线程进入限期等待状态时，常常用“使一个线程睡眠”进行描述。

调用 `Object.wait()` 方法使线程进入限期等待或者无限期等待时，常常用“挂起一个线程”进行描述。

睡眠和挂起是用来描述行为，而阻塞和等待用来描述状态。

阻塞和等待的区别在于，阻塞是被动的，它是在等待获取一个排它锁。而等待是主动的，通过调用 `Thread.sleep()` 和 `Object.wait()` 等方法进入。

| 进入方法                                 | 退出方法                                        |
| ---------------------------------------- | ----------------------------------------------- |
| Thread.sleep() 方法                      | 时间结束                                        |
| 设置了 Timeout 参数的 Object.wait() 方法 | 时间结束 / Object.notify() / Object.notifyAll() |
| 设置了 Timeout 参数的 Thread.join() 方法 | 时间结束 / 被调用的线程执行完毕                 |
| LockSupport.parkNanos() 方法             | -                                               |
| LockSupport.parkUntil() 方法             | -                                               |

<br>

6. **Terminated（死亡）** 

可以是线程结束任务之后自己结束，或者产生了异常而结束。

其实这只是 Java 语言级别的一种状态，在操作系统内部可能已经注销了相应的线程，或者将它复用给其他需要使用线程的请求，而在 Java 语言级别只是通过 Java 代码看到的线程状态而已。

<br>

**“阻塞”与“等待”的区别：**

（1）“阻塞”状态是等待着获取到一个排他锁，进入“阻塞”状态都是被动的，离开“阻塞”状态是因为其它线程释放了锁，不阻塞了；

（2）“等待”状态是在等待一段时间 或者 唤醒动作的发生，进入“等待”状态是主动的；

如主动调用 Object.wait() ，如无法获取到 ReentraantLock ，主动调用 LockSupport.park() ，如主线程主动调用  subThread.join() ，让主线程等待子线程执行完毕再执行。

离开“等待”状态是因为其它线程发生了唤醒动作或者到达了等待时间。

<br>

## <span id="t2">线程的使用方式</span>

Java 创建线程的方式有：

- 实现 Runnable 接口
- 实现 Callable 接口
- 继承 Thread 类

实现 Runnable 和 Callable 接口的类只能当做一个可以在线程中运行的任务，不是真正意义上的线程，因此最后还需要通过 Thread 来调用。

### Runnable 接口

Runnable 接口就一个方法：

```java
/**
 * Runnable接口应由任何类实现，其实例将由线程执行。 该类必须定义一个无参数的方法，称为run 。
 * @since   JDK1.0
 */
@FunctionalInterface
public interface Runnable {
    /**
     * 当实现接口的对象Runnable被用来创建一个线程，启动线程使对象的run在独立执行的线程中调用的方法。
     * <p>方法run的一般合同是它可以采取任何行动。
     */
    public abstract void run();
}

```

基本的使用方式为:

```java
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("Runnable");
    }
}).start();
```

Lamada 表达式则更为简编：

```java
new Thread(() -> System.out.println("Runnable")).start();
```



<br>

### Callable 接口

Callable 接口和 Runnable 相比，就多了一个返回值，使用方式有点差异。

实现方式为 `call()` 方法，带有返回值，可以抛出异常。

```java
/**
 * 返回结果并可能引发异常的任务。 实现者定义一个没有参数的单一方法，称为 call 。
 * Callable 接口类似于 Runnable ，因为它们都是为其实例可能由另一个线程执行的类设计的。
 * 然而，A Runnable 不返回结果，也不能抛出被检查的异常。
 * 该 Executors 类包含的实用方法，从其他普通形式转换为 Callable 类。
 * @since 1.5
 * @param <V> the result type of method {@code call}
 */
@FunctionalInterface
public interface Callable<V> {
    /**
     * 计算一个返回值，如果不能计算那么抛出异常
     * @return computed result
     * @throws Exception if unable to compute a result
     */
    V call() throws Exception;
}
```

Callable 不能直接作为 Thread 参数创建线程，而是用 `Future` 来装载返回结果。

```java
 FutureTask<String> ft = new FutureTask<>(new Callable<String>() {
     @Override
     public String call() throws Exception {
         return "结束";
     }
 });
new Thread(ft).start();
System.out.println(ft.get());
```

<br>

### Thread 类

最后就是最基本的继承 Thread 类了。

```java
public class MyThread extends Thread {
    public void run() {
        // ...
    }
}

public static void main(String[] args) {
    MyThread mt = new MyThread();
    mt.start();
}
```

同样也是需要实现 `run()` 方法，因为 Thread 类也实现了 `Runable` 接口。

当调用 `start()` 方法启动一个线程时，虚拟机会将该线程放入就绪队列中等待被调度，当一个线程被调度时会执行该线程的 `run()` 方法。

在实际开发中， **推荐使用接口实现方式使用线程** ：

- **Java 不支持多重继承，因此继承了 Thread 类就无法继承其它类，但是可以实现多个接口；**
- **继承整个 Thread 类开销过大，使用接口方式更加轻量。**



<br>

## <span id="t3">线程基础机制</span>

线程的机制，其实说的就是 Thread 的底层方法，所以这一部分将会介绍 Java Thread 的部分源码。主要包括：

**priority 优先级、daemon 守护线程、sleep() 线程休眠、yield() 状态声明、interrupt 线程中断、其他 native 方法。**

这一部分介绍的都是 `JDK8` 中的 `Thread` 类的一些 `native` 方法和最基础的机制。

`native` 方法调用操作系统本地方法，也可以把它看做 Java 中最底层部分。

*虽然不知道这些在啥时候能用到，但是看起来还是很高大上的........*

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/20200723231006.jpg)

<br>

### <span id="t31">priority 优先级</span>

在 `Java doc` 中有这样关于优先级的介绍：

> **每一条线程都有优先级。拥有更高优先级的线程在执行时优先于低优先级的线程。**
>
> **当线程中执行的代码创建了一个新的线程对象，那么这个新的线程对象的优先级和创建它的线程的优先级相同。**

<font color="red">这两句话就囊括了线程优先级的三个性质：**继承性、规则性、随机性** </font>

- **规则性** ： **优先级高的线程获取 CPU 的资源概率比较高** ；线程最终是由操作系统来分配 CPU 资源的，Java 只能为这条线程设置较高优先级，使其更有可能尽早获得运行。
- **随机性** ： **在操作系统层面，就算线程设置了更高的优先级，也无法绝对保证优先执行，只是拥有更大的概率获得资源。** 
- **继承性** ： **当线程中执行的代码创建了一个新的线程对象，那么这个新的线程对象的优先级和创建它的线程的优先级相同。** 这个好理解，而且代码里也非常明确。

首先看看 `Thread` 关于优先级的参数：

```java 
// 线程优先级，int类型，范围为1-10，默认为5
private int priority;
// 线程可以具有的最低优先级。
public final static int MIN_PRIORITY = 1;
// 分配给线程的默认优先级
public final static int NORM_PRIORITY = 5;
// 线程可以具有的最高优先级。
public final static int MAX_PRIORITY = 10;
```

在一条线程初始化时，请删去其余代码，可以发现线程的 `继承性` ，如下：

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

省略的其他多余代码，初始化线程，将启动线程的优先级传递到新线程。

然后，我们还能通过调用线程的 `setPriority()` 方法设置线程的优先级（ **优先级的设定最好在 start() 之前** ）：

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
        // 调用 native 方法设置优先级
        setPriority0(priority = newPriority);
    }
}
```

最后实际设置优先级的方法为：

```java
private native void setPriority0(int newPriority);// 设置优先级
```

调用操作系统本地方法，所以 Java 只能通过操作系统开放的方法来管理线程。

<br>

### <span id="t32">daemon 守护线程</span>

在 `Java` 中有两类线程：**用户线程 (User Thread)** 和 **守护线程 (Daemon Thread)**

在 JDK8 的 Thread 源码的官方注释中，关于守护线程有以下几句描述：

> 每一条线程都可能被标注为守护线程。当创建它的线程是一个守护线程时，新线程才是守护线程。
>
> 当 Java 虚拟机启动时，通常已经存在了一个非守护线程（这个线程通常会调用某指定类的名为main的方法）。
>
> <font color="red">**Java 虚拟机将继续执行，直到发生以下任一情况，发生这两种情况，Java 虚拟机将结束：**</font>
>
> - <font color="red">**Runtime类的exit方法被调用，并且安全管理器已经允许进行退出操作。**</font>
> - <font color="red">**所有非守护线程都已经消亡，消亡原因要么是从run方法返回了，要么是抛出异常了。**</font>

<br>

先说简单的，与线程优先级相同，守护线程的 `继承性`  也在线程创建 `init` 方法中：

```java
this.daemon = parent.isDaemon();
//判断就是直接返回属性值
public final boolean isDaemon() {
    return daemon;
}
```

这个没啥好解释的了。。。。然后继续看官方注释，可以发现：

- **main 方法启动的线程是非守护线程（也就是用户线程）。**
- 发生上述的两种情况时，Java 虚拟机将会退出。翻译一下其实就是，所有非守护线程结束时，Java 虚拟机才会停止。所以， **Java 虚拟机中必定包含守护线程。**

> 实际上，Java GC 就是守护线程。

是不是绕的脑阔疼。。。。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/BA7750DF.png)

----

**守护线程是服务线程，准确地来说就是服务其他的线程，具有”陪伴“特性。若进程中没有用户线程，则守护线程自动销毁。**

给个小栗子提供下测试：

```java
public static void main(String[] args) throws InterruptedException {
    Thread thread = new Thread(() -> {
        try {
            for (int i = 0; i < 10000; i++) {
                Thread.sleep(1000);
                System.out.println("守护线程尚未停止");
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    });
    thread.setDaemon(true);
    thread.start();
    //主线程等待3秒
    Thread.sleep(3000);
    System.out.println("主线程（非守护线程）结束。。。守护线程即将关闭");
}
```

测试结果很明显了，就不贴了。。。。。。

还有就是：

**设置守护线程必须在线程开始执行之前：** 

```java
    /**
     * 将此线程标记为{@linkplain #isDaemon 守护线程}或用户线程。
     * 当仅运行的线程都是守护程序线程时，Java虚拟机将退出。
     * <p> 必须在线程启动之前调用此方法
     * @param  on 如果{@code true}，则将该线程标记为守护线程
     * @throws  IllegalThreadStateException 如果此线程是 {@linkplain #isAlive alive}
     * @throws  SecurityException 如果 {@link #checkAccess} 确定当前线程无法修改此线程
     */
    public final void setDaemon(boolean on) {
        checkAccess();
        if (isAlive()) {
            throw new IllegalThreadStateException();
        }
        daemon = on;
    }
```

```java
/**
 * @return 测试此线程是否仍然存在。如果一个线程已经启动并且尚未死亡，则该线程是活动的。
 */
public final native boolean isAlive();
```

*看，这里用到了个 native 方法，最终决定线程的并不是 Java。*

<br>

到这里忽然想起以前在 main 方法测试线程池的时候，主线程运行结束，虚拟机没有停止。

当时没有在意，现在想想应该是非守护线程没有全部关闭。

<br>

现在来研究下，太具体的不讲了，主要确定下是因为非守护线程没有关闭这件事：

1. 比如已经一个线程池 `ThreadPoolExecutor` 的实例对象，我现在 `pool.execute()` 提交了一个任务。
2.  线程池内部有个 `Worker` 内部类，专门负责处理任务。执行任务的方法里写了个死循环（为啥要死循环我就不知道了，以后再研究）

```java
final void runWorker(Worker w) {
	......
    //这里写了个死循环，会看这个 Worker有没有任务，如果没有就会去取
    while (task != null || (task = getTask()) != null) {
    ......
}
```

3. 最后就是这个 `Worker` 创建的时候并没有设置为守护线程，所以根据线程守护属性的继承性，它是用户线程。

![线程池Worker守护线程属性传递](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/thread/%E7%BA%BF%E7%A8%8B%E6%B1%A0Worker%E4%B8%BA%E7%94%A8%E6%88%B7%E7%BA%BF%E7%A8%8B.png)

又解决了以前的一个疑问，舒服。。。。。。抬走，下一个 ~~

<br>

### <span id="t33">sleep() 线程休眠</span>

`sleep(long millis)` 方法就算是没学过并发也肯定见过。在刚开始学习的时候肯定见过这个方法的使用。

而且，不是还有段子，二期性能优化全靠这段代码嘛。。。

```java
 /**
  * 使当前正在执行的线程进入休眠状态（暂时停止执行），以毫秒为单位，取决于系统定时器和调度程序的精度和准确性。
  * 并且线程不会丢失监视器锁。
  * @param  millis 睡眠时间（以毫秒为单位）
  * @throws  IllegalArgumentException 如果{@code millis}的值为负
  * @throws  InterruptedException 如果有任何线程中断了当前线程。抛出此异常时，将清除当前线程的中断状态。
  */
  public static native void sleep(long millis) throws InterruptedException;
```

这里有两个异常，虽然不知道 native 是如何抛出异常的，但是了解下，有这两异常。

**这是一个静态方法，作用于当前使用这个方法的线程。**

Thread 中还有一个更的睡眠方法：

```java
    /**
     * @param  millis 睡眠时间（以毫秒为单位）
     * @param  nanos {@code 0-999999} 额外的纳秒睡眠
     * @throws  IllegalArgumentException 如果{@code millis}的值为负，或者{@code nanos}的值不在{@code 0-999999}范围内
     * @throws  InterruptedException 如果有任何线程中断了当前线程。抛出此异常时，将清除当前线程的中断状态。
     */
    public static void sleep(long millis, int nanos) throws InterruptedException {
        if (millis < 0) {
            throw new IllegalArgumentException("timeout value is negative");
        }
        if (nanos < 0 || nanos > 999999) {
            throw new IllegalArgumentException(
                    "nanosecond timeout value out of range");
        }
        if (nanos >= 500000 || (nanos != 0 && millis == 0)) {
            millis++;
        }
        sleep(millis);
    }
```

仔细一读简直瞎了我的狗眼。。。。。。意思就是，超过 500 微秒，算 1 毫秒？？？？源码还能这么随意？？？

不过这里其实也能发现一个知识点：

**操作系统对线程的管理只能精确到毫秒级别。**

然后这里补充两个有点意思冷门知识：

- `Thread.currentThread().sleep()` 和 `Thread.sleep()` 的区别
- `Thread.sleep(0)` 有什么作用

先看第一个， `Thread.currentThread().sleep()` 和 `Thread.sleep()` 的区别。我就直接列了：

1. 从上面 sleep 方法的代码以及注释中可以发现，它是作用于当前线程。
2. 因为它是一个静态方法，所有线程共用一个方法。所以当当前线程调用这个方法时，并没有创建新的 Thread 对象。
3. `Thread.currentThread().sleep()` 则是先返回当前正在执行的线程的引用。这也是一个 `native` 方法。

```java
/**
 * @return  返回对当前正在执行的线程对象的引用。
 */
 public static native Thread currentThread();
```

4. 所以实际上，两者并没有区别。只是一个是直接使用静态方法，一个是实例调用静态方法。

<br>

下面看第二个，`Thread.sleep(0)` 有什么作用直接引用<a href="https://www.cnblogs.com/JianGuoWan/p/9139698.html" target="_blank">大佬们的博客</a>：

> **Thread.Sleep(0) 并非是真的要线程挂起0毫秒，意义在于这次调用Thread.Sleep(0)的当前线程确实的被冻结了一下，让其他线程有机会优先执行。**
>
> **Thread.Sleep(0) 是你的线程暂时放弃cpu，让线程马上重新回到就绪队列而非等待队列，也就是释放一些未用的时间片给其他线程或进程使用，就相当于一个让位动作。**



<br>

### <span id="t34">yield() 状态声明</span>

Thread 还提供了一个方法，这个方法的作用是建议 CPU 处理线程。看如下代码和注释：

```java
    /**
     * 向处理器提出建议，当前线程愿意让出CPU给其他线程。处理器也可以忽略此提示。
     * <p>Yield 是一种启发式尝试，旨在提高线程之间的相对进展，否则将过度利用CPU。
     * 应将其使用与详细的性能分析和基准测试结合起来，以确保它实际上具有所需的效果。
     * <p>这是一个很少使用的方法。它可能在调试或者测试的时候，或者设计并发控制程序的时候很有用。
     */
    public static native void yield();
```

确实在 Thread 源码内部没有这个方法的直接调用，JDK 内部也很少使用这个方法。

不过和上面的 `Thread.sleep(0)` 进行对比：

- `yield()` 只是建议，CPU 并不一定采纳执行。就算 CPU 采纳，线程也依然是 **RUNNABLE** 状态。只是从运行状态变化到就绪状态。
- 调用 `Thread.sleep()` 时，则会立即从  **RUNNABLE** 转化为 **TIMED_WAITING** 状态。



<br>

### <span id="t35">其他 native 方法</span>

Thread 一些过时的 native 方法{ `suspend0()挂起线程` ，`resume0()恢复挂起的线程` ， `stop0()停止线程`  }就不介绍了。

上面已经介绍了绝大部分 native 方法，剩下的几个在这里统一做下简要介绍。

还有非常重要的中断机制，这个将会后面单独介绍。中断是线程中非常重要的内容，能写的很多。。。

1. 设置线程名

Thread 中对操作系统进行线程名操作是这个方法：

```java
private native void setNativeName(String name);// 设置线程名
```

但是在 Thread 类中，也有自己维护的线程名。

首先 Thread 维护了一个 `char[]` 作为线程名。

```java
private volatile char  name[]; //线程名
```

同时提供了 `get/set` 方法，对于其中的 `set` 方法：

```java
    /**
     * 更改线程名
     * @param      name  此线程的新名称。
     */
    public final synchronized void setName(String name) {
        checkAccess();
        this.name = name.toCharArray();
        // 如果线程状态不为0（初始状态），说明线程已经启动
         // 那就需要调用 native 方法进行更改。
        if (threadStatus != 0) {
            setNativeName(name);
        }
    }
```

如果线程已经启动，那么需要调用本地方法进行更改。。

那么如果没启动呢，就不需要调用了？。。。。那这样是不是说明：

<font color="red">**Java 中 `new Thread()` 创建了一条线程，在 `start()` 之前，其实并没有真正在操作系统中生成线程。**</font>

应该对吧，逻辑通畅。

<br>

2. 持有锁

锁的内容也是后面讲，瞟一眼这个代码注释：

```java
    /**
     * 如果当前线程持有指定锁，则返回true
     * <p>此方法旨在允许程序断言当前线程已持有指定的锁：
     * <pre>
     *     assert Thread.holdsLock(obj);
     * </pre>
     * @param  obj 测试锁所有权的对象
     * @throws NullPointerException 如果obj为 null
     * @return 如果当前线程持有指定锁，则返回true
     * @since 1.4
     */
    public static native boolean holdsLock(Object obj);
```

<br>

3. 还有几个不知道什么作用的方法

```java
private native static Thread[] getThreads();
private native static StackTraceElement[][] dumpThreads(Thread[] threads);
```

这两静态方法在 Thread 类没用到，好像和 JVM 栈有关。

既然没用到，那就不管了。。。

<br>

## <span id="t4">线程之间的协作方式</span>

在一般的SSM框架增删改查中，我们很少需要用到多线程协作。（应该是基本用不到）

但是在稍微偏向技术方面，甚至是，自己做点小玩具，想要更加高效时，就需要用到多线程之间的协调通信。

刚开始学习并发，也不知道全不全。。。我目前找到的就这几种。



<br>

### <span id="t41">wait、notify 机制</span>

首先要介绍的就是，并发中比较特殊的方法。

`wait` 和 `notify` 系列方法是写在 `Object` 中的， `Object` 在 JAVA 中的地位，那简直是老祖宗了，除了 `Class` 外，根本没有其他类有这种地位。。。

> 所以首先我提出的疑问就是，为什么要把这几个方法写在 **Object** 中，而不是 **Thread** 中？

在网上查了半天资料，才发现这居然还是一道号称艰难的面试题。

结论可能会涉及后面的知识，还有一些我都看不懂的，先全部列上：

1. 首先是，wait 和 notify 都必须在同步中才能生效，这些方法都必须标识同步所属的锁。**任意对象都可以作为锁** ，所以将这两方法设计在了 Object 类而不是 Thread 类中。
2. wait 方法暂停的是持有锁的对象，所以想调用方式为 `Object.wait()` ，notify 也一样。
3. wait 和 notify 不仅仅是普通方法或同步工具，更重要的是它们是 **Java 中两个线程之间的通信机制**。 如果不能通过 Java 关键字(例如 synchronized)实现通信此机制，同时又要确保这个机制对每个对象可用，那么 Object 类则是的合理的声明位置。
4. 在 Java 中，为了进入代码的临界区，线程需要锁定并等待锁，他们不知道哪些线程持有锁，而只是知道锁被某个线程持有， 并且需要等待以取得锁, 而不是去了解哪个线程在同步块内，并请求它们释放锁。

说实话，大佬的理解我确实看不懂。。。。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/NM29O3L8D9OFYYR5LSQ.jpg)



**同步** 和 **等待通知** 是两个不同的领域，不要把它们看成是相同的或相关的。

同步是提供互斥并确保 Java 类的线程安全，而 **wait 和 notify 是两个线程之间的通信机制** 。



好嘞，然后继续。wait() 的三个重载方法中，两个方法调用另一个 native 本地方法。

```java
    //无参方法，默认 wait(0),无限期等待
    public final void wait() throws InterruptedException {
        wait(0);
    }
    
    public final void wait(long timeout, int nanos) throws InterruptedException {
        if (timeout < 0) {
            throw new IllegalArgumentException("timeout value is negative");
        }
        if (nanos < 0 || nanos > 999999) {
            throw new IllegalArgumentException("nanosecond timeout value out of range");
        }
        if (nanos >= 500000 || (nanos != 0 && timeout == 0)) {
            timeout++;
        }
        wait(timeout);
    }
```

最终产生作用的是下面这个本地方法：

```java
    /**
     * 导致当前线程等待，直到另一个线程调用此对象的notify()方法或notifyAll()方法，或指定的时间已过。
     * <p>当前线程必须持有本身对象监视器。
     * <p>此方法使当前线程（称为T）将自身置入等待 set 集合中，然后放弃该对象的所有同步声明。
     *之后线程 T 无法成为线程调度的目标，并且休眠，直到发生四件事情之一：
     * <ul>
     * <li>一些其他线程调用该对象的notify方法，并且线程T恰好被任意选择为被唤醒的线程。
     * <li>某些其他线程调用此对象的notifyAll方法。
     * <li>一些其他线程interrupts线程T。
     * <li>指定的实时数量已经过去，或多或少。 然而，如果timeout为零，则不考虑实时，线程等待直到通知。
     * </ul>
     * 然后从该对象的等待set集合中删除线程T ，并重新启用线程调度。
     * 然后它以通常的方式与其他线程竞争在对象上进行同步的权限;
     * 一旦获得了对象的控制，其对对象的所有同步声明就恢复到现状，也就是在调用wait方法之后的情况。
     * 线程T然后从调用wait方法返回。 因此，从返回wait方法，对象和线程的同步状态T正是因为它是当wait被调用的方法。
     *
     * <p>线程也可以唤醒，而不会被通知，中断或超时，即所谓的虚假唤醒 。
     * 虽然这在实践中很少会发生，但应用程序必须通过测试应该使线程被唤醒的条件来防范，并且如果条件不满足则继续等待。
     * 换句话说，等待应该总是出现在循环中，就像这样：
     * <pre>
     *     synchronized (obj) {
     *         while (<condition does not hold>)
     *             obj.wait(timeout);
     *         ... // Perform action appropriate to condition
     *     }
     * </pre>
     * <p>如果当前线程interrupted任何线程之前或在等待时，那么InterruptedException被抛出。
     * 如上所述，在该对象的锁定状态已恢复之前，不会抛出此异常。
     * <p>请注意， wait方法，因为它将当前线程放入该对象的等待集，仅解锁此对象;
     * 当前线程可以同步的任何其他对象在线程等待时保持锁定。
     * <p>该方法只能由作为该对象的监视器的所有者的线程调用。
     * 有关线程可以成为监视器所有者的方法的说明，请参阅notify方法。
     *
     * @param      timeout   等待的最长时间（以毫秒为单位）。
     * @throws  IllegalArgumentException      如果timeout值为负。
     * @throws  IllegalMonitorStateException  如果当前线程不是此对象的监视器的所有者
     * @throws  InterruptedException 如果任何线程在当前线程等待通知之前或当前线程中断当前线程。 当抛出此异常时，当前线程的中断状态将被清除。
     */
    public final native void wait(long timeout) throws InterruptedException;
```

这是官方注解的谷歌翻译。

上面的官方文档的每句话都蛮重要的。。。当然最重要的就两点：

1. 使用 wait 的方法前提： **当前线程必须持有本身对象监视器**
2. 从 wait 唤醒的方式：
   - **其他线程调用该对象的 notify 或 notifyAll 方法。**
   - **其他线程 interrupts 此线程。**
   - **休眠时间已经过去，线程重新等待调度。如果timeout为零，则不考虑实时，线程等待直到通知。**

notify 方法则有以下两个：


```java
    /**
     * 唤醒正在等待对象监视器的单个线程。
     * 如果任何线程正在等待这个对象，其中一个被选择被唤醒。
     * 选择是任意的，并且由实施器判断发生。
     * 线程通过调用wait方法之一等待对象的监视器。
     *
     * <p>唤醒的线程将无法继续，直到当前线程放弃此对象上的锁定为止。
     * 唤醒的线程将以通常的方式与任何其他线程竞争，这些线程可能正在积极地竞争在该对象上进行同步;
     * 例如，唤醒的线程在下一个锁定该对象的线程中没有可靠的权限或缺点。
     *
     * <p>该方法只能由作为该对象的监视器的所有者的线程调用。 线程以三种方式之一成为对象监视器的所有者：
     * <ul>
     * <li>通过执行该对象的同步实例方法。
     * <li>通过执行在对象上synchronized synchronized语句的正文。
     * <li>对于类型为Class,的对象，通过执行该类的同步静态方法。
     * </ul>
     * <p>一次只能有一个线程可以拥有一个对象的显示器。
     * 
     * @throws  IllegalMonitorStateException  如果当前线程不是此对象的监视器的所有者
     */
    public final native void notify();

    /**
     * 唤醒正在等待对象监视器的所有线程。 线程通过调用wait方法之一等待对象的监视器。
     * <p>唤醒的线程将无法继续，直到当前线程释放该对象上的锁。
     * 唤醒的线程将以通常的方式与任何其他线程竞争，这些线程可能正在积极地竞争在该对象上进行同步;
     * 例如，唤醒的线程在下一个锁定该对象的线程中不会有可靠的特权或缺点。
     * <p>该方法只能由作为该对象的监视器的所有者的线程调用。
     * 有关线程可以成为监视器所有者的方法的说明，请参阅notify方法。
     * @throws  IllegalMonitorStateException  如果当前线程不是此对象的监视器的所有者
     */
    public final native void notifyAll();
```

整个栗子测试下：

```java
public class TestMain {

    public static void main(String[] args) {
        ExecutorService executorService = Executors.newCachedThreadPool();
        WaitNotify example = new WaitNotify();
        executorService.execute(example::waitObj);
        executorService.execute(example::notifyObj);
        executorService.shutdown();
        System.out.println("main 主线程结束");
    }

    public static class WaitNotify {

        public synchronized void notifyObj() {
            System.out.println("notity 调用");
            notifyAll();
        }

        public synchronized void waitObj() {
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("wait 结束");
        }
    }
}
```

若启动多个线程调用 wait() 方法，则如下图：

![wait、notify机制示意图](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/thread/wait%E3%80%81notify%E6%9C%BA%E5%88%B6%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

> PS: 没有设置守护线程，因此 main 方法将永远不会终结。

这里顺便补充下，`sleep()` 和 `wait()` 的区别：

|      sleep()      |    wait()     |
| :---------------: | :-----------: |
| Thread 的静态方法 | Object 的方法 |
|      保留锁       |    释放锁     |



<br>

###  <span id="t42">join</span>

> join 方法的作用是使所属的线程对象x正常执行 run() 方法中的任务，而使当前线程z进行无限期的阻塞，等待线程x销毁后再继续执行线程z后面的代码。

<font color="red">**join 方法具有使线程排队运行的作用，有些类似同步的运行效果。**</font>

join 与 synchronized 的区别是：join 在内部使用 wait（）方法进行等待，而 synchronized 关键字使用的是 JVM 底层，使用“对象监视器”原理作为同步。

先来看下 `join` 方法的源码，其他两个无参和带参方法，最终调用的都是这个 `synchronized` 方法：

```java
    /**
     * @param  millis 等待时间（以毫秒为单位）
     * @throws  IllegalArgumentException 如果{@code millis}的值为负
     * @throws  InterruptedException 如果有任何线程中断了当前线程，抛出此异常时，线程的中断状态将被清除。
     */
    public final synchronized void join(long millis) throws InterruptedException {
        //记录进入方法的时间
        long base = System.currentTimeMillis();
        long now = 0;
        if (millis < 0) {
            throw new IllegalArgumentException("timeout value is negative");
        }
        if (millis == 0) {
            //如果线程未死亡，则循环调用 wait
            while (isAlive()) {
                wait(0);
            }
        } else {
            while (isAlive()) {
                //第一次进入，now 为0，等待 millis 毫秒
                //第二次进入，now 为已经等待时间，delay小于等于0时跳出
                long delay = millis - now;
                if (delay <= 0) {
                    break;
                }
                wait(delay);
                now = System.currentTimeMillis() - base;
            }
        }
    }
```

从源码中可以发现， `join` 最后还是基于 `wait` 方法实现的。

先看个例子，看看如何工作，再画图：

```java
public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            try {
                Thread.sleep(2000);
                System.out.println("join 线程的 run 方法");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

        });
        thread.start();

        for (int i = 0; i < 10; i++) {
            if (i == 5){
                thread.join(1999);
            }else {
                System.out.println(System.currentTimeMillis() + "， main 线程循环中：" + i);
            }
        }
    }
```

运行结果，省略前后：

```
...
1596276428638， main 线程循环中：4
1596276430640， main 线程循环中：6
join 线程的 run 方法
1596276430640， main 线程循环中：7
...
```

再放张图，大概示意下工作流程：

![join 机制线程示意图](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/thread/join%20%E6%9C%BA%E5%88%B6%E7%BA%BF%E7%A8%8B%E7%A4%BA%E6%84%8F%E5%9B%BE.png)



<br>

### <span id="t43">await、signal</span>

java.util.concurrent 类库中提供了 Condition 类来实现线程之间的协调，可以在 Condition 上调用 await() 方法使线程等待，其它线程调用 signal() 或 signalAll() 方法唤醒等待的线程。

这种方式可以在一个 Lock 对象里面可以创建多个Condition（即对象监视器）实例，线程对象可以注册在指定的Condition中，从而可以有选择性地对指定线程进行通知，所以更加灵活。

这种方式先贴一个大佬的例子，内容有点多，以后再说，我感觉以后肯定会讲到，应该会有专门一篇。

```java
class AwaitTest {

    private Lock lock = new ReentrantLock();
    private Condition condition = lock.newCondition();

    public void before() {
        lock.lock();
        try {
            System.out.println("before");
            condition.signalAll();
        } finally {
            lock.unlock();
        }
    }

    public void after() {
        lock.lock();
        try {
            condition.await();
            System.out.println("after");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    public static void main(String[] args) {
        ExecutorService executorService = Executors.newCachedThreadPool();
        AwaitTest example = new AwaitTest();
        executorService.execute(example::after);
        executorService.execute(example::before);
        executorService.shutdown();
    }


}
```



<br>

## <span id="t5">线程中断机制</span>

一个线程执行完毕之后会自动结束，如果在运行过程中发生异常也会提前结束。

线程中断是一个非常重要的概念，中断线程是取消任务最好的方法。



在 Java 的 `Thread` 类中，提供了以下三个关于线程中断的 `public` 方法：

- `void interrupt()` ，中断线程。
- `static boolean interrupted()` ，测试当前线程是否已被中断。通过此方法可以清除线程的中断状态。
- `boolean isInterrupted()` ，测试线程是否已经中断，线程的中断状态不受该方法的影响。

这三个是线程的公共方法，但是它的最底层是两个 native 方法：

```java
    private native void interrupt0(); //中断线程
    /**
     * 测试某些线程是否已被中断。线程的中断状态不受此方法的影响。
     * ClearInterrupted参数决定线程中断状态是否被重置，若为true则重置。
     */
    private native boolean isInterrupted(boolean ClearInterrupted);
```

从这里就可以发现：

<font color="red">**线程的中断状态，并不是由 Java 来决定。实际上，Thread 类中并没有维护线程的中断状态。**</font>

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/然而.jpg)

<br>



### <span id="t51">协作式和抢占式</span>

然后，就有了下一个问题：

> **中断状态是个啥玩意儿？？？线程中断难道不是终止线程嘛？为什么还会有状态？Thread 类里面也没有这个状态变量啊，难道操作系统内给线程添加了这个状态？**

所以，又又又又得百度去咯。。。根据各位大佬们的博客，个人感觉应该是这样的：

1. **明确线程中断状态不是 Thread 类的标志位，而是操作系统中对线程的中断标志。**

这一结论来自 `native`  方法：

```java
    /**
     * 测试某些线程是否已被中断。线程的中断状态不受此方法的影响。
     * ClearInterrupted参数决定线程中断状态是否被重置，若为true则重置。
     */
    private native boolean isInterrupted(boolean ClearInterrupted);
```

很明显了，在操作系统对线程的管理中，确实存在一个中断状态的标志位。

<br>

2. **操作系统调度线程的方式：协作式、抢占式**

- 协作式：**线程自己的工作执行完后，要主动通知调度切换到另一个线程上。** 如果一个线程编写有问题，一直不告知系统进行线程切换，那么程序就会一直阻塞在那里。线程的执行时间由自身掌控。
- 抢占式：**线程将由调度来分配执行时间，线程的切换不由线程自身决定。** 不会出现一个线程导致整个进程阻塞的问题。

<font color="red">**Java 的线程中断，也作为协作式中断，调用 `interrupt()` 方法最终也只是更改操作系统中的中断标志位，线程是否中断，由线程自身决定。**</font>

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/225U43536-9.jpg)

<br>

### <span id="t52">isInterrupted()</span>

> **测试线程是否已经中断，线程的中断状态不受该方法的影响。**

```java
    /**
     * 测试此线程是否已被中断。线程的中断状态不受此方法的影响。
     * <p>如果中断时，线程并没有存活，那么该方法返回 false。意思就是，如果线程还没有 start 启动，或者已经消亡，那么返回依然是 false.
     * @return  如果该线程已被中断，返回true；否则返回 false
     */
    public boolean isInterrupted() {
        //不清除中断状态
        return isInterrupted(false);
    }
```

这是最基础的判断中断状态，且不更改 OS 线程中断标志位。可以对照上面的 native 方法阅读。特别的记一下这两句：

<font color="red">**如果线程还没有 start 启动，或者已经消亡，那么返回依然是 false。中断状态只代表是否有线程调用中断方法。**</font>

举个栗子看下效果就行：

```java
   public static class Example extends Thread{
        @Override
        public void run() {
            while (!isInterrupted()){
            }
            System.out.println("线程中断");
        }
    }
```

然后 main 启动：

```java
    public static void main(String[] args) throws Exception {
        Example example = new Example();
        System.out.println("当前线程 example 尚未启动，此时状态：" + example.isInterrupted());
        example.start();
        System.out.println("当前线程 example 启动且尚未调用 interrupt，此时状态：" + example.isInterrupted());
        example.interrupt();
        System.out.println("当前线程 example 启动且调用 interrupt，此时状态：" + example.isInterrupted());
        Thread.sleep(5000);
        System.out.println("等待 5 秒，example 应该已经消亡，此时状态：" + example.isInterrupted());
    }
```

输出状态为：

```
当前线程 example 尚未启动，此时状态：false
当前线程 example 启动且尚未调用 interrupt，此时状态：false
当前线程 example 启动且调用 interrupt，此时状态：true
线程中断
等待 5 秒，example 应该已经消亡，此时状态：false
```



<br>

### <span id="t53">interrupt()</span>

> **中断线程**

先看下源码，以及官方（我自个的渣渣翻译）注释：

```java
    /**
     * 中断此线程。
     * <p>线程可以中断自身，这是允许的。在这种情况下，不用进行安全性验证（{@link #checkAccess() checkAccess} 方法检测）
     * <p>若当前线程由于 wait() 方法阻塞，或者由于join()、sleep()方法，然后线程的中断状态将被清除，并且将收到 {@link InterruptedException}。
     * <p>如果线程由于 IO操作（{@link java.nio.channels.InterruptibleChannel InterruptibleChannel}）阻塞，那么通道 channel 将会关闭，
     * 并且线程的中断状态将被设置，线程将收到一个 {@link java.nio.channels.ClosedByInterruptException} 异常。
     * <p>如果线程由于在 {@link java.nio.channels.Selector} 中而阻塞，那么线程的中断状态将会被设置，它将立即从选择操作中返回。
     *该值可能是一个非零值，就像调用选择器的{@link java.nio.channels.Selector＃wakeupakeup}方法一样。
     *
     * <p>如果上述条件均不成立，则将设置该线程的中断状态。</p>
     * <p>中断未运行的线程不必产生任何作用。
     * @throws  SecurityException 如果当前线程无法修改此线程
     */
    public void interrupt() {
        //如果调用中断的是线程自身，则不需要进行安全性判断
        if (this != Thread.currentThread())
            checkAccess();
		
        synchronized (blockerLock) {
            Interruptible b = blocker;
            if (b != null) {
                interrupt0();           // 只是设置中断标志
                b.interrupt(this);
                return;
            }
        }
        interrupt0();
    }
```

这个方法的作用，在上面的栗子中已经有过体现了，接着来测试下源码中提到的异常：

```java
    public static void main(String[] args) throws Exception {
        Thread thread = new Thread(() -> {
            try {
                Thread.sleep(2000);
                System.out.println("线程 sleep 结束");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        thread.start();
        thread.interrupt();
        System.out.println("main 线程调用 interrupt 结束");
        System.out.println("线程抛出了中断异常，此时状态：" + thread.isInterrupted());
        Thread.sleep(5000);
        System.out.println("等待 5 秒，线程应该已经消亡，此时状态：" + thread.isInterrupted());
    }
```

运行结果：

```java
main 线程调用 interrupt 结束
线程抛出了中断异常，此时状态：true
java.lang.InterruptedException: sleep interrupted
	at java.lang.Thread.sleep(Native Method)
	at thread.InterruptTest.lambda$test2$0(InterruptTest.java:20)
	at thread.InterruptTest$$Lambda$1/791452441.run(Unknown Source)
	at java.lang.Thread.run(Thread.java:745)
等待 5 秒，线程应该已经消亡，此时状态：false
```

在 sleep 过程中调用中断，抛出中断异常。。线程不会往下执行。

**虽然抛出了异常，但是线程的中断状态确实设置成功了。。。只是线程被立刻从 sleep 中唤醒。**

嗯，这两这个好理解。。。。。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/Z6JZX6IFOVSYGLPDXRG.jpg)

<br>

### <span id="t54">interrupted()</span>

> **测试当前线程是否已被中断。通过此方法可以清除线程的中断状态。**

```java
    /**
     * 测试当前线程是否已被中断。
     * 通过此方法可以清除线程的中断状态.
     * 换句话说，如果此方法要连续调用两次，则第二个调用将返回false(除非当前线程在第一个调用清除了它的中断状态之后，且在第二个调用对其进行检查之前再次中断)
     * <p>如果中断时，线程并没有存活，那么该方法返回 false
     * @return   如果该线程已被中断，返回true；否则返回 false
     */
    public static boolean interrupted() {
        //清除线程的中断状态
        return currentThread().isInterrupted(true);
    }
```

  说实话，这个方法的作用，实在是有点迷。。。。

```java
public static class Example2 extends Thread{
        @Override
        public void run() {
            System.out.println("调用 interrupt 方法，线程中断");
            interrupt();
            System.out.println("尚未调用 interrupted 方法，此时线程中断状态：" + isInterrupted());
            System.out.println("线程第 1 次调用 interrupted 方法，方法返回：" + Thread.interrupted());
            System.out.println("线程第 1 次调用 interrupted 方法结束后，此时线程中断状态：" + isInterrupted());
            System.out.println("线程第 2 次调用 interrupted 方法，方法返回：" + Thread.interrupted());
            System.out.println("线程第 2 次调用 interrupted 方法结束后，此时线程中断状态：" + isInterrupted());
            System.out.println("线程第 3 次调用 interrupted 方法，方法返回：" + Thread.interrupted());
            System.out.println("线程第 3 次调用 interrupted 方法结束后，此时线程中断状态：" + isInterrupted());
        }
    }
```

mian 方法测试：

```java
    public static void main(String[] args) throws Exception {
        Example2 example = new Example2();
        example.start();
    }
```

控制台输出结果为：

```
调用 interrupt 方法，线程中断
尚未调用 interrupted 方法，此时线程中断状态：true
线程第 1 次调用 interrupted 方法，方法返回：true
线程第 1 次调用 interrupted 方法结束后，此时线程中断状态：false
线程第 2 次调用 interrupted 方法，方法返回：false
线程第 2 次调用 interrupted 方法结束后，此时线程中断状态：false
线程第 3 次调用 interrupted 方法，方法返回：false
线程第 3 次调用 interrupted 方法结束后，此时线程中断状态：false
```

乍一看，感觉需要挠头。。。这个方法的作用也忒不明显了。。。 `java doc` 也不讲的不清楚。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/FO1K`MWB}1T3WPLJYPS~UHP.jpg)

仔细一想，是这样的：

- 作为一个 `static` 方法，作用于当前线程
- **调用 `static boolean interrupted()` 方法后，先将线程的中断状态设置为 false，再返回原先的中断状态**



<br>

## <span id="te">参考文章</span>

<a target="_blank" href="https://www.cnblogs.com/javadevelper/p/6036472.html">https://www.cnblogs.com/javadevelper/p/6036472.html</a>

<a target="_blank" href="https://www.pdai.tech/md/java/thread/java-thread-x-thread-basic.html">https://www.pdai.tech/md/java/thread/java-thread-x-thread-basic.html</a>

<a target="_blank" href="https://blog.csdn.net/qq_33565047/article/details/102958254">https://blog.csdn.net/qq_33565047/article/details/102958254</a>

<a target="_blank" href="https://blog.csdn.net/wanliguodu/article/details/81005560">https://blog.csdn.net/wanliguodu/article/details/81005560</a>

<a target="_blank" href="https://www.cnblogs.com/trust-freedom/p/6606594.html">https://www.cnblogs.com/trust-freedom/p/6606594.html</a>

<a target="_blank" href="https://blog.csdn.net/qq_22771739/article/details/82529874">https://blog.csdn.net/qq_22771739/article/details/82529874</a>

<a target="_blank" href="https://blog.csdn.net/weixin_33782386/article/details/92423372">https://blog.csdn.net/weixin_33782386/article/details/92423372</a>

<a target="_blank" href="https://segmentfault.com/a/1190000016056471">https://segmentfault.com/a/1190000016056471</a>

<a target="_blank" href="https://www.cnblogs.com/JianGuoWan/p/9139698.html">https://www.cnblogs.com/JianGuoWan/p/9139698.html</a>

<a target="_blank" href="https://segmentfault.com/a/1190000019962661">https://segmentfault.com/a/1190000019962661</a>

<a target="_blank" href="https://www.jianshu.com/p/beb5413c5ce6">https://www.jianshu.com/p/beb5413c5ce6</a>

<a target="_blank" href="https://www.cnblogs.com/Donnnnnn/p/7234934.html">https://www.cnblogs.com/Donnnnnn/p/7234934.html</a>

<a target="_blank" href="https://blog.csdn.net/oldshaui/article/details/106952102">https://blog.csdn.net/oldshaui/article/details/106952102</a>

<a target="_blank" href="https://blog.csdn.net/qq_41901915/article/details/103654263">https://blog.csdn.net/qq_41901915/article/details/103654263</a>

<a target="_blank" href="https://www.cnblogs.com/L-a-u-r-a/p/8575217.html">https://www.cnblogs.com/L-a-u-r-a/p/8575217.html</a>

<a target="_blank" href="https://blog.csdn.net/tianjindong0804/article/details/105134182">https://blog.csdn.net/tianjindong0804/article/details/105134182</a>

