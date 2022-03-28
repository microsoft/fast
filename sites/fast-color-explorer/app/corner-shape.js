/* eslint-disable no-undef */
registerPaint(
    "corner-shape",
    class {
        constructor() {
            this.c = 0.5522847498307933984022516322796;
        }
        static get inputProperties() {
            return ["--corner-radius", "--corner-shape"];
        }
        paint(ctx, geom, properties) {
            const color = "black";
            let radius = Number(
                properties.get("--corner-radius").toString().replace("px", "")
            );
            if (properties.get("--corner-radius").unit === "percent") {
                radius = Math.min((radius * geom.width) / 100, geom.width / 2);
            }
            this.shape = properties.get("--corner-shape").toString().toLowerCase().trim();

            const points = [
                { x: radius, y: 0 },
                { x: geom.width - radius, y: 0 },
                { x: geom.width, y: radius },
                { x: geom.width, y: geom.height - radius },
                { x: geom.width - radius, y: geom.height },
                { x: radius, y: geom.height },
                { x: 0, y: geom.height - radius },
                { x: 0, y: radius },
            ];
            const bezierRadius = radius * this.c;

            ctx.fillStyle = color;

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);

            if (this.shape === "iphonex") {
                const r = radius * 0.6;
                const bzr = r * this.c;
                ctx.lineTo(points[0].x + r, points[0].y);
                ctx.bezierCurveTo(
                    points[0].x + r,
                    bzr,
                    points[0].x + r * 2 - bzr,
                    r,
                    points[0].x + r * 2,
                    r
                );
                ctx.lineTo(points[1].x - r * 2, r);
                ctx.bezierCurveTo(
                    points[1].x - r * 2 + bzr,
                    r,
                    points[1].x - r,
                    bzr,
                    points[1].x - r,
                    points[1].y
                );
                this.shape = "round";
            }

            ctx.lineTo(points[1].x, points[1].y);
            this.goTo(
                ctx,
                [points[2].x, points[2].y],
                [geom.width - radius, bezierRadius, geom.width - bezierRadius, radius],
                [
                    geom.width - radius + bezierRadius,
                    0,
                    geom.width,
                    radius - bezierRadius,
                ],
                [points[1].x, points[2].y]
            );
            ctx.lineTo(points[3].x, points[3].y);
            this.goTo(
                ctx,
                [points[4].x, points[4].y],
                [
                    geom.width - bezierRadius,
                    geom.height - radius,
                    geom.width - radius,
                    geom.height - bezierRadius,
                ],
                [
                    geom.width,
                    geom.height - radius + bezierRadius,
                    geom.width - radius + bezierRadius,
                    geom.height,
                ],
                [points[4].x, points[3].y]
            );
            ctx.lineTo(points[5].x, points[5].y);
            this.goTo(
                ctx,
                [points[6].x, points[6].y],
                [radius, geom.height - bezierRadius, bezierRadius, geom.height - radius],
                [
                    radius - bezierRadius,
                    geom.height,
                    0,
                    geom.height - radius + bezierRadius,
                ],
                [points[5].x, points[6].y]
            );
            ctx.lineTo(points[7].x, points[7].y);
            this.goTo(
                ctx,
                [points[0].x, points[0].y],
                [bezierRadius, radius, radius, bezierRadius],
                [0, radius - bezierRadius, radius - bezierRadius, 0],
                [points[0].x, points[7].y]
            );
            ctx.closePath();
            ctx.fill();
        }
        goTo(ctx, point, scoop, round, notch) {
            switch (this.shape) {
                case "bevel":
                    ctx.lineTo(point[0], point[1]);
                    return;
                case "scoop":
                    ctx.bezierCurveTo(
                        scoop[0],
                        scoop[1],
                        scoop[2],
                        scoop[3],
                        point[0],
                        point[1]
                    );
                    return;
                case "round":
                    ctx.bezierCurveTo(
                        round[0],
                        round[1],
                        round[2],
                        round[3],
                        point[0],
                        point[1]
                    );
                    return;
                case "notch":
                    ctx.lineTo(notch[0], notch[1]);
                    ctx.lineTo(point[0], point[1]);
                    return;
                case "iphonex":
                    return;
                default:
                    throw Error(`Unkown value for corner-shape: ${this.shape}`);
            }
        }
    }
);
