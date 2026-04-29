import { useState, useEffect, useRef } from "react";

const CLIENT_DATA = {
  "Nombre": "María García López",
  "Pasaporte": "AB123456",
  "Fecha Nacimiento": "15/03/1990",
  "Nacionalidad": "Venezolana",
  "Dirección EE.UU.": "1234 Brickell Ave, Miami FL",
  "Tipo de Visa": "B1/B2 - Turismo",
  "Fecha de Viaje": "15/06/2026",
  "Empleador": "Corporación XYZ",
  "Teléfono": "+58 412 555 0000",
};

const STEPS = [
  { id:1, title:"Abriendo página de la embajada", detail:"Conectando a ceac.state.gov...", duration:1800, log:"→ Iniciando navegador Chrome automatizado\n→ Cargando https://ceac.state.gov/genniv/\n→ Esperando respuesta del servidor...\n✓ Página cargada exitosamente" },
  { id:2, title:"Seleccionando embajada", detail:"Eligiendo sede: Bogotá, Colombia", duration:1200, log:"→ Localizando dropdown de embajadas\n→ Seleccionando: BOGOTA, COLOMBIA\n→ Click en 'Start an Application'\n✓ Embajada seleccionada correctamente" },
  { id:3, title:"Iniciando sesión segura", detail:"Configurando ID de aplicación...", duration:1500, log:"→ Seleccionando pregunta de seguridad\n→ Ingresando respuesta cifrada\n→ Application ID generado: DS160-2026-7749\n✓ Sesión iniciada exitosamente" },
  { id:4, title:"Resolviendo CAPTCHA automáticamente", detail:"Servicio AntiCaptcha procesando...", duration:3800, log:"→ Detectando CAPTCHA tipo reCAPTCHA v2\n→ Enviando imagen a servicio AntiCaptcha\n→ IA analizando patrones visuales...\n→ Token de resolución recibido\n→ Inyectando token en el formulario\n✓ CAPTCHA resuelto en 3.4 segundos", special:"captcha" },
  { id:5, title:"Llenando Información Personal", detail:"Nombre, fecha de nacimiento, nacionalidad...", duration:2200, log:"→ Surname: GARCÍA LÓPEZ\n→ Given Name: MARÍA\n→ Date of Birth: 03/15/1990\n→ Country of Birth: VENEZUELA\n→ Nationality: VENEZUELAN\n→ Sex: FEMALE\n→ Marital Status: SINGLE\n✓ Sección Personal completada", fields:["Apellido","Nombre","Nacimiento","País","Nacionalidad","Sexo"] },
  { id:6, title:"Llenando Información del Pasaporte", detail:"Número, fechas, país emisor...", duration:1600, log:"→ Passport Type: REGULAR/ORDINARY\n→ Passport Number: AB123456\n→ Issuance Date: 10/01/2020\n→ Expiration Date: 10/01/2030\n→ Issuing Country: VENEZUELA\n✓ Sección Pasaporte completada", fields:["Tipo","Número","Emisión","Vencimiento","País"] },
  { id:7, title:"Llenando Información de Viaje", detail:"Propósito, fechas, dirección en EE.UU....", duration:2200, log:"→ Visa Class: B - VISITOR\n→ Purpose: TOURISM/PLEASURE\n→ Arrival Date: 06/15/2026\n→ Length of Stay: 15 DAYS\n→ US Address: 1234 BRICKELL AVE, MIAMI FL\n→ US Contact: HOTEL INTERCONTINENTAL\n✓ Sección Viaje completada", fields:["Visa","Propósito","Llegada","Duración","Dirección"] },
  { id:8, title:"Llenando Información Familiar", detail:"Padres, estado civil, familiares...", duration:1800, log:"→ Father: CARLOS GARCÍA MARTÍNEZ\n→ Mother: ANA LÓPEZ DE GARCÍA\n→ Marital Status: SINGLE\n→ US Relatives: NO\n✓ Sección Familiar completada", fields:["Padre","Madre","Estado civil","Familiares"] },
  { id:9, title:"Llenando Trabajo y Educación", detail:"Empleador, cargo, educación...", duration:2000, log:"→ Occupation: EMPLOYEE\n→ Employer: CORPORACIÓN XYZ C.A.\n→ Job Title: ANALISTA SENIOR\n→ Phone: +58 412 555 0000\n→ Education: UNIVERSIDAD CENTRAL DE VENEZUELA\n✓ Sección Trabajo completada", fields:["Ocupación","Empleador","Cargo","Teléfono","Educación"] },
  { id:10, title:"Respondiendo preguntas de seguridad", detail:"45 preguntas respondidas automáticamente...", duration:1500, log:"→ Communicable Disease: NO\n→ Criminal Record: NO\n→ Terrorist Activity: NO\n→ Drug Abuse: NO\n→ [41 preguntas adicionales]: NO\n✓ Las 45 preguntas respondidas" },
  { id:11, title:"Cargando foto del solicitante", detail:"Verificando requisitos y subiendo...", duration:2000, log:"→ Validando dimensiones: 600x600px ✓\n→ Fondo blanco verificado ✓\n→ Rostro visible confirmado ✓\n→ Subiendo al servidor de la embajada...\n✓ Foto cargada exitosamente" },
  { id:12, title:"Revisando y enviando formulario", detail:"Verificación final y envío...", duration:2500, log:"→ Verificando campos obligatorios: OK\n→ Revisando coherencia de datos: OK\n→ Click en 'Sign Application'\n→ Click en 'Submit Application'\n→ Procesando en servidor de la embajada...\n✓ DS-160 enviado exitosamente" },
  { id:13, title:"Generando confirmación y PDF", detail:"Capturando barcode y documento final...", duration:1800, log:"→ Capturando página de confirmación\n→ Application ID: AA00123456\n→ Barcode generado correctamente\n→ Compilando PDF completo\n→ Guardando en expediente del cliente\n✓ DS-160 COMPLETADO — PDF LISTO", special:"success" },
];

