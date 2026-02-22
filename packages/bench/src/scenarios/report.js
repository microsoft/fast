/**
 * Interactive variant selection controller for the benchmark report.
 *
 * Expects a <script id="report-config" type="application/json"> element
 * in the page with { colors, metrics, stats } and per-section
 * <script class="variant-data"> blocks with the stats data.
 */
const config = JSON.parse(
    document.getElementById("report-config").textContent
);
const COLORS = config.colors;
const METRICS = config.metrics;
const STATS = config.stats;

document.querySelectorAll("section[data-scenario]").forEach(section => {
    const data = JSON.parse(section.querySelector(".variant-data").textContent);
    const variants = Object.keys(data);
    const table = section.querySelector(".stats-table");
    const chart = section.querySelector(".comp-chart");
    const pills = section.querySelectorAll(".variant-pill");
    let selected = null;

    function selectVariant(vn) {
        selected = selected === vn ? null : vn;

        METRICS.forEach(metric => {
            STATS.forEach(stat => {
                const td = table.querySelector(
                    `td[data-metric="${metric}"][data-stat="${stat}"]`
                );

                if (!td) {
                    return;
                }

                if (selected) {
                    var val = data[selected][metric][stat];
                    td.textContent = val.toFixed(3);
                    td.style.color =
                        COLORS[selected] || "#6b7280";
                } else {
                    let best = Infinity;
                    let bestV = "";
                    variants.forEach(vn => {
                        var val = data[vn][metric][stat];
                        if (val < best) {
                            best = val;
                            bestV = vn;
                        }
                    });
                    td.textContent = best.toFixed(3);
                    td.style.color =
                        COLORS[bestV] || "#6b7280";
                }
            });
        });

        var groups = chart.querySelectorAll(".variant-group");
        if (selected) {
            chart.classList.add("has-selection");
            groups.forEach(g => {
                g.classList.toggle(
                    "selected",
                    g.dataset.variant === selected
                );
            });
        } else {
            chart.classList.remove("has-selection");
            groups.forEach(g => {
                g.classList.remove("selected");
            });
        }

        pills.forEach(pill => {
            pill.classList.toggle(
                "active",
                pill.dataset.variant === selected
            );
        });
    }

    pills.forEach(pill => {
        pill.addEventListener("click", () => {
            selectVariant(pill.dataset.variant);
        });
    });

    chart.querySelectorAll(".variant-group").forEach(g => {
        g.addEventListener("click", () => {
            selectVariant(g.dataset.variant);
        });
    });
});
