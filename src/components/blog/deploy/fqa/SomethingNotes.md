## mysql设置用户权限
```
grant all privileges on *.* to 'user'@'%' identified by 'password' with grant option;
FLUSH PRIVILEGES;
```
