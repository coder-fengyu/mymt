<template>
  <div class>
    <dl class="m-categroy">
      <dt>按拼音首字母选择：</dt>
      <dd v-for="item in list" :key="item">
        <a :href="'#city-'+item">{{ item }}</a>
      </dd>
    </dl>
    <dl v-for="item in block" :key="item.title" class="m-categroy-section">
      <dt :id="'city-'+item.title">{{ item.title }}</dt>
      <dd>
        <nuxt-link tag="span" to="/" v-for="c in item.city" :key="c">{{ c }}</nuxt-link>
      </dd>
    </dl>
  </div>
</template>

<script>
import pyjs from "js-pinyin";
export default {
  data() {
    return {
      list: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
      block: []
    };
  },
  async mounted() {
    let self = this;
    let blocks = [];
    let {
      status,
      data: { city }
    } = await self.$axios.get("/geo/city");
    // 对全国的城市做拼音处理并分类
    if (status === 200) {
      let p;
      let c;
      let d = {};
      // 拼音处理
      city.forEach(item => {
        // p 变量保存城市名拼音的首位
        p = pyjs
          .getFullChars(item.name)
          .toLocaleLowerCase()
          .slice(0, 1);
        // c 变量保存城市名拼音的首位的 ASCII 码。大写的A-Z是65-90，小写的a-z是97-122。我们通过ASCII码进行排序
        c = p.charCodeAt(0);
        if (c > 96 && c < 123) {
          if (!d[p]) {
            d[p] = [];
          }
          d[p].push(item.name);
        }
      });
      // 整理成我们想要的数据结构
      for (let [k, v] of Object.entries(d)) {
        blocks.push({
          title: k.toUpperCase(),
          city: v
        });
      }
      // 排序
      blocks.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
      self.block = blocks;
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/changeCity/categroy.scss";
</style>
