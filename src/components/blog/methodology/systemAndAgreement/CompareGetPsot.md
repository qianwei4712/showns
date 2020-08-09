
<div class="catalog">


- [概述](#t0)
- [HTTP 请求方法](#t1)
- [对比区别第一弹](#t2)
- [RFC 协议规范](#t3)
- [对比区别第二弹](#t4)
- [常见误区](#t5)
- [参考文章](#te) 


</div>



## <span id="t0">概述</span>

超文本传输协议（HTTP）的设计目的是保证客户机与服务器之间的通信。

最常用的也就 **GET** 和 **POST** 两种，本文主要了解这两种请求方式的特点，对比两种请求方式。

<br>

## <span id="t1">HTTP 请求方法</span>

根据 HTTP 标准，HTTP 请求可以使用多种请求方法。

HTTP1.0 定义了三种请求方法： GET、POST 和 HEAD方法。

HTTP1.1 新增了六种请求方法：OPTIONS、PUT、PATCH、DELETE、TRACE 和 CONNECT 方法。

|  方法   | 描述                                                         |
| :-----: | ------------------------------------------------------------ |
|   GET   | 请求指定的页面信息，并返回实体主体。                         |
|  HEAD   | 类似于 GET 请求，只不过返回的响应中没有具体的内容，用于获取报头 |
|  POST   | 向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。POST 请求可能会导致新的资源的建立和/或已有资源的修改。 |
|   PUT   | 从客户端向服务器传送的数据取代指定的文档的内容。             |
| DELETE  | 请求服务器删除指定的页面。                                   |
| CONNECT | HTTP/1.1 协议中预留给能够将连接改为管道方式的代理服务器。    |
| OPTIONS | 允许客户端查看服务器的性能。                                 |
|  TRACE  | 回显服务器收到的请求，主要用于测试或诊断。                   |
|  PATCH  | 是对 PUT 方法的补充，用来对已知资源进行局部更新 。           |

对于其他的就不讲了，虽然协议新增了这些请求，但是在实际开发中确实也没用过。

<br>

## <span id="t2">对比区别第一弹</span>

对于 Get 和 Post 的区别，所有人都知道的，应该是 w3school 中的标准答案：

|                      |                             GET                              |                             POST                             |
| :------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|  **后退按钮/刷新**   |                             无害                             |   数据会被重新提交（浏览器应该告知用户数据会被重新提交）。   |
|       **书签**       |                         可收藏为书签                         |                        不可收藏为书签                        |
|       **缓存**       |                           能被缓存                           |                           不能缓存                           |
|     **编码类型**     |              application/x-www-form-urlencoded               | application/x-www-form-urlencoded 或 multipart/form-data。<br/>为二进制数据使用多重编码。 |
|       **历史**       |                   参数保留在浏览器历史中。                   |                 参数不会保存在浏览器历史中。                 |
| **对数据长度的限制** | 当发送数据时，GET 方法向 URL 添加数据；<br/>URL 的长度是受限制的（URL 的最大长度是 2048 个字符）。 |                           无限制。                           |
| **对数据类型的限制** |                     只允许 ASCII 字符。                      |                 没有限制。也允许二进制数据。                 |
|      **安全性**      | 与 POST 相比，GET 的安全性较差，因为所发送的数据是 URL 的一部分。<br>在发送密码或其他敏感信息时绝不要使用 GET | POST 比 GET 更安全，因为参数不会被保存在浏览器历史或 web 服务器日志中。 |
|      **可见性**      |              数据在 URL 中对所有人都是可见的。               |                   数据不会显示在 URL 中。                    |

当然，有了这些，我们在开发过程中，当然知道需要选用那种方式。

但这些真的是正确答案嘛？



<br>

## <span id="t3">RFC 协议规范</span>

> HTTP 协议实际上是基于 RFC 规范的，实际上 GET 和 POST 请求的语法是完全相同的.
>
> 但是在 RFC 规范中，给 GET 请求和 POST 请求规定了语义，规定 GET 用来获取信息，POST 用来发送信息。

<font color="red">**意思就是，其实在实际传输层面，是没有任何区别的。**</font>

其实逻辑是：

- HTTP 是基于 TCP/IP 的关于数据如何在万维网中如何通信的协议；
- GET 和 POST 请求只是 HTTP 定义的方法；
- 也就是说最后获取数据的方式都是 TCP/IP ；
- 而 GET 和 POST 的区别只是浏览器和服务端的限制。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/87HK8ZMESWQO3HTK9.jpg)

关于 *RFC* 规范，还有一些其他规定：

1. **安全性**

如果一个方法的语义在本质上是「只读」的，那么这个方法就是安全的。

客户端向服务端的资源发起的请求如果使用了是安全的方法，就不应该引起服务端任何的状态变化，因此也是无害的。 

>  *RFC* 定义，*GET, HEAD, OPTIONS* 和 *TRACE* 这几个方法是安全的。

但是这个定义只是规范，并不能保证方法的实现也是安全的，服务端的实现可能会不符合方法语义，*GET* 请求也可以修改用户信息。

引入安全这个概念的目的是为了方便网络爬虫和缓存，以免调用或者缓存某些不安全方法时引起某些意外的后果。*User Agent*（浏览器）应该在执行安全和不安全方法时做出区分对待，并给用户以提示。

<br>

2. **幂等性**

<font color="red">**幂等的概念是指同一个请求方法执行多次和仅执行一次的效果完全相同。**</font>

> 按照 *RFC* 规范，*PUT* ，*DELETE* 和安全方法都是幂等的。

同样，这也仅仅是规范，服务端实现是否幂等是无法确保的。

引入幂等主要是为了处理同一个请求重复发送的情况，比如在请求响应前失去连接，如果方法是幂等的，就可以放心地重发一次请求。

这也是浏览器在后退或者刷新时遇到 *POST* 会给用户提示的原因：*POST* 不是幂等的，重复请求可能会带来意想不到的后果。



<br>

## <span id="t4">对比区别第二弹</span>

总得说：**GET产生一个TCP数据包；POST产生两个TCP数据包。**

对于GET方式的请求，浏览器会把http header和data一并发送出去，服务器响应200（返回数据）；

而对于POST，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok（返回数据）。

![GET和POST请求步骤差异](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/others/GET%E5%92%8CPOST%E8%AF%B7%E6%B1%82%E6%AD%A5%E9%AA%A4%E5%B7%AE%E5%BC%82.png)

因为 POST 需要两步，时间上消耗的要多一点，看起来 GET 比 POST 更有效。

因此 Yahoo 团队有推荐用GET替换POST来优化网站性能。但这是一个坑！跳入需谨慎。为什么？

1. **GET 与 POST 都有自己的语义，不能随便混用。**

2. **据研究，在网络环境好的情况下，发一次包的时间和发两次包的时间差别基本可以无视。而在网络环境差的情况下，两次包的 TCP 在验证数据包完整性上，有非常大的优点。**

3. **并不是所有浏览器都会在POST中发送两次包，Firefox就只发送一次。**



<br>

## <span id="t5">常见误区</span>

**请求参数长度限制：get请求长度最多1024kb，post对请求数据没有限制**

这句话看上去实在没毛病啊，但实际上有很大问题。上面也讲到了，GET 和 POST 没有本质上的区别，都是 TCP/IP 传输。

只是在浏览器和服务端上有差异，所以浏览器的版本和类型就有很大区别。

> **GET 方法提交的 url 参数数据大小没有限制，在 http 协议中没有对url长度进行限制（不仅仅是querystring的长度），这个限制是特定的浏览器及服务器对他的限制。**

下面就是对各种浏览器和服务器的最大处理能力做一些说明

- IE 对 UR L的最大限制为2083个字符
- Firefox (Browser)：对于 Firefox 浏览器 URL 的长度限制为 65,536 个字符。
- Safari (Browser)：URL最大长度限制为 80,000 个字符。
- Opera (Browser)：URL最大长度限制为 190,000 个字符。
- Google (chrome)：URL最大长度限制为 8182 个字符。
- Apache (Server)：能接受最大 url 长度为 8,192 个字符。
- Microsoft Internet Information Server(IIS)：能接受最大url的长度为 16,384 个字符。

所以为了符合所有标准，url的最好不好超过最低标准的2083个字符（2k+35）。

当然在做客户端程序时，url 并不展示给用户，只是个程序调用，这时长度只收web服务器的影响了。

对于中文的传递，一个汉字最终编码后的字符长度是9个字符。

最常见的form表单，浏览器默认的form表单，默认的 content-type 是 application/x-www-form-urlencoded ，提交的数据会按照 key value 的方式。

jquery 的ajax默认的也是这种 content-type。当然在 post 方式中添加 querystring 一定是可以接收的到，但是在 get 方式中加 body 参数就不一定能成功接收到了。

<br>

**post 比 get 安全性要高**

这里的安全是相对性，并不是真正意义上的安全，通过 get 提交的数据都将显示到 url 上，页面会被浏览器缓存，其他人查看历史记录会看到提交的数据，而 post 不会。

另外 get 提交数据还可能会造成 CSRF 攻击。





<br>

## <span id="te">参考文章</span>

<a href="https://www.w3school.com.cn/tags/html_ref_httpmethods.asp" target="_blank">https://www.w3school.com.cn/tags/html_ref_httpmethods.asp</a>

<a href="https://www.runoob.com/http/http-methods.html" target="_blank">https://www.runoob.com/http/http-methods.html</a>

<a href="https://blog.csdn.net/panda_panda_/article/details/82115842" target="_blank">https://blog.csdn.net/panda_panda_/article/details/82115842</a>

<a href="https://blog.csdn.net/qq_38858302/article/details/98217755" target="_blank">https://blog.csdn.net/qq_38858302/article/details/98217755</a>

<a href="https://blog.csdn.net/pigcircle_1988/article/details/84910665" target="_blank">https://blog.csdn.net/pigcircle_1988/article/details/84910665</a>

<a href="https://www.jianshu.com/p/678ff764a253" target="_blank">https://www.jianshu.com/p/678ff764a253</a>

<a href="https://blog.csdn.net/kebi007/article/details/103059900" target="_blank">https://blog.csdn.net/kebi007/article/details/103059900</a>





