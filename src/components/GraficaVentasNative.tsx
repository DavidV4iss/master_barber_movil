import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

export default function GraficaVentasNative({ ventas }) {
    if (!Array.isArray(ventas) || ventas.length === 0) {
        return (
            <Text style={styles.noDataText}>
                No hay datos para mostrar
            </Text>
        );
    }

    const agrupadas = ventas.reduce((acc, venta) => {
        acc[venta.nombre] = (acc[venta.nombre] || 0) + venta.cantidad;
        return acc;
    }, {});

    const nombres = Object.keys(agrupadas);
    const cantidades = Object.values(agrupadas);

    const labels = nombres.map(label =>
        label.length > 12 ? label.slice(0, 10) + '…' : label
    );

    const maxCantidad = Math.max(...cantidades);
    const indexMax = cantidades.indexOf(maxCantidad);

    const chartColors = cantidades.map((_, i) =>
        i === indexMax ? '#ff6b6b' : '#ffc107'
    );

    const chartConfig = {
        backgroundGradientFrom: '#1f1f1f',
        backgroundGradientTo: '#1f1f1f',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
        labelColor: () => '#ffffff',
        propsForBackgroundLines: {
            stroke: '#333',
        },
        barPercentage: 0.6,
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Análisis de Ventas</Text>
            <BarChart
                data={{
                    labels,
                    datasets: [{ data: cantidades }],
                }}
                width={Dimensions.get('window').width - 40}
                height={Math.max(260, cantidades.length * 30)}
                fromZero
                chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1, index) =>
                        chartColors[index] || `rgba(255, 193, 7, ${opacity})`,
                }}
                style={styles.chart}
                verticalLabelRotation={labels.length > 5 ? 30 : 0}
                showValuesOnTopOfBars
            />
            <Text style={styles.highlight}>
                Producto más vendido: <Text style={styles.max}>{nombres[indexMax]}</Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        marginBottom: 40,
        padding: 20,
        backgroundColor: '#2a2a2a',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        color: '#ffc107',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'BebasNeue_400Regular',
        letterSpacing: 1,
    },
    chart: {
        borderRadius: 12,
    },
    noDataText: {
        color: '#dc3545',
        textAlign: 'center',
        marginVertical: 40,
        fontSize: 18,
        fontFamily: 'BebasNeue_400Regular',
    },
    highlight: {
        marginTop: 20,
        textAlign: 'center',
        color: '#fff',
        fontSize: 14,
    },
    max: {
        color: '#ff6b6b',
        fontWeight: 'bold',
    },
});
