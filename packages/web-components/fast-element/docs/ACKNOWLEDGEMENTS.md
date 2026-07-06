# Acknowledgements

There are many great open source projects that have inspired us and enabled us to build FAST. Below are a few that stand out.

* [.NET](https://dotnet.microsoft.com/) - Many thanks to the .NET team for sharing their policies and practices upon which our issue management and release planning docs and practices were based.
* [asap](https://github.com/kriskowal/asap) - An awesome, time-tested async task queue implementation that heavily inspired our DOM update system.
* [Aurelia 1 and Aurelia 2](https://aurelia.io/) - Various details of Aurelia 2's decorator and metadata model inspired us in the design of `fast-element`. Additionally, Aurelia 1's mechanisms for array observation, binding, and template compilation also guided us in our work.
* [faastjs](https://github.com/faastjs) - A project with a similar name but a very different purpose. Their API documentation approach leveraging [api-extractor](https://api-extractor.com/) was a huge help to us.
* [Knockout](https://knockoutjs.com/) - One of the first JavaScript libraries (if not the first) to implement an observer system. The original techniques for observables and computed observables have influenced many libraries over the years. Re-interpreting these ideas in terms of modern JavaScript and DOM has helped us to build a powerful and robust system.
* [lit-html](https://lit-html.polymer-project.org/) - One of the first libraries to leverage standard JavaScript tagged template literals for HTML templates. We were inspired by this technique and wanted to explore whether it could be combined with our idea of arrow function binding expressions.
* [Polymer](https://www.polymer-project.org/) - One of the first libraries (if not the first) to embrace Web Components.
* [Vue](https://vuejs.org/) - We liked the terseness of the `:` and `@` syntax in templates, so we adapted it along with some modifications in our templates.