const SYSTEM_PROMPT = `Eres Carlos Membreño, asesor experto en visas americanas con 15 años de experiencia ayudando a personas de Latinoamérica. Hablas como un profesional cercano — cálido, directo, honesto, nunca robótico. Conoces la realidad del solicitante latinoamericano: sus miedos, sus sueños, sus circunstancias.

Cuando recibes los datos de un cliente, generas un análisis COMPLETO en formato JSON. Responde SOLO el JSON, sin texto adicional, sin backticks:

{
  "nombre": "nombre del cliente",
  "porcentaje": número del 0 al 100,
  "categoria": "ALTO RIESGO" | "RIESGO MEDIO" | "BUEN PERFIL" | "PERFIL SÓLIDO",
  "color_categoria": "red" | "orange" | "blue" | "green",
  "mensaje_personal": "Mensaje cálido y directo al cliente por su nombre, como conversación real. 2-3 oraciones. Honesto pero alentador.",
  "fortalezas": [
    {"titulo": "título corto", "detalle": "explicación específica para este cliente"}
  ],
  "puntos_debiles": [
    {"titulo": "título corto", "detalle": "explicación y qué hacer al respecto"}
  ],
  "semaforo": [
    {"area": "Estabilidad Laboral", "estado": "verde" | "amarillo" | "rojo", "nota": "nota breve"},
    {"area": "Vínculos en el País", "estado": "verde" | "amarillo" | "rojo", "nota": "nota breve"},
    {"area": "Historial de Viajes", "estado": "verde" | "amarillo" | "rojo", "nota": "nota breve"},
    {"area": "Situación Económica", "estado": "verde" | "amarillo" | "rojo", "nota": "nota breve"},
    {"area": "Propósito del Viaje", "estado": "verde" | "amarillo" | "rojo", "nota": "nota breve"},
    {"area": "Antecedentes", "estado": "verde" | "amarillo" | "rojo", "nota": "nota breve"}
  ],
  "preguntas_probables": [
    {"pregunta": "pregunta que hará el cónsul", "como_responder": "cómo responderla según el perfil de este cliente"}
  ],
  "documentos_recomendados": [
    {"documento": "nombre del documento", "razon": "por qué este cliente específicamente lo necesita"}
  ],
  "consejo_final": "Un consejo poderoso y personal para la entrevista. Honesto. Como lo diría un amigo experto."
}

Sé específico con los datos del cliente. No uses respuestas genéricas.`;

