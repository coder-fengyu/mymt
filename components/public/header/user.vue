<template>
  <div class="m-user">
    <template v-if="user">
      欢迎您，
      <span class="username">{{user}}</span>
      [
      <nuxt-link to="/exit">退出</nuxt-link>]
    </template>
    <template v-else>
      <nuxt-link to="/login" class="login">立即登录</nuxt-link>
      <nuxt-link to="/register" class="register">注册</nuxt-link>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: ""
    };
  },
  // 可以用这种方法（这种异步的方法会使得页面刚考试是没有用户名后来变了一下），也可以放在Vuex中。似乎放在Vuex中更好？
   async mounted() {
    const {
      status,
      data: { user }
    } = await this.$axios.get("/users/getUser");
    if (status === 200) {
      // 编码转换（之前对中文昵称做过编码转换）
      this.user = decodeURIComponent(user);
    }
  }
};
</script>

<style lang="css">
</style>
