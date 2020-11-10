<template>
  <div>
    <!-- header -->
    <card :hasAgree='hasAgree' @login="Login" :integral="integralNum"></card>
    <!-- 会员福利列表 -->
    <div class="lists">
      <div  v-for="(item,key) in lists" :key='key' @click="goPage(item)">
        <div class="list-item" v-show="key!==0||showTicket">
          <div class="item-icon" v-if="key === 0"><img src="/static/images/hot.png" mode="widthFix"/></div>
          <!-- left -->
          <div class="item-left">
            <div class="item-img">
              <img :src="item.image" mode="widthFix"/> 
            </div>
            <div class="item-left-content">
              <div class="left-title">{{item.title}}</div>
              <div class="left-content" v-html="item.text">{{item.text}}</div>
            </div>
          </div>
          <!-- right -->
          <div class="item-right">
            <img src="/static/images/face-right.png" />
          </div>
        </div>
      </div>
    </div>

    <modal :showModal="showModal" @modalShow='getModal' @refuseModal='refuseAgree'></modal>
    
    <!-- 授权弹出框  -->
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
        <!--  -->
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
import card from '@/components/card'
import global from '@/components/global'
import {getToken,saveUser,wxRequest} from '@/components/common' 

export default {
  data(){
      return{
        modelText:'',
        showMsg:false,
        integralNum:0,
        num:0,
        lists:[
          {title:'酒店自助餐',text:'超值福利，五星酒店自助餐超低会员价出发币可抵现金',image:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/tickets-a1d65e34-1d0a-420b-8574-5397e21ce3d6.png',url:'/pages/tickets/main'},
          {title:'出发币兑换',text:'8号会员日，出发币兑换开放日',image:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/矩形19-be702e1d-74b0-4e48-8702-98933895b1f9.png',url:'/pages/integral/main?type=1'},
          {title:'出发币换购',text:'出发币当钱花，惊喜优惠价换购正品好物',image:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/椭圆10拷贝-3e4ebf1e-dd53-4cf2-a5fc-0a3d57c2e774.png',url:'/pages/comingsoon/main'},
          {title:'邀请好友',text:'最高可赚5000出发币！',image:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/邀请好友-a8ec0d2c-3632-43e6-b850-3a0681b7546e.png',url:'/pages/inviteList/main'},
          {title:'邀请赠礼',text:'每月惊喜不停歇，分享即领多重好礼',image:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/图层1-30a995de-5e99-48ae-a18b-c32565667ab2.png',url:'/pages/inviteGiftList/main'},  
          {title:'关注公众号',text:'自动升级L1新8会员，送200出发币',image:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/公众号(1)-f78beee6-b59a-4b92-b361-e0c24bef0a2c.png',url:'alert'},  
          {title:'独家精选',text:'单篇精选内容分享最高可赚50出发币',image:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/图层3-3bf34471-90dd-4c60-a40b-7097613cefc7.png',url:'/pages/newmsg/main?type=1'},  
          {title:'报名摇奖',text:'惊喜好物上线，0元报名定时开奖',image:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/抽奖(1)-edbcadad-8120-4340-a250-4e78929f7c44.png',url:'/pages/casino/main'},
          {title:'产品体验官',text:'免费申请产品使用，写出你的独特体验',image:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/图层5-86e14a51-8c19-4723-9a04-74f408055c6c.png',url:'/pages/comingsoon/main'},
          {title:'进粉丝群',text:'隐形福利，专享特权通通在这里',image:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/组17-765bbff4-e4c0-40db-84b0-bca9bd34f7d0.png',url:'/pages/joinChat/main'},
        ],
        hasAgree:false,
        showModal:false,
        showModal2:false,
        showTicket:false
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
    getUserInfo(e){
      console.log(e)
      if (e.mp.detail.rawData){
        let rawData =  JSON.parse(e.mp.detail.rawData)
        console.log(rawData)
        this.showModal = true; 
        this.hasAgree = true;
        getApp().globalData.login = 1; //保存用户登录状态  
        // wx.setStorageSync('login', '1');
        // 获取token
        getToken(e.mp.detail.encryptedData,e.mp.detail.iv).then(res => {
          console.log('token',res)
          // 获取积分
          let data = {
            token:wx.getStorageSync('token')
          }
          wxRequest('/miniProgram/api/user/info',{data:data}).then(res => {
            this.integralNum = res.data.data.integralNum;
            getApp().globalData.isQrcodeCheckUser = res.data.data.isQrcodeCheckUser;
          })
          // 存储头像和姓名
          saveUser(rawData.nickName,rawData.avatarUrl,rawData.gender)
        });
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
    },
    refuseAgree(e){
      this.showModal = false;
      this.modelText = '尊敬的用户，您仍可浏览地平线8号的会员中心页面及独家精选内容。但暂不能参与任何有关出发币的活动，谢谢！';
      this.showMsg = true;
    },
    hideMsg(){
      this.showMsg = false;
    },
    // 页面跳转
    goPage(item){
      if(item.url === '/pages/webpage/main'){
        let url = encodeURIComponent('https://shop.level8.com.cn/wxmail/getAuthurl?returnUrl=http://192.168.65.235:9090/wxmail/saveUserInfo')
        wx.navigateTo({
            url:'/pages/webpage/main?url='+url
        })
      }
      if(this.hasAgree === true){   //先判断有没有授权  
        if(getApp().globalData.phone === 1){ //再判断有没有绑定手机
          if(item.url === 'alert'){
              this.modelText = '关注“地平线8号”公众号，可获赠200出发币，且自动升级为L1新8会员！';
              this.showMsg = true;
            }else{
              wx.navigateTo({
                url:item.url
              })
            }
          
        }else{
          this.showModal = true;
        }
      }else{
        this.showModal2 = true;
      }
    },
  },
      onShareAppMessage(res) {
        //转发时携带 shareTicket才能在回调中获取到shareTickets
        wx.showShareMenu({
            withShareTicket: true
        }) 

    },
  onShow(){

    if(getApp().globalData.integralNum !== undefined)
      this.integralNum = getApp().globalData.integralNum;

    if(getApp().globalData.login === 1){
        this.hasAgree = true;
        this.showModal2 = false;
      }
      if(getApp().globalData.phone === 1){
        this.showModal = false;        
      }
      // 是否有酒店自助餐券模块
      let data = {
          discountCode:"",
          token:wx.getStorageSync('token')
      }
      wxRequest('/miniProgram/api/trophy/payTrophyList',{data:data}).then(res => {
          // this.showTicket = res.data.data.length===0?false:true;
      })
  },

  onLoad () {
      let that = this;
      //----------登录----------------
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

page{
  background: #efeff4;
}

.lists{
  position: relative;
  padding:20px 5vw;
  margin-top: calc(70px - 41.2vw);
  z-index: 5;

}
.list-item{
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px 10px 16px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
}
.item-icon{
  position: absolute;
  top: -0.5px;
  left: 10px;
  width: 18px;
}
.item-left{
  display: flex;
  align-items: center;
  width:calc(100% - 40px);
  height: 100%;
}
.item-img{
  width: 40px;
  margin-right: 18px;
}
.item-left-content{
  display: flex;
  flex-direction: column;
  height: 50px;
}
.left-title{
  font-size: 15px;
  margin-bottom: 4px;
}
.left-content{
  font-size: 13px;
  color: #999;  
}
.item-right{
  width: 18px;
  height: 18px;
}
img{
  width:100%;
  height: 100%;
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
</style>