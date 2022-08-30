<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar title="个人信息" left-arrow @click-left="$router.back()" class="page-nav-bar" />
    <!-- /导航栏 -->
    <input type="file" hidden ref="file" @change="onFileChange" />
    <!-- 个人信息 -->
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image class="avatar" round fit="cover" :src="user.photo" />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isUpdateNameShow=true" />
    <van-cell title="性别" :value="user.gender===0?'男':'女'" is-link @click="isUpdateGenderShow=true" />
    <van-cell title="生日" :value="user.birthday" is-link @click="isUpdateBirthdayShow=true" />
    <!-- /个人信息 -->
    <!-- 编辑昵称弹出层 -->
    <van-popup v-model="isUpdateNameShow" position="bottom" :style="{ height: '100%' }">
      <update-name v-if="isUpdateNameShow" @close="isUpdateNameShow=false" v-model="user.name" />
    </van-popup>
    <!-- /编辑昵称弹出层 -->
    <!-- 编辑性别弹出层 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <update-gender
        @close="isUpdateGenderShow=false"
        v-model="user.gender"
        v-if="isUpdateGenderShow"
      />
    </van-popup>
    <!-- /编辑性别弹出层 -->
    <!-- 编辑生日弹出层 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <update-birthday
        @close="isUpdateBirthdayShow=false"
        v-model="user.birthday"
        v-if="isUpdateBirthdayShow"
      />
    </van-popup>
    <!-- /编辑生日弹出层 -->
    <!-- 编辑头像弹出层 -->
    <van-popup v-model="isUpdatePhotoShow" position="bottom" :style="{ height: '100%' }">
      <update-photo
        v-if="isUpdatePhotoShow"
        :img="this.img"
        @close="isUpdatePhotoShow=false"
        @update-photo="user.photo=$event"
      />
    </van-popup>
    <!-- /编辑头像弹出层 -->
  </div>
</template>
<script>
import { getUserProfile } from "@/api/user.js";
import UpdateName from "./components/update-name.vue";
import UpdateGender from "./components/update-gender.vue";
import UpdateBirthday from "./components/update-birthday.vue";
import UpdatePhoto from "./components/update-photo.vue";
export default {
  name: "UserProfile",
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  created() {
    this.loadUserProfile();
  },
  data() {
    return {
      user: {}, //个人信息
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null
    };
  },
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile();
        console.log(data);
        this.user = data.data;
      } catch (err) {
        this.$toast("加载失败，请稍后重试");
      }
    },
    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0];
      // 基于文章对象获取 blob 数据
      this.img = window.URL.createObjectURL(file);
      // console.log(data);
      // 展示预览图片弹出层
      this.isUpdatePhotoShow = true;
      // file-input 如果选了同一个文件不会触发 change 事件
      // 解决办法就是每次使用完毕，把它的value 清空
      this.$refs.file.value = "";
    }
  }
};
</script>
<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>