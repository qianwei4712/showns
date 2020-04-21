<div class="catalog">

- [前言](#t1)
- [Lambda 表达式](#t2)
- [方法引用](#t3)
- [Stream API](#t4)
- [Optional 类](#t5)
- [参考文章](#te)

</div>

### <span id="t1">前言</span>

据说从 JDK 9 开始，Oracle 放飞自我了，基本每半年一个版本；而且 JDK 9 做了太多和以前习惯不同的改变，例如：对反射进行了限制。这让很多原有的项目都踩了雷。

再加上 JDK 8 做了很多改进，最大限度的让绝大部分开发者都接受并且使用它，所以可以说 JDK 8 是使用最广的了。。。

我这里主要就学习记录下，**Lambda 表达式、方法引用、Stream API、Optional 类** 这几个新特性。

<br>

### <span id="t2">Lambda 表达式</span>

Lambda 表达式，也可称为闭包，它是推动 Java 8 发布的最重要新特性。

Lambda 允许把函数作为一个方法的参数（函数作为参数传递进方法中）。

使用 Lambda 表达式可以使代码变的更加简洁紧凑。

<br>

**语法格式**

```
(parameters) -> expression
或
(parameters) ->{ statements; }
```

以下是lambda表达式的重要特征:

- **可选类型声明：**不需要声明参数类型，编译器可以统一识别参数值。
- **可选的参数圆括号：**一个参数无需定义圆括号，但多个参数需要定义圆括号。
- **可选的大括号：**如果主体包含了一个语句，就不需要使用大括号。
- **可选的返回关键字：**如果主体只有一个表达式返回值则编译器会自动返回值，大括号需要指定明表达式返回了一个数值。

<br>

**使用方式展示**

```java
    List<String> list = Arrays.asList( "a", "b", "d" );
    for(String e:list){
        System.out.println(e);
    }
```

原代码遍历输出，顺便用一下在 JDK 8 中 Iterable 新增的 forEach 方法，使用匿名类效果为：

```java
    Arrays.asList( "a", "b", "d" ).forEach(new Consumer<String>() {
        @Override
        public void accept(String s) {
            System.out.println(s);
        }
    });
```

使用lambda表达式代替匿名类：

```java
Arrays.asList( "a", "b", "d" ).forEach( (String s) -> {System.out.println(s);} );
```

编译器可以统一识别类型；如果只有一个参数，可以省略圆括号；只有一个主题语句，可以省略大括号：

```java
 Arrays.asList( "a", "b", "d" ).forEach( s -> System.out.println(s) );
```



使用 Lambda 表达式需要注意以下几点：

- Lambda 表达式主要用来定义行内执行的方法类型接口，例如，一个简单方法接口。
- Lambda 表达式免去了使用匿名方法的麻烦，并且给予Java简单但是强大的函数化的编程能力。
- Lambda 表达式当中不允许声明一个与局部变量同名的参数或者局部变量。



<br>

### <span id="t3">方法引用</span>

方法引用通过方法的名字来指向一个方法。

方法引用可以使语言的构造更紧凑简洁，减少冗余代码。

方法引用使用一对冒号 `::` 。

```java
@FunctionalInterface
public interface Supplier<T> {
    T get();
}
 
class Car {
    //Supplier是jdk1.8的接口，这里和lamda一起使用了
    public static Car create(final Supplier<Car> supplier) {
        return supplier.get();
    }
 
    public static void collide(final Car car) {
        System.out.println("Collided " + car.toString());
    }
 
    public void follow(final Car another) {
        System.out.println("Following the " + another.toString());
    }
 
    public void repair() {
        System.out.println("Repaired " + this.toString());
    }
}
```

1. **构造器引用：**  它的语法是 `Class::new` ，或者更一般的 `Class< T >::new` 实例如下：

   ```java
   final Car car = Car.create( Car::new );
   final List< Car > cars = Arrays.asList( car );
   ```

2. **静态方法引用：** 它的语法是 `Class::static_method` ，实例如下：

   ```java
   cars.forEach( Car::collide );
   ```

3. **特定类的任意对象的方法引用：** 它的语法是 `Class::method` 实例如下：

   ```java
   cars.forEach( Car::repair );
   ```

4. **特定对象的方法引用：** 它的语法是 `instance::method` 实例如下：

   ```java
   final Car police = Car.create( Car::new );
   cars.forEach( police::follow );
   ```

比如，Lamada 表达式最后的语法还可以简化为：

```java
Arrays.asList( "a", "b", "d" ).forEach(System.out::println);
```



<br>

### <span id="t4">Stream API</span>

Java 8 API添加了一个新的抽象称为流Stream，可以让你以一种声明的方式处理数据。

Stream 使用一种类似用 SQL 语句从数据库查询数据的直观方式来提供一种对 Java 集合运算和表达的高阶抽象。

Stream API可以极大提高Java程序员的生产力，让程序员写出高效率、干净、简洁的代码。

<br>

**什么是 Stream？**

Stream（流）是一个来自数据源的元素队列并支持聚合操作

- 元素是特定类型的对象，形成一个队列。 Java中的Stream并不会存储元素，而是按需计算。
- **数据源** 流的来源。 可以是集合，数组，I/O channel， 产生器generator 等。
- **聚合操作** 类似SQL语句一样的操作， 比如filter, map, reduce, find, match, sorted等。

和以前的Collection操作不同， Stream操作还有两个基础的特征：

- **Pipelining**: 中间操作都会返回流对象本身。 这样多个操作可以串联成一个管道， 如同流式风格（fluent style）。 这样做可以对操作进行优化， 比如延迟执行(laziness)和短路( short-circuiting)。
- **内部迭代**： 以前对集合遍历都是通过Iterator或者For-Each的方式, 显式的在集合外部进行迭代， 这叫做外部迭代。 Stream提供了内部迭代的方式， 通过访问者模式(Visitor)实现。

<br>

**生成流**

在 Java 8 中, 集合接口有两个方法来生成流：

- **stream()** − 为集合创建串行流。
- **parallelStream()** − 为集合创建并行流。

然后接下来是应用示例：

**forEach**

Stream 提供了新的方法 forEach 来迭代流中的每个数据。以下代码片段使用 forEach 输出了10个随机数：

```java
new Random().ints().limit(10).forEach(System.out::println);
```

**map**

map 方法用于映射每个元素到对应的结果，以下代码片段使用 map 输出了元素对应的平方数：

```java
List<Integer> numbers = Arrays.asList(3, 2, 2, 3, 7, 3, 5);
// 获取对应的平方数
List<Integer> squaresList = numbers.stream().map( i -> i*i).distinct().collect(Collectors.toList());
```

**filter**

filter 方法用于通过设置的条件过滤出元素。以下代码片段使用 filter 方法过滤出空字符串：

```java
List<String>strings = Arrays.asList("abc", "", "bc", "efg", "abcd","", "jkl");
// 获取空字符串的数量
long count = strings.stream().filter(string -> string.isEmpty()).count();
```

**limit**

limit 方法用于获取指定数量的流。 以下代码片段使用 limit 方法打印出 10 条数据：

```java
Random random = new Random();
random.ints().limit(10).forEach(System.out::println);
```

**sorted**

sorted 方法用于对流进行排序。以下代码片段使用 sorted 方法对输出的 10 个随机数进行排序：

```java
Random random = new Random();
random.ints().limit(10).sorted().forEach(System.out::println);
```

**并行（parallel）程序**

parallelStream 是流并行处理程序的代替方法。以下实例我们使用 parallelStream 来输出空字符串的数量：

```java
List<String> strings = Arrays.asList("abc", "", "bc", "efg", "abcd","", "jkl");
// 获取空字符串的数量
int count = strings.parallelStream().filter(string -> string.isEmpty()).count();
```

**Collectors**

Collectors 类实现了很多归约操作，例如将流转换成集合和聚合元素。Collectors 可用于返回列表或字符串：

```java
List<String>strings = Arrays.asList("abc", "", "bc", "efg", "abcd","", "jkl");
List<String> filtered = strings.stream().filter(string -> !string.isEmpty()).collect(Collectors.toList());
 
System.out.println("筛选列表: " + filtered);
String mergedString = strings.stream().filter(string -> !string.isEmpty()).collect(Collectors.joining(", "));
System.out.println("合并字符串: " + mergedString);
```

**统计**

另外，一些产生统计结果的收集器也非常有用。它们主要用于int、double、long等基本类型上，它们可以用来产生类似如下的统计结果。

```java
List<Integer> numbers = Arrays.asList(3, 2, 2, 3, 7, 3, 5);
 
IntSummaryStatistics stats = numbers.stream().mapToInt((x) -> x).summaryStatistics();
 
System.out.println("列表中最大的数 : " + stats.getMax());
System.out.println("列表中最小的数 : " + stats.getMin());
System.out.println("所有数之和 : " + stats.getSum());
System.out.println("平均数 : " + stats.getAverage());
```



<br>

### <span id="t5">Optional 类</span>

Optional 类是一个可以为null的容器对象。如果值存在则isPresent()方法会返回true，调用get()方法会返回该对象。

Optional 是个容器：它可以保存类型T的值，或者仅仅保存null。Optional提供很多有用的方法，这样我们就不用显式进行空值检测。

`Optional`的引入是为了解决臭名昭著的**`空指针异常`**问题.

<br>

**构造方法**

首先 **Optional<T>** 是一个 **final** 类，底层仅有一个字段：

```java
    //存储值，如果非空则为原值，如果是null，不存在任何值
    private final T value;
```

构造方法也很简单，直接判断赋值：

```java
    //无参构造方法。默认值null
    private Optional() {
        this.value = null;
    }

    //返回一个空Optional类
    public static<T> Optional<T> empty() {
        @SuppressWarnings("unchecked")
        Optional<T> t = (Optional<T>) EMPTY;
        return t;
    }
    
    private static final Optional<?> EMPTY = new Optional<>();
```

<br>

**常用方法以及示例**

讲道理，我确实没发现这个类有哪里好用了，感觉就是把经常要进行的 if判空 包装了一下？

先贴下常用的几个代码：

```java
    //静态构造
    public static <T> Optional<T> ofNullable(T value) {
        return value == null ? empty() : of(value);
    }

    //存在值，返回true,否则返回false
    public boolean isPresent() {
        return value != null;
    }

    //如果存在值，则使用该值调用指定的使用者，否则为不执行。
    public void ifPresent(Consumer<? super T> consumer) {
        if (value != null)
            consumer.accept(value);
    }
    
    //如果不为空返回当前值，否则返回传入值
    public T orElse(T other) {
        return value != null ? value : other;
    }

    //如果值存在，并且这个值匹配给定的 predicate，返回一个Optional用以描述这个值，否则返回一个空的Optional。
    public Optional<T> filter(Predicate<? super T> predicate) {
        Objects.requireNonNull(predicate);
        if (!isPresent())
            return this;
        else
            return predicate.test(value) ? this : empty();
    }

    //如果有值，则对其执行调用映射函数得到返回值。如果返回值不为 null，则创建包含映射返回值的Optional作为map方法返回值，否则返回空Optional。
    public<U> Optional<U> map(Function<? super T, ? extends U> mapper) {
        Objects.requireNonNull(mapper);
        if (!isPresent())
            return empty();
        else {
            return Optional.ofNullable(mapper.apply(value));
        }
    }

    //如果值存在，返回基于Optional包含的映射方法的值，否则返回一个空的Optional
    public<U> Optional<U> flatMap(Function<? super T, Optional<U>> mapper) {
        Objects.requireNonNull(mapper);
        if (!isPresent())
            return empty();
        else {
            return Objects.requireNonNull(mapper.apply(value));
        }
    }
```



**个人感觉可以用到的一些场合：**

**第一个场景示例：**

假设我定义一个用户业务场景：

```java
   static class User{
        private String no;
        public String getNo() { return no; }
        public void setNo(String no) { this.no = no; }
    }
```

然后在实际使用中，可以在不知道 user 参数是否为空的情况下写业务语句。

```java
    public static void test2(User user){
        Optional<User> opt = Optional.ofNullable(user);
        opt.ifPresent(u -> {
            System.out.println("用户存在");
            System.out.println(u.getNo());
        });
    }
```

**第二个场景示例：**

```java
    public static void test3(User user){
        Optional<User> opt = Optional.ofNullable(user);
        user = opt.orElse(new User());
    }
```

这段代码相当于经常写到的判空赋值：

```java
if (user == null){
    user = new User();
}
```

**第三个场景示例：**

```java
     public static void test5(User user){
            Optional<User> opt = Optional.ofNullable(user);
            Optional<String> s = opt.map(user1 -> user.getNo());
            s.ifPresent(s1 -> System.out.println(s1));
        }
```

进行map转换，这段代码相当于，也是经常用到的：

```java
if (user != null && StringUtils.isNotBlank(user.getNo())){
    //业务逻辑
    System.out.println(user.getNo());
}
```
然后上面的还能简化为：
```java
Optional.ofNullable(user).map(User::getNo).ifPresent(s1 -> {
    //业务逻辑
    System.out.println(s1);
});
```


<br>

### <span id="te">参考文章</span>

<a href="https://www.runoob.com/java/java8-new-features.html" target="_blank">https://www.runoob.com/java/java8-new-features.html</a>

<a href="https://blog.csdn.net/qq_21434959/article/details/81350726" target="_blank">https://blog.csdn.net/qq_21434959/article/details/81350726</a>
