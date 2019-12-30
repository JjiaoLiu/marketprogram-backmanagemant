<template>
  <section>
    {{form}}
    <el-form :model='form' label-width="80px" ref="form">
      <el-form-item label='商家名称' prop="merchantName" :rules="[
      { required: true, message: '必填项', trigger: 'blur' },
    ]">
        <el-input v-model='form.merchantName'></el-input>
      </el-form-item>
      <el-form-item label='商户类型'>
        <el-select v-model='form.merchantType' placeholder='商户类型'>
          <el-option v-for="(label,index) in MERCHANTTYPE" :value='label' :key="index" :label="label"/>
        </el-select>
      </el-form-item>
      <el-form-item label='地址'>
        <RegionPicker :province.sync='province' :city.sync='city'
                      :area.sync='area'/>
      </el-form-item>
      <el-form-item label='详细地址'>
        <el-input v-model='form.addressDetails'></el-input>
      </el-form-item>
      <el-form-item label='商家级别'>
        <el-select v-model='form.merchantLevel' placeholder='商家级别'>
          <el-option v-for="(label,index) in MERCHANTLEVEL" :value='label' :key="index">{{label}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='乘车路线'>
        <el-input v-model='form.bus'></el-input>
      </el-form-item>
      <el-form-item label='负责人'>
        <el-input v-model='form.contact'></el-input>
      </el-form-item>
      <el-form-item label='联系电话'>
        <el-input v-model='form.phone'></el-input>
      </el-form-item>
      <el-form-item label='备注'>
        <el-input v-model='form.remark'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="validate">{{+$route.params.id ? '修改':'新增'}}</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
    import {MERCHANTLEVEL, MERCHANTTYPE} from 'static/type'
    import RegionPicker from '@/components/RegionPicker'

    export default {
        data() {
            return {MERCHANTLEVEL: MERCHANTLEVEL, MERCHANTTYPE: MERCHANTTYPE}
        },
        components: {RegionPicker},
        middleware: 'authenticated',
        asyncData({$axios, params}) {
            if (+params.id) {
                return $axios.get(`/merch/merchant?id=${params.id}`).then(res => {
                    return {
                        form: res,
                        province: res.address ? res.address.split(',')[0] : '',
                        city: res.address ? res.address.split(',')[1] : '',
                        area: res.address ? res.address.split(',')[2] : ''
                    }
                });
            }
            return {
                form: {}, province: '河南省',
                city: '郑州市',
                area: '金水区'
            }
        },
        methods: {
            validate() {
                this.$refs['form'].validate((value) => {
                    if (value) {
                        this.merchant()
                    } else {
                        return false
                    }
                })
            },
            async merchant() {
                this.form.address = this.province + ',' + this.city + ',' + this.area;
                +this.$route.params.id ? await this.$axios.put(`/merch/merchant`, this.form)
                    : await this.$axios.post(`/merch/merchant`, this.form);
                this.$router.back()
            }
        }
    }
</script>
