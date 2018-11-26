import Tone from 'tone'
import 'whatwg-fetch'

export const readFileInput = input => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		const _resolve = () => {
			resolve(reader.result)
		}

		const _reject = () => {
			reject(reader.error)
		}

		reader.onload = _resolve
		reader.onerror = _reject
		reader.onabort = _reject

		reader.readAsArrayBuffer(input.files[0])
	})
}

export const audioBufferFromFileInput = input => {
	return readFileInput(input).then(buffer => Tone.context.decodeAudioData(buffer))
}

export const tonePlayerFromFileInput = (input, options) => {
	return audioBufferFromFileInput(input).then(audioBuffer => {
		return new Tone.Player({
			url: audioBuffer,
			loop: true,
			...options,
		})
	})
}

export const tonePlayerFromUrl = (url, options) => {
	return window.fetch(url).then(res => {
		return Tone.context.decodeAudioData(res)
	})
	.then(audioBuffer => {
		return new Tone.Player({
			url: audioBuffer,
			loop: true,
			...options
		})
	})
}
