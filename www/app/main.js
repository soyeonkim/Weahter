var Watch = Watch || {}

Watch.app = {
	start:function () {
		var that = this;
		this.model = {
			init: new InitModel();

		};
		this.views = {
			dash: new DashView();
		};
		Backbone.history.start();
	},
	clearCache: function() {
		if(CINE.LOG) console.log("Clearing cache...");
		CINE.platform.clearCache();
	},
	startupRequests:function() {
		console.log("starting request ...");

	}
	


}
$(document).ready(function(){

	Watch.app.start();
});