import { attr, customElement, DOM, FASTElement, html, nullableNumberConverter, observable, Updates } from '@microsoft/fast-element';
import React from "react";
import ReactDOM from "react-dom";
import { uniqueElementName } from '@microsoft/fast-element/testing';
import { expect } from "chai";
import { reactWrapper } from './index.js';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
type CustomElementProperties = {
  bool: boolean;
  str: string;
  num: number;
  obj: {[index: string]: unknown} | null | undefined;
  arr: unknown[] | null | undefined;
  rbool: boolean;
  rstr: string;
  rnum: number;
};

type CustomElement = HTMLElement & CustomElementProperties;

const restTestEvents = {
  onFoo: 'foo',
  onBar: 'bar',
};

function emitEvent(element: HTMLElement, type: string) {
  const e = new CustomEvent(type);
  element.dispatchEvent(e);
}

const vanillaElementName = uniqueElementName();
class VanillaElement extends HTMLElement {
  public bool = false;
  public str = '';
  public num = -1;
  public obj = null;
  public arr = null;

  private _rstr = '';
  get rstr() {
    return this._rstr;
  }
  set rstr(value: string) {
    this._rstr = value;
    this.setAttribute('rstr', value.toString());
  }

  private _rbool = false;
  get rbool() {
    return this._rbool;
  }
  set rbool(value: boolean) {
    this._rbool = value;
    DOM.setBooleanAttribute(this, 'rbool', value);
  }

  private _rnum = -1;
  get rnum() {
    return this._rnum;
  }
  set rnum(value: number) {
    this._rnum = value;
    this.setAttribute('rnum', value.toString());
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    switch(name) {
      case 'rstr':
        this._rstr = newValue;
        break;
      case 'rbool':
        if (newValue === '') {
          this._rbool = true;
        } else {
          this._rbool = false;
        }
        break;
      case 'rnum':
        this._rnum = nullableNumberConverter.fromView(newValue);
        break;
    }
  }
}

customElements.define(vanillaElementName, VanillaElement);

const decoratedElementName = uniqueElementName();
@customElement({
  name: decoratedElementName,
  template: html`<slot></slot>`
})
class DecoratedTestElement extends FASTElement {
  @observable bool = false;
  @observable str = '';
  @observable num = -1;
  @observable obj: {[index: string]: unknown} | null | undefined = null;
  @observable arr: unknown[] | null | undefined = null;
  @attr({ mode: "boolean" }) rbool = false;
  @attr rstr = '';
  @attr({ converter: nullableNumberConverter }) rnum = -1;
}

class DefinitionTestElement extends FASTElement {
  @observable bool = false;
  @observable str = '';
  @observable num = -1;
  @observable obj: {[index: string]: unknown} | null | undefined = null;
  @observable arr: unknown[] | null | undefined = null;
  @attr({ mode: "boolean" }) rbool = false;
  @attr rstr = '';
  @attr({ converter: nullableNumberConverter }) rnum = -1;
}

const def = DefinitionTestElement.compose({
  name: uniqueElementName(),
  template: html`<slot></slot>`
});

const scenarios = [
  {
    description: 'Wrapping a decorated FASTElement',
    elementName: decoratedElementName,
    wrap: (x: any) => x(DecoratedTestElement, {
      events: restTestEvents
    })
  },
  {
    description: 'Wrapping a FASTElementDefinition',
    elementName: def.name,
    wrap: (x: any) => x(def, {
      events: restTestEvents
    })
  },
  {
    description: 'Wrapping a vanilla Web Component',
    elementName: vanillaElementName,
    wrap: (x: any) => x(VanillaElement, {
      name: vanillaElementName,
      events: restTestEvents,
      properties: [
        'bool',
        'str',
        'num',
        'obj',
        'arr',
        'rbool',
        'rstr',
        'rnum'
      ]
    })
  }
];

