import Tone from 'tone'

import createRenderer from './scripts/create-renderer'
import loadPlayers from './scripts/load-players'

const render = createRenderer({
	svgSelector: '#svg',
	waveformLength: 256,
})

const audioNodes = {
	waveform: new Tone.Waveform(256),
	synth: new Tone.Synth(),
	microphone: new Tone.UserMedia(),
}

// connect audio nodes
audioNodes.synth.fan(Tone.Master, audioNodes.waveform)

document.documentElement.addEventListener('mousedown', e => {
	audioNodes.synth.triggerAttack('C4')
})

document.documentElement.addEventListener('mouseup', e => {
	audioNodes.synth.triggerRelease()
})


// mic
const microphoneToggle = document.querySelector('#microphone-toggle')
microphoneToggle.addEventListener('change', (e) => {
	if (microphoneToggle.checked) {
		// opening the input asks the user to activate their mic
		audioNodes.microphone.open().then(function(){
			audioNodes.microphone.connect(audioNodes.waveform)
		})
	} else {
		audioNodes.microphone.disconnect(audioNodes.waveform)
	}
})


loadPlayers([
  {
    name: 'blackrole',
    url: '../resources/blackrole.ogg',
    loop: true,
  },
  {
    name: 'internet',
    url: '../resources/internet.ogg',
    loop: true,
  },
  {
    name: 'water_01',
    url: '../resources/water_01.ogg',
    loop: true,
  },
])
.then(players => {

	// players
	const soundsToggle = Array.from(document.querySelectorAll('input[name="sound"]'))
	soundsToggle.forEach(toggle => {
		toggle.addEventListener('change', e => {
			const player = players[toggle.value]

			if (!player) {
				console.warn(`could not find player ${toggle.value}`)
				return
			}

			if (toggle.checked) {
				player.connect(audioNodes.waveform)
				player.connect(Tone.Master)
				player.start()
			} else {
				player.disconnect(audioNodes.waveform)
				player.disconnect(Tone.Master)
				player.stop()
			}
		})
	})

	const loop = () => {
		requestAnimationFrame(loop)
		render(audioNodes.waveform.getValue())
	}
	loop()
})

