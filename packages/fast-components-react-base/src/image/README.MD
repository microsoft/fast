# Implementation

## Implementation example
```javascript

<!-- Returns <img />-->
<Image 
    src='https://placehold.it/539x300/2F2F2F/171717'
    alt='Placeholder with grey background and dimension watermark without any imagery'
/>

<!-- Returns <img /> using SrcSet-->
<Image 
    src='https://placehold.it/539x300/2F2F2F/171717'
    srcSet='https://placehold.it/1399x600/2F2F2F/171717 1399w, https://placehold.it/1083x500/2F2F2F/171717 1083w, https://placehold.it/767x400/2F2F2F/171717 767w'
    sizes='100vw'
    alt='Placeholder with grey background and dimension watermark without any imagery'
/>

<!-- Returns <picture />-->
<Image
    vp6='http://placehold.it/2048x600/2F2F2F/171717'
    vp5='http://placehold.it/1778x600/2F2F2F/171717'
    vp4='http://placehold.it/1399x600/2F2F2F/171717'
    vp3='http://placehold.it/1083x500/2F2F2F/171717'
    vp2='http://placehold.it/767x400/2F2F2F/171717'
    vp1='http://placehold.it/539x300/2F2F2F/171717'
    alt='Placeholder with grey background and dimension watermark without any imagery'
/>

```