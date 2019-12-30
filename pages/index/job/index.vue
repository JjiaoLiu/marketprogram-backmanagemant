<template>
  <section>
    <el-page-header content="职位列表"/>
    <br>
    <el-form :model="form" ref="form" inline>
      <el-form-item prop="keywords">
        <el-input v-model="form.keywords" placeholder="商家名称、负责人和电话"></el-input>
      </el-form-item>
      <el-form-item prop="jobType">
        <el-select v-model="form.jobType" placeholder="工作类型">
          <el-option v-for="(label,index) in JOBTYPES" :value='label' :key="index" :label="label"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="settleType">
        <el-select v-model="form.settleType" placeholder="结算方式">
          <el-option v-for="(label,index) in SETTLETYPES" :value='label' :key="index" :label="label"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="address">
        <RegionPicker province="河南省" city="郑州市" :area.sync="form.address"></RegionPicker>
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="form.status" placeholder="状态">
          <el-option v-for="(label,index) in JOBSTATUS" :value='label' :key="index" :label="label"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="startDate">
        <el-date-picker
          v-model="form.startDate"
          value-format="yyyy-MM-dd"
          type="date"
          :picker-options="startPickerOptions"
          placeholder="开始工作日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="endDate">
        <el-date-picker
          v-model="form.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="endPickerOptions"
          placeholder="结束工作日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button @click="getList">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button @click="$router.push('/job/0')">新增</el-button>
        <el-dropdown @command="(command)=>{changeList(command,multipleSelectionIds)}">
          <el-button>状态<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="对接中">对接中</el-dropdown-item>
            <el-dropdown-item command="已确认">已确认</el-dropdown-item>
            <el-dropdown-item command="失效">失效</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button @click="deleteLists(multipleSelectionIds)">删除</el-button>
      </el-form-item>
    </el-form>
    <br>
    <el-table
      :data="list.records"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column type="selection"/>
      <el-table-column prop="jobType" label="工作类型"/>
      <el-table-column prop="merchantName" label="商家"/>
      <el-table-column label="所需人数">
        <template slot-scope="scope">
          {{scope.row.recruitNum ? scope.row.recruitNum : `男：${scope.row.numMan},女：${scope.row.numWoman}`}}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="薪资" width="50"/>
      <el-table-column prop="settleType" label="结算方式"/>
      <el-table-column prop="startDate" label="开始工作日期"/>
      <el-table-column prop="endDate" label="结束工作日期"/>
      <el-table-column label="工作时间">
        <template slot-scope="scope">
          {{scope.row.times1Start}}-{{scope.row.times1End}}/{{scope.row.times2Start}}-{{scope.row.times3End}}
        </template>
      </el-table-column>
      <el-table-column prop="" label="工作地点">
        <template slot-scope="scope">
          {{scope.row.address}} {{scope.row.addressDetails}}
        </template>
      </el-table-column>
      <el-table-column prop="contact" label="联系人"/>
      <el-table-column prop="phone" label="联系电话"/>
      <el-table-column prop="status" label="状态"/>
      <el-table-column prop="createTime" label="登记时间"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="$router.push('/job/'+scope.row.id)"
                     v-if="scope.row.status === '待确认'">编辑
          </el-button>
          <el-button v-if="$store.state.roles === '客户部' && scope.row.status === '待确认'" type="primary"
                     @click="changeList('对接中',scope.row.id)">对接中
          </el-button>
          <el-button v-if="$store.state.roles === '客户部' && scope.row.status === '对接中'" type="primary"
                     @click="changeList('已确认',scope.row.id)">已确认
          </el-button>
          <el-button v-if="$store.state.roles === '客户部' && scope.row.status === '已确认'" type="primary"
                     @click="changeList('失效',scope.row.id)">失效
          </el-button>
          <el-button @click="deleteList(scope.row.id)" type="danger"
                     v-if="scope.row.status === '待确认'">删除
          </el-button>
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
    import {JOBTYPES, SETTLETYPES, JOBSTATUS} from "../../../static/type";
    import RegionPicker from "../../../components/RegionPicker";

    export default {
        name: "job",
        middleware: 'authenticated',
        components: {RegionPicker},
        data() {
            let _this = this;
            return {
                form: {}, multipleSelection: [], JOBTYPES: JOBTYPES, SETTLETYPES: SETTLETYPES, JOBSTATUS: JOBSTATUS,
                startPickerOptions: {
                    disabled(time) {
                        if (this.form.endDate) {
                            return time.getTime() > this.form.endDate.getTime();
                        }
                        return ''
                    }
                },
                endPickerOptions: {
                    disabled(time) {
                        if (this.form.startDate) {
                            return time.getTime() < this.form.startDate.getTime();
                        }
                        return ''
                    }
                }
            }
        },
        asyncData({$axios}) {
            return $axios.get('/merch/jobs/page').then(res => {
                return {list: res}
            })
        },
        computed: {
            multipleSelectionIds() {
                let ids = [];
                this.multipleSelection.forEach(f => {
                    ids.push(f.id)
                });
                return ids.join(',');
            }
        },
        methods: {
            getList() {
                this.$axios.get('/merch/jobs/page', {params: this.form}).then(res => {
                    this.list = res;
                })
            },
            deleteLists(id) { //批量删除
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.$axios.delete(`/merch/jobs/batch-delete?ids=${id}`);
                    await this.getList();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteList(id) { //批量删除
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.$axios.delete(`/merch/jobs?id=${id}`);
                    await this.getList();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            changeList(command, id) {
                this.$confirm('提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(async ({value}) => {
                    await this.$axios.post(`/merch/jobs/update-status`, {ids: id, status: command, remark: value});
                    await this.getList();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            resetForm() {
                this.$refs['form'].resetFields();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
        }
    }
</script>
