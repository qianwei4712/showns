

<div class="catalog">

- [本文概述](#t0)
- [CAS](#t1)
    - [CAS 使用示例](#t11)
    - [CAS 问题缺陷](#t12)
- [UnSafe 类](#t2)
- [AtomicInteger](#t3)
    - [底层结构](#t31)
    - [主要方法](#t32)
    - [addAndGet 详解](#t33)
    - [解决 ABA 问题](#t34)
- [参考文章](#te)

</div>



## <span id="t0">原子类概述</span>

> JUC 中多数类是通过 volatile 和 CAS 来实现的，CAS本质上提供的是一种无锁方案，而 Synchronized 和 Lock 是互斥锁方案。
>
> java 原子类本质上使用的是 CAS，而 CAS 底层是通过 Unsafe 类实现的。

线程安全的实现方法包含:

- 互斥同步：`synchronized` 和 `ReentrantLock`
- 非阻塞同步：`CAS` 、 `原子类AtomicXXXX`
- 无同步方案:：`栈封闭` 、`Thread Local` 、可重入代码

本篇主要讲述原子类，以及它所依赖的理论基础。



<br/>

## <span id="t1">CAS</span>

**CAS 的全称为 Compare-And-Swap，直译就是对比和交换。**

CAS 是一条 CPU 的原子指令，其作用是让 CPU 先进行比较两个值是否相等，然后原子地更新某个位置的值，经过调查发现，其实现方式是基于硬件平台的汇编指令，就是说 CAS 是靠硬件实现的，JVM 只是封装了汇编调用，那些 AtomicInteger 类便是使用了这些封装后的接口。  

简单解释：

> CAS 操作需要输入两个数值，一个旧值(期望操作前的值)和一个新值，在操作期间先比较下在旧值有没有发生变化，如果没有发生变化，才交换成新值，发生了变化则不交换。

CAS 操作是原子性的，所以多线程并发使用 CAS 更新数据时，可以不使用锁。JDK 中大量使用了 CAS 来更新数据而防止加锁（synchronized 重量级锁）来保持原子更新。

![CAS 比较和替换流程示意图](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/thread/CAS%20%E6%AF%94%E8%BE%83%E6%9B%BF%E6%8D%A2%E6%B5%81%E7%A8%8B%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

详细的后面再将再讲，先看用法。

<br/>

### <span id="t11">CAS 使用示例</span>

如果不使用 CAS，在高并发下，多线程同时修改一个变量的值我们需要 synchronized 加锁（可能有人说可以用 Lock 加锁，Lock 底层的 AQS 也是基于 CAS 进行获取锁的）。

```java
public class Test {
    private int i = 0;
    public synchronized int add(){
        return i++;
    }
}
```

java 中为我们提供了 AtomicInteger 原子类（底层基于CAS进行更新数据的），不需要加锁就在多线程并发场景下实现数据的一致性。

```java
public class Test {
    private  AtomicInteger i = new AtomicInteger(0);
    public int add(){
        return i.addAndGet(1);
    }
}
```



<br/>

### <span id="t12">CAS 问题缺陷</span>

CAS 方式为乐观锁，synchronized 为悲观锁。因此使用 CAS 解决并发问题通常情况下性能更优。

但使用 CAS 方式也会有几个问题：

#### ABA问题

因为CAS需要在操作值的时候，检查值有没有发生变化，比如没有发生变化则更新，但是如果一个值原来是A，变成了B，又变成了A，那么使用CAS进行检查时则会发现它的值没有发生变化，但是实际上却变化了。

ABA 问题的解决思路就是使用版本号。在变量前面追加上版本号，每次变量更新的时候把版本号加1，那么A->B->A就会变成1A->2B->3A。

从 Java 1.5 开始，JDK 的 Atomic 包里提供了一个类 `AtomicStampedReference` 来解决 ABA问题。

> **这个类的 compareAndSet 方法的作用是首先检查当前引用是否等于预期引用，并且检查当前标志是否等于预期标志，如果全部相等，则以原子方式将该引用和该标志的值设置为给定的更新值。**



<br/>

#### 循环时间长开销大

自旋 CAS 如果长时间不成功，会给CPU带来非常大的执行开销。如果 JVM 能支持处理器提供的 pause 指令，那么效率会有一定的提升。

pause指令有两个作用：

- 第一，它可以延迟流水线执行命令(de-pipeline)，使CPU不会消耗过多的执行资源，延迟的时间取决于具体实现的版本，在一些处理器上延迟时间是零；
- 第二，它可以避免在退出循环的时候因内存顺序冲突(Memory Order Violation)而引起CPU流水线被清空(CPU Pipeline Flush)，从而提高CPU的执行效率。



<br/>

####  只能保证一个共享变量的原子操作

当对一个共享变量执行操作时，我们可以使用循环 CAS 的方式来保证原子操作，但是对多个共享变量操作时，循环 CAS 就无法保证操作的原子性，这个时候就可以用锁。

还有一个取巧的办法，就是把多个共享变量合并成一个共享变量来操作。比如，有两个共享变量i = 2，j = a，合并一下ij = 2a，然后用 CAS 来操作 ij 。

> 从 Java 1.5 开始，JDK 提供了 AtomicReference 类来保证引用对象之间的原子性，就可以把多个变量放在一个对象里来进行 CAS 操作。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/640.png)

<br/>

## <span id="t2">UnSafe 类</span>

上面已经提到了 UnSafe 类，可以看个例子。用的很多的 `AtomicInteger.addAndGet()` 方法：

```java
// 设置使用 Unsafe.compareAndSwapInt 进行更新
private static final Unsafe unsafe = Unsafe.getUnsafe();

/**
  * 以原子方式将给定值与当前值相加.
  * @param delta 要添加的值
  * @return 更新后的值
  */
public final int addAndGet(int delta) {
    return unsafe.getAndAddInt(this, valueOffset, delta) + delta;
}
```

**基本所有的原子类都使用了 UnSafe 类来实现 CAS。**

下面简单介绍下 **UnSafe** 类，因为大多都是 **native** 方法，再深入我也不懂，只能简单介绍。

<br/>

### UnSafe 与 CAS

**UnSafe 是 CAS 的核心类，因为 Java 方法无法直接访问操作系统，就需要 native 方法来操作，这就是 UnSafe 类的作用。**

UnSafe 的所有方法都是 native 方法。

它的作用如下图（感谢 <a href="https://tech.meituan.com/2019/02/14/talk-about-java-magic-class-unsafe.html" target="_blank">大佬</a> ）：

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/thread/UnSafe%20%E7%B1%BB%E6%96%B9%E6%B3%95%E5%92%8C%E4%BD%9C%E7%94%A8.png)



<br/>

## <span id="t3">AtomicInteger</span>

基本所有的原子类都相似，下面用 **AtomicInteger **类来举例说明。

<br/>

### <span id="t31">底层结构</span>

**AtomicInteger**  底层由 **UnSafe** 来实现 CAS，其字段如下：

```java
// 设置使用 Unsafe.compareAndSwapInt 进行更新
private static final Unsafe unsafe = Unsafe.getUnsafe();
// 偏移量
private static final long valueOffset;

static {
    try {
        valueOffset = unsafe.objectFieldOffset
            (AtomicInteger.class.getDeclaredField("value"));
    } catch (Exception ex) { throw new Error(ex); }
}
// volatile 修饰的值，确保了  可见性
private volatile int value;
```

**objectFieldOffset()** 方法作用为：

> **获取某个字段相对 Java 对象的“起始地址”的偏移量。** 可以近似认为 valueOffset 就是物理地址。

<br/>

### <span id="t32">主要方法</span>

**AtomicInteger**  的主要方法如下，作用也很明显了，大同小异。

```java
	/**
     * @return 获得当前值
     */
    public final int get() {
        return value;
    }
	/**
     * 原子地设置为给定值并返回旧值。
     * @param newValue 新值
     * @return 之前的值
     */
    public final int getAndSet(int newValue) {
        return unsafe.getAndSetInt(this, valueOffset, newValue);
    }
	/**
     * 如果当前值 {@code ==} 是预期值，则原子地将值设置为给定的更新值。
     * @param expect 期望值
     * @param update 新值
     * @return {@code true} 如果成功。假返回表示实际值不等于预期值。
     */
    public final boolean compareAndSet(int expect, int update) {
        return unsafe.compareAndSwapInt(this, valueOffset, expect, update);
    }
	/**
     * 以原子方式将当前值递增 1。
     * @return 之前的值
     */
    public final int getAndIncrement() {
        return unsafe.getAndAddInt(this, valueOffset, 1);
    }
    /**
     * 以原子方式将当前值递减 1。
     * @return 之前的值
     */
    public final int getAndDecrement() {
        return unsafe.getAndAddInt(this, valueOffset, -1);
    }
	/**
     * 以原子方式将给定值添加到当前值。
     * @param delta 要添加的值
     * @return 之前的值
     */
    public final int getAndAdd(int delta) {
        return unsafe.getAndAddInt(this, valueOffset, delta);
    }
    /**
     * 以原子方式将当前值递增 1。
     * @return 更新后的值
     */
    public final int incrementAndGet() {
        return unsafe.getAndAddInt(this, valueOffset, 1) + 1;
    }
	/**
     * 以原子方式将当前值递减 1。
     * @return 更新后的值
     */
    public final int decrementAndGet() {
        return unsafe.getAndAddInt(this, valueOffset, -1) - 1;
    }
	/**
     * 以原子方式将给定值与当前值相加.
     * @param delta 要添加的值
     * @return 更新后的值
     */
    public final int addAndGet(int delta) {
        return unsafe.getAndAddInt(this, valueOffset, delta) + delta;
    }
```

<br/>

### <span id="t33">addAndGet 详解</span>

抽一个来深入理解下。

首先，看下 `unsafe.getAndAddInt` 方法的源码：

```java
public final int getAndAddInt(Object var1, long var2, int var4) {
    int var5;
    do {
        var5 = this.getIntVolatile(var1, var2);
    } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));
    return var5;
}

public final native boolean compareAndSwapInt(Object var1, long var2, int var4, int var5);
```

以上代码中，各参数表示：

- `var1` ：当前对象本身，用于比较的对象
- `var2` ：偏移量，相当于引用地址。可以用于比较主内存中，值有没有变化，是不是和当前线程内的值相同。
- `var4` ：需要变动的数量。
- `var5` ：通过 `var1` 和 `var2` 获得的真实主内存中的值。

貌似也不难理解是吧，毕竟也就两行代码。。。。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/XIKOEQKFKLOO3UE00.jpg)

比较简单，图也就不画了，简单写下步骤：

> 1. 先根据 `对象var1` 和 `地址var2` ，获取内存中的 `真实值var5`
> 2. 比较 `真实值var5` 和 `对象自身值var1.value` ，如果相同，那就替换为 `真实值加变化量var5+var4`
> 3. 如果不同，**因为  `对象自身值var1.value` 是用 `volatile` 修饰的，所以 `主内存真实值var5` 变化对 `对象var1` 是可见的。**
> 4. 继续循环比较，直到相同并替换完成。
> 5. 替换完成后，主内存的值替换为 `var5+var4` ， `unsafe.getAndAddInt` 仅返回了 `var5` ，所以 `addAndGet` 需要再加上 `var4` 。



<br/>

### <span id="t34">解决 ABA 问题</span>

在介绍 `AtomicStampedReference` 之前，我们先来看下 `AtomicReference` 原子引用的用法。

#### AtomicReference

其实也很简单。。。直接给个例子：

```java
@Data
@AllArgsConstructor
public class User {
    private String id;
    private String name;
}
```

```java
public static void main(String[] args) {
    User shiva = new User("1", "shiva");
    User show = new User("1", "show");

    AtomicReference<User> atomicReference = new AtomicReference<>();
    atomicReference.set(shiva);
    boolean booleanFirst = atomicReference.compareAndSet(shiva, show);
    System.out.println("第一次比较替换结果: " + booleanFirst + ", 当前原子引用的对象为： " + atomicReference.get());
    boolean booleanSecond = atomicReference.compareAndSet(shiva, show);
    System.out.println("第二次比较替换结果: " + booleanSecond + ", 当前原子引用的对象为： " + atomicReference.get());
}
```

运行结果：

```
第一次比较替换结果: true, 当前原子引用的对象为： User(id=1, name=show)
第二次比较替换结果: false, 当前原子引用的对象为： User(id=1, name=show)
```

就不深入介绍了，没啥区别。。。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/unc/QQ图片20210605151038.jpg)

#### AtomicStampedReference

剩下就是最后的， **AtomicStampedReference** 类了。

`AtomicStampedReference` 主要维护包含一个对象引用以及一个可以自动更新的整数"stamp"的 pair 对象来解决ABA问题。

```java
public class AtomicStampedReference<V> {
    private static class Pair<T> {
        final T reference;  //维护对象引用
        final int stamp;  //用于标志版本
        private Pair(T reference, int stamp) {
            this.reference = reference;
            this.stamp = stamp;
        }
        static <T> Pair<T> of(T reference, int stamp) {
            return new Pair<T>(reference, stamp);
        }
    }
    private volatile Pair<V> pair;
    ....
    
    /**
      * expectedReference ：更新之前的原始值
      * newReference : 将要更新的新值
      * expectedStamp : 期待更新的标志版本
      * newStamp : 将要更新的标志版本
      */
    public boolean compareAndSet(V   expectedReference,
                             V   newReference,
                             int expectedStamp,
                             int newStamp) {
        // 获取当前的(元素值，版本号)对
        Pair<V> current = pair;
        return
            // 引用没变
            expectedReference == current.reference &&
            // 版本号没变
            expectedStamp == current.stamp &&
            // 新引用等于旧引用
            ((newReference == current.reference &&
            // 新版本号等于旧版本号
            newStamp == current.stamp) ||
            // 构造新的Pair对象并CAS更新
            casPair(current, Pair.of(newReference, newStamp)));
    }

    private boolean casPair(Pair<V> cmp, Pair<V> val) {
        // 调用Unsafe的compareAndSwapObject()方法CAS更新pair的引用为新引用
        return UNSAFE.compareAndSwapObject(this, pairOffset, cmp, val);
    }
```

- 如果元素值和版本号都没有变化，并且和新的也相同，返回true；
- 如果元素值和版本号都没有变化，并且和新的不完全相同，就构造一个新的Pair对象并执行CAS更新pair。

可以看到，java中的实现跟我们上面讲的ABA的解决方法是一致的。

- 首先，使用版本号控制；
- 其次，不重复使用节点(Pair)的引用，每次都新建一个新的Pair来作为CAS比较的对象，而不是复用旧的；
- 最后，外部传入元素值及版本号，而不是节点(Pair)的引用。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/2081819717411807754026gp0.jpg)

```java
public static void main(String[] args) {
    //初始值：1，版本：0
    AtomicStampedReference<Integer> asr = new AtomicStampedReference<>(1, 0);

    Thread main = new Thread(() -> {
        System.out.println("操作线程" + Thread.currentThread() + ",初始值 a = " + asr.getReference() + "， 版本=" + asr.getStamp());
        int stamp = asr.getStamp(); //获取当前标识别
        try {
            Thread.sleep(1000); //等待1秒 ，以便让干扰线程执行
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        //此时expectedReference未发生改变，但是stamp已经被修改了,所以CAS失败
        boolean isCASSuccess = asr.compareAndSet(1, 2, stamp, stamp + 1);
        System.out.println("操作线程" + Thread.currentThread() + ", CAS 操作结果: " + isCASSuccess + "， 版本=" + asr.getStamp());
    }, "主操作线程");

    Thread other = new Thread(() -> {
        // 让出资源，让其他线程优先执行
        Thread.yield();
        asr.compareAndSet(1, 2, asr.getStamp(), asr.getStamp() + 1);
        System.out.println("操作线程" + Thread.currentThread() + ", [increment]操作，值=" + asr.getReference() + "， 版本=" + asr.getStamp());
        asr.compareAndSet(2, 1, asr.getStamp(), asr.getStamp() + 1);
        System.out.println("操作线程" + Thread.currentThread() + ", [decrement]操作，值=" + asr.getReference() + "， 版本=" + asr.getStamp());
    }, "干扰线程");

    main.start();
    other.start();
}
```

运行结果：

```
操作线程Thread[主操作线程,5,main],初始值 a = 1， 版本=0
操作线程Thread[干扰线程,5,main], [increment]操作，值=2， 版本=1
操作线程Thread[干扰线程,5,main], [decrement]操作，值=1， 版本=2
操作线程Thread[主操作线程,5,main], CAS 操作结果: false， 版本=2
```

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/QQ图片20210605155047.jpg)

<br/>

## <span id="te">参考文章</span>

<a href="" target="_blank"></a>

<a href="https://www.bilibili.com/video/BV1pJ411M7mb?p=12" target="_blank">https://www.bilibili.com/video/BV1pJ411M7mb?p=12</a>

<a href="https://www.pdai.tech/md/java/thread/java-thread-x-juc-AtomicInteger.html" target="_blank">JUC原子类: CAS, Unsafe和原子类详解 | Java 全栈知识体系 (pdai.tech)</a>

<a href="https://blog.csdn.net/ls5718/article/details/52563959" target="_blank">Java中CAS详解_jayxu无捷之径的博客-CSDN博客_cas</a>

<a href="https://tech.meituan.com/2019/02/14/talk-about-java-magic-class-unsafe.html" target="_blank">Java魔法类：Unsafe应用解析 - 美团技术团队 (meituan.com)</a>

<a href="https://blog.csdn.net/blogs_broadcast/article/details/80672515" target="_blank">关于在AtomicInteger的static块中unsafe.objectFieldOffset干什么用的简介</a>
