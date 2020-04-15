import * as d3 from 'd3';

import initScrollEventHandler from './scrollEventHandler';

import IntroSection from './sections/IntroSection';
import AgeSection from './sections/AgeSection';
import GenderSection from './sections/GenderSection';
import InterestSection from './sections/InterestSection';
import PhobiaSection from './sections/PhobiaSection';

import visualizationDataPath from './data/visualization_dataset.csv';

const svg = d3.select('#visualization');

// Section selector
const selectors = [
    '#sectionIntro',
    '#sectionAge',
    '#sectionGender',
    '#sectionInterest',
    '#sectionPhobias'
];


function onDataLoaded(dataset) {
    initScrollEventHandler(getSections(dataset), selectors);

    window.scrollTo({top: 0, behavior: 'smooth'});
}

function getSections(dataset) {
    return [
        new IntroSection(svg),
        new AgeSection(svg, dataset),
        new GenderSection(svg),
        new InterestSection(svg, dataset),
        new PhobiaSection(svg, dataset)
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
