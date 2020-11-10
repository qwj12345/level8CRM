<template>
  <div>
      <web-view v-if="showWeb" :src="url" ></web-view>
      <div v-if="!showWeb" v-html="articleHtml">
          {{articleHtml}}
      </div>
  </div>
</template>

<script>
import {wxRequest} from '@/components/common'

export default {
    data(){
        return{
            id:'',
            url:'',
            showWeb:true,
            articleHtml:''
        }
    },
    onShareAppMessage(res) {   
        //转发时携带 shareTicket才能在回调中获取到shareTickets 
        wx.showShareMenu({
            withShareTicket: true
        }) 

        let path = '';
        if(this.url === undefined || this.url === ''){
            path = '/pages/articledetail/main?article='+encodeURIComponent(this.articleHtml);
        }else{
            path = '/pages/articledetail/main?url='+encodeURIComponent(this.url);
        }
        // 
        let data = {
            token:wx.getStorageSync('token'),
            id:this.id
        }
        // 转发任务
        wxRequest('/miniProgram/api/notification/forwarding',{data:data}).then(res => {
            getApp().globalData.integralNum = res.data.totalIntegral;
        })
        return {
            path: path // 路径，传递参数到指定页面。
        }

    },
    
    onLoad(query){
        this.url = decodeURIComponent(query.url);
        this.id = query.id;

        if(this.url === undefined || this.url === '' || this.url === 'undefined'){
            this.showWeb = false;
            this.articleHtml = decodeURIComponent(query.article);

        }else{
            this.showWeb = true;
        }
        let data = {
            token:wx.getStorageSync('token'),
            id:query.id
        }
        // 是否阅读
        wxRequest('/miniProgram/api/notification/reading',{data:data}).then(res => {

        })
    }
}
</script>

<style>

</style>