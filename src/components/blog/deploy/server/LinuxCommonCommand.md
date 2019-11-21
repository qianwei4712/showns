[history](#history)、[last](#last)  、 [pwd](#pwd)  、 [cat](#cat)  、 [tail](#tail) 、  [cd](#cd)  、 [ls](#ls)

[tail](#tail)、[grep ](#grep )  、 [kill](#kill)  、 [ps](#ps) 、  [ping](#ping) 、  [telnet](#telnet) 、  [netstat](#netstat)

[df](#df)、[du](#du)、[chmod](#chmod)、 [chown](#chown)  
<br>
<br>
本文只列举常用参数，常用方法（就是作者用到过的命令，高级或生僻命令不介绍）

<br>

## <span id="#pwd">pwd </span>

**pwd命令**以绝对路径的方式显示用户当前工作目录。

命令将当前目录的全路径名称（从根目录）写入标准输出。
<br>


## <span id="#cd">cd</span>

**cd命令**用来切换工作目录至[dirname](http://man.linuxde.net/dirname)。 

其中dirName表示法可为绝对路径或相对路径。若目录名称省略，则变换至使用者的home directory(也就是刚[login](http://man.linuxde.net/login)时所在的目录)。

另外，`~`也表示为home directory的意思，`.`则是表示目前所在的目录，`..`则表示目前目录位置的上一层目录。 
<br>


## <span id="#ls">ls</span>

**ls命令**用来显示目标列表，在Linux中是使用率较高的命令，常用于显示当前文件下的文件列表。

ls命令的输出信息可以进行彩色加亮显示，以分区不同类型的文件。 

```
-a：显示所有档案及目录（ls内定将档案名或目录名称为“.”的视为影藏，不会列出）；
-A：显示除影藏文件“.”和“..”以外的所有文件列表；
-C：多列显示输出结果。这是默认选项；
-l：与“-C”选项功能相反，所有输出信息用单列格式输出，不输出为多列；
-F：在每个输出项后追加文件的类型标识符，具体含义：“*”表示具有可执行权限的普通文件，“/”表示目录，“@”表示符号链接，“|”表示命令管道FIFO，“=”表示sockets套接字。当文件为普通文件时，不输出任何标识符；
-b：将文件中的不可输出的字符以反斜线“”加字符编码的方式输出；
-c：与“-lt”选项连用时，按照文件状态时间排序输出目录内容，排序的依据是文件的索引节点中的ctime字段。与“-l”选项连用时，则排序的一句是文件的状态改变时间；
-d：仅显示目录名，而不显示目录下的内容列表。显示符号链接文件本身，而不显示其所指向的目录列表；
-f：此参数的效果和同时指定“aU”参数相同，并关闭“lst”参数的效果；
-i：显示文件索引节点号（inode）。一个索引节点代表一个文件；
--file-type：与“-F”选项的功能相同，但是不显示“*”；
-k：以KB（千字节）为单位显示文件大小；
-l：以长格式显示目录下的内容列表。输出的信息从左到右依次包括文件名，文件类型、权限模式、硬连接数、所有者、组、文件大小和文件的最后修改时间等；
-m：用“,”号区隔每个文件和目录的名称；
-n：以用户识别码和群组识别码替代其名称；
-r：以文件名反序排列并输出目录内容列表；
-s：显示文件和目录的大小，以区块为单位；
-t：用文件和目录的更改时间排序；
-L：如果遇到性质为符号链接的文件或目录，直接列出该链接所指向的原始文件或目录；
-R：递归处理，将指定目录下的所有文件及子目录一并处理；
--full-time：列出完整的日期与时间；
--color[=WHEN]：使用不同的颜色高亮显示不同类型的。
```
<br>


## <span id="#tail">tail</span>

**tail命令**用于输入文件中的尾部内容。

tail命令默认在屏幕上显示指定文件的末尾10行。如果给定的文件不止一个，则在显示的每个文件前面加一个文件名标题。如果没有指定文件或者文件名为“-”，则读取标准输入。 

持续输出某文件

> tail  -f   xxx.out

输出某文件最后100行

> tail  -100  xxx.out

<br>

## <span id="#grep ">grep</span>

**grep**（全面搜索正则表达式并把行打印出来）是一种强大的文本搜索工具，它能使用正则表达式搜索文本，并把匹配的行打印出来。 

作者一般不会单独使用此命令，都是和其他命令搭配使用。

<br>

## <span id="#ps">ps</span>

**ps命令**用于报告当前系统的进程状态。

可以搭配[kill](http://man.linuxde.net/kill)指令随时中断、删除不必要的程序。

ps命令是最基本同时也是非常强大的进程查看命令，使用该命令可以确定有哪些进程正在运行和运行的状态、进程是否结束、进程有没有僵死、哪些进程占用了过多的资源等等，总之大部分信息都是可以通过执行该命令得到的。 

**可用选项**

```
-a：显示所有终端机下执行的程序，除了阶段作业领导者之外。
a：显示现行终端机下的所有程序，包括其他用户的程序。
-A：显示所有程序。
-c：显示CLS和PRI栏位。
c：列出程序时，显示每个程序真正的指令名称，而不包含路径，选项或常驻服务的标示。
-C<指令名称>：指定执行指令的名称，并列出该指令的程序的状况。
-d：显示所有程序，但不包括阶段作业领导者的程序。
-e：此选项的效果和指定"A"选项相同。
e：列出程序时，显示每个程序所使用的环境变量。
-f：显示UID,PPIP,C与STIME栏位。
f：用ASCII字符显示树状结构，表达程序间的相互关系。
-g<群组名称>：此选项的效果和指定"-G"选项相同，当亦能使用阶段作业领导者的名称来指定。
g：显示现行终端机下的所有程序，包括群组领导者的程序。
-G<群组识别码>：列出属于该群组的程序的状况，也可使用群组名称来指定。
h：不显示标题列。
-H：显示树状结构，表示程序间的相互关系。
-j或j：采用工作控制的格式显示程序状况。
-l或l：采用详细的格式来显示程序状况。
L：列出栏位的相关信息。
-m或m：显示所有的执行绪。
n：以数字来表示USER和WCHAN栏位。
-N：显示所有的程序，除了执行ps指令终端机下的程序之外。
-p<程序识别码>：指定程序识别码，并列出该程序的状况。
p<程序识别码>：此选项的效果和指定"-p"选项相同，只在列表格式方面稍有差异。
r：只列出现行终端机正在执行中的程序。
-s<阶段作业>：指定阶段作业的程序识别码，并列出隶属该阶段作业的程序的状况。
s：采用程序信号的格式显示程序状况。
S：列出程序时，包括已中断的子程序资料。
-t<终端机编号>：指定终端机编号，并列出属于该终端机的程序的状况。
t<终端机编号>：此选项的效果和指定"-t"选项相同，只在列表格式方面稍有差异。
-T：显示现行终端机下的所有程序。
-u<用户识别码>：此选项的效果和指定"-U"选项相同。
u：以用户为主的格式来显示程序状况。
-U<用户识别码>：列出属于该用户的程序的状况，也可使用用户名称来指定。
U<用户名称>：列出属于该用户的程序的状况。
v：采用虚拟内存的格式显示程序状况。
-V或V：显示版本信息。
-w或w：采用宽阔的格式来显示程序状况。　
x：显示所有程序，不以终端机来区分。
X：采用旧式的Linux i386登陆格式显示程序状况。
-y：配合选项"-l"使用时，不显示F(flag)栏位，并以RSS栏位取代ADDR栏位　。
-<程序识别码>：此选项的效果和指定"p"选项相同。
--cols<每列字符数>：设置每列的最大字符数。
--columns<每列字符数>：此选项的效果和指定"--cols"选项相同。
--cumulative：此选项的效果和指定"S"选项相同。
--deselect：此选项的效果和指定"-N"选项相同。
--forest：此选项的效果和指定"f"选项相同。
--headers：重复显示标题列。
--help：在线帮助。
--info：显示排错信息。
--lines<显示列数>：设置显示画面的列数。
--no-headers：此选项的效果和指定"h"选项相同，只在列表格式方面稍有差异。
--group<群组名称>：此选项的效果和指定"-G"选项相同。
--Group<群组识别码>：此选项的效果和指定"-G"选项相同。
--pid<程序识别码>：此选项的效果和指定"-p"选项相同。
--rows<显示列数>：此选项的效果和指定"--lines"选项相同。
--sid<阶段作业>：此选项的效果和指定"-s"选项相同。
--tty<终端机编号>：此选项的效果和指定"-t"选项相同。
--user<用户名称>：此选项的效果和指定"-U"选项相同。
--User<用户识别码>：此选项的效果和指定"-U"选项相同。
--version：此选项的效果和指定"-V"选项相同。
--widty<每列字符数>：此选项的效果和指定"-cols"选项相同。
```

作者常用的方法为

> ps  -ef | grep 进程名

ps -ef搜索所有进程，并列出UID、PPIP等，grep进行正则匹配 
<br>


## <span id="#kill">kill</span>

**kill命令**用来删除执行中的程序或工作。kill可将指定的信息送至程序。预设的信息为SIGTERM(15),可将指定程序终止。若仍无法终止该程序，可使用SIGKILL(9)信息尝试强制删除程序。程序或工作的编号可利用[ps](http://man.linuxde.net/ps)指令或job指令查看。 

**可用选项**

```
-a：当处理当前进程时，不限制命令名和进程号的对应关系；
-l <信息编号>：若不加<信息编号>选项，则-l参数会列出全部的信息名称；
-p：指定kill 命令只打印相关进程的进程号，而不发送任何信号；
-s <信息名称或编号>：指定要送出的信息；
-u：指定用户。
```

只有第9种信号(SIGKILL)才可以无条件终止进程，其他信号进程都有权利忽略，**下面是常用的信号：** 

```
HUP     1    终端断线
INT     2    中断（同 Ctrl + C）
QUIT    3    退出（同 Ctrl + \）
TERM   15    终止
KILL    9    强制终止
CONT   18    继续（与STOP相反， fg/bg命令）
STOP   19    暂停（同 Ctrl + Z）
```

通常命令为：

> kill   -9   进程号

<br>

##  <span id="#netstat">netstat</span>

**netstat命令**用来打印Linux中网络系统的状态信息，可让你得知整个Linux系统的网络情况。

常用使用方式：

> netstat -nat|grep -i "80"|wc -l      #统计80端口连接数 
>
> netstat -a      #列出所有端口
>
> netstat -ap    #列出在端口上运行的程序

<br>

##  <span id="#ping">ping</span>

**ping命令**用来测试主机之间网络的连通性。

执行ping指令会使用ICMP传输协议，发出要求回应的信息，若远端主机的网络功能没有问题，就会回应该信息，因而得知该主机运作正常，直接ping ip即可。 

<br>

## <span id="#telnet">telnet</span>

**telnet命令**用于登录远程主机，对远程主机进行管理。

telnet因为采用明文传送报文，安全性不好，很多Linux服务器都不开放telnet服务，而改用更安全的[ssh](http://man.linuxde.net/ssh)方式了。但仍然有很多别的系统可能采用了telnet方式来提供远程登录。

常用来测试端口是否畅通：

> telent   ip   端口

<br>

## <span id="#history">history</span>

 **history命令**单独使用输出1000条历史命令。

最近30条命令

> hsitory  30

<br>

## <span id="#last">last</span>

**last命令**用于显示用户最近登录信息。结构为登陆用户 - 终端 - 登陆ip - 时间。 

最近10条登陆信息

> last  -10          

<br>

## <span id="#cat">cat</span>

**cat命令**连接文件并打印到标准输出设备上，cat经常用来显示文件的内容 。

注意：当文件较大时，文本在屏幕上迅速闪过（滚屏），用户往往看不清所显示的内容。因此，一般用[more](http://man.linuxde.net/more)等命令分屏显示。

为了控制滚屏，可以按Ctrl+S键，停止滚屏；按Ctrl+Q键可以恢复滚屏。按Ctrl+C（中断）键可以终止该命令的执行，并且返回Shell提示符状态。 

<br>

## <span id="#df">df</span>

**df命令**用于显示磁盘分区上的可使用的磁盘空间。默认显示单位为KB。可以利用该命令来获取硬盘被占用了多少空间，目前还剩下多少空间等信息。 

常用命令：

> df   -lh

<br>

## <span id="#du">du</span>

**du命令**也是查看使用空间的，但是与[df](http://man.linuxde.net/df)命令不同的是Linux du命令是对文件和目录磁盘使用的空间的查看，还是和df命令有一些区别的。 

常用命令：只显示当前目录下文件夹大小总和，不遍历子目录

> du  -lh  --max-depth=1

<br>

## <span id="#chmod">chmod</span>

**chmod命令**用来变更文件或目录的权限。

在UNIX系统家族里，文件或目录权限的控制分别以读取、写入、执行3种一般权限来区分，另有3种特殊权限可供运用。用户可以使用chmod指令去变更文件与目录的权限，设置方式采用文字或数字代号皆可。符号连接的权限无法变更，如果用户对符号连接修改权限，其改变会作用在被连接的原始文件。 

权限范围的表示法如下：

`u` User，即文件或目录的拥有者；
`g` Group，即文件或目录的所属群组；
`o` Other，除了文件或目录拥有者或所属群组之外，其他用户皆属于这个范围；
`a` All，即全部的用户，包含拥有者，所属群组以及其他用户；
`r` 读取权限，数字代号为“4”;
`w` 写入权限，数字代号为“2”；
`x` 执行或切换权限，数字代号为“1”；
`-` 不具任何权限，数字代号为“0”；
`s` 特殊功能说明：变更文件或目录的权限。

<br>

**可用选项**

```
-c或——changes：效果类似“-v”参数，但仅回报更改的部分；
-f或--quiet或——silent：不显示错误信息；
-R或——recursive：递归处理，将指令目录下的所有文件及子目录一并处理；
-v或——verbose：显示指令执行过程；
--reference=<参考文件或目录>：把指定文件或目录的所属群组全部设成和参考文件或目录的所属群组相同；
<权限范围>+<权限设置>：开启权限范围的文件或目录的该选项权限设置；
<权限范围>-<权限设置>：关闭权限范围的文件或目录的该选项权限设置；
<权限范围>=<权限设置>：指定权限范围的文件或目录的该选项权限设置；
```





## <span id="#chown">chown</span>

**chown命令**改变某个文件或目录的所有者和所属的组，该命令可以向某个用户授权，使该用户变成指定文件的所有者或者改变文件所属的组。

用户可以是用户或者是用户D，用户组可以是组名或组[id](http://man.linuxde.net/id)。文件名可以使由空格分开的文件列表，在文件名中可以包含通配符。 

只有文件主和超级用户才可以便用该命令。 



**可用选项**

```
-c或——changes：效果类似“-v”参数，但仅回报更改的部分；
-f或--quite或——silent：不显示错误信息；
-h或--no-dereference：只对符号连接的文件作修改，而不更改其他任何相关文件；
-R或——recursive：递归处理，将指定目录下的所有文件及子目录一并处理；
-v或——version：显示指令执行过程；
--dereference：效果和“-h”参数相同；
--help：在线帮助；
--reference=<参考文件或目录>：把指定文件或目录的拥有者与所属群组全部设成和参考文件或目录的拥有者与所属群组相同；
--version：显示版本信息。
```



实例：将目录`/usr/opt`及其下面的所有文件、子目录的文件主改成 shiva： 

> chown    -R    shiva    /user/opt



----



其他常用但是命令

```
crontab    #定时器命令
mkdir      #创建文件夹
rm         #删除
cp         #复制
mv         #移动
ln         #创建链接
find       #查找文件
whereis    #查找二进制程序
rpm        #rpm软件管理工具
yum        #下载安装命令
wget       #下载URL
```




