# Contribution policy
A “Contribution” is any work that is voluntarily submitted to a project. This work may be code, documentation, design, answering questions, or even triaging issues.

Most contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions provided by the bot. You will only need to do this once across all repos using our CLA.

## Code of conduct
All projects have adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Guiding principles
FAST-DNA brings together a cohesive design vision across many web properties, providing a fast centralized location for designers, developers, and partners to learn, share, and contribute.

Contributors work in concert with one another on behalf of the community of users who build web applications and sites. Contributors must demonstrate an ongoing commitment, not only to the project, but to the stability and vitality of the community as a whole. Once demonstrated, contributors may become collaborators. Before any contribution can be accepted into the project, it requires a review by existing collaborators in accordance to the established guidelines and policies. Over time, collaborators may become members of the steering committee.  The steering committee is made up of industry experts, key partners, stakeholders, and visionaries that have a common set of shared objectives and principles.

It is vital that users trust the contributors to have their best interests in mind while making decisions affecting the overall direction. This means having defined guidelines, a clear roadmap, and a predictable release schedule.

Adoption of new capabilities and features must be carefully balanced by the expressed needs of the users and the community. Change for the sake of change must be avoided.

In order to best serve the community as a whole, the development, release, and work management processes must reflect these guiding principles.

## Governance
### Steering Committee
The Fluent Web Steering Committee ("Steering Committee"), membership consists of key Fluent Web Collaborators ("Collaborators") who have demonstrated both design and technical expertise critical to the ongoing support, maintenance, evolution, and a long term commitment to driving the project and community forward.

Collaborators can be nominated to become members of the Steering Committee following the same nomination and approval model. However, Collaborators cannot nominate themselves for Steering Committee membership. A Contributor cannot be nominated and accepted into the Steering Committee without first having been nominated and accepted as a Collaborator.

### Owners
Fluent Web Owners ("Owners"), having 'admin' access, have ultimate authority and are responsible for management, maintainenance, and operations of repositories.

### Collaborators
Fluent Web Collaborators ("Collaborators"), having 'write' access, have major impact on the project and participate in triaging issues, reviewing code, mentoring, and working to improve and maintain overall architecutural quality.

Contributors can be nominated as Collaborators by Steering Committee members. Once the nomination is approved by the Steering Committee, the invitation to become a Collaborator is extended to the individual. Assuming the individual accepts the invitation and agrees to the terms of DCO (Developer Certificate of Origin) they are granted commit-access to the project.

Nominations for Collaborator status happen through the typical Steering Committee decision making process. That is, to nominate one or more Collaborators, Steering Committee then moves to interview the nominees. The nominee is approved or rejected following the same consensus seeking process for new team members.

### Contributors
Fluent Web Contributors ("Contributors"), having 'read' access, can be any individual who have shown interest by contributing a pull request to the project.

Contributors can self-petition the Steering Committee for Collaborator status by written request to be put on the Steering Committee meeting agenda. In order to be considered however, such self-nominations must be sponsored by an existing Steering Committee member, after which it follows the same process as above. To sponsor a nomination, the Steering Committee member must indicate consent.

## Acceptance and consensus seeking process
Acceptance of contributions (a.k.a. "landing a pull request") follows the consensus seeking decision making model.

All pull requests submitted by Contributors who are not Collaborators must be signed-off on by an existing Collaborator before the PR can be landed. The sponsoring Collaborator becomes responsible for the PR. Pull requests from an existing Collaborator must be signed-off on by at least one other Collaborator.

Before any pull Request is landed, sufficient time should be given to receive input from other Collaborators with sufficient expertise to evaluate the changes. Specifically, at least 3 days during the typical working week and 5 days over weekends should be given to account for international time differences and work schedules. Trivial pull requests may be landed within 2 days.

