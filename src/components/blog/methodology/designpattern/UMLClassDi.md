> 全文转载自<a href="https://github.com/SouthBegonia/Computer-Course/blob/master/UML" target="_blank">https://github.com/SouthBegonia/Computer-Course/blob/master/UML/README.md</a>


**含义**：UML-Unified Modeling Language 统一建模语言，又称标准建模语言。是用来**对软件密集系统进行可视化建模的一种语言**

**主要模型**:
- 功能模型：从用户的角度展示系统的功能，包括用例图
- 动态模型：展现系统的内部行为，包括序列图、活动图、状态图
- 对象模型：采用对象、属性、操作、关联等概念展示系统的结构和基础，包括类图、对象图、包图

**本文内容**：对象模型中的**类图的基本绘法**。目的在于把**代码结构进行可视化**，例如各类设计模式

**博文地址**：<a href="https://www.cnblogs.com/SouthBegonia/p/12013396.html" target="_blank">UML类图绘制 - SouthBegonia's Blog</a>


**源码地址**：<a href="https://github.com/SouthBegonia/Computer-Course/tree/master/UML" target="_blank">UML图绘制 - SouthBegonia's Github</a>

## 绘图软件
<a href="https://www.processon.com" target="_blank">ProcessOn在线绘图网站</a>：

<img src="@/assets/blog/img/uml/1688704-20191209204652767-561156094.jpg"/>


## 类图绘制
**含义**：类图（class Diagrams），是描述系统中的类，以及各个**类之间的关系的静态视图**，常用于表示类、接口和它们之间的协作关系
**内容**：为清晰表示类之间关系，类图包含有**接口实现、继承、依赖、关联、聚合、组合等关系**

--------------------

### 类/接口的表示
- 类：单元格有3行（类名称、类属性、类方法），抽象类的类名称为斜体
- 接口：单元格有2行（接口名称、接口方法）

<img src="@/assets/blog/img/uml/1688704-20191209204715829-1868074343.png"/>

--------------------

### 继承关系/接口实现
- 继承：绘制方法为实线+空三角箭头
- 接口实现：绘制方法为虚线+空三角箭头

<img src="@/assets/blog/img/uml/1688704-20191209204733370-1244852688.png"/>

--------------------

### 依赖关系
- 依赖：是一种使用的关系，即一个类的实现需要另一个类的协助，例如动物类必须要生存，而生存的必需品是空气和水。绘制方法为虚线+虚线箭头

<img src="@/assets/blog/img/uml/1688704-20191209204743434-169262646.png"/>

--------------------

### 关联关系
- 关联：表示一种拥有的关系，它使一个类知道另一个类的属性和方法，例如企鹅的迁移习性与气候变化是息息相关的。绘制方法为实线+实线箭头

<img src="@/assets/blog/img/uml/1688704-20191209204753422-688792020.png"/>

--------------------

### 聚合/组合关系
聚合组合关系都隶属于关联关系，是整体与部分的关系。
- 聚合：表示弱的拥有关系，部分可以离开整体而单独存在，例如大雁群包含数只大雁，每一只大雁都可以独立于群体生存。绘制方法为空菱形+实线+实线箭头
- 组合：表示强的拥有关系，但部分不可离开整体单独存在，例如鸟必须有一双翅膀。绘制方法是实心菱形+实线+实线箭头

<img src="@/assets/blog/img/uml/1688704-20191209204804143-1031141048.png"/>


## 项目示例

**设计模式示例：**

<img src="@/assets/blog/img/uml/1688704-20191209204842660-2052024285.png"/>
<img src="@/assets/blog/img/uml/1688704-20191209204859758-1781956089.png"/>
<img src="@/assets/blog/img/uml/1688704-20191209204908922-420897722.png"/>
<img src="@/assets/blog/img/uml/1688704-20191209204925919-1671037308.png"/>


**网友示例：**
<a href="https://www.cnblogs.com/jiangds/p/6596595.html" target="_blank">UML图各种图总结 - 春风十里的晴</a>

<img src="@/assets/blog/img/uml/1688704-20191209204948731-1146864884.png"/>

<a href="https://www.cnblogs.com/lukefan/p/10048499.html" target="_blank">UML类图基本画法 - LukeFan</a>

<img src="@/assets/blog/img/uml/1688704-20191209205014934-556447057.jpg"/>


## 参考
- <a href="javascript:void(0);">大话设计模式 - 程杰</a>
- <a href="https://baike.baidu.com/item/UML%E7%B1%BB%E5%9B%BE/6842152?fr=aladdin" target="_blank">UML类图 - 百度百科</a>
- <a href="https://www.cnblogs.com/jiangds/p/6596595.html" target="_blank">UML图各种图总结 - 春风十里的晴</a>
- <a href="https://www.cnblogs.com/lukefan/p/10048499.html" target="_blank">UML类图基本画法 - LukeFan</a>
