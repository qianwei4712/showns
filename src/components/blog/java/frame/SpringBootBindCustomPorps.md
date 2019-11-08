SpringBoot在使用自定义配置文件注解时，遇到了无法绑定的问题

使用的是yml配置文件（实在是不好用，不知道为啥spring还推荐这个）

```
aliyunoss:
  endpoint: http://oss-cn-hangzhou.aliyuncs.com
  accessKeyId: weasdajdask
  accessKeySecret: sdkasmdasjni
```



### 错误示范

```
@Component
public class AliyunOssUpload {

	// 节点名
	@Value("${aliyunoss.endpoint}")
	private String endpoint;
    
    public static void main(String[] args) {
		AliyunOssUpload aliyunOssUpload = new AliyunOssUpload();
		System.out.println(aliyunOssUpload.endpoint);
	}
	
}
```

### 错误原因

**虽然添加了`@Component`注解，将类交给了 Spring ，但是使用时确实用了new来创建对象。**

在需要使用的地方注入该类，即可正常使用。

```
@Controller
@RequestMapping("Image")
public class ImageController {
	
	@Autowired
	private AliyunOssUpload aliyunOssUpload;

	@RequestMapping("uploadPage")
	public void uploadPage() {
 	     System.out.println(aliyunOssUpload.endpoint);
	}
}
```





