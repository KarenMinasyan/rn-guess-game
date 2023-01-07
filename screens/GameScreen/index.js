import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text, FlatList, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Title from '../../components/common/Title/Title';
import NumberContainer from '../../components/NumberContainer';
import PrimaryButton from '../../components/common/PrimaryButton';
import Card from '../../components/common/Card';
import InstructionText from '../../components/common/InstructionText';
import GuessLogItem from '../../components/GuessLogItem';

const generateRandomNumber = (min, max, exclude) => {
	const rndNum = Math.floor(Math.random() * (max - min)) + min;

	if (rndNum === exclude) {
		return generateRandomNumber(min, max, exclude);
	}

	return rndNum;
};

let minBoundary = 1;
let maxBoundary = 100;

const GameScreen = ({ userNumber, onGameOver }) => {
	const initialGuess = generateRandomNumber(1, 100, userNumber);
	const [currentGuess, setCurrentGuess] = useState(initialGuess);
	const [guessRounds, setGuessRounds] = useState([initialGuess]);

	const { width, height } = useWindowDimensions();

	useEffect(() => {
		if (currentGuess === userNumber) {
			onGameOver(guessRounds.length);
		}
	}, [currentGuess, userNumber, onGameOver]);

	useEffect(() => {
		minBoundary = 1;
		maxBoundary = 100;
	}, []);

	const nextGuessHandler = (direction) => () => {
		if ((direction === 'lower' && currentGuess < userNumber) || (direction === 'greater' && currentGuess > userNumber)) {
			Alert.alert('Don\'t lie!', 'You know that is wrong...', [{ text: 'Sorry!', style: 'cancel' }]);
			return;
		}

		if (direction === 'lower') {
			maxBoundary = currentGuess;
		} else {
			minBoundary = currentGuess + 1;
		}
		const newRndNumber = generateRandomNumber(minBoundary, maxBoundary, currentGuess);
		setCurrentGuess(newRndNumber);
		setGuessRounds(prev => [newRndNumber, ...prev]);
	};


	let content = <>
		<NumberContainer>
			{currentGuess}
		</NumberContainer>
		<Card>
			<InstructionText style={styles.instructionText}>Higher or Lower?</InstructionText>
			<View style={styles.buttonsContainer}>
				<View style={styles.buttonContainer}>
					<PrimaryButton onPress={nextGuessHandler('lower')}>
						<Ionicons name="md-remove" size={24} color="white"/>
					</PrimaryButton>
				</View>
				<View style={styles.buttonContainer}>
					<PrimaryButton onPress={nextGuessHandler('greater')}>
						<Ionicons name="md-add" size={24} color="white"/>
					</PrimaryButton>
				</View>
			</View>
		</Card>
	</>;

	if (width > 500) {
		content = <>
			<View style={styles.buttonsContainerWide}>
				<View style={styles.buttonContainer}>
					<PrimaryButton onPress={nextGuessHandler('lower')}>
						<Ionicons name="md-remove" size={24} color="white"/>
					</PrimaryButton>
				</View>
				<NumberContainer>{currentGuess}</NumberContainer>
				<View style={styles.buttonContainer}>
					<PrimaryButton onPress={nextGuessHandler('greater')}>
						<Ionicons name="md-add" size={24} color="white"/>
					</PrimaryButton>
				</View>
			</View>
		</>
	}

	return (
		<View style={styles.screen}>
			<Title>Opponent's Guess</Title>
			{content}
			<View style={styles.listContainer}>
				<FlatList
					data={guessRounds}
					renderItem={itemData => <GuessLogItem
						roundNumber={guessRounds.length - itemData.index}
						guess={itemData.item}
					/>}
					keyExtractor={item => item}
				/>
			</View>
		</View>
	);
};

export default GameScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		padding: 24,
		alignItems: 'center'
	},
	instructionText: {
		marginBottom: 12
	},
	buttonsContainer: {
		flexDirection: 'row',
	},
	buttonContainer: {
		flex: 1,
	},
	buttonsContainerWide: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	listContainer: {
		flex: 1,
		padding: 16
	}
});