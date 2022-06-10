sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/core/UIComponent',
	"sap/m/MessageBox"
], function (Controller, UIComponent, MessageBox) {
	"use strict";

	return Controller.extend("com.hkl.petauslista.fp_3.controller.BaseController", {
		goToView: function (that, oView) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo(oView);
		},
		translate: function (val) {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(val);
		},
		busyDialog: function (bVal) {
			var busyDialog = this.getOwnerComponent().getModel("AppModel").getProperty("/BusyDialog");
			if (bVal) {
				busyDialog.open();
			} else {
				busyDialog.close();
			}
		},
		showBackEndError: function (err, that) {
			try {
				var msgList = JSON.parse(err.response.body).error.innererror.errordetails;
				var msg = "";
				for (var i = 0; i < msgList.length; i++) {
					msg += msgList[i].message + "\n";
				}
			}
			catch {
				var msg = "Unexpected Error";
			}
			finally {
				that.busyDialog(false);
				MessageBox.error(msg);
			}
		}
	});

});