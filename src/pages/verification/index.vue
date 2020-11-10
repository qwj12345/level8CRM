<template>
  <div>
      <div class="v-scan-code">
          <div class="v-scan-img">
              <img src="/static/images/scan.png" @click="scanCode"/>
          </div>
          <div>扫描二维码核销券码</div>
      </div> 
      <div class="hx-btn" @click="goRecord">查看已核销订单</div>
  </div>
</template>

<script>
import {wxRequest} from '@/components/common'
export default {
    data() {
        return {
            
        }
    },
    methods: {
        scanCode(){
            wx.scanCode({
                success (res) {
                    console.log(res)
                    // 判断是不是核销码  
                    if(res.result!==undefined){
                        wx.showLoading({
                            title:"请稍后"
                        })
                        let exchangeQrcode = res.result.split('-')[1];
                        // 调用核销二维码接口   
                        let data = {
                            token:wx.getStorageSync('token'),
                            exchangeQrcode
                        }
                        wxRequest('/miniProgram/api/trophy/checkExchangeQrcode',{data:data}).then(res => {
                            if(res.data.status===0){
                                wx.showToast({
                                    title: '核销成功',
                                    icon: 'success',
                                    duration: 2000
                                })
                            }else{
                               wx.showToast({
                                    title: res.data.msg,
                                    icon: 'none',
                                    duration: 2000
                                }) 
                            }
                            // wx.hideLoading();
                        })
                    } else{ 
                        wx.showToast({
                            title: '请扫描带核销码二维码',
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
        goRecord(){
            wx.navigateTo({
                url:"/pages/coderecord/main"
            })
        }
    },

}
// 
</script>

<style>
.v-scan-code{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 25vw;
    margin-bottom: 40vw;
    color: #ffd637;
    font-size: 16px;
    letter-spacing: 1px;
}
.v-scan-img{
    width: 45vw;
    height:45vw;
}
.hx-btn{
    width: 70vw;
    margin: 0 auto;
    font-size: 16px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 26px;
    font-weight: bold;
    letter-spacing: 1px;
    background: #ffd637;
}
</style>