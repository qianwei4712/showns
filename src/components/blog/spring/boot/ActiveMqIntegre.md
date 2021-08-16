## 前言

> 环境： `jdk 8`、`springboot 2.4.9`、`activemq 5.15.15`

**JMS术语：**

- Provider/MessageProvider：生产者
- Consumer/MessageConsumer：消费者
- PTP：Point To Point，点对点通信消息模型
- Pub/Sub：Publish/Subscribe，发布订阅消息模型
- Queue：队列，目标类型之一，和PTP结合
- Topic：主题，目标类型之一，和Pub/Sub结合
- ConnectionFactory：连接工厂，JMS用它创建连接
- Connnection：JMS Client 到 JMS Provider的连接
- Destination：消息目的地，由 Session 创建
- Session：会话，由 Connection 创建，实质上就是发送、接受消息的一个线程，因此生产者、消费者都是Session创建的

**两种模式：**

| 模式                          | 解释                                                         | 数据范围                               |
| ----------------------------- | ------------------------------------------------------------ | -------------------------------------- |
| queue 点对点传输              | 一个生产者对应一个消费者，生产者向broke推送数据，数据存储在broke的一个队列中，当消费者接受该条队列里的数据 | 可以接收到在连接之前生产者所推送的数据 |
| topic 基于发布/订阅模式的传输 | 根据订阅话题来接收相应数据，一个生产者可向多个消费者推送数据 | 只能接收到连接之后生产者推送的数据     |



<br>

## 依赖配置

添加依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-activemq</artifactId>
</dependency>
<dependency>
    <groupId>org.apache.activemq</groupId>
    <artifactId>activemq-pool</artifactId>
</dependency>
```

application.yml 配置：

```yaml
server:
  port: 80

spring:
  activemq:
    # 安装 activemq 的 ip端口
    broker-url: tcp://120.55.45.66:8089
    user: admin
    password: admin33221
    # 在考虑结束之前等待的时间
    close-timeout: 15s
  jms:
    #默认情况下activemq提供的是queue模式。 发布订阅: false 表示 queue，true 表示 topic
    pub-sub-domain: false

```

<br>

## 队列模式

生产者：

```java
@Component
public class QueueProducter {
    @Resource
    private JmsMessagingTemplate jmsMessagingTemplate;
    /**
     * 直接传入名称，这种情况下，会自动创建 对应名称 的队列
     */
    public void sendQueueMsg(String queueName, String message){
        jmsMessagingTemplate.convertAndSend(queueName, message);
    }

}
```

调用发送：

```java
@RestController
public class ProducerController {
    @Autowired
    private QueueProducter queueProducter;
    @RequestMapping("send")
    public void send(){
        queueProducter.sendQueueMsg("XKSNASWNSH", String.valueOf(Math.random()));
    }
}
```

消费者：

```java
@Component
public class QueueCustomer {
    @JmsListener(destination="XKSNASWNSH")
    public void readActiveQueue(String message) {
        System.out.println("queue接受到：" + message);
    }
}
```

<br>

## 订阅模式

配置文件：

```yaml
pub-sub-domain: true
```

生产者：

```java
@Component
public class TopicProducter {
    @Resource
    private JmsMessagingTemplate jmsMessagingTemplate;
    public void sendTopicMsg(String message){
        ActiveMQTopic destination = new ActiveMQTopic("shiva.topic");
        jmsMessagingTemplate.convertAndSend(destination, message);
    }
}
```

消费者：

```java
@Component
public class TopicCustomer {
    @JmsListener(destination="shiva.topic")
    public void readActiveTopic1(String message) {
        System.out.println("readActiveTopic1接受到：" + message);
    }

    @JmsListener(destination="shiva.topic")
    public void readActiveTopic2(String message) {
        System.out.println("readActiveTopic2接受到：" + message);
    }

}
```

<br>

## 通配符订阅

ActiveMQ 支持三种 `.` 、`*`、`>` ：

- **.** 用于作为路径上名字间的分隔符
- ***** 用于匹配路径上的任何名字
- **>** 用于递归地匹配任何以这个名字开始的destination

<br>





## 参考文章

[SpringBoot 整合 ActiveMq - 风止雨歇 - 博客园 (cnblogs.com)](https://www.cnblogs.com/yufeng218/p/11509486.html)

[SpringBoot集成ActiveMQ实例详解_罗马没假日-CSDN博客](https://blog.csdn.net/spd96363/article/details/108645809)

[ActiveMQ通配符式订阅_BXS-CSDN博客_activemq 通配符](https://blog.csdn.net/newbie0107/article/details/106592008)
