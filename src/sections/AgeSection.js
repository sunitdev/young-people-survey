import * as d3 from 'd3';

import colors from '../colors';

export default class AgeSection {

    constructor(svg, dataset) {
        this.svg = svg;
        this.dataset = dataset;

        this.svgWidth = parseInt(this.svg.attr('width'));
        this.svgHeight = parseInt(this.svg.attr('height'));

        // Padding around plot
        this.padding = 30;

        this.aggreatedAgeData = this.getAggregatedAgeData(dataset);

        this.xScale = d3.scaleLinear()
            .domain([12, d3.max(this.dataset.map((row) => row.age)) + 2])
            .range([this.padding, this.svgWidth - this.padding]);
        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(Object.values(this.aggreatedAgeData)) + 30])
            .range([this.padding, this.svgHeight - this.padding]);
        const invertedYScale = d3.scaleLinear()
            .domain([0, d3.max(Object.values(this.aggreatedAgeData)) + 30])
            .range([this.svgHeight - this.padding, this.padding]);

        // Axis
        this.xAxis = d3.axisBottom(this.xScale);
        this.yAxis = d3.axisLeft(invertedYScale);
    }

    getAggregatedAgeData(dataset) {
        const aggregatedResult = {};
        dataset.forEach((row) => {
            if (!row.age) return;
            aggregatedResult[row.age] = aggregatedResult[row.age] ? aggregatedResult[row.age] + 1 : 1;
        });
        return aggregatedResult;
    }

    onInit() {
        this.xAxisGroup = this.svg.append('g')
            .attr('transform', `translate(0, ${this.svgHeight - this.padding})`)
            .call(this.xAxis)
            .attr('opacity', 0);

        this.yAxisGroup = this.svg.append('g')
            .attr('transform', `translate(30, 0)`)
            .call(this.yAxis)
            .attr('opacity', 0);

        this.bars = this.svg.selectAll('bar')
            .data(Object.keys(this.aggreatedAgeData).map((item) => ({age: item, count: this.aggreatedAgeData[item]})))
            .enter()
            .append('rect')
            .style('fill', colors.bar)
            .attr('x', (row) => this.xScale(row.age))
            .attr('y', (row) => (this.svgHeight - this.padding) - this.yScale(row.count))
            .attr('width', 15)
            .attr('height', (row) => this.yScale(row.count))
            .attr('opacity', 0);
    }

    onFocusEntered() {
        this.xAxisGroup.transition()
            .duration(600)
            .attr('opacity', 1);

        this.yAxisGroup.transition()
            .duration(600)
            .attr('opacity', 1);

        this.bars.transition()
            .duration(600)
            .attr('opacity', 1);
    }

    onFocusLost() {
        this.xAxisGroup.transition()
            .duration(600)
            .attr('opacity', 0);

        this.yAxisGroup.transition()
            .duration(600)
            .attr('opacity', 0);

        this.bars.transition()
            .duration(600)
            .attr('opacity', 0);
    }
}