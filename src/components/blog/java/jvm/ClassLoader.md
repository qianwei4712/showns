

<div class="catalog">

- [类加载机制概述](#t0)
- [class 文件生命周期](#t1)
  - [Loading：加载阶段](#t11)
  - [Linking：链接阶段](#t12)
  - [Initialization：初始化阶段](#t13)
  - [使用和卸载](#t14)
- [类加载器的种类和特点](#t2)
  - [ClassLoader 体验](#t21)
  - [类加载器双亲委派机制](#t22)
- [参考文章](#te)


</div>

## <span id="t0">类加载机制概述</span>

> 本文所有代码和介绍，基于 JDK 1.8.0.25

还是放上这个最眼熟的图，这个针对 `hotspot` 虚拟机所绘制的简图：

<img src="http://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/JVM%E8%BF%90%E8%A1%8C%E6%97%B6%E6%95%B0%E6%8D%AE%E5%8C%BA.png" alt="JVM运行时数据区" style="zoom: 67%;" />



本文要介绍的就是这个图中的 **类加载器** ，主要内容包括类加载器的工作步骤，内部组成等。

对于类加载器的内部结构，先看下面这个图：

![类加载子系统内部结构](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/%E7%B1%BB%E5%8A%A0%E8%BD%BD%E5%AD%90%E7%B3%BB%E7%BB%9F%E5%86%85%E9%83%A8%E7%BB%93%E6%9E%84.png)

类加载器会把 `.class` 字节码加载到运行时数据区的方法区。

除了类的信息外，方法区还存放着运行时常量池信息（版本、字段、方法、接口啥的）。



<br/>

## <span id="t1">class 文件生命周期</span>

从上面的图中可以看出：

> <font color="red">`.class` 文件在类加载器的执行过程包括了 **`加载`、`验证` 、`准备` 、`解析` 、`初始化`** 五个阶段。</font>

再加上运行时数据区、执行引擎和最后消亡，根据顺序如下图所示：

![class文件生命周期](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/class文件生命周期.png)

<br/>

### <span id="t11">Loading：加载阶段</span>

加载阶段有不同的类加载器，当然也可以自定义类加载器。

不过这是在自建虚拟机时、或者大佬优化虚拟机才搞的，我们就知道还能自定义就行了。

类的加载分为以下步骤：

1. **通过一个类的全限定名获取定义此类文件的二进制字节流；**
2. **将这个字节流所代表的静态存储结构转化为方法区的运行时数据结构；**
3. **在内存中生成一个代表这个类的 `java.lang.Class` 对象，作为方法区这个类的各种数据的访问入口。**

![Class加载步骤简图](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/Class%E5%8A%A0%E8%BD%BD%E6%AD%A5%E9%AA%A4%E7%AE%80%E5%9B%BE.png)



获取 `.class` 文件的几种方式：

- 从本地系统中直接加载
- 通过网络下载 .class 文件，这种场景最典型的应用就是 Web Applet
- 从 zip，jar, war 等归档文件中加载 .class 文件
- 运行时计算生成，使用最多的是动态代理技术。在 `java.lang.reflect.Proxy` 中，就是用了 `ProxyGenerator.generateProxyClass()` 来为特定接口生成形式为 `“*$Proxy”` 的代理类的二进制字字符流
- 从专有数据库中提取 .class 文件
- 从其他文件生成，典型应用场景就是 JSP ，由 JSP 文件生成 Class 文件



<br/>

### <span id="t12">Linking：链接阶段</span>

主要包括以下三个阶段：

- **验证: 确保被加载的类的正确性**

  1. 目的在于确保 class 文件的字节流中包含信息符合当前虚拟机要求，保证被加载类的正确性，不会危害虚拟机自身安全。

  2. 主要包括四种验证，文件格式验证，元数据验证，字节码验证，符号引用验证。

     | 验证方式     | 具体验证内容和措施                                           |
     | :----------- | :----------------------------------------------------------- |
     | 文件格式验证 | 验证字节流是否符合 Class 文件格式的规范；<br/>1. 是否以`0xCAFEBABE`开头<br/>2. 主、次版本号是否在当前虚拟机的处理范围之内<br/>3. 常量池中的常量是否有不被支持的类型<br/>4. 指向常量的各种索引值中是否有指向不存在的常量或不符合类型的常量<br/>5. Class 文件各个部分及文件本身是否有被删除的或附加的其他信息 |
     | 元数据验证   | 对字节码描述的信息进行语义分析，保证描述信息符合规范要求，<br/>1. 这个类是否有父类，除了`java.lang.Object`之外<br/>2. 这个类的父类是否继承了不允许被继承的类（final 修饰）<br/>3. 如果这个类不是抽象类，是否实现了其父类或接口之中要求实现的所有方法 |
     | 字节码验证   | 通过数据流和控制流分析，确定程序语义是合法的、符合逻辑的。   |
     | 符号引用验证 | 确保解析动作能正确执行。                                     |

  

  > <font color="red">**验证阶段非常重要，这个阶段直接决定了 JVM 是否能承受恶意代码的攻击；这个阶段占用了整个类加载阶段的大量时间。**</font>
  >
  > 但是验证阶段不是必须的，它对 JVM 运行没有影响，*如果所引用的类经过反复验证，那么可以考虑采用 `-Xverifynone` 参数来关闭大部分的类验证措施，以缩短虚拟机类加载的时间。*

<br/>

- **准备: 为类的静态变量分配内存，并将其初始化为默认值**
  1. 为类变量分配内存并且设置该类变量的默认初始值，即零值。
  2. 这里不包含用 final 修饰的 static，因为 final 在编译的时候就会分配了，准备阶段会显式初始化。
  3. **这里不会为实例变量分配初始化，类变量会分配在方法区中，而实例变量是会随着对象一起分配到 Java 堆中。(因为这时候还没创建对象)**
  
  例如以下代码：
  
  ```java
  private static int x = 1;
  ```
  
  > 在准备阶段，它只会被赋值为0，在初始化阶段才会赋值为1.
  
  不同的类型零值不同：
  
  | 数据类型 |   零值   | 数据类型  | 零值  |
  | :------: | :------: | :-------: | :---: |
  |   int    |    0     |  boolean  | false |
  |   long   |    0L    |   float   | 0.0f  |
  |  short   | (short)0 |  double   | 0.0d  |
  |   char   | '\u0000' | reference | null  |
  |   byte   | (byte)0  |           |       |
  
  

<br/>

- **解析: 把类中的符号引用转换为直接引用**
  1. 将常量池内的符号引用转换为直接引用的过程。
  2. 事实上，解析操作往往会伴随着JM在执行完初始化之后再执行。
  3. 符号引用就是一组符号来描述所引用的目标。符号引用的字面量形式明确定义在《java虚拟机规范》的Class文件格式中。直接引用就是直接指向目标的指针、相对偏移量或一个间接定位到目标的句柄。
  4. 解析动作主要针对类或接口、字段、类方法、接口方法、方法类型等。对应常量池中的CONSTANT_Class_info、 CONSTANT_Fleldref_info、 CONSTANT_Methodref_info等。



<br/>

### <span id="t13">Initialization：初始化阶段</span>

> 初始化阶段就是执行类构造器方法 `<client>()` 的过程。
>
> **这个方法是 javac 编译器自动收集类中的所有变量的赋值动作和静态代码块中的语句合并而成的。**

*编译器收集顺序和语句在源文件中出现顺序相同*。

所以意思就是，`static` 代码块在初始化阶段就已经执行了。 



<br/>

### <span id="t14">使用和卸载</span>

使用时，类访问方法区内的数据结构的接口， 对象是 Heap 区的数据。

 **Java虚拟机将结束生命周期的几种情况**

- 执行了 System.exit() 方法
- 程序正常执行结束
- 程序在执行过程中遇到了异常或错误而异常终止
- 由于操作系统出现错误而导致Java虚拟机进程终止



<br/>

## <span id="t2">类加载器的种类和特点</span>

在上面的加载阶段图中，已经画出了： `启动（引导）类加载器` 、 `扩展类加载器` 、 `应用类加载器` ，还说明了可以 `自定义加载器` 。

但是，但是，Java 虚拟机规范只把加载器分为了两种：启动类加载器（C++语言实现的，很特别哦）和自定义类加载器。

它把派生于 `public abstract class ClassLoader` 的加载器都归类为了自定义类加载器。

![类加载器层次结构](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/类加载器层次结构.png)



这个结构层次图也被成为 **双亲委派模型** ，具体工作原理后面再讲，先看几个加载器的作用：

1. `启动类加载器` : Bootstrap ClassLoader，负责加载存放在 JDK\jre\lib(JDK代表JDK的安装目录，下同)下，或被-Xbootclasspath参数指定的路径中的，并且能被虚拟机识别的类库(如rt.jar，所有的java.*开头的类均被Bootstrap ClassLoader加载)。启动类加载器是无法被Java程序直接引用的。*
2. `扩展类加载器` : Extension ClassLoader，该加载器由 `sun.misc.Launcher$ExtClassLoader` 实现，它负责加载JDK\jre\lib\ext目录中，或者由java.ext.dirs系统变量指定的路径中的所有类库(如javax.*开头的类)，开发者可以直接使用扩展类加载器。
3. `应用程序类加载器` : Application ClassLoader，该类加载器由 `sun.misc.Launcher$AppClassLoader` 来实现，它负责加载用户类路径(ClassPath)所指定的类，开发者可以直接使用该类加载器，如果应用程序中没有自定义过自己的类加载器，一般情况下这个就是程序中默认的类加载器。

应用程序都是由这三种类加载器互相配合进行加载的，如果有必要，我们还可以加入自定义的类加载器。因为JVM自带的ClassLoader只是懂得从本地文件系统加载标准的java class文件，因此如果编写了自己的ClassLoader，便可以做到如下几点:

- 在执行非置信代码之前，自动验证数字签名。
- 动态地创建符合用户特定需要的定制化构建类。
- 从特定的场所取得java class，例如数据库中和网络中。



<br/>

### <span id="t21">ClassLoader 体验</span>

先做个小实验：

```java
public class JvmTest1 {
    public static void main(String[] args) {
        ClassLoader systemClassLoader = ClassLoader.getSystemClassLoader();
        System.out.println(systemClassLoader);
        System.out.println(systemClassLoader.getParent());
        System.out.println(systemClassLoader.getParent().getParent());

        ClassLoader classLoader = JvmTest1.class.getClassLoader();
        System.out.println(classLoader);
    }
}
```

输出效果：

```
sun.misc.Launcher$AppClassLoader@58644d46
sun.misc.Launcher$ExtClassLoader@66d3c617
null
sun.misc.Launcher$AppClassLoader@58644d46
```

**可见我们写的代码，都是默认使用系统类加载器进行加载。**

在 Class 源码中，获取 ClassLoader 是通过 native 方法:

```java
    public ClassLoader getClassLoader() {
        ClassLoader cl = getClassLoader0();
        if (cl == null)
            return null;
        SecurityManager sm = System.getSecurityManager();
        if (sm != null) {
            ClassLoader.checkClassLoaderPermission(cl, Reflection.getCallerClass());
        }
        return cl;
    }

    native ClassLoader getClassLoader0();
```



<br/>

### <span id="t22">类加载器双亲委派机制</span>

> **<font color="red">双亲委派模型工作流程为：类加载器收到加载请求时，会首先委派父加载器去加载，逐层向上委派直到父加载器反馈无法完成加载，才由子加载器完成加载。</font>**

```java
    protected synchronized Class<?> loadClass(String name, boolean resolve)
         throws ClassNotFoundException {
            // 首先判断该类型是否已经被加载
            Class c = findLoadedClass(name);
            if (c == null) {
                //如果没有被加载，就委托给父类加载或者委派给启动类加载器加载
                try {
                    if (parent != null) {
                         //如果存在父类加载器，就委派给父类加载器加载
                        c = parent.loadClass(name, false);
                    } else {
                    //如果不存在父类加载器，就检查是否是由启动类加载器加载的类，通过调用本地方法native Class findBootstrapClass(String name)
                        c = findBootstrapClass0(name);
                    }
                } catch (ClassNotFoundException e) {
                 // 如果父类加载器和启动类加载器都不能完成加载任务，才调用自身的加载功能
                    c = findClass(name);
                }
            }
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
```



**双亲委派优势**

- 系统类防止内存中出现多份同样的字节码
- 保证Java程序安全稳定运行



<br/>


## <span id="te">参考文章</span>


<a href="https://www.pdai.tech/md/java/jvm/java-jvm-classload.html" target="_blank">https://www.pdai.tech/md/java/jvm/java-jvm-classload.html</a>

<a href="https://www.bilibili.com/video/BV1PJ411n7xZ" target="_blank">https://www.bilibili.com/video/BV1PJ411n7xZ</a>

