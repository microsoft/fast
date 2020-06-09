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
    v = new WeakMap();
let f = void 0,
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
        return void 0 !== f && f.watch(t, this.name), t[this.field];
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
            void 0 !== f && f.watch(t, e);
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
            let e = v.get(t);
            if (void 0 === e) {
                let o = Reflect.getPrototypeOf(t);
                for (; void 0 === e && null !== o; )
                    (e = v.get(o)), (o = Reflect.getPrototypeOf(o));
                (e = void 0 === e ? [] : e.slice(0)), v.set(t, e);
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
let C = null;
function $(t) {
    C = t;
}
class w {
    constructor() {
        (this.index = 0), (this.length = 0), (this.parent = null);
    }
    get event() {
        return C;
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
m.defineProperty(w.prototype, "index"), m.defineProperty(w.prototype, "length");
const F = new w();
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
        const o = f;
        (f = this.needsRefresh ? this : void 0), (this.needsRefresh = !1);
        const i = this.binding(t, e);
        return (f = o), i;
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
                f = void 0;
                const e = o.propertySource[o.propertyName];
                (f = this), t === e && (this.needsRefresh = !0);
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
function H() {
    this.bindingObserver.disconnect(), (this.source = null), (this.context = null);
    const t = this.target.$fastView;
    void 0 !== t && t.isComposed && (t.unbind(), (t.needsBindOnly = !0));
}
function O() {
    this.target.removeEventListener(this.targetName, this, !0),
        (this.source = null),
        (this.context = null);
}
function I(t) {
    s.setAttribute(this.target, this.targetName, t);
}
function L(t) {
    s.setBooleanAttribute(this.target, this.targetName, t);
}
function B(t) {
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
function R(t) {
    this.target[this.targetName] = t;
}
function M(t) {
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
            (this.updateTarget = I);
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
                        (this.updateTarget = R),
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
                        (this.unbind = O);
                    break;
                default:
                    (this.cleanedTargetName = t),
                        "class" === t && (this.updateTarget = M);
            }
    }
    targetAtContent() {
        (this.updateTarget = B), (this.unbind = H);
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
        $(t);
        const e = this.binding(this.source, this.context);
        $(null), !0 !== e && t.preventDefault();
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
function q(t, e, o, i = !1) {
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
function G(t, e) {
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
                    : ((a.textContent = " "), G(s, o)),
                    (e = a),
                    j.targetIndex++,
                    a !== t && i.nextNode();
            }
            j.targetIndex--;
        } else (t.textContent = " "), G(r, o);
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
                (j.locatedDirectives = 0), q(t, e, o, !0);
                const i = t.content,
                    r = [],
                    n = e.length,
                    a = document.createTreeWalker(i, 133, null, !1);
                for (j.targetIndex = -1; j.locatedDirectives < n; ) {
                    const t = a.nextNode();
                    if (null === t) break;
                    switch ((j.targetIndex++, t.nodeType)) {
                        case 1:
                            q(t, e, r);
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
const Q = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
function Y(t, ...e) {
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
            const t = Q.exec(n);
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
class vt {
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
function ft(t) {
    return t
        .map(t => (t instanceof vt ? ft(t.styles) : [t]))
        .reduce((t, e) => t.concat(e), []);
}
function bt(t) {
    return t
        .map(t => (t instanceof vt ? t.behaviors : null))
        .reduce((t, e) => (null === e ? t : (null === t && (t = []), t.concat(e))), null);
}
class gt extends vt {
    constructor(t, e) {
        super(),
            (this.styles = t),
            (this.behaviors = null),
            (this.behaviors = bt(t)),
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
let mt = 0;
class yt extends vt {
    constructor(t) {
        super(),
            (this.styles = t),
            (this.behaviors = null),
            (this.behaviors = bt(t)),
            (this.styleSheets = ft(t)),
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
        n instanceof vt
            ? ("" !== i.trim() && (o.push(i), (i = "")), o.push(n))
            : (i += n);
    }
    return (i += t[t.length - 1]), "" !== i.trim() && o.push(i), xt(o);
}
class Ct {
    constructor(t, e) {
        (this.target = t), (this.propertyName = e);
    }
    bind(t) {
        t[this.propertyName] = this.target;
    }
    unbind() {}
}
function $t(t) {
    return new P("fast-ref", Ct, t);
}
function wt(t, e) {
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
const Tt = Y`
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
    Ht = At || St || Function("return this")(),
    Ot = Ht.Symbol,
    It = Object.prototype,
    Lt = It.hasOwnProperty,
    Bt = It.toString,
    Rt = Ot ? Ot.toStringTag : void 0;
var Mt = Object.prototype.toString;
var Nt = Ot ? Ot.toStringTag : void 0;
function zt(t) {
    return null == t
        ? void 0 === t
            ? "[object Undefined]"
            : "[object Null]"
        : Nt && Nt in Object(t)
        ? (function (t) {
              var e = Lt.call(t, Rt),
                  o = t[Rt];
              try {
                  t[Rt] = void 0;
                  var i = !0;
              } catch (t) {}
              var r = Bt.call(t);
              return i && (e ? (t[Rt] = o) : delete t[Rt]), r;
          })(t)
        : (function (t) {
              return Mt.call(t);
          })(t);
}
function jt(t) {
    return null != t && "object" == typeof t;
}
function _t(t) {
    var e = typeof t;
    return null != t && ("object" == e || "function" == e);
}
var Vt = /^\s+|\s+$/g,
    qt = /^[-+]0x[0-9a-f]+$/i,
    Gt = /^0b[01]+$/i,
    Wt = /^0o[0-7]+$/i,
    Ut = parseInt;
function Kt(t) {
    if ("number" == typeof t) return t;
    if (
        (function (t) {
            return "symbol" == typeof t || (jt(t) && "[object Symbol]" == zt(t));
        })(t)
    )
        return NaN;
    if (_t(t)) {
        var e = "function" == typeof t.valueOf ? t.valueOf() : t;
        t = _t(e) ? e + "" : e;
    }
    if ("string" != typeof t) return 0 === t ? t : +t;
    t = t.replace(Vt, "");
    var o = Gt.test(t);
    return o || Wt.test(t) ? Ut(t.slice(2), o ? 2 : 8) : qt.test(t) ? NaN : +t;
}
function Xt(t) {
    return t
        ? (t = Kt(t)) === 1 / 0 || t === -1 / 0
            ? 17976931348623157e292 * (t < 0 ? -1 : 1)
            : t == t
            ? t
            : 0
        : 0 === t
        ? t
        : 0;
}
function Qt(t) {
    if (!_t(t)) return !1;
    var e = zt(t);
    return (
        "[object Function]" == e ||
        "[object GeneratorFunction]" == e ||
        "[object AsyncFunction]" == e ||
        "[object Proxy]" == e
    );
}
var Yt,
    Zt = Ht["__core-js_shared__"],
    Jt = (Yt = /[^.]+$/.exec((Zt && Zt.keys && Zt.keys.IE_PROTO) || ""))
        ? "Symbol(src)_1." + Yt
        : "";
var te = Function.prototype.toString;
var ee = /^\[object .+?Constructor\]$/,
    oe = Function.prototype,
    ie = Object.prototype,
    re = oe.toString,
    ne = ie.hasOwnProperty,
    se = RegExp(
        "^" +
            re
                .call(ne)
                .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
                .replace(
                    /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                    "$1.*?"
                ) +
            "$"
    );
function ae(t) {
    return (
        !(!_t(t) || ((e = t), Jt && Jt in e)) &&
        (Qt(t) ? se : ee).test(
            (function (t) {
                if (null != t) {
                    try {
                        return te.call(t);
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
function le(t, e) {
    var o = (function (t, e) {
        return null == t ? void 0 : t[e];
    })(t, e);
    return ae(o) ? o : void 0;
}
var ce = le(Object, "create");
var de = Object.prototype.hasOwnProperty;
var he = Object.prototype.hasOwnProperty;
function ue(t) {
    var e = -1,
        o = null == t ? 0 : t.length;
    for (this.clear(); ++e < o; ) {
        var i = t[e];
        this.set(i[0], i[1]);
    }
}
function pe(t, e) {
    for (var o, i, r = t.length; r--; )
        if ((o = t[r][0]) === (i = e) || (o != o && i != i)) return r;
    return -1;
}
(ue.prototype.clear = function () {
    (this.__data__ = ce ? ce(null) : {}), (this.size = 0);
}),
    (ue.prototype.delete = function (t) {
        var e = this.has(t) && delete this.__data__[t];
        return (this.size -= e ? 1 : 0), e;
    }),
    (ue.prototype.get = function (t) {
        var e = this.__data__;
        if (ce) {
            var o = e[t];
            return "__lodash_hash_undefined__" === o ? void 0 : o;
        }
        return de.call(e, t) ? e[t] : void 0;
    }),
    (ue.prototype.has = function (t) {
        var e = this.__data__;
        return ce ? void 0 !== e[t] : he.call(e, t);
    }),
    (ue.prototype.set = function (t, e) {
        var o = this.__data__;
        return (
            (this.size += this.has(t) ? 0 : 1),
            (o[t] = ce && void 0 === e ? "__lodash_hash_undefined__" : e),
            this
        );
    });
var ve = Array.prototype.splice;
function fe(t) {
    var e = -1,
        o = null == t ? 0 : t.length;
    for (this.clear(); ++e < o; ) {
        var i = t[e];
        this.set(i[0], i[1]);
    }
}
(fe.prototype.clear = function () {
    (this.__data__ = []), (this.size = 0);
}),
    (fe.prototype.delete = function (t) {
        var e = this.__data__,
            o = pe(e, t);
        return (
            !(o < 0) && (o == e.length - 1 ? e.pop() : ve.call(e, o, 1), --this.size, !0)
        );
    }),
    (fe.prototype.get = function (t) {
        var e = this.__data__,
            o = pe(e, t);
        return o < 0 ? void 0 : e[o][1];
    }),
    (fe.prototype.has = function (t) {
        return pe(this.__data__, t) > -1;
    }),
    (fe.prototype.set = function (t, e) {
        var o = this.__data__,
            i = pe(o, t);
        return i < 0 ? (++this.size, o.push([t, e])) : (o[i][1] = e), this;
    });
var be = le(Ht, "Map");
function ge(t, e) {
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
function me(t) {
    var e = -1,
        o = null == t ? 0 : t.length;
    for (this.clear(); ++e < o; ) {
        var i = t[e];
        this.set(i[0], i[1]);
    }
}
(me.prototype.clear = function () {
    (this.size = 0),
        (this.__data__ = { hash: new ue(), map: new (be || fe)(), string: new ue() });
}),
    (me.prototype.delete = function (t) {
        var e = ge(this, t).delete(t);
        return (this.size -= e ? 1 : 0), e;
    }),
    (me.prototype.get = function (t) {
        return ge(this, t).get(t);
    }),
    (me.prototype.has = function (t) {
        return ge(this, t).has(t);
    }),
    (me.prototype.set = function (t, e) {
        var o = ge(this, t),
            i = o.size;
        return o.set(t, e), (this.size += o.size == i ? 0 : 1), this;
    });
function ye(t, e) {
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
    return (o.cache = new (ye.Cache || me)()), o;
}
ye.Cache = me;
var xe = Math.max,
    ke = Math.min;
function Ce(t, e, o) {
    return (
        (e = Xt(e)),
        void 0 === o ? ((o = e), (e = 0)) : (o = Xt(o)),
        (function (t, e, o) {
            return t >= ke(e, o) && t < xe(e, o);
        })((t = Kt(t)), e, o)
    );
}
let $e;
var we;
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
})(we || (we = {}));
var Fe, De;
function Te(t, e, o) {
    return o < t ? e : o > e ? t : o;
}
!(function (t) {
    (t.ltr = "ltr"), (t.rtl = "rtl");
})(Fe || (Fe = {})),
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
    })(De || (De = {}));
class Pe {
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
const Ee = Y`
    <span class="end" part="end" ${$t("endContainer")}>
        <slot
            name="end"
            ${$t("end")}
            @slotchange=${t => t.handleEndContentChange()}
        ></slot>
    </span>
`,
    Ae = Y`
    <span class="start" part="start" ${$t("startContainer")}>
        <slot
            name="start"
            ${$t("start")}
            @slotchange=${t => t.handleStartContentChange()}
        ></slot>
    </span>
`;
function Se(t, ...e) {
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
class He extends dt {
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
var Oe;
Pt(
    [et({ attribute: "heading-level", mode: "fromView", converter: J })],
    He.prototype,
    "headinglevel",
    void 0
),
    Pt([et({ mode: "boolean" })], He.prototype, "expanded", void 0),
    Pt([et], He.prototype, "id", void 0),
    Se(He, Pe),
    (function (t) {
        (t.single = "single"), (t.multi = "multi");
    })(Oe || (Oe = {}));
class Ie extends dt {
    constructor() {
        super(...arguments),
            (this.expandmode = Oe.multi),
            (this.activeItemIndex = 0),
            (this.change = () => {
                this.$emit("change");
            }),
            (this.setItems = () => {
                (this.accordionIds = this.getItemIds()),
                    this.accordionItems.forEach((t, e) => {
                        t instanceof He &&
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
        return this.expandmode === Oe.single;
    }
    adjust(t) {
        (this.activeItemIndex = Te(
            0,
            this.accordionItems.length - 1,
            this.activeItemIndex + t
        )),
            this.focusItem();
    }
    focusItem() {
        const t = this.accordionItems[this.activeItemIndex];
        t instanceof He && t.expandbutton.focus();
    }
}
Pt([et({ attribute: "expand-mode" })], Ie.prototype, "expandmode", void 0),
    Pt([k], Ie.prototype, "accordionItems", void 0);
const Le = Y`
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
            ${Ae}
            <span class="content" part="content">
                <slot></slot>
            </span>
            ${Ee}
        </a>
    </template>
`;
class Be extends dt {
    constructor() {
        super(...arguments), (this.appearance = "neutral");
    }
}
Pt([et], Be.prototype, "appearance", void 0),
    Pt([et], Be.prototype, "download", void 0),
    Pt([et], Be.prototype, "href", void 0),
    Pt([et], Be.prototype, "hreflang", void 0),
    Pt([et], Be.prototype, "ping", void 0),
    Pt([et], Be.prototype, "referrerpolicy", void 0),
    Pt([et], Be.prototype, "rel", void 0),
    Pt([et], Be.prototype, "target", void 0),
    Pt([et], Be.prototype, "type", void 0),
    Se(Be, Pe);
const Re = Y`
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
class Me extends dt {}
Pt([et({ attribute: "fill" })], Me.prototype, "fill", void 0),
    Pt([et({ attribute: "color" })], Me.prototype, "color", void 0),
    Pt([et({ mode: "boolean" })], Me.prototype, "circular", void 0);
const Ne = Y`
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
            ${Ae}
            <span class="content" part="content">
                <slot></slot>
            </span>
            ${Ee}
        </button>
    </template>
`,
    ze = "ElementInternals" in window;
class je extends dt {
    constructor() {
        super(),
            (this.value = ""),
            (this.disabled = !1),
            (this.required = !1),
            (this.proxyEventsToBlock = ["change", "click"]),
            ze && (this.elementInternals = this.attachInternals());
    }
    static get formAssociated() {
        return ze;
    }
    get validity() {
        return ze ? this.elementInternals.validity : this.proxy.validity;
    }
    get form() {
        return ze ? this.elementInternals.form : this.proxy.form;
    }
    get validationMessage() {
        return ze
            ? this.elementInternals.validationMessage
            : this.proxy.validationMessage;
    }
    get willValidate() {
        return ze ? this.elementInternals.willValidate : this.proxy.willValidate;
    }
    get labels() {
        if (ze) return Object.freeze(Array.from(this.elementInternals.labels));
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
            ze ||
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
        return ze ? this.elementInternals.checkValidity() : this.proxy.checkValidity();
    }
    reportValidity() {
        return ze ? this.elementInternals.reportValidity() : this.proxy.reportValidity();
    }
    setValidity(t, e, o) {
        ze
            ? this.elementInternals.setValidity(t, e, o)
            : "string" == typeof e && this.proxy.setCustomValidity(e);
    }
    formDisabledCallback(t) {
        this.disabled = t;
    }
    setFormValue(t, e) {
        ze && this.elementInternals.setFormValue(t, e);
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
Pt([et], je.prototype, "value", void 0),
    Pt([et({ mode: "boolean" })], je.prototype, "disabled", void 0),
    Pt([et], je.prototype, "name", void 0),
    Pt([et({ mode: "boolean" })], je.prototype, "required", void 0);
class _e extends je {
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
Pt([et], _e.prototype, "appearance", void 0),
    Pt([et({ mode: "boolean" })], _e.prototype, "autofocus", void 0),
    Pt([et({ attribute: "form" })], _e.prototype, "formId", void 0),
    Pt([et], _e.prototype, "formaction", void 0),
    Pt([et], _e.prototype, "formenctype", void 0),
    Pt([et], _e.prototype, "formmethod", void 0),
    Pt([et({ mode: "boolean" })], _e.prototype, "formnovalidate", void 0),
    Pt([et], _e.prototype, "formtarget", void 0),
    Pt([et], _e.prototype, "name", void 0),
    Pt([et], _e.prototype, "type", void 0),
    Se(_e, Pe);
const Ve = Y`<slot></slot>`;
class qe extends dt {}
const Ge = Y`
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
class We extends je {
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
function Ue(t, e, o) {
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
function Ke(t) {
    const e = t.parentElement;
    if (e) return e;
    {
        const e = t.getRootNode();
        if (e.host instanceof HTMLElement) return e.host;
    }
    return null;
}
Pt([et({ attribute: "readonly", mode: "boolean" })], We.prototype, "readOnly", void 0),
    Pt(
        [et({ attribute: "checked", mode: "boolean" })],
        We.prototype,
        "checkedAttribute",
        void 0
    ),
    Pt([k], We.prototype, "defaultSlottedNodes", void 0),
    Pt([k], We.prototype, "defaultChecked", void 0),
    Pt([k], We.prototype, "checked", void 0),
    Pt([k], We.prototype, "indeterminate", void 0);
const Xe = (function (t) {
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
function Qe(t) {
    return `\n        \n    :host([hidden]) {\n        display: none;\n    }\n :host {\n            display: ${t};\n        }\n    `;
}
const Ye = (function () {
        if (!0 === (t = $e) || !1 === t || (jt(t) && "[object Boolean]" == zt(t)))
            return $e;
        var t;
        if (
            "undefined" == typeof window ||
            !window.document ||
            !window.document.createElement
        )
            return ($e = !1), $e;
        const e = document.createElement("style");
        document.head.appendChild(e);
        try {
            e.sheet.insertRule("foo:focus-visible {color:inherit}", 0), ($e = !0);
        } catch (t) {
            $e = !1;
        } finally {
            document.head.removeChild(e);
        }
        return $e;
    })()
        ? "focus-visible"
        : "focus",
    Ze = "adoptedStyleSheets" in window.ShadowRoot.prototype;
function Je(t) {
    const e = t.provider;
    return null != e && eo.isDesignSystemProvider(e);
}
const to = {
    bind(t) {
        t.provider = eo.findProvider(t);
    },
    unbind(t) {},
};
class eo extends dt {
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
            Ze && null !== this.shadowRoot)
        ) {
            const t = new CSSStyleSheet();
            t.insertRule(":host{}"),
                (this.shadowRoot.adoptedStyleSheets = [
                    ...this.shadowRoot.adoptedStyleSheets,
                    t,
                ]),
                (this.customPropertyTarget = t.rules[0].style);
        } else this.customPropertyTarget = this.style;
        this.$fastController.addBehaviors([to]);
    }
    static get tagNames() {
        return eo._tagNames;
    }
    static isDesignSystemProvider(t) {
        return t.isDesignSystemProvider || -1 !== eo.tagNames.indexOf(t.tagName);
    }
    static findProvider(t) {
        if (Je(t)) return t.provider;
        let e = Ke(t);
        for (; null !== e; ) {
            if (eo.isDesignSystemProvider(e)) return (t.provider = e), e;
            if (Je(e)) return (t.provider = e.provider), e.provider;
            e = Ke(e);
        }
        return null;
    }
    static registerTagName(t) {
        const e = t.toUpperCase();
        -1 === eo.tagNames.indexOf(e) && eo._tagNames.push(e);
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
                eo.isDesignSystemProvider(e) &&
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
function oo(t) {
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
(eo._tagNames = []),
    Pt(
        [et({ attribute: "use-defaults", mode: "boolean" })],
        eo.prototype,
        "useDefaults",
        void 0
    ),
    Pt([k], eo.prototype, "provider", void 0);
const io = Y`<slot></slot>`,
    ro = Y`
    <div class="positioning-region" part="positioning-region">
        ${wt(
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
            ${$t("dialog")}
        >
            <slot></slot>
        </div>
    </div>
`;
var no = [
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
    so = no.join(","),
    ao =
        "undefined" == typeof Element
            ? function () {}
            : Element.prototype.matches ||
              Element.prototype.msMatchesSelector ||
              Element.prototype.webkitMatchesSelector;
function lo(t, e) {
    e = e || {};
    var o,
        i,
        r,
        n = [],
        s = [],
        a = t.querySelectorAll(so);
    for (
        e.includeContainer &&
            ao.call(t, so) &&
            (a = Array.prototype.slice.apply(a)).unshift(t),
            o = 0;
        o < a.length;
        o++
    )
        co((i = a[o])) &&
            (0 === (r = po(i))
                ? n.push(i)
                : s.push({ documentOrder: o, tabIndex: r, node: i }));
    return s
        .sort(vo)
        .map(function (t) {
            return t.node;
        })
        .concat(n);
}
function co(t) {
    return !(
        !ho(t) ||
        (function (t) {
            return (
                (function (t) {
                    return fo(t) && "radio" === t.type;
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
        po(t) < 0
    );
}
function ho(t) {
    return !(
        t.disabled ||
        (function (t) {
            return fo(t) && "hidden" === t.type;
        })(t) ||
        (function (t) {
            return null === t.offsetParent || "hidden" === getComputedStyle(t).visibility;
        })(t)
    );
}
(lo.isTabbable = function (t) {
    if (!t) throw new Error("No node provided");
    return !1 !== ao.call(t, so) && co(t);
}),
    (lo.isFocusable = function (t) {
        if (!t) throw new Error("No node provided");
        return !1 !== ao.call(t, uo) && ho(t);
    });
var uo = no.concat("iframe").join(",");
function po(t) {
    var e = parseInt(t.getAttribute("tabindex"), 10);
    return isNaN(e)
        ? (function (t) {
              return "true" === t.contentEditable;
          })(t)
            ? 0
            : t.tabIndex
        : e;
}
function vo(t, e) {
    return t.tabIndex === e.tabIndex
        ? t.documentOrder - e.documentOrder
        : t.tabIndex - e.tabIndex;
}
function fo(t) {
    return "INPUT" === t.tagName;
}
var bo = lo;
class go extends dt {
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
            (this.tabbableElements = bo(this)),
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
        t.length && (this.tabbableElements = bo(this));
    }
    isDialogHidden() {
        return "boolean" != typeof this.hidden;
    }
    shouldDialogTrapFocus() {
        return "boolean" == typeof this.trapFocus;
    }
}
Pt([et({ mode: "boolean" })], go.prototype, "modal", void 0),
    Pt([et({ mode: "boolean" })], go.prototype, "hidden", void 0),
    Pt(
        [et({ attribute: "trap-focus", mode: "boolean" })],
        go.prototype,
        "trapFocus",
        void 0
    ),
    Pt([et({ attribute: "aria-describedby" })], go.prototype, "ariaDescribedby", void 0),
    Pt([et({ attribute: "aria-labelledby" })], go.prototype, "ariaLabelledby", void 0),
    Pt([et({ attribute: "aria-label" })], go.prototype, "ariaLabel", void 0);
const mo = Y`<template role=${t => t.role}></template>`;
var yo, xo;
!(function (t) {
    (t.separator = "separator"), (t.presentation = "presentation");
})(yo || (yo = {}));
class ko extends dt {
    constructor() {
        super(...arguments), (this.role = yo.separator);
    }
}
Pt([et], ko.prototype, "role", void 0),
    (function (t) {
        (t.next = "next"), (t.previous = "previous");
    })(xo || (xo = {}));
class Co extends dt {
    constructor() {
        super(...arguments), (this.hiddenFromAT = !0), (this.direction = xo.next);
    }
}
Pt([et({ mode: "boolean" })], Co.prototype, "disabled", void 0),
    Pt(
        [et({ attribute: "aria-hidden", mode: "fromView", converter: Z })],
        Co.prototype,
        "hiddenFromAT",
        void 0
    ),
    Pt([et], Co.prototype, "direction", void 0);
const $o = Y`
    <template
        role="button"
        aria-disabled="${t => !!t.disabled || void 0}"
        tabindex="${t => (t.hiddenFromAT ? -1 : 0)}"
        class="${t => t.direction} ${t => (t.disabled ? "disabled" : "")}"
    >
        ${wt(
            t => t.direction === xo.next,
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
        ${wt(
            t => t.direction === xo.previous,
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
`;
class wo extends dt {}
Pt([et({ converter: J })], wo.prototype, "value", void 0),
    Pt([et({ converter: J })], wo.prototype, "min", void 0),
    Pt([et({ converter: J })], wo.prototype, "max", void 0),
    Pt([et({ mode: "boolean" })], wo.prototype, "paused", void 0);
const Fo = Y`
    <template
        role="progressbar"
        aria-valuenow="${t => t.value}"
        aria-valuemin="${t => t.min}"
        aria-valuemax="${t => t.max}"
        class="${t => (t.paused ? "paused" : "")}"
    >
        ${wt(
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
        ${wt(
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
    Do = Y`
    <template
        role="progressbar"
        aria-valuenow="${t => t.value}"
        aria-valuemin="${t => t.min}"
        aria-valuemax="${t => t.max}"
        class="${t => (t.paused ? "paused" : "")}"
    >
        ${wt(
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
        ${wt(
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
    To = Y`
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
class Po extends je {
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
Pt([et({ attribute: "readonly", mode: "boolean" })], Po.prototype, "readOnly", void 0),
    Pt([et], Po.prototype, "name", void 0),
    Pt(
        [et({ attribute: "checked", mode: "boolean" })],
        Po.prototype,
        "checkedAttribute",
        void 0
    ),
    Pt([k], Po.prototype, "defaultSlottedNodes", void 0),
    Pt([k], Po.prototype, "defaultChecked", void 0),
    Pt([k], Po.prototype, "checked", void 0);
const Eo = Y`
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
class Ao extends dt {
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
Pt([et({ attribute: "readonly", mode: "boolean" })], Ao.prototype, "readOnly", void 0),
    Pt(
        [et({ attribute: "disabled", mode: "boolean" })],
        Ao.prototype,
        "disabled",
        void 0
    ),
    Pt([et], Ao.prototype, "name", void 0),
    Pt([et], Ao.prototype, "value", void 0),
    Pt([et], Ao.prototype, "orientation", void 0),
    Pt([k], Ao.prototype, "slottedRadioButtons", void 0);
const So = Y`
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
            <div ${$t("track")} part="track-container" class="track">
                <slot name="track"></slot>
            </div>
            <div></div>
            <slot></slot>
            <div
                ${$t("thumb")}
                part="thumb-container"
                class="thumb-container"
                style=${t => t.position}
            >
                <slot name="thumb"><div class="thumb-cursor"></div></slot>
            </div>
        </div>
    </template>
`;
function Ho(t, e, o, i) {
    let r = ((n = 0), (s = 1), (a = (t - e) / (o - e)), Math.min(Math.max(a, n), s));
    var n, s, a;
    return i === Fe.rtl && (r = 1 - r), r;
}
var Oo;
!(function (t) {
    t.singleValue = "single-value";
})(Oo || (Oo = {}));
class Io extends je {
    constructor() {
        super(),
            (this.direction = Fe.ltr),
            (this.isDragging = !1),
            (this.trackWidth = 0),
            (this.trackMinWidth = 0),
            (this.trackHeight = 0),
            (this.trackMinHeight = 0),
            (this.min = 0),
            (this.max = 10),
            (this.step = 1),
            (this.orientation = Et.horizontal),
            (this.mode = Oo.singleValue),
            (this.proxy = document.createElement("input")),
            (this.increment = () => {
                const t =
                        this.direction !== Fe.rtl && this.orientation !== Et.vertical
                            ? Number(this.value) + Number(this.step)
                            : Number(this.value) - Number(this.step),
                    e = this.convertToConstrainedValue(t),
                    o = e < Number(this.max) ? "" + e : "" + this.max;
                (this.value = o), this.updateForm();
            }),
            (this.decrement = () => {
                const t =
                        this.direction !== Fe.rtl && this.orientation !== Et.vertical
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
                    (1 - Ho(Number(this.value), Number(this.min), Number(this.max), t));
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
                    t && "rtl" === t.dir && this.setThumbPositionForOrientation(Fe.rtl),
                    null !== t && "rtl" === t.dir ? Fe.rtl : Fe.ltr
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
                const e = Ho(
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
Pt([et({ attribute: "readonly", mode: "boolean" })], Io.prototype, "readOnly", void 0),
    Pt([k], Io.prototype, "direction", void 0),
    Pt([k], Io.prototype, "isDragging", void 0),
    Pt([k], Io.prototype, "position", void 0),
    Pt([k], Io.prototype, "trackWidth", void 0),
    Pt([k], Io.prototype, "trackMinWidth", void 0),
    Pt([k], Io.prototype, "trackHeight", void 0),
    Pt([k], Io.prototype, "trackMinHeight", void 0),
    Pt([et({ converter: J })], Io.prototype, "min", void 0),
    Pt([et({ converter: J })], Io.prototype, "max", void 0),
    Pt([et({ converter: J })], Io.prototype, "step", void 0),
    Pt([et], Io.prototype, "orientation", void 0),
    Pt([et], Io.prototype, "mode", void 0);
const Lo = Y`
    <template
        aria-disabled="${t => t.disabled}"
        class="${t => t.sliderOrientation || Et.horizontal} 
            ${t => (t.disabled ? "disabled" : "")}"
    >
        <div ${$t("root")} part="root" class="root" style=${t => t.positionStyle}>
            <div class="container">
                ${wt(t => !t.hideMark, Y` <div class="mark"></div> `)}
                <div class="label">
                    <slot> </slot>
                </div>
            </div>
        </div>
    </template>
`,
    Bo = { min: 0, max: 0, direction: Fe.ltr, orientation: Et.horizontal, disabled: !1 };
class Ro extends dt {
    constructor() {
        super(...arguments),
            (this.hideMark = !1),
            (this.sliderDirection = Fe.ltr),
            (this.getSliderConfiguration = () => {
                if (this.isSliderConfig(this.parentNode)) {
                    const t = this.parentNode,
                        { min: e, max: o, direction: i, orientation: r, disabled: n } = t;
                    void 0 !== n && (this.disabled = n),
                        (this.sliderDirection = i || Fe.ltr),
                        (this.sliderOrientation = r || Et.horizontal),
                        (this.sliderMaxPosition = o),
                        (this.sliderMinPosition = e);
                } else
                    (this.sliderDirection = Bo.direction || Fe.ltr),
                        (this.sliderOrientation = Bo.orientation || Et.horizontal),
                        (this.sliderMaxPosition = Bo.max),
                        (this.sliderMinPosition = Bo.min);
            }),
            (this.positionAsStyle = () => {
                const t = this.sliderDirection ? this.sliderDirection : Fe.ltr,
                    e = Ho(
                        Number(this.position),
                        Number(this.sliderMinPosition),
                        Number(this.sliderMaxPosition)
                    );
                let o = Math.round(100 * (1 - e)),
                    i = Math.round(100 * e);
                return (
                    i === Number.NaN && o === Number.NaN && ((o = 50), (i = 50)),
                    this.sliderOrientation === Et.horizontal
                        ? t === Fe.rtl
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
Pt([k], Ro.prototype, "positionStyle", void 0),
    Pt([et], Ro.prototype, "position", void 0),
    Pt(
        [et({ attribute: "hide-mark", mode: "boolean" })],
        Ro.prototype,
        "hideMark",
        void 0
    ),
    Pt(
        [et({ attribute: "disabled", mode: "boolean" })],
        Ro.prototype,
        "disabled",
        void 0
    ),
    Pt([k], Ro.prototype, "sliderOrientation", void 0),
    Pt([k], Ro.prototype, "sliderMinPosition", void 0),
    Pt([k], Ro.prototype, "sliderMaxPosition", void 0),
    Pt([k], Ro.prototype, "sliderDirection", void 0);
const Mo = Y`
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
class No extends je {
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
Pt([et({ attribute: "readonly", mode: "boolean" })], No.prototype, "readOnly", void 0),
    Pt([et], No.prototype, "value", void 0),
    Pt(
        [et({ attribute: "checked", mode: "boolean" })],
        No.prototype,
        "checkedAttribute",
        void 0
    ),
    Pt([k], No.prototype, "defaultSlottedNodes", void 0),
    Pt([k], No.prototype, "defaultChecked", void 0),
    Pt([k], No.prototype, "checked", void 0);
const zo = Y`
    <template role="tabs" class="${t => t.orientation}">
        ${Ae}
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${Dt("tabs")}></slot>

            ${wt(
                t => t.activeindicator,
                Y`
                    <div
                        ${$t("activeIndicatorRef")}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `
            )}
        </div>
        ${Ee}
        <div class="tabpanel">
            <slot name="tabpanel" part="tabpanel" ${Dt("tabpanels")}></slot>
        </div>
    </template>
`;
var jo;
!(function (t) {
    (t.vertical = "vertical"), (t.horizontal = "horizontal");
})(jo || (jo = {}));
class _o extends dt {
    constructor() {
        super(),
            (this.orientation = jo.horizontal),
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
        return this.orientation === jo.horizontal;
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
            (this.activeTabIndex = Te(0, this.tabs.length - 1, this.activeTabIndex + t)),
            this.setComponent();
    }
    focusTab() {
        this.tabs[this.activeTabIndex].focus();
    }
}
Pt([et], _o.prototype, "orientation", void 0),
    Pt([et], _o.prototype, "activeid", void 0),
    Pt([k], _o.prototype, "tabs", void 0),
    Pt([k], _o.prototype, "tabpanels", void 0),
    Pt([et({ mode: "boolean" })], _o.prototype, "activeindicator", void 0),
    Pt([k], _o.prototype, "activeIndicatorRef", void 0),
    Se(_o, Pe);
const Vo = Y`
    <template slot="tab" role="tab">
        <slot></slot>
    </template>
`;
class qo extends dt {}
const Go = Y`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`;
class Wo extends dt {}
var Uo, Ko;
!(function (t) {
    (t.filled = "filled"), (t.outline = "outline");
})(Uo || (Uo = {})),
    (function (t) {
        (t.none = "none"),
            (t.both = "both"),
            (t.horizontal = "horizontal"),
            (t.vertical = "vertical");
    })(Ko || (Ko = {}));
class Xo extends je {
    constructor() {
        super(...arguments),
            (this.appearance = Uo.outline),
            (this.resize = Ko.none),
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
Pt([et], Xo.prototype, "appearance", void 0),
    Pt([et({ mode: "boolean" })], Xo.prototype, "readOnly", void 0),
    Pt([et], Xo.prototype, "resize", void 0),
    Pt([et({ mode: "boolean" })], Xo.prototype, "autofocus", void 0),
    Pt([et({ converter: J, mode: "fromView" })], Xo.prototype, "cols", void 0),
    Pt([et({ attribute: "form" })], Xo.prototype, "formId", void 0),
    Pt([et], Xo.prototype, "list", void 0),
    Pt([et({ converter: J })], Xo.prototype, "maxlength", void 0),
    Pt([et({ converter: J })], Xo.prototype, "minlength", void 0),
    Pt([et], Xo.prototype, "name", void 0),
    Pt([et], Xo.prototype, "placeholder", void 0),
    Pt([et({ converter: J, mode: "fromView" })], Xo.prototype, "rows", void 0),
    Pt([et({ mode: "boolean" })], Xo.prototype, "spellcheck", void 0),
    Pt([k], Xo.prototype, "defaultSlottedNodes", void 0);
const Qo = Y`
    <template
        class="
            ${t => t.appearance}
            ${t => (t.readOnly ? "readonly" : "")}
            ${t => (t.resize !== Ko.none ? "resize-" + t.resize : "")}"
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
            ${$t("textarea")}
        ></textarea>
    </template>
`,
    Yo = Y`
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
            ${Ae}
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
                ${$t("control")}
            />
            ${Ee}
        </div>
    </template>
`;
var Zo, Jo;
!(function (t) {
    (t.filled = "filled"), (t.outline = "outline");
})(Zo || (Zo = {})),
    (function (t) {
        (t.email = "email"),
            (t.password = "password"),
            (t.tel = "tel"),
            (t.text = "text"),
            (t.url = "url");
    })(Jo || (Jo = {}));
class ti extends je {
    constructor() {
        super(),
            (this.appearance = Zo.outline),
            (this.type = Jo.text),
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
function ei(t) {
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
Pt([et], ti.prototype, "appearance", void 0),
    Pt(
        [et({ attribute: "readonly", mode: "boolean" })],
        ti.prototype,
        "readOnly",
        void 0
    ),
    Pt([et({ mode: "boolean" })], ti.prototype, "autofocus", void 0),
    Pt([et], ti.prototype, "placeholder", void 0),
    Pt([et], ti.prototype, "type", void 0),
    Pt([et], ti.prototype, "list", void 0),
    Pt([et({ converter: J })], ti.prototype, "maxlength", void 0),
    Pt([et({ converter: J })], ti.prototype, "minlength", void 0),
    Pt([et], ti.prototype, "pattern", void 0),
    Pt([et({ converter: J })], ti.prototype, "size", void 0),
    Pt([et({ mode: "boolean" })], ti.prototype, "spellcheck", void 0),
    Pt([k], ti.prototype, "defaultSlottedNodes", void 0),
    Se(ti, Pe);
const oi = ei((t, e) => t + e),
    ii = ei((t, e) => t - e),
    ri = ei((t, e) => t * e);
function ni(...t) {
    return oi.apply(this, t);
}
function si(...t) {
    return ii.apply(this, t);
}
function ai(...t) {
    return ri.apply(this, t);
}
function li(t, e, o) {
    return isNaN(t) || t <= e ? e : t >= o ? o : t;
}
function ci(t, e, o) {
    return isNaN(t) || t <= e ? 0 : t >= o ? 1 : t / (o - e);
}
function di(t, e, o) {
    return isNaN(t) ? e : e + t * (o - e);
}
function hi(t, e) {
    const o = Math.pow(10, e);
    return Math.round(t * o) / o;
}
class ui {
    static fromObject(t) {
        return !t || isNaN(t.r) || isNaN(t.g) || isNaN(t.b)
            ? null
            : new ui(t.r, t.g, t.b, t.a);
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
        return `rgb(${Math.round(di(this.r, 0, 255))},${Math.round(
            di(this.g, 0, 255)
        )},${Math.round(di(this.b, 0, 255))})`;
    }
    toStringWebRGBA() {
        return `rgba(${Math.round(di(this.r, 0, 255))},${Math.round(
            di(this.g, 0, 255)
        )},${Math.round(di(this.b, 0, 255))},${li(this.a, 0, 1)})`;
    }
    roundToPrecision(t) {
        return new ui(hi(this.r, t), hi(this.g, t), hi(this.b, t), hi(this.a, t));
    }
    clamp() {
        return new ui(
            li(this.r, 0, 1),
            li(this.g, 0, 1),
            li(this.b, 0, 1),
            li(this.a, 0, 1)
        );
    }
    toObject() {
        return { r: this.r, g: this.g, b: this.b, a: this.a };
    }
    formatHexValue(t) {
        return (function (t) {
            const e = Math.round(li(t, 0, 255)).toString(16);
            return 1 === e.length ? "0" + e : e;
        })(di(t, 0, 255));
    }
}
function pi(t) {
    function e(t) {
        return t <= 0.03928 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
    }
    return (function (t) {
        return 0.2126 * t.r + 0.7152 * t.g + 0.0722 * t.b;
    })(new ui(e(t.r), e(t.g), e(t.b), 1));
}
const vi = (t, e) => (t + 0.05) / (e + 0.05);
const fi = /^rgb\(\s*((?:(?:25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*,\s*){2}(?:25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*)\)$/i,
    bi = /^#((?:[0-9a-f]{6}|[0-9a-f]{3}))$/i;
function gi(t) {
    const e = bi.exec(t);
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
        : new ui(
              ci((16711680 & i) >>> 16, 0, 255),
              ci((65280 & i) >>> 8, 0, 255),
              ci(255 & i, 0, 255),
              1
          );
}
const mi = "#FFFFFF",
    yi = { steps: 94, clipLight: 0, clipDark: 0 },
    xi =
        (Object.assign({}, yi),
        Object.assign({}, yi, { baseColor: gi("#0078D4") }),
        {
            backgroundColor: mi,
            contrast: 0,
            density: 0,
            designUnit: 4,
            baseHeightMultiplier: 8,
            baseHorizontalSpacingMultiplier: 3,
            direction: Fe.ltr,
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
function ki(t, e) {
    return Qt(t) ? t(e) : t;
}
function Ci(t) {
    return e => (e && void 0 !== e[t] ? e[t] : xi[t]);
}
const $i = Ci("backgroundColor"),
    wi = Ci("accentBaseColor"),
    Fi = Ci("neutralPalette"),
    Di = Ci("accentPalette"),
    Ti = Ci("accentFillHoverDelta"),
    Pi = Ci("accentFillActiveDelta"),
    Ei = Ci("accentFillFocusDelta"),
    Ai = Ci("accentFillSelectedDelta"),
    Si = Ci("accentForegroundRestDelta"),
    Hi = Ci("accentForegroundHoverDelta"),
    Oi = Ci("accentForegroundActiveDelta"),
    Ii = Ci("accentForegroundFocusDelta"),
    Li = Ci("neutralFillRestDelta"),
    Bi = Ci("neutralFillHoverDelta"),
    Ri = Ci("neutralFillActiveDelta"),
    Mi = Ci("neutralFillFocusDelta"),
    Ni = Ci("neutralFillSelectedDelta"),
    zi = Ci("neutralFillInputRestDelta"),
    ji = Ci("neutralFillInputHoverDelta"),
    _i = Ci("neutralFillInputActiveDelta"),
    Vi = Ci("neutralFillInputFocusDelta"),
    qi = Ci("neutralFillInputSelectedDelta"),
    Gi = Ci("neutralFillStealthRestDelta"),
    Wi = Ci("neutralFillStealthHoverDelta"),
    Ui = Ci("neutralFillStealthActiveDelta"),
    Ki = Ci("neutralFillStealthFocusDelta"),
    Xi = Ci("neutralFillStealthSelectedDelta"),
    Qi = Ci("neutralFillToggleHoverDelta"),
    Yi = Ci("neutralFillToggleActiveDelta"),
    Zi = Ci("neutralFillToggleFocusDelta"),
    Ji = Ci("baseLayerLuminance"),
    tr = Ci("neutralFillCardDelta"),
    er = Ci("neutralForegroundHoverDelta"),
    or = Ci("neutralForegroundActiveDelta"),
    ir = Ci("neutralForegroundFocusDelta"),
    rr = Ci("neutralDividerRestDelta"),
    nr = Ci("neutralOutlineRestDelta"),
    sr = Ci("neutralOutlineHoverDelta"),
    ar = Ci("neutralOutlineActiveDelta"),
    lr = Ci("neutralOutlineFocusDelta");
var cr;
function dr(t) {
    const e = ye(t);
    return function (t) {
        return "function" == typeof t
            ? o => e(Object.assign({}, o, { backgroundColor: t(o) }))
            : e(t);
    };
}
function hr(t, e) {
    const o = ye(e);
    return e =>
        "function" == typeof e
            ? i => o(Object.assign({}, i, { backgroundColor: e(i) }))[t]
            : o(e)[t];
}
!(function (t) {
    (t.rest = "rest"),
        (t.hover = "hover"),
        (t.active = "active"),
        (t.focus = "focus"),
        (t.selected = "selected");
})(cr || (cr = {}));
const ur = ye(t => {
    let e = gi(t);
    if (null !== e) return e;
    if (
        ((e = (function (t) {
            const e = fi.exec(t);
            if (null === e) return null;
            const o = e[1].split(",");
            return new ui(
                ci(Number(o[0]), 0, 255),
                ci(Number(o[1]), 0, 255),
                ci(Number(o[2]), 0, 255),
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
function pr(t) {
    return (
        (e = t),
        bi.test(e) ||
            (function (t) {
                return fi.test(t);
            })(t)
    );
    var e;
}
const vr = ye(
    (t, e) =>
        (function (t, e) {
            const o = pi(t),
                i = pi(e);
            return o > i ? vi(o, i) : vi(i, o);
        })(ur(t), ur(e)),
    (t, e) => t + e
);
function fr(t) {
    return pi(ur(t));
}
function br(...t) {
    return e =>
        Math.max.apply(
            null,
            t.map(t => t(e))
        );
}
const gr = (t, e, o) => Math.min(Math.max(t, e), o);
var mr;
function yr(t, e) {
    return o => {
        if (!pr(e)) return -1;
        const i = ki(t, o),
            r = i.indexOf(e);
        return -1 !== r
            ? r
            : i.findIndex(t => {
                  return pr(t) && ((o = t), ur(e).equalValue(ur(o)));
                  var o;
              });
    };
}
function xr(t, e) {
    return o => {
        const i = ki(t, o),
            r = ki(e, o),
            n = yr(i, r)(o);
        let s;
        if (-1 !== n) return n;
        try {
            s = fr(r);
        } catch (t) {
            s = -1;
        }
        return -1 === s
            ? 0
            : i
                  .map((t, e) => ({ luminance: fr(t), index: e }))
                  .reduce((t, e) =>
                      Math.abs(e.luminance - s) < Math.abs(t.luminance - s) ? e : t
                  ).index;
    };
}
function kr(t) {
    return fr($i(t)) <= (-0.1 + Math.sqrt(0.21)) / 2;
}
function Cr(t, e) {
    return "function" == typeof t
        ? o => e(o)[gr(t(o), 0, e(o).length - 1)]
        : e[gr(t, 0, e.length - 1)];
}
function $r(t) {
    return (e, o) => i => Cr(kr(i) ? ki(o, i) : ki(e, i), t(i));
}
function wr(t) {
    return e => o => i => r => n => {
        const s = ki(t, n),
            a = ki(e, n),
            l = a.length,
            c = gr(o(s, a, n), 0, l - 1),
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
                    return r(vr(s, t));
                },
                p,
                u
            )
        );
    };
}
function Fr(t, e, o) {
    return xr(e, t)(o);
}
function Dr(t) {
    return xr(Fi, $i(t))(t);
}
function Tr(t, e, o, i, r, n) {
    return s => {
        const a = ki(t, s),
            l = kr(s) ? -1 : 1,
            c = wr($i)(a)(Fr)(() => l)(((d = ki(e, s)), t => t >= d))(s);
        var d;
        const h = yr(t, c)(s),
            u = ki(o, s),
            p = ki(i, s),
            v = ki(r, s),
            f = ki(n, s);
        return (function (t, e, o, i, r, n, s) {
            const a = t + o * Math.abs(i - r),
                l = 1 === o ? i < r : o * i > o * r,
                c = l ? t : a,
                d = l ? a : t,
                h = c + o * n,
                u = c + o * s;
            return { rest: Cr(c, e), hover: Cr(d, e), active: Cr(h, e), focus: Cr(u, e) };
        })(h, a, l, u, p, v, f);
    };
}
!(function (t) {
    (t.neutral = "neutral"), (t.accent = "accent");
})(mr || (mr = {}));
const Pr = dr(Tr(Fi, 14, 0, er, or, ir)),
    Er =
        (hr(cr.rest, Pr),
        hr(cr.hover, Pr),
        hr(cr.active, Pr),
        hr(cr.focus, Pr),
        dr(Tr(Fi, 4.5, 0, Qi, Yi, Zi))),
    Ar = hr(cr.rest, Er),
    Sr =
        (hr(cr.hover, Er),
        hr(cr.active, Er),
        hr(cr.focus, Er),
        (t, e) => (vr(mi, t) >= e ? mi : "#000000"));
function Hr(t) {
    return function (e) {
        return "function" == typeof e ? o => Sr(e(o), t) : Sr(Ar(e), t);
    };
}
const Or = Hr(4.5),
    Ir = Hr(3),
    Lr = (t, e) => (vr(mi, t) >= e ? mi : "#000000");
const Br =
    ((Rr = 4.5),
    function (t) {
        return "function" == typeof t ? e => Lr(t(e), Rr) : Lr(wi(t), Rr);
    });
var Rr;
function Mr(t) {
    return Tr(Fi, t, 0, 0, 0, 0);
}
const Nr = hr(cr.rest, dr(Mr(4.5))),
    zr = hr(cr.rest, dr(Mr(3)));
function jr(t) {
    return e => {
        const o = Di(e),
            i = wi(e),
            r = xr(Di, i)(e),
            n = { rest: Si(e), hover: Hi(e), active: Oi(e), focus: Ii(e) },
            s = kr(e) ? -1 : 1,
            a =
                r +
                (1 === s ? Math.min(n.rest, n.hover) : Math.max(s * n.rest, s * n.hover)),
            l = wr($i)(Di)(() => a)(() => s)(e => e >= t)(e),
            c = yr(Di, l)(e),
            d = c + s * Math.abs(n.rest - n.hover),
            h = 1 === s ? n.rest < n.hover : s * n.rest > s * n.hover,
            u = h ? c : d,
            p = h ? d : c,
            v = u + s * n.active,
            f = u + s * n.focus;
        return { rest: Cr(u, o), hover: Cr(p, o), active: Cr(v, o), focus: Cr(f, o) };
    };
}
const _r = dr(jr(4.5)),
    Vr = dr(jr(3)),
    qr =
        (hr(cr.rest, _r),
        hr(cr.hover, _r),
        hr(cr.active, _r),
        hr(cr.focus, _r),
        hr(cr.rest, Vr),
        hr(cr.hover, Vr),
        hr(cr.active, Vr),
        hr(cr.focus, Vr),
        br(Li, Bi, Ri, Mi));
function Gr(t) {
    return e => {
        const o = Dr(e);
        return Cr(o + (o >= qr(e) ? -1 : 1) * t(e), Fi(e));
    };
}
const Wr = dr(Gr(Li)),
    Ur = dr(Gr(Bi)),
    Kr = dr(Gr(Ri)),
    Xr = dr(Gr(Mi)),
    Qr = dr(Gr(Ni)),
    Yr = dr(t => ({
        rest: Wr(t),
        hover: Ur(t),
        active: Kr(t),
        focus: Xr(t),
        selected: Qr(t),
    })),
    Zr = br(Li, Bi, Ri, Mi, Gi, Wi, Ui, Ki);
function Jr(t) {
    return e => {
        const o = Dr(e);
        return Cr(o + (o >= Zr(e) ? -1 : 1) * t(e), Fi(e));
    };
}
const tn = dr(Jr(Gi)),
    en = dr(Jr(Wi)),
    on = dr(Jr(Ui)),
    rn = dr(Jr(Ki)),
    nn = dr(Jr(Xi)),
    sn = dr(t => ({
        rest: tn(t),
        hover: en(t),
        active: on(t),
        focus: rn(t),
        selected: nn(t),
    }));
function an(t) {
    return e => {
        const o = kr(e) ? -1 : 1;
        return Cr(Dr(e) - t(e) * o, Fi(e));
    };
}
const ln = dr(an(zi)),
    cn = dr(an(ji)),
    dn = dr(an(_i)),
    hn = dr(an(Vi)),
    un = dr(an(qi)),
    pn = dr(t => ({
        rest: ln(t),
        hover: cn(t),
        active: dn(t),
        focus: hn(t),
        selected: un(t),
    })),
    vn = br(Li, Bi, Ri);
function fn(t) {
    return e => {
        const o = Di(e),
            i = o.length,
            r = wi(e),
            n = Br(Object.assign({}, e, { backgroundColor: r })),
            s = Ti(e),
            a = Dr(e) >= vn(e) ? -1 : 1,
            l = i - 1,
            c = xr(Di, r)(e);
        let d = 0;
        for (
            ;
            d < a * s &&
            Ce(c + d + a, 0, i) &&
            vr(o[c + d + a], n) >= t &&
            Ce(c + d + a + a, 0, l);

        )
            d += a;
        const h = c + d,
            u = h + -1 * a * s,
            p = u + a * Pi(e),
            v = u + a * Ei(e);
        return {
            rest: Cr(u, o),
            hover: Cr(h, o),
            active: Cr(p, o),
            focus: Cr(v, o),
            selected: Cr(u + (kr(e) ? -1 * Ai(e) : Ai(e)), o),
        };
    };
}
const bn = dr(fn(4.5)),
    gn = dr(fn(3)),
    mn =
        (hr(cr.rest, bn),
        hr(cr.hover, bn),
        hr(cr.active, bn),
        hr(cr.focus, bn),
        hr(cr.selected, bn),
        hr(cr.rest, gn),
        hr(cr.hover, gn),
        hr(cr.active, gn),
        hr(cr.focus, gn),
        hr(cr.selected, gn),
        t => {
            const e = tr(t),
                o = xr(Fi, $i(t))(t);
            return Cr(o - (o < e ? -1 * e : e), Fi(t));
        });
const yn = dr(t => {
        const e = Fi(t),
            o = Dr(t),
            i = kr(t) ? -1 : 1,
            r = nr(t),
            n = o + i * r,
            s = n + i * (sr(t) - r),
            a = n + i * (ar(t) - r),
            l = n + i * (lr(t) - r);
        return { rest: Cr(n, e), hover: Cr(s, e), active: Cr(a, e), focus: Cr(l, e) };
    }),
    xn =
        (hr(cr.rest, yn),
        hr(cr.hover, yn),
        hr(cr.active, yn),
        hr(cr.focus, yn),
        dr(t => {
            const e = Fi(t),
                o = Dr(t),
                i = rr(t);
            return Cr(o + (kr(t) ? -1 : 1) * i, e);
        }));
var kn, Cn, $n;
function wn(t, e) {
    return o => (-1 === Ji(o) ? e(o) : t(o));
}
!(function (t) {
    (t[(t.L1 = 0)] = "L1"),
        (t[(t.L1Alt = 3)] = "L1Alt"),
        (t[(t.L2 = 10)] = "L2"),
        (t[(t.L3 = 13)] = "L3"),
        (t[(t.L4 = 16)] = "L4");
})(kn || (kn = {})),
    (function (t) {
        (t[(t.L1 = 76)] = "L1"),
            (t[(t.L1Alt = 76)] = "L1Alt"),
            (t[(t.L2 = 79)] = "L2"),
            (t[(t.L3 = 82)] = "L3"),
            (t[(t.L4 = 85)] = "L4");
    })(Cn || (Cn = {})),
    (function (t) {
        (t[(t.LightMode = 1)] = "LightMode"), (t[(t.DarkMode = 0.23)] = "DarkMode");
    })($n || ($n = {}));
const Fn = xr(Fi, t => {
        const e = Ji(t);
        return new ui(e, e, e, 1).toStringHexRGB();
    }),
    Dn = t => li(si(Fn, tr)(t), 0, Fi(t).length - 1),
    Tn = br(Li, Bi, Ri),
    Pn = br(ni(Fn, tr), Tn),
    En = t => {
        const e = new ui(0.14, 0.14, 0.14, 1);
        return xr(Fi, e.toStringHexRGB())(t);
    },
    An = dr(wn(Cr(si(Dn, tr), Fi), $r(Fi)(0, si(En, ai(tr, 5))))),
    Sn = dr(wn(Cr(Dn, Fi), $r(Fi)(0, si(En, ai(tr, 4))))),
    Hn = dr(wn(Cr(ni(Dn, tr), Fi), $r(Fi)(tr, si(En, ai(tr, 3))))),
    On = dr(wn(Cr(Fn, Fi), $r(Fi)(0, si(En, ai(tr, 3))))),
    In = Hn,
    Ln = dr(wn(Cr(Pn, Fi), $r(Fi)(Tn, si(En, ai(tr, 2))))),
    Bn = dr(wn(Cr(ni(Pn, tr), Fi), $r(Fi)(ni(Tn, tr), si(En, tr)))),
    Rn = dr(wn(Cr(ni(Pn, ai(tr, 2)), Fi), $r(Fi)(ni(Tn, ai(tr, 2)), En)));
function Mn(t) {
    return t > 3.5;
}
const Nn = dr(
    wr($i)(Fi)(function (t, e, o) {
        return xr(Fi, t)(o);
    })(function (t, e, o) {
        return kr(o) ? -1 : 1;
    })(Mn)
);
function zn(t, e, o) {
    return kr(o) ? 1 : -1;
}
const jn = kt`
    ${Qe("block")};
`;
let _n = class extends eo {};
var Vn;
t(
    [oo({ attribute: "background-color", default: xi.backgroundColor })],
    _n.prototype,
    "backgroundColor",
    void 0
),
    t(
        [
            oo({
                attribute: "accent-base-color",
                cssCustomProperty: !1,
                default: xi.accentBaseColor,
            }),
        ],
        _n.prototype,
        "accentBaseColor",
        void 0
    ),
    t(
        [oo({ attribute: !1, cssCustomProperty: !1, default: xi.neutralPalette })],
        _n.prototype,
        "neutralPalette",
        void 0
    ),
    t(
        [oo({ attribute: !1, cssCustomProperty: !1, default: xi.accentPalette })],
        _n.prototype,
        "accentPalette",
        void 0
    ),
    t([oo({ default: xi.density, converter: J })], _n.prototype, "density", void 0),
    t(
        [oo({ attribute: "design-unit", converter: J, default: xi.designUnit })],
        _n.prototype,
        "designUnit",
        void 0
    ),
    t(
        [
            oo({
                attribute: "base-height-multiplier",
                default: xi.baseHeightMultiplier,
                converter: J,
            }),
        ],
        _n.prototype,
        "baseHeightMultiplier",
        void 0
    ),
    t(
        [
            oo({
                attribute: "base-horizontal-spacing-multiplier",
                converter: J,
                default: xi.baseHorizontalSpacingMultiplier,
            }),
        ],
        _n.prototype,
        "baseHorizontalSpacingMultiplier",
        void 0
    ),
    t(
        [oo({ attribute: "corner-radius", converter: J, default: xi.cornerRadius })],
        _n.prototype,
        "cornerRadius",
        void 0
    ),
    t(
        [
            oo({
                attribute: "elevated-corner-radius",
                converter: J,
                default: xi.elevatedCornerRadius,
            }),
        ],
        _n.prototype,
        "elevatedCornerRadius",
        void 0
    ),
    t(
        [oo({ attribute: "outline-width", converter: J, default: xi.outlineWidth })],
        _n.prototype,
        "outlineWidth",
        void 0
    ),
    t(
        [
            oo({
                attribute: "focus-outline-width",
                converter: J,
                default: xi.focusOutlineWidth,
            }),
        ],
        _n.prototype,
        "focusOutlineWidth",
        void 0
    ),
    t(
        [
            oo({
                attribute: "disabled-opacity",
                converter: J,
                default: xi.disabledOpacity,
            }),
        ],
        _n.prototype,
        "disabledOpacity",
        void 0
    ),
    t(
        [oo({ attribute: "type-ramp-minus-2-font-size", default: "10px" })],
        _n.prototype,
        "typeRampMinus2FontSize",
        void 0
    ),
    t(
        [oo({ attribute: "type-ramp-minus-2-line-height", default: "16px" })],
        _n.prototype,
        "typeRampMinus2LineHeight",
        void 0
    ),
    t(
        [oo({ attribute: "type-ramp-minus-1-font-size", default: "12px" })],
        _n.prototype,
        "typeRampMinus1FontSize",
        void 0
    ),
    t(
        [oo({ attribute: "type-ramp-minus-1-line-height", default: "16px" })],
        _n.prototype,
        "typeRampMinus1LineHeight",
        void 0
    ),
    t(
        [oo({ attribute: "type-ramp-base-font-size", default: "14px" })],
        _n.prototype,
        "typeRampBaseFontSize",
        void 0
    ),
    t(
        [oo({ attribute: "type-ramp-base-line-height", default: "20px" })],
        _n.prototype,
        "typeRampBaseLineHeight",
        void 0
    ),
    t(
        [oo({ attribute: "type-ramp-plus-1-font-size", default: "16px" })],
        _n.prototype,
        "typeRampPlus1FontSize",
        void 0
    ),
    t(
        [oo({ attribute: "type-ramp-plus-1-line-height", default: "24px" })],
        _n.prototype,
        "typeRampPlus1LineHeight",
        void 0
    ),
    t(
        [oo({ attribute: "type-ramp-plus-2-font-size", default: "20px" })],
        _n.prototype,
        "typeRampPlus2FontSize",
        void 0
    ),
    t(
        [oo({ attribute: "type-ramp-plus-2-line-height", default: "28px" })],
        _n.prototype,
        "typeRampPlus2LineHeight",
        void 0
    ),
    t(
        [oo({ attribute: "type-ramp-plus-3-font-size", default: "28px" })],
        _n.prototype,
        "typeRampPlus3FontSize",
        void 0
    ),
    t(
        [oo({ attribute: "type-ramp-plus-3-line-height", default: "36px" })],
        _n.prototype,
        "typeRampPlus3LineHeight",
        void 0
    ),
    t(
        [oo({ attribute: "type-ramp-plus-4-font-size", default: "34px" })],
        _n.prototype,
        "typeRampPlus4FontSize",
        void 0
    ),
    t(
        [oo({ attribute: "type-ramp-plus-4-line-height", default: "44px" })],
        _n.prototype,
        "typeRampPlus4LineHeight",
        void 0
    ),
    t(
        [oo({ attribute: "type-ramp-plus-5-font-size", default: "46px" })],
        _n.prototype,
        "typeRampPlus5FontSize",
        void 0
    ),
    t(
        [oo({ attribute: "type-ramp-plus-5-line-height", default: "56px" })],
        _n.prototype,
        "typeRampPlus5LineHeight",
        void 0
    ),
    t(
        [oo({ attribute: "type-ramp-plus-6-font-size", default: "60px" })],
        _n.prototype,
        "typeRampPlus6FontSize",
        void 0
    ),
    t(
        [oo({ attribute: "type-ramp-plus-6-line-height", default: "72px" })],
        _n.prototype,
        "typeRampPlus6LineHeight",
        void 0
    ),
    t(
        [
            oo({
                attribute: "accent-fill-rest-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.accentFillRestDelta,
            }),
        ],
        _n.prototype,
        "accentFillRestDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "accent-fill-hover-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.accentFillHoverDelta,
            }),
        ],
        _n.prototype,
        "accentFillHoverDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "accent-fill-active-delta",
                cssCustomProperty: !1,
                converter: J,
                default: xi.accentFillActiveDelta,
            }),
        ],
        _n.prototype,
        "accentFillActiveDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "accent-fill-focus-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.accentFillFocusDelta,
            }),
        ],
        _n.prototype,
        "accentFillFocusDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "accent-fill-selected-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.accentFillSelectedDelta,
            }),
        ],
        _n.prototype,
        "accentFillSelectedDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "accent-foreground-rest-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.accentForegroundRestDelta,
            }),
        ],
        _n.prototype,
        "accentForegroundRestDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "accent-foreground-hover-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.accentForegroundHoverDelta,
            }),
        ],
        _n.prototype,
        "accentForegroundHoverDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "accent-foreground-active-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.accentForegroundActiveDelta,
            }),
        ],
        _n.prototype,
        "accentForegroundActiveDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "accent-foreground-focus-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.accentForegroundFocusDelta,
            }),
        ],
        _n.prototype,
        "accentForegroundFocusDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-rest-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillRestDelta,
            }),
        ],
        _n.prototype,
        "neutralFillRestDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-hover-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillHoverDelta,
            }),
        ],
        _n.prototype,
        "neutralFillHoverDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-active-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillActiveDelta,
            }),
        ],
        _n.prototype,
        "neutralFillActiveDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-focus-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillFocusDelta,
            }),
        ],
        _n.prototype,
        "neutralFillFocusDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-selected-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillSelectedDelta,
            }),
        ],
        _n.prototype,
        "neutralFillSelectedDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-input-rest-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillInputRestDelta,
            }),
        ],
        _n.prototype,
        "neutralFillInputRestDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-input-hover-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillInputHoverDelta,
            }),
        ],
        _n.prototype,
        "neutralFillInputHoverDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-input-active-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillInputActiveDelta,
            }),
        ],
        _n.prototype,
        "neutralFillInputActiveDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-input-focus-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillInputFocusDelta,
            }),
        ],
        _n.prototype,
        "neutralFillInputFocusDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-input-selected-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillInputSelectedDelta,
            }),
        ],
        _n.prototype,
        "neutralFillInputSelectedDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-stealth-rest-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillStealthRestDelta,
            }),
        ],
        _n.prototype,
        "neutralFillStealthRestDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-stealth-hover-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillStealthHoverDelta,
            }),
        ],
        _n.prototype,
        "neutralFillStealthHoverDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-stealth-active-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillStealthActiveDelta,
            }),
        ],
        _n.prototype,
        "neutralFillStealthActiveDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-stealth-focus-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillStealthFocusDelta,
            }),
        ],
        _n.prototype,
        "neutralFillStealthFocusDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-stealth-selected-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillStealthSelectedDelta,
            }),
        ],
        _n.prototype,
        "neutralFillStealthSelectedDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-toggle-hover-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillToggleHoverDelta,
            }),
        ],
        _n.prototype,
        "neutralFillToggleHoverDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-toggle-hover-active",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillToggleActiveDelta,
            }),
        ],
        _n.prototype,
        "neutralFillToggleActiveDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-toggle-hover-focus",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillToggleFocusDelta,
            }),
        ],
        _n.prototype,
        "neutralFillToggleFocusDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "base-layer-luminance",
                converter: J,
                cssCustomProperty: !1,
                default: xi.baseLayerLuminance,
            }),
        ],
        _n.prototype,
        "baseLayerLuminance",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-fill-card-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralFillCardDelta,
            }),
        ],
        _n.prototype,
        "neutralFillCardDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-foreground-hover-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralForegroundHoverDelta,
            }),
        ],
        _n.prototype,
        "neutralForegroundHoverDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-foreground-active-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralForegroundActiveDelta,
            }),
        ],
        _n.prototype,
        "neutralForegroundActiveDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-foreground-focus-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralForegroundFocusDelta,
            }),
        ],
        _n.prototype,
        "neutralForegroundFocusDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-divider-rest-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralDividerRestDelta,
            }),
        ],
        _n.prototype,
        "neutralDividerRestDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-outline-rest-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralOutlineRestDelta,
            }),
        ],
        _n.prototype,
        "neutralOutlineRestDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-outline-hover-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralOutlineHoverDelta,
            }),
        ],
        _n.prototype,
        "neutralOutlineHoverDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-outline-active-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralOutlineActiveDelta,
            }),
        ],
        _n.prototype,
        "neutralOutlineActiveDelta",
        void 0
    ),
    t(
        [
            oo({
                attribute: "neutral-outline-focus-delta",
                converter: J,
                cssCustomProperty: !1,
                default: xi.neutralOutlineFocusDelta,
            }),
        ],
        _n.prototype,
        "neutralOutlineFocusDelta",
        void 0
    ),
    (_n = t(
        [
            ((Vn = { name: "fast-design-system-provider", template: io, styles: jn }),
            t => {
                ht(Vn)(t), t.registerTagName("string" == typeof Vn ? Vn : Vn.name);
            }),
        ],
        _n
    ));
