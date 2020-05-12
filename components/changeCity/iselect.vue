<template>
  <div class="m-iselect">
    <span class="name">按省份选择:</span>
    <el-select v-model="pvalue" placeholder="省份">
      <el-option v-for="item in province" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <!-- 选省份的时候能改变 city 变量的内容（通过watch监听pvalue的变化），只有 city 变量有内容，城市下拉框才能选（disable属性） -->
    <el-select v-model="cvalue" :disabled="!city.length" @change='handleSelect' placeholder="城市">
      <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;直接搜索：
    <el-autocomplete
      v-model="input"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入城市中文或拼音"
      @select="handleSelect"
    ></el-autocomplete>
  </div>
</template>

<script>
import _ from "lodash";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      province: [],
      pvalue: "",
      city: [],
      cvalue: "",
      input: "",
      cities: []
    };
  },
  // 选省份的时候能改变 city 变量的内容，是通过监听 pvalue 变量实现的
  // 通过传进来的 pvalue 的值得到这个省份的城市并放进 city 变量中
  watch: {
    pvalue: async function(newPvalue) {
      let self = this;
      let {
        status,
        data: { city }
      } = await self.$axios.get(`/geo/province/${newPvalue}`);
      if (status === 200) {
        self.city = city.map(item => {
          return {
            value: item.id,
            label: item.name
          };
        });
        self.cvalue = "";
      }
    }
  },
  // 在页面mounted的时候就把所有省份信息放到 province 变量中
  mounted: async function() {
    let self = this;
    let {
      status,
      data: { province }
    } = await self.$axios.get("/geo/province");
    if (status === 200) {
      self.province = province.map(item => {
        return {
          value: item.id,
          label: item.name
        };
      });
    }
  },
  methods: {
    // element UI 提供的，当用户输入的时候会出发这个方法。用lodash的debounce做了延时处理
    // 在这个方法写搜索匹配。这一这里的 cities 要按element ui的要求去写，写成对象数组，对象的value才是具体城市名字
    querySearchAsync: _.debounce(async function(query, cb) {
      let self = this;
      if (self.cities.length) {
        cb(self.cities.filter(item => item.value.indexOf(query) > -1));
      } else {
        let {
          status,
          data: { city }
        } = await self.$axios.get("/geo/city");
        if (status === 200) {
          self.cities = city.map(item => {
            return {
              value: item.name
            };
          });
          cb(self.cities.filter(item => item.value.indexOf(query) > -1));
        } else {
          cb([]);
        }
      }
    }, 200),
    // element UI 提供的，当用户选中的时候会出发这个方法。用lodash的debounce做了延时处理
    // 点击后应该是 更改所在城市（Vuex中）+ 页面跳转。由于数据结构方面的问题，这个更改当前所在城市先忽略不计。
    // 并且似乎是每一次刷新页面都会按ip地址去得到当前地址更新到Vuex中
    handleSelect: function(item) {
      console.log(this.$store.state.geo.position);
      // console.log(this.$store.state.geo.position.city);
      // this.setPosition(item.value);

      // window.location.href = "/";
      // this.$router.push("/");
    },
    ...mapMutations("geo", ["setPosition"])
  }
};
</script>

<style lang="scss">
@import "@/assets/css/changeCity/iselect.scss";
</style>