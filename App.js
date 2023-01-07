import { useCallback, useEffect, useState } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import StartGameScreen from './screens/StartGameScreen';
import GameOverScreen from './screens/GameOverScreen';
import GameScreen from './screens/GameScreen';
import Colors from './constants/colors';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

const App = () => {
	const [userNumber, setUserNumber] = useState();
	const [gameIsOver, setGameIsOver] = useState(true);
	const [appIsReady, setAppIsReady] = useState(false);
	const [guessRounds, setGuessRounds] = useState(0);

	useEffect(() => {
		async function prepare() {
			try {
				await Font.loadAsync({
					'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
					'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
				});
				await new Promise(resolve => setTimeout(resolve, 2000));
			} catch (e) {
				console.warn(e);
			} finally {
				setAppIsReady(true);
			}
		}

		prepare();
	}, []);

	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	const pickedNumberHandler = (pickedNumber) => {
		setUserNumber(pickedNumber);
		setGameIsOver(false);
	};

	const gameOverHandler = (numberOfRounds) => {
		setGameIsOver(true);
		setGuessRounds(numberOfRounds);
	};

	const startNewGameHandler = () => {
		setUserNumber(null);
		setGuessRounds(0);
	};

	let screen = <StartGameScreen onPickNumber={pickedNumberHandler}/>;

	if (userNumber) {
		screen = <GameScreen userNumber={userNumber} onGameOver={gameOverHandler}/>;
	}

	if (gameIsOver && userNumber) {
		screen = <GameOverScreen
			userNumber={userNumber}
			roundsNumber={guessRounds}
			onStartNewGame={startNewGameHandler}
		/>;
	}

	if (!appIsReady) {
		return null;
	}

	return (
		<>
			<StatusBar style='light' />
			<LinearGradient
				colors={[Colors.primary700, Colors.accent500]}
				style={styles.rootScreen}
				onLayout={onLayoutRootView}
			>
				<ImageBackground
					style={styles.rootScreen}
					source={require('./assets/imgs/background.png')}
					resizeMode="cover"
					imageStyle={styles.backgroundImage}
				>
					<SafeAreaView style={styles.rootScreen}>
						{screen}
					</SafeAreaView>
				</ImageBackground>
			</LinearGradient>
		</>
	);
};

const styles = StyleSheet.create({
	rootScreen: {
		flex: 1,
	},
	backgroundImage: {
		opacity: 0.15
	}
});

export default App;