function PDFView({ onClose }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  const timeStr = now.toISOString().replace('T',' ').substring(0,19) + ' UTC';

  const Row = ({label, value}) => (
    <div style={{display:"flex",borderBottom:"1px solid #e2e8f0"}}>
      <div style={{width:195,flexShrink:0,background:"#f7fafc",padding:"5px 10px",fontSize:8,fontWeight:"bold",color:"#4a5568",borderRight:"1px solid #e2e8f0"}}>{label}</div>
      <div style={{flex:1,padding:"5px 10px",fontSize:9,color:"#1a202c"}}>{value}</div>
    </div>
  );
  const SH = ({title}) => (
    <div style={{background:"#1a365d",color:"white",fontWeight:"bold",fontSize:9,padding:"6px 10px",marginTop:10,letterSpacing:".05em"}}>{title}</div>
  );

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(2,8,23,.92)",zIndex:100,display:"flex",flexDirection:"column",alignItems:"center",padding:"16px",overflowY:"auto"}}>
      <div style={{width:"100%",maxWidth:760,display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:16}}>📄</span>
          <span style={{color:"#94a3b8",fontSize:12,fontFamily:"monospace"}}>DS160_MariaGarcia_AA00123456.pdf</span>
        </div>
        <button onClick={onClose} style={{padding:"8px 16px",background:"#1e293b",color:"#94a3b8",border:"1px solid #334155",borderRadius:6,fontSize:12,cursor:"pointer"}}>✕ Cerrar</button>
      </div>
      <div style={{background:"white",width:"100%",maxWidth:760,padding:"30px 36px",borderRadius:4,boxShadow:"0 8px 60px rgba(0,0,0,.6)",fontFamily:"Arial,sans-serif",color:"#1a202c"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"3px solid #1a365d",paddingBottom:12,marginBottom:14}}>
          <div style={{fontSize:9,fontWeight:"bold",color:"#1a365d",lineHeight:1.7}}>U.S. DEPARTMENT OF STATE<br/>BUREAU OF CONSULAR AFFAIRS</div>
          <div style={{textAlign:"center"}}><div style={{fontSize:34}}>🦅</div><div style={{fontSize:7,color:"#4a5568",marginTop:2,letterSpacing:".05em"}}>OFFICIAL DOCUMENT</div></div>
          <div style={{fontSize:9,fontWeight:"bold",color:"#1a365d",textAlign:"right",lineHeight:1.7}}>CONSULAR ELECTRONIC<br/>APPLICATION CENTER</div>
        </div>
        <div style={{textAlign:"center",fontSize:15,fontWeight:"bold",color:"#1a365d",marginBottom:4}}>DS-160 ONLINE NONIMMIGRANT VISA APPLICATION</div>
        <div style={{textAlign:"center",fontSize:10,color:"#2c5282",marginBottom:16,letterSpacing:".06em"}}>CONFIRMATION PAGE — PÁGINA DE CONFIRMACIÓN</div>
        <div style={{display:"flex",border:"2px solid #48bb78",background:"#f0fff4",borderRadius:4,marginBottom:14,overflow:"hidden"}}>
          {[["APPLICATION ID","AA00123456","#1a365d",16],["DATE SUBMITTED",dateStr,"#1a365d",10],["STATUS","SUBMITTED ✓","#276749",13],["EMBASSY","BOGOTÁ, COL","#1a365d",11]].map(([l,v,c,fs])=>(
            <div key={l} style={{flex:1,textAlign:"center",padding:"10px 6px",borderRight:"1px solid #c6f6d5"}}>
              <div style={{fontSize:8,fontWeight:"bold",color:"#276749",marginBottom:5,textTransform:"uppercase",letterSpacing:".05em"}}>{l}</div>
              <div style={{fontSize:fs,fontWeight:"bold",color:c}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{border:"1px solid #e2e8f0",background:"#f7fafc",padding:"10px 14px",textAlign:"center",marginBottom:14,borderRadius:4}}>
          <div style={{fontSize:7,fontWeight:"bold",color:"#4a5568",marginBottom:8,textTransform:"uppercase",letterSpacing:".1em"}}>BARCODE — Presente esta página en su entrevista</div>
          <div style={{fontFamily:"'Courier New',monospace",fontSize:22,letterSpacing:5,color:"#000",lineHeight:1}}>||| || |||| | ||| |||| || ||| | |||||| || ||| | |||| ||| ||</div>
          <div style={{fontSize:8,color:"#718096",marginTop:8,letterSpacing:".04em"}}>AA00123456 · DS-160 · BOGOTA, COLOMBIA · {dateStr}</div>
        </div>
        <SH title="PERSONAL INFORMATION / INFORMACIÓN PERSONAL"/>
        <Row label="Surname / Apellido(s)" value="GARCÍA LÓPEZ"/>
        <Row label="Given Name / Nombre(s)" value="MARÍA"/>
        <Row label="Date of Birth / Fecha Nacimiento" value="March 15, 1990"/>
        <Row label="Country of Birth / País Nacimiento" value="VENEZUELA"/>
        <Row label="Nationality / Nacionalidad" value="VENEZUELAN"/>
        <Row label="Sex / Sexo" value="FEMALE"/>
        <Row label="Marital Status / Estado Civil" value="SINGLE"/>
        <SH title="PASSPORT INFORMATION / INFORMACIÓN DEL PASAPORTE"/>
        <Row label="Passport Number / Número" value="AB123456"/>
        <Row label="Date of Issuance / Fecha Emisión" value="October 01, 2020"/>
        <Row label="Expiration Date / Vencimiento" value="October 01, 2030"/>
        <Row label="Issuing Country / País Emisor" value="VENEZUELA"/>
        <SH title="TRAVEL INFORMATION / INFORMACIÓN DEL VIAJE"/>
        <Row label="Purpose of Trip / Propósito" value="TOURISM / PLEASURE (B1/B2)"/>
        <Row label="Intended Date of Arrival" value="June 15, 2026"/>
        <Row label="Length of Stay / Duración" value="15 DAYS"/>
        <Row label="US Address / Dirección EE.UU." value="1234 BRICKELL AVE, MIAMI, FL 33131"/>
        <SH title="WORK & EDUCATION / TRABAJO Y EDUCACIÓN"/>
        <Row label="Occupation / Ocupación" value="EMPLOYEE / EMPLEADO"/>
        <Row label="Employer / Empleador" value="CORPORACIÓN XYZ, C.A."/>
        <Row label="Job Title / Cargo" value="ANALISTA SENIOR"/>
        <SH title="SECURITY QUESTIONS / PREGUNTAS DE SEGURIDAD"/>
        <Row label="All Security Questions (45)" value="NO"/>
        <div style={{background:"#fffbeb",border:"1px solid #d69e2e",padding:"12px 14px",margin:"14px 0 12px",borderRadius:4,fontSize:8,color:"#744210",lineHeight:1.8}}>
          <strong>⚠️ IMPORTANTE:</strong> Debe presentar esta página en su cita de entrevista. El código de barras debe poder escanearse.
        </div>
        <div style={{background:"#f0f9ff",border:"1px solid #bae6fd",padding:"10px 14px",borderRadius:4,marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:10,fontWeight:"bold",color:"#0c4a6e"}}>🛂 Visa TrustGlobal</div>
            <div style={{fontSize:8,color:"#0369a1",marginTop:2}}>Catracho ayudando catrachos 🇭🇳</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:8,color:"#0369a1"}}>visa-trust-global.web.app</div>
            <div style={{fontSize:7,color:"#7dd3fc",marginTop:2}}>Generado por Bot Engine v2.4</div>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid #e2e8f0",paddingTop:8,fontSize:7,color:"#a0aec0"}}>
          <span>Visa TrustGlobal Bot Engine v2.4</span>
          <span>{timeStr}</span>
          <span>ceac.state.gov — U.S. Department of State</span>
        </div>
      </div>
      <div style={{height:24}}/>
    </div>
  );
}

