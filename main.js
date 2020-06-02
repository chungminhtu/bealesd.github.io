//todo
//add accordion
//add home page button and contents

window.starColors = null;
window.ctx = null
window.canvas = null
window.starInterval = null;
window.currentPage;

const POSTS = [
	{
		'id': 'JavaScriptVariablesAndScope',
		'displayName': 'Variables And Scope',
		'tag': 'JavaScript',
		'subtags': '',
		'timestamp': '13 Apr 2018'
	},
	{
		'id': 'JavaScriptPromises',
		'displayName': 'Promises',
		'tag': 'JavaScript',
		'subtags': '',
		'timestamp': '13 May 2018'
	}
];

const POSTS_BY_TAG = getPostByTags();

window.addEventListener('DOMContentLoaded', function () {
	window.events = window.events || {};
	onLoad();
	onResize();
}.bind(this));

//#region index events
function onLoad() {
	window.currentPage = 'main';

	let mainHtml = `
		<div id='pageWrapper'>
			<div id="postsLinkDiv">
				<a id="allPostsLink">David Beales Blog</a>
			</div>
		</div>`;
	updatePageContent(mainHtml);

	drawStarMap();
	updateMainPageLayout();

	const listPostsLink = document.querySelectorAll('#allPostsLink')[0];
	addEvent("click", listPostsLink, () => {
		onListPostsLoad();
	});
}

function generatePostHtml(timestamp, id, displayName, tag) {
	return `
	<div class="postLinkDiv">
		<p class="timestamp">${timestamp}</p>
		<a class="postLink" id="${id}">${displayName}</a>
		<p class="tags">
			<em>#${tag}</em>
		</p>
	</div>
	`;
}

function onListPostsLoad() {
	window.currentPage = 'posts';
	let postsHtml = '';
	const postsByDate = soughtPostsByProperty('timestamp');
	for (let i = 0; i < postsByDate.length; i++) {
		const post = postsByDate[i];
		const postHtml = generatePostHtml(
			post['timestamp'],
			post['id'],
			post['displayName'],
			post['tag']);
		postsHtml += postHtml;
	}

	let listPostsHtml = `<div id="pageWrapper">${postsHtml}</div>`
	updatePageContent(listPostsHtml);

	drawStarMap();

	onPostLoad();
}

function updatePageContent(html) {
	document.querySelector('#firstSibling').nextElementSibling.remove();
	document.querySelector('#firstSibling').insertAdjacentHTML('afterEnd', html);
}

function onResize() {
	cb = () => {
		if (window.currentPage === 'main')
			return [updateMainPageLayout];
		else if (window.currentPage === 'posts')
			return [updateCanvasSize];
		else
			return [];
	}
	managedResize(cb);
}

function updateMainPageLayout() {
	let viewWidth = window.innerWidth;
	let viewHeight = window.innerHeight;
	let postsLinkDiv = document.getElementById('postsLinkDiv');
	let postsLink = document.getElementById('allPostsLink');
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
	updateCanvasSize();
}
//#endregion 

function scaleElements(elementIds, scaleChange = 0.01, scaleAcceleration = 0.001, refreshRate = 50) {
	window.scale = 0.99;
	window.scaleChange = scaleChange;
	window.scaleAcceleration = scaleAcceleration;

	return new Promise(function (res) {
		window.interval = setInterval(function () {
			shrinkElements(elementIds);
			if (window.scale < 0.01) {
				clearInterval(window.interval);
				res();
			}
		}, refreshRate);
	});
}

function shrinkElements(ids) {
	window.scale -= window.scaleChange;
	window.scaleChange += window.scaleAcceleration;
	for (let index = 0; index < ids.length; index++) {
		const id = ids[index];
		document.getElementById(`${id}`).style.transform = `scale(${window.scale})`;
	}
}

function onPostLoad() {
	postLinks = [];
	document.querySelectorAll('.postLink').forEach(function (post) {
		const id = `${post.id.toLowerCase()}`;
		postLinks.push(id);
	});

	document.querySelectorAll('.postLink').forEach(function (post) {
		addEvent("click", post, async (event) => {
			window.currentPage = 'post';
			removeCanvas();
			handlePostLoad(event);
		});
	})
}

async function handlePostLoad(event) {
	window.currentPage = 'post';
	removeCanvas();

	handlePostLinks();
	await loadPostContent(event.srcElement.id);
}

function soughtPostsByProperty(property) {
	// deep copy POSTS
	return [...POSTS].sort((a, b) => {
		let x, y;
		if (property === 'timestamp') {
			x = Date.parse(a['timestamp']) * -1;
			y = Date.parse(b['timestamp']) * -1;
		}
		else {
			x = a[property].toLowerCase();
			y = b[property].toLowerCase();
		}

		return x < y ? -1 : x > y ? 1 : 0;
	})
}

function getPostByTags() {
	// sought by displayName
	const postsByDisplayName = soughtPostsByProperty('displayName');

	let postsByTag = {};
	for (let i = 0; i < postsByDisplayName.length; i++) {
		const post = postsByDisplayName[i];
		if (post['tag'] in postsByTag) {
			postsByTag[post['tag']].push(post)
		}
		else {
			postsByTag[post['tag']] = [post];
		}
	}
	//group by tag
	const orderedTags = Object.keys(postsByTag).sort((a, b) => {
		let x = a.toLowerCase();
		let y = b.toLowerCase();
		return x < y ? -1 : x > y ? 1 : 0;
	})
	orderedPostsByTag = {};
	for (let i = 0; i < orderedTags.length; i++) {
		const orderedTag = orderedTags[i];
		orderedPostsByTag[orderedTag] = postsByTag[orderedTag];
	}

	return orderedPostsByTag;
}

