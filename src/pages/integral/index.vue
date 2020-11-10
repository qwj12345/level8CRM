<template>
  <div id="page">
      <card hasAgree='true' :integral='integralNum'></card>
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
                      赚出发币
                  </div>
              </div>
              <!-- 出发币兑换 -->
              <div class="put-integral"  @click="tabHeader(2)">
                    <div class="integral-img">
                      <img v-if="isGetIntegral" src="/static/images/put_integral.png"/>
                      <img v-if="!isGetIntegral" src="/static/images/s_put_integral.png" />
                    </div>
                    <div :class="{'nos_integral-title':isGetIntegral}">
                      出发币兑换
                    </div>
              </div>
          </div>
          <!--  -->
          <div v-if="isGetIntegral">
            <!--  -->
            <div class="integral-content month">
                <div class="sign-top">
                    <div class="sign-top-left">
                        <div class="sign-title">
                            已连续签到{{totalTime}}天
                        </div> 
                        <div class="sign-title-desc">
                            共获得{{totalIntegral}}出发币
                        </div>
                    </div>
                    <div class="sign-top-right" @click="toggleSignRule">
                        活动规则
                    </div>
                </div>
                
                <div class="sign-list">
                    <scroll-view  scroll-x="true" enhanced="true" :scroll-into-view="intoId" @scroll="scrollM" :show-scrollbar="true" > 
                        <div v-for="(item,key) in signItem" :key="key" class="sign-item-block" :id="'sign'+key" @click="subscribe(item)">
                            <div class="sign-item" :style="{'background':stateColor[item.state],'border':item.state==='KBQ'||item.state==='KYQ' ? '1px solid rgb(239, 237, 240)':''}"> 
                                <div class="coin" >
                                    <img v-if="!item.trophyId" :src="item.state==='KBQ'||item.state==='KYQ' ? '/static/images/bq_icon.png' : '/static/images/coin.png'" mode="widthFix"/>
                                    <img class="gift-icon" v-else src="/static/images/gift_icon.png" mode="widthFix"/>
                                </div>
                                <div v-if="(item.state === 'DQ' && item.integral) && !item.trophyId" class="sign-integral">+{{item.integral}}</div> 
                                <div v-if="item.state === 'YQ'" class="sign-gou"></div>
                            </div>
                            <div class="sign-day">{{key+1}}天</div>
                        </div>

                    </scroll-view>
                </div>
                <!--  -->
                <div class="scroll-block">
                    <div class="scroll-line" :style="{'width':scrollWidth+'%',left:scrollLeft+'%'}"></div>
                </div>
                <!--  -->
                <div :class="{'sign-btn':!todaySign,'after-sign-btn':todaySign}" @click="goSign">
                    {{signBtnText}}
                </div>
                <!--  -->
                <div class="sign-info">
                   连续签到30天领惊喜好礼
                </div>
                <div class="sign-gift" @click="getGift">
                    查看礼品
                </div>
            </div>
            <!-- 7天签到 -->
            <!-- <div class="integral-content"> 
                <div class="get-integral-title">
                    连续签到领好礼  
                </div> 
                <div class="sign-list"> 
                    <div v-for="(item,key) in signItem" :key="key" class="sign-item">
                        <div v-show="item.sign" class="coin">
                            <img src="/static/images/coin.png"/>
                        </div>
                        <div v-if="!item.sign" class="no-sign">
                            <div :class="{'no-sign-click sign-beforn-text':item.signTo,'sign-beforn-text':!item.signTo}">+{{item.integral}}</div>
                        </div>
                        <div class="sign-text" :class="{'sign-color333':item.sign}">
                            {{item.text}}
                        </div>
                    </div>
                </div>
                
                <div class="sign-info">
                    您已累积签到<text class="colorRed">{{totalTime}}</text>天，共获得<text class="colorRed">{{totalIntegral}}</text>出发币
                </div>
                
                <div :class="{'sign-btn':!todaySign,'after-sign-btn':todaySign}" @click="goSign">
                    {{signBtnText}}
                </div>
            </div> -->

            <div class="integral-content">
                <div class="get-integral-title">
                    做任务赚出发币
                </div>
                <div class="get-item" v-for="(item,key) in getItems" :key="key">
                    <!--  -->
                    <div class="get-left">
                        <div class="get-item-img">
                            <img :src="item.imgUrl"/>
                        </div>
                            <div class="get-item-content">
                                <div class="get-item-title">
                                    {{item.title}}
                                </div>
                                <div class="get-item-text">
                                    {{item.text}}
                                </div>
                            </div>
                    </div>
                    <!--  -->
                    <div class="get-btn" @click="goPage(item)" v-if="!item.success">
                        去完成
                    </div>
                    <!--  -->
                    <div class="after-get-btn"  v-if="item.success">
                        已完成
                    </div>
                    
                </div>
            </div>
            <!--  -->
            <div v-show="showGZH" class="official-account" > 
                <official-account @load="officialLoad" @error='errorLoad'></official-account>
                <div v-show="errorOfficial" class="official-error">
                    请在微信搜索“地平线8号”关注公众号，即可完成任务~~
                </div>
            </div>
          </div>

          <!--  -->
          <div class="put-integral-content" v-if="!isGetIntegral">
                <div class="put-item" v-for="(item,key) in putItems" :key="key">
                  <!--  -->
                  <div class="put-left">
                      <div class="put-item-img">
                          <img :src="item.trophyImg"/>
                      </div>
                        <div class="put-item-content">
                            <div class="put-item-title">
                                {{item.trophyName}}
                            </div>
                            <div class="del-item-text" v-if="item.promotionTrophyIntegral!==0">
                                {{item.trophyIntegral}}出发币
                            </div>
                            <div class="put-item-text">
                                <span v-if="item.promotionTrophyIntegral===0">{{item.trophyIntegral}}</span><span v-if="item.promotionTrophyIntegral!==0">{{item.promotionTrophyIntegral}}</span>出发币
                            </div>
                        </div>
                  </div>
                  <!--  -->
                  <div v-if="item.integralStatus==='000000'" class="get-btn" @click="showMseeage(item)">
                      兑换
                  </div>
                  <div v-if="item.integralStatus==='000002'" class="get-btn" style="background:#ddd;color:#999;font-size:12px">
                      积分不足
                  </div>
                  <div v-if="item.integralStatus==='000001'" style="width:60px">
                      <img src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/1b2050d3-45e1-4e4a-9cd2-a562eb541f93.png" mode='widthFix'/>
                  </div>
              </div>
          </div>
      </div>

            <!--  -->
      <van-popup :show="showMsg" custom-class="popup-class3" >
        <div class="modal3">
            <div v-if="!isSign" class='reg-text3' @click="myInfo">
                <span v-html="msgText"></span>
            </div>
            <div v-if="isSign" class='reg-text3 text-center'>
                <span v-html="msgText"></span>
            </div>
        <div class="reg-button" @click="hideMsg" v-if="trophyType===-1">
            确定
        </div>
        <div class="modal-btns" v-if="trophyType!==-1">
            <div class="moadal-btn border-r" @click="hideMsg">取消</div>
            <div class="moadal-btn" @click="changeGift">确定</div>
        </div>
        </div>
    </van-popup>
    <!-- 礼品领取  -->
    <van-popup :show="showReciveGift"  custom-class="popup-class" >
        <div class="info-modal">
            <div>签到成功</div>
            <div>
                恭喜您连续签到30天成功，<br/> 
                获得我们为您准备的惊喜礼品。
            </div>
            <div @click="reciveGift">领取礼品</div> 
        </div>
    </van-popup>
    <!-- 签到规则 -->
    <van-popup :show="showSignRule"  custom-class="popup-class" >
        <div class="info-modal">
            <div>签到规则</div>
            <div style="text-align:left">
                1. 每日签到领8个出发币;<br/> 
                2. 连续签到7天，第8天可领88个出发币;<br/>
                3. 连续签到30天，赠送实物礼品一份;<br/>
                4. 漏签可在1天内进行补签，每人免费补签1次，之后可通过邀请好友获得补签机会，每邀请1位好友即可领取1次补签机会;<br/>
                5. 礼品数量有限，先到先得。
            </div>
            <div @click="toggleSignRule">好的</div> 
        </div>
    </van-popup>
    <!-- 补签 -->
    <van-popup :show="showSubscribe" custom-class="popup-class" >
        <div class="info-modal">
            <div>申请补签</div>
            <div class="subscribe-content" v-html="subscribeText">
                {{subscribeText}}
            </div>
            <div class="modal-btns">
                <div @click="toggleSub">放弃补签</div>
                <div v-if="subscribeText === '您有一次免费补签机会，<br/>之后可通过邀请好友获得补签机会。'" @click="subSign">立即补签</div>
                <button v-else open-type='share'>立即邀请</button>
            </div>
        </div>
    </van-popup>
    <van-popup :show="showGift" custom-class="giftPopup" >
        <div style="width:80vw;position:relative;"><img @click="toggleGift" class="close-icon" src="/static/images/close.png"><img style="border-radius:8px" :src="trophyImg" mode="widthFix"/></div>
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue';

