
(function () {
    $(function () {

        var info_fx = $('#info1-drag-fx'),
            info_x = $('#info1-drag-x'),
            info_dx = $('#info1-drag-dx'),
            info_sx = $('#info1-drag-sx'),
            info_fy = $('#info1-drag-fy'),
            info_y = $('#info1-drag-y'),
            info_dy = $('#info1-drag-dy'),
            info_sy = $('#info1-drag-sy'),
            $drag1 = $('#drag1');

        $drag1
        .phantomDrag({
            step: function (e, res) {
                console.debug(this, arguments);
                info_fx.val(res.startX);
                info_fy.val(res.startY);
                info_x.val(res.currentX);
                info_y.val(res.currentY);
                info_dx.val(res.destinationX);
                info_dy.val(res.destinationY);
            }
        })
    });
})();


(function () {
    $(function () {

        var elements = $('.drag2');

        elements
        .phantomDrag({
            xmax: 660,
            xmin: 0,
            ymax: 260,
            ymin: 0,
            delay: 13
        })
        .bind('phantomdrag-start', function (e) {
            elements.css({
                background: '#559bf1'
            });
            $(e.target).css({
                background: '#f2a649'
            })
        })
        .bind('phantomdrag-move', function (e) {
            $(e.target).css({
                top: $(e.target).data('phantomdragY'),
                left: $(e.target).data('phantomdragX')
            })
        })
        .bind('phantomdrag-release', function (e) {
            $(e.target).css({
                background: '#74e87a'
            })
        })
        .bind('phantomdrag-stop', function (e) {
            $(e.target).css({
                background: '#559bf1'
            })
        });
    });
})();

(function () {
    $(function () {

        var element = $('#drag3'),
            mover = $('#mover1');

        element
        .phantomDrag({
            xmax: 71,
            xmin: 0,
            ymax: 31,
            ymin: 0,
            stopSpeedBorder: 0.01
        })
        .bind('phantomdrag-start', function (e) {
            mover.css({
                background: '#f2a649'
            });
        })
        .bind('phantomdrag-move', function (e) {
            mover.css({
                top: element.data('phantomdragY') * 10,
                left: element.data('phantomdragX') * 10
            })
        })
        .bind('phantomdrag-release', function (e) {
            mover.css({
                background: '#74e87a'
            })
        })
        .bind('phantomdrag-stop', function (e) {
            mover.css({
                background: '#559bf1'
            })
        });
    });

})();

(function () {
    $(function () {

        var element = $('#drag4'),
            mover = $('#mover2'),
            deg = 0,
            r = 100,
            centerX = 455,
            centerY = 155,
            radian = null;

        element
        .phantomDrag({
            delay: 13
        })
        .bind('phantomdrag-start', function (e) {
            mover.css({
                background: '#f2a649'
            });
        })
        .bind('phantomdrag-move', function (e) {

            radian = Math.PI / 180 * deg;

            mover.css({
                top: centerY + r * Math.cos(radian),
                left: centerX + r * Math.sin(radian)
            })

            deg += element.data('phantomdragSx');
        })
        .bind('phantomdrag-release', function (e) {
            mover.css({
                background: '#74e87a'
            })
        })
        .bind('phantomdrag-stop', function (e) {
            mover.css({
                background: '#559bf1'
            })
        });
    });
})();
