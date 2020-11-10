<template>
  <div class="tickets">
      <div v-if="tickets.length!==0" style="display:flex;flex-wrap:wrap;justify-content:space-between;width:100%">
        <div class="ticket-item" v-for="(item,key) in tickets" :key="key" @click="goDetail(item.id)">
            <div class="ticket-img" style="position:relative">
                <img :src="item.trophyImg" mode="widthFix"/>
                <div class="offSale-img" v-if="item.trophyNum===0">
                  <img style="width:60%" src="/static/images/off_sale.png" mode="widthFix"/>
                </div>
            </div>
            <div class="ticket-content">
                <div class="ticket-name">{{item.trophyName}}</div>
                <div class="ticket-info">
                    <div style="width:13px;margin-right:4px"><img src="/static/images/coin.png" mode="widthFix"/></div>
                    出发币抵后价约  
                </div>
                <div class="price">
                    <div class="after-price"><span>￥</span>{{item.usePrice}}</div>
                    <div class="before-price">￥{{item.payPrice}}</div>
                </div>
            </div>
        
        </div> 
      </div>
        <div v-else style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;margin-top:200rpx">
          <div style="width:100rpx"><img src="/static/images/refuse_icon.png" mode="widthFix"/></div>
          <div style="color:#999;font-size:26rpx;margin:20rpx 0">授权失败，请重新授权</div>
            <div @click="Login" style="width:300rpx;text-align:center;font-size:28rpx;font-weight:bold;line-height:40px;background:#ffd637;border-radius:20px">重新授权</div>
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
import {getToken,saveUser,wxRequest} from '@/components/common'
export default {
    data() {
        return {
            tickets:[],
            showModal:false,
            showModal2:false,
            showMsg:false
        }
    },
    components: {
        modal
    },
    methods: {
      Login(){
        this.showModal2 = true;
      },
      getPhone(){
        this.showModal = true;
      },
      getUserInfo(e){
        console.log('user',e)
        if (e.mp.detail.rawData){
          let rawData =  JSON.parse(e.mp.detail.rawData);
          this.showModal = true; 
          this.hasAgree = true;
          getApp().globalData.login = 1; //保存用户登录状态 
          // 获取token
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
        this.getTickets();
        let data = {
          token:wx.getStorageSync('token')
        }
        wxRequest('/miniProgram/api/user/info',{data:data}).then(res => {
          getApp().globalData.integralNum = this.integralNum;
          getApp().globalData.isQrcodeCheckUser = res.data.data.isQrcodeCheckUser;
        })
      },
      refuseAgree(e){
        this.showModal = false;
        this.showMsg = true;
      },
      hideMsg(){
        this.showMsg = false;
      },
      goDetail(id){
          wx.navigateTo({
              url:"/pages/ticketDetail/main?id="+id
          })
      },
      getTickets(){
          wx.showLoading({
              title:'加载中'
          })
          let data = {
              discountCode:getApp().globalData.discountCode,
              token:wx.getStorageSync('token')
          }
          wxRequest('/miniProgram/api/trophy/payTrophyList',{data:data}).then(res => {
            console.log(res)
            this.tickets = res.data.data;
            wx.hideLoading();
          })
      } 
    },
    
    onLoad(query) {  
        getApp().globalData.discountCode = query.discountCode;
        if(wx.getStorageSync('token')===""){
            this.showModal2 = true;    
        }else{
            this.getTickets();
        }
    },
}
</script>

<style>
@import url('../../components/common.css');
page{
    background: #efeff4;
}
img{
    width:100%;
}
.tickets{
    padding: 10px 12px;
}
.ticket-item{
    width: calc(50vw - 18px);
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;
}
.ticket-content{
    padding: 10px;
}

.ticket-name{
    font-size: 14px;
    margin-bottom: 4px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.ticket-info{
    color:rgb(235, 105, 18);
    font-size: 10px;
    display: flex;
    align-items: center;
    margin-bottom: 6px;
}

.price{
    display: flex;
}
.after-price{
    font-weight: bold;
    font-size: 16px;
    margin-right: 4px;
}

.after-price>span{
    font-weight: normal;
    font-size: 10px;
}
.before-price{
    font-size: 10px;
    text-decoration: line-through;
    color: #333;
    align-self: flex-end;
    margin-bottom: 2px;
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
.offSale-img{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(000, 000, 000, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  }
</style>