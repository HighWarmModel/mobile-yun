<!-- 我的机台 -->
<template>
  <div class="my-machine bgcolor-f2 main-body">
    <div class="my-machine-header bgcolor-f">
      <MyStore
        :store-id="store_id"
        :default-index="0"
        @trigger-click="handleConfirm"
      />
    </div>
    <div class="main-container">
      <div class="my-machine-container bgcolor-f2">
        <div class="border"></div>
        <van-pull-refresh
          v-model="isLoading"
          class="my-machine-fresh"
          @refresh="handleRefresh"
        >
          <van-collapse v-model="activeNames" class="my-machine-content">
            <van-collapse-item title="我的机台" :name="0">
              <MachineList :columns="columns" />
            </van-collapse-item>
          </van-collapse>
        </van-pull-refresh>
      </div>
    </div>
  </div>
</template>
<script>
import MyStore from "@yun/my-store";
import MachineList from "@yun/machine/machine-list";
import { getMachineListApi } from "@/api";
export default {
  name: "MyMachine",

  components: {
    MyStore,
    MachineList
  },

  data() {
    return {
      activeNames: [0],
      columns: [],
      isLoading: false,
      store_id: null
    };
  },

  computed: {},
  created() {
    const { sid } = this.$route.query;
    if (sid) {
      this.store_id = sid;
    }
  },
  mounted() {},

  methods: {
    handleConfirm(data) {
      this.store_id = data.value.store_id;
      this.handleGetMachineList();
    },
    handleGetMachineList(callback = () => {}) {
      this.$Loading("加载中");
      getMachineListApi({ store_id: this.store_id }).then(res => {
        callback();
        this.$Loading.clear();
        if (res.return_code === "0") {
          this.columns = res.data.machine_list;
        } else {
          this.$Tip.warning(res.msg);
        }
      });
    },
    handleRefresh() {
      this.handleGetMachineList(() => {
        this.isLoading = false;
      });
    }
  }
};
</script>
<style lang="stylus">
.my-machine
  min-height 100vh
  .my-machine-header
    position absolute
    top 0
    left 0
    width 100%
    z-index 10
  .my-machine-container
    padding-top rems(106)
    height 100%
    box-sizing border-box
    .my-machine-fresh
      padding-top rems(30)
      overflow initial
    .my-machine-content
      .van-collapse-item__content
        padding 0
</style>
