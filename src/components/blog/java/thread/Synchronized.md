

<div class="catalog">

- [本文概述](#t0)
- [synchronized](#t1)
  - [使用方法](#t11)
  - [原理分析](#t12)
  - [特性描述](#t13)
  - [JDK6 的优化](#t14)
- [代码优化](#t2)
- [参考文章](#te)

</div>



## <span id="t0">本文概述</span>

讲解下 Java 中和并发相关的个关键字：`synchronized` 、`volatile` 。

因为关键字已经是除了 JVM 外最底层的应用了。。。

所以除了分析在 JVM 中关键字的作用，其他的只能通过代码举例说明，这样就会显得比较得.......枯燥。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/emo/QQ%E5%9B%BE%E7%89%8720201111104311.jpg)

<br/>

## <span id="t1">synchronized</span>

synchronized 关键字是为了解决共享资源竞争的问题，共享资源一般是以对象形式存在的内存片段。

**所以，只有共享资源的读写访问才需要同步化，如果不是共享资源那么根本就没有必要同步。**



对 synchronized 的基础使用其实比较简单：

- 一把锁只能同时被一个线程获取，没有获得锁的线程只能等待；
- 每个实例都对应有自己的一把锁(this),不同实例之间互不影响；例外：锁对象是*.class以及synchronized修饰的是static方法的时候，所有对象公用同一把锁；
- synchronized 修饰的方法，无论方法正常执行完毕还是抛出异常，都会释放锁。

<br/>

### <span id="t11">使用方法</span>

synchronized 可修饰的对象如下：

|     修饰目标     |             锁             |
| :--------------: | :------------------------: |
|     实例方法     | 当前实例对象(即方法调用者) |
|     静态方法     |           类对象           |
|       this       | 当前实例对象(即方法调用者) |
|    class 对象    |           类对象           |
| 任意 Object 对象 |        任意示例对象        |

简单的使用就不详细讲了。

<br/>

### <span id="t12">原理分析</span>

举个例子，如下 mian 方法代码：

```java
   public static void main(String[] args) {
        synchronized (new Object()) {
            System.out.println(1);
        }
    }
```

使用 jclasslib 查看字节码，main 方法字节码如下：

```
 0 new #2 <java/lang/Object>
 3 dup
 4 invokespecial #1 <java/lang/Object.<init>>
 7 dup
 8 astore_1
 9 monitorenter
10 getstatic #3 <java/lang/System.out>
13 iconst_1
14 invokevirtual #4 <java/io/PrintStream.println>
17 aload_1
18 monitorexit
19 goto 27 (+8)
22 astore_2
23 aload_1
24 monitorexit
25 aload_2
26 athrow
27 return
```

可以发现，有关监视器的几行命令：

```
9 monitorenter
......
18 monitorexit
......
24 monitorexit
```

`Monitorenter` 和 `Monitorexit` 指令，会让对象在执行，使其锁计数器加1或者减1。

每一个对象在同一时间只与一个 monitor(锁) 相关联，而一个 monitor 在同一时间只能被一个线程获得，一个对象在尝试获得与这个对象相关联的 Monitor 锁的所有权的时候，monitorenter 指令会发生如下3中情况之一：

- monitor 计数器为 0，意味着目前还没有被获得，那这个线程就会立刻获得然后把锁计数器+1，一旦+1，别的线程再想获取，就需要等待
- 如果这个 monitor 已经拿到了这个锁的所有权，又重入了这把锁，那锁计数器就会累加，变成2，并且随着重入的次数，会一直累加
- 这把锁已经被别的线程获取了，等待锁释放

`monitorexit指令`：释放对于 monitor 的所有权，释放过程很简单，就是讲 monitor 的计数器减1，如果减完以后，计数器不是0，则代表刚才是重入进来的，当前线程还继续持有这把锁的所有权，如果计数器变成0，则代表当前线程不再拥有该 monitor 的所有权，即释放锁。

下图表现了对象，对象监视器，同步队列以及执行线程状态之间的关系：

![线程监视器示意图](https://shiva.oss-cn-hangzhou.aliyuncs.com/data/thread/%E7%BA%BF%E7%A8%8B%E7%9B%91%E8%A7%86%E5%99%A8%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

<br/>



### <span id="t13">特性描述</span>

1. **可重入特性：一个线程可以多次执行 synchronized ，重复获取同一把锁。**

Synchronized 先天具有重入性。每个对象拥有一个计数器，当线程获取该对象锁后，计数器就会加一，释放锁后就会将计数器减一。

<br>

2. **不可中断特性：一个锁后，另一个锁想要获得锁，必须处于阻塞或者等待状态。如果第一个线程不释放锁，那么第二个线程会一直阻塞或者等待，不可被中断。**



<br/>

### <span id="t14">JDK6 的优化</span>

JDK 1.5 之前都只有 监视器 这一个重量级锁。JDK和开发都会大量使用。

JDK 1.6 的时候进行大量的改进，锁升级的过程为：无锁 -> 偏向锁 -> 轻量级锁 -> 重量级锁

<br/>

#### CAS

- CAS 的全名是：Compare And Swap ，比较再交换。它是现在 CPU 广泛支持的一种对内存中的共享数据进行操作的一种特殊指令。
- CAS 可以将比较和交换转化为原子操作，这个原子操作直接由 CPU 保证。
- JAVA 中的 CAS 实现例如：AtomicInteger 

<br>

**悲观锁**

总是假设最坏的情况，每次去拿数据的时候都认为别人会修改,所以每次在拿数据的时候都会上锁，这样别人想拿这个数据就会阻塞。

**因此 synchronized 我们也将其称之为 悲观锁，JDK中的ReentrantLock也是一 种悲观锁。**  性能较差!

<br>

**乐观锁**

总是假设最好的情况，每次去拿数据的时候都认为别人不会修改，就算改了也没关系,再重试即可。所以不会上锁。

但是在更新的时候会判断一下在此期间别人有没有去修改这个数据，如何没有人修改则更新，如果有人修改则重试。

**CAS这种机制我们也可以将其称之为乐观锁。** 综合性能较好!

<br>

CAS获取共享变量时，为了保证该变量的可见性，需要使用volatile修饰。 结合 CAS 和 volatile 可以实现无锁并
发，适用于竞争不激烈、多核CPU的场景下。

> 1. 因为没有使用 synchronized，所以线程不会陷入阻塞，这是效率提升的因素之一。
>
> 2. 但如果竞争激烈，可以想到重试必然频繁发生，反而效率会受影响。（可以阅读 AtomicInteger 源码获得解释）

<br>

#### 偏向锁

在大多数情况下，锁不仅不存在多线程竞争，而且总是由同一线程多次获得，为了让线程获得锁的代价更低，引进了偏向锁。

它的意思是这个锁会偏向于第一个获得它的线程， 会在对象头存储锁偏向的线程ID，以后该线程进入和退出同步块时只需要检查是否为偏向锁、锁标志位以及ThreadID即可。

> **偏向锁，仅限在不存在竞争的情况下。**



<br>

#### 轻量级锁

轻量级锁是 JDK1.6 之中加入的新型锁机制。

它名字中的"轻量级”是相对于使用 monitor 的传统锁而言的，因此传统的锁机制就称为 “重量级” 锁。

首先需要强调一点的是，轻量级锁并不是用来代替重量级锁的。

> 引入轻量级锁的目的：在多线程交替执行同步块的情况下，尽量避免重量级锁引起的性能消耗，但是如果多个线程在同一时刻进入临界区，会导致轻量级锁膨胀升级重量级锁，所以轻量级锁的出现并非是要替代重量级锁。



<br>

#### 自旋锁

**自旋锁（spinlock）**：是指当一个线程在获取锁的时候，如果锁已经被其它线程获取，那么该线程将循环等待，然后不断的判断锁是否能够被成功获取，直到获取到锁才会退出循环。

获取锁的线程一直处于活跃状态，但是并没有执行任何有效的任务，使用这种锁会造成 busy-waiting。

- **使用自旋锁会有以下一个问题：**

1. 如果某个线程持有锁的时间过长，就会导致其它等待获取锁的线程进入循环等待，消耗CPU。使用不当会造成CPU使用率极高。

2. 上面Java实现的自旋锁不是公平的，即无法满足等待时间最长的线程优先获取锁。不公平的锁就会存在“线程饥饿”问题。

- **自旋锁的优点**

1. 自旋锁不会使线程状态发生切换，一直处于用户态，即线程一直都是active的；不会使线程进入阻塞状态，减少了不必要的上下文切换，执行速度快。
2. 非自旋锁在获取不到锁的时候会进入阻塞状态，从而进入内核态，当获取到锁的时候需要从内核态恢复，需要线程上下文切换。 （线程被阻塞后便进入内核（Linux）调度状态，这个会导致系统在用户态与内核态之间来回切换，严重影响锁的性能）



<br>

#### 锁消除

锁消除理解起来很简单，它指的就是虚拟机即使编译器在运行时，如果检测到那些共享数据不可能存在竞争，那么就执行锁消除。

锁消除可以节省毫无意义的请求锁的时间。

举个例子：

```java
public static void main(String[] args) {
    appendStr("1", "2", "3");
}

public static String appendStr(String str1, String str2, String str3) {
    return new StringBuffer().append(str1).append(str2).append(str3).toString();
}
```

`StringBuffer` 的 append 方法是一个同步方法：

```java
@Override
public synchronized StringBuffer append(String str) {
    toStringCache = null;
    super.append(str);
    return this;
}
```

> 在 `appendStr` 方法中，锁头是 **this(new StringBuffer)** ，同时，<span style="color:red">它是局部变量，不存在竞争</span>。

所以，JVM 会自动消除锁。

再详细点，这个消除步骤是，即时编译器（JIT）在进行逃逸分析时，进行的优化。

<br>

#### 锁粗化

原则上，我们在编写代码的时候，总是推荐将同步块的作用范围限制得尽量小，—直在共享数据的实际作用域才进行同步，这样是为了使得需要同步的操作数量尽可能变小，如果存在锁竞争，那等待线程也能尽快拿到锁。

大部分情况下，上面的原则都是没有问题的，但是如果一系列的连续操作都对同一个对象反复加锁和解锁，那么会带来很多不必要的性能消耗。

```java
public static void main(String[] args) {
    StringBuffer sb = new StringBuffer();
    for (int i = 0; i < 100; i++) {
        sb.append(i);
    }
    System.out.println(sb.toString());
}
```

> **简单讲就是：即时编译器将 append 内的锁消除，在 for 循环上加一个锁** 。



<br/>

## <span id="t2">代码优化</span>

| 优化注意点             | 原因                                                         |
| ---------------------- | ------------------------------------------------------------ |
| 同步代码块内代码尽量少 | 执行越快，单位时间内等待时间越短，竞争越少。<br>自旋锁或者轻量级锁就能满足要求，不需要升级。 |
| 将一个锁拆分为多个锁   | 例如，HashTable 和 ConcurrenHashMap ，原理和上一条相似。     |
| 读写分离               | 读取不加锁，写入和删除加锁                                   |



<br/>

## <span id="te">参考文章</span>

<a href="https://www.pdai.tech/md/java/thread/java-thread-x-key-synchronized.html" target="_blank">https://www.pdai.tech/md/java/thread/java-thread-x-key-synchronized.html</a>

<a href="https://www.pdai.tech/md/java/thread/java-thread-x-key-volatile.html" target="_blank">https://www.pdai.tech/md/java/thread/java-thread-x-key-volatile.html</a>

<a href="https://www.pdai.tech/md/java/thread/java-thread-x-key-final.html" target="_blank">https://www.pdai.tech/md/java/thread/java-thread-x-key-final.html</a>

<a href="https://www.bilibili.com/video/BV1QC4y1H7qd?p=11" target="_blank">https://www.bilibili.com/video/BV1QC4y1H7qd?p=11</a>

<a href="https://blog.csdn.net/topdeveloperr/article/details/80485900" target="_blank">https://blog.csdn.net/topdeveloperr/article/details/80485900</a>

<a href="https://blog.csdn.net/qq_38011415/article/details/89047812" target="_blank">https://blog.csdn.net/qq_38011415/article/details/89047812</a>

<a href="https://blog.csdn.net/weixin_42762133/article/details/103241439" target="_blank">https://blog.csdn.net/weixin_42762133/article/details/103241439</a>

<a href="https://blog.csdn.net/javazejian/article/details/72828483" target="_blank">https://blog.csdn.net/javazejian/article/details/72828483</a>

<a href="https://www.bilibili.com/video/BV1aJ411V763" target="_blank">Java面试热点问题，synchronized原理剖析与优化_哔哩哔哩 (゜-゜)つロ 干杯</a>

<a href="https://www.jianshu.com/p/9d3660ad4358?utm_source=oschina-app" target="_blank">https://www.jianshu.com/p/9d3660ad4358?utm_source=oschina-app</a>

