var Watch = Watch || {}

Watch.app = {
	start:function () {
		var that = this;
		this.models = {
			init: new InitModel(),

		};
		this.views = {
			dash: new DashView({el: '#dashView',
					template: '#dashTemplate'
							}),
		};
		Backbone.history.start();
		this.startupRequests();
	},
	clearCache: function() {
		console.log("Clearing cache...");
		Watch.platform.clearCache();
	},
	startupRequests:function() {
		console.log("starting request ...");

		var initError = function() {
            console.error("Init request error.");
          /*  if(options && options.showError)
            	Watch.app.router.showConnectionDialog();
            if(success) success();*/
	    };

	    var initSuccess = function() {
	    	console.log("Init request complete.");
	    	/*if(Watch.platform.cellularNetwork && !Watch.app.models.implicitauth.authorised()) {
	    		if(Watch.LOG) console.log("Implicit not authorised and connected on cellular, authorising...");
	    		Watch.app.models.implicitauth.fetch({ success: success, error: success });
	    	}*/
	    };
		Watch.app.models.init.fetch({ success: initSuccess, error: initError });
	}
	


}
$(document).ready(function(){

	Watch.app.start();
});