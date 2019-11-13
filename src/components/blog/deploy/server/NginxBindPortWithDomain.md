摘要：背景环境为，在一台阿里云服务器下，有多个tomcat项目，每个tomcat项目配置了不同端口号。每个项目有自己的独立域名，然而域名只能解析到ip,无法解析到端口，就需要用nginx。

>今日实现该功能，参考了以下两篇博客：<br>
<a href="http://www.cnblogs.com/fengli9998/p/6112447.html" target="_blank">http://www.cnblogs.com/fengli9998/p/6112447.html</a><br>
<a href="http://tiomg.org/blog?ti_uuid=5af77f95f08540d48e6cb83ebd94575a" target="_blank">http://tiomg.org/blog?ti_uuid=5af77f95f08540d48e6cb83ebd94575a</a><br>


# 步骤1：nginx需要的环境安装
按顺序敲入下面四个指令：
```
yum install gcc-c++
yum install -y pcre pcre-devel
yum install -y zlib zlib-devel
yum install -y openssl openssl-devel
```
这四个需要安装的原因分别是：

> nginx是C语言开发，建议在linux上运行，本教程使用Centos6.5作为安装环境。安装nginx需要先将官网下载的源码进行编译，编译依赖gcc环境，如果没有gcc环境，需要安装gcc。<br>

>PCRE(Perl Compatible Regular Expressions)是一个Perl库，包括 perl 兼容的正则表达式库。nginx的http模块使用pcre来解析正则表达式，所以需要在linux上安装pcre库。<br>

>zlib库提供了很多种压缩和解压缩的方式，nginx使用zlib对http包的内容进行gzip，所以需要在linux上安装zlib库。<br>

>OpenSSL 是一个强大的安全套接字层密码库，囊括主要的密码算法、常用的密钥和证书封装管理功能及SSL协议，并提供丰富的应用程序供测试或其它目的使用。nginx不仅支持http协议，还支持https（即在ssl协议上传输http），所以需要在linux安装openssl库。

#步骤2：nginx安装
首先下载nginx，http://nginx.org/en/download.html

我下载的版本是1.12.1。似乎是看到了Stable version，俗称稳定版，所以下载了这个版本。

下面的具体安装步骤，我使用FlashFXP和XShell。

我自己在/usr/local/下建了一个文件夹nginx。然后把下载的nginx-1.12.1.tar.gz放到文件夹下面，然后

`tar -zxvf nginx-1.12.1.tar.gz` <br>
解压后进入解压出的文件夹

`cd nginx-1.12.1` <br>
接下来要做的事情，就是敲指令，反正看不懂它在做什么。没报问题就行了

按顺序键入
```
./configure
make
make  install
```
没有出问题的话。会生成些文件。这里有个小情况，我在完成后，在nginx的同级目录下自动生成了一个相同名字的文件。里面就是刚刚生成的文件，配置的指令集都在里面，然而不懂为啥不会合并，反正成功了就好。

然后进入/nginx/sbin，这个cd指令就不写了，我不知道你们生成文件的位置，找找吧，就在local应该下面

启动nginx

`./nginx` <br>
不出意外的话你就能直接通过ip访问到nginx页面了。图片我没截图，网上找了个，就是这个样子。

> 可惜我知道肯定会有很多问题。
## 2-1.检查防火墙是否开放80端口
`vi /etc/sysconfig/iptables`<br>
看看是否存在以下行，不存在的话加进去

`A INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT`<br>
为方便小白，多讲几句废话

按一下s，进行编辑。编辑完后ctrl+c，然后敲：wq，回车保存退出

重启防火墙

centos 6以前 `service iptables restart`<br>
centos 7以后 `systemctl restart firewalld.service`<br>

## 2-2.检查阿里云防火墙是否开启
阿里云端口需要自己开放，这里简单写一下<br>
实例--管理--本实例安全组--配置规则--允许公网入方向80端口，优先级1-100<br>
到这里，应该nginx都安装完成了。

# 步骤3：进行nginx配置
这里自己配置2个tomcat，比如端口为8081，8082。就不详细讲了,大胆假设你已经跑起来了。

然后配置nginx.conf。这里按照我的目录为例

`cd  /usr/local/nginx/conf`<br>
下面有一个nginx.conf文件。就是最后的敌人。<br>
把#注释的去掉点，看起来清楚点。<br>
然后，算了，直接贴出文件好了，这里也没东西好讲的。<br>
我只在里面加了2个upstream,和2个server，其它的一行没动。<br>
编辑完之后别忘了重新进入/nginx/sbin，使新的配置文件生效

`./nginx -s reload`<br>
ok!敲完这一行，恭喜你练成了盖世武功。
这里的ip我用127.0.0.1代理，2个域名分别用 百度 和 谷歌 代替。

这里例如www.baidu.cn   baidu.cn空格分开表示两个访问地址都能控制。。<br>
百度谷歌两个项目页面分别在8081和8082两个tomcat下，emmmmmm。还有我域名是cn的。强迫症非要com的别打我。-_-!!

```

#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    upstream baidu{
        server 127.0.0.1:8081;
    }
	
    upstream google {
        server 127.0.0.1:8082;
    }

    server {
        listen       80;
        server_name  www.baidu.cn baidu.cn;
        location / {
          proxy_pass http://baidu;
          proxy_set_header   Host    $host;
          proxy_set_header   X-Real-IP   $remote_addr;
          proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

    server {
        listen       80;
        server_name  www.google.cn google.cn;
        location / {
          proxy_pass http://google;
          proxy_set_header   Host    $host;
          proxy_set_header   X-Real-IP   $remote_addr;
          proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }
 
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

    }

}
```


