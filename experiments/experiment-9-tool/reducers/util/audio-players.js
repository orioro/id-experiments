import Tone from 'tone'
import 'whatwg-fetch'

export const readFile = file => {
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

		reader.readAsArrayBuffer(file)
	})
}

export const audioBufferFromFile = file => {
	return readFile(file).then(buffer => Tone.context.decodeAudioData(buffer))
}

export const tonePlayerFromFile = (file, options) => {
	return audioBufferFromFile(file).then(audioBuffer => {
		const player = new Tone.Player({
			url: audioBuffer,
			loop: true,
			...options,
		})

		player.connect(Tone.Master)

		return player
	})
}

export const tonePlayerFromUrl = (url, options) => {
	return window.fetch(url)
		.then(res => res.arrayBuffer())
		.then(buffer => Tone.context.decodeAudioData(buffer))
		.then(audioBuffer => {
			const player = new Tone.Player({
				url: audioBuffer,
				loop: true,
				...options
			})
			
			player.connect(Tone.Master)

			return player
		})
}
