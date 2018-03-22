import * as React from "react";
import renderer = require("react-test-renderer");
import Viewer from "../";
import data from "./data";

describe("viewer", () => {
    const viewerComponent: any = renderer.create(
        React.createElement(Viewer, data.data[0].props)
    );

    it("returns a css string", () => {
        expect(viewerComponent.getInstance().getStyleElement()).toBe("<style type=\"text/css\">.test { color: red; }</style>");
    });

    it("returns the content element", () => {
        /* tslint:disable-next-line */
        expect(viewerComponent.getInstance().getContentElement()).toBe("<div class=\"div-0-0-1\"><input type=\"text\" value=\"Hello World\"/><img src=\"https://placehold.it/300x300\"/><link href=\"https://fluentweb.com/fw-d192a11b84ce02288037ba0722f3ee33.min.css\" rel=\"stylesheet\"/></div>");
    });
});
