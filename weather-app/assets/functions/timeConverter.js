export default function timeToUnix() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const currentDate = `${year}-${month < 10 ? '0' : ''}${month}-${
    day < 10 ? '0' : ''
  }${day}`;
  const timeInMillisecond = date.getTime();
  console.log('date today: ', currentDate);
  const unixTimestamp = Math.floor(date.getTime() / 1000);
  const unixTimestampString = unixTimestamp.toString();
  //console.log('full unix: ', unixTimestampString); // 162380 1600
  return unixTimestampString.substring(0, 5);
}
