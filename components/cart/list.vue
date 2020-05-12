<template>
  <el-table :data="cartData" style="width: 980px">
    <el-table-column label="项目" width="502" prop="name"></el-table-column>
    <el-table-column label="单价" width="132" prop="price"></el-table-column>
    <el-table-column label="数量" width="212" prop="count">
      <template slot-scope="scope">
        <el-input-number v-model="scope.row.count" :min="0" :max="9999"></el-input-number>
      </template>
    </el-table-column>
    <el-table-column label="总价">
      <template slot-scope="scope">{{ scope.row.price * scope.row.count }}</template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    cartData: {
      type: Array,
      default: []
    }
  }
};
</script>
