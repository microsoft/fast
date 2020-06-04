/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function t(t, e, o, i) {
    var r,
        n = arguments.length,
        s = n < 3 ? e : null === i ? (i = Object.getOwnPropertyDescriptor(e, o)) : i;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
        s = Reflect.decorate(t, e, o, i);
    else
        for (var a = t.length - 1; a >= 0; a--)
            (r = t[a]) && (s = (n < 3 ? r(s) : n > 3 ? r(e, o, s) : r(e, o)) || s);
    return n > 3 && s && Object.defineProperty(e, o, s), s;
}
const e =
        "fast-" +
        Math.random()
            .toString(36)
            .substring(7),
    o = [];
void 0 === globalThis.trustedTypes &&
    (globalThis.trustedTypes = { createPolicy: (t, e) => e });
const i = globalThis.trustedTypes.createPolicy("fast-html", { createHTML: t => t });
let r = i;
function n() {
    let t = 0;
    for (; t < o.length; ) {
        if ((o[t].call(), t++, t > 1024)) {
            for (let e = 0, i = o.length - t; e < i; e++) o[e] = o[e + t];
            (o.length -= t), (t = 0);
        }
    }
    o.length = 0;
}
const s = Object.freeze({
    setHTMLPolicy(t) {
        if (r !== i) throw new Error("The HTML policy can only be set once.");
        r = t;
    },
    createHTML: t => r.createHTML(t),
    isMarker: t => t && 8 === t.nodeType && t.data.startsWith(e),
    extractDirectiveIndexFromMarker: t => parseInt(t.data.replace(e + ":", "")),
    createInterpolationPlaceholder: t => `@{${t}}`,
    createCustomAttributePlaceholder(t, e) {
        return `${t}="${this.createInterpolationPlaceholder(e)}"`;
    },
    createBlockPlaceholder: t => `\x3c!--${e}:${t}--\x3e`,
    queueUpdate(t) {
        o.length < 1 && window.requestAnimationFrame(n), o.push(t);
    },
    setAttribute(t, e, o) {
        null == o ? t.removeAttribute(e) : t.setAttribute(e, o);
    },
    setBooleanAttribute(t, e, o) {
        o ? t.setAttribute(e, "") : t.removeAttribute(e);
    },
});
function a(t) {
    const e = this.spillover;
    -1 === e.indexOf(t) && e.push(t);
}
function l(t) {
    const e = this.spillover,
        o = e.indexOf(t);
    -1 !== o && e.splice(o, 1);
}
function c(t) {
    const e = this.spillover,
        o = this.source;
    for (let i = 0, r = e.length; i < r; ++i) e[i].handleChange(o, t);
}
function d(t) {
    return -1 !== this.spillover.indexOf(t);
}
class h {
    constructor(t) {
        (this.source = t),
            (this.sub1 = void 0),
            (this.sub2 = void 0),
            (this.spillover = void 0);
    }
    has(t) {
        return this.sub1 === t || this.sub2 === t;
    }
    subscribe(t) {
        this.has(t) ||
            (void 0 !== this.sub1
                ? void 0 !== this.sub2
                    ? ((this.spillover = [this.sub1, this.sub2, t]),
                      (this.subscribe = a),
                      (this.unsubscribe = l),
                      (this.notify = c),
                      (this.has = d),
                      (this.sub1 = void 0),
                      (this.sub2 = void 0))
                    : (this.sub2 = t)
                : (this.sub1 = t));
    }
    unsubscribe(t) {
        this.sub1 === t ? (this.sub1 = void 0) : this.sub2 === t && (this.sub2 = void 0);
    }
    notify(t) {
        const e = this.sub1,
            o = this.sub2,
            i = this.source;
        void 0 !== e && e.handleChange(i, t), void 0 !== o && o.handleChange(i, t);
    }
}
class u {
    constructor(t) {
        (this.source = t), (this.subscribers = {});
    }
    notify(t) {
        const e = this.subscribers[t];
        void 0 !== e && e.notify(t);
    }
    subscribe(t, e) {
        let o = this.subscribers[e];
        void 0 === o && (this.subscribers[e] = o = new h(this.source)), o.subscribe(t);
    }
    unsubscribe(t, e) {
        const o = this.subscribers[e];
        void 0 !== o && o.unsubscribe(t);
    }
}
const p = new WeakMap(),
    v = new WeakMap();
let f = void 0;
class b {
    constructor(t, e) {
        (this.name = t),
            (this.field = "_" + t),
            (this.callback = t + "Changed"),
            (this.hasCallback = this.callback in e);
    }
    getValue(t) {
        return void 0 !== f && f.observe(t, this.name), t[this.field];
    }
    setValue(t, e) {
        const o = this.field,
            i = t[o];
        i !== e &&
            ((t[o] = e),
            this.hasCallback && t[this.callback](i, e),
            m(t).notify(this.name));
    }
}
const g = {
        createArrayObserver(t) {
            throw new Error("Must call enableArrayObservation before observing arrays.");
        },
        getNotifier(t) {
            let e = t.$fastController || p.get(t);
            return (
                void 0 === e &&
                    (Array.isArray(t)
                        ? (e = g.createArrayObserver(t))
                        : p.set(t, (e = new u(t)))),
                e
            );
        },
        track(t, e) {
            void 0 !== f && f.observe(t, e);
        },
        notify(t, e) {
            m(t).notify(e);
        },
        defineProperty(t, e) {
            "string" == typeof e && (e = new b(e, t)),
                this.getAccessors(t).push(e),
                Reflect.defineProperty(t, e.name, {
                    enumerable: !0,
                    get: function() {
                        return e.getValue(this);
                    },
                    set: function(t) {
                        e.setValue(this, t);
                    },
                });
        },
        getAccessors(t) {
            let e = v.get(t);
            if (void 0 === e) {
                let o = Reflect.getPrototypeOf(t);
                for (; void 0 === e && null !== o; )
                    (e = v.get(o)), (o = Reflect.getPrototypeOf(o));
                (e = void 0 === e ? [] : e.slice(0)), v.set(t, e);
            }
            return e;
        },
    },
    m = g.getNotifier,
    y = s.queueUpdate;
function x(t, e) {
    g.defineProperty(t, e);
}
let k = null;
function C(t) {
    k = t;
}
class w {
    constructor() {
        (this.index = 0), (this.length = 0), (this.parent = null);
    }
    get event() {
        return k;
    }
    get even() {
        return this.index % 2 == 0;
    }
    get odd() {
        return this.index % 2 != 0;
    }
    get first() {
        return 0 === this.index;
    }
    get middle() {
        return !this.first && !this.last;
    }
    get last() {
        return this.index === this.length - 1;
    }
}
g.defineProperty(w.prototype, "index"), g.defineProperty(w.prototype, "length");
const $ = new w();
class F {
    constructor(t, e) {
        (this.expression = t),
            (this.observer = e),
            (this.needsRefresh = !0),
            (this.needsQueue = !0),
            (this.first = this),
            (this.last = null),
            (this.source = void 0),
            (this.propertyName = void 0),
            (this.notifier = void 0),
            (this.next = void 0);
    }
    evaluate(t, e) {
        this.needsRefresh && null !== this.last && this.dispose(),
            (f = this.needsRefresh ? this : void 0),
            (this.needsRefresh = !1);
        const o = this.expression(t, e);
        return (f = void 0), o;
    }
    dispose() {
        if (null !== this.last) {
            let t = this.first;
            for (; void 0 !== t; )
                t.notifier.unsubscribe(this, t.propertyName), (t = t.next);
            (this.last = null), (this.needsRefresh = !0);
        }
    }
    observe(t, e) {
        const o = this.last,
            i = m(t),
            r = null === o ? this.first : {};
        if (
            ((r.source = t),
            (r.propertyName = e),
            (r.notifier = i),
            i.subscribe(this, e),
            null !== o)
        ) {
            if (!this.needsRefresh) {
                f = void 0;
                const e = o.source[o.propertyName];
                (f = this), t === e && (this.needsRefresh = !0);
            }
            o.next = r;
        }
        this.last = r;
    }
    handleChange() {
        this.needsQueue && ((this.needsQueue = !1), y(this));
    }
    call() {
        (this.needsQueue = !0), this.observer.handleExpressionChange(this);
    }
}
class D {
    constructor() {
        this.targetIndex = 0;
    }
}
class T extends D {
    constructor(t, e, o) {
        super(), (this.name = t), (this.behavior = e), (this.options = o);
    }
    createPlaceholder(t) {
        return s.createCustomAttributePlaceholder(this.name, t);
    }
    createBehavior(t) {
        return new this.behavior(t, this.options);
    }
}
function P(t, e) {
    (this.source = t),
        (this.context = e),
        null === this.observableExpression &&
            (this.observableExpression = new F(this.expression, this)),
        this.updateTarget(this.observableExpression.evaluate(t, e));
}
function E(t, e) {
    (this.source = t),
        (this.context = e),
        this.target.addEventListener(this.targetName, this, !0);
}
function A() {
    this.observableExpression.dispose(), (this.source = null), (this.context = null);
}
function S() {
    this.target.removeEventListener(this.targetName, this, !0),
        (this.source = null),
        (this.context = null);
}
function H(t) {
    s.setAttribute(this.target, this.targetName, t);
}
function O(t) {
    s.setBooleanAttribute(this.target, this.targetName, t);
}
function L(t) {
    this.target.textContent = t;
}
function B(t) {
    this.target[this.targetName] = t;
}
function R(t) {
    const e = this.classVersions || Object.create(null),
        o = this.target;
    let i = this.version || 0;
    if (null != t && t.length) {
        const r = t.split(/\s+/);
        for (let t = 0, n = r.length; t < n; ++t) {
            const n = r[t];
            "" !== n && ((e[n] = i), o.classList.add(n));
        }
    }
    if (((this.classVersions = e), (this.version = i + 1), 0 !== i)) {
        i -= 1;
        for (const t in e) e[t] === i && o.classList.remove(t);
    }
}
class M extends D {
    constructor(t) {
        super(),
            (this.expression = t),
            (this.createPlaceholder = s.createInterpolationPlaceholder),
            (this.bind = P),
            (this.unbind = A),
            (this.updateTarget = H);
    }
    get targetName() {
        return this.originalTargetName;
    }
    set targetName(t) {
        if (((this.originalTargetName = t), void 0 !== t))
            switch (t[0]) {
                case ":":
                    if (
                        ((this.cleanedTargetName = t.substr(1)),
                        (this.updateTarget = B),
                        "innerHTML" === this.cleanedTargetName)
                    ) {
                        const t = this.expression;
                        this.expression = (e, o) => s.createHTML(t(e, o));
                    }
                    break;
                case "?":
                    (this.cleanedTargetName = t.substr(1)), (this.updateTarget = O);
                    break;
                case "@":
                    (this.cleanedTargetName = t.substr(1)),
                        (this.bind = E),
                        (this.unbind = S);
                    break;
                default:
                    (this.cleanedTargetName = t),
                        "class" === t && (this.updateTarget = R);
            }
    }
    targetAtContent() {
        this.updateTarget = L;
    }
    createBehavior(t) {
        return new I(
            t,
            this.expression,
            this.bind,
            this.unbind,
            this.updateTarget,
            this.cleanedTargetName
        );
    }
}
class I {
    constructor(t, e, o, i, r, n) {
        (this.target = t),
            (this.expression = e),
            (this.bind = o),
            (this.unbind = i),
            (this.updateTarget = r),
            (this.targetName = n),
            (this.source = null),
            (this.context = null),
            (this.observableExpression = null);
    }
    handleExpressionChange() {
        this.updateTarget(this.observableExpression.evaluate(this.source, this.context));
    }
    handleEvent(t) {
        C(t);
        const e = this.expression(this.source, this.context);
        C(null), !0 !== e && t.preventDefault();
    }
}
const N = { locatedDirectives: 0, targetIndex: -1 };
function z(t) {
    let e;
    const o = t.length,
        i = t.map(t =>
            "string" == typeof t
                ? () => t
                : ((e = t.targetName || e), N.locatedDirectives++, t.expression)
        ),
        r = new M((t, e) => {
            let r = "";
            for (let n = 0; n < o; ++n) r += i[n](t, e);
            return r;
        });
    return (r.targetName = e), r;
}
function j(t, e) {
    let o = t.indexOf("@{", 0);
    const i = t.length;
    let r,
        n,
        s,
        a = 0,
        l = 0,
        c = null,
        d = 0;
    for (; o >= 0 && o < i - 2; ) {
        (l = 1), (n = o), (o += 2);
        do {
            (r = t[o]),
                o++,
                "'" !== r && '"' !== r
                    ? "\\" !== r
                        ? null === c && ("{" === r ? l++ : "}" === r && l--)
                        : o++
                    : null === c
                    ? (c = r)
                    : c === r && (c = null);
        } while (l > 0 && o < i);
        if (0 !== l) break;
        if (((s = s || []), "\\" === t[n - 1] && "\\" !== t[n - 2]))
            (s[d] = t.substring(a, n - 1) + t.substring(n, o)), d++;
        else {
            (s[d] = t.substring(a, n)), d++;
            const i = e[parseInt(t.substring(n + 2, o - 1))];
            (s[d] = i), d++;
        }
        (a = o), (o = t.indexOf("@{", o));
    }
    return 0 === d
        ? null
        : ((s[d] = t.substr(a)), (s = s.filter(t => "" !== t)), 1 == s.length ? s[0] : s);
}
function _(t, e, o, i = !1) {
    const r = t.attributes;
    for (let n = 0, s = r.length; n < s; ++n) {
        const a = r[n],
            l = a.value;
        let c = j(l, e);
        null === c
            ? i && ((c = new M(() => l)), (c.targetName = a.name))
            : Array.isArray(c)
            ? (c = z(c))
            : N.locatedDirectives++,
            null !== c &&
                (t.removeAttributeNode(a),
                n--,
                s--,
                (c.targetIndex = N.targetIndex),
                o.push(c));
    }
}
function V(t, e) {
    t.targetAtContent(),
        (t.targetIndex = N.targetIndex),
        e.push(t),
        N.locatedDirectives++;
}
function G(t, e, o, i) {
    const r = j(t.textContent, e);
    if (null !== r)
        if (Array.isArray(r)) {
            let e = t;
            for (let n = 0, s = r.length; n < s; ++n) {
                const s = r[n],
                    a =
                        0 === n
                            ? t
                            : e.parentNode.insertBefore(
                                  document.createTextNode(""),
                                  e.nextSibling
                              );
                "string" == typeof s
                    ? (a.textContent = s)
                    : ((a.textContent = " "), V(s, o)),
                    (e = a),
                    N.targetIndex++,
                    a !== t && i.nextNode();
            }
            N.targetIndex--;
        } else (t.textContent = " "), V(r, o);
}
const q = document.createRange();
class W {
    constructor(t, e) {
        (this.fragment = t),
            (this.behaviors = e),
            (this.source = void 0),
            (this.context = null),
            (this.firstChild = t.firstChild),
            (this.lastChild = t.lastChild);
    }
    appendTo(t) {
        t.appendChild(this.fragment);
    }
    insertBefore(t) {
        if (this.fragment.hasChildNodes()) t.parentNode.insertBefore(this.fragment, t);
        else {
            const e = t.parentNode,
                o = this.lastChild;
            let i,
                r = this.firstChild;
            for (; r !== o; ) (i = r.nextSibling), e.insertBefore(r, t), (r = i);
            e.insertBefore(o, t);
        }
    }
    remove() {
        const t = this.fragment,
            e = this.lastChild;
        let o,
            i = this.firstChild;
        for (; i !== e; ) (o = i.nextSibling), t.appendChild(i), (i = o);
        t.appendChild(e);
    }
    dispose() {
        const t = this.firstChild.parentNode,
            e = this.lastChild;
        let o,
            i = this.firstChild;
        for (; i !== e; ) (o = i.nextSibling), t.removeChild(i), (i = o);
        t.removeChild(e);
        const r = this.behaviors,
            n = this.source;
        for (let t = 0, e = r.length; t < e; ++t) r[t].unbind(n);
    }
    bind(t, e) {
        const o = this.behaviors;
        if (this.source !== t)
            if (void 0 !== this.source) {
                const i = this.source;
                (this.source = t), (this.context = e);
                for (let r = 0, n = o.length; r < n; ++r) {
                    const n = o[r];
                    n.unbind(i), n.bind(t, e);
                }
            } else {
                (this.source = t), (this.context = e);
                for (let i = 0, r = o.length; i < r; ++i) o[i].bind(t, e);
            }
    }
    unbind() {
        if (void 0 === this.source) return;
        const t = this.behaviors,
            e = this.source;
        for (let o = 0, i = t.length; o < i; ++o) t[o].unbind(e);
        this.source = void 0;
    }
    static disposeContiguousBatch(t) {
        if (0 !== t.length) {
            q.setStart(t[0].firstChild, 0),
                q.setEnd(t[t.length - 1].lastChild, 0),
                q.deleteContents();
            for (let e = 0, o = t.length; e < o; ++e) {
                const o = t[e],
                    i = o.behaviors,
                    r = o.source;
                for (let t = 0, e = i.length; t < e; ++t) i[t].unbind(r);
            }
        }
    }
}
class U {
    constructor(t, e) {
        (this.view = t.create()), this.view.insertBefore(e);
    }
    bind(t, e) {
        this.view.bind(t, e);
    }
    unbind() {
        this.view.unbind();
    }
}
class K extends D {
    constructor(t, e) {
        super(),
            (this.html = t),
            (this.directives = e),
            (this.createPlaceholder = s.createBlockPlaceholder),
            (this.behaviorCount = 0),
            (this.hasHostBehaviors = !1),
            (this.fragment = null),
            (this.targetOffset = 0),
            (this.viewBehaviorFactories = null),
            (this.hostBehaviorFactories = null);
    }
    create(t) {
        if (null === this.fragment) {
            let t;
            const e = this.html;
            if ("string" == typeof e) {
                (t = document.createElement("template")), (t.innerHTML = s.createHTML(e));
                const o = t.content.firstElementChild;
                null !== o && "TEMPLATE" === o.tagName && (t = o);
            } else t = e;
            const o = (function(t, e) {
                const o = [];
                (N.locatedDirectives = 0), _(t, e, o, !0);
                const i = t.content,
                    r = [],
                    n = e.length,
                    a = document.createTreeWalker(i, 133, null, !1);
                for (N.targetIndex = -1; N.locatedDirectives < n; ) {
                    const t = a.nextNode();
                    if (null === t) break;
                    switch ((N.targetIndex++, t.nodeType)) {
                        case 1:
                            _(t, e, r);
                            break;
                        case 3:
                            G(t, e, r, a);
                            break;
                        case 8:
                            if (s.isMarker(t)) {
                                const o = e[s.extractDirectiveIndexFromMarker(t)];
                                (o.targetIndex = N.targetIndex),
                                    N.locatedDirectives++,
                                    r.push(o);
                            } else t.parentNode.removeChild(t), N.targetIndex--;
                    }
                }
                let l = 0;
                return (
                    s.isMarker(i.firstChild) &&
                        (i.insertBefore(document.createComment(""), i.firstChild),
                        (l = -1)),
                    {
                        fragment: i,
                        viewBehaviorFactories: r,
                        hostBehaviorFactories: o,
                        targetOffset: l,
                    }
                );
            })(t, this.directives);
            (this.fragment = o.fragment),
                (this.viewBehaviorFactories = o.viewBehaviorFactories),
                (this.hostBehaviorFactories = o.hostBehaviorFactories),
                (this.targetOffset = o.targetOffset),
                (this.behaviorCount =
                    this.viewBehaviorFactories.length +
                    this.hostBehaviorFactories.length),
                (this.hasHostBehaviors = this.hostBehaviorFactories.length > 0);
        }
        const e = this.fragment.cloneNode(!0),
            o = this.viewBehaviorFactories,
            i = new Array(this.behaviorCount),
            r = document.createTreeWalker(e, 133, null, !1);
        let n = 0,
            a = this.targetOffset,
            l = r.nextNode();
        for (let t = o.length; n < t; ++n) {
            const t = o[n],
                e = t.targetIndex;
            for (; null !== l; ) {
                if (a === e) {
                    i[n] = t.createBehavior(l);
                    break;
                }
                (l = r.nextNode()), a++;
            }
        }
        if (this.hasHostBehaviors) {
            const e = this.hostBehaviorFactories;
            for (let o = 0, r = e.length; o < r; ++o, ++n) i[n] = e[o].createBehavior(t);
        }
        return new W(e, i);
    }
    render(t, e) {
        "string" == typeof e && (e = document.getElementById(e));
        const o = this.create(e);
        return o.bind(t, $), o.appendTo(e), o;
    }
    createBehavior(t) {
        return new U(this, t);
    }
}
const X = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
function Q(t, ...e) {
    const o = [];
    let i = "";
    for (let r = 0, n = t.length - 1; r < n; ++r) {
        const n = t[r];
        let s = e[r];
        if (((i += n), "function" == typeof s)) {
            s = new M(s);
            const t = X.exec(n);
            null !== t && (s.targetName = t[2]);
        }
        s instanceof D ? ((i += s.createPlaceholder(o.length)), o.push(s)) : (i += s);
    }
    return (i += t[t.length - 1]), new K(i, o);
}
const Y = {
        toView: t => (t ? "true" : "false"),
        fromView: t => null != t && "false" !== t && !1 !== t && 0 !== t,
    },
    Z = {
        toView(t) {
            if (null == t) return null;
            const e = 1 * t;
            return isNaN(e) ? null : e.toString();
        },
        fromView(t) {
            if (null == t) return null;
            const e = 1 * t;
            return isNaN(e) ? null : e;
        },
    };
class J {
    constructor(t, e, o = e.toLowerCase(), i = "reflect", r) {
        (this.Owner = t),
            (this.name = e),
            (this.attribute = o),
            (this.mode = i),
            (this.converter = r),
            (this.guards = new Set()),
            (this.fieldName = "_" + e),
            (this.callbackName = e + "Changed"),
            (this.hasCallback = this.callbackName in t.prototype),
            "boolean" === i && void 0 === r && (this.converter = Y);
    }
    setValue(t, e) {
        const o = t[this.fieldName],
            i = this.converter;
        void 0 !== i && (e = i.fromView(e)),
            o !== e &&
                ((t[this.fieldName] = e),
                this.tryReflectToAttribute(t),
                this.hasCallback && t[this.callbackName](o, e),
                t.$fastController.notify(this.name));
    }
    getValue(t) {
        return g.track(t, this.name), t[this.fieldName];
    }
    onAttributeChangedCallback(t, e) {
        this.guards.has(t) ||
            (this.guards.add(t), this.setValue(t, e), this.guards.delete(t));
    }
    tryReflectToAttribute(t) {
        const e = this.mode,
            o = this.guards;
        o.has(t) ||
            "fromView" === e ||
            s.queueUpdate(() => {
                o.add(t);
                const i = t[this.fieldName];
                switch (e) {
                    case "reflect":
                        const e = this.converter;
                        s.setAttribute(t, this.attribute, void 0 !== e ? e.toView(i) : i);
                        break;
                    case "boolean":
                        s.setBooleanAttribute(t, this.attribute, i);
                }
                o.delete(t);
            });
    }
    static collect(t, ...e) {
        const o = [];
        e.push(t.attributes);
        for (let i = 0, r = e.length; i < r; ++i) {
            const r = e[i];
            if (void 0 !== r)
                for (let e = 0, i = r.length; e < i; ++e) {
                    const i = r[e];
                    "string" == typeof i
                        ? o.push(new J(t, i))
                        : o.push(new J(t, i.property, i.attribute, i.mode, i.converter));
                }
        }
        return o;
    }
}
function tt(t, e) {
    let o;
    function i(t, e) {
        arguments.length > 1 && (o.property = e);
        const i = t.constructor.attributes || (t.constructor.attributes = []);
        i.push(o);
    }
    return arguments.length > 1
        ? ((o = {}), void i(t, e))
        : ((o = void 0 === t ? {} : t), i);
}
class et {
    constructor(t, e, o, i, r, n, s, a) {
        (this.name = t),
            (this.attributes = e),
            (this.propertyLookup = o),
            (this.attributeLookup = i),
            (this.template = r),
            (this.styles = n),
            (this.shadowOptions = s),
            (this.elementOptions = a);
    }
}
const ot = new Map();
function it(t) {
    return ot.get(t);
}
const rt = { bubbles: !0, composed: !0 };
class nt extends u {
    constructor(t, e) {
        super(t),
            (this.element = t),
            (this.definition = e),
            (this.view = null),
            (this.isConnected = !1),
            (this.boundObservables = null),
            (this.behaviors = null);
        const o = e.template,
            i = e.styles,
            r = void 0 === e.shadowOptions ? void 0 : t.attachShadow(e.shadowOptions);
        if (void 0 !== o) {
            const e = (this.view = o.create(this.element));
            void 0 === r ? e.appendTo(t) : e.appendTo(r);
        }
        void 0 !== i && this.addStyles(i, r);
        const n = g.getAccessors(t);
        if (n.length > 0) {
            const e = (this.boundObservables = Object.create(null));
            for (let o = 0, i = n.length; o < i; ++o) {
                const i = n[o].name,
                    r = t[i];
                void 0 !== r && (delete t[i], (e[i] = r));
            }
        }
    }
    addStyles(t, e = this.element.shadowRoot) {
        null !== e && t.addStylesTo(e);
        const o = t.behaviors;
        null !== o && this.addBehaviors(o);
    }
    removeStyles(t) {
        const e = this.element.shadowRoot;
        null !== e && t.removeStylesFrom(e);
        const o = t.behaviors;
        null !== o && this.removeBehaviors(o);
    }
    addBehaviors(t) {
        const e = this.behaviors || (this.behaviors = []),
            o = t.length;
        for (let i = 0; i < o; ++i) e.push(t[i]);
        if (this.isConnected) {
            const e = this.element;
            for (let i = 0; i < o; ++i) t[i].bind(e, $);
        }
    }
    removeBehaviors(t) {
        const e = this.behaviors;
        if (null === e) return;
        const o = t.length;
        for (let i = 0; i < o; ++i) {
            const o = e.indexOf(t[i]);
            -1 !== o && e.splice(o, 1);
        }
        if (this.isConnected) {
            const e = this.element;
            for (let i = 0; i < o; ++i) t[i].unbind(e);
        }
    }
    onConnectedCallback() {
        if (this.isConnected) return;
        const t = this.element,
            e = this.boundObservables;
        if (null !== e) {
            const o = Object.keys(e);
            for (let i = 0, r = o.length; i < r; ++i) {
                const r = o[i];
                t[r] = e[r];
            }
            this.boundObservables = null;
        }
        const o = this.view;
        null !== o && o.bind(t, $);
        const i = this.behaviors;
        if (null !== i) for (let e = 0, o = i.length; e < o; ++e) i[e].bind(t, $);
        this.isConnected = !0;
    }
    onDisconnectedCallback() {
        if (!1 === this.isConnected) return;
        this.isConnected = !1;
        const t = this.view;
        null !== t && t.unbind();
        const e = this.behaviors;
        if (null !== e) {
            const t = this.element;
            for (let o = 0, i = e.length; o < i; ++o) e[o].unbind(t);
        }
    }
    onAttributeChangedCallback(t, e, o) {
        const i = this.definition.attributeLookup[t];
        void 0 !== i && i.onAttributeChangedCallback(this.element, o);
    }
    emit(t, e, o) {
        return (
            !!this.isConnected &&
            this.element.dispatchEvent(
                new CustomEvent(t, Object.assign(Object.assign({ detail: e }, rt), o))
            )
        );
    }
    static forCustomElement(t) {
        const e = t.$fastController;
        if (void 0 !== e) return e;
        const o = it(t.constructor);
        if (void 0 === o) throw new Error("Missing fast element definition.");
        return (t.$fastController = new nt(t, o));
    }
}
const st = { mode: "open" },
    at = {};
