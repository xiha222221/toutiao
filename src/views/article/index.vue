<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="黑马头条" @click-left="$router.back()"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate |relativeTime}}</div>
          <!-- 模板中的 $event 是事件参数-->
          <!-- 当我们传递给子组件的数据即要使用还要修改。
          传递：props
          :isFollowed="article.is_followed"
          修改：自定义事件
          @update-isFollowed="article.is_followed=$event"
          简写方式：在组件上使用 v-model
          value="article.is_followed"
          @input="article.is_followed=$event"
          如果需要修改 v-model 的规则名称，可以通过子组件的 model
          一个组件上只能使用一次 v-model,
          如果有多个数据需要实现类似于 v-model 的效果，咋办？
          可以使用属性的 .sync 修饰符
          -->
          <FollowUser :userId="article.aut_id" v-model="article.is_followed" />
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content markdown-body" v-html="article.content" ref="article-content"></div>
        <van-divider>正文结束</van-divider>
        <!-- /文章内容 -->
        <!-- 文章评论列表 -->
        <comment-list
          :source="article.aut_id"
          @onload-success="totalCommentCount=$event.total_count"
        />
        <!-- /文章评论列表 -->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostCommentShow=true"
          >写评论</van-button>
          <van-icon name="comment-o" :badge="totalCommentCount" color="#777" />
          <collect-article v-model="article.is_collected" :articleId="article.aut_id" />
          <like-article v-model="article.attitude" :articleId="article.aut_id" />
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发布评论 -->
        <van-popup v-model="isPostCommentShow" position="bottom">
          <comment-post />
        </van-popup>
        <!-- /发布评论 -->
      </div>

      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus===404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import { getArticleById } from "@/api/article.js";
import { ImagePreview } from "vant";
import FollowUser from "@/components/follow-user/index.vue";
import CollectArticle from "@/components/collect-article/index.vue";
import LikeArticle from "@/components/like-article/index.vue";
import CommentList from "./components/comment-list.vue";
import CommentPost from "./components/comment-post";
export default {
  name: "ArticleIndex",
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      article: {},
      loading: true,
      errStatus: 0,
      followLoading: false,
      totalCommentCount: 0,
      isPostCommentShow: false
    };
  },
  computed: {},
  watch: {},
  created() {},

  mounted() {
    this.loadArticle();
  },
  methods: {
    async loadArticle() {
      // 展示 loading 加载中
      this.loading = true;
      try {
        const { data } = await getArticleById(this.articleId);
        // 模拟随机失败的情况;
        // if (Math.random() > 0.5) {
        //   JSON.parse("dbhsajdj");
        // }
        // 数据驱动视图这件事儿不是立即的
        this.article = data.data;
        console.log(data.data);

        setTimeout(() => {
          this.previewImage();
        }, 0);

        console.log(data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404;
        }
        console.log("获取数据失败", err);
      }
      this.loading = false;
    },
    // 把按钮封装起来了
    // async onFollow() {
    //   this.followLoading = true; //展示关注按钮的loading 状态
    //   try {
    //     if (this.article.is_followed) {
    //       // 已关注，取消关注
    //       await deleteFollow(this.article.aut_id);
    //     } else {
    //       // 没有关注，添加关注
    //       await addFollow(this.article.aut_id);
    //     }

    //     // 更新视图状态
    //     this.article.is_followed = !this.article.is_followed;
    //   } catch (err) {
    //     let message = "操作失败，请重试!";
    //     if (err.response && err.response.status === 400) {
    //       message = "你不能关注你自己";
    //     }
    //     this.$toast(message);
    //   }
    //   this.followLoading = false; //关闭关注按钮的loading 状态
    // },
    previewImage() {
      // 得到所有的 img 节点
      const articleContent = this.$refs["article-content"];
      const imgs = articleContent.querySelectorAll("img");
      // 获取所有img 地址
      const images = [];
      console.log(imgs);
      imgs.forEach((img, index) => {
        images.push(img.src);
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置
            startPosition: index
          });
        };
      });
    }
  }
};
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
