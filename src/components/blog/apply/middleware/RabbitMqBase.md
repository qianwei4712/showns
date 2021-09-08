<div class="catalog">

- [概述](#t0)
- [docker 安装](#t1)
- [Exchange 不同模式](#t2)
  - [Direct Exchange](#t21)
  - [Fanout Exchange](#t22)
  - [Topic Exchange](#t23)
- [消息可靠性](#t3)
  - [发送确认](#t31)
  - [消息持久化](#t32)
  - [消息签收](#t33)
- [参考文章](#te)


</div>





## <span id="t0">概述</span>

rabbitMQ 会做一个系列，包括：安装、基础使用、高级队列、集群。

使用环境： `jdk 8` 、`springboot 2.4.10`

常见概念：

- **AMQP**：高级消息队列协议，这是一个消息应用的规范。
- **Broker**： 接收和分发消息的应用，RabbitMQ Server 就是 Message Broker。
- **Channel**：Channel 作为轻量级 Connection 极大减少了操作系统建立 TCP connection 的开销。
- **Exchange**：message 到达 broker 的第一站，根据分发规则，匹配查询表中的 routing key，分发消息到 queue 中去。常用的类型有：direct (point-to-point), topic (publish-subscribe) and fanout(multicast)
- **Binding**：exchange 和 queue 之间的虚拟连接，binding 中可以包含 routing key，Binding 信息被保存到 exchange 中的查询表中，用于 message 的分发依据。
- **Routing Key**：路由关键字,exchange根据这个关键字进行消息投递。

<br/>

## <span id="t1">docker 安装</span>

使用 docker 安装测试环境，在 dockerHub 可以查找版本：https://hub.docker.com/

选择带有控制界面的 management 版本（**包含web管理页面**）：

```powershell
docker pull rabbitmq:3.9.5-management
```

rabbit mq 默认两个端口：

- **5672** 是默认应用访问端口
- **15672** 是默认控制台 Web 端口号

```powershell
docker run -d --name rabbitMqDocker -p 52365:5672 -p 32512:15672 -v /usr/local/docker/rabbit:/var/lib/rabbitmq --hostname rabbitMq -e RABBITMQ_DEFAULT_VHOST=mqDocker76  -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin rabbitmq:3.9.5-management
```

- `--hostname` ： 主机名，RabbitMQ 的一个重要注意事项是它根据所谓的 “节点名称” 存储数据，默认为主机名；

- `-e` ： 指定环境变量。
  - RABBITMQ_DEFAULT_VHOST：默认虚拟机名
  - RABBITMQ_DEFAULT_USER：默认的用户名
  - RABBITMQ_DEFAULT_PASS：默认用户名的密码

后续的控制台新增用户、权限细节略过。

<br/>

## <span id="t2">Exchange 不同模式</span>

准备环境，先添加依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

application 配置：

```yaml
spring:
  rabbitmq:
    host: 127.0.0.1
    port: 52365
    username: admin
    password: admin
    virtual-host: mqDocker76
```

RabbitMQ 基本架构如下，然后开始分别测试三种模式。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/deploy/QQ%E6%88%AA%E5%9B%BE20210904201646.png)

<br/>

### <span id="t21">Direct Exchange</span>

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/deploy/QQ%E6%88%AA%E5%9B%BE20210905215928.png)

直连模式基础用法，配置文件、生产、消费代码如下：

```java
@Configuration
public class DirectRabbitConfig {
    /**
     * 队列 起名：directQueue
     */
    @Bean
    public Queue directQueue() {
        // durable: 是否持久化,默认是false,持久化队列：会被存储在磁盘上，当消息代理重启时仍然存在，暂存队列：当前连接有效
        // exclusive: 默认也是false，只能被当前创建的连接使用，而且当连接关闭后队列即被删除。此参考优先级高于durable
        // autoDelete: 是否自动删除，当没有生产者或者消费者使用此队列，该队列会自动删除。
        return new Queue("directQueue", true, false, false);
    }
    /**
     * Direct交换机 起名：directExchange
     */
    @Bean
    DirectExchange directExchange() {
        return new DirectExchange("directExchange", true, false);
    }
    /**
     * 绑定，将队列和交换机绑定, 并设置用于匹配键：directRouting
     */
    @Bean
    Binding bindingDirect() {
        return BindingBuilder.bind(directQueue()).to(directExchange()).with("directRouting");
    }
}
```

```java
@RestController
@RequestMapping
public class DirectProducer {

    @Autowired
    RabbitTemplate rabbitTemplate;

    @GetMapping("/directMsg")
    public String directMsg() {

        Map<String, Object> map = new HashMap<>();
        map.put("messageId", String.valueOf(UUID.randomUUID()));
        map.put("data", "发送数据体" + System.currentTimeMillis());
        map.put("createTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        //将消息携带绑定键值：directRouting 发送到交换机 directExchange
        rabbitTemplate.convertAndSend("directExchange", "directRouting", map);

        return JSONObject.toJSONString(map);
    }

}
```

```java
@Component
@RabbitListener(queues = "directQueue")
public class DirectConsumer {

    @RabbitHandler
    public void process(Map<String, Object> message) {
        System.out.println("DirectReceiver 消费者收到消息  : " + message.toString());
    }

}
```

运行请求，控制台输出：

```
DirectReceiver 消费者收到消息  : {data=发送数据体1630769307037, createTime=2021-09-04 23:28:27, messageId=c09bbfc8-5018-4f9f-b8fc-678cb42348d2}
```

<br/>

上面是一对一的生产消费模式。

实际业务中，对消息生产者没有多少限制，只需要生产发送就可以，但是 **消息消费需要保证不能出现重复消费** 。

而消费端也不是一个服务在进行，工作队列就是这种情况：一个生产者，多个消费者。

```yaml
spring:
  rabbitmq:
    listener:
      simple:
        # 多消费者轮询模式，其实不是轮询，这是不公平分发
        prefetch: 1  # 每个消费者都能收到的未被消费的最大消息数量
```

再新建一个消费者：

```java
@Component
@RabbitListener(queues = "directQueue")
public class DirectConsumerTwo {
    @RabbitHandler
    public void process(Map<String, Object> message) {
        System.out.println("消费者2，DirectReceiver 消费者收到消息  : " + message.toString());
    }
}
```

其实就是 **轮询模式** 。

<br/>

### <span id="t22">Fanout Exchange</span>

扇型交换机，这个交换机没有路由键概念，就算你绑了路由键也是无视的。

**这个交换机在接收到消息后，会直接转发到绑定到它上面的所有队列。**

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/deploy/QQ%E6%88%AA%E5%9B%BE20210905223600.png)

代码基本一样：

```java
@Configuration
public class FanoutConfig {

    @Bean
    public Queue queueA() {
        return new Queue("fanout.A", true, false, false);
    }

    @Bean
    public Queue queueB() {
        return new Queue("fanout.B", true, false, false);
    }

    @Bean
    public Queue queueC() {
        return new Queue("fanout.C", true, false, false);
    }

    @Bean
    FanoutExchange fanoutExchange() {
        return new FanoutExchange("fanoutExchange");
    }

    @Bean
    Binding bindingExchangeA() {
        return BindingBuilder.bind(queueA()).to(fanoutExchange());
    }

    @Bean
    Binding bindingExchangeB() {
        return BindingBuilder.bind(queueB()).to(fanoutExchange());
    }

    @Bean
    Binding bindingExchangeC() {
        return BindingBuilder.bind(queueC()).to(fanoutExchange());
    }

}
```

```java
@GetMapping("/fanoutMsg")
public String confirmMsg() {
    Map<String, Object> map = new HashMap<>();
    map.put("messageId", String.valueOf(UUID.randomUUID()));
    map.put("data", "发送数据体" + System.currentTimeMillis());
    map.put("createTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

    rabbitTemplate.convertAndSend("fanoutExchange", null, map);
    return JSONObject.toJSONString(map);
}
```

```java
@Component
@RabbitListener(queues = "fanout.A")
public class FanoutReceiverA {

    @RabbitHandler
    public void process(Map<String, Object> message) {
        System.out.println("fanout.A 收到消息  : " + message.toString());
    }
}
```

```java
@Component
@RabbitListener(queues = "fanout.B")
public class FanoutReceiverB {

    @RabbitHandler
    public void process(Map<String, Object> message) {
        System.out.println("fanout.B 收到消息  : " + message.toString());
    }
}
```

<br/>

### <span id="t23">Topic Exchange</span>

主题交换机，这个交换机其实跟直连交换机流程差不多，但是它的特点就是：

> 在它的路由键和绑定键之间是有规则的，大致如下：
>
> -  **路由键必须是一串字符，用小数点（.） 隔开**
> - **通配符 * ，代表一个占位符，或者说一个单词** ，比如路由为 user.*，那么 user.email 可以匹配，但是 user.aaa.email 就匹配不了
> - 通**配符 # ，代表一个或多个占位符，或者说一个或多个单词** ，比如路由为 user.#，那么 user.email 可以匹配，user.aaa.email 也可以匹配

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/data/deploy/QQ%E6%88%AA%E5%9B%BE20210907232032.png)

代码相似：

```java
@Configuration
public class TopicConfig {

    @Bean
    public Queue queue1() {
        return new Queue("topic.queue1", true, false, false);
    }

    @Bean
    public Queue queue2() {
        return new Queue("topic.queue2", true, false, false);
    }

    @Bean
    TopicExchange topicExchange() {
        return new TopicExchange("topicExchange", true, false);
    }

    @Bean
    Binding bindingQueue1() {
        return BindingBuilder.bind(queue1()).to(topicExchange()).with("topic.queue1");
    }

    @Bean
    Binding bindingQueue2() {
        return BindingBuilder.bind(queue2()).to(topicExchange()).with("topic.#");
    }

}
```

```java
@RestController
@RequestMapping
public class TopicProducer {

    @Autowired
    RabbitTemplate rabbitTemplate;

    @GetMapping("/queue1")
    public String queue1() {

        Map<String, Object> map = new HashMap<>();
        map.put("messageId", String.valueOf(UUID.randomUUID()));
        map.put("data", "发送数据体" + System.currentTimeMillis());
        map.put("createTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        //将消息携带绑定键值：directRouting 发送到交换机 directExchange
        rabbitTemplate.convertAndSend("topicExchange", "topic.queue1", map);

        return JSONObject.toJSONString(map);
    }

    @GetMapping("/queue2")
    public String queue2() {

        Map<String, Object> map = new HashMap<>();
        map.put("messageId", String.valueOf(UUID.randomUUID()));
        map.put("data", "发送数据体" + System.currentTimeMillis());
        map.put("createTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        //将消息携带绑定键值：directRouting 发送到交换机 directExchange
        rabbitTemplate.convertAndSend("topicExchange", "topic.queue2", map);

        return JSONObject.toJSONString(map);
    }

}
```

```java
@Component
@RabbitListener(queues = "topic.queue1")
public class TopicReceiver1 {

    @RabbitHandler
    public void process(Map<String, Object> message) {
        System.out.println("topic.queue1 收到消息  : " + message.toString());
    }
}

@Component
@RabbitListener(queues = "topic.queue2")
public class TopicReceiver2 {

    @RabbitHandler
    public void process(Map<String, Object> message) {
        System.out.println("topic.queue2 收到消息  : " + message.toString());
    }
}
```

向 `topic.queue1` 发送消息，打印：

```
topic.queue1 收到消息  : {data=发送数据体1631024400445, createTime=2021-09-07 22:20:00, messageId=b4dc33cc-42d6-42e7-a828-4a5a3d2e1678}
topic.queue2 收到消息  : {data=发送数据体1631024400445, createTime=2021-09-07 22:20:00, messageId=b4dc33cc-42d6-42e7-a828-4a5a3d2e1678}
```

向 `topic.queue2` 发送消息，打印：

```
topic.queue2 收到消息  : {data=发送数据体1631024437342, createTime=2021-09-07 22:20:37, messageId=c92d5dab-84b7-4530-86f3-0bc31e5c4036}
```



<br/>

## <span id="t3">消息可靠性</span>

使用了 RabbitMQ 以后，我们的业务链路明显变长了，但造成消息丢失的场景也增加了。

主要存在以下三个关键环节：

1. 消息生产者 - rabbitmq服务器，发送消息失败
2. rabbitmq服务器自身故障导致消息丢失
3. 消息消费者 - rabbitmq服务，消息消费失败

针对这三个环节分别有对应的解决方案。

<br/>

### <span id="t31">发送确认</span>

发送确认分为两步，第一步是消息到达 exchange 交换机，第二步是从交换机路由到队列。两步同时成功则消息发送成功。

先添加配置：

```yaml
spring:
  rabbitmq:
    # 确认消息已发送到交换机(Exchange)
    publisher-returns: true
    # 确认消息已发送到队列(Queue)
    publisher-confirm-type: correlated
```

rabbitMQ 有以下两个接口供实现：

- **ConfirmCallback**：通过实现 ConfirmCallback 接口，消息发送到 Broker 后触发回调，确认消息是否到达 Broker 服务器，<span style="color:red">**也就是只确认是否正确到达 Exchange 中**</span>
- **ReturnsCallback**：通过实现 ReturnsCallback 接口，启动消息失败返回，<span style="color:red">**如果正确到达队列不执行**</span>。比如路由不到队列时触发回调

PS:  `RabbitTemplate.ReturnCallback` 已经过时了，改用上面那个，加个 `s`；

配置文件：

```java
@Slf4j
@Component
public class RabbitTemplateConfig {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @PostConstruct
    public void init() {
        // 通过实现 ReturnsCallback 接口，启动消息失败返回，如果正确到达队列不执行。
        rabbitTemplate.setReturnsCallback(returnedMessage -> {
            System.out.println("消息主体 message : " + returnedMessage.getMessage());
            System.out.println("消息主体 message : " + returnedMessage.getReplyCode());
            System.out.println("描述：" + returnedMessage.getReplyText());
            System.out.println("消息使用的交换器 exchange : " + returnedMessage.getExchange());
            System.out.println("消息使用的路由键 routing : " + returnedMessage.getRoutingKey());
        });

        // 消息发送到 Broker 后触发回调，确认消息是否到达 Broker 服务器，也就是只确认是否正确到达 Exchange 中
        rabbitTemplate.setConfirmCallback((correlationData, arrival, cause) -> {
            assert correlationData != null;
            if (arrival) {
                log.info("消息已发送到交换机，MessageId：{}", correlationData.getId());
            } else {
                log.info("消息发送失败，MessageId：{}，失败原因：{}", correlationData.getId(), cause);
            }
        });
    }
```

**失败测试只需要写错路由，或者队列就行了**。测试发送：

```java
rabbitTemplate.convertAndSend("directExchange", "queue", map, new CorrelationData());
```

打印日志：

```
消息主体 message : (Body:'{data=发送数据体1631111311090, createTime=2021-09-08 22:28:31, messageId=206749b5-d3bd-4ebe-8acb-3070d99a40a2}' MessageProperties [headers={spring_returned_message_correlation=8b124ce9-f8a1-4196-bb2a-ca1170842e05}, contentType=application/x-java-serialized-object, contentLength=0, receivedDeliveryMode=PERSISTENT, priority=0, deliveryTag=0])
消息主体 message : 312
描述：NO_ROUTE
消息使用的交换器 exchange : directExchange
消息使用的路由键 routing : queue

2021-09-08 22:28:31.104  INFO 10536 --- [nectionFactory1] c.d.shiva.confirm.RabbitTemplateConfig   : 消息已发送到交换机，MessageId：8b124ce9-f8a1-4196-bb2a-ca1170842e05
```



<br/>

### <span id="t32">消息持久化</span>

消息持久化，需要把 `queue`，`exchange` 都持久化。

上面创建交换机和队列时，已经使用了以下参数进行持久化：

```
durable: 是否持久化,默认是false,持久化队列：会被存储在磁盘上，当消息代理重启时仍然存在，暂存队列：当前连接有效
```



<br/>

### <span id="t33">消息签收</span>

rabbitMQ有个 ack 签收机制，简单来说就是三种模式：

**AcknowledgeMode.NONE**：默认推送的所有消息都已经消费成功，会不断地向消费端推送消息。所以推送出去的消息不会暂存在`server`端

**AcknowledgeMode.AUTO**： 由 `spring-rabbit` 依据消息处理逻辑是否抛出异常自动发送 `ack`（无异常）或 `nack`（异常）到 `server` 端。

**AcknowledgeMode.MANUAL**：模式需要人为地获取到 `channel` 之后调用方法向 `server` 发送 `ack` （或消费失败时的 `nack` ）信息

> 总结就是：无 `ack` 模式：效率高，存在丢失大量消息的风险。有 `ack` 模式：效率低，不会丢消息。

<br>

在配置文件添加：

```yaml
spring:
  rabbitmq:
    listener:
      simple:
        # 多消费者轮询模式
        prefetch: 1  #每个消费者都能收到的未被消费的最大消息数量
        # manual：手动，auto：根据情况确认，none：自动确认
        # 设置消费端手动,返回分为：ack（无异常），nack（存在异常），reject（存在异常）
        acknowledge-mode: manual
```

在消费结果方面，也有三种结果：

| 消费结果 | 结果                                                         | 批量操作 |
| -------- | ------------------------------------------------------------ | -------- |
| ack      | 表示成功确认，使用此回执方法后，消息会被`rabbitmq broker` 删除<br/>`void basicAck(long deliveryTag, boolean multiple)` | 允许     |
| nack     | 表示失败确认，一般在消费消息业务异常时用到此方法，可以将消息重新投递入队列。<br/>`void basicNack(long deliveryTag, boolean multiple, boolean requeue)` | 允许     |
| reject   | 拒绝消息，与 `basicNack` 区别在于不能进行批量操作，其他用法很相似。<br>`void basicReject(long deliveryTag, boolean requeue)` | 不允许   |

- **deliveryTag**：表示消息投递序号，每次消费消息或者消息重新投递后，deliveryTag 都会递增。手动消息确认模式下，我们可以对指定deliveryTag的消息进行ack、nack、reject等操作。
- **multiple**：为了减少网络流量，手动确认可以被批处理，值为 true 则会一次性 ack所有小于当前消息 deliveryTag 的消息。

> **举个栗子：** 假设我先发送三条消息`deliveryTag`分别是5、6、7，可它们都没有被确认，当我发第四条消息此时`deliveryTag`为8，`multiple`设置为 true，会将5、6、7、8的消息全部进行确认。

下面看代码：

```java
@Slf4j
@Component
@RabbitListener(queues = "directQueue")
public class ConfigDirectConsumer {

    @RabbitHandler
    public void process(Map<String, Object> message, Channel channel, Message mqMsg) throws IOException {
        try {
            System.out.println("消费者收到消息  : " + message.toString());
            channel.basicAck(mqMsg.getMessageProperties().getDeliveryTag(), false);
        } catch (Exception e) {
            if (mqMsg.getMessageProperties().getRedelivered()) {
                log.error("消息已重复处理失败，不在返回队列...");
                channel.basicReject(mqMsg.getMessageProperties().getDeliveryTag(), false);
            } else {
                log.error("消息即将再次返回队列处理...");
                channel.basicNack(mqMsg.getMessageProperties().getDeliveryTag(), false, true);
            }
        }
    }
}
```

**循环消费**

如果对一条异常处理的消息，进行重新入队，就会无限循环重复消费，用确认处理然后返回队尾可以稍微缓减：

```java
channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
// 重新发送消息到队尾
channel.basicPublish(message.getMessageProperties().getReceivedExchange(),
                    message.getMessageProperties().getReceivedRoutingKey(), MessageProperties.PERSISTENT_TEXT_PLAIN,
                    JSON.toJSONBytes(msg));
```



<br/>

## <span id="te">参考文章</span>

[docker 安装rabbitMQ - 风止雨歇 - 博客园 (cnblogs.com)](https://www.cnblogs.com/yufeng218/p/9452621.html)

[尚硅谷2021最新版RabbitMQ教程丨快速掌握MQ消息中间件_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1cb4y1o7zz)

[Springboot 整合RabbitMq ，用心看完这一篇就够了_默默不代表沉默-CSDN博客](https://blog.csdn.net/qq_35387940/article/details/100514134)

[RabbitMQ的应用场景以及基本原理介绍_杨龙飞的博客-CSDN博客_rabbitmq使用场景](https://blog.csdn.net/whoamiyang/article/details/54954780)

[SpringBoot+RabbitMQ 实现"工作队列"_Felix-CSDN博客](https://blog.csdn.net/yuanlong122716/article/details/104595599)

[springboot + rabbitmq 消息确认机制_不忘初心 砥砺前行-CSDN博客](https://blog.csdn.net/zhangweiwei2020/article/details/107250202/)

[spring-rabbit消费过程解析及AcknowledgeMode选择_JinchaoLv的博客-CSDN博客_acknowledge-mode](https://blog.csdn.net/weixin_38380858/article/details/84963944)

[RabbitMQ：消息发送确认 与 消息接收确认（ACK） - 简书 (jianshu.com)](https://www.jianshu.com/p/2c5eebfd0e95)

[Springboot中整合RabbitMq之Topic模式（单个springboot项目）_我的博客-CSDN博客_rabbitmq topic模式](https://blog.csdn.net/zhaodj5660/article/details/79895562)

[RabbitMq从入门到精通-ConfirmCallback ReturnCallback 区别及使用_wxb880114的专栏-CSDN博客](https://blog.csdn.net/wxb880114/article/details/105836274)

[rabbitTemplate.setReturnCallback()显示过时_kano_2525的博客-CSDN博客](https://blog.csdn.net/kano_2525/article/details/118423266)

