<!-- 充值套餐详情 -->
<template>
  <div class="recharge-package-detail">
    <div class="title flex-row flex-between-center">
      <span class="size-30">当前套餐折扣</span>
      <van-button type="info" size="small" @click="handleConfigure"
        >重新配置</van-button
      >
    </div>
    <template v-if="newRechargePackageList.length">
      <dl
        v-for="value of newRechargePackageList"
        :key="value.id"
        class="container bgcolor-f"
      >
        <dt class="size-30 price border flex-row flex-between-center">
          <span>{{ value.money }}元</span>
          <van-checkbox
            :value="value.checked"
            label-position="left"
            :disabled="!value.checked"
            >推荐</van-checkbox
          >
        </dt>
        <dd class="content">
          <van-grid :gutter="10">
            <van-grid-item v-for="(items, index) of value.package" :key="index">
              <RechargePackageItem
                :checked="items.checked"
                :text="items.coin"
                :disabled="!items.checked"
              >
                <template #left-top>
                  <span
                    :class="[
                      'size-24 weight-bold',
                      items.checked ? 'color-f' : 'color-ff5722'
                    ]"
                    >{{ items.discount }}</span
                  >
                </template>
              </RechargePackageItem>
            </van-grid-item>
          </van-grid>
        </dd>
      </dl>
    </template>
    <div v-else class="text-center size-24">没有套餐折扣，请配置套餐……</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import RechargePackageItem from "./recharge-package-item";
export default {
  name: "RechargePackageDetail",
  components: {
    RechargePackageItem
  },

  data() {
    return {};
  },
  inject: ["params"],

  computed: {
    ...mapState({
      rechargePackageList: state => state.setMeal.rechargePackageList
    }),
    newRechargePackageList() {
      const rechargePackageList = this.rechargePackageList.filter(v => {
        return v.package.some(its => its.checked);
      });
      return rechargePackageList;
    }
  },

  mounted() {},

  methods: {
    handleConfigure() {
      this.params.tab = 2;
    }
  }
};
</script>
<style lang="stylus">
.recharge-package-detail
  .title
    padding 15px 10px
  .container
    margin 0
    margin-bottom rems(30)
    padding-bottom rems(30)
    .price
      padding rems(20) 0
      margin 0 10px
    .content
      margin-left 0
      padding-top rems(30)
</style>
