<!-- 根据门店和区域查询机台 -->
<script>
import LinkageSelection from "@yun/linkage-selection";
import { mapActions } from "vuex";
export default {
  name: "MyMachine",
  components: {
    LinkageSelection
  },
  model: {
    prop: "value",
    event: "trigger-change"
  },
  props: {
    storeId: [String, Number],
    areaId: [String, Number],
    value: {
      default: () => ({})
    },
    title: {
      type: String,
      default: "请选择机台"
    },
    type: {
      type: String,
      default: "MACHINE",
      validator(val) {
        return ["MACHINE", "MACHINE_TYPE"].includes(val);
      }
    },
    rightIcon: {
      type: String,
      default: "arrow"
    },
    columns: Array
  },
  data() {
    return {
      list: []
    };
  },
  watch: {
    areaId: {
      handler(val) {
        const { storeId, type } = this;
        if (storeId && val) {
          const jsons = { storeId, areaId: val };
          if (type === "MACHINE_TYPE") {
            this.COMMON_GETMACHINETYPE_ACTION(jsons).then(
              this.handleReturnDeal
            );
            return;
          }
          this.COMMON_GETMACHINE_ACTION(jsons).then(this.handleReturnDeal);
        } else {
          this.list = [];
          this.$emit("trigger-change", {});
        }
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions(["COMMON_GETMACHINE_ACTION", "COMMON_GETMACHINETYPE_ACTION"]),
    handleChoseMachine(obj) {
      this.$emit("trigger-change", obj.value);
    },
    handleReturnDeal(res) {
      if (res.return_code === "0") {
        const { data } = res;
        this.list = data;
        // this.$emit("trigger-change", {});
      }
    }
  },

  render() {
    const { value, list, handleChoseMachine, title, rightIcon } = this;
    let val;
    let defaultIndex = 0;
    for (let i = 0; i < list.length; ++i) {
      const listObj = list[i];
      const listId = listObj.id;
      const id = value.id;
      if (listId && id && id.toString() === listId.toString()) {
        val = list[i].no;
        defaultIndex = i;
        break;
      }
    }
    return (
      <LinkageSelection
        right-icon={rightIcon}
        title={title}
        value={val}
        columns={list}
        default-index={defaultIndex}
        on-trigger-confirm={handleChoseMachine}
      />
    );
  }
};
</script>
<style lang="stylus"></style>
