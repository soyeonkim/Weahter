// Mapping urls into views and actions
var AppRouter = Backbone.Router.extend({

    currentSubView : undefined,
    subViewTitle: "",
    viewStack : [],
    dialog : null,
    tutorial: null,

    initialize : function(app) {
        this.app = app;

        var that = this;

  
    },

    routes : {
        "" : "startApp",
        "dash" : "showDash"
    },



    startApp : function() {
        if (Watch.LOG)
            console.log("Starting application");
        //this.app.views.dash.render();
       
        // show the app tutorial if it has been shown before
 
        
        // if command line params are supplied to push the directly to a certain view
        // it is handled here by jumping to the view indicated by the Watch.platform.cmdParams
        // property, this is cleared/reset when the user clicks back or back to dash
        var that = this;
  /*      if(Watch.platform.cmdParams=="filmdetails") {
            if(Watch.LOG) console.log("Loading film details from cmd");
            // for film details view directly from command line, we need to use the model supplied
            // by the cmdData property,
            // if it still doesn't exist display an error and go back to dash
            if(Watch.platform.cmdData && Watch.platform.cmdData.id) {
                that.setView("app");
                console.log(Watch.platform.cmdData.id);
                location.href="#/film/cmd/" + Watch.platform.cmdData.id;
            } else {
                that.showPopUp(Watch.strings.FILM_NOT_FOUND);
                this.setView("dash");
            }
        } else if(Watch.platform.cmdParams=="twoforone") {
            if(Watch.LOG) console.log("Loading 241 from cmd");
            that.setView("app");
            location.href="#/app/moncode";
        } else {
            this.setView("dash");
        }
        */
    },

    showDash : function() {
        if (Watch.LOG)
            console.log("Showing dash view...");
        
        // clear the cmd flag if needed in case the command line params were used,
        // going back to the dash should reset the app to normal navigation
       // if(Watch.platform.cmdParams) Watch.platform.cmdParams = null;
      //  if(Watch.platform.cmdData) Watch.platform.cmdData = null;

      this.app.views.dash.render();
    },

    showApp : function(subview) {
        if (Watch.LOG)
            console.log("Showing app view... subview:", subview);
        this.setView("app");

 
    },

    toggleMenu : function() {
        if (Watch.LOG)
            console.log("Showing menu view...");

        if(!$("#menuBtn").hasClass("hidden")) {
            this.hideAll();
            if ($("#menuView").hasClass("onscreen")) {
                $("#menuView").removeClass("onscreen");
            } else {
                $("#menuView").addClass("onscreen");
            }
        }
    },

    renderView : function(view) {
        if (Watch.LOG) console.log("render", view);
        view.render();
        // var afterAnimation = function() {
        // 	view.render();
        // };

        // setTimeout(afterAnimation, 2000);
    },

    
    setAppSubView : function(subview) {
        if (Watch.LOG)
            console.log("App subview:", subview);

        //for moncode we need to rerender the view everytime since the status of the ticket could change
        if (this.currentSubView === subview && this.currentSubView != "moncode" && this.currentSubView != "searchField") {
            // already set, do nothing
            return;
        }
        switch(subview) {
            case "lesfilms":
                $("#headerTitle").html(Watch.strings.APPHEADER_FILMS);
                this.renderView(this.app.views.film);
                break;
            case "Watchma":
                $("#headerTitle").html(Watch.strings.APPHEADER_WatchMAS);
                this.renderView(this.app.views.Watchma);
                break;
            case "moncode":
                $("#headerTitle").html(Watch.strings.APPHEADER_COUPON);
                this.renderView(this.app.views.code);
                break;
            case "aide":
                $("#headerTitle").html(Watch.strings.APPHEADER_INFO);
                this.renderView(this.app.views.info);
                break;
            case "search":
                $("#headerTitle").html(Watch.strings.APPHEADER_SEARCH);
                this.renderView(this.app.views.search);
                break;
            default:
                $("#headerTitle").html(Watch.strings.APPHEADER_GENERIC);
                break;
        }

        this.currentSubView = subview;
        this.subViewTitle = $("#headerTitle").html();
    },

   
    setView : function(viewID) {
        if (Watch.LOG)
            console.log("AppRouter.setView", viewID);
        //$("#" + viewID).show();
        var that = this;
        switch(viewID) {
            case "dash":
                $("#appArea").removeClass("bottom-app");
                $("#appArea").addClass("top-dash");
                this.app.views.dash.reset();
                setTimeout(function() {
                    that.viewStackReset();
                }, 500);
                break;
            case "app":
                $("#appArea").removeClass("top-dash");
                $("#appArea").addClass("bottom-app");
                break;
            default:
                break;
        }
    },

    
});
