<template>
  <div class="page">
    <!-- header -->
    <card :hasAgree='hasAgree' @login="Login" @phone='getPhone' :integral="integralNum"></card>
      <!-- 主页轮播图 -->
    <div class="swiper-top">
      <swiper class='swiper' autoplay="true" @change="changeSwiper">
        <block v-for="(item,key) in imgUrls" :key="key">
          <swiper-item >
            <image :src="item.img"  class="slide-image" mode="widthFix"  @click="goPage(item.address,item.name)"/>
          </swiper-item>
        </block>
      </swiper>
      <!-- 轮播图下方的点 -->
      <div class="swiper-indicator">
        <div v-for="(item,key) in imgUrls" :key="key" :class="{'sel-indicator-item':swiperIndex === key,'indicator-item':swiperIndex !== key}">
        </div>
      </div>
    </div>
    
    <!-- 主页的主要内容 -->
    <div class="container">
      <div class="register">
        <!-- https://level8cases.oss-cn-hangzhou.aliyuncs.com/a0d3ceb3-53ee-4a1d-9187-e22f58b61c90.jpg  -->
        <!-- https://level8cases.oss-cn-hangzhou.aliyuncs.com/53b1c1ef-626d-4209-af0e-3e17e4125042.png -->
        <img class="register-img" src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/09105f94-049c-485a-bf54-d872deec06eb.png" mode="widthFix" @click="goReport"/>
      </div>
      <!-- 主页功能模块 -->
      <div class="blocks">
        <div style=" width: 49%;margin-bottom: 10px;" v-for="(item,key) in blocks" :key="key"  @click="goPage(item.url)">
          <div class="container-block" v-if="key!==4||showQM">
            <div class="block-img">
              <img :src="item.icon"/>
            </div>
            <div>
              {{item.text}}
            </div>
            <div class="block-info" v-if="key === 3">一键升级会员</div>
          </div>
        </div>
      </div>
    </div>
    
    <!--  -->
      <div class="official-account">
        <official-account @load="officialLoad" @error='errorLoad'></official-account>
      </div>
    <!-- 活动 -->
    <div id="fixed-btn" :style="{transform:rotateDeg}"  @click="goPage('/pages/inviteList/main')">
      <img src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/fixed_icon-19bb5c83-9ddc-4a7d-858d-9109334f9c77.png">
    </div>

    <!--  -->
    <modal :showModal="showModal" @modalShow='getModal' @refuseModal='refuseAgree'></modal>
    <!-- 授权弹出框 -->
    <van-popup :show="showModal2" custom-class="popup-class" >
        <div class="modal2">
          <div class="reg-title">
            获取微信授权信息
          </div>
          <div class="reg-text">
              微信登录需要获取您的用户信息，请前往授权
          </div>
          <div class="modal-btns">
            <div class="modal-cancel-btn" @click="cancelModal2">
              取消
            </div>
            <button class="reg-btn" open-type="getUserInfo" @getuserinfo="getUserInfo" @click="hideModal">授权登录</button>
          </div>
        </div>
    </van-popup>
    <!--     -->
    <van-popup :show="showMsg" custom-class="popup-class3" >
      <div class="modal3">
        <div class='reg-text3 text-center'>
            {{modelText}}
        </div>
        <div class="reg-button" @click="hideMsg">
          确定
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import modal from '@/components/modal'
import global from '@/components/global'
import card from '@/components/card'
import {getToken,saveUser,wxRequest} from '@/components/common'

