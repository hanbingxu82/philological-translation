const axios = require('axios');

class TranslationService {
  constructor(appId, apiKey) {
    this.appId = appId;
    this.apiKey = apiKey;
    this.baseUrl = 'https://fanyi-api.baidu.com/api/trans/vip/translate';
  }

  async translateComment (text, sourceLanguage, targetLanguage) {
    const salt = Date.now(); // 生成一个随机盐值
    const signStr = `${this.appId}${text}${salt}${this.apiKey}`;
    const sign = this.calculateMD5(signStr); // 计算MD5签名
    try {
      const response = await axios.post(this.baseUrl + `?q=${text}&from=${sourceLanguage}&to=${targetLanguage}&appid=${this.appId}&salt=${salt}&sign=${sign}`);
      if (response.data&&response.data.trans_result) {
        return response.data.trans_result[0].dst; // 返回翻译结果
      } else {
        throw new Error(`Translation error: ${response.data.error_msg}`);
      }
    } catch (error) {
      console.error('Translation request error:', error.message);
      throw new Error('Failed to translate the comment.');
    }
  }

  calculateMD5 (text) {
    // 这里需要引入一个MD5加密库，如 crypto-js/md5 或其他Node.js MD5库
    // 假设有一个名为 md5 的函数可以计算MD5值
    const md5 = require('crypto-js/md5'); // 使用crypto-js为例
    return md5(text).toString();
  }
}

module.exports = TranslationService;