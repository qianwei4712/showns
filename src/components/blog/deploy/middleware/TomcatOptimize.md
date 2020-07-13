<div class="catalog">

- [前言](#t0)
- [开启 manager-gui](#t1)
- [Tomcat 状态解读](#t2)
- [关闭 AJP 服务](#t3)
- [设置线程池](#t4)
- [NIO 还是 APR？Connector 配置](#t5)
- [JVM 参数调整](#t6)
- [其他方式](#t7)
- [参考文章](#t8)

</div>


### <span id="t0">前言</span>

整理这篇 Tomcat优化，是因为以前从来没特地研究过，都是直接用服务器上已经有的压缩包解压使用，最多就是加大下内存，这几天心血来潮学习学习。

我用的环境是：

- JDK 1.8 
- Tomcat 版本：`apache-tomcat-8.5.49`  ，原版可在 <a href="http://www.apache.org/dist/tomcat/" target="_blank">http://www.apache.org/dist/tomcat/</a> 下载

因为最后是要上线部署的，所以我下载了 Linux 版本，而且最后成品也是 Linux 版的。

最后的成品我也给放上，不过是直接本地压缩的 RAR 包：<a href="https://github.com/qianwei4712/static-resources/blob/master/showns/software/apache-tomcat-8.5.49.rar" target="_blank">https://github.com/qianwei4712/static-resources/blob/master/showns/software/apache-tomcat-8.5.49.rar</a>

<br>

### <span id="t1">开启 manager-gui</span>

在此之前，先删除一下无用的文件（开源协议也给删了，见谅见谅）。

然后，在调试过程，先临时开启下 manager-gui，Tomcat 建议不要使用 manager-gui。

并且，在线上环境也不需要使用 manager-gui，并且也有攻击从 Tomcat 控制台进入。

现在只是临时开启，调试时查看下服务器状态。

首先 `conf/tomcat-users.xml` 文件添加：

```xml
<role rolename="manager"/>
<role rolename="manager-gui"/>
<role rolename="admin-script"/>
<role rolename="admin-gui"/>
<role rolename="manager-jmx"/>
<role rolename="manager-script"/>
<role rolename="manager-status"/>
<user username="tomcat" password="123456" roles="manager,manager-gui,admin-script,admin-gui,manager-jmx,manager-script,manager-status"/>
```

然后 `webapps/manager/META-INF/context.xml` 文件注释以下配置：

```xml
  <!--  <Valve className="org.apache.catalina.valves.RemoteAddrValve"
         allow="127\.\d+\.\d+\.\d+|::1|0:0:0:0:0:0:0:1" />   -->
```

然后启动 Tomcat 进入控制台查看运行状态。



<br>

### <span id="t2">Tomcat 状态解读</span>

![Tomcat 控制台](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/deploy/TomcatOptimize1.png)


<br>

首先看看JVM区

|       **内存池**       |    **类型**     | **初始化** | **最大值** |
| :--------------------: | :-------------: | :--------: | :--------: |
|     PS Eden Space      |   Heap memory   |  31.00 MB  | 646.50 MB  |
|       PS Old Gen       |   Heap memory   |  83.00 MB  | 1313.50 MB |
|   PS Survivor Space    |   Heap memory   |  5.00 MB   |  5.00 MB   |
|       Code Cache       | Non-heap memory |  2.43 MB   | 240.00 MB  |
| Compressed Class Space | Non-heap memory |  0.00 MB   | 1024.00 MB |
|       Metaspace        | Non-heap memory |  0.00 MB   |  -0.00 MB  |

- **PS Eden Space** ：新生带 Eden区，一个对象new 出来后会在Eden Space，直到GC到来,GC会逐一问清楚每个对象是否存在引用，进入Survivor Space（幸存区），没有引用将被kill。
- **PS Old Gen** ：老年代，主要存放生命周期长的对象
- **PS Survivor Space** ：新生带 Servivor区，幸存区。幸存者区的对象可以活段时间，GC会定期（可以自定义）会对这些对象进行访问，如果该对象的引用不存在了将被kill，如果每次访问该对象都存在引用，将被转移到老年代。（用于保存在eden space内存池中经过垃圾回收后没有被回收的对象。）
- **Code Cache** ：代码缓存区。HotSpot Java虚拟机包括一个用于编译和保存本地代码（native code）的内存。
- **Compressed Class Space** ：类指针压缩空间，存放 class 指针。
- **Metaspace** ：元空间，本质和永久代类似，元空间与永久代之间最大的区别在于：元空间并不在虚拟机中，而是使用本地内存

<br>

然后再往下，`AJP-NIO-8009` 和 `HTTP-NIO-8080` 分别是两个连接服务监听的端口。

能看到两个服务的最大线程数，活跃线程数之类的参数，后面会对这些参数进行优化。

默认使用了 NIO，JDK 8 之前默认用的好像是 BIO，现在已经优化为 NIO 了，要不要改后面再说。



<br>

### <span id="t3">关闭 AJP 服务</span>

在上面的控制台，大家可以看到 **监听8009的AJP服务** ，默认是开启的。

> AJP（Apache JServ Protocol）是定向包协议。因为性能原因，使用二进制格式来传输可读性文本。WEB 服务器通过 TCP 连接 和 SERVLET 容器连接。

它的作用是为了节省 Socket 创建的昂贵代价，WEB 服务器尝试维护一个永久的 TCP 连接到 Servlet 容器，并在多个请求和响应周期过程中复用。

然后看看它的工作原理：

![Tomcat AJP 服务](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/deploy/TomcatOptimize2.png)


注意上图是否使用 AJP服务的区别。但是现实的生产环境使用的都是：

<font color="red"> **Nginx + Tomcat 的基础架构，而 AJP 服务只有 Apache 和 IIS 服务器才能使用。** </font>

所以， 这个服务需要关闭，顺便还能省下一个端口，直接注释 AJP 连接器就好了。

```xml
    <!-- Define an AJP 1.3 Connector on port 8009 -->
    <!-- <Connector port="8009" protocol="AJP/1.3" redirectPort="8443" /> -->
```



<br>

### <span id="t4">设置线程池</span>

`Connector` 绝对是 Tomcat 配置中最核心的标签。默认的 `Connector` 配置如下：

```xml
<Connector port="8080" protocol="HTTP/1.1" connectionTimeout="20000" redirectPort="8443" />
```

默认连接器基于 HTTP/1.1 协议，监听8080端口，超时连接20秒，每一个请求都会创建一个线程。

很明显，这样创建线程的方式很浪费资源，所以 Tomcat 内置了线程池优化方式。

删掉默认连接器，默认线程池标签去掉注释，如下：

```xml
<Executor name="tomcatThreadPool" namePrefix="catalina-exec-" maxThreads="150" minSpareThreads="4"/>
<Connector executor="tomcatThreadPool" port="8080" protocol="HTTP/1.1" connectionTimeout="20000" redirectPort="8443" />
```

然后来看下 `Executor` 标签的属性：

| 标签名                      | 作用                                                         |
| --------------------------- | ------------------------------------------------------------ |
| **className**               | 用于实现此组件的java类的名称，这个类必须实现接口org.apache.catalina.Executor。不给定该属性时将采用默认的标准类org.apache.catalina.core.StandardThreadExecutor； |
| **threadPriority**          | 线程优先级，默认值为5                                        |
| **daemon**                  | 线程是否以守护线程的方式运行，默认值为true                   |
| **namePrefix**              | 执行器创建每个线程时的名称前缀，最终线程的名称为:namePrefix+threadNumber |
| **maxThreads**              | 最大并发数，默认值为200，一般建议在500~1000，根据硬件设备和业务量判断 |
| **minSpareThreads**         | 线程池中最少空闲的线程数量。默认值为25                       |
| **maxIdleTime**             | 在空闲线程关闭前的毫秒数。除非激活的线程数量小于或等于minSpareThreads的值，否则会有空闲线程的出现。默认值为60000，即空闲线程需要保留1分钟的空闲时间才被杀掉 |
| **maxQueueSize**            | 可执行任务的最大队列数，达到队列上限时的连接请求将被拒绝     |
| **prestartminSpareThreads** | 在启动executor时是否立即创建minSpareThreads个线程数，默认为false，即在需要时才创建线程 |

经过调整后，我的线程池长这样：

```xml
<Executor name="tomcatThreadPool" namePrefix="catalina-exec-" maxThreads="500"
         minSpareThreads="20" maxIdleTime="60000" maxQueueSize="150" prestartminSpareThreads="true" />
```



<br>

### <span id="t5">NIO 还是 APR？Connector 配置</span>

Tomcat8 有三种运行模式，BIO、NIO、APR。

- BIO：Tomcat 7以前的默认运行模式；阻塞IO，性能低。适用于连接数目比较小且固定的架构。
- NIO：基于缓冲区，非阻塞IO，有更好的并发性能，当然NIO更优的前提是，大量请求且请求耗时不高。Tomcat 8的默认使用方式。
- APR：Apache Portable Runtime，从操作系统层面解决io阻塞问题。需要额外安装 Linux 组件，大幅度提高性能。单从性能来说是首选，不过作者在线上环境从没用过。

在 Tomcat 8 中自带最新的 NIO2，当然用新版本咯

```xml
<Connector executor="tomcatThreadPool" URIEncoding="UTF-8"
           port="8080" protocol="org.apache.coyote.http11.Http11Nio2Protocol"
           connectionTimeout="20000"
           redirectPort="8443" />
```

然后，来看下 `Connector` 标签的参数，上面就说过，这毫无疑问是 Tomcat 最重要的标签，不过大多数情况下都不需要设置：

- `address`：指定连接器监听的地址，默认为所有地址，即0.0.0.0。
- `maxThreads`：支持的最大并发连接数，默认为200；如果引用了executor创建的共享线程池，则该属性被忽略。
- `acceptCount`：设置等待队列的最大长度；通常在tomcat所有处理线程均处于繁忙状态时，新发来的请求将被放置于等待队列中；
- `maxConnections`：允许建立的最大连接数。acceptCount和maxThreads是接受连接的最大线程数。存在一种情况，maxConnections小于acceptCount时，超出maxConnections的连接请求将被接收，但不会与之建立连接。
- `port`：监听的端口，默认为0，此时表示随机选一个端口，通常都应该显式指定监听端口。
- `protocol`：连接器使用的协议，用于处理对应的请求。默认为HTTP/1.1，此时它会自动在基于Java NIO或APR/native连接器之间进行切换。定义AJP协议时通常为AJP/1.3。
- `redirectPort`：如果某连接器支持的协议是HTTP，当接收客户端发来的HTTPS请求时，则转发至此属性定义的端口。
- `connectionTimeout`：等待客户端发送请求的超时时间，单位为毫秒，默认为60000，即1分钟；注意，这时候连接已经建立。
- `keepAliveTimeout`：长连接状态的超时时间。超出该值时，长连接将关闭。
- `enableLookups`：是否通过request.getRemoteHost()进行DNS查询以获取客户端的主机名；默认为true，应设置为false防止反解客户端主机；
- `compression`：是否压缩数据。默认为off。设置为on时表示只压缩text文本，设置为force时表示压缩所有内容。应该在压缩和sendfile之间做个权衡。
- `useSendfile`：该属性为NIO的属性，表示是否启用sendfile的功能。默认为true，启用该属性将会禁止compression属性。

只列举了一部分，全部请参考官方文档：

<a href="http://tomcat.apache.org/tomcat-8.5-doc/config/http.html" target="_blank">http://tomcat.apache.org/tomcat-8.5-doc/config/http.html</a>

<br>

### <span id="t6">JVM 参数调整</span>

Tomcat 本身还是运行在 JVM之上的，目前针对 JVM 的调优主要有两个方面：**内存调优和垃圾回收策略调优** 。

```java
export JAVA_OPTS='-Xms1024m -Xmx1024m -XX:+PrintGCDetails -server  -Xloggc:../logs/gc.log'
```

我的配置就是上面这行了，就设置了一个并行收集器，再多也感觉不到有啥差别，而且看不懂。

这部分有点高深了，我目前就是看着大佬的博客画瓢。。JVM 还没研究过，看了点文章还是看不懂，先混个脸熟以后再详细研究。

<br>

**内存调优**

1. -Xmx ：设置Java虚拟机的堆的最大可用内存大小，单位：兆(m)，整个堆大小=年轻代大小 + 年老代大小 + 持久代大小。持久代一般固定大小为64m。堆的不同分布情况，对系统会产生一定的影响。尽可能将对象预留在新生代，减少老年代GC的次数（通常老年回收起来比较慢）。实际工作中，通常将堆的初始值和最大值设置相等，这样可以减少程序运行时进行的垃圾回收次数和空间扩展，从而提高程序性能。

2. -Xms ：设置Java虚拟机的堆的初始值内存大小，单位：兆(m)，此值可以设置与-Xmx相同，以避免每次垃圾回收完成后JVM重新分配内存。

3. -Xmn ：设置年轻代内存大小，单位：兆(m)，此值对系统性能影响较大，Sun官方推荐配置为整个堆的3/8。一般在增大年轻代内存后，也会将会减小年老代大小。

4. -Xss ：设置每个线程的栈大小。JDK5.0以后每个线程栈大小为1M，以前每个线程栈大小为256K。更具应用的线程所需内存大小进行调整。在相同物理内存下，减小这个值能生成更多的线程。但是操作系统对一个进程内的线程数还是有限制的，不能无限生成，经验值在3000~5000左右。

5. -XX:NewRatio ：设置年轻代（包括Eden和两个Survivor区）与年老代的比值（除去持久代）。设置为4，则年轻代与年老代所占比值为1：4，年轻代占整个堆栈的1/5 。

6. -XX:SurvivorRatio ：设置年轻代中Eden区与Survivor区的大小比值。设置为4，则两个Survivor区与一个Eden区的比值为2:4，一个Survivor区占整个年轻代的1/6。



<br>

**垃圾回收策略调优**

Java虚拟机的垃圾回收策略一般分为：串行收集器、并行收集器和并发收集器。

这一部分垃圾回收直接引用了大佬的总结，反正我也看不懂：

具体设置如下：

```xml
JAVA_OPTS="$JAVA_OPTS -Xmx3550m -Xms3550m -Xss128k -XX:+UseParallelGC -XX:MaxGCPauseMillis=100"
```

具体的垃圾回收策略及相应策略的各项参数如下：

1. 串行收集器（JDK1.5以前主要的回收方式） ： -XX:+UseSerialGC:设置串行收集器

2. 并行收集器（吞吐量优先）
   - -XX:+UseParallelGC：选择垃圾收集器为并行收集器。此配置仅对年轻代有效。即上述配置下，年轻代使用并发收集，而年老代仍旧使用串行收集。
   - -XX:ParallelGCThreads=20：配置并行收集器的线程数，即：同时多少个线程一起进行垃圾回收。此值最好配置与处理器数目相等。
   - -XX:+UseParallelOldGC：配置年老代垃圾收集方式为并行收集。JDK6.0支持对年老代并行收集
   - -XX:MaxGCPauseMillis=100:设置每次年轻代垃圾回收的最长时间，如果无法满足此时间，JVM会自动调整年轻代大小，以满足此值。
   - -XX:+UseAdaptiveSizePolicy：设置此选项后，并行收集器会自动选择年轻代区大小和相应的Survivor区比例，以达到目标系统规定的最低相应时间或者收集频率等，此值建议使用并行收集器时，一直打开。

3. 并发收集器（响应时间优先）
   `示例：java -Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:+UseConcMarkSweepGC`
   - -XX:+UseConcMarkSweepGC：设置年老代为并发收集。测试中配置这个以后，-XX:NewRatio=4的配置失效了，原因不明。所以，此时年轻代大小最好用-Xmn设置。
   - -XX:+UseParNewGC: 设置年轻代为并行收集。可与CMS收集同时使用。JDK5.0以上，JVM会根据系统配置自行设置，所以无需再设置此值。
   - -XX:CMSFullGCsBeforeCompaction：由于并发收集器不对内存空间进行压缩、整理，所以运行一段时间以后会产生“碎片”，使得运行效率降低。此值设置运行多少次GC以后对内存空间进行压缩、整理。
   - -XX:+UseCMSCompactAtFullCollection：打开对年老代的压缩。可能会影响性能，但是可以消除碎片



<br>

### <span id="t7">其他方式</span>

1. 并发数量和业务代码有很大关系，可以通过 JMeter 测试将单台 Tomcat 调试至最大性能。然后根据该指标进行集群搭建。
2. 代码优化，这个就不说了，要点太多了，比如：访问范围尽量可能小、避免使用反射、变量尽量复用、循环中别捕捉异常等等等等。。。好的代码真的可以让系统飞起来。。。

<br>

### <span id="t8">参考文章</span>


<a href="http://tomcat.apache.org/tomcat-8.5-doc/config/http.html" target="_blank">http://tomcat.apache.org/tomcat-8.5-doc/config/http.html</a>

<a href="https://blog.csdn.net/u011240877/article/details/52949046" target="_blank">https://blog.csdn.net/u011240877/article/details/52949046</a>

<a href="https://www.bilibili.com/watchlater/#/BV1cE411Y7Am/p3" target="_blank">https://www.bilibili.com/watchlater/#/BV1cE411Y7Am/p3</a>

<a href="https://www.cnblogs.com/f-ck-need-u/p/8120008.html" target="_blank">https://www.cnblogs.com/f-ck-need-u/p/8120008.html</a>

<a href="https://blog.csdn.net/qq_35119422/article/details/81462034" target="_blank">https://blog.csdn.net/qq_35119422/article/details/81462034</a>

<a href="https://www.cnblogs.com/xwjb/articles/8302960.html" target="_blank">https://www.cnblogs.com/xwjb/articles/8302960.html</a>

<a href="https://cloud.tencent.com/developer/article/1346964" target="_blank">https://cloud.tencent.com/developer/article/1346964</a>

<a href="https://blog.51cto.com/dadloveu/2286359" target="_blank">https://blog.51cto.com/dadloveu/2286359</a>





