<div class="catalog">

- [安装docker](#t1)
- [更改国内镜像源](#t2)
- [镜像操作](#t3)
- [容器操作](#t4)
- [docker hub](#t5)
- [常用命令](#t6)
- [参考文章](#te)

</div>

### <span id="t1">安装docker</span>

1. 先安装依赖，设置软件源

```shell
yum update
yum install -y yum-utils device-mapper-persistent-data lvm2
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

2. 下载安装docker

```shell
yum clean all
yum makecache fast
yum -y install docker-ce
```

3. 启动docker服务，设置开机启动，查看版本

```shell
systemctl start docker
systemctl enable docker
docker version
```

当看到 `Client` 和 `Server` 两部分时，说明安装成功。

<br>



### <span id="t2">更改国内镜像源</span>

docker 镜像搜索可以前往：<a href="https://hub.docker.com/" target="_blank">https://hub.docker.com/</a>

但是这个镜像仓库和 maven 仓库一样下载较慢，先配置为国内镜像，修改配置：

```shell
 vim /etc/docker/daemon.json
```

改为如下配置：

```shell
{
  "registry-mirrors": [
     "https://registry.docker-cn.com",
     "http://hub-mirror.c.163.com",
     "https://docker.mirrors.ustc.edu.cn",
     "http://hub-mirror.c.163.com"
   ]
}

```

然后，加载Docker配置 ，重启Docker服务

```shell
systemctl daemon-reload
systemctl restart docker.service
```

<br>



### <span id="t3">镜像操作</span>


| **操作** | **命令**                                     | **举例**                            | **说明**                                                     |
| -------- | -------------------------------------------- | ----------------------------------- | ------------------------------------------------------------ |
| 检索     | docker search 关键字                         | docker search tomcat                | 去docker hub上检索镜像的详细信息，如镜像的Tag                |
| 拉取     | docker pull 镜像名:tag                       | docker pull tomcat                  | :tag是可选的，tag表示版本标签，多为软件的版本，默认是latest  |
| 列表     | docker images [-a]                           | docker images                       | 查看所有本地镜像                                             |
| 删除     | docker rmi 镜像id <br> docker rmi 镜像名:tag | docker rmi 7b8b75c878d4             | 删除id为7b8b75c878d4的本地镜像                               |
| 创建镜像 | docker commit  [容器id]                      | docker commit -a shiva 9aa80af66c55 | **-a：**作者名；**-c：** 使用Dockerfile指令来创建镜像 ；**-m：** 提交信息； **-p ：** 在commit时，将容器暂停。 |

<br>





### <span id="t4">容器操作</span>

| **操作**                             | **命令**                                                     |
| ------------------------------------ | ------------------------------------------------------------ |
| 根据镜像创建并启动容器(没有端口映射) | docker run --name mytomcat1 -d tomcat:latest                 |
| 查看运行中的容器                     | docker ps                                                    |
| 查看所有的容器                       | docker ps -a                                                 |
| 停止运行中的容器                     | docker stop 容器id或容器名                                   |
| 启动容器                             | docker start 容器id或容器名                                  |
| 删除容器                             | docker rm 容器id或容器名                                     |
| 根据镜像创建并启动做了端口映射的容器 | docker run --name mytomcat2 -d -p 8888:8080 tomcat <br>#说明：-d后台运行<br>-p将主机的端口映射到容器的一个端口。 主机端口：容器内部的端口 |
| 进入容器内部                         | docker exec -it 容器id或容器名 /bin/bash <br> #说明：-it参数：容器的 Shell 映射到当前的 Shell，然后你在本机窗口输入的命令，就会传入容器。<br>  /bin/bash：容器启动以后，内部第一个执行的命令。这里是启动 Bash，保证用户可以使用 Shell。 |
| 查看容器的日志                       | docker logs 容器名或者容器id                                 |



容器操作常用的其实也就2个命令，创建容器具体参数如下：

**创建容器**

> 语法：docker run [OPTIONS] IMAGE [COMMAND][ARG...]
>
> 例如：docker run  -itd --name ds1 -p 44400:22  -p 44403:8081 8ffb01469aba

**docker run 参数如下：**

- -t: 为容器重新分配一个伪输入终端，通常与 -i 同时使用
- -i: 以交互模式运行容器，通常与 -t 同时使用
- -d: 后台运行容器，并返回容器ID
- --name: 为容器指定一个名称
- -p: 端口映射，格式为：主机(宿主)端口:容器端口
- -v: 挂载宿主机文件夹，格式为： 宿主机文件夹：容器文件夹
- --link:  添加链接到另一个容器
- -m: 设置容器使用内存最大值；



**进入容器**

> 语法：  docker  exec  -it  容器id或容器名  /bin/bash 

`docker attach 容器id或容器名` 也能进入容器，不过退出后，也随之停止容器。

<br>

### <span id="t5">docker hub</span>

创建一个仓库，因为我这里只是上传一些基础镜像，弄个基础 public 的仓库就行。

![image-20210923192909298](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/image-20210923192909298.png)


```shell script
# 登陆，输入账号密码
docker login
# 先将容器提交成镜像，格式为：docker commit <exiting-Container> <hub-user>/<repo-name>[:<tag>]
docker commit -a "shiva<qianwei4712@163.com>" 58ee1d5fb9aa openjdk8-yz:latest
# 重新打 tag，可以重命名，格式为：docker tag <existing-image> <hub-user>/<repo-name>[:<tag>]
docker tag openjdk8-yz:latest shivashow/yz:jdk8
# 将打完 tag 的镜像上传，格式：docker push <hub-user>/<repo-name>:<tag>
docker push shivashow/yz:jdk8
# 上传成功的镜像可以拉去了
docker pull shivashow/yz:jdk8
```


![image-20210923194352816](https://gitee.com/pic_bed_of_shiva/picture/raw/master/images/image-20210923194352816.png)




<br>

### <span id="t6">常用命令</span>

- 批量删除 none 镜像 ： `docker images | grep none | awk '{print $3}' | xargs docker rmi`



<br>



### <span id="te">参考文章</span>

<a href="https://baijiahao.baidu.com/s?id=1626633654476933953" target="_blank">https://baijiahao.baidu.com/s?id=1626633654476933953</a>

<a href="https://blog.csdn.net/liqun_super/article/details/88304094" target="_blank">https://blog.csdn.net/liqun_super/article/details/88304094</a>

<a href="https://www.cnblogs.com/wzz2500/p/11437820.html" target="_blank">https://www.cnblogs.com/wzz2500/p/11437820.html</a>

<a href="https://www.cnblogs.com/luoposhanchenpingan/p/11285392.html" target="_blank">https://www.cnblogs.com/luoposhanchenpingan/p/11285392.html</a>

<a href="https://www.cnblogs.com/scajy/p/11934144.html" target="_blank">https://www.cnblogs.com/scajy/p/11934144.html</a>

<a href="https://www.cnblogs.com/zlgxzswjy/p/10560058.html" target="_blank">https://www.cnblogs.com/zlgxzswjy/p/10560058.html</a>

<a href="https://my.oschina.net/lwenhao/blog/2086037" target="_blank">https://my.oschina.net/lwenhao/blog/2086037</a>

<a href="https://www.cnblogs.com/ruanqj/p/7374544.html" target="_blank">https://www.cnblogs.com/ruanqj/p/7374544.html</a>











