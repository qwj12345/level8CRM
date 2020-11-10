<template>
  <div>
      <!-- header -->
      <div class="record-header">
          <img class="header-img" src="/static/images/bg_img.png"/>
          <div class="header-content">
              <div class="header-content-title">
                  当前出发币
              </div>
              <div class="header-content-number">{{integralNum}}</div>
          </div>
      </div>
        <!--  -->
      <div class="integralpage">
          <div class="integral-header">
                <!-- 出发币赚取 -->
              <div class="get-integral" @click="tabHeader(1)">
                  <div class="integral-img">
                      <img v-if="isGetIntegral" src="/static/images/s_get_integral.png"/>
                      <img v-if="!isGetIntegral" src="/static/images/get_integral.png"/>
                  </div>
                  <div :class="{'nos_integral-title':!isGetIntegral}">
                      出发币明细
                  </div>
              </div>
              <!-- 出发币兑换 -->
              <div class="put-integral"  @click="tabHeader(2)">
                    <div class="integral-img">
                      <img v-if="isGetIntegral" src="/static/images/put_integral.png"/>
                      <img v-if="!isGetIntegral" src="/static/images/s_put_integral.png" />
                    </div>
                    <div :class="{'nos_integral-title':isGetIntegral}">
                      礼品记录
                    </div>
              </div>
          </div>
            <!-- 出发币明细 -->
            <div class="record-container" v-if="isGetIntegral">
                <div class="table-header">
                    <div class="table-header-item">日期</div>
                    <div class="table-header-item border-both">类型</div>
                    <div class="table-header-item">出发币记录</div>
                </div>
                <div class="table-content"  v-for="(item,key) in records" :key="key">
                    <div class="table-content-item">
                        {{item.createTime}}
                    </div>
                    <div class="table-content-item">
                        {{item.changeTypeName}}
                    </div>
                    <div class="table-content-item">
                        {{item.integralNum}}
                    </div>
                </div>
                <!--  -->
                <div class="paging" v-if="showLotteryPage">
                    <div @click="prePage">上一页</div>
                    <div @click="nextPage">下一页</div>
                </div>
            </div>
            <!-- 礼品明细 -->
            <div v-if="!isGetIntegral" class="record-container">
                <div class="table-header">
                    <div class="table-header-item">日期</div>
                    <div class="table-header-item border-both">礼品</div>
                    <div class="table-header-item border-right">类型</div>
                    <div class="table-header-item gift-item">状态</div>
                </div>    
                <div class="table-content"  v-for="(item,key) in recordsGift" :key="key">
                    <div class="table-content-item gift-item">
                        {{item.createTime}}
                    </div>
                    <div class="table-content-item gift-item">
                        {{item.trophyName}}
                    </div>
                    <div class="table-content-item">
                        {{item.trophyType}}
                    </div>
                    <div class="table-content-item" :class="{'colorB':item.status==='已发货'}" @click="goDetail(item)">
                        {{item.status}}
                    </div>
                </div>
                <!--  -->
                <div class="paging" v-if="showGiftPage">
                    <div @click="prePageLP">上一页</div>
                    <div @click="nextPageLP">下一页</div> 
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
            showGiftPage:false,
            showLotteryPage:false,
            size:10,
            jfpage:0,
            jftotalPage:0,
            lppage:0,
            lptotalPage:0,
            isGetIntegral:true,
            integralNum:0,
            records:[],
            recordsGift:[],
            types:['签到','转发','绑定产品','兑换','抽奖','注册','关注公众号','任务','完善个人信息','互动精选','过期','中奖']
        }
    },
    methods: {
        goDetail(item){
            if(item.status === '已发货'){
                if(item.expressageNum!=="" && item){
                    wx.navigateTo({
                        url:"/pages/logistics/main?expressageNum="+item.expressageNum+"&expressCode="+item.expressCode
                    })
                }else{
                    console.log(item)
                    if(item.trophyName==="酒店卡卷"){//劵
                        wx.navigateTo({
                            url:"/pages/ticketCode/main?id="+item.id
                        })
                    }else{
                        wx.navigateTo({
                            url:"/pages/giftInfo/main?exchangeInfo="+encodeURIComponent(item.exchangeInfo)+"&exchangeCode="+item.exchangeCode
                        })
                    }
                    
                }
            }
        },
        getIntegralList(){
            let data = {
                token:wx.getStorageSync('token'),
                page:this.jfpage,
                size:this.size
            }
            console.log(data)
            // 出发币明细
            wxRequest('/miniProgram/api/integral/list',{data:data}).then(res => {
                this.records= res.data.data.content;
                // Math.ceil将小数向上转为整数
                this.jftotalPage = res.data.data.totalPages;
                if(res.data.data.total<=10){
                    this.showLotteryPage = false;
                }else{
                    this.showLotteryPage = true;
                }
                this.records.forEach((item,index) => {
                    item.createTime = timeFormat1(item.createTime,0);
                })
            })
        },
        getGiftList(){
            let data = {
                token:wx.getStorageSync('token'),
                page:this.lppage,
                size:this.size
            }
             // 礼品记录 
            wxRequest('/miniProgram/api/trophy/user/trophyList',{data:data}).then(res => {
                console.log(res)
                this.recordsGift= res.data.data.content;
                // Math.ceil将小数向上转为整数
                this.lptotalPage = res.data.data.totalPages;
                if(res.data.data.total<=10){
                    this.showGiftPage = false;
                }else{
                    this.showGiftPage = true;
                }
                this.recordsGift.forEach((item,key) => {
                    item.createTime = timeFormat1(item.createTime,0);
                    if(item.trophyStatus==="2"){
                        item.status = '已发货';
                    }else{
                        item.status = '未发货';
                    }
                })
            })
        },
        tabHeader(index){
            index === 1 ? this.isGetIntegral = true : this.isGetIntegral = false;
        },
        prePage(){
            if(this.jfpage === 0){
                wx.showToast({
                    title:'已经是第一页啦',
                    icon:'none',
                    duration:1000
                })
            }else{
                this.jfpage--;
                this.getIntegralList();
            }
        },
        nextPage(){
            console.log(this.jfpage)
            console.log(this.jftotalPage)
            if(this.jfpage === this.jftotalPage-1){
                wx.showToast({
                    title:'已经是最后一页啦',
                    icon:'none',
                    duration:1000
                })
            }else{
                this.jfpage++;
                this.getIntegralList();
            }
        },
        prePageLP(){
            if(this.lppage === 0){
                wx.showToast({
                    title:'已经是第一页啦',
                    icon:'none',
                    duration:1000
                })
            }else{
                this.lppage--;
                this.getGiftList();
            }
        },
        nextPageLP(){
            if(this.lppage === this.lptotalPage-1){
                wx.showToast({
                    title:'已经是最后一页啦',
                    icon:'none',
                    duration:1000
                })
            }else{
                this.lppage++;
                this.getGiftList();
            }
        },
        
    },
    onLoad(){
        this.integralNum = getApp().globalData.integralNum;
        this.jfpage = 0;
        this.lppage = 0;
        this.getIntegralList();
        this.getGiftList();
    }
}
</script>

