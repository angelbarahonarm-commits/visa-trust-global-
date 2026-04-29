import { useState, useRef } from "react";

const SECCIONES = [
  {
    id: "personal", titulo: "Información Personal", icono: "👤",
    campos: [
      { key: "apellidos", label: "Apellidos", type: "text", placeholder: "Como aparece en el pasaporte", required: true },
      { key: "nombres", label: "Nombres", type: "text", placeholder: "Como aparece en el pasaporte", required: true },
      { key: "apellidos_nativos", label: "Apellidos en idioma nativo", type: "text", placeholder: "Si aplica" },
      { key: "nombres_nativos", label: "Nombres en idioma nativo", type: "text", placeholder: "Si aplica" },
      { key: "otros_nombres", label: "¿Tiene otros nombres o apodos?", type: "select", options: ["No", "Sí"], required: true },
      { key: "otros_nombres_detalle", label: "Especifique otros nombres", type: "text", placeholder: "Si aplica" },
      { key: "fecha_nacimiento", label: "Fecha de Nacimiento", type: "date", required: true },
      { key: "ciudad_nacimiento", label: "Ciudad de Nacimiento", type: "text", required: true },
      { key: "pais_nacimiento", label: "País de Nacimiento", type: "text", required: true },
      { key: "nacionalidad", label: "Nacionalidad actual", type: "text", required: true },
      { key: "otra_nacionalidad", label: "¿Tiene otra nacionalidad?", type: "select", options: ["No", "Sí, por nacimiento", "Sí, por naturalización"], required: true },
      { key: "sexo", label: "Sexo", type: "select", options: ["Masculino", "Femenino"], required: true },
      { key: "estado_civil", label: "Estado Civil", type: "select", options: ["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a", "Unión libre", "Separado/a"], required: true },
      { key: "cedula", label: "Número de Cédula / ID Nacional", type: "text", placeholder: "Si aplica" },
      { key: "nit", label: "NIT / Número Tributario", type: "text", placeholder: "Si aplica" },
      { key: "redes_sociales", label: "Redes sociales que usa (Facebook, Instagram, etc.)", type: "text", placeholder: "Ej: Facebook: juan.lopez / Instagram: @juanlopez" },
    ]
  },
  {
    id: "pasaporte", titulo: "Información del Pasaporte", icono: "🛂",
    campos: [
      { key: "tipo_pasaporte", label: "Tipo de Pasaporte", type: "select", options: ["Regular / Ordinario", "Diplomático", "Oficial", "Otro"], required: true },
      { key: "numero_pasaporte", label: "Número de Pasaporte", type: "text", placeholder: "AB123456", required: true },
      { key: "pais_emisor_pasaporte", label: "País Emisor del Pasaporte", type: "text", required: true },
      { key: "ciudad_emision", label: "Ciudad de Emisión", type: "text", required: true },
      { key: "fecha_emision", label: "Fecha de Emisión", type: "date", required: true },
      { key: "fecha_vencimiento", label: "Fecha de Vencimiento", type: "date", required: true },
      { key: "pasaporte_perdido", label: "¿Ha perdido o le han robado un pasaporte?", type: "select", options: ["No", "Sí"], required: true },
      { key: "pasaporte_perdido_numero", label: "Número del pasaporte perdido/robado", type: "text", placeholder: "Si aplica" },
      { key: "pasaporte_perdido_pais", label: "País del pasaporte perdido/robado", type: "text", placeholder: "Si aplica" },
    ]
  },
  {
    id: "viaje", titulo: "Información del Viaje", icono: "✈️",
    campos: [
      { key: "proposito_viaje", label: "Propósito principal del viaje", type: "select", options: ["Turismo / Placer (B1/B2)", "Negocios (B1)", "Visitar familiares", "Tratamiento médico", "Estudio (curso corto)", "Tránsito", "Otro"], required: true },
      { key: "proposito_detalle", label: "Explique en detalle el propósito", type: "textarea", placeholder: "Describa brevemente qué va a hacer en EE.UU.", required: true },
      { key: "fecha_llegada", label: "Fecha de llegada prevista", type: "date", required: true },
      { key: "duracion_estadia", label: "Duración de la estadía", type: "select", options: ["Menos de 1 semana", "1-2 semanas", "2-4 semanas", "1-2 meses", "2-3 meses", "Más de 3 meses"], required: true },
      { key: "direccion_eeuu", label: "Dirección donde se hospedará en EE.UU.", type: "text", placeholder: "Calle, Ciudad, Estado", required: true },
      { key: "contacto_eeuu_nombre", label: "Nombre del contacto en EE.UU.", type: "text", placeholder: "Hotel, familiar o amigo", required: true },
      { key: "contacto_eeuu_telefono", label: "Teléfono del contacto en EE.UU.", type: "text", placeholder: "+1 305 555 0000" },
      { key: "quien_paga", label: "¿Quién paga los gastos del viaje?", type: "select", options: ["Yo mismo", "Familiar en Honduras", "Familiar en EE.UU.", "Empleador", "Otro"], required: true },
      { key: "viaja_acompanado", label: "¿Viaja acompañado?", type: "select", options: ["No", "Sí, con familiares", "Sí, con amigos", "Sí, con grupo organizado"], required: true },
      { key: "acompanantes", label: "Nombre(s) de acompañante(s)", type: "text", placeholder: "Si aplica" },
    ]
  },
  {
    id: "viajes_anteriores", titulo: "Viajes Anteriores a EE.UU.", icono: "🗺️",
    campos: [
      { key: "ha_viajado_eeuu", label: "¿Ha viajado a EE.UU. anteriormente?", type: "select", options: ["No", "Sí"], required: true },
      { key: "fecha_ultimo_viaje", label: "Fecha del último viaje a EE.UU.", type: "date" },
      { key: "duracion_ultimo_viaje", label: "Duración del último viaje", type: "text", placeholder: "Ej: 2 semanas" },
      { key: "tuvo_visa", label: "¿Ha tenido visa americana antes?", type: "select", options: ["Nunca he aplicado", "Sí, me aprobaron", "Sí, pero venció", "Me negaron la visa"], required: true },
      { key: "numero_visa_anterior", label: "Número de visa anterior", type: "text", placeholder: "Si aplica" },
      { key: "fecha_visa_anterior", label: "Fecha de emisión de visa anterior", type: "date" },
      { key: "visa_cancelada", label: "¿Le han cancelado o revocado una visa?", type: "select", options: ["No", "Sí"], required: true },
      { key: "visa_cancelada_razon", label: "Razón de cancelación", type: "text", placeholder: "Si aplica" },
      { key: "visa_negada", label: "¿Le han negado una visa o entrada a EE.UU.?", type: "select", options: ["No", "Sí"], required: true },
      { key: "visa_negada_razon", label: "¿Cuándo y por qué se la negaron?", type: "text", placeholder: "Si aplica" },
    ]
  },
  {
    id: "familia", titulo: "Información Familiar", icono: "👨‍👩‍👧",
    campos: [
      { key: "nombre_padre", label: "Nombre completo del padre", type: "text", required: true },
      { key: "fecha_nacimiento_padre", label: "Fecha de nacimiento del padre", type: "date" },
      { key: "padre_en_eeuu", label: "¿Está su padre en EE.UU.?", type: "select", options: ["No", "Sí, con estatus legal", "Sí, ciudadano americano", "Sí, sin estatus"], required: true },
      { key: "nombre_madre", label: "Nombre completo de la madre", type: "text", required: true },
      { key: "fecha_nacimiento_madre", label: "Fecha de nacimiento de la madre", type: "date" },
      { key: "madre_en_eeuu", label: "¿Está su madre en EE.UU.?", type: "select", options: ["No", "Sí, con estatus legal", "Sí, ciudadana americana", "Sí, sin estatus"], required: true },
      { key: "nombre_conyuge", label: "Nombre completo del cónyuge", type: "text", placeholder: "Si aplica" },
      { key: "fecha_nacimiento_conyuge", label: "Fecha de nacimiento del cónyuge", type: "date" },
      { key: "nacionalidad_conyuge", label: "Nacionalidad del cónyuge", type: "text", placeholder: "Si aplica" },
      { key: "familiares_eeuu", label: "¿Tiene familiares en EE.UU.?", type: "select", options: ["No", "Sí, con estatus legal", "Sí, ciudadanos americanos", "Sí, sin estatus"], required: true },
      { key: "familiares_eeuu_detalle", label: "Relación y nombres de familiares en EE.UU.", type: "text", placeholder: "Ej: Hermano - Carlos López (ciudadano)" },
    ]
  },
  {
    id: "trabajo", titulo: "Trabajo y Educación", icono: "💼",
    campos: [
      { key: "ocupacion", label: "Ocupación actual", type: "select", options: ["Empleado", "Empleado público", "Trabajador independiente / Freelance", "Empresario / Dueño de negocio", "Estudiante", "Desempleado", "Jubilado", "Ama/o de casa", "Otro"], required: true },
      { key: "empleador", label: "Nombre del empleador o negocio", type: "text", placeholder: "Si aplica", required: true },
      { key: "cargo", label: "Cargo o título del puesto", type: "text", placeholder: "Ej: Contador, Gerente, Docente", required: true },
      { key: "direccion_empleador", label: "Dirección del empleador", type: "text", placeholder: "Ciudad, País" },
      { key: "telefono_empleador", label: "Teléfono del empleador", type: "text", placeholder: "+504 2200-0000" },
      { key: "fecha_inicio_empleo", label: "Fecha de inicio en el empleo actual", type: "date" },
      { key: "salario_mensual", label: "Salario mensual aproximado (Lempiras)", type: "text", placeholder: "Ej: 25,000" },
      { key: "descripcion_trabajo", label: "Describa brevemente sus funciones", type: "textarea", placeholder: "¿Qué hace en su trabajo?" },
      { key: "educacion", label: "Nivel educativo más alto", type: "select", options: ["Primaria", "Secundaria / Bachillerato", "Técnico / Vocacional", "Universidad (incompleta)", "Licenciatura / Ingeniería", "Maestría", "Doctorado"], required: true },
      { key: "institucion_educativa", label: "Institución educativa principal", type: "text", placeholder: "Nombre de universidad o colegio" },
      { key: "idiomas", label: "Idiomas que habla", type: "text", placeholder: "Ej: Español (nativo), Inglés (básico)", required: true },
    ]
  },
  {
    id: "seguridad", titulo: "Preguntas de Seguridad", icono: "🔒",
    campos: [
      { key: "enfermedad_contagiosa", label: "¿Tiene alguna enfermedad contagiosa o comunicable?", type: "select", options: ["No", "Sí"], required: true },
      { key: "trastorno_mental", label: "¿Tiene algún trastorno mental o físico que represente un riesgo para otros?", type: "select", options: ["No", "Sí"], required: true },
      { key: "abuso_drogas", label: "¿Ha abusado de drogas o sustancias controladas?", type: "select", options: ["No", "Sí"], required: true },
      { key: "arrestado", label: "¿Ha sido arrestado o condenado por algún delito?", type: "select", options: ["No", "Sí"], required: true },
      { key: "arrestado_detalle", label: "Explique el delito y la condena", type: "text", placeholder: "Si aplica" },
      { key: "actividad_terrorista", label: "¿Ha participado en actividades terroristas?", type: "select", options: ["No", "Sí"], required: true },
      { key: "genocidio", label: "¿Ha participado en genocidio o torturas?", type: "select", options: ["No", "Sí"], required: true },
      { key: "deportado", label: "¿Ha sido deportado de EE.UU.?", type: "select", options: ["No", "Sí"], required: true },
      { key: "deportado_detalle", label: "Fecha y motivo de deportación", type: "text", placeholder: "Si aplica" },
      { key: "nino_sustraccion", label: "¿Ha sustraído o retenido a un menor fuera de su país de custodia?", type: "select", options: ["No", "Sí"], required: true },
      { key: "fraude_visa", label: "¿Ha intentado obtener una visa mediante fraude?", type: "select", options: ["No", "Sí"], required: true },
    ]
  },
  {
    id: "foto", titulo: "Foto del Solicitante", icono: "📸",
    campos: [] // Manejada por componente especial
  }
];

