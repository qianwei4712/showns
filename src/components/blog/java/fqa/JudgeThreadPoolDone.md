<div class="catalog">

- [概述](#t0)
- [isTerminated 方式](#t1)
- [getCompletedTaskCount](#t2)
- [CountDownLatch 计数器](#t3)
- [维护一个公共计数](#t4)
- [Future 判断任务执行状态](#t5)
- [参考文章](#t6)

</div>

## <span id="t0">概述</span>

最近写小玩具的时候用到了 `CountDownLatch` 计数器，然后顺便想了想判断线程池全部结束有多少种方法。

在网上搜了下，可能有些没找到，但是我找到的有（所有方法都是在 **ThreadPoolExecutor** 线程池方法下测试的）：

- **isTerminated()** 判断方式，在执行 shutdown() ，关闭线程池后，判断是否所有任务已经完成。
- ThreadPoolExecutor 的 **getCompletedTaskCount()** 方法，判断完成任务数和全部任务数是否相等。
-  **CountDownLatch** 计数器，使用闭锁计数来判断是否全部完成。
- **手动维护一个公共计数** ，原理和闭锁类似，就是更加灵活。
- 使用 submit 向线程池提交任务，**Future** 判断任务执行状态。

好嘞，现在开始一个一个介绍优缺点和简要原理；

先创建一个 **static** 线程池，后面好几个例子就不一一创建了，全部用这个就行了：

```java
    /**
     * 创建一个最大线程数是20的线程池
     */
    public static ThreadPoolExecutor pool = new ThreadPoolExecutor(
                                            10, 20, 0L,
                                            TimeUnit.MILLISECONDS,
                                            new LinkedBlockingQueue<>());
```

然后再准备一个通用的睡眠方法：

```java
    /**
     * 线程执行方法，随机等待0到10秒
     */
    private static void sleepMtehod(int index){
        try {
            long sleepTime = new Double(Math.random() * 10000).longValue();
            Thread.sleep(sleepTime);
            System.out.println("当前线程执行结束: " + index);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
```

这个方法就是为了测试的时候区分线程执行完毕的下顺序而已。

好嘞，准备完毕，现在开始。

<br>

## <span id="t1">isTerminated 方式</span>

首先贴上测试代码：

```java
   private static void shutdownTest() throws Exception {
        for (int i = 0; i < 30; i++) {
            int index = i;
            pool.execute(() -> sleepMtehod(index));
        }
        pool.shutdown();
        while (!pool.isTerminated()){
            Thread.sleep(1000);
            System.out.println("还没停止。。。");
        }
        System.out.println("全部执行完毕");
    }
```

这一种方式就是在主线程中进行循环判断，全部任务是否已经完成。

这里有两个主要方法：

1. **shutdown() ：启动有序关闭，其中先前提交的任务将被执行，但不会接受任何新任务。如果已经关闭，调用没有额外的作用。** 

2. **isTerminated() ：如果所有任务在关闭后完成，则返回true。请注意， isTerminated 从不是 true，除非 shutdown 或 shutdownNow 先被执行。**

通俗点讲，就是在执行全部任务后，对线程池进行 shutdown() 有序关闭，然后循环判断 isTerminated() ，线程池是否全部完成。

**优点** ：操作简单，代码更加简单。

**缺点** ：需要关闭线程池。一般我在代码中都是将线程池注入到 Spring 容器，然后各个组件中统一用同一个，当然不能关闭。

类似方法扩展：

- shutdownNow() ：尝试停止所有主动执行的任务，停止等待任务的处理，并返回正在等待执行的任务列表。 从此方法返回时，这些任务将从任务队列中删除。通过 Thread.interrupt() 取消任务。
- isShutdown() ： 如果线程池已关闭，则返回 true 。

- isTerminating() ：如果在 shutdown() 或 shutdownNow() 之后终止 ，但尚未完全终止，则返回true。
- waitTermination(long timeout, TimeUnit unit) ：当前线程阻塞，直到等所有已提交的任务（包括正在跑的和队列中等待的）执行完，或者等超时时间到，或者线程被中断抛出异常；全部执行完返回true，超时返回false。 **也可以用这个方法代替 isTerminated() 进行判断** 。



<br>

## <span id="t2">getCompletedTaskCount</span>

还是一样，贴上代码：

```java
private static void taskCountTest() throws Exception {
        for (int i = 0; i < 30; i++) {
            int index = i;
            pool.execute(() -> sleepMtehod(index));
        }
        //当线程池完成的线程数等于线程池中的总线程数
        while (!(pool.getTaskCount() == pool.getCompletedTaskCount())) {
            System.out.println("任务总数:" + pool.getTaskCount() + "； 已经完成任务数:" + pool.getCompletedTaskCount());
            Thread.sleep(1000);
            System.out.println("还没停止。。。");
        }
        System.out.println("全部执行完毕");
    }
```

还是一样在主线程循环判断，主要就两个方法：

1. **getTaskCount() ：返回计划执行的任务总数。由于任务和线程的状态可能在计算过程中动态变化，因此返回的值只是一个近似值。**
2. **getCompletedTaskCount() ：返回完成执行的任务的大致总数。因为任务和线程的状态可能在计算过程中动态地改变，所以返回的值只是一个近似值，但是在连续的调用中并不会减少。**

这个好理解，总任务数等于已完成任务数，就表示全部执行完毕。

**优点** ：完全使用了 ThreadPoolExecutor 提供的方法，并且不必关闭线程池，避免了创建和销毁带来的损耗。

**缺点** ：上面的解释也看到了，使用这种判断存在很大的限制条件；必须确定，在循环判断过程中，没有新的任务产生。差不多意思就是，这个线程池只能在这条线程中使用。

其他 ：

- 最后扯两句，因为我用 main 方法运行的，跑完后 main 没有结束，是因为非守护线程如果不终止，程序是不会结束的。
- 而线程池 Worker 线程里写了一个死循环，而且被设置成了非守护线程。



<br>

## <span id="t3">CountDownLatch 计数器</span>

这种方法是我比较常用的方法，先看代码：

```java
   private static void countDownLatchTest() throws Exception {
        //计数器，判断线程是否执行结束
        CountDownLatch taskLatch = new CountDownLatch(30);
        for (int i = 0; i < 30; i++) {
            int index = i;
            pool.execute(() -> {
                sleepMtehod(index);
                taskLatch.countDown();
                System.out.println("当前计数器数量：" + taskLatch.getCount());
            });
        }
        //当前线程阻塞，等待计数器置为0
        taskLatch.await();
        System.out.println("全部执行完毕");
    }
```

这种方法，呃，应该是看起来比较高级的，我也不知道别的大佬怎么写的，反正我就用这个。

这个方法需要介绍下这个工具类 **CountDownLatch** 。先把这种方式的优缺点写了，后面再详细介绍这个类。

**优点** ：代码优雅，不需要对线程池进行操作，将线程池作为 Bean 的情况下有很好的使用场景。

**缺点** ：需要提前知道线程数量；性能确实，呃呃呃呃呃，差了点。哦对了，**还需要在线程代码块内加上异常判断，否则在 countDown 之前发生异常而没有处理，就会导致主线程永远阻塞在 await。** 



<br>

**CountDownLatch 概述**

CountDownLatch 是 JDK 提供的一个同步工具，它可以让一个或多个线程等待，一直等到其他线程中执行完成一组操作。

常用的方法有 countDown 方法和 await 方法，CountDownLatch 在初始化时，需要指定用给定一个整数作为计数器。

当调用 countDown 方法时，计数器会被减1；当调用 await 方法时，如果计数器大于0时，线程会被阻塞，一直到计数器被 countDown 方法减到0时，线程才会继续执行。

计数器是无法重置的，当计数器被减到0时，调用 await 方法都会直接返回。



<br>

## <span id="t4">维护一个公共计数</span>

这种方式其实和 CountDownLatch 原理类似。

先维护一个静态变量

```java
private static int taskNum = 0;
```

然后在线程任务结束时，进行静态变量操作：

```java
   private static void staticCountTest() throws Exception {
        Lock lock = new ReentrantLock();
        for (int i = 0; i < 30; i++) {
            int index = i;
            pool.execute(() -> {
                sleepMtehod(index);
                lock.lock();
                taskNum++;
                lock.unlock();
            });
        }
        while(taskNum < 30) {
            Thread.sleep(1000);
            System.out.println("还没停止。。。当前完成任务数:" + taskNum);
        }
        System.out.println("全部执行完毕");
    }
```

其实就是加锁计数，循环判断。

**优点** ：手动维护方式更加灵活，对于一些特殊场景可以手动处理。

**缺点** ：和 CountDownLatch 相比，一样需要知道线程数目，但是代码实现比较麻烦，相对于灵活这一个优势，貌似投入产出并不对等。



<br>

## <span id="t5">Future 判断任务执行状态</span>

Future 是用来装载线程结果的，不过，用这个来进行判断写代码总感觉怪怪的。

因为 Future 只能装载一条线程的返回结果，多条线程总不能用 List 在接收 Future 。

这里就开一个线程做个演示：

```java
    private static void futureTest() throws Exception {
        Future<?> future = pool.submit(() -> sleepMtehod(1));
        while (!future.isDone()){
            Thread.sleep(500);
            System.out.println("还没停止。。。");
        }
        System.out.println("全部执行完毕");
    }
```

这种方式就不写优缺点了，因为 Future 的主要使用场景并不是用于判断任务执行状态。




<br>

## <span id="t6">参考文章</span>

<a href="https://blog.csdn.net/u011635492/article/details/80313658" target="_blank">https://blog.csdn.net/u011635492/article/details/80313658</a>

<a href="https://www.jianshu.com/p/58bfd7f04bb5" target="_blank">https://www.jianshu.com/p/58bfd7f04bb5</a>

<a href="https://blog.csdn.net/zzzgd_666/article/details/103009910" target="_blank">https://blog.csdn.net/zzzgd_666/article/details/103009910</a>

<a href="https://blog.csdn.net/heihaozi/article/details/105738230" target="_blank">https://blog.csdn.net/heihaozi/article/details/105738230</a>

<a href="https://blog.csdn.net/qq_38875300/article/details/82744768" target="_blank">https://blog.csdn.net/qq_38875300/article/details/82744768</a>

