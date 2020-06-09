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
const e = "fast-" + Math.random().toString(36).substring(7),
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
    nextUpdate: () =>
        new Promise(t => {
            s.queueUpdate(t);
        }),
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
    constructor(t, e) {
        (this.sub1 = void 0),
            (this.sub2 = void 0),
            (this.spillover = void 0),
            (this.source = t),
            (this.sub1 = e);
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
        (this.subscribers = {}), (this.source = t);
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
let v = void 0,
    b = t => {
        throw new Error("Must call enableArrayObservation before observing arrays.");
    };
class g {
    constructor(t, e) {
        (this.name = t),
            (this.field = "_" + t),
            (this.callback = t + "Changed"),
            (this.hasCallback = this.callback in e);
    }
    getValue(t) {
        return void 0 !== v && v.watch(t, this.name), t[this.field];
    }
    setValue(t, e) {
        const o = this.field,
            i = t[o];
        i !== e &&
            ((t[o] = e),
            this.hasCallback && t[this.callback](i, e),
            y(t).notify(this.name));
    }
}
const m = Object.freeze({
        setArrayObserverFactory(t) {
            b = t;
        },
        getNotifier(t) {
            let e = t.$fastController || p.get(t);
            return (
                void 0 === e &&
                    (Array.isArray(t) ? (e = b(t)) : p.set(t, (e = new u(t)))),
                e
            );
        },
        track(t, e) {
            void 0 !== v && v.watch(t, e);
        },
        notify(t, e) {
            y(t).notify(e);
        },
        defineProperty(t, e) {
            "string" == typeof e && (e = new g(e, t)),
                this.getAccessors(t).push(e),
                Reflect.defineProperty(t, e.name, {
                    enumerable: !0,
                    get: function () {
                        return e.getValue(this);
                    },
                    set: function (t) {
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
        binding: (t, e) => new D(t, e),
    }),
    y = m.getNotifier,
    x = s.queueUpdate;
function k(t, e) {
    m.defineProperty(t, e);
}
let w = null;
function C(t) {
    w = t;
}
class $ {
    constructor() {
        (this.index = 0), (this.length = 0), (this.parent = null);
    }
    get event() {
        return w;
    }
    get isEven() {
        return this.index % 2 == 0;
    }
    get isOdd() {
        return this.index % 2 != 0;
    }
    get isFirst() {
        return 0 === this.index;
    }
    get isInMiddle() {
        return !this.isFirst && !this.isLast;
    }
    get isLast() {
        return this.index === this.length - 1;
    }
}
m.defineProperty($.prototype, "index"), m.defineProperty($.prototype, "length");
const F = new $();
class D extends h {
    constructor(t, e) {
        super(t, e),
            (this.binding = t),
            (this.needsRefresh = !0),
            (this.needsQueue = !0),
            (this.first = this),
            (this.last = null),
            (this.propertySource = void 0),
            (this.propertyName = void 0),
            (this.notifier = void 0),
            (this.next = void 0);
    }
    observe(t, e) {
        this.needsRefresh && null !== this.last && this.disconnect();
        const o = v;
        (v = this.needsRefresh ? this : void 0), (this.needsRefresh = !1);
        const i = this.binding(t, e);
        return (v = o), i;
    }
    disconnect() {
        if (null !== this.last) {
            let t = this.first;
            for (; void 0 !== t; )
                t.notifier.unsubscribe(this, t.propertyName), (t = t.next);
            (this.last = null), (this.needsRefresh = !0);
        }
    }
    watch(t, e) {
        const o = this.last,
            i = y(t),
            r = null === o ? this.first : {};
        if (
            ((r.propertySource = t),
            (r.propertyName = e),
            (r.notifier = i),
            i.subscribe(this, e),
            null !== o)
        ) {
            if (!this.needsRefresh) {
                v = void 0;
                const e = o.propertySource[o.propertyName];
                (v = this), t === e && (this.needsRefresh = !0);
            }
            o.next = r;
        }
        this.last = r;
    }
    handleChange() {
        this.needsQueue && ((this.needsQueue = !1), x(this));
    }
    call() {
        (this.needsQueue = !0), this.notify(this);
    }
}
class T {
    constructor() {
        this.targetIndex = 0;
    }
}
class P extends T {
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
function E(t, e) {
    (this.source = t),
        (this.context = e),
        null === this.bindingObserver &&
            (this.bindingObserver = m.binding(this.binding, this)),
        this.updateTarget(this.bindingObserver.observe(t, e));
}
function A(t, e) {
    (this.source = t),
        (this.context = e),
        this.target.addEventListener(this.targetName, this, !0);
}
function S() {
    this.bindingObserver.disconnect(), (this.source = null), (this.context = null);
}
function I() {
    this.bindingObserver.disconnect(), (this.source = null), (this.context = null);
    const t = this.target.$fastView;
    void 0 !== t && t.isComposed && (t.unbind(), (t.needsBindOnly = !0));
}
function H() {
    this.target.removeEventListener(this.targetName, this, !0),
        (this.source = null),
        (this.context = null);
}
function O(t) {
    s.setAttribute(this.target, this.targetName, t);
}
function L(t) {
    s.setBooleanAttribute(this.target, this.targetName, t);
}
function M(t) {
    if ((null == t && (t = ""), t.create)) {
        this.target.textContent = "";
        let e = this.target.$fastView;
        void 0 === e
            ? (e = t.create())
            : this.target.$fastTemplate !== t &&
              (e.isComposed && (e.remove(), e.unbind()), (e = t.create())),
            e.isComposed
                ? e.needsBindOnly &&
                  ((e.needsBindOnly = !1), e.bind(this.source, this.context))
                : ((e.isComposed = !0),
                  e.bind(this.source, this.context),
                  e.insertBefore(this.target),
                  (this.target.$fastView = e),
                  (this.target.$fastTemplate = t));
    } else {
        const e = this.target.$fastView;
        void 0 !== e &&
            e.isComposed &&
            ((e.isComposed = !1),
            e.remove(),
            e.needsBindOnly ? (e.needsBindOnly = !1) : e.unbind()),
            (this.target.textContent = t);
    }
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
class N extends T {
    constructor(t) {
        super(),
            (this.binding = t),
            (this.createPlaceholder = s.createInterpolationPlaceholder),
            (this.bind = E),
            (this.unbind = S),
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
                        const t = this.binding;
                        this.binding = (e, o) => s.createHTML(t(e, o));
                    }
                    break;
                case "?":
                    (this.cleanedTargetName = t.substr(1)), (this.updateTarget = L);
                    break;
                case "@":
                    (this.cleanedTargetName = t.substr(1)),
                        (this.bind = A),
                        (this.unbind = H);
                    break;
                default:
                    (this.cleanedTargetName = t),
                        "class" === t && (this.updateTarget = R);
            }
    }
    targetAtContent() {
        (this.updateTarget = M), (this.unbind = I);
    }
    createBehavior(t) {
        return new z(
            t,
            this.binding,
            this.bind,
            this.unbind,
            this.updateTarget,
            this.cleanedTargetName
        );
    }
}
class z {
    constructor(t, e, o, i, r, n) {
        (this.target = t),
            (this.binding = e),
            (this.bind = o),
            (this.unbind = i),
            (this.updateTarget = r),
            (this.targetName = n),
            (this.source = null),
            (this.context = null),
            (this.bindingObserver = null);
    }
    handleChange() {
        this.updateTarget(this.bindingObserver.observe(this.source, this.context));
    }
    handleEvent(t) {
        C(t);
        const e = this.binding(this.source, this.context);
        C(null), !0 !== e && t.preventDefault();
    }
}
const j = { locatedDirectives: 0, targetIndex: -1 };
function _(t) {
    let e;
    const o = t.length,
        i = t.map(t =>
            "string" == typeof t
                ? () => t
                : ((e = t.targetName || e), j.locatedDirectives++, t.binding)
        ),
        r = new N((t, e) => {
            let r = "";
            for (let n = 0; n < o; ++n) r += i[n](t, e);
            return r;
        });
    return (r.targetName = e), r;
}
function V(t, e) {
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
function G(t, e, o, i = !1) {
    const r = t.attributes;
    for (let n = 0, s = r.length; n < s; ++n) {
        const a = r[n],
            l = a.value;
        let c = V(l, e);
        null === c
            ? i && ((c = new N(() => l)), (c.targetName = a.name))
            : Array.isArray(c)
            ? (c = _(c))
            : j.locatedDirectives++,
            null !== c &&
                (t.removeAttributeNode(a),
                n--,
                s--,
                (c.targetIndex = j.targetIndex),
                o.push(c));
    }
}
function q(t, e) {
    t.targetAtContent(),
        (t.targetIndex = j.targetIndex),
        e.push(t),
        j.locatedDirectives++;
}
function W(t, e, o, i) {
    const r = V(t.textContent, e);
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
                    : ((a.textContent = " "), q(s, o)),
                    (e = a),
                    j.targetIndex++,
                    a !== t && i.nextNode();
            }
            j.targetIndex--;
        } else (t.textContent = " "), q(r, o);
}
const U = document.createRange();
class K {
    constructor(t, e) {
        (this.fragment = t),
            (this.behaviors = e),
            (this.source = null),
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
            if (null !== this.source) {
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
        if (null === this.source) return;
        const t = this.behaviors,
            e = this.source;
        for (let o = 0, i = t.length; o < i; ++o) t[o].unbind(e);
        this.source = null;
    }
    static disposeContiguousBatch(t) {
        if (0 !== t.length) {
            U.setStart(t[0].firstChild, 0),
                U.setEnd(t[t.length - 1].lastChild, 0),
                U.deleteContents();
            for (let e = 0, o = t.length; e < o; ++e) {
                const o = t[e],
                    i = o.behaviors,
                    r = o.source;
                for (let t = 0, e = i.length; t < e; ++t) i[t].unbind(r);
            }
        }
    }
}
class X {
    constructor(t, e) {
        (this.html = t),
            (this.directives = e),
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
            const o = (function (t, e) {
                const o = [];
                (j.locatedDirectives = 0), G(t, e, o, !0);
                const i = t.content,
                    r = [],
                    n = e.length,
                    a = document.createTreeWalker(i, 133, null, !1);
                for (j.targetIndex = -1; j.locatedDirectives < n; ) {
                    const t = a.nextNode();
                    if (null === t) break;
                    switch ((j.targetIndex++, t.nodeType)) {
                        case 1:
                            G(t, e, r);
                            break;
                        case 3:
                            W(t, e, r, a);
                            break;
                        case 8:
                            if (s.isMarker(t)) {
                                const o = e[s.extractDirectiveIndexFromMarker(t)];
                                (o.targetIndex = j.targetIndex),
                                    j.locatedDirectives++,
                                    r.push(o);
                            } else t.parentNode.removeChild(t), j.targetIndex--;
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
        return new K(e, i);
    }
    render(t, e) {
        "string" == typeof e && (e = document.getElementById(e));
        const o = this.create(e);
        return o.bind(t, F), o.appendTo(e), o;
    }
}
const Y = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
function Q(t, ...e) {
    const o = [];
    let i = "";
    for (let r = 0, n = t.length - 1; r < n; ++r) {
        const n = t[r];
        let s = e[r];
        if (((i += n), s instanceof X)) {
            const t = s;
            s = () => t;
        }
        if ("function" == typeof s) {
            s = new N(s);
            const t = Y.exec(n);
            null !== t && (s.targetName = t[2]);
        }
        s instanceof T ? ((i += s.createPlaceholder(o.length)), o.push(s)) : (i += s);
    }
    return (i += t[t.length - 1]), new X(i, o);
}
const Z = {
        toView: t => (t ? "true" : "false"),
        fromView: t => null != t && "false" !== t && !1 !== t && 0 !== t,
    },
    J = {
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
class tt {
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
            "boolean" === i && void 0 === r && (this.converter = Z);
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
        return m.track(t, this.name), t[this.fieldName];
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
                        ? o.push(new tt(t, i))
                        : o.push(new tt(t, i.property, i.attribute, i.mode, i.converter));
                }
        }
        return o;
    }
}
function et(t, e) {
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
class ot {
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
const it = new Map();
function rt(t) {
    return it.get(t);
}
const nt = { bubbles: !0, composed: !0 };
class st extends u {
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
        const n = m.getAccessors(t);
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
            for (let i = 0; i < o; ++i) t[i].bind(e, F);
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
        null !== o && o.bind(t, F);
        const i = this.behaviors;
        if (null !== i) for (let e = 0, o = i.length; e < o; ++e) i[e].bind(t, F);
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
                new CustomEvent(t, Object.assign(Object.assign({ detail: e }, nt), o))
            )
        );
    }
    static forCustomElement(t) {
        const e = t.$fastController;
        if (void 0 !== e) return e;
        const o = rt(t.constructor);
        if (void 0 === o) throw new Error("Missing fast element definition.");
        return (t.$fastController = new st(t, o));
    }
}
const at = { mode: "open" },
    lt = {};
function ct(t) {
    return class extends t {
        constructor() {
            super(), st.forCustomElement(this);
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
const dt = Object.assign(ct(HTMLElement), {
    from: t => ct(t),
    define(t, e = t.definition) {
        "string" == typeof e && (e = { name: e });
        const o = e.name,
            i = tt.collect(t, e.attributes),
            r =
                void 0 === e.shadowOptions
                    ? at
                    : null === e.shadowOptions
                    ? void 0
                    : Object.assign(Object.assign({}, at), e.shadowOptions),
            n =
                void 0 === e.elementOptions
                    ? lt
                    : Object.assign(Object.assign({}, lt), e.shadowOptions),
            s = new Array(i.length),
            a = t.prototype,
            l = {},
            c = {};
        for (let t = 0, e = i.length; t < e; ++t) {
            const e = i[t];
            (s[t] = e.attribute),
                (l[e.name] = e),
                (c[e.attribute] = e),
                m.defineProperty(a, e);
        }
        Reflect.defineProperty(t, "observedAttributes", { value: s, enumerable: !0 });
        const d = new ot(o, i, l, c, e.template, e.styles, r, n);
        return it.set(t, d), customElements.define(o, t, d.elementOptions), t;
    },
    getDefinition: rt,
});
function ht(t) {
    return function (e) {
        dt.define(e, t);
    };
}
const ut = Object.freeze([]),
    pt = new Map();
class ft {
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
        return pt.set(t, this), this;
    }
    static find(t) {
        return pt.get(t) || null;
    }
}
function vt(t) {
    return t
        .map(t => (t instanceof ft ? vt(t.styles) : [t]))
        .reduce((t, e) => t.concat(e), []);
}
function bt(t) {
    return t
        .map(t => (t instanceof ft ? t.behaviors : null))
        .reduce((t, e) => (null === e ? t : (null === t && (t = []), t.concat(e))), null);
}
class gt extends ft {
    constructor(t, e) {
        super(),
            (this.styles = t),
            (this.behaviors = null),
            (this.behaviors = bt(t)),
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
let mt = 0;
class yt extends ft {
    constructor(t) {
        super(),
            (this.styles = t),
            (this.behaviors = null),
            (this.behaviors = bt(t)),
            (this.styleSheets = vt(t)),
            (this.styleClass = "fast-style-class-" + ++mt);
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
const xt = (() => {
    if ("adoptedStyleSheets" in window.ShadowRoot.prototype) {
        const t = new Map();
        return e => new gt(e, t);
    }
    return t => new yt(t);
})();
function kt(t, ...e) {
    const o = [];
    let i = "";
    for (let r = 0, n = t.length - 1; r < n; ++r) {
        i += t[r];
        const n = e[r];
        n instanceof ft
            ? ("" !== i.trim() && (o.push(i), (i = "")), o.push(n))
            : (i += n);
    }
    return (i += t[t.length - 1]), "" !== i.trim() && o.push(i), xt(o);
}
class wt {
    constructor(t, e) {
        (this.target = t), (this.propertyName = e);
    }
    bind(t) {
        t[this.propertyName] = this.target;
    }
    unbind() {}
}
function Ct(t) {
    return new P("fast-ref", wt, t);
}
function $t(t, e) {
    const o = "function" == typeof e ? e : () => e;
    return (e, i) => (t(e, i) ? o(e, i) : null);
}
class Ft extends class {
    constructor(t, e) {
        (this.target = t), (this.options = e), (this.source = null);
    }
    bind(t) {
        const e = this.options.property;
        (this.shouldUpdate = m.getAccessors(t).some(t => t.name === e)),
            (this.source = t),
            this.updateTarget(this.getNodes()),
            this.shouldUpdate && this.observe();
    }
    unbind() {
        this.updateTarget(ut),
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
function Dt(t) {
    return "string" == typeof t && (t = { property: t }), new P("fast-slotted", Ft, t);
}
const Tt = Q`
    <template>
        <slot name="item" part="item" ${Dt("accordionItems")}></slot>
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
***************************************************************************** */ function Pt(
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
var Et;
!(function (t) {
    (t.horizontal = "horizontal"), (t.vertical = "vertical");
})(Et || (Et = {}));
var At = "object" == typeof global && global && global.Object === Object && global,
    St = "object" == typeof self && self && self.Object === Object && self,
    It = At || St || Function("return this")(),
    Ht = It.Symbol,
    Ot = Object.prototype,
    Lt = Ot.hasOwnProperty,
    Mt = Ot.toString,
    Bt = Ht ? Ht.toStringTag : void 0;
var Rt = Object.prototype.toString;
var Nt = Ht ? Ht.toStringTag : void 0;
function zt(t) {
    return null == t
        ? void 0 === t
            ? "[object Undefined]"
            : "[object Null]"
        : Nt && Nt in Object(t)
        ? (function (t) {
              var e = Lt.call(t, Bt),
                  o = t[Bt];
              try {
                  t[Bt] = void 0;
                  var i = !0;
              } catch (t) {}
              var r = Mt.call(t);
              return i && (e ? (t[Bt] = o) : delete t[Bt]), r;
          })(t)
        : (function (t) {
              return Rt.call(t);
          })(t);
}
function jt(t) {
    return null != t && "object" == typeof t;
}
var _t = Array.isArray;
function Vt(t) {
    var e = typeof t;
    return null != t && ("object" == e || "function" == e);
}
var Gt = /^\s+|\s+$/g,
    qt = /^[-+]0x[0-9a-f]+$/i,
    Wt = /^0b[01]+$/i,
    Ut = /^0o[0-7]+$/i,
    Kt = parseInt;
function Xt(t) {
    if ("number" == typeof t) return t;
    if (
        (function (t) {
            return "symbol" == typeof t || (jt(t) && "[object Symbol]" == zt(t));
        })(t)
    )
        return NaN;
    if (Vt(t)) {
        var e = "function" == typeof t.valueOf ? t.valueOf() : t;
        t = Vt(e) ? e + "" : e;
    }
    if ("string" != typeof t) return 0 === t ? t : +t;
    t = t.replace(Gt, "");
    var o = Wt.test(t);
    return o || Ut.test(t) ? Kt(t.slice(2), o ? 2 : 8) : qt.test(t) ? NaN : +t;
}
function Yt(t) {
    return t
        ? (t = Xt(t)) === 1 / 0 || t === -1 / 0
            ? 17976931348623157e292 * (t < 0 ? -1 : 1)
            : t == t
            ? t
            : 0
        : 0 === t
        ? t
        : 0;
}
function Qt(t) {
    if (!Vt(t)) return !1;
    var e = zt(t);
    return (
        "[object Function]" == e ||
        "[object GeneratorFunction]" == e ||
        "[object AsyncFunction]" == e ||
        "[object Proxy]" == e
    );
}
var Zt,
    Jt = It["__core-js_shared__"],
    te = (Zt = /[^.]+$/.exec((Jt && Jt.keys && Jt.keys.IE_PROTO) || ""))
        ? "Symbol(src)_1." + Zt
        : "";
var ee = Function.prototype.toString;
var oe = /^\[object .+?Constructor\]$/,
    ie = Function.prototype,
    re = Object.prototype,
    ne = ie.toString,
    se = re.hasOwnProperty,
    ae = RegExp(
        "^" +
            ne
                .call(se)
                .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
                .replace(
                    /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                    "$1.*?"
                ) +
            "$"
    );
function le(t) {
    return (
        !(!Vt(t) || ((e = t), te && te in e)) &&
        (Qt(t) ? ae : oe).test(
            (function (t) {
                if (null != t) {
                    try {
                        return ee.call(t);
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
function ce(t, e) {
    var o = (function (t, e) {
        return null == t ? void 0 : t[e];
    })(t, e);
    return le(o) ? o : void 0;
}
var de = /^(?:0|[1-9]\d*)$/;
function he(t, e) {
    var o = typeof t;
    return (
        !!(e = null == e ? 9007199254740991 : e) &&
        ("number" == o || ("symbol" != o && de.test(t))) &&
        t > -1 &&
        t % 1 == 0 &&
        t < e
    );
}
function ue(t) {
    return "number" == typeof t && t > -1 && t % 1 == 0 && t <= 9007199254740991;
}
var pe = Object.prototype;
function fe(t) {
    return jt(t) && "[object Arguments]" == zt(t);
}
var ve = Object.prototype,
    be = ve.hasOwnProperty,
    ge = ve.propertyIsEnumerable,
    me = fe(
        (function () {
            return arguments;
        })()
    )
        ? fe
        : function (t) {
              return jt(t) && be.call(t, "callee") && !ge.call(t, "callee");
          };
var ye = "object" == typeof exports && exports && !exports.nodeType && exports,
    xe = ye && "object" == typeof module && module && !module.nodeType && module,
    ke = xe && xe.exports === ye ? It.Buffer : void 0,
    we =
        (ke ? ke.isBuffer : void 0) ||
        function () {
            return !1;
        },
    Ce = {};
(Ce["[object Float32Array]"] = Ce["[object Float64Array]"] = Ce[
    "[object Int8Array]"
] = Ce["[object Int16Array]"] = Ce["[object Int32Array]"] = Ce[
    "[object Uint8Array]"
] = Ce["[object Uint8ClampedArray]"] = Ce["[object Uint16Array]"] = Ce[
    "[object Uint32Array]"
] = !0),
    (Ce["[object Arguments]"] = Ce["[object Array]"] = Ce["[object ArrayBuffer]"] = Ce[
        "[object Boolean]"
    ] = Ce["[object DataView]"] = Ce["[object Date]"] = Ce["[object Error]"] = Ce[
        "[object Function]"
    ] = Ce["[object Map]"] = Ce["[object Number]"] = Ce["[object Object]"] = Ce[
        "[object RegExp]"
    ] = Ce["[object Set]"] = Ce["[object String]"] = Ce["[object WeakMap]"] = !1);
var $e,
    Fe = "object" == typeof exports && exports && !exports.nodeType && exports,
    De = Fe && "object" == typeof module && module && !module.nodeType && module,
    Te = De && De.exports === Fe && At.process,
    Pe = (function () {
        try {
            var t = De && De.require && De.require("util").types;
            return t || (Te && Te.binding && Te.binding("util"));
        } catch (t) {}
    })(),
    Ee = Pe && Pe.isTypedArray,
    Ae = Ee
        ? (($e = Ee),
          function (t) {
              return $e(t);
          })
        : function (t) {
              return jt(t) && ue(t.length) && !!Ce[zt(t)];
          },
    Se = Object.prototype.hasOwnProperty;
function Ie(t, e) {
    var o = _t(t),
        i = !o && me(t),
        r = !o && !i && we(t),
        n = !o && !i && !r && Ae(t),
        s = o || i || r || n,
        a = s
            ? (function (t, e) {
                  for (var o = -1, i = Array(t); ++o < t; ) i[o] = e(o);
                  return i;
              })(t.length, String)
            : [],
        l = a.length;
    for (var c in t)
        (!e && !Se.call(t, c)) ||
            (s &&
                ("length" == c ||
                    (r && ("offset" == c || "parent" == c)) ||
                    (n && ("buffer" == c || "byteLength" == c || "byteOffset" == c)) ||
                    he(c, l))) ||
            a.push(c);
    return a;
}
var He = (function (t, e) {
        return function (o) {
            return t(e(o));
        };
    })(Object.keys, Object),
    Oe = Object.prototype.hasOwnProperty;
function Le(t) {
    if (
        ((o = (e = t) && e.constructor),
        e !== (("function" == typeof o && o.prototype) || pe))
    )
        return He(t);
    var e,
        o,
        i = [];
    for (var r in Object(t)) Oe.call(t, r) && "constructor" != r && i.push(r);
    return i;
}
function Me(t) {
    return null != (e = t) && ue(e.length) && !Qt(e) ? Ie(t) : Le(t);
    var e;
}
var Be = ce(Object, "create");
var Re = Object.prototype.hasOwnProperty;
var Ne = Object.prototype.hasOwnProperty;
function ze(t) {
    var e = -1,
        o = null == t ? 0 : t.length;
    for (this.clear(); ++e < o; ) {
        var i = t[e];
        this.set(i[0], i[1]);
    }
}
function je(t, e) {
    for (var o, i, r = t.length; r--; )
        if ((o = t[r][0]) === (i = e) || (o != o && i != i)) return r;
    return -1;
}
(ze.prototype.clear = function () {
    (this.__data__ = Be ? Be(null) : {}), (this.size = 0);
}),
    (ze.prototype.delete = function (t) {
        var e = this.has(t) && delete this.__data__[t];
        return (this.size -= e ? 1 : 0), e;
    }),
    (ze.prototype.get = function (t) {
        var e = this.__data__;
        if (Be) {
            var o = e[t];
            return "__lodash_hash_undefined__" === o ? void 0 : o;
        }
        return Re.call(e, t) ? e[t] : void 0;
    }),
    (ze.prototype.has = function (t) {
        var e = this.__data__;
        return Be ? void 0 !== e[t] : Ne.call(e, t);
    }),
    (ze.prototype.set = function (t, e) {
        var o = this.__data__;
        return (
            (this.size += this.has(t) ? 0 : 1),
            (o[t] = Be && void 0 === e ? "__lodash_hash_undefined__" : e),
            this
        );
    });
var _e = Array.prototype.splice;
function Ve(t) {
    var e = -1,
        o = null == t ? 0 : t.length;
    for (this.clear(); ++e < o; ) {
        var i = t[e];
        this.set(i[0], i[1]);
    }
}
(Ve.prototype.clear = function () {
    (this.__data__ = []), (this.size = 0);
}),
    (Ve.prototype.delete = function (t) {
        var e = this.__data__,
            o = je(e, t);
        return (
            !(o < 0) && (o == e.length - 1 ? e.pop() : _e.call(e, o, 1), --this.size, !0)
        );
    }),
    (Ve.prototype.get = function (t) {
        var e = this.__data__,
            o = je(e, t);
        return o < 0 ? void 0 : e[o][1];
    }),
    (Ve.prototype.has = function (t) {
        return je(this.__data__, t) > -1;
    }),
    (Ve.prototype.set = function (t, e) {
        var o = this.__data__,
            i = je(o, t);
        return i < 0 ? (++this.size, o.push([t, e])) : (o[i][1] = e), this;
    });
var Ge = ce(It, "Map");
function qe(t, e) {
    var o,
        i,
        r = t.__data__;
    return (
        "string" == (i = typeof (o = e)) ||
        "number" == i ||
        "symbol" == i ||
        "boolean" == i
            ? "__proto__" !== o
            : null === o
    )
        ? r["string" == typeof e ? "string" : "hash"]
        : r.map;
}
function We(t) {
    var e = -1,
        o = null == t ? 0 : t.length;
    for (this.clear(); ++e < o; ) {
        var i = t[e];
        this.set(i[0], i[1]);
    }
}
(We.prototype.clear = function () {
    (this.size = 0),
        (this.__data__ = { hash: new ze(), map: new (Ge || Ve)(), string: new ze() });
}),
    (We.prototype.delete = function (t) {
        var e = qe(this, t).delete(t);
        return (this.size -= e ? 1 : 0), e;
    }),
    (We.prototype.get = function (t) {
        return qe(this, t).get(t);
    }),
    (We.prototype.has = function (t) {
        return qe(this, t).has(t);
    }),
    (We.prototype.set = function (t, e) {
        var o = qe(this, t),
            i = o.size;
        return o.set(t, e), (this.size += o.size == i ? 0 : 1), this;
    });
function Ue(t, e) {
    if ("function" != typeof t || (null != e && "function" != typeof e))
        throw new TypeError("Expected a function");
    var o = function () {
        var i = arguments,
            r = e ? e.apply(this, i) : i[0],
            n = o.cache;
        if (n.has(r)) return n.get(r);
        var s = t.apply(this, i);
        return (o.cache = n.set(r, s) || n), s;
    };
    return (o.cache = new (Ue.Cache || We)()), o;
}
Ue.Cache = We;
var Ke,
    Xe = function (t, e, o) {
        for (var i = -1, r = Object(t), n = o(t), s = n.length; s--; ) {
            var a = n[Ke ? s : ++i];
            if (!1 === e(r[a], a, r)) break;
        }
        return t;
    };
var Ye = Math.max,
    Qe = Math.min;
function Ze(t, e, o) {
    return (
        (e = Yt(e)),
        void 0 === o ? ((o = e), (e = 0)) : (o = Yt(o)),
        (function (t, e, o) {
            return t >= Qe(e, o) && t < Ye(e, o);
        })((t = Xt(t)), e, o)
    );
}
function Je(t, e, o, i) {
    return (
        (function (t, e) {
            t && Xe(t, e, Me);
        })(t, function (t, r, n) {
            e(i, o(t), r, n);
        }),
        i
    );
}
var to,
    eo,
    oo = Object.prototype.toString,
    io =
        ((to = function (t, e, o) {
            null != e && "function" != typeof e.toString && (e = oo.call(e)), (t[e] = o);
        }),
        (eo = (function (t) {
            return function () {
                return t;
            };
        })(function (t) {
            return t;
        })),
        function (t, e) {
            return Je(t, to, eo(e), {});
        });
let ro;
var no;
!(function (t) {
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
})(no || (no = {}));
var so, ao;
function lo(t, e, o) {
    return o < t ? e : o > e ? t : o;
}
!(function (t) {
    (t.ltr = "ltr"), (t.rtl = "rtl");
})(so || (so = {})),
    (function (t) {
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
    })(ao || (ao = {}));
class co {
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
const ho = Q`
    <span class="end" part="end" ${Ct("endContainer")}>
        <slot
            name="end"
            ${Ct("end")}
            @slotchange=${t => t.handleEndContentChange()}
        ></slot>
    </span>
`,
    uo = Q`
    <span class="start" part="start" ${Ct("startContainer")}>
        <slot
            name="start"
            ${Ct("start")}
            @slotchange=${t => t.handleStartContentChange()}
        ></slot>
    </span>
`;
function po(t, ...e) {
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
class fo extends dt {
    constructor() {
        super(...arguments),
            (this.headinglevel = 2),
            (this.expanded = !1),
            (this.clickHandler = t => {
                (this.expanded = !this.expanded), this.change();
            }),
            (this.change = () => {
                this.$emit("change");
            });
    }
}
var vo;
Pt(
    [et({ attribute: "heading-level", mode: "fromView", converter: J })],
    fo.prototype,
    "headinglevel",
    void 0
),
    Pt([et({ mode: "boolean" })], fo.prototype, "expanded", void 0),
    Pt([et], fo.prototype, "id", void 0),
    po(fo, co),
    (function (t) {
        (t.single = "single"), (t.multi = "multi");
    })(vo || (vo = {}));
class bo extends dt {
    constructor() {
        super(...arguments),
            (this.expandmode = vo.multi),
            (this.activeItemIndex = 0),
            (this.change = () => {
                this.$emit("change");
            }),
            (this.setItems = () => {
                (this.accordionIds = this.getItemIds()),
                    this.accordionItems.forEach((t, e) => {
                        t instanceof fo &&
                            (t.addEventListener("change", this.activeItemChange),
                            this.isSingleExpandMode() &&
                                (this.activeItemIndex !== e
                                    ? (t.expanded = !1)
                                    : (t.expanded = !0)));
                        const o = this.accordionIds[e];
                        t.setAttribute(
                            "id",
                            "string" != typeof o ? "accordion-" + (e + 1) : o
                        ),
                            (this.activeid = this.accordionIds[this.activeItemIndex]),
                            t.addEventListener("keydown", this.handleItemKeyDown);
                    });
            }),
            (this.removeItemListeners = t => {
                t.forEach((t, e) => {
                    t.removeEventListener("change", this.activeItemChange),
                        t.removeEventListener("keydown", this.handleItemKeyDown);
                });
            }),
            (this.activeItemChange = t => {
                const e = t.target;
                this.isSingleExpandMode() &&
                    (this.resetItems(), (t.target.expanded = !0)),
                    (this.activeid = t.target.getAttribute("id")),
                    (this.activeItemIndex = Array.from(this.accordionItems).indexOf(e)),
                    this.change();
            }),
            (this.handleItemKeyDown = t => {
                const e = t.keyCode;
                switch (((this.accordionIds = this.getItemIds()), e)) {
                    case 38:
                        t.preventDefault(), this.adjust(-1);
                        break;
                    case 40:
                        t.preventDefault(), this.adjust(1);
                        break;
                    case 36:
                        (this.activeItemIndex = 0), this.focusItem();
                        break;
                    case 35:
                        (this.activeItemIndex = this.accordionItems.length - 1),
                            this.focusItem();
                }
            });
    }
    accordionItemsChanged(t, e) {
        this.$fastController.isConnected &&
            (this.removeItemListeners(t),
            (this.accordionIds = this.getItemIds()),
            this.setItems());
    }
    resetItems() {
        this.accordionItems.forEach((t, e) => {
            t.expanded = !1;
        });
    }
    getItemIds() {
        return this.accordionItems.map(t => t.getAttribute("id"));
    }
    isSingleExpandMode() {
        return this.expandmode === vo.single;
    }
    adjust(t) {
        (this.activeItemIndex = lo(
            0,
            this.accordionItems.length - 1,
            this.activeItemIndex + t
        )),
            this.focusItem();
    }
    focusItem() {
        const t = this.accordionItems[this.activeItemIndex];
        t instanceof fo && t.expandbutton.focus();
    }
}
Pt([et({ attribute: "expand-mode" })], bo.prototype, "expandmode", void 0),
    Pt([k], bo.prototype, "accordionItems", void 0);
const go = Q`
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
            ${uo}
            <span class="content" part="content">
                <slot></slot>
            </span>
            ${ho}
        </a>
    </template>
`;
class mo extends dt {
    constructor() {
        super(...arguments), (this.appearance = "neutral");
    }
}
Pt([et], mo.prototype, "appearance", void 0),
    Pt([et], mo.prototype, "download", void 0),
    Pt([et], mo.prototype, "href", void 0),
    Pt([et], mo.prototype, "hreflang", void 0),
    Pt([et], mo.prototype, "ping", void 0),
    Pt([et], mo.prototype, "referrerpolicy", void 0),
    Pt([et], mo.prototype, "rel", void 0),
    Pt([et], mo.prototype, "target", void 0),
    Pt([et], mo.prototype, "type", void 0),
    po(mo, co);
const yo = Q`
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
class xo extends dt {}
Pt([et({ attribute: "fill" })], xo.prototype, "fill", void 0),
    Pt([et({ attribute: "color" })], xo.prototype, "color", void 0),
    Pt([et({ mode: "boolean" })], xo.prototype, "circular", void 0);
const ko = Q`
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
            ${uo}
            <span class="content" part="content">
                <slot></slot>
            </span>
            ${ho}
        </button>
    </template>
`,
    wo = "ElementInternals" in window;
class Co extends dt {
    constructor() {
        super(),
            (this.value = ""),
            (this.disabled = !1),
            (this.required = !1),
            (this.proxyEventsToBlock = ["change", "click"]),
            wo && (this.elementInternals = this.attachInternals());
    }
    static get formAssociated() {
        return wo;
    }
    get validity() {
        return wo ? this.elementInternals.validity : this.proxy.validity;
    }
    get form() {
        return wo ? this.elementInternals.form : this.proxy.form;
    }
    get validationMessage() {
        return wo
            ? this.elementInternals.validationMessage
            : this.proxy.validationMessage;
    }
    get willValidate() {
        return wo ? this.elementInternals.willValidate : this.proxy.willValidate;
    }
    get labels() {
        if (wo) return Object.freeze(Array.from(this.elementInternals.labels));
        if (this.proxy instanceof HTMLElement && this.proxy.ownerDocument && this.id) {
            const t = this.proxy.labels,
                e = Array.from(
                    this.proxy.getRootNode().querySelectorAll(`[for='${this.id}']`)
                ),
                o = t ? e.concat(Array.from(t)) : e;
            return Object.freeze(o);
        }
        return ut;
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
            wo ||
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
        return wo ? this.elementInternals.checkValidity() : this.proxy.checkValidity();
    }
    reportValidity() {
        return wo ? this.elementInternals.reportValidity() : this.proxy.reportValidity();
    }
    setValidity(t, e, o) {
        wo
            ? this.elementInternals.setValidity(t, e, o)
            : "string" == typeof e && this.proxy.setCustomValidity(e);
    }
    formDisabledCallback(t) {
        this.disabled = t;
    }
    setFormValue(t, e) {
        wo && this.elementInternals.setFormValue(t, e);
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
Pt([et], Co.prototype, "value", void 0),
    Pt([et({ mode: "boolean" })], Co.prototype, "disabled", void 0),
    Pt([et], Co.prototype, "name", void 0),
    Pt([et({ mode: "boolean" })], Co.prototype, "required", void 0);
class $o extends Co {
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
Pt([et], $o.prototype, "appearance", void 0),
    Pt([et({ mode: "boolean" })], $o.prototype, "autofocus", void 0),
    Pt([et({ attribute: "form" })], $o.prototype, "formId", void 0),
    Pt([et], $o.prototype, "formaction", void 0),
    Pt([et], $o.prototype, "formenctype", void 0),
    Pt([et], $o.prototype, "formmethod", void 0),
    Pt([et({ mode: "boolean" })], $o.prototype, "formnovalidate", void 0),
    Pt([et], $o.prototype, "formtarget", void 0),
    Pt([et], $o.prototype, "name", void 0),
    Pt([et], $o.prototype, "type", void 0),
    po($o, co);
const Fo = Q`<slot></slot>`;
class Do extends dt {}
const To = Q`
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
            <slot ${Dt("defaultSlottedNodes")}></slot>
        </label>
    </template>
`;
class Po extends Co {
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
function Eo(t, e, o) {
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
function Ao(t) {
    const e = t.parentElement;
    if (e) return e;
    {
        const e = t.getRootNode();
        if (e.host instanceof HTMLElement) return e.host;
    }
    return null;
}
Pt([et({ attribute: "readonly", mode: "boolean" })], Po.prototype, "readOnly", void 0),
    Pt(
        [et({ attribute: "checked", mode: "boolean" })],
        Po.prototype,
        "checkedAttribute",
        void 0
    ),
    Pt([k], Po.prototype, "defaultSlottedNodes", void 0),
    Pt([k], Po.prototype, "defaultChecked", void 0),
    Pt([k], Po.prototype, "checked", void 0),
    Pt([k], Po.prototype, "indeterminate", void 0);
const So = (function (t) {
    const e = new WeakMap();
    return o =>
        Object.freeze({
            query: t,
            cache: e,
            sheet: o,
            constructListener(t, e) {
                let o = !1;
                return function () {
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
function Io(t) {
    return `\n        \n    :host([hidden]) {\n        display: none;\n    }\n :host {\n            display: ${t};\n        }\n    `;
}
const Ho = (function () {
        if (!0 === (t = ro) || !1 === t || (jt(t) && "[object Boolean]" == zt(t)))
            return ro;
        var t;
        if (
            "undefined" == typeof window ||
            !window.document ||
            !window.document.createElement
        )
            return (ro = !1), ro;
        const e = document.createElement("style");
        document.head.appendChild(e);
        try {
            e.sheet.insertRule("foo:focus-visible {color:inherit}", 0), (ro = !0);
        } catch (t) {
            ro = !1;
        } finally {
            document.head.removeChild(e);
        }
        return ro;
    })()
        ? "focus-visible"
        : "focus",
    Oo = "adoptedStyleSheets" in window.ShadowRoot.prototype;
function Lo(t) {
    const e = t.provider;
    return null != e && Bo.isDesignSystemProvider(e);
}
const Mo = {
    bind(t) {
        t.provider = Bo.findProvider(t);
    },
    unbind(t) {},
};
class Bo extends dt {
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
            Oo && null !== this.shadowRoot)
        ) {
            const t = new CSSStyleSheet();
            t.insertRule(":host{}"),
                (this.shadowRoot.adoptedStyleSheets = [
                    ...this.shadowRoot.adoptedStyleSheets,
                    t,
                ]),
                (this.customPropertyTarget = t.rules[0].style);
        } else this.customPropertyTarget = this.style;
        this.$fastController.addBehaviors([Mo]);
    }
    static get tagNames() {
        return Bo._tagNames;
    }
    static isDesignSystemProvider(t) {
        return t.isDesignSystemProvider || -1 !== Bo.tagNames.indexOf(t.tagName);
    }
    static findProvider(t) {
        if (Lo(t)) return t.provider;
        let e = Ao(t);
        for (; null !== e; ) {
            if (Bo.isDesignSystemProvider(e)) return (t.provider = e), e;
            if (Lo(e)) return (t.provider = e.provider), e.provider;
            e = Ao(e);
        }
        return null;
    }
    static registerTagName(t) {
        const e = t.toUpperCase();
        -1 === Bo.tagNames.indexOf(e) && Bo._tagNames.push(e);
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
                m.getNotifier(t.designSystem).unsubscribe(
                    this.providerDesignSystemChangeHandler,
                    e
                );
            }),
            e instanceof HTMLElement &&
                Bo.isDesignSystemProvider(e) &&
                (Object.keys(e.designSystemProperties).forEach(t => {
                    m.getNotifier(e.designSystem).subscribe(
                        this.providerDesignSystemChangeHandler,
                        t
                    );
                }),
                this.syncDesignSystemWithProvider());
    }
    connectedCallback() {
        super.connectedCallback();
        const t = m.getNotifier(this),
            e = m.getNotifier(this.designSystem);
        if (
            (Object.keys(this.designSystemProperties).forEach(o => {
                k(this.designSystem, o),
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
function Ro(t) {
    return (e, o) => {
        ((t, e, o) => {
            const { cssCustomProperty: i, attribute: r } = o;
            t.designSystemProperties || (t.designSystemProperties = {}),
                !1 === r
                    ? k(t, e)
                    : (void 0 === o.mode &&
                          (o = Object.assign(Object.assign({}, o), { mode: "fromView" })),
                      et(o)(t, e)),
                (t.designSystemProperties[e] = {
                    cssCustomProperty:
                        !1 !== i &&
                        ("string" == typeof i ? i : "string" == typeof r ? r : e),
                    default: o.default,
                });
        })(e, o, t);
    };
}
(Bo._tagNames = []),
    Pt(
        [et({ attribute: "use-defaults", mode: "boolean" })],
        Bo.prototype,
        "useDefaults",
        void 0
    ),
    Pt([k], Bo.prototype, "provider", void 0);
const No = Q`<slot></slot>`,
    zo = Q`
    <div class="positioning-region" part="positioning-region">
        ${$t(
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
var jo = [
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
    _o = jo.join(","),
    Vo =
        "undefined" == typeof Element
            ? function () {}
            : Element.prototype.matches ||
              Element.prototype.msMatchesSelector ||
              Element.prototype.webkitMatchesSelector;
function Go(t, e) {
    e = e || {};
    var o,
        i,
        r,
        n = [],
        s = [],
        a = t.querySelectorAll(_o);
    for (
        e.includeContainer &&
            Vo.call(t, _o) &&
            (a = Array.prototype.slice.apply(a)).unshift(t),
            o = 0;
        o < a.length;
        o++
    )
        qo((i = a[o])) &&
            (0 === (r = Ko(i))
                ? n.push(i)
                : s.push({ documentOrder: o, tabIndex: r, node: i }));
    return s
        .sort(Xo)
        .map(function (t) {
            return t.node;
        })
        .concat(n);
}
function qo(t) {
    return !(
        !Wo(t) ||
        (function (t) {
            return (
                (function (t) {
                    return Yo(t) && "radio" === t.type;
                })(t) &&
                !(function (t) {
                    if (!t.name) return !0;
                    var e = (function (t) {
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
        Ko(t) < 0
    );
}
function Wo(t) {
    return !(
        t.disabled ||
        (function (t) {
            return Yo(t) && "hidden" === t.type;
        })(t) ||
        (function (t) {
            return null === t.offsetParent || "hidden" === getComputedStyle(t).visibility;
        })(t)
    );
}
(Go.isTabbable = function (t) {
    if (!t) throw new Error("No node provided");
    return !1 !== Vo.call(t, _o) && qo(t);
}),
    (Go.isFocusable = function (t) {
        if (!t) throw new Error("No node provided");
        return !1 !== Vo.call(t, Uo) && Wo(t);
    });
var Uo = jo.concat("iframe").join(",");
function Ko(t) {
    var e = parseInt(t.getAttribute("tabindex"), 10);
    return isNaN(e)
        ? (function (t) {
              return "true" === t.contentEditable;
          })(t)
            ? 0
            : t.tabIndex
        : e;
}
function Xo(t, e) {
    return t.tabIndex === e.tabIndex
        ? t.documentOrder - e.documentOrder
        : t.tabIndex - e.tabIndex;
}
function Yo(t) {
    return "INPUT" === t.tagName;
}
var Qo = Go;
class Zo extends dt {
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
            (this.tabbableElements = Qo(this)),
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
        t.length && (this.tabbableElements = Qo(this));
    }
    isDialogHidden() {
        return "boolean" != typeof this.hidden;
    }
    shouldDialogTrapFocus() {
        return "boolean" == typeof this.trapFocus;
    }
}
Pt([et({ mode: "boolean" })], Zo.prototype, "modal", void 0),
    Pt([et({ mode: "boolean" })], Zo.prototype, "hidden", void 0),
    Pt(
        [et({ attribute: "trap-focus", mode: "boolean" })],
        Zo.prototype,
        "trapFocus",
        void 0
    ),
    Pt([et({ attribute: "aria-describedby" })], Zo.prototype, "ariaDescribedby", void 0),
    Pt([et({ attribute: "aria-labelledby" })], Zo.prototype, "ariaLabelledby", void 0),
    Pt([et({ attribute: "aria-label" })], Zo.prototype, "ariaLabel", void 0);
const Jo = Q`<template role=${t => t.role}></template>`;
var ti, ei;
!(function (t) {
    (t.separator = "separator"), (t.presentation = "presentation");
})(ti || (ti = {}));
class oi extends dt {
    constructor() {
        super(...arguments), (this.role = ti.separator);
    }
}
Pt([et], oi.prototype, "role", void 0),
    (function (t) {
        (t.next = "next"), (t.previous = "previous");
    })(ei || (ei = {}));
class ii extends dt {
    constructor() {
        super(...arguments), (this.hiddenFromAT = !0), (this.direction = ei.next);
    }
}
Pt([et({ mode: "boolean" })], ii.prototype, "disabled", void 0),
    Pt(
        [et({ attribute: "aria-hidden", mode: "fromView", converter: Z })],
        ii.prototype,
        "hiddenFromAT",
        void 0
    ),
    Pt([et], ii.prototype, "direction", void 0);
const ri = Q`
    <template
        role="button"
        aria-disabled="${t => !!t.disabled || void 0}"
        tabindex="${t => (t.hiddenFromAT ? -1 : 0)}"
        class="${t => t.direction} ${t => (t.disabled ? "disabled" : "")}"
    >
        ${$t(
            t => t.direction === ei.next,
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
        ${$t(
            t => t.direction === ei.previous,
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
`,
    ni = Q`
    <template
        role="menu"
        @keydown=${(t, e) => t.handleMenuKeyDown(e.event)}
        @focusout=${(t, e) => t.handleFocusOut(e.event)}
    >
        <slot ${Dt("items")}></slot>
    </template>
`;
var si;
!(function (t) {
    (t.menuitem = "menuitem"),
        (t.menuitemcheckbox = "menuitemcheckbox"),
        (t.menuitemradio = "menuitemradio");
})(si || (si = {}));
class ai extends dt {
    constructor() {
        super(...arguments),
            (this.expanded = !1),
            (this.role = si.menuitem),
            (this.handleMenuItemKeyDown = t => (this.change(), !0)),
            (this.handleMenuItemClick = t => {
                this.change();
            }),
            (this.change = () => {
                this.$emit("change");
            });
    }
}
Pt([et({ mode: "boolean" })], ai.prototype, "disabled", void 0),
    Pt(
        [et({ attribute: "aria-expanded", mode: "reflect", converter: Z })],
        ai.prototype,
        "expanded",
        void 0
    ),
    Pt([et], ai.prototype, "role", void 0),
    Pt([et], ai.prototype, "checked", void 0),
    po(ai, co);
const li = Q`
    <template
        role=${t => t.role}
        aria-checked=${t => (t.role !== si.menuitem ? t.checked : void 0)}
        aria-disabled=${t => t.disabled}
        @keydown=${(t, e) => t.handleMenuItemKeyDown(e.event)}
        @click=${(t, e) => t.handleMenuItemClick(e.event)}
        class="${t => (t.disabled ? "disabled" : "")} ${t =>
    t.expanded ? "expanded" : ""}"
    >
        ${uo}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${ho}
    </template>
`;
class ci extends dt {
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
                (function (...t) {
                    return t.every(t => t instanceof HTMLElement);
                })(t) && ci.focusableElementRoles.hasOwnProperty(t.getAttribute("role"))),
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
        for (; Ze(t, o.length); ) {
            const i = o[t];
            if (this.isFocusableElement(i)) {
                i.setAttribute("tabindex", "0"),
                    i.focus(),
                    o[this.focusIndex].setAttribute("tabindex", ""),
                    (this.focusIndex = t);
                break;
            }
            t += e;
        }
    }
}
(ci.focusableElementRoles = io(si)), Pt([k], ci.prototype, "items", void 0);
class di extends dt {}
Pt([et({ converter: J })], di.prototype, "value", void 0),
    Pt([et({ converter: J })], di.prototype, "min", void 0),
    Pt([et({ converter: J })], di.prototype, "max", void 0),
    Pt([et({ mode: "boolean" })], di.prototype, "paused", void 0);
const hi = Q`
    <template
        role="progressbar"
        aria-valuenow="${t => t.value}"
        aria-valuemin="${t => t.min}"
        aria-valuemax="${t => t.max}"
        class="${t => (t.paused ? "paused" : "")}"
    >
        ${$t(
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
        ${$t(
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
    ui = Q`
    <template
        role="progressbar"
        aria-valuenow="${t => t.value}"
        aria-valuemin="${t => t.min}"
        aria-valuemax="${t => t.max}"
        class="${t => (t.paused ? "paused" : "")}"
    >
        ${$t(
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
        ${$t(
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
    pi = Q`
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
            <slot ${Dt("defaultSlottedNodes")}></slot>
        </label>
    </template>
`;
class fi extends Co {
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
Pt([et({ attribute: "readonly", mode: "boolean" })], fi.prototype, "readOnly", void 0),
    Pt([et], fi.prototype, "name", void 0),
    Pt(
        [et({ attribute: "checked", mode: "boolean" })],
        fi.prototype,
        "checkedAttribute",
        void 0
    ),
    Pt([k], fi.prototype, "defaultSlottedNodes", void 0),
    Pt([k], fi.prototype, "defaultChecked", void 0),
    Pt([k], fi.prototype, "checked", void 0);
const vi = Q`
    <template
        role="radiogroup"
        aria-disabled="${t => t.disabled}"
        aria-readonly="${t => t.readOnly}"
    >
        <slot name="label"></slot>
        <div
            class="positioning-region ${t =>
                t.orientation === Et.horizontal ? "horizontal" : "vertical"}"
            part="positioning-region"
        >
            <slot ${Dt("slottedRadioButtons")}> </slot>
        </div>
    </template>
`;
class bi extends dt {
    constructor() {
        super(),
            (this.orientation = Et.horizontal),
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
                switch ((9 !== t.keyCode && t.preventDefault(), t.keyCode)) {
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
Pt([et({ attribute: "readonly", mode: "boolean" })], bi.prototype, "readOnly", void 0),
    Pt(
        [et({ attribute: "disabled", mode: "boolean" })],
        bi.prototype,
        "disabled",
        void 0
    ),
    Pt([et], bi.prototype, "name", void 0),
    Pt([et], bi.prototype, "value", void 0),
    Pt([et], bi.prototype, "orientation", void 0),
    Pt([k], bi.prototype, "slottedRadioButtons", void 0);
const gi = Q`
    <template
        role="slider"
        class="${t => (t.readOnly ? "readonly" : "")} 
        ${t => t.orientation || Et.horizontal}"
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
function mi(t, e, o, i) {
    let r = ((n = 0), (s = 1), (a = (t - e) / (o - e)), Math.min(Math.max(a, n), s));
    var n, s, a;
    return i === so.rtl && (r = 1 - r), r;
}
var yi;
!(function (t) {
    t.singleValue = "single-value";
})(yi || (yi = {}));
class xi extends Co {
    constructor() {
        super(),
            (this.direction = so.ltr),
            (this.isDragging = !1),
            (this.trackWidth = 0),
            (this.trackMinWidth = 0),
            (this.trackHeight = 0),
            (this.trackMinHeight = 0),
            (this.min = 0),
            (this.max = 10),
            (this.step = 1),
            (this.orientation = Et.horizontal),
            (this.mode = yi.singleValue),
            (this.proxy = document.createElement("input")),
            (this.increment = () => {
                const t =
                        this.direction !== so.rtl && this.orientation !== Et.vertical
                            ? Number(this.value) + Number(this.step)
                            : Number(this.value) - Number(this.step),
                    e = this.convertToConstrainedValue(t),
                    o = e < Number(this.max) ? "" + e : "" + this.max;
                (this.value = o), this.updateForm();
            }),
            (this.decrement = () => {
                const t =
                        this.direction !== so.rtl && this.orientation !== Et.vertical
                            ? Number(this.value) - Number(this.step)
                            : Number(this.value) + Number(this.step),
                    e = this.convertToConstrainedValue(t),
                    o = e > Number(this.min) ? "" + e : "" + this.min;
                (this.value = o), this.updateForm();
            }),
            (this.keypressHandler = t => {
                if (
                    (super.keypressHandler(t),
                    9 !== t.keyCode && t.preventDefault(),
                    36 === t.keyCode)
                )
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
                    (1 - mi(Number(this.value), Number(this.min), Number(this.max), t));
                this.orientation === Et.horizontal
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
                    t && "rtl" === t.dir && this.setThumbPositionForOrientation(so.rtl),
                    null !== t && "rtl" === t.dir ? so.rtl : so.ltr
                );
            }),
            (this.setupTrackConstraints = () => {
                (this.trackWidth = this.track.clientWidth),
                    (this.trackMinWidth = this.track.clientLeft);
                const t = this.track.getBoundingClientRect();
                (this.trackHeight = t.bottom), (this.trackMinHeight = t.top);
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
                    this.orientation === Et.horizontal
                        ? t.pageX - this.getBoundingClientRect().left
                        : t.pageY;
                (this.value = "" + this.calculateNewValue(e)), this.updateForm();
            }),
            (this.calculateNewValue = t => {
                const e = mi(
                        t,
                        this.orientation === Et.horizontal
                            ? this.trackMinWidth
                            : this.trackMinHeight,
                        this.orientation === Et.horizontal
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
                if ((t.preventDefault(), !this.disabled && !this.readOnly)) {
                    (this.trackWidth = this.track.clientWidth),
                        0 === this.trackWidth && (this.trackWidth = 1),
                        t.target.focus(),
                        window.addEventListener("mouseup", this.handleWindowMouseUp),
                        window.addEventListener("mousemove", this.handleMouseMove);
                    const e =
                        this.orientation === Et.horizontal
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
            this.setupDefaultValue(),
            this.setThumbPositionForOrientation(this.direction);
    }
    disconnectedCallback() {
        this.removeEventListener("keydown", this.keypressHandler),
            this.removeEventListener("mousedown", this.clickHandler),
            this.thumb.removeEventListener("mousedown", this.handleThumbMouseDown);
    }
}
Pt([et({ attribute: "readonly", mode: "boolean" })], xi.prototype, "readOnly", void 0),
    Pt([k], xi.prototype, "direction", void 0),
    Pt([k], xi.prototype, "isDragging", void 0),
    Pt([k], xi.prototype, "position", void 0),
    Pt([k], xi.prototype, "trackWidth", void 0),
    Pt([k], xi.prototype, "trackMinWidth", void 0),
    Pt([k], xi.prototype, "trackHeight", void 0),
    Pt([k], xi.prototype, "trackMinHeight", void 0),
    Pt([et({ converter: J })], xi.prototype, "min", void 0),
    Pt([et({ converter: J })], xi.prototype, "max", void 0),
    Pt([et({ converter: J })], xi.prototype, "step", void 0),
    Pt([et], xi.prototype, "orientation", void 0),
    Pt([et], xi.prototype, "mode", void 0);
const ki = Q`
    <template
        aria-disabled="${t => t.disabled}"
        class="${t => t.sliderOrientation || Et.horizontal} 
            ${t => (t.disabled ? "disabled" : "")}"
    >
        <div ${Ct("root")} part="root" class="root" style=${t => t.positionStyle}>
            <div class="container">
                ${$t(t => !t.hideMark, Q` <div class="mark"></div> `)}
                <div class="label">
                    <slot> </slot>
                </div>
            </div>
        </div>
    </template>
`,
    wi = { min: 0, max: 0, direction: so.ltr, orientation: Et.horizontal, disabled: !1 };
class Ci extends dt {
    constructor() {
        super(...arguments),
            (this.hideMark = !1),
            (this.sliderDirection = so.ltr),
            (this.getSliderConfiguration = () => {
                if (this.isSliderConfig(this.parentNode)) {
                    const t = this.parentNode,
                        { min: e, max: o, direction: i, orientation: r, disabled: n } = t;
                    void 0 !== n && (this.disabled = n),
                        (this.sliderDirection = i || so.ltr),
                        (this.sliderOrientation = r || Et.horizontal),
                        (this.sliderMaxPosition = o),
                        (this.sliderMinPosition = e);
                } else
                    (this.sliderDirection = wi.direction || so.ltr),
                        (this.sliderOrientation = wi.orientation || Et.horizontal),
                        (this.sliderMaxPosition = wi.max),
                        (this.sliderMinPosition = wi.min);
            }),
            (this.positionAsStyle = () => {
                const t = this.sliderDirection ? this.sliderDirection : so.ltr,
                    e = mi(
                        Number(this.position),
                        Number(this.sliderMinPosition),
                        Number(this.sliderMaxPosition)
                    );
                let o = Math.round(100 * (1 - e)),
                    i = Math.round(100 * e);
                return (
                    i === Number.NaN && o === Number.NaN && ((o = 50), (i = 50)),
                    this.sliderOrientation === Et.horizontal
                        ? t === so.rtl
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
            (this.notifier = m.getNotifier(this.parentNode)),
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
Pt([k], Ci.prototype, "positionStyle", void 0),
    Pt([et], Ci.prototype, "position", void 0),
    Pt(
        [et({ attribute: "hide-mark", mode: "boolean" })],
        Ci.prototype,
        "hideMark",
        void 0
    ),
    Pt(
        [et({ attribute: "disabled", mode: "boolean" })],
        Ci.prototype,
        "disabled",
        void 0
    ),
    Pt([k], Ci.prototype, "sliderOrientation", void 0),
    Pt([k], Ci.prototype, "sliderMinPosition", void 0),
    Pt([k], Ci.prototype, "sliderMaxPosition", void 0),
    Pt([k], Ci.prototype, "sliderDirection", void 0);
const $i = Q`
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
            <slot ${Dt("defaultSlottedNodes")}></slot>
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
class Fi extends Co {
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
Pt([et({ attribute: "readonly", mode: "boolean" })], Fi.prototype, "readOnly", void 0),
    Pt([et], Fi.prototype, "value", void 0),
    Pt(
        [et({ attribute: "checked", mode: "boolean" })],
        Fi.prototype,
        "checkedAttribute",
        void 0
    ),
    Pt([k], Fi.prototype, "defaultSlottedNodes", void 0),
    Pt([k], Fi.prototype, "defaultChecked", void 0),
    Pt([k], Fi.prototype, "checked", void 0);
const Di = Q`
    <template role="tabs" class="${t => t.orientation}">
        ${uo}
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${Dt("tabs")}></slot>

            ${$t(
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
        ${ho}
        <div class="tabpanel">
            <slot name="tabpanel" part="tabpanel" ${Dt("tabpanels")}></slot>
        </div>
    </template>
`;
var Ti;
!(function (t) {
    (t.vertical = "vertical"), (t.horizontal = "horizontal");
})(Ti || (Ti = {}));
class Pi extends dt {
    constructor() {
        super(),
            (this.orientation = Ti.horizontal),
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
        return this.orientation === Ti.horizontal;
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
        (this.prevActiveTabIndex = this.activeTabIndex),
            (this.activeTabIndex = lo(0, this.tabs.length - 1, this.activeTabIndex + t)),
            this.setComponent();
    }
    focusTab() {
        this.tabs[this.activeTabIndex].focus();
    }
}
Pt([et], Pi.prototype, "orientation", void 0),
    Pt([et], Pi.prototype, "activeid", void 0),
    Pt([k], Pi.prototype, "tabs", void 0),
    Pt([k], Pi.prototype, "tabpanels", void 0),
    Pt([et({ mode: "boolean" })], Pi.prototype, "activeindicator", void 0),
    Pt([k], Pi.prototype, "activeIndicatorRef", void 0),
    po(Pi, co);
const Ei = Q`
    <template slot="tab" role="tab">
        <slot></slot>
    </template>
`;
class Ai extends dt {}
const Si = Q`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`;
class Ii extends dt {}
var Hi, Oi;
!(function (t) {
    (t.filled = "filled"), (t.outline = "outline");
})(Hi || (Hi = {})),
    (function (t) {
        (t.none = "none"),
            (t.both = "both"),
            (t.horizontal = "horizontal"),
            (t.vertical = "vertical");
    })(Oi || (Oi = {}));
class Li extends Co {
    constructor() {
        super(...arguments),
            (this.appearance = Hi.outline),
            (this.resize = Oi.none),
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
Pt([et], Li.prototype, "appearance", void 0),
    Pt([et({ mode: "boolean" })], Li.prototype, "readOnly", void 0),
    Pt([et], Li.prototype, "resize", void 0),
    Pt([et({ mode: "boolean" })], Li.prototype, "autofocus", void 0),
    Pt([et({ converter: J, mode: "fromView" })], Li.prototype, "cols", void 0),
    Pt([et({ attribute: "form" })], Li.prototype, "formId", void 0),
    Pt([et], Li.prototype, "list", void 0),
    Pt([et({ converter: J })], Li.prototype, "maxlength", void 0),
    Pt([et({ converter: J })], Li.prototype, "minlength", void 0),
    Pt([et], Li.prototype, "name", void 0),
    Pt([et], Li.prototype, "placeholder", void 0),
    Pt([et({ converter: J, mode: "fromView" })], Li.prototype, "rows", void 0),
    Pt([et({ mode: "boolean" })], Li.prototype, "spellcheck", void 0),
    Pt([k], Li.prototype, "defaultSlottedNodes", void 0);
const Mi = Q`
    <template
        class="
            ${t => t.appearance}
            ${t => (t.readOnly ? "readonly" : "")}
            ${t => (t.resize !== Oi.none ? "resize-" + t.resize : "")}"
    >
        <label part="label" for="control" class="${t =>
            t.defaultSlottedNodes && t.defaultSlottedNodes.length
                ? "label"
                : "label label__hidden"}">
            <slot ${Dt("defaultSlottedNodes")}></slot>
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
    Bi = Q`
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
            <slot ${Dt("defaultSlottedNodes")}></slot>
        </label>
        <div class="root" part="root">
            ${uo}
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
            ${ho}
        </div>
    </template>
`;
var Ri, Ni;
!(function (t) {
    (t.filled = "filled"), (t.outline = "outline");
})(Ri || (Ri = {})),
    (function (t) {
        (t.email = "email"),
            (t.password = "password"),
            (t.tel = "tel"),
            (t.text = "text"),
            (t.url = "url");
    })(Ni || (Ni = {}));
class zi extends Co {
    constructor() {
        super(),
            (this.appearance = Ri.outline),
            (this.type = Ni.text),
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
Pt([et], zi.prototype, "appearance", void 0),
    Pt(
        [et({ attribute: "readonly", mode: "boolean" })],
        zi.prototype,
        "readOnly",
        void 0
    ),
    Pt([et({ mode: "boolean" })], zi.prototype, "autofocus", void 0),
    Pt([et], zi.prototype, "placeholder", void 0),
    Pt([et], zi.prototype, "type", void 0),
    Pt([et], zi.prototype, "list", void 0),
    Pt([et({ converter: J })], zi.prototype, "maxlength", void 0),
    Pt([et({ converter: J })], zi.prototype, "minlength", void 0),
    Pt([et], zi.prototype, "pattern", void 0),
    Pt([et({ converter: J })], zi.prototype, "size", void 0),
    Pt([et({ mode: "boolean" })], zi.prototype, "spellcheck", void 0),
    Pt([k], zi.prototype, "defaultSlottedNodes", void 0),
    po(zi, co);
const ji = {
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
function _i(t, e) {
    return "function" == typeof t ? t(e) : t;
}
function Vi(t) {
    return e => (e && void 0 !== e[t] ? e[t] : ji[t]);
}
const Gi = Vi("backgroundColor"),
    qi = Vi("accentBaseColor"),
    Wi = Vi("neutralPalette"),
    Ui = Vi("accentPalette"),
    Ki = Vi("accentFillHoverDelta"),
    Xi = Vi("accentFillActiveDelta"),
    Yi = Vi("accentFillFocusDelta"),
    Qi = Vi("accentFillSelectedDelta"),
    Zi = Vi("accentForegroundRestDelta"),
    Ji = Vi("accentForegroundHoverDelta"),
    tr = Vi("accentForegroundActiveDelta"),
    er = Vi("accentForegroundFocusDelta"),
    or = Vi("neutralFillRestDelta"),
    ir = Vi("neutralFillHoverDelta"),
    rr = Vi("neutralFillActiveDelta"),
    nr = Vi("neutralFillFocusDelta"),
    sr = Vi("neutralFillSelectedDelta"),
    ar = Vi("neutralFillInputRestDelta"),
    lr = Vi("neutralFillInputHoverDelta"),
    cr = Vi("neutralFillInputActiveDelta"),
    dr = Vi("neutralFillInputFocusDelta"),
    hr = Vi("neutralFillInputSelectedDelta"),
    ur = Vi("neutralFillStealthRestDelta"),
    pr = Vi("neutralFillStealthHoverDelta"),
    fr = Vi("neutralFillStealthActiveDelta"),
    vr = Vi("neutralFillStealthFocusDelta"),
    br = Vi("neutralFillStealthSelectedDelta"),
    gr = Vi("neutralFillToggleHoverDelta"),
    mr = Vi("neutralFillToggleActiveDelta"),
    yr = Vi("neutralFillToggleFocusDelta"),
    xr = Vi("baseLayerLuminance"),
    kr = Vi("neutralFillCardDelta"),
    wr = Vi("neutralForegroundHoverDelta"),
    Cr = Vi("neutralForegroundActiveDelta"),
    $r = Vi("neutralForegroundFocusDelta"),
    Fr = Vi("neutralDividerRestDelta"),
    Dr = Vi("neutralOutlineRestDelta"),
    Tr = Vi("neutralOutlineHoverDelta"),
    Pr = Vi("neutralOutlineActiveDelta"),
    Er = Vi("neutralOutlineFocusDelta");
function Ar(t, e, o) {
    return isNaN(t) || t <= e ? e : t >= o ? o : t;
}
function Sr(t, e, o) {
    return isNaN(t) || t <= e ? 0 : t >= o ? 1 : t / (o - e);
}
function Ir(t, e, o) {
    return isNaN(t) ? e : e + t * (o - e);
}
function Hr(t) {
    return t * (Math.PI / 180);
}
function Or(t, e, o) {
    return isNaN(t) || t <= 0 ? e : t >= 1 ? o : e + t * (o - e);
}
function Lr(t, e, o) {
    if (t <= 0) return e % 360;
    if (t >= 1) return o % 360;
    const i = (e - o + 360) % 360;
    return i <= (o - e + 360) % 360 ? (e - i * t + 360) % 360 : (e + i * t + 360) % 360;
}
function Mr(t, e) {
    const o = Math.pow(10, e);
    return Math.round(t * o) / o;
}
class Br {
    static fromObject(t) {
        return !t || isNaN(t.h) || isNaN(t.s) || isNaN(t.l)
            ? null
            : new Br(t.h, t.s, t.l);
    }
    constructor(t, e, o) {
        (this.h = t), (this.s = e), (this.l = o);
    }
    equalValue(t) {
        return this.h === t.h && this.s === t.s && this.l === t.l;
    }
    roundToPrecision(t) {
        return new Br(Mr(this.h, t), Mr(this.s, t), Mr(this.l, t));
    }
    toObject() {
        return { h: this.h, s: this.s, l: this.l };
    }
}
class Rr {
    static fromObject(t) {
        return !t || isNaN(t.h) || isNaN(t.s) || isNaN(t.v)
            ? null
            : new Rr(t.h, t.s, t.v);
    }
    constructor(t, e, o) {
        (this.h = t), (this.s = e), (this.v = o);
    }
    equalValue(t) {
        return this.h === t.h && this.s === t.s && this.v === t.v;
    }
    roundToPrecision(t) {
        return new Rr(Mr(this.h, t), Mr(this.s, t), Mr(this.v, t));
    }
    toObject() {
        return { h: this.h, s: this.s, v: this.v };
    }
}
class Nr {
    constructor(t, e, o) {
        (this.l = t), (this.a = e), (this.b = o);
    }
    static fromObject(t) {
        return !t || isNaN(t.l) || isNaN(t.a) || isNaN(t.b)
            ? null
            : new Nr(t.l, t.a, t.b);
    }
    equalValue(t) {
        return this.l === t.l && this.a === t.a && this.b === t.b;
    }
    roundToPrecision(t) {
        return new Nr(Mr(this.l, t), Mr(this.a, t), Mr(this.b, t));
    }
    toObject() {
        return { l: this.l, a: this.a, b: this.b };
    }
}
(Nr.epsilon = 216 / 24389), (Nr.kappa = 24389 / 27);
class zr {
    static fromObject(t) {
        return !t || isNaN(t.l) || isNaN(t.c) || isNaN(t.h)
            ? null
            : new zr(t.l, t.c, t.h);
    }
    constructor(t, e, o) {
        (this.l = t), (this.c = e), (this.h = o);
    }
    equalValue(t) {
        return this.l === t.l && this.c === t.c && this.h === t.h;
    }
    roundToPrecision(t) {
        return new zr(Mr(this.l, t), Mr(this.c, t), Mr(this.h, t));
    }
    toObject() {
        return { l: this.l, c: this.c, h: this.h };
    }
}
class jr {
    static fromObject(t) {
        return !t || isNaN(t.r) || isNaN(t.g) || isNaN(t.b)
            ? null
            : new jr(t.r, t.g, t.b, t.a);
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
        return `rgb(${Math.round(Ir(this.r, 0, 255))},${Math.round(
            Ir(this.g, 0, 255)
        )},${Math.round(Ir(this.b, 0, 255))})`;
    }
    toStringWebRGBA() {
        return `rgba(${Math.round(Ir(this.r, 0, 255))},${Math.round(
            Ir(this.g, 0, 255)
        )},${Math.round(Ir(this.b, 0, 255))},${Ar(this.a, 0, 1)})`;
    }
    roundToPrecision(t) {
        return new jr(Mr(this.r, t), Mr(this.g, t), Mr(this.b, t), Mr(this.a, t));
    }
    clamp() {
        return new jr(
            Ar(this.r, 0, 1),
            Ar(this.g, 0, 1),
            Ar(this.b, 0, 1),
            Ar(this.a, 0, 1)
        );
    }
    toObject() {
        return { r: this.r, g: this.g, b: this.b, a: this.a };
    }
    formatHexValue(t) {
        return (function (t) {
            const e = Math.round(Ar(t, 0, 255)).toString(16);
            return 1 === e.length ? "0" + e : e;
        })(Ir(t, 0, 255));
    }
}
class _r {
    constructor(t, e, o) {
        (this.x = t), (this.y = e), (this.z = o);
    }
    static fromObject(t) {
        return !t || isNaN(t.x) || isNaN(t.y) || isNaN(t.z)
            ? null
            : new _r(t.x, t.y, t.z);
    }
    equalValue(t) {
        return this.x === t.x && this.y === t.y && this.z === t.z;
    }
    roundToPrecision(t) {
        return new _r(Mr(this.x, t), Mr(this.y, t), Mr(this.z, t));
    }
    toObject() {
        return { x: this.x, y: this.y, z: this.z };
    }
}
function Vr(t) {
    return 0.2126 * t.r + 0.7152 * t.g + 0.0722 * t.b;
}
function Gr(t) {
    function e(t) {
        return t <= 0.03928 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
    }
    return Vr(new jr(e(t.r), e(t.g), e(t.b), 1));
}
_r.whitePoint = new _r(0.95047, 1, 1.08883);
const qr = (t, e) => (t + 0.05) / (e + 0.05);
function Wr(t, e) {
    const o = Gr(t),
        i = Gr(e);
    return o > i ? qr(o, i) : qr(i, o);
}
function Ur(t) {
    const e = Math.max(t.r, t.g, t.b),
        o = Math.min(t.r, t.g, t.b),
        i = e - o;
    let r = 0;
    0 !== i &&
        (r =
            e === t.r
                ? (((t.g - t.b) / i) % 6) * 60
                : e === t.g
                ? 60 * ((t.b - t.r) / i + 2)
                : 60 * ((t.r - t.g) / i + 4)),
        r < 0 && (r += 360);
    const n = (e + o) / 2;
    let s = 0;
    return 0 !== i && (s = i / (1 - Math.abs(2 * n - 1))), new Br(r, s, n);
}
function Kr(t, e = 1) {
    const o = (1 - Math.abs(2 * t.l - 1)) * t.s,
        i = o * (1 - Math.abs(((t.h / 60) % 2) - 1)),
        r = t.l - o / 2;
    let n = 0,
        s = 0,
        a = 0;
    return (
        t.h < 60
            ? ((n = o), (s = i), (a = 0))
            : t.h < 120
            ? ((n = i), (s = o), (a = 0))
            : t.h < 180
            ? ((n = 0), (s = o), (a = i))
            : t.h < 240
            ? ((n = 0), (s = i), (a = o))
            : t.h < 300
            ? ((n = i), (s = 0), (a = o))
            : t.h < 360 && ((n = o), (s = 0), (a = i)),
        new jr(n + r, s + r, a + r, e)
    );
}
function Xr(t) {
    const e = Math.max(t.r, t.g, t.b),
        o = e - Math.min(t.r, t.g, t.b);
    let i = 0;
    0 !== o &&
        (i =
            e === t.r
                ? (((t.g - t.b) / o) % 6) * 60
                : e === t.g
                ? 60 * ((t.b - t.r) / o + 2)
                : 60 * ((t.r - t.g) / o + 4)),
        i < 0 && (i += 360);
    let r = 0;
    return 0 !== e && (r = o / e), new Rr(i, r, e);
}
function Yr(t) {
    let e = 0;
    (0 === t.b && 0 === t.a) || (e = Math.atan2(t.b, t.a) * (180 / Math.PI)),
        e < 0 && (e += 360);
    const o = Math.sqrt(t.a * t.a + t.b * t.b);
    return new zr(t.l, o, e);
}
function Qr(t) {
    function e(t) {
        return t <= 0.04045 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
    }
    const o = e(t.r),
        i = e(t.g),
        r = e(t.b);
    return new _r(
        0.4124564 * o + 0.3575761 * i + 0.1804375 * r,
        0.2126729 * o + 0.7151522 * i + 0.072175 * r,
        0.0193339 * o + 0.119192 * i + 0.9503041 * r
    );
}
function Zr(t, e = 1) {
    function o(t) {
        return t <= 0.0031308 ? 12.92 * t : 1.055 * Math.pow(t, 1 / 2.4) - 0.055;
    }
    const i = o(3.2404542 * t.x - 1.5371385 * t.y - 0.4985314 * t.z),
        r = o(-0.969266 * t.x + 1.8760108 * t.y + 0.041556 * t.z),
        n = o(0.0556434 * t.x - 0.2040259 * t.y + 1.0572252 * t.z);
    return new jr(i, r, n, e);
}
function Jr(t) {
    return (function (t) {
        function e(t) {
            return t > Nr.epsilon ? Math.pow(t, 1 / 3) : (Nr.kappa * t + 16) / 116;
        }
        const o = e(t.x / _r.whitePoint.x),
            i = e(t.y / _r.whitePoint.y),
            r = e(t.z / _r.whitePoint.z);
        return new Nr(116 * i - 16, 500 * (o - i), 200 * (i - r));
    })(Qr(t));
}
function tn(t, e = 1) {
    return Zr(
        (function (t) {
            const e = (t.l + 16) / 116,
                o = e + t.a / 500,
                i = e - t.b / 200,
                r = Math.pow(o, 3),
                n = Math.pow(e, 3),
                s = Math.pow(i, 3);
            let a = 0;
            a = r > Nr.epsilon ? r : (116 * o - 16) / Nr.kappa;
            let l = 0;
            l = t.l > Nr.epsilon * Nr.kappa ? n : t.l / Nr.kappa;
            let c = 0;
            return (
                (c = s > Nr.epsilon ? s : (116 * i - 16) / Nr.kappa),
                (a = _r.whitePoint.x * a),
                (l = _r.whitePoint.y * l),
                (c = _r.whitePoint.z * c),
                new _r(a, l, c)
            );
        })(t),
        e
    );
}
function en(t) {
    return Yr(Jr(t));
}
function on(t, e = 1) {
    return tn(
        (function (t) {
            let e = 0,
                o = 0;
            return (
                0 !== t.h &&
                    ((e = Math.cos(Hr(t.h)) * t.c), (o = Math.sin(Hr(t.h)) * t.c)),
                new Nr(t.l, e, o)
            );
        })(t),
        e
    );
}
function rn(t, e, o = 18) {
    const i = en(t);
    let r = i.c + e * o;
    return r < 0 && (r = 0), on(new zr(i.l, r, i.h));
}
function nn(t, e) {
    return t * e;
}
function sn(t, e) {
    return new jr(nn(t.r, e.r), nn(t.g, e.g), nn(t.b, e.b), 1);
}
function an(t, e) {
    return Ar(t < 0.5 ? 2 * e * t : 1 - 2 * (1 - e) * (1 - t), 0, 1);
}
function ln(t, e) {
    return new jr(an(t.r, e.r), an(t.g, e.g), an(t.b, e.b), 1);
}
var cn, dn;
function hn(t, e, o, i) {
    if (isNaN(t) || t <= 0) return o;
    if (t >= 1) return i;
    switch (e) {
        case dn.HSL:
            return Kr(
                (function (t, e, o) {
                    return isNaN(t) || t <= 0
                        ? e
                        : t >= 1
                        ? o
                        : new Br(Lr(t, e.h, o.h), Or(t, e.s, o.s), Or(t, e.l, o.l));
                })(t, Ur(o), Ur(i))
            );
        case dn.HSV:
            return (function (t, e = 1) {
                const o = t.s * t.v,
                    i = o * (1 - Math.abs(((t.h / 60) % 2) - 1)),
                    r = t.v - o;
                let n = 0,
                    s = 0,
                    a = 0;
                return (
                    t.h < 60
                        ? ((n = o), (s = i), (a = 0))
                        : t.h < 120
                        ? ((n = i), (s = o), (a = 0))
                        : t.h < 180
                        ? ((n = 0), (s = o), (a = i))
                        : t.h < 240
                        ? ((n = 0), (s = i), (a = o))
                        : t.h < 300
                        ? ((n = i), (s = 0), (a = o))
                        : t.h < 360 && ((n = o), (s = 0), (a = i)),
                    new jr(n + r, s + r, a + r, e)
                );
            })(
                (function (t, e, o) {
                    return isNaN(t) || t <= 0
                        ? e
                        : t >= 1
                        ? o
                        : new Rr(Lr(t, e.h, o.h), Or(t, e.s, o.s), Or(t, e.v, o.v));
                })(t, Xr(o), Xr(i))
            );
        case dn.XYZ:
            return Zr(
                (function (t, e, o) {
                    return isNaN(t) || t <= 0
                        ? e
                        : t >= 1
                        ? o
                        : new _r(Or(t, e.x, o.x), Or(t, e.y, o.y), Or(t, e.z, o.z));
                })(t, Qr(o), Qr(i))
            );
        case dn.LAB:
            return tn(
                (function (t, e, o) {
                    return isNaN(t) || t <= 0
                        ? e
                        : t >= 1
                        ? o
                        : new Nr(Or(t, e.l, o.l), Or(t, e.a, o.a), Or(t, e.b, o.b));
                })(t, Jr(o), Jr(i))
            );
        case dn.LCH:
            return on(
                (function (t, e, o) {
                    return isNaN(t) || t <= 0
                        ? e
                        : t >= 1
                        ? o
                        : new zr(Or(t, e.l, o.l), Or(t, e.c, o.c), Lr(t, e.h, o.h));
                })(t, en(o), en(i))
            );
        default:
            return (function (t, e, o) {
                return isNaN(t) || t <= 0
                    ? e
                    : t >= 1
                    ? o
                    : new jr(
                          Or(t, e.r, o.r),
                          Or(t, e.g, o.g),
                          Or(t, e.b, o.b),
                          Or(t, e.a, o.a)
                      );
            })(t, o, i);
    }
}
!(function (t) {
    (t[(t.Burn = 0)] = "Burn"),
        (t[(t.Color = 1)] = "Color"),
        (t[(t.Darken = 2)] = "Darken"),
        (t[(t.Dodge = 3)] = "Dodge"),
        (t[(t.Lighten = 4)] = "Lighten"),
        (t[(t.Multiply = 5)] = "Multiply"),
        (t[(t.Overlay = 6)] = "Overlay"),
        (t[(t.Screen = 7)] = "Screen");
})(cn || (cn = {})),
    (function (t) {
        (t[(t.RGB = 0)] = "RGB"),
            (t[(t.HSL = 1)] = "HSL"),
            (t[(t.HSV = 2)] = "HSV"),
            (t[(t.XYZ = 3)] = "XYZ"),
            (t[(t.LAB = 4)] = "LAB"),
            (t[(t.LCH = 5)] = "LCH");
    })(dn || (dn = {}));
class un {
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
        return new un(e);
    }
    constructor(t) {
        if (null == t || 0 === t.length)
            throw new Error("The stops argument must be non-empty");
        this.stops = this.sortColorScaleStops(t);
    }
    getColor(t, e = dn.RGB) {
        if (1 === this.stops.length) return this.stops[0].color;
        if (t <= 0) return this.stops[0].color;
        if (t >= 1) return this.stops[this.stops.length - 1].color;
        let o = 0;
        for (let e = 0; e < this.stops.length; e++)
            this.stops[e].position <= t && (o = e);
        let i = o + 1;
        return (
            i >= this.stops.length && (i = this.stops.length - 1),
            hn(
                (t - this.stops[o].position) *
                    (1 / (this.stops[i].position - this.stops[o].position)),
                e,
                this.stops[o].color,
                this.stops[i].color
            )
        );
    }
    trim(t, e, o = dn.RGB) {
        if (t < 0 || e > 1 || e < t) throw new Error("Invalid bounds");
        if (t === e) return new un([{ color: this.getColor(t, o), position: 0 }]);
        const i = [];
        for (let o = 0; o < this.stops.length; o++)
            this.stops[o].position >= t &&
                this.stops[o].position <= e &&
                i.push(this.stops[o]);
        if (0 === i.length)
            return new un([
                { color: this.getColor(t), position: t },
                { color: this.getColor(e), position: e },
            ]);
        i[0].position !== t && i.unshift({ color: this.getColor(t), position: t }),
            i[i.length - 1].position !== e &&
                i.push({ color: this.getColor(e), position: e });
        const r = e - t,
            n = new Array(i.length);
        for (let e = 0; e < i.length; e++)
            n[e] = { color: i[e].color, position: (i[e].position - t) / r };
        return new un(n);
    }
    findNextColor(t, e, o = !1, i = dn.RGB, r = 0.005, n = 32) {
        isNaN(t) || t <= 0 ? (t = 0) : t >= 1 && (t = 1);
        const s = this.getColor(t, i),
            a = o ? 0 : 1;
        if (Wr(s, this.getColor(a, i)) <= e) return a;
        let l = o ? 0 : t,
            c = o ? t : 0,
            d = a,
            h = 0;
        for (; h <= n; ) {
            d = Math.abs(c - l) / 2 + l;
            const t = Wr(s, this.getColor(d, i));
            if (Math.abs(t - e) <= r) return d;
            t > e ? (o ? (l = d) : (c = d)) : o ? (c = d) : (l = d), h++;
        }
        return d;
    }
    clone() {
        const t = new Array(this.stops.length);
        for (let e = 0; e < t.length; e++)
            t[e] = { color: this.stops[e].color, position: this.stops[e].position };
        return new un(t);
    }
    sortColorScaleStops(t) {
        return t.sort((t, e) => {
            const o = t.position,
                i = e.position;
            return o < i ? -1 : o > i ? 1 : 0;
        });
    }
}
const pn = /^rgb\(\s*((?:(?:25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*,\s*){2}(?:25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*)\)$/i,
    fn = /^#((?:[0-9a-f]{6}|[0-9a-f]{3}))$/i;
function vn(t) {
    const e = fn.exec(t);
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
        : new jr(
              Sr((16711680 & i) >>> 16, 0, 255),
              Sr((65280 & i) >>> 8, 0, 255),
              Sr(255 & i, 0, 255),
              1
          );
}
class bn {
    constructor(t) {
        (this.config = Object.assign({}, bn.defaultPaletteConfig, t)),
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
        const t = Ur(this.config.baseColor),
            e = new un([
                { position: 0, color: this.config.scaleColorLight },
                { position: 0.5, color: this.config.baseColor },
                { position: 1, color: this.config.scaleColorDark },
            ]).trim(this.config.clipLight, 1 - this.config.clipDark);
        let o = e.getColor(0),
            i = e.getColor(1);
        if (
            (t.s >= this.config.saturationAdjustmentCutoff &&
                ((o = rn(o, this.config.saturationLight)),
                (i = rn(i, this.config.saturationDark))),
            0 !== this.config.multiplyLight)
        ) {
            const t = sn(this.config.baseColor, o);
            o = hn(this.config.multiplyLight, this.config.interpolationMode, o, t);
        }
        if (0 !== this.config.multiplyDark) {
            const t = sn(this.config.baseColor, i);
            i = hn(this.config.multiplyDark, this.config.interpolationMode, i, t);
        }
        if (0 !== this.config.overlayLight) {
            const t = ln(this.config.baseColor, o);
            o = hn(this.config.overlayLight, this.config.interpolationMode, o, t);
        }
        if (0 !== this.config.overlayDark) {
            const t = ln(this.config.baseColor, i);
            i = hn(this.config.overlayDark, this.config.interpolationMode, i, t);
        }
        return this.config.baseScalePosition
            ? this.config.baseScalePosition <= 0
                ? new un([
                      { position: 0, color: this.config.baseColor },
                      { position: 1, color: i.clamp() },
                  ])
                : this.config.baseScalePosition >= 1
                ? new un([
                      { position: 0, color: o.clamp() },
                      { position: 1, color: this.config.baseColor },
                  ])
                : new un([
                      { position: 0, color: o.clamp() },
                      {
                          position: this.config.baseScalePosition,
                          color: this.config.baseColor,
                      },
                      { position: 1, color: i.clamp() },
                  ])
            : new un([
                  { position: 0, color: o.clamp() },
                  { position: 0.5, color: this.config.baseColor },
                  { position: 1, color: i.clamp() },
              ]);
    }
}
(bn.defaultPaletteConfig = {
    baseColor: vn("#808080"),
    steps: 11,
    interpolationMode: dn.RGB,
    scaleColorLight: new jr(1, 1, 1, 1),
    scaleColorDark: new jr(0, 0, 0, 1),
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
    (bn.greyscalePaletteConfig = {
        baseColor: vn("#808080"),
        steps: 11,
        interpolationMode: dn.RGB,
        scaleColorLight: new jr(1, 1, 1, 1),
        scaleColorDark: new jr(0, 0, 0, 1),
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
bn.defaultPaletteConfig.scaleColorLight, bn.defaultPaletteConfig.scaleColorDark;
class gn {
    constructor(t) {
        (this.palette = []),
            (this.config = Object.assign({}, gn.defaultPaletteConfig, t)),
            this.regenPalettes();
    }
    regenPalettes() {
        let t = this.config.steps;
        (isNaN(t) || t < 3) && (t = 3);
        const e = new jr(0.14, 0.14, 0.14, 1),
            o = new bn(
                Object.assign({}, bn.greyscalePaletteConfig, {
                    baseColor: e,
                    baseScalePosition: 86 / 94,
                    steps: t,
                })
            ).palette,
            i = (Vr(this.config.baseColor) + Ur(this.config.baseColor).l) / 2,
            r = this.matchRelativeLuminanceIndex(i, o) / (t - 1),
            n = this.matchRelativeLuminanceIndex(0.14, o) / (t - 1),
            s = Ur(this.config.baseColor),
            a = Kr(Br.fromObject({ h: s.h, s: s.s, l: 0.14 })),
            l = Kr(Br.fromObject({ h: s.h, s: s.s, l: 0.06 })),
            c = new Array(5);
        (c[0] = { position: 0, color: new jr(1, 1, 1, 1) }),
            (c[1] = { position: r, color: this.config.baseColor }),
            (c[2] = { position: n, color: a }),
            (c[3] = { position: 0.99, color: l }),
            (c[4] = { position: 1, color: new jr(0, 0, 0, 1) });
        const d = new un(c);
        this.palette = new Array(t);
        for (let e = 0; e < t; e++) {
            const o = d.getColor(e / (t - 1), dn.RGB);
            this.palette[e] = o;
        }
    }
    matchRelativeLuminanceIndex(t, e) {
        let o = Number.MAX_VALUE,
            i = 0,
            r = 0;
        const n = e.length;
        for (; r < n; r++) {
            const n = Math.abs(Vr(e[r]) - t);
            n < o && ((o = n), (i = r));
        }
        return i;
    }
}
var mn;
function yn(t) {
    const e = Ue(t);
    return function (t) {
        return "function" == typeof t
            ? o => e(Object.assign({}, o, { backgroundColor: t(o) }))
            : e(t);
    };
}
function xn(t, e) {
    const o = Ue(e);
    return e =>
        "function" == typeof e
            ? i => o(Object.assign({}, i, { backgroundColor: e(i) }))[t]
            : o(e)[t];
}
(gn.defaultPaletteConfig = { baseColor: vn("#808080"), steps: 94 }),
    (function (t) {
        (t.rest = "rest"),
            (t.hover = "hover"),
            (t.active = "active"),
            (t.focus = "focus"),
            (t.selected = "selected");
    })(mn || (mn = {}));
const kn = Ue(t => {
    let e = vn(t);
    if (null !== e) return e;
    if (
        ((e = (function (t) {
            const e = pn.exec(t);
            if (null === e) return null;
            const o = e[1].split(",");
            return new jr(
                Sr(Number(o[0]), 0, 255),
                Sr(Number(o[1]), 0, 255),
                Sr(Number(o[2]), 0, 255),
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
function wn(t) {
    return (
        (e = t),
        fn.test(e) ||
            (function (t) {
                return pn.test(t);
            })(t)
    );
    var e;
}
const Cn = Ue(
    (t, e) => Wr(kn(t), kn(e)),
    (t, e) => t + e
);
function $n(t) {
    return Gr(kn(t));
}
function Fn(...t) {
    return e =>
        Math.max.apply(
            null,
            t.map(t => t(e))
        );
}
const Dn = (t, e, o) => Math.min(Math.max(t, e), o);
var Tn;
function Pn(t) {
    return e => {
        switch (t) {
            case Tn.accent:
                return Ui(e);
            case Tn.neutral:
            default:
                return Wi(e);
        }
    };
}
function En(t, e) {
    return o => {
        if (!wn(e)) return -1;
        const i = _i(t, o),
            r = i.indexOf(e);
        return -1 !== r
            ? r
            : i.findIndex(t => {
                  return wn(t) && ((o = t), kn(e).equalValue(kn(o)));
                  var o;
              });
    };
}
function An(t, e) {
    return o => {
        const i = _i(t, o),
            r = _i(e, o),
            n = En(i, r)(o);
        let s;
        if (-1 !== n) return n;
        try {
            s = $n(r);
        } catch (t) {
            s = -1;
        }
        return -1 === s
            ? 0
            : i
                  .map((t, e) => ({ luminance: $n(t), index: e }))
                  .reduce((t, e) =>
                      Math.abs(e.luminance - s) < Math.abs(t.luminance - s) ? e : t
                  ).index;
    };
}
function Sn(t) {
    return $n(Gi(t)) <= (-0.1 + Math.sqrt(0.21)) / 2;
}
function In(t, e) {
    return "function" == typeof t
        ? o => e(o)[Dn(t(o), 0, e(o).length - 1)]
        : e[Dn(t, 0, e.length - 1)];
}
function Hn(t) {
    return (e, o) => i => In(Sn(i) ? _i(o, i) : _i(e, i), t(i));
}
function On(t) {
    return e => o => i => r => n => {
        const s = _i(t, n),
            a = _i(e, n),
            l = a.length,
            c = Dn(o(s, a, n), 0, l - 1),
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
                function (t) {
                    return r(Cn(s, t));
                },
                p,
                u
            )
        );
    };
}
function Ln(t, e, o) {
    return An(e, t)(o);
}
function Mn(t) {
    return An(Wi, Gi(t))(t);
}
function Bn(t, e, o, i, r, n) {
    return s => {
        const a = _i(t, s),
            l = Sn(s) ? -1 : 1,
            c = On(Gi)(a)(Ln)(() => l)(((d = _i(e, s)), t => t >= d))(s);
        var d;
        const h = En(t, c)(s),
            u = _i(o, s),
            p = _i(i, s),
            f = _i(r, s),
            v = _i(n, s);
        return (function (t, e, o, i, r, n, s) {
            const a = t + o * Math.abs(i - r),
                l = 1 === o ? i < r : o * i > o * r,
                c = l ? t : a,
                d = l ? a : t,
                h = c + o * n,
                u = c + o * s;
            return { rest: In(c, e), hover: In(d, e), active: In(h, e), focus: In(u, e) };
        })(h, a, l, u, p, f, v);
    };
}
!(function (t) {
    (t.neutral = "neutral"), (t.accent = "accent");
})(Tn || (Tn = {}));
const Rn = yn(Bn(Wi, 14, 0, wr, Cr, $r)),
    Nn = xn(mn.rest, Rn),
    zn = xn(mn.hover, Rn),
    jn = xn(mn.active, Rn),
    _n = (xn(mn.focus, Rn), yn(Bn(Wi, 4.5, 0, gr, mr, yr))),
    Vn = xn(mn.rest, _n),
    Gn = xn(mn.hover, _n),
    qn = xn(mn.active, _n),
    Wn = (xn(mn.focus, _n), (t, e) => (Cn("#FFFFFF", t) >= e ? "#FFFFFF" : "#000000"));
function Un(t) {
    return function (e) {
        return "function" == typeof e ? o => Wn(e(o), t) : Wn(Vn(e), t);
    };
}
const Kn = Un(4.5),
    Xn = Un(3),
    Yn = (t, e) => (Cn("#FFFFFF", t) >= e ? "#FFFFFF" : "#000000");
function Qn(t) {
    return function (e) {
        return "function" == typeof e ? o => Yn(e(o), t) : Yn(qi(e), t);
    };
}
const Zn = Qn(4.5),
    Jn = Qn(3);
function ts(t) {
    return Bn(Wi, t, 0, 0, 0, 0);
}
const es = xn(mn.rest, yn(ts(4.5))),
    os = xn(mn.rest, yn(ts(3)));
function is(t) {
    return e => {
        const o = Ui(e),
            i = qi(e),
            r = An(Ui, i)(e),
            n = { rest: Zi(e), hover: Ji(e), active: tr(e), focus: er(e) },
            s = Sn(e) ? -1 : 1,
            a =
                r +
                (1 === s ? Math.min(n.rest, n.hover) : Math.max(s * n.rest, s * n.hover)),
            l = On(Gi)(Ui)(() => a)(() => s)(e => e >= t)(e),
            c = En(Ui, l)(e),
            d = c + s * Math.abs(n.rest - n.hover),
            h = 1 === s ? n.rest < n.hover : s * n.rest > s * n.hover,
            u = h ? c : d,
            p = h ? d : c,
            f = u + s * n.active,
            v = u + s * n.focus;
        return { rest: In(u, o), hover: In(p, o), active: In(f, o), focus: In(v, o) };
    };
}
const rs = yn(is(4.5)),
    ns = yn(is(3)),
    ss = xn(mn.rest, rs),
    as = xn(mn.hover, rs),
    ls = xn(mn.active, rs),
    cs = (xn(mn.focus, rs), xn(mn.rest, ns)),
    ds = xn(mn.hover, ns),
    hs = xn(mn.active, ns),
    us = (xn(mn.focus, ns), Fn(or, ir, rr, nr));
function ps(t) {
    return e => {
        const o = Mn(e);
        return In(o + (o >= us(e) ? -1 : 1) * t(e), Wi(e));
    };
}
const fs = yn(ps(or)),
    vs = yn(ps(ir)),
    bs = yn(ps(rr)),
    gs = yn(ps(nr)),
    ms = yn(ps(sr)),
    ys = yn(t => ({
        rest: fs(t),
        hover: vs(t),
        active: bs(t),
        focus: gs(t),
        selected: ms(t),
    })),
    xs = Fn(or, ir, rr, nr, ur, pr, fr, vr);
function ks(t) {
    return e => {
        const o = Mn(e);
        return In(o + (o >= xs(e) ? -1 : 1) * t(e), Wi(e));
    };
}
const ws = yn(ks(ur)),
    Cs = yn(ks(pr)),
    $s = yn(ks(fr)),
    Fs = yn(ks(vr)),
    Ds = yn(ks(br)),
    Ts = yn(t => ({
        rest: ws(t),
        hover: Cs(t),
        active: $s(t),
        focus: Fs(t),
        selected: Ds(t),
    }));
function Ps(t) {
    return e => {
        const o = Sn(e) ? -1 : 1;
        return In(Mn(e) - t(e) * o, Wi(e));
    };
}
const Es = yn(Ps(ar)),
    As = yn(Ps(lr)),
    Ss = yn(Ps(cr)),
    Is = yn(Ps(dr)),
    Hs = yn(Ps(hr)),
    Os = yn(t => ({
        rest: Es(t),
        hover: As(t),
        active: Ss(t),
        focus: Is(t),
        selected: Hs(t),
    })),
    Ls = Fn(or, ir, rr);
function Ms(t) {
    return e => {
        const o = Ui(e),
            i = o.length,
            r = qi(e),
            n = Zn(Object.assign({}, e, { backgroundColor: r })),
            s = Ki(e),
            a = Mn(e) >= Ls(e) ? -1 : 1,
            l = i - 1,
            c = An(Ui, r)(e);
        let d = 0;
        for (
            ;
            d < a * s &&
            Ze(c + d + a, 0, i) &&
            Cn(o[c + d + a], n) >= t &&
            Ze(c + d + a + a, 0, l);

        )
            d += a;
        const h = c + d,
            u = h + -1 * a * s,
            p = u + a * Xi(e),
            f = u + a * Yi(e);
        return {
            rest: In(u, o),
            hover: In(h, o),
            active: In(p, o),
            focus: In(f, o),
            selected: In(u + (Sn(e) ? -1 * Qi(e) : Qi(e)), o),
        };
    };
}
const Bs = yn(Ms(4.5)),
    Rs = yn(Ms(3)),
    Ns = xn(mn.rest, Bs),
    zs = xn(mn.hover, Bs),
    js = xn(mn.active, Bs),
    _s = (xn(mn.focus, Bs), xn(mn.selected, Bs)),
    Vs = xn(mn.rest, Rs),
    Gs = xn(mn.hover, Rs),
    qs = xn(mn.active, Rs),
    Ws = (xn(mn.focus, Rs), xn(mn.selected, Rs)),
    Us = t => {
        const e = kr(t),
            o = An(Wi, Gi(t))(t);
        return In(o - (o < e ? -1 * e : e), Wi(t));
    };
function Ks(t) {
    return "function" == typeof t
        ? e => Us(Object.assign({}, e, { backgroundColor: t(e) }))
        : Us(t);
}
const Xs = yn(t => {
        const e = Wi(t),
            o = Mn(t),
            i = Sn(t) ? -1 : 1,
            r = Dr(t),
            n = o + i * r,
            s = n + i * (Tr(t) - r),
            a = n + i * (Pr(t) - r),
            l = n + i * (Er(t) - r);
        return { rest: In(n, e), hover: In(s, e), active: In(a, e), focus: In(l, e) };
    }),
    Ys = xn(mn.rest, Xs),
    Qs = xn(mn.hover, Xs),
    Zs = xn(mn.active, Xs),
    Js =
        (xn(mn.focus, Xs),
        yn(t => {
            const e = Wi(t),
                o = Mn(t),
                i = Fr(t);
            return In(o + (Sn(t) ? -1 : 1) * i, e);
        }));
function ta(t) {
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
const ea = ta((t, e) => t + e),
    oa = ta((t, e) => t - e),
    ia = ta((t, e) => t * e);
function ra(...t) {
    return ea.apply(this, t);
}
function na(...t) {
    return oa.apply(this, t);
}
function sa(...t) {
    return ia.apply(this, t);
}
var aa;
function la(t, e) {
    return o => (-1 === xr(o) ? e(o) : t(o));
}
!(function (t) {
    (t[(t.LightMode = 1)] = "LightMode"), (t[(t.DarkMode = 0.23)] = "DarkMode");
})(aa || (aa = {}));
const ca = An(Wi, t => {
        const e = xr(t);
        return new jr(e, e, e, 1).toStringHexRGB();
    }),
    da = t => Ar(na(ca, kr)(t), 0, Wi(t).length - 1),
    ha = Fn(or, ir, rr),
    ua = Fn(ra(ca, kr), ha),
    pa = t => {
        const e = new jr(0.14, 0.14, 0.14, 1);
        return An(Wi, e.toStringHexRGB())(t);
    },
    fa = yn(la(In(na(da, kr), Wi), Hn(Wi)(0, na(pa, sa(kr, 5))))),
    va = yn(la(In(da, Wi), Hn(Wi)(0, na(pa, sa(kr, 4))))),
    ba = yn(la(In(ra(da, kr), Wi), Hn(Wi)(kr, na(pa, sa(kr, 3))))),
    ga = yn(la(In(ca, Wi), Hn(Wi)(0, na(pa, sa(kr, 3))))),
    ma = ba,
    ya = yn(la(In(ua, Wi), Hn(Wi)(ha, na(pa, sa(kr, 2))))),
    xa = yn(la(In(ra(ua, kr), Wi), Hn(Wi)(ra(ha, kr), na(pa, kr)))),
    ka = yn(la(In(ra(ua, sa(kr, 2)), Wi), Hn(Wi)(ra(ha, sa(kr, 2)), pa)));
function wa(t) {
    return t > 3.5;
}
const Ca = yn(
    On(Gi)(Wi)(function (t, e, o) {
        return An(Wi, t)(o);
    })(function (t, e, o) {
        return Sn(o) ? -1 : 1;
    })(wa)
);
function $a(t, e, o) {
    return Sn(o) ? 1 : -1;
}
function Fa(t) {
    return On(Ca)(Ui)(
        (function (t) {
            return (e, o, i) => o.indexOf(t(i));
        })(t)
    )($a)(wa);
}
function Da(t) {
    return new gn({ baseColor: t }).palette.map(t => t.toStringHexRGB().toUpperCase());
}
const Ta = kt`
    ${Io("block")};
`;
let Pa = class extends Bo {};
var Ea;
t(
    [Ro({ attribute: "background-color", default: ji.backgroundColor })],
    Pa.prototype,
    "backgroundColor",
    void 0
),
    t(
        [
            Ro({
                attribute: "accent-base-color",
                cssCustomProperty: !1,
                default: ji.accentBaseColor,
            }),
        ],
        Pa.prototype,
        "accentBaseColor",
        void 0
    ),
    t(
        [Ro({ attribute: !1, cssCustomProperty: !1, default: ji.neutralPalette })],
        Pa.prototype,
        "neutralPalette",
        void 0
    ),
    t(
        [Ro({ attribute: !1, cssCustomProperty: !1, default: ji.accentPalette })],
        Pa.prototype,
        "accentPalette",
        void 0
    ),
    t([Ro({ default: ji.density, converter: J })], Pa.prototype, "density", void 0),
    t(
        [Ro({ attribute: "design-unit", converter: J, default: ji.designUnit })],
        Pa.prototype,
        "designUnit",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "base-height-multiplier",
                default: ji.baseHeightMultiplier,
                converter: J,
            }),
        ],
        Pa.prototype,
        "baseHeightMultiplier",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "base-horizontal-spacing-multiplier",
                converter: J,
                default: ji.baseHorizontalSpacingMultiplier,
            }),
        ],
        Pa.prototype,
        "baseHorizontalSpacingMultiplier",
        void 0
    ),
    t(
        [Ro({ attribute: "corner-radius", converter: J, default: ji.cornerRadius })],
        Pa.prototype,
        "cornerRadius",
        void 0
    ),
    t(
        [Ro({ attribute: "outline-width", converter: J, default: ji.outlineWidth })],
        Pa.prototype,
        "outlineWidth",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "focus-outline-width",
                converter: J,
                default: ji.focusOutlineWidth,
            }),
        ],
        Pa.prototype,
        "focusOutlineWidth",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "disabled-opacity",
                converter: J,
                default: ji.disabledOpacity,
            }),
        ],
        Pa.prototype,
        "disabledOpacity",
        void 0
    ),
    t(
        [Ro({ attribute: "type-ramp-minus-2-font-size", default: "10px" })],
        Pa.prototype,
        "typeRampMinus2FontSize",
        void 0
    ),
    t(
        [Ro({ attribute: "type-ramp-minus-2-line-height", default: "16px" })],
        Pa.prototype,
        "typeRampMinus2LineHeight",
        void 0
    ),
    t(
        [Ro({ attribute: "type-ramp-minus-1-font-size", default: "12px" })],
        Pa.prototype,
        "typeRampMinus1FontSize",
        void 0
    ),
    t(
        [Ro({ attribute: "type-ramp-minus-1-line-height", default: "16px" })],
        Pa.prototype,
        "typeRampMinus1LineHeight",
        void 0
    ),
    t(
        [Ro({ attribute: "type-ramp-base-font-size", default: "14px" })],
        Pa.prototype,
        "typeRampBaseFontSize",
        void 0
    ),
    t(
        [Ro({ attribute: "type-ramp-base-line-height", default: "20px" })],
        Pa.prototype,
        "typeRampBaseLineHeight",
        void 0
    ),
    t(
        [Ro({ attribute: "type-ramp-plus-1-font-size", default: "16px" })],
        Pa.prototype,
        "typeRampPlus1FontSize",
        void 0
    ),
    t(
        [Ro({ attribute: "type-ramp-plus-1-line-height", default: "24px" })],
        Pa.prototype,
        "typeRampPlus1LineHeight",
        void 0
    ),
    t(
        [Ro({ attribute: "type-ramp-plus-2-font-size", default: "20px" })],
        Pa.prototype,
        "typeRampPlus2FontSize",
        void 0
    ),
    t(
        [Ro({ attribute: "type-ramp-plus-2-line-height", default: "28px" })],
        Pa.prototype,
        "typeRampPlus2LineHeight",
        void 0
    ),
    t(
        [Ro({ attribute: "type-ramp-plus-3-font-size", default: "28px" })],
        Pa.prototype,
        "typeRampPlus3FontSize",
        void 0
    ),
    t(
        [Ro({ attribute: "type-ramp-plus-3-line-height", default: "36px" })],
        Pa.prototype,
        "typeRampPlus3LineHeight",
        void 0
    ),
    t(
        [Ro({ attribute: "type-ramp-plus-4-font-size", default: "34px" })],
        Pa.prototype,
        "typeRampPlus4FontSize",
        void 0
    ),
    t(
        [Ro({ attribute: "type-ramp-plus-4-line-height", default: "44px" })],
        Pa.prototype,
        "typeRampPlus4LineHeight",
        void 0
    ),
    t(
        [Ro({ attribute: "type-ramp-plus-5-font-size", default: "46px" })],
        Pa.prototype,
        "typeRampPlus5FontSize",
        void 0
    ),
    t(
        [Ro({ attribute: "type-ramp-plus-5-line-height", default: "56px" })],
        Pa.prototype,
        "typeRampPlus5LineHeight",
        void 0
    ),
    t(
        [Ro({ attribute: "type-ramp-plus-6-font-size", default: "60px" })],
        Pa.prototype,
        "typeRampPlus6FontSize",
        void 0
    ),
    t(
        [Ro({ attribute: "type-ramp-plus-6-line-height", default: "72px" })],
        Pa.prototype,
        "typeRampPlus6LineHeight",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "accent-fill-rest-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.accentFillRestDelta,
            }),
        ],
        Pa.prototype,
        "accentFillRestDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "accent-fill-hover-delta",
                cssCustomProperty: !1,
                converter: J,
                default: ji.accentFillHoverDelta,
            }),
        ],
        Pa.prototype,
        "accentFillHoverDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "accent-fill-active-delta",
                cssCustomProperty: !1,
                converter: J,
                default: ji.accentFillActiveDelta,
            }),
        ],
        Pa.prototype,
        "accentFillActiveDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "accent-fill-focus-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.accentFillFocusDelta,
            }),
        ],
        Pa.prototype,
        "accentFillFocusDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "accent-fill-selected-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.accentFillSelectedDelta,
            }),
        ],
        Pa.prototype,
        "accentFillSelectedDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "accent-foreground-rest-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.accentForegroundRestDelta,
            }),
        ],
        Pa.prototype,
        "accentForegroundRestDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "accent-foreground-hover-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.accentForegroundHoverDelta,
            }),
        ],
        Pa.prototype,
        "accentForegroundHoverDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "accent-foreground-active-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.accentForegroundActiveDelta,
            }),
        ],
        Pa.prototype,
        "accentForegroundActiveDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "accent-foreground-focus-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.accentForegroundFocusDelta,
            }),
        ],
        Pa.prototype,
        "accentForegroundFocusDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-rest-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillRestDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillRestDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-hover-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillHoverDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillHoverDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-active-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillActiveDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillActiveDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-focus-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillFocusDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillFocusDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-selected-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillSelectedDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillSelectedDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-input-rest-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillInputRestDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillInputRestDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-input-hover-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillInputHoverDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillInputHoverDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-input-active-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillInputActiveDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillInputActiveDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-input-focus-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillInputFocusDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillInputFocusDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-input-selected-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillInputSelectedDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillInputSelectedDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-stealth-rest-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillStealthRestDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillStealthRestDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-stealth-hover-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillStealthHoverDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillStealthHoverDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-stealth-active-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillStealthActiveDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillStealthActiveDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-stealth-focus-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillStealthFocusDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillStealthFocusDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-stealth-selected-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillStealthSelectedDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillStealthSelectedDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-toggle-hover-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillToggleHoverDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillToggleHoverDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-toggle-hover-active",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillToggleActiveDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillToggleActiveDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-toggle-hover-focus",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillToggleFocusDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillToggleFocusDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "base-layer-luminance",
                converter: J,
                cssCustomProperty: !1,
                default: ji.baseLayerLuminance,
            }),
        ],
        Pa.prototype,
        "baseLayerLuminance",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-fill-card-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralFillCardDelta,
            }),
        ],
        Pa.prototype,
        "neutralFillCardDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-foreground-hover-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralForegroundHoverDelta,
            }),
        ],
        Pa.prototype,
        "neutralForegroundHoverDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-foreground-active-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralForegroundActiveDelta,
            }),
        ],
        Pa.prototype,
        "neutralForegroundActiveDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-foreground-focus-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralForegroundFocusDelta,
            }),
        ],
        Pa.prototype,
        "neutralForegroundFocusDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-divider-rest-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralDividerRestDelta,
            }),
        ],
        Pa.prototype,
        "neutralDividerRestDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-outline-rest-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralOutlineRestDelta,
            }),
        ],
        Pa.prototype,
        "neutralOutlineRestDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-outline-hover-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralOutlineHoverDelta,
            }),
        ],
        Pa.prototype,
        "neutralOutlineHoverDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-outline-active-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralOutlineActiveDelta,
            }),
        ],
        Pa.prototype,
        "neutralOutlineActiveDelta",
        void 0
    ),
    t(
        [
            Ro({
                attribute: "neutral-outline-focus-delta",
                converter: J,
                cssCustomProperty: !1,
                default: ji.neutralOutlineFocusDelta,
            }),
        ],
        Pa.prototype,
        "neutralOutlineFocusDelta",
        void 0
    ),
    (Pa = t(
        [
            ((Ea = { name: "fast-design-system-provider", template: No, styles: Ta }),
            t => {
                ht(Ea)(t), t.registerTagName("string" == typeof Ea ? Ea : Ea.name);
            }),
        ],
        Pa
    ));
