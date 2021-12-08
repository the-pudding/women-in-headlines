//import Autocomplete from 'accessible-autocomplete'
import { wrap } from '../utils/wrap';
/* global d3 */

/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.puddingStackedBar = function init(options) {
	function createChart(el) {
		// dom elements
		const $chart = d3.select(el);
		let $svg = null;
		let $axis = null;
		let $axisThemes = null;
		let $vis = null;
		let $visThemes = null;
		let $xAxisGroup = null;
		let $yAxisGroup = null;
		let $xAxisGroupThemes = null;
		let $yAxisGroupThemes = null;
		let $xAxis = null;
		let $yAxis = null;
		let $xAxisThemes = null;
		let $yAxisThemes = null;
		let $yAxisText = null;
		let $xAxisFlags = null;
		let $rects = null;
		let $rect = null;
		let $rectLabels = null;
		let $rectThemes = null;
		let $rectDrops = null;
		const $container = d3.select('#scrolly-side');
		const $article = $container.select('article');
		const $stepSel = $article.selectAll('.step');
		const $wordSearch = d3.select("#wordSearch");

		// data
		let data = $chart.datum();
		let dataLocal = data[0];
		let themes = data[1];
		let themesRank = data[2];
		let themesFreq = data[3];
		let series;
		let flags = [{ country: "South Africa", flag: "assets/images/flags/south-africa.svg" }, { country: "USA", flag: "assets/images/flags/united-states.svg" },
		{ country: "India", flag: "assets/images/flags/india.svg" }, { country: "UK", flag: "assets/images/flags/united-kingdom.svg" }, { country: 'All countries', flag: '' }]
		let stackedData = d3.stack()
			.keys(themesFreq.columns.slice(2))
			.order(d3.stackOrderAscending)
			(themesFreq.filter(d => d.theme !== "No theme"))
			.map(d => (d.forEach(v => v.key = d.key), d));

		// dimensions
		let width = 0;
		let height = 0;
		const MARGIN_TOP = 50;
		const FLAG_TOP = 80;
		const MARGIN_BOTTOM = 50;
		const MARGIN_LEFT = 0;
		const MARGIN_RIGHT = 50;
		const themePad = 20;
		let xPad = null;

		// scales
		let x = null;
		let y = null;

		// helper functions
		function stripSpaces(string) {
			let stripped = string.trim();
			stripped = stripped.replace(/ /g, "");
			stripped = stripped.replace(",", "");
			stripped = stripped.toLowerCase();
			return stripped;
		}

		function showWord() {
			let wordGroup = d3.select(this);
			let wordText = wordGroup.attr("id");
			wordText = wordText.split("_")[0];

			$rect.style("opacity", "0.3");

			let wordRects = wordGroup.selectAll("rect")
				.classed("hoverRectActive", true);

			const vals = [...wordRects._groups[0]].map(rect => {
				const datum = d3.select(rect).datum();
				return datum.data[datum.key.word];
			}).filter(d => d);

			const lastVal = vals.pop();

			const top = y(+lastVal);

			$rectLabels = wordGroup.append("text")
				.text(wordText)
				.attr("class", "stackedBarThemeHover")
				.attr("x", width-MARGIN_RIGHT)
				.attr("y", top)
		}

		function hideWord() {
			let wordGroup = d3.select(this);

			$rectLabels.remove();

			d3.selectAll(".stackedBars").selectAll(".crimeandviolence_class, .femalestereotypes_class, .empowerment_class, .peopleandplaces_class, .raceethnicityandidentity_class")
				.style("opacity", 1)

			let wordRects = wordGroup.selectAll("rect")
				.classed("hoverRectActive", false);
		}

		function revealChart() {
			let allRects = d3.selectAll(".stackedBars")
				.selectAll(`rect`)
				.transition().duration("1000")
				.ease(d3.easeCubic)
				//.delay((d, i) => { return i * 1; })
				.attr("y", d => d.data[d.key.word] !== 0 || d.data[d.key.word] !== null ? y(d.data[d.key.word]) : y(null))
		}

		function baseRects() {
			let notWordRects = d3.selectAll(".stackedBars")
				.selectAll(`rect`)
				.attr("fill", "#ded5bb")
				.attr("opacity", "1")
		}

		function highlightWords(index, word) {
			$stepSel.classed('is-active', (d, i) => i === index);
			let ID = word;
			let wordRects = null;
			let wordGroup = d3.select(`#${ID}_group`);

			if (index === 7 || index === 9) {
				d3.selectAll(`.stackedBars rect`).attr("opacity", "0.3")

				wordRects = d3.selectAll(`.${ID}_class`).attr("opacity", "1")
			} else {
				d3.selectAll(`.stackedBars rect`).attr("fill", "#ded5bb").attr("opacity", "0.3")

				wordRects = d3.selectAll(`.${ID}_class`)
						.attr("fill", "#282828")
						.attr("opacity", "1")
			}

			const vals = [...wordRects._groups[0]].map(rect => {
				const datum = d3.select(rect).datum();
				return datum.data[datum.key.word];
			}).filter(d => d);

			const lastVal = vals.pop();

			const top = y(+lastVal);

			$rectLabels = wordGroup.append("text")
				.text(ID)
				.attr("class", "stackedBarThemeHover")
				.attr("x", width-MARGIN_RIGHT)
				.attr("y", top+5)
		}

		function highlightThemes(index, theme) {
			$stepSel.classed('is-active', (d, i) => i === index);

			let notThemeRects = d3.selectAll(".stackedBars")
				.selectAll(`rect`)
				.attr("fill", "#ded5bb")
				.attr("opacity", "0.3")

			let violenceRects = d3.selectAll(".stackedBars").selectAll(".crimeandviolence_class")
			let stereotypeRects = d3.selectAll(".stackedBars").selectAll(".femalestereotypes_class")
			let empowermentRects = d3.selectAll(".stackedBars").selectAll(".empowerment_class")
			let peopleRects = d3.selectAll(".stackedBars").selectAll(".peopleandplaces_class")
			let raceRects = d3.selectAll(".stackedBars").selectAll(".raceethnicityandidentity_class")

			if (theme === "crimeandviolence") {
				violenceRects
					.attr("fill", "#E76B2D")
					.attr("opacity", "1")
			}

			if (theme === "femalestereotypes") {
				stereotypeRects
					.attr("fill", "#53B67C")
					.attr("opacity", "1")
			}

			if (theme === "EPR") {
				violenceRects
					.attr("fill", "#E76B2D")
					.attr("opacity", "1")
				stereotypeRects
					.attr("fill", "#53B67C")
					.attr("opacity", "1")
				empowermentRects
					.attr("fill", "#648FDC")
					.attr("opacity", "1")
				peopleRects
					.attr("fill", "#F7DC5B")
					.attr("opacity", "1")
				raceRects
					.attr("fill", "#F2C5D3")
					.attr("opacity", "1")
			}
		}

		function renderThemeBars(data, dataFreq, themes, x, y) {

			let $INcolumn = d3.selectAll(".india_class, .india_tick");
			let $SAcolumn = d3.selectAll(".southafrica_class, .southafrica_tick");
			let $UKcolumn = d3.selectAll(".uk_class, .uk_tick");
			let $UScolumn = d3.selectAll(".usa_class, .usa_tick");

			setTimeout(() => { $INcolumn.style("opacity", 0) }, 500)
			setTimeout(() => { $SAcolumn.style("opacity", 0) }, 1000)
			setTimeout(() => { $UKcolumn.style("opacity", 0) }, 1500)
			setTimeout(() => { $UScolumn.style("opacity", 0) }, 2000)

			setTimeout(() => {
				x.domain(["crime and violence", "female stereotypes", "empowerment", "people and places", "race, ethnicity and identity"]);
				y.domain([d3.max(stackedData, d => d3.max(d, d => d[1])), 0]);
				
				$xAxis.call(d3.axisBottom(x).tickSizeOuter(0).tickSizeInner(0))
					.call(g => g.selectAll(".domain").remove())
					.call(g => g.selectAll(".tick text").remove());
				
				$xAxis.selectAll(".tick")
					.append("text")
					.text(d => d === "female stereotypes" ? "gendered language" : d)
					.attr("x", 0)
					.attr("y", -5)
					.attr("class", "stackedChartTicks")
					.call(wrap, x.bandwidth())
				
				$xAxis.selectAll(".tick").style("opacity", 1)
			}, 2500)

			setTimeout(() => {
				$rectThemes
					.transition().duration("500")
					.ease(d3.easeLinear)
					.delay((d, i) => { return i * 10; })
					.attr("x", d => x(stackedData.filter(c => c.key === d.key.word)[0].filter(e => e.data.theme === d.key.theme)[0].data.theme))
					.attr("y", d => y(stackedData.filter(c => c.key === d.key.word)[0].filter(e => e.data.theme === d.key.theme)[0][1]))
					.attr("height", function(d) {
						let firstVal = y(stackedData.filter(c => c.key === d.key.word)[0].filter(e => e.data.theme === d.key.theme)[0][0])
						let secondVal = y(stackedData.filter(c => c.key === d.key.word)[0].filter(e => e.data.theme === d.key.theme)[0][1])
						console.log(firstVal, secondVal)
						return firstVal
					})
					// .attr("height", d => y(stackedData.filter(c => c.key === d.key.word)[0].filter(e => e.data.theme === d.key.theme)[0][0]) -
					// 	y(stackedData.filter(c => c.key === d.key.word)[0].filter(e => e.data.theme === d.key.theme)[0][1]))
					.attr("width", x.bandwidth())
					//.attr("transform", `translate(0,${height - MARGIN_TOP})`)
			}, 3000)
			setTimeout(() => {
				$rectDrops
					.transition().duration("500")
					.ease(d3.easeLinear)
					.delay((d, i) => { return i * 2; })
					.style("opacity", 0);
			}, 3000)
			

			// $xAxis.selectAll(".tick text")
			// 	.transition()
			// 	.delay(2000)
			// 	.text(d => `${d}`)

			

			// $rectDrops
			// 	.transition().duration("500")
			// 	.ease(d3.easeLinear)
			// 	.delay((d, i) => { return i * 1.25; })
			// 	.style("opacity", 0);
			
			
			// let chartHeight = height / 3.5;

			// x.domain(["crime and violence", "female stereotypes", "empowerment", "people and places", "race, ethnicity and identity"]);
			// y
			// 	.rangeRound([MARGIN_TOP, chartHeight - MARGIN_BOTTOM])
			// 	.domain([d3.max(stackedData, d => d3.max(d, d => d[1])), 0]);

			// $xAxis.call(d3.axisBottom(x).tickSizeOuter(0).tickSizeInner(0))
			// 	.call(g => g.selectAll(".domain").remove())
			// 	.call(g => g.selectAll(".tick text").remove());

			// $xAxis.selectAll(".tick")
			// 	.append("text")
			// 	.text(d => d === "female stereotypes" ? "gendered language" : d)
			// 	.attr("x", 0)
			// 	.attr("y", 0)
			// 	.attr("class", "stackedChartTicks")
			// 	.attr("transform", `translate(0,${height - MARGIN_BOTTOM - MARGIN_TOP})`)
			// 	.call(wrap, x.bandwidth())


			// $yAxis.call(d3.axisRight(y).tickSizeOuter(0).tickSizeInner(0))
			// 	.call(g => g.selectAll(".domain").remove())
			// 	.call(g => g.selectAll(".tick").remove());

			// $rectThemes
			// 	.transition().duration("500")
			// 	.ease(d3.easeLinear)
			// 	.delay((d, i) => { return i * 10; })
			// 	.attr("x", d => x(stackedData.filter(c => c.key === d.key.word)[0].filter(e => e.data.theme === d.key.theme)[0].data.theme))
			// 	.attr("y", d => y(stackedData.filter(c => c.key === d.key.word)[0].filter(e => e.data.theme === d.key.theme)[0][1]))
			// 	.attr("height", d => y(stackedData.filter(c => c.key === d.key.word)[0].filter(e => e.data.theme === d.key.theme)[0][0]) -
			// 		y(stackedData.filter(c => c.key === d.key.word)[0].filter(e => e.data.theme === d.key.theme)[0][1]))
			// 	.attr("width", x.bandwidth())
			// 	.attr("transform", `translate(0,${height * 3.5 - MARGIN_BOTTOM - MARGIN_TOP})`)

		}

		function prepareWordData(dataLocal, themes) {
			series = d3.stack()
				.keys(dataLocal.columns.slice(2))
				(dataLocal)
				.map(d => 
					(d.forEach(v => v.key = themes.filter(c => c.word === d.key)[0] !== undefined ?
					{ "word": d.key, "country": v.data.country, "theme": themes.filter(c => c.word === d.key)[0].theme } :
					{ "word": d.key, "country": v.data.country, "theme": "No theme" }), d))
					return series
		}


		const Chart = {
			// called once at start
			init() {
				prepareWordData(dataLocal, themes);
				//searchWords();

				$svg = $chart.append('svg').attr('class', 'stackedChart');

				// create axis
				$axis = $svg.append('g').attr('class', 'g-axis');

				$xAxisGroup = $axis.append('g').attr('class', 'x axis');

				$xAxis = $xAxisGroup.append("g");

				$yAxisGroup = $axis.append('g')
					.attr('class', 'y axis');

				$yAxisText = $yAxisGroup.append("text")
					.attr("class", "stackedChartyTicks")
					.attr("transform", "translate(10,275) rotate(-90)")
					.text("Frequency of use of headlines ⇢")
				
				x = d3.scaleBand()
					.domain(dataLocal.map(d => d.country))
					.padding(0.1);

				// setup viz group
				$vis = $svg.append('g').attr('class', 'g-vis');

				$rects = $vis.append("g")
					.attr("class", "stackedBars")
					.selectAll("g")
					.data(series)
					.join("g")
					.attr("id", d => `${d.key}_group`)
					.on("mouseenter", showWord)
					.on("mouseleave", hideWord)
					.selectAll("rect")
					.data(d => d)

				$rect = $rects.join("rect")
					.attr("class", function (d) {
						let themeClass = `${stripSpaces(d.key.theme)}_class`
						let wordClass = `${d.key.word}_class`
						let countryClass = `${stripSpaces(d.key.country)}_class`
						return `${wordClass} ${themeClass} ${countryClass}`
					})
					.attr("fill", "#e7dfc8")
					.attr("opacity", "1")
					.attr("stroke", "#FEFAF1")
					.attr("stroke-width", "1");

				// themes chart
				$rectThemes = $vis.selectAll("rect")
					.filter(d => (d.key.theme !== "No theme") && (d.data.country === "All countries"))
				
				$rectDrops = $vis.selectAll("rect")
					.filter(d => (d.key.theme === "No theme") && (d.data.country === "All countries"))

				Chart.render();
				Chart.resize();
			},
			updateChart(index, direction) {
				const sel = $container.select(`[data-index='${index}']`);
				const word = sel.attr('word');
				const theme = sel.attr('theme');

				console.log(index);

				if (index === 0) {
					baseRects()
				}
				if (index === 1) {
					highlightWords(index, word)
				}
				if (index === 2) {
					$rectLabels.remove();
					highlightWords(index, word)
				}
				if (index === 3) {
					$rectLabels.remove();
					highlightWords(index, word)
				}
				if (index === 4) {
					$rectLabels.remove();
					highlightWords(index, word)
				}
				if (index === 5) {
					$rectLabels.remove();
					highlightWords(index, word)
				}
				if (index === 6) {
					$rectLabels.remove();
					highlightThemes(index, "crimeandviolence")
				}
				if (index === 7) {
					$rectLabels.remove();
					highlightThemes(index, "crimeandviolence")
					highlightWords(index, word)
				}
				if (index === 8) {
					$rectLabels.remove();
					highlightThemes(index, "femalestereotypes")
				}
				if (index === 9) {
					$rectLabels.remove();
					highlightThemes(index, "femalestereotypes")
					highlightWords(index, word)
				}
				if (index === 10) {
					$rectLabels.remove();
					highlightThemes(index, "EPR")
				}
				if (index === 11 && direction === "down") {
					$rect.style("pointer-events", "auto");
				}
				if (index === 12) {
					$rectLabels.remove();
					$rect.style("pointer-events", "none");
					renderThemeBars(themesRank, themesFreq, themes, x, y)
				}

				return Chart;
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
				width = $chart.node().offsetWidth - MARGIN_LEFT - MARGIN_RIGHT;
				height = $chart.node().offsetHeight - MARGIN_TOP - MARGIN_BOTTOM;
				$svg
					.attr('width', width + MARGIN_LEFT + MARGIN_RIGHT)
					.attr('height', height + MARGIN_TOP + MARGIN_BOTTOM);

				// responsive xAxis 
				$xAxisGroup.attr('transform', `translate(0,${FLAG_TOP})`)

				x.range([MARGIN_LEFT, width - MARGIN_RIGHT])
				xPad = x.padding();

				$xAxis
					.call(d3.axisBottom(x))

				$xAxis.selectAll(".domain").remove();
				$xAxis.selectAll(".tick line").remove();
				$xAxis.selectAll(".tick .tickFlag").remove();

				$xAxis.selectAll(".tick").attr("class", d => `${stripSpaces(d)}_tick tick`)
				
				$xAxis.selectAll(".tick text")
					.attr("x", 0)
					.attr("y", -5)
					.attr("class", "stackedChartTicks")
					.call(wrap, x.bandwidth())
				
				$xAxis.selectAll(".tick text").attr("transform", `translate(${x.bandwidth() - MARGIN_RIGHT + 6}, 0)`)

				$xAxis.selectAll(".tick")
					.append("svg:image")
					.attr("class", "tickFlag")
					.attr("id", d => `${stripSpaces(d)}_flag`)
					.attr('height', "35px")
					.attr("x", x.bandwidth() - MARGIN_RIGHT + 5)
					.attr("y", 0)
					.attr("transform", "translate(-17, -55)")
					.attr("xlink:href", d => flags.filter(c => c.country === d)[0].flag)

				// responsive yAxis 
				$yAxisGroup.attr('transform', `translate(${MARGIN_LEFT},0)`)

				y = d3.scaleLinear()
					.domain([series.length, 0])
					.range([height - MARGIN_BOTTOM, MARGIN_TOP]);

				$yAxis = g => g
					.call(d3.axisRight(y).tickSizeOuter(0).tickSizeInner(0))
					.call(g => g.selectAll(".tick").remove())
					.call(g => g.selectAll(".domain").remove())

				$yAxis = $yAxisGroup.append("g")
					.call($yAxis)

				$rect
					.attr("x", (d, i) => x(d.data.country))
					.attr("height", d => d.data[d.key.word] === 0 || d.data[d.key.word] === null ? 0 : height / series.length)
					.attr("width", x.bandwidth())
					.attr("y", d => d.data[d.key.word] !== 0 || d.data[d.key.word] !== null ? y(d.data[d.key.word]) : y(null));

				return Chart;
			},
			// update scales and render chart
			render() {
				// offset chart for margins
				$vis.attr('transform', `translate(${MARGIN_LEFT}, ${MARGIN_TOP})`);

				return Chart;
			},
			// get / set data
			data(val) {
				if (!arguments.length) return data;
				data = val;
				$chart.datum(data);
				return Chart;
			},
		};
		Chart.init();

		return Chart;
	}

	// create charts
	const charts = this.nodes().map(createChart);
	return charts.length > 1 ? charts : charts.pop();
};
