<template lang="pug">
b-card
  b-card-title.d-flex.align-items-center
    span.mr-auto 界標閱覽系統
    NuxtLink(to="/case" title="開始使用" style="font-size: 3rem") ➭
  b-card-text
    ul(style="padding-left: 1.5rem;")
      li 土地界標為保障民眾土地財產之重要依據，本所自96年以來就已辦畢之鑑界案件進行界址拍攝作業，並列為案件結案之必要文件之一。
      li 本網站之開發讓外業同仁能於外業過程中輕鬆地透過手機拍照功能即可上傳界標埋設之相片，或於外業時透過瀏覽網頁搜尋歷次鑑界之界址相片，提升同仁作業效率。
    b-img.img-fluid.img-thumbnail(src="~/assets/images/sample.jpg")
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
</style>