function lt(t) {
    return class extends t {
        constructor() {
            super(), nt.forCustomElement(this);
        }
        $emit(t, e, o) {
            return this.$fastController.emit(t, e, o);
        }
        connectedCallback() {
            this.$fastController.onConnectedCallback();
        }
        disconnectedCallback() {
            this.$fastController.onDisconnectedCallback();
        }
        attributeChangedCallback(t, e, o) {
            this.$fastController.onAttributeChangedCallback(t, e, o);
        }
    };
}
const ct = Object.assign(lt(HTMLElement), {
    from: t => lt(t),
    define(t, e = t.definition) {
        "string" == typeof e && (e = { name: e });
        const o = e.name,
            i = J.collect(t, e.attributes),
            r =
                void 0 === e.shadowOptions
                    ? st
                    : null === e.shadowOptions
                    ? void 0
                    : Object.assign(Object.assign({}, st), e.shadowOptions),
            n =
                void 0 === e.elementOptions
                    ? at
                    : Object.assign(Object.assign({}, at), e.shadowOptions),
            s = new Array(i.length),
            a = t.prototype,
            l = {},
            c = {};
        for (let t = 0, e = i.length; t < e; ++t) {
            const e = i[t];
            (s[t] = e.attribute),
                (l[e.name] = e),
                (c[e.attribute] = e),
                g.defineProperty(a, e);
        }
        Reflect.defineProperty(t, "observedAttributes", { value: s, enumerable: !0 });
        const d = new et(o, i, l, c, e.template, e.styles, r, n);
        return ot.set(t, d), customElements.define(o, t, d.elementOptions), t;
    },
    getDefinition: it,
});
function dt(t) {
    return function(e) {
        ct.define(e, t);
    };
}
const ht = Object.freeze([]),
    ut = new Map();
class pt {
    constructor() {
        this.behaviors = null;
    }
    withBehaviors(...t) {
        return (
            (this.behaviors = null === this.behaviors ? t : this.behaviors.concat(t)),
            this
        );
    }
    withKey(t) {
        return ut.set(t, this), this;
    }
    static find(t) {
        return ut.get(t) || null;
    }
}
function vt(t) {
    return t
        .map(t => (t instanceof pt ? vt(t.styles) : [t]))
        .reduce((t, e) => t.concat(e), []);
}
function ft(t) {
    return t
        .map(t => (t instanceof pt ? t.behaviors : null))
        .reduce((t, e) => (null === e ? t : (null === t && (t = []), t.concat(e))), null);
}
class bt extends pt {
    constructor(t, e) {
        super(),
            (this.styles = t),
            (this.behaviors = null),
            (this.behaviors = ft(t)),
            (this.styleSheets = vt(t).map(t => {
                let o = e.get(t);
                return (
                    void 0 === o &&
                        ((o = new CSSStyleSheet()), o.replaceSync(t), e.set(t, o)),
                    o
                );
            }));
    }
    addStylesTo(t) {
        t.adoptedStyleSheets = [...t.adoptedStyleSheets, ...this.styleSheets];
    }
    removeStylesFrom(t) {
        const e = this.styleSheets;
        t.adoptedStyleSheets = t.adoptedStyleSheets.filter(t => -1 !== e.indexOf(t));
    }
}
let gt = 0;
class mt extends pt {
    constructor(t) {
        super(),
            (this.styles = t),
            (this.behaviors = null),
            (this.behaviors = ft(t)),
            (this.styleSheets = vt(t)),
            (this.styleClass = "fast-style-class-" + ++gt);
    }
    addStylesTo(t) {
        const e = this.styleSheets,
            o = this.styleClass;
        for (let i = e.length - 1; i > -1; --i) {
            const r = document.createElement("style");
            (r.innerHTML = e[i]), (r.className = o), t.prepend(r);
        }
    }
    removeStylesFrom(t) {
        const e = t.querySelectorAll("." + this.styleClass);
        for (let o = 0, i = e.length; o < i; ++o) t.removeChild(e[o]);
    }
}
const yt = (() => {
    if ("adoptedStyleSheets" in window.ShadowRoot.prototype) {
        const t = new Map();
        return e => new bt(e, t);
    }
    return t => new mt(t);
})();
function xt(t, ...e) {
    const o = [];
    let i = "";
    for (let r = 0, n = t.length - 1; r < n; ++r) {
        i += t[r];
        const n = e[r];
        n instanceof pt
            ? ("" !== i.trim() && (o.push(i), (i = "")), o.push(n))
            : (i += n);
    }
    return (i += t[t.length - 1]), "" !== i.trim() && o.push(i), yt(o);
}
class kt {
    constructor(t, e) {
        (this.target = t), (this.propertyName = e);
    }
    bind(t) {
        t[this.propertyName] = this.target;
    }
    unbind() {}
}
function Ct(t) {
    return new T("fast-ref", kt, t);
}
class wt {
    constructor(t, e, o) {
        (this.location = t),
            (this.template = o),
            (this.view = null),
            (this.context = void 0),
            (this.observableExpression = new F(e, this));
    }
    bind(t, e) {
        (this.source = t),
            (this.context = e),
            this.updateTarget(this.observableExpression.evaluate(t, e));
    }
    unbind() {
        null !== this.view && this.view.unbind(),
            this.observableExpression.dispose(),
            (this.source = null);
    }
    handleExpressionChange() {
        this.updateTarget(this.observableExpression.evaluate(this.source, this.context));
    }
    updateTarget(t) {
        t && null == this.view
            ? ((this.view =
                  this.cachedView || (this.cachedView = this.template.create())),
              this.view.bind(this.source, this.context),
              this.view.insertBefore(this.location))
            : t ||
              null === this.view ||
              (this.view.remove(), this.view.unbind(), (this.view = null));
    }
}
class $t extends D {
    constructor(t, e) {
        super(),
            (this.expression = t),
            (this.template = e),
            (this.createPlaceholder = s.createBlockPlaceholder);
    }
    createBehavior(t) {
        return new wt(t, this.expression, this.template);
    }
}
function Ft(t, e) {
    return new $t(t, e);
}
class Dt extends class {
    constructor(t, e) {
        (this.target = t), (this.options = e), (this.source = null);
    }
    bind(t) {
        const e = this.options.property;
        (this.shouldUpdate = g.getAccessors(t).some(t => t.name === e)),
            (this.source = t),
            this.updateTarget(this.getNodes()),
            this.shouldUpdate && this.observe();
    }
    unbind() {
        this.updateTarget(ht),
            (this.source = null),
            this.shouldUpdate && this.unobserve();
    }
    handleEvent() {
        this.updateTarget(this.getNodes());
    }
    updateTarget(t) {
        this.source[this.options.property] = t;
    }
} {
    constructor(t, e) {
        super(t, e);
    }
    getNodes() {
        return this.target.assignedNodes(this.options);
    }
    observe() {
        this.target.addEventListener("slotchange", this);
    }
    unobserve() {
        this.target.removeEventListener("slotchange", this);
    }
}
function Tt(t) {
    return "string" == typeof t && (t = { property: t }), new T("fast-slotted", Dt, t);
}
class Pt {
    handleStartContentChange() {
        this.startContainer.classList.toggle(
            "start",
            this.start.assignedNodes().length > 0
        );
    }
    handleEndContentChange() {
        this.endContainer.classList.toggle("end", this.end.assignedNodes().length > 0);
    }
}
const Et = Q`
    <span name="end" part="end" ${Ct("endContainer")}>
        <slot
            name="end"
            ${Ct("end")}
            @slotchange=${t => t.handleEndContentChange()}
        ></slot>
    </span>
`,
    At = Q`
    <span name="start" part="start" ${Ct("startContainer")}>
        <slot
            name="start"
            ${Ct("start")}
            @slotchange=${t => t.handleStartContentChange()}
        ></slot>
    </span>
`,
    St = Q`
    <template class="${t => t.appearance}">
        <a
            class="control"
            download="${t => t.download}"
            href="${t => t.href}"
            hreflang="${t => t.hreflang}"
            ping="${t => t.ping}"
            referrerpolicy="${t => t.referrerpolicy}"
            rel="${t => t.rel}"
            target="${t => t.target}"
            type="${t => t.type}"
        >
            ${At}
            <span class="content" part="content">
                <slot></slot>
            </span>
            ${Et}
        </a>
    </template>
`;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ function Ht(
    t,
    e,
    o,
    i
) {
    var r,
        n = arguments.length,
        s = n < 3 ? e : null === i ? (i = Object.getOwnPropertyDescriptor(e, o)) : i;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
        s = Reflect.decorate(t, e, o, i);
    else
        for (var a = t.length - 1; a >= 0; a--)
            (r = t[a]) && (s = (n < 3 ? r(s) : n > 3 ? r(e, o, s) : r(e, o)) || s);
    return n > 3 && s && Object.defineProperty(e, o, s), s;
}
function Ot(t, ...e) {
    e.forEach(e => {
        Object.getOwnPropertyNames(e.prototype).forEach(o => {
            Object.defineProperty(
                t.prototype,
                o,
                Object.getOwnPropertyDescriptor(e.prototype, o)
            );
        });
    });
}
class Lt extends ct {
    constructor() {
        super(...arguments), (this.appearance = "neutral");
    }
}
Ht([tt], Lt.prototype, "appearance", void 0),
    Ht([tt], Lt.prototype, "download", void 0),
    Ht([tt], Lt.prototype, "href", void 0),
    Ht([tt], Lt.prototype, "hreflang", void 0),
    Ht([tt], Lt.prototype, "ping", void 0),
    Ht([tt], Lt.prototype, "referrerpolicy", void 0),
    Ht([tt], Lt.prototype, "rel", void 0),
    Ht([tt], Lt.prototype, "target", void 0),
    Ht([tt], Lt.prototype, "type", void 0),
    Ot(Lt, Pt);
const Bt = Q`
    <template class="${t => (t.circular ? "circular" : "")}">
        <div
            class="badge"
            style="${t =>
                t.fill || t.color
                    ? `background-color: var(--badge-fill-${t.fill}); color: var(--badge-color-${t.color})`
                    : void 0}"
        >
            <slot></slot>
        </div>
    </template>
`;
class Rt extends ct {}
Ht([tt({ attribute: "fill" })], Rt.prototype, "fill", void 0),
    Ht([tt({ attribute: "color" })], Rt.prototype, "color", void 0),
    Ht([tt({ mode: "boolean" })], Rt.prototype, "circular", void 0);
const Mt = Q`
    <template class="${t => t.appearance}">
        <button
            class="control"
            ?autofocus=${t => t.autofocus}
            ?disabled=${t => t.disabled}
            form=${t => t.formId}
            formaction=${t => t.formaction}
            formenctype=${t => t.formenctype}
            formmethod=${t => t.formmethod}
            formnovalidate=${t => t.formnovalidate}
            formtarget=${t => t.formtarget}
            name=${t => t.name}
            type=${t => t.type}
            value=${t => t.value}
        >
            ${At}
            <span class="content" part="content">
                <slot></slot>
            </span>
            ${Et}
        </button>
    </template>
`;
var It;
!(function(t) {
    (t.horizontal = "horizontal"), (t.vertical = "vertical");
})(It || (It = {}));
var Nt = "object" == typeof global && global && global.Object === Object && global,
    zt = "object" == typeof self && self && self.Object === Object && self,
    jt = Nt || zt || Function("return this")(),
    _t = jt.Symbol,
    Vt = Object.prototype,
    Gt = Vt.hasOwnProperty,
    qt = Vt.toString,
    Wt = _t ? _t.toStringTag : void 0;
var Ut = Object.prototype.toString;
var Kt = _t ? _t.toStringTag : void 0;
function Xt(t) {
    return null == t
        ? void 0 === t
            ? "[object Undefined]"
            : "[object Null]"
        : Kt && Kt in Object(t)
        ? (function(t) {
              var e = Gt.call(t, Wt),
                  o = t[Wt];
              try {
                  t[Wt] = void 0;
                  var i = !0;
              } catch (t) {}
              var r = qt.call(t);
              return i && (e ? (t[Wt] = o) : delete t[Wt]), r;
          })(t)
        : (function(t) {
              return Ut.call(t);
          })(t);
}
function Qt(t) {
    return null != t && "object" == typeof t;
}
function Yt(t) {
    var e = typeof t;
    return null != t && ("object" == e || "function" == e);
}
var Zt = /^\s+|\s+$/g,
    Jt = /^[-+]0x[0-9a-f]+$/i,
    te = /^0b[01]+$/i,
    ee = /^0o[0-7]+$/i,
    oe = parseInt;
function ie(t) {
    if ("number" == typeof t) return t;
    if (
        (function(t) {
            return "symbol" == typeof t || (Qt(t) && "[object Symbol]" == Xt(t));
        })(t)
    )
        return NaN;
    if (Yt(t)) {
        var e = "function" == typeof t.valueOf ? t.valueOf() : t;
        t = Yt(e) ? e + "" : e;
    }
    if ("string" != typeof t) return 0 === t ? t : +t;
    t = t.replace(Zt, "");
    var o = te.test(t);
    return o || ee.test(t) ? oe(t.slice(2), o ? 2 : 8) : Jt.test(t) ? NaN : +t;
}
function re(t) {
    return t
        ? (t = ie(t)) === 1 / 0 || t === -1 / 0
            ? 17976931348623157e292 * (t < 0 ? -1 : 1)
            : t == t
            ? t
            : 0
        : 0 === t
        ? t
        : 0;
}
function ne(t) {
    if (!Yt(t)) return !1;
    var e = Xt(t);
    return (
        "[object Function]" == e ||
        "[object GeneratorFunction]" == e ||
        "[object AsyncFunction]" == e ||
        "[object Proxy]" == e
    );
}
var se,
    ae = jt["__core-js_shared__"],
    le = (se = /[^.]+$/.exec((ae && ae.keys && ae.keys.IE_PROTO) || ""))
        ? "Symbol(src)_1." + se
        : "";
var ce = Function.prototype.toString;
var de = /^\[object .+?Constructor\]$/,
    he = Function.prototype,
    ue = Object.prototype,
    pe = he.toString,
    ve = ue.hasOwnProperty,
    fe = RegExp(
        "^" +
            pe
                .call(ve)
                .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
                .replace(
                    /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                    "$1.*?"
                ) +
            "$"
    );
function be(t) {
    return (
        !(!Yt(t) || ((e = t), le && le in e)) &&
        (ne(t) ? fe : de).test(
            (function(t) {
                if (null != t) {
                    try {
                        return ce.call(t);
                    } catch (t) {}
                    try {
                        return t + "";
                    } catch (t) {}
                }
                return "";
            })(t)
        )
    );
    var e;
}
function ge(t, e) {
    var o = (function(t, e) {
        return null == t ? void 0 : t[e];
    })(t, e);
    return be(o) ? o : void 0;
}
var me = ge(Object, "create");
var ye = Object.prototype.hasOwnProperty;
var xe = Object.prototype.hasOwnProperty;
function ke(t) {
    var e = -1,
        o = null == t ? 0 : t.length;
    for (this.clear(); ++e < o; ) {
        var i = t[e];
        this.set(i[0], i[1]);
    }
}
function Ce(t, e) {
    for (var o, i, r = t.length; r--; )
        if ((o = t[r][0]) === (i = e) || (o != o && i != i)) return r;
    return -1;
}
(ke.prototype.clear = function() {
    (this.__data__ = me ? me(null) : {}), (this.size = 0);
}),
    (ke.prototype.delete = function(t) {
        var e = this.has(t) && delete this.__data__[t];
        return (this.size -= e ? 1 : 0), e;
    }),
    (ke.prototype.get = function(t) {
        var e = this.__data__;
        if (me) {
            var o = e[t];
            return "__lodash_hash_undefined__" === o ? void 0 : o;
        }
        return ye.call(e, t) ? e[t] : void 0;
    }),
    (ke.prototype.has = function(t) {
        var e = this.__data__;
        return me ? void 0 !== e[t] : xe.call(e, t);
    }),
    (ke.prototype.set = function(t, e) {
        var o = this.__data__;
        return (
            (this.size += this.has(t) ? 0 : 1),
            (o[t] = me && void 0 === e ? "__lodash_hash_undefined__" : e),
            this
        );
    });
var we = Array.prototype.splice;
function $e(t) {
    var e = -1,
        o = null == t ? 0 : t.length;
    for (this.clear(); ++e < o; ) {
        var i = t[e];
        this.set(i[0], i[1]);
    }
}
($e.prototype.clear = function() {
    (this.__data__ = []), (this.size = 0);
}),
    ($e.prototype.delete = function(t) {
        var e = this.__data__,
            o = Ce(e, t);
        return (
            !(o < 0) && (o == e.length - 1 ? e.pop() : we.call(e, o, 1), --this.size, !0)
        );
    }),
    ($e.prototype.get = function(t) {
        var e = this.__data__,
            o = Ce(e, t);
        return o < 0 ? void 0 : e[o][1];
    }),
    ($e.prototype.has = function(t) {
        return Ce(this.__data__, t) > -1;
    }),
    ($e.prototype.set = function(t, e) {
        var o = this.__data__,
            i = Ce(o, t);
        return i < 0 ? (++this.size, o.push([t, e])) : (o[i][1] = e), this;
    });
var Fe = ge(jt, "Map");
function De(t, e) {
    var o,
        i,
        r = t.__data__;
    return ("string" == (i = typeof (o = e)) ||
    "number" == i ||
    "symbol" == i ||
    "boolean" == i
      ? "__proto__" !== o
      : null === o)
        ? r["string" == typeof e ? "string" : "hash"]
        : r.map;
}
function Te(t) {
    var e = -1,
        o = null == t ? 0 : t.length;
    for (this.clear(); ++e < o; ) {
        var i = t[e];
        this.set(i[0], i[1]);
    }
}
(Te.prototype.clear = function() {
    (this.size = 0),
        (this.__data__ = { hash: new ke(), map: new (Fe || $e)(), string: new ke() });
}),
    (Te.prototype.delete = function(t) {
        var e = De(this, t).delete(t);
        return (this.size -= e ? 1 : 0), e;
    }),
    (Te.prototype.get = function(t) {
        return De(this, t).get(t);
    }),
    (Te.prototype.has = function(t) {
        return De(this, t).has(t);
    }),
    (Te.prototype.set = function(t, e) {
        var o = De(this, t),
            i = o.size;
        return o.set(t, e), (this.size += o.size == i ? 0 : 1), this;
    });
function Pe(t, e) {
    if ("function" != typeof t || (null != e && "function" != typeof e))
        throw new TypeError("Expected a function");
    var o = function() {
        var i = arguments,
            r = e ? e.apply(this, i) : i[0],
            n = o.cache;
        if (n.has(r)) return n.get(r);
        var s = t.apply(this, i);
        return (o.cache = n.set(r, s) || n), s;
    };
    return (o.cache = new (Pe.Cache || Te)()), o;
}
Pe.Cache = Te;
var Ee = Math.max,
    Ae = Math.min;
function Se(t, e, o) {
    return (
        (e = re(e)),
        void 0 === o ? ((o = e), (e = 0)) : (o = re(o)),
        (function(t, e, o) {
            return t >= Ae(e, o) && t < Ee(e, o);
        })((t = ie(t)), e, o)
    );
}
let He;
var Oe;
!(function(t) {
    (t[(t.alt = 18)] = "alt"),
        (t[(t.arrowDown = 40)] = "arrowDown"),
        (t[(t.arrowLeft = 37)] = "arrowLeft"),
        (t[(t.arrowRight = 39)] = "arrowRight"),
        (t[(t.arrowUp = 38)] = "arrowUp"),
        (t[(t.back = 8)] = "back"),
        (t[(t.backSlash = 220)] = "backSlash"),
        (t[(t.break = 19)] = "break"),
        (t[(t.capsLock = 20)] = "capsLock"),
        (t[(t.closeBracket = 221)] = "closeBracket"),
        (t[(t.colon = 186)] = "colon"),
        (t[(t.colon2 = 59)] = "colon2"),
        (t[(t.comma = 188)] = "comma"),
        (t[(t.ctrl = 17)] = "ctrl"),
        (t[(t.delete = 46)] = "delete"),
        (t[(t.end = 35)] = "end"),
        (t[(t.enter = 13)] = "enter"),
        (t[(t.equals = 187)] = "equals"),
        (t[(t.equals2 = 61)] = "equals2"),
        (t[(t.equals3 = 107)] = "equals3"),
        (t[(t.escape = 27)] = "escape"),
        (t[(t.forwardSlash = 191)] = "forwardSlash"),
        (t[(t.function1 = 112)] = "function1"),
        (t[(t.function10 = 121)] = "function10"),
        (t[(t.function11 = 122)] = "function11"),
        (t[(t.function12 = 123)] = "function12"),
        (t[(t.function2 = 113)] = "function2"),
        (t[(t.function3 = 114)] = "function3"),
        (t[(t.function4 = 115)] = "function4"),
        (t[(t.function5 = 116)] = "function5"),
        (t[(t.function6 = 117)] = "function6"),
        (t[(t.function7 = 118)] = "function7"),
        (t[(t.function8 = 119)] = "function8"),
        (t[(t.function9 = 120)] = "function9"),
        (t[(t.home = 36)] = "home"),
        (t[(t.insert = 45)] = "insert"),
        (t[(t.menu = 93)] = "menu"),
        (t[(t.minus = 189)] = "minus"),
        (t[(t.minus2 = 109)] = "minus2"),
        (t[(t.numLock = 144)] = "numLock"),
        (t[(t.numPad0 = 96)] = "numPad0"),
        (t[(t.numPad1 = 97)] = "numPad1"),
        (t[(t.numPad2 = 98)] = "numPad2"),
        (t[(t.numPad3 = 99)] = "numPad3"),
        (t[(t.numPad4 = 100)] = "numPad4"),
        (t[(t.numPad5 = 101)] = "numPad5"),
        (t[(t.numPad6 = 102)] = "numPad6"),
        (t[(t.numPad7 = 103)] = "numPad7"),
        (t[(t.numPad8 = 104)] = "numPad8"),
        (t[(t.numPad9 = 105)] = "numPad9"),
        (t[(t.numPadDivide = 111)] = "numPadDivide"),
        (t[(t.numPadDot = 110)] = "numPadDot"),
        (t[(t.numPadMinus = 109)] = "numPadMinus"),
        (t[(t.numPadMultiply = 106)] = "numPadMultiply"),
        (t[(t.numPadPlus = 107)] = "numPadPlus"),
        (t[(t.openBracket = 219)] = "openBracket"),
        (t[(t.pageDown = 34)] = "pageDown"),
        (t[(t.pageUp = 33)] = "pageUp"),
        (t[(t.period = 190)] = "period"),
        (t[(t.print = 44)] = "print"),
        (t[(t.quote = 222)] = "quote"),
        (t[(t.scrollLock = 145)] = "scrollLock"),
        (t[(t.shift = 16)] = "shift"),
        (t[(t.space = 32)] = "space"),
        (t[(t.tab = 9)] = "tab"),
        (t[(t.tilde = 192)] = "tilde"),
        (t[(t.windowsLeft = 91)] = "windowsLeft"),
        (t[(t.windowsOpera = 219)] = "windowsOpera"),
        (t[(t.windowsRight = 92)] = "windowsRight");
})(Oe || (Oe = {}));
var Le, Be;
!(function(t) {
    (t.ltr = "ltr"), (t.rtl = "rtl");
})(Le || (Le = {})),
    (function(t) {
        (t.Canvas = "Canvas"),
            (t.CanvasText = "CanvasText"),
            (t.LinkText = "LinkText"),
            (t.VisitedText = "VisitedText"),
            (t.ActiveText = "ActiveText"),
            (t.ButtonFace = "ButtonFace"),
            (t.ButtonText = "ButtonText"),
            (t.Field = "Field"),
            (t.FieldText = "FieldText"),
            (t.Highlight = "Highlight"),
            (t.HighlightText = "HighlightText"),
            (t.GrayText = "GrayText");
    })(Be || (Be = {}));
