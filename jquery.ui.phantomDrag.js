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
* @class
* @name phantomDrag
* @param {object} options 設定オブジェクト
* @config {number} xmax X座標の最大値
* @config {number} xmin X座標の最小値
* @config {number} ymax Y座標の最大値
* @config {number} ymin Y座標の最小値
* @config {number} delay ドラッグ追従の遅延具合。大きいほど遅く、0で遅延無し
* @memberOf jQuery.ui
* @description 要素をドラッグで移動したと仮定した値を jQuery.data に書き出します。<br>
* ドラッグ中の各イベントに bind して、その値を流用することで様々な動きを実現します。<br><br>
*
* [Custom Event]<br>
* phantomdrag-start: ドラッグ開始イベント<br>
* phantomdrag-move: ドラッグ中イベント（ドラッグ中に毎フレーム呼ばれます）<br>
* phantomdrag-release: ドラッグ解除イベント<br>
* phantomdrag-stop: ドラッグ移動停止イベント（ドラッグ解除後も続く慣性移動が停止した合図です）<br><br>
*
* [jQuery.data]<br>
* phantomdrag-x: 要素の現在のX座標<br>
* phantomdrag-fx: 要素のドラッグ開始X座標<br>
* phantomdrag-dx: 要素の移動先X座標<br>
* phantomdrag-sx: 要素の1フレーム間でのX方向移動量<br>
* phantomdrag-y: 要素の現在のY座標<br>
* phantomdrag-fy: 要素のドラッグ開始Y座標<br>
* phantomdrag-dy: 要素の移動先Y座標<br>
* phantomdrag-sy: 要素の1フレーム間でのY方向移動量<br>
*
* @example
* // 初期化
*
* $('#drag').phantomDrag({
*     xmax: 660,
*     xmin: 0,
*     ymax: 260,
*     ymin: 0
* });
*
* // Custom Event への bind
* // ドラッグ中の現在位置をCSSに反映する例です
*
* $('#drag').bind('phantomdrag-move', function (e) {
*
*     var $el = $(e.target);
*
*     $el.css({
*         top: $el.data('phantomdrag-y'),
*         left: $el.data('phantomdrag-x')
*     })
* });
*
*/
(function ($, window, document, Math, interval) {

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
            .data('phantomdrag-x', 0)
            .data('phantomdrag-fx', 0)
            .data('phantomdrag-dx', 0)
            .data('phantomdrag-sx', 0)
            .data('phantomdrag-y', 0)
            .data('phantomdrag-fy', 0)
            .data('phantomdrag-dy', 0)
            .data('phantomdrag-sy', 0);
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

            var x = this.element.data('phantomdrag-x'),
                y = this.element.data('phantomdrag-y');

            this.element
            .data('phantomdrag-on', true)
            .data('phantomdrag-dx', x)
            .data('phantomdrag-fx', x)
            .data('phantomdrag-dy', y)
            .data('phantomdrag-fy', y);

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

            if (!$el.data('phantomdrag-move')) {
                $el.data('phantomdrag-move', true);
            }

            this.mx = Math.round(e.pageX);
            this.my = Math.round(e.pageY);

            $el
            .data('phantomdrag-dx', Math.max(o.xmin, Math.min($el.data('phantomdrag-fx') + this.mx - this.mfx, o.xmax)))
            .data('phantomdrag-dy', Math.max(o.ymin, Math.min($el.data('phantomdrag-fy') + this.my - this.mfy, o.ymax)));

            return false;
        },

        _end: function (e) {

            this.element
            .data('phantomdrag-on', false)
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
                fx = $el.data('phantomdrag-fx'),
                sx = $el.data('phantomdrag-sx'),
                dx = $el.data('phantomdrag-dx'),
                x = $el.data('phantomdrag-x'),
                fy = $el.data('phantomdrag-fy'),
                sy = $el.data('phantomdrag-sy'),
                dy = $el.data('phantomdrag-dy'),
                y = $el.data('phantomdrag-y'),
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
            .data('phantomdrag-x', x)
            .data('phantomdrag-sx', sx)
            .data('phantomdrag-dx', dx)
            .data('phantomdrag-y', y)
            .data('phantomdrag-sy', sy)
            .data('phantomdrag-dy', dy);

            this.element.trigger(this.EVENT_DRAG_MOVE);

            if (stop) {
                this._stop();
            }
        },

        _stop: function () {

            if (!this.element.data('phantomdrag-on')) {

                this._stopTimer();

                this.element.trigger(this.EVENT_DRAG_STOP);

                this.element.data('phantomdrag-move', false);
            }
            return false;
        }

    });
})(jQuery, this, this.document, Math, setInterval);
