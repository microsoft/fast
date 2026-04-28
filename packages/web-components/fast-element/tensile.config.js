const config = {
    // Browsers to test against
    browsers: ['chrome'],

    // Importmaps for your test.
    // See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap
    imports: {
        '@tensile-perf/web-components': '/node_modules/@tensile-perf/web-components/lib/index.js',
    }
  };

  export default config;
