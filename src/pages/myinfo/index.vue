<template>
  <div>
      <div class="s-title">
        <div class="icon">
          <img  src="/static/images/address-user2.png"/>
        </div>
        <div class="title-text">
          个人资料
        </div>
      </div>
      <!--  -->
      <div class="form">
        <div class="form-item">
          <div class="form-title">
            <text v-if="!hasEdit" class="colorRed">*</text> 姓名
          </div>
          <input placeholder="请输入姓名" v-model="name"  class="input" :disabled="hasEdit"/>
        </div>
        <div class="form-item">
          <div class="form-title">
            <text v-if="!hasEdit" class="colorRed">*</text> 性别
          </div>
          <input placeholder="请选择性别" v-model="gender" class="input marginR10" disabled='true' @click="chooseGender"/>
          <div  v-if="!hasEdit" class="face-right" @click="chooseGender">
            <img src="/static/images/face-right.png"/>
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">
            <text v-if="!hasEdit" class="colorRed">*</text> 生日
          </div>
          <input placeholder="生日仅可填写一次，不支持修改"  class="input marginR10" v-model="birthday" disabled='true' @click="selDate"/>
          <div  v-if="!hasEdit" class="face-right"  @click="selDate">
            <img src="/static/images/face-right.png"/>
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">
            <text v-if="!hasEdit" class="colorRed">*</text> 手机号
          </div>
          <input placeholder="请输入手机号" v-model="phone" class="input" :disabled="hasEdit"/>
        </div>
      </div>
      <!--  -->
      <div class="s-title">
        <div class="icon">
          <img  src="/static/images/address-user.png"/>
        </div>
        <div class="title-text">
          地址
        </div>
      </div>
      <!--  -->
      <div class="form">
        <div class="form-item">
          <div class="form-title">
            <text v-if="!hasEdit" class="colorRed">*</text> 选择地区
          </div>
          <input placeholder="地区信息" class="input marginR10" v-model="area" disabled='true' @click="chooseArea"/>
          <div v-if="!hasEdit" class="face-right" @click="chooseArea">
            <img src="/static/images/face-right.png"/>
          </div>
        </div>
        <div class="form-item-textarea">
          <div class="form-title">
            详细地址
          </div>
          <textarea v-if="showText" placeholder="街道门牌信息" v-model="areaDetail" class="textarea" :disabled="hasEdit"/>
          <div class="textarea" v-if="!showText">

          </div>
        </div>
        <div class="form-item">
          <div class="form-title">
            邮编
          </div>
          <input  class="input" v-model="postal" :disabled="hasEdit"/>
        </div>
      </div>
      <!--  -->
      <div class="report-btn" @click="userInfoBtn">
          {{btnText}}
      </div>
      <!--  -->
      <van-popup :show="showGender"  position="bottom" close-on-click-overlay="true" @close="closeGender" >
        <div class="gender-panel">
          <div class="gender-man" @click="chooseSex(1)">
            男
          </div>
          <div class="gender-lady" @click="chooseSex(2)">
            女
          </div>
        </div>
      </van-popup>
      <!--  -->
      <van-popup :show="showArea" position="bottom" close-on-click-overlay="true" @close="closeArea" >
        <van-area :area-list="areaList" @confirm="confirmArea" @cancel="closeArea" />
      </van-popup>
       <!-- 选择日期的弹出框 -->
      <van-popup :show="showDate" position="bottom" close-on-click-overlay="true" @close="closeDate" >
        <van-datetime-picker :value="nowDate" type="date" :min-date='minDate' @confirm="onInput" @cancel="closeDate"/>
      </van-popup>
      <!--  -->
      <van-popup :show="showMsg" custom-class="popup-class3" >
        <div class="modal3">
            <div class="reg-text3">
                {{msgText}}
            </div>
        <div class="reg-button" @click="hideMsg">
            确定
        </div>
        </div>
    </van-popup>
  </div>
</template>

