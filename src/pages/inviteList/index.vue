<template>
  <div class="invite-page">
      <!--  -->
      <div><img src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/invita-d8493f33-eea8-47e7-8339-161c4c36630a.png" mode="widthFix"/></div>
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
                <div class="invite-info-line"></div>
                <div class="invite-info-block">
                    <span class="info-number">{{getJF}}</span>
                    <span class="info-text">累计奖励</span>
                </div>
            </div>
            <button v-if="inviteList.length!==0" open-type='share' class="invite-btn">继续邀请更多</button>
            <button v-if="inviteList.length===0" open-type='share' class="invite-btn" style="margin-bottom:10px">立即邀请</button>
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
            <div  v-if="inviteList.length>3" style="font-size:12px;text-align:center;" @click="showAll">查看更多</div>
            <div style="height:12px"></div>
      </div>
      <!-- 邀请流程 -->
      <div class="invite-block">
            <div class="invite-block-icon">
                <img src="../../../static/images/invite-block.png" mode="widthFix"/>
                <div class="invite-block-title">邀请流程</div>
            </div>
            <div class="invite-process">
                <div class="process-item">
                    <div class="process-image"><img src="../../../static/images/invite_1.png" mode="widthFix"/></div>
                    <div>向好友发送邀请</div>
                </div>
                <div class="process-item">
                    <div class="process-image"><img src="../../../static/images/invite_2.png" mode="widthFix"/></div>
                    <div>好友完成注册</div>
                </div>
                <div class="process-item">
                    <div class="process-image"><img src="../../../static/images/invite_3.png" mode="widthFix"/></div>
                    <div>双方各得100出发币</div>
                </div>
            </div>
      </div>
      <!-- 奖励说明 -->
      <div class="invite-block" style="padding-bottom:40px">
            <div class="invite-block-icon">
                <img src="../../../static/images/invite-block.png" mode="widthFix"/>
                <div class="invite-block-title">奖励说明</div>
            </div>
            <div class="express">1、每邀请一位好友成为地平线8号注册会员，双方各得 100 出发币。</div>
            <div class="express">2、最多可邀请 50 位好友，邀请满 50 位可直接向上升一个会员等级，最高可升到金 8 会员。</div>
      </div>
    <!--  -->
    <div style="height:20px;backgrouond:#ffd636"></div>
  </div>
</template>

<script>
import {wxRequest,wxuuid,timeFormat} from '@/components/common'
export default {
    data() {
        return {
            inviteList:[],
            showList:[],
            getJF:0
        }
    },
    methods: {
        showAll(){
            this.showList = [...this.inviteList];
        }
    },
     onShareAppMessage(res) {
        //转发时携带 shareTicket才能在回调中获取到shareTickets
        wx.showShareMenu({
            withShareTicket: true
        })
        let code =wxuuid();//设置32位UUID为邀请码    
        let data = {
            token:wx.getStorageSync('token'),
            code
        }

        // 分享接口，设置分享码
        wxRequest('/miniProgram/api/user/sendInvitation',{data:data}).then(res => {
            
        }) 
        
        return {
            title:"快快一键加入我们！每日福利，惊喜不断。",
            path: "/pages/index/main?code="+code,// 路径，传递参数到指定页面。
            desc:"一起和我了解L8，获取100出发币~",
            imageUrl:"https://level8cases.oss-cn-hangzhou.aliyuncs.com/f5af3c3d-6d45-4feb-ab19-65a144110eb0.png"
        }
    },
    onShow(){
        let data = {
            token:wx.getStorageSync('token'),
        }
        wxRequest('/miniProgram/api/user/getInvitationList',{data:data}).then(res => {
            res.data.data.forEach(item => {
               item.date = timeFormat(item.targetTime);
            })
            this.getJF = res.data.data.length * 100;
            this.inviteList = [...res.data.data];
            this.showList = this.inviteList.slice(0,3);
        }) 
    }
}
</script>

<style>
    @import url('../../components/common.css');
    .invite-page{
        background: #ffd636;
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
        justify-content: space-between;
        align-items: center;
        width: 68%;
        margin: 0 auto 26px;
    }
    .invite-info-block{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .info-number{
        color: #fe6500;
        font-weight: bold;
        font-size: 20px;
    }
    .info-text{
        color: #000;
        font-size: 16px;
        margin-top: 6px;
        /* font-weight: bold; */
    }
    .invite-info-line{
        background: #bbb;
        width: 1px;
        height: 40px;
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
        padding: 10px 16px;
        justify-content: space-between;
        padding-bottom: 20px ;
    }
    .process-item{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .process-item{
        font-size: 12px;
        color: #333;
    }
    .process-image{
        width: 42px;
        margin-bottom: 18px;
    }
    .express{
        font-size: 12px;
        color: #333;
        padding: 0 20px;
        line-height: 18px;
        margin-top: 4px;
    }
</style>