<template>
  <section>
    {{form}}
    <el-form :model='form' label-width="80px" ref="form">
      <el-form-item label='商家名称' prop="merchantName" :rules="[
      { required: true, message: '必填项', trigger: 'blur' },
    ]">
        <span v-if="form.id">{{form.merchantName}}</span>
        <template v-else>
          <el-select v-model='form.merchantName' placeholder='工作类型'>
            <el-option v-for="(label,index) in MERCHANTNAME" :value='label' :key="index">{{label}}</el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label='工作类型'>
        <el-select v-model='form.jobTypes' placeholder='工作类型'>
          <el-option v-for="(label,index) in JOBTYPES" :value='label' :key="index">{{label}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='结算方式'>
        <el-select v-model='form.settleTypes' placeholder='结算方式'>
          <el-option v-for="(label,index) in SETTLETYPES" :value='label' :key="index">{{label}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='薪资'>
        <el-input v-model='form.price'></el-input>
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
    import {JOBTYPES, SETTLETYPES, SALARYTYPES, MERCHANTLEVEL} from 'static/type'
    import RegionPicker from '@/components/RegionPicker'

    export default {
        data() {
            return {JOBTYPES: JOBTYPES, SETTLETYPES: SETTLETYPES, SALARYTYPES, MERCHANTLEVEL, MERCHANTNAME: []}
        },
        components: {RegionPicker},
        middleware: 'authenticated',
        asyncData({$axios, params}) {
            if (+params.id) {
                return $axios.get(`/merch/jobs?id=${params.id}`).then(res => {
                    return {
                        form: res,
                        province: res.address ? res.address.split(',')[0] : '',
                        city: res.address ? res.address.split(',')[1] : '',
                        area: res.address ? res.address.split(',')[2] : '',
                        id: +params.id
                    }
                });
            }
            return {
                form: {}, province: '河南省',
                city: '郑州市',
                area: '金水区',
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
