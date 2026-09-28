sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], function (JSONModel, Device) {
    "use strict";

    return {

        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },

        /**
         * In a real project this JSONModel would instead be an ODataModel
         * pointed at an SAP Gateway / CAP service, e.g.:
         *   new ODataModel("/sap/opu/odata/sap/ZPRODUCT_SRV/", { json: true });
         * All CRUD calls in the controller would then map 1:1 onto
         * oModel.create(), read(), update(), remove().
         * A local JSONModel is used here so the app is fully self-contained
         * and runnable without a backend.
         */
        createProductModel: function () {
            var oModel = new JSONModel({
                busy: false,
                nextId: 6,
                products: [
                    { ID: "1", Name: "Ergonomic Office Chair", Category: "Furniture", Price: 249.99, Stock: 34 },
                    { ID: "2", Name: "27-inch 4K Monitor", Category: "Electronics", Price: 389.5, Stock: 12 },
                    { ID: "3", Name: "Mechanical Keyboard", Category: "Electronics", Price: 89.0, Stock: 58 },
                    { ID: "4", Name: "Standing Desk Converter", Category: "Furniture", Price: 159.99, Stock: 0 },
                    { ID: "5", Name: "Noise-Cancelling Headset", Category: "Electronics", Price: 129.0, Stock: 21 }
                ]
            });
            oModel.setSizeLimit(1000);
            return oModel;
        }
    };
});
