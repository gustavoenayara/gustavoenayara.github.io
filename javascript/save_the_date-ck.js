/**
 * Save the Date - Responsive Wedding Invitation
 * -----------
 *
 * author: PeHaa Hetman
 * email: info@pehaa.com
 *
 * version 1.0 release date: 24.03.2013
 *
 **/
var save_the_date = {
    defaults: {
        weddingDate: "",
        labels: ["days", "hours", "minutes", "secs"],
        sendServerMessages: ["Thank you.", "Sorry, your message could not be sent due to an error."],
        gallery: [],
        titles: []
    },
    option: {},
    init: function(e) {
        var t = this;
        t.option = $.extend({}, t.defaults, e);
        if (t.option.weddingDate !== "") {
            t.weddingDate = new Date(t.option.weddingDate);
            t.setCountDown();
            t.days = $("#days");
            t.hours = $("#hours");
            t.minutes = $("#minutes");
            t.seconds = $("#seconds");
            t.doCountDown()
        }
        t.option.gallery.length > 0 && t.openGallery();
        $("#full-menu").on("click", function() {
            $(this).parent(".nav").toggleClass("full");
            return !1
        });
        var n;
        $(".to-scroll").bind("click", function(e) {
            e.preventDefault();
            var t = $(this);
            $(".active").removeClass("active");
            t.addClass("active");
            if (r && $(window).width() > 1023 && $(window).height() > 829) {
                switch (t.attr("href")) {
                    case "#top":
                        n = 0;
                        break;
                    case "#about":
                        n = o;
                        break;
                    default:
                        n = $(t.attr("href")).offset().top - 88
                }
                $("html, body").stop().animate({
                    scrollTop: n
                })
            } else r && $(window).width() > 767 ? $("html, body").stop().animate({
                scrollTop: $(t.attr("href")).offset().top - 88
            }) : $("html, body").stop().animate({
                scrollTop: $(t.attr("href")).offset().top
            }, 1500)
        });
        $(window).load(function() {
            $(".flexslider").flexslider({
                prevText: "&lsaquo;",
                nextText: "&rsaquo;",
                controlNav: !1
            })
        });
        $(".map").click(function() {
            $(window).height() - $(this).offset().top + $(window).scrollTop() < 380 && $("html, body").stop().animate({
                scrollTop: 430 - $(window).height() + $(this).offset().top
            }, 500);
            var e, t = $(this).attr("data-lat"),
                n = $(this).attr("data-lng"),
                r = $(this).attr("data-title");
            $(this).next(".my_map").fadeIn(1500);
            var i = $(this).next(".my_map").children("div").attr("id");
            e = new GMaps({
                el: i,
                lat: t,
                lng: n
            });
            e.addMarker({
                lat: t,
                lng: n,
                title: r
            })
        });
        var r = !Modernizr.touch,
            i = 92,
            s, o, u = function() {
                var e = $(window).scrollTop();
                $(".header h2").css("opacity", (s - .75 * e) / s);
                e > o ? $(".header").removeClass("fixed").addClass("scrolled").css("top", o + i) : $(".header").addClass("fixed").removeClass("scrolled").css("top", i)
            },
            a = function() {
                s = parseInt($("h1").css("height"), 10) + parseInt($(".images").css("height"), 10) + i + 64 + 16, o = parseInt($(".content").css("top"), 10) - s;
                if (r && $(window).width() > 1023 && $(window).height() > 830) {
                    $(".header").removeClass("wide-short");
                    $(window).scrollTop() <= o ? $(".header").removeClass("scrolled").addClass("fixed").css("top", i) : $(".header").removeClass("fixed").addClass("scrolled").css("top", o + i);
                    $(window).bind("scroll", u)
                } else {
                    $(window).unbind("scroll", u);
                    $(".header h2").css("opacity", 1);
                    r && $(window).width() > 767 && $(".header").removeClass("fixed").removeClass("scrolled").addClass("wide-short")
                }
            };
        $(window).resize(function() {
            a()
        });
        a();
        t.rsvp()
    },
    openGallery: function() {
        var e = this;
        $(document).on("click", "#gallery", function() {
            var t = [];
            $(e.option.gallery).each(function(n, r) {
                t[n] = {
                    href: r,
                    title: e.option.titles[n]
                }
            });
            $.fancybox.open(t);
            $(".active").removeClass("active");
            $("#gallery").addClass("active");
            return !1
        })
    },
    setCountDown: function() {
        var e = this,
            t = new Date;
        e.secondsDiff = Math.floor((e.weddingDate.getTime() - t.getTime()) / 1e3);
        var n = 'em <span id="days"></span> ' + e.option.labels[0] + '  <span id="hours"></span> ' + e.option.labels[1] + '  <span id="minutes"></span> ' + e.option.labels[2] + '  <small><span id="seconds"></span> ' + e.option.labels[3] + "</small>";
        $("#timer").html(n)
    },
    doCountDown: function() {
        var e = this,
            t = function() {
                setTimeout(function() {
                    requestAnimationFrame(t);
                    var n = new Date,
                        r = Math.floor((e.weddingDate.getTime() - n.getTime()) / 1e3),
                        i = r,
                        s = Math.floor(i / 60),
                        o = Math.floor(s / 60),
                        u = Math.floor(o / 24);
                    o %= 24;
                    s %= 60;
                    i %= 60;
                    e.days.html(Math.max(u, 0));
                    e.hours.html(Math.max(o, 0));
                    e.minutes.html(Math.max(s, 0));
                    e.seconds.html(Math.max(i, 0))
                }, 1e3)
            };
        t()
    },
    rsvp: function() {
        var e = this;
        $("#check-reception:checked").parent().parent().next("#guests").show();
        $("#check-reception").change(function() {
            $("#guests").slideToggle("slow")
        });
        if (!Modernizr.input.placeholder) {
            var t = ["#name", "#email", "textarea", "#adults", "#children"];
            $(t).each(function(e, t) {
                $(t).val($(t).attr("placeholder"))
            })
        }
        $("#rsvp form").submit(function() {
            var t = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                n = $("#email").val(),
                r = $("#name").val(),
                i = $("#check-reception").is(":checked"),
                s = $("#adults").val(),
                o = !1;
            $(".error").removeClass("error");
            if (i && s !== undefined && (s === "" || s === $("#adults").attr("placeholder"))) {
                $("#adults").addClass("error");
                o = !0
            }
            if (r === "" || r === $("#name").attr("placeholder")) {
                $("#name").addClass("error");
                o = !0
            }
            if (n === "" || t.test(n) === !1) {
                $("#email").addClass("error");
                o = !0
            }
            if (!o) {
                var u = $(this),
                    a = $(u).serialize(),
                    f = $("#note");
                $.ajax({
                    type: "POST",
                    url: "send.php",
                    data: a,
                    success: function(t) {
                        var n = "";
                        switch (t) {
                            case "success":
                                $(u).hide();
                                $("html, body").animate({
                                    scrollTop: $(document).height()
                                }, "slow");
                                n = e.option.sendServerMessages[0];
                                break;
                            case "error":
                                n = e.option.sendServerMessages[1]
                        }
                        f.html(n)
                    }
                });
                return !1
            }
            return !1
        })
    }
};
(function() {
    var e = 0,
        t = ["ms", "moz", "webkit", "o"];
    for (var n = 0; n < t.length && !window.requestAnimationFrame; ++n) {
        window.requestAnimationFrame = window[t[n] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[t[n] + "CancelAnimationFrame"] || window[t[n] + "CancelRequestAnimationFrame"]
    }
    window.requestAnimationFrame || (window.requestAnimationFrame = function(t, n) {
        var r = (new Date).getTime(),
            i = Math.max(0, 16 - (r - e)),
            s = window.setTimeout(function() {
                t(r + i)
            }, i);
        e = r + i;
        return s
    });
    window.cancelAnimationFrame || (window.cancelAnimationFrame = function(e) {
        clearTimeout(e)
    })
})();