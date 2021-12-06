/* global d3 */
import loadData from './load-data';
import './pudding-chart/stackedBar';
import './pudding-chart/timeSeriesLine';
import './pudding-chart/lollipop';
import './pudding-chart/bubble';
import './pudding-chart/temporalLine';
import 'intersection-observer';
import scrollama from 'scrollama';
import enterView from 'enter-view';

/* data */
let dataFiles = ["headlines_site_rapi.csv", 
				"headlines_cl_sent_rapi_reduced_102621.csv", 
				"country_time_freqrank_rapi_clean_101421.csv",
				"polarity_comparison.csv",
				"country_freq_pivoted_all_101221.csv",
				"word_themes_all_101221.csv",
				"word_themes_rank_101221.csv",
				"word_themes_freq_101221.csv",
				"sentiment_comparison.csv"];
let headlinesSite;
let headlines;
let tempWords;
let polComparison;
let data;
let themes;
let themesRank;
let themesFreq;
let sentComp;
let biasBubbleData;
let polBubbleData;
let stackedBarData;
let filter_years;
let country;
let temporalVar;
let temporalData;
let chartOpen = false;

/* data functions */

/* charts */
let chartStackedBar = null;
let chartTimeSeriesLine = null;
let chartLollipop = null;
let chartBubbleB = null;
let chartBubbleP = null;
let chartTemporalLine = null;

/* dom */
const $stackedBar = d3.select('#stickyStackedChart');
const $step = d3.selectAll('#stackedChartLegend .step');
const $timeSeries = d3.selectAll("#timeSeriesChart");
const $lollipop = d3.select('#lollipopChart');
let $bubble = null;
let $temporalLine = d3.select('#smChart');
let $countryDropdownTemporal = d3.select("#countrydropdownTemporal");
let $stackedSpans = d3.selectAll(".stackedBarTextAnnotation");
let $tempButtons = d3.selectAll(".btn-theme");

/* SCROLLAMA */
const stackedBarScroller = scrollama();

function setupScroller() {
	stackedBarScroller
		.setup({
			container: ".scrolly",
			graphic: ".scrolly figure",
			text: ".scrolly article",
		  	step: '#stackedChartLegend .step',
			offset: 0.7
		})
		.onStepEnter(handleStepEnter);
}
function handleStepEnter(response) {
	// response = { element, direction, index }
	$step.classed('is-active', (d, i) => i === response.index);

	renderStep(response.index, response.direction);
}
function renderStep(index, direction) {
	chartStackedBar.updateChart(index, direction);
}

/* STACKED BAR */
function setupStackedBar(data) {
	chartStackedBar = $stackedBar
		.datum(data)
		.puddingStackedBar()
}

/* TIME SERIES LINE */
function setupTimeSeriesLine(data) {
	chartTimeSeriesLine = $timeSeries
		.datum(data)
		.puddingTimeSeriesLine()
}

/* BARBELL */
function setupLollipop(data) {
	chartLollipop = $lollipop
		.datum(data)
		.puddingLollipop()
}

/* BUBBLE */
function setupBubbleP(data) {
	$bubble = d3.select(`#chartP`)
		chartBubbleP = $bubble
			.datum(data)
			.puddingBubble()
}

function setupBubbleB(data) {
	$bubble = d3.select(`#chartB`)
		chartBubbleB = $bubble
			.datum(data)
			.puddingBubble()
}

/* TEMPORAL LINE */
function setupTemporalLine(data) {
	chartTemporalLine = $temporalLine
		.datum(data)
		.puddingTemporalLine()
}

/* HELPER FUNCTIONS */
function scrollTo(element, offset) {

	window.scroll({
		behavior: 'smooth',
		left: 0,
		top: element.offsetTop + offset
	});
}

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

function spanEnter() {
	let span = d3.select(this).attr("value");

	d3.selectAll(".stackedBars rect").attr("opacity", "0.5");
	d3.selectAll(`.stackedBars .${span}_class`).attr("opacity", "1");
}

