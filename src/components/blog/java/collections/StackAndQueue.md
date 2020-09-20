

<div class="catalog">

- [前言](#t1)
- [Stack](#t2)
- [Queue & Deque](#t3)
- [ArrayDeque](#t4)
  - [构造方法](#t41)
  - [ArrayDeque特点](#t42)
- [参考文章](#te)


</div>


### <span id="t1">前言</span>

阅读 Java 版本为 **1.8.0.25**。

**栈（Stack）** 和 **队列（Queue）** 应该是大家非常熟悉的数据结构了。

Java 中有 **栈（Stack）** 的具体类， **队列（Queue）** 只定义了接口，当然所有实现了这个接口的类都可以当作一个队列使用。

首先是最基本的定义：

> 栈（stack ），一种遵循先进后出（FILO—First-In/Last-Out）原则的线性存储结构。
>
> 队列（queue），一种遵循先进先出（FIFO—first in first out）原则的线性存储结构。

栈和队列的实现方式也是不止一种，主要有：顺序存储结构（数组底层）和链式存储结构（链表）。主要区别就是元素在实际物理空间的存放位置，**也就是内存是否连续**。



![avatar](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/%E7%84%B6%E8%80%8C.jpg) 



> **栈（Stack）** 这个类继承自 **Vector** ，底层用数组实现，是 JDK1.0 时代的产物，官方已经不推荐使用了。
>
> **队列（Queue）** 的话，JDK1.6 开始声明了 **Deque（double ended queue ）双向队列接口** ，**双向队列同时具备栈和队列的功能。**

所以现在选择在 java 中使用 *栈和队列* 的话，推荐选择实现了 *Deque* 的

- <span style="color: red; ">首选是 **ArrayDeque** ，其次是 **LinkedList** ，当然这两个都不是线程安全的。</span>

- 对于线程安全的需求，JDK 提供了 **BlockingQueue** 阻塞队列以及双向队列，这也是一个非常重要的接口。（本文不介绍，重新开一篇。）


然后，选择 **ArrayDeque** 的具体原因后面详细介绍。



学习方式为，将源码以及相关类拷贝至自定义包内，进行注释添加，代码请移步：<br>
<a href="https://gitee.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/ArrayDeque.java" target="_blank">https://gitee.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/ArrayDeque.java</a>

其中包含了 *Stack、Queue、Deque、ArrayDeque* 类或接口的注释。



<br>

### <span id="t2">Stack</span>

刚刚已经提到，**栈（Stack）** 这个类继承自 **Vector** ，底层用数组实现。

可以参考本站 **Java集合知识体系 - Vector 源码分析** 。


因为 **Vector** 在方法上添加了 **synchronized** ，以达到线程安全的目的，不过 JVM 级别的 **synchronized** 特别消耗资源，已不被 Java 官方推荐使用。

所以继承自它的 Stack 更不可能被推荐使用。并且 Stack 代码很少，底层有兴趣转 Vector 源码解读吧，包括它的扩容，构造等。

Stack 的方法：

| 方法名 | 返回类型 |                           说明                           |
| :----: | :------: | :------------------------------------------------------: |
| empty  | boolean  |                       判断是否为空                       |
|  peek  |    E     |    只返回栈顶端的元素，不弹出该元素（空栈会抛出异常）    |
|  pop   |    E     |                      弹出栈顶的元素                      |
|  push  |    E     |                   将元素压入栈，并返回                   |
| search |   int    | 返回最靠近顶端的目标元素到顶端的距离（调用 lastIndexOf） |



<img src="@/assets/blog/img/collections/StackAndQueue1.png"/>



<br>

### <span id="t3">Queue & Deque</span>

java 中 **Queue（单向队列）** 是个接口，设计了队列基础方法，实际代码要看实现类。

**Deque（双向队列）** 继承 **Queue** 在原有队列方法基础上，增加反向队列方法，也设计了栈的基础方法。

所以，我一般都是使用双向队列实现类的，毕竟有一个类能实现两个效果，多省事。。。。。

java中最常见的队列是 LinkedList ，底层用链表实现，顺便打个广告，有兴趣可以看看我以前写的 linkedList 的源码


可以参考本站 **Java集合知识体系 - LinkedList 源码分析** 。


<img src="@/assets/blog/img/collections/StackAndQueue2.png"/>



接口官方注释中，要求了一些抛出异常的情形，不是每个接口都有这四个约束，具体请自行查阅 JDK：

- 若违反容量限制，抛出 IllegalStateException
- 若传入的类型和泛型不兼容，抛出 ClassCastException
- 如果指定元素为 null，并且这个队列不允许为 null，抛出 NullPointerException
- 若传入元素的某些属性阻止压入，那么抛出 IllegalArgumentException



**Queue（单向队列）** 基础方法：

| 功能 |                           异常系列                           |                          增强系列                          |
| :--: | :----------------------------------------------------------: | :--------------------------------------------------------: |
| 添加 | boolean add(E e)<br>队尾添加元素，超出抛出IllegalStateException |     boolean offer(E e)<br>队尾添加元素，超出返回false      |
| 移除 | E remove()<br>移除队头元素并返回，如果队列为空抛出NoSuchElementException |    E poll()<br>移除队头元素并返回，如果队列为空返回null    |
| 获得 | E element()<br>返回队头元素，但是不删除，如果队列为空抛出NoSuchElementException | E peek()<br>返回队头元素，但是不删除，如果队列为空返回null |

Queue的接口区别不难理解，虽然不知道为啥要分成两类。。。


<br>


**Deque（双向队列）** 除了上面的方法外，还增加了栈的方法、collection方法（就不介绍了）和双向队列方法：

|                             功能                             |          正向方法（队头开始）           |          逆向方法（队尾开始）          |
| :----------------------------------------------------------: | :-------------------------------------: | :------------------------------------: |
|           添加元素，超出抛出IllegalStateException            |           void addFirst(E e)            |           void addLast(E e)            |
|                   添加元素，超出返回false                    |         boolean offerFirst(E e)         |         boolean offerLast(E e)         |
|    移除元素并返回，如果队列为空抛出NoSuchElementException    |             E removeFirst()             |             E removeLast()             |
|             移除元素并返回，如果队列为空返回null             |              E pollFirst()              |              E pollLast()              |
| 获得元素，但是不删除，如果队列为空抛出NoSuchElementException |              E getFirst()               |              E getLast()               |
|          返回元素，但是不删除，如果队列为空返回null          |              E peekFirst()              |              E peekLast()              |
|                 删除第一个相同元素，依次检索                 | boolean removeFirstOccurrence(Object o) | boolean removeLastOccurrence(Object o) |

因为只是接口，也没有太多代码细节，下面通过 **ArrayDeque** 实际代码来讲解。





<br>

### <span id="t4">ArrayDeque</span>



JDK 1.8 官方注释第一段写了：

> **ArrayDeque当用作栈时，此类可能比 Stack 快，而用作队列时，则比 LinkedList 要快。**

所以这个类就是这么好用。。。。

<img src="@/assets/blog/img/collections/StackAndQueue3.png"/>


从继承关系图，发现 ArrayDeque 没有实现 List 接口。

<img src="@/assets/blog/img/collections/StackAndQueue4.png"/>



#### <span id="t41">构造方法</span>

arrayDeque 有三个字段

```java
    //底层数组实现，容量就是队列长度
    transient Object[] elements;
    //队列头的索引
    transient int head;
    //将被添加的元素的位置索引，队列尾指针
    transient int tail;
```

构造方法如下：

```java
    //无参构造默认长度 16
    public ArrayDeque() {
        elements = new Object[16];
    }
    //指定容量的构造器
    //因为要求数组长度必须是 2的幂，所以需要对传入的长度进行计算
    public ArrayDeque(int numElements) {
        allocateElements(numElements);
    }
```

这里主要的运算在 `allocateElements` 方法，位运算结果是确定的，虽然不知道为啥。。。

```java
    //如果传入参数大于等于8，计算比传入参数大的最小的 2的幂
    //传入1，得到8；传入8，得到16；传入17，得到32
    private void allocateElements(int numElements) {
        //最小长度 8
        int initialCapacity = MIN_INITIAL_CAPACITY;
        //如果传入的指定长度大于等于 8，计算数组大小
        //算法利用或运算和右移运算，计算结果始终为2的n次方。。。
        if (numElements >= initialCapacity) {
            initialCapacity = numElements;
            initialCapacity |= (initialCapacity >>>  1);
            initialCapacity |= (initialCapacity >>>  2);
            initialCapacity |= (initialCapacity >>>  4);
            initialCapacity |= (initialCapacity >>>  8);
            initialCapacity |= (initialCapacity >>> 16);
            initialCapacity++;
            //如果超出int最大长度2^31-1，需要缩短长度
            if (initialCapacity < 0)
                //缩小为 2^30
                initialCapacity >>>= 1;
        }
        elements = new Object[initialCapacity];
    }
```

这个方法乍一看是不是有点懵？

![avatar](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/sad20200408181541.png) 

现在对方法中的几个右移距举例解释，假设初始值为二进制 `1XXX XXXX XXXX` ，

1. 第一次右移1位后用0补上空位，`01XX XXXX XXXX` ，然后进行 **或运算** 得 `11XX XXXX XXXX`
2. 第二次右移2位，`0011 XXXX XXXX` ，**或运算** 得 `1111 XXXX XXXX`
3. 第三次右移4位运算得 `1111 1111 XXXX`
4. .........因为 **initialCapacity** 的类型是 **int** ，用二进制补码表示数值，最大值是 `2^31 - 1` 或者 `0x7fffffff` ，二进制表示为32位，所以最后一次右移16位后可以补满32位
5. 然后 **initialCapacity++** ，从 `1111 1111 1111` 进位为 `1 0000 0000 0000` 变成 `2^12` 这样2的12次幂。。。
6. 如果 **initialCapacity++** 前，已经是 **int** 最大值，那么实际值超出 **int** 最大值，变为 **int** 最小值 `-2^31`  或者 `0x80000000` 。因为小于0，所以右移一位变成  `2^30`  或者 `0x40000000` 。

<span style="color: red; "> **所以 ArrayDeque 最大初始化长度为 2^30 。** </span>


有一句说一句，这种东西真的一点都不好玩，看懂了以后用不到，也写不出来。。。。只能来装装B。。。 。还是装的低级B

![avatar](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/%E9%A9%AC%E4%BA%91%EF%BC%9A%E6%88%91%E5%B0%B1%E8%BF%99%E6%A0%B7%E9%9D%99%E9%9D%99%E5%BE%97%E7%9C%8B%E7%9D%80%E4%BD%A0%E8%A3%85%E9%80%BC.jpeg) 



<br>

#### <span id="t42">ArrayDeque特点</span>

具体的使用上，也就是符合 *栈和双向队列* 的特点，代码实现上和 ArrayList 没太大差别，不会过多得讲解。

这一部分会介绍下和其他 Collection 类不同的地方。

<br>

**一. ArrayDeque内部实现**

首先看下最基础的队列头添加元素 **addFirst** 和队列尾添加元素 **addLast** 方法：

```java
    //队列头部添加元素
    public void addFirst(E e) {
        //不允许null
        if (e == null)
            throw new NullPointerException();
        //在头部插入数据，头指针向左移动，每次调用addFirst，head减一
        elements[head = (head - 1) & (elements.length - 1)] = e;
        //如果队列头索引和将被添加的位置索引相同，进行扩容
        if (head == tail)
            doubleCapacity();
    }

    //队列尾部添加元素
    public void addLast(E e) {
        if (e == null)
            throw new NullPointerException();
        //先将元素加入数组
        elements[tail] = e;
        //将tail加1，然后再判断是否和头指针索引相同，若相同则扩容
        if ( (tail = (tail + 1) & (elements.length - 1)) == head)
            doubleCapacity();
    }
```

所有的添加元素方法都进行了 null 判断，不允许添加 null。。。

> <span style="color: red; "> **ArrayDeque 是不允许添加 null 的** </span>



然后接着讲内部实现方式，先看看下面两个计算公式，它们的作用其实就是 `head减一` 和 `tail加一` 。

> **head = (head - 1) & (elements.length - 1)**
>
> **tail = (tail + 1) & (elements.length - 1)**

上面已经解释过 **elements.length 必定是 2的幂** 。所以 elements.length-1 的值就是 `... 0000 1111 .... 1111` 低位全是 1。

1. head 初始值为 0，head - 1 = -1 ，就是 `0xffffffff` ，进行与计算结果 `elements.length-1` 的值。
2. 然后 head 为正整数，减一后进行与计算还是本身。

tail 和 head 相同，所以实际上这两个索引是相互靠近的



<img src="@/assets/blog/img/collections/StackAndQueue5.png"/>



比如 **addLast、addFirst** 各调用2次就是上图这样的索引。

所以其实，**ArrayDeque 相当于一个环形数组** 。



<br>

**二. 双倍扩容的实现方式**

上面的添加方法中就有扩容方法 **doubleCapacity()** ，看名字就知道，这是一个双倍扩容。

而且这个方法的触发条件是： **head == tail** ，相当于数组填满的时候才进行扩容

```java
    //双倍扩容，仅在数组填充满的时候扩容
    private void doubleCapacity() {
        //断言：数组已经填满了
        assert head == tail;
        //记录队列头索引
        int p = head;
        //记录队列长度
        int n = elements.length;
        //队列头到数组结尾的元素个数，0---队列尾---null---队列头---数组尾
        int r = n - p;
        //左移1位相当于乘以2，双倍长度
        int newCapacity = n << 1;
        //若超度超出int最大值，抛出异常，所以最大长度 2^30
        if (newCapacity < 0)
            throw new IllegalStateException("Sorry, deque too big");
        //新建数组
        Object[] a = new Object[newCapacity];
        //将p开始往右的元素赋值到新数组
        System.arraycopy(elements, p, a, 0, r);
        //将0到p（因为原数组已填满）的元素复制到新数组
        System.arraycopy(elements, 0, a, r, p);
        elements = a;
        //重新定义新head和tail
        head = 0;
        tail = n;
    }
```

根据扩容的实际情况可以得到：

> <span style="color: red; "> **ArrayDeque 的最大长度为 2^30** 。</span>

扩容前后的数组如下图：


<img src="@/assets/blog/img/collections/StackAndQueue6.png"/>


**若新数组又在队列头加元素，就和初始化数组相同，head 指向数组尾。**




<br>

### <span id="te">参考文章</span>


<a href="https://www.pdai.tech/md/java/collection/java-collection-Queue&Stack.html" target="_blank">https://www.pdai.tech/md/java/collection/java-collection-Queue&Stack.html</a>

<a href="https://www.cnblogs.com/cosmos-wong/p/11845934.html" target="_blank">https://www.cnblogs.com/cosmos-wong/p/11845934.html</a>

<a href="https://blog.csdn.net/shida_csdn/article/details/81413052" target="_blank">https://blog.csdn.net/shida_csdn/article/details/81413052</a>













