// Bot de WhatsApp para Justificaciones
// Prof. M.N. Alejandro Castañeda Sáenz
// Tutor SCM11, SCM41 y NTM41

require('dotenv').config();
const wa = require('@open-wa/wa-automate');
const config = require('./config');
const emailService = require('./emailService');
const logger = require('./logger');
const { BotState, ESTADOS } = require('./botState');

// Expresiones regulares para validación
const regexFecha = /^\d{2}\/\d{2}\/\d{4}$/;

// Función para formatear número de teléfono
function formatearNumero(numero) {
  // Remover caracteres no numéricos
  let limpio = numero.replace(/\D/g, '');

  // Si empieza con 52, está bien (México)
  if (limpio.startsWith('52')) {
    return limpio;
  }

  // Si tiene 10 dígitos, agregar 52
  if (limpio.length === 10) {
    return '52' + limpio;
  }

  return limpio;
}

// Función para normalizar texto (quitar acentos, mayúsculas)
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Manejador principal de mensajes
async function manejarMensaje(client, mensaje) {
  try {
    const { from, body } = mensaje;
    const numero = formatearNumero(from);
    const texto = body.trim();
    const textoNormalizado = normalizarTexto(texto);

    logger.info(`📨 Mensaje de ${numero}: ${texto}`);

    const estadoActual = BotState.obtenerEstado(numero);
    const { estado } = estadoActual;
    let { datos } = estadoActual;

    // Manejar comandos especiales
    if (textoNormalizado === 'inicio' || textoNormalizado === 'start') {
      BotState.guardarEstado(numero, ESTADOS.SELECCIONAR_GRUPO, {});
      await client.sendText(from, config.mensajes.inicio);
      return;
    }

    if (textoNormalizado === 'ayuda' || textoNormalizado === 'help') {
      await client.sendText(from, config.mensajes.ayuda);
      return;
    }

    if (textoNormalizado === 'cancelar' || textoNormalizado === 'cancel') {
      BotState.eliminarEstado(numero);
      await client.sendText(from, config.mensajes.cancelar);
      return;
    }

    // Manejar estados del proceso
    switch (estado) {
      case ESTADOS.INICIO:
        if (textoNormalizado === 'inicio') {
          BotState.guardarEstado(numero, ESTADOS.SELECCIONAR_GRUPO, {});
          await client.sendText(from, config.mensajes.inicio);
        } else {
          await client.sendText(from, config.mensajes.bienvenida);
        }
        break;

      case ESTADOS.SELECCIONAR_GRUPO:
        const grupo = texto.toUpperCase();
        if (config.gruposValidos.includes(grupo)) {
          datos.grupo = grupo;
          BotState.guardarEstado(numero, ESTADOS.SELECCIONAR_MATERIA, datos);
          await client.sendText(from, config.mensajes.pedirMateria(grupo));
        } else {
          await client.sendText(from, `⚠️ Grupo no válido.

Escribe: SCM11, SCM41 o NTM41`);
        }
        break;

      case ESTADOS.SELECCIONAR_MATERIA:
        const materiaEncontrada = Object.keys(config.materiasPorGrupo[datos.grupo])
          .find(m => normalizarTexto(m) === textoNormalizado);

        if (materiaEncontrada) {
          datos.materia = materiaEncontrada;
          BotState.guardarEstado(numero, ESTADOS.INGRESAR_NOMBRE, datos);
          await client.sendText(from, config.mensajes.pedirNombre(datos.grupo, materiaEncontrada));
        } else {
          await client.sendText(from, `⚠️ Materia no válida para tu grupo.

Por favor escribe el nombre exacto de la lista.`);
        }
        break;

      case ESTADOS.INGRESAR_NOMBRE:
        if (texto.length < 5) {
          await client.sendText(from, '⚠️ Nombre muy corto. Escribe tu nombre completo.');
          return;
        }
        datos.nombre = texto;
        BotState.guardarEstado(numero, ESTADOS.INGRESAR_MATRICULA, datos);
        await client.sendText(from, config.mensajes.pedirMatricula(datos.grupo, datos.materia));
        break;

      case ESTADOS.INGRESAR_MATRICULA:
        if (texto.length < 5) {
          await client.sendText(from, '⚠️ Matrícula no válida. Verifica y escribe de nuevo.');
          return;
        }
        datos.matricula = texto;
        BotState.guardarEstado(numero, ESTADOS.INGRESAR_FECHA, datos);
        await client.sendText(from, config.mensajes.pedirFecha(datos.grupo, datos.materia));
        break;

      case ESTADOS.INGRESAR_FECHA:
        if (!regexFecha.test(texto)) {
          await client.sendText(from, '⚠️ Formato de fecha inválido.

Usa: DD/MM/AAAA
Ejemplo: 05/10/2026');
          return;
        }
        datos.fecha = texto;
        BotState.guardarEstado(numero, ESTADOS.INGRESAR_MOTIVO, datos);
        await client.sendText(from, config.mensajes.pedirMotivo(datos.grupo, datos.materia));
        break;

      case ESTADOS.INGRESAR_MOTIVO:
        if (texto.length < 3) {
          await client.sendText(from, '⚠️ Motivo muy breve. Escribe al menos una explicación.');
          return;
        }
        datos.motivo = texto;
        BotState.guardarEstado(numero, ESTADOS.CONFIRMAR, datos);
        await client.sendText(from, config.mensajes.confirmar(datos));
        break;

      case ESTADOS.CONFIRMAR:
        if (textoNormalizado === 'si' || textoNormalizado === 'sí' || textoNormalizado === 'yes') {
          // Buscar email del profesor
          const emailProfesor = config.materiasPorGrupo[datos.grupo][datos.materia];

          if (!emailProfesor) {
            logger.error(`❌ No se encontró email para ${datos.grupo} - ${datos.materia}`);
            await client.sendText(from, config.mensajes.error);
            BotState.eliminarEstado(numero);
            return;
          }

          // Enviar mensaje de "enviando"
          await client.sendText(from, config.mensajes.enviando);

          // Enviar email
          datos.emailProfesor = emailProfesor;
          const resultado = await emailService.enviarJustificacion(datos);

          if (resultado.success) {
            await client.sendText(from, config.mensajes.exito(datos));
          } else {
            await client.sendText(from, config.mensajes.error);
          }

          BotState.eliminarEstado(numero);
        } else if (textoNormalizado === 'no' || textoNormalizado === 'cancelar') {
          BotState.eliminarEstado(numero);
          await client.sendText(from, config.mensajes.cancelar);
        } else {
          await client.sendText(from, '⚠️ Escribe *si* para confirmar o *no* para cancelar');
        }
        break;

      default:
        await client.sendText(from, config.mensajes.bienvenida);
        BotState.guardarEstado(numero, ESTADOS.INICIO, {});
    }

  } catch (error) {
    logger.error(`❌ Error manejando mensaje: ${error.message}`);
    try {
      await client.sendText(mensaje.from, '❌ Ocurrió un error. Intenta de nuevo o escribe *ayuda*');
    } catch (e) {
      logger.error(`Error enviando mensaje de error: ${e.message}`);
    }
  }
}

// Función principal de inicialización
async function main() {
  logger.info('🚀 Iniciando bot de justificaciones...');

  try {
    // Crear cliente de WhatsApp
    const client = await wa.create({
      sessionId: 'justificaciones_bot',
      multiDevice: true,
      headless: true,
      qrTimeout: 0,
      authTimeout: 0,
      cacheEnabled: true,
      useChrome: true,
      browser: ['Ubuntu', 'Chrome', '120.0.0'],
      killProcessOnBrowserClose: true,
      throwErrorOnTosBlock: false,
      disableSpins: false,
      logConsoleErrors: true
    });

    logger.info('✅ Cliente de WhatsApp creado');

    // Manejar mensajes entrantes
    client.onMessage(async (mensaje) => {
      await manejarMensaje(client, mensaje);
    });

    // Manejar mensajes de grupo (opcional)
    client.onAnyMessage(async (mensaje) => {
      if (mensaje.isGroupMsg) {
        // Ignorar mensajes de grupo o manejarlos diferente
        return;
      }
    });

    // Manejar desconexión
    client.onStateChanged(async (state) => {
      logger.info(`📱 Estado de conexión: ${state}`);

      if (state === 'CONFLICT' || state === 'UNLAUNCHED') {
        logger.warn('⚠️ Conflicto de sesión, reiniciando...');
        client.forceRefocus();
      }
    });

    // Manejar QR (solo para debugging)
    client.onQR(async (qr) => {
      logger.info('📱 Escanea el código QR con WhatsApp');
      // Aquí podrías enviar el QR a un dashboard si quisieras
    });

    // Manejar estado de la sesión
    client.onStreamStatus(async (status) => {
      logger.info(`📊 Estado del stream: ${status}`);
    });

    logger.info('✅ Bot iniciado exitosamente');
    logger.info('ℹ️ Esperando mensajes...');

    // Mantener el proceso activo
    process.on('SIGINT', async () => {
      logger.info('🛑 Cerrando bot...');
      await client.kill();
      process.exit(0);
    });

  } catch (error) {
    logger.error(`❌ Error fatal: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
  }
}

// Iniciar el bot
main();
