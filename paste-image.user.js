// ==UserScript==
// @name XGM - Загрузка изображений из буфера
// @description Добавляет возможность загружать изображения из буфер
// @author nazarpunk
// @license MIT
// @version 1.0
// @include /^https?:\/\/xgm\.guru.*$/
// @noframes
// @run-at document-end
// @source https://xgm.guru/user/NazarPunk
// ==/UserScript==
'use strict';

function FakeDataTransfer(file) {
	this.dropEffect = 'all';
	this.effectAllowed = 'all';
	this.items = [];
	this.types = ['Files'];
	this.getData = function () {
		return file;
	};
	this.files = [file];
}

document.addEventListener("DOMContentLoaded", () => {
	const $textarea = document.getElementById('input_comment');
	const $files = document.getElementById('id_files');
	const $area = document.getElementsByClassName("qq-upload-drop-area");

	if ($textarea === null || $area === null || $files === null || !window.Clipboard || !window.File) { return; }
	window.addEventListener("paste", (e) => {
		if (!e.clipboardData) { return; }

		const items = e.clipboardData.items;
		for (let i = 0; i < items.length; i++) {
			if (items[i].type.indexOf("image") !== -1) {
				const event = new DragEvent('drop');
				Object.defineProperty(
					event,
					'dataTransfer',
					{
						value: new FakeDataTransfer(
							new File([items[i].getAsFile()],
								`${Date.now()}.jpg`,
								{type: "image/jpg"})
						)
					}
				);

				$files.style.display = `block`;
				$area[0].dispatchEvent(event);
			}
		}
	});
});