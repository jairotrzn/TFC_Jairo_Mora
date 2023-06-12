<template>
  <v-card>
    <v-container>
      <v-form ref="form">
        <p><b>TAREA CORRECTIVA</b></p>

        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              type="text"
              label="Ingrese el nombre del responsable"
              v-model="itemRecibido.namePersonInCharge"
              :rules="[(v) => !!v || 'Este campo es obligatorio']"
              required
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-combobox
              v-model="itemRecibido.machineCode"
              :items="machines"
              label="Código de Máquina"
              item-text="machineCode"
              required
              dense
              filterable
              readonly
            ></v-combobox>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              type="date"
              label="Fecha de inicio"
              v-model="formattedDateTextField"
              required
              dense
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              type="text"
              label="Código de acceso"
              v-model="itemRecibido.accessCode"
              :rules="[(v) => !!v || 'Este campo es obligatorio']"
              required
              dense
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              type="text"
              label="Estudiante"
              v-model="itemRecibido.student"
              :rules="[(v) => !!v || 'Este campo es obligatorio']"
              required
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              type="text"
              label="Password"
              v-model="itemRecibido.password"
              required
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="itemRecibido.state"
              :items="states"
              label="Estado"
            ></v-select>
          </v-col>
        </v-row>

        <v-textarea
          v-model="itemRecibido.description"
          label="Descripción de la averia"
          auto-grow
          outlined
          rows="3"
          row-height="25"
          shaped
        ></v-textarea>
        <v-textarea
          v-model="itemRecibido.descriptionSolution"
          label="Descripción de la solución"
          auto-grow
          outlined
          rows="3"
          row-height="25"
          shaped
        ></v-textarea>
        <br />
        <v-btn color="primary" class="mr-4" @click="confirmUpDate()"
          >Guardar cambios</v-btn
        >
        <br />
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
/**
 * Component for creating a new corrective task.
 */

import { v4 as uuidv4 } from "uuid";
import machineRepository from "@/repository/machineRepository";
import eventBus from "@/config/eventBus";
import faultRepository from "@/repository/faultRepository";
import Constants from "@/assets/Constants";

export default {
  /**
   * Component data.
   */
  data() {
    return {
      itemRecibido: {
        namePersonInCharge: "",
        machineCode: "",
        start: "",
        description: "",
        accessCode: "",
        state: "Pending",
        student: "",
        password: "",
        color: "",
        solution: "",
      },
      machines: [],
      states:["Pendiente","En Proceso","Finalizado"]
    };
  },

  /**
   * Lifecycle hook: Called when the component is created.
   */
  created() {
    eventBus.$on("item-selected", this.procesarItem);
    this.getMachines();
  },

  /**
   * Computed properties.
   */
  computed: {
    /**
     * Get the error message for the machine code.
     * @returns {string} The error message if the machine code is invalid, an empty string otherwise.
     */
    getMachineCodeError() {
      return this.itemRecibido.machineCode &&
        !this.machines.includes(this.itemRecibido.machineCode)
        ? Constants.OPCION_NO_DISPONIBLE
        : Constants.DEFAULT;
    },
    /**
     * The formattedDateTextField property getter and setter.
     *
     * @type {Object}
     * @property {string} get - The getter function for the formattedDateTextField property.
     * @property {Function} set - The setter function for the formattedDateTextField property.
     */
    formattedDateTextField: {
      /**
       * Getter function for the formattedDateTextField property.
       *
       * @returns {string} The formatted date string in 'yyyy-mm-dd' format, or an empty string if not available.
       */
      get() {
        if (this.itemRecibido && this.itemRecibido.start) {
          const dateObj = new Date(this.itemRecibido.start.seconds * 1000);
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, "0");
          const day = String(dateObj.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }
        return "";
      },
      /**
       * Setter function for the formattedDateTextField property.
       *
       * @param {string} value - The date string in 'yyyy-mm-dd' format to be set.
       */
      set(value) {
        if (this.itemRecibido) {
          const parts = value.split("-");
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1;
          const day = parseInt(parts[2]);
          const date = new Date(year, month, day);
          this.itemRecibido.start = {
            seconds: Math.floor(date.getTime() / 1000), // Convert from milliseconds to seconds
          };
        }
      },
    },
  },

  /**
   * Component methods.
   */
  methods: {
    /**
     * Confirm the update action.
     */
    confirmUpDate() {
      if (confirm(Constants.CONFIRM_UP_DATE)) {
        this.updateAveria();
      }
    },

    /**
     * Update the corrective task.
     */
    async updateAveria() {
      const faultData = {
        namePersonInCharge: this.itemRecibido.namePersonInCharge,
        machineCode: this.itemRecibido.machineCode,
        start: new Date(this.formattedDateTextField),
        end: new Date(this.formattedDateTextField),
        description: this.itemRecibido.description,
        accessCode: this.itemRecibido.accessCode,
        state: this.itemRecibido.state,
        student: this.itemRecibido.student,
        password: this.itemRecibido.password,
        color: this.itemRecibido.color,
        solution: this.itemRecibido.solution,
      };
      try {
        await faultRepository.upDate(faultData);
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Process the selected item.
     * @param {Object} item - The selected item.
     */
    procesarItem(item) {
      this.itemRecibido = { ...item }; // Copy the values from the item object to the itemRecibido object
    },

    /**
     * Validate the form.
     */
    validateForm() {
      this.$refs.form.validate();
    },

    /**
     * Retrieve the list of machines from the database.
     */
    async getMachines() {
      try {
        this.machines = await machineRepository.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Generate a unique ID with a maximum length of 6 characters.
     * @returns {string} The generated unique ID.
     */
    generateUniqueId() {
      const uniqueId = uuidv4();
      const truncatedId = uniqueId.substr(0, 6);
      return truncatedId;
    },

    /**
     * Initialize the form.
     */
    initializeForm() {
      this.itemRecibido.namePersonInCharge = Constants.DEFAULT;
      this.itemRecibido.machineCode = Constants.DEFAULT;
      this.itemRecibido.start = Constants.DEFAULT;
      this.itemRecibido.description = Constants.DEFAULT;
      this.itemRecibido.accessCode = Constants.DEFAULT;
      this.itemRecibido.state = Constants.PENDIENTE;
      this.itemRecibido.student = Constants.DEFAULT;
      this.itemRecibido.password = Constants.DEFAULT;
      this.itemRecibido.color = Constants.DEFAULT;
      this.itemRecibido.solution = Constants.DEFAULT;
    },
  },
};
</script>

<style scoped>
.disabled {
  opacity: 0.5;
}
</style>
