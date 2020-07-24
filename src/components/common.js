
import global from '@/components/global'
// 时间戳转
export function timeFormat(nS) {
    let date = new Date(parseInt(nS)) // 时间戳为10位需乘1000，为13位则不用
    console.log(date)
    let Y = date.getFullYear() // 年
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) // 月
    let D = date.getDate() < 10 ? '0' + date.getDate() + '' : date.getDate() + '' // 日
    // return 125896455;
    return `${Y}/${M}/${D}`; // yyyy-mm-dd
}
// 格林尼治时间转
export function timeFormat1(nS,type) {
    let date = new Date(nS) // 
    let Y = date.getFullYear() // 年
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) // 月
    let D = date.getDate() < 10 ? '0' + date.getDate() + '' : date.getDate();// 日
    let H = date.getHours() < 10 ? '0' + date.getHours() + '' : date.getHours(); //时
    let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() + '' : date.getMinutes(); //分

    if(type === 0)
        return `${Y}/${M}/${D}`; // yyyy-mm-dd
    else
        return `${M}/${D} ${H}:${minute}`; // mm-dd hh:minute
}
// 生成32位uuid
export function wxuuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
  
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  
    }

    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "";
    var uuid = s.join("");
  
    return uuid
  
  }

export function getToken(encryptedData,iv){

        // -----------------获取token------------------
        return new Promise(function(resolve,reject){
            wx.login({
                success (res) {
            
                    if (res.code) {
                        wx.request({
                            url: global.ip1+'miniProgram/api/get/crm/token', 
                            data: {
                                encryptedData: encryptedData,
                                iv: iv,
                                code:res.code
                            },
                            header: {
                                'content-type': 'application/json' // 默认值
                            },
                            success (res) {

                                if(res.data.status === 0){
                                    wx.setStorageSync('token', res.data.token);
                                }else{
                                    console.log(9869,res.data);
                                }
                                resolve(res)
                            }
                        })
                    }
                }
            })
        })
        // ------------------------------
          

}
export function saveUser(nickName,avatarUrl,sex){
    // -----------------传头像和名字------------------
    wx.request({
        url: global.ip1+'miniProgram/api/user/basic/add/', //仅为示例，并非真实的接口地址
        data: {
        userName: nickName,
        userImg: avatarUrl,
        sex: sex,
        token:wx.getStorageSync('token')
        },
        header: {
        'content-type': 'application/json' // 默认值
        },
        success (res) {
           console.log(56,res)
            getApp().globalData.integralNum = res.data.integralNum;
        }
    })
    // ----------------------------------------------
}
// -----------------------封装wx.request请求--------------------
export function wxRequest(url,config){
    return new Promise(function(resolve,reject){
        let { 
            data = {},
            contentType = 'application/json',
            method = 'GET',
            ...other
        } = {...config}   //解构赋值
        
        wx.request({
            url:global.ip1 + url,
            data:{...data},
            method: method,
            header: {
                'content-type': contentType
            },
            success(res){
              
                resolve(res)
            }
        })
    })
}

//   return axios.put(url).then((res) => {
//     return Promise.resolve(res.data)
//   }).catch((err) => {
//     console.log(err)
//   })