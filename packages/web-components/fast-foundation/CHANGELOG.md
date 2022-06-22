# Change Log - @microsoft/fast-foundation

This log was last generated on Wed, 22 Jun 2022 20:17:50 GMT and should not be manually modified.

<!-- Start content -->

## 3.0.0-alpha.4

Wed, 22 Jun 2022 20:17:50 GMT

### Changes

- handle change for source.max set to sliderMaxPosition (email not defined)
- fast-foundation checkbox - turn off indeterminate on user `checked` change (yinon@hotmail.com)
- prevent keyboard events with space when checkbox is readonly (chhol@microsoft.com)
- feat: horizontal-scroll scroll item into view (robarb@microsoft.com)

## 3.0.0-alpha.3

Wed, 15 Jun 2022 17:41:10 GMT

### Changes

- chore: fix package.json type fields (roeisenb@microsoft.com)
- only rollup foundation after compiling with tsc (863023+radium-v@users.noreply.github.com)
- Compare radio value property instead of attribute when value changes (sknoslo@gmail.com)
- feat: simplify execution context to align closer with v1 (roeisenb@microsoft.com)
- feat: implement W3C WC community context protocol and integrate with DI (roeisenb@microsoft.com)

## 3.0.0-alpha.2

Wed, 01 Jun 2022 22:21:24 GMT

### Changes

- Force version update (nicholasrice@users.noreply.github.com)

## 3.0.0-alpha.1

Wed, 01 Jun 2022 17:53:14 GMT

### Changes

- fix: update foundation and components template types (roeisenb@microsoft.com)
- chore: update imports to match latest fast-element exports (roeisenb@microsoft.com)
- fix incorrect and unsemantic slot names for search (chhol@microsoft.com)
- fix: update to latest fast-element and change exports (roeisenb@microsoft.com)
- update the default value of dialog's modal attribute to false (chhol@microsoft.com)
- remove unnecessary DOM nodes from start/end slot templates (chhol@microsoft.com)
- Updated to use the new FAST element 2.0 APIs for creating behaviors and creating element styles (7559015+janechu@users.noreply.github.com)
- feat: officially expose testing helpers (roeisenb@microsoft.com)
- chore: configure fast-foundation for internals stripping (roeisenb@microsoft.com)
- change activeindicator attribute in tabs to hide-active-indicator to better support boolean attribute behavior (chhol@microsoft.com)
- remove class and part names from slots in fast foundation templates (chhol@microsoft.com)
- Deprecates style utilities and hard-codes focus-visible value (nicholasrice@users.noreply.github.com)
- update attribute and observable change handlers with internal logic to be protected instead of private (chhol@microsoft.com)
- fix: update foundation to new CSSDirective API (roeisenb@microsoft.com)
- fix: update foundation to new APIs (roeisenb@microsoft.com)
- fix: update fast-foundation to not use deprecated APIs (roeisenb@microsoft.com)
- remove deprecated item slot name on accordion as it is the default slot (chhol@microsoft.com)
- Set prerelease version (nicholasrice@users.noreply.github.com)
- fix: update templates to use classList and fix classList bug (roeisenb@microsoft.com)
- chore: fast-foundation package and build modernization (roeisenb@microsoft.com)
- change trapFocus on dialog to noFocusTrap to better support boolean attributes (chhol@microsoft.com)
- rename title attribute on disclosure to summary (chhol@microsoft.com)

## 2.46.9

Sun, 29 May 2022 07:08:52 GMT

### Patches

