<div class="catalog">

- [概述](#t1)
- [堆的简单介绍](#t11)
- [PriorityQueue构造方法](#t2)
- [PriorityQueue的常用方法](#t3)
    - [add(E e) 和 offer(E e)](#t31)
    - [poll()](#t32)
    - [grow() 扩容](#t33)
- [使用建议](#t4)
- [参考文章](#te)


</div>



### <span id="t1">概述</span>

阅读 Java 版本为 **1.8.0.25**。

**PriorityQueue** 即优先队列，也是一个非常重要的队列实现形式，通过堆实现。

**优先队列的作用是能保证每次取出的元素都是队列中权值最小的**(Java的优先队列每次取最小元素)。这里牵涉到了大小关系，**元素大小的评判可以通过元素本身的自然顺序(natural ordering)，也可以通过构造时传入的比较器**(*Comparator*)。

然后说下，在排序算法中，有一个高效并且消耗内存少的排序方法 -- 堆排序。堆排序算法应该是网上到处都是，可以自行百度。

还是和以前一样，将 **PriorityQueue** 源码以及相关类拷贝至自定义包内，进行注释添加，代码请移步：<br>
<a href="https://github.com/qianwei4712/test-demos/blob/master/collection-sources/src/main/java/prioityqueuesorces/PriorityQueue.java" target="_blank">https://github.com/qianwei4712/test-demos/blob/master/collection-sources/src/main/java/prioityqueuesorces/PriorityQueue.java</a>

知识点总结如下：

<img src="@/assets/blog/img/collections/PriorityQueueSource1.png"/>

<img src="@/assets/blog/img/collections/PriorityQueueSource2.png"/>

<br>

### <span id="t11">堆的简单介绍</span>

堆有2个概念：第一个是内存里面的堆，也就是静态链表；第二个堆是数据结构里的 **二叉堆BinaryHeap**，JDK 里表现为 **PriorityQueue** 优先队列  。

Java 中 *PriorityQueue* 通过堆实现，具体说是通过完全二叉树(*complete binary tree*)实现的**小顶堆** ，然后是最小堆的定义：

1. 是一个完全二叉树
2. 任意节点的值小于等于左右两个孩子的值（如果有）
3. 任意非叶子节点的左右子树也都是堆

堆的下标关系：

1. 根节点下标为0
2. 若节点 P 的下标为 i，则左孩子为 2i+1，右孩子为 2i+2
3. 若节点 P 的下标为 i，则父节点的下标为 (i-1)/2

堆是一个典型的，<span style="color:red;">**用物理上线性表示逻辑上非线性的数据结构**</span> ，例如下面这个例子的下标排列顺序

<img src="@/assets/blog/img/collections/PriorityQueueSource3.png"/>

<br>

### <span id="t2">PriorityQueue构造方法</span>

PriorityQueue 底层字段如下，经有4个字段，底层基于数组实现。

modCount 字段在 ArrayList 中做了详细解释，原本是 AbstractList 的 protected 字段。不过 PriorityQueue 没继承，就定义了一个，用于线程不安全情况下的快速失败判断机制。

```java
    //底层使用数组实现
    transient Object[] queue; // 非私有以简化嵌套类访问
    //优先队列元素个数
    private int size = 0;
    //优先队列比较器，如果为null,优先队列使用元素的自然顺序。
    private final Comparator<? super E> comparator;
    //修改次数，fast-fail机制，因为没有继承 AbstractList，所以需要自行定义。
    transient int modCount = 0;
```



PriorityQueue 静态常量如下：

```java
    //默认初始容量
    private static final int DEFAULT_INITIAL_CAPACITY = 11;
    //数组最大容量，实际值为2^31-1-8，超出会爆OutOfMemoryError。
    //数组除了存放数据外，还有一个length属性，减8为了存放数组长度
    private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;
```



PriorityQueue 的构造方法是我目前知道的最多的，有7个构造方法。。

因为 PriorityQueue 我基本没用过。。只能凭个人感觉哪些构造方法比较重要贴下了。

```java
    //无参构造器，默认数组长度 11；无比较器，元素按照顺序排序
    public PriorityQueue() {
        this(DEFAULT_INITIAL_CAPACITY, null);
    }
    
    //指定长度，没有比较器的构造函数，元素按照顺序排序
    public PriorityQueue(int initialCapacity) {
        this(initialCapacity, null);
    }

    //创建一个带有比较器的优先队列，其元素根据比较器进行排序。默认长度 11
    public PriorityQueue(Comparator<? super E> comparator) {
        this(DEFAULT_INITIAL_CAPACITY, comparator);
    }

    //指定初始化长度和比较器的构造器，其元素根据比较器进行排序
    public PriorityQueue(int initialCapacity, Comparator<? super E> comparator) {
        //如果参数长度是 1，抛出异常。。
        if (initialCapacity < 1)
            throw new IllegalArgumentException();
        this.queue = new Object[initialCapacity];
        this.comparator = comparator;
    }
```

<span style="color:red;">**无参构造器，默认数组长度 11**</span>

上面这套构造方法是基础的根据参数来构造对象。然后是根据其他 Collection 类创建

```java
    //根据 Collection集合 创建优先队列
    @SuppressWarnings("unchecked")
    public PriorityQueue(Collection<? extends E> c) {
        if (c instanceof SortedSet<?>) {
            //如果原始 collection 类型是 SortedSet的实现类
            //直接赋值 SortedSet 的比较器，再初始化数组
            SortedSet<? extends E> ss = (SortedSet<? extends E>) c;
            this.comparator = (Comparator<? super E>) ss.comparator();
            //直接初始化有序集合
            initElementsFromCollection(ss);
        }
        else if (c instanceof PriorityQueue<?>) {
            //如果原始 collection 类型是 PriorityQueue，同一类型的初始化就比较简单了
            PriorityQueue<? extends E> pq = (PriorityQueue<? extends E>) c;
            this.comparator = (Comparator<? super E>) pq.comparator();
            //初始化同类型队列
            initFromPriorityQueue(pq);
        }
        else {
            //正常的 Collection，没有比较器，默认为一个顺序容器
            this.comparator = null;
            //没有比较器，不需要进行排序，默认顺序容器，并将数组转化为堆
            initFromCollection(c);
        }
    }
```

**SortedSet** 是一个自动排序不重复的 Collection 集合，接口设计要求实现一个 **comparator** 比较器，和优先队列 PriorityQueue 一样，所以构造方法中特对 **SortedSet** 地进行了判断。

构造方法中的几个调用细节在下面 具体操作时候再讲，包括堆排序，其实感觉根据有序集合构造的情况应该不多。。。



<br>

### <span id="t3">PriorityQueue的常用方法</span>

PriorityQueue 是一个队列，队列的方法以前介绍过，不过 PriorityQueue 不是一个正常的先进先出队列。

<br>

#### <span id="t31">add(E e) 和 offer(E e)</span>

先看看添加元素方法的代码：

```java
    //将指定的元素插入此优先队列
    public boolean add(E e) {
        return offer(e);
    }

    //将指定的元素插入此优先队列
    public boolean offer(E e) {
        //不允许插入 null
        if (e == null)
            throw new NullPointerException();
        //队列操作数+1
        modCount++;
        //当前队列元素
        int i = size;
        //如果当前队列元素个数大于等于数组长度
        //数组已经填充满了，进行扩容
        if (i >= queue.length)
            grow(i + 1);
        //队列元素个数+1
        size = i + 1;
        if (i == 0)
            //如果原队列是空队列
            queue[0] = e;
        else
            //根据元素进行筛选
            siftUp(i, e);
        return true;
    }
```

首先这里可以看出

<span style="color:red;">**PriorityQueue 不允许添加 null。**</span>

然后就是，空队列第一个元素位置是 queue[0] 位置。然后是元素筛选的逻辑：

```java
    /**
     * 将项目x插入位置k，通过将x提升到树上直到其大于或等于其父级或成为根，从而保持堆不变。
     * 简化并加快强制和比较。将自然比较和比较器比较分为不同的方法，这些方法在其他方面相同。
     * @param k 需要插入的位置
     * @param x 需要加入的元素
     */
    private void siftUp(int k, E x) {
        if (comparator != null)
            siftUpUsingComparator(k, x);
        else
            siftUpComparable(k, x);
    }
```

然后再看自然比较，就是使用存储对象自带的比较器

```java
    //没有比较器，使用自然比较
    @SuppressWarnings("unchecked")
    private void siftUpComparable(int k, E x) {
        //将需要比较的元素转为 Comparable
        Comparable<? super E> key = (Comparable<? super E>) x;
        //如果插入下标大于0
        //如果是根结点那就不需要重新筛选了。只有一个元素
        while (k > 0) {
            //根据堆的特性获得父节点的下标，(i-1)/2
            int parent = (k - 1) >>> 1;
            //获得父节点元素
            Object e = queue[parent];
            //比较器比较，如果符合父节点小于等于插入元素则跳出
            if (key.compareTo((E) e) >= 0)
                break;
            //否则将父节点放置到原插入位置，并继续循环
            queue[k] = e;
            k = parent;
        }
        //循环结束，确定位置
        queue[k] = key;
    }
```

然后这里看下第一句强转

```java
 Comparable<? super E> key = (Comparable<? super E>) x;
```

不是所有对象都可以强转的。。。。

我们在写 demo 的时候习惯性得使用 **Integer，String** 这些类，这些类都已经实现了 Comparable 接口；

<span style="color:red;">**但是如果要比较自定义类，那该类必须实现 Comparable 接口。**</span>

siftUpUsingComparator 使用优先队列的比较器也是相同原理，就不写了。

。。。。哦，然后再把刚刚插入元素的图解放一哈

<img src="@/assets/blog/img/collections/PriorityQueueSource4.png"/>


<br>

#### <span id="t32">poll()</span>

弹出队列头元素，优先队列虽然是单向的，但是已经不是简单的先进先出了。。

在 add 方法中已经介绍，添加时会重新排序，所以弹出时也是按比较排序后结果输出。

```java
    //弹出队列头元素
    @SuppressWarnings("unchecked")
    public E poll() {
        //当队列为空时，返回null
        if (size == 0)
            return null;
        //队列元素-1
        int s = --size;
        //操作次数+1
        modCount++;
        //获得队列头元素
        E result = (E) queue[0];
        //获得队列尾元素
        E x = (E) queue[s];
        //将队尾置空，因为队头空了，要往前移动重新筛选
        queue[s] = null;
        //如果弹出后队列长度不是0，那需要重新排序
        if (s != 0)
            //将队尾元素放到队头，然后一层层往下移动
            siftDown(0, x);
        //排序后返回队头元素
        return result;
    }

```

然后这里主要是重新排序方法

```java
    /**
     * 在位置 k 插入项 x，通过反复将 x 降级到树上小于或等于其子级或为叶子，从而保持堆不变。
     * 简化并加快强制和比较。将自然比较和比较器比较分为不同的方法，这些方法在其他方面相同。
     * @param k 需要填补的位置
     * @param x 需要插入的元素
     */
    private void siftDown(int k, E x) {
        if (comparator != null)
            siftDownUsingComparator(k, x);
        else
            siftDownComparable(k, x);
    }

    //使用自然比较筛选
    @SuppressWarnings("unchecked")
    private void siftDownComparable(int k, E x) {
        //将需要插入的元素转为 Comparable
        Comparable<? super E> key = (Comparable<? super E>)x;
        //长度除以二，需要循环的次数
        int half = size >>> 1;        // loop while a non-leaf
        while (k < half) {
            //左孩子的下标
            int child = (k << 1) + 1;
            //获得左孩子
            Object c = queue[child];
            //获得右孩子的下标
            int right = child + 1;
            //条件1：右孩子不是空的
            //条件2：左孩子比右孩子大
            if (right < size &&
                    ((Comparable<? super E>) c).compareTo((E) queue[right]) > 0)
                //将选用对象改为右孩子
                //原则是选择左右孩子中更小的那个进行交换
                c = queue[child = right];
            //如果需要插入的元素已经比孩子小，那就跳出
            if (key.compareTo((E) c) <= 0)
                break;
            //否则就将子节点放置到要插入的位置，继续循环
            queue[k] = c;
            k = child;
        }
        //循环结束，确定位置
        queue[k] = key;
    }
```

基本逻辑和添加方法是一样的，只是添加方法是将元素从最底层往上移动，弹出方法是将指定元素从最上层往下移动。

<img src="@/assets/blog/img/collections/PriorityQueueSource5.png"/>



<br>

#### <span id="t33">grow() 扩容</span>

然后再看下 add() 方法中出现的扩容方法，数组底层，扩容问题肯定是绕不开的。。。这个涉及到增删的效率。

```java
    //如果当前队列元素个数大于等于数组长度
    //数组已经填充满了，进行扩容
    if (i >= queue.length)
        grow(i + 1);
```

首先可以看到，在 add() 方法中扩容的判断，当数组填充满才会扩容，并且传入参数是长度+1；

```java
    //扩容数组
    private void grow(int minCapacity) {
        //拿到旧长度
        int oldCapacity = queue.length;
        // Double size if small; else grow by 50%
        //原长度x小于64，就扩容为 2x+2
        //原长度x大于等于64，扩容为 1.5倍，扩容一半
        int newCapacity = oldCapacity + ((oldCapacity < 64) ?
                (oldCapacity + 2) :
                (oldCapacity >> 1));
        // 有溢出意识的代码
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            //获得最大长度，参数 minCapacity = oldCapacity + 1
            newCapacity = hugeCapacity(minCapacity);
        //复制数组
        queue = Arrays.copyOf(queue, newCapacity);
    }

    //最大容量方法；minCapacity = oldCapacity + 1
    private static int hugeCapacity(int minCapacity) {
        //超出integer变为负数，抛出异常
        if (minCapacity < 0)
            throw new OutOfMemoryError();
        return (minCapacity > MAX_ARRAY_SIZE) ?
                Integer.MAX_VALUE :
                MAX_ARRAY_SIZE;
    }
```

老生常谈的问题了，而且似乎也没啥实际用处：

- 原长度 x 小于64，就扩容为 2x+2
- 原长度 x 大于等于64，扩容为 1.5倍，扩容一半
- 最小扩容长度（minCapacity）= 原长度（oldCapacity）+ 1，这是扩容方法调用是传入的参数
- 若按倍率扩容长度超出最大长度，需要用最小扩容长度进行判断





<br>

### <span id="t4">使用建议</span>

首先看看复杂度：

- 堆排序的平均时间复杂度为O(nlogn),最坏情况也是O(nlogn)，快排的平均时间复杂度也是O(nlogn)，但是最坏情况是O(n²)。
- 堆排序是O(1)，快排是O(logn)。快排是递归调用，所以空间要求更多一些。

使用场景举例：

1. 大数据量的筛选：求一亿个数字里面最小的10个数字
2. 业务系统，优先处理 VIP客户 再处理 普通客户，需要自定义比较器。

<br>

### <span id="te">参考文章</span>

<a href="https://www.pdai.tech/md/java/collection/java-collection-PriorityQueue.html" target="_blank">https://www.pdai.tech/md/java/collection/java-collection-PriorityQueue.html</a>

<a href="https://www.bilibili.com/video/BV1bW411j7jP?t=178" target="_blank">https://www.bilibili.com/video/BV1bW411j7jP?t=178</a>

<a href="https://www.jianshu.com/p/b1582c3a1296" target="_blank">https://www.jianshu.com/p/b1582c3a1296</a>



