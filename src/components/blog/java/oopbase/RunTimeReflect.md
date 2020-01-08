

- [反射机制基础](#t1)
- [反射概述](#t2)
- [获取Class的方法](#t3)
- [反射机制的相关类](#t4)
  - [Class类](#t41)
  - [Field类](#t42)
  - [Method类](#t43)
  - [Constructor类](#t44)
- [相关知识点](#t5)
- [参考文章](#t6)



<br>

根据《On Java 8》第19章，Java在运行时识别对象和类信息的方法主要有两种：

> 1. “传统的” RTTI（RunTime Type Information，运行时类型信息）：假定我们在编译时已经知道了所有的类型 
> 2. “反射”机制：允许我们在运行时发现和使用类的信息。 



<br>

## <span id="t1">反射机制基础</span>

Java 使用 `Class` 对象来实现 RTTI，即便是类型转换这样的操作都是用 `Class` 对象实现的。 

类是程序的一部分，每个类都有一个 `Class` 对象。 每当我们编写并且编译了一个新类，就会产生一个 `Class` 对象（更恰当的说，是被保存在一个同名的 `.class` 文件中）。为了生成这个类的对象，Java 虚拟机 (JVM) 先会调用"类加载器"子系统把这个类加载到内存中。 

类加载器子系统可能包含一条类加载器链，但有且只有一个**原生类加载器**，它是 JVM 实现的一部分。 

所有的类都是第一次使用时动态加载到 JVM 中的，当程序创建第一个对类的静态成员的引用时，就会加载这个类。 

> 其实构造器也是类的静态方法，虽然构造器前面并没有 `static` 关键字。所以，使用 `new` 操作符创建类的新对象，这个操作也算作对类的静态成员引用。 

因此，Java 程序在它开始运行之前并没有被完全加载，很多部分是在需要时才会加载。 

类加载器首先会检查这个类的 `Class` 对象是否已经加载，如果尚未加载，默认的类加载器就会根据类名查找 `.class` 文件。这个类的字节码被加载后，JVM 会对其进行验证，确保它没有损坏，并且不包含不良的 Java 代码(这是 Java 安全防范的一种措施)。 


<img src="@/assets/blog/img/ClassLoader1.png"/>

<br>



## <span id="t2">反射概述</span>

> **JAVA反射机制是在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法；**
>
> **对于任意一个对象，都能够调用它的任意一个方法和属性；**
>
> **这种动态获取的信息以及动态调用对象的方法的功能称为Java语言的反射机制。**
>
> **要想解剖一个类，必须先要获取到该类的字节码文件对象，而解剖使用的就是Class类中的方法，所以先要获取到每一个字节码文件对应的Class类型的对象** 

 简要的说，反射就是在运行时才知道需要的类是什么，然后从堆中获取class对象，并构造成类，调用其方法。

 **反射的优点：**反射提高了程序的灵活性和扩展性，降低耦合性，提高自适应能力。它允许程序创和控制任何类的对象，无需提前硬编码目标类 。

**反射的缺点：**性能问题，使用反射基本上是一种解释操作，用于字段和方法接入时要远慢于直接代码。因此反射机制主要应用在对灵活性和扩展性要求很高的系统框架上，普通程序不建议使用 。

<br>



## <span id="t3">获取Class的方法</span>

1. 通过**对象**调用 **getClass()** 方法来获取，通常应用在：比如你传过来一个 Object类型的对象，而我不知道你具体是什么类，用这种方法。
2. 使用 **Class.forName()** 静态方法。当知道某类的全路径名时，可以使用此方法获取 Class 类对象。用的最多，但可能抛出 ClassNotFoundException 异常。 
3. 直接通过 **类名.class** 的方式得到，该方法最为安全可靠，程序性能更高。 
4. 某些类自带的**TYPE**属性，例如：**Boolean.TYPE**



## <span id="t4">反射机制的相关类</span>

与Java反射相关的类如下：

| 类名          | 用途                                             |
| ------------- | ------------------------------------------------ |
| Class类       | 代表类的实体，在运行的Java应用程序中表示类和接口 |
| Field类       | 代表类的成员变量（成员变量也称为类的属性）       |
| Method类      | 代表类的方法                                     |
| Constructor类 | 代表类的构造方法                                 |

 <br>

### <span id="t41">Class类</span>

Class代表类的实体，在运行的Java应用程序中表示类和接口。在这个类中提供了很多有用的方法，这里对他们简单的分类介绍。

- **获得类相关的方法**

| 方法                       | 用途                                                   |
| -------------------------- | ------------------------------------------------------ |
| asSubclass(Class<U> clazz) | 把传递的类的对象转换成代表其子类的对象                 |
| Cast                       | 把对象转换成代表类或是接口的对象                       |
| getClassLoader()           | 获得类的加载器                                         |
| getClasses()               | 返回一个数组，数组中包含该类中所有公共类和接口类的对象 |
| getDeclaredClasses()       | 返回一个数组，数组中包含该类中所有类和接口类的对象     |
| forName(String className)  | 根据类名返回类的对象                                   |
| getName()                  | 获得类的完整路径名字                                   |
| newInstance()              | 创建类的实例                                           |
| getPackage()               | 获得类的包                                             |
| getSimpleName()            | 获得类的名字                                           |
| getSuperclass()            | 获得当前类继承的父类的名字                             |
| getInterfaces()            | 获得当前类实现的类或是接口                             |

- **获得类中属性相关的方法**

| 方法                          | 用途                   |
| ----------------------------- | ---------------------- |
| getField(String name)         | 获得某个公有的属性对象 |
| getFields()                   | 获得所有公有的属性对象 |
| getDeclaredField(String name) | 获得某个属性对象       |
| getDeclaredFields()           | 获得所有属性对象       |

- **获得类中注解相关的方法**

| 方法                                            | 用途                                   |
| ----------------------------------------------- | -------------------------------------- |
| getAnnotation(Class<A> annotationClass)         | 返回该类中与参数类型匹配的公有注解对象 |
| getAnnotations()                                | 返回该类所有的公有注解对象             |
| getDeclaredAnnotation(Class<A> annotationClass) | 返回该类中与参数类型匹配的所有注解对象 |
| getDeclaredAnnotations()                        | 返回该类所有的注解对象                 |

- **获得类中构造器相关的方法**

| 方法                                               | 用途                                   |
| -------------------------------------------------- | -------------------------------------- |
| getConstructor(Class...<?> parameterTypes)         | 获得该类中与参数类型匹配的公有构造方法 |
| getConstructors()                                  | 获得该类的所有公有构造方法             |
| getDeclaredConstructor(Class...<?> parameterTypes) | 获得该类中与参数类型匹配的构造方法     |
| getDeclaredConstructors()                          | 获得该类所有构造方法                   |

- **获得类中方法相关的方法**

| 方法                                                       | 用途                   |
| ---------------------------------------------------------- | ---------------------- |
| getMethod(String name, Class...<?> parameterTypes)         | 获得该类某个公有的方法 |
| getMethods()                                               | 获得该类所有公有的方法 |
| getDeclaredMethod(String name, Class...<?> parameterTypes) | 获得该类某个方法       |
| getDeclaredMethods()                                       | 获得该类所有方法       |

- **类中其他重要的方法**

| 方法                                                         | 用途                             |
| ------------------------------------------------------------ | -------------------------------- |
| isAnnotation()                                               | 如果是注解类型则返回true         |
| isAnnotationPresent(Class<? extends Annotation> annotationClass) | 如果是指定类型注解类型则返回true |
| isAnonymousClass()                                           | 如果是匿名类则返回true           |
| isArray()                                                    | 如果是一个数组类则返回true       |
| isEnum()                                                     | 如果是枚举类则返回true           |
| isInstance(Object obj)                                       | 如果obj是该类的实例则返回true    |
| isInterface()                                                | 如果是接口类则返回true           |
| isLocalClass()                                               | 如果是局部类则返回true           |
| isMemberClass()                                              | 如果是内部类则返回true           |

<br>

### <span id="t42">Field类</span>

Field代表类的成员变量（成员变量也称为类的属性）。

| 方法                          | 用途                    |
| ----------------------------- | ----------------------- |
| equals(Object obj)            | 属性与obj相等则返回true |
| get(Object obj)               | 获得obj中对应的属性值   |
| set(Object obj, Object value) | 设置obj中对应属性值     |

<br>

### <span id="t43">Method类</span>

Method代表类的方法。

| 方法                               | 用途                                     |
| ---------------------------------- | ---------------------------------------- |
| invoke(Object obj, Object... args) | 传递object对象及参数调用该对象对应的方法 |

<br>

### <span id="t44">Constructor类</span>

Constructor代表类的构造方法。

| 方法                            | 用途                       |
| ------------------------------- | -------------------------- |
| newInstance(Object... initargs) | 根据传递的参数创建类的对象 |

 

 <br>

### <span id="t5">相关知识点</span>

**设置.setAccessible(true)暴力访问权限**

一般情况下，我们并不能对类的私有字段进行操作，利用反射也不例外。

调用AccessibleObject上的setAccessible()方法来允许这种访问，而由于反射类中的Field，Method和Constructor继承自AccessibleObject，因此，通过在这些类上调用setAccessible()方法，我们可以实现对这些字段的操作。 



**获取Filed两个方法的区别**

两者的区别就是 getDeclaredField() 获取的是 Class 中被 private 修饰的属性。 getField() 方法获取的是非私有属性，并且 getField() 在当前 Class 获取不到时会向祖先类获取。



**new对象和反射得到对象的区别**

1. 在使用反射的时候，必须确保这个类已经加载并已经连接了。使用new的时候，这个类可以没有被加载，也可以已经被加载。
2. new关键字可以调用任何public构造方法，而反射只能调用无参构造方法。
3. new关键字是强类型的，效率相对较高。 反射是弱类型的，效率低。
4. 反射提供了一种更加灵活的方式创建对象，得到对象的信息。如Spring 中AOP等的使用，动态代理的使用，都是基于反射的。



<br>

## <span id="t6">参考文章</span>

<https://lingcoder.gitee.io/onjava8/#/book/19-Type-Information> 

<https://www.jianshu.com/p/9be58ee20dee> 

<https://www.iteye.com/blog/lixh1986-1995942> 

<https://blog.csdn.net/qq_44241551/article/details/95920274> 

<https://segmentfault.com/a/1190000015860183> 

<https://www.jianshu.com/p/1fc45c89e76b> 
