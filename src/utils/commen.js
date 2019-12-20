/**
 * 公共函数封装
 */
export default {
  install (Vue) {
    Vue.prototype.toPage = (name, data = {}, animation = 'pop-in') => {
      if (process.env.NODE_ENV === 'production') {
        let str = '/index.html#/' + name
        str = str + '?'
        for (let key in data) {
          if (typeof data[key] === 'object') {
            str = str + key + '=' + encodeURIComponent(JSON.stringify(data[key])) + '&'
          } else {
            str = str + key + '=' + encodeURIComponent(data[key]) + '&'
          }
        }
        str = str.substring(0, str.length - 1)
        // 如果有导航栏配置名字的页面 不是一期详情页，就绘制导航栏
        // 否则直接跳转
        let w = window.plus.webview.create(str, name)
        window.third = w
        w.show(animation, 200)
      } else {
        // 兼容H5跳转，H5跳转后没有导航栏了
        let dataStr = ''
        for (let key in data) {
          if (typeof data[key] === 'object') {
            dataStr = dataStr + key + '=' + encodeURIComponent(JSON.stringify(data[key])) + '&'
          } else {
            dataStr = dataStr + key + '=' + encodeURIComponent(data[key]) + '&'
          }
        }
        dataStr = '?' + dataStr.substring(0, dataStr.length - 1)
        location.href = `index.html#/${name}${dataStr}`
      }
    }
    Vue.prototype.goBack = () => {
      if (process.env.NODE_ENV === 'production') {
        var nowPage = window.plus.webview.currentWebview()
        window.plus.webview.close(nowPage, 'slide-out-right')
      } else {
        window.history.go(-1)
      }
    }
    Vue.prototype.parseJSON = (data) => {
      let response
      try {
        response = JSON.parse(data)
      } catch (e) {
        console.log('转换对象失败')
        console.log(data)
        response = data
      }
      return response
    }
    Vue.prototype.checkUrl = (url) => {
      // 检测url链接，自动补全协议
      if (url.indexOf('http') > -1 || url.indexOf('https') > -1) {
        return url
      } else {
        return `https:${url}`
      }
    }
    Vue.prototype.getClipbordText = () => {
      // 获取剪切板内容 在plusready后再调用
      if (!window.plus) return
      if (window.plus.os.name.toLocaleLowerCase() === 'android') {
        var Context = window.plus.android.importClass('android.content.Context')
        var main = window.plus.android.runtimeMainActivity()
        var clip = main.getSystemService(Context.CLIPBOARD_SERVICE)
        return window.plus.android.invoke(clip, 'getText')
      } else {
        var UIPasteboard = window.plus.ios.importClass('UIPasteboard')
        var generalPasteboard = UIPasteboard.generalPasteboard()
        var _val = generalPasteboard.plusCallMethod({
          valueForPasteboardType: 'public.utf8-plain-text'
        })
        return _val || ''
      }
    }
    Vue.prototype.setClipbordText = (txt) => {
      // 写入剪切板内容 在plusready后再调用
      if (!window.plus) return
      if (window.plus.os.name.toLocaleLowerCase() === 'android') {
        var Context = window.plus.android.importClass('android.content.Context')
        var main = window.plus.android.runtimeMainActivity()
        var clip = main.getSystemService(Context.CLIPBOARD_SERVICE)
        window.plus.android.invoke(clip, 'setText', txt)
      } else {
        var UIPasteboard = window.plus.ios.importClass('UIPasteboard')
        var generalPasteboard = UIPasteboard.generalPasteboard()
        generalPasteboard.setValueforPasteboardType(txt, 'public.utf8-plain-text')
      }
    }
    Vue.prototype.removeTag = (str) => {
      // 去除文字中所有html标签
      return str.replace(/<[^>]+>/g, '')
    }
    Vue.prototype.isPhoneNo = (str) => {
      // 监测是否是手机号
      return /1[^0-2]\d{9}$/.test(str)
    }
    Vue.prototype.isId = (idCard) => {
      // 验证是否是正确的身份证号
      if (typeof idCard === 'number') {
        idCard = idCard.toString()
      }
      // 15位和18位身份证号码的正则表达式
      let regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
      // 如果通过该验证，说明身份证格式正确，但准确性还需计算
      if (regIdCard.test(idCard)) {
        if (idCard.length === 18) {
          let idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 将前17位加权因子保存在数组里
          let idCardY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
          let idCardWiSum = 0 // 用来保存前17位各自乖以加权因子后的总和
          for (let i = 0; i < 17; i++) {
            idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i]
          }
          let idCardMod = idCardWiSum % 11 // 计算出校验码所在数组的位置
          let idCardLast = idCard.substring(17) // 得到最后一位身份证号码
          // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
          if (idCardMod === 2) {
            if (idCardLast === 'X' || idCardLast === 'x') {
              return true
            } else {
              return false
            }
          } else {
            // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
            if (Number(idCardLast) === idCardY[idCardMod]) {
              return true
            } else {
              return false
            }
          }
        }
      } else {
        return false
      }
    }
    Vue.prototype.isMoneyNumber = (money) => {
      // 监测是否是金额 必须是整数或2位小数的数值
      return /(^[1-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{2}$)/.test(money)
    }
    Vue.prototype.removeAllSpace = (str) => {
      // 去除字符串中所有空格
      return str.replace(/\s/g, '')
    }
    Vue.prototype.urlWithParams = (str, data) => {
      // url链接拼上data
      let hasParam = str.indexOf('?') > -1
      str += hasParam ? '&' : '?'
      for (let key in data) {
        if (typeof data[key] === 'object') {
          str = str + key + '=' + encodeURIComponent(JSON.stringify(data[key])) + '&'
        } else {
          str = str + key + '=' + encodeURIComponent(data[key]) + '&'
        }
      }
      return str
    }
    Vue.prototype.checkServices = (pc, callback) => {
      // 监测支付渠道是否正确且准备好
      if (!pc.serviceReady) {
        var txt = ''
        switch (pc.id) {
          case 'alipay':
            txt = '检测到系统未安装“支付宝快捷支付服务”，无法完成支付操作'
            break
          default:
            txt = '系统未安装“' + pc.description + '”服务，无法完成支付，是否立即安装？'
            break
        }
        window.plus.nativeUI.confirm(txt, function (e) {
          if (Number(e.index) === 0) {
            pc.installService()
          }
        }, pc.description)
      } else {
        callback()
      }
    }
    Vue.prototype.b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
      // 图片转换为blob
      const byteCharacters = atob(b64Data)
      const byteArrays = []
      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize)
        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }
      const blob = new Blob(byteArrays, { type: contentType })
      return blob
    }
  }
}
