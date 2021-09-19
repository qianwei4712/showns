> 这是一个由VUE开发的纯前端，个人资讯发布、工具收集类站点。使用饿了么element框架

**<a href="http://shiva.show" target="_blank">演示地址：shiva.show</a>**

起因是2019年工作中涉及到vue，所以自学了一段时间，顺便想找个东西练手，不知不觉中感觉成果对我一个后端来说还阔以，所以就打算长期维护。

本站绝大部分文章为原创，转载文章会在开头说明。

#### 作者的部署方式

> 作者部署在阿里云，vue路由使用了history模式，需要使用nginx代理，静态资源访问

1.  `npm run build` 打包，将 **dist** 目录下文件上传到 **/opt/shiva** 目录下
2. nginx配置如下：
```shell script
      server {
          listen       80;
          server_name  www.shiva.show shiva.show;
          access_log /usr/local/logs/nginx/nginx-access.log main;
  
          location / {
            root /opt/shiva/;   
            index index.html;
            try_files $uri $uri/ /index.html;
          }
      }
```

