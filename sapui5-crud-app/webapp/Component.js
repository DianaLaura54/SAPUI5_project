sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap-ui-app/model/models"
], function (UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("sap-ui-app.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // set the product model (our "backend" for this demo)
            this.setModel(models.createProductModel(), "products");
        }
    });
});
