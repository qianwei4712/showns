
<div class="catalog">


- [前言](#t0)
- [Cookie](#t1)
  - [Cookie 是个啥](#t11)
  - [Cookie 的工作原理](#t12)
  - [Cookie 源码探索](#t13)
  - [Cookie 其他细节](#t14)
- [Session](#t2)
  - [什么是 Session](#t21)
  - [Session 工作机制](#t22)
  - [HttpSession 接口方法解析](#t23)
  - [Session 其他细节](#t24)
- [Cookie 和 Session 的区别](#t3)
- [实际场景的使用问题](#t4)
- [参考文章](#t5) 

</div>



## <span id="t0">前言</span>

cookie 和 seesion 这两玩意儿，在三年前刚开始学 java 的时候倒是看到过，不过当时也就看了几眼没有认真学，毕竟我这个基础也算是烂的可以。。。。

这几年光顾着 CRUD，写文档，做实现，基本都已经忘记了。。。

只记得 cookie在浏览器，seesion 在服务端，平时基本偏向都用 seesion。

最近整理单点登陆时，涉及到了这一部分知识，重新梳理下。。。。

![](https://imgconvert.csdnimg.cn/aHR0cDovL3NoaXZhLm9zcy1jbi1oYW5nemhvdS5hbGl5dW5jcy5jb20vZW1vLzRBRTZDMUExNEZDMTc4MTU0MzA4Qzk5RUNDQTBDRDIxLnBuZw?x-oss-process=image/format,png#pic_center)

<br>

## <span id="t1">Cookie</span>

### <span id="t11">Cookie 是个啥</span>

**cookie 是一种网络会话状态跟踪技术，服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。**

首先，众所周知的，<font color="red">**HTTP 请求是一种无状态协议。**</font> 任何两次 HTTP 请求没有任何关系。

然后，会话是由一组请求与响应组成，是围绕着一件事相关事情所进行的请求与响应。

所以在这些请求与响应之间需要有数据传递，用来进行状态跟踪，而 cookie 就是这个技术。



<br>

### <span id="t12">Cookie 的工作原理</span>

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200624091232328.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzQ2MTQ0ODI2,size_16,color_FFFFFF,t_70#pic_center)

网上看了些博客和视频，画了下 Cookie 的流程图，然后我们可以从图中看出：

1. Cookie 是在第一次 HTTP 请求时，由服务端生成；
2. Cookie 也是键值对的形式；
3. Cookie 通过 HTTP response 返回到客户端，封装在请求头中。
4. Cookie 是由浏览器进行读取并保存，所以不同浏览器的 Cookie 不互通。
5. 在之后的同路径的请求，才会携带浏览器保存的 Cookie 信息。

呃。。。光看些概念类的其实很容易忘，还是看点实际的。

我个人基本用 Chrome，现在写个 demo，测试下 Cookie 在 Chrome 下是如何存在的。

![](https://imgconvert.csdnimg.cn/aHR0cDovL3NoaXZhLm9zcy1jbi1oYW5nemhvdS5hbGl5dW5jcy5jb20vZW1vL1RJTSVFNSU5QiVCRSVFNyU4OSU4NzIwMjAwNjAzMTAwODU4LmpwZw?x-oss-process=image/format,png#pic_center)

首先，我先写几段服务端代码：

> 顺便说明下，我用的测试项目是 SpringBoot，项目名 `server.servlet.context-path=/` 直接设置了空；
>
> **cookie 的 Path 路径还需要加上项目名，request.getContextPath()** ；

```java
@RestController
@RequestMapping()
public class TestController {

    @ResponseBody
    @RequestMapping("/dd")
    public String dd(HttpServletRequest request, HttpServletResponse response){
        Cookie cookie = new Cookie("key","value");
        cookie.setPath("/dd");
        response.addCookie(cookie);
        return "返回值";
    }

    @ResponseBody
    @RequestMapping("/dd2")
    public String dd2(HttpServletRequest request, HttpServletResponse response){
        Cookie[] cookies = request.getCookies();
        Cookie cookie = new Cookie("key2","value2");
        cookie.setPath("/dd");
        response.addCookie(cookie);
        return "返回值";
    }
}
```

**第一次请求：** `http://localhost:8081/dd` 在控制台可以看到：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200624091212327.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzQ2MTQ0ODI2,size_16,color_FFFFFF,t_70#pic_center)

在 response headers 中添加了 cookie，并设置了 Path；

这里就可以看到，<font color="red">**Cookie 是以明文的方式进行传输和保存的，安全性并不高**</font> , 应该是没啥安全性可言。

所以一般只在 Cookie 中保存一些不敏感的信息，和一些加密后的信息。

<br>

**同样的方式发起第二次请求：** `http://localhost:8081/dd2` ，控制台结果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200624091200496.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzQ2MTQ0ODI2,size_16,color_FFFFFF,t_70#pic_center)


可以看到，在请求头中，并没有带 cookie。

再发起一次 `http://localhost:8081/dd` 请求：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200624091149837.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzQ2MTQ0ODI2,size_16,color_FFFFFF,t_70#pic_center)


在浏览器中，也可以对 cookie进行操作，包括 **禁止** ， **删除** 等。

装个插件也可以直接对 cookie 进行修改，但是并没有实际作用；一般的 cookie 都是加密过的，或者只是个 ID，改了也没啥用。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200624091136353.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzQ2MTQ0ODI2,size_16,color_FFFFFF,t_70#pic_center)

哦，顺便说下， Chrome 的 Cookies 本地文件位置在：

> C:\Users\XXX\AppData\Local\Google\Chrome\User Data\Default，下面有个 Cookies 文件



<br>

### <span id="t13">Cookie 源码探索</span>

Cookie 代码很少，去除 getter/setter ,就可怜的不到100行；

这里只把参数列一遍，构造方法只有一个带键值对的构造器，没有别的了。。。

会把每个参数涉及到的一些小细节也一并讲了。

```java
public class Cookie implements Cloneable, Serializable {
    
    // final 字段，cookie 的键名，不允许更改
    private final String name;
    
    // cookie 的值
    // 对于 Version 0 cookie，值不应包含空格、方括号、圆括号、等号、逗号、双引号、斜杠、问号、at 符号、冒号和分号。空值在所有浏览器上的行为不一定相同。 
    private String value;
    
    // cookie的版本，默认使用 Netscape（网景) 公司设计的初版约束；这一版不支持注释
    // 版本 0 遵守原始 Netscape cookie 规范。版本 1 遵守 RFC 2109。
    private int version = 0;
    
    // 指定一个描述 cookie 用途的注释。如果浏览器向用户显示 cookie，则注释很有用
    private String comment;
    
    // 指定此 cookie 的域，在同类域中才会显示。
    // 例如：指定域名为(.foo.com)，则对应的全部二级域名都符合条件；
    // 默认情况下，cookie 只返回给发送它们的服务器。
    private String domain;
    
    // 设置 cookie 的最大生存时间，以秒为单位。 
    // 正值表示 cookie 将在经过该值表示的秒数后过期。注意，该值是 cookie 过期的最大生存时间，不是 cookie 的当前生存时间。 
    // 负值意味着 cookie 不会被持久存储，将在 Web 浏览器退出时删除。0 值会导致删除 cookie。 
    private int maxAge = -1;
    
    // 返回浏览器将此 cookie 返回到的服务器上的路径。cookie 对于服务器上的所有子路径都是可见的。
    private String path;
    
    // 指示浏览器是否只能使用安全协议（如 HTTPS、SSL）发送 cookie。 
    // 如果为 true，则仅在使用安全协议时将 cookie 从浏览器发送到服务器；如果为 false，则在使用任何协议时都可以发送
    private boolean secure;
    
    // 只允许 HTTP 请求使用该 Cookie, JavaScript脚本将无法读取到Cookie信息，这样能有效的防止XSS攻击，让网站应用更加安全。
    private boolean httpOnly;

    // 带键和值的构造器，并且是唯一一个构造器
    // 在构造方法中，对 name 进行了判断，需要满足 RFC 2109 的命名要求
    // 这意味着它只能包含 ASCII 字母数字字符，不能包含逗号、分号或空格，也不能以 $ 字符开头
    public Cookie(String name, String value) {
        validation.validate(name);
        this.name = name;
        this.value = value;
    }
}
```



<br>

### <span id="t14">Cookie 其他细节</span>

其他一些细节，很多都是从文档上看到的，看一眼就行，也没啥实际作用：

- 如果没有对 Path 进行设置，默认路径为项目名
- 浏览器应该支持每台 Web 服务器有 20 个 cookie，总共有 300 个 cookie
- 每个 cookie 大小不超过 4KB
- 关闭会话，就是关闭整个浏览器，就可以清楚临时 cookie（ `maxAge = -1` ），临时 cookie 保存在浏览器缓存，并没有保存到文件中
- 一些 cookie 可能有相同的名称，但却有不同的路径属性
- 对相同名称，切相同路径属性的 cookie，可以进行覆盖
- 因为 RFC 2109 仍然有点新，所以根据经验可考虑使用版本 1；但在生产网站上不要使用它。

And Then。。。。

Cookie 部分就结束了，是不是感觉。。。

![](https://imgconvert.csdnimg.cn/aHR0cDovL3NoaXZhLm9zcy1jbi1oYW5nemhvdS5hbGl5dW5jcy5jb20vZW1vLzIyNVU0MzUzNi05LmpwZw?x-oss-process=image/format,png#pic_center)

<br>

## <span id="t2">Session</span>

### <span id="t21">什么是 Session</span>

session 翻译过来就是会议，也就是会话。那么在 HTTP 请求中，会话是什么在上面已经说过了。所以它被设计出来的目的也就很明显了。

session 和 cookie 一样，都是会话跟踪技术。

**Session 由服务端创建并保存的会话信息** 。

在 Java 中，session 是以 `javax.servlet.http.HttpSession` 接口的形式出现的。



<br>

### <span id="t21">Session 工作机制</span>

首先是 Session 的创建，看 **HttpServletRequest** ，太细的就不讲了，介绍个大概。

|             返回值 - 方法名              |                           方法解释                           |
| :--------------------------------------: | :----------------------------------------------------------: |
|         HttpSession getSession()         | 返回与此请求关联的当前 session，如果没有，则创建一个session  |
| HttpSession getSession( boolean create ) | 返回与此请求关联的当前 `HttpSession` ，如果没有当前会话并且 `create` 为  true，则返回一个新会话。<br>如果 `create` 为 `false` 并且该请求没有有效的  `HttpSession` ，则此方法返回 `null` 。<br>要确保会话得到适当维护，必须在提交响应之前调用此方法。如果容器正使用 cookie 维护会话完整性，并被要求在提交响应时创建新会话，则抛出  IllegalStateException。 |

一般情况下，基本没用过第二个方法获取 session，不过脑补下也是有使用场景的，比如：只需要从 session 获取数据，但是如果不存在 session，不希望主动创建。例如客户端心跳，session 过期后不希望主动创建。

正常情况下，获取 session 的方式如下：

```java
HttpSession session = request.getSession();
```

<br>

Cookie 的机制上面已经介绍了，其实在 session 也需要 cookie 来搭配使用。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200624091112221.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzQ2MTQ0ODI2,size_16,color_FFFFFF,t_70#pic_center)


多的也不讲了，直接上代码：

```java
@RestController
@RequestMapping()
public class TestController {

    @ResponseBody
    @RequestMapping("/s1")
    public String s1(HttpServletRequest request, HttpServletResponse response){
        HttpSession session = request.getSession();
        session.setAttribute("key", "value");
        return "返回值";
    }

    @ResponseBody
    @RequestMapping("/s2")
    public String s2(HttpServletRequest request, HttpServletResponse response){
        HttpSession session = request.getSession(false);
        if (session != null){
            Object key = session.getAttribute("key");
            System.out.println(key);
        }
        return "返回值";
    }
}
```

**第一次请求** ：`http://localhost:8081/s1` ，请求详情如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200624091055442.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzQ2MTQ0ODI2,size_16,color_FFFFFF,t_70#pic_center)


从第一次请求可以看出，SpringMVC 返回了一个 cookie 到浏览器。

**key 为 JSESSIONID ，并且只允许 http 使用，不允许 javascript 读取。**

**很明显啊，这个32位长度的随机字符串，就是服务端生成的 session 的 ID.**

<br>

**然后看第二次请求** ：`http://localhost:8081/s2` ，请求详情如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200624090945364.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzQ2MTQ0ODI2,size_16,color_FFFFFF,t_70#pic_center)

第二次请求将 session id 带上了。然后服务端就通过这个 session id 获取到 session。

**所以，保存在客户端中只是无关紧要的 session id ，真正敏感数据保存在服务端，因此安全性高。**

哦还有，**通过这个方式返回的 seesion id 是以临时 Cookie 保存的，没有设置过期时间。** 所以关闭浏览器结束会话，就会清除。



<br>

### <span id="t23">HttpSession 接口方法解析</span>

然后我们来看一下 HttpSession 接口的源码，熟悉下可以对 session 做哪些操作就行：

过时方法就不讲了，应该不重要。。。

```java
public interface HttpSession {
    //返回创建此session的时间。 
    long getCreationTime();
	
    //返回包含分配给此session的唯一标识符的字符串
    //标识符是由 servlet 容器分配的，并且是以作为 Map<string, session> 的键
    String getId();

    //返回客户端上一次发送与此会话关联的请求的时间；
    //每次调用指定 session 都会刷新这个 session的有效时间，并重置最后一次调用时间
    long getLastAccessedTime();

    //返回此会话所属的 ServletContext
    ServletContext getServletContext();

    //指定在 servlet 容器使此会话失效之前客户端请求之间的时间间隔，以秒为单位。
    //默认有效时间为 30 分钟
    //负数时间指示会话永远不会超时。 
    //如果这个 session 超过指定时间没有被调用，就会失效
    void setMaxInactiveInterval(int var1);

    //返回 servlet 容器在客户端访问之间将使此会话保持打开状态的最大时间间隔，以秒为单位。
    int getMaxInactiveInterval();

    //根据 key 返回与此会话中的某个指定键值对，如果没有对象绑定在该名称下，则返回 null。 
    Object getAttribute(String var1);

    //返回包含绑定到此会话的所有对象的名称的 String 对象的 Enumeration。 
    Enumeration<String> getAttributeNames();
	
    //将键值对添加到此会话。如果已存在相同 key，则替换该对象。 
    //如果传入的值为 null，则调用此方法将与调用 removeAttribute() 产生的效果相同。 
    void setAttribute(String var1, Object var2);

	//从此会话中移除与指定 key 的键值对。
    void removeAttribute(String var1);
	
    //使此会话无效，然后取消对任何绑定到它的对象的绑定。
    void invalidate();

    //如果客户端还不知道该会话，或者客户端选择不加入该会话，则返回 true。
    //例如，如果服务器仅使用基于 cookie 的会话，而客户端已经禁止了 cookie 的使用，则每个请求上的会话都将是新会话。
    boolean isNew();
}

```

这里再强调下，<font color="red">**Session 的有效间隔默认为 30 分钟**</font> 。



<br>

### <span id="t24">Session 其他细节</span>

这里就放一些细节问题，也不知道从哪里开始讲，貌似也没啥用，知道下就行：

- session 因为是保存在服务器上，所以不支持跨域的访问；
- sesssion 内保存的键值对的值不能为 null , 或者说可以为 null，但是没有任何意义；
- 大部分服务端应用在关闭、重新的时候也会使 session 失效，session 原本保存是在内存中的；
- Tomcat 默认开启了 session 的钝化，在关闭是会保存到磁盘，重新启动后读取；
- 因此 session 会占用服务器资源，虽然session没有大小限制，但是过大影响性能



<br>

## <span id="t3">Cookie 和 Session 的对比</span>

|              |                            Cookie                            |                           Session                            |
| :----------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|  创建和保存  | 由服务端创建，通过 http response 返回；<br/>保存在客户端（硬盘或者缓存） | 由服务端创建，保存在服务端容器中(Tomcat 会session保存到磁盘，下次启动再读取)；<br/>将 session 的 ID 通过 cookie 返回到客户端。 |
|   对象形式   |               键值对，明文形式；只能保存 ASCII               |             以键值对的形式保存，可以保存任意字符             |
|   大小容量   | 浏览器应该支持每台 Web 服务器有 20 个 cookie，总共有 300 个 cookie；<br>每个 cookie 大小不超过 4KB |                           没有限制                           |
|   有效时间   |                 通过 maxAge 设置最大存在时间                 | 通过 setMaxInactiveInterval 设置两次调用之间的最大时长；超出则失效 |
|    安全性    |                明文传输、明文保存，安全性不高                |                 保存在服务端，所以不容易泄露                 |
|   性能占用   |     将性能压力分发到了客户端浏览器，所以不占用服务端资源     |     所有计算和存储都在服务端完成，对服务端会产生较大压力     |
| **使用场景** | 1. 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）<br/>2. 个性化设置（如用户自定义设置、主题等）<br/>3. 浏览器行为跟踪（如跟踪分析用户行为等） |                         用户登陆信息                         |



<br>

## <span id="t4">实际场景的使用问题</span>

### Cookie 被禁用

cookie 保存是浏览器的工作，但是浏览器提供了禁用 cookie 的选项。（还能不能好好合作了。。。）

然后我在网上找了几种方案，也不知道对不对（确实也从没遇到过，而且我以前做的系统居然没有考虑这个）：

- 每次请求都携带一个 session id 的参数，GET、POST 都行；URL 重写，在路径最后加上 session id
- Token 机制。和 session 机制相似，但是 token 是通过数据体返回的以后通过 token 来判断身份



### Session 统一问题

首先假设有两台相同的 Server，内部代码完全一样，每个 Server 都自己的 session。

可以采用的解决方案：

- **nginx 使用 ip hash 模式** ，根据 ip 会固定分配至一个 server。具体实现可以参考：<a href="_blank" href="https://blog.csdn.net/m0_46144826/article/details/106844587">https://blog.csdn.net/m0_46144826/article/details/106844587</a>
- 两个服务端之间进行 **Session 同步** ，其实就是将 Session 信息相互拷贝。
- 引入 **第三方缓存中间件** ，例如 Redis 。

这三种方式各有优缺点，使用场景也不一样，一般视情况选用。

但是在分布式架构下，一般都是引入单点登陆，使用一个专门的服务来管理 session。

呼应上了吧。。。本来就是在看单点等时候发现了seesion 的问题



<br>

## <span id="t5">参考文章</span>
<a href="_blank" href="https://blog.csdn.net/chengjiamei/article/details/90313274">https://blog.csdn.net/chengjiamei/article/details/90313274</a>

<a href="_blank" href="https://blog.csdn.net/weixin_37264997/article/details/90693525">https://blog.csdn.net/weixin_37264997/article/details/90693525</a>

<a href="_blank" href="https://www.bilibili.com/video/BV1s4411z7zq">https://www.bilibili.com/video/BV1s4411z7zq</a>

<a href="_blank" href="https://blog.csdn.net/chen13333336677/article/details/100939030">https://blog.csdn.net/chen13333336677/article/details/100939030</a>

<a href="_blank" href="https://www.cnblogs.com/relucent/p/4171478.html">https://www.cnblogs.com/relucent/p/4171478.html</a>

<a href="_blank" href="https://blog.csdn.net/qq_29062045/article/details/79290142">https://blog.csdn.net/qq_29062045/article/details/79290142</a>

<a href="_blank" href="https://blog.csdn.net/weixin_46278125/article/details/106634812">https://blog.csdn.net/weixin_46278125/article/details/106634812</a>



