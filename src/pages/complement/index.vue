<template>
  <div>
      <div class="page-top">
          <img src="../../../static/images/bg_img.png" mode='widthFix'/>
      </div>
      <div class="content">
        <div class="integral-header">
                <!-- 出发币赚取 -->
                <div class="get-integral" @click="tabHeader(1)">
                    <div class="integral-img">
                        <img v-if="isGetIntegral" src="/static/images/manage.png"/>
                        <img v-if="!isGetIntegral" src="/static/images/manage2.png"/>
                    </div>
                    <div :class="{'nos_integral-title':!isGetIntegral}">
                        补码申请
                    </div>
                </div>
                <!-- 出发币兑换 -->
                <div class="put-integral"  @click="tabHeader(2)">
                    <div class="integral-img">
                        <img v-if="isGetIntegral" src="/static/images/log2.png"/>
                        <img v-if="!isGetIntegral" src="/static/images/log.png" />
                    </div>
                    <div :class="{'nos_integral-title':isGetIntegral}">
                        补码记录
                    </div>
                </div>
        </div>
        <!-- 申请 -->
        <div v-if="isGetIntegral">
            <div class="apply" >
                <div class="input-item">
                    <div class="input-title">店铺名称</div>
                    <div class="sel-input" style="position:relative" :class="{'borderr0':selShop}" @click="selShopM(1)">
                        <input v-model="shop" disabled/>
                        <div class="right-icon"  :class="{'tran90':selShop}">
                            <img src="../../../static/images/face-right.png" mode='widthFix'/>
                        </div>
                        <div class="sel-modal" v-if="selShop" >
                            <div style="height:6px;position:fixed;top:0"></div>
                            <div v-for="(item,key) in options" :key="key" @click="choosePosition(item)">{{item}}</div>
                        </div>
                    </div>
                </div>
                <div class="input-item">
                    <div class="input-title">产品信息</div>
                    <div class="sel-input" style="position:relative" :class="{'borderr0':selProduct}" @click="selShopM(2)">
                        <input v-model="info" disabled/>
                        <div class="right-icon" :class="{'tran90':selProduct}">
                            <img src="../../../static/images/face-right.png" mode='widthFix'/>
                        </div>
                        <div class="sel-modal" v-if="selProduct" >
                            <div style="height:6px;position:fixed;top:0"></div>
                            <div v-for="(item,key) in options" :key="key" @click="choosePosition(item)">{{item.goodsName}}</div>
                        </div>
                    </div>
                </div>
                <div class="upload-item" v-if="info!==''">
                    <div class="input-title">产品图片</div>
                    <div class="upload">
                        
                        <img style="width:80px" :src="imgKey" mode='widthFix'/>
                        
                    </div>
                </div>
                <div class="input-item">
                    <div class="input-title">下单时间</div>
                    <div class="sel-input" @click="selShopM(3)">
                        <input v-model="date" disabled/>
                        <div class="right-icon">
                            <img src="../../../static/images/date.png" mode='widthFix'/>
                        </div>
                    </div>
                </div>
                <div class="input-item">
                    <div class="input-title">平台订单号</div>
                    <div class="sel-input" >
                        <input v-model="number" type="number" style="width:100%"/> 
                    </div>
                </div>
                <div class="upload-item">
                    <div class="input-title">订单截图</div>
                    <div class="upload">
                        <div v-if="uploadImgUrl===''" class="upload-border" @click="uploadImg">
                            <img style="width:30px" src="../../../static/images/add.png" mode='widthFix'/>
                        </div>
                        <img @click="prevImg" v-if="uploadImgUrl!==''" style="width:90px;height:90px" :src="uploadImgUrl"/>
                        <div style="margin-top:4px">上传照片</div>
                        <div style="margin-top:4px">只支持.jpg格式</div>
                        <div class="close-img" v-if="uploadImgUrl!==''" @click="delImg">
                            <img src="../../../static/images/error.png" mode='widthFix'/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="answer" @click="goPage">
                <img style="width:14px;margin-right:6px;" src="../../../static/images/question.png" mode='widthFix'/>
                <span>了解详情</span>
            </div>
            <!-- 按钮 -->
            <div class='btn' @click="showMsgM">
                提交
            </div>
        </div>

        <!-- 记录 -->
        <div class="records" v-if="!isGetIntegral&&products.length!==0" >
            <div class="record"  v-for="(item,key) in products" :key="key">
                <div style="display: flex;justify-content: space-between;align-items: center;"  @click="openCodeM(item)">
                    <div class="record-img">
                        <img :src="item.productImg" mode='widthFix'/>
                    </div>
                    <div class="record-content">
                        <div class="content-left">
                            <div class="content-title">{{item.productInfo}}</div>
                            <div>状态：<span :class="{'passColor':item.status===2,'refuseColor':item.status===1,'readingColor':item.status===0}" >{{status[item.status]}}</span></div>
                            <div>提交时间：{{item.createTime}}</div>
                        </div>
                        <div style="width:20px" :class="{'openIcon':item.open}">
                            <img   src="../../../static/images/face-right.png" mode='widthFix'/>
                        </div>
                    </div>
                </div>
                <div class='openCode' v-if="item.open">
                    <div v-if="item.status === 2">
                        <img style="width:50%" @touchstart='timeStar' @touchend='timeEnd' @click="saveImg(item.qrCodeImg)" :src="item.qrCodeImg" mode='widthFix'/>
                        <div>长按或单击二维码可下载</div>
                        <div style="display:flex;align-items:center;color:#40c443;margin-top:16px">
                            <img style="width:16px;margin-right:6px" src="../../../static/images/pass_icon.png" mode='widthFix'/>
                            <span>审核通过</span>
                        </div>  
                    </div>
                    <div v-if="item.status === 0" style='padding:20px 0;'>
                        <img style="width:20%" src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/5604bf1d-024b-4285-b9ce-7a65e108daa7.png" mode='widthFix'/>
                        <div>您的申请正在审核中，请耐心等候。</div>
                    </div>
                    <div v-if="item.status === 1" style='padding:20px 0;'>
                        <div>{{item.remark}}</div>
                        <div style="display:flex;align-items:center;color:red;margin-top:30px">
                            <img style="width:16px;margin-right:6px" src="../../../static/images/error.png" mode='widthFix'/>
                            <span>审核未通过</span>
                        </div>  
                    </div>
                </div>
            </div>
        </div>
        <!-- 无申请记录 -->
        <div style="margin-top:20px;border-radius:12px;height:350px;background:#fff;color:#999;font-size:12px;" class="no-product" v-if="!isGetIntegral&&products.length===0">
            <img style="width:30%;margin-bottom:10px" src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/9736c78e-9aaa-422c-a3fc-826345e638dd.png" mode='widthFix'/>
            <div>当前无补码记录，请申请补码</div>
        </div>
      </div>
    <van-popup :show="showMsg" custom-class="popup-class3" >
        <div class="modal3">
            <div class='reg-text3'>
                <span>确认提交补码？</span>
            </div>

        <div class="modal-btns">
            <div class="moadal-btn border-r" style="color:#999" @click="hideMsg">取消</div>
            <div class="moadal-btn" @click="reportInfo">确定</div>
        </div>
        </div>
    </van-popup>
     <!-- 选择日期的弹出框 -->
      <van-popup :show="showDate" position="bottom" close-on-click-overlay="true" @close="closeDate" >
        <van-datetime-picker :value="nowDate" type="date" :min-date='minDate' @confirm="onInput" @cancel="closeDate"/>
      </van-popup>
  </div>
