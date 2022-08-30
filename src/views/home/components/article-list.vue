<template>
  <div class="article-list">
    <!-- List 组件通过 loading 和 finished 两个变量控制加载状态，当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。若数据已全部加载完毕，则直接将 finished 设置成 true 即可。 -->

    <!-- 下拉刷新  时会触发 refresh 事件，在事件的回调函数中可以进行同步或异步操作，操作完成后将 v-model 设置为 false，表示加载完成。 -->
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <article-item v-for="(article,index) in list" :key="index" :article="article" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getArticles } from "@/api/article.js";
import ArticleItem from "@/components/article-item/index.vue";
export default {
  name: "ArticleList",
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [], //存储列表数据的数组
      loading: false, //控制加载中 loading 状态
      finished: false, //控制数据加载结束的状态
      timestamp: null, //请求获取下一页数据的时间戳
      error: false, //控制列表加载失败的提示状态
      isLoading: false, //控制下拉刷新的loading状态
      refreshSuccessText: "" //下拉刷新成功提示文本
    };
  },
  methods: {
    async onLoad() {
      try {
        // 1.请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, //频道ID
          // timestamp 简单理解就是请求数据的页码
          // 请求第一页数据：当前最新时间戳 Date.now()
          // 用于请求之后的数据,使用本次接口返回的数据中的pre_timestamp
          timestamp: this.timestamp || Date.now()
        });

        // 模拟随机失败的情况;
        // if (Math.random() > 0.5) {
        //   JSON.parse("dbhsajdj");
        // }

        // 2.把请求的结果数据放到 list 数组中
        console.log(data);
        const { results } = data.data;
        this.list.push(...results);

        // 3.本次数据加载结束之后要把加载状态设置为结束
        this.loading = false;

        // 4.判断数据是否全部加载完
        if (results.length) {
          this.timestamp = data.data.pre_timestamp;
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
    },
    // 当下拉刷新的时候会触发调用该函数
    async onRefresh() {
      try {
        // 1.请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now() //下拉刷新，每次请求获取最新的数据
        });
        // console.log(data);
        // 模拟随机失败的情况;
        if (Math.random() > 0.5) {
          JSON.parse("dbhsajdj");
        }
        // 2.将数据追加到列表的顶部
        const { results } = data.data;
        this.list.unshift(...results);
        // 3.关闭下拉刷新的loading 状态
        this.isLoading = false;
        // 更新下拉刷新成功提示文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`;
      } catch (err) {
        this.refreshSuccessText = "刷新失败";
        this.isLoading = false;
      }
    }
  }
};
</script>
<style scoped lang="less">
.article-list {
  // 百分比单位是相对于父元素的
  height: 79vh;
  overflow-y: auto;
}
</style>