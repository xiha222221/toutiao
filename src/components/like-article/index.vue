<template>
  <van-icon
    :color="value===1 ? '#e5645f': ''"
    :name="value===1 ? 'good-job' : 'good-job-o'"
    :loading="loading"
    @click="onLike"
  />
</template>
<script>
import { addLike, deleteLike } from "@/api/article.js";
export default {
  name: "LikeArticle",
  props: {
    value: {
      type: Number,
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
    async onLike() {
      this.loading = true;
      try {
        let status = -1;
        if (this.value === 1) {
          // 已点赞，取消点赞
          await deleteLike(this.articleId);
        } else {
          // 没有点赞，添加点赞
          await addLike(this.articleId);
          status = 1;
        }
        // 更新视图
        this.$emit("input", status);
        this.$toast.success("statue===1 ? '点赞成功':'点赞失败");
      } catch (err) {
        this.$toast.fail("操作失败，请稍后重试");
      }
      this.loading = false;
    }
  }
};
</script>
<style scoped lang="less">
</style>