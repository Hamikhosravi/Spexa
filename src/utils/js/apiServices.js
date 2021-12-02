// "برای API زدن چه برای گرفتن و چه ارسال دیتا از آبجکت apiServices استفاده و مشابه زیر متد های آن صدا زده میشوند"
// apiSerivces.baseUrl("https://jsonplaceholder.typicode.com/").path("users").method("GET").request((res) => {console.log(res)}, () => {});

import axios from "axios";

export const apiSerivces = {
  baseUrl(baseUrl) {
    this._baseUrl = baseUrl;
    return this;
  },

  path(urlPath) {
    this._path = urlPath;
    return this;
  },

  method(methodName) {
    this._method = methodName;
    return this;
  },

  header(headerString) {
    this._header = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${headerString}`,
    }
    return this;
  },

  data(params) {
    this._data = params;
    return this;
  },

  request(onSuccess, onError) {
    const link = this._baseUrl + this._path;
    const defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const requestMethod = this._method || "GET";
    const requestHeaders = this._header || defaultHeaders;

    let requestProps = {
      method: requestMethod,
      headers: requestHeaders,
      json: true,
      url: link,
      data: {},
    };
    if (requestMethod !== "GET") {
      requestProps.data = JSON.stringify(this._data || {});
    }
    return axios(requestProps)
      .then((result) => {
        onSuccess(result, this._data);
      })
      .catch((error) => {
        if (onError && typeof onError === "function") {
          onError(error, this._data);
        }
      });
  },
};
