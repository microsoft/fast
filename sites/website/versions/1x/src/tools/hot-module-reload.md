---
id: hot-module-reload
title: Hot Module Reload
eleventyNavigation:
  key: hot-module-reload1x
  parent: tools1x
  title: Hot Module Reload
navigationOptions:
  activeKey: hot-module-reload1x
description: Hot Module Replacement (HMR) allows your web components to be updated as you develop, without needing a full refresh of the browser.
keywords:
  - hot module reload
layout: 1x
---

Hot Module Replacement (HMR) allows your web components to be updated as you develop, without needing a full refresh of the browser. The [Open Web Components](https://open-wc.org/) project maintains a number of tools and libraries for working with Web Components, including a plugin for enabling HMR with FAST Web Components.

To learn more about HMR for Web Components and to see how to setup HMR in your own FAST projects, [please see the Open Web Components HMR documentation](https://open-wc.org/docs/development/hot-module-replacement/).

:::note
HMR is limited in what it can update for a given component. So, full-page refreshes are still needed in certain cases. Changes to constructor logic or adding new `@attr` properties are notable examples of HMR's update limitations. However, template and style changes should be handled automatically without needing a full refresh.
:::