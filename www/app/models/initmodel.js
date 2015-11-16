
var InitModel = Backbone.Model.extend({

	defaults: {
		"status": "-1",
		"customer":  "0"
	},

	initialize: function() {
	},

	fetch: function(options) {
		if(!options) (options = {});
		this.url= CINE.urls.initUrl(CINE.platform.cellularNetwork);

		options.beforeSend = CINE.urls.addAmpRequestHeaders;
		options.dataType="xml";
		Backbone.Model.prototype.fetch.call(this, options);
	},

	parse: function(response, options) {

		if(CINE.LOG) console.log("InitModel parse", response);

		var jathTemplate = { 
			status: "richmediaresponse/action/respStatus",
			message: "richmediaresponse/action/message",
			customer: "richmediaresponse/action/isOrangeCustomer", 
			versionType: "richmediaresponse/action/version/actionType",
			versionMessage: "richmediaresponse/action/version/message",
			versionUrl: "richmediaresponse/action/version/url",
		};

		var parsed = Jath.parse(jathTemplate, response);

		if(CINE.LOG) console.log("Parsed to JSON:", parsed);

		// trigger events for versioning if needed
		if(parsed && parsed.versionType && parsed.versionUrl) {
			if(parsed.versionType=="1") {
				// mandatory update
				this.set("updateMandatory", true);
				this.trigger("init:updateMandatory", parsed.versionUrl);
			} else if(parsed.versionType=="2") {
				// optional update
				this.set("updateOptional", true);
				this.trigger("init:updateOptional", parsed.versionUrl);
			} else if(parsed.versionType=="3") {
				// trigger end of life event
				this.trigger("init:endlife",parsed.versionMessage);
			} else if(parsed.versionType=="4") {
				// trigger message event
				this.trigger("init:message", parsed.versionMessage);
			}
		}

		return parsed;
	},

	textToXml: function(text) {
      try {
        var xml = null;

        if ( window.DOMParser ) {

          var parser = new DOMParser();
          xml = parser.parseFromString( text, "text/xml" );

          var found = xml.getElementsByTagName( "parsererror" );

          if ( !found || !found.length || !found[ 0 ].childNodes.length ) {
            return xml;
          }

          return null;
        } else {

          xml = new ActiveXObject( "Microsoft.XMLDOM" );

          xml.async = false;
          xml.loadXML( text );

          return xml;
        }
      } catch ( e ) {
        return null;
      }
    }

});
