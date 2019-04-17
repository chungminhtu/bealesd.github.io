let starColors = null;
	let ctx = null
	let canvas = null
	let starInterval = null;
	let pageAddresses = {
	  index: 'DavidBealesBlog',
	  posts: 'DavidBealesBlogPosts',
	  postOne: 'postOne'
	}
	let pageAddress = pageAddresses.welcome;
  
	function swapJsonKeyValues(json) {
	    var key, invertedJson = {};
	    for (key in json) {
		if (json.hasOwnProperty(key)) {
		    invertedJson[json[key]] = key;
		}
	    }
	    return invertedJson;
	}
	
function getCurrentPageName(){
	let addressSuffixFull = window.location.pathname;
	let addressSuffixFullWithRegex = addressSuffixFull.match(/[A-Za-z]+\.html/);
	let addressSuffix = addressSuffixFullWithRegex !== null ? addressSuffixFullWithRegex[0].slice(0, -5) : null;
	let invertedPageAddresses = swapJsonKeyValues(pageAddresses);
	let addressKey = invertedPageAddresses.hasOwnProperty(addressSuffix) ? invertedPageAddresses[addressSuffix]: null;
	if (addressKey === null){
		return null;
	}
	
	let addressKeys = Object.keys(pageAddresses);
	let addressIndex = Object.keys(pageAddresses).indexOf(addressKey);
	let pageName = Object.keys(pageAddresses)[addressIndex];
	
	return pageName;
}
	

	window.addEventListener('load', function () {
		let pageName = getCurrentPageName();
  		if (pageAddresses[pageName] === pageAddresses.postOne){
			loadPosts();  
		}
		else {
				setPostsLinkDivPosition();
			document.getElementById('postsLink').addEventListener("click", function (event) {
				if (event.srcElement.id === 'postsLink') {
					onPostsLoad();
				}
			}.bind(this));
			document.getElementById('postOne').addEventListener("click", function (event) {
				if (event.srcElement.id === 'postOne') {
					onPageOneLoad();
				}
			}.bind(this));

			drawStarMap();
			onResizePage();
		}
		

		
	}.bind(this));
	
	function onWelcomeLoad(){
		clearPage()
		setPostsLinkDivPosition();
		drawStarMap();
	}
	
	function onPageOneLoad(){
		//stopStars();
		//pageAddress = pageAddresses.postOne;
		//updatePageState();
		//clearPage();
		//document.querySelector('#postOneDiv').hidden = false;
		resizePost();
	}
	
	function onPostsLoad(){
		this.interval = setInterval(setIntervalWrapper, 50);
		this.scale = 0.99;
		this.scaleChange = 0.01;
		function setIntervalWrapper() {
			shrinkLink();
			if (scale < 0.01) {
				clearInterval(this.interval);
				clearPage();
				loadPosts();
			}
		}	
	}
  
	function shrinkLink() {
		let div = document.getElementById('postsLinkDiv');
		let link = document.getElementById('postsLink');
		this.scale -= this.scaleChange;
		this.scaleChange += 0.001;
		link.style.transform = `scale(${this.scale})`;
		div.style.transform =  `scale(${this.scale})`;
	}
  
	function resizePost() {
		let windowWidth = window.innerWidth;
		if (windowWidth > 750) {
			document.querySelector('.postContent').style.width = '650px';
		}
		else {
			document.querySelector('.postContent').style.width = '80%';
		}
		document.querySelector('.postContent');
	}
  
	function setPostsLinkDivPosition() {
		let viewWidth = window.innerWidth;
		let viewHeight = window.innerHeight;
		let postsLinkDiv = document.getElementById('postsLinkDiv');
		let postsLink = document.getElementById('postsLink');
		postsLink.style.transform = `scale(${1})`;
		postsLinkDiv.style.transform =  `scale(${1})`;
		postsLinkDiv.hidden = false;
		postsLinkDiv.style.marginTop = `${(viewHeight - postsLinkDiv.offsetHeight) / 2}px`;
		postsLink.style.paddingLeft = `${30}px`;
		postsLink.style.paddingRight = `${30}px`;
		let postsLinkGutter = (postsLinkDiv.offsetWidth - postsLink.offsetWidth) / 2;
		postsLink.style.marginLeft = `${postsLinkGutter}px`;
		let postsLinkDivGutter = (viewWidth - postsLinkDiv.offsetWidth) / 2;
		postsLinkDiv.style.marginLeft = `${postsLinkDivGutter}px`;
	}
  
	function clearPage() {
		document.querySelectorAll('#pageWrapper div').forEach(function (div) {
			div.hidden = true;
		});
		clearCanvas();
	}
  
	function loadPosts() {
		document.querySelectorAll('.postLinkDiv').forEach(function (div) {
			div.hidden = false;
		});
		pageAddress = pageAddresses.posts;
	}
  
	function clearCanvas() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
  
	function updateCanvasSize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}
  
	function hideCanvas() {
		document.querySelector('#canvas').hidden = true;
	}
  
	function drawStarMap() {
		this.canvas = document.getElementById('canvas');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.ctx = this.canvas.getContext('2d');
		this.starColors = {
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
  
	function onResizePage() {
		window.addEventListener('resize', function () {
			let resizeTimeout;
			if (!resizeTimeout) {
				resizeTimeout = setTimeout(function () {
					resizeTimeout = null;
					updateCanvasSize();
					if (pageAddress === pageAddresses.welcome) {
            //updatePageState();
						setPostsLinkDivPosition();
					}
					else if (pageAddress === pageAddresses.postOne) {
            //updatePageState();
						resizePost();
					}
				}, 66);
			}
		}.bind(this));
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
		let starCount = this.stars.length;
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
		this.ctx.beginPath();
		this.ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI, false);
		this.ctx.fillStyle = star.fillColor;
		this.ctx.fill();
		this.ctx.lineWidth = star.size;
		this.ctx.strokeStyle = star.lineColor;
		this.ctx.stroke();
	}
  
	function getRandomStarColor() {
		var starColorsIndex = Math.floor(Math.random() * Math.floor(Object.keys(this.starColors).length));
		return this.starColors[Object.keys(this.starColors)[starColorsIndex]];
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
