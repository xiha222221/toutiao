<template>
  <!-- 
    Cell 单元格的 to 属性和VueRouter 中的RouterLink 组件的 to 属性用法是一样的 
    :to="'/article/'+article.art_id"
    :to="`/article/${article.art_id}`" 
  -->
  <van-cell
    class="article-item"
    :to="{
      //根据路由名称进行跳转
    name:'article',
    //传递路由动态参数
    params:{
      //属性名：路由路径中设计的动态参数名称
      articleId:article.art_id
    }
  }"
  >
    <div slot="title" class="title van-multi-ellipsis--l2">{{article.title}}</div>
    <div slot="label">
      <div class="cover-wrap" v-if="article.cover.type===3">
        <div class="cover-item" v-for="(img,index) in article.cover.images" :key="index">
          <van-image class="cover-item-img" :src="img" fit="cover" />
        </div>
      </div>
      <div class="label-info-wrap">
        <span>{{article.aut_name}}</span>
        <span>{{article.comm_count}}评论</span>
        <span>{{article.pubdate | relativeTime}}</span>
      </div>
    </div>
    <van-image
      :src="article.cover.images[0]"
      slot="default"
      v-if="article.cover.type===1"
      fit="cover"
      class="right-cover"
    />
  </van-cell>
</template>
<script>
export default {
  name: "ArticleItem",
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  }
};
</script>
<style scoped lang="less">
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
    .right-cover {
      width: 232px;
      height: 146px;
    }
  }
  .label-info-wrap span {
    font-size: 23px;
    color: #b4b4b4;
    margin-right: 25px;
  }
  .cover-wrap {
    display: flex;
    padding: 25px 0;
    .cover-item {
      flex: 1;
      height: 146px;

      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>