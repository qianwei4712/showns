本文撰写背景：闲着没事翻《effective java》，看完第三十条，然后把里面自认为能看懂的东西写一下。

<font color="#0099ff" size=5 face="黑体">枚举类型：是指由一组固定常量组成值的类型。</font>

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

> #### 枚举类型的基本想法：通过公有的静态 final 域为每个枚举常量导出实例。枚举没有构造器，所以是真正的 final 类型。


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

