<div class="catalog">

- [概述](#t1)
- [继承关系](#t2)
- [构造方法](#t3)
- [Vector注意点](#t4)
    - [下标判断缺陷](#t41)
    - [elements()](#t42)
    - [线程安全初探](#t43)
- [使用建议](#t5)


</div>



### <span id="t1">概述</span>

阅读 Java 版本为 **1.8.0.25**。

*Vector* 实现了 *List* 接口，是顺序容器，即元素存放的数据与放进去的顺序相同，允许放入 `null` 元素，底层通过**Object 数组实现**。

*Vector* 与 *ArrayList* 基本相同，不过 *Vector* 一定程度上实现了同步。所以这篇源码介绍会比较简略，大致代码请转至 **ArrayList 源码解析** 。

学习方式为，将 **Vector** 源码以及相关类拷贝至自定义包内，进行注释添加，代码请移步：<br>
<a href="https://gitee.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/Vector.java" target="_blank">https://gitee.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/Vector.java</a>

知识点总结如下：


![VectorSource](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/VectorSource.png)


<br>

### <span id="t2">继承关系</span>


![ArrayListSource2](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/ArrayListSource2.png)


- 实现 **Serializable** 接口开启序列化功能 ----具体介绍请转 **Java面向对象基础 - 异常、序列化**
- 实现 **Cloneable** 接口，允许使用 **clone()** 方法克隆 --- 具体介绍请转 **Java面向对象基础 - Object通用方法、枚举** 
- 实现 **RandomAccess** 接口，支持快速随机访问策略（官网说明，如果是实现了这个接口的 **List**，那么使用 for 循环的方式获取数据会优于用迭代器 Iterator 获取数据） --- 具体请参考文章 
<a href="https://www.cnblogs.com/yeya/p/9950723.html" target="_blank">https://www.cnblogs.com/yeya/p/9950723.html</a>

<br>

### <span id="t3">构造方法</span>

Vector 底层如下，经有3个字段，底层基于数组实现。

```java
    //底层基于 Object[] 实现，可以存储所有类型。
    protected Object[] elementData;
    //实际包含元素个数
    protected int elementCount;
    //扩容长度字段，若在构造中没有指定，则进行双倍扩容
    protected int capacityIncrement;
```



和 ArrayList 不同，Vector 静态常量仅剩 MAX_ARRAY_SIZE ：

```java
    //数组最大容量，实际值为2^31-1-8，超出会爆OutOfMemoryError。
    //数组除了存放数据外，还有一个length属性，减8为了存放数组长度
    private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;
```



> **Vector 构造时数组默认长度为 10；而 ArrayList 若不指定长度，则默认为0。**

构造方法如下 ：

```java
    //无参构造器，重载 Vector(int initialCapacity)，默认长度10
    public Vector() {
        this(10);
    }

    //指定长度的构造器
    public Vector(int initialCapacity) {
        this(initialCapacity, 0);
    }

    //指定长度和扩容大小的构造器
    public Vector(int initialCapacity, int capacityIncrement) {
        super();
        if (initialCapacity < 0)
            throw new IllegalArgumentException("Illegal Capacity: "+
                    initialCapacity);
        this.elementData = new Object[initialCapacity];
        this.capacityIncrement = capacityIncrement;
    }

    //集合参数构造器，顺序初始化
    public Vector(Collection<? extends E> c) {
        elementData = c.toArray();
        elementCount = elementData.length;
        // 官方解释，c.toArray返回的可能不是Object[] (see 6260652)
        if (elementData.getClass() != Object[].class)
            elementData = Arrays.copyOf(elementData, elementCount, Object[].class);
    }
```



<br>

### <span id="t4">Vector注意点</span>

这一部分就从简了，大部分都和 ArrayList 一样，有兴趣看下 ArrayList 篇吧。

以后会把有关集合的大部分比较重新开一篇汇总。


<br>

#### <span id="t41">Vector下标判断的缺陷</span>

这里首先看下 ArrayList 的 下标位置判断方法：

```java
    //在指定位置添加元素
    public void add(int index, E element) {
        // 判断指定位置是否超出列表位置范围
        rangeCheckForAdd(index);
        ensureCapacityInternal(size + 1);
        //进行数组复制，从指定位置往后移一位
        System.arraycopy(elementData, index, elementData, index + 1,
                size - index);
        elementData[index] = element;
        size++;
    }   

    // 判断指定位置是否超出列表位置范围
    private void rangeCheckForAdd(int index) {
        if (index > size || index < 0)
            throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
    }
```

然后看下 Vector 的 insertElementAt 方法：

```java
   public synchronized void insertElementAt(E obj, int index) {
        //操作次数 +1
        modCount++;
        // 判断指定位置是否超出列表位置范围，因为数组不能间断
        //为什么这里不判断小于0 ??????
        if (index > elementCount) {
            throw new ArrayIndexOutOfBoundsException(index
                    + " > " + elementCount);
        }
        //判断扩容方法
        ensureCapacityHelper(elementCount + 1);
        //进行数组复制，从指定位置往后移一位
        System.arraycopy(elementData, index, elementData, index + 1, elementCount - index);
        elementData[index] = obj;
        elementCount++;
    }
```

再看下 Vector 的 addAll 方法，也是根据下标位置进行添加

```java
    // 指定位置开始批量添加
    public synchronized boolean addAll(int index, Collection<? extends E> c) {
        modCount++;
        //这里又加了负数判断？？？？
        if (index < 0 || index > elementCount)
            throw new ArrayIndexOutOfBoundsException(index);

        Object[] a = c.toArray();
        int numNew = a.length;
        ensureCapacityHelper(elementCount + numNew);

        int numMoved = elementCount - index;
        if (numMoved > 0)
            System.arraycopy(elementData, index, elementData, index + numNew,
                    numMoved);

        System.arraycopy(a, 0, elementData, index, numNew);
        elementCount += numNew;
        return numNew != 0;
    }
```



看看三个方法的索引判断

> 同样是判断索引，为什么 ArrayList 判断了小于 0 ，而 Vector 没有？

没有实践就没有发言权，一定是我错了，JDK是不可能错的！所以我做了个测试

```java
    public static void main(String[] args) {
        Vector<Integer> vector = new Vector<>();
        vector.add(1);
        //测试负数位置
        vector.insertElementAt(10,-1);
        System.out.println(vector);
    }
```

妈耶，居然，报错了，而且报错行是在 **System.arraycopy** ，已经通过了索引判断，甚至扩容数组了。。。

```java
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException
    at java.lang.System.arraycopy(
    Native Method)
    at vectorsources.Vector.insertElementAt(Vector.java:91)
    at vectorsources.VectorTest.main(VectorTest.java:10)
```

而且，这个只判断正整数不只出现在这一处，还出现在  **remove、get**  等，好几处主要方法。。。

然后，我百度了下，翻了3页才确定，貌似这里不判断负数，确实没有什么深意。。。

虽然这只是个牛角尖，但是，我得出一个重大的结论，JDK 也不是完美的。。。。





<br>

#### <span id="t42">elements()</span>

这个方法代码也比较简单，只是因为 ArrayList 貌似没有。。。就着重看了下：

```java
    //枚举迭代器
    public Enumeration<E> elements() {
        return new Enumeration<E>() {
            int count = 0;
            //循环次数为数组元素个数
            public boolean hasMoreElements() {
                return count < elementCount;
            }
            //加锁循环
            public E nextElement() {
                synchronized (Vector.this) {
                    if (count < elementCount) {
                        return elementData(count++);
                    }
                }
                throw new NoSuchElementException("Vector Enumeration");
            }
        };
    }
```





<br>

#### <span id="t43">线程安全初探</span>

虽然 Vector 在大多数的操作方法上加了锁，但是不是绝对的线程安全的。

在方法上加了 **synchronized** 效率极低，保证所有被修饰的方法对外只是保证单线程持有。



**以下部分节选自大佬的文章，这里就举下例子：<a href="https://blog.csdn.net/Fly_as_tadpole/article/details/86480371" target="_blank">https://blog.csdn.net/Fly_as_tadpole/article/details/86480371</a>**

> 虽然源代码注释里面说这个是线程安全的，因为确实很多方法都加上了同步关键字synchronized，但是对于复合操作而言，只是同步方法但并没有解决线程安全的问题。因为在两个原子操作之间存在间隙，在多线程环境中，完全有可能被其他线程获得 vector的 lock 并改变其状态。要真正达成线程安全，还需要以vector对象为锁，来进行操作。所以，如果是这样的话，那么用vector和ArrayList就没有区别了，所以，不推荐使用vector。

> 这是经典的 put-if-absent 情况，尽管 contains, add 方法都正确地同步了，但作为 vector 之外的使用环境，仍然存在  race condition: 因为虽然条件判断 if (!vector.contains(element))与方法调用 vector.add(element);  都是原子性的操作 (atomic)，但在 if 条件判断为真后，那个用来访问vector.contains 方法的锁已经释放，在即将的 vector.add 方法调用 之间有间隙，在多线程环境中，完全有可能被其他线程获得 vector的 lock 并改变其状态, 此时当前线程的vector.add(element);  正在等待（只不过我们不知道而已）。只有当其他线程释放了 vector 的 lock 后，vector.add(element); 继续，但此时它已经基于一个错误的假设了。

> 单个的方法 synchronized 了并不代表组合（compound）的方法调用具有原子性，使 compound actions  成为线程安全的可能解决办法之一还是离不开intrinsic lock (这个锁应该是 vector 的，但由 client 维护)：

```java
   // Vector v = ...
   public  boolean putIfAbsent(E x) {
	  synchronized(v) { 
          boolean absent = !contains(x); 
          if (absent) { 
             add(x);
          } 
       }
       return absent; 
   }
```





<br>

### <span id="t5">使用建议</span>

- **在线程安全情况下要特别注意，Vector 虽然在方法上加锁，但是并非绝对线程安全。**
- **很多博客最后的结论都是，不建议使用 Vector 。**

