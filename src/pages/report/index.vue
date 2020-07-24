<template>
  <div class="page">
      <div class="question" @click="goIntrou">
          <img src="/static/images/question.png"/>
      </div>
      <!-- scan -->
      <div class="scan-code">
          <div class="scan-img">
              <img src="/static/images/scan.png" @click="scanCode"/>
          </div>
          <div>扫描产品二维码</div>
      </div> 
      <!--输入序列号和日期 -->
      <div class="form">
          <input class="input" placeholder="输入产品序列号" v-model="uid"/>
          <div class="input-time input">
              <div class="time-title">购买日期</div>
              <div class="sel-time" @click="selDate" :class="{'color6':currentDate!=='选择购买日期'}">{{currentDate}}</div>
          </div>
          <div class="form-text">仅注册用户需填，上报拾到物不需</div>
      </div>
      <!-- 下方两个按钮 -->
      <div class="z-btn" @click="regMethod" >注册产品</div>
      <div class="s-btn" @click="goDetail">上报拾到物</div>
      <!-- 选择日期的弹出框 -->
      <van-popup :show="showDate" position="bottom" close-on-click-overlay="true" @close="closeDate" >
        <van-datetime-picker :value="nowDate" :max-date="nowDate" type="date"  @confirm="onInput" @cancel="closeDate"/>
      </van-popup>
        <!-- 注册成功产品后的弹出框 -->
      <van-popup :show="showReg" custom-class="popup-class3" >
          <div class="modal3">
              <div v-if="isRegSuccess && goodsType === 2" class="modal-logo">
                  <img :src="iconImg"/>
              </div>
              <div v-if="isRegSuccess && goodsType === 2" class="modal-logo-text">{{iconText}}</div>
              <div  v-html="regSuccess">
                  {{regSuccess}}
              </div>
            <div class="reg-button" @click="hideReg">
                确定
            </div>
          </div>
      </van-popup>
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
              <div class="modal-cancel-btn" @click="hideModal">
                取消
              </div>
              <button class="reg-btn" open-type="getUserInfo" @getuserinfo="getUserInfo" @click="hideModal">授权登录</button>
            </div>
          </div>
      </van-popup>
          <!--    -->
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
import {timeFormat,getToken,saveUser,wxRequest} from '@/components/common'
import global from '@/components/global'

