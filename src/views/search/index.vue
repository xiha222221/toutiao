<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form class="search-form" action="/">
      <van-search
        v-model="searchText"
        show-action
        background="#3296fa"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isShowResult=false"
      />
    </form>
    <!-- /搜索栏 -->
    <!-- 搜索结果 -->
    <search-result v-if="isShowResult" :searchText="searchText"></search-result>
    <!-- /搜索结果 -->
    <!-- 联想建议 -->
    <search-suggestion v-else-if="searchText" :searchText="searchText" @search="onSearch"></search-suggestion>
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history
      v-else
      :searchHistories="searchHistories"
      @clear-search-histories="searchHistories = []"
      @search="onSearch"
    ></search-history>
    <!-- /搜索历史记录 -->
  </div>
</template>
<script>
import SearchHistory from "./components/search-history.vue";
import SearchSuggestion from "./components/search-suggestion.vue";
import SearchResult from "./components/search-result.vue";
import { setItem, getItem } from "@/utils/storage.js";
export default {
  name: "SearchIndex",
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {
    // prop数据
    // prop 是受父组件数据影响的
    //  如果是普通数据 （数字、字符串。布尔值）绝对不能修改
    // 即便改了也不会传导给父组件
    //
    // 如果是引用类型数据（数组、对象）
    // 可以修改，例如[].push
    // 不能重新赋值，xxx=[]
  },
  data() {
    return {
      searchText: "",
      isShowResult: false, //控制搜索结果的展示
      searchHistories: getItem("TOUTIAO_SEARCH_HISTORIES") || []
    };
  },
  watch: {
    searchHistories(value) {
      setItem("TOUTIAO_SEARCH_HISTORIES", value);
    }
  },
  methods: {
    onSearch(val) {
      // 更新文本框内容
      this.searchText = val;
      // 存储搜索历史记录
      // 要求：不要有重复历史记录、最新的排在最前面
      const index = this.searchHistories.indexOf(val);
      if (index !== -1) {
        this.searchHistories.splice(index, 1);
      }
      this.searchHistories.unshift(val);
      // 渲染搜索结果
      this.isShowResult = true;
    },
    onCancel() {
      this.$router.back();
    }
  }
};
</script>
<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>