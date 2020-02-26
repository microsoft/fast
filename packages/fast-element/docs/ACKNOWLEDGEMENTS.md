# Acknowledgements

There are many great open source projects that have inspired us and enabled us to build the `fast-element` library. Below are a few that stand out.

* [lit-html](https://lit-html.polymer-project.org/) - One of the first libraries to leverage standard JavaScript tagged template literals for HTML templates. We were inspired by this technique and wanted to explore whether it could be combined with our idea of arrow function expressions.
* [Aurelia 1 and Aurelia 2](https://aurelia.io/) - Various details of Aurelia 2's decorator and metadata model inspired us in the design of `fast-element`. Additionally, Aurelia 1's mechanisms for array observation, binding, and template compilation also guided us in our work.
* [Polymer](https://www.polymer-project.org/) - One of the first libraries (if not the first) to embrace Web Components.
* [Knockout](https://knockoutjs.com/) - One of the first JavaScript libraries (if not the first) to implement an observer system. The original techniques for observables and computed observables have influenced many libraries over the years. Re-interpreting these ideas in terms of modern JavaScript and DOM has helped us to build a powerful and robust system.