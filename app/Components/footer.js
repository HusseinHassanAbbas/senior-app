import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <View style={styles.footerTop}>
        <Text style={styles.footerText}>
          © 2025 Blood Donation App{' '}
          <FontAwesome name="heart" size={16} color="#D32F2F" />
        </Text>
      </View>
      <View style={styles.footerBottom}>
        <Text style={styles.footerTagline}>Saving lives together, one drop at a time.</Text>
        <View style={styles.socialIcons}>
          {['facebook', 'twitter', 'instagram'].map((name) => (
            <Pressable
              key={name}
              style={({ pressed }) => [
                styles.iconWrapper,
                pressed && { opacity: 0.6 },
              ]}
              onPress={() => {
                const urls = {
                  facebook: 'https://facebook.com',
                  twitter: 'https://twitter.com',
                  instagram: 'https://instagram.com',
                };
                Linking.openURL(urls[name]);
              }}
            >
              <Entypo name={name} size={28} color="#D32F2F" />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 20,
    backgroundColor: '#FFF5F5',
    borderTopWidth: 1,
    borderTopColor: '#D32F2F',
  },
  footerTop: {
    alignItems: 'center',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  footerBottom: {
    alignItems: 'center',
  },
  footerTagline: {
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  iconWrapper: {
    marginHorizontal: 10,
  },
});
