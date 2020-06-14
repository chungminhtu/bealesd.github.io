window.postPaginationIndex = 0;
window.VALUE = "";
window.POSTS_PER_PAGE = 3;
window.START = 0;
window.END = 3;
window.CURRENT_POSTS = [];
window.ALL_POSTS = [];
window.TOASTS = [];
window.TAG = "";
window.postsByTag = [];
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
	},
	{
		'id': 'AzureVariables',
		'displayName': 'Variables',
		'tag': 'Azure',
		'subtags': '',
		'timestamp': '13 May 2020'
	}
];
const POSTS_BY_TAG = getPostByTags();

window.addEventListener('DOMContentLoaded', async () => {
	window.events = window.events || {};
	await routeUrl();
});


window.onpopstate = async function () {
	await routeUrl();
};

async function routeUrl() {
	setupSidebar();
	const suffix = getUrlSuffix();
	if (suffix) {
		const page = POSTS.filter((p) => { return p['id'] === suffix; });
		if (page.length === 1) {
			await loadPostContent(page[0]['id']);
			return;
		}
		else if (suffix === 'blog') {
			onListPostsLoad();
			return;
		}
	}
	else {
		onListPostsLoad();
	}
}

function changeUri(uri) {
	history.pushState({}, null, `${uri}.html`);
}


function generatePostHtml(timestamp, id, displayName, tag) {
	return `
	<div class="postLinkDiv">
		<p class="timestamp">${timestamp}</p>
		<a class="postLink" id="${id}">${displayName}</a>
		<div class="tags">
			<em id='${tag}'>#${tag}</em>
		</div>
	</div>
	`;
}

function generateAllPostsHtml() {
	let postsHtml = '';
	const postsByDate = soughtPostsByProperty('timestamp');
	for (let i = window.postPaginationIndex; i < postsByDate.length && i < window.postPaginationIndex + POSTS_PER_PAGE; i++) {
		const post = postsByDate[i];
		const postHtml = generatePostHtml(
			post['timestamp'],
			post['id'],
			post['displayName'],
			post['tag']);

		if (TAG !== null && TAG === post['tag']) {
			postsHtml += postHtml;
		}
		else if (TAG === null || TAG === '') {
			postsHtml += postHtml;
		}
	}
	return postsHtml;
}

function filterPostsByTag(posts, tag) {
	let postsByTag = [];
	for (let i = 0; i < posts.length; i++) {
		const post = posts[i];
		if (post['tag'].toLocaleLowerCase() === tag.toLocaleLowerCase())
			postsByTag.push(post);
	}
	return postsByTag;
}

function filterPostsByWord(posts, word) {
	let postsByWord = [];
	for (let i = 0; i < posts.length; i++) {
		const post = posts[i];
		if (post['displayName'].toLocaleLowerCase().includes(word.toLocaleLowerCase()))
			postsByWord.push(post);
	}
	return postsByWord;
}

function filterPostsByRange(posts, start, end) {
	return posts.slice(start, end);
}

function filterPosts(posts, tag, word) {
	filteredPosts = [];
	if (tag && !word) {
		filteredPosts = filterPostsByTag(posts, tag);
		return filteredPosts;
	}
	else if (tag && word) {
		filteredPosts = filterPostsByTag(posts, tag);
		filteredPosts = filterPostsByWord(filteredPosts, word);
		return filteredPosts;
	}
	else {
		filteredPosts = filterPostsByWord(posts, word);
		return filteredPosts;
	}
}

function generatePosts(posts) {
	let postsHtml = '';
	for (let i = 0; i < posts.length; i++) {
		const post = posts[i];
		const postHtml = generatePostHtml(
			post['timestamp'],
			post['id'],
			post['displayName'],
			post['tag']);

		postsHtml += postHtml;
	}
	return postsHtml;
}

