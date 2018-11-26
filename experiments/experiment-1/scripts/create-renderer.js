import * as d3 from 'd3'

const $svg = d3.select('#svg')

const createRenderer = ({ svgSelector, waveformLength }) => {
	const $svg = d3.select(svgSelector)
	const $path = $svg.append('path')
	  .attr('stroke', 'black')
	  .attr('stroke-width', '2')
	  .attr('fill', 'none')

	const scaleX = d3.scaleLinear()
		.domain([0, waveformLength - 1])
		.range([
			0,
			window.innerWidth
		])
	const scaleY = d3.scaleLinear()
		.domain([-1, 1])
		.range([
			0,
			window.innerHeight
		])

	const drawLine = d3.line()
	  .curve(d3.curveCatmullRom.alpha(0.5))
		.x((d, index) => {
			return scaleX(index)
		})
		.y((d, index) => {
			return scaleY(d)
		})

	const render = (values) => {
		$path
			// .transition()
	  	// .duration(100)
	  	// .ease(d3.easeElastic)
	  	.attr('d', drawLine(values))
	}

	return render
}

export default createRenderer
