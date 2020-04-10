import * as d3 from 'd3';

import colors from '../colors';

export default class ThirdSection {

    constructor(svg, dataset) {
        this.svg = svg;
        this.dataset = dataset;

        this.svgWidth = parseInt(this.svg.attr('width'));
        this.svgHeight = parseInt(this.svg.attr('height'));

        // Number is scaled to 90 so to ease transition to the next chart
        this.maleCount = 38;
        this.femaleCount = 52;

        this.maleCircleClass = 'circle-male';
        this.femaleCircleClass = 'circle-female';

        this.radius = 10;

        // Bubble chart center
        this.centerMale = {
            x: this.svgWidth / 4,
            y: 2 * (this.svgHeight / 5)
        };
        this.centerFemale = {
            x: 3 * (this.svgWidth / 4),
            y: 2* (this.svgHeight / 5)
        }

    }

    onInit() {
        this.maleSimulate = this.createMaleSimulation();
        this.maleSimulate.stop();
        this.femaleSimulate = this.createFemaleSimulation();
        this.femaleSimulate.stop();

        this.maleTextRect = this.svg.append('rect')
            .attr('x', this.svgWidth / 6)
            .attr('y', 2 * (this.svgHeight / 3) - 50)
            .attr('width', 140)
            .attr('height', 30)
            .attr('fill', colors.textRect)
            .attr('opacity', 0);

        this.maleText = this.svg.append('text')
            .attr('x', (this.svgWidth / 6) + 25)
            .attr('y', 2 * (this.svgHeight / 3) - 30)
            .text('Male: 40.7%')
            .attr('opacity', 0);

        this.femaleTextRect = this.svg.append('rect')
            .attr('x', 4 * (this.svgWidth / 6))
            .attr('y', 2 * (this.svgHeight / 3) - 50)
            .attr('width', 150)
            .attr('height', 30)
            .attr('fill', colors.textRect)
            .attr('opacity', 0);

        this.femaleText = this.svg.append('text')
            .attr('x', 4 * (this.svgWidth / 6) + 25)
            .attr('y', 2 * (this.svgHeight / 3) - 30)
            .text('Female: 58.7%')
            .attr('opacity', 0);
    }

    onFocusEntered() {
        if (this.maleCircles) {
            this.maleCircles
                .attr('opacity', 1);
        }
        if (this.femaleCircles) {
            this.femaleCircles
                .attr('opacity', 1);
        }

        this.maleSimulate.restart();
        this.femaleSimulate.restart();

        this.maleTextRect
            .attr('x', this.svgWidth)
            .attr('opacity', 1)
            .transition()
            .duration(600)
            .attr('x', this.svgWidth / 6);

        this.maleText
            .attr('x', this.svgWidth)
            .attr('opacity', 1)
            .transition()
            .duration(600)
            .attr('x', (this.svgWidth / 6) + 25);

        this.femaleTextRect
            .attr('x', this.svgWidth)
            .attr('opacity', 1)
            .transition()
            .duration(600)
            .attr('x', 4 * (this.svgWidth / 6));

        this.femaleText
            .attr('x', this.svgWidth)
            .attr('opacity', 1)
            .transition()
            .duration(600)
            .attr('x', 4 * (this.svgWidth / 6) + 25);
    }

    onFocusLost() {
        this.maleSimulate.stop();
        this.femaleSimulate.stop();

        this.maleCircles
            .attr('opacity', 0);
        this.femaleCircles
            .attr('opacity', 0);

        this.maleTextRect
            .attr('opacity', 0);

        this.maleText
            .attr('opacity', 0);

        this.femaleTextRect
            .attr('opacity', 0);

        this.femaleText
            .attr('opacity', 0);
    }

    createMaleSimulation() {
        const dataset = d3.range(this.maleCount).map((data) => ({data}));

        return d3.forceSimulation(dataset)
            .force('charge', d3.forceManyBody().strength(5))
            .force('center', d3.forceCenter(this.centerMale.x, this.centerMale.y))
            .force('collision', d3.forceCollide().radius(this.radius))
            .on('tick', () => {
                this.maleCircles = this.svg
                    .selectAll(`.${this.maleCircleClass}`)
                    .data(dataset)

                this.maleCircles.enter()
                    .append('circle')
                    .attr('r', this.radius)
                    .attr('fill', colors.gender.male)
                    .attr('class', this.maleCircleClass)
                    .merge(this.maleCircles)
                    .attr('cx', (d) => d.x)
                    .attr('cy', d => d.y);

                this.maleCircles.exit().remove()
            });
    }

    createFemaleSimulation() {
        const dataset = d3.range(this.femaleCount).map((data) => ({data}));

        return d3.forceSimulation(dataset)
            .force('charge', d3.forceManyBody().strength(5))
            .force('center', d3.forceCenter(this.centerFemale.x, this.centerFemale.y))
            .force('collision', d3.forceCollide().radius(this.radius))
            .on('tick', () => {
                this.femaleCircles = this.svg
                    .selectAll(`.${this.femaleCircleClass}`)
                    .data(dataset)

                this.femaleCircles.enter()
                    .append('circle')
                    .attr('r', this.radius)
                    .attr('fill', colors.gender.female)
                    .attr('class', this.femaleCircleClass)
                    .merge(this.femaleCircles)
                    .attr('cx', (d) => d.x)
                    .attr('cy', d => d.y);

                this.femaleCircles.exit().remove()
            });
    }

}