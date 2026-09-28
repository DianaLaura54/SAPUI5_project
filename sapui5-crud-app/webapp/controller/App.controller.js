sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, JSONModel, Filter, FilterOperator, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("sap-ui-app.controller.App", {

        onInit: function () {
            // Draft model backs the Create/Edit dialog form fields.
            // Kept separate from the "products" model so Cancel never
            // touches real data until Save is pressed.
            this.getView().setModel(new JSONModel({}), "draft");
            this._oDialog = null;
            this._sEditingId = null; // null while creating, product ID while editing
        },

        // ---------------------------------------------------------------
        // READ / SEARCH
        // ---------------------------------------------------------------

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.byId("productTable");
            var oBinding = oTable.getBinding("items");

            if (!sQuery) {
                oBinding.filter([]);
                return;
            }

            var aFilters = new Filter({
                filters: [
                    new Filter("Name", FilterOperator.Contains, sQuery),
                    new Filter("Category", FilterOperator.Contains, sQuery)
                ],
                and: false
            });
            oBinding.filter([aFilters]);
        },

        // ---------------------------------------------------------------
        // CREATE
        // ---------------------------------------------------------------

        onCreate: function () {
            this._sEditingId = null;

            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            this.getView().getModel("draft").setData({
                dialogTitle: oBundle.getText("createDialogTitle"),
                Name: "",
                Category: "Electronics",
                Price: 0,
                Stock: 0,
                nameState: "None"
            });

            this._getDialog().then(function (oDialog) {
                oDialog.open();
            });
        },

        // ---------------------------------------------------------------
        // UPDATE
        // ---------------------------------------------------------------

        onEdit: function (oEvent) {
            var oItem = oEvent.getSource().getParent().getParent();
            var oProduct = oItem.getBindingContext("products").getObject();

            this._sEditingId = oProduct.ID;

            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            this.getView().getModel("draft").setData({
                dialogTitle: oBundle.getText("editDialogTitle"),
                Name: oProduct.Name,
                Category: oProduct.Category,
                Price: oProduct.Price,
                Stock: oProduct.Stock,
                nameState: "None"
            });

            this._getDialog().then(function (oDialog) {
                oDialog.open();
            });
        },

        onDialogSave: function () {
            var oDraftModel = this.getView().getModel("draft");
            var oDraft = oDraftModel.getData();

            if (!oDraft.Name || !oDraft.Name.trim()) {
                oDraftModel.setProperty("/nameState", "Error");
                return;
            }

            var oProductModel = this.getView().getModel("products");
            var aProducts = oProductModel.getProperty("/products");
            var oBundle = this.getView().getModel("i18n").getResourceBundle();

            if (this._sEditingId === null) {
                // CREATE: append a new record with a fresh generated ID
                var iNextId = oProductModel.getProperty("/nextId");
                aProducts.push({
                    ID: String(iNextId),
                    Name: oDraft.Name.trim(),
                    Category: oDraft.Category,
                    Price: oDraft.Price,
                    Stock: oDraft.Stock
                });
                oProductModel.setProperty("/nextId", iNextId + 1);
                MessageToast.show(oBundle.getText("createSuccess", [oDraft.Name]));
            } else {
                // UPDATE: find and patch the existing record by ID
                var oTarget = aProducts.find(function (p) { return p.ID === this._sEditingId; }.bind(this));
                if (oTarget) {
                    oTarget.Name = oDraft.Name.trim();
                    oTarget.Category = oDraft.Category;
                    oTarget.Price = oDraft.Price;
                    oTarget.Stock = oDraft.Stock;
                }
                MessageToast.show(oBundle.getText("updateSuccess", [oDraft.Name]));
            }

            oProductModel.setProperty("/products", aProducts);
            oProductModel.refresh(true);
            this._oDialog.close();
        },

        onDialogCancel: function () {
            this._oDialog.close();
        },

        // ---------------------------------------------------------------
        // DELETE
        // ---------------------------------------------------------------

        onDelete: function (oEvent) {
            var oItem = oEvent.getSource().getParent().getParent();
            var oProduct = oItem.getBindingContext("products").getObject();
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var that = this;

            MessageBox.confirm(
                oBundle.getText("deleteConfirmText", [oProduct.Name]),
                {
                    title: oBundle.getText("deleteConfirmTitle"),
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.OK) {
                            that._removeProduct(oProduct.ID);
                            MessageToast.show(oBundle.getText("deleteSuccess", [oProduct.Name]));
                        }
                    }
                }
            );
        },

        _removeProduct: function (sId) {
            var oProductModel = this.getView().getModel("products");
            var aProducts = oProductModel.getProperty("/products");
            var aFiltered = aProducts.filter(function (p) { return p.ID !== sId; });
            oProductModel.setProperty("/products", aFiltered);
        },

        // ---------------------------------------------------------------
        // Fragment (dialog) lazy loading, cached on the controller instance
        // ---------------------------------------------------------------

        _getDialog: function () {
            var that = this;
            if (this._oDialog) {
                return Promise.resolve(this._oDialog);
            }
            return this.loadFragment({
                name: "sap-ui-app.view.ProductDialog"
            }).then(function (oDialog) {
                that._oDialog = oDialog;
                return oDialog;
            });
        }
    });
});