export default {
  data () {
    return {
      showMsg:false,
      imgUrls:[],
      blocks:[{text:'出发币获取',icon:require('../../../static/images/hqcfb.png'),url:'/pages/integral/main'},{text:'出发币兑换',icon:require('../../../static/images/jf.png'),url:'/pages/integral/main?type=1'},{text:'会员来抽奖',icon:require('../../../static/images/zp.png'),url:'/pages/lottery/main'},{text:'关注公众号',icon:require('../../../static/images/wx.png'),url:'alert'},{text:'券码核销',icon:require('../../../static/images/hx.png'),url:'/pages/verification/main'}],
      swiperIndex:0,
      showModal:false,
      showModal2:false,
      checkedRule:true,
      hasAgree:false,
      integralNum:0,
      showQM:false,
      rotateDeg:'',
      timer1:null,
      timer2:null,
      modelText:'',
      animation:{}
    }
  },
  components: {
    modal,
    card
  },
  methods: {
    Login(){
      this.showModal2 = true;
    },
    getPhone(){
      this.showModal = true;
    },
    getUserInfo(e){
      if (e.mp.detail.rawData){
        let rawData =  JSON.parse(e.mp.detail.rawData);
        this.showModal = true; 
        this.hasAgree = true;
        getApp().globalData.login = 1; //保存用户登录状态  
      } else {  
        this.showModal2 = true;
        console.log('用户按了拒绝按钮')
      }
    },
    hideModal(){
      this.showModal2 = false;
    },
    cancelModal2(){
      this.showModal2 = false;
    },
    // modal组件中的值传过来    
    getModal(e){
      this.showModal = e.showModal;
      let data = {
        token:wx.getStorageSync('token')
      }
      wxRequest('/miniProgram/api/user/info',{data:data}).then(res => {
        getApp().globalData.isQrcodeCheckUser = res.data.data.isQrcodeCheckUser;
        getApp().globalData.isQrcodeCheckUser===1?this.showQM=true:this.showQM=false;
        this.integralNum = res.data.data.integralNum;
        getApp().globalData.integralNum = this.integralNum;
      })
    },
    refuseAgree(e){
      this.showModal = false;
      this.modelText = '尊敬的用户，您仍可浏览地平线8号的会员中心页面及独家精选内容。但暂不能参与任何有关出发币的活动，谢谢！';
      this.showMsg = true;
    },
    hideMsg(){
      this.showMsg = false;
    },
    // swiper改变时的事件  
    changeSwiper(e){
      this.swiperIndex = e.mp.detail.current;
    },
    // modal点击事件 
    clickModal(){
      this.showModal = false;
    },
    goPage(item,name){
      if(item !== '' && item !== undefined){
        if(this.hasAgree === true){   //先判断有没有授权  
          if(getApp().globalData.phone === 1){ //再判断有没有绑定手机  
             if(item === '/pages/report/main'){
              wx.switchTab({
                url:item
              })
            }else if(item === 'alert'){
              this.modelText = '关注“地平线8号”公众号，可获赠200出发币，且自动升级为L1新8会员！';
              this.showMsg = true;
            }else if(name === 'shop'){
              wx.navigateToMiniProgram({
                appId: 'wx80a0130b2422a4db',
                path:item,
                envVersion: 'release',
                success(res) {
                  console.log(res)
                },
                fail(res){
                  console.log(res)
                }
              })
            }else{
              wx.navigateTo({
                url:item
              })  
            }
          }else{
            this.showModal = true;
          }
        }else{
          this.showModal2 = true;
        }
      }
    },
    goReport(){
      wx.switchTab({
        url:'/pages/report/main'
      })
    },
    errorLoad(e){
      console.log('official',e)
    }
  },
  onShareAppMessage(res) {
    //转发时携带 shareTicket才能在回调中获取到shareTickets 
    wx.showShareMenu({
        withShareTicket: true
    }) 
  },
  onShow(){
    // this.$root.$mp.page.getTabBar().setData({
    //     activeIndex: 0 //对应页面的index
    // })
     //在saveUser接口中会把积分传给getApp().globalData.integralNum 
    // 获取积分
    if(getApp().globalData.integralNum === undefined && wx.getStorageSync('token') !==''){
      let data = {
        token:wx.getStorageSync('token')
      }
      wxRequest('/miniProgram/api/user/info',{data:data}).then(res => {
        this.integralNum = res.data.data.integralNum;
        getApp().globalData.isQrcodeCheckUser = res.data.data.isQrcodeCheckUser;
        getApp().globalData.integralNum = this.integralNum;
        getApp().globalData.isQrcodeCheckUser===1?this.showQM=true:this.showQM=false;
      })
    }else if( wx.getStorageSync('token') ===''){
      this.integralNum = 0;
    }else{
      this.integralNum = getApp().globalData.integralNum;
    }
    
    // 判断用户是否登录，如果是就根据hasAgree字段判断显示用户头像和昵称，并且隐藏modal 
    if(getApp().globalData.login === 1){
        this.hasAgree = true;
        this.showModal2 = false;
      }
      if(getApp().globalData.phone === 1){
        this.showModal = false; 
      }
      // 是否有酒店自助餐核销权利  
      getApp().globalData.isQrcodeCheckUser===1?this.showQM=true:this.showQM=false;

      // 右下角图标动画效果
      // let animation1 = wx.createAnimation({
      //   duration: 1300,
      //   timingFunction: "linear",
      //   delay: 0
      //  });

      // animation1.rotate('20').step().rotate('-20').step();
      //  this.animation = animation1.export()
      // let next = true;
      // 连续动画关键步骤
      // setInterval(function () {
      //   if (next) {
      //     animation1.rotate('20').step()   
      //     next = !next;
      //   } else {
      //     animation1.rotate('-20').step()
      //     next = !next;
      //   }
      //   this.animation = animation1.export()
      // }.bind(this), 1300)
   
      this.rotateDeg = "";
      this.timer1 = setInterval(() => {
        this.rotateDeg = 'rotate(20deg)';
      }, 1300);

      setTimeout(() => {
        this.timer2 = setInterval(() => {
          this.rotateDeg = 'rotate(-20deg)';
        }, 1300);
      }, 650);
  },
  // 清除定时器 
  onHide(){
    clearInterval(this.timer1);
    clearInterval(this.timer2);
  },
  onLoad (query) {
    getApp().globalData.discountCode = query.discountCode;
    getApp().globalData.invitationCode = query.code;//邀请码进来 
    let that = this;   
    wx.showLoading({
        title:"请稍后",
        mask:true
    })
    // 获取轮播图
    wxRequest('/miniProgram/api/img/list2',{data:{}}).then(res => {
      wx.hideLoading();
      this.imgUrls = [];
      let imgUrls = JSON.parse(res.data.data);

      for(let imgUrl in imgUrls){
        imgUrls[imgUrl].address = imgUrls[imgUrl].address.replace(/\s+/g,"");
        this.imgUrls.push(imgUrls[imgUrl])
      }
    })
    // 因为如果只在APP.vue中请求一次的话会出现异步的问题，就是这个onLoad比APP.vue中的onLoad先执行完   
    wx.getUserInfo({  
      success: function(res) {
          console.log(res)
          getApp().globalData.login = 1
          that.hasAgree = true;
      },
      fail(err){
          console.log(err)
          that.hasAgree = false;
      }
    })
  },
}
</script>

