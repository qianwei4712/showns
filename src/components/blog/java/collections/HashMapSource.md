<div class="catalog">

- [前言](#t0)
- [Map 接口](#t1)
- [HashMap 继承关系](#t2)
- [HashMap 构造方法](#t3)
- [HashMap 主要方法和特点](#t4)
  - [hash 算法](#t40)
  - [resize 哈希表初始化和扩容](#t41)
  - [put 添加元素流程](#t42)
  - [链表如何转为红黑树](#t43)
  - [get 获取流程](#t44)
  - [remove 移除节点](#t45)
  - [红黑树扩容拆分](#t46)
- [参考文章](#te)

</div>

<br>

> MMP，写完回头一看，写了快上万字，图都画了不知道多少。。草稿纸都用了十多页。。以后看源码不这么仔细了，太花时间了，而且不实用。

> 如果是初学者，建议你先收藏，一天两天是搞不完的。。。
>
> 如果是老手，根据目录挑着看就好了，找几句关键语句也就差不多了
>
> 大佬，请轻喷，有问题请不吝指教

<br>

### <span id="t0">前言</span>

阅读源码版本 1.8.0.25.

`HashMap` 是面试避不了的关卡，一个类有2300行源码加注释，确实有点长，也肯定藏了很多的知识点。。。。

经常和 `HashMap` 进行比较的是 `HashTable ` 。不过 `HashTable` 已经不被推荐使用了，JDK 使用 `Map` 代替了 `Dictionary` 抽象类。如果需要使用线程安全的 `Map`，JDK 推荐了 `ConcurrentHashMap`。

先把源码的注释放上，想看的请自取：

- Map 接口源码：<a target="_blank" href="https://gitee.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/Map.java">https://gitee.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/Map.java</a>
- HashMap 源码：<a target="_blank" href="https://gitee.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/HashMap.java">https://gitee.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/HashMap.java</a>







JDK 1.7 之前，HashMap是使用 **数组+链表** 的存储方式。

不过在 JDK 1.8 对其进行了改进，当一个哈希桶内元素太多以至于链表过长的时候，**链表结构将转化成红黑树** 。

先放个思维导图，后面详细讲解


![HashMapSource0](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/HashMapSource0.png)



<br>

### <span id="t1">Map 接口</span>

![HashMapSource1](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/HashMapSource1.png)


作者按照 JDK自带的分类，将 Map 接口所有的方法进行了整理。

**default** 默认方法是在 JAVA8 中引入的关键字，为 Map 接口提供了默认的方法实现。个人觉得这些默认方法还是很实用的。

详细介绍可浏览作者的源码注解以及思维导图。



<br>

### <span id="t2">HashMap 继承关系</span>

![HashMapSource2](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/HashMapSource2.png)


- **Map** 接口定义了 **HashMap** 最基础的设计约束和需要实现的基础功能
- **AbstractMap** 提供了 **Map** 的基本实现，使得我们以后要实现一个 **Map** 不用从头开始，只需要继承 **AbstractMap** , 然后按需求实现/重写对应方法即可。
- 实现 **Serializable** 接口开启序列化功能 ----具体介绍请转 **Java面向对象基础 - 异常、序列化**
- 实现 **Cloneable** 接口，允许使用 **clone()** 方法克隆 — 具体介绍请转 **Java面向对象基础 - Object通用方法**



<br>

### <span id="t3">HashMap 构造方法</span>

**静态参数**

```java
    /**
     * 默认的初始容量 2^4 = 16 - 必须为2的幂。
     */
    static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16
    /**
     * 最大容量 2^30；如果构造方法指定了更大值，应该使用 2^30。容量必须是2的幂并且小于等于 2^30
     */
    static final int MAXIMUM_CAPACITY = 1 << 30;
    /**
     * 在构造函数中未指定时扩容系数的话，默认扩容系数
     */
    static final float DEFAULT_LOAD_FACTOR = 0.75f;
    /**
     * 添加键值对时，当map已有键值对数量超过此计数阈值，将链表转化为树。至少应该为8
     */
    static final int TREEIFY_THRESHOLD = 8;
    /**
     * 在调整大小操作期间，键值对数量少于此阈值时，将树转回链表。 应小于 TREEIFY_THRESHOLD，至少应该为6
     */
    static final int UNTREEIFY_THRESHOLD = 6;
    /**
     * 数据转化为树时，整个 table的最小容量。至少为 4倍 TREEIFY_THRESHOLD
     */
    static final int MIN_TREEIFY_CAPACITY = 64;
```



<br>

**字段**

一个 HashMap 包含如下字段： 

```java
   /**
     * 该表在首次使用时初始化，并根据需要调整大小。长度始终是2的幂；特定情况下允许为0
     */
    transient Node<K,V>[] table;
    /**
     * 转化为set集合用于迭代
     */
    transient Set<Map.Entry<K,V>> entrySet;
    /**
     * 当前 map包含的键值对数量
     */
    transient int size;
    /**
     * 修改次数，线程不安全类的 fast-fail 机制
     */
    transient int modCount;
    /**
     * 阈值，超过这个值就需要进行扩容（容量 * 扩容系数）。
     * 如果哈希表数组没有被分配，此字段为默认容量 DEFAULT_INITIAL_CAPACITY * DEFAULT_LOAD_FACTOR = 12
     */
    int threshold;
    /**
     * 哈希表的扩容系数
     */
    final float loadFactor;
```



<br>

**构造方法**

HashMap 我们常用的构造方法都是无参构造，使用默认扩容系数 0.75。

```java
    /**
     * 无参构造，使用默认扩容系数 0.75，默认初始容量16；
     */
    public HashMap() {
        this.loadFactor = DEFAULT_LOAD_FACTOR; // 其他所有字段均默认
    }
    /**
     * 指定初始容量的构造器，默认扩容系数 0.75
     * @param  initialCapacity 初始化数组长度
     * @throws IllegalArgumentException 如果初始容量为负
     */
    public HashMap(int initialCapacity) {
        this(initialCapacity, DEFAULT_LOAD_FACTOR);
    }
    /**
     * 指定初始容量和扩容系数的构造器
     * @param  initialCapacity 初始化数组长度
     * @param  loadFactor      扩容系数
     * @throws IllegalArgumentException 如果初始容量或者扩容系数为负
     */
    public HashMap(int initialCapacity, float loadFactor) {
        if (initialCapacity < 0)
            throw new IllegalArgumentException("Illegal initial capacity: " + initialCapacity);
        //最大容量 2^30
        if (initialCapacity > MAXIMUM_CAPACITY)
            initialCapacity = MAXIMUM_CAPACITY;
        //扩容系数小于等于零，或者不是个有效数字
        if (loadFactor <= 0 || Float.isNaN(loadFactor))
            throw new IllegalArgumentException("Illegal load factor: " + loadFactor);
        this.loadFactor = loadFactor;
        //下一个要调整到的容量值
        // 比当前容量大的下一个 2的幂，最大 2^30。
        this.threshold = tableSizeFor(initialCapacity);
    }
    /**
     * 构造一个新的 hashmap，并添加参数map的键值对，使用默认长度和扩容系数
     * @param   m 传入原有 map参数
     * @throws  NullPointerException 指定 map为null时抛出异常
     */
    public HashMap(Map<? extends K, ? extends V> m) {
        //默认扩容系数 0.75
        this.loadFactor = DEFAULT_LOAD_FACTOR;
        putMapEntries(m, false);
    }
```

这其中，根据原有 Map 的构造器，使用了批量添加方法，和 `Map.putAll` 方法相同，后续再介绍。

`tableSizeFor(initialCapacity)` 方法返回下一次需扩容到的容量，因为 **哈希桶的容量为2的幂** ，这是设计约束，使用该方法进行计算。其代码如下：

```java
    /**
     * 比参数容量大的下一个 2的幂值。最大长度为 2^30，最小为1
     * 使用或运算和右移运算，计算返回结果容量为 2的幂
     */
    static final int tableSizeFor(int cap) {
        int n = cap - 1;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
    }
```

具体计算过程，和 ArrayDeque 计算2的幂基本类似，已经在其他文章中详细讲解，并且举例说明，可以参考：

<a href="https://blog.csdn.net/m0_46144826/article/details/105405172" target="_blank">Java 栈(Stack)和队列(Queue)的首选 - ArrayDeque：https://blog.csdn.net/m0_46144826/article/details/105405172</a>

<br>

### <span id="t4">HashMap 主要方法和特点</span>

HashMap 确实功能较多，扩容、链表和红黑树转化、哈希算法、哈希碰撞处理等，因此整个流程将会比较复杂。

然后对于其中的一些常用方法，就不讲了，比如：迭代，是否包含。。等等等

<br>

#### <span id="t40">hash 算法</span>

hash 算法是 HashMap 的基础。添加一个键值对，首先要通过键对象的 hashcode，计算 hash 值，再添加到 hash桶中。

从 HashMap 获取也是一样，第一步就是 hash 算法。

顺便插一句，如何评价一个 Hash 算法以前有百度过，可以看下：

<a href="https://blog.csdn.net/m0_46144826/article/details/105719842" target="_blank">Hash 是个什么东西：https://blog.csdn.net/m0_46144826/article/details/105719842 </a>

然后看下 HashMap 的算法：

```java
    /**
     * 计算 key键的 hashcode值，key 为 null, hashcode 为 0。^ 异或运算
     *
     * 官方注解大致意思：
     * 哈希桶长度使用2的幂，因此哈希表肯定会发生冲突。所以使用了右移16位再异或。
     * 在hash算法的速度、有效性、扩展质量上进行了权衡，减少系统损失。
     */
    static final int hash(Object key) {
        int h;
        return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
    }
```

官方说是这么说，可以减少系统损失，但是为啥呢？？

先来举个例子，例如以下为键的 hashcode 以及右移之后的结果（将高低16位分在两个单元格，方便区分。想了好多个方法都对不齐，markdown语法还是有点麻烦）：

| 计算值             | 高位                | 低位                |
| :----------------- | :------------------ | ------------------- |
| h = key.hashcode() | 1011 1101 1111 0101 | 0110 1111 0110 0100 |
| h >>> 16           | 0000 0000 0000 0000 | 1011 1101 1111 0101 |

**进行异或计算后，相同位为 0，不同位为 1，结果得：**

| 计算值             | 高位                | 低位                |
| ------------------ | ------------------- | ------------------- |
| h ^ ( h  >>> 16 )  | 1011 1101 1111 0101 | 1101 0010 1001 0001 |
| h = key.hashcode() | 1011 1101 1111 0101 | 0110 1111 0110 0100 |

**现在来进行下比较，我们可以知道：**

**高位16位不变，低位16位混合了高低位的特征码**


然后这里要插一点后面的代码，在 hashmap.put 方法中，槽位计算的公示为：

```java
i = (n - 1) & hash
```

以默认长度 16 举例，以上 hash 算法所得值计算槽位时：

| 计算值              | 高位                                | 低位                               |
| :------------------ | ----------------------------------- | ---------------------------------- |
| hash                | 1011 1101 1111 0101                 | 1101 0010 1001 0001                |
| 16 - 1              | 0000 0000 0000 0000                 | 0000 0000 0000 1111                |
| -------------- | ------------------ | ------------- |
| （16-1）& hash      | 0000 0000 0000 0000                 | 0000 0000 0000 0001                |



最后得到索引位置为 1。

根据上面2次计算，我们可以发现，位移和异或运算的主要目的是：

- <font color="red">**在计算哈希表槽位时，高位码可能会被剔除，所以进行了位移和异或计算，在低位同时保留高位和低位特征**</font>
- <font color="red">**使用异或计算，而不是与、或计算是因为，这两种计算结果会明显向0或1靠拢。**</font>
- <font color="red">**所有这些措施，目的都是为了减少 hash 碰撞，使 hash 桶分布更加均匀，这也是评判一个 hash 算法优劣的条件之一。**</font>


<br>

#### <span id="t41">resize 哈希表初始化和扩容</span>

原本打算将这部分放在 hashmap.put 里介绍的，在流程中介绍，可以明确什么时候进行扩容。

不过后来发现 put 方法要写的实在太多了。。

而且，resize 扩容也是一串非常长的代码，下面我会拆分来进行讲解。先看下我读源码过程中绘制的流程图：

![HashMapSource3](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/HashMapSource3.jpg)


上面流程图中，节点拆分没有细化出来，后面再详细介绍。是不是很迷茫？

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/3110D72349BB2DEC2989BDC380CEAEE3.png)

然后再对应看下扩容方法的代码：

```java
    /**
     * 初始化或增加哈希表大小。
     * @return 返回哈希表
     */
    final Node<K,V>[] resize() {
        //获得旧哈希表
        Node<K,V>[] oldTab = table;
        //获得旧表长度
        int oldCap = (oldTab == null) ? 0 : oldTab.length;
        //获得旧的扩容阈值
        int oldThr = threshold;
        //定义新表长度和扩容阈值
        int newCap, newThr = 0;
        //旧表长度大于0
        if (oldCap > 0) {
            //如果原长度大于等于最大长度
            //无参构造原长度默认为0，指定长度的构造器，表长度肯定是2的幂，并且最大长度为2^30，所以不可能大于最大值
            if (oldCap >= MAXIMUM_CAPACITY) {
                //扩容系数确定为最大integer.max 2^31 - 1
                threshold = Integer.MAX_VALUE;
                //并返回旧哈希表；实际上并未真正进行扩容
                return oldTab;
            }
            //如果原长度小于 2^30，执行以下判断
            //如果原长度*2的结果 小于 2^30，并且原长度大于等于 16（其实说明 hashmap 已经经过了初始化，并且还未达到最大长度）
            //那么新扩容阈值也是 旧扩容阈值*2（并且新长度 = 原长度 * 2）
            else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY && oldCap >= DEFAULT_INITIAL_CAPACITY)
                newThr = oldThr << 1; // 双倍旧扩容阈值
        }
        //旧表长度等于0 并且 旧扩容阈值大于 0
        //在构造方法中，如果没有指定 initialCapacity初始长度，则threshold默认为0
        //因此，这个if的判断实际是：该 map为空，且在创建时指定了table长度
        else if (oldThr > 0)
            //新表长度就是旧扩容阈值
            newCap = oldThr;
        //旧表长度等于 0，旧扩容阈值也等于 0（说明 hashmap 还没有进行初始化）
        //使用默认值
        else {
            //新表长度使用默认值16
            newCap = DEFAULT_INITIAL_CAPACITY;
            //新扩容阈值为默认值 16*0.75 = 12
            newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
        }
        //如果新阈值等于0（说明进入了 oldThr > 0条件判断，该 map为空，且在创建时指定了table长度）
        if (newThr == 0) {
            //计算新的阈值
            float ft = (float)newCap * loadFactor;
            newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ? (int)ft : Integer.MAX_VALUE);
        }
        //将新的阈值赋值给 map.threshold
        threshold = newThr;
        //创建新表长度的node数组
        @SuppressWarnings({"rawtypes","unchecked"})
            Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
        table = newTab;
        //判断旧哈希表是否为空
        //实际判断是否为初始化
        if (oldTab != null) {
            //遍历旧表
            for (int j = 0; j < oldCap; ++j) {
                Node<K,V> e;
                //拿到旧哈希表节点
                if ((e = oldTab[j]) != null) {
                    //清空旧哈希表对应位置引用
                    oldTab[j] = null;
                    //对该节点进行判断
                    if (e.next == null)
                        //如果桶内只有一个节点，直接放入新哈希表
                        newTab[e.hash & (newCap - 1)] = e;
                    //如果不止一个节点，并判断该节点是否树形节点
                    else if (e instanceof TreeNode)
                        //调用 TreeNode方法，进行拆分
                        ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                    else { // preserve order
                        //不是树形节点，为链式结构
                        //将一个链表拆分成2个链表；lo开头低索引，hi高索引；head为第一个节点，tail为最后一个节点
                        Node<K,V> loHead = null, loTail = null;
                        Node<K,V> hiHead = null, hiTail = null;
                        Node<K,V> next;
                        do {
                            //获得下一个节点
                            next = e.next;
                            //这个判断是为了选择出扩容后在同一个桶的节点
                            if ((e.hash & oldCap) == 0) {
                                //判断是否是第一个节点，并链到该链表末尾
                                if (loTail == null)
                                    loHead = e;
                                else
                                    loTail.next = e;
                                loTail = e;
                            } else {
                                //判断是否是第一个节点，并链到该链表末尾
                                if (hiTail == null)
                                    hiHead = e;
                                else
                                    hiTail.next = e;
                                hiTail = e;
                            }
                        } while ((e = next) != null);
                        //低位链表存在，移动到新哈希表
                        if (loTail != null) {
                            loTail.next = null;
                            newTab[j] = loHead;
                        }
                        //高位链表，移动到新哈希表
                        if (hiTail != null) {
                            hiTail.next = null;
                            newTab[j + oldCap] = hiHead;
                        }
                    }
                }
            }
        }
        return newTab;
    }
```

我们都是文明人，说点讲道理的话，这可是一个方法啊。。。尼玛我要是在一个方法里写这么复杂的逻辑，接手代码的人不气得找人事要我的联系方式骂我一顿我都觉得神奇了。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/PQKMTQFY1HB9X53B@R%5DL6MH.jpg)

好吧，人家那是类库嘛，不服憋着。。。。该看的代码还得看。

树的拆分在后面章节讲，这里首先来看下链表的拆分：

```java
    //不是树形节点，为链式结构
    //将一个链表拆分成2个链表；lo开头低索引，hi高索引；head为第一个节点，tail为最后一个节点
    Node<K,V> loHead = null, loTail = null;
    Node<K,V> hiHead = null, hiTail = null;
    .......
    //高位链表，移动到新哈希表
    if (hiTail != null) {
        hiTail.next = null;
        newTab[j + oldCap] = hiHead;
    }
```

重复代码就不贴了，在上面的方法中最底下部分。

![HashMapSource4](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/HashMapSource4.jpg)

这个栗子举得还行吧。。。计算方式在上面的 hash算法章节已经介绍过了。

扩容后，原本超出表长的部分值，有了新的桶位置，这个位置索引也很明显可以从上述例子中看出。

例如表长为 `len` ，`n` 表示自然数（0，1，2......），未扩容的索引 `x` 的桶内的 hash值（注意是 hash值，不是自然数值，数字大到拥有高位后会右移异或计算）为：



> <font color="red">x + len * n</font>

**一次双倍扩容后，表长变为 `2*len` ，`x` 位置桶内原有的链表若需要拆分，拆分部分必定移动到 `x+len` 位置。**

我这就把扩容后 `x+len` 位置的 hash 值公式列一下，再细的就不讲了，你们自己对照上面未扩容比较下就明白了：

> <font color="red">(x + len) + ( 2*len )*n = x + ( 2n + 1 )*len</font>


**这个公式可尼玛真的是原创，虽然别人可能早就有了，但是我推出这个公式可没看过任何成品博客。**

所以现在来看下面的这段代码，是不是就明朗了，为什么索引要这么设置：

```java
    //低位链表存在，移动到新哈希表
    if (loTail != null) {
        loTail.next = null;
        newTab[j] = loHead;
    }
    //高位链表，移动到新哈希表
    if (hiTail != null) {
        hiTail.next = null;
        newTab[j + oldCap] = hiHead;
    }
```

知道为啥低位链表移动的索引位置不需要变化，而高位链表是原索引加原表长了把~~~

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/5bb57ca9f3fe49589ba5537df6fc1aab.jpeg)



写到这，我已经不想再写下去了。。。尼玛。我甚至还没有开始看主要的方法。。。。简直不是人看的代码



<br>

#### <span id="t42">put 添加元素流程</span>

首先，第一步是 map 添加一个键值对：

```java
    /**
     * 添加键值对，若该 key已存在，则替换 value值
     * @param key 指定需要添加的键
     * @param value 指定 key对应的 value 值
     * @return 指定 key之前对应的 value值；如果之前不存在该键，则返回 null
     */
    public V put(K key, V value) {
        return putVal(hash(key), key, value, false, true);
    }
```

这里的 `hash` 算法已经介绍过了，然后再看下最复杂的 `putVal` 方法：

```java
    /**
     * 实现添加方法
     * @param hash key计算所得 hash 值
     * @param key key 键对象
     * @param value key键对应的 value 值
     * @param onlyIfAbsent 如果为true，不要更改现有值
     * @param evict 如果为false，则 hashmap 表处于构造阶段
     * @return 之前的 value值；不存在的话返回 null
     */
    final V putVal(int hash, K key, V value, boolean onlyIfAbsent, boolean evict) {
        //定义一个节点数组，稍后用来保存 hashmap的节点数组
        Node<K,V>[] tab;
        //需要插入位置的节点
        Node<K,V> p;
        //n:哈希表长度； i:需要插入的位置索引
        int n, i;
        //如果哈希表长度为0，或者还没有初始化，那么需要初始化哈希表
        if ((tab = table) == null || (n = tab.length) == 0)
            //获得 n表长
            n = (tab = resize()).length;
        //如果需要插入的桶内没有其他节点，那么直接插入非树形节点
        if ((p = tab[i = (n - 1) & hash]) == null)
            tab[i] = newNode(hash, key, value, null);
        else {//桶内存在其他节点
            //保存原节点和它的key
            Node<K,V> e; K k;
            // 1.当前桶内的第一个节点 p的哈希值，和传入对象的哈希值相同
            // 2.当前桶内的第一个节点 p的 key值，和传入 key 相等（hash值相等 key不一定相等）
            // 都符合表示需要用新 value替换 p的 value
            if (p.hash == hash && ((k = p.key) == key || (key != null && key.equals(k))))
                //获取原节点，后面再判断是否要进行替换
                e = p;
            else if (p instanceof TreeNode)
                //树形节点，添加一个节点
                e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
            else {
                //链表，在最后添加节点；进行循环移动指针
                for (int binCount = 0; ; ++binCount) {
                    //如果p是最后一个
                    if ((e = p.next) == null) {
                        //直接链在链表最后
                        p.next = newNode(hash, key, value, null);
                        //判断桶内节点数，如果达到 8 个，那需要替换为红黑树
                        if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                            //转化为树
                            treeifyBin(tab, hash);
                        break;
                    }
                    //e不是最后一个，但是当前e的key相同，是否需要进行替换后面判断
                    if (e.hash == hash && ((k = e.key) == key || (key != null && key.equals(k))))
                        break;
                    //否则继续循环
                    p = e;
                }
            }
            // 现有键映射，说明该 key已经存在
            if (e != null) {
                //拿到原有值
                V oldValue = e.value;
                if (!onlyIfAbsent || oldValue == null)
                    e.value = value;
                //回调操作，在 HashMap 中无效
                afterNodeAccess(e);
                return oldValue;
            }
        }
        //操作次数+1
        ++modCount;
        //如果达到阈值，则进行扩容
        if (++size > threshold)
            resize();
        //回调操作，在 HashMap 中无效
        afterNodeInsertion(evict);
        //新增键值对，返回null
        return null;
    }
```

和上面的扩容一比，倒是并不复杂。。。先看下这个方法流程吧。。。。

putVal 方法还通用了 JDK8 新增 `putIfAbsent` 方法，所以这里多了一个是否覆盖的判断。

![HashMapSource5](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/HashMapSource5.jpg)


这里面有关于红黑树的两个方法没有细讲，请继续往后面看。。。



<br>

#### <span id="t43">链表如何转为红黑树</span>

现在继续将上面添加方法中涉及的 `treeifyBin(tab, hash)` ，我觉得这部分了解下就行了。有兴趣的看看代码：

```java
    /**
     * 将链表转化为红黑树
     */
    final void treeifyBin(Node<K,V>[] tab, int hash) {
        int n, index; Node<K,V> e;
        //如果当前哈希表为空，或者表长小于 64
        if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY)
            //那么进行扩容
            resize();
        //再次判定指定索引位置不为空，并获得第一个节点引用
        else if ((e = tab[index = (n - 1) & hash]) != null) {
            TreeNode<K,V> hd = null, tl = null;
            do {
                //链表节点转化为树形节点
                TreeNode<K,V> p = replacementTreeNode(e, null);
                if (tl == null)
                    //根节点
                    hd = p;
                else {
                    //先连成双向链表
                    p.prev = tl;
                    tl.next = p;
                }
                //当前指针
                tl = p;
            } while ((e = e.next) != null);
            //把转化后的双向链表转化为红黑树
            if ((tab[index] = hd) != null)
                hd.treeify(tab);
        }
    }
```

上面的方法是进行树形转化，主要的转化还在内部类方法 `TreeNode.treeify` 。后面再讲，先看看这个判断：

```java
if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY)
    resize();
```

这个判断扩容也是节省资源的操作。

哈希表长是否合适是判断一个哈希算法优劣的标准之一。在表长较小的情况下，分配到同一个哈希桶的次数不可避免的增加，这时候进行树结构中转换，是增加后续扩容和添加元素的消耗。

**所以在表长小于 64 的情况下，对比树形化，直接进行扩容，将原有链表分为高位和低位两条链表，更有效。**

然后，放个整个转换流程的图把，详细的转化过程可以跳过。

红黑树不是 **平衡二叉排序树** ，应该是不能用平衡这个概念的，不过大佬们说其实红黑树实际上在大多数情况下满足特性。个人觉得使用平衡概念比较好理解，所以就用上了。

这是一个在线动态测试网页： <a href="https://rbtree.phpisfuture.com/" target="_blank">https://rbtree.phpisfuture.com/</a>

![HashMapSource6](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/HashMapSource6.jpg)



**这边插播一下，为啥 HashMap 使用 红黑树，而不是 AVL树（平衡二叉排序树）：**

> 红黑树的查询性能略微逊色于AVL树，因为其比AVL树会稍微不平衡最多一层，也就是说红黑树的查询性能只比相同内容的AVL树最多多一次比较。
>
> 但是，红黑树在插入和删除上优于AVL树，AVL树每次插入删除会进行大量的平衡度计算，而红黑树为了维持红黑性质所做的红黑变换和旋转的开销，相较于AVL树为了维持平衡的开销要小得多。
>
> 实际应用中，若搜索的次数远远大于插入和删除，那么选择AVL，如果搜索，插入删除次数几乎差不多，应该选择红黑树。

好嘞，然后继续看 `treeify(Node<K,V>[] tab)`  方法，根据上面的调用可以知道，这是根节点调用方法。

其实这里主要的就是一个红黑树的算法，不过不是很有必要仔细研究。记住以下几点就够了：

- **每个节点或者是黑色，或者是红色；根节点是黑色**
- **如果一个节点是红的，则它的两个儿子都是黑的**
- **从任一节点到其叶子的所有简单路径都包含相同数目的黑色节点。**
- **每个红色节点的两个子节点一定都是黑色（叶子节点包含NULL）**

所以在 put 添加元素，需要在红黑树添加节点时，其实也是遵循上述原则，添加节点，进行自平衡。

**红黑树插入过程中情况：**

每次插入节点的时候会将节点着色为红色。其目的为了快的满足红黑树的约束条件。

> 1. **红黑树结构不会旋转变化情况：**
>    1. **当插入的节点为的父亲为黑色节点。【什么都不用做】**
>    2. **被插入的节点是根节点。【直接把此节点涂为黑色】**
> 2. **红黑树结构发生旋转变化情况：**
>    1. **当前节点的父节点是红色，且当前节点的祖父节点的另一个子节点（叔叔节点）也是红色。**
>    2. **当前插入的父节点是红色，当前叔叔节点的黑色，且当前节点为其父亲节点的左孩子。（进行左旋）**
>    3. **当前插入的父节点是红色，当前叔叔节点的黑色，且当前节点为其父亲节点的右孩子。（进行右旋）**

```java
        /**
         * 转为树
         * @return 树的根(为啥官方注释有返回。。。明明么得啊)
         */
        final void treeify(Node<K,V>[] tab) {
            // 定义树的根节
            TreeNode<K,V> root = null;
            //遍历链表
            for (TreeNode<K,V> x = this, next; x != null; x = next) {
                //从双向链表获取下一个节点
                next = (TreeNode<K,V>)x.next;
                //左右节点都为空
                x.left = x.right = null;
                //如果尚未定义根节点，则确定为根节点
                if (root == null) {
                    x.parent = null;
                    x.red = false;//根节点为黑色
                    root = x;
                } else {// 如果已经存在根节点了
                    // 取得当前链表节点的 key和 hash值
                    K k = x.key;
                    int h = x.hash;
                    Class<?> kc = null;// 定义key所属的Class
                    //从根节点开始遍历，没有设置循环边界，只能内部跳出
                    for (TreeNode<K,V> p = root;;) {
                        // dir 标识方向（左右），-1表示左侧；1表示右侧；
                        // ph标识当前遍历树节点的hash值
                        int dir, ph;
                        // 当前遍历树节点的key
                        K pk = p.key;
                        if ((ph = p.hash) > h)
                            //遍历节点的哈希值比插入节点大，放在p的左侧
                            dir = -1;
                        else if (ph < h)
                            //遍历节点的哈希值比插入节点小，放在p的右侧
                            dir = 1;
                        //如果hash值相等，需要进行其他判断
                        //如果当前链表节点的key实现了comparable接口，并且当前树节点和链表节点是相同Class的实例，那么通过comparable的方式再比较两者
                        //如果还是相等，最后再通过tieBreakOrder（该方法不会返回 0）比较一次
                        else if ((kc == null &&
                                  (kc = comparableClassFor(k)) == null) ||
                                 (dir = compareComparables(kc, k, pk)) == 0)
                            dir = tieBreakOrder(k, pk);
                        // 保存当前树节点
                        TreeNode<K,V> xp = p;

                        //如果dir小于等于0 ： 当前链表节点一定放置在当前树节点的左侧。
                        //如果dir大于0 ： 当前链表节点一定放置在当前树节点的右侧。
                        //如果还没有遍历到叶子节点，继续遍历
                        //挂载之后，还需要重新把树进行平衡。平衡之后，就可以针对下一个链表节点进行处理了。
                        if ((p = (dir <= 0) ? p.left : p.right) == null) {
                            x.parent = xp;
                            if (dir <= 0)
                                xp.left = x;
                            else
                                xp.right = x;
                            //自平衡操作
                            root = balanceInsertion(root, x);
                            break;
                        }
                    }
                }
            }
            // 把所有的链表节点都遍历完之后，最终构造出来的树可能经历多个平衡操作，根节点目前到底是链表的哪一个节点是不确定的
            // 因为我们要基于树来做查找，所以就应该把 tab[N] 得到的对象一定根是节点对象，而目前只是链表的第一个节点对象，所以要做相应的处理。
            //把红黑树的根节点设为  其所在的数组槽 的第一个元素
            //首先明确：TreeNode既是一个红黑树结构，也是一个双链表结构
            //这个方法里做的事情，就是保证树的根节点一定也要成为链表的首节点
            moveRootToFront(tab, root);
        }
```

顺便贴下平衡操作的代码，要更细节的代码，可以到 Gitee 上看类的注释：

```java
        /**
         * 红黑树插入节点后，重新平衡算法
         * @param root 当前根节点
         * @param x 新插入的节点
         * @return 返回重新平衡后的根节点
         */
        static <K,V> TreeNode<K,V> balanceInsertion(TreeNode<K,V> root, TreeNode<K,V> x) {
            x.red = true;//新插入的节点为红色
            // 循环没有设置边界，只能从内部跳出；先定义变量
            // XP:当前节点的父节点； XPP: 父节点的父节点，爷爷节点。。 ;
            // XPPL: 左叔叔节点 ; XPPR: 右叔叔节点
            for (TreeNode<K,V> xp, xpp, xppl, xppr;;) {//第一层
                // 如果父节点为空、说明当前节点就是根节点
                // 那么把当前节点标为黑色，返回当前节点
                if ((xp = x.parent) == null) {
                    x.red = false;
                    return x;
                }
                // 父节点不为空
                // 如果父节点为黑色，或者爷爷节点为空
                // 说明当前节点只在第二层，不需要平衡
                else if (!xp.red || (xpp = xp.parent) == null)//第二层
                    return root;

                //第三层判断
                //如果父节点是爷爷节点的左孩子
                if (xp == (xppl = xpp.left)) {
                    //获得右叔叔节点，右叔叔不为空且右叔叔是红色
                    if ((xppr = xpp.right) != null && xppr.red) {
                        xppr.red = false;// 右叔叔置为黑色
                        xp.red = false;// 父节点置为黑色
                        xpp.red = true;// 爷爷节点置为红色
                        x = xpp; // 将爷爷节点作为新节点继续循环
                    }
                    else {//进入这个else说明右叔叔不存在，或者为黑色
                        //如果当前节点是父节点的右孩子
                        if (x == xp.right) {
                            //左旋
                            root = rotateLeft(root, x = xp);
                            // 获取爷爷节点
                            xpp = (xp = x.parent) == null ? null : xp.parent;
                        }
                        // 如果父节点不为空
                        if (xp != null) {
                            // 父节点 置为黑色
                            xp.red = false;
                            // 爷爷节点不为空
                            if (xpp != null) {
                                // 爷爷节点置为 红色
                                xpp.red = true;
                                //爷爷节点右旋
                                root = rotateRight(root, xpp);
                            }
                        }
                    }
                }
                //如果父节点是爷爷节点的右孩子
                else {
                    if (xppl != null && xppl.red) {
                        xppl.red = false;
                        xp.red = false;
                        xpp.red = true;
                        x = xpp;
                    }
                    else {
                        if (x == xp.left) {
                            root = rotateRight(root, x = xp);
                            xpp = (xp = x.parent) == null ? null : xp.parent;
                        }
                        if (xp != null) {
                            xp.red = false;
                            if (xpp != null) {
                                xpp.red = true;
                                root = rotateLeft(root, xpp);
                            }
                        }
                    }
                }
            }
        }
```



<br>

#### <span id="t44">get 获取流程</span>

这一部分主要讲在使用 hashmap 过程中，获取节点的检索流程。先看下入口方法 `V get(Object key)` ：

```java
    /**
     * 返回指定键所映射到的值；如果此映射不包含键的映射关系，则返回 null
     */
    public V get(Object key) {
        Node<K,V> e;
        return (e = getNode(hash(key), key)) == null ? null : e.value;
    }
```

`getNode(int hash, Object key)` 先通过 hash 值获取所在桶，再遍历桶获取该 key，思路也不复杂：

```java
    /**
     * 实现 Map.get以及相关方法
     * @param hash key键的 hash值
     * @param key key键
     * @return 返回节点, 如果为空，返回null
     */
    final Node<K,V> getNode(int hash, Object key) {
        Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
        //先判断 hashmap是否初始化，该hash桶位置是否为空
        if ((tab = table) != null && (n = tab.length) > 0 &&
            (first = tab[(n - 1) & hash]) != null) {
            // 遍历之前，需要检查第一个节点是否就是需要查找的节点
            if (first.hash == hash &&
                ((k = first.key) == key || (key != null && key.equals(k))))
                return first;
            //第一个节点不是，并且还有后续节点，开始完后检查
            if ((e = first.next) != null) {
                //如果是红黑树，使用树遍历方法
                if (first instanceof TreeNode)
                    return ((TreeNode<K,V>)first).getTreeNode(hash, key);
                do {
                    //不是红黑树，链表遍历
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        return e;
                } while ((e = e.next) != null);
            }
        }
        return null;
    }
```

链表遍历就是顺序遍历，红黑树的查找也是遵循平衡二叉树的规律，根据hash值来判断向左遍历还是向右遍历。

汇总下讲，`get(Object key)` 方法的流程是：

![HashMapSource7](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/HashMapSource7.jpg)

<br>

#### <span id="t45">remove 移除节点</span>

然后是移除节点流程，先看入口方法：

```java
    /**
     * 如果存在，则从此映射中删除指定键的映射。
     * @param  key 要从地图中删除其映射的键
     * @return 与 key关联的先前值；如果没有 key的映射，则为 null。 （返回 null还可能表明该地图先前将 null与 key关联。）
     */
    public V remove(Object key) {
        Node<K,V> e;
        return (e = removeNode(hash(key), key, null, false, true)) == null ?
            null : e.value;
    }
```

思路大致和添加差不多。。后面的就开始简单介绍：

```java
    /**
     * 实现 Map.remove 以及相关方法
     * @param hash key的 hash值
     * @param key 需要移除的key
     * @param value 需要被匹配的方法，1.8新增方法
     * @param matchValue 如果为true，则仅在值相等时删除,1.8新增
     * @param movable 如果为false，则在删除时不要移动其他节点
     * @return 与 key关联的先前值；如果没有 key的映射，则为 null
     */
    final Node<K,V> removeNode(int hash, Object key, Object value, boolean matchValue, boolean movable) {
        // tab：用于指向table； p：桶内第一个节点； n：数组长度； index：hash所映射的数组下标
        Node<K,V>[] tab; Node<K,V> p; int n, index;
        // hashmap已经初始化，并且key的hash值位置桶内不为空
        if ((tab = table) != null && (n = tab.length) > 0 &&
            (p = tab[index = (n - 1) & hash]) != null) {
            //node:当前节点，e:下一个节点，k:当前节点的key，v:当前节点value值
            Node<K,V> node = null, e; K k; V v;
            //第一个节点就是目标节点
            if (p.hash == hash && ((k = p.key) == key || (key != null && key.equals(k))))
                node = p;
            //存在下一个节点
            else if ((e = p.next) != null) {
                //节点为树形节点
                if (p instanceof TreeNode)
                    node = ((TreeNode<K,V>)p).getTreeNode(hash, key);
                else {//当前为链表
                    do {
                        if (e.hash == hash &&
                            ((k = e.key) == key ||
                             (key != null && key.equals(k)))) {
                            node = e;
                            break;
                        }
                        p = e;
                    } while ((e = e.next) != null);
                }
            }
            if (node != null && (!matchValue || (v = node.value) == value ||
                                 (value != null && value.equals(v)))) {
                if (node instanceof TreeNode)
                    //红黑树移除节点
                    ((TreeNode<K,V>)node).removeTreeNode(this, tab, movable);
                else if (node == p)
                    tab[index] = node.next;
                else
                    p.next = node.next;
                ++modCount; //操作次数+1
                --size; //map键值对-1
                afterNodeRemoval(node); //回调，在1.8 hashmap中无效
                return node;
            }
        }
        return null;
    }
```

这里面嘛。。。链表的操作就不详细介绍了。。。就是去掉一个节点，再把两端连起来

这里主要介绍下，红黑树移除节点， `TreeNode.getTreeNode` 查找的话，在 put 流程中已经介绍了。

首先是在移除流程中，会有树退回链表：

```java
        //如果以下符合一个，树退回链表：
        // 1.根节点为空，2.根的右孩子为空，3.根的左孩子为空，4.根的左孩子的左孩子为空
        if (root == null || root.right == null ||
            (rl = root.left) == null || rl.left == null) {
            tab[index] = first.untreeify(map);  // too small
            return;
        }
```

这里貌似也没有说到底是多少个节点才回退。

一般从红黑树的自平衡规律来看，最大的退化可能在 `rl.left == null` 。

在符合该条件的情况下，最大的红黑树节点为 10，再添加任何一个都会再平衡从而填补空位。

![HashMapSource8](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/HashMapSource8.png)


**而 JDK 官方注释表示，这个范围大致是 2到6。**

在最后还会讲到的，红黑树拆分也涉及到树的退化，这个阈值设置的为 6。


<br>

#### <span id="t46">红黑树扩容拆分</span>

下面是最后部分，红黑树的拆分在之前没有介绍，之前只介绍了链表的拆分。

其实大致思路应该是一样的，hash值也是分为2部分。（写到这，忽然发现上面的红黑树的选值都有点不太合适，貌似都没考虑在这些hash值的索引。。。见谅见谅）

还是和上面的扩容一样，核心还是这个公式：

> <font color="red">(x + len) + ( 2*len )*n = x + ( 2n + 1 )*len</font>


大致的思路其实和链表拆分相同：

1. **根据单数倍长度和双数倍长度，将树分为高位和低位两部分**
2. **分别将高位和低位连成双向链表**
3. **如果链表数量小于等于6，则退化为单链表**
4. **如果链表数量大于6，则转化为树（转化方式上面介绍过了）。**

然后看下代码：

```java
        /**
         * 拆分树，如果太小则进行退化回链表
         * @param map 当前 hashmap
         * @param tab 新哈希表
         * @param index 需要被拆分的树的在原哈希表的索引
         * @param bit 原哈希表容量
         */
        final void split(HashMap<K,V> map, Node<K,V>[] tab, int index, int bit) {
            //调用时是使用桶内第一个节点调用，所以this为树的根节点
            TreeNode<K,V> b = this;
            //lo开头低索引，hi高索引；head为第一个节点，tail为最后一个节点
            TreeNode<K,V> loHead = null, loTail = null;
            TreeNode<K,V> hiHead = null, hiTail = null;
            //lc低位树个数，
            int lc = 0, hc = 0;
            //定义变量，b为根节点，e:当前节点，next：下一节点
            for (TreeNode<K,V> e = b, next; e != null; e = next) {
                //拿到下一个节点，并将引用消除
                next = (TreeNode<K,V>)e.next;
                e.next = null;
                //这个判断是为了选择出扩容后在同一个桶的节点（其实就是区分单数倍和双数倍）
                if ((e.hash & bit) == 0) {
                    //先练成双向链表
                    if ((e.prev = loTail) == null)
                        loHead = e;
                    else
                        loTail.next = e;
                    loTail = e;
                    //链表数量+1
                    ++lc;
                }
                else {
                    if ((e.prev = hiTail) == null)
                        hiHead = e;
                    else
                        hiTail.next = e;
                    hiTail = e;
                    ++hc;
                }
            }
            if (loHead != null) {//判空
                //如果双向链表数量小于等于6（退化为链表的阈值）
                if (lc <= UNTREEIFY_THRESHOLD)
                    tab[index] = loHead.untreeify(map);
                else {
                    //先确定树根节点
                    tab[index] = loHead;
                    //再转化为树
                    if (hiHead != null) // (其他已经被树化了)
                        loHead.treeify(tab);
                }
            }
            if (hiHead != null) {
                if (hc <= UNTREEIFY_THRESHOLD)
                    tab[index + bit] = hiHead.untreeify(map);
                else {
                    tab[index + bit] = hiHead;
                    if (loHead != null)
                        hiHead.treeify(tab);
                }
            }
        }
```







<br>

### <span id="te">参考文章</span>

<a target="_blank" href="https://blog.csdn.net/u011240877/article/details/52949046">https://blog.csdn.net/u011240877/article/details/52949046</a>

<a target="_blank" href="https://www.cnblogs.com/zxporz/p/11204233.html">https://www.cnblogs.com/zxporz/p/11204233.html</a>

<a target="_blank" href="https://blog.csdn.net/weixin_41565013/article/details/93190786">https://blog.csdn.net/weixin_41565013/article/details/93190786</a>

<a target="_blank" href="https://zhuanlan.zhihu.com/p/21673805">https://zhuanlan.zhihu.com/p/21673805</a>

<a target="_blank" href="https://blog.csdn.net/qsdnmd/article/details/82914312">https://blog.csdn.net/qsdnmd/article/details/82914312</a>

<a target="_blank" href="https://blog.csdn.net/qsdnmd/article/details/82920636">https://blog.csdn.net/qsdnmd/article/details/82920636</a>

<a target="_blank" href="https://blog.csdn.net/weixin_36888577/article/details/87211314">https://blog.csdn.net/weixin_36888577/article/details/87211314</a>

<a target="_blank" href="https://www.jianshu.com/p/37436ed14cc6">https://www.jianshu.com/p/37436ed14cc6</a>

<a target="_blank" href="https://blog.csdn.net/weixin_42340670/article/details/80550932">https://blog.csdn.net/weixin_42340670/article/details/80550932</a>

<a target="_blank" href="https://blog.csdn.net/jjc120074203/article/details/78780221">https://blog.csdn.net/jjc120074203/article/details/78780221</a>