If it becomes apparent that the changes proposed by a given pull request: (a) have significant impact on the project as a whole; (b) are inherently controversial; or (c) have failed to reach consensus amongst collaborators, the pull request can be elevated for review by attaching a specific tag to the PR ("Steering Committee"). Pull requests that have been flagged for Steering Committee must not be landed until the Steering Committee has had sufficient opportunity to review the issue and render a decision. 

Additionally, maintainers, can [temporarily enable interaction limits](https://help.github.com/articles/limiting-interactions-with-your-repository/) to force a "cool-down" period used during heated discussions.

Specific collaborators or working groups can be requested to review any PR by including their user alias into the PR.

Collaborators sign-off on a pull request by explicitly stating their approval in the PR. If a Collaborator is unsure about the modification or is not prepared to take full responsibility for the change, they should defer to another Collaborator.

Exception to this process is allowed for high-priority changes that address security vulnerabilities. A shorter review period and modified sign-off process may be necessary depending on the nature of the change and severity of the issue. 

## Release quality
The guiding light, at all times, should be the long-term stability, reliability, maintainability, extensability, performance, and ultimately QUALITY as informed through current industry standards and best practices.

* All pull requests should be of production quality, stable, and ready for deployment. 
* Every PR should include updates to release notes, documentation, code comments, and incrementing the current version number.
* After a PR has merged into master a new production build is automatically deployed.

Production errors or bugs with major impact to users, contributors, and/or collaborators, may require shorter review periods and are indicated by the highest priority and severity levels as indicated by an `issue` label with generally immediate action to be taken to rectify, release, and deploy.

### Issue guidance
Well crafted issues improve the speed at which work can be triaged, understood, and completed. It's requested that details be included with each issue.

```
#### Expected behavior 

#### Actual behavior

#### Steps to reproduce the problem

#### Specifications (hardware, software, configurations)
* Include device make, model, OS version: 
* Include browser and version: 
* Include screen orientation: 
* Include screen size: 
* Include page URL: 
* Include localization: 

*Attach any helpful screenshots or videos to expedite the process.*
```

### Pull request guidance
When landing a pull request ("PR"), individuals must modify the original commit message to include comprehenisve details regarding their request. This detail along with other git history meta information deploys as part of the documentation changelog history. The PR process requires the following approvals to help achieve the highest level of quality.

* Approval by at least one collaborator who then assumes all responsibility.

Commit and merge messages take inspiration from [conventional commits](https://conventionalcommits.org/) and have been modified meeting the requirements.

#### Formatting title
**`<type>`** is required to be at least one of the following:
- build: Changes that affect the build system or external dependencies
- docs: Documentation changes
- feat: Adding or changing a feature
- fix: Fixing an issue / bug
- refactor: Architectural changes that do not address a bug or feature
- test: Adding or changing test infrastructure

**`<scope>`** is optionally included when changes impact an area, feature, or package. 
- Use component name (e.g. button, hyperlink)
- Use pattern name (e.g. banner, additional-information)
- Use package name (e.g. fast-development-site)

**`<description>`** is required and speaks to what the user gets from this PR.
- Use single line
- Use lowercase
- Use imperative, present tense (e.g.: fix, not fixes)
- Use single sentence without sentence casing and no period at the end

Accepted title format
```
<type>(<scope>): <description>
```

Example titles
```
feat(button): add a border radius to button
```

#### Formatting messages
Optionally, include more detail in the message.
`<body>` is used to provide clarity and context to the description. 
`<footer>` is used to provide additional metadata about the pull request such as issue fixing (fix #19, close #19, resolve #19).

Accepted message format
```
<body>

<footer>
```

Example message
```
Sequence indicators markup was moved from being located after the slider markup to at the top for improved accessibility because the screen reader can read all of the slide options individually before interacting with the slider.

fix #915,#920
close #213
resolve #429
```

#### Github pull request commenting
Add a comment with the issue number per the [github closing issue keywords](https://help.github.com/articles/closing-issues-using-keywords/)

## Stability policy
The most important consideration in every code change is the impact it will have, positive or negative, on the system (components, pages, applications, tools, and services). To this end, everyone must work collectively to ensure that changes do not needlessly break backwards compatibility, introduce performance or functional regressions, or negatively impact the usability on any users or officially supported partners.

## Developer's Certificate of Origin 1.1
By making a contribution to this project, I certify that:

* a. The contribution was created in whole or in part by me and I have the right to submit it under the open source license indicated in the file; or
* b. The contribution is based upon previous work that, to the best of my knowledge, is covered under an appropriate open source license and I have the right under that license to submit that work with modifications, whether created in whole or in part by me, under the same open source license (unless I am permitted to submit under a different license), as indicated in the file; or
* c. The contribution was provided directly to me by some other person who certified (a), (b) or (c) and I have not modified it.
* d. I understand and agree that this project and the contribution are public and that a record of the contribution (including all personal information I submit with it, including my sign-off) is maintained indefinitely and may be redistributed consistent with this project or the open source license(s) involved.

## Repositories
Some repositories are privately hosted on [Visual Studio Team Services](https://fluentweb.visualstudio.com/Fluent%20Web) and others are publically hosted on [GitHub](https://github.com/Microsoft/fast-dna).

### Private
Projects including intellectual property are only available for contributions by active Microsoft employees and vendors. These repositories are protected by Azure AD (Active Directory) without any additional barriers to access.

For support:
+ Submit [for help](https://stackoverflow.com/questions/tagged/fluent-web)
+ Submit [feature requests](https://fluentweb.visualstudio.com/Fluent%20Web/_workitems?_a=new&witd=Feature)
+ Submit [a bug](https://fluentweb.visualstudio.com/Fluent%20Web/_workitems/create/Bug)
+ Submit [feature questions](https://stackoverflow.microsoft.com/questions/tagged/fluent-web)

These packages that are available on [VSTS](https://fluentweb.visualstudio.com/Fluent%20Web/_packaging?feed=ms.fw&_a=feed) with a `@ms.fw/` namespace prepended.

### Public
Projects that have been released for open source are available on GitHub and anyone can contributue with an active account. Those wishing to collaborate can do so by invitation.

For support:
* Submit [for help](https://stackoverflow.com/questions/tagged/fast-dna) 
* Submit [feature requests](https://github.com/Microsoft/fast-dna/issues/new?labels=feature%20:%20request)
* Submit [feature questions](https://github.com/Microsoft/fast-dna/issues/new?labels=feature%20:%20question)

These packages that are available on [NPM](https://www.npmjs.com/search?q=@microsoft/fast-&page=1&ranking=optimal) with a `@microsoft/fast-` namespace prepended.

## Resources
Aspects of our open source policy have been influenced and in some cases copied from other well respected community projects.
* [Project Governance @Node] : https://nodejs.org/en/about/governance/
* [Contributions @Node] : https://github.com/nodejs/node/blob/master/CONTRIBUTING.md
* [Open Source @Github] : https://github.com/blog/2039-adopting-the-open-code-of-conduct
* [Open Source exmaples @todogroup] : https://github.com/todogroup/policies

## Development workflow
Clone the repository, `cd` into the project, and install [Lerna](https://github.com/lerna/lerna):

```shell
git clone https://github.com/Microsoft/fast-dna.git
cd fast-dna
npm install --global lerna
```

Install all Lerna dependencies:
```shell
lerna bootstrap
```

Each package in FAST-DNA has its own unique requirements and commands, but the following commands are relatively standard across all packages:
- `npm run tslint` or `npm run tslint:fix` runs tslint on all typescript in the project.
- `npm run unit-tests` runs all unit-tests.
- `npm run test` runs all processes required to pass prior to check-in. Generally includes building, linting, and unit-testing.

To run these processes across *all* projects, substitute `lerna` for `npm`. eg, `lerna run test`.