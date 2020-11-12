<div class="catalog">

- [本文概述](#t0)
- [故障处理命令](#t1)
  - [jps:虚拟机进程状况工具](#t11)
  - [jstat:虚拟机统计信息监视工具](#t12)
  - [jinfo:Java配置信息工具](#t13)
  - [jmap:Java内存映像工具](#t14)
- [可视化处理工具](#t2)

</div>



## <span id="t0">本文概述</span>

本文就不详细介绍了，也就列举一下常用的命令和工具。

<br/>

## <span id="t1">故障处理命令</span>



### <span id="t11">jps:虚拟机进程状况工具</span>

jps（JVM Process Tool）虚拟机进程状况工具，它的功能和 Unix 的 ps 命令类似：

> **可以列出正在运行的虛拟机进程，并显示虚拟机执行主类名称（Main Class，main() 函数所在的类），以及这些进程的本地虛拟机唯一ID ( LVMID， Local Virtual Machine Identifier) 。**
>
> 而对本地虚拟机而言，LVMID 和进程 ID是一致的。

就像 ps 一样，它绝对是高频使用的命令。

使用方式如下：

```shell
jps [options] [hostid]
```

可选参数如下：

| 选项 | 作用                                                     |
| :--: | :------------------------------------------------------- |
|  -q  | 只输出 LVMID、缺省主类的名称                             |
|  -m  | 输出虚拟机进程启动时传递给主类 main() 函数的参数         |
|  -l  | 输出主类的全名，如果进程执行的是 JAR 包，则输出 JAR 路径 |
|  -v  | 输出虚拟机进程启动时的 JVM 参数                          |

使用案例：

```shell
C:\Users\qw>jps
1040 Launcher
11424 Jps
14496
14716 RemoteMavenServer
4332 SyncTest
```

<br/>

### <span id="t12">jstat:虚拟机统计信息监视工具</span>

> **jstat（ JVM Statistics Monitoring Tool ）是用于监视虚拟机各种运行状态信息的命令行工具。**

它可以显示本地或者远程虚拟机进程中的类加载、内存、垃圾收集、即时编译等运行时数据。

在没有 GUI 图形界面、只提供了纯文本控制台环境的服务器上，它将是运行期定位虚拟机性能问题的常用工具。

参数如下：

|       选项        | 作用                                                         |
| :---------------: | ------------------------------------------------------------ |
|      -class       | 监视类加载、卸载数量、总空间以及类装载所耗费的时间           |
|        -gc        | 监视 Java 堆状况，包括 Eden 区、2个 Survivor 区、老年代、永久代等的容量，已用空间，垃圾收集时间合计等信息 |
|    -gccapacity    | 监视内容与 -gc 基本相同，但输出主要关注 Java 堆各个区域使用到的最大、最小空间 |
|      -gcutil      | 监视内容与 -gc 基本相同，但输出主要关注已使用空间占总空间的百分比 |
|     -gccause      | 与 -gcutil 功能一样， 但是会额外输出导致上一次垃圾收集产生的原因 |
|      -gcnew       | 监视新生代垃圾收集状况                                       |
|  -gcnewcapacity   | 监视内容与 -gcnew 基本相同，输出主要关注使用到的最大、最小空间 |
|      -gcold       | 监视老年代垃圾收集状况                                       |
|  -gcoldcapacity   | 监视内容与 -gcold 基本相同，输出主要关注使用到的最大、最小空间 |
|     -compiler     | 输出即时编译器编译过的方法、耗时等信息                       |
| -printcompilation | 输出已经被即时编译的方法                                     |

详细的就不讲了，用到了再百度吧，，



<br/>

### <span id="t13">jinfo:Java配置信息工具</span>

> jinfo ( Configuration Info for Java) 的作用是实时查看和调整虚拟机各项参数。

使用 jps 命令的 -v 参数可以查看虚拟机启动时显式指定的参数列表，但如果想知道未被显式指定的参数的系统默认值，除了去找资料外，就只能使用 jinfo 的 -flag 选项进行查询了。

```shell
jinfo -flag 参数 pid
```

例如：

```shell
C:\Users\qw>jinfo -flag ParallelGCThreads 16376
-XX:ParallelGCThreads=4
```

<br/>

### <span id="t14">jmap:Java内存映像工具</span>

> **jmap ( Memory Map for Java)命令用于生成堆转储快照( 一般称为heapdump或dump文件 )。**

jmap 的作用并不仅仅是为了获取堆转储快照，它还可以查询 finalize 执行队列、Java 堆和方法区的详细信息，如空间使用率、当前用的是哪种收集器等。

jmap 的主要选项：

|      选项      | 作用                                                         |
| :------------: | ------------------------------------------------------------ |
|     -dump      | 生成 Java 堆转储快照。格式为 -dump:[live,]format=b,file=<filename>，其中live子参数说明是否只 dump 出存活的对象 |
| -finalizerinfo | 显示在 F-Queue 中等待 Finalizer 线程执行 finalize 方法的对象。只在 Linux/Solaris 平台下有效 |
|     -heap      | 显示 Java 堆详细信息，如使用哪种回收器、参数配置、分代状况等。只在 Linux/Solaris 平台下有效 |
|     -histo     | 显示堆中对象统计信息，包括类、实例数量、合计容量             |
|   -permstat    | 以 ClassLoader 为统计口径显示永久代内存状态。只在 Linux/Solaris 平台下有效 |
|       -F       | 当虚拟机进程对-dump选项没有响应时，可使用这个选项强制生成 dump 快照。只在  Linux/Solaris 平台下有效 |

使用示例：

```shell
C:\Users\qw>jmap -dump:live,format=b,file=myjmapfile.out 15488
Heap dump file created
```



<br/>

## <span id="t2">可视化处理工具</span>

- VisualVM:多合-故障处理工具
- JHSDB：基于服务性代理的调试工具
- JConsole: Java监 视与管理控制台
- Java Mission Control:可持续在线的监控工具

