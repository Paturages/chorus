/*
  Basic wrapper for HTTP requests in a browser.
*/

const get = (url, params, headers) =>
  new Promise((resolve, reject) => {
    if (process.env.FRONTEND) {
      if (process.env.FRONTEND === "2") {
        url = `http://localhost:3000${url}`;
      } else {
        url = `https://chorus.fightthe.pw${url}`;
      }
    }
    if (process.env.TESTING) url = `/testing${url}`;
    const xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === window.XMLHttpRequest.DONE) {
        if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
        else reject(JSON.parse(xhr.responseText));
      }
    };
    const uriParams =
      params && typeof params === "object"
        ? Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join("&")
        : "";
    xhr.open("GET", `${url}${uriParams ? `?${uriParams}` : ""}`, true);
    if (headers) {
      for (let header in headers) {
        xhr.setRequestHeader(header, headers[header]);
      }
    }
    xhr.send();
  });

const req = method => (url, params, headers) =>
  new Promise((resolve, reject) => {
    if (process.env.FRONTEND) {
      if (process.env.FRONTEND === "2") {
        url = `http://localhost:3000${url}`;
      } else {
        url = `https://chorus.fightthe.pw${url}`;
      }
    }
    if (process.env.TESTING) url = `/testing${url}`;
    const xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === window.XMLHttpRequest.DONE) {
        if (xhr.status === 200)
          resolve(xhr.responseText ? JSON.parse(xhr.responseText) : {});
        else reject(xhr.responseText ? JSON.parse(xhr.responseText) : {});
      }
    };
    xhr.open(method.toUpperCase(), url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    if (headers) {
      for (let header in headers) {
        xhr.setRequestHeader(header, headers[header]);
      }
    }
    xhr.send(params ? JSON.stringify(params) : undefined);
  });

export default {
  get,
  post: req("post"),
  put: req("put"),
  delete: req("delete")
};
