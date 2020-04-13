import * as d3 from 'd3';

// https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
export default class PhobiaSection {

    constructor(svg, dataset) {
        this.svg = svg;

        this.svgWidth = parseInt(this.svg.attr('width'));
        this.svgHeight = parseInt(this.svg.attr('height'));

        this.center = {
            x: this.svgWidth / 2,
            y: this.svgHeight / 2
        }

        this.phobiaKeys = ['phobia_Flying', 'phobia_storm', 'phobia_darkness', 'phobia_heights',
            'phobia_ageing', 'phobia_public_speaking'];

        this.dataset = this.getAggregatedDataset(dataset);

        this.radialScale = d3.scaleLinear()
            .domain([0, 50])
            .range([0, 250]);
        this.ticksValue = [0, 10, 20, 30, 40, 50];
    }

    onInit() {
        this.ticks = this.svg.selectAll('tick')
            .data(this.ticksValue)
            .enter()
            .append('circle')
            .attr('cx', this.center.x)
            .attr('cy', this.center.y)
            .attr('fill', 'none')
            .attr('stroke', 'gray')
            .attr('r', (tick) => this.radialScale(tick));

        this.tickText = this.svg.selectAll('tickText')
            .data(this.ticksValue.slice(1))
            .enter()
            .append('text')
            .attr("x", this.center.x - 10)
            .attr("y", (tick) => this.center.y - this.radialScale(tick))
            .text((tick) => tick.toString());

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