// ==UserScript==
// @name XGM - Улучшенная форма для комментариев
// @description Улучшает вид формы комментариев
// @author https://xgm.guru/user/NazarPunk
// @license MIT
// @version 1.0
// @include /^https?:\/\/xgm\.guru.*$/
// @noframes
// @run-at document-end
// @source https://github.com/nazarpunk/XGM
// ==/UserScript==
'use strict';
document.addEventListener("DOMContentLoaded", () => {
	const $textarea = document.getElementById('input_comment');
	if ($textarea === null) { return; }

	$textarea.addEventListener('input', () => {
		console.log($textarea.scrollHeight);
		$textarea.style.height = 'auto';
		$textarea.style.height = $textarea.scrollHeight + 'px';

	}, false);

	$textarea.style.boxSizing = 'content-box';

	$textarea.dispatchEvent(new Event('input', {
		'bubbles': false,
		'cancelable': true
	}));
});