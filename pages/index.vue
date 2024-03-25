<template lang="pug">
b-card
  b-card-title.d-flex.align-items-center
    span.mr-auto 界標即可拍線上系統開發沿革
    NuxtLink.arrow-link(to="/case" title="開始使用") ➭
  b-card-text
    ul(style="padding-left: 1.5rem;")
      li 界標為連結地籍圖及現地之重要標示，亦為保障測量人員測量成果與民眾權益之重要依據，桃園市政府地政局於111年4月7日以桃地測字第1110019472號函附研商本市各地政事務所測量業務精進作為彙整第3次會議紀錄將鑑界拍照程式推廣至轄內各地政事務所。
      li 本系統由桃園市桃園地政事務所開發，於111年7月由桃園市政府地政局統籌建構於局端，並交各地政事務所測試後於111年9月19日正式上線使用。
    b-img.img-fluid.img-thumbnail(src="~/assets/images/sample.jpg")
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.arrow-link {
  font-size: 3rem;
}
</style>
