import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts as useBebas, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { Dimensions } from 'react-native';
import DefaultLayout from '../../Layouts/DefaultLayout';
import BarberosRepository from '../../repositories/BarberosRepository';
import { useState } from 'react';
import InventarioRepository from '../../repositories/InventarioRepository';
import CalificacionesRepository from '../../repositories/CalificacionesRepository';
import { getBaseURL } from '../../config/api';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');


export default function Home() {
  const [barberos, setBarberos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);



  const [fontsLoaded] = useBebas({
    BebasNeue_400Regular,
  });

  React.useEffect(() => {
    const fetchBarberos = async () => {
      try {
        const response = await BarberosRepository.GetBarberos();
        setBarberos(response.data);
      } catch (err) {
        console.log("Error al obtener los datos:", err);
      }
    };

    fetchBarberos();
  }, []);


  React.useEffect(() => {
    const fetchInventario = async () => {
      try {
        const response = await InventarioRepository.GetInventario();
        setInventario(response.data);
      } catch (err) {
        console.log("Error al obtener los datos:", err);
      }
    };

    fetchInventario();
  }, []);

  React.useEffect(() => {
    const fetchCalificaciones = async () => {
      try {
        const response = await CalificacionesRepository.traerCalificaciones();
        setCalificaciones(response.data);
      } catch (err) {
        console.log("Error al obtener los datos:", err);
      }
    };

    fetchCalificaciones();
  }, []);


  React.useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await CalificacionesRepository.traerUsuarios();
        setUsuarios(response.data);
      } catch (err) {
        console.log("Error al obtener los datos:", err);
      }
    };

    fetchUsuarios();
  }, []);

  if (!fontsLoaded) {
    return null;
  }



  return (
    <DefaultLayout>
      <View style={styles.container}>
        <View style={styles.header}>
        </View>
        <View>
          <Image
            source={require('../../assets/logo.png')}
            style={{
              ...styles.logo,
              width: Dimensions.get('window').width * 0.40,
              height: Dimensions.get('window').width * 0.40,
            }}
          />
        </View>
        <Text style={{ ...styles.title, fontFamily: 'BebasNeue_400Regular', fontSize: Dimensions.get('window').width * 0.09, marginTop: 160 }}>
          ¡¡BIENVENIDO A LA APP!!
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: Dimensions.get('window').height * 0.2 }}>
          <Image
            source={require('../../assets/barbero.jpg')}
            style={{
              width: Dimensions.get('window').width * 0.4,
              height: Dimensions.get('window').width * 0.4,
              marginRight: Dimensions.get('window').width * 0.04,
            }}
          />
          <View style={{ alignItems: 'center', maxWidth: Dimensions.get('window').width * 0.5 }}>
            <Text style={{ ...styles.title2, fontSize: Dimensions.get('window').width * 0.09 }}>
              SOBRE NOSOTROS
            </Text>
            <Text style={{ color: '#ffffff', fontSize: Dimensions.get('window').width * 0.04, textAlign: 'center', marginTop: 10 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: Dimensions.get('window').height * 0.2 }}>
          <Text style={{ ...styles.title2, fontSize: Dimensions.get('window').width * 0.12 }}>NUESTROS SERVICIOS</Text>

        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: Dimensions.get('window').height * 0.08 }}>
          <View style={{
            ...styles.card,
            width: Dimensions.get('window').width * 0.4,
            height: Dimensions.get('window').width * 0.9,
            marginHorizontal: 10,
            alignItems: 'center',
          }}>
            <Image
              source={require('../../assets/cortepremium.jpg')}
              style={{
                ...styles.cardImage,
              }}
            />
            <View style={styles.cardContent}>
              <Text style={{ ...styles.cardTitle, fontSize: Dimensions.get('window').width * 0.04 }}>Corte Basico</Text>
              <View style={{
                marginTop: 10,
                borderRadius: 5,
                overflow: 'hidden',
                maxHeight: Dimensions.get('window').height * 0.06,
                alignSelf: 'center',
              }}>
                <Button
                  title="VER"
                  color="#dc3545"
                />
              </View>
            </View>
          </View>
          <View style={{
            ...styles.card,
            width: Dimensions.get('window').width * 0.4, 
            height: Dimensions.get('window').width * 0.9,
            marginHorizontal: 10,
            alignItems: 'center',
          }}>
            <Image
              source={require('../../assets/cortepremium.jpg')}
              style={{
                ...styles.cardImage,
              }}
            />
            <View style={styles.cardContent}>
              <Text style={{ ...styles.cardTitle, fontSize: Dimensions.get('window').width * 0.04 }}>Corte Premium</Text>
              <View style={{
                marginTop: 10,
                borderRadius: 5,
                overflow: 'hidden',
                maxHeight: Dimensions.get('window').height * 0.06,
                alignSelf: 'center',
              }}>
                <Button
                  title="VER"
                  color="#dc3545"
                 
                />
              </View>
            </View>
          </View>
        </View>

        <View style={{ alignItems: 'center', marginTop: Dimensions.get('window').height * 0.1, }}>
          <Text style={{ ...styles.title3, fontSize: Dimensions.get('window').width * 0.12 }}>LISTA DE PRECIOS</Text>
          <Text style={{ color: '#ffffff', fontSize: Dimensions.get('window').width * 0.04, textAlign: 'center', marginTop: 10 }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere pariatur mollitia illo perspiciatis velit tempora.
          </Text>
        </View>

        <View style={{ ...styles.priceListContainer, marginBottom: Dimensions.get('window').height * 0.2 }}>
          <View style={styles.priceRow}>
            <Text style={styles.serviceText}>Corte Basico</Text>
            <Text style={styles.priceText}>20.000</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.serviceText}>Cejas</Text>
            <Text style={styles.priceText}>5.000</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.serviceText}>Figuras</Text>
            <Text style={styles.priceText}>5.000</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.serviceText}>Mascarillas</Text>
            <Text style={styles.priceText}>25.000</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.serviceText}>Barbas</Text>
            <Text style={styles.priceText}>12.000</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.serviceText}>Tintes</Text>
            <Text style={styles.priceText}>Depende Del Tinte</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.serviceText}>Corte Premium</Text>
            <Text style={styles.priceText}>55.000</Text>
          </View>
        </View>

        <View style={{ alignItems: 'center', marginTop: Dimensions.get('window').height * 0.1 }}>
          <Text style={{ ...styles.title3, fontSize: Dimensions.get('window').width * 0.1 }}>CONOCE A NUESTROS ESTILISTAS</Text>
          <Text style={{ color: '#ffffff', fontSize: Dimensions.get('window').width * 0.04, textAlign: 'center', marginTop: 10 }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere pariatur mollitia illo perspiciatis velit tempora.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: Dimensions.get('window').height * 0.07, marginBottom: Dimensions.get('window').height * 0.2 }}>
          {barberos.map((barbero, index) => (
            <View style={styles.stylistCard} key={index}>
              <Image
                source={require('../../assets/deiby.jpg')}
                style={styles.stylistImage}
              />
              <Text style={styles.stylistName}>{barbero.nombre_usuario}</Text>
              <Text style={styles.stylistDescription}>
                {barbero.descripcion}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ alignItems: 'center', marginTop: Dimensions.get('window').height * 0.0 }}>
          <Text style={{ ...styles.title3, fontSize: Dimensions.get('window').width * 0.1, color: '#dc3545' }}>¡¡MASTER SHOP!!</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {inventario.map((item, index) => (
            <View style={styles.productCard} key={index}>
              <Image source={{ uri: `${getBaseURL()}ImagesInventario/${item.Foto}` }} style={styles.cardImage} />
              <Text style={styles.productTitle}>{item.nombre}</Text>
              <Text style={styles.productDescription}>{item.descripcion_P}</Text>
              <Text style={styles.productStock}>Quedan {item.cantidad} Unidades De Este Producto</Text>
              <Button title="Ver" color="#dc3545" onPress={() => { }} />
            </View>
          ))}
        </ScrollView>


        <View style={{ alignItems: 'center', marginTop: Dimensions.get('window').height * 0.1, }}>
          <Text style={{ ...styles.title3, fontSize: 33 }}>LO QUE PIENSAN NUESTROS CLIENTES</Text>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: Dimensions.get('window').height * 0.05, marginBottom: Dimensions.get('window').height * 0.2 }}>
          {calificaciones.map((calificacion, index) => {
            const usuario = usuarios.find(u => u.id_usuario === calificacion.usuario_id);
            return (
              <View style={styles.reviewCard} key={index}>
                  <Image
                    source={{ uri: `${getBaseURL()}perfil/${usuario?.Foto}  ` }}
                    style={styles.reviewImage}
                  />
                  <Text style={styles.reviewName}>{usuario?.nombre_usuario}</Text>
                  <Text style={styles.reviewText}>{calificacion.comentario || "Sin Comentario"}</Text>
                  <View style={{ flex: 1 }} /> 
                  <View>
                    <View style={{ height: 1, backgroundColor: '#6c757d', alignSelf: 'stretch', marginTop: 10, marginBottom: 5 }} />
                    <View style={styles.starsContainer}>
                      {Array(5).fill(0).map((_, i) => (
                        <Ionicons
                          key={i}
                          name="star"
                          size={20}
                          color={i < calificacion.puntuacion ? '#ffc107' : '#ccc'}
                        />
                      ))}
                    </View>
                  </View>
                </View>
            );
          })}
        </View>
      </View>
    </DefaultLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.05,
  },

  header: {
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#212529',
  },

  title: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    opacity: 0.8,
  },

  title2: {
    color: '#dc3545',
    fontFamily: 'BebasNeue_400Regular',
  },

  title3: {
    color: '#ffffff',
    fontFamily: 'BebasNeue_400Regular',
  },

  footerLine: {
    height: 1,
    backgroundColor: '#6c757d',
    width: '100%',
    marginBottom: 10,
  },

  footer: {
    backgroundColor: '#212529',
    width: '100%',
    paddingBottom: 20,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },

  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },

  logo: {
    opacity: 0.6,
    alignSelf: 'center',
    width: 50,
    position: 'absolute',
    zIndex: 10,
  },

  card: {
    borderRadius: 9,
    margin: 10,
    overflow: 'hidden',
    marginBottom: 150,
    backgroundColor: '#212529',
    borderWidth: 1,
    borderColor: '#6c757d',
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').width * 0.9,

  },


  cardImageContainer: {
    overflow: 'hidden',
  },

  cardImage: {
    width: '100%',
    height: height * 0.3,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10,
  },

  cardContent: {
    justifyContent: 'center',
  },

  cardTitle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc3545',
    textAlign: 'center',
  },

  //CSS PARA LA LISTA DE PRECIOS
  priceListContainer: {
    marginTop: Dimensions.get('window').height * 0.05,
    width: '90%',
    borderWidth: 1,
    borderColor: '#6c757d',
    borderRadius: 10,
    overflow: 'hidden',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#6c757d',
    backgroundColor: '#212529',
  },
  serviceText: {
    color: '#ffffff',
    fontSize: Dimensions.get('window').width * 0.04,
    fontWeight: 'bold',
  },
  priceText: {
    color: '#ffc107',
    fontSize: Dimensions.get('window').width * 0.04,
    fontWeight: 'bold',
  },
  // FIN DE CSS PARA LA LISTA DE PRECIOS


  //CSS PARA LOS ESTILISTAS
  stylistCard: {
    width: Dimensions.get('window').width * 0.3,
    margin: 10,
    backgroundColor: '#212529',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6c757d',
  },
  stylistImage: {
    width: '100%',
    height: Dimensions.get('window').width * 0.4,
    resizeMode: 'cover',
  },
  stylistName: {
    color: '#dc3545',
    fontSize: Dimensions.get('window').width * 0.05,
    fontWeight: 'bold',
    marginTop: 10,
  },
  stylistDescription: {
    color: '#ffffff',
    fontSize: Dimensions.get('window').width * 0.035,
    textAlign: 'center',
    padding: 10,
  },
  // FIN DE CSS PARA LOS ESTILISTAS


  //CSS PARA EL CARRUSEL DE PRODUCTOS
  productCard: {
    width: width * 0.7,
    backgroundColor: '#212529',
    borderRadius: 12,
    padding: 16,
    marginRight: width * 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 9,
    alignItems: 'center',
  },

  productTitle: {
    color: '#dc3545',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  productDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  productStock: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
    textAlign: 'center',
  },
  // FIN DE CSS PARA EL CARRUSEL DE PRODUCTOS

  //CSS PARA LAS OPINIONES DE CLIENTES
  reviewCard: {
    width: Dimensions.get('window').width * 0.4,
    backgroundColor: '#212529',
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#6c757d',
  },
  reviewImage: {
    width: Dimensions.get('window').width * 0.2,
    height: Dimensions.get('window').width * 0.2,
    borderRadius: Dimensions.get('window').width * 0.1,
    marginBottom: 10,
  },
  reviewName: {
    marginTop: 5,
    marginBottom: 5,  
    color: '#dc3545',
    fontSize: Dimensions.get('window').width * 0.04,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  reviewText: {
    marginTop: 9,
    color: '#ffffff',
    fontSize: Dimensions.get('window').width * 0.04,
    marginVertical: 5,
    textAlign: 'center',
  },
  starsContainer: {
    marginTop: 2, 
    flexDirection: 'row',
    justifyContent: 'center',
  },
  // FIN DE CSS PARA LAS OPINIONES DE CLIENTES
});