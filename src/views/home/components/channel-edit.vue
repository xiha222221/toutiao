<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        type="danger"
        slot="default"
        round
        size="mini"
        plain
        class="edit-btn"
        @click="isEdit = !isEdit"
      >{{isEdit ? '完成':'编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        v-for="(channel,index) in myChannels"
        :key="index"
        class="grid-item"
        @click="onMyChannelClick(channel,index)"
      >
        <!-- v-bind:class 语法
        一个对象，对象中的 key 表示要作用的CSS类名
        对象中的 value 要计算出布尔值
        true，则作用该类名，false，不作用类名-->
        <van-icon name="clear" slot="icon" v-show="isEdit && !fixChannels.includes(channel.id)" />
        <span slot="text" class="text" :class="{active: index===active}">{{channel.name}}</span>
      </van-grid-item>
    </van-grid>

    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item
        v-for="(channel,index) in recommendChannels"
        :key="index"
        :text="channel.name"
        class="grid-item"
        icon="plus"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>
<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from "@/api/channel.js";
import { mapState } from "vuex";
import { setItem } from "@/utils/storage.js";
export default {
  name: "ChannelEdit",
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [], //所有频道
      isEdit: false, //控制编辑状态的显示
      fixChannels: [0] //固定频道，不允许删除
    };
  },
  computed: {
    recommendChannels() {
      // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组
      return this.allChannels.filter(channel => {
        // 数组 find 方法：遍历数组，把符合条件的第一个元素返回
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id;
        });
      });
    },
    ...mapState(["user"])
    /* recommendChannels(){
      const channels=[]
      this.allChannels.forEach(channel=>{
        //find 遍历数组，找到满足条件的元素项
        const ret =this.myChannels.find(myChannel =>{
          return myChannel.id===channel.id
        })
        if(!ret){
          channels.push(channel)
        }
      })
      // 把计算结果返回
      return channels

    } */
  },
  created() {
    this.loadAllChannels();
  },
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels();
        this.allChannels = data.data.channels;
        console.log(data);
      } catch (err) {
        this.$toast("数据获取失败");
      }
    },
    async onAddChannel(channel) {
      this.myChannels.push(channel);
      // 数据持久化处理
      if (this.user) {
        try {
          // 已登录，把数据请求接口放到线上
          await addUserChannel({
            id: channel.id, //频道ID
            seq: this.myChannels.length //序号
          });
        } catch (err) {
          this.$toast("保存失败,请稍后重试");
        }
      } else {
        // 未登录，把数据存储到本地
        setItem("TOUTIAO_CHANNELS", this.myChannels);
      }
    },
    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        // 1.如果是固定频道，则不删除
        if (this.fixChannels.includes(channel.id)) {
          return;
        }
        // 2.删除频道项
        this.myChannels.splice(index, 1);
        this.deleteChannel(channel);

        // 3.如果删除的激活频道之前的频道，则更新激活频道的频道项
        // 参数1：要删除的元素的开始索引（包括）
        // 参数2：要删除的个数，如果不指定，则从参数1开始一只删除
        if (index <= this.active) {
          // 让激活频道的索引 -1
          this.$emit("update-active", this.active - 1, true);
        }
      } else {
        // 非编辑状态，执行切换频道
        this.$emit("update-active", index, false);
      }
    },
    async deleteChannel(channel) {
      if (this.user) {
        try {
          // 已登录，将数据更新到线上
          await deleteUserChannel(channel.id);
        } catch (err) {
          this.$toast("操作失败，请稍后重试");
        }
      } else {
        // 未登录，数据更新到本地
        setItem("TOUTIAO_CHANNELS", this.myChannels);
      }
    }
  }
};
</script>
<style scoped lang="less">
.channel-edit {
  padding: 87px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 103px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/.grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap; //文字不折行
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
    }
  }
  /deep/.my-grid {
    .grid-item {
      .van-grid-item__icon-wrapper {
        position: unset;
      }
      .van-icon {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  /deep/.recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>