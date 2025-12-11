import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, TextInput, Linking, Keyboard, Alert } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Region, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Navigation, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import { MOCK_PITS, Pit, MATERIAL_TYPES } from '@/constants/MockData';

// City coordinates for search functionality
const CITY_COORDS: Record<string, Region> = {
    'oklahoma city, ok': { latitude: 35.4676, longitude: -97.5164, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'oklahoma city': { latitude: 35.4676, longitude: -97.5164, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'tulsa, ok': { latitude: 36.1540, longitude: -95.9928, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'tulsa': { latitude: 36.1540, longitude: -95.9928, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'norman, ok': { latitude: 35.2226, longitude: -97.4395, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'norman': { latitude: 35.2226, longitude: -97.4395, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'edmond, ok': { latitude: 35.6528, longitude: -97.4781, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'edmond': { latitude: 35.6528, longitude: -97.4781, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'broken arrow, ok': { latitude: 36.0526, longitude: -95.7908, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'broken arrow': { latitude: 36.0526, longitude: -95.7908, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'lawton, ok': { latitude: 34.6036, longitude: -98.3960, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'lawton': { latitude: 34.6036, longitude: -98.3960, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'moore, ok': { latitude: 35.3395, longitude: -97.4867, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'moore': { latitude: 35.3395, longitude: -97.4867, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'midwest city, ok': { latitude: 35.4495, longitude: -97.3967, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'midwest city': { latitude: 35.4495, longitude: -97.3967, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'stillwater, ok': { latitude: 36.1156, longitude: -97.0584, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'stillwater': { latitude: 36.1156, longitude: -97.0584, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'enid, ok': { latitude: 36.3956, longitude: -97.8784, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'enid': { latitude: 36.3956, longitude: -97.8784, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'muskogee, ok': { latitude: 35.7479, longitude: -95.3697, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'muskogee': { latitude: 35.7479, longitude: -95.3697, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'bartlesville, ok': { latitude: 36.7473, longitude: -95.9708, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'bartlesville': { latitude: 36.7473, longitude: -95.9708, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'shawnee, ok': { latitude: 35.3276, longitude: -96.9253, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'shawnee': { latitude: 35.3276, longitude: -96.9253, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'owasso, ok': { latitude: 36.2695, longitude: -95.8547, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'owasso': { latitude: 36.2695, longitude: -95.8547, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'yukon, ok': { latitude: 35.5006, longitude: -97.7428, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    'yukon': { latitude: 35.5006, longitude: -97.7428, latitudeDelta: 0.1, longitudeDelta: 0.1 },
};

// Get city display names (with state) for suggestions
const CITY_SUGGESTIONS = Object.keys(CITY_COORDS).filter(key => key.includes(', '));

const CONTENT = {
    en: {
        searchPlaceholder: 'Search City...',
        dumpSite: 'Dump Site',
        pickupSite: 'Pickup Site',
        whatToDo: 'What would you like to do?',
        dump: 'Dump',
        pickup: 'Pick Up',
        selectMaterial: 'Select Material',
        cancel: 'Cancel',
        getDirections: 'Get Directions',
        price: 'Price:',
        hours: 'Hours:',
        phone: 'Phone:',
        locationSaved: 'Location Saved',
        locationSavedDesc: 'Your location has been updated on the map.',
        directionsTitle: 'Get Directions',
        directionsBody: 'Choose an app for directions',
        appleMaps: 'Apple Maps',
        googleMaps: 'Google Maps',
        pitSelf: 'MY PIT LOCATION',
        buyerSelf: 'MY BUYER SITE',
    },
    es: {
        searchPlaceholder: 'Buscar Ciudad...',
        dumpSite: 'Sitio de Vertedero',
        pickupSite: 'Sitio de Recogida',
        whatToDo: '¿Qué te gustaría hacer?',
        dump: 'Vertedero',
        pickup: 'Recoger',
        selectMaterial: 'Seleccionar Material',
        cancel: 'Cancelar',
        getDirections: 'Obtener Direcciones',
        price: 'Precio:',
        hours: 'Horario:',
        phone: 'Teléfono:',
        locationSaved: 'Ubicación Guardada',
        locationSavedDesc: 'Tu ubicación se ha actualizado en el mapa.',
        directionsTitle: 'Obtener Direcciones',
        directionsBody: 'Elige una aplicación',
        appleMaps: 'Mapas de Apple',
        googleMaps: 'Mapas de Google',
        pitSelf: 'MI CANTERA',
        buyerSelf: 'MI SITIO',
    }
};

export default function MapScreen() {
    const router = useRouter();
    const [currentRole, setCurrentRole] = useState<'DRIVER' | 'PIT' | 'BUYER' | null>(null);
    const [language, setLanguage] = useState<'en' | 'es'>('en'); // Default to English
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [selectedPit, setSelectedPit] = useState<Pit | null>(null);
    const [mode, setMode] = useState<'IDLE' | 'SELECTING_ACTION' | 'SELECTING_MATERIAL' | 'SHOWING_PITS' | 'LOCATION_SAVED'>('IDLE');
    const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchedCity, setSearchedCity] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const mapRef = React.useRef<MapView>(null);

    const [region, setRegion] = useState<Region>({
        latitude: 35.4676,
        longitude: -97.5164,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
    });

    useEffect(() => {
        (async () => {
            // Get User Role
            try {
                const session = await AsyncStorage.getItem('user_session');
                if (session) {
                    const user = JSON.parse(session);
                    console.log('User Role:', user.role);
                    setCurrentRole(user.role);
                    if (user.language) {
                        setLanguage(user.language);
                    }
                }
            } catch (e) {
                console.error('Failed to load user role', e);
            }

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            const userRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };
            setRegion(userRegion);
            mapRef.current?.animateToRegion(userRegion, 1000);
        })();
    }, []);

    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            const filtered = CITY_SUGGESTIONS.filter(city =>
                city.toLowerCase().includes(searchQuery.toLowerCase())
            ).slice(0, 5);
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    }, [searchQuery]);

    const t = CONTENT[language];

    const handleSearch = (manualQuery?: string) => {
        const textToSearch = typeof manualQuery === 'string' ? manualQuery : searchQuery;

        if (!textToSearch.trim()) return;

        const query = textToSearch.toLowerCase().trim();
        const matchedCity = CITY_COORDS[query];

        if (matchedCity) {
            setSearchedCity(query);
            mapRef.current?.animateToRegion(matchedCity, 1000);
            setRegion(matchedCity);
            setIsSearching(false);
            Keyboard.dismiss();

            if (currentRole === 'DRIVER') {
                setTimeout(() => {
                    setMode('SELECTING_ACTION');
                }, 500);
            } else {
                // For PIT and BUYER, "Save" this location
                setMode('LOCATION_SAVED');
                Alert.alert(t.locationSaved, t.locationSavedDesc);
            }

        } else {
            setIsSearching(false);
            Keyboard.dismiss();
            if (currentRole === 'DRIVER') {
                setMode('SELECTING_ACTION');
            } else if (currentRole) {
                // Even if generic search, allow "saving" for non-drivers (mock behavior)
                setMode('LOCATION_SAVED');
                Alert.alert(t.locationSaved, t.locationSavedDesc);
                // In real app we'd geocode the query string
            }
        }
    };

    const handleActionSelect = (action: 'DUMP' | 'PICKUP') => {
        if (action === 'PICKUP') {
            setMode('SELECTING_MATERIAL');
        } else {
            setSelectedMaterial(null);
            setMode('SHOWING_PITS');
        }
    };

    const handleMaterialSelect = (material: string) => {
        setSelectedMaterial(material);
        setMode('SHOWING_PITS');
    };

    const handleGetDirections = (pit?: Pit) => {
        const targetPit = pit || selectedPit;
        if (!targetPit) return;

        const { latitude, longitude } = targetPit.coordinate;
        const latLng = `${latitude},${longitude}`;
        const label = encodeURIComponent(targetPit.name);

        if (Platform.OS === 'ios') {
            Alert.alert(
                t.directionsTitle,
                t.directionsBody,
                [
                    {
                        text: t.appleMaps,
                        onPress: () => {
                            Linking.openURL(`maps://?daddr=${latLng}&q=${label}`);
                        }
                    },
                    {
                        text: t.googleMaps,
                        onPress: () => {
                            Linking.openURL(`comgooglemaps://?daddr=${latLng}&q=${label}`)
                                .catch(() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latLng}`));
                        }
                    },
                    {
                        text: t.cancel,
                        style: 'cancel'
                    }
                ]
            );
        } else {
            const url = `google.navigation:q=${latLng}`;
            Linking.openURL(url).catch(() => {
                Linking.openURL(`geo:${latLng}?q=${latLng}(${targetPit.name})`);
            });
        }
    };

    const generatedPits = useMemo(() => {
        return Object.keys(CITY_COORDS)
            .filter(key => key.includes(','))
            .map((key, index) => {
                const region = CITY_COORDS[key];
                // Randomly assign DUMP or PICKUP for simulation
                const type = index % 2 === 0 ? 'DUMP' : 'PICKUP';

                return {
                    id: `generated-${index}`,
                    name: key.toUpperCase(),
                    coordinate: {
                        latitude: region.latitude,
                        longitude: region.longitude,
                    },
                    price: '$249.99',
                    hours: '8am - 6pm',
                    phone: '555-0123',
                    materials: MATERIAL_TYPES,
                    type: type, // Added type
                } as Pit;
            });
    }, []);

    const filteredPits = (() => {
        // DRIVER Logic: Show ALL Pits always (Search just moves camera)
        if (currentRole === 'DRIVER') {
            return generatedPits;
        }

        if (!searchedCity) return [];

        // PIT/BUYER Logic: Show ONLY their "Saved" location (Requires Search)
        // PIT/BUYER Logic: Show ONLY their "Saved" location (Requires Search)
        if (mode === 'LOCATION_SAVED' || mode === 'IDLE') {
            // Create a single mock marker for the user's location
            const region = CITY_COORDS[searchedCity];
            if (!region) return [];

            return [{
                id: 'user-self-location',
                name: currentRole === 'PIT' ? t.pitSelf : t.buyerSelf,
                coordinate: { latitude: region.latitude, longitude: region.longitude },
                price: 'N/A',
                hours: '9am - 5pm',
                phone: 'My Phone',
                materials: [],
                type: currentRole === 'PIT' ? 'DUMP' : 'PICKUP' // Reuse type for logic if needed, or ignore
            } as Pit];
        }

        return [];
    })();

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={region}
                showsUserLocation={true}
                onPress={() => {
                    setSelectedPit(null);
                    if (isSearching) setIsSearching(false);
                }}
            >
                <UrlTile
                    urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maximumZ={19}
                    flipY={false}
                />

                {filteredPits.map((pit) => {
                    // Marker Color Logic
                    let markerColor = '#EF4444'; // Default Red
                    let markerFill = '#FECACA';

                    if (currentRole === 'DRIVER') {
                        if (pit.type === 'PICKUP') {
                            markerColor = '#F97316'; // Orange for Pickup (Buyer sites)
                            markerFill = '#FFEDD5';
                        } else {
                            // Red for Dump (Pit sites)
                            markerColor = '#EF4444';
                            markerFill = '#FECACA';
                        }
                    } else if (currentRole === 'PIT') {
                        markerColor = '#EF4444'; // Red for Pit Self
                        markerFill = '#FECACA';
                    } else if (currentRole === 'BUYER') {
                        markerColor = '#F97316'; // Orange for Buyer Self
                        markerFill = '#FFEDD5';
                    }

                    return (
                        <Marker
                            key={pit.id}
                            coordinate={pit.coordinate}
                            onPress={() => {
                                setSelectedPit(pit);
                                mapRef.current?.animateToRegion({
                                    latitude: pit.coordinate.latitude,
                                    longitude: pit.coordinate.longitude,
                                    latitudeDelta: 0.005,
                                    longitudeDelta: 0.005,
                                }, 500);
                            }}
                        >
                            <View style={styles.markerContainer}>
                                <MapPin color={markerColor} fill={markerFill} size={40} />
                            </View>

                            <Callout tooltip onPress={() => handleGetDirections(pit)}>
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutTitle}>{pit.name}</Text>
                                    <Text style={styles.calloutText}>{pit.price}</Text>
                                    <Text style={styles.calloutText}>{pit.hours}</Text>
                                    <Text style={styles.calloutText}>{pit.phone}</Text>

                                    <View style={styles.calloutButton}>
                                        <Navigation color="white" size={12} style={{ marginRight: 4 }} />
                                        <Text style={styles.calloutButtonText}>{t.getDirections}</Text>
                                    </View>
                                </View>
                            </Callout>
                        </Marker>
                    );
                })}
            </MapView>

            <SafeAreaView style={styles.topContainer} edges={['top']}>
                {/* 1. Header Row container created here.
                  2. Back Button moved INSIDE this flow.
                  3. Search Bar made flexible (flex: 1) to take remaining space.
                */}
                <View style={styles.headerRow}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={async () => {
                            await AsyncStorage.removeItem('user_session');
                            router.replace('/signup');
                        }}
                    >
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>

                    <View style={styles.searchBar}>
                        <Search color="#64748B" size={20} />
                        {isSearching ? (
                            <>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder={t.searchPlaceholder}
                                    placeholderTextColor="#94A3B8"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    onSubmitEditing={() => handleSearch()}
                                    autoFocus
                                    returnKeyType="search"
                                />
                                <TouchableOpacity onPress={() => {
                                    if (searchQuery.length > 0) {
                                        setSearchQuery('');
                                        setSuggestions([]);
                                    } else {
                                        setIsSearching(false);
                                        setSearchQuery('');
                                        setSuggestions([]);
                                        Keyboard.dismiss();
                                    }
                                }}>
                                    <X color="#64748B" size={20} />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={styles.searchText} numberOfLines={1}>
                                    {searchQuery || t.searchPlaceholder}
                                </Text>
                                <TouchableOpacity
                                    style={styles.searchButton}
                                    onPress={() => setIsSearching(true)}
                                >
                                    <Text style={{ color: 'transparent' }}>Search</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>

                {isSearching && suggestions.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                        {suggestions.map((suggestion, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.suggestionItem}
                                onPress={() => {
                                    setSearchQuery(suggestion);
                                    setSuggestions([]);
                                    handleSearch(suggestion);
                                }}
                            >
                                <MapPin color="#64748B" size={16} />
                                <Text style={styles.suggestionText}>{suggestion}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </SafeAreaView>

            {
                currentRole === 'DRIVER' && (
                    <View style={styles.legendContainer}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                            <Text style={styles.legendText}>{t.dumpSite}</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#F97316' }]} />
                            <Text style={styles.legendText}>{t.pickupSite}</Text>
                        </View>
                    </View>
                )
            }

            {
                mode === 'SELECTING_ACTION' && currentRole === 'DRIVER' && (
                    <View style={styles.overlay}>
                        <View style={styles.card}>
                            <Text style={styles.title}>{t.whatToDo}</Text>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
                                    onPress={() => handleActionSelect('DUMP')}
                                >
                                    <Text style={styles.actionButtonText}>{t.dump}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                                    onPress={() => handleActionSelect('PICKUP')}
                                >
                                    <Text style={styles.actionButtonText}>{t.pickup}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )
            }

            {
                mode === 'SELECTING_MATERIAL' && (
                    <View style={styles.overlay}>
                        <View style={styles.card}>
                            <Text style={styles.title}>{t.selectMaterial}</Text>
                            {MATERIAL_TYPES.map((mat) => (
                                <TouchableOpacity
                                    key={mat}
                                    style={styles.listItem}
                                    onPress={() => handleMaterialSelect(mat)}
                                >
                                    <Text style={styles.listItemText}>{mat}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setMode('IDLE')}
                            >
                                <Text style={styles.closeButtonText}>{t.cancel}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }

            {
                selectedPit && (
                    <View style={styles.bottomCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.pitName}>{selectedPit.name}</Text>
                            <TouchableOpacity onPress={() => setSelectedPit(null)}>
                                <X color="#94A3B8" size={24} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.cardContent}>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>{t.price}</Text>
                                <Text style={styles.value}>{selectedPit.price}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>{t.hours}</Text>
                                <Text style={styles.value}>{selectedPit.hours}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>{t.phone}</Text>
                                <Text style={styles.value}>{selectedPit.phone}</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.directionsButton}
                                onPress={() => handleGetDirections()}
                            >
                                <Navigation color="white" size={20} />
                                <Text style={styles.directionsText}>{t.getDirections}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    topContainer: {
        position: 'absolute',
        top: 0,
        width: '100%',
        padding: 10,
        alignItems: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        gap: 12, // Space between Back Arrow and Search Bar
        paddingHorizontal: 8,
    },
    searchBar: {
        flex: 1, // Changed from width: '95%' to flex: 1 so it takes remaining space
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        gap: 10,
    },
    // Updated Back Button Styles (Removed absolute positioning)
    backButton: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonText: {
        color: '#0F172A',
        fontWeight: '600',
        fontSize: 16,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#0F172A',
    },
    searchText: {
        flex: 1,
        color: '#64748B',
        fontSize: 16,
    },
    searchButton: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    suggestionsContainer: {
        backgroundColor: 'white',
        width: '100%', // Match header width
        marginTop: 8,
        marginHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        maxHeight: 250,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    suggestionText: {
        fontSize: 15,
        color: '#334155',
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    calloutContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        width: 180,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
        textAlign: 'center',
    },
    calloutText: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 2,
    },
    calloutButton: {
        marginTop: 6,
        flexDirection: 'row',
        backgroundColor: '#3B82F6',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    calloutButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#0F172A',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    listItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    listItemText: {
        fontSize: 16,
        color: '#334155',
    },
    closeButton: {
        marginTop: 16,
        alignItems: 'center',
        padding: 12,
    },
    closeButtonText: {
        color: '#EF4444',
        fontSize: 16,
    },
    bottomCard: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    pitName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    closeText: {
        fontSize: 18,
        color: '#94A3B8',
        padding: 4,
    },
    cardContent: {
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        color: '#64748B',
        fontSize: 14,
    },
    value: {
        color: '#0F172A',
        fontSize: 14,
        fontWeight: '500',
    },
    directionsButton: {
        flexDirection: 'row',
        backgroundColor: '#3B82F6',
        padding: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        gap: 8,
    },
    directionsText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    legendContainer: {
        position: 'absolute',
        top: 140,
        right: 16,
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        gap: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendText: {
        fontSize: 14,
        color: '#334155',
        fontWeight: '500',
    },
});