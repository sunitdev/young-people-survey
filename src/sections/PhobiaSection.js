import * as d3 from 'd3';

// https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
export default class PhobiaSection {

    constructor(svg, dataset) {
        this.svg = svg;

        this.svgWidth = parseInt(this.svg.attr('width'));
        this.svgHeight = parseInt(this.svg.attr('height'));

        this.phobiaKeys = ['phobia_Flying', 'phobia_storm', 'phobia_darkness', 'phobia_heights',
            'phobia_ageing', 'phobia_public_speaking'];

        this.dataset = this.getAggregatedDataset(dataset);
        console.log(this.dataset);
    }

    onInit() {
    }

    onFocusEntered() {
    }

    onFocusLost() {
    }

    getAggregatedDataset(dataset) {
        const maleCounter = {};
        const femaleCounter = {};

        const filterCategories = ['afraid', 'Very afraid', 'Very much afraid'];

        // Get count
        dataset.forEach((row) => {
            const counter = row.gender === 'male' ? maleCounter : femaleCounter;
            this.phobiaKeys.forEach((phobia) => {
                let category = row[phobia];
                if (!filterCategories.includes(category)) return;
                counter[phobia] = counter[phobia] ? counter[phobia] + 1 : 1;
            })
        })

        // Convert to percentage
        Object.keys(maleCounter).forEach((key)=> maleCounter[key] = (maleCounter[key] / dataset.length) * 100);
        Object.keys(femaleCounter).forEach((key)=> femaleCounter[key] = (femaleCounter[key] / dataset.length) * 100);

        return [maleCounter, femaleCounter];
    }
}