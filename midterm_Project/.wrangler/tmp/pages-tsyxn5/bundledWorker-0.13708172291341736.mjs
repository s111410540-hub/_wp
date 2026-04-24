var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../.wrangler/tmp/bundle-Ggc88Q/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// _worker.js
var e = /* @__PURE__ */ __name((e11, t3, n2) => (r2, i2) => {
  let a2 = -1;
  return o2(0);
  async function o2(s2) {
    if (s2 <= a2) throw Error("next() called multiple times");
    a2 = s2;
    let c2, l2 = false, u2;
    if (e11[s2] ? (u2 = e11[s2][0][0], r2.req.routeIndex = s2) : u2 = s2 === e11.length && i2 || void 0, u2) try {
      c2 = await u2(r2, () => o2(s2 + 1));
    } catch (e12) {
      if (e12 instanceof Error && t3) r2.error = e12, c2 = await t3(e12, r2), l2 = true;
      else throw e12;
    }
    else r2.finalized === false && n2 && (c2 = await n2(r2));
    return c2 && (r2.finalized === false || l2) && (r2.res = c2), r2;
  }
  __name(o2, "o");
}, "e");
var t = /* @__PURE__ */ Symbol();
var n = /* @__PURE__ */ __name(async (e11, t3 = /* @__PURE__ */ Object.create(null)) => {
  let { all: n2 = false, dot: i2 = false } = t3, a2 = (e11 instanceof oe ? e11.raw.headers : e11.headers).get("Content-Type");
  return a2?.startsWith("multipart/form-data") || a2?.startsWith("application/x-www-form-urlencoded") ? r(e11, {
    all: n2,
    dot: i2
  }) : {};
}, "n");
async function r(e11, t3) {
  let n2 = await e11.formData();
  return n2 ? i(n2, t3) : {};
}
__name(r, "r");
function i(e11, t3) {
  let n2 = /* @__PURE__ */ Object.create(null);
  return e11.forEach((e12, r2) => {
    t3.all || r2.endsWith("[]") ? a(n2, r2, e12) : n2[r2] = e12;
  }), t3.dot && Object.entries(n2).forEach(([e12, t4]) => {
    e12.includes(".") && (o(n2, e12, t4), delete n2[e12]);
  }), n2;
}
__name(i, "i");
var a = /* @__PURE__ */ __name((e11, t3, n2) => {
  e11[t3] === void 0 ? t3.endsWith("[]") ? e11[t3] = [n2] : e11[t3] = n2 : Array.isArray(e11[t3]) ? e11[t3].push(n2) : e11[t3] = [e11[t3], n2];
}, "a");
var o = /* @__PURE__ */ __name((e11, t3, n2) => {
  if (/(?:^|\.)__proto__\./.test(t3)) return;
  let r2 = e11, i2 = t3.split(".");
  i2.forEach((e12, t4) => {
    t4 === i2.length - 1 ? r2[e12] = n2 : ((!r2[e12] || typeof r2[e12] != "object" || Array.isArray(r2[e12]) || r2[e12] instanceof File) && (r2[e12] = /* @__PURE__ */ Object.create(null)), r2 = r2[e12]);
  });
}, "o");
var s = /* @__PURE__ */ __name((e11) => {
  let t3 = e11.split("/");
  return t3[0] === "" && t3.shift(), t3;
}, "s");
var c = /* @__PURE__ */ __name((e11) => {
  let { groups: t3, path: n2 } = l(e11);
  return u(s(n2), t3);
}, "c");
var l = /* @__PURE__ */ __name((e11) => {
  let t3 = [];
  return e11 = e11.replace(/\{[^}]+\}/g, (e12, n2) => {
    let r2 = `@${n2}`;
    return t3.push([r2, e12]), r2;
  }), {
    groups: t3,
    path: e11
  };
}, "l");
var u = /* @__PURE__ */ __name((e11, t3) => {
  for (let n2 = t3.length - 1; n2 >= 0; n2--) {
    let [r2] = t3[n2];
    for (let i2 = e11.length - 1; i2 >= 0; i2--) if (e11[i2].includes(r2)) {
      e11[i2] = e11[i2].replace(r2, t3[n2][1]);
      break;
    }
  }
  return e11;
}, "u");
var d = {};
var f = /* @__PURE__ */ __name((e11, t3) => {
  if (e11 === "*") return "*";
  let n2 = e11.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (n2) {
    let r2 = `${e11}#${t3}`;
    return d[r2] || (n2[2] ? d[r2] = t3 && t3[0] !== ":" && t3[0] !== "*" ? [
      r2,
      n2[1],
      RegExp(`^${n2[2]}(?=/${t3})`)
    ] : [
      e11,
      n2[1],
      RegExp(`^${n2[2]}$`)
    ] : d[r2] = [
      e11,
      n2[1],
      true
    ]), d[r2];
  }
  return null;
}, "f");
var p = /* @__PURE__ */ __name((e11, t3) => {
  try {
    return t3(e11);
  } catch {
    return e11.replace(/(?:%[0-9A-Fa-f]{2})+/g, (e12) => {
      try {
        return t3(e12);
      } catch {
        return e12;
      }
    });
  }
}, "p");
var m = /* @__PURE__ */ __name((e11) => p(e11, decodeURI), "m");
var h = /* @__PURE__ */ __name((e11) => {
  let t3 = e11.url, n2 = t3.indexOf("/", t3.indexOf(":") + 4), r2 = n2;
  for (; r2 < t3.length; r2++) {
    let e12 = t3.charCodeAt(r2);
    if (e12 === 37) {
      let e13 = t3.indexOf("?", r2), i2 = t3.indexOf("#", r2), a2 = e13 === -1 ? i2 === -1 ? void 0 : i2 : i2 === -1 ? e13 : Math.min(e13, i2), o2 = t3.slice(n2, a2);
      return m(o2.includes("%25") ? o2.replace(/%25/g, "%2525") : o2);
    } else if (e12 === 63 || e12 === 35) break;
  }
  return t3.slice(n2, r2);
}, "h");
var g = /* @__PURE__ */ __name((e11) => {
  let t3 = h(e11);
  return t3.length > 1 && t3.at(-1) === "/" ? t3.slice(0, -1) : t3;
}, "g");
var _ = /* @__PURE__ */ __name((e11, t3, ...n2) => (n2.length && (t3 = _(t3, ...n2)), `${e11?.[0] === "/" ? "" : "/"}${e11}${t3 === "/" ? "" : `${e11?.at(-1) === "/" ? "" : "/"}${t3?.[0] === "/" ? t3.slice(1) : t3}`}`), "_");
var v = /* @__PURE__ */ __name((e11) => {
  if (e11.charCodeAt(e11.length - 1) !== 63 || !e11.includes(":")) return null;
  let t3 = e11.split("/"), n2 = [], r2 = "";
  return t3.forEach((e12) => {
    if (e12 !== "" && !/\:/.test(e12)) r2 += "/" + e12;
    else if (/\:/.test(e12)) if (/\?/.test(e12)) {
      n2.length === 0 && r2 === "" ? n2.push("/") : n2.push(r2);
      let t4 = e12.replace("?", "");
      r2 += "/" + t4, n2.push(r2);
    } else r2 += "/" + e12;
  }), n2.filter((e12, t4, n3) => n3.indexOf(e12) === t4);
}, "v");
var ee = /* @__PURE__ */ __name((e11) => /[%+]/.test(e11) ? (e11.indexOf("+") !== -1 && (e11 = e11.replace(/\+/g, " ")), e11.indexOf("%") === -1 ? e11 : p(e11, ie)) : e11, "ee");
var te = /* @__PURE__ */ __name((e11, t3, n2) => {
  let r2;
  if (!n2 && t3 && !/[%+]/.test(t3)) {
    let n3 = e11.indexOf("?", 8);
    if (n3 === -1) return;
    for (e11.startsWith(t3, n3 + 1) || (n3 = e11.indexOf(`&${t3}`, n3 + 1)); n3 !== -1; ) {
      let r3 = e11.charCodeAt(n3 + t3.length + 1);
      if (r3 === 61) {
        let r4 = n3 + t3.length + 2, i3 = e11.indexOf("&", r4);
        return ee(e11.slice(r4, i3 === -1 ? void 0 : i3));
      } else if (r3 == 38 || isNaN(r3)) return "";
      n3 = e11.indexOf(`&${t3}`, n3 + 1);
    }
    if (r2 = /[%+]/.test(e11), !r2) return;
  }
  let i2 = {};
  r2 ??= /[%+]/.test(e11);
  let a2 = e11.indexOf("?", 8);
  for (; a2 !== -1; ) {
    let t4 = e11.indexOf("&", a2 + 1), o2 = e11.indexOf("=", a2);
    o2 > t4 && t4 !== -1 && (o2 = -1);
    let s2 = e11.slice(a2 + 1, o2 === -1 ? t4 === -1 ? void 0 : t4 : o2);
    if (r2 && (s2 = ee(s2)), a2 = t4, s2 === "") continue;
    let c2;
    o2 === -1 ? c2 = "" : (c2 = e11.slice(o2 + 1, t4 === -1 ? void 0 : t4), r2 && (c2 = ee(c2))), n2 ? (i2[s2] && Array.isArray(i2[s2]) || (i2[s2] = []), i2[s2].push(c2)) : i2[s2] ??= c2;
  }
  return t3 ? i2[t3] : i2;
}, "te");
var ne = te;
var re = /* @__PURE__ */ __name((e11, t3) => te(e11, t3, true), "re");
var ie = decodeURIComponent;
var ae = /* @__PURE__ */ __name((e11) => p(e11, ie), "ae");
var oe = class {
  static {
    __name(this, "oe");
  }
  raw;
  #e;
  #t;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(e11, t3 = "/", n2 = [[]]) {
    this.raw = e11, this.path = t3, this.#t = n2, this.#e = {};
  }
  param(e11) {
    return e11 ? this.#n(e11) : this.#r();
  }
  #n(e11) {
    let t3 = this.#t[0][this.routeIndex][1][e11], n2 = this.#i(t3);
    return n2 && /\%/.test(n2) ? ae(n2) : n2;
  }
  #r() {
    let e11 = {}, t3 = Object.keys(this.#t[0][this.routeIndex][1]);
    for (let n2 of t3) {
      let t4 = this.#i(this.#t[0][this.routeIndex][1][n2]);
      t4 !== void 0 && (e11[n2] = /\%/.test(t4) ? ae(t4) : t4);
    }
    return e11;
  }
  #i(e11) {
    return this.#t[1] ? this.#t[1][e11] : e11;
  }
  query(e11) {
    return ne(this.url, e11);
  }
  queries(e11) {
    return re(this.url, e11);
  }
  header(e11) {
    if (e11) return this.raw.headers.get(e11) ?? void 0;
    let t3 = {};
    return this.raw.headers.forEach((e12, n2) => {
      t3[n2] = e12;
    }), t3;
  }
  async parseBody(e11) {
    return n(this, e11);
  }
  #a = /* @__PURE__ */ __name((e11) => {
    let { bodyCache: t3, raw: n2 } = this, r2 = t3[e11];
    if (r2) return r2;
    let i2 = Object.keys(t3)[0];
    return i2 ? t3[i2].then((t4) => (i2 === "json" && (t4 = JSON.stringify(t4)), new Response(t4)[e11]())) : t3[e11] = n2[e11]();
  }, "#a");
  json() {
    return this.#a("text").then((e11) => JSON.parse(e11));
  }
  text() {
    return this.#a("text");
  }
  arrayBuffer() {
    return this.#a("arrayBuffer");
  }
  blob() {
    return this.#a("blob");
  }
  formData() {
    return this.#a("formData");
  }
  addValidatedData(e11, t3) {
    this.#e[e11] = t3;
  }
  valid(e11) {
    return this.#e[e11];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [t]() {
    return this.#t;
  }
  get matchedRoutes() {
    return this.#t[0].map(([[, e11]]) => e11);
  }
  get routePath() {
    return this.#t[0].map(([[, e11]]) => e11)[this.routeIndex].path;
  }
};
var se = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var ce = /* @__PURE__ */ __name((e11, t3) => {
  let n2 = new String(e11);
  return n2.isEscaped = true, n2.callbacks = t3, n2;
}, "ce");
var le = /* @__PURE__ */ __name(async (e11, t3, n2, r2, i2) => {
  typeof e11 == "object" && !(e11 instanceof String) && (e11 instanceof Promise || (e11 = e11.toString()), e11 instanceof Promise && (e11 = await e11));
  let a2 = e11.callbacks;
  if (!a2?.length) return Promise.resolve(e11);
  i2 ? i2[0] += e11 : i2 = [e11];
  let o2 = Promise.all(a2.map((e12) => e12({
    phase: t3,
    buffer: i2,
    context: r2
  }))).then((e12) => Promise.all(e12.filter(Boolean).map((e13) => le(e13, t3, false, r2, i2))).then(() => i2[0]));
  return n2 ? ce(await o2, a2) : o2;
}, "le");
var ue = "text/plain; charset=UTF-8";
var de = /* @__PURE__ */ __name((e11, t3) => ({
  "Content-Type": e11,
  ...t3
}), "de");
var fe = /* @__PURE__ */ __name((e11, t3) => new Response(e11, t3), "fe");
var pe = class {
  static {
    __name(this, "pe");
  }
  #e;
  #t;
  env = {};
  #n;
  finalized = false;
  error;
  #r;
  #i;
  #a;
  #o;
  #s;
  #c;
  #l;
  #u;
  #d;
  constructor(e11, t3) {
    this.#e = e11, t3 && (this.#i = t3.executionCtx, this.env = t3.env, this.#c = t3.notFoundHandler, this.#d = t3.path, this.#u = t3.matchResult);
  }
  get req() {
    return this.#t ??= new oe(this.#e, this.#d, this.#u), this.#t;
  }
  get event() {
    if (this.#i && "respondWith" in this.#i) return this.#i;
    throw Error("This context has no FetchEvent");
  }
  get executionCtx() {
    if (this.#i) return this.#i;
    throw Error("This context has no ExecutionContext");
  }
  get res() {
    return this.#a ||= fe(null, { headers: this.#l ??= new Headers() });
  }
  set res(e11) {
    if (this.#a && e11) {
      e11 = fe(e11.body, e11);
      for (let [t3, n2] of this.#a.headers.entries()) if (t3 !== "content-type") if (t3 === "set-cookie") {
        let t4 = this.#a.headers.getSetCookie();
        e11.headers.delete("set-cookie");
        for (let n3 of t4) e11.headers.append("set-cookie", n3);
      } else e11.headers.set(t3, n2);
    }
    this.#a = e11, this.finalized = true;
  }
  render = /* @__PURE__ */ __name((...e11) => (this.#s ??= (e12) => this.html(e12), this.#s(...e11)), "render");
  setLayout = /* @__PURE__ */ __name((e11) => this.#o = e11, "setLayout");
  getLayout = /* @__PURE__ */ __name(() => this.#o, "getLayout");
  setRenderer = /* @__PURE__ */ __name((e11) => {
    this.#s = e11;
  }, "setRenderer");
  header = /* @__PURE__ */ __name((e11, t3, n2) => {
    this.finalized && (this.#a = fe(this.#a.body, this.#a));
    let r2 = this.#a ? this.#a.headers : this.#l ??= new Headers();
    t3 === void 0 ? r2.delete(e11) : n2?.append ? r2.append(e11, t3) : r2.set(e11, t3);
  }, "header");
  status = /* @__PURE__ */ __name((e11) => {
    this.#r = e11;
  }, "status");
  set = /* @__PURE__ */ __name((e11, t3) => {
    this.#n ??= /* @__PURE__ */ new Map(), this.#n.set(e11, t3);
  }, "set");
  get = /* @__PURE__ */ __name((e11) => this.#n ? this.#n.get(e11) : void 0, "get");
  get var() {
    return this.#n ? Object.fromEntries(this.#n) : {};
  }
  #f(e11, t3, n2) {
    let r2 = this.#a ? new Headers(this.#a.headers) : this.#l ?? new Headers();
    if (typeof t3 == "object" && "headers" in t3) {
      let e12 = t3.headers instanceof Headers ? t3.headers : new Headers(t3.headers);
      for (let [t4, n3] of e12) t4.toLowerCase() === "set-cookie" ? r2.append(t4, n3) : r2.set(t4, n3);
    }
    if (n2) for (let [e12, t4] of Object.entries(n2)) if (typeof t4 == "string") r2.set(e12, t4);
    else {
      r2.delete(e12);
      for (let n3 of t4) r2.append(e12, n3);
    }
    return fe(e11, {
      status: typeof t3 == "number" ? t3 : t3?.status ?? this.#r,
      headers: r2
    });
  }
  newResponse = /* @__PURE__ */ __name((...e11) => this.#f(...e11), "newResponse");
  body = /* @__PURE__ */ __name((e11, t3, n2) => this.#f(e11, t3, n2), "body");
  text = /* @__PURE__ */ __name((e11, t3, n2) => !this.#l && !this.#r && !t3 && !n2 && !this.finalized ? new Response(e11) : this.#f(e11, t3, de(ue, n2)), "text");
  json = /* @__PURE__ */ __name((e11, t3, n2) => this.#f(JSON.stringify(e11), t3, de("application/json", n2)), "json");
  html = /* @__PURE__ */ __name((e11, t3, n2) => {
    let r2 = /* @__PURE__ */ __name((e12) => this.#f(e12, t3, de("text/html; charset=UTF-8", n2)), "r");
    return typeof e11 == "object" ? le(e11, se.Stringify, false, {}).then(r2) : r2(e11);
  }, "html");
  redirect = /* @__PURE__ */ __name((e11, t3) => {
    let n2 = String(e11);
    return this.header("Location", /[^\x00-\xFF]/.test(n2) ? encodeURI(n2) : n2), this.newResponse(null, t3 ?? 302);
  }, "redirect");
  notFound = /* @__PURE__ */ __name(() => (this.#c ??= () => fe(), this.#c(this)), "notFound");
};
var me = [
  "get",
  "post",
  "put",
  "delete",
  "options",
  "patch"
];
var he = "Can not add a route since the matcher is already built.";
var ge = class extends Error {
  static {
    __name(this, "ge");
  }
};
var _e = "__COMPOSED_HANDLER";
var ve = /* @__PURE__ */ __name((e11) => e11.text("404 Not Found", 404), "ve");
var ye = /* @__PURE__ */ __name((e11, t3) => {
  if ("getResponse" in e11) {
    let n2 = e11.getResponse();
    return t3.newResponse(n2.body, n2);
  }
  return console.error(e11), t3.text("Internal Server Error", 500);
}, "ye");
var be = class t2 {
  static {
    __name(this, "t");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #e = "/";
  routes = [];
  constructor(e11 = {}) {
    [...me, "all"].forEach((e12) => {
      this[e12] = (t4, ...n3) => (typeof t4 == "string" ? this.#e = t4 : this.#r(e12, this.#e, t4), n3.forEach((t5) => {
        this.#r(e12, this.#e, t5);
      }), this);
    }), this.on = (e12, t4, ...n3) => {
      for (let r2 of [t4].flat()) {
        this.#e = r2;
        for (let t5 of [e12].flat()) n3.map((e13) => {
          this.#r(t5.toUpperCase(), this.#e, e13);
        });
      }
      return this;
    }, this.use = (e12, ...t4) => (typeof e12 == "string" ? this.#e = e12 : (this.#e = "*", t4.unshift(e12)), t4.forEach((e13) => {
      this.#r("ALL", this.#e, e13);
    }), this);
    let { strict: t3, ...n2 } = e11;
    Object.assign(this, n2), this.getPath = t3 ?? true ? e11.getPath ?? h : g;
  }
  #t() {
    let e11 = new t2({
      router: this.router,
      getPath: this.getPath
    });
    return e11.errorHandler = this.errorHandler, e11.#n = this.#n, e11.routes = this.routes, e11;
  }
  #n = ve;
  errorHandler = ye;
  route(t3, n2) {
    let r2 = this.basePath(t3);
    return n2.routes.map((t4) => {
      let i2;
      n2.errorHandler === ye ? i2 = t4.handler : (i2 = /* @__PURE__ */ __name(async (r3, i3) => (await e([], n2.errorHandler)(r3, () => t4.handler(r3, i3))).res, "i"), i2[_e] = t4.handler), r2.#r(t4.method, t4.path, i2);
    }), this;
  }
  basePath(e11) {
    let t3 = this.#t();
    return t3._basePath = _(this._basePath, e11), t3;
  }
  onError = /* @__PURE__ */ __name((e11) => (this.errorHandler = e11, this), "onError");
  notFound = /* @__PURE__ */ __name((e11) => (this.#n = e11, this), "notFound");
  mount(e11, t3, n2) {
    let r2, i2;
    n2 && (typeof n2 == "function" ? i2 = n2 : (i2 = n2.optionHandler, r2 = n2.replaceRequest === false ? (e12) => e12 : n2.replaceRequest));
    let a2 = i2 ? (e12) => {
      let t4 = i2(e12);
      return Array.isArray(t4) ? t4 : [t4];
    } : (e12) => {
      let t4;
      try {
        t4 = e12.executionCtx;
      } catch {
      }
      return [e12.env, t4];
    };
    return r2 ||= (() => {
      let t4 = _(this._basePath, e11), n3 = t4 === "/" ? 0 : t4.length;
      return (e12) => {
        let t5 = new URL(e12.url);
        return t5.pathname = t5.pathname.slice(n3) || "/", new Request(t5, e12);
      };
    })(), this.#r("ALL", _(e11, "*"), async (e12, n3) => {
      let i3 = await t3(r2(e12.req.raw), ...a2(e12));
      if (i3) return i3;
      await n3();
    }), this;
  }
  #r(e11, t3, n2) {
    e11 = e11.toUpperCase(), t3 = _(this._basePath, t3);
    let r2 = {
      basePath: this._basePath,
      path: t3,
      method: e11,
      handler: n2
    };
    this.router.add(e11, t3, [n2, r2]), this.routes.push(r2);
  }
  #i(e11, t3) {
    if (e11 instanceof Error) return this.errorHandler(e11, t3);
    throw e11;
  }
  #a(t3, n2, r2, i2) {
    if (i2 === "HEAD") return (async () => new Response(null, await this.#a(t3, n2, r2, "GET")))();
    let a2 = this.getPath(t3, { env: r2 }), o2 = this.router.match(i2, a2), s2 = new pe(t3, {
      path: a2,
      matchResult: o2,
      env: r2,
      executionCtx: n2,
      notFoundHandler: this.#n
    });
    if (o2[0].length === 1) {
      let e11;
      try {
        e11 = o2[0][0][0][0](s2, async () => {
          s2.res = await this.#n(s2);
        });
      } catch (e12) {
        return this.#i(e12, s2);
      }
      return e11 instanceof Promise ? e11.then((e12) => e12 || (s2.finalized ? s2.res : this.#n(s2))).catch((e12) => this.#i(e12, s2)) : e11 ?? this.#n(s2);
    }
    let c2 = e(o2[0], this.errorHandler, this.#n);
    return (async () => {
      try {
        let e11 = await c2(s2);
        if (!e11.finalized) throw Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
        return e11.res;
      } catch (e11) {
        return this.#i(e11, s2);
      }
    })();
  }
  fetch = /* @__PURE__ */ __name((e11, ...t3) => this.#a(e11, t3[1], t3[0], e11.method), "fetch");
  request = /* @__PURE__ */ __name((e11, t3, n2, r2) => e11 instanceof Request ? this.fetch(t3 ? new Request(e11, t3) : e11, n2, r2) : (e11 = e11.toString(), this.fetch(new Request(/^https?:\/\//.test(e11) ? e11 : `http://localhost${_("/", e11)}`, t3), n2, r2)), "request");
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (e11) => {
      e11.respondWith(this.#a(e11.request, e11, void 0, e11.request.method));
    });
  }, "fire");
};
var xe = [];
function Se(e11, t3) {
  let n2 = this.buildAllMatchers(), r2 = /* @__PURE__ */ __name(((e12, t4) => {
    let r3 = n2[e12] || n2.ALL, i2 = r3[2][t4];
    if (i2) return i2;
    let a2 = t4.match(r3[0]);
    if (!a2) return [[], xe];
    let o2 = a2.indexOf("", 1);
    return [r3[1][o2], a2];
  }), "r");
  return this.match = r2, r2(e11, t3);
}
__name(Se, "Se");
var Ce = "[^/]+";
var we = ".*";
var y = "(?:|/.*)";
var Te = /* @__PURE__ */ Symbol();
var Ee = /* @__PURE__ */ new Set(".\\+*[^]$()");
function De(e11, t3) {
  return e11.length === 1 ? t3.length === 1 ? e11 < t3 ? -1 : 1 : -1 : t3.length === 1 || e11 === we || e11 === y ? 1 : t3 === we || t3 === y ? -1 : e11 === Ce ? 1 : t3 === Ce ? -1 : e11.length === t3.length ? e11 < t3 ? -1 : 1 : t3.length - e11.length;
}
__name(De, "De");
var Oe = class e2 {
  static {
    __name(this, "e");
  }
  #e;
  #t;
  #n = /* @__PURE__ */ Object.create(null);
  insert(t3, n2, r2, i2, a2) {
    if (t3.length === 0) {
      if (this.#e !== void 0) throw Te;
      if (a2) return;
      this.#e = n2;
      return;
    }
    let [o2, ...s2] = t3, c2 = o2 === "*" ? s2.length === 0 ? [
      "",
      "",
      we
    ] : [
      "",
      "",
      Ce
    ] : o2 === "/*" ? [
      "",
      "",
      y
    ] : o2.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/), l2;
    if (c2) {
      let t4 = c2[1], n3 = c2[2] || Ce;
      if (t4 && c2[2] && (n3 === ".*" || (n3 = n3.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(n3)))) throw Te;
      if (l2 = this.#n[n3], !l2) {
        if (Object.keys(this.#n).some((e11) => e11 !== we && e11 !== y)) throw Te;
        if (a2) return;
        l2 = this.#n[n3] = new e2(), t4 !== "" && (l2.#t = i2.varIndex++);
      }
      !a2 && t4 !== "" && r2.push([t4, l2.#t]);
    } else if (l2 = this.#n[o2], !l2) {
      if (Object.keys(this.#n).some((e11) => e11.length > 1 && e11 !== we && e11 !== y)) throw Te;
      if (a2) return;
      l2 = this.#n[o2] = new e2();
    }
    l2.insert(s2, n2, r2, i2, a2);
  }
  buildRegExpStr() {
    let e11 = Object.keys(this.#n).sort(De).map((e12) => {
      let t3 = this.#n[e12];
      return (typeof t3.#t == "number" ? `(${e12})@${t3.#t}` : Ee.has(e12) ? `\\${e12}` : e12) + t3.buildRegExpStr();
    });
    return typeof this.#e == "number" && e11.unshift(`#${this.#e}`), e11.length === 0 ? "" : e11.length === 1 ? e11[0] : "(?:" + e11.join("|") + ")";
  }
};
var ke = class {
  static {
    __name(this, "ke");
  }
  #e = { varIndex: 0 };
  #t = new Oe();
  insert(e11, t3, n2) {
    let r2 = [], i2 = [];
    for (let t4 = 0; ; ) {
      let n3 = false;
      if (e11 = e11.replace(/\{[^}]+\}/g, (e12) => {
        let r3 = `@\\${t4}`;
        return i2[t4] = [r3, e12], t4++, n3 = true, r3;
      }), !n3) break;
    }
    let a2 = e11.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let e12 = i2.length - 1; e12 >= 0; e12--) {
      let [t4] = i2[e12];
      for (let n3 = a2.length - 1; n3 >= 0; n3--) if (a2[n3].indexOf(t4) !== -1) {
        a2[n3] = a2[n3].replace(t4, i2[e12][1]);
        break;
      }
    }
    return this.#t.insert(a2, t3, r2, this.#e, n2), r2;
  }
  buildRegExp() {
    let e11 = this.#t.buildRegExpStr();
    if (e11 === "") return [
      /^$/,
      [],
      []
    ];
    let t3 = 0, n2 = [], r2 = [];
    return e11 = e11.replace(/#(\d+)|@(\d+)|\.\*\$/g, (e12, i2, a2) => i2 === void 0 ? (a2 === void 0 || (r2[Number(a2)] = ++t3), "") : (n2[++t3] = Number(i2), "$()")), [
      RegExp(`^${e11}`),
      n2,
      r2
    ];
  }
};
var Ae = [
  /^$/,
  [],
  /* @__PURE__ */ Object.create(null)
];
var je = /* @__PURE__ */ Object.create(null);
function Me(e11) {
  return je[e11] ??= RegExp(e11 === "*" ? "" : `^${e11.replace(/\/\*$|([.\\+*[^\]$()])/g, (e12, t3) => t3 ? `\\${t3}` : "(?:|/.*)")}$`);
}
__name(Me, "Me");
function Ne() {
  je = /* @__PURE__ */ Object.create(null);
}
__name(Ne, "Ne");
function Pe(e11) {
  let t3 = new ke(), n2 = [];
  if (e11.length === 0) return Ae;
  let r2 = e11.map((e12) => [!/\*|\/:/.test(e12[0]), ...e12]).sort(([e12, t4], [n3, r3]) => e12 ? 1 : n3 ? -1 : t4.length - r3.length), i2 = /* @__PURE__ */ Object.create(null);
  for (let e12 = 0, a3 = -1, o3 = r2.length; e12 < o3; e12++) {
    let [o4, s3, c3] = r2[e12];
    o4 ? i2[s3] = [c3.map(([e13]) => [e13, /* @__PURE__ */ Object.create(null)]), xe] : a3++;
    let l2;
    try {
      l2 = t3.insert(s3, a3, o4);
    } catch (e13) {
      throw e13 === Te ? new ge(s3) : e13;
    }
    o4 || (n2[a3] = c3.map(([e13, t4]) => {
      let n3 = /* @__PURE__ */ Object.create(null);
      for (--t4; t4 >= 0; t4--) {
        let [e14, r3] = l2[t4];
        n3[e14] = r3;
      }
      return [e13, n3];
    }));
  }
  let [a2, o2, s2] = t3.buildRegExp();
  for (let e12 = 0, t4 = n2.length; e12 < t4; e12++) for (let t5 = 0, r3 = n2[e12].length; t5 < r3; t5++) {
    let r4 = n2[e12][t5]?.[1];
    if (!r4) continue;
    let i3 = Object.keys(r4);
    for (let e13 = 0, t6 = i3.length; e13 < t6; e13++) r4[i3[e13]] = s2[r4[i3[e13]]];
  }
  let c2 = [];
  for (let e12 in o2) c2[e12] = n2[o2[e12]];
  return [
    a2,
    c2,
    i2
  ];
}
__name(Pe, "Pe");
function b(e11, t3) {
  if (e11) {
    for (let n2 of Object.keys(e11).sort((e12, t4) => t4.length - e12.length)) if (Me(n2).test(t3)) return [...e11[n2]];
  }
}
__name(b, "b");
var Fe = class {
  static {
    __name(this, "Fe");
  }
  name = "RegExpRouter";
  #e;
  #t;
  constructor() {
    this.#e = { ALL: /* @__PURE__ */ Object.create(null) }, this.#t = { ALL: /* @__PURE__ */ Object.create(null) };
  }
  add(e11, t3, n2) {
    let r2 = this.#e, i2 = this.#t;
    if (!r2 || !i2) throw Error(he);
    r2[e11] || [r2, i2].forEach((t4) => {
      t4[e11] = /* @__PURE__ */ Object.create(null), Object.keys(t4.ALL).forEach((n3) => {
        t4[e11][n3] = [...t4.ALL[n3]];
      });
    }), t3 === "/*" && (t3 = "*");
    let a2 = (t3.match(/\/:/g) || []).length;
    if (/\*$/.test(t3)) {
      let o3 = Me(t3);
      e11 === "ALL" ? Object.keys(r2).forEach((e12) => {
        r2[e12][t3] ||= b(r2[e12], t3) || b(r2.ALL, t3) || [];
      }) : r2[e11][t3] ||= b(r2[e11], t3) || b(r2.ALL, t3) || [], Object.keys(r2).forEach((t4) => {
        (e11 === "ALL" || e11 === t4) && Object.keys(r2[t4]).forEach((e12) => {
          o3.test(e12) && r2[t4][e12].push([n2, a2]);
        });
      }), Object.keys(i2).forEach((t4) => {
        (e11 === "ALL" || e11 === t4) && Object.keys(i2[t4]).forEach((e12) => o3.test(e12) && i2[t4][e12].push([n2, a2]));
      });
      return;
    }
    let o2 = v(t3) || [t3];
    for (let t4 = 0, s2 = o2.length; t4 < s2; t4++) {
      let c2 = o2[t4];
      Object.keys(i2).forEach((o3) => {
        (e11 === "ALL" || e11 === o3) && (i2[o3][c2] ||= [...b(r2[o3], c2) || b(r2.ALL, c2) || []], i2[o3][c2].push([n2, a2 - s2 + t4 + 1]));
      });
    }
  }
  match = Se;
  buildAllMatchers() {
    let e11 = /* @__PURE__ */ Object.create(null);
    return Object.keys(this.#t).concat(Object.keys(this.#e)).forEach((t3) => {
      e11[t3] ||= this.#n(t3);
    }), this.#e = this.#t = void 0, Ne(), e11;
  }
  #n(e11) {
    let t3 = [], n2 = e11 === "ALL";
    return [this.#e, this.#t].forEach((r2) => {
      let i2 = r2[e11] ? Object.keys(r2[e11]).map((t4) => [t4, r2[e11][t4]]) : [];
      i2.length === 0 ? e11 !== "ALL" && t3.push(...Object.keys(r2.ALL).map((e12) => [e12, r2.ALL[e12]])) : (n2 ||= true, t3.push(...i2));
    }), n2 ? Pe(t3) : null;
  }
};
var Ie = class {
  static {
    __name(this, "Ie");
  }
  name = "SmartRouter";
  #e = [];
  #t = [];
  constructor(e11) {
    this.#e = e11.routers;
  }
  add(e11, t3, n2) {
    if (!this.#t) throw Error(he);
    this.#t.push([
      e11,
      t3,
      n2
    ]);
  }
  match(e11, t3) {
    if (!this.#t) throw Error("Fatal error");
    let n2 = this.#e, r2 = this.#t, i2 = n2.length, a2 = 0, o2;
    for (; a2 < i2; a2++) {
      let i3 = n2[a2];
      try {
        for (let e12 = 0, t4 = r2.length; e12 < t4; e12++) i3.add(...r2[e12]);
        o2 = i3.match(e11, t3);
      } catch (e12) {
        if (e12 instanceof ge) continue;
        throw e12;
      }
      this.match = i3.match.bind(i3), this.#e = [i3], this.#t = void 0;
      break;
    }
    if (a2 === i2) throw Error("Fatal error");
    return this.name = `SmartRouter + ${this.activeRouter.name}`, o2;
  }
  get activeRouter() {
    if (this.#t || this.#e.length !== 1) throw Error("No active router has been determined yet.");
    return this.#e[0];
  }
};
var Le = /* @__PURE__ */ Object.create(null);
var Re = /* @__PURE__ */ __name((e11) => {
  for (let t3 in e11) return true;
  return false;
}, "Re");
var ze = class e3 {
  static {
    __name(this, "e");
  }
  #e;
  #t;
  #n;
  #r = 0;
  #i = Le;
  constructor(e11, t3, n2) {
    if (this.#t = n2 || /* @__PURE__ */ Object.create(null), this.#e = [], e11 && t3) {
      let n3 = /* @__PURE__ */ Object.create(null);
      n3[e11] = {
        handler: t3,
        possibleKeys: [],
        score: 0
      }, this.#e = [n3];
    }
    this.#n = [];
  }
  insert(t3, n2, r2) {
    this.#r = ++this.#r;
    let i2 = this, a2 = c(n2), o2 = [];
    for (let t4 = 0, n3 = a2.length; t4 < n3; t4++) {
      let n4 = a2[t4], r3 = a2[t4 + 1], s2 = f(n4, r3), c2 = Array.isArray(s2) ? s2[0] : n4;
      if (c2 in i2.#t) {
        i2 = i2.#t[c2], s2 && o2.push(s2[1]);
        continue;
      }
      i2.#t[c2] = new e3(), s2 && (i2.#n.push(s2), o2.push(s2[1])), i2 = i2.#t[c2];
    }
    return i2.#e.push({ [t3]: {
      handler: r2,
      possibleKeys: o2.filter((e11, t4, n3) => n3.indexOf(e11) === t4),
      score: this.#r
    } }), i2;
  }
  #a(e11, t3, n2, r2, i2) {
    for (let a2 = 0, o2 = t3.#e.length; a2 < o2; a2++) {
      let o3 = t3.#e[a2], s2 = o3[n2] || o3.ALL, c2 = {};
      if (s2 !== void 0 && (s2.params = /* @__PURE__ */ Object.create(null), e11.push(s2), r2 !== Le || i2 && i2 !== Le)) for (let e12 = 0, t4 = s2.possibleKeys.length; e12 < t4; e12++) {
        let t5 = s2.possibleKeys[e12], n3 = c2[s2.score];
        s2.params[t5] = i2?.[t5] && !n3 ? i2[t5] : r2[t5] ?? i2?.[t5], c2[s2.score] = true;
      }
    }
  }
  search(e11, t3) {
    let n2 = [];
    this.#i = Le;
    let r2 = [this], i2 = s(t3), a2 = [], o2 = i2.length, c2 = null;
    for (let s2 = 0; s2 < o2; s2++) {
      let l2 = i2[s2], u2 = s2 === o2 - 1, d2 = [];
      for (let f3 = 0, p2 = r2.length; f3 < p2; f3++) {
        let p3 = r2[f3], m2 = p3.#t[l2];
        m2 && (m2.#i = p3.#i, u2 ? (m2.#t["*"] && this.#a(n2, m2.#t["*"], e11, p3.#i), this.#a(n2, m2, e11, p3.#i)) : d2.push(m2));
        for (let r3 = 0, f4 = p3.#n.length; r3 < f4; r3++) {
          let f5 = p3.#n[r3], m3 = p3.#i === Le ? {} : { ...p3.#i };
          if (f5 === "*") {
            let t4 = p3.#t["*"];
            t4 && (this.#a(n2, t4, e11, p3.#i), t4.#i = m3, d2.push(t4));
            continue;
          }
          let [h2, g2, _2] = f5;
          if (!l2 && !(_2 instanceof RegExp)) continue;
          let v2 = p3.#t[h2];
          if (_2 instanceof RegExp) {
            if (c2 === null) {
              c2 = Array(o2);
              let e12 = +(t3[0] === "/");
              for (let t4 = 0; t4 < o2; t4++) c2[t4] = e12, e12 += i2[t4].length + 1;
            }
            let r4 = t3.substring(c2[s2]), l3 = _2.exec(r4);
            if (l3) {
              if (m3[g2] = l3[0], this.#a(n2, v2, e11, p3.#i, m3), Re(v2.#t)) {
                v2.#i = m3;
                let e12 = l3[0].match(/\//)?.length ?? 0;
                (a2[e12] ||= []).push(v2);
              }
              continue;
            }
          }
          (_2 === true || _2.test(l2)) && (m3[g2] = l2, u2 ? (this.#a(n2, v2, e11, m3, p3.#i), v2.#t["*"] && this.#a(n2, v2.#t["*"], e11, m3, p3.#i)) : (v2.#i = m3, d2.push(v2)));
        }
      }
      let f2 = a2.shift();
      r2 = f2 ? d2.concat(f2) : d2;
    }
    return n2.length > 1 && n2.sort((e12, t4) => e12.score - t4.score), [n2.map(({ handler: e12, params: t4 }) => [e12, t4])];
  }
};
var Be = class {
  static {
    __name(this, "Be");
  }
  name = "TrieRouter";
  #e;
  constructor() {
    this.#e = new ze();
  }
  add(e11, t3, n2) {
    let r2 = v(t3);
    if (r2) {
      for (let t4 = 0, i2 = r2.length; t4 < i2; t4++) this.#e.insert(e11, r2[t4], n2);
      return;
    }
    this.#e.insert(e11, t3, n2);
  }
  match(e11, t3) {
    return this.#e.search(e11, t3);
  }
};
var Ve = class extends be {
  static {
    __name(this, "Ve");
  }
  constructor(e11 = {}) {
    super(e11), this.router = e11.router ?? new Ie({ routers: [new Fe(), new Be()] });
  }
};
function He() {
  let { process: e11, Deno: t3 } = globalThis;
  return !(typeof t3?.noColor == "boolean" ? t3.noColor : e11 !== void 0 && "NO_COLOR" in e11?.env);
}
__name(He, "He");
async function Ue() {
  let { navigator: e11 } = globalThis;
  return !(e11 !== void 0 && e11.userAgent === "Cloudflare-Workers" ? await (async () => {
    try {
      return "NO_COLOR" in ((await import("cloudflare:workers")).env ?? {});
    } catch {
      return false;
    }
  })() : !He());
}
__name(Ue, "Ue");
var We = /* @__PURE__ */ __name((e11) => {
  let [t3, n2] = [",", "."];
  return e11.map((e12) => e12.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + t3)).join(n2);
}, "We");
var Ge = /* @__PURE__ */ __name((e11) => {
  let t3 = Date.now() - e11;
  return We([t3 < 1e3 ? t3 + "ms" : Math.round(t3 / 1e3) + "s"]);
}, "Ge");
var Ke = /* @__PURE__ */ __name(async (e11) => {
  if (await Ue()) switch (e11 / 100 | 0) {
    case 5:
      return `\x1B[31m${e11}\x1B[0m`;
    case 4:
      return `\x1B[33m${e11}\x1B[0m`;
    case 3:
      return `\x1B[36m${e11}\x1B[0m`;
    case 2:
      return `\x1B[32m${e11}\x1B[0m`;
  }
  return `${e11}`;
}, "Ke");
async function qe(e11, t3, n2, r2, i2 = 0, a2) {
  e11(t3 === "<--" ? `${t3} ${n2} ${r2}` : `${t3} ${n2} ${r2} ${await Ke(i2)} ${a2}`);
}
__name(qe, "qe");
var Je = /* @__PURE__ */ __name((e11 = console.log) => async function(t3, n2) {
  let { method: r2, url: i2 } = t3.req, a2 = i2.slice(i2.indexOf("/", 8));
  await qe(e11, "<--", r2, a2);
  let o2 = Date.now();
  await n2(), await qe(e11, "-->", r2, a2, t3.res.status, Ge(o2));
}, "Je");
var Ye = /* @__PURE__ */ __name((e11) => Qe(e11.replace(/_|-/g, (e12) => ({
  _: "/",
  "-": "+"
})[e12] ?? e12)), "Ye");
var Xe = /* @__PURE__ */ __name((e11) => Ze(e11).replace(/\/|\+/g, (e12) => ({
  "/": "_",
  "+": "-"
})[e12] ?? e12), "Xe");
var Ze = /* @__PURE__ */ __name((e11) => {
  let t3 = "", n2 = new Uint8Array(e11);
  for (let e12 = 0, r2 = n2.length; e12 < r2; e12++) t3 += String.fromCharCode(n2[e12]);
  return btoa(t3);
}, "Ze");
var Qe = /* @__PURE__ */ __name((e11) => {
  let t3 = atob(e11), n2 = new Uint8Array(new ArrayBuffer(t3.length)), r2 = t3.length / 2;
  for (let e12 = 0, i2 = t3.length - 1; e12 <= r2; e12++, i2--) n2[e12] = t3.charCodeAt(e12), n2[i2] = t3.charCodeAt(i2);
  return n2;
}, "Qe");
var x = /* @__PURE__ */ ((e11) => (e11.HS256 = "HS256", e11.HS384 = "HS384", e11.HS512 = "HS512", e11.RS256 = "RS256", e11.RS384 = "RS384", e11.RS512 = "RS512", e11.PS256 = "PS256", e11.PS384 = "PS384", e11.PS512 = "PS512", e11.ES256 = "ES256", e11.ES384 = "ES384", e11.ES512 = "ES512", e11.EdDSA = "EdDSA", e11))(x || {});
var $e = {
  deno: "Deno",
  bun: "Bun",
  workerd: "Cloudflare-Workers",
  node: "Node.js"
};
var et = /* @__PURE__ */ __name(() => {
  let e11 = globalThis;
  if (typeof navigator < "u" && true) {
    for (let [e12, t3] of Object.entries($e)) if (tt(t3)) return e12;
  }
  return typeof e11?.EdgeRuntime == "string" ? "edge-light" : e11?.fastly === void 0 ? e11?.process?.release?.name === "node" ? "node" : "other" : "fastly";
}, "et");
var tt = /* @__PURE__ */ __name((e11) => "Cloudflare-Workers".startsWith(e11), "tt");
var nt = class extends Error {
  static {
    __name(this, "nt");
  }
  constructor(e11) {
    super(`${e11} is not an implemented algorithm`), this.name = "JwtAlgorithmNotImplemented";
  }
};
var rt = class extends Error {
  static {
    __name(this, "rt");
  }
  constructor() {
    super('JWT verification requires "alg" option to be specified'), this.name = "JwtAlgorithmRequired";
  }
};
var it = class extends Error {
  static {
    __name(this, "it");
  }
  constructor(e11, t3) {
    super(`JWT algorithm mismatch: expected "${e11}", got "${t3}"`), this.name = "JwtAlgorithmMismatch";
  }
};
var S = class extends Error {
  static {
    __name(this, "S");
  }
  constructor(e11) {
    super(`invalid JWT token: ${e11}`), this.name = "JwtTokenInvalid";
  }
};
var at = class extends Error {
  static {
    __name(this, "at");
  }
  constructor(e11) {
    super(`token (${e11}) is being used before it's valid`), this.name = "JwtTokenNotBefore";
  }
};
var ot = class extends Error {
  static {
    __name(this, "ot");
  }
  constructor(e11) {
    super(`token (${e11}) expired`), this.name = "JwtTokenExpired";
  }
};
var st = class extends Error {
  static {
    __name(this, "st");
  }
  constructor(e11, t3) {
    super(`Invalid "iat" claim, must be a valid number lower than "${e11}" (iat: "${t3}")`), this.name = "JwtTokenIssuedAt";
  }
};
var ct = class extends Error {
  static {
    __name(this, "ct");
  }
  constructor(e11, t3) {
    super(`expected issuer "${e11}", got ${t3 ? `"${t3}"` : "none"} `), this.name = "JwtTokenIssuer";
  }
};
var lt = class extends Error {
  static {
    __name(this, "lt");
  }
  constructor(e11) {
    super(`jwt header is invalid: ${JSON.stringify(e11)}`), this.name = "JwtHeaderInvalid";
  }
};
var ut = class extends Error {
  static {
    __name(this, "ut");
  }
  constructor(e11) {
    super(`required "kid" in jwt header: ${JSON.stringify(e11)}`), this.name = "JwtHeaderRequiresKid";
  }
};
var dt = class extends Error {
  static {
    __name(this, "dt");
  }
  constructor(e11) {
    super(`symmetric algorithm "${e11}" is not allowed for JWK verification`), this.name = "JwtSymmetricAlgorithmNotAllowed";
  }
};
var ft = class extends Error {
  static {
    __name(this, "ft");
  }
  constructor(e11, t3) {
    super(`algorithm "${e11}" is not in the allowed list: [${t3.join(", ")}]`), this.name = "JwtAlgorithmNotAllowed";
  }
};
var pt = class extends Error {
  static {
    __name(this, "pt");
  }
  constructor(e11) {
    super(`token(${e11}) signature mismatched`), this.name = "JwtTokenSignatureMismatched";
  }
};
var mt = class extends Error {
  static {
    __name(this, "mt");
  }
  constructor(e11) {
    super(`required "aud" in jwt payload: ${JSON.stringify(e11)}`), this.name = "JwtPayloadRequiresAud";
  }
};
var ht = class extends Error {
  static {
    __name(this, "ht");
  }
  constructor(e11, t3) {
    super(`expected audience "${Array.isArray(e11) ? e11.join(", ") : e11}", got "${t3}"`), this.name = "JwtTokenAudience";
  }
};
var gt = /* @__PURE__ */ ((e11) => (e11.Encrypt = "encrypt", e11.Decrypt = "decrypt", e11.Sign = "sign", e11.Verify = "verify", e11.DeriveKey = "deriveKey", e11.DeriveBits = "deriveBits", e11.WrapKey = "wrapKey", e11.UnwrapKey = "unwrapKey", e11))(gt || {});
var _t = new TextEncoder();
var vt = new TextDecoder();
async function yt(e11, t3, n2) {
  let r2 = Tt(t3), i2 = await St(e11, r2);
  return await crypto.subtle.sign(r2, i2, n2);
}
__name(yt, "yt");
async function bt(e11, t3, n2, r2) {
  let i2 = Tt(t3), a2 = await Ct(e11, i2);
  return await crypto.subtle.verify(i2, a2, n2, r2);
}
__name(bt, "bt");
function xt(e11) {
  return Qe(e11.replace(/-+(BEGIN|END).*/g, "").replace(/\s/g, ""));
}
__name(xt, "xt");
async function St(e11, t3) {
  if (!crypto.subtle || !crypto.subtle.importKey) throw Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  if (Et(e11)) {
    if (e11.type !== "private" && e11.type !== "secret") throw Error(`unexpected key type: CryptoKey.type is ${e11.type}, expected private or secret`);
    return e11;
  }
  let n2 = [gt.Sign];
  return typeof e11 == "object" ? await crypto.subtle.importKey("jwk", e11, t3, false, n2) : e11.includes("PRIVATE") ? await crypto.subtle.importKey("pkcs8", xt(e11), t3, false, n2) : await crypto.subtle.importKey("raw", _t.encode(e11), t3, false, n2);
}
__name(St, "St");
async function Ct(e11, t3) {
  if (!crypto.subtle || !crypto.subtle.importKey) throw Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  if (Et(e11)) {
    if (e11.type === "public" || e11.type === "secret") return e11;
    e11 = await wt(e11);
  }
  typeof e11 == "string" && e11.includes("PRIVATE") && (e11 = await wt(await crypto.subtle.importKey("pkcs8", xt(e11), t3, true, [gt.Sign])));
  let n2 = [gt.Verify];
  return typeof e11 == "object" ? await crypto.subtle.importKey("jwk", e11, t3, false, n2) : e11.includes("PUBLIC") ? await crypto.subtle.importKey("spki", xt(e11), t3, false, n2) : await crypto.subtle.importKey("raw", _t.encode(e11), t3, false, n2);
}
__name(Ct, "Ct");
async function wt(e11) {
  if (e11.type !== "private") throw Error(`unexpected key type: ${e11.type}`);
  if (!e11.extractable) throw Error("unexpected private key is unextractable");
  let t3 = await crypto.subtle.exportKey("jwk", e11), { kty: n2 } = t3, { alg: r2, e: i2, n: a2 } = t3, { crv: o2, x: s2, y: c2 } = t3;
  return {
    kty: n2,
    alg: r2,
    e: i2,
    n: a2,
    crv: o2,
    x: s2,
    y: c2,
    key_ops: [gt.Verify]
  };
}
__name(wt, "wt");
function Tt(e11) {
  switch (e11) {
    case "HS256":
      return {
        name: "HMAC",
        hash: { name: "SHA-256" }
      };
    case "HS384":
      return {
        name: "HMAC",
        hash: { name: "SHA-384" }
      };
    case "HS512":
      return {
        name: "HMAC",
        hash: { name: "SHA-512" }
      };
    case "RS256":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" }
      };
    case "RS384":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-384" }
      };
    case "RS512":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-512" }
      };
    case "PS256":
      return {
        name: "RSA-PSS",
        hash: { name: "SHA-256" },
        saltLength: 32
      };
    case "PS384":
      return {
        name: "RSA-PSS",
        hash: { name: "SHA-384" },
        saltLength: 48
      };
    case "PS512":
      return {
        name: "RSA-PSS",
        hash: { name: "SHA-512" },
        saltLength: 64
      };
    case "ES256":
      return {
        name: "ECDSA",
        hash: { name: "SHA-256" },
        namedCurve: "P-256"
      };
    case "ES384":
      return {
        name: "ECDSA",
        hash: { name: "SHA-384" },
        namedCurve: "P-384"
      };
    case "ES512":
      return {
        name: "ECDSA",
        hash: { name: "SHA-512" },
        namedCurve: "P-521"
      };
    case "EdDSA":
      return {
        name: "Ed25519",
        namedCurve: "Ed25519"
      };
    default:
      throw new nt(e11);
  }
}
__name(Tt, "Tt");
function Et(e11) {
  return et() === "node" && crypto.webcrypto ? e11 instanceof crypto.webcrypto.CryptoKey : e11 instanceof CryptoKey;
}
__name(Et, "Et");
var Dt = /* @__PURE__ */ __name((e11) => Xe(_t.encode(JSON.stringify(e11)).buffer).replace(/=/g, ""), "Dt");
var Ot = /* @__PURE__ */ __name((e11) => Xe(e11).replace(/=/g, ""), "Ot");
var kt = /* @__PURE__ */ __name((e11) => JSON.parse(vt.decode(Ye(e11))), "kt");
function At(e11) {
  if (typeof e11 == "object" && e11) {
    let t3 = e11;
    return "alg" in t3 && Object.values(x).includes(t3.alg) && (!("typ" in t3) || t3.typ === "JWT");
  }
  return false;
}
__name(At, "At");
var jt = /* @__PURE__ */ __name(async (e11, t3, n2 = "HS256") => {
  let r2 = Dt(e11), i2;
  typeof t3 == "object" && "alg" in t3 ? (n2 = t3.alg, i2 = Dt({
    alg: n2,
    typ: "JWT",
    kid: t3.kid
  })) : i2 = Dt({
    alg: n2,
    typ: "JWT"
  });
  let a2 = `${i2}.${r2}`;
  return `${a2}.${Ot(await yt(t3, n2, _t.encode(a2)))}`;
}, "jt");
var Mt = /* @__PURE__ */ __name(async (e11, t3, n2) => {
  if (!n2) throw new rt();
  let { alg: r2, iss: i2, nbf: a2 = true, exp: o2 = true, iat: s2 = true, aud: c2 } = typeof n2 == "string" ? { alg: n2 } : n2;
  if (!r2) throw new rt();
  let l2 = e11.split(".");
  if (l2.length !== 3) throw new S(e11);
  let { header: u2, payload: d2 } = Ft(e11);
  if (!At(u2)) throw new lt(u2);
  if (u2.alg !== r2) throw new it(r2, u2.alg);
  let f2 = Math.floor(Date.now() / 1e3);
  if (a2 && d2.nbf && d2.nbf > f2) throw new at(e11);
  if (o2 && d2.exp && d2.exp <= f2) throw new ot(e11);
  if (s2 && d2.iat && f2 < d2.iat) throw new st(f2, d2.iat);
  if (i2) {
    if (!d2.iss) throw new ct(i2, null);
    if (typeof i2 == "string" && d2.iss !== i2 || i2 instanceof RegExp && !i2.test(d2.iss)) throw new ct(i2, d2.iss);
  }
  if (c2) {
    if (!d2.aud) throw new mt(d2);
    if (!(Array.isArray(d2.aud) ? d2.aud : [d2.aud]).some((e12) => c2 instanceof RegExp ? c2.test(e12) : typeof c2 == "string" ? e12 === c2 : Array.isArray(c2) && c2.includes(e12))) throw new ht(c2, d2.aud);
  }
  let p2 = e11.substring(0, e11.lastIndexOf("."));
  if (!await bt(t3, r2, Ye(l2[2]), _t.encode(p2))) throw new pt(e11);
  return d2;
}, "Mt");
var Nt = [
  x.HS256,
  x.HS384,
  x.HS512
];
var Pt = /* @__PURE__ */ __name(async (e11, t3, n2) => {
  let r2 = t3.verification || {}, i2 = It(e11);
  if (!At(i2)) throw new lt(i2);
  if (!i2.kid) throw new ut(i2);
  if (Nt.includes(i2.alg)) throw new dt(i2.alg);
  if (!t3.allowedAlgorithms.includes(i2.alg)) throw new ft(i2.alg, t3.allowedAlgorithms);
  let a2 = t3.keys ? [...t3.keys] : void 0;
  if (t3.jwks_uri) {
    let e12 = await fetch(t3.jwks_uri, n2);
    if (!e12.ok) throw Error(`failed to fetch JWKS from ${t3.jwks_uri}`);
    let r3 = await e12.json();
    if (!r3.keys) throw Error('invalid JWKS response. "keys" field is missing');
    if (!Array.isArray(r3.keys)) throw Error('invalid JWKS response. "keys" field is not an array');
    a2 ??= [], a2.push(...r3.keys);
  } else if (!a2) throw Error('verifyWithJwks requires options for either "keys" or "jwks_uri" or both');
  let o2 = a2.find((e12) => e12.kid === i2.kid);
  if (!o2) throw new S(e11);
  if (o2.alg && o2.alg !== i2.alg) throw new it(o2.alg, i2.alg);
  return await Mt(e11, o2, {
    alg: i2.alg,
    ...r2
  });
}, "Pt");
var Ft = /* @__PURE__ */ __name((e11) => {
  let t3 = e11.split(".");
  if (t3.length !== 3) throw new S(e11);
  try {
    return {
      header: kt(t3[0]),
      payload: kt(t3[1])
    };
  } catch {
    throw new S(e11);
  }
}, "Ft");
var It = /* @__PURE__ */ __name((e11) => {
  let t3 = e11.split(".");
  if (t3.length !== 3) throw new S(e11);
  try {
    return kt(t3[0]);
  } catch {
    throw new S(e11);
  }
}, "It");
var Lt = {
  sign: jt,
  verify: Mt,
  decode: Ft,
  verifyWithJwks: Pt
};
Lt.verifyWithJwks;
var Rt = Lt.verify;
Lt.decode;
var zt = Lt.sign;
var C = /* @__PURE__ */ Symbol.for("drizzle:entityKind");
function w(e11, t3) {
  if (!e11 || typeof e11 != "object") return false;
  if (e11 instanceof t3) return true;
  if (!Object.prototype.hasOwnProperty.call(t3, C)) throw Error(`Class "${t3.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`);
  let n2 = Object.getPrototypeOf(e11).constructor;
  if (n2) for (; n2; ) {
    if (C in n2 && n2[C] === t3[C]) return true;
    n2 = Object.getPrototypeOf(n2);
  }
  return false;
}
__name(w, "w");
var T = class {
  static {
    __name(this, "T");
  }
  constructor(e11, t3) {
    this.table = e11, this.config = t3, this.name = t3.name, this.keyAsName = t3.keyAsName, this.notNull = t3.notNull, this.default = t3.default, this.defaultFn = t3.defaultFn, this.onUpdateFn = t3.onUpdateFn, this.hasDefault = t3.hasDefault, this.primary = t3.primaryKey, this.isUnique = t3.isUnique, this.uniqueName = t3.uniqueName, this.uniqueType = t3.uniqueType, this.dataType = t3.dataType, this.columnType = t3.columnType, this.generated = t3.generated, this.generatedIdentity = t3.generatedIdentity;
  }
  static [C] = "Column";
  name;
  keyAsName;
  primary;
  notNull;
  default;
  defaultFn;
  onUpdateFn;
  hasDefault;
  isUnique;
  uniqueName;
  uniqueType;
  dataType;
  columnType;
  enumValues = void 0;
  generated = void 0;
  generatedIdentity = void 0;
  config;
  mapFromDriverValue(e11) {
    return e11;
  }
  mapToDriverValue(e11) {
    return e11;
  }
  shouldDisableInsert() {
    return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
  }
};
var Bt = class {
  static {
    __name(this, "Bt");
  }
  static [C] = "ColumnBuilder";
  config;
  constructor(e11, t3, n2) {
    this.config = {
      name: e11,
      keyAsName: e11 === "",
      notNull: false,
      default: void 0,
      hasDefault: false,
      primaryKey: false,
      isUnique: false,
      uniqueName: void 0,
      uniqueType: void 0,
      dataType: t3,
      columnType: n2,
      generated: void 0
    };
  }
  $type() {
    return this;
  }
  notNull() {
    return this.config.notNull = true, this;
  }
  default(e11) {
    return this.config.default = e11, this.config.hasDefault = true, this;
  }
  $defaultFn(e11) {
    return this.config.defaultFn = e11, this.config.hasDefault = true, this;
  }
  $default = this.$defaultFn;
  $onUpdateFn(e11) {
    return this.config.onUpdateFn = e11, this.config.hasDefault = true, this;
  }
  $onUpdate = this.$onUpdateFn;
  primaryKey() {
    return this.config.primaryKey = true, this.config.notNull = true, this;
  }
  setName(e11) {
    this.config.name === "" && (this.config.name = e11);
  }
};
var E = /* @__PURE__ */ Symbol.for("drizzle:Name");
var Vt = /* @__PURE__ */ Symbol.for("drizzle:isPgEnum");
function Ht(e11) {
  return !!e11 && typeof e11 == "function" && Vt in e11 && e11[Vt] === true;
}
__name(Ht, "Ht");
var D = class {
  static {
    __name(this, "D");
  }
  static [C] = "Subquery";
  constructor(e11, t3, n2, r2 = false, i2 = []) {
    this._ = {
      brand: "Subquery",
      sql: e11,
      selectedFields: t3,
      alias: n2,
      isWith: r2,
      usedTables: i2
    };
  }
};
var Ut = class extends D {
  static {
    __name(this, "Ut");
  }
  static [C] = "WithSubquery";
};
var Wt = { startActiveSpan(e11, t3) {
  return t3();
} };
var O = /* @__PURE__ */ Symbol.for("drizzle:ViewBaseConfig");
var Gt = /* @__PURE__ */ Symbol.for("drizzle:Schema");
var Kt = /* @__PURE__ */ Symbol.for("drizzle:Columns");
var qt = /* @__PURE__ */ Symbol.for("drizzle:ExtraConfigColumns");
var Jt = /* @__PURE__ */ Symbol.for("drizzle:OriginalName");
var Yt = /* @__PURE__ */ Symbol.for("drizzle:BaseName");
var Xt = /* @__PURE__ */ Symbol.for("drizzle:IsAlias");
var Zt = /* @__PURE__ */ Symbol.for("drizzle:ExtraConfigBuilder");
var Qt = /* @__PURE__ */ Symbol.for("drizzle:IsDrizzleTable");
var k = class {
  static {
    __name(this, "k");
  }
  static [C] = "Table";
  static Symbol = {
    Name: E,
    Schema: Gt,
    OriginalName: Jt,
    Columns: Kt,
    ExtraConfigColumns: qt,
    BaseName: Yt,
    IsAlias: Xt,
    ExtraConfigBuilder: Zt
  };
  [E];
  [Jt];
  [Gt];
  [Kt];
  [qt];
  [Yt];
  [Xt] = false;
  [Qt] = true;
  [Zt] = void 0;
  constructor(e11, t3, n2) {
    this[E] = this[Jt] = e11, this[Gt] = t3, this[Yt] = n2;
  }
};
function A(e11) {
  return e11[E];
}
__name(A, "A");
function $t(e11) {
  return `${e11[Gt] ?? "public"}.${e11[E]}`;
}
__name($t, "$t");
function en(e11) {
  return e11 != null && typeof e11.getSQL == "function";
}
__name(en, "en");
function tn(e11) {
  let t3 = {
    sql: "",
    params: []
  };
  for (let n2 of e11) t3.sql += n2.sql, t3.params.push(...n2.params), n2.typings?.length && (t3.typings ||= [], t3.typings.push(...n2.typings));
  return t3;
}
__name(tn, "tn");
var j = class {
  static {
    __name(this, "j");
  }
  static [C] = "StringChunk";
  value;
  constructor(e11) {
    this.value = Array.isArray(e11) ? e11 : [e11];
  }
  getSQL() {
    return new M([this]);
  }
};
var M = class e4 {
  static {
    __name(this, "e");
  }
  constructor(e11) {
    this.queryChunks = e11;
    for (let t3 of e11) if (w(t3, k)) {
      let e12 = t3[k.Symbol.Schema];
      this.usedTables.push(e12 === void 0 ? t3[k.Symbol.Name] : e12 + "." + t3[k.Symbol.Name]);
    }
  }
  static [C] = "SQL";
  decoder = an;
  shouldInlineParams = false;
  usedTables = [];
  append(e11) {
    return this.queryChunks.push(...e11.queryChunks), this;
  }
  toQuery(e11) {
    return Wt.startActiveSpan("drizzle.buildSQL", (t3) => {
      let n2 = this.buildQueryFromSourceParams(this.queryChunks, e11);
      return t3?.setAttributes({
        "drizzle.query.text": n2.sql,
        "drizzle.query.params": JSON.stringify(n2.params)
      }), n2;
    });
  }
  buildQueryFromSourceParams(t3, n2) {
    let r2 = Object.assign({}, n2, {
      inlineParams: n2.inlineParams || this.shouldInlineParams,
      paramStartIndex: n2.paramStartIndex || { value: 0 }
    }), { casing: i2, escapeName: a2, escapeParam: o2, prepareTyping: s2, inlineParams: c2, paramStartIndex: l2 } = r2;
    return tn(t3.map((t4) => {
      if (w(t4, j)) return {
        sql: t4.value.join(""),
        params: []
      };
      if (w(t4, nn)) return {
        sql: a2(t4.value),
        params: []
      };
      if (t4 === void 0) return {
        sql: "",
        params: []
      };
      if (Array.isArray(t4)) {
        let e11 = [new j("(")];
        for (let [n3, r3] of t4.entries()) e11.push(r3), n3 < t4.length - 1 && e11.push(new j(", "));
        return e11.push(new j(")")), this.buildQueryFromSourceParams(e11, r2);
      }
      if (w(t4, e4)) return this.buildQueryFromSourceParams(t4.queryChunks, {
        ...r2,
        inlineParams: c2 || t4.shouldInlineParams
      });
      if (w(t4, k)) {
        let e11 = t4[k.Symbol.Schema], n3 = t4[k.Symbol.Name];
        return {
          sql: e11 === void 0 || t4[Xt] ? a2(n3) : a2(e11) + "." + a2(n3),
          params: []
        };
      }
      if (w(t4, T)) {
        let e11 = i2.getColumnCasing(t4);
        if (n2.invokeSource === "indexes") return {
          sql: a2(e11),
          params: []
        };
        let r3 = t4.table[k.Symbol.Schema];
        return {
          sql: t4.table[Xt] || r3 === void 0 ? a2(t4.table[k.Symbol.Name]) + "." + a2(e11) : a2(r3) + "." + a2(t4.table[k.Symbol.Name]) + "." + a2(e11),
          params: []
        };
      }
      if (w(t4, I)) {
        let e11 = t4[O].schema, n3 = t4[O].name;
        return {
          sql: e11 === void 0 || t4[O].isAlias ? a2(n3) : a2(e11) + "." + a2(n3),
          params: []
        };
      }
      if (w(t4, N)) {
        if (w(t4.value, F)) return {
          sql: o2(l2.value++, t4),
          params: [t4],
          typings: ["none"]
        };
        let n3 = t4.value === null ? null : t4.encoder.mapToDriverValue(t4.value);
        if (w(n3, e4)) return this.buildQueryFromSourceParams([n3], r2);
        if (c2) return {
          sql: this.mapInlineParam(n3, r2),
          params: []
        };
        let i3 = ["none"];
        return s2 && (i3 = [s2(t4.encoder)]), {
          sql: o2(l2.value++, n3),
          params: [n3],
          typings: i3
        };
      }
      return w(t4, F) ? {
        sql: o2(l2.value++, t4),
        params: [t4],
        typings: ["none"]
      } : w(t4, e4.Aliased) && t4.fieldAlias !== void 0 ? {
        sql: a2(t4.fieldAlias),
        params: []
      } : w(t4, D) ? t4._.isWith ? {
        sql: a2(t4._.alias),
        params: []
      } : this.buildQueryFromSourceParams([
        new j("("),
        t4._.sql,
        new j(") "),
        new nn(t4._.alias)
      ], r2) : Ht(t4) ? t4.schema ? {
        sql: a2(t4.schema) + "." + a2(t4.enumName),
        params: []
      } : {
        sql: a2(t4.enumName),
        params: []
      } : en(t4) ? t4.shouldOmitSQLParens?.() ? this.buildQueryFromSourceParams([t4.getSQL()], r2) : this.buildQueryFromSourceParams([
        new j("("),
        t4.getSQL(),
        new j(")")
      ], r2) : c2 ? {
        sql: this.mapInlineParam(t4, r2),
        params: []
      } : {
        sql: o2(l2.value++, t4),
        params: [t4],
        typings: ["none"]
      };
    }));
  }
  mapInlineParam(e11, { escapeString: t3 }) {
    if (e11 === null) return "null";
    if (typeof e11 == "number" || typeof e11 == "boolean") return e11.toString();
    if (typeof e11 == "string") return t3(e11);
    if (typeof e11 == "object") {
      let n2 = e11.toString();
      return t3(n2 === "[object Object]" ? JSON.stringify(e11) : n2);
    }
    throw Error("Unexpected param value: " + e11);
  }
  getSQL() {
    return this;
  }
  as(t3) {
    return t3 === void 0 ? this : new e4.Aliased(this, t3);
  }
  mapWith(e11) {
    return this.decoder = typeof e11 == "function" ? { mapFromDriverValue: e11 } : e11, this;
  }
  inlineParams() {
    return this.shouldInlineParams = true, this;
  }
  if(e11) {
    return e11 ? this : void 0;
  }
};
var nn = class {
  static {
    __name(this, "nn");
  }
  constructor(e11) {
    this.value = e11;
  }
  static [C] = "Name";
  brand;
  getSQL() {
    return new M([this]);
  }
};
function rn(e11) {
  return typeof e11 == "object" && !!e11 && "mapToDriverValue" in e11 && typeof e11.mapToDriverValue == "function";
}
__name(rn, "rn");
var an = { mapFromDriverValue: /* @__PURE__ */ __name((e11) => e11, "mapFromDriverValue") };
var on = { mapToDriverValue: /* @__PURE__ */ __name((e11) => e11, "mapToDriverValue") };
({
  ...an,
  ...on
});
var N = class {
  static {
    __name(this, "N");
  }
  constructor(e11, t3 = on) {
    this.value = e11, this.encoder = t3;
  }
  static [C] = "Param";
  brand;
  getSQL() {
    return new M([this]);
  }
};
function P(e11, ...t3) {
  let n2 = [];
  (t3.length > 0 || e11.length > 0 && e11[0] !== "") && n2.push(new j(e11[0]));
  for (let [r2, i2] of t3.entries()) n2.push(i2, new j(e11[r2 + 1]));
  return new M(n2);
}
__name(P, "P");
((e11) => {
  function t3() {
    return new M([]);
  }
  __name(t3, "t");
  e11.empty = t3;
  function n2(e12) {
    return new M(e12);
  }
  __name(n2, "n");
  e11.fromList = n2;
  function r2(e12) {
    return new M([new j(e12)]);
  }
  __name(r2, "r");
  e11.raw = r2;
  function i2(e12, t4) {
    let n3 = [];
    for (let [r3, i3] of e12.entries()) r3 > 0 && t4 !== void 0 && n3.push(t4), n3.push(i3);
    return new M(n3);
  }
  __name(i2, "i");
  e11.join = i2;
  function a2(e12) {
    return new nn(e12);
  }
  __name(a2, "a");
  e11.identifier = a2;
  function o2(e12) {
    return new F(e12);
  }
  __name(o2, "o");
  e11.placeholder = o2;
  function s2(e12, t4) {
    return new N(e12, t4);
  }
  __name(s2, "s");
  e11.param = s2;
})(P ||= {}), ((e11) => {
  class t3 {
    static {
      __name(this, "t");
    }
    constructor(e12, t4) {
      this.sql = e12, this.fieldAlias = t4;
    }
    static [C] = "SQL.Aliased";
    isSelectionField = false;
    getSQL() {
      return this.sql;
    }
    clone() {
      return new t3(this.sql, this.fieldAlias);
    }
  }
  e11.Aliased = t3;
})(M ||= {});
var F = class {
  static {
    __name(this, "F");
  }
  constructor(e11) {
    this.name = e11;
  }
  static [C] = "Placeholder";
  getSQL() {
    return new M([this]);
  }
};
function sn(e11, t3) {
  return e11.map((e12) => {
    if (w(e12, F)) {
      if (!(e12.name in t3)) throw Error(`No value for placeholder "${e12.name}" was provided`);
      return t3[e12.name];
    }
    if (w(e12, N) && w(e12.value, F)) {
      if (!(e12.value.name in t3)) throw Error(`No value for placeholder "${e12.value.name}" was provided`);
      return e12.encoder.mapToDriverValue(t3[e12.value.name]);
    }
    return e12;
  });
}
__name(sn, "sn");
var cn = /* @__PURE__ */ Symbol.for("drizzle:IsDrizzleView");
var I = class {
  static {
    __name(this, "I");
  }
  static [C] = "View";
  [O];
  [cn] = true;
  constructor({ name: e11, schema: t3, selectedFields: n2, query: r2 }) {
    this[O] = {
      name: e11,
      originalName: e11,
      schema: t3,
      selectedFields: n2,
      query: r2,
      isExisting: !r2,
      isAlias: false
    };
  }
  getSQL() {
    return new M([this]);
  }
};
T.prototype.getSQL = function() {
  return new M([this]);
}, k.prototype.getSQL = function() {
  return new M([this]);
}, D.prototype.getSQL = function() {
  return new M([this]);
};
var ln = class {
  static {
    __name(this, "ln");
  }
  constructor(e11) {
    this.table = e11;
  }
  static [C] = "ColumnAliasProxyHandler";
  get(e11, t3) {
    return t3 === "table" ? this.table : e11[t3];
  }
};
var un = class {
  static {
    __name(this, "un");
  }
  constructor(e11, t3) {
    this.alias = e11, this.replaceOriginalName = t3;
  }
  static [C] = "TableAliasProxyHandler";
  get(e11, t3) {
    if (t3 === k.Symbol.IsAlias) return true;
    if (t3 === k.Symbol.Name || this.replaceOriginalName && t3 === k.Symbol.OriginalName) return this.alias;
    if (t3 === O) return {
      ...e11[O],
      name: this.alias,
      isAlias: true
    };
    if (t3 === k.Symbol.Columns) {
      let t4 = e11[k.Symbol.Columns];
      if (!t4) return t4;
      let n3 = {};
      return Object.keys(t4).map((r2) => {
        n3[r2] = new Proxy(t4[r2], new ln(new Proxy(e11, this)));
      }), n3;
    }
    let n2 = e11[t3];
    return w(n2, T) ? new Proxy(n2, new ln(new Proxy(e11, this))) : n2;
  }
};
function dn(e11, t3) {
  return new Proxy(e11, new un(t3, false));
}
__name(dn, "dn");
function L(e11, t3) {
  return new Proxy(e11, new ln(new Proxy(e11.table, new un(t3, false))));
}
__name(L, "L");
function fn(e11, t3) {
  return new M.Aliased(pn(e11.sql, t3), e11.fieldAlias);
}
__name(fn, "fn");
function pn(e11, t3) {
  return P.join(e11.queryChunks.map((e12) => w(e12, T) ? L(e12, t3) : w(e12, M) ? pn(e12, t3) : w(e12, M.Aliased) ? fn(e12, t3) : e12));
}
__name(pn, "pn");
var mn = class extends Error {
  static {
    __name(this, "mn");
  }
  static [C] = "DrizzleError";
  constructor({ message: e11, cause: t3 }) {
    super(e11), this.name = "DrizzleError", this.cause = t3;
  }
};
var R = class e5 extends Error {
  static {
    __name(this, "e");
  }
  constructor(t3, n2, r2) {
    super(`Failed query: ${t3}
params: ${n2}`), this.query = t3, this.params = n2, this.cause = r2, Error.captureStackTrace(this, e5), r2 && (this.cause = r2);
  }
};
var hn = class extends mn {
  static {
    __name(this, "hn");
  }
  static [C] = "TransactionRollbackError";
  constructor() {
    super({ message: "Rollback" });
  }
};
var gn = class {
  static {
    __name(this, "gn");
  }
  static [C] = "ConsoleLogWriter";
  write(e11) {
    console.log(e11);
  }
};
var _n = class {
  static {
    __name(this, "_n");
  }
  static [C] = "DefaultLogger";
  writer;
  constructor(e11) {
    this.writer = e11?.writer ?? new gn();
  }
  logQuery(e11, t3) {
    let n2 = t3.map((e12) => {
      try {
        return JSON.stringify(e12);
      } catch {
        return String(e12);
      }
    }), r2 = n2.length ? ` -- params: [${n2.join(", ")}]` : "";
    this.writer.write(`Query: ${e11}${r2}`);
  }
};
var vn = class {
  static {
    __name(this, "vn");
  }
  static [C] = "NoopLogger";
  logQuery() {
  }
};
var z = class {
  static {
    __name(this, "z");
  }
  static [C] = "QueryPromise";
  [Symbol.toStringTag] = "QueryPromise";
  catch(e11) {
    return this.then(void 0, e11);
  }
  finally(e11) {
    return this.then((t3) => (e11?.(), t3), (t3) => {
      throw e11?.(), t3;
    });
  }
  then(e11, t3) {
    return this.execute().then(e11, t3);
  }
};
function yn(e11, t3, n2) {
  let r2 = {}, i2 = e11.reduce((e12, { path: i3, field: a2 }, o2) => {
    let s2;
    s2 = w(a2, T) ? a2 : w(a2, M) ? a2.decoder : w(a2, D) ? a2._.sql.decoder : a2.sql.decoder;
    let c2 = e12;
    for (let [e13, l2] of i3.entries()) if (e13 < i3.length - 1) l2 in c2 || (c2[l2] = {}), c2 = c2[l2];
    else {
      let e14 = t3[o2], u2 = c2[l2] = e14 === null ? null : s2.mapFromDriverValue(e14);
      if (n2 && w(a2, T) && i3.length === 2) {
        let e15 = i3[0];
        e15 in r2 ? typeof r2[e15] == "string" && r2[e15] !== A(a2.table) && (r2[e15] = false) : r2[e15] = u2 === null ? A(a2.table) : false;
      }
    }
    return e12;
  }, {});
  if (n2 && Object.keys(r2).length > 0) for (let [e12, t4] of Object.entries(r2)) typeof t4 == "string" && !n2[t4] && (i2[e12] = null);
  return i2;
}
__name(yn, "yn");
function B(e11, t3) {
  return Object.entries(e11).reduce((e12, [n2, r2]) => {
    if (typeof n2 != "string") return e12;
    let i2 = t3 ? [...t3, n2] : [n2];
    return w(r2, T) || w(r2, M) || w(r2, M.Aliased) || w(r2, D) ? e12.push({
      path: i2,
      field: r2
    }) : w(r2, k) ? e12.push(...B(r2[k.Symbol.Columns], i2)) : e12.push(...B(r2, i2)), e12;
  }, []);
}
__name(B, "B");
function bn(e11, t3) {
  let n2 = Object.keys(e11), r2 = Object.keys(t3);
  if (n2.length !== r2.length) return false;
  for (let [e12, t4] of n2.entries()) if (t4 !== r2[e12]) return false;
  return true;
}
__name(bn, "bn");
function xn(e11, t3) {
  let n2 = Object.entries(t3).filter(([, e12]) => e12 !== void 0).map(([t4, n3]) => w(n3, M) || w(n3, T) ? [t4, n3] : [t4, new N(n3, e11[k.Symbol.Columns][t4])]);
  if (n2.length === 0) throw Error("No values to set");
  return Object.fromEntries(n2);
}
__name(xn, "xn");
function Sn(e11, t3) {
  for (let n2 of t3) for (let t4 of Object.getOwnPropertyNames(n2.prototype)) t4 !== "constructor" && Object.defineProperty(e11.prototype, t4, Object.getOwnPropertyDescriptor(n2.prototype, t4) || /* @__PURE__ */ Object.create(null));
}
__name(Sn, "Sn");
function Cn(e11) {
  return e11[k.Symbol.Columns];
}
__name(Cn, "Cn");
function wn(e11) {
  return w(e11, D) ? e11._.alias : w(e11, I) ? e11[O].name : w(e11, M) ? void 0 : e11[k.Symbol.IsAlias] ? e11[k.Symbol.Name] : e11[k.Symbol.BaseName];
}
__name(wn, "wn");
function Tn(e11, t3) {
  return {
    name: typeof e11 == "string" && e11.length > 0 ? e11 : "",
    config: typeof e11 == "object" ? e11 : t3
  };
}
__name(Tn, "Tn");
var En = typeof TextDecoder > "u" ? null : new TextDecoder();
var Dn = /* @__PURE__ */ Symbol.for("drizzle:PgInlineForeignKeys");
var On = /* @__PURE__ */ Symbol.for("drizzle:EnableRLS");
var kn = class extends k {
  static {
    __name(this, "kn");
  }
  static [C] = "PgTable";
  static Symbol = Object.assign({}, k.Symbol, {
    InlineForeignKeys: Dn,
    EnableRLS: On
  });
  [Dn] = [];
  [On] = false;
  [k.Symbol.ExtraConfigBuilder] = void 0;
  [k.Symbol.ExtraConfigColumns] = {};
};
var An = class {
  static {
    __name(this, "An");
  }
  static [C] = "PgPrimaryKeyBuilder";
  columns;
  name;
  constructor(e11, t3) {
    this.columns = e11, this.name = t3;
  }
  build(e11) {
    return new jn(e11, this.columns, this.name);
  }
};
var jn = class {
  static {
    __name(this, "jn");
  }
  constructor(e11, t3, n2) {
    this.table = e11, this.columns = t3, this.name = n2;
  }
  static [C] = "PgPrimaryKey";
  columns;
  name;
  getName() {
    return this.name ?? `${this.table[kn.Symbol.Name]}_${this.columns.map((e11) => e11.name).join("_")}_pk`;
  }
};
function V(e11, t3) {
  return rn(t3) && !en(e11) && !w(e11, N) && !w(e11, F) && !w(e11, T) && !w(e11, k) && !w(e11, I) ? new N(e11, t3) : e11;
}
__name(V, "V");
var H = /* @__PURE__ */ __name((e11, t3) => P`${e11} = ${V(t3, e11)}`, "H");
var Mn = /* @__PURE__ */ __name((e11, t3) => P`${e11} <> ${V(t3, e11)}`, "Mn");
function Nn(...e11) {
  let t3 = e11.filter((e12) => e12 !== void 0);
  if (t3.length !== 0) return t3.length === 1 ? new M(t3) : new M([
    new j("("),
    P.join(t3, new j(" and ")),
    new j(")")
  ]);
}
__name(Nn, "Nn");
function Pn(...e11) {
  let t3 = e11.filter((e12) => e12 !== void 0);
  if (t3.length !== 0) return t3.length === 1 ? new M(t3) : new M([
    new j("("),
    P.join(t3, new j(" or ")),
    new j(")")
  ]);
}
__name(Pn, "Pn");
function Fn(e11) {
  return P`not ${e11}`;
}
__name(Fn, "Fn");
var In = /* @__PURE__ */ __name((e11, t3) => P`${e11} > ${V(t3, e11)}`, "In");
var Ln = /* @__PURE__ */ __name((e11, t3) => P`${e11} >= ${V(t3, e11)}`, "Ln");
var Rn = /* @__PURE__ */ __name((e11, t3) => P`${e11} < ${V(t3, e11)}`, "Rn");
var zn = /* @__PURE__ */ __name((e11, t3) => P`${e11} <= ${V(t3, e11)}`, "zn");
function Bn(e11, t3) {
  return Array.isArray(t3) ? t3.length === 0 ? P`false` : P`${e11} in ${t3.map((t4) => V(t4, e11))}` : P`${e11} in ${V(t3, e11)}`;
}
__name(Bn, "Bn");
function Vn(e11, t3) {
  return Array.isArray(t3) ? t3.length === 0 ? P`true` : P`${e11} not in ${t3.map((t4) => V(t4, e11))}` : P`${e11} not in ${V(t3, e11)}`;
}
__name(Vn, "Vn");
function Hn(e11) {
  return P`${e11} is null`;
}
__name(Hn, "Hn");
function Un(e11) {
  return P`${e11} is not null`;
}
__name(Un, "Un");
function Wn(e11) {
  return P`exists ${e11}`;
}
__name(Wn, "Wn");
function Gn(e11) {
  return P`not exists ${e11}`;
}
__name(Gn, "Gn");
function Kn(e11, t3, n2) {
  return P`${e11} between ${V(t3, e11)} and ${V(n2, e11)}`;
}
__name(Kn, "Kn");
function qn(e11, t3, n2) {
  return P`${e11} not between ${V(t3, e11)} and ${V(n2, e11)}`;
}
__name(qn, "qn");
function Jn(e11, t3) {
  return P`${e11} like ${t3}`;
}
__name(Jn, "Jn");
function Yn(e11, t3) {
  return P`${e11} not like ${t3}`;
}
__name(Yn, "Yn");
function Xn(e11, t3) {
  return P`${e11} ilike ${t3}`;
}
__name(Xn, "Xn");
function Zn(e11, t3) {
  return P`${e11} not ilike ${t3}`;
}
__name(Zn, "Zn");
function Qn(e11) {
  return P`${e11} asc`;
}
__name(Qn, "Qn");
function $n(e11) {
  return P`${e11} desc`;
}
__name($n, "$n");
var er = class {
  static {
    __name(this, "er");
  }
  constructor(e11, t3, n2) {
    this.sourceTable = e11, this.referencedTable = t3, this.relationName = n2, this.referencedTableName = t3[k.Symbol.Name];
  }
  static [C] = "Relation";
  referencedTableName;
  fieldName;
};
var tr = class {
  static {
    __name(this, "tr");
  }
  constructor(e11, t3) {
    this.table = e11, this.config = t3;
  }
  static [C] = "Relations";
};
var nr = class e6 extends er {
  static {
    __name(this, "e");
  }
  constructor(e11, t3, n2, r2) {
    super(e11, t3, n2?.relationName), this.config = n2, this.isNullable = r2;
  }
  static [C] = "One";
  withFieldName(t3) {
    let n2 = new e6(this.sourceTable, this.referencedTable, this.config, this.isNullable);
    return n2.fieldName = t3, n2;
  }
};
var rr = class e7 extends er {
  static {
    __name(this, "e");
  }
  constructor(e11, t3, n2) {
    super(e11, t3, n2?.relationName), this.config = n2;
  }
  static [C] = "Many";
  withFieldName(t3) {
    let n2 = new e7(this.sourceTable, this.referencedTable, this.config);
    return n2.fieldName = t3, n2;
  }
};
function ir() {
  return {
    and: Nn,
    between: Kn,
    eq: H,
    exists: Wn,
    gt: In,
    gte: Ln,
    ilike: Xn,
    inArray: Bn,
    isNull: Hn,
    isNotNull: Un,
    like: Jn,
    lt: Rn,
    lte: zn,
    ne: Mn,
    not: Fn,
    notBetween: qn,
    notExists: Gn,
    notLike: Yn,
    notIlike: Zn,
    notInArray: Vn,
    or: Pn,
    sql: P
  };
}
__name(ir, "ir");
function ar() {
  return {
    sql: P,
    asc: Qn,
    desc: $n
  };
}
__name(ar, "ar");
function or(e11, t3) {
  Object.keys(e11).length === 1 && "default" in e11 && !w(e11.default, k) && (e11 = e11.default);
  let n2 = {}, r2 = {}, i2 = {};
  for (let [a2, o2] of Object.entries(e11)) if (w(o2, k)) {
    let e12 = $t(o2), t4 = r2[e12];
    n2[e12] = a2, i2[a2] = {
      tsName: a2,
      dbName: o2[k.Symbol.Name],
      schema: o2[k.Symbol.Schema],
      columns: o2[k.Symbol.Columns],
      relations: t4?.relations ?? {},
      primaryKey: t4?.primaryKey ?? []
    };
    for (let e13 of Object.values(o2[k.Symbol.Columns])) e13.primary && i2[a2].primaryKey.push(e13);
    let s2 = o2[k.Symbol.ExtraConfigBuilder]?.(o2[k.Symbol.ExtraConfigColumns]);
    if (s2) for (let e13 of Object.values(s2)) w(e13, An) && i2[a2].primaryKey.push(...e13.columns);
  } else if (w(o2, tr)) {
    let e12 = $t(o2.table), a3 = n2[e12], s2 = o2.config(t3(o2.table));
    for (let [t4, n3] of Object.entries(s2)) if (a3) {
      let e13 = i2[a3];
      e13.relations[t4] = n3;
    } else e12 in r2 || (r2[e12] = {
      relations: {},
      primaryKey: void 0
    }), r2[e12].relations[t4] = n3;
  }
  return {
    tables: i2,
    tableNamesMap: n2
  };
}
__name(or, "or");
function sr(e11) {
  return function(t3, n2) {
    return new nr(e11, t3, n2, n2?.fields.reduce((e12, t4) => e12 && t4.notNull, true) ?? false);
  };
}
__name(sr, "sr");
function cr(e11) {
  return function(t3, n2) {
    return new rr(e11, t3, n2);
  };
}
__name(cr, "cr");
function lr(e11, t3, n2) {
  if (w(n2, nr) && n2.config) return {
    fields: n2.config.fields,
    references: n2.config.references
  };
  let r2 = t3[$t(n2.referencedTable)];
  if (!r2) throw Error(`Table "${n2.referencedTable[k.Symbol.Name]}" not found in schema`);
  let i2 = e11[r2];
  if (!i2) throw Error(`Table "${r2}" not found in schema`);
  let a2 = n2.sourceTable, o2 = t3[$t(a2)];
  if (!o2) throw Error(`Table "${a2[k.Symbol.Name]}" not found in schema`);
  let s2 = [];
  for (let e12 of Object.values(i2.relations)) (n2.relationName && n2 !== e12 && e12.relationName === n2.relationName || !n2.relationName && e12.referencedTable === n2.sourceTable) && s2.push(e12);
  if (s2.length > 1) throw n2.relationName ? /* @__PURE__ */ Error(`There are multiple relations with name "${n2.relationName}" in table "${r2}"`) : /* @__PURE__ */ Error(`There are multiple relations between "${r2}" and "${n2.sourceTable[k.Symbol.Name]}". Please specify relation name`);
  if (s2[0] && w(s2[0], nr) && s2[0].config) return {
    fields: s2[0].config.references,
    references: s2[0].config.fields
  };
  throw Error(`There is not enough information to infer relation "${o2}.${n2.fieldName}"`);
}
__name(lr, "lr");
function ur(e11) {
  return {
    one: sr(e11),
    many: cr(e11)
  };
}
__name(ur, "ur");
function dr(e11, t3, n2, r2, i2 = (e12) => e12) {
  let a2 = {};
  for (let [o2, s2] of r2.entries()) if (s2.isJson) {
    let r3 = t3.relations[s2.tsKey], c2 = n2[o2], l2 = typeof c2 == "string" ? JSON.parse(c2) : c2;
    a2[s2.tsKey] = w(r3, nr) ? l2 && dr(e11, e11[s2.relationTableTsKey], l2, s2.selection, i2) : l2.map((t4) => dr(e11, e11[s2.relationTableTsKey], t4, s2.selection, i2));
  } else {
    let e12 = i2(n2[o2]), t4 = s2.field, r3;
    r3 = w(t4, T) ? t4 : w(t4, M) ? t4.decoder : t4.sql.decoder, a2[s2.tsKey] = e12 === null ? null : r3.mapFromDriverValue(e12);
  }
  return a2;
}
__name(dr, "dr");
var U = class e8 {
  static {
    __name(this, "e");
  }
  static [C] = "SelectionProxyHandler";
  config;
  constructor(e11) {
    this.config = { ...e11 };
  }
  get(t3, n2) {
    if (n2 === "_") return {
      ...t3._,
      selectedFields: new Proxy(t3._.selectedFields, this)
    };
    if (n2 === O) return {
      ...t3[O],
      selectedFields: new Proxy(t3[O].selectedFields, this)
    };
    if (typeof n2 == "symbol") return t3[n2];
    let r2 = (w(t3, D) ? t3._.selectedFields : w(t3, I) ? t3[O].selectedFields : t3)[n2];
    if (w(r2, M.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !r2.isSelectionField) return r2.sql;
      let e11 = r2.clone();
      return e11.isSelectionField = true, e11;
    }
    if (w(r2, M)) {
      if (this.config.sqlBehavior === "sql") return r2;
      throw Error(`You tried to reference "${n2}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`);
    }
    return w(r2, T) ? this.config.alias ? new Proxy(r2, new ln(new Proxy(r2.table, new un(this.config.alias, this.config.replaceOriginalName ?? false)))) : r2 : typeof r2 != "object" || !r2 ? r2 : new Proxy(r2, new e8(this.config));
  }
};
var fr = class {
  static {
    __name(this, "fr");
  }
  static [C] = "SQLiteForeignKeyBuilder";
  reference;
  _onUpdate;
  _onDelete;
  constructor(e11, t3) {
    this.reference = () => {
      let { name: t4, columns: n2, foreignColumns: r2 } = e11();
      return {
        name: t4,
        columns: n2,
        foreignTable: r2[0].table,
        foreignColumns: r2
      };
    }, t3 && (this._onUpdate = t3.onUpdate, this._onDelete = t3.onDelete);
  }
  onUpdate(e11) {
    return this._onUpdate = e11, this;
  }
  onDelete(e11) {
    return this._onDelete = e11, this;
  }
  build(e11) {
    return new pr(e11, this);
  }
};
var pr = class {
  static {
    __name(this, "pr");
  }
  constructor(e11, t3) {
    this.table = e11, this.reference = t3.reference, this.onUpdate = t3._onUpdate, this.onDelete = t3._onDelete;
  }
  static [C] = "SQLiteForeignKey";
  reference;
  onUpdate;
  onDelete;
  getName() {
    let { name: e11, columns: t3, foreignColumns: n2 } = this.reference(), r2 = t3.map((e12) => e12.name), i2 = n2.map((e12) => e12.name), a2 = [
      this.table[E],
      ...r2,
      n2[0].table[E],
      ...i2
    ];
    return e11 ?? `${a2.join("_")}_fk`;
  }
};
function mr(e11, t3) {
  return `${e11[E]}_${t3.join("_")}_unique`;
}
__name(mr, "mr");
var W = class extends Bt {
  static {
    __name(this, "W");
  }
  static [C] = "SQLiteColumnBuilder";
  foreignKeyConfigs = [];
  references(e11, t3 = {}) {
    return this.foreignKeyConfigs.push({
      ref: e11,
      actions: t3
    }), this;
  }
  unique(e11) {
    return this.config.isUnique = true, this.config.uniqueName = e11, this;
  }
  generatedAlwaysAs(e11, t3) {
    return this.config.generated = {
      as: e11,
      type: "always",
      mode: t3?.mode ?? "virtual"
    }, this;
  }
  buildForeignKeys(e11, t3) {
    return this.foreignKeyConfigs.map(({ ref: n2, actions: r2 }) => ((n3, r3) => {
      let i2 = new fr(() => {
        let t4 = n3();
        return {
          columns: [e11],
          foreignColumns: [t4]
        };
      });
      return r3.onUpdate && i2.onUpdate(r3.onUpdate), r3.onDelete && i2.onDelete(r3.onDelete), i2.build(t3);
    })(n2, r2));
  }
};
var G = class extends T {
  static {
    __name(this, "G");
  }
  constructor(e11, t3) {
    t3.uniqueName ||= mr(e11, [t3.name]), super(e11, t3), this.table = e11;
  }
  static [C] = "SQLiteColumn";
};
var hr = class extends W {
  static {
    __name(this, "hr");
  }
  static [C] = "SQLiteBigIntBuilder";
  constructor(e11) {
    super(e11, "bigint", "SQLiteBigInt");
  }
  build(e11) {
    return new gr(e11, this.config);
  }
};
var gr = class extends G {
  static {
    __name(this, "gr");
  }
  static [C] = "SQLiteBigInt";
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(e11) {
    if (typeof Buffer < "u" && Buffer.from) {
      let t3 = Buffer.isBuffer(e11) ? e11 : e11 instanceof ArrayBuffer ? Buffer.from(e11) : e11.buffer ? Buffer.from(e11.buffer, e11.byteOffset, e11.byteLength) : Buffer.from(e11);
      return BigInt(t3.toString("utf8"));
    }
    return BigInt(En.decode(e11));
  }
  mapToDriverValue(e11) {
    return Buffer.from(e11.toString());
  }
};
var _r = class extends W {
  static {
    __name(this, "_r");
  }
  static [C] = "SQLiteBlobJsonBuilder";
  constructor(e11) {
    super(e11, "json", "SQLiteBlobJson");
  }
  build(e11) {
    return new vr(e11, this.config);
  }
};
var vr = class extends G {
  static {
    __name(this, "vr");
  }
  static [C] = "SQLiteBlobJson";
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(e11) {
    if (typeof Buffer < "u" && Buffer.from) {
      let t3 = Buffer.isBuffer(e11) ? e11 : e11 instanceof ArrayBuffer ? Buffer.from(e11) : e11.buffer ? Buffer.from(e11.buffer, e11.byteOffset, e11.byteLength) : Buffer.from(e11);
      return JSON.parse(t3.toString("utf8"));
    }
    return JSON.parse(En.decode(e11));
  }
  mapToDriverValue(e11) {
    return Buffer.from(JSON.stringify(e11));
  }
};
var yr = class extends W {
  static {
    __name(this, "yr");
  }
  static [C] = "SQLiteBlobBufferBuilder";
  constructor(e11) {
    super(e11, "buffer", "SQLiteBlobBuffer");
  }
  build(e11) {
    return new br(e11, this.config);
  }
};
var br = class extends G {
  static {
    __name(this, "br");
  }
  static [C] = "SQLiteBlobBuffer";
  mapFromDriverValue(e11) {
    return Buffer.isBuffer(e11) ? e11 : Buffer.from(e11);
  }
  getSQLType() {
    return "blob";
  }
};
function xr(e11, t3) {
  let { name: n2, config: r2 } = Tn(e11, t3);
  return r2?.mode === "json" ? new _r(n2) : r2?.mode === "bigint" ? new hr(n2) : new yr(n2);
}
__name(xr, "xr");
var Sr = class extends W {
  static {
    __name(this, "Sr");
  }
  static [C] = "SQLiteCustomColumnBuilder";
  constructor(e11, t3, n2) {
    super(e11, "custom", "SQLiteCustomColumn"), this.config.fieldConfig = t3, this.config.customTypeParams = n2;
  }
  build(e11) {
    return new Cr(e11, this.config);
  }
};
var Cr = class extends G {
  static {
    __name(this, "Cr");
  }
  static [C] = "SQLiteCustomColumn";
  sqlName;
  mapTo;
  mapFrom;
  constructor(e11, t3) {
    super(e11, t3), this.sqlName = t3.customTypeParams.dataType(t3.fieldConfig), this.mapTo = t3.customTypeParams.toDriver, this.mapFrom = t3.customTypeParams.fromDriver;
  }
  getSQLType() {
    return this.sqlName;
  }
  mapFromDriverValue(e11) {
    return typeof this.mapFrom == "function" ? this.mapFrom(e11) : e11;
  }
  mapToDriverValue(e11) {
    return typeof this.mapTo == "function" ? this.mapTo(e11) : e11;
  }
};
function wr(e11) {
  return (t3, n2) => {
    let { name: r2, config: i2 } = Tn(t3, n2);
    return new Sr(r2, i2, e11);
  };
}
__name(wr, "wr");
var Tr = class extends W {
  static {
    __name(this, "Tr");
  }
  static [C] = "SQLiteBaseIntegerBuilder";
  constructor(e11, t3, n2) {
    super(e11, t3, n2), this.config.autoIncrement = false;
  }
  primaryKey(e11) {
    return e11?.autoIncrement && (this.config.autoIncrement = true), this.config.hasDefault = true, super.primaryKey();
  }
};
var Er = class extends G {
  static {
    __name(this, "Er");
  }
  static [C] = "SQLiteBaseInteger";
  autoIncrement = this.config.autoIncrement;
  getSQLType() {
    return "integer";
  }
};
var Dr = class extends Tr {
  static {
    __name(this, "Dr");
  }
  static [C] = "SQLiteIntegerBuilder";
  constructor(e11) {
    super(e11, "number", "SQLiteInteger");
  }
  build(e11) {
    return new Or(e11, this.config);
  }
};
var Or = class extends Er {
  static {
    __name(this, "Or");
  }
  static [C] = "SQLiteInteger";
};
var kr = class extends Tr {
  static {
    __name(this, "kr");
  }
  static [C] = "SQLiteTimestampBuilder";
  constructor(e11, t3) {
    super(e11, "date", "SQLiteTimestamp"), this.config.mode = t3;
  }
  defaultNow() {
    return this.default(P`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
  }
  build(e11) {
    return new Ar(e11, this.config);
  }
};
var Ar = class extends Er {
  static {
    __name(this, "Ar");
  }
  static [C] = "SQLiteTimestamp";
  mode = this.config.mode;
  mapFromDriverValue(e11) {
    return this.config.mode === "timestamp" ? /* @__PURE__ */ new Date(e11 * 1e3) : new Date(e11);
  }
  mapToDriverValue(e11) {
    let t3 = e11.getTime();
    return this.config.mode === "timestamp" ? Math.floor(t3 / 1e3) : t3;
  }
};
var jr = class extends Tr {
  static {
    __name(this, "jr");
  }
  static [C] = "SQLiteBooleanBuilder";
  constructor(e11, t3) {
    super(e11, "boolean", "SQLiteBoolean"), this.config.mode = t3;
  }
  build(e11) {
    return new Mr(e11, this.config);
  }
};
var Mr = class extends Er {
  static {
    __name(this, "Mr");
  }
  static [C] = "SQLiteBoolean";
  mode = this.config.mode;
  mapFromDriverValue(e11) {
    return Number(e11) === 1;
  }
  mapToDriverValue(e11) {
    return +!!e11;
  }
};
function K(e11, t3) {
  let { name: n2, config: r2 } = Tn(e11, t3);
  return r2?.mode === "timestamp" || r2?.mode === "timestamp_ms" ? new kr(n2, r2.mode) : r2?.mode === "boolean" ? new jr(n2, r2.mode) : new Dr(n2);
}
__name(K, "K");
var Nr = class extends W {
  static {
    __name(this, "Nr");
  }
  static [C] = "SQLiteNumericBuilder";
  constructor(e11) {
    super(e11, "string", "SQLiteNumeric");
  }
  build(e11) {
    return new Pr(e11, this.config);
  }
};
var Pr = class extends G {
  static {
    __name(this, "Pr");
  }
  static [C] = "SQLiteNumeric";
  mapFromDriverValue(e11) {
    return typeof e11 == "string" ? e11 : String(e11);
  }
  getSQLType() {
    return "numeric";
  }
};
var Fr = class extends W {
  static {
    __name(this, "Fr");
  }
  static [C] = "SQLiteNumericNumberBuilder";
  constructor(e11) {
    super(e11, "number", "SQLiteNumericNumber");
  }
  build(e11) {
    return new Ir(e11, this.config);
  }
};
var Ir = class extends G {
  static {
    __name(this, "Ir");
  }
  static [C] = "SQLiteNumericNumber";
  mapFromDriverValue(e11) {
    return typeof e11 == "number" ? e11 : Number(e11);
  }
  mapToDriverValue = String;
  getSQLType() {
    return "numeric";
  }
};
var Lr = class extends W {
  static {
    __name(this, "Lr");
  }
  static [C] = "SQLiteNumericBigIntBuilder";
  constructor(e11) {
    super(e11, "bigint", "SQLiteNumericBigInt");
  }
  build(e11) {
    return new Rr(e11, this.config);
  }
};
var Rr = class extends G {
  static {
    __name(this, "Rr");
  }
  static [C] = "SQLiteNumericBigInt";
  mapFromDriverValue = BigInt;
  mapToDriverValue = String;
  getSQLType() {
    return "numeric";
  }
};
function zr(e11, t3) {
  let { name: n2, config: r2 } = Tn(e11, t3), i2 = r2?.mode;
  return i2 === "number" ? new Fr(n2) : i2 === "bigint" ? new Lr(n2) : new Nr(n2);
}
__name(zr, "zr");
var Br = class extends W {
  static {
    __name(this, "Br");
  }
  static [C] = "SQLiteRealBuilder";
  constructor(e11) {
    super(e11, "number", "SQLiteReal");
  }
  build(e11) {
    return new Vr(e11, this.config);
  }
};
var Vr = class extends G {
  static {
    __name(this, "Vr");
  }
  static [C] = "SQLiteReal";
  getSQLType() {
    return "real";
  }
};
function Hr(e11) {
  return new Br(e11 ?? "");
}
__name(Hr, "Hr");
var Ur = class extends W {
  static {
    __name(this, "Ur");
  }
  static [C] = "SQLiteTextBuilder";
  constructor(e11, t3) {
    super(e11, "string", "SQLiteText"), this.config.enumValues = t3.enum, this.config.length = t3.length;
  }
  build(e11) {
    return new Wr(e11, this.config);
  }
};
var Wr = class extends G {
  static {
    __name(this, "Wr");
  }
  static [C] = "SQLiteText";
  enumValues = this.config.enumValues;
  length = this.config.length;
  constructor(e11, t3) {
    super(e11, t3);
  }
  getSQLType() {
    return `text${this.config.length ? `(${this.config.length})` : ""}`;
  }
};
var Gr = class extends W {
  static {
    __name(this, "Gr");
  }
  static [C] = "SQLiteTextJsonBuilder";
  constructor(e11) {
    super(e11, "json", "SQLiteTextJson");
  }
  build(e11) {
    return new Kr(e11, this.config);
  }
};
var Kr = class extends G {
  static {
    __name(this, "Kr");
  }
  static [C] = "SQLiteTextJson";
  getSQLType() {
    return "text";
  }
  mapFromDriverValue(e11) {
    return JSON.parse(e11);
  }
  mapToDriverValue(e11) {
    return JSON.stringify(e11);
  }
};
function q(e11, t3 = {}) {
  let { name: n2, config: r2 } = Tn(e11, t3);
  return r2.mode === "json" ? new Gr(n2) : new Ur(n2, r2);
}
__name(q, "q");
function qr() {
  return {
    blob: xr,
    customType: wr,
    integer: K,
    numeric: zr,
    real: Hr,
    text: q
  };
}
__name(qr, "qr");
var Jr = /* @__PURE__ */ Symbol.for("drizzle:SQLiteInlineForeignKeys");
var J = class extends k {
  static {
    __name(this, "J");
  }
  static [C] = "SQLiteTable";
  static Symbol = Object.assign({}, k.Symbol, { InlineForeignKeys: Jr });
  [k.Symbol.Columns];
  [Jr] = [];
  [k.Symbol.ExtraConfigBuilder] = void 0;
};
function Yr(e11, t3, n2, r2, i2 = e11) {
  let a2 = new J(e11, r2, i2), o2 = typeof t3 == "function" ? t3(qr()) : t3, s2 = Object.fromEntries(Object.entries(o2).map(([e12, t4]) => {
    let n3 = t4;
    n3.setName(e12);
    let r3 = n3.build(a2);
    return a2[Jr].push(...n3.buildForeignKeys(r3, a2)), [e12, r3];
  })), c2 = Object.assign(a2, s2);
  return c2[k.Symbol.Columns] = s2, c2[k.Symbol.ExtraConfigColumns] = s2, n2 && (c2[J.Symbol.ExtraConfigBuilder] = n2), c2;
}
__name(Yr, "Yr");
var Xr = /* @__PURE__ */ __name((e11, t3, n2) => Yr(e11, t3, n2), "Xr");
function Y(e11) {
  return w(e11, J) ? [`${e11[k.Symbol.BaseName]}`] : w(e11, D) ? e11._.usedTables ?? [] : w(e11, M) ? e11.usedTables ?? [] : [];
}
__name(Y, "Y");
var Zr = class extends z {
  static {
    __name(this, "Zr");
  }
  constructor(e11, t3, n2, r2) {
    super(), this.table = e11, this.session = t3, this.dialect = n2, this.config = {
      table: e11,
      withList: r2
    };
  }
  static [C] = "SQLiteDelete";
  config;
  where(e11) {
    return this.config.where = e11, this;
  }
  orderBy(...e11) {
    if (typeof e11[0] == "function") {
      let t3 = e11[0](new Proxy(this.config.table[k.Symbol.Columns], new U({
        sqlAliasedBehavior: "alias",
        sqlBehavior: "sql"
      }))), n2 = Array.isArray(t3) ? t3 : [t3];
      this.config.orderBy = n2;
    } else {
      let t3 = e11;
      this.config.orderBy = t3;
    }
    return this;
  }
  limit(e11) {
    return this.config.limit = e11, this;
  }
  returning(e11 = this.table[J.Symbol.Columns]) {
    return this.config.returning = B(e11), this;
  }
  getSQL() {
    return this.dialect.buildDeleteQuery(this.config);
  }
  toSQL() {
    let { typings: e11, ...t3 } = this.dialect.sqlToQuery(this.getSQL());
    return t3;
  }
  _prepare(e11 = true) {
    return this.session[e11 ? "prepareOneTimeQuery" : "prepareQuery"](this.dialect.sqlToQuery(this.getSQL()), this.config.returning, this.config.returning ? "all" : "run", true, void 0, {
      type: "delete",
      tables: Y(this.config.table)
    });
  }
  prepare() {
    return this._prepare(false);
  }
  run = /* @__PURE__ */ __name((e11) => this._prepare().run(e11), "run");
  all = /* @__PURE__ */ __name((e11) => this._prepare().all(e11), "all");
  get = /* @__PURE__ */ __name((e11) => this._prepare().get(e11), "get");
  values = /* @__PURE__ */ __name((e11) => this._prepare().values(e11), "values");
  async execute(e11) {
    return this._prepare().execute(e11);
  }
  $dynamic() {
    return this;
  }
};
function Qr(e11) {
  return (e11.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).map((e12) => e12.toLowerCase()).join("_");
}
__name(Qr, "Qr");
function $r(e11) {
  return (e11.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).reduce((e12, t3, n2) => e12 + (n2 === 0 ? t3.toLowerCase() : `${t3[0].toUpperCase()}${t3.slice(1)}`), "");
}
__name($r, "$r");
function ei(e11) {
  return e11;
}
__name(ei, "ei");
var ti = class {
  static {
    __name(this, "ti");
  }
  static [C] = "CasingCache";
  cache = {};
  cachedTables = {};
  convert;
  constructor(e11) {
    this.convert = e11 === "snake_case" ? Qr : e11 === "camelCase" ? $r : ei;
  }
  getColumnCasing(e11) {
    if (!e11.keyAsName) return e11.name;
    let t3 = `${e11.table[k.Symbol.Schema] ?? "public"}.${e11.table[k.Symbol.OriginalName]}.${e11.name}`;
    return this.cache[t3] || this.cacheTable(e11.table), this.cache[t3];
  }
  cacheTable(e11) {
    let t3 = `${e11[k.Symbol.Schema] ?? "public"}.${e11[k.Symbol.OriginalName]}`;
    if (!this.cachedTables[t3]) {
      for (let n2 of Object.values(e11[k.Symbol.Columns])) {
        let e12 = `${t3}.${n2.name}`;
        this.cache[e12] = this.convert(n2.name);
      }
      this.cachedTables[t3] = true;
    }
  }
  clearCache() {
    this.cache = {}, this.cachedTables = {};
  }
};
var ni = class extends I {
  static {
    __name(this, "ni");
  }
  static [C] = "SQLiteViewBase";
};
var ri = class {
  static {
    __name(this, "ri");
  }
  static [C] = "SQLiteDialect";
  casing;
  constructor(e11) {
    this.casing = new ti(e11?.casing);
  }
  escapeName(e11) {
    return `"${e11.replace(/"/g, '""')}"`;
  }
  escapeParam(e11) {
    return "?";
  }
  escapeString(e11) {
    return `'${e11.replace(/'/g, "''")}'`;
  }
  buildWithCTE(e11) {
    if (!e11?.length) return;
    let t3 = [P`with `];
    for (let [n2, r2] of e11.entries()) t3.push(P`${P.identifier(r2._.alias)} as (${r2._.sql})`), n2 < e11.length - 1 && t3.push(P`, `);
    return t3.push(P` `), P.join(t3);
  }
  buildDeleteQuery({ table: e11, where: t3, returning: n2, withList: r2, limit: i2, orderBy: a2 }) {
    let o2 = this.buildWithCTE(r2), s2 = n2 ? P` returning ${this.buildSelection(n2, { isSingleTable: true })}` : void 0;
    return P`${o2}delete from ${e11}${t3 ? P` where ${t3}` : void 0}${s2}${this.buildOrderBy(a2)}${this.buildLimit(i2)}`;
  }
  buildUpdateSet(e11, t3) {
    let n2 = e11[k.Symbol.Columns], r2 = Object.keys(n2).filter((e12) => t3[e12] !== void 0 || n2[e12]?.onUpdateFn !== void 0), i2 = r2.length;
    return P.join(r2.flatMap((e12, r3) => {
      let a2 = n2[e12], o2 = a2.onUpdateFn?.(), s2 = t3[e12] ?? (w(o2, M) ? o2 : P.param(o2, a2)), c2 = P`${P.identifier(this.casing.getColumnCasing(a2))} = ${s2}`;
      return r3 < i2 - 1 ? [c2, P.raw(", ")] : [c2];
    }));
  }
  buildUpdateQuery({ table: e11, set: t3, where: n2, returning: r2, withList: i2, joins: a2, from: o2, limit: s2, orderBy: c2 }) {
    let l2 = this.buildWithCTE(i2), u2 = this.buildUpdateSet(e11, t3), d2 = o2 && P.join([P.raw(" from "), this.buildFromTable(o2)]), f2 = this.buildJoins(a2), p2 = r2 ? P` returning ${this.buildSelection(r2, { isSingleTable: true })}` : void 0;
    return P`${l2}update ${e11} set ${u2}${d2}${f2}${n2 ? P` where ${n2}` : void 0}${p2}${this.buildOrderBy(c2)}${this.buildLimit(s2)}`;
  }
  buildSelection(e11, { isSingleTable: t3 = false } = {}) {
    let n2 = e11.length, r2 = e11.flatMap(({ field: e12 }, r3) => {
      let i2 = [];
      if (w(e12, M.Aliased) && e12.isSelectionField) i2.push(P.identifier(e12.fieldAlias));
      else if (w(e12, M.Aliased) || w(e12, M)) {
        let n3 = w(e12, M.Aliased) ? e12.sql : e12;
        t3 ? i2.push(new M(n3.queryChunks.map((e13) => w(e13, T) ? P.identifier(this.casing.getColumnCasing(e13)) : e13))) : i2.push(n3), w(e12, M.Aliased) && i2.push(P` as ${P.identifier(e12.fieldAlias)}`);
      } else if (w(e12, T)) {
        let n3 = e12.table[k.Symbol.Name];
        e12.columnType === "SQLiteNumericBigInt" ? t3 ? i2.push(P`cast(${P.identifier(this.casing.getColumnCasing(e12))} as text)`) : i2.push(P`cast(${P.identifier(n3)}.${P.identifier(this.casing.getColumnCasing(e12))} as text)`) : t3 ? i2.push(P.identifier(this.casing.getColumnCasing(e12))) : i2.push(P`${P.identifier(n3)}.${P.identifier(this.casing.getColumnCasing(e12))}`);
      } else if (w(e12, D)) {
        let t4 = Object.entries(e12._.selectedFields);
        if (t4.length === 1) {
          let n3 = t4[0][1], r4 = w(n3, M) ? n3.decoder : w(n3, T) ? { mapFromDriverValue: /* @__PURE__ */ __name((e13) => n3.mapFromDriverValue(e13), "mapFromDriverValue") } : n3.sql.decoder;
          r4 && (e12._.sql.decoder = r4);
        }
        i2.push(e12);
      }
      return r3 < n2 - 1 && i2.push(P`, `), i2;
    });
    return P.join(r2);
  }
  buildJoins(e11) {
    if (!e11 || e11.length === 0) return;
    let t3 = [];
    if (e11) for (let [n2, r2] of e11.entries()) {
      n2 === 0 && t3.push(P` `);
      let i2 = r2.table, a2 = r2.on ? P` on ${r2.on}` : void 0;
      if (w(i2, J)) {
        let e12 = i2[J.Symbol.Name], n3 = i2[J.Symbol.Schema], o2 = i2[J.Symbol.OriginalName], s2 = e12 === o2 ? void 0 : r2.alias;
        t3.push(P`${P.raw(r2.joinType)} join ${n3 ? P`${P.identifier(n3)}.` : void 0}${P.identifier(o2)}${s2 && P` ${P.identifier(s2)}`}${a2}`);
      } else t3.push(P`${P.raw(r2.joinType)} join ${i2}${a2}`);
      n2 < e11.length - 1 && t3.push(P` `);
    }
    return P.join(t3);
  }
  buildLimit(e11) {
    return typeof e11 == "object" || typeof e11 == "number" && e11 >= 0 ? P` limit ${e11}` : void 0;
  }
  buildOrderBy(e11) {
    let t3 = [];
    if (e11) for (let [n2, r2] of e11.entries()) t3.push(r2), n2 < e11.length - 1 && t3.push(P`, `);
    return t3.length > 0 ? P` order by ${P.join(t3)}` : void 0;
  }
  buildFromTable(e11) {
    return w(e11, k) && e11[k.Symbol.IsAlias] ? P`${P`${P.identifier(e11[k.Symbol.Schema] ?? "")}.`.if(e11[k.Symbol.Schema])}${P.identifier(e11[k.Symbol.OriginalName])} ${P.identifier(e11[k.Symbol.Name])}` : e11;
  }
  buildSelectQuery({ withList: e11, fields: t3, fieldsFlat: n2, where: r2, having: i2, table: a2, joins: o2, orderBy: s2, groupBy: c2, limit: l2, offset: u2, distinct: d2, setOperators: f2 }) {
    let p2 = n2 ?? B(t3);
    for (let e12 of p2) if (w(e12.field, T) && A(e12.field.table) !== (w(a2, D) ? a2._.alias : w(a2, ni) ? a2[O].name : w(a2, M) ? void 0 : A(a2)) && !((e13) => o2?.some(({ alias: t4 }) => t4 === (e13[k.Symbol.IsAlias] ? A(e13) : e13[k.Symbol.BaseName])))(e12.field.table)) {
      let t4 = A(e12.field.table);
      throw Error(`Your "${e12.path.join("->")}" field references a column "${t4}"."${e12.field.name}", but the table "${t4}" is not part of the query! Did you forget to join it?`);
    }
    let m2 = !o2 || o2.length === 0, h2 = this.buildWithCTE(e11), g2 = d2 ? P` distinct` : void 0, _2 = this.buildSelection(p2, { isSingleTable: m2 }), v2 = this.buildFromTable(a2), ee2 = this.buildJoins(o2), te2 = r2 ? P` where ${r2}` : void 0, ne2 = i2 ? P` having ${i2}` : void 0, re2 = [];
    if (c2) for (let [e12, t4] of c2.entries()) re2.push(t4), e12 < c2.length - 1 && re2.push(P`, `);
    let ie2 = P`${h2}select${g2} ${_2} from ${v2}${ee2}${te2}${re2.length > 0 ? P` group by ${P.join(re2)}` : void 0}${ne2}${this.buildOrderBy(s2)}${this.buildLimit(l2)}${u2 ? P` offset ${u2}` : void 0}`;
    return f2.length > 0 ? this.buildSetOperations(ie2, f2) : ie2;
  }
  buildSetOperations(e11, t3) {
    let [n2, ...r2] = t3;
    if (!n2) throw Error("Cannot pass undefined values to any set operator");
    return r2.length === 0 ? this.buildSetOperationQuery({
      leftSelect: e11,
      setOperator: n2
    }) : this.buildSetOperations(this.buildSetOperationQuery({
      leftSelect: e11,
      setOperator: n2
    }), r2);
  }
  buildSetOperationQuery({ leftSelect: e11, setOperator: { type: t3, isAll: n2, rightSelect: r2, limit: i2, orderBy: a2, offset: o2 } }) {
    let s2 = P`${e11.getSQL()} `, c2 = P`${r2.getSQL()}`, l2;
    if (a2 && a2.length > 0) {
      let e12 = [];
      for (let t4 of a2) if (w(t4, G)) e12.push(P.identifier(t4.name));
      else if (w(t4, M)) {
        for (let e13 = 0; e13 < t4.queryChunks.length; e13++) {
          let n3 = t4.queryChunks[e13];
          w(n3, G) && (t4.queryChunks[e13] = P.identifier(this.casing.getColumnCasing(n3)));
        }
        e12.push(P`${t4}`);
      } else e12.push(P`${t4}`);
      l2 = P` order by ${P.join(e12, P`, `)}`;
    }
    let u2 = typeof i2 == "object" || typeof i2 == "number" && i2 >= 0 ? P` limit ${i2}` : void 0, d2 = P.raw(`${t3} ${n2 ? "all " : ""}`), f2 = o2 ? P` offset ${o2}` : void 0;
    return P`${s2}${d2}${c2}${l2}${u2}${f2}`;
  }
  buildInsertQuery({ table: e11, values: t3, onConflict: n2, returning: r2, withList: i2, select: a2 }) {
    let o2 = [], s2 = e11[k.Symbol.Columns], c2 = Object.entries(s2).filter(([e12, t4]) => !t4.shouldDisableInsert()), l2 = c2.map(([, e12]) => P.identifier(this.casing.getColumnCasing(e12)));
    if (a2) {
      let e12 = t3;
      w(e12, M) ? o2.push(e12) : o2.push(e12.getSQL());
    } else {
      let e12 = t3;
      o2.push(P.raw("values "));
      for (let [t4, n3] of e12.entries()) {
        let r3 = [];
        for (let [e13, t5] of c2) {
          let i3 = n3[e13];
          if (i3 === void 0 || w(i3, N) && i3.value === void 0) {
            let e14;
            if (t5.default !== null && t5.default !== void 0) e14 = w(t5.default, M) ? t5.default : P.param(t5.default, t5);
            else if (t5.defaultFn !== void 0) {
              let n4 = t5.defaultFn();
              e14 = w(n4, M) ? n4 : P.param(n4, t5);
            } else if (!t5.default && t5.onUpdateFn !== void 0) {
              let n4 = t5.onUpdateFn();
              e14 = w(n4, M) ? n4 : P.param(n4, t5);
            } else e14 = P`null`;
            r3.push(e14);
          } else r3.push(i3);
        }
        o2.push(r3), t4 < e12.length - 1 && o2.push(P`, `);
      }
    }
    let u2 = this.buildWithCTE(i2), d2 = P.join(o2), f2 = r2 ? P` returning ${this.buildSelection(r2, { isSingleTable: true })}` : void 0;
    return P`${u2}insert into ${e11} ${l2} ${d2}${n2?.length ? P.join(n2) : void 0}${f2}`;
  }
  sqlToQuery(e11, t3) {
    return e11.toQuery({
      casing: this.casing,
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString,
      invokeSource: t3
    });
  }
  buildRelationalQuery({ fullSchema: e11, schema: t3, tableNamesMap: n2, table: r2, tableConfig: i2, queryConfig: a2, tableAlias: o2, nestedQueryRelation: s2, joinOn: c2 }) {
    let l2 = [], u2, d2, f2 = [], p2, m2 = [];
    if (a2 === true) l2 = Object.entries(i2.columns).map(([e12, t4]) => ({
      dbKey: t4.name,
      tsKey: e12,
      field: L(t4, o2),
      relationTableTsKey: void 0,
      isJson: false,
      selection: []
    }));
    else {
      let r3 = Object.fromEntries(Object.entries(i2.columns).map(([e12, t4]) => [e12, L(t4, o2)]));
      if (a2.where) {
        let e12 = typeof a2.where == "function" ? a2.where(r3, ir()) : a2.where;
        p2 = e12 && pn(e12, o2);
      }
      let s3 = [], c3 = [];
      if (a2.columns) {
        let e12 = false;
        for (let [t4, n3] of Object.entries(a2.columns)) n3 !== void 0 && t4 in i2.columns && (!e12 && n3 === true && (e12 = true), c3.push(t4));
        c3.length > 0 && (c3 = e12 ? c3.filter((e13) => a2.columns?.[e13] === true) : Object.keys(i2.columns).filter((e13) => !c3.includes(e13)));
      } else c3 = Object.keys(i2.columns);
      for (let e12 of c3) {
        let t4 = i2.columns[e12];
        s3.push({
          tsKey: e12,
          value: t4
        });
      }
      let m3 = [];
      a2.with && (m3 = Object.entries(a2.with).filter((e12) => !!e12[1]).map(([e12, t4]) => ({
        tsKey: e12,
        queryConfig: t4,
        relation: i2.relations[e12]
      })));
      let h3;
      if (a2.extras) {
        h3 = typeof a2.extras == "function" ? a2.extras(r3, { sql: P }) : a2.extras;
        for (let [e12, t4] of Object.entries(h3)) s3.push({
          tsKey: e12,
          value: fn(t4, o2)
        });
      }
      for (let { tsKey: e12, value: t4 } of s3) l2.push({
        dbKey: w(t4, M.Aliased) ? t4.fieldAlias : i2.columns[e12].name,
        tsKey: e12,
        field: w(t4, T) ? L(t4, o2) : t4,
        relationTableTsKey: void 0,
        isJson: false,
        selection: []
      });
      let g2 = typeof a2.orderBy == "function" ? a2.orderBy(r3, ar()) : a2.orderBy ?? [];
      Array.isArray(g2) || (g2 = [g2]), f2 = g2.map((e12) => w(e12, T) ? L(e12, o2) : pn(e12, o2)), u2 = a2.limit, d2 = a2.offset;
      for (let { tsKey: r4, queryConfig: i3, relation: a3 } of m3) {
        let s4 = lr(t3, n2, a3), c4 = n2[$t(a3.referencedTable)], u3 = `${o2}_${r4}`, d3 = Nn(...s4.fields.map((e12, t4) => H(L(s4.references[t4], u3), L(e12, o2)))), f3 = this.buildRelationalQuery({
          fullSchema: e11,
          schema: t3,
          tableNamesMap: n2,
          table: e11[c4],
          tableConfig: t3[c4],
          queryConfig: w(a3, nr) ? i3 === true ? { limit: 1 } : {
            ...i3,
            limit: 1
          } : i3,
          tableAlias: u3,
          joinOn: d3,
          nestedQueryRelation: a3
        }), p3 = P`(${f3.sql})`.as(r4);
        l2.push({
          dbKey: r4,
          tsKey: r4,
          field: p3,
          relationTableTsKey: c4,
          isJson: true,
          selection: f3.selection
        });
      }
    }
    if (l2.length === 0) throw new mn({ message: `No fields selected for table "${i2.tsName}" ("${o2}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.` });
    let h2;
    if (p2 = Nn(c2, p2), s2) {
      let e12 = P`json_array(${P.join(l2.map(({ field: e13 }) => w(e13, G) ? P.identifier(this.casing.getColumnCasing(e13)) : w(e13, M.Aliased) ? e13.sql : e13), P`, `)})`;
      w(s2, rr) && (e12 = P`coalesce(json_group_array(${e12}), json_array())`);
      let t4 = [{
        dbKey: "data",
        tsKey: "data",
        field: e12.as("data"),
        isJson: true,
        relationTableTsKey: i2.tsName,
        selection: l2
      }];
      u2 !== void 0 || d2 !== void 0 || f2.length > 0 ? (h2 = this.buildSelectQuery({
        table: dn(r2, o2),
        fields: {},
        fieldsFlat: [{
          path: [],
          field: P.raw("*")
        }],
        where: p2,
        limit: u2,
        offset: d2,
        orderBy: f2,
        setOperators: []
      }), p2 = void 0, u2 = void 0, d2 = void 0, f2 = void 0) : h2 = dn(r2, o2), h2 = this.buildSelectQuery({
        table: w(h2, J) ? h2 : new D(h2, {}, o2),
        fields: {},
        fieldsFlat: t4.map(({ field: e13 }) => ({
          path: [],
          field: w(e13, T) ? L(e13, o2) : e13
        })),
        joins: m2,
        where: p2,
        limit: u2,
        offset: d2,
        orderBy: f2,
        setOperators: []
      });
    } else h2 = this.buildSelectQuery({
      table: dn(r2, o2),
      fields: {},
      fieldsFlat: l2.map(({ field: e12 }) => ({
        path: [],
        field: w(e12, T) ? L(e12, o2) : e12
      })),
      joins: m2,
      where: p2,
      limit: u2,
      offset: d2,
      orderBy: f2,
      setOperators: []
    });
    return {
      tableTsKey: i2.tsName,
      sql: h2,
      selection: l2
    };
  }
};
var ii = class extends ri {
  static {
    __name(this, "ii");
  }
  static [C] = "SQLiteSyncDialect";
  migrate(e11, t3, n2) {
    let r2 = n2 === void 0 || typeof n2 == "string" ? "__drizzle_migrations" : n2.migrationsTable ?? "__drizzle_migrations", i2 = P`
			CREATE TABLE IF NOT EXISTS ${P.identifier(r2)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
    t3.run(i2);
    let a2 = t3.values(P`SELECT id, hash, created_at FROM ${P.identifier(r2)} ORDER BY created_at DESC LIMIT 1`)[0] ?? void 0;
    t3.run(P`BEGIN`);
    try {
      for (let n3 of e11) if (!a2 || Number(a2[2]) < n3.folderMillis) {
        for (let e12 of n3.sql) t3.run(P.raw(e12));
        t3.run(P`INSERT INTO ${P.identifier(r2)} ("hash", "created_at") VALUES(${n3.hash}, ${n3.folderMillis})`);
      }
      t3.run(P`COMMIT`);
    } catch (e12) {
      throw t3.run(P`ROLLBACK`), e12;
    }
  }
};
var ai = class extends ri {
  static {
    __name(this, "ai");
  }
  static [C] = "SQLiteAsyncDialect";
  async migrate(e11, t3, n2) {
    let r2 = n2 === void 0 || typeof n2 == "string" ? "__drizzle_migrations" : n2.migrationsTable ?? "__drizzle_migrations", i2 = P`
			CREATE TABLE IF NOT EXISTS ${P.identifier(r2)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
    await t3.run(i2);
    let a2 = (await t3.values(P`SELECT id, hash, created_at FROM ${P.identifier(r2)} ORDER BY created_at DESC LIMIT 1`))[0] ?? void 0;
    await t3.transaction(async (t4) => {
      for (let n3 of e11) if (!a2 || Number(a2[2]) < n3.folderMillis) {
        for (let e12 of n3.sql) await t4.run(P.raw(e12));
        await t4.run(P`INSERT INTO ${P.identifier(r2)} ("hash", "created_at") VALUES(${n3.hash}, ${n3.folderMillis})`);
      }
    });
  }
};
var oi = class {
  static {
    __name(this, "oi");
  }
  static [C] = "TypedQueryBuilder";
  getSelectedFields() {
    return this._.selectedFields;
  }
};
var X = class {
  static {
    __name(this, "X");
  }
  static [C] = "SQLiteSelectBuilder";
  fields;
  session;
  dialect;
  withList;
  distinct;
  constructor(e11) {
    this.fields = e11.fields, this.session = e11.session, this.dialect = e11.dialect, this.withList = e11.withList, this.distinct = e11.distinct;
  }
  from(e11) {
    let t3 = !!this.fields, n2;
    return n2 = this.fields ? this.fields : w(e11, D) ? Object.fromEntries(Object.keys(e11._.selectedFields).map((t4) => [t4, e11[t4]])) : w(e11, ni) ? e11[O].selectedFields : w(e11, M) ? {} : Cn(e11), new ci({
      table: e11,
      fields: n2,
      isPartialSelect: t3,
      session: this.session,
      dialect: this.dialect,
      withList: this.withList,
      distinct: this.distinct
    });
  }
};
var si = class extends oi {
  static {
    __name(this, "si");
  }
  static [C] = "SQLiteSelectQueryBuilder";
  _;
  config;
  joinsNotNullableMap;
  tableName;
  isPartialSelect;
  session;
  dialect;
  cacheConfig = void 0;
  usedTables = /* @__PURE__ */ new Set();
  constructor({ table: e11, fields: t3, isPartialSelect: n2, session: r2, dialect: i2, withList: a2, distinct: o2 }) {
    super(), this.config = {
      withList: a2,
      table: e11,
      fields: { ...t3 },
      distinct: o2,
      setOperators: []
    }, this.isPartialSelect = n2, this.session = r2, this.dialect = i2, this._ = {
      selectedFields: t3,
      config: this.config
    }, this.tableName = wn(e11), this.joinsNotNullableMap = typeof this.tableName == "string" ? { [this.tableName]: true } : {};
    for (let t4 of Y(e11)) this.usedTables.add(t4);
  }
  getUsedTables() {
    return [...this.usedTables];
  }
  createJoin(e11) {
    return (t3, n2) => {
      let r2 = this.tableName, i2 = wn(t3);
      for (let e12 of Y(t3)) this.usedTables.add(e12);
      if (typeof i2 == "string" && this.config.joins?.some((e12) => e12.alias === i2)) throw Error(`Alias "${i2}" is already used in this query`);
      if (!this.isPartialSelect && (Object.keys(this.joinsNotNullableMap).length === 1 && typeof r2 == "string" && (this.config.fields = { [r2]: this.config.fields }), typeof i2 == "string" && !w(t3, M))) {
        let e12 = w(t3, D) ? t3._.selectedFields : w(t3, I) ? t3[O].selectedFields : t3[k.Symbol.Columns];
        this.config.fields[i2] = e12;
      }
      if (typeof n2 == "function" && (n2 = n2(new Proxy(this.config.fields, new U({
        sqlAliasedBehavior: "sql",
        sqlBehavior: "sql"
      })))), this.config.joins || (this.config.joins = []), this.config.joins.push({
        on: n2,
        table: t3,
        joinType: e11,
        alias: i2
      }), typeof i2 == "string") switch (e11) {
        case "left":
          this.joinsNotNullableMap[i2] = false;
          break;
        case "right":
          this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([e12]) => [e12, false])), this.joinsNotNullableMap[i2] = true;
          break;
        case "cross":
        case "inner":
          this.joinsNotNullableMap[i2] = true;
          break;
        case "full":
          this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([e12]) => [e12, false])), this.joinsNotNullableMap[i2] = false;
          break;
      }
      return this;
    };
  }
  leftJoin = this.createJoin("left");
  rightJoin = this.createJoin("right");
  innerJoin = this.createJoin("inner");
  fullJoin = this.createJoin("full");
  crossJoin = this.createJoin("cross");
  createSetOperator(e11, t3) {
    return (n2) => {
      let r2 = typeof n2 == "function" ? n2(ui()) : n2;
      if (!bn(this.getSelectedFields(), r2.getSelectedFields())) throw Error("Set operator error (union / intersect / except): selected fields are not the same or are in a different order");
      return this.config.setOperators.push({
        type: e11,
        isAll: t3,
        rightSelect: r2
      }), this;
    };
  }
  union = this.createSetOperator("union", false);
  unionAll = this.createSetOperator("union", true);
  intersect = this.createSetOperator("intersect", false);
  except = this.createSetOperator("except", false);
  addSetOperators(e11) {
    return this.config.setOperators.push(...e11), this;
  }
  where(e11) {
    return typeof e11 == "function" && (e11 = e11(new Proxy(this.config.fields, new U({
      sqlAliasedBehavior: "sql",
      sqlBehavior: "sql"
    })))), this.config.where = e11, this;
  }
  having(e11) {
    return typeof e11 == "function" && (e11 = e11(new Proxy(this.config.fields, new U({
      sqlAliasedBehavior: "sql",
      sqlBehavior: "sql"
    })))), this.config.having = e11, this;
  }
  groupBy(...e11) {
    if (typeof e11[0] == "function") {
      let t3 = e11[0](new Proxy(this.config.fields, new U({
        sqlAliasedBehavior: "alias",
        sqlBehavior: "sql"
      })));
      this.config.groupBy = Array.isArray(t3) ? t3 : [t3];
    } else this.config.groupBy = e11;
    return this;
  }
  orderBy(...e11) {
    if (typeof e11[0] == "function") {
      let t3 = e11[0](new Proxy(this.config.fields, new U({
        sqlAliasedBehavior: "alias",
        sqlBehavior: "sql"
      }))), n2 = Array.isArray(t3) ? t3 : [t3];
      this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).orderBy = n2 : this.config.orderBy = n2;
    } else {
      let t3 = e11;
      this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).orderBy = t3 : this.config.orderBy = t3;
    }
    return this;
  }
  limit(e11) {
    return this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).limit = e11 : this.config.limit = e11, this;
  }
  offset(e11) {
    return this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).offset = e11 : this.config.offset = e11, this;
  }
  getSQL() {
    return this.dialect.buildSelectQuery(this.config);
  }
  toSQL() {
    let { typings: e11, ...t3 } = this.dialect.sqlToQuery(this.getSQL());
    return t3;
  }
  as(e11) {
    let t3 = [];
    if (t3.push(...Y(this.config.table)), this.config.joins) for (let e12 of this.config.joins) t3.push(...Y(e12.table));
    return new Proxy(new D(this.getSQL(), this.config.fields, e11, false, [...new Set(t3)]), new U({
      alias: e11,
      sqlAliasedBehavior: "alias",
      sqlBehavior: "error"
    }));
  }
  getSelectedFields() {
    return new Proxy(this.config.fields, new U({
      alias: this.tableName,
      sqlAliasedBehavior: "alias",
      sqlBehavior: "error"
    }));
  }
  $dynamic() {
    return this;
  }
};
var ci = class extends si {
  static {
    __name(this, "ci");
  }
  static [C] = "SQLiteSelect";
  _prepare(e11 = true) {
    if (!this.session) throw Error("Cannot execute a query on a query builder. Please use a database instance instead.");
    let t3 = B(this.config.fields), n2 = this.session[e11 ? "prepareOneTimeQuery" : "prepareQuery"](this.dialect.sqlToQuery(this.getSQL()), t3, "all", true, void 0, {
      type: "select",
      tables: [...this.usedTables]
    }, this.cacheConfig);
    return n2.joinsNotNullableMap = this.joinsNotNullableMap, n2;
  }
  $withCache(e11) {
    return this.cacheConfig = e11 === void 0 ? {
      config: {},
      enable: true,
      autoInvalidate: true
    } : e11 === false ? { enable: false } : {
      enable: true,
      autoInvalidate: true,
      ...e11
    }, this;
  }
  prepare() {
    return this._prepare(false);
  }
  run = /* @__PURE__ */ __name((e11) => this._prepare().run(e11), "run");
  all = /* @__PURE__ */ __name((e11) => this._prepare().all(e11), "all");
  get = /* @__PURE__ */ __name((e11) => this._prepare().get(e11), "get");
  values = /* @__PURE__ */ __name((e11) => this._prepare().values(e11), "values");
  async execute() {
    return this.all();
  }
};
Sn(ci, [z]);
function li(e11, t3) {
  return (n2, r2, ...i2) => {
    let a2 = [r2, ...i2].map((n3) => ({
      type: e11,
      isAll: t3,
      rightSelect: n3
    }));
    for (let e12 of a2) if (!bn(n2.getSelectedFields(), e12.rightSelect.getSelectedFields())) throw Error("Set operator error (union / intersect / except): selected fields are not the same or are in a different order");
    return n2.addSetOperators(a2);
  };
}
__name(li, "li");
var ui = /* @__PURE__ */ __name(() => ({
  union: di,
  unionAll: fi,
  intersect: pi,
  except: mi
}), "ui");
var di = li("union", false);
var fi = li("union", true);
var pi = li("intersect", false);
var mi = li("except", false);
var hi = class {
  static {
    __name(this, "hi");
  }
  static [C] = "SQLiteQueryBuilder";
  dialect;
  dialectConfig;
  constructor(e11) {
    this.dialect = w(e11, ri) ? e11 : void 0, this.dialectConfig = w(e11, ri) ? void 0 : e11;
  }
  $with = /* @__PURE__ */ __name((e11, t3) => {
    let n2 = this;
    return { as: /* @__PURE__ */ __name((r2) => (typeof r2 == "function" && (r2 = r2(n2)), new Proxy(new Ut(r2.getSQL(), t3 ?? ("getSelectedFields" in r2 ? r2.getSelectedFields() ?? {} : {}), e11, true), new U({
      alias: e11,
      sqlAliasedBehavior: "alias",
      sqlBehavior: "error"
    }))), "as") };
  }, "$with");
  with(...e11) {
    let t3 = this;
    function n2(n3) {
      return new X({
        fields: n3 ?? void 0,
        session: void 0,
        dialect: t3.getDialect(),
        withList: e11
      });
    }
    __name(n2, "n");
    function r2(n3) {
      return new X({
        fields: n3 ?? void 0,
        session: void 0,
        dialect: t3.getDialect(),
        withList: e11,
        distinct: true
      });
    }
    __name(r2, "r");
    return {
      select: n2,
      selectDistinct: r2
    };
  }
  select(e11) {
    return new X({
      fields: e11 ?? void 0,
      session: void 0,
      dialect: this.getDialect()
    });
  }
  selectDistinct(e11) {
    return new X({
      fields: e11 ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: true
    });
  }
  getDialect() {
    return this.dialect ||= new ii(this.dialectConfig), this.dialect;
  }
};
var gi = class {
  static {
    __name(this, "gi");
  }
  constructor(e11, t3, n2, r2) {
    this.table = e11, this.session = t3, this.dialect = n2, this.withList = r2;
  }
  static [C] = "SQLiteInsertBuilder";
  values(e11) {
    if (e11 = Array.isArray(e11) ? e11 : [e11], e11.length === 0) throw Error("values() must be called with at least one value");
    let t3 = e11.map((e12) => {
      let t4 = {}, n2 = this.table[k.Symbol.Columns];
      for (let r2 of Object.keys(e12)) {
        let i2 = e12[r2];
        t4[r2] = w(i2, M) ? i2 : new N(i2, n2[r2]);
      }
      return t4;
    });
    return new _i(this.table, t3, this.session, this.dialect, this.withList);
  }
  select(e11) {
    let t3 = typeof e11 == "function" ? e11(new hi()) : e11;
    if (!w(t3, M) && !bn(this.table[Kt], t3._.selectedFields)) throw Error("Insert select error: selected fields are not the same or are in a different order compared to the table definition");
    return new _i(this.table, t3, this.session, this.dialect, this.withList, true);
  }
};
var _i = class extends z {
  static {
    __name(this, "_i");
  }
  constructor(e11, t3, n2, r2, i2, a2) {
    super(), this.session = n2, this.dialect = r2, this.config = {
      table: e11,
      values: t3,
      withList: i2,
      select: a2
    };
  }
  static [C] = "SQLiteInsert";
  config;
  returning(e11 = this.config.table[J.Symbol.Columns]) {
    return this.config.returning = B(e11), this;
  }
  onConflictDoNothing(e11 = {}) {
    if (this.config.onConflict || (this.config.onConflict = []), e11.target === void 0) this.config.onConflict.push(P` on conflict do nothing`);
    else {
      let t3 = Array.isArray(e11.target) ? P`${e11.target}` : P`${[e11.target]}`, n2 = e11.where ? P` where ${e11.where}` : P``;
      this.config.onConflict.push(P` on conflict ${t3} do nothing${n2}`);
    }
    return this;
  }
  onConflictDoUpdate(e11) {
    if (e11.where && (e11.targetWhere || e11.setWhere)) throw Error('You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.');
    this.config.onConflict || (this.config.onConflict = []);
    let t3 = e11.where ? P` where ${e11.where}` : void 0, n2 = e11.targetWhere ? P` where ${e11.targetWhere}` : void 0, r2 = e11.setWhere ? P` where ${e11.setWhere}` : void 0, i2 = Array.isArray(e11.target) ? P`${e11.target}` : P`${[e11.target]}`, a2 = this.dialect.buildUpdateSet(this.config.table, xn(this.config.table, e11.set));
    return this.config.onConflict.push(P` on conflict ${i2}${n2} do update set ${a2}${t3}${r2}`), this;
  }
  getSQL() {
    return this.dialect.buildInsertQuery(this.config);
  }
  toSQL() {
    let { typings: e11, ...t3 } = this.dialect.sqlToQuery(this.getSQL());
    return t3;
  }
  _prepare(e11 = true) {
    return this.session[e11 ? "prepareOneTimeQuery" : "prepareQuery"](this.dialect.sqlToQuery(this.getSQL()), this.config.returning, this.config.returning ? "all" : "run", true, void 0, {
      type: "insert",
      tables: Y(this.config.table)
    });
  }
  prepare() {
    return this._prepare(false);
  }
  run = /* @__PURE__ */ __name((e11) => this._prepare().run(e11), "run");
  all = /* @__PURE__ */ __name((e11) => this._prepare().all(e11), "all");
  get = /* @__PURE__ */ __name((e11) => this._prepare().get(e11), "get");
  values = /* @__PURE__ */ __name((e11) => this._prepare().values(e11), "values");
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
};
var vi = class {
  static {
    __name(this, "vi");
  }
  constructor(e11, t3, n2, r2) {
    this.table = e11, this.session = t3, this.dialect = n2, this.withList = r2;
  }
  static [C] = "SQLiteUpdateBuilder";
  set(e11) {
    return new yi(this.table, xn(this.table, e11), this.session, this.dialect, this.withList);
  }
};
var yi = class extends z {
  static {
    __name(this, "yi");
  }
  constructor(e11, t3, n2, r2, i2) {
    super(), this.session = n2, this.dialect = r2, this.config = {
      set: t3,
      table: e11,
      withList: i2,
      joins: []
    };
  }
  static [C] = "SQLiteUpdate";
  config;
  from(e11) {
    return this.config.from = e11, this;
  }
  createJoin(e11) {
    return (t3, n2) => {
      let r2 = wn(t3);
      if (typeof r2 == "string" && this.config.joins.some((e12) => e12.alias === r2)) throw Error(`Alias "${r2}" is already used in this query`);
      if (typeof n2 == "function") {
        let e12 = this.config.from ? w(t3, J) ? t3[k.Symbol.Columns] : w(t3, D) ? t3._.selectedFields : w(t3, ni) ? t3[O].selectedFields : void 0 : void 0;
        n2 = n2(new Proxy(this.config.table[k.Symbol.Columns], new U({
          sqlAliasedBehavior: "sql",
          sqlBehavior: "sql"
        })), e12 && new Proxy(e12, new U({
          sqlAliasedBehavior: "sql",
          sqlBehavior: "sql"
        })));
      }
      return this.config.joins.push({
        on: n2,
        table: t3,
        joinType: e11,
        alias: r2
      }), this;
    };
  }
  leftJoin = this.createJoin("left");
  rightJoin = this.createJoin("right");
  innerJoin = this.createJoin("inner");
  fullJoin = this.createJoin("full");
  where(e11) {
    return this.config.where = e11, this;
  }
  orderBy(...e11) {
    if (typeof e11[0] == "function") {
      let t3 = e11[0](new Proxy(this.config.table[k.Symbol.Columns], new U({
        sqlAliasedBehavior: "alias",
        sqlBehavior: "sql"
      }))), n2 = Array.isArray(t3) ? t3 : [t3];
      this.config.orderBy = n2;
    } else {
      let t3 = e11;
      this.config.orderBy = t3;
    }
    return this;
  }
  limit(e11) {
    return this.config.limit = e11, this;
  }
  returning(e11 = this.config.table[J.Symbol.Columns]) {
    return this.config.returning = B(e11), this;
  }
  getSQL() {
    return this.dialect.buildUpdateQuery(this.config);
  }
  toSQL() {
    let { typings: e11, ...t3 } = this.dialect.sqlToQuery(this.getSQL());
    return t3;
  }
  _prepare(e11 = true) {
    return this.session[e11 ? "prepareOneTimeQuery" : "prepareQuery"](this.dialect.sqlToQuery(this.getSQL()), this.config.returning, this.config.returning ? "all" : "run", true, void 0, {
      type: "insert",
      tables: Y(this.config.table)
    });
  }
  prepare() {
    return this._prepare(false);
  }
  run = /* @__PURE__ */ __name((e11) => this._prepare().run(e11), "run");
  all = /* @__PURE__ */ __name((e11) => this._prepare().all(e11), "all");
  get = /* @__PURE__ */ __name((e11) => this._prepare().get(e11), "get");
  values = /* @__PURE__ */ __name((e11) => this._prepare().values(e11), "values");
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
};
var bi = class e9 extends M {
  static {
    __name(this, "e");
  }
  constructor(t3) {
    super(e9.buildEmbeddedCount(t3.source, t3.filters).queryChunks), this.params = t3, this.session = t3.session, this.sql = e9.buildCount(t3.source, t3.filters);
  }
  sql;
  static [C] = "SQLiteCountBuilderAsync";
  [Symbol.toStringTag] = "SQLiteCountBuilderAsync";
  session;
  static buildEmbeddedCount(e11, t3) {
    return P`(select count(*) from ${e11}${P.raw(" where ").if(t3)}${t3})`;
  }
  static buildCount(e11, t3) {
    return P`select count(*) from ${e11}${P.raw(" where ").if(t3)}${t3}`;
  }
  then(e11, t3) {
    return Promise.resolve(this.session.count(this.sql)).then(e11, t3);
  }
  catch(e11) {
    return this.then(void 0, e11);
  }
  finally(e11) {
    return this.then((t3) => (e11?.(), t3), (t3) => {
      throw e11?.(), t3;
    });
  }
};
var xi = class {
  static {
    __name(this, "xi");
  }
  constructor(e11, t3, n2, r2, i2, a2, o2, s2) {
    this.mode = e11, this.fullSchema = t3, this.schema = n2, this.tableNamesMap = r2, this.table = i2, this.tableConfig = a2, this.dialect = o2, this.session = s2;
  }
  static [C] = "SQLiteAsyncRelationalQueryBuilder";
  findMany(e11) {
    return this.mode === "sync" ? new Ci(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, e11 || {}, "many") : new Si(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, e11 || {}, "many");
  }
  findFirst(e11) {
    return this.mode === "sync" ? new Ci(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, e11 ? {
      ...e11,
      limit: 1
    } : { limit: 1 }, "first") : new Si(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, e11 ? {
      ...e11,
      limit: 1
    } : { limit: 1 }, "first");
  }
};
var Si = class extends z {
  static {
    __name(this, "Si");
  }
  constructor(e11, t3, n2, r2, i2, a2, o2, s2, c2) {
    super(), this.fullSchema = e11, this.schema = t3, this.tableNamesMap = n2, this.table = r2, this.tableConfig = i2, this.dialect = a2, this.session = o2, this.config = s2, this.mode = c2;
  }
  static [C] = "SQLiteAsyncRelationalQuery";
  mode;
  getSQL() {
    return this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    }).sql;
  }
  _prepare(e11 = false) {
    let { query: t3, builtQuery: n2 } = this._toSQL();
    return this.session[e11 ? "prepareOneTimeQuery" : "prepareQuery"](n2, void 0, this.mode === "first" ? "get" : "all", true, (e12, n3) => {
      let r2 = e12.map((e13) => dr(this.schema, this.tableConfig, e13, t3.selection, n3));
      return this.mode === "first" ? r2[0] : r2;
    });
  }
  prepare() {
    return this._prepare(false);
  }
  _toSQL() {
    let e11 = this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    });
    return {
      query: e11,
      builtQuery: this.dialect.sqlToQuery(e11.sql)
    };
  }
  toSQL() {
    return this._toSQL().builtQuery;
  }
  executeRaw() {
    return this.mode === "first" ? this._prepare(false).get() : this._prepare(false).all();
  }
  async execute() {
    return this.executeRaw();
  }
};
var Ci = class extends Si {
  static {
    __name(this, "Ci");
  }
  static [C] = "SQLiteSyncRelationalQuery";
  sync() {
    return this.executeRaw();
  }
};
var wi = class extends z {
  static {
    __name(this, "wi");
  }
  constructor(e11, t3, n2, r2, i2) {
    super(), this.execute = e11, this.getSQL = t3, this.dialect = r2, this.mapBatchResult = i2, this.config = { action: n2 };
  }
  static [C] = "SQLiteRaw";
  config;
  getQuery() {
    return {
      ...this.dialect.sqlToQuery(this.getSQL()),
      method: this.config.action
    };
  }
  mapResult(e11, t3) {
    return t3 ? this.mapBatchResult(e11) : e11;
  }
  _prepare() {
    return this;
  }
  isResponseInArrayMode() {
    return false;
  }
};
var Ti = class {
  static {
    __name(this, "Ti");
  }
  constructor(e11, t3, n2, r2) {
    this.resultKind = e11, this.dialect = t3, this.session = n2, this._ = r2 ? {
      schema: r2.schema,
      fullSchema: r2.fullSchema,
      tableNamesMap: r2.tableNamesMap
    } : {
      schema: void 0,
      fullSchema: {},
      tableNamesMap: {}
    }, this.query = {};
    let i2 = this.query;
    if (this._.schema) for (let [a2, o2] of Object.entries(this._.schema)) i2[a2] = new xi(e11, r2.fullSchema, this._.schema, this._.tableNamesMap, r2.fullSchema[a2], o2, t3, n2);
    this.$cache = { invalidate: /* @__PURE__ */ __name(async (e12) => {
    }, "invalidate") };
  }
  static [C] = "BaseSQLiteDatabase";
  query;
  $with = /* @__PURE__ */ __name((e11, t3) => {
    let n2 = this;
    return { as: /* @__PURE__ */ __name((r2) => (typeof r2 == "function" && (r2 = r2(new hi(n2.dialect))), new Proxy(new Ut(r2.getSQL(), t3 ?? ("getSelectedFields" in r2 ? r2.getSelectedFields() ?? {} : {}), e11, true), new U({
      alias: e11,
      sqlAliasedBehavior: "alias",
      sqlBehavior: "error"
    }))), "as") };
  }, "$with");
  $count(e11, t3) {
    return new bi({
      source: e11,
      filters: t3,
      session: this.session
    });
  }
  with(...e11) {
    let t3 = this;
    function n2(n3) {
      return new X({
        fields: n3 ?? void 0,
        session: t3.session,
        dialect: t3.dialect,
        withList: e11
      });
    }
    __name(n2, "n");
    function r2(n3) {
      return new X({
        fields: n3 ?? void 0,
        session: t3.session,
        dialect: t3.dialect,
        withList: e11,
        distinct: true
      });
    }
    __name(r2, "r");
    function i2(n3) {
      return new vi(n3, t3.session, t3.dialect, e11);
    }
    __name(i2, "i");
    function a2(n3) {
      return new gi(n3, t3.session, t3.dialect, e11);
    }
    __name(a2, "a");
    function o2(n3) {
      return new Zr(n3, t3.session, t3.dialect, e11);
    }
    __name(o2, "o");
    return {
      select: n2,
      selectDistinct: r2,
      update: i2,
      insert: a2,
      delete: o2
    };
  }
  select(e11) {
    return new X({
      fields: e11 ?? void 0,
      session: this.session,
      dialect: this.dialect
    });
  }
  selectDistinct(e11) {
    return new X({
      fields: e11 ?? void 0,
      session: this.session,
      dialect: this.dialect,
      distinct: true
    });
  }
  update(e11) {
    return new vi(e11, this.session, this.dialect);
  }
  $cache;
  insert(e11) {
    return new gi(e11, this.session, this.dialect);
  }
  delete(e11) {
    return new Zr(e11, this.session, this.dialect);
  }
  run(e11) {
    let t3 = typeof e11 == "string" ? P.raw(e11) : e11.getSQL();
    return this.resultKind === "async" ? new wi(async () => this.session.run(t3), () => t3, "run", this.dialect, this.session.extractRawRunValueFromBatchResult.bind(this.session)) : this.session.run(t3);
  }
  all(e11) {
    let t3 = typeof e11 == "string" ? P.raw(e11) : e11.getSQL();
    return this.resultKind === "async" ? new wi(async () => this.session.all(t3), () => t3, "all", this.dialect, this.session.extractRawAllValueFromBatchResult.bind(this.session)) : this.session.all(t3);
  }
  get(e11) {
    let t3 = typeof e11 == "string" ? P.raw(e11) : e11.getSQL();
    return this.resultKind === "async" ? new wi(async () => this.session.get(t3), () => t3, "get", this.dialect, this.session.extractRawGetValueFromBatchResult.bind(this.session)) : this.session.get(t3);
  }
  values(e11) {
    let t3 = typeof e11 == "string" ? P.raw(e11) : e11.getSQL();
    return this.resultKind === "async" ? new wi(async () => this.session.values(t3), () => t3, "values", this.dialect, this.session.extractRawValuesValueFromBatchResult.bind(this.session)) : this.session.values(t3);
  }
  transaction(e11, t3) {
    return this.session.transaction(e11, t3);
  }
};
var Ei = class {
  static {
    __name(this, "Ei");
  }
  static [C] = "Cache";
};
var Di = class extends Ei {
  static {
    __name(this, "Di");
  }
  strategy() {
    return "all";
  }
  static [C] = "NoopCache";
  async get(e11) {
  }
  async put(e11, t3, n2, r2) {
  }
  async onMutate(e11) {
  }
};
async function Oi(e11, t3) {
  let n2 = `${e11}-${JSON.stringify(t3)}`, r2 = new TextEncoder().encode(n2), i2 = await crypto.subtle.digest("SHA-256", r2);
  return [...new Uint8Array(i2)].map((e12) => e12.toString(16).padStart(2, "0")).join("");
}
__name(Oi, "Oi");
var ki = class extends z {
  static {
    __name(this, "ki");
  }
  constructor(e11) {
    super(), this.resultCb = e11;
  }
  static [C] = "ExecuteResultSync";
  async execute() {
    return this.resultCb();
  }
  sync() {
    return this.resultCb();
  }
};
var Ai = class {
  static {
    __name(this, "Ai");
  }
  constructor(e11, t3, n2, r2, i2, a2) {
    this.mode = e11, this.executeMethod = t3, this.query = n2, this.cache = r2, this.queryMetadata = i2, this.cacheConfig = a2, r2 && r2.strategy() === "all" && a2 === void 0 && (this.cacheConfig = {
      enable: true,
      autoInvalidate: true
    }), this.cacheConfig?.enable || (this.cacheConfig = void 0);
  }
  static [C] = "PreparedQuery";
  joinsNotNullableMap;
  async queryWithCache(e11, t3, n2) {
    if (this.cache === void 0 || w(this.cache, Di) || this.queryMetadata === void 0) try {
      return await n2();
    } catch (n3) {
      throw new R(e11, t3, n3);
    }
    if (this.cacheConfig && !this.cacheConfig.enable) try {
      return await n2();
    } catch (n3) {
      throw new R(e11, t3, n3);
    }
    if ((this.queryMetadata.type === "insert" || this.queryMetadata.type === "update" || this.queryMetadata.type === "delete") && this.queryMetadata.tables.length > 0) try {
      let [e12] = await Promise.all([n2(), this.cache.onMutate({ tables: this.queryMetadata.tables })]);
      return e12;
    } catch (n3) {
      throw new R(e11, t3, n3);
    }
    if (!this.cacheConfig) try {
      return await n2();
    } catch (n3) {
      throw new R(e11, t3, n3);
    }
    if (this.queryMetadata.type === "select") {
      let r2 = await this.cache.get(this.cacheConfig.tag ?? await Oi(e11, t3), this.queryMetadata.tables, this.cacheConfig.tag !== void 0, this.cacheConfig.autoInvalidate);
      if (r2 === void 0) {
        let r3;
        try {
          r3 = await n2();
        } catch (n3) {
          throw new R(e11, t3, n3);
        }
        return await this.cache.put(this.cacheConfig.tag ?? await Oi(e11, t3), r3, this.cacheConfig.autoInvalidate ? this.queryMetadata.tables : [], this.cacheConfig.tag !== void 0, this.cacheConfig.config), r3;
      }
      return r2;
    }
    try {
      return await n2();
    } catch (n3) {
      throw new R(e11, t3, n3);
    }
  }
  getQuery() {
    return this.query;
  }
  mapRunResult(e11, t3) {
    return e11;
  }
  mapAllResult(e11, t3) {
    throw Error("Not implemented");
  }
  mapGetResult(e11, t3) {
    throw Error("Not implemented");
  }
  execute(e11) {
    return this.mode === "async" ? this[this.executeMethod](e11) : new ki(() => this[this.executeMethod](e11));
  }
  mapResult(e11, t3) {
    switch (this.executeMethod) {
      case "run":
        return this.mapRunResult(e11, t3);
      case "all":
        return this.mapAllResult(e11, t3);
      case "get":
        return this.mapGetResult(e11, t3);
    }
  }
};
var ji = class {
  static {
    __name(this, "ji");
  }
  constructor(e11) {
    this.dialect = e11;
  }
  static [C] = "SQLiteSession";
  prepareOneTimeQuery(e11, t3, n2, r2, i2, a2, o2) {
    return this.prepareQuery(e11, t3, n2, r2, i2, a2, o2);
  }
  run(e11) {
    let t3 = this.dialect.sqlToQuery(e11);
    try {
      return this.prepareOneTimeQuery(t3, void 0, "run", false).run();
    } catch (e12) {
      throw new mn({
        cause: e12,
        message: `Failed to run the query '${t3.sql}'`
      });
    }
  }
  extractRawRunValueFromBatchResult(e11) {
    return e11;
  }
  all(e11) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(e11), void 0, "run", false).all();
  }
  extractRawAllValueFromBatchResult(e11) {
    throw Error("Not implemented");
  }
  get(e11) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(e11), void 0, "run", false).get();
  }
  extractRawGetValueFromBatchResult(e11) {
    throw Error("Not implemented");
  }
  values(e11) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(e11), void 0, "run", false).values();
  }
  async count(e11) {
    return (await this.values(e11))[0][0];
  }
  extractRawValuesValueFromBatchResult(e11) {
    throw Error("Not implemented");
  }
};
var Mi = class extends Ti {
  static {
    __name(this, "Mi");
  }
  constructor(e11, t3, n2, r2, i2 = 0) {
    super(e11, t3, n2, r2), this.schema = r2, this.nestedIndex = i2;
  }
  static [C] = "SQLiteTransaction";
  rollback() {
    throw new hn();
  }
};
var Ni = class extends ji {
  static {
    __name(this, "Ni");
  }
  constructor(e11, t3, n2, r2 = {}) {
    super(t3), this.client = e11, this.schema = n2, this.options = r2, this.logger = r2.logger ?? new vn(), this.cache = r2.cache ?? new Di();
  }
  static [C] = "SQLiteD1Session";
  logger;
  cache;
  prepareQuery(e11, t3, n2, r2, i2, a2, o2) {
    return new Ii(this.client.prepare(e11.sql), e11, this.logger, this.cache, a2, o2, t3, n2, r2, i2);
  }
  async batch(e11) {
    let t3 = [], n2 = [];
    for (let r2 of e11) {
      let e12 = r2._prepare(), i2 = e12.getQuery();
      if (t3.push(e12), i2.params.length > 0) n2.push(e12.stmt.bind(...i2.params));
      else {
        let t4 = e12.getQuery();
        n2.push(this.client.prepare(t4.sql).bind(...t4.params));
      }
    }
    return (await this.client.batch(n2)).map((e12, n3) => t3[n3].mapResult(e12, true));
  }
  extractRawAllValueFromBatchResult(e11) {
    return e11.results;
  }
  extractRawGetValueFromBatchResult(e11) {
    return e11.results[0];
  }
  extractRawValuesValueFromBatchResult(e11) {
    return Fi(e11.results);
  }
  async transaction(e11, t3) {
    let n2 = new Pi("async", this.dialect, this, this.schema);
    await this.run(P.raw(`begin${t3?.behavior ? " " + t3.behavior : ""}`));
    try {
      let t4 = await e11(n2);
      return await this.run(P`commit`), t4;
    } catch (e12) {
      throw await this.run(P`rollback`), e12;
    }
  }
};
var Pi = class e10 extends Mi {
  static {
    __name(this, "e");
  }
  static [C] = "D1Transaction";
  async transaction(t3) {
    let n2 = `sp${this.nestedIndex}`, r2 = new e10("async", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    await this.session.run(P.raw(`savepoint ${n2}`));
    try {
      let e11 = await t3(r2);
      return await this.session.run(P.raw(`release savepoint ${n2}`)), e11;
    } catch (e11) {
      throw await this.session.run(P.raw(`rollback to savepoint ${n2}`)), e11;
    }
  }
};
function Fi(e11) {
  let t3 = [];
  for (let n2 of e11) {
    let e12 = Object.keys(n2).map((e13) => n2[e13]);
    t3.push(e12);
  }
  return t3;
}
__name(Fi, "Fi");
var Ii = class extends Ai {
  static {
    __name(this, "Ii");
  }
  constructor(e11, t3, n2, r2, i2, a2, o2, s2, c2, l2) {
    super("async", s2, t3, r2, i2, a2), this.logger = n2, this._isResponseInArrayMode = c2, this.customResultMapper = l2, this.fields = o2, this.stmt = e11;
  }
  static [C] = "D1PreparedQuery";
  customResultMapper;
  fields;
  stmt;
  async run(e11) {
    let t3 = sn(this.query.params, e11 ?? {});
    return this.logger.logQuery(this.query.sql, t3), await this.queryWithCache(this.query.sql, t3, async () => this.stmt.bind(...t3).run());
  }
  async all(e11) {
    let { fields: t3, query: n2, logger: r2, stmt: i2, customResultMapper: a2 } = this;
    if (!t3 && !a2) {
      let t4 = sn(n2.params, e11 ?? {});
      return r2.logQuery(n2.sql, t4), await this.queryWithCache(n2.sql, t4, async () => i2.bind(...t4).all().then(({ results: e12 }) => this.mapAllResult(e12)));
    }
    let o2 = await this.values(e11);
    return this.mapAllResult(o2);
  }
  mapAllResult(e11, t3) {
    return t3 && (e11 = Fi(e11.results)), !this.fields && !this.customResultMapper ? e11 : this.customResultMapper ? this.customResultMapper(e11) : e11.map((e12) => yn(this.fields, e12, this.joinsNotNullableMap));
  }
  async get(e11) {
    let { fields: t3, joinsNotNullableMap: n2, query: r2, logger: i2, stmt: a2, customResultMapper: o2 } = this;
    if (!t3 && !o2) {
      let t4 = sn(r2.params, e11 ?? {});
      return i2.logQuery(r2.sql, t4), await this.queryWithCache(r2.sql, t4, async () => a2.bind(...t4).all().then(({ results: e12 }) => e12[0]));
    }
    let s2 = await this.values(e11);
    if (s2[0]) return o2 ? o2(s2) : yn(t3, s2[0], n2);
  }
  mapGetResult(e11, t3) {
    return t3 && (e11 = Fi(e11.results)[0]), !this.fields && !this.customResultMapper ? e11 : this.customResultMapper ? this.customResultMapper([e11]) : yn(this.fields, e11, this.joinsNotNullableMap);
  }
  async values(e11) {
    let t3 = sn(this.query.params, e11 ?? {});
    return this.logger.logQuery(this.query.sql, t3), await this.queryWithCache(this.query.sql, t3, async () => this.stmt.bind(...t3).raw());
  }
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
};
var Li = class extends Ti {
  static {
    __name(this, "Li");
  }
  static [C] = "D1Database";
  async batch(e11) {
    return this.session.batch(e11);
  }
};
function Ri(e11, t3 = {}) {
  let n2 = new ai({ casing: t3.casing }), r2;
  t3.logger === true ? r2 = new _n() : t3.logger !== false && (r2 = t3.logger);
  let i2;
  if (t3.schema) {
    let e12 = or(t3.schema, ur);
    i2 = {
      fullSchema: t3.schema,
      schema: e12.tables,
      tableNamesMap: e12.tableNamesMap
    };
  }
  let a2 = new Li("async", n2, new Ni(e11, n2, i2, {
    logger: r2,
    cache: t3.cache
  }), i2);
  return a2.$client = e11, a2.$cache = t3.cache, a2.$cache && (a2.$cache.invalidate = t3.cache?.onMutate), a2;
}
__name(Ri, "Ri");
var Z = Xr("players", {
  id: K("id").primaryKey({ autoIncrement: true }),
  username: q("username").notNull().unique(),
  passwordHash: q("password_hash").notNull(),
  hp: K("hp").notNull().default(100),
  maxHp: K("max_hp").notNull().default(100),
  mp: K("mp").notNull().default(50),
  maxMp: K("max_mp").notNull().default(50),
  location: q("location").notNull().default("roanoa"),
  gold: K("gold").notNull().default(100),
  level: K("level").notNull().default(1),
  experience: K("experience").notNull().default(0)
});
var Q = Xr("items", {
  id: K("id").primaryKey({ autoIncrement: true }),
  name: q("name").notNull(),
  type: q("type").notNull(),
  description: q("description").notNull(),
  price: K("price").notNull(),
  power: K("power").notNull().default(0)
});
var $ = Xr("inventory", {
  id: K("id").primaryKey({ autoIncrement: true }),
  playerId: K("player_id").notNull().references(() => Z.id),
  itemId: K("item_id").notNull().references(() => Q.id),
  quantity: K("quantity").notNull().default(1)
});
var zi = new Ve();
async function Bi(e11) {
  let t3 = new TextEncoder().encode(e11), n2 = await crypto.subtle.digest("SHA-256", t3);
  return Array.from(new Uint8Array(n2)).map((e12) => e12.toString(16).padStart(2, "0")).join("");
}
__name(Bi, "Bi");
zi.post("/register", async (e11) => {
  let { username: t3, password: n2 } = await e11.req.json(), r2 = Ri(e11.env.DB), i2 = e11.env.JWT_SECRET || "super-secret-mushoku-key";
  if (await r2.select().from(Z).where(H(Z.username, t3)).get()) return e11.json({ error: "Username already exists" }, 400);
  let a2 = await Bi(n2), o2 = await r2.insert(Z).values({
    username: t3,
    passwordHash: a2,
    location: "roanoa",
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    gold: 100,
    level: 1,
    experience: 0
  }).returning().get(), s2 = await zt({
    id: o2.id,
    username: t3,
    exp: Math.floor(Date.now() / 1e3) + 3600 * 24
  }, i2);
  return e11.json({
    token: s2,
    player: {
      id: o2.id,
      username: o2.username
    }
  });
}), zi.post("/login", async (e11) => {
  let { username: t3, password: n2 } = await e11.req.json(), r2 = Ri(e11.env.DB), i2 = e11.env.JWT_SECRET || "super-secret-mushoku-key", a2 = await r2.select().from(Z).where(H(Z.username, t3)).get();
  if (!a2) return e11.json({ error: "Invalid credentials" }, 401);
  let o2 = await Bi(n2);
  if (a2.passwordHash !== o2) return e11.json({ error: "Invalid credentials" }, 401);
  let s2 = await zt({
    id: a2.id,
    username: t3,
    exp: Math.floor(Date.now() / 1e3) + 3600 * 24
  }, i2);
  return e11.json({
    token: s2,
    player: {
      id: a2.id,
      username: a2.username
    }
  });
});
var Vi = new Ve();
Vi.use("*", async (e11, t3) => {
  let n2 = e11.req.header("Authorization");
  if (!n2 || !n2.startsWith("Bearer ")) return e11.json({ error: "Unauthorized" }, 401);
  let r2 = n2.split(" ")[1], i2 = e11.env.JWT_SECRET || "super-secret-mushoku-key";
  try {
    let n3 = await Rt(r2, i2, "HS256");
    e11.set("jwtPayload", n3), await t3();
  } catch {
    return e11.json({ error: "Unauthorized" }, 401);
  }
}), Vi.get("/player", async (e11) => {
  let t3 = e11.get("jwtPayload"), n2 = await Ri(e11.env.DB).select().from(Z).where(H(Z.id, t3.id)).get();
  return n2 ? e11.json({ player: n2 }) : e11.json({ error: "Player not found" }, 404);
}), Vi.get("/inventory", async (e11) => {
  let t3 = e11.get("jwtPayload"), n2 = await Ri(e11.env.DB).select({
    id: $.id,
    itemId: $.itemId,
    quantity: $.quantity,
    name: Q.name,
    type: Q.type,
    description: Q.description,
    power: Q.power
  }).from($).innerJoin(Q, H($.itemId, Q.id)).where(H($.playerId, t3.id)).all();
  return e11.json({ items: n2 });
});
var Hi = new Ve();
Hi.use("*", Je()), Hi.onError((e11, t3) => (console.error(`${e11}`), t3.json({
  error: e11.message,
  stack: e11.stack,
  cause: "Internal Server Error"
}, 500)));
var Ui = Hi.basePath("/api");
Ui.get("/health", (e11) => e11.json({
  status: "ok",
  server: "Hono + Vite integration"
})), Ui.get("/debug-db", async (e11) => {
  try {
    let t3 = await e11.env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    return t3.results.some((e12) => e12.name === "players") ? e11.json({
      success: true,
      tables: t3.results,
      db_initialized: true
    }) : (await e11.env.DB.batch([
      e11.env.DB.prepare("CREATE TABLE IF NOT EXISTS players (id integer PRIMARY KEY AUTOINCREMENT NOT NULL, username text NOT NULL, password_hash text NOT NULL, hp integer DEFAULT 100 NOT NULL, max_hp integer DEFAULT 100 NOT NULL, mp integer DEFAULT 50 NOT NULL, max_mp integer DEFAULT 50 NOT NULL, location text DEFAULT 'roanoa' NOT NULL, gold integer DEFAULT 100 NOT NULL, level integer DEFAULT 1 NOT NULL, experience integer DEFAULT 0 NOT NULL)"),
      e11.env.DB.prepare("CREATE TABLE IF NOT EXISTS items (id integer PRIMARY KEY AUTOINCREMENT NOT NULL, name text NOT NULL, type text NOT NULL, description text NOT NULL, price integer NOT NULL, power integer DEFAULT 0 NOT NULL)"),
      e11.env.DB.prepare("CREATE TABLE IF NOT EXISTS inventory (id integer PRIMARY KEY AUTOINCREMENT NOT NULL, player_id integer NOT NULL, item_id integer NOT NULL, quantity integer DEFAULT 1 NOT NULL)"),
      e11.env.DB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS players_username_unique ON players (username)")
    ]), e11.json({
      success: true,
      message: "Database initialized successfully!",
      tables_created: true
    }));
  } catch (t3) {
    return e11.json({
      success: false,
      error: t3.message
    });
  }
}), Ui.route("/auth", zi), Ui.route("/game", Vi), Hi.get("*", async (e11) => e11.env.ASSETS ? await e11.env.ASSETS.fetch(e11.req.raw) : e11.notFound());

// ../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e11) {
      console.error("Failed to drain the unused request body.", e11);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e11) {
  return {
    name: e11?.name,
    message: e11?.message ?? String(e11),
    stack: e11?.stack,
    cause: e11?.cause === void 0 ? void 0 : reduceError(e11.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e11) {
    const error = reduceError(e11);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-Ggc88Q/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = Hi;

// ../node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-Ggc88Q/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=bundledWorker-0.13708172291341736.mjs.map
