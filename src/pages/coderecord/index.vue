<template>
  <div>
      <div class="verification-header">
          <div class="verification-title">总共核销</div>
          <div class="verification-number">{{list.length}}<span>单</span></div>
      </div>
      <!-- 记录列表 -->
      <div class="verification-list">
          <div class="list-header">
              <div class="list-item">日期</div>
              <div class="list-item border-both">券码</div>
              <div class="list-item">状态</div>
          </div>
          <div class="record-item" v-for="(item,key) in list" :key="key">
              <div>{{item.exchangeQrcodeCheckTime}}</div>
              <div>{{item.exchangeCode}}</div>
              <div>{{trophyStatusList[item.trophyStatus]}}</div>
          </div>

      </div>
  </div>
</template>

<script>
import {timeFormat,timeFormat1,wxRequest} from '@/components/common';
export default {
    data() {
        return {
            list:[],
            trophyStatusList:["未发货","发送中","已发货","已使用","待退款","已退款"]
        }
    },
    onLoad(){
 
        wx.showLoading({
            title:"加载中"
        })
        let data = {
            token:wx.getStorageSync('token')
        }
// 
        wxRequest('/miniProgram/api/trophy/myCheckExchangeQrcodeList',{data}).then(res => {
           let record = res.data.data;
           record.map(item=>{
               return item.exchangeQrcodeCheckTime=timeFormat1(item.exchangeQrcodeCheckTime,0);
           })
           this.list = [...record];
           wx.hideLoading()
        })
    }
}
</script>

<style>
.verification-header{
    background: #ffd637;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 0 40px;
}
.verification-title{
    font-size: 16px;
    margin-bottom: 10px;
    letter-spacing: 1px;
}
.verification-number{
    font-weight: bold;
    font-size: 42px;
    display: flex;
}
.verification-number>span{
    font-size: 14px;
    font-weight: normal;
    align-self: flex-end;
    margin-bottom: 6px;
    margin-left: 4px;
}
.verification-list{
    margin-top: -16px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    padding-top: 20px;
    background: #fff;
}
.list-header{
    display: flex;
}
.list-item{
    width: calc(100vw / 3);
    text-align: center;
    font-size: 16px;
    color: #333;
    letter-spacing: 1px;
    margin-bottom: 8px;
}
.border-both{
    box-sizing: border-box;
    border-right: 1px solid #eee;
    border-left: 1px solid #eee;
}
.record-item{
    font-size: 14px;
    color: #999;
    display: flex;
}
.record-item>div{
    width: calc(100vw / 3);
    text-align: center;
    padding: 8px 0;
}
</style>