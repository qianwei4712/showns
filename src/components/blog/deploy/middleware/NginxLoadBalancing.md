<div class="catalog">

- [负载均衡配置](#t1)
- [负载均衡算法](#t2)
    - [轮询法（默认）](#t21)
    - [加权轮询法](#t22)
    - [ip-hash](#t23)
    - [其他算法使用方式](#t24)
- [负载均衡使用说明](#t3)
- [参考文章](#te)

</div>

> 负载均衡的解释：将请求分摊到多个操作单元上进行执行。就是我们需要一个调度者，保证所有后端服务器都将性能充分发挥，从而保持服务器集群的整体性能最优，这就是负载均衡。

### <span id="t1">负载均衡配置</span>

`nginx` 中的 `upstream模块` 是来实现 `nginx` 跨越单机的限制，完成网络数据的接收、处理和转发。例如：
```java
# 定义负载均衡设备的 Ip及设备状态 
upstream app {
    server 127.0.0.1:57800 down;
    server 127.0.0.1:57700 weight=2;
    server 127.0.0.1:57600;
    server 127.0.0.1:57500 backup;
}
```

upstream server参数解释如下：

- **down**：表示当前的 server 暂时不参与负载。
- **weight**：默认为 1 weight （范围0-100）越大，负载的权重就越大。
- **max_fails**：允许请求失败的次数默认为 1 当超过最大次数时，返回 proxy_next_upstream 模块定义的错误。
- **fail_timeout**: max_fails 次失败后，暂停的时间。例如：`server 127.0.0.1:57600 max_fails=3 fail_timeout=30s` 。
- **backup**：其它所有的非 backup 机器 down 或者忙的时候，请求 backup 机器,作为备用机。

<br>

### <span id="t2">负载均衡算法</span>

首先介绍nginx支持的主要策略

- **轮询法（默认）**：将请求按顺序轮流地分配到后端服务器上，它均衡地对待后端的每一台服务器，而不关心服务器实际的连接数和当前的系统负载。

- **加权轮询法**：不同的后端服务器可能机器的配置和当前系统的负载并不相同，因此它们的抗压能力也不相同。给配置高、负载低的机器配置更高的权重，让其处理更多的请；而配置低、负载高的机器，给其分配较低的权重，降低其系统负载，加权轮询能很好地处理这一问题，并将请求顺序且按照权重分配到后端。

- **ip-hash**：根据获取客户端的IP地址，通过哈希函数计算得到一个数值，用该数值对服务器列表的大小进行取模运算，得到的结果便是客服端要访问服务器的序号。采用源地址哈希法进行负载均衡，同一IP地址的客户端，当后端服务器列表不变时，它每次都会映射到同一台后端服务器进行访问。

- **最小连接数法**：由于后端服务器的配置不尽相同，对于请求的处理有快有慢，最小连接数法根据后端服务器当前的连接情况，动态地选取其中当前积压连接数最少的一台服务器来处理当前的请求，尽可能地提高后端服务的利用效率，将负责合理地分流到每一台服务器。

- **fair（第三方）**：按后端服务器的响应时间来分配请求，响应时间短的优先分配。  

- **consistent_hash & url_hash（第三方）**：按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器，后端服务器为缓存时比较有效。


#### <span id="t21">轮询法（默认）</span>

这是nginx默认的方法，不需要额外配置，直接加两个server就可以。
```java
upstream app {
    server 127.0.0.1:57800;
    server 127.0.0.1:57700;
}
```

因为轮询法分派太过简单粗暴，若具体应用没有设计统一的文件服务、权限、缓存体系，那么在具体使用中将存在较大问题。

#### <span id="t22">加权轮询法</span>

与轮询法相同，只不过为分发对象加上权重，控制比率。
```java
upstream app {
    server 127.0.0.1:57800 weight=2;
    server 127.0.0.1:57700 weight=5;
}
```


#### <span id="t23">ip-hash</span>

此算法会根据 IP 的 hash 值，将请求分配到固定的一个后台服务器。
```java
upstream app {
    ip_hash; 
    server 127.0.0.1:57800;
    server 127.0.0.1:57700;
}
```

此算法可以解决用户session问题。

但是 ip-hash 也存在缺陷，如下：

1. nginx不是最前端的服务器。ip_hash要求nginx一定是最前端的服务器，否则nginx得不到正确ip，就不能根据ip作hash。
比如使用的是squid为最前端，那么nginx取ip时只能得到squid的服务器ip地址，用这个地址来作分流是肯定错乱的。

2. nginx的后端还有其它方式的负载均衡。假如nginx后端又有其它负载均衡，将请求又通过另外的方式分流了，那么某个客户端的请求肯定不能定位到同一台session应用服务器上。
这么算起来，nginx后端只能直接指向应用服务器，或者再搭一个squid，然后指向应用服务器。最好的办法是用location作一次分流，将需要session的部分请求通过ip_hash分流，剩下的走其它后端去。


#### <span id="t24">其他算法使用方式</span>

**最小连接数法**

Web请求会被转发到连接数最少的服务器上，可以被使用在连接较长的情况下。
```java
upstream app {
    least_conn; 
    server 127.0.0.1:57800;
    server 127.0.0.1:57700;
}
```

**fair策略**

第三方策略需要安装额外依赖模块 `nginx-upstream-fair-master`

按后端服务器的响应时间来分配请求，响应时间短的优先分配。
```java
upstream app {
    fair; 
    server 127.0.0.1:57800;
    server 127.0.0.1:57700;
}
```

**consistent_hash & url_hash策略**

第三方策略需要安装额外依赖模块 `ngx_http_consistent_hash-master`

按访问url的hash结果来分配请求
```java
upstream app {
    hash $request_uri;
    hash_method crc32;
    server 127.0.0.1:57800;
    server 127.0.0.1:57700;
}
```

<br>

### <span id="t3">负载均衡使用说明</span>

> nginx的所有负载均衡策略，实际上只是对 **HTTP请求进行重定向** ，在将请求分配到后台服务器后，无法检测到实际服务器压力。

例如：A请求需要进行10次计算，B请求需要进行100万次计算，而对于nginx而言，它们都只属于一次请求。

> 因此，使用nginx进行服务器调度，无法真正意义上实现负载均衡，只不过把请求次数进行了合理分配，一点程度上使用集群缓解单个应用的压力，从而达到更高的并发总量。

<br>

### <span id="te">参考文章</span>

<a href="https://blog.csdn.net/gu_wen_jie/article/details/82149003" target="_blank">https://blog.csdn.net/gu_wen_jie/article/details/82149003</a>

<a href="https://blog.csdn.net/qq_44758028/article/details/96486609" target="_blank">https://blog.csdn.net/qq_44758028/article/details/96486609</a>

<a href="https://blog.csdn.net/qq_28602957/article/details/61615876" target="_blank">https://blog.csdn.net/qq_28602957/article/details/61615876</a>

<a href="https://blog.csdn.net/qq_37936542/article/details/82800605" target="_blank">https://blog.csdn.net/qq_37936542/article/details/82800605</a>

<a href="https://blog.csdn.net/ycc297876771/article/details/83240561" target="_blank">https://blog.csdn.net/ycc297876771/article/details/83240561</a>
