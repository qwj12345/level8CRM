<template>
  <div>
      <div class="message-item" v-for="(item,key) in messages" :key="key">
          <div class="msg-time-title">
              {{item.releaseTime}}
          </div>
          <div class="msg-arti-content"   @click="goDetail(item)">
              <div class="msg-title">
                  <span class="tag">{{types[item.articleType]}}</span>{{item.title}}
              </div>
              <!--  -->
              <div class="msg-describes">
                  {{item.describes}}
              </div>
              <!--  -->
              <div class="article-img" v-if="item.articleType === 0 || item.articleType === 3">
                  <img :src="item.articleImg"/>
              </div>
              <!--  -->
              <div class="go-detail" v-if="item.articleType === 0 || item.articleType === 3">
                  <div>阅读原文</div>
                  <div class="msg-right">
                    <div class="right-padding-r" v-if="item.forwardFlag===0">
                        分享即得<span class="right-text-num">{{item.integralNum}}个</span>出发币
                    </div>
                    <div class="go-detail-img">
                        <img src="/static/images/face-right.png"/>
                    </div>
                  </div>
              </div>
              <div class="height30" v-if="item.articleType !== 0 && item.articleType !== 3">

              </div>
          </div>
      </div>
  </div>
</template>

<script>
import {timeFormat1,wxRequest} from '@/components/common'
export default {
    data(){
        return{
            size:10,
            page:0,
            totalPage:0,
            url:'',
            messages:[],
            types:['独家精选','通知','通知','独家精选','通知']
        }
    },
    methods: {
        goDetail(item){
            let url = encodeURIComponent(item.wxUrl)
            let content = encodeURIComponent(item.content)
            if(item.articleType === 0 || item.articleType === 3){
                if(item.wxUrl !== '' &&  item.wxUrl !== undefined)
                    wx.navigateTo({
                        url:'/pages/articledetail/main?url='+url+'&id='+item.id
                    })
                else
                    wx.navigateTo({
                        url:'/pages/articledetail/main?article='+content+'&id='+item.id
                    })
            }
        },
        getList(){
            wx.showLoading({
                title:'加载中'
            })
            let data = {
                token:wx.getStorageSync('token'),
                page:this.page,
                size:this.size
            } 
            wxRequest(this.url,{data:data}).then(res => {
                console.log(res)
                res.data.data.content.forEach(item => {
                    item.releaseTime = timeFormat1(item.releaseTime);
                })
                this.messages = this.messages.concat(res.data.data.content);
                this.totalPage = Math.ceil(res.data.data.total/this.size);
                wx.hideLoading();
            })
        }
    },
    onReachBottom(){
        if(this.page === this.totalPage-1){
            wx.showToast({
                title:'已经到底啦',
                icon:'none',
                duration:1000
            })
        }else{
            this.page++;
            this.getList();
        }
    },
    onShareAppMessage(res) {
        //转发时携带 shareTicket才能在回调中获取到shareTickets
        wx.showShareMenu({
            withShareTicket: true
        }) 

    },
    onLoad(query){
        this.page = 0;
        this.messages = [];
        console.log(query)
        if(query.type === "0")
            this.url = '/miniProgram/api/notification/info';      //文章和通知都获取 
        else{
            this.url = '/miniProgram/api/notification/article/info';//只获取文章列表

            wx.setNavigationBarTitle({
                title: '独家精选' 
            })
        }
        this.getList();
    }
}
</script>

<style>
img{
    width: 100%;
    height: 100%;
}
page{
  background: #efeff4;
  padding: 0 5vw;
  box-sizing: border-box;
  padding-bottom: 20px;
}
.message-item{
    padding: 16px 0 0 0;
}
.msg-time-title{
    font-size: 12px;
    color: #666;
    text-align: center;
    margin-bottom: 10px;
}
.msg-arti-content{
    background: #fff;
    border-radius: 8px;
    padding: 16px 20px 0 20px;
}
.msg-title{
    margin-bottom: 8px;
    font-size: 18px;
    /* font-weight: bold; */
    line-height: 28px;
}
.tag{
    padding: 3px 8px;
    margin-right: 10px;
    border-radius: 12px;
    font-size: 14px;
    background: rgba(255,214,55, 0.3);
    color:rgb(235, 105, 18);
    font-weight: normal;
    
}

.msg-describes{
    font-size: 13px;
    color: #666;
    margin-bottom: 10px;
}
.article-img{
    width: 100%;
    height: calc(45vw - 20px);
    border-radius: 8px;
    overflow: hidden;
}
.msg-right{
    display: flex;
    font-size: 12px;
    color: #999;
}
.right-text-num{
    color: rgb(235, 105, 18);
}
.right-padding-r{
    padding-right: 6px;
}
.go-detail{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    width: 100%;
    font-size: 15px;
    color: #333;
}
.go-detail-img{
    width: 16px;
    height: 16px;
}
.height30{
    height: 30px;
}
</style>