

<div class="catalog">

- [本文概述](#t0)
- [volatile 的特性](#t1)
    - [保证可见性](#t11)
    - [不保证原子性](#t12)
    - [禁止指令重排](#t13)
- [volatile 的实现原理](#t2)
    - [内存屏障](#t21)
    - [可见性实现](#t22)
    - [有序性实现](#t23)
- [应用场景](#t3)
    - [状态标志](#t31)
    - [一次性安全发布](#t32)
    - [双重检查](#t33)
    - [独立观察](#t34)
- [参考文章](#te)

</div>



## <span id="t0">本文概述</span>

volatile 关键字对增删改查程序员应该是比较陌生的。（反正我前几年是一次没用过）

暴露了我菜鸡的水准。。。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/unc/012C53FF8A00764006B0E19AA03D853B.png)



volatile 是 JVM 提供的一种轻量级的同步机制。

Java 语言包含两种内在的同步机制：

- 同步 synchronized，通常称为重量级锁，不过随着JVM优化，现在也不是特别重。
- 轻量级 volatile ，因为它不会引起线程上下文的切换和调度。

但是 volatile 变量的同步性较差（有时它更简单并且开销更低），而且其使用也更容易出错。



<br/>

## <span id="t1">volatile 的特性</span>

> volatile 有三个特性：`保证可见性` 、`不保证原子性` 、`禁止指令重排` 。

在介绍三个特性之前，我们需要先补充一些预备知识。

先简单介绍作用，后面再深入理解实现机制。

看完以下博客，可以很好理解什么是 可见性、原子性、有序性。

- <a href="https://blog.csdn.net/qq_33565047/article/details/103184562" target="_blank">Java 线程 - 并发理论基础(一)_会划水的鱼儿的博客</a>

- <a href="https://blog.csdn.net/m0_46144826/article/details/106972153" target="_blank">Java 并发理论基础 - 看完虽然不会写代码，吹吹牛逼绝对没问题</a>

还有就是 JVM 内存模型：

- <a href="https://blog.csdn.net/m0_46144826/article/details/109220250" target="_blank">JVM 运行时数据区 - 多图预警、万字内存模型解读</a>

（夹在私活，虽然有大佬的写的更好，但是肯定要先推自己的。。。）

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/unc/SXDAVSYTF8]SA8VLBO.jpg)

在 JVM 设计规范中存在线程共享内存，以及线程独有内存。

详细的不说了，看上面的博客，直接说结论：

1. **线程解锁前，必须把共享变量的值刷新回主内存（堆）**
2. **线程加锁前，必须读取共享变量的值，复制到线程独占的工作内存（虚拟机栈）中**
3. **必须是同一把锁**

<br/>

### <span id="t11">保证可见性</span>

> **可见性主要指一个线程修改了共享变量值，其他线程需要立刻看到修改后的值。**

```java
public class VolatileTest {

    int number = 0;

    public static void main(String[] args) throws Exception {
        VolatileTest test = new VolatileTest();

        new Thread(() -> {
            while (test.number == 0){
            }
            System.out.println("子线程结束，number: " + test.number);
        }).start();

        Thread.sleep(2000);

        test.number = 666;
        System.out.println("main 线程结束，number: " + test.number);
    }
}
```

输出结果，子线程一直在循环体中，没有跳出。

```
main 线程结束，number: 666
```



但是如果，在加上 volatile 修饰：

```java
volatile int number = 0;
```

则输出结果为：

```
main 线程结束，number: 666
子线程结束，number: 666
```



<br/>

### <span id="t12">不保证原子性</span>

> 一个操作或者多个操作，要么全部执行成功，要么全部执行失败。满足原子性的操作，中途不可被中断。

那么具体到 volatile 上，就相当于：**两个线程可以同时修改同一个值。**

这显然是不允许的吧。。。。

#### i++ 的原子性

```java
public class VolatileTest {

    volatile int number = 0;
    public void addI() {
        number++;
    }

    public static void main(String[] args) throws Exception {
        VolatileTest test = new VolatileTest();
        for (int n = 0; n < 1000; n++) {
            new Thread(() -> {
                try {
                    Thread.sleep(10);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                test.addI();
            }).start();
        }
        Thread.sleep(10000);
        System.out.println(test.number);
    }
}
```

运行输出：

```
992
```

在上面的例子中，如果 volatile 可以保证操作的原子性，那么结果应该是 1000。

`number++` 这行代码，其实由三步构成：

1. **读取 number 的值**
2. **number 的副本 +1**
3. **将 number  写回到堆内存中**

可以对应下 add 方法中 number++ 的汇编指令：

```assembly
 0 aload_0
 1 dup
 2 getfield #2 <tools/thread/VolatileTest.number>
 5 iconst_1
 6 iadd
 7 putfield #2 <tools/thread/VolatileTest.number>
10 return
```

volatile 是无法保证这三个操作是具有原子性的， **我们可以通过 `AtomicInteger` 或者 `Synchronized` 来保证 +1 操作的原子性。**

注：上面几段代码中多处执行了 Thread.sleep() 方法，目的是为了增加并发问题的产生几率，无其他作用。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/TIM图片20200603100858.jpg)

<br/>

### <span id="t13">禁止指令重排</span>

> 程序执行的顺序按照代码的先后顺序执行。禁止指令重排，便可保证有序性。

这个例子比较难举，在基础知识引用博客中有举例：

- <a href="https://blog.csdn.net/qq_33565047/article/details/103184562" target="_blank">Java 线程 - 并发理论基础(一)_会划水的鱼儿的博客</a>

一般重排序可以分为如下三种：

- 编译器优化的重排序。编译器在不改变单线程程序语义的前提下，可以重新安排语句的执行顺序;
- 指令级并行的重排序。现代处理器采用了指令级并行技术来将多条指令重叠执行。如果不存在数据依赖性，处理器可以改变语句对应机器指令的执行顺序;
- 内存系统的重排序。由于处理器使用缓存和读/写缓冲区，这使得加载和存储操作看上去可能是在乱序执行的。

#### as-if-serial

> 不管怎么重排序，单线程程序的执行结果不能被改变。
>
> 编译器、runtime和处理器都必须遵守as-if-serial语义

所以编译器和处理器不会对存在`数据依赖关系`的操作做重排序，因为这种重排序会改变执行结果。

但是，如果操作之间不存在数据依赖关系，这些操作就可能被编译器和处理器重排序。



<br/>

## <span id="t2">volatile 的实现原理</span>

### <span id="t21">内存屏障</span>

内存屏障（Memory Barrier，或叫做内存栅栏，Memory Fence）是一种CPU指令，**用于控制特定条件下的重排序和内存可见性问题。**

> Java 编译器也会根据内存屏障的规则禁止重排序，内存屏障可以禁止特定类型处理器的重排序，从而让程序按我们预想的流程去执行。

内存屏障可以刷新缓存，使缓存无效，刷新硬件的写缓冲，以及停止执行管道。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/QQ图片20210605155324.jpg)

下面是比较实用的了，内存屏障是一条这样的 `指令`：

- 保证特定操作的执行顺序；
- 影响某些数据（或是某条指令的执行结果）的内存可见性；

**编译器和CPU能够重排序指令，保证最终相同的结果，尝试优化性能；插入一条Memory Barrier会告诉编译器和CPU：不管什么指令都不能和这条 Memory Barrier 指令重排序。**



内存屏障类型有以下几种：

| 类型           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| LoadLoad屏障   | 对于这样的语句Load1; LoadLoad; Load2，在Load2及后续读取操作要读取的数据被访问前，保证Load1要读取的数据被读取完毕 |
| StoreStore屏障 | 对于这样的语句Store1; StoreStore; Store2，在Store2及后续写入操作执行前，保证Store1的写入操作对其它处理器可见 |
| LoadStore屏障  | 对于这样的语句Load1; LoadStore; Store2，在Store2及后续写入操作被刷出前，保证Load1要读取的数据被读取完毕 |
| StoreLoad屏障  | 对于这样的语句Store1; StoreLoad; Load2，在Load2及后续所有读取操作执行前，保证Store1的写入对所有处理器可见。它的开销是四种屏障中最大的。在大多数处理器的实现中，这个屏障是个万能屏障，兼具其它三种内存屏障的功能 |



<br/>

### <span id="t22">可见性实现</span>

如果一个变量是 volatile 修饰的，基于保守策略的 JMM 内存屏障插入策略：

- 在每个volatile写操作的前面插入一个StoreStore屏障。
- 在每个volatile写操作的后面插入一个StoreLoad屏障。
- 在每个volatile读操作的后面插入一个LoadLoad屏障。
- 在每个volatile读操作的后面插入一个LoadStore屏障。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/unc/QQ图片20210605151038.jpg)

这意味着，如果写入一个 volatile 变量，就可以保证：

- 一个线程写入变量a后，任何线程访问该变量都会拿到最新值。
- 在写入变量a之前的写入操作，其更新的数据对于其他线程也是可见的。因为Memory Barrier会刷出cache中的所有先前的写入。

扒了两张图，看看就明白了：

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/thread/volatile%20%E5%86%99%E5%85%A5%E5%B1%8F%E9%9A%9C.png)

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/thread/volatile%20%E8%AF%BB%E5%8F%96%E5%B1%8F%E9%9A%9C.png)



<br/>

### <span id="t23">有序性实现</span>

上面已经说明了，**内存屏障可以控制特定条件下的重排序问题。**

为了性能优化，JMM 在不改变正确语义的前提下，会允许编译器和处理器对指令序列进行重排序。JMM 提供了内存屏障阻止这种重排序。

Java 编译器会在生成指令系列时在适当的位置会插入内存屏障指令来禁止特定类型的处理器重排序。

JMM 会针对编译器制定 volatile 重排序规则表。

| 是否能重排序 | 第二个操作 | 第二个操作  | 第二个操作  |
| :----------: | :--------: | :---------: | :---------: |
|  第一个操作  | 普通读/写  | volatile 读 | volatile 写 |
|  普通读/写   |            |             |     NO      |
| volatile 读  |     NO     |     NO      |     NO      |
| volatile 写  |            |     NO      |     NO      |

" NO " 表示禁止重排序。



<br/>

## <span id="t3">应用场景</span>

使用 volatile 必须具备的条件

- 对变量的写操作不依赖于当前值。
- 该变量没有包含在具有其他变量的不变式中。
- 只有在状态真正独立于程序内其他内容时才能使用 volatile。

<br>

### <span id="t31">状态标志</span>

**作为多线程中的状态触发器，实现轻量级同步。**

例如：

```java
volatile boolean shutdownRequested;
......
public void shutdown() { shutdownRequested = true; }
public void doWork() { 
    while (!shutdownRequested) { 
        // do stuff
    }
}
```



<br>

### <span id="t32">一次性安全发布(one-time safe publication)</span>

缺乏同步会导致无法实现可见性，这使得确定何时写入对象引用而不是原始值变得更加困难。

在缺乏同步的情况下，可能会遇到某个对象引用的更新值(由另一个线程写入)和该对象状态的旧值同时存在。

这就是造成著名的双重检查锁定(double-checked-locking)问题的根源，其中对象引用在没有同步的情况下进行读操作，产生的问题是您可能会看到一个更新的引用，但是仍然会通过该引用看到不完全构造的对象。

```java
public class BackgroundFloobleLoader {
    public volatile Flooble theFlooble;
 
    public void initInBackground() {
        // do lots of stuff
        theFlooble = new Flooble();  // this is the only write to theFlooble
    }
}
 
public class SomeOtherClass {
    public void doWork() {
        while (true) { 
            // do some stuff...
            // use the Flooble, but only if it is ready
            if (floobleLoader.theFlooble != null) 
                doSomething(floobleLoader.theFlooble);
        }
    }
}
```



<br>

### <span id="t33">独立观察(independent observation)</span>

安全使用 volatile 的另一种简单模式是定期 发布 观察结果供程序内部使用。

例如，假设有一种环境传感器能够感觉环境温度。一个后台线程可能会每隔几秒读取一次该传感器，并更新包含当前文档的 volatile 变量。然后，其他线程可以读取这个变量，从而随时能够看到最新的温度值。

```java
public class UserManager {
    public volatile String lastUser;
 
    public boolean authenticate(String user, String password) {
        boolean valid = passwordIsValid(user, password);
        if (valid) {
            User u = new User();
            activeUsers.add(u);
            lastUser = user;
        }
        return valid;
    }
}
```



<br>

### <span id="t34">双重检查(double-checked)</span>

单例模式的一种实现方式，但很多人会忽略 volatile 关键字，因为没有该关键字，程序也可以很好的运行，只不过代码的稳定性总不是 100%，说不定在未来的某个时刻，隐藏的 bug 就出来了。

```java
class Singleton {
    private volatile static Singleton instance;
    private Singleton() { }
    public static Singleton getInstance() {
        if (instance == null) {
            syschronized(Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    } 
}
```

<br/>

## <span id="te">参考文章</span>

<a href="https://www.pdai.tech/md/java/thread/java-thread-x-key-volatile.html" target="_blank">关键字: volatile详解 | Java 全栈知识体系 (pdai.tech)</a>

<a href="https://www.bilibili.com/video/BV1pJ411M7mb?p=2" target="_blank">https://www.bilibili.com/video/BV1pJ411M7mb?p=2</a>

<a href="https://blog.csdn.net/u012723673/article/details/80682208" target="_blank">Java volatile关键字最全总结：原理剖析与实例讲解(简单易懂)</a>

<a href="https://zhuanlan.zhihu.com/p/133851347" target="_blank">volatile底层原理详解 - 知乎</a>

<a href="https://www.cnblogs.com/cxy2020/p/12951333.html" target="_blank">Volatile详解，太详细了 - Code2020 - 博客园</a>

<a href="https://www.cnblogs.com/dolphin0520/p/3920373.html" target="_blank">Java并发编程：volatile关键字解析 - Matrix海子 - 博客园 </a>

<a href="https://www.cnblogs.com/zhengbin/p/5654805.html" target="_blank">Java中Volatile关键字详解 - 郑斌blog - 博客园 </a>

<a href="https://www.cnblogs.com/bmilk/p/13178009.html" target="_blank">Java多线程之volatile详解 - bmilk - 博客园</a>

<a href="https://blog.csdn.net/byhook/article/details/87971081" target="_blank">Java并发编程之happens-before和as-if-serial语义</a>

<a href="https://www.kancloud.cn/luoyoub/jvm-note/1890149" target="_blank">JMM八种操作指令 · jvm学习笔记 · 看云</a>







