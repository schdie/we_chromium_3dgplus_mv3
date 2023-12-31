(function(B, D) {
    if (B.cleanData) {
        var C = B.cleanData;
        B.cleanData = function(E) {
            for (var F = 0, G;
                (G = E[F]) != null; F++) {
                B(G).triggerHandler("remove")
            }
            C(E)
        }
    } else {
        var A = B.fn.remove;
        B.fn.remove = function(E, F) {
            return this.each(function() {
                if (!F) {
                    if (!E || B.filter(E, [this]).length) {
                        B("*", this).add([this]).each(function() {
                            B(this).triggerHandler("remove")
                        })
                    }
                }
                return A.call(B(this), E, F)
            })
        }
    }
    B.widget = function(F, H, E) {
        var G = F.split(".")[0],
            J;
        F = F.split(".")[1];
        J = G + "-" + F;
        if (!E) {
            E = H;
            H = B.Widget
        }
        B.expr[":"][J] = function(K) {
            return !!B.data(K, F)
        };
        B[G] = B[G] || {};
        B[G][F] = function(K, L) {
            if (arguments.length) {
                this._createWidget(K, L)
            }
        };
        var I = new H();
        I.options = B.extend(true, {}, I.options);
        B[G][F].prototype = B.extend(true, I, {
            namespace: G,
            widgetName: F,
            widgetEventPrefix: B[G][F].prototype.widgetEventPrefix || F,
            widgetBaseClass: J
        }, E);
        B.widget.bridge(F, B[G][F])
    };
    B.widget.bridge = function(F, E) {
        B.fn[F] = function(I) {
            var G = typeof I === "string",
                H = Array.prototype.slice.call(arguments, 1),
                J = this;
            I = !G && H.length ? B.extend.apply(null, [true, I].concat(H)) : I;
            if (G && I.charAt(0) === "_") {
                return J
            }
            if (G) {
                this.each(function() {
                    var K = B.data(this, F);
                    if (!K) {
                        throw "cannot call methods on " + F + " prior to initialization; attempted to call method '" + I + "'"
                    }
                    if (!B.isFunction(K[I])) {
                        throw "no such method '" + I + "' for " + F + " widget instance"
                    }
                    var L = K[I].apply(K, H);
                    if (L !== K && L !== D) {
                        J = L;
                        return false
                    }
                })
            } else {
                this.each(function() {
                    var K = B.data(this, F);
                    if (K) {
                        K.option(I || {})._init()
                    } else {
                        B.data(this, F, new E(I, this))
                    }
                })
            }
            return J
        }
    };
    B.Widget = function(E, F) {
        if (arguments.length) {
            this._createWidget(E, F)
        }
    };
    B.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        options: {
            disabled: false
        },
        _createWidget: function(F, G) {
            B.data(G, this.widgetName, this);
            this.element = B(G);
            this.options = B.extend(true, {}, this.options, this._getCreateOptions(), F);
            var E = this;
            this.element.bind("remove." + this.widgetName, function() {
                E.destroy()
            });
            this._create();
            this._trigger("create");
            this._init()
        },
        _getCreateOptions: function() {
            var E = {};
            if (B.metadata) {
                E = B.metadata.get(element)[this.widgetName]
            }
            return E
        },
        _create: function() {},
        _init: function() {},
        destroy: function() {
            this.element.unbind("." + this.widgetName).removeData(this.widgetName);
            this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass + "-disabled ui-state-disabled")
        },
        widget: function() {
            return this.element
        },
        option: function(F, G) {
            var E = F;
            if (arguments.length === 0) {
                return B.extend({}, this.options)
            }
            if (typeof F === "string") {
                if (G === D) {
                    return this.options[F]
                }
                E = {};
                E[F] = G
            }
            this._setOptions(E);
            return this
        },
        _setOptions: function(F) {
            var E = this;
            B.each(F, function(G, H) {
                E._setOption(G, H)
            });
            return this
        },
        _setOption: function(E, F) {
            this.options[E] = F;
            if (E === "disabled") {
                this.widget()[F ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled ui-state-disabled").attr("aria-disabled", F)
            }
            return this
        },
        enable: function() {
            return this._setOption("disabled", false)
        },
        disable: function() {
            return this._setOption("disabled", true)
        },
        _trigger: function(F, G, H) {
            var J = this.options[F];
            G = B.Event(G);
            G.type = (F === this.widgetEventPrefix ? F : this.widgetEventPrefix + F).toLowerCase();
            H = H || {};
            if (G.originalEvent) {
                for (var E = B.event.props.length, I; E;) {
                    I = B.event.props[--E];
                    G[I] = G.originalEvent[I]
                }
            }
            this.element.trigger(G, H);
            return !(B.isFunction(J) && J.call(this.element[0], G, H) === false || G.isDefaultPrevented())
        }
    }
})(jQuery);
(function(A, B) {
    A.widget("mobile.widget", {
        _createWidget: function() {
            A.Widget.prototype._createWidget.apply(this, arguments);
            this._trigger("init")
        },
        _getCreateOptions: function() {
            var D = this.element,
                C = {};
            A.each(this.options, function(E) {
                var F = D.jqmData(E.replace(/[A-Z]/g, function(G) {
                    return "-" + G.toLowerCase()
                }));
                if (F !== B) {
                    C[E] = F
                }
            });
            return C
        },
        enhanceWithin: function(E) {
            var D = A(E).closest(":jqmData(role='page')").data("page"),
                C = (D && D.keepNativeSelector()) || "";
            A(this.options.initSelector, E).not(C)[this.widgetName]()
        }
    })
})(jQuery);
(function(B, D) {
    var C = B(window),
        A = B("html");
    B.mobile.media = (function() {
        var E = {},
            F = B("<div id='jquery-mediatest'>"),
            G = B("<body>").append(F);
        return function(J) {
            if (!(J in E)) {
                var H = document.createElement("style"),
                    I = "@media " + J + " { #jquery-mediatest { position:absolute; } }";
                H.type = "text/css";
                if (H.styleSheet) {
                    H.styleSheet.cssText = I
                } else {
                    H.appendChild(document.createTextNode(I))
                }
                A.prepend(G).prepend(H);
                E[J] = F.css("position") === "absolute";
                G.add(H).remove()
            }
            return E[J]
        }
    })()
})(jQuery);
(function(E, C) {
    var D = E("<body>").prependTo("html"),
        H = D[0].style,
        J = ["Webkit", "Moz", "O"],
        K = "palmGetResource" in window,
        I = window.operamini && ({}).toString.call(window.operamini) === "[object OperaMini]",
        G = window.blackberry;

    function B(O) {
        var N = O.charAt(0).toUpperCase() + O.substr(1),
            M = (O + " " + J.join(N + " ") + N).split(" ");
        for (var L in M) {
            if (H[M[L]] !== C) {
                return true
            }
        }
    }

    function A() {
        return false;
        var P = location.protocol + "//" + location.host + location.pathname + "ui-dir/",
            O = E("head base"),
            Q = null,
            L = "",
            N, M;
        if (!O.length) {
            O = Q = E("<base>", {
                href: P
            }).appendTo("head")
        } else {
            L = O.attr("href")
        }
        N = E("<a href='testurl' />").prependTo(D);
        M = N[0].href;
        O[0].href = L || location.pathname;
        if (Q) {
            Q.remove()
        }
        return M.indexOf(P) === 0
    }
    E.mobile.browser = {};
    E.mobile.browser.ie = (function() {
        var M = 3,
            N = document.createElement("div"),
            L = N.all || [];
        while (N.innerHTML = "<!--[if gt IE " + (++M) + "]><br><![endif]-->", L[0]) {}
        return M > 4 ? M : !M
    })();
    E.extend(E.support, {
        orientation: "orientation" in window && "onorientationchange" in window,
        touch: "ontouchend" in document,
        cssTransitions: "WebKitTransitionEvent" in window,
        pushState: "pushState" in history && "replaceState" in history,
        mediaquery: E.mobile.media("only all"),
        cssPseudoElement: !!B("content"),
        touchOverflow: !!B("overflowScrolling"),
        boxShadow: !!B("boxShadow") && !G,
        scrollTop: ("pageXOffset" in window || "scrollTop" in document.documentElement || "scrollTop" in D[0]) && !K && !I,
        dynamicBaseTag: A()
    });
    D.remove();
    var F = (function() {
        var L = window.navigator.userAgent;
        return L.indexOf("Nokia") > -1 && (L.indexOf("Symbian/3") > -1 || L.indexOf("Series60/5") > -1) && L.indexOf("AppleWebKit") > -1 && L.match(/(BrowserNG|NokiaBrowser)\/7\.[0-3]/)
    })();
    E.mobile.ajaxBlacklist = window.blackberry && !window.WebKitPoint || I || F;
    if (F) {
        E(function() {
            E("head link[rel='stylesheet']").attr("rel", "alternate stylesheet").attr("rel", "stylesheet")
        })
    }
    if (!E.support.boxShadow) {
        E("html").addClass("ui-mobile-nosupport-boxshadow")
    }
})(jQuery);
(function(V, c, D, K) {
    var b = "virtualMouseBindings",
        B = "virtualTouchID",
        A = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),
        U = "clientX clientY pageX pageY screenX screenY".split(" "),
        X = {},
        d = 0,
        Q = 0,
        P = 0,
        N = false,
        g = [],
        F = false,
        o = false,
        S = "addEventListener" in D,
        R = V(D),
        a = 1,
        k = 0;
    V.vmouse = {
        moveDistanceThreshold: 10,
        clickDistanceThreshold: 10,
        resetTimerDuration: 1500
    };

    function O(i) {
        while (i && typeof i.originalEvent !== "undefined") {
            i = i.originalEvent
        }
        return i
    }

    function G(q, r) {
        var z = q.type,
            AA, y, s, p, x, w, v, u;
        q = V.Event(q);
        q.type = r;
        AA = q.originalEvent;
        y = V.event.props;
        if (AA) {
            for (v = y.length, p; v;) {
                p = y[--v];
                q[p] = AA[p]
            }
        }
        if (z.search(/mouse(down|up)|click/) > -1 && !q.which) {
            q.which = 1
        }
        if (z.search(/^touch/) !== -1) {
            s = O(AA);
            z = s.touches;
            x = s.changedTouches;
            w = (z && z.length) ? z[0] : ((x && x.length) ? x[0] : K);
            if (w) {
                for (u = 0, len = U.length; u < len; u++) {
                    p = U[u];
                    q[p] = w[p]
                }
            }
        }
        return q
    }

    function m(r) {
        var p = {},
            i, q;
        while (r) {
            i = V.data(r, b);
            for (q in i) {
                if (i[q]) {
                    p[q] = p.hasVirtualBinding = true
                }
            }
            r = r.parentNode
        }
        return p
    }

    function Y(q, p) {
        var i;
        while (q) {
            i = V.data(q, b);
            if (i && (!p || i[p])) {
                return q
            }
            q = q.parentNode
        }
        return null
    }

    function e() {
        o = false
    }

    function I() {
        o = true
    }

    function n() {
        k = 0;
        g.length = 0;
        F = false;
        I()
    }

    function M() {
        e()
    }

    function T() {
        W();
        d = setTimeout(function() {
            d = 0;
            n()
        }, V.vmouse.resetTimerDuration)
    }

    function W() {
        if (d) {
            clearTimeout(d);
            d = 0
        }
    }

    function L(q, r, i) {
        var p;
        if ((i && i[q]) || (!i && Y(r.target, q))) {
            p = G(r, q);
            V(r.target).trigger(p)
        }
        return p
    }

    function H(p) {
        var q = V.data(p.target, B);
        if (!F && (!k || k !== q)) {
            var i = L("v" + p.type, p);
            if (i) {
                if (i.isDefaultPrevented()) {
                    p.preventDefault()
                }
                if (i.isPropagationStopped()) {
                    p.stopPropagation()
                }
                if (i.isImmediatePropagationStopped()) {
                    p.stopImmediatePropagation()
                }
            }
        }
    }

    function l(q) {
        var s = O(q).touches,
            r, i;
        if (s && s.length === 1) {
            r = q.target;
            i = m(r);
            if (i.hasVirtualBinding) {
                k = a++;
                V.data(r, B, k);
                W();
                M();
                N = false;
                var p = O(q).touches[0];
                Q = p.pageX;
                P = p.pageY;
                L("vmouseover", q, i);
                L("vmousedown", q, i)
            }
        }
    }

    function f(i) {
        if (o) {
            return
        }
        if (!N) {
            L("vmousecancel", i, m(i.target))
        }
        N = true;
        T()
    }

    function C(r) {
        if (o) {
            return
        }
        var p = O(r).touches[0],
            i = N,
            q = V.vmouse.moveDistanceThreshold;
        N = N || (Math.abs(p.pageX - Q) > q || Math.abs(p.pageY - P) > q), flags = m(r.target);
        if (N && !i) {
            L("vmousecancel", r, flags)
        }
        L("vmousemove", r, flags);
        T()
    }

    function E(r) {
        if (o) {
            return
        }
        I();
        var i = m(r.target),
            q;
        L("vmouseup", r, i);
        if (!N) {
            var p = L("vclick", r, i);
            if (p && p.isDefaultPrevented()) {
                q = O(r).changedTouches[0];
                g.push({
                    touchID: k,
                    x: q.clientX,
                    y: q.clientY
                });
                F = true
            }
        }
        L("vmouseout", r, i);
        N = false;
        T()
    }

    function Z(p) {
        var q = V.data(p, b),
            i;
        if (q) {
            for (i in q) {
                if (q[i]) {
                    return true
                }
            }
        }
        return false
    }

    function j() {}

    function J(i) {
        var p = i.substr(1);
        return {
            setup: function(r, q) {
                if (!Z(this)) {
                    V.data(this, b, {})
                }
                var s = V.data(this, b);
                s[i] = true;
                X[i] = (X[i] || 0) + 1;
                if (X[i] === 1) {
                    R.bind(p, H)
                }
                V(this).bind(p, j);
                if (S) {
                    X.touchstart = (X.touchstart || 0) + 1;
                    if (X.touchstart === 1) {
                        R.bind("touchstart", l).bind("touchend", E).bind("touchmove", C).bind("scroll", f)
                    }
                }
            },
            teardown: function(r, q) {
                --X[i];
                if (!X[i]) {
                    R.unbind(p, H)
                }
                if (S) {
                    --X.touchstart;
                    if (!X.touchstart) {
                        R.unbind("touchstart", l).unbind("touchmove", C).unbind("touchend", E).unbind("scroll", f)
                    }
                }
                var s = V(this),
                    t = V.data(this, b);
                if (t) {
                    t[i] = false
                }
                s.unbind(p, j);
                if (!Z(this)) {
                    s.removeData(b)
                }
            }
        }
    }
    for (var h = 0; h < A.length; h++) {
        V.event.special[A[h]] = J(A[h])
    }
    if (S) {
        D.addEventListener("click", function(t) {
            var q = g.length,
                u = t.target,
                w, v, z, s, p, r;
            if (q) {
                w = t.clientX;
                v = t.clientY;
                threshold = V.vmouse.clickDistanceThreshold;
                z = u;
                while (z) {
                    for (s = 0; s < q; s++) {
                        p = g[s];
                        r = 0;
                        if ((z === u && Math.abs(p.x - w) < threshold && Math.abs(p.y - v) < threshold) || V.data(z, B) === p.touchID) {
                            t.preventDefault();
                            t.stopPropagation();
                            return
                        }
                    }
                    z = z.parentNode
                }
            }
        }, true)
    }
})(jQuery, window, document);
(function(C, H, A) {
    C.each(("touchstart touchmove touchend orientationchange throttledresize tap taphold swipe swipeleft swiperight scrollstart scrollstop").split(" "), function(K, J) {
        C.fn[J] = function(L) {
            return L ? this.bind(J, L) : this.trigger(J)
        };
        C.attrFn[J] = true
    });
    var D = C.support.touch,
        E = "touchmove scroll",
        I = D ? "touchstart" : "mousedown",
        G = D ? "touchend" : "mouseup",
        B = D ? "touchmove" : "mousemove";

    function F(M, J, L) {
        var K = L.type;
        L.type = J;
        C.event.handle.call(M, L);
        L.type = K
    }
    C.event.special.scrollstart = {
        enabled: true,
        setup: function() {
            var J = this,
                M = C(J),
                L, N;

            function K(O, P) {
                L = P;
                F(J, L ? "scrollstart" : "scrollstop", O)
            }
            M.bind(E, function(O) {
                if (!C.event.special.scrollstart.enabled) {
                    return
                }
                if (!L) {
                    K(O, true)
                }
                clearTimeout(N);
                N = setTimeout(function() {
                    K(O, false)
                }, 50)
            })
        }
    };
    C.event.special.tap = {
        setup: function() {
            var J = this,
                K = C(J);
            K.bind("vmousedown", function(O) {
                if (O.which && O.which !== 1) {
                    return false
                }
                var N = O.target,
                    L = O.originalEvent,
                    R;

                function M() {
                    clearTimeout(R)
                }

                function Q() {
                    M();
                    K.unbind("vclick", P).unbind("vmouseup", M).unbind("vmousecancel", Q)
                }

                function P(S) {
                    Q();
                    if (N == S.target) {
                        F(J, "tap", S)
                    }
                }
                K.bind("vmousecancel", Q).bind("vmouseup", M).bind("vclick", P);
                R = setTimeout(function() {
                    F(J, "taphold", C.Event("taphold"))
                }, 750)
            })
        }
    };
    C.event.special.swipe = {
        scrollSupressionThreshold: 10,
        durationThreshold: 1000,
        horizontalDistanceThreshold: 30,
        verticalDistanceThreshold: 75,
        setup: function() {
            var J = this,
                K = C(J);
            K.bind(I, function(M) {
                var O = M.originalEvent.touches ? M.originalEvent.touches[0] : M,
                    P = {
                        time: (new Date()).getTime(),
                        coords: [O.pageX, O.pageY],
                        origin: C(M.target)
                    },
                    L;

                function N(Q) {
                    if (!P) {
                        return
                    }
                    var R = Q.originalEvent.touches ? Q.originalEvent.touches[0] : Q;
                    L = {
                        time: (new Date()).getTime(),
                        coords: [R.pageX, R.pageY]
                    };
                    if (Math.abs(P.coords[0] - L.coords[0]) > C.event.special.swipe.scrollSupressionThreshold) {
                        Q.preventDefault()
                    }
                }
                K.bind(B, N).one(G, function(Q) {
                    K.unbind(B, N);
                    if (P && L) {
                        if (L.time - P.time < C.event.special.swipe.durationThreshold && Math.abs(P.coords[0] - L.coords[0]) > C.event.special.swipe.horizontalDistanceThreshold && Math.abs(P.coords[1] - L.coords[1]) < C.event.special.swipe.verticalDistanceThreshold) {
                            P.origin.trigger("swipe").trigger(P.coords[0] > L.coords[0] ? "swipeleft" : "swiperight")
                        }
                    }
                    P = L = A
                })
            })
        }
    };
    (function(O, M) {
        var P = O(M),
            J, N, L;
        O.event.special.orientationchange = J = {
            setup: function() {
                if (O.support.orientation && O.mobile.orientationChangeEnabled) {
                    return false
                }
                L = N();
                P.bind("throttledresize", K)
            },
            teardown: function() {
                if (O.support.orientation && O.mobile.orientationChangeEnabled) {
                    return false
                }
                P.unbind("throttledresize", K)
            },
            add: function(Q) {
                var R = Q.handler;
                Q.handler = function(S) {
                    S.orientation = N();
                    return R.apply(this, arguments)
                }
            }
        };

        function K() {
            var Q = N();
            if (Q !== L) {
                L = Q;
                P.trigger("orientationchange")
            }
        }
        O.event.special.orientationchange.orientation = N = function() {
            var R = true,
                Q = document.documentElement;
            if (O.support.orientation) {
                R = M.orientation % 180 == 0
            } else {
                R = Q && Q.clientWidth / Q.clientHeight < 1.1
            }
            return R ? "portrait" : "landscape"
        }
    })(jQuery, H);
    (function() {
        C.event.special.throttledresize = {
            setup: function() {
                C(this).bind("resize", L)
            },
            teardown: function() {
                C(this).unbind("resize", L)
            }
        };
        var M = 250,
            L = function() {
                O = (new Date()).getTime();
                N = O - K;
                if (N >= M) {
                    K = O;
                    C(this).trigger("throttledresize")
                } else {
                    if (J) {
                        clearTimeout(J)
                    }
                    J = setTimeout(L, M - N)
                }
            },
            K = 0,
            J, O, N
    })();
    C.each({
        scrollstop: "scrollstart",
        taphold: "tap",
        swipeleft: "swipe",
        swiperight: "swipe"
    }, function(K, J) {
        C.event.special[K] = {
            setup: function() {
                C(this).bind(J, C.noop)
            }
        }
    })
})(jQuery, this);
(function($, E, B) {
    var C = "hashchange",
        H = document,
        F, G = $.event.special,
        I = H.documentMode,
        D = "on" + C in E && (I === B || I > 7);

    function A(J) {
        J = J || location.href;
        return "#" + J.replace(/^[^#]*#?(.*)$/, "$1")
    }
    $.fn[C] = function(J) {
        return J ? this.bind(C, J) : this.trigger(C)
    };
    $.fn[C].delay = 50;
    G[C] = $.extend(G[C], {
        setup: function() {
            if (D) {
                return false
            }
            $(F.start)
        },
        teardown: function() {
            if (D) {
                return false
            }
            $(F.stop)
        }
    });
    F = (function() {
        var J = {},
            P, M = A(),
            K = function(Q) {
                return Q
            },
            L = K,
            O = K;
        J.start = function() {
            P || N()
        };
        J.stop = function() {
            P && clearTimeout(P);
            P = B
        };

        function N() {
            var R = A(),
                Q = O(M);
            if (R !== M) {
                L(M = R, Q);
                $(E).trigger(C)
            } else {
                if (Q !== M) {
                    location.href = location.href.replace(/#.*/, "") + Q
                }
            }
            P = setTimeout(N, $.fn[C].delay)
        }
        $.browser.msie && !D && (function() {
            var Q, R;
            J.start = function() {
                if (!Q) {
                    R = $.fn[C].src;
                    R = R && R + A();
                    Q = $('<iframe tabindex="-1" title="empty"/>').hide().one("load", function() {
                        R || L(A());
                        N()
                    }).attr("src", R || "javascript:0").insertAfter("body")[0].contentWindow;
                    H.onpropertychange = function() {
                        try {
                            if (event.propertyName === "title") {
                                Q.document.title = H.title
                            }
                        } catch (S) {}
                    }
                }
            };
            J.stop = K;
            O = function() {
                return A(Q.location.href)
            };
            L = function(V, S) {
                var U = Q.document,
                    T = $.fn[C].domain;
                if (V !== S) {
                    U.title = H.title;
                    U.open();
                    T && U.write('<script>document.domain="' + T + '"<\/script>');
                    U.close();
                    Q.location.hash = V
                }
            }
        })();
        return J
    })()
})(jQuery, this);
(function(A, B) {
    A.widget("mobile.page", A.mobile.widget, {
        options: {
            theme: "c",
            domCache: false,
            keepNativeDefault: ":jqmData(role='none'), :jqmData(role='nojs')"
        },
        _create: function() {
            this._trigger("beforecreate");
            this.element.attr("tabindex", "0").addClass("ui-page ui-body-" + this.options.theme)
        },
        keepNativeSelector: function() {
            var C = this.options,
                D = C.keepNative && A.trim(C.keepNative);
            if (D && C.keepNative !== C.keepNativeDefault) {
                return [C.keepNative, C.keepNativeDefault].join(", ")
            }
            return C.keepNativeDefault
        }
    })
})(jQuery);
(function(E, D, F) {
    var C = {};
    E.extend(E.mobile, {
        ns: "",
        subPageUrlKey: "ui-page",
        activePageClass: "ui-page-active",
        activeBtnClass: "ui-btn-active",
        ajaxEnabled: true,
        hashListeningEnabled: true,
        linkBindingEnabled: true,
        defaultPageTransition: "slide",
        minScrollBack: 250,
        defaultDialogTransition: "pop",
        loadingMessage: "loading",
        pageLoadErrorMessage: "Error Loading Page",
        autoInitializePage: true,
        pushStateEnabled: true,
        orientationChangeEnabled: true,
        gradeA: function() {
            return E.support.mediaquery || E.mobile.browser.ie && E.mobile.browser.ie >= 7
        },
        keyCode: {
            ALT: 18,
            BACKSPACE: 8,
            CAPS_LOCK: 20,
            COMMA: 188,
            COMMAND: 91,
            COMMAND_LEFT: 91,
            COMMAND_RIGHT: 93,
            CONTROL: 17,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            INSERT: 45,
            LEFT: 37,
            MENU: 93,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SHIFT: 16,
            SPACE: 32,
            TAB: 9,
            UP: 38,
            WINDOWS: 91
        },
        silentScroll: function(G) {
            if (E.type(G) !== "number") {
                G = E.mobile.defaultHomeScroll
            }
            E.event.special.scrollstart.enabled = false;
            setTimeout(function() {
                D.scrollTo(0, G);
                E(document).trigger("silentscroll", {
                    x: 0,
                    y: G
                })
            }, 20);
            setTimeout(function() {
                E.event.special.scrollstart.enabled = true
            }, 150)
        },
        nsNormalizeDict: C,
        nsNormalize: function(G) {
            if (!G) {
                return
            }
            return C[G] || (C[G] = E.camelCase(E.mobile.ns + G))
        },
        getInheritedTheme: function(K, H) {
            var L = K[0],
                I = "",
                J = /ui-(bar|body)-([a-z])\b/,
                M, G;
            while (L) {
                var M = L.className || "";
                if ((G = J.exec(M)) && (I = G[2])) {
                    break
                }
                L = L.parentNode
            }
            return I || H || "a"
        }
    });
    E.fn.jqmData = function(I, H) {
        var G;
        if (typeof I != "undefined") {
            G = this.data(I ? E.mobile.nsNormalize(I) : I, H)
        }
        return G
    };
    E.jqmData = function(H, J, I) {
        var G;
        if (typeof J != "undefined") {
            G = E.data(H, J ? E.mobile.nsNormalize(J) : J, I)
        }
        return G
    };
    E.fn.jqmRemoveData = function(G) {
        return this.removeData(E.mobile.nsNormalize(G))
    };
    E.jqmRemoveData = function(G, H) {
        return E.removeData(G, E.mobile.nsNormalize(H))
    };
    E.fn.removeWithDependents = function() {
        E.removeWithDependents(this)
    };
    E.removeWithDependents = function(H) {
        var G = E(H);
        (G.jqmData("dependents") || E()).remove();
        G.remove()
    };
    E.fn.addDependents = function(G) {
        E.addDependents(E(this), G)
    };
    E.addDependents = function(G, H) {
        var I = E(G).jqmData("dependents") || E();
        E(G).jqmData("dependents", E.merge(I, H))
    };
    E.fn.getEncodedText = function() {
        return E("<div/>").text(E(this).text()).html()
    };
    var B = E.find,
        A = /:jqmData\(([^)]*)\)/g;
    E.find = function(H, J, I, G) {
        H = H.replace(A, "[data-" + (E.mobile.ns || "") + "$1]");
        return B.call(this, H, J, I, G)
    };
    E.extend(E.find, B);
    E.find.matches = function(G, H) {
        return E.find(G, null, null, H)
    };
    E.find.matchesSelector = function(G, H) {
        return E.find(H, null, null, [G]).length > 0
    }
})(jQuery, this);
(function(H, J) {
    var R = H(window),
        V = H("html"),
        O = H("head"),
        U = {
            urlParseRE: /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,
            parseUrl: function(f) {
                if (H.type(f) === "object") {
                    return f
                }
                var g = U.urlParseRE.exec(f || "") || [];
                return {
                    href: g[0] || "",
                    hrefNoHash: g[1] || "",
                    hrefNoSearch: g[2] || "",
                    domain: g[3] || "",
                    protocol: g[4] || "",
                    doubleSlash: g[5] || "",
                    authority: g[6] || "",
                    username: g[8] || "",
                    password: g[9] || "",
                    host: g[10] || "",
                    hostname: g[11] || "",
                    port: g[12] || "",
                    pathname: g[13] || "",
                    directory: g[14] || "",
                    filename: g[15] || "",
                    search: g[16] || "",
                    hash: g[17] || ""
                }
            },
            makePathAbsolute: function(j, h) {
                if (j && j.charAt(0) === "/") {
                    return j
                }
                j = j || "";
                h = h ? h.replace(/^\/|(\/[^\/]*|[^\/]+)$/g, "") : "";
                var f = h ? h.split("/") : [],
                    l = j.split("/");
                for (var g = 0; g < l.length; g++) {
                    var k = l[g];
                    switch (k) {
                        case ".":
                            break;
                        case "..":
                            if (f.length) {
                                f.pop()
                            }
                            break;
                        default:
                            f.push(k);
                            break
                    }
                }
                return "/" + f.join("/")
            },
            isSameDomain: function(g, f) {
                return U.parseUrl(g).domain === U.parseUrl(f).domain
            },
            isRelativeUrl: function(f) {
                return U.parseUrl(f).protocol === ""
            },
            isAbsoluteUrl: function(f) {
                return U.parseUrl(f).protocol !== ""
            },
            makeUrlAbsolute: function(g, i) {
                if (!U.isRelativeUrl(g)) {
                    return g
                }
                var k = U.parseUrl(g),
                    n = U.parseUrl(i),
                    o = k.protocol || n.protocol,
                    h = k.protocol ? k.doubleSlash : (k.doubleSlash || n.doubleSlash),
                    l = k.authority || n.authority,
                    m = k.pathname !== "",
                    f = U.makePathAbsolute(k.pathname || n.filename, n.pathname),
                    p = k.search || (!m && n.search) || "",
                    j = k.hash;
                return o + h + l + f + p + j
            },
            addSearchParams: function(g, j) {
                var f = U.parseUrl(g),
                    i = (typeof j === "object") ? H.param(j) : j,
                    h = f.search || "?";
                return f.hrefNoSearch + h + (h.charAt(h.length - 1) !== "?" ? "&" : "") + i + (f.hash || "")
            },
            convertUrlToDataUrl: function(g) {
                var f = U.parseUrl(g);
                if (U.isEmbeddedPage(f)) {
                    return f.hash.split(d)[0].replace(/^#/, "")
                } else {
                    if (U.isSameDomain(f, Y)) {
                        return f.hrefNoHash.replace(Y.domain, "")
                    }
                }
                return g
            },
            get: function(f) {
                if (f === J) {
                    f = location.hash
                }
                return U.stripHash(f).replace(/[^\/]*\.[^\/*]+$/, "")
            },
            getFilePath: function(g) {
                var f = "&" + H.mobile.subPageUrlKey;
                return g && g.split(f)[0].split(d)[0]
            },
            set: function(f) {
                location.hash = f
            },
            isPath: function(f) {
                return (/\//).test(f)
            },
            clean: function(f) {
                return f.replace(Y.domain, "")
            },
            stripHash: function(f) {
                return f.replace(/^#/, "")
            },
            cleanHash: function(f) {
                return U.stripHash(f.replace(/\?.*$/, "").replace(d, ""))
            },
            isExternal: function(g) {
                var f = U.parseUrl(g);
                return f.protocol && f.domain !== G.domain ? true : false
            },
            hasProtocol: function(f) {
                return (/^(:?\w+:)/).test(f)
            },
            isFirstPageUrl: function(h) {
                var g = U.parseUrl(U.makeUrlAbsolute(h, Y)),
                    j = g.hrefNoHash === G.hrefNoHash || (B && g.hrefNoHash === Y.hrefNoHash),
                    f = H.mobile.firstPage,
                    i = f && f[0] ? f[0].id : J;
                return j && (!g.hash || g.hash === "#" || (i && g.hash.replace(/^#/, "") === i))
            },
            isEmbeddedPage: function(g) {
                var f = U.parseUrl(g);
                if (f.protocol !== "") {
                    return (f.hash && (f.hrefNoHash === G.hrefNoHash || (B && f.hrefNoHash === Y.hrefNoHash)))
                }
                return (/^#/).test(f.href)
            }
        },
        e = null,
        F = {
            stack: [],
            activeIndex: 0,
            getActive: function() {
                return F.stack[F.activeIndex]
            },
            getPrev: function() {
                return F.stack[F.activeIndex - 1]
            },
            getNext: function() {
                return F.stack[F.activeIndex + 1]
            },
            addNew: function(f, i, h, g, j) {
                if (F.getNext()) {
                    F.clearForward()
                }
                F.stack.push({
                    url: f,
                    transition: i,
                    title: h,
                    pageUrl: g,
                    role: j
                });
                F.activeIndex = F.stack.length - 1
            },
            clearForward: function() {
                F.stack = F.stack.slice(0, F.activeIndex + 1)
            },
            directHashChange: function(i) {
                var f, g, j, h = this.getActive();
                H.each(F.stack, function(k, l) {
                    if (i.currentUrl === l.url) {
                        f = k < F.activeIndex;
                        g = !f;
                        j = k
                    }
                });
                this.activeIndex = j !== J ? j : this.activeIndex;
                if (f) {
                    (i.either || i.isBack)(true)
                } else {
                    if (g) {
                        (i.either || i.isForward)(false)
                    }
                }
            },
            ignoreNextHashChange: false
        },
        X = "[tabindex],a,button:visible,select:visible,input",
        Q = [],
        Z = false,
        d = "&ui-state=dialog",
        N = O.children("base"),
        G = U.parseUrl(location.href),
        Y = N.length ? U.parseUrl(U.makeUrlAbsolute(N.attr("href"), G.href)) : G,
        B = (G.hrefNoHash !== Y.hrefNoHash);
    var I = H.support.dynamicBaseTag ? {
        element: (N.length ? N : H("<base>", {
            href: Y.hrefNoHash
        }).prependTo(O)),
        set: function(f) {
            I.element.attr("href", U.makeUrlAbsolute(f, Y))
        },
        reset: function() {
            I.element.attr("href", Y.hrefNoHash)
        }
    } : J;

    function M(g) {
        var f = g.find(".ui-title:eq(0)");
        if (f.length) {
            f.focus()
        } else {
            g.focus()
        }
    }

    function b(f) {
        if (!!e && (!e.closest(".ui-page-active").length || f)) {
            e.removeClass(H.mobile.activeBtnClass)
        }
        e = null
    }

    function T() {
        Z = false;
        if (Q.length > 0) {
            H.mobile.changePage.apply(null, Q.pop())
        }
    }
    var P = true,
        S, E, C, c;
    E = function() {
        var f = R,
            h, g = H.support.touchOverflow && H.mobile.touchOverflowEnabled;
        if (g) {
            h = H(".ui-page-active");
            f = h.is(".ui-native-fixed") ? h.find(".ui-content") : h
        }
        return f
    };
    C = function(g) {
        if (!P) {
            return
        }
        var h = H.mobile.urlHistory.getActive();
        if (h) {
            var f = g && g.scrollTop();
            h.lastScroll = f < H.mobile.minScrollBack ? H.mobile.defaultHomeScroll : f
        }
    };
    c = function() {
        setTimeout(C, 100, H(this))
    };
    R.bind(H.support.pushState ? "popstate" : "hashchange", function() {
        P = false
    });
    R.one(H.support.pushState ? "popstate" : "hashchange", function() {
        P = true
    });
    R.one("pagecontainercreate", function() {
        H.mobile.pageContainer.bind("pagechange", function() {
            var f = E();
            P = true;
            f.unbind("scrollstop", c);
            f.bind("scrollstop", c)
        })
    });
    E().bind("scrollstop", c);

    function a(n, h, m, l) {
        var i = H.mobile.urlHistory.getActive(),
            k = H.support.touchOverflow && H.mobile.touchOverflowEnabled,
            j = i.lastScroll || (k ? 0 : H.mobile.defaultHomeScroll),
            g = L();
        window.scrollTo(0, H.mobile.defaultHomeScroll);
        if (h) {
            h.data("page")._trigger("beforehide", null, {
                nextPage: n
            })
        }
        if (!k) {
            n.height(g + j)
        }
        n.data("page")._trigger("beforeshow", null, {
            prevPage: h || H("")
        });
        H.mobile.hidePageLoadingMsg();
        if (k && j) {
            n.addClass("ui-mobile-pre-transition");
            M(n);
            if (n.is(".ui-native-fixed")) {
                n.find(".ui-content").scrollTop(j)
            } else {
                n.scrollTop(j)
            }
        }
        var f = H.mobile.transitionHandlers[m || "none"] || H.mobile.defaultTransitionHandler,
            o = f(m, l, n, h);
        o.done(function() {
            if (!k) {
                n.height("");
                M(n)
            }
            if (!k) {
                H.mobile.silentScroll(j)
            }
            if (h) {
                if (!k) {
                    h.height("")
                }
                h.data("page")._trigger("hide", null, {
                    nextPage: n
                })
            }
            n.data("page")._trigger("show", null, {
                prevPage: h || H("")
            })
        });
        return o
    }

    function L() {
        var h = H.event.special.orientationchange.orientation(),
            g = h === "portrait",
            i = g ? 480 : 320,
            k = g ? screen.availHeight : screen.availWidth,
            f = Math.max(i, H(window).height()),
            j = Math.min(k, f);
        return j
    }
    H.mobile.getScreenHeight = L;

    function A() {
        if (H.support.touchOverflow && H.mobile.touchOverflowEnabled) {
            return
        }
        H("." + H.mobile.activePageClass).css("min-height", L())
    }

    function W(f, g) {
        if (g) {
            f.attr("data-" + H.mobile.ns + "role", g)
        }
        f.page()
    }
    H.fn.animationComplete = function(f) {
        if (H.support.cssTransitions) {
            return H(this).one("webkitAnimationEnd", f)
        } else {
            setTimeout(f, 0);
            return H(this)
        }
    };
    H.mobile.path = U;
    H.mobile.base = I;
    H.mobile.urlHistory = F;
    H.mobile.dialogHashKey = d;
    H.mobile.noneTransitionHandler = function(g, f, i, h) {
        if (h) {
            h.removeClass(H.mobile.activePageClass)
        }
        i.addClass(H.mobile.activePageClass);
        return H.Deferred().resolve(g, f, i, h).promise()
    };
    H.mobile.defaultTransitionHandler = H.mobile.noneTransitionHandler;
    H.mobile.transitionHandlers = {
        none: H.mobile.defaultTransitionHandler
    };
    H.mobile.allowCrossDomainPages = false;
    H.mobile.getDocumentUrl = function(f) {
        return f ? H.extend({}, G) : G.href
    };
    H.mobile.getDocumentBase = function(f) {
        return f ? H.extend({}, Y) : Y.href
    };
    H.mobile._bindPageRemove = function() {
        var f = H(this);
        if (!f.data("page").options.domCache && f.is(":jqmData(external-page='true')")) {
            f.bind("pagehide.remove", function() {
                var h = H(this),
                    g = new H.Event("pageremove");
                h.trigger(g);
                if (!g.isDefaultPrevented()) {
                    h.removeWithDependents()
                }
            })
        }
    };
    H.mobile.loadPage = function(g, u) {
        var t = H.Deferred(),
            h = H.extend({}, H.mobile.loadPage.defaults, u),
            l = null,
            r = null,
            k = function() {
                return G.hrefNoHash
            },
            i = U.makeUrlAbsolute(g, k());
        if (h.data && h.type === "get") {
            i = U.addSearchParams(i, h.data);
            h.data = J
        }
        if (h.data && h.type === "post") {
            h.reloadPage = true
        }
        var q = U.getFilePath(i),
            m = U.convertUrlToDataUrl(i);
        var n;
        if (q != null && q.search(/forcenoajax/) == -1) {
            if (q.search(/\?/) == -1) {
                n = true
            } else {
                n = false
            }
            q += (n ? "?" : "&") + "forcenoajax=1"
        }
        h.pageContainer = h.pageContainer || H.mobile.pageContainer;
        l = h.pageContainer.children(":jqmData(url='" + m + "')");
        if (l.length === 0 && m && !U.isPath(m)) {
            l = h.pageContainer.children("#" + m).attr("data-" + H.mobile.ns + "url", m)
        }
        if (l.length === 0) {
            if (H.mobile.firstPage && U.isFirstPageUrl(q)) {
                if (H.mobile.firstPage.parent().length) {
                    l = H(H.mobile.firstPage)
                }
            } else {
                if (U.isEmbeddedPage(q)) {
                    t.reject(i, u);
                    return t.promise()
                }
            }
        }
        if (I) {
            I.reset()
        }
        if (l.length) {
            if (!h.reloadPage) {
                W(l, h.role);
                t.resolve(i, u, l);
                return t.promise()
            }
            r = l
        }
        var j = h.pageContainer,
            s = new H.Event("pagebeforeload"),
            f = {
                url: g,
                absUrl: i,
                dataUrl: m,
                deferred: t,
                options: h
            };
        j.trigger(s, f);
        if (s.isDefaultPrevented()) {
            return t.promise()
        }
        if (h.showLoadMsg) {
            var p = setTimeout(function() {
                    H.mobile.showPageLoadingMsg()
                }, h.loadMsgDelay),
                o = function() {
                    clearTimeout(p);
                    H.mobile.hidePageLoadingMsg()
                }
        }
        if (!(H.mobile.allowCrossDomainPages || U.isSameDomain(G, i))) {
            t.reject(i, u)
        } else {
            H.ajax({
                url: q,
                type: h.type,
                data: h.data,
                dataType: "html",
                success: function(x, AC, AB) {
                    var y = H("<div></div>"),
                        v = x.match(/<title[^>]*>([^<]*)/) && RegExp.$1,
                        AA = new RegExp("(<[^>]+\\bdata-" + H.mobile.ns + "role=[\"']?page[\"']?[^>]*>)"),
                        w = new RegExp("\\bdata-" + H.mobile.ns + "url=[\"']?([^\"'>]*)[\"']?");
                    if (AA.test(x) && RegExp.$1 && w.test(RegExp.$1) && RegExp.$1) {
                        g = q = U.getFilePath(RegExp.$1)
                    }
                    if (I) {
                        I.set(q)
                    }
                    y.get(0).innerHTML = x;
                    l = y.find(":jqmData(role='page'), :jqmData(role='dialog')").first();
                    if (!l.length) {
                        l = H("<div data-" + H.mobile.ns + "role='page'>" + x.split(/<\/?body[^>]*>/gmi)[1] + "</div>")
                    }
                    if (v && !l.jqmData("title")) {
                        if (~v.indexOf("&")) {
                            v = H("<div>" + v + "</div>").text()
                        }
                        l.jqmData("title", v)
                    }
                    if (!H.support.dynamicBaseTag) {
                        var z = U.get(q);
                        l.find("[src], link[href], a[rel='external'], :jqmData(ajax='false'), a[target]").each(function() {
                            var AE = H(this).is("[href]") ? "href" : H(this).is("[src]") ? "src" : "action",
                                AD = H(this).attr(AE);
                            AD = AD.replace(location.protocol + "//" + location.host + location.pathname, "");
                            if (!/^(\w+:|#|\/)/.test(AD)) {
                                H(this).attr(AE, Y.hrefNoSearch + AD)
                            }
                        })
                    }
                    l.attr("data-" + H.mobile.ns + "url", U.convertUrlToDataUrl(q)).attr("data-" + H.mobile.ns + "external-page", true).appendTo(h.pageContainer);
                    l.one("pagecreate", H.mobile._bindPageRemove);
                    W(l, h.role);
                    if (i.indexOf("&" + H.mobile.subPageUrlKey) > -1) {
                        l = h.pageContainer.children(":jqmData(url='" + m + "')")
                    }
                    if (h.showLoadMsg) {
                        o()
                    }
                    f.xhr = AB;
                    f.textStatus = AC;
                    f.page = l;
                    h.pageContainer.trigger("pageload", f);
                    t.resolve(i, u, l, r)
                },
                error: function(x, y, v) {
                    if (I) {
                        I.set(U.get())
                    }
                    f.xhr = x;
                    f.textStatus = y;
                    f.errorThrown = v;
                    var w = new H.Event("pageloadfailed");
                    h.pageContainer.trigger(w, f);
                    if (w.isDefaultPrevented()) {
                        return
                    }
                    if (h.showLoadMsg) {
                        o();
                        H("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>" + H.mobile.pageLoadErrorMessage + "</h1></div>").css({
                            display: "block",
                            opacity: 0.96,
                            top: R.scrollTop() + 100
                        }).appendTo(h.pageContainer).delay(800).fadeOut(400, function() {
                            H(this).remove()
                        })
                    }
                    t.reject(i, u)
                }
            })
        }
        return t.promise()
    };
    H.mobile.loadPage.defaults = {
        type: "get",
        data: J,
        reloadPage: false,
        role: J,
        showLoadMsg: false,
        pageContainer: J,
        loadMsgDelay: 50
    };
    H.mobile.changePage = function(t, v) {
        if (Z) {
            Q.unshift(arguments);
            return
        }
        var n = H.extend({}, H.mobile.changePage.defaults, v);
        n.pageContainer = n.pageContainer || H.mobile.pageContainer;
        n.fromPage = n.fromPage || H.mobile.activePage;
        var p = n.pageContainer,
            j = new H.Event("pagebeforechange"),
            f = {
                toPage: t,
                options: n
            };
        p.trigger(j, f);
        if (j.isDefaultPrevented()) {
            return
        }
        t = f.toPage;
        Z = true;
        if (typeof t == "string") {
            H.mobile.loadPage(t, n).done(function(y, x, z, w) {
                Z = false;
                x.duplicateCachedPage = w;
                H.mobile.changePage(z, x)
            }).fail(function(x, w) {
                Z = false;
                b(true);
                T();
                n.pageContainer.trigger("pagechangefailed", f)
            });
            return
        }
        if (t[0] === H.mobile.firstPage[0] && !n.dataUrl) {
            n.dataUrl = G.hrefNoHash
        }
        var h = n.fromPage,
            g = (n.dataUrl && U.convertUrlToDataUrl(n.dataUrl)) || t.jqmData("url"),
            m = g,
            s = U.getFilePath(g),
            l = F.getActive(),
            u = F.activeIndex === 0,
            i = 0,
            q = document.title,
            k = n.role === "dialog" || t.jqmData("role") === "dialog";
        if (h && h[0] === t[0] && !n.allowSamePageTransition) {
            Z = false;
            p.trigger("pagechange", f);
            return
        }
        W(t, n.role);
        if (n.fromHashChange) {
            F.directHashChange({
                currentUrl: g,
                isBack: function() {
                    i = -1
                },
                isForward: function() {
                    i = 1
                }
            })
        }
        try {
            if (document.activeElement && document.activeElement.nodeName.toLowerCase() != "body") {
                H(document.activeElement).blur()
            } else {
                H("input:focus, textarea:focus, select:focus").blur()
            }
        } catch (r) {}
        if (k && l) {
            g = (l.url || "") + d
        }
        if (n.changeHash !== false && g) {
            F.ignoreNextHashChange = true;
            U.set(g)
        }
        var o = (!l) ? q : t.jqmData("title") || t.children(":jqmData(role='header')").find(".ui-title").getEncodedText();
        if (!!o && q == document.title) {
            q = o
        }
        if (!t.jqmData("title")) {
            t.jqmData("title", q)
        }
        n.transition = n.transition || ((i && !u) ? l.transition : J) || (k ? H.mobile.defaultDialogTransition : H.mobile.defaultPageTransition);
        if (!i) {
            F.addNew(g, n.transition, q, m, n.role)
        }
        document.title = F.getActive().title;
        H.mobile.activePage = t;
        n.reverse = n.reverse || i < 0;
        a(t, h, n.transition, n.reverse).done(function() {
            b();
            if (n.duplicateCachedPage) {
                n.duplicateCachedPage.remove()
            }
            V.removeClass("ui-mobile-rendering");
            T();
            p.trigger("pagechange", f)
        })
    };
    H.mobile.changePage.defaults = {
        transition: J,
        reverse: false,
        changeHash: true,
        fromHashChange: false,
        role: J,
        duplicateCachedPage: J,
        pageContainer: J,
        showLoadMsg: true,
        dataUrl: J,
        fromPage: J,
        allowSamePageTransition: false
    };

    function K(f) {
        while (f) {
            if ((typeof f.nodeName === "string") && f.nodeName.toLowerCase() == "a") {
                break
            }
            f = f.parentNode
        }
        return f
    }

    function D(h) {
        var f = H(h).closest(".ui-page").jqmData("url"),
            g = Y.hrefNoHash;
        if (!f || !U.isPath(f)) {
            f = g
        }
        return U.makeUrlAbsolute(f, g)
    }
    H.mobile._registerInternalEvents = function() {
        H("form").live("submit", function(h) {
            var j = H(this);
            if (!H.mobile.ajaxEnabled || j.is(":jqmData(ajax='false')")) {
                return
            }
            var g = j.attr("method"),
                i = j.attr("target"),
                f = j.attr("action");
            if (!f) {
                f = D(j);
                if (f === Y.hrefNoHash) {
                    f = G.hrefNoSearch
                }
            }
            f = U.makeUrlAbsolute(f, D(j));
            if (U.isExternal(f) || i) {
                return
            }
            H.mobile.changePage(f, {
                type: g && g.length && g.toLowerCase() || "get",
                data: j.serialize(),
                transition: j.jqmData("transition"),
                direction: j.jqmData("direction"),
                reloadPage: true
            });
            h.preventDefault()
        });
        H(document).bind("vclick", function(g) {
            if (g.which > 1 || !H.mobile.linkBindingEnabled) {
                return
            }
            var f = K(g.target);
            if (f) {
                if (U.parseUrl(f.getAttribute("href") || "#").hash !== "#") {
                    b(true);
                    e = H(f).closest(".ui-btn").not(".ui-disabled");
                    e.addClass(H.mobile.activeBtnClass);
                    H("." + H.mobile.activePageClass + " .ui-btn").not(f).blur()
                }
            }
        });
        H(document).bind("click", function(g) {
            if (!H.mobile.linkBindingEnabled) {
                return
            }
            var q = K(g.target);
            if (!q || g.which > 1) {
                return
            }
            var n = H(q),
                j = function() {
                    window.setTimeout(function() {
                        b(true)
                    }, 200)
                };
            if (n.is(":jqmData(rel='back')")) {
                window.history.back();
                return false
            }
            if (n.is(":jqmData(rel='dialog')")) {
                H.mobile.ajaxEnabled = true
            }
            var m = D(n),
                h = U.makeUrlAbsolute(n.attr("href") || "#", m);
            if (!H.mobile.ajaxEnabled && !U.isEmbeddedPage(h)) {
                j();
                return
            }
            if (h.search("#") != -1) {
                h = h.replace(/[^#]*#/, "");
                if (!h) {
                    g.preventDefault();
                    return
                } else {
                    if (U.isPath(h)) {
                        h = U.makeUrlAbsolute(h, m)
                    } else {
                        h = U.makeUrlAbsolute("#" + h, G.hrefNoHash)
                    }
                }
            }
            var i = n.is("[rel='external']") || n.is(":jqmData(ajax='false')") || n.is("[target]"),
                p = (H.mobile.allowCrossDomainPages && G.protocol === "file:" && h.search(/^https?:/) != -1),
                f = i || (U.isExternal(h) && !p);
            if (f) {
                j();
                return
            }
            var o = n.jqmData("transition"),
                r = n.jqmData("direction"),
                l = (r && r === "reverse") || n.jqmData("back"),
                k = n.attr("data-" + H.mobile.ns + "rel") || J;
            H.mobile.changePage(h, {
                transition: o,
                reverse: l,
                role: k
            });
            g.preventDefault()
        });
        H(".ui-page").live("pageshow.prefetch", function() {
            var f = [];
            H(this).find("a:jqmData(prefetch)").each(function() {
                var g = H(this),
                    h = g.attr("href");
                if (h && H.inArray(h, f) === -1) {
                    f.push(h);
                    H.mobile.loadPage(h, {
                        role: g.attr("data-" + H.mobile.ns + "rel")
                    })
                }
            })
        });
        H.mobile._handleHashChange = function(g) {
            var i = U.stripHash(g),
                h = H.mobile.urlHistory.stack.length === 0 ? "none" : J,
                f = {
                    transition: h,
                    changeHash: false,
                    fromHashChange: true
                };
            if (!H.mobile.hashListeningEnabled || F.ignoreNextHashChange) {
                F.ignoreNextHashChange = false;
                return
            }
            if (F.stack.length > 1 && i.indexOf(d) > -1) {
                if (!H.mobile.activePage.is(".ui-dialog")) {
                    F.directHashChange({
                        currentUrl: i,
                        isBack: function() {
                            window.history.back()
                        },
                        isForward: function() {
                            window.history.forward()
                        }
                    });
                    return
                } else {
                    F.directHashChange({
                        currentUrl: i,
                        either: function(j) {
                            var k = H.mobile.urlHistory.getActive();
                            i = k.pageUrl;
                            H.extend(f, {
                                role: k.role,
                                transition: k.transition,
                                reverse: j
                            })
                        }
                    })
                }
            }
            if (i) {
                i = (typeof i === "string" && !U.isPath(i)) ? (U.makeUrlAbsolute("#" + i, Y)) : i;
                H.mobile.changePage(i, f)
            } else {
                H.mobile.changePage(H.mobile.firstPage, f)
            }
        };
        R.bind("hashchange", function(g, f) {
            H.mobile._handleHashChange(location.hash)
        });
        H(document).bind("pageshow", A);
        H(window).bind("throttledresize", A)
    }
})(jQuery);
(function(E, D) {
    var C = {},
        A = C,
        F = E(D),
        B = E.mobile.path.parseUrl(location.href);
    E.extend(C, {
        initialFilePath: (function() {
            return B.pathname + B.search
        })(),
        initialHref: B.hrefNoHash,
        hashchangeFired: false,
        state: function() {
            return {
                hash: location.hash || "#" + A.initialFilePath,
                title: document.title,
                initialHref: A.initialHref
            }
        },
        resetUIKeys: function(H) {
            var I = E.mobile.dialogHashKey,
                G = "&" + E.mobile.subPageUrlKey,
                J = H.indexOf(I);
            if (J > -1) {
                H = H.slice(0, J) + "#" + H.slice(J)
            } else {
                if (H.indexOf(G) > -1) {
                    H = H.split(G).join("#" + G)
                }
            }
            return H
        },
        nextHashChangePrevented: function(G) {
            E.mobile.urlHistory.ignoreNextHashChange = G;
            A.onHashChangeDisabled = G
        },
        onHashChange: function(K) {
            if (A.onHashChangeDisabled) {
                return
            }
            var G, H, J = location.hash,
                L = E.mobile.path.isPath(J),
                I = L ? location.href : E.mobile.getDocumentUrl();
            J = L ? J.replace("#", "") : J;
            H = A.state();
            G = E.mobile.path.makeUrlAbsolute(J, I);
            if (L) {
                G = A.resetUIKeys(G)
            }
            history.replaceState(H, document.title, G)
        },
        onPopState: function(H) {
            var G = H.originalEvent.state,
                I = false;
            if (G) {
                A.nextHashChangePrevented(true);
                setTimeout(function() {
                    A.nextHashChangePrevented(false);
                    E.mobile._handleHashChange(G.hash)
                }, 100)
            }
        },
        init: function() {
            F.bind("hashchange", A.onHashChange);
            F.bind("popstate", A.onPopState);
            if (location.hash === "") {
                history.replaceState(A.state(), document.title, location.href)
            }
        }
    });
    E(function() {
        if (E.mobile.pushStateEnabled && E.support.pushState) {
            C.init()
        }
    })
})(jQuery, this);
(function(C, B, D) {
    function A(H, G, L, J) {
        var E = new C.Deferred(),
            I = G ? " reverse" : "",
            F = "ui-mobile-viewport-transitioning viewport-" + H,
            K = function() {
                L.add(J).removeClass("out in reverse " + H);
                if (J && J[0] !== L[0]) {
                    J.removeClass(C.mobile.activePageClass)
                }
                L.parent().removeClass(F);
                E.resolve(H, G, L, J)
            };
        L.animationComplete(K);
        L.parent().addClass(F);
        if (J) {
            J.addClass(H + " out" + I)
        }
        L.addClass(C.mobile.activePageClass + " " + H + " in" + I);
        return E.promise()
    }
    C.mobile.css3TransitionHandler = A;
    if (C.mobile.defaultTransitionHandler === C.mobile.noneTransitionHandler) {
        C.mobile.defaultTransitionHandler = A
    }
})(jQuery, this);
(function(A, B) {
    A.mobile.page.prototype.options.degradeInputs = {
        color: false,
        date: false,
        datetime: false,
        "datetime-local": false,
        email: false,
        month: false,
        number: false,
        range: "number",
        search: "text",
        tel: false,
        time: false,
        url: false,
        week: false
    };
    A(document).bind("pagecreate create", function(E) {
        var D = A(E.target).closest(':jqmData(role="page")').data("page"),
            C;
        if (!D) {
            return
        }
        C = D.options;
        A(E.target).find("input").not(D.keepNativeSelector()).each(function() {
            var L = A(this),
                K = this.getAttribute("type"),
                G = C.degradeInputs[K] || "text";
            if (C.degradeInputs[K]) {
                var J = A("<div>").html(L.clone()).html(),
                    F = J.indexOf(" type=") > -1,
                    I = F ? /\s+type=["']?\w+['"]?/ : /\/?>/,
                    H = ' type="' + G + '" data-' + A.mobile.ns + 'type="' + K + '"' + (F ? "" : ">");
                L.replaceWith(J.replace(I, H))
            }
        })
    })
})(jQuery);
(function(B, A, C) {
    B.widget("mobile.dialog", B.mobile.widget, {
        options: {
            closeBtnText: "Close",
            overlayTheme: "a",
            initSelector: ":jqmData(role='dialog')"
        },
        _create: function() {
            var F = this,
                G = this.element,
                E = B("<a href='#' data-" + B.mobile.ns + "icon='delete' data-" + B.mobile.ns + "iconpos='notext'>" + this.options.closeBtnText + "</a>"),
                D = B("<a href='#' data-role='button' data-theme='b'>" + this.options.closeBtnText + "</a>");
            G.addClass("ui-overlay-" + this.options.overlayTheme);
            G.attr("role", "dialog").addClass("ui-dialog").find(":jqmData(role='header')").addClass("ui-corner-top ui-overlay-shadow").prepend(E).end().find(":jqmData(role='content'),:jqmData(role='footer')").addClass("ui-overlay-shadow").last().addClass("ui-corner-bottom");
            G.attr("role", "dialog").find(".bottomclosebutton").prepend(D);
            E.bind("vclick", function() {
                F.close()
            });
            D.bind("vclick", function() {
                F.close()
            });
            G.bind("vclick submit", function(I) {
                var H = B(I.target).closest(I.type === "vclick" ? "a" : "form"),
                    J;
                if (H.length && !H.jqmData("transition")) {
                    J = B.mobile.urlHistory.getActive() || {};
                    H.attr("data-" + B.mobile.ns + "transition", (J.transition || B.mobile.defaultDialogTransition)).attr("data-" + B.mobile.ns + "direction", "reverse")
                }
            }).bind("pagehide", function() {
                B(this).find("." + B.mobile.activeBtnClass).removeClass(B.mobile.activeBtnClass)
            })
        },
        close: function() {
            B.mobile.changePage(B("#page-home"))
        }
    });
    B(B.mobile.dialog.prototype.options.initSelector).live("pagecreate", function() {
        B(this).dialog()
    })
})(jQuery, this);
(function(A, B) {
    A.mobile.page.prototype.options.backBtnText = "Back";
    A.mobile.page.prototype.options.addBackBtn = false;
    A.mobile.page.prototype.options.backBtnTheme = null;
    A.mobile.page.prototype.options.headerTheme = "a";
    A.mobile.page.prototype.options.footerTheme = "a";
    A.mobile.page.prototype.options.contentTheme = null;
    A(":jqmData(role='page'), :jqmData(role='dialog')").live("pagecreate", function(F) {
        var C = A(this),
            G = C.data("page").options,
            E = C.jqmData("role"),
            D = G.theme;
        A(":jqmData(role='header'), :jqmData(role='footer'), :jqmData(role='content')", this).each(function() {
            var M = A(this),
                I = M.jqmData("role"),
                J = M.jqmData("theme"),
                H = J || G.contentTheme || (E === "dialog" && D),
                L, N, P, K;
            M.addClass("ui-" + I);
            if (I === "header" || I === "footer") {
                var O = J || (I === "header" ? G.headerTheme : G.footerTheme) || D;
                M.addClass("ui-bar-" + O).attr("role", I === "header" ? "banner" : "contentinfo");
                L = M.children("a");
                N = L.hasClass("ui-btn-left");
                P = L.hasClass("ui-btn-right");
                N = N || L.eq(0).not(".ui-btn-right").addClass("ui-btn-left").length;
                P = P || L.eq(1).addClass("ui-btn-right").length;
                if (G.addBackBtn && I === "header" && A(".ui-page").length > 1 && M.jqmData("url") !== A.mobile.path.stripHash(location.hash) && !N) {
                    K = A("<a href='#' class='ui-btn-left' data-" + A.mobile.ns + "rel='back' data-" + A.mobile.ns + "icon='arrow-l'>" + G.backBtnText + "</a>").attr("data-" + A.mobile.ns + "theme", G.backBtnTheme || O).prependTo(M)
                }
                M.children("h1, h2, h3, h4, h5, h6").addClass("ui-title").attr({
                    tabindex: "0",
                    role: "heading",
                    "aria-level": "1"
                })
            } else {
                if (I === "content") {
                    if (H) {
                        M.addClass("ui-body-" + (H))
                    }
                    M.attr("role", "main")
                }
            }
        })
    })
})(jQuery);
(function(A, B) {
    A.widget("mobile.collapsible", A.mobile.widget, {
        options: {
            expandCueText: " click to expand contents",
            collapseCueText: " click to collapse contents",
            collapsed: true,
            heading: "h1,h2,h3,h4,h5,h6,legend",
            theme: null,
            contentTheme: null,
            iconTheme: "d",
            initSelector: ":jqmData(role='collapsible')"
        },
        _create: function() {
            var E = this.element,
                G = this.options,
                F = E.addClass("ui-collapsible"),
                C = E.children(G.heading).first(),
                H = F.wrapInner("<div class='ui-collapsible-content'></div>").find(".ui-collapsible-content"),
                D = E.closest(":jqmData(role='collapsible-set')").addClass("ui-collapsible-set");
            if (C.is("legend")) {
                C = A("<div role='heading'>" + C.html() + "</div>").insertBefore(C);
                C.next().remove()
            }
            if (D.length) {
                if (!G.theme) {
                    G.theme = D.jqmData("theme")
                }
                if (!G.contentTheme) {
                    G.contentTheme = D.jqmData("content-theme")
                }
            }
            H.addClass((G.contentTheme) ? ("ui-body-" + G.contentTheme) : "");
            C.insertBefore(H).addClass("ui-collapsible-heading").append("<span class='ui-collapsible-heading-status'></span>").wrapInner("<a href='#' class='ui-collapsible-heading-toggle'></a>").find("a").first().buttonMarkup({
                shadow: false,
                corners: false,
                iconPos: "left",
                icon: "plus",
                theme: G.theme
            }).add(".ui-btn-inner").addClass("ui-corner-top ui-corner-bottom");
            F.bind("expand collapse", function(J) {
                if (!J.isDefaultPrevented()) {
                    J.preventDefault();
                    var L = A(this),
                        K = (J.type === "collapse"),
                        I = G.contentTheme;
                    C.toggleClass("ui-collapsible-heading-collapsed", K).find(".ui-collapsible-heading-status").text(K ? G.expandCueText : G.collapseCueText).end().find(".ui-icon").toggleClass("ui-icon-minus", !K).toggleClass("ui-icon-plus", K);
                    L.toggleClass("ui-collapsible-collapsed", K);
                    H.toggleClass("ui-collapsible-content-collapsed", K).attr("aria-hidden", K);
                    if (I && (!D.length || F.jqmData("collapsible-last"))) {
                        C.find("a").first().add(C.find(".ui-btn-inner")).toggleClass("ui-corner-bottom", K);
                        H.toggleClass("ui-corner-bottom", !K)
                    }
                    H.trigger("updatelayout")
                }
            }).trigger(G.collapsed ? "collapse" : "expand");
            C.bind("click", function(J) {
                var I = C.is(".ui-collapsible-heading-collapsed") ? "expand" : "collapse";
                F.trigger(I);
                J.preventDefault()
            })
        }
    });
    A(document).bind("pagecreate create", function(C) {
        A(A.mobile.collapsible.prototype.options.initSelector, C.target).collapsible()
    })
})(jQuery);
(function(A, B) {
    A.fn.fieldcontain = function(C) {
        return this.addClass("ui-field-contain ui-body ui-br")
    };
    A(document).bind("pagecreate create", function(C) {
        A(":jqmData(role='fieldcontain')", C.target).fieldcontain()
    })
})(jQuery);
(function(A, B) {
    A.fn.grid = function(C) {
        return this.each(function() {
            var H = A(this),
                I = A.extend({
                    grid: null
                }, C),
                J = H.children(),
                F = {
                    solo: 1,
                    a: 2,
                    b: 3,
                    c: 4,
                    d: 5
                },
                D = I.grid,
                E;
            if (!D) {
                if (J.length <= 5) {
                    for (var G in F) {
                        if (F[G] === J.length) {
                            D = G
                        }
                    }
                } else {
                    D = "a"
                }
            }
            E = F[D];
            H.addClass("ui-grid-" + D);
            J.filter(":nth-child(" + E + "n+1)").addClass("ui-block-a");
            if (E > 1) {
                J.filter(":nth-child(" + E + "n+2)").addClass("ui-block-b")
            }
            if (E > 2) {
                J.filter(":nth-child(3n+3)").addClass("ui-block-c")
            }
            if (E > 3) {
                J.filter(":nth-child(4n+4)").addClass("ui-block-d")
            }
            if (E > 4) {
                J.filter(":nth-child(5n+5)").addClass("ui-block-e")
            }
        })
    }
})(jQuery);
(function(A, B) {
    A.widget("mobile.navbar", A.mobile.widget, {
        options: {
            iconpos: "top",
            grid: null,
            initSelector: ":jqmData(role='navbar')"
        },
        _create: function() {
            var E = this.element,
                C = E.find("a"),
                D = C.filter(":jqmData(icon)").length ? this.options.iconpos : B;
            E.addClass("ui-navbar").attr("role", "navigation").find("ul").grid({
                grid: this.options.grid
            });
            if (!D) {
                E.addClass("ui-navbar-noicons")
            }
            C.buttonMarkup({
                corners: false,
                shadow: false,
                iconpos: D
            });
            E.delegate("a", "vclick", function(F) {
                C.not(".ui-state-persist").removeClass(A.mobile.activeBtnClass);
                A(this).addClass(A.mobile.activeBtnClass)
            })
        }
    });
    A(document).bind("pagecreate create", function(C) {
        A(A.mobile.navbar.prototype.options.initSelector, C.target).navbar()
    })
})(jQuery);
(function(A, C) {
    var B = {};
    A.widget("mobile.listview", A.mobile.widget, {
        options: {
            theme: null,
            countTheme: "c",
            headerTheme: "b",
            dividerTheme: "b",
            splitIcon: "arrow-r",
            splitTheme: "b",
            inset: false,
            initSelector: ":jqmData(role='listview')"
        },
        _create: function() {
            var D = this;
            D.element.addClass(function(E, F) {
                return F + " ui-listview " + (D.options.inset ? " ui-listview-inset ui-corner-all ui-shadow " : "")
            });
            D.refresh(true)
        },
        _removeCorners: function(D, F) {
            var E = "ui-corner-top ui-corner-tr ui-corner-tl",
                G = "ui-corner-bottom ui-corner-br ui-corner-bl";
            D = D.add(D.find(".ui-btn-inner, .ui-li-link-alt, .ui-li-thumb"));
            if (F === "top") {
                D.removeClass(E)
            } else {
                if (F === "bottom") {
                    D.removeClass(G)
                } else {
                    D.removeClass(E + " " + G)
                }
            }
        },
        _refreshCorners: function(F) {
            var H, E, D, G;
            if (this.options.inset) {
                H = this.element.children("li");
                E = F ? H.not(".ui-screen-hidden") : H.filter(":visible");
                this._removeCorners(H);
                D = E.first().addClass("ui-corner-top");
                D.add(D.find(".ui-btn-inner").not(".ui-li-link-alt span:first-child")).addClass("ui-corner-top").end().find(".ui-li-link-alt, .ui-li-link-alt span:first-child").addClass("ui-corner-tr").end().find(".ui-li-thumb").not(".ui-li-icon").addClass("ui-corner-tl");
                G = E.last().addClass("ui-corner-bottom");
                G.add(G.find(".ui-btn-inner")).find(".ui-li-link-alt").addClass("ui-corner-br").end().find(".ui-li-thumb").not(".ui-li-icon").addClass("ui-corner-bl")
            }
            if (!F) {
                this.element.trigger("updatelayout")
            }
        },
        _findFirstElementByTagName: function(G, E, D, F) {
            var H = {};
            H[D] = H[F] = true;
            while (G) {
                if (H[G.nodeName]) {
                    return G
                }
                G = G[E]
            }
            return null
        },
        _getChildrenByTagName: function(G, E, F) {
            var D = [],
                H = {};
            H[E] = H[F] = true;
            G = G.firstChild;
            while (G) {
                if (H[G.nodeName]) {
                    D.push(G)
                }
                G = G.nextSibling
            }
            return A(D)
        },
        _addThumbClasses: function(G) {
            var F, E, D = G.length;
            for (F = 0; F < D; F++) {
                E = A(this._findFirstElementByTagName(G[F].firstChild, "nextSibling", "img", "IMG"));
                if (E.length) {
                    E.addClass("ui-li-thumb");
                    A(this._findFirstElementByTagName(E[0].parentNode, "parentNode", "li", "LI")).addClass(E.is(".ui-li-icon") ? "ui-li-has-icon" : "ui-li-has-thumb")
                }
            }
        },
        refresh: function(P) {
            this.parentPage = this.element.closest(".ui-page");
            this._createSubPages();
            var T = this.options,
                D = this.element,
                S = this,
                X = D.jqmData("dividertheme") || T.dividerTheme,
                Q = D.jqmData("splittheme"),
                I = D.jqmData("spliticon"),
                R = this._getChildrenByTagName(D[0], "li", "LI"),
                M = A.support.cssPseudoElement || !A.nodeName(D[0], "ol") ? 0 : 1,
                O = {},
                V, E, N, W, L, H, F, U, J, Y;
            if (M) {
                D.find(".ui-li-dec").remove()
            }
            if (!T.theme) {
                T.theme = A.mobile.getInheritedTheme(this.element, "c")
            }
            for (var K = 0, G = R.length; K < G; K++) {
                V = R.eq(K);
                E = "ui-li";
                if (P || !V.hasClass("ui-li")) {
                    N = V.jqmData("theme") || T.theme;
                    W = this._getChildrenByTagName(V[0], "a", "A");
                    if (W.length) {
                        U = V.jqmData("icon");
                        V.buttonMarkup({
                            wrapperEls: "div",
                            shadow: false,
                            corners: false,
                            iconpos: "right",
                            icon: W.length > 1 || U === false ? false : U || "arrow-r",
                            theme: N
                        });
                        if ((U != false) && (W.length == 1)) {
                            V.addClass("ui-li-has-arrow")
                        }
                        W.first().addClass("ui-link-inherit");
                        if (W.length > 1) {
                            E += " ui-li-has-alt";
                            L = W.last();
                            H = Q || L.jqmData("theme") || T.splitTheme;
                            L.appendTo(V).attr("title", L.getEncodedText()).addClass("ui-li-link-alt").empty().buttonMarkup({
                                shadow: false,
                                corners: false,
                                theme: N,
                                icon: false,
                                iconpos: false
                            }).find(".ui-btn-inner").append(A(document.createElement("span")).buttonMarkup({
                                shadow: true,
                                corners: true,
                                theme: H,
                                iconpos: "notext",
                                icon: I || L.jqmData("icon") || T.splitIcon
                            }))
                        }
                    } else {
                        if (V.jqmData("role") === "list-divider") {
                            E += " ui-li-divider ui-btn ui-bar-" + X;
                            V.attr("role", "heading");
                            if (M) {
                                M = 1
                            }
                        } else {
                            E += " ui-li-static ui-body-" + N
                        }
                    }
                }
                if (M && E.indexOf("ui-li-divider") < 0) {
                    F = V.is(".ui-li-static:first") ? V : V.find(".ui-link-inherit");
                    F.addClass("ui-li-jsnumbering").prepend("<span class='ui-li-dec'>" + (M++) + ". </span>")
                }
                if (!O[E]) {
                    O[E] = []
                }
                O[E].push(V[0])
            }
            for (E in O) {
                A(O[E]).addClass(E).children(".ui-btn-inner").addClass(E)
            }
            D.find("h1, h2, h3, h4, h5, h6").addClass("ui-li-heading").end().find("p, dl").addClass("ui-li-desc").end().find(".ui-li-aside").each(function() {
                var Z = A(this);
                Z.prependTo(Z.parent())
            }).end().find(".ui-li-count").each(function() {
                A(this).closest("li").addClass("ui-li-has-count")
            }).addClass("ui-btn-up-" + (D.jqmData("counttheme") || this.options.countTheme) + " ui-btn-corner-all");
            this._addThumbClasses(R);
            this._addThumbClasses(D.find(".ui-link-inherit"));
            this._refreshCorners(P)
        },
        _idStringEscape: function(D) {
            return D.replace(/[^a-zA-Z0-9]/g, "-")
        },
        _createSubPages: function() {
            var L = this.element,
                M = L.closest(".ui-page"),
                E = M.jqmData("url"),
                H = E || M[0][A.expando],
                F = L.attr("id"),
                G = this.options,
                I = "data-" + A.mobile.ns,
                N = this,
                K = M.find(":jqmData(role='footer')").jqmData("id"),
                D;
            if (typeof B[H] === "undefined") {
                B[H] = -1
            }
            F = F || ++B[H];
            A(L.find("li>ul, li>ol").toArray().reverse()).each(function(T) {
                var Y = this,
                    V = A(this),
                    U = V.attr("id") || F + "-" + T,
                    X = V.parent(),
                    Z = A(V.prevAll().toArray().reverse()),
                    Z = Z.length ? Z : A("<span>" + A.trim(X.contents()[0].nodeValue) + "</span>"),
                    W = Z.first().getEncodedText(),
                    O = (E || "") + "&" + A.mobile.subPageUrlKey + "=" + U,
                    S = V.jqmData("theme") || G.theme,
                    P = V.jqmData("counttheme") || L.jqmData("counttheme") || G.countTheme,
                    Q, R;
                D = true;
                Q = V.detach().wrap("<div " + I + "role='page' " + I + "url='" + O + "' " + I + "theme='" + S + "' " + I + "count-theme='" + P + "'><div " + I + "role='content'></div></div>").parent().before("<div " + I + "role='header' " + I + "theme='" + G.headerTheme + "'><div class='ui-title'>" + W + "</div></div>").after(K ? A("<div " + I + "role='footer' " + I + "id='" + K + "'>") : "").parent().appendTo(A.mobile.pageContainer);
                Q.page();
                R = X.find("a:first");
                if (!R.length) {
                    R = A("<a/>").html(Z || W).prependTo(X.empty())
                }
                R.attr("href", "#" + O)
            }).listview();
            if (D && M.is(":jqmData(external-page='true')") && M.data("page").options.domCache === false) {
                var J = function(R, Q) {
                    var O = Q.nextPage,
                        P;
                    if (Q.nextPage) {
                        P = O.jqmData("url");
                        if (P.indexOf(E + "&" + A.mobile.subPageUrlKey) !== 0) {
                            N.childPages().remove();
                            M.remove()
                        }
                    }
                };
                M.unbind("pagehide.remove").bind("pagehide.remove", J)
            }
        },
        childPages: function() {
            var D = this.parentPage.jqmData("url");
            return A(":jqmData(url^='" + D + "&" + A.mobile.subPageUrlKey + "')")
        }
    });
    A(document).bind("pagecreate create", function(D) {
        A(A.mobile.listview.prototype.options.initSelector, D.target).listview()
    })
})(jQuery);
(function(A, B) {
    A.mobile.listview.prototype.options.filter = false;
    A.mobile.listview.prototype.options.filterPlaceholder = "Filter items...";
    A.mobile.listview.prototype.options.filterTheme = "c";
    A.mobile.listview.prototype.options.filterCallback = function(D, C) {
        return D.toLowerCase().indexOf(C) === -1
    };
    A(":jqmData(role='listview')").live("listviewcreate", function() {
        var E = A(this),
            D = E.data("listview");
        if (!D.options.filter) {
            return
        }
        var F = A("<form>", {
                "class": "ui-listview-filter ui-bar-" + D.options.filterTheme,
                role: "search"
            }),
            C = A("<input>", {
                placeholder: D.options.filterPlaceholder
            }).attr("data-" + A.mobile.ns + "type", "search").jqmData("lastval", "").bind("keyup change", function() {
                var M = A(this),
                    H = this.value.toLowerCase(),
                    I = null,
                    G = M.jqmData("lastval") + "",
                    K = false,
                    L = "",
                    O, N;
                M.jqmData("lastval", H);
                N = H.substr(0, G.length - 1).replace(G, "");
                if (H.length < G.length || N.length != (H.length - G.length)) {
                    I = E.children()
                } else {
                    I = E.children(":not(.ui-screen-hidden)")
                }
                if (H) {
                    for (var J = I.length - 1; J >= 0; J--) {
                        O = A(I[J]);
                        L = O.jqmData("filtertext") || O.text();
                        if (O.is("li:jqmData(role=list-divider)")) {
                            O.toggleClass("ui-filter-hidequeue", !K);
                            K = false
                        } else {
                            if (D.options.filterCallback(L, H)) {
                                O.toggleClass("ui-filter-hidequeue", true)
                            } else {
                                K = true
                            }
                        }
                    }
                    I.filter(":not(.ui-filter-hidequeue)").toggleClass("ui-screen-hidden", false);
                    I.filter(".ui-filter-hidequeue").toggleClass("ui-screen-hidden", true).toggleClass("ui-filter-hidequeue", false)
                } else {
                    I.toggleClass("ui-screen-hidden", false)
                }
                D._refreshCorners()
            }).appendTo(F).textinput();
        if (A(this).jqmData("inset")) {
            F.addClass("ui-listview-filter-inset")
        }
        F.bind("submit", function() {
            return false
        }).insertBefore(E)
    })
})(jQuery);
(function(A, B) {
    A(document).bind("pagecreate create", function(C) {
        A(":jqmData(role='nojs')", C.target).addClass("ui-nojs")
    })
})(jQuery);
(function(A, B) {
    A.widget("mobile.checkboxradio", A.mobile.widget, {
        options: {
            theme: null,
            initSelector: "input[type='checkbox'],input[type='radio']"
        },
        _create: function() {
            var N = this,
                J = this.element,
                I = J.closest("form,fieldset,:jqmData(role='page')").find("label[for='" + J[0].id + "']"),
                K = J.attr("type"),
                M = K + "-on",
                L = K + "-off",
                G = J.parents(":jqmData(type='horizontal')").length ? B : L,
                D = G ? "" : " " + A.mobile.activeBtnClass,
                F = "ui-" + M + D,
                E = "ui-" + L,
                H = "ui-icon-" + M,
                C = "ui-icon-" + L;
            if (K !== "checkbox" && K !== "radio") {
                return
            }
            A.extend(this, {
                label: I,
                inputtype: K,
                checkedClass: F,
                uncheckedClass: E,
                checkedicon: H,
                uncheckedicon: C
            });
            if (!this.options.theme) {
                this.options.theme = this.element.jqmData("theme")
            }
            I.buttonMarkup({
                theme: this.options.theme,
                icon: G,
                shadow: false
            });
            J.add(I).wrapAll("<div class='ui-" + K + "'></div>");
            I.bind({
                vmouseover: function(O) {
                    if (A(this).parent().is(".ui-disabled")) {
                        O.stopPropagation()
                    }
                },
                vclick: function(O) {
                    if (J.is(":disabled")) {
                        O.preventDefault();
                        return
                    }
                    N._cacheVals();
                    J.prop("checked", K === "radio" && true || !J.prop("checked"));
                    J.triggerHandler("click");
                    N._getInputSet().not(J).prop("checked", false);
                    N._updateAll();
                    return false
                }
            });
            J.bind({
                vmousedown: function() {
                    N._cacheVals()
                },
                vclick: function() {
                    var O = A(this);
                    if (O.is(":checked")) {
                        O.prop("checked", true);
                        N._getInputSet().not(O).prop("checked", false)
                    } else {
                        O.prop("checked", false)
                    }
                    N._updateAll()
                },
                focus: function() {
                    I.addClass("ui-focus")
                },
                blur: function() {
                    I.removeClass("ui-focus")
                }
            });
            this.refresh()
        },
        _cacheVals: function() {
            this._getInputSet().each(function() {
                var C = A(this);
                C.jqmData("cacheVal", C.is(":checked"))
            })
        },
        _getInputSet: function() {
            if (this.inputtype == "checkbox") {
                return this.element
            }
            return this.element.closest("form,fieldset,:jqmData(role='page')").find("input[name='" + this.element.attr("name") + "'][type='" + this.inputtype + "']")
        },
        _updateAll: function() {
            var C = this;
            this._getInputSet().each(function() {
                var D = A(this);
                if (D.is(":checked") || C.inputtype === "checkbox") {
                    D.trigger("change")
                }
            }).checkboxradio("refresh")
        },
        refresh: function() {
            var C = this.element,
                D = this.label,
                E = D.find(".ui-icon");
            if (A(C[0]).prop("checked")) {
                D.addClass(this.checkedClass).removeClass(this.uncheckedClass);
                E.addClass(this.checkedicon).removeClass(this.uncheckedicon)
            } else {
                D.removeClass(this.checkedClass).addClass(this.uncheckedClass);
                E.removeClass(this.checkedicon).addClass(this.uncheckedicon)
            }
            if (C.is(":disabled")) {
                this.disable()
            } else {
                this.enable()
            }
        },
        disable: function() {
            this.element.prop("disabled", true).parent().addClass("ui-disabled")
        },
        enable: function() {
            this.element.prop("disabled", false).parent().removeClass("ui-disabled")
        }
    });
    A(document).bind("pagecreate create", function(C) {
        A.mobile.checkboxradio.prototype.enhanceWithin(C.target)
    })
})(jQuery);
/* ---- spoiler button fix ----
(function(A, B) {
    A.widget("mobile.button", A.mobile.widget, {
        options: {
            theme: null,
            icon: null,
            iconpos: null,
            inline: null,
            corners: true,
            shadow: true,
            iconshadow: true,
            initSelector: "button, [type='button'], [type='submit'], [type='reset'], [type='image']"
        },
        _create: function() {
            var D = this.element,
                G = this.options,
                E, C, F;
            this.button = A("<div></div>").text(D.text() || D.val()).insertBefore(D).buttonMarkup({
                theme: G.theme,
                icon: G.icon,
                iconpos: G.iconpos,
                inline: G.inline,
                corners: G.corners,
                shadow: G.shadow,
                iconshadow: G.iconshadow
            }).append(D.addClass("ui-btn-hidden"));
            E = D.attr("type");
            C = D.attr("name");
            if (E !== "button" && E !== "reset" && C) {
                D.bind("vclick", function() {
                    if (F === B) {
                        F = A("<input>", {
                            type: "hidden",
                            name: D.attr("name"),
                            value: D.attr("value")
                        }).insertBefore(D);
                        A(document).one("submit", function() {
                            F.remove();
                            F = B
                        })
                    }
                })
            }
            this.refresh()
        },
        enable: function() {
            this.element.attr("disabled", false);
            this.button.removeClass("ui-disabled").attr("aria-disabled", false);
            return this._setOption("disabled", false)
        },
        disable: function() {
            this.element.attr("disabled", true);
            this.button.addClass("ui-disabled").attr("aria-disabled", true);
            return this._setOption("disabled", true)
        },
        refresh: function() {
            var C = this.element;
            if (C.prop("disabled")) {
                this.disable()
            } else {
                this.enable()
            }
            this.button.data("textWrapper").text(C.text() || C.val())
        }
    });
    A(document).bind("pagecreate create", function(C) {
        A.mobile.button.prototype.enhanceWithin(C.target)
    })
})(jQuery);
 */
(function(A, B) {
    A.widget("mobile.slider", A.mobile.widget, {
        options: {
            theme: null,
            trackTheme: null,
            disabled: false,
            initSelector: "input[type='range'], :jqmData(type='range'), :jqmData(role='slider')"
        },
        _create: function() {
            var R = this,
                J = this.element,
                F = A.mobile.getInheritedTheme(J, "c"),
                K = this.options.theme || F,
                G = this.options.trackTheme || F,
                L = J[0].nodeName.toLowerCase(),
                N = (L == "select") ? "ui-slider-switch" : "",
                H = J.attr("id"),
                M = H + "-label",
                Q = A("[for='" + H + "']").attr("id", M),
                E = function() {
                    return L == "input" ? parseFloat(J.val()) : J[0].selectedIndex
                },
                I = L == "input" ? parseFloat(J.attr("min")) : 0,
                P = L == "input" ? parseFloat(J.attr("max")) : J.find("option").length - 1,
                D = window.parseFloat(J.attr("step") || 1),
                C = A("<div class='ui-slider " + N + " ui-btn-down-" + G + " ui-btn-corner-all' role='application'></div>"),
                O = A("<a href='#' class='ui-slider-handle'></a>").appendTo(C).buttonMarkup({
                    corners: true,
                    theme: K,
                    shadow: true
                }).attr({
                    role: "slider",
                    "aria-valuemin": I,
                    "aria-valuemax": P,
                    "aria-valuenow": E(),
                    "aria-valuetext": E(),
                    title: E(),
                    "aria-labelledby": M
                }),
                S;
            A.extend(this, {
                slider: C,
                handle: O,
                dragging: false,
                beforeStart: null,
                userModified: false,
                mouseMoved: false
            });
            if (L == "select") {
                C.wrapInner("<div class='ui-slider-inneroffset'></div>");
                O.addClass("ui-slider-handle-snapping");
                S = J.find("option");
                J.find("option").each(function(V) {
                    var U = !V ? "b" : "a",
                        T = !V ? "right" : "left",
                        W = !V ? " ui-btn-down-" + G : (" " + A.mobile.activeBtnClass);
                    A("<div class='ui-slider-labelbg ui-slider-labelbg-" + U + W + " ui-btn-corner-" + T + "'></div>").prependTo(C);
                    A("<span class='ui-slider-label ui-slider-label-" + U + W + " ui-btn-corner-" + T + "' role='img'>" + A(this).getEncodedText() + "</span>").prependTo(O)
                })
            }
            Q.addClass("ui-slider");
            J.addClass(L === "input" ? "ui-slider-input" : "ui-slider-switch").change(function() {
                if (!R.mouseMoved) {
                    R.refresh(E(), true)
                }
            }).keyup(function() {
                R.refresh(E(), true, true)
            }).blur(function() {
                R.refresh(E(), true)
            });
            A(document).bind("vmousemove", function(T) {
                if (R.dragging) {
                    R.mouseMoved = true;
                    if (L === "select") {
                        O.removeClass("ui-slider-handle-snapping")
                    }
                    R.refresh(T);
                    R.userModified = R.beforeStart !== J[0].selectedIndex;
                    return false
                }
            });
            C.bind("vmousedown", function(T) {
                R.dragging = true;
                R.userModified = false;
                R.mouseMoved = false;
                if (L === "select") {
                    R.beforeStart = J[0].selectedIndex
                }
                R.refresh(T);
                return false
            });
            C.add(document).bind("vmouseup", function() {
                if (R.dragging) {
                    R.dragging = false;
                    if (L === "select") {
                        O.addClass("ui-slider-handle-snapping");
                        if (R.mouseMoved) {
                            if (R.userModified) {
                                R.refresh(R.beforeStart == 0 ? 1 : 0)
                            } else {
                                R.refresh(R.beforeStart)
                            }
                        } else {
                            R.refresh(R.beforeStart == 0 ? 1 : 0)
                        }
                    }
                    R.mouseMoved = false;
                    return false
                }
            });
            C.insertAfter(J);
            this.handle.bind("vmousedown", function() {
                A(this).focus()
            }).bind("vclick", false);
            this.handle.bind("keydown", function(U) {
                var T = E();
                if (R.options.disabled) {
                    return
                }
                switch (U.keyCode) {
                    case A.mobile.keyCode.HOME:
                    case A.mobile.keyCode.END:
                    case A.mobile.keyCode.PAGE_UP:
                    case A.mobile.keyCode.PAGE_DOWN:
                    case A.mobile.keyCode.UP:
                    case A.mobile.keyCode.RIGHT:
                    case A.mobile.keyCode.DOWN:
                    case A.mobile.keyCode.LEFT:
                        U.preventDefault();
                        if (!R._keySliding) {
                            R._keySliding = true;
                            A(this).addClass("ui-state-active")
                        }
                        break
                }
                switch (U.keyCode) {
                    case A.mobile.keyCode.HOME:
                        R.refresh(I);
                        break;
                    case A.mobile.keyCode.END:
                        R.refresh(P);
                        break;
                    case A.mobile.keyCode.PAGE_UP:
                    case A.mobile.keyCode.UP:
                    case A.mobile.keyCode.RIGHT:
                        R.refresh(T + D);
                        break;
                    case A.mobile.keyCode.PAGE_DOWN:
                    case A.mobile.keyCode.DOWN:
                    case A.mobile.keyCode.LEFT:
                        R.refresh(T - D);
                        break
                }
            }).keyup(function(T) {
                if (R._keySliding) {
                    R._keySliding = false;
                    A(this).removeClass("ui-state-active")
                }
            });
            this.refresh(B, B, true)
        },
        refresh: function(E, C, N) {
            if (this.options.disabled || this.element.attr("disabled")) {
                this.disable()
            }
            var H = this.element,
                J, I = H[0].nodeName.toLowerCase(),
                F = I === "input" ? parseFloat(H.attr("min")) : 0,
                K = I === "input" ? parseFloat(H.attr("max")) : H.find("option").length - 1;
            if (typeof E === "object") {
                var G = E,
                    M = 8;
                if (!this.dragging || G.pageX < this.slider.offset().left - M || G.pageX > this.slider.offset().left + this.slider.width() + M) {
                    return
                }
                J = Math.round(((G.pageX - this.slider.offset().left) / this.slider.width()) * 100)
            } else {
                if (E == null) {
                    E = I === "input" ? parseFloat(H.val()) : H[0].selectedIndex
                }
                J = (parseFloat(E) - F) / (K - F) * 100
            }
            if (isNaN(J)) {
                return
            }
            if (J < 0) {
                J = 0
            }
            if (J > 100) {
                J = 100
            }
            var D = Math.round((J / 100) * (K - F)) + F;
            if (D < F) {
                D = F
            }
            if (D > K) {
                D = K
            }
            if (J > 60 && I === "select") {}
            this.handle.css("left", J + "%");
            this.handle.attr({
                "aria-valuenow": I === "input" ? D : H.find("option").eq(D).attr("value"),
                "aria-valuetext": I === "input" ? D : H.find("option").eq(D).getEncodedText(),
                title: D
            });
            if (I === "select") {
                if (D === 0) {
                    this.slider.addClass("ui-slider-switch-a").removeClass("ui-slider-switch-b")
                } else {
                    this.slider.addClass("ui-slider-switch-b").removeClass("ui-slider-switch-a")
                }
            }
            if (!N) {
                var L = false;
                if (I === "input") {
                    L = H.val() !== D;
                    H.val(D)
                } else {
                    L = H[0].selectedIndex !== D;
                    H[0].selectedIndex = D
                }
                if (!C && L) {
                    H.trigger("change")
                }
            }
        },
        enable: function() {
            this.element.attr("disabled", false);
            this.slider.removeClass("ui-disabled").attr("aria-disabled", false);
            return this._setOption("disabled", false)
        },
        disable: function() {
            this.element.attr("disabled", true);
            this.slider.addClass("ui-disabled").attr("aria-disabled", true);
            return this._setOption("disabled", true)
        }
    });
    A(document).bind("pagecreate create", function(C) {
        A.mobile.slider.prototype.enhanceWithin(C.target)
    })
})(jQuery);
(function(A, B) {
    A.widget("mobile.textinput", A.mobile.widget, {
        options: {
            theme: null,
            initSelector: "input[type='text'], input[type='search'], :jqmData(type='search'), input[type='number'], :jqmData(type='number'), input[type='password'], input[type='email'], input[type='url'], input[type='tel'], textarea, input[type='time'], input[type='date'], input[type='month'], input[type='week'], input[type='datetime'], input[type='datetime-local'], input[type='color'], input:not([type])"
        },
        _create: function() {
            var J = this.element,
                E = this.options,
                G = E.theme || A.mobile.getInheritedTheme(this.element, "c"),
                M = " ui-body-" + G,
                H, K;
            A("label[for='" + J.attr("id") + "']").addClass("ui-input-text");
            H = J.addClass("ui-input-text ui-body-" + G);
            if (typeof J[0].autocorrect !== "undefined" && !A.support.touchOverflow) {
                J[0].setAttribute("autocorrect", "off");
                J[0].setAttribute("autocomplete", "off")
            }
            if (J.is("[type='search'],:jqmData(type='search')")) {
                H = J.wrap("<div class='ui-input-search ui-shadow-inset ui-btn-corner-all ui-btn-shadow ui-icon-searchfield" + M + "'></div>").parent();
                K = A("<a href='#' class='ui-input-clear' title='clear text'>clear text</a>").tap(function(N) {
                    J.val("").focus();
                    J.trigger("change");
                    K.addClass("ui-input-clear-hidden");
                    N.preventDefault()
                }).appendTo(H).buttonMarkup({
                    icon: "delete",
                    iconpos: "notext",
                    corners: true,
                    shadow: true
                });

                function D() {
                    setTimeout(function() {
                        K.toggleClass("ui-input-clear-hidden", !J.val())
                    }, 0)
                }
                D();
                J.bind("paste cut keyup focus change blur", D)
            } else {
                J.addClass("ui-corner-all ui-shadow-inset" + M)
            }
            J.focus(function() {
                H.addClass("ui-focus")
            }).blur(function() {
                H.removeClass("ui-focus")
            });
            if (J.is("textarea")) {
                var F = 15,
                    I = 100,
                    C = function() {
                        var O = J[0].scrollHeight,
                            N = J[0].clientHeight;
                        if (N < O) {
                            J.height(O + F)
                        }
                    },
                    L;
                J.keyup(function() {
                    clearTimeout(L);
                    L = setTimeout(C, I)
                });
                if (A.trim(J.val())) {
                    A(window).load(C);
                    A(document).one("pagechange", C)
                }
            }
        },
        disable: function() {
            (this.element.attr("disabled", true).is("[type='search'],:jqmData(type='search')") ? this.element.parent() : this.element).addClass("ui-disabled")
        },
        enable: function() {
					  // not modded (this.element.attr("disabled", false).is("[type='search'],:jqmData(type='search')") ? this.element.parent() : this.element).removeClass("ui-disabled")
            (this.element.attr("disabled", false).is("[type='search'],:jqmData(type='search')") ? this.element.parent() : this.element).removeClass("ui-disabled")
        }
    });
    A(document).bind("pagecreate create", function(C) {
        A.mobile.textinput.prototype.enhanceWithin(C.target)
    })
})(jQuery);
(function(B, C) {
    var A = function(J) {
        var P = J.select,
            T = J.selectID,
            M = J.label,
            D = J.select.closest(".ui-page"),
            F = B("<div>", {
                "class": "ui-selectmenu-screen ui-screen-hidden"
            }).appendTo(D),
            R = J._selectOptions(),
            I = J.isMultiple = J.select[0].multiple,
            L = T + "-button",
            N = T + "-menu",
            O = B("<div data-" + B.mobile.ns + "role='dialog' data-" + B.mobile.ns + "theme='" + J.options.theme + "' data-" + B.mobile.ns + "overlay-theme='" + J.options.overlayTheme + "'><div data-" + B.mobile.ns + "role='header'><div class='ui-title'>" + M.getEncodedText() + "</div></div><div data-" + B.mobile.ns + "role='content'></div></div>").appendTo(B.mobile.pageContainer).page(),
            E = B("<div>", {
                "class": "ui-selectmenu ui-selectmenu-hidden ui-overlay-shadow ui-corner-all ui-body-" + J.options.overlayTheme + " " + B.mobile.defaultDialogTransition
            }).insertAfter(F),
            U = B("<ul>", {
                "class": "ui-selectmenu-list",
                id: N,
                role: "listbox",
                "aria-labelledby": L
            }).attr("data-" + B.mobile.ns + "theme", J.options.theme).appendTo(E),
            S = B("<div>", {
                "class": "ui-header ui-bar-" + J.options.theme
            }).prependTo(E),
            Q = B("<h1>", {
                "class": "ui-title"
            }).appendTo(S),
            K = B("<a>", {
                text: J.options.closeText,
                href: "#",
                "class": "ui-btn-left"
            }).attr("data-" + B.mobile.ns + "iconpos", "notext").attr("data-" + B.mobile.ns + "icon", "delete").appendTo(S).buttonMarkup(),
            H = O.find(".ui-content"),
            G = O.find(".ui-header a");
        B.extend(J, {
            select: J.select,
            selectID: T,
            buttonId: L,
            menuId: N,
            thisPage: D,
            menuPage: O,
            label: M,
            screen: F,
            selectOptions: R,
            isMultiple: I,
            theme: J.options.theme,
            listbox: E,
            list: U,
            header: S,
            headerTitle: Q,
            headerClose: K,
            menuPageContent: H,
            menuPageClose: G,
            placeholder: "",
            build: function() {
                var V = this;
                V.refresh();
                V.select.attr("tabindex", "-1").focus(function() {
                    B(this).blur();
                    V.button.focus()
                });
                V.button.bind("vclick keydown", function(W) {
                    if (W.type == "vclick" || W.keyCode && (W.keyCode === B.mobile.keyCode.ENTER || W.keyCode === B.mobile.keyCode.SPACE)) {
                        V.open();
                        W.preventDefault()
                    }
                });
                V.list.attr("role", "listbox").delegate(".ui-li>a", "focusin", function() {
                    B(this).attr("tabindex", "0")
                }).delegate(".ui-li>a", "focusout", function() {
                    B(this).attr("tabindex", "-1")
                }).delegate("li:not(.ui-disabled, .ui-li-divider)", "click", function(Y) {
                    var Z = V.select[0].selectedIndex,
                        W = V.list.find("li:not(.ui-li-divider)").index(this),
                        X = V._selectOptions().eq(W)[0];
                    X.selected = V.isMultiple ? !X.selected : true;
                    if (V.isMultiple) {
                        B(this).find(".ui-icon").toggleClass("ui-icon-checkbox-on", X.selected).toggleClass("ui-icon-checkbox-off", !X.selected)
                    }
                    if (V.isMultiple || Z !== W) {
                        V.select.trigger("change")
                    }
                    if (!V.isMultiple) {
                        V.close()
                    }
                    Y.preventDefault()
                }).keydown(function(Z) {
                    var a = B(Z.target),
                        W = a.closest("li"),
                        Y, X;
                    switch (Z.keyCode) {
                        case 38:
                            Y = W.prev();
                            if (Y.length) {
                                a.blur().attr("tabindex", "-1");
                                Y.find("a").first().focus()
                            }
                            return false;
                            break;
                        case 40:
                            X = W.next();
                            if (X.length) {
                                a.blur().attr("tabindex", "-1");
                                X.find("a").first().focus()
                            }
                            return false;
                            break;
                        case 13:
                        case 32:
                            a.trigger("click");
                            return false;
                            break
                    }
                });
                V.menuPage.bind("pagehide", function() {
                    V.list.appendTo(V.listbox);
                    V._focusButton();
                    B.mobile._bindPageRemove.call(V.thisPage)
                });
                V.screen.bind("vclick", function(W) {
                    V.close()
                });
                V.headerClose.click(function() {
                    if (V.menuType == "overlay") {
                        V.close();
                        return false
                    }
                });
                V.thisPage.addDependents(this.menuPage)
            },
            _isRebuildRequired: function() {
                var W = this.list.find("li"),
                    V = this._selectOptions();
                return V.text() !== W.text()
            },
            refresh: function(Z, c) {
                var W = this,
                    V = this.element,
                    a = this.isMultiple,
                    X = this._selectOptions(),
                    Y = this.selected(),
                    b = this.selectedIndices();
                if (Z || this._isRebuildRequired()) {
                    W._buildList()
                }
                W.setButtonText();
                W.setButtonCount();
                W.list.find("li:not(.ui-li-divider)").removeClass(B.mobile.activeBtnClass).attr("aria-selected", false).each(function(d) {
                    if (B.inArray(d, b) > -1) {
                        var e = B(this);
                        e.attr("aria-selected", true);
                        if (W.isMultiple) {
                            e.find(".ui-icon").removeClass("ui-icon-checkbox-off").addClass("ui-icon-checkbox-on")
                        } else {
                            e.addClass(B.mobile.activeBtnClass)
                        }
                    }
                })
            },
            close: function() {
                if (this.options.disabled || !this.isOpen) {
                    return
                }
                var V = this;
                if (V.menuType == "page") {
                    window.history.back()
                } else {
                    V.screen.addClass("ui-screen-hidden");
                    V.listbox.addClass("ui-selectmenu-hidden").removeAttr("style").removeClass("in");
                    V.list.appendTo(V.listbox);
                    V._focusButton()
                }
                V.isOpen = false
            },
            open: function() {
                if (this.options.disabled) {
                    return
                }
                var h = this,
                    Y = h.list.parent().outerHeight(),
                    d = h.list.parent().outerWidth(),
                    W = B(".ui-page-active"),
                    X = B.support.touchOverflow && B.mobile.touchOverflowEnabled,
                    e = W.is(".ui-native-fixed") ? W.find(".ui-content") : W;
                scrollTop = X ? e.scrollTop() : B(window).scrollTop(), btnOffset = h.button.offset().top, screenHeight = window.innerHeight, screenWidth = window.innerWidth;
                h.button.addClass(B.mobile.activeBtnClass);
                setTimeout(function() {
                    h.button.removeClass(B.mobile.activeBtnClass)
                }, 300);

                function Z() {
                    h.list.find(B.mobile.activeBtnClass).focus()
                }
                if (Y > screenHeight - 80 || !B.support.scrollTop) {
                    h.thisPage.unbind("pagehide.remove");
                    if (scrollTop == 0 && btnOffset > screenHeight) {
                        h.thisPage.one("pagehide", function() {
                            B(this).jqmData("lastScroll", btnOffset)
                        })
                    }
                    h.menuPage.one("pageshow", function() {
                        B(window).one("silentscroll", function() {
                            Z()
                        });
                        h.isOpen = true
                    });
                    h.menuType = "page";
                    h.menuPageContent.append(h.list);
                    h.menuPage.find("div .ui-title").text(h.label.text());
                    B.mobile.changePage(h.menuPage, {
                        transition: B.mobile.defaultDialogTransition
                    })
                } else {
                    h.menuType = "overlay";
                    h.screen.height(B(document).height()).removeClass("ui-screen-hidden");
                    var c = btnOffset - scrollTop,
                        a = scrollTop + screenHeight - btnOffset,
                        g = Y / 2,
                        V = parseFloat(h.list.parent().css("max-width")),
                        f, b;
                    if (c > Y / 2 && a > Y / 2) {
                        f = btnOffset + (h.button.outerHeight() / 2) - g
                    } else {
                        f = c > a ? scrollTop + screenHeight - Y - 30 : scrollTop + 30
                    }
                    if (d < V) {
                        b = (screenWidth - d) / 2
                    } else {
                        b = h.button.offset().left + h.button.outerWidth() / 2 - d / 2;
                        if (b < 30) {
                            b = 30
                        } else {
                            if ((b + d) > screenWidth) {
                                b = screenWidth - d - 30
                            }
                        }
                    }
                    h.listbox.append(h.list).removeClass("ui-selectmenu-hidden").css({
                        top: f,
                        left: b
                    }).addClass("in");
                    Z();
                    h.isOpen = true
                }
            },
            _buildList: function() {
                var X = this,
                    a = this.options,
                    Z = this.placeholder,
                    V = [],
                    Y = [],
                    W = X.isMultiple ? "checkbox-off" : "false";
                X.list.empty().filter(".ui-listview").listview("destroy");
                X.select.find("option").each(function(e) {
                    var h = B(this),
                        g = h.parent(),
                        j = h.getEncodedText(),
                        b = "<a href='#'>" + j + "</a>",
                        d = [],
                        f = [];
                    if (g.is("optgroup")) {
                        var c = g.attr("label");
                        if (B.inArray(c, V) === -1) {
                            Y.push("<li data-" + B.mobile.ns + "role='list-divider'>" + c + "</li>");
                            V.push(c)
                        }
                    }
                    if (!this.getAttribute("value") || j.length == 0 || h.jqmData("placeholder")) {
                        if (a.hidePlaceholderMenuItems) {
                            d.push("ui-selectmenu-placeholder")
                        }
                        Z = X.placeholder = j
                    }
                    if (this.disabled) {
                        d.push("ui-disabled");
                        f.push("aria-disabled='true'")
                    }
                    Y.push("<li data-" + B.mobile.ns + "option-index='" + e + "' data-" + B.mobile.ns + "icon='" + W + "' class='" + d.join(" ") + "' " + f.join(" ") + ">" + b + "</li>")
                });
                X.list.html(Y.join(" "));
                X.list.find("li").attr({
                    role: "option",
                    tabindex: "-1"
                }).first().attr("tabindex", "0");
                if (!this.isMultiple) {
                    this.headerClose.hide()
                }
                if (!this.isMultiple && !Z.length) {
                    this.header.hide()
                } else {
                    this.headerTitle.text(this.placeholder)
                }
                X.list.listview()
            },
            _button: function() {
                return B("<a>", {
                    href: "#",
                    role: "button",
                    id: this.buttonId,
                    "aria-haspopup": "true",
                    "aria-owns": this.menuId
                })
            }
        })
    };
    B("select").live("selectmenubeforecreate", function() {
        var D = B(this).data("selectmenu");
        if (!D.options.nativeMenu) {
            A(D)
        }
    })
})(jQuery);
(function(A, B) {
    A.widget("mobile.selectmenu", A.mobile.widget, {
        options: {
            theme: null,
            disabled: false,
            icon: "arrow-d",
            iconpos: "right",
            inline: null,
            corners: true,
            shadow: true,
            iconshadow: true,
            menuPageTheme: "b",
            overlayTheme: "a",
            hidePlaceholderMenuItems: true,
            closeText: "Close",
            nativeMenu: true,
            initSelector: "select:not(:jqmData(role='slider'))"
        },
        _button: function() {
            return A("<div/>")
        },
        _setDisabled: function(C) {
            this.element.attr("disabled", C);
            this.button.attr("aria-disabled", C);
            return this._setOption("disabled", C)
        },
        _focusButton: function() {
            var C = this;
            setTimeout(function() {
                C.button.focus()
            }, 40)
        },
        _selectOptions: function() {
            return this.select.find("option")
        },
        _preExtension: function() {
            this.select = this.element.wrap("<div class='ui-select'>");
            this.selectID = this.select.attr("id");
            this.label = A("label[for='" + this.selectID + "']").addClass("ui-select");
            this.isMultiple = this.select[0].multiple;
            if (!this.options.theme) {
                this.options.theme = A.mobile.getInheritedTheme(this.select, "c")
            }
        },
        _create: function() {
            this._preExtension();
            this._trigger("beforeCreate");
            this.button = this._button();
            var D = this,
                E = this.options,
                C = this.select[0].selectedIndex == -1 ? 0 : this.select[0].selectedIndex,
                F = this.button.text(A(this.select[0].options.item(C)).text()).insertBefore(this.select).buttonMarkup({
                    theme: E.theme,
                    icon: E.icon,
                    iconpos: E.iconpos,
                    inline: E.inline,
                    corners: E.corners,
                    shadow: E.shadow,
                    iconshadow: E.iconshadow
                });
            if (E.nativeMenu && window.opera && window.opera.version) {
                this.select.addClass("ui-select-nativeonly")
            }
            if (this.isMultiple) {
                this.buttonCount = A("<span>").addClass("ui-li-count ui-btn-up-c ui-btn-corner-all").hide().appendTo(F.addClass("ui-li-has-count"))
            }
            if (E.disabled || this.element.attr("disabled")) {
                this.disable()
            }
            this.select.change(function() {
                D.refresh()
            });
            this.build()
        },
        build: function() {
            var C = this;
            this.select.appendTo(C.button).bind("vmousedown", function() {
                C.button.addClass(A.mobile.activeBtnClass)
            }).bind("focus vmouseover", function() {
                C.button.trigger("vmouseover")
            }).bind("vmousemove", function() {
                C.button.removeClass(A.mobile.activeBtnClass)
            }).bind("change blur vmouseout", function() {
                C.button.trigger("vmouseout").removeClass(A.mobile.activeBtnClass)
            }).bind("change blur", function() {
                C.button.removeClass("ui-btn-down-" + C.options.theme)
            })
        },
        selected: function() {
            return this._selectOptions().filter(":selected")
        },
        selectedIndices: function() {
            var C = this;
            return this.selected().map(function() {
                return C._selectOptions().index(this)
            }).get()
        },
        setButtonText: function() {
            var C = this,
                D = this.selected();
            this.button.find(".ui-btn-text").text(function() {
                if (!C.isMultiple) {
                    return D.text()
                }
                return D.length ? D.map(function() {
                    return A(this).text()
                }).get().join(", ") : C.placeholder
            })
        },
        setButtonCount: function() {
            var C = this.selected();
            if (this.isMultiple) {
                this.buttonCount[C.length > 1 ? "show" : "hide"]().text(C.length)
            }
        },
        refresh: function() {
            this.setButtonText();
            this.setButtonCount()
        },
        open: A.noop,
        close: A.noop,
        disable: function() {
            this._setDisabled(true);
            this.button.addClass("ui-disabled")
        },
        enable: function() {
            this._setDisabled(false);
            this.button.removeClass("ui-disabled")
        }
    });
    A(document).bind("pagecreate create", function(C) {
        A.mobile.selectmenu.prototype.enhanceWithin(C.target)
    })
})(jQuery);
(function(B, C) {
    B.fn.buttonMarkup = function(P) {
        P = P || {};
        for (var G = 0; G < this.length; G++) {
            var F = this.eq(G),
                I = F[0],
                E = B.extend({}, B.fn.buttonMarkup.defaults, {
                    icon: P.icon !== C ? P.icon : F.jqmData("icon"),
                    iconpos: P.iconpos !== C ? P.iconpos : F.jqmData("iconpos"),
                    theme: P.theme !== C ? P.theme : F.jqmData("theme"),
                    inline: P.inline !== C ? P.inline : F.jqmData("inline"),
                    shadow: P.shadow !== C ? P.shadow : F.jqmData("shadow"),
                    corners: P.corners !== C ? P.corners : F.jqmData("corners"),
                    iconshadow: P.iconshadow !== C ? P.iconshadow : F.jqmData("iconshadow")
                }, P),
                N = "ui-btn-inner",
                M = "ui-btn-text",
                O, K, H = document.createElement(E.wrapperEls),
                L = document.createElement(E.wrapperEls),
                J = E.icon ? document.createElement("span") : null;
            if (A) {
                A()
            }
            if (!E.theme) {
                E.theme = B.mobile.getInheritedTheme(F, "c")
            }
            O = "ui-btn ui-btn-up-" + E.theme;
            if (E.inline) {
                O += " ui-btn-inline"
            }
            if (E.icon) {
                E.icon = "ui-icon-" + E.icon;
                E.iconpos = E.iconpos || "left";
                K = "ui-icon " + E.icon;
                if (E.iconshadow) {
                    K += " ui-icon-shadow"
                }
            }
            if (E.iconpos) {
                O += " ui-btn-icon-" + E.iconpos;
                if (E.iconpos == "notext" && !F.attr("title")) {
                    F.attr("title", F.getEncodedText())
                }
            }
            if (E.corners) {
                O += " ui-btn-corner-all";
                N += " ui-btn-corner-all"
            }
            if (E.shadow) {
                O += " ui-shadow"
            }
            I.setAttribute("data-" + B.mobile.ns + "theme", E.theme);
            F.addClass(O);
            H.className = N;
            H.setAttribute("aria-hidden", "true");
            L.className = M;
            H.appendChild(L);
            if (J) {
                J.className = K;
                H.appendChild(J)
            }
            while (I.firstChild) {
                L.appendChild(I.firstChild)
            }
            I.appendChild(H);
            B.data(I, "textWrapper", B(L))
        }
        return this
    };
    B.fn.buttonMarkup.defaults = {
        corners: true,
        shadow: true,
        iconshadow: true,
        inline: false,
        wrapperEls: "span"
    };

    function D(F) {
        var E;
        while (F) {
            E = (typeof F.className === "string") && F.className.split(" ");
            if (E && B.inArray("ui-btn", E) > -1 && B.inArray("ui-disabled", E) < 0) {
                break
            }
            F = F.parentNode
        }
        return F
    }
    var A = function() {
        B(document).bind({
            vmousedown: function(G) {
                var E = D(G.target),
                    F, H;
                if (E) {
                    F = B(E);
                    H = F.attr("data-" + B.mobile.ns + "theme");
                    F.removeClass("ui-btn-up-" + H).addClass("ui-btn-down-" + H)
                }
            },
            "vmousecancel vmouseup": function(G) {
                var E = D(G.target),
                    F, H;
                if (E) {
                    F = B(E);
                    H = F.attr("data-" + B.mobile.ns + "theme");
                    F.removeClass("ui-btn-down-" + H).addClass("ui-btn-up-" + H)
                }
            },
            "vmouseover focus": function(G) {
                var E = D(G.target),
                    F, H;
                if (E) {
                    F = B(E);
                    H = F.attr("data-" + B.mobile.ns + "theme");
                    F.removeClass("ui-btn-up-" + H).addClass("ui-btn-hover-" + H)
                }
            },
            "vmouseout blur": function(G) {
                var E = D(G.target),
                    F, H;
                if (E) {
                    F = B(E);
                    H = F.attr("data-" + B.mobile.ns + "theme");
                    F.removeClass("ui-btn-hover-" + H + " ui-btn-down-" + H).addClass("ui-btn-up-" + H)
                }
            }
        });
        A = null
    };
    B(document).bind("pagecreate create", function(E) {
        B(":jqmData(role='button'), .ui-bar > a, .ui-header > a, .ui-footer > a, .ui-bar > :jqmData(role='controlgroup') > a", E.target).not(".ui-btn, :jqmData(role='none'), :jqmData(role='nojs')").buttonMarkup()
    })
})(jQuery);
(function(A, B) {
    A.fn.controlgroup = function(C) {
        return this.each(function() {
            var E = A(this),
                H = A.extend({
                    direction: E.jqmData("type") || "vertical",
                    shadow: false,
                    excludeInvisible: true
                }, C),
                I = E.children("legend"),
                D = H.direction == "horizontal" ? ["ui-corner-left", "ui-corner-right"] : ["ui-corner-top", "ui-corner-bottom"],
                F = E.find("input").first().attr("type");
            if (I.length) {
                E.wrapInner("<div class='ui-controlgroup-controls'></div>");
                A("<div role='heading' class='ui-controlgroup-label'>" + I.html() + "</div>").insertBefore(E.children(0));
                I.remove()
            }
            E.addClass("ui-corner-all ui-controlgroup ui-controlgroup-" + H.direction);

            function G(J) {
                J.removeClass("ui-btn-corner-all ui-shadow").eq(0).addClass(D[0]).end().last().addClass(D[1]).addClass("ui-controlgroup-last")
            }
            G(E.find(".ui-btn" + (H.excludeInvisible ? ":visible" : "")));
            G(E.find(".ui-btn-inner"));
            if (H.shadow) {
                E.addClass("ui-shadow")
            }
        })
    };
    A(document).bind("pagecreate create", function(C) {
        A(":jqmData(role='controlgroup')", C.target).controlgroup({
            excludeInvisible: false
        })
    })
})(jQuery);
(function(A, B) {
    A(document).bind("pagecreate create", function(C) {
        A(C.target).find("a").not(".ui-btn, .ui-link-inherit, :jqmData(role='none'), :jqmData(role='nojs')").addClass("ui-link")
    })
})(jQuery);
(function(D, E) {
    var A = "ui-header-fixed ui-fixed-inline fade",
        F = "ui-footer-fixed ui-fixed-inline fade",
        C = ".ui-header:jqmData(position='fixed')",
        B = ".ui-footer:jqmData(position='fixed')";
    D.fn.fixHeaderFooter = function(G) {
        if (!D.support.scrollTop || (D.support.touchOverflow && D.mobile.touchOverflowEnabled)) {
            return this
        }
        return this.each(function() {
            var H = D(this);
            if (H.jqmData("fullscreen")) {
                H.addClass("ui-page-fullscreen")
            }
            H.find(C).addClass(A);
            H.find(B).addClass(F)
        })
    };
    D.mobile.fixedToolbars = (function() {
        if (!D.support.scrollTop || (D.support.touchOverflow && D.mobile.touchOverflowEnabled)) {
            return
        }
        var Q, H, K = "inline",
            S = false,
            I = 100,
            R = "a,input,textarea,select,button,label,.ui-header-fixed,.ui-footer-fixed",
            T = ".ui-header-fixed:first, .ui-footer-fixed:not(.ui-footer-duplicate):last",
            M = D.support.touch,
            U = M ? "touchstart" : "mousedown",
            O = M ? "touchend" : "mouseup",
            L = null,
            N = false,
            G = true;

        function J(W) {
            if (!S && K === "overlay") {
                if (!H) {
                    D.mobile.fixedToolbars.hide(true)
                }
                D.mobile.fixedToolbars.startShowTimer()
            }
        }
        D(function() {
            var X = D(document),
                W = D(window);
            X.bind("vmousedown", function(Y) {
                if (G) {
                    L = K
                }
            }).bind("vclick", function(Y) {
                if (G) {
                    if (D(Y.target).closest(R).length) {
                        return
                    }
                    if (!N) {
                        D.mobile.fixedToolbars.toggle(L);
                        L = null
                    }
                }
            }).bind("silentscroll", J);
            ((X.scrollTop() === 0) ? W : X).bind("scrollstart", function(Z) {
                N = true;
                if (L === null) {
                    L = K
                }
                var Y = L == "overlay";
                S = Y || !!H;
                if (S) {
                    D.mobile.fixedToolbars.clearShowTimer();
                    if (Y) {
                        D.mobile.fixedToolbars.hide(true)
                    }
                }
            }).bind("scrollstop", function(Y) {
                if (D(Y.target).closest(R).length) {
                    return
                }
                N = false;
                if (S) {
                    D.mobile.fixedToolbars.startShowTimer();
                    S = false
                }
                L = null
            });
            W.bind("resize updatelayout", J)
        });
        D(".ui-page").live("pagebeforeshow", function(X, a) {
            var Z = D(X.target),
                d = Z.find(":jqmData(role='footer')"),
                c = d.data("id"),
                W = a.prevPage,
                b = W && W.find(":jqmData(role='footer')"),
                Y = b.length && b.jqmData("id") === c;
            if (c && Y) {
                Q = d;
                V(Q.removeClass("fade in out").appendTo(D.mobile.pageContainer))
            }
        }).live("pageshow", function(W, X) {
            var Y = D(this);
            if (Q && Q.length) {
                setTimeout(function() {
                    V(Q.appendTo(Y).addClass("fade"));
                    Q = null
                }, 500)
            }
            D.mobile.fixedToolbars.show(true, this)
        });
        D(".ui-collapsible-contain").live("collapse expand", J);

        function P(X) {
            var Y = 0,
                Z, W;
            if (X) {
                W = document.body;
                Z = X.offsetParent;
                Y = X.offsetTop;
                while (X && X != W) {
                    Y += X.scrollTop || 0;
                    if (X == Z) {
                        Y += Z.offsetTop;
                        Z = X.offsetParent
                    }
                    X = X.parentNode
                }
            }
            return Y
        }

        function V(a) {
            var W = D(window).scrollTop(),
                b = P(a[0]),
                Z = a.css("top") == "auto" ? 0 : parseFloat(a.css("top")),
                d = window.innerHeight,
                c = a.outerHeight(),
                Y = a.parents(".ui-page:not(.ui-page-fullscreen)").length,
                X;
            if (a.is(".ui-header-fixed")) {
                X = W - b + Z;
                if (X < b) {
                    X = 0
                }
                return a.css("top", Y ? X : W)
            } else {
                X = W + d - c - (b - Z);
                return a.css("top", Y ? X : W + d - c)
            }
        }
        return {
            show: function(W, Y) {
                D.mobile.fixedToolbars.clearShowTimer();
                K = "overlay";
                var X = Y ? D(Y) : (D.mobile.activePage ? D.mobile.activePage : D(".ui-page-active"));
                return X.children(T).each(function() {
                    var b = D(this),
                        Z = D(window).scrollTop(),
                        c = P(b[0]),
                        e = window.innerHeight,
                        d = b.outerHeight(),
                        a = (b.is(".ui-header-fixed") && Z <= c + d) || (b.is(".ui-footer-fixed") && c <= Z + e);
                    b.addClass("ui-fixed-overlay").removeClass("ui-fixed-inline");
                    if (!a && !W) {
                        b.animationComplete(function() {
                            b.removeClass("in")
                        }).addClass("in")
                    }
                    V(b)
                })
            },
            hide: function(W) {
                K = "inline";
                var X = D.mobile.activePage ? D.mobile.activePage : D(".ui-page-active");
                return X.children(T).each(function() {
                    var a = D(this),
                        Z = a.css("top"),
                        Y;
                    Z = Z == "auto" ? 0 : parseFloat(Z);
                    a.addClass("ui-fixed-inline").removeClass("ui-fixed-overlay");
                    if (Z < 0 || (a.is(".ui-header-fixed") && Z !== 0)) {
                        if (W) {
                            a.css("top", 0)
                        } else {
                            if (a.css("top") !== "auto" && parseFloat(a.css("top")) !== 0) {
                                Y = "out reverse";
                                a.animationComplete(function() {
                                    a.removeClass(Y).css("top", 0)
                                }).addClass(Y)
                            }
                        }
                    }
                })
            },
            startShowTimer: function() {
                D.mobile.fixedToolbars.clearShowTimer();
                var W = [].slice.call(arguments);
                H = setTimeout(function() {
                    H = E;
                    D.mobile.fixedToolbars.show.apply(null, W)
                }, I)
            },
            clearShowTimer: function() {
                if (H) {
                    clearTimeout(H)
                }
                H = E
            },
            toggle: function(W) {
                if (W) {
                    K = W
                }
                return (K === "overlay") ? D.mobile.fixedToolbars.hide() : D.mobile.fixedToolbars.show()
            },
            setTouchToggleEnabled: function(W) {
                G = W
            }
        }
    })();
    D(document).bind("pagecreate create", function(G) {
        if (D(":jqmData(position='fixed')", G.target).length) {
            D(G.target).each(function() {
                if (!D.support.scrollTop || (D.support.touchOverflow && D.mobile.touchOverflowEnabled)) {
                    return this
                }
                var H = D(this);
                if (H.jqmData("fullscreen")) {
                    H.addClass("ui-page-fullscreen")
                }
                H.find(C).addClass(A);
                H.find(B).addClass(F)
            })
        }
    })
})(jQuery);
(function(A, B) {
    A.mobile.touchOverflowEnabled = false;
    A.mobile.touchOverflowZoomEnabled = false;
    A(document).bind("pagecreate", function(E) {
        if (A.support.touchOverflow && A.mobile.touchOverflowEnabled) {
            var C = A(E.target),
                D = 0;
            if (C.is(":jqmData(role='page')")) {
                C.each(function() {
                    var F = A(this),
                        I = F.find(":jqmData(role='header'), :jqmData(role='footer')").filter(":jqmData(position='fixed')"),
                        H = F.jqmData("fullscreen"),
                        G = I.length ? F.find(".ui-content") : F;
                    F.addClass("ui-mobile-touch-overflow");
                    G.bind("scrollstop", function() {
                        if (G.scrollTop() > 0) {
                            window.scrollTo(0, A.mobile.defaultHomeScroll)
                        }
                    });
                    if (I.length) {
                        F.addClass("ui-native-fixed");
                        if (H) {
                            F.addClass("ui-native-fullscreen");
                            I.addClass("fade in");
                            A(document).bind("vclick", function() {
                                I.removeClass("ui-native-bars-hidden").toggleClass("in out").animationComplete(function() {
                                    A(this).not(".in").addClass("ui-native-bars-hidden")
                                })
                            })
                        }
                    }
                })
            }
        }
    })
})(jQuery);
(function(F, E, H) {
    var B = F("html"),
        A = F("head"),
        G = F(E);
    F(E.document).trigger("mobileinit");
    if (!F.mobile.gradeA()) {
        return
    }
    if (F.mobile.ajaxBlacklist) {
        F.mobile.ajaxEnabled = false
    }
    B.addClass("ui-mobile ui-mobile-rendering");
    var C = F("<div class='ui-loader ui-body-a ui-corner-all'><span class='ui-icon ui-icon-loading spin'></span><h1></h1></div>");
    F.extend(F.mobile, {
        showPageLoadingMsg: function() {
            if (F.mobile.loadingMessage) {
                var I = F("." + F.mobile.activeBtnClass).first();
                C.find("h1").text(F.mobile.loadingMessage).end().appendTo(F.mobile.pageContainer).css({
                    top: F.support.scrollTop && G.scrollTop() + G.height() / 2 || I.length && I.offset().top || 100
                })
            }
            B.addClass("ui-loading")
        },
        hidePageLoadingMsg: function() {
            B.removeClass("ui-loading")
        },
        initializePage: function() {
            var I = F(":jqmData(role='page')");
            if (!I.length) {
                I = F("body").wrapInner("<div data-" + F.mobile.ns + "role='page'></div>").children(0)
            }
            I.add(":jqmData(role='dialog')").each(function() {
                var J = F(this);
                if (!J.jqmData("url")) {
                    J.attr("data-" + F.mobile.ns + "url", J.attr("id") || location.pathname + location.search)
                }
            });
            F.mobile.firstPage = I.first();
            F.mobile.pageContainer = I.first().parent().addClass("ui-mobile-viewport");
            G.trigger("pagecontainercreate");
            F.mobile.showPageLoadingMsg();
            if (!F.mobile.hashListeningEnabled || !F.mobile.path.stripHash(location.hash)) {
                F.mobile.changePage(F.mobile.firstPage, {
                    transition: "none",
                    reverse: true,
                    changeHash: false,
                    fromHashChange: true
                })
            } else {
                G.trigger("hashchange", [true])
            }
        }
    });

    function D() {
        var I = "user-scalable=no",
            J = F("meta[name='viewport']");
        if (J.length) {
            J.attr("content", J.attr("content") + ", " + I)
        } else {
            F("head").prepend("<meta>", {
                name: "viewport",
                content: I
            })
        }
    }
    if (F.support.touchOverflow && F.mobile.touchOverflowEnabled && !F.mobile.touchOverflowZoomEnabled) {
        D()
    }
    F.mobile._registerInternalEvents();
    F(function() {
        E.scrollTo(0, 1);
        F.mobile.defaultHomeScroll = (!F.support.scrollTop || F(E).scrollTop() === 1) ? 0 : 1;
        if (F.mobile.autoInitializePage) {
            F.mobile.initializePage()
        }
    })
})(jQuery, this);
