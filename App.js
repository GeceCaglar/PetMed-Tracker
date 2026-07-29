import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  PanResponder,
  Dimensions,
  TextInput,
  Modal,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import * as ImagePicker from 'expo-image-picker';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PETS_KEY = '@petmed_pets';

/* =========================================================
   DEMO PAYLAŞIMLAR
========================================================= */

const POSTS = [
  {
    id: 1,
    petName: 'Pamuk',
    breed: 'British Shorthair',
    age: '4 yaş',
    city: 'İstanbul',
    owner: 'Zeynep',
    title: 'Alerji problemi yaşadık',
    story:
      'Yaklaşık iki haftadır sürekli kaşınıyordu. Veterinere götürdük, alerji olduğu söylendi ve tedavimize başladık.',
    tags: ['Alerji', 'Kedi', 'Deri Sağlığı'],
    image:
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=900',
    comments: 12,
    helpful: 24,
    vets: 2,
  },
  {
    id: 2,
    petName: 'Boncuk',
    breed: 'Golden Retriever',
    age: '3 yaş',
    city: 'İstanbul',
    owner: 'Mert',
    title: 'Kulak problemi yaşamıştık',
    story:
      'Boncuk sürekli kulağını kaşıyordu. Veteriner kontrolünden sonra tedaviye başladık ve birkaç gün içinde rahatladı.',
    tags: ['Köpek', 'Kulak', 'Deneyim'],
    image:
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=900',
    comments: 8,
    helpful: 31,
    vets: 1,
  },
  {
    id: 3,
    petName: 'Misket',
    breed: 'Tekir',
    age: '2 yaş',
    city: 'Ankara',
    owner: 'Selin',
    title: 'İştahsızlık yaşamaya başladı',
    story:
      'Misket birkaç gün boyunca normalden az yemek yiyordu. Veteriner kontrolüne götürdük ve süreci yakından takip ettik.',
    tags: ['Kedi', 'İştahsızlık', 'Deneyim'],
    image:
      'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=900',
    comments: 16,
    helpful: 42,
    vets: 3,
  },
];

/* =========================================================
   VETERİNERLER
========================================================= */

const VETS = [
  {
    id: 1,
    name: 'Dr. Ayşe Yılmaz',
    clinic: 'PetLife Veteriner Kliniği',
    city: 'Çekmeköy, İstanbul',
    specialties: ['Dermatoloji', 'Kedi', 'Köpek'],
    experience: '9 yıl',
    answers: 128,
    rating: '4.9',
    reviews: 186,
    fee: 900,
    about: 'Kedi ve köpeklerde dermatoloji, koruyucu hekimlik ve genel muayene alanlarında çalışıyor.',
    hours: 'Pzt–Cmt • 09:00–19:00',
    comments: ['Çok ilgili ve açıklayıcıydı.', 'Kedimizle çok sakin ilgilendi.', 'Tedavi sürecini detaylı anlattı.'],
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500',
  },
  {
    id: 2,
    name: 'Dr. Mehmet Kaya',
    clinic: 'VetCare Hayvan Sağlığı',
    city: 'Kadıköy, İstanbul',
    specialties: ['İç Hastalıkları', 'Kedi', 'Köpek'],
    experience: '12 yıl',
    answers: 214,
    rating: '4.8',
    reviews: 241,
    fee: 1000,
    about: 'İç hastalıkları, rutin kontroller ve kedi-köpek sağlığı alanlarında deneyimli veteriner hekim.',
    hours: 'Pzt–Paz • 10:00–20:00',
    comments: ['Teşhis sürecini anlaşılır anlattı.', 'Kliniği temiz ve düzenliydi.', 'Kontrol sonrası da ilgilendi.'],
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500',
  },
];

/* =========================================================
   KÖPEK GEZDİRİCİLER
========================================================= */

const WALKERS = [
  {
    id: 1,
    name: 'Ece Yılmaz',
    location: 'Çekmeköy, İstanbul',
    distance: '1,2 km',
    rating: '4.9',
    reviews: 126,
    walks: 384,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500',
    bio:
      '3 yıldır profesyonel olarak köpek gezdiriyorum. Büyük ve küçük ırklarla deneyimliyim.',
    price30: 250,
    price60: 400,
  },
  {
    id: 2,
    name: 'Can Demir',
    location: 'Ümraniye, İstanbul',
    distance: '3,4 km',
    rating: '4.8',
    reviews: 89,
    walks: 241,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500',
    bio:
      'Köpeklerle vakit geçirmeyi seviyorum. Yürüyüşlerde rota ve fotoğraf paylaşımı yapıyorum.',
    price30: 225,
    price60: 375,
  },
  {
    id: 3,
    name: 'Deniz Acar',
    location: 'Sancaktepe, İstanbul',
    distance: '4,1 km',
    rating: '4.7',
    reviews: 64,
    walks: 173,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
    bio:
      'Aktif yürüyüşleri ve enerjik köpeklerle uzun park rotalarını tercih ediyorum.',
    price30: 200,
    price60: 350,
  },
];

/* =========================================================
   HİZMETLER
========================================================= */


const MARKETPLACE_SERVICES = {
  hotel: {
    title: 'Pet Otelleri',
    subtitle: 'Güvenilir konaklama seçenekleri',
    unit: 'gece',
    providers: [
      {
        id: 'hotel-1',
        name: 'Pati Garden Pet Hotel',
        location: 'Çekmeköy, İstanbul',
        rating: '4.9',
        reviews: 184,
        price: 950,
        verified: true,
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=900',
        description: 'Kedi ve köpekler için oyun alanı, günlük fotoğraf paylaşımı ve kontrollü konaklama.'
      },
      {
        id: 'hotel-2',
        name: 'Happy Tails Hotel',
        location: 'Sancaktepe, İstanbul',
        rating: '4.8',
        reviews: 121,
        price: 800,
        verified: true,
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900',
        description: 'Günlük yürüyüş, oyun zamanı ve ayrı dinlenme alanları bulunan pet oteli.'
      }
    ]
  },
  sitter: {
    title: 'Pet Bakıcıları',
    subtitle: 'Evinde veya bakıcının evinde bakım',
    unit: 'gün',
    providers: [
      {
        id: 'sitter-1',
        name: 'Elif Kaya',
        location: 'Çekmeköy, İstanbul',
        rating: '4.9',
        reviews: 96,
        price: 700,
        verified: true,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700',
        description: 'Kedi ve köpek bakımı, mama takibi, oyun ve günlük fotoğraf bilgilendirmesi.'
      },
      {
        id: 'sitter-2',
        name: 'Berk Aydın',
        location: 'Ümraniye, İstanbul',
        rating: '4.8',
        reviews: 73,
        price: 650,
        verified: true,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700',
        description: 'Ev ziyareti ve günlük bakım hizmeti. Küçük ve orta ırk köpeklerle deneyimli.'
      }
    ]
  },
  trainer: {
    title: 'Köpek Eğitmenleri',
    subtitle: 'Profesyonel eğitim hizmetleri',
    unit: 'seans',
    providers: [
      {
        id: 'trainer-1',
        name: 'Mert Aksoy',
        location: 'Çekmeköy, İstanbul',
        rating: '4.9',
        reviews: 142,
        price: 1200,
        verified: true,
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=700',
        description: 'Temel itaat, yavru köpek eğitimi, tasma yürüyüşü ve davranış çalışmaları.'
      },
      {
        id: 'trainer-2',
        name: 'Selin Demir',
        location: 'Kadıköy, İstanbul',
        rating: '4.8',
        reviews: 108,
        price: 1350,
        verified: true,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=700',
        description: 'Pozitif pekiştirme odaklı temel itaat ve ev içi davranış eğitimi.'
      }
    ]
  }
};

