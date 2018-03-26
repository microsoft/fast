# What is FAST-DNA?
A design architecture for the web that enables real-time updating of user experiences based on changing inputs. The acronym stands for fast, adaptive, secure, timeless as a design network architecture.

The majority of the effort in building component frameworks goes into the markup, accessibility, localization, and more. Let FAST-DNA do the hard work so you can focus on your design language and user experience.


## Packages
[Lerna](https://github.com/lerna/lerna) in [independent mode](https://github.com/lerna/lerna#independent-mode---independent) is used to organize and manage the monorepository and contains a set of utilities each of which are published to NPM. Users can choose one package, some packages, or all of them together as an ACCELERATOR to quickly construct enterprise experiences. Highly tuned production code where the hard work has been done already.


### React packages
Built on ReactJS, bundled with Webpack, including Redux for state management.

#### FAST components base
A set of base components written in React that deliver quality HTML markup optimized for performance, accessibility, and modern browsers. A large amount of effort in all component frameworks often goes into just this, so delivering these base components as a package that then allows users to add a design language can reap major efficiency benefits in the design process. [Readme](https://github.com/Microsoft/fast-dna/tree/master/packages/fast-components-react-base)

#### FAST components styled with for Microsoft
A set of React components with a Microsoft design system driving the look and feel. [Readme](https://github.com/Microsoft/fast-dna/tree/master/packages/fast-components-react-msft)

#### FAST development site
A development site which can be used to create a React environment for a group of React or web components. [Readme](https://github.com/Microsoft/fast-dna/tree/master/packages/fast-development-site-react)

#### FAST JSS manager
A React higher-order component (HOC) library for managing component JSS stylesheets. [Readme](https://github.com/Microsoft/fast-dna/tree/master/packages/fast-jss-manager-react)

#### FAST React viewer
A self contained React component which shows content in an iframe. This can be used to as a method for previewing a React component(s) or an entire page. [Readme](https://github.com/Microsoft/fast-dna/tree/master/packages/fast-viewer)


### General packages
#### FAST animations
An animation library that simplifies interactions and animations using the Web Animation API. Provides a convenient abstraction layer over the Web Animation API while still allowing full access to it. [Readme](https://github.com/Microsoft/fast-dna/tree/master/packages/fast-animation)

#### FAST browser extensions
An extension for testing real-world localization, theming, and other production type scenarios in web development. Originally devised as a way to visualize prototypes across many different user scenarios. For example, view a website in one of the 194 different localized settings. [Readme](https://github.com/Microsoft/fast-dna/tree/master/packages/fast-browser-extentions)

#### FAST component contracts
This package provides the TypeScript typings for all FAST components class-name contracts. These contracts enable strict typing of JSS stylesheets and each component's expectation of which class-names will be made available (and under which keys those class-names reside) to the component at runtime. [Readme](https://github.com/Microsoft/fast-dna/tree/master/packages/fast-components-class-name-contracts)

#### FAST permutator
Creates all possible data permutations from a given JSON Schema, allowing for deep testing or display of complex data sets. [Readme](https://github.com/Microsoft/fast-dna/tree/master/packages/fast-permutator)

#### FAST tslint rules
Provides [tslint](https://github.com/palantir/tslint) rules for all FAST projects. [Readme](https://github.com/Microsoft/fast-dna/tree/master/packages/fast-tslint-rules)


## Policies
### Guiding principles, contributions, and governance
Details including getting started can be found [here](https://github.com/Microsoft/fast-dna/blob/master/CONTRIBUTING.md).

### Code of conduct
Details are located [here](https://github.com/Microsoft/fast-dna/blob/master/CODE_OF_CONDUCT.md).

### Accessibility
FAST-DNA has partnered with Deque & Microsoft to build accessibility into our components ensuring we are WCAG 2.0 AA compliant. [Readme](https://github.com/Microsoft/fast-dna/wiki/Accessibility)

## Contact
* Submit [for help](https://stackoverflow.com/questions/tagged/fast-dna) 
* Submit [feature requests](https://github.com/Microsoft/fast-dna/issues/new?labels=feature%20:%20request)
* Submit [feature questions](https://github.com/Microsoft/fast-dna/issues/new?labels=feature%20:%20question)