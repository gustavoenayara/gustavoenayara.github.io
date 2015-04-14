/*!
 * GMaps.js v0.3.1
 * http://hpneo.github.com/gmaps/
 *
 * Copyright 2012, Gustavo Leon
 * Released under the MIT License.
 */
/*

/*! fancyBox v2.1.4 fancyapps.com | fancyapps.com/fancybox/#license 
	*fancyBox Multi Domain License, 
	*License Name: Paulina Hetman	
*/
/* jQuery FlexSlider v2.1
 * http://www.woothemes.com/flexslider/
 *
 * Copyright 2012 WooThemes
 * Free to use under the GPLv2 license.
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Contributing author: Tyler Smith (@mbmufffin)
 */
if (!window.google || !window.google.maps) throw "Google Maps API is required. Please register the following JavaScript library http://maps.google.com/maps/api/js?sensor=true.";
var GMaps = function(e) {
        "use strict";
        var t = document,
            n = function(n, r) {
                var i;
                "jQuery" in e && r ? i = $("#" + n.replace("#", ""), r)[0] : i = t.getElementById(n.replace("#", ""));
                return i
            },
            r = function(e) {
                var i = this,
                    s = ["bounds_changed", "center_changed", "click", "dblclick", "drag", "dragend", "dragstart", "idle", "maptypeid_changed", "projection_changed", "resize", "tilesloaded", "zoom_changed"],
                    o = ["mousemove", "mouseout", "mouseover"];
                window.context_menu = {};
                typeof e.el == "string" || typeof e.div == "string" ? this.el = n(e.el || e.div, e.context) : this.el = e.el || e.div;
                if (typeof this.el == "undefined" || this.el === null) throw "No element defined.";
                this.el.style.width = e.width || this.el.scrollWidth || this.el.offsetWidth;
                this.el.style.height = e.height || this.el.scrollHeight || this.el.offsetHeight;
                this.controls = [];
                this.overlays = [];
                this.layers = [];
                this.singleLayers = {};
                this.markers = [];
                this.polylines = [];
                this.routes = [];
                this.polygons = [];
                this.infoWindow = null;
                this.overlay_el = null;
                this.zoom = e.zoom || 15;
                this.registered_events = {};
                var u = e.markerClusterer,
                    a;
                e.mapType ? a = google.maps.MapTypeId[e.mapType.toUpperCase()] : a = google.maps.MapTypeId.ROADMAP;
                var f = new google.maps.LatLng(e.lat, e.lng);
                delete e.el;
                delete e.lat;
                delete e.lng;
                delete e.mapType;
                delete e.width;
                delete e.height;
                delete e.markerClusterer;
                var l = e.zoomControlOpt || {
                        style: "DEFAULT",
                        position: "TOP_LEFT"
                    },
                    c = e.zoomControl || !0,
                    h = l.style || "DEFAULT",
                    p = l.position || "TOP_LEFT",
                    d = e.panControl || !0,
                    v = e.mapTypeControl || !0,
                    m = e.scaleControl || !0,
                    g = e.streetViewControl || !0,
                    y = y || !0,
                    b = {},
                    w = {
                        zoom: this.zoom,
                        center: f,
                        mapTypeId: a
                    },
                    E = {
                        panControl: d,
                        zoomControl: c,
                        zoomControlOptions: {
                            style: google.maps.ZoomControlStyle[h],
                            position: google.maps.ControlPosition[p]
                        },
                        mapTypeControl: v,
                        scaleControl: m,
                        streetViewControl: g,
                        overviewMapControl: y
                    };
                e.disableDefaultUI != 1 && (w = extend_object(w, E));
                b = extend_object(w, e);
                for (var S = 0; S < s.length; S++) delete b[s[S]];
                for (var S = 0; S < o.length; S++) delete b[o[S]];
                this.map = new google.maps.Map(this.el, b);
                u && (this.markerClusterer = u.apply(this, [this.map]));
                var x = function(e) {
                        var t = 0,
                            n = 0;
                        if (e.offsetParent)
                            do {
                                t += e.offsetLeft;
                                n += e.offsetTop
                            } while (e = e.offsetParent);
                        return [t, n]
                    },
                    T = function(e, t) {
                        var r = "",
                            s = window.context_menu[e];
                        for (var o in s)
                            if (s.hasOwnProperty(o)) {
                                var u = s[o];
                                r += '<li><a id="' + e + "_" + o + '" href="#">' + u.title + "</a></li>"
                            }
                        if (!n("gmaps_context_menu")) return;
                        var a = n("gmaps_context_menu");
                        a.innerHTML = r;
                        var f = a.getElementsByTagName("a"),
                            l = f.length;
                        for (var o = 0; o < l; o++) {
                            var c = f[o],
                                h = function(n) {
                                    n.preventDefault();
                                    s[this.id.replace(e + "_", "")].action.apply(i, [t]);
                                    i.hideContextMenu()
                                };
                            google.maps.event.clearListeners(c, "click");
                            google.maps.event.addDomListenerOnce(c, "click", h, !1)
                        }
                        var p = x.apply(this, [i.el]),
                            d = p[0] + t.pixel.x - 15,
                            v = p[1] + t.pixel.y - 15;
                        a.style.left = d + "px";
                        a.style.top = v + "px";
                        a.style.display = "block"
                    },
                    N = function(e, t) {
                        if (e === "marker") {
                            t.pixel = {};
                            var n = new google.maps.OverlayView;
                            n.setMap(i.map);
                            n.draw = function() {
                                var r = n.getProjection(),
                                    i = t.marker.getPosition();
                                t.pixel = r.fromLatLngToContainerPixel(i);
                                T(e, t)
                            }
                        } else T(e, t)
                    };
                this.setContextMenu = function(e) {
                    window.context_menu[e.control] = {};
                    for (var r in e.options)
                        if (e.options.hasOwnProperty(r)) {
                            var i = e.options[r];
                            window.context_menu[e.control][i.name] = {
                                title: i.title,
                                action: i.action
                            }
                        }
                    var s = t.createElement("ul");
                    s.id = "gmaps_context_menu";
                    s.style.display = "none";
                    s.style.position = "absolute";
                    s.style.minWidth = "100px";
                    s.style.background = "white";
                    s.style.listStyle = "none";
                    s.style.padding = "8px";
                    s.style.boxShadow = "2px 2px 6px #ccc";
                    t.body.appendChild(s);
                    var o = n("gmaps_context_menu");
                    google.maps.event.addDomListener(o, "mouseout", function(e) {
                        (!e.relatedTarget || !this.contains(e.relatedTarget)) && window.setTimeout(function() {
                            o.style.display = "none"
                        }, 400)
                    }, !1)
                };
                this.hideContextMenu = function() {
                    var e = n("gmaps_context_menu");
                    e && (e.style.display = "none")
                };
                var C = function(t, n) {
                    google.maps.event.addListener(t, n, function(t) {
                        t == undefined && (t = this);
                        e[n].apply(this, [t]);
                        i.hideContextMenu()
                    })
                };
                for (var k = 0; k < s.length; k++) {
                    var L = s[k];
                    L in e && C(this.map, L)
                }
                for (var k = 0; k < o.length; k++) {
                    var L = o[k];
                    L in e && C(this.map, L)
                }
                google.maps.event.addListener(this.map, "rightclick", function(t) {
                    e.rightclick && e.rightclick.apply(this, [t]);
                    window.context_menu["map"] != undefined && N("map", t)
                });
                this.refresh = function() {
                    google.maps.event.trigger(this.map, "resize")
                };
                this.fitZoom = function() {
                    var e = [],
                        t = this.markers.length;
                    for (var n = 0; n < t; n++) e.push(this.markers[n].getPosition());
                    this.fitLatLngBounds(e)
                };
                this.fitLatLngBounds = function(e) {
                    var t = e.length,
                        n = new google.maps.LatLngBounds;
                    for (var r = 0; r < t; r++) n.extend(e[r]);
                    this.map.fitBounds(n)
                };
                this.setCenter = function(e, t, n) {
                    this.map.panTo(new google.maps.LatLng(e, t));
                    n && n()
                };
                this.getElement = function() {
                    return this.el
                };
                this.zoomIn = function(e) {
                    e = e || 1;
                    this.zoom = this.map.getZoom() + e;
                    this.map.setZoom(this.zoom)
                };
                this.zoomOut = function(e) {
                    e = e || 1;
                    this.zoom = this.map.getZoom() - e;
                    this.map.setZoom(this.zoom)
                };
                var A = [];
                for (var O in this.map) typeof this.map[O] == "function" && !this[O] && A.push(O);
                for (var S = 0; S < A.length; S++)(function(e, t, n) {
                    e[n] = function() {
                        return t[n].apply(t, arguments)
                    }
                })(this, this.map, A[S]);
                this.createControl = function(e) {
                    var n = t.createElement("div");
                    n.style.cursor = "pointer";
                    n.style.fontFamily = "Arial, sans-serif";
                    n.style.fontSize = "13px";
                    n.style.boxShadow = "rgba(0, 0, 0, 0.398438) 0px 2px 4px";
                    for (var r in e.style) n.style[r] = e.style[r];
                    e.id && (n.id = e.id);
                    e.classes && (n.className = e.classes);
                    e.content && (n.innerHTML = e.content);
                    for (var i in e.events)(function(t, n) {
                        google.maps.event.addDomListener(t, n, function() {
                            e.events[n].apply(this, [this])
                        })
                    })(n, i);
                    n.index = 1;
                    return n
                };
                this.addControl = function(e) {
                    var t = google.maps.ControlPosition[e.position.toUpperCase()];
                    delete e.position;
                    var n = this.createControl(e);
                    this.controls.push(n);
                    this.map.controls[t].push(n);
                    return n
                };
                this.createMarker = function(e) {
                    if (e.hasOwnProperty("lat") && e.hasOwnProperty("lng") || e.position) {
                        var t = this,
                            n = e.details,
                            r = e.fences,
                            i = e.outside,
                            s = {
                                position: new google.maps.LatLng(e.lat, e.lng),
                                map: null
                            };
                        delete e.lat;
                        delete e.lng;
                        delete e.fences;
                        delete e.outside;
                        var o = extend_object(s, e),
                            u = new google.maps.Marker(o);
                        u.fences = r;
                        if (e.infoWindow) {
                            u.infoWindow = new google.maps.InfoWindow(e.infoWindow);
                            var a = ["closeclick", "content_changed", "domready", "position_changed", "zindex_changed"];
                            for (var f = 0; f < a.length; f++)(function(t, n) {
                                e.infoWindow[n] && google.maps.event.addListener(t, n, function(t) {
                                    e.infoWindow[n].apply(this, [t])
                                })
                            })(u.infoWindow, a[f])
                        }
                        var l = ["animation_changed", "clickable_changed", "cursor_changed", "draggable_changed", "flat_changed", "icon_changed", "position_changed", "shadow_changed", "shape_changed", "title_changed", "visible_changed", "zindex_changed"],
                            c = ["dblclick", "drag", "dragend", "dragstart", "mousedown", "mouseout", "mouseover", "mouseup"];
                        for (var f = 0; f < l.length; f++)(function(t, n) {
                            e[n] && google.maps.event.addListener(t, n, function() {
                                e[n].apply(this, [this])
                            })
                        })(u, l[f]);
                        for (var f = 0; f < c.length; f++)(function(t, n, r) {
                            e[r] && google.maps.event.addListener(n, r, function(n) {
                                n.pixel || (n.pixel = t.getProjection().fromLatLngToPoint(n.latLng));
                                e[r].apply(this, [n])
                            })
                        })(this.map, u, c[f]);
                        google.maps.event.addListener(u, "click", function() {
                            this.details = n;
                            e.click && e.click.apply(this, [this]);
                            if (u.infoWindow) {
                                t.hideInfoWindows();
                                u.infoWindow.open(t.map, u)
                            }
                        });
                        google.maps.event.addListener(u, "rightclick", function(t) {
                            t.marker = this;
                            e.rightclick && e.rightclick.apply(this, [t]);
                            window.context_menu["marker"] != undefined && N("marker", t)
                        });
                        u.fences && google.maps.event.addListener(u, "dragend", function() {
                            t.checkMarkerGeofence(u, function(e, t) {
                                i(e, t)
                            })
                        });
                        return u
                    }
                    throw "No latitude or longitude defined."
                };
                this.addMarker = function(e) {
                    var t;
                    if (e.hasOwnProperty("gm_accessors_")) t = e;
                    else {
                        if (!(e.hasOwnProperty("lat") && e.hasOwnProperty("lng") || e.position)) throw "No latitude or longitude defined.";
                        t = this.createMarker(e)
                    }
                    t.setMap(this.map);
                    this.markerClusterer && this.markerClusterer.addMarker(t);
                    this.markers.push(t);
                    r.fire("marker_added", t, this);
                    return t
                };
                this.addMarkers = function(e) {
                    for (var t = 0, n; n = e[t]; t++) this.addMarker(n);
                    return this.markers
                };
                this.hideInfoWindows = function() {
                    for (var e = 0, t; t = this.markers[e]; e++) t.infoWindow && t.infoWindow.close()
                };
                this.removeMarker = function(e) {
                    for (var t = 0; t < this.markers.length; t++)
                        if (this.markers[t] === e) {
                            this.markers[t].setMap(null);
                            this.markers.splice(t, 1);
                            r.fire("marker_removed", e, this);
                            break
                        }
                    return e
                };
                this.removeMarkers = function(e) {
                    var e = e || this.markers;
                    for (var t = 0; t < this.markers.length; t++) this.markers[t] === e[t] && this.markers[t].setMap(null);
                    var n = [];
                    for (var t = 0; t < this.markers.length; t++) this.markers[t].getMap() != null && n.push(this.markers[t]);
                    this.markers = n
                };
                this.drawOverlay = function(e) {
                    var n = new google.maps.OverlayView;
                    n.setMap(i.map);
                    var r = !0;
                    e.auto_show != null && (r = e.auto_show);
                    n.onAdd = function() {
                        var r = t.createElement("div");
                        r.style.borderStyle = "none";
                        r.style.borderWidth = "0px";
                        r.style.position = "absolute";
                        r.style.zIndex = 100;
                        r.innerHTML = e.content;
                        n.el = r;
                        var i = this.getPanes();
                        e.layer || (e.layer = "overlayLayer");
                        var s = i[e.layer];
                        s.appendChild(r);
                        var o = ["contextmenu", "DOMMouseScroll", "dblclick", "mousedown"];
                        for (var u = 0; u < o.length; u++)(function(e, t) {
                            google.maps.event.addDomListener(e, t, function(e) {
                                if (navigator.userAgent.toLowerCase().indexOf("msie") != -1 && document.all) {
                                    e.cancelBubble = !0;
                                    e.returnValue = !1
                                } else e.stopPropagation()
                            })
                        })(r, o[u]);
                        google.maps.event.trigger(this, "ready")
                    };
                    n.draw = function() {
                        var t = this.getProjection(),
                            i = t.fromLatLngToDivPixel(new google.maps.LatLng(e.lat, e.lng));
                        e.horizontalOffset = e.horizontalOffset || 0;
                        e.verticalOffset = e.verticalOffset || 0;
                        var s = n.el,
                            o = s.children[0],
                            u = o.clientHeight,
                            a = o.clientWidth;
                        switch (e.verticalAlign) {
                            case "top":
                                s.style.top = i.y - u + e.verticalOffset + "px";
                                break;
                            default:
                            case "middle":
                                s.style.top = i.y - u / 2 + e.verticalOffset + "px";
                                break;
                            case "bottom":
                                s.style.top = i.y + e.verticalOffset + "px"
                        }
                        switch (e.horizontalAlign) {
                            case "left":
                                s.style.left = i.x - a + e.horizontalOffset + "px";
                                break;
                            default:
                            case "center":
                                s.style.left = i.x - a / 2 + e.horizontalOffset + "px";
                                break;
                            case "right":
                                s.style.left = i.x + e.horizontalOffset + "px"
                        }
                        s.style.display = r ? "block" : "none";
                        r || e.show.apply(this, [s])
                    };
                    n.onRemove = function() {
                        var t = n.el;
                        if (e.remove) e.remove.apply(this, [t]);
                        else {
                            n.el.parentNode.removeChild(n.el);
                            n.el = null
                        }
                    };
                    i.overlays.push(n);
                    return n
                };
                this.removeOverlay = function(e) {
                    for (var t = 0; t < this.overlays.length; t++)
                        if (this.overlays[t] === e) {
                            this.overlays[t].setMap(null);
                            this.overlays.splice(t, 1);
                            break
                        }
                };
                this.removeOverlays = function() {
                    for (var e = 0, t; t = i.overlays[e]; e++) t.setMap(null);
                    i.overlays = []
                };
                this.drawPolyline = function(e) {
                    var t = [],
                        n = e.path;
                    if (n.length)
                        if (n[0][0] === undefined) t = n;
                        else
                            for (var i = 0, s; s = n[i]; i++) t.push(new google.maps.LatLng(s[0], s[1]));
                    var o = {
                        map: this.map,
                        path: t,
                        strokeColor: e.strokeColor,
                        strokeOpacity: e.strokeOpacity,
                        strokeWeight: e.strokeWeight,
                        geodesic: e.geodesic,
                        clickable: !0,
                        editable: !1,
                        visible: !0
                    };
                    e.hasOwnProperty("clickable") && (o.clickable = e.clickable);
                    e.hasOwnProperty("editable") && (o.editable = e.editable);
                    e.hasOwnProperty("icons") && (o.icons = e.icons);
                    e.hasOwnProperty("zIndex") && (o.zIndex = e.zIndex);
                    var u = new google.maps.Polyline(o),
                        a = ["click", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "rightclick"];
                    for (var f = 0; f < a.length; f++)(function(t, n) {
                        e[n] && google.maps.event.addListener(t, n, function(t) {
                            e[n].apply(this, [t])
                        })
                    })(u, a[f]);
                    this.polylines.push(u);
                    r.fire("polyline_added", u, this);
                    return u
                };
                this.removePolyline = function(e) {
                    for (var t = 0; t < this.polylines.length; t++)
                        if (this.polylines[t] === e) {
                            this.polylines[t].setMap(null);
                            this.polylines.splice(t, 1);
                            r.fire("polyline_removed", e, this);
                            break
                        }
                };
                this.removePolylines = function() {
                    for (var e = 0, t; t = i.polylines[e]; e++) t.setMap(null);
                    i.polylines = []
                };
                this.drawCircle = function(e) {
                    e = extend_object({
                        map: this.map,
                        center: new google.maps.LatLng(e.lat, e.lng)
                    }, e);
                    delete e.lat;
                    delete e.lng;
                    var t = new google.maps.Circle(e),
                        n = ["click", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "rightclick"];
                    for (var r = 0; r < n.length; r++)(function(t, n) {
                        e[n] && google.maps.event.addListener(t, n, function(t) {
                            e[n].apply(this, [t])
                        })
                    })(t, n[r]);
                    this.polygons.push(t);
                    return t
                };
                this.drawRectangle = function(e) {
                    e = extend_object({
                        map: this.map
                    }, e);
                    var t = new google.maps.LatLngBounds(new google.maps.LatLng(e.bounds[0][0], e.bounds[0][1]), new google.maps.LatLng(e.bounds[1][0], e.bounds[1][1]));
                    e.bounds = t;
                    var n = new google.maps.Rectangle(e),
                        r = ["click", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "rightclick"];
                    for (var i = 0; i < r.length; i++)(function(t, n) {
                        e[n] && google.maps.event.addListener(t, n, function(t) {
                            e[n].apply(this, [t])
                        })
                    })(n, r[i]);
                    this.polygons.push(n);
                    return n
                };
                this.drawPolygon = function(e) {
                    var t = !1;
                    e.hasOwnProperty("useGeoJSON") && (t = e.useGeoJSON);
                    delete e.useGeoJSON;
                    e = extend_object({
                        map: this.map
                    }, e);
                    t == 0 && (e.paths = [e.paths.slice(0)]);
                    e.paths.length > 0 && e.paths[0].length > 0 && (e.paths = array_flat(array_map(e.paths, arrayToLatLng, t)));
                    var n = new google.maps.Polygon(e),
                        i = ["click", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "rightclick"];
                    for (var s = 0; s < i.length; s++)(function(t, n) {
                        e[n] && google.maps.event.addListener(t, n, function(t) {
                            e[n].apply(this, [t])
                        })
                    })(n, i[s]);
                    this.polygons.push(n);
                    r.fire("polygon_added", n, this);
                    return n
                };
                this.removePolygon = function(e) {
                    for (var t = 0; t < this.polygons.length; t++)
                        if (this.polygons[t] === e) {
                            this.polygons[t].setMap(null);
                            this.polygons.splice(t, 1);
                            r.fire("polygon_removed", e, this);
                            break
                        }
                };
                this.removePolygons = function() {
                    for (var e = 0, t; t = i.polygons[e]; e++) t.setMap(null);
                    i.polygons = []
                };
                this.getFromFusionTables = function(e) {
                    var t = e.events;
                    delete e.events;
                    var n = e,
                        r = new google.maps.FusionTablesLayer(n);
                    for (var i in t)(function(e, n) {
                        google.maps.event.addListener(e, n, function(e) {
                            t[n].apply(this, [e])
                        })
                    })(r, i);
                    this.layers.push(r);
                    return r
                };
                this.loadFromFusionTables = function(e) {
                    var t = this.getFromFusionTables(e);
                    t.setMap(this.map);
                    return t
                };
                this.getFromKML = function(e) {
                    var t = e.url,
                        n = e.events;
                    delete e.url;
                    delete e.events;
                    var r = e,
                        i = new google.maps.KmlLayer(t, r);
                    for (var s in n)(function(e, t) {
                        google.maps.event.addListener(e, t, function(e) {
                            n[t].apply(this, [e])
                        })
                    })(i, s);
                    this.layers.push(i);
                    return i
                };
                this.loadFromKML = function(e) {
                    var t = this.getFromKML(e);
                    t.setMap(this.map);
                    return t
                };
                var M, _;
                this.getRoutes = function(e) {
                    switch (e.travelMode) {
                        case "bicycling":
                            M = google.maps.TravelMode.BICYCLING;
                            break;
                        case "transit":
                            M = google.maps.TravelMode.TRANSIT;
                            break;
                        case "driving":
                            M = google.maps.TravelMode.DRIVING;
                            break;
                        default:
                            M = google.maps.TravelMode.WALKING
                    }
                    e.unitSystem === "imperial" ? _ = google.maps.UnitSystem.IMPERIAL : _ = google.maps.UnitSystem.METRIC;
                    var t = {
                            avoidHighways: !1,
                            avoidTolls: !1,
                            optimizeWaypoints: !1,
                            waypoints: []
                        },
                        n = extend_object(t, e);
                    n.origin = /string/.test(typeof e.origin) ? e.origin : new google.maps.LatLng(e.origin[0], e.origin[1]);
                    n.destination = new google.maps.LatLng(e.destination[0], e.destination[1]);
                    n.travelMode = M;
                    n.unitSystem = _;
                    delete n.callback;
                    var r = this,
                        i = new google.maps.DirectionsService;
                    i.route(n, function(t, n) {
                        if (n === google.maps.DirectionsStatus.OK)
                            for (var i in t.routes) t.routes.hasOwnProperty(i) && r.routes.push(t.routes[i]);
                        e.callback && e.callback(r.routes)
                    })
                };
                this.removeRoutes = function() {
                    this.routes = []
                };
                this.getElevations = function(e) {
                    e = extend_object({
                        locations: [],
                        path: !1,
                        samples: 256
                    }, e);
                    e.locations.length > 0 && e.locations[0].length > 0 && (e.locations = array_flat(array_map([e.locations], arrayToLatLng, !1)));
                    var t = e.callback;
                    delete e.callback;
                    var n = new google.maps.ElevationService;
                    if (!e.path) {
                        delete e.path;
                        delete e.samples;
                        n.getElevationForLocations(e, function(e, n) {
                            t && typeof t == "function" && t(e, n)
                        })
                    } else {
                        var r = {
                            path: e.locations,
                            samples: e.samples
                        };
                        n.getElevationAlongPath(r, function(e, n) {
                            t && typeof t == "function" && t(e, n)
                        })
                    }
                };
                this.cleanRoute = this.removePolylines;
                this.drawRoute = function(e) {
                    var t = this;
                    this.getRoutes({
                        origin: e.origin,
                        destination: e.destination,
                        travelMode: e.travelMode,
                        waypoints: e.waypoints,
                        unitSystem: e.unitSystem,
                        callback: function(n) {
                            if (n.length > 0) {
                                t.drawPolyline({
                                    path: n[n.length - 1].overview_path,
                                    strokeColor: e.strokeColor,
                                    strokeOpacity: e.strokeOpacity,
                                    strokeWeight: e.strokeWeight
                                });
                                e.callback && e.callback(n[n.length - 1])
                            }
                        }
                    })
                };
                this.travelRoute = function(e) {
                    if (e.origin && e.destination) this.getRoutes({
                        origin: e.origin,
                        destination: e.destination,
                        travelMode: e.travelMode,
                        waypoints: e.waypoints,
                        callback: function(t) {
                            t.length > 0 && e.start && e.start(t[t.length - 1]);
                            if (t.length > 0 && e.step) {
                                var n = t[t.length - 1];
                                if (n.legs.length > 0) {
                                    var r = n.legs[0].steps;
                                    for (var i = 0, s; s = r[i]; i++) {
                                        s.step_number = i;
                                        e.step(s, n.legs[0].steps.length - 1)
                                    }
                                }
                            }
                            t.length > 0 && e.end && e.end(t[t.length - 1])
                        }
                    });
                    else if (e.route && e.route.legs.length > 0) {
                        var t = e.route.legs[0].steps;
                        for (var n = 0, r; r = t[n]; n++) {
                            r.step_number = n;
                            e.step(r)
                        }
                    }
                };
                this.drawSteppedRoute = function(e) {
                    if (e.origin && e.destination) this.getRoutes({
                        origin: e.origin,
                        destination: e.destination,
                        travelMode: e.travelMode,
                        waypoints: e.waypoints,
                        callback: function(t) {
                            t.length > 0 && e.start && e.start(t[t.length - 1]);
                            if (t.length > 0 && e.step) {
                                var n = t[t.length - 1];
                                if (n.legs.length > 0) {
                                    var r = n.legs[0].steps;
                                    for (var s = 0, o; o = r[s]; s++) {
                                        o.step_number = s;
                                        i.drawPolyline({
                                            path: o.path,
                                            strokeColor: e.strokeColor,
                                            strokeOpacity: e.strokeOpacity,
                                            strokeWeight: e.strokeWeight
                                        });
                                        e.step(o, n.legs[0].steps.length - 1)
                                    }
                                }
                            }
                            t.length > 0 && e.end && e.end(t[t.length - 1])
                        }
                    });
                    else if (e.route && e.route.legs.length > 0) {
                        var t = e.route.legs[0].steps;
                        for (var n = 0, r; r = t[n]; n++) {
                            r.step_number = n;
                            i.drawPolyline({
                                path: r.path,
                                strokeColor: e.strokeColor,
                                strokeOpacity: e.strokeOpacity,
                                strokeWeight: e.strokeWeight
                            });
                            e.step(r)
                        }
                    }
                };
                this.checkGeofence = function(e, t, n) {
                    return n.containsLatLng(new google.maps.LatLng(e, t))
                };
                this.checkMarkerGeofence = function(e, t) {
                    if (e.fences)
                        for (var n = 0, r; r = e.fences[n]; n++) {
                            var s = e.getPosition();
                            i.checkGeofence(s.lat(), s.lng(), r) || t(e, r)
                        }
                };
                this.addLayer = function(e, t) {
                    t = t || {};
                    var n;
                    switch (e) {
                        case "weather":
                            this.singleLayers.weather = n = new google.maps.weather.WeatherLayer;
                            break;
                        case "clouds":
                            this.singleLayers.clouds = n = new google.maps.weather.CloudLayer;
                            break;
                        case "traffic":
                            this.singleLayers.traffic = n = new google.maps.TrafficLayer;
                            break;
                        case "transit":
                            this.singleLayers.transit = n = new google.maps.TransitLayer;
                            break;
                        case "bicycling":
                            this.singleLayers.bicycling = n = new google.maps.BicyclingLayer;
                            break;
                        case "panoramio":
                            this.singleLayers.panoramio = n = new google.maps.panoramio.PanoramioLayer;
                            n.setTag(t.filter);
                            delete t.filter;
                            t.click && google.maps.event.addListener(n, "click", function(e) {
                                t.click(e);
                                delete t.click
                            });
                            break;
                        case "places":
                            this.singleLayers.places = n = new google.maps.places.PlacesService(this.map);
                            if (t.search || t.nearbySearch) {
                                var r = {
                                    bounds: t.bounds || null,
                                    keyword: t.keyword || null,
                                    location: t.location || null,
                                    name: t.name || null,
                                    radius: t.radius || null,
                                    rankBy: t.rankBy || null,
                                    types: t.types || null
                                };
                                t.search && n.search(r, t.search);
                                t.nearbySearch && n.nearbySearch(r, t.nearbySearch)
                            }
                            if (t.textSearch) {
                                var i = {
                                    bounds: t.bounds || null,
                                    location: t.location || null,
                                    query: t.query || null,
                                    radius: t.radius || null
                                };
                                n.textSearch(i, t.textSearch)
                            }
                    }
                    if (n !== undefined) {
                        typeof n.setOptions == "function" && n.setOptions(t);
                        typeof n.setMap == "function" && n.setMap(this.map);
                        return n
                    }
                };
                this.removeLayer = function(e) {
                    if (this.singleLayers[e] !== undefined) {
                        this.singleLayers[e].setMap(null);
                        delete this.singleLayers[e]
                    }
                };
                this.toImage = function(e) {
                    var e = e || {},
                        t = {};
                    t.size = e.size || [this.el.clientWidth, this.el.clientHeight];
                    t.lat = this.getCenter().lat();
                    t.lng = this.getCenter().lng();
                    if (this.markers.length > 0) {
                        t.markers = [];
                        for (var n = 0; n < this.markers.length; n++) t.markers.push({
                            lat: this.markers[n].getPosition().lat(),
                            lng: this.markers[n].getPosition().lng()
                        })
                    }
                    if (this.polylines.length > 0) {
                        var i = this.polylines[0];
                        t.polyline = {};
                        t.polyline.path = google.maps.geometry.encoding.encodePath(i.getPath());
                        t.polyline.strokeColor = i.strokeColor;
                        t.polyline.strokeOpacity = i.strokeOpacity;
                        t.polyline.strokeWeight = i.strokeWeight
                    }
                    return r.staticMapURL(t)
                };
                this.addMapType = function(e, t) {
                    if (!t.hasOwnProperty("getTileUrl") || typeof t["getTileUrl"] != "function") throw "'getTileUrl' function required.";
                    t.tileSize = t.tileSize || new google.maps.Size(256, 256);
                    var n = new google.maps.ImageMapType(t);
                    this.map.mapTypes.set(e, n)
                };
                this.addOverlayMapType = function(e) {
                    if (!e.hasOwnProperty("getTile") || typeof e["getTile"] != "function") throw "'getTile' function required.";
                    var t = e.index;
                    delete e.index;
                    this.map.overlayMapTypes.insertAt(t, e)
                };
                this.removeOverlayMapType = function(e) {
                    this.map.overlayMapTypes.removeAt(e)
                };
                this.addStyle = function(e) {
                    var t = new google.maps.StyledMapType(e.styles, e.styledMapName);
                    this.map.mapTypes.set(e.mapTypeId, t)
                };
                this.setStyle = function(e) {
                    this.map.setMapTypeId(e)
                };
                this.createPanorama = function(e) {
                    if (!e.hasOwnProperty("lat") || !e.hasOwnProperty("lng")) {
                        e.lat = this.getCenter().lat();
                        e.lng = this.getCenter().lng()
                    }
                    this.panorama = r.createPanorama(e);
                    this.map.setStreetView(this.panorama);
                    return this.panorama
                };
                this.on = function(e, t) {
                    return r.on(e, this, t)
                };
                this.off = function(e) {
                    r.off(e, this)
                }
            };
        r.createPanorama = function(e) {
            var t = n(e.el, e.context);
            e.position = new google.maps.LatLng(e.lat, e.lng);
            delete e.el;
            delete e.context;
            delete e.lat;
            delete e.lng;
            var r = ["closeclick", "links_changed", "pano_changed", "position_changed", "pov_changed", "resize", "visible_changed"],
                i = extend_object({
                    visible: !0
                }, e);
            for (var s = 0; s < r.length; s++) delete i[r[s]];
            var o = new google.maps.StreetViewPanorama(t, i);
            for (var s = 0; s < r.length; s++)(function(t, n) {
                e[n] && google.maps.event.addListener(t, n, function() {
                    e[n].apply(this)
                })
            })(o, r[s]);
            return o
        };
        r.Route = function(e) {
            this.map = e.map;
            this.route = e.route;
            this.step_count = 0;
            this.steps = this.route.legs[0].steps;
            this.steps_length = this.steps.length;
            this.polyline = this.map.drawPolyline({
                path: new google.maps.MVCArray,
                strokeColor: e.strokeColor,
                strokeOpacity: e.strokeOpacity,
                strokeWeight: e.strokeWeight
            }).getPath();
            this.back = function() {
                if (this.step_count > 0) {
                    this.step_count--;
                    var e = this.route.legs[0].steps[this.step_count].path;
                    for (var t in e) e.hasOwnProperty(t) && this.polyline.pop()
                }
            };
            this.forward = function() {
                if (this.step_count < this.steps_length) {
                    var e = this.route.legs[0].steps[this.step_count].path;
                    for (var t in e) e.hasOwnProperty(t) && this.polyline.push(e[t]);
                    this.step_count++
                }
            }
        };
        r.geolocate = function(e) {
            var t = e.always || e.complete;
            if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(n) {
                e.success(n);
                t && t()
            }, function(n) {
                e.error(n);
                t && t()
            }, e.options);
            else {
                e.not_supported();
                t && t()
            }
        };
        r.geocode = function(e) {
            this.geocoder = new google.maps.Geocoder;
            var t = e.callback;
            e.hasOwnProperty("lat") && e.hasOwnProperty("lng") && (e.latLng = new google.maps.LatLng(e.lat, e.lng));
            delete e.lat;
            delete e.lng;
            delete e.callback;
            this.geocoder.geocode(e, function(e, n) {
                t(e, n)
            })
        };
        r.staticMapURL = function(e) {
            function p(e, t) {
                if (e[0] === "#") {
                    e = e.replace("#", "0x");
                    if (t) {
                        t = parseFloat(t);
                        t = Math.min(1, Math.max(t, 0));
                        if (t === 0) return "0x00000000";
                        t = (t * 255).toString(16);
                        t.length === 1 && (t += t);
                        e = e.slice(0, 8) + t
                    }
                }
                return e
            }
            var t = [],
                n, r = "http://maps.googleapis.com/maps/api/staticmap";
            if (e.url) {
                r = e.url;
                delete e.url
            }
            r += "?";
            var i = e.markers;
            delete e.markers;
            if (!i && e.marker) {
                i = [e.marker];
                delete e.marker
            }
            var s = e.polyline;
            delete e.polyline;
            if (e.center) {
                t.push("center=" + e.center);
                delete e.center
            } else if (e.address) {
                t.push("center=" + e.address);
                delete e.address
            } else if (e.lat) {
                t.push(["center=", e.lat, ",", e.lng].join(""));
                delete e.lat;
                delete e.lng
            } else if (e.visible) {
                var o = encodeURI(e.visible.join("|"));
                t.push("visible=" + o)
            }
            var u = e.size;
            if (u) {
                u.join && (u = u.join("x"));
                delete e.size
            } else u = "630x300";
            t.push("size=" + u);
            e.zoom || (e.zoom = 15);
            var a = e.hasOwnProperty("sensor") ? !!e.sensor : !0;
            delete e.sensor;
            t.push("sensor=" + a);
            for (var f in e) e.hasOwnProperty(f) && t.push(f + "=" + e[f]);
            if (i) {
                var l, c;
                for (var h = 0; n = i[h]; h++) {
                    l = [];
                    n.size && n.size !== "normal" ? l.push("size:" + n.size) : n.icon && l.push("icon:" + encodeURI(n.icon));
                    n.color && l.push("color:" + n.color.replace("#", "0x"));
                    n.label && l.push("label:" + n.label[0].toUpperCase());
                    c = n.address ? n.address : n.lat + "," + n.lng;
                    if (l.length || h === 0) {
                        l.push(c);
                        l = l.join("|");
                        t.push("markers=" + encodeURI(l))
                    } else {
                        l = t.pop() + encodeURI("|" + c);
                        t.push(l)
                    }
                }
            }
            if (s) {
                n = s;
                s = [];
                n.strokeWeight && s.push("weight:" + parseInt(n.strokeWeight, 10));
                if (n.strokeColor) {
                    var d = p(n.strokeColor, n.strokeOpacity);
                    s.push("color:" + d)
                }
                if (n.fillColor) {
                    var v = p(n.fillColor, n.fillOpacity);
                    s.push("fillcolor:" + v)
                }
                var m = n.path;
                if (m.join)
                    for (var g = 0, y; y = m[g]; g++) s.push(y.join(","));
                else s.push("enc:" + m);
                s = s.join("|");
                t.push("path=" + encodeURI(s))
            }
            t = t.join("&");
            return r + t
        };
        r.custom_events = ["marker_added", "marker_removed", "polyline_added", "polyline_removed", "polygon_added", "polygon_removed", "geolocated", "geolocation_failed"];
        r.on = function(e, t, n) {
            if (r.custom_events.indexOf(e) == -1) return google.maps.event.addListener(t, e, n);
            var i = {
                handler: n,
                eventName: e
            };
            t.registered_events[e] = t.registered_events[e] || [];
            t.registered_events[e].push(i);
            return i
        };
        r.off = function(e, t) {
            r.custom_events.indexOf(e) == -1 ? google.maps.event.clearListeners(t, e) : t.registered_events[e] = []
        };
        r.fire = function(e, t, n) {
            if (r.custom_events.indexOf(e) == -1) google.maps.event.trigger(t, e, Array.prototype.slice.apply(arguments).slice(2));
            else if (e in n.registered_events) {
                var i = n.registered_events[e];
                for (var s = 0; s < i.length; s++)(function(e, t, n) {
                    e.apply(t, [n])
                })(i[s].handler, n, t)
            }
        };
        google.maps.Polygon.prototype.getBounds || (google.maps.Polygon.prototype.getBounds = function(e) {
            var t = new google.maps.LatLngBounds,
                n = this.getPaths(),
                r;
            for (var i = 0; i < n.getLength(); i++) {
                r = n.getAt(i);
                for (var s = 0; s < r.getLength(); s++) t.extend(r.getAt(s))
            }
            return t
        });
        google.maps.Polygon.prototype.containsLatLng || (google.maps.Polygon.prototype.containsLatLng = function(e) {
            var t = this.getBounds();
            if (t !== null && !t.contains(e)) return !1;
            var n = !1,
                r = this.getPaths().getLength();
            for (var i = 0; i < r; i++) {
                var s = this.getPaths().getAt(i),
                    o = s.getLength(),
                    u = o - 1;
                for (var a = 0; a < o; a++) {
                    var f = s.getAt(a),
                        l = s.getAt(u);
                    (f.lng() < e.lng() && l.lng() >= e.lng() || l.lng() < e.lng() && f.lng() >= e.lng()) && f.lat() + (e.lng() - f.lng()) / (l.lng() - f.lng()) * (l.lat() - f.lat()) < e.lat() && (n = !n);
                    u = a
                }
            }
            return n
        });
        google.maps.LatLngBounds.prototype.containsLatLng = function(e) {
            return this.contains(e)
        };
        google.maps.Marker.prototype.setFences = function(e) {
            this.fences = e
        };
        google.maps.Marker.prototype.addFence = function(e) {
            this.fences.push(e)
        };
        return r
    }(this),
    coordsToLatLngs = function(e, t) {
        var n = e[0],
            r = e[1];
        if (t) {
            n = e[1];
            r = e[0]
        }
        return new google.maps.LatLng(n, r)
    },
    arrayToLatLng = function(e, t) {
        for (var n = 0; n < e.length; n++) e[n].length > 0 && typeof e[n][0] != "number" ? e[n] = arrayToLatLng(e[n], t) : e[n] = coordsToLatLngs(e[n], t);
        return e
    },
    extend_object = function(e, t) {
        if (e === t) return e;
        for (var n in t) e[n] = t[n];
        return e
    },
    replace_object = function(e, t) {
        if (e === t) return e;
        for (var n in t) e[n] != undefined && (e[n] = t[n]);
        return e
    },
    array_map = function(e, t) {
        var n = Array.prototype.slice.call(arguments, 2);
        if (Array.prototype.map && e.map === Array.prototype.map) return Array.prototype.map.call(e, function(e) {
            callback_params = n;
            callback_params.splice(0, 0, e);
            return t.apply(this, callback_params)
        });
        var r = [],
            i = e.length;
        for (var s = 0; s < i; s++) {
            callback_params = n;
            callback_params = callback_params.splice(0, 0, e[s]);
            r.push(t.apply(this, callback_params))
        }
        return r
    },
    array_flat = function(e) {
        new_array = [];
        for (var t = 0; t < e.length; t++) new_array = new_array.concat(e[t]);
        return new_array
    };
