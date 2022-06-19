if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const axios = require("axios");
const qs = require("qs");
const Base64 = require("js-base64").Base64;

exports.handler = (event, context, callback) => {
  axios.defaults.baseURL = process.env.YD_API;
  axios.defaults.headers.common["Authorization"];

  authenticateUser(process.env.YD_USERNAME, process.env.YD_PASSWORD)
    .then(async (data) => {
      if (!data.token) throw new Error(data.message);
      axios.defaults.headers.common["Authorization"] = "Bearer " + data.token;

      await processData();
    })
    .catch((error) => {
      console.log(error.message);
    });

  async function authenticateUser(username, password) {
    return axios
      .post(
        "/account/user/authenticate",
        qs.stringify({
          username: username,
          password: Base64.encode(password),
        })
      )
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        throw error;
      });
  }

  async function processData() {
    return axios
      .get("/saleevent/all/sales/today")
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        throw error;
      });
  }
};
