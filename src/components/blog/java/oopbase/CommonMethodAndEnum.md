<div class="catalog">

- [Object基础方法](#t1)
  - [registerNatives](#t11)
  - [hashCode](#t12)
    - [hashCode的作用](#t121)
    - [hashCode()重写](#t122)
  - [equals](#t13)
    - [equals()重写](#t131)
  - [toString](#t14)
  - [clone](#t15)
  - [finalize](#t16)
- [枚举](#t2)
    - [用enum代替static final常量](#t21)
    - [使用EnumMap](#t22)
- [参考文章](#t3)
</div>

## <span id="t1">Object基础方法</span>

**Object** 共有12个自带方法，**notify、wait** 类线程方法将会在线程相关章节涉及，**getClass** 在反射章节讲。

```java
private static native void registerNatives();
public native int hashCode();
public boolean equals(Object obj) { return (this == obj); }
public String toString() { return getClass().getName() + "@" + Integer.toHexString(hashCode()); }
protected native Object clone() throws CloneNotSupportedException;
protected void finalize() throws Throwable { }
/////////////////////////////////////////////////////////////
public final native Class<?> getClass();
public final native void notify();
public final native void notifyAll();
public final native void wait(long timeout) throws InterruptedException;
public final void wait(long timeout, int nanos) throws InterruptedException{...}
public final void wait() throws InterruptedException { wait(0); }
```

<br>

### <span id="t11">registerNatives</span>

这是一个 `private static native` 方法，这里有个 **native** 关键字，忽然一脸懵逼，百度了下，顺便贴一下这个关键字的作用，开发中可以忽略。

> Java有两种方法：Java方法和本地方法。
>
> Java方法是由Java语言编写，编译成字节码，存储在class文件中。
>
> 本地方法是由其他语言（比如C，C++，或者汇编）编写的，编译成和处理器相关的机器代码，本地方法保存在动态连接库中，格式是各个平台专有的。
>
> 运行中的Java程序调用本地方法时，虚拟机装载包含这个本地方法的动态库，并调用这个方法，本地方法是联系Java程序和底层主机操作系统的连接方法。
>
> Java Native Interface (JNI) 标准就成为java平台的一部分，它允许Java代码和其他语言写的代码进行交互。 
>
> 简单地讲，一个用Native关键字修饰的方法就是一个java调用非java代码的接口； 

registerNatives本质上就是一个本地方法，但这又是一个有别于一般本地方法的本地方法，从方法名我们可以猜测该方法应该是用来注册本地方法的。上述代码的功能就是先定义了registerNatives()方法，然后当该类被加载的时候，调用该方法完成对该类中本地方法的注册。

也就是说，凡是包含registerNatives()本地方法的类，同时也包含了其他本地方法。所以，当包含registerNatives()方法的类被加载的时候，注册的方法就是该类所包含的除了registerNatives()方法以外的所有本地方法。

<br>

### <span id="t12">hashCode</span>

#### <span id="t121">hashCode的作用</span>

根据百度百科，hash实际上是一种散列算法，是将不同的输入散列程特定长度的输出；不同的输入可能会得到相同的输出，所以不能从散列值来判断出输入值。 

`hashCode()`方法给对象返回一个int类型的 hash code 值。

在Java中，有一些哈希容器，比如Hashtable,HashMap等等。当我们调用这些容器的诸如get(Object obj)方法时，容器的内部肯定需要判断一下当前obj对象在容器中是否存在，然后再进行后续的操作。一般来说，判断是够存在，肯定是要将obj对象和容器中的每个元素一一进行比较，要使用equals()才是正确的。 

但是如果哈希容器中的元素有很多的时候，使用equals()必然会很慢。这个时候我们想到一种替代方案就是hashCode(）：当我们调用哈希容器的get(Object obj)方法时，它会首先利用查看当前容器中是否存在有相同哈希值的对象，如果不存在，那么直接返回null；如果存在，再调用当前对象的equals()方法比较一下看哈希处的对象是否和要查找的对象相同；如果不相同，那么返回null。如果相同，则返回该哈希处的对象。 

**hashCode()被设计用来使得哈希容器能高效的工作。也只有在哈希容器中，才使用hashCode()来比较对象是否相等，但要注意这种比较是一种弱的比较，还要利用equals()方法最终确认。** 

**我们把hashCode()相等看成是两个对象相等的必要非充分条件，把equals()相等看成是两个对象相等的充要条件**。 

>  在许多时候被认为 hash code 为内存位置，实际上，hashCode()作为一个native方法，它和对象地址确实有关系，实际上并不仅仅是对象地址。它代表的实际上是hash表中对应的位置。



#### <span id="t122">hashCode()重写</span>

以下约定摘自Object规范JavaSE 1.6
<table>
    <tr>
       <td>1.equals方法所比较的信息没有被修改，hashCode方法返回同一个整数。在同一个应用程序的多次执行过程中，hashCode每次返回的整数可以不一致。</td>
    </tr>
    <tr>
        <td> 2.如果两个对象equals方法比较相等，那么调用hashCode方法返回结果必须相等。</td>
    </tr>
    <tr>
      <td>3.如果两个对象调用equals方法不相等，调用hashCode方法返回不一定相等。但是返回不相等的整数，有可能提高散列表（hash table）的性能</td>
    </tr>
</table>



>关于hashCode方法：<br>
>因此，重写equals方法而没有重写hashCode方法会违反第二条规范。

例如，测试类PhoneNumber()
```java
public final class PhoneNumber {
    private int areaCode;
    private int prefix;
    private int lineNumber;

    //添加构造器
    public PhoneNumber(int areaCode, int prefix, int lineNumber) {
        this.areaCode = areaCode;
        this.prefix = prefix;
        this.lineNumber = lineNumber;
    }

    //重写equals方法
    @Override
    public boolean equals(Object obj) {
        //判断是否为本对象的引用
        if (this==obj) return true;
        //判断是否和本对象类型相同
        if (!(obj instanceof PhoneNumber)) return false;
        //进行域对比
        PhoneNumber p = (PhoneNumber) obj;
        return p.areaCode == areaCode 
              && p.lineNumber == lineNumber 
              && p.prefix == prefix;
    }
    
    //尚未重写hashCode方法
//    @Override
//    public int hashCode() {
//        return super.hashCode();
//    }
}
```
试图将这个类和HashMap一起使用：

 ```
   Map<PhoneNumber,String> map = new HashMap<PhoneNumber,String>();
   map.put(new PhoneNumber(100,200,300),"Shiva");
   //通过相同对象获取map.value
   map.get(new PhoneNumber(100,200,300));
 ```
上面的测试中，map.get()期望获得"Shiva"字符串，然而实际上是null。因为这里的PhoneNumber涉及到了两个对象。new PhoneNumber()产生的是一个全新的对象。两张十块钱虽然等价，但是并不认为是同一张。

这里贴下HashMap.get()方法，基本就是对比散列码（哈希码），获取获取对应值。

 ```java
 //HashMap的get()方法 
   public V get(Object key) {
         Node<K,V> e;
         return (e = getNode(hash(key), key)) == null ? null : e.value;
     }
   //get()方法中调用的hash()方法
   static final int hash(Object key) {
         int h;
         return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
     }
 ```
**>>> : 无符号右移，忽略符号位，空位都以0补齐**

如果重写了PhoneNumber()的HashCode方法。例如：

```java
   @Override
    public int hashCode() {
         return 42;
     }
```
这样，在测试代码中就能得到"Shiva"，而且这种写法是合法的，保证了相等对象具有相同的哈希码。但是，每个对象都具有相同的哈希码，因此，每个对象都会被映射到同一个散列桶中，是散列表退化为链表（linked  list）。使得本该线性时间运行的程序变成以平方级时间运行。对大规模的散列表，会影响正常运行。

HashCode的重写方式：

一个好的HashCode方法倾向于“为不同对象产生不同的哈希码”。通过以下方式，可以尽可能做到这一点：

>1.把某个非零的常数值，比如17，保存在一个名为result的int类型的变量中

>2.对于对象中的每个域f（equals方法中涉及到的每个域），完成以下步骤：
>>a.为该域计算int类型的哈希码c:
>>>i.如果该域是boolean类型，则计算（f  ? 1 : 0）<br>
>>>ii.如果该域是byte，char，short或者int类型，则计算（int）f<br>
>>>iii.如果该域是long类型，则计算（int）(f ^ f >>> 32)<br>
>>>iv.如果该域是float类型，则计算Float.floatToIntBits(f)<br>
>>>v.如果该域是double类型，则计算Double.doubleToIntBits(f),然后按照步骤2.a.iii，为得到的long类型值计算散列值<br>
>>>vi.如果该域是一个对象引用，并且该类的equals方法通过递归调用equals的方式来比较这个域，则同样为这个域递归调用hashCode。如果这个域值为null，则返回0（或者为其他常数）<br>
>>>vii.如果该域是一个数组，则将每一个元素当成单独域来处理。递归调用上面的方法<br>

>>b.按照下面公式，把步骤2.a中计算得到的哈希码c，合并到result中<br>
>>result = 31 * result + c;

>3.返回result

>4.写完后，查看是否“相等的实例是否具有相同hashCode”，并单元测试。

<br>

### <span id="t13">equals</span>

一般的包装类型都重写了 `equals()` 方法，并不是直接对比内存地址。

- **自反性**（reflexive）。对于任意不为`null`的引用值x，`x.equals(x)`一定是`true`。 
- **对称性**（symmetric）。对于任意不为`null`的引用值`x`和`y`，当且仅当`x.equals(y)`是`true`时，`y.equals(x)`也是`true`。 
- **传递性**（transitive）。对于任意不为`null`的引用值`x`、`y`和`z`，如果`x.equals(y)`是`true`，同时`y.equals(z)`是`true`，那么`x.equals(z)`一定是`true`。 
- **一致性**（consistent）。对于任意不为`null`的引用值`x`和`y`，如果用于equals比较的对象信息没有被修改的话，多次调用时`x.equals(y)`要么一致地返回`true`要么一致地返回`false`。 
- 对于任意不为`null`的引用值`x`，`x.equals(null)`返回`false`。 

#### <span id="t131">equals()重写</span>

<table>
    <tr>
       <td> 1.使用 == 操作符检查“参数是否为对这个对象的引用”</td>
    </tr>
    <tr>
        <td> 2.使用 instanceif 操作符检查“参数是否为正确的类型”</td>
    </tr>
    <tr>
      <td> 3.对于该类中的每个“关键（significant）”域，检查参数中的域是否与该对象中对应的域相匹配</td>
    </tr>
</table>

关于equals方法：

* 使用 == 操作符检查“参数是否为对这个对象的引用”。如果equals的对象为本身的引用，那么返回肯定是true。在方法内首先判断，可以做为一种性能优化，如果操作比较昂贵，就值得这么做。
* 使用 instanceof 操作符检查“参数是否为正确的类型”。instanceof 操作符可以判断传入参数与本身类型是否相同。也相当于是一种性能优化。其次，在有些情况下，指该类所实现得接口。例如集合接口（collection interface）得Set，List，Map和Map.Entry。
* 对于该类中的每个“关键（significant）”域，检查参数中的域是否与该对象中对应的域相匹配。如果第二条中的类型是个接口，就必须通过接口方法访问参数中的域；如果是个类，就可以直接访问。

<table>
    <tr>
        <td>基本类型域</td>
        <td>除了float和double，可以直接使用==进行比较</td>
    </tr>
    <tr>
         <td>对象引用域</td>
         <td>可以调用引用对象的equal方法</td>
    </tr>
    <tr>
         <td>float域</td>
         <td>Float.compare方法</td>
    </tr>
    <tr>
         <td>double域</td>
         <td>Double.compare方法</td>
    </tr>
</table>

> float和double的比较需要经过特殊处理，存在例如Float.NaN，-0.0f的常量。有些对象可以包含null，需要考虑避免空指针异常。

**域的比较顺序可能会影响equal方法的效率，应该最先比较最有可能不同的域，或者开销最低的域。**

不要将equals声明中的Object对象替换为其他（那就不是重写方法了，而是自定义方法。）

> 在自定义一个类的时候，我们必须要同时重写equals()和hashCode()，并且必须保证： 
>
> 其一：如果两个对象的equals()相等，那么他们的hashCode()必定相等。
>
> 其二：如果两个对象的hashCode()不相等，那么他们的equals()必定不等。 

<br>

### <span id="t14">toString</span>

Object默认**toString**方法为16进制 **hashcode** 字符串，

```java
public String toString() { 
    return getClass().getName() + "@" + Integer.toHexString(hashCode()); 
}
```

以下摘自《effective java》:

toString 的通用约定要求**「建议所有的子类重写这个方法」**，返回的字符串应该是**「一个简洁但内容丰富的表示，对人们来说是很容易阅读的」**。 

在静态工具类中编写 toString 方法是没有意义的。 你也不应该在大多数枚举类型中写一个 toString 方法，因为 Java 为你提供了一个非常好的方法。 

但是，你应该在任何抽象类中定义 toString 方法，该类的子类共享一个公共字符串表示形式。 例如，大多数集合实现上的 toString 方法都是从抽象集合类继承的。 

除非父类已经这样做了，否则在每个实例化的类中重写 Object 的 toString 实现。 它使得类更加舒适地使用和协助调试。 toString 方法应该以一种美观的格式返回对象的简明有用的描述。 

<br>

### <span id="t15">clone</span>

clone() 方法返回与当前对象的一个副本对象，使用 clone() 方法需要实现 Cloneable 接口。 

clone() 在 Object 中是 **protected** 方法，在别的类中调用需要重写。

在Java中，clone() 方法有两种不同的模式，即浅复制和深复制（也被称为浅拷贝和深拷贝）。

<img src="@/assets/blog/img/CommonMethodAndEnum1.png"/>

> 对于浅复制，只是对象的引用得到的复制；如果对象中存在其他对象的引用，使用浅复制后，源对象和复制后的对象中对其他对象的引用会指向同一个内存地址。如果要完全把两个对象在内存中分开，必须使用深复制。 

**阿里巴巴Java开发手册中提到，慎用自带 clone() 方法，默认是浅拷贝。所以需要用到 clone()  一定要重写。**

**深拷贝举例：**

```java
class Stu implements Cloneable{
    String name;
    Pen pen = new Pen();
    @Override
    protected Object clone() throws CloneNotSupportedException {
        Stu temp = (Stu) super.clone();
        temp.pen = (Pen) pen.clone();
        return temp;
    }
}
class Pen implements Cloneable{
    String name;
    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```



<br>

### <span id="t16">finalize</span>

  java提供finalize()方法，垃圾回收器准备释放内存的时候，会先调用finalize()。 对于垃圾回收，需要首先了解**《JAVA编程思想》中对finalize的讲解** :

1. 对象不一定会被回收。 
2. 垃圾回收不是析构函数。 
3. 垃圾回收只与内存有关。 
4. 垃圾回收和finalize()都是靠不住的，只要JVM还没有快到耗尽内存的地步，它是不会浪费时间进行垃圾回收的。 

在Java中，由于GC的自动回收机制，因而并不能保证finalize方法会被及时地执行（垃圾对象的回收时机具有不确定性），也不能保证它们会被执行(程序由始至终都未触发垃圾回收)。 



**finalize()使用时机**

finalize()方法中一般用于释放非Java 资源（如打开的文件资源、数据库连接等），或是调用非Java方法（native方法）时分配的内存（比如C语言的malloc()系列函数），上面提到的 clone() 创建的。



**应该避免使用finalize()**

GC可以回收大部分的对象（凡是new出来的对象，gc都能搞定，一般情况下我们不会用new以外的方式去创建对象），所以一般是不需要程序员去实现finalize的。 

以下摘自《Effective Java》:

> 1、终结方法（finalizer）通常是不可预测的，也是很危险的，一般情况下是不必要的。是使用终结方法会导致行为不稳定、降低性能，以及可移植性问题。所以，我们应该避免使用终结方法。 
>
> 2、使用终结方法有一个非常严重的性能损失。在我的机器上，创建和销毁一个简单对象的时间大约为5.6ns、增加一个终结方法使时间增加到了2400ns。换句话说，用终结方法创建和销毁对象慢了大约430倍。 
>
> 3、如果实在要实现终结方法，要记得调用super.finalize() 






## <span id="t2">枚举</span>

<img src="@/assets/blog/img/CommonMethodAndEnum2.png"/>

### <span id="t21">用enum代替static final常量</span>
此部分参考自《Effective Java》

以前我习惯用下列方法：

```java
//使用static final两个修饰符
public static final String SUNDAY = "0";
public static final String MONDAY = "1";
```
这种方式被成为枚举模式。但是这种方式在安全性和使用便捷上没有帮助。还存在其他缺陷：

例如要打印一组枚举常量，用 static final 修饰符定义的常量，无法直接获得，甚至我无法知道这组常量的长度。

平常使用中，经常用 static final 定义String类型，这样做可能会存在性能问题。因为它以来字符串的比较操作。更糟糕的是，这些常量是硬编码（写死）在代码中的，几乎无法更改。


从Java 1.5开始，就提出了枚举类型，解决上述问题，并提供了许多好处。

>  **枚举类型的基本想法：通过公有的静态 final 域为每个枚举常量导出实例。枚举没有构造器，所以是真正的 final 类型。**


枚举类型还允许添加任意的方法和域，并实现任意的接口。它还提供了所有Object方法的高级实现。枚举的每一个实例都有其方法和域。

```java
public enum Planet {
    //枚举常量括号内的参数，会传递给构造器
    MERCURY(3.302e+23, 2.439e6),
    EARTH(5.975e+24, 6.378e6);

    private final double mass;
    private final double radius;
    private final double surfaceGravity;

    private static final double G = 6.67300E-11 ;

    //枚举类型构造器，构造上述类型,但是这个构造方法无法在外部用于构造实例
    Planet(double mass, double radius) {
        this.mass = mass;
        this.radius = radius;
        surfaceGravity = G * mass / ( radius * radius );
    }

    public double mass(){ return mass;}

    public double radius() { return radius; }
    public double surfaceGravity() { return surfaceGravity; }

    public double surfaceWeight(double mass){
        return mass * surfaceGravity;
    }
}
```
上述示例中，为了将数据和枚举常量关联起来，得声明实例域，并编写一个带有数据并将数据保存在域中的构造器。枚举天生就是不可变的，因此所有的域应该为 final 。

```java
//直接获取实例，并访问内部方法
Planet.EARTH.surfaceGravity()
//用values()方法获取实例列表
Planet.values()
```
最后一个值得一提的是，有时候每个枚举实例，需要有各自不同的方法，比如基本运算。若枚举对象运算有加减乘除四个实例。显然用 switch 来判断并不合适。

```java
public enum  Operation {
    PLUS("+") {
        double apply(double x, double y){ return x + y ; }
    },
    MINUS("-"){
        double apply(double x, double y){ return x - y ; }
    };

    Operation(String symbol) {
        this.symbol = symbol;
    }

    private final String symbol;
    public String getSymbol() {
        return symbol;
    }

    //抽象方法，每个实例重写自己的方法
    abstract double apply(double x, double y);

    //这里重写toString方法在遍历时有奇效。不妨试一试
    @Override
    public String toString() {
        return symbol;
    }
}
```


### <span id="t22">使用EnumMap</span>
此部分引用自《On Java 8》

EnumMap 是一种特殊的 Map，它要求其中的键（key）必须来自一个 enum，由于 enum 本身的限制，所以 EnumMap 在内部可由数组实现。因此 EnumMap 的速度很快，我们可以放心地使用 enum 实例在 EnumMap 中进行查找操作。不过，我们只能将 enum 的实例作为键来调用 put() 可方法，其他操作与使用一般的 Map 差不多。 

下面的例子演示了*命令设计模式*的用法。一般来说，命令模式首先需要一个只有单一方法的接口，然后从该接口实现具有各自不同的行为的多个子类。接下来，程序员就可以构造命令对象，并在需要的时候使用它们了： 

```java
// enums/EnumMaps.java
// Basics of EnumMaps
// {java enums.EnumMaps}
package enums;
import java.util.*;
import static enums.AlarmPoints.*;
interface Command { void action(); }
public class EnumMaps {
    public static void main(String[] args) {
        EnumMap<AlarmPoints,Command> em =
                new EnumMap<>(AlarmPoints.class);
        em.put(KITCHEN,
                () -> System.out.println("Kitchen fire!"));
        em.put(BATHROOM,
                () -> System.out.println("Bathroom alert!"));
        for(Map.Entry<AlarmPoints,Command> e:
                em.entrySet()) {
            System.out.print(e.getKey() + ": ");
            e.getValue().action();
        }
        try { // If there's no value for a particular key:
            em.get(UTILITY).action();
        } catch(Exception e) {
            System.out.println("Expected: " + e);
        }
    }
}

```

输出为： 

```java
BATHROOM: Bathroom alert!
KITCHEN: Kitchen fire!
Expected: java.lang.NullPointerException

```

与 EnumSet 一样，enum 实例定义时的次序决定了其在 EnumMap 中的顺序。

main0 方法的最后部分说明，enum 的每个实例作为一个键，总是存在的。但是，如果你没有为这个键调用 put() 方法来存人相应的值的话，其对应的值就是 null。

与常量相关的方法（constant-specific methods 将在下一节中介绍）相比，EnumMap 有一个优点，那 EnumMap 允许程序员改变值对象，而常量相关的方法在编译期就被固定了。稍后你会看到，在你有多种类型的 enum，而且它们之间存在互操作的情况下，我们可以用 EnumMap 实现多路分发（multiple dispatching）。



## <span id="t3">参考文章</span>

<a href="https://www.cnblogs.com/KingIceMou/p/7239668.html" target="_blank">https://www.cnblogs.com/KingIceMou/p/7239668.html</a>

<a href="https://www.jianshu.com/p/8236d9bc2abf" target="_blank">https://www.jianshu.com/p/8236d9bc2abf</a>

<a href="https://blog.csdn.net/Saintyyu/article/details/90452826" target="_blank">https://blog.csdn.net/Saintyyu/article/details/90452826</a>

<a href="https://blog.csdn.net/dome_/article/details/92084823" target="_blank">https://blog.csdn.net/dome_/article/details/92084823</a>

<a href="https://www.cnblogs.com/Qian123/p/5703507.html#_labelTop" target="_blank">https://www.cnblogs.com/Qian123/p/5703507.html#_labelTop</a>

<a href="https://www.cnblogs.com/yibutian/p/9619696.html" target="_blank">https://www.cnblogs.com/yibutian/p/9619696.html</a>

<a href="https://www.cnblogs.com/KpGo/p/10454142.html" target="_blank">https://www.cnblogs.com/KpGo/p/10454142.html</a>

<a href="https://zhuanlan.zhihu.com/p/43001449" target="_blank">https://zhuanlan.zhihu.com/p/43001449</a>

<a href="https://jingyan.baidu.com/article/3ea51489bb18e152e71bba76.html" target="_blank">https://jingyan.baidu.com/article/3ea51489bb18e152e71bba76.html</a>

<a href="https://www.cnblogs.com/lolybj/p/9738946.html" target="_blank">https://www.cnblogs.com/lolybj/p/9738946.html</a>

<a href="https://www.iteye.com/blog/bijian1013-2288225" target="_blank">https://www.iteye.com/blog/bijian1013-2288225</a>

<a href="https://blog.csdn.net/crazylai1996/article/details/84900818" target="_blank">https://blog.csdn.net/crazylai1996/article/details/84900818</a>

<a href="https://blog.csdn.net/lixpjita39/article/details/79383957" target="_blank">https://blog.csdn.net/lixpjita39/article/details/79383957</a>

<a href="https://www.cnblogs.com/jingmoxukong/p/6098351.html" target="_blank">https://www.cnblogs.com/jingmoxukong/p/6098351.html</a>

