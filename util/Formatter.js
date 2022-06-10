/*global com*/
$.sap.declare("com.hkl.petauslista.fp_3.util.Formatter");

com.hkl.petauslista.fp_3.util.Formatter = {
    convertStrToDateObj: function (val) {
        if (val) {
            var arr = val.split(".");
            return new Date(parseInt(arr[2]), parseInt(arr[1]) - 1, parseInt(arr[0]));
        }
    }

};