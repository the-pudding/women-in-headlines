/* global d3 */
import debounce from 'lodash.debounce';
import isMobile from './utils/is-mobile';
import linkFix from './utils/link-fix';
import modalSetup from './utils/modal-a11y';
import graphic from './graphic';
import footer from './footer';

const $body = d3.select('body');
let previousWidth = 0;

function resize() {
  // only do resize on width changes, not height
  // (remove the conditional if you want to trigger on height change)
  const width = $body.node().offsetWidth;
  if (previousWidth !== width) {
    previousWidth = width;
    graphic.resize();
  }
}

function setupStickyHeader() {
  const $header = $body.select('header');
  if ($header.classed('is-sticky')) {
    const $menu = $body.select('#slide__menu');
    const $toggle = $body.select('.header__toggle');

    modalSetup($toggle, $toggle, $header, $menu, 'a, button, .logo', true);
  }
}

var aText = new Array(
  "When", 
  "Women",
  "Make",
  "Headlines"
  );

var iSpeed = 100; // time delay of print out
var iIndex = 0; // start printing array at this posision
var iArrLength = aText[0].length; // the length of the text array
var iScrollAt = 20; // start scrolling up at this many lines
  
var iTextPos = 0; // initialise text position
var sContents = ''; // initialise contents variable
var iRow; // initialise current row

// var params = {
//   aText: new Array(
//     "When", 
//     "Women",
//     "Make",
//     "Headlines"
//     ),
//   iSpeed: 100,
//   iIndex: 0,
//   iArrLength: 4,
//   iScrollAt: 20,
//   iTextPos: 0,
//   sContents: ''
// }

var params = {
  iTextPos: 0,
  iIndex: 0,
  iRow: 0
}

function typewriter(params)
{
  //console.log("enter typewriter")
 

	sContents =  '';
	
	iRow = Math.max(0, params.iIndex-iScrollAt);
	var destination = document.getElementById("typedtext");
	
	while ( iRow < params.iIndex ) {
	//console.log("entered while")
	sContents += aText[iRow++] + '<br />';
	}
	//console.log(params)
	destination.innerHTML = sContents + aText[params.iIndex].substring(0, params.iTextPos);
  // word ends here
	if ( params.iTextPos++ == iArrLength ) {
	params.iTextPos = 0;
	params.iIndex++;
	if ( params.iIndex != aText.length ) {
	iArrLength = aText[params.iIndex].length;
	setTimeout(function(){typewriter(params)}, 300);
	}
	} else {
	setTimeout(function(){typewriter(params)}, iSpeed);
	}
}

function init() {
  // adds rel="noopener" to all target="_blank" links
  linkFix();
  // add mobile class to body tag
  $body.classed('is-mobile', isMobile.any());
  // setup resize event
  window.addEventListener('resize', debounce(resize, 150));
  // setup sticky header menu
  setupStickyHeader();
  // kick off graphic code
  graphic.init();
  // load footer stories
  footer.init();

  
  
  //console.log("-----",typewriter)
  typewriter(params);
}

init();

	 

	
