<template>
  <van-icon
    :color="value ? '#ffa500':''"
    :name="value ? 'star' : 'star-o'"
    @click="onCollecct"
    :loading="loading"
  />
</template>
<script>
import { addCollect, deleteCollect } from "@/api/article.js";
export default {
  name: "CollectArticle",
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    async onCollecct() {
      this.loading = true;
      try {
        if (this.value) {
          // 取消收藏
          await deleteCollect(this.articleId);
        } else {
          // 收藏
          await addCollect(this.articleId);
        }
        // 更新视图
        // 自定义事件修改数据并不是立即的
        this.$emit("input", !this.value);
        this.$toast.success(!this.value ? "收藏成功" : "取消收藏");
      } catch (err) {
        this.$toast.fail("请求失败，请稍后重试");
      }
      this.loading = false;
    }
  }
};
</script>
<style scoped lang="less">
</style>