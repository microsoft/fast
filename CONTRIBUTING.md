# Contribution policy
A “Contribution” is any work that is voluntarily submitted to a project. This work may be code, documentation, design, answering questions, or even triaging issues.

Most contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions provided by the bot. You will only need to do this once across all repos using our CLA.

## Guiding principles
Contributors work in concert with one another on behalf of the community of users who build web applications and sites. Contributors must demonstrate an ongoing commitment, not only to the project, but to the stability and vitality of the community as a whole. Once demonstrated, contributors may become collaborators. Before any contribution can be accepted into the project, it requires a review by existing collaborators in accordance to the established guidelines and policies. Over time, collaborators may become members of the steering committee.  The steering committee is made up of industry experts, key partners, stakeholders, and visionaries that have a common set of shared objectives and principles.

It is vital that users trust the contributors to have their best interests in mind while making decisions affecting the overall direction. This means having defined guidelines, a clear roadmap, and a predictable release schedule.

Adoption of new capabilities and features must be carefully balanced by the expressed needs of the users and the community. Change for the sake of change must be avoided.

In order to best serve the community as a whole, the development, release, and work management processes must reflect these guiding principles.

## Governance
### Steering Committee
Membership for the Steering Committee consists of key Collaborators who have demonstrated both design and technical expertise critical to the ongoing support, maintenance, evolution, and a long term commitment to driving the project and community forward.

Collaborators can be nominated to become members of the Steering Committee following the same nomination and approval model. However, Collaborators cannot nominate themselves for Steering Committee membership. A Contributor cannot be nominated and accepted into the Steering Committee without first having been nominated and accepted as a Collaborator.

### Owners
Membership for Owners, having 'admin' access, have ultimate authority and are responsible for management, maintainenance, and operations of repositories.

### Collaborators
Membership for Collaborators, having 'write' access, have major impact on the project and participate in triaging issues, reviewing code, mentoring, and working to improve and maintain overall architectural quality.

Contributors can be nominated as Collaborators by Steering Committee members. Once the nomination is approved by the Steering Committee, the invitation to become a Collaborator is extended to the individual. Assuming the individual accepts the invitation and agrees to the terms of DCO (Developer Certificate of Origin) they are granted commit-access to the project.

Nominations for Collaborator status happen through the typical Steering Committee decision making process. That is, to nominate one or more Collaborators, Steering Committee then moves to interview the nominees. The nominee is approved or rejected following the same consensus seeking process for new team members.

#### Code Owners
Collaborators can become a Code Owner for a specific package(s). They have the ability to approve a pull request that has made changes in those package(s) and at least one Code Owner will be required for any package.

Collaborators can be nominated as a Code Owner for a specific package by Steering Committee members and will go through the same process that a Contributor does to become a Collaborator.

##### Expectations of owners
Owners should:
- Be providing valuable, high-quality reviews and feedback.
- Have submitted substantial and non-trivial changes to the package/filetype they are assigned to.
- Have the bandwidth to do code reviews in a timely manner.

The current list of Code Owners is located in [CODEOWNERS](.github/CODEOWNERS).

### Contributors
Membership for Contributors, having 'read' access, can be any individual who have shown interest by contributing a pull request to the project.

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

## Release policy
The guiding light, at all times, should be the long-term stability, reliability, maintainability, extensibility, performance, and ultimately quality, as informed by current industry standards and best practices.

* Pull requests should be of production quality, stable, and ready for deployment. 
* Pull requests should include updates to release notes, documentation, code comments.

Production errors or bugs with major impact to users, contributors, and/or collaborators, may require shorter review periods and are indicated by the highest priority and severity levels as indicated by an `issue` label with generally immediate action to be taken to rectify, release, and deploy.

## Stability policy
The most important consideration in every code change is the impact it will have, positive or negative, on the system (components, pages, applications, tools, and services). To this end, everyone must work collectively to ensure that changes do not needlessly break backwards compatibility, introduce performance or functional regressions, or negatively impact the usability on any users or officially supported partners.

## Developer's Certificate of Origin 1.1
By making a contribution to this project, I certify that:

* a. The contribution was created in whole or in part by me and I have the right to submit it under the open source license indicated in the file; or
* b. The contribution is based upon previous work that, to the best of my knowledge, is covered under an appropriate open source license and I have the right under that license to submit that work with modifications, whether created in whole or in part by me, under the same open source license (unless I am permitted to submit under a different license), as indicated in the file; or
* c. The contribution was provided directly to me by some other person who certified (a), (b) or (c) and I have not modified it.
* d. I understand and agree that this project and the contribution are public and that a record of the contribution (including all personal information I submit with it, including my sign-off) is maintained indefinitely and may be redistributed consistent with this project or the open source license(s) involved.

## Resources
Aspects of our open source policy have been influenced from other well respected community projects.
* [Project Governance @Node] : https://nodejs.org/en/about/governance/
* [Contributions @Node] : https://github.com/nodejs/node/blob/master/CONTRIBUTING.md
* [Open Source @Github] : https://github.com/blog/2039-adopting-the-open-code-of-conduct
* [Open Source exmaples @todogroup] : https://github.com/todogroup/policies
