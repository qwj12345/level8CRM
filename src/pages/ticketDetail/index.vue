<template>
  <div>
      <swiper class='swiper' circular='true'  >
            <block v-for="(item,key) in swiperImgs" :key="key">
                <swiper-item>
                    <image :src="item"  class="slide-image" mode="widthFix" />
                </swiper-item>
            </block>
        </swiper>
        <div class="ticket-name">{{name}}</div>
        <div class="coin-info">使用{{useIntegral}}出发币可抵{{integralOffsetPrice}}元</div>
        <div class="price"><span>￥</span>{{price}}</div>
        <div style="background: #efeff4;margin-top:20px;height:10px"></div>
        <div class="detail-info-title">
            <div></div>
            详情  
            <!-- -->
        </div>
        <div class="detail-info">{{details}}</div>
        <!--  -->
        <div v-if="!offSale" style="font-weight:bold;position:fixed;bottom:0px;left:0px;width:100vw;height:50px;text-align:center;font-size:16px;line-height:50px;background:#FFD637;letter-spacing: 1px;"  @click="togglePopup">立即购买</div>
        <div v-else style="font-weight:bold;position:fixed;bottom:0px;left:0px;width:100vw;height:50px;text-align:center;font-size:16px;line-height:50px;background:#999;color:#fff;letter-spacing: 1px;" @click="togglePopup">已售罄</div>
            
      <van-popup :show="showPayModal" position="bottom" @close="togglePopup">
          <div style="position:relative">
                <div class="ticket-name" style="font-weight:bold">{{name}}</div>
                <div class="coin-info">使用{{useIntegral}}出发币可抵{{integralOffsetPrice}}元</div>
                <div style="padding:14px 12px 20px;">
                    <div style="font-size:28rpx;color:#333">数量：<span style="color:#666">1</span></div>
                    <div class="popup-price">
                        <div class="popup-new-price">
                            <div style="margin-right:4px">抵扣价:</div>
                            <div class="priceA"><span>￥</span><span class="price-bold">{{usePrice}}</span></div>
                        </div>
                        <div class="popup-old-price">
                            原价： ￥{{price}}
                        </div>
                    </div>
                </div>
                    <div style="height:6px;background: #efeff4;"></div>
                    <div class="detail-info-title" style="font-size:32rpx;">
                    <div style="width:4px;height:20px;margin-top:2rpx"></div>
                    详情  
                    <!-- -->
                </div>
                <div class="detail-info" style="padding-bottom:160rpx">{{details}}</div>
                  <div style="font-weight:bold;position:fixed;bottom:0px;left:0px;width:100vw;height:50px;text-align:center;font-size:16px;line-height:50px;background:#FFD637;letter-spacing: 1px;" @click="buyTicket">立即付款</div>
          </div>

      </van-popup>
  </div>
