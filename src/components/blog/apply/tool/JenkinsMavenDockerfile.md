

## 概述

想着在公司弄一套自动部署测试流程，jenkins + gitee 自动 build 已经测试成功了。

下一步就是 docker + maven + jenkins + git 打包发布了。



<br>

## dockerfile

dockerfile 可以根据命令定制镜像，用来构建 docker 容器。

### 语法

**注意：dockerfile 命令都必须用大写**

- **FROM**：定制的镜像都是基于 FROM 的镜像，这里的 nginx 就是定制需要的基础镜像。后续的操作都是基于 nginx。
- **MAINTAINER**：维护者，国际惯例：姓名+邮箱。
- **ADD/COPY**：两者相似、官方推荐 COPY，将文件复制到容器中。不过 **ADD 会自动解压**，也蛮不错。
- **RUN**：用于执行后面跟着的命令行命令。RUN是构件容器时就运行的命令以及提交运行结果。
- **VOLUME**：定义匿名数据卷。在启动容器时忘记挂载数据卷，会自动挂载到匿名卷。避免数据丢失、避免容器膨胀。
- **EXPOSE**：声明端口。① 帮助镜像使用者理解这个镜像服务的守护端口，以方便配置映射。② 在运行时使用随机端口映射时，也就是 docker run -P 时，会自动随机映射 EXPOSE 的端口。
- **ENV**：设置环境变量，定义了环境变量，那么在后续的指令中，就可以使用这个环境变量。
- **WORKDIR**：指定工作目录。用 WORKDIR 指定的工作目录，会在构建镜像的每一层中都存在。（WORKDIR 指定的工作目录，必须是提前创建好的）。docker build 构建镜像过程中的，每一个 RUN 命令都是新建的一层。<span style="color:Red">只有通过 WORKDIR 创建的目录才会一直存在</span>。
- **CMD**：CMD是容器启动时执行的命令，在构件时并不运行，构件时紧紧指定了这个命令到底是个什么样子。**<span style="color:Red">如果 Dockerfile 中如果存在多个 CMD 指令，仅最后一个生效</span>**
- **ENTRYPOINT** ：类似于 CMD 指令，但其不会被 docker run 的命令行参数指定的指令所覆盖，而且这些命令行参数会被当作参数送给 ENTRYPOINT 指令指定的程序。

```powershell
# 基础镜像，在此基础上开始构建
FROM centos

# 维护者信息
MAINTAINER shiva

# 将jar包复制到容器指定目录下
COPY /opt/shiva-test.jar /opt/
ADD /usr/local/java/jdk-8u261-linux-x64.tar.gz /opt/

# 运行命令
RUN yum install wget
RUN tar -xzvf redis.tar.gz

# 虚拟映射，用于持久化存储数据。和挂载 -v 一样。映射地址可以通过 docker inspect ID 查看
VOLUME ["/data", "/var"]

# 暴露 8080、6379 两个端口，创建时按顺序映射端口 docker run -p 12345 -p 54321 image
# 12345:8080，54321:6379
EXPOSE 8080 6379

# 后续就可以用 NODE_VERSION 代替 7.2.0
ENV NODE_VERSION 7.2.0

# 指定工作目录，对RUN,CMD,ENTRYPOINT,COPY,ADD生效。如果不存在则会创建，也可以设置多次
WORKDIR /opt/software
```

PS：Dockerfile 的指令每执行一次都会在 docker 上新建一层。所以过多无意义的层，会造成镜像膨胀过大。命令越少越好。

<br>

### 编写 dockerfile

按需要进行构建，我按自己的需求搞一个，思路大约是：

1. 基础镜像、维护者信息、设置变量、复制需要的压缩包到容器
2. 在容器内执行命令，完成环境配置，暴露端口
3. 构建运行

先准备一个 jar 包，就一个接口，以后 jar 包也会自动生成。

```java
@RestController
public class IndexController {
    @RequestMapping(value = "index")
    public String index(){
        return "服务正在运行......";
    }
}
```

编写 dockerfile 文件：

```powershell
FROM openjdk:8-jdk-alpine
MAINTAINER shiva<qianwei4712@163.com>
COPY demo.jar /opt/
EXPOSE 8080
WORKDIR /opt
ENTRYPOINT ["java","-jar","/opt/demo.jar"]
```

