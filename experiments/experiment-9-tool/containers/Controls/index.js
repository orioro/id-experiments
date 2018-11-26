import React from 'react'
import { connect } from 'react-redux'

import {
	playAudio,
	pauseAudio,
	stopAudio
} from '../../reducers/audios/actions'

import AudioList from '../../components/AudioList'

const noop = () => {}

class Controls extends React.Component {
	render() {
		const props = this.props
		const { audios } = props
		return <div>
			<AudioList
				audios={audios}
				onPlayAudio={props.playAudio}
				onPauseAudio={props.pauseAudio}
				onStopAudio={props.stopAudio}/>
		</div>
	}
}

const mapStateToProps = state => {
	return {
		audios: state.audios.idList.map(id => state.audios.byId[id])
	}
}

const mapDispatchToProps = {
	playAudio,
	pauseAudio,
	stopAudio
}

export default connect(mapStateToProps, mapDispatchToProps)(Controls)
