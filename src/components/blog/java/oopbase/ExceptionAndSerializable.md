<div class="catalog">

- [Java异常处理机制](#t1)
  - [ERROR（错误）](#t11)
  - [EXCEPTION（异常）](#t12)
    - [非检查性异常](#t121)
    - [检查性异常](#t122)
  - [异常处理](#t13)
  	- [抛出异常](#t131)
  	- [声明异常](#t132)
  	- [捕获异常](#t133)
  	- [Try-With-Resources 用法](#t134)
  - [异常部分参考文章](#t14)
- [序列化](#t2)
  - [序列化的概念](#t21)
  - [序列化的使用场景](#t22)
  - [序列化的底层原理](#t23)
  - [serialVersionUID 的作用和用法](#t24)
  - [其他注意事项](#t25)
  - [序列化部分参考文章](#t24)

</div>

## <span id="t1">1. Java异常处理机制</span>

**抛出异常：** 把异常问题提交给上一级环境（调用当前方法的代码块），并且当前方法停止往下执行。

实际上异常出现后，异常处理器接管程序运行，类同于抛出异常。

<img src="@/assets/blog/img/Throwable.png"/>


### <span id="t11">ERROR（错误）</span>

Error类以及它的子类的实例，代表了JVM本身的错误。这类错误基本无法通过程序处理，只能停止程序运行，更改配置或优化后重新启动。下面对一些常见的错误进行描述

| 错误类型           | 稍做描述                                                     |
| :----------------- | ------------------------------------------------------------ |
| OutOfMemoryError   | OOM（OutOfMemoryError） 可以说是最常见的Error，一般网上的通用做法都是加大内存。其实OOM包括： Java 堆空间、GC 开销超过限制、请求的数组大小超过虚拟机限制等八类， 处理办法也各不相同。 |
| StackOverflowError | 堆栈无法容纳所产生的错误，常见于两个类相互引用，或者死循环。 |
| InternalError      | 虚拟机内部所产生的错误。                                     |
| UnknownError       | 虚拟机不知名异常所产生的错误。                               |
| LinkageError       | LinkageError(结合错误)， 表示一个类信赖于另一个类，但是，在前一个类编译之后，后一个类的改变会与它不兼容 。一般不涉及 classLoader ，正常的import不会发生此类错误。 |
| AWTError           | 图形化错误，基本没怎么用awt包。                              |

当然，Error错误一般和程序无关，要么就是很容易修改的错误，并不是观察的重点。

<br>

### <span id="t12">EXCEPTION（异常）</span>

 Exception以及它的子类，代表程序运行时发送的各种不期望发生的事件，Java自带异常处理机制变用于处理这些异常，是异常处理的核心。 

异常的处理方式：**若是运行时异常，则表明程序出错，应该找到错误并修改，而不是对其捕获。若是检查异常，遵循该原则：谁知情谁处理，谁负责谁处理，谁导致谁处理。处理就是对其捕获并处理。** 

<br>

**<span id="t121">非检查性异常（unckecked exception）</span>** 

RuntimeException 以及其子类。程序运行过程中出现错误，才会被检查的异常。例如：类型错误转换，数组下标访问越界，空指针异常、找不到指定类等等。 

这些运行异常都是开发中常见的：

| **异常**                           | **描述**                                                     |
| ---------------------------------- | ------------------------------------------------------------ |
| ArithmeticException                | 当出现异常的运算条件时，抛出此异常。例如，一个整数"除以零"时，抛出此类的一个实例。 |
| **ArrayIndexOutOfBoundsException** | 用非法索引访问数组时抛出的异常。如果索引为负或大于等于数组大小，则该索引为非法索引。 |
| ArrayStoreException                | 试图将错误类型的对象存储到一个对象数组时抛出的异常。         |
| **ClassCastException**             | 当试图将对象强制转换为不是实例的子类时，抛出该异常。         |
| IllegalArgumentException           | 抛出的异常表明向方法传递了一个不合法或不正确的参数。         |
| IllegalMonitorStateException       | 抛出的异常表明某一线程已经试图等待对象的监视器，或者试图通知其他正在等待对象的监视器而本身没有指定监视器的线程。 |
| IllegalStateException              | 在非法或不适当的时间调用方法时产生的信号。换句话说，即 Java 环境或 Java 应用程序没有处于请求操作所要求的适当状态下。 |
| IllegalThreadStateException        | 线程没有处于请求操作所要求的适当状态时抛出的异常。           |
| IndexOutOfBoundsException          | 指示某排序索引（例如对数组、字符串或向量的排序）超出范围时抛出。 |
| NegativeArraySizeException         | 如果应用程序试图创建大小为负的数组，则抛出该异常。           |
| **NullPointerException**           | 当应用程序试图在需要对象的地方使用 `null` 时，抛出该异常     |
| NumberFormatException              | 当应用程序试图将字符串转换成一种数值类型，但该字符串不能转换为适当格式时，抛出该异常。 |
| SecurityException                  | 由安全管理器抛出的异常，指示存在安全侵犯。                   |
| StringIndexOutOfBoundsException    | 此异常由 `String` 方法抛出，指示索引或者为负，或者超出字符串的大小。 |
| UnsupportedOperationException      | 当不支持请求的操作时，抛出该异常。                           |

> RuntimeException 通常为代码质量问题，在开发过程中应该对各调用环节加以判断，出现 RuntimeException 基本都是程序员考虑不周，所以对以上异常容易出现的地方，开发人员应当注意。

<br>

**<span id="t122">检查性异常（ckecked exception）</span>** 

除了RuntimeException的其它异常。 此类异常是编译器要求必须处理的异常，在javac阶段就可被发现，必须通过 **try-catch** 或者 **throw** 处理，否则编译不会通过。

正确的程序在运行中，很容易出现的、情理可容的异常状况。 

> 例如：**FileNotFoundException**文件未找到，此类异常在开发过程中可以被预见，需要通过 **try-catch** 或者 **throw** 处理。

常见的检查性异常如下：

| **异常**                   | **描述**                                                     |
| -------------------------- | ------------------------------------------------------------ |
| ClassNotFoundException     | 应用程序试图加载类时，找不到相应的类，抛出该异常。           |
| CloneNotSupportedException | 当调用 `Object` 类中的 `clone` 方法克隆对象，但该对象的类无法实现 `Cloneable` 接口时，抛出该异常。 |
| IllegalAccessException     | 拒绝访问一个类的时候，抛出该异常。                           |
| InstantiationException     | 当试图使用 `Class` 类中的 `newInstance` 方法创建一个类的实例，而指定的类对象因为是一个接口或是一个抽象类而无法实例化时，抛出该异常。 |
| InterruptedException       | 一个线程被另一个线程中断，抛出该异常。                       |
| NoSuchFieldException       | 请求的变量不存在                                             |
| NoSuchMethodException      | 请求的方法不存在                                             |

其实检查性异常就是开发过程中，编译器爆红需要你 **try-catch** 的代码块。

<br>

### <span id="t13">异常处理</span>

这里都是老生常谈了，三个处理方式。

<br>

**<span id="t131">抛出异常</span>** 

```
if (i == 1) throw new NullPointerException();
```

如果使用抛出异常的方式，这个方法的**调用方**就必须对这些可检查异常进行处理。 

<br>

**<span id="t132">声明异常</span>** 

使用 **throws** 在方法上声明异常例如

```java
void f() throws TooBig, TooSmall, DivZero { ... }
```

表示此方法**只会抛出已声明的异常**，没有声明的异常不会抛出，依然由java异常处理机制接管。 

<br>

**<span id="t133">捕获异常</span>** 

异常捕捉基本就是 **try-catch-finally** 方式，如下：

```java
try{
     //try块中放可能发生异常的代码。
     //如果执行完try且不发生异常，则接着去执行finally块和finally后面的代码
     //如果发生异常，则尝试去匹配catch块。
}catch(SQLException SQLexception){
    //每一个catch块用于捕获并处理一个特定的异常，或者这异常类型的子类。Java7中可以将多个异常声明在一个catch中。
    //catch后面的括号定义了异常类型和异常参数。如果异常与之匹配且是最先匹配到的，则虚拟机将使用这个catch块来处理异常。
    //在catch块中可以使用这个块的异常参数来获取异常的相关信息。异常参数是这个catch块中的局部变量，其它块不能访问。
    //如果当前try块中发生的异常在后续的所有catch中都没捕获到，则先去执行finally，然后到这个函数的外部caller中去匹配异常处理器。
    //如果try中没有发生异常，则所有的catch块将被忽略。
}catch(Exception exception){
    //...
}finally{
    //finally块通常是可选的。
   //无论异常是否发生，异常是否匹配被处理，finally都会执行。
   //一个try至少要有一个catch块，否则， 至少要有1个finally块。但是finally不是用来处理异常的,finally不会捕获异常。
  //finally主要做一些清理工作，如流的关闭，数据库连接的关闭等。 
}
```

需要注意的点：

>1、try块中的局部变量和catch块中的局部变量（包括异常变量），以及finally中的局部变量，它们之间不可共享使用。
>
>2、每一个catch块用于处理一个异常。异常匹配是按照catch块的顺序从上往下寻找的，只有第一个匹配的catch会得到执行。匹配时，不仅运行精确匹配，也支持父类匹配，因此，如果同一个try块下的多个catch异常类型有父子关系，应该将子类异常放在前面，父类异常放在后面，这样保证每个catch块都有存在的意义。
>
>3、java中，异常处理的任务就是将执行控制流从异常发生的地方转移到能够处理这种异常的地方去。也就是说：当一个函数的某条语句发生异常时，这条语句的后面的语句不会再执行，它失去了焦点。执行流跳转到最近的匹配的异常处理catch代码块去执行，异常被处理完后，执行流会在“这个异常的catch代码块”后面接着执行。



对于 **finally** 的使用，需要注意：

> 1、不要在finally中抛出异常，finally块没有处理异常的能力，处理异常的只能是catch块。
>
> 2、在同一try…catch…finally块中 ，如果try中抛出异常，且有匹配的catch块，则先执行catch块，再执行finally块。如果没有catch块匹配，则先执行finally，然后去外面的调用者中寻找合适的catch块。
>
> 3、在同一try…catch…finally块中 ，try发生异常，且匹配的catch块中处理异常时也抛出异常，那么后面的finally也会执行：首先执行finally块，然后去外围调用者中寻找合适的catch块。
>
> 4、不要在fianlly中使用return，否则会覆盖返回值
>
> 5、减轻finally的任务，不要在finally中做一些其它的事情，finally块仅仅用来释放资源是最合适的。
>
> 6、尽量将所有的return写在函数的最后面，而不是try … catch … finally中。

<br>

**<span id="t134">Try-With-Resources 用法</span>** 

上面的描述中，在 **finally** 中经常出现关闭资源的情况，对代码整洁程度造成巨大影响，并且难以维护。

Java 7 引入了 try-with-resources 语法，它可以非常清楚地简化 。例如：

```java
    try( 
          InputStream in = new FileInputStream( new File("TryWithResources.java") )
    ) {
          int contents = in.read();
          // Process contents
       } catch(IOException e) {
          // Handle the error
       }
```

无论你如何退出 try 块（正常或异常），都会执行前一个 finally 子句的等价物，但不会编写那些杂乱而棘手的代码。

自动关闭资源，你值得拥有。

<br>

### <span id="t14">异常部分参考文章</span>

《On Java 8》：<a href="https://lingcoder.gitee.io/onjava8/#/book/15-Exceptions" target="_blank">https://lingcoder.gitee.io/onjava8/#/book/15-Exceptions</a>

<a href="https://blog.csdn.net/Jin_Kwok/article/details/89818412" target="_blank">https://blog.csdn.net/Jin_Kwok/article/details/89818412</a>

<a href="https://www.jianshu.com/p/5a6ad79ce12a" target="_blank">https://www.jianshu.com/p/5a6ad79ce12a</a>

<a href="https://blog.csdn.net/qq_29229567/article/details/80773970" target="_blank">https://blog.csdn.net/qq_29229567/article/details/80773970</a>

<a href="https://blog.csdn.net/u010647035/article/details/80382079" target="_blank">https://blog.csdn.net/u010647035/article/details/80382079</a>

<a href="https://www.iteye.com/blog/coffeesweet-1172890" target="_blank">https://www.iteye.com/blog/coffeesweet-1172890</a>

<a href="https://www.cnblogs.com/barrywxx/p/9993005.html" target="_blank">https://www.cnblogs.com/barrywxx/p/9993005.html</a>



<br>

## <span id="t2">2. 序列化</span>

**Serializable** 序列化一直是我迷惑的地方，在我开始开发工作时，entity基类都实现了序列化接口，现在总算找到机会了解下了。

**jdk api 文档里面关于接口 Serializable 的描述：**

类通过实现 java.io.Serializable 接口以启用其序列化功能。 

未实现此接口的类将无法使其任何状态序列化或反序列化。

可序列化类的所有子类型本身都是可序列化的。因为实现接口也是间接的等同于继承。 

序列化接口没有方法或字段，仅用于标识可序列化的语义。

<br>

### <span id="t21">序列化的概念</span>

> Java提供一种机制叫做序列化，通过有序的格式或者字节序列持久化java对象，其中包含对象的数据，还有对象的类型，和保存在对象中的数据类型，反之就是反序列化。

其实就是将对象写入IO流的过程。

**序列化的意义：** 序列化机制允许将实现序列化的Java对象转换位字节序列，这些字节序列可以保存在磁盘上，或通过网络传输，以达到以后恢复成原来的对象。序列化机制使得对象可以脱离程序的运行而独立存在。

 <br>

### <span id="t22">序列化的使用场景</span>

1. 当你想把的内存中的对象状态保存到一个文件中或者数据库中时候；     
2. 当你想用套接字在网络上传送对象的时候；    
3. 当你想通过RMI（remote method invoke,即远程方法调用）传输对象的时候； 

**通常建议：程序创建的每个JavaBean类都实现Serializeable接口。** 

<br>

### <span id="t23">序列化的底层原理</span>

底层原理移步大神的文章：<a href="https://blog.csdn.net/weixin_39723544/article/details/80527550" target="_blank">https://blog.csdn.net/weixin_39723544/article/details/80527550</a>

若无法访问，还留有截图：<a href="https://github.com/qianwei4712/static-resources/blob/master/showns/images/SerializablePrinciple.png" target="_blank">https://github.com/qianwei4712/static-resources/blob/master/showns/images/SerializablePrinciple.png</a>

<br>

### <span id="t24">serialVersionUID 的作用和用法</span>

serialVersionUID 是用于保证同一个对象（在序列化中会被用到）可以在Deserialization过程中被载入。serialVersionUID 是用于对象的版本控制。 

例如，随着项目升级，class文件也会升级，serialVersionUID 就是保证升级后的class对应关系，即使更改了序列化属性，也能反序列回来。

**序列化版本号可自由指定，如果不指定，JVM会根据类信息自己计算一个版本号，这样随着class的升级，就无法正确反序列化；**

**不指定版本号另一个明显隐患是，不利于jvm间的移植，可能class文件没有更改，但不同jvm可能计算的规则不一样，这样也会导致无法反序列化。** 

<br>

### <span id="t25">其他注意事项</span>

1. static 和 transient 修饰的字段是不会被序列化的 。

   不想某字段被序列化，就加上 transient 修饰。这也是修饰后数据库不会做这个字段的映射，,ORM框架将忽略该属性，序列化过程忽略了这个字段。

2. 序列化对象的引用类型成员变量，也必须是可序列化的，否则，会报错。 

3. 同一对象序列化多次，只有第一次序列化为二进制流，以后都只是保存序列化编号，不会重复序列化。 


<br>


 ### <span id="t26">序列化部分参考文章</span>

<a href="https://www.cnblogs.com/9dragon/p/10901448.html" target="_blank">https://www.cnblogs.com/9dragon/p/10901448.html</a>

<a href="https://www.cnblogs.com/qq3111901846/p/7894532.html" target="_blank">https://www.cnblogs.com/qq3111901846/p/7894532.html</a>

<a href="https://blog.csdn.net/weixin_39723544/article/details/80527550" target="_blank">https://blog.csdn.net/weixin_39723544/article/details/80527550</a>

<a href="https://blog.csdn.net/u013870094/article/details/82765907" target="_blank">https://blog.csdn.net/u013870094/article/details/82765907</a>

<a href="https://www.oschina.net/translate/serialization-in-java" target="_blank">https://www.oschina.net/translate/serialization-in-java</a>

<a href="http://www.matools.com/blog/190653362" target="_blank">http://www.matools.com/blog/190653362</a>