function spanLeave() {
	let span = d3.select(this).attr("value");

	if (span === "wear") {
		d3.selectAll(".stackedBars rect").attr("opacity", "0.5");
		d3.selectAll(`.stackedBars .${span}_class`).attr("opacity", "1");
		d3.selectAll(`.stackedBars .change_class`).attr("opacity", "1");
		d3.selectAll(`.stackedBars .force_class`).attr("opacity", "1");
	}

	if (span === "force") {
		d3.selectAll(".stackedBars rect").attr("opacity", "0.5");
		d3.selectAll(`.stackedBars .${span}_class`).attr("opacity", "1");
		d3.selectAll(`.stackedBars .change_class`).attr("opacity", "1");
		d3.selectAll(`.stackedBars .wear_class`).attr("opacity", "1");
	}

	if (span === "change") {
		d3.selectAll(".stackedBars rect").attr("opacity", "0.5");
		d3.selectAll(`.stackedBars .${span}_class`).attr("opacity", "1");
		d3.selectAll(`.stackedBars .wear_class`).attr("opacity", "1");
		d3.selectAll(`.stackedBars .force_class`).attr("opacity", "1");
	}

	if (span === "rape") {
		d3.selectAll(".stackedBars rect").attr("opacity", "0.5");
		d3.selectAll(`.stackedBars .${span}_class`).attr("opacity", "1");
		d3.selectAll(`.stackedBars .death_class`).attr("opacity", "1");
	}

	if (span === "death") {
		d3.selectAll(".stackedBars rect").attr("opacity", "0.5");
		d3.selectAll(`.stackedBars .${span}_class`).attr("opacity", "1");
		d3.selectAll(`.stackedBars .rape_class`).attr("opacity", "1");
	}

	if (span === "body") {
		d3.selectAll(".stackedBars rect").attr("opacity", "0.5");
		d3.selectAll(`.stackedBars .${span}_class`).attr("opacity", "1");
		d3.selectAll(`.stackedBars .child_class`).attr("opacity", "1");
		d3.selectAll(`.stackedBars .marry_class`).attr("opacity", "1");
	}

	if (span === "child") {
		d3.selectAll(".stackedBars rect").attr("opacity", "0.5");
		d3.selectAll(`.stackedBars .${span}_class`).attr("opacity", "1");
		d3.selectAll(`.stackedBars .body_class`).attr("opacity", "1");
		d3.selectAll(`.stackedBars .marry_class`).attr("opacity", "1");
	}

	if (span === "marry") {
		d3.selectAll(".stackedBars rect").attr("opacity", "0.5");
		d3.selectAll(`.stackedBars .${span}_class`).attr("opacity", "1");
		d3.selectAll(`.stackedBars .child_class`).attr("opacity", "1");
		d3.selectAll(`.stackedBars .body_class`).attr("opacity", "1");
	}

	if (span === "crimeandviolence" || span === "femalestereotypes" || span === "empowerment" || span === "peopleandplaces" || span === "raceethnicictyandidentity") {
		d3.selectAll(".stackedBars rect").attr("opacity", "0.5");
		d3.selectAll(`.stackedBars .crimeandviolence_class`).attr("opacity", "1");
		d3.selectAll(`.stackedBars .femalestereotypes_class`).attr("opacity", "1");
		d3.selectAll(`.stackedBars .empowerment_class`).attr("opacity", "1");
		d3.selectAll(`.stackedBars .peopleandplaces_class`).attr("opacity", "1");
		d3.selectAll(`.stackedBars .raceethnicictyandidentity_class`).attr("opacity", "1");
	}
}

function populateDropdown(data, div, attribute) {
	const select = d3.select(div);
	let unique_countries = ['all countries', 'india', 'south africa', 'uk', 'usa'];

	select.selectAll("option")
	.data(unique_countries)
	.join("option")
		.attr("value", d=>d)
		.text(d=>d);
	
	$countryDropdownTemporal.node().options[4].selected = true;
}

function changeTemporalDropdown() {
	const selection = this.value;
	const country = selection;

	d3.select("#smChart svg").remove();
	d3.select("#stickyXaxis svg").remove();

	temporalData = [tempWords, filter_years, country, temporalVar];
	setupTemporalLine(temporalData);
}

