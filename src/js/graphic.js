/* global d3 */
import loadData from './load-data'
import './pudding-chart/stackedBar'

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

/* data functions */


/* charts */
let chartStackedBar = null;

/* dom */
const $stackedBar = d3.select('#stickyStackedChart')

/* STACKED BAR */
function setupStackedBar(data) {
	chartStackedBar = $stackedBar
		.datum(data)
		.puddingStackedBar()
}

function resize() { }

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

		stackedBarData = [data, themes, themesRank, themesFreq];

		setupStackedBar(stackedBarData)
	}).catch(console.error)
}

export default { init, resize };