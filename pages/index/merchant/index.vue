<template>
  <section>
    <el-page-header content="商家列表"/>
    <br>
    <el-form inline ref="form" :model="form">
      <el-form-item prop="keywords">
        <el-input v-model="form.keywords" placeholder="商家名称、负责人和电话"></el-input>
      </el-form-item>
      <el-form-item prop="address">
        <RegionPicker province="河南省" city="郑州市" :area.sync="form.address"></RegionPicker>
      </el-form-item>
      <el-form-item prop="merchantType">
        <el-select v-model='form.merchantType' placeholder='商户类型'>
          <el-option v-for="(label,index) in MERCHANTTYPE" :value='label' :key="index" :label="label"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getList">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button @click="$router.push('/merchant/0')">新增</el-button>
      </el-form-item>
    </el-form>
    <br>
    <el-table
      :data="list.records"
      border
      style="width: 100%">
      <el-table-column type="index"/>
      <el-table-column prop="merchantLevel" label="商家级别"/>
      <el-table-column prop="merchantName" label="商家名称"/>
      <el-table-column prop="merchantType" label="商户类型"/>
      <el-table-column prop="address" label="商户地址"/>
      <el-table-column prop="addressDetails" label="详细地址"/>
      <el-table-column prop="bus" label="乘车路线"/>
      <el-table-column prop="contact" label="负责人"/>
      <el-table-column prop="phone" label="联系电话"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="$router.push('/merchant/'+scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <div style="text-align: right">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="getList"
        :total="list.total"
        :current-page.sync="form.pageNo">
      </el-pagination>
    </div>
  </section>
</template>

<script>
    import {MERCHANTLEVEL, MERCHANTTYPE} from 'static/type'
    import RegionPicker from "../../../components/RegionPicker";
    export default {
        name: "merchant",
        middleware: 'authenticated',
        components: {RegionPicker},
        data() {
            return {
                form: {pageNo: 1}, MERCHANTLEVEL: MERCHANTLEVEL, MERCHANTTYPE: MERCHANTTYPE,
            }
        },
        asyncData({$axios}) {
            return $axios.get('/merch/merchant/page').then(res => {
                return {list: res}
            })
        }, methods: {
            resetForm() {
                this.$refs['form'].resetFields();
            },
            getList() {
                this.$axios.get('/merch/merchant/page', {params: this.form}).then(res => {
                    this.list = res
                })
            }
        }
    }
</script>

