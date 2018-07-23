var mongoose = require('mongoose')
const qs = require('querystring')
const request = require('request')

var uname = 'root'
var password = 'zxc123456'
var dbUrl = `mongodb://${uname}:${password}@193.112.138.84:27017/admin`
const okhost = 'https://www.okb.com'

let mid = mongoose.connect(dbUrl)


const contentTypeArr = [
  'application/json',
  'application/x-www-form-urlencoded',
]


const okdepth = mongoose.model('okdepth_eos_usdt', { res: String, date: Number })
const okkline = mongoose.model('okkline_eos_usdt', { res: String, date: Number })

// getOkDepth('eos_usdt')
function getOkKLine(peer) {
  const options = {
    url : `${okhost}/api/v1/kline.do?symbol=${peer}&type=1min`,
  }
  const param = setOption(options)
  return new Promise((resovle, reject) => {
    request(param, function (err, res, body) {
      if (err) {
        // _.logColor(err)
        reject(err)
      } else {
        // _.logColor(body)
        // console.log(body)
        resovle(body)
      }
    })
  })
}
function getOkDepth(peer) {
  // btc_usdt  eos_btc  soc_btc  eos_usdt
  const options = {
    url : `${okhost}/api/v1/depth.do?symbol=${peer}`, //
    method: ''
  }
  const param = setOption(options)

  return new Promise((resovle, reject) => {
    request(param, function (err, res, body) {
      if (err) {
        // _.logColor(err)
        reject(err)
      } else {
        // _.logColor(body)
        console.log(body)
        
        resovle(body)
      }
    })
  })
  
}

function setOption({url, data = {}, method = 'GET', header = {"content-type": contentTypeArr[1]}}) {
  let form = qs.stringify(data)
  return {
    url,
    // port: 10086,
    // json: true,
    // path,
    method,
    headers: header,
    form
  }
}


function savedbdepth() {
  getOkDepth('eos_usdt').then((e) => {
    const kitty = new okdepth({ res: e, date: +new Date() })
    kitty.save().then((res) => {
      console.log('save getOkDepth')
    })
  })
}
function savedbkline(params) {
  getOkKLine('eos_usdt').then((e) => {
    const kitty = new okkline({ res: e, date: +new Date() })
    kitty.save().then((res) => {
      console.log('save getOkKLine')
      // console.log('meow')
    })
  })
}
savedbdepth()
setInterval(() => {
  savedbdepth()
}, 60 * 1000)
setInterval(() => {
  savedbkline()
}, 60 * 1000 * 10)