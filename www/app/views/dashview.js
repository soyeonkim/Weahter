var DashView = Backbone.View.extend({

    isLoaded : false,
    events : {
        "click #dashMenuBtn": "openMenu",
        "click #lesFilms": "navigateFilm",
        "click #salle": "navigateCinema",
        "click #monCode": "navigateCode"
    },

    initialize : function() {
        console.log('DashView.initialize');
        this.template = Handlebars.compile($('#dashViewTemplate').html());
        console.log('DashView.InitDashLoad', this.dashload);

        var that = this;
        $(window).on("resize", function(e) {
            that.resize();
        });
       // that.render();
    },

    resize: function() {
         console.log("Resizing dash view");
        var lesFilmsContainer = this.$el.find("#lesFilms");
        var containerWidth = lesFilmsContainer.parent().width();
        var containerHeight = lesFilmsContainer.parent().height();

        var axis = "width";
        var otherAxis = "height";
        var dimension = Math.floor(containerWidth*0.9);
        
        if(containerWidth>containerHeight) {
            axis = "height";
            otherAxis = "width";
            dimension = Math.floor(containerHeight*0.9);
        }

        var top = (containerHeight-dimension)/2;
        var right = (containerWidth-dimension)/2;

        lesFilmsContainer.css(axis, dimension);
        lesFilmsContainer.css(otherAxis, dimension);
        lesFilmsContainer.css("top", top);
        lesFilmsContainer.css("right", right);
    },

    render : function(eventName) {
        var data = this.model.toJSON();
        console.log('DashView.render',data);
       
        this.$el.html(this.template(data));
       // this.resize();
       // this.drawTicket();
        return this;
    },

    

    openMenu: function() {
        CINE.app.router.toggleMenu();
    },

    reset : function() {
        if(!$("#dashContainer").length) {
            // the dash has not been rendered, render it first
            this.render();
        }
        
        // update the ticket in case the time/date display has changed
        this.drawTicket();
        
        var that = this;
        setTimeout(function() {
            that.$el.find("#lesFilms").removeClass("animated-dash-lesfilms-offscreen");
            that.$el.find("#monCode").removeClass("animated-dash-moncode-offscreen");
            that.$el.find("#monCodeSecondary").removeClass("animated-dash-moncode-offscreen");
            that.$el.find("#salle").removeClass("animated-dash-salle-offscreen");
        }, 500);

        var posterLoaded = function(e) {
            // image loaded, set new background
            var posterId = e.srcElement.posterId;
            var poster = $(posterId);
            poster.css("background-image", "url('" + e.srcElement.src + "')").removeClass("not-loaded");

            // only set the middle or bottom posters if not already set
            if($("#lesFilmsPosterMiddle").hasClass("not-loaded")) {
                loadPoster("#lesFilmsPosterMiddle");
            } else if($("#lesFilmsPosterBottom").hasClass("not-loaded")) {
                loadPoster("#lesFilmsPosterBottom");
            }
        };

        var loadPoster = function(posterId) {
            var collectionCount = CINE.app.collections.latest.length;
            if(collectionCount) {
                // select a cover at random
                var randomnumber = Math.floor(Math.random()*collectionCount);
                var coverUrl = CINE.app.collections.latest.at(randomnumber).get("cover");
                if(coverUrl) {
                    coverUrl = CINE.urls.coverUrl(coverUrl, "DASHCOVER");

                    // load image
                    var img = new Image();
                    img["posterId"] = posterId;
                    img.onload = posterLoaded;
                    img.src = coverUrl;
                }
            }
        };

        setTimeout(function() {
            // load the top poster first
            loadPoster("#lesFilmsPosterTop");
        }, 1200);
    },

    
});