<style>
page{
  background: #efeff4;
}
.colorB{
    color: #00a4f7;
    text-decoration: underline;
}
.record-header{
    width:100vw;
    height: 41.2vw;
    position: relative;
  }
  .header-img{
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    top: 0;
    left:0;
    z-index: 0;
}

.header-content{
    position: relative; 
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2;
}
.header-content-title{
    font-size: 14px;
    margin-bottom: 6px;
    margin-top: -50px;
}
.header-content-number{
    font-size: 36px;
    font-weight: bold;
}
.integralpage{
    position: relative;
    padding: 20px 0;
    width: 90vw;
    margin: 0 auto;
    border-top-left-radius:16px;
    border-top-right-radius:16px;
    margin-top: calc(96px - 41.2vw);
    z-index: 2;
}
.integral-header{
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #FFD637;
    background: #fff;
    height: 50px;
    border-radius: 34px;
}
.integral-img{
    height: 24px;
    width: 24px;
    margin-right: 10px;
}
.nos_integral-title{
    color: #999 !important;
}
.get-integral{
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #999;
    box-sizing: border-box;
}
.put-integral{
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center
}
.record-container{
    background: #fff;
    margin-top: 12px;
    border-radius: 16px;
    position: relative;
    z-index: 2;
    padding: 20px 16px 40px;
}
.table-header{
    display: flex;
    margin-bottom: 10px;
}
.table-header-item{
    width: 33.3%;
    text-align: center;
    font-size: 15px;
    color: #333;
}
.border-both{
    box-sizing: border-box;
    border-right: 1px solid #f0f0f0;
    border-left: 1px solid #f0f0f0;
}
.border-right{
    box-sizing: border-box;
    border-right: 1px solid #f0f0f0;
}
.gift-item{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.table-content-item{
    width: 33.3%;
    text-align: center;
    padding: 7px 0;
}
.table-content{
    display: flex;
    font-size: 13px;
    color: #666;
}
.paging{
    margin-top: 25px;
    font-size: 13px;
    color: #FFD637;
    display: flex;
    justify-content: space-around;
}
</style>