const SERVICES = [
  {
    id: 'askVet',
    icon: '✚',
    title: 'Veterinere Sor',
    subtitle: 'Doğrulanmış veterinerlerden bilgi al',
  },
  {
    id: 'findVet',
    icon: '♡',
    title: 'Veteriner Bul',
    subtitle: 'Yakınındaki veterinerleri keşfet',
  },
  {
    id: 'tracker',
    icon: '⌖',
    title: 'PetMed Tracker',
    subtitle: 'Güvenilir köpek gezdiricileri',
  },
  {
    id: 'hotel',
    icon: '⌂',
    title: 'Pet Otelleri',
    subtitle: 'Kedi ve köpek konaklama hizmetleri',
  },
  {
    id: 'sitter',
    icon: '♙',
    title: 'Pet Bakıcısı',
    subtitle: 'Evinde veya bakıcının evinde bakım',
  },
  {
    id: 'trainer',
    icon: '★',
    title: 'Köpek Eğitmenleri',
    subtitle: 'Profesyonel eğitim hizmetleri',
  },
  {
    id: 'health',
    icon: '♥',
    title: 'Sağlık Karnesi',
    subtitle: 'Aşı, ilaç ve sağlık geçmişi',
  },
  {
    id: 'reminders',
    icon: '◷',
    title: 'Hatırlatıcılar',
    subtitle: 'İlaç, aşı ve bakım zamanları',
  },
  {
    id: 'lost',
    icon: '!',
    title: 'Kayıp Evcil Dostum',
    subtitle: 'Çevrendeki kullanıcılara hızlı ilan',
  },
  {
    id: 'places',
    icon: '⌖',
    title: 'Pet Dostu Yerler',
    subtitle: 'Park, kafe ve pet dostu mekanlar',
  },
];

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('discover');
  const [serviceScreen, setServiceScreen] = useState(null);

  const [cardIndex, setCardIndex] = useState(0);
  const [helpfulPosts, setHelpfulPosts] = useState([]);
  const position = useRef(new Animated.ValueXY()).current;

  const [pets, setPets] = useState([]);
  const [petModal, setPetModal] = useState(false);

  const [petPhoto, setPetPhoto] = useState(null);
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petWeight, setPetWeight] = useState('');

  const [selectedVet, setSelectedVet] = useState(null);
  const [vetModal, setVetModal] = useState(false);

  const [selectedWalker, setSelectedWalker] = useState(null);
  const [walkerModal, setWalkerModal] = useState(false);

  const [bookingModal, setBookingModal] = useState(false);
  const [bookingPet, setBookingPet] = useState(null);
  const [bookingDuration, setBookingDuration] = useState(30);
  const [bookingDay, setBookingDay] = useState('Bugün');
  const [bookingTime, setBookingTime] = useState('18:00');
  const [bookingNote, setBookingNote] = useState('');

  // PET OTELİ / BAKICI / EĞİTMEN REZERVASYONU
  const [marketBookingModal, setMarketBookingModal] = useState(false);
  const [marketProvider, setMarketProvider] = useState(null);
  const [marketPet, setMarketPet] = useState(null);
  const [marketDay, setMarketDay] = useState('Bugün');
  const [marketTime, setMarketTime] = useState('18:00');

  // PetMed Pro + mesajlaşma (demo altyapı)
  const [membership, setMembership] = useState('free');
  const [proModal, setProModal] = useState(false);
  const [chatModal, setChatModal] = useState(false);
  const [chatUser, setChatUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messageAttachment, setMessageAttachment] = useState(null);
  const [messages, setMessages] = useState({});

  // PetMed günlük kullanım özellikleri
  const [postModal, setPostModal] = useState(false);
  const [postText, setPostText] = useState('');
  const [communityPosts, setCommunityPosts] = useState([]);
  const [healthItems, setHealthItems] = useState([
    { id: 'h1', type: 'Aşı', title: 'Karma aşı', date: '12.08.2026', status: 'Yaklaşıyor' },
    { id: 'h2', type: 'Kontrol', title: 'Genel veteriner kontrolü', date: '25.09.2026', status: 'Planlandı' },
  ]);
  const [reminders, setReminders] = useState([
    { id: 'r1', title: 'İlaç zamanı', detail: '21:00 • Akşam dozu', done: false },
    { id: 'r2', title: 'İç parazit', detail: '12 gün kaldı', done: false },
  ]);
  const [healthModal, setHealthModal] = useState(false);
  const [healthTitle, setHealthTitle] = useState('');
  const [healthType, setHealthType] = useState('Aşı');
  const [healthDate, setHealthDate] = useState('');
  const [healthNoteText, setHealthNoteText] = useState('');

  const [reminderModal, setReminderModal] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderNote, setReminderNote] = useState('');

  const [lostActive, setLostActive] = useState(false);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const saved = await AsyncStorage.getItem(PETS_KEY);
      if (saved) setPets(JSON.parse(saved));
    } catch (e) {}
  };

  const savePets = async (newPets) => {
    setPets(newPets);
    await AsyncStorage.setItem(PETS_KEY, JSON.stringify(newPets));
  };

  const pickPhoto = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('İzin gerekli', 'Galeri izni vermen gerekiyor.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPetPhoto(result.assets[0].uri);
    }
  };

  const addPet = async () => {
    if (!petName.trim()) {
      Alert.alert('Eksik bilgi', 'Evcil hayvanının adını yaz.');
      return;
    }

    const pet = {
      id: Date.now().toString(),
      name: petName,
      type: petType,
      breed: petBreed,
      age: petAge,
      weight: petWeight,
      photo: petPhoto,
    };

    await savePets([...pets, pet]);

    setPetName('');
    setPetType('');
    setPetBreed('');
    setPetAge('');
    setPetWeight('');
    setPetPhoto(null);
    setPetModal(false);
  };

  const openChat = (person) => {
    if (membership !== 'pro') {
      setChatUser(person);
      setProModal(true);
      return;
    }
    setChatUser(person);
    setChatModal(true);
  };

  const sendMessage = () => {
    if ((!messageText.trim() && !messageAttachment) || !chatUser) return;
    const key = String(chatUser.id || chatUser.name);
    const newMessage = {
      id: Date.now().toString(),
      text: messageText.trim(),
      sender: 'me',
      attachment: messageAttachment,
    };
    setMessages((old) => ({
      ...old,
      [key]: [...(old[key] || []), newMessage],
    }));
    setMessageText('');
    setMessageAttachment(null);
  };

  const pickChatMedia = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('İzin gerekli', 'Fotoğraf veya video göndermek için galeri izni vermelisin.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        const isVideo = asset.type === 'video' || /\.(mp4|mov|m4v|webm)$/i.test(asset.uri || '');
        setMessageAttachment({
          type: isVideo ? 'video' : 'image',
          uri: asset.uri,
          name: asset.fileName || (isVideo ? 'Video' : 'Fotoğraf'),
        });
      }
    } catch (e) {
      Alert.alert('Medya seçilemedi', 'Fotoğraf veya video seçilirken bir sorun oluştu.');
    }
  };

  const attachDemoFile = () => {
    setMessageAttachment({
      type: 'file',
      name: 'PetMed_Belge.pdf',
      uri: null,
    });
  };

  const attachDemoVoice = () => {
    setMessageAttachment({
      type: 'audio',
      name: 'Sesli mesaj',
      duration: '00:12',
      uri: null,
    });
  };

  const activateProDemo = () => {
    setMembership('pro');
    setProModal(false);
    Alert.alert('PetMed Pro aktif', 'Demo üyelik aktif edildi. Artık kullanıcılar ve veterinerlerle mesajlaşabilirsin.');
  };

  /* =====================================================
     SWIPE
  ===================================================== */

  const currentPost = POSTS[cardIndex];
  const nextPost = POSTS[(cardIndex + 1) % POSTS.length];

  const rotate = position.x.interpolate({
    inputRange: [-250, 0, 250],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  const nextCard = () => {
    setCardIndex((i) => (i + 1) % POSTS.length);
    position.setValue({ x: 0, y: 0 });
  };

  const swipe = (direction) => {
    if (direction === 'right') {
      setHelpfulPosts((p) =>
        p.includes(currentPost.id) ? p : [...p, currentPost.id]
      );
    }

    Animated.timing(position, {
      toValue: {
        x:
          direction === 'right'
            ? SCREEN_WIDTH + 150
            : -SCREEN_WIDTH - 150,
        y: 0,
      },
      duration: 220,
      useNativeDriver: true,
    }).start(nextCard);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 5,

      onPanResponderMove: (_, g) => {
        position.setValue({
          x: g.dx,
          y: g.dy * 0.1,
        });
      },

      onPanResponderRelease: (_, g) => {
        if (g.dx > 100) swipe('right');
        else if (g.dx < -100) swipe('left');
        else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  /* =====================================================
     REZERVASYON
  ===================================================== */

  const startBooking = (walker) => {
    setSelectedWalker(walker);
    setWalkerModal(false);

    if (pets.length > 0) {
      setBookingPet(pets[0]);
    }

    setBookingDuration(30);
    setBookingDay('Bugün');
    setBookingTime('18:00');
    setBookingNote('');
    setBookingModal(true);
  };

  const sendBooking = () => {
    if (!bookingPet) {
      Alert.alert(
        'Hayvan seç',
        'Rezervasyon için önce bir evcil hayvan seçmelisin.'
      );
      return;
    }

    const price =
      bookingDuration === 30
        ? selectedWalker.price30
        : selectedWalker.price60;

    setBookingModal(false);

    Alert.alert(
      'Talep gönderildi',
      `${bookingPet.name} için ${selectedWalker.name} adlı gezdiriciye ${bookingDuration} dakikalık yürüyüş talebi gönderildi.\n\n${bookingDay} • ${bookingTime}\n${price} TL\n\nGezdirici talebi onayladığında sana bildirim göndereceğiz.`
    );
  };

  /* =====================================================
     ALT MENÜ
  ===================================================== */

  const BottomBar = () => (
    <View style={styles.bottomBar}>
      <Tab
        icon="⌂"
        label="Keşfet"
        active={activeTab === 'discover'}
        onPress={() => {
          setActiveTab('discover');
          setServiceScreen(null);
        }}
      />

      <Tab
        icon="▦"
        label="Hizmetler"
        active={activeTab === 'services'}
        onPress={() => {
          setActiveTab('services');
          setServiceScreen(null);
        }}
      />

      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => setPostModal(true)}
      >
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>

      <Tab
        icon="🐾"
        label="Hayvanlarım"
        active={activeTab === 'pets'}
        onPress={() => setActiveTab('pets')}
      />

      <Tab
        icon="○"
        label="Profil"
        active={activeTab === 'profile'}
        onPress={() => setActiveTab('profile')}
      />
    </View>
  );

  /* =====================================================
     TRACKER
  ===================================================== */

  if (
    activeTab === 'services' &&
    serviceScreen === 'tracker'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.pageHeader}>
          <TouchableOpacity
            onPress={() => setServiceScreen(null)}
          >
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.logo}>PetMed Tracker</Text>
            <Text style={styles.smallGray}>
              Yakınındaki köpek gezdiricileri
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.trackerHero}>
            <Text style={styles.trackerHeroIcon}>⌖</Text>

            <View style={{ flex: 1 }}>
              <Text style={styles.trackerHeroTitle}>
                Güvenli yürüyüş
              </Text>

              <Text style={styles.trackerHeroText}>
                Gezdiricini seç, rezervasyon yap ve yürüyüşü
                PetMed üzerinden takip et.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            Yakınındaki gezdiriciler
          </Text>

          {WALKERS.map((walker) => (
            <View key={walker.id} style={styles.walkerCard}>
              <View style={styles.row}>
                <Image
                  source={{ uri: walker.image }}
                  style={styles.walkerImage}
                />

                <View style={{ flex: 1, marginLeft: 13 }}>
                  <View style={styles.row}>
                    <Text style={styles.walkerName}>
                      {walker.name}
                    </Text>

                    {walker.verified && (
                      <Text style={styles.verify}> ✓</Text>
                    )}
                  </View>

                  <Text style={styles.rating}>
                    ★ {walker.rating} ({walker.reviews})
                  </Text>

                  <Text style={styles.smallGray}>
                    {walker.location}
                  </Text>

                  <Text style={styles.distance}>
                    {walker.distance} yakınında
                  </Text>
                </View>
              </View>

              <View style={styles.priceRow}>
                <View>
                  <Text style={styles.priceLabel}>30 dakika</Text>
                  <Text style={styles.price}>
                    {walker.price30} TL
                  </Text>
                </View>

                <View>
                  <Text style={styles.priceLabel}>60 dakika</Text>
                  <Text style={styles.price}>
                    {walker.price60} TL
                  </Text>
                </View>

                <View>
                  <Text style={styles.priceLabel}>Yürüyüş</Text>
                  <Text style={styles.price}>
                    {walker.walks}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  setSelectedWalker(walker);
                  setWalkerModal(true);
                }}
              >
                <Text style={styles.primaryButtonText}>
                  Profili Gör
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>

        <BottomBar />

        <WalkerModal
          visible={walkerModal}
          walker={selectedWalker}
          close={() => setWalkerModal(false)}
          book={() => startBooking(selectedWalker)}
        />

        <BookingModal
          visible={bookingModal}
          close={() => setBookingModal(false)}
          walker={selectedWalker}
          pets={pets}
          bookingPet={bookingPet}
          setBookingPet={setBookingPet}
          duration={bookingDuration}
          setDuration={setBookingDuration}
          day={bookingDay}
          setDay={setBookingDay}
          time={bookingTime}
          setTime={setBookingTime}
          note={bookingNote}
          setNote={setBookingNote}
          send={sendBooking}
        />
      </SafeAreaView>
    );
  }

  /* =====================================================
     VETERİNER BUL
  ===================================================== */

  if (
    activeTab === 'services' &&
    serviceScreen === 'findVet'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.pageHeader}>
          <TouchableOpacity
            onPress={() => setServiceScreen(null)}
          >
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>

          <Text style={[styles.pageTitle, { flex: 1, marginLeft: 10 }]}>
            Veteriner Bul
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {VETS.map((vet) => (
            <View key={vet.id} style={styles.walkerCard}>
              <View style={styles.row}>
                <Image
                  source={{ uri: vet.image }}
                  style={styles.walkerImage}
                />

                <View style={{ flex: 1, marginLeft: 13 }}>
                  <Text style={styles.walkerName}>
                    {vet.name} ✓
                  </Text>

                  <Text style={styles.purpleText}>
                    Doğrulanmış Veteriner Hekim
                  </Text>

                  <Text style={styles.smallGray}>
                    {vet.clinic}
                  </Text>

                  <Text style={styles.smallGray}>
                    {vet.city}
                  </Text>
                </View>
              </View>

              <View style={styles.chips}>
                {vet.specialties.map((s) => (
                  <View key={s} style={styles.chip}>
                    <Text style={styles.chipText}>{s}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  setSelectedVet(vet);
                  setVetModal(true);
                }}
              >
                <Text style={styles.primaryButtonText}>
                  Profili Gör
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.messageOutlineButton}
                onPress={() => openChat(vet)}
              >
                <Text style={styles.messageOutlineText}>Veterinere Özel Sor / Mesaj Gönder</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>

        <BottomBar />
        <VetProfileModal
          visible={vetModal}
          vet={selectedVet}
          close={() => setVetModal(false)}
          message={() => {
            setVetModal(false);
            openChat(selectedVet);
          }}
        />
        <ProModal visible={proModal} close={() => setProModal(false)} activate={activateProDemo} />
        <ChatModal visible={chatModal} close={() => setChatModal(false)} person={chatUser} messages={messages} text={messageText} setText={setMessageText} send={sendMessage} />
      </SafeAreaView>
    );
  }

  /* =====================================================
     PET OTELİ / PET BAKICISI / KÖPEK EĞİTMENİ
  ===================================================== */

  if (
    activeTab === 'services' &&
    ['hotel', 'sitter', 'trainer'].includes(serviceScreen)
  ) {
    const marketplace = MARKETPLACE_SERVICES[serviceScreen];

    const reserveMarketplaceService = (provider) => {
      setMarketProvider(provider);
      setMarketPet(pets.length > 0 ? pets[0] : null);
      setMarketDay('Bugün');
      setMarketTime('18:00');
      setMarketBookingModal(true);
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={() => setServiceScreen(null)}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.pageTitle}>{marketplace.title}</Text>
            <Text style={styles.smallGray}>{marketplace.subtitle}</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {marketplace.providers.map((provider) => (
            <View key={provider.id} style={styles.walkerCard}>
              <Image
                source={{ uri: provider.image }}
                style={{
                  width: '100%',
                  height: 180,
                  borderRadius: 18,
                  marginBottom: 14,
                }}
              />

              <View style={styles.row}>
                <Text style={[styles.walkerName, { flex: 1 }]}>
                  {provider.name}
                </Text>
                {provider.verified && <Text style={styles.verify}>✓</Text>}
              </View>

              <Text style={styles.rating}>
                ★ {provider.rating} ({provider.reviews})
              </Text>

              <Text style={styles.smallGray}>{provider.location}</Text>

              <Text
                style={{
                  color: '#666',
                  fontSize: 12,
                  lineHeight: 18,
                  marginTop: 10,
                }}
              >
                {provider.description}
              </Text>

              <View style={styles.marketPriceBox}>
                <View style={styles.marketPriceLine}>
                  <Text style={styles.priceLabel}>Hizmet bedeli</Text>
                  <Text style={styles.price}>
                    {provider.price} TL / {marketplace.unit}
                  </Text>
                </View>
                <View style={styles.marketPriceLine}>
                  <Text style={styles.priceLabel}>PetMed komisyonu (%15)</Text>
                  <Text style={styles.commissionAmount}>
                    {Math.round(provider.price * 0.15)} TL
                  </Text>
                </View>
                <View style={styles.marketPriceLine}>
                  <Text style={styles.priceLabel}>Hizmet sağlayıcı kazancı</Text>
                  <Text style={styles.providerAmount}>
                    {provider.price - Math.round(provider.price * 0.15)} TL
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => reserveMarketplaceService(provider)}
              >
                <Text style={styles.primaryButtonText}>Rezervasyon Yap</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.messageOutlineButton}
                onPress={() => openChat(provider)}
              >
                <Text style={styles.messageOutlineText}>
                  Mesaj Gönder {membership !== 'pro' ? '• PRO' : ''}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>

        <BottomBar />

        <MarketplaceBookingModal
          visible={marketBookingModal}
          close={() => setMarketBookingModal(false)}
          service={marketplace}
          provider={marketProvider}
          pets={pets}
          selectedPet={marketPet}
          setSelectedPet={setMarketPet}
          day={marketDay}
          setDay={setMarketDay}
          time={marketTime}
          setTime={setMarketTime}
        />

        <ProModal
          visible={proModal}
          close={() => setProModal(false)}
          activate={activateProDemo}
        />

        <ChatModal
          visible={chatModal}
          close={() => setChatModal(false)}
          person={chatUser}
          messages={messages}
          text={messageText}
          setText={setMessageText}
          send={sendMessage}
          attachment={messageAttachment}
          setAttachment={setMessageAttachment}
          pickMedia={pickChatMedia}
          attachFile={attachDemoFile}
          attachVoice={attachDemoVoice}
        />
      </SafeAreaView>
    );
  }

  /* =====================================================
     VETERİNERE SOR
  ===================================================== */

  if (
    activeTab === 'services' &&
    serviceScreen === 'askVet'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={() => setServiceScreen(null)}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.pageTitle}>Veterinere Sor</Text>
            <Text style={styles.smallGray}>
              Doğrulanmış veterinerlerden özel olarak bilgi al
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.vetQuestionInfo}>
            <Text style={styles.vetQuestionInfoTitle}>
              Nasıl çalışır?
            </Text>
            <Text style={styles.vetQuestionInfoText}>
              Bir veteriner seç ve “Soru Sor” butonuna bas. PetMed Pro
              üyeliğin aktifse doğrudan özel mesaj ekranı açılır.
            </Text>
          </View>

          {VETS.map((vet) => (
            <View key={vet.id} style={styles.walkerCard}>
              <View style={styles.row}>
                <Image source={{ uri: vet.image }} style={styles.walkerImage} />
                <View style={{ flex: 1, marginLeft: 13 }}>
                  <Text style={styles.walkerName}>{vet.name} ✓</Text>
                  <Text style={styles.purpleText}>Doğrulanmış Veteriner Hekim</Text>
                  <Text style={styles.smallGray}>{vet.clinic}</Text>
                  <Text style={styles.smallGray}>{vet.city}</Text>
                  <Text style={styles.rating}>★ {vet.answers} PetMed yanıtı</Text>
                </View>
              </View>

              <View style={styles.chips}>
                {vet.specialties.map((item) => (
                  <View key={item} style={styles.chip}>
                    <Text style={styles.chipText}>{item}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  setChatUser(vet);
                  setChatModal(true);
                }}
              >
                <Text style={styles.primaryButtonText}>
                  Soru Sor / Mesaj Gönder
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>

        <BottomBar />

        <ProModal
          visible={proModal}
          close={() => setProModal(false)}
          activate={activateProDemo}
        />

        <ChatModal
          visible={chatModal}
          close={() => setChatModal(false)}
          person={chatUser}
          messages={messages}
          text={messageText}
          setText={setMessageText}
          send={sendMessage}
          attachment={messageAttachment}
          setAttachment={setMessageAttachment}
          pickMedia={pickChatMedia}
          attachFile={attachDemoFile}
          attachVoice={attachDemoVoice}
        />
      </SafeAreaView>
    );
  }

  /* =====================================================
     SAĞLIK KARNESİ
  ===================================================== */
  if (activeTab === 'services' && serviceScreen === 'health') {
    const pet = pets[0];

    const saveHealthItem = () => {
      if (!healthTitle.trim()) {
        Alert.alert('Eksik bilgi', 'Sağlık kaydının başlığını yaz.');
        return;
      }
      const item = {
        id: Date.now().toString(),
        type: healthType,
        title: healthTitle.trim(),
        date: healthDate.trim() || new Date().toLocaleDateString('tr-TR'),
        status: 'Kaydedildi',
        note: healthNoteText.trim(),
      };
      setHealthItems([item, ...healthItems]);
      setHealthTitle('');
      setHealthDate('');
      setHealthNoteText('');
      setHealthType('Aşı');
      setHealthModal(false);
    };

    const removeHealthItem = (id) => {
      setHealthItems(healthItems.filter((x) => x.id !== id));
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={() => setServiceScreen(null)}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.pageTitle}>Dijital Sağlık Karnesi</Text>
            <Text style={styles.smallGray}>Aşı, ilaç, kontrol, alerji ve sağlık geçmişi</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.healthProfileCard}>
            <View style={styles.healthAvatar}><Text style={{ fontSize: 30 }}>🐾</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.healthPetName}>{pet?.name || 'Evcil Hayvanım'}</Text>
              <Text style={styles.smallGray}>
                {pet ? `${pet.type || 'Evcil hayvan'} • ${pet.breed || 'Irk belirtilmedi'} • ${pet.age || '-'} yaş` : 'Profil bilgilerini Hayvanlarım bölümünden ekle'}
              </Text>
            </View>
          </View>

          <View style={styles.healthStatsRow}>
            <View style={styles.healthStat}>
              <Text style={styles.healthStatNumber}>{healthItems.filter(x => x.type === 'Aşı').length}</Text>
              <Text style={styles.healthStatLabel}>Aşı</Text>
            </View>
            <View style={styles.healthStat}>
              <Text style={styles.healthStatNumber}>{healthItems.filter(x => x.type === 'Alerji').length}</Text>
              <Text style={styles.healthStatLabel}>Alerji</Text>
            </View>
            <View style={styles.healthStat}>
              <Text style={styles.healthStatNumber}>{healthItems.filter(x => x.type === 'İlaç').length}</Text>
              <Text style={styles.healthStatLabel}>İlaç</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Sağlık geçmişi</Text>
          {healthItems.map((item) => (
            <View key={item.id} style={styles.medicalCard}>
              <View style={styles.medicalIcon}>
                <Text style={{ fontSize: 22 }}>{item.type === 'Aşı' ? '💉' : item.type === 'İlaç' ? '💊' : item.type === 'Alerji' ? '!' : '🩺'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoCardTitle}>{item.title}</Text>
                <Text style={styles.smallGray}>{item.type} • {item.date}</Text>
                {!!item.note && <Text style={styles.healthNote}>{item.note}</Text>}
              </View>
              <TouchableOpacity onPress={() => removeHealthItem(item.id)} style={styles.smallDeleteButton}>
                <Text style={styles.smallDeleteText}>Sil</Text>
              </TouchableOpacity>
            </View>
          ))}

          {healthItems.length === 0 && (
            <View style={styles.emptyInfoBox}>
              <Text style={styles.infoCardTitle}>Henüz sağlık kaydı yok</Text>
              <Text style={styles.smallGray}>İlk aşı, ilaç veya kontrol kaydını ekleyebilirsin.</Text>
            </View>
          )}

          <TouchableOpacity style={styles.primaryButton} onPress={() => setHealthModal(true)}>
            <Text style={styles.primaryButtonText}>+ Sağlık Kaydı Ekle</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
        <BottomBar />

        <Modal visible={healthModal} transparent animationType="slide" onRequestClose={() => setHealthModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.formModalCard}>
              <Text style={styles.modalTitle}>Sağlık Kaydı Ekle</Text>
              <Text style={styles.formLabel}>Kayıt türü</Text>
              <View style={styles.chips}>
                {['Aşı', 'İlaç', 'Kontrol', 'Alerji', 'Operasyon', 'Kilo'].map((x) => (
                  <TouchableOpacity key={x} style={[styles.chip, healthType === x && styles.activeFormChip]} onPress={() => setHealthType(x)}>
                    <Text style={[styles.chipText, healthType === x && styles.activeFormChipText]}>{x}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput style={styles.input} placeholder="Başlık (örn. Karma aşı)" value={healthTitle} onChangeText={setHealthTitle} />
              <TextInput style={styles.input} placeholder="Tarih (örn. 12.08.2026)" value={healthDate} onChangeText={setHealthDate} />
              <TextInput style={[styles.input, { minHeight: 80 }]} multiline placeholder="Not / doz / veteriner bilgisi" value={healthNoteText} onChangeText={setHealthNoteText} />
              <TouchableOpacity style={styles.primaryButton} onPress={saveHealthItem}>
                <Text style={styles.primaryButtonText}>Kaydet</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.outlineButton} onPress={() => setHealthModal(false)}>
                <Text style={styles.outlineButtonText}>Vazgeç</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  /* =====================================================
     HATIRLATICILAR
  ===================================================== */
  if (activeTab === 'services' && serviceScreen === 'reminders') {
    const saveReminder = async () => {
      if (!reminderTitle.trim()) {
        Alert.alert('Eksik bilgi', 'Hatırlatıcı başlığını yaz.');
        return;
      }
      const detail = `${reminderDate.trim() || 'Bugün'}${reminderTime.trim() ? ` • ${reminderTime.trim()}` : ''}${reminderNote.trim() ? ` • ${reminderNote.trim()}` : ''}`;
      setReminders([...reminders, { id: Date.now().toString(), title: reminderTitle.trim(), detail, done: false }]);
      setReminderTitle('');
      setReminderDate('');
      setReminderTime('');
      setReminderNote('');
      setReminderModal(false);

      if (typeof window !== 'undefined' && 'Notification' in window) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            new Notification('PetMed hatırlatıcısı oluşturuldu', { body: `${reminderTitle.trim()} • ${detail}` });
          }
        } catch (e) {}
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={() => setServiceScreen(null)}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.pageTitle}>Hatırlatıcılar</Text>
            <Text style={styles.smallGray}>İlaç, aşı, mama ve bakım planı</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.reminderHero}>
            <Text style={styles.reminderHeroTitle}>Planım</Text>
            <Text style={styles.reminderHeroBig}>{reminders.filter((r) => !r.done).length} aktif hatırlatıcı</Text>
            <Text style={styles.reminderHeroSub}>Tamamlamak için karta dokun. Silmek için sağdaki Sil butonunu kullan.</Text>
          </View>

          <Text style={styles.sectionTitle}>Hatırlatıcılarım</Text>
          {reminders.map((item) => (
            <View key={item.id} style={[styles.reminderCard, item.done && styles.reminderDone]}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                onPress={() => setReminders(reminders.map((r) => r.id === item.id ? { ...r, done: !r.done } : r))}
              >
                <View style={styles.reminderCheck}>
                  <Text style={styles.reminderCheckText}>{item.done ? '✓' : '○'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoCardTitle}>{item.title}</Text>
                  <Text style={styles.smallGray}>{item.detail}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setReminders(reminders.filter((r) => r.id !== item.id))} style={styles.smallDeleteButton}>
                <Text style={styles.smallDeleteText}>Sil</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.notificationInfo}>
            <Text style={styles.infoCardTitle}>Bildirimler</Text>
            <Text style={styles.smallGray}>Web sürümünde tarayıcı izni verilirse bildirim izni istenir. iOS/Android mağaza sürümünde zamanlanmış telefon bildirimleri için Expo Notifications bağlantısı ayrıca yapılacaktır.</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={() => setReminderModal(true)}>
            <Text style={styles.primaryButtonText}>+ Hatırlatıcı Ekle</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
        <BottomBar />

        <Modal visible={reminderModal} transparent animationType="slide" onRequestClose={() => setReminderModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.formModalCard}>
              <Text style={styles.modalTitle}>Hatırlatıcı Ekle</Text>
              <TextInput style={styles.input} placeholder="Başlık (örn. Akşam ilacı)" value={reminderTitle} onChangeText={setReminderTitle} />
              <TextInput style={styles.input} placeholder="Tarih (örn. 30.07.2026)" value={reminderDate} onChangeText={setReminderDate} />
              <TextInput style={styles.input} placeholder="Saat (örn. 21:00)" value={reminderTime} onChangeText={setReminderTime} />
              <TextInput style={styles.input} placeholder="Not (opsiyonel)" value={reminderNote} onChangeText={setReminderNote} />
              <TouchableOpacity style={styles.primaryButton} onPress={saveReminder}>
                <Text style={styles.primaryButtonText}>Kaydet</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.outlineButton} onPress={() => setReminderModal(false)}>
                <Text style={styles.outlineButtonText}>Vazgeç</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  /* =====================================================
     KAYIP HAYVAN
  ===================================================== */
  if (activeTab === 'services' && serviceScreen === 'lost') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={() => setServiceScreen(null)}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.pageTitle}>Kayıp Evcil Dostum</Text>
            <Text style={styles.smallGray}>PetMed Kayıp Ağı</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.lostHero, lostActive && styles.lostHeroActive]}>
            <View style={styles.lostIconCircle}>
              <Text style={styles.lostIconText}>!</Text>
            </View>
            <Text style={styles.lostTitle}>
              {lostActive ? 'Kayıp ilanı yayında' : 'Acil kayıp modu'}
            </Text>
            <Text style={styles.lostText}>
              {lostActive
                ? 'İlanın çevrendeki PetMed kullanıcılarının keşfet akışında gösteriliyor.'
                : 'Evcil hayvanın kaybolduğunda profilini saniyeler içinde kayıp ilanına dönüştür.'}
            </Text>
          </View>

          <View style={styles.lostPetPreview}>
            <View style={styles.lostPetAvatar}><Text style={{ fontSize: 35 }}>🐾</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoCardTitle}>{pets[0]?.name || 'Evcil hayvanını seç'}</Text>
              <Text style={styles.smallGray}>
                {pets[0] ? `${pets[0].type || ''} • ${pets[0].breed || ''}` : 'Önce Hayvanlarım bölümünden profil ekle'}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>İlan yayınlandığında</Text>
          <View style={styles.lostFeature}><Text style={styles.lostFeatureIcon}>⌖</Text><View style={{flex:1}}><Text style={styles.infoCardTitle}>Yakındaki kullanıcılara bildirim</Text><Text style={styles.smallGray}>Konuma göre yakın PetMed kullanıcıları ilanı görür.</Text></View></View>
          <View style={styles.lostFeature}><Text style={styles.lostFeatureIcon}>QR</Text><View style={{flex:1}}><Text style={styles.infoCardTitle}>Dijital QR kimliği</Text><Text style={styles.smallGray}>Bulan kişi PetMed profilindeki iletişim ekranına ulaşabilir.</Text></View></View>
          <View style={styles.lostFeature}><Text style={styles.lostFeatureIcon}>●</Text><View style={{flex:1}}><Text style={styles.infoCardTitle}>Görüldü bildirimi</Text><Text style={styles.smallGray}>Kullanıcılar gördükleri konumu sahibine iletebilir.</Text></View></View>

          <TouchableOpacity
            style={lostActive ? styles.dangerOutlineButton : styles.dangerButton}
            onPress={() => {
              if (pets.length === 0) {
                Alert.alert('Evcil hayvan gerekli', 'Kayıp ilanı oluşturmak için önce Hayvanlarım bölümünden evcil hayvanını ekle.');
                return;
              }
              const next = !lostActive;
              setLostActive(next);
              Alert.alert(
                next ? 'Kayıp ilanı yayınlandı' : 'İlan kapatıldı',
                next
                  ? `${pets[0].name} için PetMed Kayıp Ağı demo ilanı aktif edildi.`
                  : 'Kayıp ilanı kapatıldı.'
              );
            }}
          >
            <Text style={lostActive ? styles.dangerOutlineText : styles.dangerButtonText}>
              {lostActive ? 'Hayvanımı Buldum • İlanı Kapat' : 'Kayıp İlanını Yayınla'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
        <BottomBar />
      </SafeAreaView>
    );
  }

  /* =====================================================
     PET DOSTU YERLER
  ===================================================== */
  if (activeTab === 'services' && serviceScreen === 'places') {
    const places = [
      { id: 'p1', icon: '🌳', name: 'Pet Dostu Park', type: 'Park & yürüyüş', distance: '1,2 km', rating: '4.8', reviews: 126, open: 'Açık' },
      { id: 'p2', icon: '☕', name: 'Pati Cafe', type: 'Pet dostu kafe', distance: '2,4 km', rating: '4.7', reviews: 84, open: '22:00’ye kadar' },
      { id: 'p3', icon: '🐕', name: 'Dost Patiler Oyun Alanı', type: 'Köpek oyun alanı', distance: '3,1 km', rating: '4.9', reviews: 203, open: 'Açık' },
      { id: 'p4', icon: '🏥', name: 'PetMed Vet Noktası', type: 'Veteriner', distance: '3,8 km', rating: '4.9', reviews: 311, open: '24 saat' },
    ];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={() => setServiceScreen(null)}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.pageTitle}>Pet Dostu Yerler</Text>
            <Text style={styles.smallGray}>Yakınındaki mekanları keşfet</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.placeSearch}>
            <Text style={{ marginRight: 8 }}>⌕</Text>
            <Text style={styles.placeSearchText}>Park, kafe, veteriner veya mekan ara...</Text>
          </View>

          <View style={styles.placeCategories}>
            {['Tümü', 'Park', 'Kafe', 'Veteriner'].map((x, i) => (
              <View key={x} style={[styles.placeCategory, i === 0 && styles.placeCategoryActive]}>
                <Text style={[styles.placeCategoryText, i === 0 && styles.placeCategoryTextActive]}>{x}</Text>
              </View>
            ))}
          </View>

          <View style={styles.mapDemo}>
            <Text style={styles.mapDemoIcon}>⌖</Text>
            <Text style={styles.mapDemoTitle}>Çevrende 12 pet dostu yer</Text>
            <Text style={styles.smallGray}>Gerçek sürümde canlı harita ve konum bağlanacak.</Text>
          </View>

          <Text style={styles.sectionTitle}>Sana yakın</Text>
          {places.map((place) => (
            <TouchableOpacity
              key={place.id}
              style={styles.placeCard}
              onPress={() =>
                Alert.alert(
                  place.name,
                  `${place.type}\n${place.distance}\n★ ${place.rating} (${place.reviews} değerlendirme)\n${place.open}`,
                  [{ text: 'Kapat' }, { text: 'Yol Tarifi', onPress: () => Alert.alert('Yol tarifi', 'Gerçek sürümde harita uygulaması açılacak.') }]
                )
              }
            >
              <View style={styles.placeIconBox}><Text style={{ fontSize: 27 }}>{place.icon}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoCardTitle}>{place.name}</Text>
                <Text style={styles.smallGray}>{place.type} • {place.distance}</Text>
                <Text style={styles.rating}>★ {place.rating} ({place.reviews})</Text>
                <Text style={styles.placeOpen}>{place.open}</Text>
              </View>
              <Text style={styles.reminderArrow}>›</Text>
            </TouchableOpacity>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>
        <BottomBar />
      </SafeAreaView>
    );
  }

  /* =====================================================
     HAYVANLARIM
  ===================================================== */

  if (activeTab === 'pets') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mainHeader}>
          <View>
            <Text style={styles.logo}>PetMed</Text>
            <Text style={styles.pageTitle}>Hayvanlarım</Text>
          </View>

          <TouchableOpacity
            style={styles.roundAdd}
            onPress={() => setPetModal(true)}
          >
            <Text style={styles.roundAddText}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {pets.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🐾</Text>

              <Text style={styles.emptyTitle}>
                İlk dostunu ekle
              </Text>

              <Text style={styles.emptyText}>
                Sağlık bilgilerini ve profilini PetMed'de
                sakla.
              </Text>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setPetModal(true)}
              >
                <Text style={styles.primaryButtonText}>
                  + Evcil Hayvan Ekle
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            pets.map((pet) => (
              <View key={pet.id} style={styles.petCard}>
                <View style={styles.row}>
                  {pet.photo ? (
                    <Image
                      source={{ uri: pet.photo }}
                      style={styles.petProfileImage}
                    />
                  ) : (
                    <View style={styles.petPlaceholder}>
                      <Text style={{ fontSize: 32 }}>🐾</Text>
                    </View>
                  )}

                  <View style={{ marginLeft: 15, flex: 1 }}>
                    <Text style={styles.petProfileName}>
                      {pet.name}
                    </Text>

                    <Text style={styles.smallGray}>
                      {pet.breed || pet.type || 'Evcil hayvan'}
                    </Text>

                    <Text style={styles.purpleText}>
                      {pet.age ? `${pet.age} yaş` : ''}
                      {pet.weight ? ` • ${pet.weight} kg` : ''}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}

          {pets.length > 0 && (
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => setPetModal(true)}
            >
              <Text style={styles.outlineButtonText}>
                + Başka bir dost ekle
              </Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        <BottomBar />

        <PetModal
          visible={petModal}
          close={() => setPetModal(false)}
          photo={petPhoto}
          pickPhoto={pickPhoto}
          name={petName}
          setName={setPetName}
          type={petType}
          setType={setPetType}
          breed={petBreed}
          setBreed={setPetBreed}
          age={petAge}
          setAge={setPetAge}
          weight={petWeight}
          setWeight={setPetWeight}
          save={addPet}
        />
      </SafeAreaView>
    );
  }

  /* =====================================================
     PROFİL
  ===================================================== */

  if (activeTab === 'profile') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.simpleCenter}>
          <Text style={styles.logo}>PetMed</Text>
          <Text style={styles.profileIcon}>○</Text>
          <Text style={styles.pageTitle}>Profil</Text>
          <Text style={styles.smallGray}>
            Üyelik: {membership === 'pro' ? 'PetMed Pro' : 'Ücretsiz'}
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => membership === 'pro' ? Alert.alert('PetMed Pro', 'Pro üyeliğin aktif.') : setProModal(true)}>
            <Text style={styles.primaryButtonText}>{membership === 'pro' ? 'PRO AKTİF' : 'PetMed Pro’ya Geç'}</Text>
          </TouchableOpacity>
          <ProModal visible={proModal} close={() => setProModal(false)} activate={activateProDemo} />
        </View>

        <BottomBar />

        <PostModal
          visible={postModal}
          close={() => setPostModal(false)}
          text={postText}
          setText={setPostText}
          publish={() => {
            if (!postText.trim()) {
              Alert.alert('Paylaşım', 'Bir şeyler yazmalısın.');
              return;
            }
            setCommunityPosts([{ id: Date.now().toString(), text: postText.trim() }, ...communityPosts]);
            setPostText('');
            setPostModal(false);
            Alert.alert('Paylaşıldı', 'Gönderin PetMed topluluğunda yayınlandı.');
          }}
        />

      </SafeAreaView>
    );
  }

  /* =====================================================
     HİZMETLER ANA SAYFA
  ===================================================== */

  if (activeTab === 'services') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mainHeader}>
          <View>
            <Text style={styles.logo}>PetMed</Text>
            <Text style={styles.pageTitle}>Hizmetler</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.serviceIntro}>
            Evcil hayvanın için ihtiyacın olan her şey
            tek yerde.
          </Text>

          <TouchableOpacity
            style={styles.featuredService}
            onPress={() => setServiceScreen('tracker')}
          >
            <View style={styles.featuredIcon}>
              <Text style={styles.featuredIconText}>⌖</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.featuredTag}>
                PETMED TRACKER
              </Text>

              <Text style={styles.featuredTitle}>
                Köpek gezdirici bul
              </Text>

              <Text style={styles.featuredText}>
                Yakınındaki doğrulanmış gezdiricileri keşfet,
                rezervasyon yap ve yürüyüşü takip et.
              </Text>
            </View>

            <Text style={styles.serviceArrow}>›</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>
            Tüm hizmetler
          </Text>

          <View style={styles.serviceGrid}>
            {SERVICES.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => {
                  if (service.id === 'tracker') {
                    setServiceScreen('tracker');
                  } else if (service.id === 'askVet') {
                    setServiceScreen('askVet');
                  } else if (service.id === 'findVet') {
                    setServiceScreen('findVet');
                  } else if (
                    service.id === 'hotel' ||
                    service.id === 'sitter' ||
                    service.id === 'trainer'
                  ) {
                    setServiceScreen(service.id);
                  } else if (
                    service.id === 'health' ||
                    service.id === 'reminders' ||
                    service.id === 'lost' ||
                    service.id === 'places'
                  ) {
                    setServiceScreen(service.id);
                  } else {
                    Alert.alert(
                      service.title,
                      `${service.title} bölümünü sıradaki geliştirmelerde aktif edeceğiz.`
                    );
                  }
                }}
              >
                <View style={styles.serviceIcon}>
                  <Text style={styles.serviceIconText}>
                    {service.icon}
                  </Text>
                </View>

                <Text style={styles.serviceTitle}>
                  {service.title}
                </Text>

                <Text style={styles.serviceSubtitle}>
                  {service.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.safetyBox}>
            <Text style={styles.safetyTitle}>
              PetMed Güven
            </Text>

            <Text style={styles.safetyText}>
              Hizmet sağlayıcı profillerinde doğrulama,
              değerlendirme ve kullanıcı yorumları sistemi
              oluşturulacaktır.
            </Text>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        <BottomBar />
      </SafeAreaView>
    );
  }


  /* =====================================================
     KEŞFET
  ===================================================== */

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainHeader}>
        <View>
          <Text style={styles.logo}>PetMed</Text>
          <Text style={styles.smallGray}>Keşfet</Text>
        </View>
      </View>

      <View style={styles.discoverArea}>
        <View style={styles.cardStack}>
          <View style={[styles.swipeCard, styles.backCard]}>
            <Image
              source={{ uri: nextPost.image }}
              style={styles.fullImage}
            />
          </View>

          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.swipeCard,
              {
                transform: [
                  { translateX: position.x },
                  { translateY: position.y },
                  { rotate },
                ],
              },
            ]}
          >
            <Image
              source={{ uri: currentPost.image }}
              style={styles.fullImage}
            />

            <View style={styles.overlay} />

            <View style={styles.cardInfo}>
              <Text style={styles.whiteSmall}>
                {currentPost.owner} • {currentPost.city}
              </Text>

              <Text style={styles.petNameBig}>
                {currentPost.petName}
              </Text>

              <Text style={styles.whiteSmall}>
                {currentPost.breed} • {currentPost.age}
              </Text>

              <Text style={styles.postTitle}>
                {currentPost.title}
              </Text>

              <Text style={styles.story}>
                {currentPost.story}
              </Text>

              <View style={styles.chips}>
                {currentPost.tags.map((tag) => (
                  <View key={tag} style={styles.darkChip}>
                    <Text style={styles.darkChipText}>
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>

              <Text style={styles.vetResponse}>
                ✓ {currentPost.vets} veteriner yanıt verdi
              </Text>

              <TouchableOpacity
                style={styles.cardMessageButton}
                onPress={() => openChat({ id: `owner-${currentPost.id}`, name: currentPost.owner, type: 'user' })}
              >
                <Text style={styles.cardMessageButtonText}>Mesaj Gönder</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        <View style={styles.swipeActions}>
          <TouchableOpacity
            style={styles.circleAction}
            onPress={() => swipe('left')}
          >
            <Text style={styles.x}>×</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleAction}
            onPress={() => swipe('right')}
          >
            <Text style={styles.heart}>♡</Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomBar />
      <PostModal
        visible={postModal}
        close={() => setPostModal(false)}
        text={postText}
        setText={setPostText}
        publish={() => {
          if (!postText.trim()) {
            Alert.alert('Paylaşım', 'Bir şeyler yazmalısın.');
            return;
          }
          setCommunityPosts([
            { id: Date.now().toString(), text: postText.trim() },
            ...communityPosts,
          ]);
          setPostText('');
          setPostModal(false);
          Alert.alert('Paylaşıldı', 'Gönderin PetMed topluluğunda yayınlandı.');
        }}
      />
      <ProModal visible={proModal} close={() => setProModal(false)} activate={activateProDemo} />
      <ChatModal visible={chatModal} close={() => setChatModal(false)} person={chatUser} messages={messages} text={messageText} setText={setMessageText} send={sendMessage} />
    </SafeAreaView>
  );
}

