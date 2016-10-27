/**
 *
 *          _________                   .__  .__    _______________  ___
 *  ___.__./   _____/ ___________  ____ |  | |  |   \_   _____/\   \/  /
 * <   |  |\_____  \_/ ___\_  __ \/  _ \|  | |  |    |    __)   \     /
 *  \___  |/        \  \___|  | \(  <_> )  |_|  |__  |     \    /     \
 *  / ____/_______  /\___  >__|   \____/|____/____/  \___  /   /___/\  \
 *  \/            \/     \/                              \/          \_/
 *
 *
 * - yScrollFX -
 * Version: v1.0.1
 * Date: 27/10/2016
 * Git: https://github.com/trevonerd/yScrollFX
 * ---
 * Author: Marco Trevisani <marco.trevisani@yoox.com>
 * ---
 * Further changes, comments:
 * --- v1.0.1:
 * - code refactor!
 * --- v1.0.0:
 * - first release
 *
 *
  **** Description:
 * What does this plugin?
 * - It adds a css class when an element is in the viewport when user scrolls the page. Very usefull if you need some animated intro effect on the visible elements.
 *
 **** Available custom classes:
 * js-yscroll-{YOUR-CUSTOM-FX-NAME}          {any element} - when this element is in the viewport this plugin will add the class "animate" so you can use it to start a css3 animation.
 *
 **** Initialisation Options:
 * $(selector).yScrollFX({
 *    startAnimationClassName: "animate",                  - customize the animation class name (default: animate)
 *    startAnimationScrollPositionOffset: 100              - add an offset to start earlier or later the effect when element enter in the viewport (default: 100).
 * }
 *
 * If you need to refresh the elements to animate after (for example) an ajax call just reinitialise the plugin.
 */

(function ($) {
    "use strict";

    var pluginName = "yScrollFX",
        defaults = {
            onScroll: true,
            startAnimationClassName: "animate",
            startAnimationScrollPositionOffset: 100
        },
        settings,
        $elementsToProcess;

    function Plugin (element, options) {
        this.element = element;
        settings = $.extend({}, defaults, options);
        this.init();
    }

    var cacheElements = function () {
            $elementsToProcess = $("*[class*=js-yscroll]");
            $elementsToProcess.each(function () {
                var $this = $(this);

                var elemTop = $this.offset().top;
                var elemBottom = elemTop + $this.height();
                $this.data("elemTop", elemTop);
                $this.data("elemBottom", elemBottom);
            });
        },
        elementInViewport = function (elem) {
            var docViewTop = $(window).scrollTop();
            var docViewBottom = docViewTop + $(window).height() + settings.startAnimationScrollPositionOffset;

            var $elem = $(elem);
            var elemTop = $elem.data("elemTop");
            var elemBottom = $elem.data("elemBottom");

            return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        },
        addStartAnimationClass = function (elem) {
            $(elem).addClass(settings.startAnimationClassName);
        },
        processScroll = function () {
            $elementsToProcess
                .each(function () {
                    if (elementInViewport(this)) {
                        addStartAnimationClass(this);
                    }
                });
        },
        refresh = function () {
            cacheElements();
            processScroll();
        };

    Plugin.prototype = {
        init: function () {
            cacheElements();

            if (settings.onScroll) {
                if (window.addEventListener) {
                    window.addEventListener("scroll", processScroll, false);
                } else if (window.attachEvent) {
                    window.attachEvent("onscroll", processScroll);
                }
            }

            setTimeout(function () {
                    processScroll();
                },
                50);
        },
        refresh: function () {
            refresh();
        },
        addFxClass: function (el) {
            addStartAnimationClass(el);
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            var dataPlugin = $.data(this, "plugin_" + pluginName);
            if (!dataPlugin) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            } else {
                dataPlugin.refresh();
            }
        });
    };

}(jQuery, document));