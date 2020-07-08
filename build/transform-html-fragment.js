const onlySpace = /^\s+$/g;
const spaceBetforeTagClose = /\s+(>)/g;
const spaceBetweenTags = /(>)\s+(<)/g;
const spaceBetweenAttrs = /(["'\w])(?!\s*>)\s+/g;
const openEnded = /(?:[^="'\w])?(["'\w])\s*$/g;

export default function transformHTMLFragment(data) {
    // if the chunk is only space, collapse and return it
    if (data.match(onlySpace)) {
        return data.replace(onlySpace, " ");
    }

    // remove space before tag close
    data = data.replace(spaceBetforeTagClose, "$1");

    // remove space between tags
    data = data.replace(spaceBetweenTags, "$1$2");

    // remove space between attributes
    data = data.replace(spaceBetweenAttrs, "$1 ");

    if (data.match(openEnded)) {
        return data.trimStart();
    }

    return data.trim();
}
