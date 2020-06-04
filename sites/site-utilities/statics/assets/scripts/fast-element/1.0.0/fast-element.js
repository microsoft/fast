const t =
        "fast-" +
        Math.random()
            .toString(36)
            .substring(7),
    e = [];
void 0 === globalThis.trustedTypes &&
    (globalThis.trustedTypes = { createPolicy: (t, e) => e });
const s = globalThis.trustedTypes.createPolicy("fast-html", { createHTML: t => t });
let i = s;
function n() {
    let t = 0;
    for (; t < e.length; ) {
        if ((e[t].call(), t++, t > 1024)) {
            for (let s = 0, i = e.length - t; s < i; s++) e[s] = e[s + t];
            (e.length -= t), (t = 0);
        }
    }
    e.length = 0;
}
const o = Object.freeze({
    setHTMLPolicy(t) {
        if (i !== s) throw new Error("The HTML policy can only be set once.");
        i = t;
    },
    createHTML: t => i.createHTML(t),
    isMarker: e => e && 8 === e.nodeType && e.data.startsWith(t),
    extractDirectiveIndexFromMarker: e => parseInt(e.data.replace(t + ":", "")),
    createInterpolationPlaceholder: t => `@{${t}}`,
    createCustomAttributePlaceholder(t, e) {
        return `${t}="${this.createInterpolationPlaceholder(e)}"`;
    },
    createBlockPlaceholder: e => `\x3c!--${t}:${e}--\x3e`,
    queueUpdate(t) {
        e.length < 1 && window.requestAnimationFrame(n), e.push(t);
    },
    setAttribute(t, e, s) {
        null == s ? t.removeAttribute(e) : t.setAttribute(e, s);
    },
    setBooleanAttribute(t, e, s) {
        s ? t.setAttribute(e, "") : t.removeAttribute(e);
    },
});
function r(t) {
    const e = this.spillover;
    -1 === e.indexOf(t) && e.push(t);
}
function h(t) {
    const e = this.spillover,
        s = e.indexOf(t);
    -1 !== s && e.splice(s, 1);
}
function l(t) {
    const e = this.spillover,
        s = this.source;
    for (let i = 0, n = e.length; i < n; ++i) e[i].handleChange(s, t);
}
function a(t) {
    return -1 !== this.spillover.indexOf(t);
}
class c {
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
                      (this.subscribe = r),
                      (this.unsubscribe = h),
                      (this.notify = l),
                      (this.has = a),
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
            s = this.sub2,
            i = this.source;
        void 0 !== e && e.handleChange(i, t), void 0 !== s && s.handleChange(i, t);
    }
}
class d {
    constructor(t) {
        (this.source = t), (this.subscribers = {});
    }
    notify(t) {
        const e = this.subscribers[t];
        void 0 !== e && e.notify(t);
    }
    subscribe(t, e) {
        let s = this.subscribers[e];
        void 0 === s && (this.subscribers[e] = s = new c(this.source)), s.subscribe(t);
    }
    unsubscribe(t, e) {
        const s = this.subscribers[e];
        void 0 !== s && s.unsubscribe(t);
    }
}
const u = new WeakMap(),
    f = new WeakMap();
let p = void 0;
class b {
    constructor(t, e) {
        (this.name = t),
            (this.field = "_" + t),
            (this.callback = t + "Changed"),
            (this.hasCallback = this.callback in e);
    }
    getValue(t) {
        return void 0 !== p && p.observe(t, this.name), t[this.field];
    }
    setValue(t, e) {
        const s = this.field,
            i = t[s];
        i !== e &&
            ((t[s] = e),
            this.hasCallback && t[this.callback](i, e),
            g(t).notify(this.name));
    }
}
const v = {
        createArrayObserver(t) {
            throw new Error("Must call enableArrayObservation before observing arrays.");
        },
        getNotifier(t) {
            let e = t.$fastController || u.get(t);
            return (
                void 0 === e &&
                    (Array.isArray(t)
                        ? (e = v.createArrayObserver(t))
                        : u.set(t, (e = new d(t)))),
                e
            );
        },
        track(t, e) {
            void 0 !== p && p.observe(t, e);
        },
        notify(t, e) {
            g(t).notify(e);
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
                let s = Reflect.getPrototypeOf(t);
                for (; void 0 === e && null !== s; )
                    (e = f.get(s)), (s = Reflect.getPrototypeOf(s));
                (e = void 0 === e ? [] : e.slice(0)), f.set(t, e);
            }
            return e;
        },
    },
    g = v.getNotifier,
    m = o.queueUpdate;
