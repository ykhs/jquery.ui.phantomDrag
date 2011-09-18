/*!
* jquery.ui.phantomDrag.js
* @author ykhs <ykhs.jp@gmail.com>
*
* Copyright ykhs <ykhs.jp@gmail.com>
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/

/**
* @see http://jquery.com/
* @name jQuery
* @class jQuery Library (http://jquery.com/)
*/

/**
* @see http://jqueryui.com/
* @name ui
* @class jQuery UI Widget (http://jqueryui.com/)
* @memberOf jQuery
*/

/**
* @class 慣性ドラッグ機能を提供します
* @name phantomDrag
* @param {object} options 設定オブジェクト
*/
(function ($, window, document, undefined) {

    $.widget('ui.phantomDrag', {

        options: {
            xmax: 65536,
            xmin: -65536,
            ymax: 65536,
            ymin: -65536,
            delay: 13,
            customEasing: null,
            stopSpeedBorder: 0.1
        },

        EVENT_DRAG_START: 'phantomdrag-start',
        EVENT_DRAG_RELEASE: 'phantomdrag-release',
        EVENT_DRAG_MOVE: 'phantomdrag-move',
        EVENT_DRAG_STOP: 'phantomdrag-stop',

        mx: 0,
        mfx: 0,
        my: 0,
        mfy: 0,
        timer: 0,

        _init: function () {
            this.element
            .bind({
                'mousedown': $.proxy(this._start, this)
            })
            .data('phantomdragX', 0)
            .data('phantomdragFx', 0)
            .data('phantomdragDx', 0)
            .data('phantomdragSx', 0)
            .data('phantomdragY', 0)
            .data('phantomdragFy', 0)
            .data('phantomdragDy', 0)
            .data('phantomdragSy', 0);
        },

        _startTimer: function () {
            this.timer = interval($.proxy(this._onEnterFrame, this), 16);
        },

        _stopTimer: function () {
            clearInterval(this.timer);
            this.timer = 0;
        },

        _start: function (e) {

            this._stopTimer();

            var x = this.element.data('phantomdragX'),
                y = this.element.data('phantomdragY');

            this.element
            .data('phantomdragOn', true)
            .data('phantomdragDx', x)
            .data('phantomdragFx', x)
            .data('phantomdragDy', y)
            .data('phantomdragFy', y);

            this.mfx = Math.round(e.pageX);
            this.mfy = Math.round(e.pageY);

            this.element.trigger(this.EVENT_DRAG_START);

            $(document).bind({
                'mousemove': $.proxy(this._move, this),
                'mouseup': $.proxy(this._end, this)
            });

            this._startTimer();

            return false;
        },

        _move: function (e) {

            var o = this.options,
                $el = this.element;

            if (!$el.data('phantomdragMove')) {
                $el.data('phantomdragMove', true);
            }

            this.mx = Math.round(e.pageX);
            this.my = Math.round(e.pageY);

            $el
            .data('phantomdragDx', Math.max(o.xmin, Math.min($el.data('phantomdragFx') + this.mx - this.mfx, o.xmax)))
            .data('phantomdragDy', Math.max(o.ymin, Math.min($el.data('phantomdragFy') + this.my - this.mfy, o.ymax)));

            return false;
        },

        _end: function (e) {

            this.element
            .data('phantomdragOn', false)
            .trigger(this.EVENT_DRAG_RELEASE);

            $(document)
            .unbind({
                'mousemove': this._move,
                'mouseup': this._end
            });
        },

        _onEnterFrame: function (e) {

            var $el = this.element,
                o = this.options,
                fx = $el.data('phantomdragFx'),
                sx = $el.data('phantomdragSx'),
                dx = $el.data('phantomdragDx'),
                x = $el.data('phantomdragX'),
                fy = $el.data('phantomdragFy'),
                sy = $el.data('phantomdragSy'),
                dy = $el.data('phantomdragDy'),
                y = $el.data('phantomdragY'),
                stop = null,
                border = o.stopSpeedBorder;

            sx = o.customEasing ? o.customEasing(x, dx, sx, fx) : (dx - x) / o.delay;
            sy = o.customEasing ? o.customEasing(y, dy, sy, fy) : (dy - y) / o.delay;

            x += sx;
            y += sy;

            stop = Math.abs(sx) < border && Math.abs(sy) < border;

            if (stop) {
                sx = 0;
                sy = 0;
                x = dx;
                y = dy;
            }

            $el
            .data('phantomdragX', x)
            .data('phantomdragSx', sx)
            .data('phantomdragDx', dx)
            .data('phantomdragY', y)
            .data('phantomdragSy', sy)
            .data('phantomdragDy', dy);

            this.element.trigger(this.EVENT_DRAG_MOVE);

            if (stop) {
                this._stop();
            }
        },

        _stop: function () {

            if (!this.element.data('phantomdragOn')) {

                this._stopTimer();

                this.element.trigger(this.EVENT_DRAG_STOP);

                this.element.data('phantomdragMove', false);
            }
            return false;
        }

    });
})(jQuery, this, this.document);