function AnalisisIA({ onClose }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const mono = "'JetBrains Mono','Courier New',monospace";

  useEffect(() => {
    const analyze = async () => {
      try {
        const userMessage = `Analiza este cliente para visa americana:
Nombre: ${CLIENT_DATA["Nombre"]}
Nacionalidad: ${CLIENT_DATA["Nacionalidad"]}
Tipo de Visa: ${CLIENT_DATA["Tipo de Visa"]}
Empleador: ${CLIENT_DATA["Empleador"]}
Dirección EE.UU.: ${CLIENT_DATA["Dirección EE.UU."]}
Fecha de Viaje: ${CLIENT_DATA["Fecha de Viaje"]}
Teléfono: ${CLIENT_DATA["Teléfono"]}`;

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: userMessage }]
          })
        });
        const data = await response.json();
        const text = data.content.map(i => i.text || "").join("");
        const clean = text.replace(/```json|```/g, "").trim();
        setResult(JSON.parse(clean));
      } catch (e) {
        setError("Error generando análisis. Intenta de nuevo.");
      }
      setLoading(false);
    };
    analyze();
  }, []);

  const semaforoEmoji = { verde: "🟢", amarillo: "🟡", rojo: "🔴" };
  const catColor = { red: "#ef4444", orange: "#f59e0b", blue: "#3b82f6", green: "#00ff88" };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(2,8,23,.96)",zIndex:100,display:"flex",flexDirection:"column",fontFamily:mono,overflowY:"auto"}}>
      {/* Header */}
      <div style={{background:"#070d1a",borderBottom:"1px solid #0d2137",padding:"13px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:13,color:"#3b82f6",letterSpacing:".05em"}}>🧠 ANÁLISIS IA — PROBABILIDAD DE APROBACIÓN</span>
        </div>
        <button onClick={onClose} style={{padding:"8px 16px",background:"#1e293b",color:"#94a3b8",border:"1px solid #334155",borderRadius:6,fontSize:12,cursor:"pointer",fontFamily:mono}}>✕ Cerrar</button>
      </div>

      <div style={{padding:"24px",maxWidth:860,margin:"0 auto",width:"100%"}}>
        {loading && (
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{width:48,height:48,border:"3px solid #1e3a5f",borderTopColor:"#3b82f6",borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 20px"}}/>
            <div style={{color:"#475569",fontSize:13}}>Carlos está analizando el perfil completo...</div>
            <div style={{color:"#334155",fontSize:11,marginTop:8}}>Evaluando vínculos, estabilidad, propósito del viaje...</div>
          </div>
        )}

        {error && <div style={{color:"#ef4444",textAlign:"center",padding:"40px"}}>{error}</div>}

        {result && (
          <div>
            {/* Porcentaje */}
            <div style={{background:"#070d1a",border:"1px solid #0d2137",borderRadius:12,padding:"28px",marginBottom:16,display:"flex",alignItems:"center",gap:28,flexWrap:"wrap"}}>
              <div style={{position:"relative",flexShrink:0}}>
                <svg width="130" height="130" viewBox="0 0 130 130">
                  <circle cx="65" cy="65" r="55" fill="none" stroke="#0d2137" strokeWidth="10"/>
                  <circle cx="65" cy="65" r="55" fill="none"
                    stroke={catColor[result.color_categoria] || "#3b82f6"}
                    strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${(result.porcentaje/100)*346} 346`}
                    transform="rotate(-90 65 65)"/>
                </svg>
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
                  <div style={{fontSize:32,fontWeight:900,color:"#e2e8f0",lineHeight:1}}>{result.porcentaje}%</div>
                  <div style={{fontSize:9,color:"#475569"}}>prob.</div>
                </div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:"#475569",marginBottom:6,textTransform:"uppercase",letterSpacing:".08em"}}>Perfil: {result.nombre}</div>
                <div style={{display:"inline-block",padding:"4px 14px",borderRadius:20,background:catColor[result.color_categoria]+"20",border:`1px solid ${catColor[result.color_categoria]}50`,color:catColor[result.color_categoria],fontSize:11,fontWeight:700,marginBottom:12}}>
                  {result.categoria}
                </div>
                <div style={{background:"#0a1628",border:"1px solid #1e3a5f",borderLeft:`3px solid #3b82f6`,borderRadius:6,padding:"12px 16px"}}>
                  <div style={{fontSize:9,color:"#3b82f6",marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"}}>— Carlos Membreño, Asesor Visa TrustGlobal</div>
                  <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.8,fontStyle:"italic"}}>"{result.mensaje_personal}"</div>
                </div>
              </div>
            </div>

            {/* Semáforo */}
            <div style={{background:"#070d1a",border:"1px solid #0d2137",borderRadius:12,padding:"20px",marginBottom:16}}>
              <div style={{fontSize:10,color:"#475569",textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>🚦 Evaluación por Área</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
                {result.semaforo.map((item,i) => (
                  <div key={i} style={{background:"#0a1628",border:"1px solid #0d2137",borderRadius:8,padding:"10px 12px",display:"flex",gap:10,alignItems:"flex-start"}}>
                    <span style={{fontSize:16,marginTop:1}}>{semaforoEmoji[item.estado]}</span>
                    <div>
                      <div style={{fontSize:10,color:"#94a3b8",fontWeight:700}}>{item.area}</div>
                      <div style={{fontSize:9,color:"#475569",marginTop:3,lineHeight:1.5}}>{item.nota}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fortalezas y Debilidades */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              <div style={{background:"#070d1a",border:"1px solid #00ff8830",borderRadius:12,padding:"20px"}}>
                <div style={{fontSize:10,color:"#00ff88",textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>✅ Fortalezas</div>
                {result.fortalezas.map((f,i) => (
                  <div key={i} style={{marginBottom:12,paddingBottom:12,borderBottom:i<result.fortalezas.length-1?"1px solid #0d2137":"none"}}>
                    <div style={{fontSize:10,color:"#4ade80",fontWeight:700,marginBottom:3}}>{f.titulo}</div>
                    <div style={{fontSize:9,color:"#475569",lineHeight:1.6}}>{f.detalle}</div>
                  </div>
                ))}
              </div>
              <div style={{background:"#070d1a",border:"1px solid #ef444430",borderRadius:12,padding:"20px"}}>
                <div style={{fontSize:10,color:"#ef4444",textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>⚠️ Puntos a Mejorar</div>
                {result.puntos_debiles.map((p,i) => (
                  <div key={i} style={{marginBottom:12,paddingBottom:12,borderBottom:i<result.puntos_debiles.length-1?"1px solid #0d2137":"none"}}>
                    <div style={{fontSize:10,color:"#f87171",fontWeight:700,marginBottom:3}}>{p.titulo}</div>
                    <div style={{fontSize:9,color:"#475569",lineHeight:1.6}}>{p.detalle}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preguntas probables */}
            <div style={{background:"#070d1a",border:"1px solid #0d2137",borderRadius:12,padding:"20px",marginBottom:16}}>
              <div style={{fontSize:10,color:"#475569",textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>🎯 Preguntas Probables del Cónsul</div>
              {result.preguntas_probables.map((p,i) => (
                <div key={i} style={{background:"#0a1628",border:"1px solid #1e293b",borderLeft:"3px solid #3b82f6",borderRadius:8,padding:"14px",marginBottom:10}}>
                  <div style={{fontSize:11,color:"#e2e8f0",marginBottom:8}}>🗣 "{p.pregunta}"</div>
                  <div style={{fontSize:9,color:"#475569",lineHeight:1.7}}><span style={{color:"#3b82f6",fontWeight:700}}>→ Cómo responder: </span>{p.como_responder}</div>
                </div>
              ))}
            </div>

            {/* Documentos */}
            <div style={{background:"#070d1a",border:"1px solid #0d2137",borderRadius:12,padding:"20px",marginBottom:16}}>
              <div style={{fontSize:10,color:"#475569",textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>📋 Documentos Recomendados para Su Caso</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
                {result.documentos_recomendados.map((d,i) => (
                  <div key={i} style={{background:"#0a1628",border:"1px solid #1e3a5f",borderRadius:8,padding:"12px"}}>
                    <div style={{fontSize:10,color:"#60a5fa",fontWeight:700,marginBottom:4}}>📄 {d.documento}</div>
                    <div style={{fontSize:9,color:"#475569",lineHeight:1.5}}>{d.razon}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consejo final */}
            <div style={{background:"linear-gradient(135deg,#071428,#0a1e3d)",border:"1px solid #1e3a5f",borderRadius:12,padding:"24px",marginBottom:24}}>
              <div style={{fontSize:10,color:"#3b82f6",textTransform:"uppercase",letterSpacing:".08em",marginBottom:12}}>💡 Consejo Final de Carlos</div>
              <div style={{fontSize:13,color:"#94a3b8",lineHeight:1.9,fontStyle:"italic"}}>"{result.consejo_final}"</div>
              <div style={{marginTop:12,fontSize:10,color:"#1e40af"}}>— Carlos Membreño · Visa TrustGlobal 🇭🇳</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BotDemo() {
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [logs, setLogs] = useState([]);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [captchaAnim, setCaptchaAnim] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [showAnalisis, setShowAnalisis] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const runBot = async () => {
    setRunning(true); setCurrentStep(-1); setCompletedSteps([]);
    setLogs([]); setDone(false); setProgress(0); setShowPDF(false);

    for (let i = 0; i < STEPS.length; i++) {
      const step = STEPS[i];
      setCurrentStep(i);
      if (step.special === "captcha") setCaptchaAnim(true);
      const lines = step.log.split("\n");
      for (const line of lines) {
        await sleep(step.duration / lines.length);
        setLogs(p => [...p, { text: line, stepId: step.id }]);
      }
      if (step.special === "captcha") setCaptchaAnim(false);
      setCompletedSteps(p => [...p, i]);
      setProgress(Math.round(((i+1)/STEPS.length)*100));
      await sleep(100);
    }
    setCurrentStep(-1); setDone(true); setRunning(false);
  };

  const reset = () => {
    setRunning(false); setCurrentStep(-1); setCompletedSteps([]);
    setLogs([]); setDone(false); setProgress(0);
    setCaptchaAnim(false); setShowPDF(false); setShowAnalisis(false);
  };

  const mono = "'JetBrains Mono','Courier New',monospace";

  return (
    <div style={{fontFamily:mono,background:"#020817",minHeight:"100vh",color:"#e2e8f0",display:"flex",flexDirection:"column"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes scanline{0%{top:0}100%{top:100%}}
        @keyframes blink{0%,49%,100%{opacity:1}50%,99%{opacity:0}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 6px #00ff8840}50%{box-shadow:0 0 22px #00ff8880}}
        @keyframes pdfGlow{0%,100%{box-shadow:0 0 8px #15803d40}50%{box-shadow:0 0 20px #15803d90}}
        @keyframes iaGlow{0%,100%{box-shadow:0 0 8px #1d4ed840}50%{box-shadow:0 0 20px #3b82f690}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#0a0f1e}
        ::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:2px}
      `}</style>

      {showPDF && <PDFView onClose={() => setShowPDF(false)} />}
      {showAnalisis && <AnalisisIA onClose={() => setShowAnalisis(false)} />}

      {/* Header */}
      <div style={{background:"#070d1a",borderBottom:"1px solid #0d2137",padding:"13px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:9,height:9,borderRadius:"50%",background:running||done?"#00ff88":"#334155",animation:running?"pulse 1s infinite":"none",boxShadow:(running||done)?"0 0 10px #00ff88":"none"}}/>
          <span style={{fontSize:13,color:"#475569",letterSpacing:".05em"}}>VISA TRUSTGLOBAL</span>
          <span style={{color:"#1e293b",fontSize:18}}>|</span>
          <span style={{fontSize:12,color:"#3b82f6"}}>DS-160 BOT ENGINE v2.4</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {running && <div style={{fontSize:11,color:"#00ff88",animation:"pulse 1.5s infinite"}}>● EN EJECUCIÓN</div>}
          {done && <div style={{fontSize:11,color:"#00ff88"}}>● COMPLETADO</div>}
        </div>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden",height:"calc(100vh - 50px)"}}>
        {/* Left panel */}
        <div style={{width:290,borderRight:"1px solid #0d2137",display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0}}>
          <div style={{padding:14,borderBottom:"1px solid #0d2137",background:"#070d1a"}}>
            <div style={{fontSize:9,color:"#334155",textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>📋 DATOS DEL CLIENTE</div>
            {Object.entries(CLIENT_DATA).map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:6,gap:8}}>
                <span style={{fontSize:9,color:"#475569",flexShrink:0}}>{k}</span>
                <span style={{fontSize:9,color:"#94a3b8",textAlign:"right"}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{padding:"10px 14px",borderBottom:"1px solid #0d2137"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:9,color:"#475569"}}>PROGRESO</span>
              <span style={{fontSize:9,color:"#3b82f6",fontWeight:700}}>{progress}%</span>
            </div>
            <div style={{height:4,background:"#0d2137",borderRadius:2}}>
              <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#1d4ed8,#00ff88)",borderRadius:2,transition:"width .4s ease",boxShadow:progress>0?"0 0 8px #00ff8860":"none"}}/>
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"6px 0"}}>
            {STEPS.map((step,i)=>{
              const isActive = currentStep===i;
              const isDone = completedSteps.includes(i);
              return (
                <div key={step.id} style={{padding:"7px 13px",display:"flex",alignItems:"center",gap:9,background:isActive?"#071428":"transparent",borderLeft:isActive?"2px solid #3b82f6":"2px solid transparent",transition:"all .2s"}}>
                  <div style={{width:19,height:19,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,background:isDone?"#00ff8820":isActive?"#1d4ed820":"#0d2137",border:`1px solid ${isDone?"#00ff88":isActive?"#3b82f6":"#1e293b"}`,color:isDone?"#00ff88":isActive?"#60a5fa":"#334155",fontWeight:700,animation:isActive?"pulse 1s infinite":"none"}}>
                    {isDone?"✓":isActive?"●":step.id}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:10,color:isDone?"#64748b":isActive?"#e2e8f0":"#475569",fontWeight:isActive?700:400,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{step.title}</div>
                    {isActive&&<div style={{fontSize:8,color:"#3b82f6",marginTop:2,animation:"pulse 1.5s infinite"}}>{step.detail}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{height:185,borderBottom:"1px solid #0d2137",background:"#070d1a",position:"relative",overflow:"hidden",flexShrink:0}}>
            <div style={{background:"#0a1628",padding:"7px 12px",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid #0d2137"}}>
              <div style={{display:"flex",gap:4}}>
                {["#ff5f57","#ffbd2e","#28c840"].map((c,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:c,opacity:.8}}/>)}
              </div>
              <div style={{flex:1,background:"#050a14",borderRadius:4,padding:"3px 12px",fontSize:9,color:"#475569",display:"flex",alignItems:"center",gap:6}}>
                <span style={{color:"#22c55e",fontSize:10}}>🔒</span> ceac.state.gov/genniv/
              </div>
            </div>
            <div style={{padding:"12px 16px",position:"relative",height:"calc(100% - 36px)"}}>
              {running&&<div style={{position:"absolute",left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#3b82f660,transparent)",animation:"scanline 2s linear infinite",zIndex:2}}/>}
              <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:"#0d2137",border:"1px solid #1e3a5f",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🦅</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:10,color:"#64748b",marginBottom:2}}>U.S. DEPARTMENT OF STATE — BUREAU OF CONSULAR AFFAIRS</div>
                  <div style={{fontSize:12,color:"#94a3b8",fontWeight:700,marginBottom:10}}>DS-160: Online Nonimmigrant Visa Application</div>
                  {currentStep>=4&&currentStep<=10&&STEPS[currentStep]?.fields&&(
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {STEPS[currentStep].fields.map((f,i)=>(
                        <div key={i} style={{padding:"3px 8px",borderRadius:3,background:"#071428",border:"1px solid #1d4ed8",fontSize:9,color:"#60a5fa",animation:"slideIn .3s ease",animationFillMode:"both",animationDelay:`${i*0.08}s`}}>✓ {f}</div>
                      ))}
                    </div>
                  )}
                  {captchaAnim&&(
                    <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"#0a1628",border:"1px solid #334155",borderRadius:6,width:"fit-content"}}>
                      <div style={{width:14,height:14,border:"2px solid #3b82f6",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
                      <span style={{fontSize:9,color:"#64748b"}}>Resolviendo reCAPTCHA...</span>
                      <span style={{fontSize:9,color:"#00ff88",fontWeight:700,animation:"pulse 1s infinite"}}>IA procesando</span>
                    </div>
                  )}
                  {done&&(
                    <div style={{padding:"8px 14px",background:"#00ff8810",border:"1px solid #00ff8840",borderRadius:6,animation:"glow 2s infinite"}}>
                      <div style={{fontSize:11,color:"#00ff88",fontWeight:700}}>✅ APPLICATION SUBMITTED — ID: AA00123456</div>
                      <div style={{fontSize:9,color:"#64748b",marginTop:3}}>PDF generado · Análisis IA disponible</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Terminal */}
          <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
            <div style={{padding:"5px 14px",background:"#0a1628",borderBottom:"1px solid #0d2137",fontSize:9,color:"#334155",display:"flex",gap:14,alignItems:"center"}}>
              <span style={{color:"#00ff88",fontWeight:700}}>● TERMINAL</span>
              <span>bot.log</span>
              <span>ds160.session</span>
              {done&&<span style={{marginLeft:"auto",color:"#00ff88",fontSize:9}}>✓ Completado en ~{(STEPS.reduce((a,s)=>a+s.duration,0)/1000).toFixed(0)}s</span>}
            </div>
            <div ref={logRef} style={{flex:1,overflowY:"auto",padding:"10px 16px",fontFamily:mono,fontSize:11,lineHeight:1.9,background:"#020817"}}>
              {logs.length===0&&!running&&!done&&(
                <div style={{color:"#1e3a5f"}}>$ Listo. Presiona EJECUTAR BOT para iniciar...<span style={{animation:"blink 1s infinite"}}>_</span></div>
              )}
              {logs.map((log,i)=>(
                <div key={i} style={{color:log.text.startsWith("✓")?"#00ff88":log.text.startsWith("→")?"#475569":"#94a3b8",animation:"slideIn .15s ease"}}>{log.text}</div>
              ))}
              {running&&<div style={{color:"#3b82f6"}}><span style={{animation:"blink 1s infinite"}}>▊</span></div>}
            </div>
          </div>

          {/* Action bar */}
          <div style={{padding:"14px 18px",borderTop:"1px solid #0d2137",background:"#070d1a",display:"flex",alignItems:"center",gap:10,flexShrink:0,flexWrap:"wrap"}}>
            {!running&&!done&&(
              <button onClick={runBot} style={{padding:"12px 28px",borderRadius:7,background:"linear-gradient(135deg,#1d4ed8,#0ea5e9)",border:"none",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:mono,boxShadow:"0 0 24px #1d4ed850",letterSpacing:".04em"}}>
                ▶ EJECUTAR BOT · GENERAR DS-160
              </button>
            )}
            {running&&(
              <div style={{padding:"12px 22px",borderRadius:7,background:"#0a1628",border:"1px solid #1e3a5f",fontSize:12,color:"#475569",display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:13,height:13,border:"2px solid #3b82f6",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
                Procesando DS-160... paso {currentStep+1} de {STEPS.length}
              </div>
            )}
            {done&&(
              <>
                <div style={{padding:"10px 14px",borderRadius:7,background:"#00ff8812",border:"1px solid #00ff8840",fontSize:11,color:"#00ff88",fontWeight:700,animation:"glow 2s infinite"}}>
                  ✓ DS-160 · AA00123456
                </div>
                <button onClick={()=>setShowPDF(true)} style={{padding:"12px 22px",borderRadius:7,background:"linear-gradient(135deg,#166534,#15803d)",border:"none",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:mono,animation:"pdfGlow 2s infinite",letterSpacing:".03em"}}>
                  📄 VER PDF
                </button>
                <button onClick={()=>setShowAnalisis(true)} style={{padding:"12px 22px",borderRadius:7,background:"linear-gradient(135deg,#1e3a8a,#1d4ed8)",border:"none",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:mono,animation:"iaGlow 2s infinite",letterSpacing:".03em"}}>
                  🧠 ANÁLISIS IA
                </button>
                <button onClick={reset} style={{padding:"12px 16px",borderRadius:7,background:"#071428",border:"1px solid #1e3a5f",color:"#64748b",fontSize:11,cursor:"pointer",fontFamily:mono}}>
                  ↺ Nueva solicitud
                </button>
              </>
            )}
            <div style={{marginLeft:"auto",fontSize:9,color:"#1e293b"}}>
              {running?`Paso ${currentStep+1}/${STEPS.length}`:done?"Completado":"Listo"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