const Re = "ElementInternals" in window;
class Me extends ct {
    constructor() {
        super(),
            (this.value = ""),
            (this.disabled = !1),
            (this.required = !1),
            (this.proxyEventsToBlock = ["change", "click"]),
            Re && (this.elementInternals = this.attachInternals());
    }
    static get formAssociated() {
        return Re;
    }
    get validity() {
        return Re ? this.elementInternals.validity : this.proxy.validity;
    }
    get form() {
        return Re ? this.elementInternals.form : this.proxy.form;
    }
    get validationMessage() {
        return Re
            ? this.elementInternals.validationMessage
            : this.proxy.validationMessage;
    }
    get willValidate() {
        return Re ? this.elementInternals.willValidate : this.proxy.willValidate;
    }
    get labels() {
        if (Re) return Object.freeze(Array.from(this.elementInternals.labels));
        if (this.proxy instanceof HTMLElement && this.proxy.ownerDocument && this.id) {
            const t = this.proxy.labels,
                e = Array.from(
                    this.proxy.getRootNode().querySelectorAll(`[for='${this.id}']`)
                ),
                o = t ? e.concat(Array.from(t)) : e;
            return Object.freeze(o);
        }
        return ht;
    }
    disabledChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.disabled = this.disabled),
            s.queueUpdate(() => this.classList.toggle("disabled", this.disabled));
    }
    nameChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.name = this.name);
    }
    requiredChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.required = this.required),
            s.queueUpdate(() => this.classList.toggle("required", this.required));
    }
    connectedCallback() {
        super.connectedCallback(),
            Re ||
                ((this.proxy.style.display = "none"),
                this.appendChild(this.proxy),
                this.proxyEventsToBlock.forEach(t =>
                    this.proxy.addEventListener(t, this.stopPropagation)
                ),
                (this.proxy.disabled = this.disabled),
                (this.proxy.required = this.required),
                "string" == typeof this.name && (this.proxy.name = this.name),
                "string" == typeof this.value && (this.proxy.value = this.value));
    }
    disconnectedCallback() {
        this.proxyEventsToBlock.forEach(t =>
            this.proxy.removeEventListener(t, this.stopPropagation)
        );
    }
    checkValidity() {
        return Re ? this.elementInternals.checkValidity() : this.proxy.checkValidity();
    }
    reportValidity() {
        return Re ? this.elementInternals.reportValidity() : this.proxy.reportValidity();
    }
    setValidity(t, e, o) {
        Re
            ? this.elementInternals.setValidity(t, e, o)
            : "string" == typeof e && this.proxy.setCustomValidity(e);
    }
    formDisabledCallback(t) {
        this.disabled = t;
    }
    setFormValue(t, e) {
        Re && this.elementInternals.setFormValue(t, e);
    }
    keypressHandler(t) {
        switch (t.keyCode) {
            case 13:
                this.form instanceof HTMLFormElement && this.form.submit();
        }
    }
    stopPropagation(t) {
        t.stopPropagation();
    }
}
Ht([tt], Me.prototype, "value", void 0),
    Ht([tt({ mode: "boolean" })], Me.prototype, "disabled", void 0),
    Ht([tt], Me.prototype, "name", void 0),
    Ht([tt({ mode: "boolean" })], Me.prototype, "required", void 0);
class Ie extends Me {
    constructor() {
        super(),
            (this.appearance = "neutral"),
            (this.proxy = document.createElement("input")),
            this.proxy.setAttribute("type", "" + this.type);
    }
    formactionChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.formAction = this.formaction);
    }
    formenctypeChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.formEnctype = this.formenctype);
    }
    formmethodChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.formMethod = this.formmethod);
    }
    formnovalidateChanged() {
        this.proxy instanceof HTMLElement &&
            (this.proxy.formNoValidate = this.formnovalidate);
    }
    formtargetChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.formTarget = this.formtarget);
    }
    typeChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.type = this.type);
    }
    valueChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.value = this.value);
    }
    connectedCallback() {
        super.connectedCallback(), this.setFormValue(this.value, this.value);
    }
}
Ht([tt], Ie.prototype, "appearance", void 0),
    Ht([tt({ mode: "boolean" })], Ie.prototype, "autofocus", void 0),
    Ht([tt({ attribute: "form" })], Ie.prototype, "formId", void 0),
    Ht([tt], Ie.prototype, "formaction", void 0),
    Ht([tt], Ie.prototype, "formenctype", void 0),
    Ht([tt], Ie.prototype, "formmethod", void 0),
    Ht([tt({ mode: "boolean" })], Ie.prototype, "formnovalidate", void 0),
    Ht([tt], Ie.prototype, "formtarget", void 0),
    Ht([tt], Ie.prototype, "name", void 0),
    Ht([tt], Ie.prototype, "type", void 0),
    Ot(Ie, Pt);
const Ne = Q`<slot></slot>`;
class ze extends ct {}
const je = Q`
    <template
        role="checkbox"
        aria-checked="${t => t.checked}"
        aria-required="${t => t.required}"
        aria-disabled="${t => t.disabled}"
        aria-readonly="${t => t.readOnly}"
        tabindex="${t => (t.disabled ? null : 0)}"
        @keypress="${(t, e) => t.keypressHandler(e.event)}"
        @click="${(t, e) => t.clickHandler(e.event)}"
        class="${t => (t.readOnly ? "readonly" : "")} ${t =>
    t.checked ? "checked" : ""} ${t => (t.indeterminate ? "indeterminate" : "")}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                <svg
                    aria-hidden="true"
                    part="checked-indicator"
                    class="checked-indicator"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.143 12.6697L15.235 4.5L16.8 5.90363L8.23812 15.7667L3.80005 11.2556L5.27591 9.7555L8.143 12.6697Z"
                    />
                </svg>
            </slot>
            <slot name="indeterminate-indicator">
                <div part="indeterminate-indicator" class="indeterminate-indicator"></div>
            </slot>
        </div>
        <label
            part="label"
            class="${t =>
                t.defaultSlottedNodes && t.defaultSlottedNodes.length
                    ? "label"
                    : "label label__hidden"}"
        >
            <slot ${Tt("defaultSlottedNodes")}></slot>
        </label>
    </template>
`;
class _e extends Me {
    constructor() {
        super(),
            (this.value = "on"),
            (this.defaultChecked = !!this.checkedAttribute),
            (this.checked = this.defaultChecked),
            (this.proxy = document.createElement("input")),
            (this.indeterminate = !1),
            (this.dirtyChecked = !1),
            (this.constructed = !1),
            (this.keypressHandler = t => {
                switch ((super.keypressHandler(t), t.keyCode)) {
                    case 32:
                        this.checked = !this.checked;
                }
            }),
            (this.clickHandler = t => {
                this.disabled || this.readOnly || (this.checked = !this.checked);
            }),
            this.proxy.setAttribute("type", "checkbox"),
            (this.constructed = !0);
    }
    readOnlyChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.readOnly = this.readOnly);
    }
    valueChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.value = this.value);
    }
    checkedAttributeChanged() {
        this.defaultChecked = this.checkedAttribute;
    }
    defaultCheckedChanged() {
        this.dirtyChecked ||
            ((this.checked = this.defaultChecked), (this.dirtyChecked = !1));
    }
    checkedChanged() {
        this.dirtyChecked || (this.dirtyChecked = !0),
            this.updateForm(),
            this.proxy instanceof HTMLElement && (this.proxy.checked = this.checked),
            this.constructed && this.$emit("change");
    }
    connectedCallback() {
        super.connectedCallback(), this.updateForm();
    }
    updateForm() {
        const t = this.checked ? this.value : null;
        this.setFormValue(t, t);
    }
}
function Ve(t, e, o) {
    return Object.freeze({
        name: t,
        value: e,
        host: o,
        bind(t) {
            const e = this.host(t);
            null !== e &&
                ("function" == typeof e.registerCSSCustomProperty
                    ? e.registerCSSCustomProperty(this)
                    : (Array.isArray(e.disconnectedCSSCustomPropertyRegistry) ||
                          (e.disconnectedCSSCustomPropertyRegistry = []),
                      e.disconnectedCSSCustomPropertyRegistry.push(this)));
        },
        unbind(t) {
            const e = this.host(t);
            null !== e && e.unregisterCSSCustomProperty(this);
        },
    });
}
function Ge(t) {
    const e = t.parentElement;
    if (e) return e;
    {
        const e = t.getRootNode();
        if (e.host instanceof HTMLElement) return e.host;
    }
    return null;
}
Ht([tt({ attribute: "readonly", mode: "boolean" })], _e.prototype, "readOnly", void 0),
    Ht(
        [tt({ attribute: "checked", mode: "boolean" })],
        _e.prototype,
        "checkedAttribute",
        void 0
    ),
    Ht([x], _e.prototype, "defaultSlottedNodes", void 0),
    Ht([x], _e.prototype, "defaultChecked", void 0),
    Ht([x], _e.prototype, "checked", void 0),
    Ht([x], _e.prototype, "indeterminate", void 0);
const qe = (function(t) {
    const e = new WeakMap();
    return o =>
        Object.freeze({
            query: t,
            cache: e,
            sheet: o,
            constructListener(t, e) {
                let o = !1;
                return function() {
                    const { matches: i } = this;
                    i && !o
                        ? (t.$fastController.addStyles(e), (o = i))
                        : !i && o && (t.$fastController.removeStyles(e), (o = i));
                };
            },
            bind(t) {
                const { constructListener: e, query: o, cache: i } = this,
                    r = e(t, this.sheet),
                    n = i.get(t);
                r.bind(o)(),
                    o.addListener(r),
                    void 0 !== n
                        ? Array.isArray(n)
                            ? n.push(r)
                            : i.set(t, [n, r])
                        : i.set(t, r);
            },
            unbind(t) {
                const { cache: e, query: o } = this,
                    i = e.get(t);
                void 0 !== i &&
                    (Array.isArray(i)
                        ? i.forEach(t => o.removeListener(t))
                        : o.removeListener(i),
                    e.delete(t));
            },
        });
})(window.matchMedia("(forced-colors)"));
function We(t) {
    return `\n        \n    :host([hidden]) {\n        display: none;\n    }\n :host {\n            display: ${t};\n        }\n    `;
}
const Ue = (function() {
        if (!0 === (t = He) || !1 === t || (Qt(t) && "[object Boolean]" == Xt(t)))
            return He;
        var t;
        if (
            "undefined" == typeof window ||
            !window.document ||
            !window.document.createElement
        )
            return (He = !1), He;
        const e = document.createElement("style");
        document.head.appendChild(e);
        try {
            e.sheet.insertRule("foo:focus-visible {color:inherit}", 0), (He = !0);
        } catch (t) {
            He = !1;
        } finally {
            document.head.removeChild(e);
        }
        return He;
    })()
        ? "focus-visible"
        : "focus",
    Ke = "adoptedStyleSheets" in window.ShadowRoot.prototype;
function Xe(t) {
    const e = t.provider;
    return null != e && Ye.isDesignSystemProvider(e);
}
const Qe = {
    bind(t) {
        t.provider = Ye.findProvider(t);
    },
    unbind(t) {},
};
class Ye extends ct {
    constructor() {
        if (
            (super(),
            (this.isDesignSystemProvider = !0),
            (this.designSystem = {}),
            (this.useDefaults = !1),
            (this.provider = null),
            (this.cssCustomPropertyDefinitions = new Map()),
            (this.attributeChangeHandler = {
                handleChange: (t, e) => {
                    const o = this[e];
                    if (this.isValidDesignSystemValue(o)) {
                        this.designSystem[e] = o;
                        const t = this.designSystemProperties[e];
                        t &&
                            t.cssCustomProperty &&
                            this.setCustomProperty({
                                name: t.cssCustomProperty,
                                value: o,
                            });
                    } else {
                        this.syncDesignSystemWithProvider();
                        const t = this.designSystemProperties[e].cssCustomProperty;
                        "string" == typeof t && this.deleteCustomProperty(t),
                            this.writeCustomProperties();
                    }
                },
            }),
            (this.localDesignSystemChangeHandler = {
                handleChange: this.writeCustomProperties.bind(this),
            }),
            (this.providerDesignSystemChangeHandler = {
                handleChange: (t, e) => {
                    t[e] === this.designSystem[e] ||
                        this.isValidDesignSystemValue(this[e]) ||
                        (this.designSystem[e] = t[e]);
                },
            }),
            (this.setCustomProperty = t => {
                this.customPropertyTarget.setProperty("--" + t.name, this.evaluate(t));
            }),
            (this.deleteCustomProperty = t => {
                this.customPropertyTarget.removeProperty("--" + t);
            }),
            Ke && null !== this.shadowRoot)
        ) {
            const t = new CSSStyleSheet();
            t.insertRule(":host{}"),
                (this.shadowRoot.adoptedStyleSheets = [
                    ...this.shadowRoot.adoptedStyleSheets,
                    t,
                ]),
                (this.customPropertyTarget = t.rules[0].style);
        } else this.customPropertyTarget = this.style;
        this.$fastController.addBehaviors([Qe]);
    }
    static get tagNames() {
        return Ye._tagNames;
    }
    static isDesignSystemProvider(t) {
        return t.isDesignSystemProvider || -1 !== Ye.tagNames.indexOf(t.tagName);
    }
    static findProvider(t) {
        if (Xe(t)) return t.provider;
        let e = Ge(t);
        for (; null !== e; ) {
            if (Ye.isDesignSystemProvider(e)) return (t.provider = e), e;
            if (Xe(e)) return (t.provider = e.provider), e.provider;
            e = Ge(e);
        }
        return null;
    }
    static registerTagName(t) {
        const e = t.toUpperCase();
        -1 === Ye.tagNames.indexOf(e) && Ye._tagNames.push(e);
    }
    useDefaultsChanged() {
        if (this.useDefaults) {
            const t = this.designSystemProperties;
            Object.keys(t).forEach(e => {
                void 0 === this[e] && (this[e] = t[e].default);
            });
        }
    }
    providerChanged(t, e) {
        t instanceof HTMLElement &&
            Object.keys(t.designSystemProperties).forEach(e => {
                g.getNotifier(t.designSystem).unsubscribe(
                    this.providerDesignSystemChangeHandler,
                    e
                );
            }),
            e instanceof HTMLElement &&
                Ye.isDesignSystemProvider(e) &&
                (Object.keys(e.designSystemProperties).forEach(t => {
                    g.getNotifier(e.designSystem).subscribe(
                        this.providerDesignSystemChangeHandler,
                        t
                    );
                }),
                this.syncDesignSystemWithProvider());
    }
    connectedCallback() {
        super.connectedCallback();
        const t = g.getNotifier(this),
            e = g.getNotifier(this.designSystem);
        if (
            (Object.keys(this.designSystemProperties).forEach(o => {
                x(this.designSystem, o),
                    t.subscribe(this.attributeChangeHandler, o),
                    e.subscribe(this.localDesignSystemChangeHandler, o);
                const i = this[o];
                if (this.isValidDesignSystemValue(i)) {
                    this.designSystem[o] = i;
                    const { cssCustomProperty: t } = this.designSystemProperties[o];
                    "string" == typeof t && this.setCustomProperty({ name: t, value: i });
                }
            }),
            Array.isArray(this.disconnectedCSSCustomPropertyRegistry))
        ) {
            for (let t = 0; t < this.disconnectedCSSCustomPropertyRegistry.length; t++)
                this.registerCSSCustomProperty(
                    this.disconnectedCSSCustomPropertyRegistry[t]
                );
            delete this.disconnectedCSSCustomPropertyRegistry;
        }
    }
    registerCSSCustomProperty(t) {
        const e = this.cssCustomPropertyDefinitions.get(t.name);
        e
            ? (e.count += 1)
            : (this.cssCustomPropertyDefinitions.set(
                  t.name,
                  Object.assign(Object.assign({}, t), { count: 1 })
              ),
              this.setCustomProperty(t));
    }
    unregisterCSSCustomProperty(t) {
        const e = this.cssCustomPropertyDefinitions.get(t.name);
        e &&
            ((e.count -= 1),
            0 === e.count &&
                (this.cssCustomPropertyDefinitions.delete(t.name),
                this.deleteCustomProperty(t.name)));
    }
    writeCustomProperties() {
        this.cssCustomPropertyDefinitions.forEach(this.setCustomProperty);
    }
    evaluate(t) {
        return "function" == typeof t.value
            ? t.value(Object.assign({}, this.designSystem))
            : t.value;
    }
    syncDesignSystemWithProvider() {
        if (this.provider) {
            const t = this.designSystemProperties;
            Object.keys(t).forEach(e => {
                const o = t[e];
                this.isValidDesignSystemValue(o) ||
                    (this.designSystem[e] = this.provider.designSystem[e]);
            });
        }
    }
    isValidDesignSystemValue(t) {
        return null != t;
    }
}
function Ze(t) {
    return (e, o) => {
        ((t, e, o) => {
            const { cssCustomProperty: i, attribute: r } = o;
            t.designSystemProperties || (t.designSystemProperties = {}),
                !1 === r
                    ? x(t, e)
                    : (void 0 === o.mode &&
                          (o = Object.assign(Object.assign({}, o), { mode: "fromView" })),
                      tt(o)(t, e)),
                (t.designSystemProperties[e] = {
                    cssCustomProperty:
                        !1 !== i &&
                        ("string" == typeof i ? i : "string" == typeof r ? r : e),
                    default: o.default,
                });
        })(e, o, t);
    };
}
(Ye._tagNames = []),
    Ht(
        [tt({ attribute: "use-defaults", mode: "boolean" })],
        Ye.prototype,
        "useDefaults",
        void 0
    ),
    Ht([x], Ye.prototype, "provider", void 0);
const Je = Q`<slot></slot>`,
    to = Q`
    <div class="positioning-region" part="positioning-region">
        ${Ft(
            t => t.modal,
            Q`
                <div
                    class="overlay"
                    part="overlay"
                    role="presentation"
                    tabindex="-1"
                    @click=${t => t.dismiss()}
                ></div>
            `
        )}
        <div
            role="dialog"
            class="root"
            part="root"
            aria-modal=${t => t.modal}
            aria-describedby=${t => t.ariaDescribedby}
            aria-labelledby=${t => t.ariaLabelledby}
            aria-label=${t => t.ariaLabel}
            ${Ct("dialog")}
        >
            <slot></slot>
        </div>
    </div>
`;
var eo = [
        "input",
        "select",
        "textarea",
        "a[href]",
        "button",
        "[tabindex]",
        "audio[controls]",
        "video[controls]",
        '[contenteditable]:not([contenteditable="false"])',
    ],
    oo = eo.join(","),
    io =
        "undefined" == typeof Element
            ? function() {}
            : Element.prototype.matches ||
              Element.prototype.msMatchesSelector ||
              Element.prototype.webkitMatchesSelector;
function ro(t, e) {
    e = e || {};
    var o,
        i,
        r,
        n = [],
        s = [],
        a = t.querySelectorAll(oo);
    for (
        e.includeContainer &&
            io.call(t, oo) &&
            (a = Array.prototype.slice.apply(a)).unshift(t),
            o = 0;
        o < a.length;
        o++
    )
        no((i = a[o])) &&
            (0 === (r = lo(i))
                ? n.push(i)
                : s.push({ documentOrder: o, tabIndex: r, node: i }));
    return s
        .sort(co)
        .map(function(t) {
            return t.node;
        })
        .concat(n);
}
function no(t) {
    return !(
        !so(t) ||
        (function(t) {
            return (
                (function(t) {
                    return ho(t) && "radio" === t.type;
                })(t) &&
                !(function(t) {
                    if (!t.name) return !0;
                    var e = (function(t) {
                        for (var e = 0; e < t.length; e++) if (t[e].checked) return t[e];
                    })(
                        t.ownerDocument.querySelectorAll(
                            'input[type="radio"][name="' + t.name + '"]'
                        )
                    );
                    return !e || e === t;
                })(t)
            );
        })(t) ||
        lo(t) < 0
    );
}
function so(t) {
    return !(
        t.disabled ||
        (function(t) {
            return ho(t) && "hidden" === t.type;
        })(t) ||
        (function(t) {
            return null === t.offsetParent || "hidden" === getComputedStyle(t).visibility;
        })(t)
    );
}
(ro.isTabbable = function(t) {
    if (!t) throw new Error("No node provided");
    return !1 !== io.call(t, oo) && no(t);
}),
    (ro.isFocusable = function(t) {
        if (!t) throw new Error("No node provided");
        return !1 !== io.call(t, ao) && so(t);
    });
var ao = eo.concat("iframe").join(",");
function lo(t) {
    var e = parseInt(t.getAttribute("tabindex"), 10);
    return isNaN(e)
        ? (function(t) {
              return "true" === t.contentEditable;
          })(t)
            ? 0
            : t.tabIndex
        : e;
}
function co(t, e) {
    return t.tabIndex === e.tabIndex
        ? t.documentOrder - e.documentOrder
        : t.tabIndex - e.tabIndex;
}
function ho(t) {
    return "INPUT" === t.tagName;
}
var uo = ro;
class po extends ct {
    constructor() {
        super(...arguments),
            (this.modal = !0),
            (this.hidden = !1),
            (this.trapFocus = !0),
            (this.trapFocusChanged = () => {
                this.shouldDialogTrapFocus()
                    ? (document.addEventListener("focusin", this.handleDocumentFocus),
                      this.shouldForceFocus(document.activeElement) &&
                          this.focusFirstElement())
                    : document.removeEventListener("focusin", this.handleDocumentFocus);
            }),
            (this.handleDocumentKeydown = t => {
                if (!t.defaultPrevented && !this.isDialogHidden())
                    switch (t.keyCode) {
                        case 27:
                            this.dismiss();
                            break;
                        case 9:
                            this.handleTabKeyDown(t);
                    }
            }),
            (this.handleDocumentFocus = t => {
                !t.defaultPrevented &&
                    this.shouldForceFocus(t.target) &&
                    (this.focusFirstElement(), t.preventDefault());
            }),
            (this.handleTabKeyDown = t => {
                if (!this.shouldDialogTrapFocus()) return;
                const e = this.tabbableElements.length;
                if (0 === e) return this.dialog.focus(), void t.preventDefault();
                t.shiftKey && t.target === this.tabbableElements[0]
                    ? (this.tabbableElements[e - 1].focus(), t.preventDefault())
                    : t.shiftKey ||
                      t.target !== this.tabbableElements[e - 1] ||
                      (this.tabbableElements[0].focus(), t.preventDefault());
            }),
            (this.focusFirstElement = () => {
                0 === this.tabbableElements.length
                    ? this.dialog.focus()
                    : this.tabbableElements[0].focus();
            }),
            (this.shouldForceFocus = t => !this.isDialogHidden() && !this.contains(t));
    }
    dismiss() {
        this.$emit("dismiss");
    }
    connectedCallback() {
        super.connectedCallback(),
            (this.tabbableElements = uo(this)),
            (this.observer = new MutationObserver(this.onChildListChange)),
            this.observer.observe(this, { childList: !0 }),
            document.addEventListener("keydown", this.handleDocumentKeydown),
            s.queueUpdate(this.trapFocusChanged);
    }
    disconnectedCallback() {
        super.disconnectedCallback(),
            this.observer.disconnect(),
            document.removeEventListener("keydown", this.handleDocumentKeydown),
            this.shouldDialogTrapFocus() &&
                document.removeEventListener("focusin", this.handleDocumentFocus);
    }
    onChildListChange(t, e) {
        t.length && (this.tabbableElements = uo(this));
    }
    isDialogHidden() {
        return "boolean" != typeof this.hidden;
    }
    shouldDialogTrapFocus() {
        return "boolean" == typeof this.trapFocus;
    }
}
Ht([tt({ mode: "boolean" })], po.prototype, "modal", void 0),
    Ht([tt({ mode: "boolean" })], po.prototype, "hidden", void 0),
    Ht(
        [tt({ attribute: "trap-focus", mode: "boolean" })],
        po.prototype,
        "trapFocus",
        void 0
    ),
    Ht([tt({ attribute: "aria-describedby" })], po.prototype, "ariaDescribedby", void 0),
    Ht([tt({ attribute: "aria-labelledby" })], po.prototype, "ariaLabelledby", void 0),
    Ht([tt({ attribute: "aria-label" })], po.prototype, "ariaLabel", void 0);
const vo = Q`<template role=${t => t.role}></template>`;
var fo, bo;
!(function(t) {
    (t.separator = "separator"), (t.presentation = "presentation");
})(fo || (fo = {}));
class go extends ct {
    constructor() {
        super(...arguments), (this.role = fo.separator);
    }
}
Ht([tt], go.prototype, "role", void 0),
    (function(t) {
        (t.next = "next"), (t.previous = "previous");
    })(bo || (bo = {}));
class mo extends ct {
    constructor() {
        super(...arguments), (this.hiddenFromAT = !0), (this.direction = bo.next);
    }
}
Ht([tt({ mode: "boolean" })], mo.prototype, "disabled", void 0),
    Ht(
        [tt({ attribute: "aria-hidden", mode: "fromView", converter: Y })],
        mo.prototype,
        "hiddenFromAT",
        void 0
    ),
    Ht([tt], mo.prototype, "direction", void 0);
const yo = Q`
    <template
        role="button"
        aria-disabled="${t => !!t.disabled || void 0}"
        tabindex="${t => (t.hiddenFromAT ? -1 : 0)}"
        class="${t => t.direction} ${t => (t.disabled ? "disabled" : "")}"
    >
        ${Ft(
            t => t.direction === bo.next,
            Q`
                <span part="next" class="next">
                    <slot name="next">
                        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M4.023 15.273L11.29 8 4.023.727l.704-.704L12.71 8l-7.984 7.977-.704-.704z"
                            />
                        </svg>
                    </slot>
                </span>
            `
        )}
        ${Ft(
            t => t.direction === bo.previous,
            Q`
                <span part="previous" class="previous">
                    <slot name="previous">
                        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M11.273 15.977L3.29 8 11.273.023l.704.704L4.71 8l7.266 7.273-.704.704z"
                            />
                        </svg>
                    </slot>
                </span>
            `
        )}
    </template>
`;
class xo extends ct {}
Ht([tt({ converter: Z })], xo.prototype, "value", void 0),
    Ht([tt({ converter: Z })], xo.prototype, "min", void 0),
    Ht([tt({ converter: Z })], xo.prototype, "max", void 0),
    Ht([tt({ mode: "boolean" })], xo.prototype, "paused", void 0);
