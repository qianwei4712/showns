<div class="catalog">

- [前言](#t1)
- [排序算法概述](#t2)
  - [算法分类](#t21)
  - [算法比较](#t22)
- [算法实现](#t3)
  - [冒泡排序](#31)
  - [选择排序](#32)
  - [插入排序](#33)
  - [希尔排序](#34)
  - [归并排序](#35)
  - [快速排序](#36)
  - [堆排序](#37)
  - [计数排序](#38)
  - [桶排序](#39)
  - [基数排序](#310)
- [各排序算法应用场景](#4)
- [参考文章](#te)

</div>



### <span id="t1">前言</span>

排序算法应该是各大论坛都写透了，基本都没有什么东西可以挖了。这里应该是一个转载文章。

这篇只能算是我的学习笔记，从各位大佬那东拼西凑的记录。。所有的引用博客请查阅 [参考文章](#te) 。

毕竟自己写过的，整理完的，以后要用了翻起来、用起来也顺手点。



<br>

### <span id="t2">排序算法概述</span>

#### <span id="t21">算法分类</span>

1. 按照是否在内存运行，排序算法可以分为 **内部排序** 和 **外部排序** 。 

- **内部排序：**数据记录在内存中进行排序
- **外部排序：**因排序的数据很大，一次不能容纳全部的排序记录，在排序过程中需要访问外存

<img src="@/assets/blog/img/algorithm/SortingAlgorithm1.jpg"/>



2.按照是否线性时间，，排序算法可以分为 **非线性时间比较类排序** 和 **线性时间非比较类排序** 。

- **非线性时间比较类排序：**通过比较来决定元素间的相对次序，由于其时间复杂度不能突破O(nlogn)，因此称为非线性时间比较类排序。

- **线性时间非比较类排序：**不通过比较来决定元素间的相对次序，它可以突破基于比较排序的时间下界，以线性时间运行，因此称为线性时间非比较类排序。

<img src="@/assets/blog/img/algorithm/SortingAlgorithm2.jpg"/>



#### <span id="t22">算法比较</span>

先介绍下相关概念：

- **稳定：**如果 元素a 原本在 元素b 前面且 a=b，排序之后 a 仍然在 b 的前面。
- **不稳定：**如果 元素a 原本在 元素b 的前面且 a=b，排序之后 a 可能会出现在 b 的后面。
- **时间复杂度：**对排序数据的总的操作次数。反映当 n 变化时，操作次数呈现什么规律。
- **空间复杂度：**是指算法在计算机内执行时所需存储空间的度量，它也是数据规模 n 的函数。
- **n:**  数据规模
- **k:**  “桶”的个数
- **In-place:**  占用常数内存，不占用额外内存
- **Out-place:**  占用额外内存

各数组排序算法复杂度比较如下：

<img src="@/assets/blog/img/algorithm/SortingAlgorithm3.png"/>

菜鸟教程摘的另一张图：

<img src="@/assets/blog/img/algorithm/SortingAlgorithm4.png"/>



**关于时间复杂度**：

1. 平方阶 (**O(n²)**) 排序：各类简单排序， 直接插入、直接选择和冒泡排序。
2. 线性对数阶 (**O(n log² n)**) 排序： 快速排序、堆排序和归并排序；
3. **O(n + §)** 排序，§ 是介于 0 和 1 之间的常数： 希尔排序
4. 线性阶 (**O(n)**) 排序： 基数排序，此外还有桶、箱排序。



**关于稳定性**：

1. 稳定的排序算法：冒泡排序、插入排序、归并排序、基数排序。
2. 不是稳定的排序算法：选择排序、快速排序、希尔排序、堆排序。





<br>

### <span id="t3">排序算法概述</span>

这里只摘录了数组排序，没有针对链表排序的是实现。

<br>

#### <span id="t31">1、冒泡排序（Bubble Sort）</span>

冒泡排序（Bubble Sort）也是一种简单直观的排序算法。它重复地走访过要排序的数列，一次比较两个元素，如果他们的顺序错误就把他们交换过来。走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。这个算法的名字由来是因为越小的元素会经由交换慢慢“浮”到数列的顶端。

作为最简单的排序算法之一，冒泡排序给我的感觉就像 Abandon 在单词书里出现的感觉一样，每次都在第一页第一位，所以最熟悉。冒泡排序还有一种优化算法，就是立一个 flag，当在一趟序列遍历中元素没有发生交换，则证明该序列已经有序。但这种改进对于提升性能来说并没有什么太大作用。

**算法步骤**

1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。
2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。这步做完后，最后的元素会是最大的数。
3. 针对所有的元素重复以上的步骤，除了最后一个。
4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/bubbleSort.gif)



```java
    public static double[] bubbleSort(double[] source) {
        // 对 arr 进行拷贝，不改变参数内容
        double[] arr = Arrays.copyOf(source, source.length);
        for (int i = 1; i < arr.length; i++) {
            // 设定一个标记，若为true，则表示此次循环没有进行交换，也就是待排序列已经有序，排序已经完成。
            boolean flag = true;
            for (int j = 0; j < arr.length - i; j++) {
                if (arr[j] > arr[j + 1]){
                    double temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    flag = false;
                }
            }
            if (flag) {
                break;
            }
        }
        return arr;
    }
```



**时间复杂度：**平均时间复杂度为O(n²)，最好时间复杂度为O(n)，最坏时间复杂度为O(n²)

**最好情况：**如果待排序元素本来是正序的，那么一趟冒泡排序就可以完成排序工作，比较和移动元素的次数分别是 (n - 1) 和 0，因此最好情况的时间复杂度为O(n)。

**最坏情况：**如果待排序元素本来是逆序的，需要进行 (n - 1) 趟排序，所需比较和移动次数分别为 n * (n - 1) / 2和 3 * n * (n-1) / 2。因此最坏情况下的时间复杂度为O(n²)。

 **稳定性：**当 array[j] == array[j+1] 的时候，我们不交换 array[i] 和 array[j]，所以冒泡排序是稳定的。



<br>

#### <span id="t32">2、选择排序（Selection Sort）</span>

选择排序是一种简单直观的排序算法，无论什么数据进去都是 O(n²) 的时间复杂度。所以用到它的时候，数据规模越小越好。唯一的好处可能就是不占用额外的内存空间了吧。

**算法步骤**

1. 首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置
2. 再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。
3. 重复第二步，直到所有元素均排序完毕。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/selectionSort.gif)

```java
    public static double[] selectionSort(double[] source){
        // 对 arr 进行拷贝，不改变参数内容
        double[] arr = Arrays.copyOf(source, source.length);

        for (int i = 0; i < arr.length - 1; i++) {
            int minIndex = i;
            // 每轮需要比较的次数 N-i
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[minIndex]) {
                    // 记录目前能找到的最小值元素的下标
                    minIndex = j;
                }
            }
            // 将找到的最小值和i位置所在的值进行交换
            if (i != minIndex) {
                double tmp = arr[i];
                arr[i] = arr[minIndex];
                arr[minIndex] = tmp;
            }
        }
        return arr;
    }
```

**时间复杂度：**简单选择排序平均时间复杂度为O(n²)，最好时间复杂度为O(n²)，最坏时间复杂度为O(n²)。

**最好情况：**如果待排序元素本来是正序的，则移动元素次数为 0，但需要进行 n * (n - 1) / 2 次比较。

**最坏情况：**如果待排序元素中第一个元素最大，其余元素从小到大排列，则仍然需要进行 n * (n - 1) / 2 次比较，且每趟排序都需要移动 3 次元素，即移动元素的次数为3 * (n - 1)次。
**需要注意的是，简单选择排序过程中需要进行的比较次数与初始状态下待排序元素的排列情况无关。**

 **稳定性：**简单选择排序不稳定，比如序列 2、4、2、1，我们知道第一趟排序第 1 个元素 2 会和 1 交换，那么原序列中 2 个 2 的相对前后顺序就被破坏了，所以简单选择排序不是一个稳定的排序算法。



<br>

#### <span id="t33">3、插入排序（Insertion Sort）</span>

插入排序的代码实现虽然没有冒泡排序和选择排序那么简单粗暴，但它的原理应该是最容易理解的了，因为只要打过扑克牌的人都应该能够秒懂。插入排序是一种最简单直观的排序算法，它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/insertionSort.gif)

```java
    public static double[] insertionSort(double[] source){
        // 对 arr 进行拷贝，不改变参数内容
        double[] arr = Arrays.copyOf(source, source.length);
        // 从下标为1的元素开始选择合适的位置插入，因为下标为0的只有一个元素，默认是有序的
        for (int i = 1; i < arr.length - 1; i++) {
            // 记录要插入的数据
            double tmp = arr[i];
            // 从已经排序的序列最右边的开始比较，找到比其小的数
            int j = i;
            while (j > 0 && tmp < arr[j - 1]) {
                arr[j] = arr[j - 1];
                j--;
            }
            // 存在比其小的数，插入
            if (j != i) {
                arr[j] = tmp;
            }
        }
        return arr;
    }
```

**时间复杂度：**直接插入排序平均时间复杂度为O(n²)，最好时间复杂度为O(n)，最坏时间复杂度为O(n²)。

**最好情况：**如果待排序元素本来是正序的，比较和移动元素的次数分别是 (n - 1) 和 0，因此最好情况的时间复杂度为O(n)。

**最坏情况：**如果待排序元素本来是逆序的，需要进行 (n - 1) 趟排序，所需比较和移动次数分别为 n * (n - 1) / 2和 n * (n - 1) / 2。因此最坏情况下的时间复杂度为O(n²)。



<br>

#### <span id="t34">4、希尔排序（Shell Sort）</span>

希尔排序，也称递减增量排序算法，是插入排序的一种更高效的改进版本。但希尔排序是非稳定排序算法。

希尔排序是基于插入排序的以下两点性质而提出改进方法的：

- 插入排序在对几乎已经排好序的数据操作时，效率高，即可以达到线性排序的效率；
- 但插入排序一般来说是低效的，因为插入排序每次只能将数据移动一位；

希尔排序的基本思想是：先将整个待排序的记录序列分割成为若干子序列分别进行直接插入排序，待整个序列中的记录“基本有序”时，再对全体记录进行依次直接插入排序。

**算法步骤**

1. 选择一个增量序列 t1，t2，……，tk，其中 ti > tj, tk = 1；
2. 按增量序列个数 k，对序列进行 k 趟排序；
3. 每趟排序，根据对应的增量 ti，将待排序列分割成若干长度为 m 的子序列，分别对各子表进行直接插入排序。仅增量因子为 1 时，整个序列作为一个表来处理，表长度即为整个序列的长度。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/ShellSort.webp)

```java
   public static double[] shellSort(double[] source){
        // 对 arr 进行拷贝，不改变参数内容
        double[] arr = Arrays.copyOf(source, source.length);
        int gap = 1;
        while (gap < arr.length/3) {
            gap = gap * 3 + 1;
        }
        while (gap > 0) {
            for (int i = gap; i < arr.length; i++) {
                double tmp = arr[i];
                int j = i - gap;
                while (j >= 0 && arr[j] > tmp) {
                    arr[j + gap] = arr[j];
                    j -= gap;
                }
                arr[j + gap] = tmp;
            }
            gap = (int) Math.floor(gap / 3);
        }
        return arr;
    }
```



**时间复杂度：** 希尔排序平均时间复杂度为O(nlogn)，最好时间复杂度为O(nlog²n)，最坏时间复杂度为O(nlog²n)。希尔排序的时间复杂度与增量序列的选取有关。

**稳定性：**由于相同的元素可能在各自的序列中插入排序，最后其稳定性就会被打乱，比如序列 2、4、1、2，所以希尔排序是不稳定的。



<br>

#### <span id="t35">5、归并排序（Merge Sort）</span>

归并排序（Merge sort）是建立在归并操作上的一种有效的排序算法。该算法是采用分治法（Divide and Conquer）的一个非常典型的应用。

作为一种典型的分而治之思想的算法应用，归并排序的实现由两种方法：

- 自上而下的递归（所有递归的方法都可以用迭代重写，所以就有了第 2 种方法）；
- 自下而上的迭代；

在《数据结构与算法 JavaScript 描述》中，作者给出了自下而上的迭代方法。但是对于递归法，作者却认为：

> However, it is not possible to do so in JavaScript, as the recursion goes too deep for the language to handle.
>
> 然而，在 JavaScript 中这种方式不太可行，因为这个算法的递归深度对它来讲太深了。

说实话，我不太理解这句话。意思是 JavaScript 编译器内存太小，递归太深容易造成内存溢出吗？还望有大神能够指教。

和选择排序一样，归并排序的性能不受输入数据的影响，但表现比选择排序好的多，因为始终都是 O(nlogn) 的时间复杂度。代价是需要额外的内存空间。

**算法步骤**

1. 申请空间，使其大小为两个已经排序序列之和，该空间用来存放合并后的序列；
2. 设定两个指针，最初位置分别为两个已经排序序列的起始位置；
3. 比较两个指针所指向的元素，选择相对小的元素放入到合并空间，并移动指针到下一位置；
4. 重复步骤 3 直到某一指针达到序列尾；
5. 将另一序列剩下的所有元素直接复制到合并序列尾。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/mergeSort.gif)

```java
   public static double[] mergeSort(double[] source){
        // 对 arr 进行拷贝，不改变参数内容
        double[] arr = Arrays.copyOf(source, source.length);
        if (arr.length < 2) {
            return arr;
        }
        int middle = (int) Math.floor(arr.length / 2);
        double[] left = Arrays.copyOfRange(arr, 0, middle);
        double[] right = Arrays.copyOfRange(arr, middle, arr.length);

        return merge(mergeSort(left), mergeSort(right));
    }

    protected static double[] merge(double[] left, double[] right) {
        double[] result = new double[left.length + right.length];
        int i = 0;
        while (left.length > 0 && right.length > 0) {
            if (left[0] <= right[0]) {
                result[i++] = left[0];
                left = Arrays.copyOfRange(left, 1, left.length);
            } else {
                result[i++] = right[0];
                right = Arrays.copyOfRange(right, 1, right.length);
            }
        }
        while (left.length > 0) {
            result[i++] = left[0];
            left = Arrays.copyOfRange(left, 1, left.length);
        }

        while (right.length > 0) {
            result[i++] = right[0];
            right = Arrays.copyOfRange(right, 1, right.length);
        }

        return result;
    }
```

 **时间复杂度：**归并排序平均时间复杂度为O(nlogn)，最好时间复杂度为O(nlogn)，最坏时间复杂度为O(nlogn)。
 归并排序的形式就是一棵二叉树，它需要遍历的次数就是二叉树的深度，而根据完全二叉树的可以得出它在任何情况下时间复杂度均是O(nlogn)。

<br>

#### <span id="t36">6、快速排序（Quick Sort）</span>

快速排序是由东尼·霍尔所发展的一种排序算法。在平均状况下，排序 n 个项目要 Ο(nlogn) 次比较。在最坏状况下则需要 Ο(n2) 次比较，但这种状况并不常见。事实上，快速排序通常明显比其他 Ο(nlogn) 算法更快，因为它的内部循环（inner loop）可以在大部分的架构上很有效率地被实现出来。

快速排序使用分治法（Divide and conquer）策略来把一个串行（list）分为两个子串行（sub-lists）。

快速排序又是一种分而治之思想在排序算法上的典型应用。本质上来看，快速排序应该算是在冒泡排序基础上的递归分治法。

快速排序的名字起的是简单粗暴，因为一听到这个名字你就知道它存在的意义，就是快，而且效率高！它是处理大数据最快的排序算法之一了。虽然 Worst Case 的时间复杂度达到了 O(n²)，但是人家就是优秀，在大多数情况下都比平均时间复杂度为 O(n logn) 的排序算法表现要更好，可是这是为什么呢，我也不知道。好在我的强迫症又犯了，查了 N 多资料终于在《算法艺术与信息学竞赛》上找到了满意的答案：

> 快速排序的最坏运行情况是 O(n²)，比如说顺序数列的快排。但它的平摊期望时间是 O(nlogn)，且 O(nlogn) 记号中隐含的常数因子很小，比复杂度稳定等于 O(nlogn) 的归并排序要小很多。所以，对绝大多数顺序性较弱的随机数列而言，快速排序总是优于归并排序。

**算法步骤**

1. 从数列中挑出一个元素，称为 “基准”（pivot）;
2. 重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区退出之后，该基准就处于数列的中间位置。这个称为分区（partition）操作；
3. 递归地（recursive）把小于基准值元素的子数列和大于基准值元素的子数列排序；

递归的最底部情形，是数列的大小是零或一，也就是永远都已经被排序好了。虽然一直递归下去，但是这个算法总会退出，因为在每次的迭代（iteration）中，它至少会把一个元素摆到它最后的位置去。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/quickSort.gif)

```java
    public static double[] quickSort(double[] source){
        // 对 arr 进行拷贝，不改变参数内容
        double[] arr = Arrays.copyOf(source, source.length);
        return quickSort(arr, 0, arr.length - 1);
    }
    private static double[] quickSort(double[] arr, int left, int right) {
        if (left < right) {
            int partitionIndex = partition(arr, left, right);
            quickSort(arr, left, partitionIndex - 1);
            quickSort(arr, partitionIndex + 1, right);
        }
        return arr;
    }
    private static int partition(double[] arr, int left, int right) {
        // 设定基准值（pivot）
        int pivot = left;
        int index = pivot + 1;
        for (int i = index; i <= right; i++) {
            if (arr[i] < arr[pivot]) {
                swap(arr, i, index);
                index++;
            }
        }
        swap(arr, pivot, index - 1);
        return index - 1;
    }
    private static void swap(double[] arr, int i, int j) {
        double temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
```





<br>

#### <span id="t37">7、堆排序（Heap Sort）</span>

堆排序（Heapsort）是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。堆排序可以说是一种利用堆的概念来排序的选择排序。分为两种方法：

1. 大顶堆：每个节点的值都大于或等于其子节点的值，在堆排序算法中用于升序排列；
2. 小顶堆：每个节点的值都小于或等于其子节点的值，在堆排序算法中用于降序排列；

堆排序的平均时间复杂度为 Ο(nlogn)。

**算法步骤**

1. 将待排序序列构建成一个堆 H[0……n-1]，根据（升序降序需求）选择大顶堆或小顶堆；
2. 把堆首（最大值）和堆尾互换；
3. 把堆的尺寸缩小 1，并调用 shift_down(0)，目的是把新的数组顶端数据调整到相应位置；
4. 重复步骤 2，直到堆的尺寸为 1。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/heapSort.gif)

```java
    public static double[] heapSort(double[] source){
        // 对 arr 进行拷贝，不改变参数内容
        double[] arr = Arrays.copyOf(source, source.length);
        int len = arr.length;
        buildMaxHeap(arr, len);
        for (int i = len - 1; i > 0; i--) {
            swap(arr, 0, i);
            len--;
            heapify(arr, 0, len);
        }
        return arr;
    }
    private static void buildMaxHeap(double[] arr, int len) {
        for (int i = (int) Math.floor(len / 2); i >= 0; i--) {
            heapify(arr, i, len);
        }
    }
    private static void heapify(double[] arr, int i, int len) {
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        int largest = i;
        if (left < len && arr[left] > arr[largest]) {
            largest = left;
        }
        if (right < len && arr[right] > arr[largest]) {
            largest = right;
        }
        if (largest != i) {
            swap(arr, i, largest);
            heapify(arr, largest, len);
        }
    }
    private static void swap(double[] arr, int i, int j) {
        double temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
```

**时间复杂度：**堆排序平均时间复杂度为O(nlogn)，最好时间复杂度为O(nlogn)，最坏时间复杂度为O(nlogn)。
 堆排序的形式就是一棵二叉树，它需要遍历的次数就是二叉树的深度，而根据完全二叉树的可以得出它在任何情况下时间复杂度均是O(nlogn)。



<br>

#### <span id="t38">8、计数排序（Counting Sort）</span>

计数排序的核心在于将输入的数据值转化为键存储在额外开辟的数组空间中。作为一种线性时间复杂度的排序，计数排序要求输入的数据必须是有确定范围的整数。

 **算法描述**

1. 找出待排序的数组中最大和最小的元素；
2. 统计数组中每个值为 i 的元素出现的次数，存入数组C的第i项；
3. 对所有的计数累加（从C中的第一个元素开始，每一项和前一项相加）；
4. 反向填充目标数组：将每个元素 i 放在新数组的第C(i)项，每放一个元素就将C(i)减去1。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/countingSort.gif)



```java
    public static int[] countingSort(int[] source) {
        // 对 arr 进行拷贝，不改变参数内容
        int[] arr = Arrays.copyOf(source, source.length);
        int maxValue = getMaxValue(arr);
        return countingSort(arr, maxValue);
    }
    private static int[] countingSort(int[] arr, int maxValue) {
        int bucketLen = maxValue + 1;
        int[] bucket = new int[bucketLen];
        for (int value : arr) {
            bucket[value]++;
        }
        int sortedIndex = 0;
        for (int j = 0; j < bucketLen; j++) {
            while (bucket[j] > 0) {
                arr[sortedIndex++] = j;
                bucket[j]--;
            }
        }
        return arr;
    }
    private static int getMaxValue(int[] arr) {
        int maxValue = arr[0];
        for (int value : arr) {
            if (maxValue < value) {
                maxValue = value;
            }
        }
        return maxValue;
    }
```



<br>

#### <span id="t39">9、桶排序（Bucket Sort）</span>

桶排序是计数排序的升级版。它利用了函数的映射关系，高效与否的关键就在于这个映射函数的确定。为了使桶排序更加高效，我们需要做到这两点：

1. 在额外空间充足的情况下，尽量增大桶的数量
2. 使用的映射函数能够将输入的 N 个数据均匀的分配到 K 个桶中

同时，对于桶中元素的排序，选择何种比较排序算法对于性能的影响至关重要。

**算法描述**

1. 设置一个定量的数组当作空桶；
2. 遍历输入数据，并且把数据一个一个放到对应的桶里去；
3. 对每个不是空的桶的桶内元素进行排序（可以使用直接插入排序等）；
4. 从不是空的桶里把排好序的数据拼接起来。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/bucketSort.gif)

```java
public static int[] bucketSort(int[] array){
        int max = Integer.MIN_VALUE;
        int min = Integer.MAX_VALUE;
        for(int i = 0; i < array.length; i++){
            max = Math.max(max, array[i]);
            min = Math.min(min, array[i]);
        }

        /*桶映射函数：自己设计，要保证桶 i 的数均小于桶 j （i < j）的数，
         即必须桶间必须有序，桶内可以无序。这里桶映射函数为：(i - min) / arr.length*/
        int bucketNum = (max - min) / array.length + 1;
        ArrayList<ArrayList<Integer>> bucketArr = new ArrayList<>(bucketNum);
        for(int i = 0; i < bucketNum; i++){
            bucketArr.add(new ArrayList<Integer>());
        }
        //将每个元素放入桶
        for(int i = 0; i < array.length; i++){
            int num = (array[i] - min) / (array.length);
            bucketArr.get(num).add(array[i]);
        }

        //对每个桶进行排序
        for(int i = 0; i < bucketArr.size(); i++){
            Collections.sort(bucketArr.get(i));
        }

        int k = 0;
        for(int i = 0; i < bucketArr.size(); i++){
            for(int j = 0;j < bucketArr.get(i).size();j++) {
                array[k++] = bucketArr.get(i).get(j);
            }
        }
        return array;
    }
```



<br>

#### <span id="t310">10、基数排序（Radix Sort）</span>

基数排序是一种非比较型整数排序算法，其原理是将整数按位数切割成不同的数字，然后按每个位数分别比较。由于整数也可以表达字符串（比如名字或日期）和特定格式的浮点数，所以基数排序也不是只能使用于整数。

**基数排序 vs 计数排序 vs 桶排序**

基数排序有两种方法：

这三种排序算法都利用了桶的概念，但对桶的使用方法上有明显差异案例看大家发的：

- 基数排序：根据键值的每位数字来分配桶；
- 计数排序：每个桶只存储单一键值；
- 桶排序：每个桶存储一定范围的数值；

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/radixSort.gif)

```java
    public static int[] radixSort(int[] sourceArray){
        // 对 arr 进行拷贝，不改变参数内容
        int[] arr = Arrays.copyOf(sourceArray, sourceArray.length);

        int maxDigit = getMaxDigit(arr);
        return radixSort(arr, maxDigit);
    }
    //获取最高位数
    private static int getMaxDigit(int[] arr) {
        int maxValue = getMaxValue(arr);
        return getNumLenght(maxValue);
    }
    private static int getMaxValue(int[] arr) {
        int maxValue = arr[0];
        for (int value : arr) {
            if (maxValue < value) {
                maxValue = value;
            }
        }
        return maxValue;
    }
    protected static int getNumLenght(long num) {
        if (num == 0) {
            return 1;
        }
        int lenght = 0;
        for (long temp = num; temp != 0; temp /= 10) {
            lenght++;
        }
        return lenght;
    }
    private static int[] radixSort(int[] arr, int maxDigit) {
        int mod = 10;
        int dev = 1;

        for (int i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
            // 考虑负数的情况，这里扩展一倍队列数，其中 [0-9]对应负数，[10-19]对应正数 (bucket + 10)
            int[][] counter = new int[mod * 2][0];
            for (int j = 0; j < arr.length; j++) {
                int bucket = ((arr[j] % mod) / dev) + mod;
                counter[bucket] = arrayAppend(counter[bucket], arr[j]);
            }

            int pos = 0;
            for (int[] bucket : counter) {
                for (int value : bucket) {
                    arr[pos++] = value;
                }
            }
        }
        return arr;
    }

    /**
     * 自动扩容，并保存数据
     */
    private static int[] arrayAppend(int[] arr, int value) {
        arr = Arrays.copyOf(arr, arr.length + 1);
        arr[arr.length - 1] = value;
        return arr;
    }
```

### <span id="t4">各排序算法应用场景及选择</span>


1. 若 n 较小（如n ≤ 50）时，可采用直接插入或简单选择排序。

2. 若元素初始状态基本有序（正序），直接插入、冒泡或快速排序为宜。

3. 若 n 较大，则应采用时间复杂度为O(nlogn)的排序方法：快速排序、堆排序或归并排序。
    
    3.1 快速排序是目前基于比较的内部排序中被认为是最好的方法，当待排序的关键字是随机分布时，快速排序的平均时间最短。

    3.2 堆排序所需的辅助空间少于快速排序，并且不会出现快速排序可能出现的最坏情况。这两种排序都是不稳定的。

    3.3 若要求排序稳定，则可选用归并排序。但本文介绍的从单个记录起进行两两归并的归并排序算法并不值得提倡，通常可以将它和直接插入排序结合在一起使用。先利用直接插入排序求得较长的有序数列，然后再两两归并之。因为直接插入排序是稳定的，所以改进后的归并排序仍是稳定的。

4. 当范围已知，且空间不是很重要的情况下可以考虑使用桶排序。




<br>

### <span id="te">参考文章</span>

<a href="https://zhuanlan.zhihu.com/p/98436383" target="_blank">https://zhuanlan.zhihu.com/p/98436383</a>

<a href="https://www.runoob.com/w3cnote/ten-sorting-algorithm.html" target="_blank">https://www.runoob.com/w3cnote/ten-sorting-algorithm.html</a>

<a href="https://www.cnblogs.com/guoyaohua/p/8600214.html" target="_blank">https://www.cnblogs.com/guoyaohua/p/8600214.html</a>

<a href="https://github.com/hustcc/JS-Sorting-Algorithm" target="_blank">https://github.com/hustcc/JS-Sorting-Algorithm</a>

<a href="https://www.jianshu.com/p/47170b1ced23" target="_blank">https://www.jianshu.com/p/47170b1ced23</a>

<a href="https://blog.csdn.net/java_1996/article/details/87113496" target="_blank">https://blog.csdn.net/java_1996/article/details/87113496</a>

<a href="https://blog.csdn.net/wang18741337665/article/details/82120413" target="_blank">https://blog.csdn.net/wang18741337665/article/details/82120413</a>

<a href="https://zhuanlan.zhihu.com/p/34894768" target="_blank">https://zhuanlan.zhihu.com/p/34894768</a>







