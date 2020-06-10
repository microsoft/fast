import { FASTElement } from "@microsoft/fast-element";
import { waveData } from "../../data/wave.data";

type BezierCurveTo = [number, number, number, number, number, number];
type MoveTo = [number, number];

interface PathData {
    C: BezierCurveTo[];
    color?: [number, number, number];
    M: MoveTo;
}

export class BackgroundDesign extends FASTElement {
    canvas = this.shadowRoot!.getElementById("wave-canvas") as HTMLCanvasElement;
    context = this.canvas.getContext("2d", { alpha: false }) as CanvasRenderingContext2D;

    waveSim = {
        scale: 1.0,
        size: { width: 0.0, height: 0.0 },
        center: { x: 0, y: 0 },
        origin: { x: 0, y: 0 },
        percent: { x: 0.5, y: 0.5 },
    };

    time = {
        loop: 0.0,
        scale: 1.0,
        speed: 0.35,
        total: 0.0,
    };

    increments = {
        bg: 20,
        waves: 40,
    };

    steps = {
        bg: [],
        waves: [],
    };

    lineWidths = {
        bg: 1.5,
        waves: 10.0,
    };

    waveData = {};

    constructor() {
        super();

        this.setup();
        this.reflowCanvas();

        let resizeTimeout;

        window.addEventListener(
            "resize",
            () => {
                if (resizeTimeout) {
                    resizeTimeout = clearTimeout(resizeTimeout);
                }
                resizeTimeout = window.setTimeout(() => this.reflowCanvas(), 100);
            },
            false
        );

        let last = window.performance.now();
        const performAnimation = () => {
            let frametime = window.performance.now() - last;
            this.update(frametime);
            last = window.performance.now();
            requestAnimationFrame(performAnimation);
        };
        requestAnimationFrame(performAnimation);
    }

    setup() {
        Object.entries(waveData.layers).map(([key, list]) =>
            list.map(({ from, to, color }, i) => {
                const waveBlendData = {
                    path: this.convertPath(from, color),
                    start: this.convertPath(from),
                    end: this.convertPath(to),
                };
                if (!this.waveData.hasOwnProperty(key)) {
                    this.waveData[key] = [];
                }
                this.waveData[key].push(waveBlendData);
            })
        );
    }

    convertPath(rawPath, color?: number[]): PathData {
        let M: MoveTo | undefined;
        let C: BezierCurveTo[] | MoveTo | undefined = rawPath
            .split(/(?=[MCS])/)
            .map(d => {
                let points = d
                    .slice(1, d.length)
                    .split(",")
                    .map(p => ~~p);

                let pairs: number[] = [];
                if (points.length === 2) {
                    M = points.map(p => ~~p) as MoveTo;
                    return;
                }
                for (let i = 0; i < points.length; i++) {
                    pairs.push(~~points[i]);
                }
                return pairs as BezierCurveTo | MoveTo;
            })
            .filter(Boolean);

        return { C, M, ...(color && { color }) } as PathData;
    }

    stepPoint(from, to, increments, step) {
        return from + ((to - from) / increments) * step;
    }

    generateWave(from, to, cache, inc) {
        let colorBlend: number = 0;
        for (let step = 0; step < inc; step++) {
            colorBlend += 1 / inc;
            const newWave = {
                color: from.color.map(
                    (c, i) => c * colorBlend + (1 - colorBlend) * to.color[i]
                ),
                C: from.C.map((c, n) =>
                    c.map((v, i) => this.stepPoint(v, to.C[n][i], inc, step))
                ),
                M: from.M.map((p, i) => this.stepPoint(p, to.M[i], inc, step)),
            };

            cache.push(newWave);
        }
    }

    updateWave(thisWave, startPoints, endPoints, modifier) {
        // sin wave drives animation
        let time = this.time.total / 2;
        let blend = this.easeInOut(1)(Math.sin(time + modifier));
        for (let i = 0; i < thisWave.C.length; i++) {
            const points = thisWave.C[i];
            for (let j = 0; j < points.length; j++) {
                let pointStart = startPoints.C[i][j];
                let pointEnd = endPoints.C[i][j];
                thisWave.C[i][j] =
                    ((blend + 1) * (pointEnd - pointStart)) / 2 + pointStart;
            }
        }

        return thisWave;
    }

    draw({ color, C, M }, lineWidth) {
        this.context.beginPath();
        this.context.moveTo(M[0], M[1]);

        for (let i = 0; i < C.length; i++) {
            this.context.bezierCurveTo(...(C[i] as BezierCurveTo));
        }

        this.context.lineWidth = lineWidth;
        this.context.strokeStyle = `rgb(${color!.join(",")})`;
        this.context.stroke();
        this.context.closePath();
    }

    update(frametime) {
        this.time.loop = frametime / 1000;
        this.time.scale = this.time.loop * 60.0 * this.time.speed;
        this.time.total += this.time.loop * this.time.scale;

        this.steps.bg.length = 0;
        this.steps.waves.length = 0;

        // you're too slow!
        if (frametime < 14) {
            return;
        }

        this.context.clearRect(0, 0, this.waveSim.size.width, this.waveSim.size.height);
        this.context.save();
        this.context.translate(
            ~~((this.waveSim.size.width - waveData.viewbox.width) / 2),
            ~~((this.waveSim.size.height - waveData.viewbox.height) / 2)
        );

        const keys = Object.keys(this.waveData);

        // for-loops for performance
        for (let g = 0; g < keys.length; g++) {
            const key = keys[g];
            const waves = this.waveData[key];

            for (let i = 0; i < waves.length; i++) {
                let wave = waves[i];
                const modifier = i * 2 + (g + 1);
                if (i < waves.length - 1) {
                    this.generateWave(
                        this.waveData[key][i].path,
                        this.waveData[key][i + 1].path,
                        this.steps[key],
                        this.increments[key]
                    );
                }
                wave = this.updateWave(wave.path, wave.start, wave.end, modifier);
            }

            const steps = this.steps[key];
            for (let i = 0; i < steps.length; i++) {
                const step = steps[i];
                this.draw(step, this.lineWidths[key]);
            }
        }

        this.context.restore();
    }

    easeIn = p => t => Math.pow(t, p);
    easeOut = p => t => 1 - Math.abs(Math.pow(t - 1, p));
    easeInOut = p => t =>
        t < 0.5 ? this.easeIn(p)(t * 2) / 2 : this.easeOut(p)(t * 2 - 1) / 2 + 0.5;

    reflowCanvas() {
        let styles = window.getComputedStyle(this);

        const w = parseInt(styles.getPropertyValue("width"), 10);
        const h = parseInt(styles.getPropertyValue("height"), 10);

        this.waveSim.scale = w / waveData.viewbox.width;

        this.waveSim.size.width = w / this.waveSim.scale;
        this.waveSim.size.height = h / this.waveSim.scale;

        this.canvas.style.width = `${this.waveSim.size.width * this.waveSim.scale}px`;
        this.canvas.style.height = `${this.waveSim.size.height * this.waveSim.scale}px`;
        this.canvas.width = this.waveSim.size.width;
        this.canvas.height = this.waveSim.size.height;

        this.waveSim.origin.x = Math.ceil(
            this.waveSim.size.width * this.waveSim.percent.x
        );
        this.waveSim.origin.y = Math.ceil(
            this.waveSim.size.height * this.waveSim.percent.y
        );
    }
}
