<div class="catalog">

- [概述](#t0)
- [TreeMap 继承关系](#t1)
- [SortedMap、NavigableMap](#t2)
- [TreeMap 构造方法](#t3)
- [TreeMap 重点介绍](#t4)
  - [红黑树介绍](#t41)
  - [TreeMap.Entry](#t42)
  - [添加元素](#t43)
  - [遍历顺序](#t44)
- [TreeMap 和 HashMap](#t5)
- [参考文章](#t7)

</div>



### <span id="t0">1 概述</span>

**TreeMap** 实现了*SortedMap*接口，也就是说会按照 `key` 的大小顺序对 *Map* 中的元素进行排序，`key` 大小的评判可以通过其本身的自然顺序(natural ordering)，也可以通过构造时传入的比较器(Comparator)。

**TreeMap底层通过红黑树(Red-Black tree)实现** ，也就意味着 `containsKey()` ,  `get()` ,  `put()` ,  `remove()` 都有着 `log(n)` 的时间复杂度。

先把 **TreeMap** 源码放上：<a href="https://github.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/TreeMap.java" target="_blank">https://github.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/TreeMap.java</a>

关于红黑树，在以前写过的 HashMap 中有简单介绍，可以参考：<a href="https://blog.csdn.net/m0_46144826/article/details/106300438" target="_blank">https://blog.csdn.net/m0_46144826/article/details/106300438</a>

> 源码注解不会覆盖100%，只会阅读重点特性和方法。实在是上一篇 HashMap 把人弄残废了。



<br>

### <span id="t1">2 TreeMap 继承关系</span>


<img src="@/assets/blog/img/collections/TreeMapSource1.png"/>


- 实现 **Serializable** 接口开启序列化功能 ----具体介绍请转 <a href="https://blog.csdn.net/m0_46144826/article/details/105055432" target="_blank">**Java面向对象基础 - 异常、序列化**</a> 
- 实现 **Cloneable** 接口，允许使用 **clone()** 方法克隆 — 具体介绍请转 <a href="https://blog.csdn.net/m0_46144826/article/details/104075489" target="_blank">**Java面向对象基础 - Object通用方法**</a>

- **AbstractMap** 抽象类提供了 **Map** 的基础实现，使得 **TreeMap** 不需要从零开始实现一个 map 的所有方法。
- 然后剩下的 **NavigableMap** 和 **SortedMap** 实现了元素的比较，确定优先级，后面再详细讲。

<br>

### <span id="t2">3 SortedMap、NavigableMap</span>

先把代码注释放上：

- SortedMap 接口源码 ：<a href="https://github.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/SortedMap.java" target="_blank">https://github.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/SortedMap.java</a>

- NavigableMap 接口源码 ：<a href="https://github.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/NavigableMap.java" target="_blank">https://github.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/NavigableMap.java</a>

**SortedMap** 是 **NavigableMap** 的父类。 

**SortedMap** 是一个根据 key进排序的 Map 集合，接口设计要求实现一个 **comparator** 比较器，如果没有实现，则使用元素自带的比较器。

<font color="red">**所以 SoryedMap 的 key 必须实现 Comparable 接口**</font>

**NavigableMap** 在 **SortedMap** 基础上进行了一些功能增强，具体功能见下表：

**SortedMap 接口方法：**

|             方法、参数、返回值             |                           功能介绍                           |
| :----------------------------------------: | :----------------------------------------------------------: |
|    Comparator<? super K> comparator();     | 返回用于在此 map中对键进行排序的比较器；如果此映射使用其键的 Comparable 自然排序，则返回 null。 |
| SortedMap<K,V> subMap(K fromKey, K toKey); | 返回此地图部分的视图，其键范围为 fromKey（包括边界） 到 toKey（不包括） |
|      SortedMap<K,V> headMap(K toKey);      |  返回此地图部分的视图，其键范围为起始节点到 toKey（不包括）  |
|     SortedMap<K,V> tailMap(K fromKey);     |   此地图部分的视图，其键范围为 fromKey（包括边界） 到结束    |
|               K firstKey();                |               当前在此地图中的第一个（最小）键               |
|                K lastKey();                |              当前在此地图中的最后一个（最大）键              |
|              Set<K> keySet();              |      此 map中包含的 key的set集合，以 key比较后升序排列       |
|          Collection<V> values();           |      此 map中包含的 value值的集合，按 key比较后升序排列      |
|      Set<Map.Entry<K, V>> entrySet();      |     此 map中包含的键值对的集合视图，按key比较后升序排列      |

**NavigableMap 接口添加的方法：** 

|         方法、参数、返回值          |                         功能介绍                         |
| :---------------------------------: | :------------------------------------------------------: |
|  Map.Entry<K,V> lowerEntry(K key);  |  返回严格小于给定键的最大键值对，或者如果没有这样的键。  |
|         K lowerKey(K key);          |    返回严格小于给定键的最大键，或者如果没有这样的键。    |
|  Map.Entry<K,V> floorEntry(K key);  | 返回小于或等于给定键的最大键值对，或者如果没有这样的键。 |
|         K floorKey(K key);          |   返回小于或等于给定键的最大键，或者如果没有这样的键。   |
| Map.Entry<K,V> ceilingEntry(K key); | 返回大于或等于给定键的最小键值对，或者如果没有这样的键。 |
|        K ceilingKey(K key);         |   返回大于或等于给定键的最小键，或者如果没有这样的键。   |
| Map.Entry<K,V> higherEntry(K key);  |  返回严格大于给定键的最小键值对，或者如果没有这样的键。  |
|         K higherKey(K key);         |    返回严格大于给定键的最小键，或者如果没有这样的键。    |
|    Map.Entry<K,V> firstEntry();     |       返回第一个（最小）键值对，如果不存在返回null       |
|     Map.Entry<K,V> lastEntry();     |      返回最后一个（最大）键值对，如果不存在返回null      |
|  Map.Entry<K,V> pollFirstEntry();   |    返回第一个（最小）键值对并移除，如果不存在返回null    |
|   Map.Entry<K,V> pollLastEntry();   |   返回最后一个（最大）键值对并移除，如果不存在返回null   |
| NavigableMap<K,V> descendingMap();  |            返回此 map中包含的映射的逆序视图。            |
| NavigableSet<K> navigableKeySet();  |               返回一个Navigable的key的集合               |
| NavigableSet<K> descendingKeySet(); |             返回一个Navigable的key的倒序集合             |



<br>

### <span id="t3">4 TreeMap 构造方法</span>

TreeMap 真正的参数就以下：

```java
    /**
     * 比较器用于维护此树形图中的顺序；如果比较器使用其键的自然顺序，则为null。
     */
    private final Comparator<? super K> comparator;
    /**
     * 根节点
     */
    private transient Entry<K,V> root;
    /**
     * treemap节点数
     */
    private transient int size = 0;
    /**
     * 修改次数，快速失败机制
     */
    private transient int modCount = 0;
```

其他还有三个提供遍历的参数，不过这些貌似并不重要 ：

```java
    private transient EntrySet entrySet;//键值对遍历
    private transient KeySet<K> navigableKeySet;//key遍历
    private transient NavigableMap<K,V> descendingMap;//逆序map遍历
```

然后看构造函数：

```java
    /**
     * 使用其键的自然顺序构造一个新的空树形图。
     * 插入地图的所有键都必须实现{@link Comparable}接口。
     */
    public TreeMap() {
        comparator = null;
    }
    /**
     * 带比较器的构造函数。
     * 所有插入的 key都必须支持该比较器
     * @param comparator treemap的比较器。 如果为 null，将使用key的自然比较
     */
    public TreeMap(Comparator<? super K> comparator) {
        this.comparator = comparator;
    }

    /**
     * 使用参数 m 的key的自然排序构造
     * 时间复杂度为 n*log(n)
     * @param  m 需要被添加的初始 map
     * @throws ClassCastException 如果m中的键没有继承{@link Comparable}，或不能相互比较
     * @throws NullPointerException 如果指定的map为null
     */
    public TreeMap(Map<? extends K, ? extends V> m) {
        comparator = null;
        putAll(m);
    }

    /**
     * 使用 sortedmap构造，需要判断是否存在比较器
     * @param  m the sorted map whose mappings are to be placed in this map,
     *         and whose comparator is to be used to sort this map
     * @throws NullPointerException 如果指定的map为null
     */
    public TreeMap(SortedMap<K, ? extends V> m) {
        comparator = m.comparator();
        try {
            buildFromSorted(m.size(), m.entrySet().iterator(), null, null);
        } catch (java.io.IOException cannotHappen) {
        } catch (ClassNotFoundException cannotHappen) {
        }
    }
```

带比较器的构造函数上有说明：

>  如果 comparator 为 null，将使用 key 的自然比较

**因为 TreeMap 没有比较器的 set 方法，所以要设置比较器必须在构造方法声明。**



<br>

### <span id="t4">5 TreeMap 重点介绍</span>

因为 TreeMap 使用红黑树做为存储结构。

关于红黑树，在以前写过的 HashMap 中有简单介绍，可以参考：<a href="https://blog.csdn.net/m0_46144826/article/details/106300438" target="_blank">https://blog.csdn.net/m0_46144826/article/details/106300438</a>

所以这篇中不会很详细，到时候会与 HashMap 进行下对比。

其实也没啥好解释的，所有特性只要知道结构，代码都是顺理成章的，而且 TreeMap也没有复杂的计算和逻辑。



<br>

#### <span id="t41">5.1 红黑树介绍</span>

这是一个在线红黑树动态测试网页，上面可以进行图解： <a href="https://rbtree.phpisfuture.com/" target="_blank">https://rbtree.phpisfuture.com/</a>

红黑树首先是一个二叉排序树，对于二叉排序树的特点就很明显了：

**（1）若左子树不空，则左子树上所有结点的值均小于它的根结点的值；**

**（2）若右子树不空，则右子树上所有结点的值均大于它的根结点的值；**

**（3）左、右子树也分别为二叉排序树；**

**（4）没有相等的键值；**

然后红黑树并不严格是平衡的，但是大佬们得出结论，根据红黑树的特点，它确实是自平衡的，它的特点是：

- **每个节点或者是黑色，或者是红色；根节点是黑色**
- **如果一个节点是红的，则它的两个儿子都是黑的**
- **从任一节点到其叶子的所有简单路径都包含相同数目的黑色节点。**
- **每个红色节点的两个子节点一定都是黑色（叶子节点包含NULL）**

红黑树插入过程中情况：每次插入节点的时候会将节点着色为黑色。其目的为了快的满足红黑树的约束条件。

> 1. 红黑树结构不会旋转变化情况：
>    1. **当插入的节点为的父亲为黑色节点。【什么都不用做】**
>    2. **被插入的节点是根节点。【直接把此节点涂为黑色】**
> 2. 红黑树结构发生旋转变化情况：
>    1. **当前节点的父节点是红色，且当前节点的祖父节点的另一个子节点（叔叔节点）也是红色。**
>    2. **当前插入的父节点是红色，当前叔叔节点的黑色，且当前节点为其父亲节点的左孩子。（进行左旋）**
>    3. **当前插入的父节点是红色，当前叔叔节点的黑色，且当前节点为其父亲节点的右孩子。（进行右旋）**



<br>

#### <span id="t42">5.2 TreeMap.Entry</span>

TreeMap.Entry 是类中最基础的结构，它代表树中的一个节点：

```java
 static final class Entry<K,V> implements Map.Entry<K,V> {
        K key;// 键
        V value;//值
        Entry<K,V> left;//左孩子
        Entry<K,V> right;//右孩子
        Entry<K,V> parent;//父亲
        boolean color = BLACK;//默认黑色
 }
```

对一个一个树形节点来说，他们的重要引用都有。



<br>

#### <span id="t43">5.3 添加元素</span>

添加元素方法：

```java
    public V put(K key, V value) {
        //首先判断根节点是否为空
        //如果根节点为空，默认为根节点
        Entry<K,V> t = root;
        if (t == null) {
            compare(key, key); // 输入（可能为空）检查
            //设置根节点，默认为黑色，没有父节点
            root = new Entry<>(key, value, null);
            size = 1;
            modCount++;
            return null;
        }
        int cmp;
        Entry<K,V> parent;
        // 拆分比较器和可比较的路径
        //获得当前 treemap的比较器
        Comparator<? super K> cpr = comparator;
        //比较器为不为空，使用 treemap的比较器
        if (cpr != null) {
            do {//循环遍历，大于0往右子树，小于0坐子树，等于0替换
                parent = t;
                cmp = cpr.compare(key, t.key);
                if (cmp < 0)
                    t = t.left;
                else if (cmp > 0)
                    t = t.right;
                else
                    return t.setValue(value);
            } while (t != null);
        }
        //比较器为空，使用自然比较，需要key实现Comparable接口
        else {
            if (key == null)
                throw new NullPointerException();
            @SuppressWarnings("unchecked")
                Comparable<? super K> k = (Comparable<? super K>) key;
            do {
                parent = t;
                cmp = k.compareTo(t.key);
                if (cmp < 0)
                    t = t.left;
                else if (cmp > 0)
                    t = t.right;
                else
                    return t.setValue(value);
            } while (t != null);
        }
        Entry<K,V> e = new Entry<>(key, value, parent);
        if (cmp < 0)
            parent.left = e;
        else
            parent.right = e;
        fixAfterInsertion(e);
        size++;
        modCount++;
        return null;
    }
```

这里的根节点比较方法：

```java
    /**
     * 使用与此TreeMap正确的比较方法比较两个键。
     */
    @SuppressWarnings("unchecked")
    final int compare(Object k1, Object k2) {
        return comparator==null ? ((Comparable<? super K>)k1).compareTo((K)k2)
            : comparator.compare((K)k1, (K)k2);
    }
```



<br>

#### <span id="t44">5.4 遍历顺序</span>

看着这么多集合类代码，我还是第一次写遍历顺序，先看入口代码：

```java
    /**
     * 返回此映射中包含的映射的{@link Set}视图。
     */
    public Set<Map.Entry<K,V>> entrySet() {
        EntrySet es = entrySet;
        return (es != null) ? es : (entrySet = new EntrySet());
    }
```

内部类 `EntrySet()` 的迭代器为：

```java
 public Iterator<Map.Entry<K,V>> iterator() {
     return new EntryIterator(getFirstEntry());
 }
```

首先在这个 EntryIterator 构造中，传入了第一个键值对的引用：

```java
   final Entry<K,V> getFirstEntry() {
        Entry<K,V> p = root;
        if (p != null)
            while (p.left != null)
                p = p.left;
        return p;
    }
```

根据红黑树的特性： **若左子树不空，则左子树上所有结点的值均小于它的根结点的值** 

所以返回最小的节点，就是最左边的节点。

然后就是常见的 `next` 顺序了：

```java
   final class EntryIterator extends PrivateEntryIterator<Map.Entry<K,V>> {
        EntryIterator(Entry<K,V> first) {
            super(first);
        }
        public Map.Entry<K,V> next() {
            return nextEntry();
        }
    }
```

它的 `next` 方法使用了 `PrivateEntryIterator` 的内部方法：

```java
    final Entry<K,V> nextEntry() {
        //获得下一个节点
        Entry<K,V> e = next;
        //如果为空抛出异常
        if (e == null)
            throw new NoSuchElementException();
        // 快速失败机制，如果在迭代过程中进行了 treemap 修改，则抛出线程异常
        if (modCount != expectedModCount)
            throw new ConcurrentModificationException();
        //拿到下一个元素
        next = successor(e);
        //上一个返回的元素
        lastReturned = e;
        return e;
    }
```

然后就是最后的 `successor(e)` 方法了：

```java
    /**
     * 返回指定Entry的后继者；如果没有，则返回null。
     */
    static <K,V> TreeMap.Entry<K,V> successor(Entry<K,V> t) {
        //如果当前节点为空，则返回null
        if (t == null)
            return null;
        else if (t.right != null) {//当前节点不为空，且右子树不为空
            //拿到右子树中最小的
            Entry<K,V> p = t.right;
            while (p.left != null)
                p = p.left;
            return p;
        } else {//当前节点不为空且右子树为空，那就需要拿父节点
            Entry<K,V> p = t.parent;
            Entry<K,V> ch = t;
            //如果当前节点是父节点的右孩子，需要拿到最小的祖先节点
            while (p != null && ch == p.right) {
                ch = p;
                p = p.parent;
            }
            return p;
        }
    }
```





<br>

### <span id="t5">6 TreeMap 和 HashMap</span>

|   对比项目   |                           HashMap                            |                           TreeMap                            |
| :----------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| **内部结构** |                       数组+链表+红黑树                       |                            红黑树                            |
| **继承关系** |                继承 AbstractMap，实现 Map接口                | 继承 AbstractMap，实现 NavigableMap、SortedMap<br>保证了 SortedMap 的有序性 |
| **实现方式** | 定义了hashcode() 和equals()，基于 hash实现，可以根据初始容量和负载因子调优 |              红黑树总是处于平衡的状态，无法调优              |
| **遍历顺序** | 不能保证遍历顺序，因为 key的 hash值跟 hashcode和表长度都有关系。 |                    会按照排序后的顺序输出                    |
| **长度限制** |   一个桶内链表达到8时转化为红黑树，表长最大为 Integer.Max    |                      红黑树没有长度限制                      |
|   **场景**   |         通常情况下，HashMap是要更快一点，毕竟数组嘛          |                    需要排序才使用 TreeMap                    |





<br>

### <span id="te">参考文章</span>


<a href="https://www.breakyizhan.com/java/5376.html" target="_blank">https://www.breakyizhan.com/java/5376.html/</a>

<a href="http://cmsblogs.com/?p=1013" target="_blank">http://cmsblogs.com/?p=1013</a>

<a href="https://www.pdai.tech/md/java/collection/java-map-TreeMap&TreeSet.html" target="_blank">https://www.pdai.tech/md/java/collection/java-map-TreeMap&TreeSet.html</a>
