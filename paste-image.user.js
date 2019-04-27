// ==UserScript==
// @name XGM - Загрузка изображений из буфера
// @description Добавляет возможность загружать изображения из буфер
// @author https://xgm.guru/user/NazarPunk
// @license MIT
// @version 1.1
// @include /^https?:\/\/xgm\.guru.*$/
// @noframes
// @run-at document-end
// @source https://github.com/nazarpunk/XGM
// ==/UserScript==
'use strict';
document.addEventListener("DOMContentLoaded", () => {
	const $textarea = document.getElementById('input_comment');
	const $files = document.getElementById('id_files');
	const $area = document.getElementsByClassName("qq-upload-drop-area");

	if ($textarea === null || $area === null || $files === null || !window.Clipboard || !window.File) { return; }
	window.addEventListener("paste", e => {
		if (!e.clipboardData) { return; }
		const files = [];
		for (let i = 0; i < e.clipboardData.files.length; i++) {
			let file = e.clipboardData.files[i];
			files.push(new File([file], file.name.replace('image', Date.now()), {type: file.type}));
		}
		if (files.length === 0) { return; }

		const event = new DragEvent('drop');
		Object.defineProperty(
			event,
			'dataTransfer',
			{
				value: {
					files: files
				}
			}
		);

		$files.style.display = `block`;
		$area[0].dispatchEvent(event);
	});
});