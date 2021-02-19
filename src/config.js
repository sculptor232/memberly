const currentUrl = document.URL.split("#")[0];
module.exports = {
  devHost: "http://localhost:3001",
  prodHost:
    currentUrl.indexOf("vip") > -1
      ? "http://pay.960960.xyz"
      : "https://coodopay.herokuapp.com",
};
