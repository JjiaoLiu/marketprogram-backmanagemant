<template>
  <el-container>
    <el-aside style="width: auto" class="my-el-aside">
      <el-menu style="height: 100%" router
               background-color="#333333" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse">
        <el-menu-item index="/">
          <i class="el-icon-house"></i>
          <span>主页</span>
        </el-menu-item>
        <el-menu-item index="/merchant">
          <i class="el-icon-office-building"></i>
          <span>商家列表</span>
        </el-menu-item>
        <el-menu-item index="/job">
          <i class="el-icon-suitcase"></i>
          <span>职位信息</span>
        </el-menu-item>
        <el-menu-item index="/permit" v-if="$store.state.roles === '管理员'">
          <i class="el-icon-user"></i>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <br>
        <el-row type="flex" align="center" justify="space-between">
          <el-col>
            <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
              <el-radio-button :label="false">展开</el-radio-button>
              <el-radio-button :label="true">收起</el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col style="text-align: right">
            {{ userName }}{{$store.state.roles}}
            <el-button type="primary" @click="loginOut">退出</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <nuxt-child/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    import Cookie from 'js-cookie'

    export default {
        middleware: 'authenticated',
        data() {
            return {
                isCollapse: false,
                userName: Cookie.get('userName'),
            };
        },
        methods: {
            async loginOut() {
                await this.$store.dispatch('logout');
                this.$router.push('/login')
            }
        },
    }
</script>

<style lang="scss">
  .el-container {
    height: 100vh;
  }

  .my-el-aside {
    .active-link, .exact-active-link {
      color: #ffffff;
      opacity: 1;
    }

    a, .nuxt-link-prefetched {
      color: #ffffff;
      opacity: 0.5;
      text-decoration: none;
      display: block;
    }
  }

</style>
