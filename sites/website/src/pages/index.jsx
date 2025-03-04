import React from "react";
import Layout from "@theme/Layout";
import CodeBlock from "@theme-init/CodeBlock";

export default function () {
    return (
        <Layout title="web components" description="FAST web components">
            <div className="frontpage">
                <section className="section">
                    <span className="section-badge">
                        FLEXIBLE, PERFORMANT, & INTUITIVE
                    </span>
                    <svg
                        role="heading"
                        aria-level="2"
                        width="346"
                        height="120"
                        viewBox="0 0 346 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <title>FAST</title>
                        <g clipPath="url(#clip0)">
                            <path
                                d="M161 98H164.5C166.9 98 168.4 96.9 168.8 94.4L173.5 68.1H185.4C187.8 68.1 189.3 67 189.7 64.5L190.1 62.2C190.6 59.4 189.2 57.9 186.5 57.9H175.3L178.7 38.2H193.7C196.1 38.2 197.6 37.1 198 34.6L198.4 32.3C198.9 29.5 197.5 28 194.8 28H172.6C170.2 28 168.7 29.1 168.3 31.6L157.4 93.7C156.9 96.5 158.3 98 161 98ZM235.603 32C235.603 29.5 234.003 28 231.503 28H224.303C222.003 28 220.503 29.1 219.703 31.2L197.303 93.4C196.303 96.1 197.603 98 200.503 98H203.703C206.003 98 207.503 96.9 208.203 94.7L212.303 82.4H225.203L225.003 94C225.003 96.7 226.303 98 228.903 98H232.403C235.003 98 236.403 96.7 236.403 94L235.603 32ZM215.503 72.8L225.903 41.7L225.403 72.8H215.503ZM292.812 49.4L294.212 41.6C296.112 31.2 288.212 27.2 279.612 27.2H279.412C268.812 27.2 261.512 31.2 259.612 41.6L258.012 50.8C256.912 57 260.812 61.4 266.212 64.8L273.512 69.4C276.612 71.3 277.512 73.3 276.812 77.1L275.812 82.6C275.112 86.9 272.212 88.8 268.712 88.8C265.212 88.8 263.112 86.9 263.812 82.6L264.912 76.3C265.412 73.5 264.012 72 261.312 72H258.012C255.612 72 254.012 73.2 253.612 75.6L252.112 84.2C250.212 95.1 257.312 98.8 266.912 98.8H267.112C278.712 98.8 285.012 95 286.912 84.2L288.712 74.1C290.012 67 286.612 64 280.412 60.1L273.012 55.5C270.012 53.6 269.312 51.6 269.912 48L270.812 43.2C271.512 38.8 274.312 37.2 277.712 37.2C281.112 37.2 283.312 38.8 282.612 43.2L281.612 48.7C281.112 51.5 282.512 53 285.212 53H288.512C290.912 53 292.412 51.9 292.812 49.4ZM341.418 28H314.518C312.118 28 310.618 29.1 310.218 31.6L309.818 33.9C309.318 36.7 310.718 38.2 313.418 38.2H320.718L311.018 93.7C310.518 96.5 311.918 98 314.618 98H318.118C320.518 98 322.018 96.9 322.418 94.4L332.318 38.2H340.318C342.718 38.2 344.218 37.1 344.618 34.6L345.018 32.3C345.518 29.5 344.118 28 341.418 28Z"
                                fill="#F9F9F9"
                            />
                            <path
                                d="M57.3155 69.2971L66.3983 66.7923C68.2775 66.1661 69.2171 64.6006 68.9039 62.722C68.5907 60.8434 66.7115 59.9041 64.8323 60.2172L55.7495 62.722C53.8703 63.3482 52.9307 64.9137 53.2439 66.7923C53.5571 68.6709 55.4363 69.9233 57.3155 69.2971Z"
                                fill="#E1477E"
                            />
                            <path
                                d="M47.606 68.6709C47.2928 66.7923 45.4136 65.853 43.5345 66.1661L2.50537 77.4377C0.626179 78.0639 -0.313418 79.6294 -0.000218954 81.508C0.31298 83.3866 2.19217 84.3259 4.07137 84.0128L45.1004 72.7412C46.9796 72.115 47.9192 70.2364 47.606 68.6709Z"
                                fill="#E1477E"
                            />
                            <path
                                d="M78.2999 63.9744L90.8279 60.5303C92.7071 59.9042 93.6466 58.3387 93.3334 56.4601C93.0202 54.5815 91.1411 53.6422 89.2619 53.9553L76.7339 57.3994C74.8547 58.0256 73.9151 59.5911 74.2283 61.4696C74.5415 63.3482 76.4207 64.2875 78.2999 63.9744Z"
                                fill="#E1477E"
                            />
                            <path
                                d="M139.346 43.3144C136.211 32.0794 124.926 25.2136 113.641 28.3344C113.014 28.3344 112.701 28.6465 112.074 28.9586C100.475 15.227 81.98 8.67324 63.7984 13.6666C45.9303 18.6599 33.0779 33.0157 29.3161 50.4923C29.0027 52.6769 27.4353 54.2373 25.241 54.8614L9.56721 59.2306C7.68635 59.8548 6.74593 61.4152 7.0594 63.2877C7.37288 65.1602 9.25373 66.0964 11.1346 65.7843L47.4977 55.7977C49.3786 55.1735 50.319 53.6131 50.0055 51.7406C49.692 49.8681 47.8112 48.9319 45.9303 49.244L43.736 49.8681C39.9743 50.8044 36.5261 47.6836 38.0935 43.9386C43.1091 32.7036 52.8268 23.6532 65.3658 20.2203C80.4126 16.1632 96.0864 21.1566 106.118 32.0794C99.5346 37.0728 96.3999 45.8111 98.5942 54.5494C100.789 63.2877 107.998 69.2172 116.149 70.1535C113.014 85.1334 101.729 97.9288 86.3687 101.986C75.0835 105.107 62.858 102.61 53.1403 96.3684C49.692 94.1838 51.2594 89.5026 55.0211 88.2543L75.397 82.6368C77.2779 82.0126 78.2183 80.4522 77.9048 78.5797C77.5913 76.7072 75.7105 75.771 73.8296 76.0831L34.3318 87.0059C32.4509 87.6301 31.5105 89.1905 31.824 91.063C32.1374 92.9355 34.0183 93.8718 35.8991 93.5597H36.2126C38.0935 92.9355 40.2878 93.5597 41.8552 95.1201C53.4537 107.291 71.3218 113.221 88.8765 108.228C107.371 103.234 120.537 87.6301 123.672 69.8414C123.986 69.8414 124.613 69.8414 124.926 69.5293C135.584 66.4085 142.167 54.8615 139.346 43.3144ZM118.97 63.9118C110.82 63.9118 103.923 57.3581 103.923 48.9319C103.923 40.5057 110.82 33.9519 118.97 33.9519C127.12 33.9519 134.017 40.5057 134.017 48.9319C134.017 57.3581 127.434 63.9118 118.97 63.9118Z"
                                fill="#E1477E"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0">
                                <rect width="346" height="120" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>

                    <p className="section-paragraph">
                        FAST is dedicated to providing support for native Web Components
                        and modern Web Standards, designed to help you efficiently tackle
                        some of the most common challenges in website and application
                        design and development.
                    </p>
                    <p className="section-paragraph">
                        For an in-depth explanation of FAST,{" "}
                        <a href="https://www.fast.design/docs/introduction/">
                            see our docs introduction
                        </a>
                        .
                    </p>
                </section>

                <div role="separator" className="section-decoration"></div>

                <section className="section">
                    <span className="section-badge">HOW TO</span>
                    <h2 className="section-heading">Getting Started</h2>
                    <h3>Install the package</h3>
                    <CodeBlock>npm install @microsoft/fast-element</CodeBlock>

                    <h3>Create a web component</h3>
                    <CodeBlock language="typescript">
                        {`/*
 * import utilities from @microsoft/fast-element
 */
import { attr, css, FASTElement, html } from "@microsoft/fast-element";

/*
 * Define your component logic
 */
class HelloWorld extends FASTElement {
  @attr
  name: string;
}

/*
 * Define your component for the browser and
 * include your CSS styles and HTML template
 */
HelloWorld.define({
  name: "hello-world",
  template: html\`<span>Hello \${x => x.name}!</span>\`,
  styles: css\`
    span {
      color: red;
    }
  \`,
});`}
                    </CodeBlock>

                    <h3>Add it to your project</h3>
                    <CodeBlock language="html">
                        {`<hello-world name="Earth"></hello-world>`}
                    </CodeBlock>
                </section>

                <div role="separator" className="section-decoration"></div>

                <section className="section">
                    <span className="section-badge">FULLY INTEGRATED</span>
                    <h2 className="section-heading">Works with existing frameworks</h2>
                    <p className="section-paragraph">
                        Standards-based Web Components are compatible with almost any
                        modern web framework.
                    </p>
                </section>

                <div role="separator" className="section-decoration"></div>

                <section className="section">
                    <span className="section-badge">BUILT ON FAST</span>
                    <h2 className="section-heading">Showcase</h2>
                    <div className="section-showcase">
                        <a
                            className="section-showcase-item-link"
                            rel="noopener noreferrer"
                            href="https://docs.microsoft.com/en-us/fluent-ui/web-components/"
                        >
                            <span className="section-showcase-item">
                                <svg
                                    width="47"
                                    height="82"
                                    viewBox="0 0 47 82"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M22.1562 1.06277L1.84846 12.7679C0.704757 13.4271 0 14.6468 0 15.9669V67.0331C0 68.3532 0.704757 69.5729 1.84846 70.2321L21.2319 81.4045C22.4627 82.1139 24 81.2256 24 79.805V55.3333L45.225 43.0995C46.4573 42.3892 46.4573 40.6108 45.225 39.9005L24 27.6667L45.225 15.4328C46.4573 14.7225 46.4573 12.9441 45.225 12.2339L25.8438 1.06277C24.7026 0.40498 23.2974 0.404979 22.1562 1.06277Z"
                                        fill="white"
                                    ></path>
                                </svg>
                            </span>
                            <p>Fluent UI</p>
                        </a>
                    </div>
                </section>

                <div role="separator" className="section-decoration"></div>

                <section className="section">
                    <span className="section-badge">LEARN, MODIFY, AND FOLLOW</span>
                    <h2 className="section-heading">Joining the Community</h2>
                    <p className="section-paragraph">
                        Looking to get answers to questions or engage with us in realtime?
                        Our community is most active{" "}
                        <a href="https://discord.gg/FcSNfg4">on Discord</a>. Submit
                        requests and issues on{" "}
                        <a href="https://github.com/Microsoft/fast/issues/new/choose">
                            GitHub
                        </a>
                        , or join us by contributing on{" "}
                        <a href="https://github.com/Microsoft/fast/labels/community:good-first-issue">
                            some good first issues via GitHub
                        </a>
                        .
                    </p>
                    <p className="section-paragraph">
                        Get started here with the{" "}
                        <a href="https://www.fast.design/docs/community/contributor-guide">
                            Contributor Guide
                        </a>
                        .
                    </p>
                    <p className="section-paragraph">
                        We look forward to building an amazing open source community with
                        you!
                    </p>
                    <h2>Contact</h2>
                    <ul>
                        <li>
                            Join the community and chat with us in real-time on{" "}
                            <a href="https://discord.gg/FcSNfg4">Discord</a>.
                        </li>
                        <li>
                            Submit requests and issues on{" "}
                            <a href="https://github.com/Microsoft/fast/issues/new/choose">
                                GitHub
                            </a>
                            .
                        </li>
                        <li>
                            Contribute by helping out on some of our recommended first
                            issues on{" "}
                            <a href="https://github.com/Microsoft/fast/labels/community:good-first-issue">
                                GitHub
                            </a>
                            .
                        </li>
                    </ul>
                </section>
            </div>
        </Layout>
    );
}
