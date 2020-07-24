<template>
  <div class="page">

      <div class="bold font14">老朋友，您好！</div>
      <div class="font13 marginTop10">
        即日起，地平线8号旅行箱全面实现“一箱一码”的功能。
      </div>
      <div class="font13 marginTop10">
        自2020年3月1日起，地平线8号每一个旅行箱出厂都附有一张“唯一识别码”。若您的旅
        行箱是购于3月1日前，或因出厂批次不同缺码的，您可以随时在“地平线8号会员中心”
        小程序首页申请补码。
      </div>
      <div class="font13 marginTop10">
        “唯一识别码”是您享受多项会员服务的重要凭证。扫码即可进入“地平线8号会员中心”
产品注册页面，授权相关登录信息后，此时产品序列号已自动填入，您只需要填写您订单上
的下单时间，点击“注册产品”即可。注册之后您也将成为地平线8号会员，享受终身保修、
积分兑换、会员折扣、失物寻回、免费抽奖等多项福利。
      </div>
      <div class="font13 marginTop10">
        关于地平线8号会员中心小程序的使用指南及会员福利<span style="color:#00a4f7;text-decoration:underline" @click="goDetail">点击查看</span>
      </div>
      <img style="width:100%;margin-top:10px" src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/9f2dc22a-4678-4730-82fa-139f3d5f52e5.png"  mode='widthFix'/>
      <div class="font13 marginTop10">
        （贴纸示例）
      </div>
    
  </div>
</template>

<script>
export default {
    methods: {
        goDetail(){
            let url = encodeURIComponent(`https://mp.weixin.qq.com/s/E8CJScY481pavwHL-9UigQ`)

            wx.navigateTo({
                url:'/pages/articledetail/main?url='+url
            })
        }
    },
}
</script>

<style scoped>
.page{
    padding: 10px;
}
.title{
    padding: 10px 0 10px 0;
    text-align: center;
}
.bold{
    font-weight: bold;
}
.font13{
    font-size: 13px;
}
.font14{
    font-size: 14px;
}
.marginTop10{
    margin-top: 10px;
}
</style>