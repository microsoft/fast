import { FormAssociated, FoundationElement } from "@microsoft/fast-foundation";
declare const FormAssociatedCSSLayout_base: {
    new (): {
        proxy: HTMLInputElement;
        _presentation: any;
        readonly $presentation: import("@microsoft/fast-foundation").ComponentPresentation;
        template: void | import("@microsoft/fast-element").ElementViewTemplate;
        templateChanged(): void;
        styles: void | import("@microsoft/fast-element").ElementStyles;
        stylesChanged(): void;
        connectedCallback(): void;
        accessKey: string;
        readonly accessKeyLabel: string;
        autocapitalize: string;
        dir: string;
        draggable: boolean;
        hidden: boolean;
        innerText: string;
        lang: string;
        readonly offsetHeight: number;
        readonly offsetLeft: number;
        readonly offsetParent: Element;
        readonly offsetTop: number;
        readonly offsetWidth: number;
        spellcheck: boolean;
        title: string;
        translate: boolean;
        click(): void;
        addEventListener<
            K extends
                | "error"
                | "close"
                | "pause"
                | "reset"
                | "change"
                | "scroll"
                | "copy"
                | "progress"
                | "drag"
                | "selectionchange"
                | "input"
                | "select"
                | "submit"
                | "focus"
                | "click"
                | "blur"
                | "mouseover"
                | "contextmenu"
                | "keyup"
                | "fullscreenchange"
                | "fullscreenerror"
                | "abort"
                | "animationcancel"
                | "animationend"
                | "animationiteration"
                | "animationstart"
                | "auxclick"
                | "cancel"
                | "canplay"
                | "canplaythrough"
                | "cuechange"
                | "dblclick"
                | "dragend"
                | "dragenter"
                | "dragexit"
                | "dragleave"
                | "dragover"
                | "dragstart"
                | "drop"
                | "durationchange"
                | "emptied"
                | "ended"
                | "focusin"
                | "focusout"
                | "gotpointercapture"
                | "invalid"
                | "keydown"
                | "keypress"
                | "load"
                | "loadeddata"
                | "loadedmetadata"
                | "loadstart"
                | "lostpointercapture"
                | "mousedown"
                | "mouseenter"
                | "mouseleave"
                | "mousemove"
                | "mouseout"
                | "mouseup"
                | "play"
                | "playing"
                | "pointercancel"
                | "pointerdown"
                | "pointerenter"
                | "pointerleave"
                | "pointermove"
                | "pointerout"
                | "pointerover"
                | "pointerup"
                | "ratechange"
                | "resize"
                | "securitypolicyviolation"
                | "seeked"
                | "seeking"
                | "selectstart"
                | "stalled"
                | "suspend"
                | "timeupdate"
                | "toggle"
                | "touchcancel"
                | "touchend"
                | "touchmove"
                | "touchstart"
                | "transitioncancel"
                | "transitionend"
                | "transitionrun"
                | "transitionstart"
                | "volumechange"
                | "waiting"
                | "wheel"
                | "cut"
                | "paste"
        >(
            type: K,
            listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
            options?: boolean | AddEventListenerOptions
        ): void;
        addEventListener(
            type: string,
            listener: EventListenerOrEventListenerObject,
            options?: boolean | AddEventListenerOptions
        ): void;
        removeEventListener<
            K_1 extends
                | "error"
                | "close"
                | "pause"
                | "reset"
                | "change"
                | "scroll"
                | "copy"
                | "progress"
                | "drag"
                | "selectionchange"
                | "input"
                | "select"
                | "submit"
                | "focus"
                | "click"
                | "blur"
                | "mouseover"
                | "contextmenu"
                | "keyup"
                | "fullscreenchange"
                | "fullscreenerror"
                | "abort"
                | "animationcancel"
                | "animationend"
                | "animationiteration"
                | "animationstart"
                | "auxclick"
                | "cancel"
                | "canplay"
                | "canplaythrough"
                | "cuechange"
                | "dblclick"
                | "dragend"
                | "dragenter"
                | "dragexit"
                | "dragleave"
                | "dragover"
                | "dragstart"
                | "drop"
                | "durationchange"
                | "emptied"
                | "ended"
                | "focusin"
                | "focusout"
                | "gotpointercapture"
                | "invalid"
                | "keydown"
                | "keypress"
                | "load"
                | "loadeddata"
                | "loadedmetadata"
                | "loadstart"
                | "lostpointercapture"
                | "mousedown"
                | "mouseenter"
                | "mouseleave"
                | "mousemove"
                | "mouseout"
                | "mouseup"
                | "play"
                | "playing"
                | "pointercancel"
                | "pointerdown"
                | "pointerenter"
                | "pointerleave"
                | "pointermove"
                | "pointerout"
                | "pointerover"
                | "pointerup"
                | "ratechange"
                | "resize"
                | "securitypolicyviolation"
                | "seeked"
                | "seeking"
                | "selectstart"
                | "stalled"
                | "suspend"
                | "timeupdate"
                | "toggle"
                | "touchcancel"
                | "touchend"
                | "touchmove"
                | "touchstart"
                | "transitioncancel"
                | "transitionend"
                | "transitionrun"
                | "transitionstart"
                | "volumechange"
                | "waiting"
                | "wheel"
                | "cut"
                | "paste"
        >(
            type: K_1,
            listener: (this: HTMLElement, ev: HTMLElementEventMap[K_1]) => any,
            options?: boolean | EventListenerOptions
        ): void;
        removeEventListener(
            type: string,
            listener: EventListenerOrEventListenerObject,
            options?: boolean | EventListenerOptions
        ): void;
        readonly assignedSlot: HTMLSlotElement;
        readonly attributes: NamedNodeMap;
        readonly classList: DOMTokenList;
        className: string;
        readonly clientHeight: number;
        readonly clientLeft: number;
        readonly clientTop: number;
        readonly clientWidth: number;
        id: string;
        readonly localName: string;
        readonly namespaceURI: string;
        onfullscreenchange: (this: Element, ev: Event) => any;
        onfullscreenerror: (this: Element, ev: Event) => any;
        outerHTML: string;
        readonly ownerDocument: Document;
        readonly prefix: string;
        readonly scrollHeight: number;
        scrollLeft: number;
        scrollTop: number;
        readonly scrollWidth: number;
        readonly shadowRoot: ShadowRoot;
        slot: string;
        readonly tagName: string;
        attachShadow(init: ShadowRootInit): ShadowRoot;
        closest<
            K_2 extends
                | "object"
                | "data"
                | "dir"
                | "label"
                | "link"
                | "small"
                | "sub"
                | "sup"
                | "body"
                | "map"
                | "title"
                | "code"
                | "s"
                | "head"
                | "base"
                | "source"
                | "q"
                | "meta"
                | "button"
                | "meter"
                | "textarea"
                | "style"
                | "progress"
                | "ruby"
                | "table"
                | "embed"
                | "pre"
                | "caption"
                | "menu"
                | "b"
                | "a"
                | "abbr"
                | "address"
                | "area"
                | "article"
                | "aside"
                | "audio"
                | "bdi"
                | "bdo"
                | "blockquote"
                | "br"
                | "canvas"
                | "cite"
                | "col"
                | "colgroup"
                | "datalist"
                | "dd"
                | "del"
                | "details"
                | "dfn"
                | "dialog"
                | "div"
                | "dl"
                | "dt"
                | "em"
                | "fieldset"
                | "figcaption"
                | "figure"
                | "footer"
                | "form"
                | "h1"
                | "h2"
                | "h3"
                | "h4"
                | "h5"
                | "h6"
                | "header"
                | "hgroup"
                | "hr"
                | "html"
                | "i"
                | "iframe"
                | "img"
                | "input"
                | "ins"
                | "kbd"
                | "legend"
                | "li"
                | "main"
                | "mark"
                | "nav"
                | "noscript"
                | "ol"
                | "optgroup"
                | "option"
                | "output"
                | "p"
                | "param"
                | "picture"
                | "rp"
                | "rt"
                | "samp"
                | "script"
                | "section"
                | "select"
                | "span"
                | "strong"
                | "summary"
                | "template"
                | "tbody"
                | "td"
                | "tfoot"
                | "th"
                | "thead"
                | "time"
                | "tr"
                | "track"
                | "u"
                | "ul"
                | "var"
                | "video"
                | "wbr"
                | "applet"
                | "basefont"
                | "font"
                | "frame"
                | "frameset"
                | "marquee"
                | "slot"
        >(
            selector: K_2
        ): HTMLElementTagNameMap[K_2];
        closest<
            K_3 extends
                | "symbol"
                | "line"
                | "desc"
                | "filter"
                | "path"
                | "title"
                | "text"
                | "style"
                | "circle"
                | "g"
                | "a"
                | "script"
                | "svg"
                | "clipPath"
                | "defs"
                | "ellipse"
                | "feBlend"
                | "feColorMatrix"
                | "feComponentTransfer"
                | "feComposite"
                | "feConvolveMatrix"
                | "feDiffuseLighting"
                | "feDisplacementMap"
                | "feDistantLight"
                | "feFlood"
                | "feFuncA"
                | "feFuncB"
                | "feFuncG"
                | "feFuncR"
                | "feGaussianBlur"
                | "feImage"
                | "feMerge"
                | "feMergeNode"
                | "feMorphology"
                | "feOffset"
                | "fePointLight"
                | "feSpecularLighting"
                | "feSpotLight"
                | "feTile"
                | "feTurbulence"
                | "foreignObject"
                | "image"
                | "linearGradient"
                | "marker"
                | "mask"
                | "metadata"
                | "pattern"
                | "polygon"
                | "polyline"
                | "radialGradient"
                | "rect"
                | "stop"
                | "switch"
                | "textPath"
                | "tspan"
                | "use"
                | "view"
        >(
            selector: K_3
        ): SVGElementTagNameMap[K_3];
        closest<E extends Element = Element>(selector: string): E;
        getAttribute(qualifiedName: string): string;
        getAttributeNS(namespace: string, localName: string): string;
        getAttributeNames(): string[];
        getAttributeNode(name: string): Attr;
        getAttributeNodeNS(namespaceURI: string, localName: string): Attr;
        getBoundingClientRect(): DOMRect;
        getClientRects(): DOMRectList;
        getElementsByClassName(classNames: string): HTMLCollectionOf<Element>;
        getElementsByTagName<
            K_4 extends
                | "object"
                | "data"
                | "dir"
                | "label"
                | "link"
                | "small"
                | "sub"
                | "sup"
                | "body"
                | "map"
                | "title"
                | "code"
                | "s"
                | "head"
                | "base"
                | "source"
                | "q"
                | "meta"
                | "button"
                | "meter"
                | "textarea"
                | "style"
                | "progress"
                | "ruby"
                | "table"
                | "embed"
                | "pre"
                | "caption"
                | "menu"
                | "b"
                | "a"
                | "abbr"
                | "address"
                | "area"
                | "article"
                | "aside"
                | "audio"
                | "bdi"
                | "bdo"
                | "blockquote"
                | "br"
                | "canvas"
                | "cite"
                | "col"
                | "colgroup"
                | "datalist"
                | "dd"
                | "del"
                | "details"
                | "dfn"
                | "dialog"
                | "div"
                | "dl"
                | "dt"
                | "em"
                | "fieldset"
                | "figcaption"
                | "figure"
                | "footer"
                | "form"
                | "h1"
                | "h2"
                | "h3"
                | "h4"
                | "h5"
                | "h6"
                | "header"
                | "hgroup"
                | "hr"
                | "html"
                | "i"
                | "iframe"
                | "img"
                | "input"
                | "ins"
                | "kbd"
                | "legend"
                | "li"
                | "main"
                | "mark"
                | "nav"
                | "noscript"
                | "ol"
                | "optgroup"
                | "option"
                | "output"
                | "p"
                | "param"
                | "picture"
                | "rp"
                | "rt"
                | "samp"
                | "script"
                | "section"
                | "select"
                | "span"
                | "strong"
                | "summary"
                | "template"
                | "tbody"
                | "td"
                | "tfoot"
                | "th"
                | "thead"
                | "time"
                | "tr"
                | "track"
                | "u"
                | "ul"
                | "var"
                | "video"
                | "wbr"
                | "applet"
                | "basefont"
                | "font"
                | "frame"
                | "frameset"
                | "marquee"
                | "slot"
        >(
            qualifiedName: K_4
        ): HTMLCollectionOf<HTMLElementTagNameMap[K_4]>;
        getElementsByTagName<
            K_5 extends
                | "symbol"
                | "line"
                | "desc"
                | "filter"
                | "path"
                | "title"
                | "text"
                | "style"
                | "circle"
                | "g"
                | "a"
                | "script"
                | "svg"
                | "clipPath"
                | "defs"
                | "ellipse"
                | "feBlend"
                | "feColorMatrix"
                | "feComponentTransfer"
                | "feComposite"
                | "feConvolveMatrix"
                | "feDiffuseLighting"
                | "feDisplacementMap"
                | "feDistantLight"
                | "feFlood"
                | "feFuncA"
                | "feFuncB"
                | "feFuncG"
                | "feFuncR"
                | "feGaussianBlur"
                | "feImage"
                | "feMerge"
                | "feMergeNode"
                | "feMorphology"
                | "feOffset"
                | "fePointLight"
                | "feSpecularLighting"
                | "feSpotLight"
                | "feTile"
                | "feTurbulence"
                | "foreignObject"
                | "image"
                | "linearGradient"
                | "marker"
                | "mask"
                | "metadata"
                | "pattern"
                | "polygon"
                | "polyline"
                | "radialGradient"
                | "rect"
                | "stop"
                | "switch"
                | "textPath"
                | "tspan"
                | "use"
                | "view"
        >(
            qualifiedName: K_5
        ): HTMLCollectionOf<SVGElementTagNameMap[K_5]>;
        getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
        getElementsByTagNameNS(
            namespaceURI: "http://www.w3.org/1999/xhtml",
            localName: string
        ): HTMLCollectionOf<HTMLElement>;
        getElementsByTagNameNS(
            namespaceURI: "http://www.w3.org/2000/svg",
            localName: string
        ): HTMLCollectionOf<SVGElement>;
        getElementsByTagNameNS(
            namespaceURI: string,
            localName: string
        ): HTMLCollectionOf<Element>;
        hasAttribute(qualifiedName: string): boolean;
        hasAttributeNS(namespace: string, localName: string): boolean;
        hasAttributes(): boolean;
        hasPointerCapture(pointerId: number): boolean;
        insertAdjacentElement(
            position: InsertPosition,
            insertedElement: Element
        ): Element;
        insertAdjacentHTML(where: InsertPosition, html: string): void;
        insertAdjacentText(where: InsertPosition, text: string): void;
        matches(selectors: string): boolean;
        msGetRegionContent(): any;
        releasePointerCapture(pointerId: number): void;
        removeAttribute(qualifiedName: string): void;
        removeAttributeNS(namespace: string, localName: string): void;
        removeAttributeNode(attr: Attr): Attr;
        requestFullscreen(options?: FullscreenOptions): Promise<void>;
        requestPointerLock(): void;
        scroll(options?: ScrollToOptions): void;
        scroll(x: number, y: number): void;
        scrollBy(options?: ScrollToOptions): void;
        scrollBy(x: number, y: number): void;
        scrollIntoView(arg?: boolean | ScrollIntoViewOptions): void;
        scrollTo(options?: ScrollToOptions): void;
        scrollTo(x: number, y: number): void;
        setAttribute(qualifiedName: string, value: string): void;
        setAttributeNS(namespace: string, qualifiedName: string, value: string): void;
        setAttributeNode(attr: Attr): Attr;
        setAttributeNodeNS(attr: Attr): Attr;
        setPointerCapture(pointerId: number): void;
        toggleAttribute(qualifiedName: string, force?: boolean): boolean;
        webkitMatchesSelector(selectors: string): boolean;
        readonly baseURI: string;
        readonly childNodes: NodeListOf<ChildNode>;
        readonly firstChild: ChildNode;
        readonly isConnected: boolean;
        readonly lastChild: ChildNode;
        readonly nextSibling: ChildNode;
        readonly nodeName: string;
        readonly nodeType: number;
        nodeValue: string;
        readonly parentElement: HTMLElement;
        readonly parentNode: Node & ParentNode;
        readonly previousSibling: ChildNode;
        textContent: string;
        appendChild<T extends Node>(newChild: T): T;
        cloneNode(deep?: boolean): Node;
        compareDocumentPosition(other: Node): number;
        contains(other: Node): boolean;
        getRootNode(options?: GetRootNodeOptions): Node;
        hasChildNodes(): boolean;
        insertBefore<T_1 extends Node>(newChild: T_1, refChild: Node): T_1;
        isDefaultNamespace(namespace: string): boolean;
        isEqualNode(otherNode: Node): boolean;
        isSameNode(otherNode: Node): boolean;
        lookupNamespaceURI(prefix: string): string;
        lookupPrefix(namespace: string): string;
        normalize(): void;
        removeChild<T_2 extends Node>(oldChild: T_2): T_2;
        replaceChild<T_3 extends Node>(newChild: Node, oldChild: T_3): T_3;
        readonly ATTRIBUTE_NODE: number;
        readonly CDATA_SECTION_NODE: number;
        readonly COMMENT_NODE: number;
        readonly DOCUMENT_FRAGMENT_NODE: number;
        readonly DOCUMENT_NODE: number;
        readonly DOCUMENT_POSITION_CONTAINED_BY: number;
        readonly DOCUMENT_POSITION_CONTAINS: number;
        readonly DOCUMENT_POSITION_DISCONNECTED: number;
        readonly DOCUMENT_POSITION_FOLLOWING: number;
        readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: number;
        readonly DOCUMENT_POSITION_PRECEDING: number;
        readonly DOCUMENT_TYPE_NODE: number;
        readonly ELEMENT_NODE: number;
        readonly ENTITY_NODE: number;
        readonly ENTITY_REFERENCE_NODE: number;
        readonly NOTATION_NODE: number;
        readonly PROCESSING_INSTRUCTION_NODE: number;
        readonly TEXT_NODE: number;
        dispatchEvent(event: Event): boolean;
        dispatchEvent(event: Event): boolean;
        animate(
            keyframes: PropertyIndexedKeyframes | Keyframe[],
            options?: number | KeyframeAnimationOptions
        ): Animation;
        getAnimations(): Animation[];
        after(...nodes: (string | Node)[]): void;
        before(...nodes: (string | Node)[]): void;
        remove(): void;
        replaceWith(...nodes: (string | Node)[]): void;
        innerHTML: string;
        readonly nextElementSibling: Element;
        readonly previousElementSibling: Element;
        readonly childElementCount: number;
        readonly children: HTMLCollection;
        readonly firstElementChild: Element;
        readonly lastElementChild: Element;
        append(...nodes: (string | Node)[]): void;
        prepend(...nodes: (string | Node)[]): void;
        querySelector<
            K_6 extends
                | "object"
                | "data"
                | "dir"
                | "label"
                | "link"
                | "small"
                | "sub"
                | "sup"
                | "body"
                | "map"
                | "title"
                | "code"
                | "s"
                | "head"
                | "base"
                | "source"
                | "q"
                | "meta"
                | "button"
                | "meter"
                | "textarea"
                | "style"
                | "progress"
                | "ruby"
                | "table"
                | "embed"
                | "pre"
                | "caption"
                | "menu"
                | "b"
                | "a"
                | "abbr"
                | "address"
                | "area"
                | "article"
                | "aside"
                | "audio"
                | "bdi"
                | "bdo"
                | "blockquote"
                | "br"
                | "canvas"
                | "cite"
                | "col"
                | "colgroup"
                | "datalist"
                | "dd"
                | "del"
                | "details"
                | "dfn"
                | "dialog"
                | "div"
                | "dl"
                | "dt"
                | "em"
                | "fieldset"
                | "figcaption"
                | "figure"
                | "footer"
                | "form"
                | "h1"
                | "h2"
                | "h3"
                | "h4"
                | "h5"
                | "h6"
                | "header"
                | "hgroup"
                | "hr"
                | "html"
                | "i"
                | "iframe"
                | "img"
                | "input"
                | "ins"
                | "kbd"
                | "legend"
                | "li"
                | "main"
                | "mark"
                | "nav"
                | "noscript"
                | "ol"
                | "optgroup"
                | "option"
                | "output"
                | "p"
                | "param"
                | "picture"
                | "rp"
                | "rt"
                | "samp"
                | "script"
                | "section"
                | "select"
                | "span"
                | "strong"
                | "summary"
                | "template"
                | "tbody"
                | "td"
                | "tfoot"
                | "th"
                | "thead"
                | "time"
                | "tr"
                | "track"
                | "u"
                | "ul"
                | "var"
                | "video"
                | "wbr"
                | "applet"
                | "basefont"
                | "font"
                | "frame"
                | "frameset"
                | "marquee"
                | "slot"
        >(
            selectors: K_6
        ): HTMLElementTagNameMap[K_6];
        querySelector<
            K_7 extends
                | "symbol"
                | "line"
                | "desc"
                | "filter"
                | "path"
                | "title"
                | "text"
                | "style"
                | "circle"
                | "g"
                | "a"
                | "script"
                | "svg"
                | "clipPath"
                | "defs"
                | "ellipse"
                | "feBlend"
                | "feColorMatrix"
                | "feComponentTransfer"
                | "feComposite"
                | "feConvolveMatrix"
                | "feDiffuseLighting"
                | "feDisplacementMap"
                | "feDistantLight"
                | "feFlood"
                | "feFuncA"
                | "feFuncB"
                | "feFuncG"
                | "feFuncR"
                | "feGaussianBlur"
                | "feImage"
                | "feMerge"
                | "feMergeNode"
                | "feMorphology"
                | "feOffset"
                | "fePointLight"
                | "feSpecularLighting"
                | "feSpotLight"
                | "feTile"
                | "feTurbulence"
                | "foreignObject"
                | "image"
                | "linearGradient"
                | "marker"
                | "mask"
                | "metadata"
                | "pattern"
                | "polygon"
                | "polyline"
                | "radialGradient"
                | "rect"
                | "stop"
                | "switch"
                | "textPath"
                | "tspan"
                | "use"
                | "view"
        >(
            selectors: K_7
        ): SVGElementTagNameMap[K_7];
        querySelector<E_1 extends Element = Element>(selectors: string): E_1;
        querySelectorAll<
            K_8 extends
                | "object"
                | "data"
                | "dir"
                | "label"
                | "link"
                | "small"
                | "sub"
                | "sup"
                | "body"
                | "map"
                | "title"
                | "code"
                | "s"
                | "head"
                | "base"
                | "source"
                | "q"
                | "meta"
                | "button"
                | "meter"
                | "textarea"
                | "style"
                | "progress"
                | "ruby"
                | "table"
                | "embed"
                | "pre"
                | "caption"
                | "menu"
                | "b"
                | "a"
                | "abbr"
                | "address"
                | "area"
                | "article"
                | "aside"
                | "audio"
                | "bdi"
                | "bdo"
                | "blockquote"
                | "br"
                | "canvas"
                | "cite"
                | "col"
                | "colgroup"
                | "datalist"
                | "dd"
                | "del"
                | "details"
                | "dfn"
                | "dialog"
                | "div"
                | "dl"
                | "dt"
                | "em"
                | "fieldset"
                | "figcaption"
                | "figure"
                | "footer"
                | "form"
                | "h1"
                | "h2"
                | "h3"
                | "h4"
                | "h5"
                | "h6"
                | "header"
                | "hgroup"
                | "hr"
                | "html"
                | "i"
                | "iframe"
                | "img"
                | "input"
                | "ins"
                | "kbd"
                | "legend"
                | "li"
                | "main"
                | "mark"
                | "nav"
                | "noscript"
                | "ol"
                | "optgroup"
                | "option"
                | "output"
                | "p"
                | "param"
                | "picture"
                | "rp"
                | "rt"
                | "samp"
                | "script"
                | "section"
                | "select"
                | "span"
                | "strong"
                | "summary"
                | "template"
                | "tbody"
                | "td"
                | "tfoot"
                | "th"
                | "thead"
                | "time"
                | "tr"
                | "track"
                | "u"
                | "ul"
                | "var"
                | "video"
                | "wbr"
                | "applet"
                | "basefont"
                | "font"
                | "frame"
                | "frameset"
                | "marquee"
                | "slot"
        >(
            selectors: K_8
        ): NodeListOf<HTMLElementTagNameMap[K_8]>;
        querySelectorAll<
            K_9 extends
                | "symbol"
                | "line"
                | "desc"
                | "filter"
                | "path"
                | "title"
                | "text"
                | "style"
                | "circle"
                | "g"
                | "a"
                | "script"
                | "svg"
                | "clipPath"
                | "defs"
                | "ellipse"
                | "feBlend"
                | "feColorMatrix"
                | "feComponentTransfer"
                | "feComposite"
                | "feConvolveMatrix"
                | "feDiffuseLighting"
                | "feDisplacementMap"
                | "feDistantLight"
                | "feFlood"
                | "feFuncA"
                | "feFuncB"
                | "feFuncG"
                | "feFuncR"
                | "feGaussianBlur"
                | "feImage"
                | "feMerge"
                | "feMergeNode"
                | "feMorphology"
                | "feOffset"
                | "fePointLight"
                | "feSpecularLighting"
                | "feSpotLight"
                | "feTile"
                | "feTurbulence"
                | "foreignObject"
                | "image"
                | "linearGradient"
                | "marker"
                | "mask"
                | "metadata"
                | "pattern"
                | "polygon"
                | "polyline"
                | "radialGradient"
                | "rect"
                | "stop"
                | "switch"
                | "textPath"
                | "tspan"
                | "use"
                | "view"
        >(
            selectors: K_9
        ): NodeListOf<SVGElementTagNameMap[K_9]>;
        querySelectorAll<E_2 extends Element = Element>(
            selectors: string
        ): NodeListOf<E_2>;
        oncopy: (this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any;
        oncut: (this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any;
        onpaste: (this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any;
        readonly style: CSSStyleDeclaration;
        contentEditable: string;
        inputMode: string;
        readonly isContentEditable: boolean;
        onabort: (this: GlobalEventHandlers, ev: UIEvent) => any;
        onanimationcancel: (this: GlobalEventHandlers, ev: AnimationEvent) => any;
        onanimationend: (this: GlobalEventHandlers, ev: AnimationEvent) => any;
        onanimationiteration: (this: GlobalEventHandlers, ev: AnimationEvent) => any;
        onanimationstart: (this: GlobalEventHandlers, ev: AnimationEvent) => any;
        onauxclick: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        onblur: (this: GlobalEventHandlers, ev: FocusEvent) => any;
        oncancel: (this: GlobalEventHandlers, ev: Event) => any;
        oncanplay: (this: GlobalEventHandlers, ev: Event) => any;
        oncanplaythrough: (this: GlobalEventHandlers, ev: Event) => any;
        onchange: (this: GlobalEventHandlers, ev: Event) => any;
        onclick: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        onclose: (this: GlobalEventHandlers, ev: Event) => any;
        oncontextmenu: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        oncuechange: (this: GlobalEventHandlers, ev: Event) => any;
        ondblclick: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        ondrag: (this: GlobalEventHandlers, ev: DragEvent) => any;
        ondragend: (this: GlobalEventHandlers, ev: DragEvent) => any;
        ondragenter: (this: GlobalEventHandlers, ev: DragEvent) => any;
        ondragexit: (this: GlobalEventHandlers, ev: Event) => any;
        ondragleave: (this: GlobalEventHandlers, ev: DragEvent) => any;
        ondragover: (this: GlobalEventHandlers, ev: DragEvent) => any;
        ondragstart: (this: GlobalEventHandlers, ev: DragEvent) => any;
        ondrop: (this: GlobalEventHandlers, ev: DragEvent) => any;
        ondurationchange: (this: GlobalEventHandlers, ev: Event) => any;
        onemptied: (this: GlobalEventHandlers, ev: Event) => any;
        onended: (this: GlobalEventHandlers, ev: Event) => any;
        onerror: OnErrorEventHandlerNonNull;
        onfocus: (this: GlobalEventHandlers, ev: FocusEvent) => any;
        ongotpointercapture: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        oninput: (this: GlobalEventHandlers, ev: Event) => any;
        oninvalid: (this: GlobalEventHandlers, ev: Event) => any;
        onkeydown: (this: GlobalEventHandlers, ev: KeyboardEvent) => any;
        onkeypress: (this: GlobalEventHandlers, ev: KeyboardEvent) => any;
        onkeyup: (this: GlobalEventHandlers, ev: KeyboardEvent) => any;
        onload: (this: GlobalEventHandlers, ev: Event) => any;
        onloadeddata: (this: GlobalEventHandlers, ev: Event) => any;
        onloadedmetadata: (this: GlobalEventHandlers, ev: Event) => any;
        onloadstart: (this: GlobalEventHandlers, ev: Event) => any;
        onlostpointercapture: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        onmousedown: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        onmouseenter: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        onmouseleave: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        onmousemove: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        onmouseout: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        onmouseover: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        onmouseup: (this: GlobalEventHandlers, ev: MouseEvent) => any;
        onpause: (this: GlobalEventHandlers, ev: Event) => any;
        onplay: (this: GlobalEventHandlers, ev: Event) => any;
        onplaying: (this: GlobalEventHandlers, ev: Event) => any;
        onpointercancel: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        onpointerdown: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        onpointerenter: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        onpointerleave: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        onpointermove: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        onpointerout: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        onpointerover: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        onpointerup: (this: GlobalEventHandlers, ev: PointerEvent) => any;
        onprogress: (this: GlobalEventHandlers, ev: ProgressEvent<EventTarget>) => any;
        onratechange: (this: GlobalEventHandlers, ev: Event) => any;
        onreset: (this: GlobalEventHandlers, ev: Event) => any;
        onresize: (this: GlobalEventHandlers, ev: UIEvent) => any;
        onscroll: (this: GlobalEventHandlers, ev: Event) => any;
        onsecuritypolicyviolation: (
            this: GlobalEventHandlers,
            ev: SecurityPolicyViolationEvent
        ) => any;
        onseeked: (this: GlobalEventHandlers, ev: Event) => any;
        onseeking: (this: GlobalEventHandlers, ev: Event) => any;
        onselect: (this: GlobalEventHandlers, ev: Event) => any;
        onselectionchange: (this: GlobalEventHandlers, ev: Event) => any;
        onselectstart: (this: GlobalEventHandlers, ev: Event) => any;
        onstalled: (this: GlobalEventHandlers, ev: Event) => any;
        onsubmit: (this: GlobalEventHandlers, ev: Event) => any;
        onsuspend: (this: GlobalEventHandlers, ev: Event) => any;
        ontimeupdate: (this: GlobalEventHandlers, ev: Event) => any;
        ontoggle: (this: GlobalEventHandlers, ev: Event) => any;
        ontouchcancel?: (this: GlobalEventHandlers, ev: TouchEvent) => any;
        ontouchend?: (this: GlobalEventHandlers, ev: TouchEvent) => any;
        ontouchmove?: (this: GlobalEventHandlers, ev: TouchEvent) => any;
        ontouchstart?: (this: GlobalEventHandlers, ev: TouchEvent) => any;
        ontransitioncancel: (this: GlobalEventHandlers, ev: TransitionEvent) => any;
        ontransitionend: (this: GlobalEventHandlers, ev: TransitionEvent) => any;
        ontransitionrun: (this: GlobalEventHandlers, ev: TransitionEvent) => any;
        ontransitionstart: (this: GlobalEventHandlers, ev: TransitionEvent) => any;
        onvolumechange: (this: GlobalEventHandlers, ev: Event) => any;
        onwaiting: (this: GlobalEventHandlers, ev: Event) => any;
        onwheel: (this: GlobalEventHandlers, ev: WheelEvent) => any;
        autofocus: boolean;
        readonly dataset: DOMStringMap;
        nonce?: string;
        tabIndex: number;
        blur(): void;
        focus(options?: FocusOptions): void;
        readonly $fastController: import("@microsoft/fast-element").Controller;
        $emit(
            type: string,
            detail?: any,
            options?: Pick<CustomEventInit<any>, "bubbles" | "cancelable" | "composed">
        ): boolean | void;
        disconnectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    };
    compose<
        T_4 extends import("@microsoft/fast-foundation").FoundationElementDefinition = import("@microsoft/fast-foundation").FoundationElementDefinition,
        K_10 extends import("@microsoft/fast-element").Constructable<
            FoundationElement
        > = import("@microsoft/fast-element").Constructable<FoundationElement>
    >(
        this: K_10,
        elementDefinition: T_4
    ): (
        overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
            T_4
        >
    ) => import("@microsoft/fast-foundation").FoundationElementRegistry<T_4, K_10>;
    from<
        TBase extends {
            new (): HTMLElement;
            prototype: HTMLElement;
        }
    >(
        BaseType: TBase
    ): new () => InstanceType<TBase> & import("@microsoft/fast-element").FASTElement;
    define<TType extends Function>(
        type: TType,
        nameOrDef?:
            | string
            | import("@microsoft/fast-element").PartialFASTElementDefinition
    ): TType;
};
/**
 * A form-associated base class for the flexbox component.
 *
 * @internal
 */
export declare class FormAssociatedCSSLayout extends FormAssociatedCSSLayout_base {}
/**
 * @internal
 */
export interface FormAssociatedCSSLayout extends FormAssociated {}
export {};
