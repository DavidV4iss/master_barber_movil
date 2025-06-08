import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Platform, Button, FlatList } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import DefaultLayout from "../../Layouts/DefaultLayout";
import { TextInput } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { Anton_400Regular } from "@expo-google-fonts/anton";
import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import { useNavigation } from '@react-navigation/native';
import useAuth from "../../hooks/useAuth";
import { AirbnbRating, Rating } from "react-native-ratings";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { getBaseURL } from "../../config/api";
import { showMessage } from "react-native-flash-message";
import ReservasClientesRepository from "../../repositories/ReservasClientesRepository";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CalificacionesRepository from "../../repositories/CalificacionesRepository";

export default function InicioUsuario() {
  const [service, setService] = useState("");
  const [date, setDate] = useState(new Date());
  const [barberoId, setBarberoId] = useState("");
  const [barberos, setBarberos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [horasOcupadas, setHorasOcupadas] = useState([]);
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [cliente, setCliente] = useState(null);
  const [calificaciones, setCalificaciones] = useState([]);
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(atob(token.split(".")[1]));
  const email = usuario.email;
  const id = usuario.id;
  const imagenesServicios = {
    "Corte basico": require("../../assets/cortebasico.jpg"),
    "Corte premium": require("../../assets/cortepremium.jpg"),
  };
  const [fontsLoaded] = useFonts({
    Anton: Anton_400Regular,
    BebasNeue: BebasNeue_400Regular,
  });
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 60 - 15) / 2;

  const nextStep = () => {
    if (currentStep === 1 && !service) {
      alert("Por favor, selecciona un servicio antes de continuar.");
      return;
    }

    if (currentStep === 2 && !barberoId) {
      alert("Por favor, selecciona un barbero antes de continuar.");
      return;
    }

    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const onDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }

    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(
        (prev) =>
          new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            prev.getHours(),
            prev.getMinutes()
          )
      );
    }
  };

  const onTimeChange = (event, selectedTime) => {
    if (event.type === "dismissed") {
      setShowTimePicker(false);
      return;
    }

    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setDate(
        (prev) =>
          new Date(
            prev.getFullYear(),
            prev.getMonth(),
            prev.getDate(),
            selectedTime.getHours(),
            selectedTime.getMinutes()
          )
      );
    }
  };

  const fetchServicios = async () => {
    try {
      const response = await ReservasClientesRepository.GetServicios();
      setServicios(response.data);
    } catch (err) {
      console.log("Error al obtener los servicios:", err);
    }
  };[barberoId];

  const fetchBarberos = async () => {
    try {
      const response = await ReservasClientesRepository.GetBarberos();
      setBarberos(response.data);
    } catch (err) {
      console.log("Error al obtener los barberos:", err);
    }
  }
  const fetchTraerUsuarios = async (email) => {
    try {
      const response = await ReservasClientesRepository.TraerUsuario(email);
      setCliente(response.data[0]);
    } catch (err) {
      console.log("Error al obtener los datos del barbero:", err);
    }
  };

  useEffect(() => {
    const fetchBarberosDisponibles = async () => {
      try {
        const response = await ReservasClientesRepository.GetBarberosDisponibles(barberoId);
        const horasOcupadas = response.data.map(reserva => new Date(reserva.fecha));
        setHorasOcupadas(horasOcupadas);
      } catch (err) {
        console.log("Error al obtener las reservas del barbero:", err);
      }
    };

    fetchBarberosDisponibles();
  }, [barberoId]);
  React.useEffect(() => {
    fetchServicios();
    fetchBarberos();
    AsyncStorage.getItem("token").then((token) => {
      const tokenDecoded = token ? JSON.parse(atob(token.split(".")[1])) : null;
      const email = tokenDecoded?.email;
      if (email) {
        fetchTraerUsuarios(email);
      }
    });
  }, []);



  const handleSubmit = async () => {
    if (!service || !barberoId || !date) {
      showMessage({
        message: "Campos incompletos",
        description:
          "Por favor, selecciona el servicio, barbero y fecha antes de continuar.",
        type: "warning",
        icon: "warning",
      });
      return;
    }

    const formattedSelectedDate = moment(date).format("YYYY-MM-DD HH:mm:ss");

    try {
      const response = await ReservasClientesRepository.GetBarberosDisponibles(barberoId);

      const horasOcupadas = response.data.map(reserva => moment(reserva.fecha).format('YYYY-MM-DD HH:mm:ss'));
      if (horasOcupadas.includes(formattedSelectedDate)) {
        showMessage({
          message: "Hora ocupada",
          description:
            "La hora seleccionada ya está ocupada. Por favor, elige otra hora.",
          type: "warning",
          icon: "warning",
        });
        return;
      }
      const token = await AsyncStorage.getItem("token");
      const tokenDecoded = token ? JSON.parse(atob(token.split(".")[1])) : null;
      const id = tokenDecoded?.id || null;
      const responseCrearReserva =
        await ReservasClientesRepository.CrearReservas({
          cliente_id: id,
          barbero_id: barberoId,
          servicio: service,
          fecha: formattedSelectedDate,
          estado: "Pendiente",
          observacion: "",
        });

      showMessage({
        message: "Reserva creada exitosamente",
        type: "success",
        icon: "success",
        duration: 2000,
      });

      setCurrentStep(1);
      setService('');
      setBarberoId('');
      setDate(new Date());
    } catch (error) {
      console.log("Error al crear la reserva:", error);
      showMessage({
        message: "Error al procesar la reserva",
        description: "Hubo un error inesperado. Intenta nuevamente.",
        type: "danger",
        icon: "danger",
      });
    }
  };

  const traerCalificaciones = async () => {
    try {
      const response = await CalificacionesRepository.traerCalificacionesUsuario();
      setCalificaciones(response.data);
    } catch (err) {
      console.log("Error al obtener los datos:", err);
    }
  };
  React.useEffect(() => {
    AsyncStorage.getItem("token").then(token => {
      const decoded = token ? JSON.parse(atob(token.split(".")[1])) : null;
      if (decoded?.id) {
        setNuevaCalificacion(prev => ({ ...prev, id: decoded.id }));
      }
    });
    traerCalificaciones();
  }, []);
  

  const [nuevaCalificacion, setNuevaCalificacion] = useState({
    id: id,
    puntuacion: 0,
    comentario: ""
  });

  const handleRatingChange = (newRating) => {
    setNuevaCalificacion(prev => ({ ...prev, puntuacion: newRating }));
  };

  const handleSubmitCalificacion = async () => {
    try {
      console.log("Enviando nuevaCalificación:", nuevaCalificacion);
      const res = await CalificacionesRepository.Createcalificaciones(nuevaCalificacion);
      console.log("Respuesta:", res);
      showMessage({
        message: "Calificación enviada exitosamente",
        type: "success",
        icon: "success",
        duration: 2000,
      });
      setNuevaCalificacion({ id, puntuacion: 0, comentario: "" });
      traerCalificaciones();

    } catch (err) {
      console.log("Error al enviar la calificación:", err);
    }
  };
  



  const handleLogout = () => {
    logout();
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <DefaultLayout>
      <View style={styles.container}>
        <View style={styles.welcome}>
          <Text style={styles.MB}>Master Barber</Text>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => setIsDropdownVisible(!isDropdownVisible)}
              >
                <Image
                  source={{
                    uri: `${getBaseURL()}perfil/${cliente ? cliente.Foto : "default.jpg"}`,
                  }}
                  style={{ marginTop: 10, width: 45, height: 45, borderRadius: 25 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              {isDropdownVisible && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity onPress={() => navigation.navigate("PerfilUsuario")}>
                    <Text
                      style={{
                        ...styles.dropdownItem,
                        marginBottom: 5,
                        fontFamily: "BebasNeue_400Regular",
                        color: "#ffc107",
                      }}
                    >
                      Perfil
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleLogout}>
                    <Text
                      style={{
                        ...styles.dropdownItem,
                        padding: 10,
                        backgroundColor: "#dc3545",
                        fontFamily: "BebasNeue_400Regular",
                      }}
                    >
                      Cerrar Sesión
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <Text
              style={{
                color: "#ffffff",
                fontFamily: "BebasNeue",
                fontSize: 14,
                marginTop: 5,
              }}
            >
              {cliente ? cliente.nombre_usuario : "Cargando..."}
            </Text>
          </View>
        </View>
        <Text style={styles.textReserva}>Crea tu reserva ahora</Text>

        {/* Aqui va el paso a paso Step */}
        {/* Paso 1: Selección de servicio */}
        {currentStep === 1 && (
          <>
            <Text style={styles.textPaso}>
              Selecciona el servicio que deseas
            </Text>
            <View style={styles.cardService}>
              {servicios.map((servicio) => (
                <TouchableOpacity
                  key={servicio.id_tipo_servicio}
                  style={[
                    styles.cardServicios,
                    { width: cardWidth },
                    service === servicio.id_tipo_servicio && { borderColor: "yellow" },
                  ]}
                  onPress={() => setService(servicio.id_tipo_servicio)}
                >
                  <Text style={styles.cardTextService}>{servicio.nombre}</Text>

                  {/* Aquí es donde asociamos la imagen */}
                  <Image
                    style={styles.cardImage}
                    source={imagenesServicios[servicio.nombre]}
                  />

                  <Text style={styles.textDescripcion}>
                    {servicio.descripcion_S}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Paso 2: Selección de barbero */}
        {currentStep === 2 && (
          <>
            <Text style={styles.textPaso}>Selecciona tu barbero preferido</Text>
            <View style={styles.cardBarbers}>
              {barberos.map((barbero) => (
                <TouchableOpacity
                  key={barbero.id_barbero}
                  style={[
                    styles.cardBarberos,
                    { width: cardWidth },
                    barberoId === barbero.id_usuario && { borderColor: "#ffc107" },
                  ]}
                  onPress={() => setBarberoId(barbero.id_usuario)}
                >
                  <Text style={styles.cardTextService}>
                    {barbero.nombre_usuario}
                  </Text>
                  <Image
                    style={styles.cardImage}
                    source={{
                      uri: `${getBaseURL()}imagesBarbero/${barbero.Foto}`,
                    }}
                    resizeMode="cover"
                  />
                  <Text style={styles.textDescripcion}>
                    {barbero.descripcion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Paso 3: Selección de fecha y hora */}
        {currentStep === 3 && (
          <>
            <Text style={styles.textPaso}>
              Selecciona la fecha y hora de tu reserva
            </Text>
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  marginTop: 10,
                  borderRadius: 10,
                  marginBottom: 15,
                  width: "80%",
                }}
              >
                <Button
                  title="Seleccionar Fecha"
                  onPress={() => setShowDatePicker(true)}
                />
              </View>
              <View
                style={{
                  marginTop: 10,
                  borderRadius: 10,
                  marginBottom: 15,
                  width: "80%",
                }}
              >
                <Button
                  title="Seleccionar Hora"
                  onPress={() => setShowTimePicker(true)}
                />
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={date}
                  mode="time"
                  display="default"
                  onChange={onTimeChange}
                  is24Hour={true}
                />
              )}
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "BebasNeue",
                  fontSize: 18,
                  alignSelf: "center",
                  marginBottom: 20,
                }}
              >
                Fecha y hora seleccionada:{"        "}
                {date.toLocaleString()}
              </Text>
            </View>
          </>
        )}
        {/* Aqui termina el paso a paso Step */}

        <View style={{ flexDirection: "row", marginTop: 20 }}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={styles.buttonReserva}
              onPress={prevStep}
            >
              <Text style={styles.buttonText}>Atrás</Text>
            </TouchableOpacity>
          )}
          {currentStep < 3 && (
            <TouchableOpacity
              style={styles.buttonReserva}
              onPress={() => {
                if (currentStep === 1 && !service) {
                  showMessage({
                    message: "Error",
                    description: "Selecciona un servicio",
                    type: "danger",
                    icon: "danger",
                  });
                  return;
                }
                if (currentStep === 2 && !barberoId) {
                  showMessage({
                    message: "Error",
                    description: "Selecciona un barbero",
                    type: "danger",
                    icon: "danger",
                  });
                  return;
                }
                if (currentStep === 3 && !date) {
                  showMessage({
                    message: "Error",
                    description: "Selecciona una fecha y hora",
                    type: "danger",
                    icon: "danger",
                  });
                  return;
                }
                setCurrentStep(currentStep + 1);
              }}
            >
              <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>
          )}
          {currentStep === 3 && (
            <TouchableOpacity
              style={styles.buttonReserva}
              onPress={() => {
                handleSubmit();
                setCurrentStep(1);
              }}
            >
              <Text style={styles.buttonText}>
                Confirmar Reserva
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.calificaciones}>
          <Text
            style={{ color: "#dc3545", fontFamily: "BebasNeue", fontSize: 20 }}
          >
            Calificaciones
          </Text>
          <Text
            style={{ color: "#ffffff", fontFamily: "BebasNeue", fontSize: 20 }}
          >
            ||
          </Text>
          <Text
            style={{ color: "#ffc107", fontFamily: "BebasNeue", fontSize: 20 }}
          >
            Vip
          </Text>
        </View>

        <Rating
          type="star"
          ratingCount={5}
          imageSize={40}
          startingValue={nuevaCalificacion.puntuacion || 0}
          onFinishRating={handleRatingChange}
          style={{ paddingVertical: 10, marginTop: 10, }}
          tintColor="#212529"
        />
        <Text
          style={{
            color: "#ffc107",
            fontFamily: "BebasNeue",
            fontSize: 20,
            marginTop: 30,
          }}
        >
          Comentarios
        </Text>
        <TextInput
          style={styles.input}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          onChangeText={(text) => setNuevaCalificacion({ ...nuevaCalificacion, comentario: text })}
          value={nuevaCalificacion.comentario}
          placeholder="¿Qué te ha parecido nuestro servicio?"
        />
        <TouchableOpacity
          onPress={handleSubmitCalificacion}
          style={{
            backgroundColor: "#dc3545",
            borderRadius: 10,
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          <Text
            style={{ color: "#ffffff", fontFamily: "BebasNeue", fontSize: 20 }}
          >
            Enviar calificación
          </Text>
        </TouchableOpacity>


        <Text
          style={{
            color: "#ffc107",
            fontFamily: "BebasNeue",
            fontSize: 20,
            marginTop: 30,
          }}
        >
          Mis calificaciones
        </Text>

        <FlatList
          data={calificaciones}
          renderItem={({ item }) => (
            <View style={styles.calificacionItem}>
              <Text style={styles.calificacionText}>{item.comentario}</Text>
              <Text style={styles.calificacionText}>Puntuación: {item.puntuacion}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
        {calificaciones.length === 0 && (
          <Text style={{ color: "#ffffff", fontFamily: "BebasNeue", fontSize: 16, marginTop: 10 }}>
            No tienes calificaciones
          </Text>
          )}
      </View>
    </DefaultLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 2,
    backgroundColor: "#212529",
    marginBottom: 1,
  },
  dropdownMenu: {
    position: "absolute",
    right: Dimensions.get("window").width * 0.2,
    backgroundColor: "#343a40",
    padding: 10,
    borderRadius: 5,
    marginTop: Dimensions.get("window").height * 0.08,
  },
  dropdownItem: {
    color: "#ffffff",
    fontSize: Dimensions.get("window").width * 0.04,
    paddingVertical: 5,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#212529",
  },
  welcome: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    alignItems: "center",
    width: "100%",
    height: 100,
    marginBottom: 10,
  },
  MB: {
    fontSize: 28,
    fontFamily: "BebasNeue",
    color: "#ffc107",
    textAlign: "center",
  },
  icon: {
    fontSize: 45,
    color: "#ffff",
    paddingTop: 10,
    borderRadius: 100,
    padding: 10,
    borderColor: "#ffffff",
  },
  welcomeText: {
    fontSize: 32,
    fontFamily: "BebasNeue",
    color: "#dc3545",
  },
  welcomeName: {
    fontSize: 28,
    fontFamily: "BebasNeue",
    color: "#ffc107",
  },
  textReserva: {
    fontSize: 30,
    fontFamily: "Anton",
    color: "#ffc107",
    marginTop: 20,
  },
  textPaso: {
    fontSize: 20,
    fontFamily: "BebasNeue",
    color: "#ffffff",
    marginTop: 40,
    textAlign: "center",
  },
  cardService: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 30,
  },

  cardServicios: {
    width: "auto",
    height: "auto",
    borderRadius: 20,
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#dc3545",
    elevation: 3,

  },
  cardBarbers: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 30,
    marginHorizontal: 30,
  },
  cardBarberos: {
    height: "auto",
    borderRadius: 20,
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#dc3545",
    elevation: 3,
  },
  cardTextService: {
    fontSize: 20,
    fontFamily: "BebasNeue",
    color: "#ffc107",
    marginTop: 10,
    marginBottom: 8,
  },
  cardTextBarbers: {
    fontSize: 20,
    fontFamily: "BebasNeue",
    color: "#ffc107",
    marginTop: 10,
    marginBottom: 8,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 12,
  },
  textDescripcion: {
    fontSize: 14,
    fontFamily: "BebasNeue",
    color: "#ffffff",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  calificaciones: {
    flexDirection: "row",
    fontSize: 24,
    fontFamily: "BebasNeue",
    color: "#ffffff",
    marginTop: 30,
    width: 300,
    textAlign: "center",
    justifyContent: "center",
  },
  input: {
    width: 300,
    height: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: "#ffffff",
    borderRadius: 15,
    color: "#ffffff",
  },
  button: {
    width: 200,
    height: 50,
    margin: 12,
    padding: 10,
    borderRadius: 15,
    color: "#ffffff",
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "#dc3545",
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "BebasNeue",
    color: "#ffffff",
    textAlign: "center",
  },
  buttonReserva: {
    width: 150,
    height: 50,
    margin: 12,
    padding: 10,
    borderRadius: 15,
    color: "#ffffff",
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "#ffc107",
  },
  calificacionItem: {
    backgroundColor: "#343a40",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
  },
  calificacionText: {
    color: "#ffffff",
    fontFamily: "BebasNeue",
    fontSize: 16,
    marginBottom: 5,
  },
  textCalificacion: {
    color: "#ffc107",
    fontFamily: "BebasNeue",
    fontSize: 20,
    marginTop: 30,
  },
});
