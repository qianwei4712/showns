<div class="catalog">

- [前言](#t1)
- [compose 安装](#t2)
- [Hello Docker Compose](#t3)
- [compose 模板文件](#t4)
- [compose 命令语法](#t5)
- [参考文章](#te)

</div>

## <span id="t1">前言</span>

`Compose` 项目是 Docker 官方的开源项目，负责实现对 Docker 容器集群的快速编排

 **讲人话就是， 一个 `yml` 文件定义和运行多个 docker 容器，同时指定启动顺序** 

<br>

## <span id="t2">compose 安装</span>

可以去

最简单的方法，直接敲两个命令：

```shell
curl -L https://github.com/docker/compose/releases/download/1.29.2/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

但是因为实在下载太慢，可以去 GitHub 上下载：[Releases · docker/compose (github.com)](https://github.com/docker/compose/releases) 安装。

1. **下载文件名为 `docker-compose-Linux-x86_64`** 
2. **上传 `/usr/local/bin` ，重命名为  `docker-compose`**
3. 添加权限

检测安装成功：

```shell
docker-compose --version
```



<br>

## <span id="t3">Hello Docker Compose</span>

Compose 中：

- 每一个 service 都是一个容器
- 多个 service（容器）组成一个 project（项目）
- **文件名必须是 `docker-compose.yml`**

<br>

先做个测试，创建一个 `docker-compose` 文件，弄个tomcat测试：

```yaml
version: "3.0"
services:
  tomcat-docker:  # 唯一服务名
    image: tomcat:8.0-jre8 # 创建当前这个容器的镜像
    ports:
      - 8094:8080   # 映射端口
```

进入目录下使用：

```shell
docker-compose up
```

后台运行使用：

```shell
docker-compose up -d
```

访问地址，可以看到容器正常启动

![image-20210917221206037](https://gitee.com/qianwei4712/picture/raw/master/images/image-20210917221206037.png)

<br>

## <span id="t4">compose 模板文件</span>

最基础的模板在上面的例子中有了

- 定义版本号，一般 `3.0` 到 `4.0` 都行，可以在官网查看对应关系：[Compose file | Docker Documentation](https://docs.docker.com/compose/compose-file/)
- 一个 `service` 代表一个容器，`services` 下可以有多个容器
- 常用的模板文件用法如下，文档可以参考：[Compose 模板文件 | Docker 从入门到实践](https://vuepress.mirror.docker-practice.com/compose/compose_file/)
- [模板文件备用链接，长图](https://gitee.com/qianwei4712/picture/blob/master/images/网页捕获_17-9-2021_23632_vuepress.mirror.docker-practice.com.jpeg)

<br>

**image**

指定为镜像名称或镜像 ID。如果镜像在本地不存在，`Compose` 将会尝试拉取这个镜像。

```yaml
image: ubuntu
image: orchardup/postgresql
image: a4bc65fd
```



**ports**

暴露端口信息。

使用宿主端口：容器端口 `(HOST:CONTAINER)` 格式，或者仅仅指定容器的端口（宿主将会随机选择端口）都可以。

```yaml
ports:
 - "3000"
 - "49100:22"
```



**volumes**

数据卷所挂载路径设置。可以设置为宿主机路径(`HOST:CONTAINER`)或者数据卷名称(`VOLUME:CONTAINER`)，并且可以设置访问模式 （`HOST:CONTAINER:ro`）。

该指令中路径支持相对路径。

```yaml
volumes:
 - /var/lib/mysql
 - cache/:/tmp/cache
 - ~/configs:/etc/configs/:ro
```

如果路径为数据卷名称，必须在文件中配置数据卷。

```yaml
version: "3"

services:
  my_src:
    image: mysql:8.0
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data: # 必须声明一下
```



**container_name**

指定容器名称。默认将会使用 `项目名称_服务名称_序号` 这样的格式。

```yaml
version: "3"
services:
  docker-service-name:  # 容器服务名
    container_name: docker-web-container  # 容器名称
```



**command**

覆盖容器启动后默认执行的命令。

```yaml
command: echo "hello world"
```



**build**

指定 `Dockerfile` 所在文件夹的路径（可以是绝对路径，或者相对 docker-compose.yml 文件的路径）。 `Compose` 将会利用它自动构建这个镜像，然后使用这个镜像。

```yaml
version: '3'
services:

  webapp:
    build: ./dir
```

你也可以使用 `context` 指令指定 `Dockerfile` 所在文件夹的路径。

使用 `dockerfile` 指令指定 `Dockerfile` 文件名。使用 `arg` 指令指定构建镜像时的变量。

```yaml
version: '3'
services:
  webapp:
    build:
      context: /opt/docker
      dockerfile: Dockerfile-alternate
      args:
        buildno: 1
    container_name: webapp
    ports:
      - "8080:8080"
```



**depends_on**

解决容器的依赖、启动先后的问题。以下例子中会先启动 `redis` `db` 再启动 `web`

```yaml
version: '3'

services:
  web:
    build: .
    depends_on:
      - db
      - redis

  redis:
    image: redis

  db:
    image: postgres
```

> 注意：`web` 服务不会等待 `redis` `db` 「完全启动」之后才启动。



**networks**

配置容器连接的网络。

```yaml
version: "3"
services:

  some-service:
    networks:
     - some-network
     - other-network

networks:
  some-network:
  other-network:
```



**sysctls**

配置容器内核参数。

```yaml
sysctls:
  net.core.somaxconn: 1024
  net.ipv4.tcp_syncookies: 0

sysctls:
  - net.core.somaxconn=1024
  - net.ipv4.tcp_syncookies=0
```



**ulimits**

指定容器的 ulimits 限制值。

例如，指定最大进程数为 65535，指定文件句柄数为 20000（软限制，应用可以随时修改，不能超过硬限制） 和 40000（系统硬限制，只能 root 用户提高）。

```yaml
  ulimits:
    nproc: 65535
    nofile:
      soft: 20000
      hard: 40000
```



**environment**

设置环境变量，例如设置 mysql 默认启动密码

```yaml
environment:
  - MYSQL_ROOT_PASSWORD=root
```



**env_file**

从文件中获取环境变量，可以为单独的文件路径或列表。

如果通过 `docker-compose -f FILE` 方式来指定 Compose 模板文件，则 `env_file` 中变量的路径会基于模板文件路径。

如果有变量名称与 `environment` 指令冲突，则按照惯例，以后者为准。

```bash
env_file: .env

env_file:
  - ./apps/web.env
  - /opt/secrets.env
```

环境变量文件中每一行必须符合格式，支持 `#` 开头的注释行。

```bash
# common.env: Set development environment
MYSQL_ROOT_PASSWORD=root
```

这个方式可以防止 模板文件中因为使用 `environment` 而出现明文的敏感信息





<br/>

## <span id="t5">compose 命令语法</span>

语法可以参考：

- [Compose 模板文件 | Docker 从入门到实践 (docker-practice.com)](https://vuepress.mirror.docker-practice.com/compose/compose_file/)
- [备用链接，长图](https://gitee.com/qianwei4712/picture/blob/7ca034831673bc2c769f31515f3dd566f2d701e7/images/网页捕获_17-9-2021_2363_vuepress.mirror.docker-practice.com.jpeg)



对于 Compose 来说，大部分命令的对象既可以是项目本身，也可以指定为项目中的服务或者容器。

如果没有特别的说明，命令对象将是项目，这意味着项目中所有的服务都会受到命令影响。

`docker-compose` 命令的基本的使用格式是：

```bash
docker-compose [-f=<arg>...] [options] [COMMAND] [ARGS...]
```

常用的比较少，记住几个就可以了。

<br/>

**up**

> docker-compose up [options] [SERVICE...]

- 该命令十分强大，它将尝试自动完成包括构建镜像，（重新）创建服务，启动服务，并关联服务相关容器的一系列操作。

- 链接的服务都将会被自动启动，除非已经处于运行状态。

- 可以说，大部分时候都可以直接通过该命令来启动一个项目。

- 默认情况，`docker-compose up` 启动的容器都在前台，控制台将会同时打印所有容器的输出信息，可以很方便进行调试。

- 当通过 `Ctrl-C` 停止命令时，所有容器将会停止。

- 如果使用 `docker-compose up -d`，将会在后台启动并运行所有的容器。一般推荐生产环境下使用该选项。

- 默认情况，如果服务容器已经存在，`docker-compose up` 将会尝试停止容器，然后重新创建（保持使用 `volumes-from` 挂载的卷），以保证新启动的服务匹配 `docker-compose.yml` 文件的最新内容

<br/>

**down**

> docker-compose down

此命令将会停止 `up` 命令所启动的容器，并移除网络。

<br/>

**ps**

> docker-compose ps [options] [SERVICE...]

列出项目中目前的所有容器。选项：

- `-q` 只打印容器的 ID 信息。

<br/>

**log**

> docker-compose log 服务id

查看服务日志



<br>

## <span id="te">参考文章</span>

[Docker容器技术&Docker-Compose实战教程](https://www.bilibili.com/video/BV1VA411A7ka?p=24)

[docker&docker-compose实战教程.zip](https://gitee.com/qianwei4712/static-resources/blob/9d6703845d7e661e11307f53f11743cb3910bd7d/showns/file/docker&docker-compose实战教程.zip)

[Docker Compose 项目 | Docker 从入门到实践 (docker-practice.com)](https://vuepress.mirror.docker-practice.com/compose/)
