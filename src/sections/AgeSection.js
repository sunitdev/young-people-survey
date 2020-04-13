import * as d3 from 'd3';

import colors from '../colors';

export default class AgeSection {

    constructor(svg, dataset) {
        this.svg = svg;
        this.dataset = dataset;

        this.svgWidth = parseInt(this.svg.attr('width'));
        this.svgHeight = parseInt(this.svg.attr('height'));

        // Padding around plot
        this.padding = 60;

        this.barWidth = 15;

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

        this.distributionLine = d3.line()
            .x((row) => this.xScale(row.age))
            .y((row) => (this.svgHeight - this.padding) - this.yScale(row.count))
            .curve(d3.curveCardinal.tension(0.5));
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

        this.xAxisLabel = this.svg.append('text')
            .attr('x', (this.svgWidth - this.padding) / 2)
            .attr('y', this.svgHeight - this.padding + 35)
            .text('Age')
            .attr('opacity', 0);

        this.yAxisGroup = this.svg.append('g')
            .attr('transform', `translate(${this.padding}, 0)`)
            .call(this.yAxis)
            .attr('opacity', 0);

        this.yAxisLabel = this.svg.append('text')
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr('transform', `translate(10, ${this.svgHeight / 2}) rotate(-90)`)
            .text('Count')
            .attr('opacity', 0);

        this.bars = this.svg.selectAll('bar')
            .data(Object.keys(this.aggreatedAgeData).map((item) => ({age: item, count: this.aggreatedAgeData[item]})))
            .enter()
            .append('rect')
            .style('fill', colors.bar)
            .attr('x', (row) => this.xScale(row.age) - (this.barWidth / 2))
            .attr('y', (row) => (this.svgHeight - this.padding) - this.yScale(row.count))
            .attr('width', this.barWidth)
            .attr('height', (row) => this.yScale(row.count))
            .attr('opacity', 0);

        this.distributionPath = this.svg.append('path')
            .attr("d", this.distributionLine(Object.keys(this.aggreatedAgeData).map((item) => ({age: item, count: this.aggreatedAgeData[item]}))))
            .attr("fill", 'none')
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr('opacity', 0);
    }

    onFocusEntered() {

        this.xAxisGroup.transition()
            .duration(600)
            .attr('opacity', 1);

        this.xAxisLabel.transition()
            .duration(600)
            .attr('opacity', 1);

        this.yAxisGroup.transition()
            .duration(600)
            .attr('opacity', 1);

        this.yAxisLabel.transition()
            .duration(600)
            .attr('opacity', 1);

        this.bars
            .attr('y', this.svgHeight - this.padding - 40)
            .attr('opacity', 0.8)
            .transition()
            .duration(600)
            .attr('y', (row) => (this.svgHeight - this.padding) - this.yScale(row.count))

        this.distributionPath
            .transition()
            .duration(1000)
            .attr('opacity', 1);
    }

    onFocusLost() {
        this.xAxisGroup.transition()
            .duration(600)
            .attr('opacity', 0)

        this.xAxisLabel.transition()
            .duration(600)
            .attr('opacity', 0);

        this.yAxisGroup.transition()
            .duration(600)
            .attr('opacity', 0);

        this.yAxisLabel.transition()
            .duration(600)
            .attr('opacity', 0);

        this.bars.transition()
            .duration(600)
            .attr('opacity', 0);

        this.distributionPath
            .transition()
            .duration(600)
            .attr('opacity', 0);
    }
}