(function(e, t, n, r) {
    var i = n(e),
        s = n(t),
        o = n.fancybox = function() {
            o.open.apply(this, arguments)
        },
        u = navigator.userAgent.match(/msie/),
        a = null,
        f = t.createTouch !== r,
        l = function(e) {
            return e && e.hasOwnProperty && e instanceof n
        },
        c = function(e) {
            return e && "string" === n.type(e)
        },
        h = function(e) {
            return c(e) && 0 < e.indexOf("%")
        },
        p = function(e, t) {
            var n = parseInt(e, 10) || 0;
            t && h(e) && (n *= o.getViewport()[t] / 100);
            return Math.ceil(n)
        },
        d = function(e, t) {
            return p(e, t) + "px"
        };
    n.extend(o, {
        version: "2.1.4",
        defaults: {
            padding: 15,
            margin: 20,
            width: 800,
            height: 600,
            minWidth: 100,
            minHeight: 100,
            maxWidth: 9999,
            maxHeight: 9999,
            autoSize: !0,
            autoHeight: !1,
            autoWidth: !1,
            autoResize: !0,
            autoCenter: !f,
            fitToView: !0,
            aspectRatio: !1,
            topRatio: .5,
            leftRatio: .5,
            scrolling: "auto",
            wrapCSS: "",
            arrows: !0,
            closeBtn: !0,
            closeClick: !1,
            nextClick: !1,
            mouseWheel: !0,
            autoPlay: !1,
            playSpeed: 3e3,
            preload: 3,
            modal: !1,
            loop: !0,
            ajax: {
                dataType: "html",
                headers: {
                    "X-fancyBox": !0
                }
            },
            iframe: {
                scrolling: "auto",
                preload: !0
            },
            swf: {
                wmode: "transparent",
                allowfullscreen: "true",
                allowscriptaccess: "always"
            },
            keys: {
                next: {
                    13: "left",
                    34: "up",
                    39: "left",
                    40: "up"
                },
                prev: {
                    8: "right",
                    33: "down",
                    37: "right",
                    38: "down"
                },
                close: [27],
                play: [32],
                toggle: [70]
            },
            direction: {
                next: "left",
                prev: "right"
            },
            scrollOutside: !0,
            index: 0,
            type: null,
            href: null,
            content: null,
            title: null,
            tpl: {
                wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
                image: '<img class="fancybox-image" src="{href}" alt="" />',
                iframe: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (u ? ' allowtransparency="true"' : "") + "></iframe>",
                error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
                closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
                next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
            },
            openEffect: "fade",
            openSpeed: 250,
            openEasing: "swing",
            openOpacity: !0,
            openMethod: "zoomIn",
            closeEffect: "fade",
            closeSpeed: 250,
            closeEasing: "swing",
            closeOpacity: !0,
            closeMethod: "zoomOut",
            nextEffect: "elastic",
            nextSpeed: 250,
            nextEasing: "swing",
            nextMethod: "changeIn",
            prevEffect: "elastic",
            prevSpeed: 250,
            prevEasing: "swing",
            prevMethod: "changeOut",
            helpers: {
                overlay: !0,
                title: !0
            },
            onCancel: n.noop,
            beforeLoad: n.noop,
            afterLoad: n.noop,
            beforeShow: n.noop,
            afterShow: n.noop,
            beforeChange: n.noop,
            beforeClose: n.noop,
            afterClose: n.noop
        },
        group: {},
        opts: {},
        previous: null,
        coming: null,
        current: null,
        isActive: !1,
        isOpen: !1,
        isOpened: !1,
        wrap: null,
        skin: null,
        outer: null,
        inner: null,
        player: {
            timer: null,
            isActive: !1
        },
        ajaxLoad: null,
        imgPreload: null,
        transitions: {},
        helpers: {},
        open: function(e, t) {
            if (e && (n.isPlainObject(t) || (t = {}), !1 !== o.close(!0))) return n.isArray(e) || (e = l(e) ? n(e).get() : [e]), n.each(e, function(i, s) {
                var u = {},
                    a, f, h, p, d;
                "object" === n.type(s) && (s.nodeType && (s = n(s)), l(s) ? (u = {
                    href: s.data("fancybox-href") || s.attr("href"),
                    title: s.data("fancybox-title") || s.attr("title"),
                    isDom: !0,
                    element: s
                }, n.metadata && n.extend(!0, u, s.metadata())) : u = s);
                a = t.href || u.href || (c(s) ? s : null);
                f = t.title !== r ? t.title : u.title || "";
                p = (h = t.content || u.content) ? "html" : t.type || u.type;
                !p && u.isDom && (p = s.data("fancybox-type"), p || (p = (p = s.prop("class").match(/fancybox\.(\w+)/)) ? p[1] : null));
                c(a) && (p || (o.isImage(a) ? p = "image" : o.isSWF(a) ? p = "swf" : "#" === a.charAt(0) ? p = "inline" : c(s) && (p = "html", h = s)), "ajax" === p && (d = a.split(/\s+/, 2), a = d.shift(), d = d.shift()));
                h || ("inline" === p ? a ? h = n(c(a) ? a.replace(/.*(?=#[^\s]+$)/, "") : a) : u.isDom && (h = s) : "html" === p ? h = a : !p && !a && u.isDom && (p = "inline", h = s));
                n.extend(u, {
                    href: a,
                    type: p,
                    content: h,
                    title: f,
                    selector: d
                });
                e[i] = u
            }), o.opts = n.extend(!0, {}, o.defaults, t), t.keys !== r && (o.opts.keys = t.keys ? n.extend({}, o.defaults.keys, t.keys) : !1), o.group = e, o._start(o.opts.index)
        },
        cancel: function() {
            var e = o.coming;
            e && !1 !== o.trigger("onCancel") && (o.hideLoading(), o.ajaxLoad && o.ajaxLoad.abort(), o.ajaxLoad = null, o.imgPreload && (o.imgPreload.onload = o.imgPreload.onerror = null), e.wrap && e.wrap.stop(!0, !0).trigger("onReset").remove(), o.coming = null, o.current || o._afterZoomOut(e))
        },
        close: function(e) {
            o.cancel();
            !1 !== o.trigger("beforeClose") && (o.unbindEvents(), o.isActive && (!o.isOpen || !0 === e ? (n(".fancybox-wrap").stop(!0).trigger("onReset").remove(), o._afterZoomOut()) : (o.isOpen = o.isOpened = !1, o.isClosing = !0, n(".fancybox-item, .fancybox-nav").remove(), o.wrap.stop(!0, !0).removeClass("fancybox-opened"), o.transitions[o.current.closeMethod]())))
        },
        play: function(e) {
            var t = function() {
                    clearTimeout(o.player.timer)
                },
                r = function() {
                    t();
                    o.current && o.player.isActive && (o.player.timer = setTimeout(o.next, o.current.playSpeed))
                },
                i = function() {
                    t();
                    n("body").unbind(".player");
                    o.player.isActive = !1;
                    o.trigger("onPlayEnd")
                };
            !0 === e || !o.player.isActive && !1 !== e ? o.current && (o.current.loop || o.current.index < o.group.length - 1) && (o.player.isActive = !0, n("body").bind({
                "afterShow.player onUpdate.player": r,
                "onCancel.player beforeClose.player": i,
                "beforeLoad.player": t
            }), r(), o.trigger("onPlayStart")) : i()
        },
        next: function(e) {
            var t = o.current;
            t && (c(e) || (e = t.direction.next), o.jumpto(t.index + 1, e, "next"))
        },
        prev: function(e) {
            var t = o.current;
            t && (c(e) || (e = t.direction.prev), o.jumpto(t.index - 1, e, "prev"))
        },
        jumpto: function(e, t, n) {
            var i = o.current;
            i && (e = p(e), o.direction = t || i.direction[e >= i.index ? "next" : "prev"], o.router = n || "jumpto", i.loop && (0 > e && (e = i.group.length + e % i.group.length), e %= i.group.length), i.group[e] !== r && (o.cancel(), o._start(e)))
        },
        reposition: function(e, t) {
            var r = o.current,
                i = r ? r.wrap : null,
                s;
            i && (s = o._getPosition(t), e && "scroll" === e.type ? (delete s.position, i.stop(!0, !0).animate(s, 200)) : (i.css(s), r.pos = n.extend({}, r.dim, s)))
        },
        update: function(e) {
            var t = e && e.type,
                n = !t || "orientationchange" === t;
            n && (clearTimeout(a), a = null);
            o.isOpen && !a && (a = setTimeout(function() {
                var r = o.current;
                r && !
                    o.isClosing && (o.wrap.removeClass("fancybox-tmp"), (n || "load" === t || "resize" === t && r.autoResize) && o._setDimension(), "scroll" === t && r.canShrink || o.reposition(e), o.trigger("onUpdate"), a = null)
            }, n && !f ? 0 : 300))
        },
        toggle: function(e) {
            o.isOpen && (o.current.fitToView = "boolean" === n.type(e) ? e : !o.current.fitToView, f && (o.wrap.removeAttr("style").addClass("fancybox-tmp"), o.trigger("onUpdate")), o.update())
        },
        hideLoading: function() {
            s.unbind(".loading");
            n("#fancybox-loading").remove()
        },
        showLoading: function() {
            var e, t;
            o.hideLoading();
            e = n('<div id="fancybox-loading"><div></div></div>').click(o.cancel).appendTo("body");
            s.bind("keydown.loading", function(e) {
                27 === (e.which || e.keyCode) && (e.preventDefault(), o.cancel())
            });
            o.defaults.fixed || (t = o.getViewport(), e.css({
                position: "absolute",
                top: .5 * t.h + t.y,
                left: .5 * t.w + t.x
            }))
        },
        getViewport: function() {
            var t = o.current && o.current.locked || !1,
                n = {
                    x: i.scrollLeft(),
                    y: i.scrollTop()
                };
            t ? (n.w = t[0].clientWidth, n.h = t[0].clientHeight) : (n.w = f && e.innerWidth ? e.innerWidth : i.width(), n.h = f && e.innerHeight ? e.innerHeight : i.height());
            return n
        },
        unbindEvents: function() {
            o.wrap && l(o.wrap) && o.wrap.unbind(".fb");
            s.unbind(".fb");
            i.unbind(".fb")
        },
        bindEvents: function() {
            var e = o.current,
                t;
            e && (i.bind("orientationchange.fb" + (f ? "" : " resize.fb") + (e.autoCenter && !e.locked ? " scroll.fb" : ""), o.update), (t = e.keys) && s.bind("keydown.fb", function(i) {
                var s = i.which || i.keyCode,
                    u = i.target || i.srcElement;
                if (27 === s && o.coming) return !1;
                !i.ctrlKey && !i.altKey && !i.shiftKey && !i.metaKey && (!u || !u.type && !n(u).is("[contenteditable]")) && n.each(t, function(t, u) {
                    if (1 < e.group.length && u[s] !== r) return o[t](u[s]), i.preventDefault(), !1;
                    if (-1 < n.inArray(s, u)) return o[t](), i.preventDefault(), !1
                })
            }), n.fn.mousewheel && e.mouseWheel && o.wrap.bind("mousewheel.fb", function(t, r, i, s) {
                for (var u = n(t.target || null), a = !1; u.length && !a && !u.is(".fancybox-skin") && !u.is(".fancybox-wrap");) a = u[0] && (!u[0].style.overflow || "hidden" !== u[0].style.overflow) && (u[0].clientWidth && u[0].scrollWidth > u[0].clientWidth || u[0].clientHeight && u[0].scrollHeight > u[0].clientHeight), u = n(u).parent();
                if (0 !== r && !a && 1 < o.group.length && !e.canShrink) {
                    0 < s || 0 < i ? o.prev(0 < s ? "down" : "left") : (0 > s || 0 > i) && o.next(0 > s ? "up" : "right");
                    t.preventDefault()
                }
            }))
        },
        trigger: function(e, t) {
            var r, i = t || o.coming || o.current;
            if (i) {
                n.isFunction(i[e]) && (r = i[e].apply(i, Array.prototype.slice.call(arguments, 1)));
                if (!1 === r) return !1;
                i.helpers && n.each(i.helpers, function(t, r) {
                    r && o.helpers[t] && n.isFunction(o.helpers[t][e]) && (r = n.extend(!0, {}, o.helpers[t].defaults, r), o.helpers[t][e](r, i))
                });
                n.event.trigger(e + ".fb")
            }
        },
        isImage: function(e) {
            return c(e) && e.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp)((\?|#).*)?$)/i)
        },
        isSWF: function(e) {
            return c(e) && e.match(/\.(swf)((\?|#).*)?$/i)
        },
        _start: function(e) {
            var t = {},
                r, i;
            e = p(e);
            r = o.group[e] || null;
            if (!r) return !1;
            t = n.extend(!0, {}, o.opts, r);
            r = t.margin;
            i = t.padding;
            "number" === n.type(r) && (t.margin = [r, r, r, r]);
            "number" === n.type(i) && (t.padding = [i, i, i, i]);
            t.modal && n.extend(!0, t, {
                closeBtn: !1,
                closeClick: !1,
                nextClick: !1,
                arrows: !1,
                mouseWheel: !1,
                keys: null,
                helpers: {
                    overlay: {
                        closeClick: !1
                    }
                }
            });
            t.autoSize && (t.autoWidth = t.autoHeight = !0);
            "auto" === t.width && (t.autoWidth = !0);
            "auto" === t.height && (t.autoHeight = !0);
            t.group = o.group;
            t.index = e;
            o.coming = t;
            if (!1 === o.trigger("beforeLoad")) o.coming = null;
            else {
                i = t.type;
                r = t.href;
                if (!i) return o.coming = null, o.current && o.router && "jumpto" !== o.router ? (o.current.index = e, o[o.router](o.direction)) : !1;
                o.isActive = !0;
                if ("image" === i || "swf" === i) t.autoHeight = t.autoWidth = !1, t.scrolling = "visible";
                "image" === i && (t.aspectRatio = !0);
                "iframe" === i && f && (t.scrolling = "scroll");
                t.wrap = n(t.tpl.wrap).addClass("fancybox-" + (f ? "mobile" : "desktop") + " fancybox-type-" + i + " fancybox-tmp " + t.wrapCSS).appendTo(t.parent || "body");
                n.extend(t, {
                    skin: n(".fancybox-skin", t.wrap),
                    outer: n(".fancybox-outer", t.wrap),
                    inner: n(".fancybox-inner", t.wrap)
                });
                n.each(["Top", "Right", "Bottom", "Left"], function(e, n) {
                    t.skin.css("padding" + n, d(t.padding[e]))
                });
                o.trigger("onReady");
                if ("inline" === i || "html" === i) {
                    if (!t.content || !t.content.length) return o._error("content")
                } else if (!r) return o._error("href");
                "image" === i ? o._loadImage() : "ajax" === i ? o._loadAjax() : "iframe" === i ? o._loadIframe() : o._afterLoad()
            }
        },
        _error: function(e) {
            n.extend(o.coming, {
                type: "html",
                autoWidth: !0,
                autoHeight: !0,
                minWidth: 0,
                minHeight: 0,
                scrolling: "no",
                hasError: e,
                content: o.coming.tpl.error
            });
            o._afterLoad()
        },
        _loadImage: function() {
            var e = o.imgPreload = new Image;
            e.onload = function() {
                this.onload = this.onerror = null;
                o.coming.width = this.width;
                o.coming.height = this.height;
                o._afterLoad()
            };
            e.onerror = function() {
                this.onload = this.onerror = null;
                o._error("image")
            };
            e.src = o.coming.href;
            !0 !== e.complete && o.showLoading()
        },
        _loadAjax: function() {
            var e = o.coming;
            o.showLoading();
            o.ajaxLoad = n.ajax(n.extend({}, e.ajax, {
                url: e.href,
                error: function(e, t) {
                    o.coming && "abort" !== t ? o._error("ajax", e) : o.hideLoading()
                },
                success: function(t, n) {
                    "success" === n && (e.content = t, o._afterLoad())
                }
            }))
        },
        _loadIframe: function() {
            var e = o.coming,
                t = n(e.tpl.iframe.replace(/\{rnd\}/g, (new Date).getTime())).attr("scrolling", f ? "auto" : e.iframe.scrolling).attr("src", e.href);
            n(e.wrap).bind("onReset", function() {
                try {
                    n(this).find("iframe").hide().attr("src", "//about:blank").end().empty()
                } catch (e) {}
            });
            e.iframe.preload && (o.showLoading(), t.one("load", function() {
                n(this).data("ready", 1);
                f || n(this).bind("load.fb", o.update);
                n(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show();
                o._afterLoad()
            }));
            e.content = t.appendTo(e.inner);
            e.iframe.preload || o._afterLoad()
        },
        _preloadImages: function() {
            var e = o.group,
                t = o.current,
                n = e.length,
                r = t.preload ? Math.min(t.preload, n - 1) : 0,
                i, s;
            for (s = 1; s <= r; s += 1) i = e[(t.index + s) % n], "image" === i.type && i.href && ((new Image).src = i.href)
        },
        _afterLoad: function() {
            var e = o.coming,
                t = o.current,
                r, i, s, u, a;
            o.hideLoading();
            if (e && !1 !== o.isActive)
                if (!1 === o.trigger("afterLoad", e, t)) e.wrap.stop(!0).trigger("onReset").remove(), o.coming = null;
                else {
                    t && (o.trigger("beforeChange", t), t.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove());
                    o.unbindEvents();
                    r = e.content;
                    i = e.type;
                    s = e.scrolling;
                    n.extend(o, {
                        wrap: e.wrap,
                        skin: e.skin,
                        outer: e.outer,
                        inner: e.inner,
                        current: e,
                        previous: t
                    });
                    u = e.href;
                    switch (i) {
                        case "inline":
                        case "ajax":
                        case "html":
                            e.selector ? r = n("<div>").html(r).find(e.selector) : l(r) && (r.data("fancybox-placeholder") || r.data("fancybox-placeholder", n('<div class="fancybox-placeholder"></div>').insertAfter(r).hide()), r = r.show().detach(), e.wrap.bind("onReset", function() {
                                n(this).find(r).length && r.hide().replaceAll(r.data("fancybox-placeholder")).data("fancybox-placeholder", !1)
                            }));
                            break;
                        case "image":
                            r = e.tpl.image.replace("{href}", u);
                            break;
                        case "swf":
                            r = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + u + '"></param>', a = "", n.each(e.swf, function(e, t) {
                                r += '<param name="' + e + '" value="' + t + '"></param>';
                                a += " " + e + '="' + t + '"'
                            }), r += '<embed src="' + u + '" type="application/x-shockwave-flash" width="100%" height="100%"' + a + "></embed></object>"
                    }(!l(r) || !r.parent().is(e.inner)) && e.inner.append(r);
                    o.trigger("beforeShow");
                    e.inner.css("overflow", "yes" === s ? "scroll" : "no" === s ? "hidden" : s);
                    o._setDimension();
                    o.reposition();
                    o.isOpen = !1;
                    o.coming = null;
                    o.bindEvents();
                    o.isOpened ? t.prevMethod && o.transitions[t.prevMethod]() : n(".fancybox-wrap").not(e.wrap).stop(!0).trigger("onReset").remove();
                    o.transitions[o.isOpened ? e.nextMethod : e.openMethod]();
                    o._preloadImages()
                }
        },
        _setDimension: function() {
            var e = o.getViewport(),
                t = 0,
                r = !1,
                i = !1,
                r = o.wrap,
                s = o.skin,
                u = o.inner,
                a = o.current,
                i = a.width,
                f = a.height,
                l = a.minWidth,
                c = a.minHeight,
                v = a.maxWidth,
                m = a.maxHeight,
                g = a.scrolling,
                y = a.scrollOutside ? a.scrollbarWidth : 0,
                w = a.margin,
                E = p(w[1] + w[3]),
                S = p(w[0] + w[2]),
                T, N, C, k, L, A, O, M, _;
            r.add(s).add(u).width("auto").height("auto").removeClass("fancybox-tmp");
            w = p(s.outerWidth(!0) - s.width());
            T = p(s.outerHeight(!0) - s.height());
            N = E + w;
            C = S + T;
            k = h(i) ? (e.w - N) * p(i) / 100 : i;
            L = h(f) ? (e.h - C) * p(f) / 100 : f;
            if ("iframe" === a.type) {
                if (_ = a.content, a.autoHeight && 1 === _.data("ready")) try {
                    _[0].contentWindow.document.location && (u.width(k).height(9999), A = _.contents().find("body"), y && A.css("overflow-x", "hidden"), L = A.height())
                } catch (D) {}
            } else if (a.autoWidth || a.autoHeight) u.addClass("fancybox-tmp"), a.autoWidth || u.width(k), a.autoHeight || u.height(L), a.autoWidth && (k = u.width()), a.autoHeight && (L = u.height()), u.removeClass("fancybox-tmp");
            i = p(k);
            f = p(L);
            M = k / L;
            l = p(h(l) ? p(l, "w") - N : l);
            v = p(h(v) ? p(v, "w") - N : v);
            c = p(h(c) ? p(c, "h") - C : c);
            m = p(h(m) ? p(m, "h") - C : m);
            A = v;
            O = m;
            a.fitToView && (v = Math.min(e.w - N, v), m = Math.min(e.h - C, m));
            N = e.w - E;
            S = e.h - S;
            a.aspectRatio ? (i > v && (i = v, f = p(i / M)), f > m && (f = m, i = p(f * M)), i < l && (i = l, f = p(i / M)), f < c && (f = c, i = p(f * M))) : (i = Math.max(l, Math.min(i, v)), a.autoHeight && "iframe" !== a.type && (u.width(i), f = u.height()), f = Math.max(c, Math.min(f, m)));
            if (a.fitToView)
                if (u.width(i).height(f), r.width(i + w), e = r.width(), E = r.height(), a.aspectRatio)
                    for (;
                        (e > N || E > S) && i > l && f > c && !(19 < t++);) f = Math.max(c, Math.min(m, f - 10)), i = p(f * M), i < l && (i = l, f = p(i / M)), i > v && (i = v, f = p(i / M)), u.width(i).height(f), r.width(i + w), e = r.width(), E = r.height();
                else i = Math.max(l, Math.min(i, i - (e - N))), f = Math.max(c, Math.min(f, f - (E - S)));
            y && "auto" === g && f < L && i + w + y < N && (i += y);
            u.width(i).height(f);
            r.width(i + w);
            e = r.width();
            E = r.height();
            r = (e > N || E > S) && i > l && f > c;
            i = a.aspectRatio ? i < A && f < O && i < k && f < L : (i < A || f < O) && (i < k || f < L);
            n.extend(a, {
                dim: {
                    width: d(e),
                    height: d(E)
                },
                origWidth: k,
                origHeight: L,
                canShrink: r,
                canExpand: i,
                wPadding: w,
                hPadding: T,
                wrapSpace: E - s.outerHeight(!0),
                skinSpace: s.height() - f
            });
            !_ && a.autoHeight && f > c && f < m && !i && u.height("auto")
        },
        _getPosition: function(e) {
            var t = o.current,
                n = o.getViewport(),
                r = t.margin,
                i = o.wrap.width() + r[1] + r[3],
                s = o.wrap.height() + r[0] + r[2],
                r = {
                    position: "absolute",
                    top: r[0],
                    left: r[3]
                };
            t.autoCenter && t.fixed && !e && s <= n.h && i <= n.w ? r.position = "fixed" : t.locked || (r.top += n.y, r.left += n.x);
            r.top = d(Math.max(r.top, r.top + (n.h - s) * t.topRatio));
            r.left = d(Math.max(r.left, r.left + (n.w - i) * t.leftRatio));
            return r
        },
        _afterZoomIn: function() {
            var e = o.current;
            e && (o.isOpen = o.isOpened = !0, o.wrap.css("overflow", "visible").addClass("fancybox-opened"), o.update(), (e.closeClick || e.nextClick && 1 < o.group.length) && o.inner.css("cursor", "pointer").bind("click.fb", function(t) {
                !n(t.target).is("a") && !n(t.target).parent().is("a") && (t.preventDefault(), o[e.closeClick ? "close" : "next"]())
            }), e.closeBtn && n(e.tpl.closeBtn).appendTo(o.skin).bind("click.fb", function(e) {
                e.preventDefault();
                o.close()
            }), e.arrows && 1 < o.group.length && ((e.loop || 0 < e.index) && n(e.tpl.prev).appendTo(o.outer).bind("click.fb", o.prev), (e.loop || e.index < o.group.length - 1) && n(e.tpl.next).appendTo(o.outer).bind("click.fb", o.next)), o.trigger("afterShow"), !e.loop && e.index === e.group.length - 1 ? o.play(!1) : o.opts.autoPlay && !o.player.isActive && (o.opts.autoPlay = !1, o.play()))
        },
        _afterZoomOut: function(e) {
            e = e || o.current;
            n(".fancybox-wrap").trigger("onReset").remove();
            n.extend(o, {
                group: {},
                opts: {},
                router: !1,
                current: null,
                isActive: !1,
                isOpened: !1,
                isOpen: !1,
                isClosing: !1,
                wrap: null,
                skin: null,
                outer: null,
                inner: null
            });
            o.trigger("afterClose", e)
        }
    });
    o.transitions = {
        getOrigPosition: function() {
            var e = o.current,
                t = e.element,
                n = e.orig,
                r = {},
                i = 50,
                s = 50,
                u = e.hPadding,
                a = e.wPadding,
                f = o.getViewport();
            !n && e.isDom && t.is(":visible") && (n = t.find("img:first"), n.length || (n = t));
            l(n) ? (r = n.offset(), n.is("img") && (i = n.outerWidth(), s = n.outerHeight())) : (r.top = f.y + (f.h - s) * e.topRatio, r.left = f.x + (f.w - i) * e.leftRatio);
            if ("fixed" === o.wrap.css("position") || e.locked) r.top -= f.y, r.left -= f.x;
            return r = {
                top: d(r.top - u * e.topRatio),
                left: d(r.left - a * e.leftRatio),
                width: d(i + a),
                height: d(s + u)
            }
        },
        step: function(e, t) {
            var n, r, i = t.prop;
            r = o.current;
            var s = r.wrapSpace,
                u = r.skinSpace;
            if ("width" === i || "height" === i) n = t.end === t.start ? 1 : (e - t.start) / (t.end - t.start), o.isClosing && (n = 1 - n), r = "width" === i ? r.wPadding : r.hPadding, r = e - r, o.skin[i](p("width" === i ? r : r - s * n)), o.inner[i](p("width" === i ? r : r - s * n - u * n))
        },
        zoomIn: function() {
            var e = o.current,
                t = e.pos,
                r = e.openEffect,
                i = "elastic" === r,
                s = n.extend({
                    opacity: 1
                }, t);
            delete s.position;
            i ? (t = this.getOrigPosition(), e.openOpacity && (t.opacity = .1)) : "fade" === r && (t.opacity = .1);
            o.wrap.css(t).animate(s, {
                duration: "none" === r ? 0 : e.openSpeed,
                easing: e.openEasing,
                step: i ? this.step : null,
                complete: o._afterZoomIn
            })
        },
        zoomOut: function() {
            var e = o.current,
                t = e.closeEffect,
                n = "elastic" === t,
                r = {
                    opacity: .1
                };
            n && (r = this.getOrigPosition(), e.closeOpacity && (r.opacity = .1));
            o.wrap.animate(r, {
                duration: "none" === t ? 0 : e.closeSpeed,
                easing: e.closeEasing,
                step: n ? this.step : null,
                complete: o._afterZoomOut
            })
        },
        changeIn: function() {
            var e = o.current,
                t = e.nextEffect,
                n = e.pos,
                r = {
                    opacity: 1
                },
                i = o.direction,
                s;
            n.opacity = .1;
            "elastic" === t && (s = "down" === i || "up" === i ? "top" : "left", "down" === i || "right" === i ? (n[s] = d(p(n[s]) - 200), r[s] = "+=200px") : (n[s] = d(p(n[s]) + 200), r[s] = "-=200px"));
            "none" === t ? o._afterZoomIn() : o.wrap.css(n).animate(r, {
                duration: e.nextSpeed,
                easing: e.nextEasing,
                complete: o._afterZoomIn
            })
        },
        changeOut: function() {
            var e = o.previous,
                t = e.prevEffect,
                r = {
                    opacity: .1
                },
                i = o.direction;
            "elastic" === t && (r["down" === i || "up" === i ? "top" : "left"] = ("up" === i || "left" === i ? "-" : "+") + "=200px");
            e.wrap.animate(r, {
                duration: "none" === t ? 0 : e.prevSpeed,
                easing: e.prevEasing,
                complete: function() {
                    n(this).trigger("onReset").remove()
                }
            })
        }
    };
    o.helpers.overlay = {
        defaults: {
            closeClick: !0,
            speedOut: 200,
            showEarly: !0,
            css: {},
            locked: !f,
            fixed: !0
        },
        overlay: null,
        fixed: !1,
        create: function(e) {
            e = n.extend({}, this.defaults, e);
            this.overlay && this.close();
            this.overlay = n('<div class="fancybox-overlay"></div>').appendTo("body");
            this.fixed = !1;
            e.fixed && o.defaults.fixed && (this.overlay.addClass("fancybox-overlay-fixed"), this.fixed = !0)
        },
        open: function(e) {
            var t = this;
            e = n.extend({}, this.defaults, e);
            this.overlay ? this.overlay.unbind(".overlay").width("auto").height("auto") : this.create(e);
            this.fixed || (i.bind("resize.overlay", n.proxy(this.update, this)), this.update());
            e.closeClick && this.overlay.bind("click.overlay", function(e) {
                n(e.target).hasClass("fancybox-overlay") && (o.isActive ? o.close() : t.close())
            });
            this.overlay.css(e.css).show()
        },
        close: function() {
            n(".fancybox-overlay").remove();
            i.unbind("resize.overlay");
            this.overlay = null;
            !1 !== this.margin && (n("body").css("margin-right", this.margin), this.margin = !1);
            this.el && this.el.removeClass("fancybox-lock")
        },
        update: function() {
            var e = "100%",
                n;
            this.overlay.width(e).height("100%");
            u ? (n = Math.max(t.documentElement.offsetWidth, t.body.offsetWidth), s.width() > n && (e = s.width())) : s.width() > i.width() && (e = s.width());
            this.overlay.width(e).height(s.height())
        },
        onReady: function(e, r) {
            n(".fancybox-overlay").stop(!0, !0);
            this.overlay || (this.margin = s.height() > i.height() || "scroll" === n("body").css("overflow-y") ? n("body").css("margin-right") : !1, this.el = t.all && !t.querySelector ? n("html") : n("body"), this.create(e));
            e.locked && this.fixed && (r.locked = this.overlay.append(r.wrap), r.fixed = !1);
            !0 === e.showEarly && this.beforeShow.apply(this, arguments)
        },
        beforeShow: function(e, t) {
            t.locked && (this.el.addClass("fancybox-lock"), !1 !== this.margin && n("body").css("margin-right", p(this.margin) + t.scrollbarWidth));
            this.open(e)
        },
        onUpdate: function() {
            this.fixed || this.update()
        },
        afterClose: function(e) {
            this.overlay && !o.isActive && this.overlay.fadeOut(e.speedOut, n.proxy(this.close, this))
        }
    };
    o.helpers.title = {
        defaults: {
            type: "float",
            position: "bottom"
        },
        beforeShow: function(e) {
            var t = o.current,
                r = t.title,
                i = e.type;
            n.isFunction(r) && (r = r.call(t.element, t));
            if (c(r) && "" !== n.trim(r)) {
                t = n('<div class="fancybox-title fancybox-title-' + i + '-wrap">' + r + "</div>");
                switch (i) {
                    case "inside":
                        i = o.skin;
                        break;
                    case "outside":
                        i = o.wrap;
                        break;
                    case "over":
                        i = o.inner;
                        break;
                    default:
                        i = o.skin, t.appendTo("body"), u && t.width(t.width()), t.wrapInner('<span class="child"></span>'), o.current.margin[2] += Math.abs(p(t.css("margin-bottom")))
                }
                t["top" === e.position ? "prependTo" : "appendTo"](i)
            }
        }
    };
    n.fn.fancybox = function(e) {
        var t, r = n(this),
            i = this.selector || "",
            u = function(s) {
                var u = n(this).blur(),
                    a = t,
                    f, l;
                !s.ctrlKey && !s.altKey && !s.shiftKey && !s.metaKey && !u.is(".fancybox-wrap") && (f = e.groupAttr || "data-fancybox-group", l = u.attr(f), l || (f = "rel", l = u.get(0)[f]), l && "" !== l && "nofollow" !== l && (u = i.length ? n(i) : r, u = u.filter("[" + f + '="' + l + '"]'), a = u.index(this)), e.index = a, !1 !== o.open(u, e) && s.preventDefault())
            };
        e = e || {};
        t = e.index || 0;
        !i || !1 === e.live ? r.unbind("click.fb-start").bind("click.fb-start", u) : s.undelegate(i, "click.fb-start").delegate(i + ":not('.fancybox-item, .fancybox-nav')", "click.fb-start", u);
        this.filter("[data-fancybox-start=1]").trigger("click");
        return this
    };
    s.ready(function() {
        n.scrollbarWidth === r && (n.scrollbarWidth = function() {
            var e = n('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),
                t = e.children(),
                t = t.innerWidth() - t.height(99).innerWidth();
            e.remove();
            return t
        });
        if (n.support.fixedPosition === r) {
            var e = n.support,
                t = n('<div style="position:fixed;top:20px;"></div>').appendTo("body"),
                i = 20 === t[0].offsetTop || 15 === t[0].offsetTop;
            t.remove();
            e.fixedPosition = i
        }
        n.extend(o.defaults, {
            scrollbarWidth: n.scrollbarWidth(),
            fixed: n.support.fixedPosition,
            parent: n("body")
        })
    })
})(window, document, jQuery);
(function(e) {
    e.flexslider = function(t, n) {
        var r = e(t),
            i = e.extend({}, e.flexslider.defaults, n),
            s = i.namespace,
            o = "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch,
            u = o ? "touchend" : "click",
            a = "vertical" === i.direction,
            f = i.reverse,
            l = 0 < i.itemWidth,
            c = "fade" === i.animation,
            h = "" !== i.asNavFor,
            p = {};
        e.data(t, "flexslider", r);
        p = {
            init: function() {
                r.animating = !1;
                r.currentSlide = i.startAt;
                r.animatingTo = r.currentSlide;
                r.atEnd = 0 === r.currentSlide || r.currentSlide === r.last;
                r.containerSelector = i.selector.substr(0, i.selector.search(" "));
                r.slides = e(i.selector, r);
                r.container = e(r.containerSelector, r);
                r.count = r.slides.length;
                r.syncExists = 0 < e(i.sync).length;
                "slide" === i.animation && (i.animation = "swing");
                r.prop = a ? "top" : "marginLeft";
                r.args = {};
                r.manualPause = !1;
                var t = r,
                    n;
                if (n = !i.video)
                    if (n = !c)
                        if (n = i.useCSS) e: {
                            n = document.createElement("div");
                            var s = ["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"],
                                u;
                            for (u in s)
                                if (void 0 !== n.style[s[u]]) {
                                    r.pfx = s[u].replace("Perspective", "").toLowerCase();
                                    r.prop = "-" + r.pfx + "-transform";
                                    n = !0;
                                    break e
                                }
                            n = !1
                        }
                        t.transitions = n;
                "" !== i.controlsContainer && (r.controlsContainer = 0 < e(i.controlsContainer).length && e(i.controlsContainer));
                "" !== i.manualControls && (r.manualControls = 0 < e(i.manualControls).length && e(i.manualControls));
                i.randomize && (r.slides.sort(function() {
                    return Math.round(Math.random()) - .5
                }), r.container.empty().append(r.slides));
                r.doMath();
                h && p.asNav.setup();
                r.setup("init");
                i.controlNav && p.controlNav.setup();
                i.directionNav && p.directionNav.setup();
                i.keyboard && (1 === e(r.containerSelector).length || i.multipleKeyboard) && e(document).bind("keyup", function(e) {
                    e = e.keyCode;
                    !r.animating && (39 === e || 37 === e) && (e = 39 === e ? r.getTarget("next") : 37 === e ? r.getTarget("prev") : !1, r.flexAnimate(e, i.pauseOnAction))
                });
                i.mousewheel && r.bind("mousewheel", function(e, t) {
                    e.preventDefault();
                    var n = 0 > t ? r.getTarget("next") : r.getTarget("prev");
                    r.flexAnimate(n, i.pauseOnAction)
                });
                i.pausePlay && p.pausePlay.setup();
                i.slideshow && (i.pauseOnHover && r.hover(function() {
                    !r.manualPlay && !r.manualPause && r.pause()
                }, function() {
                    !r.manualPause && !r.manualPlay && r.play()
                }), 0 < i.initDelay ? setTimeout(r.play, i.initDelay) : r.play());
                o && i.touch && p.touch();
                (!c || c && i.smoothHeight) && e(window).bind("resize focus", p.resize);
                setTimeout(function() {
                    i.start(r)
                }, 200)
            },
            asNav: {
                setup: function() {
                    r.asNav = !0;
                    r.animatingTo = Math.floor(r.currentSlide / r.move);
                    r.currentItem = r.currentSlide;
                    r.slides.removeClass(s + "active-slide").eq(r.currentItem).addClass(s + "active-slide");
                    r.slides.click(function(t) {
                        t.preventDefault();
                        t = e(this);
                        var n = t.index();
                        !e(i.asNavFor).data("flexslider").animating && !t.hasClass("active") && (r.direction = r.currentItem < n ? "next" : "prev", r.flexAnimate(n, i.pauseOnAction, !1, !0, !0))
                    })
                }
            },
            controlNav: {
                setup: function() {
                    r.manualControls ? p.controlNav.setupManual() : p.controlNav.setupPaging()
                },
                setupPaging: function() {
                    var t = 1,
                        n;
                    r.controlNavScaffold = e('<ol class="' + s + "control-nav " + s + ("thumbnails" === i.controlNav ? "control-thumbs" : "control-paging") + '"></ol>');
                    if (1 < r.pagingCount)
                        for (var a = 0; a < r.pagingCount; a++) n = "thumbnails" === i.controlNav ? '<img src="' + r.slides.eq(a).attr("data-thumb") + '"/>' : "<a>" + t + "</a>", r.controlNavScaffold.append("<li>" + n + "</li>"), t++;
                    r.controlsContainer ? e(r.controlsContainer).append(r.controlNavScaffold) : r.append(r.controlNavScaffold);
                    p.controlNav.set();
                    p.controlNav.active();
                    r.controlNavScaffold.delegate("a, img", u, function(t) {
                        t.preventDefault();
                        t = e(this);
                        var n = r.controlNav.index(t);
                        t.hasClass(s + "active") || (r.direction = n > r.currentSlide ? "next" : "prev", r.flexAnimate(n, i.pauseOnAction))
                    });
                    o && r.controlNavScaffold.delegate("a", "click touchstart", function(e) {
                        e.preventDefault()
                    })
                },
                setupManual: function() {
                    r.controlNav = r.manualControls;
                    p.controlNav.active();
                    r.controlNav.live(u, function(t) {
                        t.preventDefault();
                        t = e(this);
                        var n = r.controlNav.index(t);
                        t.hasClass(s + "active") || (n > r.currentSlide ? r.direction = "next" : r.direction = "prev", r.flexAnimate(n, i.pauseOnAction))
                    });
                    o && r.controlNav.live("click touchstart", function(e) {
                        e.preventDefault()
                    })
                },
                set: function() {
                    r.controlNav = e("." + s + "control-nav li " + ("thumbnails" === i.controlNav ? "img" : "a"), r.controlsContainer ? r.controlsContainer : r)
                },
                active: function() {
                    r.controlNav.removeClass(s + "active").eq(r.animatingTo).addClass(s + "active")
                },
                update: function(t, n) {
                    1 < r.pagingCount && "add" === t ? r.controlNavScaffold.append(e("<li><a>" + r.count + "</a></li>")) : 1 === r.pagingCount ? r.controlNavScaffold.find("li").remove() : r.controlNav.eq(n).closest("li").remove();
                    p.controlNav.set();
                    1 < r.pagingCount && r.pagingCount !== r.controlNav.length ? r.update(n, t) : p.controlNav.active()
                }
            },
            directionNav: {
                setup: function() {
                    var t = e('<ul class="' + s + 'direction-nav"><li><a class="' + s + 'prev" href="#">' + i.prevText + '</a></li><li><a class="' + s + 'next" href="#">' + i.nextText + "</a></li></ul>");
                    r.controlsContainer ? (e(r.controlsContainer).append(t), r.directionNav = e("." + s + "direction-nav li a", r.controlsContainer)) : (r.append(t), r.directionNav = e("." + s + "direction-nav li a", r));
                    p.directionNav.update();
                    r.directionNav.bind(u, function(t) {
                        t.preventDefault();
                        t = e(this).hasClass(s + "next") ? r.getTarget("next") : r.getTarget("prev");
                        r.flexAnimate(t, i.pauseOnAction)
                    });
                    o && r.directionNav.bind("click touchstart", function(e) {
                        e.preventDefault()
                    })
                },
                update: function() {
                    var e = s + "disabled";
                    1 === r.pagingCount ? r.directionNav.addClass(e) : i.animationLoop ? r.directionNav.removeClass(e) : 0 === r.animatingTo ? r.directionNav.removeClass(e).filter("." + s + "prev").addClass(e) : r.animatingTo === r.last ? r.directionNav.removeClass(e).filter("." + s + "next").addClass(e) : r.directionNav.removeClass(e)
                }
            },
            pausePlay: {
                setup: function() {
                    var t = e('<div class="' + s + 'pauseplay"><a></a></div>');
                    r.controlsContainer ? (r.controlsContainer.append(t), r.pausePlay = e("." + s + "pauseplay a", r.controlsContainer)) : (r.append(t), r.pausePlay = e("." + s + "pauseplay a", r));
                    p.pausePlay.update(i.slideshow ? s + "pause" : s + "play");
                    r.pausePlay.bind(u, function(t) {
                        t.preventDefault();
                        e(this).hasClass(s + "pause") ? (r.manualPause = !0, r.manualPlay = !1, r.pause()) : (r.manualPause = !1, r.manualPlay = !0, r.play())
                    });
                    o && r.pausePlay.bind("click touchstart", function(e) {
                        e.preventDefault()
                    })
                },
                update: function(e) {
                    "play" === e ? r.pausePlay.removeClass(s + "pause").addClass(s + "play").text(i.playText) : r.pausePlay.removeClass(s + "play").addClass(s + "pause").text(i.pauseText)
                }
            },
            touch: function() {
                function e(e) {
                    p = a ? s - e.touches[0].pageY : s - e.touches[0].pageX;
                    v = a ? Math.abs(p) < Math.abs(e.touches[0].pageX - o) : Math.abs(p) < Math.abs(e.touches[0].pageY - o);
                    if (!v || 500 < Number(new Date) - d) e.preventDefault(), !c && r.transitions && (i.animationLoop || (p /= 0 === r.currentSlide && 0 > p || r.currentSlide === r.last && 0 < p ? Math.abs(p) / h + 2 : 1), r.setProps(u + p, "setTouch"))
                }

                function n() {
                    t.removeEventListener("touchmove", e, !1);
                    if (r.animatingTo === r.currentSlide && !v && null !== p) {
                        var a = f ? -p : p,
                            l = 0 < a ? r.getTarget("next") : r.getTarget("prev");
                        r.canAdvance(l) && (550 > Number(new Date) - d && 50 < Math.abs(a) || Math.abs(a) > h / 2) ? r.flexAnimate(l, i.pauseOnAction) : c || r.flexAnimate(r.currentSlide, i.pauseOnAction, !0)
                    }
                    t.removeEventListener("touchend", n, !1);
                    u = p = o = s = null
                }
                var s, o, u, h, p, d, v = !1;
                t.addEventListener("touchstart", function(c) {
                    r.animating ? c.preventDefault() : 1 === c.touches.length && (r.pause(), h = a ? r.h : r.w, d = Number(new Date), u = l && f && r.animatingTo === r.last ? 0 : l && f ? r.limit - (r.itemW + i.itemMargin) * r.move * r.animatingTo : l && r.currentSlide === r.last ? r.limit : l ? (r.itemW + i.itemMargin) * r.move * r.currentSlide : f ? (r.last - r.currentSlide + r.cloneOffset) * h : (r.currentSlide + r.cloneOffset) * h, s = a ? c.touches[0].pageY : c.touches[0].pageX, o = a ? c.touches[0].pageX : c.touches[0].pageY, t.addEventListener("touchmove", e, !1), t.addEventListener("touchend", n, !1))
                }, !1)
            },
            resize: function() {
                !r.animating && r.is(":visible") && (l || r.doMath(), c ? p.smoothHeight() : l ? (r.slides.width(r.computedW), r.update(r.pagingCount), r.setProps()) : a ? (r.viewport.height(r.h), r.setProps(r.h, "setTotal")) : (i.smoothHeight && p.smoothHeight(), r.newSlides.width(r.computedW), r.setProps(r.computedW, "setTotal")))
            },
            smoothHeight: function(e) {
                if (!a || c) {
                    var t = c ? r : r.viewport;
                    e ? t.animate({
                        height: r.slides.eq(r.animatingTo).height()
                    }, e) : t.height(r.slides.eq(r.animatingTo).height())
                }
            },
            sync: function(t) {
                var n = e(i.sync).data("flexslider"),
                    s = r.animatingTo;
                switch (t) {
                    case "animate":
                        n.flexAnimate(s, i.pauseOnAction, !1, !0);
                        break;
                    case "play":
                        !n.playing && !n.asNav && n.play();
                        break;
                    case "pause":
                        n.pause()
                }
            }
        };
        r.flexAnimate = function(t, n, u, v, g) {
            h && 1 === r.pagingCount && (r.direction = r.currentItem < t ? "next" : "prev");
            if (!r.animating && (r.canAdvance(t, g) || u) && r.is(":visible")) {
                if (h && v) {
                    if (u = e(i.asNavFor).data("flexslider"), r.atEnd = 0 === t || t === r.count - 1, u.flexAnimate(t, !0, !1, !0, g), r.direction = r.currentItem < t ? "next" : "prev", u.direction = r.direction, Math.ceil((t + 1) / r.visible) - 1 === r.currentSlide || 0 === t) return r.currentItem = t, r.slides.removeClass(s + "active-slide").eq(t).addClass(s + "active-slide"), !1;
                    r.currentItem = t, r.slides.removeClass(s + "active-slide").eq(t).addClass(s + "active-slide"), t = Math.floor(t / r.visible)
                }
                r.animating = !0;
                r.animatingTo = t;
                i.before(r);
                n && r.pause();
                r.syncExists && !g && p.sync("animate");
                i.controlNav && p.controlNav.active();
                l || r.slides.removeClass(s + "active-slide").eq(t).addClass(s + "active-slide");
                r.atEnd = 0 === t || t === r.last;
                i.directionNav && p.directionNav.update();
                t === r.last && (i.end(r), i.animationLoop || r.pause());
                if (c) o ? (r.slides.eq(r.currentSlide).css({
                    opacity: 0,
                    zIndex: 1
                }), r.slides.eq(t).css({
                    opacity: 1,
                    zIndex: 2
                }), r.slides.unbind("webkitTransitionEnd transitionend"), r.slides.eq(r.currentSlide).bind("webkitTransitionEnd transitionend", function() {
                    i.after(r)
                }), r.animating = !1, r.currentSlide = r.animatingTo) : (r.slides.eq(r.currentSlide).fadeOut(i.animationSpeed, i.easing), r.slides.eq(t).fadeIn(i.animationSpeed, i.easing, r.wrapup));
                else {
                    var y = a ? r.slides.filter(":first").height() : r.computedW;
                    l ? (t = i.itemWidth > r.w ? 2 * i.itemMargin : i.itemMargin, t = (r.itemW + t) * r.move * r.animatingTo, t = t > r.limit && 1 !== r.visible ? r.limit : t) : t = 0 === r.currentSlide && t === r.count - 1 && i.animationLoop && "next" !== r.direction ? f ? (r.count + r.cloneOffset) * y : 0 : r.currentSlide === r.last && 0 === t && i.animationLoop && "prev" !== r.direction ? f ? 0 : (r.count + 1) * y : f ? (r.count - 1 - t + r.cloneOffset) * y : (t + r.cloneOffset) * y;
                    r.setProps(t, "", i.animationSpeed);
                    if (r.transitions) {
                        if (!i.animationLoop || !r.atEnd) r.animating = !1, r.currentSlide = r.animatingTo;
                        r.container.unbind("webkitTransitionEnd transitionend");
                        r.container.bind("webkitTransitionEnd transitionend", function() {
                            r.wrapup(y)
                        })
                    } else r.container.animate(r.args, i.animationSpeed, i.easing, function() {
                        r.wrapup(y)
                    })
                }
                i.smoothHeight && p.smoothHeight(i.animationSpeed)
            }
        };
        r.wrapup = function(e) {
            !c && !l && (0 === r.currentSlide && r.animatingTo === r.last && i.animationLoop ? r.setProps(e, "jumpEnd") : r.currentSlide === r.last && 0 === r.animatingTo && i.animationLoop && r.setProps(e, "jumpStart"));
            r.animating = !1;
            r.currentSlide = r.animatingTo;
            i.after(r)
        };
        r.animateSlides = function() {
            r.animating || r.flexAnimate(r.getTarget("next"))
        };
        r.pause = function() {
            clearInterval(r.animatedSlides);
            r.playing = !1;
            i.pausePlay && p.pausePlay.update("play");
            r.syncExists && p.sync("pause")
        };
        r.play = function() {
            r.animatedSlides = setInterval(r.animateSlides, i.slideshowSpeed);
            r.playing = !0;
            i.pausePlay && p.pausePlay.update("pause");
            r.syncExists && p.sync("play")
        };
        r.canAdvance = function(e, t) {
            var n = h ? r.pagingCount - 1 : r.last;
            return t ? !0 : h && r.currentItem === r.count - 1 && 0 === e && "prev" === r.direction ? !0 : h && 0 === r.currentItem && e === r.pagingCount - 1 && "next" !== r.direction ? !1 : e === r.currentSlide && !h ? !1 : i.animationLoop ? !0 : r.atEnd && 0 === r.currentSlide && e === n && "next" !== r.direction ? !1 : r.atEnd && r.currentSlide === n && 0 === e && "next" === r.direction ? !1 : !0
        };
        r.getTarget = function(e) {
            r.direction = e;
            return "next" === e ? r.currentSlide === r.last ? 0 : r.currentSlide + 1 : 0 === r.currentSlide ? r.last : r.currentSlide - 1
        };
        r.setProps = function(e, t, n) {
            var s, o = e ? e : (r.itemW + i.itemMargin) * r.move * r.animatingTo;
            s = -1 * function() {
                if (l) return "setTouch" === t ? e : f && r.animatingTo === r.last ? 0 : f ? r.limit - (r.itemW + i.itemMargin) * r.move * r.animatingTo : r.animatingTo === r.last ? r.limit : o;
                switch (t) {
                    case "setTotal":
                        return f ? (r.count - 1 - r.currentSlide + r.cloneOffset) * e : (r.currentSlide + r.cloneOffset) * e;
                    case "setTouch":
                        return e;
                    case "jumpEnd":
                        return f ? e : r.count * e;
                    case "jumpStart":
                        return f ? r.count * e : e;
                    default:
                        return e
                }
            }() + "px";
            r.transitions && (s = a ? "translate3d(0," + s + ",0)" : "translate3d(" + s + ",0,0)", n = void 0 !== n ? n / 1e3 + "s" : "0s", r.container.css("-" + r.pfx + "-transition-duration", n));
            r.args[r.prop] = s;
            (r.transitions || void 0 === n) && r.container.css(r.args)
        };
        r.setup = function(t) {
            if (c) r.slides.css({
                width: "100%",
                "float": "left",
                marginRight: "-100%",
                position: "relative"
            }), "init" === t && (o ? r.slides.css({
                opacity: 0,
                display: "block",
                webkitTransition: "opacity " + i.animationSpeed / 1e3 + "s ease",
                zIndex: 1
            }).eq(r.currentSlide).css({
                opacity: 1,
                zIndex: 2
            }) : r.slides.eq(r.currentSlide).fadeIn(i.animationSpeed, i.easing)), i.smoothHeight && p.smoothHeight();
            else {
                var n, u;
                "init" === t && (r.viewport = e('<div class="' + s + 'viewport"></div>').css({
                    overflow: "hidden",
                    position: "relative"
                }).appendTo(r).append(r.container), r.cloneCount = 0, r.cloneOffset = 0, f && (u = e.makeArray(r.slides).reverse(), r.slides = e(u), r.container.empty().append(r.slides)));
                i.animationLoop && !l && (r.cloneCount = 2, r.cloneOffset = 1, "init" !== t && r.container.find(".clone").remove(), r.container.append(r.slides.first().clone().addClass("clone")).prepend(r.slides.last().clone().addClass("clone")));
                r.newSlides = e(i.selector, r);
                n = f ? r.count - 1 - r.currentSlide + r.cloneOffset : r.currentSlide + r.cloneOffset;
                a && !l ? (r.container.height(200 * (r.count + r.cloneCount) + "%").css("position", "absolute").width("100%"), setTimeout(function() {
                    r.newSlides.css({
                        display: "block"
                    });
                    r.doMath();
                    r.viewport.height(r.h);
                    r.setProps(n * r.h, "init")
                }, "init" === t ? 100 : 0)) : (r.container.width(200 * (r.count + r.cloneCount) + "%"), r.setProps(n * r.computedW, "init"), setTimeout(function() {
                    r.doMath();
                    r.newSlides.css({
                        width: r.computedW,
                        "float": "left",
                        display: "block"
                    });
                    i.smoothHeight && p.smoothHeight()
                }, "init" === t ? 100 : 0))
            }
            l || r.slides.removeClass(s + "active-slide").eq(r.currentSlide).addClass(s + "active-slide")
        };
        r.doMath = function() {
            var e = r.slides.first(),
                t = i.itemMargin,
                n = i.minItems,
                s = i.maxItems;
            r.w = r.width();
            r.h = e.height();
            r.boxPadding = e.outerWidth() - e.width();
            l ? (r.itemT = i.itemWidth + t, r.minW = n ? n * r.itemT : r.w, r.maxW = s ? s * r.itemT : r.w, r.itemW = r.minW > r.w ? (r.w - t * n) / n : r.maxW < r.w ? (r.w - t * s) / s : i.itemWidth > r.w ? r.w : i.itemWidth, r.visible = Math.floor(r.w / (r.itemW + t)), r.move = 0 < i.move && i.move < r.visible ? i.move : r.visible, r.pagingCount = Math.ceil((r.count - r.visible) / r.move + 1), r.last = r.pagingCount - 1, r.limit = 1 === r.pagingCount ? 0 : i.itemWidth > r.w ? (r.itemW + 2 * t) * r.count - r.w - t : (r.itemW + t) * r.count - r.w - t) : (r.itemW = r.w, r.pagingCount = r.count, r.last = r.count - 1);
            r.computedW = r.itemW - r.boxPadding
        };
        r.update = function(e, t) {
            r.doMath();
            l || (e < r.currentSlide ? r.currentSlide += 1 : e <= r.currentSlide && 0 !== e && (r.currentSlide -= 1), r.animatingTo = r.currentSlide);
            if (i.controlNav && !r.manualControls)
                if ("add" === t && !l || r.pagingCount > r.controlNav.length) p.controlNav.update("add");
                else if ("remove" === t && !l || r.pagingCount < r.controlNav.length) l && r.currentSlide > r.last && (r.currentSlide -= 1, r.animatingTo -= 1), p.controlNav.update("remove", r.last);
            i.directionNav && p.directionNav.update()
        };
        r.addSlide = function(t, n) {
            var s = e(t);
            r.count += 1;
            r.last = r.count - 1;
            a && f ? void 0 !== n ? r.slides.eq(r.count - n).after(s) : r.container.prepend(s) : void 0 !== n ? r.slides.eq(n).before(s) : r.container.append(s);
            r.update(n, "add");
            r.slides = e(i.selector + ":not(.clone)", r);
            r.setup();
            i.added(r)
        };
        r.removeSlide = function(t) {
            var n = isNaN(t) ? r.slides.index(e(t)) : t;
            r.count -= 1;
            r.last = r.count - 1;
            isNaN(t) ? e(t, r.slides).remove() : a && f ? r.slides.eq(r.last).remove() : r.slides.eq(t).remove();
            r.doMath();
            r.update(n, "remove");
            r.slides = e(i.selector + ":not(.clone)", r);
            r.setup();
            i.removed(r)
        };
        p.init()
    };
    e.flexslider.defaults = {
        namespace: "flex-",
        selector: ".slides > li",
        animation: "fade",
        easing: "swing",
        direction: "horizontal",
        reverse: !1,
        animationLoop: !0,
        smoothHeight: !1,
        startAt: 0,
        slideshow: !0,
        slideshowSpeed: 7e3,
        animationSpeed: 600,
        initDelay: 0,
        randomize: !1,
        pauseOnAction: !0,
        pauseOnHover: !1,
        useCSS: !0,
        touch: !0,
        video: !1,
        controlNav: !0,
        directionNav: !0,
        prevText: "Previous",
        nextText: "Next",
        keyboard: !0,
        multipleKeyboard: !1,
        mousewheel: !1,
        pausePlay: !1,
        pauseText: "Pause",
        playText: "Play",
        controlsContainer: "",
        manualControls: "",
        sync: "",
        asNavFor: "",
        itemWidth: 0,
        itemMargin: 0,
        minItems: 0,
        maxItems: 0,
        move: 0,
        start: function() {},
        before: function() {},
        after: function() {},
        end: function() {},
        added: function() {},
        removed: function() {}
    };
    e.fn.flexslider = function(t) {
        void 0 === t && (t = {});
        if ("object" == typeof t) return this.each(function() {
            var n = e(this),
                r = n.find(t.selector ? t.selector : ".slides > li");
            1 === r.length ? (r.fadeIn(400), t.start && t.start(n)) : void 0 == n.data("flexslider") && new e.flexslider(this, t)
        });
        var n = e(this).data("flexslider");
        switch (t) {
            case "play":
                n.play();
                break;
            case "pause":
                n.pause();
                break;
            case "next":
                n.flexAnimate(n.getTarget("next"), !0);
                break;
            case "prev":
            case "previous":
                n.flexAnimate(n.getTarget("prev"), !0);
                break;
            default:
                "number" == typeof t && n.flexAnimate(t, !0)
        }
    }
})(jQuery);