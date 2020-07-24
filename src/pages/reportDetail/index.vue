<template>
  <div>
      <div class="first-title">上报信息</div>
      <div class="must-input">
          <div class="m-input border-bottom">
            <div class="input-title">姓名</div>
            <input v-model="name" class="input" placeholder="输入拾到者姓名"/>
          </div>
          <div class="m-input">
            <div class="input-title">联系电话</div>
            <input v-model="phone" class="input" placeholder="请输入常用手机号"/>
          </div>
      </div>
    <div class="must-input padding-bottom">
        <div class="m-input">
            <div class="input-title">留言</div>
        </div>
        <textarea v-if="showText" v-model="remark" class="textarea" placeholder="请输入留言"/>
        <div class="textarea" v-if="!showText">

          </div>
    </div>
    <!--  -->
    <div class="report-btn" @click="report">
        确认提交
    </div>
        <van-popup :show="showModal" custom-class="popup-class" >
          <div class="modal2">
            <div v-html="reportText"  @click="goMsg">
                
            </div>
            <div class="reg-btn" @click="hideModal">
                确定
            </div>
          </div>
      </van-popup>
  </div>
</template>

<script>
import {wxRequest} from '@/components/common'

export default {
    data(){
        return{
            showText:true,
            isGO:false,
            showModal:false,
            name:'',
            phone:'',
            remark:'',
            uid:'',
            reportText:'<div class="reg-text">感谢您的帮助，我们已通知失主尽快已您联系，请保持手机畅通，谢谢！</div>'
        }
    },

    methods: {
        goMsg(){
            if(this.isGo)
                wx.navigateTo({
                    url:'/pages/newmsg/main?type=0'
                })
        },
        
        report(){
            if(this.name===''||!(/^1[3456789]\d{9}$/.test(this.phone))){
                wx.showToast({
                    title: '请输入姓名和正确的手机号',
                    icon: 'none',
                    duration: 2000
                })
             
            }else{
                let data = {
                    token:wx.getStorageSync('token'),
                    goodsCode:this.uid,
                    userName :this.name,
                    userPhone :this.phone,
                    remark:this.remark
                }
                console.log(data)
                wxRequest('/miniProgram/api/goods/collect/contact',{data:data}).then(res => {
                    this.isGo = false;
                    if(res.data.status === 0){
                        if(res.data.verlustanzeige){
                            this.reportText = '<div class="reg-text">非常感谢您的热心帮助<br/>我们已将失主的联系方式<br/>发送给你,<span class="colorff">点击查看</span></div>';
                            this.isGo = true;
                        }else{
                            //
                            this.reportText = '<div class="reg-text">感谢您的帮助，我们已通知失主尽快已您联系，请保持手机畅通，谢谢！</div>';
                        }
                        this.showText = false;
                    }else if(res.data.status === 10009 || res.data.status === 10010){
                        this.reportText = '<div class="reg-text">填写错误<br/>请重新填写</div>';
                        this.showText = false;

                    }
                    else if(res.data.status === 10012){
                        this.reportText = '<div class="reg-text">手机号不正确</div>';
                        this.showText = false;

                    }else{
                        this.reportText = '<div class="reg-text">系统出错<br/>请稍后再试</div>';
                        this.showText = false;

                    }
                    this.showModal = true;

                })
                // this.showModal = true;
            }
        },
        hideModal(){
            this.showModal =false;
            setTimeout(() => {
                this.showText = true;
            },200)

        }
    },
    onLoad(query){
        console.log('query',query)
        this.uid = query.code;
    }
}
</script>

<style>
page{
    background: #efeff4;
}
.first-title{
    color: #999;
    font-size: 14px;
    padding: 10px;
}
.must-input{
    background: #fff;
    padding-left: 10px;
    font-size: 14px;
}
.m-input{
    display: flex;
    align-items: center;
    height: 40px;
    line-height: 40px;
}
.border-bottom{
    border-bottom: 1px solid #efeff4;
}
.input-title{
    width: 80px;
}
.input{
    color: #666;
    width: calc(100vw - 100px);
}
.input-placeholder{
    color: #999;
}
.padding-bottom{
    padding-bottom: 20px;
}
.textarea{
    height: 100px;
    color: #666;
}
.report-btn{
    background: #FFD637;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 22px;
    width: 80vw;
    margin: 0 auto;
    margin-top: 50px;
    font-size: 18px;
}
.modal2{
    width: 270px;
    text-align: center;
}
.popup-class{
    border-radius: 10px;
}
.colorff{
  color: #ff7836;
  font-weight: bold;
  text-decoration:underline;
}
.reg-text{
    padding: 20px 30px;
}

.reg-btn{
    color: #FFD637;
    height: 46px;
    line-height: 46px;
    text-align: center;
    border-top: 1px solid #cecece;
}
</style>