window.starColors = null;
window.ctx = null
window.canvas = null
window.starInterval = null;

window.addEventListener('load', function () {
	window.page = {
		index: {
			urlSuffix: 'index',
			load: loadIndex,
			onLoad: onIndexLoad,
			onResize: null
		},
		posts: {
			urlSuffix: 'posts',
			onLoad: onPostsLoad,
			load: null,
			onResize: null
		},
		postone: {
			urlSuffix: 'postOne',
			onLoad: onPostOneLoad,
			load: loadPostOne,
			onResize: onResizePostOne
		}
	}

	let pageName = getUrlSuffix();
	window.page[`${pageName.toLowerCase()}`].onLoad();
}.bind(this));


//#region index events
function loadIndex() {
	window.location.href = getUrlPrefix() + "index.html";
}

function onIndexLoad() {
	setPostsLinkDivPosition();
	drawStarMap();
	onResizeIndex();

	document.getElementById('postsLink').addEventListener("click", function (event) {
		if (event.srcElement.id === 'postsLink')
			window.page.posts.onLoad();
	}.bind(this));

	document.getElementById('postOne').addEventListener("click", function (event) {
		if (event.srcElement.id === 'postOne')
			window.page.postone.load();
	}.bind(this));
}

function onResizeIndex() {
	window.addEventListener('resize', function () {
		let resizeTimeout;
		if (!resizeTimeout) {
			resizeTimeout = setTimeout(function () {
				resizeTimeout = null;
				updateCanvasSize();
				//what is this, move to config? {
				setPostsLinkDivPosition();
				// else if (pageAddress === window.page.postOne) {
				// 	resizePost();
				// }
			}, 66);
		}
	}.bind(this));
}

function shrinkLink() {
	let div = document.getElementById('postsLinkDiv');
	let link = document.getElementById('postsLink');
	this.scale -= this.scaleChange;
	this.scaleChange += 0.001;
	link.style.transform = `scale(${this.scale})`;
	div.style.transform = `scale(${this.scale})`;
}
//#endregion 


//#region post one events
function loadPostOne() {
	window.location.href = getUrlPrefix() + "postOne.html";
}

function onPostOneLoad() {
	onResizePostOne();
}

function onResizePostOne() {
	let windowWidth = window.innerWidth;
	if (windowWidth > 750) {
		document.querySelector('.postContent').style.width = '650px';
	}
	else {
		document.querySelector('.postContent').style.width = '80%';
	}
	document.querySelector('.postContent');
}
//#endregion 


//#region posts events
function onPostsLoad() {
	window.interval = setInterval(setIntervalWrapper, 50);
	window.scale = 0.99;
	window.scaleChange = 0.01;
	function setIntervalWrapper() {
		shrinkLink();
		if (scale < 0.01) {
			clearInterval(window.interval);
			clearPage();
			loadPosts();
		}
	}
}

function loadPosts() {
	document.querySelectorAll('.postLinkDiv').forEach(function (div) {
		div.hidden = false;
	});
}

function setPostsLinkDivPosition() {
	let viewWidth = window.innerWidth;
	let viewHeight = window.innerHeight;
	let postsLinkDiv = document.getElementById('postsLinkDiv');
	let postsLink = document.getElementById('postsLink');
	postsLink.style.transform = `scale(${1})`;
	postsLinkDiv.style.transform = `scale(${1})`;
	postsLinkDiv.hidden = false;
	postsLinkDiv.style.marginTop = `${(viewHeight - postsLinkDiv.offsetHeight) / 2}px`;
	postsLink.style.paddingLeft = `${30}px`;
	postsLink.style.paddingRight = `${30}px`;
	let postsLinkGutter = (postsLinkDiv.offsetWidth - postsLink.offsetWidth) / 2;
	postsLink.style.marginLeft = `${postsLinkGutter}px`;
	let postsLinkDivGutter = (viewWidth - postsLinkDiv.offsetWidth) / 2;
	postsLinkDiv.style.marginLeft = `${postsLinkDivGutter}px`;
}
//#endregion 