function updatePosts(postsHtml) {
	document.querySelectorAll('.postLinkDiv').forEach((postLinkDiv) => {
		postLinkDiv.remove();
	})

	const div = document.createElement('div');
	div.innerHTML = postsHtml;

	const postLinkDivs = div.querySelectorAll('.postLinkDiv');
	for (let i = postLinkDivs.length - 1; i >= 0; i--) {
		const postLinkDiv = postLinkDivs[i];
		document.querySelector('#template').prepend(postLinkDiv)

	}
}

function registerPostsEvents() {
	document.querySelectorAll('.tags > em').forEach((tag) => {
		addEvent("click", tag, (event) => {
			if (TOASTS.includes(event.srcElement.id)) {
				// removeToast(event.srcElement.id);
			}
			else {
				TAG = event.srcElement.id;
				addToast('alert-info', `Tag: ${TAG}`, TAG);
				TOASTS.push(event.srcElement.id);

				let posts = filterPosts(ALL_POSTS, TAG, VALUE);
				let html = generatePosts(posts);
				updatePosts(html);
				registerPostsEvents();
			}
		});
	});

	document.querySelectorAll('.postLink').forEach(function (post) {
		addEvent("click", post, async (event) => {
			await loadPostContent(event.srcElement.id);
		});
	})
}

function addToast(type, message, id) {
	let index = 0;

	document.querySelector('#toast').innerHTML =
		`<div id=${id} class="alert ${type} alert-dismissible">
		${message}
		<button type="button" class="close">X</button>
	</div>` + document.querySelector('#toast').innerHTML;

	document.querySelectorAll('.alert').forEach((elem) => {
		const positionFromBottom = (80 * index++);
		elem.style.bottom = `${positionFromBottom}px`;
	})

	addEvent('click', document.querySelector(`#${id} button`), () => {
		removeToast();
		TAG = '';
		let posts = filterPosts(ALL_POSTS, TAG, VALUE);
		let html = generatePosts(posts);
		updatePosts(html);
		registerPostsEvents();
	});
}

function removeToast() {
	const id = event.srcElement.parentNode.id;
	event.srcElement.parentNode.remove();
	window.TOASTS = window.TOASTS.filter(item => item !== id);
}

function clearToasts() {
	document.querySelector('#toast').innerHTML = '';
	window.TOASTS = [];
}

function onListPostsLoad() {
	ALL_POSTS = soughtPostsByProperty('timestamp');
	CURRENT_POSTS = ALL_POSTS;

	changeUri('/blog');

	let postsHtml = `<div class='paginate later'>previous</div>				
					 <div class='paginate'>next</div>`;
	updateTemplate(postsHtml);

	let input = document.querySelector(`#searchInput`);
	input.focus();
	input.value = '';
	input.value = VALUE;

	const postsByWord = filterPostsByWord(CURRENT_POSTS, input.value);
	let html = generatePosts(postsByWord);
	updatePosts(html);

	addEvent('input', document.querySelector(`#searchInput`), (event) => {
		VALUE = event.srcElement.value;
		let posts = filterPosts(ALL_POSTS, TAG, VALUE);

		let html = generatePosts(posts);
		updatePosts(html);
		registerPostsEvents();
	});

	registerPostsEvents();

	document.querySelectorAll('.paginate').forEach((paginate) => {
		addEvent("click", paginate, (event) => {
			if (event.srcElement.classList.contains('later')) {
				if (window.postPaginationIndex - 1 < 0) {
					alert('No newer posts!');
				}
				else {
					window.postPaginationIndex -= POSTS_PER_PAGE;
					onListPostsLoad();
				}
			}
			else {
				const maxPosts = POSTS.length;
				if (window.postPaginationIndex + POSTS_PER_PAGE > maxPosts - 1) {
					alert('No older posts!');
				}
				else {
					window.postPaginationIndex += POSTS_PER_PAGE;
					onListPostsLoad();
				}
			}
		});
	});
}

function updateTemplate(html) {
	document.querySelector('#template').innerHTML = html;
}