const qn = Ue("neutral-foreground-rest", t => Pr(t).rest, _n.findProvider),
    Gn = Ue("neutral-foreground-hover", t => Pr(t).hover, _n.findProvider),
    Wn = Ue("neutral-foreground-active", t => Pr(t).active, _n.findProvider),
    Un =
        (Ue("neutral-foreground-focus", t => Pr(t).focus, _n.findProvider),
        Ue("neutral-foreground-toggle", Or, _n.findProvider),
        Ue("neutral-foreground-toggle-large", Ir, _n.findProvider),
        Ue("neutral-foreground-hint", Nr, _n.findProvider)),
    Kn =
        (Ue("neutral-foreground-hint-large", zr, _n.findProvider),
        Ue("accent-foreground-rest", t => _r(t).rest, _n.findProvider)),
    Xn = Ue("accent-foreground-hover", t => _r(t).hover, _n.findProvider),
    Qn = Ue("accent-foreground-active", t => _r(t).active, _n.findProvider),
    Yn =
        (Ue("accent-foreground-focus", t => _r(t).focus, _n.findProvider),
        Ue("accent-foreground-cut-rest", t => Br(t), _n.findProvider)),
    Zn =
        (Ue("accent-foreground-large-rest", t => Vr(t).rest, _n.findProvider),
        Ue("accent-foreground-large-hover", t => Vr(t).hover, _n.findProvider),
        Ue("accent-foreground-large-active", t => Vr(t).active, _n.findProvider),
        Ue("accent-foreground-large-focus", t => Vr(t).focus, _n.findProvider),
        Ue("neutral-fill-rest", t => Yr(t).rest, _n.findProvider)),
    Jn = Ue("neutral-fill-hover", t => Yr(t).hover, _n.findProvider),
    ts = Ue("neutral-fill-active", t => Yr(t).active, _n.findProvider),
    es = Ue("neutral-fill-focus", t => Yr(t).focus, _n.findProvider),
    os =
        (Ue("neutral-fill-selected", t => Yr(t).selected, _n.findProvider),
        Ue("neutral-fill-stealth-rest", t => sn(t).rest, _n.findProvider)),
    is = Ue("neutral-fill-stealth-hover", t => sn(t).hover, _n.findProvider),
    rs = Ue("neutral-fill-stealth-active", t => sn(t).active, _n.findProvider),
    ns =
        (Ue("neutral-fill-stealth-focus", t => sn(t).focus, _n.findProvider),
        Ue("neutral-fill-stealth-selected", t => sn(t).selected, _n.findProvider),
        Ue("neutral-fill-toggle-rest", t => Er(t).rest, _n.findProvider),
        Ue("neutral-fill-toggle-hover", t => Er(t).hover, _n.findProvider),
        Ue("neutral-fill-toggle-active", t => Er(t).active, _n.findProvider),
        Ue("neutral-fill-toggle-focus", t => Er(t).focus, _n.findProvider),
        Ue("neutral-fill-input-rest", t => pn(t).rest, _n.findProvider)),
    ss = Ue("neutral-fill-input-hover", t => pn(t).hover, _n.findProvider),
    as = Ue("neutral-fill-input-active", t => pn(t).active, _n.findProvider),
    ls =
        (Ue("neutral-fill-input-focus", t => pn(t).focus, _n.findProvider),
        Ue("accent-fill-rest", t => bn(t).rest, _n.findProvider)),
    cs = Ue("accent-fill-hover", t => bn(t).hover, _n.findProvider),
    ds = Ue("accent-fill-active", t => bn(t).active, _n.findProvider),
    hs =
        (Ue("accent-fill-focus", t => bn(t).focus, _n.findProvider),
        Ue("accent-fill-selected", t => bn(t).selected, _n.findProvider),
        Ue("accent-fill-large-rest", t => gn(t).rest, _n.findProvider),
        Ue("accent-fill-large-hover", t => gn(t).hover, _n.findProvider),
        Ue("accent-fill-large-active", t => gn(t).active, _n.findProvider),
        Ue("accent-fill-large-focus", t => gn(t).focus, _n.findProvider),
        Ue("accent-fill-large-selected", t => gn(t).selected, _n.findProvider),
        Ue(
            "neutral-fill-card-rest",
            t => {
                return "function" == typeof (e = t)
                    ? t => mn(Object.assign({}, t, { backgroundColor: e(t) }))
                    : mn(e);
                var e;
            },
            _n.findProvider
        ),
        Ue("neutral-outline-rest", t => yn(t).rest, _n.findProvider)),
    us = Ue("neutral-outline-hover", t => yn(t).hover, _n.findProvider),
    ps = Ue("neutral-outline-active", t => yn(t).active, _n.findProvider),
    vs =
        (Ue("neutral-outline-focus", t => yn(t).focus, _n.findProvider),
        Ue("neutral-divider-rest", xn, _n.findProvider)),
    fs =
        (Ue("neutral-layer-floating", An, _n.findProvider),
        Ue("neutral-layer-card", Sn, _n.findProvider),
        Ue("neutral-layer-card-container", Hn, _n.findProvider),
        Ue("neutral-layer-l1", On, _n.findProvider),
        Ue("neutral-layer-l1-alt", In, _n.findProvider),
        Ue("neutral-layer-l2", Ln, _n.findProvider),
        Ue("neutral-layer-l3", Bn, _n.findProvider),
        Ue("neutral-layer-l4", Rn, _n.findProvider),
        Ue("neutral-focus", Nn, _n.findProvider)),
    bs = Ue(
        "neutral-focus-inner-accent",
        ((gs = wi),
        wr(Nn)(Di)(
            (function (t) {
                return (e, o, i) => o.indexOf(t(i));
            })(gs)
        )(zn)(Mn)),
        _n.findProvider
    );
