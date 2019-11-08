
## eclipse增大tomcat内存
run -> run configurations -> arguments -> vm arguments 末尾添加
```
-Xms256M -Xmx512M -XX:PermSize=256m -XX:MaxPermSize=512m
```


## int取值问范围
>int 数据类型是32位、有符号的以二进制补码表示的整数；<br>
>最小值是 `-2,147,483,648（-2^31）`；<br>
>最大值是 `2,147,483,647（2^31 - 1）`；<br>
>一般地整型变量默认为 int 类型，默认值是 0 ；<br>

>int包装类integer中含有 `static final` 字段，表示int最大值以及最小值。

```java
System.out.println(Integer.MAX_VALUE + 1);
System.out.println(Math.abs(Integer.MIN_VALUE));
```
>这两个输出结果都是`-2147483648`，也就是int最小值

以上部分是现象，是程序实际运行结果，下面介绍自己研究的原理

int二进制太长，用byte做讲解，原理相同

>因为整数在内存中使用的是补码的形式表示，最高位是符号位，0表示正数，1表示负数：<br>
>byte最大值为127，二进制表示为 0111 1111 <br>
>byte最小值为-128，二进制表示为 1000 0000 <br>
>在二进制计算中 0111 1111 + 0000 0001 = 1000 0000 <br>
>因此 127 + 1 = -128 ，那个byte也变成了循环计数，超出最大值重新计数。
