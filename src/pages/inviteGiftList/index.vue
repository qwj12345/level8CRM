<template>
  <div class="invite-page">
      <!--  -->
      <div style="position:relative">
          <img src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/invite-2d7e9b3c-7182-4d68-82bc-44f817f79beb.jpg" mode="widthFix"/>
          <img class="invite-text" src="/static/images/invite_text.png" />
          <div class="invite-time" v-if="gifts.length !== 0">活动时间：{{time}}</div>
      </div>
      <!-- 我的邀请 -->
      <div class="invite-block">
            <div class="invite-block-icon">
                <img src="../../../static/images/invite-block.png" mode="widthFix"/>
                <div class="invite-block-title">我的邀请</div>
            </div>
            <div class="invite-info">
                <div class="invite-info-block">
                    <span class="info-number">{{inviteList.length}}</span>
                    <span class="info-text">成功邀请</span>
                </div>
            </div>
            <button v-if="inviteList.length!==0 && gifts.length !== 0" open-type='share' class="invite-btn">继续邀请更多</button>
            <button v-if="inviteList.length===0 && gifts.length !== 0" open-type='share' class="invite-btn" style="margin-bottom:10px">立即邀请</button>
            <div v-if="inviteList.length===0 && gifts.length === 0"  class="after-invite-btn" style="margin-bottom:10px">立即邀请</div>
            <!-- 邀请的列表 -->
            <div class="invite-list" v-if="inviteList.length!==0">
                <div class="invite-item" v-for="(item,key) in showList" :key="key">
                    <div class="invite-item-left">
                        <div style="width:40px;height:40px;border-radius:50%;overflow:hidden;margin-right:20px"><img :src="item.targetUserImg" mode="widthFix"/></div>
                        <div style="font-size:14px">{{item.targetUserName}}</div>
                    </div>
                    <div style="font-size:14px">{{item.date}}</div>
                </div>
            </div>
            <div  v-if="inviteList.length>3&&showList.length===3" style="font-size:12px;text-align:center;" @click="showAll">查看更多</div>
            <div style="height:12px"></div>
      </div>
      <!-- 邀请流程 -->
      <div class="invite-block" v-if="gifts.length !== 0">
            <div class="invite-block-icon">
                <img src="../../../static/images/invite-block.png" mode="widthFix"/>
                <div class="invite-block-title">活动礼品</div>
            </div>
            <div class="invite-process">
                <div class="process-item" v-for="(item,key) in gifts" :key="key">
                    <div class="gift-title">{{nameArr[key]}}</div>
                    <div class="process-image" @click="prevImg(item.trophyImg)"><img :src="item.trophyImg"/></div>
                    <div>邀请满{{item.invitationNum}}人</div>
                    <div class="receive-btn" @click="showModalM(item.id)" v-if="inviteList.length >= item.invitationNum">领取</div>
                    <div v-else class="receive-btn un-receive-btn">未达人数</div>
                </div>
            </div>
      </div>
      <!-- 奖励说明   -->
      <div class="invite-block" style="padding-bottom:40px">
            <div class="invite-block-icon">
                <img src="../../../static/images/invite-block.png" mode="widthFix"/>
                <div class="invite-block-title">奖励说明</div>
            </div>
            <div class="express">1、邀请好友数达到对应礼品的门槛，即可领取该礼品。</div>
            <div class="express">2、礼品领取后，当前累计邀请人数即清零，再次参加本活动，需重新计算。</div>
            <div class="express">3、请完善个人信息，礼品将按登记的地址寄送。</div>
            <div class="express">4、芒果TV及腾讯视频会员月卡获奖用户，请添加官方福利微信：Level8Buddy 领取奖品。 </div> 
      </div>
    <!--  -->
    <div style="height:20px;backgrouond:#ffd636"></div>
    <!-- 弹窗 -->
    <van-popup :show="showModal" custom-class="popup-class" >
        <div class="enroll-modal">
            <div>
                领取奖品后邀请人数将清空<br/>
                是否确定领取
            </div>
            <div class="modal-btns">
                <div @click="showModalM">下次领取</div>
                <div @click="reciveGift">立即领取</div>
            </div>
        </div>
    </van-popup>
    <van-popup :show="showModal2" custom-class="popup-class" >
        <div class="info-modal">
            <div>领取成功</div>
            <div v-html="reciveHtml">
                
            </div>
            <div @click="hideModal2">好的</div> 
        </div>
    </van-popup>
    <van-popup :show="showModal3" custom-class="popup-class" >
        <div class="info-modal">
            <div>活动结束</div>
            <div>
                该活动已结束<br/>可以去其他活动看看哦~
            </div>
            <div @click="hideModal3">好的</div> 
        </div>
    </van-popup>
  </div>
