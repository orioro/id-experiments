import createRenderer from './scripts/create-renderer'

const render = createRenderer({
	svgSelector: '#svg',
	waveformLength: 256,
})

const Meyda = window.Meyda

const audioContext = new AudioContext()

const audioElements = Array.from(document.querySelectorAll('audio'))

const audios = audioElements.map(element => {
	// Create an "Audio Node" from the Audio Element
	const source = audioContext.createMediaElementSource(element)
	// Connect the Audio Node to your speakers. Now that the audio lives in the
	// Audio Context, you have to explicitly connect it to the speakers in order to
	// hear it
	source.connect(audioContext.destination)

	const analyzer = Meyda.createMeydaAnalyzer({
		audioContext,
		source,
		bufferSize: 512,
		featureExtractors: ['rms', 'amplitudeSpectrum'],
		callback: features => {
			render(features.amplitudeSpectrum)

			console.log(features.amplitudeSpectrum)
		}
	})

	analyzer.start()

	return {
		element,
		source,
		analyzer
	}
})

