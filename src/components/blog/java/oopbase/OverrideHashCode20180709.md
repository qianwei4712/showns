> 本文撰写背景：闲着没事翻《effective java》，看完第八、第九条，然后把里面自认为能看懂的东西写一下。

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
>因此，重写equals方法而没有重写hashCode方法会违反第二条规范。备注：哈希码=散列码

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
上面的测试中，map.get()期望获得"Shiva"字符串，然而实际上是null。因为这里的PhoneNumber涉及到了两个对象。new PhoneNumber()产生的是一个全新的对象。两张十块钱虽然等价，但是并不认为是同一张。

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
如果重写了PhoneNumber()的HashCode方法。例如：

```java
@Override
    public int hashCode() {
         return 42;
     }
```
这样，在测试代码中就能得到"Shiva"，而且这种写法是合法的，保证了相等对象具有相同的哈希码。但是，每个对象都具有相同的哈希码，因此，每个对象都会被映射到同一个散列桶中，是散列表退化为链表（linked  list）。使得本该线性时间运行的程序变成以平方级时间运行。对大规模的散列表，会影响正常运行。

HashCode的重写方式：

一个好的HashCode方法倾向于“为不同对象产生不同的哈希码”。通过以下方式，可以尽可能做到这一点：

>1.把某个非零的常数值，比如17，保存在一个名为result的int类型的变量中

>2.对于对象中的每个域f（equals方法中涉及到的每个域），完成以下步骤：
>>a.为该域计算int类型的哈希码c:
>>>i.如果该域是boolean类型，则计算（f  ? 1 : 0）<br>
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
