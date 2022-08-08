import React from 'react';
import {
	View,
	StatusBar,
	useColorScheme,
} from 'react-native';

import { RemixPlayer } from './src/components/RemixPlayer';

export default function App() {
	const isDarkMode = useColorScheme() === 'dark';

	return (
		<View>
			<StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
			<RemixPlayer />
		</View>
	);
}