//#region star logic
function drawStarMap() {
	window.canvas = document.getElementById('canvas');
	window.canvas.width = window.innerWidth;
	window.canvas.height = window.innerHeight;
	window.ctx = this.canvas.getContext('2d');
	window.starColors = {
		red: {
			fillColor: 'red',
			lineColor: '#8E2121'
		},
		green: {
			fillColor: 'green',
			lineColor: '#003300'
		},
		yellow: {
			fillColor: 'yellow',
			lineColor: '#AEBF14'
		},
		brightBlue: {
			fillColor: '#00C4FF',
			lineColor: '#14627A'
		},
		darkBlue: {
			fillColor: '#0D168D',
			lineColor: 'rgb(6, 9, 49)'
		},
		turqoise: {
			fillColor: '#00FFA2',
			lineColor: '#226E52'
		},
		orange: {
			fillColor: '#FF7700',
			lineColor: '#C46008'
		},
		white: {
			fillColor: '#FCE1FC',
			lineColor: '#EBB9EB'
		}
	}
	this.stars = [];
	let currentIteration = 0;
	let iterations = 10000;
	this.starInterval = setInterval(setIntervalForMaxIterations, 50);

	function setIntervalForMaxIterations() {
		renderStars();
		currentIteration++;
		if (currentIteration >= iterations)
			clearInterval(this.starInterval);
	}
}

function stopStars() {
	clearInterval(this.starInterval);
}

function renderStars() {
	clearCanvas();
	let star = randomStar(this.canvas.width, this.canvas.height);
	this.stars.push(star);
	stars.forEach(function (s) {
		drawStar(s);
		resizeStar(s);
	});
}

function resizeStar(star) {
	let change = randomRange(0.1, 0.2);
	let maxStarSze = 3;
	if (star.grow && star.size > maxStarSze)
		star.grow = false;
	if (star.grow)
		star.size += change;
	else
		star.size -= change;
	if (star.size < 0.5) {
		let removeIndex = this.stars.indexOf(star);
		this.stars = this.stars.removeItem(removeIndex);
	}
}

function drawStar(star) {
	window.ctx.beginPath();
	window.ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI, false);
	window.ctx.fillStyle = star.fillColor;
	window.ctx.fill();
	window.ctx.lineWidth = star.size;
	window.ctx.strokeStyle = star.lineColor;
	window.ctx.stroke();
}

function getRandomStarColor() {
	var starColorsIndex = Math.floor(Math.random() * Math.floor(Object.keys(window.starColors).length));
	return window.starColors[Object.keys(window.starColors)[starColorsIndex]];
}

function randomStar(maxX, maxY) {
	let startStarSize = randomRange(0.5, 1);
	let starColor = getRandomStarColor();
	return {
		x: randomRange(0, maxX),
		y: randomRange(0, maxY),
		size: startStarSize,
		fillColor: starColor.fillColor,
		lineColor: starColor.lineColor,
		grow: true
	};
}
//#endregion


//#region canvas helpers
function clearCanvas() {
	window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);
}

function updateCanvasSize() {
	window.canvas.width = window.innerWidth;
	window.canvas.height = window.innerHeight;
}

function hideCanvas() {
	document.querySelector('#canvas').hidden = true;
}
//#endregion


//#region helpers
function clearPage() {
	document.querySelectorAll('#pageWrapper div').forEach(function (div) {
		div.hidden = true;
	});
	clearCanvas();
}

function swapJsonKeyValues(json) {
	var key, invertedJson = {};
	for (key in json) {
		if (json.hasOwnProperty(key)) {
			invertedJson[json[key]] = key;
		}
	}
	return invertedJson;
}

function getUrlSuffix() {
	let url = window.location.href;
	let urlSuffixRegex = url.match(/[A-Za-z]+\.html/);
	return urlSuffixRegex !== null ? urlSuffixRegex[0].slice(0, -5) : window.page.index.urlSuffix;
}

function getUrlPrefix() {
	let url = window.location.href;
	let urlPrefixRegex = url.match(/[A-Za-z]+\.html/);
	return urlPrefixRegex !== null ? url.substring(0, url.indexOf(urlPrefixRegex)) : url;
}

function randomRange(min, max) {
	return Math.random() * (min - max) + max;
}

Array.prototype.removeItem = function (indexToRemove) {
	let newArray = [];
	for (let i = 0; i < this.length; i++) {
		if (i !== indexToRemove) {
			newArray.push(this[i]);
		}
	}
	return newArray;
};
//#endregion