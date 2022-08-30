<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <van-cell v-for="(article,index) in list" :key="index" :title="article.title" />
    </van-list>
  </div>
</template>
<script>
import { getResults } from "@/api/search.js";
export default {
  name: "SearchResult",
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  components: {},
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      page: 1,
      per_page: 10
    };
  },
  methods: {
    async onLoad() {
      try {
        // 1.请求获取数据
        const { data } = await getResults({
          page: this.page, //页码
          per_page: this.per_page, //每页大小
          q: this.searchText //查询关键词
        });
        // 模拟随机失败的情况;
        // if (Math.random() > 0.5) {
        //   JSON.parse("dbhsajdj");
        // }
        // console.log(data);
        // 2.把请求的结果数据放到 list 数组中
        const { results } = data.data;
        this.list.push(...results);
        // 3.本次数据加载结束之后要把加载状态设置为结束
        this.loading = false;
        // 4.判断数据是否全部加载完
        if (results.length) {
          this.page++;
        } else {
          // 没有数据了，将finished 设置为 true，不在load 加载更多
          this.finished = true;
        }
      } catch (err) {
        // 展示错误提示状态
        this.error = true;
        // 请求失败了，loading也需要关闭
        this.loading = false;
      }
    }
  }
};
</script>
<style scoped lang="less">
</style>