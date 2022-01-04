export function object2param(obj) {
  if (!obj) {
    return '';
  }
  const strarr = [] as string[];
  for (const i in obj) {
    if (obj[i] !== undefined && obj[i] !== null) {
      strarr.push(`${i}=${obj[i]}`);
    }
  }
  return strarr.join('&');
}

const ENV = {
  DEV: 'DEV',
  PROD: 'PROD',
};
// 记得切回正式
const CURRENT_ENV = window._APIMAP_ENV === 'production' ? ENV.PROD : ENV.DEV;
function getDomain() {
  switch (CURRENT_ENV) {
    case ENV.DEV:
      return 'localhost:7001';
    case ENV.PROD:
      return 'user-portrait.hemaos.com';
    default:
      return 'user-portrait.hemaos.com';
  }
}

const requestFunc = url => {
  return fetch(url).then(res => {
    return res.json();
  });
};

export function getDataSets() {
  return requestFunc(`//${getDomain()}/meta`)
    .then(res => {
      return res.data;
    })
    .catch(error => {
      console.warn(error);
    });
}

export function queryData(payload) {
  const params = object2param(payload);
  return requestFunc(`//${getDomain()}/load?${params}`).then(res => {
    return res.data;
  });
}

export function getKylinDataSets() {
  return requestFunc(`//${getDomain()}/kylin/meta`)
    .then(res => {
      return res.data.schema;
    })
    .catch(error => {
      console.warn(error);
    });
}

export function getKylinQueryData(payload) {
  const params = object2param(payload);
  return requestFunc(`//${getDomain()}/kylin/query?${params}`)
    .then(res => {
      return res.data;
    })
    .catch(error => {
      console.warn(error);
    });
}
