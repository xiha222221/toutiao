<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar fixed>
      <van-button
        type="info"
        slot="title"
        round
        size="small"
        class="search-btn"
        icon="search"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>
    <!-- 导航栏 -->
    <!-- 频道列表 -->
    <!-- 通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。 -->
    <!-- 通过 animated 属性可以开启切换标签内容时的转场动画。 -->
    <!-- 通过 swipeable 属性可以开启滑动切换标签页。 -->
    <van-tabs v-model="active" animated swipeable class="channel-tabs">
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <!-- 文章列表 -->
        <article-list :channel="channel" />
        <!-- 文章列表 -->
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn" @click="isChannelEditShow=true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道列表 -->
    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <channel-edit :myChannels="channels" :active="active" @update-active="onUpdateActive" />
    </van-popup>
    <!-- 频道编辑弹出层 -->
  </div>
</template>
<script>
import { getUserChannels } from "@/api/user.js";
import ArticleList from "./components/article-list.vue";
import ChannelEdit from "./components/channel-edit";
import { mapState } from "vuex";
import { getItem } from "@/utils/storage.js";
export default {
  name: "HomeIndex",
  components: {
    ArticleList,
    ChannelEdit
  },
  data() {
    return {
      active: 0,
      //频道列表
      channels: [],
      isChannelEditShow: false
    };
  },
  computed: {
    ...mapState(["user"])
  },
  created() {
    this.loadChannels();
  },
  methods: {
    async loadChannels() {
      if (this.user) {
        const { data } = await getUserChannels();
        this.channels = data.data.channels;
      } else {
        const localChannels = getItem("TOUTIAO_CHANNELS");
        if (localChannels) {
          this.channels = localChannels;
        } else {
          const { data } = await getUserChannels();
          this.channels = data.data.channels;
        }
      }
      // try {
      //   const { data } = await getUserChannels();
      //   this.channels = data.data.channels;
      //   console.log(data);
      // } catch (err) {
      //   this.$toast("获取频道数据失败");
      // }
    },
    onUpdateActive(index, isChannelEditShow) {
      // 更新激活的频道项
      this.active = index;
      // 关闭编辑频道弹层
      this.isChannelEditShow = isChannelEditShow;
    }
  }
};
</script>
<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  .van-nav-bar {
    background-color: #3296fa;
    .van-icon {
      color: #fff;
      font-size: 32px;
    }
    /deep/.van-nav-bar__title {
      max-width: unset;
    }
    .search-btn {
      width: 555px;
      height: 64px;
      background-color: #5babfb;
      font-size: 28px;
      border: none;
    }
  }
  /deep/.channel-tabs {
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 28px;
      color: #777777;
    }
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      z-index: 1;
    }
    .van-tab--active {
      color: #333333;
      font-size: 30px;
    }
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 8px;
    }
    .van-tabs__nav--line {
      padding-bottom: 0;
    }
    .placeholder {
      width: 66px;
      height: 82px;
      flex-shrink: 0;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      width: 66px;
      height: 82px;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
        color: #333333;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background: url("~@/assets/gradient-gray-line.png");
        background-size: contain;
      }
    }
  }
}
</style>