<style>
@import url('../../components/common.css');
.swiper{
  width:90vw;
  height: 42.75vw;
  margin: 0 auto;
  margin-top: 20px;
  position:relative;
  border-radius: 8px;
  overflow: hidden;
}
swiper-item{
  border-radius: 8px;
}
.slide-image{
  width: 90vw;
  flex-shrink: 0;
  box-shadow:0px 0px 3px 2px rgba(172, 172, 172, 0.4);
}
.swiper-indicator{
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
.sel-indicator-item{
  height: 3px;
  width: 16px;
  border-radius: 2px;
  background: rgba(125, 125, 125, 0.8);
  margin: 0 2px;
}
.indicator-item{
  height: 3px;
  width: 16px;
  border-radius: 2px;
  background: rgba(125, 125, 125, 0.4);
  margin: 0 2px;
}
img{
  width: 100%;
  height: 100%;
  display: block;
}
.swiper-top{
  margin-top: calc(70px - 41.2vw);
}
.container{
  padding: 20px 5vw;
}
.register{
  border-radius: 8px;
  overflow: hidden;
  box-shadow:0px 0px 4px 2px rgba(231, 230, 230, 0.4); 
}

.blocks{
  margin-top: 20px;
  display:flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.block-info{
  position: absolute;
  bottom: 13%;
  font-size: 11px;
  width: 100%;
  left: 0;
  text-align: center;
  color:rgb(235, 105, 18)
}
.container-block{
  height: 25vw;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f6;
  font-size: 14px;
  box-sizing: border-box;
  font-family: 'Microsoft YaHei';
  color: #333;
  position: relative;
}
.block-img{
  width:47px;
  height: 33px;
  margin-right: 10px;
}

.official-account{
  width: 90vw;
  margin: 0 auto;
  margin-top: -15px;
  padding-bottom: 30px;
  overflow: hidden;
}
.modal3{
    width: 270px;
    text-align: center;
}
.popup-class3{
    border-radius: 10px;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
.reg-text3{
    padding: 20px 30px;
    text-align: left;
}
.text-center{
    text-align: center !important; 
}
.reg-button{
    color: #FFD637;
    height: 46px;
    line-height: 46px;
    text-align: center;
    border-top: 1px solid #cecece;
}
#fixed-btn{
  position: fixed;
  right: 18px;
  bottom: 16px;
  width: 46px;
  height: 46px;
  transition: all 0.5s linear;
}
</style>
