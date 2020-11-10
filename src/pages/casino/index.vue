<template>
  <div class="casino">
      <div class="casino-item" v-for="(item,key) in list" :key="key">
          <img class="casino-img" :src="item.img" />
          <div class="casino-bottom">
              <div class="bottom-left">
                  <div>{{item.name}}</div>
                  <div>{{item.time}}</div>
              </div>
              <div @click="goDetail(item.id)" v-if="item.state === 'JXZ'|| item.isParticipate === 1" class="bottom-right">{{item.btnText}}</div>
          </div>
          <!-- 标签 -->
          <div class="casino-tab_red" v-if="item.state === 'JXZ' || item.state === 'YBM' || item.isParticipate === 1">
            <img :style="item.isParticipate === 1 ? 'width:60px' : ''" :src="item.isParticipate === 0 ? '/static/images/casino_red.png' : '/static/images/casino_green.png'" />
            <div>{{item.tabText}}</div>
          </div>
          <!-- 已结束 -->
          <div  @click="goDetail(item.id)"  v-if="item.state==='YJS' &&  item.isParticipate !== 1" class="over-modal">
              <img src="/static/images/casino_over.png"/>
          </div>
      </div>
  </div>
</template>

<script>
import {timeFormat,timeFormat1,wxRequest} from '@/components/common';
export default {
    data() {
        return {
            list:[]
        }
    },
    methods: {
        goDetail(id){
            wx.navigateTo({
                url:'/pages/casinoDetail/main?id='+id
            })
        },
        // 计算两个日期的差的天数   
        daysDistance(date1, date2) {     
            //parse() 是 Date 的一个静态方法 , 所以应该使用 Date.parse() 来调用，而不是作为 Date 的实例方法。返回该日期距离 1970/1/1 午夜时间的毫秒数  
            date1 = Date.parse(date1);
            date2 = Date.parse(date2);
            //计算两个日期之间相差的毫秒数的绝对值 
            var ms= Math.abs(date2 - date1); 
            //毫秒数除以一天的毫秒数,就得到了天数 
            var days = Math.floor(ms / (24 * 3600 * 1000)); 
            return days; 
        }
    },
    onShow(){
        wx.showLoading({
            title:"加载中"
        })
        let data = {
            token:wx.getStorageSync('token'),
            type:'all'
        }
        wxRequest('/miniProgram/api/lotteryActivity/lotteryActivityList',{data:data,contentType:'application/x-www-form-urlencoded',method:'POST'}).then(res => {
            wx.hideLoading();
            this.list = res.data.data;
            this.list.forEach(item => {
                // 计算日期
                let time = timeFormat1(item.prizeTime,1);
                let day =  time.split(' ')[0]; //'10月20日 18:00开奖'  
                if(item.state === 'JXZ'){
                    // 计算结束时间 
                    item.btnText = '立即参与';
                    let leaveTime = this.daysDistance(timeFormat1(new Date(),0),timeFormat1(item.prizeTime,0));
                    item.tabText = '进行中-剩余'+leaveTime+'天';
                    item.time = `${day.split('/')[0]}月${day.split('/')[1]}日 ${time.split(' ')[1]}开奖`;
                }else if(item.state === 'YBM'){
                    item.btnText = '立即查看';
                    item.tabText = '已参与';
                    item.time = `${day.split('/')[0]}月${day.split('/')[1]}日 ${time.split(' ')[1]}开奖`;
                }else if(item.state === 'WKS'){
                    item.time = `${day.split('/')[0]}月${day.split('/')[1]}日 ${time.split(' ')[1]}开奖`;
                }else{
                    item.btnText = '立即查看';
                     item.time = `${day.split('/')[0]}月${day.split('/')[1]}日 ${time.split(' ')[1]}已开奖`;
                }
                // 是否报名  防止结束后无法判断是否报名  
                item.isParticipate === 1 ? item.tabText = '已参与' :'';
            })
        })
    }
}
</script>

<style>
@import url('../../components/common.css');

page{
  background: rgb(239, 239, 244);
}
.casino{
    padding: 12px 13px;
}
.casino-item{
    margin-bottom: 18px;
    position: relative;
}
.casino-img{
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    width: 349px;
    height: 175px;
    
}
.casino-bottom{
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
}
.bottom-left>div:first-child{
    font-size: 16px;
    letter-spacing: 1px;
}
.bottom-left>div:last-child{
    font-size: 12px;
    color: #666;
}
.bottom-right{
    background: rgb(255, 216, 0);
    font-size: 15px;
    letter-spacing: 1px;
    color: #333;
    height: 36px;
    line-height: 36px;
    border-radius: 18px;
    width: 108px;
    text-align: center;
    font-weight: bold;
}
.casino-tab_red{
    position: absolute;
    top: 12px;
    left: -3px;
    width: 110px;
    height: 27px;
}
.casino-tab_red>div{
    position: absolute;
    top: 50%;
    left: 8px;
    transform: translate(0,-50%);
    color: #fff;
    font-size: 12px;
}
.over-modal{
    position: absolute;
    background: rgba(000, 000, 000, 0.5);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
}
.over-modal>img{
    width: 100px;
    height: 100px;
}
</style>