function buildPostLinks(htmlGenerator) {
	let html = "";
	html += `<a class='bar-item bar-link header' id='home'>Home</a>`;
	html += `<a class='bar-item bar-link header' id='posts'>Posts</a>`;

	const orderedPostsByTagKeys = Object.keys(POSTS_BY_TAG);
	for (let i = 0; i < orderedPostsByTagKeys.length; i++) {
		const orderedPostsByTagKey = orderedPostsByTagKeys[i];
		const postArray = orderedPostsByTag[orderedPostsByTagKey];
		html += `<a class='bar-item header'>${orderedPostsByTagKey}</a>`;
		for (let j = 0; j < postArray.length; j++) {
			const postValue = postArray[j];
			html += htmlGenerator(postValue);
		}
	}
	return html;
}

function handlePostLinks() {
	const anchors = buildPostLinks((postValue) => {
		return `<a class='bar-item bar-link sub-header' id='${postValue['id']}'>${postValue['displayName']}</a>`;
	})

	document.querySelector('body').innerHTML =
		`<div class="sidebar bar-block" style="width:25%">
			${anchors}
		</div>
		` + document.querySelector('body').innerHTML;

	document.querySelectorAll('.bar-link.header').forEach((link) => {
		addEvent("click", link, async (event) => {
			await loadPage(event.srcElement.id);
		});
	});

	document.querySelectorAll('.bar-link.sub-header').forEach((link) => {
		addEvent("click", link, async (event) => {
			await loadPostContent(event.srcElement.id);
		});
	});
}

function loadPage(id) {
	if (id === 'home') {
		onLoad();
	}
	else if (id === 'posts'){
		onListPostsLoad();
	}
}

async function loadPostContent(id) {
	const postTemplateHtml = `
	<div id="postTemplate" >
		<div class="postContentDiv ">
			<div class="postContent">
			</div>
		</div>
	</div>`;
	updatePageContent(postTemplateHtml);
	await loadPostMarkdownHtml(id);
}

async function loadPostMarkdownHtml(pageName) {
	const response = await fetch(`${pageName}.md`);
	const text = await response.text();

	marked.setOptions({
		renderer: new marked.Renderer(),
		highlight: function (code, language) {
			return Prism.highlight(code, Prism.languages.javascript, 'javascript');
		},
		pedantic: false,
		gfm: true,
		breaks: false,
		sanitize: false,
		smartLists: true,
		smartypants: false,
		xhtml: false
	});

	document.querySelector('.postContent').innerHTML = marked(text);
}

//#region star logic
function drawStarMap() {
	if (!document.getElementById('canvas')) {
		const canvas = document.createElement("canvas");
		canvas.id = 'canvas';
		document.querySelector('#firstSibling').insertAdjacentElement('beforebegin', canvas);
	}
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

	setIntervalForMaxIterations = () => {
		renderStars();
		currentIteration++;
		if (currentIteration >= iterations)
			clearInterval(this.starInterval);
	}

	this.stars = [];
	let currentIteration = 0;
	const iterations = 10000;

	clearInterval(window.starInterval);
	this.starInterval = setInterval(setIntervalForMaxIterations, 50);
	window.starInterval = this.starInterval;
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
function removeCanvas() {
	if (document.querySelector('#canvas')) {
		document.querySelector('#canvas').remove();
	}
}

function clearCanvas() {
	window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);
}

function updateCanvasSize() {
	window.canvas.width = window.innerWidth;
	// window.canvas.width = (window.innerWidth - (window.innerWidth * 0.1));
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
		if (json.hasOwnProperty(key))
			invertedJson[json[key]] = key;
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

function managedResize(callbacks) {
	let oldCb = window.events['windowResize'];
	window.removeEventListener('resize', oldCb);

	let cb = () => {
		let resizeTimeout;
		if (!resizeTimeout) {
			resizeTimeout = setTimeout(function () {
				resizeTimeout = null;
				for (let index = 0; index < callbacks().length; index++) {
					callbacks()[index]();
				}
			}, 66);
		}
	};

	window.addEventListener('resize', cb);
	window.events['windowResize'] = cb;
}

function addEvent(eventType, element, callback, callbackArgs) {
	const id = element.id;
	window.events[id] = window.events[id] === undefined || window.events[id][eventType] === undefined ?
		{ [eventType]: [callback] } :
		{ [eventType]: [...window.events[id][eventType], callback] }

	element.addEventListener(eventType, callback, callbackArgs);
}

function removeEvents(eventType, element) {
	const id = element.id;
	if (window.events[id] !== undefined && window.events[id][eventType] !== undefined) {
		for (let i = 0; i < window.events[id][eventType].length; i++) {
			element.removeEventListener(eventType, window.events[id][eventType][i]);
			window.events[id][eventType].pop(window.events[id][eventType][i]);
		}
	}
}
//#endregion