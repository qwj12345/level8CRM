<template>
  <div>
    <card hasAgree='true' :integral="integralNum"></card>
    <!-- 有绑定产品时 -->
    <div class="product-list" v-if="products.length !== 0">
        <div v-for="(item,key) in products" :key="key" class="product-item" :class="{'padb':!item.open}">
            <div class="flex-row" :class="{'border-bottom':item.open}"  @click="openDetail(key)">
                <div class="product-info"> 
                    <!--  -->
                    <div class="product-img">
                        <img :src="item.goodsImg"/>
                    </div>
                    <!--  -->
                    <div class="product-text">
                        <div class="product-title">
                            {{item.encode}} 
                            <img v-if="item.goodsType === 2" :src="item.iconImg" mode="widthFix"/>
                        </div>
                        <div class="product-status">
                            状态：{{item.statusName}}
                        </div>
                        <div class="product-time">
                            购买时间：{{item.goodsAddTime}}
                        </div>
                    </div>
                </div>
                <div class="face-right" :class="{'face-bottom':item.open}">
                    <img src="/static/images/face-right.png"/>
                </div>
            </div>
            
            <!--  -->
            <div class="product-option" v-if="item.open">
                <div v-if="item.statusName==='正常' || item.statusName==='拾到'" class="option-item" @click="clickGS(item)">
                    <div class="option-img">
                        <img src="/static/images/gs.png"/>
                    </div>
                    <div class="option-text">
                        挂失登记
                    </div>
                </div>
                <div v-if="item.statusName!=='正常' && item.statusName!=='拾到'" class="option-item" @click="clickGS2(item)">
                    <div class="option-img">
                        <img src="/static/images/yxh.png"/>
                    </div>
                    <div class="option-text colorR">
                        已寻回登记
                    </div>
                </div>
                <div class="option-item" v-if="false" >
                    <div class="option-img">
                        <img src="/static/images/gs.png"/>
                    </div>
                    <div class="option-text">
                        挂失中
                    </div>
                </div>
                <div class="option-item" @click="goWarranty">
                    <div class="option-img">
                        <img src="/static/images/zsbx.png"/>
                    </div>
                    <div class="option-text">
                        终身保修
                    </div>
                </div>
                <div class="option-item" @click="goRepair(item)">
                    <div class="option-img">
                        <img src="/static/images/bx.png"/>
                    </div>
                    <div class="option-text">
                        <span v-if="item.repairsType===5">报修登记</span>
                        <span v-if="item.repairsType===3" class="colorFF7">待收货</span>
                        <span v-if="item.repairsType===0" class="colorFF7">上报中</span>
                        <span v-if="item.repairsType!==0 && item.repairsType!==5 && item.repairsType!==3" class="colorR">维修中</span>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <!-- 没有绑定产品时 -->
    <div v-if="products.length === 0" class="no-product">
        <img class="no-product-img" mode="widthFix" src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/797063ef-3689-42d9-afb3-ecc89daf61f4.png"/>
        <div class="no-product-text">
            哎呀，您还没绑定产品~
        </div>
        <div class="no-product-btn" @click="goReport">
            前往绑定
        </div>
    </div>
    <!-- 挂失产品后的弹出框 -->
    <van-popup :show="showGS" custom-class="popup-class3" @close="onClose">
        <div class="modal3">
            <div class="reg-text3">
                当您确认挂失时，表示同意我们将您的信息发送给拾到者，以便联系！
            </div>
            <!-- <div class="reg-button" @click="hideGS">
                确定
            </div> -->
            <div class="moadal-btns">
                <div class="moadal-btn border-r" @click="onClose">取消</div>
                <div class="moadal-btn" @click="hideGS">确定</div>
            </div>
        </div>
    </van-popup>
    <!-- 取消挂失产品后的弹出框 -->
    <van-popup :show="showGS2" custom-class="popup-class3" @close="onClose2">
        <div class="modal3">
            <div class="reg-text3">
               您已找到失物？将取消挂失该产品
            </div>
            <div class="moadal-btns">
                <div class="moadal-btn border-r" @click="onClose2">取消</div>
                <div class="moadal-btn" @click="hideGS2">确定</div>
            </div>
        </div>
    </van-popup>
    <!-- 挂失失败产品后的弹出框 -->
    <van-popup :show="showGS3" custom-class="popup-class3" @close="onClose3">
        <div class="modal3">
            <div class="reg-text3">
               挂失失败，如未填写个人信息请先填写！
            </div>
            <div class="reg-button" @click="hideGS3">
                确定
            </div>
        </div>
    </van-popup>
    <!-- 取消上报维修的弹出框 -->
    <van-popup :show="showGS4" custom-class="popup-class3" @close="onClose4">
        <div class="modal3">
            <div class="reg-text3">
               您确定取消上报维修吗？
            </div>
            <div class="moadal-btns">
                <div class="moadal-btn border-r" @click="onClose4">取消</div>
                <div class="moadal-btn" @click="hideGS4">确定</div>
            </div>
            <!-- <div class="reg-button" @click="hideGS4">
                确定
            </div> -->
        </div>
    </van-popup>
  </div>
</template>


<script>
import card from '@/components/card'
import {wxRequest} from '@/components/common'

