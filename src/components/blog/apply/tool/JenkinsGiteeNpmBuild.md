### 概述

因为本次项目涉及接口调试过多，所以弄个持续集成（CI）测试环境。

本次测试使用 Gitee + jenkins 。打包部分先用 npm 做个 build 测试。

预备环境：JDK 、node、git

<br>

先说一个坑，原本图省事，直接通过 docker 安装了 `jenkinsci/blueocean` 镜像来安装。

刚开始确实美滋滋，后来到拉代码打包发现，在容器里还怎么打包测试。

所以重新开始。

<br>

### jenkins 安装

完整手册看：[Jenkins 用户手册](https://www.jenkins.io/zh/doc/)

jenkins 下载目录选择自己需要的 war 包：[Index of /war-stable](http://mirrors.jenkins.io/war-stable/)

上传、设置端口启动：

```shell
java -jar jenkins.war --httpPort=10221
```

<br>

#### 初始化

浏览器输入 http://IP:10221 打开，进入 jenkins 初始化：

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ%E6%88%AA%E5%9B%BE20210828145013.png)

密码在控制台有输出，也不用去文件里找了：

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ%E6%88%AA%E5%9B%BE20210828144958.png)

jenkins 官方插件下载速度非常慢，先选 **`选择插件来安装`** ，再选 **`无`** ，先跳过后续再装。

也可以使用推荐插件，不过要等个10分钟左右，还会出错。

然后是创建管理员账号，这个自由发挥。 jenkins 有一个默认 admin 账号，密码就是刚刚控制台那个。

<br>

#### Gitee 配置

在菜单 Manage jenkins，点击 Manage Plugins，选择 Available 页签。

这里先安装个汉化、再装个 Gitee 插件。

首先在系统配置中，添加 Gitee 令牌：

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ%E6%88%AA%E5%9B%BE20210828181652.png)

在 Gitee 创建一个私人令牌。

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ%E6%88%AA%E5%9B%BE20210828181802.png)



<br>

#### 任务创建

创建任务，构建一个自由风格的软件项目，主要配置如下：

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ%E6%88%AA%E5%9B%BE20210828210951.png)

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ%E6%88%AA%E5%9B%BE20210828182920.png)

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ%E6%88%AA%E5%9B%BE20210828182945.png)



**WebHook 密码和链接需要填写到 Gitee 的仓库配置中**

![](http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ%E6%88%AA%E5%9B%BE20210828211240.png)



最后在 **构建、执行shell命令** 填写命令：

```shell
npm install --registry=https://registry.npm.taobao.org
npm run build
cp -rf dist/* /opt/html/showns/
```

最后看看测试下就完了。



<br>

### 参考文章

[CentOS7安装Jenkins和卸载_寻找09之夏的博客-CSDN博客_centos jenkins 卸载](https://blog.csdn.net/qq_34272964/article/details/93474659)

[centos7 Jenkins 安装与卸载_IT小学生-CSDN博客_centos7 jenkins卸载](https://blog.csdn.net/u011477914/article/details/88170074)

[Jenkins + Gitee(码云) 实现代码自动化构建_寻找09之夏的博客-CSDN博客](https://blog.csdn.net/qq_34272964/article/details/93747652)

[Jenkins 插件 - Gitee.com](https://gitee.com/help/articles/4193#article-header4)

[Jenkins自动化部署入门详细教程 - java老兵 - 博客园 (cnblogs.com)](https://www.cnblogs.com/wfd360/p/11314697.html)
