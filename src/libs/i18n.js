import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import zh_CN from '../assets/i18n/zh'
import en_US from '../assets/i18n/en'
export default new VueI18n({
  locale : 'zh_CN', // set locale 默认显示
  messages : {
    'zh_CN': zh_CN,   // 中文语言包
    'en_US': en_US    // 英文语言包
  }
})