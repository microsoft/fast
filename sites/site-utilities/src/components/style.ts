export const accentColor = "#FF4387";
export const selectorStyle = { margin: "0 4px 0 8px" };

export const labelStyle: React.CSSProperties = {
    fontSize: "var(--type-ramp-base-font-size)",
    lineHeight: "var(--type-ramp-base-line-height)",
    color: "var(--neutral-foreground-rest)",
    ...selectorStyle,
};

const toggleStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    background: "none",
    border: "none",
    ...selectorStyle,
};

export { toggleStyle };
