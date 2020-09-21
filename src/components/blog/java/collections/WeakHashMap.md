

<div class="catalog">

- [前言](#t0)
- [使用场景](#t1)
- [WeakHashMap 特点](#t2)
  - [实现原理](#t21)
  - [删除过期条目](#t22)
  - [ReferenceQueue的作用](#t23)
- [参考文章](#te)


</div>

## <span id="t0">前言</span>

阅读 Java 版本为 **1.8.0.25**。

*WeakHashMap* 是一个很特殊的集合类。

**在不对 *WeakHashMap* 进行任何操作的情况下，它的键值对也会被 GC 回收，因为它的 key 是弱引用。**

这种奇葩 Map 有啥用呢，其实在缓存情况下，还真有点用。 

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/NM29O3L8D9OFYYR5LSQ.jpg)

源码位置先放上，因为这个类和 HashMap 其实类似，所有我觉得没必要特别仔细，知道特性就可以了：

- WeakHashMap  源码：<a href="https://gitee.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/WeakHashMap.java" target="_blank">https://gitee.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/WeakHashMap.java</a>


关于什么是弱引用，特地去查了点资料，可以看看：<a href="https://blog.csdn.net/m0_46144826/article/details/108246718" target="_blank">弱引用是什么，和其他引用有啥区别？</a>

内部实现的话，不会讲很细，和 HashMap 非常类似，可以看看：  <a href="https://blog.csdn.net/m0_46144826/article/details/106300438" target="_blank">侃晕面试官的 HashMap 源码分析 - 这真不是我吹</a>



<br>

## <span id="t1">使用场景</span>

***WeekHashMap* 的这个特点特别适用于需要缓存的场景**。

在缓存场景下，由于内存是有限的，不能缓存所有对象；对象缓存命中可以提高系统效率，但缓存 MISS 也不会造成错误，因为可以通过计算重新得到。



<br>

## <span id="t2">WeakHashMap 特点</span>



### <span id="t21">弱引用实现原理</span>

最基础的表象就是：

> 即使在 WeakHashMap 实例上进行同步，也没有调用其变异器方法， size 方法可以随时间返回较小的值
>
> isEmpty 方法可以先返回 false ，然后再返回 true
>
> 对于给定的键，containsKey 方法可能先返回 true ，再返回 false 
>
> 对于 get 方法返回给定键的值，但后来返回null 

因为垃圾收集器可能随时丢弃 key，所以 WeakHashMap 可能表现为未知线程静默地删除条目。

这只是表现出来的特点，原理其实就是弱引用。

<font color="red">**当发生GC时，弱引用对象总会被回收，因此弱引用也可以用于缓存。**</font>

其实最底层的实现就这么一段：

```java
    private static class Entry<K,V> 
        extends WeakReference<Object> 
        implements Map.Entry<K,V> {
    
        V value;
        final int hash;
        Entry<K,V> next;
     }
```

WeakHashMap 的 `Entry` 继承了 **WeakReference** ，而 **WeakReference** 看名字就知道是弱引用。



<br>

### <span id="t22">删除过期条目</span>

` private void expungeStaleEntries()` 作用是删除过期条目。

在以下方法中进行了调用：

- `private Entry<K,V>[] getTable()` 在删除旧条目后返回表，每次增删改查都会调用这个方法
- `public int size()` 查询集合大小
- `void resize(int newCapacity)` 扩容方法

意思就是，基本 **WeakHashMap** 每次操作都会先删除过期条目。

先贴代码：

```java
    private void expungeStaleEntries() {
        for (Object x; (x = queue.poll()) != null; ) {
            synchronized (queue) {
                @SuppressWarnings("unchecked")
                    Entry<K,V> e = (Entry<K,V>) x;
                int i = indexFor(e.hash, table.length);

                Entry<K,V> prev = table[i];
                Entry<K,V> p = prev;
                while (p != null) {
                    Entry<K,V> next = p.next;
                    if (p == e) {
                        if (prev == e)
                            table[i] = next;
                        else
                            prev.next = next;
                        // Must not null out e.next;
                        // stale entries may be in use by a HashIterator
                        e.value = null; // Help GC
                        size--;
                        break;
                    }
                    prev = p;
                    p = next;
                }
            }
        }
    }
```

代码就不一行一行解释了，这个方法的作用流程是：

1. 遍历 `queue（已清除的WeakEntries的参考队列）` 
2. 如果存在相同 key，则删除该 key

```java
//queue 保存的是“已被GC清除的”“弱引用的键”。
private final ReferenceQueue<Object> queue = new ReferenceQueue<>();
```

所以这也是 WeakHashMap 的另一个特点：

<font color="red">**一旦这样的 key 被丢弃，它就永远不会被重新创建，所以不可能在稍后的WeakHashMap中查找该 key。**</font>



<br>

### <span id="t23">ReferenceQueue的作用</span>

当 gc（垃圾回收线程）准备回收一个对象时，如果发现它还仅有软引用(或弱引用，或虚引用)指向它

就会在回收该对象之前，把这个软引用（或弱引用，或虚引用）加入到与之关联的引用队列（ReferenceQueue）中。

如果一个软引用（或弱引用，或虚引用）对象本身在引用队列中，就说明该引用对象所指向的对象被回收了。

`WeakHashMap Entry` 条目构造方法如下：

```java
        /**
         * 创建新条目
         */
        Entry(Object key, V value, ReferenceQueue<Object> queue, int hash, Entry<K,V> next) {
            super(key, queue);
            this.value = value;
            this.hash  = hash;
            this.next  = next;
        }
```

使用父类 WeakReference 构造方法：

```java
public class WeakReference<T> extends Reference<T> {

    /**
     * 创建引用给定对象的新的弱引用。
     * 新引用未注册到任何队列。
     * @param referent 新的弱引用将引用
     */
    public WeakReference(T referent) {
        super(referent);
    }

    /**
     * 创建引用给定对象并在给定队列中注册的新的弱引用。
     * @param referent 新的弱引用将引用
     * @param q 要注册参考的队列，如果不需要注册， 则为 null
     */
    public WeakReference(T referent, ReferenceQueue<? super T> q) {
        super(referent, q);
    }
}
```

最终方法的构造方法：

```java
    Reference(T referent, ReferenceQueue<? super T> queue) {
        this.referent = referent;
        this.queue = (queue == null) ? ReferenceQueue.NULL : queue;
    }
```

所以，在 GC 回收弱引用的时候，会将弱引用加入引用队列，这也是 WeakReference 可以删除过期条目的实现基础。




<br>

## <span id="te">参考文章</span>

<a href="https://www.pdai.tech/md/java/collection/java-map-WeakHashMap.html" target="_blank">https://www.pdai.tech/md/java/collection/java-map-WeakHashMap.html</a>

<a href="https://www.cnblogs.com/CarpenterLee/p/5544598.html" target="_blank">https://www.cnblogs.com/CarpenterLee/p/5544598.html</a>

<a href="https://blog.csdn.net/wangshihui512/article/details/51611191" target="_blank">https://blog.csdn.net/wangshihui512/article/details/51611191</a>

<a href="https://www.cnblogs.com/nullzx/p/7406151.html" target="_blank">https://www.cnblogs.com/nullzx/p/7406151.html</a>