</template>

<script>
import {wxRequest,wxuuid,timeFormat1,timeFormat} from '@/components/common'
export default {
    data() {
        return {
            showModal3:false,
            showModal:false,
            showModal2:false,
            nameArr:['一重礼','二重礼','三重礼','四重礼','五重礼','六重礼','七重礼','八重礼'],
            inviteList:[],
            showList:[],
            gifts:[],
            time:'',
            id:'',
            reciveHtml:'恭喜您领取礼品成功<br/>人数已重新计算'
        }
    },
    methods: {
        showAll(){
            this.showList = [...this.inviteList];
        }, 
        reciveGift(){
            wx.showLoading({
                title:"领取中"
            })
            let data = {
                token:wx.getStorageSync('token'),
                trophyId:this.id
            }
            wxRequest('/miniProgram/api/invitation/invitationMiniProgramTrophy',{data:data,contentType:'application/x-www-form-urlencoded',method:'POST'}).then(res => {
                wx.hideLoading();
                if(res.data.code === 0){
                    if(res.data.data.trophyAcquisitionType === 0){
                        this.reciveHtml = `恭喜您领取礼品成功<br/>请添加官方福利微信<br/>Level8Buddy<br/>进行视频会员充值！`;
                    }else{
                        this.reciveHtml = `恭喜您领取礼品成功<br/>人数已重新计算`;
                    }
                    this.showModal = false;
                    this.showModal2 = true;
                }else{
                    wx.showToast({
                        title: '领取失败',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }) 
        },
        showModalM(id){
            this.id = id;
            this.showModal = !this.showModal;
        },
        hideModal2(){
            this.receivePeople();
            this.showModal2 = false;
        },
        hideModal3(){
            this.showModal3 = false;
        },
        prevImg(url){
            wx.previewImage({
                //当前显示图片
                urls: [url]
            })
        },
        // 获取礼品列表  
        getGifts(){
            wxRequest('/miniProgram/api/invitation/trophyList',{data:{},contentType:'application/x-www-form-urlencoded',method:'POST'}).then(res => {
                this.gifts = res.data.data;
                if(this.gifts.length !==0){
                    let item = this.gifts[0];
                    item.releaseTime = timeFormat1(item.releaseTime,0)
                    item.validTime = timeFormat1(item.validTime,0)
                    this.time = `${item.releaseTime.split('/')[0]}年${item.releaseTime.split('/')[1]}月${item.releaseTime.split('/')[2]}日至${item.validTime.split('/')[0]}年${item.validTime.split('/')[1]}月${item.validTime.split('/')[2]}日`;
                }else{
                    this.showModal3 = true;
                }
             
            }) 
        },
        // 获取邀请人数
        receivePeople(){
            wx.showLoading({
                title:"请稍后"
            })
            let data = {
                token:wx.getStorageSync('token'),
            }
            wxRequest('/miniProgram/api/invitation/getInvitationListBySourceUserIdUnuse',{data:data,contentType:'application/x-www-form-urlencoded',method:'POST'}).then(res => {
                wx.hideLoading();
                res.data.data.forEach(item => {
                    item.date = timeFormat1(item.targetTime,0);
                })
                this.inviteList = [...res.data.data];
                this.showList = this.inviteList.slice(0,3);
            }) 
        }
    },
     onShareAppMessage(res) {
        //转发时携带 shareTicket才能在回调中获取到shareTickets 
        wx.showShareMenu({
            withShareTicket: true
        })
        let code = wxuuid();//设置32位UUID为邀请码  
        let data = {
            token:wx.getStorageSync('token'),
            code:code
        }

        // 分享接口，设置分享码 
        wxRequest('/miniProgram/api/invitation/sendJPInvitation',{data:data,contentType:'application/x-www-form-urlencoded',method:'POST'}).then(res => {

        }) 
        
        return {
            title:"快快一键加入我们！每日福利，惊喜不断。",
            path: "/pages/index/main?code="+code,// 路径，传递参数到指定页面。 
            desc:"一起和我了解L8，获取惊喜大礼包",
            imageUrl:"https://level8cases.oss-cn-hangzhou.aliyuncs.com/f5af3c3d-6d45-4feb-ab19-65a144110eb0.png"
        }
    },
    onShow(){
        this.getGifts();
        this.receivePeople();
    }
}
</script>

<style>
    @import url('../../components/common.css');
    .invite-page{
        background: #ffd636;
    }
    .invite-text{
        position: absolute;
        top: 28px;
        left: 50%;
        transform: translate(-50%,0);
        width: 636rpx;
        height: 88rpx;
    }
    .invite-time{
        position: absolute;
        background: rgb(255,243,0);
        width: 640rpx;
        height: 56rpx;
        border-radius: 28rpx;
        top: 170rpx;
        left: 50%;
        transform: translate(-50%,0);
        font-size: 13px;
        text-align: center;
        line-height: 56rpx;
    }
    .invite-block{
        background: #fff;
        width: calc(100vw - 36px);
        margin: 0 auto 18px;
        border-radius: 16px;

    }
    .invite-block-icon{
        width: 180px;
        color: #fff;
        margin: 10px auto 20px;
        position: relative;
    }
    .invite-block::before {
        display: table;
        content: "";
    }   
    .invite-block-title{
        position: absolute;
        font-size: 16px;
        letter-spacing: 1px;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .invite-info{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 68%;
        margin: 0 auto 26px;
    }
    .gift-title{
        font-size: 14px;
        margin-bottom: 4px;
    }
    .invite-info-block{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .info-number{
        color: #fe6500;
        font-weight: bold;
        font-size: 24px;
    }
    .info-text{
        color: #000;
        font-size: 16px;
        margin-top: 6px;
        /* font-weight: bold;  */
    }

    .invite-btn{
        width: 76%;
        margin: 0 auto 30px;
        background: linear-gradient(100deg, #ffeb01, #fece02);
        font-size: 16px;
        font-weight: bold;
        letter-spacing: 1px;
        line-height: 42px;
        text-align: center;
        border-radius: 32px;
    }
    .after-invite-btn{
        width: 76%;
        margin: 0 auto 30px;
        background: #efefef;
        color:#999;
        font-size: 16px;
        font-weight: bold;
        letter-spacing: 1px;
        line-height: 42px;
        text-align: center;
        border-radius: 32px;
    }
    .invite-list{
        width: 80%;
        margin: 0 auto 10px;
        color: #333;
    }
    .invite-item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    .invite-item-left{
        display: flex;
        align-items: center;
    }
    .invite-process{
        display: flex;
        padding: 10px 30px;
        justify-content: space-between;
        padding-bottom: 0px ;
        flex-wrap: wrap;
    }
    .process-item{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 30px;
    }
    .process-item{
        font-size: 12px;
        color: #333;
    }
    .process-image{
        width: 88px;
        height: 88px;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 6px;
    }
    .express{
        font-size: 12px;
        color: #333;
        padding: 0 20px;
        line-height: 18px;
        margin-top: 4px;
    }
    .receive-btn{
        background: linear-gradient(100deg, #ffeb01, #fece02);
        width: 70px;
        height: 29px;
        line-height: 29px;
        text-align: center;
        font-size: 12px;
        margin-top: 10px;
        border-radius: 16px;
    }
    .un-receive-btn{
        background: rgb(233, 233, 233);
        color: #999;
    }
    .enroll-modal{
    width: 280px;
}
.enroll-modal>div:first-child{
    padding: 40px 0;
    text-align: center;
    font-size: 16px;
    letter-spacing: 1px;
}
.enroll-modal .modal-btns{
    border-top: 1px solid #eeeeee;
}
.enroll-modal .modal-btns>div{
    width: 50%;
    font-size: 18px;
    letter-spacing: 1px;
    text-align: center;
    height: 46px;
    line-height: 46px;
}
.enroll-modal .modal-btns>div:first-child{
    color: #999;
}
.enroll-modal .modal-btns>div:last-child{
    color: rgb(255, 214, 55);
}
.info-modal{
    padding: 14px 0px 0;
    width: 280px;
}
.info-modal>div{
    text-align: center;
}
.info-modal>div:first-child{
    font-size: 18px;
}
.info-modal>div:nth-child(2){
    font-size: 14px;
    margin-top: 15px;
    letter-spacing: 1px;
    line-height: 20px;
    padding: 0px 30px;
    margin-bottom: 18px;
}
.info-modal>div:last-child{
    color: rgb(255, 214, 55);
    border-top: 1px solid #eee;
    height: 46px;
    line-height: 46px;
}
</style>