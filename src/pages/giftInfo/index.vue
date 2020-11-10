<template>
  <div>
      <div class="info-icon">
          <img style="width:100%" src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/ecf71941-db00-4a6e-9486-2be8901b2c6c.png" mode='widthFix'/>
      </div>
      
      <div style="width:90vw;margin:10px auto 20px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:30px">
            <div style="color:#000;font-size:18px">兑换码：<span style="font-weight:bold">{{exchangeCode}}</span></div>
            <div style="font-size:14px;color:#000;padding: 4px 10px;background:#FFD637;border-radius:18px" @click="copyNumber">复制兑换码</div>
      </div>
          <div v-html="infoHtml"></div>
      </div>
      <div style="color:#888;font-size:12px;width:100vw;text-align:center;margin-bottom:12px">*本活动最终解释权归地平线8号品牌所有</div>

  </div>
</template>

<script>
export default {
    data() {
        return {
            infoHtml:'',
            exchangeCode:'12465465'
        }
    },
    methods: {
        copyNumber(){
            wx.setClipboardData({
                data: this.exchangeCode,
                success: function () {
                    // 添加下面的代码可以复写复制成功默认提示文本`内容已复制` 
                    wx.showToast({
                        title: '复制成功',
                        duration: 3000
                    })
                },
                fail(err){
                    console.log(err)
                }
            })
        },
    },
    onLoad(query){
        this.infoHtml = decodeURIComponent(query.exchangeInfo);
        this.exchangeCode = query.exchangeCode;
        console.log(this.exchangeCode)  
    }
}
</script>

<style>
    page{
        background: rgb(247, 248, 248);
    }
    .info-icon{
        width: 20vw;
        margin: 30px auto 20px;
    }
</style>