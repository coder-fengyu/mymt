<template>
  <div class="m-products-list">
    <dl>
      <dd
        v-for="(item,index) in nav"
        :key="item.name"
        :class="[item.name,index===currindex?'s-nav-active':'']"
        @click="navSelect(index)"
      >{{ item.txt }}</dd>
    </dl>
    <ul>
      <Item
        v-for="(item,idx) in list"
        :key="idx"
        :meta="item"/>
    </ul>
  </div>
</template>

<script>
import Item from './product.vue'
export default {
  components: {
    Item
  },
  props: {
    list: {
      type:Array,
      default(){
        return []
      }
    }
  },
  data() {
    return {
      currindex:0,
      nav: [
        {
          name: 's-default',
          txt: '智能排序',
          acitve: true
        }, {
          name: 's-price',
          txt: '价格最低',
          active: false
        }, {
          name: 's-visit',
          txt: '人气最高',
          active: false
        }, {
          name: 's-comment',
          txt: '评价最高',
          active: false
        }
      ]
    }
  },
  async asyncData({app}) {
    let { data } = await app.$axios.get('searchList')
    return { items: data.list }
  },
  methods: {
    navSelect: function (index) {
      this.currindex=index
      console.log(this.list);
      if(index ===1){
        this.list.sort((a, b) => a.price - b.price);
      }
    }
  }
}
</script>
