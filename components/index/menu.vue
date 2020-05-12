<template>
  <div class="m-menu">
    <dl
      class="nav"
      @mouseleave="mouseleave">
      <dt><strong>全部分类</strong> </dt>
      <dd
        v-for="(item, index) in $store.state.home.menu"
        :key="index" @mouseenter="enter">
        <!-- 这个菜单传递的数据用type来表示前面的小图标更加便捷，而不是我本来想的传个图标的url -->
        <i :class="item.type"/>{{item.name}}<span class="arrow"></span>
      </dd>
    </dl>
    <div
      v-if="kind"
      class="detail"
      @mouseenter="sover"
      @mouseleave="sout">
      <template v-for="(item, index) in curdetail.child">
        <h4 :key="index">{{ item.title }}</h4>
        <span v-for="v in item.child" :key="v">{{ v }}</span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      kind: '',
      // 这个menu只是练习用，用了Vuex的数据后这个变量没用了
      // menu: [{
      //   type: 'food',
      //   name: '美食',
      //   child:[{
      //     title:'美食',
      //     child:['代金券','甜点饮品','火锅','自助餐','小吃快餐']
      //   }]
      // }, {
      //   type: 'takeout',
      //   name: '外卖',
      //   child:[{
      //     title:'外卖',
      //     child:['美团外卖']
      //   }]
      // }, {
      //   type: 'hotel',
      //   name: '酒店',
      //   child:[{
      //     title:'酒店星级',
      //     child:['经济型','舒适/三星','高档/四星','豪华/五星']
      //   }, {
      //     title:'常住酒店',
      //     child:['7天','希尔顿','汉庭']
      //   }]
      // }]
    }
  },
  computed: {
    curdetail: function() {
      return this.$store.state.home.menu.filter(item => item.type===this.kind)[0]
    }
  },
  methods:{
    mouseleave: function() {
      let self = this;
      // 这里用设置timer的方法，让鼠标移动到右框的时候就clearTimeout让右框不消失
      self._timer = setTimeout(function(){
        self.kind = ''
      },150)
    },
    enter(e) {
      this.kind = e.target.querySelector('i').className
    },
    sover() {
      clearTimeout(this._timer)
    },
    sout() {
      this.kind = ''
    }
  }
}
</script>

<style>

</style>
