// CustomNotificationPopup.js
import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CustomNotificationPopup({ visible, data, onClose }) {
  const popupOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(popupOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(popupOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onClose && onClose();
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible || !data) return null;

  return (
    <Animated.View style={[styles.popupContainer, { opacity: popupOpacity }]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          Animated.timing(popupOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onClose && onClose();
          });
        }}
      >
        <Text style={styles.popupTitle}>{data.title}</Text>
        <Text style={styles.popupBody}>{data.body}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: '#cc0000',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 7,
    zIndex: 9999,
  },
  popupTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  popupBody: {
    color: 'white',
    fontSize: 14,
  },
});
