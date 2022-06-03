---
id: issue-management
title: Issue Management
sidebar_label: Issue Management
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/community/issue-management.md
description: Managing a popular GitHub repo with a small team requires a good balance between creating new features, handling investigations, and fixing bugs.
keywords:
  - issue management
  - releases
---

Managing a popular GitHub repo with a small team is not an easy task. It requires a good balance between creating new features while handling many investigations and bug fixes associated with existing ones.

During the last couple of years, the amount of incoming issues has been constantly growing. While this is a sign of a healthy framework and ecosystem surrounding it, it's becoming harder to react to all those issues.

To keep up with ever-evolving expectations, we use a set of rules to help us better handle the incoming issues.

## Goals

The goals of these rules are listed below in priority order:

- Make it easy to make triage decisions for each issue filed in this repository
- Be able to easily prioritize issues
- Set proper expectations with the community regarding how issues are going to be handled

## Triage process details

The feature teams should be able to look through every single issue filed against this repository and be able to make a quick call regarding the nature of the issue.
We will first categorize the issues and further handle these depending on the category the issue is in. The subsections below represent these categories and the rules we apply for them during our triage review.

### Information gathering

In this phase, we instruct the user on how to collect the appropriate diagnostics and see if they are able to address the issue with that additional information.  When we need user input we will mark the issue with the [`status:needs-information`](#needs-information) label. Issues in this phase may be closed automatically if we do not receive timely responses; they often do not provide enough information for us to investigate further.
We'll try to respond quickly to such issues (within days). If a user has collected all of the relevant diagnostics and the issue is still not apparent, then we will consider it for further [investigation](#investigations) by the team.

### Feature requests

As soon as we identify an issue represents an ask for a new feature, we will label the issue with the `feature` label. If it appears to be an improvement to an existing feature, then we'll label it with the `improvement` label. Most of the time, we will automatically move these issues into one or more of [our project boards](https://github.com/microsoft/fast/projects) for further review during our quarterly and weekly planning meetings. If we think the feature request is not aligned with our goals, we may choose to close it immediately. In some situations, however, we may choose to collect more feedback before acting on the issue. In these situations, we will move the issue into a planning board, but it may remain in the `triage` column so that we can revisit it in a future planning meeting.

### Bug reports

If it's immediately clear that the issue is related to a bug in FAST, we will apply the `bug` label to the issue.

At this point, we will try to make a call regarding its impact and severity. If the issue is critical, we may choose to include it in our current work iteration for immediate handling or potential patching.
If the bug is relatively high impact, we will move the issue to the top of the project backlog and consider picking it up in the next iteration.
If the impact is unclear or is a very corner case scenario, we will prioritize it lower in the backlog or may leave it in the `triage` column of an area board for re-evaluation in a future planning meeting based on reviewing customer upvotes / comments at a later time.

### Investigations

In many situations, it's not immediately clear whether a specific issue reported is a bug or not. To be certain, the team will need to spend time to investigate it before making a call regarding the faith of the issue. In these situations, we will apply the `status:needs-investigation` label to the issue. In many situations, these issues turn out to be a result of some kind of misconfiguration in the user code.
In some rare situations, however, these turn out to be caused by very impactful issues. So we will make a call during the triage whether we need to immediately investigate certain issues or not. If not, we will move the investigation to an appropriate place in a project backlog and consider it for the next iteration.

The `status:needs-investigation` label is also applied in situations where a bug is confirmed but the underlying problem or a potential solution is not clear.

### Documentation requests

Some issues turn out to indicate user confusion around how to configure different aspects of the framework.
When we determine such issues, we will mark these with the `docs:*` labels and move them into the [Site and Documentation](https://github.com/microsoft/fast/projects/19) project backlog for pickup in a future iteration. The goal here will be to fill in the gaps or clarify our documentation so that customers can be successful by using the guidance provided in the documentation.
If we identify a documentation issue, which too many customers are having trouble with, we may choose to address that in the current iteration.

## Planning

The FAST team has a hybrid planning model which combines a traditional quarterly planning exercise for large goals and OKRs with a more agile (Scrum/Kanban hybrid) week-to-week planning process. Project backlogs are maintained, with the majority of the backlog being kept in priority order so that issues are always ready to feed into either of the planning cycles.

### Quarterly planning

Once per quarter our teams take a look at the big picture and make plans to address broader "themes" that we see emerging which can't be handled week-to-week. An example of this is the decision to prioritize SSR work for FAST, which is a large scale, longer-term effort, involving changes across libraries as well as the addition of new libraries. The quarterly planning is then used to shape the weekly planning sessions that happen over the following three months. Our quarterly planning enables us to tackle larger projects and strategic work while our weekly planning enables us to be adaptive and responsive to the changing needs of the community and project.

### Weekly planning

Each week planning meetings are held. Before each meeting, we look through all the accumulated issues in the team's project backlog and choose the most important and impactful ones to handle during the iteration. This will be a mixture of feature requests, bug fixes, documentation issues as well as some investigations.

Note, that we will investigate only issues which have accumulated more than a certain number of upvotes and/or comments, which will indicate that there is some wider impact associated with it.
We may not investigate issues which haven't received many votes/comments and choose to close these. The reason is that the impact is very scoped and potentially something is wrong in the user code. Consider asking these questions on StackOverflow.

For some feature requests and bug reports, depending on the user involvement, we may choose to move these lower in the backlog at this point. What this means, is that they will likely not be looked at again up until the next quarterly planning.

## Releases

Once a PR for a `minor` or `patch` change is merged to master it will be published in the next release. Releases are published Sunday through Thursday evenings (Pacific). To learn more about our release process and planning, please see [Release Planning](./release-planning.md).

## Cleanup

As we go through all the issues during our various planning meetings, we also clean up the boards by closing low priority issues, which have stayed in the backlog for more than 2 quarters. While some of these issues may seem reasonable, the fact that those haven't been addressed for such a prolonged period of time, indicates that they're not as important for the product as they may seem to be.

## Automation

We rely on some automation to help us with this process. New issues are tagged with `status:triage` so that we do not miss them during our triage process. If issues have no activity for a prolonged period of time, a bot will mark them as `warning:stale` and will close the issue in the following weeks if there continues to be no activity.

## Policies

We have a lot of issue traffic to manage, so we have some policies in place to help us do that. This is a brief summary of some of the policies we have in place and the justification for them.

### Commenting on closed issues

In general, we recommend you open a new issue if you have a bug, feature request, or question to discuss. If you find a closed issue that is related, open a *new issue* and link to the closed issue rather than posting on the closed issue. Closed issues don't appear in our triage process, so only the people who have been active on the original thread will be notified of your comment. A new issue will get more attention from the team.

*In general*, we don't mind getting duplicate issues. It's easier for us to close duplicate issues than to discuss multiple root causes on a single issue! We may close your issue as a duplicate if we determine it has the same root cause as another. Don't worry! It's not a waste of our time!

### Needs information

If a contributor reviews an issue and determines that more information is needed from the author, they will post a comment requesting that information and apply the `status:needs-information` label. This label indicates that the author needs to post a response in order for us to continue investigating the issue.

If the author does not post a response within **7 days**, the issue may be closed. If the author responds within **7 days** after the issue is closed, the issue will be  re-opened. We recognize that you may not be able to respond immediately to our requests; we're happy to hear from you whenever you're able to provide the new information.

### PR: Needs author input

Similar to the `status:needs-information` process above, PRs also require author input from time to time. When a member of our team asks for some follow-up changes from the author, we mark these PRs with `status:needs-author-input` label. After doing so, we expect the author to respond within 14 days.
If the author does not post a response, or update the PR within **14 days**, the issue may be closed. If the author responds within **7 days** after the issue is closed, the issue will be re-opened. We recognize that you may not be able to respond immediately to our requests, we're happy to hear from you whenever you're able to provide the new information.

### Duplicate issues

If we determine that the issue is a duplicate of another, we will label it with the `closed:duplicate` label, link it to the duplicate, and close the issue.

### Answered questions

If we determine that the issue is a question, we will label it with `community:question`. If we have posted an answer, we will label it with the `closed:done` label. The issue will then be closed.

### Locking closed issues

After an issue has been closed and had no activity for **30 days** it may be locked. This is done in order to reduce confusion as to where to post new comments. If you are still encountering the problem reported in an issue, or have a related question or bug report, feel free to open a *new issue* and link to the original (now locked) issue!
