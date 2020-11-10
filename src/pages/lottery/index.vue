<template>
  <div>
    <div class="page-top">
        <!-- <img class="page-top-back" mode="widthFix" src=""/> -->
        <div class="header">
            <div class="header-btn" v-show="false">
                <span>我的奖品</span>
                <img class="face-right" src="/static/images/w_face_right.png"/>
            </div>
            <div class="header-btn" @click="goRule">
                <span>抽奖规则</span>
                <img class="face-right" src="/static/images/w_face_right.png"/>
            </div>
        </div>  
         <!--抽奖次数  -->
        <div class="lottery-num">今日还可抽 <span class="fontBold">{{lotteryNum}}</span> 次</div>
        <!-- 中奖通告 -->
        <div class="notice">
            <div class="gift-icon"><img src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/e3fcac4d-bf8c-4e1b-bc31-d52fd5702f12.png"/></div>
            <swiper class='lottery-swiper' autoplay="true" :vertical='true' :circular='true' interval='4000' :current='swiperIdNotice'>
                <block v-for="(item,key) in notices" :key="key">
                    <swiper-item >
                        中奖通知：{{item}}
                    </swiper-item>
                </block>
            </swiper>
        </div>
        <!-- 抽奖机器 -->
        <div class="machine" :class="{'machine2':backImg}">
            <img :src="machineImg" class="machine-img"/>
            <img class="trunk" :class="{'left50':moveTrunk}" src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/trunk-ea89cdf2-77c4-44c9-ace1-8bd0d1be2620.png"/>
            <img v-show="showScreen" class="scree-animation" src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/b156fb27-612f-4c99-9cff-28fe0e7dddba.gif"/>
            <div v-if="showLight" class="lights">
                <div class="line-red rotate315"></div>
                <div class="line-red"></div>
                <div class="line-red rotate45"></div>
            </div>
        </div>
        <div class="footer-color"></div>
    </div>
    <div class="page-bottom">
        <div>我有{{integralNum}}出发币</div>
        <div class="lottery" @click="goLottery">
            <img class="lottery-btn" :src="btnImg"/>
            <div class="lottery-btn-text">{{btnText}}</div>
        </div>
        <!-- 奖品展示 -->
        <div style="width:100%;height:65vw;background:url('https://level8cases.oss-cn-hangzhou.aliyuncs.com/5ca0c82e-b111-45f8-a17b-f891e7355fa4.png');background-size:cover">
            <div class="showGiftTitle">
                <div class="text">本期奖品</div>
            </div>
            <div class="show-gift">
                <swiper class='show-swiper'  :circular='true' :current='swiperId' >
                    <block v-for="(item,key) in gifts" :key="key" >
                        <swiper-item>
                            <div class="gift-item"  v-for="(value,index) in item" :key="index" :style="value.show">
                                <div class="gift-img"><img :src="value.trophyImg" style="width:100%;height:100%" /></div>
                                <div style="font-size:14px;color:#000;margin:6px 0 4px">{{trophyGrace[value.trophyGrade]}}</div>
                                <div style="font-size:12px;color:#333;text-align:center;display: -webkit-box;word-wrap: break-word;white-space: normal !important;overflow: hidden;overflow: ellipsis;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{value.trophyName}}</div>
                            </div>
                        </swiper-item>
                    </block>
                </swiper>
                <!-- 左右按钮 -->
                <div class="left-btn"  @click="preImg">
                    <img src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/14eee643-9527-41d5-a523-c731f9e8da79.png" mode='widthFix'/>
                </div>
                <div class="right-btn"  @click="nextImg">
                    <img src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/14eee643-9527-41d5-a523-c731f9e8da79.png" mode='widthFix'/>
                </div>
            </div>
        </div>
    </div>
    <!-- <div @click="test1">123</div> -->
    <div class="model-shadow" v-if="showModel">
    </div>
    <!-- 未中奖 -->
    <div v-if="showModel && lotteryResult.trophyGrade===7" class="model-show">
        <img v-if="showModel" @click="closeModel" class="close-icon" src="/static/images/close_model.png">
        <div>哎呀，就差那么一点点~</div>
        <div class="font12 marginTop10">别灰心，再来一次！</div>
        <div class="model-img">
            <img src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/9698397d-2f73-4726-b2e9-47cfacc72b2b.png"/>
        </div>
        <div class="model-btn" @click="closeModel">再抽一次</div>
        <div class="color999 font10 marginTop4">{{btnText}}，今日还可抽{{lotteryNum}}次</div>
    </div>
    <!-- 中奖 -->
    <div v-if="showModel && lotteryResult.trophyGrade!==7" class="model-show">
        <img v-if="showModel" @click="closeModel" class="close-icon" src="/static/images/close_model.png">
        <div>恭喜您</div>
        <div class="font12 marginTop10 text-left"><span v-html="lottery_success_str" @click="myInfo"></span></div>
        <div class="model-img">
            <img src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/8ff0e889-56da-4c28-920d-f5b741ab84f5.png"/>
        </div>
        <div class="model-btn" @click="closeModel">再抽一次</div>
    </div>
    
  </div>
