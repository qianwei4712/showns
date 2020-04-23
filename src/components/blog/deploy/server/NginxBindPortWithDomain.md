<div class="catalog">

- [nginx需要的环境安装](#huanjin)
- [Nginx安装](#anzhuang)
    - [检查防火墙](#firewall)
- [Nginx配置](#peizhi)
- [为Nginx配置SSL](#sslpeizhi)
- [在阿里云申请SSL证书](#sslgoumai)
- [证书配置](#sslanzhaung)
    - [tomcat配置](#tomcat)
    - [Nginx配置](#nginx)


</div>

> 摘要：背景环境为，在一台CentOS阿里云服务器下，有多个不同端口tomcat项目,并需要为这些项目添加SSL加密证书。
>
> ps：其实这原本是两篇，前后隔了2个月，后来我就放在一起了

### <span id="huanjin">nginx需要的环境安装</span>
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

<br>

### <span id="anzhuang">nginx安装</span>
首先下载nginx，<a href="http://nginx.org/en/download.html" target="_blank">http://nginx.org/en/download.html</a>

我下载的版本是1.12.1。似乎是看到了Stable version，俗称稳定版，所以下载了这个版本。

下面的具体安装步骤，我使用FlashFXP和XShell。

我自己在/usr/local/下建了一个文件夹nginx。然后把下载的nginx-1.12.1.tar.gz放到文件夹下面，然后
```
tar -zxvf nginx-1.12.1.tar.gz
``` 
解压后进入解压出的文件夹

```
cd nginx-1.12.1
```
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
```
./nginx
```
不出意外的话你就能直接通过ip访问到nginx页面了。

如果不行先检查nginx是否启动，再检查防火墙。

#### <span id="firewall">检查防火墙是否开放80端口</span>
```
vi /etc/sysconfig/iptables
```
看看是否存在以下行，不存在的话加进去

```
A INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT
```
为方便小白，多讲几句废话

按一下s，进行编辑。编辑完后ctrl+c，然后敲：wq，回车保存退出

重启防火墙

centos 6以前 `service iptables restart`<br>
centos 7以后 `systemctl restart firewalld.service`<br>

#### 检查阿里云防火墙是否开启
阿里云端口需要自己开放，这里简单写一下

实例--管理--本实例安全组--配置规则--允许公网入方向80端口，优先级1-100

到这里，应该nginx都安装完成了。

<br>

### <span id="peizhi">nginx配置</span>
这里自己配置2个tomcat，比如端口为8081，8082。就不详细讲了,大胆假设你已经跑起来了。

然后配置nginx.conf。这里按照我的目录为例

```
cd  /usr/local/nginx/conf
```
下面有一个nginx.conf文件。就是最后的敌人。

把#注释的去掉点，看起来清楚点。

然后，直接贴出文件好了，这里也没东西好讲的。

我只在里面加了2个upstream,和2个server，其它的一行没动。

编辑完之后别忘了重新进入/nginx/sbin，使新的配置文件生效

```
./nginx -s reload
```
ok!敲完这一行，恭喜你练成了盖世武功。

这里的ip我用127.0.0.1代理，2个域名分别用 百度 和 谷歌 代替。

这里例如www.baidu.cn   baidu.cn空格分开表示两个访问地址都能控制。。

百度谷歌两个项目页面分别在8081和8082两个tomcat下。

```nginx

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

<br>


### <span id="sslpeizhi">为nginx配置ssl</span>

1. **首先确定nginx安装位置**

   例如：我的安装在` /usr/local/nginx ` ，进入`sbin`目录，查看当前是否已配置

   ```shell
    ./usr/local/nginx/sbin/nginx -V
   ```

   结果如下图，若`configure arguments`已配置ssl，则跳过下面的步骤。

<img src="@/assets/blog/img/others/NginxAndTomcatConfigSSL2.png"/>
   

2. **configure配置，重新编译**

   进入安装文件的根目录，不是nginx根目录，在下载的压缩文件解压后的根目录

   下面命令行中`/usr/local/nginx`则是安装目录。

   ```shell
   ./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module
   ```

   然后编译，不需要`make install`否则会覆盖原有配置

   ```shell
   make 
   ```

   

3. **关闭nginx，复制配置文件**

   首先关闭nginx

   ```shell
   ./usr/local/nginx/sbin/nginx -s stop
   ```

   然后将编译生成的文件，拷贝到安装文件夹

   ```shell
   cp objs/nginx /usr/local/nginx/sbin/
   ```

   这个时候可能会提示是否覆盖，按`y`然后回车

   

4. **查看配置，重启**

   最后查看配置。启动nginx

   ```
    ./usr/local/nginx/sbin/nginx -V
    ./usr/local/nginx/sbin/nginx -s start
   ```

<br>

### <span id="sslgoumai">在阿里云申请SSL证书</span>

1. **购买免费证书**

   在阿里云直接搜索 SSL证书 ，购买证书，如下图。直接付款购买。

<img src="@/assets/blog/img/others/NginxAndTomcatConfigSSL1.png"/>
   

2. **申请证书，添加DNS解析**

   在证书管理页面，填写信息，域名只能是单域名（毕竟免费）。

   这里的DNS验证，如果域名在当前阿里云账号下，则可以选择自动DNS验证，阿里云帮你直接生成解析记录，若不在阿里云，就要去手动添加解析记录。点击验证，验证成功，提交审核，审核完后会生成证书文件

   解析方式如下图

<img src="@/assets/blog/img/others/NginxAndTomcatConfigSSL3.png"/>
<img src="@/assets/blog/img/others/NginxAndTomcatConfigSSL4.png"/>

3. **下载证书**

   证书文件生成大约需要10多分钟。

   生成后下载 Tomcat 和 Nginx 两种。

   证书生成后，解析可以删掉。


### <span id="sslanzhaung">证书配置</span>

1. **<span id="tomcat">tomcat配置</span>**

   都是技术人员，就不多讲了。

   https默认的443端口在nginx进行监听，所以，这里使用了8443端口，加了`URIEncoding`防止乱码

   `keystoreFile`和`keystorePass`两个属性是需要配置的，把文件传到服务器，然后指定目录就行。

   记得别忘防火墙开放端口

   ```xml
   <Connector URIEncoding="UTF-8" port="8443" protocol="HTTP/1.1" 
              SSLEnabled="true" scheme="https" secure="true"
              keystoreFile="cert/cert-xxxxxxxx_XXXXXXXXXX.pfx"
              keystoreType="PKCS12"  keystorePass="6h7t7R0B"
              clientAuth="false"  SSLProtocol="TLSv1+TLSv1.1+TLSv1.2"
     ciphers="TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA256"/>
   ```
   
2. **<span id="nginx">nginx配置</span>**

   这里也一样，完整的就不贴了，可以去我上一篇nginx安装里找完整的。

   把两个证书文件传到`nginx conf`的同级目录，修改`ssl_certificate`  和`ssl_certificate_key`

   把`server_name`后面的域名改为你的，ip端口换一下，然后重启nginx就完事。

   这个监听的是https 443端口，不影响http的正常使用。

   ```nginx
   upstream httpsPro {
           server 47.121.65.85:8443;
       }
   
   server {
   	listen 443;
   	server_name www.baidu.com;
   	ssl on;
   	
   	ssl_certificate   cert-xxxxxxxxx_XXXXXXXXXXXX.crt;
   	ssl_certificate_key  cert-xxxxxxxxx_XXXXXXXXXXXX.key;
   	ssl_session_timeout 5m;
   	ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
   	ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
   	ssl_prefer_server_ciphers on;
   	
   	location / {
   		proxy_pass https://httpsPro;
   		proxy_ignore_headers   Expires Cache-Control;
   		proxy_set_header   Host    $host;
   		proxy_set_header   X-Real-IP   $remote_addr;
   		proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
   		proxy_set_header        X-Forwarded-Proto $scheme;
   	}
       }	
   ```
