import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, ActivityIndicator, RefreshControl, KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.71:5000';
const API_URL_CERT = `${BASE_URL}/api/certificaciones`;

const PUESTOS_PREDETERMINADOS = [
  "Desarrollador Frontend",
  "Desarrollador Backend",
  "Desarrollador Fullstack",
  "Ingeniero de Software",
  "Analista de Datos",
  "Diseñador UX/UI",
  "Gerente de Proyectos",
  "Soporte Técnico",
  "Supervisor",
  "Otro"
];

const ProfileScreen = ({ navigation, onLogout }) => {
  const [perfil, setPerfil] = useState({
    id_perfil: null,
    nombre: 'Cargando...',
    titulo: '...',
    area: 'Cargando...',
    nivel: '...',
    email: '...',
    telefono: '...',
    ubicacion: 'Cargando...',
    verificado: false,
    foto: null
  });

  const [loadingPerfil, setLoadingPerfil] = useState(true);
  const [idPerfilActual, setIdPerfilActual] = useState(null);

  const [certificaciones, setCertificaciones] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [certEditandoId, setCertEditandoId] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const [formUbicacion, setFormUbicacion] = useState('');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await cargarDatosPerfil();

    setRefreshing(false);
  }, []);

  const [modalPuestoVisible, setModalPuestoVisible] = useState(false);
  const [esPuestoOtro, setEsPuestoOtro] = useState(false);

  const [formNombre, setFormNombre] = useState('');
  const [formEntidad, setFormEntidad] = useState('');
  const [formAño, setFormAño] = useState('');

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formPerfil, setFormPerfil] = useState({
    nombre: '',
    apellido: '',
    titulo: '',
    telefono: '',
    area: '',
    nivel: ''
  });

  useEffect(() => {
    cargarDatosPerfil();
  }, []);

  const cargarDatosPerfil = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('user_email');
      if (storedEmail) {
        const urlBusqueda = `${BASE_URL}/api/perfiles/email/${storedEmail}`;
        const respuesta = await fetch(urlBusqueda);

        if (respuesta.ok) {
          const datos = await respuesta.json();
          setIdPerfilActual(datos.id_perfil);

          setPerfil({
            id_perfil: datos.id_perfil,
            nombre: `${datos.nombre || ''} ${datos.apellido || ''}`.trim() || 'Usuario Nuevo',
            titulo: datos.puesto_actual || 'Completa tu perfil',
            area: datos.area || 'Sin área definida',
            nivel: datos.experiencia_anios ? `${datos.experiencia_anios} años de exp.` : 'Sin experiencia',
            email: storedEmail,
            telefono: datos.telefono || 'Sin teléfono',
            ubicacion: datos.ubicacion || 'Sin ubicación',
            verificado: true,
            foto: null
          });

          obtenerCertificaciones(datos.id_perfil);
        } else {
          setPerfil(prev => ({
            ...prev,
            nombre: 'Usuario Nuevo',
            titulo: 'Completa tu perfil',
            area: 'Sin área definida',
            ubicacion: 'Sin ubicación',
            email: storedEmail
          }));
        }
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      setPerfil(prev => ({
        ...prev,
        nombre: 'Error de conexión',
        titulo: 'Intenta más tarde'
      }));
    } finally {
      setLoadingPerfil(false);
    }
  };

  const habilitarEdicion = () => {
    const nombres = perfil.nombre.split(' ');
    const tituloActual = perfil.titulo !== 'Completa tu perfil' ? perfil.titulo : '';

    const esPredeterminado = PUESTOS_PREDETERMINADOS.includes(tituloActual);

    if (tituloActual && !esPredeterminado) {
      setEsPuestoOtro(true);
    } else {
      setEsPuestoOtro(false);
    }

    setFormPerfil({
      nombre: nombres[0] || '',
      apellido: nombres.slice(1).join(' ') || '',
      titulo: tituloActual,
      telefono: perfil.telefono !== 'Sin teléfono' ? perfil.telefono : '',
      area: perfil.area !== 'Sin área definida' ? perfil.area : '',
      nivel: perfil.nivel.replace(/[^0-9]/g, '') || '0'
    });
    setIsEditingProfile(true);
  };

  const guardarCambiosPerfil = async () => {
    if (esPuestoOtro && !formPerfil.titulo.trim()) {
      Alert.alert("Atención", "Por favor especifica tu puesto.");
      return;
    }

    try {
      const storedEmail = await AsyncStorage.getItem('user_email');
      const idAEditar = idPerfilActual || perfil.id_perfil;

      const datosEnviar = {
        nombre: formPerfil.nombre,
        apellido: formPerfil.apellido,
        puesto_actual: formPerfil.titulo,
        telefono: formPerfil.telefono,
        experiencia_anios: parseInt(formPerfil.nivel) || 0,
        area: formPerfil.area,
        ubicacion: formPerfil.ubicacion,
        email: storedEmail
      };

      const metodo = idAEditar ? 'PUT' : 'POST';
      const url = idAEditar
        ? `${BASE_URL}/api/perfiles/${idAEditar}`
        : `${BASE_URL}/api/perfiles`;

      const respuesta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosEnviar)
      });

      if (respuesta.ok) {
        const datosGuardados = await respuesta.json();

        if (!idAEditar && datosGuardados.id_perfil) {
          setIdPerfilActual(datosGuardados.id_perfil);
        }

        setPerfil(prev => ({
          ...prev,
          id_perfil: idAEditar || datosGuardados.id_perfil,
          nombre: `${formPerfil.nombre} ${formPerfil.apellido}`.trim(),
          titulo: formPerfil.titulo,
          telefono: formPerfil.telefono,
          nivel: `${formPerfil.nivel} años de exp.`,
          area: formPerfil.area,
          ubicacion: formPerfil.ubicacion
        }));

        setIsEditingProfile(false);
        Alert.alert("Éxito", idAEditar ? "Perfil actualizado" : "Perfil creado por primera vez");
      } else {
        Alert.alert("Error", "El servidor no pudo guardar los datos.");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error de red", "No se pudo conectar con el servidor.");
    }
  };

  const obtenerCertificaciones = async (id_perfil) => {
    try {
      const respuesta = await fetch(`${API_URL_CERT}/perfil/${id_perfil}`);
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setCertificaciones(datos);
      }
    } catch (error) {
      console.error("Error certificaciones:", error);
    }
  };

  const guardarCertificacion = async () => {
    if (!formNombre || !formEntidad || !formAño) {
      Alert.alert("Error", "Llena todos los campos");
      return;
    }
    const datosEnviar = {
      id_perfil: idPerfilActual,
      nombre: formNombre,
      institucion: formEntidad,
      anio: parseInt(formAño)
    };

    try {
      const url = certEditandoId ? `${API_URL_CERT}/${certEditandoId}` : `${API_URL_CERT}/`;
      const respuesta = await fetch(url, {
        method: certEditandoId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosEnviar)
      });

      if (respuesta.ok) {
        cerrarModal();
        obtenerCertificaciones(idPerfilActual);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar");
    }
  };

  const eliminarCertificacion = (id) => {
    Alert.alert("Eliminar", "¿Borrar certificación?", [
      { text: "No" },
      {
        text: "Sí", onPress: async () => {
          await fetch(`${API_URL_CERT}/${id}`, { method: 'DELETE' });
          obtenerCertificaciones(idPerfilActual);
        }
      }
    ]);
  };

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

  const cerrarModal = () => { setModalVisible(false); setCertEditandoId(null); };

  const handleLogout = () => {
    Alert.alert("Salir", "¿Cerrar sesión?", [
      { text: "No" },
      { text: "Sí", onPress: onLogout }
    ]);
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
      <ScrollView
        showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#000000']} tintColor="#ffffff" />}>
        <View style={styles.card}>
          {loadingPerfil ? (
            <ActivityIndicator size="large" color="#3B 82F6" style={{ marginVertical: 30 }} />
          ) : (
            <>
              <View style={styles.fotoContainer}>
                <View style={styles.fotoPlaceholder}>
                  <Text style={styles.fotoPlaceholderText}>{perfil.nombre.charAt(0)}</Text>
                </View>
                <TouchableOpacity style={styles.editPhotoBtn}>
                  <Ionicons name="camera" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.infoHeader}>
                {isEditingProfile ? (
                  <View style={{ width: '100%' }}>
                    <Text style={styles.labelInput}>Nombre</Text>
                    <TextInput style={styles.input} value={formPerfil.nombre} onChangeText={(t) => setFormPerfil({ ...formPerfil, nombre: t })} />

                    <Text style={styles.labelInput}>Apellido</Text>
                    <TextInput style={styles.input} value={formPerfil.apellido} onChangeText={(t) => setFormPerfil({ ...formPerfil, apellido: t })} />

                    <Text style={styles.labelInput}>Puesto</Text>
                    <TouchableOpacity
                      style={[styles.input, { justifyContent: 'center' }]}
                      onPress={() => setModalPuestoVisible(true)}
                    >
                      <Text style={{ color: (formPerfil.titulo || esPuestoOtro) ? '#0F172A' : '#94A3B8' }}>
                        {esPuestoOtro ? "Otro (Especificar)" : (formPerfil.titulo || "Selecciona un puesto...")}
                      </Text>
                    </TouchableOpacity>

                    {esPuestoOtro && (
                      <TextInput
                        style={[styles.input, { marginTop: 10, borderColor: '#3B82F6', borderWidth: 1.5 }]}
                        placeholder="Escribe tu puesto específico..."
                        value={formPerfil.titulo}
                        onChangeText={(t) => setFormPerfil({ ...formPerfil, titulo: t })}
                        autoFocus
                      />
                    )}

                    <Text style={styles.labelInput}>Años de Experiencia</Text>
                    <TextInput style={styles.input} value={formPerfil.nivel} keyboardType="numeric" onChangeText={(t) => setFormPerfil({ ...formPerfil, nivel: t })} />

                    <Text style={styles.labelInput}>Teléfono</Text>
                    <TextInput style={styles.input} value={formPerfil.telefono} keyboardType="phone-pad" onChangeText={(t) => setFormPerfil({ ...formPerfil, telefono: t })} />

                    <TextInput
                      style={styles.input}
                      placeholder="Ubicación (Ej: CDMX, México)"
                      value={formUbicacion}
                      onChangeText={setFormUbicacion}
                    />


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
                    <Text style={styles.nombre}>{perfil.nombre}</Text>
                    <View style={styles.tituloRow}>
                      <Text style={styles.titulo}>{perfil.titulo}</Text>
                      <View style={styles.badgeVerificado}>
                        <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                        <Text style={styles.badgeTextoVerificado}> Verificado</Text>
                      </View>
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

                    <TouchableOpacity style={styles.btnEditarPerfil} onPress={habilitarEdicion}>
                      <Ionicons name="pencil" size={14} color="#475569" />
                      <Text style={styles.btnEditarPerfilText}> Editar Perfil</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </>
          )}
        </View>

        <Seccion titulo="Certificaciones" icon="ribbon-outline" onAgregar={abrirModalCrear}>
          {certificaciones.map((item) => (
            <View key={item.id_certificacion} style={styles.itemLista}>
              <View style={{ flex: 1 }}>
                <Text style={styles.certNombre}>{item.nombre}</Text>
                <Text style={styles.certEntidad}>{item.institucion} • {item.anio}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => abrirModalEditar(item)} style={{ padding: 5 }}><Ionicons name="pencil" size={18} color="#3B82F6" /></TouchableOpacity>
                <TouchableOpacity onPress={() => eliminarCertificacion(item.id_certificacion)} style={{ padding: 5 }}><Ionicons name="trash-outline" size={18} color="#EF4444" /></TouchableOpacity>
              </View>
            </View>
          ))}
        </Seccion>

        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <Text style={styles.btnLogoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* MODAL CERTIFICACIONES */}
      <Modal visible={modalVisible} transparent animationType="slide">
        {/* TouchableWithoutFeedback detecta toques fuera del teclado para ocultarlo */}
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalOverlay}>

            {/* KeyboardAvoidingView empuja el contenido hacia arriba */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ width: '100%', alignItems: 'center' }}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitulo}>{certEditandoId ? "Editar Certificación" : "Nueva Certificación"}</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Nombre"
                  value={formNombre}
                  onChangeText={setFormNombre}
                  returnKeyType="next" // Cambia el botón a "Siguiente"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Institución"
                  value={formEntidad}
                  onChangeText={setFormEntidad}
                  returnKeyType="next"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Año"
                  value={formAño}
                  onChangeText={setFormAño}
                  keyboardType="numeric"
                  returnKeyType="done" // Cambia el botón a "Listo"
                  onSubmitEditing={() => Keyboard.dismiss()} // Oculta el teclado al dar Enter
                />

                <View style={styles.modalBotones}>
                  <TouchableOpacity style={[styles.btnModal, styles.btnCancelar]} onPress={cerrarModal}>
                    <Text>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btnModal, styles.btnGuardar]} onPress={guardarCertificacion}>
                    <Text style={{ color: '#FFF' }}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>

          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* MODAL SELECCION DE PUESTO */}
      <Modal visible={modalPuestoVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '70%' }]}>
            <Text style={styles.modalTitulo}>Selecciona tu Puesto</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {PUESTOS_PREDETERMINADOS.map((puesto, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.itemPuesto}
                  onPress={() => {
                    if (puesto === "Otro") {
                      setEsPuestoOtro(true);
                      setFormPerfil({ ...formPerfil, titulo: '' }); // Limpiamos para que escriba
                    } else {
                      setEsPuestoOtro(false);
                      setFormPerfil({ ...formPerfil, titulo: puesto }); // Asignamos el predeterminado
                    }
                    setModalPuestoVisible(false);
                  }}
                >
                  <Text style={styles.txtItemPuesto}>{puesto}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.btnModal, styles.btnCancelar, { marginTop: 20 }]}
              onPress={() => setModalPuestoVisible(false)}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 15, paddingTop: 50 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 15, elevation: 3 },
  fotoContainer: { alignItems: 'center', marginBottom: 15 },
  fotoPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' },
  fotoPlaceholderText: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold' },
  editPhotoBtn: { position: 'absolute', bottom: 0, right: '38%', backgroundColor: '#3B82F6', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  infoHeader: { alignItems: 'center' },
  nombre: { fontSize: 22, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  tituloRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  titulo: { fontSize: 15, color: '#64748B', marginRight: 8 },
  badgeVerificado: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeTextoVerificado: { color: '#10B981', fontSize: 11, fontWeight: 'bold' },
  badgesContainer: { flexDirection: 'row', marginBottom: 15 },
  badgeIndustria: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, margin: 4 },
  badgeIndustriaTexto: { color: '#475569', fontSize: 12, fontWeight: '600' },
  contactoContainer: { width: '100%', backgroundColor: '#F8FAFC', padding: 15, borderRadius: 10, marginBottom: 10 },
  contactoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  contactoItem: { fontSize: 13, color: '#475569', marginLeft: 10 },
  btnEditarPerfil: { backgroundColor: '#F1F5F9', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  btnEditarPerfilText: { color: '#475569', fontWeight: 'bold', fontSize: 13 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 10 },
  sectionTitleWrap: { flexDirection: 'row', alignItems: 'center' },
  tituloSeccion: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  btnAgregar: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' },
  itemLista: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  certNombre: { fontSize: 14, color: '#0F172A', fontWeight: '600' },
  certEntidad: { fontSize: 12, color: '#94A3B8' },
  btnLogout: { paddingVertical: 15, alignItems: 'center', borderWidth: 1, borderColor: '#EF4444', borderRadius: 12 },
  btnLogoutText: { color: '#EF4444', fontWeight: 'bold' },
  labelInput: { fontSize: 12, color: '#64748B', fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 10, marginTop: 5, backgroundColor: '#F8FAFC', minHeight: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#FFF', borderRadius: 15, padding: 20 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  modalBotones: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  btnModal: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  btnCancelar: { backgroundColor: '#F1F5F9' },
  btnGuardar: { backgroundColor: '#3B82F6' },
  txtBtnGuardar: { color: '#FFF', fontWeight: 'bold' },
  itemPuesto: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  txtItemPuesto: { fontSize: 15, color: '#334155', textAlign: 'center' }
});

export default ProfileScreen;