<div class="catalog">

- [JDK 安装](#jdk)
- [Niginx 安装](#nginx)
- [MySql 安装](#mysql)
- [node.js 安装](#node)
- [redis 安装](#redis)
- [activeMQ 安装](#activeMQ)

</div>

> 所有涉及具体路径请自行确认
>
> 本文只是简单介绍，便于以后自己可以直接复制粘贴

### <span id="jdk">JDK安装</span>

JDK下载地址：<a href="https://www.oracle.com/technetwork/java/javase/archive-139210.html" target="_blank">https://www.oracle.com/technetwork/java/javase/archive-139210.html</a>

> 个人喜欢用tar.gz解压的方式

1. 下载tar.gz压缩包，上传服务器，解压

2. 配置 profile 环境变量

```shell
vi /etc/profile
```

   在末尾添加环境变量

```Properties
export JAVA_HOME=/usr/java/jdk1.8.0_65
export JRE_HOME=$JAVA_HOME/jre
export CLASSPATH=.:$JAVA_HOME/lib:$JRE_HOME/lib
export PATH=$JAVA_HOME/bin:$PATH
```

3. 使文件生效 

```shell
source /etc/profile 
```

4. 查看是否成功

```shell
java -version
```



<br>

### <span id="nginx">Nginx 安装</span>


Nginx下载地址：<a href="http://nginx.org/en/download.html" target="_blank">http://nginx.org/en/download.html</a>

> 安装Nginx，并添加SSL模块
>
> 详细安装已经在服务器 - Nginx相关文章内写过了，就不赘述了

1. 安装环境

```
yum install gcc-c++
yum install -y pcre pcre-devel
yum install -y zlib zlib-devel
yum install -y openssl openssl-devel
```

2. 上传 tar.gz ，解压，进入解压文件

```
./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module
make
make install
```

3. 启动

```
./nginx
```




<br>

### <span id="mysql">MySql 安装</span>

> 直接用命令行安装 MySql 5.7 

1. 下载并安装MySQL官方的 Yum Repository

```shell
wget -i -c http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm 
```

2. 安装 MySql 二进制包

```shell
yum -y install mysql57-community-release-el7-10.noarch.rpm 
```

3. 安装 MySql 服务 

```shell
 yum -y install mysql-community-server 
```

4. 启动 MySql ，并查看运行状态

```
systemctl start mysqld.service 
systemctl status mysqld.service 
```

5. 查看默认root权限密码

```shell
grep "password" /var/log/mysqld.log
```

6. 根据密码，登陆并修改密码

```SQL
mysql -uroot -p 
alter user 'root'@'localhost' identified by 'password';
FLUSH PRIVILEGES;
```

7. 创建新用户，授权，并设置登陆ip

```SQL
create user 'username'@'%' identified by 'password';
grant all privileges on *.* to 'username'@'%'  identified by 'password' with grant option;
FLUSH PRIVILEGES;
```



<br>


### <span id="node">node.js 安装</span>

首先在<a target="_blank" href="https://nodejs.org/dist/">https://nodejs.org/dist/</a>下载node.js。

例如：node-v12.16.1-linux-x64.tar.gz 。是已经编译好的文件，在bin文件夹中已经存在node以及npm，建立软链接，可以直接使用。

1. 下载，上传到服务器解压，重命名文件夹
```shell
tar  xf node-v12.16.1-linux-x64.tar.gz -C /usr/local/
cd /usr/local/
mv node-v12.16.1-linux-x64/ nodejs
```

2. 创建软链接
```shell
ln -s /usr/local/nodejs/bin/node /usr/local/bin
ln -s /usr/local/nodejs/bin/npm /usr/local/bin
```

<br>

### <span id="redis">redis 安装</span>

首先，在 <a target="_blank" href="https://download.redis.io/releases/">https://download.redis.io/releases/</a> 下载需要的版本。

然后，上传到服务器，解压，进入目录编译

```shell
make install PREFIX=/usr/local/redis
```

如果出现 GCC 版本问题，可以更新到 9.1 ,使用以下命令

```shell
gcc -v
yum -y install centos-release-scl
yum -y install devtoolset-9-gcc devtoolset-9-gcc-c++ devtoolset-9-binutils
scl enable devtoolset-9 bash
echo "source /opt/rh/devtoolset-9/enable" >>/etc/profile
```

编译后， src 下 redis-server 启动，最好指定配置文件启动。

```shell
./redis-server ../redis.conf
```

一般情况下，需要改些配置如下：

- 默认端口 port，容易被攻击

- `bind 127.0.0.1` 需要注释掉，需要远程连接

- `requirepass foobared` 打开注释，把密码改得复杂点

<br>

### <span id="activeMQ">activeMQ 安装</span>

activemq 需要JDK环境，这个提前装。activemq 对 JDK 有版本要求，也许需要修改 env 文件指定jdk，用以下参数指定：

> JAVA_HOME="/opt/jdk1.8"

然后下载 <a target="_blank" href="https://activemq.apache.org/components/classic/download/">https://activemq.apache.org/components/classic/download/</a> 

上传到服务器，解压，然后可以进入 bin 目录下直接启动：

```shell
./activemq start
```

默认端口 **61616** ，在 `conf/activemq.xml` 文件内，可以修改端口：

```xml
<transportConnector name="openwire" uri="tcp://0.0.0.0:61616?maximumConnections=1000&amp;wireFormat.maxFrameSize=104857600"/>
```

默认控制台端口 **8161** ，在 `conf/jetty.xml` 文件内，可以修改：

```xml
<bean id="jettyPort" class="org.apache.activemq.web.WebConsolePort" init-method="start">
         <!-- the default port number for the web console -->
    <property name="host" value="0.0.0.0"/>
    <property name="port" value="8161"/>
</bean>
```

默认管理员密码为 **admin/admin** ,分别在 `conf/jetty.xml` 、`conf/jetty-realm.properties` 文件内，可以修改：

```xml
 <bean id="securityConstraint" class="org.eclipse.jetty.util.security.Constraint">
    <property name="name" value="BASIC" />
    <!-- 默认 admin、user 两种角色 -->
    <property name="roles" value="user,admin" />
    <!-- true 开启，false 关闭 -->
    <property name="authenticate" value="true" />
</bean>
```

```yaml
# username: password [,rolename ...]
admin: admin, admin
user: user, user
```

注意结构是  `用户名 ： 密码， 角色数组`

