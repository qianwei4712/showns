

简介：

> 使用mysql自带的mysqldump数据备份工具编写sql导出命令；
>
> 使用linux crontabs定时任务，定时执行脚本命令；



其实很简单，我这里讲我的实现过程，讲的详细一点，所以可能会有点啰嗦。。。



#### 第一步：测试mysqldump命令

先把基本命令放上

```shell
/usr/bin/mysqldump -uroot -proot -h127.0.0.1 test > /opt/test.sql
```

首先，若出现

```shell
-bash: mysqldump: command not found
```

说明目录下没有 `mysqldump` 文件，可以执行以下命令生成链接文件 （`/usr/local/mysql` 为一般mysql安装路径）

```shell
ln -fs /usr/local/mysql/bin/mysqldump /usr/bin
```

然后，解释下基本命令的使用

`/usr/bin/mysqldump` ：上述生成的mysqldump链接文件，mysql自带工具

`-uroot`：-u + 数据库用户名

`-proot`：-p + 数据库密码

` -h127.0.0.1`：-h + 对应数据库ip；默认端口3306；若修改了端口加上如 `-P3307`，大写的 -P + 端口

`test `：需要导出的数据库名，个人比较喜欢分别导出，一次性导出恢复比较麻烦

`/opt/test.sql`：生成sql文件位置，随便写





#### 第二步：编写linux脚本

我直接在 `opt` 目录下创建一个 `backup.sh` 脚本

```shell
vi /opt/backup.sh
```

将要执行的命令保存好，多个数据库导出用多个命令；必须用 `; ` 分号结尾，不然生成文件出错

```
/usr/bin/mysqldump -uroot -proot -h127.0.0.1 test > /opt/test.sql；
/usr/bin/mysqldump -uroot -proot -h127.0.0.1 test2 > /opt/test2.sql；
```

保存好后可以执行下试试，若存在权限问题，记得设置下权限

```shell
chmod -R 777 backup.sh 
```

----

若出现以下错误

> mysqldump: Got error: 1449: The user specified as a definer ('xxxx'@'%') does not exist when using LOCK TABLES

xxxx这个用户也不存在，我查了下，是因为这个数据库是从库复制过来，带有原来的用户信息

> select *  FROM information_schema.views 

执行该sql语句可以看到数据库下有这个用户；

我的解决方法就是，直接创建这个不存在的用户，分配下权限，更新缓存，就行了

```sql
GRANT ALL ON *.* TO 'xxxx'@'%' IDENTIFIED BY 'password';
FLUSH PRIVILEGES;
```





#### 第三步：安装crontabs，设置定时任务

首先安装，启动

```shell
yum install crontabs；
service crond start；
```

然后设置需要执行的任务

```shell
crontab -e
```

例如每天凌晨3点执行备份命令，保存以下命令

```shell
0 3 * * *  /opt/backup.sh
```

然后，就结束了；



最后说下crond的参数解释，前面五位是定时执行的时间周期 说明如下：

> 第一个 * 表示分钟：取值范围 0-59
>
> 第二个 * 表示小时：取值范围0-23
>
> 第三个 * 表示天数：取值范围1-31
>
> 第四个 * 表示月份：取值范围1-12
>
> 第五个 * 表示每周：取值范围0-6



- 使用(-)可以划定范围

   	如：0 0-3 * * *  脚本        表示每天0-3点整执行脚本

- 使用(,)可以枚举时间

  ​	如: 0,15,30,45 * * * * 脚本    表示每个小时的0分，15分，45分，30分会执行脚本

- 使用(/)可以指定间隔

  ​	如：* */8 * * * 脚本         表示每8小时执行脚本

- 组合用法

  ​	0-20/10 * * * * 脚本        表示在前20分钟内每隔10分钟执行脚本
