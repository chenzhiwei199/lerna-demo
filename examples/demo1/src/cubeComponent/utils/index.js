import { Feedback } from '@alife/hippo';

const Toast = Feedback.toast;


// const showError = () => Toast.error('操作失败');

export const showSuccess = (msg) => {
  Toast.success(msg);
};
export const showAlert = (msg) => {
  Toast.prompt(msg);
};

export function isObjWithValue (values) {
  return values && Object.keys(values).length > 0;
}


export function object2param(obj) {
  if (!obj) {
    return '';
  }
  const strarr = [];
  for (const i in obj) {
    if (obj[i] !== undefined && obj[i] !== null) {
      strarr.push(`${i}=${obj[i]}`);
    }
  }
  return strarr.join('&');
}


export function getIn (collection, searchKeyPath, notSetValue = null) {
  // check if array or string
  if (typeof searchKeyPath === 'string') {
    return collection[searchKeyPath] || notSetValue;
  } if (Array.isArray(searchKeyPath)) {
    return searchKeyPath.reduce((previousValue, currentKey) => {
      if (previousValue && typeof previousValue === 'object') {
        return previousValue[currentKey] || notSetValue;
      }
        return notSetValue;
    }, collection);
  }
    return notSetValue;
}


export function getMerchantId() {
  let merchantCode = '';
  try {
    merchantCode = JSON.parse(localStorage.getItem('hemaos_login_info')).currentMerchantCode;
  } catch (error) {
    console.error('用户登录商家获取失败');
  }

  return merchantCode;
}


export function gup (name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
  let regexS = `[\\?&]${name}=([^&#]*)`;
  let regex = new RegExp(regexS);
  let results = regex.exec(url);
  return results == null ? null : results[1];
}
