/**
 * Breakpoints
 */
const vp0Value: number = 0;
const vp1Value: number = 320;
const vp2Value: number = 540;
const vp3Value: number = 768;
const vp4Value: number = 1024;
const vp5Value: number = 1400;
const vp6Value: number = 1779;
const vpMax: number = 2048;

const breakpoints: any = {
    vp0Value,
    vp1Value,
    vp2Value,
    vp3Value,
    vp4Value,
    vp5Value,
    vp6Value,
    vpMaxValue: vpMax,
    vp0: `${vp0Value}px`,
    vp1: `${vp1Value}px`,
    vp2: `${vp2Value}px`,
    vp3: `${vp3Value}px`,
    vp4: `${vp4Value}px`,
    vp5: `${vp5Value}px`,
    vp6: `${vp6Value}px`,
    vpMin: `${vp1Value}px`,
    vp0Max: `${vp1Value - 1}px`,
    vp1Max: `${vp2Value - 1}px`,
    vp2Max: `${vp3Value - 1}px`,
    vp3Max: `${vp4Value - 1}px`,
    vp4Max: `${vp5Value - 1}px`,
    vp5Max: `${vp6Value - 1}px`,
    vp6Max: `${vpMax}px`
};

export { breakpoints };
