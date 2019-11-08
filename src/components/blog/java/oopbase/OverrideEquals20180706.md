> 本文撰写背景：闲着没事翻《effective java》，看完第八、第九条，然后把里面自认为能看懂的东西写一下。

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
* 使用 instanceof 操作符检查“参数是否为正确的类型”。instanceof 操作符可以判断传入参数与本身类型是否相同。也相当于是一种性能优化。其次，在有些情况下，指该类所实现得接口。例如集合接口（collection interface）得Set，List，Map和Map.Entry。
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

### 域的比较顺序可能会影响equal方法的效率，应该最先比较最有可能不同的域，或者开销最低的域。

覆盖equals时总要覆盖hashCode。不要将equals声明中的Object对象替换为其他（那就不是重写方法了，而是自定义方法。）