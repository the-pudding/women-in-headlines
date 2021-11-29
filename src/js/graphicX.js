/* global d3 */
import loadData from './load-data';
import './pudding-chart/stackedBar';
import './pudding-chart/lollipop';
import './pudding-chart/bubble';
import './pudding-chart/temporalLine';
import 'intersection-observer';
import scrollama from 'scrollama';

/* data */
let dataFiles = ["headlines_site_rapi.csv", 
				"headlines_cl_sent_sm_rapi.csv", 
				"country_time_freqrank_rapi_clean.csv",
				"polarity_comparison.csv",
				"country_freqtheme_pivoted.csv",
				"word_themes.csv",
				"country_freq_pivoted_all_100221.csv",
				"word_themes_all_100221.csv",
				"word_themes_rank_100221.csv",
				"word_themes_freq_100221.csv"];
let headlinesSite;
let headlines;
let tempWords;
let polComparison;
let dataWordsOLD;
let themesOLD;
let data;
let themes;
let themesRank;
let themesFreq;
let stackedBarData;
let biasBubbleData;
let polBubbleData;
let filter_years;
let country;
let temporalVar;
let temporalData;
let chartOpen = false;

/* data functions */


/* charts */
let chartStackedBar = null;
let chartLollipop = null;
let chartBubbleB = null;
let chartBubbleP = null;
let chartTemporalLine = null;

/* dom */
const $stackedBar = d3.select('#stickyStackedChart');
const $step = d3.selectAll('#stackedChartLegend .step');
const $lollipop = d3.select('#lollipopChart');
let $bubble = null;
let $temporalLine = d3.select('#smChart');
let $countryButtons = d3.selectAll("button.country");
let $seeMoreButton = d3.selectAll(".see-more");
let $tempChartDiv = d3.selectAll("#smChart");
let $fade = d3.selectAll(".fade");

/* SCROLLAMA */
const stackedBarScroller = scrollama();

function setupScroller() {
	stackedBarScroller
		.setup({
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

function scrollTo(element) {
	window.scroll({
		behavior: 'smooth',
		left: 0,
		top: element.offsetTop - 60
	});
}

function countryButtonChange() {

	$countryButtons.classed("country-active", false);
	let $currButton = d3.select(this);
	$currButton.classed("country-active", true);
	country = $currButton.property("value");

	d3.select("#smChart svg").remove();
	d3.select("#stickyXaxis svg").remove();

	temporalData = [tempWords, filter_years, country, temporalVar];
	setupTemporalLine(temporalData);			
}

function seeMoreChange() {
	chartOpen = !chartOpen;

	if (chartOpen) {
		$seeMoreButton.select("p").text("See fewer words")
		$tempChartDiv.transition().duration("1000").style("height", `${9500}px`);
		$fade.style("opacity", 0);

	} else {
		$seeMoreButton.select("p").text("See more words")
		$tempChartDiv.transition().duration("1000").style("height", `${2500}px`);
		$fade.style("opacity", 1);

		scrollTo($tempChartDiv.node());
	}
}

function resize() { 

	// 1. update height of step elements
	const stepHeight = Math.floor(window.innerHeight * 0.75)/2;
	$step.style('height', stepHeight + 'px');

	// 2. update width/height of graphic element
	// bodyWidth = d3.select('body').node().offsetWidth;

	// const chartMargin = 32;
	// const textWidth = $scrollText.node().offsetWidth;
	// const chartWidth = $beeswarmChart.node().offsetWidth - textWidth - chartMargin;

	// 3. tell scrollama to update new element dimensions
	stackedBarScroller.resize();

	const $body = d3.select('body');
	let previousWidth = 0;
	const width = $body.node().offsetWidth;
	if (previousWidth !== width) {
		previousWidth = width;
		chartStackedBar.resize();
		//chartLollipop.resize();
		//chartBubbleB.resize();
		//chartBubbleP.resize();
		//chartTemporalLine.resize();
	}
}

function init() {
	loadData(dataFiles).then(result => {
		headlinesSite = result[0];
		headlines = result[1];
		tempWords = result[2];
		polComparison = result[3];
		dataWordsOLD = result[4];
		themesOLD = result[5];
		data = result[6];
		themes = result[7];
		themesRank = result[8];
		themesFreq = result[9];
		filter_years = [2009, 2022];
		country = "USA";
		temporalVar = "freq_prop_headlines";

		stackedBarData = [data, themes, themesRank, themesFreq];
		biasBubbleData = [headlinesSite, headlines, "bias"];
		polBubbleData = [headlinesSite, headlines, "polarity"];
		temporalData = [tempWords, filter_years, country, temporalVar];

		setupScroller();
		setupStackedBar(stackedBarData);
		//setupLollipop(polComparison);
		//setupBubbleB(biasBubbleData);
		//setupBubbleP(polBubbleData);
		//setupTemporalLine(temporalData);
		resize();
		
		$countryButtons.on("click", countryButtonChange)
		$seeMoreButton.on("click", seeMoreChange);

	}).catch(console.error)
}

export default { init, resize };