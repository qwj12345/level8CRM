<template>
  <div>
    <div class="header">
      <img class="header-img" src="/static/images/bg_img.png"/>
      <!-- 用户信息 -->
      <div class="header-user">
        <!-- 用户头像和名称 -->
        <div class="user-info">
          <div class="user-avatar">
            <open-data v-if="hasAgree" type="userAvatarUrl"></open-data>
            <img v-if="!hasAgree" src="/static/images/d-user.png" @click="Login"/>
          </div>
          <div v-if="hasAgree" class="user-name">
            Hi~,<open-data type="userNickName"></open-data>
            <div v-if="grade!==0" style="width:60px;margin-top:4px"><img :src="vipIcon" mode="widthFix"/></div>
          </div>
          <div v-if="!hasAgree" class="user-name" @click="Login">
            点击登录
          </div>
        </div>
        <!-- 积分 -->
        <div class="integral" @click="goIntegral">
          <div class="integral-left">
            <div class="fly-logo">
              <img src="/static/images/icon_chufabi.png"/>
            </div>
            <div>
              出发币
            </div>
          </div>
          <div class="integral-right">
            {{integral}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import global from '@/components/global'
import {wxRequest} from '@/components/common'; 
export default {
  data(){
    return{
      grade:0,
      grades:["新","银","金","铂","钻","黑"],
      vipIcon:""
    }
  },
  props: ['hasAgree','integral'],
  methods: {
    Login(){
      this.$emit('login');
    },
    goIntegral(){
      if(this.hasAgree){
        if(getApp().globalData.phone === 1)
          wx.navigateTo({
            url:'/pages/integral/main'
          })
        else
          this.$emit('phone');
      }
      else{
        this.$emit('login');
      }
        
    }

  },
  mounted() {
    this.grade = 0;
      if(wx.getStorageSync('token')!==undefined){
        // 获取积分
          let data = {
            token:wx.getStorageSync('token')
          }
          wxRequest('/miniProgram/api/user/info',{data:data}).then(res => {
            if(res.data.data.grade!==undefined)
                this.grade = res.data.data.grade; 
                this.vipIcon = require(`../../static/images/vip/vip_${this.grade}.png`)
            })
      }
  }
}
</script>

<style scoped>
/* 头部（头像、昵称和积分部分） */
.header{
    width:100vw;
    height: 41.2vw;
    position: relative;
  }
  .header-img{
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    top: 0;
    left:0;
    z-index: 0;
  }
  .header-user{
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0 10px 5vw;
    z-index: 2;
  }
  .user-info{
    display: flex;
    align-items: center;
  }
  .user-avatar{
    border-radius: 50%;
    width: 50px;
    height: 50px;
    overflow: hidden;
    margin-right: 10px;
  }
  .user-name{
    font-weight: bold;
  }
  
  .integral{
    height: 28px;
    border-top-left-radius:14px;
    border-bottom-left-radius:14px;
    background: rgba(255, 235, 215, 0.6);
    display: flex;
    padding-left: 10px;
    align-items: center; 
    color:rgb(235, 105, 18);
    font-size:12px;
  }
  
  .integral-left{
    display: flex;
    margin-right: 10px;
  }
  .fly-logo{
    width: 22px;
    height: 17px;
    margin-right: 6px;
  }
  .integral-right{
    font-size: 14px;
    margin-right: 5vw;
  }
/* 头部（头像、昵称和积分部分）END */
</style>

