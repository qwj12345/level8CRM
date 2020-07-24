<template>
  <div class="comingsoon">
      <img @click="prevImg" src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/question-2f5c7c43-b8de-404a-b6ea-bacbf23b4000.jpg" mode="widthFix"/>
      <div style="padding:16px 5vw;font-size:14px;color:#333;">请点击下方按钮加入地平线8号用户朋友群，免费试用活动的相关信息将在用户群及时公示及反馈。</div>
        <!-- 加入群聊 -->
        <div style="padding:20px 5.5vw 20px; "><!-- background:#e7e7e5-->
        <cell @completemessage="joinChat"  plugid='3683b2fe7eea44c5c615dccb8612f756'  />
        </div>
  </div>
</template>

<script>
export default {
    methods: {
        prevImg(){
            wx.previewImage({
                //当前显示图片
                urls: ["https://level8cases.oss-cn-hangzhou.aliyuncs.com/question-2f5c7c43-b8de-404a-b6ea-bacbf23b4000.jpg"]
            })
        },

    },
}
</script>

<style>

page{
  background:#e7e7e5;
}
img{
  width: 100vw;
}
/* .comingsoon{
  width: 100vw;
  height: 100vh;
  background: url("https://level8cases.oss-cn-hangzhou.aliyuncs.com/contact_me_qr-70ef8055-acef-4bc1-8b70-69d5a0a4fcf2.png");
  background-size: cover;
} */
</style>