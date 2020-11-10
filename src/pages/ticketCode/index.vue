<template>
  <div>
    <img class="header-img" src="/static/images/bg_img.png" mode="widthFix"/>
    <div class="code-content">
      <div class="code-info">
        <img @longpress="saveImg" :src="code.trophyImg" mode="aspectFill"/>
        <div>{{code.trophyName}}</div>
      </div>
      <div class="save-code">
        <div class="code-img">
          <div class="filter-blur" v-if="code.trophyStatus!==2">
             <img style="width:100%;height:100%;filter:blur(6rpx)"  :src="code.exchangeQrcode"/>
          </div>
          <div class="filter-blur-btn" v-if="code.trophyStatus!==2">
              {{trophyStatusList[code.trophyStatus]}}
            </div>
          <img @longpress="saveImg" @click="preImg" style="width:100%;height:100%"  :src="code.exchangeQrcode"/>
        </div>
        <span style="color:#555" v-if="code.trophyStatus!==2">长按或单击二维码保存</span>
      </div>
      
      <div style="text-align:center;font-size:32rpx;margin-bottom:40rpx">兑换码：{{code.exchangeCode}}</div>
      <div class="code-user">
        <div style="font-weight:bold;font-size:16px;">使用流程:</div>
        <div style="color:#555;font-size:14px;line-height:22px;margin-top:4px">
          1 、本券限樊登读书未注册用户使用，需先在 【 樊友精选 】 公众号兑换领取，领取成功后再下载樊登读书 App 使用<br/>2 、兑换方式：获得兑换码一进入 【 樊友精选 】 公众号兑换－对话框输入文字［兑换码］一输入兑换码、手机号码及验证码一领取成功一下载／登录樊登读书 App<br/>3 、从兑换成功当日起增加 14 天 VIP 会期，如有疑问，请添加微信客服咨询： readingee <br/>4 、本活动兑换码自领取之日起 3 天内有效
        </div>
      </div>
    </div>
    <div style="color:#999;font-size:12px;margin-top:80px;margin-bottom:30px;text-align:center">*本活动最终解释权归地平线8号品牌所有</div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            code:{},
            trophyStatusList:["未发货","发送中","已发货","已使用","待退款","已退款"]
        }
    },
    methods: {
      preImg(){
        wx.previewImage({
            //当前显示图片
            urls: [this.code.exchangeQrcode]
        })
      },
      saveImg(){
            wx.downloadFile({//下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径 
              url: this.code.exchangeQrcode,
              success: function (res) {
                  console.log(res)
                  // 下载成功后再保存到本地
                  wx.saveImageToPhotosAlbum({
                      filePath: res.tempFilePath,//返回的临时文件路径，下载后的文件会存储到一个临时文件
                      success: function (res) { 
                        wx.showToast({
                            title: '成功保存到相册',
                            icon: 'success'
                        })
                      },
                      fail(err){
                          console.log('err',err)
                      }
                  })
              },
              fail(err){
                  console.log('err2',err);
              }
          })
      }
    },
    onLoad(query){
      this.code = JSON.parse(query.code);
      if(this.code.exchangeQrcode==="")
        this.code.exchangeQrcode = "https://level8cases.oss-cn-hangzhou.aliyuncs.com/933b593b-a419-493f-bf0a-26fcb322ea98.png"; 
      else
        this.code.exchangeQrcode = decodeURIComponent(this.code.exchangeQrcode);
      
    }
}
</script>

<style>
img{
  width:100%
}
page{
    background: #efeff4;
}
.header-img{
  width: 100%;
}
.code-content{
  width: calc(100vw - 24px);
  margin: 0 auto;
  margin-top: calc(70px - 55vw);
  background: #fff;
  border-radius: 10px;
  padding: 16px 20px;
  box-sizing: border-box;
}
.code-info{
  display: flex;
}
.code-info img{
  width: 46px;
  height:46px;
  margin-right: 10px;
  border-radius: 6px;
}
.code-info div{
  font-size: 16px;
  color: #444;
  padding: 2px 0;
  width: calc(100% - 56px);
}
.save-code{
  margin: 40px 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
}
.code-img{
  position: relative;
  width: 42vw;
  height: 42vw;
  margin-bottom: 10px;
}

.filter-blur{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  /* display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: rgba(255, 255, 255);
  filter: blur(20px); */
}
.filter-blur-btn{
  position: absolute;
  transform: translate(-50%,-50%);
  top: 50%;
  left: 50%;
  padding: 8px 0;
  width: 80px;
  text-align: center;
  background: #ffd637;
  font-size: 13px;
  color: #333;
  border-radius: 18px;
}
</style>