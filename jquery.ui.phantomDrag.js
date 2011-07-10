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
* @config {number} xmax X座標の最大値
* @config {number} xmin X座標の最小値
* @config {number} ymax Y座標の最大値
* @config {number} ymin Y座標の最小値
* @config {number} delay ドラッグ追従の遅延具合。大きいほど遅く、0で遅延無し
* @memberOf jQuery.ui
* @description 要素のドラッグ移動に慣性を加えた動きの値を jQuery.data に書き出します。
* ドラッグ中のカスタムイベントに bind することで様々な動きを作ることが出来ます。<br><br>
*
* [Custom Event]<br>
* phantomdrag-start: ドラッグ開始イベント<br>
* phantomdrag-move: ドラッグ中イベント（ドラッグ中に毎フレーム呼ばれます）<br>
* phantomdrag-release: ドラッグ解除イベント<br>
* phantomdrag-stop: ドラッグ移動停止イベント（ドラッグ解除後も続く慣性移動が停止した合図です）<br><br>
*
* [jQuery.data]<br>
* phantomdragX: 要素の現在のX座標<br>
* phantomdragFx: 要素のドラッグ開始X座標<br>
* phantomdragDx: 要素の移動先X座標<br>
* phantomdragSx: 要素の1フレーム間でのX方向移動量<br>
* phantomdragY: 要素の現在のY座標<br>
* phantomdragFy: 要素のドラッグ開始Y座標<br>
* phantomdragDy: 要素の移動先Y座標<br>
* phantomdragSy: 要素の1フレーム間でのY方向移動量<br>
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
*         top: $el.data('phantomdragY'),
*         left: $el.data('phantomdragX')
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
})(jQuery, this, this.document, Math, setInterval);
