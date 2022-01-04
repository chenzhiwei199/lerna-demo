import Log from '@ali/h5-log/lib';


export function getUserInfo () {
  try {
    const loginInfo = JSON.parse(localStorage.getItem('hemaos_login_info')) || {};
    return {
      username: loginInfo.name,
      userId: loginInfo.workNumber,
      currentMerchantCode: loginInfo.merchantCode,
      date: new Date().toString()
    };
  } catch (error) {
    console.error('解析用户信息失败');
    return {};
  }
}
/**
 *
 * @param {*} pageName 页面名称
 * @param {*} behavior 行为
 * @param {*} des 详情
 */
export function setLog (pageName, behavior, des) {
  // console.log(pageName,behavior)
  // console.log({...des, ...getUserInfo()})
  Log.sendPCCustomLog(pageName, behavior,
    JSON.stringify({
      ...des,
      ...getUserInfo(),
      date: new Date(),
      href: `${window.location.origin}${window.location.pathname}`,
      params: `${encodeURIComponent(window.location.search.slice(1))}`
    }));
}
