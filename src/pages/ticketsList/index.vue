<template>
  <div>
    <card hasAgree='true' :integral="integralNum"></card>
    <!-- 有订单时 -->
    <div class="order-list" v-if="orders.length !== 0">
        <div  class="order-item" v-for="(item,key) in orders" :key="key">
            <div class="order-header">
                <div class="header-left">订单编号：{{item.id}}</div>
            </div>
            <div class="order-content">
                <div style="display:flex;">
                    <img style="width:100px;height:100px;border-radius:8px;margin-right:10px" :src="item.trophyImg" mode="aspectFill"/>
                    <div class="ticket-name">{{item.trophyName}}</div>
                </div>
                <div class="order-right">
                    <div>
                        <div class="order-price"><span style="font-size:12px">￥</span>{{item.usePrice}}</div>
                        <div class="order-number">共1件</div>
                        <div class="order-status">{{trophyStatusList[item.trophyStatus]}}</div>
                    </div>
                </div>
                <!-- 订单按钮 -->
                <div class="order-btns">
                    <div class="order-btn" style="background:#fff;border:1px solid #ffd637;margin-right:12rpx;color:#666" v-if="item.trophyStatus===2"  @click="returnPrice(item.id)">立即退款</div>
                    <div class="order-btn" @click="goDetail(item)">查看券码</div>
                </div>
            </div>
        </div>
    </div>
    <!-- 没有订单时 -->
    <div v-if="orders.length === 0" class="no-product">
        <img class="no-product-img" mode="widthFix" src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/797063ef-3689-42d9-afb3-ecc89daf61f4.png"/>
        <div class="no-product-text">
            哎呀，您还没购买任何产品~
        </div>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'
import {wxRequest} from '@/components/common'

export default {
    data(){
        return{
            integralNum:0,
            orders:[],
            trophyStatusList:["未发货","发送中","已发货","已使用","待退款","已退款"]
        }
    },
    components:{
        card
    },
    
    methods: {
        returnPrice(id){
            
            wx.showModal({
                title: '退款',
                content: '确定要退款嘛？',
                showCancel: true,//是否显示取消按钮
                confirmColor: '#ffd637',//确定文字的颜色
                success:(res) =>{
                    if (res.cancel) {
                    //点击取消,默认隐藏弹框
                    } else {
                        this.confiremReturn(id)
                    }
                },
            })

        },
        // 退款
        confiremReturn(id){
            wx.showLoading({
                title:"退款中"
            })
            let data = {
                token:wx.getStorageSync('token'),
                trophyRecordId:id
            }
            wxRequest('/miniProgram/api/trophy/cancelAndRefund',{data:data}).then(res => {
                wx.hideLoading();
                if(res.data.code===200){
                    wx.showToast({
                        title:"退款成功",
                        icon:"success",
                        duration:2000
                    })
                    this.getList();
                }else{
                    wx.showToast({
                        title:res.data.msg,
                        icon:"none",
                        duration:2000
                    })
                }

            })
        },
        goDetail(code){
            code.exchangeQrcode = encodeURIComponent(code.exchangeQrcode);
            wx.navigateTo({
                url:"/pages/ticketCode/main?code="+JSON.stringify(code)
            })
        },
        // 获取列表
        getList(type){
            wx.showLoading({
                title:"请稍后"
            })
            this.integralNum = getApp().globalData.integralNum;//获取积分
            let data = {
                token:wx.getStorageSync('token'),
                pageNum:1,
                pageSize:20
            }
            wxRequest('/miniProgram/api/trophy/myPayTrophyList',{data:data}).then(res => {
                wx.hideLoading();
                this.orders = res.data.data.list;
                if(type==1){
                    wx.stopPullDownRefresh();
                }
            })
        }
    },
    // 监控下拉刷新 
    onPullDownRefresh () {
        this.getList(1);
    },
    onShow(){
        this.getList(0);
    },

}
</script>

<style>
page{
    background: #efeff4;
}
.order-list{
  position: relative;
  padding:20px;
  width: 90vw;
  margin: 0 auto;
  margin-top: calc(70px - 41.2vw);
  z-index: 5;
}
img{
    width: 100%;
    height: 100%;
}
.order-item{
    background: #fff;
    border-radius: 10px;
    padding: 10px 12px;
    margin-bottom: 15px;
}

.order-header{
    color: #999;
    font-size: 12px;
}
.order-content{
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    position: relative;
}
.order-btns{
    position: absolute;
    right: 0px;
    bottom: 0px;
    display: flex;
}
.ticket-name{
    font-size: 14px;
    color: #333;
}
.order-price{
    font-size: 15px;
    color: #333;
    text-align: right;
}
.order-number{
    color: #999;
    font-size: 12px;
    text-align: right;
    margin: 2px 0;
}
.order-status{
    color:#ffd637;
    font-size: 12px;
    text-align: right;
}
.order-btn{
    font-size: 14px;
    padding: 5px 10px;
    border-radius: 18px;
    background: #ffd637;
    box-sizing: border-box;
}
.order-right{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.no-product{
    margin-top: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.no-product-img{
    width: 33vw;
}
.no-product-text{
    color: #999;
    margin-top: 30px;
    margin-bottom: 14px;
    font-size: 14px;
}
.no-product-btn{
    border: 1px solid #999;
    border-radius: 20px;
    font-size: 15px;
    color: #333;
    padding: 5px 20px;
}
</style>