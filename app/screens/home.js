import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  FlatList,
  Linking,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  Platform
} from 'react-native';
import { FontAwesome5, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const articles = [
  {
    id: '1',
    title: 'Why Donating Blood Saves Lives',
    image:
      'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=600&q=80',
    url: 'https://www.who.int/news-room/q-a-detail/blood-donation',
  },
  {
    id: '2',
    title: 'Health Benefits of Blood Donation',
    image:
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=60',
    url: 'https://www.redcrossblood.org/donate-blood/blood-donation-process/before-during-after.html',
  },
  {
    id: '3',
    title: 'Blood Donation Myths vs. Facts',
    image:
      'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=600&q=60',
    url: 'https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/blood-donation/art-20045790',
  },
];

const openInMaps = (location) => {
  const url = Platform.select({
    ios: `http://maps.apple.com/?q=${encodeURIComponent(location)}`,
    android: `geo:0,0?q=${encodeURIComponent(location)}`,
  });
  Linking.openURL(url);
};

const { width } = Dimensions.get('window');
const cardWidth = width * 0.6;
const patientCardWidth = width - 40;

export default function HomePage() {
  const router = useRouter();

const [patients, setPatients] = React.useState([]);
const [loading, setLoading] = React.useState(true);


  const fetchBloodRequests = async () => {
  try {
    const response = await fetch('https://seniorproject-1-3rbo.onrender.com/api/request/limit/4');
    const data = await response.json();
    console.log('API DATA:', data);
    console.log('\n');

    // Filter out completed requests
    const incompleteRequests = data.requests.filter((request) => request.done_status !== 'complete');
    setPatients(incompleteRequests);
  } catch (error) {
    console.error('Failed to fetch blood requests:', error);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchBloodRequests();
  }, []);

  const openLink = (url) => {
    Linking.openURL(url);
  };

  const renderArticle = ({ item }) => (
    <Pressable style={styles.card} onPress={() => openLink(item.url)}>
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.cardBackground}
        imageStyle={{ borderRadius: 10 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
      </ImageBackground>
    </Pressable>
  );

  const renderPatient = ({ item }) => (
  <View style={styles.patientCard}>
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name="blood-bag" size={50} color="#D32F2F" />
      <Text style={styles.bloodType}>{item.blood_type}</Text>
    </View>
    <View style={styles.patientDetails}>
      <Text style={styles.patientName}>{item.patient_name || 'Unknown Patient'}</Text>
      <Text>Quantity: {item.quantity} unit(s)</Text>
      <Pressable onPress={() => openInMaps(item.donation_point)}>
  <Text style={{ color: '#1e90ff', textDecorationLine: 'underline' }}>
    Donation Point: {item.donation_point}
  </Text>
</Pressable>
      <Text>Contact: {item.contact_number}</Text>
      <Text>Urgency: {item.urgency}</Text>
      <Text>Created At: {item.updatedAt.slice(0,10)}</Text>
      {item.description ? <Text>Description: {item.description}</Text> : null}
    </View>
  </View>
);


  return (
    <ScrollView style={styles.container}>
      {/* Slogan */}
      <Text style={styles.slogan}>Life is in your veins — PASS IT ON.</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.requestButton]}
          onPress={async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');
              if (token) {
                router.push('/screens/requestBlood');
              } else {
                router.push('/auth/login');
              }
            } catch (error) {
              console.error('Token check failed:', error);
              router.push('/auth/login');
            }
          }}
        >
          <FontAwesome5 name="tint" size={24} color="#fff" />
          <Text style={styles.requestText}>Request Blood</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.donateButton]}
          onPress={async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');
              if (token) {
                router.push('/screens/donateBlood');
              } else {
                router.push('/auth/login');
              }
            } catch (error) {
              console.error('Token check failed:', error);
              router.push('/auth/login');
            }
          }}
        >
          <FontAwesome name="heart" size={24} color="#D32F2F" />
          <Text style={styles.donateText}>Donate Blood</Text>
        </Pressable>
      </View>

      <Text style={styles.infoText}>
  Every drop counts. Blood donation is a simple act of kindness that can save lives, support medical treatments, and bring hope to families. Your generosity can be the reason someone gets a second chance at life.
</Text>

      {/* Articles Section */}
      <Text style={styles.sectionTitle}>Things you may be interested to read</Text>
      <FlatList
        horizontal
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 20}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 10 }}
        style={styles.carousel}
      />

      {/* Patients Section */}
      <View>
      <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
        Brothers in need for blood {'\n'}
        <Text style={{ color: '#D32F2F', fontWeight: 'bold' }}>
          LET’S DONATE <FontAwesome name="heart" size={16} color="#D32F2F" />
        </Text>
      </Text>

      {/* "See more →" pressable text */}
      <Pressable onPress={() => router.push('/screens/bloodRequests')}>
  <View style={{ alignItems: 'flex-end', marginTop: 0 }}>
    <Text style={{ color: '#1976D2', fontWeight: 'bold', fontSize: 18 }}>
      See All Requests →
    </Text>
  </View>
</Pressable>
    </View>

      {loading ? (
        <ActivityIndicator size="large" color="#D32F2F" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={patients}
          renderItem={renderPatient}
          keyExtractor={(item) => item._id || item.user_id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 10 }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
    padding: 20,
    paddingTop: 30,
  },
  slogan: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  button: {
    width: width / 2 - 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    gap: 10,
  },
  requestButton: {
    backgroundColor: '#D32F2F',
  },
  donateButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#D32F2F',
  },
  requestText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  donateText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  carousel: {
    marginTop: 5,
  },
  card: {
    width: cardWidth,
    marginRight: 20,
    borderRadius: 10,
    overflow: 'hidden',
    height: 120,
    elevation: 15,
    marginBottom: 10,
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    padding: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  patientCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    width: patientCardWidth,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  bloodType: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  patientDetails: {
    justifyContent: 'center',
  },
  patientName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  infoText: {
  fontSize: 16,
  color: '#333',
  textAlign: 'center',
  marginBottom: 25,
  paddingHorizontal: 10,
  lineHeight: 22,
},
});
