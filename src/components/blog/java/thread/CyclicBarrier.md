## 前言

一句话解释就是：

> 10个人开会，必须等10个人全部到了才能开始。没有到齐之前，其余人必须阻塞等待人到期。

<br>

## 使用方式

**10个人到期开始开会** ，从最简单的案例使用开始：

```java
public static void main(String[] args) {
    CyclicBarrier cyclicBarrier = new CyclicBarrier(5);
    for (int i = 0; i < 5; i++) {
        int finalI = i;
        new Thread(() -> {
            try {
                cyclicBarrier.await();
                System.out.println("到期了？员工 " + finalI + " 已就位。");
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (BrokenBarrierException e) {
                e.printStackTrace();
            }
        }).start();
    }
    System.out.println("主线程结束");
}
```

输出结果：

```
主线程结束
到期了？员工 0 已就位。
到期了？员工 4 已就位。
到期了？员工 3 已就位。
到期了？员工 1 已就位。
到期了？员工 2 已就位。
```

<br>

### 越过屏障后执行方法

或者可以在构造器中添加执行方法：

```java
    /**
     * 创建一个新的 {@code CyclicBarrier}，当给定数量的参与方（线程）正在等待它时，它将触发，
     * 并在屏障被触发时执行给定的屏障操作，由进入屏障的最后一个线程执行。
     * @param parties 在障碍被触发之前必须调用 {@link #await} 的线程数
     * @param barrierAction 当障碍物被触发时执行的命令，如果没有动作，则 {@code null}
     * @throws IllegalArgumentException if {@code parties} is less than 1
     */
    public CyclicBarrier(int parties, Runnable barrierAction) {
        if (parties <= 0) throw new IllegalArgumentException();
        this.parties = parties;
        this.count = parties;
        this.barrierCommand = barrierAction;
    }
```

<br>

### 最长等待时间

```java
public int await(long timeout, TimeUnit unit) throws InterruptedException, BrokenBarrierException, TimeoutException {
    return dowait(true, unit.toNanos(timeout));
}
```

可以用来解决异常情况：

```java
CyclicBarrier cyclicBarrier = new CyclicBarrier(5);
for (int i = 0; i < 5; i++) {
    int finalI = i;
    new Thread(() -> {
        try {
            if (finalI == 2) {
                int l = 0;
                l = 1 / l;
            }
            cyclicBarrier.await();
            System.out.println("到期了？员工 " + finalI + " 已就位。");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (BrokenBarrierException e) {
            e.printStackTrace();
        }
    }).start();
}
System.out.println("主线程结束");
```

一个线程报错后，将会一直等待，可以设置最长等待时间。

<br>

### 重复使用

```java
public static void test4() {
    CyclicBarrier cyclicBarrier = new CyclicBarrier(5);
    for (int i = 0; i < 5; i++) {
        int finalI = i;
        new Thread(() -> {
            try {
                cyclicBarrier.await();
                System.out.println("1 到期了？员工 " + finalI + " 已就位。");
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (BrokenBarrierException e) {
                e.printStackTrace();
            }
        }).start();
    }
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    System.out.println("第一次会议结束");
    for (int i = 0; i < 5; i++) {
        int finalI = i;
        new Thread(() -> {
            try {
                cyclicBarrier.await();
                System.out.println("2 到期了？员工 " + finalI + " 已就位。");
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (BrokenBarrierException e) {
                e.printStackTrace();
            }
        }).start();
    }
    System.out.println("第二次会议结束");
}
```





<br>

## 实现原理



```java
 private int dowait(boolean timed, long nanos) throws InterruptedException, BrokenBarrierException, TimeoutException {
     // 保存当前锁
     final ReentrantLock lock = this.lock;
     lock.lock();
     try {
         // 保存当前代
         final Generation g = generation;
         // 保存当前代
         if (g.broken)
             throw new BrokenBarrierException();
         // 线程被中断
         if (Thread.interrupted()) {
             // 损坏当前屏障，并且唤醒所有的线程，只有拥有锁的时候才会调用
             breakBarrier();
             throw new InterruptedException();
         }

         // 减少正在等待进入屏障的线程数量
         int index = --count;
         // 正在等待进入屏障的线程数量为0，所有线程都已经进入
         if (index == 0) {  // tripped
             boolean ranAction = false;
             try {
                 // 运行
                 final Runnable command = barrierCommand;
                 if (command != null)
                     command.run();
                 ranAction = true;
                 nextGeneration();
                 return 0;
             } finally {
                 // 没有运行动作，损坏当前屏障
                 if (!ranAction)
                     breakBarrier();
             }
         }

         // loop until tripped, broken, interrupted, or timed out
         for (;;) {
             try {
                 if (!timed)
                     trip.await();
                 else if (nanos > 0L)// 设置了等待时间，并且等待时间大于0
                     // 等待指定时长
                     nanos = trip.awaitNanos(nanos);
             } catch (InterruptedException ie) {
                 if (g == generation && ! g.broken) { // 等于当前代并且屏障没有被损坏
                     breakBarrier();
                     throw ie;
                 } else {
                     Thread.currentThread().interrupt();
                 }
             }

             if (g.broken)
                 throw new BrokenBarrierException();

             // 不等于当前代，返回索引
             if (g != generation)
                 return index;
             // 设置了等待时间，并且等待时间小于0
             if (timed && nanos <= 0L) {
                 breakBarrier();
                 throw new TimeoutException();
             }
         }
     } finally {
         lock.unlock();
     }
 }
```



<br>

## 参考文章

[JUC工具类: CyclicBarrier详解 | Java 全栈知识体系 (pdai.tech)](https://www.pdai.tech/md/java/thread/java-thread-x-juc-tool-cyclicbarrier.html)