<br>

### 构建运行

当前目录下文件：

```
[root@kwnswba51515gqdqpz software]# ll
total 16720
-rw-r--r-- 1 root root 17102555 Aug 30 09:45 demo.jar
-rw-r--r-- 1 root root      156 Aug 30 13:34 dockerfile
```

构建镜像：

```powershell
docker build -f dockerfile -t test/demo:1.0 .
```

可以在镜像列表中查看 `test/demo` : `1.0` 的镜像，然后启动：

```powershell
docker run -itd --name=testDemo -p 8081:8080 test/demo:1.0
```

测试访问，链接正常运行。

build 常用参数如下：

- **--build-arg=[] :**设置镜像创建时的变量；
- **-f :**指定要使用的Dockerfile路径；
- **--tag, -t:** 镜像的名字及标签，通常 name:tag 或者 name 格式；可以在一次构建中为一个镜像设置多个标签。
- **--rm :**设置镜像成功后删除中间容器；

<br>

## jenkins maven 插件

jenkins 先安装插件：[ Maven Integration](https://plugins.jenkins.io/maven-plugin)

首先，在全局安全配置中：

- 取消勾选 Agent → Controller Security，可以防止以下问题。这个问题在生成 Gitee WebHook 密码会出错。

```http
HTTP ERROR 403 No valid crumb was included in the request
```

- JDK 和 maven 配本地的，把自动安装取消，应该就知道填什么地址了

<br>

构建 maven项目，其他都不写了，和 jenkins npm build 一样，看以前的文章。

Goals and options可以填写下面命令。

```powershell
clean compile package -Dmaven.test.skip=true
```

清理、编译、打包，不执行测试用例，也不编译测试用例类。

然后执行构建，测试下。

在我的工程目录 `/root/.jenkins/workspace/maven test/` 下，已经生成了 target 文件夹。

<br>

## 全套构建测试

上面两步合在一起就行了。

1. 在本地编写 dockerfile，和代码一起上传 git
2. jenkins 拉代码，maven 自动打包
3. Post Steps 中写构建后 shell 命令，执行 docker 构建、启动运行



dockerfile 要根据实际路径和版本修改：

```powershell
FROM openjdk:8-jdk-alpine
MAINTAINER shiva<qianwei4712@163.com>
COPY target/demo-0.1.jar /opt/
EXPOSE 8080
WORKDIR /opt
ENTRYPOINT ["java","-jar","/opt/demo-0.1.jar"]
```

构建后 shell 命令也根据实际情况写：

```shell
docker build -f dockerfile -t test/demo:1.0 .
docker run -itd --name=testDemo -p 8081:8080 test/demo:1.0
```

最后测试，一切顺利。


<br>


## 参考文章

[【狂神说Java】Docker最新超详细版教程通俗易懂_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1og4y1q7M4?p=24)

[Dockerfile命令详解（超全版本） - 大周说测试 - 博客园 (cnblogs.com)](https://www.cnblogs.com/dazhoushuoceshi/p/7066041.html)

[docker构建jdk1.8镜像_面朝大海，春暖花开-CSDN博客](https://blog.csdn.net/u013887008/article/details/109008586)

[Docker 构建jdk8 镜像 - 蓝色土耳其 - 博客园 (cnblogs.com)](https://www.cnblogs.com/lansetuerqi/p/12551690.html)

[自动化部署（一）jenkins+github+maven+docker(通过Dockerfile脚本部署项目) - jack-jin - 博客园 (cnblogs.com)](https://www.cnblogs.com/jack-jin/articles/12291190.html)

[【docker】docker build :镜像_u010900754的专栏-CSDN博客](https://blog.csdn.net/u010900754/article/details/78526401)

[Dockerfile部署jar_fishinhouse的专栏-CSDN博客_dockerfile jar](https://blog.csdn.net/fishinhouse/article/details/90299375)

[jenkins实现maven项目自动化部署tomcat - 夜枫林 - 博客园 (cnblogs.com)](https://www.cnblogs.com/likaileek/p/9295878.html)

[Maven中-DskipTests和-Dmaven.test.skip=true的区别 - 飘飘雪 - 博客园 (cnblogs.com)](https://www.cnblogs.com/wangcp-2014/p/6211439.html)
