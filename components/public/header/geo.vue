<template>
  <div class="m-geo">
    <i class="el-icon-location"></i>
    {{ $store.state.geo.position.city}}
    <nuxt-link class="changeCity" to="/changeCity">切换城市</nuxt-link>[ 天津 香河 廊坊 ]
  </div>
</template>

<script>
export default {
  data() {
    return {
      name:''
    }
  },
};
</script>

<style lang="css">
</style>
