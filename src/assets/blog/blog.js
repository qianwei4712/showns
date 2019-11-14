export default {
    install(Vue, $event) {
        //切换窗口
        Vue.prototype.handleChangeView = function ($event) {
            const component = event.currentTarget.className.split(" ")[0];
            this.currentView = component;
            this.activeIndex = component;
            this.title = event.currentTarget.firstElementChild.innerHTML;
        };
        //header内点击子菜单
        Vue.prototype.afterMounted = function () {
            const typeName = this.$route.params.typeName;//获取参数params typeName
            if (typeName !== 'HomePage'){
                const domLi = document.getElementById(typeName);
                const component = domLi.className;
                this.currentView = component;
                this.activeIndex = component;
                this.title = domLi.firstElementChild.innerHTML;
            }
        };
    }
}
