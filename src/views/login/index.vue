<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon name="cross" slot="left" @click="$router.back()" />
    </van-nav-bar>
    <!-- 登录表单 -->
    <!-- 表单验证： -->
    <!-- 1.给van-field 组件配置 rules 验证规则 
    参考文档：https://vant-contrib.gitee.io/vant/#/zh-CN/form
    2.当表单提交的时候会自动触发表单验证
    如果验证通过，会触发submit 事件
    如果验证失败，不会触发 submit-->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        name="code"
        placeholder="请输入验证码"
        v-model="user.code"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 *15"
            format="ss s"
            @finish="isCountDownShow=false"
          />
          <van-button
            v-else
            size="small"
            type="default"
            round
            class="send-sms-btn"
            @click="onSendSms"
            native-type="button"
          >获取验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button block type="info" native-type="submit" class="login-btn">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from "@/api/user.js";
export default {
  data() {
    return {
      user: {
        mobile: "", //手机号
        code: "" //验证码
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: "手机号不能为空"
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: "手机号格式错误"
          }
        ],
        code: [
          {
            required: true,
            message: "验证码不能为空"
          },
          {
            pattern: /^\d{6}$/,
            message: "验证码格式错误"
          }
        ]
      },
      isCountDownShow: false
    };
  },
  methods: {
    async onSubmit() {
      // 1.获取表单数据
      const user = this.user;
      // 2.表单验证
      this.$toast.loading({
        message: "登录中...",
        forbidClick: true, //禁用背景点击
        duration: 0 //持续时间，默认是2000，如果为 0 则持续展示
      });
      // 3.提交表单请求登录
      try {
        const { data } = await login(user);
        this.$store.commit("setUser", data.data);
        this.$toast.success("登陆成功");
        // 登陆成功，跳转回原来界面
        // back 的方式不严谨，后面讲功能优化得时候再说
        this.$router.back();
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail("手机号或验证码错误");
        } else {
          this.$toast.fail("登录失败,请稍后重试");
        }
      }

      // 4.根据请求相应结果处理后续操作
    },
    async onSendSms() {
      console.log("onSendSms");
      // 1.校验手机号
      try {
        await this.$refs.loginForm.validate("mobile");
        console.log("验证通过");
      } catch (err) {
        return console.log("验证失败", err);
      }

      // 2.验证通过，显示倒计时
      this.isCountDownShow = true;

      // 3.请求发送验证码
      try {
        await sendSms(this.user.mobile);
        this.$toast("发送成功");
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false;
        if (err.response.status === 429) {
          this.$toast("发送太频繁了，请稍后重试");
        } else {
          this.$toast("发送失败，请稍后重试");
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 159px;
    height: 46px;
    line-height: 46px;
    color: #666;
    font-size: 22px;
    background-color: #ededed;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>