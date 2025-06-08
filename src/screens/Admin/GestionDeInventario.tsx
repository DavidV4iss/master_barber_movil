import React from 'react'
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Anton_400Regular } from "@expo-google-fonts/anton";
import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import { useFonts } from "expo-font";
import useAuth from '../../hooks/useAuth';
import { Picker } from '@react-native-picker/picker';
import InventarioRepository from '../../repositories/InventarioRepository';
import { getBaseURL } from '../../config/api';
import DefaultLayout from '../../Layouts/DefaultLayout';
import { showMessage } from 'react-native-flash-message';
import GestionInvRepository from '../../repositories/GestionInvRepository';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import GraficaVentasNative from '../../components/GraficaVentasNative';

export default function GestionDeInventario() {
    const [isDropdownVisible, setIsDropdownVisible] = React.useState(false);
    const navigation = useNavigation();
    const [rango, setRango] = React.useState('Diario');
    const [inventario, setInventario] = React.useState<any[]>([]);
    const [venta, setVenta] = React.useState<any[]>([]);
    const [ventasProcesadas, setVentasProcesadas] = React.useState<any[]>([]);

    const { logout } = useAuth();

    const [fontsLoaded] = useFonts({
        Anton: Anton_400Regular,
        BebasNeue_400Regular,
    });

    const fetchInventario = async () => {
        try {
            const response = await InventarioRepository.GetInventario();
            setInventario(response.data);
        } catch (err) {
            console.log("Error al obtener los datos:", err);
        }
    };
    React.useEffect(() => {
        fetchInventario();
    }, []);

    React.useEffect(() => {
        const fetchVentas = async () => {
            try {
                const response = await GestionInvRepository.GetVentas(rango);
                setVentasProcesadas(response.data);
            } catch (err) {
                console.error("Error al obtener las ventas:", err);
            }
        };
        fetchVentas();
    }, [rango]);

    const agregarProducto = (id_producto: number) => {
        setInventario((prevInventario) => {
            const productoInventario = prevInventario.find(item => item.id_producto === id_producto);
            if (!productoInventario || productoInventario.cantidad <= 0) {
                alert(`No hay más ${productoInventario?.nombre} en stock.`);
                return prevInventario;
            }

            setVenta((prevVenta) => {
                const productoExistente = prevVenta.find(item => item.id_producto === id_producto);
                if (productoExistente) {
                    return prevVenta.map(item =>
                        item.id_producto === id_producto
                            ? { ...item, cantidad: item.cantidad + 1 }
                            : item
                    );
                } else {
                    return [...prevVenta, { ...productoInventario, cantidad: 1 }];
                }
            });

            return prevInventario.map(item =>
                item.id_producto === id_producto
                    ? { ...item, cantidad: item.cantidad - 1 }
                    : item
            );
        });
    };

    const calcularTotal = () => {
        return venta.reduce((total, item) => total + (item.PrecioUnitario * item.cantidad), 0);
    };

    const handleSubmit = async () => {
        try {
            const ventasConFecha = venta.map((producto) => ({
                ...producto,
                fecha: new Date(),
            }));

            for (const producto of ventasConFecha) {
                await GestionInvRepository.RestarInventario(producto.id_producto, producto.cantidad);
            }

            await GestionInvRepository.GuardarVentas(ventasConFecha);

            const productosVendidos = ventasConFecha.map(p =>
                `• ${p.nombre} - ${p.cantidad} x $${p.PrecioUnitario} = $${p.cantidad * p.PrecioUnitario}`
            ).join('\n');

            showMessage({
                message: 'Venta exitosa',
                description: `Productos vendidos:\n${productosVendidos}`,
                type: 'success',
                duration: 7000,
            });

            setVenta([]);
        } catch (error) {
            console.error('Error al procesar la venta:', error);
            showMessage({
                message: 'Error al procesar la venta',
                description: error.message,
                type: 'danger',
            });
        }
    };

    const generarPDF = async () => {
        try {
            const response = await GestionInvRepository.GetVentas(rango);
            const ventas = response.data;

            const ventasAgrupadas = ventas.reduce((acc, venta) => {
                const key = venta.id_producto;
                if (!acc[key]) {
                    acc[key] = { ...venta, cantidad: 0 };
                }
                acc[key].cantidad += venta.cantidad;
                return acc;
            }, {});

            const ventasArray = Object.values(ventasAgrupadas);

            ventasArray.sort((a, b) => b.cantidad - a.cantidad);

            let htmlContent = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { text-align: center; color: #dc3545; }
                    table, th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>Reporte de Ventas</h1>
                <p><strong>Rango:</strong> ${rango}</p>
                <p><strong>Fecha de Generación:</strong> ${new Date().toLocaleString()}</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Total</th>
                    </tr>
            `;

            if (ventasArray.length === 0) {
                htmlContent += `
                    <tr><td colspan="4">No hay ventas en este rango</td></tr>`;
            }

            let totalGeneral = 0;

            ventasArray.forEach((venta) => {
                const total = venta.PrecioUnitario * venta.cantidad;
                totalGeneral += total;
                htmlContent += `
                    <tr>
                        <td>${venta.nombre}</td>
                        <td>${venta.cantidad}</td>
                        <td>$${venta.PrecioUnitario.toFixed(2)}</td>
                        <td>$${total.toFixed(2)}</td>
                    </tr>`;
            });

            htmlContent += `
                </table>
                <h3>Total General: $${totalGeneral.toFixed(2)}</h3>
            </body>
            </html>
            `;

            const { uri } = await Print.printToFileAsync({ html: htmlContent });
            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            showMessage({
                message: 'Error al generar el PDF',
                description: error.message,
                type: 'danger',
            });
        }
    };

    if (!fontsLoaded) return null;

    const handleLogout = () => {
        logout();
    }

    return (
        <DefaultLayout>
            <ScrollView style={{ flex: 1, backgroundColor: '#181A20' }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Icon name="bars" size={32} color="#fff" style={styles.iconBars} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout}>
                        <Icon name="sign-out" size={32} color="#fff" style={styles.iconUser} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>
                    HOLA, <Text style={styles.admin}>ADMINISTRADOR</Text>
                </Text>
                <Text style={styles.subtitle}>
                    Este es el inventario de los productos que salen de la barbería
                </Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={rango}
                        onValueChange={(itemValue) => setRango(itemValue)}
                        dropdownIconColor="#fff"
                        style={styles.picker}
                    >
                        <Picker.Item label="Diario" value="Diario" />
                        <Picker.Item label="Semanal" value="Semanal" />
                        <Picker.Item label="Mensual" value="Mensual" />
                    </Picker>
                </View>

                <TouchableOpacity onPress={generarPDF} style={styles.pdfButton}>
                    <Icon name="file-pdf-o" size={18} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.pdfButtonText}>Generar PDF</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Inventario</Text>
                <View style={styles.productsContainer}>
                    {inventario.map((item) => (
                        <TouchableOpacity key={item.id_producto} onPress={() => agregarProducto(item.id_producto)}
                            style={styles.card}>
                            <View style={styles.cardContent}>
                                <Image
                                    source={{ uri: `${getBaseURL()}ImagesInventario/${item.Foto}` }}
                                    style={styles.cardImage}
                                />
                                <Text style={styles.cardTitle}>{item.nombre}</Text>
                                <Text style={styles.cardText}>
                                    <Text style={{ fontWeight: 'bold', color: '#dc3545' }}>Cantidad: </Text> {item.cantidad} Unidades
                                </Text>
                                <Text style={styles.cardText}>
                                    <Text style={{ fontWeight: 'bold', color: '#dc3545' }}>Precio: </Text> {item.PrecioUnitario} Pesos
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Productos Seleccionados</Text>
                <View style={styles.tableContainer}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCell, styles.cellCantidad]}>Cantidad</Text>
                        <Text style={styles.tableCell}>ID</Text>
                        <Text style={styles.tableCell}>Nombre</Text>
                        <Text style={styles.tableCell}>Precio</Text>
                    </View>
                    {venta.length > 0 ? (
                        venta.map((item) => (
                            <View key={item.id_producto} style={styles.tableRow}>
                                <Text style={[styles.tableCell, styles.cellCantidad]}>{item.cantidad}</Text>
                                <Text style={styles.tableCell}>{item.id_producto}</Text>
                                <Text style={styles.tableCell}>{item.nombre}</Text>
                                <Text style={styles.tableCell}>{item.PrecioUnitario}</Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.tableRow}>
                            <Text style={styles.noDataText}>No hay productos</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.total}>Total: ${calcularTotal().toFixed(2)}</Text>
                <View style={styles.actionButtonsRow}>
                    {venta.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => setVenta([])}
                        >
                            <Icon name="trash" size={18} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={styles.clearButtonText}>Limpiar</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.subtractButton} onPress={handleSubmit}>
                        <Text style={styles.subtractButtonText}>Restar del Inventario</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <GraficaVentasNative ventas={ventasProcesadas} />
                </View>
            </ScrollView>
        </DefaultLayout>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 32,
        backgroundColor: '#181A20',
        marginBottom: 10,
    },
    iconBars: {
        marginLeft: 0,
    },
    iconUser: {
        marginRight: 0,
    },
    title: {
        marginTop: 10,
        fontFamily: 'Anton',
        fontSize: 28,
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 1,
    },
    subtitle: {
        color: '#b0b0b0',
        fontFamily: 'BebasNeue_400Regular',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 18,
        marginHorizontal: 20,
    },
    admin: {
        color: '#dc3545',
        fontFamily: 'BebasNeue_400Regular',
        fontSize: 35,
    },
    pickerWrapper: {
        marginTop: 10,
        marginHorizontal: 24,
        borderWidth: 1,
        borderColor: '#343a40',
        borderRadius: 12,
        backgroundColor: '#23272b',
        overflow: 'hidden',
        marginBottom: 18,
    },
    picker: {
        color: '#fff',
        height: 48,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    pdfButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        backgroundColor: '#dc3545',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 8,
        marginRight: 24,
        marginBottom: 24,
        shadowColor: '#dc3545',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    pdfButtonText: {
        color: '#fff',
        fontFamily: 'BebasNeue_400Regular',
        fontSize: 18,
        letterSpacing: 1,
    },
    sectionTitle: {
        color: '#ffc107',
        fontFamily: 'BebasNeue_400Regular',
        fontSize: 22,
        marginLeft: 24,
        marginTop: 10,
        marginBottom: 10,
        letterSpacing: 1,
    },
    productsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#23272b',
        borderRadius: 16,
        marginBottom: 18,
        width: '47%',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    cardContent: {
        padding: 14,
        alignItems: 'center',
    },
    cardTitle: {
        color: '#ffc107',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
        fontFamily: 'BebasNeue_400Regular',
        textAlign: 'center',
    },
    cardText: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 6,
        textAlign: 'center',
    },
    cardImage: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        marginBottom: 8,
        backgroundColor: '#181A20',
    },
    tableContainer: {
        marginTop: 10,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: '#343a40',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#23272b',
        marginBottom: 18,
    },
    tableHeader: {
        backgroundColor: '#181A20',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#343a40',
    },
    tableCell: {
        flex: 1,
        padding: 10,
        color: '#fff',
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'BebasNeue_400Regular',
    },
    cellCantidad: {
        color: '#ffc107',
        fontWeight: 'bold',
    },
    noDataText: {
        color: '#fff',
        textAlign: 'center',
        padding: 15,
        width: '100%',
        fontFamily: 'BebasNeue_400Regular',
    },
    total: {
        color: '#28a745',
        fontFamily: 'BebasNeue_400Regular',
        fontSize: 22,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
        letterSpacing: 1,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dc3545',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 10,
        marginRight: 10,
        shadowColor: '#dc3545',
        shadowOpacity: 0.18,
        shadowRadius: 5,
        elevation: 2,
    },
    clearButtonText: {
        color: '#fff',
        fontFamily: 'BebasNeue_400Regular',
        fontSize: 18,
        letterSpacing: 1,
    },
    subtractButton: {
        backgroundColor: '#ffc107',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 10,
        shadowColor: '#ffc107',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    subtractButtonText: {
        textAlign: 'center',
        fontFamily: 'BebasNeue_400Regular',
        fontSize: 18,
        color: '#181A20',
        letterSpacing: 1,
    },

});