---
id: release-planning
title: Release Planning
sidebar_label: Release Planning
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/versioned_docs/version-legacy/community/release-planning.md
description: In order to both provide features and fixes to our community, FAST has adopted the following release planning process and policies.
keywords:
  - release planning
  - issue management
---

In order to both provide features and fixes to our community, while not creating unnecessary breaking changes or churn, FAST has adopted the following release planning process and policies.

## Quarterly planning

As mentioned in [Issue Management](./issue-management.md), feature teams engage in a quarterly planning exercise. During this exercise, engineers look at the big picture and make plans to address broader "themes" that we see emerging which can't be handled week-to-week. The quarterly planning is then used to shape the weekly planning sessions that happen over the following three months. 

The process for identifying quarterly work consists of multiple phases. In each phase, we filter issues out until we end up with the quarterly plan.

- Filtering & Individual prioritization
- Rough costing
- Team review & Priority adjustment
- Capacity planning
- Define the cut line

### Filtering

At this stage, all the issues are distributed to engineers by feature areas. Each engineering lead reviews all the issues within their feature area and returns with a prioritized list.

### Rough costing

At this phase, engineers apply rough cost estimates to the final list of issues that they are proposing. This will be used later during the planning process.

For issues which don't have a clear description of the associated work, it's important to drop a comment summarizing the work involved. This will help at a later time, in case a question about the cost will be raised.

**Note**: while costing issues, it's important to reevaluate costs for those, which already have cost applied. Those are most probably from the past and may be outdated, not properly representing the cost anymore.

### Team review & priority adjustment

Now that all the issues are prepared, the team reviews each issue starting from the highest priority ones. We discuss the issues and agree on the priority at this point. Sometimes we make adjustments to the suggested individual priorities. After discussing each issue the work is summarized in the quarterly plan document, where we double-check our alignment to team mission, pillars, and OKRs.

### Capacity Planning

We usually reserve only 50% of the team capacity for the defined quarterly work. The reason is that we will be getting a lot of incoming feedback throughout the year and we need to allocate time for handling this feedback throughout the year. So we calculate the capacity of the team in weeks for the upcoming year and use half of the final number later in this process.

### Define the cut line

At this point, we have all the candidate issues that we think are worth considering for the upcoming quarter. This number is quite large, so the teams usually won't have enough capacity to handle all this.
We start stack ranking issues so the most important work remains on the top of the list. We then draw the cut line and that defines the rough list of things the team will work on during the upcoming quarter. If there are any issues we think may be at risk, we indicate those as well.

## Release cadence

Our quarterly planning enables us to tackle larger projects and strategic work while our weekly planning enables us to be adaptive and responsive to the changing needs of the community and project. As a result, each week typically produces PRs to the project, which triggers releases.

### Minor and patch releases

The majority of the work coming from the quarterly planning process and the weekly planning process results in minor features and bug fixes. Once a PR for a `minor` or `patch` change is merged to master it will be automatically published in the nightly release. Releases are published Sunday through Thursday evenings (Pacific). Unless there is an emergency need, we avoid releasing on Fridays or the weekend (manual intervention required by us).

### Major releases

Major releases signal breaking changes in libraries. We strive to have only 1-2 major releases per year so that we don't destabilize the community. This means that we will often delay certain issues from one quarter to the next in order to explicitly batch the work together into a single breaking-change release. 

### Major visual update releases

Sometimes component libraries undergo significant visual refreshes. In this case, even though there is no breaking API change, we bump the major version to avoid surprises for the community.
