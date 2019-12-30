<template>
  <section class="index">
    <div style="width: 45%;">
      <el-table :data="list" height="300">
        <el-table-column type="index"/>
        <el-table-column prop="username" label="工作人员"/>
        <el-table-column prop="对接中" label="对接中">
          <template slot-scope="scope">{{scope.row['对接中'] ? scope.row['对接中'] : 0}}</template>
        </el-table-column>
        <el-table-column prop="已确认" label="已确认">
          <template slot-scope="scope">{{scope.row['已确认'] ? scope.row['已确认'] : 0}}</template>
        </el-table-column>
        <el-table-column prop="失效" label="失效">
          <template slot-scope="scope">{{scope.row['失效'] ? scope.row['失效'] : 0}}</template>
        </el-table-column>
        <el-table-column prop="今日录入" label="今日录入"/>
        <el-table-column label="总录入">
          <template slot-scope="scope">
            {{scope.row['对接中'] ? scope.row['对接中'] : 0 + scope.row['待确认'] ? scope.row['待确认'] : 0 + scope.row['已确认'] ?
            scope.row['已确认'] : 0 + scope.row['失效'] ? scope.row['失效'] : 0}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="width: 50%;height: 300px" id="jobTypeChart"/>
    <div style="width: 50%;height: 300px" id="merchantTypeChart"/>
    <div style="width: 25%;height: 300px" id="settleTypeChart"/>
    <div style="width: 25%;height: 300px" id="addressChart"/>
  </section>
</template>

<script>
    import echarts from 'echarts'

    export default {
        name: "index",
        mounted() {
            setTimeout(() => {
                (echarts.init(document.getElementById('merchantTypeChart'))).setOption(this['merchant-type']);
                (echarts.init(document.getElementById('jobTypeChart'))).setOption(this['job-type']);
                (echarts.init(document.getElementById('settleTypeChart'))).setOption(this['settle-type']);
                (echarts.init(document.getElementById('addressChart'))).setOption(this.address);
            }, 200)
        },
        created() {
            this.getList();
            this.getType('jobs/statistics', 'job-type', 'bar');
            this.getType('jobs/statistics', 'settle-type', 'pie');
            this.getType('jobs/statistics', 'address', 'pie');
            this.getType('merchant/statistics', 'merchant-type', 'bar')
        },
        methods: {
            getList() {
                this.$axios.get('/merch/jobs/statistics/user').then(res => {
                    this.list = res
                })
            },
            getType(url, type, format) {
                this.$axios.get(`/merch/${url}/${type}`).then(res => {
                    let keys = Object.keys(res);
                    let values = Object.values(res);
                    if (format === 'bar') {
                        this[type]['yAxis']['data'].push(...keys);
                        this[type]['series']['data'].push(...values);
                    }
                    if (format === 'pie') {
                        let arr = [];
                        keys.forEach((f) => {
                            arr.push({
                                value: res[f],
                                name: f
                            })
                        });
                        this[type]['series']['data'].push(...arr)
                    }
                })
            },
        },
        data() {
            return {
                list: [],
                'job-type': {
                    title: {text: '职位类型统计', x: 'center'},
                    xAxis: {type: 'value',},
                    yAxis: {type: 'category', data: [], axisLabel: {interval: 0}, axisTick: {alignWithLabel: true}},
                    series: {type: 'bar', data: [],label: {show: true}}
                },
                'merchant-type': {
                    title: {text: '商家类型统计表', x: 'center'},
                    xAxis: {type: 'value'},
                    yAxis: {type: 'category', data: [], axisLabel: {interval: 0}, axisTick: {alignWithLabel: true}},
                    series: {data: [], type: 'bar', label: {show: true}}
                },
                'settle-type': {
                    title: {
                        text: '结算类型统计',
                        x: 'center'
                    },
                    series: {
                        name: '访问来源',
                        type: 'pie',
                        radius: '60%',
                        center: ['50%', '50%'],
                        data: [],
                        label: {
                            show: true, formatter: '{b}:{c}', position: 'inside'
                        }
                    }
                },
                address: {
                    title: {
                        text: '地区统计',
                        x: 'center'
                    },
                    series: {
                        name: '访问来源',
                        type: 'pie',
                        radius: '60%',
                        center: ['50%', '50%'],
                        data: [],
                        label: {
                            show: true, formatter: '{b}:{c}', position: 'inside'
                        }
                    }
                },
            }
        },
    }
</script>

<style lang="scss" scoped>
  .index {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
</style>