const ko = Q`
    <template
        role="progressbar"
        aria-valuenow="${t => t.value}"
        aria-valuemin="${t => t.min}"
        aria-valuemax="${t => t.max}"
        class="${t => (t.paused ? "paused" : "")}"
    >
        ${Ft(
            t => t.value,
            Q`
                <div class="progress" part="progress" slot="determinate">
                    <div
                        class="determinate"
                        part="determinate"
                        style="width: ${t => t.value}%"
                    ></div>
                </div>
            `
        )}
        ${Ft(
            t => !t.value,
            Q`
                <div class="progress" part="progress" slot="indeterminate">
                    <slot class="indeterminate" name="indeterminate">
                        <span
                            class="indeterminate-indicator-1"
                            part="indeterminate-indicator-1"
                        ></span>
                        <span
                            class="indeterminate-indicator-2"
                            part="indeterminate-indicator-2"
                        ></span>
                    </slot>
                </div>
            `
        )}
    </template>
`,
    Co = Q`
    <template
        role="progressbar"
        aria-valuenow="${t => t.value}"
        aria-valuemin="${t => t.min}"
        aria-valuemax="${t => t.max}"
        class="${t => (t.paused ? "paused" : "")}"
    >
        ${Ft(
            t => t.value,
            Q`
                <svg
                    class="progress"
                    part="progress"
                    viewBox="0 0 16 16"
                    slot="determinate"
                >
                    <circle
                        class="background"
                        part="background"
                        cx="8px"
                        cy="8px"
                        r="7px"
                    ></circle>
                    <circle
                        class="determinate"
                        part="determinate"
                        style="stroke-dasharray: ${t => (44 * t.value) / 100}px 44px"
                        cx="8px"
                        cy="8px"
                        r="7px"
                    ></circle>
                </svg>
            `
        )}
        ${Ft(
            t => !t.value,
            Q`
                <slot name="indeterminate" slot="indeterminate">
                    <svg class="progress" part="progress" viewBox="0 0 16 16">
                        <circle
                            class="background"
                            part="background"
                            cx="8px"
                            cy="8px"
                            r="7px"
                        ></circle>
                        <circle
                            class="indeterminate-indicator-1"
                            part="indeterminate-indicator-1"
                            cx="8px"
                            cy="8px"
                            r="7px"
                        ></circle>
                    </svg>
                </slot>
            `
        )}
    </template>
`,
    wo = Q`
    <template
        role="radio"
        class="${t => (t.checked ? "checked" : "")} ${t =>
        t.readOnly ? "readonly" : ""}"
        aria-checked="${t => t.checked}"
        aria-required="${t => t.required}"
        aria-disabled="${t => t.disabled}"
        aria-readonly="${t => t.readOnly}"
        @keypress="${(t, e) => t.keypressHandler(e.event)}"
        @click="${(t, e) => t.clickHandler(e.event)}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                <div part="checked-indicator" class="checked-indicator"></div>
            </slot>
        </div>
        <label
            part="label"
            class="${t =>
                t.defaultSlottedNodes && t.defaultSlottedNodes.length
                    ? "label"
                    : "label label__hidden"}"
        >
            <slot ${Tt("defaultSlottedNodes")}></slot>
        </label>
    </template>
`;
class $o extends Me {
    constructor() {
        super(),
            (this.value = "on"),
            (this.defaultChecked = !!this.checkedAttribute),
            (this.checked = this.defaultChecked),
            (this.proxy = document.createElement("input")),
            (this.dirtyChecked = !1),
            (this.keypressHandler = t => {
                switch ((super.keypressHandler(t), t.keyCode)) {
                    case 32:
                        this.checked || this.readOnly || (this.checked = !0);
                }
            }),
            (this.clickHandler = t => {
                this.disabled || this.readOnly || (this.checked = !this.checked);
            }),
            this.proxy.setAttribute("type", "radio");
    }
    readOnlyChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.readOnly = this.readOnly);
    }
    nameChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.name = this.name);
    }
    valueChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.value = this.value);
    }
    checkedAttributeChanged() {
        this.defaultChecked = this.checkedAttribute;
    }
    defaultCheckedChanged() {
        this.dirtyChecked ||
            ((this.checked = this.defaultChecked), (this.dirtyChecked = !1));
    }
    checkedChanged() {
        this.dirtyChecked || (this.dirtyChecked = !0),
            this.proxy instanceof HTMLElement && (this.proxy.checked = this.checked),
            this.$emit("change"),
            (this.checkedAttribute = this.checked),
            this.updateForm();
    }
    connectedCallback() {
        var t;
        super.connectedCallback(),
            "radiogroup" !==
                (null === (t = this.parentElement) || void 0 === t
                    ? void 0
                    : t.getAttribute("role")) &&
                null === this.getAttribute("tabindex") &&
                (this.disabled || this.setAttribute("tabindex", "0")),
            this.updateForm();
    }
    updateForm() {
        const t = this.checked ? this.value : null;
        this.setFormValue(t, t);
    }
}
Ht([tt({ attribute: "readonly", mode: "boolean" })], $o.prototype, "readOnly", void 0),
    Ht([tt], $o.prototype, "name", void 0),
    Ht(
        [tt({ attribute: "checked", mode: "boolean" })],
        $o.prototype,
        "checkedAttribute",
        void 0
    ),
    Ht([x], $o.prototype, "defaultSlottedNodes", void 0),
    Ht([x], $o.prototype, "defaultChecked", void 0),
    Ht([x], $o.prototype, "checked", void 0);
const Fo = Q`
    <template
        role="radiogroup"
        aria-disabled="${t => t.disabled}"
        aria-readonly="${t => t.readOnly}"
    >
        <slot name="label"></slot>
        <div
            class="positioning-region ${t =>
                t.orientation === It.horizontal ? "horizontal" : "vertical"}"
            part="positioning-region"
        >
            <slot ${Tt("slottedRadioButtons")}> </slot>
        </div>
    </template>
`;
class Do extends ct {
    constructor() {
        super(),
            (this.orientation = It.horizontal),
            (this.isInsideToolbar = !1),
            (this.getFilteredRadioButtons = () => {
                const t = [];
                return (
                    void 0 !== this.slottedRadioButtons &&
                        this.slottedRadioButtons.forEach(e => {
                            e instanceof HTMLElement && t.push(e);
                        }),
                    t
                );
            }),
            (this.keypressHandler = t => {
                const e = t.target;
                e && e.setAttribute("tabindex", e.checked ? "0" : "-1");
            }),
            (this.radioChangeHandler = t => {
                const e = t.target;
                e.checked &&
                    (this.getFilteredRadioButtons().forEach(t => {
                        t !== e && ((t.checked = !1), t.setAttribute("tabindex", "-1"));
                    }),
                    (this.selectedRadio = e),
                    (this.value = e.value));
            }),
            (this.moveToRadioByIndex = (t, e) => {
                const o = t[e];
                this.isInsideToolbar ||
                    (o.setAttribute("tabindex", "0"),
                    o.readOnly
                        ? this.getFilteredRadioButtons().forEach(t => {
                              t !== o && t.setAttribute("tabindex", "-1");
                          })
                        : ((o.checked = !0), (this.selectedRadio = o))),
                    (this.focusedRadio = o),
                    o.focus();
            }),
            (this.moveRightOffGroup = () => {
                this.nextElementSibling.focus();
            }),
            (this.moveLeftOffGroup = () => {
                this.previousElementSibling.focus();
            }),
            (this.focusOutHandler = t => {
                const e = this.getFilteredRadioButtons(),
                    o = t.target,
                    i = null !== o ? e.indexOf(o) : 0,
                    r = this.focusedRadio ? e.indexOf(this.focusedRadio) : -1;
                ((0 === r && i === r) || (r === e.length - 1 && r === i)) &&
                    (this.selectedRadio
                        ? (this.selectedRadio.setAttribute("tabindex", "0"),
                          (this.focusedRadio = this.selectedRadio),
                          e.forEach(t => {
                              t !== this.selectedRadio &&
                                  t.setAttribute("tabindex", "-1");
                          }))
                        : ((this.focusedRadio = e[0]),
                          this.focusedRadio.setAttribute("tabindex", "0"),
                          e.forEach(t => {
                              t !== this.focusedRadio && t.setAttribute("tabindex", "-1");
                          })));
            }),
            (this.clickHandler = t => {
                const e = t.target;
                if (e) {
                    const t = this.getFilteredRadioButtons();
                    e.checked || 0 === t.indexOf(e)
                        ? (e.setAttribute("tabindex", "0"), (this.selectedRadio = e))
                        : (e.setAttribute("tabindex", "-1"), (this.selectedRadio = null)),
                        (this.focusedRadio = e);
                }
                t.preventDefault();
            }),
            (this.shouldMoveOffGroupToTheRight = (t, e, o) =>
                t === e.length && this.isInsideToolbar && 39 === o),
            (this.shouldMoveOffGroupToTheLeft = (t, e) =>
                (this.focusedRadio ? t.indexOf(this.focusedRadio) - 1 : 0) < 0 &&
                this.isInsideToolbar &&
                37 === e),
            (this.checkFocusedRadio = () => {
                null === this.focusedRadio ||
                    this.focusedRadio.readOnly ||
                    this.focusedRadio.checked ||
                    ((this.focusedRadio.checked = !0),
                    this.focusedRadio.setAttribute("tabindex", "0"),
                    this.focusedRadio.focus(),
                    (this.selectedRadio = this.focusedRadio));
            }),
            (this.keydownHandler = t => {
                const e = this.getFilteredRadioButtons();
                let o = 0;
                switch (t.keyCode) {
                    case 13:
                        this.checkFocusedRadio();
                        break;
                    case 39:
                    case 40:
                        if (
                            ((o = this.focusedRadio
                                ? e.indexOf(this.focusedRadio) + 1
                                : 1),
                            this.shouldMoveOffGroupToTheRight(o, e, t.keyCode))
                        )
                            return void this.moveRightOffGroup();
                        for (o === e.length && (o = 0); o < e.length && e.length > 1; ) {
                            if (!e[o].disabled) {
                                this.moveToRadioByIndex(e, o);
                                break;
                            }
                            if (this.focusedRadio && o === e.indexOf(this.focusedRadio))
                                break;
                            if (o + 1 >= e.length) {
                                if (this.isInsideToolbar) break;
                                o = 0;
                            } else o += 1;
                        }
                        break;
                    case 37:
                    case 38:
                        if (this.shouldMoveOffGroupToTheLeft(e, t.keyCode))
                            return void this.moveLeftOffGroup();
                        for (
                            o = this.focusedRadio ? e.indexOf(this.focusedRadio) - 1 : 0,
                                o = o < 0 ? e.length - 1 : o;
                            o >= 0 && e.length > 1;

                        ) {
                            if (!e[o].disabled) {
                                this.moveToRadioByIndex(e, o);
                                break;
                            }
                            if (this.focusedRadio && o === e.indexOf(this.focusedRadio))
                                break;
                            o - 1 < 0 ? (o = e.length - 1) : (o -= 1);
                        }
                }
            }),
            this.addEventListener("keydown", this.keydownHandler),
            this.addEventListener("change", this.radioChangeHandler),
            this.addEventListener("keypress", this.keypressHandler),
            this.addEventListener("click", this.clickHandler),
            this.addEventListener("focusout", this.focusOutHandler);
    }
    readOnlyChanged() {
        const t = this.getFilteredRadioButtons();
        void 0 !== t &&
            t.forEach(t => {
                this.readOnly ? (t.readOnly = !0) : (t.readOnly = !1);
            });
    }
    disabledChanged() {
        const t = this.getFilteredRadioButtons();
        void 0 !== t &&
            t.forEach(t => {
                this.disabled ? (t.disabled = !0) : (t.disabled = !1);
            });
    }
    nameChanged() {
        this.getFilteredRadioButtons().forEach(t => {
            t.setAttribute("name", this.name);
        });
    }
    connectedCallback() {
        var t;
        super.connectedCallback();
        const e = this.getFilteredRadioButtons();
        e.forEach(t => {
            void 0 !== this.name && t.setAttribute("name", this.name),
                this.disabled && (t.disabled = !0),
                this.readOnly && (t.readOnly = !0),
                this.value && this.value === t.getAttribute("value")
                    ? ((this.selectedRadio = t),
                      (this.focusedRadio = t),
                      (t.checked = !0),
                      t.setAttribute("tabindex", "0"))
                    : t.setAttribute("tabindex", "-1");
        }),
            void 0 === this.value &&
                e.length > 0 &&
                (e[0].setAttribute("tabindex", "0"), (this.focusedRadio = e[0])),
            (this.parentToolbar =
                null === (t = this.parentElement) || void 0 === t
                    ? void 0
                    : t.closest('[role="toolbar"]')),
            (this.isInsideToolbar =
                void 0 !== this.parentToolbar && null !== this.parentToolbar);
    }
}
Ht([tt({ attribute: "readonly", mode: "boolean" })], Do.prototype, "readOnly", void 0),
    Ht(
        [tt({ attribute: "disabled", mode: "boolean" })],
        Do.prototype,
        "disabled",
        void 0
    ),
    Ht([tt], Do.prototype, "name", void 0),
    Ht([tt], Do.prototype, "value", void 0),
    Ht([tt], Do.prototype, "orientation", void 0),
    Ht([x], Do.prototype, "slottedRadioButtons", void 0);
const To = Q`
    <template
        role="slider"
        class="${t => (t.readOnly ? "readonly" : "")} 
        ${t => t.orientation || It.horizontal}"
        tabindex="${t => (t.disabled ? null : 0)}"
        aria-valuenow="${t => t.value}"
        aria-valuemin="${t => t.min}"
        aria-valuemax="${t => t.max}"
        ?aria-disabled="${t => t.disabled}"
        ?aria-readonly="${t => t.readOnly}"
        aria-orientation="${t => t.orientation}"
        class="${t => t.orientation}"
    >
        <div part="positioning-region" class="positioning-region">
            <div ${Ct("track")} part="track-container" class="track">
                <slot name="track"></slot>
            </div>
            <div></div>
            <slot></slot>
            <div
                ${Ct("thumb")}
                part="thumb-container"
                class="thumb-container"
                style=${t => t.position}
            >
                <slot name="thumb"><div class="thumb-cursor"></div></slot>
            </div>
        </div>
    </template>
`;
function Po(t, e, o, i) {
    let r = ((n = 0), (s = 1), (a = (t - e) / (o - e)), Math.min(Math.max(a, n), s));
    var n, s, a;
    return i === Le.rtl && (r = 1 - r), r;
}
var Eo;
!(function(t) {
    t.singleValue = "single-value";
})(Eo || (Eo = {}));
class Ao extends Me {
    constructor() {
        super(),
            (this.direction = Le.ltr),
            (this.isDragging = !1),
            (this.trackWidth = 0),
            (this.trackMinWidth = 0),
            (this.trackHeight = 0),
            (this.trackMinHeight = 0),
            (this.min = 0),
            (this.max = 10),
            (this.step = 1),
            (this.orientation = It.horizontal),
            (this.mode = Eo.singleValue),
            (this.proxy = document.createElement("input")),
            (this.increment = () => {
                const t =
                        this.direction !== Le.rtl && this.orientation !== It.vertical
                            ? Number(this.value) + Number(this.step)
                            : Number(this.value) - Number(this.step),
                    e = this.convertToConstrainedValue(t),
                    o = e < Number(this.max) ? "" + e : "" + this.max;
                (this.value = o), this.updateForm();
            }),
            (this.decrement = () => {
                const t =
                        this.direction !== Le.rtl && this.orientation !== It.vertical
                            ? Number(this.value) - Number(this.step)
                            : Number(this.value) + Number(this.step),
                    e = this.convertToConstrainedValue(t),
                    o = e > Number(this.min) ? "" + e : "" + this.min;
                (this.value = o), this.updateForm();
            }),
            (this.keypressHandler = t => {
                if ((super.keypressHandler(t), 36 === t.keyCode))
                    this.value = "" + this.min;
                else if (35 === t.keyCode) this.value = "" + this.max;
                else if (!t.shiftKey)
                    switch (t.keyCode) {
                        case 39:
                        case 38:
                            this.increment();
                            break;
                        case 37:
                        case 40:
                            this.decrement();
                    }
            }),
            (this.setThumbPositionForOrientation = t => {
                const e =
                    100 *
                    (1 - Po(Number(this.value), Number(this.min), Number(this.max), t));
                this.orientation === It.horizontal
                    ? (this.position = this.isDragging
                          ? `right: ${e}%; transition: all 0.1s ease;`
                          : `right: ${e}%; transition: all 0.2s ease;`)
                    : (this.position = this.isDragging
                          ? `bottom: ${e}%; transition: all 0.1s ease;`
                          : `bottom: ${e}%; transition: all 0.2s ease;`);
            }),
            (this.getDirection = () => {
                const t = this.parentElement.closest("[dir]");
                return (
                    t && "rtl" === t.dir && this.setThumbPositionForOrientation(Le.rtl),
                    null !== t && "rtl" === t.dir ? Le.rtl : Le.ltr
                );
            }),
            (this.setupTrackConstraints = () => {
                (this.trackWidth = this.track.clientWidth),
                    (this.trackMinWidth = this.track.clientLeft),
                    (this.trackHeight = this.track.clientHeight),
                    (this.trackMinHeight = this.track.getBoundingClientRect().top);
            }),
            (this.setupListeners = () => {
                this.addEventListener("keydown", this.keypressHandler),
                    this.addEventListener("mousedown", this.clickHandler),
                    this.thumb.addEventListener("mousedown", this.handleThumbMouseDown);
            }),
            (this.setupDefaultValue = () => {
                "" === this.value &&
                    ((this.value =
                        "" + this.convertToConstrainedValue((this.max + this.min) / 2)),
                    this.updateForm());
            }),
            (this.updateForm = () => {
                this.setFormValue(this.value, this.value);
            }),
            (this.handleThumbMouseDown = t => {
                this.readOnly ||
                    this.disabled ||
                    t.defaultPrevented ||
                    (t.preventDefault(),
                    t.target.focus(),
                    window.addEventListener("mouseup", this.handleWindowMouseUp),
                    window.addEventListener("mousemove", this.handleMouseMove),
                    (this.isDragging = !0));
            }),
            (this.handleMouseMove = t => {
                if (this.readOnly || this.disabled || t.defaultPrevented) return;
                const e =
                    this.orientation === It.horizontal
                        ? t.pageX - this.getBoundingClientRect().left
                        : t.pageY;
                (this.value = "" + this.calculateNewValue(e)), this.updateForm();
            }),
            (this.calculateNewValue = t => {
                const e = Po(
                        t,
                        this.orientation === It.horizontal
                            ? this.trackMinWidth
                            : this.trackMinHeight,
                        this.orientation === It.horizontal
                            ? this.trackWidth
                            : this.trackHeight,
                        this.direction
                    ),
                    o = (this.max - this.min) * e + this.min;
                return this.convertToConstrainedValue(o);
            }),
            (this.handleWindowMouseUp = t => {
                this.stopDragging();
            }),
            (this.stopDragging = () => {
                (this.isDragging = !1),
                    window.removeEventListener("mouseup", this.handleWindowMouseUp),
                    window.removeEventListener("mousemove", this.handleMouseMove);
            }),
            (this.clickHandler = t => {
                if (!this.disabled && !this.readOnly) {
                    (this.trackWidth = this.track.clientWidth),
                        0 === this.trackWidth && (this.trackWidth = 1),
                        t.preventDefault(),
                        t.target.focus(),
                        window.addEventListener("mouseup", this.handleWindowMouseUp),
                        window.addEventListener("mousemove", this.handleMouseMove);
                    const e =
                        this.orientation === It.horizontal
                            ? t.pageX - this.getBoundingClientRect().left
                            : t.pageY;
                    (this.value = "" + this.calculateNewValue(e)), this.updateForm();
                }
            }),
            (this.convertToConstrainedValue = t => {
                let e = t - this.min;
                const o = e % Number(this.step);
                return (
                    (e = o >= Number(this.step) / 2 ? e - o + Number(this.step) : e - o),
                    e + this.min
                );
            }),
            this.proxy.setAttribute("type", "range");
    }
    readOnlyChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.readOnly = this.readOnly);
    }
    valueChanged() {
        this.proxy instanceof HTMLElement && this.updateForm(),
            this.$fastController.isConnected &&
                this.setThumbPositionForOrientation(this.direction),
            this.$emit("change");
    }
    minChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.min = "" + this.min);
    }
    maxChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.max = "" + this.max);
    }
    stepChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.step = "" + this.step);
    }
    orientationChanged() {
        this.$fastController.isConnected &&
            this.setThumbPositionForOrientation(this.direction);
    }
    connectedCallback() {
        super.connectedCallback(),
            (this.direction = this.getDirection()),
            this.updateForm(),
            this.setupTrackConstraints(),
            this.setupListeners(),
            this.setupDefaultValue();
    }
    disconnectedCallback() {
        this.removeEventListener("keydown", this.keypressHandler),
            this.removeEventListener("mousedown", this.clickHandler),
            this.thumb.removeEventListener("mousedown", this.handleThumbMouseDown);
    }
}
Ht([tt({ attribute: "readonly", mode: "boolean" })], Ao.prototype, "readOnly", void 0),
    Ht([x], Ao.prototype, "direction", void 0),
    Ht([x], Ao.prototype, "isDragging", void 0),
    Ht([x], Ao.prototype, "position", void 0),
    Ht([x], Ao.prototype, "trackWidth", void 0),
    Ht([x], Ao.prototype, "trackMinWidth", void 0),
    Ht([x], Ao.prototype, "trackHeight", void 0),
    Ht([x], Ao.prototype, "trackMinHeight", void 0),
    Ht([tt({ converter: Z })], Ao.prototype, "min", void 0),
    Ht([tt({ converter: Z })], Ao.prototype, "max", void 0),
    Ht([tt({ converter: Z })], Ao.prototype, "step", void 0),
    Ht([tt], Ao.prototype, "orientation", void 0),
    Ht([tt], Ao.prototype, "mode", void 0);
const So = Q`
    <template
        aria-disabled="${t => t.disabled}"
        class="${t => t.sliderOrientation || It.horizontal} 
            ${t => (t.disabled ? "disabled" : "")}"
    >
        <div ${Ct("root")} part="root" class="root" style=${t => t.positionStyle}>
            <div class="container">
                ${Ft(t => !t.hideMark, Q` <div class="mark"></div> `)}
                <div class="label">
                    <slot> </slot>
                </div>
            </div>
        </div>
    </template>
`,
    Ho = { min: 0, max: 0, direction: Le.ltr, orientation: It.horizontal, disabled: !1 };
class Oo extends ct {
    constructor() {
        super(...arguments),
            (this.hideMark = !1),
            (this.sliderDirection = Le.ltr),
            (this.getSliderConfiguration = () => {
                if (this.isSliderConfig(this.parentNode)) {
                    const t = this.parentNode,
                        { min: e, max: o, direction: i, orientation: r, disabled: n } = t;
                    void 0 !== n && (this.disabled = n),
                        (this.sliderDirection = i || Le.ltr),
                        (this.sliderOrientation = r || It.horizontal),
                        (this.sliderMaxPosition = o),
                        (this.sliderMinPosition = e);
                } else
                    (this.sliderDirection = Ho.direction || Le.ltr),
                        (this.sliderOrientation = Ho.orientation || It.horizontal),
                        (this.sliderMaxPosition = Ho.max),
                        (this.sliderMinPosition = Ho.min);
            }),
            (this.positionAsStyle = () => {
                const t = this.sliderDirection ? this.sliderDirection : Le.ltr,
                    e = Po(
                        Number(this.position),
                        Number(this.sliderMinPosition),
                        Number(this.sliderMaxPosition)
                    );
                let o = Math.round(100 * (1 - e)),
                    i = Math.round(100 * e);
                return (
                    i === Number.NaN && o === Number.NaN && ((o = 50), (i = 50)),
                    this.sliderOrientation === It.horizontal
                        ? t === Le.rtl
                            ? `right: ${i}%; left: ${o}%;`
                            : `left: ${i}%; right: ${o}%;`
                        : `top: ${i}%; bottom: ${o}%;`
                );
            });
    }
    positionChanged() {
        this.positionStyle = this.positionAsStyle();
    }
    connectedCallback() {
        super.connectedCallback(),
            this.getSliderConfiguration(),
            (this.positionStyle = this.positionAsStyle()),
            (this.notifier = g.getNotifier(this.parentNode)),
            this.notifier.subscribe(this, "orientation"),
            this.notifier.subscribe(this, "direction"),
            this.notifier.subscribe(this, "max"),
            this.notifier.subscribe(this, "min");
    }
    disconnectedCallback() {
        super.disconnectedCallback(),
            this.notifier.unsubscribe(this, "orientation"),
            this.notifier.unsubscribe(this, "direction"),
            this.notifier.unsubscribe(this, "max"),
            this.notifier.unsubscribe(this, "min");
    }
    handleChange(t, e) {
        switch (e) {
            case "direction":
                this.sliderDirection = t.direction;
                break;
            case "orientation":
                this.sliderOrientation = t.orientation;
                break;
            case "max":
                this.sliderMinPosition = t.max;
                break;
            case "min":
                this.sliderMinPosition = t.min;
        }
        this.positionStyle = this.positionAsStyle();
    }
    isSliderConfig(t) {
        return void 0 !== t.max && void 0 !== t.min;
    }
}
Ht([x], Oo.prototype, "positionStyle", void 0),
    Ht([tt], Oo.prototype, "position", void 0),
    Ht(
        [tt({ attribute: "hide-mark", mode: "boolean" })],
        Oo.prototype,
        "hideMark",
        void 0
    ),
    Ht(
        [tt({ attribute: "disabled", mode: "boolean" })],
        Oo.prototype,
        "disabled",
        void 0
    ),
    Ht([x], Oo.prototype, "sliderOrientation", void 0),
    Ht([x], Oo.prototype, "sliderMinPosition", void 0),
    Ht([x], Oo.prototype, "sliderMaxPosition", void 0),
    Ht([x], Oo.prototype, "sliderDirection", void 0);
