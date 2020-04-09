import * as d3 from 'd3';

import initScrollEventHandler from './scrollEventHandler';

import IntroSection from './sections/IntroSection';
import SecondSection from './sections/SecondSection';
import ThirdSection from './sections/SectionThird';

const svg = d3.select('svg');

// Section selector
const selectors = [
    '#sectionIntro',
    '#section2',
    '#section3'
];

// Section object
const sections = [
    new IntroSection(svg),
    new SecondSection(svg),
    new ThirdSection(svg)
];

// On Window load init UI and event handler
d3.select(window).on('load', () => {
    initScrollEventHandler(sections, selectors);
});