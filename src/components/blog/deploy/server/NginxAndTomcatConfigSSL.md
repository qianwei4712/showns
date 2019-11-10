## nginx+tomcat配置项目https加密



环境：阿里云Linux服务器 centos 7，已安装Nginx，在阿里云免费申请单域名证书

上一篇方法中安装的nginx，因为没有配置ssl，首先要对nginx进行修改。



### 为nginx配置ssl

1. **首先确定nginx安装位置**

   例如：我的安装在` /usr/local/nginx ` ，进入`sbin`目录，查看当前是否已配置

   ```shell
    ./usr/local/nginx/sbin/nginx -V
   ```

   结果如下图，若`configure arguments`已配置ssl，则跳过下面的步骤。

<img src="@/assets/blog/img/NginxAndTomcatConfigSSL2.png"/>
   

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

   ```shell
    ./usr/local/nginx/sbin/nginx -V
    ./usr/local/nginx/sbin/nginx -s start
   ```

   

### 在阿里云申请SSL证书

1. **购买免费证书**

   在阿里云直接搜索 SSL证书 ，购买证书，如下图。直接付款购买。

<img src="@/assets/blog/img/NginxAndTomcatConfigSSL1.png"/>
   

2. **申请证书，添加DNS解析**

   在证书管理页面，填写信息，域名只能是单域名（毕竟免费）。

   这里的DNS验证，如果域名在当前阿里云账号下，则可以选择自动DNS验证，阿里云帮你直接生成解析记录，若不在阿里云，就要去手动添加解析记录。点击验证，验证成功，提交审核，审核完后会生成证书文件

   解析方式如下图

<img src="@/assets/blog/img/NginxAndTomcatConfigSSL3.png"/>
<img src="@/assets/blog/img/NginxAndTomcatConfigSSL4.png"/>

3. **下载证书**

   证书文件生成大约需要10多分钟。

   生成后下载 Tomcat 和 Nginx 两种。

   证书生成后，解析可以删掉。



### 证书配置

1. **tomcat配置**

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
   
2. **nginx配置**

   这里也一样，完整的就不贴了，可以去我上一篇nginx安装里找完整的。

   把两个证书文件传到`nginx conf`的同级目录，修改`ssl_certificate`  和`ssl_certificate_key`

   把`server_name`后面的域名改为你的，ip端口换一下，然后重启nginx就完事。

   这个监听的是https 443端口，不影响http的正常使用。

   ```
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

