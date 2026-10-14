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
      {/* HEADER */}
      <View style={styles.header}>
        <Image 
          source={require('./assets/logo.png')} 
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

      {/* VISOR CÁMARA */}
      <View style={styles.cameraContainer}>
        <View style={styles.cameraPlaceholder}>
          <View style={styles.gridOverlay}>
            <View style={styles.gridRow} />
            <View style={styles.gridRow} />
          </View>
          <View style={[styles.gridOverlay, { flexDirection: 'row' }]}>
            <View style={styles.gridCol} />
            <View style={styles.gridCol} />
          </View>

          <View style={styles.zoomContainer}>
            {['.6', '1x', '2', '3', '10'].map((val) => (
              <TouchableOpacity 
                key={val} 
                style={[
                  styles.zoomBtn, 
                  zoom === val ? styles.zoomBtnActive : styles.zoomBtnInactive
                ]}
                onPress={() => setZoom(val)}
              >
                <Text style={[
                  styles.zoomText, 
                  zoom === val ? styles.zoomTextActive : styles.zoomTextInactive
                ]}>
                  {val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* PANEL INFERIOR */}
      <View style={styles.controlsContainer}>
        <View style={styles.modeSelectorRow}>
          <View style={styles.toggleButtons}>
            <TouchableOpacity 
              style={[styles.btnMode, mode === 'imagen' && styles.btnModeActiveImagen]}
              onPress={() => setMode('imagen')}
            >
              <Text style={[styles.btnModeText, mode === 'imagen' && styles.btnModeTextActive]}>IMAGEN</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.btnMode, mode === 'video' && styles.btnModeActiveVideo]}
              onPress={() => setMode('video')}
            >
              {mode === 'video' && <Ionicons name="checkmark" size={16} color={COLORS.textWhite} style={{ marginRight: 4 }} />}
              <Text style={styles.btnModeTextActive}>VIDEO</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>3s</Text>
            <MaterialCommunityIcons name="timer-outline" size={18} color={COLORS.orange} />
          </View>
        </View>

        <View style={styles.sliderSection}>
          <View style={styles.sliderContainer}>
            <Text style={styles.labelText}>Pausa: {pausa}s</Text>
            <Slider
              minimumValue={1}
              maximumValue={30}
              step={1}
              value={pausa}
              onValueChange={setPausa}
              minimumTrackTintColor={COLORS.orange}
              maximumTrackTintColor="#333"
              thumbTintColor={COLORS.orange}
            />
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.labelText}>Duración Clip: {duracion}s</Text>
            <Slider
              minimumValue={1}
              maximumValue={60}
              step={1}
              value={duracion}
              onValueChange={setDuracion}
              minimumTrackTintColor={COLORS.orange}
              maximumTrackTintColor="#333"
              thumbTintColor={COLORS.orange}
            />
          </View>
        </View>

        <View style={styles.extraControlsRow}>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={modoContinuo}
              onValueChange={setModoContinuo}
              color={modoContinuo ? COLORS.greenOlive : undefined}
            />
            <Text style={styles.checkboxLabel}>Modo Continuo</Text>
          </View>
          <Text style={styles.capturasText}>Capturas: 2</Text>
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>INICIAR AUTO-CAPTURA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10 },
  logo: { width: 28, height: 28, marginRight: 10 },
  headerTitle: { flex: 1, color: COLORS.textWhite, fontSize: 18, fontWeight: 'bold' },
  cameraContainer: { flex: 1.5, backgroundColor: '#222' },
  cameraPlaceholder: { flex: 1, justifyContent: 'flex-end' },
  gridOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-evenly' },
  gridRow: { borderBottomWidth: 0.5, borderColor: 'rgba(255, 255, 255, 0.2)', width: '100%' },
  gridCol: { borderRightWidth: 0.5, borderColor: 'rgba(255, 255, 255, 0.2)', height: '100%' },
  zoomContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15, gap: 8 },
  zoomBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  zoomBtnActive: { backgroundColor: COLORS.orange },
  zoomBtnInactive: { backgroundColor: 'rgba(0,0,0,0.6)' },
  zoomText: { fontSize: 12, fontWeight: 'bold' },
  zoomTextActive: { color: COLORS.textWhite },
  zoomTextInactive: { color: '#8E8E93' },
  controlsContainer: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 20, paddingTop: 15 },
  modeSelectorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  toggleButtons: { flexDirection: 'row', backgroundColor: COLORS.grayDark, borderRadius: 8, padding: 3 },
  btnMode: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, flexDirection: 'row', alignItems: 'center' },
  btnModeActiveImagen: { borderWidth: 1.5, borderColor: COLORS.textWhite },
  btnModeActiveVideo: { backgroundColor: COLORS.greenOlive },
  btnModeText: { color: '#8E8E93', fontWeight: 'bold', fontSize: 13 },
  btnModeTextActive: { color: COLORS.textWhite, fontWeight: 'bold', fontSize: 13 },
  timerContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  timerText: { color: COLORS.textWhite, fontSize: 14 },
  sliderSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  sliderContainer: { width: '48%' },
  labelText: { color: '#8E8E93', fontSize: 12, marginBottom: 5 },
  extraControlsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkboxLabel: { color: COLORS.textWhite, fontSize: 14 },
  capturasText: { color: COLORS.orange, fontWeight: 'bold', fontSize: 14 },
  actionButton: { backgroundColor: COLORS.greenOlive, paddingVertical: 15, borderRadius: 25, alignItems: 'center' },
  actionButtonText: { color: COLORS.textWhite, fontWeight: 'bold', fontSize: 15, letterSpacing: 1 },
});
                
