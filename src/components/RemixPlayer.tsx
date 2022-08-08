import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, TextInput, Pressable, Image} from 'react-native';
import Sound from 'react-native-sound';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import fs, { destinationPath } from '../lib/fs';

Sound.setCategory('Playback');

const RADIUS = 50;
const CIRCLE_LENGTH = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const RemixPlayer: React.FC = () => {
	const [input, setInput] = React.useState('');
	const [audio, setAudio] = React.useState(new Sound(''));
	const [progress, setProgress] = React.useState(0);
	const [isPlaying, setIsPlaying] = React.useState(false);

	// to show download progress.
	const circleProgress = useSharedValue(0);
	// playBtn initial value is the same as top css property of play button.
	// I m modifying css top property 0 to run the play animation.
	const playbtn = useSharedValue(140);

	React.useEffect(() => {
		audio.setVolume(1);
		return () => {
			audio.release();
		};
	}, [audio]);

	React.useEffect(() => {
		circleProgress.value = progress;
	}, [progress]);

	React.useEffect(() => {
		if (isPlaying) {
			playbtn.value = withTiming(0, {duration: 1000});
		}
	}, [isPlaying]);

	const animatedProps = useAnimatedProps(() => ({
		strokeDashoffset: CIRCLE_LENGTH * (1 - circleProgress.value),
	}));

	const reanimatedStyle = useAnimatedStyle(() => ({
		top: playbtn.value,
	}));

	const onInputChange = React.useCallback((text: string) => {
		setInput(text);
	}, []);

	const tapPlay = React.useCallback(async () => {
		if(!audio.isLoaded()) {
			const sound = new Sound(destinationPath(), undefined, (error) => {
				if(!error) {
					sound.play();
					setIsPlaying(true);
					setProgress(1);
				}
			});
			setAudio(sound);
		} else {
			audio.play();
		}
	}, [audio, setAudio, setIsPlaying, setProgress]);

	const download = React.useCallback(async () => {
		try {
			const {promise} = await fs.downloadAudio(input, {
				progressDivider: 5,
				progress: ({contentLength, bytesWritten}) => {
					const p = Math.floor((bytesWritten / contentLength) * 10);
					setProgress(p/10);
				}
			});
			await promise;
			tapPlay();
			setProgress(1);
		} catch (error: any) {
			console.log('error', error);
		}
	}, [input, setProgress]);

	return (
		<SafeAreaView style={styles.playerContainer}>
			<View style={{flex: 1, marginHorizontal: 16}}>
				<Text style={{marginTop: 25, marginBottom: 5, color: '#FFF'}}>
					* Put the download link here.
				</Text>
				<View style={styles.linkContainer}>
					<TextInput value={input} onChangeText={onInputChange} style={styles.textInput}/>
					<Pressable style={styles.submitButton} onPress={download} >
						<Text style={{fontSize: 18, fontWeight: '500', color: '#FFF'}}>
							Submit
						</Text>
					</Pressable>
				</View>
				<View style={styles.downloadContainer}>
					<Animated.View style={[styles.playButton, reanimatedStyle]} >
						<Pressable onPress={tapPlay}>
							<Svg style={{position: 'absolute'}}>
								<AnimatedCircle
									cx={70}
									cy={70}
									r={50}
									stroke={'green'}
									strokeWidth={30}
									strokeDasharray={CIRCLE_LENGTH}
									animatedProps={animatedProps}
								/>
							</Svg>
							<Image source={require('../assets/images/play.png')} style={{ width: 100, height: 100, borderRadius: 50, marginHorizontal: 20, marginVertical: 20 }} />
						</Pressable>
					</Animated.View>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	playerContainer: {
		height: '100%',
		backgroundColor: '#444B6F',
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
		position: 'relative',
		height: 280,
		marginBottom: 50
	},
	playButton: {
		position: 'absolute',
		marginHorizontal: 'auto',
		left: '31%',
		top: 140
	}
});
