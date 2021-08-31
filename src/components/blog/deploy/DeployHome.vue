<template>
    <div class="deployHome">

      😀😁😂😃😄😅😆😉😊😋😎😍😘😗😙😚😇😐😑😶😏😣😥😮😯😪😫😴😌😛😜😝😒😓😔😕😲😷😖😞😟😤😢😭😦😧😨😬😰😱😳😵😡😠😈👿👹👺💀☠👻👽
      <br>
      <h3>2021</h3>
      <div class="margin-buttom">
        <el-checkbox border checked="checked" disabled>jenkins、docker</el-checkbox>
        <el-checkbox border checked="checked" disabled>gitlab</el-checkbox>
        <el-checkbox border>rabbit MQ</el-checkbox>
        <el-checkbox border>docker compose</el-checkbox>
        <el-checkbox border>activiti 工作流</el-checkbox>
        <el-checkbox border>JUC锁: 锁核心类 AQS</el-checkbox>
        <el-checkbox border>JUC集合: ConcurrentHashMap</el-checkbox>
      </div>
      <div class="margin-buttom">
        <el-checkbox border>JUC集合: CopyOnWriteArrayList</el-checkbox>
        <el-checkbox border>JUC集合: ConcurrentLinkedQueue</el-checkbox>
        <el-checkbox border>JUC集合: BlockingQueue</el-checkbox>
        <el-checkbox border>JUC线程池: FutureTask</el-checkbox>
        <el-checkbox border>JUC线程池: ThreadPoolExecutor</el-checkbox>
      </div>
      <div class="margin-buttom">
        <el-checkbox border>JUC线程池: ScheduledThreadPoolExecutor</el-checkbox>
        <el-checkbox border>JUC工具类: Exchanger详解</el-checkbox>
        <el-checkbox border>Java并发: ThreadLocal详解</el-checkbox>
        <el-checkbox border>开发安全 - 注入攻击详解</el-checkbox>
        <el-checkbox border>开发安全 - 渗透性测试</el-checkbox>
      </div>

      <h3>2022</h3>
      <div class="margin-buttom">
        <el-checkbox border>redis 全套</el-checkbox>
        <el-checkbox border>分库分表</el-checkbox>
      </div>

    </div>
</template>

<script>
    export default {
        name: "deployHome",
        data(){
            return {
            }
        }
    }
</script>

<style scoped>
  .margin-buttom {
    margin-bottom: 10px;
  }
</style>
