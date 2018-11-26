import * as d3 from 'd3'
const $svg = d3.select('#svg')

const createArray = (length, fn) => {
	return new Array(length).fill(null).map((v, index) => {
		return fn(index)
	})
}

const growingLineData = ({ initial, growthRate, length }) => {
	return createArray(length, (index) => {
		return {
			x: index,
			y: initial * Math.pow(growthRate, index * 2 / 3)
		}
	})
}

const createRenderer = () => {
	
}

const drawLine = ({ data, xDomain, xRange, yDomain, yRange }) => {
	const scaleX = d3.scaleLinear()
		.domain(xDomain || d3.extent(data, d => d.x))
		.range(xRange)
	const scaleY = d3.scaleLinear()
		.domain(yDomain || d3.extent(data, d => d.y))
		.range(yRange)

	return d3.line()
		.x(d => scaleX(d.x))
		.y(d => scaleY(d.y))(data)
}

const paths = createArray(15, index => {
	return {
		$element: $svg.append('path')
		  .attr('stroke', 'black')
		  .attr('stroke-width', '2')
		  .attr('fill', 'none')
		  .attr('transform', `translate(0, ${window.innerHeight / 2})`),
		data: growingLineData({
			initial: 1,
			growthRate: 1 + index * 0.001,
			length: 200,
		})
	}
})

const yDomain = d3.extent(paths.reduce((acc, p) => {
	return acc.concat(p.data.map(d => d.y))
}, []))

paths.forEach(({ $element, data }) => {
	$element.attr('d', drawLine({
		data,
		xRange: [50, window.innerWidth - 50],
		yDomain: yDomain,
		yRange: [0, window.innerHeight / 2 - 50],
	}))
})
