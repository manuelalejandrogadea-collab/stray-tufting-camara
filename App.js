import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import CheckBox from 'expo-checkbox';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const COLORS = {
  background: '#000000',
  orange: '#FF6D00',
  greenOlive: '#53683A',
  grayDark: '#1E1E1E',
  grayLight: '#2C2C2C',
  textWhite: '#FFFFFF',
};

export default function App() {
  const [mode, setMode] = useState('video');
  const [zoom, setZoom] = useState('1x');
  const [pausa, setPausa] = useState(8);
  const [duracion, setDuracion] = useState(4);
  const [modoContinuo, setModoContinuo] = useState(true);

  return (
    <View style={styles.container}>
      {/* 1. BARRA SUPERIOR (HEADER) */}
      <View style={styles.header}>
        <Image 
          source={require('./logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Stray Tufting Camara</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="grid" size={24} color={COLORS.orange} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 15 }}>
          <Ionicons name="camera-reverse-outline" size={24} color={COLORS.textWhite} />
        </TouchableOpacity>
      </View>

      {/* 2. VISOR CÁMARA */}
      <View style={styles.cameraContainer}>
        <View style={styles.cameraPlaceholder}>
          <View style={styles.gridOverlay}>
            <View style={styles.gridRow} />
            <View style={styles.gridRow}
