(function ($) {

	$(function () {

		// jQuery の要素集合をキャッシュ
		var $slider_root = $('#slider'),
			$slider_ul = $slider_root.find('ul'),
			$slider_li = $slider_ul.find('li');

		// ul 要素の横幅を指定。
		// 内包する li 要素が1列ぴったり並ぶサイズにしとく。
		// こういうのは数が変わりやすいと思うので JS 側に任せたい。
		$slider_ul.css(
			'width',
			$slider_li.outerWidth(true) * $slider_li.size()
		);

		// プラグインを実行します
		// これで、 $slider_ul の指す要素に phantomDrag() によって
		// イベントや .data() の値が与えられます。
		$slider_ul.phantomDrag();

		// 'phantomdrag-move' っていうカスタムイベントを拾います。
		// これはマウスドラッグで慣性移動してる最中、大体常に配信されるイベントです。
		//
		// それからコールバックで .data('phantomdrag-x') の値を拾います。
		// これは要素の現在のX座標値。
		// ただ .data() に出力しているだけなので、その値は自由に流用してみてください。
		//
		// ということで、慣性ドラッグが効いてる最中のX座標値を
		// CSS の left プロパティ値に使ってスライダーっぽい動きを作ります。
		//
		$slider_ul.bind('phantomdrag-move',
			function (e) {
				var x = $slider_ul.data('phantomdrag-x');
				$slider_ul.css('left', x);
			}
		);
	});
})(jQuery);