const Aa = Eo("neutral-foreground-rest", t => Rn(t).rest, Pa.findProvider),
    Sa = Eo("neutral-foreground-hover", t => Rn(t).hover, Pa.findProvider),
    Ia = Eo("neutral-foreground-active", t => Rn(t).active, Pa.findProvider),
    Ha = Eo("neutral-foreground-focus", t => Rn(t).focus, Pa.findProvider),
    Oa = Eo("neutral-foreground-toggle", Kn, Pa.findProvider),
    La = Eo("neutral-foreground-toggle-large", Xn, Pa.findProvider),
    Ma = Eo("neutral-foreground-hint", es, Pa.findProvider),
    Ba = Eo("neutral-foreground-hint-large", os, Pa.findProvider),
    Ra = Eo("accent-foreground-rest", t => rs(t).rest, Pa.findProvider),
    Na = Eo("accent-foreground-hover", t => rs(t).hover, Pa.findProvider),
    za = Eo("accent-foreground-active", t => rs(t).active, Pa.findProvider),
    ja = Eo("accent-foreground-focus", t => rs(t).focus, Pa.findProvider),
    _a = Eo("accent-foreground-cut-rest", t => Zn(t), Pa.findProvider),
    Va = Eo("accent-foreground-large-rest", t => ns(t).rest, Pa.findProvider),
    Ga = Eo("accent-foreground-large-hover", t => ns(t).hover, Pa.findProvider),
    qa = Eo("accent-foreground-large-active", t => ns(t).active, Pa.findProvider),
    Wa = Eo("accent-foreground-large-focus", t => ns(t).focus, Pa.findProvider),
    Ua = Eo("neutral-fill-rest", t => ys(t).rest, Pa.findProvider),
    Ka = Eo("neutral-fill-hover", t => ys(t).hover, Pa.findProvider),
    Xa = Eo("neutral-fill-active", t => ys(t).active, Pa.findProvider),
    Ya = Eo("neutral-fill-focus", t => ys(t).focus, Pa.findProvider),
    Qa = Eo("neutral-fill-selected", t => ys(t).selected, Pa.findProvider),
    Za = Eo("neutral-fill-stealth-rest", t => Ts(t).rest, Pa.findProvider),
    Ja = Eo("neutral-fill-stealth-hover", t => Ts(t).hover, Pa.findProvider),
    tl = Eo("neutral-fill-stealth-active", t => Ts(t).active, Pa.findProvider),
    el = Eo("neutral-fill-stealth-focus", t => Ts(t).focus, Pa.findProvider),
    ol = Eo("neutral-fill-stealth-selected", t => Ts(t).selected, Pa.findProvider),
    il = Eo("neutral-fill-toggle-rest", t => _n(t).rest, Pa.findProvider),
    rl = Eo("neutral-fill-toggle-hover", t => _n(t).hover, Pa.findProvider),
    nl = Eo("neutral-fill-toggle-active", t => _n(t).active, Pa.findProvider),
    sl = Eo("neutral-fill-toggle-focus", t => _n(t).focus, Pa.findProvider),
    al = Eo("neutral-fill-input-rest", t => Os(t).rest, Pa.findProvider),
    ll = Eo("neutral-fill-input-hover", t => Os(t).hover, Pa.findProvider),
    cl = Eo("neutral-fill-input-active", t => Os(t).active, Pa.findProvider),
    dl = Eo("neutral-fill-input-focus", t => Os(t).focus, Pa.findProvider),
    hl = Eo("accent-fill-rest", t => Bs(t).rest, Pa.findProvider),
    ul = Eo("accent-fill-hover", t => Bs(t).hover, Pa.findProvider),
    pl = Eo("accent-fill-active", t => Bs(t).active, Pa.findProvider),
    fl = Eo("accent-fill-focus", t => Bs(t).focus, Pa.findProvider),
    vl = Eo("accent-fill-selected", t => Bs(t).selected, Pa.findProvider),
    bl = Eo("accent-fill-large-rest", t => Rs(t).rest, Pa.findProvider),
    gl = Eo("accent-fill-large-hover", t => Rs(t).hover, Pa.findProvider),
    ml = Eo("accent-fill-large-active", t => Rs(t).active, Pa.findProvider),
    yl = Eo("accent-fill-large-focus", t => Rs(t).focus, Pa.findProvider),
    xl = Eo("accent-fill-large-selected", t => Rs(t).selected, Pa.findProvider),
    kl = Eo("neutral-fill-card-rest", t => Ks(t), Pa.findProvider),
    wl = Eo("neutral-outline-rest", t => Xs(t).rest, Pa.findProvider),
    Cl = Eo("neutral-outline-hover", t => Xs(t).hover, Pa.findProvider),
    $l = Eo("neutral-outline-active", t => Xs(t).active, Pa.findProvider),
    Fl = Eo("neutral-outline-focus", t => Xs(t).focus, Pa.findProvider),
    Dl = Eo("neutral-divider-rest", Js, Pa.findProvider),
    Tl = Eo("neutral-layer-floating", fa, Pa.findProvider),
    Pl = Eo("neutral-layer-card", va, Pa.findProvider),
    El = Eo("neutral-layer-card-container", ba, Pa.findProvider),
    Al = Eo("neutral-layer-l1", ga, Pa.findProvider),
    Sl = Eo("neutral-layer-l1-alt", ma, Pa.findProvider),
    Il = Eo("neutral-layer-l2", ya, Pa.findProvider),
    Hl = Eo("neutral-layer-l3", xa, Pa.findProvider),
    Ol = Eo("neutral-layer-l4", ka, Pa.findProvider),
    Ll = Eo("neutral-focus", Ca, Pa.findProvider),
    Ml = Eo("neutral-focus-inner-accent", Fa(qi), Pa.findProvider),
    Bl = kt`
    ${Io("flex")} :host {
        box-sizing: border-box;
        flex-direction: column;
        font-family: var(--body-font);
        font-size: var(--type-ramp-minus-1-font-size);
        line-height: var(--type-ramp-minus-1-line-height);
        color: var(--neutral-foreground-rest);
        border-top: calc(var(--outline-width) * 1px) solid var(--neutral-divider-rest);
    }
`.withBehaviors(hl, Dl, Aa);
let Rl = class extends bo {};
Rl = t([ht({ name: "fast-accordion", template: Tt, styles: Bl })], Rl);
const Nl =
        "box-shadow: 0 0 calc((var(--elevation) * 0.225px) + 2px) rgba(0, 0, 0, calc(.11 * (2 - var(--background-luminance, 1)))), 0 calc(var(--elevation) * 0.4px) calc((var(--elevation) * 0.9px)) rgba(0, 0, 0, calc(.13 * (2 - var(--background-luminance, 1))));",
    zl = "(var(--base-height-multiplier) + var(--density)) * var(--design-unit)",
    jl = kt`
    ${Io("inline-block")} :host {
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
        height: calc(${zl} * 1px);
        min-width: calc(${zl} * 1px);
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

    .control:${Ho} {
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
    _l = kt`
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

    :host(.accent) .control:${Ho} {
        box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset var(--neutral-focus-inner-accent);
    }
