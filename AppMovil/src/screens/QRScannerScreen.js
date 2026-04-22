import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const QRScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await CameraView.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setData(data);
    Alert.alert(
      'QR Escaneado',
      `Contenido: ${data}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setScanned(false);
            // Aquí puedes procesar el QR o navegar a otra pantalla
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleRequestPermission = async () => {
    const { status } = await CameraView.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.message}>Verificando permisos de cámara...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Ionicons name="camera-outline" size={60} color="#6366F1" />
          <Text style={styles.message}>Acceso a la cámara denegado</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={handleRequestPermission}>
            <Text style={styles.permissionButtonText}>Solicitar Permiso</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#6366F1" />
        </TouchableOpacity>
        <Text style={styles.title}>Escáner QR</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />
        
        <View style={styles.overlay}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          {scanned 
            ? `QR Escaneado: ${data}` 
            : 'Apunta el código QR dentro del área de escaneo'
          }
        </Text>
        {scanned && (
          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={() => setScanned(false)}
          >
            <Text style={styles.scanButtonText}>Escanear otro</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#6366F1',
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  placeholder: {
    width: 24,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    width: 30,
    height: 30,
    borderColor: '#6366F1',
    borderWidth: 3,
  },
  topLeft: {
    position: 'absolute',
    top: 120,
    left: 60,
  },
  topRight: {
    position: 'absolute',
    top: 120,
    right: 60,
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 120,
    left: 60,
  },
  bottomRight: {
    position: 'absolute',
    bottom: 120,
    right: 60,
  },
  instructions: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
  },
  scanButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  scanButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QRScannerScreen;
