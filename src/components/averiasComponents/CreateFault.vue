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
        <v-card>
              <h4>Lista de repuestos necesarios</h4>
              <v-data-table
                v-model="selectedRepuesto"
                :headers="headersTablaRepuestos"
                :items="repuestosDB"
                :single-select="singleSelect"
                item-key="id"
                show-select
                class="elevation-1"
                @input="updateSelectedItems"
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title>Repuestos</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      label="Buscar"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-toolbar>
                </template>
              </v-data-table>
            </v-card>

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
import  repuestosRepository from '@/repository/repuestosRepository'

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
      selectedRepuesto: [],
      repuestosDB: [],
      headersTablaRepuestos: [
        {
          text: "Identificador",
          align: "start",
          filterable: false,
          value: "idRepuesto",
        },
        { text: "Nombre", value: "name" },
        { text: "Precio €", align: "center", value: "price" },
        { text: "Proveedor", align: "center", value: "supplier" },
      ],
    };
  },

  /**
   * Hook de ciclo de vida: Se llama cuando se crea el componente.
   */
  created() {
    this.getMachines();
    this.getRepuestos();

  },

  /**
   * Propiedades computadas.
   */
  computed: {
    /**
     * Filters the repuestos based on the search term.
     * @returns {Array} - Filtered repuestos
     */
     filteredRepuestos() {
      return this.repuestosDB.filter((repuesto) => {
        const searchTerm = this.search.toLowerCase();
        return (
          repuesto.nameRepuesto.toLowerCase().includes(searchTerm) ||
          repuesto.idRepuesto.toLowerCase().includes(searchTerm)
        );
      });
    },
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
     * Updates the selectedRepuesto array based on the selection state of repuestosDB items.
     * @returns {void}
     */
     updateSelectedItems() {
      this.selectedRepuestos = this.repuestosDB.filter((item) => item.isSelected);
    },
  /**
     * Retrieves the list of repuestos from the database.
     * @returns {void}
     */
     async getRepuestos() {

try {
  this.repuestosDB = await repuestosRepository.getAll()
} catch (error) {
  console.log(error)
}
},
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
        finish: false,
        repuestos: this.selectedRepuesto
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
      this.selectedRepuesto = []
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
