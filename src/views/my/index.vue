<template>
  <div class="my-container">
    <!-- 已登录头部 -->
    <div class="header user-info" v-if="user">
      <div class="base-info">
        <div class="left">
          <van-image class="avatar" round fit="cover" :src="userInfo.photo" />
          <span class="name">{{ userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button size="mini" round to="/user/profile">编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录头部 -->
    <div class="header not-login" v-else>
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt />
        <span class="text">登录/注册</span>
      </div>
    </div>
    <!-- 导航宫格 -->
    <van-grid class="grid-nav" column-num="2" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- 消息通知，小智同学，退出登录 -->
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link class="md9" />
    <van-cell title="退出登录" class="lgout-cell" clickable v-if="user" @click="onLogout" />
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getUserInfo } from "@/api/user.js";
export default {
  name: "MyIndex",
  data() {
    return {
      userInfo: ""
    };
  },
  computed: {
    ...mapState(["user"])
  },
  created() {
    // 用过用户登陆了，则请求加载用户信息数据
    if (this.user) {
      this.loadUserInfo();
    }
  },
  methods: {
    onLogout() {
      // 退出提示
      // 在组件中需要使用 this.$dialog 来调用弹框组件
      this.$dialog
        .confirm({
          title: "确认退出吗?"
        })
        .then(() => {
          //  确认退出：清除登录状态（容器中的user+ 本地存储中的user)
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          // console.log("取消执行");
        });
    },
    async loadUserInfo() {
      try {
        const { data } = await getUserInfo();
        this.userInfo = data.data;

        // console.log(data);
      } catch (err) {
        this.$toast("获取数据失败，请稍后重试");
      }
    }
  }
};
</script>
<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png");
    background-size: cover;
  }
  // 未登录
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .mobile-img {
        height: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #ffffff;
      }
    }
  }
  // 登录
  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
          margin-right: 23px;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-stats {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .count {
          font-size: 36px;
          color: #fff;
        }
        .text {
          font-size: 23px;
          color: #fff;
        }
      }
    }
  }
  // 宫格导航
  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      i.toutiao-shoucang {
        color: #eb5253;
      }
      i.toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  // 消息通知，小智同学，退出登录
  .lgout-cell {
    text-align: center;
    color: #d86262;
  }
  .md9 {
    margin-bottom: 9px;
  }
}
</style>