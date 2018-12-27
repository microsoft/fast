# Contributing to FAST-DNA

## Getting started

### Installing

Once the repo has been cloned, install Lerna:

```bash
npm install -g lerna
```

Install dependencies in the root directory:

```bash
npm install
```

Install dependencies for packages within the project:

```bash
lerna bootstrap
```

Learn more about [installing](https://microsoft.github.io/fast-dna/docs/en/contributing/install).

### Testing

Run all tests for all packages:

```bash
lerna run test
```

Learn more about [testing](https://microsoft.github.io/fast-dna/docs/en/contributing/testing).

### Submitting a pull request

Before submitting a pull request, [rebase](https://www.atlassian.com/git/tutorials/merging-vs-rebasing) your branch from master. Do not use ``git merge`` or the *merge* button provided by Github.

Learn more about [submitting pull requests](https://microsoft.github.io/fast-dna/docs/en/contributing/working).

## Contribution policy

A “Contribution” is any work that is voluntarily submitted to a project. This work may be code, documentation, design, answering questions, or even triaging issues.

Most contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us the rights to use your contribution. For details, visit [https://cla.microsoft.com](https://cla.microsoft.com).

Many contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to grant and do grant the rights to use your contribution. For details, visit [https://cla.microsoft.com](https://cla.microsoft.com).

## Guiding principles

Contributors work in concert with one another on behalf of the community of users who build web applications and sites. Contributors must demonstrate an ongoing commitment, not only to the project, but to the stability and vitality of the community as a whole. Once demonstrated, contributors may become collaborators. Before any contribution can be accepted into the project, it requires a review by existing collaborators in accordance to the established guidelines and policies. Over time, collaborators may become members of the steering committee.  The steering committee is made up of industry experts, key partners, stakeholders, and visionaries that have a common set of shared objectives and principles.

## Guiding principle

Owners, the steering committee, collaborators, code owners, and contributors work in concert with one another on behalf of the FAST-DNA community and prioritize the communities interests over their own.

The development, release, and work management processes must reflect this principle. Accepting contributions to the project requires a review by collaborators.

## Governance

### Steering Committee

Membership for the Steering Committee consists of key Collaborators who have demonstrated both design and technical expertise critical to the ongoing support, maintenance, evolution, and a long term commitment to driving the project and community forward.

Collaborators can be nominated to become members of the Steering Committee following the same nomination and approval model. However, Collaborators cannot nominate themselves for Steering Committee membership. A Contributor cannot be nominated and accepted into the Steering Committee without first having been nominated and accepted as a Collaborator.

### Owners

Membership for Owners, having 'admin' access, have ultimate authority and are responsible for management, maintainenance, and operations of repositories.

### Collaborators

Membership for Collaborators, having 'write' access, have major impact on the project and participate in triaging issues, reviewing code, mentoring, and working to improve and maintain overall architectural quality.

*Owners* have admin access and are responsible for the management, maintenance, and operations of repositories.

#### Code Owners

Collaborators can become a Code Owner for a specific package(s). They have the ability to approve a pull request that has made changes in those package(s) and at least one Code Owner will be required for any package.

### Contributors

Membership for Contributors, having 'read' access, can be any individual who have shown interest by contributing a pull request to the project.

As subject matter experts, *code owners* approve pull requests on the packages they own. There is a required minimum of one code owner for each package. *Code owners* are listed in [CODEOWNERS](.github/CODEOWNERS).

## Acceptance and consensus seeking process

Acceptance of contributions (a.k.a. "landing a pull request") follows the consensus seeking decision making model.

*Contributors* have read access and can be anyone who has contributed a completed pull request to the project.

### Nominations & appointments

If it becomes apparent that the changes proposed by a given pull request: (a) have significant impact on the project as a whole; (b) are inherently controversial; or (c) have failed to reach consensus amongst collaborators, the pull request can be elevated for review by attaching a specific tag to the PR ("Steering Committee"). Pull requests that have been flagged for Steering Committee must not be landed until the Steering Committee has had sufficient opportunity to review the issue and render a decision.

## Acceptance and consensus seeking process

Acceptance of contributions follows the consensus-seeking process.

All pull requests must be approved by a *collaborator* before the pull request can be accepted.

Exception to this process is allowed for high-priority changes that address security vulnerabilities. A shorter review period and modified sign-off process may be necessary depending on the nature of the change and severity of the issue.

## Release policy

The guiding light, at all times, should be the long-term stability, reliability, maintainability, extensibility, performance, and ultimately quality, as informed by current industry standards and best practices.

* Pull requests should be of production quality, stable, and ready for deployment.
* Pull requests should include updates to release notes, documentation, code comments.

Specific *collaborators* or *code owners*  can be added to a pull request by including their user alias.

## Stability policy

The most important consideration in every code change is the impact it will have, positive or negative, on the system (components, pages, applications, tools, and services). To this end, everyone must work collectively to ensure that changes do not needlessly break backwards compatibility, introduce performance or functional regressions, or negatively impact the usability on any users or officially supported partners.

## Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

* a. The contribution was created in whole or in part by me and I have the right to submit it under the open source license indicated in the file; or
* b. The contribution is based upon previous work that, to the best of my knowledge, is covered under an appropriate open source license and I have the right under that license to submit that work with modifications, whether created in whole or in part by me, under the same open source license (unless I am permitted to submit under a different license), as indicated in the file; or
* c. The contribution was provided directly to me by some other person who certified (a), (b) or (c) and I have not modified it.
* d. I understand and agree that this project and the contribution are public and that a record of the contribution (including all personal information I submit with it, including my sign-off) is maintained indefinitely and may be redistributed consistent with this project or the open source license(s) involved.

## Resources

Aspects of our open source policy have been influenced from other well respected community projects:

* [Project Governance @Node](https://nodejs.org/en/about/governance/)
* [Contributions @Node](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md)
* [Open Source @Github](https://github.com/blog/2039-adopting-the-open-code-of-conduct)
* [Open Source exmaples @todogroup](https://github.com/todogroup/policies)
