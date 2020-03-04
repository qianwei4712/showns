<div class="catalog">

- [注解讲解()](#jiangjie)
    - 三种标准注解
    - 四大元注解
- [注解读取尝试()](#duqu)
    - 利用反射读取注解
- [注解嵌套使用()](#qiantao)
    - 模拟实体与数据库关系表映射

</div>

> 注解（也被称为元数据）为我们在代码中添加信息提供一种形式化的方法，使我们在稍后某个时刻非常简便地使用这些数据。

> 注解开发是现在流行的快速开发不可缺少的部分，然而，天天用注解写代码，我却根本不知道注解是怎么工作的。

## <span id="jiangjie">注解讲解</span>

注解的主要作用（个人理解）: **生成文档，跟踪用例，编译检查**

注解语法和Java基本相同，就是多了一个@。注解是真正语言级的概念，享有编译期的类型保护检查。

注解有三种标准注解，四种元注解。

<table>
    <tr>
        <td>@Override，覆盖父类方法</td>
    </tr>
    <tr>
        <td>@Deprecated，过时方法，编译器会发出警告</td>
    </tr>
    <tr>
        <td>@SuppressWarnnings，关闭编译器的警告信息</td>
    </tr>
</table>
以上三类为Java三种标准注解，也是比较常用的。

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@interface UseCase {
	public int id();
	public String description() default "no description";
}
```
四种元注解的作用则是构建其他注解,在上述例子中自定义了一个简单注解，下面介绍四个元注解的作用
* @Target 表示注解将要用于什么地方，这个比较好理解，就不多解释了。选择**ElementType**参数
    * METHOD方法，TYPE类或接口，FIELD字段，CONSTRUCTOR构造器，LOCAL_VARIABLE局部变量，PACKAGE包，PARAMETER参数，TYPE_PARAMETER类参数，TYPE_USE任意类类型
* @Retention  表示需要在什么级别保存该注解信息。可选**RetentionPolicy**参数
    * SOURCE 注解将被编译器丢弃
    * CLASS 注解在Class文件中可用，但会被VM丢弃
    * RUNTIME **<font color=#A52A2A>VM将在运行时保留注解，因此可以通过反射机制读取注解信息</font>**
* @Documented 代表此注解会被javadoc工具提取成文档（感觉用不太到）<a href="https://www.cnblogs.com/uoar/p/8036642.html" target="_blank">转到大神的测试博客:传送门</a>
* @Inherited  允许子类继承父类注解，<a href="https://blog.csdn.net/snow_crazy/article/details/39381695" target="_blank">转到大神的测试博客:传送门</a>


```java
@Target({ElementType.FIELD, ElementType.TYPE})
```
`@Target`声明的作用域可以是多个，以逗号隔开，若缺省声明，则表示在所有域都可以使用。
<br>

## <span id="duqu">注解读取尝试</span>


下面是基于上面的注解写得测试代码，可以清楚看到注解的使用方式，简单的键值对。
```java
class PasswordUtils {

	@UseCase(id = 47, description = "密码必须包含一个英文")
	public boolean validatePassword(String password) {
		return password.matches("\\w*\\d\\w*");
	}
	
	@UseCase(id= 48)
	public String encryptPassword(String password) {
		return new StringBuilder(password)
				.reverse()  //字符串反序
				.toString();
	}
	
	@UseCase(id = 49,description = "判断新密码是否已经存在")
	public boolean checkNewPsw(List<String> prePsw, String psw) {
		return !prePsw.contains(psw);
	}
	
}
```
如果没有用来读取注解的工具，注解和注释并没有什么区别，反而更加繁琐。
```java
public static void trackUseCase(List<Integer> useCases, Class<?> clazz) {
		//反射对象的所有方法（不包括继承），遍历获取每个方法的UseCase注解
		for (Method method : clazz.getDeclaredMethods()) {
			UseCase uc = method.getAnnotation(UseCase.class);
			if (uc != null) {
				System.out.println("发现UseCase,id:"+uc.id()+" 描述："+uc.description());
				useCases.remove(new Integer(uc.id()));
			}
		}
		for (Integer integer : useCases) {
			System.out.println("未发现UseCase,id:"+integer);
		}
	}
```
根据`UseCase`注解，编写对应注解提取器，然后测试观察输出
```java
public static void main(String[] args) {
		List<Integer> useCases = new ArrayList<>();
		Collections.addAll(useCases, 47, 48, 49);
		
		trackUseCase(useCases, PasswordUtils.class);
		
	}
输出结果：
发现UseCase,id:49 描述：判断新密码是否已经存在
发现UseCase,id:48 描述：no description
发现UseCase,id:47 描述：密码必须包含一个英文
```
这只是简单测试，就不过多赘述，只是观察到三个id并不是按照方法声明顺序，原因是`getDeclaredMethods()`方法，返回的方法数组是无序的。

---
<br>


## <span id="qiantao">注解嵌套使用</span>

在注解中，可以使用其他注解作用一个域。下面是一个模拟实体与数据库关系表映射的示例。<br>
```java
//表名
@Target({ElementType.FIELD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@interface DBTable {
	public String name() default "";
}
```
```java
//字段基础属性
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@interface Constraints {
	//主键
	boolean primaryKey() default false;
	//是否允许为空
	boolean allowNull() default false;
	//是否唯一
	boolean unique() default false;
}
```
```java
//字符型字段
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@interface SQLString {
	int value() default 0;
	String name() default "";
	Constraints constraints() default @Constraints;
}
```
```java
//整型字段
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@interface SQLInteger {
	String name() default "";
	Constraints constraints() default @Constraints;
}
```
**因为注解不支持继承**，虽然不知道为啥。。所以要用嵌套模拟集成<br>
对于嵌套注解的使用很好理解，若想对嵌套注解的默认值进行修改，可以在声明时直接进行。
```java
Constraints constraints() default @Constraints(unique=true)
```
然后将上述的注解应用到实体类
```java
@DBTable(name = "member")
public class Member {
	@SQLString(30)
	private String firstName;
	@SQLString(50)
	private String lastName;
	@SQLInteger
	private int age;
	@SQLString(value = 30,constraints = @Constraints(unique = true))
	private String handle;
    //这里省略get set方法	
}
```
上述代码中，`@SQLString(50)`没有声明属性名，这里解释下：
>**如果注解中，存在value()元素，并且在使用注解的时候，该元素是唯一值，则可以省略value声明。**

`
@SQLString(value = 30,constraints = @Constraints(unique = true))
`

这段注解就显得不是那么易于阅读，对于这种注解，推荐拆分。因为编译器允许对同一表使用多个注解（不能重复使用同一注解）

```
@SQLString(30)
@Constraints(unique= true)
```