var gs;
const ms =
        "box-shadow: 0 0 calc((var(--elevation) * 0.225px) + 2px) rgba(0, 0, 0, calc(.11 * (2 - var(--background-luminance, 1)))), 0 calc(var(--elevation) * 0.4px) calc((var(--elevation) * 0.9px)) rgba(0, 0, 0, calc(.13 * (2 - var(--background-luminance, 1))));",
    ys = "(var(--base-height-multiplier) + var(--density)) * var(--design-unit)",
    xs = kt`
    ${Qe("inline-block")} :host {
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
        height: calc(${ys} * 1px);
        min-width: calc(${ys} * 1px);
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

    .control:${Ye} {
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
    ks = kt`
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

    :host(.accent) .control:${Ye} {
        box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset var(--neutral-focus-inner-accent);
    }
`,
    Cs = kt`
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

    :host(.hypertext) .control:${Ye} {
        border-bottom: calc(var(--focus-outline-width) * 1px) solid var(--neutral-focus);
    }
`,
    $s = kt`
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

    :host(.lightweight) .control:${Ye} .content::before {
        background: var(--neutral-foreground-rest);
        height: calc(var(--focus-outline-width) * 1px);
    }
`,
    ws = kt`
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
    Fs = kt`
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
    Ds = kt`
    ${Qe("flex")} :host {
        box-sizing: border-box;
        flex-direction: column;
        font-family: var(--body-font);
        font-size: var(--type-ramp-minus-1-font-size);
        line-height: var(--type-ramp-minus-1-line-height);
        color: var(--neutral-foreground-rest);
        border-top: calc(var(--outline-width) * 1px) solid var(--neutral-divider-rest);
    }