const Lo = Q`
    <template
        role="switch"
        aria-checked="${t => t.checked}"
        aria-required="${t => t.required}"
        aria-disabled="${t => t.disabled}"
        aria-readonly="${t => t.readOnly}"
        tabindex="${t => (t.disabled ? null : 0)}"
        @keypress="${(t, e) => t.keypressHandler(e.event)}"
        @click="${(t, e) => t.clickHandler(e.event)}"
        class="${t => (t.checked ? "checked" : "")}"
    >
        <label
            part="label"
            class="${t =>
                t.defaultSlottedNodes && t.defaultSlottedNodes.length
                    ? "label"
                    : "label label__hidden"}"
        >
            <slot ${Tt("defaultSlottedNodes")}></slot>
        </label>
        <div part="switch" class="switch">
            <span class="checked-indicator" part="checked-indicator"></span>
        </div>
        <span class="status-message" part="status-message">
            <span class="checked-message" part="checked-message">
                <slot name="checked-message"></slot>
            </span>
            <span class="unchecked-message" part="unchecked-message">
                <slot name="unchecked-message"></slot>
            </span>
        </span>
    </template>
`;
class Bo extends Me {
    constructor() {
        super(),
            (this.value = "on"),
            (this.defaultChecked = !!this.checkedAttribute),
            (this.checked = this.defaultChecked),
            (this.proxy = document.createElement("input")),
            (this.dirtyChecked = !1),
            (this.keypressHandler = t => {
                switch ((super.keypressHandler(t), t.keyCode)) {
                    case 32:
                        this.checked = !this.checked;
                }
            }),
            (this.clickHandler = t => {
                this.disabled || this.readOnly || (this.checked = !this.checked);
            }),
            this.proxy.setAttribute("type", "checkbox");
    }
    readOnlyChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.readOnly = this.readOnly),
            this.readOnly
                ? this.classList.add("readonly")
                : this.classList.remove("readonly");
    }
    valueChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.value = this.value);
    }
    checkedAttributeChanged() {
        this.defaultChecked = this.checkedAttribute;
    }
    defaultCheckedChanged() {
        this.dirtyChecked ||
            ((this.checked = this.defaultChecked), (this.dirtyChecked = !1));
    }
    checkedChanged() {
        this.dirtyChecked || (this.dirtyChecked = !0),
            this.updateForm(),
            this.proxy instanceof HTMLElement && (this.proxy.checked = this.checked),
            this.$emit("change"),
            this.checked
                ? this.classList.add("checked")
                : this.classList.remove("checked");
    }
    connectedCallback() {
        super.connectedCallback(), this.updateForm();
    }
    updateForm() {
        const t = this.checked ? this.value : null;
        this.setFormValue(t, t);
    }
}
Ht([tt({ attribute: "readonly", mode: "boolean" })], Bo.prototype, "readOnly", void 0),
    Ht([tt], Bo.prototype, "value", void 0),
    Ht(
        [tt({ attribute: "checked", mode: "boolean" })],
        Bo.prototype,
        "checkedAttribute",
        void 0
    ),
    Ht([x], Bo.prototype, "defaultSlottedNodes", void 0),
    Ht([x], Bo.prototype, "defaultChecked", void 0),
    Ht([x], Bo.prototype, "checked", void 0);
const Ro = Q`
    <template role="tabs" class="${t => t.orientation}">
        ${At}
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${Tt("tabs")}></slot>

            ${Ft(
                t => t.activeindicator,
                Q`
                    <div
                        ${Ct("activeIndicatorRef")}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `
            )}
        </div>
        ${Et}
        <div class="tabpanel">
            <slot name="tabpanel" part="tabpanel" ${Tt("tabpanels")}></slot>
        </div>
    </template>
`;
var Mo;
!(function(t) {
    (t.vertical = "vertical"), (t.horizontal = "horizontal");
})(Mo || (Mo = {}));
class Io extends ct {
    constructor() {
        super(),
            (this.orientation = Mo.horizontal),
            (this.activeindicator = !0),
            (this.prevActiveTabIndex = 0),
            (this.activeTabIndex = 0),
            (this.ticking = !1),
            (this.change = () => {
                this.$emit("change", this.activetab);
            }),
            (this.setTabs = () => {
                (this.tabIds = this.getTabIds()),
                    (this.tabpanelIds = this.getTabPanelIds()),
                    (this.activeTabIndex = this.getActiveIndex()),
                    this.tabs.forEach((t, e) => {
                        if ("tab" === t.slot) {
                            const o = this.tabIds[e],
                                i = this.tabpanelIds[e];
                            t.setAttribute(
                                "id",
                                "string" != typeof o ? "tab-" + (e + 1) : o
                            ),
                                t.setAttribute(
                                    "aria-selected",
                                    this.activeTabIndex === e ? "true" : "false"
                                ),
                                t.setAttribute(
                                    "aria-controls",
                                    "string" != typeof i ? "panel-" + (e + 1) : i
                                ),
                                t.setAttribute(
                                    "style",
                                    this.isHorizontal()
                                        ? `grid-column: ${e + 1};`
                                        : `grid-row: ${e + 1};`
                                ),
                                t.addEventListener("click", this.handleTabClick),
                                t.addEventListener("keydown", this.handleTabKeyDown),
                                t.setAttribute(
                                    "tabindex",
                                    this.activeTabIndex === e ? "0" : "-1"
                                ),
                                this.activeTabIndex === e && (this.activetab = t),
                                this.isHorizontal()
                                    ? t.classList.remove("vertical")
                                    : t.classList.add("vertical");
                        }
                    });
            }),
            (this.setTabPanels = () => {
                (this.tabIds = this.getTabIds()),
                    (this.tabpanelIds = this.getTabPanelIds()),
                    this.tabpanels.forEach((t, e) => {
                        const o = this.tabIds[e],
                            i = this.tabpanelIds[e];
                        t.setAttribute(
                            "id",
                            "string" != typeof i ? "panel-" + (e + 1) : i
                        ),
                            t.setAttribute(
                                "aria-labeledby",
                                "string" != typeof o ? "tab-" + (e + 1) : o
                            ),
                            this.activeTabIndex !== e
                                ? t.setAttribute("hidden", "")
                                : t.removeAttribute("hidden");
                    });
            }),
            (this.handleTabClick = t => {
                const e = t.target;
                (this.prevActiveTabIndex = this.activeTabIndex),
                    (this.activeTabIndex = Array.from(this.tabs).indexOf(e)),
                    1 === e.nodeType && this.setComponent();
            }),
            (this.handleTabKeyDown = t => {
                const e = t.keyCode;
                if (this.isHorizontal())
                    switch (e) {
                        case 37:
                            t.preventDefault(), this.adjust(-1);
                            break;
                        case 39:
                            t.preventDefault(), this.adjust(1);
                    }
                else
                    switch (e) {
                        case 38:
                            t.preventDefault(), this.adjust(-1);
                            break;
                        case 40:
                            t.preventDefault(), this.adjust(1);
                    }
                switch (e) {
                    case 36:
                        t.preventDefault(),
                            (this.activeTabIndex = 0),
                            this.setComponent();
                        break;
                    case 35:
                        t.preventDefault(),
                            (this.activeTabIndex = this.tabs.length - 1),
                            this.setComponent();
                }
            }),
            this.$fastController.isConnected &&
                ((this.tabIds = this.getTabIds()),
                (this.tabpanelIds = this.getTabPanelIds()),
                (this.activeTabIndex = this.getActiveIndex()));
    }
    tabsChanged() {
        this.$fastController.isConnected &&
            this.tabs.length <= this.tabpanels.length &&
            (this.setTabs(), this.setTabPanels(), this.handleActiveIndicatorPosition());
    }
    tabpanelsChanged() {
        this.$fastController.isConnected &&
            this.tabpanels.length <= this.tabs.length &&
            (this.setTabs(), this.setTabPanels(), this.handleActiveIndicatorPosition());
    }
    getActiveIndex() {
        return void 0 !== this.activeid
            ? -1 === this.tabIds.indexOf(this.activeid)
                ? 0
                : this.tabIds.indexOf(this.activeid)
            : 0;
    }
    getTabIds() {
        return this.tabs.map(t => t.getAttribute("id"));
    }
    getTabPanelIds() {
        return this.tabpanels.map(t => t.getAttribute("id"));
    }
    setComponent() {
        (this.activeid = this.tabIds[this.activeTabIndex]),
            this.change(),
            this.setTabs(),
            this.handleActiveIndicatorPosition(),
            this.setTabPanels(),
            this.focusTab(),
            this.change();
    }
    isHorizontal() {
        return this.orientation === Mo.horizontal;
    }
    handleActiveIndicatorPosition() {
        this.activeindicator &&
            (this.ticking
                ? ((this.activeIndicatorRef.style.transform = "translateX(0px)"),
                  this.activeIndicatorRef.classList.remove("activeIndicatorTransition"),
                  this.isHorizontal()
                      ? (this.activeIndicatorRef.style.gridColumn =
                            "" + (this.activeTabIndex + 1))
                      : (this.activeIndicatorRef.style.gridRow =
                            "" + (this.activeTabIndex + 1)),
                  (this.ticking = !1))
                : ((this.ticking = !0), this.animateActiveIndicator()));
    }
    animateActiveIndicator() {
        const t = this.isHorizontal() ? "gridColumn" : "gridRow",
            e = this.isHorizontal() ? "translateX" : "translateY",
            o = this.isHorizontal() ? "offsetLeft" : "offsetTop",
            i = this.activeIndicatorRef[o];
        this.activeIndicatorRef.style[t] = "" + (this.activeTabIndex + 1);
        const r = this.activeIndicatorRef[o];
        this.activeIndicatorRef.style[t] = "" + (this.prevActiveTabIndex + 1);
        const n = r - i;
        (this.activeIndicatorRef.style.transform = `${e}(${n}px)`),
            this.activeIndicatorRef.classList.add("activeIndicatorTransition"),
            this.activeIndicatorRef.addEventListener("transitionend", () => {
                (this.ticking = !1),
                    (this.activeIndicatorRef.style[t] = "" + (this.activeTabIndex + 1)),
                    (this.activeIndicatorRef.style.transform = e + "(0px)"),
                    this.activeIndicatorRef.classList.remove("activeIndicatorTransition");
            });
    }
    adjust(t) {
        var e, o, i;
        (this.prevActiveTabIndex = this.activeTabIndex),
            (this.activeTabIndex =
                ((e = 0),
                (o = this.tabs.length - 1),
                (i = this.activeTabIndex + t) < e ? o : i > o ? e : i)),
            this.setComponent();
    }
    focusTab() {
        this.tabs[this.activeTabIndex].focus();
    }
}
Ht([tt], Io.prototype, "orientation", void 0),
    Ht([tt], Io.prototype, "activeid", void 0),
    Ht([x], Io.prototype, "tabs", void 0),
    Ht([x], Io.prototype, "tabpanels", void 0),
    Ht([tt({ mode: "boolean" })], Io.prototype, "activeindicator", void 0),
    Ht([x], Io.prototype, "activeIndicatorRef", void 0),
    Ot(Io, Pt);
const No = Q`
    <template slot="tab" role="tab">
        <slot></slot>
    </template>
`;
class zo extends ct {}
const jo = Q`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`;
class _o extends ct {}
var Vo, Go;
!(function(t) {
    (t.filled = "filled"), (t.outline = "outline");
})(Vo || (Vo = {})),
    (function(t) {
        (t.none = "none"),
            (t.both = "both"),
            (t.horizontal = "horizontal"),
            (t.vertical = "vertical");
    })(Go || (Go = {}));
class qo extends Me {
    constructor() {
        super(...arguments),
            (this.appearance = Vo.outline),
            (this.resize = Go.none),
            (this.cols = 20),
            (this.proxy = document.createElement("textarea")),
            (this.handleTextInput = () => {
                this.$emit("change", this.textarea.value);
            });
    }
    readOnlyChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.readOnly = this.readOnly);
    }
    autofocusChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.autofocus = this.autofocus);
    }
    listChanged() {
        this.proxy instanceof HTMLElement && this.proxy.setAttribute("list", this.list);
    }
    maxlengthChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.maxLength = this.maxlength);
    }
    minlengthChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.minLength = this.minlength);
    }
    spellcheckChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.spellcheck = this.spellcheck);
    }
    valueChanged() {
        this.textarea &&
            this.value !== this.textarea.value &&
            (this.textarea.value = this.value),
            this.proxy instanceof HTMLElement && (this.proxy.value = this.value);
    }
    connectedCallback() {
        super.connectedCallback(),
            this.value &&
                ((this.textarea.value = this.value),
                this.setFormValue(this.value, this.value));
    }
}
Ht([tt], qo.prototype, "appearance", void 0),
    Ht([tt({ mode: "boolean" })], qo.prototype, "readOnly", void 0),
    Ht([tt], qo.prototype, "resize", void 0),
    Ht([tt({ mode: "boolean" })], qo.prototype, "autofocus", void 0),
    Ht([tt({ converter: Z, mode: "fromView" })], qo.prototype, "cols", void 0),
    Ht([tt({ attribute: "form" })], qo.prototype, "formId", void 0),
    Ht([tt], qo.prototype, "list", void 0),
    Ht([tt({ converter: Z })], qo.prototype, "maxlength", void 0),
    Ht([tt({ converter: Z })], qo.prototype, "minlength", void 0),
    Ht([tt], qo.prototype, "name", void 0),
    Ht([tt], qo.prototype, "placeholder", void 0),
    Ht([tt({ converter: Z, mode: "fromView" })], qo.prototype, "rows", void 0),
    Ht([tt({ mode: "boolean" })], qo.prototype, "spellcheck", void 0),
    Ht([x], qo.prototype, "defaultSlottedNodes", void 0);
const Wo = Q`
    <template
        class="
            ${t => t.appearance}
            ${t => (t.readOnly ? "readonly" : "")}
            ${t => (t.resize !== Go.none ? "resize-" + t.resize : "")}"
    >
        <label part="label" for="control" class="${t =>
            t.defaultSlottedNodes && t.defaultSlottedNodes.length
                ? "label"
                : "label label__hidden"}">
            <slot ${Tt("defaultSlottedNodes")}></slot>
        </label>
        <textarea
            part="control"
            class="control"
            id="control"
            ?autofocus="${t => t.autofocus}"
            cols="${t => t.cols}"
            ?disabled="${t => t.disabled}"
            form="${t => t.form}"
            list="${t => t.list}"
            maxlength="${t => t.maxlength}"
            minlength="${t => t.minlength}"
            name="${t => t.name}"
            placeholder="${t => t.placeholder}"
            ?readonly="${t => t.readOnly}"
            ?required="${t => t.required}"
            rows="${t => t.rows}"
            ?spellcheck="${t => t.spellcheck}"
            value="${t => t.value}"
            @input=${t => t.handleTextInput()}"
            ${Ct("textarea")}
        ></textarea>
    </template>
`,
    Uo = Q`
    <template
        role="textbox"
        appearance="${t => t.appearance}"
        aria-required="${t => t.required}"
        aria-disabled="${t => t.disabled}"
        aria-readonly="${t => t.readOnly}"
        tabindex="${t => (t.disabled ? null : 0)}"
        class="
            ${t => t.appearance}
            ${t => (t.readOnly ? "readonly" : "")}
        "
    >
        <label
            part="label"
            for="control"
            class="${t =>
                t.defaultSlottedNodes && t.defaultSlottedNodes.length
                    ? "label"
                    : "label label__hidden"}"
        >
            <slot ${Tt("defaultSlottedNodes")}></slot>
        </label>
        <div class="root" part="root">
            ${At}
            <input
                class="control"
                part="control"
                id="control"
                @input=${t => t.handleTextInput()}
                placeholder=${t => t.placeholder}
                ?required=${t => t.required}
                ?disabled=${t => t.disabled}
                ?readonly=${t => t.readOnly}
                value=${t => t.value}
                ${Ct("control")}
            />
            ${Et}
        </div>
    </template>
`;
var Ko, Xo;
!(function(t) {
    (t.filled = "filled"), (t.outline = "outline");
})(Ko || (Ko = {})),
    (function(t) {
        (t.email = "email"),
            (t.password = "password"),
            (t.tel = "tel"),
            (t.text = "text"),
            (t.url = "url");
    })(Xo || (Xo = {}));
class Qo extends Me {
    constructor() {
        super(),
            (this.appearance = Ko.outline),
            (this.type = Xo.text),
            (this.proxy = document.createElement("input")),
            this.proxy.setAttribute("type", this.type);
    }
    readOnlyChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.readOnly = this.readOnly);
    }
    autofocusChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.autofocus = this.autofocus);
    }
    placeholderChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.placeholder = this.placeholder);
    }
    typeChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.type = this.type);
    }
    listChanged() {
        this.proxy instanceof HTMLElement && this.proxy.setAttribute("list", this.list);
    }
    maxlengthChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.maxLength = this.maxlength);
    }
    minlengthChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.minLength = this.minlength);
    }
    patternChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.pattern = this.pattern);
    }
    sizeChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.size = this.size);
    }
    spellcheckChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.spellcheck = this.spellcheck);
    }
    valueChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.value = this.value),
            this.$emit("change", this.value);
    }
    connectedCallback() {
        super.connectedCallback(),
            this.autofocus && this.focus(),
            this.setFormValue(this.value, this.value);
    }
    handleTextInput() {
        this.control && this.control.value && (this.value = this.control.value);
    }
}
function Yo(t) {
    return (...e) => o => {
        const i = e[0];
        let r = "function" == typeof i ? i(o) : i;
        for (let i = 1; i < e.length; i++) {
            const n = e[i];
            r = t(r, "function" == typeof n ? n(o) : n);
        }
        return r;
    };
}
Ht([tt], Qo.prototype, "appearance", void 0),
    Ht(
        [tt({ attribute: "readonly", mode: "boolean" })],
        Qo.prototype,
        "readOnly",
        void 0
    ),
    Ht([tt({ mode: "boolean" })], Qo.prototype, "autofocus", void 0),
    Ht([tt], Qo.prototype, "placeholder", void 0),
    Ht([tt], Qo.prototype, "type", void 0),
    Ht([tt], Qo.prototype, "list", void 0),
    Ht([tt({ converter: Z })], Qo.prototype, "maxlength", void 0),
    Ht([tt({ converter: Z })], Qo.prototype, "minlength", void 0),
    Ht([tt], Qo.prototype, "pattern", void 0),
    Ht([tt({ converter: Z })], Qo.prototype, "size", void 0),
    Ht([tt({ mode: "boolean" })], Qo.prototype, "spellcheck", void 0),
    Ht([x], Qo.prototype, "defaultSlottedNodes", void 0),
    Ot(Qo, Pt);
const Zo = Yo((t, e) => t + e),
    Jo = Yo((t, e) => t - e),
    ti = Yo((t, e) => t * e);
