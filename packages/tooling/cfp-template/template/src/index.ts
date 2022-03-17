import "./components";

/**
 * Normalize body styles
 */
const bodyStyles = document.createElement("style");
bodyStyles.textContent = "body, html { margin: 0; padding: 0; }";
document.body.appendChild(bodyStyles);

/**
 * Add the welcome web component
 */
const welcomeElement = document.createElement("fast-welcome");
welcomeElement.textContent =
    "This is the default template you can use to kick start your website or application. It has been configured with TypeScript, webpack, and playwright. Check out the README file for additional information.";
welcomeElement.setAttribute("theme", "dark");
document.body.appendChild(welcomeElement);