for (const scenario of scenarios) {
  describe(scenario.description, () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });

    const wrap = reactWrapper(React);
    const WrappedComponent = scenario.wrap(wrap);

    let el: CustomElement;

    const renderReactComponent = (
      /* eslint-disable-next-line @typescript-eslint/ban-types */
      props?: {}
    ) => {
      ReactDOM.render(
        <WrappedComponent {...props}/>,
        container
      );

      el = container.querySelector(scenario.elementName)! as CustomElement;
    };

    it('works with text children', async () => {
      const name = 'World';
      ReactDOM.render(
        <WrappedComponent>Hello {name}</WrappedComponent>,
        container
      );
      el = container.querySelector(scenario.elementName)! as CustomElement;
      expect(el.textContent).to.equal('Hello World');
    });

    it('does not recreate the same component twice', async () => {
      const SameWrappedComponent = scenario.wrap(wrap);
      expect(WrappedComponent).to.eq(SameWrappedComponent);
    });

    it('wrapper renders custom element that updates', async () => {
      renderReactComponent();
      expect(el).ok;
      expect(el.isConnected).ok;
    });

    it('can get ref to element', async () => {
      const elementRef1 = React.createRef();
      renderReactComponent({ref: elementRef1});
      expect(elementRef1.current).equal(el);
      const elementRef2 = React.createRef();
      renderReactComponent({ref: elementRef2});
      expect(elementRef1.current).equal(null);
      expect(elementRef2.current).equal(el);
      renderReactComponent({ref: elementRef1});
      expect(elementRef1.current).equal(el);
      expect(elementRef2.current).equal(null);
    });

    it('can get ref to element via callbacks', async () => {
      const ref1Calls: Array<string | undefined> = [];
      const refCb1 = (e: Element | null) => ref1Calls.push(e?.localName);
      const ref2Calls: Array<string | undefined> = [];
      const refCb2 = (e: Element | null) => ref2Calls.push(e?.localName);
      renderReactComponent({ref: refCb1});
      expect(ref1Calls).eql([scenario.elementName]);
      renderReactComponent({ref: refCb2});
      expect(ref1Calls).eql([scenario.elementName, undefined]);
      expect(ref2Calls).eql([scenario.elementName]);
      renderReactComponent({ref: refCb1});
      expect(ref1Calls).eql([scenario.elementName, undefined, scenario.elementName]);
      expect(ref2Calls).eql([scenario.elementName, undefined]);
    });

    it('can set attributes', async () => {
      await renderReactComponent({id: 'id'});
      expect(el.getAttribute('id')).equal('id');
      await renderReactComponent({id: undefined});
      expect(el.getAttribute('id')).equal(null);
      await renderReactComponent({id: 'id2'});
      expect(el.getAttribute('id')).equal('id2');
    });

    it('can set properties', async () => {
      let o = {foo: true};
      let a = [1, 2, 3];
      await renderReactComponent({
        bool: true,
        str: 'str',
        num: 5,
        obj: o,
        arr: a,
      });
      expect(el.bool).equal(true);
      expect(el.str).equal('str');
      expect(el.num).equal(5);
      expect(el.obj).eql(o);
      expect(el.arr).eql(a);
      const firstEl = el;
      // update
      o = {foo: false};
      a = [1, 2, 3, 4];
      await renderReactComponent({
        bool: false,
        str: 'str2',
        num: 10,
        obj: o,
        arr: a,
      });
      expect(firstEl).equal(el);
      expect(el.bool).equal(false);
      expect(el.str).equal('str2');
      expect(el.num).equal(10);
      expect(el.obj).eql(o);
      expect(el.arr).eql(a);
    });

    it('can set properties that reflect', async () => {
      renderReactComponent({
        rbool: true,
        rstr: 'str',
        rnum: 5,
      });

      await Updates.next();

      const firstEl = el;
      expect(el.rbool).equal(true);
      expect(el.rstr).equal('str');
      expect(el.rnum).equal(5);
      expect(el.getAttribute('rbool')).equal('');
      expect(el.getAttribute('rstr')).equal('str');
      expect(el.getAttribute('rnum')).equal('5');
      // update

      renderReactComponent({
        rbool: false,
        rstr: 'str2',
        rnum: 10,
      });

      await Updates.next();

      expect(firstEl).equal(el);
      expect(el.rbool).equal(false);
      expect(el.rstr).equal('str2');
      expect(el.rnum).equal(10);
      expect(el.getAttribute('rbool')).equal(null);
      expect(el.getAttribute('rstr')).equal('str2');
      expect(el.getAttribute('rnum')).equal('10');
    });

    it('can listen to events', async () => {
      let fooEvent: Event | undefined,
        fooEvent2: Event | undefined,
        barEvent: Event | undefined;
      const onFoo = (e: Event) => {
        fooEvent = e;
      };
      const onFoo2 = (e: Event) => {
        fooEvent2 = e;
      };
      const onBar = (e: Event) => {
        barEvent = e;
      };
      await renderReactComponent({
        onFoo,
        onBar,
      });
      emitEvent(el, 'foo');
      expect(fooEvent!.type).equal('foo');
      emitEvent(el, 'bar');
      expect(barEvent!.type).equal('bar');
      fooEvent = undefined;
      barEvent = undefined;
      await renderReactComponent({
        onFoo: undefined,
      });
      emitEvent(el, 'foo');
      expect(fooEvent).equal(undefined);
      emitEvent(el, 'bar');
      expect(barEvent!.type).equal('bar');
      fooEvent = undefined;
      barEvent = undefined;
      await renderReactComponent({
        onFoo,
      });
      emitEvent(el, 'foo');
      expect(fooEvent!.type).equal('foo');
      emitEvent(el, 'bar');
      expect(barEvent!.type).equal('bar');
      await renderReactComponent({
        onFoo: onFoo2,
      });
      fooEvent = undefined;
      fooEvent2 = undefined;
      emitEvent(el, 'foo');
      expect(fooEvent).equal(undefined);
      expect(fooEvent2!.type).equal('foo');
      await renderReactComponent({
        onFoo,
      });
      fooEvent = undefined;
      fooEvent2 = undefined;
      emitEvent(el, 'foo');
      expect(fooEvent!.type).equal('foo');
      expect(fooEvent2).equal(undefined);
    });

    it('can listen to native events', async () => {
      let clickEvent!: React.MouseEvent;
      await renderReactComponent({
        onClick(e: React.MouseEvent) {
          e.persist();
          clickEvent = e;
        },
      });
      el.click();
      expect(clickEvent?.type).equal('click');
    });

    it('can set children', async () => {
      const children = (React.createElement(
        'div'
        // Note, constructing children like this is rare and the React type expects
        // this to be an HTMLCollection even though that's not the output of
        // `createElement`.
      ) as unknown) as HTMLCollection;
      await renderReactComponent({children});
      expect(el.childNodes.length).equal(1);
      expect(el.firstElementChild!.localName).equal('div');
    });

    it('can set reserved React properties', async () => {
      await renderReactComponent({
        style: {display: 'block'},
        className: 'foo bar',
      } as any);
      expect(el.style.display).equal('block');
      expect(el.getAttribute('class')).equal('foo bar');
    });

    it('warns if element contains reserved props', async () => {
      const warn = console.warn;
      let warning: string;
      console.warn = (m: string) => {
        warning = m;
      };

      @customElement(uniqueElementName())
      class Warn extends FASTElement {
        @attr ref = 'hi';
      }

      const wrap = reactWrapper(React);
      const WarningComponent = wrap(Warn);

      ReactDOM.render(
        <WarningComponent></WarningComponent>,
        container
      );

      expect(warning!).include('ref')
      console.warn = warn;
    });
  });
}
/* eslint-enable @typescript-eslint/no-non-null-assertion */
