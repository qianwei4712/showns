
<div class="catalog">


- [JVM 介绍](#t0)
- [Java 字节码文件](#t1)
  - [字节码文件结构](#t11)
  - [反编译字节码文件](#t12)
- [参考文章](#te)

</div>





## <span id="t0">JVM 介绍</span>

众所周知，Java 是运行在 Java虚拟机上的，.`java` 文件只有编译成为 `.class` 文件才能在虚拟机上运行。那么这个虚拟机又是什么？

> **<font color="red">在 CPU 层面，计算机是由一个个指令汇聚而成的，虚拟机就是将识别字节码文件，并将其转换为指令运行。</font>**

Oracle 发布了一般又一般的 Java 和 JVM 规范，虚拟机就是遵循这个规范运行。

规范的话全英文的，我是看不懂，有兴趣自己取：<a href="https://docs.oracle.com/javase/specs/index.html" target="_blank">https://docs.oracle.com/javase/specs/index.html</a>

> **既然 JVM 存在公开规范，那就说明，它不单单只支持 JAVA，并且，JVM 也不是唯一的。**

我们平时认识最多的，应该是 HotSpot ，这是最广泛的 Java虚拟机。比如查看 java版本就能发现它

```shell
java version "11.0.8" 2020-07-14 LTS
Java(TM) SE Runtime Environment 18.9 (build 11.0.8+10-LTS)
Java HotSpot(TM) 64-Bit Server VM 18.9 (build 11.0.8+10-LTS, mixed mode)
```

不同的代码在编译器下可以编译成相同的字节码，字节码也可以在不同的 JVM 上运行。

虚拟机的区别不会详细研究，都是遵循 JVM 规范，也没有多大区别，并且我们也不会去更改。

<br>

然后就是另一个角度，不同代码可以在同一个JVM上运行，如下图：

![JVM、字节码、编译器的关系.png](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/JVM%E3%80%81%E5%AD%97%E8%8A%82%E7%A0%81%E3%80%81%E7%BC%96%E8%AF%91%E5%99%A8%E7%9A%84%E5%85%B3%E7%B3%BB.png)

虚拟机不关心代码，只要编译成的字节码符合规范，它就能运行。



<br>

## <span id="t1">Java 字节码文件</span>

对 Java 而言，获得 `.class` 字节码文件需要通过 `javac` 编译器，因为在执行的时候，存在对字节码的第二次编译，所以 `javac` 编译器也成为前端编译。

先从 `Hello World` 开始。。

```java
public class JvmTest1 {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}
```

这么一段代码，编译后的 class 文件打开后这样的：

```pseudocode
cafe babe 0000 0034 0022 0a00 0600 1409
0015 0016 0800 170a 0018 0019 0700 1a07
001b 0100 063c 696e 6974 3e01 0003 2829
5601 0004 436f 6465 0100 0f4c 696e 654e
756d 6265 7254 6162 6c65 0100 124c 6f63
616c 5661 7269 6162 6c65 5461 626c 6501
0004 7468 6973 0100 0e4c 6a76 6d2f 4a76
6d54 6573 7431 3b01 0004 6d61 696e 0100
1628 5b4c 6a61 7661 2f6c 616e 672f 5374
7269 6e67 3b29 5601 0004 6172 6773 0100
135b 4c6a 6176 612f 6c61 6e67 2f53 7472
696e 673b 0100 0a53 6f75 7263 6546 696c
6501 000d 4a76 6d54 6573 7431 2e6a 6176
610c 0007 0008 0700 1c0c 001d 001e 0100
0c48 656c 6c6f 2057 6f72 6c64 2107 001f
0c00 2000 2101 000c 6a76 6d2f 4a76 6d54
6573 7431 0100 106a 6176 612f 6c61 6e67
2f4f 626a 6563 7401 0010 6a61 7661 2f6c
616e 672f 5379 7374 656d 0100 036f 7574
0100 154c 6a61 7661 2f69 6f2f 5072 696e
7453 7472 6561 6d3b 0100 136a 6176 612f
696f 2f50 7269 6e74 5374 7265 616d 0100
0770 7269 6e74 6c6e 0100 1528 4c6a 6176
612f 6c61 6e67 2f53 7472 696e 673b 2956
0021 0005 0006 0000 0000 0002 0001 0007
0008 0001 0009 0000 002f 0001 0001 0000
0005 2ab7 0001 b100 0000 0200 0a00 0000
0600 0100 0000 0600 0b00 0000 0c00 0100
0000 0500 0c00 0d00 0000 0900 0e00 0f00
0100 0900 0000 3700 0200 0100 0000 09b2
0002 1203 b600 04b1 0000 0002 000a 0000
000a 0002 0000 0009 0008 000a 000b 0000
000c 0001 0000 0009 0010 0011 0000 0001
0012 0000 0002 0013 
```





<br>

### <span id="t11">字节码文件结构</span>

> 字节码文件结构是一组以 8 位字节为基础的二进制流，各数据项目严格按照顺序紧凑地排列在 Class 文件之中，中间没有添加任何分隔符。
>
> 在字节码结构中，有两种最基本的数据类型来表示字节码文件格式，分别是：无符号数和表。

太复杂的东西我也没看懂，这里都是简单来说，大多数内容也就复制下。。。。



我们先来看一张表：

| 类型           | 名称                | 说明                    | 长度    |
| :------------- | ------------------- | ----------------------- | ------- |
| u4             | magic               | 魔数，识别Class文件格式 | 4个字节 |
| u2             | minor_version       | 副版本号                | 2个字节 |
| u2             | major_version       | 主版本号                | 2个字节 |
| u2             | constant_pool_count | 常量池计算器            | 2个字节 |
| cp_info        | constant_pool       | 常量池                  | n个字节 |
| u2             | access_flags        | 访问标志                | 2个字节 |
| u2             | this_class          | 类索引                  | 2个字节 |
| u2             | super_class         | 父类索引                | 2个字节 |
| u2             | interfaces_count    | 接口计数器              | 2个字节 |
| u2             | interfaces          | 接口索引集合            | 2个字节 |
| u2             | fields_count        | 字段个数                | 2个字节 |
| field_info     | fields              | 字段集合                | n个字节 |
| u2             | methods_count       | 方法计数器              | 2个字节 |
| method_info    | methods             | 方法集合                | n个字节 |
| u2             | attributes_count    | 附加属性计数器          | 2个字节 |
| attribute_info | attributes          | 附加属性集合            | n个字节 |

这是一张Java字节码总的结构表，我们按照上面的顺序逐一进行解读就可以了。

详细的就算了，看看主要结构，从大佬那扒来的图：

![java-jvm-class-2](https://img-blog.csdnimg.cn/20200922191856568.png)



<br>

### <span id="t12">反编译字节码文件</span>

> 使用到java内置的一个反编译工具javap可以反编译字节码文件, 用法:  `javap -v <classes> `

比如我执行后输出：

```shell
Classfile /E:/HolyShit/test-demos/java-new/target/classes/jvm/JvmTest1.class
  Last modified 2020年9月22日; size 536 bytes
  MD5 checksum 95b43cc3e4240d26e3803d3a64eda12b
  Compiled from "JvmTest1.java"
public class jvm.JvmTest1
  minor version: 0
  major version: 52
  flags: (0x0021) ACC_PUBLIC, ACC_SUPER
  this_class: #5                          // jvm/JvmTest1
  super_class: #6                         // java/lang/Object
  interfaces: 0, fields: 0, methods: 2, attributes: 1
Constant pool:
   #1 = Methodref          #6.#20         // java/lang/Object."<init>":()V
   #2 = Fieldref           #21.#22        // java/lang/System.out:Ljava/io/PrintStream;
   #3 = String             #23            // Hello World!
   #4 = Methodref          #24.#25        // java/io/PrintStream.println:(Ljava/lang/String;)V
   #5 = Class              #26            // jvm/JvmTest1
   #6 = Class              #27            // java/lang/Object
   #7 = Utf8               <init>
   #8 = Utf8               ()V
   #9 = Utf8               Code
  #10 = Utf8               LineNumberTable
  #11 = Utf8               LocalVariableTable
  #12 = Utf8               this
  #13 = Utf8               Ljvm/JvmTest1;
  #14 = Utf8               main
  #15 = Utf8               ([Ljava/lang/String;)V
  #16 = Utf8               args
  #17 = Utf8               [Ljava/lang/String;
  #18 = Utf8               SourceFile
  #19 = Utf8               JvmTest1.java
  #20 = NameAndType        #7:#8          // "<init>":()V
  #21 = Class              #28            // java/lang/System
  #22 = NameAndType        #29:#30        // out:Ljava/io/PrintStream;
  #23 = Utf8               Hello World!
  #24 = Class              #31            // java/io/PrintStream
  #25 = NameAndType        #32:#33        // println:(Ljava/lang/String;)V
  #26 = Utf8               jvm/JvmTest1
  #27 = Utf8               java/lang/Object
  #28 = Utf8               java/lang/System
  #29 = Utf8               out
  #30 = Utf8               Ljava/io/PrintStream;
  #31 = Utf8               java/io/PrintStream
  #32 = Utf8               println
  #33 = Utf8               (Ljava/lang/String;)V
{
  public jvm.JvmTest1();
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
            0       5     0  this   Ljvm/JvmTest1;

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
SourceFile: "JvmTest1.java"
```

看看就好了，太多知识性内容我也写不完。。。凑个字数

<br>







## <span id="te">参考文章</span>

<a href="https://www.cnblogs.com/chanshuyi/p/jvm_serial_02_the_history_of_jvm.html
" target="_blank">https://www.cnblogs.com/chanshuyi/p/jvm_serial_02_the_history_of_jvm.html
</a>

<a href="https://www.pdai.tech/md/java/jvm/java-jvm-class.html
" target="_blank">https://www.pdai.tech/md/java/jvm/java-jvm-class.html
</a>

<a href="https://www.cnblogs.com/chanshuyi/p/jvm_serial_05_jvm_bytecode_analysis.html
" target="_blank">https://www.cnblogs.com/chanshuyi/p/jvm_serial_05_jvm_bytecode_analysis.html
</a>

<a href="https://blog.csdn.net/u011810352/article/details/80316870
" target="_blank">https://blog.csdn.net/u011810352/article/details/80316870
</a>

<a href="https://blog.csdn.net/weelyy/article/details/78969412
" target="_blank">https://blog.csdn.net/weelyy/article/details/78969412
</a>

<a href="https://www.jianshu.com/p/e713defb5afc
" target="_blank">https://www.jianshu.com/p/e713defb5afc
</a>

<a href="https://www.cnblogs.com/fx-blog/p/11982275.html
" target="_blank">https://www.cnblogs.com/fx-blog/p/11982275.html
</a>


