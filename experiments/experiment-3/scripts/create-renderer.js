import * as d3 from 'd3'

const $svg = d3.select('#svg')

const createRenderer = ({ svgSelector, waveformLength }) => {
	const $svg = d3.select(svgSelector)

	const createPath = ({ stroke = 'black', strokeWidth = 1 } = {}) => {
		return $svg.append('path')
		  .attr('stroke', stroke)
		  .attr('stroke-width', '2')
		  .attr('fill', 'none')
	}

	const $paths = Array(10).fill(null).map((v, index) => {
		return createPath()
	})

	const scaleX = d3.scaleLinear()
		.domain([0, waveformLength - 1])
		.range([
			0,
			window.innerWidth
		])
	const scaleY = d3.scalePow(20)
		.domain([-1, 1])
		.range([
			0,
			window.innerHeight
		])

	const drawLine = d3.line()
		.x(d => d.x)
		.y(d => d.y)


	const sound = values => values.map((v, index) => {
		return {
			x: scaleX(index),
			y: scaleY(v)
		}
	})

	const grow = (values, growthRate) => values.map((v, index) => {
		return {
			x: scaleX(index),
			y: scaleY(v * Math.pow(growthRate, index * 2))
		}
	})


	const render = (values) => {
		values = Array.from(values)

		$paths.forEach(($path, index) => {

			const growthRate = 1 + index * 0.0005

			$path.attr('d', drawLine(grow(values, growthRate)))
		})
	}

	return render
}

export default createRenderer
