/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return `${baseUrl}docs/${language ? `${language}/` : ''}${doc}`;
}

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        { <section className="sitemap">
           {/* <a href={this.props.config.baseUrl} className="nav-home"> 
            {this.props.config.footerIcon && (
              <img
                className="footer-logo"
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a> */}
          <div>
            <h5>Documentation</h5>
            <a href={this.docUrl('contributing/install', this.props.language)}>
              Install
            </a>
          </div>
          <div>
            <h5>Community</h5>
            <a
              href="http://stackoverflow.com/questions/tagged/fast-dna"
              target="_blank"
              rel="noreferrer noopener">
              Stack Overflow
            </a>
            <a
              href="https://discord.gg/FcSNfg4"
              target="_blank"
              rel="noreferrer noopener">
              Discord
            </a>
            <a
              href="https://twitter.com/FAST_DNA"
              target="_blank"
              rel="noreferrer noopener">
              Twitter
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a
              href="https://medium.com/fast-dna"
              target="_blank"
              rel="noreferrer noopener">
              Blog
            </a>
            <a 
              href="https://github.com/Microsoft/fast-dna"
              target="_blank">
              GitHub
            </a>
            <a
              className="github-button"
              href="https://github.com/microsoft/fast-dna"
              data-icon="octicon-star"
              data-count-href="/facebook/docusaurus/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star microsoft/fast-dna on GitHub">
              Star
            </a>
          </div>
        </section>


      }
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
