<template>
  <div>
      <img class="casino-banner" src="/static/images/casino_banner.png"/>
      <div class="casino-main">
        <div class="time-block">
            <div>开奖倒计时</div>
            <!--  -->
            <div>
                <div class="time-block-black">{{purchases.day}}</div>
                <div class="time-text">天</div>
                <div class="time-block-black">{{purchases.hour}}</div>
                <div class="time-text">时</div>
                <div class="time-block-black">{{purchases.minite}}</div>
                <div class="time-text">分</div>
                <div class="time-block-black">{{purchases.second}}</div>
                <div class="time-text">秒</div>
            </div>
        </div> 
        <!-- 图片 -->
        <div class="casino-block">
            <img :src="casino.img" />
            <div class="casino-block-bottom">
                <div>
                    <span>{{casino.name}}</span>
                    <span>{{casino.prizeNum}}份</span>
                </div>
                <div>市场价￥{{casino.price}}</div>
            </div>
        </div>
        <!-- 按钮  -->
        <div class="casino-btn" :style="casino.state === 'YJS' || casino.isParticipate===1 ? 'background:#aaa' : '' " @click="goReport">{{casino.btnText}}</div>
        <div class="total-text">累计{{casino.participateNum}}人参与摇奖</div>
        <!-- 中奖名单 -->
        <div class="rule lucy" v-if="casino.state === 'YJS' && showNames">
            <!-- 设置内阴影 -->
            <div class="out-rule">
                <div class="rule-title">
                    <div class="left-icon"><img src="/static/images/casino-title_icon_left.png"/></div>
                    <div>中奖名单</div>
                    <div class="right-rule"><img src="/static/images/casino-title_icon_right.png"/></div>
                </div>
                <div class="lucy-content">
                    <img :src="casino.luckParticipateList[0].participateUserImg"/>
                    <div class="lucy-content-name">{{casino.luckParticipateList[0].participateUserName}}</div>
                    <div class="lucy-content-info" v-if="casino.userActivityParticipateInfo.luckState === 1">恭喜，本期锦鲤就是你啦！</div>
                    <div class="lucy-content-btn" :style="casino.userActivityParticipateInfo.confirmState===1 || receiveText === '已领取' ? 'background:#aaa' : '' "  v-if="casino.userActivityParticipateInfo.luckState === 1" @click="receive">{{receiveText}}</div>
                </div>
            </div>
        </div>
        <!-- 规则 -->
        <div class="rule">
            <!-- 设置内阴影 -->
            <div class="out-rule">
                <div class="rule-title">
                    <div class="left-icon"><img src="/static/images/casino-title_icon_left.png"/></div>
                    <div>活动规则</div>
                    <div class="right-rule"><img src="/static/images/casino-title_icon_right.png"/></div>
                </div>
                <div class="rule-content" v-html="casino.remake">{{casino.remake}}</div>
            </div>
        </div>
      </div>
    <!-- 弹窗 -->
    <van-popup :show="showModal" custom-class="popup-class" >
        <div class="enroll-modal">
            <div>
                报名需消耗{{casino.integral}}出发币
            </div>
            <div class="modal-btns">
                <div @click="showModalM">下次参与</div>
                <div @click="goEnroll">立即报名</div>
            </div>
        </div>
    </van-popup>
    <van-popup :show="showModal2" custom-class="popup-class" >
        <div class="info-modal">
            <div>报名成功</div>
            <div>
                {{timeText}}<br/>请留意开奖通知不要错过哦~
            </div>
            <div @click="hideModal2">好的</div> 
        </div>
    </van-popup>
    <van-popup :show="showModal3" custom-class="popup-class" >
        <div class="info-modal">
            <div>领取成功</div>
            <div>
                领取成功！请确保已完善个人信息，后台发货将按您登记的地址邮寄
            </div>
            <div @click="hideModal3">好的</div> 
        </div>
    </van-popup>
    <!-- 授权 -->
    <!--  -->
    <modal :showModal="showModal5" @modalShow='getModal' @refuseModal='refuseAgree'></modal>
    <!-- 授权弹出框 -->
    <van-popup :show="showModal6" custom-class="popup-class" >
        <div class="modal2">
          <div class="reg-title">
            获取微信授权信息
          </div>
          <div class="reg-text">
              微信登录需要获取您的用户信息，请前往授权
          </div>
          <div class="modal-btns">
            <div class="modal-cancel-btn" @click="cancelModal2">
              取消
            </div>
            <button class="reg-btn" open-type="getUserInfo" @getuserinfo="getUserInfo" @click="hideModal">授权登录</button>
          </div>
        </div>
    </van-popup>
    <!--  -->
    <van-popup :show="showMsg" custom-class="popup-class3" >
      <div class="modal3">
        <div class='reg-text3 text-center'>
            尊敬的用户，您仍可浏览地平线8号的会员中心页面及独家精选内容。但暂不能参与任何有关出发币的活动，谢谢！
        </div>
        <div class="reg-button" @click="hideMsg">
          确定
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import modal from '@/components/modal';
import {timeFormat,timeFormat1,wxRequest} from '@/components/common';
export default {
    data() {
        return {
            showMsg:false,
            hasAgree:false,
            showModal:false,
            showModal2:false,
            showModal3:false,
            showModal5:false,
            showModal6:false,
            casino:{},
            timeText:'',
            receiveText:'立即领取',
            showNames:true,//防止倒计时结束获取不到用户
            purchases:{day:0,hour:0,minite:0,second:0},//倒计时
            overTime:null//定时器
        }
    },
    components: {
        modal
    },
    methods: {
        // modal组件中的值传过来
        getModal(e){
            this.showModal5 = false;
            let data = {
                token:wx.getStorageSync('token')
            }
            wxRequest('/miniProgram/api/user/info',{data:data}).then(res => {
                getApp().globalData.isQrcodeCheckUser = res.data.data.isQrcodeCheckUser;
                getApp().globalData.isQrcodeCheckUser===1?this.showQM=true:this.showQM=false;
                getApp().globalData.integralNum = this.integralNum;
            })
        },
        refuseAgree(e){
            this.showModal5 = false;
            this.showMsg = true;
        },
        getPhone(){
            this.showModal = true;
        },
        getUserInfo(e){
            if (e.mp.detail.rawData){
                let rawData =  JSON.parse(e.mp.detail.rawData);
                this.showModal5 = true; 
                this.hasAgree = true;
                getApp().globalData.login = 1; //保存用户登录状态  
            } else {  
                this.showModal6 = true;
                console.log('用户按了拒绝按钮')
            }
        },
        // 
        goReport(){
            console.log(this.casino.isParticipate)
            if(this.hasAgree === true){   //先判断有没有授权  
                if(getApp().globalData.phone === 1){ //再判断有没有绑定手机 
                    if(this.casino.state !== 'YJS' && this.casino.isParticipate===0){
                        this.showModal = true;
                    }
                }else{
                    this.showModal5 = true;
                }
            }else{
                this.showModal6 = true;
            }
        },
        showModalM(){
            this.showModal = !this.showModal;
        },
        hideModal(){
            this.showModal6 = false;
        },
        hideModal2(){
            this.showModal2 = false;
        },
        hideModal3(){
            this.showModal3 = false;
        },
        // 报名
        goEnroll(){
            wx.showLoading({
                title:"请稍后"
            })
            let data = {
                token:wx.getStorageSync('token'),
                lotteryActivityId :this.casino.id
            }
            wxRequest('/miniProgram/api/lotteryActivity/participateLotteryActivity',{data:data,contentType:'application/x-www-form-urlencoded',method:'POST'}).then(res => {
                wx.hideLoading()
                if(res.data.code===0){
                    this.showModal2 = true;
                    this.showModal = false;
                    this.casino.isParticipate = 1;
                    this.casino.participateNum++;
                    this.casino.btnText = '已报名';
                }else if(res.data.code===10016){
                    wx.showToast({
                        title: '积分不足',
                        icon: 'none',
                        duration: 2000
                    })
                }else if(res.data.code===400){
                    wx.showToast({
                        title: '请勿重复报名',
                        icon: 'none',
                        duration: 2000
                    })
                }else{
                    wx.showToast({
                        title: '报名失败',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }) 
        },
        // 领取
        receive(){
            if(this.receiveText !=='已领取'){
                wx.showLoading({
                    title:"领取中"
                })
                let data = {
                    token:wx.getStorageSync('token'),
                    lotteryActivityParticipateId:this.casino.userActivityParticipateInfo.id
                }
                wxRequest('/miniProgram/api/lotteryActivity/confirmLuckInfo',{data:data,contentType:'application/x-www-form-urlencoded',method:'POST'}).then(res => {
                    wx.hideLoading()
                    if(res.data.code===0){
                        this.showModal3 = true;
                        this.receiveText = '已领取';
                    }else{
                        wx.showToast({
                            title: '领取失败',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                })
            }

        },
        // 倒计时方法  
        countDown(nowTime){
            let day = 0;
            let hour = 0;
            let minite = 0;
            let second = 0;
            // let day = hour = minite = second = 0;
            let remain = 0;
            if(new Date(this.casino.prizeTime).getTime() > nowTime){ 
                remain = new Date(this.casino.prizeTime).getTime() - nowTime;

                day = Math.floor(remain/(1000*60*60*24));
                hour = Math.floor(remain % (1000*60*60*24) / (60*60000));
                minite = Math.floor((remain % (1000*60*60)) / 60000);
                second = Math.floor(remain % (1000*60) / 1000);

                day<10 ? day = '0'+day : day=day+'';
                hour<10 ? hour = '0'+hour : hour=hour+'';
                minite<10 ? minite = '0'+minite : minite=minite+'';
                second<10 ? second = '0'+second : second=second+'';
            }else{
                this.showNames = false;//不显示中奖用户
                this.casino.state = 'YJS';
                clearInterval(this.overTime);
            }

            this.purchases = {
                day,
                hour,
                minite,
                second
            }
        }
    },
    onHide(){//页面隐藏时清除定时器 保持性能
      clearInterval(this.overTime)
    },
    onUnload(){
      clearInterval(this.overTime)
    },
    onShareAppMessage() {

    },
    onLoad(query){
        this.showNames = true;
        this.receiveText = '立即领取';
        let data = {
            token:wx.getStorageSync('token'),
            lotteryActivityId :query.id//100004   
        }
        wxRequest('/miniProgram/api/lotteryActivity/getLotteryActivityDetail',{data:data,contentType:'application/x-www-form-urlencoded',method:'POST'}).then(res => {
            this.casino = res.data.data;
            this.casino.isParticipate === 1 ? this.casino.btnText = "已报名" : this.casino.btnText = "立即报名";
            // 获取具体日期   
            let time = timeFormat1(this.casino.prizeTime,1);
            let day =  time.split(' ')[0]; //'10月20日 18:00开奖'
            this.timeText = `开奖时间为${day.split('/')[0]}月${day.split('/')[1]}日${time.split(' ')[1]}`
            // 倒计时   
            if(this.casino.state !== 'YJS'){
                console.log(1258798)
                this.overTime = setInterval(() => {
                    this.countDown(new Date().getTime())
                }, 1000);
            }
            // 是否领奖
            if(this.casino.userActivityParticipateInfo.confirmState === 1){
                this.receiveText = '已领取';
            }
        })

        let that =this;
        // 新用户授权问题
        wx.getUserInfo({
            success: function(res) {
                console.log(res)
                getApp().globalData.login = 1
                that.hasAgree = true;
            },
            fail(err){
                console.log(err)
                that.hasAgree = false;
            }
        })
    }
}
</script>

<style>
@import url('../../components/common.css');

page{
  background: rgb(255, 214, 55);
}
.casino-banner{
    width: 100vw;
    height: 302rpx;
}
.casino-main{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.time-block{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}
.time-block>div:first-child{
    font-size: 15px;
    font-weight: bold;
    letter-spacing: 1px;
}
.time-block>div:last-child{
    display: flex;
    width: 352rpx;
    font-size: 12px;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
}
.time-block-black{
    background: #000;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 4px;
    color: #fff;
    font-size: 11px;
}
.casino-block{
    border-radius: 12px;
    overflow: hidden;
    margin-top: 20px;
}
.casino-block>img{
    width: 340px;
    height: 170px;
}
.casino-block-bottom{
    background: #fff;
    padding: 12px 16px;
}
.casino-block-bottom>div:first-child{
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    font-weight: bold; 
}
.casino-block-bottom>div:first-child>span:first-child{
    letter-spacing: 1px;
}
.casino-block-bottom>div:last-child{
    font-size: 15px;
    margin-top: 2px;
    color: #666;
}
.casino-btn{
    margin-top: 30px;
    width: 205px;
    height: 48px;
    border-radius: 24px;
    background: linear-gradient(to right,rgb(255,108,36),rgb(255,57,24));
    line-height: 48px;
    text-align: center;
    color: #fff;
    letter-spacing: 1px;
    font-size: 18px;
}
.total-text{
    font-size: 12px;
    margin-top: 10px;
}
.rule{
    margin: 30px 0 50px;
    width: 340px;
    box-sizing: border-box;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgb(252, 185, 2);
    
}
.out-rule{
    padding: 26px 30px 32px;
    box-shadow: inset 0 0 10px rgb(252, 214, 61);
}
.rule-title{
    display: flex;
    justify-content: center;
}
.rule-title>div:first-child{
    width: 16px;
    height: 20px;
}
.rule-title>div:last-child{
    width: 18px;
    height: 18px;
}
.rule-title>div:nth-child(2){
    font-weight: bold;
    font-size: 17px;
    letter-spacing: 1px;
    margin-bottom: 2px;
    margin: 0px 15px 3px;
}
.rule-content{
    margin-top: 26px;
    font-size: 12px;
    line-height: 18px;
    color: #666;
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
.lucy{
    margin-bottom: 10px;
}
.lucy-content{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.lucy-content>img{
    background: #666;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-bottom: 8px;
    margin-top: 30px;
}
.lucy-content-name{
    color: #999;
    font-size: 12px;
}
.lucy-content-info{
    color: #666;
    font-size: 18px;
    margin-top: 24px;
    margin-bottom: 14px;
    letter-spacing: 1px;
}
.lucy-content-btn{
    color: #fff;
    font-size: 15px;
    background: rgb(247,85,35);
    line-height: 27px;
    height: 27px;
    width: 91px;
    border-radius: 13px;
    text-align: center;
}
</style>