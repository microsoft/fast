# Implementation

## Implementation example
```javascript

<!-- Returns <img />-->
<Media 
    src='https://placehold.it/539x300/2F2F2F/171717'
    alt='Placeholder with grey background and dimension watermark without any imagery'
/>

<!-- Returns <img /> using SrcSet-->
<Media 
    src='https://placehold.it/539x300/2F2F2F/171717'
    srcSet='https://placehold.it/2048x600/2F2F2F/171717 2048w, 
            https://placehold.it/1778x600/2F2F2F/171717 1778w,
            https://placehold.it/1399x600/2F2F2F/171717 1399w,
            https://placehold.it/1083x500/2F2F2F/171717 1803w,
            https://placehold.it/767x400/2F2F2F/171717 767w,
            https://placehold.it/539x300/2F2F2F/171717 539w'
    sizes='100vw'
    alt='Placeholder with grey background and dimension watermark without any imagery'
/>

<!-- Returns <picture />-->
<Media 
    pictureSrcSet='https://placehold.it/2048x600/2F2F2F/171717 2048px, 
                   https://placehold.it/1778x600/2F2F2F/171717 1778px,
                   https://placehold.it/1399x600/2F2F2F/171717 1399px,
                   https://placehold.it/1083x500/2F2F2F/171717 1803px,
                   https://placehold.it/767x400/2F2F2F/171717 767px,
                   https://placehold.it/539x300/2F2F2F/171717 539px'
    alt='Placeholder with grey background and dimension watermark without any imagery'
/>

```