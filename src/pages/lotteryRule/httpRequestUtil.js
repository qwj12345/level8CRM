import axios from 'axios'
import router from '@/router'

//设置api访问基路径
axios.defaults.baseURL = 'https://api.xiaomaoma.com/';
axios.defaults.headers.post['Content-Type'] = 'application/json';


//http request 请求拦截器，有token值则配置上token值
axios.interceptors.request.use(
  config => {
    let tokenData = sessionStorage.getItem('token')
    if (tokenData) {  // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加
      tokenData=JSON.parse(tokenData);
      config.headers.Authorization = `Bearer ${tokenData.access_token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });


// http response 拦截器 ,拦截401状态（token过期），重新登录
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('userInfo')
          router.replace({
            path: 'login',
            query: {redirect: router.currentRoute.fullPath}
          })
      }
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  });


/**
 * GET 方式请求数据
 * @param hasParamUrl  请求url（已经拼接好的路径）
 */
export function getData(hasParamUrl, params) {
  let paramsString = '';
  if (params) {
    paramsString = '?';
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        paramsString += key + '=' + params[key] + '&';
      }
    }
  }
  return axios.get(hasParamUrl + paramsString).then(function (res) {
    return res.data;
  }).catch(function (error) {
    console.log("请求报错" + error);
  })
}

/**
 * POST 方式请求
 * @param hasParamUrl 请求url
 * @param params  (如下的param)
 *      var param = new URLSearchParams;
 *      param.append("name", "mirzhao");
 */
export function postData(requestUrl, params,config) {
  let searchParams = new URLSearchParams;
  for (const key in params) {
    searchParams.append(key, params[key]);
  }
  return axios.post(requestUrl, searchParams,config).then(function (res) {
    return res.data;
  }).catch(function (error) {
    console.log("请求报错" + error);
  })
}

/**
 * POST 方式请求（传送到服务器的是一个json对象）
 * @param requestUrl 请求url
 * @param callback 回调函数
 */
export function postStringParamData(requestUrl, params, params) {
  let paramsString = '';
  if (params) {
    paramsString = '?';
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        paramsString += key + '=' + params[key] + '&';
      }
    }
  }

  return axios.post(requestUrl, JSON.stringify(params)).then(function (res) {
    return res.data;
  }).catch(function (error) {
    console.log("请求报错" + error);
  })
}

/**
 * 上传文件——可以同时上传多个
 * @param uploadFileUrl
 * @param formData
 *      let formData = new FormData(); //创建form对象
 *      param.append('file',file1,fileName1);//通过append向form对象添加数据
 *      param.append('file',file2,fileName2);//通过append向form对象添加数据
 *      param.append('file',file3,fileName3);//通过append向form对象添加数据
 */
export function postFile(uploadFileUrl, formData) {
  let config = {
    headers: {'Content-Type': 'multipart/form-data'}
  }
  return axios.post(uploadFileUrl, formData, config).then(function (res) {
    return res.data;
  }).catch(function (error) {
    console.log("请求报错" + error);
  })
}


export default {
  getData,
  postData,
  postStringParamData,
  postFile
}
