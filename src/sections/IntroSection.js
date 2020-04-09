import * as d3 from 'd3';

export default class IntroSection {

    constructor(svg) {
        this.svg = svg;

        this.svgWidth = parseInt(this.svg.attr('width'));
        this.svgHeight = parseInt(this.svg.attr('height'));
    }

    onInit() {
        this.text = this.svg.append('text')
            .attr('x', this.svgWidth / 4)
            .attr('y', (this.svgHeight / 2) - 20)
            .style('font-size', '42px')
            .text('Young People Survey')
            .attr('opacity', 0);
    }

    onFocusEntered() {
        this.text.transition()
            .duration(600)
            .attr('opacity', 1);
    }

    onFocusLost() {
        this.text.transition()
            .duration(600)
            .attr('opacity', 0);
    }
}