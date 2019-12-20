import axios from 'axios';

axios.interceptors.request.use(
  config => Promise.resolve(config),
  (error) => {
    if (window.plus) {
      window.plus.nativeUI.closeWaiting();
    }
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (res) => {
    if (window.plus) {
      window.plus.nativeUI.closeWaiting();
    }
    return Promise.resolve(res);
  },
  (error) => {
    // Do something with res error
    if (window.plus) {
      window.plus.nativeUI.closeWaiting();
    }
    return Promise.reject(error);
  },
);

const fetch = (methods, sendUrl, data = {}) => {
  if (window.plus) {
    window.plus.nativeUI.showWaiting();
    setTimeout(() => {
      window.plus.nativeUI.closeWaiting();
    }, 5000);
  }
  const httpDefaultOpts = {
    // http默认配置
    method: methods,
    url: sendUrl,
    timeout: 10000,
  };
  if (methods.toLocaleLowerCase() === 'get') {
    httpDefaultOpts.params = data;
  } else {
    httpDefaultOpts.data = data;
  }

  const promise = new Promise((resolve, reject) => {
    axios(httpDefaultOpts)
      .then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
  });
  return promise;
};
export default fetch;
