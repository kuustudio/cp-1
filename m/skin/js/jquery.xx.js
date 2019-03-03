(function(i) {
    var l = "2.73";
    if (i.support == undefined) {
        i.support = {
            opacity:!i.browser.msie
        };
    }
    function a(q) {
        if (i.fn.cycle.debug) {
            f(q);
        }
    }
    function f() {
        if (window.console && window.console.log) {
            window.console.log("[cycle] " + Array.prototype.join.call(arguments, " "));
        }
    }
    i.fn.cycle = function(r, q) {
        var s = {
            s:this.selector,
            c:this.context
        };
        if (this.length === 0 && r != "stop") {
            if (!i.isReady && s.s) {
                f("DOM not ready, queuing slideshow");
                i(function() {
                    i(s.s, s.c).cycle(r, q);
                });
                return this;
            }
            f("terminating; zero elements found by selector" + (i.isReady ? "" :" (DOM not ready)"));
            return this;
        }
        return this.each(function() {
            var w = m(this, r, q);
            if (w === false) {
                return;
            }
            if (this.cycleTimeout) {
                clearTimeout(this.cycleTimeout);
            }
            this.cycleTimeout = this.cyclePause = 0;
            var x = i(this);
            var y = w.slideExpr ? i(w.slideExpr, this) :x.children();
            var u = y.get();
            if (u.length < 2) {
                f("terminating; too few slides: " + u.length);
                return;
            }
            var t = k(x, y, u, w, s);
            if (t === false) {
                return;
            }
            var v = t.continuous ? 10 :h(t.currSlide, t.nextSlide, t, !t.rev);
            if (v) {
                v += t.delay || 0;
                if (v < 10) {
                    v = 10;
                }
                a("first timeout: " + v);
                this.cycleTimeout = setTimeout(function() {
                    e(u, t, 0, !t.rev);
                }, v);
            }
        });
    };
    function m(q, t, r) {
        if (q.cycleStop == undefined) {
            q.cycleStop = 0;
        }
        if (t === undefined || t === null) {
            t = {};
        }
        if (t.constructor == String) {
            switch (t) {
              case "stop":
                q.cycleStop++;
                if (q.cycleTimeout) {
                    clearTimeout(q.cycleTimeout);
                }
                q.cycleTimeout = 0;
                i(q).removeData("cycle.opts");
                return false;

              case "pause":
                q.cyclePause = 1;
                return false;

              case "resume":
                q.cyclePause = 0;
                if (r === true) {
                    t = i(q).data("cycle.opts");
                    if (!t) {
                        f("options not found, can not resume");
                        return false;
                    }
                    if (q.cycleTimeout) {
                        clearTimeout(q.cycleTimeout);
                        q.cycleTimeout = 0;
                    }
                    e(t.elements, t, 1, 1);
                }
                return false;

              case "prev":
              case "next":
                var u = i(q).data("cycle.opts");
                if (!u) {
                    f('options not found, "prev/next" ignored');
                    return false;
                }
                i.fn.cycle[t](u);
                return false;

              default:
                t = {
                    fx:t
                };
            }
            return t;
        } else {
            if (t.constructor == Number) {
                var s = t;
                t = i(q).data("cycle.opts");
                if (!t) {
                    f("options not found, can not advance slide");
                    return false;
                }
                if (s < 0 || s >= t.elements.length) {
                    f("invalid slide index: " + s);
                    return false;
                }
                t.nextSlide = s;
                if (q.cycleTimeout) {
                    clearTimeout(q.cycleTimeout);
                    q.cycleTimeout = 0;
                }
                if (typeof r == "string") {
                    t.oneTimeFx = r;
                }
                e(t.elements, t, 1, s >= t.currSlide);
                return false;
            }
        }
        return t;
    }
    function b(q, r) {
        if (!i.support.opacity && r.cleartype && q.style.filter) {
            try {
                q.style.removeAttribute("filter");
            } catch (s) {}
        }
    }
    function k(y, J, u, t, E) {
        var C = i.extend({}, i.fn.cycle.defaults, t || {}, i.metadata ? y.metadata() :i.meta ? y.data() :{});
        if (C.autostop) {
            C.countdown = C.autostopCount || u.length;
        }
        var r = y[0];
        y.data("cycle.opts", C);
        C.$cont = y;
        C.stopCount = r.cycleStop;
        C.elements = u;
        C.before = C.before ? [ C.before ] :[];
        C.after = C.after ? [ C.after ] :[];
        C.after.unshift(function() {
            C.busy = 0;
        });
        if (!i.support.opacity && C.cleartype) {
            C.after.push(function() {
                b(this, C);
            });
        }
        if (C.continuous) {
            C.after.push(function() {
                e(u, C, 0, !C.rev);
            });
        }
        n(C);
        if (!i.support.opacity && C.cleartype && !C.cleartypeNoBg) {
            g(J);
        }
        if (y.css("position") == "static") {
            y.css("position", "relative");
        }
        if (C.width) {
            y.width(C.width);
        }
        if (C.height && C.height != "auto") {
            y.height(C.height);
        }
        if (C.startingSlide) {
            C.startingSlide = parseInt(C.startingSlide);
        }
        if (C.random) {
            C.randomMap = [];
            for (var H = 0; H < u.length; H++) {
                C.randomMap.push(H);
            }
            C.randomMap.sort(function(L, w) {
                return Math.random() - .5;
            });
            C.randomIndex = 0;
            C.startingSlide = C.randomMap[0];
        } else {
            if (C.startingSlide >= u.length) {
                C.startingSlide = 0;
            }
        }
        C.currSlide = C.startingSlide = C.startingSlide || 0;
        var x = C.startingSlide;
        J.css({
            position:"absolute",
            top:0,
            left:0
        }).hide().each(function(w) {
            var L = x ? w >= x ? u.length - (w - x) :x - w :u.length - w;
            i(this).css("z-index", L);
        });
        i(u[x]).css("opacity", 1).show();
        b(u[x], C);
        if (C.fit && C.width) {
            J.width(C.width);
        }
        if (C.fit && C.height && C.height != "auto") {
            J.height(C.height);
        }
        var D = C.containerResize && !y.innerHeight();
        if (D) {
            var v = 0, B = 0;
            for (var F = 0; F < u.length; F++) {
                var q = i(u[F]), K = q[0], A = q.outerWidth(), I = q.outerHeight();
                if (!A) {
                    A = K.offsetWidth;
                }
                if (!I) {
                    I = K.offsetHeight;
                }
                v = A > v ? A :v;
                B = I > B ? I :B;
            }
            if (v > 0 && B > 0) {
                y.css({
                    width:v + "px",
                    height:B + "px"
                });
            }
        }
        if (C.pause) {
            y.hover(function() {
                this.cyclePause++;
            }, function() {
                this.cyclePause--;
            });
        }
        if (c(C) === false) {
            return false;
        }
        var s = false;
        t.requeueAttempts = t.requeueAttempts || 0;
        J.each(function() {
            var N = i(this);
            this.cycleH = C.fit && C.height ? C.height :N.height();
            this.cycleW = C.fit && C.width ? C.width :N.width();
            if (N.is("img")) {
                var L = i.browser.msie && this.cycleW == 28 && this.cycleH == 30 && !this.complete;
                var O = i.browser.mozilla && this.cycleW == 34 && this.cycleH == 19 && !this.complete;
                var M = i.browser.opera && (this.cycleW == 42 && this.cycleH == 19 || this.cycleW == 37 && this.cycleH == 17) && !this.complete;
                var w = this.cycleH == 0 && this.cycleW == 0 && !this.complete;
                if (L || O || M || w) {
                    if (E.s && C.requeueOnImageNotLoaded && ++t.requeueAttempts < 100) {
                        f(t.requeueAttempts, " - img slide not loaded, requeuing slideshow: ", this.src, this.cycleW, this.cycleH);
                        setTimeout(function() {
                            i(E.s, E.c).cycle(t);
                        }, C.requeueTimeout);
                        s = true;
                        return false;
                    } else {
                        f("could not determine size of image: " + this.src, this.cycleW, this.cycleH);
                    }
                }
            }
            return true;
        });
        if (s) {
            return false;
        }
        C.cssBefore = C.cssBefore || {};
        C.animIn = C.animIn || {};
        C.animOut = C.animOut || {};
        J.not(":eq(" + x + ")").css(C.cssBefore);
        if (C.cssFirst) {
            i(J[x]).css(C.cssFirst);
        }
        if (C.timeout) {
            C.timeout = parseInt(C.timeout);
            if (C.speed.constructor == String) {
                C.speed = i.fx.speeds[C.speed] || parseInt(C.speed);
            }
            if (!C.sync) {
                C.speed = C.speed / 2;
            }
            while (C.timeout - C.speed < 250) {
                C.timeout += C.speed;
            }
        }
        if (C.easing) {
            C.easeIn = C.easeOut = C.easing;
        }
        if (!C.speedIn) {
            C.speedIn = C.speed;
        }
        if (!C.speedOut) {
            C.speedOut = C.speed;
        }
        C.slideCount = u.length;
        C.currSlide = C.lastSlide = x;
        if (C.random) {
            C.nextSlide = C.currSlide;
            if (++C.randomIndex == u.length) {
                C.randomIndex = 0;
            }
            C.nextSlide = C.randomMap[C.randomIndex];
        } else {
            C.nextSlide = C.startingSlide >= u.length - 1 ? 0 :C.startingSlide + 1;
        }
        if (!C.multiFx) {
            var G = i.fn.cycle.transitions[C.fx];
            if (i.isFunction(G)) {
                G(y, J, C);
            } else {
                if (C.fx != "custom" && !C.multiFx) {
                    f("unknown transition: " + C.fx, "; slideshow terminating");
                    return false;
                }
            }
        }
        var z = J[x];
        if (C.before.length) {
            C.before[0].apply(z, [ z, z, C, true ]);
        }
        if (C.after.length > 1) {
            C.after[1].apply(z, [ z, z, C, true ]);
        }
        if (C.next) {
            i(C.next).bind(C.prevNextEvent, function() {
                return o(C, C.rev ? -1 :1);
            });
        }
        if (C.prev) {
            i(C.prev).bind(C.prevNextEvent, function() {
                return o(C, C.rev ? 1 :-1);
            });
        }
        if (C.pager) {
            d(u, C);
        }
        j(C, u);
        return C;
    }
    function n(q) {
        q.original = {
            before:[],
            after:[]
        };
        q.original.cssBefore = i.extend({}, q.cssBefore);
        q.original.cssAfter = i.extend({}, q.cssAfter);
        q.original.animIn = i.extend({}, q.animIn);
        q.original.animOut = i.extend({}, q.animOut);
        i.each(q.before, function() {
            q.original.before.push(this);
        });
        i.each(q.after, function() {
            q.original.after.push(this);
        });
    }
    function c(w) {
        var u, s, r = i.fn.cycle.transitions;
        if (w.fx.indexOf(",") > 0) {
            w.multiFx = true;
            w.fxs = w.fx.replace(/\s*/g, "").split(",");
            for (u = 0; u < w.fxs.length; u++) {
                var v = w.fxs[u];
                s = r[v];
                if (!s || !r.hasOwnProperty(v) || !i.isFunction(s)) {
                    f("discarding unknown transition: ", v);
                    w.fxs.splice(u, 1);
                    u--;
                }
            }
            if (!w.fxs.length) {
                f("No valid transitions named; slideshow terminating.");
                return false;
            }
        } else {
            if (w.fx == "all") {
                w.multiFx = true;
                w.fxs = [];
                for (p in r) {
                    s = r[p];
                    if (r.hasOwnProperty(p) && i.isFunction(s)) {
                        w.fxs.push(p);
                    }
                }
            }
        }
        if (w.multiFx && w.randomizeEffects) {
            var t = Math.floor(Math.random() * 20) + 30;
            for (u = 0; u < t; u++) {
                var q = Math.floor(Math.random() * w.fxs.length);
                w.fxs.push(w.fxs.splice(q, 1)[0]);
            }
            a("randomized fx sequence: ", w.fxs);
        }
        return true;
    }
    function j(r, q) {
        r.addSlide = function(u, v) {
            var t = i(u), w = t[0];
            if (!r.autostopCount) {
                r.countdown++;
            }
            q[v ? "unshift" :"push"](w);
            if (r.els) {
                r.els[v ? "unshift" :"push"](w);
            }
            r.slideCount = q.length;
            t.css("position", "absolute");
            t[v ? "prependTo" :"appendTo"](r.$cont);
            if (v) {
                r.currSlide++;
                r.nextSlide++;
            }
            if (!i.support.opacity && r.cleartype && !r.cleartypeNoBg) {
                g(t);
            }
            if (r.fit && r.width) {
                t.width(r.width);
            }
            if (r.fit && r.height && r.height != "auto") {
                $slides.height(r.height);
            }
            w.cycleH = r.fit && r.height ? r.height :t.height();
            w.cycleW = r.fit && r.width ? r.width :t.width();
            t.css(r.cssBefore);
            if (r.pager) {
                i.fn.cycle.createPagerAnchor(q.length - 1, w, i(r.pager), q, r);
            }
            if (i.isFunction(r.onAddSlide)) {
                r.onAddSlide(t);
            } else {
                t.hide();
            }
        };
    }
    i.fn.cycle.resetState = function(r, q) {
        q = q || r.fx;
        r.before = [];
        r.after = [];
        r.cssBefore = i.extend({}, r.original.cssBefore);
        r.cssAfter = i.extend({}, r.original.cssAfter);
        r.animIn = i.extend({}, r.original.animIn);
        r.animOut = i.extend({}, r.original.animOut);
        r.fxFn = null;
        i.each(r.original.before, function() {
            r.before.push(this);
        });
        i.each(r.original.after, function() {
            r.after.push(this);
        });
        var s = i.fn.cycle.transitions[q];
        if (i.isFunction(s)) {
            s(r.$cont, i(r.elements), r);
        }
    };
    function e(x, q, w, y) {
        if (w && q.busy && q.manualTrump) {
            i(x).stop(true, true);
            q.busy = false;
        }
        if (q.busy) {
            return;
        }
        var u = q.$cont[0], A = x[q.currSlide], z = x[q.nextSlide];
        if (u.cycleStop != q.stopCount || u.cycleTimeout === 0 && !w) {
            return;
        }
        if (!w && !u.cyclePause && (q.autostop && --q.countdown <= 0 || q.nowrap && !q.random && q.nextSlide < q.currSlide)) {
            if (q.end) {
                q.end(q);
            }
            return;
        }
        if (w || !u.cyclePause) {
            var v = q.fx;
            A.cycleH = A.cycleH || i(A).height();
            A.cycleW = A.cycleW || i(A).width();
            z.cycleH = z.cycleH || i(z).height();
            z.cycleW = z.cycleW || i(z).width();
            if (q.multiFx) {
                if (q.lastFx == undefined || ++q.lastFx >= q.fxs.length) {
                    q.lastFx = 0;
                }
                v = q.fxs[q.lastFx];
                q.currFx = v;
            }
            if (q.oneTimeFx) {
                v = q.oneTimeFx;
                q.oneTimeFx = null;
            }
            i.fn.cycle.resetState(q, v);
            if (q.before.length) {
                i.each(q.before, function(B, C) {
                    if (u.cycleStop != q.stopCount) {
                        return;
                    }
                    C.apply(z, [ A, z, q, y ]);
                });
            }
            var s = function() {
                i.each(q.after, function(B, C) {
                    if (u.cycleStop != q.stopCount) {
                        return;
                    }
                    C.apply(z, [ A, z, q, y ]);
                });
            };
            if (q.nextSlide != q.currSlide) {
                q.busy = 1;
                if (q.fxFn) {
                    q.fxFn(A, z, q, s, y);
                } else {
                    if (i.isFunction(i.fn.cycle[q.fx])) {
                        i.fn.cycle[q.fx](A, z, q, s);
                    } else {
                        i.fn.cycle.custom(A, z, q, s, w && q.fastOnEvent);
                    }
                }
            }
            q.lastSlide = q.currSlide;
            if (q.random) {
                q.currSlide = q.nextSlide;
                if (++q.randomIndex == x.length) {
                    q.randomIndex = 0;
                }
                q.nextSlide = q.randomMap[q.randomIndex];
            } else {
                var t = q.nextSlide + 1 == x.length;
                q.nextSlide = t ? 0 :q.nextSlide + 1;
                q.currSlide = t ? x.length - 1 :q.nextSlide - 1;
            }
            if (q.pager) {
                i.fn.cycle.updateActivePagerLink(q.pager, q.currSlide);
            }
        }
        var r = 0;
        if (q.timeout && !q.continuous) {
            r = h(A, z, q, y);
        } else {
            if (q.continuous && u.cyclePause) {
                r = 10;
            }
        }
        if (r > 0) {
            u.cycleTimeout = setTimeout(function() {
                e(x, q, 0, !q.rev);
            }, r);
        }
    }
    i.fn.cycle.updateActivePagerLink = function(q, r) {
        i(q).each(function() {
            i(this).find("a").removeClass("activeSlide").filter("a:eq(" + r + ")").addClass("activeSlide");
        });
    };
    function h(v, s, u, r) {
        if (u.timeoutFn) {
            var q = u.timeoutFn(v, s, u, r);
            while (q - u.speed < 250) {
                q += u.speed;
            }
            a("calculated timeout: " + q + "; speed: " + u.speed);
            if (q !== false) {
                return q;
            }
        }
        return u.timeout;
    }
    i.fn.cycle.next = function(q) {
        o(q, q.rev ? -1 :1);
    };
    i.fn.cycle.prev = function(q) {
        o(q, q.rev ? 1 :-1);
    };
    function o(r, u) {
        var q = r.elements;
        var t = r.$cont[0], s = t.cycleTimeout;
        if (s) {
            clearTimeout(s);
            t.cycleTimeout = 0;
        }
        if (r.random && u < 0) {
            r.randomIndex--;
            if (--r.randomIndex == -2) {
                r.randomIndex = q.length - 2;
            } else {
                if (r.randomIndex == -1) {
                    r.randomIndex = q.length - 1;
                }
            }
            r.nextSlide = r.randomMap[r.randomIndex];
        } else {
            if (r.random) {
                if (++r.randomIndex == q.length) {
                    r.randomIndex = 0;
                }
                r.nextSlide = r.randomMap[r.randomIndex];
            } else {
                r.nextSlide = r.currSlide + u;
                if (r.nextSlide < 0) {
                    if (r.nowrap) {
                        return false;
                    }
                    r.nextSlide = q.length - 1;
                } else {
                    if (r.nextSlide >= q.length) {
                        if (r.nowrap) {
                            return false;
                        }
                        r.nextSlide = 0;
                    }
                }
            }
        }
        if (i.isFunction(r.prevNextClick)) {
            r.prevNextClick(u > 0, r.nextSlide, q[r.nextSlide]);
        }
        e(q, r, 1, u >= 0);
        return false;
    }
    function d(r, s) {
        var q = i(s.pager);
        i.each(r, function(t, u) {
            i.fn.cycle.createPagerAnchor(t, u, q, r, s);
        });
        i.fn.cycle.updateActivePagerLink(s.pager, s.startingSlide);
    }
    i.fn.cycle.createPagerAnchor = function(u, v, s, t, w) {
        var r;
        if (i.isFunction(w.pagerAnchorBuilder)) {
            r = w.pagerAnchorBuilder(u, v);
        } else {
            r = '<a href="#">' + (u + 1) + "</a>";
        }
        if (!r) {
            return;
        }
        var x = i(r);
        if (x.parents("body").length === 0) {
            var q = [];
            if (s.length > 1) {
                s.each(function() {
                    var y = x.clone(true);
                    i(this).append(y);
                    q.push(y[0]);
                });
                x = i(q);
            } else {
                x.appendTo(s);
            }
        }
        x.bind(w.pagerEvent, function(A) {
            A.preventDefault();
            w.nextSlide = u;
            var z = w.$cont[0], y = z.cycleTimeout;
            if (y) {
                clearTimeout(y);
                z.cycleTimeout = 0;
            }
            if (i.isFunction(w.pagerClick)) {
                w.pagerClick(w.nextSlide, t[w.nextSlide]);
            }
            e(t, w, 1, w.currSlide < u);
            return false;
        });
        if (w.pagerEvent != "click") {
            x.click(function() {
                return false;
            });
        }
        if (w.pauseOnPagerHover) {
            x.hover(function() {
                w.$cont[0].cyclePause++;
            }, function() {
                w.$cont[0].cyclePause--;
            });
        }
    };
    i.fn.cycle.hopsFromLast = function(t, s) {
        var r, q = t.lastSlide, u = t.currSlide;
        if (s) {
            r = u > q ? u - q :t.slideCount - q;
        } else {
            r = u < q ? q - u :q + t.slideCount - u;
        }
        return r;
    };
    function g(s) {
        function r(t) {
            t = parseInt(t).toString(16);
            return t.length < 2 ? "0" + t :t;
        }
        function q(w) {
            for (;w && w.nodeName.toLowerCase() != "html"; w = w.parentNode) {
                var t = i.css(w, "background-color");
                if (t.indexOf("rgb") >= 0) {
                    var u = t.match(/\d+/g);
                    return "#" + r(u[0]) + r(u[1]) + r(u[2]);
                }
                if (t && t != "transparent") {
                    return t;
                }
            }
            return "#ffffff";
        }
        s.each(function() {
            i(this).css("background-color", q(this));
        });
    }
    i.fn.cycle.commonReset = function(v, t, u, r, s, q) {
        i(u.elements).not(v).hide();
        u.cssBefore.opacity = 1;
        u.cssBefore.display = "block";
        if (r !== false && t.cycleW > 0) {
            u.cssBefore.width = t.cycleW;
        }
        if (s !== false && t.cycleH > 0) {
            u.cssBefore.height = t.cycleH;
        }
        u.cssAfter = u.cssAfter || {};
        u.cssAfter.display = "none";
        i(v).css("zIndex", u.slideCount + (q === true ? 1 :0));
        i(t).css("zIndex", u.slideCount + (q === true ? 0 :1));
    };
    i.fn.cycle.custom = function(B, v, q, s, r) {
        var A = i(B), w = i(v);
        var t = q.speedIn, z = q.speedOut, u = q.easeIn, y = q.easeOut;
        w.css(q.cssBefore);
        if (r) {
            if (typeof r == "number") {
                t = z = r;
            } else {
                t = z = 1;
            }
            u = y = null;
        }
        var x = function() {
            w.animate(q.animIn, t, u, s);
        };
        A.animate(q.animOut, z, y, function() {
            if (q.cssAfter) {
                A.css(q.cssAfter);
            }
            if (!q.sync) {
                x();
            }
        });
        if (q.sync) {
            x();
        }
    };
    i.fn.cycle.transitions = {
        fade:function(r, s, q) {
            s.not(":eq(" + q.currSlide + ")").css("opacity", 0);
            q.before.push(function(v, t, u) {
                i.fn.cycle.commonReset(v, t, u);
                u.cssBefore.opacity = 0;
            });
            q.animIn = {
                opacity:1
            };
            q.animOut = {
                opacity:0
            };
            q.cssBefore = {
                top:0,
                left:0
            };
        }
    };
    i.fn.cycle.ver = function() {
        return l;
    };
    i.fn.cycle.defaults = {
        fx:"fade",
        timeout:4e3,
        timeoutFn:null,
        continuous:0,
        speed:1e3,
        speedIn:null,
        speedOut:null,
        next:null,
        prev:null,
        prevNextClick:null,
        prevNextEvent:"click",
        pager:null,
        pagerClick:null,
        pagerEvent:"click",
        pagerAnchorBuilder:null,
        before:null,
        after:null,
        end:null,
        easing:null,
        easeIn:null,
        easeOut:null,
        shuffle:null,
        animIn:null,
        animOut:null,
        cssBefore:null,
        cssAfter:null,
        fxFn:null,
        height:"auto",
        startingSlide:0,
        sync:1,
        random:0,
        fit:0,
        containerResize:1,
        pause:0,
        pauseOnPagerHover:0,
        autostop:0,
        autostopCount:0,
        delay:0,
        slideExpr:null,
        cleartype:!i.support.opacity,
        cleartypeNoBg:false,
        nowrap:0,
        fastOnEvent:0,
        randomizeEffects:1,
        rev:0,
        manualTrump:true,
        requeueOnImageNotLoaded:true,
        requeueTimeout:250
    };
})(jQuery);


var stopscroll = false;
var scrollElem = document.getElementById("andyscroll");
var marqueesHeight = scrollElem.style.height;
scrollElem.onmouseover = new Function('stopscroll = true');
scrollElem.onmouseout  = new Function('stopscroll = false');
var preTop = 0;
var currentTop = 0;
var stoptime = 0;
var leftElem = document.getElementById("scrollmessage"); 
scrollElem.appendChild(leftElem.cloneNode(true));
init_srolltext();
function init_srolltext(){
	scrollElem.scrollTop = 0;
	setInterval('scrollUp()', 100);//确定滚动速度的, 数值越小, 速度越快
}
function scrollUp(){
	if(stopscroll) return;
	currentTop += 2; //设为1, 可以实现间歇式的滚动; 设为2, 则是连续滚动
	if(currentTop == 19) {
		stoptime += 1;
		currentTop -= 1;
		if(stoptime == 180) {
			currentTop = 0;
			stoptime = 0;
		}
	}else{
		preTop = scrollElem.scrollTop;
		scrollElem.scrollTop += 1;
		if(preTop == scrollElem.scrollTop){
			scrollElem.scrollTop = 0;
			scrollElem.scrollTop += 1;
		}
	}
}