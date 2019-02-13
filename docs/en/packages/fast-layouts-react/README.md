---
id: index
title: FAST Layouts React
sidebar_label: Layouts React
---

# Layouts React

A collection of components used to form various layouts built using React.

## App layout components

The following components can be used to create single page application view layouts. These components have been composed using flexbox.

`Container` - The application container which wraps all other app layout components

`Canvas` - The main content area

`Pane` - Additional regions that can be added to the left and/or right of the canvas

`Row` - Used to create sections of pane or canvas content

## Page layout components

The following components can be used to compose a page layout. Each component includes properties which can be custom configured to each use case. These components have been composed using CSS grid.

`Page` - The page layout is designed to create the primary view. It manages page margins and the overall content width.

`Grid` - The grid component defines a region for column components to reside.

`Column` - The column creates regions in a grid and can be configured in many powerful ways to support even the most complex layouts. Certain configuration options can be assigned either a single value, assigned consistently, or an array of values treated as breakpoint specific assignments. The first value applies to the lowest breakpoint and the last value to the highest breakpoint. This feature enables staggering user interface changes for each breakpoint with simple configuration.

### -ms-grid support

CSS Grid does some amazing things automatically. By default, elements inside an element with `display: grid;` will be aware of each-other and not overlap. This makes the grid incredibly simple to set up and means you often don’t need to set column configuration values.

`-ms-grid` works a little differently, and because of this, if you need to support -ms-grid you will need to be more explicit when defining the configuration options for columns. For instance, if you have two 12 column (full width) Columns, you will explicitly need to assign the second column to the second row. If you don’t, `-ms-grid` will draw the two Columns in the same row (and overlapping each-other).

## Utilities

`Breakpoint tracker` - Given a set of breakpoints, this utility will monitor the width of the browser window and notify subscribers via callback if a known breakpoint threshold has been reached.