/* =========================================================
   PETMED PRO + MESAJLAŞMA
========================================================= */

function VetProfileModal({ visible, vet, close, message }) {
  if (!vet) return null;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <View style={styles.modalOverlay}>
        <View style={styles.formModalCard}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.row}>
              <Image source={{ uri: vet.image }} style={styles.walkerImage} />
              <View style={{ flex: 1, marginLeft: 13 }}>
                <Text style={styles.modalTitle}>{vet.name} ✓</Text>
                <Text style={styles.purpleText}>Doğrulanmış Veteriner Hekim</Text>
                <Text style={styles.smallGray}>{vet.clinic}</Text>
                <Text style={styles.smallGray}>{vet.city}</Text>
              </View>
            </View>

            <View style={styles.vetProfileStats}>
              <View style={styles.healthStat}><Text style={styles.healthStatNumber}>★ {vet.rating}</Text><Text style={styles.healthStatLabel}>{vet.reviews} yorum</Text></View>
              <View style={styles.healthStat}><Text style={styles.healthStatNumber}>{vet.experience}</Text><Text style={styles.healthStatLabel}>Deneyim</Text></View>
              <View style={styles.healthStat}><Text style={styles.healthStatNumber}>{vet.answers}</Text><Text style={styles.healthStatLabel}>PetMed yanıtı</Text></View>
            </View>

            <Text style={styles.sectionTitle}>Hakkında</Text>
            <Text style={styles.profileBodyText}>{vet.about}</Text>

            <Text style={styles.sectionTitle}>Uzmanlıklar</Text>
            <View style={styles.chips}>
              {vet.specialties.map((s) => <View key={s} style={styles.chip}><Text style={styles.chipText}>{s}</Text></View>)}
            </View>

            <Text style={styles.sectionTitle}>Muayene bilgisi</Text>
            <View style={styles.emptyInfoBox}>
              <Text style={styles.infoCardTitle}>{vet.hours}</Text>
              <Text style={styles.smallGray}>Tahmini muayene ücreti: {vet.fee} TL</Text>
            </View>

            <Text style={styles.sectionTitle}>Kullanıcı yorumları</Text>
            {vet.comments.map((comment, i) => (
              <View key={i} style={styles.reviewCard}>
                <Text style={styles.rating}>★★★★★</Text>
                <Text style={styles.profileBodyText}>{comment}</Text>
              </View>
            ))}

            <TouchableOpacity style={styles.primaryButton} onPress={message}>
              <Text style={styles.primaryButtonText}>Veterinere Mesaj Gönder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.outlineButton} onPress={close}>
              <Text style={styles.outlineButtonText}>Kapat</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function PostModal({ visible, close, text, setText, publish }) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close}>
      <SafeAreaView style={styles.container}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={close}>
            <Text style={styles.cancelText}>Vazgeç</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Paylaşım Yap</Text>
          <TouchableOpacity onPress={publish}>
            <Text style={styles.publishText}>Paylaş</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.postComposer}>
          <Text style={styles.postComposerTitle}>PetMed Topluluk</Text>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Deneyimini, sorunu veya faydalı bir bilgiyi paylaş..."
            multiline
            style={styles.postInput}
          />
          <View style={styles.postHint}>
            <Text style={styles.postHintText}>
              Sağlık paylaşımları kullanıcı deneyimidir; teşhis veya tedavi yerine geçmez.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function ProModal({ visible, close, activate }) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close}>
      <SafeAreaView style={styles.container}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={close}><Text style={styles.back}>‹</Text></TouchableOpacity>
          <Text style={styles.modalTitle}>PetMed Pro</Text>
          <View style={{ width: 30 }} />
        </View>
        <ScrollView contentContainerStyle={styles.proPage}>
          <Text style={styles.proBadge}>PETMED PRO</Text>
          <Text style={styles.proTitle}>PetMed topluluğuyla doğrudan iletişim kur.</Text>
          <Text style={styles.proFeature}>✓ Diğer hayvan sahipleriyle özel mesajlaş</Text>
          <Text style={styles.proFeature}>✓ Paylaşım sahiplerine soru sor</Text>
          <Text style={styles.proFeature}>✓ Doğrulanmış veterinerlere özel soru gönder</Text>
          <Text style={styles.proFeature}>✓ Konuşma geçmişini sakla</Text>
          <Text style={styles.proFeature}>✓ İleride fotoğraf ve belge gönder</Text>
          <View style={styles.proInfoBox}>
            <Text style={styles.proInfoText}>Bu sürüm prototiptir. Aşağıdaki buton gerçek ücret tahsil etmez; Pro özelliklerini test etmek için üyeliği demo olarak açar.</Text>
          </View>
          <TouchableOpacity style={styles.proButton} onPress={activate}>
            <Text style={styles.proButtonText}>PetMed Pro’yu Demo Olarak Aç</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function ChatModal({
  visible,
  close,
  person,
  messages,
  text,
  setText,
  send,
  attachment,
  setAttachment,
  pickMedia,
  attachFile,
  attachVoice,
}) {
  if (!person) return null;
  const key = String(person.id || person.name);
  const list = messages[key] || [];

  const renderAttachment = (item) => {
    const a = item.attachment;
    if (!a) return null;

    if (a.type === 'image' && a.uri) {
      return <Image source={{ uri: a.uri }} style={styles.chatMediaImage} />;
    }

    if (a.type === 'video') {
      return (
        <View style={styles.chatAttachmentCard}>
          <Text style={styles.chatAttachmentIcon}>▶</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.chatAttachmentTitle}>Video</Text>
            <Text style={styles.chatAttachmentSub}>{a.name || 'Gönderilen video'}</Text>
          </View>
        </View>
      );
    }

    if (a.type === 'audio') {
      return (
        <View style={styles.chatAttachmentCard}>
          <Text style={styles.chatAttachmentIcon}>◉</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.chatAttachmentTitle}>Sesli mesaj</Text>
            <Text style={styles.chatAttachmentSub}>{a.duration || 'Ses kaydı'}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.chatAttachmentCard}>
        <Text style={styles.chatAttachmentIcon}>▤</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.chatAttachmentTitle}>Dosya</Text>
          <Text style={styles.chatAttachmentSub}>{a.name || 'Ekli dosya'}</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close}>
      <SafeAreaView style={styles.container}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={close}><Text style={styles.back}>‹</Text></TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.modalTitle}>{person.name}</Text>
            <Text style={styles.smallGray}>PetMed Mesajlar</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.chatMessagesContent}>
          <View style={styles.chatInfoBox}>
            <Text style={styles.chatInfoTitle}>Güvenli mesajlaşma</Text>
            <Text style={styles.smallGray}>
              Metin, fotoğraf ve video gönderebilirsin. Ses kaydı ve dosya kartları bu web prototipinde arayüz olarak hazırdır; gerçek yükleme/depolama için backend bağlantısı gerekir.
            </Text>
          </View>

          {list.length === 0 && (
            <View style={styles.emptyInfoBox}>
              <Text style={styles.infoCardTitle}>Henüz mesaj yok</Text>
              <Text style={styles.smallGray}>İlk mesajını veya bir fotoğrafı gönder.</Text>
            </View>
          )}

          {list.map((item) => (
            <View key={item.id} style={styles.myChatBubble}>
              {renderAttachment(item)}
              {!!item.text && <Text style={styles.myChatText}>{item.text}</Text>}
            </View>
          ))}
        </ScrollView>

        {attachment && (
          <View style={styles.pendingAttachment}>
            <View style={{ flex: 1 }}>
              <Text style={styles.pendingAttachmentTitle}>
                {attachment.type === 'image' ? 'Fotoğraf eklendi' :
                 attachment.type === 'video' ? 'Video eklendi' :
                 attachment.type === 'audio' ? 'Sesli mesaj eklendi' : 'Dosya eklendi'}
              </Text>
              <Text style={styles.smallGray}>{attachment.name || attachment.duration || ''}</Text>
            </View>
            <TouchableOpacity onPress={() => setAttachment(null)} style={styles.removeAttachmentButton}>
              <Text style={styles.removeAttachmentText}>Kaldır</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.chatTools}>
          <TouchableOpacity style={styles.chatToolButton} onPress={pickMedia}>
            <Text style={styles.chatToolIcon}>▧</Text>
            <Text style={styles.chatToolText}>Foto/Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatToolButton} onPress={attachVoice}>
            <Text style={styles.chatToolIcon}>◉</Text>
            <Text style={styles.chatToolText}>Ses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatToolButton} onPress={attachFile}>
            <Text style={styles.chatToolIcon}>▤</Text>
            <Text style={styles.chatToolText}>Dosya</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chatComposer}>
          <TextInput
            style={styles.chatInput}
            placeholder="Mesaj yaz..."
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity style={styles.chatSendButton} onPress={send}>
            <Text style={styles.chatSendText}>Gönder</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function WalkerModal({ visible, walker, close, book }) {
  if (!walker) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={close}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={close}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>
            Gezdirici Profili
          </Text>

          <View style={{ width: 30 }} />
        </View>

        <ScrollView contentContainerStyle={styles.profileContent}>
          <Image
            source={{ uri: walker.image }}
            style={styles.largeProfileImage}
          />

          <Text style={styles.profileName}>
            {walker.name} ✓
          </Text>

          <Text style={styles.verifiedText}>
            Doğrulanmış PetMed Gezdiricisi
          </Text>

          <Text style={styles.rating}>
            ★ {walker.rating} • {walker.reviews} değerlendirme
          </Text>

          <Text style={styles.smallGray}>
            {walker.location} • {walker.distance}
          </Text>

          <View style={styles.statsBox}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {walker.walks}
              </Text>
              <Text style={styles.smallGray}>Yürüyüş</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {walker.rating}
              </Text>
              <Text style={styles.smallGray}>Puan</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {walker.reviews}
              </Text>
              <Text style={styles.smallGray}>Yorum</Text>
            </View>
          </View>

          <Text style={styles.profileSection}>Hakkında</Text>
          <Text style={styles.bio}>{walker.bio}</Text>

          <Text style={styles.profileSection}>Yürüyüş ücretleri</Text>

          <View style={styles.packageRow}>
            <View style={styles.packageCard}>
              <Text style={styles.packageTime}>30 dk</Text>
              <Text style={styles.packagePrice}>
                {walker.price30} TL
              </Text>
            </View>

            <View style={styles.packageCard}>
              <Text style={styles.packageTime}>60 dk</Text>
              <Text style={styles.packagePrice}>
                {walker.price60} TL
              </Text>
            </View>
          </View>

          <View style={styles.trackingFeature}>
            <Text style={styles.trackingTitle}>
              PetMed Tracker
            </Text>

            <Text style={styles.trackingText}>
              Yürüyüş başladığında rota, süre ve mesafe
              bilgileri uygulamada gösterilebilecek.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={book}
          >
            <Text style={styles.primaryButtonText}>
              Rezervasyon Yap
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

/* =========================================================
   REZERVASYON
========================================================= */

function BookingModal({
  visible,
  close,
  walker,
  pets,
  bookingPet,
  setBookingPet,
  duration,
  setDuration,
  day,
  setDay,
  time,
  setTime,
  note,
  setNote,
  send,
}) {
  if (!walker) return null;

  const price =
    duration === 30 ? walker.price30 : walker.price60;

  const days = ['Bugün', 'Yarın', 'Cumartesi'];
  const times = ['10:00', '12:00', '15:00', '18:00', '20:00'];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={close}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={close}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>
            Yürüyüş Rezervasyonu
          </Text>

          <View style={{ width: 30 }} />
        </View>

        <ScrollView contentContainerStyle={styles.bookingContent}>
          <View style={styles.bookingWalker}>
            <Image
              source={{ uri: walker.image }}
              style={styles.bookingWalkerImage}
            />

            <View style={{ marginLeft: 12 }}>
              <Text style={styles.walkerName}>
                {walker.name} ✓
              </Text>
              <Text style={styles.smallGray}>
                {walker.location}
              </Text>
            </View>
          </View>

          <Text style={styles.formTitle}>
            Hangi dostun gezdirilecek?
          </Text>

          {pets.length === 0 ? (
            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>
                Evcil hayvan profili bulunamadı
              </Text>

              <Text style={styles.warningText}>
                Önce Hayvanlarım bölümünden köpeğini eklemelisin.
              </Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pets.map((pet) => {
                const selected = bookingPet?.id === pet.id;

                return (
                  <TouchableOpacity
                    key={pet.id}
                    style={[
                      styles.petSelect,
                      selected && styles.petSelectActive,
                    ]}
                    onPress={() => setBookingPet(pet)}
                  >
                    {pet.photo ? (
                      <Image
                        source={{ uri: pet.photo }}
                        style={styles.petSelectImage}
                      />
                    ) : (
                      <Text style={{ fontSize: 25 }}>🐾</Text>
                    )}

                    <Text
                      style={[
                        styles.petSelectName,
                        selected && { color: '#5B3DF5' },
                      ]}
                    >
                      {pet.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          <Text style={styles.formTitle}>
            Yürüyüş süresi
          </Text>

          <View style={styles.packageRow}>
            <SelectBox
              selected={duration === 30}
              title="30 dakika"
              subtitle={`${walker.price30} TL`}
              onPress={() => setDuration(30)}
            />

            <SelectBox
              selected={duration === 60}
              title="60 dakika"
              subtitle={`${walker.price60} TL`}
              onPress={() => setDuration(60)}
            />
          </View>

          <Text style={styles.formTitle}>Gün</Text>

          <View style={styles.optionWrap}>
            {days.map((item) => (
              <Option
                key={item}
                text={item}
                selected={day === item}
                onPress={() => setDay(item)}
              />
            ))}
          </View>

          <Text style={styles.formTitle}>Saat</Text>

          <View style={styles.optionWrap}>
            {times.map((item) => (
              <Option
                key={item}
                text={item}
                selected={time === item}
                onPress={() => setTime(item)}
              />
            ))}
          </View>

          <Text style={styles.formTitle}>
            Gezdiriciye not
          </Text>

          <TextInput
            style={styles.noteInput}
            multiline
            placeholder="Örn: Diğer köpeklerden biraz çekiniyor..."
            value={note}
            onChangeText={setNote}
          />

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>
              Tahmini ücret
            </Text>

            <Text style={styles.totalPrice}>
              {price} TL
            </Text>
          </View>

          <Text style={styles.paymentNote}>
            Bu prototipte gerçek ödeme alınmaz. Ödeme
            sistemini daha sonra ekleyeceğiz.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={send}
          >
            <Text style={styles.primaryButtonText}>
              Rezervasyon Talebi Gönder
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

/* =========================================================
   PET MODAL
========================================================= */


function MarketplaceBookingModal({
  visible, close, service, provider, pets, selectedPet, setSelectedPet,
  day, setDay, time, setTime,
}) {
  if (!provider || !service) return null;

  const commission = Math.round(provider.price * 0.15);
  const providerEarning = provider.price - commission;
  const days = ['Bugün', 'Yarın', 'Cumartesi', 'Pazar'];
  const times = ['10:00', '12:00', '15:00', '18:00', '20:00'];

  const completeBooking = () => {
    const petName = selectedPet?.name || 'Evcil hayvan';
    close();
    Alert.alert(
      'Rezervasyon talebi gönderildi',
      `${petName} için ${provider.name}\n${day} • ${time}\n\nHizmet bedeli: ${provider.price} TL\nPetMed komisyonu (%15): ${commission} TL\nHizmet sağlayıcı kazancı: ${providerEarning} TL\n\nTalebin başarıyla oluşturuldu.`
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close}>
      <SafeAreaView style={styles.container}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={close}><Text style={styles.back}>‹</Text></TouchableOpacity>
          <Text style={styles.modalTitle}>Rezervasyon</Text>
          <View style={{ width: 30 }} />
        </View>

        <ScrollView contentContainerStyle={styles.bookingContent}>
          <View style={styles.bookingWalker}>
            <Image source={{ uri: provider.image }} style={styles.bookingWalkerImage} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.walkerName}>{provider.name}</Text>
              <Text style={styles.smallGray}>{provider.location}</Text>
              <Text style={styles.rating}>★ {provider.rating}</Text>
            </View>
          </View>

          <Text style={styles.formTitle}>Evcil hayvanını seç</Text>
          {pets.length === 0 && (
            <View style={styles.noPetBookingBox}>
              <Text style={styles.noPetBookingTitle}>Henüz kayıtlı evcil hayvan yok</Text>
              <Text style={styles.noPetBookingText}>
                Demo rezervasyonuna devam edebilirsin. Daha sonra Hayvanlarım bölümünden evcil hayvanını ekleyebilirsin.
              </Text>
            </View>
          )}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {pets.map((pet) => {
              const active = selectedPet?.id === pet.id;
              return (
                <TouchableOpacity
                  key={pet.id}
                  style={[styles.petSelect, active && styles.petSelectActive]}
                  onPress={() => setSelectedPet(pet)}
                >
                  {pet.photo ? (
                    <Image source={{ uri: pet.photo }} style={styles.petSelectImage} />
                  ) : (
                    <View style={styles.petSelectPlaceholder}><Text style={{ fontSize: 25 }}>🐾</Text></View>
                  )}
                  <Text style={[styles.petSelectName, active && styles.petSelectNameActive]}>
                    {pet.name}
                  </Text>
                  {active && <Text style={styles.petSelectedCheck}>✓ Seçildi</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.formTitle}>Gün seç</Text>
          <View style={styles.optionWrap}>
            {days.map((item) => (
              <Option key={item} text={item} selected={day === item} onPress={() => setDay(item)} />
            ))}
          </View>

          <Text style={styles.formTitle}>Saat seç</Text>
          <View style={styles.optionWrap}>
            {times.map((item) => (
              <Option key={item} text={item} selected={time === item} onPress={() => setTime(item)} />
            ))}
          </View>

          <View style={styles.paymentSummary}>
            <Text style={styles.paymentSummaryTitle}>Ücret ve komisyon</Text>
            <View style={styles.paymentLine}>
              <Text style={styles.paymentLabel}>Hizmet bedeli ({service.unit})</Text>
              <Text style={styles.paymentValue}>{provider.price} TL</Text>
            </View>
            <View style={styles.paymentLine}>
              <Text style={styles.paymentLabel}>PetMed komisyonu (%15)</Text>
              <Text style={styles.commissionAmount}>{commission} TL</Text>
            </View>
            <View style={styles.paymentLine}>
              <Text style={styles.paymentLabel}>Hizmet sağlayıcı kazancı</Text>
              <Text style={styles.providerAmount}>{providerEarning} TL</Text>
            </View>
            <View style={styles.paymentDivider} />
            <View style={styles.paymentLine}>
              <Text style={styles.totalLabel}>Kullanıcının ödeyeceği</Text>
              <Text style={styles.totalPrice}>{provider.price} TL</Text>
            </View>
          </View>

          <View style={styles.commissionInfo}>
            <Text style={styles.commissionInfoTitle}>PetMed güvenli ödeme</Text>
            <Text style={styles.commissionInfoText}>
              Bu prototipte gerçek ödeme alınmaz. Gerçek sürümde ödeme PetMed üzerinden
              işlenecek ve platform komisyonu otomatik olarak ayrılacaktır.
            </Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={completeBooking}>
            <Text style={styles.primaryButtonText}>Rezervasyon Talebini Gönder</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function PetModal({
  visible,
  close,
  photo,
  pickPhoto,
  name,
  setName,
  type,
  setType,
  breed,
  setBreed,
  age,
  setAge,
  weight,
  setWeight,
  save,
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={close}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={close}>
            <Text style={styles.purpleText}>İptal</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Yeni Dost</Text>

          <View style={{ width: 35 }} />
        </View>

        <ScrollView contentContainerStyle={styles.bookingContent}>
          <TouchableOpacity
            style={styles.photoPicker}
            onPress={pickPhoto}
          >
            {photo ? (
              <Image
                source={{ uri: photo }}
                style={styles.photoFill}
              />
            ) : (
              <>
                <Text style={{ fontSize: 35 }}>📷</Text>
                <Text style={styles.purpleText}>
                  Fotoğraf ekle
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Adı"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Türü (Köpek, Kedi...)"
            value={type}
            onChangeText={setType}
          />

          <TextInput
            style={styles.input}
            placeholder="Irkı"
            value={breed}
            onChangeText={setBreed}
          />

          <TextInput
            style={styles.input}
            placeholder="Yaşı"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Kilosu"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={save}
          >
            <Text style={styles.primaryButtonText}>
              Profili Oluştur
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function SelectBox({ selected, title, subtitle, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.selectBox,
        selected && styles.selectBoxActive,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.selectTitle,
          selected && styles.purpleText,
        ]}
      >
        {title}
      </Text>

      <Text style={styles.selectPrice}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

function Option({ text, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.option,
        selected && styles.optionActive,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.optionText,
          selected && styles.optionTextActive,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

function Tab({ icon, label, active, onPress }) {
  return (
    <TouchableOpacity style={styles.tab} onPress={onPress}>
      <Text
        style={[
          styles.tabIcon,
          active && styles.tabActive,
        ]}
      >
        {icon}
      </Text>

      <Text
        style={[
          styles.tabLabel,
          active && styles.tabActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FB',
  },

  mainHeader: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  pageHeader: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    color: '#5B3DF5',
    fontSize: 27,
    fontWeight: '900',
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: '900',
  },

  smallGray: {
    color: '#888',
    fontSize: 12,
    marginTop: 3,
  },

  purpleText: {
    color: '#5B3DF5',
    fontWeight: '700',
  },

  content: {
    padding: 18,
  },

  serviceIntro: {
    color: '#666',
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 18,
  },

  featuredService: {
    backgroundColor: '#5B3DF5',
    borderRadius: 25,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  featuredIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  featuredIconText: {
    color: '#FFF',
    fontSize: 29,
  },

  featuredTag: {
    color: '#CFC6FF',
    fontSize: 10,
    fontWeight: '900',
  },

  featuredTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 3,
  },

  featuredText: {
    color: '#EEEAFE',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },

  serviceArrow: {
    color: '#FFF',
    fontSize: 30,
    marginLeft: 7,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 13,
  },

  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  serviceCard: {
    width: '48%',
    minHeight: 150,
    backgroundColor: '#FFF',
    borderRadius: 21,
    padding: 16,
    marginBottom: 13,
  },

  serviceIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#F0EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  serviceIconText: {
    color: '#5B3DF5',
    fontSize: 21,
    fontWeight: '900',
  },

  serviceTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginTop: 12,
  },

  serviceSubtitle: {
    color: '#888',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 5,
  },

  safetyBox: {
    backgroundColor: '#EEECFF',
    padding: 16,
    borderRadius: 18,
    marginTop: 10,
  },

  safetyTitle: {
    color: '#5B3DF5',
    fontWeight: '900',
  },

  safetyText: {
    color: '#666',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  trackerHero: {
    backgroundColor: '#ECE9FF',
    borderRadius: 22,
    padding: 17,
    flexDirection: 'row',
    marginBottom: 24,
  },

  trackerHeroIcon: {
    fontSize: 35,
    color: '#5B3DF5',
    marginRight: 14,
  },

  trackerHeroTitle: {
    fontSize: 17,
    fontWeight: '900',
  },

  trackerHeroText: {
    color: '#666',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  walkerCard: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 15,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  walkerImage: {
    width: 80,
    height: 80,
    borderRadius: 22,
  },

  walkerName: {
    fontSize: 17,
    fontWeight: '900',
  },

  verify: {
    color: '#5B3DF5',
    fontWeight: '900',
  },

  rating: {
    color: '#F0A500',
    fontWeight: '800',
    fontSize: 12,
    marginTop: 4,
  },

  distance: {
    color: '#5B3DF5',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },

  priceRow: {
    backgroundColor: '#F8F8FC',
    borderRadius: 15,
    padding: 12,
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  priceLabel: {
    color: '#888',
    fontSize: 9,
    textAlign: 'center',
  },

  price: {
    fontWeight: '900',
    marginTop: 3,
    textAlign: 'center',
  },

  primaryButton: {
    backgroundColor: '#5B3DF5',
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 14,
  },

  primaryButtonText: {
    color: '#FFF',
    fontWeight: '900',
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },

  chip: {
    backgroundColor: '#EFEDFF',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 5,
    marginBottom: 5,
  },

  chipText: {
    color: '#5B3DF5',
    fontSize: 10,
    fontWeight: '700',
  },

  petCard: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
  },

  petProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 21,
  },

  petPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 21,
    backgroundColor: '#EEECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  petProfileName: {
    fontSize: 22,
    fontWeight: '900',
  },

  roundAdd: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#5B3DF5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  roundAddText: {
    color: '#FFF',
    fontSize: 28,
  },

  outlineButton: {
    borderWidth: 1.5,
    borderColor: '#5B3DF5',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
  },

  outlineButtonText: {
    color: '#5B3DF5',
    fontWeight: '800',
  },

  empty: {
    alignItems: 'center',
    paddingTop: 80,
  },

  emptyIcon: {
    fontSize: 60,
  },

  emptyTitle: {
    fontSize: 25,
    fontWeight: '900',
    marginTop: 15,
  },

  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 7,
  },

  discoverArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 85,
  },

  cardStack: {
    flex: 1,
    position: 'relative',
  },

  swipeCard: {
    position: 'absolute',
    width: '100%',
    height: '94%',
    borderRadius: 27,
    overflow: 'hidden',
    backgroundColor: '#222',
  },

  backCard: {
    transform: [{ scale: 0.95 }],
    opacity: 0.7,
  },

  fullImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.58)',
  },

  cardInfo: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 25,
  },

  whiteSmall: {
    color: '#EEE',
    fontSize: 12,
  },

  petNameBig: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 7,
  },

  postTitle: {
    color: '#FFF',
    fontSize: 19,
    fontWeight: '900',
    marginTop: 12,
  },

  story: {
    color: '#EEE',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  darkChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 5,
  },

  darkChipText: {
    color: '#FFF',
    fontSize: 10,
  },

  vetResponse: {
    color: '#9DE9BC',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 10,
  },

  swipeActions: {
    height: 65,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -25,
  },

  circleAction: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    elevation: 5,
  },

  x: {
    color: '#5B3DF5',
    fontSize: 35,
  },

  heart: {
    color: '#FF4F77',
    fontSize: 30,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 78,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabIcon: {
    color: '#999',
    fontSize: 19,
  },

  tabLabel: {
    color: '#999',
    fontSize: 9,
    marginTop: 3,
  },

  tabActive: {
    color: '#5B3DF5',
    fontWeight: '900',
  },

  plusButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#5B3DF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 7,
  },

  plus: {
    color: '#FFF',
    fontSize: 34,
  },

  modalHeader: {
    padding: 18,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
  },

  back: {
    color: '#5B3DF5',
    fontSize: 35,
    fontWeight: '400',
  },

  profileContent: {
    padding: 20,
    paddingBottom: 60,
    alignItems: 'center',
  },

  largeProfileImage: {
    width: 135,
    height: 135,
    borderRadius: 68,
  },

  profileName: {
    fontSize: 25,
    fontWeight: '900',
    marginTop: 15,
  },

  verifiedText: {
    color: '#5B3DF5',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
  },

  statsBox: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 18,
    flexDirection: 'row',
    marginTop: 20,
    padding: 15,
  },

  statBox: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 18,
    fontWeight: '900',
  },

  profileSection: {
    width: '100%',
    fontSize: 19,
    fontWeight: '900',
    marginTop: 22,
    marginBottom: 8,
  },

  bio: {
    width: '100%',
    color: '#666',
    lineHeight: 20,
  },

  packageRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  packageCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 17,
    padding: 16,
  },

  packageTime: {
    color: '#777',
  },

  packagePrice: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },

  trackingFeature: {
    width: '100%',
    backgroundColor: '#EEECFF',
    borderRadius: 17,
    padding: 15,
    marginTop: 20,
  },

  trackingTitle: {
    color: '#5B3DF5',
    fontWeight: '900',
  },

  trackingText: {
    color: '#666',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  bookingContent: {
    padding: 20,
    paddingBottom: 60,
  },

  bookingWalker: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },

  bookingWalkerImage: {
    width: 55,
    height: 55,
    borderRadius: 17,
  },

  formTitle: {
    fontSize: 17,
    fontWeight: '900',
    marginTop: 23,
    marginBottom: 11,
  },

  petSelect: {
    width: 90,
    minHeight: 95,
    backgroundColor: '#FFF',
    borderRadius: 17,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  petSelectActive: {
    borderColor: '#5B3DF5',
    backgroundColor: '#F3F1FF',
  },

  petSelectImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  petSelectName: {
    fontWeight: '800',
    fontSize: 11,
    marginTop: 6,
  },

  selectBox: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 17,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  selectBoxActive: {
    borderColor: '#5B3DF5',
    backgroundColor: '#F3F1FF',
  },

  selectTitle: {
    fontWeight: '900',
  },

  selectPrice: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 6,
  },

  optionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  option: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 11,
    marginRight: 8,
    marginBottom: 8,
  },

  optionActive: {
    backgroundColor: '#5B3DF5',
  },

  optionText: {
    fontWeight: '700',
    color: '#555',
  },

  optionTextActive: {
    color: '#FFF',
  },

  noteInput: {
    minHeight: 100,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    textAlignVertical: 'top',
  },

  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 17,
    padding: 17,
    marginTop: 20,
  },

  totalLabel: {
    color: '#666',
  },

  totalPrice: {
    fontSize: 23,
    fontWeight: '900',
    color: '#5B3DF5',
  },

  paymentNote: {
    color: '#999',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 8,
  },

  warningBox: {
    backgroundColor: '#FFF4E5',
    borderRadius: 15,
    padding: 14,
  },

  warningTitle: {
    fontWeight: '900',
  },

  warningText: {
    color: '#777',
    fontSize: 11,
    marginTop: 4,
  },

  photoPicker: {
    width: 125,
    height: 125,
    borderRadius: 63,
    backgroundColor: '#ECE9FF',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 25,
  },

  photoFill: {
    width: '100%',
    height: '100%',
  },

  input: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },

  simpleCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },

  profileIcon: {
    fontSize: 65,
    color: '#5B3DF5',
    marginVertical: 15,
  },

  messageOutlineButton: { borderWidth: 1.5, borderColor: '#5B3DF5', borderRadius: 15, paddingVertical: 13, alignItems: 'center', marginTop: 9 },
  messageOutlineText: { color: '#5B3DF5', fontWeight: '900', fontSize: 12 },
  cardMessageButton: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.45)', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8, marginTop: 10 },
  cardMessageButtonText: { color: '#FFF', fontWeight: '800', fontSize: 11 },
  proPage: { padding: 28, paddingBottom: 60 },
  proBadge: { color: '#5B3DF5', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  proTitle: { fontSize: 29, lineHeight: 36, fontWeight: '900', marginTop: 12, marginBottom: 28 },
  proFeature: { fontSize: 15, color: '#333', marginBottom: 16, lineHeight: 21 },
  proInfoBox: { backgroundColor: '#EEECFF', borderRadius: 16, padding: 15, marginTop: 10 },
  proInfoText: { color: '#625A86', fontSize: 11, lineHeight: 17 },
  proButton: { backgroundColor: '#5B3DF5', borderRadius: 17, padding: 17, alignItems: 'center', marginTop: 20 },
  proButtonText: { color: '#FFF', fontWeight: '900', fontSize: 14 },
  chatStatus: { color: '#5B3DF5', fontSize: 10, fontWeight: '700', marginTop: 2 },
  medicalWarning: { backgroundColor: '#FFF4D8', marginHorizontal: 14, marginTop: 8, padding: 12, borderRadius: 13 },
  medicalWarningText: { color: '#6F5A24', fontSize: 10, lineHeight: 15 },
  chatArea: { flex: 1, padding: 15 },
  chatEmpty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 12 },
  myMessage: { backgroundColor: '#5B3DF5', alignSelf: 'flex-end', maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, marginBottom: 8 },
  myMessageText: { color: '#FFF', lineHeight: 19 },
  messageBar: { flexDirection: 'row', alignItems: 'flex-end', padding: 10, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE' },
  attachmentButton: { color: '#5B3DF5', fontSize: 30, marginHorizontal: 8, marginBottom: 3 },
  messageInput: { flex: 1, backgroundColor: '#F2F2F6', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, maxHeight: 100 },
  sendButton: { marginLeft: 8, backgroundColor: '#5B3DF5', borderRadius: 18, paddingHorizontal: 13, paddingVertical: 11 },
  sendButtonText: { color: '#FFF', fontWeight: '800', fontSize: 11 },

  vetQuestionInfo: {
    backgroundColor: '#EEECFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },

  vetQuestionInfoTitle: {
    color: '#5B3DF5',
    fontWeight: '900',
    fontSize: 15,
  },

  vetQuestionInfoText: {
    color: '#666',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  commissionAmount: {
    color: '#5B3DF5',
    fontWeight: '900',
    fontSize: 13,
  },

  providerAmount: {
    color: '#257542',
    fontWeight: '900',
    fontSize: 13,
  },

  marketPriceBox: {
    backgroundColor: '#F7F6FF',
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    marginBottom: 4,
  },
  marketPriceLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  paymentSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginTop: 22,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECEAFB',
  },
  paymentSummaryTitle: {
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 14,
  },
  paymentLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  paymentLabel: {
    color: '#666',
    fontSize: 12,
    flex: 1,
  },
  paymentValue: {
    color: '#222',
    fontSize: 13,
    fontWeight: '900',
  },
  paymentDivider: {
    height: 1,
    backgroundColor: '#ECECEC',
    marginVertical: 10,
  },
  commissionInfo: {
    backgroundColor: '#EEECFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  commissionInfoTitle: {
    color: '#5B3DF5',
    fontWeight: '900',
    fontSize: 13,
  },
  commissionInfoText: {
    color: '#625A86',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },
  noPetBookingBox: {
    backgroundColor: '#FFF4E5',
    borderRadius: 15,
    padding: 14,
    marginBottom: 12,
  },
  noPetBookingTitle: {
    fontWeight: '900',
    fontSize: 12,
  },
  noPetBookingText: {
    color: '#777',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  dailyCard: {
    backgroundColor: '#5B3DF5',
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyHello: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  dailySub: { color: '#E7E1FF', fontSize: 11, lineHeight: 16, marginTop: 4 },
  dailyAction: { backgroundColor: '#FFF', borderRadius: 20, paddingVertical: 9, paddingHorizontal: 14, marginLeft: 10 },
  dailyActionText: { color: '#5B3DF5', fontWeight: '900', fontSize: 11 },
  quickRow: { flexDirection: 'row', marginHorizontal: -4, marginBottom: 18 },
  quickCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 17, padding: 12, marginHorizontal: 4, borderWidth: 1, borderColor: '#EEEAFB' },
  quickIcon: { color: '#5B3DF5', fontSize: 20, fontWeight: '900' },
  quickTitle: { fontWeight: '900', fontSize: 12, marginTop: 8 },
  quickSub: { color: '#888', fontSize: 10, marginTop: 2 },
  communityMiniCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 14, marginTop: 8, borderWidth: 1, borderColor: '#EEE' },
  communityMiniOwner: { color: '#5B3DF5', fontWeight: '900', fontSize: 10 },
  communityMiniText: { color: '#333', fontSize: 12, lineHeight: 18, marginTop: 5 },
  healthHero: { backgroundColor: '#EEECFF', borderRadius: 22, padding: 20, marginBottom: 16 },
  healthHeroIcon: { color: '#5B3DF5', fontSize: 30, fontWeight: '900' },
  healthHeroTitle: { fontSize: 18, fontWeight: '900', marginTop: 8 },
  healthHeroText: { color: '#666', fontSize: 11, lineHeight: 17, marginTop: 5 },
  infoCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
  infoCardType: { color: '#5B3DF5', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  infoCardTitle: { color: '#222', fontSize: 14, fontWeight: '900', marginTop: 3 },
  statusPill: { backgroundColor: '#EEECFF', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  statusPillText: { color: '#5B3DF5', fontSize: 9, fontWeight: '900' },
  reminderCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 15, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
  reminderDone: { opacity: 0.5 },
  reminderCheck: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#EEECFF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  reminderCheckText: { color: '#5B3DF5', fontSize: 18, fontWeight: '900' },
  lostHero: { backgroundColor: '#FFF1F1', borderRadius: 22, padding: 24, alignItems: 'center', marginBottom: 16 },
  lostHeroActive: { backgroundColor: '#FFE2E2' },
  lostIcon: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#E53935', color: '#FFF', textAlign: 'center', lineHeight: 58, fontSize: 30, fontWeight: '900' },
  lostTitle: { fontSize: 20, fontWeight: '900', marginTop: 12 },
  lostText: { color: '#666', fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 6 },
  dangerButton: { backgroundColor: '#E53935', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 14 },
  dangerButtonText: { color: '#FFF', fontWeight: '900' },
  dangerOutlineButton: { borderWidth: 1, borderColor: '#E53935', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 14 },
  dangerOutlineText: { color: '#E53935', fontWeight: '900' },
  mapDemo: { height: 180, backgroundColor: '#EEECFF', borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  mapDemoIcon: { color: '#5B3DF5', fontSize: 40, fontWeight: '900' },
  mapDemoTitle: { fontSize: 17, fontWeight: '900', marginTop: 7 },
  postComposer: { padding: 18 },
  postComposerTitle: { fontSize: 15, fontWeight: '900', color: '#5B3DF5', marginBottom: 12 },
  postInput: { minHeight: 180, backgroundColor: '#F7F7FB', borderRadius: 18, padding: 16, fontSize: 15, textAlignVertical: 'top' },
  postHint: { backgroundColor: '#FFF8D9', borderRadius: 14, padding: 12, marginTop: 12 },
  postHintText: { color: '#6F6540', fontSize: 10, lineHeight: 15 },
  publishText: { color: '#5B3DF5', fontWeight: '900', fontSize: 14 },

  healthProfileCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE', marginBottom: 12 },
  healthAvatar: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#EEECFF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  healthPetName: { fontSize: 18, fontWeight: '900' },
  healthStatusGood: { backgroundColor: '#E6F7EC', borderRadius: 16, paddingHorizontal: 11, paddingVertical: 7 },
  healthStatusGoodText: { color: '#25844A', fontWeight: '900', fontSize: 10 },
  healthStatsRow: { flexDirection: 'row', marginHorizontal: -4, marginBottom: 20 },
  healthStat: { flex: 1, marginHorizontal: 4, backgroundColor: '#F7F6FF', borderRadius: 16, padding: 13, alignItems: 'center' },
  healthStatNumber: { color: '#5B3DF5', fontSize: 20, fontWeight: '900' },
  healthStatLabel: { color: '#777', fontSize: 10, marginTop: 3 },
  medicalCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 9, borderWidth: 1, borderColor: '#EEE' },
  medicalIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F7F6FF', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  medicalNext: { color: '#5B3DF5', fontSize: 10, fontWeight: '700', marginTop: 4 },
  medicalStatus: { color: '#5B3DF5', fontSize: 9, fontWeight: '900', marginLeft: 8 },
  medicineCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#EEE' },
  medicineActive: { color: '#25844A', backgroundColor: '#E6F7EC', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 5, fontSize: 9, fontWeight: '900' },
  healthNote: { color: '#777', fontSize: 10, lineHeight: 15, marginTop: 10 },
  reminderHero: { backgroundColor: '#5B3DF5', borderRadius: 22, padding: 20, marginBottom: 20 },
  reminderHeroTitle: { color: '#DDD5FF', fontSize: 11, fontWeight: '800' },
  reminderHeroBig: { color: '#FFF', fontSize: 24, fontWeight: '900', marginTop: 4 },
  reminderHeroSub: { color: '#E8E3FF', fontSize: 10, marginTop: 5 },
  reminderArrow: { color: '#AAA', fontSize: 26, marginLeft: 8 },
  upcomingCard: { backgroundColor: '#FFF', borderRadius: 17, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 9, borderWidth: 1, borderColor: '#EEE' },
  upcomingDate: { width: 52, color: '#5B3DF5', fontSize: 11, fontWeight: '900', marginRight: 10 },
  lostIconCircle: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#E53935', alignItems: 'center', justifyContent: 'center' },
  lostIconText: { color: '#FFF', fontSize: 34, fontWeight: '900' },
  lostPetPreview: { backgroundColor: '#FFF', borderRadius: 18, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#EEE' },
  lostPetAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#F3F1FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  lostFeature: { backgroundColor: '#FFF', borderRadius: 17, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 9, borderWidth: 1, borderColor: '#EEE' },
  lostFeatureIcon: { width: 42, color: '#5B3DF5', fontSize: 16, fontWeight: '900', textAlign: 'center', marginRight: 8 },
  placeSearch: { backgroundColor: '#FFF', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E8E8E8', marginBottom: 12 },
  placeSearchText: { color: '#888', fontSize: 11 },
  placeCategories: { flexDirection: 'row', marginBottom: 14 },
  placeCategory: { paddingHorizontal: 13, paddingVertical: 8, backgroundColor: '#FFF', borderRadius: 18, marginRight: 7, borderWidth: 1, borderColor: '#EEE' },
  placeCategoryActive: { backgroundColor: '#5B3DF5', borderColor: '#5B3DF5' },
  placeCategoryText: { color: '#777', fontSize: 10, fontWeight: '800' },
  placeCategoryTextActive: { color: '#FFF' },
  placeCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#EEE' },
  placeIconBox: { width: 55, height: 55, borderRadius: 16, backgroundColor: '#F7F6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  placeOpen: { color: '#25844A', fontSize: 9, fontWeight: '900', marginTop: 3 },


  formModalCard: { width: '92%', maxHeight: '88%', backgroundColor: '#FFF', borderRadius: 24, padding: 20 },
  formLabel: { fontSize: 11, fontWeight: '800', color: '#555', marginBottom: 8 },
  activeFormChip: { backgroundColor: '#5B3DF5', borderColor: '#5B3DF5' },
  activeFormChipText: { color: '#FFF' },
  smallDeleteButton: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 12, backgroundColor: '#FFF0F0', marginLeft: 8 },
  smallDeleteText: { color: '#D33', fontSize: 10, fontWeight: '900' },
  emptyInfoBox: { backgroundColor: '#F7F6FF', borderRadius: 16, padding: 14, marginBottom: 14 },
  notificationInfo: { backgroundColor: '#F7F6FF', borderRadius: 16, padding: 14, marginVertical: 14 },
  vetProfileStats: { flexDirection: 'row', marginHorizontal: -4, marginTop: 18, marginBottom: 12 },
  profileBodyText: { color: '#555', fontSize: 12, lineHeight: 19, marginBottom: 12 },
  reviewCard: { backgroundColor: '#F8F8FA', borderRadius: 15, padding: 13, marginBottom: 8 },


  chatMessagesContent: { padding: 16, paddingBottom: 24 },
  chatInfoBox: { backgroundColor: '#F7F6FF', borderRadius: 16, padding: 13, marginBottom: 14 },
  chatInfoTitle: { color: '#5B3DF5', fontWeight: '900', fontSize: 11, marginBottom: 4 },
  myChatBubble: { alignSelf: 'flex-end', maxWidth: '82%', backgroundColor: '#5B3DF5', borderRadius: 18, borderBottomRightRadius: 5, padding: 10, marginBottom: 9 },
  myChatText: { color: '#FFF', fontSize: 12, lineHeight: 18 },
  chatMediaImage: { width: 210, height: 180, borderRadius: 13, marginBottom: 8 },
  chatAttachmentCard: { flexDirection: 'row', alignItems: 'center', minWidth: 210, backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 13, padding: 10, marginBottom: 7 },
  chatAttachmentIcon: { color: '#FFF', fontSize: 22, marginRight: 10 },
  chatAttachmentTitle: { color: '#FFF', fontSize: 11, fontWeight: '900' },
  chatAttachmentSub: { color: '#EEE', fontSize: 9, marginTop: 2 },
  pendingAttachment: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F6FF', marginHorizontal: 12, marginBottom: 7, padding: 10, borderRadius: 14 },
  pendingAttachmentTitle: { fontSize: 11, fontWeight: '900', color: '#333' },
  removeAttachmentButton: { backgroundColor: '#FFF0F0', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 6 },
  removeAttachmentText: { color: '#C33', fontSize: 9, fontWeight: '900' },
  chatTools: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 7, borderTopWidth: 1, borderTopColor: '#EEE', backgroundColor: '#FFF' },
  chatToolButton: { flex: 1, alignItems: 'center', paddingVertical: 7 },
  chatToolIcon: { color: '#5B3DF5', fontSize: 19, fontWeight: '900' },
  chatToolText: { color: '#555', fontSize: 9, fontWeight: '800', marginTop: 3 },
  chatComposer: { flexDirection: 'row', alignItems: 'flex-end', padding: 10, borderTopWidth: 1, borderTopColor: '#EEE', backgroundColor: '#FFF' },
  chatInput: { flex: 1, minHeight: 42, maxHeight: 100, backgroundColor: '#F4F4F6', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, fontSize: 12 },
  chatSendButton: { backgroundColor: '#5B3DF5', borderRadius: 18, paddingHorizontal: 15, paddingVertical: 12, marginLeft: 8 },
  chatSendText: { color: '#FFF', fontSize: 10, fontWeight: '900' },

});
