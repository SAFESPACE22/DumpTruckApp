import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Truck, Pickaxe, HardHat, Check, Globe } from 'lucide-react-native';

type Role = 'DRIVER' | 'PIT' | 'BUYER';

const CONTENT = {
    en: {
        iam: 'Choose your role!',
        driver: 'Driver',
        driverDesc: 'I haul materials between locations',
        pit: 'Pit Operator',
        pitDesc: 'I manage a dump site or quarry',
        buyer: 'Material',
        buyerDesc: 'I need materials delivered',
        details: 'My Details',
        nameLabel: 'Full Name',
        namePlaceholder: 'John Doe',
        phoneLabel: 'Phone Number',
        button: 'Get Started',
        loading: 'Creating Account...',
        selectionError: 'Please select a role to continue.',
        nameError: 'Please enter your name.',
        phoneError: 'Please enter your phone number.',
        errorTitle: 'Error',
        genericError: 'Failed to save account details. Please try again.',
        selectionTitle: 'Selection Required',
        nameTitle: 'Name Required',
        phoneTitle: 'Phone Required',
    },
    es: {
        iam: 'Selecciona tu rol!',
        driver: 'Conductor',
        driverDesc: 'Transporto materiales entre sitios',
        pit: 'Operador de Cantera',
        pitDesc: 'Gestiono un vertedero o cantera',
        buyer: 'Comprador',
        buyerDesc: 'Necesito entrega de materiales',
        details: 'Mis Detalles',
        nameLabel: 'Nombre Completo',
        namePlaceholder: 'Juan Pérez',
        phoneLabel: 'Número de Teléfono',
        button: 'Comenzar',
        loading: 'Creando Cuenta...',
        selectionError: 'Por favor selecciona un rol para continuar.',
        nameError: 'Por favor ingresa tu nombre.',
        phoneError: 'Por favor ingresa tu número de teléfono.',
        errorTitle: 'Error',
        genericError: 'No se pudieron guardar los detalles. Inténtalo de nuevo.',
        selectionTitle: 'Selección Requerida',
        nameTitle: 'Nombre Requerido',
        phoneTitle: 'Teléfono Requerido',
    }
};

export default function SignupScreen() {
    const router = useRouter();
    const [role, setRole] = useState<Role | null>(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [language, setLanguage] = useState<'en' | 'es'>('en');

    const t = CONTENT[language];

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'es' : 'en');
    };

    const handleSignup = async () => {
        if (!role) {
            Alert.alert(t.selectionTitle, t.selectionError);
            return;
        }
        if (!name.trim()) {
            Alert.alert(t.nameTitle, t.nameError);
            return;
        }
        if (!phone.trim()) {
            Alert.alert(t.phoneTitle, t.phoneError);
            return;
        }

        try {
            setIsLoading(true);
            const user = {
                role,
                name,
                phone,
                id: Math.random().toString(36).substr(2, 9), // Simple ID generation
                createdAt: new Date().toISOString(),
                language, // Save preference
            };

            await AsyncStorage.setItem('user_session', JSON.stringify(user));

            // Navigate to home logic will happen via layout or direct replace
            router.replace('/');
        } catch (error) {
            Alert.alert(t.errorTitle, t.genericError);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderRoleCard = (type: Role, label: string, Icon: any, description: string) => {
        const isSelected = role === type;
        return (
            <TouchableOpacity
                style={[styles.roleCard, isSelected && styles.roleCardSelected]}
                onPress={() => setRole(type)}
                activeOpacity={0.7}
            >
                <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                    <Icon color={isSelected ? 'white' : '#64748B'} size={24} />
                </View>
                <View style={styles.roleContent}>
                    <Text style={[styles.roleTitle, isSelected && styles.roleTitleSelected]}>{label}</Text>
                    <Text style={[styles.roleDescription, isSelected && styles.roleDescriptionSelected]}>{description}</Text>
                </View>
                {isSelected && (
                    <View style={styles.checkIcon}>
                        <Check color="#3B82F6" size={20} />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.langButton} onPress={toggleLanguage}>
                    <Globe size={20} color="#64748B" />
                    <Text style={styles.langText}>{language === 'en' ? 'Español' : 'English'}</Text>
                </TouchableOpacity>
            </View>

            {/*<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>*/}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
            >


                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t.iam}</Text>
                    <View style={styles.rolesContainer}>
                        {renderRoleCard('DRIVER', t.driver, Truck, t.driverDesc)}
                        {renderRoleCard('PIT', t.pit, Pickaxe, t.pitDesc)}
                        {renderRoleCard('BUYER', t.buyer, HardHat, t.buyerDesc)}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t.details}</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>{t.nameLabel}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={t.namePlaceholder}
                            placeholderTextColor="#94A3B8"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>{t.phoneLabel}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="(555) 555-5555"
                            placeholderTextColor="#94A3B8"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                </View>

                <TouchableOpacity
                    style={[styles.button, (!role || !name || !phone) && styles.buttonDisabled]}
                    onPress={handleSignup}
                    disabled={isLoading || !role || !name || !phone}
                >
                    <Text style={styles.buttonText}>{isLoading ? t.loading : t.button}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    langButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: 'white',
        borderRadius: 20,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    langText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    scrollContent: {
        padding: 24,
        paddingTop: 8, // Reduced since we have topBar
    },
    header: {
        marginBottom: 32,
        marginTop: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 16,
    },
    rolesContainer: {
        gap: 12,
    },
    roleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    roleCardSelected: {
        borderColor: '#3B82F6',
        backgroundColor: '#F0F9FF',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    iconContainerSelected: {
        backgroundColor: '#3B82F6',
    },
    roleContent: {
        flex: 1,
    },
    roleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
    },
    roleTitleSelected: {
        color: '#3B82F6',
    },
    roleDescription: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
    roleDescriptionSelected: {
        color: '#60A5FA',
    },
    checkIcon: {
        marginLeft: 8,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#334155',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        color: '#0F172A',
    },
    button: {
        backgroundColor: '#0F172A',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        backgroundColor: '#94A3B8',
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});
