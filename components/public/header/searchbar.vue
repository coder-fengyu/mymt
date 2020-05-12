<template>
  <div class="search-panel">
    <el-row class="m-header-searchbar">
      <el-col :span="3" class="left">
        <nuxt-link to="/">
          <img src="//s0.meituan.net/bs/fe-web-meituan/fa5f0f0/img/logo.png" alt="美团" />
        </nuxt-link>
      </el-col>
      <el-col :span="15" class="center">
        <div class="wrapper">
          <!-- 用双向数据绑定的v-model指令绑定input框的value在 search 变量上 -->
          <!-- 失去焦点的时候会触发blur事件，input框在输入/修改的时候会触发input事件 -->
          <el-input placeholder="搜索商家和地点" v-model="search" @focus="focus" @blur="blur" @input="input"/>
          <button class="el-button el-button--primary"><i class="el-icon-search" /></button>
          <!-- 这里是focus后搜索框出现的部分和输入后出现的推荐部分 -->
           <dl v-if="isHotPlace" class="hotPlace">
            <dt>热门搜索</dt>
            <dd v-for="(item, index) in $store.state.home.hotPlace.slice(0,4)" :key="index">
              <a :href="'/products?keyword='+encodeURIComponent(item.name)">{{ item.name }}</a>
            </dd>
          </dl>
          <dl v-if="isSearchList" class="searchList">
            <dd v-for="(item, index) in searchList" :key="index">
              <a :href="'/products?keyword='+encodeURIComponent(item.name)">{{ item.name }}</a>
            </dd>
          </dl>
        </div>
        <!-- 这里是搜索框正下方的推荐部分 -->
        <p class="suggest">
          <a
            v-for="(item,idx) in $store.state.home.hotPlace.slice(0,5)"
            :key="idx"
            :href="'/products?keyword='+encodeURIComponent(item.name)"
          >{{ item.name }}</a>
        </p>
        <ul class="nav">
          <li>
            <nuxt-link to="/" class="takeout">美团</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="movie">猫眼电影</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="hotel">美团酒店</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="apartment">民宿/公寓</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="business">商家入驻</nuxt-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="6" class="right"></el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  data() {
    return {
      search: "",
      isFocus: false,
      hotPlace: [],
      searchList: []
    };
  },
  computed: {
    isHotPlace: function() {
      return this.isFocus && !this.search;
    },
    isSearchList: function() {
      return this.isFocus && this.search;
    }
  },
  methods: {
    focus: function() {
      this.isFocus = true;
    },
    blur: function() {
      // 如果一失去焦点就 this.isFocus = false ，则在点击推荐内容的同时推荐内容会消失，页面无法跳转
      let self = this;
      setTimeout(function() {
        self.isFocus = false;
      }, 200);
    },
    // 因为input事件是每输入一个字母就会，所以我们这里可以借助 lodash的debounce方法 实现延时
    // 但是实际上我发现不延时效果更好，就取消了
    input: async function() {
      let self = this;
      let city = self.$store.state.geo.position.city.replace("市", "");
      self.searchList = [];
      let {
        status,
        data: { top }
      } = await self.$axios.get("/search/top", {//相当于/search/top?input=self.search&city=city
        params: {
          input: self.search,
          city
        }
      });
      console.log(top);
      
      self.searchList = top.slice(0, 10);
    }
  }
}
</script>

<style lang="css">
</style>
