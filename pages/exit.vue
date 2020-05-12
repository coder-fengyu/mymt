<template>
  <div class />
</template>

<script>
export default {
  layout: "blank",
  middleware: async ctx => {
    // 点退出这个动作后应该就回到首页，这只是页面跳转。剩余的还是需要接口来实现
    let { status, data } = await ctx.$axios.get("/users/exit");
    if (status === 200 && data && data.code === 0) {
      window.location.href = "/";
    }
  }
};
</script>
