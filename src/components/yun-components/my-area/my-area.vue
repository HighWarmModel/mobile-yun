<!-- 我的区域 -->
<script>
import LinkageSelection from "@yun/linkage-selection";
import { mapActions } from "vuex";
export default {
  name: "MyArea",
  components: {
    LinkageSelection
  },
  model: {
    prop: "value",
    event: "trigger-change"
  },
  props: {
    storeId: String,
    value: {
      default: () => ({})
    },
    title: {
      type: String,
      default: "请选择区域"
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
    storeId: {
      handler(val) {
        if (val) {
          this.COMMON_GETAREA_ACTION({ storeId: val }).then(res => {
            if (res.return_code === "0") {
              this.list = res.data;
              // this.$emit("trigger-change", {});
            }
          });
        }
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions(["COMMON_GETAREA_ACTION"]),
    handleChoseArea(obj) {
      this.$emit("trigger-change", obj.value);
    }
  },

  render() {
    const { value, list, handleChoseArea, title, rightIcon } = this;
    let val;
    let defaultIndex = 0;
    for (let i = 0; i < list.length; ++i) {
      const listObj = list[i];
      const listId = listObj.id;
      const id = value.id;
      if (listId && id && id.toString() === listId.toString()) {
        val = list[i].name;
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
        on-trigger-confirm={handleChoseArea}
      />
    );
  }
};
</script>
<style lang="stylus" scoped></style>
