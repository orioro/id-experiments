import Tone from 'tone'

export default (audios) => {
	return new Promise((resolve, reject) => {
		let players = {}

		audios.forEach(audio => {
			let player = new Tone.Player({
				url: audio.url,
				loop: audio.loop,
			})

			player.playbackRate = 0.3

			players[audio.name] = player
		})

		Tone.Buffer.on('load', () => {
			resolve(players)
		})

		Tone.Buffer.on('error', reject)
	})
}
