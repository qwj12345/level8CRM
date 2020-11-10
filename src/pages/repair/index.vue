<template>
  <div>
    <div class="form">
      <div class="form-item position">
          <div class="form-title">
              <span style="color:red;margin-top:2px;margin-right:2px">*</span> 损坏部位
          </div>
          <input placeholder="请选择损坏部位" v-model="option" class="input marginR10" disabled='true' @click="openPosition"/>
          <div class="face-right" @click="openPosition">
              <img :class='iconStyle' class="icon-img"  src="/static/images/face-right.png"/>
          </div>
          <!--  -->
          <div class="openPosition"  id="openPosition" v-show="showPosition">
            <div>
              <div v-for="(item,key) in options" :key="key" class="option-item border-bottom" @click="choosePosition(item)">
                {{item}}
              </div>
            </div>
          </div>
      </div>
      <!--  -->
      <div class="form-item-textarea">
          <div class="form-title">
             <span style="color:red;margin-top:2px;margin-right:2px">*</span> 损坏描述
          </div>
          <textarea v-if="!showPosition" placeholder="损坏描述" v-model="remark" class="textarea" :disabled="hasEdit"/>
          <div class="textarea" v-if="showPosition">

          </div>
      </div>
      <!--  -->
      <div class="form-item-textarea">
          <div class="form-title">
            <span style="color:red;margin-top:2px;margin-right:2px">*</span>  损坏图片
          </div>
          <div class="upload">
              <div v-if="uploadImgUrl===''" class="upload-border" @click="uploadImg(0)">
                  <img style="width:30px" src="../../../static/images/add.png" mode='widthFix'/>
              </div>
              <img @click="prevImg" v-if="uploadImgUrl!==''" style="width:80px;height:80px" :src="uploadImgUrl"/>
              <div class="close-img" v-if="uploadImgUrl!==''" @click="delImg">
                  <img src="../../../static/images/error.png" mode='widthFix'/>
              </div>
          </div>
      </div>
    </div>
    <div style="font-size:12px;color:#999;line-height:22px;margin-top:10px;margin-left:10px;display:flex;align-items:center;text-decoration:underline" @click="goRule">
      <img style="width:12px;margin-right:6px" src="../../../static/images/repair-q.png" mode='widthFix'/>
      内标图在哪看？
    </div>
    <!--  -->
    <div class="form" style="margin-top:4px">
            <!--  -->
      <div class="form-item-textarea">
          <div class="form-title">
           <span style="color:red;margin-top:2px;margin-right:2px">*</span>  内标图
          </div>
          <div class="upload">
              <div v-if="uploadImgUrl2===''" class="upload-border" @click="uploadImg(1)">
                  <img style="width:30px" src="../../../static/images/add.png" mode='widthFix'/>
              </div>
              <img @click="prevImg" v-if="uploadImgUrl2!==''" style="width:80px;height:80px" :src="uploadImgUrl2"/>
              <div class="close-img" v-if="uploadImgUrl2!==''" @click="delImg">
                  <img src="../../../static/images/error.png" mode='widthFix'/>
              </div>
          </div>
      </div>
      <div class="form-item position">
          <div class="form-title">
              内标编码-1
          </div>
          <input v-model="number1" placeholder="请填写内标编码" class="input"/>
      </div>
      <div class="form-item position">
          <div class="form-title">
              内标编码-2
          </div>
          <input v-model="number2" placeholder="请填写内标编码" class="input"/>
      </div>

    </div>
    <!--  -->
    <div class="report-btn" style="margin-bottom:20px" @click="reportRepair">
        提交
    </div>
    <!--  -->
    <van-popup :show="false"  position="bottom" close-on-click-overlay="true" @close="closePosition" >
      <div class="position-panel">
        <div v-for="(item,key) in options" :key="key" class="option-item" @click="choosePosition(item)">
          {{item}}
        </div>
      </div>
    </van-popup>
     <!-- 提交按钮弹出框 -->
    <van-popup :show="showGS" custom-class="popup-class3" @close="onClose">
        <div class="modal3">
            <div class="reg-text3 text-center">
                您确定上报维修该产品吗？
            </div>
            <div class="reg-button" @click="hideGS">
                确定
            </div>
        </div>
    </van-popup>
    <!--  -->
    <van-popup :show="showMsg" custom-class="popup-class3" >
        <div class="modal3">
            <div class='reg-text3'>
                <span v-html="msgText" @click="myInfo"></span>
            </div>

        <div class="modal-btns">
            <div class="moadal-btn border-r" @click="hideMsg">取消</div>
            <div class="moadal-btn" @click="hideGS">确定</div>
        </div>
        </div>
    </van-popup>
        <van-popup :show="showMsg2" custom-class="popup-class3" >
        <div class="modal3">
            <div class='reg-text3'>
                <span v-html="msgText2"></span>
            </div>

        <div class="modal-btns">
            <div class="moadal-btn border-r" @click="hideMsg">取消</div>
            <div class="moadal-btn"  @click="myInfo">前往</div>
        </div>
        </div>
    </van-popup>
  </div>
