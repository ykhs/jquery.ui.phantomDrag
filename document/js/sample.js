$(function () {

    /*
     * Get the virtual position of the dragged element
     */
    (function () {

        var $status = $('#info-status'),
            $startX = $('#info-start-x'),
            $x = $('#info-x'),
            $destinationX = $('#info-destination-x'),
            $speedX = $('#info-speed-x'),
            $startY = $('#info-start-y'),
            $y = $('#info-y'),
            $destinationY = $('#info-destination-y'),
            $speedY = $('#info-speed-y'),
            $obj = $('#info-drag-object');

        $obj.phantomDrag({
            start: function (e, res) {
                $status.val(e.type.replace(/phantomdrag/, ''));
            },
            step: function (e, res) {
                $startX.val(res.startX);
                $startY.val(res.startY);
                $x.val(res.currentX);
                $y.val(res.currentY);
                $speedX.val(res.speedX);
                $speedY.val(res.speedY);
                $destinationX.val(res.destinationX);
                $destinationY.val(res.destinationY);
            },
            release: function (e, res) {
                $status.val(e.type.replace(/phantomdrag/, ''));
            },
            stop: function (e, res) {
                $status.val(e.type.replace(/phantomdrag/, ''));
            }
        })
    })();

    /*
     * Move the dragged element
     */
    (function () {

        var $elements = $('.drag2');

        $elements.phantomDrag({
            xMax: 860,
            xMin: 0,
            yMax: 300,
            yMin: 0,
            step: function (e, res) {
                $(e.target).css({
                    top: res.currentY,
                    left: res.currentX
                })
            }
        });
    })();


    /*
     * Move to another element
     */
    (function () {

        var $element = $('#drag3'),
            $mover = $('#mover1');

        $element.phantomDrag({
            xMax: 910,
            xMin: 0,
            yMax: 350,
            yMin: 0,
            step: function (e, res) {
                $mover.css({
                    top: res.currentY,
                    left: res.currentX
                })
            }
        });
    })();

    /*
     * Converted to circular motion
     */
    (function () {

        var $element = $('#drag4'),
            $mover = $('#mover2'),
            deg = 0,
            r = 100,
            centerX = 455,
            centerY = 155,
            radian = null;

        $element.phantomDrag({
            step: function (e, res) {

                radian = Math.PI / 180 * deg;

                $mover.css({
                    top: centerY + r * Math.cos(radian),
                    left: centerX + r * Math.sin(radian)
                })

                deg += res.speedX;
            }
        })
    })();


    /*
     * Thumbnail Slider
     */
    (function () {

        var $slider_root = $('#slider'),
            $slider_ul = $slider_root.find('ul'),
            $slider_li = $slider_ul.find('li'),
            sliderWidth = $slider_li.outerWidth(true) * $slider_li.size(),
            viewWidth = 960;

        $slider_ul.css({
            width: sliderWidth
        });

        $slider_ul.phantomDrag({
            xMax: 0,
            xMin: -(sliderWidth - viewWidth),
            step: function (e, res) {
                $slider_ul.css({
                    left: res.currentX
                });
            }
        });
    })();

    prettyPrint();
});
