import HttpReq from "@/lib/https";
// 登录
function loginApi(data) {
  return HttpReq.formPost({
    url: "web_login/login",
    data,
    notLogin: true
  });
}
export {
  loginApi // 登录
};
