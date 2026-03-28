import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IP conectada a Docker
const BASE_URL = 'http://10.16.35.92:5000';
const API_URL_CERT = `${BASE_URL}/api/certificaciones`;

const ProfileScreen = ({ navigation, onLogout }) => {
  // 1. ESTADOS DEL PERFIL
  const [perfil, setPerfil] = useState({
    id_perfil: null, // Agregado para tenerlo siempre a la mano
    nombre: 'Cargando...',
    titulo: '...',
    area: 'Área Profesional',
    nivel: '...',
    email: '...',
    telefono: '...',
    ubicacion: 'México',
    verificado: false,
    foto: null
  });
  const [loadingPerfil, setLoadingPerfil] = useState(true);
  const [idPerfilActual, setIdPerfilActual] = useState(null);

  // 2. ESTADOS DEL CRUD DE CERTIFICACIONES
  const [certificaciones, setCertificaciones] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [certEditandoId, setCertEditandoId] = useState(null);

  const [formNombre, setFormNombre] = useState('');
  const [formEntidad, setFormEntidad] = useState('');
  const [formAño, setFormAño] = useState('');

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formPerfil, setFormPerfil] = useState({
    titulo: '',
    telefono: '',
    area: '',
    nivel: ''
  });

  // 3. CARGAR DATOS AL INICIO
  useEffect(() => {
    cargarDatosPerfil();
  }, []);

  const cargarDatosPerfil = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('user_email');
      console.log("👀 1. Correo en sesión:", storedEmail);

      if (storedEmail) {
        const urlBusqueda = `${BASE_URL}/api/perfiles/email/${storedEmail}`;
        console.log("👀 2. Buscando perfil en:", urlBusqueda);

        const respuesta = await fetch(urlBusqueda);
        console.log("👀 3. Código de respuesta del servidor:", respuesta.status);

        if (respuesta.ok) {
          const datosDeLaBase = await respuesta.json();
          console.log("👀 4. ¡Perfil encontrado!", datosDeLaBase);

          setIdPerfilActual(datosDeLaBase.id_perfil);

          setPerfil({
            id_perfil: datosDeLaBase.id_perfil,
            nombre: `${datosDeLaBase.nombre} ${datosDeLaBase.apellido}`,
            titulo: datosDeLaBase.puesto_actual || 'Puesto no especificado',
            area: 'Área Ejecutiva',
            nivel: datosDeLaBase.experiencia_anios ? `${datosDeLaBase.experiencia_anios} años de exp.` : 'Sin experiencia',
            email: storedEmail,
            telefono: datosDeLaBase.telefono || 'Sin teléfono',
            ubicacion: 'México',
            verificado: true,
            foto: null
          });

          obtenerCertificaciones(datosDeLaBase.id_perfil);
        } else {
          // Si falla, vamos a ver qué nos está diciendo FastAPI
          const errorBackend = await respuesta.text();
          console.log("👀 5. El servidor rechazó la búsqueda. Razón:", errorBackend);

          const emailName = storedEmail.split('@')[0];
          setPerfil(prev => ({ ...prev, nombre: emailName, email: storedEmail, titulo: 'Completa tu perfil' }));
        }
      } else {
        console.log("👀 ERROR: No hay ningún correo guardado en AsyncStorage");
      }
    } catch (error) {
      console.error("👀 Error catastrofico al cargar:", error);
    } finally {
      setLoadingPerfil(false);
    }
  };

  const habilitarEdicion = () => {
    setFormPerfil({
      titulo: perfil.titulo,
      telefono: perfil.telefono,
      area: perfil.area,
      nivel: perfil.nivel
    });
    setIsEditingProfile(true);
  };

  const guardarCambiosPerfil = async () => {
    const idAEditar = idPerfilActual || perfil.id_perfil;

    if (!idAEditar) {
      Alert.alert("Error", "No se encontró el ID del perfil. Por favor, recarga la aplicación.");
      return;
    }

    try {
      const urlDestino = `${BASE_URL}/api/perfiles/${idAEditar}`;
      console.log("Intentando actualizar en:", urlDestino);

      const respuesta = await fetch(urlDestino, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puesto_actual: formPerfil.titulo,
          telefono: formPerfil.telefono
        })
      });

      if (respuesta.ok) {
        setPerfil(prev => ({
          ...prev,
          titulo: formPerfil.titulo,
          telefono: formPerfil.telefono
        }));
        setIsEditingProfile(false);
        Alert.alert("Éxito", "Perfil actualizado correctamente");
      } else {
        const errorDelBackend = await respuesta.json();
        console.log("Error de FastAPI:", errorDelBackend);
        Alert.alert("Error del servidor", JSON.stringify(errorDelBackend));
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  // READ Certificaciones
  const obtenerCertificaciones = async (id_perfil) => {
    if (!id_perfil) return;
    try {
      const respuesta = await fetch(`${API_URL_CERT}/perfil/${id_perfil}`);
      const datos = await respuesta.json();
      setCertificaciones(datos);
    } catch (error) {
      console.error("Error GET certificaciones:", error);
    }
  };

  // CREATE y UPDATE Certificaciones
  const guardarCertificacion = async () => {
    if (!formNombre || !formEntidad || !formAño) {
      Alert.alert("Error", "Por favor llena todos los campos");
      return;
    }

    const idUsar = idPerfilActual || perfil.id_perfil;
    if (!idUsar) {
      Alert.alert("Error", "No se encontró el perfil del usuario.");
      return;
    }

    const datosEnviar = {
      id_perfil: idUsar,
      nombre: formNombre,
      institucion: formEntidad,
      anio: parseInt(formAño)
    };

    try {
      const urlFetch = certEditandoId !== null ? `${API_URL_CERT}/${certEditandoId}` : API_URL_CERT;
      const metodoFetch = certEditandoId !== null ? 'PUT' : 'POST';

      const respuesta = await fetch(urlFetch, {
        method: metodoFetch,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosEnviar)
      });

      if (respuesta.ok) {
        cerrarModal();
        obtenerCertificaciones(idUsar);
        Alert.alert("Éxito", certEditandoId !== null ? "Certificación actualizada" : "Certificación guardada");
      } else {
        Alert.alert("Error", "No se pudo guardar en la base de datos");
      }
    } catch (error) {
      console.error(`Error ${certEditandoId !== null ? 'PUT' : 'POST'}:`, error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  // DELETE Certificaciones
  const eliminarCertificacion = (id_certificacion) => {
    Alert.alert("Eliminar", "¿Estás seguro de que deseas borrarla?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, borrar", style: "destructive", onPress: async () => {
          try {
            const respuesta = await fetch(`${API_URL_CERT}/${id_certificacion}`, { method: 'DELETE' });
            if (respuesta.ok) obtenerCertificaciones(idPerfilActual);
          } catch (error) {
            console.error("Error DELETE:", error);
          }
        }
      }
    ]);
  };

  // FUNCIONES DEL MODAL
  const abrirModalCrear = () => {
    setCertEditandoId(null);
    setFormNombre(''); setFormEntidad(''); setFormAño('');
    setModalVisible(true);
  };

  const abrirModalEditar = (cert) => {
    setCertEditandoId(cert.id_certificacion);
    setFormNombre(cert.nombre); setFormEntidad(cert.institucion); setFormAño(cert.anio.toString());
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setCertEditandoId(null);
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas salir de tu cuenta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, salir", style: "destructive", onPress: () => { onLogout(); } }
      ]
    );
  };

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

        {/* --- TARJETA PRINCIPAL DEL PERFIL --- */}
        <View style={styles.card}>
          {loadingPerfil ? (
            <ActivityIndicator size="large" color="#3B82F6" style={{ marginVertical: 30 }} />
          ) : (
            <>
              <View style={styles.fotoContainer}>
                {perfil.foto ? (
                  <Image source={{ uri: perfil.foto }} style={styles.fotoPerfil} />
                ) : (
                  <View style={styles.fotoPlaceholder}>
                    <Text style={styles.fotoPlaceholderText}>{perfil.nombre.charAt(0)}</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.editPhotoBtn}>
                  <Ionicons name="camera" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.infoHeader}>
                <Text style={styles.nombre}>{perfil.nombre}</Text>

                {/* CONDICIONAL: Modo Edición vs Modo Vista */}
                {isEditingProfile ? (
                  <View style={{ width: '100%', paddingHorizontal: 20 }}>
                    <Text style={styles.labelInput}>Puesto / Título</Text>
                    <TextInput style={styles.input} value={formPerfil.titulo} onChangeText={(txt) => setFormPerfil({ ...formPerfil, titulo: txt })} />

                    <Text style={styles.labelInput}>Área</Text>
                    <TextInput style={styles.input} value={formPerfil.area} onChangeText={(txt) => setFormPerfil({ ...formPerfil, area: txt })} />

                    <Text style={styles.labelInput}>Teléfono</Text>
                    <TextInput style={styles.input} value={formPerfil.telefono} onChangeText={(txt) => setFormPerfil({ ...formPerfil, telefono: txt })} keyboardType="phone-pad" />

                    <View style={styles.modalBotones}>
                      <TouchableOpacity style={[styles.btnModal, styles.btnCancelar]} onPress={() => setIsEditingProfile(false)}>
                        <Text style={styles.txtBtnCancelar}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.btnModal, styles.btnGuardar]} onPress={guardarCambiosPerfil}>
                        <Text style={styles.txtBtnGuardar}>Guardar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <>
                    <View style={styles.tituloRow}>
                      <Text style={styles.titulo}>{perfil.titulo}</Text>
                      {perfil.verificado && (
                        <View style={styles.badgeVerificado}>
                          <Ionicons name="checkmark-circle" size={14} color="#10B981" style={{ marginRight: 4 }} />
                          <Text style={styles.badgeTextoVerificado}>Verificado</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.badgesContainer}>
                      <View style={styles.badgeIndustria}><Text style={styles.badgeIndustriaTexto}>{perfil.area}</Text></View>
                      <View style={styles.badgeIndustria}><Text style={styles.badgeIndustriaTexto}>{perfil.nivel}</Text></View>
                    </View>

                    <View style={styles.contactoContainer}>
                      <View style={styles.contactoRow}><Ionicons name="mail-outline" size={16} color="#64748B" /><Text style={styles.contactoItem}>{perfil.email}</Text></View>
                      <View style={styles.contactoRow}><Ionicons name="call-outline" size={16} color="#64748B" /><Text style={styles.contactoItem}>{perfil.telefono}</Text></View>
                      <View style={styles.contactoRow}><Ionicons name="location-outline" size={16} color="#64748B" /><Text style={styles.contactoItem}>{perfil.ubicacion}</Text></View>
                    </View>

                    {/* Botón para activar la edición */}
                    <TouchableOpacity
                      style={{ backgroundColor: '#F1F5F9', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, marginTop: 5, flexDirection: 'row', alignItems: 'center' }}
                      onPress={habilitarEdicion}
                    >
                      <Ionicons name="pencil" size={14} color="#475569" style={{ marginRight: 5 }} />
                      <Text style={{ color: '#475569', fontWeight: 'bold', fontSize: 13 }}>Editar Perfil</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </>
          )}
        </View>

        {/* --- SECCIÓN DE CERTIFICACIONES --- */}
        <Seccion titulo="Certificaciones" icon="ribbon-outline" onAgregar={abrirModalCrear}>
          {certificaciones.length === 0 ? (
            <Text style={{ color: '#94A3B8', textAlign: 'center', marginVertical: 10 }}>No hay certificaciones.</Text>
          ) : (
            certificaciones.map((item, index) => (
              <View key={item.id_certificacion} style={[styles.itemLista, index === certificaciones.length - 1 && styles.noBorder]}>

                <View style={styles.certContent}>
                  <Text style={styles.certNombre}>{item.nombre}</Text>
                  <Text style={styles.certEntidad}>{item.institucion} • {item.anio}</Text>
                </View>

                {/* Botones de Acción */}
                <View style={styles.certAcciones}>
                  <TouchableOpacity onPress={() => abrirModalEditar(item)} style={styles.btnAccion}>
                    <Ionicons name="pencil" size={18} color="#3B82F6" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => eliminarCertificacion(item.id_certificacion)} style={styles.btnAccion}>
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

      {/* --- MODAL DE CERTIFICACIONES --- */}
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

    </LinearGradient >
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