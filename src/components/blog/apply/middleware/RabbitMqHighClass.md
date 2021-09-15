<div class="catalog">

- [死信队列](#t1)
  - [环境准备配置](#t11)
  - [消息达到最大长度](#t12)
  - [消息 TTL 过期](#t13)
  - [拒绝消息](#t14)
  - [死信消费](#t15)
- [延迟队列](#t2)
  - [基于死信实现](#t21)
  - [基于插件实现](#t22)
- [惰性队列](#t3)
- [其他](#t4)
  - [幂等性](#t41)
- [参考文章](#te)

</div>



## <span id="t1">死信队列</span>

> **死信：无法被消费的消息，称为死信。**

如果死信一直留在队列中，会导致一直被消费，却从不消费成功。

所以我们专门开辟了一个来存放死信的队列，叫死信队列（DLX，dead-letter-exchange）。

死信的几种来源：

1. 消息 TTL 过期（time to live，存活时间，可以用在限时支付消息）
2. 队列达到最大长度（队列满了，无法路由到该队列）
3. 消息被拒绝（ basic.reject / basic.nack ），并且 `requeue = false`



![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/deploy/20210904%20RabbitMQ%20%E7%9B%B8%E5%85%B3%E7%BB%98%E5%9B%BE.png)



<br/>

### <span id="t11">环境准备配置</span>

准备 MQ 的队列和环境：

- 正常交换机
  - 正常队列（最长队列 5）              ---- **正常消费者，拒绝消息**
  - ttl 队列（过期时间 60 秒）          ---- **没有消费者**
- 死信交换机
  - 死信队列



主要配置文件如下：

```java
@Configuration
public class DeadConfig {

    /* 正常配置 **********************************************************************************************************/

    /**
     * 正常交换机，开启持久化
     */
    @Bean
    DirectExchange normalExchange() {
        return new DirectExchange("normalExchange", true, false);
    }

    @Bean
    public Queue normalQueue() {
        // durable: 是否持久化,默认是false,持久化队列：会被存储在磁盘上，当消息代理重启时仍然存在，暂存队列：当前连接有效
        // exclusive: 默认也是false，只能被当前创建的连接使用，而且当连接关闭后队列即被删除。此参考优先级高于durable
        // autoDelete: 是否自动删除，当没有生产者或者消费者使用此队列，该队列会自动删除。
        Map<String, Object> args = deadQueueArgs();
        // 队列设置最大长度
        args.put("x-max-length", 5);
        return new Queue("normalQueue", true, false, false, args);
    }

    @Bean
    public Queue ttlQueue() {
        Map<String, Object> args = deadQueueArgs();
        // 队列设置消息过期时间 60 秒
        args.put("x-message-ttl", 60 * 1000);
        return new Queue("ttlQueue", true, false, false, args);
    }

    @Bean
    Binding normalRouteBinding() {
        return BindingBuilder.bind(normalQueue()).to(normalExchange()).with("normalRouting");
    }

    @Bean
    Binding ttlRouteBinding() {
        return BindingBuilder.bind(ttlQueue()).to(normalExchange()).with("ttlRouting");
    }

    /* 死信配置 **********************************************************************************************************/

    /**
     * 死信交换机
     */
    @Bean
    DirectExchange deadExchange() {
        return new DirectExchange("deadExchange", true, false);
    }

    /**
     * 死信队列
     */
    @Bean
    public Queue deadQueue() {
        return new Queue("deadQueue", true, false, false);
    }

    @Bean
    Binding deadRouteBinding() {
        return BindingBuilder.bind(deadQueue()).to(deadExchange()).with("deadRouting");
    }

    /**
     * 转发到 死信队列，配置参数
     */
    private Map<String, Object> deadQueueArgs() {
        Map<String, Object> map = new HashMap<>();
        // 绑定该队列到私信交换机
        map.put("x-dead-letter-exchange", "deadExchange");
        map.put("x-dead-letter-routing-key", "deadRouting");
        return map;
    }

}
```



<br>

**arguments** 具体参数如下：

| 参数名                    | 作用                                                         |
| ------------------------- | ------------------------------------------------------------ |
| x-message-ttl             | 发送到队列的消息在丢弃之前可以存活多长时间（毫秒）。         |
| x-max-length              | 队列最大长度                                                 |
| x-expires                 | 队列在被自动删除（毫秒）之前可以使用多长时间。               |
| x-max-length              | 队列在开始从头部删除之前可以包含多少就绪消息。               |
| x-max-length-bytes        | 队列在开始从头部删除之前可以包含的就绪消息的总体大小。       |
| x-dead-letter-exchange    | 设置队列溢出行为。这决定了在达到队列的最大长度时消息会发生什么。<br>有效值为drop-head或reject-publish。交换的可选名称，如果消息被拒绝或过期，将重新发布这些名称。 |
| x-dead-letter-routing-key | 可选的替换路由密钥，用于在消息以字母为单位时使用。如果未设置，将使用消息的原始路由密钥。 |
| x-max-priority            | 队列支持的最大优先级数;如果未设置，队列将不支持消息优先级。  |
| x-queue-mode              | 将队列设置为惰性模式，在磁盘上保留尽可能多的消息以减少内存使用;如果未设置，队列将保留内存缓存以尽快传递消息。 |
| x-queue-master-locator    | 将队列设置为主位置模式，确定在节点集群上声明时队列主机所在的规则。 |
| x-overflow                | 队列达到最大长度时，可选模式包括： `drop-head`, `reject-publish` 和 `reject-publish-dlx`. |





<br/>

### <span id="t12">队列达到最大长度</span>

首先测试最简单的，没有消费者。

调用6次正常队列的生产方法。

```java
    /**
     * 正常消息队列，队列最大长度5
     */
    @GetMapping("/normalQueue")
    public String normalQueue() {

        Map<String, Object> map = new HashMap<>();
        map.put("messageId", String.valueOf(UUID.randomUUID()));
        map.put("data", System.currentTimeMillis() + ", 正常队列消息，最大长度 5");

        rabbitTemplate.convertAndSend("normalExchange", "normalRouting", map, new CorrelationData());
        return JSONObject.toJSONString(map);
    }
```

MQ 结果如下：

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ%E6%88%AA%E5%9B%BE20210913200350.png)



<br/>

### <span id="t13">消息 TTL 过期</span>

消息的TTL 指的是消息的存活时间，我们可以通过设置消息的TTL或者队列的TTL来实现。

> - **消息的TTL** ：对于设置了过期时间属性(expiration)的消息，消息如果在过期时间内没被消费，会过期。过期在消息即将投递到消费者时判断。
> - **队列的TTL** ：对于设置了过期时间属性(x-message-ttl)的队列，所有路由到这个队列的消息，都会设置上这个过期时间

两种配置都行，一般都用在定时任务，限时支付这种地方。

```java
    /**
     * 消息 TTL, time to live
     */
    @GetMapping("/ttlToDead")
    public String ttlToDead() {

        Map<String, Object> map = new HashMap<>();
        map.put("messageId", String.valueOf(UUID.randomUUID()));
        map.put("data", System.currentTimeMillis() + ", ttl队列消息");

        rabbitTemplate.convertAndSend("normalExchange", "ttlRouting", map, new CorrelationData());
        return JSONObject.toJSONString(map);
    }
```

发送后：

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ%E6%88%AA%E5%9B%BE20210913201353.png)

等待过期后：

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ%E6%88%AA%E5%9B%BE20210913201456.png)

<span style="color:red">**Demo 中只是为了方便，代码中尽量使用 消息TTL，不要用 队列TTL**</span>

<br/>

### <span id="t14">拒绝消息</span>

正常队列消费后拒绝消息，并且不进行重新入队：

```java
@Component
@RabbitListener(queues = "normalQueue")
public class NormalConsumer {
    @RabbitHandler
    public void process(Map<String, Object> message, Channel channel, Message mqMsg) throws IOException {
        System.out.println("收到消息，并拒绝重新入队 : " + message.toString());
        channel.basicReject(mqMsg.getMessageProperties().getDeliveryTag(), false);
    }
}
```

MQ 控制台：

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ%E6%88%AA%E5%9B%BE20210913203304.png)

<br/>



### <span id="t15">死信消费</span>

死信队列消费：

```java
@Component
@RabbitListener(queues = "deadQueue")
public class DeadConsumer {
    @RabbitHandler
    public void process(Map<String, Object> message, Channel channel, Message mqMsg) throws IOException {
        System.out.println("死信队列收到消息 : " + message.toString());
        channel.basicAck(mqMsg.getMessageProperties().getDeliveryTag(), false);
    }
}
```

消息顺序和实验一致：

```
死信队列收到消息 : {data=1631534291765, 正常队列消息，最大长度 5, messageId=bce3888b-da38-4299-ac88-d22cbe164739}
死信队列收到消息 : {data=1631535222745, ttl队列消息, messageId=a4617445-5aab-4fac-aec7-5709ea699598}
死信队列收到消息 : {data=1631534503765, 正常队列消息，最大长度 5, messageId=b65ecaab-5ce7-4597-a32c-c90b67ec46da}
死信队列收到消息 : {data=1631534511468, 正常队列消息，最大长度 5, messageId=d63d2a4c-e7d3-4f00-a6ca-78e2d62d1d92}
死信队列收到消息 : {data=1631534585087, 正常队列消息，最大长度 5, messageId=eed0c349-415b-43dc-aa79-c683122a1289}
死信队列收到消息 : {data=1631534588311, 正常队列消息，最大长度 5, messageId=7a7bd152-f2fa-4a74-b9e6-943ac7cbb3d4}
死信队列收到消息 : {data=1631534608504, 正常队列消息，最大长度 5, messageId=9de512a1-4ca4-4060-9096-27aba01c1687}
```






<br/>

## <span id="t2">延迟队列</span>

使用场景：

- **订单十分钟内未支付则自动取消**：下单发送消息 TTL 十分钟，自动转入死信队列 DLX（消费取消订单）
- **用户发起退款，如果三天内没有得到处理则通知相关运营人员**：发送退款请求消息 TTL 3天，还没消费转入死信队列（人工接入）

类似场景还蛮多的。



### <span id="t21">基于死信实现</span>

基础的延迟队列就不写了，和死信队列一样。实现原理也很简单，消息 TTL 实现延迟。

上面讲 TTL 时，尽量使用 消息TTL。相对于 队列TTL，消息的TTL 更加灵活。

> **但是在延迟队列情况下，消息TTL 的过期判断是在即将投递到消费者才判断的，如果消息积压严重，那么即时已经过期的消息，也会在队列中等待很长时间。**

这对时间要求严格的场景下，是不允许的。**所以看起来，延迟队列使用队列 TTL 比较合适。**

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/XIKOEQKFKLOO3UE00.jpg)

但是但是，**使用队列 TTL，对每一种过期时间，都必须新创建一个队列。**

这就不符合程序设计原则，最好有一种通用的队列，又没有上面提到的 消息TTL 的缺点。

<br/>

### <span id="t22">基于插件实现</span>

RabbitMQ 中有个插件可以解决上面的缺陷，**rabbitmq_delayed_message_exchange** 插件。

下载插件：[Community Plugins — RabbitMQ](https://www.rabbitmq.com/community-plugins.html)，然后解压放置到 RabbitMQ 的插件目录。

进入 RabbitMQ 的安装目录下的 plgins 目录，执行下面命令让该插件生效，然后重启 RabbitMQ

```shell
/usr/lib/rabbitmq/lib/rabbitmq_server-3.8.8/plugins
rabbitmq-plugins enable rabbitmq_delayed_message_exchang
```

添加插件后，在 MQ 控制台，新增 exchange 有以下新选项：

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ%E6%88%AA%E5%9B%BE20210915205723.png)

> **使用插件实现，将 消息TTL 判断从队列提前到了交换机。** 从而解决了 队列TTL 等待超时的缺陷。

延时交换机内部自带一个分布式数据系统，可以判断过期时间。

其他使用都一样，在声明交换机时，要使用自定义交换机：

```java
//自定义交换机 我们在这里定义的是一个延迟交换机
@Bean
public CustomExchange delayedExchange() { 
    //自定义交换机的类型
    Map<String, Object> args = new HashMap<>();
    args.put("x-delayed-type", "direct");
    //交换机名称，交换机类型，持久化，自动删除，参数
    return new CustomExchange("delayed.exchange", "x-delayed-message", true, false, args);
}
```

剩余代码就不写了。



<br/>

## <span id="t3">惰性队列</span>

一句话，惰性队列会将消息保存到磁盘中。消费的时候才会从加载到内存中。

目的就是支持更长的队列，可以用在消费者不稳定，经常宕机的情况。

**与之对比，持久化队列即便写入磁盘，也会在内存中保留备份。**

使用方式，队列参数：

```java
args.put("x-queue-mode", "lazy");
```



## <span id="t4">其他</span>

### <span id="t41">幂等性</span>

例如：消费者 ack 时网络中断等，导致重复消费

一般解决思路都是，以下2种方式：

- **全局ID或者时间戳，可以用MQ自带的ID，消费前判断**
- **redis 原子性机制，利用 redis 执行 setnx 命令。（推荐）**

其实可以搭配使用。


<br/>

## <span id="te">参考文章</span>

[RabbitMQ的死信队列详解 - 简书 (jianshu.com)](https://www.jianshu.com/p/986ee5eb78bc)

[消息TTL_luzaichun的博客-CSDN博客_消息ttl](https://blog.csdn.net/qq_40911404/article/details/111825748)

[Springboot+RabbitMQ死信队列_shishishi777的博客-CSDN博客](https://blog.csdn.net/shishishi777/article/details/99879419)

[创建RabbitMQ队列的参数(Arguments)说明_风的狂野的专栏-CSDN博客](https://blog.csdn.net/likemiddle/article/details/90400624)

[尚硅谷2021最新版RabbitMQ教程丨快速掌握MQ消息中间件_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1cb4y1o7zz)

[尚硅谷_消息中间件RabbitMQ_课件.pdf](https://gitee.com/qianwei4712/static-resources/blob/master/showns/file/%E5%B0%9A%E7%A1%85%E8%B0%B7_%E6%B6%88%E6%81%AF%E4%B8%AD%E9%97%B4%E4%BB%B6RabbitMQ_%E8%AF%BE%E4%BB%B6.pdf)
