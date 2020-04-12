import * as d3 from 'd3';

import colors from '../colors';

export default class GenderSection {

    constructor(svg) {
        this.svg = svg;

        this.svgWidth = parseInt(this.svg.attr('width'));
        this.svgHeight = parseInt(this.svg.attr('height'));

        this.radius = 200;
        this.innerRadius = 100;

        this.data = {male: 41.3, female: 58.7};

        this.pieColors = d3.scaleOrdinal()
            .domain(this.data)
            .range([colors.gender.male, colors.gender.female])
    }

    onInit() {
        const pie = d3.pie()
            .value(function (d) {
                return d.value;
            })

        this.doughnutChart = this.svg
            .selectAll('.gender-arc')
            .data(pie(d3.entries(this.data)))
            .enter()
            .append('path')
            .attr('d', d3.arc()
                .innerRadius(this.innerRadius)
                .outerRadius(this.radius)
            )
            .attr('fill', (d) => this.pieColors(d.data.key))
            .attr('transform', `translate(${this.svgWidth / 2}, ${(this.svgHeight / 2) - 30})`)
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .attr("opacity", 0);

        this.maleTextRect = this.svg.append('rect')
            .attr('x', this.svgWidth / 6)
            .attr('y', this.svgHeight - 100)
            .attr('width', 140)
            .attr('height', 30)
            .attr('fill', colors.textRect)
            .attr('opacity', 0);

        this.maleText = this.svg.append('text')
            .attr('x', (this.svgWidth / 6) + 25)
            .attr('y', this.svgHeight - 80)
            .text('Male: 41.3%')
            .attr('opacity', 0);

        this.femaleTextRect = this.svg.append('rect')
            .attr('x', 4 * (this.svgWidth / 6))
            .attr('y', this.svgHeight - 100)
            .attr('width', 150)
            .attr('height', 30)
            .attr('fill', colors.textRect)
            .attr('opacity', 0);

        this.femaleText = this.svg.append('text')
            .attr('x', 4 * (this.svgWidth / 6) + 25)
            .attr('y', this.svgHeight - 80)
            .text('Female: 58.7%')
            .attr('opacity', 0);
    }

    onFocusEntered() {
        this.doughnutChart
            .transition()
            .duration(600)
            .attr('opacity', 1);

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
        this.doughnutChart
            .transition()
            .duration(600)
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

}