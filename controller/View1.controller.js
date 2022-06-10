sap.ui.define([
	"com/hkl/petauslista/fp_3/controller/BaseController",
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	"com/hkl/petauslista/fp_3/util/Formatter"
], function (BaseController, JSONModel, MessageToast, MessageBox, Formatter) {
	"use strict";

	return BaseController.extend("com.hkl.petauslista.fp_3.controller.View1", {
		onInit: function () {
			//comment added by Ranjit---
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.attachRouteMatched(this.onRouteMatched, this);
			if (!this.oSDFragment) {
				this.oSDFragment = sap.ui.xmlfragment("sdFrag", "com.hkl.petauslista.fp_3.view.fragments.BusyDialog", this);
				this.getView().addDependent(this.oSDFragment);
			}
			this.getOwnerComponent().getModel("AppModel").setProperty("/BusyDialog", this.oSDFragment);
			this.getView().setModel(this.getOwnerComponent().getModel("AppModel"), "AppModel");
		},
		onLoadData: function () {
			if (this.byId("idCmbHSDate").getSelectedItem() === null) {
				MessageBox.error(this.translate("ERRMSGHSDATE"));
				return;
			}
			var data = [{
				"SeasonKey": "Spring2022",
				"HStart": "01.02.2022",
				"HEnd": "30.08.2022",
				"SStart": "01.02.2022",
				"SEnd": "30.05.2022"
			}, {
				"SeasonKey": "Summer2022",
				"HStart": "02.02.2022",
				"HEnd": "30.08.2022",
				"SStart": "01.02.2022",
				"SEnd": "30.05.2022"
			}, {
				"SeasonKey": "Spring2022",
				"HStart": "31.02.2022",
				"HEnd": "30.08.2022",
				"SStart": "01.06.2022",
				"SEnd": "30.08.2022"
			}, {
				"SeasonKey": "Autumn2022",
				"HStart": "15.01.2022",
				"HEnd": "30.11.2022",
				"SStart": "01.09.2022",
				"SEnd": "30.11.2022"
			}];
			var oModel = new JSONModel();
			oModel.setData({
				"data": data
			});
			this.getView().setModel(oModel);
			var appModel = this.getOwnerComponent().getModel("AppModel");
			this.sort(appModel.getProperty("/SortKey"), appModel.getProperty("/bDesc"));
			appModel.setProperty("/TableEnabled", true);
		},
		onRouteMatched: function (oEvent) {
			var oNameParameter = oEvent.getParameter("name");
			if (oNameParameter === "View1") {
				//
			}
		},
		onDeletePress: function (oEvent) {
			var that = this;
			MessageBox.confirm("Do you want to delete " + oEvent.getSource().getCustomData()[0].getKey() + "?", {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action,
				onClose: function (sAction) {
					if (sAction === "YES") {
						that.onButtonPress();
					}
				}
			});
		},
		onButtonPress: function () {
			MessageToast.show("Under Construction");
		},
		onDialogCancelPressed: function () {
			this.oAddEditFragment.close();
		},
		sort: function (col, bDesc) {
			if (col === "") {
				return;
			}
			var dateColumns = ['HStart', 'HEnd', 'SStart', 'SEnd'];
			var oSorter = new sap.ui.model.Sorter(col, bDesc);
			if (dateColumns.indexOf(col) > -1) {
				oSorter.fnCompare = function (value1, value2) {
					var _aDate = value1.split('.');
					var _bDate = value2.split('.');
					var aDate = new Date(_aDate[2], _aDate[1] - 1, _aDate[0]);
					var bDate = new Date(_bDate[2], _bDate[1] - 1, _bDate[0]);
					if (bDate === null) {
						return -1;
					}
					if (aDate === null) {
						return 1;
					}
					if (aDate < bDate) {
						return -1;
					}
					if (aDate > bDate) {
						return 1;
					}
					return 0;
				};
			}
			var oList = this.byId("idSMTable");
			oList.getBinding("items").sort(oSorter);
		},
		onLinkPress: function (oEvent) {
			this.byId("idIconSK").setVisible(false);
			this.byId("idIconHS").setVisible(false);
			this.byId("idIconHE").setVisible(false);
			this.byId("idIconSS").setVisible(false);
			this.byId("idIconSE").setVisible(false);
			var appModel = this.getOwnerComponent().getModel("AppModel");
			var oSource = oEvent.getSource();
			var _key = oSource.getCustomData()[0].getKey();
			var _icon = oSource.getParent().getItems()[1];
			var _sortKey = appModel.getProperty("/SortKey");
			var _sortBDesc = appModel.getProperty("/bDesc");
			_icon.setVisible(true);
			if (_sortKey !== _key) {
				appModel.setProperty("/SortKey", _key);
			}
			if (_sortBDesc) {
				_icon.setSrc("sap-icon://up");
				appModel.setProperty("/bDesc", false);
			} else {
				_icon.setSrc("sap-icon://down");
				appModel.setProperty("/bDesc", true);
			}
			this.sort(appModel.getProperty("/SortKey"), appModel.getProperty("/bDesc"));
		},
		onSearch: function (oEvent) {
			var oFilter = new sap.ui.model.Filter('SeasonKey', 'Contains', oEvent.getSource().getValue());
			var oList = this.byId("idSMTable");
			oList.getBinding("items").filter(oFilter);
		},
		onUpdateFinished: function (oEvent) {
			this.byId("idTableTitle").setText("Seasons" + "(" + oEvent.getSource().getItems().length + ")");
		},
		onAddEditPress: function (oEvent) {
			if (!this.oAddEditFragment) {
				this.oAddEditFragment = sap.ui.xmlfragment("com.hkl.petauslista.fp_3.view.fragments.AddEdit", this);
				this.getView().addDependent(this.oAddEditFragment);
			}
			var _mode = oEvent.getSource().data("Mode");
			if (_mode === "Edit") {
				var arrSeason = {
					"SeasonKey": oEvent.getSource().data("SK"),
					"HStart": oEvent.getSource().data("HS"),
					"HEnd": oEvent.getSource().data("HE"),
					"SStart": oEvent.getSource().data("SS"),
					"SEnd": oEvent.getSource().data("SE"),
					"SKEnabled": false,
					"Mode": "Edit"
				};
			} else {
				var arrSeason = {
					"SeasonKey": "",
					"HStart": "",
					"HEnd": "",
					"SStart": "",
					"SEnd": "",
					"SKEnabled": true,
					"Mode": "Add"
				};
			}
			var oModel = new JSONModel();
			oModel.setData(arrSeason);
			this.oAddEditFragment.setModel(oModel);
			this.oAddEditFragment.open();
		},
		onSavePress: function () {
			var oModel = this.oAddEditFragment.getModel();
			var _seasonKey = oModel.getProperty("/SeasonKey").trim();
			var _ssDate = oModel.getProperty("/SStart");
			var _seDate = oModel.getProperty("/SEnd");
			var _msg = "";
			if (_seasonKey === "") {
				_msg = _msg + "#" + this.translate("ERRMSGSKEY") + "\n\n";
			}
			if (_ssDate === "") {
				_msg = _msg + "#" + this.translate("ERRMSGSDATE") + "\n\n";
			}
			if (_seDate === "") {
				_msg = _msg + "#" + this.translate("ERRMSGEDATE");
			}
			if (_msg !== "") {
				MessageBox.error(_msg);
				return;
			}
			var _sDate = _ssDate.split('.');
			var _eDate = _seDate.split('.');
			var sDate = new Date(_sDate[2], _sDate[1] - 1, _sDate[0]);
			var eDate = new Date(_eDate[2], _eDate[1] - 1, _eDate[0]);
			if (sDate > eDate) {
				MessageBox.error("#" + this.translate("ERRMSGDATE"));
				return;
			}
			var that = this;
			that.busyDialog(true);
			var _mode = oModel.getProperty("/Mode");
			var oEntry = {
				"SeasonKey": oModel.getProperty("/SeasonKey"),
				"HStart": oModel.getProperty("/HStart"),
				"HEnd": oModel.getProperty("/HEnd"),
				"SStart": oModel.getProperty("/SStart"),
				"SEnd": oModel.getProperty("/SEnd"),
			};
			var oModel = that.getOwnerComponent().getModel();
			var fnSuccess = function (data) {
				MessageBox.success("Success");
				that.busyDialog(false);
			};
			var fnError = function (err) {
				that.showBackEndError(err, that);
			};
			oModel.create("/Entity", oEntry, null, fnSuccess, fnError);
		}
	});
});