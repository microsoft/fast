import React from 'react';
import Layout from '@theme/Layout';

export default function () {
  return (
    <Layout title="web components" description="FAST web components">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: '20px',
          padding: '20px 40px',
          alignItems: 'center'
        }}>
          <div
            style={{
              width: '1000px'
            }}
          >
            <h2>Introduction</h2>

            <p>FAST is dedicated to providing support for native Web Components and modern Web Standards, designed to help you efficiently tackle some of the most common challenges in website and application design and development.</p>

            <ul>
              <li>Create reusable UI components with <code>@microsoft/fast-element</code>, all based on W3C Web Component standards.</li>
              <li>Integrate FAST Web Components with any library, framework, or build system. You can adopt incrementally without re-writing your existing systems.</li>
            </ul>

            <p>For an in-depth explanation of FAST <a href="https://www.fast.design/docs/introduction/">see our docs introduction</a></p>

            <hr />

            <h2>Packages</h2>

            <h3><code>@microsoft/fast-element</code></h3>

            <p>The <code>@microsoft/fast-element</code> library is a lightweight means to easily build performant, memory-efficient, standards-compliant Web Components. FAST Elements work in every major browser and can be used in combination with any front-end framework or even without a framework. To get up and running with <code>@microsoft/fast-element</code> see <a href="https://fast.design/docs/fast-element/getting-started">the Getting Started guide</a>.</p>

            <h3><code>@fluentui/web-components</code></h3>

            <p><code>@fluentui/web-components</code> is a library of Web Components based on the Fluent design language.</p>

            <p>The source for <code>@fluentui/web-components</code> is hosted in [the Fluent UI monorepo](https://github.com/microsoft/fluentui/tree/master/packages/web-components).</p>

            <hr />

            <h2>Getting Started</h2>

            <p>We hope you're excited by the possibilities that FAST presents. But, you may be wondering where to start. Here are a few statements that describe various members of our community. We recommend that you pick the statement you most identify with and follow the links where they lead. You can always come back and explore another topic at any time.</p>

            <ul>
              <li>"I just want ready-made components!" - <a href="https://docs.microsoft.com/en-us/fluent-ui/web-components/">Check out the FluentUI Web Components.</a></li>
              <li>"I want to build my own components." - <a href="https://fast.design/docs/fast-element/getting-started">Jump to the fast-element docs.</a></li>
              <li>"I need to integrate FAST with another framework or build system." - <a href="https://fast.design/docs/integrations/introduction">Jump to the integration docs.</a></li>
              <li>"I want to look at a quick reference." - <a href="https://fast.design/docs/resources/cheat-sheet">Jump to the Cheat Sheet</a></li>
            </ul>

            <hr />

            <h2>Joining the Community</h2>

            <p>Looking to get answers to questions or engage with us in realtime? Our community is most active <a href="https://discord.gg/FcSNfg4">on Discord</a>. Submit requests and issues on <a href="https://github.com/Microsoft/fast/issues/new/choose">GitHub</a>, or join us by contributing on <a href="https://github.com/Microsoft/fast/labels/community:good-first-issue">some good first issues via GitHub</a>.</p>

            <p>Get started here with the <a href="https://www.fast.design/docs/community/contributor-guide">Contributor Guide</a>.</p>

            <p>We look forward to building an amazing open source community with you!</p>

            <h2>Contact</h2>

            <ul>
              <li>Join the community and chat with us in real-time on <a href="https://discord.gg/FcSNfg4">Discord</a>.</li>
              <li>Submit requests and issues on <a href="https://github.com/Microsoft/fast/issues/new/choose">GitHub</a>.</li>
              <li>Contribute by helping out on some of our recommended first issues on <a href="https://github.com/Microsoft/fast/labels/community:good-first-issue">GitHub</a>.</li>
            </ul>
          </div>
      </div>
    </Layout>
  );
}
