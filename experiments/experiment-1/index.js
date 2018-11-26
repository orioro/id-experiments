import Tone from 'tone'

import createRenderer from './scripts/create-renderer'

const microphoneToggle = document.querySelector('#microphone-toggle')

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


const loop = () => {
	requestAnimationFrame(loop)
	render(audioNodes.waveform.getValue())
}
loop()

