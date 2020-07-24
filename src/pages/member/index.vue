<template>
  <div>
    <!-- header -->
    <card :hasAgree='hasAgree' @login="Login" :integral="integralNum"></card>
    <!-- 会员福利列表 -->
    <div class="lists">
      <div class="list-item" v-for="(item,key) in lists" :key='key' @click="goPage(item)">
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
        <!--  -->
    <van-popup :show="showMsg" custom-class="popup-class3" >
      <div class="modal3">
        <div class='reg-text3 text-center'>
            尊敬的用户，您仍可浏览地平线8号的会员中心页面及独家精选内容。但暂不能参与任何有关出发币的活动，谢谢！
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
        showMsg:false,
        integralNum:0,
        num:0,
        lists:[
          {title:'获取出发币',text:'点击查看出发币获取方式',image:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/6394f65a-0a26-4eae-bce1-75290f4da061.png',url:'/pages/integral/main'},
          {title:'会员抽奖',text:'每天都能免费抽取地平线8号周边噢<br/>每月8日中奖概率翻倍！',image:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/9e09da72-2f4e-410f-85cf-cb3df7561d9c.png',url:'/pages/lottery/main'},
          {title:'独家精选',text:'独家精选内容都在这里',image:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/cdb4648b-59dd-48de-b310-45d4961b7c95.png',url:'/pages/newmsg/main?type=1'},  
          {title:'新品发布会',text:'诚意邀请您前来参与我们新品发布会',image:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/e389853c-f52e-40de-943f-954f05c9baa4.png',url:'/pages/comingsoon/main'},  
          {title:'产品体验官',text:'免费申请产品，写出你的独特体验',image:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/371f68a8-a7c3-4d34-8fd7-f17128df67db.png',url:'/pages/joinChat/main'},  
          {title:'生日福利',text:'收下您的专属福利吧~',image:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/3659d0ac-a26a-4831-b18b-a29aea210baf.png',url:'/pages/comingsoon/main'},
          
        ],
        hasAgree:false,
        showModal:false,
        showModal2:false
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
            console.log(this.integralNum)
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
        if(getApp().globalData.phone === 1 && item.url !== '/pages/newmsg/main?type=1'){ //再判断有没有绑定手机
          wx.navigateTo({
            url:item.url
          })
        }else if(item.url === '/pages/newmsg/main?type=1'){
          wx.navigateTo({
            url:item.url
          })
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
    console.log(88,getApp().globalData.integralNum)
    if(getApp().globalData.integralNum !== undefined)
      this.integralNum = getApp().globalData.integralNum;

    if(getApp().globalData.login === 1){
        this.hasAgree = true;
        this.showModal2 = false;
      }
      if(getApp().globalData.phone === 1){
        this.showModal = false;        
      }
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