<script>
import global from '@/components/global'
import {getToken,saveUser,wxRequest} from '@/components/common'

export default {
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */

    let logs
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({key: 'logs'}).data || []
      logs.unshift(Date.now())
      mpvue.setStorageSync({
        key: 'logs',
        data: logs
      })
    } else {
      logs = mpvue.getStorageSync('logs') || []
      logs.unshift(Date.now())
      mpvue.setStorageSync('logs', logs)
    }

    //----------登录----------------
    
    wx.login({
      success (res) {
        if (res.code) {
          getApp().globalData.code = res.code;
          wx.getUserInfo({
            success: function(e) {//用户已授权
              getApp().globalData.login = 1;
                let data= {
                    encryptedData: e.encryptedData,
                    iv: e.iv,
                    code:getApp().globalData.code
                }
               
                  // -----------------判断是否绑定手机号------------------
                  wxRequest('miniProgram/api/get/crm/token',{data}).then(res => {
                      
                      if(res.data.status === 0){
                        wx.setStorageSync('token', res.data.token);
                        // let url = encodeURIComponent('http://192.168.65.235:9090/wxmail/saveUserInfo')
             
                        wxRequest('miniProgram/api/haveOpenidGzh',{data:{token:res.data.token}}).then(res1 => {
                            console.log('res1',res1)  
                            if(res1.data.status===0){                
                              wx.navigateTo({
                                url:'/pages/webpage/main'
                              })
                            }
                            
                        })
                        
                         // 存储头像和姓名
                        saveUser(e.userInfo.nickName,e.userInfo.avatarUrl,e.userInfo.gender);
                        getApp().globalData.phone = 1;
                        console.log('已绑定手机号');
                      }else{
                        getApp().globalData.phone = 0;
                      }
                  })
                  // ------------------------------
            },
            fail(err){ //用户未授权
              getApp().globalData.login = 0;
              getApp().globalData.hasAgree = false;
              console.log(err)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }

      }
    })

  },
  onLoad(){
  },
  
  log () {
    console.log(`log at:${Date.now()}`)
  }
}
</script>

<style>

/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
/* page{
  background: rgba(244, 240, 240, 0.79);
} */
</style>