export default {
    data(){
        return{
            showMsg:false,
            uid:'',
            closeIcon:true,
            showReg:false,
            showDate:false, 
            showModal:false,
            showModal2:false,
            isRegSuccess:false,
            nowDate:new Date().getTime(),
            currentDate: '选择购买日期',
            hasAgree:false,
            regSuccess:'<div class="reg-text3">恭喜您，产品已绑定成功，<br/>积分已到账</div>',
            goodsType:0,
            iconImg:'',
            iconText:''
        }
    },
    components: {
        modal
    },
    methods: {
        getUserInfo(e){
            console.log(e)
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

        // 扫描二维码的方法
        scanCode(){
            let that = this;
            wx.scanCode({
                success (res) {
                    console.log(res)
                    if(res.path!==undefined){
                        wx.showToast({
                            title: '扫码成功',
                            icon: 'success',
                            duration: 1000
                        })
                        that.uid = res.path.split('=')[1];//截取产品序列号
                    } else{ 
                        wx.showToast({
                            title: '请扫描带序列号二维码',
                            icon: 'none',
                            duration: 1000
                        })
                    }
                },
                fail(err){
                    wx.showToast({
                        title: '扫码失败',
                        image: '/static/images/errorToast.png',
                        duration: 1000
                    })
                    console.log('err',err)
                }
            })
        },
        // 拒绝授权
        refuseAgree(e){
            this.showModal = false;
            this.showMsg = true;
        },
        hideMsg(){
            this.showMsg = false;
        },
        // 前往上报到拾到物页面
        goDetail(){
            if(this.hasAgree){
                if(getApp().globalData.phone === 1){ //再判断有没有绑定手机
                    if(this.uid ===''){
                        wx.showToast({
                            title: '请输入序列号',
                            icon: 'none',
                            duration: 2000
                        })
                                
                    }else{
                        let data = {
                            token:wx.getStorageSync('token'),
                            goodsCode:this.uid,
                        }
                        wxRequest('/miniProgram/api/goods/collect',{data:data}).then(res => {
                            if(res.data.status === 0){
                                wx.navigateTo({
                                    url:'/pages/reportDetail/main?code='+this.uid
                                })
                            }else if(res.data.status === 10009){
                                this.regSuccess = '<div class="reg-text3">不存在该序列号！</div>';
                                this.showReg = true;
                                
                            }
                            else if(res.data.status === 10013){
                                this.regSuccess = '<div class="reg-text3">请勿上报自己产品！</div>';
                                this.showReg = true;
                            }
                            else if(res.data.status === 10011){
                                this.regSuccess = '<div class="reg-text3">该产品未绑定小程序<br/>请通过其他途径联系失主</div>';
                                this.showReg = true;
                            }else{
                                this.regSuccess = '<div class="reg-text3">系统出错<br/>请稍后再试</div>';
                                this.showReg = true;
                            }
                        })
                    }
                }else{
                    this.showModal = true;
                }
            }else{
                this.showModal2 = true;
            }
        },
        // 选择日期后的事件
        onInput(event) {
            this.currentDate = timeFormat(event.mp.detail.toString());
            this.showDate = false;  
        },
        // 弹出选择日期的框
        selDate(){
            this.showDate = true;
        },
        goIntrou(){
            wx.navigateTo({
                url:'/pages/regis/main'
            })
        },
        regMethod(){
            if(this.hasAgree){
                if(getApp().globalData.phone === 1){ //再判断有没有绑定手机
                    if(this.uid ==='' || this.currentDate === '选择购买日期'){
                        wx.showToast({
                            title: '请输入序列号和日期',
                            icon: 'none',
                            duration: 2000
                        })

                    }else{

                        let data = {
                            token:wx.getStorageSync('token'),
                            goodsCode:this.uid,
                            goodsAddTime:this.currentDate
                        }
                        
                        wxRequest('/miniProgram/api/goods/binding',{data:data}).then(res => {
                            this.isRegSuccess = false;
                            if(res.data.status === 0){
                                this.regSuccess = '<div class="reg-text3">产品注册成功，出发币已到账<br/>恭喜您获得终身保修资格</div>';
                                getApp().globalData.integralNum = res.data.data;
                                this.isRegSuccess = true;
                                this.goodsType = res.data.goodsType;
                                this.iconImg = res.data.iconImg;
                                this.iconText = res.data.iconText;
                            }
                            else if(res.data.status === 1){
                                this.regSuccess = '<div class="reg-text3">商品已绑定<br/>请勿重复绑定</div>';
                            }else if(res.data.status === 10009){
                                this.regSuccess = '<div class="reg-text3">序列号不正确</div>';
                            }else{
                                this.regSuccess = '<div class="reg-text3">绑定失败</div>';
                            }
                            this.showReg = true;
                        })

                    }
                }else{
                    this.showModal = true;                    
                }
            }else{
                this.showModal2 = true;
            }

        },
        hideReg(){
            if(this.isRegSuccess){
                wx.switchTab({
                    url:'/pages/member/main'
                })
            }
            this.showReg = false;
        },
        closeDate(){
            this.showDate = false;
        },
        getModal(e){
            console.log(e)
            this.showModal = e.showModal;
        },
    },
    onShareAppMessage(res) {
        //转发时携带 shareTicket才能在回调中获取到shareTickets
        wx.showShareMenu({
            withShareTicket: true
        }) 

    },
    onShow(){
        if(getApp().globalData.login === 1){
            this.hasAgree = true;
            this.showModal2 = false;
        }
        if(getApp().globalData.phone === 1){
            this.showModal = false;        
        }

    },
    onLoad (query) {
        let that = this;

        console.log('query',query)
        this.uid = query.scene;
        console.log('scene',decodeURIComponent(query.scene))
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

<style scope>
@import url('../../components/common.css');

.page{
    padding: 40px 10vw;
}
.question{
    position: fixed;
    top: 10px;
    right: 10px;
    width: 20px;
    height: 20px;
}
img{
    width: 100%;
    height: 100%;
}
.scan-code{
    width: 140px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 15px;
    color: #FFD637;
    margin: 0 auto;
    margin-bottom: 50px;
}
.scan-img{
    width: 150px;
    height: 150px;
}

.input{
    margin-top: 16px;
    height: 40px;
    padding-left: 10px;
    border: 1px solid rgb(229,229,229);
    border-radius: 19px;
    color: #666;
    font-size: 14px;
}
.input-time{
    display: flex;
    align-items: center;
}
.time-title{
    color: #333;
    width: 80px;
    text-align: center;
    height: 20px;
    line-height: 20px;
    border-right: 1px solid rgb(229,229,229);
}
.sel-time{
    padding-left: 10px;
    color: #999;
    width: calc(100% - 100px);
}
.color6{
    color: #666;
}
.form-text{
    margin-top: 8px;
    padding-left: 10px;
    font-size: 10px;
    color: #999;
}
.input-placeholder{
    color: #999;
}
.z-btn{
    margin-top: 50px;
    background: #FFD637;
    height: 42px;
    line-height: 42px;
    text-align: center;
    border-radius: 20px;
}
.s-btn{
    margin-top: 20px;
    border: 1px solid #FFD637;
    color: #FFD637;
    height: 42px;
    line-height: 42px;
    text-align: center;
    border-radius: 20px;
}
.modal3{
    width: 280px;
    text-align: center;
    font-size: 14px;
}
.modal-logo{
    width: 50px;
    height: 50px;
    margin: 0 auto;
    margin-top: 16px;
}
.modal-logo-text{
    color: #999;
    font-size: 12px;
    text-align: center;
    position: relative;
    top: 4px;
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
    font-size: 16px;
}

.text-center{
    text-align: center !important; 
}

</style>