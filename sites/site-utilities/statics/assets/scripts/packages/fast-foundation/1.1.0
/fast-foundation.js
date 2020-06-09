const t = "fast-" + Math.random().toString(36).substring(7),
    e = [];
void 0 === globalThis.trustedTypes &&
    (globalThis.trustedTypes = { createPolicy: (t, e) => e });
const i = globalThis.trustedTypes.createPolicy("fast-html", { createHTML: t => t });
let s = i;
function o() {
    let t = 0;
    for (; t < e.length; ) {
        if ((e[t].call(), t++, t > 1024)) {
            for (let i = 0, s = e.length - t; i < s; i++) e[i] = e[i + t];
            (e.length -= t), (t = 0);
        }
    }
    e.length = 0;
}
const n = Object.freeze({
    setHTMLPolicy(t) {
        if (s !== i) throw new Error("The HTML policy can only be set once.");
        s = t;
    },
    createHTML: t => s.createHTML(t),
    isMarker: e => e && 8 === e.nodeType && e.data.startsWith(t),
    extractDirectiveIndexFromMarker: e => parseInt(e.data.replace(t + ":", "")),
    createInterpolationPlaceholder: t => `@{${t}}`,
    createCustomAttributePlaceholder(t, e) {
        return `${t}="${this.createInterpolationPlaceholder(e)}"`;
    },
    createBlockPlaceholder: e => `\x3c!--${t}:${e}--\x3e`,
    queueUpdate(t) {
        e.length < 1 && window.requestAnimationFrame(o), e.push(t);
    },
    nextUpdate: () =>
        new Promise(t => {
            n.queueUpdate(t);
        }),
    setAttribute(t, e, i) {
        null == i ? t.removeAttribute(e) : t.setAttribute(e, i);
    },
    setBooleanAttribute(t, e, i) {
        i ? t.setAttribute(e, "") : t.removeAttribute(e);
    },
});
function r(t) {
    const e = this.spillover;
    -1 === e.indexOf(t) && e.push(t);
}
function a(t) {
    const e = this.spillover,
        i = e.indexOf(t);
    -1 !== i && e.splice(i, 1);
}
function l(t) {
    const e = this.spillover,
        i = this.source;
    for (let s = 0, o = e.length; s < o; ++s) e[s].handleChange(i, t);
}
function d(t) {
    return -1 !== this.spillover.indexOf(t);
}
class c {
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
                      (this.subscribe = r),
                      (this.unsubscribe = a),
                      (this.notify = l),
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
            i = this.sub2,
            s = this.source;
        void 0 !== e && e.handleChange(s, t), void 0 !== i && i.handleChange(s, t);
    }
}
class h {
    constructor(t) {
        (this.subscribers = {}), (this.source = t);
    }
    notify(t) {
        const e = this.subscribers[t];
        void 0 !== e && e.notify(t);
    }
    subscribe(t, e) {
        let i = this.subscribers[e];
        void 0 === i && (this.subscribers[e] = i = new c(this.source)), i.subscribe(t);
    }
    unsubscribe(t, e) {
        const i = this.subscribers[e];
        void 0 !== i && i.unsubscribe(t);
    }
}
const u = new WeakMap(),
    p = new WeakMap();
let m = void 0,
    b = t => {
        throw new Error("Must call enableArrayObservation before observing arrays.");
    };
class f {
    constructor(t, e) {
        (this.name = t),
            (this.field = "_" + t),
            (this.callback = t + "Changed"),
            (this.hasCallback = this.callback in e);
    }
    getValue(t) {
        return void 0 !== m && m.watch(t, this.name), t[this.field];
    }
    setValue(t, e) {
        const i = this.field,
            s = t[i];
        s !== e &&
            ((t[i] = e),
            this.hasCallback && t[this.callback](s, e),
            y(t).notify(this.name));
    }
}
const v = Object.freeze({
        setArrayObserverFactory(t) {
            b = t;
        },
        getNotifier(t) {
            let e = t.$fastController || u.get(t);
            return (
                void 0 === e &&
                    (Array.isArray(t) ? (e = b(t)) : u.set(t, (e = new h(t)))),
                e
            );
        },
        track(t, e) {
            void 0 !== m && m.watch(t, e);
        },
        notify(t, e) {
            y(t).notify(e);
        },
        defineProperty(t, e) {
            "string" == typeof e && (e = new f(e, t)),
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
            let e = p.get(t);
            if (void 0 === e) {
                let i = Reflect.getPrototypeOf(t);
                for (; void 0 === e && null !== i; )
                    (e = p.get(i)), (i = Reflect.getPrototypeOf(i));
                (e = void 0 === e ? [] : e.slice(0)), p.set(t, e);
            }
            return e;
        },
        binding: (t, e) => new I(t, e),
    }),
    y = v.getNotifier,
    g = n.queueUpdate;