</template>

<script>
import {wxRequest} from '@/components/common'
export default {
    data(){
        return{
            swiperIdNotice:0,
            swiperId:0,
            integralNum:0,//积分
            lotteryNum:0,//抽奖次数
            lotteryResult:{},//抽奖结果
            showGIF:false,
            moveTrunk:false,
            showScreen:false,
            showLight:false,
            showModel:false,
            noLottery:false,
            btnText:'免费抽一次',
            lottery_success_str:'',
            btnImg:require('../../../static/images/lottery_btn.png'),
            machineImg:require('../../../static/images/machine.png'),
            notices:['kakaluote抽到了level8行李箱','kakaluoteV988抽到了level8行李箱'],
            gifts:[[
                {type:'一等奖',info:'地平线8号七巧收纳包4件套',img:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/1b2050d3-45e1-4e4a-9cd2-a562eb541f93.png'},
                {type:'二等奖',info:'地平线8号七巧收纳包4件套',img:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/1b2050d3-45e1-4e4a-9cd2-a562eb541f93.png'},
                {type:'三等奖',info:'地平线8号七巧收纳包4件套',img:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/1b2050d3-45e1-4e4a-9cd2-a562eb541f93.png'},
                ],
                [
                {type:'一等奖',info:'地平线8号七巧收纳包4件套',img:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/1b2050d3-45e1-4e4a-9cd2-a562eb541f93.png'},
                {type:'二等奖',info:'地平线8号七巧收纳包4件套',img:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/1b2050d3-45e1-4e4a-9cd2-a562eb541f93.png'},
                {type:'三等奖',info:'地平线8号七巧收纳包4件套',img:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/1b2050d3-45e1-4e4a-9cd2-a562eb541f93.png'},
                ]      
            ],
            trophyGrace:['特等奖','一等奖','二等奖','三等奖','四等奖','五等奖','六等奖']
        }
    },

    methods: {
        // 底部轮播图上一张
        preImg(){
        this.swiperId = this.swiperId > 0 ? this.swiperId-1 : this.gifts.length-1;
        },
        
        // 底部轮播图下一张
        nextImg(){
        this.swiperId = this.swiperId < (this.gifts.length-1) ? this.swiperId+1 : 0;
            console.log(this.swiperId)

        },
        goRule(){
            wx.navigateTo({
                url:'/pages/lotteryRule/main'
            })
        },
        goLottery(){
            // 箱子开始移动
            if(!this.moveTrunk && !this.noLottery){
                this.machineImg = require('../../../static/images/machine2.png');      
                this.btnImg = require('../../../static/images/after_lottery_btn.png');
                this.moveTrunk = true;
                let animation1  = null;
                let animation2  = null;
                // 履带的滚动
                animation1 = setInterval(() => {
                    this.machineImg = require('../../../static/images/machine.png');
                }, 300);
                setTimeout(() => {
                    animation2 = setInterval(() => {
                        this.machineImg = require('../../../static/images/machine2.png');  
                    },300);
                },150)

                // 3秒过后清除履带滚动动画
                setTimeout(() => {
                    clearInterval(animation1);
                    clearInterval(animation2);
                    // 显示屏幕上的动画
                    this.showScreen = true;
                    // 设置红灯上面的灯光
                    let lightAni1 = setInterval(() => {
                        this.showLight = true;
                    }, 100);
                    let lightAni2 = setInterval(() => {
                        this.showLight = false;
                    }, 200);
                    // 清除灯光
                    setTimeout(() => {
                        this.showLight = false;
                        clearInterval(lightAni1);
                        clearInterval(lightAni2);
 
                        wx.showLoading({
                            title:'加载中'
                        })
                        // 抽奖接口 
                        let data = {
                            token:wx.getStorageSync('token')
                        }
                        wxRequest('/miniProgram/api/trophy/get',{data:data}).then(res => {
                            console.log(res)
                            if(res.data.status === 0){
                                wx.hideLoading();
                                this.showModel = true;

                                this.lotteryResult = res.data.data;

                                res.data.str===undefined?this.lottery_success_str = '恭喜您已中奖':this.lottery_success_str = res.data.str;
                                this.lotteryNum = res.data.data2.luckyDrawNum;
                                getApp().globalData.integralNum = res.data.data2.integralNum;
                                this.btnText = res.data.data2.str;
                                if(this.lotteryNum === 0){
                                    this.btnImg = require('../../../static/images/after_lottery_btn.png');
                                    this.noLottery = true;
                                }else{
                                    this.btnImg = require('../../../static/images/lottery_btn.png');
                                    this.noLottery = false;
                                }
                            }else if(res.data.status === 10017 || res.data.status === 10016){
                                wx.showToast({
                                    title: res.data.msg,
                                    icon: 'none',
                                    duration: 1000
                                })
                                this.moveTrunk = false;
                                this.showModel = false;
                                this.showScreen = false;
                            }else{
                                wx.showToast({
                                    title: '系统出错 请稍后再试',
                                    icon: 'none',
                                    duration: 1000
                                })
                                this.btnImg = require('../../../static/images/lottery_btn.png');
                                this.moveTrunk = false;
                                this.showModel = false;
                                this.showScreen = false;
                            }

                        })
                        
                    }, 400);
                }, 3000);
            }
        },

        myInfo(){
            if(this.lotteryResult.trophyType === 1)
                wx.navigateTo({
                    url:'/pages/myinfo/main'
                })
        },
        closeModel(){
            this.moveTrunk = false;
            this.showModel = false;
            this.showScreen = false;
            this.integralNum = getApp().globalData.integralNum;//获取积分
        },
        getLotteryNum(){
            let data = {
                token:wx.getStorageSync('token')
            }
            wxRequest('/miniProgram/api/trophy/num',{data:data}).then(res => {
                this.btnText = res.data.data.str;
                this.lotteryNum = res.data.data.luckyDrawNum;
                if(this.lotteryNum === 0){
                    this.btnImg = require('../../../static/images/after_lottery_btn.png');
                    this.noLottery = true;
                }else{
                    this.btnImg = require('../../../static/images/lottery_btn.png');
                    this.noLottery = false;
                }
            })
        },
        getNotice(){
            this.notices = [];
            wxRequest('/miniProgram/api/trophy/someUser/list',{data:{token:wx.getStorageSync('token')}}).then(res => {
                res.data.data.forEach(item => {
                    // this.$nextTick(()=>{
                        this.notices.push(`${item.userName}抽到了${item.trophyName}`);
                    // })
                })
                this.notices = [...this.notices];//防止没有渲染 

            })
        },
        getGifts(){
            this.swiperId = 0;
            this.gifts = [];
            wxRequest('/miniProgram/api/trophy/trophyList',{data:{token:wx.getStorageSync('token')}}).then(res => {
                let giftNum = res.data.data.length;
                let index = 0;
                for(let i=1;i<=giftNum;i++){
                    if(i%3===0){
                        // this.$nextTick(()=>{
                            this.gifts.push(res.data.data.slice(index,i));
                        // })
                        index=i;
                    }
          
                    if(giftNum%3!==0 && i === giftNum){//i === (giftNum-1)判断是不是遍历到最后一个了   
                        let appendNum = 3-giftNum%3;
                        let lastArray = res.data.data.slice(index);

                        for(let j=0;j<appendNum;j++){
                            lastArray.push({show:'visibility:hidden'})
                        }
                        this.$nextTick(()=>{
                            this.gifts.push(lastArray); 
                        })
                    }
                } 
                this.gifts = [...this.gifts]//防止没有渲染
            })
        }
    },
    onShareAppMessage(res) {
        //转发时携带 shareTicket才能在回调中获取到shareTickets
        wx.showShareMenu({
            withShareTicket: true
        }) 
    },
    onShow(){
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1]; //当前页
        if(currPage.flag === 1){
            let data = {
                token:wx.getStorageSync('token'),
                id:this.lotteryResult.id
            }
            wxRequest('/miniProgram/api/trophy/user/str',{data:data}).then(res => { //当用户点击去修改个人信息时能够重新获取到中奖信息
                this.lottery_success_str = res.data.str;
            })
        }else{
            this.closeModel();  
        }
        this.getLotteryNum();
        this.getNotice();
        this.getGifts();
    },
}
</script>

<style>
page{
    background: #FFD637;
}
.page-top{
    position: relative;
    height: 118.73vw;
    background-image: url('https://level8cases.oss-cn-hangzhou.aliyuncs.com/3208fdf7-3ac4-4c01-89c9-33f008a72645.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    padding-top: 20px;
}

.header{
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    width: 90vw;
    margin: 0 auto;
}
.header-btn{
    background: rgba(000, 000, 000, 0.2);
    color: #fff;
    font-size: 12px;
    padding: 4px 12px;
    border-radius: 16px;
    display: flex;
    align-items: center;
}
.face-right{
    width: 10px;
    height: 19px;
    margin: 1px 0 0 2px;
}
.lottery-num{
    text-align: center;
    margin-top: 30vw;
    color: #333;
    font-size: 12px;
}
.machine{
    position: absolute;
    bottom: 0;
    height: 61.325vw;
    width: 100vw;
    background-repeat:no-repeat;
    background-size:100% 100%;
}

.machine-img{
    position: relative;
    z-index: 5;
    width: 100%;
    height: 100%;
}
.trunk{
    position: absolute;
    z-index: 2;
    top: 13vw;
    left: 8vw;
    width: 35vw;
    height: 20.9vw;
}
.left50{
    transition: all 3s linear;
    left: 50vw;
}
.scree-animation{
    position: absolute;
    z-index: 10;
    width: 38.55vw;
    height: 23.6vw;
    right: 13.8vw;
    top: 10.5vw;
}
.lights{
    position: absolute;
    top: -4.8vw;
    right: 31.5vw;
}
.line-red{
    position: absolute;
    background: #ef4343;
    height: 3.5vw;
    width: 0.8vw;
    border-radius: 12px;
}
.rotate45{
    transform: rotate(50deg);
    transform-origin: 0 6vw;
    top: -0.15vw;
    right: -2vw;
}
.rotate315{
    transform: rotate(310deg);
    transform-origin:0 6vw;
    left: -0.9vw;
    top: 0.5vw;
}
.footer-color{
    position: absolute;
    bottom: -0.5vw;
    background: rgb(255, 180, 12);
    height: 4vw;
    width: 100vw;
    z-index: 2;
}
.page-bottom{
    padding-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;

}
.lottery{
    position: relative;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 52vw;
    height: 10vw;
    line-height: 9vw;
    text-align: center;
    font-size: 16px;
    color: #fff;
    z-index: 2;
}
.lottery-btn{
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}
.lottery-btn-text{
    position:relative;
    z-index:5;
}
.model-shadow{
    position: fixed;
    top: 0;
    z-index: 8;
    width: 100vw;
    height: 100vh;
    background: rgba(000, 000, 000, 0.5)
}
.model-show{
    position: fixed;
    background: #fff;
    width: 70vw;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    padding: 30px 20px 20px 20px;
    text-align: center;
    z-index: 10;
    border-radius: 12px;
    box-sizing: border-box;
}
.model-img{
    width: 70px;
    height: 70px;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
}
.model-img img{
    width: 100%;
    height: 100%;
}
.model-btn{
    width: 110px;
    height: 30px;
    line-height: 30px;
    margin: 0 auto;
    border-radius: 20px;
    background: #FFD637;
    font-size: 14px;
    text-align: center;
}
.close-icon{
    position: fixed;
    z-index: 10;
    top: 8px;
    right: 8px;
    height: 20px;
    width: 20px;
}
.text-left{
    text-align: left;
}
.font10{
    font-size: 10px;
}
.font14{
    font-size: 14px;
}
.font12{
    font-size: 12px;
}
.fontBold{
    font-weight: bold;
}
.marginTop4{
    margin-top: 4px;
}
.marginTop10{
    margin-top: 10px;
}
.color999{
    color: #999;
}
.colorFFF{
    color: #fff;
}
.notice{
    background: url('https://level8cases.oss-cn-hangzhou.aliyuncs.com/9554e5ae-a17d-4caa-9cbe-cc4f3ee7073a.png');
    background-size: cover;
    width: 81.3vw;
    height: 5.91vw;
    margin: 10px auto;
    display: flex;
}
.gift-icon{
    width: 5.91vw;
    height: 5.91vw;
    margin-right: 5px;
}
.lottery-swiper{
    width: calc(100% - 6.5vw);
    height: 5.91vw;
    color: #333;
    font-size: 12px;
}
.lottery-swiper swiper-item{
    line-height: 5.91vw;
    overflow: hidden;/*超出部分隐藏*/
    white-space: nowrap;/*不换行*/
    text-overflow:ellipsis;/*超出部分文字以...显示*/
}
.showGiftTitle{
    background: url('https://level8cases.oss-cn-hangzhou.aliyuncs.com/2b3ff66a-6ae2-4c66-ad5f-634ad5544d5b.png');
    background-size: cover;
    width:30vw;
    height: 8.7566vw;
    margin:20px auto;
    position: relative;
}
.showGiftTitle .text{
    position: absolute;
    left: 50%;
    top: 11%;
    transform: translate(-50%,0);
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    width: 100%;
    letter-spacing: 1px;
    text-align: center;
}
.show-gift{
    position: relative;
    width: 90vw;
    height: 25vw;
    margin: 0 auto;
}
.show-gift .left-btn{
    position: absolute;
    top: calc((90vw - 50px) * 0.155);
    transform: translate(0,-50%);
    left: 0;
    width: 12px;
}
.show-gift .right-btn{
    position: absolute;
    top: calc((90vw - 50px) * 0.155) ;
    transform: translate(0,-50%) rotate(180deg);
    width: 12px;
    right: 0;

}
.show-swiper{
    height: calc((90vw - 50px) * 0.31 + 65px);
    width: calc(100% - 50px);
    margin: 4px auto 30px;
}
.show-swiper swiper-item{
    display: flex;
    justify-content: space-between;
}
.gift-item{
    width: 31%;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
}
.gift-img{
    width: 100%;
    height:calc((90vw - 50px) * 0.31);
    background: #fff;
    border: 1px solid #333;
    border-radius: 12px;
    overflow: hidden;
    box-sizing: border-box;
}

</style>