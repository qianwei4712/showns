<div class="catalog">

- [前言](#t0)
- [为什么需要多线程](#t1)
- [线程不安全示例](#t2)
- [并发出现问题的根源](#t3)
- [Java 怎么解决并发问题](#t4)
- [线程安全不是绝对的](#t5)
- [线程安全实现方法](#t6)
- [参考文章](#t7)

</div>

### <span id="t0">前言</span>


首先呢，我从我一贯参考的网站上扒拉了一张思维导图，我也就打算按照这个顺序进行学了。想看原版的请进下面两个传送门：
 
-  <a target="_blank" href="https://www.pdai.tech/md/java/thread/java-thread-x-overview.html">https://www.pdai.tech/md/java/thread/java-thread-x-overview.html</a>
-  <a href="https://blog.csdn.net/qq_33565047/article/details/103184562" target="_blank">https://blog.csdn.net/qq_33565047/article/details/103184562</a>

 
 多线程整部分，应该会有很多引用其他大佬，毕竟看懂容易整理根本无从下手。

<img src="@/assets/blog/img/thread/ThreadTheoryBase1.png"/>


<br>

### <span id="t1">为什么需要多线程</span>

众所周知，CPU、内存、I/O 设备的速度是有极大差异的，为了合理利用 CPU 的高性能，平衡这三者的速度差异，计算机体系结构、操作系统、编译程序都做出了贡献，主要体现为:

- CPU 增加了缓存，以均衡与内存的速度差异；// 导致 `可见性` 问题 
- 操作系统增加了进程、线程，以分时复用 CPU，进而均衡 CPU 与 I/O 设备的速度差异；// 导致 `原子性` 问题 
- 编译程序优化指令执行次序，使得缓存能够得到更加合理地利用。// 导致 `有序性` 问题

所以，为什么需要多线程，个人理解就是为了充分发挥多核CPU的性能。


<br>

### <span id="t2">线程不安全示例</span>

还是栗子中用的最多的买车票问题吧

```java
public class ThreadUnSaveTest {
    // 购买车票数量
    public static int sum = 0;

    public static void main(String[] args) throws InterruptedException {
        CountDownLatch countDownLatch = new CountDownLatch(2000);
        for (int i = 0; i < 2000; i++) {
            Thread thread = new Thread(() -> {
                sum = sum + 1;
                countDownLatch.countDown();
            });
            thread.start();
        }
        countDownLatch.await();
        System.out.println("全部车票买完了，一共：" + sum + " 张");

    }
}
```

多试几次。。。。还是需要数量大点容易出错：

```java
全部车票买完了，一共：1998 张
```


<br>

### <span id="t3">并发出现问题的根源</span>


可见性、原子性和有序性是并发问题的根源； **缓存导致的可见性问题，线程切换带来的原子性问题，编译优化带来的有序性问题。** 

找到一篇具体的介绍，这一部分的很多都取自以下博客：

- 传送门：<a href="https://blog.csdn.net/qq_33565047/article/details/103184562" target="_blank">https://blog.csdn.net/qq_33565047/article/details/103184562</a>
- 备用截图：<a href="https://github.com/qianwei4712/static-resources/blob/master/showns/images/blog-csdn-net-qq-33565047-article1.png" target="_blank">https://github.com/qianwei4712/static-resources/blob/master/showns/images/blog-csdn-net-qq-33565047-article1.png</a>

<br>

#### 可见性问题由缓存引起

首先看一下后面两张图；

在单核时代，所有的线程都是在一颗 CPU 上执行，CPU 缓存与内存的数据一致性容易解决。因为所有线程都是操作同一个 CPU 的缓存，一个线程对缓存的写，对另外一个线程来说一定是可见的。


![](https://img-blog.csdnimg.cn/20191121160707995.png#pic_center)

一个线程对共享变量的修改，另外一个线程能够立刻看到，我们称为 **可见性** 。

多核时代，每颗 CPU 都有自己的缓存，这时 CPU 缓存与内存的数据一致性就没那么容易解决了，当多个线程在不同的 CPU 上执行时，这些线程操作的是不同的 CPU 缓存。

![](https://img-blog.csdnimg.cn/20191121160815226.png#pic_center)

再抄另一个栗子，存在以下代码：

```java
//线程1执行的代码
int i = 0;
i = 10;
 
//线程2执行的代码
j = i;
```

假若执行线程1的是CPU1，执行线程2的是CPU2。

由上面的分析可知，当线程1执行 i =10这句时，会先把i的初始值加载到CPU1的高速缓存中，然后赋值为10，那么在CPU1的高速缓存当中i的值变为10了，却没有立即写入到主存当中。 

此时线程2执行 j = i，它会先去主存读取i的值并加载到CPU2的缓存当中，注意此时内存当中i的值还是0，那么就会使得j的值为0，而不是10. 

这就是可见性问题，线程1对变量i修改了之后，线程2没有立即看到线程1修改的值。

<br>

#### 线程切换带来的原子性问题

操作系统允许某个进程执行一小段时间，例如 50 毫秒，过了 50 毫秒操作系统就会重新选择一个进程来执行（我们称为“任务切换”），这个 50 毫秒称为“时间片”。

![](https://img-blog.csdnimg.cn/20191121160925302.png#pic_center)


**我们把一个或者多个操作在 CPU 执行的过程中不被中断的特性称为原子性。**

![](https://img-blog.csdnimg.cn/20191121161114199.png#pic_center)

再抄一个栗子：

> 经典的转账问题：比如从账户A向账户B转1000元，那么必然包括2个操作：从账户A减去1000元，往账户B加上1000元。 
>
> 试想一下，如果这2个操作不具备原子性，会造成什么样的后果。假如从账户A减去1000元之后，操作突然中止。
>
> 然后又从B取出了500元，取出500元之后，再执行 往账户B加上1000元 的操作。这样就会导致账户A虽然减去了1000元，但是账户B没有收到这个转过来的1000元。 
> 
>所以这2个操作必须要具备原子性才能保证不出现一些意外的问题。


<br>

#### 编译优化带来的有序性问题

有序性指的是程序按照代码的先后顺序执行。编译器为了优化性能，有时候会改变程序中语句的先后顺序。

```java
public class Singleton {
  static Singleton instance;
  static Singleton getInstance(){
    if (instance == null) {
      synchronized(Singleton.class) {
        if (instance == null)
          instance = new Singleton();
        }
    }
    return instance;
  }
}
```

例如上面单例模式，看上去很完美。但实际上这个 getInstance() 方法并不完美。问题出在哪里呢？出在 new 操作上，我们以为的 new 操作应该是：

1. 分配一块内存 M；
2. 在内存 M 上初始化 Singleton 对象；
3. 然后 M 的地址赋值给 instance 变量。

但是实际上优化后的执行路径却是这样的：

1. 分配一块内存 M；
2. 将 M 的地址赋值给 instance 变量；
3. 最后在内存 M 上初始化 Singleton 对象。

这就可能导致其他线程拿到为初始化的Singleton 对象。


![](https://img-blog.csdnimg.cn/20191121161349114.png#pic_center)


<br>

### <span id="t4">Java 怎么解决并发问题</span>


大佬整理过的《Java 内存模型详解》，强烈推荐：<a href="https://www.pdai.tech/md/java/jvm/java-jvm-jmm.html" target="_blank">https://www.pdai.tech/md/java/jvm/java-jvm-jmm.html</a>

<br>

#### 理解的第一个维度：核心知识点

Java内存模型，即JMM， 是个很复杂的规范，可以从不同的视角来解读。

站在我们这些程序员的视角，本质上可以理解为，Java 内存模型规范了 JVM 如何提供按需禁用缓存和编译优化的方法。具体来说，这些方法包括：

- volatile、synchronized 和 final 三个关键字
- 六项 Happens-Before 规则

<br>

#### 理解的第二个维度：可见性，原子性，有序性

- 原子性

在Java中，对基本数据类型的变量的读取和赋值操作是原子性操作，即这些操作是不可被中断的，要么执行，要么不执行。 请分析以下哪些操作是原子性操作：

```java
x = 10;        //语句1: 直接将数值10赋值给x，也就是说线程执行这个语句的会直接将数值10写入到工作内存中
y = x;         //语句2: 包含2个操作，它先要去读取x的值，再将x的值写入工作内存，虽然读取x的值以及 将x的值写入工作内存 这2个操作都是原子性操作，但是合起来就不是原子性操作了。
x++;           //语句3： x++包括3个操作：读取x的值，进行加1操作，写入新的值。
x = x + 1;     //语句4： 同语句3
```

上面4个语句只有语句1的操作具备原子性。

也就是说，只有简单的读取、赋值（而且必须是将数字赋值给某个变量，变量之间的相互赋值不是原子操作）才是原子操作。

> 从上面可以看出，Java内存模型只保证了基本读取和赋值是原子性操作，如果要实现更大范围操作的原子性，可以通过synchronized和Lock来实现。
> 
> 由于synchronized和Lock能够保证任一时刻只有一个线程执行该代码块，那么自然就不存在原子性问题了，从而保证了原子性。 
  

- 可见性

Java提供了volatile关键字来保证可见性。

当一个共享变量被volatile修饰时，它会保证修改的值会立即被更新到主存，当有其他线程需要读取时，它会去内存中读取新值。

而普通的共享变量不能保证可见性，因为普通共享变量被修改之后，什么时候被写入主存是不确定的，当其他线程去读取时，此时内存中可能还是原来的旧值，因此无法保证可见性。

> 另外，通过synchronized和Lock也能够保证可见性，synchronized和Lock能保证同一时刻只有一个线程获取锁然后执行同步代码，并且在释放锁之前会将对变量的修改刷新到主存当中。因此可以保证可见性。


- 有序性

在Java里面，可以通过volatile关键字来保证一定的“有序性”（具体原理在以后讲述）。

另外可以通过synchronized和Lock来保证有序性，很显然，synchronized和Lock保证每个时刻是有一个线程执行同步代码，相当于是让线程顺序执行同步代码，自然就保证了有序性。

当然JMM是通过Happens-Before 规则来保证有序性的。 


<br>

#### Happens-Before 规则

上面提到了可以用 volatile 和 synchronized 来保证有序性。除此之外，JVM 还规定了先行发生原则，让一个操作无需控制就能先于另一个操作完成。

1. **单一线程原则，Single Thread rule**

> 在一个线程内，在程序前面的操作先行发生于后面的操作。

对于这一点，可能会有疑问。顺序性是指，我们可以按照顺序推演程序的执行结果，但是编译器未必一定会按照这个顺序编译，但是编译器保证结果一定==顺序推演的结果。


2. **管程锁定规则，Monitor Lock Rule**
          
> 这条规则是指对一个锁的解锁 Happens-Before 于后续对这个锁的加锁。

这个好理解，不解锁怎么加锁。


3. **volatile 变量规则，Volatile Variable Rule**

> 对一个 volatile 变量的写操作，happens-before后续对这个变量的读操作。


4. **传递性规则，Transitivity**
           
> 如果A happens-before B，B happens-before C，那么A happens-before C。

线程A中，根据规则一，对变量x的写操作是happens-before对变量v的写操作的;

根据规则二，对变量v的写操作是happens-before对变量v的读操作的;

最后根据规则三，也就是说，线程A对变量x的写操作，一定happens-before线程B对v的读操作，那么线程B在注释处读到的变量x的值，一定是42.



5. **线程启动规则，Thread Start Rule**
               
> 主线程A启动线程B，线程B中可以看到主线程启动B之前的操作。也就是start() happens before 线程B中的操作。    


6. **线程加入规则，Thread Join Rule**

> 主线程A等待子线程B完成，当子线程B执行完毕后，主线程A可以看到线程B的所有操作。也就是说，子线程B中的任意操作，happens-before join()的返回。


<br>

### <span id="t5">线程安全不是绝对的</span>

一个类在可以被多个线程安全调用时就是线程安全的。

线程安全不是一个非真即假的命题，可以将共享数据按照安全程度的强弱顺序分成以下五类: 不可变、绝对线程安全、相对线程安全、线程兼容和线程对立。

<br>

#### 1. 不可变

不可变(Immutable)的对象一定是线程安全的，不需要再采取任何的线程安全保障措施。只要一个不可变的对象被正确地构建出来，永远也不会看到它在多个线程之中处于不一致的状态。

多线程环境下，应当尽量使对象成为不可变，来满足线程安全。

不可变的类型:

- final 关键字修饰的基本数据类型 
- String 
- 枚举类型 
- Number 部分子类，如 Long 和 Double 等数值包装类型，BigInteger 和 BigDecimal 等大数据类型。但同为 Number 的原子类 AtomicInteger 和 AtomicLong 则是可变的。


对于集合类型，可以使用 Collections.unmodifiableXXX() 方法来获取一个不可变的集合。

```java
public class ImmutableExample {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        Map<String, Integer> unmodifiableMap = Collections.unmodifiableMap(map);
        unmodifiableMap.put("a", 1);
    }
}
```

Collections.unmodifiableXXX() 先对原始的集合进行拷贝，需要对集合进行修改的方法都直接抛出异常。

```java
public V put(K key, V value) {
    throw new UnsupportedOperationException();
}

Exception in thread "main" java.lang.UnsupportedOperationException
    at java.util.Collections$UnmodifiableMap.put(Collections.java:1457)
    at ImmutableExample.main(ImmutableExample.java:9)
  
```

<br>

#### 2. 绝对线程安全

不管运行时环境如何，调用者都不需要任何额外的同步措施。

<br>

#### 3. 相对线程安全

相对线程安全需要保证对这个对象单独的操作是线程安全的，在调用的时候不需要做额外的保障措施。但是对于一些特定顺序的连续调用，就可能需要在调用端使用额外的同步手段来保证调用的正确性。

在 Java 语言中，大部分的线程安全类都属于这种类型，例如 Vector、HashTable、Collections 的 synchronizedCollection() 方法包装的集合等。


<br>

#### 4. 线程兼容

线程兼容是指对象本身并不是线程安全的，但是可以通过在调用端正确地使用同步手段来保证对象在并发环境中可以安全地使用，我们平常说一个类不是线程安全的，绝大多数时候指的是这一种情况。

Java API 中大部分的类都是属于线程兼容的，如与前面的 Vector 和 HashTable 相对应的集合类 ArrayList 和 HashMap 等。


<br>

#### 5. 线程对立

线程对立是指无论调用端是否采取了同步措施，都无法在多线程环境中并发使用的代码。

由于 Java 语言天生就具备多线程特性，线程对立这种排斥多线程的代码是很少出现的，而且通常都是有害的，应当尽量避免。

<br>

### <span id="t6">线程安全实现方法</span>

1. **互斥同步**

原子性问题的源头是线程切换，如果能够禁用线程切换那不就能解决这个问题了吗？而操作系统做线程切换是依赖 CPU 中断的，所以禁止 CPU 发生中断就能够禁止线程切换。

在早期单核 CPU 时代，这个方案的确是可行的。

这里我们以 32 位 CPU 上执行 long 型变量的写操作为例来说明这个问题，long 型变量是 64 位，在 32 位 CPU 上执行写操作会被拆分成两次写操作。

![](https://img-blog.csdnimg.cn/20191121161704836.png#pic_center)

在单核 CPU 场景下，同一时刻只有一个线程执行，禁止 CPU 中断，意味着操作系统不会重新调度线程，也就是禁止了线程切换，获得 CPU 使用权的线程就可以不间断地执行，所以两次写操作一定是：要么都被执行，要么都没有被执行，具有原子性。

但是在多核场景下，同一时刻，有可能有两个线程同时在执行，一个线程执行在 CPU-1 上，一个线程执行在 CPU-2 上，此时禁止 CPU 中断，只能保证 CPU 上的线程连续执行，并不能保证同一时刻只有一个线程执行，如果这两个线程同时写 long 型变量高 32 位的话，那就有可能出现我们开头提及的诡异 Bug 了。

**“同一时刻只有一个线程执行” 这个条件非常重要，称之为互斥。**

<font color="red"> **Java 提供的技术有：synchronized 和 ReentrantLock** </font>

![](https://img-blog.csdnimg.cn/20191121162118404.png#pic_center)


<br>

2. **非阻塞同步**

互斥同步最主要的问题就是线程阻塞和唤醒所带来的性能问题，因此这种同步也称为阻塞同步。

互斥同步属于一种悲观的并发策略，总是认为只要不去做正确的同步措施，那就肯定会出现问题。

无论共享数据是否真的会出现竞争，它都要进行加锁(这里讨论的是概念模型，实际上虚拟机会优化掉很大一部分不必要的加锁)、用户态核心态转换、维护锁计数器和检查是否有被阻塞的线程需要唤醒等操作。 

<br>

**CAS**


随着硬件指令集的发展，我们可以使用基于冲突检测的乐观并发策略: 先进行操作，如果没有其它线程争用共享数据，那操作就成功了，否则采取补偿措施(不断地重试，直到成功为止)。这种乐观的并发策略的许多实现都不需要将线程阻塞，因此这种同步操作称为非阻塞同步。


乐观锁需要操作和冲突检测这两个步骤具备原子性，这里就不能再使用互斥同步来保证了，只能靠硬件来完成。硬件支持的原子性操作最典型的是: 比较并交换(Compare-and-Swap，CAS)。CAS 指令需要有 3 个操作数，分别是内存地址 V、旧的预期值 A 和新值 B。当执行操作时，只有当 V 的值等于 A，才将 V 的值更新为 B。



<br>

**AtomicInteger**


J.U.C 包里面的整数原子类 AtomicInteger，其中的 compareAndSet() 和 getAndIncrement() 等方法都使用了 Unsafe 类的 CAS 操作。

以下代码使用了 AtomicInteger 执行了自增的操作。

```java
private AtomicInteger cnt = new AtomicInteger();

public void add() {
    cnt.incrementAndGet();
}
```

以下代码是 incrementAndGet() 的源码，它调用了 unsafe 的 getAndAddInt() 。

```java
public final int incrementAndGet() {
    return unsafe.getAndAddInt(this, valueOffset, 1) + 1;
}
```


以下代码是 getAndAddInt() 源码，var1 指示对象内存地址，var2 指示该字段相对对象内存地址的偏移，var4 指示操作需要加的数值，这里为 1。通过 getIntVolatile(var1, var2) 得到旧的预期值，通过调用 compareAndSwapInt() 来进行 CAS 比较，如果该字段内存地址中的值等于 var5，那么就更新内存地址为 var1+var2 的变量为 var5+var4。 

可以看到 getAndAddInt() 在一个循环中进行，发生冲突的做法是不断的进行重试。

```java
public final int getAndAddInt(Object var1, long var2, int var4) {
    int var5;
    do {
        var5 = this.getIntVolatile(var1, var2);
    } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));

    return var5;
}
```

<br>

**ABA**

如果一个变量初次读取的时候是 A 值，它的值被改成了 B，后来又被改回为 A，那 CAS 操作就会误认为它从来没有被改变过。

J.U.C 包提供了一个带有标记的原子引用类 AtomicStampedReference 来解决这个问题，它可以通过控制变量值的版本来保证 CAS 的正确性。大部分情况下 ABA 问题不会影响程序并发的正确性，如果需要解决 ABA 问题，改用传统的互斥同步可能会比原子类更高效。 


<br>

### <span id="t7">参考文章</span>

<a href="https://www.pdai.tech/md/java/thread/java-thread-x-theorty.html" target="_blank">https://www.pdai.tech/md/java/thread/java-thread-x-theorty.html</a>

<a href="https://blog.csdn.net/qq_33565047/article/details/103184562" target="_blank">https://blog.csdn.net/qq_33565047/article/details/103184562</a>

<a href="https://www.jianshu.com/p/9464bf340234" target="_blank">https://www.jianshu.com/p/9464bf340234</a>



