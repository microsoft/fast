// /**
//  * Define common prefix
//  */
// const prefix = `o-pad-`;

// export type SpacingBaseline = 3 | 6;

// export interface IVerticalSpacing {
//     top?: SpacingBaseline;
//     bottom?: SpacingBaseline;
// }

// export interface IHorizontalSpacing {
//     left?: SpacingBaseline;
//     right?: SpacingBaseline;
// }

// /**
//  * Returns a string with the proper vertical spacing class name (or names)
//  */
// export function generateVerticalSpacingClassNames(spacings: IVerticalSpacing | boolean): string {
//     let classNames = '';

//     if (spacings === false) {
//         classNames += `${prefix}0x-top-0x-bottom`;
//     } else if (typeof spacings === 'object') { 
//         if (typeof spacings.top !== 'undefined') {
//             classNames += `${prefix}${spacings.top}x-top`;
//         }

//         if (typeof spacings.bottom !== 'undefined') {
//             classNames += `${classNames === '' ? '' : ' '}${prefix}${spacings.bottom}x-bottom`;
//         }
//     }

//     return classNames;
// }

// /**
//  * Returns a string with the proper horizontal spacing class name (or names)
//  */
// export function generateHorizontalSpacingClassNames(spacings: IHorizontalSpacing | boolean): string {
//     let classNames = '';

//     if (spacings === false) {
//         classNames += `${prefix}0x-left-0x-right`;
//     } else if (typeof spacings === 'object') { 
//         if (typeof spacings.left !== 'undefined') {
//             classNames += `${prefix}${spacings.left}x-left`;
//         }

//         if (typeof spacings.right !== 'undefined') {
//             classNames += `${classNames === '' ? '' : ' '}${prefix}${spacings.right}x-right`;
//         }
//     }

//     return classNames;
// }