`,
    Vl = kt`
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
    :host(.hypertext) .control:${Ho} {
        border-bottom: calc(var(--focus-outline-width) * 1px) solid var(--neutral-focus);
    }
`,
    Gl = kt`
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

    :host(.lightweight) .control:${Ho} .content::before {
        background: var(--neutral-foreground-rest);
        height: calc(var(--focus-outline-width) * 1px);
    }
`,
    ql = kt`
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

    :host(.outline) .control:${Ho} {
        border: calc(var(--outline-width) * 1px) solid var(--neutral-focus);
        box-shadow: 0 0 0 calc((var(--focus-outline-width) - var(--outline-width)) * 1px) var(--neutral-focus);
    }
`,
    Wl = kt`
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
    Ul = kt`
    ${jl}
    ${_l}
    ${Vl}
    ${Gl}
    ${ql}
    ${Wl}
`.withBehaviors(
        pl,
        ul,
        hl,
        za,
        _a,
        Na,
        Ra,
        Xa,
        Ya,
        Ka,
        Ua,
        tl,
        Ja,
        Za,
        Ll,
        Ml,
        Aa,
        $l,
        Cl,
        wl
    );
let Kl = class extends mo {};
Kl = t(
    [
        ht({
            name: "fast-anchor",
            template: go,
            styles: Ul,
            shadowOptions: { delegatesFocus: !0 },
        }),
    ],
    Kl
);
const Xl = kt`
    ${Io("inline-block")} :host {
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
        ${""} height: calc((${zl} - (var(--design-unit) * 3)) * 1px);
        min-width: calc((${zl} - (var(--design-unit) * 3)) * 1px);
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
    }
`.withBehaviors(Ra);
let Yl = class extends xo {};
Yl = t([ht({ name: "fast-badge", template: yo, styles: Xl })], Yl);
const Ql = kt`
    ${jl}
    ${_l}
    ${Vl}
    ${Gl}
    ${ql}
    ${Wl}
`.withBehaviors(
    pl,
    ul,
    hl,
    za,
    _a,
    Na,
    Ra,
    Xa,
    Ya,
    Ka,
    Ua,
    tl,
    Ja,
    Za,
    Ll,
    Ml,
    Aa,
    $l,
    Cl,
    wl,
    So(kt`
            :host(.disabled),
            :host(.disabled) .control {
                forced-color-adjust: none;
                background: ${ao.ButtonFace};
                border-color: ${ao.GrayText};
                color: ${ao.GrayText};
                cursor: ${"not-allowed"};
                opacity: 1;
            }
            :host(.accent) .control {
                forced-color-adjust: none;
                background: ${ao.Highlight};
                color: ${ao.HighlightText};
            }
    
            :host(.accent) .control:hover {
                background: ${ao.HighlightText};
                border-color: ${ao.Highlight};
                color: ${ao.Highlight};
            }
    
            :host(.accent:${Ho}) .control {
                border-color: ${ao.ButtonText};
                box-shadow: 0 0 0 2px ${ao.HighlightText} inset;
            }
    
            :host(.accent.disabled) .control,
            :host(.accent.disabled) .control:hover {
                background: ${ao.ButtonFace};
                border-color: ${ao.GrayText};
                color: ${ao.GrayText};
            }
            :host(.lightweight) .control:hover {
                forced-color-adjust: none;
                color: ${ao.Highlight};
            }
    
            :host(.lightweight) .control:hover .content::before {
                background: ${ao.Highlight};
            }
    
            :host(.lightweight.disabled) .control {
                forced-color-adjust: none;
                color: ${ao.GrayText};
            }
        
            :host(.lightweight.disabled) .control:hover .content::before {
                background: none;
            }
            :host(.outline.disabled) .control {
                border-color: ${ao.GrayText};
            }
            :host(.stealth) .control {
                forced-color-adjust: none;
                background: none;
                border-color: transparent;
                color: ${ao.ButtonText};
                fill: currentColor;
            }
            :host(.stealth) .control:hover,
            :host(.stealth:${Ho}) .control {
                background: ${ao.Highlight};
                border-color: ${ao.Highlight};
                color: ${ao.HighlightText};
            }
            :host(.stealth.disabled) .control {
                background: none;
                border-color: transparent;
                color: ${ao.GrayText};
            }
        `)
);
let Zl = class extends $o {};
Zl = t(
    [
        ht({
            name: "fast-button",
            template: ko,
            styles: Ql,
            shadowOptions: { delegatesFocus: !0 },
        }),
    ],
    Zl
);
const Jl = kt`
    ${Io("block")} :host {
        --elevation: 4;
        display: block;
        contain: content;
        height: var(--card-height, 100%);
        width: var(--card-width, 100%);
        box-sizing: border-box;
        background: var(--neutral-layer-card);
        border-radius: calc(var(--corner-radius) * 1px);
        ${Nl};
        border: calc(var(--outline-width) * 1px) solid transparent;
    }
`;
let tc = class extends Do {};
tc = t([ht({ name: "fast-card", template: Fo, styles: Jl })], tc);
const ec = kt`
    ${Io("inline-flex")} :host {
        align-items: center;
        outline: none;
        margin: calc(var(--design-unit) * 1px) 0;
        ${""} user-select: none;
    }

    .control {
        position: relative;
        width: calc((${zl} / 2 + var(--design-unit)) * 1px);
        height: calc((${zl} / 2 + var(--design-unit)) * 1px);
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

    :host(:${Ho}) .control {
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

    :host(.checked:${Ho}:enabled) .control {
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
    pl,
    ul,
    hl,
    _a,
    cl,
    ll,
    al,
    Ll,
    Ml,
    Aa,
    $l,
    Cl,
    wl,
    So(kt`
            .control {
                forced-color-adjust: none;
                border-color: ${ao.FieldText};
                background: ${ao.Field};
            }
            .checked-indicator {
                fill: ${ao.FieldText};
            }
            .indeterminate-indicator {
                background: ${ao.FieldText};
            }
            :host(:enabled) .control:hover, .control:active {
                border-color: ${ao.Highlight};
                background: ${ao.Field};
            }
            :host(:${Ho}) .control {
                border-color: ${ao.Highlight};
                box-shadow: 0 0 0 2px ${ao.Field}, 0 0 0 4px ${ao.FieldText};
            }
            :host(.checked:${Ho}:enabled) .control {
                box-shadow: 0 0 0 2px ${ao.Field}, 0 0 0 4px ${ao.FieldText};
            }
            :host(.checked) .control {
                background: ${ao.Highlight};
                border-color: ${ao.Highlight};
            }
            :host(.checked:enabled) .control:hover, .control:active {
                border-color: ${ao.Highlight};
                background: ${ao.HighlightText};
            }
            :host(.checked) .checked-indicator {
                fill: ${ao.HighlightText};
            }
            :host(.checked:enabled) .control:hover .checked-indicator {
                fill: ${ao.Highlight}
            }
            :host(.checked) .indeterminate-indicator {
                background: ${ao.HighlightText};
            }
            :host(.checked) .control:hover .indeterminate-indicator {
                background: ${ao.Highlight}
            }
            :host(.disabled) {
                opacity: 1;
            }
            :host(.disabled) .control {
                forced-color-adjust: none;
                border-color: ${ao.GrayText};
                background: ${ao.Field};
            }
            :host(.disabled) .indeterminate-indicator,
            :host(.checked.disabled) .control:hover .indeterminate-indicator {
                forced-color-adjust: none;
                background: ${ao.GrayText};
            }
            :host(.disabled) .checked-indicator,
            :host(.checked.disabled) .control:hover .checked-indicator {
                forced-color-adjust: none;
                fill: ${ao.GrayText};
            }
        `)
);
let oc = class extends Po {};
oc = t([ht({ name: "fast-checkbox", template: To, styles: ec })], oc);
const ic = kt`
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
        ${Nl} margin-top: auto;
        margin-bottom: auto;
        width: var(--dialog-width);
        height: var(--dialog-height);
        background-color: var(--background-color);
        z-index: 1;
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid transparent;
    }
