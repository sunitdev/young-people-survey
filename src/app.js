import * as d3 from 'd3';

import initScrollEventHandler from './ScrollEventHandler';

import IntroSection from './sections/IntroSection';
import SecondSection from './sections/SecondSection';
import ThirdSection from './sections/SectionThird';

const selectors = [
    '#sectionIntro',
    '#section2',
    '#section3'
];

const sections = [
    new IntroSection(),
    new SecondSection(),
    new ThirdSection()
];

// On Window load init UI and event handler
d3.select(window).on('load', () => {
    initScrollEventHandler(sections, selectors);
});