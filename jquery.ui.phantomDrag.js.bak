/*!
* jquery.ui.phantomDrag.js
* @author ykhs <ykhs.jp@gmail.com>
* @copyright ykhs
* @link https://github.com/ykhs/jquery.ui.phantomDrag
*
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/

/**
*/
(function ($, window, document, undefined) {

    $.widget('ui.phantomDrag', {

        options: {
            degree: 13
        },

        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        destinationX: 0,
        destinationY: 0,
        intervalId: 0,
        interval: 13,
        mousedown: false,

        _init: function () {

            var offset = this.element.offset();

            this.startX = offset.left;
            this.startY = offset.top;
            this.element.mousedown($.proxy(this._dragStart, this));

            return this;
        },

        _dragStart: function (e) {
            this.mousedown = true;
            this._startTimer();
            $(window).bind('mousemove', ($.proxy(this._dragmove, this)));
            $(window).bind('mouseup', ($.proxy(this._dragEnd, this)));
            this._trigger('start');
        },

        _dragmove: function (e) {

            var pageX = e.pageX,
                pageY = e.pageY;

            this.destinationX = pageX - this.startX,
            this.destinationY = pageY - this.startY;

            return false;
        },

        _startTimer: function () {
            this._stopTimer();
            this.intervalId = setInterval($.proxy(this._step, this), this.interval);
        },

        _step: function () {

            var myX = this.currentX,
                myY = this.currentY,
                distanceX = this.destinationX - myX,
                distanceY = this.destinationY - myY,
                distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));

            if (distance > 1) {
                this.currentX = myX + distanceX / this.options.degree;
                this.currentY = myY + distanceY / this.options.degree;
            } else {
                this.currentX = this.destinationX;
                this.currentY = this.destinationY;
                if (!this.mousedown) {
                    this._stopTimer();
                    this._trigger('stop');
                }
            }

            this._trigger('step', 0, {
                startX: this.startX,
                startY: this.startY,
                currentX: this.currentX,
                currentY: this.currentY,
                destinationX: this.destinationX,
                destinationY: this.destinationY
            });
        },

        _stopTimer: function () {
            clearInterval(this.intervalId);
            this.intervalId = 0;
        },

        _dragEnd: function (e) {
            this.mousedown = false;
            $(window).unbind('mousemove', $.proxy(this._drag, this));
            $(window).unbind('mouseup', $.proxy(this._dragEnd, this));
            this._trigger('release');
        },
    });

})(jQuery, this, this.document);