function x(t, e) {
    v.defineProperty(t, e);
}
let k = null;
function C(t) {
    k = t;
}
class $ {
    constructor() {
        (this.index = 0), (this.length = 0), (this.parent = null);
    }
    get event() {
        return k;
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
v.defineProperty($.prototype, "index"), v.defineProperty($.prototype, "length");
const w = new $();
class I extends c {
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
        const i = m;
        (m = this.needsRefresh ? this : void 0), (this.needsRefresh = !1);
        const s = this.binding(t, e);
        return (m = i), s;
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
        const i = this.last,
            s = y(t),
            o = null === i ? this.first : {};
        if (
            ((o.propertySource = t),
            (o.propertyName = e),
            (o.notifier = s),
            s.subscribe(this, e),
            null !== i)
        ) {
            if (!this.needsRefresh) {
                m = void 0;
                const e = i.propertySource[i.propertyName];
                (m = this), t === e && (this.needsRefresh = !0);
            }
            i.next = o;
        }
        this.last = o;
    }
    handleChange() {
        this.needsQueue && ((this.needsQueue = !1), g(this));
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
class O extends T {
    constructor(t, e, i) {
        super(), (this.name = t), (this.behavior = e), (this.options = i);
    }
    createPlaceholder(t) {
        return n.createCustomAttributePlaceholder(this.name, t);
    }
    createBehavior(t) {
        return new this.behavior(t, this.options);
    }
}
function E(t, e) {
    (this.source = t),
        (this.context = e),
        null === this.bindingObserver &&
            (this.bindingObserver = v.binding(this.binding, this)),
        this.updateTarget(this.bindingObserver.observe(t, e));
}
function P(t, e) {
    (this.source = t),
        (this.context = e),
        this.target.addEventListener(this.targetName, this, !0);
}
function L() {
    this.bindingObserver.disconnect(), (this.source = null), (this.context = null);
}
function A() {
    this.bindingObserver.disconnect(), (this.source = null), (this.context = null);
    const t = this.target.$fastView;
    void 0 !== t && t.isComposed && (t.unbind(), (t.needsBindOnly = !0));
}
function S() {
    this.target.removeEventListener(this.targetName, this, !0),
        (this.source = null),
        (this.context = null);
}
function M(t) {
    n.setAttribute(this.target, this.targetName, t);
}
function N(t) {
    n.setBooleanAttribute(this.target, this.targetName, t);
}
function D(t) {
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
function H(t) {
    this.target[this.targetName] = t;
}
function R(t) {
    const e = this.classVersions || Object.create(null),
        i = this.target;
    let s = this.version || 0;
    if (null != t && t.length) {
        const o = t.split(/\s+/);
        for (let t = 0, n = o.length; t < n; ++t) {
            const n = o[t];
            "" !== n && ((e[n] = s), i.classList.add(n));
        }
    }
    if (((this.classVersions = e), (this.version = s + 1), 0 !== s)) {
        s -= 1;
        for (const t in e) e[t] === s && i.classList.remove(t);
    }
}
class F extends T {
    constructor(t) {
        super(),
            (this.binding = t),
            (this.createPlaceholder = n.createInterpolationPlaceholder),
            (this.bind = E),
            (this.unbind = L),
            (this.updateTarget = M);
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
                        (this.updateTarget = H),
                        "innerHTML" === this.cleanedTargetName)
                    ) {
                        const t = this.binding;
                        this.binding = (e, i) => n.createHTML(t(e, i));
                    }
                    break;
                case "?":
                    (this.cleanedTargetName = t.substr(1)), (this.updateTarget = N);
                    break;
                case "@":
                    (this.cleanedTargetName = t.substr(1)),
                        (this.bind = P),
                        (this.unbind = S);
                    break;
                default:
                    (this.cleanedTargetName = t),
                        "class" === t && (this.updateTarget = R);
            }
    }
    targetAtContent() {
        (this.updateTarget = D), (this.unbind = A);
    }
    createBehavior(t) {
        return new j(
            t,
            this.binding,
            this.bind,
            this.unbind,
            this.updateTarget,
            this.cleanedTargetName
        );
    }
}
class j {
    constructor(t, e, i, s, o, n) {
        (this.target = t),
            (this.binding = e),
            (this.bind = i),
            (this.unbind = s),
            (this.updateTarget = o),
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
const B = { locatedDirectives: 0, targetIndex: -1 };
function V(t) {
    let e;
    const i = t.length,
        s = t.map(t =>
            "string" == typeof t
                ? () => t
                : ((e = t.targetName || e), B.locatedDirectives++, t.binding)
        ),
        o = new F((t, e) => {
            let o = "";
            for (let n = 0; n < i; ++n) o += s[n](t, e);
            return o;
        });
    return (o.targetName = e), o;
}
function z(t, e) {
    let i = t.indexOf("@{", 0);
    const s = t.length;
    let o,
        n,
        r,
        a = 0,
        l = 0,
        d = null,
        c = 0;
    for (; i >= 0 && i < s - 2; ) {
        (l = 1), (n = i), (i += 2);
        do {
            (o = t[i]),
                i++,
                "'" !== o && '"' !== o
                    ? "\\" !== o
                        ? null === d && ("{" === o ? l++ : "}" === o && l--)
                        : i++
                    : null === d
                    ? (d = o)
                    : d === o && (d = null);
        } while (l > 0 && i < s);
        if (0 !== l) break;
        if (((r = r || []), "\\" === t[n - 1] && "\\" !== t[n - 2]))
            (r[c] = t.substring(a, n - 1) + t.substring(n, i)), c++;
        else {
            (r[c] = t.substring(a, n)), c++;
            const s = e[parseInt(t.substring(n + 2, i - 1))];
            (r[c] = s), c++;
        }
        (a = i), (i = t.indexOf("@{", i));
    }
    return 0 === c
        ? null
        : ((r[c] = t.substr(a)), (r = r.filter(t => "" !== t)), 1 == r.length ? r[0] : r);
}
function q(t, e, i, s = !1) {
    const o = t.attributes;
    for (let n = 0, r = o.length; n < r; ++n) {
        const a = o[n],
            l = a.value;
        let d = z(l, e);
        null === d
            ? s && ((d = new F(() => l)), (d.targetName = a.name))
            : Array.isArray(d)
            ? (d = V(d))
            : B.locatedDirectives++,
            null !== d &&
                (t.removeAttributeNode(a),
                n--,
                r--,
                (d.targetIndex = B.targetIndex),
                i.push(d));
    }
}
function W(t, e) {
    t.targetAtContent(),
        (t.targetIndex = B.targetIndex),
        e.push(t),
        B.locatedDirectives++;
}
function U(t, e, i, s) {
    const o = z(t.textContent, e);
    if (null !== o)
        if (Array.isArray(o)) {
            let e = t;
            for (let n = 0, r = o.length; n < r; ++n) {
                const r = o[n],
                    a =
                        0 === n
                            ? t
                            : e.parentNode.insertBefore(
                                  document.createTextNode(""),
                                  e.nextSibling
                              );
                "string" == typeof r
                    ? (a.textContent = r)
                    : ((a.textContent = " "), W(r, i)),
                    (e = a),
                    B.targetIndex++,
                    a !== t && s.nextNode();
            }
            B.targetIndex--;
        } else (t.textContent = " "), W(o, i);
}
const K = document.createRange();
class _ {
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
                i = this.lastChild;
            let s,
                o = this.firstChild;
            for (; o !== i; ) (s = o.nextSibling), e.insertBefore(o, t), (o = s);
            e.insertBefore(i, t);
        }
    }
    remove() {
        const t = this.fragment,
            e = this.lastChild;
        let i,
            s = this.firstChild;
        for (; s !== e; ) (i = s.nextSibling), t.appendChild(s), (s = i);
        t.appendChild(e);
    }
    dispose() {
        const t = this.firstChild.parentNode,
            e = this.lastChild;
        let i,
            s = this.firstChild;
        for (; s !== e; ) (i = s.nextSibling), t.removeChild(s), (s = i);
        t.removeChild(e);
        const o = this.behaviors,
            n = this.source;
        for (let t = 0, e = o.length; t < e; ++t) o[t].unbind(n);
    }
    bind(t, e) {
        const i = this.behaviors;
        if (this.source !== t)
            if (null !== this.source) {
                const s = this.source;
                (this.source = t), (this.context = e);
                for (let o = 0, n = i.length; o < n; ++o) {
                    const n = i[o];
                    n.unbind(s), n.bind(t, e);
                }
            } else {
                (this.source = t), (this.context = e);
                for (let s = 0, o = i.length; s < o; ++s) i[s].bind(t, e);
            }
    }
    unbind() {
        if (null === this.source) return;
        const t = this.behaviors,
            e = this.source;
        for (let i = 0, s = t.length; i < s; ++i) t[i].unbind(e);
        this.source = null;
    }
    static disposeContiguousBatch(t) {
        if (0 !== t.length) {
            K.setStart(t[0].firstChild, 0),
                K.setEnd(t[t.length - 1].lastChild, 0),
                K.deleteContents();
            for (let e = 0, i = t.length; e < i; ++e) {
                const i = t[e],
                    s = i.behaviors,
                    o = i.source;
                for (let t = 0, e = s.length; t < e; ++t) s[t].unbind(o);
            }
        }
    }
}
class G {
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
                (t = document.createElement("template")), (t.innerHTML = n.createHTML(e));
                const i = t.content.firstElementChild;
                null !== i && "TEMPLATE" === i.tagName && (t = i);
            } else t = e;
            const i = (function (t, e) {
                const i = [];
                (B.locatedDirectives = 0), q(t, e, i, !0);
                const s = t.content,
                    o = [],
                    r = e.length,
                    a = document.createTreeWalker(s, 133, null, !1);
                for (B.targetIndex = -1; B.locatedDirectives < r; ) {
                    const t = a.nextNode();
                    if (null === t) break;
                    switch ((B.targetIndex++, t.nodeType)) {
                        case 1:
                            q(t, e, o);
                            break;
                        case 3:
                            U(t, e, o, a);
                            break;
                        case 8:
                            if (n.isMarker(t)) {
                                const i = e[n.extractDirectiveIndexFromMarker(t)];
                                (i.targetIndex = B.targetIndex),
                                    B.locatedDirectives++,
                                    o.push(i);
                            } else t.parentNode.removeChild(t), B.targetIndex--;
                    }
                }
                let l = 0;
                return (
                    n.isMarker(s.firstChild) &&
                        (s.insertBefore(document.createComment(""), s.firstChild),
                        (l = -1)),
                    {
                        fragment: s,
                        viewBehaviorFactories: o,
                        hostBehaviorFactories: i,
                        targetOffset: l,
                    }
                );
            })(t, this.directives);
            (this.fragment = i.fragment),
                (this.viewBehaviorFactories = i.viewBehaviorFactories),
                (this.hostBehaviorFactories = i.hostBehaviorFactories),
                (this.targetOffset = i.targetOffset),
                (this.behaviorCount =
                    this.viewBehaviorFactories.length +
                    this.hostBehaviorFactories.length),
                (this.hasHostBehaviors = this.hostBehaviorFactories.length > 0);
        }
        const e = this.fragment.cloneNode(!0),
            i = this.viewBehaviorFactories,
            s = new Array(this.behaviorCount),
            o = document.createTreeWalker(e, 133, null, !1);
        let r = 0,
            a = this.targetOffset,
            l = o.nextNode();
        for (let t = i.length; r < t; ++r) {
            const t = i[r],
                e = t.targetIndex;
            for (; null !== l; ) {
                if (a === e) {
                    s[r] = t.createBehavior(l);
                    break;
                }
                (l = o.nextNode()), a++;
            }
        }
        if (this.hasHostBehaviors) {
            const e = this.hostBehaviorFactories;
            for (let i = 0, o = e.length; i < o; ++i, ++r) s[r] = e[i].createBehavior(t);
        }
        return new _(e, s);
    }
    render(t, e) {
        "string" == typeof e && (e = document.getElementById(e));
        const i = this.create(e);
        return i.bind(t, w), i.appendTo(e), i;
    }
}
const Q = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
function X(t, ...e) {
    const i = [];
    let s = "";
    for (let o = 0, n = t.length - 1; o < n; ++o) {
        const n = t[o];
        let r = e[o];
        if (((s += n), r instanceof G)) {
            const t = r;
            r = () => t;
        }
        if ("function" == typeof r) {
            r = new F(r);
            const t = Q.exec(n);
            null !== t && (r.targetName = t[2]);
        }
        r instanceof T ? ((s += r.createPlaceholder(i.length)), i.push(r)) : (s += r);
    }
    return (s += t[t.length - 1]), new G(s, i);
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
    constructor(t, e, i = e.toLowerCase(), s = "reflect", o) {
        (this.Owner = t),
            (this.name = e),
            (this.attribute = i),
            (this.mode = s),
            (this.converter = o),
            (this.guards = new Set()),
            (this.fieldName = "_" + e),
            (this.callbackName = e + "Changed"),
            (this.hasCallback = this.callbackName in t.prototype),
            "boolean" === s && void 0 === o && (this.converter = Y);
    }
    setValue(t, e) {
        const i = t[this.fieldName],
            s = this.converter;
        void 0 !== s && (e = s.fromView(e)),
            i !== e &&
                ((t[this.fieldName] = e),
                this.tryReflectToAttribute(t),
                this.hasCallback && t[this.callbackName](i, e),
                t.$fastController.notify(this.name));
    }
    getValue(t) {
        return v.track(t, this.name), t[this.fieldName];
    }
    onAttributeChangedCallback(t, e) {
        this.guards.has(t) ||
            (this.guards.add(t), this.setValue(t, e), this.guards.delete(t));
    }
    tryReflectToAttribute(t) {
        const e = this.mode,
            i = this.guards;
        i.has(t) ||
            "fromView" === e ||
            n.queueUpdate(() => {
                i.add(t);
                const s = t[this.fieldName];
                switch (e) {
                    case "reflect":
                        const e = this.converter;
                        n.setAttribute(t, this.attribute, void 0 !== e ? e.toView(s) : s);
                        break;
                    case "boolean":
                        n.setBooleanAttribute(t, this.attribute, s);
                }
                i.delete(t);
            });
    }
    static collect(t, ...e) {
        const i = [];
        e.push(t.attributes);
        for (let s = 0, o = e.length; s < o; ++s) {
            const o = e[s];
            if (void 0 !== o)
                for (let e = 0, s = o.length; e < s; ++e) {
                    const s = o[e];
                    "string" == typeof s
                        ? i.push(new J(t, s))
                        : i.push(new J(t, s.property, s.attribute, s.mode, s.converter));
                }
        }
        return i;
    }
}
function tt(t, e) {
    let i;
    function s(t, e) {
        arguments.length > 1 && (i.property = e);
        const s = t.constructor.attributes || (t.constructor.attributes = []);
        s.push(i);
    }
    return arguments.length > 1
        ? ((i = {}), void s(t, e))
        : ((i = void 0 === t ? {} : t), s);
}
class et {
    constructor(t, e, i, s, o, n, r, a) {
        (this.name = t),
            (this.attributes = e),
            (this.propertyLookup = i),
            (this.attributeLookup = s),
            (this.template = o),
            (this.styles = n),
            (this.shadowOptions = r),
            (this.elementOptions = a);
    }
}
const it = new Map();
function st(t) {
    return it.get(t);
}
const ot = { bubbles: !0, composed: !0 };
class nt extends h {
    constructor(t, e) {
        super(t),
            (this.element = t),
            (this.definition = e),
            (this.view = null),
            (this.isConnected = !1),
            (this.boundObservables = null),
            (this.behaviors = null);
        const i = e.template,
            s = e.styles,
            o = void 0 === e.shadowOptions ? void 0 : t.attachShadow(e.shadowOptions);
        if (void 0 !== i) {
            const e = (this.view = i.create(this.element));
            void 0 === o ? e.appendTo(t) : e.appendTo(o);
        }
        void 0 !== s && this.addStyles(s, o);
        const n = v.getAccessors(t);
        if (n.length > 0) {
            const e = (this.boundObservables = Object.create(null));
            for (let i = 0, s = n.length; i < s; ++i) {
                const s = n[i].name,
                    o = t[s];
                void 0 !== o && (delete t[s], (e[s] = o));
            }
        }
    }
    addStyles(t, e = this.element.shadowRoot) {
        null !== e && t.addStylesTo(e);
        const i = t.behaviors;
        null !== i && this.addBehaviors(i);
    }
    removeStyles(t) {
        const e = this.element.shadowRoot;
        null !== e && t.removeStylesFrom(e);
        const i = t.behaviors;
        null !== i && this.removeBehaviors(i);
    }
    addBehaviors(t) {
        const e = this.behaviors || (this.behaviors = []),
            i = t.length;
        for (let s = 0; s < i; ++s) e.push(t[s]);
        if (this.isConnected) {
            const e = this.element;
            for (let s = 0; s < i; ++s) t[s].bind(e, w);
        }
    }
    removeBehaviors(t) {
        const e = this.behaviors;
        if (null === e) return;
        const i = t.length;
        for (let s = 0; s < i; ++s) {
            const i = e.indexOf(t[s]);
            -1 !== i && e.splice(i, 1);
        }
        if (this.isConnected) {
            const e = this.element;
            for (let s = 0; s < i; ++s) t[s].unbind(e);
        }
    }
    onConnectedCallback() {
        if (this.isConnected) return;
        const t = this.element,
            e = this.boundObservables;
        if (null !== e) {
            const i = Object.keys(e);
            for (let s = 0, o = i.length; s < o; ++s) {
                const o = i[s];
                t[o] = e[o];
            }
            this.boundObservables = null;
        }
        const i = this.view;
        null !== i && i.bind(t, w);
        const s = this.behaviors;
        if (null !== s) for (let e = 0, i = s.length; e < i; ++e) s[e].bind(t, w);
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
            for (let i = 0, s = e.length; i < s; ++i) e[i].unbind(t);
        }
    }
    onAttributeChangedCallback(t, e, i) {
        const s = this.definition.attributeLookup[t];
        void 0 !== s && s.onAttributeChangedCallback(this.element, i);
    }
    emit(t, e, i) {
        return (
            !!this.isConnected &&
            this.element.dispatchEvent(
                new CustomEvent(t, Object.assign(Object.assign({ detail: e }, ot), i))
            )
        );
    }
    static forCustomElement(t) {
        const e = t.$fastController;
        if (void 0 !== e) return e;
        const i = st(t.constructor);
        if (void 0 === i) throw new Error("Missing fast element definition.");
        return (t.$fastController = new nt(t, i));
    }
}
const rt = { mode: "open" },
    at = {};