function runEnterview() {
	enterView({
		selector: '#cellviolence',
		offset: 1,
		enter: () => {
			$tempButtons.classed(`active-btn-violence`, false);
			$tempButtons.classed(`active-btn-empowerment`, false);
			$tempButtons.classed(`active-btn-race`, false);
			$tempButtons.classed(`active-btn-stereotypes`, false);
			d3.selectAll("#btn-violence").classed(`active-btn-violence`, true);
		}
	});

	enterView({
		selector: '#cellemotional',
		offset: 1,
		enter: () => {
			$tempButtons.classed(`active-btn-violence`, false);
			$tempButtons.classed(`active-btn-empowerment`, false);
			$tempButtons.classed(`active-btn-race`, false);
			$tempButtons.classed(`active-btn-stereotypes`, false);
			d3.selectAll("#btn-stereotypes").classed(`active-btn-stereotypes`, true);
		}, exit: () => {
			$tempButtons.classed(`active-btn-violence`, false);
			$tempButtons.classed(`active-btn-empowerment`, false);
			$tempButtons.classed(`active-btn-race`, false);
			$tempButtons.classed(`active-btn-stereotypes`, false);
			d3.selectAll("#btn-violence").classed(`active-btn-violence`, true);
		}
	});

	enterView({
		selector: '#cellmayor',
		offset: 1,
		enter: () => {
			$tempButtons.classed(`active-btn-violence`, false);
			$tempButtons.classed(`active-btn-empowerment`, false);
			$tempButtons.classed(`active-btn-race`, false);
			$tempButtons.classed(`active-btn-stereotypes`, false);
			d3.selectAll("#btn-empowerment").classed(`active-btn-empowerment`, true);
		}, exit: () => {
			$tempButtons.classed(`active-btn-violence`, false);
			$tempButtons.classed(`active-btn-empowerment`, false);
			$tempButtons.classed(`active-btn-race`, false);
			$tempButtons.classed(`active-btn-stereotypes`, false);
			d3.selectAll("#btn-stereotypes").classed(`active-btn-stereotypes`, true);
		}
	});

	enterView({
		selector: '#cellasian',
		offset: 1,
		enter: () => {
			$tempButtons.classed(`active-btn-violence`, false);
			$tempButtons.classed(`active-btn-empowerment`, false);
			$tempButtons.classed(`active-btn-race`, false);
			$tempButtons.classed(`active-btn-stereotypes`, false);
			d3.selectAll("#btn-race").classed(`active-btn-race`, true);
		}, exit: () => {
			$tempButtons.classed(`active-btn-violence`, false);
			$tempButtons.classed(`active-btn-empowerment`, false);
			$tempButtons.classed(`active-btn-race`, false);
			$tempButtons.classed(`active-btn-stereotypes`, false);
			d3.selectAll("#btn-empowerment").classed(`active-btn-empowerment`, true);
		}
	});
}

function scrollToTheme() {
	let $button = d3.select(this)
	let $ID = $button.attr("id").split("-")[1]

	$tempButtons.classed(`active-btn-violence`, false);
	$tempButtons.classed(`active-btn-empowerment`, false);
	$tempButtons.classed(`active-btn-race`, false);
	$tempButtons.classed(`active-btn-stereotypes`, false);
	$button.classed(`active-btn-${$ID}`, true);

	let targetDiv = d3.select("#smChart").node();

	if ($ID === "violence") { scrollTo(targetDiv, -100); }
	if ($ID === "stereotypes") { scrollTo(targetDiv, 4032); }
	if ($ID === "empowerment") { scrollTo(targetDiv, 8138); }
	if ($ID === "race") { scrollTo(targetDiv, 12390); }

}

function resize() { 

	// 1. update height of step elements
	const stepHeight = Math.floor(window.innerHeight * 0.75)/2;
	$step.style('height', stepHeight + 'px');

	// 2. update width/height of graphic element
	const $graphic = d3.select('.scrolly figure');
	const bodyWidth = d3.select('body').node().offsetWidth;
	$graphic.style('height', window.innerHeight + 'px');

	// //3. tell scrollama to update new element dimensions
	//stackedBarScroller.resize();

	// chart resizes
	const $body = d3.select('body');
	let previousWidth = 0;
	const width = $body.node().offsetWidth;
	if (previousWidth !== width) {
		previousWidth = width;
		chartStackedBar.resize();
		chartTimeSeriesLine.resize();
		chartLollipop.resize();
		chartBubbleB.resize();
		chartBubbleP.resize();
		chartTemporalLine.resize();
	}
}

function init() {
	// load all data files
	loadData(dataFiles).then(result => {
		headlinesSite = result[0];
		headlines = result[1];
		tempWords = result[2];
		polComparison = result[3];
		data = result[4];
		themes = result[5];
		themesRank = result[6];
		themesFreq = result[7];
		sentComp = result[8];
		filter_years = [2009, 2022];
		country = "USA";
		temporalVar = "freq_prop_headlines";

		// organize data
		stackedBarData = [data, themes, themesRank, themesFreq];
		biasBubbleData = [headlinesSite, headlines, "bias"];
		polBubbleData = [headlinesSite, headlines, "polarity"];
		temporalData = [tempWords, filter_years, country, temporalVar];

		// setup functionality and charts
		setupScroller();
		setupStackedBar(stackedBarData);
		setupTimeSeriesLine(sentComp)
		setupLollipop(polComparison);
		setupBubbleB(biasBubbleData);
		setupBubbleP(polBubbleData);
		setupTemporalLine(temporalData);
		runEnterview();
		resize();
		
		// interactions
		$stackedSpans.on("mouseenter", spanEnter)
		$stackedSpans.on("mouseleave", spanLeave)

		populateDropdown(tempWords, "#countrydropdownTemporal", "country");
		$countryDropdownTemporal.on("change", changeTemporalDropdown);
		$tempButtons.on("click", scrollToTheme);

	}).catch(console.error)
}

export default { init, resize };