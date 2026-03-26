import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

//IP conectada a Docker
const API_URL = 'http://10.16.35.180:5000/api/certificaciones';

const ProfileScreen = ({ navigation, onLogout }) => {
  const [usuario] = useState({
    nombre: 'Isaac',
    titulo: 'Director de Operaciones',
    area: 'Operaciones y Manufactura',
    nivel: 'Ejecutivo Senior',
    email: 'Usuario.16@gmail.com',
    telefono: '+52 555 123 4567',
    ubicacion: 'Querétaro, México',
    verificado: true,
    foto: null
  });

  //2. ESTADOS DEL CRUD DE CERTIFICACIONES
  const [certificaciones, setCertificaciones] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [certEditandoId, setCertEditandoId] = useState(null);

  const [formNombre, setFormNombre] = useState('');
  const [formEntidad, setFormEntidad] = useState('');
  const [formAño, setFormAño] = useState('');

  //READ Cargar certificaciones al inicio
  useEffect(() => {
    obtenerCertificaciones();
  }, []);

  const obtenerCertificaciones = async () => {
    try {
      const respuesta = await fetch(API_URL);
      const datos = await respuesta.json();
      setCertificaciones(datos);
    } catch (error) {
      console.error("Error GET:", error);
    }
  };

  //CREATE y UPDATE
  const guardarCertificacion = async () => {
    if (!formNombre || !formEntidad || !formAño) {
      Alert.alert("Error", "Por favor llena todos los campos");
      return;
    }

    const datosEnviar = {
      id: certEditandoId !== null ? certEditandoId : Math.floor(Math.random() * 10000),
      nombre: formNombre,
      institucion: formEntidad,
      anio: parseInt(formAño)
    };

    try {
      const urlFetch = certEditandoId !== null ? `${API_URL}/${certEditandoId}` : API_URL;
      const metodoFetch = certEditandoId !== null ? 'PUT' : 'POST';

      const respuesta = await fetch(urlFetch, {
        method: metodoFetch,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosEnviar)
      });

      if (respuesta.ok) {
        cerrarModal();
        obtenerCertificaciones();
        Alert.alert("Éxito", certEditandoId !== null ? "Certificación actualizada" : "Certificación guardada");
      }
    } catch (error) {
      console.error(`Error ${certEditandoId !== null ? 'PUT' : 'POST'}:`, error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  //DELETE
  const eliminarCertificacion = (id) => {
    Alert.alert("Eliminar", "¿Estás seguro de que deseas borrarla?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, borrar", style: "destructive", onPress: async () => {
          try {
            const respuesta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (respuesta.ok) obtenerCertificaciones();
          } catch (error) {
            console.error("Error DELETE:", error);
          }
        }
      }
    ]);
  };

  //FUNCIONES DEL MODAL
  const abrirModalCrear = () => {
    setCertEditandoId(null);
    setFormNombre(''); setFormEntidad(''); setFormAño('');
    setModalVisible(true);
  };

  const abrirModalEditar = (cert) => {
    setCertEditandoId(cert.id);
    setFormNombre(cert.nombre); setFormEntidad(cert.institucion); setFormAño(cert.anio.toString());
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setCertEditandoId(null);
  };

  //AQUÍ DEBE IR LA NUEVA FUNCIÓN
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas salir de tu cuenta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, salir",
          style: "destructive",
          onPress: () => {
            onLogout();
          }
        }
      ]
    );
  };

  // Nuestro Componente Reutilizable
  const Seccion = ({ titulo, icon, children, onAgregar }) => (
    <View style={styles.card}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWrap}>
          <Ionicons name={icon} size={20} color="#3B82F6" style={styles.sectionIcon} />
          <Text style={styles.tituloSeccion}>{titulo}</Text>
        </View>
        {onAgregar && (
          <TouchableOpacity onPress={onAgregar} style={styles.btnAgregar}>
            <Ionicons name="add" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );

  return (
    <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* --- TARJETA PRINCIPAL DEL PERFIL (FOTO, DATOS, CONTACTO) --- */}
        <View style={styles.card}>
          <View style={styles.fotoContainer}>
            {usuario.foto ? (
              <Image source={{ uri: usuario.foto }} style={styles.fotoPerfil} />
            ) : (
              <View style={styles.fotoPlaceholder}>
                <Text style={styles.fotoPlaceholderText}>{usuario.nombre.charAt(0)}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.editPhotoBtn}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoHeader}>
            <Text style={styles.nombre}>{usuario.nombre}</Text>

            <View style={styles.tituloRow}>
              <Text style={styles.titulo}>{usuario.titulo}</Text>
              {usuario.verificado && (
                <View style={styles.badgeVerificado}>
                  <Ionicons name="checkmark-circle" size={14} color="#10B981" style={{ marginRight: 4 }} />
                  <Text style={styles.badgeTextoVerificado}>Verificado</Text>
                </View>
              )}
            </View>

            <View style={styles.badgesContainer}>
              <View style={styles.badgeIndustria}><Text style={styles.badgeIndustriaTexto}>{usuario.area}</Text></View>
              <View style={styles.badgeIndustria}><Text style={styles.badgeIndustriaTexto}>{usuario.nivel}</Text></View>
            </View>

            <View style={styles.contactoContainer}>
              <View style={styles.contactoRow}><Ionicons name="mail-outline" size={16} color="#64748B" /><Text style={styles.contactoItem}>{usuario.email}</Text></View>
              <View style={styles.contactoRow}><Ionicons name="call-outline" size={16} color="#64748B" /><Text style={styles.contactoItem}>{usuario.telefono}</Text></View>
              <View style={styles.contactoRow}><Ionicons name="location-outline" size={16} color="#64748B" /><Text style={styles.contactoItem}>{usuario.ubicacion}</Text></View>
            </View>
          </View>
        </View>

        {/* --- SECCIÓN DE CERTIFICACIONES (CONECTADA A DOCKER) --- */}
        <Seccion titulo="Certificaciones" icon="ribbon-outline" onAgregar={abrirModalCrear}>
          {certificaciones.length === 0 ? (
            <Text style={{ color: '#94A3B8', textAlign: 'center', marginVertical: 10 }}>No hay certificaciones.</Text>
          ) : (
            certificaciones.map((item, index) => (
              <View key={item.id} style={[styles.itemLista, index === certificaciones.length - 1 && styles.noBorder]}>

                <View style={styles.certContent}>
                  <Text style={styles.certNombre}>{item.nombre}</Text>
                  <Text style={styles.certEntidad}>{item.institucion} • {item.anio}</Text>
                </View>

                {/* Botones de Acción */}
                <View style={styles.certAcciones}>
                  <TouchableOpacity onPress={() => abrirModalEditar(item)} style={styles.btnAccion}>
                    <Ionicons name="pencil" size={18} color="#3B82F6" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => eliminarCertificacion(item.id)} style={styles.btnAccion}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>

              </View>
            ))
          )}
        </Seccion>

        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <Text style={styles.btnLogoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={cerrarModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitulo}>
              {certEditandoId !== null ? "Editar Certificación" : "Nueva Certificación"}
            </Text>

            <Text style={styles.labelInput}>Nombre de la Certificación</Text>
            <TextInput style={styles.input} placeholder="ej. Scrum Master" value={formNombre} onChangeText={setFormNombre} />

            <Text style={styles.labelInput}>Institución Emisora</Text>
            <TextInput style={styles.input} placeholder="ej. Scrum.org" value={formEntidad} onChangeText={setFormEntidad} />

            <Text style={styles.labelInput}>Año de Emisión</Text>
            <TextInput style={styles.input} placeholder="ej. 2025" value={formAño} onChangeText={setFormAño} keyboardType="numeric" />

            <View style={styles.modalBotones}>
              <TouchableOpacity style={[styles.btnModal, styles.btnCancelar]} onPress={cerrarModal}>
                <Text style={styles.txtBtnCancelar}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btnModal, styles.btnGuardar]} onPress={guardarCertificacion}>
                <Text style={styles.txtBtnGuardar}>{certEditandoId !== null ? "Actualizar" : "Guardar"}</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 15, paddingTop: 50 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },

  fotoContainer: { alignItems: 'center', marginBottom: 15, position: 'relative' },
  fotoPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#F1F5F9' },
  fotoPlaceholderText: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold' },
  editPhotoBtn: { position: 'absolute', bottom: 0, right: '35%', backgroundColor: '#3B82F6', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF' },

  infoHeader: { alignItems: 'center' },
  nombre: { fontSize: 22, fontWeight: 'bold', color: '#0F172A', marginBottom: 4, textAlign: 'center' },
  tituloRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', justifyContent: 'center' },
  titulo: { fontSize: 15, color: '#64748B', marginRight: 8 },
  badgeVerificado: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#10B981' },
  badgeTextoVerificado: { color: '#10B981', fontSize: 11, fontWeight: 'bold' },

  badgesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 15 },
  badgeIndustria: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, margin: 4 },
  badgeIndustriaTexto: { color: '#475569', fontSize: 12, fontWeight: '600' },

  contactoContainer: { width: '100%', marginBottom: 10, backgroundColor: '#F8FAFC', padding: 15, borderRadius: 10 },
  contactoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  contactoItem: { fontSize: 13, color: '#475569', marginLeft: 10 },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 10 },
  sectionTitleWrap: { flexDirection: 'row', alignItems: 'center' },
  sectionIcon: { marginRight: 8 },
  tituloSeccion: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  btnAgregar: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' },

  itemLista: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  certContent: { flex: 1, paddingRight: 10 },
  certNombre: { fontSize: 14, color: '#0F172A', fontWeight: '600', marginBottom: 2 },
  certEntidad: { fontSize: 12, color: '#94A3B8' },
  certAcciones: { flexDirection: 'row' },
  btnAccion: { padding: 6, marginLeft: 5 },
  noBorder: { borderBottomWidth: 0 },

  btnLogout: { backgroundColor: 'transparent', paddingVertical: 15, marginTop: 5, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EF4444', borderRadius: 12 },
  btnLogoutText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' },

  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '85%', backgroundColor: 'white', borderRadius: 15, padding: 20 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#0F172A', textAlign: 'center' },
  labelInput: { fontSize: 12, color: '#64748B', marginBottom: 5, fontWeight: 'bold', marginLeft: 2 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 10, marginBottom: 15, fontSize: 14, backgroundColor: '#F8FAFC' },
  modalBotones: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btnModal: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  btnCancelar: { backgroundColor: '#F1F5F9' },
  btnGuardar: { backgroundColor: '#3B82F6' },
  txtBtnCancelar: { color: '#64748B', fontWeight: 'bold' },
  txtBtnGuardar: { color: 'white', fontWeight: 'bold' }
});

export default ProfileScreen;