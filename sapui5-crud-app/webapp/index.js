sap.ui.define(["sap/ui/core/ComponentSupport"], function () {
    "use strict";
    // ComponentSupport auto-scans for divs with data-sap-ui-component,
    // but we mount manually here for clarity/control.
    sap.ui.require(["sap/ui/core/ComponentContainer"], function (ComponentContainer) {
        new ComponentContainer({
            name: "sap-ui-app",
            settings: {
                id: "productManager"
            },
            async: true,
            height: "100%"
        }).placeAt("content");
    });
});