function x(t, e) {
    v.defineProperty(t, e);
}
let C = null;
function w(t) {
    C = t;
}
class y {
    constructor() {
        (this.index = 0), (this.length = 0), (this.parent = null);
    }
    get event() {
        return C;
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
v.defineProperty(y.prototype, "index"), v.defineProperty(y.prototype, "length");
const N = new y();
class T {
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
            (p = this.needsRefresh ? this : void 0),
            (this.needsRefresh = !1);
        const s = this.expression(t, e);
        return (p = void 0), s;
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
        const s = this.last,
            i = g(t),
            n = null === s ? this.first : {};
        if (
            ((n.source = t),
            (n.propertyName = e),
            (n.notifier = i),
            i.subscribe(this, e),
            null !== s)
        ) {
            if (!this.needsRefresh) {
                p = void 0;
                const e = s.source[s.propertyName];
                (p = this), t === e && (this.needsRefresh = !0);
            }
            s.next = n;
        }
        this.last = n;
    }
    handleChange() {
        this.needsQueue && ((this.needsQueue = !1), m(this));
    }
    call() {
        (this.needsQueue = !0), this.observer.handleExpressionChange(this);
    }
}
class O {
    constructor() {
        this.targetIndex = 0;
    }
}
class k extends O {
    constructor(t, e, s) {
        super(), (this.name = t), (this.behavior = e), (this.options = s);
    }
    createPlaceholder(t) {
        return o.createCustomAttributePlaceholder(this.name, t);
    }
    createBehavior(t) {
        return new this.behavior(t, this.options);
    }
}
function A(t, e) {
    (this.source = t),
        (this.context = e),
        null === this.observableExpression &&
            (this.observableExpression = new T(this.expression, this)),
        this.updateTarget(this.observableExpression.evaluate(t, e));
}
function B(t, e) {
    (this.source = t),
        (this.context = e),
        this.target.addEventListener(this.targetName, this, !0);
}
function S() {
    this.observableExpression.dispose(), (this.source = null), (this.context = null);
}
function E() {
    this.target.removeEventListener(this.targetName, this, !0),
        (this.source = null),
        (this.context = null);
}
function V(t) {
    o.setAttribute(this.target, this.targetName, t);
}
function P(t) {
    o.setBooleanAttribute(this.target, this.targetName, t);
}
function M(t) {
    this.target.textContent = t;
}
function I(t) {
    this.target[this.targetName] = t;
}
function L(t) {
    const e = this.classVersions || Object.create(null),
        s = this.target;
    let i = this.version || 0;
    if (null != t && t.length) {
        const n = t.split(/\s+/);
        for (let t = 0, o = n.length; t < o; ++t) {
            const o = n[t];
            "" !== o && ((e[o] = i), s.classList.add(o));
        }
    }
    if (((this.classVersions = e), (this.version = i + 1), 0 !== i)) {
        i -= 1;
        for (const t in e) e[t] === i && s.classList.remove(t);
    }
}
class $ extends O {
    constructor(t) {
        super(),
            (this.expression = t),
            (this.createPlaceholder = o.createInterpolationPlaceholder),
            (this.bind = A),
            (this.unbind = S),
            (this.updateTarget = V);
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
                        (this.updateTarget = I),
                        "innerHTML" === this.cleanedTargetName)
                    ) {
                        const t = this.expression;
                        this.expression = (e, s) => o.createHTML(t(e, s));
                    }
                    break;
                case "?":
                    (this.cleanedTargetName = t.substr(1)), (this.updateTarget = P);
                    break;
                case "@":
                    (this.cleanedTargetName = t.substr(1)),
                        (this.bind = B),
                        (this.unbind = E);
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
        return new F(
            t,
            this.expression,
            this.bind,
            this.unbind,
            this.updateTarget,
            this.cleanedTargetName
        );
    }
}
class F {
    constructor(t, e, s, i, n, o) {
        (this.target = t),
            (this.expression = e),
            (this.bind = s),
            (this.unbind = i),
            (this.updateTarget = n),
            (this.targetName = o),
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
const R = { locatedDirectives: 0, targetIndex: -1 };
function j(t) {
    let e;
    const s = t.length,
        i = t.map(t =>
            "string" == typeof t
                ? () => t
                : ((e = t.targetName || e), R.locatedDirectives++, t.expression)
        ),
        n = new $((t, e) => {
            let n = "";
            for (let o = 0; o < s; ++o) n += i[o](t, e);
            return n;
        });
    return (n.targetName = e), n;
}
function H(t, e) {
    let s = t.indexOf("@{", 0);
    const i = t.length;
    let n,
        o,
        r,
        h = 0,
        l = 0,
        a = null,
        c = 0;
    for (; s >= 0 && s < i - 2; ) {
        (l = 1), (o = s), (s += 2);
        do {
            (n = t[s]),
                s++,
                "'" !== n && '"' !== n
                    ? "\\" !== n
                        ? null === a && ("{" === n ? l++ : "}" === n && l--)
                        : s++
                    : null === a
                    ? (a = n)
                    : a === n && (a = null);
        } while (l > 0 && s < i);
        if (0 !== l) break;
        if (((r = r || []), "\\" === t[o - 1] && "\\" !== t[o - 2]))
            (r[c] = t.substring(h, o - 1) + t.substring(o, s)), c++;
        else {
            (r[c] = t.substring(h, o)), c++;
            const i = e[parseInt(t.substring(o + 2, s - 1))];
            (r[c] = i), c++;
        }
        (h = s), (s = t.indexOf("@{", s));
    }
    return 0 === c
        ? null
        : ((r[c] = t.substr(h)), (r = r.filter(t => "" !== t)), 1 == r.length ? r[0] : r);
}
function D(t, e, s, i = !1) {
    const n = t.attributes;
    for (let o = 0, r = n.length; o < r; ++o) {
        const h = n[o],
            l = h.value;
        let a = H(l, e);
        null === a
            ? i && ((a = new $(() => l)), (a.targetName = h.name))
            : Array.isArray(a)
            ? (a = j(a))
            : R.locatedDirectives++,
            null !== a &&
                (t.removeAttributeNode(h),
                o--,
                r--,
                (a.targetIndex = R.targetIndex),
                s.push(a));
    }
}
function Q(t, e) {
    t.targetAtContent(),
        (t.targetIndex = R.targetIndex),
        e.push(t),
        R.locatedDirectives++;
}
function U(t, e, s, i) {
    const n = H(t.textContent, e);
    if (null !== n)
        if (Array.isArray(n)) {
            let e = t;
            for (let o = 0, r = n.length; o < r; ++o) {
                const r = n[o],
                    h =
                        0 === o
                            ? t
                            : e.parentNode.insertBefore(
                                  document.createTextNode(""),
                                  e.nextSibling
                              );
                "string" == typeof r
                    ? (h.textContent = r)
                    : ((h.textContent = " "), Q(r, s)),
                    (e = h),
                    R.targetIndex++,
                    h !== t && i.nextNode();
            }
            R.targetIndex--;
        } else (t.textContent = " "), Q(n, s);
}
function q(t, e) {
    const s = [];
    (R.locatedDirectives = 0), D(t, e, s, !0);
    const i = t.content,
        n = [],
        r = e.length,
        h = document.createTreeWalker(i, 133, null, !1);
    for (R.targetIndex = -1; R.locatedDirectives < r; ) {
        const t = h.nextNode();
        if (null === t) break;
        switch ((R.targetIndex++, t.nodeType)) {
            case 1:
                D(t, e, n);
                break;
            case 3:
                U(t, e, n, h);
                break;
            case 8:
                if (o.isMarker(t)) {
                    const s = e[o.extractDirectiveIndexFromMarker(t)];
                    (s.targetIndex = R.targetIndex), R.locatedDirectives++, n.push(s);
                } else t.parentNode.removeChild(t), R.targetIndex--;
        }
    }
    let l = 0;
    return (
        o.isMarker(i.firstChild) &&
            (i.insertBefore(document.createComment(""), i.firstChild), (l = -1)),
        {
            fragment: i,
            viewBehaviorFactories: n,
            hostBehaviorFactories: s,
            targetOffset: l,
        }
    );
}
const W = document.createRange();
class z {
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
                s = this.lastChild;
            let i,
                n = this.firstChild;
            for (; n !== s; ) (i = n.nextSibling), e.insertBefore(n, t), (n = i);
            e.insertBefore(s, t);
        }
    }
    remove() {
        const t = this.fragment,
            e = this.lastChild;
        let s,
            i = this.firstChild;
        for (; i !== e; ) (s = i.nextSibling), t.appendChild(i), (i = s);
        t.appendChild(e);
    }
    dispose() {
        const t = this.firstChild.parentNode,
            e = this.lastChild;
        let s,
            i = this.firstChild;
        for (; i !== e; ) (s = i.nextSibling), t.removeChild(i), (i = s);
        t.removeChild(e);
        const n = this.behaviors,
            o = this.source;
        for (let t = 0, e = n.length; t < e; ++t) n[t].unbind(o);
    }
    bind(t, e) {
        const s = this.behaviors;
        if (this.source !== t)
            if (void 0 !== this.source) {
                const i = this.source;
                (this.source = t), (this.context = e);
                for (let n = 0, o = s.length; n < o; ++n) {
                    const o = s[n];
                    o.unbind(i), o.bind(t, e);
                }
            } else {
                (this.source = t), (this.context = e);
                for (let i = 0, n = s.length; i < n; ++i) s[i].bind(t, e);
            }
    }
    unbind() {
        if (void 0 === this.source) return;
        const t = this.behaviors,
            e = this.source;
        for (let s = 0, i = t.length; s < i; ++s) t[s].unbind(e);
        this.source = void 0;
    }
    static disposeContiguousBatch(t) {
        if (0 !== t.length) {
            W.setStart(t[0].firstChild, 0),
                W.setEnd(t[t.length - 1].lastChild, 0),
                W.deleteContents();
            for (let e = 0, s = t.length; e < s; ++e) {
                const s = t[e],
                    i = s.behaviors,
                    n = s.source;
                for (let t = 0, e = i.length; t < e; ++t) i[t].unbind(n);
            }
        }
    }
}
class _ {
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
class K extends O {
    constructor(t, e) {
        super(),
            (this.html = t),
            (this.directives = e),
            (this.createPlaceholder = o.createBlockPlaceholder),
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
                (t = document.createElement("template")), (t.innerHTML = o.createHTML(e));
                const s = t.content.firstElementChild;
                null !== s && "TEMPLATE" === s.tagName && (t = s);
            } else t = e;
            const s = q(t, this.directives);
            (this.fragment = s.fragment),
                (this.viewBehaviorFactories = s.viewBehaviorFactories),
                (this.hostBehaviorFactories = s.hostBehaviorFactories),
                (this.targetOffset = s.targetOffset),
                (this.behaviorCount =
                    this.viewBehaviorFactories.length +
                    this.hostBehaviorFactories.length),
                (this.hasHostBehaviors = this.hostBehaviorFactories.length > 0);
        }
        const e = this.fragment.cloneNode(!0),
            s = this.viewBehaviorFactories,
            i = new Array(this.behaviorCount),
            n = document.createTreeWalker(e, 133, null, !1);
        let r = 0,
            h = this.targetOffset,
            l = n.nextNode();
        for (let t = s.length; r < t; ++r) {
            const t = s[r],
                e = t.targetIndex;
            for (; null !== l; ) {
                if (h === e) {
                    i[r] = t.createBehavior(l);
                    break;
                }
                (l = n.nextNode()), h++;
            }
        }
        if (this.hasHostBehaviors) {
            const e = this.hostBehaviorFactories;
            for (let s = 0, n = e.length; s < n; ++s, ++r) i[r] = e[s].createBehavior(t);
        }
        return new z(e, i);
    }
    render(t, e) {
        "string" == typeof e && (e = document.getElementById(e));
        const s = this.create(e);
        return s.bind(t, N), s.appendTo(e), s;
    }
    createBehavior(t) {
        return new _(this, t);
    }
}
const G = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
function J(t, ...e) {
    const s = [];
    let i = "";
    for (let n = 0, o = t.length - 1; n < o; ++n) {
        const o = t[n];
        let r = e[n];
        if (((i += o), "function" == typeof r)) {
            r = new $(r);
            const t = G.exec(o);
            null !== t && (r.targetName = t[2]);
        }
        r instanceof O ? ((i += r.createPlaceholder(s.length)), s.push(r)) : (i += r);
    }
    return (i += t[t.length - 1]), new K(i, s);
}
const X = {
        toView: t => (t ? "true" : "false"),
        fromView: t => null != t && "false" !== t && !1 !== t && 0 !== t,
    },
    Y = {
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
class Z {
    constructor(t, e, s = e.toLowerCase(), i = "reflect", n) {
        (this.Owner = t),
            (this.name = e),
            (this.attribute = s),
            (this.mode = i),
            (this.converter = n),
            (this.guards = new Set()),
            (this.fieldName = "_" + e),
            (this.callbackName = e + "Changed"),
            (this.hasCallback = this.callbackName in t.prototype),
            "boolean" === i && void 0 === n && (this.converter = X);
    }
    setValue(t, e) {
        const s = t[this.fieldName],
            i = this.converter;
        void 0 !== i && (e = i.fromView(e)),
            s !== e &&
                ((t[this.fieldName] = e),
                this.tryReflectToAttribute(t),
                this.hasCallback && t[this.callbackName](s, e),
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
            s = this.guards;
        s.has(t) ||
            "fromView" === e ||
            o.queueUpdate(() => {
                s.add(t);
                const i = t[this.fieldName];
                switch (e) {
                    case "reflect":
                        const e = this.converter;
                        o.setAttribute(t, this.attribute, void 0 !== e ? e.toView(i) : i);
                        break;
                    case "boolean":
                        o.setBooleanAttribute(t, this.attribute, i);
                }
                s.delete(t);
            });
    }
    static collect(t, ...e) {
        const s = [];
        e.push(t.attributes);
        for (let i = 0, n = e.length; i < n; ++i) {
            const n = e[i];
            if (void 0 !== n)
                for (let e = 0, i = n.length; e < i; ++e) {
                    const i = n[e];
                    "string" == typeof i
                        ? s.push(new Z(t, i))
                        : s.push(new Z(t, i.property, i.attribute, i.mode, i.converter));
                }
        }
        return s;
    }
}
function tt(t, e) {
    let s;
    function i(t, e) {
        arguments.length > 1 && (s.property = e);
        const i = t.constructor.attributes || (t.constructor.attributes = []);
        i.push(s);
    }
    return arguments.length > 1
        ? ((s = {}), void i(t, e))
        : ((s = void 0 === t ? {} : t), i);
}
class et {
    constructor(t, e, s, i, n, o, r, h) {
        (this.name = t),
            (this.attributes = e),
            (this.propertyLookup = s),
            (this.attributeLookup = i),
            (this.template = n),
            (this.styles = o),
            (this.shadowOptions = r),
            (this.elementOptions = h);
    }
}
const st = new Map();
function it(t) {
    return st.get(t);
}
const nt = { bubbles: !0, composed: !0 };
class ot extends d {
    constructor(t, e) {
        super(t),
            (this.element = t),
            (this.definition = e),
            (this.view = null),
            (this.isConnected = !1),
            (this.boundObservables = null),
            (this.behaviors = null);
        const s = e.template,
            i = e.styles,
            n = void 0 === e.shadowOptions ? void 0 : t.attachShadow(e.shadowOptions);
        if (void 0 !== s) {
            const e = (this.view = s.create(this.element));
            void 0 === n ? e.appendTo(t) : e.appendTo(n);
        }
        void 0 !== i && this.addStyles(i, n);
        const o = v.getAccessors(t);
        if (o.length > 0) {
            const e = (this.boundObservables = Object.create(null));
            for (let s = 0, i = o.length; s < i; ++s) {
                const i = o[s].name,
                    n = t[i];
                void 0 !== n && (delete t[i], (e[i] = n));
            }
        }
    }
    addStyles(t, e = this.element.shadowRoot) {
        null !== e && t.addStylesTo(e);
        const s = t.behaviors;
        null !== s && this.addBehaviors(s);
    }
    removeStyles(t) {
        const e = this.element.shadowRoot;
        null !== e && t.removeStylesFrom(e);
        const s = t.behaviors;
        null !== s && this.removeBehaviors(s);
    }
    addBehaviors(t) {
        const e = this.behaviors || (this.behaviors = []),
            s = t.length;
        for (let i = 0; i < s; ++i) e.push(t[i]);
        if (this.isConnected) {
            const e = this.element;
            for (let i = 0; i < s; ++i) t[i].bind(e, N);
        }
    }
    removeBehaviors(t) {
        const e = this.behaviors;
        if (null === e) return;
        const s = t.length;
        for (let i = 0; i < s; ++i) {
            const s = e.indexOf(t[i]);
            -1 !== s && e.splice(s, 1);
        }
        if (this.isConnected) {
            const e = this.element;
            for (let i = 0; i < s; ++i) t[i].unbind(e);
        }
    }
    onConnectedCallback() {
        if (this.isConnected) return;
        const t = this.element,
            e = this.boundObservables;
        if (null !== e) {
            const s = Object.keys(e);
            for (let i = 0, n = s.length; i < n; ++i) {
                const n = s[i];
                t[n] = e[n];
            }
            this.boundObservables = null;
        }
        const s = this.view;
        null !== s && s.bind(t, N);
        const i = this.behaviors;
        if (null !== i) for (let e = 0, s = i.length; e < s; ++e) i[e].bind(t, N);
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
            for (let s = 0, i = e.length; s < i; ++s) e[s].unbind(t);
        }
    }
    onAttributeChangedCallback(t, e, s) {
        const i = this.definition.attributeLookup[t];
        void 0 !== i && i.onAttributeChangedCallback(this.element, s);
    }
    emit(t, e, s) {
        return (
            !!this.isConnected &&
            this.element.dispatchEvent(
                new CustomEvent(t, Object.assign(Object.assign({ detail: e }, nt), s))
            )
        );
    }
    static forCustomElement(t) {
        const e = t.$fastController;
        if (void 0 !== e) return e;
        const s = it(t.constructor);
        if (void 0 === s) throw new Error("Missing fast element definition.");
        return (t.$fastController = new ot(t, s));
    }
}
const rt = { mode: "open" },
    ht = {};
function lt(t) {
    return class extends t {
        constructor() {
            super(), ot.forCustomElement(this);
        }
        $emit(t, e, s) {
            return this.$fastController.emit(t, e, s);
        }
        connectedCallback() {
            this.$fastController.onConnectedCallback();
        }
        disconnectedCallback() {
            this.$fastController.onDisconnectedCallback();
        }
        attributeChangedCallback(t, e, s) {
            this.$fastController.onAttributeChangedCallback(t, e, s);
        }
    };
}
const at = Object.assign(lt(HTMLElement), {
    from: t => lt(t),
    define(t, e = t.definition) {
        "string" == typeof e && (e = { name: e });
        const s = e.name,
            i = Z.collect(t, e.attributes),
            n =
                void 0 === e.shadowOptions
                    ? rt
                    : null === e.shadowOptions
                    ? void 0
                    : Object.assign(Object.assign({}, rt), e.shadowOptions),
            o =
                void 0 === e.elementOptions
                    ? ht
                    : Object.assign(Object.assign({}, ht), e.shadowOptions),
            r = new Array(i.length),
            h = t.prototype,
            l = {},
            a = {};
        for (let t = 0, e = i.length; t < e; ++t) {
            const e = i[t];
            (r[t] = e.attribute),
                (l[e.name] = e),
                (a[e.attribute] = e),
                v.defineProperty(h, e);
        }
        Reflect.defineProperty(t, "observedAttributes", { value: r, enumerable: !0 });
        const c = new et(s, i, l, a, e.template, e.styles, n, o);
        return st.set(t, c), customElements.define(s, t, c.elementOptions), t;
    },
    getDefinition: it,
});
function ct(t) {
    return function(e) {
        at.define(e, t);
    };
}
const dt = Object.freeze([]),
    ut = new Map();
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
        return ut.set(t, this), this;
    }
    static find(t) {
        return ut.get(t) || null;
    }
}
function pt(t) {
    return t
        .map(t => (t instanceof ft ? pt(t.styles) : [t]))
        .reduce((t, e) => t.concat(e), []);
}
function bt(t) {
    return t
        .map(t => (t instanceof ft ? t.behaviors : null))
        .reduce((t, e) => (null === e ? t : (null === t && (t = []), t.concat(e))), null);
}
class vt extends ft {
    constructor(t, e) {
        super(),
            (this.styles = t),
            (this.behaviors = null),
            (this.behaviors = bt(t)),
            (this.styleSheets = pt(t).map(t => {
                let s = e.get(t);
                return (
                    void 0 === s &&
                        ((s = new CSSStyleSheet()), s.replaceSync(t), e.set(t, s)),
                    s
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
class mt extends ft {
    constructor(t) {
        super(),
            (this.styles = t),
            (this.behaviors = null),
            (this.behaviors = bt(t)),
            (this.styleSheets = pt(t)),
            (this.styleClass = "fast-style-class-" + ++gt);
    }
    addStylesTo(t) {
        const e = this.styleSheets,
            s = this.styleClass;
        for (let i = e.length - 1; i > -1; --i) {
            const n = document.createElement("style");
            (n.innerHTML = e[i]), (n.className = s), t.prepend(n);
        }
    }
    removeStylesFrom(t) {
        const e = t.querySelectorAll("." + this.styleClass);
        for (let s = 0, i = e.length; s < i; ++s) t.removeChild(e[s]);
    }
}
const xt = (() => {
    if ("adoptedStyleSheets" in window.ShadowRoot.prototype) {
        const t = new Map();
        return e => new vt(e, t);
    }
    return t => new mt(t);
})();
function Ct(t, ...e) {
    const s = [];
    let i = "";
    for (let n = 0, o = t.length - 1; n < o; ++n) {
        i += t[n];
        const o = e[n];
        o instanceof ft
            ? ("" !== i.trim() && (s.push(i), (i = "")), s.push(o))
            : (i += o);
    }
    return (i += t[t.length - 1]), "" !== i.trim() && s.push(i), xt(s);
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
function yt(t) {
    return new k("fast-ref", wt, t);
}
class Nt {
    constructor(t, e, s) {
        (this.location = t),
            (this.template = s),
            (this.view = null),
            (this.context = void 0),
            (this.observableExpression = new T(e, this));
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
class Tt extends O {
    constructor(t, e) {
        super(),
            (this.expression = t),
            (this.template = e),
            (this.createPlaceholder = o.createBlockPlaceholder);
    }
    createBehavior(t) {
        return new Nt(t, this.expression, this.template);
    }
}
function Ot(t, e) {
    return new Tt(t, e);
}
function kt(t, e, s) {
    return { index: t, removed: e, addedCount: s };
}
function At(t, e, s, i, n, o) {
    let r = 0,
        h = 0;
    const l = Math.min(s - e, o - n);
    if (
        (0 === e &&
            0 === n &&
            (r = (function(t, e, s) {
                for (let i = 0; i < s; ++i) if (t[i] !== e[i]) return i;
                return s;
            })(t, i, l)),
        s === t.length &&
            o === i.length &&
            (h = (function(t, e, s) {
                let i = t.length,
                    n = e.length,
                    o = 0;
                for (; o < s && t[--i] === e[--n]; ) o++;
                return o;
            })(t, i, l - r)),
        (n += r),
        (o -= h),
        (s -= h) - (e += r) == 0 && o - n == 0)
    )
        return dt;
    if (e === s) {
        const t = kt(e, [], 0);
        for (; n < o; ) t.removed.push(i[n++]);
        return [t];
    }
    if (n === o) return [kt(e, [], s - e)];
    const a = (function(t) {
            let e = t.length - 1,
                s = t[0].length - 1,
                i = t[e][s];
            const n = [];
            for (; e > 0 || s > 0; ) {
                if (0 === e) {
                    n.push(2), s--;
                    continue;
                }
                if (0 === s) {
                    n.push(3), e--;
                    continue;
                }
                const o = t[e - 1][s - 1],
                    r = t[e - 1][s],
                    h = t[e][s - 1];
                let l;
                (l = r < h ? (r < o ? r : o) : h < o ? h : o),
                    l === o
                        ? (o === i ? n.push(0) : (n.push(1), (i = o)), e--, s--)
                        : l === r
                        ? (n.push(3), e--, (i = r))
                        : (n.push(2), s--, (i = h));
            }
            return n.reverse(), n;
        })(
            (function(t, e, s, i, n, o) {
                const r = o - n + 1,
                    h = s - e + 1,
                    l = new Array(r);
                let a, c;
                for (let t = 0; t < r; ++t) (l[t] = new Array(h)), (l[t][0] = t);
                for (let t = 0; t < h; ++t) l[0][t] = t;
                for (let s = 1; s < r; ++s)
                    for (let o = 1; o < h; ++o)
                        t[e + o - 1] === i[n + s - 1]
                            ? (l[s][o] = l[s - 1][o - 1])
                            : ((a = l[s - 1][o] + 1),
                              (c = l[s][o - 1] + 1),
                              (l[s][o] = a < c ? a : c));
                return l;
            })(t, e, s, i, n, o)
        ),
        c = [];
    let d = void 0,
        u = e,
        f = n;
    for (let t = 0; t < a.length; ++t)
        switch (a[t]) {
            case 0:
                void 0 !== d && (c.push(d), (d = void 0)), u++, f++;
                break;
            case 1:
                void 0 === d && (d = kt(u, [], 0)),
                    d.addedCount++,
                    u++,
                    d.removed.push(i[f]),
                    f++;
                break;
            case 2:
                void 0 === d && (d = kt(u, [], 0)), d.addedCount++, u++;
                break;
            case 3:
                void 0 === d && (d = kt(u, [], 0)), d.removed.push(i[f]), f++;
        }
    return void 0 !== d && c.push(d), c;
}
const Bt = Array.prototype.push;
function St(t, e, s, i) {
    const n = kt(e, s, i);
    let o = !1,
        r = 0;
    for (let e = 0, s = t.length; e < s; e++) {
        const s = t[e];
        if (((s.index += r), o)) continue;
        const i =
            ((h = n.index),
            (l = n.index + n.removed.length),
            (a = s.index),
            (c = s.index + s.addedCount),
            l < a || c < h
                ? -1
                : l === a || c === h
                ? 0
                : h < a
                ? l < c
                    ? l - a
                    : c - a
                : c < l
                ? c - h
                : l - h);
        if (i >= 0) {
            t.splice(e, 1),
                e--,
                (r -= s.addedCount - s.removed.length),
                (n.addedCount += s.addedCount - i);
            const h = n.removed.length + s.removed.length - i;
            if (n.addedCount || h) {
                let t = s.removed;
                if (n.index < s.index) {
                    const e = n.removed.slice(0, s.index - n.index);
                    Bt.apply(e, t), (t = e);
                }
                if (n.index + n.removed.length > s.index + s.addedCount) {
                    const e = n.removed.slice(s.index + s.addedCount - n.index);
                    Bt.apply(t, e);
                }
                (n.removed = t), s.index < n.index && (n.index = s.index);
            } else o = !0;
        } else if (n.index < s.index) {
            (o = !0), t.splice(e, 0, n), e++;
            const i = n.addedCount - n.removed.length;
            (s.index += i), (r += i);
        }
    }
    var h, l, a, c;
    o || t.push(n);
}
function Et(t, e) {
    let s = [];
    const i = (function(t) {
        const e = [];
        for (let s = 0, i = t.length; s < i; s++) {
            const i = t[s];
            St(e, i.index, i.removed, i.addedCount);
        }
        return e;
    })(e);
    for (let e = 0, n = i.length; e < n; ++e) {
        const n = i[e];
        1 !== n.addedCount || 1 !== n.removed.length
            ? (s = s.concat(
                  At(t, n.index, n.index + n.addedCount, n.removed, 0, n.removed.length)
              ))
            : n.removed[0] !== t[n.index] && s.push(n);
    }
    return s;
}
let Vt = !1;
function Pt(t, e) {
    let s = t.index;
    const i = e.length;
    return (
        s > i
            ? (s = i - t.addedCount)
            : s < 0 && (s = i + t.removed.length + s - t.addedCount),
        s < 0 && (s = 0),
        (t.index = s),
        t
    );
}
class Mt extends c {
    constructor(t) {
        super(t),
            (this.oldCollection = void 0),
            (this.splices = void 0),
            (this.needsQueue = !0),
            (this.call = this.flush),
            (t.$fastController = this);
    }
    addSplice(t) {
        void 0 === this.splices ? (this.splices = [t]) : this.splices.push(t),
            this.needsQueue && ((this.needsQueue = !1), o.queueUpdate(this));
    }
    reset(t) {
        (this.oldCollection = t),
            this.needsQueue && ((this.needsQueue = !1), o.queueUpdate(this));
    }
    flush() {
        const t = this.splices,
            e = this.oldCollection;
        if (void 0 === t && void 0 === e) return;
        (this.needsQueue = !0), (this.splices = void 0), (this.oldCollection = void 0);
        const s =
            void 0 === e
                ? Et(this.source, t)
                : At(this.source, 0, this.source.length, e, 0, e.length);
        this.notify(s);
    }
}
const It = Object.freeze({ positioning: !1 });
function Lt(t, e, s, i) {
    t.bind(e[s], i);
}
function $t(t, e, s, i) {
    const n = Object.create(i);
    (n.index = s), (n.length = e.length), t.bind(e[s], n);
}
class Ft {
    constructor(t, e, s, i) {
        (this.location = t),
            (this.template = s),
            (this.options = i),
            (this.source = void 0),
            (this.views = []),
            (this.items = null),
            (this.itemsObserver = void 0),
            (this.originalContext = void 0),
            (this.childContext = void 0),
            (this.bindView = Lt),
            (this.observableExpression = new T(e, this)),
            i.positioning && (this.bindView = $t);
    }
    bind(t, e) {
        (this.source = t),
            (this.originalContext = e),
            (this.childContext = Object.create(e)),
            (this.childContext.parent = t),
            (this.items = this.observableExpression.evaluate(t, this.originalContext)),
            this.observeItems(),
            this.refreshAllViews();
    }
    unbind() {
        (this.source = null),
            (this.items = null),
            void 0 !== this.itemsObserver && this.itemsObserver.unsubscribe(this),
            this.unbindAllViews(),
            this.observableExpression.dispose();
    }
    handleExpressionChange() {
        (this.items = this.observableExpression.evaluate(
            this.source,
            this.originalContext
        )),
            this.observeItems(),
            this.refreshAllViews();
    }
    handleChange(t, e) {
        this.updateViews(e);
    }
    observeItems() {
        this.items || (this.items = []);
        const t = this.itemsObserver,
            e = (this.itemsObserver = v.getNotifier(this.items));
        t !== e && (void 0 !== t && t.unsubscribe(this), e.subscribe(this));
    }
    updateViews(t) {
        const e = this.childContext,
            s = this.views,
            i = [],
            n = this.bindView;
        let o = 0;
        for (let e = 0, n = t.length; e < n; ++e) {
            const n = t[e],
                r = n.removed;
            i.push(...s.splice(n.index + o, r.length)), (o -= n.addedCount);
        }
        const r = this.items,
            h = this.template;
        for (let o = 0, l = t.length; o < l; ++o) {
            const l = t[o];
            let a = l.index;
            const c = a + l.addedCount;
            for (; a < c; ++a) {
                const t = s[a],
                    o = t ? t.firstChild : this.location,
                    l = i.length > 0 ? i.shift() : h.create();
                s.splice(a, 0, l), n(l, r, a, e), l.insertBefore(o);
            }
        }
        for (let t = 0, e = i.length; t < e; ++t) i[t].dispose();
        if (this.options.positioning)
            for (let t = 0, e = s.length; t < e; ++t) {
                const i = s[t].context;
                (i.length = e), (i.index = t);
            }
    }
    refreshAllViews() {
        const t = this.items,
            e = this.childContext;
        let s = t.length,
            i = this.views;
        const n = i.length,
            o = this.template,
            r = this.location,
            h = this.bindView;
        if (0 === s) z.disposeContiguousBatch(this.views), (this.views = []);
        else if (0 === n) {
            this.views = i = new Array(s);
            for (let n = 0; n < s; ++n) {
                const s = o.create();
                h(s, t, n, e), (i[n] = s), s.insertBefore(r);
            }
        } else {
            let l = 0;
            for (; l < s; ++l)
                if (l < n) {
                    h(i[l], t, l, e);
                } else {
                    const s = o.create();
                    h(s, t, l, e), i.push(s), s.insertBefore(r);
                }
            const a = i.splice(l, n - l);
            for (l = 0, s = a.length; l < s; ++l) a[l].dispose();
        }
    }
    unbindAllViews() {
        const t = this.views;
        for (let e = 0, s = t.length; e < s; ++e) t[e].unbind();
    }
}
class Rt extends O {
    constructor(t, e, s) {
        super(),
            (this.expression = t),
            (this.template = e),
            (this.options = s),
            (this.createPlaceholder = o.createBlockPlaceholder),
            (function() {
                if (Vt) return;
                (Vt = !0), (v.createArrayObserver = t => new Mt(t));
                const t = Array.prototype,
                    e = t.pop,
                    s = t.push,
                    i = t.reverse,
                    n = t.shift,
                    o = t.sort,
                    r = t.splice,
                    h = t.unshift;
                (t.pop = function() {
                    const t = this.length > 0,
                        s = e.apply(this, arguments),
                        i = this.$fastController;
                    return void 0 !== i && t && i.addSplice(kt(this.length, [s], 0)), s;
                }),
                    (t.push = function() {
                        const t = s.apply(this, arguments),
                            e = this.$fastController;
                        return (
                            void 0 !== e &&
                                e.addSplice(
                                    Pt(
                                        kt(
                                            this.length - arguments.length,
                                            [],
                                            arguments.length
                                        ),
                                        this
                                    )
                                ),
                            t
                        );
                    }),
                    (t.reverse = function() {
                        let t;
                        const e = this.$fastController;
                        void 0 !== e && (e.flush(), (t = this.slice()));
                        const s = i.apply(this, arguments);
                        return void 0 !== e && e.reset(t), s;
                    }),
                    (t.shift = function() {
                        const t = this.length > 0,
                            e = n.apply(this, arguments),
                            s = this.$fastController;
                        return void 0 !== s && t && s.addSplice(kt(0, [e], 0)), e;
                    }),
                    (t.sort = function() {
                        let t;
                        const e = this.$fastController;
                        void 0 !== e && (e.flush(), (t = this.slice()));
                        const s = o.apply(this, arguments);
                        return void 0 !== e && e.reset(t), s;
                    }),
                    (t.splice = function() {
                        const t = r.apply(this, arguments),
                            e = this.$fastController;
                        return (
                            void 0 !== e &&
                                e.addSplice(
                                    Pt(
                                        kt(
                                            +arguments[0],
                                            t,
                                            arguments.length > 2
                                                ? arguments.length - 2
                                                : 0
                                        ),
                                        this
                                    )
                                ),
                            t
                        );
                    }),
                    (t.unshift = function() {
                        const t = h.apply(this, arguments),
                            e = this.$fastController;
                        return (
                            void 0 !== e &&
                                e.addSplice(Pt(kt(0, [], arguments.length), this)),
                            t
                        );
                    });
            })();
    }
    createBehavior(t) {
        return new Ft(t, this.expression, this.template, this.options);
    }
}
function jt(t, e, s = It) {
    return new Rt(t, e, s);
}
class Ht {
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
        this.updateTarget(dt),
            (this.source = null),
            this.shouldUpdate && this.unobserve();
    }
    handleEvent() {
        this.updateTarget(this.getNodes());
    }
    updateTarget(t) {
        this.source[this.options.property] = t;
    }
}
class Dt extends Ht {
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
function Qt(t) {
    return "string" == typeof t && (t = { property: t }), new k("fast-slotted", Dt, t);
}
class Ut extends Ht {
    constructor(t, e) {
        super(t, e), (this.observer = null);
    }
    getNodes() {
        return Array.from(this.target.childNodes);
    }
    observe() {
        null === this.observer &&
            (this.observer = new MutationObserver(this.handleEvent.bind(this))),
            this.observer.observe(this.target, this.options);
    }
    unobserve() {
        this.observer.disconnect();
    }
}
function qt(t) {
    return (
        "string" == typeof t && (t = { property: t, childList: !0 }),
        new k("fast-children", Ut, t)
    );
}
export {
    vt as AdoptedStyleSheetsStyles,
    k as AttachedBehaviorDirective,
    Z as AttributeDefinition,
    F as BindingBehavior,
    $ as BindingDirective,
    Ut as ChildrenBehavior,
    ot as Controller,
    o as DOM,
    O as Directive,
    ft as ElementStyles,
    y as ExecutionContext,
    at as FASTElement,
    et as FASTElementDefinition,
    _ as HTMLTemplateBehavior,
    z as HTMLView,
    v as Observable,
    T as ObservableExpression,
    d as PropertyChangeNotifier,
    wt as RefBehavior,
    Ft as RepeatBehavior,
    Rt as RepeatDirective,
    Dt as SlottedBehavior,
    mt as StyleElementStyles,
    c as SubscriberSet,
    K as ViewTemplate,
    Nt as WhenBehavior,
    Tt as WhenDirective,
    tt as attr,
    X as booleanConverter,
    qt as children,
    q as compileTemplate,
    xt as createStyles,
    Ct as css,
    ct as customElement,
    N as defaultExecutionContext,
    dt as emptyArray,
    J as html,
    Y as nullableNumberConverter,
    x as observable,
    yt as ref,
    jt as repeat,
    w as setCurrentEvent,
    Qt as slotted,
    Ot as when,
};
