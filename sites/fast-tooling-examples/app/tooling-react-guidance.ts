// Generated file from ./build/convert-readme.js
/* eslint-disable no-irregular-whitespace */
export default `<div class="guidance"><h1 id="fast-tooling-react">FAST Tooling React</h1>
<p>The tooling available in FAST Tooling React can be used together to create UI for manipulating serializable data and viewing React components.</p>
<p><img src="https://img.shields.io/badge/ES6-Supported-yellow.svg?style=for-the-badge&amp;logo=JavaScript" alt="JavaScript" />   <img src="https://img.shields.io/badge/TypeScript-Supported-blue.svg?style=for-the-badge" alt="TypeScript" /></p>
<ul>
<li><a href="#benefits">Benefits</a></li>
<li><a href="#concepts">Concepts</a>
<ul>
<li><a href="#ecosystem">Ecosystem</a></li>
</ul>
</li>
<li><a href="#installation">Installation</a></li>
<li><a href="#requirements">Requirements</a></li>
<li><a href="#form">Form</a>
<ul>
<li><a href="#validation">Validation</a></li>
<li><a href="#drag-and-drop">Drag and drop</a></li>
<li><a href="#using-form-control-plugins">Using form control plugins</a>
<ul>
<li><a href="#list-of-control-types">List of control types</a></li>
</ul>
</li>
<li><a href="#validation">Validation</a></li>
<li><a href="#json-schema-metadata">JSON schema metadata</a>
<ul>
<li><a href="#title">Title</a></li>
<li><a href="#description">Description</a></li>
<li><a href="#disabled">Disabled</a></li>
<li><a href="#examples-&amp;-default">Examples &amp; default</a></li>
<li><a href="#badges">Badges</a></li>
<li><a href="#dictionaries">Dictionaries</a></li>
</ul>
</li>
<li><a href="#json-schema-keywords">JSON schema keywords</a>
<ul>
<li><a href="#oneof-&amp;-anyof">oneOf &amp; anyOf</a></li>
<li><a href="#enums">Enums</a></li>
<li><a href="#allof-&amp;-ref">allOf &amp; $ref</a></li>
</ul>
</li>
</ul>
</li>
<li><a href="#navigation">Navigation</a></li>
<li><a href="#navigation-menu">Navigation Menu</a>
<ul>
<li><a href="#menu-structure">Menu structure</a></li>
<li><a href="#expanding-and-collapsing">Expanding and Collapsing</a></li>
<li><a href="#controlling-the-location">Controlling the location</a></li>
</ul>
</li>
<li><a href="#viewer">Viewer</a>
<ul>
<li><a href="#setting-width-and-height">Setting width and height</a></li>
<li><a href="#sending-custom-messages">Sending custom messages</a></li>
<li><a href="#receiving-custom-messages">Receiving custom messages</a></li>
<li><a href="#select-device">Select device</a>
<ul>
<li><a href="#devices">Devices</a></li>
</ul>
</li>
<li><a href="#rotate">Rotate</a></li>
</ul>
</li>
<li><a href="#data-utilities">Data utilities</a>
<ul>
<li><a href="#transforming-data">Transforming data</a></li>
</ul>
</li>
</ul>
<h2 id="benefits">Benefits</h2>
<p>The FAST Tooling can be used in any combination for the following scenarios:</p>
<ul>
<li>Mapping serializable data to a React component in an application</li>
<li>Editing data using a form generated from a JSON schema</li>
<li>Viewing a React component in an isolated iframe environment</li>
<li>Using a navigation generated from a components data</li>
<li>All of the above to create a live editing UI</li>
</ul>
<h2 id="concepts">Concepts</h2>
<h3 id="ecosystem">Ecosystem</h3>
<p>The following components are intended to work together as an ecosystem of components:</p>
<ul>
<li><code>ModularForm</code> - see <a href="#form">Form</a></li>
<li><code>ModularViewer</code> - see <a href="#viewer">Viewer</a></li>
<li><code>ModularNavigation</code> - see <a href="#navigation">Navigation</a></li>
</ul>
<p>Each of these components is provided as a standalone version and a version intended to work with another of the above components. If the <code>Form</code> is intended to be used with the <code>Viewer</code> then the <code>Modular</code> prefixed versions should be used. This enables them to share certain capabilities such as drag and drop.</p>
<p>Example:</p>
<pre><code class="language-jsx">import { DndProvider } from &quot;react-dnd&quot;;
import HTML5Backend from &quot;react-dnd-html5-backend&quot;;
import { ModularForm, ModularViewer } from &quot;@microsoft/fast-tooling-react&quot;;

// See details on implementation from the standalone
// versions of Form and Viewer
&lt;DndProvider backend={HTML5Backend}&gt;
    &lt;ModularForm {...props} /&gt;
    &lt;ModularViewer {...props} /&gt;
&lt;/DndProvider&gt;
</code></pre>
<h2 id="installation">Installation</h2>
<p><code>npm i --save @microsoft/fast-tooling-react</code></p>
<h2 id="requirements">Requirements</h2>
<p>The <code>@microsoft/fast-tooling-react</code> package will be installed with <code>@microsoft/fast-tooling</code>. The <code>@microsoft/fast-tooling</code> package includes exports required for implementing the React specific components, namely the <code>MessageSystem</code> and the minified webworker which handles data manipulation. Please refer to the documentation for <code>@microsoft/fast-tooling</code> for a better understanding of these systems.</p>
<h2 id="form">Form</h2>
<p>The required property is the <code>messageSystem</code>, see <code>@microsoft/fast-tooling</code> for details on setting this up.</p>
<p>Example:</p>
<pre><code class="language-jsx">import { Form } from &quot;@microsoft/fast-tooling-react&quot;;

/**
 * Add to your render function
 */
&lt;Form
    messageSystem={fastMessageSystem}
/&gt;
</code></pre>
<h3 id="validation">Validation</h3>
<p>Validation is treated as optional, there is a validation utility provided by the <code>@microsoft/fast-tooling</code> package that will give basic JSON schema validation errors. Refer to the <code>@microsoft/fast-tooling</code> README for details.</p>
<h3 id="drag-and-drop">Drag and drop</h3>
<p>Drag and drop is provided to the <code>Form</code> using the <code>react-dnd</code> package as well as the <code>HTML5Backend</code>. If you are using <code>react-dnd</code> somewhere else and need to implement the backend once, use the secondary export <code>ModularForm</code>.</p>
<h3 id="using-form-control-plugins">Using form control plugins</h3>
<p>All necessary form controls are built in by default but can be overriden either through the schema by adding a <code>formControlId</code> property with a string value or a control type defined <a href="#list-of-control-types">below</a>.</p>
<p>To make a custom control, use the secondary export <code>StandardControlPlugin</code> which will take care of all standard form actions such as setting default, resetting data, etc. You will need to provide the necessary functionality to the <code>control</code> as JSX.</p>
<p>When the plugin instance is passed to the <code>&lt;Form /&gt;</code>
either the id or the type is then referenced and will cause the control to render.</p>
<p>A config is passed to the control, the specifications of this can be found <a href="https://github.com/microsoft/fast-dna/blob/master/packages/fast-tooling-react/src/form/templates/template.control.utilities.props.tsx">here</a>. Note that the <code>ControlConfig</code> interface may include extra properties depending on the control type being used.</p>
<p>Example id plugin:</p>
<p>JSON Schema:</p>
<pre><code class="language-json">{
    &quot;type&quot;: &quot;object&quot;,
    &quot;properties&quot;: {
        &quot;foo&quot;: {
            &quot;type&quot;: &quot;string&quot;,
            &quot;formControlId&quot;: &quot;foo&quot;
        }
    }
}
</code></pre>
<p>JSX:</p>
<pre><code class="language-jsx">&lt;Form
    messageSystem={fastMessageSystem}
    controls={[
        new StandardControlPlugin({
            id: &quot;foo&quot;,
            control: (config) =&gt; {
                return (
                    &lt;input
                        value={config.value}
                    /&gt;
                )
            }
        })
    ]}
/&gt;
</code></pre>
<p>Example type plugin:</p>
<pre><code class="language-jsx">&lt;Form
    messageSystem={fastMessageSystem}
    controls={[
        new StandardControlPlugin({
            type: ControlType.textarea,
            control: (config) =&gt; {
                return (
                    &lt;input
                        value={config.value}
                    /&gt;
                )
            }
        })
    ]}
/&gt;

</code></pre>
<h4 id="list-of-control-types">List of control types</h4>
<p>Control types are available as an enum provided as a secondary export <code>ControlType</code> and consist of the following:</p>
<pre><code class="language-js">import { ControlType } from &quot;@microsoft/fast-tooling-react&quot;;

// Available types
ControlType.select
ControlType.array
ControlType.checkbox
ControlType.linkedData
ControlType.numberField
ControlType.sectionLink
ControlType.section
ControlType.display
ControlType.button
ControlType.textarea
</code></pre>
<p>These control types can be paired with our default controls, the following of which are available:</p>
<ul>
<li><code>SelectControl</code></li>
<li><code>ArrayControl</code></li>
<li><code>CheckboxControl</code></li>
<li><code>LinkedDataControl</code></li>
<li><code>NumberFieldControl</code></li>
<li><code>SectionLinkControl</code></li>
<li><code>SectionControl</code></li>
<li><code>DisplayControl</code></li>
<li><code>ButtonControl</code></li>
<li><code>TextareaControl</code></li>
</ul>
<p><strong>Note: If the id and type are not specified, all controls will be replaced with the control.</strong></p>
<p>Example of a replacement type:</p>
<pre><code class="language-jsx">import { ControlType, TextareaControl } from &quot;@microsoft/fast-tooling-react&quot;;

...

&lt;Form
    messageSystem={fastMessageSystem}
    controls={[
        new StandardControlPlugin({
            type: ControlType.textarea,
            control: (config) =&gt; {
                return (
                    &lt;React.Fragment&gt;
                        &lt;span&gt;Hello world!&lt;/span&gt;
                        &lt;TextareaControl {...config} /&gt;
                    &lt;/React.Fragement&gt;
                );
            }
        })
    ]}
/&gt;
</code></pre>
<p>Example of a replacement for all controls, using the component for the default control:</p>
<pre><code class="language-jsx">&lt;Form
    messageSystem={fastMessageSystem}
    controls={[
        new StandardControlPlugin({
            control: (config) =&gt; {
                return (
                    &lt;React.Fragment&gt;
                        &lt;span&gt;Hello world!&lt;/span&gt;
                        &lt;config.component {...config} /&gt;
                    &lt;/React.Fragement&gt;
                );
            }
        })
    ]}
/&gt;
</code></pre>
<h4 id="making-your-own-control-plugin">Making your own control plugin</h4>
<p>The <code>StandardControlPlugin</code> creates a standard template for expected functionality not specific to a control such as a <code>CheckboxControl</code>. This may include showing a button to set the value to the default value, an unset/reset button if the value represented in the control is optional, etc.</p>
<p>It is possible to create your own control plugin template; this section is for more advanced usage and should be done with caution.</p>
<p>To assist in the creation of a custom control plugin template, another secondary export is provided, <code>ControlTemplateUtilities</code>. This is an abstract class that can be extended, it includes all of the render methods for various actions that can be taken that are not control specific. It is possible to use this class to make your own template and include extra logic for when these items should render.</p>
<p>Example:</p>
<pre><code class="language-jsx">import { ControlTemplateUtilities } from &quot;@microsoft/fast-tooling-react&quot;;

export class MyControlTemplate extends ControlTemplateUtilities {
    public render() {
        return (
            &lt;div&gt;
                &lt;label
                    htmlFor={this.props.dataLocation}
                    title={this.props.labelTooltip}
                &gt;
                    {this.props.label}
                &lt;/label&gt;
                {this.renderConstValueIndicator(&quot;const-value-indicator-css-class&quot;)}
                {this.renderDefaultValueIndicator(&quot;default-value-indicator-css-class&quot;)}
                {this.renderBadge(&quot;badge-css-class&quot;)}
                {this.renderControl(this.props.control(this.getConfig()))}
                {this.renderSoftRemove(&quot;soft-remove-css-class&quot;)}
                {this.renderInvalidMessage(&quot;invalid-message-css-class&quot;)}
            &lt;/div&gt;
        );
    }
}

export { StandardControlTemplate };
</code></pre>
<p>The following methods are available:</p>
<ul>
<li><code>renderConstValueIndicator</code> - This will indicate that this value is not the const value and will set the value to the const value if clicked.</li>
<li><code>renderDefaultValueIndicator</code> - This will indicate that this value is not the default value and will set the value to the default if clicked.</li>
<li><code>renderBadge</code> - This renders a badge, as indicated by the <a href="#badges">badge</a> section of this README.</li>
<li><code>renderControl</code> - This renders the control, such as <code>CheckboxControl</code> etc. or whatever control has been specified if the default controls are not being used. This must include an argument to execute the control with the <code>getConfig</code> method as an argument.</li>
<li><code>renderSoftRemove</code> - This allows for the rendering of an unset/reset button if the value of this control is optional.</li>
<li><code>renderInvalidMessage</code> - This method renders the invalid message for this control as specified when validating the data against the JSON schema.</li>
</ul>
<p>Note that with the exception of <code>renderControl</code> method, the others require a string argument, this will be used as a class so that the generated HTML from the render method can be styled. At this point it is up to the implementer to include their own styling for these items.</p>
<p>It is recommended that the implementation also include the use of a label for accessibility.</p>
<h3 id="validation-2">Validation</h3>
<p>Form validation uses the <a href="https://github.com/epoberezkin/ajv">ajv</a> package. The validation can be displayed inline or using the browser default HTML5 validation UI. This can be achieved through the <code>displayValidationBrowserDefault</code> which is <code>true</code> by default and <code>displayValidationInline</code> which will show validation messages below the associated form element.</p>
<h3 id="json-schema-metadata">JSON schema metadata</h3>
<p>The schema form generator can interpret most <a href="http://json-schema.org/">JSON schemas</a>, however there are some things to note when writing JSON schemas that make for a better UI.</p>
<h4 id="title">Title</h4>
<p>Using a title will add a label to the corresponding form element. All properties are required to have a title.</p>
<p>Example:</p>
<pre><code class="language-json">{
    &quot;$schema&quot;: &quot;http://json-schema.org/schema#&quot;,
    &quot;id&quot;: &quot;my-component&quot;,
    &quot;title&quot;: &quot;My component&quot;,
    &quot;type&quot;: &quot;object&quot;,
    &quot;properties&quot;: {
        &quot;text&quot;: {
            &quot;title&quot;: &quot;Text&quot;,
            &quot;type&quot;: &quot;string&quot;,
            &quot;example&quot;: &quot;Hello world&quot;
        },
        &quot;weight&quot;: {
            &quot;title&quot;: &quot;Weight&quot;,
            &quot;type&quot;: &quot;string&quot;,
            &quot;enum&quot;: [
                &quot;heavy&quot;
            ]
        }
    },
    &quot;required&quot;: [
        &quot;text&quot;
    ]
}
</code></pre>
<h4 id="description">Description</h4>
<p>Using a description will add a HTML attribute <code>title</code> to the label, resulting in a browser tooltip. This should be used for supplemental information that may not be apparent in the title.</p>
<p>Example:</p>
<pre><code class="language-json">{
    &quot;$schema&quot;: &quot;http://json-schema.org/schema#&quot;,
    &quot;id&quot;: &quot;my-component&quot;,
    &quot;title&quot;: &quot;My component&quot;,
    &quot;type&quot;: &quot;object&quot;,
    &quot;properties&quot;: {
        &quot;text&quot;: {
            &quot;title&quot;: &quot;Text&quot;,
            &quot;description&quot;: &quot;The text appearing in the body&quot;,
            &quot;type&quot;: &quot;string&quot;,
            &quot;example&quot;: &quot;Hello world&quot;
        },
        &quot;weight&quot;: {
            &quot;title&quot;: &quot;Weight&quot;,
            &quot;description&quot;: &quot;The weight of the text&quot;,
            &quot;type&quot;: &quot;string&quot;,
            &quot;enum&quot;: [
                &quot;heavy&quot;
            ]
        }
    },
    &quot;required&quot;: [
        &quot;text&quot;
    ]
}
</code></pre>
<h4 id="disabled">Disabled</h4>
<p>The disabled flag is optional and the form item representing this section of the schema will be disabled if flag is set to true.</p>
<p>Example:</p>
<pre><code class="language-json">{
    &quot;$schema&quot;: &quot;http://json-schema.org/schema#&quot;,
    &quot;id&quot;: &quot;my-component&quot;,
    &quot;title&quot;: &quot;My component&quot;,
    &quot;type&quot;: &quot;object&quot;,
    &quot;properties&quot;: {
        &quot;text&quot;: {
            &quot;title&quot;: &quot;Text&quot;,
            &quot;type&quot;: &quot;string&quot;,
            &quot;example&quot;: &quot;Hello world&quot;,
            &quot;disabled&quot;: true
        }
    },
    &quot;required&quot;: [
        &quot;text&quot;
    ]
}
</code></pre>
<h4 id="examples-%26-default">Examples &amp; default</h4>
<p>Providing an examples or default value will replace the placeholder ‘example text’ or randomly generated number. It is generally better to add this extra information in case the schema form generator needs to create a new set of data.</p>
<p>Example:</p>
<pre><code class="language-json">{
    &quot;$schema&quot;: &quot;http://json-schema.org/schema#&quot;,
    &quot;id&quot;: &quot;my-component&quot;,
    &quot;title&quot;: &quot;My component&quot;,
    &quot;type&quot;: &quot;object&quot;,
    &quot;properties&quot;: {
        &quot;text&quot;: {
            &quot;title&quot;: &quot;Text&quot;,
            &quot;type&quot;: &quot;string&quot;,
            &quot;examples&quot;: [
                &quot;Hello world&quot;
            ]
        },
        &quot;style&quot;: {
            &quot;title&quot;: &quot;Style&quot;,
            &quot;type&quot;: &quot;object&quot;,
            &quot;properties&quot;: {
                &quot;color&quot;: {
                    &quot;title&quot;: &quot;HEX Color&quot;,
                    &quot;type&quot;: &quot;string&quot;,
                    &quot;examples&quot;: [
                        &quot;#FF0000&quot;
                    ]
                }
            },
            &quot;required&quot;: [
                &quot;color&quot;
            ]
        }
    },
    &quot;required&quot;: [
        &quot;text&quot;
    ]
}
</code></pre>
<p>Because the style is optional, you can toggle to add it. The schema form generator will see that color is a required piece of data and use the example given to fill in.</p>
<h4 id="badges">Badges</h4>
<p>To allow more detail about a field two additional fields can be added to JSON schemas, <code>badge</code> and <code>badgeDescription</code>. The <code>badge</code> can have the values “info”, “warning” and “locked” which will create the related icons. Adding a <code>badgeDescription</code> will add a native tooltip when the badge is hovered.</p>
<p>Example:</p>
<pre><code class="language-json">{
    &quot;type&quot;: &quot;string&quot;,
    &quot;badge&quot;: &quot;warning&quot;,
    &quot;badgeDescription&quot;: &quot;Setting this field will cause adverse effects&quot;
}
</code></pre>
<h4 id="dictionaries">Dictionaries</h4>
<p>The <code>additionalProperties</code> JSON schema keyword can be used to create a dictionary of user-input keys on an object. To give these keys a label add the keyword <code>propertyTitle</code>, this will create a label for the form element for editing the property key.</p>
<p>Example:</p>
<pre><code class="language-json">{
    &quot;type&quot;: &quot;object&quot;,
    &quot;additionalProperties&quot;: {
        &quot;title&quot;: &quot;A dictionary of strings&quot;,
        &quot;propertyTitle&quot;: &quot;A dictionary key&quot;,
        &quot;type&quot;: &quot;string&quot;
    }
}
</code></pre>
<h3 id="json-schema-keywords">JSON schema keywords</h3>
<p>Certain JSON schema keywords are interpreted to provide a better UI.</p>
<h4 id="oneof-%26-anyof">oneOf &amp; anyOf</h4>
<p>The oneOf and anyOf keywords can be used inside a property and at the root level of a schema. This will create a select dropdown so that the user can switch between them. If data has been provided, it will select the first oneOf/anyOf instance it can validate against. The contents of a ‘title’ property will be used for the contents of the dropdown.</p>
<p>Example:</p>
<pre><code class="language-json">{
    &quot;$schema&quot;: &quot;http://json-schema.org/schema#&quot;,
    &quot;id&quot;: &quot;my-component&quot;,
    &quot;title&quot;: &quot;My component&quot;,
    &quot;oneOf&quot;: [
        {
            &quot;title&quot;: &quot;color&quot;,
            &quot;type&quot;: &quot;object&quot;,
            &quot;properties&quot;: {
                &quot;color&quot;: {
                    &quot;title&quot;: &quot;HEX Color&quot;,
                    &quot;type&quot;: &quot;string&quot;,
                    &quot;example&quot;: &quot;#FF0000&quot;
                }
            }
        },
        {
            &quot;title&quot;: &quot;text&quot;,
            &quot;type&quot;: &quot;object&quot;,
            &quot;properties&quot;: {
                &quot;text&quot;: {
                    &quot;title&quot;: &quot;Text&quot;,
                    &quot;type&quot;: &quot;string&quot;,
                    &quot;example&quot;: &quot;Hello world&quot;
                }
            }
        }
    ]
}
</code></pre>
<h4 id="enums">Enums</h4>
<p>Any enums will be converted to a select dropdown.</p>
<pre><code class="language-json">{
    &quot;$schema&quot;: &quot;http://json-schema.org/schema#&quot;,
    &quot;id&quot;: &quot;my-component&quot;,
    &quot;title&quot;: &quot;My component&quot;,
    &quot;type&quot;: &quot;object&quot;,
    &quot;properties&quot;: {
        &quot;color&quot;: {
            &quot;title&quot;: &quot;Color&quot;,
            &quot;type&quot;: &quot;string&quot;,
            &quot;enum&quot; : [
                &quot;red&quot;,
                &quot;green&quot;,
                &quot;blue&quot;,
                &quot;yellow&quot;
            ],
            &quot;default&quot;: &quot;red&quot;
        }
    }
}
</code></pre>
<h4 id="allof-%26-%24ref">allOf &amp; $ref</h4>
<p>The <code>allOf</code> and <code>$ref</code> keywords cannot be interpreted by the schema form generator.</p>
<h2 id="navigation">Navigation</h2>
<p>The required property is the <code>messageSystem</code>, see <code>@microsoft/fast-tooling</code> for details on setting this up.</p>
<p>Example:</p>
<pre><code class="language-jsx">&lt;Navigation
    messageSystem={fastMessageSystem}
/&gt;
</code></pre>
<h2 id="navigation-menu">Navigation Menu</h2>
<p>The <code>NavigationMenu</code> component creates a navigational menu from a provided data structure. This component is meant to serve as location routing in an application.</p>
<h3 id="menu-structure">Menu structure</h3>
<p>Example menu structure:</p>
<pre><code class="language-js">const menu = [
    {
        displayName: &quot;red&quot;,
        location: &quot;/red&quot;
    },
    {
        displayName: &quot;green&quot;,
        items: [
            {
                displayName: &quot;blue&quot;,
                location: &quot;/blue&quot;
            }
        ]
    }
]
</code></pre>
<p>Each menu item requires a <code>displayName</code> to use in the generated UI.</p>
<p>Simple example:</p>
<pre><code class="language-jsx">render() {
    return (
        &lt;NavigationMenu
            menu={menu}
        /&gt;
    );
}
</code></pre>
<h3 id="controlling-the-location">Controlling the location</h3>
<p>A <code>location</code> may optionally be provided in the menu data, if this is not accompanied by a <code>onLocationUpdate</code> callback, the generated UI for that menu item will be an anchor. If an <code>onLocationUpdate</code> callback is provided this results in a span, which when clicked will fire the callback with the associated location.</p>
<p>Example:</p>
<pre><code class="language-jsx">render() {
    return (
        &lt;NavigationMenu
            menu={menu}
            activeLocation={this.state.activeLocation}
            onLocationUpdate={this.handleLocationUpdate}
        /&gt;
    );
}

handleLocationUpdate = (location) =&gt; {
    this.setState({
        activeLocation: location
    });

    // do some route manipulation
}
</code></pre>
<h2 id="viewer">Viewer</h2>
<p>The <code>Viewer</code> component creates an iframe, it can have a fixed or adjustable width and height and can be used independently or as a set with the <code>SelectDevice</code> and <code>Rotate</code> components.</p>
<p>The required property is the <code>messageSystem</code>, see <code>@microsoft/fast-tooling</code> for details on setting this up and the <code>iframeSrc</code>.</p>
<p>Example:</p>
<pre><code class="language-jsx">&lt;Viewer
    messageSystem={fastMessageSystem}
    iframeSrc={&quot;/example-content&quot;}
/&gt;
</code></pre>
<h3 id="setting-width-and-height">Setting width and height</h3>
<p>The <code>width</code> and <code>height</code> can be set on the <code>Viewer</code> component which will be used as pixel values:</p>
<p>Example:</p>
<pre><code class="language-jsx">&lt;Viewer
    messageSystem={fastMessageSystem}
    iframeSrc={&quot;/example-content&quot;}
    width={500}
    height={300}
/&gt;
</code></pre>
<p>To create a responsive width an height, the <code>width</code> and <code>height</code> can be tied to values in state and combined with the <code>onUpdateHeight</code>, <code>onUpdateWidth</code> and <code>responsive</code> props. This creates draggable borders around the iframe.</p>
<p>Example:</p>
<pre><code class="language-jsx">&lt;Viewer
    messageSystem={fastMessageSystem}
    iframeSrc={&quot;/example-content&quot;}
    width={this.state.viewerWidth}
    height={this.state.viewerHeight}
    responsive={true}
    onUpdateHeight={this.handleUpdateViewerHeight}
    onUpdateWidth={this.handleUpdateViewerWidth}
/&gt;

// handlers for the 'onUpdateHeight' and 'onUpdateWidth' callbacks
handleUpdateViewerHeight = (newViewerHeight) =&gt; {
    this.setState({
        viewerHeight: newViewerHeight
    });
}

handleUpdateViewerWidth = (newViewerWidth) =&gt; {
    this.setState({
        viewerWidth: newViewerWidth
    });
}

</code></pre>
<h3 id="sending-custom-messages">Sending custom messages</h3>
<p>Sending custom messages through from the iframe can be done with a <code>postMessage</code> to the iframe window. The custom message should define the <code>type</code> and <code>action</code>. The type should be <code>MessageSystemType.custom</code> imported from the <code>@microsoft/fast-tooling</code> package and the <code>action</code> is defined as the enum value <code>ViewerCustomAction.call</code> provided as an export.</p>
<p>Example:</p>
<pre><code class="language-javascript">import { MessageSystemType } from &quot;@microsoft/fast-tooling&quot;;
import { ViewerCustomAction } from &quot;@microsoft/fast-tooling-react&quot;;

window.postMessage({
    type: MessageSystemType.custom,
    action: ViewerCustomAction.call,
    data: myData
}, &quot;*&quot;);
</code></pre>
<h3 id="receiving-custom-messages">Receiving custom messages</h3>
<p>When a custom message is sent through the message system with a type of <code>ViewerCustomAction.call</code>, it will be passed to all registered callbacks with the message system using a modified <code>action</code> type of <code>ViewerCustomAction.response</code>. This way any further action that needs to be taken with the message data passed from the iframe can be done by looking for the response.</p>
<h3 id="select-device">Select device</h3>
<p>Use the <code>SelectDevice</code> component to select from provided default devices or provide your own custom device configurations. This component accepts a list of configured devices via the <code>devices</code> prop, some default devices are included with the package as a secondary export. It also accepts an <code>activeDeviceId</code> prop which maps to the current device id of the provided devices. In addition there is a callback <code>onUpdateDevice</code> which will fire a provided function with the new device id selected.</p>
<p>Example:</p>
<pre><code class="language-jsx">import {
    defaultDevices,
    SelectDevice,
} from &quot;@microsoft/fast-tooling-react&quot;;

&lt;SelectDevice
    devices={defaultDevices}
    onUpdateDevice={this.handleDeviceUpdate}
    activeDeviceId={this.state.activeDevice.id}
/&gt;
</code></pre>
<h4 id="devices">Devices</h4>
<p>A device can be either “responsive” or “fixed”, if it is responsive it does not take a width and height. The current active device can be used to activate the <code>responsive</code> prop on the <code>Viewer</code> component.</p>
<p>Example of custom devices passed to the <code>devices</code> prop:</p>
<pre><code class="language-json">[
    {
        &quot;id&quot;: &quot;responsive&quot;,
        &quot;displayName&quot;: &quot;Responsive display&quot;,
        &quot;display&quot;: &quot;responsive&quot;
    },
    {
        &quot;id&quot;: &quot;phoneDevice&quot;,
        &quot;displayName&quot;: &quot;Phone device&quot;,
        &quot;display&quot;: &quot;fixed&quot;,
        &quot;height&quot;: 800,
        &quot;width&quot;: 320
    }
]
</code></pre>
<h3 id="rotate">Rotate</h3>
<p>Use the <code>Rotate</code> component to switch between landscape and portrait view. This component accepts an <code>orientation</code> prop which can be either “landscape” or “portrait”. It also accepts an <code>onUpdateOrientation</code> callback which will fire a provided function with the new orientation selected.</p>
<p>Example:</p>
<pre><code class="language-jsx">import {
    Rotate,
} from &quot;@microsoft/fast-tooling-react&quot;;

&lt;Rotate
    orientation={this.state.orientation}
    onUpdateOrientation={this.handleOrientationUpdate}
/&gt;
</code></pre>
<h2 id="data-utilities">Data utilities</h2>
<h3 id="transforming-data">Transforming data</h3>
<p>As data from the dictionary of data is intended to be mapped to JSON schema, it may need to be transformed to be useful as, for instance, a React component.</p>
<p>Assuming that each JSON schema represents React props for a given component, a mapper has been provided which can be used in conjunction with the <code>@microsoft/fast-tooling</code> export <code>mapDataDictionary</code>.</p>
<p>Example:</p>
<pre><code class="language-js">import { mapDataDictionary } from &quot;@microsoft/fast-tooling&quot;;
import { reactMapper } from &quot;@microsoft/fast-tooling-react&quot;;

const componentDictionary = {
    &quot;button-schema-id&quot;: MyButton
}

const myComponentInstance = mapDataDictionary({
    dataDictionary: {
        foo: {
            schemaId: &quot;button-schema-id&quot;,
            data: {
                children: &quot;Hello world&quot;,
            },
        },
    },
    dataDictionaryKey: &quot;foo&quot;,
    mapper: reactMapper(componentDictionary),
    schemaDictionary: {
        &quot;button-schema-id&quot;: {
            id: &quot;button-schema-id&quot;,
            type: &quot;object&quot;,
            properties: {
                children: {
                    type: &quot;string&quot;,
                },
            },
        },
    },
});
</code></pre>
<p>Expected result from the example above is an instance of <code>MyButton</code> with the text “Hello world”. This is a simple mapper that assumes that any linked data is a React component that is nested.</p>
</div>`;
