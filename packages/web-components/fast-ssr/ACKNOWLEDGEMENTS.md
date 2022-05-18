# Acknowledgements
A big thank you to [Lit](https://github.com/lit) for their work on server-side rendering for Web Components. This package builds off the ideas and tentative community protocols proposed and implemented in [@lit-labs/ssr](https://github.com/lit/lit/tree/main/packages/labs/ssr), with the goal of aligning `@microsoft/fast-ssr` to these community protocols as they mature.

Several modules have been copied with some modification from [@lit-labs/ssr](https://github.com/lit/lit/tree/main/packages/labs/ssr). Our hope is that as these protocols mature, these files can be removed and common resources leveraged instead. The following list of files have been copied / modified:
- [./src/element-renderer/element-renderer.ts]()
- [./src/template-parser/template-parser.ts]()
- [./src/escape-html.ts]()
- [./src/dom-shim.ts]()
- [./src/render-info.ts]()

and written with the following [license](https://github.com/lit/lit/blob/main/packages/labs/ssr/LICENSE):

---
BSD 3-Clause License

Copyright (c) 2019 Google LLC. All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.