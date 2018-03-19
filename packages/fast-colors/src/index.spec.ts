import { variants } from './index';
import AccentColor from './original';

const fixtures = [
    {
        "source": "#ffb900",
        "variations": [
            "#ffe595",
            "#ffd763",
            "#ffc832",
            "#ffb900",
            "#d69600",
            "#ac7300",
            "#835000"
        ]
    },
    {
        "source": "#e74856",
        "variations": [
            "#ffb7be",
            "#f7929b",
            "#ef6d79",
            "#e74856",
            "#c5303f",
            "#a31828",
            "#810111"
        ]
    },
    {
        "source": "#0078d7",
        "variations": [
            "#93cffc",
            "#62b2ef",
            "#3195e3",
            "#0078d7",
            "#005dba",
            "#00439d",
            "#012881"
        ]
    },
    {
        "source": "#0099bc",
        "variations": [
            "#8edcee",
            "#5fc6dd",
            "#2fafcd",
            "#0099bc",
            "#007ca0",
            "#005e84",
            "#004168"
        ]
    },
    {
        "source": "#7a7574",
        "variations": [
            "#cfcdcd",
            "#b2afaf",
            "#969292",
            "#7a7574",
            "#5e5a59",
            "#433f3f",
            "#272524"
        ]
    },
    {
        "source": "#767676",
        "variations": [
            "#cdcdcd",
            "#b0b0b0",
            "#939393",
            "#767676",
            "#5b5b5b",
            "#404040",
            "#262626"
        ]
    },
    {
        "source": "#ff8c00",
        "variations": [
            "#ffd396",
            "#ffbb64",
            "#ffa432",
            "#ff8c00",
            "#d76c00",
            "#af4c00",
            "#872b00"
        ]
    },
    {
        "source": "#e81123",
        "variations": [
            "#ffa2ac",
            "#f7727e",
            "#f04151",
            "#e81123",
            "#c50b18",
            "#a3060c",
            "#800001"
        ]
    },
    {
        "source": "#0063b1",
        "variations": [
            "#94c7ee",
            "#63a6d9",
            "#3184c5",
            "#0063b1",
            "#004d99",
            "#003782",
            "#01216a"
        ]
    },
    {
        "source": "#2d7d9a",
        "variations": [
            "#a2d2e3",
            "#7bb6cb",
            "#5499b2",
            "#2d7d9a",
            "#1e6383",
            "#0f486c",
            "#012e54"
        ]
    },
    {
        "source": "#5d5a58",
        "variations": [
            "#c3c2c1",
            "#a1a09e",
            "#7f7d7b",
            "#5d5a58",
            "#474543",
            "#32302f",
            "#1c1b1a"
        ]
    },
    {
        "source": "#4c4a48",
        "variations": [
            "#bdbcbb",
            "#989695",
            "#72706e",
            "#4c4a48",
            "#3a3937",
            "#282726",
            "#161615"
        ]
    },
    {
        "source": "#f7630c",
        "variations": [
            "#ffc39c",
            "#fca36c",
            "#fa833c",
            "#f7630c",
            "#d14708",
            "#ab2a04",
            "#850e00"
        ]
    },
    {
        "source": "#ea005e",
        "variations": [
            "#ff9cc5",
            "#f868a3",
            "#f13480",
            "#ea005e",
            "#c80047",
            "#a50031",
            "#83001a"
        ]
    },
    {
        "source": "#8e8cd8",
        "variations": [
            "#d4d3fc",
            "#bdbcf0",
            "#a5a4e4",
            "#8e8cd8",
            "#6b6dba",
            "#484f9d",
            "#25307f"
        ]
    },
    {
        "source": "#00b7c3",
        "variations": [
            "#8de8ee",
            "#5ed7e0",
            "#2fc7d1",
            "#00b7c3",
            "#0097a3",
            "#007783",
            "#005663"
        ]
    },
    {
        "source": "#68768a",
        "variations": [
            "#c1cde0",
            "#a3b0c3",
            "#8693a7",
            "#68768a",
            "#465c77",
            "#234263",
            "#012950"
        ]
    },
    {
        "source": "#69797e",
        "variations": [
            "#bbd0d8",
            "#a0b3ba",
            "#84969c",
            "#69797e",
            "#466068",
            "#234751",
            "#002e3b"
        ]
    },
    {
        "source": "#ca5010",
        "variations": [
            "#f4bc9e",
            "#e6986f",
            "#d8743f",
            "#ca5010",
            "#ab370b",
            "#8b1e06",
            "#6c0600"
        ]
    },
    {
        "source": "#c30052",
        "variations": [
            "#f39cc1",
            "#e3689c",
            "#d33477",
            "#c30052",
            "#a6003f",
            "#88002b",
            "#6b0018"
        ]
    },
    {
        "source": "#6b69d6",
        "variations": [
            "#c7c8fb",
            "#a8a8ef",
            "#8a89e2",
            "#6b69d6",
            "#4a50b8",
            "#2a379a",
            "#091e7d"
        ]
    },
    {
        "source": "#038387",
        "variations": [
            "#90d5d8",
            "#61b9bd",
            "#329ea2",
            "#038387",
            "#02686d",
            "#014d53",
            "#003139"
        ]
    },
    {
        "source": "#515c6b",
        "variations": [
            "#b8c5d4",
            "#95a2b1",
            "#737f8e",
            "#515c6b",
            "#36475c",
            "#1b324d",
            "#001d3f"
        ]
    },
    {
        "source": "#4a5459",
        "variations": [
            "#b0c3cc",
            "#8e9ea6",
            "#6c797f",
            "#4a5459",
            "#31424b",
            "#19313c",
            "#001f2e"
        ]
    },
    {
        "source": "#da3b01",
        "variations": [
            "#fbb399",
            "#f08b67",
            "#e56334",
            "#da3b01",
            "#b92701",
            "#981401",
            "#760000"
        ]
    },
    {
        "source": "#e3008c",
        "variations": [
            "#fe9cd8",
            "#f568bf",
            "#ec34a5",
            "#e3008c",
            "#c10070",
            "#a00055",
            "#7e0039"
        ]
    },
    {
        "source": "#8764b8",
        "variations": [
            "#d6c4ef",
            "#bca4dd",
            "#a184ca",
            "#8764b8",
            "#6a4a9d",
            "#4d3183",
            "#301768"
        ]
    },
    {
        "source": "#00b294",
        "variations": [
            "#90e7d8",
            "#60d5c1",
            "#30c4ab",
            "#00b294",
            "#009274",
            "#007255",
            "#005235"
        ]
    },
    {
        "source": "#567c73",
        "variations": [
            "#b3d3cb",
            "#94b6ae",
            "#759990",
            "#567c73",
            "#396258",
            "#1d483d",
            "#002f22"
        ]
    },
    {
        "source": "#647c64",
        "variations": [
            "#bfd2bf",
            "#a1b5a1",
            "#829982",
            "#647c64",
            "#436246",
            "#234828",
            "#022d0a"
        ]
    },
    {
        "source": "#ef6950",
        "variations": [
            "#ffc5b8",
            "#faa695",
            "#f48873",
            "#ef6950",
            "#cb4936",
            "#a82a1c",
            "#840a02"
        ]
    },
    {
        "source": "#bf0077",
        "variations": [
            "#f09dd2",
            "#e069b3",
            "#cf3495",
            "#bf0077",
            "#a2005e",
            "#850046",
            "#67002d"
        ]
    },
    {
        "source": "#744da9",
        "variations": [
            "#cfbbe9",
            "#b197d4",
            "#9272be",
            "#744da9",
            "#5a3890",
            "#402477",
            "#260f5e"
        ]
    },
    {
        "source": "#018574",
        "variations": [
            "#91d6ce",
            "#61bbb0",
            "#31a092",
            "#018574",
            "#016a59",
            "#014e3f",
            "#003324"
        ]
    },
    {
        "source": "#486860",
        "variations": [
            "#aecbc4",
            "#8caaa3",
            "#6a8981",
            "#486860",
            "#30524a",
            "#183c34",
            "#00261e"
        ]
    },
    {
        "source": "#525e54",
        "variations": [
            "#b7c6bb",
            "#95a499",
            "#748176",
            "#525e54",
            "#374a3b",
            "#1c3622",
            "#002208"
        ]
    },
    {
        "source": "#d13438",
        "variations": [
            "#f9b0b2",
            "#ec8789",
            "#de5d61",
            "#d13438",
            "#b22326",
            "#931213",
            "#730001"
        ]
    },
    {
        "source": "#c239b3",
        "variations": [
            "#efb3ea",
            "#e08ad7",
            "#d162c5",
            "#c239b3",
            "#a32696",
            "#851379",
            "#66005b"
        ]
    },
    {
        "source": "#b146c2",
        "variations": [
            "#e8b8f0",
            "#d692e1",
            "#c36cd1",
            "#b146c2",
            "#932fa4",
            "#761886",
            "#580068"
        ]
    },
    {
        "source": "#00cc6a",
        "variations": [
            "#94efc5",
            "#62e3a6",
            "#31d888",
            "#00cc6a",
            "#00a94c",
            "#00852e",
            "#00620f"
        ]
    },
    {
        "source": "#498205",
        "variations": [
            "#b9d39a",
            "#93b868",
            "#6e9d37",
            "#498205",
            "#336603",
            "#1d4a02",
            "#072e00"
        ]
    },
    {
        "source": "#847545",
        "variations": [
            "#d4cdaf",
            "#baaf8c",
            "#9f9268",
            "#847545",
            "#695a2e",
            "#4e3f17",
            "#322401"
        ]
    },
    {
        "source": "#ff4343",
        "variations": [
            "#ffb5b5",
            "#ff8f8f",
            "#ff6969",
            "#ff4343",
            "#d92d2d",
            "#b31717",
            "#8e0101"
        ]
    },
    {
        "source": "#9a0089",
        "variations": [
            "#e19ed9",
            "#ca69bf",
            "#b235a4",
            "#9a0089",
            "#800070",
            "#650057",
            "#4b003f"
        ]
    },
    {
        "source": "#881798",
        "variations": [
            "#d9a6e1",
            "#be76c8",
            "#a347b0",
            "#881798",
            "#6e0f7f",
            "#550866",
            "#3b004d"
        ]
    },
    {
        "source": "#10893e",
        "variations": [
            "#9dd6b4",
            "#6ebc8c",
            "#3fa365",
            "#10893e",
            "#0b6d2a",
            "#055115",
            "#003401"
        ]
    },
    {
        "source": "#107c10",
        "variations": [
            "#a0d2a0",
            "#70b570",
            "#409940",
            "#107c10",
            "#0b610b",
            "#054706",
            "#002c00"
        ]
    },
    {
        "source": "#7e735f",
        "variations": [
            "#d5cbb9",
            "#b8ae9b",
            "#9b907d",
            "#7e735f",
            "#645940",
            "#4a3e20",
            "#302401"
        ]
    }
];

fixtures.forEach(fixture => {
    const variations = variants(fixture.source);
    let originalVariations = new AccentColor(fixture.source);
    originalVariations = Object.keys(originalVariations.variants).map(key => originalVariations.variants[key]);

    // test(`${fixture.source}[0]: ${fixture.variations[0]}`, () => {
    //     expect(fixture.variations[0]).toBe(originalVariations[0]);
    // });
    // test(`${fixture.source}[1]: ${fixture.variations[1]}`, () => {
    //     expect(fixture.variations[1]).toBe(originalVariations[1]);
    // });
    fixture.variations.forEach((variant, index) => {
        test(`${fixture.source}[${index}]: ${variant}`, () => {
            expect(variant).toBe(variations[index]);
            // expect(variant).toBe(originalVariations[index]);
        })
    })
});

// test("variations", () => {
//     fixtures.forEach(item => {
//         const variations = variants(item.source);
//         item.variations.forEach((variant, index) => {
//             expect(variant).toBe(variations[index]);
//         })
//     })
// })
