# Product Manager — SAPUI5 CRUD Demo

A freestyle SAPUI5 application demonstrating full **Create, Read, Update, Delete**
functionality using standard MVC architecture, manifest-first app descriptor,
and proper i18n — the same structure you'd use in a real SAP Fiori project.

## Features

- **Read** — responsive `sap.m.Table` bound to a `JSONModel`, with growing/paging
- **Create** — dialog fragment (`ProductDialog.fragment.xml`) with input validation
- **Update** — same dialog, reused and pre-filled via a shared draft model
- **Delete** — confirmation via `MessageBox`, then model update
- **Search/Filter** — live filtering across Name and Category via `sap.ui.model.Filter`
- **i18n** — all UI text externalized to `i18n.properties`
- **Responsive design** — `sap.f.DynamicPage` + `sap.m.Table`, works on desktop/tablet/phone

## Project structure

```
webapp/
├── index.html                     # SAPUI5 CDN bootstrap
├── index.js                       # Mounts the Component
├── Component.js                   # UIComponent, manifest-first
├── manifest.json                  # App descriptor
├── controller/
│   └── App.controller.js          # All CRUD logic
├── view/
│   ├── App.view.xml                # Main table + toolbar
│   └── ProductDialog.fragment.xml  # Shared create/edit dialog
├── model/
│   └── models.js                   # JSONModel factory (data + device model)
└── i18n/
    └── i18n.properties             # Text bundle
```

## Running it

No build tools required — just serve the folder and open `webapp/index.html`
in a browser. For example, from the project root:

```bash
npx http-server . -p 8080
# then open http://localhost:8080/webapp/index.html
```

(Opening the file directly via `file://` also works since it bootstraps
UI5 from the public CDN, but some browsers block local AJAX/fragment
loading under `file://` — a local server avoids that.)

## Swapping in a real backend

This demo uses a local `JSONModel` (see `model/models.js`) so it's fully
self-contained. To point it at a real SAP system, replace the model with
an `ODataModel`:

```js
// model/models.js
var oModel = new sap.ui.model.odata.v2.ODataModel(
    "/sap/opu/odata/sap/ZPRODUCT_SRV/",
    { json: true }
);
```

Then in `App.controller.js`, the CRUD handlers map directly onto OData
operations instead of local array mutation:

| Local demo (`JSONModel`)             | Real backend (`ODataModel`)       |
|---------------------------------------|-------------------------------------|
| `aProducts.push(...)`                 | `oModel.create("/ProductSet", data)`|
| `oProductModel.setProperty(...)`      | `oModel.update("/ProductSet('ID')", data)` |
| `aProducts.filter(...)`               | `oModel.remove("/ProductSet('ID')")`|
| bound directly, no request            | `oModel.read("/ProductSet")`        |

Everything else — the view, the dialog fragment, the i18n texts, the
validation — stays the same, since SAPUI5's data binding is model-agnostic.

## What this demonstrates

- MVC separation (view / controller / model)
- Manifest-first app descriptor (`sap.ui5` config, not hardcoded bootstrap options)
- Fragment reuse for dialogs
- Two-way data binding for forms, one-way for the table
- Expression binding (`ObjectStatus` state based on stock level)
- Proper i18n instead of hardcoded strings
- Clean separation between "draft" edit state and committed model data