</template>
<script>
import {getToken,saveUser,wxRequest} from '@/components/common'
export default {
    data() {
        return {
            offSale:false,
            swiperImgs:[],
            name:"",
            details:"",
            price:0,
            id:0,
            payFlag:false,
            showPayModal:false,
            useIntegral:0,
            integralOffsetPrice:0,
            usePrice:0,
            
        }
    },
    methods: {
        buyTicket(){
            if(!this.payFlag){
                this.payFlag = true;
                wx.showLoading({
                    title:'加载中'
                })
                let data = {
                    trophyId:this.id,
                    discountCode:getApp().globalData.discountCode,
                    token:wx.getStorageSync('token')
                }
                wxRequest('/mp/shop/api/user/order/getHuiyuanPayParam',{data:data}).then(res => {
                    if(res.data.code===0){
                        let payInfo = res.data.data;
                        console.log(payInfo)
                        wx.requestPayment({
                            timeStamp: payInfo.timeStamp,
                            nonceStr: payInfo.nonceStr,
                            package: payInfo.package,
                            signType: 'MD5',
                            paySign: payInfo.paySign,
                            success (res) {
                                wx.navigateTo({
                                    url:'/pages/ticketsList/main'
                                })
                            },
                            fail (err) {
                                console.log(err)
                            }
                        })
                        
                        wx.hideLoading();
                    }else if(res.data.code===400){
                        wx.hideLoading();
                        wx.showToast({
                            title:"库存不足",
                            image: '/static/images/errorToast.png',
                            duration: 2000
                        })
                    }else{
                        wx.hideLoading();
                        wx.showToast({
                            title:"出错啦~",
                            image: '/static/images/errorToast.png',
                            duration: 2000
                        })

                    }
                    
                    this.payFlag = false;
                })
            }

        },
        togglePopup(){
            if(this.offSale){
                this.showPayModal=false;
            }else{
                this.showPayModal?this.showPayModal=false:this.showPayModal=true;
            }
        }
    },
    onLoad(query){
         wx.showLoading({
            title:'加载中'
        })
        this.id = query.id;

        let data = {
            trophyId:query.id,
            discountCode:getApp().globalData.discountCode,
            token:wx.getStorageSync('token')
        }
        wxRequest('/miniProgram/api/trophy/getTrophyDetail',{data:data}).then(res => {
          console.log(res)
          if(res.data.status===0){
            this.swiperImgs= res.data.data.trophyDetailImgs.split(",");
            this.name= res.data.data.trophyName;
            this.details = res.data.data.remake;
            this.price = res.data.data.payPrice;
            this.offSale = res.data.data.trophyNum===0?true:false;
           console.log(this.offSale)
            res.data.data.integralOffsetPrice!==null?this.integralOffsetPrice = res.data.data.integralOffsetPrice.toFixed(2):this.integralOffsetPrice=0;
            res.data.data.useIntegral!==null?this.useIntegral = res.data.data.useIntegral.toFixed(2):this.useIntegral=0;
            // this.useIntegral = res.data.data.useIntegral;
            this.usePrice = res.data.data.usePrice.toFixed(2);
          }else{
              wx.showToast({
                  title:"出错啦~",
                  icon:"none"
              })
          }
              wx.hideLoading();
        //   this.tickets = res.data.data;
        })
    }
}
</script>

<style>
@import url('../../components/common.css');
img,image{
    width:100%;
}
.swiper{
    height: 70vw;
    width: 100vw;
    overflow: visible;
    box-sizing: border-box;
}
.ticket-name{
    font-size: 16px;
    color: #333;
    letter-spacing: 1px;
    padding: 16px 12px 6px;
}
.coin-info{
    background: #fff7d7;
    display: flex;
    align-items: center; 
    color:#f77c2a;
    font-size: 12px;
    padding: 2px 7px;
    margin-left: 12px;
    display: inline;
    letter-spacing: 0.5px;
}
.price{
    font-size: 20px;
    font-weight: bold;
    margin-top: 10px;
    margin-left: 12px;
}
.price span{
    font-weight: normal;
    font-size: 14px;
    color: #333;
    position: relative;
    bottom: 1rpx;
}
.detail-info-title{
    font-size: 17px;
    color: #333;
    font-weight: bold;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    padding-left: 12px;
    margin-top: 12px;
}
.detail-info-title>div{
    width: 5px;
    height: 22px;
    background: #FFD637;
    margin-right: 8px;
}
.detail-info{
    padding: 20px 12px 60px;
    color: #999;
    font-size: 14px;
    letter-spacing: 1px;
}
.popup-price{
    display: flex;
    margin-top: 12px;
}
.popup-new-price{
    color: #333;
    display: flex;
    font-size: 14px;
    margin-right: 10px;
}
.priceA{
    color: rgb(252, 81, 81);
}
.price-bold{
    font-weight: bold;
    font-size: 16px;
    color: red;
}
.popup-old-price{
    font-size: 13px;
    text-decoration: line-through;
    color: #888;
    align-self: flex-end;
    padding-bottom: 1px;
}

</style>