import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
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
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  const [mode, setMode] = useState('video');
  const [flash, setFlash] = useState('off');
  const [zoom, setZoom] = useState(0);
  const [pausa, setPausa] = useState(8);
  const [duracion, setDuracion] = useState(4);
  const [modoContinuo, setModoContinuo] = useState(true);
  
  const [isRecording, setIsRecording] = useState(false);
  const [lastMedia, setLastMedia] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (!cameraPermission?.granted) await requestCameraPermission();
      if (!micPermission?.granted) await requestMicPermission();
      if (!mediaPermission?.granted) await requestMediaPermission();
    })();
  }, []);

  const toggleFlash = () => {
    setFlash((prev) => (prev === 'off' ? 'on' : prev === 'on' ? 'auto' : 'off'));
  };

  const saveToGallery = async (uri) => {
    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      setLastMedia(asset.uri);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el archivo en la galería");
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    if (mode === 'imagen') {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        await saveToGallery(photo.uri);
      } catch (e) {
        console.error(e);
      }
    } else {
      if (isRecording) {
        cameraRef.current.stopRecording();
        setIsRecording(false);
      } else {
        try {
          setIsRecording(true);
          const video = await cameraRef.current.recordAsync({ maxDuration: duracion });
          await saveToGallery(video.uri);
          setIsRecording(false);
        } catch (e) {
          console.error(e);
          setIsRecording(false);
        }
      }
    }
  };

  const getFlashIcon = () => {
    if (flash === 'on') return 'flash';
    if (flash === 'auto') return 'flash-auto';
    return 'flash-off';
  };

  return (
    <View style={styles.container}>
      {/* 1. BARRA SUPERIOR (HEADER) */}
      <View style={styles.header}>
        <Image source={require('./logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.headerTitle}>Stray Tufting Camara</Text>
        
        {/* Botón de Flash */}
        <TouchableOpacity onPress={toggleFlash} style={{ marginRight: 15 }}>
          <MaterialCommunityIcons name={getFlashIcon()} size={24} color={flash !== 'off' ? COLORS.orange : COLORS.textWhite} />
        </TouchableOpacity>

        {/* Cambio de cámara */}
        <TouchableOpacity>
          <Ionicons name="camera-reverse-outline" size={24} color={COLORS.textWhite} />
        </TouchableOpacity>
      </View>

      {/* 2. VISOR DE LA CÁMARA */}
      <View style={styles.cameraContainer}>
        {cameraPermission?.granted ? (
          <CameraView
            style={styles.camera}
            ref={cameraRef}
            flash={flash}
            zoom={zoom}
            mode={mode === 'video' ? 'video' : 'picture'}
          >
            {/* Cuadrícula */}
            <View style={styles.gridOverlay}>
              <View style={styles.gridRow} />
              <View style={styles.gridRow} />
            </View>
            <View style={[styles.gridOverlay, { flexDirection: 'row' }]}>
              <View style={styles.gridCol} />
              <View style={styles.gridCol} />
            </View>

            {/* Selector de Zoom */}
            <View style={styles.zoomContainer}>
              {['.6', '1x', '2', '3', '10'].map((val, idx) => (
                <TouchableOpacity 
                  key={val} 
                  style={[styles.zoomBtn, zoom === idx * 0.2 ? styles.zoomBtnActive : styles.zoomBtnInactive]}
                  onPress={() => setZoom(idx * 0.2)}
                >
                  <Text style={[styles.zoomText, zoom === idx * 0.2 ? styles.zoomTextActive : styles.zoomTextInactive]}>
                    {val}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </CameraView>
        ) : (
          <View style={[styles.camera, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: '#fff' }}>Permisos de cámara requeridos</Text>
          </View>
        )}
      </View>

      {/* 3. PANEL DE CONTROL INFERIOR */}
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
          
          {/* MINIATURA DE LA ÚLTIMA CAPTURA */}
          <TouchableOpacity 
            style={styles.thumbnailContainer}
            onPress={() => lastMedia && setModalVisible(true)}
          >
            {lastMedia ? (
              <Image source={{ uri: lastMedia }} style={styles.thumbnail} />
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <Ionicons name="images-outline" size={20} color="#8E8E93" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.actionButton, isRecording && { backgroundColor: '#D32F2F' }]}
          onPress={handleCapture}
        >
          <Text style={styles.actionButtonText}>
            {isRecording ? "DETENER GRABACIÓN" : "INICIAR AUTO-CAPTURA"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODAL PARA VER LA CAPTURA EN GRANDE */}
      <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeModal} onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          {lastMedia && (
            <Image source={{ uri: lastMedia }} style={styles.fullImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10 },
  logo: { width: 28, height: 28, marginRight: 10 },
  headerTitle: { flex: 1, color: COLORS.textWhite, fontSize: 18, fontWeight: 'bold' },
  cameraContainer: { flex: 1.5, backgroundColor: '#000' },
  camera: { flex: 1 },
  gridOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-evenly' },
  gridRow: { borderBottomWidth: 0.5, borderColor: 'rgba(255, 255, 255, 0.2)', width: '100%' },
  gridCol: { borderRightWidth: 0.5, borderColor: 'rgba(255, 255, 255, 0.2)', height: '100%' },
  zoomContainer: { position: 'absolute', bottom: 15, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 8 },
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
  thumbnailContainer: { width: 40, height: 40, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.orange },
  thumbnail: { width: '100%', height: '100%' },
  thumbnailPlaceholder: { flex: 1, backgroundColor: COLORS.grayDark, justifyContent: 'center', alignItems: 'center' },
  actionButton: { backgroundColor: COLORS.greenOlive, paddingVertical: 15, borderRadius: 25, alignItems: 'center' },
  actionButtonText: { color: COLORS.textWhite, fontWeight: 'bold', fontSize: 15, letterSpacing: 1 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  closeModal: { position: 'absolute', top: 40, right: 20, zIndex: 1 },
  fullImage: { width: '90%', height: '80%' },
});
            
