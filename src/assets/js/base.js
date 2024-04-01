const storage = window.sessionStorage
const i18n = $.i18n()

$('#cookie-agree a.btn').on('click', function (e) {
  storage.setItem('agreeCookie', true)
  $('#cookie-agree').addClass('hidden')
})

$('header .offcanvas-toggler').on('click', function (e) {
  $('header .offcanvas-box').toggleClass('show')
})

$('select#lang-select').on('change', function (e) {
  let lang = $(this).val()
  i18n.locale = lang
  $('body').i18n()
  storage.setItem("userLang", lang)
})

$(function () {
  if (!storage.getItem('agreeCookie')) {
    $('#cookie-agree').removeClass('hidden')
  }

  let i18nzh = {}
  $('[data-i18n]').each(function () {
    let key = $(this).attr('data-i18n').replace(/\[.*?\]/g, '');
    let text = $(this).html()
    i18nzh[key] = text
  })

  i18n.load({
    zh: i18nzh,
    en: 'assets/i18n/en.json'
  }).then(() => {
    let lang = storage.getItem("userLang")

    // Allow query string override
    if (location.search)
      if (location.search.includes('lang=en')) lang = 'en'
      else if (location.search.includes('lang=zh')) lang = 'zh'

    // Guess from the user's preferred languages
    if (!lang) {
      let languages = navigator.languages || [navigator.language || navigator.userLanguage]
      for (const l of languages)
        if (l.startsWith('en')) { // Explicitly prefer English
          lang = 'en'
          break
        } else if (l.startsWith('zh')) { // Explicitly prefer Mandarin
          lang = 'zh'
          break
        }
      lang = lang || 'en' // Fallback
    }

    $('select#lang-select').val(lang)
    i18n.locale = lang
    if (lang !== 'zh')
      $('body').i18n()
  })
})

$(window).on('load', function (e) {
  $('body').css('overflow', 'unset')
  $('#loading').addClass('scale')
  setTimeout(function () {
    $('#loading').addClass('fadeout')
  }, 1000)
})
