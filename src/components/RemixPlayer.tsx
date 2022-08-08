import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, TextInput, Pressable, Image} from 'react-native';
import Sound from 'react-native-sound';

import { destinationPath } from '../lib/fs';

import fs from '../lib/fs';

Sound.setCategory('Playback');

export const RemixPlayer: React.FC = () => {
	const [input, setInput] = React.useState('');
	const [audio, setAudio] = React.useState(new Sound(''));

	React.useEffect(() => {
		audio.setVolume(1);
		return () => {
			audio.release();
		};
	}, [audio]);

	const onInputChange = (text: string) => {
		setInput(text);
	};

	const tapPlay = async () => {
		if(!audio.isLoaded()) {
			const sound = new Sound(destinationPath(), null, (error) => {
				if(!error) {
					sound.play();
				}
			});
			setAudio(sound);
		} else {
			audio.play();
		}
	};

	const download = async () => {
		try {
			const {promise} = await fs.downloadAudio(input);
			await promise;
			tapPlay();
		} catch (error: any) {
			console.log('error', error);
		}
	};

	return (
		<SafeAreaView style={styles.playerContainer}>
			<View style={{flex: 1, marginHorizontal: 16}}>
				<Text style={{marginTop: 25, marginBottom: 5}}>
					* Put the download link here.
				</Text>
				<View style={styles.linkContainer}>
					<TextInput value={input} onChangeText={onInputChange} style={styles.textInput}/>
					<Pressable style={styles.submitButton} onPress={download} >
						<Text style={{fontSize: 18, fontWeight: '500'}}>
							Submit
						</Text>
					</Pressable>
				</View>
				<View style={styles.downloadContainer}>
					<Pressable onPress={tapPlay} style={styles.playButton}>
						<Image source={require('../assets/images/play.png')} style={{ width: 50, height: 50, borderRadius: 25 }} />
					</Pressable>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	playerContainer: {
		height: '100%',
		backgroundColor: 'rgba(45, 202, 257, 0.57)',
	},
	linkContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',

	},
	textInput: {
		height: 40,
		borderWidth: 1,
		width: '65%',
		borderRadius: 10,
		backgroundColor: '#FFF'
	},
	submitButton: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'green',
		height: 40,
		width: '30%',
		borderRadius: 10,
		fontSize: 20,
		fontWeight: 900,
	},
	downloadContainer: {
		borderWidth: 1,
		position: 'relative',
		height: 200,
	},
	playButton: {
		position: 'absolute',
		bottom: 0,
		marginHorizontal: 'auto',
	}
});
