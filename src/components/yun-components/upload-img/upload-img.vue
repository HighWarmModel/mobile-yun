<!-- 上传图片 -->
<template>
  <dl class="upload-img-container size-0">
    <dd
      v-for="(item, index) of column"
      :key="index"
      class="upload-img-list flex-row flex-start-center"
      @click="
        APP_IMAGEPREVIEW_MUTATE({
          previewImage: [item.src],
          imagePreviewShow: true
        })
      "
    >
      <span class="upload-img-remove" @click.stop="handleDelete(index)">×</span>
      <img class="upload-img-content" :src="item.src" />
    </dd>
    <dt v-if="column.length < maxLength" class="upload-img-add">
      <HhfUploadImg
        :accept="accept"
        :maxSize="maxSize"
        :disabled="disabled"
        :quality="quality"
        :maxWidth="maxWidth"
        :maxHeight="maxHeight"
        @trigger-change="handleChange"
      />
    </dt>
  </dl>
</template>

<script>
import HhfUploadImg from "@hhf/hhf-upload-img";
import { mapMutations, mapActions } from "vuex";
import { responseParsingXML } from "@/lib/utils";
import { uploadImgToOssApi } from "@/api";
import webOssUpload from "@l/webOssUpload";
export default {
  name: "",

  components: {
    HhfUploadImg
  },
  props: {
    // 上传图片类型
    accept: {
      type: String,
      default: "image/*"
    },
    // 是否禁添加图片
    disabled: {
      type: Boolean,
      default: false
    },
    // 压缩质量
    quality: Number,
    // 压缩之后的最大宽度
    maxWidth: Number,
    // 压缩之后的最大高度
    maxHeight: Number,
    maxSize: Number,
    maxLength: {
      type: Number,
      default: 6
    },
    column: Array // 图片数组
  },
  data() {
    return {
      list: [],
      accessKeyID: "", // oss id
      policy: "", // oss policy
      signature: "", // oss signature
      securityToken: "", // oss SecurityToken
      callback: "" // oos callback
    };
  },

  computed: {},

  methods: {
    ...mapActions(["APP_SETOSSINFO_ACTION"]), // 设置oss信息
    ...mapMutations(["APP_IMAGEPREVIEW_MUTATE"]), // 预览图片
    handleChange(blob) {
      var fileReader = new FileReader();
      fileReader.onload = ee => {
        this.getOssReadFileUpdate(blob, ee.target.result);
      };
      fileReader.readAsDataURL(blob);
      // this.list.push({
      //   blob,
      //   src: window.URL.createObjectURL(blob)
      // })
      // if (this.list === 6) {
      //   this.show = false
      // }
    },
    getOssReadFileUpdate(blob, result) {
      this.$Loading({
        message: "图片加载中..."
      });
      this.getOssImgInfo()
        .then(() => this.uploadImg(blob, result))
        .then(res => {
          this.$Loading.clear();
          if (res && res.return_code === "0") {
            this.$emit("trigger-change", { src: res.data, base64Src: result });
            return;
          } else if (res) {
            this.$Tip.warning({
              mask: true,
              message: "添加失败，请重新添加"
            });
          }
          this.$Tip.error({
            mask: true,
            message: res
          });
        })
        .catch(err => {
          this.$Loading.clear();
          if (err && err.response) {
            const resXml = responseParsingXML(err.response.data);
            this.$Tip.error({
              mask: true,
              message: `Code:${resXml.Code}Message:${resXml.Message}`
            });
            return;
          }
          this.$Tip.error({
            mask: true,
            message: err.toString()
          });
        });
    },
    uploadImg(blob) {
      const { accessKeyID, policy, signature, securityToken, callback } = this;
      const formDt = webOssUpload({
        filename: `${new Date() - 1}.png`,
        policy,
        accessid: accessKeyID,
        signature,
        securityToken
      });
      const data = new FormData();
      data.append("callback", callback);
      for (const key in formDt) {
        data.append(key, formDt[key]);
      }
      data.append("file", blob);
      return uploadImgToOssApi({ data, callback });
    },
    // 获取oss信息
    getOssImgInfo() {
      return this.APP_SETOSSINFO_ACTION().then(res => {
        this.$Loading.clear();
        if (res.return_code === "0") {
          const {
            AccessKeyId,
            SecurityToken,
            policy,
            signature,
            callback
          } = res.data;
          this.accessKeyID = AccessKeyId;
          this.policy = policy;
          this.signature = signature;
          this.securityToken = SecurityToken;
          this.callback = callback;
        } else if (res.msg) {
          this.$Tip.warning({
            message: res.msg,
            mask: true
          });
        }
      });
    },
    handleDelete(index) {
      const obj = this.column.filter((v, i) => i === index)[0];
      this.$emit("trigger-delete", obj);
    },
    handleRevoke(e) {
      window.URL.revokeObjectURL(e.target.src);
    }
  }
};
</script>
<style lang="stylus" scoped>
.upload-img-container
  display flex
  flex-flow row wrap
  justify-content flex-start
  align-items flex-start
  margin 0
  box-sizing border-box
  .upload-img-add
    padding rems(20) 0
  .upload-img-list
    position relative
    width rems(150)
    height rems(150)
    padding rems(20) 0
    margin 0 rems(20) 0 0
    .upload-img-content
      max-width 100%
      max-height 100%
    .upload-img-remove
      position absolute
      top 0
      right rems(-20)
      display inline-block
      width rems(40)
      height @width
      line-height @width
      background-color #333333
      color #ffffff
      font-size rems(32)
      border-radius 50%
      text-align center
      z-index 1
    img
      max-width 100%
      max-height 100%
</style>
