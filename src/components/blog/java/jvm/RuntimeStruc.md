
<div class="catalog">

- [运行时数据区概述](#t0)
- [线程与内存模型](#t1)
- [PC 寄存器](#t2)
  - [PC 寄存器常见问题](#t21)
- [虚拟机栈](#t3)
  - [虚拟机栈运行原理](#t31)
  - [虚拟机栈两种异常](#t32)
- [本地方法栈](#t4)
- [堆 Heap](#t5)
  - [堆空间设置](#t51)
  - [年轻代和老年代](#t52)
  - [对象在堆中的生命周期](#t53)
  - [TLAB - 线程本地分配缓存区](#t54)
- [方法区](#t6)
  - [方法区参数设置](#t61)
  - [方法区内部结构](#t62)
- [参考文章](#te)

</div>



## <span id="t0">运行时数据区概述</span>

> 本文所有代码和介绍，基于 JDK 1.8.0.25

放上这个总结性的图，这个针对 `hotspot` 虚拟机运行时数据区所绘制的简图：

![运行时数据区基本结构总览](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/%E8%BF%90%E8%A1%8C%E6%97%B6%E6%95%B0%E6%8D%AE%E5%8C%BA%E5%9F%BA%E6%9C%AC%E7%BB%93%E6%9E%84%E6%80%BB%E8%A7%88.png)

本文要介绍的就是这个图中的 **运行时数据区** ，也就是常说的内存模型。

对于 java 程序员来说，在虚拟机自动内存管理机制的帮助下，不容易出现内存泄漏和内存溢出。

有虚拟机管理内存，这一切看起来都很美好。但是，也正因为java把内存控制的权力给了java虚拟机，一旦出现内存泄漏和溢出方面的问题。

**如果不了解虚拟机是怎么样使用内存的，那么排查错误将会成为一项异常艰难的工作**。

先把几个重要概念放上：

- 堆和栈算是Java内存模型中最重要的两部分，**栈是运行时单位（解决程序执行问题），堆是存储单位（数据存储问题）** 。
- PC 寄存器是用来存储指向下一条指令的地址，也就是即将要执行的指令代码。
- 虚拟机栈和本地方法栈分别管理 Java 方法和本地方法。 **虚拟机每调用一个方法将会在栈中压入一个对应方法的栈帧** ，内部包含局部变量表、操作数栈、动态链接和方法返回地址。
- 虚拟机栈存在两种常见异常 StackOverflowError 和 OutOfMemoryError 。
- 堆分为年轻代（Eden区、Survivor 0/1 区），老年代。对象在 GC 发生时，在堆内各个区上分配空间和移动。 

<br/>

JVM 配置参数如下：

-  `-Xss` 用于设置虚拟机栈空间大小，例如：`java -Xss512M`  ，默认大小是 1M
- `-Xms` 用于表示堆区（年轻代+老年代）的起始内存大小，等价于 `-XX:InitialHeapSize` 。默认值为电脑物理内存大小 / 64 。
- `-Xmx` 用于表示堆区（年轻代+老年代）的最大内存，等价于 `-XX:MaxHeapSize` 。默认值为电脑物理内存大小 / 4 。
- `-XX:NewRatio=2` 表示年轻代和老年代占比分配为 **<font color="red">1 : 2</font>**   ，这是默认配置比例。若修改为 3，则表示 老年代/年轻代 = 3。
- `-XX:SurvivorRatio=8` 表示年轻代中 `Eden 区/一个Survivor区`  ，默认占比为 **8 : 1 : 1** 。
- `-XX :MaxTenuringThreshold=<N>` 表示对象从 Survivor 区晋升至老年代的 age 阈值。

<br/>

## <span id="t1">线程与内存模型</span>

在 `Hotspot JVM` 里，每个线程都与操作系统的本地线程直接映射。

- 当一个 Java 线程准备好执行以后，此时一个操作系统的本地线程也同时创建。
- Java线程执行终止后，本地线程也会回收。
- 可以看看这篇，Java线程和操作系统线程的关系：<a target="_blank" href="https://blog.csdn.net/m0_46144826/article/details/107583259">Java Thread线程基础机制，源码解读</a>

在运行时数据区区分了线程共享和线程私有。

至于原因嘛，后面会写到，到这先明确 **虚拟机栈、本地方法栈、程序计数器** 是线程私有的，所以生命周期和线程相同。



<br/>

## <span id="t2">PC 寄存器</span>

PC 寄存器（Program Counter Register），也就是上图中的程序计数器。

这个叫法更顺口，因为 Register 的命名源自 CPU 的寄存器，它存储指令相关的现场信息。

> **<font color="red">PC寄存器的作用：用来存储指向下一条指令的地址，也就是即将要执行的指令代码。由执行引擎读取吓一跳指令。</font>**



![PC寄存器作用示意图](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/PC%E5%AF%84%E5%AD%98%E5%99%A8%E4%BD%9C%E7%94%A8%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

- PC 寄存器是一块很小的内存空间，几乎可以忽略不记，也是运行速度最快的存储区域。
- 在 JVM 规范中，每个线程都有它自己的 PC 寄存器，是线程私有的，生命周期与线程的生命周期保持一致。
- 任何时间一个线程都只有一个方法在执行，也就是所谓的当前方法。 PC 寄存器会存储当前线程正在执行的Java方法的 JVM 指令地址：或者，如果是在执行 native 方法，则是未指定值（ undefined）。

比如在字节码反编译文件中：

```java
public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: (0x0009) ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=1, args_size=1
         0: getstatic     #2    // Field java/lang/System.out:Ljava/io/PrintStream;
         3: ldc           #3    // String Hello World!
         5: invokevirtual #4    // Method java/io/PrintStream.println:(Ljava/lang/String;)V
         8: return
      LineNumberTable:
        line 8: 0
        line 9: 8
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       9     0  args   [Ljava/lang/String;
}
```

**上述中左侧序号 `0、3、5、8` 就是指令地址，这些就是 PC 寄存器中存储的结构。**

右侧则是虚拟机栈内的指令，这个以后再说。。。



<br/>

### <span id="t21">PC 寄存器常见问题</span>

1. **PC 寄存器没有 GC 和 OOM**

PC 寄存器是唯一没有 OOM 的内存区域，没有 GC 的除了它还有虚拟机栈和本地方法栈。

<br/>

2. **使用 PC  寄存器存储字节码指令地址有什么用呢？为什么使用 PC 寄存器记录当前线程的执行地址呢？**

因为 CPU 需要不停的切换各个线程，这时候切换回来以后，就得知道接着从哪开始继续执行。

JVM 的字节码解释器就需要通过改变 PC寄存器 的值来明确下一条应该执行什么样的字节码指令。

<br/>

3. **PC 寄存器为什么会被设定为线程私有？**

由于 CPU 时间片轮限制，众多线程在并发执行过程中，任何一个确定的时刻，一个处理器或者多核处理器中的一个内核，只会执行某个线程中的一条指令。

每个线程在创建后，都会产生自己的程序计数器和栈帧；这样的话，在线程中断或恢复中，程序计数器在各个线程之间可以互不影响。

<br/>



## <span id="t3">虚拟机栈</span>

首先看下总体性的概念：

- 虚拟机栈是什么 ： **栈是线程私有的，每个线程在创建的时候都会创建一个虚拟机栈，其内部保存着一个个栈帧（Stack Frame），对应着一次次的 Java 方法调用。**
- 虚拟机栈的作用 ：**主要管理 Java 程序的运行，它保存方法的局部变量、部分结果，并参与方法的调用和返回。** 
- 栈帧的创建时间 ：当方法被执行的时候，虚拟机将会创建栈帧。
- JVM 对虚拟机栈的操作只有入栈（方法执行）和出栈（执行结束）。所以，栈也不存在垃圾回收。

![虚拟机栈简图](https://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/%E8%99%9A%E6%8B%9F%E6%9C%BA%E6%A0%88%E7%AE%80%E5%9B%BE.png)

<br/>

### <span id="t31">虚拟机栈运行原理</span>

在一条活动的线程中，一个时间点上，只会有一个活动的栈帧。

其实从上面那个图中很容易可以理解。

**Java 方法有两种返回函数的方式（正常函数返回，使用 return 指令；抛出异常），不管那种方式，都会导致栈帧将执行结果返回上一个栈帧，并且当前栈帧被弹出。**

下面开始分别讲解栈帧的内部结果。



<br/>

#### 局部变量表

局部变量表（local variables）也叫做局部变量数据、本地变量表。

**它是一个数字数组，主要用于存储方法参数和定义在方法体内的局部变量**；这些数据类型包括各类基本数据类型、对象引用（reference），以及 retuenAddress 类型。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/emo/TIM图片20200603100725.jpg)

到这里，就可以解释以前在多线程部分的一个提问：**为什么局部变量不会存在线程安全问题？**

太详细的就不解释了，写几个关键词示意一下：

> **虚拟机栈是线程私有、一个方法对应一个栈帧、方法内局部变量保存在虚拟机栈的局部变量表中、不同线程的栈不允许相互通信。**

好嘞，然后把需要记的内容列一下，全是概念性的东西：

- 局部变量表所需的容量大小是在编译期就确定下来的，在运行期间是不会改变的。
- 方法嵌套调用的次数由栈的大小决定。栈越大，方法嵌套调用最大次数越多。
- 对一个方法而言，参数和局部变量越多，使得局部变量表膨胀，栈帧就越大；一个栈帧将占更多的栈空间，导致嵌套调用次数减少。
- 局部变量在使用前必须显示赋值。类变量会在加载过程的链接阶段经历准备阶段，这个阶段将会置为默认值，所以就算没有在初始化阶段进行复制，也不有问题。但是局部变量是在方法调用时创建，并没有默认赋值。
- **<font color="red">局部变量表中的变量也是重要的垃圾回收根节点，只要被局部变量表中直接或间接引用的对象都不会被回收。</font>**



<br/>

#### 操作数栈

操作数栈（Operand Stack，其实就是一个数组），在方法执行过程中，根据字节码指令，往栈中写入数据或提取数据，即入栈和出栈。

**<font color="red">操作数栈主要用于保存计算过程的中间结果，同时作为计算过程中变量临时的存储空间。</font>**

关于操作数栈的知识要点：

- 方法调用，创建栈帧的时候将会生成操作数栈（也就是一个数组）；数组一旦创建长度就不可更改了，所以栈的深度在编译器就确定了。
- 如果被调用的方法带有返回值的话，其返回值将会被压入当前栈帧的操作数栈中，并更新 PC 寄存器中下一条需要执行的字节码指令。



<br/>

#### 动态链接

动态链接（Dynamic Linking）是指：每一个栈帧内部都包含一个指向 `运行时常量池` 中 `该栈帧所属方法的引用` 。比如：invokedynamic 指令。

在 Java 源文件编译到字节码文件中，所有变量和方法引用都将作为符号引用（Symbolic Reference）保存在 class 文件的常量池里。比如：描述一个方法调用了另外的其他方法时，就是通过常量池中指向方法的符号引用来表示的， **<font color="red">动态链接的作用就是为了将这些符号转换为调用方法的直接引用</font>** 。

写个测试代码：

```java
public class DynamicLinkingTest {
    int num ;
    public static void main(String[] args) {
        DynamicLinkingTest dy = new DynamicLinkingTest();
        dy.test();
    }
    public void test(){
        dyTest();
    }
    public void dyTest(){
        num++;
    }
}
```

编译后使用 `javap -v DynamicLinkingTest.class` 命令，显示：

```java
Classfile /E:/test-demos/target/classes/jvm/DynamicLinkingTest.class
  Last modified 2020年10月17日; size 645 bytes
  MD5 checksum a4548dfdcf2a9d748f4e603d3bc7676a
  Compiled from "DynamicLinkingTest.java"
public class jvm.DynamicLinkingTest
  minor version: 0
  major version: 52
  flags: (0x0021) ACC_PUBLIC, ACC_SUPER
  this_class: #2                          // jvm/DynamicLinkingTest
  super_class: #7                         // java/lang/Object
  interfaces: 0, fields: 1, methods: 4, attributes: 1
Constant pool:
   #1 = Methodref          #7.#26         // java/lang/Object."<init>":()V
   #2 = Class              #27            // jvm/DynamicLinkingTest
   #3 = Methodref          #2.#26         // jvm/DynamicLinkingTest."<init>":()V
   #4 = Methodref          #2.#28         // jvm/DynamicLinkingTest.test:()V
   #5 = Methodref          #2.#29         // jvm/DynamicLinkingTest.dyTest:()V
   #6 = Fieldref           #2.#30         // jvm/DynamicLinkingTest.num:I
   #7 = Class              #31            // java/lang/Object
   #8 = Utf8               num
   #9 = Utf8               I
  #10 = Utf8               <init>
  #11 = Utf8               ()V
  #12 = Utf8               Code
  #13 = Utf8               LineNumberTable
  #14 = Utf8               LocalVariableTable
  #15 = Utf8               this
  #16 = Utf8               Ljvm/DynamicLinkingTest;
  #17 = Utf8               main
  #18 = Utf8               ([Ljava/lang/String;)V
  #19 = Utf8               args
  #20 = Utf8               [Ljava/lang/String;
  #21 = Utf8               dy
  #22 = Utf8               test
  #23 = Utf8               dyTest
  #24 = Utf8               SourceFile
  #25 = Utf8               DynamicLinkingTest.java
  #26 = NameAndType        #10:#11        // "<init>":()V
  #27 = Utf8               jvm/DynamicLinkingTest
  #28 = NameAndType        #22:#11        // test:()V
  #29 = NameAndType        #23:#11        // dyTest:()V
  #30 = NameAndType        #8:#9          // num:I
  #31 = Utf8               java/lang/Object
{
  int num;
    descriptor: I
    flags: (0x0000)

  public jvm.DynamicLinkingTest();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 6: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Ljvm/DynamicLinkingTest;

  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: (0x0009) ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=2, args_size=1
         0: new           #2                  // class jvm/DynamicLinkingTest
         3: dup
         4: invokespecial #3                  // Method "<init>":()V
         7: astore_1
         8: aload_1
         9: invokevirtual #4                  // Method test:()V
        12: return
      LineNumberTable:
        line 11: 0
        line 12: 8
        line 13: 12
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      13     0  args   [Ljava/lang/String;
            8       5     1    dy   Ljvm/DynamicLinkingTest;

  public void test();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokevirtual #5                  // Method dyTest:()V
         4: return
      LineNumberTable:
        line 16: 0
        line 17: 4
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Ljvm/DynamicLinkingTest;

  public void dyTest();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=3, locals=1, args_size=1
         0: aload_0
         1: dup
         2: getfield      #6                  // Field num:I
         5: iconst_1
         6: iadd
         7: putfield      #6                  // Field num:I
        10: return
      LineNumberTable:
        line 20: 0
        line 21: 10
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      11     0  this   Ljvm/DynamicLinkingTest;
}
SourceFile: "DynamicLinkingTest.java"
```

- **Constant pool** 部分就是常量池，在加载时会放在方法区，也叫做运行时常量池，调用的目标就在这里。
- **invokespecial** 命令后面加了地址，比如：`invokevirtual #4` ，后面的 `#4` 就是常量池中的地址。
- 这样做的目的也是节省资源，重复调用不必在线程独有的栈中创建，而是在线程共享的方法区。



<br/>

#### 方法返回值

方法返回值实际并不是一个值，而是这个方法返回地址，指向存放调用该方法的 PC寄存器的值。

它的作用就是回到调用方法位置，继续往下执行。

> 异常退出时，不会给他的上层调用者产生任何的返回值。



<br/>

### <span id="t32">虚拟机栈两种异常</span>

**Java 虚拟机规范允许虚拟机栈的大小是动态的或者固定不变的。**

所以，这分别将导致以下两种常见异常：

1. **采用固定大小的虚拟机栈** ：每一条线程的虚拟机栈容量在线程创建的时候独立选定。**如果线程请求分配的容量超过虚拟机栈允许的最大容量，将会抛出 StackOverflowError 异常。**

- <font color="red">**栈大小设置使用 `-Xss` 进行配置，例如：`java -Xss512M`  ，默认大小是 1M**</font>

使用递归方法的时候，如果出现问题将进入死循环，每一次调用将会进行压栈，最后就会出现这个异常。

测试代码如下：

```java
public class StackOverflowTest {
    public static void main(String[] args) {
        int i = 0;
        recursion(i);
    }
    private static void recursion(int i){
        System.out.println(i);
        recursion(++i);
    }
}
```

抛出异常：

```java
Exception in thread "main" java.lang.StackOverflowError
	at sun.nio.cs.ext.DoubleByte$Encoder.encodeLoop(DoubleByte.java:617)
	at java.nio.charset.CharsetEncoder.encode(CharsetEncoder.java:579)
	at sun.nio.cs.StreamEncoder.implWrite(StreamEncoder.java:271)
	at sun.nio.cs.StreamEncoder.write(StreamEncoder.java:125)
	at java.io.OutputStreamWriter.write(OutputStreamWriter.java:207)
	at java.io.BufferedWriter.flushBuffer(BufferedWriter.java:129)
	at java.io.PrintStream.write(PrintStream.java:526)
	at java.io.PrintStream.print(PrintStream.java:597)
	at java.io.PrintStream.println(PrintStream.java:736)
	at jvm.StackOverflowTest.recursion(StackOverflowTest.java:15)
```

可以根据修改 `-Xss` 来对比输出值的大小。

<br/>

2. **采用动态扩展的虚拟机栈** ：**在尝试扩展的时候无法申请到足够的内存，或者在创建新线程的时候没有足够的内存去创建对应的虚拟机栈，那么将会抛出 OutOfMemoryError 异常。**





<br/>

## <span id="t4">本地方法栈</span>

在将本地方法栈之前，先简单介绍下几个概念：

- **Java 本地方法** ：由非 Java 语言实现的方法（主要为C/C++），例如 `Thread.start0()` 。
- **本地方法接口** ：**<font color="red">也叫做 JNI</font>** ，作用是融合不同的编程语言为 Java 所用，它的初衷是融合 C/C++ 程序。

简单来说，就是为了和 JVM 所在操作系统交互，或者和硬件交互。

**本地方法栈（Native Method Stack）是管理本地方法的调用；** 和管理 Java 方法的虚拟机栈相似。

本地方法栈的异常和虚拟机栈相同，工作原理也相同，就略过了。

执行过程：

1. 在调用本地方法是，在本地方法栈压入本地方法；
2. 由动态链接指向本地方法库；
3. 由执行引擎进行调用执行。



<br/>

## <span id="t5">堆 Heap</span>

堆是 Java 内存结构中最重要的部分，也是知识点最多的一部分。

这里涉及到垃圾回收将会讲的比较简要（因为还没有学到），以后开专题再详细讲。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/emo/8ed4f6854ba34a31287114549aa671c8.jpeg)

还是一样，关于 JVM 部分都是先放概念：

- Java 堆区在 JVM 启动的时候就已经创建了，也确定了其空间的大小；
- 堆和方法区存在垃圾回收，堆是垃圾回收重点区域。GC 在大内存和频繁 GC 的情况下，将会影响性能；
- JDK7 之前堆内存在逻辑上分为：新生代（Young）、老年代（Old）、永久代（Perm）；
- JDK8 后对堆空间逻辑上分为：新生代、老年代、元空间（Meta）；
- 新生代又被分为伊甸园区（Eden）和幸存者0和1区（Survivor）；永久代和方法区其实并不在堆内，而是方法区。



<br/>

### <span id="t51">堆空间设置</span>

Java 堆在 JVM 启动时就已经创建了，可以通过相关指令设置其大小：

- `-Xms` 用于表示堆区（年轻代+老年代）的起始内存大小，等价于 `-XX:InitialHeapSize` 。默认值为电脑物理内存大小 / 64 。
- `-Xmx` 用于表示堆区（年轻代+老年代）的最大内存，等价于 `-XX:MaxHeapSize` 。默认值为电脑物理内存大小 / 4 。
- **开发中建议将初始堆内存和最大堆内存设置成一个值；因为堆内存的扩容和释放将加大系统额外的压力。**

 

<br/>

### <span id="t52">年轻代和老年代</span>

堆区的进一步划分可以分为如下结构：

![堆空间结构划分](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/%E5%A0%86%E7%A9%BA%E9%97%B4%E7%BB%93%E6%9E%84%E5%88%92%E5%88%86.png)

年轻代和老年代默认占比分配为 **<font color="red">1 : 2</font>** ，默认配置为 `-XX:NewRatio=2` 。若修改为 3，则表示 老年代/年轻代 = 3.

一般情况下是不会修改这个比例的，只有我们明确知道对象的生命周期，才会针对进行更改。

<br/>

**而在年轻代中，Eden 和两个 Survivor 区的默认占比为 8 : 1 : 1** 。

Survivor 0 和 1 区的因为需要相互复制，所以它们的空间大小是相同的。

修改年轻代和老年代空间占比的指令为 `-XX:SurvivorRatio=8` ，相当于 `Eden 区/一个Survivor区`



<br/>

### <span id="t53">对象在堆中的生命周期</span>

对象在堆中的流程大致分为如下几个步骤：

1. new 的对象先放 Eden 区。此区有大小限制。

2. 当 Eden 区的空间填满时，程序又需要创建对象，JVM 的垃圾回收器将对 Eden 区进行垃圾回收(Minor GC)，将 Eden 区中的不再被其他对象所引用的对象进行销毁，再加载新的对象放到 Eden 区。

3. 然后将 Eden 区中的剩余对象移动到 Survivor 0区。

4. 如果再次触发垃圾回收，此时上次幸存下来的放到 Survivor 0区的，如果没有回收，就会
   放到 Survivor 1区。

5. 如果再次经历垃圾回收，此时会重新放回 Survivor 0区，接着再去 Survivor 1区。

   > **每一次在 Survivor 0 和 1区转移，都会为该对象的标志位 age 加一。**
   >
   > **到达默认次数15后，下一次就可以晋升到老年代。**
   >
   > **最大转移次数可以通过 `-XX :MaxTenuringThreshold=<N>` 进行设置。**

6. 在老年代，相对悠闲。当老年代内存不足时，再次触发GC: Major GC， 进行老年代的内存清理。

7. 若老年代执行了 Major GC 之后发现依然无法进行对象的保存，就会产生 OOM 异常

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/emo/SJ4S5W1CAW511CS5.jpg)

可得记住了，这是最正常的流程，后面还有其他特殊情况。。。再给你们放个示意图

不同颜色对应的区域参考上面的区域划分

![堆内对象分配和回收流程示意图](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/%E5%A0%86%E5%86%85%E5%AF%B9%E8%B1%A1%E5%88%86%E9%85%8D%E5%92%8C%E5%9B%9E%E6%94%B6%E6%B5%81%E7%A8%8B%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

<br/>

以上步骤是正常情况下，当然不可能所有包含所有情况，也存在一些特殊情况。

- 当 Survivor 区满了，但是 Survivor 区内对象没有达到阈值，新对象也可以直接被晋升到老年代的。
- 遇到超大对象，新生代空间不够，则直接分配到老年代。

最后看下这个流程图，里面涉及的判断应该可以理解了。

![堆内对象分配和回收流程图](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/堆内对象分配和回收流程图.png)



最后提两句，各个 GC 之间的差别，详细的以后再讲：

- **Minor GC** ：又叫做 YGC / Young GC，对新生代进行 GC。频率比较高，因为大部分对象的存活寿命较短，在新生代里被回收，性能耗费较小。

  - Eden 区满时才触发，Survivor 区满时不会触发。
  - Minor GC 会触发 STW（Stop the World，全局停顿，所有Java代码停止，native代码可以执行，但不能与JVM交互）。虽然 Minor GC 频率高，但是执行速度快，所以影响不大。

  

- **Major GC** ：又可以成为 Old GC ，只收集老年代，频率很低。

  - 老年代空间不足时，会先尝试触发 Minor GC，之后空间还是不足，则会触发 Major GC。
  - Major GC 的速度比 Minor GC 慢 10 倍以上，STW 时间相当长，所以要调优减少发生次数。

  

- **Mixed GC** ：收集整个新生代和老年代，目前就只有 **G1 GC**。



- **Full GC** ：又叫做 FGC ，收集整个堆和方法区的 GC。触发情况包括：
  - 调用 `System.gc()` 时，系统建议执行 Full GC ，但不一定执行。
  - 老年代空间不足、方法区空间不足。
  - 通过 Minor GC 后进入老年代的平均大小大于老年代的可用内存。
  - 由 Eden 区、Survivor 区复制时，对象大小大于 Survivor To区可用内存，则把该对象晋升到老年代，且老年代的可用内存小于该对象大小。



**所谓的调优，就是让 GC 触发的次数尽量少，避免占用用户线程的资源。**



<br/>

### <span id="t54">TLAB - 线程本地分配缓存区</span>

首先要弄明白的是，什么是 TLAB（ Thread Local Allocation Buffer ）？为什么要有 TLAB ?

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/emo/640.png)

这玩意儿就是 JVM 自带的，它设计了我们学就是了嘛。。。。

基本的原因和情况如下：

1. 堆区是线程共享区域，并发环境下从堆区中划分内存空间是线程不安全的。
2. 为避免多个线程操作同一地址，需要使用加锁等机制，进而影响分配速度。
3. JVM 为每个线程分配了一个私有缓存区域，它包含在 Eden 区。
4. 多线程同时分配内存时，使用 TLAB 可以避免一系列的非线程安全问题，同时还能够提升内存分配的吞吐量，因此我们可以将这种内存分配方式称之为 **快速分配策略** 。



然后把 TLAB 的流程图放上：

![TLAB 工作原理流程图](https://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/TLAB%20%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86%E6%B5%81%E7%A8%8B%E5%9B%BE.png)

关于 TLAB 的其他知识点如下：

- JVM 会将 TLAB 作为内存空间分配的首选，但并不一定能分配到 TLAB 内。

- `-XX:UseTLAB` 可以用来设置是否开启 TLAB 空间。

- 默认情况下，TLAB 空间的内存非常小，仅占有整个 Eden空间的 1%

  > 可以通过选项 `-XX:TLABWasteTargetPercent` 设置 TLAB 空间所占用 Eden 空间的百分比大小。

- 一旦对象在 TLAB 空间分配内存失败时，JVM 就会尝试着通过使用加锁机制确保数据操作的原子性，从而直接在 Eden 空间中分配内存。



<br/>

## <span id="t6">方法区</span>

先看一眼栈、堆、方法区的关系：

![栈、堆、方法区的关系](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/%E6%A0%88%E3%80%81%E5%A0%86%E3%80%81%E6%96%B9%E6%B3%95%E5%8C%BA%E7%9A%84%E5%85%B3%E7%B3%BB.png)

方法区的概念性知识和堆差不多：

- 方法区和 Java 堆一样，是线程共享的；在 JVM 启动时被创建，空间大小可以设置为固定也可以扩展。
- 方法区在逻辑上是堆的一部分，但一些简单的实现可能不会选择去进行垃圾回收或进行压缩。
- 方法区的大小决定了应用可以保存多少个类。如果应用定义了太多的类，导致方法区溢出，虚拟机同样会抛出内存溢出错误：
  - JDK7之前： `java.lang.OutOfMemoryError:PermGen space` 
  - JDK8之后： `java.lang.OutOfMemoryError:Metaspace`
  - 加载太多第三方 jar 包、Tomcat 部署太多应用、大量动态的生成反射类；都将导致方法区 OOM 异常

<br/>

永久代和元空间的本质区别是： **<font color="red">元空间不在虚拟机设置的内存中，而是使用本地内存。</font>**

啥是本地内存呢？

就是我们口语上的 8G、16G，这要是还能溢出我也是懵了。

> 所以对比元空间，永久代将更容易使 Java 应用产生 OOM 异常，即超过 `-XX:MaxPermSize` 的上限。

<br/>

### <span id="t61">方法区参数设置</span>

#### JDK7 及以前

- 通过 `-XX:PermSize` 来设置永久代初始分配空间大小，默认值 `20.75M` 。
- 通过 `-XX:MaxPerSize` 来设置永久代最大可分配空间，32位机器默认 `64M` ，64位机器默认 `82M` 。
- JVM 加载类信息容量超过了最大值，报 `java.lang.OutOfMemoryError:PermGen space` 

<br/>

#### JDK8 及以后

- 永久代的两个配置参数改为： `-XX:MetaspaceSize` 和 `-XX:MaxMetaspaceSize` ，默认值分别为 21M 和 -1（没有限制）。
- 为了避免频繁地 GC ，建议将 `-XX:MetaspaceSize` 设置为一个较大的值。

<br/>

### <span id="t62">方法区内部结构</span>

方法区内部结构包括：类型信息、域（字段）信息、方法信息、常量、静态变量、即时编译器编译后的代码缓存等。

方法区内还有一个非常重要的结构：**运行时常量池** 。

在 class 文件中，就有一个常量池表，包含了类名、方法名、参数类型、字面量等类型的符号引用。

字节码中直接调用常量池的信息，避免相同信息重复创建。

<br/>

还有就是关于 StringTable 的位置：

- JDK7 中将 StringTable 放到了堆空间中。因为永久代的回收效率很低，在 Full GC 的时候才会触发。而 Full GC 是老年代的空间不足、永久代不足时才会触发。这就导致 StringTable 回收效率不高。
- 我们开发中会有大量的字符串被创建，回收效率低，会导致永久代内存不足，放到堆里能及时回收内存。





<br/>

## <span id="te">参考文章</span>

<a target="_blank" href="https://www.jianshu.com/p/997e1e956e0a">https://www.jianshu.com/p/997e1e956e0a</a>

<a target="_blank" href="https://www.bilibili.com/video/BV1PJ411n7xZ">https://www.bilibili.com/video/BV1PJ411n7xZ</a>

<a target="_blank" href="https://www.pdai.tech/md/java/jvm/java-jvm-struct.html">https://www.pdai.tech/md/java/jvm/java-jvm-struct.html</a>

<a target="_blank" href="https://www.jianshu.com/p/80fa4232f326">https://www.jianshu.com/p/80fa4232f326</a>

<a target="_blank" href="https://www.cnblogs.com/williamjie/p/9222839.html">https://www.cnblogs.com/williamjie/p/9222839.html</a>





