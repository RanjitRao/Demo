jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.declare("com.hkl.petauslista.fp_3.Component");
jQuery.sap.require("jquery.sap.storage");

sap.ui.core.UIComponent.extend("com.hkl.petauslista.fp_3.Component", {
	metadata: {
		manifest: "json"

	},
	init: function () {
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
		this.setModel((new sap.ui.model.json.JSONModel({
			"TableEnabled": false,
			"SortKey": "SeasonKey",
			"bDesc": false
		})), "AppModel");
		this.getRouter().initialize();

	},
	destroy: function () {
		if (this.routeHandler) {
			this.routeHandler.destroy();
		}
		sap.ui.core.UIComponent.prototype.destroy.apply(this, arguments);
	},
	createContent: function () {
		var oView = sap.ui.view({
			id: "rootView",
			viewName: "com.hkl.petauslista.fp_3.view.App",
			type: "XML"
		});

		var oDeviceModel = new sap.ui.model.json.JSONModel({
			isTouch: sap.ui.Device.support.touch,
			isNoTouch: !sap.ui.Device.support.touch,
			isPhone: sap.ui.Device.system.phone,
			isNoPhone: !sap.ui.Device.system.phone,
			listMode: (sap.ui.Device.system.phone) ? "None" : "SingleSelectMaster",
			listItemType: (sap.ui.Device.system.phone) ? "Active" : "Inactive"
		});
		oDeviceModel.setDefaultBindingMode("OneWay");
		sap.ui.getCore().setModel(oDeviceModel, "device");

		return oView;
	},
	getEventBus: function () {
		return sap.ui.getCore().getEventBus();
	}
});