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
            <div class="integral-content">
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
                        <!-- <div v-if="!item.sign&&key==='6'" class="no-sign">
                            <div class="gift-img">
                                <img src="/static/images/gift.png"/>
                            </div>
                        </div> -->
                        <div class="sign-text" :class="{'sign-color333':item.sign}">
                            {{item.text}}
                        </div>
                    </div>
                </div>
                <!--  -->
                <div class="sign-info">
                    您已累积签到<text class="colorRed">{{totalTime}}</text>天，共获得<text class="colorRed">{{totalIntegral}}</text>出发币
                </div>
                <!--  -->
                <div :class="{'sign-btn':!todaySign,'after-sign-btn':todaySign}" @click="goSign">
                    {{signBtnText}}
                </div>
            </div>
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
                    <div class="get-btn" @click="goPage(item)" v-if="!item.success&&key!==3">
                        去完成
                    </div>
                    <!--  -->
                    <div class="after-get-btn"  v-if="item.success">
                        已完成
                    </div>
                    <button class="get-btn" style="padding:0px" open-type='share' v-if="!item.success&&key===3">
                        去完成
                    </button>
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
  </div>
</template>

<script>
import {wxRequest,getToken,wxuuid} from '@/components/common'
import card from '@/components/card'
export default {
    data(){
        return{
            errorOfficial:false,
            integralNum:0,
            showMsg:false,
            msgText:'',
            isGetIntegral:true,
            getItems:[
                {imgUrl:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/dd853042-3acd-4a8b-b5bf-4008d4abb3a6.png',title:'完善个人信息',text:'完善个人信息获得50个出发币',success:false,url:'/pages/myinfo/main'},
                {imgUrl:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/00990e96-6e9d-4426-a11e-b2f26b52b572.png',title:'问卷调查',text:'填写问卷调查获得50个出发币',success:false,url:'/pages/comingsoon/main'},
                {imgUrl:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/f1937e1f-699f-4476-96a7-5f14ce30f5bc.png',title:'分享独家精选内容 ',text:'分享精选获得10个出发币',success:false,url:'/pages/newmsg/main?type=1'},
                {imgUrl:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/组33-07b3d815-f9a4-4ced-82fe-223bfad3d501.png',title:'邀请好友',text:'每邀请一位好友成为地平线8号注册会员，双方各得100出发币',success:false,url:''},
                {imgUrl:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/edd4ee55-3cd2-4482-9a12-57996284bacf.png',title:'关注公众号',text:'关注公众号获得200个出发币',success:false,url:''},
            ],
            putItems:[
                {imgUrl:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/6d9f5eb5-1876-479c-ae0d-c264e5d51349.png',title:'收纳包4件套',text:'4000',success:false},
                {imgUrl:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/508ad01e-0f25-4c56-a955-5b12b8b40f49.png',title:'电脑包',text:'3000',success:false},
                {imgUrl:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/a4fafc69-2372-4ba2-bc83-439ca61c215b.png',title:'20寸PC箱（粉）',text:'10000',success:false},
                {imgUrl:'https://level8cases.oss-cn-hangzhou.aliyuncs.com/cc25b5f1-928a-4b44-af14-cf3943123661.png',title:'20寸铝箱',text:'30000',success:false},
                ],
            signItem:[{text:'1天',ani:null,sign:true,signTo:false},
                        {text:'2天',ani:null,sign:false,signTo:false},
                        {text:'3天',ani:null,sign:false,signTo:false},
                        {text:'4天',ani:null,sign:false,signTo:false},
                        {text:'5天',ani:null,sign:false,signTo:false},
                        {text:'6天',ani:null,sign:false,signTo:false},
                        {text:'7天',ani:null,sign:false,signTo:false}],
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
            confirmBtn:false
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
        hideMsg(){
            this.showMsg = false;
            setTimeout(() => {
                this.isSign = false;//判断是不是签到的弹窗 是的话文字要居中
            },1000)

        },
        tabHeader(index){
            if(index === 1)
                this.isGetIntegral = true;
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
                        console.log(this.trophyType)
                        this.msgText = res.data.str;
                        this.showMsg = true;
                        this.msgType = res.data.type;
                    }else if(res.data.status === 10016 || res.data.status === 10017){
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
            let that = this;
            this.trophyType = -1;
            wxRequest('/miniProgram/api/sign',{data:{token:wx.getStorageSync('token')}}).then(res => {
                this.isSign = true;//判断是不是签到的弹窗 是的话文字要居中

                if(res.data.status === 0){
                    this.showMsg = true;
                    this.msgText = '签到成功！';
                    let signInfo = JSON.parse(res.data.data);
                    let signInfo2 = JSON.parse(res.data.data2);
                    this.todaySign = signInfo.todaySign;
                    this.signItem = signInfo.signRecord;
                    this.signItem[this.index].signTo = true;//根据signTo实现动画效果
                    getApp().globalData.integralNum = signInfo2.userTotalIntegral;
                    this.integralNum = signInfo2.userTotalIntegral;
                    this.totalTime = signInfo2.totalTime;
                    this.totalIntegral = signInfo2.totalIntegral;
                    for(let key=0;key<7;key++){
                        this.signItem[key].text = `${key+1}天`;
                        this.signItem[key].signTo = false;//根据signTo实现动画效果，动画完后signTo重新为false
                    }
                    setTimeout(function(){
                        that.signItem[that.index].sign = true; //因为动画效果有0.5s，所以改变每一个签到状态的图标需要延迟0.5s
                    },500)
                }else if(res.data.status === 10013){
                    this.showMsg = true;
                    this.msgText = '已签到，请勿重复签到！';
                }else{
                    this.showMsg = true;
                    this.msgText = '签到失败，请稍后再试！';
                }
            })

        },
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
                this.getItems[0].success = res.data.data.userInfo;
                this.getItems[1].success = res.data.data.questionnaire;
                this.getItems[2].success = res.data.data.article;
                this.getItems[4].success = res.data.data.followWeChat;
                // getItems[3]直接写死 没有获取状态
            })
            // 获取兑换物品的列表
            wxRequest('/miniProgram/api/trophy/exchangeGoodsList',{data:{token:wx.getStorageSync('token')}}).then(res => {
               console.log('list',res)
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
                                        console.log('jf',res)
                                        that.integralNum = res.data.data.integralNum;
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
    
    onShareAppMessage(res) {
        //转发时携带 shareTicket才能在回调中获取到shareTickets
        wx.showShareMenu({
            withShareTicket: true
        })
        let code =wxuuid()
        let data = {
            token:wx.getStorageSync('token'),
            code
        }

        wxRequest('/miniProgram/api/user/sendInvitation',{data:data}).then(res => {
            
        }) 
        return {
            title:"一起来L8吧！！！",
            path: "/pages/index/main?code="+code,// 路径，传递参数到指定页面。
            desc:"一起和我了解L8，获取100出发币~",
            imageUrl:"https://level8cases.oss-cn-hangzhou.aliyuncs.com/f5af3c3d-6d45-4feb-ab19-65a144110eb0.png"
        }
    },
    onLoad(){
        this.trophyType = -1;
        this.isGetIntegral = true;
        wxRequest('/miniProgram/api/sign/list',{data:{token:wx.getStorageSync('token')}}).then(res => {
            console.log(res)
            let signInfo = JSON.parse(res.data.data);
            let signInfo2 = JSON.parse(res.data.data2);
            this.totalTime = signInfo2.totalTime;
            this.totalIntegral = signInfo2.totalIntegral;
            this.todaySign = signInfo.todaySign;
            this.signItem = signInfo.signRecord;

            for(let key=0;key<7;key++){
                this.signItem[key].text = `${key+1}天`;
                this.signItem[key].signTo = false;
            }
            for(let key=0;key<7;key++){
                if(this.signItem[key].sign == false){
                    this.index = key;
                }
            }
        })
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
</style>