import {wxRequest,getToken,wxuuid,timeFormat1} from '@/components/common'
import card from '@/components/card'
export default {
    data(){
        return{
            subscribeText:'',
            signDate:'',//要补签的日期  
            stateColor:{'YQ':'#FFd637','DQ':'rgb(239, 237, 240)','KBQ':'#FFFFFF','KYQ':'#FFFFFF'},
            showGift:false,
            showReciveGift:false,
            showSubscribe:false,
            showSignRule:false,
            errorOfficial:false,
            integralNum:0,
            showMsg:false,
            msgText:'',
            isGetIntegral:true,
            getItems:[
                {imgUrl:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/dd853042-3acd-4a8b-b5bf-4008d4abb3a6.png',title:'关注公众号',text:'关注地平线8号官方微信公众号即可获取 200 个出发币，升级为新8会员',success:false,url:''},
                {imgUrl:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/00990e96-6e9d-4426-a11e-b2f26b52b572.png',title:'邀请好友',text:'每邀请一位好友注册成为地平线8号会员，双方各得 100 个出发币',success:false,url:'/pages/inviteList/main'},
                {imgUrl:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/f1937e1f-699f-4476-96a7-5f14ce30f5bc.png',title:'分享独家精选内容 ',text:'每分享一篇精选内容即可获取该文章相应奖励的出发币',success:false,url:'/pages/newmsg/main?type=1'},
                {imgUrl:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/组33-07b3d815-f9a4-4ced-82fe-223bfad3d501.png',title:'完善个人信息',text:'每邀请一位好友成为地平线8号注册会员，双方各得100出发币',success:false,url:'/pages/myinfo/main'},
                {imgUrl:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/edd4ee55-3cd2-4482-9a12-57996284bacf.png',title:'问卷调查',text:'关注公众号获得200个出发币',success:false,url:'/pages/comingsoon/main'},
            ],
            putItems:[],
            signItem:[],
            todaySign:false,
            signBtnText:'签到',
            index:0,
            totalIntegral:'',
            totalTime:'',
            showGZH:false,
            trophyType:-1,
            msgType:0,
            id:0,
            isSign:false,
            clickBtn:false,
            confirmBtn:false,
            trophyImg:'',
            signTrophyId:0,//今天签到领取的礼品id
            intoId:'',   //签到列表滚动到哪里  
            signBlockWidth:0,//签到列表的显示宽度
            scrollWidth:'',//自定义滚动条黑色的宽度
            scrollLeft:'',//自定义滚动条黑色距离左侧的距离  
        }
    },
    components:{
        card
    },
    watch: {
        todaySign:function(val){
            val===true ? this.signBtnText = '已签到' : this.signBtnText = '签到';
        }
    },

    methods: {
        // 补签
        subscribe(item){
            this.signDate = item.signDate;
            if(item.state==='KBQ'){
                this.subscribeText = '您有一次免费补签机会，<br/>之后可通过邀请好友获得补签机会。';
                this.toggleSub();
            }else if(item.state==='KYQ'){
                this.subscribeText = '免费补签机会已用完，可通过<br/>邀请1名好友<br/>获得1次补签的机会';
                this.toggleSub();
            }else if(item.isTakeTrophy===0 && item.state === 'YQ'){// 点击图标领取礼品
                this.signTrophyId = item.trophyId;
                this.reciveGift();
            }
        },
        // 补签接口
        subSign(){
            wx.showLoading({
                title:"补签中"
            })
            let data = {
                token:wx.getStorageSync('token'),
                dateStr:this.signDate
            }
            wxRequest('/miniProgram/api/sign/bqSign',{data,contentType:'application/x-www-form-urlencoded',method:'POST'}).then(res => {
                wx.hideLoading();
                if(res.data.code===0){
                    wx.showToast({
                        title: '补签成功',
                        icon: 'success',
                        duration: 1000
                    })
                    this.todaySign = res.data.data.todaySign === 0 ? false : true;
                    this.signItem = res.data.data.signRecords;
                    this.totalTime = res.data.data.totalTime;
                    this.totalIntegral = res.data.data.totalIntegral;
                }else{
                    wx.showToast({
                        title: '补签失败',
                        icon: 'none',
                        duration: 1000
                    })
                }
                this.toggleSub();
            })
        },
        
        //领取礼品接口  
        reciveGift(){
            wx.showLoading({
                title:"领取中"
            })
            let data = {
                token:wx.getStorageSync('token'),
                trophyId:this.signTrophyId
            }
            wxRequest('/miniProgram/api/sign/signMiniProgramTrophy',{data,contentType:'application/x-www-form-urlencoded',method:'POST'}).then(res => {
                console.log('121',res)
                wx.hideLoading();
                if(res.data.code===0){
                    wx.showToast({
                        title: '领取成功',
                        icon: 'success',
                        duration: 1000
                    })
                }else if(res.data.code===605){
                    this.trophyType = -1;
                    this.msgText = '礼品只能领取一次哦';
                    this.isSign = true;
                    this.showMsg = true;

                }else if(res.data.code===602){
                    this.trophyType = -1;
                    this.msgText = '礼品已领完，谢谢参与！';
                    this.isSign = true;
                    this.showMsg = true;
                }else{
                    wx.showToast({
                        title: '领取失败',
                        icon: 'none',
                        duration: 1000
                    })
                }
                this.showReciveGift = false;
            })
        },
        // 领取礼品弹窗
        toggleReciveGift(){
            this.showReciveGift = !this.showReciveGift;
        },
        // 签到规则弹窗
        toggleSignRule(){
            this.showSignRule = !this.showSignRule;
        },
        // 补签弹窗
        toggleSub(){
            this.showSubscribe = !this.showSubscribe;
        },
        // 礼品弹窗
        toggleGift(){
            this.showGift = !this.showGift;
        },
        // 获取礼品接口
        getGift(){
            wx.showLoading({
                title:""
            })
            wxRequest('/miniProgram/api/sign/trophyInfo',{data:{},contentType:'application/x-www-form-urlencoded',method:'POST'}).then(res => {
                wx.hideLoading();
                this.trophyImg = res.data.data.trophyImg;
                this.toggleGift();
            })
        },
        scrollM(e){
            this.scrollLeft = e.target.scrollLeft / e.target.scrollWidth * 100;
            this.scrollWidth = this.signBlockWidth / e.target.scrollWidth * 100; 
        },
        hideMsg(){
            this.showMsg = false;
            setTimeout(() => {
                this.isSign = false;//判断是不是签到的弹窗 是的话文字要居中 
            },1000)

        },
        tabHeader(index){
            if(index === 1){
                // 当进来是兑换礼品时还没有请求签到  切换到积分获取时要请求签到信息  
                if(this.signBlockWidth===0){
                    this.getSignList();
                } 
                this.isGetIntegral = true;
            }
            else{
                this.isGetIntegral = false;
            }
        },
        goPage(item){
            if(item.url!==''){
                wx.navigateTo({
                    url:item.url
                })
            }else{
                this.showGZH = true;
                let that = this;
                that.pageScrollToBottom();

            }
        },
        showMseeage(item){
            if(!this.clickBtn){
                this.clickBtn = true;
                wx.showLoading({
                    title: '请稍后',
                    mask:true
                })
                this.trophyType = -1;
                this.msgType = 0;
                this.id = item.id;
                let data = {
                    token:wx.getStorageSync('token'),
                    goodsId:item.id
                }
                wxRequest('/miniProgram/api/goods/conversion/str',{data:data}).then(res => {
                    if(res.data.status === 0){
                        this.trophyType = item.trophyType; 
                        this.msgText = res.data.str;
                        this.showMsg = true;
                        this.msgType = res.data.type;
                    }else if(res.data.status === 10016 || res.data.status === 10017|| res.data.status === 10019){
                        this.msgText = res.data.msg;
                        this.showMsg = true;
                    }else{
                        this.msgText = '兑换失败，请联系客服';
                        this.showMsg = true;
                    }
                    wx.hideLoading();
                    setTimeout(()=>{
                        this.clickBtn = false;
                    })
                })
            }
        },
        changeGift(){
            if(!this.confirmBtn){
                this.confirmBtn = true;
                wx.showLoading({
                    title:"请稍后",
                    mask:true
                })
                let data = {
                    token:wx.getStorageSync('token'),
                    goodsId:this.id
                }

                wxRequest('/miniProgram/api/goods/conversion',{data:data}).then(res => {
                    if(res.data.status === 0){
                        this.msgText = res.data.str;
                        getApp().globalData.integralNum = res.data.integralNum;
                        this.integralNum = getApp().globalData.integralNum;
                        this.showMsg = false;
                        wx.showToast({
                            title:'兑换成功',
                            icon:'success',
                            duration:1000
                        })
                    }else{
                        this.msgText = '兑换失败，请联系客服';
                        this.showMsg = true;
                    }
                    wx.hideLoading();
                    
                    setTimeout(()=>{
                        this.confirmBtn = false;
                    },1000)
                })
            }

        },
        goSign(){
            wx.showLoading({
                title: '签到中',
                mask:true
            })
            this.trophyType = -1;
            wxRequest('/miniProgram/api/sign/l8Sign',{data:{token:wx.getStorageSync('token')},contentType:'application/x-www-form-urlencoded',method:'POST'}).then(res => {
                wx.hideLoading();
                this.isSign = true;//判断是不是签到的弹窗 是的话文字要居中  
                if(res.data.code === 0){
                    this.todaySign = res.data.data.todaySign === 0 ? false : true;
                    this.signItem = res.data.data.signRecords;
                    this.totalTime = res.data.data.totalTime;
                    this.totalIntegral = res.data.data.totalIntegral;
                    // 判断今天签到有没有礼品
                    let giftSign = this.signItem.filter(item => {
                       return item.isToday===1 && item.trophyId
                    })
                    console.log('giftSign',giftSign)
                    if(giftSign.length>0){//最后一天领取礼品
                        this.signTrophyId = giftSign.trophyId;
                        this.toggleReciveGift();
                    }else{
                        wx.showToast({
                            title: '签到成功',
                            icon: 'success',
                            duration: 1000
                        })
                    }
                }else if(res.data.code === 10013){
                    this.showMsg = true;
                    this.msgText = '已签到，请勿重复签到！';
                }else{
                    this.showMsg = true;
                    this.msgText = '签到失败，请稍后再试！';
                }
            })
        },
      // goSign(){
        //     let that = this;
        //     this.trophyType = -1;
        //     wxRequest('/miniProgram/api/sign',{data:{token:wx.getStorageSync('token')}}).then(res => {
        //         this.isSign = true;//判断是不是签到的弹窗 是的话文字要居中  
        //         if(res.data.status === 0){
        //             wx.showToast({
        //                 title: '签到成功',
        //                 icon: 'success',
        //                 duration: 1000
        //             })

        //             let signInfo = JSON.parse(res.data.data);
        //             let signInfo2 = JSON.parse(res.data.data2);
        //             this.todaySign = signInfo.todaySign;
        //             this.signItem = signInfo.signRecord;
                    
        //             // this.signItem[this.index].signTo = true;//根据signTo实现动画效果
        //             getApp().globalData.integralNum = signInfo2.userTotalIntegral;
        //             this.integralNum = signInfo2.userTotalIntegral;
        //             this.totalTime = signInfo2.totalTime;
        //             this.totalIntegral = signInfo2.totalIntegral;
        //                 that.signItem[that.index].sign = true; //因为动画效果有0.5s，所以改变每一个签到状态的图标需要延迟0.5s
        //                 this.signItem[key].text = `${key+1}天`;

        //             // for(let key=0;key<7;key++){
        //             //     this.signItem[key].text = `${key+1}天`;
        //             //     this.signItem[key].signTo = false;//根据signTo实现动画效果，动画完后signTo重新为false
        //             // }
        //             // setTimeout(function(){
        //             //     that.signItem[that.index].sign = true; //因为动画效果有0.5s，所以改变每一个签到状态的图标需要延迟0.5s
        //             // },500)

        //         }else if(res.data.status === 10013){
        //             this.showMsg = true;
        //             this.msgText = '已签到，请勿重复签到！';
        //         }else{
        //             this.showMsg = true;
        //             this.msgText = '签到失败，请稍后再试！';
        //         }
        //     })

        // },
        // 页面滚到底部,以便点击关注公众号任务时自动滚动到底部  
        pageScrollToBottom() {                
            wx.createSelectorQuery().select('#page').boundingClientRect(function(rect) {
            if (rect){
                // 使页面滚动到底部
                console.log(rect.height);
                wx.pageScrollTo({
                    scrollTop: rect.height+100
                })
            }
            }).exec()
        },
        // 
        getTaskList(){
            wxRequest('/miniProgram/api/notification/task',{data:{token:wx.getStorageSync('token')}}).then(res => {
                this.getItems[3].success = res.data.data.userInfo;
                this.getItems[4].success = res.data.data.questionnaire;
                this.getItems[2].success = res.data.data.article;
                this.getItems[0].success = res.data.data.followWeChat;
                // getItems[3]直接写死 没有获取状态
            })

            // 获取兑换物品的列表
            wxRequest('/miniProgram/api/trophy/exchangeGoodsList',{data:{token:wx.getStorageSync('token')}}).then(res => {
               this.putItems = res.data.data;
            })
        },
        myInfo(){
            if(this.msgType === 2)
                wx.navigateTo({
                    url:'/pages/myinfo/main'
                })
        },
        errorLoad(e){
            console.log('official',e.type)
            if(e.type === 'error'){
                this.errorOfficial = true;
            }else{
                this.errorOfficial = false;
            }
        },
        // 获取签到信息   
        getSignList(){
            wx.showLoading({
                title:"加载中",
                mask:true
            })
            wxRequest('/miniProgram/api/sign/l8Sign/list',{data:{token:wx.getStorageSync('token')},contentType:'application/x-www-form-urlencoded',method:'POST'}).then(res => {
                wx.hideLoading();
                this.todaySign = res.data.data.todaySign === 0 ? false : true;
                this.signItem = res.data.data.signRecords;
                this.signItem.forEach(item => {
                    if(item.isToday===1){
                        this.intoId = 'sign'+(item.dayNum-3); 
                    }
                })
                this.totalTime = res.data.data.totalTime;
                this.totalIntegral = res.data.data.totalIntegral;
                // 获取签到的框的宽度
                var query = wx.createSelectorQuery();
                query.select('.sign-list').boundingClientRect((rect) =>{
                    this.signBlockWidth = rect.width;
                }).exec();
            })
        },
        // getSignList(){ 
        //     wxRequest('/miniProgram/api/sign/list',{data:{token:wx.getStorageSync('token')}}).then(res => {
        //         let signInfo = JSON.parse(res.data.data);
        //         let signInfo2 = JSON.parse(res.data.data2);
        //         this.totalTime = signInfo2.totalTime;
        //         this.totalIntegral = signInfo2.totalIntegral;
        //         this.todaySign = signInfo.todaySign;
        //         this.signItem = signInfo.signRecord;
        //         this.signItem = Object.values(this.signItem);
        //         this.signItem.push({text:'7天',ani:null,sign:false,signTo:false})
        //         this.signItem.push({text:'7天',ani:null,sign:false,signTo:false})
        //         this.signItem.push({text:'7天',ani:null,sign:false,signTo:false})
        //         this.signItem.push({text:'7天',ani:null,sign:false,signTo:false})

        //         for(let key=0;key<7;key++){
        //             this.signItem[key].text = `${key+1}天`;
        //             this.signItem[key].signTo = false;
        //         }
        //         for(let key=0;key<7;key++){
        //             if(this.signItem[key].sign == false){
        //                 this.index = key;
        //             }
        //         }
        //         this.intoId = 'sign1';
        //         // 获取签到的框的宽度
        //         var query = wx.createSelectorQuery();
        //         query.select('.sign-list').boundingClientRect((rect) =>{
        //             this.signBlockWidth = rect.width;
        //         }).exec();
        //     })
        // }
    },
    onShareAppMessage(res) {
        //转发时携带 shareTicket才能在回调中获取到shareTickets 
        wx.showShareMenu({
            withShareTicket: true
        })
        let code = wxuuid();//设置32位UUID为邀请码  
        let data = {
            token:wx.getStorageSync('token'),
            code:code,
            dateStr:this.signDate
        }

        // 分享接口，设置分享码 
        wxRequest('/miniProgram/api/sign/sendBqInvitation',{data:data,contentType:'application/x-www-form-urlencoded',method:'POST'}).then(res => {

        }) 
        // 
        this.toggleSub();
        return {
            title:"快快一键加入我们！每日福利，惊喜不断。",
            path: "/pages/index/main?code="+code,// 路径，传递参数到指定页面。 
            desc:"一起和我了解L8，获取惊喜大礼包",
            imageUrl:"https://level8cases.oss-cn-hangzhou.aliyuncs.com/f5af3c3d-6d45-4feb-ab19-65a144110eb0.png"
        }
    },
    onShow(){
        let that = this;
        this.showGZH = false;
        this.showMsg = false;
        this.isSign = false;
        if(getApp().globalData.integralNum !== undefined)
            this.integralNum = getApp().globalData.integralNum;
        this.getTaskList();
        let data = {
            token:wx.getStorageSync('token')
        }
        wxRequest('/miniProgram/api/integral/is/follow/weChat',{data:data}).then(res => {
            console.log(666,res.data.type)//0已关注 1未关注
            if(res.data.type === 1){
                wx.login({
                    success (res) {
                        wx.getUserInfo({
                            success: function(e) {//用户已授权
                                getToken(e.encryptedData,e.iv).then(res => {
                                    that.getTaskList();
                                    let data = {
                                        token:wx.getStorageSync('token')
                                    }
                                    wxRequest('/miniProgram/api/user/info',{data:data}).then(res => {
                                        that.integralNum = res.data.data.integralNum;
                                        getApp().globalData.isQrcodeCheckUser = res.data.data.isQrcodeCheckUser;
                                        getApp().globalData.integralNum = that.integralNum;
                                    })
                                });
                            }
                        })
                        if (res.code) {
                            //发起网络请求
                            getApp().globalData.code = res.code;
                        } else {
                            console.log('登录失败！' + res.errMsg)
                        }  
                    }
                })
            }
        })     
    },
    
   
    onLoad(query){
        if(query.type === '1'){
            this.isGetIntegral = false;
        }else{
            this.isGetIntegral = true;
            this.getSignList();
        }
        this.trophyType = -1;
        
    }
}
</script>

<style>
@import url('../../components/common.css');
page{
    background: #efeff4; 
}

.integralpage{
    position: relative;
    padding: 20px 0;
    width: 90vw;
    margin: 0 auto;
    border-top-left-radius:16px;
    border-top-right-radius:16px;
    margin-top: calc(86px - 41.2vw);
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
    font-size: 16px;
}
.integral-img{
    height: 24px;
    width: 24px;
    margin-right: 10px;
}
.nos_integral-title{
    color: #999 !important;
}
.sign-list{
    display: flex;
    justify-content: space-between;
    padding: 16px 0px;
}
.coin{
    width: calc((90vw - 40px) / 9);
    height: calc((90vw - 40px) / 9);
    margin-bottom: 6px;
}

.sign-item{
    display: flex;
    align-items: center;
    flex-direction: column;
}
.sign-text{
    color: #999;
    font-size: 12px;
}
.no-sign-click{
    opacity: 0;
    margin-top: -50px;
}
.sign-beforn-text{
    transition: all 0.5s linear;
}
.no-sign{
    width: calc((90vw - 40px) / 9);
    height: calc((90vw - 40px) / 9);
    background: rgba(255,214,55, 0.3);
    color:rgb(235, 105, 18);
    border-radius: 50%;
    margin-bottom: 6px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.gift-img{
    width: 40%;
    height: 40%;
}
.sign-color333{
    color: #333;
}
.sign-info{
    font-size: 12px;
    text-align: center;
    padding: 10px 0 6px 0;
    color: rgb(136, 136, 136);
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
.integral-content{
    padding: 20px 20px;
    background: #fff;
    margin-top: 15px;
    border-radius: 14px;
}
.put-integral-content{
    padding: 10px;
    background: #fff;
    margin-top: 15px;
    border-radius: 14px;
}
.get-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
}
.put-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
}
.get-left{
    display: flex;
    margin-right: 4px;
    width: calc(100% - 60px);
}
.get-item-img{
    width: 40px;
    height: 40px;
    margin-right: 20px;
    flex-shrink: 0;
}
.put-left{
    display: flex;
    width: calc(100% - 60px);
}
.put-item-img{
    width: 86px;
    height: 86px;
    margin-right: 16px;
    border-radius: 8px;
    overflow: hidden;
}
.get-integral-title{
    font-weight: bold;
    margin-bottom: 10px;
    letter-spacing: 1px;
}
.get-item-content{
    display: flex;
    flex-direction: column;
    justify-content: space-between;

}
.get-item-title{
    font-size: 14px;
    font-weight: bold;
}

.get-item-text{
    color: rgb(170, 169, 169);
    font-size: 12px;
}

.put-item-content{
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: calc(100% - 105px);
}
.put-item-title{
    overflow: hidden;    
 	text-overflow: ellipsis;
 	white-space: nowrap;
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 6px;
    box-sizing: border-box;
}

.put-item-text{
    color:rgb(235, 105, 18);
    font-size: 13px;
}
.del-item-text{
    color:#bbb;
    font-size: 12px;
    text-decoration: line-through;
    margin-bottom: 3px;
    margin-top: -2px;
}
.get-btn{
    background: #FFD637;
    width: 60px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    font-size: 13px;
    border-radius: 14px;
}
.after-get-btn{
    background: #efefef;
    color: #999;
    width: 60px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    font-size: 13px;
    border-radius: 14px;
}
.colorRed{
    color: red;
}
.sign-btn{
    background: #FFD637;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 22px;
    width: 46vw;
    margin: 0 auto;
    margin-top: 14px;
    font-weight: bold;
}
.after-sign-btn{
    background: #efefef;
    color:#999;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 22px;
    width: 46vw;
    margin: 0 auto;
    margin-top: 14px;
    font-weight: bold;
}
.modal3{
    width: 270px;
    text-align: center;
}
.popup-class3{
    border-radius: 10px;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
.reg-text3{
    padding: 20px 30px;
    text-align: left;
}
.text-center{
    text-align: center !important; 
}
.reg-button{
    color: #FFD637;
    height: 46px;
    line-height: 46px;
    text-align: center;
    border-top: 1px solid #cecece;
}
.modal-btns{
    color: #FFD637;
    display: flex;
    border-top: 1px solid #cecece;
}
.moadal-btn{
    height: 46px;
    line-height: 46px;
    text-align: center;
    width: 50%;
    box-sizing: border-box;
}
.border-r{
    border-right: 1px solid #cecece;
}
.official-account{
  width: 90vw;
  margin: 0 auto;
  margin-top: 10px;
  /* border-radius: 10px; */
  overflow: hidden;
}
.official-error{
    font-size: 15px;
    padding: 16px 14px;
    background: #fff;
    border-radius: 10px;
    color: rgb(235, 105, 18);

}

.month{
    padding: 14px 14px;
}
.sign-gou{
    border: 2px solid #fff;
    border-top: none;
    border-right: none;
    width: 8px;
    height: 5px;
    transform: rotate(-45deg);
}
.month .sign-list{
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    white-space: nowrap;
    /* width: 100%; */
    padding: 16px 0px;
}
.month .coin{
    width: 100%;
    margin-bottom: 4px;
    height: auto;
}
.gift-icon{
    width: 90%;
    margin: 0 auto;
}
.month .sign-item-block{
    display: inline-block;
    
}
.month .sign-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    border-radius: 8px;
    padding: 8rpx 12rpx 16rpx;
    background: rgb(239, 237, 240);
    margin-right: 12rpx;
    width: calc((90vw - 64px) / 7); 
    box-sizing: border-box;
    height: 102rpx;
}

.month .sign-day{
    width: calc((90vw - 64px) / 7);
    text-align: center;
    color: #000;
    font-size: 10px;
    margin-top: 4px;
}
.month .sign-integral{
    color: #666;
    font-size: 10px;
}
.month .gift-img{
    width: 40%;
    height: 40%;
}
.month .sign-color333{
    color: #333;
}
.month .sign-info{
    font-size: 12px;
    text-align: center;
    padding: 6px 0 4px 0;
    color: rgb(136, 136, 136);
}
.scroll-block{
    position:relative;
    width:204rpx;
    margin: 0px auto;
    height: 3px;
    background: rgb(220, 220, 220);
    border-radius: 2px;
    overflow: hidden;
}
.scroll-line{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 50%;
    background: #000;
    border-radius: 2px;
    left: 0;
    transition: all .05s linear;
}
::-webkit-scrollbar {
     width: 0;
     height: 0;
     color: transparent;
     display: none;
 }
 .sign-top{
     display: flex;
     justify-content: space-between;
     align-items: center;
     position: relative;
 }
 .sign-title{
    font-weight: bold;
    margin-bottom: 2px;
    letter-spacing: 1px;
 }
  .sign-title-desc{
    font-size: 10px;
 }
  .sign-top-right{
      position: absolute;
      background: #FFD637;
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
      font-size: 10px;
      right: -14px;
      padding: 5px 14px;
      top: 4px;
  }
  .sign-gift{
      color: #FFD637;
      text-decoration: underline;
      font-size: 12px;
      text-align: center;
      margin-bottom: 4px;
  }

  /*  */
  .info-modal{
    padding: 20px 0px 0;
    width: 280px;
}
.info-modal>div{
    text-align: center;
}
.info-modal>div:first-child{
    font-size: 17px;
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

.info-modal .modal-btns{
    border-top: 1px solid #eeeeee;
}
.info-modal .modal-btns>div,.modal-btns>button{
    width: 50%;
    font-size: 16px;
    letter-spacing: 1px;
    text-align: center;
    height: 46px;
    line-height: 46px;
}
.info-modal .modal-btns>div:first-child{
    color: #999;
}
.info-modal .modal-btns>div:last-child{
    color: rgb(255, 214, 55);
}
.info-modal .modal-btns>button{
    color: rgb(255, 214, 55);
    background: #fff;
}
.subscribe-content{
    padding: 0 20px !important;
}
.close-icon{
    position: absolute;
    width: 26px;
    height: 26px;
    top: -10px;
    right: -10px;
}
.giftPopup{
    overflow: visible !important;
    background: none !important;
}

</style>