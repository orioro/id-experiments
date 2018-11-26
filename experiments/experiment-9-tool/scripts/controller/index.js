import Tone from 'tone'

import { tonePlayerFromFileInput } from '../auxiliary'

const createController = (rootElement) => {
	const DATA = {
		audios: []
	}

	// elements
	const audioInput = rootElement.querySelector('input[name="audio-input"]')
	const audiosContainer = rootElement.querySelector('#audios-container')

	audiosContainer.addEventListener('change', e => {


		DATA.audios.forEach(audio => {
			if (audio.element.getAttribute('checked')) {
				audio.player.start()
			} else {
				audio.player.stop()
			}
		})
	})

	const addAudio = (name, player) => {
		const element = document.createElement('label')
		element.innerHTML = `<input type="checkbox" name="selected-audios" value="${name}">${name}`
		audiosContainer.appendChild(element)

		DATA.audios.push({
			name,
			player,
			element
		})
	}

	audioInput.addEventListener('change', e => {
		audioInput.setAttribute('disabled', true)

		const name = audioInput.files[0].name

		tonePlayerFromFileInput(audioInput).then(player => {
			addAudio(name, player)

			audioInput.value = null
			audioInput.removeAttribute('disabled')
		})
		.catch(err => console.log(err))
	})

	const getData = () => {
		return DATA
	}

	return {
		getData
	}
}

export default createController