</template>

<script>
import global from '@/components/global'
import {timeFormat,timeFormat1,wxRequest} from '@/components/common';
export default {
    data() {
        return {
            products:[], 
            uploadImgUrl:'',
            status:['审核中','已拒绝','已审核'],
            nowDate:new Date().getTime(),
            minDate:-631180800000,
            showDate:false,
            selShop:false,
            isGetIntegral:true,
            options:['地平线8号京东自营旗舰店','地平线8号天猫旗舰店','地平线8号官方商城（小程序/H5/网页）','其他渠道'],
            shop:'',
            info:'',
            date:'',
            number:'',
            type:1,
            timestar:0,
            timeend:0,
            selProducts:null,
            selProduct:false,
            imgKey:null,
            orderImg:'',
            showMsg:false
        }
    },
    methods: {
        goPage(){
            wx.navigateTo({
                url:'/pages/complementRule/main'
            })
        },
        timeStar(e){
           this.timestar =  e.timeStamp;
        },
        timeEnd(e){
           this.timeend =  e.timeStamp;

        },
        
        saveImg(url){
            let time = this.timeend - this.timestar;
            if(time > 300){
                wx.downloadFile({//下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
                    url: url,
                    success: function (res) {
                        console.log(res)
                        // 下载成功后再保存到本地
                        wx.saveImageToPhotosAlbum({
                            filePath: res.tempFilePath,//返回的临时文件路径，下载后的文件会存储到一个临时文件
                            success: function (res) {
                                console.log(111,res)
                            wx.showToast({
                                title: '成功保存到相册',
                                icon: 'success'
                            })
                            },
                            fail(err){
                                console.log('err',err)
                            }
                        })
                    },
                    fail(err){
                        console.log('err2',err)

                    }
                })
            }else{
            wx.previewImage({
                //当前显示图片
                urls: [url]
            })
            }
        },
        tabHeader(index){
            if(index === 1)
                this.isGetIntegral = true;
            else{
                this.isGetIntegral = false;
            }
        },
        selShopM(index){
            if(index === 1){
                this.type = 1;
                this.options = ['地平线8号京东自营旗舰店','地平线8号天猫旗舰店','地平线8号官方商城（小程序/H5/网页）','其他渠道'];
                this.selShop === true ? this.selShop = false : this.selShop = true;
                this.selProduct = false;
            }else if(index === 2){
                this.type = 2;
                this.options = this.selProducts;
                this.selProduct === true ? this.selProduct = false : this.selProduct = true;
                this.selShop = false;
                // this.options = ['钻纹20寸-黑色','钻纹20寸-银色']; 
            }else{
                this.showDate = true;
            }
        },
        choosePosition(item){
            if(this.type === 1){
                this.shop = item;
            }else{
                this.imgKey = item.goodsImg;
                this.info = item.goodsName;
            }
        },

        closeDate(){
            this.showDate = false;
        },
        // 选择日期后的事件  
        onInput(event) {
            this.date = timeFormat(event.mp.detail.toString());
            this.showDate = false; 
        },
        uploadImg(){
            let that = this;
            wx.chooseImage({
                count: 1, // 默认9 
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    that.uploadImgUrl = res.tempFilePaths[0]; 
                    wx.uploadFile({
                        url: global.ip1+'file/weixin/upload', 
                        filePath: res.tempFilePaths[0], 
                        name: 'file',
                        formData:{
                            'token':wx.getStorageSync('token')
                        },
                        header: {
                        'Content-Type': 'multipart/form-data' // 默认值
                        },
                        success (res1){
                            
                            console.log(JSON.parse(res1.data).url)
                            that.orderImg = JSON.parse(res1.data).url;
                        },
                        fail(err){
                            console.log(err)
                        }
                    })
  
                }
            })
        },
        delImg(){
            this.uploadImgUrl = '';
        },
        prevImg(){
            wx.previewImage({
                //当前显示图片
                urls: [this.uploadImgUrl]
            })
        },

        openCodeM(item){
            item.open === false ? item.open = true : item.open = false;

        },
        hideMsg(){
            this.showMsg = false;
        },
        showMsgM(){
            if(this.shop === '' || this.info === '' || this.imgKey === '' || this.date === '' || this.number === '' || this.orderImg === ''){
                wx.showToast({
                    title:'请填写完整',
                    icon:'none',
                    duration: 2000
                })
           }else{
               this.showMsg = true;
           }
        },
        reportInfo(){
            wx.showLoading({
                title: '提交中',
            })
            let data = {
                token:wx.getStorageSync('token'),
                storeName: this.shop,
                productInfo: this.info,
                productImg: this.imgKey,
                orderTime: this.date,
                platformOrderNo: this.number,
                orderImg: this.orderImg
                
            }
   
            wxRequest('/miniProgram/api/qrCodePatch/info/save',{data}).then(res => {
                wx.hideLoading();

                if(res.data.status === 10010){
                    if(res.data.msg === '入参缺失'){
                        res.data.msg = '请填写完整';
                    }
                    wx.showToast({
                        title:res.data.msg,
                        icon:'none',
                        duration: 2000
                    })
                }else if(res.data.status === 200){
                    wx.showToast({
                        title:'提交成功',
                        icon:'success',
                        duration: 2000
                    })
                    this.getList();
                    this.showMsg = false;
                    this.isGetIntegral = false;
                }
            })
           

        },
        getList(){
            wxRequest('/miniProgram/api/qrCodePatch/info/simple',{data:{token:wx.getStorageSync('token')}}).then(res => {
                res.data.data.map(item => {
                    item.open = false;
                    return item.createTime = timeFormat1(item.createTime,0);
                })
                console.log(132,res)
                this.products = res.data.data;
            })
        }

    },
    mounted() {
        this.shop = '';
        this.info = '';
        this.imgKey = '';
        this.number = '';
        this.date = '';
        this.orderImg = '';

        let data = {
            token:wx.getStorageSync('token')
        }

        wxRequest('/miniProgram/api/qrCodePatch/info/product',{data}).then(res => {
            this.selProducts = res.data.data;
        })
        this.getList();

    },
}
</script>

