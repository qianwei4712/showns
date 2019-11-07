<template>
    <div class="test">
      <h1>{{title}}</h1>
      <h2>{{user.firstName}}</h2>
      <h2>{{user.lastName}}</h2>

      <p v-text="user.firstName"></p>

      <p v-if="showName">555555555</p>

      <p v-if="!showName">5656</p>
      <p v-else>8888</p>

      <div  v-for="o in items">{{o.title}}</div>

      <!--点击事件-->
      <button v-on:click="clickFunc(this)">事件测试</button>

      <!--键盘事件-->
      <input type="text" v-on:keyup="keyupFunc" v-on:keyup.enter="enterFunc">

      <hr>

      <!--computed计算属性-->
      <label>firstname</label>
      <input type="text" v-model="user.firstName">

      <label>lastname</label>
      <input type="text" v-model="user.lastName">
      <br>
      <h3>{{fullName}}</h3>

      <hr>

<!--      props属性-->
      <h2>{{msg}}</h2>


    </div>
</template>

<script>
    export default {
        name: "Test",
        props:{
          msg:{
              type:String,
              default:"默认这些文字"
          }
        },
        data(){//数据
            return{
                title: "测试方法",
                user:{
                    firstName: "测试对象1",
                    lastName: "测试对象属性22"
                },
                showName: true,
                items:[
                    {title: "项目1"},
                    {title: "项目2"},
                    {title: "项目3"}
                ]
            }
        },
        methods:{//方法
            clickFunc:function (obj) {
                console.log("点击事件")
            },
            keyupFunc:function () {
                console.log("键盘事件")
            },
            enterFunc:function () {
                console.log("点击enter才会出发")
            }
        },
        computed:{//计算属性
            fullName:function () {
                return this.user.firstName + "   " + this.user.lastName;
            }
        },
        created:function() {
            console.log("测试方法");
            this.$http.get("http://jsonplaceholder.typicode.com/users").then(function (res) {
                console.log(res.data);
                this.items = res.data
            })
        }
    }
</script>

<style scoped>

</style>
