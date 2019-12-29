> 这是一个由VUE开发的纯前端，个人资讯发布、工具收集类站点。使用饿了么element框架

起因是工作中涉及到vue，所以自学了一段时间，顺便想找个东西练手，不知不觉中感觉成果还能令自己满意，所以就打算长期维护。

本站绝大部分文章为原创，转载文章会在开头说明。

#### 作者的部署方式

> 作者部署在阿里云，tomcat容器下
> vue路由使用了history模式，需要使用nginx代理

1.  `npm run build` 打包，将 **dist** 目录下文件上传到 **tomcat的webapps/ROOT** 目录下
2. nginx配置如下：
```shell script
      location / {
          root /tomcat路径/webapps/ROOT/;   
          index index.html;
          try_files $uri $uri/ /index.html;
      }
```

