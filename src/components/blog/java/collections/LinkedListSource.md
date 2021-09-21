<div class="catalog">

- [概述](#t1)
- [继承关系](#t2)
- [构造方法](#t3)
- [LinkedList的常用方法](#t4)
    - [add](#t41)
    - [remove](#t42)
    - [poll() 和 pop()](#t43)
- [总结](#t5)
- [参考文章](#t6)

</div>



### <span id="t1">概述</span>

阅读 Java 版本为 **1.8.0.25**。

> *LinkedList* 同时实现了*List*接口和*Deque*接口，也就是说它既可以看作一个顺序容器，又可以看作一个队列(*Queue*)，同时又可以看作一个栈(*Stack*)。

当你需要使用栈或者队列时，可以考虑使用 *LinkedList* ，一方面是因为Java官方已经声明不建议使用 *Stack* 类，更遗憾的是，Java里根本没有一个叫做 *Queue* 的类(只是个接口)。关于栈或队列，现在的首选是*ArrayDeque*，它有着比 *LinkedList* (当作栈或队列使用时)有着更好的性能。

学习方式为，将 **LinkedList** 源码类拷贝至自定义包内，进行注释添加，代码请移步：<br>
<a href="https://gitee.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/LinkedList.java" target="_blank">https://gitee.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/LinkedList.java</a>

知识点总结如下：


![LinkedListSource1](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/LinkedListSource1.png)


<br>

### <span id="t2">继承关系</span>



![LinkedListSource2](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/LinkedListSource2.png)



- 实现 **Serializable** 接口开启序列化功能 ----具体介绍请转 **Java面向对象基础 - 异常、序列化**

- 实现 **Cloneable** 接口，允许使用 **clone()** 方法克隆 --- 具体介绍请转 **Java面向对象基础 - Object通用方法、枚举** 

- 实现 **Deque** 接口，**Deque** 继承自 **Queue** ，实现一个双向队列基础方法 --- 具体请参考文章 

  <a href="https://blog.csdn.net/xushiyu1996818/article/details/100161326" target="_blank">https://blog.csdn.net/xushiyu1996818/article/details/100161326</a>



<br>

### <span id="t3">构造方法</span>

LinkedList 底层构造仅有3个字段，LinkedList 通过 `first` 和 `last` 引用分别指向链表的第一个和最后一个元素，以此达到双向链表的功能 ：

```java
    //list长度，默认为0
    transient int size = 0;
    //第一个节点
    transient Node<E> first;
    //最后一个节点
    transient Node<E> last;
```

其中 Node<E> 为内部静态类，泛型可以存放任意对象：

```java
    private static class Node<E> {
        // 当前节点对象
        E item;
        // 下一个节点对象
        Node<E> next;
        // 上一个节点对象
        Node<E> prev;
        // 构造方法为全参构造器
        Node(Node<E> prev, E element, Node<E> next) {
            this.item = element;
            this.next = next;
            this.prev = prev;
        }
    }
```

根据 Node<E> 的特性，LinkedList 的结构图如下：


![LinkedListSource3](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/LinkedListSource3.jpg)


LinkedList 构造方法有2个，无参构造器什么都没有，因此默认 LinkedList 的 `first` 和 `last` 引用均为空。

```java
    //无参构造器，所有节点默认为null
    public LinkedList() {
    }

    // 集合参数构造器
    public LinkedList(Collection<? extends E> c) {
        // 调用无参构造器，先创建list
        this();
        // 调用批量添加
        addAll(c);
    }
```



<br>

### <span id="t4">LinkedList的常用方法</span>

同一类型方法都大同小异，增删迭代都会选一个贴代码，几个个人认为比较特殊方法也会稍微介绍下。

其中一些知识点和 `ArrayList` 相同，例如：**modCount的作用** ，请直接转至  **ArrayList源码解析** 。



<br>

#### <span id="t41">add(int index, E element)</span>

涉及添加方法如下：

1. **List 接口方法：**

- add(E e)，末尾添加一个元素

- add(int index, E element)，向指定索引插入元素

- addAll(Collection<? extends E> c)，顺序批量添加 

- addAll(int index, Collection<? extends E> c)，从指定位置开始批量添加 

  

2. **Deque 接口方法：**

- addFirst(E e)，在链表开头添加元素
- addLast(E e)，在链表末尾添加元素，和 add(E e) 方法相同



添加方法 **add(int index, E element)**，向指定索引插入元素，涉及的 **private** 方法比较全面，这里贴下代码：

```java
    //在指定位置添加元素
    public void add(int index, E element) {
        //判断索引位置是否可用
        checkPositionIndex(index);
        if (index == size)
            //如果添加位置和长度相同，当前最大索引为size-1，则添加在末尾
            linkLast(element);
        else
            //在原索引位置的节点前面插入新节点
            linkBefore(element, node(index));
    }
```

这里的几个 **private** 方法 **linkLast(E e) 、node(int index)** 和 **linkBefore(E e, Node<E> succ)** 在源码中非常常用。

 **linkLast(E e)** 作用是在末尾添加新节点：

```java
    // 将元素标定为最后一个节点
    void linkLast(E e) {
        //原本最后一个节点
        final Node<E> l = last;
        //以E为值，构造新节点
        final Node<E> newNode = new Node<>(l, e, null);
        //将新节点作为最后一个节点
        last = newNode;
        //若原链表为空（最后一个节点为空），将新节点设为第一个节点
        //否则将新节点设置为，原节点的下一个节点
        if (l == null)
            first = newNode;
        else
            l.next = newNode;
        //链表长度+1
        size++;
        //操作次数+1
        modCount++;
    }
```

画个图明了得表达下


![LinkedListSource4](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/LinkedListSource4.jpg)


然后是 **linkBefore(E e, Node<E> succ)** ，在指定节点前插入，配合 **node(int index)** 获得指定索引的节点，可进行，按索引位置插入元素：

```java
    //返回指定索引的节点
    Node<E> node(int index) {
        //判断插入的位置在链表前半段或者是后半段
        //对正数，右移1位相当于除以2，保留整数
        if (index < (size >> 1)) {
            // 前半段顺序遍历
            Node<E> x = first;
            for (int i = 0; i < index; i++)
                x = x.next;
            return x;
        } else {
            // 后半段倒序遍历
            Node<E> x = last;
            for (int i = size - 1; i > index; i--)
                x = x.prev;
            return x;
        }
    }

    // 在指定节点前插入新节点
    void linkBefore(E e, Node<E> succ) {
        //获取原节点的上一个
        final Node<E> pred = succ.prev;
        //根据需要插入的元素，创建新节点，
        final Node<E> newNode = new Node<>(pred, e, succ);
        //将新节点设为原节点的前一个
        succ.prev = newNode;
        if (pred == null)
            first = newNode;
        else
            pred.next = newNode;
        //链表长度+1
        size++;
        //操作次数+1
        modCount++;
    }
```

**node(int index)** 采用双向遍历，而且采用了位移，讲道理，敲了几年代码还真没用过几次。。。。

顺便贴个示意图，不能白画10分钟画出来。。。

![LinkedListSource5](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/LinkedListSource5.jpg)


<br>

#### <span id="t42">remove(int index)</span>

涉及移除方法有：

1. **List 接口方法：**

  - remove(Object o)，移除第一个指定元素

- remove(int index)，根据索引位置删除

- clear()，清空链表

  


2. **Deque 接口方法：**

- removeFirst()，移除链表第一个节点
- removeLast()，移除链表最后一个节点，和 removeFirst() 方法相同
- remove()，移除头节点，实际上是调用 removeFirst()
- removeFirstOccurrence(Object o)，移除第一个出现的元素，内部调用了 remove(Object o)
- removeLastOccurrence(Object o)，移除最后一个出现的元素，倒序遍历，与 remove(Object o) 相反


内部调用都差不多，**remove(int index)** 作用是根据索引位置删除：

```java
    //根据索引位置删除
    public E remove(int index) {
        checkElementIndex(index);
        return unlink(node(index));
    }
    
    //判断索引节点是否可用
    private void checkElementIndex(int index) {
        if (!isElementIndex(index))
            throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
    }

    //判断索引节点是否可用
    // 和 isPositionIndex 区别就是，长度超出 1 是否可用
    private boolean isElementIndex(int index) {
        return index >= 0 && index < size;
    }
```

这里可以发现，**remove(int index)** 不能取 **size** 值，而 **add** 系列方法可以。

然后就是解除节点的连接：

```java
    // 移除指定节点
    E unlink(Node<E> x) {
        // 保存前后节点和当前节点元素值引用
        final E element = x.item;
        final Node<E> next = x.next;
        final Node<E> prev = x.prev;
        //前后判空，重新设置 first 和 last 引用
        if (prev == null) {
            first = next;
        } else {
            prev.next = next;
            x.prev = null;
        }
        if (next == null) {
            last = prev;
        } else {
            next.prev = prev;
            x.next = null;
        }
        //设置为空，帮助 GC尽快回收
        x.item = null;
        size--;
        modCount++;
        return element;
    }
```





<br>

#### <span id="t43">poll() 和 pop()</span>

除了上面提到的 **Deque 接口方法**，还有专用队列操作：

- peek()，返回第一个节点的值
- poll()，移除第一个节点，并返回第一个节点的值
- offer(E e)，在末尾添加节点
- offerFirst(E e)，在队列顶部添加节点
- offerLast(E e)，在队列底部添加节点
- peekFirst()，返回第一个节点的元素值，不移除节点
- peekLast()，返回最后一个节点的元素值，不移除节点
- pollFirst()，返回第一个节点的元素值，并移除节点
- pollLast()，返回最后一个节点的元素值，并移除节点
- push(E e)，往队列顶部添加节点
- pop()，从队列顶部弹出节点

这些方法实际上都是调用了 **List接口** 的基础方法，没有特别的地方，常用的应该就是 **pash、pop、poll** 这些，就贴个代码略过了。

```java
    //移除第一个节点，并返回第一个节点的值
    public E poll() {
        final Node<E> f = first;
        return (f == null) ? null : unlinkFirst(f);
    }
    
   // 往队列顶部添加节点
    public void push(E e) {
        addFirst(e);
    }

    // 从队列顶部弹出节点
    public E pop() {
        return removeFirst();
    }
```

**poll()** 和 **pop()** 方法其实基本相同，根据 **removeFirst()** 可以知道，**poll()** 在空链表时返回空，**pop()** 则会抛出异常

```java
    //移除链表第一个节点
    public E removeFirst() {
        final Node<E> f = first;
        if (f == null)
            throw new NoSuchElementException();
        return unlinkFirst(f);
    }
```



<br>

### <span id="t5">总结</span>

1. 对于随机访问，查询读取操作， ArrayList 优于 LinkedList，因为 LinkedList 需要移动指针。
2. 大量的增删操作使用 LinkedList，因为 ArrayList 需要创建复制数组。
3. 平时 coding 中，使用完的对象要置空，帮助 GC 回收。



<br>

### <span id="t6">参考文章</span>

<a href="https://www.pdai.tech/md/java/collection/java-collection-LinkedList.html" target="_blank">https://www.pdai.tech/md/java/collection/java-collection-LinkedList.html</a>

<a href="https://blog.csdn.net/m0_37884977/article/details/80467658" target="_blank">https://blog.csdn.net/m0_37884977/article/details/80467658</a>


