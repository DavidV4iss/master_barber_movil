import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import CalificacionesRepository from '../repositories/CalificacionesRepository';
import UsuariosRepository from '../repositories/UsuariosRepository';
import { getBaseURL } from '../config/api';
import Modal from 'react-native-modal';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.8;

export default function CalificacionesAdmin() {
    const [calificaciones, setCalificaciones] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [show, setShow] = useState(false);
    const [selectedCalificacion, setSelectedCalificacion] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resCal = await CalificacionesRepository.traerCalificaciones();
                const resUsu = await UsuariosRepository.traerUsuarios();
                setCalificaciones(Array.isArray(resCal.data) ? resCal.data : []);
                setUsuarios(Array.isArray(resUsu.data) ? resUsu.data : []);
            } catch (err) {
                console.log("Error al obtener los datos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (calificaciones.length > 0) {
                const nextIndex = (currentIndex + 1) % calificaciones.length;
                scrollToIndex(nextIndex);
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [currentIndex, calificaciones]);

    const scrollToIndex = (index) => {
        setCurrentIndex(index);
        scrollRef.current?.scrollTo({
            x: index * CARD_WIDTH,
            animated: true,
        });
    };

    const handleScroll = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / CARD_WIDTH);
        setCurrentIndex(index);
    };

    const handleShow = (calificacion) => {
        setSelectedCalificacion(calificacion);
        setShow(true);
    };

    const handleClose = () => setShow(false);

    if (loading) {
        return (
            <ActivityIndicator
                size="large"
                color="#dc3545"
                style={{ marginTop: 50 }}
            />
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.wrapContainer}>
                <Text style={styles.sectionTitle}>CALIFICACIONES A LA BARBERÍA</Text>
                <View style={styles.divider} />
                {calificaciones.length === 0 ? (
                    <Text style={styles.noData}>No hay calificaciones para mostrar.</Text>
                ) : (
                    <ScrollView
                        ref={scrollRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        snapToInterval={CARD_WIDTH}
                        snapToAlignment="center"
                        decelerationRate="fast"
                        pagingEnabled
                        contentContainerStyle={{
                            paddingHorizontal: (screenWidth - CARD_WIDTH) / 2,
                        }}
                    >
                        {calificaciones.map((item) => {
                            const usuario = usuarios.find(
                                (u) => u.id_usuario === item.usuario_id
                            );
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.card}
                                    activeOpacity={0.9}
                                    onPress={() => handleShow(item)}
                                >
                                    {usuario?.Foto && (
                                        <Image
                                            source={{
                                                uri: `${getBaseURL()}perfil/${usuario.Foto}`,
                                            }}
                                            style={styles.avatar}
                                        />
                                    )}
                                    <Text style={styles.usuario}>
                                        {usuario?.nombre_usuario || 'Cliente'}
                                    </Text>
                                    <Text style={styles.comentario}>
                                        "{item.comentario || 'Sin comentario'}"
                                    </Text>
                                    <View style={styles.stars}>
                                        {Array.from({
                                            length: item.puntuacion || 0,
                                        }).map((_, i) => (
                                            <Text key={i} style={styles.star}>
                                                ⭐
                                            </Text>
                                        ))}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                )}
                <Modal
                    isVisible={show}
                    onBackdropPress={handleClose}
                    onBackButtonPress={handleClose}
                >
                    {selectedCalificacion && (
                        <View style={styles.modalContent}>
                            {usuarios.find(
                                (u) => u.id_usuario === selectedCalificacion.usuario_id
                            )?.Foto && (
                                    <Image
                                        source={{
                                            uri: `${getBaseURL()}perfil/${usuarios.find(
                                                (u) => u.id_usuario === selectedCalificacion.usuario_id
                                            )?.Foto}`,

                                        }}
                                        style={styles.modalAvatar}
                                    />
                                )}
                            <Text style={styles.modalTitle}>
                                {
                                    usuarios.find(
                                        (u) =>
                                            u.id_usuario ===
                                            selectedCalificacion.usuario_id
                                    )?.nombre_usuario || 'Usuario'
                                }
                            </Text>
                            <Text style={styles.modalComentario}>
                                "{selectedCalificacion.comentario || 'Sin comentario'}"
                            </Text>
                            <View style={styles.stars}>
                                {Array.from({
                                    length: selectedCalificacion.puntuacion || 0,
                                }).map((_, i) => (
                                    <Text key={i} style={styles.star}>
                                        ⭐
                                    </Text>
                                ))}
                            </View>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={handleClose}
                            >
                                <Text style={styles.closeButtonText}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Modal>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ffffff',
    },
    wrapContainer: {
        paddingVertical: 30,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        marginBottom: 40,
        borderRadius: 16,
    },
    sectionTitle: {
        textAlign: 'center',
        fontSize: 24,
        color: '#ffffff',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    divider: {
        borderBottomColor: '#ffffff',
        borderBottomWidth: 1,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#2c2c2e',
        borderRadius: 20,
        padding: 24,
        width: CARD_WIDTH,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 12,
        backgroundColor: '#333',
        borderWidth: 2,
        borderColor: '#dc3545',
    },
    usuario: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 6,
        textAlign: 'center',
    },
    comentario: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#ccc',
        textAlign: 'center',
        marginBottom: 10,
    },
    stars: {
        flexDirection: 'row',
    },
    star: {
        fontSize: 20,
        marginHorizontal: 2,
        color: '#ffc107',
    },
    noData: {
        textAlign: 'center',
        fontSize: 16,
        color: '#bbb',
        marginTop: 40,
    },
    modalContent: {
        backgroundColor: '#23272b',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
    },
    modalAvatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 10,
        borderWidth: 3,
        borderColor: '#dc3545',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#dc3545',
        marginBottom: 8,
    },
    modalComentario: {
        fontSize: 16,
        color: '#eee',
        textAlign: 'center',
        marginBottom: 12,
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: '#dc3545',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 24,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
