// ==UserScript==
// @name XGM - Переключение вкладок ленты
// @description Улучшенное переключение вкладок ленты
// @author https://xgm.guru/user/NazarPunk
// @license MIT
// @version 1.0
// @include /^https?:\/\/xgm\.guru.*$/
// @noframes
// @run-at document-end
// @grant unsafeWindow
// @source https://github.com/nazarpunk/XGM
// ==/UserScript==
'use strict';

const w = unsafeWindow;
const tabid = '#feed-switcher-';
let XHR = null;
const $wrap = $('#feeddiv');
const $tabs = $(`${tabid}1, ${tabid}2, ${tabid}3, ${tabid}4, ${tabid}5`);
let $tab;

const color = $('#styleboot').attr('href').indexOf('dark.css') > 0 ? 'rgba(255, 255, 255, 0.15)' : 'rgba(170, 170, 170, 0.15)';

$(`<style>
    #group-feed > .nav {
        user-select: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;

        margin-left: -8px;
        margin-right: -8px;
        padding-left: 8px;
        padding-right: 8px;
    }

    #group-feed > .nav > li.loading > a {
        background-image: linear-gradient(45deg, ${color} 25%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0) 50%, ${color} 50%, ${color} 75%, rgba(0, 0, 0, 0) 75%, rgba(0, 0, 0, 0));
        background-size: 20px 20px;
        animation: 2s linear 0s normal none infinite progress-bar-stripes;
    }

    #feeddiv {
        padding-bottom: 10px;
    }

    #feeddiv > div > div:last-child {
        margin-bottom: 0;
    }

</style>`).appendTo('body');

w.ChangeFeed = (id, offset = 0) => {
	NProgress.start();
	setcookie('feed-active-tab', id, 10 * 365);
	$tabs.removeClass('active loading');
	$tab = $($(`${tabid}${id}`)).addClass('active loading');
	//$wrap.hide( "highlight" );
	if (XHR !== null) { XHR.abort(); }
	XHR = $.post('comment.php', {
			do: 'changefeed',
			postid: id,
			offset: offset
		},
		responseText => {
			$tab.removeClass('loading');
			NProgress.done();
			const result = eval("(" + responseText + ")");
			if (result.feedcache) {
				$wrap
					.wrapInner('<div></div>')
					.children()
					.css({opacity: 0.5})
					.slideUp(function () {
						$(this).remove();
					});


				let $div = $('<div></div>')
					.prependTo($wrap)
					.html(result.feedcache)
					.hide();

				$div.find('img').attr('alt', '');

				$div.slideDown();
				return;
			}
			firemsg('Ошибка! ' + result.error);
		});
};

for (let i = 1; i <= 5; i++) {
	$tab = $(`${tabid}${i}`);
	if ($tab.length === 0) { continue; }
	$tab
		.children('a')
		.removeAttr('onclick')
		.on('click', (e) => {
			e.stopPropagation();
			w.ChangeFeed(i, 0);
		});
}