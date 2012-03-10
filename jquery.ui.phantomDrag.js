/*!
* jquery.ui.phantomDrag.js
* @author ykhs <ykhs.jp@gmail.com>
* @copyright ykhs
* @link https://github.com/ykhs/jquery.ui.phantomDrag
*
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/

(function ($, window, document, undefined) {

    $.widget('ui.phantomDrag', {

        options: {
            defaultX: 0,
            defaultY: 0,
            xMax: Infinity,
            xMin: -Infinity,
            yMax: Infinity,
            yMin: -Infinity,
            delay: 13
        },

        destinationX: 0,
        destinationY: 0,
        startX: 0,
        startY: 0,
        speedX: 0,
        speedY: 0,
        currentX: 0,
        currentY: 0,
        mouseStartX: 0,
        mouseStartY: 0,
        intervalID: 0,
        interval: 13,
        mousedown: false,

        _init: function () {

            var that = this,
                o = this.options;

            that.destinationX = that.currentX = o.defaultX;
            that.destinationY = that.currentY = o.defaultY;

            that.element.mousedown($.proxy(that._dragStart, that));
            return that;
        },

        _dragStart: function (e) {

            var that = this,
                o = that.options;

            that._startLoopTimer();
            that.mousedown = true;
            that.startX = that.currentX;
            that.startY = that.currentY;
            that.mouseStartX = e.pageX;
            that.mouseStartY = e.pageY;
            $(document).bind({
                mousemove: $.proxy(that._drag, that),
                mouseup: $.proxy(that._dragEnd, that)
            });
            that._trigger('start');
            return false;
        },

        _startLoopTimer: function () {

            var that = this;

            that._stopTimer();
            that.intervalID = setInterval($.proxy(that._step, that), that.interval);
        },

        _stopTimer: function () {

            var that = this;

            clearInterval(that.intervalID);
            that.intervalID = 0;
        },

        _drag: function (e) {

            var that = this,
                o = that.options,
                pageX = e.pageX,
                pageY = e.pageY;

            that.destinationX = Math.max(o.xMin, Math.min(that.startX + pageX - that.mouseStartX, o.xMax)),
            that.destinationY = Math.max(o.yMin, Math.min(that.startY + pageY - that.mouseStartY, o.yMax));

            return false;
        },

        _step: function () {

            var that = this,
                o = that.options,
                distanceX = that.destinationX - that.currentX,
                distanceY = that.destinationY - that.currentY,
                distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));

            if (distance > 1 || that.mousedown) {
                that.speedX = distanceX / o.delay;
                that.speedY = distanceY / o.delay;
                that.currentX += that.speedX;
                that.currentY += that.speedY;
            } else {
                that.currentX = that.destinationX;
                that.currentY = that.destinationY;
                that.speedX = that.speedY = 0;
                that._stopTimer();
                that._trigger('stop', 0, {
                    startX: that.startX,
                    startY: that.startY,
                    destinationX: that.destinationX,
                    destinationY: that.destinationY,
                    speedX: that.speedX,
                    speedY: that.speedY,
                    currentX: that.currentX,
                    currentY: that.currentY
                });
            }

            that._trigger('step', 0, {
                startX: that.startX,
                startY: that.startY,
                destinationX: that.destinationX,
                destinationY: that.destinationY,
                speedX: that.speedX,
                speedY: that.speedY,
                currentX: that.currentX,
                currentY: that.currentY
            });
            return false;
        },

        _dragEnd: function (e) {

            var that = this;

            that.mousedown = false;
            $(document).unbind({
                mousemove: $.proxy(that._drag, that),
                mouseup: $.proxy(that._dragEnd, that)
            });
            that._trigger('release', 0, {
                startX: that.startX,
                startY: that.startY,
                destinationX: that.destinationX,
                destinationY: that.destinationY,
                speedX: that.speedX,
                speedY: that.speedY,
                currentX: that.currentX,
                currentY: that.currentY
            });
            return false;
        },

        moveTo: function (x, y) {

            var that = this,
                o = that.options;

            that.destinationX = Math.max(o.xMin, Math.min(x, o.xMax));
            that.destinationY = Math.max(o.yMin, Math.min(y, o.yMax));

            this._startLoopTimer();
        }
    });
})(jQuery, this, this.document, Math);