const TOTAL_SECCIONES = SECCIONES.length;

export default function FormularioCliente() {
  const [seccionActual, setSeccionActual] = useState(0);
  const [datos, setDatos] = useState({});
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoError, setFotoError] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const [errores, setErrores] = useState({});
  const fotoRef = useRef(null);
  const mono = "'JetBrains Mono','Courier New',monospace";

  const handleChange = (key, value) => {
    setDatos(d => ({ ...d, [key]: value }));
    setErrores(e => ({ ...e, [key]: null }));
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    setFotoError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) { setFotoError("El archivo debe ser una imagen (JPG, PNG)."); return; }
    if (file.size > 5 * 1024 * 1024) { setFotoError("La imagen no debe superar 5MB."); return; }
    setFoto(file);
    const reader = new FileReader();
    reader.onload = (ev) => setFotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const validarSeccion = () => {
    const seccion = SECCIONES[seccionActual];
    const nuevosErrores = {};
    seccion.campos.forEach(campo => {
      if (campo.required && !datos[campo.key]) {
        nuevosErrores[campo.key] = "Este campo es obligatorio";
      }
    });
    if (seccion.id === "foto" && !foto) {
      nuevosErrores["foto"] = "La foto es obligatoria";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const siguiente = () => {
    if (validarSeccion()) {
      setSeccionActual(s => Math.min(s + 1, TOTAL_SECCIONES - 1));
      window.scrollTo(0, 0);
    }
  };

  const anterior = () => {
    setSeccionActual(s => Math.max(s - 1, 0));
    window.scrollTo(0, 0);
  };

  const enviar = () => {
    if (validarSeccion()) {
      setEnviado(true);
    }
  };

  const progreso = Math.round((seccionActual / (TOTAL_SECCIONES - 1)) * 100);
  const seccion = SECCIONES[seccionActual];

  if (enviado) {
    return (
      <div style={{ minHeight: "100vh", background: "#020817", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, padding: 24 }}>
        <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
          <div style={{ fontSize: 22, color: "#00ff88", fontWeight: 700, marginBottom: 12 }}>¡Solicitud Enviada!</div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.8, marginBottom: 28 }}>
            Sus datos han sido recibidos correctamente.<br/>
            El equipo de <span style={{ color: "#3b82f6" }}>Visa TrustGlobal</span> procesará su DS-160 y le notificará cuando esté listo.
          </div>
          <div style={{ background: "#070d1a", border: "1px solid #0d2137", borderRadius: 12, padding: "20px 24px", marginBottom: 24 }}>
            <div style={{ fontSize: 10, color: "#334155", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>Resumen del Solicitante</div>
            <div style={{ fontSize: 13, color: "#94a3b8" }}><span style={{ color: "#475569" }}>Nombre: </span>{datos.nombres} {datos.apellidos}</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}><span style={{ color: "#475569" }}>Pasaporte: </span>{datos.numero_pasaporte}</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}><span style={{ color: "#475569" }}>Visa: </span>{datos.proposito_viaje}</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}><span style={{ color: "#475569" }}>Viaje: </span>{datos.fecha_llegada}</div>
          </div>
          {fotoPreview && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <img src={fotoPreview} alt="Foto" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8, border: "2px solid #00ff8840" }} />
            </div>
          )}
          <div style={{ fontSize: 11, color: "#1e3a5f" }}>🇭🇳 Visa TrustGlobal — Catracho ayudando catrachos</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#020817", fontFamily: mono, color: "#e2e8f0" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .campo-input { width:100%; padding:10px 14px; background:#0a1628; border:1.5px solid #1e3a5f; border-radius:8px; color:#e2e8f0; font-size:13px; font-family:inherit; outline:none; transition:border-color .2s; }
        .campo-input:focus { border-color:#3b82f6; }
        .campo-input::placeholder { color:#334155; }
        .campo-select { width:100%; padding:10px 14px; background:#0a1628; border:1.5px solid #1e3a5f; border-radius:8px; color:#e2e8f0; font-size:13px; font-family:inherit; outline:none; cursor:pointer; }
        .campo-select:focus { border-color:#3b82f6; }
        .campo-textarea { width:100%; padding:10px 14px; background:#0a1628; border:1.5px solid #1e3a5f; border-radius:8px; color:#e2e8f0; font-size:13px; font-family:inherit; outline:none; resize:vertical; min-height:80px; }
        .campo-textarea:focus { border-color:#3b82f6; }
        .error-border { border-color:#ef4444 !important; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#0a0f1e} ::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:2px}
      `}</style>

      {/* Header */}
      <div style={{ background: "#070d1a", borderBottom: "1px solid #0d2137", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>🛂</span>
          <div>
            <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 700, letterSpacing: ".04em" }}>VISA TRUSTGLOBAL</div>
            <div style={{ fontSize: 10, color: "#334155" }}>Formulario DS-160 · Solicitud de Visa Americana</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#3b82f6" }}>🇭🇳 Catracho ayudando catrachos</div>
      </div>

      {/* Progress bar */}
      <div style={{ background: "#070d1a", borderBottom: "1px solid #0d2137", padding: "12px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#475569" }}>Sección {seccionActual + 1} de {TOTAL_SECCIONES}: <span style={{ color: "#94a3b8" }}>{seccion.icono} {seccion.titulo}</span></span>
          <span style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700 }}>{progreso}%</span>
        </div>
        <div style={{ height: 4, background: "#0d2137", borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${progreso}%`, background: "linear-gradient(90deg,#1d4ed8,#00ff88)", borderRadius: 2, transition: "width .5s ease" }} />
        </div>
        {/* Sección tabs */}
        <div style={{ display: "flex", gap: 6, marginTop: 12, overflowX: "auto", paddingBottom: 2 }}>
          {SECCIONES.map((s, i) => (
            <div key={s.id} onClick={() => setSeccionActual(i)} style={{ flexShrink: 0, padding: "4px 10px", borderRadius: 20, fontSize: 10, cursor: "pointer", background: i === seccionActual ? "#1e3a5f" : i < seccionActual ? "#00ff8815" : "#0a1628", color: i === seccionActual ? "#60a5fa" : i < seccionActual ? "#00ff88" : "#334155", border: `1px solid ${i === seccionActual ? "#3b82f6" : i < seccionActual ? "#00ff8840" : "#0d2137"}`, transition: "all .2s" }}>
              {s.icono} {s.titulo}
            </div>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 24px", animation: "fadeIn .4s ease" }}>

        {/* Sección de Foto */}
        {seccion.id === "foto" ? (
          <div>
            <h2 style={{ fontSize: 18, color: "#e2e8f0", marginBottom: 6, fontWeight: 700 }}>📸 Foto del Solicitante</h2>
            <p style={{ fontSize: 12, color: "#475569", marginBottom: 24, lineHeight: 1.8 }}>
              La foto debe cumplir los requisitos del Departamento de Estado de EE.UU.:<br/>
              ✓ Fondo blanco o claro · ✓ Rostro visible y centrado · ✓ Sin lentes · ✓ Expresión neutral · ✓ Formato JPG o PNG · ✓ Máximo 5MB
            </p>

            <div
              onClick={() => fotoRef.current.click()}
              style={{ border: `2px dashed ${errores.foto ? "#ef4444" : fotoPreview ? "#00ff88" : "#1e3a5f"}`, borderRadius: 12, padding: "40px 24px", textAlign: "center", cursor: "pointer", background: "#070d1a", transition: "all .2s", marginBottom: 16 }}
            >
              {fotoPreview ? (
                <div>
                  <img src={fotoPreview} alt="Vista previa" style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 8, border: "2px solid #00ff8840", marginBottom: 12 }} />
                  <div style={{ fontSize: 12, color: "#00ff88" }}>✓ Foto cargada correctamente</div>
                  <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>Toca para cambiarla</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📷</div>
                  <div style={{ fontSize: 13, color: "#475569", marginBottom: 6 }}>Toca aquí para subir tu foto</div>
                  <div style={{ fontSize: 11, color: "#334155" }}>JPG, PNG · Máximo 5MB</div>
                </div>
              )}
            </div>

            <input ref={fotoRef} type="file" accept="image/*" onChange={handleFoto} style={{ display: "none" }} />

            {fotoError && <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 12 }}>⚠️ {fotoError}</div>}
            {errores.foto && <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 12 }}>⚠️ {errores.foto}</div>}

            <div style={{ background: "#070d1a", border: "1px solid #0d2137", borderRadius: 10, padding: "16px 20px" }}>
              <div style={{ fontSize: 10, color: "#334155", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>📋 Requisitos oficiales de la foto</div>
              {["Tomada en los últimos 6 meses", "Fondo blanco o de color claro", "Rostro centrado, visible desde frente", "Expresión neutral, boca cerrada", "Sin lentes de ningún tipo", "Sin gorros, sombreros o accesorios en la cabeza (excepto por razones religiosas)", "Tamaño 2x2 pulgadas (51x51mm)", "Alta resolución, enfocada y sin pixelación"].map((r, i) => (
                <div key={i} style={{ fontSize: 11, color: "#475569", marginBottom: 6, display: "flex", gap: 8 }}>
                  <span style={{ color: "#3b82f6", flexShrink: 0 }}>→</span> {r}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: 18, color: "#e2e8f0", marginBottom: 6, fontWeight: 700 }}>
              {seccion.icono} {seccion.titulo}
            </h2>
            <p style={{ fontSize: 12, color: "#475569", marginBottom: 24 }}>
              Los campos marcados con <span style={{ color: "#ef4444" }}>*</span> son obligatorios.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              {seccion.campos.map(campo => (
                <div key={campo.key} style={{ gridColumn: campo.type === "textarea" ? "1 / -1" : "auto" }}>
                  <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>
                    {campo.label} {campo.required && <span style={{ color: "#ef4444" }}>*</span>}
                  </label>

                  {campo.type === "select" ? (
                    <select
                      className={`campo-select ${errores[campo.key] ? "error-border" : ""}`}
                      value={datos[campo.key] || ""}
                      onChange={e => handleChange(campo.key, e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      {campo.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : campo.type === "textarea" ? (
                    <textarea
                      className={`campo-textarea ${errores[campo.key] ? "error-border" : ""}`}
                      placeholder={campo.placeholder}
                      value={datos[campo.key] || ""}
                      onChange={e => handleChange(campo.key, e.target.value)}
                    />
                  ) : (
                    <input
                      type={campo.type}
                      className={`campo-input ${errores[campo.key] ? "error-border" : ""}`}
                      placeholder={campo.placeholder}
                      value={datos[campo.key] || ""}
                      onChange={e => handleChange(campo.key, e.target.value)}
                    />
                  )}

                  {errores[campo.key] && (
                    <div style={{ fontSize: 10, color: "#ef4444", marginTop: 4 }}>⚠️ {errores[campo.key]}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navegación */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 36, paddingTop: 20, borderTop: "1px solid #0d2137" }}>
          <button
            onClick={anterior}
            disabled={seccionActual === 0}
            style={{ padding: "12px 22px", borderRadius: 8, background: seccionActual === 0 ? "#0a1628" : "#1e293b", border: "1px solid #1e3a5f", color: seccionActual === 0 ? "#1e3a5f" : "#94a3b8", fontSize: 12, cursor: seccionActual === 0 ? "not-allowed" : "pointer", fontFamily: mono, transition: "all .2s" }}
          >
            ← Anterior
          </button>

          <div style={{ fontSize: 10, color: "#334155" }}>
            {seccionActual + 1} / {TOTAL_SECCIONES}
          </div>

          {seccionActual < TOTAL_SECCIONES - 1 ? (
            <button
              onClick={siguiente}
              style={{ padding: "12px 28px", borderRadius: 8, background: "linear-gradient(135deg,#1d4ed8,#0ea5e9)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: mono, boxShadow: "0 0 20px #1d4ed840" }}
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={enviar}
              style={{ padding: "12px 28px", borderRadius: 8, background: "linear-gradient(135deg,#166534,#15803d)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: mono, boxShadow: "0 0 20px #15803d40" }}
            >
              ✓ Enviar Solicitud
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "20px", borderTop: "1px solid #0d2137", fontSize: 10, color: "#1e3a5f" }}>
        🔒 Sus datos están protegidos · Visa TrustGlobal · visa-trust-global.web.app
      </div>
    </div>
  );
}
