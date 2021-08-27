### 概述

搭建一个企业代码仓库，网上对比一圈，发现 gitea 比较受欢迎。

- 选用 docker 作为 gitea 容器
- 主服务器装 mysql ，团队5人以下用 SQLite 3 也够用 。

 <br>

### mysql 安装

1. MySQL 安装

```shell
wget -i -c http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm 
yum -y install mysql57-community-release-el7-10.noarch.rpm 
yum -y install mysql-community-server 
```

2. 启动 MySql ，并查看运行状态

```
systemctl start mysqld.service 
systemctl status mysqld.service 
```

3. 查看默认root权限密码，然后修改密码。

``` shell
grep "password" /var/log/mysqld.log
mysql -uroot -p 
alter user 'root'@'localhost' identified by 'password';
FLUSH PRIVILEGES;
```

4. 创建新用户，授权，并设置登陆ip

```SQL
create user 'gitea'@'%' identified by 'password';
grant all privileges on *.* to 'gitea'@'%'  identified by 'password' with grant option;
FLUSH PRIVILEGES;
```

5. 最后创建 gitea 数据库，编码使用 utfmb4

 <br>

### docker gitea 安装

直接拉最新版的 gitea

```shell
docker pull gitea/gitea
```

服务器准备两个开放端口，例如 `52125`、`36523`

容器映射 `22` 和 `3000` 端口到服务器的 `52125`、`36523`端口

官网启动方式：

```shell
docker run -d --name=gitea -p 52125:22 -p 36523:3000 -v /var/lib/gitea:/data gitea/gitea:latest
```

本次启动方式(新增两个参数，可以根据需要选择)：

```shell
docker run -d --privileged=true --restart=always --name=gitea -p 52125:22 -p 36523:3000 -v /var/lib/gitea:/data gitea/gitea:latest
```

> --privileged=true 使用该参数，container内的root拥有真正的root权限（可根据需要选择是否要该参数）
>
> --restart=always  自动重启容器（可根据需要选择是否要该参数）
>
> -p 端口映射（宿主机端口：容器端口）
>
> -v 容器卷挂载 （宿主机目录 ：容器目录），把配置文件保存在宿主机，可以随时重置镜像不影响使用

 <br>

###  初始化

启动后访问：**`http://ip:36523`** ，进入初始化

- 数据库：选择 mysql 的填写连接信息、使用 SQLite 3 的使用默认位置将仓库保存到宿主机
- SSH 服务域名：改为 公网IP，或者域名
- SSH 端口：改为映射的公网端口 `52125`
- Gitea 基本URL：localhost 改为 公网IP 或域名，端口改为映射端口 `36523`



 <br>

### 参考文章

[你在 Docker 中跑 MySQL？恭喜你，好下岗了！ (toutiao.com)](https://www.toutiao.com/i6675622107390411276/)

[docker安装gitea(不好使你打我)_臭小子的博客-CSDN博客](https://blog.csdn.net/shuai8624/article/details/107564659/)
