
<div class="catalog">


- [垃圾回收器的性能指标](#t0)
  - [吞吐量与暂停时间](#t01)
- [不同垃圾回收器概述](#t1)
- [不同垃圾回收器介绍](#t2)
  - [Serial GC](#t21)
  - [ParNew GC](#t22)
  - [Parallel Scavenge GC](#t23)
  - [CMS GC](#t24)
  - [G1 GC](#t25)
- [JDK 9 之后的垃圾回收器](#t3)


</div>



## <span id="t0">垃圾回收器的性能指标</span>

垃圾回收的基本性能指标如下：

- **<font color="red">吞吐量：运行用户代码的时间占总运行时间的比例。总运行时间 = 程序的运行时间 + 内存回收的时间</font>**
- **<font color="red">暂停时间：执行垃圾收集时，程序的工作线程被暂停的时间。</font>**
- **<font color="red">内存占用：Java 堆区所占的内存大小。</font>**
- 垃圾收集开销：吞吐量的补数，垃圾收集所用时间与总运行时间的比例。
- 收集频率：相对于应用程序的执行，收集操作发生的频率。
- 快速：一个对象从诞生到被回收所经历的时间。

其中比较重要的三个指标是 `吞吐量` 、 `暂停时间` 和 `内存占用` ，而且  `吞吐量` 和 `暂停时间` 是矛盾的，只能根据场景进行分辨选择。

<br/>

### <span id="t01">吞吐量与暂停时间</span>

#### 吞吐量（throughput）

吞吐量就是 CPU 用于 **运行用户代码的时间** 与CPU总消耗时间的 **百分比**：
$$
吞吐量 = 运行用户代码时间/（运行用户代码时间 + 垃圾收集时间）
$$

> 这种情况下，应用程序能容忍较高的暂停时间
>
> 因此，高吞吐量的应用程序有更长的时间基准，快速响应是不必考虑的。

**吞吐量有限意味着单位时间内 STW 时间最短。**

<br/>

#### 暂停时间（parse time）

暂停时间是指一个时间段内应用程序线程暂停，让 GC 线程执行的时间。

**暂停时间优先，意味着尽可能让单次 STW 的时间最短。**

所以低暂停时间也可以视为低延迟。

<br/>

#### 简单对比

![吞吐量VS暂停时间示意图](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/%E5%90%9E%E5%90%90%E9%87%8FVS%E6%9A%82%E5%81%9C%E6%97%B6%E9%97%B4%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

对于两个指标的对比，需要了解：

- 高吞吐量较好因为这会让应用程序的最终用户感觉只有应用程序线程在做“生产性”工作。直觉上，吞吐量越高程序运行越快。
- 对于一个交互式应用程序而言，低暂停时间(低延迟)较好因为从最终用户的角度来看，不管是 GC 还是其他原因导致一个应用被挂起始终是不好的。
- 不幸的是”高吞吐量”和”低暂停时间”是一对相互竞争的目标(矛盾)。
  - 因为如果选择以吞吐量优先，那么必然需要降低内存回收的执行频率，但是这样会导致 GC 需要更长的暂停时间来执行内存回收。
  - 相反的，如果选择以低延迟优先为原则，那么为了降低每次执行内存回收时的暂停时间，也只能频繁地执行内存回收，但这又引起了年轻代内存的缩减和导致程序吞吐量的下降。

这两个指标相互矛盾，所以现行的标准是：

> **在最大吞吐量优先的情况下，降低停顿时间。**



<br/>

## <span id="t1">不同垃圾回收器概述</span>

先区分下不同垃圾回收器的类型：

- 串行回收器：Serial、 Serial Old
- 并行回收器：ParNew、 Parallel Scavenge、 Parallel Old
- 并发回收器：CMS、G1

有的 GC 只能回收年轻代，有的只能老年代；所以在看下这个搭配图：

![垃圾收集器组合关系](https://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/%E5%9E%83%E5%9C%BE%E6%94%B6%E9%9B%86%E5%99%A8%E7%BB%84%E5%90%88%E5%85%B3%E7%B3%BB.png)

根据这个图的搭配关系，了解下以下内容：

1. **红色虚线** ：由于维护和兼容性测试的成本，在 JDK 8 时将 Serial+CMS、ParNew+Serial Old 这两个组合声明为废弃 ，并在 JDK 9 中完全取消了这些组合的支持，即:移除。
2. **绿色虚线** ：JDK 14中，弃用 Parallel Scavenge 和 Serial Old GC 组合。
3. **青色虚线** ：JDK 14 中，删除了 CMS 垃圾回收器。
4. JDK 9 开始，G1 成为默认的垃圾回收器，以替换 CMS ；JDK 11 加入 ZGC。



<br/>

## <span id="t2">不同垃圾回收器介绍</span>

不同的垃圾回收器有不同的优势。当然在日常工作中一般也就用2-3种：

|    垃圾收集器    |   分类   | 作用位置 | 使用算法 | 特点 | 适用场景 |
| :--------------: | :------: | :------: | :------: | :--: | -------- |
|    **Serial**    | 串行运行 | 年轻代 | 复制算法 | 响应速度优先 | 适用于单 CPU 环境下的client模式 |
|    **ParNew**    | 并行运行 | 年轻代 | 复制算法 | 响应速度优先 | 多 CPU 环境 Server 模式下与 CMS 配合使用 |
|   **Parallel**   | 并行运行 | 年轻代 | 复制算法 | 吞吐量优先 | 适用于后台运算而不需要太多交互的场景 |
|  **Serial Old**  | 串行运行 | 老年代 |    标记-压缩    | 响应速度优先 | 适用于单 CPU 环境下的 Client 模式 |
| **Parallel Old** | 并行运行 | 老年代 | 标记-压缩 | 吞吐量优先 | 适用于后台运算而不需要太多交互的场景 |
|     **CMS**      | 并发运行 | 老年代 | 标记-压缩 | 响应速度优先 | 适用于互联网或 B/S 业务 |
|      **G1**      | 并行、并发运行 | 年轻代和老年代 | 标记-压缩、复制 | 响应速度优先 | 面向服务端应用 |

<br/>

### <span id="t21">Serial GC</span>

Serial 收集器是最基本、历史最悠久的垃圾收集器了。JDK1. 3之 前回收新生代唯一的选择。

> Serial 收集器采用 **复制算法** 、 **串行回收** 和 "Stop-the-World" 机制的方式执行内存回收。

除了年轻代之外，Serial 收集器还提供用于执行老年代垃圾收集的 Serial Old 收集器。

- Serial Old 收集器同样也采用了串行回收和"Stop the World"机制，只不过内存回收算法使用的是 **标记-压缩算法。**
- Serial Old 在 Server 模式下主要有两个用途:
  - 与新生代的 Parallel Scavenge 配合使用。
  - 作为老年代 CMS 收集器的后备垃圾收集方案。

![Serial GC工作示意图](https://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/Serial%20GC%E5%B7%A5%E4%BD%9C%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

因为这是串行回收，只能使用一个 CPU 进行工作，目前已经很少存在单核 CPU 的服务器了。

所以只要做下了解就好了。

使用方法为 ：`-XX:+UseSerialGC` ，使用该参数将会同时启用 Serial 和 Serial Old 。 

<br/>

### <span id="t22">ParNew GC</span>

如果说 Serial GC 是年轻代中的单线程垃圾收集器，那么 ParNew 收集器则 是Serial 收集器的多线程版本。

ParNew 收集器除了采用并行回收的方式执行内存回收外，和 Serial GC 之间几乎没有任何区别，同样也是采用复制算法、"Stop-the-World"机制。

ParNew 只能收集年轻代，并且没有提供对应的老年代。

![ParNew GC工作示意图](https://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/ParNew%20GC%E5%B7%A5%E4%BD%9C%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

开发中，使用 `-XX:+UseParNewGC` 手动指定使用 ParNew 收集器执行内存回收任务。它表示年轻代使用并行收集器，不影响老年代。

`XX:ParallelGCThreads` 限制线程数量，默认开启和 CPU 数据相同的线程数（例如 4 CPU，默认开启 4 线程；如果设置超过 CPU 核数，争抢资源切换会产生额外开销）。

<br/>

### <span id="t23">Parallel Scavenge GC</span>

注意注意，个人认为这应该是第一个重头戏。。。。。因为它是 JDK8 的默认 GC。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/SS25S1SAS5X1F5DSW4.png)

Parallel Scavenge GC 同样也采用了复制算法、并行回收和 "Stop the World" 机制。

和 ParNew GC 不同，Parallel Scavenge GC 的目标则是达到一个可控制的吞吐量(Throughput)，它也被称为吞吐量优先的垃圾收集器，并且它提供了自适应调节策略。

> 高吞吐量则可以高效率地利用CPU时间，尽快完成程序的运算任务，主要适合在后台运算而不需要太多交互的任务。
>
> 因此，常见在服务器环境中使用。例如，那些执行批量处理、订单处理、工资支付、科学计算的应用程序。

JDK 6 时，Parallel 收集器在提供了用于执行老年代垃圾收集的 Parallel Old GC，用来代替老年代的Serial Old GC。Parallel Old 收集器采用了标记-压缩算法，但同样也是基于并行回收和 STW 机制。

![Parallel Scavenge GC工作示意图](https://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/Parallel%20Scavenge%20GC%E5%B7%A5%E4%BD%9C%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

**在 JDK 8 中，Parallel Scavenge GC 被采用为默认垃圾收集器。**

Parallel Scavenge GC 的配置参数较多，具体如下：

- **-XX:+UseParallelGC** ：开启 Parallel GC 进行年轻代垃圾回收，JDK 8 默认开启。只要开启默认激活老年代 Parallel Old GC .
- **-XX:+UseParallelOldGC** ：开启 Parallel Old GC 进行老年代垃圾回收，JDK 8 默认开启。只要开启默认激活年轻代 Parallel  GC .
- **-XX:ParallelGCThreads** ：设置年轻代并行收集器的线程数。一般地，最好与CPU数量相等，以避免过多的线程数影响垃圾收集性能。
  - 在默认情况下，当 CPU 数量小于8个， ParallelGCThreads 的值等于 CPU 数量。
  - 当 CPU 数量大于8个，ParallelGCThreads 的值等于 **3+ [5*CPU_Count]/8** 
- **-XX:MaxGCPauseMillis** ：设置垃圾收集器最大停顿时间(即STW的时间)。单位是毫秒。
  - 为了尽可能地把停顿时间控制在 MaxGCPauseMills 以内，收集器在工作时会调整 Java 堆大小或者其他一些参数。
  - 对于用户来讲，停顿时间越短体验越好。但是在服务器端，我们注重高并发，整体的吞吐量。
  - 该参数使用需谨慎。

- **-XX:GCTimeRatio** ：垃圾收集时间占总时间的比例。用于衡量吞吐量的大小。
  - 取值范围(0,100)。默认值99，也就是垃圾回收时间不超过1%
  - 与前一个 `-XX:MaxGCPauseMillis` 参数有一定矛盾性。暂停时间越长，Radio参数就容易超过设定的比例。
- **<font color="red">-XX:+UseAdaptiveSizePolicy</font>** ：设置 Parallel Scavenge 收集器具有自适应调节策略
  - 在这种模式下，年轻代的大小、Eden 和 Survivor 的比例、晋升老年代的对象年龄等参数会被自动调整，以达到在堆大小、吞吐量和停顿时间之间的平衡点。
  - 在手动调优比较困难的场合，可以直接使用这种自适应的方式，仅指定虚拟机的最大堆、目标的吞吐量(GCTimeRatio)和停顿时间(MaxGCPauseMills)，让虚拟机自己完成调优工作。



<br/>

### <span id="t24">CMS GC</span>

CMS GC 曾经作为跨时代的 GC，但是在 JDK 9 被 G1替换，所以这里只是简单介绍。

JDK 1.5时期，HotSpot 推出了一款在 **强交互应用** 中几乎可认为有划时代意义的垃圾收集器: CMS (Concurrent -Mark- Sweep) 收集器。

这款收集器是 HotSpot 虚拟机中第一款真正意义上的 **并发收集器** ，它第一次实现了让 **垃圾收集线程与用户线程同时工作** 。CMS 的垃圾收集算法采用标记-清除算法，并且也会 STW .

CMS 收集器的关注点是尽可能 **缩短垃圾收集时用户线程的停顿时间** 。停顿时间越短(低延迟)就越适合与用户交互的程序，良好的响应速度能提升用户体验。

目前很大一部分的 Java 应用集中在互联网站或者B/S系统的服务端上，这类应用尤其重视服务的响应速度，希望系统停顿时间最短，以给用户带来较好的体验。

![CMS GC工作示意图](https://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/CMS%20GC%E5%B7%A5%E4%BD%9C%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

简单描述下 CMS GC 的四个步骤：

1. 初始阶段：短暂 STW，标记 GC Roots 能关联的对象
2. 并发标记：从GC Roots 的直接关联对象开始遍历整个对象图的过程，这个过程耗时较长但是不需要停顿用户线程，可以与垃圾收集线程一起并发运行。
3. 重新标记：修正并发标记期间，因用户程序继续运作而导致标记产生变动的那一部分对象的标记记录，这个阶段的停顿时间通常会比初始标记阶段稍长一些，但也远比并发标记阶段的时间短。
4. 并发清除：清除已死亡的对象，释放内存。由于不需要移动存活对象，所以可以并发进行。

**由于最耗费时间的并发标记与并发清除阶段都不需要暂停工作，所以整体的回收是低停顿的。**

<br/>

### <span id="t25">G1 GC</span>

讲到垃圾收集器的第二个重头戏了。。。。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/SJ4S5W1CAW511CS5.jpg)

G1（Garbage First）是一个面向局部收集和基于 Region 的内存布局形式的垃圾收集器， 在 JDK 7 时期发布，**JDK 9 之后成为默认垃圾收集器** 。

<br/>

#### 优缺点

先看这些优点：

- G1 同时具备 **并发性和并行功能** 。
- G1 使用不同的 Region 来表示 Eden 区、Survivor 区、Old 区。和其他 GC 只负责一块不同，它同时兼顾年轻代和老年代。
- G1 避免在整个 Java 堆中进行全区域的垃圾收集，而是跟踪各个 Region 里面的垃圾堆积的价值大小（回收所获得的空间大小以及回收所需时间的经验值），在后台维护一个优先列表，每次根据允许的收集时间，优先回收价值最大的 Region，**并且缩小了回收范围** 。
- **Region 为内存回收的基本单元，Region 之间使用复制算法，但是整体可以看作标记-压缩算法。** 两种算法都可以避免碎片。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/IMG_008820200818150557.JPG)



再来看看 G1 的不足：

- **G1 需要在大内存环境才能发挥优势。至少 6-8 GB。**
- 在 GC 过程中，内存占用和额外消耗比 CMS 要高。



<br/>

#### 参数设置

- JDK 8 中，需要使用 **-XX:UseG1GC** 来开启 G1 GC。
- **-XX:G1HeapRegionSize** ：设置每个 Region 的大小，值必须为 2 的幂，范围在 1MB - 32MB 间。目标是根据最小的 Java 堆大小划分出约 2048 个区域。默认是堆内存的 1 /2000。
- **-XX:MaxGCPauseMillis** ：设置期望达到的最大 GC 停顿时间指标，默认值是200ms。（JVM会尽力实现，但不保证达到）
- **-XX:ParallelGCThread** ：设置 STW 工作线程数的值。最多设置为 8 。
- **-XX:ConcGCThreads** ：设置并发标记的线程数。将 n 设置为并行垃圾回收线程数（ParallelGCThreads）的1/4左右。
- **-XX:InitiatingHeapOccupancyPercent** ：设置触发并发 GC 周期的 Java 堆占用率阈值。超过此值，就触发GC 。默认值是45。

 G1 在最大限度上简化了配置，只需要开启 G1、设置堆最大内存、设置最大停顿空间三步即可完成全部配置。

<br/>

#### Humongous 区

![G1 Region分区示意图](https://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/G1%20Region%E5%88%86%E5%8C%BA%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

**G1 垃圾收集器还增加了一种新的内存区域，叫做 Humongous 内存区域，用于存储大对象，如果超过 1 .5 个region，就放到 H 区。**

如果一个 H 区无法容纳这个大对象，就会寻找连续空闲空间，并设定为 H 区，若没有则会进行 GC。一般把 H 区视为老年代的一部分。



<br/>

#### 工作原理

主要步骤为：

1. 当年轻代 Eden 区要用尽时，G1 启动并行独占式垃圾收集。从 Eden 区移动到 Survivor 区或 Old 区。
2. 当堆内存使用达到 45% 时，开始老年代并发标记过程。
3. 标记完成后开始混合回收。G1 GC 会将老年代存活对象移动到空闲区；只会扫描和回收一小部分老年代 Region 区域。



<br/>

## <span id="t3">JDK 9 之后的垃圾回收器</span>

因为我目前使用的依然只是 JDK8，所以只对后续的垃圾回收器进行了解。

只要是后续比较重要的 ZGC。

ZGC 的目标是：在尽可能对吞吐量影响不大的前提下，实现在任意堆内存大小下都可以把垃圾收集的停顿时间限制在十毫秒以内的低延迟。

《深入理解Java虚拟机》一书中这样定义ZGC: 

> ZGC 收集器是一款基于 Region 内存布局的，( 暂时)不设分代的，使用了读屏障、染色指针和内存多重映射等技术来实现可并发的标记-压缩算法的，以低延迟为首要目标的一款垃圾收集器。

ZGC 的工作过程可以分为4个阶段：**并发标记 - 并发预备重分配 - 并发重分配 - 并发重映射等** 。

ZGC 几乎在所有地方并发执行的，除了初始标记的是 STW 的。所以停顿时间几乎就耗费在初始标记上，这部分的实际时间是非常少的。

当然，目前还是实验阶段，什么时候正式发布再说。
