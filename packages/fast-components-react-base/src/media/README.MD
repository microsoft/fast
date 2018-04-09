# Implementation

## Implementation example
```javascript

<!-- Returns <img />-->
<Media 
    src='https://placehold.it/539x300/2F2F2F/171717'
    alt='Placeholder with grey background and dimension watermark without any imagery'
/>

<!-- Returns <img /> using SrcSet-->
const srSet = [
    {
        srcSet: "https://placehold.it/1399x600/2F2F2F/171717 1399w"
    },
    {
        srcSet: "https://placehold.it/1083x500/2F2F2F/171717 1083w"
    },
    {
        srcSet: "https://placehold.it/767x400/2F2F2F/171717 767w"
    },
    {
        srcSet: "https://placehold.it/539x300/2F2F2F/171717 0w"
    }
]

<Media 
    src='https://placehold.it/539x300/2F2F2F/171717'
    mediaSrcSet={srcSet}
    sizes='100vw'
    alt='Placeholder with grey background and dimension watermark without any imagery'
/>

<!-- Returns <picture />-->
const srSet = [
    {
        srcSet: "https://placehold.it/1399x600/2F2F2F/171717",
        minWidth: "1399px"
    },
    {
        srcSet: "https://placehold.it/1083x500/2F2F2F/171717",
        minWidth: "1083px"
    },
    {
        srcSet: "https://placehold.it/767x400/2F2F2F/171717",
        minWidth: "767px"
    },
    {
        srcSet: "https://placehold.it/539x300/2F2F2F/171717",
        minWidth: "0px"
    }
]

<Media 
    mediaSrcSet={srcSet}
    alt='Placeholder with grey background and dimension watermark without any imagery'
/>

```