function updateLayout(html) {
	let element = document.createElement('div');
	element.innerHTML = html;
	document.querySelector('#layout').appendChild(element);
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

function createSidebar() {
	let html = `<a class='bar-item bar-link header' id='blog'>Home</a>`;

	const orderedPostsByTagKeys = Object.keys(POSTS_BY_TAG);
	for (let i = 0; i < orderedPostsByTagKeys.length; i++) {
		const orderedPostsByTagKey = orderedPostsByTagKeys[i];
		const postArray = orderedPostsByTag[orderedPostsByTagKey];
		html += `<a class='bar-item header accordion' data-id='${orderedPostsByTagKey}'>${orderedPostsByTagKey}<span class='up'>&#10148;</span></a><div class='hide'>`;
		for (let j = 0; j < postArray.length; j++) {
			const postValue = postArray[j];
			html += `<a class='bar-item bar-link sub-header' id='${postValue['id']}'>${postValue['displayName']}</a>`
		}
		html += '</div>';
	}
	return html;
}

function setupSidebar() {
	document.querySelector('.sidebar').innerHTML = createSidebar();

	addEvent("click", document.querySelector('#blog'), async () => {
		collapseSidebar();
		await onListPostsLoad();
	});

	document.querySelectorAll('.bar-link.sub-header').forEach((link) => {
		addEvent("click", link, async (event) => {
			await loadPostContent(event.srcElement.id);
		});
	});

	document.querySelectorAll('.accordion').forEach((link) => {
		addEvent("click", link, () => {
			//shown sublinks
			if (!link.nextSibling.classList.contains("show")) {
				link.nextSibling.classList.add("show");
				link.querySelector('span').classList.add("down");

				link.nextSibling.classList.remove("hide");
				link.querySelector('span').classList.remove("up");
			}
			//hide sublinks
			else if (link.nextSibling.classList.contains("show")) {
				link.nextSibling.classList.remove("show")
				link.querySelector('span').classList.remove("down");

				link.nextSibling.classList.add("hide");
				link.querySelector('span').classList.add("up");
			}
		});
	});
}

function collapseSidebar(){
	document.querySelectorAll(`.sidebar span`).forEach((span)=>{
		span.classList.remove("down");
		span.classList.add("up");
	})

	document.querySelectorAll(`.sidebar .show`).forEach((subHeaders)=>{
		subHeaders.classList.remove("show");
		subHeaders.classList.add("hide");
	})

	document.querySelectorAll(`.activated-link`).forEach((al) => { al.classList.remove('activated-link') });
}

function exapndSidebar(){
	document.querySelectorAll(`.sidebar span`).forEach((span)=>{
		span.classList.remove("up");
		span.classList.add("down");
	})

	document.querySelectorAll(`.sidebar .hide`).forEach((subHeaders)=>{
		subHeaders.classList.remove("hide");
		subHeaders.classList.add("show");
	})
}

function showPostInSidebar(postId){
	const tag = POSTS.filter((post) => { return post.id === postId })[0].tag;
	const menuHeader = document.querySelector(`[data-id="${tag}"]`);

	menuHeader.nextSibling.classList.remove("hide");
	menuHeader.nextSibling.classList.add("show");

	menuHeader.querySelector('span').classList.remove("up");
	menuHeader.querySelector('span').classList.add("down");

	document.querySelectorAll(`.activated-link`).forEach((al) => { al.classList.remove('activated-link') });
	document.querySelector(`#${postId}`).classList.add('activated-link');
}

async function loadPostContent(id) {
	clearToasts();

	updateTemplate('<div class="postContent"></div>');

	await loadPostMarkdownHtml(id);
	
	changeUri(`/blog/${id}`);

	showPostInSidebar(id);
}

async function loadPostMarkdownHtml(pageName) {
	const response = await fetch(`/${pageName}.md`);
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

//#region helpers
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
	return urlSuffixRegex !== null ? urlSuffixRegex[0].slice(0, -5) : "";
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