</template>

<script>
import {wxRequest} from '@/components/common'
import global from '@/components/global'
export default {
    data(){
        return{
          uploadImgUrl:'',
          uploadImgUrl2:'',
          number1:'',
          number2:'',
          showMsg:'',
          msgText:'',
          showMsg2:'',
          msgText2:'',
          showPosition:false,
          showText:true,
          product:{},
          options:[],
          option:'',
          remark:'',
          showGS:false,
          anima:null
        }
    },
    computed: {
      iconStyle(){
        let className = '';
        this.showPosition ? className='transform90' : className=''
        return className;
      }
    },
    methods: {
      goRule(){
        wx.navigateTo({
          url:'/pages/repairRule/main'
        })
      },
      onClose(){
       this.showGS = false; 
      },
      hideMsg(){
        this.showMsg = false;
        this.showMsg2 = false;
      },
      hideGS(){
            let data = {
              token:wx.getStorageSync('token'),
              id:this.product.id,
              repairsRtr:this.option,
              remake:this.remark,
              damageImg:this.uploadImgUrl,
              vendorCode:this.number1,
              purContractNumber:this.number2,
              insideImg:this.uploadImgUrl2
            }
            
            wxRequest('/miniProgram/api/repairs/add',{data:data}).then(res => {
              console.log(res)
              if(res.data.status === 0){
                this.showMsg = false;
                wx.showToast({
                    title: '上报成功',
                    icon: 'success',
                    duration: 1000
                })
                setTimeout(()=>{
                  wx.navigateBack()   
                },1000)
              }else if(res.data.status === 10037){
                wx.showToast({
                    title: '输入不完整',
                    image: '/static/images/errorToast.png',
                    duration: 1000
                })
              }
              else{
                 wx.showToast({
                    title: '上报失败',
                    image: '/static/images/errorToast.png',
                    duration: 1000
                })
              }
            })
            this.showGS = false;
      },

      openPosition(){
          this.showPosition == true ? this.showPosition = false : this.showPosition = true;
          
        //   this.$nextTick(() =>{

        //     var query = wx.createSelectorQuery();	// 创建节点查询器 query
        //     // 这段代码的意思是选择class=every的节点，获取节点位置信息的查询请求
        //     query.select('.position').boundingClientRect(function (rect) { 
        //       console.log(rect);
        //       this.absoluteTop.top=rect.height+'px';
        //       console.log(this.absoluteTop)
        //     }).exec();

 
        //  })


      },
      closePosition(){
          this.showPosition = false;
      },
      choosePosition(item){
        this.showPosition = false;
        this.option = item;
      },
      reportRepair(){
        
        if(this.option !== '' && this.remark !== ''&& this.uploadImgUrl !== ''&& this.uploadImgUrl2 !== ''){
          let data = {
            token:wx.getStorageSync('token'),
          }
          wxRequest('/miniProgram/api/repairs/str',{data:data}).then(res => {
            console.log(res)
            if(res.data.status === 0){
              this.showMsg = true;
              this.msgText = res.data.data;
            }else if(res.data.status === 10009 || res.data.status === 99999){
              wx.showToast({
                title: '系统出错',
                icon: 'none',
                duration: 1000
              })
            }else{
              this.showMsg2 = true;
              this.msgText2 = res.data.msg; 
            }

          })
        }else{
          wx.showToast({
              title: '请输入完整信息',
              icon: 'none',
              duration: 1000
          })
        }

      },
          uploadImg(type){
            let that = this;
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {

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
                                if(type===0){
                                  that.uploadImgUrl = JSON.parse(res1.data).url;
                                }else{
                                  that.uploadImgUrl2 = JSON.parse(res1.data).url;
                                }
                                console.log(JSON.parse(res1.data).url)
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
      myInfo(){
        console.log(555)
        wx.navigateTo({
          url:'/pages/myinfo/main'
        })
      }
    },
    onShow(){
      this.showMsg = false;
    },  
    onLoad(option){
      this.showPosition = false;
      this.product = JSON.parse(option.product);
      console.log(this.product)

      this.options = JSON.parse(this.product.goodsMaintainOption);
      this.option = '';
      this.remark = '';
      this.uploadImgUrl = '';
      this.uploadImgUrl2 = '';
      this.number2 = '';
      this.number1 = '';
    },
    // mounted() {
    //   this.anima = wx.createAnimation({
    //     duration: 4000,
    //     timingFunction: 'ease',
    //     delay: 1000
    //   });
    //   this.anima.top(183).step()
    //   this.anima.export()
    // },

}
</script>

<style>
page{
  background: #efeff4;
}
.position{
  position: relative;
}
.transform90{
  transform: rotate(90deg)
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
    padding: 25px;
    border: 1px dashed #ddd;
    border-radius: 8px;
}
.close-img{
    position: absolute;
    top: -8px;
    right: -8px;
    width: 16px;
    z-index: 2;
}
/* .icon-img{
  transition:all 0.6s ease;
} */
@keyframes mymove
{
  from{
    height:0px;
  }
  to{
    height: 100%;
  }
}
.openPosition{
  border: 1px solid #efeff4;
  border-bottom:none; 
  position: absolute;
  background: #fff;
  width: calc(100vw - 120px);
  top: 100%;
  right: 20px;
  z-index: 10;
  color: #666;
  /* animation:mymove 1s ease; */
  overflow: hidden;
}
.border-bottom{
  border-bottom: 1px solid #efeff4;
}
.form{
  padding: 0 10px;
  background: #fff;
  margin-top: 36px;
}
.form-item{
  padding: 10px;
  border-bottom: 1px solid #efeff4;
  display: flex;
  font-size: 14px;
  align-items: center;
}
.form-item-textarea{
  padding: 10px;
  border-bottom: 1px solid #efeff4;
  display: flex;
  font-size: 14px;
}
.form-title{
  width: 80px;
}
.input{
  width: calc(100% - 110px);
}
.marginR10{
  margin-right: 14px;
}
.face-right{
  width: 16px;
  height: 16px;
}
.form-item-textarea{
  padding: 10px;
  border-bottom: 1px solid #efeff4;
  display: flex;
  font-size: 14px;
}
.form-title{
  width: 80px;
  display: flex;
}
.textarea{
  padding: 2px 0 0 0;
  width: calc(100% - 110px);
  height: 80px;
}
.report-btn{
    background: #FFD637;
    height: 48px;
    line-height: 48px;
    text-align: center;
    border-radius: 30px;
    width: 80vw;
    margin: 0 auto;
    margin-top: 150px;
    font-size: 18px;
}
.position-panel{
  background: #fff;
}
.option-item{
  text-align: center;
  height: 30px;
  line-height: 30px;
  /* border-bottom: 1px solid #efeff4; */
  font-size: 13px;
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
    text-align: left;
}
.text-center{
  text-align: center;
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
</style>