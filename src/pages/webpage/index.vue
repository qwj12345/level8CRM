<template>
  <div>
      <web-view v-show="false" :src="url"></web-view>
  </div>
</template>                        

<script>
import global from '@/components/global'

export default {
    data(){
        return{                                                                
            url:"https://shop.level8.com.cn/wxmail/getAuthurl?returnUrl="+global.ip1+"wxmail/saveUserInfo",
        }      //https://shop.level8.com.cn/wxmail/getAuthurl?returnUrl=http://shop.level8.com.cn/wxmail/saveUserInfo
    },
    methods: {

    },
    
    onShow(){
        
        setTimeout(()=>{
            wx.switchTab({
                url:'/pages/index/main'
            })
        },2500)

    }
}
</script>

<style>

</style>