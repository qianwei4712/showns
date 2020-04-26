<div class="catalog">

- [概述](#t1)
- [继承关系](#t2)
- [构造方法](#t3)
- [ArrayList的常用方法](#t4)
    - [addAll](#t41)
    - [removeAll](#t42)
    - [iterator](#t43)
    - [subList](#t44)
    - [ensureCapacityInternal](#t45)
    - [modCount简介](#t46)
- [使用建议](#t5)
- [参考文章](#t6)


</div>



### <span id="t1">概述</span>

阅读 Java 版本为 **1.8.0.25**。

*ArrayList* 实现了 *List* 接口，是顺序容器，即元素存放的数据与放进去的顺序相同，允许放入 `null` 元素，底层通过**Object 数组实现**。

除该类未实现同步外，其余跟 *Vector* 大致相同。每个 *ArrayList* 都有一个容量(capacity)，表示底层数组的实际大小，容器内存储元素的个数不能多于当前容量。当向容器中添加元素时，如果容量不足，容器会自动增大底层数组的大小。

学习方式为，将 **ArrayList** 源码以及相关类拷贝至自定义包内，进行注释添加，代码请移步：<br>
<a href="https://github.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/ArrayList.java" target="_blank">https://github.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/ArrayList.java</a>

知识点总结如下：


<img src="@/assets/blog/img/collections/ArrayListSource1.png"/>


<br>

### <span id="t2">继承关系</span>


<img src="@/assets/blog/img/collections/ArrayListSource2.png"/>


- 实现 **Serializable** 接口开启序列化功能 ----具体介绍请转 **Java面向对象基础 - 异常、序列化**
- 实现 **Cloneable** 接口，允许使用 **clone()** 方法克隆 --- 具体介绍请转 **Java面向对象基础 - Object通用方法、枚举** 
- 实现 **RandomAccess** 接口，支持快速随机访问策略（官网说明，如果是实现了这个接口的 **List**，那么使用 for 循环的方式获取数据会优于用迭代器 Iterator 获取数据） --- 具体请参考文章 
<a href="https://www.cnblogs.com/yeya/p/9950723.html" target="_blank">https://www.cnblogs.com/yeya/p/9950723.html</a>

<br>

### <span id="t3">构造方法</span>

ArrayList 底层如下，经有2个字段，底层基于数组实现。

```java
    //底层基于 Object[] 实现，可以存储所有类型。
    transient Object[] elementData;
    //列表长度,并不是Object[]的长度，而是实际列表元素的个数
    private int size;
```



ArrayList 静态常量如下：

```java
    //默认初始化容量
    private static final int DEFAULT_CAPACITY = 10;
    //默认空list，当构造方法传入长度为0时返回
    private static final Object[] EMPTY_ELEMENTDATA = {};
    //默认空list，无参构造器时返回的默认列表
    private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
    //数组最大容量，实际值为2^31-1-8，超出会爆OutOfMemoryError。
    //数组除了存放数据外，还有一个length属性，减8为了存放数组长度
    private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;
```



构造方法如下：

```java
    /**
     * 指定链表长度的构造方法
     * 当指定长度为0时，返回 static final 默认空链表 EMPTY_ELEMENTDATA
     */
    public ArrayList(int initialCapacity) {
        if (initialCapacity > 0) {
            this.elementData = new Object[initialCapacity];
        } else if (initialCapacity == 0) {
            this.elementData = EMPTY_ELEMENTDATA;
        } else {
            throw new IllegalArgumentException("Illegal Capacity: "+
                    initialCapacity);
        }
    }

    //无参构造方法，默认返回空列表
    public ArrayList() {
        this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
    }
    
    //集合参数构造器，顺序初始化
    public ArrayList(Collection<? extends E> c) {
        elementData = c.toArray();
        if ((size = elementData.length) != 0) {
            if (elementData.getClass() != Object[].class)
                // c.toArray() 返回的数组类型不是 Object[]，则利用 Arrays.copyOf()来构造一个大小为 size 的 Object[] 数组
                elementData = Arrays.copyOf(elementData, size, Object[].class);
        } else {
            //集合参数长度为0，设置为默认列表
            this.elementData = EMPTY_ELEMENTDATA;
        }
    }
```



<br>

### <span id="t4">ArrayList的常用方法</span>

同一类型方法都大同小异，这里都抽一个解释一下。

`indexOf(Object o)、get(int index)、contains(Object o)` 等方法虽然很常用，但是代码实现特别简单，就不贴出来了。


<br>

#### <span id="t41">addAll(int index, Collection<? extends E> c)；</span>

添加方法共有四种：

- add(E e)，末尾添加一个元素
- add(int index, E element)，在指定位置添加元素
- addAll(Collection<? extends E> c)，顺序批量添加
- addAll(int index, Collection<? extends E> c)，从指定位置开始批量添加

内部实现比较简单，例如这里最复杂的第四个：

```java
    // 从指定位置开始批量添加
    public boolean addAll(int index, Collection<? extends E> c) {
        // 判断指定位置是否超出列表位置范围
        rangeCheckForAdd(index);
        // 将需添加集合转为数组
        Object[] a = c.toArray();
        // 需要添加的个数
        int numNew = a.length;
        //确定数组长度，长度如果添加 numNew,是否需要扩容
        ensureCapacityInternal(size + numNew);
        //获得开始移动的下标，使用 native 方法进行赋值移动
        int numMoved = size - index;
        if (numMoved > 0)
            System.arraycopy(elementData, index, elementData, index + numNew,
                    numMoved);
        // 将需要添加的数组拷贝到列表数组
        System.arraycopy(a, 0, elementData, index, numNew);
        // 数组长度更改
        size += numNew;
        return numNew != 0;
    }
```

这里涉及到2个私有方法，**ensureCapacityInternal** 是个特殊方法，后面专门介绍；**rangeCheckForAdd** 比较简单，贴个代码过去了。

```java
    // 判断指定位置是否超出列表位置范围
    private void rangeCheckForAdd(int index) {
        if (index > size || index < 0)
            throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
    }

    // 编写异常信息
    private String outOfBoundsMsg(int index) {
        return "Index: "+index+", Size: "+size;
    }
```

<br>

#### <span id="t42">removeAll(Collection<?> c)</span>

涉及移除的方法有：

- remove(int index)，根据数组下标删除
- remove(Object o)，根据元素对象删除，只删除第一个
- removeRange(int fromIndex, int toIndex)，根据数组下标范围删除
- removeAll(Collection<?> c)，根据集合批量删除，移除 list 中和 c 中共有的元素
- retainAll(Collection<?> c)，只保留 list 和 集合 c 中公有的元素：和 removeAll() 功能相反
- removeIf(Predicate<? super E> filter)，1.8开始加入的新方法，根据条件删除
- clear()，清空列表

这里最常用的应该是 **remove(Object o)** ，不过比较简单，就不展开了。

介绍一下复杂的，比如 **removeAll(Collection<?> c)** 代码如下：

```java
    // 根据集合批量删除, 移除 list 中和 c 中共有的元素
    public boolean removeAll(Collection<?> c) {
        //判空
        Objects.requireNonNull(c);
        return batchRemove(c, false);
    }
```

重点是下面的批量删除方法：

```java
    // 批量删除，true-保留并集，false-保留差集
    private boolean batchRemove(Collection<?> c, boolean complement) {
        // 重新创建一个数组保存原数组
        final Object[] elementData = this.elementData;
        int r = 0, w = 0;
        boolean modified = false;
        try {
            for (; r < size; r++)
                // 如果 c 包含原数组元素并且模式为保留并集，将该元素赋值到新数组
                // 如果 c 不含原数组元素并且模式为差集，将该元素赋值到新数组
                if (c.contains(elementData[r]) == complement)
                    elementData[w++] = elementData[r];
        } finally {
            //这个if，官方的注释是为了保持和AbstractCollection的兼容性
            //假如上面c.contains抛出了异常，导致for循环终止，那么必然会导致r != size
            //所以0-w之间是需要保留的数据，同时从w索引开始将剩下没有循环的数据(也就是从r开始的)拷贝回来，也保留
            if (r != size) {
                System.arraycopy(elementData, r,
                        elementData, w,
                        size - r);
                w += size - r;
            }
            //for循环完毕，检测了所有的元素，0-w之间保存了需要留下的数据，w开始以及后面的数据全部清空
            if (w != size) {
                for (int i = w; i < size; i++)
                    elementData[i] = null;
                modCount += size - w;
                size = w;
                modified = true;
            }
        }
        return modified;
    }
```



<br>

#### <span id="t43">iterator()</span>

```java
    public Iterator<E> iterator() {
        return new Itr();
    }
```

迭代器用的太多了，多的也不介绍了，稍微贴几段代码得了

```java
   private class Itr implements Iterator<E> {
        // 标记字段，达到指针效果
        int cursor;       
        int lastRet = -1; // index of last element returned; -1 if no such
        // 记录变化值，简单的线程安全判断
        int expectedModCount = modCount;

        // 简单的线程安全判断，快速失败机制
        final void checkForComodification() {
            if (modCount != expectedModCount)
                throw new ConcurrentModificationException();
        }
       
        public boolean hasNext() {  return cursor != size; }

        @SuppressWarnings("unchecked")
        public E next() {
            checkForComodification();
            int i = cursor;
            if (i >= size)
                throw new NoSuchElementException();
            Object[] elementData = ArrayList.this.elementData;
            if (i >= elementData.length)
                throw new ConcurrentModificationException();
            cursor = i + 1;
            return (E) elementData[lastRet = i];
        }

        public void remove() {
            if (lastRet < 0)
                throw new IllegalStateException();
            checkForComodification();

            try {
                ArrayList.this.remove(lastRet);
                cursor = lastRet;
                lastRet = -1;
                expectedModCount = modCount;
            } catch (IndexOutOfBoundsException ex) {
                throw new ConcurrentModificationException();
            }
        }
    }

```


<br>

#### <span id="t44">subList(int fromIndex, int toIndex)</span>

截取列表方法，实际上返回内部类 `SubList` ，这个内部类和 `ArrayList` 一样继承了 `AbstractList` ，截取方法如下：

```java
    // 截取list
    public List<E> subList(int fromIndex, int toIndex) {
        //判断下标是否符合
        subListRangeCheck(fromIndex, toIndex, size);
        return new SubList(this, 0, fromIndex, toIndex);
    }
```

`SubList` 源码过长，贴一下要点：

```java
   private class SubList extends AbstractList<E> implements RandomAccess {
        private final AbstractList<E> parent;
        private final int parentOffset;
        private final int offset;
        int size;

        SubList(AbstractList<E> parent,
                int offset, int fromIndex, int toIndex) {
            this.parent = parent;
            this.parentOffset = fromIndex;
            this.offset = offset + fromIndex;
            this.size = toIndex - fromIndex;
            this.modCount = ArrayList.this.modCount;
        }
      
    }
```

实际上 **subList(int fromIndex, int toIndex)** 是将原 **ArrayList** 作为一个字段维护进 `SubList` 中，因为也实现了 List接口，所有其他操作不变。

并且，所有针对返回结果的操作，都继续反映在原数组上。

>  **`subList(int fromIndex, int toIndex)`  返回的已经不是 `ArrayList` 了，实际编码中可以观察到，代码自动补全后返回类型为 List<E>，不可向下转为 `ArrayList` 。** 以前还真没发现。。。。 


<br>

#### <span id="t45">ensureCapacityInternal(int minCapacity)</span>

这是一个数组扩容方法，首先判断扩容一半是否足够，若不够则直接扩容至结果长度（原长度+添加个数），了解一下就行了，个人感觉用不太上。

具体解析如下：

```java
 // 扩容数组，判断是否为默认空数组
    private void ensureCapacityInternal(int minCapacity) {
        //如果当前数组为默认空数组，扩容数组长度，最小为10
        if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
            minCapacity = Math.max(DEFAULT_CAPACITY, minCapacity);
        }
        ensureExplicitCapacity(minCapacity);
    }

    // 修改计数，判断是否需要增加数组长度
    private void ensureExplicitCapacity(int minCapacity) {
        // 操作计数，此参数继承自 AbstractList，用来记录列表的增删操作次数
        // 实际作用为，在线程不安全的对象中，进行简单的线程安全判断。
        modCount++;
        // 如果需求长度大于当前数组长度，进行扩容
        if (minCapacity - elementData.length > 0)
            grow(minCapacity);
    }

    // 实际扩容方法，
    private void grow(int minCapacity) {
        int oldCapacity = elementData.length;
        // 运算符 >> 是带符号右移. 如 oldCapacity = 10,则 newCapacity = 10 + (10 >> 1) = 10 + 5 = 15
        int newCapacity = oldCapacity + (oldCapacity >> 1);
        if (newCapacity - minCapacity < 0)
            // 若 newCapacity 依旧小于 minCapacity，直接赋值
            newCapacity = minCapacity;
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            // 若超出最大长度，直接赋值为最大值
            newCapacity = hugeCapacity(minCapacity);
        // 重新创建指定长度的数组，并将原数组复制过去
        elementData = Arrays.copyOf(elementData, newCapacity);
    }

    private static int hugeCapacity(int minCapacity) {
        if (minCapacity < 0) // overflow
            throw new OutOfMemoryError();
        return (minCapacity > MAX_ARRAY_SIZE) ?
                Integer.MAX_VALUE :
                MAX_ARRAY_SIZE;
    }
```

<br>

#### <span id="t46">modCount简介</span>

该字段是父类  `AbstractList ` 的一个 `protected  ` 类型字段。

在 ArrayList 的所有涉及结构变化的方法中都增加modCount的值，包括：add()、remove()、addAll()、removeRange()、clear()等方法。

这些涉及到列表增删的方法每调用一次，modCount的值就加1。 

这里简单介绍下 `modCount` 在 `ArrayList` 的作用，例如 sort() 方法：

```java
    //带比较器的排序方法
    @Override
    @SuppressWarnings("unchecked")
    public void sort(Comparator<? super E> c) {
        //记录原本更改次数
        final int expectedModCount = modCount;
        Arrays.sort((E[]) elementData, 0, size, c);
        //如果在排序过程中，其他线程对list进行了增删操作，导致 modCount 会发生变化， 然后丢出异常
        if (modCount != expectedModCount) {
            throw new ConcurrentModificationException();
        }
        modCount++;
    }
```

> 从上面代码可以得出，`modCount` 只能简单的判断。
>
> **如果排序过程中，进行了添加或者移除的操作，那么 `modCount` 不等于 `expectedModCount` ，数组元素已经产生了变化。这是有问题的，所以 `ArrayList` 并不是线程安全的。**


<br>

### <span id="t5">使用建议</span>

其实也没啥可建议的，也就是：

- 根据数组的特点，对于增删操作少的情况下建议使用
- 根据扩容的原理，粗略估计有多少元素，构造时确定长度，以免扩容操作重新复制


<br>

### <span id="t6">参考文章</span>


<a href="https://blog.csdn.net/GuLu_GuLu_jp/article/details/51456969" target="_blank">https://blog.csdn.net/GuLu_GuLu_jp/article/details/51456969</a>

<a href="https://www.pdai.tech/md/java/collection/java-collection-ArrayList.html" target="_blank">https://www.pdai.tech/md/java/collection/java-collection-ArrayList.html</a>

<a href="https://www.cnblogs.com/yeya/p/9950723.html" target="_blank">https://www.cnblogs.com/yeya/p/9950723.html</a>

<a href="https://blog.csdn.net/Kate_sicheng/article/details/77616204" target="_blank">https://blog.csdn.net/Kate_sicheng/article/details/77616204</a>

<a href="https://blog.csdn.net/liuzhaomin/article/details/83917923" target="_blank">https://blog.csdn.net/liuzhaomin/article/details/83917923</a>

<a href="https://blog.csdn.net/eson_15/article/details/51121833" target="_blank">https://blog.csdn.net/eson_15/article/details/51121833</a>

<a href="https://www.cnblogs.com/zt007/p/11080811.html" target="_blank">https://www.cnblogs.com/zt007/p/11080811.html</a>


