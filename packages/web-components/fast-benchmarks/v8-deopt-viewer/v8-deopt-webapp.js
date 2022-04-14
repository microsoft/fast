!(function (e, t) {
    "object" == typeof exports && "undefined" != typeof module
        ? t(exports)
        : "function" == typeof define && define.amd
        ? define(["exports"], t)
        : t(
              ((e =
                  "undefined" != typeof globalThis
                      ? globalThis
                      : e || self).V8DeoptViewer = {})
          );
})(this, function (e) {
    "use strict";
    var t,
        n,
        r,
        o,
        l,
        a,
        i,
        s,
        u = {},
        c = [],
        p = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
    function d(e, t) {
        for (var n in t) e[n] = t[n];
        return e;
    }
    function _(e) {
        var t = e.parentNode;
        t && t.removeChild(e);
    }
    function f(e, t, n) {
        var r,
            o = arguments,
            l = {};
        for (r in t) "key" !== r && "ref" !== r && (l[r] = t[r]);
        if (arguments.length > 3)
            for (n = [n], r = 3; r < arguments.length; r++) n.push(o[r]);
        if (
            (null != n && (l.children = n),
            "function" == typeof e && null != e.defaultProps)
        )
            for (r in e.defaultProps) void 0 === l[r] && (l[r] = e.defaultProps[r]);
        return h(e, l, t && t.key, t && t.ref, null);
    }
    function h(e, n, r, o, l) {
        var a = {
            type: e,
            props: n,
            key: r,
            ref: o,
            __k: null,
            __: null,
            __b: 0,
            __e: null,
            __d: void 0,
            __c: null,
            constructor: void 0,
            __v: l,
        };
        return null == l && (a.__v = a), t.vnode && t.vnode(a), a;
    }
    function g(e) {
        return e.children;
    }
    function m(e, t) {
        (this.props = e), (this.context = t);
    }
    function v(e, t) {
        if (null == t) return e.__ ? v(e.__, e.__.__k.indexOf(e) + 1) : null;
        for (var n; t < e.__k.length; t++)
            if (null != (n = e.__k[t]) && null != n.__e) return n.__e;
        return "function" == typeof e.type ? v(e) : null;
    }
    function y(e) {
        var t, n;
        if (null != (e = e.__) && null != e.__c) {
            for (e.__e = e.__c.base = null, t = 0; t < e.__k.length; t++)
                if (null != (n = e.__k[t]) && null != n.__e) {
                    e.__e = e.__c.base = n.__e;
                    break;
                }
            return y(e);
        }
    }
    function b(e) {
        ((!e.__d && (e.__d = !0) && r.push(e) && !o++) || a !== t.debounceRendering) &&
            ((a = t.debounceRendering) || l)(w);
    }
    function w() {
        for (var e; (o = r.length); )
            (e = r.sort(function (e, t) {
                return e.__v.__b - t.__v.__b;
            })),
                (r = []),
                e.some(function (e) {
                    var t, n, r, o, l, a, i;
                    e.__d &&
                        ((a = (l = (t = e).__v).__e),
                        (i = t.__P) &&
                            ((n = []),
                            ((r = d({}, l)).__v = r),
                            (o = F(
                                i,
                                l,
                                r,
                                t.__n,
                                void 0 !== i.ownerSVGElement,
                                null,
                                n,
                                null == a ? v(l) : a
                            )),
                            I(n, l),
                            o != a && y(l)));
                });
    }
    function k(e, t, n, r, o, l, a, i, s) {
        var p,
            d,
            f,
            h,
            g,
            m,
            y,
            b = (n && n.__k) || c,
            w = b.length;
        if (
            (i == u && (i = null != l ? l[0] : w ? v(n, 0) : null),
            (p = 0),
            (t.__k = x(t.__k, function (n) {
                if (null != n) {
                    if (
                        ((n.__ = t),
                        (n.__b = t.__b + 1),
                        null === (f = b[p]) || (f && n.key == f.key && n.type === f.type))
                    )
                        b[p] = void 0;
                    else
                        for (d = 0; d < w; d++) {
                            if ((f = b[d]) && n.key == f.key && n.type === f.type) {
                                b[d] = void 0;
                                break;
                            }
                            f = null;
                        }
                    if (
                        ((h = F(e, n, (f = f || u), r, o, l, a, i, s)),
                        (d = n.ref) &&
                            f.ref != d &&
                            (y || (y = []),
                            f.ref && y.push(f.ref, null, n),
                            y.push(d, n.__c || h, n)),
                        null != h)
                    ) {
                        var c;
                        if ((null == m && (m = h), void 0 !== n.__d))
                            (c = n.__d), (n.__d = void 0);
                        else if (l == f || h != i || null == h.parentNode) {
                            e: if (null == i || i.parentNode !== e)
                                e.appendChild(h), (c = null);
                            else {
                                for (g = i, d = 0; (g = g.nextSibling) && d < w; d += 2)
                                    if (g == h) break e;
                                e.insertBefore(h, i), (c = i);
                            }
                            "option" == t.type && (e.value = "");
                        }
                        (i = void 0 !== c ? c : h.nextSibling),
                            "function" == typeof t.type && (t.__d = i);
                    } else i && f.__e == i && i.parentNode != e && (i = v(f));
                }
                return p++, n;
            })),
            (t.__e = m),
            null != l && "function" != typeof t.type)
        )
            for (p = l.length; p--; ) null != l[p] && _(l[p]);
        for (p = w; p--; ) null != b[p] && T(b[p], b[p]);
        if (y) for (p = 0; p < y.length; p++) P(y[p], y[++p], y[++p]);
    }
    function x(e, t, n) {
        if ((null == n && (n = []), null == e || "boolean" == typeof e))
            t && n.push(t(null));
        else if (Array.isArray(e)) for (var r = 0; r < e.length; r++) x(e[r], t, n);
        else
            n.push(
                t
                    ? t(
                          "string" == typeof e || "number" == typeof e
                              ? h(null, e, null, null, e)
                              : null != e.__e || null != e.__c
                              ? h(e.type, e.props, e.key, null, e.__v)
                              : e
                      )
                    : e
            );
        return n;
    }
    function S(e, t, n) {
        "-" === t[0]
            ? e.setProperty(t, n)
            : (e[t] =
                  "number" == typeof n && !1 === p.test(t)
                      ? n + "px"
                      : null == n
                      ? ""
                      : n);
    }
    function A(e, t, n, r, o) {
        var l, a, i, s, u;
        if (
            (o ? "className" === t && (t = "class") : "class" === t && (t = "className"),
            "style" === t)
        )
            if (((l = e.style), "string" == typeof n)) l.cssText = n;
            else {
                if (("string" == typeof r && ((l.cssText = ""), (r = null)), r))
                    for (s in r) (n && s in n) || S(l, s, "");
                if (n) for (u in n) (r && n[u] === r[u]) || S(l, u, n[u]);
            }
        else
            "o" === t[0] && "n" === t[1]
                ? ((a = t !== (t = t.replace(/Capture$/, ""))),
                  (i = t.toLowerCase()),
                  (t = (i in e ? i : t).slice(2)),
                  n
                      ? (r || e.addEventListener(t, E, a), ((e.l || (e.l = {}))[t] = n))
                      : e.removeEventListener(t, E, a))
                : "list" !== t &&
                  "tagName" !== t &&
                  "form" !== t &&
                  "type" !== t &&
                  "size" !== t &&
                  !o &&
                  t in e
                ? (e[t] = null == n ? "" : n)
                : "function" != typeof n &&
                  "dangerouslySetInnerHTML" !== t &&
                  (t !== (t = t.replace(/^xlink:?/, ""))
                      ? null == n || !1 === n
                          ? e.removeAttributeNS(
                                "http://www.w3.org/1999/xlink",
                                t.toLowerCase()
                            )
                          : e.setAttributeNS(
                                "http://www.w3.org/1999/xlink",
                                t.toLowerCase(),
                                n
                            )
                      : null == n || (!1 === n && !/^ar/.test(t))
                      ? e.removeAttribute(t)
                      : e.setAttribute(t, n));
    }
    function E(e) {
        this.l[e.type](t.event ? t.event(e) : e);
    }
    function F(e, n, r, o, l, a, i, s, u) {
        var c,
            p,
            _,
            f,
            h,
            v,
            y,
            b,
            w,
            x,
            S = n.type;
        if (void 0 !== n.constructor) return null;
        (c = t.__b) && c(n);
        try {
            e: if ("function" == typeof S) {
                if (
                    ((b = n.props),
                    (w = (c = S.contextType) && o[c.__c]),
                    (x = c ? (w ? w.props.value : c.__) : o),
                    r.__c
                        ? (y = (p = n.__c = r.__c).__ = p.__E)
                        : ("prototype" in S && S.prototype.render
                              ? (n.__c = p = new S(b, x))
                              : ((n.__c = p = new m(b, x)),
                                (p.constructor = S),
                                (p.render = L)),
                          w && w.sub(p),
                          (p.props = b),
                          p.state || (p.state = {}),
                          (p.context = x),
                          (p.__n = o),
                          (_ = p.__d = !0),
                          (p.__h = [])),
                    null == p.__s && (p.__s = p.state),
                    null != S.getDerivedStateFromProps &&
                        (p.__s == p.state && (p.__s = d({}, p.__s)),
                        d(p.__s, S.getDerivedStateFromProps(b, p.__s))),
                    (f = p.props),
                    (h = p.state),
                    _)
                )
                    null == S.getDerivedStateFromProps &&
                        null != p.componentWillMount &&
                        p.componentWillMount(),
                        null != p.componentDidMount && p.__h.push(p.componentDidMount);
                else {
                    if (
                        (null == S.getDerivedStateFromProps &&
                            b !== f &&
                            null != p.componentWillReceiveProps &&
                            p.componentWillReceiveProps(b, x),
                        (!p.__e &&
                            null != p.shouldComponentUpdate &&
                            !1 === p.shouldComponentUpdate(b, p.__s, x)) ||
                            (n.__v === r.__v && !p.__))
                    ) {
                        for (
                            p.props = b,
                                p.state = p.__s,
                                n.__v !== r.__v && (p.__d = !1),
                                p.__v = n,
                                n.__e = r.__e,
                                n.__k = r.__k,
                                p.__h.length && i.push(p),
                                c = 0;
                            c < n.__k.length;
                            c++
                        )
                            n.__k[c] && (n.__k[c].__ = n);
                        break e;
                    }
                    null != p.componentWillUpdate && p.componentWillUpdate(b, p.__s, x),
                        null != p.componentDidUpdate &&
                            p.__h.push(function () {
                                p.componentDidUpdate(f, h, v);
                            });
                }
                (p.context = x),
                    (p.props = b),
                    (p.state = p.__s),
                    (c = t.__r) && c(n),
                    (p.__d = !1),
                    (p.__v = n),
                    (p.__P = e),
                    (c = p.render(p.props, p.state, p.context)),
                    (n.__k =
                        null != c && c.type == g && null == c.key
                            ? c.props.children
                            : Array.isArray(c)
                            ? c
                            : [c]),
                    null != p.getChildContext && (o = d(d({}, o), p.getChildContext())),
                    _ ||
                        null == p.getSnapshotBeforeUpdate ||
                        (v = p.getSnapshotBeforeUpdate(f, h)),
                    k(e, n, r, o, l, a, i, s, u),
                    (p.base = n.__e),
                    p.__h.length && i.push(p),
                    y && (p.__E = p.__ = null),
                    (p.__e = !1);
            } else null == a && n.__v === r.__v ? ((n.__k = r.__k), (n.__e = r.__e)) : (n.__e = C(r.__e, n, r, o, l, a, i, u));
            (c = t.diffed) && c(n);
        } catch (e) {
            (n.__v = null), t.__e(e, n, r);
        }
        return n.__e;
    }
    function I(e, n) {
        t.__c && t.__c(n, e),
            e.some(function (n) {
                try {
                    (e = n.__h),
                        (n.__h = []),
                        e.some(function (e) {
                            e.call(n);
                        });
                } catch (e) {
                    t.__e(e, n.__v);
                }
            });
    }
    function C(e, t, n, r, o, l, a, i) {
        var s,
            p,
            d,
            _,
            f,
            h = n.props,
            g = t.props;
        if (((o = "svg" === t.type || o), null != l))
            for (s = 0; s < l.length; s++)
                if (
                    null != (p = l[s]) &&
                    ((null === t.type ? 3 === p.nodeType : p.localName === t.type) ||
                        e == p)
                ) {
                    (e = p), (l[s] = null);
                    break;
                }
        if (null == e) {
            if (null === t.type) return document.createTextNode(g);
            (e = o
                ? document.createElementNS("http://www.w3.org/2000/svg", t.type)
                : document.createElement(t.type, g.is && { is: g.is })),
                (l = null),
                (i = !1);
        }
        if (null === t.type) h !== g && e.data != g && (e.data = g);
        else {
            if (
                (null != l && (l = c.slice.call(e.childNodes)),
                (d = (h = n.props || u).dangerouslySetInnerHTML),
                (_ = g.dangerouslySetInnerHTML),
                !i)
            ) {
                if (h === u)
                    for (h = {}, f = 0; f < e.attributes.length; f++)
                        h[e.attributes[f].name] = e.attributes[f].value;
                (_ || d) &&
                    ((_ && d && _.__html == d.__html) ||
                        (e.innerHTML = (_ && _.__html) || ""));
            }
            (function (e, t, n, r, o) {
                var l;
                for (l in n)
                    "children" === l || "key" === l || l in t || A(e, l, null, n[l], r);
                for (l in t)
                    (o && "function" != typeof t[l]) ||
                        "children" === l ||
                        "key" === l ||
                        "value" === l ||
                        "checked" === l ||
                        n[l] === t[l] ||
                        A(e, l, t[l], n[l], r);
            })(e, g, h, o, i),
                _
                    ? (t.__k = [])
                    : ((t.__k = t.props.children),
                      k(e, t, n, r, "foreignObject" !== t.type && o, l, a, u, i)),
                i ||
                    ("value" in g &&
                        void 0 !== (s = g.value) &&
                        s !== e.value &&
                        A(e, "value", s, h.value, !1),
                    "checked" in g &&
                        void 0 !== (s = g.checked) &&
                        s !== e.checked &&
                        A(e, "checked", s, h.checked, !1));
        }
        return e;
    }
    function P(e, n, r) {
        try {
            "function" == typeof e ? e(n) : (e.current = n);
        } catch (e) {
            t.__e(e, r);
        }
    }
    function T(e, n, r) {
        var o, l, a;
        if (
            (t.unmount && t.unmount(e),
            (o = e.ref) && ((o.current && o.current !== e.__e) || P(o, null, n)),
            r || "function" == typeof e.type || (r = null != (l = e.__e)),
            (e.__e = e.__d = void 0),
            null != (o = e.__c))
        ) {
            if (o.componentWillUnmount)
                try {
                    o.componentWillUnmount();
                } catch (e) {
                    t.__e(e, n);
                }
            o.base = o.__P = null;
        }
        if ((o = e.__k)) for (a = 0; a < o.length; a++) o[a] && T(o[a], n, r);
        null != l && _(l);
    }
    function L(e, t, n) {
        return this.constructor(e, n);
    }
    function D(e, t) {
        var n, r;
        for (r in ((t = d(d({}, e.props), t)),
        arguments.length > 2 && (t.children = c.slice.call(arguments, 2)),
        (n = {}),
        t))
            "key" !== r && "ref" !== r && (n[r] = t[r]);
        return h(e.type, n, t.key || e.key, t.ref || e.ref, null);
    }
    function $(e) {
        var t = {},
            n = {
                __c: "__cC" + s++,
                __: e,
                Consumer: function (e, t) {
                    return e.children(t);
                },
                Provider: function (e) {
                    var r,
                        o = this;
                    return (
                        this.getChildContext ||
                            ((r = []),
                            (this.getChildContext = function () {
                                return (t[n.__c] = o), t;
                            }),
                            (this.shouldComponentUpdate = function (e) {
                                o.props.value !== e.value &&
                                    r.some(function (t) {
                                        (t.context = e.value), b(t);
                                    });
                            }),
                            (this.sub = function (e) {
                                r.push(e);
                                var t = e.componentWillUnmount;
                                e.componentWillUnmount = function () {
                                    r.splice(r.indexOf(e), 1), t && t.call(e);
                                };
                            })),
                        e.children
                    );
                },
            };
        return (n.Consumer.contextType = n), (n.Provider.__ = n), n;
    }
    (t = {
        __e: function (e, t) {
            for (var n, r; (t = t.__); )
                if ((n = t.__c) && !n.__)
                    try {
                        if (
                            (n.constructor &&
                                null != n.constructor.getDerivedStateFromError &&
                                ((r = !0),
                                n.setState(n.constructor.getDerivedStateFromError(e))),
                            null != n.componentDidCatch &&
                                ((r = !0), n.componentDidCatch(e)),
                            r)
                        )
                            return b((n.__E = n));
                    } catch (t) {
                        e = t;
                    }
            throw e;
        },
    }),
        (n = function (e) {
            return null != e && void 0 === e.constructor;
        }),
        (m.prototype.setState = function (e, t) {
            var n;
            (n = this.__s !== this.state ? this.__s : (this.__s = d({}, this.state))),
                "function" == typeof e && (e = e(n, this.props)),
                e && d(n, e),
                null != e && this.__v && (t && this.__h.push(t), b(this));
        }),
        (m.prototype.forceUpdate = function (e) {
            this.__v && ((this.__e = !0), e && this.__h.push(e), b(this));
        }),
        (m.prototype.render = g),
        (r = []),
        (o = 0),
        (l =
            "function" == typeof Promise
                ? Promise.prototype.then.bind(Promise.resolve())
                : setTimeout),
        (i = u),
        (s = 0),
        "undefined" != typeof window &&
            window.__PREACT_DEVTOOLS__ &&
            window.__PREACT_DEVTOOLS__.attachPreact("10.4.1", t, {
                Fragment: g,
                Component: m,
            });
    var N,
        j,
        M,
        H = 0,
        O = [],
        z = t.__r,
        R = t.diffed,
        U = t.__c,
        W = t.unmount;
    function V(e, n) {
        t.__h && t.__h(j, e, H || n), (H = 0);
        var r = j.__H || (j.__H = { __: [], __h: [] });
        return e >= r.__.length && r.__.push({}), r.__[e];
    }
    function B(e) {
        return (H = 1), G(ne, e);
    }
    function G(e, t, n) {
        var r = V(N++, 2);
        return (
            r.__c ||
                ((r.__c = j),
                (r.__ = [
                    n ? n(t) : ne(void 0, t),
                    function (t) {
                        var n = e(r.__[0], t);
                        r.__[0] !== n && ((r.__[0] = n), r.__c.setState({}));
                    },
                ])),
            r.__
        );
    }
    function Z(e, n) {
        var r = V(N++, 3);
        !t.__s && te(r.__H, n) && ((r.__ = e), (r.__H = n), j.__H.__h.push(r));
    }
    function q(e) {
        return (
            (H = 5),
            Y(function () {
                return { current: e };
            }, [])
        );
    }
    function Y(e, t) {
        var n = V(N++, 7);
        return te(n.__H, t) ? ((n.__H = t), (n.__h = e), (n.__ = e())) : n.__;
    }
    function K(e, t) {
        return (
            (H = 8),
            Y(function () {
                return e;
            }, t)
        );
    }
    function Q(e) {
        var t = j.context[e.__c],
            n = V(N++, 9);
        return (
            (n.__c = e),
            t ? (null == n.__ && ((n.__ = !0), t.sub(j)), t.props.value) : e.__
        );
    }
    function J() {
        O.some(function (e) {
            if (e.__P)
                try {
                    e.__H.__h.forEach(X), e.__H.__h.forEach(ee), (e.__H.__h = []);
                } catch (n) {
                    return (e.__H.__h = []), t.__e(n, e.__v), !0;
                }
        }),
            (O = []);
    }
    function X(e) {
        e.t && e.t();
    }
    function ee(e) {
        var t = e.__();
        "function" == typeof t && (e.t = t);
    }
    function te(e, t) {
        return (
            !e ||
            t.some(function (t, n) {
                return t !== e[n];
            })
        );
    }
    function ne(e, t) {
        return "function" == typeof t ? t(e) : t;
    }
    (t.__r = function (e) {
        z && z(e),
            (N = 0),
            (j = e.__c).__H &&
                (j.__H.__h.forEach(X), j.__H.__h.forEach(ee), (j.__H.__h = []));
    }),
        (t.diffed = function (e) {
            R && R(e);
            var n = e.__c;
            if (n) {
                var r = n.__H;
                r &&
                    r.__h.length &&
                    ((1 !== O.push(n) && M === t.requestAnimationFrame) ||
                        (
                            (M = t.requestAnimationFrame) ||
                            function (e) {
                                var t,
                                    n = function () {
                                        clearTimeout(r),
                                            cancelAnimationFrame(t),
                                            setTimeout(e);
                                    },
                                    r = setTimeout(n, 100);
                                "undefined" != typeof window &&
                                    (t = requestAnimationFrame(n));
                            }
                        )(J));
            }
        }),
        (t.__c = function (e, n) {
            n.some(function (e) {
                try {
                    e.__h.forEach(X),
                        (e.__h = e.__h.filter(function (e) {
                            return !e.__ || ee(e);
                        }));
                } catch (r) {
                    n.some(function (e) {
                        e.__h && (e.__h = []);
                    }),
                        (n = []),
                        t.__e(r, e.__v);
                }
            }),
                U && U(e, n);
        }),
        (t.unmount = function (e) {
            W && W(e);
            var n = e.__c;
            if (n) {
                var r = n.__H;
                if (r)
                    try {
                        r.__.forEach(function (e) {
                            return e.t && e.t();
                        });
                    } catch (e) {
                        t.__e(e, n.__v);
                    }
            }
        });
    var re = ({ base: e = "" } = {}) => {
        const [t, n] = B(ae(e)),
            r = q(t);
        Z(() => {
            le();
            const t = () => {
                    const t = ae(e);
                    r.current !== t && n((r.current = t));
                },
                o = ["popstate", "pushState", "replaceState"];
            return (
                o.map(e => addEventListener(e, t)),
                t(),
                () => o.map(e => removeEventListener(e, t))
            );
        }, [e]);
        return [
            t,
            K(
                (t, { replace: n = !1 } = {}) =>
                    history[n ? "replaceState" : "pushState"](0, 0, e + t),
                [e]
            ),
        ];
    };
    let oe = 0;
    const le = () => {
            if (!oe)
                return (
                    ["pushState", "replaceState"].map(e => {
                        const t = history[e];
                        history[e] = function () {
                            const n = t.apply(this, arguments),
                                r = new Event(e);
                            return (r.arguments = arguments), dispatchEvent(r), n;
                        };
                    }),
                    (oe = 1)
                );
        },
        ae = (e, t = location.pathname) => (t.indexOf(e) ? t : t.slice(e.length) || "/");
    function ie(e = ce) {
        let t = {};
        return (n, r) => {
            const { regexp: o, keys: l } = (n => t[n] || (t[n] = e(n)))(n || ""),
                a = o.exec(r);
            if (!a) return [!1, null];
            return [!0, l.reduce((e, t, n) => ((e[t.name] = a[n + 1]), e), {})];
        };
    }
    const se = e => e.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1"),
        ue = (e, t, n) => {
            let r = e ? "((?:[^\\/]+?)(?:\\/(?:[^\\/]+?))*)" : "([^\\/]+?)";
            return t && n && (r = "(?:\\/" + r + ")"), r + (t ? "?" : "");
        },
        ce = e => {
            const t = /:([A-Za-z0-9_]+)([?+*]?)/g;
            let n = null,
                r = 0,
                o = [],
                l = "";
            for (; null !== (n = t.exec(e)); ) {
                const [a, i, s] = n,
                    u = "+" === s || "*" === s,
                    c = "?" === s || "*" === s,
                    p = c && "/" === e[n.index - 1] ? 1 : 0,
                    d = e.substring(r, n.index - p);
                o.push({ name: i }), (r = t.lastIndex), (l += se(d) + ue(u, c, p));
            }
            return (
                (l += se(e.substring(r))),
                { keys: o, regexp: new RegExp("^" + l + "(?:\\/)?$", "i") }
            );
        },
        pe = $({}),
        de = ({ hook: e = re, base: t = "", matcher: n = ie() } = {}) => ({
            hook: e,
            base: t,
            matcher: n,
        }),
        _e = () => {
            const e = Q(pe);
            return e.v || (e.v = de());
        },
        fe = () => {
            const e = _e();
            return e.hook(e);
        },
        he = e => {
            const [t] = fe();
            return _e().matcher(e, t);
        },
        ge = e => {
            const t = q(),
                n = t.current || (t.current = { v: de(e) });
            return f(pe.Provider, { value: n, children: e.children });
        },
        me = ({ path: e, match: t, component: n, children: r }) => {
            const o = he(e),
                [l, a] = t || o;
            return l
                ? n
                    ? f(n, { params: a })
                    : "function" == typeof r
                    ? r(a)
                    : r
                : null;
        },
        ve = ({ children: e, location: t }) => {
            const { matcher: r } = _e(),
                [o] = fe();
            e = Array.isArray(e) ? e : [e];
            for (const l of e) {
                let e = 0;
                if (n(l) && (e = l.props.path ? r(l.props.path, t || o) : [!0, {}])[0])
                    return D(l, { match: e });
            }
            return null;
        };
    var ye = "spectre_table__AjQ7h",
        be = "spectre_table-striped__1wI1r",
        we = "spectre_table-hover__23pzI",
        ke = "spectre_table-scroll__vDHgd",
        xe = "spectre_btn__34cM9",
        Se = "spectre_form-group__21S24",
        Ae = "spectre_form-label__1dyf2",
        Ee = "spectre_form-select__37WnA",
        Fe = "spectre_icon__2z0JE",
        Ie = "spectre_menu__2W5ZL",
        Ce = "spectre_panel__Faawb",
        Pe = "spectre_tab__2Ezg9",
        Te = "spectre_tab-item__1v5dJ",
        Le = "spectre_tab-block__pZZ2i",
        De = "spectre_icon-back__BF78c",
        $e = "SummaryTable_summaryTable__20CHA",
        Ne = "SummaryTable_grid__1Y-38",
        je = "SummaryTable_codes__3By_k",
        Me = "SummaryTable_deopts__Nv0CH",
        He = "SummaryTable_ics__nhs_8";
    function Oe({ deoptInfo: e, perFileStats: t }) {
        return f(
            "table",
            { class: [$e, Ne, ye, ke, be, we].join(" ") },
            f(
                "thead",
                null,
                f(
                    "tr",
                    { class: "SummaryTable_headers__32AF1" },
                    f("th", null, "File"),
                    f("th", { class: je, colspan: "3" }, "Optimizations"),
                    f("th", { class: Me, colspan: "3" }, "Deoptimizations"),
                    f("th", { class: He, colspan: "3" }, "Inline Caches")
                ),
                f(
                    "tr",
                    { class: "SummaryTable_subheaders___iRur" },
                    f("th", null),
                    f(ze, { class: je }),
                    f(Re, { class: Me }),
                    f(Re, { class: He })
                )
            ),
            f(
                "tbody",
                null,
                Object.keys(t).map((n, r) => {
                    const o = t[n];
                    return f(
                        "tr",
                        { key: n },
                        f(
                            "td",
                            { class: "SummaryTable_fileName__1R35q" },
                            f(
                                "a",
                                { href: `#/file/${r}/codes`, title: n },
                                e.files[n].relativePath
                            )
                        ),
                        f(Ue, { class: je, severities: o.codes }),
                        f(Ue, { class: Me, severities: o.deopts }),
                        f(Ue, { class: He, severities: o.ics })
                    );
                })
            )
        );
    }
    function ze(e) {
        return f(
            g,
            null,
            f("th", { class: e.class }, "Optimized"),
            f("th", { class: e.class }, "Optimizable"),
            f("th", { class: e.class }, "Sev 3")
        );
    }
    function Re(e) {
        return f(
            g,
            null,
            f("th", { class: e.class }, "Sev 1"),
            f("th", { class: e.class }, "Sev 2"),
            f("th", { class: e.class }, "Sev 3")
        );
    }
    function Ue(e) {
        return f(
            g,
            null,
            e.severities.map((t, n) =>
                f("td", { class: [e.class, t > 0 ? We(n + 1) : null].join(" ") }, t)
            )
        );
    }
    function We(e) {
        return e < 1
            ? null
            : 1 == e
            ? "SummaryTable_sev1__3yVnw"
            : 2 == e
            ? "SummaryTable_sev2__2Y4XC"
            : "SummaryTable_sev3__3Tq36";
    }
    function Ve({ deoptInfo: e }) {
        const t = Y(
            () =>
                (function (e) {
                    const t = {},
                        n = Object.keys(e.files);
                    for (let r of n) {
                        const n = e.files[r];
                        t[r] = { codes: [0, 0, 0], deopts: [0, 0, 0], ics: [0, 0, 0] };
                        for (let e of ["codes", "deopts", "ics"]) {
                            const o = n[e];
                            for (let n of o) t[r][e][n.severity - 1]++;
                        }
                    }
                    return t;
                })(e),
            [e]
        );
        return f(g, null, f(Oe, { deoptInfo: e, perFileStats: t }));
    }
    function Be() {
        return window.location.hash.replace(/^#/, "") || "/";
    }
    function Ge() {
        const [e, t] = B(Be());
        Z(() => {
            const e = () => t(Be());
            return (
                window.addEventListener("hashchange", e),
                () => window.removeEventListener("hashchange", e)
            );
        }, []);
        return [e, K(e => (window.location.hash = e), [])];
    }
    const Ze = {
            id: "summary",
            route: "/",
            getHref() {
                return "#" + this.route;
            },
        },
        qe = {
            id: "file",
            route: "/file/:fileId/:tabId?/:path*",
            getHref(e = null, t = null) {
                let n = "#/file/";
                return e && ((n += e + "/"), t && (n += t + "/")), n;
            },
        },
        Ye = {
            id: "codes",
            title: "Optimizations",
            route: "/file/:fileId/codes/:entryId?",
            getHref: (e, t = "") => `#/file/${e}/codes/${t}`,
        },
        Ke = {
            id: "deopts",
            title: "Deoptimizations",
            route: "/file/:fileId/deopts/:entryId?",
            getHref: (e, t = "") => `#/file/${e}/deopts/${t}`,
        },
        Qe = {
            id: "ics",
            title: "Inline Caches",
            route: "/file/:fileId/ics/:entryId?",
            getHref: (e, t = "") => `#/file/${e}/ics/${t}`,
        },
        Je = {
            id: "maps",
            title: "Map Explorer",
            route: "/file/:fileId/maps/:grouping?/:groupValue?/:mapId?",
            getHref(e, t = null, n = null, r = null) {
                let o = `#/file/${e}/maps/`;
                return (
                    t &&
                        ((o += encodeURIComponent(t) + "/"),
                        n &&
                            ((o += encodeURIComponent(n) + "/"),
                            r && (o += encodeURIComponent(r)))),
                    o
                );
            },
        };
    var Xe = "index_v8deoptInfoPanel__3rAXd";
    const et = [Ye, Ke, Qe, Je];
    function tt({ title: e, fileId: t, children: n }) {
        return f(
            "div",
            { class: [Ce, Xe].join(" ") },
            f(
                "div",
                { class: "spectre_panel-header__1-j6v" },
                f("h2", { class: "index_panel_title__Sl-GZ" }, e)
            ),
            f(
                "nav",
                { class: "spectre_panel-nav__3df1g" },
                f(
                    "ul",
                    { class: [Pe, Le].join(" ") },
                    et.map(e => f(nt, { fileId: t, route: e }))
                )
            ),
            f("div", { class: "spectre_panel-body__HLo3Q" }, n)
        );
    }
    function nt({ fileId: e, route: t }) {
        const n = t.getHref(e),
            [r] = he(t.route);
        return f(
            "li",
            { class: [Te, r ? "spectre_active__2iOlD" : null].join(" ") },
            f("a", { class: "index_tabLink__3ffiw", href: n }, t.title)
        );
    }
    function rt(e, t) {
        for (var n in t) e[n] = t[n];
        return e;
    }
    function ot(e, t) {
        for (var n in e) if ("__source" !== n && !(n in t)) return !0;
        for (var r in t) if ("__source" !== r && e[r] !== t[r]) return !0;
        return !1;
    }
    !(function (e) {
        var t, n;
        function r(t) {
            var n;
            return ((n = e.call(this, t) || this).isPureReactComponent = !0), n;
        }
        (n = e),
            ((t = r).prototype = Object.create(n.prototype)),
            (t.prototype.constructor = t),
            (t.__proto__ = n),
            (r.prototype.shouldComponentUpdate = function (e, t) {
                return ot(this.props, e) || ot(this.state, t);
            });
    })(m);
    var lt = t.__b;
    t.__b = function (e) {
        e.type && e.type.t && e.ref && ((e.props.ref = e.ref), (e.ref = null)),
            lt && lt(e);
    };
    var at = t.__e;
    function it(e) {
        return e && (((e = rt({}, e)).__c = null), (e.__k = e.__k && e.__k.map(it))), e;
    }
    function st() {
        (this.__u = 0), (this.o = null), (this.__b = null);
    }
    function ut(e) {
        var t = e.__.__c;
        return t && t.u && t.u(e);
    }
    function ct() {
        (this.i = null), (this.l = null);
    }
    (t.__e = function (e, t, n) {
        if (e.then)
            for (var r, o = t; (o = o.__); )
                if ((r = o.__c) && r.__c) return r.__c(e, t.__c);
        at(e, t, n);
    }),
        ((st.prototype = new m()).__c = function (e, t) {
            var n = this;
            null == n.o && (n.o = []), n.o.push(t);
            var r = ut(n.__v),
                o = !1,
                l = function () {
                    o || ((o = !0), r ? r(a) : a());
                };
            (t.__c = t.componentWillUnmount),
                (t.componentWillUnmount = function () {
                    l(), t.__c && t.__c();
                });
            var a = function () {
                var e;
                if (!--n.__u)
                    for (
                        n.__v.__k[0] = n.state.u, n.setState({ u: (n.__b = null) });
                        (e = n.o.pop());

                    )
                        e.forceUpdate();
            };
            n.__u++ || n.setState({ u: (n.__b = n.__v.__k[0]) }), e.then(l, l);
        }),
        (st.prototype.render = function (e, t) {
            return (
                this.__b && ((this.__v.__k[0] = it(this.__b)), (this.__b = null)),
                [f(m, null, t.u ? null : e.children), t.u && e.fallback]
            );
        });
    var pt = function (e, t, n) {
        if (
            (++n[1] === n[0] && e.l.delete(t),
            e.props.revealOrder && ("t" !== e.props.revealOrder[0] || !e.l.size))
        )
            for (n = e.i; n; ) {
                for (; n.length > 3; ) n.pop()();
                if (n[1] < n[0]) break;
                e.i = n = n[2];
            }
    };
    ((ct.prototype = new m()).u = function (e) {
        var t = this,
            n = ut(t.__v),
            r = t.l.get(e);
        return (
            r[0]++,
            function (o) {
                var l = function () {
                    t.props.revealOrder ? (r.push(o), pt(t, e, r)) : o();
                };
                n ? n(l) : l();
            }
        );
    }),
        (ct.prototype.render = function (e) {
            (this.i = null), (this.l = new Map());
            var t = x(e.children);
            e.revealOrder && "b" === e.revealOrder[0] && t.reverse();
            for (var n = t.length; n--; ) this.l.set(t[n], (this.i = [1, 0, this.i]));
            return e.children;
        }),
        (ct.prototype.componentDidUpdate = ct.prototype.componentDidMount = function () {
            var e = this;
            e.l.forEach(function (t, n) {
                pt(e, n, t);
            });
        });
    !(function () {
        function e() {}
        var t = e.prototype;
        (t.getChildContext = function () {
            return this.props.context;
        }),
            (t.render = function (e) {
                return e.children;
            });
    })();
    var dt = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
    m.prototype.isReactComponent = {};
    var _t =
            ("undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element")) ||
            60103,
        ft = t.event;
    function ht(e, t) {
        e["UNSAFE_" + t] &&
            !e[t] &&
            Object.defineProperty(e, t, {
                configurable: !1,
                get: function () {
                    return this["UNSAFE_" + t];
                },
                set: function (e) {
                    this["UNSAFE_" + t] = e;
                },
            });
    }
    t.event = function (e) {
        ft && (e = ft(e)), (e.persist = function () {});
        var t = !1,
            n = !1,
            r = e.stopPropagation;
        e.stopPropagation = function () {
            r.call(e), (t = !0);
        };
        var o = e.preventDefault;
        return (
            (e.preventDefault = function () {
                o.call(e), (n = !0);
            }),
            (e.isPropagationStopped = function () {
                return t;
            }),
            (e.isDefaultPrevented = function () {
                return n;
            }),
            (e.nativeEvent = e)
        );
    };
    var gt = {
            configurable: !0,
            get: function () {
                return this.class;
            },
        },
        mt = t.vnode;
    t.vnode = function (e) {
        e.$$typeof = _t;
        var t = e.type,
            n = e.props;
        if (t) {
            if (
                (n.class != n.className &&
                    ((gt.enumerable = "className" in n),
                    null != n.className && (n.class = n.className),
                    Object.defineProperty(n, "className", gt)),
                "function" != typeof t)
            ) {
                var r, o, l;
                for (l in (n.defaultValue &&
                    void 0 !== n.value &&
                    (n.value || 0 === n.value || (n.value = n.defaultValue),
                    delete n.defaultValue),
                Array.isArray(n.value) &&
                    n.multiple &&
                    "select" === t &&
                    (x(n.children).forEach(function (e) {
                        -1 != n.value.indexOf(e.props.value) && (e.props.selected = !0);
                    }),
                    delete n.value),
                n))
                    if ((r = dt.test(l))) break;
                if (r)
                    for (l in ((o = e.props = {}), n))
                        o[dt.test(l) ? l.replace(/[A-Z0-9]/, "-$&").toLowerCase() : l] =
                            n[l];
            }
            !(function (t) {
                var n = e.type,
                    r = e.props;
                if (r && "string" == typeof n) {
                    var o = {};
                    for (var l in r)
                        /^on(Ani|Tra|Tou)/.test(l) &&
                            ((r[l.toLowerCase()] = r[l]), delete r[l]),
                            (o[l.toLowerCase()] = l);
                    if (
                        (o.ondoubleclick &&
                            ((r.ondblclick = r[o.ondoubleclick]),
                            delete r[o.ondoubleclick]),
                        o.onbeforeinput &&
                            ((r.onbeforeinput = r[o.onbeforeinput]),
                            delete r[o.onbeforeinput]),
                        o.onchange &&
                            ("textarea" === n ||
                                ("input" === n.toLowerCase() &&
                                    !/^fil|che|ra/i.test(r.type))))
                    ) {
                        var a = o.oninput || "oninput";
                        r[a] || ((r[a] = r[o.onchange]), delete r[o.onchange]);
                    }
                }
            })(),
                "function" == typeof t &&
                    !t.m &&
                    t.prototype &&
                    (ht(t.prototype, "componentWillMount"),
                    ht(t.prototype, "componentWillReceiveProps"),
                    ht(t.prototype, "componentWillUpdate"),
                    (t.m = !0));
        }
        mt && mt(e);
    };
    var vt =
        "undefined" != typeof globalThis
            ? globalThis
            : "undefined" != typeof window
            ? window
            : "undefined" != typeof global
            ? global
            : "undefined" != typeof self
            ? self
            : {};
    var yt = (function (e, t, n) {
        return (
            e(
                (n = {
                    path: t,
                    exports: {},
                    require: function (e, t) {
                        return (function () {
                            throw new Error(
                                "Dynamic requires are not currently supported by @rollup/plugin-commonjs"
                            );
                        })(null == t && n.path);
                    },
                }),
                n.exports
            ),
            n.exports
        );
    })(function (e) {
        var t = (function (e) {
            var t = /\blang(?:uage)?-([\w-]+)\b/i,
                n = 0,
                r = {},
                o = {
                    manual: e.Prism && e.Prism.manual,
                    disableWorkerMessageHandler:
                        e.Prism && e.Prism.disableWorkerMessageHandler,
                    util: {
                        encode: function e(t) {
                            return t instanceof l
                                ? new l(t.type, e(t.content), t.alias)
                                : Array.isArray(t)
                                ? t.map(e)
                                : t
                                      .replace(/&/g, "&amp;")
                                      .replace(/</g, "&lt;")
                                      .replace(/\u00a0/g, " ");
                        },
                        type: function (e) {
                            return Object.prototype.toString.call(e).slice(8, -1);
                        },
                        objId: function (e) {
                            return (
                                e.__id ||
                                    Object.defineProperty(e, "__id", { value: ++n }),
                                e.__id
                            );
                        },
                        clone: function e(t, n) {
                            var r, l;
                            switch (((n = n || {}), o.util.type(t))) {
                                case "Object":
                                    if (((l = o.util.objId(t)), n[l])) return n[l];
                                    for (var a in ((r = {}), (n[l] = r), t))
                                        t.hasOwnProperty(a) && (r[a] = e(t[a], n));
                                    return r;
                                case "Array":
                                    return (
                                        (l = o.util.objId(t)),
                                        n[l]
                                            ? n[l]
                                            : ((r = []),
                                              (n[l] = r),
                                              t.forEach(function (t, o) {
                                                  r[o] = e(t, n);
                                              }),
                                              r)
                                    );
                                default:
                                    return t;
                            }
                        },
                        getLanguage: function (e) {
                            for (; e && !t.test(e.className); ) e = e.parentElement;
                            return e
                                ? (e.className.match(t) || [, "none"])[1].toLowerCase()
                                : "none";
                        },
                        currentScript: function () {
                            if ("undefined" == typeof document) return null;
                            if ("currentScript" in document)
                                return document.currentScript;
                            try {
                                throw new Error();
                            } catch (r) {
                                var e = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(r.stack) ||
                                    [])[1];
                                if (e) {
                                    var t = document.getElementsByTagName("script");
                                    for (var n in t) if (t[n].src == e) return t[n];
                                }
                                return null;
                            }
                        },
                        isActive: function (e, t, n) {
                            for (var r = "no-" + t; e; ) {
                                var o = e.classList;
                                if (o.contains(t)) return !0;
                                if (o.contains(r)) return !1;
                                e = e.parentElement;
                            }
                            return !!n;
                        },
                    },
                    languages: {
                        plain: r,
                        plaintext: r,
                        text: r,
                        txt: r,
                        extend: function (e, t) {
                            var n = o.util.clone(o.languages[e]);
                            for (var r in t) n[r] = t[r];
                            return n;
                        },
                        insertBefore: function (e, t, n, r) {
                            var l = (r = r || o.languages)[e],
                                a = {};
                            for (var i in l)
                                if (l.hasOwnProperty(i)) {
                                    if (i == t)
                                        for (var s in n)
                                            n.hasOwnProperty(s) && (a[s] = n[s]);
                                    n.hasOwnProperty(i) || (a[i] = l[i]);
                                }
                            var u = r[e];
                            return (
                                (r[e] = a),
                                o.languages.DFS(o.languages, function (t, n) {
                                    n === u && t != e && (this[t] = a);
                                }),
                                a
                            );
                        },
                        DFS: function e(t, n, r, l) {
                            l = l || {};
                            var a = o.util.objId;
                            for (var i in t)
                                if (t.hasOwnProperty(i)) {
                                    n.call(t, i, t[i], r || i);
                                    var s = t[i],
                                        u = o.util.type(s);
                                    "Object" !== u || l[a(s)]
                                        ? "Array" !== u ||
                                          l[a(s)] ||
                                          ((l[a(s)] = !0), e(s, n, i, l))
                                        : ((l[a(s)] = !0), e(s, n, null, l));
                                }
                        },
                    },
                    plugins: {},
                    highlightAll: function (e, t) {
                        o.highlightAllUnder(document, e, t);
                    },
                    highlightAllUnder: function (e, t, n) {
                        var r = {
                            callback: n,
                            container: e,
                            selector:
                                'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
                        };
                        o.hooks.run("before-highlightall", r),
                            (r.elements = Array.prototype.slice.apply(
                                r.container.querySelectorAll(r.selector)
                            )),
                            o.hooks.run("before-all-elements-highlight", r);
                        for (var l, a = 0; (l = r.elements[a++]); )
                            o.highlightElement(l, !0 === t, r.callback);
                    },
                    highlightElement: function (n, r, l) {
                        var a = o.util.getLanguage(n),
                            i = o.languages[a];
                        n.className =
                            n.className.replace(t, "").replace(/\s+/g, " ") +
                            " language-" +
                            a;
                        var s = n.parentElement;
                        s &&
                            "pre" === s.nodeName.toLowerCase() &&
                            (s.className =
                                s.className.replace(t, "").replace(/\s+/g, " ") +
                                " language-" +
                                a);
                        var u = {
                            element: n,
                            language: a,
                            grammar: i,
                            code: n.textContent,
                        };
                        function c(e) {
                            (u.highlightedCode = e),
                                o.hooks.run("before-insert", u),
                                (u.element.innerHTML = u.highlightedCode),
                                o.hooks.run("after-highlight", u),
                                o.hooks.run("complete", u),
                                l && l.call(u.element);
                        }
                        if (
                            (o.hooks.run("before-sanity-check", u),
                            (s = u.element.parentElement) &&
                                "pre" === s.nodeName.toLowerCase() &&
                                !s.hasAttribute("tabindex") &&
                                s.setAttribute("tabindex", "0"),
                            !u.code)
                        )
                            return (
                                o.hooks.run("complete", u), void (l && l.call(u.element))
                            );
                        if ((o.hooks.run("before-highlight", u), u.grammar))
                            if (r && e.Worker) {
                                var p = new Worker(o.filename);
                                (p.onmessage = function (e) {
                                    c(e.data);
                                }),
                                    p.postMessage(
                                        JSON.stringify({
                                            language: u.language,
                                            code: u.code,
                                            immediateClose: !0,
                                        })
                                    );
                            } else c(o.highlight(u.code, u.grammar, u.language));
                        else c(o.util.encode(u.code));
                    },
                    highlight: function (e, t, n) {
                        var r = { code: e, grammar: t, language: n };
                        return (
                            o.hooks.run("before-tokenize", r),
                            (r.tokens = o.tokenize(r.code, r.grammar)),
                            o.hooks.run("after-tokenize", r),
                            l.stringify(o.util.encode(r.tokens), r.language)
                        );
                    },
                    tokenize: function (e, t) {
                        var n = t.rest;
                        if (n) {
                            for (var r in n) t[r] = n[r];
                            delete t.rest;
                        }
                        var c = new i();
                        return (
                            s(c, c.head, e),
                            (function e(t, n, r, i, c, p) {
                                for (var d in r)
                                    if (r.hasOwnProperty(d) && r[d]) {
                                        var _ = r[d];
                                        _ = Array.isArray(_) ? _ : [_];
                                        for (var f = 0; f < _.length; ++f) {
                                            if (p && p.cause == d + "," + f) return;
                                            var h = _[f],
                                                g = h.inside,
                                                m = !!h.lookbehind,
                                                v = !!h.greedy,
                                                y = h.alias;
                                            if (v && !h.pattern.global) {
                                                var b = h.pattern
                                                    .toString()
                                                    .match(/[imsuy]*$/)[0];
                                                h.pattern = RegExp(
                                                    h.pattern.source,
                                                    b + "g"
                                                );
                                            }
                                            for (
                                                var w = h.pattern || h, k = i.next, x = c;
                                                k !== n.tail && !(p && x >= p.reach);
                                                x += k.value.length, k = k.next
                                            ) {
                                                var S = k.value;
                                                if (n.length > t.length) return;
                                                if (!(S instanceof l)) {
                                                    var A,
                                                        E = 1;
                                                    if (v) {
                                                        if (!(A = a(w, x, t, m))) break;
                                                        var F = A.index,
                                                            I = A.index + A[0].length,
                                                            C = x;
                                                        for (
                                                            C += k.value.length;
                                                            F >= C;

                                                        )
                                                            C += (k = k.next).value
                                                                .length;
                                                        if (
                                                            ((x = C -= k.value.length),
                                                            k.value instanceof l)
                                                        )
                                                            continue;
                                                        for (
                                                            var P = k;
                                                            P !== n.tail &&
                                                            (C < I ||
                                                                "string" ==
                                                                    typeof P.value);
                                                            P = P.next
                                                        )
                                                            E++, (C += P.value.length);
                                                        E--,
                                                            (S = t.slice(x, C)),
                                                            (A.index -= x);
                                                    } else if (!(A = a(w, 0, S, m)))
                                                        continue;
                                                    F = A.index;
                                                    var T = A[0],
                                                        L = S.slice(0, F),
                                                        D = S.slice(F + T.length),
                                                        $ = x + S.length;
                                                    p && $ > p.reach && (p.reach = $);
                                                    var N = k.prev;
                                                    if (
                                                        (L &&
                                                            ((N = s(n, N, L)),
                                                            (x += L.length)),
                                                        u(n, N, E),
                                                        (k = s(
                                                            n,
                                                            N,
                                                            new l(
                                                                d,
                                                                g ? o.tokenize(T, g) : T,
                                                                y,
                                                                T
                                                            )
                                                        )),
                                                        D && s(n, k, D),
                                                        E > 1)
                                                    ) {
                                                        var j = {
                                                            cause: d + "," + f,
                                                            reach: $,
                                                        };
                                                        e(t, n, r, k.prev, x, j),
                                                            p &&
                                                                j.reach > p.reach &&
                                                                (p.reach = j.reach);
                                                    }
                                                }
                                            }
                                        }
                                    }
                            })(e, c, t, c.head, 0),
                            (function (e) {
                                var t = [],
                                    n = e.head.next;
                                for (; n !== e.tail; ) t.push(n.value), (n = n.next);
                                return t;
                            })(c)
                        );
                    },
                    hooks: {
                        all: {},
                        add: function (e, t) {
                            var n = o.hooks.all;
                            (n[e] = n[e] || []), n[e].push(t);
                        },
                        run: function (e, t) {
                            var n = o.hooks.all[e];
                            if (n && n.length) for (var r, l = 0; (r = n[l++]); ) r(t);
                        },
                    },
                    Token: l,
                };
            function l(e, t, n, r) {
                (this.type = e),
                    (this.content = t),
                    (this.alias = n),
                    (this.length = 0 | (r || "").length);
            }
            function a(e, t, n, r) {
                e.lastIndex = t;
                var o = e.exec(n);
                if (o && r && o[1]) {
                    var l = o[1].length;
                    (o.index += l), (o[0] = o[0].slice(l));
                }
                return o;
            }
            function i() {
                var e = { value: null, prev: null, next: null },
                    t = { value: null, prev: e, next: null };
                (e.next = t), (this.head = e), (this.tail = t), (this.length = 0);
            }
            function s(e, t, n) {
                var r = t.next,
                    o = { value: n, prev: t, next: r };
                return (t.next = o), (r.prev = o), e.length++, o;
            }
            function u(e, t, n) {
                for (var r = t.next, o = 0; o < n && r !== e.tail; o++) r = r.next;
                (t.next = r), (r.prev = t), (e.length -= o);
            }
            if (
                ((e.Prism = o),
                (l.stringify = function e(t, n) {
                    if ("string" == typeof t) return t;
                    if (Array.isArray(t)) {
                        var r = "";
                        return (
                            t.forEach(function (t) {
                                r += e(t, n);
                            }),
                            r
                        );
                    }
                    var l = {
                            type: t.type,
                            content: e(t.content, n),
                            tag: "span",
                            classes: ["token", t.type],
                            attributes: {},
                            language: n,
                        },
                        a = t.alias;
                    a &&
                        (Array.isArray(a)
                            ? Array.prototype.push.apply(l.classes, a)
                            : l.classes.push(a)),
                        o.hooks.run("wrap", l);
                    var i = "";
                    for (var s in l.attributes)
                        i +=
                            " " +
                            s +
                            '="' +
                            (l.attributes[s] || "").replace(/"/g, "&quot;") +
                            '"';
                    return (
                        "<" +
                        l.tag +
                        ' class="' +
                        l.classes.join(" ") +
                        '"' +
                        i +
                        ">" +
                        l.content +
                        "</" +
                        l.tag +
                        ">"
                    );
                }),
                !e.document)
            )
                return e.addEventListener
                    ? (o.disableWorkerMessageHandler ||
                          e.addEventListener(
                              "message",
                              function (t) {
                                  var n = JSON.parse(t.data),
                                      r = n.language,
                                      l = n.code,
                                      a = n.immediateClose;
                                  e.postMessage(o.highlight(l, o.languages[r], r)),
                                      a && e.close();
                              },
                              !1
                          ),
                      o)
                    : o;
            var c = o.util.currentScript();
            function p() {
                o.manual || o.highlightAll();
            }
            if (
                (c &&
                    ((o.filename = c.src),
                    c.hasAttribute("data-manual") && (o.manual = !0)),
                !o.manual)
            ) {
                var d = document.readyState;
                "loading" === d || ("interactive" === d && c && c.defer)
                    ? document.addEventListener("DOMContentLoaded", p)
                    : window.requestAnimationFrame
                    ? window.requestAnimationFrame(p)
                    : window.setTimeout(p, 16);
            }
            return o;
        })(
            "undefined" != typeof window
                ? window
                : "undefined" != typeof WorkerGlobalScope &&
                  self instanceof WorkerGlobalScope
                ? self
                : {}
        );
        /**
         * Prism: Lightweight, robust, elegant syntax highlighting
         *
         * @license MIT <https://opensource.org/licenses/MIT>
         * @author Lea Verou <https://lea.verou.me>
         * @namespace
         * @public
         */ e.exports && (e.exports = t),
            void 0 !== vt && (vt.Prism = t),
            (t.languages.markup = {
                comment: /<!--[\s\S]*?-->/,
                prolog: /<\?[\s\S]+?\?>/,
                doctype: {
                    pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
                    greedy: !0,
                    inside: {
                        "internal-subset": {
                            pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
                            lookbehind: !0,
                            greedy: !0,
                            inside: null,
                        },
                        string: { pattern: /"[^"]*"|'[^']*'/, greedy: !0 },
                        punctuation: /^<!|>$|[[\]]/,
                        "doctype-tag": /^DOCTYPE/,
                        name: /[^\s<>'"]+/,
                    },
                },
                cdata: /<!\[CDATA\[[\s\S]*?\]\]>/i,
                tag: {
                    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
                    greedy: !0,
                    inside: {
                        tag: {
                            pattern: /^<\/?[^\s>\/]+/,
                            inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
                        },
                        "special-attr": [],
                        "attr-value": {
                            pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                            inside: {
                                punctuation: [
                                    { pattern: /^=/, alias: "attr-equals" },
                                    /"|'/,
                                ],
                            },
                        },
                        punctuation: /\/?>/,
                        "attr-name": {
                            pattern: /[^\s>\/]+/,
                            inside: { namespace: /^[^\s>\/:]+:/ },
                        },
                    },
                },
                entity: [
                    { pattern: /&[\da-z]{1,8};/i, alias: "named-entity" },
                    /&#x?[\da-f]{1,8};/i,
                ],
            }),
            (t.languages.markup.tag.inside["attr-value"].inside.entity =
                t.languages.markup.entity),
            (t.languages.markup.doctype.inside["internal-subset"].inside =
                t.languages.markup),
            t.hooks.add("wrap", function (e) {
                "entity" === e.type &&
                    (e.attributes.title = e.content.replace(/&amp;/, "&"));
            }),
            Object.defineProperty(t.languages.markup.tag, "addInlined", {
                value: function (e, n) {
                    var r = {};
                    (r["language-" + n] = {
                        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
                        lookbehind: !0,
                        inside: t.languages[n],
                    }),
                        (r.cdata = /^<!\[CDATA\[|\]\]>$/i);
                    var o = {
                        "included-cdata": {
                            pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
                            inside: r,
                        },
                    };
                    o["language-" + n] = { pattern: /[\s\S]+/, inside: t.languages[n] };
                    var l = {};
                    (l[e] = {
                        pattern: RegExp(
                            /(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(
                                /__/g,
                                function () {
                                    return e;
                                }
                            ),
                            "i"
                        ),
                        lookbehind: !0,
                        greedy: !0,
                        inside: o,
                    }),
                        t.languages.insertBefore("markup", "cdata", l);
                },
            }),
            Object.defineProperty(t.languages.markup.tag, "addAttribute", {
                value: function (e, n) {
                    t.languages.markup.tag.inside["special-attr"].push({
                        pattern: RegExp(
                            /(^|["'\s])/.source +
                                "(?:" +
                                e +
                                ")" +
                                /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
                            "i"
                        ),
                        lookbehind: !0,
                        inside: {
                            "attr-name": /^[^\s=]+/,
                            "attr-value": {
                                pattern: /=[\s\S]+/,
                                inside: {
                                    value: {
                                        pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                                        lookbehind: !0,
                                        alias: [n, "language-" + n],
                                        inside: t.languages[n],
                                    },
                                    punctuation: [
                                        { pattern: /^=/, alias: "attr-equals" },
                                        /"|'/,
                                    ],
                                },
                            },
                        },
                    });
                },
            }),
            (t.languages.html = t.languages.markup),
            (t.languages.mathml = t.languages.markup),
            (t.languages.svg = t.languages.markup),
            (t.languages.xml = t.languages.extend("markup", {})),
            (t.languages.ssml = t.languages.xml),
            (t.languages.atom = t.languages.xml),
            (t.languages.rss = t.languages.xml),
            (function (e) {
                var t = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
                (e.languages.css = {
                    comment: /\/\*[\s\S]*?\*\//,
                    atrule: {
                        pattern: /@[\w-](?:[^;{\s]|\s+(?![\s{]))*(?:;|(?=\s*\{))/,
                        inside: {
                            rule: /^@[\w-]+/,
                            "selector-function-argument": {
                                pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
                                lookbehind: !0,
                                alias: "selector",
                            },
                            keyword: {
                                pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
                                lookbehind: !0,
                            },
                        },
                    },
                    url: {
                        pattern: RegExp(
                            "\\burl\\((?:" +
                                t.source +
                                "|" +
                                /(?:[^\\\r\n()"']|\\[\s\S])*/.source +
                                ")\\)",
                            "i"
                        ),
                        greedy: !0,
                        inside: {
                            function: /^url/i,
                            punctuation: /^\(|\)$/,
                            string: {
                                pattern: RegExp("^" + t.source + "$"),
                                alias: "url",
                            },
                        },
                    },
                    selector: {
                        pattern: RegExp(
                            "(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|" +
                                t.source +
                                ")*(?=\\s*\\{)"
                        ),
                        lookbehind: !0,
                    },
                    string: { pattern: t, greedy: !0 },
                    property: {
                        pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
                        lookbehind: !0,
                    },
                    important: /!important\b/i,
                    function: {
                        pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
                        lookbehind: !0,
                    },
                    punctuation: /[(){};:,]/,
                }),
                    (e.languages.css.atrule.inside.rest = e.languages.css);
                var n = e.languages.markup;
                n &&
                    (n.tag.addInlined("style", "css"),
                    n.tag.addAttribute("style", "css"));
            })(t),
            (t.languages.clike = {
                comment: [
                    {
                        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
                        lookbehind: !0,
                        greedy: !0,
                    },
                    { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
                ],
                string: {
                    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
                    greedy: !0,
                },
                "class-name": {
                    pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
                    lookbehind: !0,
                    inside: { punctuation: /[.\\]/ },
                },
                keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
                boolean: /\b(?:true|false)\b/,
                function: /\b\w+(?=\()/,
                number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
                operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
                punctuation: /[{}[\];(),.:]/,
            }),
            (t.languages.javascript = t.languages.extend("clike", {
                "class-name": [
                    t.languages.clike["class-name"],
                    {
                        pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:prototype|constructor))/,
                        lookbehind: !0,
                    },
                ],
                keyword: [
                    { pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0 },
                    {
                        pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
                        lookbehind: !0,
                    },
                ],
                function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
                number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
                operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
            })),
            (t.languages.javascript[
                "class-name"
            ][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/),
            t.languages.insertBefore("javascript", "keyword", {
                regex: {
                    pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
                    lookbehind: !0,
                    greedy: !0,
                    inside: {
                        "regex-source": {
                            pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
                            lookbehind: !0,
                            alias: "language-regex",
                            inside: t.languages.regex,
                        },
                        "regex-delimiter": /^\/|\/$/,
                        "regex-flags": /^[a-z]+$/,
                    },
                },
                "function-variable": {
                    pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
                    alias: "function",
                },
                parameter: [
                    {
                        pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
                        lookbehind: !0,
                        inside: t.languages.javascript,
                    },
                    {
                        pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
                        lookbehind: !0,
                        inside: t.languages.javascript,
                    },
                    {
                        pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
                        lookbehind: !0,
                        inside: t.languages.javascript,
                    },
                    {
                        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
                        lookbehind: !0,
                        inside: t.languages.javascript,
                    },
                ],
                constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
            }),
            t.languages.insertBefore("javascript", "string", {
                hashbang: { pattern: /^#!.*/, greedy: !0, alias: "comment" },
                "template-string": {
                    pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
                    greedy: !0,
                    inside: {
                        "template-punctuation": { pattern: /^`|`$/, alias: "string" },
                        interpolation: {
                            pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
                            lookbehind: !0,
                            inside: {
                                "interpolation-punctuation": {
                                    pattern: /^\$\{|\}$/,
                                    alias: "punctuation",
                                },
                                rest: t.languages.javascript,
                            },
                        },
                        string: /[\s\S]+/,
                    },
                },
            }),
            t.languages.markup &&
                (t.languages.markup.tag.addInlined("script", "javascript"),
                t.languages.markup.tag.addAttribute(
                    /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/
                        .source,
                    "javascript"
                )),
            (t.languages.js = t.languages.javascript),
            (function () {
                if (void 0 !== t && "undefined" != typeof document) {
                    Element.prototype.matches ||
                        (Element.prototype.matches =
                            Element.prototype.msMatchesSelector ||
                            Element.prototype.webkitMatchesSelector);
                    var e = {
                            js: "javascript",
                            py: "python",
                            rb: "ruby",
                            ps1: "powershell",
                            psm1: "powershell",
                            sh: "bash",
                            bat: "batch",
                            h: "c",
                            tex: "latex",
                        },
                        n =
                            'pre[data-src]:not([data-src-status="loaded"]):not([data-src-status="loading"])',
                        r = /\blang(?:uage)?-([\w-]+)\b/i;
                    t.hooks.add("before-highlightall", function (e) {
                        e.selector += ", " + n;
                    }),
                        t.hooks.add("before-sanity-check", function (r) {
                            var o = r.element;
                            if (o.matches(n)) {
                                (r.code = ""),
                                    o.setAttribute("data-src-status", "loading");
                                var a = o.appendChild(document.createElement("CODE"));
                                a.textContent = "Loading…";
                                var i = o.getAttribute("data-src"),
                                    s = r.language;
                                if ("none" === s) {
                                    var u = (/\.(\w+)$/.exec(i) || [, "none"])[1];
                                    s = e[u] || u;
                                }
                                l(a, s), l(o, s);
                                var c = t.plugins.autoloader;
                                c && c.loadLanguages(s);
                                var p = new XMLHttpRequest();
                                p.open("GET", i, !0),
                                    (p.onreadystatechange = function () {
                                        var e, n;
                                        4 == p.readyState &&
                                            (p.status < 400 && p.responseText
                                                ? (o.setAttribute(
                                                      "data-src-status",
                                                      "loaded"
                                                  ),
                                                  (a.textContent = p.responseText),
                                                  t.highlightElement(a))
                                                : (o.setAttribute(
                                                      "data-src-status",
                                                      "failed"
                                                  ),
                                                  p.status >= 400
                                                      ? (a.textContent =
                                                            ((e = p.status),
                                                            (n = p.statusText),
                                                            "✖ Error " +
                                                                e +
                                                                " while fetching file: " +
                                                                n))
                                                      : (a.textContent =
                                                            "✖ Error: File does not exist or is empty")));
                                    }),
                                    p.send(null);
                            }
                        }),
                        (t.plugins.fileHighlight = {
                            highlight: function (e) {
                                for (
                                    var r, o = (e || document).querySelectorAll(n), l = 0;
                                    (r = o[l++]);

                                )
                                    t.highlightElement(r);
                            },
                        });
                    var o = !1;
                    t.fileHighlight = function () {
                        o ||
                            (console.warn(
                                "Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."
                            ),
                            (o = !0)),
                            t.plugins.fileHighlight.highlight.apply(this, arguments);
                    };
                }
                function l(e, t) {
                    var n = e.className;
                    (n = n.replace(r, " ") + " language-" + t),
                        (e.className = n.replace(/\s+/g, " ").trim());
                }
            })();
    });
    const bt = ["code", "deopt", "ics"];
    var wt = "deoptMarkers_active__3RXm9";
    const kt = location.search.includes("debug");
    function xt(e, t) {
        if (e == t) return null;
        if (e.firstChild) return e.firstChild;
        if (e.nextSibling) return e.nextSibling;
        do {
            e = e.parentNode;
        } while (e && e != t && !e.nextSibling);
        return e === t ? null : e.nextSibling;
    }
    function St(e, t, n) {
        const r = e[0];
        return e.length > 0 && t == r.line && n >= r.column;
    }
    function At(e) {
        return `${e.type}-${e.id}`;
    }
    const Et = { codes: Ye, deopts: Ke, ics: Qe };
    function Ft(e, t) {
        const n = document.createElement("mark");
        var r;
        n.textContent = "codes" == (r = t.type) ? "▲" : "deopts" == r ? "▼" : "☎";
        const o = document.createElement("a"),
            l = Et[t.type].getHref(e, t.id),
            a = ["deoptMarkers_deoptMarker__2QQFZ", Pt(t.severity)];
        return (
            location.hash == l &&
                (a.push("active"), setTimeout(() => o.scrollIntoView(), 0)),
            (o.id = At(t)),
            (o.href = l),
            (o.className = a.join(" ")),
            o.appendChild(n),
            o
        );
    }
    function It(e, t, n, r, o, l) {
        let a = e;
        for (; St(n, o, l); ) {
            const o = Ft(t, n.shift());
            r.push(o), e.parentNode.insertBefore(o, a.nextSibling), (a = o);
        }
        return a;
    }
    function Ct(e) {
        return [...e.codes, ...e.deopts, ...e.ics].sort((e, t) =>
            e.line != t.line
                ? e.line - t.line
                : e.column != t.column
                ? e.column - t.column
                : e.type != t.type
                ? bt.indexOf(e.type) - bt.indexOf(t.type)
                : 0
        );
    }
    function Pt(e) {
        return e < 1
            ? null
            : 1 == e
            ? "deoptMarkers_sev1__2hDiQ"
            : 2 == e
            ? "deoptMarkers_sev2__3bcZj"
            : "deoptMarkers_sev3__2tFgp";
    }
    function Tt(e, t, n, r, o) {
        const l = n.split("\n").map(e => e.length)[e - 1] + 1;
        o.contains(r) ||
            console.error("Element is not inside root.", "Root:", o, "Element:", r),
            l !== t && console.error(e + ":", l, t);
    }
    var Lt = "CodePanel_codePanel__1nXjf",
        Dt = "CodePanel_error__YVP9J";
    const $t = $(null),
        Nt = $(null);
    function jt(e, t) {
        switch (t.type) {
            case "SET_SELECTED_POSITION":
                return {
                    prevPosition: e.selectedPosition,
                    prevSelectedEntry: e.selectedEntry,
                    selectedPosition: t.newPosition,
                    selectedEntry: null,
                };
            case "SET_SELECTED_ENTRY":
                const n = t.entry;
                return {
                    prevPosition: e.selectedPosition,
                    prevSelectedEntry: e.selectedEntry,
                    selectedPosition: n && {
                        functionName: n.functionName,
                        file: n.file,
                        line: n.line,
                        column: n.column,
                    },
                    selectedEntry: n,
                };
            default:
                return e;
        }
    }
    const Mt = e => ({
        prevPosition: null,
        prevSelectedEntry: null,
        selectedPosition: null,
        selectedEntry: null,
    });
    function Ht(e) {
        const [t, n] = G(jt, e, Mt),
            r = Y(
                () => ({
                    setSelectedPosition(e) {
                        n({ type: "SET_SELECTED_POSITION", newPosition: e });
                    },
                    setSelectedEntry(e) {
                        n({ type: "SET_SELECTED_ENTRY", entry: e });
                    },
                }),
                [n]
            );
        return f(Nt.Provider, { value: r }, f($t.Provider, { value: t }, e.children));
    }
    const Ot = () => Q($t),
        zt = () => Q(Nt);
    function Rt(e) {
        let t = void 0,
            n = e[0],
            r = 1;
        for (; r < e.length; ) {
            const o = e[r],
                l = e[r + 1];
            if (((r += 2), ("optionalAccess" === o || "optionalCall" === o) && null == n))
                return;
            "access" === o || "optionalAccess" === o
                ? ((t = n), (n = l(n)))
                : ("call" !== o && "optionalCall" !== o) ||
                  ((n = l((...e) => n.call(t, ...e))), (t = void 0));
        }
        return n;
    }
    function Ut(e, t) {
        const { setSelectedEntry: n } = zt();
        Z(() => {
            t && n(e);
        }, [t]);
    }
    function Wt({ fileDeoptInfo: e, fileId: n, settings: r }) {
        if (e.srcError) return f(Zt, { srcError: e.srcError });
        if (!e.src) return f(Zt, { srcError: "No sources for the file were found." });
        const o = (l = e.srcPath).endsWith(".html")
            ? "html"
            : (!l.startsWith("http:") && !l.startsWith("https:")) ||
              l.match(/\.[mc]?jsx?$/)
            ? "javascript"
            : "html";
        var l;
        const a = Ot(),
            i = Rt([a, "access", e => e.selectedPosition, "optionalAccess", e => e.line]),
            [s, u] = B(null),
            c = q(null);
        return (
            (function (e, n) {
                var r = V(N++, 4);
                !t.__s && te(r.__H, n) && ((r.__ = e), (r.__H = n), j.__h.push(r));
            })(() => {
                const t = (function (e, t, n) {
                    const r = [],
                        o = Ct(n);
                    let l = "",
                        a = kt ? e.textContent : "",
                        i = e.firstChild,
                        s = 1,
                        u = 1;
                    for (; i; ) {
                        if (3 == i.nodeType) {
                            const n = i.data;
                            kt && (l += n);
                            const c = n.split("\n");
                            for (let n = 0; n < c.length; n++)
                                if (
                                    (n > 0 &&
                                        (kt && Tt(s, u, a, i, e), (s += 1), (u = 1)),
                                    (u += c[n].length),
                                    St(o, s, u))
                                )
                                    for (i = It(i, t, o, r, s, u); null != i.lastChild; )
                                        i = i.lastChild;
                        }
                        i = xt(i, e);
                    }
                    return kt && console.log("code == fullText:", l == a), r;
                })(c.current, n, e);
                u(new Map(t.map(e => [e.id, e])));
            }, [n, e]),
            Z(() => {
                a.prevSelectedEntry &&
                    Rt([
                        s,
                        "access",
                        e => e.get,
                        "call",
                        e => e(At(a.prevSelectedEntry)),
                        "optionalAccess",
                        e => e.classList,
                        "access",
                        e => e.remove,
                        "call",
                        e => e(wt),
                    ]);
                const e = { block: "center", behavior: "smooth" };
                if (a.selectedEntry) {
                    const t = s.get(At(a.selectedEntry));
                    t.classList.add(wt), t.scrollIntoView(e);
                } else if (a.selectedPosition) {
                    const t = `.line-numbers-rows > span:nth-child(${a.selectedPosition.line})`;
                    Rt([
                        document,
                        "access",
                        e => e.querySelector,
                        "call",
                        e => e(t),
                        "optionalAccess",
                        e => e.scrollIntoView,
                        "call",
                        t => t(e),
                    ]);
                }
            }, [a]),
            f(
                "div",
                {
                    class: [
                        Lt,
                        r.showLowSevs ? "deoptMarkers_showLowSevs__3ViRy" : null,
                    ].join(" "),
                },
                f(
                    Vt,
                    {
                        src: e.src,
                        lang: o,
                        class: r.hideLineNums ? null : "line-numbers",
                        ref: c,
                    },
                    f(Gt, { selectedLine: i, contents: e.src })
                )
            )
        );
    }
    yt.manual = !0;
    const Vt = (function (e) {
            function t(t) {
                var n = rt({}, t);
                return delete n.ref, e(n, t.ref);
            }
            return (
                (t.prototype.isReactComponent = t.t = !0),
                (t.displayName = "ForwardRef(" + (e.displayName || e.name) + ")"),
                t
            );
        })(function (e, t) {
            const n = ["language-" + e.lang, e.class].join(" ");
            return f(
                "pre",
                { class: n },
                f("code", {
                    ref: t,
                    class: n,
                    dangerouslySetInnerHTML: {
                        __html: Y(
                            () => yt.highlight(e.src, yt.languages[e.lang], e.lang),
                            [e.src, e.lang]
                        ),
                    },
                }),
                e.children
            );
        }),
        Bt = /\n(?!$)/g,
        Gt = (function (e, t) {
            function n(e) {
                var n = this.props.ref,
                    r = n == e.ref;
                return (
                    !r && n && (n.call ? n(null) : (n.current = null)),
                    t ? !t(this.props, e) || !r : ot(this.props, e)
                );
            }
            function r(t) {
                return (this.shouldComponentUpdate = n), f(e, rt({}, t));
            }
            return (
                (r.prototype.isReactComponent = !0),
                (r.displayName = "Memo(" + (e.displayName || e.name) + ")"),
                (r.t = !0),
                r
            );
        })(function ({ selectedLine: e, contents: t }) {
            return f(
                "span",
                { class: "line-numbers-rows", "aria-hidden": "true" },
                Y(() => t.split(Bt), [t]).map((t, n) =>
                    f("span", { class: n == e - 1 ? "active" : null })
                )
            );
        });
    function Zt({ srcError: e }) {
        return f(
            "div",
            { class: [Lt, Dt].join(" ") },
            "Error! ",
            e instanceof Error ? e.toString() : e
        );
    }
    var qt = "CodeSettings_codeSettings__1rhuf",
        Yt = "CodeSettings_settingsMenu__3uyKw";
    const Kt = { showLowSevs: !1, hideLineNums: !1, showAllICs: !1 };
    function Qt({ class: e, state: t, toggle: n }) {
        const r =
                t.showLowSevs !== Kt.showLowSevs ||
                t.hideLineNums !== Kt.hideLineNums ||
                t.showAllICs !== Kt.showAllICs,
            o = [
                {
                    key: "showLowSevs",
                    label: "Display Low Severities",
                    checked: t.showLowSevs,
                    onInput: () => n("showLowSevs"),
                },
                {
                    key: "hideLineNums",
                    label: "Hide Line Numbers",
                    checked: t.hideLineNums,
                    onInput: () => n("hideLineNums"),
                },
                {
                    key: "showAllICs",
                    label: "Show All Inline Cache Entries",
                    checked: t.showAllICs,
                    onInput: () => n("showAllICs"),
                },
            ];
        return f(
            "details",
            { class: [qt, e, r ? "CodeSettings_dirty__1C1f7" : null].join(" ") },
            f("summary", { "aria-label": "Settings" }, f(Jt, null)),
            f(
                "div",
                { class: "CodeSettings_settingsBody__2UFWD" },
                f(
                    "ul",
                    { class: [Ie, Yt].join(" ") },
                    o.map(e =>
                        f(
                            "li",
                            { key: e.key, class: "spectre_menu-item__3z98V" },
                            f(
                                "label",
                                { class: "spectre_form-switch__3imwQ" },
                                f("input", {
                                    type: "checkbox",
                                    checked: e.checked,
                                    onInput: e.onInput,
                                }),
                                f("i", { class: "spectre_form-icon__2TAxo" }),
                                " ",
                                e.label
                            )
                        )
                    )
                )
            )
        );
    }
    function Jt(e) {
        return f(
            "svg",
            { class: e.class, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32" },
            f("path", {
                d:
                    "M13.188 3l-.157.813-.594 2.968a9.939 9.939 0 0 0-2.593 1.532l-2.906-1-.782-.25-.406.718-2 3.438-.406.719.594.53 2.25 1.97C6.104 14.948 6 15.46 6 16c0 .54.105 1.05.188 1.563l-2.25 1.968-.594.532.406.718 2 3.438.406.718.782-.25 2.906-1a9.939 9.939 0 0 0 2.594 1.532l.593 2.968.156.813h5.626l.156-.813.593-2.968a9.939 9.939 0 0 0 2.594-1.532l2.907 1 .78.25.407-.718 2-3.438.406-.718-.593-.532-2.25-1.968C25.895 17.05 26 16.538 26 16c0-.54-.105-1.05-.188-1.563l2.25-1.968.594-.531-.406-.72-2-3.437-.406-.718-.782.25-2.906 1a9.939 9.939 0 0 0-2.593-1.532l-.594-2.968L18.812 3zm1.624 2h2.376l.5 2.594.125.593.562.188a8.017 8.017 0 0 1 3.031 1.75l.438.406.562-.187 2.532-.875 1.187 2.031-2 1.781-.469.375.157.594c.128.57.187 1.152.187 1.75 0 .598-.059 1.18-.188 1.75l-.125.594.438.375 2 1.781-1.188 2.031-2.53-.875-.563-.187-.438.406a8.017 8.017 0 0 1-3.031 1.75l-.563.188-.125.593-.5 2.594h-2.375l-.5-2.594-.124-.593-.563-.188a8.017 8.017 0 0 1-3.031-1.75l-.438-.406-.562.187-2.531.875L5.875 20.5l2-1.781.469-.375-.156-.594A7.901 7.901 0 0 1 8 16c0-.598.059-1.18.188-1.75l.156-.594-.469-.375-2-1.781 1.188-2.031 2.53.875.563.187.438-.406a8.017 8.017 0 0 1 3.031-1.75l.563-.188.124-.593zM16 11c-2.75 0-5 2.25-5 5s2.25 5 5 5 5-2.25 5-5-2.25-5-5-5zm0 2c1.668 0 3 1.332 3 3s-1.332 3-3 3-3-1.332-3-3 1.332-3 3-3z",
            })
        );
    }
    var Xt = "MapExplorer_grouping__3GWlN",
        en = "MapExplorer_group_value__3j9Cj",
        tn = "MapExplorer_map_ids__GqjiY";
    function nn(e) {
        return Object.keys(e.nodes).length > 0 && Object.keys(e.edges).length > 0;
    }
    function rn(e, t) {
        return null != e ? e : t();
    }
    function on(e) {
        let t = void 0,
            n = e[0],
            r = 1;
        for (; r < e.length; ) {
            const o = e[r],
                l = e[r + 1];
            if (((r += 2), ("optionalAccess" === o || "optionalCall" === o) && null == n))
                return;
            "access" === o || "optionalAccess" === o
                ? ((t = n), (n = l(n)))
                : ("call" !== o && "optionalCall" !== o) ||
                  ((n = l((...e) => n.call(t, ...e))), (t = void 0));
        }
        return n;
    }
    const ln = {
        loadic: { label: "LoadIC location", valueLabel: "Location", value: "loadic" },
        property: { label: "Property name", valueLabel: "Property", value: "property" },
        create: { label: "Creation location", valueLabel: "Location", value: "create" },
        mapid: { label: "Map ID", valueLabel: "ID", value: "mapid" },
    };
    function an(e) {
        const t = e.routeParams,
            n = rn(t.grouping, () => "loadic"),
            r = (function (e, t, n, r) {
                if ("loadic" == e)
                    return n.ics
                        .filter(e => !!r.showLowSevs || e.severity > 1)
                        .map(e => ({
                            group: "loadic",
                            id: e.id,
                            label: pn(e),
                            mapIds: e.updates.map(e => e.map),
                            entry: e,
                        }));
                if ("property" == e) {
                    const e = new Map();
                    for (let n in t.nodes) {
                        const r = t.nodes[n],
                            o = r.edge ? t.edges[r.edge] : null;
                        if (o && "Transition" == o.subtype) {
                            const t = o.name;
                            e.has(t) ||
                                e.set(o.name, {
                                    group: "property",
                                    id: t,
                                    label: t,
                                    mapIds: [],
                                }),
                                e.get(t).mapIds.push(r.id);
                        }
                    }
                    return Array.from(e.values());
                }
                if ("create" == e) {
                    const n = new Map();
                    for (let r in t.nodes) {
                        const o = t.nodes[r];
                        if (o.filePosition) {
                            const t = pn(o.filePosition);
                            n.has(t)
                                ? n.get(t).mapIds.push(o.id)
                                : n.set(t, {
                                      group: "create",
                                      id: `${e}-${o.id}`,
                                      label: t,
                                      mapIds: [o.id],
                                      filePosition: o.filePosition,
                                  });
                        }
                    }
                    return Array.from(n.values());
                }
                if ("mapid" == e)
                    return Object.keys(t.nodes).map(e => ({
                        group: "mapid",
                        id: e,
                        label: e,
                        mapIds: [e],
                    }));
                throw new Error("Unknown map grouping value: " + e);
            })(n, e.mapData, e.fileDeoptInfo, e.settings);
        let o = null;
        return (
            r.length > 0 &&
                ((o = r[0]), t.groupValue && (o = r.find(e => e.id == t.groupValue))),
            {
                grouping: n,
                groupValues: r,
                selectedGroup: o,
                selectedMapId: rn(t.mapId, () =>
                    rn(
                        on([o, "optionalAccess", e => e.mapIds, "access", e => e.length]),
                        () => 0
                    ) > 0
                        ? o.mapIds[0]
                        : null
                ),
            }
        );
    }
    function sn(e) {
        if (!nn(e.mapData))
            return f(
                "div",
                null,
                f(
                    "p",
                    null,
                    "No map data found in this log file. In order to explore maps, re-run v8-deopt-viewer without the '--skipMaps' flag to include map data in your log"
                )
            );
        const {
                mapData: t,
                fileDeoptInfo: n,
                routeParams: r,
                settings: o,
                fileId: l,
            } = e,
            a = an(e),
            [i, s] = fe(),
            u = rn(
                on([a, "access", e => e.selectedGroup, "optionalAccess", e => e.mapIds]),
                () => []
            ),
            c = Ot(),
            { setSelectedEntry: p, setSelectedPosition: d } = zt(),
            _ =
                null == c.selectedEntry &&
                null != c.selectedPosition &&
                "loadic" == a.grouping;
        return (
            Z(() => {
                a.selectedGroup &&
                    ("loadic" == a.selectedGroup.group &&
                    a.selectedGroup.entry.file == n.id
                        ? p(a.selectedGroup.entry)
                        : "create" == a.selectedGroup.group &&
                          a.selectedGroup.filePosition.file == n.id
                        ? d(a.selectedGroup.filePosition)
                        : p(null));
            }, [a.selectedGroup, n]),
            f(
                g,
                null,
                f(
                    "div",
                    { class: "MapExplorer_map_selectors__3W6h1" },
                    f(
                        "div",
                        { class: [Se, Xt].join(" ") },
                        f("label", { for: "map-grouping", class: Ae }, "Group Maps by:"),
                        f(
                            "select",
                            {
                                value: a.grouping,
                                onChange: e => {
                                    const t = e.currentTarget.value;
                                    t !== a.grouping && s(Je.getHref(l, t));
                                },
                                id: "map-grouping",
                                class: Ee,
                            },
                            Object.values(ln).map(e =>
                                f("option", { key: e.value, value: e.value }, e.label)
                            )
                        )
                    ),
                    f(
                        "div",
                        { class: [Se, en].join(" ") },
                        f(
                            "label",
                            { for: "map-group", class: Ae },
                            ln[a.grouping].valueLabel,
                            ":"
                        ),
                        f(
                            "select",
                            {
                                value: rn(
                                    on([
                                        a,
                                        "access",
                                        e => e.selectedGroup,
                                        "optionalAccess",
                                        e => e.id,
                                    ]),
                                    () => ""
                                ),
                                disabled: 0 == a.groupValues.length,
                                onChange: e => {
                                    const t = e.currentTarget.value;
                                    t.id !== a.selectedGroup.id &&
                                        s(Je.getHref(l, a.grouping, t));
                                },
                                id: "map-group",
                                class: Ee,
                            },
                            0 == a.groupValues.length
                                ? f("option", null, "No values available")
                                : a.groupValues.map(e =>
                                      f("option", { value: e.id }, e.label)
                                  )
                        )
                    ),
                    f(
                        "div",
                        { class: [Se, tn].join(" ") },
                        f("label", { for: "map-id", class: Ae }, "Map:"),
                        f(
                            "select",
                            {
                                value: a.selectedMapId,
                                id: "map-id",
                                class: Ee,
                                disabled: u.length < 2,
                                onChange: e => {
                                    const t = e.currentTarget.value;
                                    s(Je.getHref(l, a.grouping, a.selectedGroup.id, t));
                                },
                            },
                            0 == u.length
                                ? f("option", null, "No values available")
                                : u.map(e => f("option", { value: e }, e))
                        )
                    )
                ),
                f(
                    "p",
                    { style: { marginBottom: "1.5rem" } },
                    _ &&
                        f(
                            "button",
                            {
                                class:
                                    xe +
                                    " spectre_btn-link__2-YHW MapExplorer_goto_loc_btn__2yyM3",
                                style: { float: "right" },
                                onClick: () => {
                                    "loadic" == a.selectedGroup.group &&
                                        p(a.selectedGroup.entry);
                                },
                            },
                            "Show IC location"
                        )
                ),
                a.selectedMapId &&
                    f(un, {
                        mapData: t,
                        selectedEntry: t.nodes[a.selectedMapId],
                        selectedPosition: c.selectedPosition,
                        currentFile: n.id,
                    })
            )
        );
    }
    function un({ mapData: e, selectedEntry: t, selectedPosition: n, currentFile: r }) {
        return f(
            "div",
            { class: "spectre_timeline__2D8FQ" },
            (function (e, t) {
                const n = [];
                for (; on([t, "optionalAccess", e => e.edge]); ) {
                    const r = e.edges[t.edge];
                    (t = null),
                        on([r, "optionalAccess", e => e.from]) &&
                            (t = e.nodes[r.from]) &&
                            n.push(t);
                }
                return n;
            })(e, t)
                .reverse()
                .map(t =>
                    f(cn, {
                        key: t.id,
                        mapData: e,
                        map: t,
                        selectedPosition: n,
                        currentFile: r,
                    })
                ),
            f(cn, {
                key: t.id,
                mapData: e,
                map: t,
                selectedPosition: n,
                currentFile: r,
                selected: !0,
            })
        );
    }
    function cn({
        mapData: e,
        map: t,
        selected: n = !1,
        selectedPosition: r,
        currentFile: o,
    }) {
        const l = t.id + "-details",
            a = n ? "MapExplorer_selected__1xIJr" : "",
            [i, s] = B(n),
            { setSelectedPosition: u } = zt(),
            c = t.edge ? e.edges[t.edge] : null,
            p =
                on([t, "access", e => e.filePosition, "optionalAccess", e => e.file]) ===
                o,
            d =
                ((_ = t.filePosition),
                (h = r),
                null != _ &&
                    null != h &&
                    _.file == h.file &&
                    _.functionName == h.functionName &&
                    _.line == h.line &&
                    _.column == h.column);
        var _, h;
        return f(
            "div",
            { class: "spectre_timeline-item__K80gc  " + a },
            f(
                "div",
                { class: "spectre_timeline-left__1NcPw" },
                f(
                    "button",
                    {
                        class: `spectre_timeline-icon__3x9ZB ${
                            n ? "spectre_icon-lg__23owT" : ""
                        } `,
                        "aria-controls": l,
                        style: {
                            padding: 0,
                            border: 0,
                            cursor: "pointer",
                            background: n ? "#5755d9" : "inherit",
                        },
                        onClick: () => s(e => !e),
                    },
                    n ? f("i", { class: `${Fe} ${dn(c)}` }) : ""
                )
            ),
            f(
                "div",
                { class: "spectre_timeline-content__O7ltK" },
                f(
                    "details",
                    { id: l, class: "MapExplorer_map_details__2Azd0", open: i },
                    f(
                        "summary",
                        {
                            class: a + " MapExplorer_map_title__VAi_V",
                            onClick: e => {
                                e.preventDefault(), s(e => !e);
                            },
                        },
                        c
                            ? (function (e) {
                                  switch (e.subtype) {
                                      case "Transition":
                                          return "Transition: " + e.name;
                                      case "SlowToFast":
                                          return e.reason;
                                      case "CopyAsPrototype":
                                          return "Copy as Prototype";
                                      case "OptimizeAsPrototype":
                                          return "Optimize as Prototype";
                                      default:
                                          return `${e.subtype} ${rn(
                                              on([e, "optionalAccess", e => e.reason]),
                                              () => ""
                                          )} ${rn(
                                              on([e, "optionalAccess", e => e.name]),
                                              () => ""
                                          )}`;
                                  }
                              })(c)
                            : t.address
                    ),
                    f(
                        "div",
                        null,
                        f(
                            "button",
                            {
                                class:
                                    xe +
                                    " spectre_btn-link__2-YHW MapExplorer_goto_loc_btn__2yyM3",
                                disabled: !p || d,
                                title: p
                                    ? d
                                        ? "Location is currently highlighted"
                                        : null
                                    : "Location is not in current file",
                                onClick: () => u(t.filePosition),
                            },
                            "Show creation location"
                        ),
                        (function (e) {
                            return e.description
                                .trim()
                                .split("\n")
                                .map(e => [e, f("br", null)])
                                .flat();
                        })(t)
                    )
                )
            )
        );
    }
    function pn(e) {
        return `${e.functionName} ${e.line}:${e.column}`;
    }
    function dn(e) {
        switch (on([e, "optionalAccess", e => e.subtype])) {
            case "Transition":
                return "spectre_icon-plus__23HoD";
            case "Normalize":
                return "MapExplorer_icon_triangle_down__1_1Yv";
            case "SlowToFast":
                return "MapExplorer_icon_triangle_up__3F1Af";
            case "ReplaceDescriptors":
                return e.name
                    ? "spectre_icon-plus__23HoD"
                    : "MapExplorer_icon_double_bars__1Cnyd";
            default:
                return "";
        }
    }
    function _n(e) {
        switch (e) {
            case "unintialized":
            case "premonomorphic":
            case "monomorphic":
            case "recompute_handler":
                return 1;
            case "polymorphic":
            case "megadom":
                return 2;
            case "megamorphic":
            case "generic":
                return 3;
            case "no_feedback":
                return -1;
            default:
                throw new Error("severity: unknown ic code state : " + e);
        }
    }
    var fn = "DeoptTables_entryTable__1HBrx",
        hn = "DeoptTables_selected__3C-aH";
    function gn({
        entryKind: e,
        selectedEntryId: t,
        fileDeoptInfo: n,
        fileId: r,
        settings: o,
        toggleShowLowSevs: l,
        hasMapData: a,
    }) {
        const i = t;
        let s,
            u = 0,
            c = 0,
            p = 0;
        function d(e) {
            return (
                u++,
                e.severity <= 1 && c++,
                !!o.showLowSevs || e.severity > 1 || (p++, !1)
            );
        }
        if ("codes" == e)
            s = n[e].filter(d).map(e =>
                f(mn, {
                    key: e.id,
                    entry: e,
                    selected: e.id == i,
                    title: f(bn, {
                        entry: e,
                        route: Ye,
                        relativePath: n.relativePath,
                        fileId: r,
                    }),
                })
            );
        else if ("deopts" == e)
            s = n[e].filter(d).map(e =>
                f(vn, {
                    key: e.id,
                    entry: e,
                    selected: e.id == i,
                    title: f(bn, {
                        entry: e,
                        route: Ke,
                        relativePath: n.relativePath,
                        fileId: r,
                    }),
                })
            );
        else {
            if ("ics" != e) throw new Error(`Unknown entry kind: "${e}"`);
            s = n[e].filter(d).map(e =>
                f(yn, {
                    key: e.id,
                    entry: e,
                    selected: e.id == i,
                    showAllICs: o.showAllICs,
                    hasMapData: a,
                    fileId: r,
                    title: f(bn, {
                        entry: e,
                        route: Qe,
                        relativePath: n.relativePath,
                        fileId: r,
                    }),
                })
            );
        }
        let _ = null;
        if (u > 0) {
            let e = `Hiding ${p} entries. Show all`;
            0 == p && c > 1 && (e = `Hide ${c} low severity entries.`),
                (_ = f(
                    "p",
                    null,
                    f(
                        "button",
                        {
                            type: "button",
                            class: xe + " spectre_btn_inline__7CLdZ",
                            onClick: l,
                        },
                        e
                    )
                ));
        }
        return f(g, null, 0 == s.length ? f("p", null, "None!") : s, _);
    }
    function mn({ entry: e, selected: t, title: n }) {
        Ut(e, t);
        return f(
            "div",
            { ref: kn(t), class: [fn, wn(e.severity), t ? hn : null].join(" ") },
            f(
                "table",
                { class: [ye, be, we].join(" ") },
                f("caption", null, n),
                f(
                    "thead",
                    null,
                    f(
                        "tr",
                        null,
                        f("th", null, "Timestamp"),
                        f("th", null, "Optimization State")
                    )
                ),
                f(
                    "tbody",
                    null,
                    e.updates.map((e, t) =>
                        f(
                            "tr",
                            null,
                            f("td", null, xn(e.timestamp)),
                            f("td", { class: wn(e.severity) }, e.state)
                        )
                    )
                )
            )
        );
    }
    function vn({ entry: e, selected: t, title: n }) {
        Ut(e, t);
        return f(
            "div",
            { ref: kn(t), class: [fn, wn(e.severity), t ? hn : null].join(" ") },
            f(
                "table",
                { class: [ye, be, we].join(" ") },
                f("caption", null, n),
                f(
                    "thead",
                    null,
                    f(
                        "tr",
                        null,
                        f("th", null, "Timestamp"),
                        f("th", null, "Bailout"),
                        f("th", null, "Reason"),
                        f("th", null, "Inlined")
                    )
                ),
                f(
                    "tbody",
                    null,
                    e.updates.map(e =>
                        f(
                            "tr",
                            null,
                            f("td", null, xn(e.timestamp)),
                            f("td", { class: wn(e.severity) }, e.bailoutType),
                            f("td", null, e.deoptReason),
                            f("td", null, e.inlined ? "yes" : "no")
                        )
                    )
                )
            )
        );
    }
    function yn({
        entry: e,
        selected: t,
        title: n,
        showAllICs: r,
        hasMapData: o,
        fileId: l,
    }) {
        Ut(e, t);
        return f(
            "div",
            { ref: kn(t), class: [fn, wn(e.severity), t ? hn : null].join(" ") },
            f(
                "table",
                { class: [ye, be, we].join(" ") },
                f("caption", null, n),
                f(
                    "thead",
                    null,
                    f(
                        "tr",
                        null,
                        f("th", null, "Old State"),
                        f("th", null, "New State"),
                        f("th", null, "Key"),
                        f("th", null, "Map")
                    )
                ),
                f(
                    "tbody",
                    null,
                    e.updates.map((t, n) => {
                        if (!r && t.newState === t.oldState) return null;
                        let a;
                        return (
                            o && (a = Je.getHref(l, "loadic", e.id, t.map)),
                            f(
                                "tr",
                                { key: n },
                                f("td", { class: wn(_n(t.oldState)) }, t.oldState),
                                f("td", { class: wn(_n(t.newState)) }, t.newState),
                                f("td", null, t.key),
                                f("td", null, o ? f("a", { href: a }, t.map) : t.map)
                            )
                        );
                    })
                )
            )
        );
    }
    function bn({ entry: e, relativePath: t, route: n, fileId: r }) {
        const o = n.getHref(r, e.id),
            l = `${e.functionName} at ${t}:${e.line}:${e.column}`;
        return f(
            g,
            null,
            f("span", { class: "DeoptTables_entryId__3vl0H" }, e.id, " "),
            f("a", { href: o, class: "DeoptTables_entryLink__3op73" }, l)
        );
    }
    function wn(e) {
        return e < 1
            ? null
            : 1 == e
            ? "DeoptTables_sev1__3-9CC"
            : 2 == e
            ? "DeoptTables_sev2__2B7LB"
            : "DeoptTables_sev3__1Ma31";
    }
    function kn(e) {
        const t = q(null);
        return (
            Z(() => {
                e && t.current.scrollIntoView({ block: "center" });
            }, [e]),
            e ? t : null
        );
    }
    function xn(e) {
        return (e / 1e3).toFixed(0) + "ms";
    }
    function Sn({ files: e, deoptInfo: t, routeParams: n }) {
        const { fileId: r, tabId: o } = n,
            l = t.files[e[r]],
            [a, i] = G((e, t) => ({ ...e, [t]: !e[t] }), Kt),
            s = () => i("showLowSevs"),
            u = nn(t.maps);
        return f(
            "div",
            { class: "FileViewer_fileViewer__2Ansi" },
            f(
                Ht,
                null,
                f(Qt, { class: "FileViewer_codeSettings__3awLM", state: a, toggle: i }),
                f(Wt, { fileDeoptInfo: l, fileId: r, settings: a }),
                f(
                    tt,
                    { fileId: r, title: l.relativePath },
                    f(
                        ve,
                        null,
                        f(me, { path: Ye.route }, e =>
                            f(gn, {
                                entryKind: "codes",
                                selectedEntryId: e.entryId,
                                fileDeoptInfo: l,
                                fileId: r,
                                settings: a,
                                toggleShowLowSevs: s,
                                hasMapData: u,
                            })
                        ),
                        f(me, { path: Ke.route }, e =>
                            f(gn, {
                                entryKind: "deopts",
                                selectedEntryId: e.entryId,
                                fileDeoptInfo: l,
                                fileId: r,
                                settings: a,
                                toggleShowLowSevs: s,
                                hasMapData: u,
                            })
                        ),
                        f(me, { path: Qe.route }, e =>
                            f(gn, {
                                entryKind: "ics",
                                selectedEntryId: e.entryId,
                                fileDeoptInfo: l,
                                fileId: r,
                                settings: a,
                                toggleShowLowSevs: s,
                                hasMapData: u,
                            })
                        ),
                        f(me, { path: Je.route }, e =>
                            f(sn, {
                                mapData: t.maps,
                                fileDeoptInfo: l,
                                routeParams: e,
                                settings: a,
                                fileId: r,
                            })
                        )
                    )
                )
            )
        );
    }
    var An = "App_pageHeader__2eLn0",
        En = "App_backButton__ydQwa";
    function Fn({ deoptInfo: e }) {
        const t = Object.keys(e.files);
        return f(
            g,
            null,
            f(
                ge,
                { hook: Ge },
                f(In, null),
                f(me, { path: Ze.route }, f(Ve, { deoptInfo: e })),
                f(me, { path: qe.route }, n =>
                    f(Sn, {
                        routeParams: { fileId: parseInt(n.fileId) || 0, tabId: n.tabId },
                        files: t,
                        deoptInfo: e,
                    })
                )
            )
        );
    }
    function In() {
        const [e] = he("/");
        return f(
            "div",
            { class: [An, e ? null : "App_subRoute__1HlDZ"].join(" ") },
            f(
                "a",
                { href: "#/", class: [xe, En].join(" ") },
                f("i", { class: [Fe, De].join(" ") })
            ),
            f("h1", { class: "App_pageTitle__3uVB9" }, "V8 Deopt Viewer")
        );
    }
    (e.renderIntoDom = function (e, n) {
        !(function (e, n, r) {
            var o, l, a;
            t.__ && t.__(e, n),
                (l = (o = r === i) ? null : (r && r.__k) || n.__k),
                (e = f(g, null, [e])),
                (a = []),
                F(
                    n,
                    ((o ? n : r || n).__k = e),
                    l || u,
                    u,
                    void 0 !== n.ownerSVGElement,
                    r && !o ? [r] : l ? null : c.slice.call(n.childNodes),
                    a,
                    r || u,
                    o
                ),
                I(a, e);
        })(f(Fn, { deoptInfo: e }), n);
    }),
        Object.defineProperty(e, "__esModule", { value: !0 });
});