<script>
import {timeFormat,wxRequest} from '@/components/common'
import areas from '../../../static/area.js'
export default {
  data(){
    return{
      showText:true,
      showMsg:false,
      name:'',
      phone:'',
      gender:'',
      area:'',
      areaDetail:'',
      areaList:areas,
      postal:'',
      showArea:false,
      showDate:false,
      showGender:false,
      hasEdit:true,
      birthday:'',
      nowDate:new Date().getTime(),
      minDate:-631180800000,
      btnText:'编辑',
      firstEditBir:false,
      msgText:''
    }
  },

  methods: {
    hideMsg(){
      this.showMsg = false;
      setTimeout(() => {
          this.showText = true;
      },200)
    },
    chooseArea(){
      if(!this.hasEdit){
        this.showArea = true;
        this.showText = false;
      }
    },
    closeArea(){
      this.showArea = false;
      setTimeout(() => {
          this.showText = true;
      },200)
    },
    confirmArea(e){
      console.log(e.mp.detail.values[0].name)
      this.area = e.mp.detail.values[0].name + ' ' + e.mp.detail.values[1].name + ' ' + e.mp.detail.values[2].name;
      this.showArea = false;
      setTimeout(() => {
          this.showText = true;
      },200)

    },
    closeDate(){
        this.showDate = false;
        setTimeout(() => {
            this.showText = true;
        },200)
    },
    // 选择日期后的事件
    onInput(event) {
        this.birthday = timeFormat(event.mp.detail.toString());
        this.showDate = false; 
        setTimeout(() => {
            this.showText = true;
        },200)

    },
    // 弹出选择日期的框
    selDate(){
      console.log(this.firstEditBir)
      console.log(this.hasEdit)
      if(!this.firstEditBir || this.hasEdit){
        if(!this.hasEdit){
          this.showMsg = true;
          this.msgText = '您的生日只能编辑一次';
        }
      }else{
      console.log(new Date().getTime())
        this.showDate = true;
      }
      this.showText = false;

    },
    chooseGender(){
      if(!this.hasEdit){
        this.showGender = true;
        this.showText = false;
      }
    },
    closeGender(){
      this.showGender = false;
      setTimeout(() => {
          this.showText = true;
      },200)
    },
    chooseSex(index){
      this.showGender = false;
      setTimeout(() => {
          this.showText = true;
      },200)
      if(index === 1){
        this.gender = '男';
      }else{
        this.gender = '女';
      }
    },
    userInfoBtn(){
      if(this.hasEdit){
        this.hasEdit = false;
        this.btnText = '确认提交';
      }else{         
        if(!(/^1[3456789]\d{9}$/.test(this.phone))){
          this.showMsg = true;
          this.msgText = '请输入正确手机号！'
          this.showText = false;
        }else{
          let data = {
            token:wx.getStorageSync('token'),
            name:this.name,
            userBirthday:this.birthday,
            sex:this.gender==='男'?1:0,
            userPhone:this.phone,
            userAddress:this.area,
            userAddressInfo:this.areaDetail,
            zipCode:this.postal
          }
          console.log(data)
          wxRequest('miniProgram/api/user/info/update',{data:data}).then(res => {
            if(res.data.status === 0){
              wx.showToast({
                          title: '保存成功',
                          icon: 'success',
                          duration: 1000
                      })
              getApp().globalData.integralNum = res.data.data.integralNum;
              this.hasEdit = true;
              this.firstEditBir = false;
              this.btnText = '编辑';
            }else if(res.data.status === 10010){
              this.showMsg = true;
              this.msgText = '请输入完整！';
              this.showText = false;
            }else{
              this.showMsg = true;
              this.msgText = '系统出错，请稍后再试';
              this.showText = false;
            }
          })
        }

      }
    }
  },
  onShow(){
    let pages = getCurrentPages(); 
    let prevPage = pages[pages.length - 2];   //上一页
    prevPage.flag = 1;
    console.log(prevPage)
  },
  onLoad(){
    let data = {
      token:wx.getStorageSync('token')
    }
    wxRequest('/miniProgram/api/user/info',{data:data}).then(res => {
      let userInfo = res.data.data;
      if(userInfo.sex === 1) {
        this.gender = '男';
      }else if(userInfo.sex === 2){
        this.gender = '女';
      }else{
        this.gender = '未知';
      }

      this.phone = userInfo.userPhone;

      if(userInfo.name === '')
      {
        this.firstEditBir = true;
        this.hasEdit = false;
        this.btnText = '确认提交';
      }
      else{
        this.hasEdit = true;
        this.btnText = '编辑';
        this.name = userInfo.name;
        this.postal = userInfo.zipCode;
        this.birthday = userInfo.userBirthday;
        this.area = userInfo.userAddress;
        this.areaDetail = userInfo.userAddressInfo;
      }
    })
  }
}
</script>

<style>
page{
  background: #efeff4;
}
img{
  width: 100%;
  height: 100%;
}
.s-title{
  padding: 30px 5vw 10px 5vw;
  display: flex;
}
.icon{
  width: 18px;
  height: 18px;
  margin-right: 4px;
}
.title-text{
  font-size: 14px;
  color: #999;
}
.form{
  padding: 0 10px;
  background: #fff;
}
.form-item{
  padding: 10px;
  border-bottom: 1px solid #efeff4;
  display: flex;
  font-size: 14px;
  align-items: center;
}
.form-item-textarea{
  padding: 10px;
  border-bottom: 1px solid #efeff4;
  display: flex;
  font-size: 14px;
}
.form-title{
  width: 80px;
}
.input{
  width: calc(100% - 110px);
}
.marginR10{
  margin-right: 14px;
}
.face-right{
  width: 16px;
  height: 16px;
}
.textarea{
  padding: 2px 0 0 0;
  width: calc(100% - 110px);
  height: 50px;
}
.report-btn{
    background: #FFD637;
    height: 48px;
    line-height: 48px;
    text-align: center;
    border-radius: 30px;
    width: 80vw;
    margin: 0 auto;
    margin-top: 50px;
    font-size: 18px;
}
.gender-panel{
  background: #fff;
}
.gender-man{
  text-align: center;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #efeff4;
}
.gender-lady{
  text-align: center;
  height: 50px;
  line-height: 50px;
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
.colorRed{
  color: red;
}
</style>