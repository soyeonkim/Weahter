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
       
        this.$el.html(this.template());
       // this.resize();
       // this.drawTicket();
        return this;
    },

    calculateCountdown: function() {
        var now = new Date();
        var dayNow = now.getDay();
        var countDownText = CINE.strings.DASH_241_COUNTDOWN;
        switch(dayNow) {
            case 0: {
                countDownText += 2;
            } break;
            case 1: {
                countDownText += 1;
            } break;
            case 2: {
                countDownText = CINE.strings.DASH_241_TODAY;
                this.$el.find("#monCodeLeft").addClass("tuesday-text");
            } break;
            case 3: {
                countDownText += 6;
            } break;
            case 4: {
                countDownText += 5;
            } break;
            case 5: {
                countDownText += 4;
            } break;
            case 6: {
                countDownText += 3;
            } break;
            default:
                break;
        }

        return countDownText;
    },

    drawTicket: function() {
        this.$el.find("#monCodeHeader").html("");
        this.$el.find("#monCodeText").html("");
        this.$el.find("#monCodeRight").html("");
        this.$el.find("#monCodeLeft").html("").removeClass("tuesday-text");
        this.$el.find("#monCodeSecondary").addClass("hidden");

        CINE.app.models.mobilecode.validateCode({silent: true});
        CINE.app.models.internetcode.validateCode({silent: true});
        var mcode = CINE.app.models.mobilecode.get("coupon");
        var icode = CINE.app.models.internetcode.get("coupon");
        var displayCode = "";
        if(mcode) {    
            // got a mobile code
            this.$el.find("#monCodeHeader").html(CINE.strings.DASH_241_MOBILE);
            displayCode = mcode;
            if(icode) {    
                // we have 2 tickets
                this.$el.find("#monCodeSecondary").removeClass("hidden");
            }
        } else if (icode) {
            // got an internet ticket
            this.$el.find("#monCodeHeader").html(CINE.strings.DASH_241_INTERNET);
            displayCode = icode;
        } else {
            this.$el.find("#monCodeRight").html(CINE.strings.DASH_241_NOTICKET);
            this.$el.find("#monCodeLeft").html(this.calculateCountdown());
        }

        this.$el.find("#monCodeText").html(displayCode);
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

    navigateCode : function() {
        if(CINE.LOG) console.log('DashView.navigateCode');

        this.$el.find("#lesFilms").addClass("animated-dash-lesfilms-offscreen");
        this.$el.find("#salle").addClass("animated-dash-salle-offscreen");

        setTimeout(function() {
            window.location.href = "#/app/moncode";
        }, 400);
    },

    navigateFilm : function() {
        if(CINE.LOG) console.log('DashView.navigateFilm');

        this.$el.find("#monCode").addClass("animated-dash-moncode-offscreen");
        this.$el.find("#monCodeSecondary").addClass("animated-dash-moncode-offscreen");
        this.$el.find("#salle").addClass("animated-dash-salle-offscreen");

        setTimeout(function() {
            window.location.href = "#/app/lesfilms";
        }, 400);
    },

    navigateCinema : function() {
        if (CINE.LOG) console.log('DashView.navigateCinema');

        this.$el.find("#monCode").addClass("animated-dash-moncode-offscreen");
        this.$el.find("#monCodeSecondary").addClass("animated-dash-moncode-offscreen");
        this.$el.find("#lesFilms").addClass("animated-dash-lesfilms-offscreen");

        setTimeout(function() {
            window.location.href = "#/app/cinema";
        }, 400);
    }

});
