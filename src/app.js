import * as d3 from 'd3';

import initScrollEventHandler from './scrollEventHandler';

import IntroSection from './sections/IntroSection';
import AgeSection from './sections/AgeSection';
import GenderSection from './sections/GenderSection';

import visualizationDataPath from './data/visualization_dataset.csv';
import SectionFour from './sections/SectionFour';

const svg = d3.select('svg');

// Section selector
const selectors = [
    '#sectionIntro',
    '#sectionAge',
    '#sectionGender',
    '#sectionFour'
];


function onDataLoaded(dataset) {
    initScrollEventHandler(getSections(dataset), selectors);

    window.scrollTo({top: 0, behavior: 'smooth'});
}

function getSections(dataset) {
    return [
        new IntroSection(svg),
        new AgeSection(svg, dataset),
        new GenderSection(svg, dataset),
        new SectionFour(svg)
    ]
}

function preProcessData(dataset) {
    return dataset.map(row => ({
        ...row,
        age: parseInt(row.age),
    }));
}

// On Window load init UI and event handler
d3.select(window).on('load', () => {

    d3.csv(visualizationDataPath).then((dataset) => {
        onDataLoaded(preProcessData(dataset));
    });

});
