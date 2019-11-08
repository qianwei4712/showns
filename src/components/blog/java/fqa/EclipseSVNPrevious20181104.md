
> 在Eclipse中无法链接到svn，出现Previous operation has not finished; run 'cleanup' if it was interrupted异常

1. 下载一个sqlite3.exe
2. 将sqlite3.exe放到本项目的.svn同级目录下（.svn默认是隐藏，让.svn文件夹显示查出来（工具->文件夹选项->显示隐藏文件））
3. 进入cmd窗口，运行sqlite3 .svn/wc.db "select * from work_queue"（查询是否有队列）
4. sqlite3 .svn/wc.db "delete from work_queue"（删除队列）
5. sqlite3 .svn/wc.db "select * from work_queue"（查看是否删除成功）
6. 可以直接同步了