- fix: fast-foundation - 'get' and 'set' accessor must have the same type (#5964) (aagharat@dstworldwideservices.com)

## 2.46.8

Thu, 26 May 2022 07:11:44 GMT

### Patches

- Revert "fix: add missing required attribute binding to switch template (#6014)" (burtonsmith@microsoft.com)

## 2.46.7

Wed, 25 May 2022 07:09:21 GMT

### Patches

- add missing binding for required attribute in the switch template (chhol@microsoft.com)

## 2.46.6

Tue, 24 May 2022 07:10:02 GMT

### Patches

- Bump @microsoft/fast-element to v1.10.2 (roeisenb@microsoft.com)

## 2.46.5

Sun, 22 May 2022 07:09:02 GMT

### Patches

- disable keyboard controls for readonly sliders (burtonsmith@microsoft.com)

## 2.46.4

Thu, 19 May 2022 07:09:40 GMT

### Patches

- Handle disabled and hidden items in toolbar (20542556+mollykreis@users.noreply.github.com)

## 2.46.3

Tue, 10 May 2022 07:11:04 GMT

### Patches

- select ignores l&r arrow keys (scomea@microsoft.com)

## 2.46.2

Thu, 05 May 2022 07:11:41 GMT

### Patches

- fix positioning of select dropdown (abris96@gmail.com)
- reset selection range when selecting option with cursor (abris96@gmail.com)

## 2.46.1

Wed, 04 May 2022 07:14:00 GMT

### Patches

- convert enums to const objects and add supported typings (chhol@microsoft.com)

## 2.46.0

Tue, 03 May 2022 07:15:44 GMT

### Minor changes

- add slots and events documentation (scomea@microsoft.com)

### Patches

- reflect option value changes in select (john.kreitlow@microsoft.com)
- fix: selectedIndex property ignores disabled options in listbox and select (john.kreitlow@microsoft.com)
- viewport lock + fill behavior (scomea@microsoft.com)
- Upgraded api-extractor (44823142+williamw2@users.noreply.github.com)
- Bump @microsoft/fast-element to v1.10.1 (44823142+williamw2@users.noreply.github.com)

## 2.45.0

Sun, 01 May 2022 07:12:05 GMT

### Minor changes

- add select method to number field, text field, and text area components (chhol@microsoft.com)

### Patches

- ensure that tabs and tabpanels without ids stay in sync (chhol@microsoft.com)
- trim extra spaces from the text property for listbox-option (john.kreitlow@microsoft.com)
- fix keyboarding behavior for right and left arrow keys in Tree View (chhol@microsoft.com)

## 2.44.0

Thu, 28 Apr 2022 07:12:47 GMT

### Minor changes

- update displayed selected value in select component when an option changes (john.kreitlow@microsoft.com)

## 2.43.0

Wed, 27 Apr 2022 07:21:09 GMT

### Minor changes

- update to typescript 4.6.2 and update ARIAMixin typings (chhol@microsoft.com)

### Patches

- Bump @microsoft/fast-web-utilities to v5.4.0 (chhol@microsoft.com)
- Bump @microsoft/fast-element to v1.10.0 (chhol@microsoft.com)

## 2.42.2

Thu, 21 Apr 2022 07:13:54 GMT

### Patches

- Added support for styling slider value on the track (47367562+bheston@users.noreply.github.com)

## 2.42.1

Sun, 17 Apr 2022 07:11:18 GMT

### Patches

- fix: scrolling back from end and forward retains next flipper in horizontal-scroll (robarb@microsoft.com)
- Ensured that tabs without an ID use a unique ID to prevent duplicate IDs when multiple tabs are on a page (chhol@microsoft.com)
- Ensure the skeleton component's object element is not included in the accessibility tree (chhol@microsoft.com)

## 2.42.0

Thu, 14 Apr 2022 07:12:36 GMT

### Minor changes

- Implements `<dialog>` element events on FastDialog (web@bennypowers.com)
- add multiselect mode to select (john.kreitlow@microsoft.com)

## 2.41.1

Thu, 07 Apr 2022 07:12:06 GMT

### Patches

- Improved README markdown formatting (44823142+williamw2@users.noreply.github.com)

## 2.41.0

Wed, 06 Apr 2022 07:12:42 GMT

### Minor changes

- convert fast-foundation to type:module (nicholasrice@users.noreply.github.com)

### Patches

- Added CEM Analyzer and API markdown to readme files (44823142+williamw2@users.noreply.github.com)
- Bump @microsoft/fast-element to v1.9.0 (nicholasrice@users.noreply.github.com)

## 2.40.0

Sun, 03 Apr 2022 07:12:01 GMT

### Minor changes

- update aria-current for breadcrumb items when new nodes are appended (chhol@microsoft.com)
- remove fromView from aria mixin attributes (chhol@microsoft.com)

### Patches

- Bump @microsoft/fast-web-utilities to v5.2.0 (nicholasrice@users.noreply.github.com)

## 2.39.0

Thu, 31 Mar 2022 07:13:31 GMT

### Minor changes

- remove duplicate use of heading class in accordion item and update part location (chhol@microsoft.com)

### Patches

- fix hidden menu items should not be included in the tabindex (chhol@microsoft.com)

## 2.38.0

Sun, 27 Mar 2022 07:11:50 GMT

### Minor changes

- Changed Select open attribute to public (44823142+williamw2@users.noreply.github.com)
- Add string literal union types to all foundation components that use an enum for attribute options (hawkticehurst@gmail.com)

## 2.37.2

Thu, 24 Mar 2022 07:12:08 GMT

### Patches

- Detect changes to start and end slots in toolbar (20542556+mollykreis@users.noreply.github.com)

## 2.37.1

Sun, 20 Mar 2022 07:15:44 GMT

### Patches

- Fix for default selection behavior for listbox and select (26874831+atmgrifter00@users.noreply.github.com)

## 2.37.0

Wed, 16 Mar 2022 07:12:41 GMT

### Minor changes

- enable no tabbing (scomea@microsoft.com)

## 2.36.1

Tue, 15 Mar 2022 07:12:38 GMT

### Patches

- anchored region not beta (scomea@microsoft.com)
- tree view single select (scomea@microsoft.com)

## 2.36.0

Fri, 11 Mar 2022 23:46:34 GMT

### Minor changes

- BREAKING CHANGE: replace WC button with stock HTML button (jes@microsoft.com)
- implement attribute reflection directive (nicholasrice@users.noreply.github.com)

### Patches

- use WeakMap to prevent leaking element references from FormAssociated (nicholasrice@users.noreply.github.com)

## 2.35.2

Wed, 09 Mar 2022 07:12:32 GMT

### Patches

- Fix bug with menu-item indention (20542556+mollykreis@users.noreply.github.com)

## 2.35.1

Tue, 08 Mar 2022 07:12:45 GMT

### Patches

- Fix programmatic disable/enable of tabs (5454342+brianehenry@users.noreply.github.com)

## 2.35.0

Sun, 06 Mar 2022 07:13:48 GMT

### Minor changes

- add corner positions to tooltip (sethdonohue@Admins-MBP.guest.corp.microsoft.com)

### Patches

- passive handlers (scomea@microsoft.com)
- tooltip hover (scomea@microsoft.com)

## 2.34.0

Wed, 02 Mar 2022 07:12:58 GMT

### Minor changes

- add mermaid support (steph@huynhicode.dev)

### Patches

- generate grid columns for manual grid (scomea@microsoft.com)
- auto columns fix (scomea@microsoft.com)
- Fixing no previous scroll when only 2 items (robarb@microsoft.com)

## 2.33.6

Fri, 25 Feb 2022 17:09:32 GMT

### Patches

- Bump @microsoft/fast-element to v1.7.2 (roeisenb@microsoft.com)

## 2.33.5

Thu, 24 Feb 2022 22:21:55 GMT

### Patches

- Format improvement to match standards (16669785+awentzel@users.noreply.github.com)
- fix combobox and select position when set after init (corylaviska@microsoft.com)
- allow programmatic control of the open property for select and combobox (john.kreitlow@microsoft.com)

## 2.33.4

Sun, 20 Feb 2022 07:16:20 GMT

### Patches

- tree view events (scomea@microsoft.com)

## 2.33.3

Tue, 15 Feb 2022 07:11:28 GMT

### Patches

- disable noImplicitAny in fast-foundation (mathieu.lavoie@shopify.com)

## 2.33.2

Thu, 10 Feb 2022 07:12:01 GMT

### Patches

- Fix initial select value when set early after connect (5454342+brianehenry@users.noreply.github.com)

## 2.33.1

Wed, 09 Feb 2022 07:14:00 GMT

### Patches

- allow empty string values for listbox-option value attribute (john.kreitlow@microsoft.com)

## 2.33.0

Sun, 06 Feb 2022 07:15:20 GMT

### Minor changes

- add menu positioning to picker (scomea@microsoft.com)
- add multiselect functionality to listbox (john.kreitlow@microsoft.com)

### Patches

- ensure menu items update (scomea@microsoft.com)
- fix: diabled listbox missing styles & allows click (jes@microsoft.com)
- fix: allow slider to show small increment changes (jes@microsoft.com)
- fix: flippersHiddenFromAT shouldn't map to aria-hidden (robarb@microsoft.com)
- tooltip anchor attribute updates work (scomea@microsoft.com)

## 2.32.3

Wed, 02 Feb 2022 07:13:39 GMT

### Patches

- fix: February tests are failing in calendar tests (robarb@microsoft.com)
- fix broken links and formatting (john.kreitlow@microsoft.com)

## 2.32.2

Sun, 30 Jan 2022 07:12:35 GMT

### Patches

- convert functions to templates (mathieulavoie94@gmail.com)

## 2.32.1

Tue, 25 Jan 2022 07:11:53 GMT

### Patches

- Bump @microsoft/fast-web-utilities to v5.1.0 (john.kreitlow@microsoft.com)

## 2.32.0

Sun, 23 Jan 2022 07:13:56 GMT

### Minor changes

- feat: add `orientation` to divider (jes@microsoft.com)

### Patches

- use default slot in accordion (mathieulavoie94@gmail.com)
- Bump @microsoft/fast-element to v1.7.0 (scomea@microsoft.com)

## 2.31.0

Thu, 20 Jan 2022 07:12:04 GMT

### Minor changes

- add checked property to listbox-option (john.kreitlow@microsoft.com)

## 2.30.0

Sun, 16 Jan 2022 07:11:36 GMT

### Minor changes

- Add valueAsNumber to number field and slider (5454342+brianehenry@users.noreply.github.com)

## 2.29.0

Sun, 09 Jan 2022 07:11:51 GMT

### Minor changes

- fix accessibility for listbox, select, and combobox (john.kreitlow@microsoft.com)

## 2.28.0

Thu, 06 Jan 2022 07:11:52 GMT

### Minor changes

- fix: prevent events to propagate from disabled button (#4884) (email not defined)

### Patches

- tooltip uses "center" (scomea@microsoft.com)

## 2.27.3

Sun, 19 Dec 2021 07:12:39 GMT

### Patches

- Replace equality check with NaN with the Number.isNan function (anthonystewart@google.com)
- add queueUpdate for setStops in horzontal scroll (sethdonohue@Admins-MBP.guest.corp.microsoft.com)

## 2.27.2

Wed, 15 Dec 2021 07:14:44 GMT

### Patches

- focus on combobox control when clicking an associated label (john.kreitlow@microsoft.com)

## 2.27.1

Thu, 02 Dec 2021 07:11:13 GMT

### Patches

- fix: disabled tree items fire (jes@microsoft.com)

## 2.27.0

Tue, 23 Nov 2021 07:12:23 GMT

### Minor changes

- add `size` attribute to listbox element (john.kreitlow@microsoft.com)

## 2.26.2

Thu, 11 Nov 2021 07:15:33 GMT

### Patches

- convert tsdoc-config dependency to dev-dependency (nicholasrice@users.noreply.github.com)

## 2.26.1

Wed, 10 Nov 2021 07:12:54 GMT

### Patches

- Enabling setting number-field value through script (robarb@microsoft.com)

## 2.26.0

Tue, 09 Nov 2021 07:14:09 GMT

### Minor changes

- feat: add search web component (jes@microsoft.com)

## 2.25.1

Thu, 04 Nov 2021 07:11:59 GMT

### Patches

- fix: change event emitted twice (jes@microsoft.com)

## 2.25.0

Wed, 03 Nov 2021 07:12:39 GMT

### Minor changes

- add placeholder attr to picker (scomea@microsoft.com)

## 2.24.0

Sun, 31 Oct 2021 07:17:45 GMT

### Minor changes

- Added the CheckableFormAssociated mixin to better support the addition of current-checked property/attribute that allows for setting checked state via the .setAttribute() API. This change also converts two lifecycle hooks to methods from properties so that they can be handled correctly by the browser. (nicholasrice@users.noreply.github.com)

### Patches

- fix: number-field increment decrement logic (robarb@microsoft.com)
- picker focus on input after selection (scomea@microsoft.com)
- update fast eslint package version (chhol@microsoft.com)
- Bump @microsoft/fast-element to v1.6.2 (chhol@microsoft.com)
- Bump @microsoft/fast-web-utilities to v5.0.2 (chhol@microsoft.com)

## 2.23.2

Thu, 28 Oct 2021 07:15:32 GMT

### Patches

- fixes emission of CSS custom properties in FireFox and Safari (nicholasrice@users.noreply.github.com)

## 2.23.1

Wed, 27 Oct 2021 07:11:58 GMT

### Patches

- switch should check when using both enter and space (chhol@microsoft.com)

## 2.23.0

Fri, 22 Oct 2021 17:40:52 GMT

### Minor changes

- adds a currentValue property to form-associated to facilitate attribute-based data binding for form values (chhol@microsoft.com)

### Patches

- picker clear query on selection (scomea@microsoft.com)
- Improving number field interactions and tests (robarb@microsoft.com)

## 2.22.1

Thu, 21 Oct 2021 07:11:42 GMT

### Patches

- fix broken tooltip (scomea@microsoft.com)

## 2.22.0

Wed, 20 Oct 2021 07:13:46 GMT

### Minor changes

- add centered positioning option to anchored region (scomea@microsoft.com)

## 2.21.0

Fri, 15 Oct 2021 23:24:14 GMT

### Minor changes

- Implement DesignToken root-element registration for CSS custom property emission of default token values (nicholasrice@users.noreply.github.com)

### Patches

- implement level-2 DOM support for DesignToken in browsers that don't support Constructable StyleSheets (nicholasrice@users.noreply.github.com)

## 2.20.0

Wed, 13 Oct 2021 22:45:16 GMT

### Minor changes

- Adding fast-calendar component (robarb@microsoft.com)

### Patches

- move style assignment for combobox and select into the class and off the DOM node (chhol@microsoft.com)
- Code fixes for calendar (robarb@microsoft.com)
- Bump @microsoft/fast-element to v1.6.1 (markwhitfeld@users.noreply.github.com)

## 2.19.0

Wed, 13 Oct 2021 01:53:37 GMT

### Minor changes

- data-grid: add support for rowheader role (scomea@microsoft.com)
- Add focus event handler to tooltip (v-dlesac@microsoft.com)

### Patches

- refactor: remove lodash-es as a dependency (connor@peet.io)
- use css transforms and transitions in horizontal scroll (john.kreitlow@microsoft.com)
- Bump @microsoft/fast-web-utilities to v5.0.1 (john.kreitlow@microsoft.com)

## 2.18.0

Tue, 12 Oct 2021 07:15:14 GMT

### Minor changes

- fix(di): context confused for key with some registrations (roeisenb@microsoft.com)

### Patches

- Update design-token default value emission to emit to a stylesheet instead of inline styles on the document body (nicholasrice@users.noreply.github.com)
- add aria-disabled to accordion-item for single-mode (khamu@microsoft.com)

## 2.17.3

Sun, 10 Oct 2021 07:12:26 GMT

### Patches

- fix linting errors in horizontal-scroll tests (john.kreitlow@microsoft.com)

## 2.17.2

Fri, 08 Oct 2021 19:53:11 GMT

### Patches

- anchored region force update (scomea@microsoft.com)

## 2.17.1

Wed, 06 Oct 2021 07:11:47 GMT

### Patches

- picker menu shows with only custom options (scomea@microsoft.com)

## 2.17.0

Tue, 05 Oct 2021 00:45:07 GMT

### Minor changes

- feat: add scroll events to horizontal-scroll component (robarb@microsoft.com)

### Patches

- fix: nested tree items not selecting (jes@microsoft.com)

## 2.16.5

Thu, 30 Sep 2021 07:13:45 GMT

### Patches

- Disabling scroll easing for speed=0 (robarb@microsoft.com)

## 2.16.4

Wed, 29 Sep 2021 07:13:40 GMT

### Patches

- do not prevent default on tree item click (chhol@microsoft.com)
- fix: allowing decimal values in fast number field (robarb@microsoft.com)
- fix: sliders mouseup is not firing when leaving the window (robarb@microsoft.com)

## 2.16.3

Tue, 28 Sep 2021 07:10:49 GMT

### Patches

- made orientation changed update child tab styles (marjon@microsoft.com)
- Fix: active indicator keyboarding issue in tabs (jes@microsoft.com)

## 2.16.2

Mon, 27 Sep 2021 07:12:15 GMT

### Patches

- fix: ensure tree item selection is only managed in tree view (jes@microsoft.com)

## 2.16.1

Thu, 23 Sep 2021 07:14:34 GMT

### Patches

- Removing design-system-provider from storybook (robarb@microsoft.com)
- Horizontal-scroll tests cleanup (robarb@microsoft.com)

## 2.16.0

Wed, 22 Sep 2021 07:13:13 GMT

### Minor changes

- feat(di): add registerWithContext and use in design system (roeisenb@microsoft.com)

### Patches

- fix: active indicator does not update when activeid attr is changed (jes@microsoft.com)
- fix aria-describedby typos (v-dlesac@microsoft.com)

## 2.15.0

Sun, 19 Sep 2021 07:17:17 GMT

### Minor changes

- add picker component (scomea@microsoft.com)

### Patches

- fix: remove dependency on document for root containers & design systems (roeisenb@microsoft.com)
- Bump @microsoft/fast-web-utilities to v5.0.0 (scomea@microsoft.com)

## 2.14.0

Wed, 15 Sep 2021 19:49:35 GMT

### Minor changes

- fix type issue for FoundationElementTemplate (john.kreitlow@microsoft.com)

### Patches

- Fix design-token subscription bugs where subscribers were not getting notified (nicholasrice@users.noreply.github.com)

## 2.13.1

Tue, 14 Sep 2021 07:16:47 GMT

### Patches

- Using a manual focus to workaround delegatesFocus issues on Firefox for the button and anchor components (jumarroq@microsoft.com)

## 2.13.0

Sun, 12 Sep 2021 07:17:43 GMT

### Minor changes

- use class method for radio click handler property (john.kreitlow@microsoft.com)

### Patches

- remove dependencies on keycode (scomea@microsoft.com)
- Bump @microsoft/fast-web-utilities to v4.8.1 (scomea@microsoft.com)

## 2.12.0

Thu, 09 Sep 2021 07:21:36 GMT

### Minor changes

- add start/end slot definitions to support default slotted content (chhol@microsoft.com)

### Patches

- fix(design-system): make FoundationElement.compose safe to use directly (roeisenb@microsoft.com)

## 2.11.0

Wed, 08 Sep 2021 07:16:17 GMT

### Minor changes

- fix: allow for base class (mathieu.lavoie@logmein.com)

### Patches

- force non-volatile binding and update docs to explain that DesignToken does not support volatile bindings (nicholasrice@users.noreply.github.com)
- Bump @microsoft/fast-element to v1.5.1 (roeisenb@microsoft.com)

## 2.10.0

Thu, 02 Sep 2021 17:17:56 GMT

### Minor changes

- feat(design-system): enable complete ignore of duplicate elements (roeisenb@microsoft.com)

## 2.9.1

Thu, 02 Sep 2021 07:15:21 GMT

### Patches

- configure system to use a single CSSStyleSheet for custom property setting (nicholasrice@users.noreply.github.com)
- progress component bar width (scomea@microsoft.com)
- Removed remaining 'use-defaults' which no longer exists (47367562+bheston@users.noreply.github.com)

## 2.9.0

Wed, 01 Sep 2021 07:18:34 GMT

### Minor changes

- add viewport lock to tooltip (scomea@microsoft.com)

### Patches

- don't block all keys while focused (corylaviska@microsoft.com)

## 2.8.1

Mon, 30 Aug 2021 22:30:39 GMT

### Patches

- fixing issue where a token would subscribe to itself, causing max-callstack-exceded in certain scenarios (nicholasrice@users.noreply.github.com)

## 2.8.0

Fri, 27 Aug 2021 14:14:26 GMT

### Minor changes

- Refactor DesignToken implementation to support deep token dependency hierarchies (nicholasrice@users.noreply.github.com)

### Patches

- add up/down key support to number-field (corylaviska@microsoft.com)
- Bump @microsoft/fast-element to v1.5.0 (nicholasrice@users.noreply.github.com)

## 2.7.1

Thu, 26 Aug 2021 07:17:43 GMT

### Patches

- fix slider dragging when page is scrolled (corylaviska@microsoft.com)

## 2.7.0

Wed, 25 Aug 2021 07:17:07 GMT

### Minor changes

- allow context for partials on component compositions (john.kreitlow@microsoft.com)

## 2.6.5

Thu, 19 Aug 2021 07:15:21 GMT

### Patches

- add reducefocusableElements and all slotted items to keyboard interaction (sethdonohue@Admins-MBP.guest.corp.microsoft.com)

## 2.6.4

Thu, 12 Aug 2021 07:16:50 GMT

### Patches

- fix dialog focus on open (scomea@microsoft.com)

## 2.6.3

Wed, 04 Aug 2021 07:15:14 GMT

### Patches

- menu should check for slot before automatically assigning a value (chhol@microsoft.com)

## 2.6.2

Thu, 29 Jul 2021 07:18:18 GMT

### Patches

- remove unnecessary aria-hidden attributes (47367562+bheston@users.noreply.github.com)

## 2.6.1

Wed, 28 Jul 2021 07:17:22 GMT

### Patches

- update on !regionVisible (scomea@microsoft.com)

## 2.6.0

Sun, 25 Jul 2021 07:17:41 GMT

### Minor changes

- add auto position tracking to tooltip (scomea@microsoft.com)
- anchored region uses transform (scomea@microsoft.com)

## 2.5.2

Thu, 22 Jul 2021 07:19:53 GMT

### Patches

- Fixed attr boolean mode on menu item (47367562+bheston@users.noreply.github.com)

## 2.5.1

Wed, 21 Jul 2021 07:14:48 GMT

### Patches

- Hide step-up and step-down for number-field when readonly (robarb@microsoft.com)

## 2.5.0

Thu, 15 Jul 2021 01:41:48 GMT

### Minor changes

- extend design token type signature (chhol@microsoft.com)

## 2.4.0

Tue, 13 Jul 2021 07:14:52 GMT

### Minor changes

- docs(di): make API public, stabilize, and add docs (roeisenb@microsoft.com)

## 2.3.0

Wed, 07 Jul 2021 07:19:51 GMT

### Minor changes

- focus trap improvement (scomea@microsoft.com)

## 2.2.0

Sun, 04 Jul 2021 07:15:28 GMT

### Minor changes

- select should emit an input event before the change event (john.kreitlow@microsoft.com)

## 2.1.0

Thu, 01 Jul 2021 07:15:57 GMT

### Minor changes

- ensure DesignToken considers shadow DOM when determining DOM hierarchy (nicholasrice@users.noreply.github.com)

### Patches

- Fixes bug in DesignToken where aliased tokens didn't update CSS custom properties. (nicholasrice@users.noreply.github.com)

## 2.0.0

Fri, 25 Jun 2021 02:02:57 GMT

### Major changes

- remove deprecated APIs and Design System Provider infrastructure (nicholasrice@users.noreply.github.com)
- feat(design-system): better integrate with DI and enforce constraints (roeisenb@microsoft.com)
- migrate directional-stylesheet utility (nicholasrice@users.noreply.github.com)
- update components to extend FoundationElement (chhol@microsoft.com)
- feat: styling and text alignment for menu (jes@microsoft.com)
- add API support for setting default slotted content as part of component composition (chhol@microsoft.com)
- update card to extend foundation (chhol@microsoft.com)
- feat: encapsulate and optimize ComponentPresentation resolution (roeisenb@microsoft.com)

### Minor changes

- fix(foundation-element): enable subclassing with customElement decorator (roeisenb@microsoft.com)
- feat(design-system): enable overriding the shadow root mode (roeisenb@microsoft.com)
- docs(fast-foundation): add api docs for design system and foundation ele (roeisenb@microsoft.com)

## 1.24.8

Wed, 23 Jun 2021 22:58:18 GMT

### Patches

- prevent left/right arrows from scrolling when expanding/collapsing tree-item (tlmii@users.noreply.github.com)

## 1.24.7

Sun, 20 Jun 2021 07:21:25 GMT

### Patches

- Enable stepping from null values on number-field (robarb@microsoft.com)
- fix malformed templates (scomea@microsoft.com)

## 1.24.6

Sun, 13 Jun 2021 07:19:23 GMT

### Patches

- ensure host element of a shadowed element can be resolved (nicholasrice@users.noreply.github.com)

## 1.24.5

Tue, 08 Jun 2021 07:29:18 GMT

### Patches

- streamline horizontal scroll resize (scomea@microsoft.com)

## 1.24.4

Sun, 30 May 2021 07:42:30 GMT

### Patches

- Ensure stale Design Token custom property stylesheets are removed when token values change. (nicholasrice@users.noreply.github.com)
- fix bug caused by asserting parentElement was not null (nicholasrice@users.noreply.github.com)

## 1.24.3

Wed, 26 May 2021 07:33:37 GMT

### Patches

- allow a float to be accurately represented when a step is a fraction (7559015+janechu@users.noreply.github.com)
- fix css custom property emission for dependent DesignToken properties (nicholasrice@users.noreply.github.com)

## 1.24.2

Tue, 25 May 2021 07:27:43 GMT

### Patches

- fix data grid tabbing (scomea@microsoft.com)

## 1.24.1

Fri, 21 May 2021 17:48:08 GMT

### Patches

- update to Design System Provider to use dom.supportsAdoptedStyleSheets (nicholasrice@users.noreply.github.com)

## 1.24.0

Thu, 20 May 2021 07:24:10 GMT

### Minor changes

- add toolbar component (john.kreitlow@microsoft.com)

### Patches

- Bump @microsoft/fast-web-utilities to v4.8.0 (john.kreitlow@microsoft.com)

## 1.23.0

Wed, 19 May 2021 23:37:36 GMT

### Minor changes

- Adds subscribe and unsubscribe methods to DesignToken (nicholasrice@users.noreply.github.com)
- Adds feature to DesignToken to prevent emission to CSS (nicholasrice@users.noreply.github.com)
- Addresses significant performance issues with DesignToken implmentation. This change removes several alpha APIs on DesignToken. (nicholasrice@users.noreply.github.com)

### Patches

- fix: update scrolling with delay loaded content (robarb@microsoft.com)
- menu should not reset tabIndex unnecessarily (scomea@microsoft.com)
- selected option is not visible when dropdown is opened in fast-select (john.kreitlow@microsoft.com)
- undefined (nicholasrice@users.noreply.github.com)
- fix: fast-number-field does not fire input event when buttons pressed (robarb@microsoft.com)
- Bump @microsoft/fast-element to v1.3.0 (nicholasrice@users.noreply.github.com)

## 1.20.0

Sun, 25 Apr 2021 07:21:02 GMT

### Minor changes

- undefined (nicholasrice@users.noreply.github.com)

## 1.19.0

Thu, 22 Apr 2021 07:21:10 GMT

### Minor changes

- adding withDefault method to DesignToken (nicholasrice@users.noreply.github.com)

### Patches

- add function to check for separator, add example and update style for not href item (khamu@microsoft.com)

## 1.18.0

Fri, 16 Apr 2021 01:19:08 GMT

### Minor changes

- open up getter and setter functions to HTMLElement (nicholasrice@users.noreply.github.com)

### Patches

- add missing aria-expanded to the select template (mathieu.lavoie@logmein.com)
- remove incorrect role from horizontal-scroll element (chhol@microsoft.com)
- ensure DesignToken works with falsey values (nicholasrice@users.noreply.github.com)
- fix anchored region positioning bugs (scomea@microsoft.com)

## [1.16.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.16.0...@microsoft/fast-foundation@1.16.1) (2021-03-18)


### Bug Fixes

* combobox with typescript ^4.0 ([#4475](https://github.com/Microsoft/fast/issues/4475)) ([e9d3b34](https://github.com/Microsoft/fast/commit/e9d3b345870b35c8ea9f2079537232c110129be1))
* ensure no exception is thrown when no properties are defined ([#4469](https://github.com/Microsoft/fast/issues/4469)) ([40dc56c](https://github.com/Microsoft/fast/commit/40dc56c3b3a75af73d2bb92f653db11ae424cbf9))





# [1.16.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.15.1...@microsoft/fast-foundation@1.16.0) (2021-03-16)


### Bug Fixes

* add createMenuItem(<prefix>) to menu item template ([#4431](https://github.com/Microsoft/fast/issues/4431)) ([c86b63b](https://github.com/Microsoft/fast/commit/c86b63bd5323880f0dd859cbd2bf8a20ca1ccba0)), closes [#4414](https://github.com/Microsoft/fast/issues/4414) [#4412](https://github.com/Microsoft/fast/issues/4412)
* anchored region pointer events mk2 ([#4402](https://github.com/Microsoft/fast/issues/4402)) ([e0de62e](https://github.com/Microsoft/fast/commit/e0de62e0b1bbcccce9a757c6cd99b4130a702f8f))
* broken formatting and link when generating docs site ([#4459](https://github.com/Microsoft/fast/issues/4459)) ([e817863](https://github.com/Microsoft/fast/commit/e81786349e7c65cfb888a151f0400c736c421912))
* cannot use combobox with typescript ^4.0 ([#4442](https://github.com/Microsoft/fast/issues/4442)) ([3d52ef4](https://github.com/Microsoft/fast/commit/3d52ef43c327d4c5cdabc8f6a1dc514df4cea403))
* combobox escape and arrow keys prevent listbox navigation ([#4443](https://github.com/Microsoft/fast/issues/4443)) ([aa594fe](https://github.com/Microsoft/fast/commit/aa594fecc8f237d80174e41dfff7cfe45562d6dd))
* setting data grid focus should not throw ([#4466](https://github.com/Microsoft/fast/issues/4466)) ([3c56a18](https://github.com/Microsoft/fast/commit/3c56a185c6aa5dcb52c12a9393f51a36521c5f77))


### Features

* add ability to hide step controls and update reveal on hover and focus-within ([#4448](https://github.com/Microsoft/fast/issues/4448)) ([6f6497c](https://github.com/Microsoft/fast/commit/6f6497cba3883b741dddf3b6c78fd0d1571c02f3))
* add expand/collapse icon to menu items ([#4438](https://github.com/Microsoft/fast/issues/4438)) ([db4e9fa](https://github.com/Microsoft/fast/commit/db4e9facad71dbfefce9d2c063dfc16c6b415426))
* add horizontal scroll web component ([#4391](https://github.com/Microsoft/fast/issues/4391)) ([08508a5](https://github.com/Microsoft/fast/commit/08508a5860d6bf1f5a5719028c11e17433ac5ac3)), closes [#4414](https://github.com/Microsoft/fast/issues/4414) [#4412](https://github.com/Microsoft/fast/issues/4412) [#4416](https://github.com/Microsoft/fast/issues/4416) [#4437](https://github.com/Microsoft/fast/issues/4437)





## [1.15.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.15.0...@microsoft/fast-foundation@1.15.1) (2021-03-06)


### Bug Fixes

* conditionally render input container for menuitemcheckbox and menuitemradio ([#4429](https://github.com/Microsoft/fast/issues/4429)) ([8561a99](https://github.com/Microsoft/fast/commit/8561a99898d012f1accd0658eef4e8fb211d5683))





# [1.15.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.14.0...@microsoft/fast-foundation@1.15.0) (2021-03-06)


### Bug Fixes

* add default expanded and collapsed SVGs to accordion-item component ([#4368](https://github.com/Microsoft/fast/issues/4368)) ([b0bea82](https://github.com/Microsoft/fast/commit/b0bea8203c3774b40e0561e37926a9f28794b4a9))
* add radio and checkbox visual in fast-menu-item ([#4205](https://github.com/Microsoft/fast/issues/4205)) ([50efed4](https://github.com/Microsoft/fast/commit/50efed4a57b4a89d69a7079b581fdec8428dfe37))
* data-grid stores generated templates ([#4412](https://github.com/Microsoft/fast/issues/4412)) ([7de9602](https://github.com/Microsoft/fast/commit/7de960213d593f0dcafcdcb291fc592564ca9ae4))
* default selected option in listbox ([#4372](https://github.com/Microsoft/fast/issues/4372)) ([35870a6](https://github.com/Microsoft/fast/commit/35870a69d10ec52c983adb879d58343386d3a8d6))
* focusout on empty select throws an error ([#4373](https://github.com/Microsoft/fast/issues/4373)) ([b2f2f29](https://github.com/Microsoft/fast/commit/b2f2f2907e0ad8f7f0eff89fc2106041edbe3474))
* tooltip doc sample ([#4341](https://github.com/Microsoft/fast/issues/4341)) ([20e1b66](https://github.com/Microsoft/fast/commit/20e1b667abbe39058d5c4c358ccd8b8a93cee316))
* whitespaceFilter filtering elements ([#4360](https://github.com/Microsoft/fast/issues/4360)) ([2f14137](https://github.com/Microsoft/fast/commit/2f14137579e1aa8f6724f0211c8baf2f2a6c8008))
* **tooltip:** fix tooltip inside shadow root ([#4303](https://github.com/Microsoft/fast/issues/4303)) ([fc65f50](https://github.com/Microsoft/fast/commit/fc65f505fdf2b621c6cb9a29deccdb4a805b956a))


### Features

* add placeholder attribute to combobox component ([#4427](https://github.com/Microsoft/fast/issues/4427)) ([b507c25](https://github.com/Microsoft/fast/commit/b507c257c39ca44244bea7fdb4e07fc5b71b3eea))
* **di:** enable dom containers to handle same element dep resolution ([#4406](https://github.com/Microsoft/fast/issues/4406)) ([e3145fe](https://github.com/Microsoft/fast/commit/e3145fe557eb56fc6aafa99f9803ecd7d07b55e5))
* add combobox component ([#4379](https://github.com/Microsoft/fast/issues/4379)) ([aab8441](https://github.com/Microsoft/fast/commit/aab844120b40b14ef284718880dbe05da65a5392))
* add nested menu support ([#4142](https://github.com/Microsoft/fast/issues/4142)) ([551ff04](https://github.com/Microsoft/fast/commit/551ff0467e9424bff00610c737744dbfa30cea9c))
* **di:** enable use of the inject decorator on properties ([#4401](https://github.com/Microsoft/fast/issues/4401)) ([2f8355b](https://github.com/Microsoft/fast/commit/2f8355b932ba5083bdcb66a5c3381616699d2cef))
* add prefers-color-scheme behaviors for light and dark mode ([#4382](https://github.com/Microsoft/fast/issues/4382)) ([1e467d7](https://github.com/Microsoft/fast/commit/1e467d7b6542e9e6910117e1d09c26cd73f7f599))
* enable FoundationElement.compose to accept template functions ([#4390](https://github.com/Microsoft/fast/issues/4390)) ([468f2fc](https://github.com/Microsoft/fast/commit/468f2fca53be88d8551352c99b42c66c3d32fe47))





# [1.14.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.12.0...@microsoft/fast-foundation@1.14.0) (2021-02-08)


### Bug Fixes

* accordion arrow key press moves focus from content to accordion header ([#4331](https://github.com/Microsoft/fast/issues/4331)) ([d959c18](https://github.com/Microsoft/fast/commit/d959c18e5a5cba3b983c2cba096face14bec2bb8))
* add check for intersection observer support before instanciating ([#4349](https://github.com/Microsoft/fast/issues/4349)) ([d106995](https://github.com/Microsoft/fast/commit/d106995dea3e7384633dbf2653b83aba3c815713))


### Features

* adds DI system, Configuration, and FoundationElement ([#4166](https://github.com/Microsoft/fast/issues/4166)) ([cfbe786](https://github.com/Microsoft/fast/commit/cfbe786f23623d69f2d658b51fe9211527ef9f0f))





# [1.13.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.12.0...@microsoft/fast-foundation@1.13.0) (2021-02-08)


### Bug Fixes

* accordion arrow key press moves focus from content to accordion header ([#4331](https://github.com/Microsoft/fast/issues/4331)) ([d959c18](https://github.com/Microsoft/fast/commit/d959c18e5a5cba3b983c2cba096face14bec2bb8))
* add check for intersection observer support before instanciating ([#4349](https://github.com/Microsoft/fast/issues/4349)) ([d106995](https://github.com/Microsoft/fast/commit/d106995dea3e7384633dbf2653b83aba3c815713))


### Features

* adds DI system, Configuration, and FoundationElement ([#4166](https://github.com/Microsoft/fast/issues/4166)) ([cfbe786](https://github.com/Microsoft/fast/commit/cfbe786f23623d69f2d658b51fe9211527ef9f0f))





# [1.12.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.11.1...@microsoft/fast-foundation@1.12.0) (2021-01-30)


### Bug Fixes

* `UnhandledPromiseRejectionWarning`s when building fast-components ([#4218](https://github.com/Microsoft/fast/issues/4218)) ([48d52f4](https://github.com/Microsoft/fast/commit/48d52f43d8aa9938139f4dc0a2318fe400050216))
* add class content to fix missing underline on button component ([#4226](https://github.com/Microsoft/fast/issues/4226)) ([bb9caaf](https://github.com/Microsoft/fast/commit/bb9caafd0edcbb0da46d74035fff246d36661f56)), closes [#4201](https://github.com/Microsoft/fast/issues/4201) [#16271](https://github.com/Microsoft/fast/issues/16271)
* add whitespace filter to text-field template to correctly hide label div with start and end content ([#4245](https://github.com/Microsoft/fast/issues/4245)) ([70ce353](https://github.com/Microsoft/fast/commit/70ce3537c3d29789b5030abe4ea6c58b098f69b5))
* display active indicator when tab is disabled ([#4207](https://github.com/Microsoft/fast/issues/4207)) ([ca0efbb](https://github.com/Microsoft/fast/commit/ca0efbb2968b0f9b017f3b28ab5c1bb688fafd47))
* expand collapse tree view svg ([#4225](https://github.com/Microsoft/fast/issues/4225)) ([c6d6259](https://github.com/Microsoft/fast/commit/c6d62597a89b7329b83f01520eebd811608c37d3))
* tooltips are incorrectly positioned when parent is a flex container ([#4256](https://github.com/Microsoft/fast/issues/4256)) ([bc47c02](https://github.com/Microsoft/fast/commit/bc47c02a44b7b274f458322b65ce7b4555de49e3))


### Features

* add disclosure component ([#3921](https://github.com/Microsoft/fast/issues/3921)) ([dec77c9](https://github.com/Microsoft/fast/commit/dec77c99742e5aaddc5a2f3da2e340efc56ef00a))
* add fast-number-field component for data applications ([#4204](https://github.com/Microsoft/fast/issues/4204)) ([7196215](https://github.com/Microsoft/fast/commit/7196215344e0f6141dbc7dff69fc4c0bde8b586a))
* add getPosition service for anchored region ([#4210](https://github.com/Microsoft/fast/issues/4210)) ([94d5ffa](https://github.com/Microsoft/fast/commit/94d5ffa2235e2d681e03e32442346018a81c693f))
* add radio group functionality to menu items ([#4208](https://github.com/Microsoft/fast/issues/4208)) ([89a3930](https://github.com/Microsoft/fast/commit/89a3930be83434b9039d25f82ae0c251e2d03956))
* add select spec ([#4194](https://github.com/Microsoft/fast/issues/4194)) ([7af127a](https://github.com/Microsoft/fast/commit/7af127aa1e41d4a379cc8b5ce15798d9423b3726))
* Create a behavior for attaching component styles based on an appearance ([#4238](https://github.com/Microsoft/fast/issues/4238)) ([7b498ce](https://github.com/Microsoft/fast/commit/7b498ce3101d90dee2558433fa0abadca5149d36))





## [1.11.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.11.0...@microsoft/fast-foundation@1.11.1) (2020-12-17)


### Bug Fixes

* update applyMixin function to ensure metadata for attrs are copied and applied correctly ([#4200](https://github.com/Microsoft/fast/issues/4200)) ([dcbd6a5](https://github.com/Microsoft/fast/commit/dcbd6a57d73691ced50c22db2b909ee6b6f96e1f))





# [1.11.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.10.0...@microsoft/fast-foundation@1.11.0) (2020-12-16)


### Bug Fixes

* anchored region default viewport ([#4146](https://github.com/Microsoft/fast/issues/4146)) ([a6806e9](https://github.com/Microsoft/fast/commit/a6806e9ed289e7ce570a542de5da9b6e0ba9e60b))
* select should match native behavior for value changes and change event emitting ([#4176](https://github.com/Microsoft/fast/issues/4176)) ([07f5eaa](https://github.com/Microsoft/fast/commit/07f5eaa93b907cc4f712c954e8f6669c391a8d7f))
* **dialog:** accidental improperly bound this in callback ([#4168](https://github.com/Microsoft/fast/issues/4168)) ([9d54fe9](https://github.com/Microsoft/fast/commit/9d54fe9c078cd3e16291a8c599d8d53f0df52670))
* **fast-foundation:** ensure global aria attrs are applied ([#4172](https://github.com/Microsoft/fast/issues/4172)) ([dd3a1c9](https://github.com/Microsoft/fast/commit/dd3a1c9f9f5c96c1d7eb67a1f57f5f72136791cc))
* disabled menu items should be focusable ([#4154](https://github.com/Microsoft/fast/issues/4154)) ([b971a18](https://github.com/Microsoft/fast/commit/b971a18281ba33f094a8dbc59a799a3e9c82ccb8))
* ensure DSP subscribes to upstream DSP properties ([#4143](https://github.com/Microsoft/fast/issues/4143)) ([b403909](https://github.com/Microsoft/fast/commit/b403909282c115c99bf3dc66d5a9ff8715086dc7))
* formassociated tests on firefox ([#4158](https://github.com/Microsoft/fast/issues/4158)) ([b3266fb](https://github.com/Microsoft/fast/commit/b3266fb5d12a200aeee5afb2ae44979db3c051f6))
* remove shadowRoot in direction utility ([#4157](https://github.com/Microsoft/fast/issues/4157)) ([041ae70](https://github.com/Microsoft/fast/commit/041ae70ba3a8ba7280b1a571ba8952f443e724e2))


### Features

* add a data grid web component ([#4029](https://github.com/Microsoft/fast/issues/4029)) ([7239edc](https://github.com/Microsoft/fast/commit/7239edc775c26e003fd0c8cf11c0ba2bb62b76c6))
* add beta anchored region component ([#4183](https://github.com/Microsoft/fast/issues/4183)) ([5d9f0ac](https://github.com/Microsoft/fast/commit/5d9f0acc4b8783d939bff389195fb92501d1a9ab))
* add default slot changed to anchor ([#4159](https://github.com/Microsoft/fast/issues/4159)) ([8a264ec](https://github.com/Microsoft/fast/commit/8a264ec2a22d4f02e901a260b85f77c381a52231))
* add loaded event to anchored region ([#4165](https://github.com/Microsoft/fast/issues/4165)) ([b54ac1b](https://github.com/Microsoft/fast/commit/b54ac1b09ccff95fc58ab84204a138dbfac9b8ba))





# [1.10.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.9.0...@microsoft/fast-foundation@1.10.0) (2020-12-02)


### Bug Fixes

* fix type error in custom property manager running on safari ([#4147](https://github.com/Microsoft/fast/issues/4147)) ([6320973](https://github.com/Microsoft/fast/commit/6320973ff0e14165b2f957b42a8feee1f71af9c1))


### Features

* add default slot change method ([#4148](https://github.com/Microsoft/fast/issues/4148)) ([5e9fb05](https://github.com/Microsoft/fast/commit/5e9fb0590833fe89d0a12132abdc0e88f64fbbcb))





# [1.9.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.8.1...@microsoft/fast-foundation@1.9.0) (2020-11-19)


### Bug Fixes

* active indicator losing track if double click ([#4085](https://github.com/Microsoft/fast/issues/4085)) ([fcecc75](https://github.com/Microsoft/fast/commit/fcecc759ed1cdddd3a5c73d38514dfce7edf432d))
* active indicator no longer animating ([#4126](https://github.com/Microsoft/fast/issues/4126)) ([49e2608](https://github.com/Microsoft/fast/commit/49e26089c9275c5794af5d4e47427237363d333f))
* corrects ElementInternals feature detection ([#4087](https://github.com/Microsoft/fast/issues/4087)) ([58b3e54](https://github.com/Microsoft/fast/commit/58b3e540c77eafa95ade021fd90b184d6f929a50))
* ensure form elements reset when the parent form's reset() method is invoked. ([#4075](https://github.com/Microsoft/fast/issues/4075)) ([f19894e](https://github.com/Microsoft/fast/commit/f19894e746f0e1b7cffcce9d1269b9e6080f723a))
* ensure StyleElementCustomPropertyManager works with disconnected elements ([#4112](https://github.com/Microsoft/fast/issues/4112)) ([e903bfa](https://github.com/Microsoft/fast/commit/e903bfa38b3ce2e8689c4eef4b552d9e7f8a9b88))
* ensure tree items with children have a value for aria-expanded ([#4114](https://github.com/Microsoft/fast/issues/4114)) ([e7a7553](https://github.com/Microsoft/fast/commit/e7a7553c8e2fb205927d4d913de0d2790720ced7))
* fast-slider sets value to NaN if developer tools open ([#4033](https://github.com/Microsoft/fast/issues/4033)) ([35d6903](https://github.com/Microsoft/fast/commit/35d6903cdc73fb4c5283bdfc5dcb0955b09d9b4c))
* handle initially set value in FormAssociated ([#4047](https://github.com/Microsoft/fast/issues/4047)) ([bf7e874](https://github.com/Microsoft/fast/commit/bf7e87403883efcd438902bbfb43a74491a47b3f))
* move component options to independent modules ([#4048](https://github.com/Microsoft/fast/issues/4048)) ([f8a88a8](https://github.com/Microsoft/fast/commit/f8a88a8b14b2eee4dd26619f7927be73bea94277))
* revert radio to using class selector instead of attr, update slider-label to use internal styles for orientation ([#4108](https://github.com/Microsoft/fast/issues/4108)) ([c6ecedf](https://github.com/Microsoft/fast/commit/c6ecedf8427caf686bfebe89e78d2a6c2b7153f2))


### Features

* Add disabled attr to fast-tab ([#4013](https://github.com/Microsoft/fast/issues/4013)) ([caef4b1](https://github.com/Microsoft/fast/commit/caef4b15ce729ab1c1762bf0578edcf4d809351c)), closes [#4017](https://github.com/Microsoft/fast/issues/4017)
* add fast-breadcrumb and fast-breadcrumb-item web components ([#3627](https://github.com/Microsoft/fast/issues/3627)) ([e2e142c](https://github.com/Microsoft/fast/commit/e2e142c8ab91eb10906e74853f34afd5081ca12b))
* add select component ([#4074](https://github.com/Microsoft/fast/issues/4074)) ([6984027](https://github.com/Microsoft/fast/commit/698402773e77b2766e995770b0d34c6d129e2ec3))
* add show and hide methods to dialog ([#4030](https://github.com/Microsoft/fast/issues/4030)) ([00b69ff](https://github.com/Microsoft/fast/commit/00b69fff994035e769906563190cca86e3ae61f7))
* convert FormAssociated to a constructable function ([#4115](https://github.com/Microsoft/fast/issues/4115)) ([da8d54b](https://github.com/Microsoft/fast/commit/da8d54b5a057812622471e1261200b8f9b290d12))
* enable shared CSSStyleSheets in DesignSystemProvider ([#4065](https://github.com/Microsoft/fast/issues/4065)) ([5579c2e](https://github.com/Microsoft/fast/commit/5579c2ef424f8f63e00c8e29b5c4d43acb32c6db))





## [1.8.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.8.0...@microsoft/fast-foundation@1.8.1) (2020-10-14)


### Bug Fixes

* allow child radio buttons to be changed multiple times from javascript ([#3976](https://github.com/Microsoft/fast/issues/3976)) ([8ea7cc8](https://github.com/Microsoft/fast/commit/8ea7cc81cb34cf52d944136c9dc771fd03997bb1))
* corrects keyboard behavior of tree view and tree view item. ([#4003](https://github.com/Microsoft/fast/issues/4003)) ([9d80632](https://github.com/Microsoft/fast/commit/9d806322c632ddf6294bddd782f39ec6c0300798))
* designSystem property resolution behavior correction ([#4032](https://github.com/Microsoft/fast/issues/4032)) ([7e82cae](https://github.com/Microsoft/fast/commit/7e82caeb78c86898c38bd24d171d5ded8fc8473a))
* leverage FASTController.addStyles to attach css custom property target sheet ([#4031](https://github.com/Microsoft/fast/issues/4031)) ([2ca2ed0](https://github.com/Microsoft/fast/commit/2ca2ed075879f6e1ec04d0ee2753cbf23dcaff9f))
* tabs directional arrow key bug ([#3986](https://github.com/Microsoft/fast/issues/3986)) ([2d797a5](https://github.com/Microsoft/fast/commit/2d797a525eafd163aa9cba59823bc76d6b5b7d1f))





# [1.8.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.7.2...@microsoft/fast-foundation@1.8.0) (2020-09-28)


### Bug Fixes

* active id should update selected tab ([#3931](https://github.com/Microsoft/fast/issues/3931)) ([ff956ba](https://github.com/Microsoft/fast/commit/ff956ba15c7b4078e1a38283d1d45f763d761940))
* adds constraint validation to all form-associated elements ([#3932](https://github.com/Microsoft/fast/issues/3932)) ([60fbec0](https://github.com/Microsoft/fast/commit/60fbec074d94606951311a2db4feff93a96a11e1))
* aria attributes for slider should have explicit values ([#3915](https://github.com/Microsoft/fast/issues/3915)) ([8335702](https://github.com/Microsoft/fast/commit/8335702e28295e216fb7c673457a09285a388be4))
* click does not uncheck radio if it was already checked ([#3888](https://github.com/Microsoft/fast/issues/3888)) ([989c785](https://github.com/Microsoft/fast/commit/989c7856fe5a8233a4744627d1710f0dd0467b69))
* ensure a dsp pulls all relevant properties from the parent provider ([#3939](https://github.com/Microsoft/fast/issues/3939)) ([c70c519](https://github.com/Microsoft/fast/commit/c70c5190337890775f29b863b00d703ffda3a853))
* ensure attributes are passed to text field template ([#3923](https://github.com/Microsoft/fast/issues/3923)) ([31afcd4](https://github.com/Microsoft/fast/commit/31afcd430d80fe2fb13d921b11b7ec92cf1a0bc8))
* ensure badge always applies inline-style when attributes exist ([#3905](https://github.com/Microsoft/fast/issues/3905)) ([7624cba](https://github.com/Microsoft/fast/commit/7624cba3a7ec74bebc199a038a054fab8816684e))
* fixed typos ([#3934](https://github.com/Microsoft/fast/issues/3934)) ([f82468c](https://github.com/Microsoft/fast/commit/f82468c730165983d64e51ce74abaa8a27a8fb64))
* for tree-view removing space bar key handler and match aria spec ([#3954](https://github.com/Microsoft/fast/issues/3954)) ([4cb03e8](https://github.com/Microsoft/fast/commit/4cb03e86995efcd52c24ef4a0a606e0221df334a)), closes [/w3c.github.io/aria-practices/#keyboard-interaction-23](https://github.com//w3c.github.io/aria-practices//issues/keyboard-interaction-23)
* remove placeholder functions for boolean attributes in dialog component ([#3913](https://github.com/Microsoft/fast/issues/3913)) ([ab21eb7](https://github.com/Microsoft/fast/commit/ab21eb760ba2f84858b24dbf6c459f1602a3f7b0))
* tree view item should have a click handler on root element ([#3951](https://github.com/Microsoft/fast/issues/3951)) ([913c2bd](https://github.com/Microsoft/fast/commit/913c2bd3a8f28622788c1f87a9f320ba7dbc1297))
* tree-view right and left arrow keyboarding should behave as wai-aria spec suggests ([#3890](https://github.com/Microsoft/fast/issues/3890)) ([f866359](https://github.com/Microsoft/fast/commit/f8663590879ef2b1a064d10f9302f14cb7be0293))


### Features

*  Anchored region reliability/perf improvements ([#3876](https://github.com/Microsoft/fast/issues/3876)) ([0e697f6](https://github.com/Microsoft/fast/commit/0e697f6ab6bd8f40894b9791d3eec8fe97a97d26))
* add skeleton component ([#3877](https://github.com/Microsoft/fast/issues/3877)) ([aff7d30](https://github.com/Microsoft/fast/commit/aff7d3010574183744cf7105ae51a275c2c70a12))
* add tooltip component ([#3549](https://github.com/Microsoft/fast/issues/3549)) ([cb7aa98](https://github.com/Microsoft/fast/commit/cb7aa98ccaaad00e9e86b4575ef011986c054d08))





## [1.7.2](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.7.1...@microsoft/fast-foundation@1.7.2) (2020-09-10)


### Bug Fixes

* able to keyboard tab back in the tree view ([#3867](https://github.com/Microsoft/fast/issues/3867)) ([d3e3cde](https://github.com/Microsoft/fast/commit/d3e3cde2fc3efd034569f6ade35a739aaf3e2738)), closes [#3801](https://github.com/Microsoft/fast/issues/3801)
* implicit form-associated submission ([#3861](https://github.com/Microsoft/fast/issues/3861)) ([8342912](https://github.com/Microsoft/fast/commit/8342912802b0cff20b38d16d28ccff49147088fa))
* move right and move left functionality of radio-group in RTL ([f2735aa](https://github.com/Microsoft/fast/commit/f2735aa2fdb3c9ac71e143fddee84397f045afec))
* tabs right and left keyboarding in rtl ([#3836](https://github.com/Microsoft/fast/issues/3836)) ([d9ac1b1](https://github.com/Microsoft/fast/commit/d9ac1b13bafbb94a204b58dcc56a02321fbc8fbd))





## [1.7.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.7.0...@microsoft/fast-foundation@1.7.1) (2020-08-27)


### Bug Fixes

* consistent with min-width, min-height is at least the thumb size add default height ([#3746](https://github.com/Microsoft/fast/issues/3746)) ([b3f9aee](https://github.com/Microsoft/fast/commit/b3f9aee644261ddcdd029fbafed69186db070c77))
* proxy element causes empty check on slots to fail ([#3779](https://github.com/Microsoft/fast/issues/3779)) ([78787c3](https://github.com/Microsoft/fast/commit/78787c35631edb2b86f985dbfbc68036797f60d0))
* **docs:** correct typos in readme and spec files ([#3740](https://github.com/Microsoft/fast/issues/3740)) ([9bdb11f](https://github.com/Microsoft/fast/commit/9bdb11f7eab686ab6de32eda352f1a0493ee9545))





# [1.7.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.6.0...@microsoft/fast-foundation@1.7.0) (2020-08-13)


### Bug Fixes

* anchored region fails on firefox ([#3701](https://github.com/Microsoft/fast/issues/3701)) ([1fd02e0](https://github.com/Microsoft/fast/commit/1fd02e013fc3798da8686ad2923d3bfcdeb796d7))
* changed setupDefault to set initialValue which will set dirtyValue false after changing ([#3642](https://github.com/Microsoft/fast/issues/3642)) ([0b30fdf](https://github.com/Microsoft/fast/commit/0b30fdf78ebc6635ffb63e6b083f072871945d8c))
* correct tabs animation when using home/end touch ([#3718](https://github.com/Microsoft/fast/issues/3718)) ([24ed0e5](https://github.com/Microsoft/fast/commit/24ed0e5262f8201f465db8798f7b01bcbbb21135))
* correct typos on aria attributes ([#3690](https://github.com/Microsoft/fast/issues/3690)) ([d1c9ba4](https://github.com/Microsoft/fast/commit/d1c9ba4903dabe16487389917ad762d744356060))
* fix radiogroup tabfocus ([#3650](https://github.com/Microsoft/fast/issues/3650)) ([59536fe](https://github.com/Microsoft/fast/commit/59536fe959c6d4ab2b48fa7636e11f8e68ecc0eb))
* hitting enter key when in the text-field did not submit form ([#3687](https://github.com/Microsoft/fast/issues/3687)) ([3bc4384](https://github.com/Microsoft/fast/commit/3bc4384190af70ca082ef4e24a10f030e22a09e0))
* turn off animation when dragging ([#3664](https://github.com/Microsoft/fast/issues/3664)) ([49e9d02](https://github.com/Microsoft/fast/commit/49e9d0294e3a98b0da443b4194d0006aaf5ff422))
* wrapping set focus in dom.queueupdate ([#3703](https://github.com/Microsoft/fast/issues/3703)) ([7cb4616](https://github.com/Microsoft/fast/commit/7cb4616a9947639d6fb7a06e56db3d3900841674))


### Features

* anchored region revision ([#3527](https://github.com/Microsoft/fast/issues/3527)) ([63f3658](https://github.com/Microsoft/fast/commit/63f3658659a113bdc304f32e22b958e0d56ab7bf))
* export form-associated under alpha flag ([#3618](https://github.com/Microsoft/fast/issues/3618)) ([cbcb217](https://github.com/Microsoft/fast/commit/cbcb2177c81740f6d6fc0be98973217dbb001e00))


### Reverts

* Revert "chore: update all http to https to resolve WS1262 security vulnerability (#3658)" (#3699) ([0cac64a](https://github.com/Microsoft/fast/commit/0cac64a869e1b65a94ef14ed50b1324d0e15be46)), closes [#3658](https://github.com/Microsoft/fast/issues/3658) [#3699](https://github.com/Microsoft/fast/issues/3699)





# [1.6.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.5.0...@microsoft/fast-foundation@1.6.0) (2020-07-31)


### Bug Fixes

* add form submission and reset behavior to Button ([#3603](https://github.com/Microsoft/fast/issues/3603)) ([f646343](https://github.com/Microsoft/fast/commit/f6463436a001d07a7cfbd5d87460c76cf8584e65))
* various fixes for form-associated custom elements ([#3581](https://github.com/Microsoft/fast/issues/3581)) ([ccba229](https://github.com/Microsoft/fast/commit/ccba229c6c1133485d0fac92eae88cb3a6369495))


### Features

* adding directional stylesheet behavior ([#3559](https://github.com/Microsoft/fast/issues/3559)) ([74c19af](https://github.com/Microsoft/fast/commit/74c19af79cb6b9c015ab3a454a3e69d453f1a217))
* create an observable function to support aria-valuetext on slider component ([#3508](https://github.com/Microsoft/fast/issues/3508)) ([b4ac369](https://github.com/Microsoft/fast/commit/b4ac369e37ba591a5bb1d8c7bcbfde6dffcadeef)), closes [#3504](https://github.com/Microsoft/fast/issues/3504)





# [1.5.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.4.0...@microsoft/fast-foundation@1.5.0) (2020-07-23)


### Bug Fixes

* address nested styling issues and provide a more intuitive API for nesting ([#3528](https://github.com/Microsoft/fast/issues/3528)) ([4fe0dd3](https://github.com/Microsoft/fast/commit/4fe0dd38ce8f2b43be0f13c7efac2f12ada6cd78))
* move text field and text area appearances from foundation to components ([#3540](https://github.com/Microsoft/fast/issues/3540)) ([ca8ac76](https://github.com/Microsoft/fast/commit/ca8ac760cdf666fc79a47ba9a21c5f964556dbab))
* rollup minify selectors should retain spaces ([#3524](https://github.com/Microsoft/fast/issues/3524)) ([cbdfc45](https://github.com/Microsoft/fast/commit/cbdfc45c2543fe9f94e0edc7687cc9f04a38e118))
* update nested to be observable and set isNestedItem method to readonly ([#3539](https://github.com/Microsoft/fast/issues/3539)) ([9e67f52](https://github.com/Microsoft/fast/commit/9e67f52a8fd3e1736e3882ef7e2fa3f25e63a396))


### Features

* basic menu item check state toggling ([#3512](https://github.com/Microsoft/fast/issues/3512)) ([ea84cbd](https://github.com/Microsoft/fast/commit/ea84cbd125b16de0ff2ae888f82163178af8da69))





# [1.4.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.3.0...@microsoft/fast-foundation@1.4.0) (2020-07-14)


### Bug Fixes

* correct spelling of aria-labelledby in tabs ([#3463](https://github.com/Microsoft/fast/issues/3463)) ([c0385d9](https://github.com/Microsoft/fast/commit/c0385d97ec56ef8aef27047f6011261c2484a99d))
* correct web component menu keyboarding and aria-expanded ([#3496](https://github.com/Microsoft/fast/issues/3496)) ([0530a42](https://github.com/Microsoft/fast/commit/0530a4230946d2aee39861001f3deea3b8816038))
* move setAttribute calls for proxy elements to connectedCallback ([#3494](https://github.com/Microsoft/fast/issues/3494)) ([cdaf0ba](https://github.com/Microsoft/fast/commit/cdaf0bae4de3c995611e2e02313cc19e8e259b27))
* reflect aria-hidden attribute in the DOM for the flipper component ([#3468](https://github.com/Microsoft/fast/issues/3468)) ([2f7b897](https://github.com/Microsoft/fast/commit/2f7b8977f4d5ea3173a70f719706155831bfa1bd))
* removing un-needed nbsp; in slider-label and radio-group templates ([#3506](https://github.com/Microsoft/fast/issues/3506)) ([7cd003e](https://github.com/Microsoft/fast/commit/7cd003e5877d34ad926ee8268852176158cafc4b))


### Features

* adds mixin to support global aria-* attributes for components delegating focus ([#3470](https://github.com/Microsoft/fast/issues/3470)) ([054c890](https://github.com/Microsoft/fast/commit/054c89000d8931d9e203cb7f831c1e7f11c9038a))
* export MatchMediaStylesheetBehavior constructor ([#3445](https://github.com/Microsoft/fast/issues/3445)) ([ffc59f8](https://github.com/Microsoft/fast/commit/ffc59f80166768550bf2488cd8b66e2d6b55b503))
* move appearance attributes of anchor and button out of fast-foundation ([#3420](https://github.com/Microsoft/fast/issues/3420)) ([069e1ee](https://github.com/Microsoft/fast/commit/069e1ee000fc2f8e184919b16df0cb84bc610838))
* simplify rollup configs and compress tagged template literals ([#3452](https://github.com/Microsoft/fast/issues/3452)) ([7533e92](https://github.com/Microsoft/fast/commit/7533e927f2467dd6f8dd46c1d3cef6c0df773fc4))
* update typescript version and remove utility types dependencies for react packages ([#3422](https://github.com/Microsoft/fast/issues/3422)) ([09d07b5](https://github.com/Microsoft/fast/commit/09d07b580cda3bcc5d28f83d3568521f710c9576))





# [1.3.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.2.2...@microsoft/fast-foundation@1.3.0) (2020-07-02)


### Bug Fixes

* slider thumb does not respond to touch events, vertical sliders track parameters incorrect after scrolling page ([#3414](https://github.com/Microsoft/fast/issues/3414)) ([02f9ac4](https://github.com/Microsoft/fast/commit/02f9ac4306031aab1702e98083effc0ce858dec5))


### Features

* add tree-vew and tree-item components ([#3240](https://github.com/Microsoft/fast/issues/3240)) ([57eaa83](https://github.com/Microsoft/fast/commit/57eaa83293358383d03cbd3c5b6a9e6ffa797254))
* make tabs adjust method public ([#3426](https://github.com/Microsoft/fast/issues/3426)) ([0dd2a5e](https://github.com/Microsoft/fast/commit/0dd2a5e016fd032b0a51ab441d3b3977220cf073))





## [1.2.2](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.2.1...@microsoft/fast-foundation@1.2.2) (2020-06-26)


### Bug Fixes

* selected tab becoming undefined when tab slot pass anything except icon or text node ([#3350](https://github.com/Microsoft/fast/issues/3350)) ([eda1aef](https://github.com/Microsoft/fast/commit/eda1aef79aeb612b05ea73b3861a93f5241c382f))





## [1.2.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.2.0...@microsoft/fast-foundation@1.2.1) (2020-06-17)

**Note:** Version bump only for package @microsoft/fast-foundation





# [1.2.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.1.2...@microsoft/fast-foundation@1.2.0) (2020-06-15)


### Bug Fixes

* correct css part name for dialog component ([#3260](https://github.com/Microsoft/fast/issues/3260)) ([62eff11](https://github.com/Microsoft/fast/commit/62eff11685248f6e686eb761d2614f1f4a70d20e))
* ensure all component internals have part names ([#3306](https://github.com/Microsoft/fast/issues/3306)) ([95360a7](https://github.com/Microsoft/fast/commit/95360a76ccb4ec40b2623dc01b55ea123d522b62))


### Features

* add live code examples to docs site ([#3216](https://github.com/Microsoft/fast/issues/3216)) ([763054f](https://github.com/Microsoft/fast/commit/763054f36433f9b87e620c0c8d03c229dcd8560f))
* design-system-provider now paints CSS color and background color ([#3278](https://github.com/Microsoft/fast/issues/3278)) ([8e97ac4](https://github.com/Microsoft/fast/commit/8e97ac4aae18c8b17b90e61e139ad3fb0b7f7c3d))
* provides access to the CSS variable created by CSSCustomProprtyBehaviors ([#3256](https://github.com/Microsoft/fast/issues/3256)) ([391f029](https://github.com/Microsoft/fast/commit/391f029da2d5a5502ee484af10aaef771d3c297c))





## [1.1.1](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.1.0...@microsoft/fast-foundation@1.1.1) (2020-06-09)


### Bug Fixes

* correct css part name for dialog component ([6e0c7a0](https://github.com/Microsoft/fast/commit/6e0c7a01fa3d28e0a725eb5e5bbc6462ca0b5d57))





# [1.1.0](https://github.com/Microsoft/fast/compare/@microsoft/fast-foundation@1.0.0...@microsoft/fast-foundation@1.1.0) (2020-06-05)


### Bug Fixes

* children components not always added to the internal slotted radio control collection ([#3169](https://github.com/Microsoft/fast/issues/3169)) ([1d1ce86](https://github.com/Microsoft/fast/commit/1d1ce861f936800768b706de3b2175019c0cc18c))
* remove static class from start/end template ([#3225](https://github.com/Microsoft/fast/issues/3225)) ([ea6e790](https://github.com/Microsoft/fast/commit/ea6e7906ef621f1875e7e24e5b79a3ed33189e33))
* slider vertical navigation and value setting bugs ([#3176](https://github.com/Microsoft/fast/issues/3176)) ([f46d87d](https://github.com/Microsoft/fast/commit/f46d87d8d7dfe9101e0d1d8bec7d8a08097751bb))


### Features

* add accordion web component ([#3067](https://github.com/Microsoft/fast/issues/3067)) ([f551378](https://github.com/Microsoft/fast/commit/f55137803551711bef9eeb2c55c8d6f01a3eb74f))
* **fast-foundation:** add element test helper ([#3184](https://github.com/Microsoft/fast/issues/3184)) ([a27161d](https://github.com/Microsoft/fast/commit/a27161d38526a7fb8cb39fe9b0d4addeb0c9ad11))
* **website:**  new docusaurus v2 setup with launch toc configuration ([#3159](https://github.com/Microsoft/fast/issues/3159)) ([f12ba16](https://github.com/Microsoft/fast/commit/f12ba1687bb46fd3f6717790b1687b441363671e))





# 1.0.0 (2020-05-18)


### Bug Fixes

* replaces childNodes.length check with slotted ([#3130](https://github.com/Microsoft/fast/issues/3130)) ([b69d70c](https://github.com/Microsoft/fast/commit/b69d70c97d21660193c3cbcf9369b94135cfddb3))
* update decorator signature to align with customElement ([#3131](https://github.com/Microsoft/fast/issues/3131)) ([10256b5](https://github.com/Microsoft/fast/commit/10256b59acbdfecfaaa1617ecf29eebe2cff47e4))


### Features

* **web-components:** new build/test/docs setup ([#3156](https://github.com/Microsoft/fast/issues/3156)) ([51d909a](https://github.com/Microsoft/fast/commit/51d909ad6a616cb63f7c62defe1ee1f3d2abaf02))
* add fast-components-msft as a new package ([#3096](https://github.com/Microsoft/fast/issues/3096)) ([0515fff](https://github.com/Microsoft/fast/commit/0515fff5a1b7163e6f63f609e1efdba338e773c7))
* add fast-foundation as a new package ([#3122](https://github.com/Microsoft/fast/issues/3122)) ([322af95](https://github.com/Microsoft/fast/commit/322af95b7b7b33e7db3e0689647ac301ea5be2f1))
* update badge API and styles ([#3147](https://github.com/Microsoft/fast/issues/3147)) ([23eca38](https://github.com/Microsoft/fast/commit/23eca38c0c0ca4ac0d219315fcc1308e093f3363))
* wrap attr and observable into designSystemProperty decorator ([#3132](https://github.com/Microsoft/fast/issues/3132)) ([b6d4d59](https://github.com/Microsoft/fast/commit/b6d4d594d7d91e3588f1b461db1054ed0e4daf22))


### BREAKING CHANGES

* fundamentally changes and breaks the badge component API and styles
* breaks certain package exports
