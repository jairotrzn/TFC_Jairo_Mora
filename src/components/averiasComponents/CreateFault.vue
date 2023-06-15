<template>
  <v-card>
    <v-container>
      <v-form ref="form" @submit.prevent="addAveria">
        <p><b>CREAR NUEVA TAREA CORRECTIVA</b></p>

        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              type="text"
              label="Ingrese el nombre del responsable"
              v-model="namePersonInCharge"
              :rules="[(v) => !!v || 'Este campo es obligatorio']"
              required
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-combobox
              v-model="machineCode"
              :items="machines"
              label="Código de Máquina"
              item-text="machineCode"
              required
              dense
              filterable
              :error-messages="getMachineCodeError"
            ></v-combobox>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              type="date"
              label="Fecha de inicio"
              v-model="startDate"
              required
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-textarea
          v-model="descriptionDefault"
          label="Descripción de la tarea"
          auto-grow
          outlined
          rows="3"
          row-height="25"
          shaped
        ></v-textarea>

        <br />
        <v-btn
          type="submit"
          color="primary"
          class="mr-4"
          @click.stop="validateForm"
          :disabled="isFormIncomplete"
          >Crear Nueva Tarea Correctiva</v-btn
        >
        <br />
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
/**
 * Componente para crear una nueva tarea correctiva.
 */
import { v4 as uuidv4 } from "uuid";
import faultRepository from "@/repository/faultRepository";
import machineRepository from '@/repository/machineRepository'
import Constants from '@/assets/Constants'
export default {
  /**
   * Datos del componente.
   */
  data() {
    return {
      descriptionDefault: "", // Descripción predeterminada de la tarea
      startDate: "", // Fecha de inicio de la tarea
      machineCode: "", // Código de máquina para la tarea
      machines: [], // Máquinas disponibles
      namePersonInCharge: "", // Nombre de la persona responsable
      state: Constants.PENDIENTE, // Estado de la tarea
      password: "", // Contraseña para la tarea
    };
  },

  /**
   * Hook de ciclo de vida: Se llama cuando se crea el componente.
   */
  created() {
    this.getMachines();
  },

  /**
   * Propiedades computadas.
   */
  computed: {
    /**
     * Obtener el mensaje de error para el código de máquina.
     * @returns {string} El mensaje de error si el código de máquina no es válido, cadena vacía en caso contrario.
     */
    getMachineCodeError() {
      return this.machineCode && !this.machines.includes(this.machineCode)
        ? Constants.OPCION_NO_DISPONIBLE
        : "";
    },
    /**
     * Verificar si el formulario está incompleto.
     * @returns {boolean} Verdadero si alguno de los campos del formulario está incompleto, falso en caso contrario.
     */
    isFormIncomplete() {
      return (
        !this.namePersonInCharge ||
        !this.machineCode ||
        !this.startDate ||
        !this.descriptionDefault
      );
    },
  },

  /**
   * Métodos del componente.
   */
  methods: {

    /**
     * Validar el formulario.
     */
    validateForm() {
      this.$refs.form.validate();
    },

     /**
     * Retrieve the list of machines from the database.
     * @returns {void}
     */
     async getMachines() {
      try {
        this.machines = await machineRepository.getAll()
            } catch (error) {
        console.log(error);

      }
    },

    /**
     * Generar un ID único con una longitud máxima de 6 caracteres.
     * @returns {string} El ID único generado.
     */
    generateUniqueId() {
      const uniqueId = uuidv4();
      const truncatedId = uniqueId.substr(0, 6);
      return truncatedId;
    },

    /**
     * Agregar una nueva tarea.
     */
    async addAveria() {
      const faultData = {
        name : (this.machineCode.machineCode + " " + this.machineCode.type),
        namePersonInCharge: this.namePersonInCharge,
        machineCode: this.machineCode,
        start:new Date(this.formatDate(this.startDate)) ,
        end:new Date(this.formatDate(this.startDate)) ,
        description: this.descriptionDefault,
        accessCode: this.generateUniqueId(),
        state:Constants.PENDIENTE,
        student:Constants.DEFAULT,
        password: this.password,
        color:"#ff4040",
        solution:Constants.DEFAULT,
        finish: false
      };
      try {
        await faultRepository.save(faultData);
        this.$emit(Constants.AVERIA_CREATE);
      } catch (error) {
        console.log(error);
      }

      this.initializeForm();
    },
     
    /**
     * Inicializar el formulario.
     */
    initializeForm() {
      this.namePersonInCharge = Constants.DEFAULT;
      this.machineCode = Constants.DEFAULT;
      this.startDate = Constants.DEFAULT;
      this.descriptionDefault = Constants.DEFAULT;
    },
    formatDate(fecha) {
      const fechaCompleta = fecha + "T00:00:00.000Z";
      return fechaCompleta;
    }
  },
};

</script>

<style scoped>
.disabled {
  opacity: 0.5;
}
</style>
