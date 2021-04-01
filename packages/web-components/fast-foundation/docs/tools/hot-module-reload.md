---
id: hot-module-reload
title: Hot Module Reload
sidebar_label: Hot Module Reload
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/docs/tools/hot-module-reload.md
---

Hot Module Replacement (HMR) allows your web components to be updated as you develop, without needing a full refresh of the browser. The [Open Web Components](https://open-wc.org/) project maintains a number of tools and libraries for working with Web Components, including a plugin for enabling HMR with FAST Web Components.

To learn more about HMR for Web Components and to see how to setup HMR in your own FAST projects, [please see the Open Web Components HMR documentation](https://open-wc.org/docs/development/hot-module-replacement/).

:::note
HMR is limited in what it can update for a given component. So, full page refreshes are still needed in certain cases. Changes to constructor logic or adding new `@attr` properties are notable examples of HMR's update limitations. However, template and style changes should be handled automatically without needing a full refresh.
:::