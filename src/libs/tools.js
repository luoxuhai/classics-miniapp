/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1);
  const keysArr2 = Object.keys(obj2);
  if (keysArr1.length !== keysArr2.length) return false;
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true;
  else return !keysArr1.some(key => obj1[key] != obj2[key]);
};

const isMillisecond = timeStamp => {
  const timeStr = String(timeStamp);
  return timeStr.length > 10;
};

/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 */
const getHandledValue = num => {
  return num < 10 ? '0' + num : num;
};

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} startType 要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 */
const getDate = (timeStamp, startType) => {
  const d = new Date(timeStamp * 1000);
  const year = d.getFullYear();
  const month = getHandledValue(d.getMonth() + 1);
  const date = getHandledValue(d.getDate());
  const hours = getHandledValue(d.getHours());
  const minutes = getHandledValue(d.getMinutes());
  const second = getHandledValue(d.getSeconds());
  let resStr = '';
  if (startType === 'year')
    resStr =
      year +
      '-' +
      month +
      '-' +
      date +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      second;
  else resStr = month + '-' + date + ' ' + hours + ':' + minutes;
  return resStr;
};

/**
 * @param {String|Number} timeStamp 时间戳
 * @returns {String} 相对时间字符串
 */
export const getRelativeTime = timeStamp => {
  timeStamp = new Date(timeStamp);
  const IS_MILLISECOND = isMillisecond(timeStamp);
  if (IS_MILLISECOND) Math.floor((timeStamp /= 1000));
  timeStamp = Number(timeStamp);
  const currentTime = Math.floor(Date.parse(new Date()) / 1000);
  let diff = currentTime - timeStamp;
  let resStr = '';
  const dirStr = '前';
  if (diff <= 59)
    resStr = (diff.toFixed() <= 0 ? 1 : diff.toFixed()) + '秒' + dirStr;
  else if (diff > 59 && diff <= 3599)
    resStr = Math.floor(diff / 60) + '分钟' + dirStr;
  else if (diff > 3599 && diff <= 86399)
    resStr = Math.floor(diff / 3600) + '小时' + dirStr;
  else if (diff > 86399 && diff <= 2623859)
    resStr = Math.floor(diff / 86400) + '天' + dirStr;
  else if (diff > 2623859 && diff <= 31567859 && IS_EARLY)
    resStr = getDate(timeStamp);
  else resStr = getDate(timeStamp, 'year');
  return resStr;
};
