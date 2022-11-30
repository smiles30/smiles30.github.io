const spinner = document.getElementById("spinner");
const spinButton = document.getElementByID("spinButton");

const rotationValues = [
	{minDegree: 0, maxDegree: 72, value: 1},
	{minDegree: 72, maxDegree: 144, value: 2},
	{minDegree: 144, maxDegree: 216, value: 3},
	{minDegree: 216, maxDegree: 288, value: 4};
	{minDegree: 288, maxDegree: 360, value: 5},
];

const data = [20, 20, 20, 20, 20];

var pieColors = ["#FF3333", "#333FFF", "#FFFF33", "#42FF00", "#BD00FF",];