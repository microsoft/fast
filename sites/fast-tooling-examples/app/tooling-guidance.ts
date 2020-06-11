// Generated file from ./build/convert-readme.js
/* eslint-disable no-irregular-whitespace */
export default `<div class="guidance"><h1 id="fast-tooling">FAST Tooling</h1>
<p>FAST Tooling is a library agnostic specific set of utilities to assist in creating web UI.</p>
<p><img src="https://img.shields.io/badge/ES6-Supported-yellow.svg?style=for-the-badge&amp;logo=JavaScript" alt="JavaScript" />   <img src="https://img.shields.io/badge/TypeScript-Supported-blue.svg?style=for-the-badge" alt="TypeScript" /></p>
<ul>
<li><a href="#installation">Installation</a></li>
<li><a href="#concepts">Concepts</a>
<ul>
<li><a href="#json-schema">JSON Schema</a>
<ul>
<li><a href="#nesting-data">Nesting data</a></li>
</ul>
</li>
</ul>
</li>
<li><a href="#message-system">Message system</a>
<ul>
<li><a href="#sending-and-receiving-messages">Sending and receiving messages</a>
<ul>
<li><a href="#custom-messages">Custom messages</a></li>
</ul>
</li>
</ul>
</li>
<li><a href="#data-utilities">Data utilities</a>
<ul>
<li><a href="#generating-data-from-json-schema">Generating data</a></li>
<li><a href="#mapping-data">Mapping data</a></li>
<li><a href="#mapping-web-component-definitions">Mapping Web Component definitions</a></li>
<li><a href="#validation">Validation</a></li>
</ul>
</li>
</ul>
<h2 id="installation">Installation</h2>
<p><code>npm i --save @microsoft/fast-tooling</code></p>
<h2 id="concepts">Concepts</h2>
<h3 id="json-schema">JSON Schema</h3>
<p><a href="http://json-schema.org/">JSON schema</a> are used by FAST tooling libraries for generating data and creating UI. They have been extended to provide additional hooks for plugin systems in the FAST tooling libraries. When providing a dictionary of JSON schema, use the <code>id</code> as a key, this is required for utilities to quickly access the correct JSON schema.</p>
<h4 id="nesting-data">Nesting data</h4>
<p>To identify nesting structures in the JSON schemas, such as with composable components, use the <code>linkedDataSchema</code> export from the <code>@microsoft/fast-tooling</code> package which defines the interface expected for the link and adds a property key to identify this section of data as linked data.</p>
<p>Example JSON Schema with linked data properties:</p>
<pre><code class="language-ts">import { linkedDataSchema } from &quot;@microsoft/fast-tooling&quot;;

export default {
    $schema: &quot;http://json-schema.org/schema#&quot;,
    title: &quot;Component with nested properties&quot;,
    type: &quot;object&quot;,
    id: &quot;nestable-component&quot;,
    properties: {
        children: {
            ...linkedDataSchema,
            title: &quot;Children&quot;,
            type: &quot;string&quot;
        },
    }
}
</code></pre>
<p>Although JSON schema can be written in JSON, it is recommended creating the schema as a data blob in a JavaScript or TypeScript file so that it can use the provided helper exports.</p>
<h2 id="message-system">Message system</h2>
<p>FAST tooling components rely on including a secondary script which contains a <a href="https://developer.mozilla.org/en-US/docs/Web/API/Worker">web worker</a> called the message system.</p>
<p>This worker performs all of the data manipulation and provides a navigational data structure based on data passed.</p>
<h3 id="sending-and-receiving-messages">Sending and receiving messages</h3>
<p>There is a secondary export, <code>MessageSystem</code>, which must be instantiated with the location on the server of the web worker. The file is located at <code>@microsoft/fast-tooling/message-system.min.js</code>. This is then passed to various components that are part of the tooling package to sync data and navigation.</p>
<p>Example implementation:</p>
<pre><code class="language-js">import { MessageSystem } from &quot;@microsoft/fast-tooling&quot;;

let fastMessageSystem;

// Your JSON schema
const mySchema = {
    id: &quot;my-schema&quot;,
    type: &quot;object&quot;,
    properties: {
        foo: {
            type: &quot;string&quot;
        }
    }
}

if (window.Worker) {

    fastMessageSystem = new MessageSystem({
        // The string location of the file on the server or the Worker instance.
        // If using webpack, include it in the entry section of the config.
        // Alternatively if instantiating the web worker with the webpack worker-loader,
        // simply use the Worker instance that has been imported
        webWorker: &quot;message-system.min.js&quot;,

        // your data dictionary to initialize with (you may only need a single item)
        dataDictionary: [
            {
                dataDictionaryKey1: {
                    schemaId: mySchema.id,
                    data: {
                        foo: &quot;Hello world&quot;
                    },
                },
            },
            &quot;dataDictionaryKey1&quot;,
        ],

        // your dictionary of schemas to validate data in the dictionary
        schemaDictionary: {
            [mySchema.id]: mySchema,
        },
    });
}
</code></pre>
<p>The <code>dataDictionary</code> and the <code>schemaDictionary</code> are not required when creating the instance of the message system but can be provided for a single point of intialization.</p>
<p>If initialization occurs later, the following method can be used:</p>
<pre><code class="language-javascript">fastMessageSystem = new MessageSystem({
    webWorker: &quot;message-system.min.js&quot;,
});

...

fastMessageSystem.initialize({
    dataDictionary: myDataDictionary,
    schemaDictionary: mySchemaDictionary,
});
</code></pre>
<h4 id="initialization-message">Initialization message</h4>
<p>To re-initialize the message system an initialization message can be sent which requires a <code>dataDictionary</code> and <code>schemaDictionary</code> to be provided.</p>
<p>Example:</p>
<pre><code class="language-javascript">import { MessageSystemType } from &quot;@microsoft/fast-tooling&quot;;

...

fastMessageSystem.postMessage({
    type: MessageSystemType.initialize,
    dataDictionary: myDataDictionary,
    schemaDictionary: mySchemaDictionary
});
</code></pre>
<h4 id="custom-messages">Custom messages</h4>
<p>It is possible to send custom messages, all that is required is the data being sent includes the type <code>MessageSystemType.custom</code>.</p>
<p>Example:</p>
<pre><code class="language-javascript">import { MessageSystemType } from &quot;@microsoft/fast-tooling&quot;;

...

fastMessageSystem.postMessage({
    type: MessageSystemType.custom,
    myMessage: &quot;Hello world&quot;
});
</code></pre>
<h2 id="data-utilities">Data utilities</h2>
<p>Data utilities are used for the various data manipulations in the message system, they are also provided as exports.</p>
<h3 id="generating-data-from-json-schema">Generating data from JSON schema</h3>
<p>Data may be generated from a JSON schema using the <code>getDataFromSchema</code> export. This will only generate the required items as dictated by the JSON schema, and will always choose the first potential match in any situation, for example if a property is an enum and is required, it will add the first value in the enum list.</p>
<p>An example of generating data from the <code>@microsoft/fast-tooling</code> package:</p>
<pre><code class="language-javascript">import { getDataFromSchema } from &quot;@microsoft/fast-tooling&quot;;

const data = getDataFromSchema(schema);
</code></pre>
<h3 id="mapping-data">Mapping data</h3>
<p>Data from the dictionary of data can be mapped with a helper <code>mapDataDictionary</code>. This will allow you transform the data dictionary into another type of data structure by writing a helper. For example, if the data dictionary represented React component props, you could write a mapper using the React createElement function and return a functional React component.</p>
<p>The <code>mapDataDictionary</code> export takes an object with the following properties:</p>
<ul>
<li><strong>dataDictionary</strong> - A dictionary of data, this is similar to other data dictionary formats in this library but instead of specifying a root data item, it is the dictionary only.</li>
<li><strong>dataDictionaryKey</strong> - This should be the root data items key.</li>
<li><strong>schemaDictionary</strong> - This should be the dictionary of JSON schemas where each schema is identified in the object by its id which is used as a key.</li>
<li><strong>mapper</strong> - The function provided that maps the data.</li>
</ul>
<p>The mapping function that should be provided as the <strong>mapper</strong> in the <code>mapDataDictionary</code> argument accepts as its argument an object with the following properties:</p>
<ul>
<li><strong>data</strong> - The raw unchanged data.</li>
<li><strong>resolvedData</strong> - Data that has been run through the mapper before.</li>
<li><strong>schema</strong> - The JSON schema that maps to this piece of data, it should validate against the <strong>data</strong> property.</li>
</ul>
<p>Example:</p>
<pre><code class="language-javascript">import { mapDataDictionary } from &quot;@microsoft/fast-tooling&quot;;

const mappingFunction = function(config) {
    return config.resolvedData;
}

const mappedData = mapDataDictionary({
    dataDictionary: {
        &quot;root&quot;: {
            schemaId: &quot;foo&quot;,
            data: {
                greeting: &quot;Hello world&quot;
            }
        }
    },
    dataDictionaryKey: &quot;root&quot;,
    schemaDictionary: {
        foo: {
            id: &quot;foo&quot;,
            type: &quot;object&quot;
        }
    },
    mapper: mappingFunction
});

</code></pre>
<p>The expected result:</p>
<pre><code class="language-javascript">{
    greeting: &quot;Hello world&quot;
}
</code></pre>
<h3 id="mapping-web-component-definitions">Mapping Web Component definitions</h3>
<p>Web components can be described with the TypeScript interface <code>WebComponentDefinition</code> or the JSON schema <code>webComponentSchema</code>, available as named exports from <code>@microsoft/fast-tooling</code>.</p>
<p>Data that maps to these definitions can be passed as an argument to the <code>mapWebComponentDefinitionToJSONSchema</code> utility. This will generate an array of JSON schemas (one for each available tag) that the tooling can use.</p>
<p>Example:</p>
<pre><code class="language-javascript">import { mapWebComponentDefinitionToJSONSchema } from &quot;@microsoft/fast-tooling&quot;;

const myWebComponentJSONSchema = mapWebComponentDefinitionToJSONSchema(myWebComponentDefinition);
</code></pre>
<h3 id="validation">Validation</h3>
<p>Validation is treated as optional by the message system but is available as a utility. This is done in case other validation methods are used as validators are decently sized packages and there may be validation scenarios that are not covered by standard JSON schema validation.</p>
<p>To facilitate ease of use however, the export <code>AjvMapper</code> is provided which utilizes the <code>ajv</code> library.</p>
<p>Example:</p>
<pre><code class="language-javascript">import { AjvMapper, MessageSystem } from &quot;@microsoft/fast-tooling&quot;;

let fastMessageSystem: MessageSystem;
let ajvMapper: AjvMapper;

if ((window as any).Worker) {
    fastMessageSystem = new MessageSystem({
        ...
    });
    ajvMapper = new AjvMapper({
        messageSystem: fastMessageSystem,
    });
}
</code></pre>
<p>If necessary it is possible to make a custom validator. The <code>AjvMapper</code> can be used as a guide for mapping the pathing values and error messages to a format the message system can accept.</p>
</div>`;