function ei(...t) {
    return Zo.apply(this, t);
}
function oi(...t) {
    return Jo.apply(this, t);
}
function ii(...t) {
    return ti.apply(this, t);
}
function ri(t, e, o) {
    return isNaN(t) || t <= e ? e : t >= o ? o : t;
}
function ni(t, e, o) {
    return isNaN(t) || t <= e ? 0 : t >= o ? 1 : t / (o - e);
}
function si(t, e, o) {
    return isNaN(t) ? e : e + t * (o - e);
}
function ai(t, e) {
    const o = Math.pow(10, e);
    return Math.round(t * o) / o;
}
class li {
    static fromObject(t) {
        return !t || isNaN(t.r) || isNaN(t.g) || isNaN(t.b)
            ? null
            : new li(t.r, t.g, t.b, t.a);
    }
    constructor(t, e, o, i) {
        (this.r = t),
            (this.g = e),
            (this.b = o),
            (this.a = "number" != typeof i || isNaN(i) ? 1 : i);
    }
    equalValue(t) {
        return this.r === t.r && this.g === t.g && this.b === t.b && this.a === t.a;
    }
    toStringHexRGB() {
        return "#" + [this.r, this.g, this.b].map(this.formatHexValue).join("");
    }
    toStringHexRGBA() {
        return this.toStringHexRGB() + this.formatHexValue(this.a);
    }
    toStringHexARGB() {
        return "#" + [this.a, this.r, this.g, this.b].map(this.formatHexValue).join("");
    }
    toStringWebRGB() {
        return `rgb(${Math.round(si(this.r, 0, 255))},${Math.round(
            si(this.g, 0, 255)
        )},${Math.round(si(this.b, 0, 255))})`;
    }
    toStringWebRGBA() {
        return `rgba(${Math.round(si(this.r, 0, 255))},${Math.round(
            si(this.g, 0, 255)
        )},${Math.round(si(this.b, 0, 255))},${ri(this.a, 0, 1)})`;
    }
    roundToPrecision(t) {
        return new li(ai(this.r, t), ai(this.g, t), ai(this.b, t), ai(this.a, t));
    }
    clamp() {
        return new li(
            ri(this.r, 0, 1),
            ri(this.g, 0, 1),
            ri(this.b, 0, 1),
            ri(this.a, 0, 1)
        );
    }
    toObject() {
        return { r: this.r, g: this.g, b: this.b, a: this.a };
    }
    formatHexValue(t) {
        return (function(t) {
            const e = Math.round(ri(t, 0, 255)).toString(16);
            return 1 === e.length ? "0" + e : e;
        })(si(t, 0, 255));
    }
}
function ci(t) {
    function e(t) {
        return t <= 0.03928 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
    }
    return (function(t) {
        return 0.2126 * t.r + 0.7152 * t.g + 0.0722 * t.b;
    })(new li(e(t.r), e(t.g), e(t.b), 1));
}
const di = (t, e) => (t + 0.05) / (e + 0.05);
const hi = /^rgb\(\s*((?:(?:25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*,\s*){2}(?:25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*)\)$/i,
    ui = /^#((?:[0-9a-f]{6}|[0-9a-f]{3}))$/i;
function pi(t) {
    const e = ui.exec(t);
    if (null === e) return null;
    let o = e[1];
    if (3 === o.length) {
        const t = o.charAt(0),
            e = o.charAt(1),
            i = o.charAt(2);
        o = t.concat(t, e, e, i, i);
    }
    const i = parseInt(o, 16);
    return isNaN(i)
        ? null
        : new li(
              ni((16711680 & i) >>> 16, 0, 255),
              ni((65280 & i) >>> 8, 0, 255),
              ni(255 & i, 0, 255),
              1
          );
}
const vi = "#FFFFFF",
    fi = { steps: 94, clipLight: 0, clipDark: 0 },
    bi =
        (Object.assign({}, fi),
        Object.assign({}, fi, { baseColor: pi("#0078D4") }),
        {
            backgroundColor: vi,
            contrast: 0,
            density: 0,
            designUnit: 4,
            baseHeightMultiplier: 8,
            baseHorizontalSpacingMultiplier: 3,
            direction: Le.ltr,
            cornerRadius: 2,
            elevatedCornerRadius: 4,
            focusOutlineWidth: 2,
            fontWeight: {
                light: 100,
                semilight: 200,
                normal: 400,
                semibold: 600,
                bold: 700,
            },
            disabledOpacity: 0.3,
            outlineWidth: 1,
            neutralPalette: [
                "#FFFFFF",
                "#FCFCFC",
                "#FAFAFA",
                "#F7F7F7",
                "#F5F5F5",
                "#F2F2F2",
                "#EFEFEF",
                "#EDEDED",
                "#EAEAEA",
                "#E8E8E8",
                "#E5E5E5",
                "#E2E2E2",
                "#E0E0E0",
                "#DDDDDD",
                "#DBDBDB",
                "#D8D8D8",
                "#D6D6D6",
                "#D3D3D3",
                "#D0D0D0",
                "#CECECE",
                "#CBCBCB",
                "#C9C9C9",
                "#C6C6C6",
                "#C3C3C3",
                "#C1C1C1",
                "#BEBEBE",
                "#BCBCBC",
                "#B9B9B9",
                "#B6B6B6",
                "#B4B4B4",
                "#B1B1B1",
                "#AFAFAF",
                "#ACACAC",
                "#A9A9A9",
                "#A7A7A7",
                "#A4A4A4",
                "#A2A2A2",
                "#9F9F9F",
                "#9D9D9D",
                "#9A9A9A",
                "#979797",
                "#959595",
                "#929292",
                "#909090",
                "#8D8D8D",
                "#8A8A8A",
                "#888888",
                "#858585",
                "#838383",
                "#808080",
                "#7D7D7D",
                "#7B7B7B",
                "#787878",
                "#767676",
                "#737373",
                "#717171",
                "#6E6E6E",
                "#6B6B6B",
                "#696969",
                "#666666",
                "#646464",
                "#616161",
                "#5F5F5F",
                "#5C5C5C",
                "#5A5A5A",
                "#575757",
                "#545454",
                "#525252",
                "#4F4F4F",
                "#4D4D4D",
                "#4A4A4A",
                "#484848",
                "#454545",
                "#424242",
                "#404040",
                "#3D3D3D",
                "#3B3B3B",
                "#383838",
                "#363636",
                "#333333",
                "#313131",
                "#2E2E2E",
                "#2B2B2B",
                "#292929",
                "#262626",
                "#242424",
                "#212121",
                "#1E1E1E",
                "#1B1B1B",
                "#181818",
                "#151515",
                "#121212",
                "#101010",
                "#000000",
            ],
            accentPalette: [
                "#FFFFFF",
                "#FBFDFE",
                "#F6FAFE",
                "#F2F8FD",
                "#EEF6FC",
                "#E9F4FB",
                "#E5F1FB",
                "#E1EFFA",
                "#DCEDF9",
                "#D8EAF8",
                "#D4E8F8",
                "#CFE6F7",
                "#CBE4F6",
                "#C7E1F6",
                "#C2DFF5",
                "#BEDDF4",
                "#BADAF3",
                "#B6D8F3",
                "#B1D6F2",
                "#ADD4F1",
                "#A9D1F0",
                "#A4CFF0",
                "#A0CDEF",
                "#9CCAEE",
                "#97C8EE",
                "#93C6ED",
                "#8FC4EC",
                "#8AC1EB",
                "#86BFEB",
                "#82BDEA",
                "#7DBAE9",
                "#79B8E8",
                "#75B6E8",
                "#70B3E7",
                "#6CB1E6",
                "#68AFE5",
                "#63ADE5",
                "#5FAAE4",
                "#5BA8E3",
                "#56A6E3",
                "#52A3E2",
                "#4EA1E1",
                "#499FE0",
                "#459DE0",
                "#419ADF",
                "#3D98DE",
                "#3896DD",
                "#3493DD",
                "#3091DC",
                "#2B8FDB",
                "#278DDB",
                "#238ADA",
                "#1E88D9",
                "#1A86D8",
                "#1683D8",
                "#1181D7",
                "#0D7FD6",
                "#097DD5",
                "#047AD5",
                "#0078D4",
                "#0075CF",
                "#0072C9",
                "#006FC4",
                "#006CBE",
                "#0069B9",
                "#0066B4",
                "#0063AE",
                "#0060A9",
                "#005CA3",
                "#00599E",
                "#005699",
                "#005393",
                "#00508E",
                "#004D88",
                "#004A83",
                "#00477D",
                "#004478",
                "#004173",
                "#003E6D",
                "#003B68",
                "#003862",
                "#00355D",
                "#003258",
                "#002F52",
                "#002B4D",
                "#002847",
                "#002542",
                "#00223C",
                "#001F36",
                "#001B30",
                "#00182B",
                "#001525",
                "#00121F",
                "#000000",
            ],
            accentBaseColor: "#0078D4",
            accentFillRestDelta: 0,
            accentFillHoverDelta: 4,
            accentFillActiveDelta: -5,
            accentFillFocusDelta: 0,
            accentFillSelectedDelta: 12,
            accentForegroundRestDelta: 0,
            accentForegroundHoverDelta: 6,
            accentForegroundActiveDelta: -4,
            accentForegroundFocusDelta: 0,
            neutralFillRestDelta: 7,
            neutralFillHoverDelta: 10,
            neutralFillActiveDelta: 5,
            neutralFillFocusDelta: 0,
            neutralFillSelectedDelta: 7,
            neutralFillInputRestDelta: 0,
            neutralFillInputHoverDelta: 0,
            neutralFillInputActiveDelta: 0,
            neutralFillInputFocusDelta: 0,
            neutralFillInputSelectedDelta: 0,
            neutralFillStealthRestDelta: 0,
            neutralFillStealthHoverDelta: 5,
            neutralFillStealthActiveDelta: 3,
            neutralFillStealthFocusDelta: 0,
            neutralFillStealthSelectedDelta: 7,
            neutralFillToggleHoverDelta: 8,
            neutralFillToggleActiveDelta: -5,
            neutralFillToggleFocusDelta: 0,
            baseLayerLuminance: -1,
            neutralFillCardDelta: 3,
            neutralForegroundDarkIndex: 93,
            neutralForegroundLightIndex: 0,
            neutralForegroundHoverDelta: 0,
            neutralForegroundActiveDelta: 0,
            neutralForegroundFocusDelta: 0,
            neutralDividerRestDelta: 8,
            neutralOutlineRestDelta: 25,
            neutralOutlineHoverDelta: 40,
            neutralOutlineActiveDelta: 16,
            neutralOutlineFocusDelta: 25,
        });
function gi(t, e) {
    return ne(t) ? t(e) : t;
}
function mi(t) {
    return e => (e && void 0 !== e[t] ? e[t] : bi[t]);
}
const yi = mi("backgroundColor"),
    xi = mi("accentBaseColor"),
    ki = mi("neutralPalette"),
    Ci = mi("accentPalette"),
    wi = mi("accentFillHoverDelta"),
    $i = mi("accentFillActiveDelta"),
    Fi = mi("accentFillFocusDelta"),
    Di = mi("accentFillSelectedDelta"),
    Ti = mi("accentForegroundRestDelta"),
    Pi = mi("accentForegroundHoverDelta"),
    Ei = mi("accentForegroundActiveDelta"),
    Ai = mi("accentForegroundFocusDelta"),
    Si = mi("neutralFillRestDelta"),
    Hi = mi("neutralFillHoverDelta"),
    Oi = mi("neutralFillActiveDelta"),
    Li = mi("neutralFillFocusDelta"),
    Bi = mi("neutralFillSelectedDelta"),
    Ri = mi("neutralFillInputRestDelta"),
    Mi = mi("neutralFillInputHoverDelta"),
    Ii = mi("neutralFillInputActiveDelta"),
    Ni = mi("neutralFillInputFocusDelta"),
    zi = mi("neutralFillInputSelectedDelta"),
    ji = mi("neutralFillStealthRestDelta"),
    _i = mi("neutralFillStealthHoverDelta"),
    Vi = mi("neutralFillStealthActiveDelta"),
    Gi = mi("neutralFillStealthFocusDelta"),
    qi = mi("neutralFillStealthSelectedDelta"),
    Wi = mi("neutralFillToggleHoverDelta"),
    Ui = mi("neutralFillToggleActiveDelta"),
    Ki = mi("neutralFillToggleFocusDelta"),
    Xi = mi("baseLayerLuminance"),
    Qi = mi("neutralFillCardDelta"),
    Yi = mi("neutralForegroundHoverDelta"),
    Zi = mi("neutralForegroundActiveDelta"),
    Ji = mi("neutralForegroundFocusDelta"),
    tr = mi("neutralDividerRestDelta"),
    er = mi("neutralOutlineRestDelta"),
    or = mi("neutralOutlineHoverDelta"),
    ir = mi("neutralOutlineActiveDelta"),
    rr = mi("neutralOutlineFocusDelta");
var nr;
function sr(t) {
    const e = Pe(t);
    return function(t) {
        return "function" == typeof t
            ? o => e(Object.assign({}, o, { backgroundColor: t(o) }))
            : e(t);
    };
}
function ar(t, e) {
    const o = Pe(e);
    return e =>
        "function" == typeof e
            ? i => o(Object.assign({}, i, { backgroundColor: e(i) }))[t]
            : o(e)[t];
}
!(function(t) {
    (t.rest = "rest"),
        (t.hover = "hover"),
        (t.active = "active"),
        (t.focus = "focus"),
        (t.selected = "selected");
})(nr || (nr = {}));
const lr = Pe(t => {
    let e = pi(t);
    if (null !== e) return e;
    if (
        ((e = (function(t) {
            const e = hi.exec(t);
            if (null === e) return null;
            const o = e[1].split(",");
            return new li(
                ni(Number(o[0]), 0, 255),
                ni(Number(o[1]), 0, 255),
                ni(Number(o[2]), 0, 255),
                1
            );
        })(t)),
        null !== e)
    )
        return e;
    throw new Error(
        t +
            ' cannot be converted to a ColorRGBA64. Color strings must be one of the following formats: "#RGB", "#RRGGBB", or "rgb(r, g, b)"'
    );
});
function cr(t) {
    return (
        (e = t),
        ui.test(e) ||
            (function(t) {
                return hi.test(t);
            })(t)
    );
    var e;
}
const dr = Pe(
    (t, e) =>
        (function(t, e) {
            const o = ci(t),
                i = ci(e);
            return o > i ? di(o, i) : di(i, o);
        })(lr(t), lr(e)),
    (t, e) => t + e
);
function hr(t) {
    return ci(lr(t));
}
function ur(...t) {
    return e =>
        Math.max.apply(
            null,
            t.map(t => t(e))
        );
}
const pr = (t, e, o) => Math.min(Math.max(t, e), o);
var vr;
function fr(t, e) {
    return o => {
        if (!cr(e)) return -1;
        const i = gi(t, o),
            r = i.indexOf(e);
        return -1 !== r
            ? r
            : i.findIndex(t => {
                  return cr(t) && ((o = t), lr(e).equalValue(lr(o)));
                  var o;
              });
    };
}
function br(t, e) {
    return o => {
        const i = gi(t, o),
            r = gi(e, o),
            n = fr(i, r)(o);
        let s;
        if (-1 !== n) return n;
        try {
            s = hr(r);
        } catch (t) {
            s = -1;
        }
        return -1 === s
            ? 0
            : i
                  .map((t, e) => ({ luminance: hr(t), index: e }))
                  .reduce((t, e) =>
                      Math.abs(e.luminance - s) < Math.abs(t.luminance - s) ? e : t
                  ).index;
    };
}
function gr(t) {
    return hr(yi(t)) <= (-0.1 + Math.sqrt(0.21)) / 2;
}
function mr(t, e) {
    return "function" == typeof t
        ? o => e(o)[pr(t(o), 0, e(o).length - 1)]
        : e[pr(t, 0, e.length - 1)];
}
function yr(t) {
    return (e, o) => i => mr(gr(i) ? gi(o, i) : gi(e, i), t(i));
}
function xr(t) {
    return e => o => i => r => n => {
        const s = gi(t, n),
            a = gi(e, n),
            l = a.length,
            c = pr(o(s, a, n), 0, l - 1),
            d = i(c, a, n);
        const h = [].concat(a),
            u = l - 1;
        let p = c;
        return (
            -1 === d && (h.reverse(), (p = u - p)),
            (function t(e, o, i = 0, r = e.length - 1) {
                if (r === i) return e[i];
                const n = Math.floor((r - i) / 2) + i;
                return o(e[n]) ? t(e, o, i, n) : t(e, o, n + 1, r);
            })(
                h,
                function(t) {
                    return r(dr(s, t));
                },
                p,
                u
            )
        );
    };
}
function kr(t, e, o) {
    return br(e, t)(o);
}
function Cr(t) {
    return br(ki, yi(t))(t);
}
function wr(t, e, o, i, r, n) {
    return s => {
        const a = gi(t, s),
            l = gr(s) ? -1 : 1,
            c = xr(yi)(a)(kr)(() => l)(((d = gi(e, s)), t => t >= d))(s);
        var d;
        const h = fr(t, c)(s),
            u = gi(o, s),
            p = gi(i, s),
            v = gi(r, s),
            f = gi(n, s);
        return (function(t, e, o, i, r, n, s) {
            const a = t + o * Math.abs(i - r),
                l = 1 === o ? i < r : o * i > o * r,
                c = l ? t : a,
                d = l ? a : t,
                h = c + o * n,
                u = c + o * s;
            return { rest: mr(c, e), hover: mr(d, e), active: mr(h, e), focus: mr(u, e) };
        })(h, a, l, u, p, v, f);
    };
}
!(function(t) {
    (t.neutral = "neutral"), (t.accent = "accent");
})(vr || (vr = {}));
const $r = sr(wr(ki, 14, 0, Yi, Zi, Ji)),
    Fr =
        (ar(nr.rest, $r),
        ar(nr.hover, $r),
        ar(nr.active, $r),
        ar(nr.focus, $r),
        sr(wr(ki, 4.5, 0, Wi, Ui, Ki))),
    Dr = ar(nr.rest, Fr),
    Tr =
        (ar(nr.hover, Fr),
        ar(nr.active, Fr),
        ar(nr.focus, Fr),
        (t, e) => (dr(vi, t) >= e ? vi : "#000000"));
function Pr(t) {
    return function(e) {
        return "function" == typeof e ? o => Tr(e(o), t) : Tr(Dr(e), t);
    };
}
const Er = Pr(4.5),
    Ar = Pr(3),
    Sr = (t, e) => (dr(vi, t) >= e ? vi : "#000000");
const Hr =
    ((Or = 4.5),
    function(t) {
        return "function" == typeof t ? e => Sr(t(e), Or) : Sr(xi(t), Or);
    });
var Or;
function Lr(t) {
    return wr(ki, t, 0, 0, 0, 0);
}
const Br = ar(nr.rest, sr(Lr(4.5))),
    Rr = ar(nr.rest, sr(Lr(3)));
function Mr(t) {
    return e => {
        const o = Ci(e),
            i = xi(e),
            r = br(Ci, i)(e),
            n = { rest: Ti(e), hover: Pi(e), active: Ei(e), focus: Ai(e) },
            s = gr(e) ? -1 : 1,
            a =
                r +
                (1 === s ? Math.min(n.rest, n.hover) : Math.max(s * n.rest, s * n.hover)),
            l = xr(yi)(Ci)(() => a)(() => s)(e => e >= t)(e),
            c = fr(Ci, l)(e),
            d = c + s * Math.abs(n.rest - n.hover),
            h = 1 === s ? n.rest < n.hover : s * n.rest > s * n.hover,
            u = h ? c : d,
            p = h ? d : c,
            v = u + s * n.active,
            f = u + s * n.focus;
        return { rest: mr(u, o), hover: mr(p, o), active: mr(v, o), focus: mr(f, o) };
    };
}
const Ir = sr(Mr(4.5)),
    Nr = sr(Mr(3)),
    zr =
        (ar(nr.rest, Ir),
        ar(nr.hover, Ir),
        ar(nr.active, Ir),
        ar(nr.focus, Ir),
        ar(nr.rest, Nr),
        ar(nr.hover, Nr),
        ar(nr.active, Nr),
        ar(nr.focus, Nr),
        ur(Si, Hi, Oi, Li));
function jr(t) {
    return e => {
        const o = Cr(e);
        return mr(o + (o >= zr(e) ? -1 : 1) * t(e), ki(e));
    };
}
const _r = sr(jr(Si)),
    Vr = sr(jr(Hi)),
    Gr = sr(jr(Oi)),
    qr = sr(jr(Li)),
    Wr = sr(jr(Bi)),
    Ur = sr(t => ({
        rest: _r(t),
        hover: Vr(t),
        active: Gr(t),
        focus: qr(t),
        selected: Wr(t),
    })),
    Kr = ur(Si, Hi, Oi, Li, ji, _i, Vi, Gi);
function Xr(t) {
    return e => {
        const o = Cr(e);
        return mr(o + (o >= Kr(e) ? -1 : 1) * t(e), ki(e));
    };
}
const Qr = sr(Xr(ji)),
    Yr = sr(Xr(_i)),
    Zr = sr(Xr(Vi)),
    Jr = sr(Xr(Gi)),
    tn = sr(Xr(qi)),
    en = sr(t => ({
        rest: Qr(t),
        hover: Yr(t),
        active: Zr(t),
        focus: Jr(t),
        selected: tn(t),
    }));
function on(t) {
    return e => {
        const o = gr(e) ? -1 : 1;
        return mr(Cr(e) - t(e) * o, ki(e));
    };
}
const rn = sr(on(Ri)),
    nn = sr(on(Mi)),
    sn = sr(on(Ii)),
    an = sr(on(Ni)),
    ln = sr(on(zi)),
    cn = sr(t => ({
        rest: rn(t),
        hover: nn(t),
        active: sn(t),
        focus: an(t),
        selected: ln(t),
    })),
    dn = ur(Si, Hi, Oi);
function hn(t) {
    return e => {
        const o = Ci(e),
            i = o.length,
            r = xi(e),
            n = Hr(Object.assign({}, e, { backgroundColor: r })),
            s = wi(e),
            a = Cr(e) >= dn(e) ? -1 : 1,
            l = i - 1,
            c = br(Ci, r)(e);
        let d = 0;
        for (
            ;
            d < a * s &&
            Se(c + d + a, 0, i) &&
            dr(o[c + d + a], n) >= t &&
            Se(c + d + a + a, 0, l);

        )
            d += a;
        const h = c + d,
            u = h + -1 * a * s,
            p = u + a * $i(e),
            v = u + a * Fi(e);
        return {
            rest: mr(u, o),
            hover: mr(h, o),
            active: mr(p, o),
            focus: mr(v, o),
            selected: mr(u + (gr(e) ? -1 * Di(e) : Di(e)), o),
        };
    };
}
const un = sr(hn(4.5)),
    pn = sr(hn(3)),
    vn =
        (ar(nr.rest, un),
        ar(nr.hover, un),
        ar(nr.active, un),
        ar(nr.focus, un),
        ar(nr.selected, un),
        ar(nr.rest, pn),
        ar(nr.hover, pn),
        ar(nr.active, pn),
        ar(nr.focus, pn),
        ar(nr.selected, pn),
        t => {
            const e = Qi(t),
                o = br(ki, yi(t))(t);
            return mr(o - (o < e ? -1 * e : e), ki(t));
        });
const fn = sr(t => {
        const e = ki(t),
            o = Cr(t),
            i = gr(t) ? -1 : 1,
            r = er(t),
            n = o + i * r,
            s = n + i * (or(t) - r),
            a = n + i * (ir(t) - r),
            l = n + i * (rr(t) - r);
        return { rest: mr(n, e), hover: mr(s, e), active: mr(a, e), focus: mr(l, e) };
    }),
    bn =
        (ar(nr.rest, fn),
        ar(nr.hover, fn),
        ar(nr.active, fn),
        ar(nr.focus, fn),
        sr(t => {
            const e = ki(t),
                o = Cr(t),
                i = tr(t);
            return mr(o + (gr(t) ? -1 : 1) * i, e);
        }));
var gn, mn, yn;
function xn(t, e) {
    return o => (-1 === Xi(o) ? e(o) : t(o));
}
!(function(t) {
    (t[(t.L1 = 0)] = "L1"),
        (t[(t.L1Alt = 3)] = "L1Alt"),
        (t[(t.L2 = 10)] = "L2"),
        (t[(t.L3 = 13)] = "L3"),
        (t[(t.L4 = 16)] = "L4");
})(gn || (gn = {})),
    (function(t) {
        (t[(t.L1 = 76)] = "L1"),
            (t[(t.L1Alt = 76)] = "L1Alt"),
            (t[(t.L2 = 79)] = "L2"),
            (t[(t.L3 = 82)] = "L3"),
            (t[(t.L4 = 85)] = "L4");
    })(mn || (mn = {})),
    (function(t) {
        (t[(t.LightMode = 1)] = "LightMode"), (t[(t.DarkMode = 0.23)] = "DarkMode");
    })(yn || (yn = {}));
const kn = br(ki, t => {
        const e = Xi(t);
        return new li(e, e, e, 1).toStringHexRGB();
    }),
    Cn = t => ri(oi(kn, Qi)(t), 0, ki(t).length - 1),
    wn = ur(Si, Hi, Oi),
    $n = ur(ei(kn, Qi), wn),
    Fn = t => {
        const e = new li(0.14, 0.14, 0.14, 1);
        return br(ki, e.toStringHexRGB())(t);
    },
    Dn = sr(xn(mr(oi(Cn, Qi), ki), yr(ki)(0, oi(Fn, ii(Qi, 5))))),
    Tn = sr(xn(mr(Cn, ki), yr(ki)(0, oi(Fn, ii(Qi, 4))))),
    Pn = sr(xn(mr(ei(Cn, Qi), ki), yr(ki)(Qi, oi(Fn, ii(Qi, 3))))),
    En = sr(xn(mr(kn, ki), yr(ki)(0, oi(Fn, ii(Qi, 3))))),
    An = Pn,
    Sn = sr(xn(mr($n, ki), yr(ki)(wn, oi(Fn, ii(Qi, 2))))),
    Hn = sr(xn(mr(ei($n, Qi), ki), yr(ki)(ei(wn, Qi), oi(Fn, Qi)))),
    On = sr(xn(mr(ei($n, ii(Qi, 2)), ki), yr(ki)(ei(wn, ii(Qi, 2)), Fn)));
function Ln(t) {
    return t > 3.5;
}
const Bn = sr(
    xr(yi)(ki)(function(t, e, o) {
        return br(ki, t)(o);
    })(function(t, e, o) {
        return gr(o) ? -1 : 1;
    })(Ln)
);
function Rn(t, e, o) {
    return gr(o) ? 1 : -1;
}
const Mn = xt`
    ${We("block")};
`;
let In = class extends Ye {};
var Nn;
t(
    [Ze({ attribute: "background-color", default: bi.backgroundColor })],
    In.prototype,
    "backgroundColor",
    void 0
),
    t(
        [
            Ze({
                attribute: "accent-base-color",
                cssCustomProperty: !1,
                default: bi.accentBaseColor,
            }),
        ],
        In.prototype,
        "accentBaseColor",
        void 0
    ),
    t(
        [Ze({ attribute: !1, cssCustomProperty: !1, default: bi.neutralPalette })],
        In.prototype,
        "neutralPalette",
        void 0
    ),
    t(
        [Ze({ attribute: !1, cssCustomProperty: !1, default: bi.accentPalette })],
        In.prototype,
        "accentPalette",
        void 0
    ),
    t([Ze({ default: bi.density, converter: Z })], In.prototype, "density", void 0),
    t(
        [Ze({ attribute: "design-unit", converter: Z, default: bi.designUnit })],
        In.prototype,
        "designUnit",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "base-height-multiplier",
                default: bi.baseHeightMultiplier,
                converter: Z,
            }),
        ],
        In.prototype,
        "baseHeightMultiplier",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "base-horizontal-spacing-multiplier",
                converter: Z,
                default: bi.baseHorizontalSpacingMultiplier,
            }),
        ],
        In.prototype,
        "baseHorizontalSpacingMultiplier",
        void 0
    ),
    t(
        [Ze({ attribute: "corner-radius", converter: Z, default: bi.cornerRadius })],
        In.prototype,
        "cornerRadius",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "elevated-corner-radius",
                converter: Z,
                default: bi.elevatedCornerRadius,
            }),
        ],
        In.prototype,
        "elevatedCornerRadius",
        void 0
    ),
    t(
        [Ze({ attribute: "outline-width", converter: Z, default: bi.outlineWidth })],
        In.prototype,
        "outlineWidth",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "focus-outline-width",
                converter: Z,
                default: bi.focusOutlineWidth,
            }),
        ],
        In.prototype,
        "focusOutlineWidth",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "disabled-opacity",
                converter: Z,
                default: bi.disabledOpacity,
            }),
        ],
        In.prototype,
        "disabledOpacity",
        void 0
    ),
    t(
        [Ze({ attribute: "type-ramp-minus-2-font-size", default: "10px" })],
        In.prototype,
        "typeRampMinus2FontSize",
        void 0
    ),
    t(
        [Ze({ attribute: "type-ramp-minus-2-line-height", default: "16px" })],
        In.prototype,
        "typeRampMinus2LineHeight",
        void 0
    ),
    t(
        [Ze({ attribute: "type-ramp-minus-1-font-size", default: "12px" })],
        In.prototype,
        "typeRampMinus1FontSize",
        void 0
    ),
    t(
        [Ze({ attribute: "type-ramp-minus-1-line-height", default: "16px" })],
        In.prototype,
        "typeRampMinus1LineHeight",
        void 0
    ),
    t(
        [Ze({ attribute: "type-ramp-base-font-size", default: "14px" })],
        In.prototype,
        "typeRampBaseFontSize",
        void 0
    ),
    t(
        [Ze({ attribute: "type-ramp-base-line-height", default: "20px" })],
        In.prototype,
        "typeRampBaseLineHeight",
        void 0
    ),
    t(
        [Ze({ attribute: "type-ramp-plus-1-font-size", default: "16px" })],
        In.prototype,
        "typeRampPlus1FontSize",
        void 0
    ),
    t(
        [Ze({ attribute: "type-ramp-plus-1-line-height", default: "24px" })],
        In.prototype,
        "typeRampPlus1LineHeight",
        void 0
    ),
    t(
        [Ze({ attribute: "type-ramp-plus-2-font-size", default: "20px" })],
        In.prototype,
        "typeRampPlus2FontSize",
        void 0
    ),
    t(
        [Ze({ attribute: "type-ramp-plus-2-line-height", default: "28px" })],
        In.prototype,
        "typeRampPlus2LineHeight",
        void 0
    ),
    t(
        [Ze({ attribute: "type-ramp-plus-3-font-size", default: "28px" })],
        In.prototype,
        "typeRampPlus3FontSize",
        void 0
    ),
    t(
        [Ze({ attribute: "type-ramp-plus-3-line-height", default: "36px" })],
        In.prototype,
        "typeRampPlus3LineHeight",
        void 0
    ),
    t(
        [Ze({ attribute: "type-ramp-plus-4-font-size", default: "34px" })],
        In.prototype,
        "typeRampPlus4FontSize",
        void 0
    ),
    t(
        [Ze({ attribute: "type-ramp-plus-4-line-height", default: "44px" })],
        In.prototype,
        "typeRampPlus4LineHeight",
        void 0
    ),
    t(
        [Ze({ attribute: "type-ramp-plus-5-font-size", default: "46px" })],
        In.prototype,
        "typeRampPlus5FontSize",
        void 0
    ),
    t(
        [Ze({ attribute: "type-ramp-plus-5-line-height", default: "56px" })],
        In.prototype,
        "typeRampPlus5LineHeight",
        void 0
    ),
    t(
        [Ze({ attribute: "type-ramp-plus-6-font-size", default: "60px" })],
        In.prototype,
        "typeRampPlus6FontSize",
        void 0
    ),
    t(
        [Ze({ attribute: "type-ramp-plus-6-line-height", default: "72px" })],
        In.prototype,
        "typeRampPlus6LineHeight",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "accent-fill-rest-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.accentFillRestDelta,
            }),
        ],
        In.prototype,
        "accentFillRestDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "accent-fill-hover-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.accentFillHoverDelta,
            }),
        ],
        In.prototype,
        "accentFillHoverDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "accent-fill-active-delta",
                cssCustomProperty: !1,
                converter: Z,
                default: bi.accentFillActiveDelta,
            }),
        ],
        In.prototype,
        "accentFillActiveDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "accent-fill-focus-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.accentFillFocusDelta,
            }),
        ],
        In.prototype,
        "accentFillFocusDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "accent-fill-selected-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.accentFillSelectedDelta,
            }),
        ],
        In.prototype,
        "accentFillSelectedDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "accent-foreground-rest-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.accentForegroundRestDelta,
            }),
        ],
        In.prototype,
        "accentForegroundRestDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "accent-foreground-hover-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.accentForegroundHoverDelta,
            }),
        ],
        In.prototype,
        "accentForegroundHoverDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "accent-foreground-active-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.accentForegroundActiveDelta,
            }),
        ],
        In.prototype,
        "accentForegroundActiveDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "accent-foreground-focus-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.accentForegroundFocusDelta,
            }),
        ],
        In.prototype,
        "accentForegroundFocusDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-rest-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillRestDelta,
            }),
        ],
        In.prototype,
        "neutralFillRestDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-hover-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillHoverDelta,
            }),
        ],
        In.prototype,
        "neutralFillHoverDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-active-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillActiveDelta,
            }),
        ],
        In.prototype,
        "neutralFillActiveDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-focus-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillFocusDelta,
            }),
        ],
        In.prototype,
        "neutralFillFocusDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-selected-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillSelectedDelta,
            }),
        ],
        In.prototype,
        "neutralFillSelectedDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-input-rest-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillInputRestDelta,
            }),
        ],
        In.prototype,
        "neutralFillInputRestDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-input-hover-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillInputHoverDelta,
            }),
        ],
        In.prototype,
        "neutralFillInputHoverDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-input-active-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillInputActiveDelta,
            }),
        ],
        In.prototype,
        "neutralFillInputActiveDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-input-focus-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillInputFocusDelta,
            }),
        ],
        In.prototype,
        "neutralFillInputFocusDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-input-selected-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillInputSelectedDelta,
            }),
        ],
        In.prototype,
        "neutralFillInputSelectedDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-stealth-rest-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillStealthRestDelta,
            }),
        ],
        In.prototype,
        "neutralFillStealthRestDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-stealth-hover-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillStealthHoverDelta,
            }),
        ],
        In.prototype,
        "neutralFillStealthHoverDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-stealth-active-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillStealthActiveDelta,
            }),
        ],
        In.prototype,
        "neutralFillStealthActiveDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-stealth-focus-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillStealthFocusDelta,
            }),
        ],
        In.prototype,
        "neutralFillStealthFocusDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-stealth-selected-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillStealthSelectedDelta,
            }),
        ],
        In.prototype,
        "neutralFillStealthSelectedDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-toggle-hover-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillToggleHoverDelta,
            }),
        ],
        In.prototype,
        "neutralFillToggleHoverDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-toggle-hover-active",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillToggleActiveDelta,
            }),
        ],
        In.prototype,
        "neutralFillToggleActiveDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-toggle-hover-focus",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillToggleFocusDelta,
            }),
        ],
        In.prototype,
        "neutralFillToggleFocusDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "base-layer-luminance",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.baseLayerLuminance,
            }),
        ],
        In.prototype,
        "baseLayerLuminance",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-fill-card-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralFillCardDelta,
            }),
        ],
        In.prototype,
        "neutralFillCardDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-foreground-hover-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralForegroundHoverDelta,
            }),
        ],
        In.prototype,
        "neutralForegroundHoverDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-foreground-active-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralForegroundActiveDelta,
            }),
        ],
        In.prototype,
        "neutralForegroundActiveDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-foreground-focus-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralForegroundFocusDelta,
            }),
        ],
        In.prototype,
        "neutralForegroundFocusDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-divider-rest-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralDividerRestDelta,
            }),
        ],
        In.prototype,
        "neutralDividerRestDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-outline-rest-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralOutlineRestDelta,
            }),
        ],
        In.prototype,
        "neutralOutlineRestDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-outline-hover-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralOutlineHoverDelta,
            }),
        ],
        In.prototype,
        "neutralOutlineHoverDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-outline-active-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralOutlineActiveDelta,
            }),
        ],
        In.prototype,
        "neutralOutlineActiveDelta",
        void 0
    ),
    t(
        [
            Ze({
                attribute: "neutral-outline-focus-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: bi.neutralOutlineFocusDelta,
            }),
        ],
        In.prototype,
        "neutralOutlineFocusDelta",
        void 0
    ),
    (In = t(
        [
            ((Nn = { name: "fast-design-system-provider", template: Je, styles: Mn }),
            t => {
                dt(Nn)(t), t.registerTagName("string" == typeof Nn ? Nn : Nn.name);
            }),
        ],
        In
    ));
