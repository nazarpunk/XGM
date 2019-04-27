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
	const $form = document.getElementById('comment_form');
	const $actions = document.querySelector('#comment_form .form-actions');
	if ($form === null || $textarea === null || $actions === null) { return; }

	$textarea.addEventListener('input', () => {
		$textarea.style.height = 'auto';
		$textarea.style.height = $textarea.scrollHeight + 'px';

	}, false);

	let br = document.querySelector('#comment_form > br');
	br.parentNode.removeChild(br);

	$form.setAttribute('style', `position: sticky; bottom: 0`);

	const style = window.getComputedStyle($textarea, null);
	const padding = parseInt(style.getPropertyValue('padding-left')) + parseInt(style.getPropertyValue('padding-right')) + 2;
	$textarea.setAttribute('style', `
										min-height: 100px;
										width: calc(100% - ${padding}px) !important;
										box-sizing: content-box;
										overflow: hidden;
										border-radius: 0;
										resize: none;
										z-index: 5;
										position: relative;`
	);

	$actions.setAttribute('style', `margin: 0`);
	$actions.innerHTML += `<label style="float: right"><input id="comment_form_stickyInput" type="checkbox" autocomplete="off"> закрепить</label>`;
	const $sticky = document.getElementById('comment_form_stickyInput');
	const key = 'comment-form-sticky';

	const recheck = () => {
		$form.style.position = $sticky.checked ? 'sticky' : 'static';
		localStorage[$sticky.checked ? 'removeItem' : 'setItem'](key, '');
		console.log($sticky.checked);
	};

	$sticky.checked = localStorage.getItem(key) === null;
	recheck();

	$sticky.addEventListener('change', recheck);

	$textarea.dispatchEvent(new Event('input', {
		'bubbles': false,
		'cancelable': true
	}));
});