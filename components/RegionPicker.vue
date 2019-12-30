<template>
  <section style="width: 280px">
    <el-select :value="province" name="province" @change="(N)=>$emit('update:province',N)" placeholder="请选择"
               style="width: 32%">
      <el-option
        v-for="(item,index) in options"
        :key="index"
        :label="item.value"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select :value="city" @change="(N)=>$emit('update:city',N)" name="city" placeholder="请选择" style="width: 32%">
      <el-option
        v-for="(item,index) in optionsCity"
        :key="index"
        :label="item.value"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select :value="area" @change="(N)=>$emit('update:area',N)" placeholder="请选择" name="area" style="width: 32%">
      <el-option
        v-for="(item,index) in optionsArea"
        :key="index"
        :label="item"
        :value="item">
      </el-option>
    </el-select>
  </section>
</template>

<script>
    import {REGION} from '~/static/province'

    export default {
        name: "RegionPicker",
        data() {
            return {
                value: '',
                options: REGION,
                optionsCity: [],
                optionsArea: [],
            }
        },
        props: {
            city: {
                default: '',
                type: String
            },
            area: {
                default: '',
                type: String
            },
            province: {
                default: '',
                type: String
            },
        },
        watch: {
            'province': {
                handler(N) {
                    if (!N || !this.options.length) {
                        return false;
                    }
                    this.optionsCity = (this.options.find(f => {
                        return f.value === N
                    })).children;
                    this.$emit("update:city", '');
                    this.$emit("update:area", '');
                },
                immediate: true
            },
            'city': {
                handler(N) {
                    if (!N || !this.options.length) {
                        return false
                    }
                    this.optionsArea = (this.optionsCity.find(f => {
                        return f.value === N
                    })).area;
                    this.$emit("update:city", N);
                    this.$emit("update:area", '');
                },
                immediate: true
            },
            'area': {
                handler(N) {
                    this.$emit("update:area", N);
                }
            }
        }
    }
</script>