const zn = Ve("neutral-foreground-rest", t => $r(t).rest, In.findProvider),
    jn = Ve("neutral-foreground-hover", t => $r(t).hover, In.findProvider),
    _n = Ve("neutral-foreground-active", t => $r(t).active, In.findProvider),
    Vn =
        (Ve("neutral-foreground-focus", t => $r(t).focus, In.findProvider),
        Ve("neutral-foreground-toggle", Er, In.findProvider),
        Ve("neutral-foreground-toggle-large", Ar, In.findProvider),
        Ve("neutral-foreground-hint", Br, In.findProvider)),
    Gn =
        (Ve("neutral-foreground-hint-large", Rr, In.findProvider),
        Ve("accent-foreground-rest", t => Ir(t).rest, In.findProvider)),
    qn = Ve("accent-foreground-hover", t => Ir(t).hover, In.findProvider),
    Wn = Ve("accent-foreground-active", t => Ir(t).active, In.findProvider),
    Un =
        (Ve("accent-foreground-focus", t => Ir(t).focus, In.findProvider),
        Ve("accent-foreground-cut-rest", t => Hr(t), In.findProvider)),
    Kn =
        (Ve("accent-foreground-large-rest", t => Nr(t).rest, In.findProvider),
        Ve("accent-foreground-large-hover", t => Nr(t).hover, In.findProvider),
        Ve("accent-foreground-large-active", t => Nr(t).active, In.findProvider),
        Ve("accent-foreground-large-focus", t => Nr(t).focus, In.findProvider),
        Ve("neutral-fill-rest", t => Ur(t).rest, In.findProvider)),
    Xn = Ve("neutral-fill-hover", t => Ur(t).hover, In.findProvider),
    Qn = Ve("neutral-fill-active", t => Ur(t).active, In.findProvider),
    Yn = Ve("neutral-fill-focus", t => Ur(t).focus, In.findProvider),
    Zn =
        (Ve("neutral-fill-selected", t => Ur(t).selected, In.findProvider),
        Ve("neutral-fill-stealth-rest", t => en(t).rest, In.findProvider)),
    Jn = Ve("neutral-fill-stealth-hover", t => en(t).hover, In.findProvider),
    ts = Ve("neutral-fill-stealth-active", t => en(t).active, In.findProvider),
    es =
        (Ve("neutral-fill-stealth-focus", t => en(t).focus, In.findProvider),
        Ve("neutral-fill-stealth-selected", t => en(t).selected, In.findProvider),
        Ve("neutral-fill-toggle-rest", t => Fr(t).rest, In.findProvider),
        Ve("neutral-fill-toggle-hover", t => Fr(t).hover, In.findProvider),
        Ve("neutral-fill-toggle-active", t => Fr(t).active, In.findProvider),
        Ve("neutral-fill-toggle-focus", t => Fr(t).focus, In.findProvider),
        Ve("neutral-fill-input-rest", t => cn(t).rest, In.findProvider)),
    os = Ve("neutral-fill-input-hover", t => cn(t).hover, In.findProvider),
    is = Ve("neutral-fill-input-active", t => cn(t).active, In.findProvider),
    rs =
        (Ve("neutral-fill-input-focus", t => cn(t).focus, In.findProvider),
        Ve("accent-fill-rest", t => un(t).rest, In.findProvider)),
    ns = Ve("accent-fill-hover", t => un(t).hover, In.findProvider),
    ss = Ve("accent-fill-active", t => un(t).active, In.findProvider),
    as =
        (Ve("accent-fill-focus", t => un(t).focus, In.findProvider),
        Ve("accent-fill-selected", t => un(t).selected, In.findProvider),
        Ve("accent-fill-large-rest", t => pn(t).rest, In.findProvider),
        Ve("accent-fill-large-hover", t => pn(t).hover, In.findProvider),
        Ve("accent-fill-large-active", t => pn(t).active, In.findProvider),
        Ve("accent-fill-large-focus", t => pn(t).focus, In.findProvider),
        Ve("accent-fill-large-selected", t => pn(t).selected, In.findProvider),
        Ve(
            "neutral-fill-card-rest",
            t => {
                return "function" == typeof (e = t)
                    ? t => vn(Object.assign({}, t, { backgroundColor: e(t) }))
                    : vn(e);
                var e;
            },
            In.findProvider
        ),
        Ve("neutral-outline-rest", t => fn(t).rest, In.findProvider)),
    ls = Ve("neutral-outline-hover", t => fn(t).hover, In.findProvider),
    cs = Ve("neutral-outline-active", t => fn(t).active, In.findProvider),
    ds =
        (Ve("neutral-outline-focus", t => fn(t).focus, In.findProvider),
        Ve("neutral-divider-rest", bn, In.findProvider)),
    hs =
        (Ve("neutral-layer-floating", Dn, In.findProvider),
        Ve("neutral-layer-card", Tn, In.findProvider)),
    us =
        (Ve("neutral-layer-card-container", Pn, In.findProvider),
        Ve("neutral-layer-l1", En, In.findProvider),
        Ve("neutral-layer-l1-alt", An, In.findProvider),
        Ve("neutral-layer-l2", Sn, In.findProvider),
        Ve("neutral-layer-l3", Hn, In.findProvider),
        Ve("neutral-layer-l4", On, In.findProvider),
        Ve("neutral-focus", Bn, In.findProvider)),
    ps = Ve(
        "neutral-focus-inner-accent",
        ((vs = xi),
        xr(Bn)(Ci)(
            (function(t) {
                return (e, o, i) => o.indexOf(t(i));
            })(vs)
        )(Rn)(Ln)),
        In.findProvider
    );
var vs;
const fs =
        "box-shadow: 0 0 calc((var(--elevation) * 0.225px) + 2px) rgba(0, 0, 0, calc(.11 * (2 - var(--background-luminance, 1)))), 0 calc(var(--elevation) * 0.4px) calc((var(--elevation) * 0.9px)) rgba(0, 0, 0, calc(.13 * (2 - var(--background-luminance, 1))));",
    bs = "(var(--base-height-multiplier) + var(--density)) * var(--design-unit)",
    gs = xt`
    ${We("inline-block")} :host {
        font-family: var(--body-font);
        outline: none;
    }

    .control {
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        line-height: 1;
        box-sizing: border-box;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 0 calc((6 + (var(--design-unit) * 2 * var(--density))) * 1px);
        height: calc(${bs} * 1px);
        min-width: calc(${bs} * 1px);
        white-space: nowrap;
        outline: none;
        text-decoration: none;
        cursor: pointer;
        border-radius: calc(var(--corner-radius) * 1px);
        background-color: var(--neutral-fill-rest);
        color: var(--neutral-foreground-rest);
        fill: var(--neutral-foreground-rest);
        border: calc(var(--outline-width) * 1px) solid transparent;
    }

    .control:hover {
        background-color: var(--neutral-fill-hover);
    }

    .control:active {
        background-color: var(--neutral-fill-active);
    }

    .control:${Ue} {
        border: calc(var(--outline-width) * 1px) solid var(--neutral-focus);
        box-shadow: 0 0 0 calc((var(--focus-outline-width) - var(--outline-width)) * 1px) var(--neutral-focus);
    }

    .control::-moz-focus-inner {
        border: 0;
    }

    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }

    .start,
    .end,
    ::slotted(svg) {
        ${""} width: 16px;
        height: 16px;
    }

    .start {
        margin-inline-end: 11px;
    }

    .end {
        margin-inline-start: 11px;
    }
`,
    ms = xt`
    :host(.accent) .control {
        background: var(--accent-fill-rest);
        color: var(--accent-foreground-cut-rest);  
    }

    :host(.accent) .control:hover {
        background: var(--accent-fill-hover);
    }

    :host(.accent) .control:active {
        background: var(--accent-fill-active);
    }

    :host(.accent) .control:${Ue} {
        box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset var(--neutral-focus-inner-accent);
    }
`,
    ys = xt`
    :host(.hypertext) .control {
        padding: 0;
        height: auto;
        border: none;
        box-shadow: none;
        border-radius: 0;
    }

    :host a.control:not(:link) {
        background-color: transparent;
        cursor: default;
    }

    :host(.hypertext) .control:link,
    :host(.hypertext) .control:visited {
        background: transparent;
        color: var(--accent-foreground-rest);
        border-bottom: calc(var(--outline-width) * 1px) solid var(--accent-foreground-rest);
    }

    :host(.hypertext) .control:hover {
        border-bottom-color: var(--accent-foreground-hover);
    }

    :host(.hypertext) .control:active {
        border-bottom-color: var(--accent-foreground-active);
    }

    :host(.hypertext) .control:${Ue} {
        border-bottom: calc(var(--focus-outline-width) * 1px) solid var(--neutral-focus);
    }
`,
    xs = xt`
    :host(.lightweight) .control {
        padding: 0;
        border: none;
        box-shadow: none;
        border-radius: 0;
        background: transparent;
        color: var(--accent-foreground-rest);
    }

    :host(.lightweight) .control:hover {
        color: var(--accent-foreground-hover);
    }

    :host(.lightweight) .control:active {
        color: var(--accent-foreground-active);
    }

    :host(.lightweight) .content {
        position: relative;
    }

    :host(.lightweight) .content::before {
        content: "";
        display: block;
        height: calc(var(--outline-width) * 1px);
        position: absolute;
        bottom: -3px;
        width: 100%;
    }

    :host(.lightweight) .control:hover .content::before {
        background: var(--accent-foreground-hover);
    }

    :host(.lightweight) .control:active .content::before {
        background: var(--accent-foreground-active);
    }

    :host(.lightweight) .control:${Ue} .content::before {
        background: var(--neutral-foreground-rest);
        height: calc(var(--focus-outline-width) * 1px);
    }
`,
    ks = xt`
    :host(.outline) .control {
        background: transparent;
        border-color: var(--neutral-outline-rest);
    }

    :host(.outline) .control:hover {
        border-color: var(--neutral-outline-hover);
    }

    :host(.outline) .control:active {
        border-color: var(--neutral-outline-active);
    }
`,
    Cs = xt`
    :host(.stealth) .control {
        background: var(--neutral-fill-stealth-rest);
    }

    :host(.stealth) .control:hover {
        background: var(--neutral-fill-stealth-hover);
    }

    :host(.stealth) .control:active {
        background: var(--neutral-fill-stealth-active);
    }
`,
    ws = xt`
    ${gs}
    ${ms}
    ${ys}
    ${xs}
    ${ks}
    ${Cs}
`.withBehaviors(
        ss,
        ns,
        rs,
        Wn,
        Un,
        qn,
        Gn,
        Qn,
        Yn,
        Xn,
        Kn,
        ts,
        Jn,
        Zn,
        us,
        ps,
        zn,
        cs,
        ls,
        as
    );
let $s = class extends Lt {};
$s = t(
    [
        dt({
            name: "fast-anchor",
            template: St,
            styles: ws,
            shadowOptions: { delegatesFocus: !0 },
        }),
    ],
    $s
);
const Fs = xt`
    ${We("inline-block")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        font-size: var(--type-ramp-minus-1-font-size);
        line-height: var(--type-ramp-minus-1-height);
    }

    .badge {
        border-radius: calc(var(--corner-radius) * 1px);
        padding: calc(var(--design-unit) * 0.5px) calc(var(--design-unit) * 1px);
    }

    :host(.lightweight) {
        background: transparent;
        color: var(--neutral-foreground-rest);
        font-weight: 600;
    }

    :host(.accent) {
        background: var(--accent-fill-rest);
        color: var(--accent-foreground-cut-rest);
    }

    :host(.neutral) {
        background: var(--neutral-fill-rest);
        color: var(--neutral-foreground-rest);
    }
`.withBehaviors(rs, Un, Kn, zn);
let Ds = class extends Rt {
    constructor() {
        super(...arguments), (this.appearance = "lightweight");
    }
    appearanceChanged(t, e) {
        t !== e &&
            s.queueUpdate(() => {
                this.classList.add(e), this.classList.remove(t);
            });
    }
};
t([tt({ mode: "fromView" })], Ds.prototype, "appearance", void 0),
    (Ds = t([dt({ name: "fast-badge", template: Bt, styles: Fs })], Ds));
