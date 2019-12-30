<template>
  <section>
    <el-page-header content="用户管理"/>
    <br>
    <el-button @click="formVisible = true">新增</el-button>
    <br>
    <br>
    <el-table
      :data="list.records"
      border
      style="width: 100%">
      <el-table-column type="index"/>
      <el-table-column prop="username" label="用户名"/>
      <el-table-column prop="roles" label="角色"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          <el-button @click="open(scope.row.id)">修改密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="提示"
      :visible.sync="formVisible"
      width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item prop="username" label="用户名" :rules="[{required:true,trigger:'blur',message:'必填项'}]">
          <el-input v-model="form.username" placeholder="唯一值，请勿重复"></el-input>
        </el-form-item>
        <el-form-item prop="roles" label="角色" :rules="[{required:true,trigger:'change',message:'必选项'}]">
          <el-select v-model="form.roles" placeholder="请选择">
            <el-option label="管理员" value="管理员"/>
            <el-option label="商户部" value="商户部"/>
            <el-option label="客户部" value="客户部"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="password" label="密码" :rules="[{required:true,trigger:'blur',message:'必填项'}]">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <br>
    <div style="text-align: right">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleGetList"
        :total="list.total"
        :current-page.sync="page.pageNo">
      </el-pagination>
    </div>
  </section>
</template>

<script>

    export default {
        name: "permit",
        middleware: 'authenticated',
        data() {
            return {list: [], formVisible: false, form: {}, page: {pageNo: 1, pageSize: 10}}
        },
        created() {
            this.handleGetList()
        },
        methods: {
            handleGetList() {
                this.$axios.get(`/merch/admin/user`, {params: this.page}).then(res => {
                    this.list = res
                })
            },
            async handlePost() {
                await this.$axios.post(`/merch/admin/user`, this.form);
                await this.handleGetList();
                this.formVisible = false;
                this.form = {};
            },
            handlePut(id, e) {
                this.$axios.put(`/merch/admin/user`, {id: id, password: e}).then(() => {
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    });
                })
            },
            handleDelete(id) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.$axios.delete(`/merch/admin/user/${id}`).then(() => {
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                    });
                    await this.handleGetList()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            open(id) {
                this.$prompt('请输入新密码', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({value}) => {
                    this.handlePut(id, value);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消修改'
                    });
                });
            },
            handleSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.handlePost();
                    } else {
                        return false;
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>