`;
let rc = class extends Zo {};
rc = t([ht({ name: "fast-dialog", template: zo, styles: ic })], rc);
const nc = kt`
    ${Io("block")} :host {
        box-sizing: content-box;
        height: 0;
        margin: calc(var(--design-unit) * 1px) 0;
        border: none;
        border-top: calc(var(--outline-width) * 1px) solid var(--neutral-divider-rest);
    }
`.withBehaviors(Dl);
let sc = class extends oi {};
sc = t([ht({ name: "fast-divider", template: Jo, styles: nc })], sc);
const ac = kt`
    ${Io("inline-flex")} :host {
        width: calc(${zl} * 1px);
        height: calc(${zl} * 1px);
        justify-content: center;
        align-items: center;
        margin: 0;
        position: relative;
        fill: var(--accent-foreground-cut-rest);
        color: var(--accent-foreground-cut-rest);
        background: transparent;
        outline: none;
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

    :host(.disabled)::before,
    :host(.disabled:hover)::before,
    :host(.disabled:active)::before {
        background: var(--neutral-fill-stealth-rest);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
    }

    :host(:hover)::before {
        background: var(--accent-fill-hover);
        border-color: var(--accent-fill-hover);
    }

    :host(:active)::before {
        background: var(--accent-fill-active);
        border-color: var(--accent-fill-active);
    }

    :host(:${Ho}) {
        outline: none;
    }

    :host(:${Ho})::before {
        box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset var(--neutral-focus-inner-accent);
        border-color: var(--neutral-focus);
    }

    :host::-moz-focus-inner {
        border: 0;
    }
`.withBehaviors(
    pl,
    ul,
    hl,
    _a,
    Za,
    Ll,
    Ml,
    Aa,
    wl,
    So(kt`
            :host {
                background: ${ao.Canvas};
            }
            :host .next,
            :host .previous {
                color: ${ao.ButtonText};
                fill: ${ao.ButtonText};
            }
            :host::before {
                background: ${ao.Canvas};
                border-color: ${ao.ButtonText};
            }
            :host(:hover)::before {
                forced-color-adjust: none;
                background: ${ao.Highlight};
                border-color: ${ao.ButtonText};
                opacity: 1;
            }
            :host(:hover) .next,
            :host(:hover) .previous {
                forced-color-adjust: none;
                color: ${ao.HighlightText};
                fill: ${ao.HighlightText};
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
                background: ${ao.Canvas};
                border-color: ${ao.GrayText};
                color: ${ao.GrayText};
                fill: ${ao.GrayText};
            }
            :host(:${Ho})::before {
                forced-color-adjust: none;
                border-color: ${ao.Highlight};
                box-shadow: 0 0 0 2px ${ao.Field}, 0 0 0 4px ${ao.FieldText};
            }
        `)
);
let lc = class extends ii {};
lc = t([ht({ name: "fast-flipper", template: ri, styles: ac })], lc);
const cc = kt`
    ${Io("block")} :host {
        --elevation: 11;
        background: var(--neutral-layer-floating);
        border: calc(var(--outline-width) * 1px) solid transparent;
        border-radius: var(--elevated-corner-radius);
        ${Nl} margin: 0;
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
`.withBehaviors(Tl, Dl);
let dc = class extends ci {};
dc = t([ht({ name: "fast-menu", template: ni, styles: cc })], dc);
const hc = kt`
    ${Io("grid")} :host {
        outline: none;
        box-sizing: border-box;
        height: calc(${zl} * 1px);
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

    :host(:${Ho}) {
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
    :host(:hover)::slotted(svg),
    :host(:active) .start,
    :host(:active) .end,
    :host(:active)::slotted(svg) {
        fill: var(--accent-foreground-cut-rest);
    }
`.withBehaviors(
    pl,
    ul,
    _a,
    Za,
    Ll,
    Ml,
    Aa,
    So(kt`
            :host {
                border-color: transparent;
                forced-color-adjust: none;
            }
            :host(:hover) {
                background: ${ao.Highlight};
                color: ${ao.HighlightText};
            }
            :host(:hover) .start,
            :host(:hover) .end,
            :host(:hover)::slotted(svg),
            :host(:active) .start,
            :host(:active) .end,
            :host(:active)::slotted(svg) {
                fill: ${ao.HighlightText};
            }
            :host(:${Ho}) {
                background: ${ao.Highlight};
                border-color: ${ao.ButtonText};
                box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset ${ao.HighlightText};
                color: ${ao.HighlightText};
                fill: ${ao.HighlightText};
            }
            :host(.disabled),
            :host(.disabled:hover),
            :host(.disabled:hover) .start,
            :host(.disabled:hover) .end,
            :host(.disabled:hover)::slotted(svg) {
                background: ${ao.Canvas};
                color: ${ao.GrayText};
                fill: ${ao.GrayText};
                opacity: 1;
            }
        `)
);
let uc = class extends ai {};
uc = t([ht({ name: "fast-menu-item", template: li, styles: hc })], uc);
const pc = kt`
    ${Io("flex")} :host {
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
    hl,
    Ua,
    Ma,
    So(kt`
            .indeterminate-indicator-1,
            .indeterminate-indicator-2,
            .determinate {
                forced-color-adjust: none;
                background-color: ${ao.FieldText};
            }
            .progress {
                background-color: ${ao.Field};
                border: calc(var(--outline-width) * 1px) solid ${ao.FieldText};
            }
            :host(.paused) .indeterminate-indicator-1,
            .indeterminate-indicator-2 {
                background-color: ${ao.Field};
            }
            :host(.paused) .determinate {
                background-color: ${ao.GrayText};
            }
        `)
);
let fc = class extends di {};
fc = t([ht({ name: "fast-progress", template: hi, styles: pc })], fc);
const vc = kt`
    ${Io("flex")} :host {
        align-items: center;
        outline: none;
        height: calc(${zl} * 1px);
        width: calc(${zl} * 1px);
        margin: calc(${zl} * 1px) 0;
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
    hl,
    Ua,
    Ma,
    So(kt`
            .indeterminate-indicator-1,
            .determinate {
                stroke: ${ao.FieldText};
            }
            .background {
                stroke: ${ao.Field};
            }
            :host(.paused) .indeterminate-indicator-1 {
                stroke: ${ao.Field};
            }
            :host(.paused) .determinate {
                stroke: ${ao.GrayText};
            }
        `)
);
let bc = class extends di {};
bc = t([ht({ name: "fast-progress-ring", template: ui, styles: vc })], bc);
const gc = kt`
    ${Io("inline-flex")} :host {
        --input-size: calc((${zl} / 2) + var(--design-unit));
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
        width: calc((${zl} / 2 + var(--design-unit)) * 1px);
        height: calc((${zl} / 2 + var(--design-unit)) * 1px);
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

    :host(:${Ho}) .control {
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

    :host(.checked:${Ho}:enabled) .control {
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
    pl,
    ul,
    hl,
    _a,
    cl,
    ll,
    al,
    Ll,
    Aa,
    $l,
    Cl,
    wl,
    So(kt`
            .control,
            :host(.checked:enabled) .control {
                forced-color-adjust: none;
                border-color: ${ao.FieldText};
                background: ${ao.Field};
            }
            :host(:enabled) .control:hover {
                border-color: ${ao.Highlight};
                background: ${ao.Field};
            }
            :host(.checked:enabled) .control:hover,
            :host(.checked:enabled) .control:active {
                border-color: ${ao.Highlight};
                background: ${ao.Highlight};
            }
            :host(.checked) .checked-indicator {
                background: ${ao.Highlight};
                fill: ${ao.Highlight};
            }
            :host(.checked:enabled) .control:hover .checked-indicator,
            :host(.checked:enabled) .control:active .checked-indicator {
                background: ${ao.HighlightText};
                fill: ${ao.HighlightText};
            }
            :host(:${Ho}) .control {
                border-color: ${ao.Highlight};
                box-shadow: 0 0 0 2px ${ao.Field}, 0 0 0 4px ${ao.FieldText};
            }
            :host(.checked:${Ho}:enabled) .control {
                border-color: ${ao.Highlight};
                box-shadow: 0 0 0 2px ${ao.Field}, 0 0 0 4px ${ao.FieldText};
            }
            :host(.disabled) {
                forced-color-adjust: none;
                opacity: 1;
            }
            :host(.disabled) .label {
                color: ${ao.GrayText};
            }
            :host(.disabled) .control,
            :host(.checked.disabled) .control:hover, .control:active {
                background: ${ao.Field};
                border-color: ${ao.GrayText};
            }
            :host(.disabled) .checked-indicator,
            :host(.checked.disabled) .control:hover .checked-indicator {
                fill: ${ao.GrayText};
                background: ${ao.GrayText};
            }
        `)
);
let mc = class extends fi {};
mc = t([ht({ name: "fast-radio", template: pi, styles: gc })], mc);
const yc = kt`
    ${Io("flex")} :host {
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
let xc = class extends bi {};
xc = t([ht({ name: "fast-radio-group", template: vi, styles: yc })], xc);
const kc = kt`
    :host([hidden]) {
        display: none;
    }

    ${Io("inline-grid")} :host {
        --thumb-size: calc(${zl} * 0.5 - var(--design-unit));
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

    :host(:${Ho}) .thumb-cursor {
        background: ${ao.Highlight};
        border-color: ${ao.Highlight};
        box-shadow: 0 0 0 2px ${ao.Field}, 0 0 0 4px ${ao.FieldText};
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
        height: 4px;
    }
    :host(.vertical) .track {
        top: calc(var(--track-overhang) * 1px);
        bottom: calc(var(--track-overhang) * 1px);
        justify-self: start;
        margin-left: calc(var(--design-unit) * 1px);
        width: 4px;
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
    Ll,
    Ia,
    Sa,
    Aa,
    Cl,
    wl,
    So(kt`
            .thumb-cursor {
                forced-color-adjust: none;
                border-color: ${ao.FieldText};
                background: ${ao.FieldText};
            }
            .thumb-cursor:hover,
            .thumb-cursor:active {
                background: ${ao.Highlight};
            }
            .track {
                forced-color-adjust: none;
                background: ${ao.FieldText};
            }
            :host(:${Ho}) .thumb-cursor {
                border-color: ${ao.Highlight};
            }
            :host(.disabled) {
                opacity: 1;
                cursor: ${"not-allowed"};
            }
            :host(.disabled) .slider,
            :host(.disabled) .track,
            :host(.disabled) .thumb-cursor {
                forced-color-adjust: none;
                background: ${ao.GrayText};
            }
        `)
);
let wc = class extends xi {};
wc = t([ht({ name: "fast-slider", template: gi, styles: kc })], wc);
const Cc = kt`
    ${Io("block")} :host {
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
        height: calc((${zl} / 2 + var(--design-unit)) * 1px);
        width: auto;
    }
    :host(.vertical) {
        justify-self: start;
        grid-column: 2;
        margin-left: 2px;
        height: auto;
        width: calc((${zl} / 2 + var(--design-unit)) * 1px);
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
        height: calc(${zl} * 0.25 * 1px);
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
    Aa,
    wl,
    So(kt`
            .mark {
                forced-color-adjust: none;
                background: ${ao.FieldText};
            }
            :host(.disabled) {
                forced-color-adjust: none;
                opacity: 1;
            }
            :host(.disabled) .label {
                color: ${ao.GrayText};
            }
            :host(.disabled) .mark {
                background: ${ao.GrayText};
            }
        `)
);
let $c = class extends Ci {};
$c = t([ht({ name: "fast-slider-label", template: ki, styles: Cc })], $c);
const Fc = kt`
    :host([hidden]) {
        display: none;
    }

    ${Io("inline-flex")} :host {
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
        width: calc(${zl} * 1px);
        height: calc((${zl} / 2 + var(--design-unit)) * 1px);
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

    :host(:${Ho}) .switch {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px var(--neutral-focus);
        border-color: var(--neutral-focus);
    }

    .checked-indicator {
        position: absolute;
        top: 5px;
        left: 5px;
        right: calc(((${zl} / 2) + 1) * 1px);
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
        left: calc(((${zl} / 2) + 1) * 1px);
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

    :host(.checked:${Ho}:enabled) .switch {
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
    pl,
    ul,
    hl,
    _a,
    cl,
    ll,
    al,
    Ll,
    Aa,
    $l,
    Cl,
    wl,
    So(kt`
            .checked-indicator,
            :host(:enabled) .switch:active .checked-indicator {
                forced-color-adjust: none;
                background: ${ao.FieldText};
            }
            .switch {
                forced-color-adjust: none;
                background: ${ao.Field};
                border-color: ${ao.FieldText};
            }
            :host(:enabled) .switch:hover {
                background: ${ao.HighlightText};
                border-color: ${ao.Highlight};
            }
            :host(.checked) .switch {
                background: ${ao.Highlight};
                border-color: ${ao.Highlight};
            }
            :host(.checked:enabled) .switch:hover,
            :host(:enabled) .switch:active {
                background: ${ao.HighlightText};
                border-color: ${ao.Highlight};
            }
            :host(.checked) .checked-indicator {
                background: ${ao.HighlightText};
            }
            :host(.checked:enabled) .switch:hover .checked-indicator {
                background: ${ao.Highlight};
            }
            :host(.disabled) {
                opacity: 1;
            }
            :host(:${Ho}) .switch {
                border-color: ${ao.Highlight};
                box-shadow: 0 0 0 2px ${ao.Field}, 0 0 0 4px ${ao.FieldText};
            }
            :host(.checked:${Ho}:enabled) .switch {
                box-shadow: 0 0 0 2px ${ao.Field}, 0 0 0 4px ${ao.FieldText};
            }
            :host(.disabled) .checked-indicator {
                background: ${ao.GrayText};
            }
            :host(.disabled) .switch {
                background: ${ao.Field};
                border-color: ${ao.GrayText};
            }
        `)
);
let Dc = class extends Fi {};
Dc = t([ht({ name: "fast-switch", template: $i, styles: Fc })], Dc);
const Tc = kt`
    ${Io("grid")} :host {
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
        padding: calc((${zl} - var(--design-unit)) * 1px)
            calc(var(--design-unit) * 4px)
            calc((${zl} - var(--design-unit)) * 1px) 0;
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
        hl,
        Aa,
        So(kt`
            .activeIndicator,
            :host(.vertical) .activeIndicator {
                forced-color-adjust: none;
                background: ${ao.Highlight};
            }
        `)
    ),
    Pc = kt`
    ${Io("inline-flex")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        height: calc(${zl} * 1px);
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

    :host(:${Ho}) {
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
        pl,
        ul,
        hl,
        za,
        Na,
        Ra,
        Xa,
        Ka,
        Ua,
        Ll,
        Ma,
        Ia,
        Sa,
        Aa,
        So(kt`
            :host {
                forced-color-adjust: none;
                border-color: transparent;
                color: ${ao.ButtonText};
                fill: ${ao.ButtonText};
            }
            :host(:hover),
            :host(.vertical:hover),
            :host([aria-selected="true"]:hover) {
                background: ${ao.Highlight};
                color: ${ao.HighlightText};
                fill: ${ao.HighlightText};
            }
            :host([aria-selected="true"]) {
                background: ${ao.HighlightText};
                color: ${ao.Highlight};
                fill: ${ao.Highlight};
            }
            :host(:${Ho}) {
                border-color: ${ao.ButtonText};
                box-shadow: none;
            }
        `)
    );
let Ec = class extends Ai {};
Ec = t([ht({ name: "fast-tab", template: Ei, styles: Pc })], Ec);
const Ac = kt`
    ${Io("flex")} :host {
        box-sizing: border-box;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        padding: 0 calc((6 + (var(--design-unit) * 2 * var(--density))) * 1px);
    }
`;
let Sc = class extends Ii {};
Sc = t([ht({ name: "fast-tab-panel", template: Si, styles: Ac })], Sc);
let Ic = class extends Pi {};
Ic = t([ht({ name: "fast-tabs", template: Di, styles: Tc })], Ic);
const Hc = kt`
    ${Io("inline-block")} :host {
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
        height: calc(${zl} * 2px);
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
    .control:${Ho},
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
    pl,
    ul,
    hl,
    Ka,
    cl,
    ll,
    al,
    Ua,
    Ll,
    Aa,
    wl,
    So(kt`
            :host([disabled]) {
                opacity: 1;
            }
        `)
);
let Oc = class extends Li {};
Oc = t(
    [
        ht({
            name: "fast-text-area",
            template: Mi,
            styles: Hc,
            shadowOptions: { delegatesFocus: !0 },
        }),
    ],
    Oc
);
const Lc = kt`
    ${Io("inline-block")} :host {
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
        height: calc(${zl} * 1px);
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
    .control:${Ho},
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
    pl,
    ul,
    hl,
    Ka,
    ll,
    al,
    Ua,
    Ll,
    Aa,
    wl,
    So(kt`
            .root,
            :host(.filled) .root {
                forced-color-adjust: none;
                background: ${ao.Field};
                border-color: ${ao.FieldText};
            }
            :host(:hover:not(.disabled)) .root,
            :host(.filled:hover:not(.disabled)) .root,
            :host(.filled:hover) .root {
                background: ${ao.Field};
                border-color: ${ao.Highlight};
            }
            .before-content,
            .after-content {
                fill: ${ao.ButtonText};
            }
            :host(.disabled) {
                opacity: 1;
            }
            :host(.disabled) .root,
            :host(.filled:hover.disabled) .root {
                border-color: ${ao.GrayText};
                background: ${ao.Field};
            }
            :host(:focus-within:enabled) .root {
                border-color: ${ao.Highlight};
                box-shadow: 0 0 0 1px ${ao.Highlight} inset;
            }
        `)
);
let Mc = class extends zi {};
Mc = t(
    [
        ht({
            name: "fast-text-field",
            template: Bi,
            styles: Lc,
            shadowOptions: { delegatesFocus: !0 },
        }),
    ],
    Mc
);
export {
    Rl as FASTAccordion,
    Kl as FASTAnchor,
    Yl as FASTBadge,
    Zl as FASTButton,
    tc as FASTCard,
    oc as FASTCheckbox,
    Pa as FASTDesignSystemProvider,
    rc as FASTDialog,
    sc as FASTDivider,
    lc as FASTFlipper,
    dc as FASTMenu,
    uc as FASTMenuItem,
    fc as FASTProgress,
    bc as FASTProgressRing,
    mc as FASTRadio,
    xc as FASTRadioGroup,
    wc as FASTSlider,
    $c as FASTSliderLabel,
    Dc as FASTSwitch,
    Ec as FASTTab,
    Sc as FASTTabPanel,
    Ic as FASTTabs,
    Oc as FASTTextArea,
    Mc as FASTTextField,
    Tn as PaletteType,
    aa as StandardLuminance,
    Bs as accentFill,
    js as accentFillActive,
    pl as accentFillActiveBehavior,
    fl as accentFillFocusBehavior,
    zs as accentFillHover,
    ul as accentFillHoverBehavior,
    Rs as accentFillLarge,
    qs as accentFillLargeActive,
    ml as accentFillLargeActiveBehavior,
    yl as accentFillLargeFocusBehavior,
    Gs as accentFillLargeHover,
    gl as accentFillLargeHoverBehavior,
    Vs as accentFillLargeRest,
    bl as accentFillLargeRestBehavior,
    Ws as accentFillLargeSelected,
    xl as accentFillLargeSelectedBehavior,
    Ns as accentFillRest,
    hl as accentFillRestBehavior,
    _s as accentFillSelected,
    vl as accentFillSelectedBehavior,
    rs as accentForeground,
    ls as accentForegroundActive,
    za as accentForegroundActiveBehavior,
    Zn as accentForegroundCut,
    Jn as accentForegroundCutLarge,
    _a as accentForegroundCutRestBehavior,
    ja as accentForegroundFocusBehavior,
    as as accentForegroundHover,
    Na as accentForegroundHoverBehavior,
    ns as accentForegroundLarge,
    hs as accentForegroundLargeActive,
    qa as accentForegroundLargeActiveBehavior,
    Wa as accentForegroundLargeFocusBehavior,
    ds as accentForegroundLargeHover,
    Ga as accentForegroundLargeHoverBehavior,
    cs as accentForegroundLargeRest,
    Va as accentForegroundLargeRestBehavior,
    ss as accentForegroundRest,
    Ra as accentForegroundRestBehavior,
    Da as createColorPalette,
    Sn as isDarkMode,
    Js as neutralDividerRest,
    Dl as neutralDividerRestBehavior,
    ys as neutralFill,
    bs as neutralFillActive,
    Xa as neutralFillActiveBehavior,
    Ks as neutralFillCard,
    kl as neutralFillCardRestBehavior,
    Ya as neutralFillFocusBehavior,
    vs as neutralFillHover,
    Ka as neutralFillHoverBehavior,
    Os as neutralFillInput,
    Ss as neutralFillInputActive,
    cl as neutralFillInputActiveBehavior,
    dl as neutralFillInputFocusBehavior,
    As as neutralFillInputHover,
    ll as neutralFillInputHoverBehavior,
    Es as neutralFillInputRest,
    al as neutralFillInputRestBehavior,
    Hs as neutralFillInputSelected,
    fs as neutralFillRest,
    Ua as neutralFillRestBehavior,
    ms as neutralFillSelected,
    Qa as neutralFillSelectedBehavior,
    Ts as neutralFillStealth,
    $s as neutralFillStealthActive,
    tl as neutralFillStealthActiveBehavior,
    el as neutralFillStealthFocusBehavior,
    Cs as neutralFillStealthHover,
    Ja as neutralFillStealthHoverBehavior,
    ws as neutralFillStealthRest,
    Za as neutralFillStealthRestBehavior,
    Ds as neutralFillStealthSelected,
    ol as neutralFillStealthSelectedBehavior,
    _n as neutralFillToggle,
    qn as neutralFillToggleActive,
    nl as neutralFillToggleActiveBehavior,
    sl as neutralFillToggleFocusBehavior,
    Gn as neutralFillToggleHover,
    rl as neutralFillToggleHoverBehavior,
    Vn as neutralFillToggleRest,
    il as neutralFillToggleRestBehavior,
    Ca as neutralFocus,
    Ll as neutralFocusBehavior,
    Fa as neutralFocusInnerAccent,
    Ml as neutralFocusInnerAccentBehavior,
    Rn as neutralForeground,
    jn as neutralForegroundActive,
    Ia as neutralForegroundActiveBehavior,
    Ha as neutralForegroundFocusBehavior,
    es as neutralForegroundHint,
    Ma as neutralForegroundHintBehavior,
    os as neutralForegroundHintLarge,
    Ba as neutralForegroundHintLargeBehavior,
    zn as neutralForegroundHover,
    Sa as neutralForegroundHoverBehavior,
    Nn as neutralForegroundRest,
    Aa as neutralForegroundRestBehavior,
    Kn as neutralForegroundToggle,
    Oa as neutralForegroundToggleBehavior,
    Xn as neutralForegroundToggleLarge,
    La as neutralForegroundToggleLargeBehavior,
    va as neutralLayerCard,
    Pl as neutralLayerCardBehavior,
    ba as neutralLayerCardContainer,
    El as neutralLayerCardContainerBehavior,
    fa as neutralLayerFloating,
    Tl as neutralLayerFloatingBehavior,
    ga as neutralLayerL1,
    ma as neutralLayerL1Alt,
    Sl as neutralLayerL1AltBehavior,
    Al as neutralLayerL1Behavior,
    ya as neutralLayerL2,
    Il as neutralLayerL2Behavior,
    xa as neutralLayerL3,
    Hl as neutralLayerL3Behavior,
    ka as neutralLayerL4,
    Ol as neutralLayerL4Behavior,
    Xs as neutralOutline,
    Zs as neutralOutlineActive,
    $l as neutralOutlineActiveBehavior,
    Fl as neutralOutlineFocusBehavior,
    Qs as neutralOutlineHover,
    Cl as neutralOutlineHoverBehavior,
    Ys as neutralOutlineRest,
    wl as neutralOutlineRestBehavior,
    Pn as palette,
};
