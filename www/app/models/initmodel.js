
var InitModel = Backbone.Model.extend({
	appId :'2de143494c0b295cca9337e1e96b00e0',

	defaults: {
		"status": "-1",
		"customer":  "0"

	},


	initialize: function() {
	},

	fetch: function(options) {
		if(!options) {
			options.city = London; 
			options.country=uk;
		}
		
 
		this.url='http://api.openweathermap.org/data/2.5/forecast?q='+options.city+','+options.country+'&appid='+this.appId;

		//options.beforeSend = CINE.urls.addAmpRequestHeaders;

		//this.url ='./app/models/temp_json.js'
		options.dataType="json";
		Backbone.Model.prototype.fetch.call(this, options);
	},

	parse: function(response, options) {

		console.log("InitModel parse", response);

		 

	 	//console.log("Parsed to JSON:", parsed);


		 
		//return parsed;
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
