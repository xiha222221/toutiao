<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :error.sync="error"
    error-text="请求失败，点击重新加载"
  >
    <comment-item v-for="(item,index) in list" :key="index" :comment="item" />
  </van-list>
</template>
<script>
import { getComments } from "@/api/comment.js";
import CommentItem from "./comment-item.vue";
export default {
  name: "CommentList",
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
      error: false
    };
  },
  created() {
    this.onLoad();
  },
  methods: {
    async onLoad() {
      try {
        // 请求获取数据
        const { data } = await getComments({
          type: "a", //评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: "this.source", //源id，文章id或评论id
          offset: "this.offset", //获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: "this.limit" //获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        });
        // console.log(data);
        // 2.将数据添加到列表中
        const { results } = data.data;
        this.list.push(...results);

        // 把文章评论的总数量传递到外部
        this.$emit("onload-success", data.data);
        // 3.将loading 设置为 false
        this.loading = false;
        // 4.判断是否有数据
        if (results.length) {
          // 有就更新获取下一页的数据页码
          this.offset = data.data.last_id;
        } else {
          // 没有就将 finished 设置结束
          this.finished = true;
        }
      } catch (err) {
        // console.log(err);
        this.error = true;
        this.loading = false;
      }
    }
  }
};
</script>
<style scoped lang="less">
</style>