const Ts = xt`
    ${gs}
    ${ms}
    ${ys}
    ${xs}
    ${ks}
    ${Cs}
`.withBehaviors(
    ss,
    ns,
    rs,
    Wn,
    Un,
    qn,
    Gn,
    Qn,
    Yn,
    Xn,
    Kn,
    ts,
    Jn,
    Zn,
    us,
    ps,
    zn,
    cs,
    ls,
    as,
    qe(xt`
            :host(.disabled),
            :host(.disabled) .control {
                forced-color-adjust: none;
                background: ${Be.ButtonFace};
                border-color: ${Be.GrayText};
                color: ${Be.GrayText};
                cursor: ${"not-allowed"};
                opacity: 1;
            }
            :host(.accent) .control {
                forced-color-adjust: none;
                background: ${Be.Highlight};
                color: ${Be.HighlightText};
            }
    
            :host(.accent) .control:hover {
                background: ${Be.HighlightText};
                border-color: ${Be.Highlight};
                color: ${Be.Highlight};
            }
    
            :host(.accent:${Ue}) .control {
                border-color: ${Be.ButtonText};
                box-shadow: 0 0 0 2px ${Be.HighlightText} inset;
            }
    
            :host(.accent.disabled) .control,
            :host(.accent.disabled) .control:hover {
                background: ${Be.ButtonFace};
                border-color: ${Be.GrayText};
                color: ${Be.GrayText};
            }
            :host(.lightweight) .control:hover {
                forced-color-adjust: none;
                color: ${Be.Highlight};
            }
    
            :host(.lightweight) .control:hover .content::before {
                background: ${Be.Highlight};
            }
    
            :host(.lightweight.disabled) .control {
                forced-color-adjust: none;
                color: ${Be.GrayText};
            }
        
            :host(.lightweight.disabled) .control:hover .content::before {
                background: none;
            }
            :host(.outline.disabled) .control {
                border-color: ${Be.GrayText};
            }
            :host(.stealth) .control {
                forced-color-adjust: none;
                background: none;
                border-color: transparent;
                color: ${Be.ButtonText};
                fill: currentColor;
            }
            :host(.stealth) .control:hover,
            :host(.stealth:${Ue}) .control {
                background: ${Be.Highlight};
                border-color: ${Be.Highlight};
                color: ${Be.HighlightText};
            }
            :host(.stealth.disabled) .control {
                background: none;
                border-color: transparent;
                color: ${Be.GrayText};
            }
        `)
);
let Ps = class extends Ie {};
Ps = t(
    [
        dt({
            name: "fast-button",
            template: Mt,
            styles: Ts,
            shadowOptions: { delegatesFocus: !0 },
        }),
    ],
    Ps
);
const Es = xt`
    ${We("block")} :host {
        --elevation: 4;
        display: block;
        contain: content;
        height: var(--card-height, 100%);
        width: var(--card-width, 100%);
        box-sizing: border-box;
        background: var(--neutral-layer-card);
        border-radius: calc(var(--elevated-corner-radius) * 1px);
        ${fs};
    }
`.withBehaviors(
    hs,
    qe(xt`
            :host {
                forced-color-adjust: none;
                border: calc(var(--outline-width) * 1px) solid ${Be.CanvasText};
                background: ${Be.Canvas};
            }
        `)
);
let As = class extends ze {};
As = t([dt({ name: "fast-card", template: Ne, styles: Es })], As);
const Ss = xt`
    ${We("inline-flex")} :host {
        align-items: center;
        outline: none;
        margin: calc(var(--design-unit) * 1px) 0;
        ${""} user-select: none;
    }

    .control {
        position: relative;
        width: calc((${bs} / 2 + var(--design-unit)) * 1px);
        height: calc((${bs} / 2 + var(--design-unit)) * 1px);
        box-sizing: border-box;
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
        background: var(--neutral-fill-input-rest);
        outline: none;
        cursor: pointer;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .label {
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
        ${""} padding-inline-start: calc(var(--design-unit) * 2px + 2px);
        margin-inline-end: calc(var(--design-unit) * 2px + 2px);
        cursor: pointer;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
    }

    .checked-indicator {
        width: 100%;
        height: 100%;
        display: block;
        fill: var(--neutral-foreground-rest);
        opacity: 0;
        pointer-events: none;
    }

    .indeterminate-indicator {
        border-radius: calc(var(--corner-radius) * 1px);
        background: var(--neutral-foreground-rest);
        position: absolute;
        top: 25%;
        right: 25%;
        bottom: 25%;
        left: 25%;
        opacity: 0;
    }

    :host(:enabled) .control:hover {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-outline-hover);
    }

    :host(:enabled) .control:active {
        background: var(--neutral-fill-input-active);
        border-color: var(--neutral-outline-active);
    }

    :host(:${Ue}) .control {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px var(--neutral-focus);
        border-color: var(--neutral-focus);
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .control,
    :host(.disabled) .control {
        cursor: ${"not-allowed"};
    }

    :host(.checked:not(.indeterminate)) .checked-indicator,
    :host(.indeterminate) .indeterminate-indicator {
        opacity: 1;
    }

    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }
`.withBehaviors(
    is,
    os,
    es,
    us,
    zn,
    cs,
    ls,
    as,
    qe(xt`
            .control, .control:hover, .control:active {
                forced-color-adjust: none;
                border-color: ${Be.FieldText};
                background: ${Be.Field};
            }
            .checked-indicator {
                fill: ${Be.FieldText};
            }
            .indeterminate-indicator {
                background: ${Be.FieldText};
            }
            :host(:${Ue}) .control {
                border-color: ${Be.Highlight};
            }
            :host(.checked:${Ue}) .control {
                border-color: ${Be.FieldText};
                box-shadow: 0 0 0 2px ${Be.Field} inset;
            }
            :host(.checked) .control {
                background: ${Be.Highlight};
                border-color: ${Be.Highlight};
            }
            :host(.checked) .control:hover, .control:active {
                background: ${Be.HighlightText};
            }
            :host(.checked) .checked-indicator {
                fill: ${Be.HighlightText};
            }
            :host(.checked) .control:hover .checked-indicator {
                fill: ${Be.Highlight}
            }
            :host(.checked) .indeterminate-indicator {
                background: ${Be.HighlightText};
            }
            :host(.checked) .control:hover .indeterminate-indicator {
                background: ${Be.Highlight}
            }
            :host(.disabled) {
                opacity: 1;
            }
            :host(.disabled) .control {
                forced-color-adjust: none;
                border-color: ${Be.GrayText};
                background: ${Be.Field};
            }
            :host(.disabled) .indeterminate-indicator,
            :host(.checked.disabled) .control:hover .indeterminate-indicator {
                forced-color-adjust: none;
                background: ${Be.GrayText};
            }
            :host(.disabled) .checked-indicator,
            :host(.checked.disabled) .control:hover .checked-indicator {
                forced-color-adjust: none;
                fill: ${Be.GrayText};
            }
        `)
);
let Hs = class extends _e {};
Hs = t([dt({ name: "fast-checkbox", template: je, styles: Ss })], Hs);
const Os = xt`
    :host([hidden]) {
        display: none;
    }

    :host {
        --elevation: 14;
        --dialog-height: 480px;
        --dialog-width: 640px;
        display: block;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        touch-action: none;
    }

    .positioning-region {
        display: flex;
        justify-content: center;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: auto;
    }

    .root {
        ${fs} margin-top: auto;
        margin-bottom: auto;
        border-radius: calc(var(--elevated-corner-radius));
        width: var(--dialog-width);
        height: var(--dialog-height);
        background: var(--background-color);
        z-index: 1;
    }
`;
let Ls = class extends po {};
Ls = t([dt({ name: "fast-dialog", template: to, styles: Os })], Ls);
const Bs = xt`
    ${We("block")} :host {
        box-sizing: content-box;
        height: 0;
        margin: calc(var(--design-unit) * 1px) 0;
        border: none;
        border-top: calc(var(--outline-width) * 1px) solid var(--neutral-divider-rest);
    }
`.withBehaviors(ds);
let Rs = class extends go {};
Rs = t([dt({ name: "fast-divider", template: vo, styles: Bs })], Rs);
const Ms = xt`
    ${We("inline-flex")} :host {
        width: calc(${bs} * 1px);
        height: calc(${bs} * 1px);
        justify-content: center;
        align-items: center;
        margin: 0;
        position: relative;
        fill: var(--neutral-foreground-rest);
        color: var(--neutral-foreground-rest);
        background: transparent;
        border: none;
        padding: 0;
    }

    :host::before {
        content: "";
        opacity: 0.8;
        background: var(--neutral-fill-stealth-rest);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
        border-radius: 50%;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        transition: all 0.1s ease-in-out;
    }

    .next,
    .previous {
        position: relative;
        ${""} width: 16px;
        height: 16px;
    }

    :host(.disabled) {
        opacity: var(--disabled-opacity);
        cursor: ${"not-allowed"};
    }

    :host(:hover)::before {
        background: var(--neutral-fill-stealth-hover);
        border-color: var(--neutral-outline-hover);
    }

    :host(:${Ue}) {
        outline: none;
    }

    :host(:${Ue})::before {
        box-shadow: 0 0 0 1px var(--neutral-focus) inset;
        border-color: var(--neutral-focus);
    }

    :host(:active)::before {
        background: var(--neutral-fill-stealth-active);
        border-color: var(--neutral-outline-active);
    }

    :host::-moz-focus-inner {
        border: 0;
    }
`.withBehaviors(
    ts,
    Jn,
    Zn,
    us,
    zn,
    cs,
    ls,
    as,
    qe(xt`
            :host {
                background: ${Be.Canvas};
            }
            :host .next,
            :host .previous {
                color: ${Be.ButtonText};
                fill: ${Be.ButtonText};
            }
            :host::before {
                background: ${Be.Canvas};
                border-color: ${Be.ButtonText};
            }
            :host(:hover)::before {
                forced-color-adjust: none;
                background: ${Be.Highlight};
                border-color: ${Be.ButtonText};
                opacity: 1;
            }
            :host(:hover) .next,
            :host(:hover) .previous {
                forced-color-adjust: none;
                color: ${Be.HighlightText};
                fill: ${Be.HighlightText};
            }
            :host(.disabled) {
                opacity: 1;
            }
            :host(.disabled)::before,
            :host(.disabled:hover)::before,
            :host(.disabled) .next,
            :host(.disabled) .previous,
            :host(.disabled:hover) .next,
            :host(.disabled:hover) .previous {
                forced-color-adjust: none;
                background: ${Be.Canvas};
                border-color: ${Be.GrayText};
                color: ${Be.GrayText};
                fill: ${Be.GrayText};
            }
            :host(:${Ue})::before {
                forced-color-adjust: none;
                box-shadow: 0 0 0 2px ${Be.ButtonText};
            }
        `)
);
let Is = class extends mo {};
Is = t([dt({ name: "fast-flipper", template: yo, styles: Ms })], Is);
const Ns = xt`
    ${We("flex")} :host {
        align-items: center;
        outline: none;
        height: calc(var(--design-unit) * 1px);
        margin: calc(var(--design-unit) * 1px) 0;
    }

    .progress {
        background-color: var(--neutral-fill-rest);
        border-radius: calc(var(--design-unit) * 1px);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        position: relative;
    }

    .determinate {
        background-color: var(--accent-fill-rest);
        border-radius: calc(var(--design-unit) * 1px);
        height: 100%;
        transition: all 0.2s ease-in-out;
        display: flex;
    }

    .indeterminate {
        height: 100%;
        border-radius: calc(var(--design-unit) * 1px);
        display: flex;
        width: 100%;
        position: relative;
        overflow: hidden;
    }

    .indeterminate-indicator-1 {
        position: absolute;
        opacity: 0;
        height: 100%;
        background-color: var(--accent-fill-rest);
        border-radius: calc(var(--design-unit) * 1px);
        animation-timing-function: cubic-bezier(0.4, 0.0, 0.6, 1.0);
        width: 40%;
        animation: indeterminate-1 2s infinite;
    }

    .indeterminate-indicator-2 {
        position: absolute;
        opacity: 0;
        height: 100%;
        background-color: var(--accent-fill-rest);
        border-radius: calc(var(--design-unit) * 1px);
        animation-timing-function: cubic-bezier(0.4, 0.0, 0.6, 1.0);
        width: 60%;
        animation: indeterminate-2 2s infinite;
    }

    :host(.paused) .indeterminate-indicator-1, :host(.paused) .indeterminate-indicator-2 {
        animation-play-state: paused;
        background-color: var(--neutral-fill-rest);
    }

    :host(.paused) .determinate {
        background-color: var(--neutral-foreground-hint);
    }

    @keyframes indeterminate-1 {
        0% {
            opacity: 1;
            transform: translateX(-100%);
        }
        70% {
            opacity: 1;
            transform: translateX(300%);
        }
        70.01% {
            opacity: 0;
        }
        100% {
            opacity: 0;
            transform: translateX(300%);
        },
    }

    @keyframes indeterminate-2 {
        0% {
            opacity: 0;
            transform: translateX(-150%);
        }
        29.99% {
            opacity: 0;
        }
        30% {
            opacity: 1;
            transform: translateX(-150%);
        }
        100% {
            transform: translateX(166.66%);
            opacity: 1;
        },
    },
`.withBehaviors(
    rs,
    Kn,
    Vn,
    qe(xt`
            .indeterminate-indicator-1,
            .indeterminate-indicator-2,
            .determinate {
                forced-color-adjust: none;
                background-color: ${Be.FieldText};
            }
            .progress {
                background-color: ${Be.Field};
                border: calc(var(--outline-width) * 1px) solid ${Be.FieldText};
            }
            :host(.paused) .indeterminate-indicator-1,
            .indeterminate-indicator-2 {
                background-color: ${Be.Field};
            }
            :host(.paused) .determinate {
                background-color: ${Be.GrayText};
            }
        `)
);
let zs = class extends xo {};
zs = t([dt({ name: "fast-progress", template: ko, styles: Ns })], zs);
const js = xt`
    ${We("flex")} :host {
        align-items: center;
        outline: none;
        height: calc(${bs} * 1px);
        width: calc(${bs} * 1px);
        margin: calc(${bs} * 1px) 0;
    }

    .progress {
        height: 100%;
        width: 100%;
    }

    .background {
        stroke: var(--neutral-fill-rest);
        fill: none;
        stroke-width: 2px;
    }

    .determinate {
        stroke: var(--accent-fill-rest);
        fill: none;
        stroke-width: 2px;
        stroke-linecap: round;
        transform-origin: 50% 50%;
        transform: rotate(-90deg);
        transition: all 0.2s ease-in-out;
    }

    .indeterminate-indicator-1 {
        stroke: var(--accent-fill-rest);
        fill: none;
        stroke-width: 2px;
        stroke-linecap: round;
        transform-origin: 50% 50%;
        transform: rotate(-90deg);
        transition: all 0.2s ease-in-out;
        animation: spin-infinite 2s linear infinite;
    }

    :host(.paused) .indeterminate-indicator-1 {
        animation-play-state: paused;
        stroke: var(--neutral-fill-rest);
    }

    :host(.paused) .determinate {
        stroke: var(--neutral-foreground-hint);
    }

    @keyframes spin-infinite {
        0% {
            stroke-dasharray: 0.01px 43.97px;
            transform: rotate(0deg);
        }
        50% {
            stroke-dasharray: 21.99px 21.99px;
            transform: rotate(450deg);
        }
        100% {
            stroke-dasharray: 0.01px 43.97px;
            transform: rotate(1080deg);
        }
    }
`.withBehaviors(
    rs,
    Kn,
    Vn,
    qe(xt`
            .indeterminate-indicator-1,
            .determinate {
                stroke: ${Be.FieldText};
            }
            .background {
                stroke: ${Be.Field};
            }
            :host(.paused) .indeterminate-indicator-1 {
                stroke: ${Be.Field};
            }
            :host(.paused) .determinate {
                stroke: ${Be.GrayText};
            }
        `)
);
let _s = class extends xo {};
_s = t([dt({ name: "fast-progress-ring", template: Co, styles: js })], _s);
const Vs = xt`
    ${We("inline-flex")} :host {
        --input-size: calc((${bs} / 2) + var(--design-unit));
        align-items: center;
        outline: none;
        margin: calc(var(--design-unit) * 1px) 0;
        ${""} user-select: none;
        position: relative;
        flex-direction: row;
        transition: all 0.2s ease-in-out;
    }

    .control {
        position: relative;
        width: calc(var(--input-size) * 1px);
        height: calc(var(--input-size) * 1px);
        box-sizing: border-box;
        border-radius: 50%;
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
        background: var(--neutral-fill-input-rest);
        outline: none;
        cursor: pointer;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .label {
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
        ${""} padding-inline-start: calc(var(--design-unit) * 2px + 2px);
        margin-inline-end: calc(var(--design-unit) * 2px + 2px);
        cursor: pointer;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
    }

    .checked-indicator {
        position: absolute;
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        border-radius: 50%;
        display: inline-block;
        flex-shrink: 0;
        background: var(--neutral-foreground-rest);
        fill: var(--neutral-foreground-rest);
        opacity: 0;
        pointer-events: none;
    }

    :host(:enabled) .control:hover{
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-outline-hover);
    }

    :host(:enabled) .control:active {
        background: var(--neutral-fill-input-active);
        border-color: var(--neutral-outline-active);
    }

    :host(:${Ue}) .control {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px var(--neutral-focus);
        border-color: var(--neutral-focus);
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .control,
    :host(.disabled) .control {
        cursor: ${"not-allowed"};
    }

    :host(.checked) .checked-indicator {
        opacity: 1;
    }

    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }
`.withBehaviors(
    Qn,
    os,
    es,
    us,
    zn,
    cs,
    ls,
    as,
    qe(xt`
            .control, .control:hover, .control:active {
                forced-color-adjust: none;
                border-color: ${Be.FieldText};
                background: ${Be.Field};
            }
            :host(:${Ue}) .control {
                border-color: ${Be.Highlight};
            }
            :host(.checked) .control:hover, .control:active {
                border-color: ${Be.Highlight};
                background: ${Be.Highlight};
            }
            :host(.checked) .checked-indicator {
                background: ${Be.Highlight};
                fill: ${Be.Highlight};
            }
            :host(.checked) .control:hover .checked-indicator {
                background: ${Be.HighlightText};
                fill: ${Be.HighlightText};
            }
            :host(.disabled) {
                forced-color-adjust: none;
                opacity: 1;
            }
            :host(.disabled) .label {
                color: ${Be.GrayText};
            }
            :host(.disabled) .control,
            :host(.checked.disabled) .control:hover, .control:active {
                background: ${Be.Field};
                border-color: ${Be.GrayText};
            }
            :host(.disabled) .checked-indicator,
            :host(.checked.disabled) .control:hover .checked-indicator {
                fill: ${Be.GrayText};
                background: ${Be.GrayText};
            }
        `)
);
let Gs = class extends $o {};
Gs = t([dt({ name: "fast-radio", template: wo, styles: Vs })], Gs);
const qs = xt`
    ${We("flex")} :host {
        align-items: flex-start;
        margin: calc(var(--design-unit) * 1px) 0;
        flex-direction: column;
    }

    .positioning-region {
        display: flex;
        flex-wrap: wrap;
    }
`;
let Ws = class extends Do {};
Ws = t([dt({ name: "fast-radio-group", template: Fo, styles: qs })], Ws);
const Us = xt`
    :host([hidden]) {
        display: none;
    }

    ${We("inline-grid")} :host {
        --thumb-size: calc(${bs} * 0.5);
        --thumb-translate: calc(var(--thumb-size) * 0.5);
        --track-overhang: calc((var(--design-unit) / 2) * -1);
        align-items: center;
        width: 100%;
        margin: calc(var(--design-unit) * 1px) 0;
        user-select: none;
        box-sizing: border-box;
        border-radius: calc(var(--corner-radius) * 1px);
        outline: none;
        cursor: pointer;
    }
    :host(.horizontal) .positioning-region {
        position: relative;
        margin: 0 8px;
        display: grid;
        grid-template-rows: calc(var(--thumb-size) * 1px) 1fr;
    }
    :host(.vertical) .positioning-region {
        position: relative;
        margin: 0 8px;
        display: grid;
        height: 100%;
        grid-template-columns: calc(var(--thumb-size) * 1px) 1fr;
    }
    :host(:${Ue}) .thumb-cursor {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px var(--neutral-focus);
    }
    .thumb-container {
        position: absolute;
        height: calc(var(--thumb-size) * 1px);
        width: calc(var(--thumb-size) * 1px);
        transition: "all 0.2s ease";
    }
    .thumb-cursor {
        border: none;
        width: calc(var(--thumb-size) * 1px);
        height: calc(var(--thumb-size) * 1px);
        background: var(--neutral-foreground-rest);
        border-radius: 50%;
    }
    .thumb-cursor:hover {
        background: var(--neutral-foreground-hover);
        border-color: var(--neutral-outline-hover);
    }
    .thumb-cursor:active {
        background: var(--neutral-foreground-active);
    }
    :host(.horizontal) .thumb-container {
        transform: translateX(calc(var(--thumb-translate) * 1px));
    }
    :host(.vertical) .thumb-container {
        transform: translateY(calc(var(--thumb-translate) * 1px));
    }
    :host(.horizontal) {
        min-width: calc(var(--design-unit) * 60px);
    }
    :host(.horizontal) .track {
        right: calc(var(--track-overhang) * 1px);
        left: calc(var(--track-overhang) * 1px);
        align-self: start;
        margin-top: 6px;
        height: 4px;
    }
    :host(.vertical) .track {
        top: calc(var(--track-overhang) * 1px);
        bottom: calc(var(--track-overhang) * 1px);
        justify-self: start;
        margin-left: 6px;
        width: 4px;
        height: 100%;
    }
    .track {
        background: var(--neutral-outline-rest);
        position: absolute;
    }
    :host(.vertical) {
        height: 100%;
        min-height: calc(var(--design-unit) * 60px);
        min-width: calc(var(--design-unit) * 20px);
    }
    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .slider,
    :host(.disabled) .slider {
        cursor: ${"not-allowed"};
    }
    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }
`.withBehaviors(
    us,
    _n,
    jn,
    zn,
    ls,
    as,
    qe(xt`
            .thumb-cursor {
                forced-color-adjust: none;
                border-color: ${Be.FieldText};
                background: ${Be.FieldText};
            }
            .thumb-cursor:hover,
            .thumb-cursor:active {
                background: ${Be.Highlight};
            }
            .track {
                forced-color-adjust: none;
                background: ${Be.FieldText};
            }
            :host(:${Ue}) .thumb-cursor {
                border-color: ${Be.Highlight};
            }
            :host(.disabled) {
                opacity: 1;
                cursor: ${"not-allowed"};
            }
            :host(.disabled) .slider,
            :host(.disabled) .track,
            :host(.disabled) .thumb-cursor {
                forced-color-adjust: none;
                background: ${Be.GrayText};
            }
        `)
);
let Ks = class extends Ao {};
Ks = t([dt({ name: "fast-slider", template: To, styles: Us })], Ks);
const Xs = xt`
    ${We("block")} :host {
    }
    .root {
        position: absolute;
        display: grid;
    }
    :host(.horizontal) {
        align-self: start;
        grid-row: 2;
        margin-top: -2px;
    }
    :host(.vertical) {
        justify-self: start;
        grid-column: 2;
        margin-left: 2px;
    }
    .container {
        display: grid;
        justify-self: center;
    }
    :host(.horizontal) .container {
        grid-template-rows: auto auto;
        grid-template-columns: 0;
    }
    :host(.vertical) .container {
        grid-template-columns: auto auto;
        grid-template-rows: 0;
        min-width: calc(var(--thumb-size) * 1px);
        height: calc(var(--thumb-size) * 1px);
    }
    .label {
        justify-self: center;
        align-self: center;
        white-space: nowrap;
        justify-self: center;
        max-width: 30px;
        margin: 2px 0;
    }
    .mark {
        width: calc((var(--design-unit) / 2) * 1px);
        height: calc(${bs} * 0.25 * 1px);
        background: var(--neutral-outline-rest);
        justify-self: center;
    }
    :host(.vertical) .mark {
        transform: rotate(90deg);
        align-self: center;
    }
    :host(.vertical) .label {
        margin-left: calc((var(--design-unit) / 2) * 2px);
        align-self: center;
    }
    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }
`.withBehaviors(
    as,
    qe(xt`
            .mark {
                forced-color-adjust: none;
                background: ${Be.FieldText};
            }
            :host(.disabled) {
                forced-color-adjust: none;
                opacity: 1;
            }
            :host(.disabled) .label {
                color: ${Be.GrayText};
            }
            :host(.disabled) .mark {
                background: ${Be.GrayText};
            }
        `)
);
let Qs = class extends Oo {};
Qs = t([dt({ name: "fast-slider-label", template: So, styles: Xs })], Qs);
const Ys = xt`
    :host([hidden]) {
        display: none;
    }

    ${We("inline-flex")} :host {
        align-items: center;
        outline: none;
        font-family: var(--body-font);
        margin: calc(var(--design-unit) * 1px) 0;
        ${""} user-select: none;
    }

    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .switch,
    :host(.disabled) .switch {
        cursor: ${"not-allowed"};
    }

    .switch {
        position: relative;
        outline: none;
        box-sizing: border-box;
        width: calc(((${bs} / 2) + var(--design-unit)) * 2px);
        height: calc(((${bs} / 2) + var(--design-unit)) * 1px);
        background: var(--neutral-fill-input-rest);
        border-radius: calc(${bs} * 1px);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
    }

    :host(:enabled) .switch:hover {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-outline-hover);
        cursor: pointer;
    }

    :host(:enabled) .switch:active {
        background: var(--neutral-fill-input-active);
        border-color: var(--neutral-outline-active);
    }

    :host(:${Ue}) .switch {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px var(--neutral-focus);
        border-color: var(--neutral-focus);
    }

    .checked-indicator {
        position: absolute;
        height: calc((${bs} - (var(--design-unit) * 5.5)) * 1px);
        width: calc((${bs} - (var(--design-unit) * 5.5)) * 1px);
        top: calc(var(--design-unit) * 1px);
        left: calc(var(--design-unit) * 1px);
        background: var(--neutral-foreground-rest);
        border-radius: 50%;
        transition: all 0.2s ease-in-out;
    }

    .status-message {
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .label {
        color: var(--neutral-foreground-rest);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
    }

    ::slotted(*) {
        ${""} margin-inline-start: calc(var(--design-unit) * 2px + 2px);
    }

    :host(.checked) .checked-indicator {
        left: calc((((${bs} / 2) + var(--design-unit)) + var(--design-unit)) * 1px);
        background: var(--accent-foreground-cut-rest);
    }

    :host(.checked) .switch {
        background: var(--accent-fill-rest);
    }

    :host(.checked:enabled) .switch:hover {
        background: var(--accent-fill-hover);
    }

    :host(.checked:enabled) .switch:active {
        background: var(--accent-fill-active);
    }

    :host(.checked:${Ue}:enabled) .switch {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px var(--neutral-focus);
        border-color: transparent;
    }

    .unchecked-message {
        display: block;
    }

    .checked-message {
        display: none;
    }

    :host(.checked) .unchecked-message {
        display: none;
    }

    :host(.checked) .checked-message {
        display: block;
    }
`.withBehaviors(
    ss,
    ns,
    rs,
    Un,
    is,
    os,
    es,
    us,
    zn,
    cs,
    ls,
    as,
    qe(xt`
            .checked-indicator {
                forced-color-adjust: none;
                background: ${Be.FieldText};
            }
            .switch, .switch:hover, .switch:active {
                forced-color-adjust: none;
                background: ${Be.Field};
                border-color: ${Be.FieldText};
            }
            :host(.checked) .switch {
                background: ${Be.Highlight};
                border-color: ${Be.Highlight};
            }
            :host(.checked) .checked-indicator {
                background: ${Be.HighlightText};
            }
            :host(.disabled) {
                opacity: 1;
            }
            :host(:${Ue}) .switch {
                border-color: ${Be.Highlight};
            }
            :host(.checked:${Ue}) .switch {
                border-color: ${Be.FieldText};
                box-shadow: 0 0 0 2px ${Be.Field} inset;
            }
            :host(.disabled) .checked-indicator {
                background: ${Be.GrayText};
            }
            :host(.disabled) .switch {
                background: ${Be.Field};
                border-color: ${Be.GrayText};
            }
        `)
);
let Zs = class extends Bo {};
Zs = t([dt({ name: "fast-switch", template: Lo, styles: Ys })], Zs);
const Js = xt`
    ${We("grid")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        color: var(--neutral-foreground-rest);
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto 1fr;
    }

    .tablist {
        display: grid;
        grid-template-rows: auto auto;
        grid-template-columns: auto;
        position: relative;
        width: max-content;
        align-self: end;
    }

    .start {
        padding: 2px;
    }

    .end {
        padding: 2px;
    }

    .activeIndicator {
        grid-row: 2;
        grid-column: 1;
        width: 20px;
        height: 3px;
        border-radius: calc(var(--corner-radius) * 1px);
        justify-self: center;
        background: var(--accent-fill-rest);
    }

    .activeIndicatorTransition {
        transition: transform 0.2s ease-in-out;
    }

    .tabpanel {
        grid-row: 2;
        grid-column-start: 1;
        grid-column-end: 4;
        position: relative;
    }

    :host(.vertical) {
        grid-template-rows: auto 1fr auto;
        grid-template-columns: auto 1fr;
    }

    :host(.vertical) .tablist {
        grid-row-start: 2;
        grid-row-end: 2;
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: auto 1fr;
        position: relative;
        width: max-content;
        justify-self: end;
        width: 100%;
    }

    :host(.vertical) .tabpanel {
        grid-column: 2;
        grid-row-start: 1;
        grid-row-end: 4;
    }

    :host(.vertical) .end {
        grid-row: 3;
    }

    :host(.vertical) .activeIndicator {
        grid-column: 1;
        grid-row: 1;
        width: 3px;
        height: 20px;
        border-radius: calc(var(--corner-radius) * 1px);
        align-self: center;
        background: var(--accent-fill-rest);
    }

    :host(.vertical) .activeIndicatorTransition {
        transition: transform 0.2s linear;
    }
`.withBehaviors(
        rs,
        zn,
        qe(xt`
            .activeIndicator,
            :host(.vertical) .activeIndicator {
                forced-color-adjust: none;
                background: ${Be.Highlight};
            }
        `)
    ),
    ta = xt`
    ${We("inline-flex")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        ${""} font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        height: calc(${bs} * 1px);
        padding: 0 calc((6 + (var(--design-unit) * 2 * var(--density))) * 1px);
        color: var(--neutral-foreground-rest);
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid transparent;
        align-items: center;
        justify-content: center;
        grid-row: 1;
    }

    :host([aria-selected="true"]) {
        z-index: 2;
    }

    :host(:hover) {
        color: var(--neutral-foreground-hover);
    }

    :host(:active) {
        color: var(--neutral-foreground-active);
    }

    :host(:${Ue}) {
        outline: none;
        border: calc(var(--outline-width) * 1px) solid var(--neutral-focus);
        box-shadow: 0 0 0 calc((var(--focus-outline-width) - var(--outline-width)) * 1px)
            var(--neutral-focus);
    }

    :host(:focus) {
        outline: none;
    }

    :host(.vertical) {
        justify-content: end;
        grid-column: 2
    }

    :host(.vertical[aria-selected="true"]) {
        z-index: 2;
    }

    :host(.vertical:hover) {
        color: var(--neutral-foreground-hover);
    }

    :host(.vertical:active) {
        color: var(--neutral-foreground-active);
    }

    :host(.vertical:hover[aria-selected="true"]) {
    }
`.withBehaviors(
        us,
        zn,
        jn,
        _n,
        qe(xt`
            :host {
                forced-color-adjust: none;
                border-color: transparent;
                color: ${Be.ButtonText};
            }
            :host(:hover),
            :host(.vertical:hover) {
                color: ${Be.ButtonText};
            }
            :host(:${Ue}) {
                border-color: ${Be.ButtonText};
                box-shadow: none;
            }
        `)
    );
let ea = class extends zo {};
ea = t([dt({ name: "fast-tab", template: No, styles: ta })], ea);
const oa = xt`
    ${We("flex")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        ${""} font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        padding: 0 calc((6 + (var(--design-unit) * 2 * var(--density))) * 1px);
    }
`;
let ia = class extends _o {};
ia = t([dt({ name: "fast-tab-panel", template: jo, styles: oa })], ia);
let ra = class extends Io {};
ra = t([dt({ name: "fast-tabs", template: Ro, styles: Js })], ra);
const na = xt`
    ${We("inline-block")} :host {
        font-family: var(--body-font);
        outline: none;
        user-select: none;
    }

    .control {
        box-sizing: border-box;
        position: relative;
        color: var(--neutral-foreground-rest);
        background: var(--neutral-fill-input-rest);
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
        height: calc(${bs} * 2px);
        font: inherit;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        padding: calc(var(--design-unit) * 1.5px) calc(var(--design-unit) * 2px + 1px);
        max-width: 100%;
        resize: none;
    }

    .control:hover:enabled {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-outline-hover);
    }

    .control:hover,
    .control:${Ue},
    .control:disabled,
    .control:active {
        outline: none;
    }

    :host(:focus-within) .control {
        border-color: var(--neutral-focus);
        box-shadow: 0 0 0 1px var(--neutral-focus) inset;
    }

    :host(.filled) .control {
        background: var(--neutral-fill-rest);
        border-color: transparent;
    }

    :host(.filled:hover:not([disabled])) .control {
        background: var(--neutral-fill-hover);
        border-color: transparent;
    }

    :host(.resize-both) .control {
        resize: both;
    }

    :host(.resize-horizontal) .control {
        resize: horizontal;
    }

    :host(.resize-vertical) .control {
        resize: vertical;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .label {
        display: block;
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        $font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        margin-bottom: 4px;
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: ${"not-allowed"};
    }
    :host([disabled]) {
        opacity: var(--disabled-opacity);
    }
`.withBehaviors(
    Xn,
    os,
    es,
    Kn,
    us,
    zn,
    ls,
    as,
    qe(xt`
            :host([disabled]) {
                opacity: 1;
            }
        `)
);
let sa = class extends qo {};
sa = t([dt({ name: "fast-text-area", template: Wo, styles: na })], sa);
const aa = xt`
    ${We("inline-block")} :host {
        font-family: var(--body-font);
        outline: none;
        user-select: none;
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        color: var(--neutral-foreground-rest);
        background: var(--neutral-fill-input-rest);
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
        height: calc(${bs} * 1px);
    }

    .control {
        -webkit-appearance: none;
        background: transparent;
        border: 0;
        height: calc(100% - 4px);
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 0 calc(var(--design-unit) * 2px + 1px);
        color: var(--neutral-foreground-rest);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
    }

    .control:hover,
    .control:${Ue},
    .control:disabled,
    .control:active {
        outline: none;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .label {
        display: block;
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        margin-bottom: 4px;
    }

    .before-content,
    .after-content {
        ${""} width: 16px;
        height: 16px;
        margin: auto;
        fill: var(--neutral-foreground-rest);
    }

    .before-content {
        margin-inline-start: 11px;
    }

    .after-content {
        margin-inline-end: 11px;
    }

    :host(:hover:not(.disabled)) .root {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-outline-hover);
    }

    :host(:focus-within:not(.disabled)) .root {
        border-color: var(--neutral-focus);
        box-shadow: 0 0 0 1px var(--neutral-focus) inset;
    }

    :host(.filled) .root {
        background: var(--neutral-fill-rest);
        border-color: transparent;
    }

    :host(.filled:hover:not(.disabled)) .root {
        background: var(--neutral-fill-hover);
        border-color: transparent;
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .control,
    :host(.disabled) .control {
        cursor: ${"not-allowed"};
    }

    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }
`.withBehaviors(
    Xn,
    os,
    es,
    Kn,
    us,
    zn,
    ls,
    as,
    qe(xt`
            .root,
            :host(.filled) .root {
                forced-color-adjust: none;
                background: ${Be.Field};
                border-color: ${Be.FieldText};
            }
            :host(:hover:not(.disabled)) .root,
            :host(.filled:hover:not(.disabled)) .root,
            :host(.filled:hover) .root {
                background: ${Be.Field};
                border-color: ${Be.Highlight};
            }
            .before-content,
            .after-content {
                fill: ${Be.ButtonText};
            }
            :host(.disabled) {
                opacity: 1;
            }
            :host(.disabled) .root,
            :host(.filled:hover.disabled) .root {
                border-color: ${Be.GrayText};
                background: ${Be.Field};
            }
            :host(:focus-within) .root {
                border-color: ${Be.Highlight};
                box-shadow: 0 0 0 1px ${Be.Highlight} inset;
            }
        `)
);
let la = class extends Qo {};
la = t(
    [
        dt({
            name: "fast-text-field",
            template: Uo,
            styles: aa,
            shadowOptions: { delegatesFocus: !0 },
        }),
    ],
    la
);
export {
    $s as FASTAnchor,
    Ds as FASTBadge,
    Ps as FASTButton,
    As as FASTCard,
    Hs as FASTCheckbox,
    In as FASTDesignSystemProvider,
    Ls as FASTDialog,
    Rs as FASTDivider,
    Is as FASTFlipper,
    zs as FASTProgress,
    _s as FASTProgressRing,
    Gs as FASTRadio,
    Ws as FASTRadioGroup,
    Ks as FASTSlider,
    Qs as FASTSliderLabel,
    Zs as FASTSwitch,
    ea as FASTTab,
    ia as FASTTabPanel,
    ra as FASTTabs,
    sa as FASTTextArea,
    la as FASTTextField,
};
