import * as d3 from 'd3';

// Module scope variable
let sections, selectors, sectionsTop;
let currentFocusIndex = null;

function initScrollEventHandler(sectionList, sectionIds) {
    // Save section list for later use
    sections = sectionList;

    // Convert selectors to d3 elements
    selectors = sectionIds.map((selector) => d3.select(selector) );

    // Get section tops
    sectionsTop = getSectionTops(selectors);

    // Call section init
    sections.forEach((section) => section.onInit());

    // Hide all sections expect the first
    selectors.forEach((section, index) => {
        if(index === 0) {
            section.style('opacity', 1);
        }else{
            section.style('opacity', 0.1);
        }
    });

    // Setup window scroll listener
    d3.select(window)
        .on('scroll.scroller', onWindowScrollListener);
}

function getSectionTops(selectors) {

    let startPos = 0;

    return selectors.map((element, index) => {
        // Calculate the top
        const top = element.node().getBoundingClientRect().top;

        // If start position set startPos to top
        if(index === 0){
            startPos = top;
        }

        // Calculate relative positions
        return top - startPos;
    });
}

function onWindowScrollListener() {
    // Calculate the current focus section index
    const position = window.pageYOffset - 10;
    let latestFocusIndex = d3.bisect(sectionsTop, position);
    latestFocusIndex = Math.min(sections.length - 1, latestFocusIndex);

    // If focus has changed then notify the section
    if (currentFocusIndex !== latestFocusIndex) {

        // Hide previous focused section
        if(currentFocusIndex !== null){
            sections[currentFocusIndex].onFocusLost();
            selectors[currentFocusIndex].style('opacity', 0.1);
        }

        // show new section
        sections[latestFocusIndex].onFocusEntered();
        selectors[latestFocusIndex].style('opacity', 1);

        currentFocusIndex = latestFocusIndex;
    }
}


export default initScrollEventHandler;