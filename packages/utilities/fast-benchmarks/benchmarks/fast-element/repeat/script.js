import baseJson from "./base.js";

(() => {
    const BASIC_TEMPLATES = ["basic", "basicNoRecycle"];
    const NESTED_TEMPLATES = ["nested", "nestedNoRecycle"];
    const queryParams = {
        basic: [],
        basicNoRecycle: [],
        nested: [],
        nestedNoRecycle: [],
    };
    const addQueries = (source, dest) => {
        for (const clickEvent in source) {
            for (let i = 0; i < source[clickEvent].length; i++) {
                const option = [`ce=${clickEvent}`];
                const variation = source[clickEvent][i];
                for (const count in variation) {
                    option.push(`${count}=${variation[count]}`);
                }
                dest.push(option);
            }
        }
        return dest;
    };

    for (const templateType in baseJson) {
        const isNested = templateType.toLowerCase().includes("nested");
        if (isNested) {
            NESTED_TEMPLATES.forEach(template => {
                addQueries(baseJson.nested, queryParams[template]);
            });
        } else {
            BASIC_TEMPLATES.forEach(template => {
                addQueries(baseJson.basic, queryParams[template]);
            });
        }
    }
    process.stdout.write(JSON.stringify(queryParams));
})();