<style>
@import url('../../components/common.css');
page{
    background: #efeff4; 
}
.page-top{
    width: 100vw;
    
}
.tran90{
    transform: rotate(90deg);
}
.openIcon{
    transform:rotate(90deg);
}
.passColor{
    color: #40c443;
}
.refuseColor{
    color: red;
}
.readingColor{
    color: #FFD637;
}
.content{
    width: 90vw;
    margin:0 auto;
    margin-top: -35vw;
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
    height: 20px;
    width: 20px;
    margin-right: 10px;
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
.nos_integral-title{
    color: #999 !important;
}
.apply{
    background: #fff;
    margin-top: 20px;
    border-radius: 12px;
    padding: 12px 20px;
}
.input-item{
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}
.input-item input{
    font-size: 14px;
}
.input-title{
    width: 100px;
    font-size: 15px;
    color: #000;
    font-weight: bold;
}
.sel-input{
    width: calc(100% - 100px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #ddd;
    border-radius: 26px;
    padding: 4px 10px 4px 12px;
}
.right-icon{
    width: 16px;
}
.position-panel{
  background: #fff;
}
.option-item{
  text-align: center;
  height: 40px;
  line-height: 40px;
  /* border-bottom: 1px solid #efeff4; */
  font-size: 16px;
}
.upload{
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    color: #bbb;
    position: relative;
}
.upload-border{
    padding: 30px;
    border: 1px dashed #ddd;
    border-radius: 12px;
}
.upload-item{
    display: flex;
    margin-bottom: 16px; 
}
.records{
    margin-top: 20px;
}
.record{
    background: #fff;
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 12px;
}
.record-img{
    width: 80px;
    border-radius: 6px;
    overflow: hidden;
}
.record-content{
    width: calc(100% - 90px);
    
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.content-left{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 12px;
    color: #bbb;
    height: 65px;
    width: calc(100% - 26px);
}
.content-title{
    font-size: 14px;
    font-weight: bold;
    color: #000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.openCode{
    margin-top: 10px;
    padding: 50px 0 30px;
    border-top: 1px solid #ededed;
    font-size: 14px;
}
.openCode>div{
    
    display: flex;
    flex-direction: column;
    align-items: center;
    
    color: #999;
}
.openCode>div>div{
    margin-top: 6px;
}
.no-product{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.btn{
    border-radius: 36px;
    background: #FFD637;
    height: 40px;
    line-height: 40px;
    text-align: center;
    width: 90%;
    margin: 100px auto 50px;
}
.answer{
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-size: 12px;
    color: #888;
    padding-left: 10px;
}
.close-img{
    position: absolute;
    top: -8px;
    right: -8px;
    width: 16px;
    z-index: 2;
}
.sel-modal{
    position: absolute;
    bottom: 0;
    background: #fff;
    z-index: 10;
    left: -1px;
    right: -1px;
    border: 1px solid #ddd;
    border-top: 0;
    transform: translate(0,100%);
    font-size: 13px;
    color: #666;
    max-height: 180px;
    overflow: scroll;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
}
.borderr0{
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}
.sel-modal>div{
    height: 20px;
    padding: 6px 12px;
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow: hidden;
}
.popup-class3{
    border-radius: 10px;
}
.reg-text3{
    padding: 20px 30px;
}

.reg-button{
    color: #FFD637;
    height: 46px;
    line-height: 46px;
    text-align: center;
    border-top: 1px solid #cecece;
}
.modal3{
    width: 270px;
    text-align: center;
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
</style>