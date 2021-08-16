<div class="catalog">

- [概述](#t1)
- [mysqldump命令介绍](#t2)
  - [基础命令尝试](#t21)
  - [命令进阶介绍](#t22)
  - [异地备份](#t23)
  - [增量备份](#t24)
- [编写linux脚本](#t3)
- [定时任务crontabs](#t4)
- [参考文章](#te)

</div>



### <span id="t1">概述</span>

其实主要手续就两个：

1. **使用mysql自带的mysqldump数据备份工具编写sql导出命令;**

2. **使用linux crontabs定时任务，定时执行脚本命令;**


其实很简单，这里讲我的实现过程和遇到的问题，讲的详细一点，所以可能会有点啰嗦。。。

<br/>


### <span id="t2">mysqldump命令介绍</span>


#### <span id="t21">基础命令尝试</span>


比如下面这行，作用是使用 `mysqldump` 导出 本地 `mysql` 的 `test` 数据库到 `/opt/test.sql` 文件（自动生成）。

```shell
/usr/bin/mysqldump -uroot -proot -h127.0.0.1 test > /opt/test.sql;
```

若出现命令不存在

```shell
-bash: mysqldump: command not found
```

说明目录下没有 `mysqldump` 文件，可以执行以下命令生成链接文件 （`/usr/local/mysql` 为一般mysql安装路径，请根据实际安装位置更换）

```shell
ln -fs /usr/local/mysql/bin/mysqldump /usr/bin
```

然后，解释下上面命令的各项分解：

- `/usr/bin/mysqldump` ：上述生成的mysqldump链接文件，mysql自带工具
- `-uroot`：-u + 数据库用户名
- `-proot`：-p + 数据库密码
- `-h127.0.0.1`：-h + 对应数据库ip；默认端口3306；若修改了端口加上如 `-P3307`，大写的 -P + 端口
- `test `：需要导出的数据库名，个人比较喜欢分别导出，一次性导出恢复比较麻烦
- `/opt/test.sql`：生成sql文件位置，随便写

<br/>

#### <span id="t22">命令进阶介绍</span>

mysqldump 命令语法：

1. **Mysqldump [option] db_name [tb1_name …]** ,      备份库中某些表

2. **Mysqldump [option] --databases db_name1 db_name2...** ,      备份指定数据库

3. **Mysqldump [option] --all-databases** ,       备份整个数据库

4. **Mysqldump [option] db_name tb_name --where="条件语句"** ,      指定条件语句备份

然后，实际情况下一般都会追加日期版本，并进行压缩，例如：

```shell
/usr/bin/mysqldump -uroot -proot -h127.0.0.1 test | gzip > /opt/test-$(date + %Y%m%d).tal.gz;
```


<br/>

#### <span id="t23">异地备份</span>

原本以为异地备份应该和本地备份一样，嗖嗖嗖就弄完了。。。。

<div style="text-align: center"> 

![avatar](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/%E7%84%B6%E8%80%8C.jpg)

</div>

网上一查资料，居然不是一行命令可以搞定的，基本方式就是以下

- ssh互信，然后 scp 或者 rsync 发送文件
- 在脚本内写入服务器 ip 用户密码，然后建立通道传输，参考：
<a href="http://blog.sina.com.cn/s/blog_6727f9ee0100xnit.html" target="_blank">http://blog.sina.com.cn/s/blog_6727f9ee0100xnit.html</a>

想了想，决定搞一搞服务器互信。。。。

> scp是secure copy的简写，用于在Linux下进行远程拷贝文件的命令， scp传输是加密的，可能会稍微影响一下速度。
>
> 另外，scp还非常不占资源，不会提高多少系统负荷，在这一点上，rsync就远远不及它了。虽然 rsync比scp会快一点，但当小文件众多的情况下，rsync会导致硬盘I/O非常高，而scp基本不影响系统正常使用

<div style="text-align: center"> 

![avatar](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/unc/%e6%80%bb%e5%8f%b8%e6%89%b6%e5%a2%99.png)

</div>


先配置下 SSH 互信，若mysql本机为客户机，远程为服务机（假设ip : 192.168.9.9）：

1. 在服务机上以 root 登陆，更改 *ssh* 配置文件 `/etc/ssh/sshd_config`

```shell
RSAAuthentication yes #启用rsa认证
PubkeyAuthentication yes #启用公钥私钥配对认证方式
AuthorizedKeysFile .ssh/authorized_keys #公钥文件路径
```

2. 重启服务机 ssh 服务

```shell
systemctl restart sshd 
```

3. 登陆客户机创建公钥私钥，一路回车就行了，然后会在 `/root/.ssh` 下生成文件：id_rsa、id_rsa.pub

```shell
ssh-keygen -t rsa
```

4. 把 id_rsa.pub 发送到服务端机器上

```shell
ssh-copy-id -i /root/.ssh/id_rsa.pub 192.168.9.9
```

这个时候要输入一次服务机的root密码，然后发送成功

5. 验证尝试登陆

```shell
ssh 192.168.9.9
```

然后现在建立互信后，可以使用 SCP 命令进行文件传输。

- 上传到服务器上： **scp /path/filename username@servername:/path**  
- 从服务器上下载： **scp username@servername:/path/filename /path**
- 上传多个文件： **scp /path/filename1 /path/filename2 username@servername:/path**  
- 递归上传整个文件夹： **scp -r /path username@servername:/path** 

反正就是，`scp ... to ...` 这个意思。

现在测试下命令：

```shell
scp /opt/test.sql root@192.168.9.9:/opt
```

当然，这当然不可能出问题。

<div style="text-align: center"> 

![avatar](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/%e9%9d%a2%e6%97%a0%e8%a1%a8%e6%83%85.jpg)

</div>



<br/>

#### <span id="t24">增量备份</span>

增量备份也没搞过，继续百度。。。。。

<div style="text-align: center"> 

![avatar](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/%E5%A6%88%E8%80%B6%E9%82%A3%E6%88%91%E5%87%89%E4%BA%86%E5%95%8A.jpg)

</div>


<a href="https://www.cnblogs.com/kevingrace/p/6114979.html" target="_blank">https://www.cnblogs.com/kevingrace/p/6114979.html</a>

根据上面这篇博客的介绍，增量备份前提是开启了 mysql-binlog 日志功能，其实就是备份操作日志。。。。

binlog一般都是百分百开启的，不然。。。最近的比特币勒索这么猖獗，万一中招了那就麻烦了。。。。

增量备份，这里就不搞了，我们目前都是每日全备的。。。。。有兴趣的参考下上面的博客



<br/>

### <span id="t3">编写linux脚本</span>

我直接在 `opt` 目录下创建一个 `backup.sh` 脚本

```shell
vi /opt/backup.sh
```

**本地备份脚本**

首先是本地备份，简单点直接导出sql就行了。个人比较喜欢分数据库多次导出，因为想要用哪个就可以直接拿哪个。

将要执行的命令保存好，多个数据库导出用多个命令；必须用 `;` 分号结尾，不然生成文件出错

```
/usr/bin/mysqldump -uroot -proot -h127.0.0.1 test | gzip > /opt/test.sql.gz;
/usr/bin/mysqldump -uroot -proot -h127.0.0.1 test2 | gzip > /opt/test2.sql.gz;
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

**异地备份脚本**

然后整合下以上所有命令，

```shell
#!/bin/bash

#异地服务器ip
HOST=192.168.9.9
#备份日期
DATE=$(date +%Y%m%d)

/usr/bin/mysqldump -uroot -proot -h127.0.0.1 test | gzip > /opt/test-"$DATE".sql.gz;
scp /opt/test-"$DATE".sql.gz root@"$HOST":/opt;
```

一个比较简单的本地异地备份脚本命令就这要了。多个文件的话，根据 SCP 命令上传文件夹或者批量上传稍微改下就行了。

<br/>


### <span id="t4">定时任务crontabs</span>


首先安装crontabs，启动

```shell
yum install crontabs;
service crond start;
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


<div style="text-align: center"> 

![avatar](http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/%E9%9B%B7%E5%86%9B%EF%BC%9A%E6%98%AF%E4%B8%8D%E6%98%AF%E7%A2%89%E5%A0%A1%E4%BA%86.jpg)

</div>

最后补充下crond的参数使用，前面五位是定时执行的时间周期，说明如下：

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


### <span id="te">参考文章</span>

<a href="https://www.cnblogs.com/machangwei-8/p/10352759.html" target="_blank">https://www.cnblogs.com/machangwei-8/p/10352759.html</a>

<a href="https://blog.csdn.net/u013144287/article/details/75093181" target="_blank">https://blog.csdn.net/u013144287/article/details/75093181</a>

<a href="https://www.cnblogs.com/hushaojun/p/4636002.html" target="_blank">https://www.cnblogs.com/hushaojun/p/4636002.html</a>

<a href="https://www.cnblogs.com/jytx/p/7272860.html" target="_blank">https://www.cnblogs.com/jytx/p/7272860.html</a>

<a href="https://blog.csdn.net/baidu_31405631/article/details/93190135" target="_blank">https://blog.csdn.net/baidu_31405631/article/details/93190135</a>

<a href="https://www.cnblogs.com/kevingrace/p/6114979.html" target="_blank">https://www.cnblogs.com/kevingrace/p/6114979.html</a>



