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
            defaultX: 0,
            defaultY: 0,
            xMax: Number.POSITIVE_INFINITY,
            xMin: Number.NEGATIVE_INFINITY,
            yMax: Number.POSITIVE_INFINITY,
            yMin: Number.NEGATIVE_INFINITY,
            degree: 13
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

            var self = this,
                o = this.options;

            self.destinationX = self.currentX = o.defaultX;
            self.destinationY = self.currentY = o.defaultY;

            self.element.mousedown($.proxy(self._dragStart, self));
            return self;
        },

        moveTo: function (x, y) {

            var self = this,
                o = self.options;

            self.destinationX = Math.max(o.xMin, Math.min(x, o.xMax));
            self.destinationY = Math.max(o.yMin, Math.min(y, o.yMax));

            this._startAnimationTimer();
        },

        _startAnimationTimer: function () {

            var self = this;

            self._stopTimer();
            self.intervalID = setInterval($.proxy(self._step, self), self.interval);
        },

        _stopTimer: function () {

            var self = this;

            clearInterval(self.intervalID);
            self.intervalID = 0;
        },

        _step: function () {

            var self = this,
                o = self.options,
                distanceX = self.destinationX - self.currentX,
                distanceY = self.destinationY - self.currentY,
                distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));

            if (distance > 1 || self.mousedown) {
                self.speedX = distanceX / self.options.degree;
                self.speedY = distanceY / self.options.degree;
                self.currentX += self.speedX;
                self.currentY += self.speedY;
            } else {
                self.currentX = self.destinationX;
                self.currentY = self.destinationY;
                self._stopTimer();
                self._trigger('stop', 0, {
                    startX: self.startX,
                    startY: self.startY,
                    destinationX: self.destinationX,
                    destinationY: self.destinationY,
                    speedX: self.speedX,
                    speedY: self.speedY,
                    currentX: self.currentX,
                    currentY: self.currentY
                });
            }

            self._trigger('move', 0, {
                startX: self.startX,
                startY: self.startY,
                destinationX: self.destinationX,
                destinationY: self.destinationY,
                speedX: self.speedX,
                speedY: self.speedY,
                currentX: self.currentX,
                currentY: self.currentY
            });
            return false;
        },

        _dragStart: function (e) {

            var self = this,
                o = self.options;

            self._startAnimationTimer();
            self.mousedown = true;
            self.startX = self.currentX;
            self.startY = self.currentY;
            self.mouseStartX = e.pageX;
            self.mouseStartY = e.pageY;
            $document.bind('mousemove', $.proxy(self._drag, self));
            $document.bind('mouseup', $.proxy(self._dragEnd, self));
            self._trigger('start');
            return false;
        },

        _drag: function (e) {

            var self = this,
                o = self.options,
                pageX = e.pageX,
                pageY = e.pageY;

            self.destinationX = Math.max(o.xMin, Math.min(self.startX + pageX - self.mouseStartX, o.xMax)),
            self.destinationY = Math.max(o.yMin, Math.min(self.startY + pageY - self.mouseStartY, o.yMax));

            return false;
        },

        _dragEnd: function (e) {

            var self = this;

            self.mousedown = false;
            $document.unbind('mousemove', $.proxy(self._drag, self));
            $document.unbind('mouseup', $.proxy(self._dragEnd, self));
            self._trigger('release', 0, {
                startX: self.startX,
                startY: self.startY,
                destinationX: self.destinationX,
                destinationY: self.destinationY,
                speedX: self.speedX,
                speedY: self.speedY,
                currentX: self.currentX,
                currentY: self.currentY
            });
            return false;
        }
    });
})(jQuery, this, this.document, Math);
