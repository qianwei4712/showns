<template>
    <!--  根组件，只能有一个-->
    <div id="app">
      <Blog/>
    </div>
</template>

<script>

  import Blog from "./components/blog/Blog";

    export default {
        name: 'app',
        components: {
          Blog
        }
    }
</script>


<style>

</style>
