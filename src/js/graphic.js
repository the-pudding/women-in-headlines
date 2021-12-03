/* global d3 */
function resize() { }

function init() {

	    // constants for charts
		let width5 = 1500;
		let height5 = 540;
	
		let heightCluster =  height5*3
	
		// constants for clusterchart
		let padding = 1.5, // separation between same-color nodes
		clusterPadding = 6, // separation between different-color nodes
		maxRadius = 12;
		
		// create constants for bubble chart and cluster chart
		let bubbleChartB = d3.select("div#chartB").select("#bubblechartBias")
						.attr("preserveAspectRatio", "xMinYMin meet")
						.attr("viewBox", "0 0 "+ width5 +"," + height5+"")
						.classed("svg-content", true);
	
		// create constants for bubble chart and cluster chart
		let bubbleChartP = d3.select("div#chartP").select("#bubblechartPolarity")
						.attr("preserveAspectRatio", "xMinYMin meet")
						.attr("viewBox", "0 0 "+ width5 +"," + height5+"")
						.classed("svg-content", true);
	
		// let wordClusters = d3.select("div#clusterChart").select("#bubbleClusters")
		//                 .attr("preserveAspectRatio", "xMinYMin meet")
		//                 .attr("viewBox", "0 0 "+ width5 +"," + heightCluster+"")
		//                 .classed("svg-content", true);
	
		// create constant for tooltip of first chart and define attributes
		let tooltipHeadline = d3.select("#tooltipHeadline")
		// tooltipHeadline.attr("height",height5/4)
		// tooltipHeadline.attr("width", width5/5)
	
		// create dataset to for logos of the first chart
		let logoData = [{site:"nytimes.com", link:"https://www.vectorlogo.zone/logos/nytimes/nytimes-icon.svg"},
					{site:"dailymail.co.uk", link:"https://seeklogo.com/images/D/Daily_Mail-logo-EBD7A83A1F-seeklogo.com.png"},
					{site:"cnn.com", link:"https://www.vectorlogo.zone/logos/cnn/cnn-icon.svg"},//https://www.vectorlogo.zone/logos/cnn/cnn-wordmark.svg
					{site:"bbc.co.uk", link:"https://www.vectorlogo.zone/logos/bbc/bbc-icon.svg"},
					{site:"telegraph.co.uk", link:"https://upload.wikimedia.org/wikipedia/commons/4/48/The_Telegraph_logo.svg"},
					{site:"washingtonpost.com", link:"https://www.vectorlogo.zone/logos/washingtonpost/washingtonpost-icon.svg"},
					{site:"forbes.com", link:"https://www.vectorlogo.zone/logos/forbes/forbes-icon.svg"},
					{site:"abcnews.go.com", link:"https://www.vectorlogo.zone/logos/abcgo/abcgo-icon.svg"},
					{site:"foxnews.com", link:"https://www.vectorlogo.zone/logos/fox/fox-icon.svg"},
					{site:"ksl.com", link:"https://logodix.com/logo/2090138.png"},
					{site:"bloomberg.com", link: "https://www.vectorlogo.zone/logos/bloomberg/bloomberg-icon.svg"},
					{site:"breitbart.com", link:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Breitbart_News.svg/1280px-Breitbart_News.svg.png"},
					{site:"popsugar.com", link:"https://all-4-one.com/wp-content/uploads/2015/07/PopSugar-Logo-logo.png"},
					{site:"nbcnews.com", link:"https://www.vectorlogo.zone/logos/nbc/nbc-icon.svg"},
					{site:"buzzfeed.com", link:"https://www.vectorlogo.zone/logos/buzzfeed/buzzfeed-icon.svg"},
					{site:"cnet.com", link:"https://www.vectorlogo.zone/logos/cnet/cnet-icon.svg"},
					{site:"politico.com", link:"https://www.vectorlogo.zone/logos/politico/politico-icon.svg"},
					{site:"usatoday.com", link:"https://www.vectorlogo.zone/logos/usatoday/usatoday-icon.svg"},
					{site:"nydailynews.com", link:"https://cdn6.myket.ir/icons/large/b0f31373-17ec-46d5-b6ef-66135cc1b242_.png"},
					{site:"businessinsider.com", link:"https://i.insider.com/596e4e7a552be51d008b50fd?width=600&format=jpeg"},
					{site:"aajtak.in", link:"https://static.wikia.nocookie.net/logopedia/images/d/db/Aaj_tak.png"},
					// {site:"ft.com", link:"https://www.ft.com/__origami/service/image/v2/images/raw/ftlogo-v1:brand-ft-logo-square-coloured-dot?source=origami-registry&width=200"},
					{site:"espn.go.com", link:"https://cdn.worldvectorlogo.com/logos/espn.svg"},
					{site:"huffingtonpost.com", link:"https://www.vectorlogo.zone/logos/huffingtonpost/huffingtonpost-icon.svg"}
				]
		
		// timeline ruler tooltip and function
		const tooltip = d3
			.select("body")
			.append("div")
			.attr("class", "tooltipTL")
			.style("position", "absolute")
			.style("text-align", "left")
			.style("width", "200")
			.style("height", "auto")
			.style("padding", "5px")
			.style("pointer-events", "none")
			.style("opacity", 0)
		
		// draw the legend for first chart
		//drawBarLegend()
		// Load data and run functions to render charts
		Promise.all([
			d3.csv("./assets/data/headlines_site_rapi.csv"),
			// d3.csv("./assets/data/headlines_cl_sent_sm_rapi.csv"),
			d3.csv("./assets/data/headlines_cl_sent_rapi_reduced_102621.csv"),
			d3.csv("./assets/data/country_time_freqrank_rapi_clean_101421.csv", d3.autoType),
			d3.csv("./assets/data/polarity_comparison.csv", d3.autoType),
			// d3.csv("./assets/data/country_freqtheme_pivoted.csv", d3.autoType),
			// d3.csv("./assets/data/word_themes.csv", d3.autoType),
	
			d3.csv("./assets/data/country_freq_pivoted_all_101221.csv", d3.autoType), //101221
			// d3.csv("../data/processed/country_freqtheme_pivoted.csv", d3.autoType),
			// d3.csv("../data/processed/word_themes.csv", d3.autoType),
			d3.csv("./assets/data/word_themes_all_101221.csv", d3.autoType), //101221
			// d3.csv("../data/processed/word_themes_rank_old.csv", d3.autoType)]).then((datasets) => {
			d3.csv("./assets/data/word_themes_rank_101221.csv", d3.autoType), //101221
			d3.csv("./assets/data/word_themes_freq_101221.csv", d3.autoType), //101221
			d3.csv("./assets/data/sentiment_comparison.csv", d3.autoType)

		  ])
			.then((datasets) => {
				// define each dataset
				let headlinesSite = datasets[0]
				// countries_data = datasets[1]
				let headlines = datasets[1]
				let tempWords = datasets[2]
				let polComparison = datasets[3]
				// let dataWordsOLD = datasets[4]
				// let themesOLD = datasets[5]
				let data = datasets[4]
				let themes = datasets[5]
				let themesRank = datasets[6]
				let themesFreq = datasets[7]
				let sentComp = datasets[8]
				// console.log(dataFreq)
				// console.log(themes)
				// console.log(themesRank)
				// console.log(themesFreq)
				// renderStackedBars(dataWords, themes)
				let dataWords = prepareWordData(data, themes)
				let scales = prepareXYScales(data, dataWords)
				// console.log("scales", scales)
				// dataThemes = prepareThemesData(data, themes)
				// console.log("unstacked", data)
				// console.log("stacked", dataWords)
				renderBarAxis(data, dataWords)
				stackedBarScroll(data, dataWords, themes, themesRank, themesFreq, scales)
	
				// 1) stacked bars chart
				// renderStackedBars(dataWords, themes)
				// 1) lollipop chart
				renderLollipop(polComparison)
				renderTimeSeries(sentComp)
				// 1) bar charts
				// drawBar(countries_data, "#chart0", "All", 8)   
				// drawBar(countries_data, "#chart1", "India", 5)    
				// drawBar(countries_data, "#chart2", "USA", 5)   
				// drawBar(countries_data, "#chart3", "UK", 5)   
				// drawBar(countries_data, "#chart4", "South Africa", 5) 
				
				// 2) temporal chart
				var filter_years = [2009, 2022]
				var country = "all countries"
				var variable = "freq_prop_headlines" //freq_prop_headlines // frequency
				console.log("temp", tempWords)
				renderTempChart(tempWords, filter_years, country, variable, headlines)
				// update chart when country is changed
				d3.selectAll("button.country").on("click", function() {
					// Remove previous chart
					d3.select(".mainContainer").remove()
					d3.select(".stickyAxis").remove()
					let country = d3.select(this).property("value")
					console.log(country)
					renderTempChart(tempWords, filter_years, country, variable, headlines)
				})
				
				// 3) bubble charts
				// console.log("hd", headlinesSite)
				populateDropdown(headlinesSite, "#countrydropdown", "country_of_pub")
				populateDropdown(headlinesSite, "#pubdropdown", "site")
				drawBubbleChart(headlinesSite, headlines, bubbleChartB, "bias")
				drawBubbleChart(headlinesSite, headlines, bubbleChartP, "polarity")
			})
	
			// Sticky timeline enabled only during temporal chart
			$(window).scroll(function() {
				if ($(this).scrollTop() - $('#conclusionSection').position().top > -700){
					$('#stickyXaxis').css({'position': 'static', 'top': '0px'}); 
				}else{
					$('#stickyXaxis').css({'position': 'sticky', 'top': '0px'}); 
				}
			});
	
			// sticky filters for bubble charts
			$(window).scroll(function() {
				if ($(this).scrollTop() - $('#waveChartSection').position().top > -700){
					$('.bubbleFilters').css({'position': 'static', 'top': '0px'}); 
				}else{
					$('.bubbleFilters').css({'position': 'sticky', 'top': '0px'}); 
				}
			});

			// themes legend for word areas
			$(window).scroll(function() {
				// bias
				var top_of_element_b = $(".biasCells").offset().top;
				var bottom_of_element_b = $(".biasCells").offset().top + $(".biasCells").outerHeight();
				var bottom_of_screen_b = $(window).scrollTop() + $(window).innerHeight();
				var top_of_screen_b = $(window).scrollTop();
				// violence
				var top_of_element_v = $(".crimeCells").offset().top;
				var bottom_of_element_v = $(".crimeCells").offset().top + $(".crimeCells").outerHeight();
				var bottom_of_screen_v = $(window).scrollTop() + $(window).innerHeight();
				var top_of_screen_v = $(window).scrollTop();
				// empowerment
				var top_of_element_e = $(".empCells").offset().top;
				var bottom_of_element_e = $(".empCells").offset().top + $(".empCells").outerHeight();
				var bottom_of_screen_e = $(window).scrollTop() + $(window).innerHeight();
				var top_of_screen_e = $(window).scrollTop();
				// race
				var top_of_element_r = $(".raceCells").offset().top;
				var bottom_of_element_r = $(".raceCells").offset().top + $(".raceCells").outerHeight();
				var bottom_of_screen_r = $(window).scrollTop() + $(window).innerHeight();
				var top_of_screen_r = $(window).scrollTop();
				// people
				// var top_of_element_p = $(".peopleCells").offset().top;
				// var bottom_of_element_p = $(".peopleCells").offset().top + $(".peopleCells").outerHeight();
				// var bottom_of_screen_p = $(window).scrollTop() + $(window).innerHeight();
				// var top_of_screen_p = $(window).scrollTop();
				// // no theme
				// var top_of_element_nt = $(".ntCells").offset().top;
				// var bottom_of_element_nt = $(".ntCells").offset().top + $(".ntCells").outerHeight();
				// var bottom_of_screen_nt = $(window).scrollTop() + $(window).innerHeight();
				// var top_of_screen_nt = $(window).scrollTop();

				// var theme = $(this)[0].attributes.theme
				// console.log(theme)
			
				if ((bottom_of_screen_b > top_of_element_b) && (top_of_screen_b < bottom_of_element_b)){
					// the element is visible, toggle hovered class to change color
					console.log("bias Section")
					// $('#inTextBias').css({'background-color': 'green', 'color': 'grey'})
					d3.selectAll("#inTextBias")//.dispatch("mouseover");
					//    .classed("active", true)
					  .attr("class", "hovered")
					// uncolor the other ones
					d3.selectAll("#inTextViolence")
					  .attr("class", "stackedBarThemeAnnotation")
					d3.selectAll("#inTextEmpowerment")
					  .attr("class", "stackedBarThemeAnnotation")
					d3.selectAll("#inTextRace")
					  .attr("class", "stackedBarThemeAnnotation")
					// d3.selectAll("#inTextPeople")
					//   .attr("class", "stackedBarThemeAnnotation")
					// d3.selectAll("#inTextNT")
					//   .attr("class", "stackedBarThemeAnnotation")

				} else if ((bottom_of_screen_v > top_of_element_v) && (top_of_screen_v < bottom_of_element_v)){
					console.log("crime Section")
					d3.selectAll("#inTextViolence")
					  .attr("class", "hovered")
					d3.selectAll("#inTextBias")
					  .attr("class", "stackedBarThemeAnnotation")
					d3.selectAll("#inTextEmpowerment")
					  .attr("class", "stackedBarThemeAnnotation")
					d3.selectAll("#inTextRace")
					  .attr("class", "stackedBarThemeAnnotation")
					// d3.selectAll("#inTextPeople")
					//   .attr("class", "stackedBarThemeAnnotation")
					// d3.selectAll("#inTextNT")
					//   .attr("class", "stackedBarThemeAnnotation")

				} else if ((bottom_of_screen_e > top_of_element_e) && (top_of_screen_e < bottom_of_element_e)){
					console.log("empowerment Section")
					d3.selectAll("#inTextEmpowerment")
					  .attr("class", "hovered")

					d3.selectAll("#inTextViolence")
					  .attr("class", "stackedBarThemeAnnotation")
					d3.selectAll("#inTextBias")
					  .attr("class", "stackedBarThemeAnnotation")
					d3.selectAll("#inTextRace")
					  .attr("class", "stackedBarThemeAnnotation")
					// d3.selectAll("#inTextPeople")
					//   .attr("class", "stackedBarThemeAnnotation")
					// d3.selectAll("#inTextNT")
					//   .attr("class", "stackedBarThemeAnnotation")

				} else if ((bottom_of_screen_r > top_of_element_r) && (top_of_screen_r < bottom_of_element_r)){
					console.log("race Section")
					d3.selectAll("#inTextRace")
					  .attr("class", "hovered")

					d3.selectAll("#inTextViolence")
					  .attr("class", "stackedBarThemeAnnotation")
					d3.selectAll("#inTextBias")
					  .attr("class", "stackedBarThemeAnnotation")
					d3.selectAll("#inTextEmpowerment")
					  .attr("class", "stackedBarThemeAnnotation")
					// d3.selectAll("#inTextPeople")
					//   .attr("class", "stackedBarThemeAnnotation")
					// d3.selectAll("#inTextNT")
					//   .attr("class", "stackedBarThemeAnnotation")

				// } else if ((bottom_of_screen_p > top_of_element_p) && (top_of_screen_p < bottom_of_element_p)){
				// 	console.log("people Section")
				// 	d3.selectAll("#inTextPeople")
				// 	  .attr("class", "hovered")

				// 	d3.selectAll("#inTextViolence")
				// 	  .attr("class", "stackedBarThemeAnnotation")
				// 	d3.selectAll("#inTextBias")
				// 	  .attr("class", "stackedBarThemeAnnotation")
				// 	d3.selectAll("#inTextEmpowerment")
				// 	  .attr("class", "stackedBarThemeAnnotation")
				// 	d3.selectAll("#inTextRace")
				// 	  .attr("class", "stackedBarThemeAnnotation")
					// d3.selectAll("#inTextNT")
					//   .attr("class", "stackedBarThemeAnnotation")

				// } else if ((bottom_of_screen_nt > top_of_element_nt) && (top_of_screen_nt < bottom_of_element_nt)){
				// 	console.log("no theme Section")
				// 	d3.selectAll("#inTextNT")
				// 	  .attr("class", "hovered")

				// 	d3.selectAll("#inTextViolence")
				// 	  .attr("class", "stackedBarThemeAnnotation")
				// 	d3.selectAll("#inTextBias")
				// 	  .attr("class", "stackedBarThemeAnnotation")
				// 	d3.selectAll("#inTextEmpowerment")
				// 	  .attr("class", "stackedBarThemeAnnotation")
				// 	d3.selectAll("#inTextRace")
				// 	  .attr("class", "stackedBarThemeAnnotation")
				// 	d3.selectAll("#inTextPeople")
				// 	  .attr("class", "stackedBarThemeAnnotation")
				}
			});



			// sticky legend for stacked themes
			// $(window).scroll(function() {
			// 	if ($(this).scrollTop() - $('.exampleheadlines').position().top > -700){
			// 		$('#stackedLegend').css({'position': 'static', 'top': '0px'}); 
			// 	}else{
			// 		$('#stackedLegend').css({'position': 'sticky', 'top': '0px'}); 
			// 	}
			// });



			// sticky legend for stackedbars
			// $(window).scroll(function() {
			// 	if ($(this).scrollTop() - $('#themebars').position().top > -20){
			// 		$('#freqLegend').css({'position': 'static', 'top': '0px'}); 
			// 	}else{
			// 		$('#freqLegend').css({'position': 'sticky', 'top': '0px'}); 
			// 	}
			// });
	
			// // sticky chart stacked bar
			// $(window).scroll(function() {
			// 	if ($(this).scrollTop() - $('#endStackedbarSection').position().top > -100){
			// 		$('#stickyStackedChart').css({'position': 'static', 'top': '0px'}); 
			// 	}else{
			// 		$('#stickyStackedChart').css({'position': 'sticky', 'top': '0px'}); 
			// 	}
			// });
	
			// Text transition
			var TxtRotate = function(el, toRotate, period) {
				this.toRotate = toRotate;
				this.el = el;
				this.loopNum = 0;
				this.period = parseInt(period, 10) || 2000;
				this.txt = '';
				this.tick();
				this.isDeleting = false;
			};
			
			TxtRotate.prototype.tick = function() {
				var i = this.loopNum % this.toRotate.length;
				var fullTxt = this.toRotate[i];
			
				if (this.isDeleting) {
				// 0,0 remove the entire sentence at once as opposed to going one by one. 
				this.txt = fullTxt.substring(0, 0);
				} else {
				// increase how many words appear at once
				this.txt = fullTxt.substring(0, this.txt.length + 1);
				}
			
				this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
			
				var that = this;
				// increase speed of typing
				var delta = 50 - Math.random() ;
			
				if (this.isDeleting) { delta /= 2; }
			
				//Change this to change the time the headline waits before changing
				if (!this.isDeleting && this.txt === fullTxt) {
				delta = this.period;
				this.isDeleting = true;
				} else if (this.isDeleting && this.txt === '') {
				this.isDeleting = false;
				this.loopNum++;
				delta = 500;
				}
			
				setTimeout(function() {
				that.tick();
				}, delta);
			};
			
			window.onload = function() {
				var elements = document.getElementsByClassName('txt-rotate');
				for (var i=0; i<elements.length; i++) {
				var toRotate = elements[i].getAttribute('data-rotate');
				var period = elements[i].getAttribute('data-period');
				if (toRotate) {
					new TxtRotate(elements[i], JSON.parse(toRotate), period);
				}
				}
				// INJECT CSS
				var css = document.createElement("style");
				//css.type = "text/css";
				css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666}";
				document.body.appendChild(css);
			};

			 // STACKED BARS SCROLLY
			function prepareXYScales(data, series) {

				var margin = ({top: 100, right: 0, bottom: 0, left: 100})
			
				var height = 5000 - margin.top - margin.bottom
				var width = 500 - margin.left - margin.right

				var x = d3.scaleBand()
				.domain(data.map(d => d.country))
				.range([margin.left, width - margin.right])
				.padding(0.1)
			
				var y = d3.scaleLinear()
				// .domain([d3.max(series, d => d3.max(d, d => d[1])), 0])
				.domain([series.length, 0])
				// .domain([0, series.length])
				.range([height - margin.bottom, margin.top])

				return {x, y}


			 }

			function prepareWordData (data, themes) {


				// themes = themes.filter(d=>d.word!=="youtube")
			
				let series = d3.stack()
					.keys(data.columns.slice(2))
					// .keys(data.map(d=>d.country))
				(data)
					.map(d => (d.forEach(v => v.key = themes.filter(c=>c.word===d.key)[0]!== undefined?
													{"word": d.key, "theme": themes.filter(c=>c.word===d.key)[0].theme}:
													{"word": d.key, "theme": "No theme"}), d))
				
					// console.log(series)
			
				return series
			
			}
			
			function stackedBarScroll(data, words, themes, themesRank, themesFreq, scales) {
			
				const container = d3.select('#scrolly-side');
				var figure = container.select('stickyStackedChart');
				var article = container.select('article');
				const stepSel = article.selectAll('.step');
				var x = scales.x
				var y = scales.y
				// instantiate the scrollama
				const scroller = scrollama();
			
				// generic window resize listener event
				function handleResize() {
					// 1. update height of step elements
					var stepH = Math.floor(window.innerHeight * 0.75);
					stepSel.style('height', stepH + 'px');
					var figureHeight = window.innerHeight / 2
					var figureMarginTop = (window.innerHeight - figureHeight) / 2  
					figure
						.style('height', figureHeight + 'px')
						.style('top', figureMarginTop + 'px');
					// 3. tell scrollama to update new element dimensions
					scroller.resize();
				}
			
				// scrollama event handlers
				function handleStepEnter(response) {
					// console.log(response)
					updateChart(response.index, "enter")
				}
			
				function handleStepExit (response) {
					// console.log(response)
					updateChart(response.index, "exit")
				}
			
				function updateChart(index, action) {
					const sel = container.select(`[data-index='${index}']`);
					// const width = sel.attr('data-width');
					const task = sel.attr('task')
					const hovertype = sel.attr('hovertype')
			
					console.log(task)
					if (task==="highlightwords") {
						const word = sel.attr('word');
						if (action==="enter") {
							stepSel.classed('is-active', (d, i) => i === index);
						// container.select('.bar-inner').style('width', width);
							highlightWords(themes, word, "inTextHover", x, y)
						} else {
							unHighlightWords(themes, word, hovertype)
						}  
			
					} else if (task === "drawbars") {
						renderStackedBars(data, words)
						// activateTooltip(themes, x, y, "inTextHover")
						sel.attr('task', 'none')
					} else if (task === "highlightthemes") {
						const themeToColor = sel.attr('theme');
						const color = sel.attr("color");
						colorThemes(themeToColor, color)
						sel.attr('task', 'none')						
					// } else if (task === "highlightthemesVS") {
					// 	colorThemes("VS")
					// 	sel.attr('task', 'none')
					// } else if (task === "highlightthemesE") {
					// 	colorThemes("E")
					// 	sel.attr('task', 'none')
					// } else if (task === "highlightthemesPR") {
					// 	colorThemes("PR")
					// 	sel.attr('task', 'none')
					} else if (task === "tooltip") {
						activateTooltip(themes, x, y, "themeHover")
					} else if (task === "exploreChart") {
						revertOriginal(x, y, words)
					} else if (task === "themeBarsTransition") {
						renderThemeBars(themesRank, themesFreq, themes, x, y)
					}
					
				}
			
				function init() {
					Stickyfill.add(d3.select('.sticky').node());
			
					// 1. force a resize on load to ensure proper dimensions are sent to scrollama
					handleResize();
			
					// 2. setup the scroller passing options
					// this will also initialize trigger observations
					// 3. bind scrollama event handlers (this can be chained like below)
					scroller.setup({
						step: '#scrolly-side article .step',
						offset: 0.5,
						debug: false
					})
					.onStepEnter(handleStepEnter)
					.onStepExit(handleStepExit)
			
					// setup resize event
					window.addEventListener('resize', handleResize);
			
				}
			
				init()
				highlightSearchedWords(y)
			
			}
			
			function revertOriginal(x, y, series) {
			
				var margin = ({top: 100, right: 0, bottom: 0, left: 100})
			
				var height = 5000 - margin.top - margin.bottom
				var width = 500 - margin.left - margin.right

				d3.selectAll("#themeticks").remove()
			
				d3.selectAll(".stackedBars")
					.selectAll("rect")
					// .transition().duration("3000")
					// .ease(d3.easeCubic)
					// .delay((d, i) => {
					//     // console.log(d, i)
					//     // return i * 10;
					//     return i * Math.random() * 0.2;
						
					//   })
					.attr("visibility", "visible")
			
				// select bars with a theme and transition them back in old axis
				var rectsThemes = d3.selectAll(".stackedBars")
					 .selectAll("rect")
					 .filter(d=>(d.key.theme!=="No theme")&&(d.data.country==="All countries"))
					 .transition().duration("500")
					 .ease(d3.easeLinear)
					 .delay((d, i) => {
						// console.log(d, i)
						return i * 2;
						// return i * Math.random() * 0.5;
						
					 })
					 .attr("x", (d, i) => x(d.data.country))
					 // .attr("height", "4px")
					 .attr("height", d => d.data[d.key.word]===0 || d.data[d.key.word]===null? 0:height/series.length)
					 .attr("width", x.bandwidth())
					 .attr("y", d => d.data[d.key.word]!==0 || d.data[d.key.word]!==null? y(d.data[d.key.word]):y(null))
					 .attr("transform", `translate(0,0)`)
			
			
			}
			
			function renderBarAxis(data, series) {
			
				var margin = ({top: 100, right: 0, bottom: 0, left: 100})
			
				var height = 4000 - margin.top - margin.bottom
				var width = 500 - margin.left - margin.right
				// var height = 600 - margin.top - margin.bottom
				// var width = 200 - margin.left - margin.right
			
			
				var svg = d3.select("#stackedChart")
						.attr('width', width + margin.left + margin.right)
						.attr('height', height + margin.top + margin.bottom);
			
				// // stack data
				// series = d3.stack()
				//     .keys(data.columns.slice(2))
				//     // .keys(data.map(d=>d.country))
				// (data)
				//     .map(d => (d.forEach(v => v.key = d.key), d))
			
				var x = d3.scaleBand()
				.domain(data.map(d => d.country))
				.range([margin.left, width - margin.right])
				.padding(0.1)
			
				var y = d3.scaleLinear()
				// .domain([d3.max(series, d => d3.max(d, d => d[1])), 0])
				.domain([series.length, 0])
				// .domain([0, series.length])
				.range([height - margin.bottom, margin.top])
			
				// draw axes
				var xAxis = g => g
				// .attr("transform", `translate(0,${height - margin.bottom})`)
				.call(d3.axisBottom(x).tickSizeOuter(0).tickSizeInner(0))
				.call(g => g.selectAll(".domain").remove())
				
			
				var yAxis = g => g
				// .attr("transform", `translate(${width+margin.right+30},210)`)
				.attr("transform", `translate(${margin.left},220)`)
				.call(d3.axisRight(y).tickSizeOuter(0).tickSizeInner(0))
				.call(g => g.selectAll(".domain").remove())
				// .call(g=>g.selectAll(".tick text")
				//                 .text((d, i) => i == 0 || i == 8 ? "↑ Frequency": "")).call(wrap, 100)
			
				 // y axis
				yAxis = svg.append("g")
				 .call(yAxis)
				 .attr("class", "stackedChartyAxis")
				
				yAxis.selectAll(".tick text").remove()
			
			
				var formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")
			
				xAxis = svg.append("g")
				.call(xAxis)
				.attr("class", "stackedChartCountries")
			
				xAxis.selectAll(".tick text").remove()
						// .call(wrap, x.bandwidth());
			
			
				xAxis.selectAll(".tick")
					.append("text")
					.text(d=>d)
					.attr("x", 0)             
					.attr("y", 0)
					.attr("class", "stackedChartTicks")
					.call(wrap, x.bandwidth())
			
				// country names and flags
				var flags = [{country:"South Africa", flag:"assets/images/flags/south-africa.svg"}, {country:"USA", flag:"assets/images/flags/united-states.svg"}, 
				{country:"India", flag:"assets/images/flags/india.svg"}, {country:"UK", flag:"assets/images/flags/united-kingdom.svg"}, {country: 'All countries', flag:''}]
			
			
				xAxis.selectAll(".tick")
					.append("svg:image")
						.attr('height', "35px")
						.attr("x", 0)             
						.attr("y", 0)
						.attr("transform", "translate(-17, -50)")
						.attr("xlink:href", d => console.log(d))
						.attr("xlink:href", d => flags.filter(c=>c.country===d)[0].flag)
			
			
			}
			
			function renderStackedBars(data, series) {
			
				
				var margin = ({top: 100, right: 0, bottom: 0, left: 100})
			
				var height = 5000 - margin.top - margin.bottom
				var width = 500 - margin.left - margin.right
				// var height = 600 - margin.top - margin.bottom
				// var width = 200 - margin.left - margin.right
			
			
				var svg = d3.select("#stackedChart")
						// .attr('width', width + margin.left + margin.right)
						// .attr('height', height + margin.top + margin.bottom);
				// .attr("preserveAspectRatio", "xMinYMin meet")
				// .attr("viewBox", "0 0 "+ width +"," + height+"")
				// .classed("svg-content", true);
				// margin = {top: 40, right: 100, bottom: 60, left: 60},
				// width = +svg.attr("width")-200 - margin.left - margin.right,
				// height = +svg.attr("height")+1000 - margin.top - margin.bottom,
				// g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				// console.log(data)
				// console.log(data)
				// console.log(themes.filter(d=>d.word==="accuse")[0].theme)
			
			//     // stack data
			//     test = d3.stack()
			//     .keys(data.columns.slice(2))
			//     // .keys(data.map(d=>d.country))
			//   (data)
			//     .map(d => (d.forEach(v => v.key = d.key), d))
			
			//     series = d3.stack()
			//     .keys(data.columns.slice(2))
			//     // .keys(data.map(d=>d.country))
			//   (data)
			//     .map(d => (d.forEach(v => v.key = {"word": d.key, "theme": themes.filter(c=>c.word===d.key)[0].theme}), d))
			  
			//     console.log(series)
				// console.log(test)
				// console.log(series.length)
				// console.log(series.map(d=>d[1]))
			
				// xscale
				var x = d3.scaleBand()
				.domain(data.map(d => d.country))
				.range([margin.left, width - margin.right])
				.padding(0.1)
			
				var y = d3.scaleLinear()
				// .domain([d3.max(series, d => d3.max(d, d => d[1])), 0])
				.domain([series.length, 0])
				// .domain([0, series.length])
				.range([height - margin.bottom, margin.top])
			
				// color = d3.scaleOrdinal()
				// .domain(series.map(d => d.data[d.key]))
				// // .range(d3.schemeSpectral[series.length])
				// .range(d3.schemeSpectral[series.length])
				// .unknown("#ccc")
			
				// console.log([series.length, 0])
				// console.log(d3.max(series, d => d3.max(d, d => d[1])))
			
				// legend
				d3.select(".stackedChartyAxis")
					.selectAll(".tick")
					.append("text")
					.text((d, i) => i == 7 ?"Frequency of use in headlines ⇢": "")
					// .text((d, i)=>console.log("ytick"+i))
					// .attr("x", 0) 
					// .attr("y", 0)            
					.attr("class", "stackedChartyTicks")
					// .attr("class", "stackedChartyTicks")
					// .style("text-transform", "lowercase")
					.style("font-weight", "700")
					.style("transform", "rotate(-90deg)")
					.attr("dx", 50)
					// .attr("id", "freqLegend")
					
					// .call(wrap, 10)
			
				  
				var rects = svg.append("g")
					  .attr("class", "stackedBars")
					  .selectAll("g")
					  .data(series)
					  .join("g")
					  .selectAll("rect")
					  .data(d => d)
					  
				var rect = rects.join("rect")
						// .attr("class", d=>d.key)
						.attr("class", d=>d.key.word)
						// .attr("id", "stackedRects")
						// .attr("fill", "#FEFAF1")
						.attr("fill", "lightgrey")
						// .attr("fill", d=>themes.filter(c=>c.word===d.key)[0].theme==="female_bias"?"#0BBF99":
						//                  themes.filter(c=>c.word===d.key)[0].theme==="empowerement"?"#F7DC5B":
						//                  themes.filter(c=>c.word===d.key)[0].theme==="violence"?"#F2C5D3":"#ccc")
						// .attr("fill", d => color(d.key))
						.attr("stroke", "#FEFAF1")
						.attr("stroke-width", "0.2px")
						.attr("x", (d, i) => x(d.data.country))
						// .attr("height", "4px")
						.attr("height", d => d.data[d.key.word]===0 || d.data[d.key.word]===null? 0:height/series.length)
						.attr("width", x.bandwidth())
						// .attr("width", x.bandwidth()/4)
	
						// .on("mouseover", (event, d) => highlightWords(d.key, "chartHover", d))
						// .on("mouseleave", (event,d)=> unHighlightWords(d.key))
						.transition().duration("2000")
							.ease(d3.easeCubic)
							.delay((d, i) => {
								// console.log(d, i)
								return i * 200;
								// return i * Math.random() * 50;
								
							})
						// .attr("y", d => y(d[1]))
						// .attr("y", d => y(d.data[d.key]))
						// .attr("y", d => y(d.data[d.key.word]))
						.attr("y", d => d.data[d.key.word]!==0 || d.data[d.key.word]!==null? y(d.data[d.key.word]):y(null))
			
			// return {x, y}
			
			};

			function colorThemes(theme, color) {
			
				// select bars and color them by theme
				if (theme === "crime and violence") {
					d3.selectAll(".stackedBars")
				  	  .selectAll("rect")
						// .transition().duration("500")
						.attr("fill", d=> (d.key.theme===theme)? color:"lightgrey")

						// .attr("fill", d=> { if (d.key.theme===theme) {color }})
				} else if (theme === "female stereotypes") {
					d3.selectAll(".stackedBars")
				  	  .selectAll("rect")
						// .transition().duration("500")
						.attr("fill", d=> (d.key.theme===theme)? color:
										   d.key.theme==="crime and violence"?"#f76e45":"lightgrey")
					
				} else if (theme === "EPR") {
					d3.selectAll(".stackedBars")
				  	  .selectAll("rect")
					  .attr("fill", d=>d.key.theme==="female stereotypes"?"#53B67C":
									d.key.theme==="empowerment"?"#F7DC5B":
									d.key.theme==="crime and violence"?"#f76e45":
									d.key.theme==="race, ethnicity and identity"?"#F2C5D3":
									d.key.theme==="people and places"?"#5787f2": "lightgrey")
				}
					
			}
			
			// function colorThemes(theme) {
			
			// 	// select bars and color them by theme
			// 	if (theme === "VS") {
			// 		d3.selectAll(".stackedBars")
			// 	  	  .selectAll("rect")
			// 	//   .attr("fill", d=>themes.filter(c=>c.word===d.key)[0].theme==="female_bias"?"#0BBF99":
			// 	//                     themes.filter(c=>c.word===d.key)[0].theme==="empowerement"?"#F7DC5B":
			// 	//                     themes.filter(c=>c.word===d.key)[0].theme==="violence"?"#F2C5D3":"lightgrey")
			// 	// .transition().duration("3000")
			// 	//     .ease(d3.easeLinear)
			// 	//     .delay((d, i) => {
			// 	//         // console.log(d, i)
			// 	//         // return i * 10;
			// 	//         return i * Math.random() * 0.02;
						
			// 	//       })
			// 			.attr("fill", d=>d.key.theme==="female stereotypes"?"#53B67C":
			// 					d.key.theme==="crime and violence"?"#f76e45":"lightgrey")
			// 	// .on("mouseover", (event, d) => highlightWords(d.key, "chartHover", d))
			// 	// .on("mouseleave", (event,d)=> unHighlightWords(d.key))
			// 	} else if (theme === "E") {
			// 		d3.selectAll(".stackedBars")
			// 	  	  .selectAll("rect")
			// 		  .attr("fill", d=>d.key.theme==="female stereotypes"?"#53B67C":
			// 						d.key.theme==="empowerment"?"#F7DC5B":
			// 						d.key.theme==="crime and violence"?"#f76e45": "lightgrey")

			// 	} else if (theme === "PR") {
			// 		d3.selectAll(".stackedBars")
			// 	  	  .selectAll("rect")
			// 		  .attr("fill", d=>d.key.theme==="female stereotypes"?"#53B67C":
			// 						d.key.theme==="empowerment"?"#F7DC5B":
			// 						d.key.theme==="crime and violence"?"#f76e45":
			// 						d.key.theme==="race, ethnicity and identity"?"#F2C5D3":
			// 						d.key.theme==="people and places"?"#5787f2": "lightgrey")
			// 	}
					
			// }
			
			function activateTooltip (themes, x, y, hoverType) {
			
				// select bars and color them by theme
				d3.selectAll(".stackedBars")
				  .selectAll("rect")
				.on("mouseover", (event, d) => highlightWords(themes, d.key.word, "chartHover", d, null, null, null, x, y, event))
				.on("mouseleave", (event,d)=> unHighlightWords(themes, d.key.word, hoverType))
			
			}
			
			function highlightWords(themes, word, hoverType, d, newScale, changeScale, transform, x, y, event) {
			
				// console.log(themes.filter(c=>c.word===word)[0].theme)
				// console.log(themes.filter(c=>c.word===word)[0].theme)
				// console.log(word)
				// console.log(event.y)
				// console.log(transform)
				d3.selectAll("."+ word)
				.attr("fill", "#E75C33")
				//.attr("stroke-width", "0.1px")
			
				d3.selectAll(".stackedBars")
				  .selectAll("rect:not(."+ word+")")
				  .attr("opacity", "0.3")
			
				if (hoverType === "chartHover") {

					d3.selectAll(".stackedChartyTicks").style("opacity", "0")
					
					d3.select("#stackedChart")
						.append("text")
						.attr("y", y(d.data[word]))
						// .attr("y", console.log("word", d.data[word]))
						.text(word)
						.attr("class", "stackedBarAnnotation")
			
				} 
				
				if (changeScale === "True") {
					// console.log(d, newScale(d[1])+transform, event.clientY)
					// console.log(event.pageY+transform, event.clientY)
					// console.log("page " + event.pageY, "client " + event.clientY, "transform " + transform)

					const wordAnnot = 
					d3.select("#stackedChart")
						.append("text")
						// .attr("y", y(d.data[word]))
						// .attr("y", newScale(d[0])+transform)
						// .attr("y", newScale(d[0]))
						// .attr("y", (event.clientY)+"px")
						// .attr("y", (event.pageY)+transform)
						.attr("y", (event.clientY)+transform+60)
						.text(word)
						.attr("class", "stackedBarAnnotation")


					// wordAnnot//.attr("transform", `translate(0, 5000)`)
						// .attr("transform", `translate(0, ${transform})`)
				}
			
			}
			
			function unHighlightWords(themes, word, hoverType) {
			
			//      // select bars and color them grey (needed for backwards scroll)
			//      d3.selectAll(".stackedBars")
			//      .selectAll("rect")
			//    .attr("fill", "lightgrey")
			
				if (hoverType === "inTextHover") {
			
					d3.selectAll("."+ word)
					  .attr("fill", "lightgray")
			
				} else {
					d3.selectAll("."+ word)
					  .attr("fill",   d=>d.key.theme==="female stereotypes"?"#53B67C":
										d.key.theme==="empowerment"?"#F7DC5B":
										d.key.theme==="crime and violence"?"#f76e45":
										d.key.theme==="race, ethnicity and identity"?"#F2C5D3":
										d.key.theme==="people and places"?"#5787f2": "lightgrey")
				}
				
				// .attr("fill", "#FEFAF1")
				d3.selectAll(".stackedBarAnnotation").remove()
			
				d3.selectAll(".stackedBars")
				  .selectAll("rect")
				  .attr("opacity", "1")
			
				d3.selectAll(".stackedChartyTicks").style("opacity", "1")
			}
			
			function highlightThemes(theme) {
			
				// console.log(themes.filter(c=>c.word===word)[0].theme)
				// console.log(themes.filter(c=>c.word===word)[0].theme)
			
				// d3.selectAll(".stackedBars")
				//         .style("opacity", d=>themes.filter(c=>c.word===word)[0].theme===theme?"1":"0.2")
			
			
				// d3.selectAll(".stackedBars")
				//   .allLogos.style("opacity", d=>d.site.toLowerCase() === selection.toLowerCase()?"1":
				//   selection===""?"1":"0.2")
			
			}
			
			function renderThemeBars(data, dataFreq, themes, x, y) {
			
				data = data.filter(d=>d.theme!=="No theme")
				// dataFreq = dataFreq.filter(d=>d.theme!=="No theme")
				// console.log("themes, long", dataFreq.columns.slice(2))
			
				// console.log("original datafreq", dataFreq)
				// stack data
				var stackedData = d3.stack()
					.keys(dataFreq.columns.slice(2))
					.order(d3.stackOrderAscending)
					// .keys(data.map(d=>d.country))
				(dataFreq.filter(d=>d.theme!=="No theme"))
					.map(d => (d.forEach(v => v.key = d.key), d))
			
				// console.log("stacked themes", stackedData)
			
				var margin = ({top: 100, right: 0, bottom: 0, left: 100})

				var themePad = 20
			
				var height = 800 - margin.top - margin.bottom
				// var width = 600 - margin.left - margin.right
				var width = 550 + themePad - margin.left - margin.right
			
			
				// heightChart = 5000 - margin.top - margin.bottom
				var heightChart = height*4.8 - margin.top - margin.bottom
				// heightChart = height*7.5 - margin.top - margin.bottom
			
				// var height = 600 - margin.top - margin.bottom
				// var width = 200 - margin.left - margin.right
			
			
				var svg = d3.select("#stackedChart")
						// .attr('width', width + margin.left + margin.right)
						// .attr('height', height + margin.top + margin.bottom)
			
				// console.log(data)
				var xThemes = d3.scaleBand()
				// .domain(data.map(d => d.theme))
				.domain(["crime and violence","female stereotypes", "empowerment", "people and places", "race, ethnicity and identity"])
				.range([margin.left, width - margin.right])
				.padding(0.1)
				
				// console.log("themes", data.map(d => d.theme))
			
				// yThemes = d3.scaleLinear()
				// // .domain([d3.max(series, d => d3.max(d, d => d[1])), 0])
				// // .domain([data.length, 0])
				// .domain([d3.max(dataNotheme.map(d=>d.rank)), 0])
				// // .domain([0, series.length])
				// .range([margin.top, height - margin.bottom])
			
				var yThemesStack = d3.scaleLinear()
					.domain([d3.max(stackedData, d => d3.max(d, d => d[1])), 0])
					.rangeRound([margin.top, height - margin.bottom])
			
				// console.log(d3.extent(data.map(d=>d.rank)))
			
				// draw axes
				var xAxis = g => g
				// .attr("transform", `translate(0,${height-margin.top})`)
				.call(d3.axisBottom(xThemes).tickSizeOuter(0).tickSizeInner(0))
				.call(g => g.selectAll(".domain").remove())
				
			
				// yAxis = g => g
				// // .attr("transform", `translate(${width+margin.right+30},210)`)
				// .attr("transform", `translate(${margin.left},0)`)
				// .call(d3.axisRight(yThemes).tickSizeOuter(0).tickSizeInner(0))
				// .call(g => g.selectAll(".domain").remove())
				// // .call(g=>g.selectAll(".tick text")
				// //                 .text((d, i) => i == 0 || i == 8 ? "↑ Frequency": "")).call(wrap, 100)
			
				var yAxis = g => g
				// .attr("transform", `translate(${width+margin.right+30},210)`)
				// .attr("transform", `translate(${margin.left},0)`)
				.call(d3.axisRight(yThemesStack).tickSizeOuter(0).tickSizeInner(0))
				.call(g => g.selectAll(".domain").remove())
				// .call(g=>g.selectAll(".tick text")
				//                 .text((d, i) => i == 0 || i == 8 ? "↑ Frequency": "")).call(wrap, 100)
			
				 // y axis
				// yAxis = svg.append("g")
				//  .call(yAxis)
				//  .attr("class", "themesChartyAxis")
				//  .attr("id", "themeAxis")
				//  .attr("transform", `translate(${margin.left},${heightChart-margin.top})`)
				//  .attr("transform", `translate(0, ${heightChart})`)
			
				
				// yAxis.selectAll(".tick text").remove()
			
				 // legend
				// d3.select("#themeAxis")
				//  .selectAll(".tick")
				//  .append("text")
				//  .text((d, i) => i == 7 ?"Frequency of use in headlines ⇢": 
				//  				 i == 4? "Word is used more frequently ⇢":
				// 				 i == 2? "⇠ Word is used less frequently": "")
				//  // .text((d, i)=>console.log("ytick"+i))
				//  .attr("x", 0)             
				//  .attr("y", 0)
				//  .attr("class", "themesChartyTicks")
				//  .attr("dx", "250")
				//  .style("text-transform", "lowercase")
				//  .style("transform", "rotate(-90deg)")
				 // .call(wrap, 10)
			
			
				// x axis
				// var formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")
			
				xAxis = svg.append("g")
				.call(xAxis)
				.attr("class", "stackedChartCountries")
				.attr("id", "themeticks")
				// .attr("transform", `translate(0,${heightChart-margin.top})`)
			
				xAxis.selectAll(".tick text").remove()
						// .call(wrap, x.bandwidth());
			
			
				xAxis.selectAll(".tick")
					.append("text")
					// .transition().duration("2000")
					// .ease(d3.easeBounce)
					.text(d=>d==="female stereotypes"?"gendered language":d)
					.attr("x", 0)             
					.attr("y", 0)
					.attr("class", "stackedChartTicks")
					// .attr("transform", `translate(0,${height-margin.top+25})`)
					.attr("transform", `translate(0,${heightChart-margin.bottom-margin.top + height-margin.top/2-margin.bottom})`)
					.call(wrap, xThemes.bandwidth())
			
			
				 // select bars with a theme and transition them in new axis
				var rectsThemes = d3.selectAll(".stackedBars")
					.selectAll("rect")
					.filter(d=>(d.key.theme!=="No theme")&&(d.data.country==="All countries"))
					.on("mouseover", (event, d) => highlightWords(themes, d.key.word, "chartHover", d, yThemesStack, "True", heightChart-margin.top, x, yThemesStack, event))
					.on("mouseleave", (event,d)=> unHighlightWords(themes, d.key.word))
			
					// new
					// .data(stackedData)
			
					// test filter
					// console.log("test filter", stackedData.filter(d=>d.key === "kill")[0].filter(c=>c.data.theme==="violence"))
					
				// transition the rects into new axis
			
				// w = 100
			
				// var totalScale = d3.scaleLinear()
				//     .domain([d3.max(data.map(d=>d.count)), d3.min(data.map(d=>d.count))]) 
				//     .range([w, 5]);
			
				rectsThemes
					// .attr("height", "4px")
					// .attr("width", xThemes.bandwidth())
					// .on("mouseover", (event, d) => highlightWords(d.key, "chartHover", d))
					// .on("mouseleave", (event,d)=> unHighlightWords(d.key))
					.transition().duration("500")
					.ease(d3.easeLinear)
					.delay((d, i) => {
						// console.log(d, i)
						return i * 10;
						// return i * Math.random() * 50;
						
					  })
					// .attr("y", d => y(d[1]))
					// .attr("y", d => y(d.data[d.key]))
					// OLD
					// .attr("x", (d, i) => xThemes(d.key.theme))
					// .attr("y", d => yThemes(data.filter(c=>c.word===d.key.word)[0].rank))
			
					// // .attr("y", d => yThemes(data.filter(c=>c.word===d.key.word)[0].rank + totalScale(data.filter(c=>c.word===d.key.word)[0].count)))
			
					// // .attr("y", d => w - totalScale(data.filter(c=>c.word===d.key.word)[0].rank))
					
					// .attr("height", d => totalScale(data.filter(c=>c.word===d.key.word)[0].count))
			
					// NEW
					// .attr("x", (d, i) => xThemes(d.data.theme))
					.attr("x", d=> xThemes(stackedData.filter(c=>c.key === d.key.word)[0].filter(e=>e.data.theme===d.key.theme)[0].data.theme))
					.attr("y", d => yThemesStack(stackedData.filter(c=>c.key === d.key.word)[0].filter(e=>e.data.theme===d.key.theme)[0][1]))
					.attr("height", d => yThemesStack(stackedData.filter(c=>c.key === d.key.word)[0].filter(e=>e.data.theme===d.key.theme)[0][0]) - 
										 yThemesStack(stackedData.filter(c=>c.key === d.key.word)[0].filter(e=>e.data.theme===d.key.theme)[0][1]))
					.attr("width", xThemes.bandwidth()-(themePad/3))
					.attr("transform", `translate(0,${heightChart-margin.top})`)
					// console.log("test scale", stackedData.filter(c=>c.key === "kill")[0].filter(e=>e.data.theme==="violence")[0][1])
			
			
					// .attr("y", d => yThemesStack(d[1]))
					// .attr("height", d => yThemesStack(d[0]) - yThemesStack(d[1]))
			
				// .style("opacity", d=>d.key.theme==="female_bias"?"1":0)
			
				// select bars with no theme AND not in ALL COUNTRIES and remove them
			
				// HIDE RECTS
				// var rectsNoThemes = d3.selectAll(".stackedBars")
				// 	.selectAll("rect")
				// 	.filter(d=>(d.key.theme==="No theme")||(d.data.country!=="All countries"))
				// 	// .transition().duration("3000")
				// 	// .ease(d3.easeCubic)
				// 	// .delay((d, i) => {
				// 	//     // console.log(d, i)
				// 	//     // return i * 10;
				// 	//     return i * Math.random() * 0.2;
						
				// 	//   })
				// 	.attr("visibility", "hidden")


					// .attr("opacity", 0)
					// .remove()
				
			}
			
			// interaction with text
			// words
			$('.stackedBarTextAnnotation').on('mouseover', function () {
				// var word = $(this)[0].innerText.toLowerCase()
				var word = $(this)[0].attributes.value.value
				console.log(word)
				highlightWords(word, "inTextHover")
				// d3.select("#rectsBlock").select("#barchart").select('svg rect[data-key='+key+']').style('fill', 'brown');
			})
			.on('mouseout', function () {
				var word = $(this)[0].attributes.value.value
				var hoverType = $(this)[0].attributes.hoverType.value
				// console.log($(this)[0].attributes.hoverType.value)
				// if ATTRIBUTE hoverType === inTextHover do this, otherwise normal hover with themes!
				unHighlightWords(word, hoverType)
			})

			// interaction with search bar
			function highlightSearchedWords(scale) {
				
				d3.select("#wordSearch").on("input", function() {

					var selectedWord = event.target.value;
					console.log(selectedWord.toLowerCase())

					if (selectedWord==="") {
						d3.selectAll(".stackedBars")
							.selectAll("rect")
							.attr("opacity", "1")

					console.log("reset")
					d3.selectAll(".stackedChartyTicks").style("opacity", "1")

					} else {
					
						// d3.selectAll(("."+ selectedWord).toLowerCase())//.match(selectedWord.toLowerCase()))
						d3.selectAll(("[class*='"+ selectedWord.toLowerCase() +"']"))//.match(selectedWord.toLowerCase()))
						// .attr("fill", "#E75C33")
						.attr("opacity", "1")
						//.attr("stroke-width", "0.1px")
					
						d3.selectAll(".stackedBars")
						//   .selectAll("rect:not(."+ selectedWord.toLowerCase()+")")
						.selectAll("rect:not([class*='"+ selectedWord.toLowerCase() +"']")
						.attr("opacity", "0.3")

						d3.selectAll(".stackedBars")
							.selectAll(("[class*='"+ selectedWord.toLowerCase() +"']"))
							// .filter(d=> (d!==undefined) && (d.data[d.key.word]!==undefined))
							.append("text")
							// .attr("y", y(d.data[word]))
							// .attr("y", d=> d!==undefined? console.log(scale(d.key.word)):"")
							// .attr("y", d=>console.log(scale(d.data[d.key.word])))
							.attr("y", d=> d.data.country==="All countries"? scale(d.data[d.key.word]):null)
							// .attr("y",100)
							// .text(d=> d.key.word)
							.text("check")
							.attr("class", "stackedBarAnnotation")
						
						d3.selectAll(".stackedChartyTicks").style("opacity", "0")

				}

				// console.log(circles._groups[0].filter(d=>d.__data__.county === selected_city))
				// console.log(circles._groups[0].filter(d=>d.__data__.county.toLowerCase().match(selected_city)))
				// circles.attr("opacity", d=>d.county.toLowerCase().match(selected_city.toLowerCase())?"0.8":"0.2")
			
			
			})
		}

	
			// BAR CHARTS (OLD)
			// function to draw the bar legend in the text leading to the final visualization
			function drawBarLegend() {
				svg = d3.select("#barLegend")
				
				legendLine = svg.append("g")
					.selectAll("line")
					.data([{x1:0, x2:185, y1:28, y2:28}, {x1:0, x2:0, y1:28, y2:20}, {x1:185, x2:185, y1:28, y2:20}])
					.join("line")
					.attr("x1", d=>d.x1 )
					.attr("x2", d=> d.x2)
					.attr("y1", d=>d.y1 )
					.attr("y2", d=>d.y2)
					.attr("stroke", "red")
					.attr("stroke-width", "1px")
				
					svg.append("text")
						.text("number of headlines containing this word")
						.attr("x", 0)
						.attr("y", 45)
						// .style("text-anchor", "middle")
						.attr("class", "barLegendText")
						.call(wrap, 170)
			}
	
			function drawBar(countries_data, chart, selected_country, word_count) {
	
				// set the dimensions and margins of the graph
				var margin = {top: 50, right: 0, bottom: 10, left: 0},
				width = 150 - margin.left - margin.right,
				height = 200 - margin.bottom - margin.top;
	
				data = [{country:"South Africa", data:countries_data.filter(d=>d.country == selected_country)}, 
				{country:"USA", data:countries_data.filter(d=>d.country == selected_country)}, 
				{country:"India", data:countries_data.filter(d=>d.country == selected_country)}, 
				{country:"UK", data:countries_data.filter(d=>d.country == selected_country)},
				{country:'All', data: countries_data}]
	
				dataBars = data.filter(c=>c.country===selected_country)[0]['data']
				// dataBars = countries_data.filter(d=>d.country == selected_country)
				dataBars = dataBars.filter(d=>d.year == 2020)
				//console.log(dataBars)
				dataBars = dataBars.sort(function(a,b) { return d3.descending(+a.frequency, +b.frequency) })
				//console.log(dataBars)
				
				top10 = dataBars.filter(function(d,i){ return i<word_count })
				console.log(top10)
	
	
				flags = [{country:"South Africa", flag:"assets/images/flags/south-africa.svg"}, {country:"USA", flag:"assets/images/flags/united-states.svg"}, 
							{country:"India", flag:"assets/images/flags/india.svg"}, {country:"UK", flag:"assets/images/flags/united-kingdom.svg"}, {country: 'All', flag:'None'}]
	
				countryNames = [{country:"South Africa", name:"South Africa"}, {country:"USA", name:"United States"}, 
							{country:"India", name:"India"}, {country:"UK", name:"United Kingdom"}, {country: 'All', name:'All 4 countries'}]
			
				var svg = d3.select(chart)
				.append("svg")
				.attr("preserveAspectRatio", "xMinYMin meet")
				.attr("viewBox", "0 0 "+ (width - 40) +"," + (height + margin.top)+"")
				// .attr("class", "svgBars")
				.append("g")
				.attr("transform",
					"translate(" + margin.left + "," + margin.top + ")")
			
				// Add X axis
				// var x = d3.scaleLinear()
				// .domain([0, d3.max(top10,d=>+d.frequency)])
				// .range([ 0, width-margin.left]).nice();
					
				// Y axis
				var y = d3.scaleBand()
				.range([ 0, height ])
				.domain(top10.map(function(d) { return d.word; }))
				// change this to change the distance of the word from the bar
				.padding(0.1);      
					
				//Bars
				barHeight = height/5 - 10
				barWidth = width/1.8
				svg.selectAll("myRect")
				.data(top10)
				.join("rect")
				//.attr("x", x(0) )
				.attr("y", function(d) { return y(d.word); })
				.attr("width", barWidth)
				.attr("height", barHeight)
				.style("fill", function(d) { if (d.word == 'man') {return '#F7DC5B'} else {return '#FEFAF1'}})
				// .style("stroke", "#282828")
				.attr("class", "scoreChartBar")
	
				svg.selectAll("g")
				.data(top10)
				.join("text")
				.attr("x", barWidth/2.5)
				.attr("y", function(d) { return y(d.word) + barHeight/1.5; })
				.attr("text-anchor", "left")
				.text(function(d) { return d.word; })
				.attr("class", "scoreChartBarText")
				.style("font-weight", function(d) { if (d.word == 'man') {return 'bold'} else {return 'normal'}})
				// .style("font-size", 9)
	
			
	
				svg.append("svg:image")
				.attr('width', "20px")
				.attr("x", (width / 5))             
				.attr("y", 0 - (margin.top / 5))           
				.attr("transform", "translate(0, -40)")
				.attr("xlink:href", flags.filter(c=>c.country===selected_country)[0]['flag'])
	
				svg.append("text")
				.attr("width", "5px")
				.attr("x", (width / 5))             
				.attr("y", 0-margin.top/4)
				.attr("text-anchor", "middle")  
				.text(countryNames.filter(c=>c.country===selected_country)[0]['name'])
				.attr("class", "scoreChartTitle")
				.call(wrap, 80);
	
			}
	
			// LOLLIPOP CHART
			function renderLollipop(data){
	
				// set the dimensions and margins of the graph
				var margin = {top: 130, right: 50, bottom: 30, left: 230},
				width = 1000 - margin.left - margin.right,
				height = 2230 - margin.top - margin.bottom;
			
				// append the svg object to the body of the page
				var lollipopChart = d3.select("#lollipopChart")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform",
					  "translate(" + margin.left + "," + margin.top + ")");
			
				// console.log(data)
				//data = data.sort((a,b)=>d3.descending(+a.polarity_women, +b.polarity_women)) 
				data = data.filter(d=>(d.popularity==1)&&(Math.abs(d.difference) > 0.01)
													   &&((d.site_clean !== "dailysun.co.za")
													   &&(d.site_clean !== "")))
													   
				data = data.sort((a,b)=> d3.descending(+a.polarity_women, +b.polarity_women))
				// data = data.filter(d=> Math.abs(d.difference) > 0.05)
				// data = data.filter(d=>d.site_clean !== "dailysun.co.za")
	
				console.log(data)
			
			
			  // Add X axis
			  var x = d3.scaleLinear()
				// .domain([-0.1,d3.max(data, d=>d.difference)+0.1])
				.domain(d3.extent(data, d=>d.polarity_women))
				.range([ margin.left + margin.right, width-20]);
			   // .padding(0.001);
	
			   // Y axis
			var y = d3.scaleBand()
				.range([ 0, height ])
				.domain(data.map(d=>d.site_clean))
				// Padding from the top
				.padding(1);
				lollipopChart.append("g")
				.call(d3.axisLeft(y)
						.tickSize(0))
				// .call(g => g.select(".domain").remove())
				.attr("class", "polarityCompyAxis");
				
			  lollipopChart.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x))
				.attr("class", "polarityCompxAxis")
			
			  // Lines  
			
			  lollipopChart.selectAll("gridLine")
			  .data(data)
			  .join("line")
				.attr("x1", 10)
				.attr("x2", width)
				.attr("y1", function(d) { return y(d.site_clean); })
				.attr("y2", function(d) { return y(d.site_clean); })
				.attr("class", "grid");
			
			
			  // Horizontal line between bubbles
			  lollipopChart.selectAll("myline")
				.data(data)
				.join("line")
				  .attr("x1", function(d) { return x(d.polarity_base); })
				  .attr("x2", function(d) { return x(d.polarity_women); })
				  .attr("y1", function(d) { return y(d.site_clean); })
				  .attr("y2", function(d) { return y(d.site_clean); })
				  .attr("class", "polarityCompBubbleLine")
				  .attr("stroke", "black")
				  .attr("stroke-width", "2.5px")
			
			
				 // .attr("class", "polarityCompLine")
			
			  // Circles of variable 1
			  lollipopChart.selectAll("mycircle")
				.data(data)
				.join("circle")
				  .attr("cx", function(d) { return x(d.polarity_base); })
				  .attr("cy", function(d) { return y(d.site_clean); })
				  .attr("r", "4")
				  .attr("class", "polarityCompBubbleLeft")
				  // .style("fill", "#69b3a2")
			
			  // Circles of variable 2
			  lollipopChart.selectAll("mycircle")
				.data(data)
				.join("circle")
				  .attr("cx", function(d) { return x(d.polarity_women); })
				  .attr("cy", function(d) { return y(d.site_clean); })
				  .attr("class", "polarityCompBubbleRight")
				  // size of the bubble
				  .attr("r", "11")
				  // .style("fill", "#4C4082")
	
				// text of polarity women
			  lollipopChart.selectAll("mycircle")
				.data(data)
				.join("text")
					.attr("x", d=>x(d.polarity_women))
					.attr("y", d=> y(d.site_clean))
					.attr("class", "polarityDiffAnnotation")
					// .text(d=>(d.polarity_women*100-d.polarity_base*100)/(d.polarity_base*100))
					.text(d=>((d.polarity_women-d.polarity_base)/d.polarity_base)*100>0?
								"+"+Math.round(((d.polarity_women-d.polarity_base)/d.polarity_base)*100)+"%":
								Math.round(((d.polarity_women-d.polarity_base)/d.polarity_base)*100)+"%")
	
	
				// LEGEND and axis labels
				// Horizontal line between bubbles
			lollipopChart.append("line")
				.attr("x1", 0)
				.attr("x2", 200)
				.attr("y1", -60)
				.attr("y2", -60)
				.attr("stroke", "black")
				.attr("stroke-width", "2.5px")
		  
		  
			   // .attr("class", "polarityCompLine")
		  
			// Circles of variable 1
			lollipopChart.append("circle")
				.attr("cx", 0)
				.attr("cy", -60)
				.attr("r", "4")
				.attr("class", "polarityCompBubbleLeft")
		  
			// Circles of variable 2
			lollipopChart.append("circle")
				.attr("cx", 200)
				.attr("cy", -60)
				.attr("class", "polarityCompBubbleRight")
				// size of the bubble
				.attr("r", "11")
	
			lollipopChart.append("text")
				.attr("class", "xAxisLabel")
				.attr("x", 0)
				.attr("y", -60)
				.text("All headlines")
				.attr("class", "polarityCompAllText")
						  
			  
			lollipopChart.append("text")
				.attr("class", "xAxisLabel")
				.attr("x", 200)
				.attr("y", -60)
				.text("Headlines about women")
				.attr("class", "polarityCompFemText")
				.call(wrap, 100)
	
			lollipopChart.append("text")
				.attr("class", "polarityCompxAxisLabel")
				.attr("y", -15)
				.attr("x",margin)
				.attr("dy", "1em")
				.style("text-anchor", "start")
				.text("← Less polarizing language")
						  
			  
			lollipopChart.append("text")
				.attr("class", "polarityCompxAxisLabel")
				.attr("y", -15)
				.attr("x",width)
				.attr("dy", "1em")
				.style("text-anchor", "end")
				.text("More polarizing language →")
	
	
			// sort chart by difference
			// d3.select("#sortLollipop").append("button")
			//     .text("Sort by difference") 
			d3.select("#sortLollipopDiff")
				.on("click", function(){
					// reorder site names
					// var dataSort = data.sort((a,b)=> d3.descending(+a.difference, +b.difference))
					var dataSort = data.sort((a,b)=> d3.descending(+((a.polarity_women-a.polarity_base)/a.polarity_base), +((b.polarity_women-b.polarity_base)/b.polarity_base)))

					y.domain(dataSort.map(d=>d.site_clean))
					// change axis
					lollipopChart.select(".polarityCompyAxis").transition().duration("1000").call(d3.axisLeft(y)
								.tickSize(0))                     
	
					// sort the circles
					lollipopChart.selectAll("circle")//.attr("r", 20)//the bars were added before
								// .data(data.sort((a,b)=> d3.descending(+a.difference, +b.difference)))
						.sort((a, b) => a !== undefined? d3.descending(+((a.polarity_women-a.polarity_base)/a.polarity_base), +((b.polarity_women-b.polarity_base)/b.polarity_base)):""
						).transition().duration("1000")
						.attr("cy", (d, i)=>
							
							d !== undefined?
							y(d.site_clean):"-60"//xScale is defined earlier
						)
					// sort the annotations
					lollipopChart.selectAll(".polarityDiffAnnotation")//.attr("r", 20)//the bars were added before
								// .data(data.sort((a,b)=> d3.descending(+a.difference, +b.difference)))
						.sort((a, b) => d3.descending(+((a.polarity_women-a.polarity_base)/a.polarity_base), +((b.polarity_women-b.polarity_base)/b.polarity_base)))
						.transition().duration("1000")
						.attr("y", (d, i)=> y(d.site_clean))
					// sort the lines
					lollipopChart.selectAll(".polarityCompBubbleLine")//.attr("r", 20)//the bars were added before
								// .data(data.sort((a,b)=> d3.descending(+a.difference, +b.difference)))
						.sort((a, b) => d3.descending(+((a.polarity_women-a.polarity_base)/a.polarity_base), +((b.polarity_women-b.polarity_base)/b.polarity_base)))
						.transition().duration("1000")
						.attr("x1", (d, i)=>x(d.polarity_base))
						.attr("x2", (d, i)=>x(d.polarity_women))
						.attr("y1", (d, i)=>y(d.site_clean))
						.attr("y2", (d, i)=>y(d.site_clean))
						// .attr("cy", (d, i)=>d !== undefined? y(d.site_clean):"-60"//xScale is defined earlier
						// )
					})
	
			// sort chart by polarity women
			// d3.select("#sortLollipop").append("button")
			// .text("Sort by women polarity") 
			d3.select("#sortLollipopPol")
				.on("click", function(){
					// reorder site names
					var dataSort = data.sort((a,b)=> d3.descending(+a.polarity_women, +b.polarity_women))
					y.domain(dataSort.map(d=>d.site_clean))
					// change axis
					lollipopChart.select(".polarityCompyAxis").transition().duration("1000").call(d3.axisLeft(y)
									.tickSize(0))
	
					// sort the circles
					lollipopChart.selectAll("circle")//.attr("r", 20)//the bars were added before
								// .data(data.sort((a,b)=> d3.descending(+a.difference, +b.difference)))
						.sort((a, b) => a !== undefined? d3.ascending(+a.polarity_women, +b.polarity_women):""
						).transition().duration("1000")
						.attr("cy", (d, i)=>
							
							d !== undefined?
							y(d.site_clean):"-60"//xScale is defined earlier
						)
					// sort the annotations
					lollipopChart.selectAll(".polarityDiffAnnotation")//.attr("r", 20)//the bars were added before
								// .data(data.sort((a,b)=> d3.descending(+a.difference, +b.difference)))
						.sort((a, b) => d3.ascending(+a.polarity_women, +b.polarity_women))
						.transition().duration("1000")
						.attr("y", (d, i)=> y(d.site_clean))
					// sort the lines
					lollipopChart.selectAll(".polarityCompBubbleLine")//.attr("r", 20)//the bars were added before
								// .data(data.sort((a,b)=> d3.descending(+a.difference, +b.difference)))
						.sort((a, b) => d3.ascending(+a.polarity_women, +b.polarity_women))
						.transition().duration("1000")
						.attr("x1", (d, i)=>x(d.polarity_base))
						.attr("x2", (d, i)=>x(d.polarity_women))
						.attr("y1", (d, i)=>y(d.site_clean))
						.attr("y2", (d, i)=>y(d.site_clean))
						// .attr("cy", (d, i)=>d !== undefined? y(d.site_clean):"-60"//xScale is defined earlier
						// )
					})
	
			}

			// polarity Line Chart
			function renderTimeSeries(data){
				// console.log("sent comp", data)
				data = mapToArray(d3.rollup(data, v => [d3.median(v, d=>d.women_polarity_median), d3.median(v, d=>d.all_polarity_median)], d => d.year)).filter(d=>(d.year!==2021)&&(d.year!==2016))
				console.log("sent comp", data)

				// set the dimensions and margins of the graph
				var margin = {top: 130, right: 50, bottom: 30, left: 100},
				width = 1000 - margin.left - margin.right,
				height = 800 - margin.top - margin.bottom;
			
				// append the svg object to the body of the page
				var linechart = d3.select("#polarityLineChart")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform",
					  "translate(" + margin.left + "," + margin.top + ")");

				// x scale
				const x = d3.scaleTime()
					.domain(d3.extent(data, d => d.year))
					.range([margin.left, width - margin.right])

				const y = d3.scaleLinear()
					.domain([0, d3.max(data, d=> d.womenPolarityMed)]).nice()
					.range([height - margin.bottom, margin.top])

				const xAxis = g => g
					.attr("transform", `translate(0,${height - margin.bottom})`)
					.call(d3.axisBottom(x).ticks(6).tickSizeOuter(0).tickSizeInner(0).tickFormat(d3.format("d")))
					.attr("class", "stackedChartyTicks")

				const yAxis = g => g
					.attr("transform", `translate(${margin.left},0)`).attr("class", "lineChartyAxis")
					.call(d3.axisLeft(y).tickSize(0).tickValues([0.1, 0.2, 0.3, 0.4, 0.45]))//.tickValues([0.35])
					.call(g => g.select(".domain").remove())
					// .call(g=>g.select(".tick").text(""))
					// .call(g => g.select(".tick:first-of-type text")
					.call(g => g.select(".tick:last-of-type text")//.clone()
						.attr("x", 50)
						// .attr("text-anchor", "start")
						// .attr("font-weight", "bold")
						.attr("transform", "translate(-50, 200) rotate(-90)")
						
						// .style("transform", "rotate(-90deg)")
						.text("Average polarity of news headlines ⇢"))
						.attr("class", "stackedChartyTicks")
					// .call(g => g.select(".tick:last-of-type text")
						// .style("transform", "translate(-15px, 0)"))

				const lineW = d3.line()
						.defined(d => !isNaN(d.womenPolarityMed))
						.x(d => x(d.year))
						.y(d => y(d.womenPolarityMed))
						.curve(d3.curveBasis)
				
				const lineA = d3.line()
						.defined(d => !isNaN(d.allPolarityMed))
						.x(d => x(d.year))
						.y(d => y(d.allPolarityMed))
						.curve(d3.curveBasis)

				function tweenDash() {
					const l = this.getTotalLength(),
						i = d3.interpolateString("0," + l, l + "," + l);
					return function(t) { return i(t) };
					}

				function transition(path) {
					path.transition()
						.duration(7500)
						.attrTween("stroke-dasharray", tweenDash)
						.on("end", () => { d3.select(this).call(transition); });
					}

				linechart.append("g")
				.call(xAxis);
			  
				linechart.append("g")
					.call(yAxis);

				// d3.select(".lineChartyAxis")
				// 	.selectAll(".tick")
				// 	.append("text")
				// 	.text((d, i) => i == 9 ?"Average polarity of news headlines ⇢": "")
				// 	// .text((d, i)=>console.log("ytick"+i))
				// 	// .attr("x", 0) 
				// 	// .attr("y", 0)            
				// 	.attr("class", "stackedChartyTicks")
				// 	// .attr("class", "stackedChartyTicks")
				// 	// .style("text-transform", "lowercase")
				// 	.style("font-weight", "700")
				// 	.style("transform", "rotate(-90deg)")
				// 	// .attr("dx", 50)
				
				const womenLine = linechart.append("path")
					.datum(data)
					.attr("fill", "none")
					.attr("stroke", "#53B67C")
					.attr("stroke-width", 4)
					.attr("d", lineW)
					// .call(transition);
				
				const womenCircle = linechart.append("circle")
					.attr("cx", x(d3.max(data, d=>d.year)))
					.attr("cy", y(d3.max(data, d=>d.womenPolarityMed)))
					.attr("r", "11")
					.attr("class", "polarityCompBubbleRight")

				const womenAnnot = linechart.append("text")
					.attr("x", x(d3.max(data, d=>d.year)))
					.attr("y", y(d3.max(data, d=>d.womenPolarityMed)))
					.text("Headlines about women")
					.attr("class", "polarityCompFemText")
					.call(wrap, 100)

				const allLine = linechart.append("path")
					.datum(data)
					.attr("fill", "none")
					.attr("stroke", "black")
					.attr("stroke-width", 2)
					.attr("d", lineA)
					// .call(transition);

				const allCircle = linechart.append("circle")
					.attr("cx", x(d3.max(data, d=>d.year)))
					.attr("cy", y(d3.max(data, d=>d.allPolarityMed))+8)
					.attr("r", "4")
					.attr("class", "polarityCompBubbleLeft")

				const allAnnot = linechart.append("text")
					.attr("x", x(d3.max(data, d=>d.year)))
					.attr("y", y(d3.max(data, d=>d.allPolarityMed)))
					.text("All headlines")
					.attr("class", "polarityCompAllText")

						  
						  
			}
	
			// TEMPORAL CHART
			// temporal multiples chart functions
			function renderTempChart(dataset, filter, country, variable, headlines) {

				// remove legend
				d3.selectAll(".axisThemeLegend").remove()
				// dimensions
				var margin = ({top: 150, bottom: 20, left: 40, right: 40});
				var visWidth = 1200 - margin.left - margin.right;
				var visHeight = 14000 - margin.top - margin.bottom;
				var stickyAxisHeight = 200;
				// colors
				var mainColor = "#3569DC"; //"red" //"cyan"
				var fColor = "#53B67C"
				var eColor = "#F7DC5B"
				var vColor = "#f76e45"
				var rColor = "#F2C5D3"
				var pColor = "#5787f2"
				var ntColor = "lightgrey"

				var removeWords = ["trans", "axe", "outrage", 'fraud', 'hijacking', 'injury', 'wound', 'injure', 'robbery', 'fatally', 'scream', 'crime', 'shoot', 'bail', 'fire', 'harassment', 'trap', 
				'rob', 'cop', 'fatal', 'gang', 'die', 'court', 'allege', 
				'fight', 'violent', 'steal', 'gun', 'bully', 'judge', 'murderer',
				 'risk', 'funeral', 'law', 'threat', 'plead', 'killing', 'escape',
				 'fall', 'alleged', 'convict', 'slap', 'defend', 'bust', 'prison',
				 'battle', 'war', 'accident', 'tragic', 'thug', 'jail', 'robber', 'kill',
				 'domestic' ,'sexually' ,'pregnancy' ,'feel' ,'care' ,'mama' ,'grace' ,
				 'skin' ,'body' ,'kid' ,'mum' ,'fiance' ,'lie' ,'shop' ,'actress' ,
				 'wedding' ,'widow', 'throne', 'board', 'coach', 'equal', 'launch', 'actor', 'incredible', 'worker', 'olympic', 'job', 'employee', 'work', 'campaign', 'teacher', 'parent', 'great', 'star', 'perfect'
				 , 'singer', 'celebrity', 'idol', 'tamil', 'leadership']

				var words = dataset.filter(d=>(d.year>filter[0])&&(d.year<filter[1])&&(d.country===country)&&(d.theme!=="people and places")&&(d.theme!=="important people")&&(d.theme!=="No theme")&&(!removeWords.includes(d.word)))

				// define custom sort for themes
				const sortBy = ['crime and violence', 'female stereotypes', "empowerment", 'race, ethnicity and identity']//, 'No theme']
				// console.log("words", words)

				const customSort = ({data, sortBy, sortField}) => {
					const sortByObject = sortBy.reduce((obj, item, index) => {
					  return {
						...obj,
						[item]: index
					  }
					}, {})
					return data.sort((a, b) => sortByObject[a[sortField]] - sortByObject[b[sortField]])
				  }
				  
				//   console.log(customSort({data:tasks, sortBy, sortField: 'status'}))

				words = customSort({data:words, sortBy, sortField: 'theme'})
				
				// words = words.sort((a, b) => d3.descending(a.theme, b.theme))

				// wordlist for sorting by peak after
				// function peakSort(dataRaw) {
				// 	const theme0 = dataRaw.filter(d=>d.theme===sortBy[0]).sort(
				// 	  (a,b)=>d3.ascending(a.freq_prop_headlines, b.freq_prop_headlines)).map(d=>d.word).filter(onlyUnique)
				// 	const theme1 = dataRaw.filter(d=>d.theme===sortBy[1]).sort(
				// 	  (a,b)=>d3.ascending(a.freq_prop_headlines, b.freq_prop_headlines)).map(d=>d.word).filter(onlyUnique)
				// 	const theme2 = dataRaw.filter(d=>d.theme===sortBy[2]).sort(
				// 	  (a,b)=>d3.ascending(a.freq_prop_headlines, b.freq_prop_headlines)).map(d=>d.word).filter(onlyUnique)
				// 	const theme3 = dataRaw.filter(d=>d.theme===sortBy[3]).sort(
				// 	  (a,b)=>d3.ascending(a.freq_prop_headlines, b.freq_prop_headlines)).map(d=>d.word).filter(onlyUnique)
					
					
				// 	const sortedWordList = theme0.concat(theme1, theme2, theme3)//.filter(d=>d !== undefined)
				// 	// const peakSortedData = customSort({data:dataGrouped, sortBy:sortedWordList, sortField: 'word'})
				// 	return sortedWordList
				//   }

				function peakSort(dataRaw) {
					const theme0 = d3.rollups(
					dataRaw.filter(d=>d.theme===sortBy[0]).sort(
					  (a,b)=>d3.ascending(a.freq_prop_headlines, b.freq_prop_headlines)), v => v[0].year, d => d.word).sort(
						(a, b)=>d3.ascending(a[1], b[1])).map(d=>d[0])
					
					const theme1 = d3.rollups(
					dataRaw.filter(d=>d.theme===sortBy[1]).sort(
					  (a,b)=>d3.ascending(a.freq_prop_headlines, b.freq_prop_headlines)), v => v[0].year, d => d.word).sort(
						(a, b)=>d3.ascending(a[1], b[1])).map(d=>d[0])
					
					const theme2 = d3.rollups(
					dataRaw.filter(d=>d.theme===sortBy[2]).sort(
					  (a,b)=>d3.ascending(a.freq_prop_headlines, b.freq_prop_headlines)), v => v[0].year, d => d.word).sort(
						(a, b)=>d3.ascending(a[1], b[1])).map(d=>d[0])
					
					const theme3 = d3.rollups(
					dataRaw.filter(d=>d.theme===sortBy[3]).sort(
					  (a,b)=>d3.ascending(a.freq_prop_headlines, b.freq_prop_headlines)), v => v[0].year, d => d.word).sort(
						(a, b)=>d3.ascending(a[1], b[1])).map(d=>d[0])
					
					// return theme3
					const sortedWordList = theme0.concat(theme1, theme2, theme3)//.filter(d=>d !== undefined)
					// const peakSortedData = customSort({data:dataGrouped, sortBy:sortedWordList, sortField: 'word'})
					  return sortedWordList
					// return [sortedWordList, peakSortedData]
				  }
				
				var peakSortedWordList = peakSort(words)
				// console.log("sorted word temp words")
				// console.log(peakSortedWordList)

				var numUniqueWords = d3.map(words, d=>d.word).filter(onlyUnique).length
				// console.log("unique words", numUniqueWords)
				// console.log("words")
				// console.log(words.filter(d=>d.theme==="No theme"))

				// d=>d.key.theme==="female stereotypes"?"#53B67C":
				// 	d.key.theme==="empowerment"?"#F7DC5B":
				// 	d.key.theme==="crime and violence"?"#f76e45":
				// 	d.key.theme==="race, ethnicity and identity"?"#F2C5D3":
				// 	d.key.theme==="people and places"?"#5787f2": "lightgrey")

				
				var lineThickness = 1.5; //2.5
				// structure of plots
				var cols = 1;
				var rows = numUniqueWords/cols;
				// grid data
				var grid = d3.cross(d3.range(rows), d3.range(cols), (row, col) => ({ row, col }))
	
				console.log(grid)
	
				// row/col scales
				var row = d3.scaleBand()
					.domain(d3.range(rows))
					.range([0, visHeight])
					.paddingInner(-1)
	
				var col = d3.scaleBand()
					.domain(d3.range(cols))
					.range([0, visWidth])
					.paddingInner(0.2) 
	
				// world events data
				var radius = 6
				var padding = 1.5
				var numberOfCategories = 5
				var categories = ["0", "1", "2", "3", "4"]
				var dateRange = [new Date(2010, 0).getTime(), new Date(2021, 0).getTime()];
	
			var eventsWorld = [
				{uid: 1, 
					name: "Lady Gaga ends deal with Target over anti-gay issues", 
					category: 4, 
					categories: "race, ethnicity and identity",
					date: new Date(2011, 2, 9)},
					{uid: 1, 
					 name: "Horrifying gang rape and murder in New Delhi, India", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2012, 11, 16)},
			  {uid: 1, 
					 name: "The U.S. military removes a ban against women serving in combat positions", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2013, 1, 24)},
				{uid: 1, 
				name: "On May 8, 2013, Cleveland Kidnapping Suspect Ariel Castro is charged with four counts of kidnapping and three counts of rape.", 
				category: 4, 
				categories: "crime and violence",
				date: new Date(2013, 4, 8)},
			  {uid: 1, 
					 name: "A new Pentagon report found a 50% increase in sexual assault reports in 2013", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2014, 5, 1)},
					{uid: 1, 
					 name: "Caitlyn Jenner comes out in an interview", 
					 category: 4, 
					 categories: "race, ethnicity and identity",
					 date: new Date(2015, 4, 24)},
			  {uid: 1, 
					 name: "A survey for the Department of Defense finds that in the past year 52% of active service members who reported sexual assault had experienced retaliation in the form of professional, social, and administrative actions or punishments.", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2015, 4, 18)},
			 {uid: 2, 
					 name: "People v. Turner: Brock Turner is arrested for sexually assaulting an unconscious woman", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2015, 1, 18)},
					{uid: 1, 
					 name: "#EndRapeCulture in South Africa", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2016, 4, 0)},
			  {uid: 2, 
					 name: "Hillary Clinton becomes the first woman to receive a presidential nomination from a major political party", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2016, 7, 26)},
					{uid: 3, 
					 name: "Trump: “Grab ‘em by the pussy”", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2016, 10, 8)},
			  {uid: 4, 
					 name: "People v. Turner: Brock Turner is convicted for three counts of felony sexual assault", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2016, 3, 30)},
			  {uid: 5, 
					 name: "People v. Turner: Brock Turner is released after spending 3 months in jail", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2016, 9, 2)},
					{uid: 1, 
					name: "Multiple actors, including Meryl Streep, come forward and say they were groped by Dustin Hoffman on set.", 
					category: 4, 
					categories: "crime and violence",
					date: new Date(2017, 1, 1)},
					{uid: 1, 
					 name: "#MeToo in U.S.A.", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2017, 10, 15)},
					{uid: 2, 
					 name: "Harvey Weinstein Trial", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2017, 10, 0)},
			 	{uid: 3, 
					 name: "#ChurchToo in U.S.A.", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2017, 11, 0)},
				 {uid: 4, 
					 name: "#MeTooSTEM and removal of Francisco J. Ayala from UC Irvine", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2017, 11, 0)},
					{uid: 5, 
					 name: "Release of Wonder Woman", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2017, 5, 15)},
					{uid: 6, 
					 name: "Larry Nassar U.S. Gymnastics doctor sexual assault scandal", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2017, 12, 0)},
			 {uid: 7, 
					 name: "Jessie Reyez releases “Gatekeeper”", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2017, 4, 26)},
					{uid: 8, 
					 name: "The 2017 Westminster sexual scandals in the U.K. and resignation of Sir Michael Fallon", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2017, 11, 0)},
					 {uid: 8, 
						name: "Multiple occurrences of muslim women being forced to remove Hijab in the U.S. and U.K.", 
						category: 4, 
						categories: "crime and violence",
						date: new Date(2017, 0, 0)},
					{uid: 1, 
					 name: "Meghan Markle’s wedding to Prince Harry in U.K.", 
					 category: 4, 
					 categories: "no theme",
					 date: new Date(2018, 5, 19)},
			  {uid: 2, 
					 name: "MEE TOO bill in U.S. Congress", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2018, 1, 18)},
					{uid: 3, 
					 name: "Priyanka Chopra marries Nick Jonas in India", 
					 category: 4, 
					 categories: "no theme",
					 date: new Date(2018, 12, 1)},
					{uid: 4, 
					 name: "People v. Turner: Brock Turner is convicted by jury trial of three counts of felony sexual assault", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2018, 1, 0)},
			  {uid: 5, 
					 name: "Google’s Andy Rubin sexual misconduct scandal", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2018, 10, 25)},
				  {uid: 6, 
					 name: "Global Women’s March", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2018, 1, 20)},
				  {uid: 7, 
					 name: "#MeTooMilitary in U.S.A", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2018, 1, 0)},
				  {uid: 8, 
					 name: "#MeToo in India", 
					 category: 4,
					 categories: "empowerment",
					 date: new Date(2018, 10, 0)},
				  {uid: 9, 
					 name: "Mass sexual assaults during the 2018 new year's celebrations in Bangalore", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2018, 12, 0)},
				  {uid: 10, 
					 name: "Indian actress Tanushree Dutta accuses Nana Patekar of sexual harassment", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2018, 9, 27)},
				  {uid: 11, 
					 name: "Indian minister of state for External Affairs, MJ Akbar is accused of sexual harassment by several female colleagues through the 'Me Too' Movement in India", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2018, 10, 0)},
				  {uid: 12, 
					 name: "Indian music director Anu Malik is suspended from the jury panel of Indian Idol 2018, after facing multiple allegations of sexual harassment", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2018, 10, 21)},
					{uid: 1, 
					 name: "Greta Thunberg: Climate Action Summit and sail to NYC", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2019, 8, 28)},
					{uid: 2, 
					 name: "Release of “Surviving R. Kelly” documentary", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2019, 1, 0)},
					{uid: 3, 
					 name: "Arrest of R. Kelly for 10 counts of sexual abuse against four women", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2019, 2, 0)},
					{uid: 1, 
					 name: "#SayHerName: Murder of Breonna Taylor", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2020, 3, 0)},
					{uid: 2, 
					 name: "International Women’s Cricket T20", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2020, 2, 0)},
					 {uid: 2, 
						name: "Dalit girl gangraped in Hathras, Uttar Pradesh, India", 
						category: 4, 
						categories: "crime and violence",
						date: new Date(2020, 8, 14)},
					 {uid: 2, 
						name: "Healthcare workers all over the world receive media attention for their crucial role in the COVID-19 pandemic.", 
						category: 4, 
						categories: "empowerment",
						date: new Date(2020, 4, 0)},
			 {uid: 3, 
					 name: "Rape and murder of Vanessa Guillén in U.S. military", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2020, 4, 22)},
					{uid: 1, 
					 name: "16 year old Ma'Khia Bryant is fatally shot by police officer Nicholas Reardon in Columbus, Ohio", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2021, 4, 20)},
					{uid: 2, 
					 name: "Kamala Harris is sworn in as the first woman and first woman of color vice president of the United States", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2021, 1, 20)},
					{uid: 3, 
					 name: "Oprah with Meghan and Harry and “Megxit”", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2021, 3, 7)},
			 {uid: 3, 
					 name: "Study finds that Indian women politicians face more trolling than US, UK counterparts", 
					 category: 4, 
					 categories: "no theme",
					 date: new Date(2021, 0, 24)},
			 {uid: 3, 
					 name: "40% Indian women fear online trolls as they access Internet: Nielson report", 
					 category: 4, 
					 categories: "no theme",
					 date: new Date(2019, 11, 17)},
			 {uid: 3, 
					 name: "Indian central government passes the Citizenship Amendment Act, by providing a pathway to Indian citizenship for persecuted religious minorities from Afghanistan, Bangladesh and Pakistan who are Hindus, Sikhs, Buddhists, Jains, Parsis or Christians, and arrived in India before the end of December 2014", 
					 category: 4, 
					 categories: "race, ethnicity and identity",
					 date: new Date(2019, 11, 12)},
			 {uid: 3, 
					 name: "India saw, for the first time, a sustained countrywide movement led by Women against the CAA-NRC bills", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2020, 0, 13)},
			 {uid: 3, 
					 name: "defamation case filed by former Union minister M J Akbar's against journalist Priya Ramani who had accused him of sexual harassment", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2021, 4, 5)},
			 {uid: 3, 
					 name: "A majority judgement which declared the prohibition of entry of women aged between 10 and 50 into Sabarimala temple, as unconstitutional and discriminatory", 
					 category: 4, 
					 categories: "race, ethnicity and identity",
					 date: new Date(2018, 8, 28)},
			 {uid: 3, 
					 name: "An Indian Supreme Court Bench declared muslim instantaneous divorce, triple Talaq, as unconstitutional", 
					 category: 4, 
					 categories: "race, ethnicity and identity",
					 date: new Date(2019, 6, 31)},
			 {uid: 3, 
					 name: "Indian court grants bail to Nupur Talwar, a dentist accused in the twin murder of her daughter and domestic help", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2019, 6, 31)},
			 {uid: 3, 
					 name: "Kanimozhi Karunanidhi, Member of Parliament, accused in 2G scam, refused bail", 
					 category: 4, 
					 categories: "no theme",
					 date: new Date(2011, 4, 11)},
			 {uid: 3, 
					 name: "Accused who set fire to the rape survivor from Unnao, Uttar Pradesh, India, out on bail", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2019, 11, 5)},
					 {uid: 3, 
						name: "Saudi Arabia lifts travel restrictions on its women", 
						category: 4, 
						categories: "empowerment",
						date: new Date(2019, 7, 2)},
					{uid: 3, 
						name: "Saudi Arabia makes it legal for women to drive", 
						category: 4, 
						categories: "empowerment",
						date: new Date(2018, 5, 24)},
			 {uid: 3, 
					 name: "Multiple women enter inner sanctum of temples across the country, after protest", 
					 category: 4, 
					 categories: "race, ethnicity and identity",
					 date: new Date(2016, 2, 3)},
			 {uid: 3, 
					 name: "Section 377: Indian Supreme Court legalizes consensual sexual conduct between adults of the same sex", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2018, 8, 6)},
			 {uid: 3, 
					 name: "Women’s Cricket World Cup 2017", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2017, 5, 23)},
			 {uid: 3, 
					 name: "The Marikana massacre was the killing of 34 miners by the South African Police Service (SAPS). It took place on 16 August 2012, and was the most lethal use of force by South African security forces against civilians since 1976.", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2012, 7, 16)},
			 {uid: 3, 
					 name: "On 11 April 2015, several South Africans attacked foreigners in a xenophobic attack in Durban, South Africa, which extended to some parts of Johannesburg. Several people, both foreign and South African alike, were killed with some of the killings captured on camera.", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2015, 3, 11)},
			 {uid: 3, 
					 name: "Brutal gang rape and subsequent death of South African teenager", 
					 category: 4, 
					 categories: "crime and violence",
					 date: new Date(2013, 1, 2)},
			 {uid: 3, 
					 name: "Monica Lewinsky breaks decade-long media silence", 
					 category: 4, 
					 categories: "empowerment",
					 date: new Date(2014, 4, 6)}
			  
			 ]
			 
				words = words.map(d=> {
					return {
						year: d.year,
						frequency: d[variable],
						word: d.word,
						word_type: d.word_type,
						theme: d.theme
					}
				})

				// console.log("words map", words.filter(d=>d.theme==="No theme"))
	
				var freqByWord = d3.rollup(
					words,
					g => g.map(({ year, frequency}) => ({date: new Date(year, 0, 1), frequency})),
					d => d.word,
					// e => e.frequency//words.filter(c=>(c.word>d.word)&&(c.year==filter[1]))['frequency'],
	
				)

				// console.log("datatosort", freqByWord)
	
				// topWords = d3.sort(freqByWord, d=>-d.frequency).filter(function(d,i){ return i<50 })
				
				// add grid data to word data
				var data = d3.zip(
					customSort({data:Array.from(freqByWord), sortBy: peakSortedWordList, sortField:"0"}), grid).map(
					([[word, rates], { row, col }]) => ({
					word,
					rates,
					row,
					col,
					})
				)
				// console.log("final word temp data")
				// console.log(data)

				

				// var dataSorted = customSort({data, sortBy: peakSortedWordList, sortField:"word"})
				// console.log("sorted word temp data")
				// console.log(dataSorted)
	
				// same x-scale for all charts
				var minDate = data[0].rates[0].date
				var maxDate = data[0].rates[data[0].rates.length - 1].date
				// maxDate = new Date(2021, 6, 0)
	
				var x = d3.scaleTime()
					.domain([minDate, maxDate])
					.range([0, col.bandwidth()])
	
				// function to calculate y-scale and area generator depending on the word
				var wordToScaleAndArea = Object.fromEntries(
					data.map(d => {
					const maxRate = d3.max(d.rates, d => d.frequency);
					// console.log(maxRate)
					const y = d3.scaleLinear()
						.domain([0, maxRate])
						.range([row.bandwidth(), 0]).nice();
					
					var curve = d3.curveMonotoneX // d3.curveBasis
					const area = d3.area()
						.x(d => x(d.date))
						.y1(d => y(d.frequency))
						.y0(d => y(0)).curve(d3.curveMonotoneX);
	
					
					const line = d3.line()
						.x(d => x(d.date))
						.y(d => y(d.frequency)).curve(d3.curveMonotoneX);
	
					
					return [d.word, {y, area, line}];
					})
				)
	
				// console.log(words)
				// console.log(freqByWord)
				// console.log(data)
				// console.log(minDate, maxDate)
				// console.log(wordToScaleAndArea)
	
				// draw the chart
				// create and select an svg element that is the size of the bars plus margins 
				const svg = d3.select("div#smChart")
					.append("svg")
					.attr("class", "mainContainer")
					.attr('width', visWidth + margin.left + margin.right)
					.attr('height', visHeight + margin.top + margin.bottom);
					
					// .attr("preserveAspectRatio", "xMinYMin meet")
					// .attr("viewBox", "0 0 "+ (visWidth + margin.left + margin.right) +"," + (visHeight + margin.top + margin.bottom) +"")
				
				// Gradient definition (not ideal, using HTML). TODO: refactor
				// svg.append('defs')
				// .html(`<linearGradient id="Gradient2">
				//         <stop offset="30%" stop-color="hsl(120, 50%, 50%)"/>
				//         <stop offset="70%" stop-color="hsl(70, 80%, 50%)"/>
				//         <stop offset="80%" stop-color="hsl(60, 80%, 50%)"/>
				//         <stop offset="100%" stop-color="hsl(10, 50%, 50%)"/>
				//         </linearGradient>`)
	
				var defs = svg.append("defs");
				// female stereotypes
				var linearGradientF = defs.append("linearGradient").attr("id", "linear-gradient-F");
				linearGradientF
					.attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
				linearGradientF.append("stop").attr("offset", "0%").attr("stop-color", fColor);
					// .attr("stop-color", "hsl(10, 100%, 50%)");
				linearGradientF.append("stop").attr("offset", "90%").attr("stop-color", "#FEFAF1");//#202020
				linearGradientF.append("stop").attr("offset", "100%").attr("stop-color", "#FEFAF1") //#161616
					// .attr("opacity", 0.1);
				
				// violence
				var linearGradientV = defs.append("linearGradient").attr("id", "linear-gradient-V");
				linearGradientV
					.attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
				linearGradientV.append("stop").attr("offset", "0%").attr("stop-color", vColor);
					// .attr("stop-color", "hsl(10, 100%, 50%)");
				linearGradientV.append("stop").attr("offset", "90%").attr("stop-color", "#FEFAF1");//#202020
				linearGradientV.append("stop").attr("offset", "100%").attr("stop-color", "#FEFAF1") //#161616

				// empowerment
				var linearGradientE = defs.append("linearGradient").attr("id", "linear-gradient-E");
				linearGradientE
					.attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
				linearGradientE.append("stop").attr("offset", "0%").attr("stop-color", eColor);
					// .attr("stop-color", "hsl(10, 100%, 50%)");
				linearGradientE.append("stop").attr("offset", "90%").attr("stop-color", "#FEFAF1");//#202020
				linearGradientE.append("stop").attr("offset", "100%").attr("stop-color", "#FEFAF1") //#161616

				// race
				var linearGradientR = defs.append("linearGradient").attr("id", "linear-gradient-R");
				linearGradientR
					.attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
				linearGradientR.append("stop").attr("offset", "0%").attr("stop-color", rColor);
					// .attr("stop-color", "hsl(10, 100%, 50%)");
				linearGradientR.append("stop").attr("offset", "90%").attr("stop-color", "#FEFAF1");//#202020
				linearGradientR.append("stop").attr("offset", "100%").attr("stop-color", "#FEFAF1") //#161616

				// people and places
				var linearGradientP = defs.append("linearGradient").attr("id", "linear-gradient-P");
				linearGradientP
					.attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
				linearGradientP.append("stop").attr("offset", "0%").attr("stop-color", pColor);
					// .attr("stop-color", "hsl(10, 100%, 50%)");
				linearGradientP.append("stop").attr("offset", "90%").attr("stop-color", "#FEFAF1");//#202020
				linearGradientP.append("stop").attr("offset", "100%").attr("stop-color", "#FEFAF1") //#161616

				// no theme
				var linearGradientNT = defs.append("linearGradient").attr("id", "linear-gradient-NT");
				linearGradientNT
					.attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
				linearGradientNT.append("stop").attr("offset", "0%").attr("stop-color", ntColor);
					// .attr("stop-color", "hsl(10, 100%, 50%)");
				linearGradientNT.append("stop").attr("offset", "90%").attr("stop-color", "#FEFAF1");//#202020
				linearGradientNT.append("stop").attr("offset", "100%").attr("stop-color", "#FEFAF1") //#161616

				// d=>d.key.theme==="female stereotypes"?"#53B67C":
				// 	d.key.theme==="empowerment"?"#F7DC5B":
				// 	d.key.theme==="crime and violence"?"#f76e45":
				// 	d.key.theme==="race, ethnicity and identity"?"#F2C5D3":
				// 	d.key.theme==="people and places"?"#5787f2": "lightgrey")
				
	
				// append a group element and move it left and down to create space
				// for the left and top margins
				const g = svg.append("g")
					.attr('transform', `translate(${margin.left}, ${margin.top/3})`);
	
				// create a group for each small multiple
				const cells = g.append('g')
					.selectAll('g')
					.data(data)
					.join('g')
					// .attr('class', 'cell')
					.attr("class", d=> words.filter(c=>c.word===d.word)[0].theme==="female stereotypes"?"biasCells":
										words.filter(c=>c.word===d.word)[0].theme==="empowerment"?"empCells":
										words.filter(c=>c.word===d.word)[0].theme==="crime and violence"?"crimeCells":
										words.filter(c=>c.word===d.word)[0].theme==="race, ethnicity and identity"?"raceCells":
										words.filter(c=>c.word===d.word)[0].theme==="important people"?"peopleCells": "ntCells")
					.attr('transform', d => `translate(${col(d.col)}, ${row(d.row)})`);

				// console.log("word temp data", data)
	
				// add the area to each cell
				cells.append('path')
					// access the area generator for this word
					.attr('d', d => wordToScaleAndArea[d.word].area(d.rates))
					// .attr('fill', "url(#Gradient2)")
					.attr('fill', d=>words.filter(c=>c.word===d.word)[0].theme==="female stereotypes"?"url(#linear-gradient-F)":
									words.filter(c=>c.word===d.word)[0].theme==="empowerment"?"url(#linear-gradient-E)":
									words.filter(c=>c.word===d.word)[0].theme==="crime and violence"?"url(#linear-gradient-V)":
									words.filter(c=>c.word===d.word)[0].theme==="race, ethnicity and identity"?"url(#linear-gradient-R)":
									words.filter(c=>c.word===d.word)[0].theme==="important people"?"url(#linear-gradient-P)": "url(#linear-gradient-NT)")
					// .attr('fill', mainColor)
					.attr('opacity', 0.5)
					.attr("class", "wordArea")
					.attr("id", d=> 'area'+ d.word)
					.on("mouseover", (event, d) => showTooltip(event, d))
					.on("mouseleave", (event, d) => hideTooltip(event, d))
					.on("mouseenter", (event, d) => {
						showTooltipHeadlineMatch([event.clientX, event.clientY], headlines, d.word)
					})
					.on("mousemove", (event, d) => {
						showTooltipHeadlineMatch([event.clientX, event.clientY], headlines, d.word)
					})
					.on("mouseleave.hl", (event, d) => {
						d3.select("#tooltipHeadline").style("display", "none")
					})
					// .attr('fill', 'red');
	
				cells.append('path')
					// .attr('stroke', 'black')
					.style("stroke", d=>words.filter(c=>c.word===d.word)[0].theme==="female stereotypes"?"url(#linear-gradient-F)":
										words.filter(c=>c.word===d.word)[0].theme==="empowerment"?"url(#linear-gradient-E)":
										words.filter(c=>c.word===d.word)[0].theme==="crime and violence"?"url(#linear-gradient-V)":
										words.filter(c=>c.word===d.word)[0].theme==="race, ethnicity and identity"?"url(#linear-gradient-R)":
										words.filter(c=>c.word===d.word)[0].theme==="important people"?"url(#linear-gradient-P)": "url(#linear-gradient-NT)")
					// .style("stroke", mainColor) // .style("stroke", "url(#linear-gradient)")
					.attr('stroke-width', lineThickness)
					.attr('fill', 'none')
					.attr("class", "wordLine")
					.attr("id", d=> 'line'+ d.word)  
					.attr('d', d => wordToScaleAndArea[d.word].line(d.rates)) 
					.on("mouseover", (event, d) => showTooltip(event, d))
					.on("mouseleave", (event, d) => hideTooltip(event, d))
				
				// append the x axis once on top of the chart
	
				const xaxis = d3.axisBottom(x)
						.ticks(10)
						.tickSizeOuter(0)
						.tickSizeInner(0)
						.tickPadding(30)
						.tickFormat((d, i) => i == 0 || i == 3 || i == 6 || i == 9 || i == 11 ? d3.timeFormat('%Y')(new Date(d)):                                
											"");
											
											//.tickFormat(d3.format(".0s"))

				const axisThemeLegend = d3.select("div#stickyXaxis")
					.append("div")
					// .attr("width", "100")
					// .attr("height", "10")
					.attr("class", "axisThemeLegend")

					
				const themesNames = [{name:"Crime and Violence", id:"inTextViolence", width:"150px"}, 
									 {name:"Gendered Language", id:"inTextBias", width:"150px"}, 
									 {name:"Empowerment", id:"inTextEmpowerment", width:"110px"}, 
									//  {name:"People and Places", id:"inTextPeople", width:"140px"}, 
									 {name:"Race, Ethnicity and Identity", id:"inTextRace", width:"200px"}]
									//  {name:"Other", id:"inTextNT", width:"60px"}]

				themesNames.map(d=>axisThemeLegend
									.append("text")
									.text(d.name)
									.attr("class", "stackedBarThemeAnnotation")
									.style("max-width", d.width)
									.style("margin", "5px")
									.attr("id", d.id)
									// .call(wrap, 100)
									)
				// axisThemeLegend
				// 	.append("text")
				// 	.text("some text")

				
	
				const stickyAxis = d3.select("div#stickyXaxis").append("svg")
					// .attr('transform', `translate(${margin.left}, ${margin.top})`)
					.attr('transform', `translate(${margin.left}, 0)`)
					.attr('width', visWidth + margin.left + margin.right)
					.attr('height', stickyAxisHeight)
					// .attr("preserveAspectRatio", "xMinYMin meet")
					// .attr("viewBox", "0 0 "+ (visWidth + margin.left + margin.right) +"," + (stickyAxisHeight) +"")
					.attr("class", "stickyAxis");

	
				// g.append("g")
				stickyAxis.append("g")
						.attr('transform', `translate(${col(0)}, ${margin.top})`)
						// .attr('transform', `translate(${margin.left}, ${margin.top})`)
						.call(xaxis)
						// .attr("class", "SMaxisSticky")
						.call(g=>g.selectAll(".tick")
						// .attr("color", (d, i) => i == 0 || i == 9 ? "grey": "none")
						// .attr("opacity", (d, i) => i == 0 ||  i == 9 ? 1: 0)
						// .attr("color", "grey")
						// .attr('stroke-width', 2)
						// .attr("font-weight", 800)
						// .attr("font-size", 12)
						)
						.call(g => g.select('.domain').attr('stroke-width', 2).attr("color", "#282828"))//.attr("color", "grey")
						// .call(g => g.select('.domain').remove())
	
				// annotation on the left
				stickyAxis.append("g")
						.attr('transform', `translate(${col(0)}, ${margin.top})`)
							.append("text")
							.text("News Events")
							.attr("class", "annotation")
							.attr("font-weight", "400")
							.attr("x", -20)
							.attr("y", -4)
	
				// circles for timeline
				const circleEvents = 
						// g.append("g")
						stickyAxis.append("g")
								.attr('transform', `translate(${col(0)}, ${margin.top})`)
								.selectAll("circle")
								.data(dodge(eventsWorld.filter(d=>d.date<=maxDate), {radius: radius * 2 + padding, x: d => x(d.date)}))
	
				console.log("events", dodge(eventsWorld, {radius: radius * 2 + padding, x: d => x(d.date)}))
	
				const circles = circleEvents
								.join("circle")
								.attr("cx", d => d.x)
								.attr("cy", d =>  d.y)
								// .attr("fill", mainColor)
								// .attr("fill", "lightgrey")
								.attr("fill", d=>
									d.data.categories==="empowerment"?"#F7DC5B":
									d.data.categories==="crime and violence"?"#f76e45":
									d.data.categories==="race, ethnicity and identity"?"#F2C5D3":
									d.data.categories==="people and places"?"#5787f2": "lightgrey")
								.attr("stroke",  d=>
									d.data.categories==="empowerment"?"#F7DC5B":
									d.data.categories==="crime and violence"?"#f76e45":
									d.data.categories==="race, ethnicity and identity"?"#F2C5D3":
									d.data.categories==="people and places"?"#5787f2": "lightgrey")
								.attr("stroke-width", "1.2")
								.attr("stroke-opacity", d=>d.data.categories==="people and places"?"1": "0.8")
								.attr("r", radius)
								.attr("fill-opacity", d=>d.data.categories==="people and places"?"0.8": "0.5")
								.on("mouseover", (event, d) => timeRuler(event, d.data, g, svg, col, minDate, maxDate, visHeight, x))
								.on("mouseleave", (event, d) => {
												d3.selectAll(".timeRuler").remove()
												tooltip
														.transition()
														.duration(500)
														.style("opacity", 0)
													}
														)
	
	
				// add the y axis for each cell
				cells.each(function(d) {
					// select the group for this cell
					const group = d3.select(this)
									// .attr("class", "SMCell")
								    .attr("id", d=>"cell"+d.word);
	
					// get the y-scale for this industry
					const yaxis = d3.axisLeft(wordToScaleAndArea[d.word].y)
						.ticks(2)
						.tickSizeOuter(0)
						// .tickSizeInner((d, i) => i == 0 ? 0: 10)
						// .tickFormat((d, i) => i == 0 ? "": d);
	
						// .tickFormat((d, i) => i == 0 || i == 2 ? d: "");
					
					// const xaxis = d3.axisBottom(x)
					//     .ticks(7)
					//     .tickSizeOuter(0)
					//     .tickFormat((d, i) => i == 0 || i == 9 ? d3.timeFormat('%Y')(new Date(d)): "");//.tickFormat(d3.format(".0s"))
					
					// group.call(yaxis)
					//      .call(g=>g.selectAll(".tick").attr("color", "grey"))
					//      .call(g => g.select('.domain').remove())
						//  .call(g =>
						//     g
						//       .select(".tick:last-of-type text")
						//       .clone()
						//       .attr("x", col.bandwidth()/2)
						//     //   .attr("y", +30)
						//       .attr("text-anchor", "start")
						//       .attr("font-weight", 800)
						//       // .attr("font-weight", "bold")
						//     //   .text("↑ more frequent"))
						//     .text(d.word))
	
					
					// group.append("g")
					//      .attr("transform", `translate(0,${row.bandwidth()})`)
					//      .call(xaxis).attr("class", "SMaxis")
					//      .call(g=>g.selectAll(".tick")
					//         .attr("color", (d, i) => i == 0 || i == 9 ? "grey": "none")
					//         .attr("font-weight", 500))
					//      .call(g => g.select('.domain').remove())
	
	
					group.append("g").attr("class", "catLabel").append("text")
					.attr("x", -10)
					.attr("y", row.bandwidth()*0.5)
					.attr("class", "wordText")
					.attr("id", d=> 'text'+ d.word) 
					.text(d.word)
					.on("mouseover", (event, d) => showTooltip(event, d))
					.on("mouseleave", (event, d) => hideTooltip(event, d))
			});
	
			}
	
			function timeRuler(event, d, g, svg, col, minDate, maxDate, visHeight, x) {

				//console.log(data[0].rates[0].date, "data in temporal chart")

				var margin = ({top: 150, bottom: 20, left: 40, right: 40});

				// let minDate = data[0].rates[0].date
				// var maxDate = data[0].rates[data[0].rates.length - 1].date

				var x = d3.scaleTime()
					.domain([minDate, maxDate])
					.range([0, col.bandwidth()])
		
	
				const rulerg = g//.append("g")
								.append("rect")
								.attr("class", "timeRuler")
								.attr('transform', `translate(${col(0)}, -${margin.top/3})`)
								.attr("x", x(d.date)-9)
								.attr("y", 0)
								.attr("width", 20)
								.attr("height", visHeight)
	
								console.log(d.date)
			
				// rect dimensions
				const boxWidth = 200
				const boxHeight = 100
				
				tooltip
					.transition()
					.duration(0)
					.style("opacity", 1)
					.style("width", boxWidth)
					.style("height", boxHeight)
					
				tooltip
					// .html(`<b>${d.title}</b><br>
					// <b>${format(+d[metric_t])+"</b> "+legend_label_t.toLowerCase()}<br>
					// <b>${format(+d[metric_p])+"</b> "+legend_label_p.toLowerCase()}`)
					.html(`<span class="datettip">${d3.timeFormat("%b %Y")(d.date)}</span><br>
					<i>${(d.name)}`)
					.attr('transform', `translate(${-col(0)*3}, -${margin.top/3})`)
					.style("left", x(new Date("01-01-2025")))
					.style("top", event.pageY + "px")
					.attr("class", "tooltipTemp")

				
			
				// const textBox = g.append("g")
				//                   .append("rect")
				//                   .attr('transform', `translate(${col(0)}, -${d.uid * 12 + margin.top/1.5})`)
				//                   .attr("x", x(d.date)-boxWidth/2)
				//                   .attr("y", 0)
				//                   .attr("width", boxWidth)
				//                   .attr("height", boxHeight)
				//                 //   .attr("fill", "grey")
				//                 //   .attr("fill", "none")
				//                   .attr("stroke", "grey")
				//                   .attr("opacity", 0.5)
				//                 //   .attr("class", "timeRuler")
			
				// const text = g.append("g")
				//                     .append("text")
				//                     .text(d.name)
				//                     .attr("x", x(d.date)-boxWidth/2)
				//                     .attr("y", 0)
				//                     // .attr("font-family", "Georgia")
				//                     .attr("font-size", "12px")
				//                     .style("color", "white")
			}
			
			// function for beeswarm timeline
			function dodge(data, {radius = 1, x = d => d} = {}) {
				const radius2 = radius ** 2;
				const circles = data.map((d, i) => ({x: +x(d, i, data), data: d})).sort((a, b) => a.x - b.x);
				const epsilon = 1e-3;
				let head = null, tail = null;
			  
				// Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
				function intersects(x, y) {
				  let a = head;
				  while (a) {
					if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
					  return true;
					}
					a = a.next;
				  }
				  return false;
				}
			  
				// Place each circle sequentially.
				for (const b of circles) {
			  
				  // Remove circles from the queue that can’t intersect the new circle b.
				  while (head && head.x < b.x - radius2) head = head.next;
			  
				  // Choose the minimum non-intersecting tangent.
				  if (intersects(b.x, b.y = 0)) {
					let a = head;
					b.y = Infinity;
					do {
					  let y1 = a.y + Math.sqrt(radius2 - (a.x - b.x) ** 2);
					  let y2 = a.y - Math.sqrt(radius2 - (a.x - b.x) ** 2);
					  if (Math.abs(y1) < Math.abs(b.y) && !intersects(b.x, y1)) b.y = y1;
					  if (Math.abs(y2) < Math.abs(b.y) && !intersects(b.x, y2)) b.y = y2;
					  a = a.next;
					} while (a);
				  }
			  
				  // Add b to the queue.
				  b.next = null;
				  if (head === null) head = tail = b;
				  else tail = tail.next = b;
				}
			  
				return circles;
			}
			// tooltip functions
			//// area charts hover
			function showTooltip(event, d) {

				console.log("entered show tooltip in temporal chart")
				
				d3.selectAll(".wordArea").attr("opacity", 0.15)
				d3.selectAll(".wordLine").attr("opacity", 0.3)
				d3.selectAll(".wordText").attr("opacity", 0.3)
				// console.log(d3.max(d.rates, c=>c.date))
				// console.log(d3.max(d.rates, c=>c.frequency))
				console.log(d.rates)
				console.log(d.rates[d.rates.length-1].frequency)
	
				const endDate = d3.max(d.rates, c=>c.date)
				const endFreq = d.rates[d.rates.length-1].frequency
				const startFreq = 0.00001 + d.rates[0].frequency
				const percFreqInc = ((endFreq-startFreq)/startFreq)*100
	
				d3.select('#area'+ d.word)
					.attr("opacity", 0.85)
				d3.select('#line'+ d.word)
					.attr("opacity", 1)
				d3.select('#text'+ d.word)
					.attr("opacity", 1)
				// % increase/decrease text
				// d3.//.select('#line'+ d.word).append("g")
				// select('#cell'+ d.word)
				//     .append("text")
				//     .text(percFreqInc>0? "+" + percFreqInc.toFixed(0) + "%": percFreqInc.toFixed(0)+ "%")
				//     .attr("fill", "grey")
				//     .attr("font-weight", 800)
				//     .style("font-size", 12)
				//     .style("font-family", "sans-serif")
				//     .attr("class", "wordText")
				//     .attr("x", x(endDate)+5)
				//     .attr("y", wordToScaleAndArea[d.word].y(endFreq))
				//     .attr("class", "incText")
	
			}
	
			function hideTooltip(event, d) {
				d3.selectAll(".wordArea").attr("opacity", 0.5)
				d3.selectAll(".wordLine").attr("opacity", 1)
				d3.selectAll(".wordText").attr("opacity", 1)
				d3.selectAll(".incText").remove()
			}

			function showTooltipHeadlineMatch(coords, data, word) {
				// set position of tooltip
				let x = coords[0]-120;
				let y = coords[1]-200;
	
				// console.log(word)
				// console.log(data)
				// remove previous text: 
				// tooltipHeadline.selectAll("#tooltipText").remove()
				tooltipHeadline.selectAll(".deets").remove()
				tooltipHeadline.selectAll(".headline").remove()

				// create box
				tooltipHeadline
					.style("display", "block")
					.style("visibility", "visible")
					.style("top", y + "px")
					.style("left", x + "px")
					// .attr("class", ".tooltipTL")
					// .style("border", "solid 1px #282828")
	
				// remove hoverGuide
				// d3.select("#hoverGuide").remove()
				// d3.select("#hoverGuideLine").remove()
	
				// filter data for any headline that matches the word
				data = data.filter(d=>d.headline_no_site.match(word))

				// data = (c.bias>0.5)&&(data.filter(d=>(d.site === text1)&(d.bias > 0.5)).length>10)?
				// 		 data.filter(d=>(d.site === text1)&(d.bias > 0.5)):
				// 	   (c.bias<0.5)&&(data.filter(d=>(d.site === text1)&(d.bias < 0.5)).length>10)?
				// 		 data.filter(d=>(d.site === text1)&(d.bias < 0.5)):
				// 		 data.filter(d=>(d.site === text1))
	
				// console.log(data)
	
				// find a random headline
				let randHeadline = Math.floor(Math.random() * data.length)
				// console.log(d3.timeFormat("%d/%m/%Y")(new Date(data[randHeadline].time)))
				// console.log(data[randHeadline].subtitle)
	
				// tooltip dimensions
				let ttipMargin = { left: 40, bottom: 110, right: 20, top: 20 }
				let ttipWidth = width5/7 - ttipMargin.left - ttipMargin.right;
				let ttipHeight =height5/2.5 - ttipMargin.top - ttipMargin.bottom;
		
				// below we define the tooltip appearance and contents
				let hlDate = tooltipHeadline.append("text")
					// .attr("id", "tooltipText")
					.attr("class", "deets")
					.attr("y", ttipHeight/4)
					.attr("x", 0)
					// .attr("font-size", "11px")
					.attr("font-weight", "900")
					// .style("text-transform", "uppercase")
					.attr("fill", "#E75C33")
					.html("<span class='datettip'>"+d3.timeFormat("%b %Y")(new Date(data[randHeadline].time)) + " | " + data[randHeadline].site+"</span>")
					// .html('"' + data[randHeadline].subtitle + '..."')
					.call(wrap, 300)

				
				// let headlineWords = data[randHeadline].headline_no_site.split(" ")
				let headlineWords = data[randHeadline].headline_no_site.split(" ").map(d=>d.match(word)? `<b>${d}</b>`:d)
				// headlineWords = html`headlineWords.join(" ")`

				// console.log(headlineWords, headlineWords.join(" "))

				// let hlContent = tooltipHeadline.append("svg")//.attr("height", ttipHeight).attr("width", ttipWidth)
				// 				.append("text")

				// let hlWords = hlContent.selectAll("tspan")
				// 	.data(headlineWords)
				// 	.enter()
				// 	.append("tspan")
				// 	// .attr("id", "tooltipText")
					
				// let hlText = hlWords
				// 	.attr("class", "headline")
				// 	.attr("y", ttipHeight/1.2)
				// 	.attr("x", 0)
				// 	// .attr("x", (d, i)=>headlineWords[i-1])
				// 	// .attr("font-weight", "bold")
				// 	// .attr("font-size", "14px")
				// 	.style("text-transform", "uppercase")
				// 	// // .attr("fill", party==="red" ? '#DD1F26':'#0076C0')
				// 	.attr("fill", "#282828")
				// 	.html(function (d) { return d + ' '; })
				// 	// .html(d=>`<span>${d}</span>`)
				// 	// .html("<b>" + '"' + data[randHeadline].headline_no_site + '"')
				// 	// .call(wrap, 300)

				tooltipHeadline.append("foreignObject")
					// .attr("id", "tooltipText")
					.attr("class", "headline")

					.attr("y", ttipHeight*0.4)
					.attr("x", 0)
					.attr("width", ttipWidth*1.8)
 					 .attr("height", ttipHeight)
					// .attr("font-weight", "bold")
					.attr("font-size", "14px")
					.style("text-transform", "uppercase")
					// .attr("fill", party==="red" ? '#DD1F26':'#0076C0')
					.attr("fill", "#282828")
					.html(`<div>${headlineWords.join(" ")}</div>`)
					// .call(wrap, 300)
	
				// tooltipHeadline.append("text")
				// 	// .attr("id", "tooltipText")
				// 	.attr("class", "headline")

				// 	.attr("y", ttipHeight/1.2)
				// 	.attr("x", 0)
				// 	// .attr("font-weight", "bold")
				// 	.attr("font-size", "14px")
				// 	.style("text-transform", "uppercase")
				// 	// .attr("fill", party==="red" ? '#DD1F26':'#0076C0')
				// 	.attr("fill", "#282828")
				// 	.html("<b>" + '"' + data[randHeadline].headline_no_site + '"')
				// 	.call(wrap, 300)

			//    console.log(tooltipHeadline.selectAll("text.headline").style("font-weight", d=>console.log(d)))//.match(word)?"900":"300")
	
			}
	
			// BUBBLE CHART
			// tooltip function for the bubble chart
			function showTooltipHeadline(ttip, text1, text2, text3, coords, data, polarity, c) {
				// set position of tooltip
				let x = coords[0]-120;
				let y = coords[1]-200;
	
				// console.log(c)
				// console.log(data)
				// remove previous text: 
				// tooltipHeadline.selectAll("#tooltipText").remove()
				tooltipHeadline.selectAll(".deets").remove()
				tooltipHeadline.selectAll(".headline").remove()

				// create box
				tooltipHeadline
					.style("display", "block")
					.style("visibility", "visible")
					.style("top", y + "px")
					.style("left", x + "px")
					// .attr("class", ".tooltipTL")
					// .style("border", "solid 1px #282828")
	
				// remove hoverGuide
				d3.select("#hoverGuide").remove()
				d3.select("#hoverGuideLine").remove()
	
				// filter data depending on where the user is along x-scale
				// data = c.bias>0.5?data.filter(d=>(d.site === text1)&(d.bias > 0.5)):
				// 		 data.filter(d=>(d.site === text1)&(d.bias < 0.5))

				data = (c.bias>0.5)&&(data.filter(d=>(d.site === text1)&(d.bias > 0.5)).length>10)?
						 data.filter(d=>(d.site === text1)&(d.bias > 0.5)):
					   (c.bias<0.5)&&(data.filter(d=>(d.site === text1)&(d.bias < 0.5)).length>10)?
						 data.filter(d=>(d.site === text1)&(d.bias < 0.5)):
						 data.filter(d=>(d.site === text1))
	
				// console.log(data)
	
				// find a random headline
				let randHeadline = Math.floor(Math.random() * data.length)
				// console.log(d3.timeFormat("%d/%m/%Y")(new Date(data[randHeadline].time)))
				// console.log(data[randHeadline].subtitle)
	
				// tooltip dimensions
				let ttipMargin = { left: 40, bottom: 110, right: 20, top: 20 }
				let ttipWidth = width5/7 - ttipMargin.left - ttipMargin.right;
				let ttipHeight =height5/2.5 - ttipMargin.top - ttipMargin.bottom;
		
				// below we define the tooltip appearance and contents
				tooltipHeadline.append("text")
					// .attr("id", "tooltipText")
					.attr("class", "deets")
					.attr("y", ttipHeight/4)
					.attr("x", 0)
					// .attr("font-size", "11px")
					.attr("font-weight", "900")
					// .style("text-transform", "uppercase")
					.attr("fill", "#E75C33")
					.html("<span class='datettip'>"+d3.timeFormat("%b %Y")(new Date(data[randHeadline].time)) + " | " + data[randHeadline].site+"</span>")
					// .html('"' + data[randHeadline].subtitle + '..."')
					.call(wrap, 300)
	
				// tooltipHeadline.append("text")
				//     .attr("id", "tooltipText")
				//     .attr("y", ttipHeight/4)
				//     .attr("x", 0)
				//     .attr("font-size", "12px")
				//     .attr("font-weight", "bold")
				//     .attr("fill", "#282828")
				//     .html("<b>" + data[randHeadline].site)
				//     .call(wrap, 300)
	
				tooltipHeadline.append("text")
					// .attr("id", "tooltipText")
					.attr("class", "headline")

					.attr("y", ttipHeight/1.2)
					.attr("x", 0)
					// .attr("font-weight", "bold")
					.attr("font-size", "14px")
					.style("text-transform", "uppercase")
					// .attr("fill", party==="red" ? '#DD1F26':'#0076C0')
					.attr("fill", "#282828")
					.html("<b>" + '"' + data[randHeadline].headline_no_site + '"')
					.call(wrap, 300)
	
				// tooltipHeadline.append("text")
				//     .attr("id", "tooltipText")
				//     .attr("y", ttipHeight/4)
				//     .attr("x", 0)
				//     .attr("font-weight", "bold")
				//     .attr("font-size", "12px")
				//     // .attr("fill", party==="red" ? '#DD1F26':'#0076C0')
				//     .attr("fill", "#282828")
				//     .html("<b>" + '"' + data[randHeadline].headline_no_site + '"')
				//     .call(wrap, 300)
		
				// tooltipHeadline.append("text")
				//     .attr("id", "tooltipText")
				//     .attr("y", ttipHeight/1.5)
				//     .attr("x", 0)
				//     .attr("font-size", "11px")
				//     // .attr("font-weight", "bold")
				//     .attr("fill", "#282828")
				//     .html(d3.timeFormat("%d/%m/%Y")(new Date(data[randHeadline].time)))
				//     // .html('"' + data[randHeadline].subtitle + '..."')
				//     .call(wrap, 300)
	
				// tooltipHeadline.append("text")
				//     .attr("id", "tooltipText")
				//     .attr("y", ttipHeight*1.5)
				//     .attr("x", 0)
				//     .attr("font-size", "12px")
				//     .attr("font-weight", "bold")
				//     .attr("fill", "#282828")
				//     .html(data[randHeadline].site)
				//     .call(wrap, 300)
			}
	
			// function to draw the first chart
			function drawBubbleChart(data, headlines, chart, variable) {
				
				var ttip = variable //"ttip"
				// console.log(chart, variable)
				// set dimensions
				var margin5 = {left: 50, bottom: 20, right: 30, top: 110}
				let bodywidth5 = width5 - margin5.left - margin5.right;
				let bodyheight5 = height5 - margin5.top - margin5.bottom;
				
				// filter data, removing irrelevant news outlets
				var filterD = data.filter(d=>(+d.monthly_visits !== 0)&(+d[variable] !== 0)&
											(d.site !== "msn.com")&(d.site !== "sports.yahoo.com")&
											(d.site !== "finance.yahoo.com")&(d.site !== "news.google.com")&
											(d.site !== "news.yahoo.com")&(d.site !== "bbc.com")&
											(d.site !== "makeuseof.com")&(d.site !== "which.co.uk")&
											(d.site !== "espncricinfo.com")&(d.site !== "seekingalpha.com")&
											(d.site !== "prokerala.com"))
	
				const filterData = filterD.map((d)=>{
					if (variable==="polarity") {
						
						return {
							site: d.site,
							polarity: d[variable],
							monthly_visits: d.monthly_visits,
							country_of_pub: d.country_of_pub
	
						} 
					
					} else {
	
						return {
							site: d.site,
							bias: d[variable],
							monthly_visits: d.monthly_visits,
							country_of_pub: d.country_of_pub
	
						}
					
					}
				})
	
				console.log("fil data", filterData)
				// create chart horizontal scale
				// var xScale = d3.scaleLinear()
				var xScale = d3.scaleSymlog()
						.range([margin5.left*2+margin5.right, bodywidth5])
						.domain(variable==="polarity"?[0, d3.max(filterData, d => +d[variable])]:
														d3.extent(filterData, d => +d[variable]))
	
				// console.log(chart, variable, d3.extent(filterData, d => +d[variable]))
	
				// create radial scale for bubble size
				var extentvisits = d3.extent(filterData, d=>+d.monthly_visits)
				// console.log(extentvisits)
				// console.log(d3.extent(filterData, d=>+d.polarity))
	
				var radius = d3.scaleSqrt()
									.domain(extentvisits)
									.range([3, 70])
	
				// create linear scale for logo size
				var logoScale = d3.scaleLinear()
									.domain(extentvisits)
									.range([18, 100])
	
				// console.log(filterData)
	
				// initialize the force simulation layout
				let simulation = d3.forceSimulation()
							.nodes(filterData)
							.force('charge', d3.forceManyBody().strength(1))
							.force('x', d3.forceX().x(function(d) {
								return xScale(+d[variable]);
							}))
							.force("y", d3.forceY(bodyheight5/1.5).strength(0.05))
							.force('collide', d3.forceCollide((d)=>{ 
								return radius(+d.monthly_visits)}))
							.on('tick', function() {
				
							// function for collision detection
							// for ( i = 0; i < filterData.length; i++ ) {
							// 	var node = filterData[i];
							// 	node.cx = node.x;
							// 	node.cy = node.y;
							// }
							
							// define circles elements
						var circles = chart.select("#body"+variable)
											.selectAll('circle')
											.data(filterData);
	
							// define logos elements
						var logos = chart.select("#body"+variable)
											.selectAll('image')
											.data(filterData);
					
							// append the circles and define style properties and hover events (tooltip)
							var newCircles = circles.join('circle')
								.attr("class", "forceCircles")
								// .attr("fill", "white")
								.style("opacity", "1")
								.attr('r', d=>radius(+d.monthly_visits))
								.on("mouseenter", (event, d) => {
									showTooltipHeadline(ttip, d.site, d.country_of_pub, d.monthly_visits, [event.clientX, event.clientY], headlines, d.polarity, d)
								})
								.on("mousemove", (event, d) => {
									showTooltipHeadline(ttip, d.site, d.country_of_pub, d.monthly_visits,  [event.clientX, event.clientY], headlines, d.polarity, d)
								})
								.on("mouseleave", (event, d) => {
									d3.select("#tooltipHeadline").style("display", "none")
								})
								.on("mouseover.color", function() { d3.select(this).style("stroke", "#E75C33").style("stroke-width", "3px"); })
								.on("mouseleave.color", function() { d3.select(this).style("stroke", "#323232").style("stroke-width", "1px"); })
								
							// append the logos and define style properties and hover events (tooltip)
							var newLogos = logos.join("svg:image")
									.attr("class", "forceLogo")
									// each logo needs to be centered in the bubble (couldnt find better way of doing this)
									.attr("transform", d=>d.site=="bbc.co.uk" ? "translate(-50,-50)"
														: d.site=="cnn.com" | d.site=="foxnews.com" ? "translate(-30,-30)"
														: d.site=="espn.go.com" ? "translate(-34,-10)"
														: d.site=="nytimes.com" | d.site=="buzzfeed.com" ? "translate(-25,-25)"
														: d.site=="washingtonpost.com" | d.site=="huffingtonpost.com" | d.site== "usatoday.com" ? "translate(-20,-20)"
														: d.site=="dailymail.co.uk" ? "translate(-22,-18)"
														: d.site=="politico.com" | d.site=="ksl.com" | d.site=="abcnews.go.com" | d.site=="nydailynews.com" ? "translate(-12.5,-12.5)"
														: d.site=="telegraph.co.uk" ? "translate(-15,-3)"
														: d.site=="breitbart.com" ? "translate(-14,-10)"
														: d.site=="aajtak.in" ? "translate(-25,-20)"
														: d.site=="businessinsider.com" ? "translate(-14,-13)"
														: "translate(-15,-15)")
									.attr('width', d=>logoScale(+d.monthly_visits))
									.attr("xlink:href", d=>+d.monthly_visits>150000000 ? logoData.filter(x=>x.site==d.site)[0]["link"]:'')
									.on("mouseenter", (event, d) => {
										showTooltipHeadline(ttip, d.site, d.country_of_pub, d.monthly_visits, [event.clientX, event.clientY], headlines, d.polarity, d)
									})
									.on("mousemove", (event, d) => {
										showTooltipHeadline(ttip, d.site, d.country_of_pub, d.monthly_visits,  [event.clientX, event.clientY], headlines, d.polarity, d)
									})
									.on("mouseleave", (event, d) => {
										d3.select("#tooltipHeadline").style("display", "none")
									})
	
							// show the circles
							circles.merge(newCircles)
								.attr('cx', function(d) {
									return d.x;
								})
								.attr('cy', function(d) {
									return d.y;
								})
	
							// show the logos
							logos.merge(newLogos)
								.attr('x', function(d) {
									return d.x;
								})
								.attr('y', function(d) {
									return d.y;
								})
							
							// this is not used now, but if we want to add a transition it is set up
							// circles.exit().remove();
					});
					
			// add text and line to prompt the user to hover on the bubbles
			chart.append("text")
					.attr("id", "hoverGuide")
					// .attr("transform", "rotate(-90)")
					.attr("y", bodyheight5/4)
					.attr("x",bodywidth5/1.5)
					.attr("dy", "1em")
					.style("text-anchor", "start")
					// .attr("font-size", "17px")
					// .style("fill", "silver")
					// .style("font-weight", "bold")  
					// .style("font-family", "sans-serif")
					.text("Hover over a bubble to explore headlines from that outlet!")
					
	
			// line coordinates
			var wp = +data.filter(d=>d.site==="telegraph.co.uk")[0].bias+0.01
			chart.append("line")
				.attr("y1", bodyheight5/3.2)
				.attr("x1",bodywidth5/1.2)
				.attr("x2", xScale(wp))
				.attr("y2", bodyheight5/1.85)
				.attr("id", "hoverGuideLine")
				// .attr("stroke-width", 1)
				// .attr("stroke", 'silver')
	
			// label the x axis
			chart.append("text")
					.attr("id", "xAxisLabel")
					// .attr("transform", "rotate(-90)")
					.attr("y", bodyheight5*1.08)
					.attr("x",margin5.left+margin5.right)
					.attr("dy", "1em")
					// .attr("font-size", "17px")
					.style("text-anchor", "start")
					// .style("fill", "silver")
					// .style("font-weight", "bold")  
					// .style("font-family", "sans-serif")
					.text(variable==="bias"?"← Less Biased Language":"← Less Polarizing Language")
				   
		
			chart.append("text")
					.attr("id", "xAxisLabel")
					// .attr("transform", "rotate(-90)")
					.attr("y", bodyheight5*1.08)
					.attr("x",bodywidth5)
					.attr("dy", "1em")
					// .attr("font-size", "17px")
					.style("text-anchor", "end")
					// .style("fill", "silver")
					// .style("font-weight", "bold")  
					// .style("font-family", "sans-serif")
					.text(variable==="bias"?"More Biased Language →":"More Polarizing Language →")
					
			// create the dataset for the bubble legend
			var legendData = [{level: "", radius: radius(10000000), y: bodyheight5+75, x: bodywidth5/2.2, anchor:"end", xtext: bodywidth5/2.235, ytext: bodyheight5+53,id: ""}, 
			{level: "", radius: radius(100000000), y: bodyheight5+75, x: bodywidth5/2.05,id: ""}, 
			{level: "1B Monthly Viewers", radius: radius(1000000000), y: bodyheight5+75, x: bodywidth5/1.85, anchor:"middle", xtext: bodywidth5/1.85, ytext: bodyheight5+46,id: ""},
			{level: "?", radius: radius(30000000), y: bodyheight5*1.08+11, x: bodywidth5+15, anchor:"middle", xtext: bodywidth5+15, ytext: bodyheight5*1.08+16,id: "info"}]
	
			// make the bubble legend and initialize the tooltip for methodology info if they hover on the "#info" circle
			var legend = chart.append("g")
					.selectAll("circle")
					.data(legendData)
					.join('circle')
					.attr("cx", d => d.x)
					.attr("cy", d => d.y)
					.attr("r", d => d.radius)
					// .attr("fill","#161616")
					// .attr("fill","none")
					// .attr("stroke","lightgrey")
					.attr("class","legendBubble")
					.on("mouseover", (event, d)=>d.id==="info" ? tooltipInfo(event.clientX-150, event.clientY-420):"")
					.on("mouseleave", (event, d)=>d3.select("#tooltipInfo").style("visibility", "hidden"))
				
			var textLegend = chart.append("g")
				// textLegend = legend.append("g")
					.selectAll("text")
					.data(legendData)
					.join("text")
					.text(d=>d.level)
					.attr("x", d => d.xtext)
					.attr("y", d => d.ytext)
					.attr("class", "themesText")
					.style("text-anchor", d=>d.anchor)
					// .attr("fill","lightgrey")
					.attr("id", "info") 
					.call(wrap, 10)
					.on("mouseover", (event, d)=>d.id==="info" ? tooltipInfo(event.clientX-150, event.clientY-420):"")
					.on("mouseleave", (event, d)=>d3.select("#tooltipInfo").style("visibility", "hidden"))
	
			// filter interactions with dropdowns
			 // Search functionality
			d3.select("#countrydropdown").on("change", function() {
	
				const selection = d3.select(this).property("value")
	
				// selected_city = d3.event.target.value;
				
				// console.log(selection.toLowerCase())
				// console.log(circles._groups[0].filter(d=>d.__data__.country_of_pub.toLowerCase() === selection))
				// console.log(circles._groups[0].filter(d=>d.__data__.country_of_pub.toLowerCase().match(selection.toLowerCase())))
	
				// allCircs = Array.from(d3.selectAll(".forceCircles")._groups[0])
				let allCircs = d3.selectAll(".forceCircles")
				let allLogos = d3.selectAll(".forceLogo")
				
				// console.log(allCircs.filter(d=>d.__data__.country_of_pub.toLowerCase() === selection))
				// console.log("up",circles)
				// console.log("all",allCircs)
				// console.log(filterData.map(d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()))
	
				// circles.style("stroke", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"#E75C33":"#282828")
				// circles.style("stroke-width", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"2px":"0.6px")
				allCircs.style("fill", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"#F7DC5B":"#FEFAF1")
				allCircs.style("opacity", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"1":
										 selection===""?"1":"0.2")
				allLogos.style("opacity", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"1":
										 selection===""?"1":"0.2")
						
				})
	
			d3.select("#pubdropdown").on("change", function() {
	
				const selection = d3.select(this).property("value")
	
				// selected_city = d3.event.target.value;
				
				// console.log(selection.toLowerCase())
				// console.log(circles._groups[0].filter(d=>d.__data__.country_of_pub.toLowerCase() === selection))
				// console.log(circles._groups[0].filter(d=>d.__data__.site.toLowerCase().match(selection.toLowerCase())))
	
				let allCircs = d3.selectAll(".forceCircles")
				let allLogos = d3.selectAll(".forceLogo")
	
				// console.log(filterData.map(d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()))
	
				// circles.style("stroke", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"#E75C33":"#282828")
				// circles.style("stroke-width", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"2px":"0.6px")
				allCircs.style("fill", d=>d.site.toLowerCase() === selection.toLowerCase()?"#F7DC5B":"#FEFAF1")
				allCircs.style("opacity", d=>d.site.toLowerCase() === selection.toLowerCase()?"1":
											selection===""?"1":"0.2")
				allLogos.style("opacity", d=>d.site.toLowerCase() === selection.toLowerCase()?"1":
										 selection===""?"1":"0.2")
						
				})
	
			}
	
			// function to draw the stacked bar chart
			// function renderStackedBars(data, themes) {
	
		
			// 	var margin = ({top: 100, right: 0, bottom: 0, left: 100});
			
			// 	var height = 2000 - margin.top - margin.bottom;
			// 	var width = 500 - margin.left - margin.right;
			// 	// var height = 600 - margin.top - margin.bottom
			// 	// var width = 200 - margin.left - margin.right
			
			
			// 	var svg = d3.select("#stackedChart")
			// 			.attr('width', width + margin.left + margin.right)
			// 			.attr('height', height + margin.top + margin.bottom);
			// 	// .attr("preserveAspectRatio", "xMinYMin meet")
			// 	// .attr("viewBox", "0 0 "+ width +"," + height+"")
			// 	// .classed("svg-content", true);
			// 	// margin = {top: 40, right: 100, bottom: 60, left: 60},
			// 	// width = +svg.attr("width")-200 - margin.left - margin.right,
			// 	// height = +svg.attr("height")+1000 - margin.top - margin.bottom,
			// 	// g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			  
			// 	console.log(data)
			// 	// console.log(themes.filter(d=>d.word==="accuse")[0].theme)
			
			// 	// stack data
			// 	var series = d3.stack()
			// 	.keys(data.columns.slice(2))
			// 	// .keys(data.map(d=>d.country))
			//   (data)
			// 	.map(d => (d.forEach(v => v.key = d.key), d))
			  
			// 	console.log(series)
			// 	// console.log(series.length)
			// 	// console.log(series.map(d=>d[1]))
			
			// 	// xscale
			// 	var x = d3.scaleBand()
			// 	.domain(data.map(d => d.country))
			// 	.range([margin.left, width - margin.right])
			// 	.padding(0.1)
			
			// 	var y = d3.scaleLinear()
			// 	// .domain([d3.max(series, d => d3.max(d, d => d[1])), 0])
			// 	.domain([series.length, 0])
			// 	// .domain([0, series.length])
			// 	.range([height - margin.bottom, margin.top])
			
			// 	// color = d3.scaleOrdinal()
			// 	// .domain(series.map(d => d.data[d.key]))
			// 	// // .range(d3.schemeSpectral[series.length])
			// 	// .range(d3.schemeSpectral[series.length])
			// 	// .unknown("#ccc")
			
			// 	console.log([series.length, 0])
			// 	// console.log(d3.max(series, d => d3.max(d, d => d[1])))
			
			// 	var xAxis = g => g
			// 	// .attr("transform", `translate(0,${height - margin.bottom})`)
			// 	.call(d3.axisBottom(x).tickSizeOuter(0).tickSizeInner(0))
			// 	.call(g => g.selectAll(".domain").remove())
				
			
			// 	var yAxis = g => g
			// 	.attr("transform", `translate(${width+margin.right+30},210)`)
			// 	.call(d3.axisRight(y).tickSizeOuter(0).tickSizeInner(0))
			// 	.call(g => g.selectAll(".domain").remove())
			// 	// .call(g=>g.selectAll(".tick text")
			// 	//                 .text((d, i) => i == 0 || i == 8 ? "↑ Frequency": "")).call(wrap, 100)
			
			// 	 // y axis
			// 	yAxis = svg.append("g")
			// 	 .call(yAxis)
				
			// 	yAxis.selectAll(".tick text").remove()
			
			// 	yAxis.selectAll(".tick")
			// 		.append("text")
			// 		.text((d, i) => i == 8 ?"Frequency of use in news headlines ⇢": "")
			// 		// .text((d, i)=>console.log("ytick"+i))
			// 		.attr("x", 0)             
			// 		.attr("y", 0)
			// 		.attr("class", "stackedChartTicks stackedChartTicks-light")
			// 		.style("transform", "rotate(-90deg)")
			// 		// .call(wrap, 10)
			
			// 	// svg.append("g")
			// 	//         .call(yAxis);
			
			// 	var formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")
			
				  
			// 	var rects = svg.append("g")
			// 		  .attr("class", "stackedBars")
			// 		  .selectAll("g")
			// 		  .data(series)
			// 		  .join("g")
			// 		  .selectAll("rect")
			// 		  .data(d => d)
					  
			// 	var rect = rects.join("rect")
			// 			.attr("class", d=>d.key)
			// 			// .attr("id", "stackedRects")
			// 			// .attr("fill", "#FEFAF1")
			// 			.attr("fill", d=>themes.filter(c=>c.word===d.key)[0].theme==="female_bias"?"#0BBF99":
			// 							 themes.filter(c=>c.word===d.key)[0].theme==="empowerement"?"#F7DC5B":
			// 							 themes.filter(c=>c.word===d.key)[0].theme==="violence"?"#F2C5D3":"#ccc")
			// 			// .attr("fill", d => color(d.key))
			// 			.attr("stroke", "#FEFAF1")
			// 			.attr("stroke-width", "0.2px")
			// 			.attr("x", (d, i) => x(d.data.country))
			// 			.attr("height", "4px")
			// 			.attr("width", x.bandwidth())
			// 			.on("mouseover", (event, d) => highlightWords(d.key, "chartHover", d))
			// 			.on("mouseleave", (event,d)=> unHighlightWords(d.key))
			// 			.transition().duration("5000")
			// 			// .attr("y", d => y(d[1]))
			// 			.attr("y", d => y(d.data[d.key]))
			
					
			// 			// x axis
			// 			xAxis = svg.append("g")
			// 			.call(xAxis)
			// 			.attr("class", "stackedChartCountries")
				
			// 			xAxis.selectAll(".tick text").remove()
			// 					// .call(wrap, x.bandwidth());
			
			// 			// console.log(xAxis.selectAll(".tick")._groups[0][1].textContent)
			
			// 			// country names and flags
			// 			var flags = [{country:"South Africa", flag:"assets/images/flags/south-africa.svg"}, {country:"USA", flag:"assets/images/flags/united-states.svg"}, 
			// 			{country:"India", flag:"assets/images/flags/india.svg"}, {country:"UK", flag:"assets/images/flags/united-kingdom.svg"}, {country: 'All countries', flag:''}]
		
	
			// 			xAxis.selectAll(".tick")
			// 				.append("text")
			// 				.text(d=>d)
			// 				.attr("x", 0)             
			// 				.attr("y", 0)
			// 				.attr("class", "stackedChartTicks")
			// 				.call(wrap, x.bandwidth())
			
			// 			xAxis.selectAll(".tick")
			// 				.append("svg:image")
			// 					.attr('height', "35px")
			// 					.attr("x", 0)             
			// 					.attr("y", 0)
			// 					.attr("transform", "translate(-17, -50)")
			// 					.attr("xlink:href", d => console.log(d))
			// 					.attr("xlink:href", d => flags.filter(c=>c.country===d)[0].flag)
			
			
			// 		function highlightWords(word, hoverType, d) {
			
			// 			// console.log(themes.filter(c=>c.word===word)[0].theme)
			// 			// console.log(themes.filter(c=>c.word===word)[0].theme)
			// 			d3.selectAll("."+ word)
			// 			.attr("fill", "#E75C33")
			// 			//.attr("stroke-width", "0.1px")
			
			// 			d3.selectAll(".stackedBars")
			// 			  .selectAll("rect:not(."+ word+")")
			// 			  .attr("opacity", "0.5")
			
			// 			if (hoverType === "chartHover") {
							
			// 				svg.append("text")
			// 					.attr("y", y(d.data[word]))
			// 					.text(word)
			// 					.attr("class", "stackedBarAnnotation")
			
			// 			}
					
			// 		}
			
			// 		function unHighlightWords(word) {
			// 			d3.selectAll("."+ word)
			// 			.attr("fill",   themes.filter(c=>c.word===word)[0].theme==="female_bias"?"#0BBF99":
			// 							themes.filter(c=>c.word===word)[0].theme==="empowerement"?"#F7DC5B":
			// 							themes.filter(c=>c.word===word)[0].theme==="violence"?"#F2C5D3":"#ccc")
			// 			// .attr("fill", "#FEFAF1")
			// 			d3.selectAll(".stackedBarAnnotation").remove()
			
			// 			d3.selectAll(".stackedBars")
			// 			  .selectAll("rect")
			// 			  .attr("opacity", "1")
			// 		}
			
			// 		function highlightThemes(theme) {
			
			// 			// console.log(themes.filter(c=>c.word===word)[0].theme)
			// 			// console.log(themes.filter(c=>c.word===word)[0].theme)
			
			// 			// d3.selectAll(".stackedBars")
			// 			//         .style("opacity", d=>themes.filter(c=>c.word===word)[0].theme===theme?"1":"0.2")
					
			
			// 			// d3.selectAll(".stackedBars")
			// 			//   .allLogos.style("opacity", d=>d.site.toLowerCase() === selection.toLowerCase()?"1":
			// 			//   selection===""?"1":"0.2")
					
			// 		}
			
			// 		// interaction with text
			// 		// words
			// 		$('.stackedBarTextAnnotation').on('mouseover', function () {
			// 			// var word = $(this)[0].innerText.toLowerCase()
			// 			var word = $(this)[0].attributes.value.value
			// 			console.log(word)
			// 			highlightWords(word, "inTextHover")
			// 			// d3.select("#rectsBlock").select("#barchart").select('svg rect[data-key='+key+']').style('fill', 'brown');
			// 		})
			// 		.on('mouseout', function () {
			// 			var word = $(this)[0].attributes.value.value
			// 			// console.log(word)
			// 			unHighlightWords(word)
			// 		})
			
			// 		// themes
			// 		$('.stackedBarThemeAnnotation').on('mouseover', function () {
			// 			// var word = $(this)[0].innerText.toLowerCase()
			// 			var theme = $(this)[0].attributes.value.value
			// 			console.log(theme)
			// 			// highlightThemes(theme)
			// 			d3.selectAll(".stackedBars")
			// 					.selectAll("rect")//.attr("fill", d=>d.key==="man"?"red":"blue")
			// 					.style("opacity", d=>themes.filter(c=>c.word===d.key)[0].theme===theme?"1":"0.2")
					
			// 			// d3.select("#rectsBlock").select("#barchart").select('svg rect[data-key='+key+']').style('fill', 'brown');
			// 		})
			// 		.on('mouseout', function () {
			// 			d3.selectAll(".stackedBars")
			// 					.selectAll("rect")
			// 					.style("opacity", "1")
			// 		})
			
			
			
			// };


			
	
			// dropdown menu population
			// line functions
			
			
			function populateDropdown(data, div, attribute) {
				var select = d3.select(div)
	
				const unique_countries = d3.map(data, d=>d[attribute]).filter(onlyUnique);
				attribute==="country_of_pub"?unique_countries.unshift("Country"):unique_countries.unshift("Newsroom")
				// unique_countries.unshift("")
				// console.log("unique",unique_countries)
	
				select.selectAll("option")
				.data(unique_countries)
				.join("option")
					.attr("value", d=>d==="Country"||d==="Newsroom"?"":d)
					.text(d=>d);
			}
	
			// unique values from array
			function onlyUnique(value, index, self) {
				return self.indexOf(value) === index;
			  }

			function mapToArray(map) {
				var res = [];
				map.forEach(function(val, key) {
					res.push({year: key, womenPolarityMed: val[0], allPolarityMed: val[1]});
			  });
				return res
			  }
	
	
	
	
	
	
	
	
	
	
			// tooltip function for the second chart
			function tooltipCluster(word, freq, theme, country, coords, pc_freq) {
				console.log(word)
				d3.select("#tooltipCluster")
					.style("display", "block")
					.style("top", (coords[1]+10) + "px")
					.style("left", (coords[0]+10) + "px")
					.style('font', '14px sans-serif')
					.style('background-color', clusterColors(pc_freq))
					.attr('stroke', '#ccc')
					.html("<b>" + word + "<br/> </b> Used <b>" + freq + "</b> times in " + "<b>" + country + "</b> headlines")
			}
			// info (bottom right methodology info) tooltip function for the first chart
			function tooltipInfo(width, height) {
				console.log("working")
				info = d3.select("#tooltipInfo")
					.style("display", "block")
					.style("visibility", "visible")
					.style("top", height + "px")
					.style("left", width + "px")
					.style("border", "solid 1px #ccc")
					.style('font', '10px sans-serif')
					.attr('stroke', '#ccc')
					.html("We measure <b> gender bias </b> by tracking the combined occurrence of gendered language and social stereotypes usually associated with women. We do this in two steps: <br> <br> 1) We check if a headline contains gendered language (i.e. 'spokeswoman', 'chairwoman', 'she', 'her', 'bride', 'daughter', 'daughters', 'female', 'fiancee', 'girl', 'girlfriend' etc.) <br> <br> 2) If it contains gendered language, we then count the number of words that are considered to be social stereotypes about women (i.e. 'weak', 'modest', 'virgin', 'slut', 'whore', 'sexy', 'feminine', 'sensitive', 'emotional', 'gentle', 'soft', 'pretty', 'bitch', 'sexual' etc.).<br><br> Finally, we normalize this count for all headlines within each outlet as a score between 0 and 1, and we aggregate (i.e. average) this score for each outlet. <br><br> We measure <b>polarity</b> by performing sentiment analysis on each headline using the Vader python package, where each headline gets a sentiment score from -1 to 1 (from more negative to more positive). Because we are interested in polarity, we take the absolute value of each headline's score.")
			}
			// function to draw the second chart
			function drawWordClusters(data) {
	
				// create reference dataset for each cluster
				groups = {
					"South Africa, male": { x: width5 - 300, y: height5, color: "#93D1BA", pc_freq: d3.sum(data.filter(d=>(d.cluster === "South Africa, male")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
					"South Africa, violence": { x: width5-600, y: height5, color: "#BEE5AA", pc_freq: d3.sum(data.filter(d=>(d.cluster === "South Africa, violence")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
					"South Africa, female": { x: width5 - 900, y: height5, color: "#79BACE", pc_freq: d3.sum(data.filter(d=>(d.cluster === "South Africa, female")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
					"South Africa, empowerment": { x: width5 - 1200, y: height5, color: "lightblue", country: "South Africa", pc_freq: d3.sum(data.filter(d=>(d.cluster === "South Africa, empowerment")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
		
					"USA, male": { x: width5- 300, y: height5 - 160, color: "#93D1BA", pc_freq: d3.sum(data.filter(d=>(d.cluster === "USA, male")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
					"USA, violence": { x: width5- 600, y: height5 - 160, color: "#BEE5AA", pc_freq: d3.sum(data.filter(d=>(d.cluster === "USA, violence")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
					"USA, female": { x: width5- 900, y: height5 - 160, color: "#79BACE", pc_freq: d3.sum(data.filter(d=>(d.cluster === "USA, female")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
					"USA, empowerment": { x: width5- 1200, y: height5 - 160, color: "lightblue", country: "United States", pc_freq: d3.sum(data.filter(d=>(d.cluster === "USA, empowerment")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
		
					"UK, male": { x: width5- 300, y: height5 -320, color: "#93D1BA", pc_freq: d3.sum(data.filter(d=>(d.cluster === "UK, male")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
					"UK, violence": { x: width5- 600, y: height5-320, color: "#BEE5AA", pc_freq: d3.sum(data.filter(d=>(d.cluster === "UK, violence")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
					"UK, female": { x: width5- 900, y: height5-320, color: "#79BACE", pc_freq: d3.sum(data.filter(d=>(d.cluster === "UK, female")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
					"UK, empowerment": { x: width5- 1200, y: height5-320, color: "lightblue", country: "United Kingdom", pc_freq: d3.sum(data.filter(d=>(d.cluster === "UK, empowerment")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
		
					"India, male": { x: width5- 300, y: height5-480, color: "#93D1BA", theme: "Male Dominance", pc_freq: d3.sum(data.filter(d=>(d.cluster === "India, male")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
					"India, violence": { x: width5- 600, y: height5-480, color: "#BEE5AA", theme: "Violence", pc_freq: d3.sum(data.filter(d=>(d.cluster === "India, violence")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
					"India, female": { x: width5 - 900, y: height5-480, color: "#79BACE", theme: "Women Stereotypes", pc_freq: d3.sum(data.filter(d=>(d.cluster === "India, female")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
					"India, empowerment": { x: width5- 1200, y: height5-480, color: "lightblue", theme: "Empowerment", country: "India", pc_freq: d3.sum(data.filter(d=>(d.cluster === "India, empowerment")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
				}
	
				// constants for cluster attributes
				cluster_padding = 5;    // Space between nodes in different stages
				padding = 2            // Space between nodes
				radius = 5
	
				// create color scale for prevalence of clusters
				clusterColors = d3.scaleSequential(d3.interpolateLab("lightgrey", "#F52D4F"))
							.domain([0.015, 0.14]) 
	
				// create radial scale for size of bubbles
				extentWordFreq = d3.extent(data, d=>+d.perc_freq)
				var bubbleRadius = d3.scaleSqrt()
					.domain(extentWordFreq)
					.range([2, 10])
	
				//store unique cluster IDs
				var cs = [];
				data.forEach(function(d){
						if(!cs.includes(d.cluster)) {
							cs.push(d.cluster);
						}
				});
				console.log(cs)
				
				n = data.length, // total number of nodes
				m = cs.length; // number of distinct clusters
	
				clusters = new Array(m);
				nodes = [];
	
				// create nodes for simulation
				for (var i = 0; i<n; i++){
					nodes.push(create_nodes(data,i));
				}
				console.log(nodes)
	
				// select html element, add circles to chart, and define hover event (tooltip showing word frequency)
				var svg = wordClusters
				// Circle for each node.
				const circle = svg.append("g")
					.selectAll("circle")
					.data(nodes)
					.join("circle")
					.attr("cx", d => d.x)
					.attr("cy", d => d.y)
					.attr("fill", "lightgrey")
					.style('stroke', "#323232")
					.style('stroke-width', "0.1")
					.attr("fill", d => clusterColors(groups[d.clusterName].pc_freq))
					.on("mouseenter", (d) => {
						tooltipCluster(d.text, d.frequency, d.theme, d.country, [d3.event.clientX, d3.event.clientY], groups[d.clusterName].pc_freq)
					})
					.on("mousemove", (d) => {
						tooltipCluster(d.text, d.frequency, d.theme, d.country, [d3.event.clientX, d3.event.clientY], groups[d.clusterName].pc_freq)
					})
					.on("mouseleave", d => {
						d3.select("#tooltipCluster").style("display", "none")
					});
	
				// Ease in the circles from the middle of each cluster
				circle
					.transition()
					// .delay((d, i) => i * 5)
					.duration(800)
					.attrTween("r", d => {
						const i = d3.interpolate(0, d.radius);
						return t => d.radius = i(t);
					});
	
				// add theme name labels to chart
				svg.selectAll('.cluster')
					.data(d3.keys(groups))
					.join("text")
					.attr("class", "themesText")
					.attr("text-anchor", "middle")
					.attr("x", d => groups[d].x)
					.attr("y", d => groups[d].y - 50)
					.text(d => groups[d].theme);
	
				// add country labels to chart
				svg.selectAll('.cluster')
					.data(d3.keys(groups))
					.join("text")
					.attr("class", "themesText")
					.attr("text-anchor", "middle")
					.attr("x", d => groups[d].x - 150)
					.attr("y", d => groups[d].y)
					.text(d => groups[d].country);
	
				// create data for the legend
				legendData = [{level: "Word is less frequent", radius: 3, y: height5+70, x: width5/2.1, anchor:"end"}, 
							  {level: "", radius: 5, y: height5+70, x: width5/2.06}, 
							  {level: "Word is more frequent", radius: 10, y: height5+70, x: width5/2, anchor:"start"}]
	
				// draw legend for bubble size
				legend = svg.append("g")
					.selectAll("circle")
					.data(legendData)
					.join('circle')
					.attr("cx", d => d.x)
					.attr("cy", d => d.y)
					.attr("r", d => d.radius)
					.attr("fill","#161616")
					.attr("stroke","lightgrey")
				
				textLegend = svg.append("g")
					.selectAll("text")
					.data(legendData)
					.join("text")
					.text(d=>d.level)
					.attr("x", d => d.x)
					.attr("y", d => d.y+35)
					.attr("class", "themesText")
					.style("text-anchor", d=>d.anchor)
					.attr("fill","lightgrey")
					.call(wrap, 100)
	
				// initialize the simulation forces
				const simulation = d3.forceSimulation(nodes)
					.force("x", d => d3.forceX(d.x))
					.force("y", d => d3.forceY(d.y))
					.force("cluster", forceCluster())
					.force("collide", forceCollide())
					.alpha(.09)
					.alphaDecay(0.2);
	
				// run the simulation to render the chart
				simulation.on("tick", () => {
				circle
					.attr("cx", d => d.x)
					.attr("cy", d => d.y);
				});
			  
				// invalidation.then(() => simulation.stop());
	
				// define function to create the nodes
				function create_nodes(data,node_counter) {
					var i = cs.indexOf(data[node_counter].cluster),
						r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
						d = {
							cluster: i,
							clusterName: data[node_counter].cluster,
							radius: bubbleRadius(data[node_counter].perc_freq),
							country: data[node_counter].country,
							theme: data[node_counter].theme,
							text: data[node_counter].word,
							frequency: data[node_counter].frequency,
							x: groups[data[node_counter].cluster].x + Math.random(),
							y: groups[data[node_counter].cluster].y + Math.random(),
						};
					if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
					return d;
				};
	
		
				// define cluster force to make sure each node sticks to their own group
				function forceCluster() {
					const strength = .01;
					let nodes;
					function force(alpha) {
					const l = alpha * strength;
					for (const d of nodes) {
						d.vx -= (d.x - groups[d.clusterName].x) * l;
						d.vy -= (d.y - groups[d.clusterName].y) * l;
					}
					}
					force.initialize = _ => nodes = _;
				
					return force;
				}
				// define force for collision detection (bubbles shouldn't overlap)
				function forceCollide() {
					const alpha = 0.2;
					const padding1 = padding; // separation between same-color nodes
					const padding2 = cluster_padding; // separation between different-color nodes
					let nodes;
					let maxRadius;
				
					function force() {
					const quadtree = d3.quadtree(nodes, d => d.x, d => d.y);
					for (const d of nodes) {
						const r = d.radius + maxRadius;
						const nx1 = d.x - r, ny1 = d.y - r;
						const nx2 = d.x + r, ny2 = d.y + r;
						
						quadtree.visit((q, x1, y1, x2, y2) => {
						if (!q.length) do {
							if (q.data !== d) {
							const r = d.radius + q.data.radius + (d.clusterName === q.data.clusterName ? padding1 : padding2);
							let x = d.x - q.data.x, y = d.y - q.data.y, l = Math.hypot(x, y);
							if (l < r) {
								l = (l - r) / l * alpha;
								d.x -= x *= l, d.y -= y *= l;
								q.data.x += x, q.data.y += y;
							}
							}
						} while (q = q.next);
						return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
						});
					}
					}
				
					force.initialize = _ => maxRadius = d3.max(nodes = _, d => d.r) + Math.max(padding1, padding2);
				
					return force;
				}
			}
			// function to draw the networks in the final visualization
			function drawNetwork(data, network, country, bars, svgID) {
				// set the dimensions of each graph
				var margin = {top: 10, right: 30, bottom: 30, left: 30},
				width5 = 1500;
				// country networks
				width = width5/2 - margin.left - margin.right,
				height = 700 - margin.top - margin.bottom;
	
				// create the svg object for each network
				var svg = d3.select(network)
					.append("svg")
					.attr("preserveAspectRatio", "xMinYMin meet")
					.attr("viewBox", "0 0 "+ width +"," + height+"")
				
				// create objects for nodes and links
				const links = data.links.map(d => Object.create(d))
				const nodes = data.nodes.map(d => Object.create(d))
			
				console.log(data)
			
				// define scales
				extentWordFreq = d3.extent(nodes, d=>d.perc_freq)
							console.log(extentWordFreq)
				
				// scale for node size
				var bubbleRadius = d3.scaleSqrt()
								.domain(extentWordFreq)
								// big net
								// .range([1, 25])
								.range([0.1, 4])
				
				extentLinkWeight = d3.extent(links, d=>d.weight)
						console.log(extentLinkWeight)
				// scale for link thickness
				var linkWeight = d3.scaleLinear()
								.domain(extentLinkWeight)
								.range([0.00005, 4])
				// scale for link opacity
				var linkOpacity = d3.scaleLinear()
								.domain(extentLinkWeight)
								.range([0.05, 1])
				// scale for node opacity
				var nodeOpacity = d3.scaleLinear()
								.domain(extentWordFreq)
								.range([0.2, 1])
				// scale for text opacity
				var textOpacity = d3.scaleLinear()
								.domain(extentWordFreq)
								.range([0.4, 1])
				// scale for font size of text      
				var fontScale = d3.scaleLinear()
								.domain(extentWordFreq)
								.range([1, 20])
				
				// initizilize the simulation and the different forces we need
				simulation = d3.forceSimulation(nodes)
					.force("link", d3.forceLink()                               // This force provides links between nodes
							.id(function(d) { return d.id; })
							.links(links)  
					)
					.force("charge", d3.forceManyBody().strength(-30))         // This adds repulsion between nodes
					.force("center", d3.forceCenter(width / 2, height / 2))    // This force attracts nodes to the center of the svg area
					.force("x", d3.forceX())
					.force("y", d3.forceY())
					.on("end", ticked);
				
				// draw paths for each link, and color them by theme
				var link = svg
					.selectAll("line")
					.data(links)
					.join("path")
					.attr("fill", "none")
					.style("stroke-width", d=>linkWeight(d.weight))
					.style("opacity", d=>linkOpacity(d.weight))
					.style("stroke", d=>d.theme === "female_bias"?"pink":
										d.theme === "male_bias"?"turquoise":
										d.theme === "empowerment"?"#ccad34":
										d.theme === "violence"?"red":
										d.theme === "politics"?"green":
										d.theme === "race"?"#964B00":
										"#aaa")
				
				// initialize the node elements 
				var node = svg
					.selectAll("circle")
					.data(nodes.filter( d => (d.perc_freq >= 60) ))
	
				// draw the circles at the place of each node, and define the hover event (fade function that highlights connected words and links)
				circle = node.join("circle")
					// .attr("r", d=>bubbleRadius(d.perc_freq))
					// We decided to not show the nodes (makes the networks more readable) so radius is 0
					.attr("r", 0)
					.attr("opacity", d=>nodeOpacity(d.perc_freq))
					.style("fill", d=>d.theme === "female_bias"?"pink":
										d.theme === "male_bias"?"turquoise":
										d.theme === "empowerment"?"#ccad34":
										d.theme === "violence"?"red":
										d.theme === "politics"?"green":
										d.theme === "race"?"#964B00":
										"#9b9b9b")
					.on('mouseover.fade', fade(0.1))
					.on('mouseout.fade', fade(1));
				
				// add a the word label to each node and color them by theme, define hover event (same as above)
				var text = svg
					.selectAll("text")
					.data(nodes.filter(d => (d.perc_freq >= 150)))
					.join("text")
					.text(d=>d.id)
					.style("fill", d=>d.theme === "female_bias"?"pink":
										d.theme === "male_bias"?"turquoise":
										d.theme === "empowerment"?"#ccad34":
										d.theme === "violence"?"red":
										d.theme === "politics"?"green":
										d.theme === "race"?"#964B00":
										"#9b9b9b")
					.attr("font-size", d=>fontScale(d.perc_freq))
					.attr("font-weight", "900")
					.attr("opacity", d=>textOpacity(d.perc_freq))
					.attr("class", 'nodeText')
					.on('mouseover.fade', fade(0.05))
					.on('mouseover.bar', d=>barInteract(d))
					.on('mouseout.bar', function(d) {
					d3.select(bars).selectAll(".barLabs").remove()
					d3.select(bars).selectAll('rect').attr("opacity", "1")})
					.on('mouseout.fade', fade(1))
				
				// run the force simulation to draw the networks
				function ticked() {
					link
					// .attr("d", positionLink);
					// use the linkArc function to draw curved links
					.attr("d", linkArc);
					// otherwise we use the attrs below (for straight links)
					// .attr("x1", function(d) { return d.source.x; })
					// .attr("y1", function(d) { return d.source.y; })
					// .attr("x2", function(d) { return d.target.x; })
					// .attr("y2", function(d) { return d.target.y; });
					circle
						.attr("cx", function (d) { return d.x; })
						.attr("cy", function(d) { return d.y; });
					text
						.attr("x", function (d) { return d.x+5; })
						.attr("y", function(d) { return d.y; })    
				}
				
				// below are functions for the network hover events (fade function that highlights connected words and links)
				// the following two functions (fade and isConnected) were adapted from https://observablehq.com/@danielbustillos/network-of-stack-overflow-tags
				function fade(opacity) {
					return d => {
						circle.style('opacity', function (o) { return isConnected(d, o) ?d=>nodeOpacity(d.perc_freq): opacity });
						text.style('visibility', function (o) { return isConnected(d, o) ? "visible" : "hidden" });
						link.style('opacity', o => (o.source === d || o.target === d ? 1 : opacity));
						if(opacity === 1){
						circle.style('opacity', d=>nodeOpacity(d.perc_freq))
						text.style('visibility', 'visible')
						text.style('opacity', d=>textOpacity(d.perc_freq))
						link.style('opacity', d=>linkOpacity(d.weight))
						}
					};
					}
				// create a dataset containing all the connections between each node using the index
				const linkedByIndex = {};
					links.forEach(d => {
					linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
					});
	
				// function to check whether two nodes are connected
				function isConnected(a, b) {
					return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
					}
				
				// function to create interaction link between bar charts on the left and networks
				function barInteract(d) {
					console.log(d.id)
					word = d.id
			
					// 1) change opacity of other nodes
					d3.select(bars).selectAll('rect').attr("opacity", "0.3")
					d3.select(bars).select('rect#bar'+d.id).attr("opacity", "1")
					
					// 2) show information about node
					x = parseInt(d3.select(bars).select('rect#bar'+d.id).attr("width"))+120
					y = parseInt(d3.select(bars).select('rect#bar'+d.id).attr("y")) + 86
					fill = d3.select(bars).select('rect#bar'+d.id).attr("fill")
			
					console.log(x, y)
					
					// select the bar that matches the specific node being hovered on and show information about frequency
					d3
						.select("#"+svgID+"wordBars")
						.append("text")
						.attr("text-anchor", "right")
						.attr("x", x)
						.attr("y", y)
						.text(d.id + ": appears " + d.frequency + " times in " + country + " headlines")
						.attr("font-size", "15")
						.attr("fill", fill)
						.attr("font-family", "arial")
						.attr("font-weight", "bold")
						.attr("class", "barLabs")
						.call(wrap, 60)
					}
			
			};
			// function to draw the barcharts in the final visualization
			function drawBars(countries_data, chart, selected_country, word_count, country_name, svgID) {
				// set the dimensions of each chart
				var margin = {top: 69, right: 90, bottom: 5, left: 90};
				var width = width/1.5;
				var height = height;
				// change bar height if we draw more bars
				var barpad = word_count===20 ? 20: word_count===50 ? 7:20
				var font_size = word_count===20 ? "15px": word_count===50 ? "12px":"15px"
	
				// filter the data based on the country of interest
				country_data = countries_data.filter(d=>d.country == selected_country)
				// get top 20 bars
				top10 = country_data.filter(function(d,i){ return i<word_count })
	
				// create svg element that will hold the bars 
				var svg = d3.select(chart)
					.append("svg")
					.attr("preserveAspectRatio", "xMinYMin meet")
					.attr("id", svgID + "wordBars")
					.attr("viewBox", "0 0 "+ width +"," + height+"")
					// .classed("svg-content", true)
					.append("g")
					.attr("transform",
					"translate(" + margin.left + "," + margin.top + ")");
				
				// create the horizontal scale (frequency)
				var x = d3.scaleLinear()
					.domain([0, d3.max(top10,d=>+d.frequency)])
					.range([ 0, width-margin.left-margin.right]);
				
				// create the vertical scale (categorical word)
				var y = d3.scaleBand()
				.range([ 0, height/1.2])
				.domain(top10.map(function(d) { return d.word; }))
				.padding(.1);
				
				// add the y axis
				svg.append("g")
					.call(d3.axisLeft(y).tickSize(0))
					.attr("class", "yAxis")
					.selectAll("text")
					.attr("font-size", font_size)
					.attr("transform", "translate(0, -2)")
					.attr("fill", "silver")
					.attr("font-family", "arial")
					.attr("font-weight", "bold")
				
				// draw a bar for each word, sized by frequency and colored by theme
				svg.selectAll("myRect")
					.data(top10)
					.join("rect")
					.attr("x", x(20) )
					.attr("y", function(d) { return y(d.word); })
					.attr("id", function(d,i) { return "bar" + d.word; })
					.attr("width", function(d) { return x(+d.frequency); })
					.attr("height", barpad )
					.attr("fill", d=>d.theme === "female"?"pink":
									d.theme === "male"?"turquoise":
									d.theme === "empowerment"?"#ccad34":
									d.theme === "violence"?"red":
									d.theme === "politics"?"green":
									d.theme === "race"?"#964B00":
									"#aaa")
	
				// add the country name on top of each bar chart
				svg.append("text")
					.attr("x", (width / 2-margin.right))             
					.attr("y", 0 - (margin.top / 2))
					.attr("text-anchor", "middle")  
					.attr("font-size", "20")
					.attr("fill", "silver")
					.attr("font-family", "arial")
					.attr("font-weight", "bold")
					// .style("text-decoration", "underline")  
					.text(country_name);
			}
			// function to create curved links in the network charts
			function linkArc(d) {
				const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
				return `
					M${d.source.x},${d.source.y}
					A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
				`;
			}
			// function to wrap text
			function wrap(text, width) {
				text.each(function () {
					var text = d3.select(this),
						words = text.text().split(/\s+/).reverse(),
						word,
						line = [],
						lineNumber = 0,
						lineHeight = 1.1, // ems
						x = text.attr("x"),
						y = text.attr("y"),
						dy = 0, //parseFloat(text.attr("dy")),
						tspan = text.text(null)
									.append("tspan")
									.attr("x", x)
									.attr("y", y)
									.attr("dy", dy + "em");
					while (word = words.pop()) {
						line.push(word);
						tspan.text(line.join(" "));
						if (tspan.node().getComputedTextLength() > width) {
							line.pop();
							tspan.text(line.join(" "));
							line = [word];
							tspan = text.append("tspan")
										.attr("x", x)
										.attr("y", y)
										.attr("dy", ++lineNumber * lineHeight + dy + "em")
										.text(word);
						}
					}
				});
			}

			function getRandomSubarray(arr, size) {
				var shuffled = arr.slice(0), i = arr.length, temp, index;
				while (i--) {
					index = Math.floor((i + 1) * Math.random());
					temp = shuffled[index];
					shuffled[index] = shuffled[i];
					shuffled[i] = temp;
				}
				return shuffled.slice(0, size);
			}
}

export default { init, resize };
