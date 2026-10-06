// Manejo del estado de las conversaciones
// Almacena temporalmente el progreso de cada usuario

const estados = new Map();

const ESTADOS = {
  INICIO: 'INICIO',
  SELECCIONAR_GRUPO: 'SELECCIONAR_GRUPO',
  SELECCIONAR_MATERIA: 'SELECCIONAR_MATERIA',
  INGRESAR_NOMBRE: 'INGRESAR_NOMBRE',
  INGRESAR_MATRICULA: 'INGRESAR_MATRICULA',
  INGRESAR_FECHA: 'INGRESAR_FECHA',
  INGRESAR_MOTIVO: 'INGRESAR_MOTIVO',
  CONFIRMAR: 'CONFIRMAR'
};

class BotState {
  obtenerEstado(numero) {
    return estados.get(numero) || { estado: ESTADOS.INICIO, datos: {} };
  }

  guardarEstado(numero, estado, datos = {}) {
    estados.set(numero, { estado, datos });
  }

  actualizarDatos(numero, nuevosDatos) {
    const actual = this.obtenerEstado(numero);
    estados.set(numero, {
      estado: actual.estado,
      datos: { ...actual.datos, ...nuevosDatos }
    });
  }

  eliminarEstado(numero) {
    estados.delete(numero);
  }

  obtenerDatos(numero) {
    return this.obtenerEstado(numero).datos;
  }

  cambiarEstado(numero, nuevoEstado) {
    const actual = this.obtenerEstado(numero);
    estados.set(numero, { estado: nuevoEstado, datos: actual.datos });
  }
}

module.exports = { BotState: new BotState(), ESTADOS };
