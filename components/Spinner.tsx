import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface SpinnerProps {
  size?: number;
  color?: string;
  borderWidth?: number;
  overlay?: boolean;
  overlayColor?: string;
}

export default function Spinner({ 
  size = 50, 
  color = '#db2b00', 
  borderWidth = 5, 
  overlay = false,
  overlayColor = 'rgba(0, 0, 0, 0.0)'
}: SpinnerProps) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();
    return () => spinAnimation.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinnerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: borderWidth,
    borderTopColor: color,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  };

  if (overlay) {
    return (
      <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
        <View style={styles.container}>
          <Animated.View style={[spinnerStyle, { transform: [{ rotate: spin }] }]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[spinnerStyle, { transform: [{ rotate: spin }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
