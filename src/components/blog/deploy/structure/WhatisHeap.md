<div class="catalog">

- [概述](#t0)
- [大顶堆和小顶堆](#t1)
- [堆的构建](#t2)
- [移除结点](#t3)
- [参考文章](#t4)

</div>

### <span id="t0">概述</span>

堆是一种 **完全二叉树** ，是一种从上到下，从左到右构建的二叉树。

> 若设二叉树的深度为h，除第 h 层外，其它各层 (1～h-1) 的结点数都达到最大个数，第 h 层所有的结点都连续集中在最左边，这就是完全二叉树。

在 **Java - PriorityQueue 源码分析** 内，对堆排序进行了讲解，。

堆是一个典型的，**用物理上线性表示逻辑上非线性的数据结构** ，用数组存储，用二叉树表示逻辑。

例如下面这个例子的下标排列顺序，数组顺序请注意结点下标：


![PriorityQueueSource3](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/PriorityQueueSource3.png)



堆的下标关系：

1. 根节点下标为0
2. 若节点 P 的下标为 i，则左孩子为 2i+1，右孩子为 2i+2
3. 若节点 P 的下标为 i，则父节点的下标为 (i-1)/2



<br>

### <span id="t1">大顶堆和小顶堆</span>

堆结构分为两种：**大顶堆和小顶堆** 。

按照字母意思就可以理解。。。

**大顶堆是根结点在整个堆中最大结点，小顶堆则相反。**

在大顶堆中，最大值是根节点，最小值却不一定，这和元素的插入顺序有关系。



<br>

### <span id="t2">堆的构建</span>

以小顶堆为例子，因为在  **PriorityQueue 源码分析** 内已经画过构建顺序图了，就直接拿来用了。

思想都是一样的，只是在实现中会有语法不同。


![PriorityQueueSource4](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/PriorityQueueSource4.png)


如上图，是在一个小顶堆中，插入一个新元素。PriorityQueue的实现过程中定义了几个中间变量，具体思路为：

1. 在按照完全二叉树的构建规则，从上到下，从左到有插入元素。

2. 新插入的元素和父元素比较

3. 按照小顶堆规则，若比父元素要小，则和父元素交换。

4. 重复上浮步骤直至父元素比它小为止


<br>

### <span id="t3">移除结点</span>

移除结点应该区分为移除根节点和移除根的子树结点。

但是，实际上两者并没有区别，先看以下图片：



![PriorityQueueSource5](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/PriorityQueueSource5.png)


和添加元素类似，思路为：

1. 先移除指定元素，然后将完全二叉树最后一个元素取出

2. 将最后一个元素放置到移除元素的位置

3. 如果它的左右子树中存在比它小的元素，或者都比它小，选择左右子树中较小的那个进行互换

4. 重复上述步骤直至为叶子结点，或者左右子树都比它大



<br>

### <span id="t4">参考文章</span>


<a href="https://zhuanlan.zhihu.com/p/85518062" target="_blank">https://zhuanlan.zhihu.com/p/85518062</a>