function lt(t) {
    return class extends t {
        constructor() {
            super(), nt.forCustomElement(this);
        }
        $emit(t, e, i) {
            return this.$fastController.emit(t, e, i);
        }
        connectedCallback() {
            this.$fastController.onConnectedCallback();
        }
        disconnectedCallback() {
            this.$fastController.onDisconnectedCallback();
        }
        attributeChangedCallback(t, e, i) {
            this.$fastController.onAttributeChangedCallback(t, e, i);
        }
    };
}
const dt = Object.assign(lt(HTMLElement), {
    from: t => lt(t),
    define(t, e = t.definition) {
        "string" == typeof e && (e = { name: e });
        const i = e.name,
            s = J.collect(t, e.attributes),
            o =
                void 0 === e.shadowOptions
                    ? rt
                    : null === e.shadowOptions
                    ? void 0
                    : Object.assign(Object.assign({}, rt), e.shadowOptions),
            n =
                void 0 === e.elementOptions
                    ? at
                    : Object.assign(Object.assign({}, at), e.shadowOptions),
            r = new Array(s.length),
            a = t.prototype,
            l = {},
            d = {};
        for (let t = 0, e = s.length; t < e; ++t) {
            const e = s[t];
            (r[t] = e.attribute),
                (l[e.name] = e),
                (d[e.attribute] = e),
                v.defineProperty(a, e);
        }
        Reflect.defineProperty(t, "observedAttributes", { value: r, enumerable: !0 });
        const c = new et(i, s, l, d, e.template, e.styles, o, n);
        return it.set(t, c), customElements.define(i, t, c.elementOptions), t;
    },
    getDefinition: st,
});
const ct = Object.freeze([]);
class ht {
    constructor(t, e) {
        (this.target = t), (this.propertyName = e);
    }
    bind(t) {
        t[this.propertyName] = this.target;
    }
    unbind() {}
}
function ut(t) {
    return new O("fast-ref", ht, t);
}
function pt(t, e) {
    const i = "function" == typeof e ? e : () => e;
    return (e, s) => (t(e, s) ? i(e, s) : null);
}
class mt extends class {
    constructor(t, e) {
        (this.target = t), (this.options = e), (this.source = null);
    }
    bind(t) {
        const e = this.options.property;
        (this.shouldUpdate = v.getAccessors(t).some(t => t.name === e)),
            (this.source = t),
            this.updateTarget(this.getNodes()),
            this.shouldUpdate && this.observe();
    }
    unbind() {
        this.updateTarget(ct),
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
function bt(t) {
    return "string" == typeof t && (t = { property: t }), new O("fast-slotted", mt, t);
}
const ft = X`
    <template>
        <slot name="item" part="item" ${bt("accordionItems")}></slot>
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
***************************************************************************** */ function vt(
    t,
    e,
    i,
    s
) {
    var o,
        n = arguments.length,
        r = n < 3 ? e : null === s ? (s = Object.getOwnPropertyDescriptor(e, i)) : s;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
        r = Reflect.decorate(t, e, i, s);
    else
        for (var a = t.length - 1; a >= 0; a--)
            (o = t[a]) && (r = (n < 3 ? o(r) : n > 3 ? o(e, i, r) : o(e, i)) || r);
    return n > 3 && r && Object.defineProperty(e, i, r), r;
}
var yt;
!(function (t) {
    (t.horizontal = "horizontal"), (t.vertical = "vertical");
})(yt || (yt = {}));
var gt = "object" == typeof global && global && global.Object === Object && global,
    xt = "object" == typeof self && self && self.Object === Object && self,
    kt = gt || xt || Function("return this")(),
    Ct = kt.Symbol,
    $t = Object.prototype,
    wt = $t.hasOwnProperty,
    It = $t.toString,
    Tt = Ct ? Ct.toStringTag : void 0;
var Ot = Object.prototype.toString;
var Et = Ct ? Ct.toStringTag : void 0;
function Pt(t) {
    return null == t
        ? void 0 === t
            ? "[object Undefined]"
            : "[object Null]"
        : Et && Et in Object(t)
        ? (function (t) {
              var e = wt.call(t, Tt),
                  i = t[Tt];
              try {
                  t[Tt] = void 0;
                  var s = !0;
              } catch (t) {}
              var o = It.call(t);
              return s && (e ? (t[Tt] = i) : delete t[Tt]), o;
          })(t)
        : (function (t) {
              return Ot.call(t);
          })(t);
}
function Lt(t) {
    return null != t && "object" == typeof t;
}
var At = Array.isArray;
function St(t) {
    var e = typeof t;
    return null != t && ("object" == e || "function" == e);
}
var Mt = /^\s+|\s+$/g,
    Nt = /^[-+]0x[0-9a-f]+$/i,
    Dt = /^0b[01]+$/i,
    Ht = /^0o[0-7]+$/i,
    Rt = parseInt;
function Ft(t) {
    if ("number" == typeof t) return t;
    if (
        (function (t) {
            return "symbol" == typeof t || (Lt(t) && "[object Symbol]" == Pt(t));
        })(t)
    )
        return NaN;
    if (St(t)) {
        var e = "function" == typeof t.valueOf ? t.valueOf() : t;
        t = St(e) ? e + "" : e;
    }
    if ("string" != typeof t) return 0 === t ? t : +t;
    t = t.replace(Mt, "");
    var i = Dt.test(t);
    return i || Ht.test(t) ? Rt(t.slice(2), i ? 2 : 8) : Nt.test(t) ? NaN : +t;
}
function jt(t) {
    return t
        ? (t = Ft(t)) === 1 / 0 || t === -1 / 0
            ? 17976931348623157e292 * (t < 0 ? -1 : 1)
            : t == t
            ? t
            : 0
        : 0 === t
        ? t
        : 0;
}
var Bt = /^(?:0|[1-9]\d*)$/;
function Vt(t, e) {
    var i = typeof t;
    return (
        !!(e = null == e ? 9007199254740991 : e) &&
        ("number" == i || ("symbol" != i && Bt.test(t))) &&
        t > -1 &&
        t % 1 == 0 &&
        t < e
    );
}
function zt(t) {
    return "number" == typeof t && t > -1 && t % 1 == 0 && t <= 9007199254740991;
}
function qt(t) {
    return (
        null != t &&
        zt(t.length) &&
        !(function (t) {
            if (!St(t)) return !1;
            var e = Pt(t);
            return (
                "[object Function]" == e ||
                "[object GeneratorFunction]" == e ||
                "[object AsyncFunction]" == e ||
                "[object Proxy]" == e
            );
        })(t)
    );
}
var Wt = Object.prototype;
function Ut(t) {
    return Lt(t) && "[object Arguments]" == Pt(t);
}
var Kt = Object.prototype,
    _t = Kt.hasOwnProperty,
    Gt = Kt.propertyIsEnumerable,
    Qt = Ut(
        (function () {
            return arguments;
        })()
    )
        ? Ut
        : function (t) {
              return Lt(t) && _t.call(t, "callee") && !Gt.call(t, "callee");
          };
var Xt = "object" == typeof exports && exports && !exports.nodeType && exports,
    Yt = Xt && "object" == typeof module && module && !module.nodeType && module,
    Zt = Yt && Yt.exports === Xt ? kt.Buffer : void 0,
    Jt =
        (Zt ? Zt.isBuffer : void 0) ||
        function () {
            return !1;
        },
    te = {};
(te["[object Float32Array]"] = te["[object Float64Array]"] = te[
    "[object Int8Array]"
] = te["[object Int16Array]"] = te["[object Int32Array]"] = te[
    "[object Uint8Array]"
] = te["[object Uint8ClampedArray]"] = te["[object Uint16Array]"] = te[
    "[object Uint32Array]"
] = !0),
    (te["[object Arguments]"] = te["[object Array]"] = te["[object ArrayBuffer]"] = te[
        "[object Boolean]"
    ] = te["[object DataView]"] = te["[object Date]"] = te["[object Error]"] = te[
        "[object Function]"
    ] = te["[object Map]"] = te["[object Number]"] = te["[object Object]"] = te[
        "[object RegExp]"
    ] = te["[object Set]"] = te["[object String]"] = te["[object WeakMap]"] = !1);
var ee,
    ie = "object" == typeof exports && exports && !exports.nodeType && exports,
    se = ie && "object" == typeof module && module && !module.nodeType && module,
    oe = se && se.exports === ie && gt.process,
    ne = (function () {
        try {
            var t = se && se.require && se.require("util").types;
            return t || (oe && oe.binding && oe.binding("util"));
        } catch (t) {}
    })(),
    re = ne && ne.isTypedArray,
    ae = re
        ? ((ee = re),
          function (t) {
              return ee(t);
          })
        : function (t) {
              return Lt(t) && zt(t.length) && !!te[Pt(t)];
          },
    le = Object.prototype.hasOwnProperty;
function de(t, e) {
    var i = At(t),
        s = !i && Qt(t),
        o = !i && !s && Jt(t),
        n = !i && !s && !o && ae(t),
        r = i || s || o || n,
        a = r
            ? (function (t, e) {
                  for (var i = -1, s = Array(t); ++i < t; ) s[i] = e(i);
                  return s;
              })(t.length, String)
            : [],
        l = a.length;
    for (var d in t)
        (!e && !le.call(t, d)) ||
            (r &&
                ("length" == d ||
                    (o && ("offset" == d || "parent" == d)) ||
                    (n && ("buffer" == d || "byteLength" == d || "byteOffset" == d)) ||
                    Vt(d, l))) ||
            a.push(d);
    return a;
}
var ce = (function (t, e) {
        return function (i) {
            return t(e(i));
        };
    })(Object.keys, Object),
    he = Object.prototype.hasOwnProperty;
function ue(t) {
    if (
        ((i = (e = t) && e.constructor),
        e !== (("function" == typeof i && i.prototype) || Wt))
    )
        return ce(t);
    var e,
        i,
        s = [];
    for (var o in Object(t)) he.call(t, o) && "constructor" != o && s.push(o);
    return s;
}
function pe(t) {
    return qt(t) ? de(t) : ue(t);
}
var me,
    be = function (t, e, i) {
        for (var s = -1, o = Object(t), n = i(t), r = n.length; r--; ) {
            var a = n[me ? r : ++s];
            if (!1 === e(o[a], a, o)) break;
        }
        return t;
    };
var fe = Math.max,
    ve = Math.min;
function ye(t, e, i) {
    return (
        (e = jt(e)),
        void 0 === i ? ((i = e), (e = 0)) : (i = jt(i)),
        (function (t, e, i) {
            return t >= ve(e, i) && t < fe(e, i);
        })((t = Ft(t)), e, i)
    );
}
function ge(t, e, i, s) {
    return (
        (function (t, e) {
            t && be(t, e, pe);
        })(t, function (t, o, n) {
            e(s, i(t), o, n);
        }),
        s
    );
}
var xe,
    ke,
    Ce = Object.prototype.toString,
    $e =
        ((xe = function (t, e, i) {
            null != e && "function" != typeof e.toString && (e = Ce.call(e)), (t[e] = i);
        }),
        (ke = (function (t) {
            return function () {
                return t;
            };
        })(function (t) {
            return t;
        })),
        function (t, e) {
            return ge(t, xe, ke(e), {});
        });
let we;
var Ie;
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
})(Ie || (Ie = {}));
var Te;
function Oe(t, e, i) {
    return i < t ? e : i > e ? t : i;
}
!(function (t) {
    (t.ltr = "ltr"), (t.rtl = "rtl");
})(Te || (Te = {}));
class Ee {
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
const Pe = X`
    <span class="end" part="end" ${ut("endContainer")}>
        <slot
            name="end"
            ${ut("end")}
            @slotchange=${t => t.handleEndContentChange()}
        ></slot>
    </span>
`,
    Le = X`
    <span class="start" part="start" ${ut("startContainer")}>
        <slot
            name="start"
            ${ut("start")}
            @slotchange=${t => t.handleStartContentChange()}
        ></slot>
    </span>
`,
    Ae = X`
    <template
        class="${t => (t.expanded ? "expanded" : "")}"
        slot="item"
    >
        <div
            class="heading"
            part="heading"
            role="heading"
            aria-level="${t => t.headinglevel}"
        >
            <button
                class="button"
                part="button"
                ${ut("expandbutton")}
                aria-expanded="${t => t.expanded}"
                aria-controls="${t => t.id}-panel"
                id="${t => t.id}"
                @click="${(t, e) => t.clickHandler(e.event)}"
            >
                <span class="heading">
                    <slot name="heading" part="heading"></slot>
                </span>
            </button>
            ${Le}
            ${Pe}
            <span class="icon" part="icon">
                <slot name="expanded-icon" part="expanded-icon"></slot>
                <slot name="collapsed-icon" part="collapsed-icon"></slot>
            <span>
        </div>
        <div
            class="region"
            id="${t => t.id}-panel"
            role="region"
            aria-labelledby="${t => t.id}"
        >
            <slot></slot>
        </div>
    </template>
`;
function Se(t, ...e) {
    e.forEach(e => {
        Object.getOwnPropertyNames(e.prototype).forEach(i => {
            Object.defineProperty(
                t.prototype,
                i,
                Object.getOwnPropertyDescriptor(e.prototype, i)
            );
        });
    });
}
class Me extends dt {
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
var Ne;
vt(
    [tt({ attribute: "heading-level", mode: "fromView", converter: Z })],
    Me.prototype,
    "headinglevel",
    void 0
),
    vt([tt({ mode: "boolean" })], Me.prototype, "expanded", void 0),
    vt([tt], Me.prototype, "id", void 0),
    Se(Me, Ee),
    (function (t) {
        (t.single = "single"), (t.multi = "multi");
    })(Ne || (Ne = {}));
class De extends dt {
    constructor() {
        super(...arguments),
            (this.expandmode = Ne.multi),
            (this.activeItemIndex = 0),
            (this.change = () => {
                this.$emit("change");
            }),
            (this.setItems = () => {
                (this.accordionIds = this.getItemIds()),
                    this.accordionItems.forEach((t, e) => {
                        t instanceof Me &&
                            (t.addEventListener("change", this.activeItemChange),
                            this.isSingleExpandMode() &&
                                (this.activeItemIndex !== e
                                    ? (t.expanded = !1)
                                    : (t.expanded = !0)));
                        const i = this.accordionIds[e];
                        t.setAttribute(
                            "id",
                            "string" != typeof i ? "accordion-" + (e + 1) : i
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
        return this.expandmode === Ne.single;
    }
    adjust(t) {
        (this.activeItemIndex = Oe(
            0,
            this.accordionItems.length - 1,
            this.activeItemIndex + t
        )),
            this.focusItem();
    }
    focusItem() {
        const t = this.accordionItems[this.activeItemIndex];
        t instanceof Me && t.expandbutton.focus();
    }
}
vt([tt({ attribute: "expand-mode" })], De.prototype, "expandmode", void 0),
    vt([x], De.prototype, "accordionItems", void 0);
const He = X`
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
            ${Le}
            <span class="content" part="content">
                <slot></slot>
            </span>
            ${Pe}
        </a>
    </template>
`;
class Re extends dt {
    constructor() {
        super(...arguments), (this.appearance = "neutral");
    }
}
vt([tt], Re.prototype, "appearance", void 0),
    vt([tt], Re.prototype, "download", void 0),
    vt([tt], Re.prototype, "href", void 0),
    vt([tt], Re.prototype, "hreflang", void 0),
    vt([tt], Re.prototype, "ping", void 0),
    vt([tt], Re.prototype, "referrerpolicy", void 0),
    vt([tt], Re.prototype, "rel", void 0),
    vt([tt], Re.prototype, "target", void 0),
    vt([tt], Re.prototype, "type", void 0),
    Se(Re, Ee);
const Fe = X`
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
class je extends dt {}
vt([tt({ attribute: "fill" })], je.prototype, "fill", void 0),
    vt([tt({ attribute: "color" })], je.prototype, "color", void 0),
    vt([tt({ mode: "boolean" })], je.prototype, "circular", void 0);
const Be = X`
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
            ${Le}
            <span class="content" part="content">
                <slot></slot>
            </span>
            ${Pe}
        </button>
    </template>
`,
    Ve = "ElementInternals" in window;
class ze extends dt {
    constructor() {
        super(),
            (this.value = ""),
            (this.disabled = !1),
            (this.required = !1),
            (this.proxyEventsToBlock = ["change", "click"]),
            Ve && (this.elementInternals = this.attachInternals());
    }
    static get formAssociated() {
        return Ve;
    }
    get validity() {
        return Ve ? this.elementInternals.validity : this.proxy.validity;
    }
    get form() {
        return Ve ? this.elementInternals.form : this.proxy.form;
    }
    get validationMessage() {
        return Ve
            ? this.elementInternals.validationMessage
            : this.proxy.validationMessage;
    }
    get willValidate() {
        return Ve ? this.elementInternals.willValidate : this.proxy.willValidate;
    }
    get labels() {
        if (Ve) return Object.freeze(Array.from(this.elementInternals.labels));
        if (this.proxy instanceof HTMLElement && this.proxy.ownerDocument && this.id) {
            const t = this.proxy.labels,
                e = Array.from(
                    this.proxy.getRootNode().querySelectorAll(`[for='${this.id}']`)
                ),
                i = t ? e.concat(Array.from(t)) : e;
            return Object.freeze(i);
        }
        return ct;
    }
    disabledChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.disabled = this.disabled),
            n.queueUpdate(() => this.classList.toggle("disabled", this.disabled));
    }
    nameChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.name = this.name);
    }
    requiredChanged() {
        this.proxy instanceof HTMLElement && (this.proxy.required = this.required),
            n.queueUpdate(() => this.classList.toggle("required", this.required));
    }
    connectedCallback() {
        super.connectedCallback(),
            Ve ||
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
        return Ve ? this.elementInternals.checkValidity() : this.proxy.checkValidity();
    }
    reportValidity() {
        return Ve ? this.elementInternals.reportValidity() : this.proxy.reportValidity();
    }
    setValidity(t, e, i) {
        Ve
            ? this.elementInternals.setValidity(t, e, i)
            : "string" == typeof e && this.proxy.setCustomValidity(e);
    }
    formDisabledCallback(t) {
        this.disabled = t;
    }
    setFormValue(t, e) {
        Ve && this.elementInternals.setFormValue(t, e);
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
vt([tt], ze.prototype, "value", void 0),
    vt([tt({ mode: "boolean" })], ze.prototype, "disabled", void 0),
    vt([tt], ze.prototype, "name", void 0),
    vt([tt({ mode: "boolean" })], ze.prototype, "required", void 0);
class qe extends ze {
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
vt([tt], qe.prototype, "appearance", void 0),
    vt([tt({ mode: "boolean" })], qe.prototype, "autofocus", void 0),
    vt([tt({ attribute: "form" })], qe.prototype, "formId", void 0),
    vt([tt], qe.prototype, "formaction", void 0),
    vt([tt], qe.prototype, "formenctype", void 0),
    vt([tt], qe.prototype, "formmethod", void 0),
    vt([tt({ mode: "boolean" })], qe.prototype, "formnovalidate", void 0),
    vt([tt], qe.prototype, "formtarget", void 0),
    vt([tt], qe.prototype, "name", void 0),
    vt([tt], qe.prototype, "type", void 0),
    Se(qe, Ee);
const We = X`<slot></slot>`;
class Ue extends dt {}
const Ke = X`
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
            <slot ${bt("defaultSlottedNodes")}></slot>
        </label>
    </template>
`;
class _e extends ze {
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
function Ge(t, e, i) {
    return Object.freeze({
        name: t,
        value: e,
        host: i,
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
function Qe(t) {
    const e = t.parentElement;
    if (e) return e;
    {
        const e = t.getRootNode();
        if (e.host instanceof HTMLElement) return e.host;
    }
    return null;
}
function Xe(t) {
    const e = new WeakMap();
    return i =>
        Object.freeze({
            query: t,
            cache: e,
            sheet: i,
            constructListener(t, e) {
                let i = !1;
                return function () {
                    const { matches: s } = this;
                    s && !i
                        ? (t.$fastController.addStyles(e), (i = s))
                        : !s && i && (t.$fastController.removeStyles(e), (i = s));
                };
            },
            bind(t) {
                const { constructListener: e, query: i, cache: s } = this,
                    o = e(t, this.sheet),
                    n = s.get(t);
                o.bind(i)(),
                    i.addListener(o),
                    void 0 !== n
                        ? Array.isArray(n)
                            ? n.push(o)
                            : s.set(t, [n, o])
                        : s.set(t, o);
            },
            unbind(t) {
                const { cache: e, query: i } = this,
                    s = e.get(t);
                void 0 !== s &&
                    (Array.isArray(s)
                        ? s.forEach(t => i.removeListener(t))
                        : i.removeListener(s),
                    e.delete(t));
            },
        });
}
vt([tt({ attribute: "readonly", mode: "boolean" })], _e.prototype, "readOnly", void 0),
    vt(
        [tt({ attribute: "checked", mode: "boolean" })],
        _e.prototype,
        "checkedAttribute",
        void 0
    ),
    vt([x], _e.prototype, "defaultSlottedNodes", void 0),
    vt([x], _e.prototype, "defaultChecked", void 0),
    vt([x], _e.prototype, "checked", void 0),
    vt([x], _e.prototype, "indeterminate", void 0);
const Ye = Xe(window.matchMedia("(forced-colors)")),
    Ze = "not-allowed",
    Je = "\n    :host([hidden]) {\n        display: none;\n    }\n";
function ti(t) {
    return `\n        ${Je} :host {\n            display: ${t};\n        }\n    `;
}
const ei = (function () {
        if (!0 === (t = we) || !1 === t || (Lt(t) && "[object Boolean]" == Pt(t)))
            return we;
        var t;
        if (
            "undefined" == typeof window ||
            !window.document ||
            !window.document.createElement
        )
            return (we = !1), we;
        const e = document.createElement("style");
        document.head.appendChild(e);
        try {
            e.sheet.insertRule("foo:focus-visible {color:inherit}", 0), (we = !0);
        } catch (t) {
            we = !1;
        } finally {
            document.head.removeChild(e);
        }
        return we;
    })()
        ? "focus-visible"
        : "focus",
    ii = "adoptedStyleSheets" in window.ShadowRoot.prototype;
function si(t) {
    const e = t.provider;
    return null != e && ni.isDesignSystemProvider(e);
}
const oi = {
    bind(t) {
        t.provider = ni.findProvider(t);
    },
    unbind(t) {},
};
class ni extends dt {
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
                    const i = this[e];
                    if (this.isValidDesignSystemValue(i)) {
                        this.designSystem[e] = i;
                        const t = this.designSystemProperties[e];
                        t &&
                            t.cssCustomProperty &&
                            this.setCustomProperty({
                                name: t.cssCustomProperty,
                                value: i,
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
            ii && null !== this.shadowRoot)
        ) {
            const t = new CSSStyleSheet();
            t.insertRule(":host{}"),
                (this.shadowRoot.adoptedStyleSheets = [
                    ...this.shadowRoot.adoptedStyleSheets,
                    t,
                ]),
                (this.customPropertyTarget = t.rules[0].style);
        } else this.customPropertyTarget = this.style;
        this.$fastController.addBehaviors([oi]);
    }
    static get tagNames() {
        return ni._tagNames;
    }
    static isDesignSystemProvider(t) {
        return t.isDesignSystemProvider || -1 !== ni.tagNames.indexOf(t.tagName);
    }
    static findProvider(t) {
        if (si(t)) return t.provider;
        let e = Qe(t);
        for (; null !== e; ) {
            if (ni.isDesignSystemProvider(e)) return (t.provider = e), e;
            if (si(e)) return (t.provider = e.provider), e.provider;
            e = Qe(e);
        }
        return null;
    }
    static registerTagName(t) {
        const e = t.toUpperCase();
        -1 === ni.tagNames.indexOf(e) && ni._tagNames.push(e);
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
                v.getNotifier(t.designSystem).unsubscribe(
                    this.providerDesignSystemChangeHandler,
                    e
                );
            }),
            e instanceof HTMLElement &&
                ni.isDesignSystemProvider(e) &&
                (Object.keys(e.designSystemProperties).forEach(t => {
                    v.getNotifier(e.designSystem).subscribe(
                        this.providerDesignSystemChangeHandler,
                        t
                    );
                }),
                this.syncDesignSystemWithProvider());
    }
    connectedCallback() {
        super.connectedCallback();
        const t = v.getNotifier(this),
            e = v.getNotifier(this.designSystem);
        if (
            (Object.keys(this.designSystemProperties).forEach(i => {
                x(this.designSystem, i),
                    t.subscribe(this.attributeChangeHandler, i),
                    e.subscribe(this.localDesignSystemChangeHandler, i);
                const s = this[i];
                if (this.isValidDesignSystemValue(s)) {
                    this.designSystem[i] = s;
                    const { cssCustomProperty: t } = this.designSystemProperties[i];
                    "string" == typeof t && this.setCustomProperty({ name: t, value: s });
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
                const i = t[e];
                this.isValidDesignSystemValue(i) ||
                    (this.designSystem[e] = this.provider.designSystem[e]);
            });
        }
    }
    isValidDesignSystemValue(t) {
        return null != t;
    }
}
function ri(t) {
    return e => {
        !(function (t) {
            return function (e) {
                dt.define(e, t);
            };
        })(t)(e),
            e.registerTagName("string" == typeof t ? t : t.name);
    };
}
function ai(t) {
    return (e, i) => {
        ((t, e, i) => {
            const { cssCustomProperty: s, attribute: o } = i;
            t.designSystemProperties || (t.designSystemProperties = {}),
                !1 === o
                    ? x(t, e)
                    : (void 0 === i.mode &&
                          (i = Object.assign(Object.assign({}, i), { mode: "fromView" })),
                      tt(i)(t, e)),
                (t.designSystemProperties[e] = {
                    cssCustomProperty:
                        !1 !== s &&
                        ("string" == typeof s ? s : "string" == typeof o ? o : e),
                    default: i.default,
                });
        })(e, i, t);
    };
}
(ni._tagNames = []),
    vt(
        [tt({ attribute: "use-defaults", mode: "boolean" })],
        ni.prototype,
        "useDefaults",
        void 0
    ),
    vt([x], ni.prototype, "provider", void 0);
const li = X`<slot></slot>`,
    di = X`
    <div class="positioning-region" part="positioning-region">
        ${pt(
            t => t.modal,
            X`
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
            ${ut("dialog")}
        >
            <slot></slot>
        </div>
    </div>
`;
var ci = [
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
    hi = ci.join(","),
    ui =
        "undefined" == typeof Element
            ? function () {}
            : Element.prototype.matches ||
              Element.prototype.msMatchesSelector ||
              Element.prototype.webkitMatchesSelector;
function pi(t, e) {
    e = e || {};
    var i,
        s,
        o,
        n = [],
        r = [],
        a = t.querySelectorAll(hi);
    for (
        e.includeContainer &&
            ui.call(t, hi) &&
            (a = Array.prototype.slice.apply(a)).unshift(t),
            i = 0;
        i < a.length;
        i++
    )
        mi((s = a[i])) &&
            (0 === (o = vi(s))
                ? n.push(s)
                : r.push({ documentOrder: i, tabIndex: o, node: s }));
    return r
        .sort(yi)
        .map(function (t) {
            return t.node;
        })
        .concat(n);
}
function mi(t) {
    return !(
        !bi(t) ||
        (function (t) {
            return (
                (function (t) {
                    return gi(t) && "radio" === t.type;
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
        vi(t) < 0
    );
}
function bi(t) {
    return !(
        t.disabled ||
        (function (t) {
            return gi(t) && "hidden" === t.type;
        })(t) ||
        (function (t) {
            return null === t.offsetParent || "hidden" === getComputedStyle(t).visibility;
        })(t)
    );
}
(pi.isTabbable = function (t) {
    if (!t) throw new Error("No node provided");
    return !1 !== ui.call(t, hi) && mi(t);
}),
    (pi.isFocusable = function (t) {
        if (!t) throw new Error("No node provided");
        return !1 !== ui.call(t, fi) && bi(t);
    });
var fi = ci.concat("iframe").join(",");
function vi(t) {
    var e = parseInt(t.getAttribute("tabindex"), 10);
    return isNaN(e)
        ? (function (t) {
              return "true" === t.contentEditable;
          })(t)
            ? 0
            : t.tabIndex
        : e;
}
function yi(t, e) {
    return t.tabIndex === e.tabIndex
        ? t.documentOrder - e.documentOrder
        : t.tabIndex - e.tabIndex;
}
function gi(t) {
    return "INPUT" === t.tagName;
}
var xi = pi;
class ki extends dt {
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
            (this.tabbableElements = xi(this)),
            (this.observer = new MutationObserver(this.onChildListChange)),
            this.observer.observe(this, { childList: !0 }),
            document.addEventListener("keydown", this.handleDocumentKeydown),
            n.queueUpdate(this.trapFocusChanged);
    }
    disconnectedCallback() {
        super.disconnectedCallback(),
            this.observer.disconnect(),
            document.removeEventListener("keydown", this.handleDocumentKeydown),
            this.shouldDialogTrapFocus() &&
                document.removeEventListener("focusin", this.handleDocumentFocus);
    }
    onChildListChange(t, e) {
        t.length && (this.tabbableElements = xi(this));
    }
    isDialogHidden() {
        return "boolean" != typeof this.hidden;
    }
    shouldDialogTrapFocus() {
        return "boolean" == typeof this.trapFocus;
    }
}
vt([tt({ mode: "boolean" })], ki.prototype, "modal", void 0),
    vt([tt({ mode: "boolean" })], ki.prototype, "hidden", void 0),
    vt(
        [tt({ attribute: "trap-focus", mode: "boolean" })],
        ki.prototype,
        "trapFocus",
        void 0
    ),
    vt([tt({ attribute: "aria-describedby" })], ki.prototype, "ariaDescribedby", void 0),
    vt([tt({ attribute: "aria-labelledby" })], ki.prototype, "ariaLabelledby", void 0),
    vt([tt({ attribute: "aria-label" })], ki.prototype, "ariaLabel", void 0);
const Ci = X`<template role=${t => t.role}></template>`;
var $i, wi;
!(function (t) {
    (t.separator = "separator"), (t.presentation = "presentation");
})($i || ($i = {}));
class Ii extends dt {
    constructor() {
        super(...arguments), (this.role = $i.separator);
    }
}
vt([tt], Ii.prototype, "role", void 0),
    (function (t) {
        (t.next = "next"), (t.previous = "previous");
    })(wi || (wi = {}));
class Ti extends dt {
    constructor() {
        super(...arguments), (this.hiddenFromAT = !0), (this.direction = wi.next);
    }
}
vt([tt({ mode: "boolean" })], Ti.prototype, "disabled", void 0),
    vt(
        [tt({ attribute: "aria-hidden", mode: "fromView", converter: Y })],
        Ti.prototype,
        "hiddenFromAT",
        void 0
    ),
    vt([tt], Ti.prototype, "direction", void 0);
const Oi = X`
    <template
        role="button"
        aria-disabled="${t => !!t.disabled || void 0}"
        tabindex="${t => (t.hiddenFromAT ? -1 : 0)}"
        class="${t => t.direction} ${t => (t.disabled ? "disabled" : "")}"
    >
        ${pt(
            t => t.direction === wi.next,
            X`
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
        ${pt(
            t => t.direction === wi.previous,
            X`
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
    Ei = X`
    <template
        role="menu"
        @keydown=${(t, e) => t.handleMenuKeyDown(e.event)}
        @focusout=${(t, e) => t.handleFocusOut(e.event)}
    >
        <slot ${bt("items")}></slot>
    </template>
`;
var Pi;
!(function (t) {
    (t.menuitem = "menuitem"),
        (t.menuitemcheckbox = "menuitemcheckbox"),
        (t.menuitemradio = "menuitemradio");
})(Pi || (Pi = {}));
class Li extends dt {
    constructor() {
        super(...arguments),
            (this.expanded = !1),
            (this.role = Pi.menuitem),
            (this.handleMenuItemKeyDown = t => (this.change(), !0)),
            (this.handleMenuItemClick = t => {
                this.change();
            }),
            (this.change = () => {
                this.$emit("change");
            });
    }
}
vt([tt({ mode: "boolean" })], Li.prototype, "disabled", void 0),
    vt(
        [tt({ attribute: "aria-expanded", mode: "reflect", converter: Y })],
        Li.prototype,
        "expanded",
        void 0
    ),
    vt([tt], Li.prototype, "role", void 0),
    vt([tt], Li.prototype, "checked", void 0),
    Se(Li, Ee);
const Ai = X`
    <template
        role=${t => t.role}
        aria-checked=${t => (t.role !== Pi.menuitem ? t.checked : void 0)}
        aria-disabled=${t => t.disabled}
        @keydown=${(t, e) => t.handleMenuItemKeyDown(e.event)}
        @click=${(t, e) => t.handleMenuItemClick(e.event)}
        class="${t => (t.disabled ? "disabled" : "")} ${t =>
    t.expanded ? "expanded" : ""}"
    >
        ${Le}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${Pe}
    </template>
`;
class Si extends dt {
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
                })(t) && Si.focusableElementRoles.hasOwnProperty(t.getAttribute("role"))),
            (this.isDisabledElement = t =>
                this.isMenuItemElement(t) && "true" === t.getAttribute("aria-disabled")),
            (this.isFocusableElement = t =>
                this.isMenuItemElement(t) && !this.isDisabledElement(t)),
            (this.handleMenuItemFocus = t => {
                const e = t.currentTarget,
                    i = this.menuItems.indexOf(e);
                this.isDisabledElement(e)
                    ? e.blur()
                    : i !== this.focusIndex &&
                      -1 !== i &&
                      this.setFocus(i, i > this.focusIndex ? 1 : -1);
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
        const i = this.menuItems;
        for (; ye(t, i.length); ) {
            const s = i[t];
            if (this.isFocusableElement(s)) {
                s.setAttribute("tabindex", "0"),
                    s.focus(),
                    i[this.focusIndex].setAttribute("tabindex", ""),
                    (this.focusIndex = t);
                break;
            }
            t += e;
        }
    }
}
(Si.focusableElementRoles = $e(Pi)), vt([x], Si.prototype, "items", void 0);
class Mi extends dt {}
vt([tt({ converter: Z })], Mi.prototype, "value", void 0),
    vt([tt({ converter: Z })], Mi.prototype, "min", void 0),
    vt([tt({ converter: Z })], Mi.prototype, "max", void 0),
    vt([tt({ mode: "boolean" })], Mi.prototype, "paused", void 0);
const Ni = X`
    <template
        role="progressbar"
        aria-valuenow="${t => t.value}"
        aria-valuemin="${t => t.min}"
        aria-valuemax="${t => t.max}"
        class="${t => (t.paused ? "paused" : "")}"
    >
        ${pt(
            t => t.value,
            X`
                <div class="progress" part="progress" slot="determinate">
                    <div
                        class="determinate"
                        part="determinate"
                        style="width: ${t => t.value}%"
                    ></div>
                </div>
            `
        )}
        ${pt(
            t => !t.value,
            X`
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
    Di = X`
    <template
        role="progressbar"
        aria-valuenow="${t => t.value}"
        aria-valuemin="${t => t.min}"
        aria-valuemax="${t => t.max}"
        class="${t => (t.paused ? "paused" : "")}"
    >
        ${pt(
            t => t.value,
            X`
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
        ${pt(
            t => !t.value,
            X`
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
    Hi = X`
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
            <slot ${bt("defaultSlottedNodes")}></slot>
        </label>
    </template>
`;
class Ri extends ze {
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
vt([tt({ attribute: "readonly", mode: "boolean" })], Ri.prototype, "readOnly", void 0),
    vt([tt], Ri.prototype, "name", void 0),
    vt(
        [tt({ attribute: "checked", mode: "boolean" })],
        Ri.prototype,
        "checkedAttribute",
        void 0
    ),
    vt([x], Ri.prototype, "defaultSlottedNodes", void 0),
    vt([x], Ri.prototype, "defaultChecked", void 0),
    vt([x], Ri.prototype, "checked", void 0);
const Fi = X`
    <template
        role="radiogroup"
        aria-disabled="${t => t.disabled}"
        aria-readonly="${t => t.readOnly}"
    >
        <slot name="label"></slot>
        <div
            class="positioning-region ${t =>
                t.orientation === yt.horizontal ? "horizontal" : "vertical"}"
            part="positioning-region"
        >
            <slot ${bt("slottedRadioButtons")}> </slot>
        </div>
    </template>
`;
class ji extends dt {
    constructor() {
        super(),
            (this.orientation = yt.horizontal),
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
                const i = t[e];
                this.isInsideToolbar ||
                    (i.setAttribute("tabindex", "0"),
                    i.readOnly
                        ? this.getFilteredRadioButtons().forEach(t => {
                              t !== i && t.setAttribute("tabindex", "-1");
                          })
                        : ((i.checked = !0), (this.selectedRadio = i))),
                    (this.focusedRadio = i),
                    i.focus();
            }),
            (this.moveRightOffGroup = () => {
                this.nextElementSibling.focus();
            }),
            (this.moveLeftOffGroup = () => {
                this.previousElementSibling.focus();
            }),
            (this.focusOutHandler = t => {
                const e = this.getFilteredRadioButtons(),
                    i = t.target,
                    s = null !== i ? e.indexOf(i) : 0,
                    o = this.focusedRadio ? e.indexOf(this.focusedRadio) : -1;
                ((0 === o && s === o) || (o === e.length - 1 && o === s)) &&
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
            (this.shouldMoveOffGroupToTheRight = (t, e, i) =>
                t === e.length && this.isInsideToolbar && 39 === i),
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
                let i = 0;
                switch ((9 !== t.keyCode && t.preventDefault(), t.keyCode)) {
                    case 13:
                        this.checkFocusedRadio();
                        break;
                    case 39:
                    case 40:
                        if (
                            ((i = this.focusedRadio
                                ? e.indexOf(this.focusedRadio) + 1
                                : 1),
                            this.shouldMoveOffGroupToTheRight(i, e, t.keyCode))
                        )
                            return void this.moveRightOffGroup();
                        for (i === e.length && (i = 0); i < e.length && e.length > 1; ) {
                            if (!e[i].disabled) {
                                this.moveToRadioByIndex(e, i);
                                break;
                            }
                            if (this.focusedRadio && i === e.indexOf(this.focusedRadio))
                                break;
                            if (i + 1 >= e.length) {
                                if (this.isInsideToolbar) break;
                                i = 0;
                            } else i += 1;
                        }
                        break;
                    case 37:
                    case 38:
                        if (this.shouldMoveOffGroupToTheLeft(e, t.keyCode))
                            return void this.moveLeftOffGroup();
                        for (
                            i = this.focusedRadio ? e.indexOf(this.focusedRadio) - 1 : 0,
                                i = i < 0 ? e.length - 1 : i;
                            i >= 0 && e.length > 1;

                        ) {
                            if (!e[i].disabled) {
                                this.moveToRadioByIndex(e, i);
                                break;
                            }
                            if (this.focusedRadio && i === e.indexOf(this.focusedRadio))
                                break;
                            i - 1 < 0 ? (i = e.length - 1) : (i -= 1);
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
vt([tt({ attribute: "readonly", mode: "boolean" })], ji.prototype, "readOnly", void 0),
    vt(
        [tt({ attribute: "disabled", mode: "boolean" })],
        ji.prototype,
        "disabled",
        void 0
    ),
    vt([tt], ji.prototype, "name", void 0),
    vt([tt], ji.prototype, "value", void 0),
    vt([tt], ji.prototype, "orientation", void 0),
    vt([x], ji.prototype, "slottedRadioButtons", void 0);
const Bi = X`
    <template
        role="slider"
        class="${t => (t.readOnly ? "readonly" : "")} 
        ${t => t.orientation || yt.horizontal}"
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
            <div ${ut("track")} part="track-container" class="track">
                <slot name="track"></slot>
            </div>
            <div></div>
            <slot></slot>
            <div
                ${ut("thumb")}
                part="thumb-container"
                class="thumb-container"
                style=${t => t.position}
            >
                <slot name="thumb"><div class="thumb-cursor"></div></slot>
            </div>
        </div>
    </template>
`;
function Vi(t, e, i, s) {
    let o = ((n = 0), (r = 1), (a = (t - e) / (i - e)), Math.min(Math.max(a, n), r));
    var n, r, a;
    return s === Te.rtl && (o = 1 - o), o;
}
var zi;
!(function (t) {
    t.singleValue = "single-value";
})(zi || (zi = {}));
class qi extends ze {
    constructor() {
        super(),
            (this.direction = Te.ltr),
            (this.isDragging = !1),
            (this.trackWidth = 0),
            (this.trackMinWidth = 0),
            (this.trackHeight = 0),
            (this.trackMinHeight = 0),
            (this.min = 0),
            (this.max = 10),
            (this.step = 1),
            (this.orientation = yt.horizontal),
            (this.mode = zi.singleValue),
            (this.proxy = document.createElement("input")),
            (this.increment = () => {
                const t =
                        this.direction !== Te.rtl && this.orientation !== yt.vertical
                            ? Number(this.value) + Number(this.step)
                            : Number(this.value) - Number(this.step),
                    e = this.convertToConstrainedValue(t),
                    i = e < Number(this.max) ? "" + e : "" + this.max;
                (this.value = i), this.updateForm();
            }),
            (this.decrement = () => {
                const t =
                        this.direction !== Te.rtl && this.orientation !== yt.vertical
                            ? Number(this.value) - Number(this.step)
                            : Number(this.value) + Number(this.step),
                    e = this.convertToConstrainedValue(t),
                    i = e > Number(this.min) ? "" + e : "" + this.min;
                (this.value = i), this.updateForm();
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
                    (1 - Vi(Number(this.value), Number(this.min), Number(this.max), t));
                this.orientation === yt.horizontal
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
                    t && "rtl" === t.dir && this.setThumbPositionForOrientation(Te.rtl),
                    null !== t && "rtl" === t.dir ? Te.rtl : Te.ltr
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
                    this.orientation === yt.horizontal
                        ? t.pageX - this.getBoundingClientRect().left
                        : t.pageY;
                (this.value = "" + this.calculateNewValue(e)), this.updateForm();
            }),
            (this.calculateNewValue = t => {
                const e = Vi(
                        t,
                        this.orientation === yt.horizontal
                            ? this.trackMinWidth
                            : this.trackMinHeight,
                        this.orientation === yt.horizontal
                            ? this.trackWidth
                            : this.trackHeight,
                        this.direction
                    ),
                    i = (this.max - this.min) * e + this.min;
                return this.convertToConstrainedValue(i);
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
                        this.orientation === yt.horizontal
                            ? t.pageX - this.getBoundingClientRect().left
                            : t.pageY;
                    (this.value = "" + this.calculateNewValue(e)), this.updateForm();
                }
            }),
            (this.convertToConstrainedValue = t => {
                let e = t - this.min;
                const i = e % Number(this.step);
                return (
                    (e = i >= Number(this.step) / 2 ? e - i + Number(this.step) : e - i),
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
vt([tt({ attribute: "readonly", mode: "boolean" })], qi.prototype, "readOnly", void 0),
    vt([x], qi.prototype, "direction", void 0),
    vt([x], qi.prototype, "isDragging", void 0),
    vt([x], qi.prototype, "position", void 0),
    vt([x], qi.prototype, "trackWidth", void 0),
    vt([x], qi.prototype, "trackMinWidth", void 0),
    vt([x], qi.prototype, "trackHeight", void 0),
    vt([x], qi.prototype, "trackMinHeight", void 0),
    vt([tt({ converter: Z })], qi.prototype, "min", void 0),
    vt([tt({ converter: Z })], qi.prototype, "max", void 0),
    vt([tt({ converter: Z })], qi.prototype, "step", void 0),
    vt([tt], qi.prototype, "orientation", void 0),
    vt([tt], qi.prototype, "mode", void 0);
const Wi = X`
    <template
        aria-disabled="${t => t.disabled}"
        class="${t => t.sliderOrientation || yt.horizontal} 
            ${t => (t.disabled ? "disabled" : "")}"
    >
        <div ${ut("root")} part="root" class="root" style=${t => t.positionStyle}>
            <div class="container">
                ${pt(t => !t.hideMark, X` <div class="mark"></div> `)}
                <div class="label">
                    <slot> </slot>
                </div>
            </div>
        </div>
    </template>
`,
    Ui = { min: 0, max: 0, direction: Te.ltr, orientation: yt.horizontal, disabled: !1 };
class Ki extends dt {
    constructor() {
        super(...arguments),
            (this.hideMark = !1),
            (this.sliderDirection = Te.ltr),
            (this.getSliderConfiguration = () => {
                if (this.isSliderConfig(this.parentNode)) {
                    const t = this.parentNode,
                        { min: e, max: i, direction: s, orientation: o, disabled: n } = t;
                    void 0 !== n && (this.disabled = n),
                        (this.sliderDirection = s || Te.ltr),
                        (this.sliderOrientation = o || yt.horizontal),
                        (this.sliderMaxPosition = i),
                        (this.sliderMinPosition = e);
                } else
                    (this.sliderDirection = Ui.direction || Te.ltr),
                        (this.sliderOrientation = Ui.orientation || yt.horizontal),
                        (this.sliderMaxPosition = Ui.max),
                        (this.sliderMinPosition = Ui.min);
            }),
            (this.positionAsStyle = () => {
                const t = this.sliderDirection ? this.sliderDirection : Te.ltr,
                    e = Vi(
                        Number(this.position),
                        Number(this.sliderMinPosition),
                        Number(this.sliderMaxPosition)
                    );
                let i = Math.round(100 * (1 - e)),
                    s = Math.round(100 * e);
                return (
                    s === Number.NaN && i === Number.NaN && ((i = 50), (s = 50)),
                    this.sliderOrientation === yt.horizontal
                        ? t === Te.rtl
                            ? `right: ${s}%; left: ${i}%;`
                            : `left: ${s}%; right: ${i}%;`
                        : `top: ${s}%; bottom: ${i}%;`
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
            (this.notifier = v.getNotifier(this.parentNode)),
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
vt([x], Ki.prototype, "positionStyle", void 0),
    vt([tt], Ki.prototype, "position", void 0),
    vt(
        [tt({ attribute: "hide-mark", mode: "boolean" })],
        Ki.prototype,
        "hideMark",
        void 0
    ),
    vt(
        [tt({ attribute: "disabled", mode: "boolean" })],
        Ki.prototype,
        "disabled",
        void 0
    ),
    vt([x], Ki.prototype, "sliderOrientation", void 0),
    vt([x], Ki.prototype, "sliderMinPosition", void 0),
    vt([x], Ki.prototype, "sliderMaxPosition", void 0),
    vt([x], Ki.prototype, "sliderDirection", void 0);
const _i = X`
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
            <slot ${bt("defaultSlottedNodes")}></slot>
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
class Gi extends ze {
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
vt([tt({ attribute: "readonly", mode: "boolean" })], Gi.prototype, "readOnly", void 0),
    vt([tt], Gi.prototype, "value", void 0),
    vt(
        [tt({ attribute: "checked", mode: "boolean" })],
        Gi.prototype,
        "checkedAttribute",
        void 0
    ),
    vt([x], Gi.prototype, "defaultSlottedNodes", void 0),
    vt([x], Gi.prototype, "defaultChecked", void 0),
    vt([x], Gi.prototype, "checked", void 0);
const Qi = X`
    <template role="tabs" class="${t => t.orientation}">
        ${Le}
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${bt("tabs")}></slot>

            ${pt(
                t => t.activeindicator,
                X`
                    <div
                        ${ut("activeIndicatorRef")}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `
            )}
        </div>
        ${Pe}
        <div class="tabpanel">
            <slot name="tabpanel" part="tabpanel" ${bt("tabpanels")}></slot>
        </div>
    </template>
`;
var Xi;
!(function (t) {
    (t.vertical = "vertical"), (t.horizontal = "horizontal");
})(Xi || (Xi = {}));
class Yi extends dt {
    constructor() {
        super(),
            (this.orientation = Xi.horizontal),
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
                            const i = this.tabIds[e],
                                s = this.tabpanelIds[e];
                            t.setAttribute(
                                "id",
                                "string" != typeof i ? "tab-" + (e + 1) : i
                            ),
                                t.setAttribute(
                                    "aria-selected",
                                    this.activeTabIndex === e ? "true" : "false"
                                ),
                                t.setAttribute(
                                    "aria-controls",
                                    "string" != typeof s ? "panel-" + (e + 1) : s
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
                        const i = this.tabIds[e],
                            s = this.tabpanelIds[e];
                        t.setAttribute(
                            "id",
                            "string" != typeof s ? "panel-" + (e + 1) : s
                        ),
                            t.setAttribute(
                                "aria-labeledby",
                                "string" != typeof i ? "tab-" + (e + 1) : i
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
        return this.orientation === Xi.horizontal;
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
            i = this.isHorizontal() ? "offsetLeft" : "offsetTop",
            s = this.activeIndicatorRef[i];
        this.activeIndicatorRef.style[t] = "" + (this.activeTabIndex + 1);
        const o = this.activeIndicatorRef[i];
        this.activeIndicatorRef.style[t] = "" + (this.prevActiveTabIndex + 1);
        const n = o - s;
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
            (this.activeTabIndex = Oe(0, this.tabs.length - 1, this.activeTabIndex + t)),
            this.setComponent();
    }
    focusTab() {
        this.tabs[this.activeTabIndex].focus();
    }
}
vt([tt], Yi.prototype, "orientation", void 0),
    vt([tt], Yi.prototype, "activeid", void 0),
    vt([x], Yi.prototype, "tabs", void 0),
    vt([x], Yi.prototype, "tabpanels", void 0),
    vt([tt({ mode: "boolean" })], Yi.prototype, "activeindicator", void 0),
    vt([x], Yi.prototype, "activeIndicatorRef", void 0),
    Se(Yi, Ee);
const Zi = X`
    <template slot="tab" role="tab">
        <slot></slot>
    </template>
`;
class Ji extends dt {}
const ts = X`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`;
class es extends dt {}
var is, ss;
!(function (t) {
    (t.filled = "filled"), (t.outline = "outline");
})(is || (is = {})),
    (function (t) {
        (t.none = "none"),
            (t.both = "both"),
            (t.horizontal = "horizontal"),
            (t.vertical = "vertical");
    })(ss || (ss = {}));
class os extends ze {
    constructor() {
        super(...arguments),
            (this.appearance = is.outline),
            (this.resize = ss.none),
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
vt([tt], os.prototype, "appearance", void 0),
    vt([tt({ mode: "boolean" })], os.prototype, "readOnly", void 0),
    vt([tt], os.prototype, "resize", void 0),
    vt([tt({ mode: "boolean" })], os.prototype, "autofocus", void 0),
    vt([tt({ converter: Z, mode: "fromView" })], os.prototype, "cols", void 0),
    vt([tt({ attribute: "form" })], os.prototype, "formId", void 0),
    vt([tt], os.prototype, "list", void 0),
    vt([tt({ converter: Z })], os.prototype, "maxlength", void 0),
    vt([tt({ converter: Z })], os.prototype, "minlength", void 0),
    vt([tt], os.prototype, "name", void 0),
    vt([tt], os.prototype, "placeholder", void 0),
    vt([tt({ converter: Z, mode: "fromView" })], os.prototype, "rows", void 0),
    vt([tt({ mode: "boolean" })], os.prototype, "spellcheck", void 0),
    vt([x], os.prototype, "defaultSlottedNodes", void 0);
const ns = X`
    <template
        class="
            ${t => t.appearance}
            ${t => (t.readOnly ? "readonly" : "")}
            ${t => (t.resize !== ss.none ? "resize-" + t.resize : "")}"
    >
        <label part="label" for="control" class="${t =>
            t.defaultSlottedNodes && t.defaultSlottedNodes.length
                ? "label"
                : "label label__hidden"}">
            <slot ${bt("defaultSlottedNodes")}></slot>
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
            ${ut("textarea")}
        ></textarea>
    </template>
`,
    rs = X`
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
            <slot ${bt("defaultSlottedNodes")}></slot>
        </label>
        <div class="root" part="root">
            ${Le}
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
                ${ut("control")}
            />
            ${Pe}
        </div>
    </template>
`;
var as, ls;
!(function (t) {
    (t.filled = "filled"), (t.outline = "outline");
})(as || (as = {})),
    (function (t) {
        (t.email = "email"),
            (t.password = "password"),
            (t.tel = "tel"),
            (t.text = "text"),
            (t.url = "url");
    })(ls || (ls = {}));
class ds extends ze {
    constructor() {
        super(),
            (this.appearance = as.outline),
            (this.type = ls.text),
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
vt([tt], ds.prototype, "appearance", void 0),
    vt(
        [tt({ attribute: "readonly", mode: "boolean" })],
        ds.prototype,
        "readOnly",
        void 0
    ),
    vt([tt({ mode: "boolean" })], ds.prototype, "autofocus", void 0),
    vt([tt], ds.prototype, "placeholder", void 0),
    vt([tt], ds.prototype, "type", void 0),
    vt([tt], ds.prototype, "list", void 0),
    vt([tt({ converter: Z })], ds.prototype, "maxlength", void 0),
    vt([tt({ converter: Z })], ds.prototype, "minlength", void 0),
    vt([tt], ds.prototype, "pattern", void 0),
    vt([tt({ converter: Z })], ds.prototype, "size", void 0),
    vt([tt({ mode: "boolean" })], ds.prototype, "spellcheck", void 0),
    vt([x], ds.prototype, "defaultSlottedNodes", void 0),
    Se(ds, Ee);
export {
    De as Accordion,
    Ne as AccordionExpandMode,
    Me as AccordionItem,
    Ae as AccordionItemTemplate,
    ft as AccordionTemplate,
    Re as Anchor,
    He as AnchorTemplate,
    je as Badge,
    Fe as BadgeTemplate,
    Mi as BaseProgress,
    qe as Button,
    Be as ButtonTemplate,
    Ue as Card,
    We as CardTemplate,
    _e as Checkbox,
    Ke as CheckboxTemplate,
    ni as DesignSystemProvider,
    li as DesignSystemProviderTemplate,
    ki as Dialog,
    di as DialogTemplate,
    Ii as Divider,
    $i as DividerRole,
    Ci as DividerTemplate,
    Ti as Flipper,
    wi as FlipperDirection,
    Oi as FlipperTemplate,
    Si as Menu,
    Li as MenuItem,
    Pi as MenuItemRole,
    Ai as MenuItemTemplate,
    Ei as MenuTemplate,
    Di as ProgressRingTemplate,
    Ni as ProgressTemplate,
    Ri as Radio,
    ji as RadioGroup,
    Fi as RadioGroupTemplate,
    Hi as RadioTemplate,
    qi as Slider,
    Ki as SliderLabel,
    Wi as SliderLabelTemplate,
    zi as SliderMode,
    Bi as SliderTemplate,
    Ee as StartEnd,
    Gi as Switch,
    _i as SwitchTemplate,
    Ji as Tab,
    es as TabPanel,
    ts as TabPanelTemplate,
    Zi as TabTemplate,
    Yi as Tabs,
    Xi as TabsOrientation,
    Qi as TabsTemplate,
    os as TextArea,
    is as TextAreaAppearance,
    ss as TextAreaResize,
    ns as TextAreaTemplate,
    ds as TextField,
    as as TextFieldAppearance,
    rs as TextFieldTemplate,
    ls as TextFieldType,
    Se as applyMixins,
    Qe as composedParent,
    Ge as cssCustomPropertyBehaviorFactory,
    oi as designSystemConsumerBehavior,
    ai as designSystemProperty,
    ri as designSystemProvider,
    Ze as disabledCursor,
    ti as display,
    Pe as endTemplate,
    ei as focusVisible,
    Ye as forcedColorsStylesheetBehavior,
    Je as hidden,
    si as isDesignSystemConsumer,
    Xe as matchMediaStylesheetBehaviorFactory,
    Le as startTemplate,
};
