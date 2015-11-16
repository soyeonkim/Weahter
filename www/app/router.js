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

        //@todo - this is part of the view and should be removed from here
        $("#filmscontainer").bind("click", function(e) {
            window.location.href = "#/app/lesfilms";
        });

        $("#dashBtn").bind("click", function(e) {
            window.location.href = "#/dash";
        });

        $("#menuBtn").bind("click", function(e) {
            that.toggleMenu();
        });

        $("#menuView").bind("click", function(e) {
            that.toggleMenu();
        });

        $("#backBtn").bind("click", function(e) {
            that.viewStackBack();
        });

        $(".menu-list-item").bind("click", function(e) {
            if ($(e.delegateTarget)) {
                window.location.href = "#/app/" + e.delegateTarget.id;
            }
        });
    },

    routes : {
        "" : "startApp",
        "dash" : "showDash"
    },

    removeSplashscreen : function() {

            console.log("Removing splashscreen");
        $("#appArea").removeClass("invisible");
        $("#splashScreen").bind("transitionEnd webkitTransitionEnd", function(e) {
           $("#splashScreen").remove();
        });
        $("#splashScreen").addClass("fade-out");
    },

    showUpdateDialog : function(mandatory) {
        if(Watch.LOG) console.log("Showing UPDATE dialog...");
        if (this.dialog) {
            this.dialog.reset();
        }

        var buttonText = mandatory ? Watch.strings.UPDATE_BTN_QUIT : Watch.strings.UPDATE_BTN_IGNORE;
        var buttons = [{
            id : "btnUpdate",
            text : Watch.strings.UPDATE_BTN_UPDATE
        }, {
            id : "btnQuit",
            text : buttonText
        }];
        this.dialog = new DialogView({
            dialogId : "updateDialog"
        });

        var options = {
            title: Watch.strings.UPDATE_TITLE,
            data: Watch.app.models.init.toJSON(),
            buttons: buttons
        };
        options.data["str"] = Watch.strings;
        this.dialog.showDialogTemplate("updateDialog.tmpl", options);

        this.dialog.on("dialog:btnUpdate", function() {
            Watch.platform.updateApp(Watch.app.models.init.get("versionUrl"));
        });

        this.dialog.on("dialog:btnQuit", function() {
            if (mandatory) {
                Watch.platform.quitApp();
            } else {
                Watch.app.router.removeSplashscreen();
            }
        });

        var that = this;
        this.dialog.on("dialog:removed", function() {
            delete that.dialog;
            that.dialog = null;
        });
    },

    showEndlifeDialog : function(message) {
        if(Watch.LOG) console.log("Showing END OF LIFE dialog...");
        if (this.dialog) {
            this.dialog.reset();
        }

        var buttons = [{
            id : "btnQuit",
            text : Watch.strings.ENDLIFE_BTN_QUIT
        }];

        this.dialog = new DialogView({
            dialogId : "endlifeDialog"
        });

        var options = {
            title: Watch.strings.APP_TITLE,
            data: message,
            buttons: buttons
        };
        this.dialog.showDialogTemplate("textDialog.tmpl", options);

        this.dialog.on("dialog:btnQuit", function() {
            Watch.platform.quitApp();
        });

        var that = this;
        this.dialog.on("dialog:removed", function() {
            delete that.dialog;
            that.dialog = null;
        });
    },

    showMessageDialog : function(message) {
        if(Watch.LOG) console.log("Showing MESSAGE dialog...");
        if (this.dialog) {
            this.dialog.reset();
        }

        var buttons = [{
            id : "btnClose",
            text : Watch.strings.MESSAGE_BTN_CLOSE
        }];
        this.dialog = new DialogView({
            dialogId : "messageDialog"
        });

        var options = {
            title: Watch.strings.APP_TITLE,
            data: message,
            buttons: buttons
        };
        this.dialog.showDialogTemplate("textDialog.tmpl", options);

        var that = this;
        this.dialog.on("dialog:removed", function() {
            delete that.dialog;
            that.dialog = null;
        });
    },

    showConnectionDialog : function() {
        if(Watch.LOG) console.log("Showing CONNECTION dialog...");
        if (this.dialog) {
            this.dialog.reset();
        }

        var buttons = [{
            id : "btnClose",
            text : Watch.strings.NO_CONN_BTN_CLOSE
        }];
        this.dialog = new DialogView({
            dialogId : "noConnDialog"
        });

        var options = {
            title: Watch.strings.NO_CONN_TITLE,
            data: Watch.strings.NO_CONN_BODY,
            buttons: buttons
        };
        this.dialog.showDialogTemplate("textDialog.tmpl", options);

        var that = this;
        this.dialog.on("dialog:removed", function() {
            delete that.dialog;
            that.dialog = null;
        });
    },

    showCachedLocationDialog : function() {
        if(Watch.LOG) console.log("Showing CACHED LOCATION dialog...");
        if (this.dialog) {
            this.dialog.reset();
        }

        var buttons = [{
            id : "btnClose",
            text : Watch.strings.NO_LOCATION_BTN_CLOSE
        }];
        this.dialog = new DialogView({
            dialogId : "noLocationDialog"
        });

        var options = {
            title: Watch.strings.NO_LOCATION_TITLE,
            data: Watch.strings.NO_LOCATION_BODY,
            buttons: buttons
        };

        this.dialog.showDialogTemplate("textDialog.tmpl", options);

        var that = this;
        this.dialog.on("dialog:removed", function() {
            delete that.dialog;
            that.dialog = null;
        });
    },

    showPopUp : function(message) {
        var popup = new DialogView({
            dialogId : "popup"
        });
        popup.showPopUp(message);
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

    refreshMovieList: function() {
        if(location.href.indexOf("#/app/lesfilms")>=0) {
            if(Watch.LOG) console.log("Current view is Les Films, refreshing current data");
            Watch.app.views.film.refreshView();
        }
    },

    refreshDash: function() {
        if(location.href.indexOf("#/dash")>=0) {
            Watch.app.views.dash.drawTicket();
        }
    },

    refreshTwoForOne: function() {
        if(location.href.indexOf("#/app/moncode")>=0) {
            Watch.app.models.mobilecode.validateCode();
            Watch.app.models.internetcode.validateCode();
        }
    },
    
    viewStackBack: function() {
        if(Watch.platform.cmdParams && this.viewStack.length==1) {
            // if the command line params were used to go to a particular view and we back on that view,
            // the back action should go back to the dash
            window.location.href = "#/dash";
        } else if(this.viewStackPop()) {
            history.back();
        } else if($("#appArea").hasClass("bottom-app")) {
            window.location.href = "#/dash";
        } else if($("#appArea").removeClass("top-dash")) {
            Watch.platform.quitApp({userConfirm: true});
        } else {
            if(Watch.LOG) console.error("Trying to go back, unknown state");
        }
    },

    viewStackReset: function() {
        while(this.viewStackPop()) {

        }
    },

    viewStackPush : function(view, headerTitle) {
        var viewCount = this.viewStack.length;
        if(viewCount>0) {
            // if the view being added is the same as the last one then do nothing
            // this occurs when you click back on a stacked view and we dont need
            // push and re-render the view as its already underneath
            if (this.viewStack[viewCount - 1] === view)
                return;
        }

        view.headerText = headerTitle ? headerTitle : $("#headerTitle").html();

        if (viewCount === 0) {
            // first iten on view stack
            $("#backBtn").removeClass("hidden");
            $("#menuBtn").addClass("hidden");
        } else if(viewCount === 1) {
            $("#dashBtn").addClass("invisible");
        }

        this.viewStack.push(view);
        $("#headerTitle").html(headerTitle);
        if(!Watch.platform.viewTransitions) {
            view.$el.removeClass("hidden");
        }
        view.$el.addClass("onscreen");
        view.render();
    },

    viewStackPop : function() {
        if (this.viewStack.length > 0) {
            // there is something on the stack, remove it
            var view = this.viewStack.pop();
            view.$el.removeClass("onscreen");
            if(!Watch.platform.viewTransitions) {
                view.$el.addClass("hidden");
            }

            // if the stacked view has a resetView() method call it so the view
            // can clean up
            setTimeout(function() {
                if (view.cleanupView) {
                    view.cleanupView();
                }
            }, 500);

            // reset to root sub view state if no more stacked views
            var newStackLength = this.viewStack.length;
            if (newStackLength === 0) {
                // show the subview in case it was hidden
                $("#subviewContainer").removeClass('hidden');
                $("#backBtn").addClass("hidden");
                $("#menuBtn").removeClass("hidden");
                $("#headerTitle").html(this.subViewTitle);
            } else if(newStackLength === 1) {
                $("#headerTitle").html(this.viewStack[newStackLength-1].headerText);
                $("#dashBtn").removeClass("invisible");
            } else {
                $("#headerTitle").html(this.viewStack[newStackLength-1].headerText);
            }
            return true;
        } else {
            return false;
        }
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

    hideAll : function() {
        // $('#splashscreenbindingpoint').hide();
        //$("#appArea").removeClass("top-dash");
        //$("#appArea").removeClass("bottom-app");
        $('input[id=searchField]').blur();
        $('input[id=emailInput]').blur();
        $('input[id=passwordInput]').blur();

        //$("#backButton").addClass("hidden");
    },

    setView : function(viewID) {
        this.hideAll();
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

    showFilmDetails : function(list, id) {
        if (Watch.LOG)
            console.log("AppRouter.showFilmDetails", list, id);
        // Hide movie list to make detailView scrolling smoother
        $("#subviewContainer").addClass('hidden');
        var view = this.app.views.filmdetail;

        if(list=="cmd") {
            // if the list is cmd, this means that the command line was invoked
            // to open film details view directly, in this case use the model
            // from Watch.platform.cmdData
            view.model = new FilmModel(Watch.platform.cmdData);
        } else {
            view.model = this.app.collections[list].get(id);
        }

        if(view.model && view.model.id) {
            this.viewStackPush(view, view.model.get("name"));
        } else {
            location.href = "#/app/lesfilms";
        }
        
    },

    showPressRatings : function() {
        if (Watch.LOG)
            console.log("AppRouter.showPressRatings");
        var view = this.app.views.pressrating;
        view.model = this.app.views.filmdetail.model;
        if(view.model && view.model.id) {
            this.viewStackPush(view, Watch.strings.VIEW_PRESSRATE_TITLE);
        } else {
            location.href = "#/app/lesfilms";
        }
    },

    showPhotos : function() {
        if (Watch.LOG)
            console.log("AppRouter.showPhotos");
        var view = this.app.views.photos;
        view.model = this.app.views.filmdetail.model;
        if(view.model && view.model.id) {
            this.viewStackPush(view);
        } else {
            location.href = "#/app/lesfilms";
        }
    },

    showConditions : function() {
        if (Watch.LOG)
            console.log("AppRouter.showConditions");
        var view = this.app.views.conditions;
        view.model = Watch.app.models.conditions;
        this.viewStackPush(view);
    },

    showApropos : function() {
        if (Watch.LOG)
            console.log("AppRouter.showApropos");
        var view = this.app.views.apropos;
        view.model = Watch.app.models.conditions;
        this.viewStackPush(view, Watch.strings.VIEW_ABOUT_TITLE);

    },
    
    showLegalMentions: function(){
        var view = this.app.views.legalmentions;
        this.viewStackPush(view, Watch.strings.VIEW_LEGAL_TITLE);
    },

    showRights : function() {
        if (Watch.LOG)
            console.log("AppRouter.showRights");
        /*  var rightsView=  new RightsView({el: '#simpleView',
         template: '#emptyTemplate',
         model: Watch.app.models.conditions });
         console.log('showing user messshae ', Watch.app.models.user.message)
         rightsView.setContent(Watch.app.models.user.message); */

        var view = this.app.views.rights;
        rights.model = Watch.app.models.user;
        this.viewStackPush(view);
    },

    showWalkThrough : function() {
        if (Watch.LOG)
            console.log("AppRouter.showWalkThrough");
        var view = this.app.views.walkthrough;
        view.model = Watch.app.models.user;
        this.viewStackPush(view);

    },
    showCodeTutorial : function() {
        if (Watch.LOG)
            console.log("AppRouter.showCodeTutorial");
        var view = this.app.views.codetutorial;
        view.render();
    },

    showRateFilm : function(id) {
        if (Watch.LOG)
            console.log("AppRouter.showRateFilm");
        var view = this.app.views.ratefilm;
        if(view.model && view.model.id) {
            this.viewStackPush(view, Watch.strings.VIEW_RATEFILM_TITLE);
        } else {
            // no model set so reroute to les films page
            location.href = "#/app/lesfilms";
        }
        
    },

    showShowtimes : function(id) {
        if (Watch.LOG)
            console.log("AppRouter.showShowtimes");
        var view = this.app.views.showtimes;
        view.movieModel = Watch.app.views.filmdetail.model;
        if(view.movieModel && view.movieModel.id) {
            // we have an id so the model is valid
            this.viewStackPush(view, Watch.strings.VIEW_SHOWTIMES_NEARME_TITLE);
        } else {
            // no model set so reroute to les films page
            location.href = "#/app/lesfilms";
        }
    },

    showWatchmaDetails : function(list, id) {
        if (Watch.LOG) console.log("AppRouter.showWatchmaDetails", list, id);

        var view = this.app.views.Watchmadetail;
        view.model = this.app.collections[list].get(id);

        if(view.model && view.model.id) {
            this.viewStackPush(view);
        } else {
            location.href = "#/app/Watchma";
        }
    },

    showWatchmaFilmShowtimeDetails: function(list, id) {
        var view = this.app.views.Watchmafilmshowtime;
        view.model = this.app.models.Watchmafilm;
        if(list=="fav") {
            this.viewStackPush(view, Watch.strings.APP_HEADER_FAV_WatchMA);
        } else {
            this.viewStackPush(view);
        }
    },

    showConfig : function() {
        if (Watch.LOG) console.log("AppRouter.showConfig");
        var view = this.app.views.config;
        this.viewStackPush(view, "Developer Menu");
    }
});
