<template>
  <el-container
    :style="{backgroundImage:'url('+backgroundImageUrl+')',backgroundRepeat:'no-repeat',backgroundSize:'cover',backgroundPosition:'center center'}">
    <el-main class="login">
      <div style="background: #ffffff;padding: 40px;border-radius: 5px">
        <el-header style="text-align: center">市场部小程序管理后台</el-header>
        <el-form style="width: 300px" ref="form" :model="form">
          <el-form-item label="用户名" prop="username" :rules="[{required:true,message:'必填项',trigger:'blur'}]">
            <el-input v-model='form.username'/>
          </el-form-item>
          <el-form-item label="密码" prop="password" :rules="[{required:true,message:'必填项',trigger:'blur'}]">
            <el-input v-model='form.password' type="password"></el-input>
          </el-form-item>
          <br>
          <div style="text-align: center">
            <el-button type="primary" style="width: 100%" @click="login">登录</el-button>
          </div>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script>
    import {stringify} from 'query-string'
    import {mapState} from 'vuex';
    import axios from 'axios';
    import Cookie from 'js-cookie'

    export default {
        name: 'login',
        data() {
            return {
                backgroundImageUrl: '',
                form: {
                    auth_type: 'password',
                    grant_type: 'password',
                    client_id: 'jxdou_admin',
                    client_secret: '123456',
                    username: '',
                    password: ''
                }
            }
        },
        computed: {
            ...mapState(['auth'])
        },
        mounted() {
            this.getPicture()
        },
        methods: {
            async login() {
                await this.$store.dispatch('login', stringify(this.form));
                if (this.auth) {
                    Cookie.set('userName', this.form.username);
                    this.$router.replace('/')
                }
            },
            getPicture() {
                //https://pandasecurity.mystart.com/api/get_background_details/?image_src=trey-ratcliff-angkor.jpg&lang=en
                axios.get('https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture', {responseType: 'arraybuffer'}).then((res) => {
                    // this.backgroundImageUrl = 'https://mystart.mystartcdn.com/resources/images/backgrounds/large/' + res.data.Filename
                    this.backgroundImageUrl = 'data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
                })
            }
        }
    }
</script>

<style>
  .login {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column
  }

  input.el-input__inner {
    background: transparent;
  }
</style>
