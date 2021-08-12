
## 前言


>  环境： `jdk 8`、`springboot 2.4.9`、`mybatis-plus 3.4.3.1`、`dynamic-datasource 3.3.2`

使用文档：[ dynamic-datasource · 看云 ](https://www.kancloud.cn/tracy5546/dynamic-datasource/2264611)

在分布式事务比较困难的情况下，做读写分离还是蛮好用的。

<br>

## 1. 依赖配置

加入依赖：
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-jdbc</artifactId>
    </dependency>

    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <scope>runtime</scope>
    </dependency>

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- mybatis-plus依赖 -->
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
        <version>3.4.3.1</version>
    </dependency>

    <!--mybatis-plus 多数据源-->
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>dynamic-datasource-spring-boot-starter</artifactId>
        <version>3.3.2</version>
    </dependency>
</dependencies>
```

基础使用 application 配置：
```yaml
spring:
  datasource:
    dynamic:
      #设置默认的数据源或者数据源组,默认值即为master
      primary: master
      #严格匹配数据源,默认false. true未匹配到指定数据源时抛异常,false使用默认数据源
      strict: false
      datasource:
        master:
          username: root
          password: root
          url: jdbc:mysql://127.0.0.1:3306/code-of-shiva?useUnicode=true&characterEncoding=utf-8&useSSL=true&serverTimezone=GMT%2B8
          driver-class-name: com.mysql.cj.jdbc.Driver
        slave_1:
          username: root
          password: root
          url: jdbc:mysql://127.0.0.1:3306/shiva-maybe?useUnicode=true&characterEncoding=utf-8&useSSL=true&serverTimezone=GMT%2B8
          driver-class-name: com.mysql.cj.jdbc.Driver
```

<br>

## 2. 基础使用

|     注解      |                   结果                   |
| :-----------: | :--------------------------------------: |
|    没有@DS    |                默认数据源                |
| @DS("dsName") | dsName可以为组名也可以为具体某个库的名称 |

```java
@Mapper
@Component
public interface MasterMapper {
    @Select("SELECT username FROM sys_user where id = #{id}")
    String getUsernameById(String id);

}
```

```java
@Mapper
@Component
@DS("slave_1")
public interface SlaveMapper {
    @Select("SELECT name FROM sys_area where id = #{id}")
    String getNameById(String id);
}
```

这就结束了。。。。。

then ，根据文档以下两条约定，进一步进行分组：

> - <span style="color:red">配置文件所有以下划线 `_` 分割的数据源 **首部** 即为组的名称，相同组名称的数据源会放在一个组下。</span>
> - **方法上的注解优先于类上注解**

```java
@Mapper
@Component
@DS("slave")
public interface SlaveMapper {
    @DS("slave_1")
    @Select("SELECT name FROM sys_area where id = #{id}")
    String getNameById(String id);
    
    @DS("slave_2")
    @Select("DELETE FROM sys_area where id = #{id}")
    int deleteById(String id);
}
```

<br>

## 3. 切换数据源

根据特殊业务可以对数据源进行切换

```java
public String getUsername(String id) {
    //手动切换数据库
    DynamicDataSourceContextHolder.push("slave_1");
    //DynamicDataSourceContextHolder.push("slave");
    return masterMapper.getUsernameById(id);
}
```

搭配一些拦截器、缓存之类的，就可以根据请求来进行数据库动态切换了。

<br>

## 4. 事务

- Spring 的事务通过 `@Transational` 开启，开启事务后线程只能拿到一个 connection，所以无 **法切换数据源**。
- dynamic-datasource 做了本地事务，但是不支持 spring 的事务，那就。。。呃，还是算了。
- alibaba 分布式事务组件 seata。

**失败案例：**

```java
@Transactional
public void editAllDbs(){
    masterMapper.updateRemarksById("1");
    DynamicDataSourceContextHolder.push("slave_1");
    slaveMapper.updateRemarksById("10000");
}
```

```verilog
### Error updating database.  Cause: java.sql.SQLSyntaxErrorException: Table 'code-of-shiva.sys_area' doesn't exist
```

**不管加不加手动切换，都无法进行切换数据源。**

不过，`@Transactional` 依然生效，毕竟抛出了异常，事务回滚。。。

<br>

**seata 使用：**

seata 要进行安装，具体就不写了，把 pom 和配置放上

```xml
<dependency>
    <groupId>io.seata</groupId>
    <artifactId>seata-spring-boot-starter</artifactId>
    <version>1.4.2</version>
</dependency>
```

```yaml
spring:
  datasource:
    dynamic:
      seata: true    #开启seata代理，开启后默认每个数据源都代理，如果某个不需要代理可单独关闭
      seata-mode: AT #支持XA及AT模式,默认AT
seata:
  enabled: true
  application-id: ${spring.application.name}
  tx-service-group:  ${spring.application.name}-group
  enable-auto-data-source-proxy: false   #一定要是false
  service:
    vgroup-mapping:
      my_test_tx_group: default  #key与上面的tx-service-group的值对应
    grouplist:
      default: 127.0.0.1:8091 #seata-server地址仅file注册中心需要
  config:
    type: file
  registry:
    type: file
```

测试方法：

```java
@DS("master")
@Transactional
//重点 第一个开启事务的需要添加seata全局事务注解
@GlobalTransactional
public void editAllDbs(){
    masterTrans();
    slaveTrans();
}

@DS("master")
//事务传播特性设置为 REQUIRES_NEW 开启新的事务  重要！！！！一定要使用REQUIRES_NEW
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void masterTrans(){
    masterMapper.updateRemarksById("1");
}

@DS("slave")
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void slaveTrans(){
    slaveMapper.updateRemarksById("10000");
}
```

