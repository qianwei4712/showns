<div class="catalog">

- [概述](#t0)
- [使用方法](#t1)
- [实现原理](#t2)
  - [构造](#t21)
  - [countDown](#t22)
  - [await](#t23)
- [源码带注解](#t9)
- [参考文章](#te)

</div>



## <span id="t0">概述</span>

CountDownLatch 是 JUC 中一个比较常用的工具类，使用也很简单。。。

而且大佬们的博客确实写得很好。。。

尽量少些废话，尽快结束。因为源码确实不长，带上注解也才200行，就直接贴在最后了。

总的就是：

- CountDownLatch 是 JDK 提供的一个同步工具，它可以让一个或多个线程等待，一直等到其他线程中执行完成一组操作。
- 常用的方法有 countDown 方法和 await 方法，CountDownLatch 在初始化时，需要指定用给定一个整数作为计数器。
- 当调用 countDown 方法时，计数器会被减1；当调用 await 方法时，如果计数器大于0时，线程会被阻塞，一直到计数器被 countDown 方法减到0时，线程才会继续执行。
- 计数器是无法重置的，当计数器被减到0时，调用 await 方法都会直接返回。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/QQ图片20201111104311.jpg)

<br/>

## <span id="t1">使用方法</span>

用法可以看这个：<a href="https://blog.csdn.net/heihaozi/article/details/105738230" target="_blank">腾讯面试居然跟我扯了半小时的CountDownLatch</a>

讲的很通俗易懂。。。然后，我按自己的节奏来：

在这先写个 demo，看看效果：

```java
    public static void main(String[] args) throws InterruptedException {
        //计数器，判断线程是否执行结束
        CountDownLatch taskLatch = new CountDownLatch(10);
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                try {
                    Thread.sleep(new Double(Math.random() * 10000).longValue());
                    taskLatch.countDown();
                    System.out.println("当前计数器数量：" + taskLatch.getCount());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();
        }
        //当前线程阻塞，等待计数器置为0
        taskLatch.await();
        System.out.println("主线程等待结束：全部执行完毕");
    }
```

结果很明显，主线程会等待计输线程全部执行完毕。

此外， `taskLatch.await()` 可以多个线程等待：

```java
    public static void main(String[] args) throws InterruptedException {
        //计数器，判断线程是否执行结束
        CountDownLatch taskLatch = new CountDownLatch(10);
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                try {
                    Thread.sleep(new Double(Math.random() * 10000).longValue());
                    taskLatch.countDown();
                    System.out.println("当前计数器数量：" + taskLatch.getCount());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();
        }
        new Thread(() -> {
            try {
                taskLatch.await();
                System.out.println("线程1等待结束：全部执行完毕");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();

        //当前线程阻塞，等待计数器置为0
        taskLatch.await();
        System.out.println("主线程等待结束：全部执行完毕");
    }
```

运行结果：

```
当前计数器数量：9
当前计数器数量：8
当前计数器数量：7
当前计数器数量：6
当前计数器数量：5
当前计数器数量：4
当前计数器数量：3
当前计数器数量：2
当前计数器数量：1
当前计数器数量：0
线程等待：全部执行完毕
主线程等待：全部执行完毕
```

所以，另一个用法可以变为：**主线程 `countDown` ，多个子线程等待主线程结束。**

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/QQL6T8KTBQVCKQFN47FP.jpg)

基础用法就这么结束了？？  

当然没这么快，来看个注意点：

> <span style="color:Red">**还需要在线程代码块内加上异常判断，否则在 countDown 之前发生异常而没有处理，就会导致主线程永远阻塞在 await。**</span>

```java
public static void main(String[] args) throws InterruptedException {
    //计数器，判断线程是否执行结束
    CountDownLatch taskLatch = new CountDownLatch(10);
    for (int i = 0; i < 10; i++) {
        int finalI = i;
        new Thread(() -> {
            try {
                Thread.sleep(new Double(Math.random() * 10000).longValue());
                if (finalI == 5){
                    throw new Exception("线程内出现错误，没有执行 countDown");
                }
                taskLatch.countDown();
                System.out.println("当前计数器数量：" + taskLatch.getCount());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
    //当前线程阻塞，等待计数器置为0
    taskLatch.await();
    System.out.println("主线程等待结束：全部执行完毕");
}
```

运行结果如下，主线程将一直阻塞：

```
当前计数器数量：9
当前计数器数量：8
当前计数器数量：7
当前计数器数量：6
当前计数器数量：5
当前计数器数量：4
当前计数器数量：3
当前计数器数量：2
java.lang.Exception: 线程内出现错误，没有执行 countDown
	at tools.locksupportTest.CountDownLatchTest2.lambda$main$0(CountDownLatchTest2.java:19)
	at tools.locksupportTest.CountDownLatchTest2$$Lambda$1/1066516207.run(Unknown Source)
	at java.lang.Thread.run(Thread.java:745)
当前计数器数量：1
```

<br/>

这种地方要是出现问题，那基本就是。。。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/20200723231006.jpg)

当然，上面的注意点可以用等待时间解决，有一个 await 等待时间的限制方法：

```java
public boolean await(long timeout, TimeUnit unit)
    throws InterruptedException {
    return sync.tryAcquireSharedNanos(1, unit.toNanos(timeout));
}
```

例如：

```java
taskLatch.await(3, TimeUnit.SECONDS);
```

意思是当前线程最长等待时间为 3秒。。

不过这个时间的计算有点问题，可以尽量长一点。

<br/>

## <span id="t2">实现原理</span>

CountDownLatch 内部维护了一个 Sync 的内部类，它继承了 `AbstractQueuedSynchronizer` ，并且用 AQS 来实现线程阻塞的功能。

AQS 部分不会太详细，因为我还没研究。。也许什么时候就写完发出来了。

<br/>

### <span id="t21">构造</span>

好嘞，从构造函数开始：

```java
public CountDownLatch(int count) {
    if (count < 0) throw new IllegalArgumentException("count < 0");
    this.sync = new Sync(count);
}
// Sync 的构造方法
Sync(int count) {
    setState(count);
}
```

（源码拉到底部对应去，这边稍微少带注释，占位子。。。）

**AbstractQueuedSynchronizer.setState** 方法如下：

```java
protected final void setState(int newState) {
    state = newState;
}

private volatile int state;
```

**而 state 是用 volatile 修饰，保证 可见性。**

<br/>

### <span id="t22">countDown</span>

在 `countDown`方法中，只调用了Sync实例的`releaseShared`方法，具体是这样的：

```java
public void countDown() {
	sync.releaseShared(1);
}
```

**AbstractQueuedSynchronizer.releaseShared** 方法如下：

```java
    /**
     * 共享模式运行. 如果 {@link #tryReleaseShared} 返回 true，则通过解除阻塞一个或多个线程来实现。
     * @param arg 释放参数。arg会被传到{@link #tryReleaseShared}，但是这个方法是空方法，可能代表任何东西
     * @return 从 {@link #tryReleaseShared} 返回的值
     */
    public final boolean releaseShared(int arg) {
        if (tryReleaseShared(arg)) {
            doReleaseShared();
            return true;
        }
        return false;
    }
```

AbstractQueuedSynchronizer.tryReleaseShared 是个空方法，没有做任何操作。

```java
protected boolean tryReleaseShared(int arg) {
    throw new UnsupportedOperationException();
}
```

但是在 CountDownLatch 的 Sync 内部类中进行了重写：

```java
// 试图设置状态来反映共享模式下的一个释放
protected boolean tryReleaseShared(int releases) {
    // Decrement count; signal when transition to zero
    // 无限循环
    for (;;) {
        // 获取状态，当前计数值
        int c = getState();
        // 计数已经到0了，那就不用再减一了，也没有被线程占有
        if (c == 0)
            return false;
        // 下一个状态
        int nextc = c-1;
        // CAS操作：比较并且设置成功
        if (compareAndSetState(c, nextc))
            //如果减一成功，要判断当前计数值是不是0
            return nextc == 0;
    }
}
```

这里还出现了基于 `UnSafe` 的 CAS 操作，可以看看其他文章，不展开了。

> **CAS 保证了计数值递减操作的原子性。**

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/TIM图片20200603100834.jpg)

好了，继续继续。。。

如果在递减结束后，计数值已经变成0了，那岂不是要释放 await 阻塞的线程了。。

所以下一个 **doReleaseShared** 方法就是干这个的：

```java
private void doReleaseShared() {
    // 无限循环
    for (;;) {
        // 保存头结点
        Node h = head;
        if (h != null && h != tail) { // 头结点不为空并且头结点不为尾结点
            // 获取头结点的等待状态
            int ws = h.waitStatus; 
            if (ws == Node.SIGNAL) { // 状态为SIGNAL
                if (!compareAndSetWaitStatus(h, Node.SIGNAL, 0)) // 不成功就继续
                    continue;            // loop to recheck cases
                // 释放后继结点
                unparkSuccessor(h);
            }
            else if (ws == 0 &&
                        !compareAndSetWaitStatus(h, 0, Node.PROPAGATE)) // 状态为0并且不成功，继续
                continue;                // loop on failed CAS
        }
        if (h == head) // 若头结点改变，继续循环  
            break;
    }
}
```

再详细的，AQS 的结构就不讲了。。

<br/>

### <span id="t23">await</span>

在 `await` 方法中，只调用了 Sync 实例的 `acquireSharedInterruptibly` 方法，具体是这样的：

```java
public void await() throws InterruptedException {
    sync.acquireSharedInterruptibly(1);
}
```

```java
private void doAcquireSharedInterruptibly(int arg) throws InterruptedException {
    // 添加节点至等待队列
    final Node node = addWaiter(Node.SHARED);
    boolean failed = true;
    try {
        for (;;) { // 无限循环
            // 获取node的前驱节点
            final Node p = node.predecessor();
            if (p == head) { // 前驱节点为头结点
                // 试图在共享模式下获取对象状态
                int r = tryAcquireShared(arg);
                if (r >= 0) { // 获取成功
                    // 设置头结点并进行繁殖
                    setHeadAndPropagate(node, r);
                    // 设置节点next域
                    p.next = null; // help GC
                    failed = false;
                    return;
                }
            }
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt()) // 在获取失败后是否需要禁止线程并且进行中断检查
                // 抛出异常
                throw new InterruptedException();
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
  
```

先这样吧。。。AQS 过几天再发。。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/QQ图片20210605155047.jpg)

<br/>

## <span id="t9">源码带注解</span>

```java
/**
 * 允许一个或多个线程等待直到在其他线程中执行的一组操作完成的同步辅助。
 *
 * <p>A CountDownLatch用给定的计数初始化。
 * await方法阻塞，直到由于countDown()方法的调用而导致当前计数达到零，之后所有等待线程被释放，并且任何后续的await 调用立即返回。
 * 这是一个一次性的现象 - 计数无法重置。 如果您需要重置计数的版本，请考虑使用CyclicBarrier 。
 *
 * <p>A CountDownLatch是一种通用的同步工具，可用于多种用途。
 * 一个CountDownLatch为一个计数的CountDownLatch用作一个简单的开/关锁存器，或者门：所有线程调用await在门口等待，直到被调用countDown()的线程打开。
 * 一个CountDownLatch初始化N可以用来做一个线程等待，直到N个线程完成某项操作，或某些动作已经完成N次。
 *
 * <p>CountDownLatch一个有用的属性是，它不要求调用countDown线程等待计数到达零之前继续，它只是阻止任何线程通过await ，直到所有线程可以通过。
 *
 * <p>示例用法：这是一组类，其中一组工作线程使用两个倒计时锁存器：
 * 1. 第一个是启动信号，防止任何工作人员进入，直到驾驶员准备好继续前进;
 * 2. 第二个是完成信号，允许司机等到所有的工作人员完成。
 *
 *  <pre> {@code
 * class Driver { // ...
 *   void main() throws InterruptedException {
 *     CountDownLatch startSignal = new CountDownLatch(1);
 *     CountDownLatch doneSignal = new CountDownLatch(N);
 *
 *     for (int i = 0; i < N; ++i) // create and start threads
 *       new Thread(new Worker(startSignal, doneSignal)).start();
 *
 *     doSomethingElse();            // don't let run yet
 *     startSignal.countDown();      // let all threads proceed
 *     doSomethingElse();
 *     doneSignal.await();           // wait for all to finish
 *   }
 * }
 *
 * class Worker implements Runnable {
 *   private final CountDownLatch startSignal;
 *   private final CountDownLatch doneSignal;
 *   Worker(CountDownLatch startSignal, CountDownLatch doneSignal) {
 *     this.startSignal = startSignal;
 *     this.doneSignal = doneSignal;
 *   }
 *   public void run() {
 *     try {
 *       startSignal.await();
 *       doWork();
 *       doneSignal.countDown();
 *     } catch (InterruptedException ex) {} // return;
 *   }
 *
 *   void doWork() { ... }
 * }}</pre>
 *
 * <p>另一个典型的用法是将问题划分为N个部分，用一个Runnable来描述每个部分，该Runnable执行该部分并在锁存器上倒计时，并将所有Runnables排队到执行器。
 * 当所有子部分完成时，协调线程将能够通过等待。 （当线程必须以这种方式反复倒数时，请改用CyclicBarrier ））
 *
 *  <pre> {@code
 * class Driver2 { // ...
 *   void main() throws InterruptedException {
 *     CountDownLatch doneSignal = new CountDownLatch(N);
 *     Executor e = ...
 *
 *     for (int i = 0; i < N; ++i) // create and start threads
 *       e.execute(new WorkerRunnable(doneSignal, i));
 *
 *     doneSignal.await();           // wait for all to finish
 *   }
 * }
 *
 * class WorkerRunnable implements Runnable {
 *   private final CountDownLatch doneSignal;
 *   private final int i;
 *   WorkerRunnable(CountDownLatch doneSignal, int i) {
 *     this.doneSignal = doneSignal;
 *     this.i = i;
 *   }
 *   public void run() {
 *     try {
 *       doWork(i);
 *       doneSignal.countDown();
 *     } catch (InterruptedException ex) {} // return;
 *   }
 *
 *   void doWork() { ... }
 * }}</pre>
 *
 * 内存一致性效果：直到计数调用之前达到零，在一个线程操作countDown() happen-before以下由相应的成功返回行动await()在另一个线程。
 *
 * @since 1.5
 * @author Doug Lea
 */
public class CountDownLatch {
    /**
     * Synchronization control For CountDownLatch.
     * Uses AQS state to represent count.
     */
    private static final class Sync extends AbstractQueuedSynchronizer {
        private static final long serialVersionUID = 4982264981922014374L;

        Sync(int count) {
            setState(count);
        }

        int getCount() {
            return getState();
        }

        // 试图在共享模式下获取对象状态
        protected int tryAcquireShared(int acquires) {
            return (getState() == 0) ? 1 : -1;
        }

        // 试图设置状态来反映共享模式下的一个释放
        protected boolean tryReleaseShared(int releases) {
            // Decrement count; signal when transition to zero
            // 无限循环
            for (;;) {
                // 获取状态
                int c = getState();
                // 没有被线程占有
                if (c == 0)
                    return false;
                // 下一个状态
                int nextc = c-1;
                // CAS操作：比较并且设置成功
                if (compareAndSetState(c, nextc))
                    return nextc == 0;
            }
        }
    }

    private final Sync sync;

    /**
     * 构造一个以给定计数 CountDownLatch CountDownLatch。
     * @param count count -的次数 countDown()必须调用之前线程可以通过 await()
     * @throws IllegalArgumentException 如果 count为负数
     */
    public CountDownLatch(int count) {
        if (count < 0) throw new IllegalArgumentException("count < 0");
        this.sync = new Sync(count);
    }

    /**
     * 导致当前线程等到锁存器计数到零，除非线程是interrupted 。<p>
     * 如果当前计数为零，则此方法立即返回。<p>
     * 如果当前计数大于零，则当前线程将被禁用以进行线程调度，并处于休眠状态，直至发生两件事情之一：<p>
     * 1. 由于countDown()方法的调用，计数达到零;<p>
     * 2. 一些其他线程interrupts当前线程。<p>
     *
     * 如果当前线程：<p>
     * 1. 在进入该方法时设置了中断状态;<p>
     * 2. 是interrupted等待<p>
     * 然后InterruptedException被关上，当前线程的中断状态被清除。 <p>
     *
     * @throws InterruptedException 如果当前线程在等待时中断
     */
    public void await() throws InterruptedException {
        sync.acquireSharedInterruptibly(1);
    }

    /**
     * 导致当前线程等到锁存器向下计数到零，除非线程为interrupted ，否则指定的等待时间过去。<p>
     * 如果当前计数为零，则此方法将立即返回值为true 。<p>
     * 如果当前计数大于零，则当前线程将被禁用以进行线程调度，并处于休眠状态，直至发生三件事情之一：<p>
     *
     * 1. 由于countDown()方法的调用，计数达到零;<p>
     * 2. 一些其他线程interrupts当前线程;<p>
     * 3. 指定的等待时间过去了。<p>
     *
     * 如果计数达到零，则方法返回值为true 。<p>
     *
     * 如果当前线程：<p>
     * 1. 在进入该方法时设置了中断状态;<p>
     * 2. 是等待interrupted<p>
     *
     * 然后InterruptedException被关上，当前线程的中断状态被清除。<p>
     *
     * 如果指定的等待时间过去，则返回值false 。 如果时间小于或等于零，该方法根本不会等待。 <p>
     *
     * @param timeout 等待的最长时间
     * @param unit timeout参数的时间单位
     * @return true如果计数达到零和 false如果在计数达到零之前经过的等待时间
     * @throws InterruptedException 如果当前线程在等待时中断
     */
    public boolean await(long timeout, TimeUnit unit)
        throws InterruptedException {
        return sync.tryAcquireSharedNanos(1, unit.toNanos(timeout));
    }

    /**
     * 减少锁存器的计数，如果计数达到零，释放所有等待的线程。
     * 如果当前计数大于零，则它将递减。 如果新计数为零，则所有等待的线程都将被重新启用以进行线程调度。
     * <p>如果当前计数等于零，那么没有任何反应。
     */
    public void countDown() {
        sync.releaseShared(1);
    }

    /**
     * 返回当前计数。该方法通常用于调试和测试。
     * @return 当前计数
     */
    public long getCount() {
        return sync.getCount();
    }

    /**
     * 返回一个标识此锁存器的字符串及其状态。 括号中的状态包括字符串"Count ="后跟当前计数。
     * @return 识别此锁存器的字符串以及其状态
     */
    public String toString() {
        return super.toString() + "[Count = " + sync.getCount() + "]";
    }
}
```



## <span id="te">参考文章</span>

<a href="https://blog.csdn.net/heihaozi/article/details/105738230" target="_blank">腾讯面试居然跟我扯了半小时的CountDownLatch</a>

<a href="https://www.pdai.tech/md/java/thread/java-thread-x-juc-tool-countdownlatch.html" target="_blank">JUC工具类: CountDownLatch详解 | Java 全栈知识体系 (pdai.tech)</a>

