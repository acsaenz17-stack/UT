// Servicio de envío de correos electrónicos
// Usa Gmail con App Password

const nodemailer = require('nodemailer');
const logger = require('./logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.inicializar();
  }

  inicializar() {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;

    if (!gmailUser || !gmailPass) {
      logger.error('❌ Falta configuración de Gmail en .env');
      throw new Error('Falta configuración de Gmail');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });

    logger.info('✅ Servicio de email inicializado');
  }

  async enviarJustificacion(datos) {
    const { grupo, materia, nombre, matricula, fecha, motivo, emailProfesor } = datos;

    const asunto = `Justificación de ausencia - ${nombre} - ${materia}`;

    const cuerpo = `Estimados colegas,

Por medio de la presente se justifica la ausencia del estudiante:

• Nombre: ${nombre}
• Matrícula: ${matricula}
• Materia: ${materia}
• Grupo: ${grupo}
• Fecha(s) de ausencia: ${fecha}
• Motivo: ${motivo}

Saludos cordiales,

M.N. Alejandro Castañeda Sáenz
Tutor SCM11, SCM41 y NTM41`;

    try {
      await this.transporter.sendMail({
        from: `"M.N. Alejandro Castañeda Sáenz" <${process.env.GMAIL_USER}>`,
        to: emailProfesor,
        subject: asunto,
        text: cuerpo
      });

      logger.info(`✅ Email enviado a ${emailProfesor} - ${nombre} (${materia})`);
      return { success: true };
    } catch (error) {
      logger.error(`❌ Error enviando email: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async verificarConexion() {
    try {
      await this.transporter.verify();
      logger.info('✅ Conexión con Gmail verificada');
      return true;
    } catch (error) {
      logger.error(`❌ Error de conexión con Gmail: ${error.message}`);
      return false;
    }
  }
}

module.exports = new EmailService();