`.withBehaviors(ls, vs, qn);
let Ts = class extends Ie {};
Ts = t([ht({ name: "fast-accordion", template: Tt, styles: Ds })], Ts);
const Ps = kt`
    ${xs}
    ${ks}
    ${Cs}
    ${$s}
    ${ws}
    ${Fs}
`.withBehaviors(
    ds,
    cs,
    ls,
    Qn,
    Yn,
    Xn,
    Kn,
    ts,
    es,
    Jn,
    Zn,
    rs,
    is,
    os,
    fs,
    bs,
    qn,
    ps,
    us,
    hs
);
let Es = class extends Be {};
Es = t(
    [
        ht({
            name: "fast-anchor",
            template: Le,
            styles: Ps,
            shadowOptions: { delegatesFocus: !0 },
        }),
    ],
    Es
);
const As = kt`
    ${Qe("inline-block")} :host {
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
`.withBehaviors(ls, Yn, Zn, qn);
let Ss = class extends Me {
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
t([et({ mode: "fromView" })], Ss.prototype, "appearance", void 0),
    (Ss = t([ht({ name: "fast-badge", template: Re, styles: As })], Ss));
const Hs = kt`
    ${xs}
    ${ks}
    ${Cs}
    ${$s}
    ${ws}
    ${Fs}
`.withBehaviors(
    ds,
    cs,
    ls,
    Qn,
    Yn,
    Xn,
    Kn,
    ts,
    es,
    Jn,
    Zn,
    rs,
    is,
    os,
    fs,
    bs,
    qn,
    ps,
    us,
    hs,
    Xe(kt`
            :host(.disabled),
            :host(.disabled) .control {
                forced-color-adjust: none;
                background: ${De.ButtonFace};
                border-color: ${De.GrayText};
                color: ${De.GrayText};
                cursor: ${"not-allowed"};
                opacity: 1;
            }
            :host(.accent) .control {
                forced-color-adjust: none;
                background: ${De.Highlight};
                color: ${De.HighlightText};
            }
    
            :host(.accent) .control:hover {
                background: ${De.HighlightText};
                border-color: ${De.Highlight};
                color: ${De.Highlight};
            }
    
            :host(.accent:${Ye}) .control {
                border-color: ${De.ButtonText};
                box-shadow: 0 0 0 2px ${De.HighlightText} inset;
            }
    
            :host(.accent.disabled) .control,
            :host(.accent.disabled) .control:hover {
                background: ${De.ButtonFace};
                border-color: ${De.GrayText};
                color: ${De.GrayText};
            }
            :host(.lightweight) .control:hover {
                forced-color-adjust: none;
                color: ${De.Highlight};
            }
    
            :host(.lightweight) .control:hover .content::before {
                background: ${De.Highlight};
            }
    
            :host(.lightweight.disabled) .control {
                forced-color-adjust: none;
                color: ${De.GrayText};
            }
        
            :host(.lightweight.disabled) .control:hover .content::before {
                background: none;
            }
            :host(.outline.disabled) .control {
                border-color: ${De.GrayText};
            }
            :host(.stealth) .control {
                forced-color-adjust: none;
                background: none;
                border-color: transparent;
                color: ${De.ButtonText};
                fill: currentColor;
            }
            :host(.stealth) .control:hover,
            :host(.stealth:${Ye}) .control {
                background: ${De.Highlight};
                border-color: ${De.Highlight};
                color: ${De.HighlightText};
            }
            :host(.stealth.disabled) .control {
                background: none;
                border-color: transparent;
                color: ${De.GrayText};
            }
        `)
);
let Os = class extends _e {};
Os = t(
    [
        ht({
            name: "fast-button",
            template: Ne,
            styles: Hs,
            shadowOptions: { delegatesFocus: !0 },
        }),
    ],
    Os
);
const Is = kt`
    ${Qe("block")} :host {
        --elevation: 4;
        display: block;
        contain: content;
        height: var(--card-height, 100%);
        width: var(--card-width, 100%);
        box-sizing: border-box;
        background: var(--neutral-layer-card);
        border-radius: calc(var(--elevated-corner-radius) * 1px);
        ${ms};
        border: calc(var(--outline-width) * 1px) solid transparent;
    }
`;
let Ls = class extends qe {};
Ls = t([ht({ name: "fast-card", template: Ve, styles: Is })], Ls);
const Bs = kt`
    ${Qe("inline-flex")} :host {
        align-items: center;
        outline: none;
        margin: calc(var(--design-unit) * 1px) 0;
        ${""} user-select: none;
    }

    .control {
        position: relative;
        width: calc((${ys} / 2 + var(--design-unit)) * 1px);
        height: calc((${ys} / 2 + var(--design-unit)) * 1px);
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

    :host(:${Ye}) .control {
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
    as,
    ss,
    ns,
    fs,
    qn,
    ps,
    us,
    hs,
    Xe(kt`
            .control {
                forced-color-adjust: none;
                border-color: ${De.FieldText};
                background: ${De.Field};
            }
            :host(:enabled) .control:hover, .control:active {
                border-color: ${De.Highlight};
                background: ${De.Field};
            }
            .checked-indicator {
                fill: ${De.FieldText};
            }
            .indeterminate-indicator {
                background: ${De.FieldText};
            }
            :host(:${Ye}) .control {
                border-color: ${De.Highlight};
                box-shadow: 0 0 0 2px ${De.Field}, 0 0 0 4px ${De.FieldText};
            }
            :host(.checked:${Ye}:enabled) .control {
                box-shadow: 0 0 0 2px ${De.Field}, 0 0 0 4px ${De.FieldText};
            }
            :host(.checked) .control {
                background: ${De.Highlight};
                border-color: ${De.Highlight};
            }
            :host(.checked) .control:hover, .control:active {
                background: ${De.HighlightText};
            }
            :host(.checked) .checked-indicator {
                fill: ${De.HighlightText};
            }
            :host(.checked) .control:hover .checked-indicator {
                fill: ${De.Highlight}
            }
            :host(.checked) .indeterminate-indicator {
                background: ${De.HighlightText};
            }
            :host(.checked) .control:hover .indeterminate-indicator {
                background: ${De.Highlight}
            }
            :host(.disabled) {
                opacity: 1;
            }
            :host(.disabled) .control {
                forced-color-adjust: none;
                border-color: ${De.GrayText};
                background: ${De.Field};
            }
            :host(.disabled) .indeterminate-indicator,
            :host(.checked.disabled) .control:hover .indeterminate-indicator {
                forced-color-adjust: none;
                background: ${De.GrayText};
            }
            :host(.disabled) .checked-indicator,
            :host(.checked.disabled) .control:hover .checked-indicator {
                forced-color-adjust: none;
                fill: ${De.GrayText};
            }
        `)
);
let Rs = class extends We {};
Rs = t([ht({ name: "fast-checkbox", template: Ge, styles: Bs })], Rs);
const Ms = kt`
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
        ${ms} margin-top: auto;
        margin-bottom: auto;
        border-radius: calc(var(--elevated-corner-radius));
        width: var(--dialog-width);
        height: var(--dialog-height);
        background: var(--background-color);
        z-index: 1;
        border: calc(var(--outline-width) * 1px) solid transparent;
    }
`;
let Ns = class extends go {};
Ns = t([ht({ name: "fast-dialog", template: ro, styles: Ms })], Ns);
const zs = kt`
    ${Qe("block")} :host {
        box-sizing: content-box;
        height: 0;
        margin: calc(var(--design-unit) * 1px) 0;
        border: none;
        border-top: calc(var(--outline-width) * 1px) solid var(--neutral-divider-rest);
    }
`.withBehaviors(vs);
let js = class extends ko {};
js = t([ht({ name: "fast-divider", template: mo, styles: zs })], js);
const _s = kt`
    ${Qe("inline-flex")} :host {
        width: calc(${ys} * 1px);
        height: calc(${ys} * 1px);
        justify-content: center;
        align-items: center;
        margin: 0;
        position: relative;
        fill: var(--neutral-foreground-rest);
        color: var(--neutral-foreground-rest);
        background: transparent;
        border: none;
        outline: none;
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

    :host(:${Ye}) {
        outline: none;
    }

    :host(:${Ye})::before {
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
    rs,
    is,
    os,
    fs,
    qn,
    ps,
    us,
    hs,
    Xe(kt`
            :host {
                background: ${De.Canvas};
            }
            :host .next,
            :host .previous {
                color: ${De.ButtonText};
                fill: ${De.ButtonText};
            }
            :host::before {
                background: ${De.Canvas};
                border-color: ${De.ButtonText};
            }
            :host(:hover)::before {
                forced-color-adjust: none;
                background: ${De.Highlight};
                border-color: ${De.ButtonText};
                opacity: 1;
            }
            :host(:hover) .next,
            :host(:hover) .previous {
                forced-color-adjust: none;
                color: ${De.HighlightText};
                fill: ${De.HighlightText};
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
                background: ${De.Canvas};
                border-color: ${De.GrayText};
                color: ${De.GrayText};
                fill: ${De.GrayText};
            }
            :host(:${Ye})::before {
                forced-color-adjust: none;
                border-color: ${De.Highlight};
                box-shadow: 0 0 0 2px ${De.Field}, 0 0 0 4px ${De.FieldText};
            }
        `)
);
let Vs = class extends Co {};
Vs = t([ht({ name: "fast-flipper", template: $o, styles: _s })], Vs);
const qs = kt`
    ${Qe("flex")} :host {
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
    ls,
    Zn,
    Un,
    Xe(kt`
            .indeterminate-indicator-1,
            .indeterminate-indicator-2,
            .determinate {
                forced-color-adjust: none;
                background-color: ${De.FieldText};
            }
            .progress {
                background-color: ${De.Field};
                border: calc(var(--outline-width) * 1px) solid ${De.FieldText};
            }
            :host(.paused) .indeterminate-indicator-1,
            .indeterminate-indicator-2 {
                background-color: ${De.Field};
            }
            :host(.paused) .determinate {
                background-color: ${De.GrayText};
            }
        `)
);
let Gs = class extends wo {};
Gs = t([ht({ name: "fast-progress", template: Fo, styles: qs })], Gs);
const Ws = kt`
    ${Qe("flex")} :host {
        align-items: center;
        outline: none;
        height: calc(${ys} * 1px);
        width: calc(${ys} * 1px);
        margin: calc(${ys} * 1px) 0;
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
    ls,
    Zn,
    Un,
    Xe(kt`
            .indeterminate-indicator-1,
            .determinate {
                stroke: ${De.FieldText};
            }
            .background {
                stroke: ${De.Field};
            }
            :host(.paused) .indeterminate-indicator-1 {
                stroke: ${De.Field};
            }
            :host(.paused) .determinate {
                stroke: ${De.GrayText};
            }
        `)
);
let Us = class extends wo {};
Us = t([ht({ name: "fast-progress-ring", template: Do, styles: Ws })], Us);
const Ks = kt`
    ${Qe("inline-flex")} :host {
        --input-size: calc((${ys} / 2) + var(--design-unit));
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

    :host(:${Ye}) .control {
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
    ts,
    ss,
    ns,
    fs,
    qn,
    ps,
    us,
    hs,
    Xe(kt`
            .control {
                forced-color-adjust: none;
                border-color: ${De.FieldText};
                background: ${De.Field};
            }
            :host(:enabled) .control:hover, .control:active {
                border-color: ${De.Highlight};
                background: ${De.Field};
            }
            :host(:${Ye}) .control {
                border-color: ${De.Highlight};
                box-shadow: 0 0 0 2px ${De.Field}, 0 0 0 4px ${De.FieldText};
            }
            :host(.checked:${Ye}:enabled) .control {
                border-color: ${De.Highlight};
                box-shadow: 0 0 0 2px ${De.Field}, 0 0 0 4px ${De.FieldText};
            }
            :host(.checked:enabled) .control:hover, .control:active {
                border-color: ${De.Highlight};
                background: ${De.Highlight};
            }
            :host(.checked) .checked-indicator {
                background: ${De.Highlight};
                fill: ${De.Highlight};
            }
            :host(.checked) .control:hover .checked-indicator {
                background: ${De.HighlightText};
                fill: ${De.HighlightText};
            }
            :host(.disabled) {
                forced-color-adjust: none;
                opacity: 1;
            }
            :host(.disabled) .label {
                color: ${De.GrayText};
            }
            :host(.disabled) .control,
            :host(.checked.disabled) .control:hover, .control:active {
                background: ${De.Field};
                border-color: ${De.GrayText};
            }
            :host(.disabled) .checked-indicator,
            :host(.checked.disabled) .control:hover .checked-indicator {
                fill: ${De.GrayText};
                background: ${De.GrayText};
            }
        `)
);
let Xs = class extends Po {};
Xs = t([ht({ name: "fast-radio", template: To, styles: Ks })], Xs);
const Qs = kt`
    ${Qe("flex")} :host {
        align-items: flex-start;
        margin: calc(var(--design-unit) * 1px) 0;
        flex-direction: column;
    }

    .positioning-region {
        display: flex;
        flex-wrap: wrap;
    }
`;
let Ys = class extends Ao {};
Ys = t([ht({ name: "fast-radio-group", template: Eo, styles: Qs })], Ys);
const Zs = kt`
    :host([hidden]) {
        display: none;
    }

    ${Qe("inline-grid")} :host {
        --thumb-size: calc(${ys} * 0.5);
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
    :host(:${Ye}) .thumb-cursor {
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
    fs,
    Wn,
    Gn,
    qn,
    us,
    hs,
    Xe(kt`
            .thumb-cursor {
                forced-color-adjust: none;
                border-color: ${De.FieldText};
                background: ${De.FieldText};
            }
            .thumb-cursor:hover,
            .thumb-cursor:active {
                background: ${De.Highlight};
            }
            .track {
                forced-color-adjust: none;
                background: ${De.FieldText};
            }
            :host(:${Ye}) .thumb-cursor {
                background: ${De.Highlight};
                border-color: ${De.Highlight};
                box-shadow: 0 0 0 2px ${De.Field}, 0 0 0 4px ${De.FieldText};
            }
            :host(.disabled) {
                opacity: 1;
                cursor: ${"not-allowed"};
            }
            :host(.disabled) .slider,
            :host(.disabled) .track,
            :host(.disabled) .thumb-cursor {
                forced-color-adjust: none;
                background: ${De.GrayText};
            }
        `)
);
let Js = class extends Io {};
Js = t([ht({ name: "fast-slider", template: So, styles: Zs })], Js);
const ta = kt`
    ${Qe("block")} :host {
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
        height: calc(${ys} * 0.25 * 1px);
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
    hs,
    Xe(kt`
            .mark {
                forced-color-adjust: none;
                background: ${De.FieldText};
            }
            :host(.disabled) {
                forced-color-adjust: none;
                opacity: 1;
            }
            :host(.disabled) .label {
                color: ${De.GrayText};
            }
            :host(.disabled) .mark {
                background: ${De.GrayText};
            }
        `)
);
let ea = class extends Ro {};
ea = t([ht({ name: "fast-slider-label", template: Lo, styles: ta })], ea);
const oa = kt`
    :host([hidden]) {
        display: none;
    }

    ${Qe("inline-flex")} :host {
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
        width: calc(((${ys} / 2) + var(--design-unit)) * 2px);
        height: calc(((${ys} / 2) + var(--design-unit)) * 1px);
        background: var(--neutral-fill-input-rest);
        border-radius: calc(${ys} * 1px);
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

    :host(:${Ye}) .switch {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px var(--neutral-focus);
        border-color: var(--neutral-focus);
    }

    .checked-indicator {
        position: absolute;
        height: calc((${ys} - (var(--design-unit) * 5.5)) * 1px);
        width: calc((${ys} - (var(--design-unit) * 5.5)) * 1px);
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
        left: calc((((${ys} / 2) + var(--design-unit)) + var(--design-unit)) * 1px);
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

    :host(.checked:${Ye}:enabled) .switch {
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
    ds,
    cs,
    ls,
    Yn,
    as,
    ss,
    ns,
    fs,
    qn,
    ps,
    us,
    hs,
    Xe(kt`
            .checked-indicator,
            :host(:enabled) .switch:active .checked-indicator {
                forced-color-adjust: none;
                background: ${De.FieldText};
            }
            .switch {
                forced-color-adjust: none;
                background: ${De.Field};
                border-color: ${De.FieldText};
            }
            :host(:enabled) .switch:hover {
                background: ${De.HighlightText};
                border-color: ${De.Highlight};
            }
            :host(.checked) .switch {
                background: ${De.Highlight};
                border-color: ${De.Highlight};
            }
            :host(.checked:enabled) .switch:hover,
            :host(:enabled) .switch:active {
                background: ${De.HighlightText};
                border-color: ${De.Highlight};
            }
            :host(.checked) .checked-indicator {
                background: ${De.HighlightText};
            }
            :host(.checked:enabled) .switch:hover .checked-indicator {
                background: ${De.Highlight};
            }
            :host(:${Ye}) .switch {
                border-color: ${De.Highlight};
                box-shadow: 0 0 0 2px ${De.Field}, 0 0 0 4px ${De.FieldText};
            }
            :host(.checked:${Ye}:enabled) .switch {
                box-shadow: 0 0 0 2px ${De.Field}, 0 0 0 4px ${De.FieldText};
            }
            :host(.disabled) {
                opacity: 1;
            }
            :host(.disabled) .checked-indicator {
                background: ${De.GrayText};
            }
            :host(.disabled) .switch {
                background: ${De.Field};
                border-color: ${De.GrayText};
            }
        `)
);
let ia = class extends No {};
ia = t([ht({ name: "fast-switch", template: Mo, styles: oa })], ia);
const ra = kt`
    ${Qe("grid")} :host {
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
        ls,
        qn,
        Xe(kt`
            .activeIndicator,
            :host(.vertical) .activeIndicator {
                forced-color-adjust: none;
                background: ${De.Highlight};
            }
        `)
    ),
    na = kt`
    ${Qe("inline-flex")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        ${""} font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        height: calc(${ys} * 1px);
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

    :host(:${Ye}) {
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
        fs,
        qn,
        Gn,
        Wn,
        Xe(kt`
            :host {
                forced-color-adjust: none;
                border-color: transparent;
                color: ${De.ButtonText};
                fill: ${De.ButtonText};
            }
            :host(:hover),
            :host(.vertical:hover),
            :host([aria-selected="true"]:hover) {
                background: ${De.Highlight};
                color: ${De.HighlightText};
                fill: ${De.HighlightText};
            }
            :host([aria-selected="true"]) {
                background: ${De.HighlightText};
                color: ${De.Highlight};
                fill: ${De.Highlight};
            }
            :host(:${Ye}) {
                border-color: ${De.ButtonText};
                box-shadow: none;
            }
        `)
    );
let sa = class extends qo {};
sa = t([ht({ name: "fast-tab", template: Vo, styles: na })], sa);
const aa = kt`
    ${Qe("flex")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        ${""} font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        padding: 0 calc((6 + (var(--design-unit) * 2 * var(--density))) * 1px);
    }
`;
let la = class extends Wo {};
la = t([ht({ name: "fast-tab-panel", template: Go, styles: aa })], la);
let ca = class extends _o {};
ca = t([ht({ name: "fast-tabs", template: zo, styles: ra })], ca);
const da = kt`
    ${Qe("inline-block")} :host {
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
        height: calc(${ys} * 2px);
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
    .control:${Ye},
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
    Jn,
    ss,
    ns,
    Zn,
    fs,
    qn,
    us,
    hs,
    Xe(kt`
            :host([disabled]) {
                opacity: 1;
            }
        `)
);
let ha = class extends Xo {};
ha = t([ht({ name: "fast-text-area", template: Qo, styles: da })], ha);
const ua = kt`
    ${Qe("inline-block")} :host {
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
        height: calc(${ys} * 1px);
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
    .control:${Ye},
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
    Jn,
    ss,
    ns,
    Zn,
    fs,
    qn,
    us,
    hs,
    Xe(kt`
            .root,
            :host(.filled) .root {
                forced-color-adjust: none;
                background: ${De.Field};
                border-color: ${De.FieldText};
            }
            :host(:hover:not(.disabled)) .root,
            :host(.filled:hover:not(.disabled)) .root,
            :host(.filled:hover) .root {
                background: ${De.Field};
                border-color: ${De.Highlight};
            }
            .before-content,
            .after-content {
                fill: ${De.ButtonText};
            }
            :host(.disabled) {
                opacity: 1;
            }
            :host(.disabled) .root,
            :host(.filled:hover.disabled) .root {
                border-color: ${De.GrayText};
                background: ${De.Field};
            }
            :host(:focus-within:enabled) .root {
                border-color: ${De.Highlight};
                box-shadow: 0 0 0 1px ${De.Highlight} inset;
            }
            .control {
                color: ${De.ButtonText};
            }
        `)
);
let pa = class extends ti {};
pa = t(
    [
        ht({
            name: "fast-text-field",
            template: Yo,
            styles: ua,
            shadowOptions: { delegatesFocus: !0 },
        }),
    ],
    pa
);
export {
    Ts as FASTAccordion,
    Es as FASTAnchor,
    Ss as FASTBadge,
    Os as FASTButton,
    Ls as FASTCard,
    Rs as FASTCheckbox,
    _n as FASTDesignSystemProvider,
    Ns as FASTDialog,
    js as FASTDivider,
    Vs as FASTFlipper,
    Gs as FASTProgress,
    Us as FASTProgressRing,
    Xs as FASTRadio,
    Ys as FASTRadioGroup,
    Js as FASTSlider,
    ea as FASTSliderLabel,
    ia as FASTSwitch,
    sa as FASTTab,
    la as FASTTabPanel,
    ca as FASTTabs,
    ha as FASTTextArea,
    pa as FASTTextField,
};
