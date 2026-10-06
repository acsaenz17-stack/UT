// Configuración del bot de justificaciones
// Prof. M.N. Alejandro Castañeda Sáenz
// Tutor SCM11, SCM41 y NTM41

module.exports = {
  // Base de datos de materias y correos por grupo
  materiasPorGrupo: {
    SCM11: {
      'Fundamentos matemáticos': 'lorenzo_barraza@utcj.edu.mx',
      'Mediciones eléctricas': 'axel_tellez@utcj.edu.mx',
      'Desarrollo humano y valores': 'joana_sandoval@utcj.edu.mx',
      'Metodología de la programación': 'esau_reyes@utcj.edu.mx',
      'Comunicación y habilidades digitales': 'karely_gonzalez@utcj.edu.mx',
      'Ingles 1': 'alan_pereyra@utcj.edu.mx'
    },
    SCM41: {
      'Electrónica analógica': 'belem_garcia@utcj.edu.mx',
      'Cálculo de varias variables': 'joaquin_godoy@utcj.edu.mx',
      'Ingles 4': 'christian_grado@utcj.edu.mx',
      'Manufactura microelectrónica': 'miguel_paz@utcj.edu.mx',
      'Sistemas digitales': 'deisy_rivas@utcj.edu.mx',
      'Mantenimiento y seguridad industrial': 'maria_rocha@utcj.edu.mx',
      'Ética profesional': 'flor_valadez@utcj.edu.mx'
    },
    NTM41: {
      'Nanobiología': 'mariana_armenta@utcj.edu.mx',
      'Ingles 4': 'elideth_delatorre@utcj.edu.mx',
      'Ética profesional': 'gregoria_garcia@utcj.edu.mx',
      'Cálculo de varias variables': 'aracely_lom@utcj.edu.mx',
      'Incorporación de materiales': 'miguel_paz@utcj.edu.mx',
      'Electroquímica': 'maricruz_rocha@utcj.edu.mx',
      'Óptica': 'alejandro_castaneda@utcj.edu.mx'
    }
  },

  // Lista de todas las materias disponibles (para validación)
  todasLasMaterias: [
    'Fundamentos matemáticos',
    'Mediciones eléctricas',
    'Desarrollo humano y valores',
    'Metodología de la programación',
    'Comunicación y habilidades digitales',
    'Ingles 1',
    'Electrónica analógica',
    'Cálculo de varias variables',
    'Ingles 4',
    'Manufactura microelectrónica',
    'Sistemas digitales',
    'Mantenimiento y seguridad industrial',
    'Ética profesional',
    'Nanobiología',
    'Incorporación de materiales',
    'Electroquímica',
    'Óptica'
  ],

  // Lista de grupos válidos
  gruposValidos: ['SCM11', 'SCM41', 'NTM41'],

  // Mensajes del bot
  mensajes: {
    bienvenida: `🤖 *Bot de Justificaciones - Prof. Alejandro Castañeda*

Hola, soy el bot automático para justificar ausencias.

Para comenzar, por favor escribe: *inicio*`,

    inicio: `📝 *Proceso de Justificación*

Voy a guiarte paso a paso.

*Paso 1:* ¿A qué grupo perteneces?
Escribe: SCM11, SCM41 o NTM41`,

    pedirMateria: (grupo) => `✅ Grupo: *${grupo}*

*Paso 2:* ¿Qué materia?

Escribe el nombre completo de la materia:
${grupo === 'SCM11' ? `
• Fundamentos matemáticos
• Mediciones eléctricas
• Desarrollo humano y valores
• Metodología de la programación
• Comunicación y habilidades digitales
• Ingles 1` : grupo === 'SCM41' ? `
• Electrónica analógica
• Cálculo de varias variables
• Ingles 4
• Manufactura microelectrónica
• Sistemas digitales
• Mantenimiento y seguridad industrial
• Ética profesional` : `
• Nanobiología
• Ingles 4
• Ética profesional
• Cálculo de varias variables
• Incorporación de materiales
• Electroquímica
• Óptica`}

💡 *Tip:* Copia y pega el nombre exacto`,

    pedirNombre: (grupo, materia) => `✅ Grupo: *${grupo}*
✅ Materia: *${materia}*

*Paso 3:* Escribe tu *nombre completo*`,

    pedirMatricula: (grupo, materia) => `✅ Grupo: *${grupo}*
✅ Materia: *${materia}*

*Paso 4:* Escribe tu *matrícula*`,

    pedirFecha: (grupo, materia) => `✅ Grupo: *${grupo}*
✅ Materia: *${materia}*

*Paso 5:* ¿Cuál es la *fecha de ausencia*?

Formato: DD/MM/AAAA
Ejemplo: 05/10/2026`,

    pedirMotivo: (grupo, materia) => `✅ Grupo: *${grupo}*
✅ Materia: *${materia}*

*Paso 6:* Escribe el *motivo* de tu ausencia

Puedes ser breve o detallado`,

    confirmar: (datos) => `📋 *Confirma tus datos*

*Grupo:* ${datos.grupo}
*Materia:* ${datos.materia}
*Nombre:* ${datos.nombre}
*Matrícula:* ${datos.matricula}
*Fecha:* ${datos.fecha}
*Motivo:* ${datos.motivo}

¿Confirmas esta información?
Escribe: *si* o *no*`,

    enviando: `⏳ Enviando justificación...`,

    exito: `✅ *¡Justificación enviada con éxito!*

Tu justificación ha sido enviada al profesor de la materia.

*Grupo:* ${datos => datos.grupo}
*Materia:* ${datos => datos.materia}
*Fecha:* ${datos => datos.fecha}

¿Necesitas justificar otra ausencia?
Escribe: *inicio*`,

    error: `❌ *Error al enviar*

Ocurrió un error al procesar tu justificación.

Por favor intenta de nuevo o contacta al profesor directamente.

Escribe *inicio* para reiniciar`,

    cancelar: `❌ *Proceso cancelado*

Escribe *inicio* si deseas comenzar una nueva justificación`,

    ayuda: `ℹ️ *Comandos disponibles*

*inicio* - Comenzar una justificación
*ayuda* - Mostrar esta ayuda
*cancelar* - Cancelar proceso actual

*Horario de atención:* 24/7 (automático)`,

    invalido: `⚠️ *Entrada no válida*

Por favor sigue las instrucciones.

Escribe *ayuda* para ver los comandos disponibles`
  }
};
