<template>
  <div>
      <!-- header -->
      <card :hasAgree='hasAgree' @login="Login" :integral="integralNum"></card>
    
      <!-- <card :num='num' sNum='true' noShowJF='true' :hasAgree='hasAgree'></card> -->
      <!--  -->
      <div class="user-operate">
          <div class="operate-item" v-for="(item,key) in operates" :key="key" @click="goPage(item)">
            <div class="o-left"> 
              <div class="o-img">
                <img :src="item.img">
              </div>
                {{item.title}}
            </div>
            <div class="o-right">
                <img src="/static/images/face-right.png"/>
            </div>
          </div>
      </div>
      <!--  -->
      <div class="official-account">
        <official-account @error="officialLoad"></official-account>
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
import card from '@/components/card'
import modal from '@/components/modal'
import global from '@/components/global'
import {getToken,saveUser,wxRequest} from '@/components/common'
export default {
    data(){
        return{
          showMsg:false,
            operates:[
              {title:'我的信息',url:'/pages/myinfo/main',img:require('../../../static/images/wdxx.png')},
              {title:'我的产品',url:'/pages/products/main',img:require('../../../static/images/wdcp.png')},
              {title:'我的订单',url:'/pages/ticketsList/main',img:require('../../../static/images/wddd.png')},
              {title:'出发币记录',url:'/pages/record/main',img:require('../../../static/images/dhjl.png')},
              // {title:'会员手册',url:'/pages/viprule/main',img:require('../../../static/images/jfgz.png')},
              {title:'会员手册',url:'/pages/rules/main',img:require('../../../static/images/ystk.png')},
              ],
            showModal:false,
            showModal2:false,
            hasAgree:false,
            integralNum:0,
            
        }
    },
    components: {
        card,
        modal
    },
    methods: {
      Login(){
        this.showModal2 = true;
      },
      getUserInfo(e){
        if (e.mp.detail.rawData){
          let rawData =  JSON.parse(e.mp.detail.rawData)
          console.log(rawData)
          this.showModal = true; 
          this.hasAgree = true;
          getApp().globalData.login = 1; //保存用户登录状态
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
        this.showMsg = true;
      },
      hideMsg(){
        this.showMsg = false;
      },
      goPage(item){
        if(this.hasAgree === true){   //先判断有没有授权
          if(getApp().globalData.phone === 1){ //再判断有没有绑定手机
            if(item.url!==''){
              wx.navigateTo({
                url:item.url
              })
            }else{
              wx.showToast({
                title: '敬请期待',
                icon: 'none',
                duration: 2000
              })
            }
          }else{
            this.showModal = true;
          }
        }else{
          this.showModal2 = true;
        }

      },
      getModal(e){
          console.log(e)
          this.showModal = e.showModal;
      },
      officialLoad(e){
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
      // 获取积分
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

img{
    width: 100%;
    height: 100%;
}
page{
    background: #efeff4;
}

.user-operate{
    padding: 20px 20px;
    width: 90vw;
    margin: 0 auto;
    border-radius: 8px;
    position: relative;
    margin-top: calc(90px - 41.2vw);
    background: #fff;
    z-index: 5;
    box-sizing: border-box;
}
.operate-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0px;
    box-sizing: border-box;
}
.o-left{
    font-size: 15px;
    color: #333;
    display: flex;
    align-items: center;
}
.o-img{
  width: 26px;
  height: 26px;
  margin-right: 20px;
}
.o-right{
    width: 14px;
    height: 14px;
}

.official-account{
  width: 90vw;
  margin: 0 auto;
  margin-top: 14px;
  /* border-radius: 10px; */
  overflow: hidden;
}
  .img{
    height: 50px;
    width: 50px;
    border-radius: 40px;
    overflow: hidden;
    margin-right: 14px;
  }
  .user-name{
    font-weight: bold;
  }
  .right-border{
    border:1px solid #adadad;
    height: 40px;
    line-height: 40px;
    background: #fff;
    border-radius: 6px;
    padding: 0px 20px;
  }
  .modal3{
    width: 270px;
    text-align: center;
}
.popup-class3{
    border-radius: 10px;
}
.reg-text3{
    padding: 20px 30px;
}

.reg-button{
    color: #FFD637;
    height: 46px;
    line-height: 46px;
    text-align: center;
    border-top: 1px solid #cecece;
}

.text-center{
    text-align: center !important; 
}
</style>