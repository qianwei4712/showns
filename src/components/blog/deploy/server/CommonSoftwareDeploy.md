[JDK安装()](#jdk)

[Niginx安装()](#nginx)

[MySql安装()](#mysql)

<br>

> 所有涉及具体路径请自行确认
>
> 本文只是简单介绍，便于以后自己可以直接复制粘贴

### <span id="jdk">JDK安装</span>

JDK下载地址：<a href="https://www.oracle.com/technetwork/java/javase/archive-139210.html" target="_blank_">https://www.oracle.com/technetwork/java/javase/archive-139210.html</a>

> 个人喜欢用tar.gz解压的方式

1. 下载tar.gz压缩包，上传服务器，解压

2. 配置 profile 环境变量

   ```shell
   vi /etc/profile
   ```

   在末尾添加环境变量

   ```shell
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

### <span id="nginx">Nginx安装</span>


Nginx下载地址：<a href="http://nginx.org/en/download.html" target="_blank_">http://nginx.org/en/download.html</a>

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
make  install
```

3. 启动

```
./nginx
```




<br>

### <span id="mysql">MySql安装</span>

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

```shell
mysql -uroot -p 
alter user 'root'@'localhost' identified by 'password;
FLUSH PRIVILEGES;
```

7. 创建新用户，授权，并设置登陆ip

```shell
create user 'username'@'%' identified by 'password';
grant all privileges on *.* to 'username'@'%'  identified by 'password' with grant option;
FLUSH PRIVILEGES;
```

