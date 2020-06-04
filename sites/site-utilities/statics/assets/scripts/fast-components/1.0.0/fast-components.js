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
function t(t, e, o, r) {
    var i,
        n = arguments.length,
        s = n < 3 ? e : null === r ? (r = Object.getOwnPropertyDescriptor(e, o)) : r;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
        s = Reflect.decorate(t, e, o, r);
    else
        for (var a = t.length - 1; a >= 0; a--)
            (i = t[a]) && (s = (n < 3 ? i(s) : n > 3 ? i(e, o, s) : i(e, o)) || s);
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
const r = globalThis.trustedTypes.createPolicy("fast-html", { createHTML: t => t });
let i = r;
function n() {
    let t = 0;
    for (; t < o.length; ) {
        if ((o[t].call(), t++, t > 1024)) {
            for (let e = 0, r = o.length - t; e < r; e++) o[e] = o[e + t];
            (o.length -= t), (t = 0);
        }
    }
    o.length = 0;
}
const s = Object.freeze({
    setHTMLPolicy(t) {
        if (i !== r) throw new Error("The HTML policy can only be set once.");
        i = t;
    },
    createHTML: t => i.createHTML(t),
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
    for (let r = 0, i = e.length; r < i; ++r) e[r].handleChange(o, t);
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
            r = this.source;
        void 0 !== e && e.handleChange(r, t), void 0 !== o && o.handleChange(r, t);
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
    f = new WeakMap();
let v = void 0;
class b {
    constructor(t, e) {
        (this.name = t),
            (this.field = "_" + t),
            (this.callback = t + "Changed"),
            (this.hasCallback = this.callback in e);
    }
    getValue(t) {
        return void 0 !== v && v.observe(t, this.name), t[this.field];
    }
    setValue(t, e) {
        const o = this.field,
            r = t[o];
        r !== e &&
            ((t[o] = e),
            this.hasCallback && t[this.callback](r, e),
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
            void 0 !== v && v.observe(t, e);
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
            let e = f.get(t);
            if (void 0 === e) {
                let o = Reflect.getPrototypeOf(t);
                for (; void 0 === e && null !== o; )
                    (e = f.get(o)), (o = Reflect.getPrototypeOf(o));
                (e = void 0 === e ? [] : e.slice(0)), f.set(t, e);
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
function w(t) {
    k = t;
}
class C {
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
g.defineProperty(C.prototype, "index"), g.defineProperty(C.prototype, "length");
const $ = new C();
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
            (v = this.needsRefresh ? this : void 0),
            (this.needsRefresh = !1);
        const o = this.expression(t, e);
        return (v = void 0), o;
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
            r = m(t),
            i = null === o ? this.first : {};
        if (
            ((i.source = t),
            (i.propertyName = e),
            (i.notifier = r),
            r.subscribe(this, e),
            null !== o)
        ) {
            if (!this.needsRefresh) {
                v = void 0;
                const e = o.source[o.propertyName];
                (v = this), t === e && (this.needsRefresh = !0);
            }
            o.next = i;
        }
        this.last = i;
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
class P extends D {
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
function T(t, e) {
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
function O(t) {
    s.setAttribute(this.target, this.targetName, t);
}
function H(t) {
    s.setBooleanAttribute(this.target, this.targetName, t);
}
function M(t) {
    this.target.textContent = t;
}
function B(t) {
    this.target[this.targetName] = t;
}
function L(t) {
    const e = this.classVersions || Object.create(null),
        o = this.target;
    let r = this.version || 0;
    if (null != t && t.length) {
        const i = t.split(/\s+/);
        for (let t = 0, n = i.length; t < n; ++t) {
            const n = i[t];
            "" !== n && ((e[n] = r), o.classList.add(n));
        }
    }
    if (((this.classVersions = e), (this.version = r + 1), 0 !== r)) {
        r -= 1;
        for (const t in e) e[t] === r && o.classList.remove(t);
    }
}
class R extends D {
    constructor(t) {
        super(),
            (this.expression = t),
            (this.createPlaceholder = s.createInterpolationPlaceholder),
            (this.bind = T),
            (this.unbind = A),
            (this.updateTarget = O);
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
                    (this.cleanedTargetName = t.substr(1)), (this.updateTarget = H);
                    break;
                case "@":
                    (this.cleanedTargetName = t.substr(1)),
                        (this.bind = E),
                        (this.unbind = S);
                    break;
                default:
                    (this.cleanedTargetName = t),
                        "class" === t && (this.updateTarget = L);
            }
    }
    targetAtContent() {
        this.updateTarget = M;
    }
    createBehavior(t) {
        return new N(
            t,
            this.expression,
            this.bind,
            this.unbind,
            this.updateTarget,
            this.cleanedTargetName
        );
    }
}
class N {
    constructor(t, e, o, r, i, n) {
        (this.target = t),
            (this.expression = e),
            (this.bind = o),
            (this.unbind = r),
            (this.updateTarget = i),
            (this.targetName = n),
            (this.source = null),
            (this.context = null),
            (this.observableExpression = null);
    }
    handleExpressionChange() {
        this.updateTarget(this.observableExpression.evaluate(this.source, this.context));
    }
    handleEvent(t) {
        w(t);
        const e = this.expression(this.source, this.context);
        w(null), !0 !== e && t.preventDefault();
    }
}
const I = { locatedDirectives: 0, targetIndex: -1 };
function z(t) {
    let e;
    const o = t.length,
        r = t.map(t =>
            "string" == typeof t
                ? () => t
                : ((e = t.targetName || e), I.locatedDirectives++, t.expression)
        ),
        i = new R((t, e) => {
            let i = "";
            for (let n = 0; n < o; ++n) i += r[n](t, e);
            return i;
        });
    return (i.targetName = e), i;
}
function j(t, e) {
    let o = t.indexOf("@{", 0);
    const r = t.length;
    let i,
        n,
        s,
        a = 0,
        l = 0,
        c = null,
        d = 0;
    for (; o >= 0 && o < r - 2; ) {
        (l = 1), (n = o), (o += 2);
        do {
            (i = t[o]),
                o++,
                "'" !== i && '"' !== i
                    ? "\\" !== i
                        ? null === c && ("{" === i ? l++ : "}" === i && l--)
                        : o++
                    : null === c
                    ? (c = i)
                    : c === i && (c = null);
        } while (l > 0 && o < r);
        if (0 !== l) break;
        if (((s = s || []), "\\" === t[n - 1] && "\\" !== t[n - 2]))
            (s[d] = t.substring(a, n - 1) + t.substring(n, o)), d++;
        else {
            (s[d] = t.substring(a, n)), d++;
            const r = e[parseInt(t.substring(n + 2, o - 1))];
            (s[d] = r), d++;
        }
        (a = o), (o = t.indexOf("@{", o));
    }
    return 0 === d
        ? null
        : ((s[d] = t.substr(a)), (s = s.filter(t => "" !== t)), 1 == s.length ? s[0] : s);
}
function _(t, e, o, r = !1) {
    const i = t.attributes;
    for (let n = 0, s = i.length; n < s; ++n) {
        const a = i[n],
            l = a.value;
        let c = j(l, e);
        null === c
            ? r && ((c = new R(() => l)), (c.targetName = a.name))
            : Array.isArray(c)
            ? (c = z(c))
            : I.locatedDirectives++,
            null !== c &&
                (t.removeAttributeNode(a),
                n--,
                s--,
                (c.targetIndex = I.targetIndex),
                o.push(c));
    }
}
function V(t, e) {
    t.targetAtContent(),
        (t.targetIndex = I.targetIndex),
        e.push(t),
        I.locatedDirectives++;
}
function G(t, e, o, r) {
    const i = j(t.textContent, e);
    if (null !== i)
        if (Array.isArray(i)) {
            let e = t;
            for (let n = 0, s = i.length; n < s; ++n) {
                const s = i[n],
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
                    I.targetIndex++,
                    a !== t && r.nextNode();
            }
            I.targetIndex--;
        } else (t.textContent = " "), V(i, o);
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
            let r,
                i = this.firstChild;
            for (; i !== o; ) (r = i.nextSibling), e.insertBefore(i, t), (i = r);
            e.insertBefore(o, t);
        }
    }
    remove() {
        const t = this.fragment,
            e = this.lastChild;
        let o,
            r = this.firstChild;
        for (; r !== e; ) (o = r.nextSibling), t.appendChild(r), (r = o);
        t.appendChild(e);
    }
    dispose() {
        const t = this.firstChild.parentNode,
            e = this.lastChild;
        let o,
            r = this.firstChild;
        for (; r !== e; ) (o = r.nextSibling), t.removeChild(r), (r = o);
        t.removeChild(e);
        const i = this.behaviors,
            n = this.source;
        for (let t = 0, e = i.length; t < e; ++t) i[t].unbind(n);
    }
    bind(t, e) {
        const o = this.behaviors;
        if (this.source !== t)
            if (void 0 !== this.source) {
                const r = this.source;
                (this.source = t), (this.context = e);
                for (let i = 0, n = o.length; i < n; ++i) {
                    const n = o[i];
                    n.unbind(r), n.bind(t, e);
                }
            } else {
                (this.source = t), (this.context = e);
                for (let r = 0, i = o.length; r < i; ++r) o[r].bind(t, e);
            }
    }
    unbind() {
        if (void 0 === this.source) return;
        const t = this.behaviors,
            e = this.source;
        for (let o = 0, r = t.length; o < r; ++o) t[o].unbind(e);
        this.source = void 0;
    }
    static disposeContiguousBatch(t) {
        if (0 !== t.length) {
            q.setStart(t[0].firstChild, 0),
                q.setEnd(t[t.length - 1].lastChild, 0),
                q.deleteContents();
            for (let e = 0, o = t.length; e < o; ++e) {
                const o = t[e],
                    r = o.behaviors,
                    i = o.source;
                for (let t = 0, e = r.length; t < e; ++t) r[t].unbind(i);
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
                (I.locatedDirectives = 0), _(t, e, o, !0);
                const r = t.content,
                    i = [],
                    n = e.length,
                    a = document.createTreeWalker(r, 133, null, !1);
                for (I.targetIndex = -1; I.locatedDirectives < n; ) {
                    const t = a.nextNode();
                    if (null === t) break;
                    switch ((I.targetIndex++, t.nodeType)) {
                        case 1:
                            _(t, e, i);
                            break;
                        case 3:
                            G(t, e, i, a);
                            break;
                        case 8:
                            if (s.isMarker(t)) {
                                const o = e[s.extractDirectiveIndexFromMarker(t)];
                                (o.targetIndex = I.targetIndex),
                                    I.locatedDirectives++,
                                    i.push(o);
                            } else t.parentNode.removeChild(t), I.targetIndex--;
                    }
                }
                let l = 0;
                return (
                    s.isMarker(r.firstChild) &&
                        (r.insertBefore(document.createComment(""), r.firstChild),
                        (l = -1)),
                    {
                        fragment: r,
                        viewBehaviorFactories: i,
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
            r = new Array(this.behaviorCount),
            i = document.createTreeWalker(e, 133, null, !1);
        let n = 0,
            a = this.targetOffset,
            l = i.nextNode();
        for (let t = o.length; n < t; ++n) {
            const t = o[n],
                e = t.targetIndex;
            for (; null !== l; ) {
                if (a === e) {
                    r[n] = t.createBehavior(l);
                    break;
                }
                (l = i.nextNode()), a++;
            }
        }
        if (this.hasHostBehaviors) {
            const e = this.hostBehaviorFactories;
            for (let o = 0, i = e.length; o < i; ++o, ++n) r[n] = e[o].createBehavior(t);
        }
        return new W(e, r);
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
function Y(t, ...e) {
    const o = [];
    let r = "";
    for (let i = 0, n = t.length - 1; i < n; ++i) {
        const n = t[i];
        let s = e[i];
        if (((r += n), "function" == typeof s)) {
            s = new R(s);
            const t = X.exec(n);
            null !== t && (s.targetName = t[2]);
        }
        s instanceof D ? ((r += s.createPlaceholder(o.length)), o.push(s)) : (r += s);
    }
    return (r += t[t.length - 1]), new K(r, o);
}
const Q = {
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
    constructor(t, e, o = e.toLowerCase(), r = "reflect", i) {
        (this.Owner = t),
            (this.name = e),
            (this.attribute = o),
            (this.mode = r),
            (this.converter = i),
            (this.guards = new Set()),
            (this.fieldName = "_" + e),
            (this.callbackName = e + "Changed"),
            (this.hasCallback = this.callbackName in t.prototype),
            "boolean" === r && void 0 === i && (this.converter = Q);
    }
    setValue(t, e) {
        const o = t[this.fieldName],
            r = this.converter;
        void 0 !== r && (e = r.fromView(e)),
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
                const r = t[this.fieldName];
                switch (e) {
                    case "reflect":
                        const e = this.converter;
                        s.setAttribute(t, this.attribute, void 0 !== e ? e.toView(r) : r);
                        break;
                    case "boolean":
                        s.setBooleanAttribute(t, this.attribute, r);
                }
                o.delete(t);
            });
    }
    static collect(t, ...e) {
        const o = [];
        e.push(t.attributes);
        for (let r = 0, i = e.length; r < i; ++r) {
            const i = e[r];
            if (void 0 !== i)
                for (let e = 0, r = i.length; e < r; ++e) {
                    const r = i[e];
                    "string" == typeof r
                        ? o.push(new J(t, r))
                        : o.push(new J(t, r.property, r.attribute, r.mode, r.converter));
                }
        }
        return o;
    }
}
function tt(t, e) {
    let o;
    function r(t, e) {
        arguments.length > 1 && (o.property = e);
        const r = t.constructor.attributes || (t.constructor.attributes = []);
        r.push(o);
    }
    return arguments.length > 1
        ? ((o = {}), void r(t, e))
        : ((o = void 0 === t ? {} : t), r);
}
class et {
    constructor(t, e, o, r, i, n, s, a) {
        (this.name = t),
            (this.attributes = e),
            (this.propertyLookup = o),
            (this.attributeLookup = r),
            (this.template = i),
            (this.styles = n),
            (this.shadowOptions = s),
            (this.elementOptions = a);
    }
}
const ot = new Map();
function rt(t) {
    return ot.get(t);
}
const it = { bubbles: !0, composed: !0 };
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
            r = e.styles,
            i = void 0 === e.shadowOptions ? void 0 : t.attachShadow(e.shadowOptions);
        if (void 0 !== o) {
            const e = (this.view = o.create(this.element));
            void 0 === i ? e.appendTo(t) : e.appendTo(i);
        }
        void 0 !== r && this.addStyles(r, i);
        const n = g.getAccessors(t);
        if (n.length > 0) {
            const e = (this.boundObservables = Object.create(null));
            for (let o = 0, r = n.length; o < r; ++o) {
                const r = n[o].name,
                    i = t[r];
                void 0 !== i && (delete t[r], (e[r] = i));
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
        for (let r = 0; r < o; ++r) e.push(t[r]);
        if (this.isConnected) {
            const e = this.element;
            for (let r = 0; r < o; ++r) t[r].bind(e, $);
        }
    }
    removeBehaviors(t) {
        const e = this.behaviors;
        if (null === e) return;
        const o = t.length;
        for (let r = 0; r < o; ++r) {
            const o = e.indexOf(t[r]);
            -1 !== o && e.splice(o, 1);
        }
        if (this.isConnected) {
            const e = this.element;
            for (let r = 0; r < o; ++r) t[r].unbind(e);
        }
    }
    onConnectedCallback() {
        if (this.isConnected) return;
        const t = this.element,
            e = this.boundObservables;
        if (null !== e) {
            const o = Object.keys(e);
            for (let r = 0, i = o.length; r < i; ++r) {
                const i = o[r];
                t[i] = e[i];
            }
            this.boundObservables = null;
        }
        const o = this.view;
        null !== o && o.bind(t, $);
        const r = this.behaviors;
        if (null !== r) for (let e = 0, o = r.length; e < o; ++e) r[e].bind(t, $);
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
            for (let o = 0, r = e.length; o < r; ++o) e[o].unbind(t);
        }
    }
    onAttributeChangedCallback(t, e, o) {
        const r = this.definition.attributeLookup[t];
        void 0 !== r && r.onAttributeChangedCallback(this.element, o);
    }
    emit(t, e, o) {
        return (
            !!this.isConnected &&
            this.element.dispatchEvent(
                new CustomEvent(t, Object.assign(Object.assign({ detail: e }, it), o))
            )
        );
    }
    static forCustomElement(t) {
        const e = t.$fastController;
        if (void 0 !== e) return e;
        const o = rt(t.constructor);
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
            r = J.collect(t, e.attributes),
            i =
                void 0 === e.shadowOptions
                    ? st
                    : null === e.shadowOptions
                    ? void 0
                    : Object.assign(Object.assign({}, st), e.shadowOptions),
            n =
                void 0 === e.elementOptions
                    ? at
                    : Object.assign(Object.assign({}, at), e.shadowOptions),
            s = new Array(r.length),
            a = t.prototype,
            l = {},
            c = {};
        for (let t = 0, e = r.length; t < e; ++t) {
            const e = r[t];
            (s[t] = e.attribute),
                (l[e.name] = e),
                (c[e.attribute] = e),
                g.defineProperty(a, e);
        }
        Reflect.defineProperty(t, "observedAttributes", { value: s, enumerable: !0 });
        const d = new et(o, r, l, c, e.template, e.styles, i, n);
        return ot.set(t, d), customElements.define(o, t, d.elementOptions), t;
    },
    getDefinition: rt,
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
function ft(t) {
    return t
        .map(t => (t instanceof pt ? ft(t.styles) : [t]))
        .reduce((t, e) => t.concat(e), []);
}
function vt(t) {
    return t
        .map(t => (t instanceof pt ? t.behaviors : null))
        .reduce((t, e) => (null === e ? t : (null === t && (t = []), t.concat(e))), null);
}
class bt extends pt {
    constructor(t, e) {
        super(),
            (this.styles = t),
            (this.behaviors = null),
            (this.behaviors = vt(t)),
            (this.styleSheets = ft(t).map(t => {
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
            (this.behaviors = vt(t)),
            (this.styleSheets = ft(t)),
            (this.styleClass = "fast-style-class-" + ++gt);
    }
    addStylesTo(t) {
        const e = this.styleSheets,
            o = this.styleClass;
        for (let r = e.length - 1; r > -1; --r) {
            const i = document.createElement("style");
            (i.innerHTML = e[r]), (i.className = o), t.prepend(i);
        }
    }
    removeStylesFrom(t) {
        const e = t.querySelectorAll("." + this.styleClass);
        for (let o = 0, r = e.length; o < r; ++o) t.removeChild(e[o]);
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
    let r = "";
    for (let i = 0, n = t.length - 1; i < n; ++i) {
        r += t[i];
        const n = e[i];
        n instanceof pt
            ? ("" !== r.trim() && (o.push(r), (r = "")), o.push(n))
            : (r += n);
    }
    return (r += t[t.length - 1]), "" !== r.trim() && o.push(r), yt(o);
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
function wt(t) {
    return new P("fast-ref", kt, t);
}
class Ct {
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
        return new Ct(t, this.expression, this.template);
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
function Pt(t) {
    return "string" == typeof t && (t = { property: t }), new P("fast-slotted", Dt, t);
}
class Tt {
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
const Et = Y`
    <span name="end" part="end" ${wt("endContainer")}>
        <slot
            name="end"
            ${wt("end")}
            @slotchange=${t => t.handleEndContentChange()}
        ></slot>
    </span>
`,
    At = Y`
    <span name="start" part="start" ${wt("startContainer")}>
        <slot
            name="start"
            ${wt("start")}
            @slotchange=${t => t.handleStartContentChange()}
        ></slot>
    </span>
`,
    St = Y`
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
***************************************************************************** */ function Ot(
    t,
    e,
    o,
    r
) {
    var i,
        n = arguments.length,
        s = n < 3 ? e : null === r ? (r = Object.getOwnPropertyDescriptor(e, o)) : r;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
        s = Reflect.decorate(t, e, o, r);
    else
        for (var a = t.length - 1; a >= 0; a--)
            (i = t[a]) && (s = (n < 3 ? i(s) : n > 3 ? i(e, o, s) : i(e, o)) || s);
    return n > 3 && s && Object.defineProperty(e, o, s), s;
}
function Ht(t, ...e) {
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
class Mt extends ct {
    constructor() {
        super(...arguments), (this.appearance = "neutral");
    }
}
Ot([tt], Mt.prototype, "appearance", void 0),
    Ot([tt], Mt.prototype, "download", void 0),
    Ot([tt], Mt.prototype, "href", void 0),
    Ot([tt], Mt.prototype, "hreflang", void 0),
    Ot([tt], Mt.prototype, "ping", void 0),
    Ot([tt], Mt.prototype, "referrerpolicy", void 0),
    Ot([tt], Mt.prototype, "rel", void 0),
    Ot([tt], Mt.prototype, "target", void 0),
    Ot([tt], Mt.prototype, "type", void 0),
    Ht(Mt, Tt);
const Bt = Y`
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
class Lt extends ct {}
Ot([tt({ attribute: "fill" })], Lt.prototype, "fill", void 0),
    Ot([tt({ attribute: "color" })], Lt.prototype, "color", void 0),
    Ot([tt({ mode: "boolean" })], Lt.prototype, "circular", void 0);
const Rt = Y`
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
var Nt;
!(function(t) {
    (t.horizontal = "horizontal"), (t.vertical = "vertical");
})(Nt || (Nt = {}));
var It = "object" == typeof global && global && global.Object === Object && global,
    zt = "object" == typeof self && self && self.Object === Object && self,
    jt = It || zt || Function("return this")(),
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
                  var r = !0;
              } catch (t) {}
              var i = qt.call(t);
              return r && (e ? (t[Wt] = o) : delete t[Wt]), i;
          })(t)
        : (function(t) {
              return Ut.call(t);
          })(t);
}
function Yt(t) {
    return null != t && "object" == typeof t;
}
var Qt = Array.isArray;
function Zt(t) {
    var e = typeof t;
    return null != t && ("object" == e || "function" == e);
}
var Jt = /^\s+|\s+$/g,
    te = /^[-+]0x[0-9a-f]+$/i,
    ee = /^0b[01]+$/i,
    oe = /^0o[0-7]+$/i,
    re = parseInt;
function ie(t) {
    if ("number" == typeof t) return t;
    if (
        (function(t) {
            return "symbol" == typeof t || (Yt(t) && "[object Symbol]" == Xt(t));
        })(t)
    )
        return NaN;
    if (Zt(t)) {
        var e = "function" == typeof t.valueOf ? t.valueOf() : t;
        t = Zt(e) ? e + "" : e;
    }
    if ("string" != typeof t) return 0 === t ? t : +t;
    t = t.replace(Jt, "");
    var o = ee.test(t);
    return o || oe.test(t) ? re(t.slice(2), o ? 2 : 8) : te.test(t) ? NaN : +t;
}
function ne(t) {
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
function se(t) {
    if (!Zt(t)) return !1;
    var e = Xt(t);
    return (
        "[object Function]" == e ||
        "[object GeneratorFunction]" == e ||
        "[object AsyncFunction]" == e ||
        "[object Proxy]" == e
    );
}
var ae,
    le = jt["__core-js_shared__"],
    ce = (ae = /[^.]+$/.exec((le && le.keys && le.keys.IE_PROTO) || ""))
        ? "Symbol(src)_1." + ae
        : "";
var de = Function.prototype.toString;
var he = /^\[object .+?Constructor\]$/,
    ue = Function.prototype,
    pe = Object.prototype,
    fe = ue.toString,
    ve = pe.hasOwnProperty,
    be = RegExp(
        "^" +
            fe
                .call(ve)
                .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
                .replace(
                    /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                    "$1.*?"
                ) +
            "$"
    );
function ge(t) {
    return (
        !(!Zt(t) || ((e = t), ce && ce in e)) &&
        (se(t) ? be : he).test(
            (function(t) {
                if (null != t) {
                    try {
                        return de.call(t);
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
function me(t, e) {
    var o = (function(t, e) {
        return null == t ? void 0 : t[e];
    })(t, e);
    return ge(o) ? o : void 0;
}
var ye = /^(?:0|[1-9]\d*)$/;
function xe(t, e) {
    var o = typeof t;
    return (
        !!(e = null == e ? 9007199254740991 : e) &&
        ("number" == o || ("symbol" != o && ye.test(t))) &&
        t > -1 &&
        t % 1 == 0 &&
        t < e
    );
}
function ke(t) {
    return "number" == typeof t && t > -1 && t % 1 == 0 && t <= 9007199254740991;
}
var we = Object.prototype;
function Ce(t) {
    return Yt(t) && "[object Arguments]" == Xt(t);
}
var $e = Object.prototype,
    Fe = $e.hasOwnProperty,
    De = $e.propertyIsEnumerable,
    Pe = Ce(
        (function() {
            return arguments;
        })()
    )
        ? Ce
        : function(t) {
              return Yt(t) && Fe.call(t, "callee") && !De.call(t, "callee");
          };
var Te = "object" == typeof exports && exports && !exports.nodeType && exports,
    Ee = Te && "object" == typeof module && module && !module.nodeType && module,
    Ae = Ee && Ee.exports === Te ? jt.Buffer : void 0,
    Se =
        (Ae ? Ae.isBuffer : void 0) ||
        function() {
            return !1;
        },
    Oe = {};
(Oe["[object Float32Array]"] = Oe["[object Float64Array]"] = Oe[
    "[object Int8Array]"
] = Oe["[object Int16Array]"] = Oe["[object Int32Array]"] = Oe[
    "[object Uint8Array]"
] = Oe["[object Uint8ClampedArray]"] = Oe["[object Uint16Array]"] = Oe[
    "[object Uint32Array]"
] = !0),
    (Oe["[object Arguments]"] = Oe["[object Array]"] = Oe["[object ArrayBuffer]"] = Oe[
        "[object Boolean]"
    ] = Oe["[object DataView]"] = Oe["[object Date]"] = Oe["[object Error]"] = Oe[
        "[object Function]"
    ] = Oe["[object Map]"] = Oe["[object Number]"] = Oe["[object Object]"] = Oe[
        "[object RegExp]"
    ] = Oe["[object Set]"] = Oe["[object String]"] = Oe["[object WeakMap]"] = !1);
var He,
    Me = "object" == typeof exports && exports && !exports.nodeType && exports,
    Be = Me && "object" == typeof module && module && !module.nodeType && module,
    Le = Be && Be.exports === Me && It.process,
    Re = (function() {
        try {
            var t = Be && Be.require && Be.require("util").types;
            return t || (Le && Le.binding && Le.binding("util"));
        } catch (t) {}
    })(),
    Ne = Re && Re.isTypedArray,
    Ie = Ne
        ? ((He = Ne),
          function(t) {
              return He(t);
          })
        : function(t) {
              return Yt(t) && ke(t.length) && !!Oe[Xt(t)];
          },
    ze = Object.prototype.hasOwnProperty;
function je(t, e) {
    var o = Qt(t),
        r = !o && Pe(t),
        i = !o && !r && Se(t),
        n = !o && !r && !i && Ie(t),
        s = o || r || i || n,
        a = s
            ? (function(t, e) {
                  for (var o = -1, r = Array(t); ++o < t; ) r[o] = e(o);
                  return r;
              })(t.length, String)
            : [],
        l = a.length;
    for (var c in t)
        (!e && !ze.call(t, c)) ||
            (s &&
                ("length" == c ||
                    (i && ("offset" == c || "parent" == c)) ||
                    (n && ("buffer" == c || "byteLength" == c || "byteOffset" == c)) ||
                    xe(c, l))) ||
            a.push(c);
    return a;
}
var _e = (function(t, e) {
        return function(o) {
            return t(e(o));
        };
    })(Object.keys, Object),
    Ve = Object.prototype.hasOwnProperty;
function Ge(t) {
    if (
        ((o = (e = t) && e.constructor),
        e !== (("function" == typeof o && o.prototype) || we))
    )
        return _e(t);
    var e,
        o,
        r = [];
    for (var i in Object(t)) Ve.call(t, i) && "constructor" != i && r.push(i);
    return r;
}
function qe(t) {
    return null != (e = t) && ke(e.length) && !se(e) ? je(t) : Ge(t);
    var e;
}
var We = me(Object, "create");
var Ue = Object.prototype.hasOwnProperty;
var Ke = Object.prototype.hasOwnProperty;
function Xe(t) {
    var e = -1,
        o = null == t ? 0 : t.length;
    for (this.clear(); ++e < o; ) {
        var r = t[e];
        this.set(r[0], r[1]);
    }
}
function Ye(t, e) {
    for (var o, r, i = t.length; i--; )
        if ((o = t[i][0]) === (r = e) || (o != o && r != r)) return i;
    return -1;
}
(Xe.prototype.clear = function() {
    (this.__data__ = We ? We(null) : {}), (this.size = 0);
}),
    (Xe.prototype.delete = function(t) {
        var e = this.has(t) && delete this.__data__[t];
        return (this.size -= e ? 1 : 0), e;
    }),
    (Xe.prototype.get = function(t) {
        var e = this.__data__;
        if (We) {
            var o = e[t];
            return "__lodash_hash_undefined__" === o ? void 0 : o;
        }
        return Ue.call(e, t) ? e[t] : void 0;
    }),
    (Xe.prototype.has = function(t) {
        var e = this.__data__;
        return We ? void 0 !== e[t] : Ke.call(e, t);
    }),
    (Xe.prototype.set = function(t, e) {
        var o = this.__data__;
        return (
            (this.size += this.has(t) ? 0 : 1),
            (o[t] = We && void 0 === e ? "__lodash_hash_undefined__" : e),
            this
        );
    });
var Qe = Array.prototype.splice;
function Ze(t) {
    var e = -1,
        o = null == t ? 0 : t.length;
    for (this.clear(); ++e < o; ) {
        var r = t[e];
        this.set(r[0], r[1]);
    }
}
(Ze.prototype.clear = function() {
    (this.__data__ = []), (this.size = 0);
}),
    (Ze.prototype.delete = function(t) {
        var e = this.__data__,
            o = Ye(e, t);
        return (
            !(o < 0) && (o == e.length - 1 ? e.pop() : Qe.call(e, o, 1), --this.size, !0)
        );
    }),
    (Ze.prototype.get = function(t) {
        var e = this.__data__,
            o = Ye(e, t);
        return o < 0 ? void 0 : e[o][1];
    }),
    (Ze.prototype.has = function(t) {
        return Ye(this.__data__, t) > -1;
    }),
    (Ze.prototype.set = function(t, e) {
        var o = this.__data__,
            r = Ye(o, t);
        return r < 0 ? (++this.size, o.push([t, e])) : (o[r][1] = e), this;
    });
var Je = me(jt, "Map");
function to(t, e) {
    var o,
        r,
        i = t.__data__;
    return ("string" == (r = typeof (o = e)) ||
    "number" == r ||
    "symbol" == r ||
    "boolean" == r
      ? "__proto__" !== o
      : null === o)
        ? i["string" == typeof e ? "string" : "hash"]
        : i.map;
}
function eo(t) {
    var e = -1,
        o = null == t ? 0 : t.length;
    for (this.clear(); ++e < o; ) {
        var r = t[e];
        this.set(r[0], r[1]);
    }
}
(eo.prototype.clear = function() {
    (this.size = 0),
        (this.__data__ = { hash: new Xe(), map: new (Je || Ze)(), string: new Xe() });
}),
    (eo.prototype.delete = function(t) {
        var e = to(this, t).delete(t);
        return (this.size -= e ? 1 : 0), e;
    }),
    (eo.prototype.get = function(t) {
        return to(this, t).get(t);
    }),
    (eo.prototype.has = function(t) {
        return to(this, t).has(t);
    }),
    (eo.prototype.set = function(t, e) {
        var o = to(this, t),
            r = o.size;
        return o.set(t, e), (this.size += o.size == r ? 0 : 1), this;
    });
function oo(t, e) {
    if ("function" != typeof t || (null != e && "function" != typeof e))
        throw new TypeError("Expected a function");
    var o = function() {
        var r = arguments,
            i = e ? e.apply(this, r) : r[0],
            n = o.cache;
        if (n.has(i)) return n.get(i);
        var s = t.apply(this, r);
        return (o.cache = n.set(i, s) || n), s;
    };
    return (o.cache = new (oo.Cache || eo)()), o;
}
oo.Cache = eo;
var ro,
    io = function(t, e, o) {
        for (var r = -1, i = Object(t), n = o(t), s = n.length; s--; ) {
            var a = n[ro ? s : ++r];
            if (!1 === e(i[a], a, i)) break;
        }
        return t;
    };
var no = Math.max,
    so = Math.min;
function ao(t, e, o) {
    return (
        (e = ne(e)),
        void 0 === o ? ((o = e), (e = 0)) : (o = ne(o)),
        (function(t, e, o) {
            return t >= so(e, o) && t < no(e, o);
        })((t = ie(t)), e, o)
    );
}
function lo(t, e, o, r) {
    return (
        (function(t, e) {
            t && io(t, e, qe);
        })(t, function(t, i, n) {
            e(r, o(t), i, n);
        }),
        r
    );
}
var co,
    ho,
    uo = Object.prototype.toString,
    po =
        ((co = function(t, e, o) {
            null != e && "function" != typeof e.toString && (e = uo.call(e)), (t[e] = o);
        }),
        (ho = (function(t) {
            return function() {
                return t;
            };
        })(function(t) {
            return t;
        })),
        function(t, e) {
            return lo(t, co, ho(e), {});
        });
let fo;
var vo;
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
})(vo || (vo = {}));
var bo, go;
!(function(t) {
    (t.ltr = "ltr"), (t.rtl = "rtl");
})(bo || (bo = {})),
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
    })(go || (go = {}));
const mo = "ElementInternals" in window;
class yo extends ct {
    constructor() {
        super(),
            (this.value = ""),
            (this.disabled = !1),
            (this.required = !1),
            (this.proxyEventsToBlock = ["change", "click"]),
            mo && (this.elementInternals = this.attachInternals());
    }
    static get formAssociated() {
        return mo;
    }
    get validity() {
        return mo ? this.elementInternals.validity : this.proxy.validity;
    }
    get form() {
        return mo ? this.elementInternals.form : this.proxy.form;
    }
    get validationMessage() {
        return mo
            ? this.elementInternals.validationMessage
            : this.proxy.validationMessage;
    }
    get willValidate() {
        return mo ? this.elementInternals.willValidate : this.proxy.willValidate;
    }
    get labels() {
        if (mo) return Object.freeze(Array.from(this.elementInternals.labels));
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
            mo ||
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
        return mo ? this.elementInternals.checkValidity() : this.proxy.checkValidity();
    }
    reportValidity() {
        return mo ? this.elementInternals.reportValidity() : this.proxy.reportValidity();
    }
    setValidity(t, e, o) {
        mo
            ? this.elementInternals.setValidity(t, e, o)
            : "string" == typeof e && this.proxy.setCustomValidity(e);
    }
    formDisabledCallback(t) {
        this.disabled = t;
    }
    setFormValue(t, e) {
        mo && this.elementInternals.setFormValue(t, e);
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
Ot([tt], yo.prototype, "value", void 0),
    Ot([tt({ mode: "boolean" })], yo.prototype, "disabled", void 0),
    Ot([tt], yo.prototype, "name", void 0),
    Ot([tt({ mode: "boolean" })], yo.prototype, "required", void 0);
class xo extends yo {
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
Ot([tt], xo.prototype, "appearance", void 0),
    Ot([tt({ mode: "boolean" })], xo.prototype, "autofocus", void 0),
    Ot([tt({ attribute: "form" })], xo.prototype, "formId", void 0),
    Ot([tt], xo.prototype, "formaction", void 0),
    Ot([tt], xo.prototype, "formenctype", void 0),
    Ot([tt], xo.prototype, "formmethod", void 0),
    Ot([tt({ mode: "boolean" })], xo.prototype, "formnovalidate", void 0),
    Ot([tt], xo.prototype, "formtarget", void 0),
    Ot([tt], xo.prototype, "name", void 0),
    Ot([tt], xo.prototype, "type", void 0),
    Ht(xo, Tt);
const ko = Y`<slot></slot>`;
class wo extends ct {}
const Co = Y`
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
            <slot ${Pt("defaultSlottedNodes")}></slot>
        </label>
    </template>
`;
class $o extends yo {
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
function Fo(t, e, o) {
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
function Do(t) {
    const e = t.parentElement;
    if (e) return e;
    {
        const e = t.getRootNode();
        if (e.host instanceof HTMLElement) return e.host;
    }
    return null;
}
Ot([tt({ attribute: "readonly", mode: "boolean" })], $o.prototype, "readOnly", void 0),
    Ot(
        [tt({ attribute: "checked", mode: "boolean" })],
        $o.prototype,
        "checkedAttribute",
        void 0
    ),
    Ot([x], $o.prototype, "defaultSlottedNodes", void 0),
    Ot([x], $o.prototype, "defaultChecked", void 0),
    Ot([x], $o.prototype, "checked", void 0),
    Ot([x], $o.prototype, "indeterminate", void 0);
const Po = (function(t) {
    const e = new WeakMap();
    return o =>
        Object.freeze({
            query: t,
            cache: e,
            sheet: o,
            constructListener(t, e) {
                let o = !1;
                return function() {
                    const { matches: r } = this;
                    r && !o
                        ? (t.$fastController.addStyles(e), (o = r))
                        : !r && o && (t.$fastController.removeStyles(e), (o = r));
                };
            },
            bind(t) {
                const { constructListener: e, query: o, cache: r } = this,
                    i = e(t, this.sheet),
                    n = r.get(t);
                i.bind(o)(),
                    o.addListener(i),
                    void 0 !== n
                        ? Array.isArray(n)
                            ? n.push(i)
                            : r.set(t, [n, i])
                        : r.set(t, i);
            },
            unbind(t) {
                const { cache: e, query: o } = this,
                    r = e.get(t);
                void 0 !== r &&
                    (Array.isArray(r)
                        ? r.forEach(t => o.removeListener(t))
                        : o.removeListener(r),
                    e.delete(t));
            },
        });
})(window.matchMedia("(forced-colors)"));
function To(t) {
    return `\n        \n    :host([hidden]) {\n        display: none;\n    }\n :host {\n            display: ${t};\n        }\n    `;
}
const Eo = (function() {
        if (!0 === (t = fo) || !1 === t || (Yt(t) && "[object Boolean]" == Xt(t)))
            return fo;
        var t;
        if (
            "undefined" == typeof window ||
            !window.document ||
            !window.document.createElement
        )
            return (fo = !1), fo;
        const e = document.createElement("style");
        document.head.appendChild(e);
        try {
            e.sheet.insertRule("foo:focus-visible {color:inherit}", 0), (fo = !0);
        } catch (t) {
            fo = !1;
        } finally {
            document.head.removeChild(e);
        }
        return fo;
    })()
        ? "focus-visible"
        : "focus",
    Ao = "adoptedStyleSheets" in window.ShadowRoot.prototype;
function So(t) {
    const e = t.provider;
    return null != e && Ho.isDesignSystemProvider(e);
}
const Oo = {
    bind(t) {
        t.provider = Ho.findProvider(t);
    },
    unbind(t) {},
};
class Ho extends ct {
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
            Ao && null !== this.shadowRoot)
        ) {
            const t = new CSSStyleSheet();
            t.insertRule(":host{}"),
                (this.shadowRoot.adoptedStyleSheets = [
                    ...this.shadowRoot.adoptedStyleSheets,
                    t,
                ]),
                (this.customPropertyTarget = t.rules[0].style);
        } else this.customPropertyTarget = this.style;
        this.$fastController.addBehaviors([Oo]);
    }
    static get tagNames() {
        return Ho._tagNames;
    }
    static isDesignSystemProvider(t) {
        return t.isDesignSystemProvider || -1 !== Ho.tagNames.indexOf(t.tagName);
    }
    static findProvider(t) {
        if (So(t)) return t.provider;
        let e = Do(t);
        for (; null !== e; ) {
            if (Ho.isDesignSystemProvider(e)) return (t.provider = e), e;
            if (So(e)) return (t.provider = e.provider), e.provider;
            e = Do(e);
        }
        return null;
    }
    static registerTagName(t) {
        const e = t.toUpperCase();
        -1 === Ho.tagNames.indexOf(e) && Ho._tagNames.push(e);
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
                Ho.isDesignSystemProvider(e) &&
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
                const r = this[o];
                if (this.isValidDesignSystemValue(r)) {
                    this.designSystem[o] = r;
                    const { cssCustomProperty: t } = this.designSystemProperties[o];
                    "string" == typeof t && this.setCustomProperty({ name: t, value: r });
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
function Mo(t) {
    return (e, o) => {
        ((t, e, o) => {
            const { cssCustomProperty: r, attribute: i } = o;
            t.designSystemProperties || (t.designSystemProperties = {}),
                !1 === i
                    ? x(t, e)
                    : (void 0 === o.mode &&
                          (o = Object.assign(Object.assign({}, o), { mode: "fromView" })),
                      tt(o)(t, e)),
                (t.designSystemProperties[e] = {
                    cssCustomProperty:
                        !1 !== r &&
                        ("string" == typeof r ? r : "string" == typeof i ? i : e),
                    default: o.default,
                });
        })(e, o, t);
    };
}
(Ho._tagNames = []),
    Ot(
        [tt({ attribute: "use-defaults", mode: "boolean" })],
        Ho.prototype,
        "useDefaults",
        void 0
    ),
    Ot([x], Ho.prototype, "provider", void 0);
const Bo = Y`<slot></slot>`,
    Lo = Y`
    <div class="positioning-region" part="positioning-region">
        ${Ft(
            t => t.modal,
            Y`
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
            ${wt("dialog")}
        >
            <slot></slot>
        </div>
    </div>
`;
var Ro = [
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
    No = Ro.join(","),
    Io =
        "undefined" == typeof Element
            ? function() {}
            : Element.prototype.matches ||
              Element.prototype.msMatchesSelector ||
              Element.prototype.webkitMatchesSelector;
function zo(t, e) {
    e = e || {};
    var o,
        r,
        i,
        n = [],
        s = [],
        a = t.querySelectorAll(No);
    for (
        e.includeContainer &&
            Io.call(t, No) &&
            (a = Array.prototype.slice.apply(a)).unshift(t),
            o = 0;
        o < a.length;
        o++
    )
        jo((r = a[o])) &&
            (0 === (i = Go(r))
                ? n.push(r)
                : s.push({ documentOrder: o, tabIndex: i, node: r }));
    return s
        .sort(qo)
        .map(function(t) {
            return t.node;
        })
        .concat(n);
}
function jo(t) {
    return !(
        !_o(t) ||
        (function(t) {
            return (
                (function(t) {
                    return Wo(t) && "radio" === t.type;
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
        Go(t) < 0
    );
}
function _o(t) {
    return !(
        t.disabled ||
        (function(t) {
            return Wo(t) && "hidden" === t.type;
        })(t) ||
        (function(t) {
            return null === t.offsetParent || "hidden" === getComputedStyle(t).visibility;
        })(t)
    );
}
(zo.isTabbable = function(t) {
    if (!t) throw new Error("No node provided");
    return !1 !== Io.call(t, No) && jo(t);
}),
    (zo.isFocusable = function(t) {
        if (!t) throw new Error("No node provided");
        return !1 !== Io.call(t, Vo) && _o(t);
    });
var Vo = Ro.concat("iframe").join(",");
function Go(t) {
    var e = parseInt(t.getAttribute("tabindex"), 10);
    return isNaN(e)
        ? (function(t) {
              return "true" === t.contentEditable;
          })(t)
            ? 0
            : t.tabIndex
        : e;
}
function qo(t, e) {
    return t.tabIndex === e.tabIndex
        ? t.documentOrder - e.documentOrder
        : t.tabIndex - e.tabIndex;
}
function Wo(t) {
    return "INPUT" === t.tagName;
}
var Uo = zo;
class Ko extends ct {
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
            (this.tabbableElements = Uo(this)),
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
        t.length && (this.tabbableElements = Uo(this));
    }
    isDialogHidden() {
        return "boolean" != typeof this.hidden;
    }
    shouldDialogTrapFocus() {
        return "boolean" == typeof this.trapFocus;
    }
}
Ot([tt({ mode: "boolean" })], Ko.prototype, "modal", void 0),
    Ot([tt({ mode: "boolean" })], Ko.prototype, "hidden", void 0),
    Ot(
        [tt({ attribute: "trap-focus", mode: "boolean" })],
        Ko.prototype,
        "trapFocus",
        void 0
    ),
    Ot([tt({ attribute: "aria-describedby" })], Ko.prototype, "ariaDescribedby", void 0),
    Ot([tt({ attribute: "aria-labelledby" })], Ko.prototype, "ariaLabelledby", void 0),
    Ot([tt({ attribute: "aria-label" })], Ko.prototype, "ariaLabel", void 0);
const Xo = Y`<template role=${t => t.role}></template>`;
var Yo, Qo;
!(function(t) {
    (t.separator = "separator"), (t.presentation = "presentation");
})(Yo || (Yo = {}));
class Zo extends ct {
    constructor() {
        super(...arguments), (this.role = Yo.separator);
    }
}
Ot([tt], Zo.prototype, "role", void 0),
    (function(t) {
        (t.next = "next"), (t.previous = "previous");
    })(Qo || (Qo = {}));
class Jo extends ct {
    constructor() {
        super(...arguments), (this.hiddenFromAT = !0), (this.direction = Qo.next);
    }
}
Ot([tt({ mode: "boolean" })], Jo.prototype, "disabled", void 0),
    Ot(
        [tt({ attribute: "aria-hidden", mode: "fromView", converter: Q })],
        Jo.prototype,
        "hiddenFromAT",
        void 0
    ),
    Ot([tt], Jo.prototype, "direction", void 0);
const tr = Y`
    <template
        role="button"
        aria-disabled="${t => !!t.disabled || void 0}"
        tabindex="${t => (t.hiddenFromAT ? -1 : 0)}"
        class="${t => t.direction} ${t => (t.disabled ? "disabled" : "")}"
    >
        ${Ft(
            t => t.direction === Qo.next,
            Y`
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
            t => t.direction === Qo.previous,
            Y`
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
`,
    er = Y`
    <template
        role="menu"
        @keydown=${(t, e) => t.handleMenuKeyDown(e.event)}
        @focusout=${(t, e) => t.handleFocusOut(e.event)}
    >
        <slot ${Pt("items")}></slot>
    </template>
`;
var or;
!(function(t) {
    (t.menuitem = "menuitem"),
        (t.menuitemcheckbox = "menuitemcheckbox"),
        (t.menuitemradio = "menuitemradio");
})(or || (or = {}));
class rr extends ct {
    constructor() {
        super(...arguments),
            (this.expanded = !1),
            (this.role = or.menuitem),
            (this.handleMenuItemKeyDown = t => (this.change(), !0)),
            (this.handleMenuItemClick = t => {
                this.change();
            }),
            (this.change = () => {
                this.$emit("change");
            });
    }
}
Ot([tt({ mode: "boolean" })], rr.prototype, "disabled", void 0),
    Ot(
        [tt({ attribute: "aria-expanded", mode: "reflect", converter: Q })],
        rr.prototype,
        "expanded",
        void 0
    ),
    Ot([tt], rr.prototype, "role", void 0),
    Ot([tt], rr.prototype, "checked", void 0),
    Ht(rr, Tt);
const ir = Y`
    <template
        role=${t => t.role}
        aria-checked=${t => (t.role !== or.menuitem ? t.checked : void 0)}
        aria-disabled=${t => t.disabled}
        @keydown=${(t, e) => t.handleMenuItemKeyDown(e.event)}
        @click=${(t, e) => t.handleMenuItemClick(e.event)}
        class="${t => (t.disabled ? "disabled" : "")} ${t =>
    t.expanded ? "expanded" : ""}"
    >
        ${At}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${Et}
    </template>
`;
class nr extends ct {
    constructor() {
        super(...arguments),
            (this.focusIndex = -1),
            (this.handleFocusOut = t => {
                if (!this.contains(t.relatedTarget)) {
                    const t = this.menuItems.findIndex(this.isFocusableElement);
                    this.menuItems[this.focusIndex].setAttribute("tabindex", ""),
                        this.menuItems[t].setAttribute("tabindex", "0"),
                        (this.focusIndex = t);
                }
            }),
            (this.setItems = () => {
                const t = this.menuItems.findIndex(this.isFocusableElement);
                -1 !== t && (this.focusIndex = t);
                for (let e = 0; e < this.menuItems.length; e++)
                    e === t && this.menuItems[e].setAttribute("tabindex", "0"),
                        this.menuItems[e].addEventListener(
                            "blur",
                            this.handleMenuItemFocus
                        );
            }),
            (this.resetItems = t => {
                for (let e = 0; e < t.length; e++)
                    t[e].removeEventListener("blur", this.handleMenuItemFocus);
            }),
            (this.isMenuItemElement = t =>
                (function(...t) {
                    return t.every(t => t instanceof HTMLElement);
                })(t) && nr.focusableElementRoles.hasOwnProperty(t.getAttribute("role"))),
            (this.isDisabledElement = t =>
                this.isMenuItemElement(t) && "true" === t.getAttribute("aria-disabled")),
            (this.isFocusableElement = t =>
                this.isMenuItemElement(t) && !this.isDisabledElement(t)),
            (this.handleMenuItemFocus = t => {
                const e = t.currentTarget,
                    o = this.menuItems.indexOf(e);
                this.isDisabledElement(e)
                    ? e.blur()
                    : o !== this.focusIndex &&
                      -1 !== o &&
                      this.setFocus(o, o > this.focusIndex ? 1 : -1);
            });
    }
    itemsChanged(t, e) {
        this.$fastController.isConnected &&
            ((this.menuItems = this.domChildren()), this.resetItems(t), this.setItems());
    }
    connectedCallback() {
        super.connectedCallback(), (this.menuItems = this.domChildren()), this.setItems();
    }
    focus() {
        this.setFocus(0, 1);
    }
    handleMenuKeyDown(t) {
        switch (t.keyCode) {
            case 40:
            case 39:
                t.preventDefault(), this.setFocus(this.focusIndex + 1, 1);
                break;
            case 38:
            case 37:
                t.preventDefault(), this.setFocus(this.focusIndex - 1, -1);
                break;
            case 35:
                t.preventDefault(), this.setFocus(this.domChildren().length - 1, -1);
                break;
            case 36:
                t.preventDefault(), this.setFocus(0, 1);
                break;
            default:
                return !0;
        }
    }
    domChildren() {
        return Array.from(this.children);
    }
    setFocus(t, e) {
        const o = this.menuItems;
        for (; ao(t, o.length); ) {
            const r = o[t];
            if (this.isFocusableElement(r)) {
                r.setAttribute("tabindex", "0"),
                    r.focus(),
                    o[this.focusIndex].setAttribute("tabindex", ""),
                    (this.focusIndex = t);
                break;
            }
            t += e;
        }
    }
}
(nr.focusableElementRoles = po(or)), Ot([x], nr.prototype, "items", void 0);
class sr extends ct {}
Ot([tt({ converter: Z })], sr.prototype, "value", void 0),
    Ot([tt({ converter: Z })], sr.prototype, "min", void 0),
    Ot([tt({ converter: Z })], sr.prototype, "max", void 0),
    Ot([tt({ mode: "boolean" })], sr.prototype, "paused", void 0);
const ar = Y`
    <template
        role="progressbar"
        aria-valuenow="${t => t.value}"
        aria-valuemin="${t => t.min}"
        aria-valuemax="${t => t.max}"
        class="${t => (t.paused ? "paused" : "")}"
    >
        ${Ft(
            t => t.value,
            Y`
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
            Y`
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
    lr = Y`
    <template
        role="progressbar"
        aria-valuenow="${t => t.value}"
        aria-valuemin="${t => t.min}"
        aria-valuemax="${t => t.max}"
        class="${t => (t.paused ? "paused" : "")}"
    >
        ${Ft(
            t => t.value,
            Y`
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
            Y`
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
    cr = Y`
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
            <slot ${Pt("defaultSlottedNodes")}></slot>
        </label>
    </template>
`;
class dr extends yo {
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
Ot([tt({ attribute: "readonly", mode: "boolean" })], dr.prototype, "readOnly", void 0),
    Ot([tt], dr.prototype, "name", void 0),
    Ot(
        [tt({ attribute: "checked", mode: "boolean" })],
        dr.prototype,
        "checkedAttribute",
        void 0
    ),
    Ot([x], dr.prototype, "defaultSlottedNodes", void 0),
    Ot([x], dr.prototype, "defaultChecked", void 0),
    Ot([x], dr.prototype, "checked", void 0);
const hr = Y`
    <template
        role="radiogroup"
        aria-disabled="${t => t.disabled}"
        aria-readonly="${t => t.readOnly}"
    >
        <slot name="label"></slot>
        <div
            class="positioning-region ${t =>
                t.orientation === Nt.horizontal ? "horizontal" : "vertical"}"
            part="positioning-region"
        >
            <slot ${Pt("slottedRadioButtons")}> </slot>
        </div>
    </template>
`;
class ur extends ct {
    constructor() {
        super(),
            (this.orientation = Nt.horizontal),
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
                    r = null !== o ? e.indexOf(o) : 0,
                    i = this.focusedRadio ? e.indexOf(this.focusedRadio) : -1;
                ((0 === i && r === i) || (i === e.length - 1 && i === r)) &&
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
Ot([tt({ attribute: "readonly", mode: "boolean" })], ur.prototype, "readOnly", void 0),
    Ot(
        [tt({ attribute: "disabled", mode: "boolean" })],
        ur.prototype,
        "disabled",
        void 0
    ),
    Ot([tt], ur.prototype, "name", void 0),
    Ot([tt], ur.prototype, "value", void 0),
    Ot([tt], ur.prototype, "orientation", void 0),
    Ot([x], ur.prototype, "slottedRadioButtons", void 0);
const pr = Y`
    <template
        role="slider"
        class="${t => (t.readOnly ? "readonly" : "")} 
        ${t => t.orientation || Nt.horizontal}"
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
            <div ${wt("track")} part="track-container" class="track">
                <slot name="track"></slot>
            </div>
            <div></div>
            <slot></slot>
            <div
                ${wt("thumb")}
                part="thumb-container"
                class="thumb-container"
                style=${t => t.position}
            >
                <slot name="thumb"><div class="thumb-cursor"></div></slot>
            </div>
        </div>
    </template>
`;
function fr(t, e, o, r) {
    let i = ((n = 0), (s = 1), (a = (t - e) / (o - e)), Math.min(Math.max(a, n), s));
    var n, s, a;
    return r === bo.rtl && (i = 1 - i), i;
}
var vr;
!(function(t) {
    t.singleValue = "single-value";
})(vr || (vr = {}));
class br extends yo {
    constructor() {
        super(),
            (this.direction = bo.ltr),
            (this.isDragging = !1),
            (this.trackWidth = 0),
            (this.trackMinWidth = 0),
            (this.trackHeight = 0),
            (this.trackMinHeight = 0),
            (this.min = 0),
            (this.max = 10),
            (this.step = 1),
            (this.orientation = Nt.horizontal),
            (this.mode = vr.singleValue),
            (this.proxy = document.createElement("input")),
            (this.increment = () => {
                const t =
                        this.direction !== bo.rtl && this.orientation !== Nt.vertical
                            ? Number(this.value) + Number(this.step)
                            : Number(this.value) - Number(this.step),
                    e = this.convertToConstrainedValue(t),
                    o = e < Number(this.max) ? "" + e : "" + this.max;
                (this.value = o), this.updateForm();
            }),
            (this.decrement = () => {
                const t =
                        this.direction !== bo.rtl && this.orientation !== Nt.vertical
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
                    (1 - fr(Number(this.value), Number(this.min), Number(this.max), t));
                this.orientation === Nt.horizontal
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
                    t && "rtl" === t.dir && this.setThumbPositionForOrientation(bo.rtl),
                    null !== t && "rtl" === t.dir ? bo.rtl : bo.ltr
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
                    this.orientation === Nt.horizontal
                        ? t.pageX - this.getBoundingClientRect().left
                        : t.pageY;
                (this.value = "" + this.calculateNewValue(e)), this.updateForm();
            }),
            (this.calculateNewValue = t => {
                const e = fr(
                        t,
                        this.orientation === Nt.horizontal
                            ? this.trackMinWidth
                            : this.trackMinHeight,
                        this.orientation === Nt.horizontal
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
                        this.orientation === Nt.horizontal
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
Ot([tt({ attribute: "readonly", mode: "boolean" })], br.prototype, "readOnly", void 0),
    Ot([x], br.prototype, "direction", void 0),
    Ot([x], br.prototype, "isDragging", void 0),
    Ot([x], br.prototype, "position", void 0),
    Ot([x], br.prototype, "trackWidth", void 0),
    Ot([x], br.prototype, "trackMinWidth", void 0),
    Ot([x], br.prototype, "trackHeight", void 0),
    Ot([x], br.prototype, "trackMinHeight", void 0),
    Ot([tt({ converter: Z })], br.prototype, "min", void 0),
    Ot([tt({ converter: Z })], br.prototype, "max", void 0),
    Ot([tt({ converter: Z })], br.prototype, "step", void 0),
    Ot([tt], br.prototype, "orientation", void 0),
    Ot([tt], br.prototype, "mode", void 0);
const gr = Y`
    <template
        aria-disabled="${t => t.disabled}"
        class="${t => t.sliderOrientation || Nt.horizontal} 
            ${t => (t.disabled ? "disabled" : "")}"
    >
        <div ${wt("root")} part="root" class="root" style=${t => t.positionStyle}>
            <div class="container">
                ${Ft(t => !t.hideMark, Y` <div class="mark"></div> `)}
                <div class="label">
                    <slot> </slot>
                </div>
            </div>
        </div>
    </template>
`,
    mr = { min: 0, max: 0, direction: bo.ltr, orientation: Nt.horizontal, disabled: !1 };
class yr extends ct {
    constructor() {
        super(...arguments),
            (this.hideMark = !1),
            (this.sliderDirection = bo.ltr),
            (this.getSliderConfiguration = () => {
                if (this.isSliderConfig(this.parentNode)) {
                    const t = this.parentNode,
                        { min: e, max: o, direction: r, orientation: i, disabled: n } = t;
                    void 0 !== n && (this.disabled = n),
                        (this.sliderDirection = r || bo.ltr),
                        (this.sliderOrientation = i || Nt.horizontal),
                        (this.sliderMaxPosition = o),
                        (this.sliderMinPosition = e);
                } else
                    (this.sliderDirection = mr.direction || bo.ltr),
                        (this.sliderOrientation = mr.orientation || Nt.horizontal),
                        (this.sliderMaxPosition = mr.max),
                        (this.sliderMinPosition = mr.min);
            }),
            (this.positionAsStyle = () => {
                const t = this.sliderDirection ? this.sliderDirection : bo.ltr,
                    e = fr(
                        Number(this.position),
                        Number(this.sliderMinPosition),
                        Number(this.sliderMaxPosition)
                    );
                let o = Math.round(100 * (1 - e)),
                    r = Math.round(100 * e);
                return (
                    r === Number.NaN && o === Number.NaN && ((o = 50), (r = 50)),
                    this.sliderOrientation === Nt.horizontal
                        ? t === bo.rtl
                            ? `right: ${r}%; left: ${o}%;`
                            : `left: ${r}%; right: ${o}%;`
                        : `top: ${r}%; bottom: ${o}%;`
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
Ot([x], yr.prototype, "positionStyle", void 0),
    Ot([tt], yr.prototype, "position", void 0),
    Ot(
        [tt({ attribute: "hide-mark", mode: "boolean" })],
        yr.prototype,
        "hideMark",
        void 0
    ),
    Ot(
        [tt({ attribute: "disabled", mode: "boolean" })],
        yr.prototype,
        "disabled",
        void 0
    ),
    Ot([x], yr.prototype, "sliderOrientation", void 0),
    Ot([x], yr.prototype, "sliderMinPosition", void 0),
    Ot([x], yr.prototype, "sliderMaxPosition", void 0),
    Ot([x], yr.prototype, "sliderDirection", void 0);
const xr = Y`
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
            <slot ${Pt("defaultSlottedNodes")}></slot>
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
class kr extends yo {
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
Ot([tt({ attribute: "readonly", mode: "boolean" })], kr.prototype, "readOnly", void 0),
    Ot([tt], kr.prototype, "value", void 0),
    Ot(
        [tt({ attribute: "checked", mode: "boolean" })],
        kr.prototype,
        "checkedAttribute",
        void 0
    ),
    Ot([x], kr.prototype, "defaultSlottedNodes", void 0),
    Ot([x], kr.prototype, "defaultChecked", void 0),
    Ot([x], kr.prototype, "checked", void 0);
const wr = Y`
    <template role="tabs" class="${t => t.orientation}">
        ${At}
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${Pt("tabs")}></slot>

            ${Ft(
                t => t.activeindicator,
                Y`
                    <div
                        ${wt("activeIndicatorRef")}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `
            )}
        </div>
        ${Et}
        <div class="tabpanel">
            <slot name="tabpanel" part="tabpanel" ${Pt("tabpanels")}></slot>
        </div>
    </template>
`;
var Cr;
!(function(t) {
    (t.vertical = "vertical"), (t.horizontal = "horizontal");
})(Cr || (Cr = {}));
class $r extends ct {
    constructor() {
        super(),
            (this.orientation = Cr.horizontal),
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
                                r = this.tabpanelIds[e];
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
                                    "string" != typeof r ? "panel-" + (e + 1) : r
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
                            r = this.tabpanelIds[e];
                        t.setAttribute(
                            "id",
                            "string" != typeof r ? "panel-" + (e + 1) : r
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
        return this.orientation === Cr.horizontal;
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
            r = this.activeIndicatorRef[o];
        this.activeIndicatorRef.style[t] = "" + (this.activeTabIndex + 1);
        const i = this.activeIndicatorRef[o];
        this.activeIndicatorRef.style[t] = "" + (this.prevActiveTabIndex + 1);
        const n = i - r;
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
        var e, o, r;
        (this.prevActiveTabIndex = this.activeTabIndex),
            (this.activeTabIndex =
                ((e = 0),
                (o = this.tabs.length - 1),
                (r = this.activeTabIndex + t) < e ? o : r > o ? e : r)),
            this.setComponent();
    }
    focusTab() {
        this.tabs[this.activeTabIndex].focus();
    }
}
Ot([tt], $r.prototype, "orientation", void 0),
    Ot([tt], $r.prototype, "activeid", void 0),
    Ot([x], $r.prototype, "tabs", void 0),
    Ot([x], $r.prototype, "tabpanels", void 0),
    Ot([tt({ mode: "boolean" })], $r.prototype, "activeindicator", void 0),
    Ot([x], $r.prototype, "activeIndicatorRef", void 0),
    Ht($r, Tt);
const Fr = Y`
    <template slot="tab" role="tab">
        <slot></slot>
    </template>
`;
class Dr extends ct {}
const Pr = Y`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`;
class Tr extends ct {}
var Er, Ar;
!(function(t) {
    (t.filled = "filled"), (t.outline = "outline");
})(Er || (Er = {})),
    (function(t) {
        (t.none = "none"),
            (t.both = "both"),
            (t.horizontal = "horizontal"),
            (t.vertical = "vertical");
    })(Ar || (Ar = {}));
class Sr extends yo {
    constructor() {
        super(...arguments),
            (this.appearance = Er.outline),
            (this.resize = Ar.none),
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
Ot([tt], Sr.prototype, "appearance", void 0),
    Ot([tt({ mode: "boolean" })], Sr.prototype, "readOnly", void 0),
    Ot([tt], Sr.prototype, "resize", void 0),
    Ot([tt({ mode: "boolean" })], Sr.prototype, "autofocus", void 0),
    Ot([tt({ converter: Z, mode: "fromView" })], Sr.prototype, "cols", void 0),
    Ot([tt({ attribute: "form" })], Sr.prototype, "formId", void 0),
    Ot([tt], Sr.prototype, "list", void 0),
    Ot([tt({ converter: Z })], Sr.prototype, "maxlength", void 0),
    Ot([tt({ converter: Z })], Sr.prototype, "minlength", void 0),
    Ot([tt], Sr.prototype, "name", void 0),
    Ot([tt], Sr.prototype, "placeholder", void 0),
    Ot([tt({ converter: Z, mode: "fromView" })], Sr.prototype, "rows", void 0),
    Ot([tt({ mode: "boolean" })], Sr.prototype, "spellcheck", void 0),
    Ot([x], Sr.prototype, "defaultSlottedNodes", void 0);
const Or = Y`
    <template
        class="
            ${t => t.appearance}
            ${t => (t.readOnly ? "readonly" : "")}
            ${t => (t.resize !== Ar.none ? "resize-" + t.resize : "")}"
    >
        <label part="label" for="control" class="${t =>
            t.defaultSlottedNodes && t.defaultSlottedNodes.length
                ? "label"
                : "label label__hidden"}">
            <slot ${Pt("defaultSlottedNodes")}></slot>
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
            ${wt("textarea")}
        ></textarea>
    </template>
`,
    Hr = Y`
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
            <slot ${Pt("defaultSlottedNodes")}></slot>
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
                ${wt("control")}
            />
            ${Et}
        </div>
    </template>
`;
var Mr, Br;
!(function(t) {
    (t.filled = "filled"), (t.outline = "outline");
})(Mr || (Mr = {})),
    (function(t) {
        (t.email = "email"),
            (t.password = "password"),
            (t.tel = "tel"),
            (t.text = "text"),
            (t.url = "url");
    })(Br || (Br = {}));
class Lr extends yo {
    constructor() {
        super(),
            (this.appearance = Mr.outline),
            (this.type = Br.text),
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
Ot([tt], Lr.prototype, "appearance", void 0),
    Ot(
        [tt({ attribute: "readonly", mode: "boolean" })],
        Lr.prototype,
        "readOnly",
        void 0
    ),
    Ot([tt({ mode: "boolean" })], Lr.prototype, "autofocus", void 0),
    Ot([tt], Lr.prototype, "placeholder", void 0),
    Ot([tt], Lr.prototype, "type", void 0),
    Ot([tt], Lr.prototype, "list", void 0),
    Ot([tt({ converter: Z })], Lr.prototype, "maxlength", void 0),
    Ot([tt({ converter: Z })], Lr.prototype, "minlength", void 0),
    Ot([tt], Lr.prototype, "pattern", void 0),
    Ot([tt({ converter: Z })], Lr.prototype, "size", void 0),
    Ot([tt({ mode: "boolean" })], Lr.prototype, "spellcheck", void 0),
    Ot([x], Lr.prototype, "defaultSlottedNodes", void 0),
    Ht(Lr, Tt);
const Rr =
        "box-shadow: 0 0 calc((var(--elevation) * 0.225px) + 2px) rgba(0, 0, 0, calc(.11 * (2 - var(--background-luminance, 1)))), 0 calc(var(--elevation) * 0.4px) calc((var(--elevation) * 0.9px)) rgba(0, 0, 0, calc(.13 * (2 - var(--background-luminance, 1))));",
    Nr = "(var(--base-height-multiplier) + var(--density)) * var(--design-unit)",
    Ir = xt`
    ${To("inline-block")} :host {
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
        padding: 0 calc((10 + (var(--design-unit) * 2 * var(--density))) * 1px);
        height: calc(${Nr} * 1px);
        min-width: calc(${Nr} * 1px);
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

    .control:${Eo} {
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
    zr = xt`
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

    :host(.accent) .control:${Eo} {
        box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset var(--neutral-focus-inner-accent);
    }
`,
    jr = xt`
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
    :host(.hypertext) .control:${Eo} {
        border-bottom: calc(var(--focus-outline-width) * 1px) solid var(--neutral-focus);
    }
`,
    _r = xt`
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

    :host(.lightweight) .control:${Eo} .content::before {
        background: var(--neutral-foreground-rest);
        height: calc(var(--focus-outline-width) * 1px);
    }
`,
    Vr = xt`
    :host(.outline) .control {
        background: transparent;
        border-color: var(--accent-fill-rest);
    }

    :host(.outline) .control:hover {
        border-color: var(--accent-fill-hover);
    }

    :host(.outline) .control:active {
        border-color: var(--accent-fill-active);
    }

    :host(.outline) .control:${Eo} {
        border: calc(var(--outline-width) * 1px) solid var(--neutral-focus);
        box-shadow: 0 0 0 calc((var(--focus-outline-width) - var(--outline-width)) * 1px) var(--neutral-focus);
    }
`,
    Gr = xt`
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
    qr = {
        typeRampMinus2FontSize: "10px",
        typeRampMinus2LineHeight: "16px",
        typeRampMinus1FontSize: "12px",
        typeRampMinus1LineHeight: "16px",
        typeRampBaseFontSize: "14px",
        typeRampBaseLineHeight: "20px",
        typeRampPlus1FontSize: "16px",
        typeRampPlus1LineHeight: "24px",
        typeRampPlus2FontSize: "20px",
        typeRampPlus2LineHeight: "28px",
        typeRampPlus3FontSize: "28px",
        typeRampPlus3LineHeight: "36px",
        typeRampPlus4FontSize: "34px",
        typeRampPlus4LineHeight: "44px",
        typeRampPlus5FontSize: "46px",
        typeRampPlus5LineHeight: "56px",
        typeRampPlus6FontSize: "60px",
        typeRampPlus6LineHeight: "72px",
        backgroundColor: "#181818",
        density: 0,
        designUnit: 4,
        baseHeightMultiplier: 10,
        baseHorizontalSpacingMultiplier: 3,
        cornerRadius: 3,
        focusOutlineWidth: 2,
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
            "#FEFBFC",
            "#FEF7FA",
            "#FDF4F7",
            "#FDF0F5",
            "#FCECF2",
            "#FBE8EF",
            "#FBE5ED",
            "#FAE1EA",
            "#FADDE7",
            "#F9D9E5",
            "#F8D6E2",
            "#F8D2E0",
            "#F7CEDD",
            "#F7CADA",
            "#F6C7D8",
            "#F5C3D5",
            "#F5BFD2",
            "#F4BBD0",
            "#F3B8CD",
            "#F3B4CB",
            "#F2B0C8",
            "#F2ACC5",
            "#F1A9C3",
            "#F0A5C0",
            "#F0A1BD",
            "#EF9DBB",
            "#EF9AB8",
            "#EE96B6",
            "#ED92B3",
            "#ED8EB0",
            "#EC8BAE",
            "#EC87AB",
            "#EB83A8",
            "#EA7FA6",
            "#EA7CA3",
            "#E978A1",
            "#E9749E",
            "#E8709B",
            "#E76D99",
            "#E76996",
            "#E66593",
            "#E66191",
            "#E55E8E",
            "#E45A8C",
            "#E45689",
            "#E35286",
            "#E24F84",
            "#E24B81",
            "#E1477E",
            "#E1437C",
            "#E04079",
            "#DF3C77",
            "#DF3874",
            "#DE3471",
            "#DE316F",
            "#DD2D6C",
            "#DC2969",
            "#DC2567",
            "#DB2264",
            "#DB1E62",
            "#DA1A5F",
            "#D4195C",
            "#CD1859",
            "#C71857",
            "#C01754",
            "#BA1651",
            "#B3154E",
            "#AD154B",
            "#A71449",
            "#A01346",
            "#9A1243",
            "#931240",
            "#8D113D",
            "#86103B",
            "#800F38",
            "#7A0F35",
            "#730E32",
            "#6D0D2F",
            "#660C2D",
            "#600B2A",
            "#590B27",
            "#530A24",
            "#4D0921",
            "#46081F",
            "#40081C",
            "#3B071A",
            "#350617",
            "#300615",
            "#2B0513",
            "#260511",
            "#21040E",
            "#1C030C",
            "#000000",
        ],
        accentBaseColor: "#DA1A5F",
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
        neutralForegroundHoverDelta: 0,
        neutralForegroundActiveDelta: 0,
        neutralForegroundFocusDelta: 0,
        neutralDividerRestDelta: 8,
        neutralOutlineRestDelta: 25,
        neutralOutlineHoverDelta: 40,
        neutralOutlineActiveDelta: 16,
        neutralOutlineFocusDelta: 25,
    };
function Wr(t, e) {
    return "function" == typeof t ? t(e) : t;
}
function Ur(t) {
    return e => (e && void 0 !== e[t] ? e[t] : qr[t]);
}
const Kr = Ur("backgroundColor"),
    Xr = Ur("accentBaseColor"),
    Yr = Ur("neutralPalette"),
    Qr = Ur("accentPalette"),
    Zr = Ur("accentFillHoverDelta"),
    Jr = Ur("accentFillActiveDelta"),
    ti = Ur("accentFillFocusDelta"),
    ei = Ur("accentFillSelectedDelta"),
    oi = Ur("accentForegroundRestDelta"),
    ri = Ur("accentForegroundHoverDelta"),
    ii = Ur("accentForegroundActiveDelta"),
    ni = Ur("accentForegroundFocusDelta"),
    si = Ur("neutralFillRestDelta"),
    ai = Ur("neutralFillHoverDelta"),
    li = Ur("neutralFillActiveDelta"),
    ci = Ur("neutralFillFocusDelta"),
    di = Ur("neutralFillSelectedDelta"),
    hi = Ur("neutralFillInputRestDelta"),
    ui = Ur("neutralFillInputHoverDelta"),
    pi = Ur("neutralFillInputActiveDelta"),
    fi = Ur("neutralFillInputFocusDelta"),
    vi = Ur("neutralFillInputSelectedDelta"),
    bi = Ur("neutralFillStealthRestDelta"),
    gi = Ur("neutralFillStealthHoverDelta"),
    mi = Ur("neutralFillStealthActiveDelta"),
    yi = Ur("neutralFillStealthFocusDelta"),
    xi = Ur("neutralFillStealthSelectedDelta"),
    ki = Ur("neutralFillToggleHoverDelta"),
    wi = Ur("neutralFillToggleActiveDelta"),
    Ci = Ur("neutralFillToggleFocusDelta"),
    $i = Ur("baseLayerLuminance"),
    Fi = Ur("neutralFillCardDelta"),
    Di = Ur("neutralForegroundHoverDelta"),
    Pi = Ur("neutralForegroundActiveDelta"),
    Ti = Ur("neutralForegroundFocusDelta"),
    Ei = Ur("neutralDividerRestDelta"),
    Ai = Ur("neutralOutlineRestDelta"),
    Si = Ur("neutralOutlineHoverDelta"),
    Oi = Ur("neutralOutlineActiveDelta"),
    Hi = Ur("neutralOutlineFocusDelta");
function Mi(t, e, o) {
    return isNaN(t) || t <= e ? e : t >= o ? o : t;
}
function Bi(t, e, o) {
    return isNaN(t) || t <= e ? 0 : t >= o ? 1 : t / (o - e);
}
function Li(t, e, o) {
    return isNaN(t) ? e : e + t * (o - e);
}
function Ri(t) {
    return t * (Math.PI / 180);
}
function Ni(t, e, o) {
    return isNaN(t) || t <= 0 ? e : t >= 1 ? o : e + t * (o - e);
}
function Ii(t, e, o) {
    if (t <= 0) return e % 360;
    if (t >= 1) return o % 360;
    const r = (e - o + 360) % 360;
    return r <= (o - e + 360) % 360 ? (e - r * t + 360) % 360 : (e + r * t + 360) % 360;
}
function zi(t, e) {
    const o = Math.pow(10, e);
    return Math.round(t * o) / o;
}
class ji {
    static fromObject(t) {
        return !t || isNaN(t.h) || isNaN(t.s) || isNaN(t.l)
            ? null
            : new ji(t.h, t.s, t.l);
    }
    constructor(t, e, o) {
        (this.h = t), (this.s = e), (this.l = o);
    }
    equalValue(t) {
        return this.h === t.h && this.s === t.s && this.l === t.l;
    }
    roundToPrecision(t) {
        return new ji(zi(this.h, t), zi(this.s, t), zi(this.l, t));
    }
    toObject() {
        return { h: this.h, s: this.s, l: this.l };
    }
}
class _i {
    static fromObject(t) {
        return !t || isNaN(t.h) || isNaN(t.s) || isNaN(t.v)
            ? null
            : new _i(t.h, t.s, t.v);
    }
    constructor(t, e, o) {
        (this.h = t), (this.s = e), (this.v = o);
    }
    equalValue(t) {
        return this.h === t.h && this.s === t.s && this.v === t.v;
    }
    roundToPrecision(t) {
        return new _i(zi(this.h, t), zi(this.s, t), zi(this.v, t));
    }
    toObject() {
        return { h: this.h, s: this.s, v: this.v };
    }
}
class Vi {
    constructor(t, e, o) {
        (this.l = t), (this.a = e), (this.b = o);
    }
    static fromObject(t) {
        return !t || isNaN(t.l) || isNaN(t.a) || isNaN(t.b)
            ? null
            : new Vi(t.l, t.a, t.b);
    }
    equalValue(t) {
        return this.l === t.l && this.a === t.a && this.b === t.b;
    }
    roundToPrecision(t) {
        return new Vi(zi(this.l, t), zi(this.a, t), zi(this.b, t));
    }
    toObject() {
        return { l: this.l, a: this.a, b: this.b };
    }
}
(Vi.epsilon = 216 / 24389), (Vi.kappa = 24389 / 27);
class Gi {
    static fromObject(t) {
        return !t || isNaN(t.l) || isNaN(t.c) || isNaN(t.h)
            ? null
            : new Gi(t.l, t.c, t.h);
    }
    constructor(t, e, o) {
        (this.l = t), (this.c = e), (this.h = o);
    }
    equalValue(t) {
        return this.l === t.l && this.c === t.c && this.h === t.h;
    }
    roundToPrecision(t) {
        return new Gi(zi(this.l, t), zi(this.c, t), zi(this.h, t));
    }
    toObject() {
        return { l: this.l, c: this.c, h: this.h };
    }
}
class qi {
    static fromObject(t) {
        return !t || isNaN(t.r) || isNaN(t.g) || isNaN(t.b)
            ? null
            : new qi(t.r, t.g, t.b, t.a);
    }
    constructor(t, e, o, r) {
        (this.r = t),
            (this.g = e),
            (this.b = o),
            (this.a = "number" != typeof r || isNaN(r) ? 1 : r);
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
        return `rgb(${Math.round(Li(this.r, 0, 255))},${Math.round(
            Li(this.g, 0, 255)
        )},${Math.round(Li(this.b, 0, 255))})`;
    }
    toStringWebRGBA() {
        return `rgba(${Math.round(Li(this.r, 0, 255))},${Math.round(
            Li(this.g, 0, 255)
        )},${Math.round(Li(this.b, 0, 255))},${Mi(this.a, 0, 1)})`;
    }
    roundToPrecision(t) {
        return new qi(zi(this.r, t), zi(this.g, t), zi(this.b, t), zi(this.a, t));
    }
    clamp() {
        return new qi(
            Mi(this.r, 0, 1),
            Mi(this.g, 0, 1),
            Mi(this.b, 0, 1),
            Mi(this.a, 0, 1)
        );
    }
    toObject() {
        return { r: this.r, g: this.g, b: this.b, a: this.a };
    }
    formatHexValue(t) {
        return (function(t) {
            const e = Math.round(Mi(t, 0, 255)).toString(16);
            return 1 === e.length ? "0" + e : e;
        })(Li(t, 0, 255));
    }
}
class Wi {
    constructor(t, e, o) {
        (this.x = t), (this.y = e), (this.z = o);
    }
    static fromObject(t) {
        return !t || isNaN(t.x) || isNaN(t.y) || isNaN(t.z)
            ? null
            : new Wi(t.x, t.y, t.z);
    }
    equalValue(t) {
        return this.x === t.x && this.y === t.y && this.z === t.z;
    }
    roundToPrecision(t) {
        return new Wi(zi(this.x, t), zi(this.y, t), zi(this.z, t));
    }
    toObject() {
        return { x: this.x, y: this.y, z: this.z };
    }
}
function Ui(t) {
    return 0.2126 * t.r + 0.7152 * t.g + 0.0722 * t.b;
}
function Ki(t) {
    function e(t) {
        return t <= 0.03928 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
    }
    return Ui(new qi(e(t.r), e(t.g), e(t.b), 1));
}
Wi.whitePoint = new Wi(0.95047, 1, 1.08883);
const Xi = (t, e) => (t + 0.05) / (e + 0.05);
function Yi(t, e) {
    const o = Ki(t),
        r = Ki(e);
    return o > r ? Xi(o, r) : Xi(r, o);
}
function Qi(t) {
    const e = Math.max(t.r, t.g, t.b),
        o = Math.min(t.r, t.g, t.b),
        r = e - o;
    let i = 0;
    0 !== r &&
        (i =
            e === t.r
                ? (((t.g - t.b) / r) % 6) * 60
                : e === t.g
                ? 60 * ((t.b - t.r) / r + 2)
                : 60 * ((t.r - t.g) / r + 4)),
        i < 0 && (i += 360);
    const n = (e + o) / 2;
    let s = 0;
    return 0 !== r && (s = r / (1 - Math.abs(2 * n - 1))), new ji(i, s, n);
}
function Zi(t, e = 1) {
    const o = (1 - Math.abs(2 * t.l - 1)) * t.s,
        r = o * (1 - Math.abs(((t.h / 60) % 2) - 1)),
        i = t.l - o / 2;
    let n = 0,
        s = 0,
        a = 0;
    return (
        t.h < 60
            ? ((n = o), (s = r), (a = 0))
            : t.h < 120
            ? ((n = r), (s = o), (a = 0))
            : t.h < 180
            ? ((n = 0), (s = o), (a = r))
            : t.h < 240
            ? ((n = 0), (s = r), (a = o))
            : t.h < 300
            ? ((n = r), (s = 0), (a = o))
            : t.h < 360 && ((n = o), (s = 0), (a = r)),
        new qi(n + i, s + i, a + i, e)
    );
}
function Ji(t) {
    const e = Math.max(t.r, t.g, t.b),
        o = e - Math.min(t.r, t.g, t.b);
    let r = 0;
    0 !== o &&
        (r =
            e === t.r
                ? (((t.g - t.b) / o) % 6) * 60
                : e === t.g
                ? 60 * ((t.b - t.r) / o + 2)
                : 60 * ((t.r - t.g) / o + 4)),
        r < 0 && (r += 360);
    let i = 0;
    return 0 !== e && (i = o / e), new _i(r, i, e);
}
function tn(t) {
    let e = 0;
    (0 === t.b && 0 === t.a) || (e = Math.atan2(t.b, t.a) * (180 / Math.PI)),
        e < 0 && (e += 360);
    const o = Math.sqrt(t.a * t.a + t.b * t.b);
    return new Gi(t.l, o, e);
}
function en(t) {
    function e(t) {
        return t <= 0.04045 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
    }
    const o = e(t.r),
        r = e(t.g),
        i = e(t.b);
    return new Wi(
        0.4124564 * o + 0.3575761 * r + 0.1804375 * i,
        0.2126729 * o + 0.7151522 * r + 0.072175 * i,
        0.0193339 * o + 0.119192 * r + 0.9503041 * i
    );
}
function on(t, e = 1) {
    function o(t) {
        return t <= 0.0031308 ? 12.92 * t : 1.055 * Math.pow(t, 1 / 2.4) - 0.055;
    }
    const r = o(3.2404542 * t.x - 1.5371385 * t.y - 0.4985314 * t.z),
        i = o(-0.969266 * t.x + 1.8760108 * t.y + 0.041556 * t.z),
        n = o(0.0556434 * t.x - 0.2040259 * t.y + 1.0572252 * t.z);
    return new qi(r, i, n, e);
}
function rn(t) {
    return (function(t) {
        function e(t) {
            return t > Vi.epsilon ? Math.pow(t, 1 / 3) : (Vi.kappa * t + 16) / 116;
        }
        const o = e(t.x / Wi.whitePoint.x),
            r = e(t.y / Wi.whitePoint.y),
            i = e(t.z / Wi.whitePoint.z);
        return new Vi(116 * r - 16, 500 * (o - r), 200 * (r - i));
    })(en(t));
}
function nn(t, e = 1) {
    return on(
        (function(t) {
            const e = (t.l + 16) / 116,
                o = e + t.a / 500,
                r = e - t.b / 200,
                i = Math.pow(o, 3),
                n = Math.pow(e, 3),
                s = Math.pow(r, 3);
            let a = 0;
            a = i > Vi.epsilon ? i : (116 * o - 16) / Vi.kappa;
            let l = 0;
            l = t.l > Vi.epsilon * Vi.kappa ? n : t.l / Vi.kappa;
            let c = 0;
            return (
                (c = s > Vi.epsilon ? s : (116 * r - 16) / Vi.kappa),
                (a = Wi.whitePoint.x * a),
                (l = Wi.whitePoint.y * l),
                (c = Wi.whitePoint.z * c),
                new Wi(a, l, c)
            );
        })(t),
        e
    );
}
function sn(t) {
    return tn(rn(t));
}
function an(t, e = 1) {
    return nn(
        (function(t) {
            let e = 0,
                o = 0;
            return (
                0 !== t.h &&
                    ((e = Math.cos(Ri(t.h)) * t.c), (o = Math.sin(Ri(t.h)) * t.c)),
                new Vi(t.l, e, o)
            );
        })(t),
        e
    );
}
function ln(t, e, o = 18) {
    const r = sn(t);
    let i = r.c + e * o;
    return i < 0 && (i = 0), an(new Gi(r.l, i, r.h));
}
function cn(t, e) {
    return t * e;
}
function dn(t, e) {
    return new qi(cn(t.r, e.r), cn(t.g, e.g), cn(t.b, e.b), 1);
}
function hn(t, e) {
    return Mi(t < 0.5 ? 2 * e * t : 1 - 2 * (1 - e) * (1 - t), 0, 1);
}
function un(t, e) {
    return new qi(hn(t.r, e.r), hn(t.g, e.g), hn(t.b, e.b), 1);
}
var pn, fn;
function vn(t, e, o, r) {
    if (isNaN(t) || t <= 0) return o;
    if (t >= 1) return r;
    switch (e) {
        case fn.HSL:
            return Zi(
                (function(t, e, o) {
                    return isNaN(t) || t <= 0
                        ? e
                        : t >= 1
                        ? o
                        : new ji(Ii(t, e.h, o.h), Ni(t, e.s, o.s), Ni(t, e.l, o.l));
                })(t, Qi(o), Qi(r))
            );
        case fn.HSV:
            return (function(t, e = 1) {
                const o = t.s * t.v,
                    r = o * (1 - Math.abs(((t.h / 60) % 2) - 1)),
                    i = t.v - o;
                let n = 0,
                    s = 0,
                    a = 0;
                return (
                    t.h < 60
                        ? ((n = o), (s = r), (a = 0))
                        : t.h < 120
                        ? ((n = r), (s = o), (a = 0))
                        : t.h < 180
                        ? ((n = 0), (s = o), (a = r))
                        : t.h < 240
                        ? ((n = 0), (s = r), (a = o))
                        : t.h < 300
                        ? ((n = r), (s = 0), (a = o))
                        : t.h < 360 && ((n = o), (s = 0), (a = r)),
                    new qi(n + i, s + i, a + i, e)
                );
            })(
                (function(t, e, o) {
                    return isNaN(t) || t <= 0
                        ? e
                        : t >= 1
                        ? o
                        : new _i(Ii(t, e.h, o.h), Ni(t, e.s, o.s), Ni(t, e.v, o.v));
                })(t, Ji(o), Ji(r))
            );
        case fn.XYZ:
            return on(
                (function(t, e, o) {
                    return isNaN(t) || t <= 0
                        ? e
                        : t >= 1
                        ? o
                        : new Wi(Ni(t, e.x, o.x), Ni(t, e.y, o.y), Ni(t, e.z, o.z));
                })(t, en(o), en(r))
            );
        case fn.LAB:
            return nn(
                (function(t, e, o) {
                    return isNaN(t) || t <= 0
                        ? e
                        : t >= 1
                        ? o
                        : new Vi(Ni(t, e.l, o.l), Ni(t, e.a, o.a), Ni(t, e.b, o.b));
                })(t, rn(o), rn(r))
            );
        case fn.LCH:
            return an(
                (function(t, e, o) {
                    return isNaN(t) || t <= 0
                        ? e
                        : t >= 1
                        ? o
                        : new Gi(Ni(t, e.l, o.l), Ni(t, e.c, o.c), Ii(t, e.h, o.h));
                })(t, sn(o), sn(r))
            );
        default:
            return (function(t, e, o) {
                return isNaN(t) || t <= 0
                    ? e
                    : t >= 1
                    ? o
                    : new qi(
                          Ni(t, e.r, o.r),
                          Ni(t, e.g, o.g),
                          Ni(t, e.b, o.b),
                          Ni(t, e.a, o.a)
                      );
            })(t, o, r);
    }
}
!(function(t) {
    (t[(t.Burn = 0)] = "Burn"),
        (t[(t.Color = 1)] = "Color"),
        (t[(t.Darken = 2)] = "Darken"),
        (t[(t.Dodge = 3)] = "Dodge"),
        (t[(t.Lighten = 4)] = "Lighten"),
        (t[(t.Multiply = 5)] = "Multiply"),
        (t[(t.Overlay = 6)] = "Overlay"),
        (t[(t.Screen = 7)] = "Screen");
})(pn || (pn = {})),
    (function(t) {
        (t[(t.RGB = 0)] = "RGB"),
            (t[(t.HSL = 1)] = "HSL"),
            (t[(t.HSV = 2)] = "HSV"),
            (t[(t.XYZ = 3)] = "XYZ"),
            (t[(t.LAB = 4)] = "LAB"),
            (t[(t.LCH = 5)] = "LCH");
    })(fn || (fn = {}));
class bn {
    static createBalancedColorScale(t) {
        if (null == t || 0 === t.length)
            throw new Error("The colors argument must be non-empty");
        const e = new Array(t.length);
        for (let o = 0; o < t.length; o++)
            0 === o
                ? (e[o] = { color: t[o], position: 0 })
                : o === t.length - 1
                ? (e[o] = { color: t[o], position: 1 })
                : (e[o] = { color: t[o], position: o * (1 / (t.length - 1)) });
        return new bn(e);
    }
    constructor(t) {
        if (null == t || 0 === t.length)
            throw new Error("The stops argument must be non-empty");
        this.stops = this.sortColorScaleStops(t);
    }
    getColor(t, e = fn.RGB) {
        if (1 === this.stops.length) return this.stops[0].color;
        if (t <= 0) return this.stops[0].color;
        if (t >= 1) return this.stops[this.stops.length - 1].color;
        let o = 0;
        for (let e = 0; e < this.stops.length; e++)
            this.stops[e].position <= t && (o = e);
        let r = o + 1;
        return (
            r >= this.stops.length && (r = this.stops.length - 1),
            vn(
                (t - this.stops[o].position) *
                    (1 / (this.stops[r].position - this.stops[o].position)),
                e,
                this.stops[o].color,
                this.stops[r].color
            )
        );
    }
    trim(t, e, o = fn.RGB) {
        if (t < 0 || e > 1 || e < t) throw new Error("Invalid bounds");
        if (t === e) return new bn([{ color: this.getColor(t, o), position: 0 }]);
        const r = [];
        for (let o = 0; o < this.stops.length; o++)
            this.stops[o].position >= t &&
                this.stops[o].position <= e &&
                r.push(this.stops[o]);
        if (0 === r.length)
            return new bn([
                { color: this.getColor(t), position: t },
                { color: this.getColor(e), position: e },
            ]);
        r[0].position !== t && r.unshift({ color: this.getColor(t), position: t }),
            r[r.length - 1].position !== e &&
                r.push({ color: this.getColor(e), position: e });
        const i = e - t,
            n = new Array(r.length);
        for (let e = 0; e < r.length; e++)
            n[e] = { color: r[e].color, position: (r[e].position - t) / i };
        return new bn(n);
    }
    findNextColor(t, e, o = !1, r = fn.RGB, i = 0.005, n = 32) {
        isNaN(t) || t <= 0 ? (t = 0) : t >= 1 && (t = 1);
        const s = this.getColor(t, r),
            a = o ? 0 : 1;
        if (Yi(s, this.getColor(a, r)) <= e) return a;
        let l = o ? 0 : t,
            c = o ? t : 0,
            d = a,
            h = 0;
        for (; h <= n; ) {
            d = Math.abs(c - l) / 2 + l;
            const t = Yi(s, this.getColor(d, r));
            if (Math.abs(t - e) <= i) return d;
            t > e ? (o ? (l = d) : (c = d)) : o ? (c = d) : (l = d), h++;
        }
        return d;
    }
    clone() {
        const t = new Array(this.stops.length);
        for (let e = 0; e < t.length; e++)
            t[e] = { color: this.stops[e].color, position: this.stops[e].position };
        return new bn(t);
    }
    sortColorScaleStops(t) {
        return t.sort((t, e) => {
            const o = t.position,
                r = e.position;
            return o < r ? -1 : o > r ? 1 : 0;
        });
    }
}
const gn = /^rgb\(\s*((?:(?:25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*,\s*){2}(?:25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*)\)$/i,
    mn = /^#((?:[0-9a-f]{6}|[0-9a-f]{3}))$/i;
function yn(t) {
    const e = mn.exec(t);
    if (null === e) return null;
    let o = e[1];
    if (3 === o.length) {
        const t = o.charAt(0),
            e = o.charAt(1),
            r = o.charAt(2);
        o = t.concat(t, e, e, r, r);
    }
    const r = parseInt(o, 16);
    return isNaN(r)
        ? null
        : new qi(
              Bi((16711680 & r) >>> 16, 0, 255),
              Bi((65280 & r) >>> 8, 0, 255),
              Bi(255 & r, 0, 255),
              1
          );
}
class xn {
    constructor(t) {
        (this.config = Object.assign({}, xn.defaultPaletteConfig, t)),
            (this.palette = []),
            this.updatePaletteColors();
    }
    updatePaletteGenerationValues(t) {
        let e = !1;
        for (const o in t)
            this.config[o] &&
                (this.config[o].equalValue
                    ? this.config[o].equalValue(t[o]) ||
                      ((this.config[o] = t[o]), (e = !0))
                    : t[o] !== this.config[o] && ((this.config[o] = t[o]), (e = !0)));
        return e && this.updatePaletteColors(), e;
    }
    updatePaletteColors() {
        const t = this.generatePaletteColorScale();
        for (let e = 0; e < this.config.steps; e++)
            this.palette[e] = t.getColor(
                e / (this.config.steps - 1),
                this.config.interpolationMode
            );
    }
    generatePaletteColorScale() {
        const t = Qi(this.config.baseColor),
            e = new bn([
                { position: 0, color: this.config.scaleColorLight },
                { position: 0.5, color: this.config.baseColor },
                { position: 1, color: this.config.scaleColorDark },
            ]).trim(this.config.clipLight, 1 - this.config.clipDark);
        let o = e.getColor(0),
            r = e.getColor(1);
        if (
            (t.s >= this.config.saturationAdjustmentCutoff &&
                ((o = ln(o, this.config.saturationLight)),
                (r = ln(r, this.config.saturationDark))),
            0 !== this.config.multiplyLight)
        ) {
            const t = dn(this.config.baseColor, o);
            o = vn(this.config.multiplyLight, this.config.interpolationMode, o, t);
        }
        if (0 !== this.config.multiplyDark) {
            const t = dn(this.config.baseColor, r);
            r = vn(this.config.multiplyDark, this.config.interpolationMode, r, t);
        }
        if (0 !== this.config.overlayLight) {
            const t = un(this.config.baseColor, o);
            o = vn(this.config.overlayLight, this.config.interpolationMode, o, t);
        }
        if (0 !== this.config.overlayDark) {
            const t = un(this.config.baseColor, r);
            r = vn(this.config.overlayDark, this.config.interpolationMode, r, t);
        }
        return this.config.baseScalePosition
            ? this.config.baseScalePosition <= 0
                ? new bn([
                      { position: 0, color: this.config.baseColor },
                      { position: 1, color: r.clamp() },
                  ])
                : this.config.baseScalePosition >= 1
                ? new bn([
                      { position: 0, color: o.clamp() },
                      { position: 1, color: this.config.baseColor },
                  ])
                : new bn([
                      { position: 0, color: o.clamp() },
                      {
                          position: this.config.baseScalePosition,
                          color: this.config.baseColor,
                      },
                      { position: 1, color: r.clamp() },
                  ])
            : new bn([
                  { position: 0, color: o.clamp() },
                  { position: 0.5, color: this.config.baseColor },
                  { position: 1, color: r.clamp() },
              ]);
    }
}
(xn.defaultPaletteConfig = {
    baseColor: yn("#808080"),
    steps: 11,
    interpolationMode: fn.RGB,
    scaleColorLight: new qi(1, 1, 1, 1),
    scaleColorDark: new qi(0, 0, 0, 1),
    clipLight: 0.185,
    clipDark: 0.16,
    saturationAdjustmentCutoff: 0.05,
    saturationLight: 0.35,
    saturationDark: 1.25,
    overlayLight: 0,
    overlayDark: 0.25,
    multiplyLight: 0,
    multiplyDark: 0,
    baseScalePosition: 0.5,
}),
    (xn.greyscalePaletteConfig = {
        baseColor: yn("#808080"),
        steps: 11,
        interpolationMode: fn.RGB,
        scaleColorLight: new qi(1, 1, 1, 1),
        scaleColorDark: new qi(0, 0, 0, 1),
        clipLight: 0,
        clipDark: 0,
        saturationAdjustmentCutoff: 0,
        saturationLight: 0,
        saturationDark: 0,
        overlayLight: 0,
        overlayDark: 0,
        multiplyLight: 0,
        multiplyDark: 0,
        baseScalePosition: 0.5,
    });
xn.defaultPaletteConfig.scaleColorLight, xn.defaultPaletteConfig.scaleColorDark;
class kn {
    constructor(t) {
        (this.palette = []),
            (this.config = Object.assign({}, kn.defaultPaletteConfig, t)),
            this.regenPalettes();
    }
    regenPalettes() {
        let t = this.config.steps;
        (isNaN(t) || t < 3) && (t = 3);
        const e = new qi(0.14, 0.14, 0.14, 1),
            o = new xn(
                Object.assign({}, xn.greyscalePaletteConfig, {
                    baseColor: e,
                    baseScalePosition: 86 / 94,
                    steps: t,
                })
            ).palette,
            r = (Ui(this.config.baseColor) + Qi(this.config.baseColor).l) / 2,
            i = this.matchRelativeLuminanceIndex(r, o) / (t - 1),
            n = this.matchRelativeLuminanceIndex(0.14, o) / (t - 1),
            s = Qi(this.config.baseColor),
            a = Zi(ji.fromObject({ h: s.h, s: s.s, l: 0.14 })),
            l = Zi(ji.fromObject({ h: s.h, s: s.s, l: 0.06 })),
            c = new Array(5);
        (c[0] = { position: 0, color: new qi(1, 1, 1, 1) }),
            (c[1] = { position: i, color: this.config.baseColor }),
            (c[2] = { position: n, color: a }),
            (c[3] = { position: 0.99, color: l }),
            (c[4] = { position: 1, color: new qi(0, 0, 0, 1) });
        const d = new bn(c);
        this.palette = new Array(t);
        for (let e = 0; e < t; e++) {
            const o = d.getColor(e / (t - 1), fn.RGB);
            this.palette[e] = o;
        }
    }
    matchRelativeLuminanceIndex(t, e) {
        let o = Number.MAX_VALUE,
            r = 0,
            i = 0;
        const n = e.length;
        for (; i < n; i++) {
            const n = Math.abs(Ui(e[i]) - t);
            n < o && ((o = n), (r = i));
        }
        return r;
    }
}
var wn;
function Cn(t) {
    const e = oo(t);
    return function(t) {
        return "function" == typeof t
            ? o => e(Object.assign({}, o, { backgroundColor: t(o) }))
            : e(t);
    };
}
function $n(t, e) {
    const o = oo(e);
    return e =>
        "function" == typeof e
            ? r => o(Object.assign({}, r, { backgroundColor: e(r) }))[t]
            : o(e)[t];
}
(kn.defaultPaletteConfig = { baseColor: yn("#808080"), steps: 94 }),
    (function(t) {
        (t.rest = "rest"),
            (t.hover = "hover"),
            (t.active = "active"),
            (t.focus = "focus"),
            (t.selected = "selected");
    })(wn || (wn = {}));
const Fn = oo(t => {
    let e = yn(t);
    if (null !== e) return e;
    if (
        ((e = (function(t) {
            const e = gn.exec(t);
            if (null === e) return null;
            const o = e[1].split(",");
            return new qi(
                Bi(Number(o[0]), 0, 255),
                Bi(Number(o[1]), 0, 255),
                Bi(Number(o[2]), 0, 255),
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
function Dn(t) {
    return (
        (e = t),
        mn.test(e) ||
            (function(t) {
                return gn.test(t);
            })(t)
    );
    var e;
}
const Pn = oo(
    (t, e) => Yi(Fn(t), Fn(e)),
    (t, e) => t + e
);
function Tn(t) {
    return Ki(Fn(t));
}
function En(...t) {
    return e =>
        Math.max.apply(
            null,
            t.map(t => t(e))
        );
}
const An = (t, e, o) => Math.min(Math.max(t, e), o);
var Sn;
function On(t) {
    return e => {
        switch (t) {
            case Sn.accent:
                return Qr(e);
            case Sn.neutral:
            default:
                return Yr(e);
        }
    };
}
function Hn(t, e) {
    return o => {
        if (!Dn(e)) return -1;
        const r = Wr(t, o),
            i = r.indexOf(e);
        return -1 !== i
            ? i
            : r.findIndex(t => {
                  return Dn(t) && ((o = t), Fn(e).equalValue(Fn(o)));
                  var o;
              });
    };
}
function Mn(t, e) {
    return o => {
        const r = Wr(t, o),
            i = Wr(e, o),
            n = Hn(r, i)(o);
        let s;
        if (-1 !== n) return n;
        try {
            s = Tn(i);
        } catch (t) {
            s = -1;
        }
        return -1 === s
            ? 0
            : r
                  .map((t, e) => ({ luminance: Tn(t), index: e }))
                  .reduce((t, e) =>
                      Math.abs(e.luminance - s) < Math.abs(t.luminance - s) ? e : t
                  ).index;
    };
}
function Bn(t) {
    return Tn(Kr(t)) <= (-0.1 + Math.sqrt(0.21)) / 2;
}
function Ln(t, e) {
    return "function" == typeof t
        ? o => e(o)[An(t(o), 0, e(o).length - 1)]
        : e[An(t, 0, e.length - 1)];
}
function Rn(t) {
    return (e, o) => r => Ln(Bn(r) ? Wr(o, r) : Wr(e, r), t(r));
}
function Nn(t) {
    return e => o => r => i => n => {
        const s = Wr(t, n),
            a = Wr(e, n),
            l = a.length,
            c = An(o(s, a, n), 0, l - 1),
            d = r(c, a, n);
        const h = [].concat(a),
            u = l - 1;
        let p = c;
        return (
            -1 === d && (h.reverse(), (p = u - p)),
            (function t(e, o, r = 0, i = e.length - 1) {
                if (i === r) return e[r];
                const n = Math.floor((i - r) / 2) + r;
                return o(e[n]) ? t(e, o, r, n) : t(e, o, n + 1, i);
            })(
                h,
                function(t) {
                    return i(Pn(s, t));
                },
                p,
                u
            )
        );
    };
}
function In(t, e, o) {
    return Mn(e, t)(o);
}
function zn(t) {
    return Mn(Yr, Kr(t))(t);
}
function jn(t, e, o, r, i, n) {
    return s => {
        const a = Wr(t, s),
            l = Bn(s) ? -1 : 1,
            c = Nn(Kr)(a)(In)(() => l)(((d = Wr(e, s)), t => t >= d))(s);
        var d;
        const h = Hn(t, c)(s),
            u = Wr(o, s),
            p = Wr(r, s),
            f = Wr(i, s),
            v = Wr(n, s);
        return (function(t, e, o, r, i, n, s) {
            const a = t + o * Math.abs(r - i),
                l = 1 === o ? r < i : o * r > o * i,
                c = l ? t : a,
                d = l ? a : t,
                h = c + o * n,
                u = c + o * s;
            return { rest: Ln(c, e), hover: Ln(d, e), active: Ln(h, e), focus: Ln(u, e) };
        })(h, a, l, u, p, f, v);
    };
}
!(function(t) {
    (t.neutral = "neutral"), (t.accent = "accent");
})(Sn || (Sn = {}));
const _n = Cn(jn(Yr, 14, 0, Di, Pi, Ti)),
    Vn = $n(wn.rest, _n),
    Gn = $n(wn.hover, _n),
    qn = $n(wn.active, _n),
    Wn = ($n(wn.focus, _n), Cn(jn(Yr, 4.5, 0, ki, wi, Ci))),
    Un = $n(wn.rest, Wn),
    Kn = $n(wn.hover, Wn),
    Xn = $n(wn.active, Wn),
    Yn = ($n(wn.focus, Wn), (t, e) => (Pn("#FFFFFF", t) >= e ? "#FFFFFF" : "#000000"));
function Qn(t) {
    return function(e) {
        return "function" == typeof e ? o => Yn(e(o), t) : Yn(Un(e), t);
    };
}
const Zn = Qn(4.5),
    Jn = Qn(3),
    ts = (t, e) => (Pn("#FFFFFF", t) >= e ? "#FFFFFF" : "#000000");
function es(t) {
    return function(e) {
        return "function" == typeof e ? o => ts(e(o), t) : ts(Xr(e), t);
    };
}
const os = es(4.5),
    rs = es(3);
function is(t) {
    return jn(Yr, t, 0, 0, 0, 0);
}
const ns = $n(wn.rest, Cn(is(4.5))),
    ss = $n(wn.rest, Cn(is(3)));
function as(t) {
    return e => {
        const o = Qr(e),
            r = Xr(e),
            i = Mn(Qr, r)(e),
            n = { rest: oi(e), hover: ri(e), active: ii(e), focus: ni(e) },
            s = Bn(e) ? -1 : 1,
            a =
                i +
                (1 === s ? Math.min(n.rest, n.hover) : Math.max(s * n.rest, s * n.hover)),
            l = Nn(Kr)(Qr)(() => a)(() => s)(e => e >= t)(e),
            c = Hn(Qr, l)(e),
            d = c + s * Math.abs(n.rest - n.hover),
            h = 1 === s ? n.rest < n.hover : s * n.rest > s * n.hover,
            u = h ? c : d,
            p = h ? d : c,
            f = u + s * n.active,
            v = u + s * n.focus;
        return { rest: Ln(u, o), hover: Ln(p, o), active: Ln(f, o), focus: Ln(v, o) };
    };
}
const ls = Cn(as(4.5)),
    cs = Cn(as(3)),
    ds = $n(wn.rest, ls),
    hs = $n(wn.hover, ls),
    us = $n(wn.active, ls),
    ps = ($n(wn.focus, ls), $n(wn.rest, cs)),
    fs = $n(wn.hover, cs),
    vs = $n(wn.active, cs),
    bs = ($n(wn.focus, cs), En(si, ai, li, ci));
function gs(t) {
    return e => {
        const o = zn(e);
        return Ln(o + (o >= bs(e) ? -1 : 1) * t(e), Yr(e));
    };
}
const ms = Cn(gs(si)),
    ys = Cn(gs(ai)),
    xs = Cn(gs(li)),
    ks = Cn(gs(ci)),
    ws = Cn(gs(di)),
    Cs = Cn(t => ({
        rest: ms(t),
        hover: ys(t),
        active: xs(t),
        focus: ks(t),
        selected: ws(t),
    })),
    $s = En(si, ai, li, ci, bi, gi, mi, yi);
function Fs(t) {
    return e => {
        const o = zn(e);
        return Ln(o + (o >= $s(e) ? -1 : 1) * t(e), Yr(e));
    };
}
const Ds = Cn(Fs(bi)),
    Ps = Cn(Fs(gi)),
    Ts = Cn(Fs(mi)),
    Es = Cn(Fs(yi)),
    As = Cn(Fs(xi)),
    Ss = Cn(t => ({
        rest: Ds(t),
        hover: Ps(t),
        active: Ts(t),
        focus: Es(t),
        selected: As(t),
    }));
function Os(t) {
    return e => {
        const o = Bn(e) ? -1 : 1;
        return Ln(zn(e) - t(e) * o, Yr(e));
    };
}
const Hs = Cn(Os(hi)),
    Ms = Cn(Os(ui)),
    Bs = Cn(Os(pi)),
    Ls = Cn(Os(fi)),
    Rs = Cn(Os(vi)),
    Ns = Cn(t => ({
        rest: Hs(t),
        hover: Ms(t),
        active: Bs(t),
        focus: Ls(t),
        selected: Rs(t),
    })),
    Is = En(si, ai, li);
function zs(t) {
    return e => {
        const o = Qr(e),
            r = o.length,
            i = Xr(e),
            n = os(Object.assign({}, e, { backgroundColor: i })),
            s = Zr(e),
            a = zn(e) >= Is(e) ? -1 : 1,
            l = r - 1,
            c = Mn(Qr, i)(e);
        let d = 0;
        for (
            ;
            d < a * s &&
            ao(c + d + a, 0, r) &&
            Pn(o[c + d + a], n) >= t &&
            ao(c + d + a + a, 0, l);

        )
            d += a;
        const h = c + d,
            u = h + -1 * a * s,
            p = u + a * Jr(e),
            f = u + a * ti(e);
        return {
            rest: Ln(u, o),
            hover: Ln(h, o),
            active: Ln(p, o),
            focus: Ln(f, o),
            selected: Ln(u + (Bn(e) ? -1 * ei(e) : ei(e)), o),
        };
    };
}
const js = Cn(zs(4.5)),
    _s = Cn(zs(3)),
    Vs = $n(wn.rest, js),
    Gs = $n(wn.hover, js),
    qs = $n(wn.active, js),
    Ws = ($n(wn.focus, js), $n(wn.selected, js)),
    Us = $n(wn.rest, _s),
    Ks = $n(wn.hover, _s),
    Xs = $n(wn.active, _s),
    Ys = ($n(wn.focus, _s), $n(wn.selected, _s)),
    Qs = t => {
        const e = Fi(t),
            o = Mn(Yr, Kr(t))(t);
        return Ln(o - (o < e ? -1 * e : e), Yr(t));
    };
function Zs(t) {
    return "function" == typeof t
        ? e => Qs(Object.assign({}, e, { backgroundColor: t(e) }))
        : Qs(t);
}
const Js = Cn(t => {
        const e = Yr(t),
            o = zn(t),
            r = Bn(t) ? -1 : 1,
            i = Ai(t),
            n = o + r * i,
            s = n + r * (Si(t) - i),
            a = n + r * (Oi(t) - i),
            l = n + r * (Hi(t) - i);
        return { rest: Ln(n, e), hover: Ln(s, e), active: Ln(a, e), focus: Ln(l, e) };
    }),
    ta = $n(wn.rest, Js),
    ea = $n(wn.hover, Js),
    oa = $n(wn.active, Js),
    ra =
        ($n(wn.focus, Js),
        Cn(t => {
            const e = Yr(t),
                o = zn(t),
                r = Ei(t);
            return Ln(o + (Bn(t) ? -1 : 1) * r, e);
        }));
function ia(t) {
    return (...e) => o => {
        const r = e[0];
        let i = "function" == typeof r ? r(o) : r;
        for (let r = 1; r < e.length; r++) {
            const n = e[r];
            i = t(i, "function" == typeof n ? n(o) : n);
        }
        return i;
    };
}
const na = ia((t, e) => t + e),
    sa = ia((t, e) => t - e),
    aa = ia((t, e) => t * e);
function la(...t) {
    return na.apply(this, t);
}
function ca(...t) {
    return sa.apply(this, t);
}
function da(...t) {
    return aa.apply(this, t);
}
var ha;
function ua(t, e) {
    return o => (-1 === $i(o) ? e(o) : t(o));
}
!(function(t) {
    (t[(t.LightMode = 1)] = "LightMode"), (t[(t.DarkMode = 0.23)] = "DarkMode");
})(ha || (ha = {}));
const pa = Mn(Yr, t => {
        const e = $i(t);
        return new qi(e, e, e, 1).toStringHexRGB();
    }),
    fa = t => Mi(ca(pa, Fi)(t), 0, Yr(t).length - 1),
    va = En(si, ai, li),
    ba = En(la(pa, Fi), va),
    ga = t => {
        const e = new qi(0.14, 0.14, 0.14, 1);
        return Mn(Yr, e.toStringHexRGB())(t);
    },
    ma = Cn(ua(Ln(ca(fa, Fi), Yr), Rn(Yr)(0, ca(ga, da(Fi, 5))))),
    ya = Cn(ua(Ln(fa, Yr), Rn(Yr)(0, ca(ga, da(Fi, 4))))),
    xa = Cn(ua(Ln(la(fa, Fi), Yr), Rn(Yr)(Fi, ca(ga, da(Fi, 3))))),
    ka = Cn(ua(Ln(pa, Yr), Rn(Yr)(0, ca(ga, da(Fi, 3))))),
    wa = xa,
    Ca = Cn(ua(Ln(ba, Yr), Rn(Yr)(va, ca(ga, da(Fi, 2))))),
    $a = Cn(ua(Ln(la(ba, Fi), Yr), Rn(Yr)(la(va, Fi), ca(ga, Fi)))),
    Fa = Cn(ua(Ln(la(ba, da(Fi, 2)), Yr), Rn(Yr)(la(va, da(Fi, 2)), ga)));
function Da(t) {
    return t > 3.5;
}
const Pa = Cn(
    Nn(Kr)(Yr)(function(t, e, o) {
        return Mn(Yr, t)(o);
    })(function(t, e, o) {
        return Bn(o) ? -1 : 1;
    })(Da)
);
function Ta(t, e, o) {
    return Bn(o) ? 1 : -1;
}
function Ea(t) {
    return Nn(Pa)(Qr)(
        (function(t) {
            return (e, o, r) => o.indexOf(t(r));
        })(t)
    )(Ta)(Da);
}
function Aa(t) {
    return new kn({ baseColor: t }).palette.map(t => t.toStringHexRGB().toUpperCase());
}
const Sa = xt`
    ${To("block")};
`;
let Oa = class extends Ho {};
var Ha;
t(
    [Mo({ attribute: "background-color", default: qr.backgroundColor })],
    Oa.prototype,
    "backgroundColor",
    void 0
),
    t(
        [
            Mo({
                attribute: "accent-base-color",
                cssCustomProperty: !1,
                default: qr.accentBaseColor,
            }),
        ],
        Oa.prototype,
        "accentBaseColor",
        void 0
    ),
    t(
        [Mo({ attribute: !1, cssCustomProperty: !1, default: qr.neutralPalette })],
        Oa.prototype,
        "neutralPalette",
        void 0
    ),
    t(
        [Mo({ attribute: !1, cssCustomProperty: !1, default: qr.accentPalette })],
        Oa.prototype,
        "accentPalette",
        void 0
    ),
    t([Mo({ default: qr.density, converter: Z })], Oa.prototype, "density", void 0),
    t(
        [Mo({ attribute: "design-unit", converter: Z, default: qr.designUnit })],
        Oa.prototype,
        "designUnit",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "base-height-multiplier",
                default: qr.baseHeightMultiplier,
                converter: Z,
            }),
        ],
        Oa.prototype,
        "baseHeightMultiplier",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "base-horizontal-spacing-multiplier",
                converter: Z,
                default: qr.baseHorizontalSpacingMultiplier,
            }),
        ],
        Oa.prototype,
        "baseHorizontalSpacingMultiplier",
        void 0
    ),
    t(
        [Mo({ attribute: "corner-radius", converter: Z, default: qr.cornerRadius })],
        Oa.prototype,
        "cornerRadius",
        void 0
    ),
    t(
        [Mo({ attribute: "outline-width", converter: Z, default: qr.outlineWidth })],
        Oa.prototype,
        "outlineWidth",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "focus-outline-width",
                converter: Z,
                default: qr.focusOutlineWidth,
            }),
        ],
        Oa.prototype,
        "focusOutlineWidth",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "disabled-opacity",
                converter: Z,
                default: qr.disabledOpacity,
            }),
        ],
        Oa.prototype,
        "disabledOpacity",
        void 0
    ),
    t(
        [Mo({ attribute: "type-ramp-minus-2-font-size", default: "10px" })],
        Oa.prototype,
        "typeRampMinus2FontSize",
        void 0
    ),
    t(
        [Mo({ attribute: "type-ramp-minus-2-line-height", default: "16px" })],
        Oa.prototype,
        "typeRampMinus2LineHeight",
        void 0
    ),
    t(
        [Mo({ attribute: "type-ramp-minus-1-font-size", default: "12px" })],
        Oa.prototype,
        "typeRampMinus1FontSize",
        void 0
    ),
    t(
        [Mo({ attribute: "type-ramp-minus-1-line-height", default: "16px" })],
        Oa.prototype,
        "typeRampMinus1LineHeight",
        void 0
    ),
    t(
        [Mo({ attribute: "type-ramp-base-font-size", default: "14px" })],
        Oa.prototype,
        "typeRampBaseFontSize",
        void 0
    ),
    t(
        [Mo({ attribute: "type-ramp-base-line-height", default: "20px" })],
        Oa.prototype,
        "typeRampBaseLineHeight",
        void 0
    ),
    t(
        [Mo({ attribute: "type-ramp-plus-1-font-size", default: "16px" })],
        Oa.prototype,
        "typeRampPlus1FontSize",
        void 0
    ),
    t(
        [Mo({ attribute: "type-ramp-plus-1-line-height", default: "24px" })],
        Oa.prototype,
        "typeRampPlus1LineHeight",
        void 0
    ),
    t(
        [Mo({ attribute: "type-ramp-plus-2-font-size", default: "20px" })],
        Oa.prototype,
        "typeRampPlus2FontSize",
        void 0
    ),
    t(
        [Mo({ attribute: "type-ramp-plus-2-line-height", default: "28px" })],
        Oa.prototype,
        "typeRampPlus2LineHeight",
        void 0
    ),
    t(
        [Mo({ attribute: "type-ramp-plus-3-font-size", default: "28px" })],
        Oa.prototype,
        "typeRampPlus3FontSize",
        void 0
    ),
    t(
        [Mo({ attribute: "type-ramp-plus-3-line-height", default: "36px" })],
        Oa.prototype,
        "typeRampPlus3LineHeight",
        void 0
    ),
    t(
        [Mo({ attribute: "type-ramp-plus-4-font-size", default: "34px" })],
        Oa.prototype,
        "typeRampPlus4FontSize",
        void 0
    ),
    t(
        [Mo({ attribute: "type-ramp-plus-4-line-height", default: "44px" })],
        Oa.prototype,
        "typeRampPlus4LineHeight",
        void 0
    ),
    t(
        [Mo({ attribute: "type-ramp-plus-5-font-size", default: "46px" })],
        Oa.prototype,
        "typeRampPlus5FontSize",
        void 0
    ),
    t(
        [Mo({ attribute: "type-ramp-plus-5-line-height", default: "56px" })],
        Oa.prototype,
        "typeRampPlus5LineHeight",
        void 0
    ),
    t(
        [Mo({ attribute: "type-ramp-plus-6-font-size", default: "60px" })],
        Oa.prototype,
        "typeRampPlus6FontSize",
        void 0
    ),
    t(
        [Mo({ attribute: "type-ramp-plus-6-line-height", default: "72px" })],
        Oa.prototype,
        "typeRampPlus6LineHeight",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "accent-fill-rest-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.accentFillRestDelta,
            }),
        ],
        Oa.prototype,
        "accentFillRestDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "accent-fill-hover-delta",
                cssCustomProperty: !1,
                converter: Z,
                default: qr.accentFillHoverDelta,
            }),
        ],
        Oa.prototype,
        "accentFillHoverDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "accent-fill-active-delta",
                cssCustomProperty: !1,
                converter: Z,
                default: qr.accentFillActiveDelta,
            }),
        ],
        Oa.prototype,
        "accentFillActiveDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "accent-fill-focus-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.accentFillFocusDelta,
            }),
        ],
        Oa.prototype,
        "accentFillFocusDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "accent-fill-selected-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.accentFillSelectedDelta,
            }),
        ],
        Oa.prototype,
        "accentFillSelectedDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "accent-foreground-rest-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.accentForegroundRestDelta,
            }),
        ],
        Oa.prototype,
        "accentForegroundRestDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "accent-foreground-hover-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.accentForegroundHoverDelta,
            }),
        ],
        Oa.prototype,
        "accentForegroundHoverDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "accent-foreground-active-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.accentForegroundActiveDelta,
            }),
        ],
        Oa.prototype,
        "accentForegroundActiveDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "accent-foreground-focus-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.accentForegroundFocusDelta,
            }),
        ],
        Oa.prototype,
        "accentForegroundFocusDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-rest-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillRestDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillRestDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-hover-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillHoverDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillHoverDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-active-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillActiveDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillActiveDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-focus-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillFocusDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillFocusDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-selected-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillSelectedDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillSelectedDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-input-rest-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillInputRestDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillInputRestDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-input-hover-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillInputHoverDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillInputHoverDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-input-active-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillInputActiveDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillInputActiveDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-input-focus-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillInputFocusDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillInputFocusDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-input-selected-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillInputSelectedDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillInputSelectedDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-stealth-rest-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillStealthRestDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillStealthRestDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-stealth-hover-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillStealthHoverDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillStealthHoverDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-stealth-active-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillStealthActiveDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillStealthActiveDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-stealth-focus-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillStealthFocusDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillStealthFocusDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-stealth-selected-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillStealthSelectedDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillStealthSelectedDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-toggle-hover-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillToggleHoverDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillToggleHoverDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-toggle-hover-active",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillToggleActiveDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillToggleActiveDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-toggle-hover-focus",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillToggleFocusDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillToggleFocusDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "base-layer-luminance",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.baseLayerLuminance,
            }),
        ],
        Oa.prototype,
        "baseLayerLuminance",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-fill-card-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralFillCardDelta,
            }),
        ],
        Oa.prototype,
        "neutralFillCardDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-foreground-hover-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralForegroundHoverDelta,
            }),
        ],
        Oa.prototype,
        "neutralForegroundHoverDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-foreground-active-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralForegroundActiveDelta,
            }),
        ],
        Oa.prototype,
        "neutralForegroundActiveDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-foreground-focus-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralForegroundFocusDelta,
            }),
        ],
        Oa.prototype,
        "neutralForegroundFocusDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-divider-rest-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralDividerRestDelta,
            }),
        ],
        Oa.prototype,
        "neutralDividerRestDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-outline-rest-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralOutlineRestDelta,
            }),
        ],
        Oa.prototype,
        "neutralOutlineRestDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-outline-hover-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralOutlineHoverDelta,
            }),
        ],
        Oa.prototype,
        "neutralOutlineHoverDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-outline-active-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralOutlineActiveDelta,
            }),
        ],
        Oa.prototype,
        "neutralOutlineActiveDelta",
        void 0
    ),
    t(
        [
            Mo({
                attribute: "neutral-outline-focus-delta",
                converter: Z,
                cssCustomProperty: !1,
                default: qr.neutralOutlineFocusDelta,
            }),
        ],
        Oa.prototype,
        "neutralOutlineFocusDelta",
        void 0
    ),
    (Oa = t(
        [
            ((Ha = { name: "fast-design-system-provider", template: Bo, styles: Sa }),
            t => {
                dt(Ha)(t), t.registerTagName("string" == typeof Ha ? Ha : Ha.name);
            }),
        ],
        Oa
    ));
const Ma = Fo("neutral-foreground-rest", t => _n(t).rest, Oa.findProvider),
    Ba = Fo("neutral-foreground-hover", t => _n(t).hover, Oa.findProvider),
    La = Fo("neutral-foreground-active", t => _n(t).active, Oa.findProvider),
    Ra = Fo("neutral-foreground-focus", t => _n(t).focus, Oa.findProvider),
    Na = Fo("neutral-foreground-toggle", Zn, Oa.findProvider),
    Ia = Fo("neutral-foreground-toggle-large", Jn, Oa.findProvider),
    za = Fo("neutral-foreground-hint", ns, Oa.findProvider),
    ja = Fo("neutral-foreground-hint-large", ss, Oa.findProvider),
    _a = Fo("accent-foreground-rest", t => ls(t).rest, Oa.findProvider),
    Va = Fo("accent-foreground-hover", t => ls(t).hover, Oa.findProvider),
    Ga = Fo("accent-foreground-active", t => ls(t).active, Oa.findProvider),
    qa = Fo("accent-foreground-focus", t => ls(t).focus, Oa.findProvider),
    Wa = Fo("accent-foreground-cut-rest", t => os(t), Oa.findProvider),
    Ua = Fo("accent-foreground-large-rest", t => cs(t).rest, Oa.findProvider),
    Ka = Fo("accent-foreground-large-hover", t => cs(t).hover, Oa.findProvider),
    Xa = Fo("accent-foreground-large-active", t => cs(t).active, Oa.findProvider),
    Ya = Fo("accent-foreground-large-focus", t => cs(t).focus, Oa.findProvider),
    Qa = Fo("neutral-fill-rest", t => Cs(t).rest, Oa.findProvider),
    Za = Fo("neutral-fill-hover", t => Cs(t).hover, Oa.findProvider),
    Ja = Fo("neutral-fill-active", t => Cs(t).active, Oa.findProvider),
    tl = Fo("neutral-fill-focus", t => Cs(t).focus, Oa.findProvider),
    el = Fo("neutral-fill-selected", t => Cs(t).selected, Oa.findProvider),
    ol = Fo("neutral-fill-stealth-rest", t => Ss(t).rest, Oa.findProvider),
    rl = Fo("neutral-fill-stealth-hover", t => Ss(t).hover, Oa.findProvider),
    il = Fo("neutral-fill-stealth-active", t => Ss(t).active, Oa.findProvider),
    nl = Fo("neutral-fill-stealth-focus", t => Ss(t).focus, Oa.findProvider),
    sl = Fo("neutral-fill-stealth-selected", t => Ss(t).selected, Oa.findProvider),
    al = Fo("neutral-fill-toggle-rest", t => Wn(t).rest, Oa.findProvider),
    ll = Fo("neutral-fill-toggle-hover", t => Wn(t).hover, Oa.findProvider),
    cl = Fo("neutral-fill-toggle-active", t => Wn(t).active, Oa.findProvider),
    dl = Fo("neutral-fill-toggle-focus", t => Wn(t).focus, Oa.findProvider),
    hl = Fo("neutral-fill-input-rest", t => Ns(t).rest, Oa.findProvider),
    ul = Fo("neutral-fill-input-hover", t => Ns(t).hover, Oa.findProvider),
    pl = Fo("neutral-fill-input-active", t => Ns(t).active, Oa.findProvider),
    fl = Fo("neutral-fill-input-focus", t => Ns(t).focus, Oa.findProvider),
    vl = Fo("accent-fill-rest", t => js(t).rest, Oa.findProvider),
    bl = Fo("accent-fill-hover", t => js(t).hover, Oa.findProvider),
    gl = Fo("accent-fill-active", t => js(t).active, Oa.findProvider),
    ml = Fo("accent-fill-focus", t => js(t).focus, Oa.findProvider),
    yl = Fo("accent-fill-selected", t => js(t).selected, Oa.findProvider),
    xl = Fo("accent-fill-large-rest", t => _s(t).rest, Oa.findProvider),
    kl = Fo("accent-fill-large-hover", t => _s(t).hover, Oa.findProvider),
    wl = Fo("accent-fill-large-active", t => _s(t).active, Oa.findProvider),
    Cl = Fo("accent-fill-large-focus", t => _s(t).focus, Oa.findProvider),
    $l = Fo("accent-fill-large-selected", t => _s(t).selected, Oa.findProvider),
    Fl = Fo("neutral-fill-card-rest", t => Zs(t), Oa.findProvider),
    Dl = Fo("neutral-outline-rest", t => Js(t).rest, Oa.findProvider),
    Pl = Fo("neutral-outline-hover", t => Js(t).hover, Oa.findProvider),
    Tl = Fo("neutral-outline-active", t => Js(t).active, Oa.findProvider),
    El = Fo("neutral-outline-focus", t => Js(t).focus, Oa.findProvider),
    Al = Fo("neutral-divider-rest", ra, Oa.findProvider),
    Sl = Fo("neutral-layer-floating", ma, Oa.findProvider),
    Ol = Fo("neutral-layer-card", ya, Oa.findProvider),
    Hl = Fo("neutral-layer-card-container", xa, Oa.findProvider),
    Ml = Fo("neutral-layer-l1", ka, Oa.findProvider),
    Bl = Fo("neutral-layer-l1-alt", wa, Oa.findProvider),
    Ll = Fo("neutral-layer-l2", Ca, Oa.findProvider),
    Rl = Fo("neutral-layer-l3", $a, Oa.findProvider),
    Nl = Fo("neutral-layer-l4", Fa, Oa.findProvider),
    Il = Fo("neutral-focus", Pa, Oa.findProvider),
    zl = Fo("neutral-focus-inner-accent", Ea(Xr), Oa.findProvider),
    jl = xt`
    ${Ir}
    ${zr}
    ${jr}
    ${_r}
    ${Vr}
    ${Gr}
`.withBehaviors(
        gl,
        bl,
        vl,
        Ga,
        Wa,
        Va,
        _a,
        Ja,
        tl,
        Za,
        Qa,
        il,
        rl,
        ol,
        Il,
        zl,
        Ma,
        Tl,
        Pl,
        Dl
    );
let _l = class extends Mt {};
_l = t(
    [
        dt({
            name: "fast-anchor",
            template: St,
            styles: jl,
            shadowOptions: { delegatesFocus: !0 },
        }),
    ],
    _l
);
const Vl = xt`
    ${To("inline-block")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        font-size: var(--type-ramp-minus-1-font-size);
        line-height: var(--type-ramp-minus-1-height);
    }

    .badge {
        border-radius: calc(var(--corner-radius) * 1px);
        padding: calc(var(--design-unit) * 0.5px) calc(var(--design-unit) * 1px);
        color: var(--accent-foreground-rest);
        font-weight: 600;
    }

    .badge[style] {
        font-weight: 400;
    }

    :host(.circular) .badge {
        border-radius: 100px;
        padding: 0 calc(var(--design-unit) * 1px);
        ${""} height: calc((${Nr} - (var(--design-unit) * 3)) * 1px);
        min-width: calc((${Nr} - (var(--design-unit) * 3)) * 1px);
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
    }
`.withBehaviors(_a);
let Gl = class extends Lt {};
Gl = t([dt({ name: "fast-badge", template: Bt, styles: Vl })], Gl);
const ql = xt`
    ${Ir}
    ${zr}
    ${jr}
    ${_r}
    ${Vr}
    ${Gr}
`.withBehaviors(
    gl,
    bl,
    vl,
    Ga,
    Wa,
    Va,
    _a,
    Ja,
    tl,
    Za,
    Qa,
    il,
    rl,
    ol,
    Il,
    zl,
    Ma,
    Tl,
    Pl,
    Dl,
    Po(xt`
            :host(.disabled),
            :host(.disabled) .control {
                forced-color-adjust: none;
                background: ${go.ButtonFace};
                border-color: ${go.GrayText};
                color: ${go.GrayText};
                cursor: ${"not-allowed"};
                opacity: 1;
            }
            :host(.accent) .control {
                forced-color-adjust: none;
                background: ${go.Highlight};
                color: ${go.HighlightText};
            }
    
            :host(.accent) .control:hover {
                background: ${go.HighlightText};
                border-color: ${go.Highlight};
                color: ${go.Highlight};
            }
    
            :host(.accent:${Eo}) .control {
                border-color: ${go.ButtonText};
                box-shadow: 0 0 0 2px ${go.HighlightText} inset;
            }
    
            :host(.accent.disabled) .control,
            :host(.accent.disabled) .control:hover {
                background: ${go.ButtonFace};
                border-color: ${go.GrayText};
                color: ${go.GrayText};
            }
            :host(.lightweight) .control:hover {
                forced-color-adjust: none;
                color: ${go.Highlight};
            }
    
            :host(.lightweight) .control:hover .content::before {
                background: ${go.Highlight};
            }
    
            :host(.lightweight.disabled) .control {
                forced-color-adjust: none;
                color: ${go.GrayText};
            }
        
            :host(.lightweight.disabled) .control:hover .content::before {
                background: none;
            }
            :host(.outline.disabled) .control {
                border-color: ${go.GrayText};
            }
            :host(.stealth) .control {
                forced-color-adjust: none;
                background: none;
                border-color: transparent;
                color: ${go.ButtonText};
                fill: currentColor;
            }
            :host(.stealth) .control:hover,
            :host(.stealth:${Eo}) .control {
                background: ${go.Highlight};
                border-color: ${go.Highlight};
                color: ${go.HighlightText};
            }
            :host(.stealth.disabled) .control {
                background: none;
                border-color: transparent;
                color: ${go.GrayText};
            }
        `)
);
let Wl = class extends xo {};
Wl = t(
    [
        dt({
            name: "fast-button",
            template: Rt,
            styles: ql,
            shadowOptions: { delegatesFocus: !0 },
        }),
    ],
    Wl
);
const Ul = xt`
    ${To("block")} :host {
        --elevation: 4;
        display: block;
        contain: content;
        height: var(--card-height, 100%);
        width: var(--card-width, 100%);
        box-sizing: border-box;
        background: var(--neutral-layer-card);
        border-radius: calc(var(--corner-radius) * 1px);
        ${Rr};
    }
`.withBehaviors(
    Ol,
    Po(xt`
            :host {
                forced-color-adjust: none;
                border: calc(var(--outline-width) * 1px) solid ${go.CanvasText};
                background: ${go.Canvas};
            }
        `)
);
let Kl = class extends wo {};
Kl = t([dt({ name: "fast-card", template: ko, styles: Ul })], Kl);
const Xl = xt`
    ${To("inline-flex")} :host {
        align-items: center;
        outline: none;
        margin: calc(var(--design-unit) * 1px) 0;
        ${""} user-select: none;
    }

    .control {
        position: relative;
        width: calc((${Nr} / 2 + var(--design-unit)) * 1px);
        height: calc((${Nr} / 2 + var(--design-unit)) * 1px);
        box-sizing: border-box;
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
        background: var(--neutral-fill-input-rest);
        outline: none;
        cursor: pointer;
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

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .checked-indicator {
        width: 100%;
        height: 100%;
        display: block;
        fill: var(--accent-foreground-cut-rest);
        opacity: 0;
        pointer-events: none;
    }

    .indeterminate-indicator {
        border-radius: calc(var(--corner-radius) * 1px);
        background: var(--accent-foreground-cut-rest);
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

    :host(:${Eo}) .control {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px var(--neutral-focus);
        border-color: var(--neutral-focus);
    }

    :host(.checked) .control {
        background: var(--accent-fill-rest);
        border: calc(var(--outline-width) * 1px) solid var(--accent-fill-rest);
    }

    :host(.checked:enabled) .control:hover {
        background: var(--accent-fill-hover);
        border: calc(var(--outline-width) * 1px) solid var(--accent-fill-hover);
    }

    :host(.checked:enabled) .control:active {
        background: var(--accent-fill-active);
        border: calc(var(--outline-width) * 1px) solid var(--accent-fill-active);
    }

    :host(.checked:${Eo}:enabled) .control {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px var(--neutral-focus);
        border-color: transparent;
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
    gl,
    bl,
    vl,
    Wa,
    pl,
    ul,
    hl,
    Il,
    zl,
    Ma,
    Tl,
    Pl,
    Dl,
    Po(xt`
            .control, .control:hover, .control:active {
                forced-color-adjust: none;
                border-color: ${go.FieldText};
                background: ${go.Field};
            }
            .checked-indicator {
                fill: ${go.FieldText};
            }
            .indeterminate-indicator {
                background: ${go.FieldText};
            }
            :host(:${Eo}) .control {
                border-color: ${go.Highlight};
            }
            :host(.checked:${Eo}) .control {
                border-color: ${go.FieldText};
                box-shadow: 0 0 0 2px ${go.Field} inset;
            }
            :host(.checked) .control {
                background: ${go.Highlight};
                border-color: ${go.Highlight};
            }
            :host(.checked) .control:hover, .control:active {
                background: ${go.HighlightText};
            }
            :host(.checked) .checked-indicator {
                fill: ${go.HighlightText};
            }
            :host(.checked) .control:hover .checked-indicator {
                fill: ${go.Highlight}
            }
            :host(.checked) .indeterminate-indicator {
                background: ${go.HighlightText};
            }
            :host(.checked) .control:hover .indeterminate-indicator {
                background: ${go.Highlight}
            }
            :host(.disabled) {
                opacity: 1;
            }
            :host(.disabled) .control {
                forced-color-adjust: none;
                border-color: ${go.GrayText};
                background: ${go.Field};
            }
            :host(.disabled) .indeterminate-indicator,
            :host(.checked.disabled) .control:hover .indeterminate-indicator {
                forced-color-adjust: none;
                background: ${go.GrayText};
            }
            :host(.disabled) .checked-indicator,
            :host(.checked.disabled) .control:hover .checked-indicator {
                forced-color-adjust: none;
                fill: ${go.GrayText};
            }
        `)
);
let Yl = class extends $o {};
Yl = t([dt({ name: "fast-checkbox", template: Co, styles: Xl })], Yl);
const Ql = xt`
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
        ${Rr} margin-top: auto;
        margin-bottom: auto;
        width: var(--dialog-width);
        height: var(--dialog-height);
        background-color: var(--background-color);
        z-index: 1;
        border-radius: calc(var(--corner-radius) * 1px);
    }
`;
let Zl = class extends Ko {};
Zl = t([dt({ name: "fast-dialog", template: Lo, styles: Ql })], Zl);
const Jl = xt`
    ${To("block")} :host {
        box-sizing: content-box;
        height: 0;
        margin: calc(var(--design-unit) * 1px) 0;
        border: none;
        border-top: calc(var(--outline-width) * 1px) solid var(--neutral-divider-rest);
    }
`.withBehaviors(Al);
let tc = class extends Zo {};
tc = t([dt({ name: "fast-divider", template: Xo, styles: Jl })], tc);
const ec = xt`
    ${To("inline-flex")} :host {
        width: calc(${Nr} * 1px);
        height: calc(${Nr} * 1px);
        justify-content: center;
        align-items: center;
        margin: 0;
        position: relative;
        fill: var(--accent-foreground-cut-rest);
        color: var(--accent-foreground-cut-rest);
        background: transparent;
        border: none;
        padding: 0;
    }

    :host::before {
        content: "";
        background: var(--accent-fill-rest);
        border: calc(var(--outline-width) * 1px) solid var(--accent-fill-rest);
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
        fill: var(--neutral-foreground-rest);
        color: var(--neutral-foreground-rest);
    }

    :host(.disabled)::before {
        background: var(--neutral-fill-stealth-rest);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
    }

    :host(:hover:enabled)::before {
        background: var(--accent-fill-hover);
        border-color: var(--accent-fill-hover);
    }

    :host(:active:enabled)::before {
        background: var(--accent-fill-active);
        border-color: var(--accent-fill-active);
    }

    :host(:${Eo}) {
        outline: none;
    }

    :host(:${Eo})::before {
        box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset var(--neutral-focus-inner-accent);
        border-color: var(--neutral-focus);
    }

    :host::-moz-focus-inner {
        border: 0;
    }
`.withBehaviors(
    gl,
    bl,
    vl,
    Wa,
    ol,
    Il,
    zl,
    Ma,
    Dl,
    Po(xt`
            :host {
                background: ${go.Canvas};
            }
            :host .next,
            :host .previous {
                color: ${go.ButtonText};
                fill: ${go.ButtonText};
            }
            :host::before {
                background: ${go.Canvas};
                border-color: ${go.ButtonText};
            }
            :host(:hover)::before {
                forced-color-adjust: none;
                background: ${go.Highlight};
                border-color: ${go.ButtonText};
                opacity: 1;
            }
            :host(:hover) .next,
            :host(:hover) .previous {
                forced-color-adjust: none;
                color: ${go.HighlightText};
                fill: ${go.HighlightText};
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
                background: ${go.Canvas};
                border-color: ${go.GrayText};
                color: ${go.GrayText};
                fill: ${go.GrayText};
            }
            :host(:${Eo})::before {
                forced-color-adjust: none;
                box-shadow: 0 0 0 2px ${go.ButtonText};
            }
        `)
);
let oc = class extends Jo {};
oc = t([dt({ name: "fast-flipper", template: tr, styles: ec })], oc);
const rc = xt`
    ${To("block")} :host {
        --elevation: 11;
        background: var(--neutral-layer-floating);
        border-radius: var(--elevated-corner-radius);
        ${Rr} margin: 0;
        border-radius: calc(var(--corner-radius) * 1px);
        padding: calc(var(--design-unit) * 1px) 0;
        max-width: 368px;
        min-width: 64px;
    }

    ::slotted(hr) {
        box-sizing: content-box;
        height: 0;
        margin: 0;
        border: none;
        border-top: calc(var(--outline-width) * 1px) solid var(--neutral-divider-rest);
    }
`.withBehaviors(Sl, Al);
let ic = class extends nr {};
ic = t([dt({ name: "fast-menu", template: er, styles: rc })], ic);
const nc = xt`
    ${To("grid")} :host {
        outline: none;
        box-sizing: border-box;
        height: calc(${Nr} * 1px);
        grid-template-columns: 42px auto 42px;
        grid-template-rows: auto;
        justify-items: center;
        align-items: center;
        padding: 0;
        margin: 0 calc(var(--design-unit) * 1px);
        white-space: nowrap;
        overflow: hidden;
        color: var(--neutral-foreground-rest);
        fill: var(--neutral-foreground-rest);
        cursor: pointer;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--focus-outline-width) * 1px) solid transparent;
    }

    :host(:${Eo}) {
        box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset var(--neutral-focus-inner-accent);
        border-color: var(--neutral-focus);
        background: var(--accent-fill-hover);
        color: var(--accent-foreground-cut-rest);
    }

    :host(:hover) {
        background: var(--accent-fill-hover);
        color: var(--accent-foreground-cut-rest);
    }

    :host(:active) {
        background: var(--accent-fill-active);
        color: var(--accent-foreground-cut-rest);
    }

    :host(.disabled) {
        cursor: ${"not-allowed"};
        opacity: var(--disabled-opacity);
    }

    :host(.disabled:hover) {
        color: var(--neutral-foreground-rest);
        fill: var(--neutral-foreground-rest);
        background: var(--neutral-fill-stealth-rest)
    }

    :host(.disabled:hover) .start,
    :host(.disabled:hover) .end,
    :host(.disabled:hover)::slotted(svg) {
        fill: var(--neutral-foreground-rest);
    }

    .content {
        grid-column-start: 2;
        justify-self: start;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .start,
    .end,
    ::slotted(svg) {
        ${""} width: 16px;
        height: 16px;
    }

    :host(:hover) .start,
    :host(:hover) .end,
    :host(:hover)::slotted(svg){
        fill: var(--accent-foreground-cut-rest);
    }

    :host(:active) .start,
    :host(:active) .end,
    :host(:active)::slotted(svg) {
        fill: var(--accent-foreground-cut-rest);
    }
`.withBehaviors(gl, bl, Wa, ol, Il, zl, Ma);
let sc = class extends rr {};
sc = t([dt({ name: "fast-menu-item", template: ir, styles: nc })], sc);
const ac = xt`
    ${To("flex")} :host {
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
    vl,
    Qa,
    za,
    Po(xt`
            .indeterminate-indicator-1,
            .indeterminate-indicator-2,
            .determinate {
                forced-color-adjust: none;
                background-color: ${go.FieldText};
            }
            .progress {
                background-color: ${go.Field};
                border: calc(var(--outline-width) * 1px) solid ${go.FieldText};
            }
            :host(.paused) .indeterminate-indicator-1,
            .indeterminate-indicator-2 {
                background-color: ${go.Field};
            }
            :host(.paused) .determinate {
                background-color: ${go.GrayText};
            }
        `)
);
let lc = class extends sr {};
lc = t([dt({ name: "fast-progress", template: ar, styles: ac })], lc);
const cc = xt`
    ${To("flex")} :host {
        align-items: center;
        outline: none;
        height: calc(${Nr} * 1px);
        width: calc(${Nr} * 1px);
        margin: calc(${Nr} * 1px) 0;
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
    vl,
    Qa,
    za,
    Po(xt`
            .indeterminate-indicator-1,
            .determinate {
                stroke: ${go.FieldText};
            }
            .background {
                stroke: ${go.Field};
            }
            :host(.paused) .indeterminate-indicator-1 {
                stroke: ${go.Field};
            }
            :host(.paused) .determinate {
                stroke: ${go.GrayText};
            }
        `)
);
let dc = class extends sr {};
dc = t([dt({ name: "fast-progress-ring", template: lr, styles: cc })], dc);
const hc = xt`
    ${To("inline-flex")} :host {
        --input-size: calc((${Nr} / 2) + var(--design-unit));
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
        width: calc((${Nr} / 2 + var(--design-unit)) * 1px);
        height: calc((${Nr} / 2 + var(--design-unit)) * 1px);
        box-sizing: border-box;
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
        background: var(--neutral-fill-input-rest);
        outline: none;
        cursor: pointer;
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

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .checked-indicator {
        position: absolute;
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        border-radius: calc(var(--corner-radius) * 1px);
        display: inline-block;
        flex-shrink: 0;
        background: var(--accent-foreground-cut-rest);
        fill: var(--accent-foreground-cut-rest);
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

    :host(:${Eo}) .control {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px var(--neutral-focus);
        border-color: var(--neutral-focus);
    }

    :host(.checked) .control {
        background: var(--accent-fill-rest);
        border: calc(var(--outline-width) * 1px) solid var(--accent-fill-rest);
    }

    :host(.checked:enabled) .control:hover {
        background: var(--accent-fill-hover);
        border: calc(var(--outline-width) * 1px) solid var(--accent-fill-hover);
    }

    :host(.checked:enabled) .control:active {
        background: var(--accent-fill-active);
        border: calc(var(--outline-width) * 1px) solid var(--accent-fill-active);
    }

    :host(.checked:${Eo}:enabled) .control {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px var(--neutral-focus);
        border-color: transparent;
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
    gl,
    bl,
    vl,
    Wa,
    pl,
    ul,
    hl,
    Il,
    Ma,
    Tl,
    Pl,
    Dl,
    Po(xt`
            .control, .control:hover, .control:active {
                forced-color-adjust: none;
                border-color: ${go.FieldText};
                background: ${go.Field};
            }
            :host(:${Eo}) .control {
                border-color: ${go.Highlight};
            }
            :host(.checked) .control:hover, .control:active {
                border-color: ${go.Highlight};
                background: ${go.Highlight};
            }
            :host(.checked) .checked-indicator {
                background: ${go.Highlight};
                fill: ${go.Highlight};
            }
            :host(.checked) .control:hover .checked-indicator {
                background: ${go.HighlightText};
                fill: ${go.HighlightText};
            }
            :host(.disabled) {
                forced-color-adjust: none;
                opacity: 1;
            }
            :host(.disabled) .label {
                color: ${go.GrayText};
            }
            :host(.disabled) .control,
            :host(.checked.disabled) .control:hover, .control:active {
                background: ${go.Field};
                border-color: ${go.GrayText};
            }
            :host(.disabled) .checked-indicator,
            :host(.checked.disabled) .control:hover .checked-indicator {
                fill: ${go.GrayText};
                background: ${go.GrayText};
            }
        `)
);
let uc = class extends dr {};
uc = t([dt({ name: "fast-radio", template: cr, styles: hc })], uc);
const pc = xt`
    ${To("flex")} :host {
        align-items: flex-start;
        margin: calc(var(--design-unit) * 1px) 0;
        flex-direction: column;
    }
    .positioning-region {
        display: flex;
        flex-wrap: wrap;
    }
    .vertical {
        flex-direction: column;
    }
    .horizontal {
        flex-direction: row;
    }
`;
let fc = class extends ur {};
fc = t([dt({ name: "fast-radio-group", template: hr, styles: pc })], fc);
const vc = xt`
    :host([hidden]) {
        display: none;
    }

    ${To("inline-grid")} :host {
        --track-size: calc(var(--design-unit) * 2);
        --thumb-size: calc(${Nr} * 0.5 - var(--design-unit));
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

    :host(:${Eo}) .thumb-cursor {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px var(--neutral-focus);
    }
    
    .thumb-container {
        position: absolute;
        height: calc(var(--thumb-size) * 1px);
        width: calc(var(--thumb-size) * 1px);
        transition: "all 0.2s ease";
        color: var(--neutral-foreground-rest);
        fill: var(--neutral-foreground-rest);
    }
    .thumb-cursor {
        border: none;
        width: calc(var(--thumb-size) * 1px);
        height: calc(var(--thumb-size) * 1px);
        background: var(--neutral-foreground-rest);
        border-radius: calc(var(--corner-radius) * 1px);
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
        margin-top: calc(var(--design-unit) * 1px);
        height: calc(var(--track-size) * 1px);
    }
    :host(.vertical) .track {
        top: calc(var(--track-overhang) * 1px);
        bottom: calc(var(--track-overhang) * 1px);
        justify-self: start;
        margin-left: calc(var(--design-unit) * 1px);
        width: calc(var(--track-size) * 1px);
        height: 100%;
    }
    .track {
        background: var(--neutral-outline-rest);
        position: absolute;
        border-radius: calc(var(--corner-radius) * 1px);
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
    Il,
    La,
    Ba,
    Ma,
    Pl,
    Dl,
    Po(xt`
            .thumb-cursor {
                forced-color-adjust: none;
                border-color: ${go.FieldText};
                background: ${go.FieldText};
            }
            .thumb-cursor:hover,
            .thumb-cursor:active {
                background: ${go.Highlight};
            }
            .track {
                forced-color-adjust: none;
                background: ${go.FieldText};
            }
            :host(:${Eo}) .thumb-cursor {
                border-color: ${go.Highlight};
            }
            :host(.disabled) {
                opacity: 1;
                cursor: ${"not-allowed"};
            }
            :host(.disabled) .slider,
            :host(.disabled) .track,
            :host(.disabled) .thumb-cursor {
                forced-color-adjust: none;
                background: ${go.GrayText};
            }
        `)
);
let bc = class extends br {};
bc = t([dt({ name: "fast-slider", template: pr, styles: vc })], bc);
const gc = xt`
    ${To("block")} :host {
        color: var(--neutral-foreground-rest);
        fill: var(--neutral-foreground-rest);
    }
    .root {
        position: absolute;
        display: grid;
    }
    :host(.horizontal) {
        align-self: start;
        grid-row: 2;
        margin-top: -2px;
        height: calc((${Nr} / 2 + var(--design-unit)) * 1px);
        width: auto;
    }
    :host(.vertical) {
        justify-self: start;
        grid-column: 2;
        margin-left: 2px;
        height: auto;
        width: calc((${Nr} / 2 + var(--design-unit)) * 1px);
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
        width: calc((var(--design-unit) / 4) * 1px);
        height: calc(${Nr} * 0.25 * 1px);
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
    Ma,
    Dl,
    Po(xt`
            .mark {
                forced-color-adjust: none;
                background: ${go.FieldText};
            }
            :host(.disabled) {
                forced-color-adjust: none;
                opacity: 1;
            }
            :host(.disabled) .label {
                color: ${go.GrayText};
            }
            :host(.disabled) .mark {
                background: ${go.GrayText};
            }
        `)
);
let mc = class extends yr {};
mc = t([dt({ name: "fast-slider-label", template: gr, styles: gc })], mc);
const yc = xt`
    :host([hidden]) {
        display: none;
    }

    ${To("inline-flex")} :host {
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
        width: calc(${Nr} * 1px);
        height: calc((${Nr} / 2 + var(--design-unit)) * 1px);
        background: var(--neutral-fill-input-rest);
        border-radius: calc(var(--corner-radius) * 1px);
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

    :host(:${Eo}) .switch {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px var(--neutral-focus);
        border-color: var(--neutral-focus);
    }

    .checked-indicator {
        position: absolute;
        top: 5px;
        left: 5px;
        right: calc(((${Nr} / 2) + 1) * 1px);
        bottom: 5px;
        background: var(--neutral-foreground-rest);
        border-radius: calc(var(--corner-radius) * 1px);
        transition: all 0.2s ease-in-out;
    }

    .status-message {
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
    }

    .label {
        color: var(--neutral-foreground-rest);

        ${""} margin-inline-end: calc(var(--design-unit) * 2px + 2px);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    ::slotted(*) {
        ${""} margin-inline-start: calc(var(--design-unit) * 2px + 2px);
    }

    :host(.checked) .checked-indicator {
        left: calc(((${Nr} / 2) + 1) * 1px);
        right: 5px;
        background: var(--accent-foreground-cut-rest);
    }

    :host(.checked) .switch {
        background: var(--accent-fill-rest);
        border-color: var(--accent-fill-rest);
    }

    :host(.checked:enabled) .switch:hover {
        background: var(--accent-fill-hover);
        border-color: var(--accent-fill-hover);
    }

    :host(.checked:enabled) .switch:active {
        background: var(--accent-fill-active);
        border-color: var(--accent-fill-active);
    }

    :host(.checked:${Eo}:enabled) .switch {
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
    gl,
    bl,
    vl,
    Wa,
    pl,
    ul,
    hl,
    Il,
    Ma,
    Tl,
    Pl,
    Dl,
    Po(xt`
            .checked-indicator {
                forced-color-adjust: none;
                background: ${go.FieldText};
            }
            .switch, .switch:hover, .switch:active {
                forced-color-adjust: none;
                background: ${go.Field};
                border-color: ${go.FieldText};
            }
            :host(.checked) .switch {
                background: ${go.Highlight};
                border-color: ${go.Highlight};
            }
            :host(.checked) .checked-indicator {
                background: ${go.HighlightText};
            }
            :host(.disabled) {
                opacity: 1;
            }
            :host(:${Eo}) .switch {
                border-color: ${go.Highlight};
            }
            :host(.checked:${Eo}) .switch {
                border-color: ${go.FieldText};
                box-shadow: 0 0 0 2px ${go.Field} inset;
            }
            :host(.disabled) .checked-indicator {
                background: ${go.GrayText};
            }
            :host(.disabled) .switch {
                background: ${go.Field};
                border-color: ${go.GrayText};
            }
        `)
);
let xc = class extends kr {};
xc = t([dt({ name: "fast-switch", template: xr, styles: yc })], xc);
const kc = xt`
    ${To("grid")} :host {
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
        padding: calc(var(--design-unit) * 4px) calc(var(--design-unit) * 4px) 0;
        box-sizing: border-box;
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
        width: 100%;
        height: 5px;
        justify-self: center;
        background: var(--accent-fill-rest);
        margin-top: 10px;
        border-radius: calc(var(--corner-radius) * 1px) calc(var(--corner-radius) * 1px) 0
            0;
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
        padding: calc((${Nr} - var(--design-unit)) * 1px)
            calc(var(--design-unit) * 4px)
            calc((${Nr} - var(--design-unit)) * 1px) 0;
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
        width: 5px;
        height: 100%;
        margin-inline-end: 10px;
        align-self: center;
        background: var(--accent-fill-rest);
        margin-top: 0;
        border-radius: 0 calc(var(--corner-radius) * 1px) calc(var(--corner-radius) * 1px)
            0;
    }

    :host(.vertical) .activeIndicatorTransition {
        transition: transform 0.2s linear;
    }
`.withBehaviors(
        vl,
        Ma,
        Po(xt`
            .activeIndicator,
            :host(.vertical) .activeIndicator {
                forced-color-adjust: none;
                background: ${go.Highlight};
            }
        `)
    ),
    wc = xt`
    ${To("inline-flex")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        height: calc(${Nr} * 1px);
        padding: calc(var(--design-unit) * 5px) calc(var(--design-unit) * 4px);
        color: var(--neutral-foreground-hint);
        fill: var(--neutral-foreground-hint);
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid transparent;
        align-items: center;
        justify-content: center;
        grid-row: 1;
    }

    :host(:hover) {
        color: var(--neutral-foreground-hover);
        fill: var(--neutral-foreground-hover);
    }

    :host(:active) {
        color: var(--neutral-foreground-active);
        fill: var(--neutral-foreground-active);
    }

    :host([aria-selected="true"]) {
        background: var(--neutral-fill-rest);
        color: var(--accent-foreground-rest);
        fill: var(--accent-fill-rest);
    }

    :host([aria-selected="true"]:hover) {
        background: var(--neutral-fill-hover);
        color: var(--accent-foreground-hover);
        fill: var(--accent-fill-hover);
    }

    :host([aria-selected="true"]:active) {
        background: var(--neutral-fill-active);
        color: var(--accent-foreground-active);
        fill: var(--accent-fill-active);
    }

    :host(:${Eo}) {
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
        grid-column: 2;
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
        gl,
        bl,
        vl,
        Ga,
        Va,
        _a,
        Ja,
        Za,
        Qa,
        Il,
        za,
        La,
        Ba,
        Ma,
        Po(xt`
            :host {
                forced-color-adjust: none;
                border-color: transparent;
                color: ${go.ButtonText};
            }
            :host(:hover),
            :host(.vertical:hover) {
                color: ${go.ButtonText};
            }
            :host(:${Eo}) {
                border-color: ${go.ButtonText};
                box-shadow: none;
            }
        `)
    );
let Cc = class extends Dr {};
Cc = t([dt({ name: "fast-tab", template: Fr, styles: wc })], Cc);
const $c = xt`
    ${To("flex")} :host {
        box-sizing: border-box;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        padding: 0 calc((6 + (var(--design-unit) * 2 * var(--density))) * 1px);
    }
`;
let Fc = class extends Tr {};
Fc = t([dt({ name: "fast-tab-panel", template: Pr, styles: $c })], Fc);
let Dc = class extends $r {};
Dc = t([dt({ name: "fast-tabs", template: wr, styles: kc })], Dc);
const Pc = xt`
    ${To("inline-block")} :host {
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
        border: calc(var(--outline-width) * 1px) solid var(--accent-fill-rest);
        height: calc(${Nr} * 2px);
        font: inherit;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        padding: calc(var(--design-unit) * 2px + 1px);
        max-width: 100%;
        resize: none;
    }

    .control:hover:enabled {
        background: var(--neutral-fill-input-hover);
        border-color: var(--accent-fill-hover);
    }

    .control:active:enabled {
        background: var(--neutral-fill-input-active);
        border-color: var(--accent-fill-active);
    }

    .control:hover,
    .control:${Eo},
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
    }

    :host(.filled:hover:not([disabled])) .control {
        background: var(--neutral-fill-hover);
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

    .label {
        display: block;
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        margin-bottom: 4px;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
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
    :host([disabled]) .control {
        border-color: var(--neutral-outline-rest);
    }
 `.withBehaviors(
    gl,
    bl,
    vl,
    Za,
    pl,
    ul,
    hl,
    Qa,
    Il,
    Ma,
    Dl,
    Po(xt`
            :host([disabled]) {
                opacity: 1;
            }
        `)
);
let Tc = class extends Sr {};
Tc = t(
    [
        dt({
            name: "fast-text-area",
            template: Or,
            styles: Pc,
            shadowOptions: { delegatesFocus: !0 },
        }),
    ],
    Tc
);
const Ec = xt`
    ${To("inline-block")} :host {
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
        border: calc(var(--outline-width) * 1px) solid var(--accent-fill-rest);
        height: calc(${Nr} * 1px);
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
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        color: var(--neutral-foreground-rest);
    }

    .control:hover,
    .control:${Eo},
    .control:disabled,
    .control:active {
        outline: none;
    }

    .label {
        display: block;
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        margin-bottom: 4px;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
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
        border-color: var(--accent-fill-hover);
    }

    :host(:active:not(.disabled)) .root {
        background: var(--neutral-fill-input-hover);
        border-color: var(--accent-fill-active);
    }

    :host(:focus-within:not(.disabled)) .root {
        border-color: var(--neutral-focus);
        box-shadow: 0 0 0 1px var(--neutral-focus) inset;
    }

    :host(.filled) .root {
        background: var(--neutral-fill-rest);
    }

    :host(.filled:hover:not(.disabled)) .root {
        background: var(--neutral-fill-hover);
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

    :host([disabled]) .control {
        border-color: var(--neutral-outline-rest);
    }
`.withBehaviors(
    gl,
    bl,
    vl,
    Za,
    ul,
    hl,
    Qa,
    Il,
    Ma,
    Dl,
    Po(xt`
            .root,
            :host(.filled) .root {
                forced-color-adjust: none;
                background: ${go.Field};
                border-color: ${go.FieldText};
            }
            :host(:hover:not(.disabled)) .root,
            :host(.filled:hover:not(.disabled)) .root,
            :host(.filled:hover) .root {
                background: ${go.Field};
                border-color: ${go.Highlight};
            }
            .before-content,
            .after-content {
                fill: ${go.ButtonText};
            }
            :host(.disabled) {
                opacity: 1;
            }
            :host(.disabled) .root,
            :host(.filled:hover.disabled) .root {
                border-color: ${go.GrayText};
                background: ${go.Field};
            }
            :host(:focus-within) .root {
                border-color: ${go.Highlight};
                box-shadow: 0 0 0 1px ${go.Highlight} inset;
            }
        `)
);
let Ac = class extends Lr {};
Ac = t(
    [
        dt({
            name: "fast-text-field",
            template: Hr,
            styles: Ec,
            shadowOptions: { delegatesFocus: !0 },
        }),
    ],
    Ac
);
export {
    _l as FASTAnchor,
    Gl as FASTBadge,
    Wl as FASTButton,
    Kl as FASTCard,
    Yl as FASTCheckbox,
    Oa as FASTDesignSystemProvider,
    Zl as FASTDialog,
    tc as FASTDivider,
    oc as FASTFlipper,
    ic as FASTMenu,
    sc as FASTMenuItem,
    lc as FASTProgress,
    dc as FASTProgressRing,
    uc as FASTRadio,
    fc as FASTRadioGroup,
    bc as FASTSlider,
    mc as FASTSliderLabel,
    xc as FASTSwitch,
    Cc as FASTTab,
    Fc as FASTTabPanel,
    Dc as FASTTabs,
    Tc as FASTTextArea,
    Ac as FASTTextField,
    Sn as PaletteType,
    ha as StandardLuminance,
    js as accentFill,
    qs as accentFillActive,
    gl as accentFillActiveBehavior,
    ml as accentFillFocusBehavior,
    Gs as accentFillHover,
    bl as accentFillHoverBehavior,
    _s as accentFillLarge,
    Xs as accentFillLargeActive,
    wl as accentFillLargeActiveBehavior,
    Cl as accentFillLargeFocusBehavior,
    Ks as accentFillLargeHover,
    kl as accentFillLargeHoverBehavior,
    Us as accentFillLargeRest,
    xl as accentFillLargeRestBehavior,
    Ys as accentFillLargeSelected,
    $l as accentFillLargeSelectedBehavior,
    Vs as accentFillRest,
    vl as accentFillRestBehavior,
    Ws as accentFillSelected,
    yl as accentFillSelectedBehavior,
    ls as accentForeground,
    us as accentForegroundActive,
    Ga as accentForegroundActiveBehavior,
    os as accentForegroundCut,
    rs as accentForegroundCutLarge,
    Wa as accentForegroundCutRestBehavior,
    qa as accentForegroundFocusBehavior,
    hs as accentForegroundHover,
    Va as accentForegroundHoverBehavior,
    cs as accentForegroundLarge,
    vs as accentForegroundLargeActive,
    Xa as accentForegroundLargeActiveBehavior,
    Ya as accentForegroundLargeFocusBehavior,
    fs as accentForegroundLargeHover,
    Ka as accentForegroundLargeHoverBehavior,
    ps as accentForegroundLargeRest,
    Ua as accentForegroundLargeRestBehavior,
    ds as accentForegroundRest,
    _a as accentForegroundRestBehavior,
    Aa as createColorPalette,
    Bn as isDarkMode,
    ra as neutralDividerRest,
    Al as neutralDividerRestBehavior,
    Cs as neutralFill,
    xs as neutralFillActive,
    Ja as neutralFillActiveBehavior,
    Zs as neutralFillCard,
    Fl as neutralFillCardRestBehavior,
    tl as neutralFillFocusBehavior,
    ys as neutralFillHover,
    Za as neutralFillHoverBehavior,
    Ns as neutralFillInput,
    Bs as neutralFillInputActive,
    pl as neutralFillInputActiveBehavior,
    fl as neutralFillInputFocusBehavior,
    Ms as neutralFillInputHover,
    ul as neutralFillInputHoverBehavior,
    Hs as neutralFillInputRest,
    hl as neutralFillInputRestBehavior,
    Rs as neutralFillInputSelected,
    ms as neutralFillRest,
    Qa as neutralFillRestBehavior,
    ws as neutralFillSelected,
    el as neutralFillSelectedBehavior,
    Ss as neutralFillStealth,
    Ts as neutralFillStealthActive,
    il as neutralFillStealthActiveBehavior,
    nl as neutralFillStealthFocusBehavior,
    Ps as neutralFillStealthHover,
    rl as neutralFillStealthHoverBehavior,
    Ds as neutralFillStealthRest,
    ol as neutralFillStealthRestBehavior,
    As as neutralFillStealthSelected,
    sl as neutralFillStealthSelectedBehavior,
    Wn as neutralFillToggle,
    Xn as neutralFillToggleActive,
    cl as neutralFillToggleActiveBehavior,
    dl as neutralFillToggleFocusBehavior,
    Kn as neutralFillToggleHover,
    ll as neutralFillToggleHoverBehavior,
    Un as neutralFillToggleRest,
    al as neutralFillToggleRestBehavior,
    Pa as neutralFocus,
    Il as neutralFocusBehavior,
    Ea as neutralFocusInnerAccent,
    zl as neutralFocusInnerAccentBehavior,
    _n as neutralForeground,
    qn as neutralForegroundActive,
    La as neutralForegroundActiveBehavior,
    Ra as neutralForegroundFocusBehavior,
    ns as neutralForegroundHint,
    za as neutralForegroundHintBehavior,
    ss as neutralForegroundHintLarge,
    ja as neutralForegroundHintLargeBehavior,
    Gn as neutralForegroundHover,
    Ba as neutralForegroundHoverBehavior,
    Vn as neutralForegroundRest,
    Ma as neutralForegroundRestBehavior,
    Zn as neutralForegroundToggle,
    Na as neutralForegroundToggleBehavior,
    Jn as neutralForegroundToggleLarge,
    Ia as neutralForegroundToggleLargeBehavior,
    ya as neutralLayerCard,
    Ol as neutralLayerCardBehavior,
    xa as neutralLayerCardContainer,
    Hl as neutralLayerCardContainerBehavior,
    ma as neutralLayerFloating,
    Sl as neutralLayerFloatingBehavior,
    ka as neutralLayerL1,
    wa as neutralLayerL1Alt,
    Bl as neutralLayerL1AltBehavior,
    Ml as neutralLayerL1Behavior,
    Ca as neutralLayerL2,
    Ll as neutralLayerL2Behavior,
    $a as neutralLayerL3,
    Rl as neutralLayerL3Behavior,
    Fa as neutralLayerL4,
    Nl as neutralLayerL4Behavior,
    Js as neutralOutline,
    oa as neutralOutlineActive,
    Tl as neutralOutlineActiveBehavior,
    El as neutralOutlineFocusBehavior,
    ea as neutralOutlineHover,
    Pl as neutralOutlineHoverBehavior,
    ta as neutralOutlineRest,
    Dl as neutralOutlineRestBehavior,
    On as palette,
};
