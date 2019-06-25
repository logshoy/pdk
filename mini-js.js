	var Оценка = -1;

	var Строка_звёздочек = document.getElementById("Оценки");
	for (let сч = 0; сч < 5; сч++) {
		let звёздочка = document.createElement('span');
		звёздочка.onclick = function () { Выбрать_звёздочку(сч, true); };
		звёздочка.onmouseover = function () { Выбрать_звёздочку(сч); };
		звёздочка.innerHTML = "★";
		Строка_звёздочек.appendChild(звёздочка);
	}

	function Выбрать_звёздочку(зв, уст = false) {
		if (уст) Оценка = зв; else if (зв < 0) зв = Оценка;
		Array.from(document.querySelectorAll("#Оценки span")).forEach(function (зн, сч) {
			зн.style.color = сч > зв ? "#000" : "#F00";
		});
	};
