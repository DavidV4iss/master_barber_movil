import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import Constants from "expo-constants";

export default function DefaultLayout({ children }) {
    return (
        <View style={styles.containerfluid}>
            <ScrollView contentContainerStyle={styles.content}>
                {children}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    containerfluid: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#212529",
        color: "#ffffff",
        alignContent: "center",
    },
    content: {
        flexGrow: 1,
        paddingBottom: 70,
    },
});