export default {
    data(){
        return{
            integralNum:0,
            products:[],
            showGS:false,
            showGS2:false,
            showGS3:false,
            showGS4:false,
            productCode:'',
            productId:'',
            page:0,
            size:10,
            totalPage:0
        }
    },
    components:{
        card
    },
    methods: {
        openDetail(key){
            this.products[key].open === true ? this.products[key].open = false : this.products[key].open = true;
        },
        clickGS(item){
            this.showGS = true;
            this.productCode = item.encode; 
        },
        clickGS2(item){
            this.showGS2 = true;
            this.productCode = item.encode; 
        },
        onClose(){
            this.showGS = false;
        },
        onClose2(){
            this.showGS2 = false;
        },
        onClose3(){
            this.showGS3 = false;
        },
        onClose4(){
            this.showGS4 = false;
        },
        
        hideGS(){
            let data = {
                token:wx.getStorageSync('token'),
                goodsCode:this.productCode,
            }
            wxRequest('/miniProgram/api/goods/verlustanzeige',{data:data}).then(res => {
                if(res.data.status === 0){
                    wx.showToast({
                        title: '挂失成功',
                        icon: 'success',
                        duration: 1000
                    })
                    this.products = [];
                    this.page = 0;
                    this.getProducts();
                    this.showGS = false;
                }else{
                   this.showGS3 = true;
                }
                
            })
        },
        hideGS2(){
            let data = {
                token:wx.getStorageSync('token'),
                goodsCode:this.productCode,
            }
            wxRequest('/miniProgram/api/goods/restore/status',{data:data}).then(res => {
                if(res.data.status === 0){
                    wx.showToast({
                        title: '取消成功',
                        icon: 'success',
                        duration: 1000
                    })
                    this.products = [];
                    this.page = 0;
                    this.getProducts();  //改变一个产品状态后重新获取下产品列表   
                    this.showGS2 = false;
                }else{
                    wx.showToast({
                        title: '取消失败',
                        image: '/static/images/errorToast.png',
                        duration: 1000
                    })
                }
            })
        },
        hideGS3(){
            this.showGS3 = false;
        },
        hideGS4(){
            let data = {
                token:wx.getStorageSync('token'),
                id:this.productId,
            }
            wxRequest('/miniProgram/api/repairs/del',{data:data}).then(res => {
                if(res.data.status === 0){
                    wx.showToast({
                        title: '取消成功',
                        icon: 'success',
                        duration: 1000
                    })
                    this.products = [];
                    this.page = 0;
                    this.getProducts();  //改变一个产品状态后重新获取下产品列表
                    this.showGS4 = false;
                }else{
                    wx.showToast({
                        title: '取消失败',
                        image: '/static/images/errorToast.png',
                        duration: 1000
                    })
                }
            })
        },
        // 获取产品列表
        getProducts(){
            wx.showLoading({
                title:'加载中'
            })
            let data = {
                token:wx.getStorageSync('token'),
                page:this.page,
                size:this.size
            }
            wxRequest('/miniProgram/api/goods/list',{data:data}).then(res => {
                console.log(res)
                let products = this.products.concat(res.data.data);
                this.totalPage = Math.ceil(res.data.total/this.size);
                console.log(this.totalPage)
                products.forEach(item => {
                    item.open = false;  //设置产品为未打开的样子
                })
                this.products = products;
                wx.hideLoading();
            })
        
        },
        goReport(){
            wx.switchTab({
                url:"/pages/report/main"
            })
        },
        
        goRepair(item){
            if(item.repairsType === 5){
                item = JSON.stringify(item)

                item=item.replace(/\%/g,"%25");
                item=item.replace(/\#/g,"%23");
                item=item.replace(/\&/g,"%26");
                wx.navigateTo({
                    url:'/pages/repair/main?product='+item
                })
            }else if(item.repairsType === 0 || item.repairsType === 3){
                this.showGS4 = true;
                this.productId = item.id;
            }

        },
        goWarranty(){
            wx.navigateTo({
                url:'/pages/warranty/main'
            })
        }

    },
    onReachBottom(){
        if(this.page === this.totalPage-1){
            wx.showToast({
                title:'已经到底啦',
                icon:'none',
                duration:1000
            })
        }else{
            this.page++;
            this.getProducts();
        }
    },
    onShow(){
        this.page = 0;
        this.products = [];
        this.getProducts();
        this.integralNum = getApp().globalData.integralNum;//获取积分
    },

}
</script>

<style>
page{
    background: #efeff4;
}
.product-list{
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
.product-item{
    background: #fff;
    border-radius: 8px;
    padding: 20px 10px 0px 10px;
    margin-bottom: 15px;
}
.padb{
    padding-bottom: 20px !important;
}
.flex-row{
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.border-bottom{
    border-bottom: 1px solid #efeff4;
    padding-bottom: 10px;
}
.product-info{
    display: flex;
    justify-content: space-between;
}
.product-img{
    width: 80px;
    height:80px;
    margin-right: 10px;
}
.product-text{
    display: flex;
    justify-content: space-around;
    flex-direction: column;
}
.product-title{
    font-size: 14px;
    display: flex;
}
.product-title img{
    width: 18px;
    margin-left: 10px;
}
.product-status{
    color: #ff7836;
    font-size: 12px;
}
.product-time{
    color: #999;
    font-size: 12px;
}
.product-option{
    display: flex;
    justify-content: space-around;
    padding: 10px 0;

}
.option-item{
    display: flex;
    flex-flow: column;
    align-items: center;
    color: #333;
}
.option-img{
    width: 28px;
    height: 28px;
    margin-bottom: 10px;
}
.option-text{
    font-size: 11px;
}
.face-right{
    width: 20px;
    height: 20px;
    transition: all 0.3 linear;
}

.face-bottom{
    transform: rotate(90deg);
}
.modal3{
    width: 270px;
    text-align: center;
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
.colorR{
    color: red;
}
.colorFF7{
    color: #ff7836;
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
.moadal-btns{
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