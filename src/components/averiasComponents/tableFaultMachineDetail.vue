<template>
  <v-app>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="prevents"
        :search="search"
        @click:row="selectedTarea = $event"
      >
        <template v-slot:item.start="{ item }">
          {{ formatDateToTable(item.start) }}
        </template>
      </v-data-table>
      <v-card>
        <v-container>
          <v-form ref="form">
            <p><b>TAREA CORRECTIVA</b></p>

            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  type="text"
                  label="Ingrese el nombre del responsable"
                  v-model="selectedTarea.namePersonInCharge"
                  :rules="[(v) => !!v || 'Este campo es obligatorio']"
                  readonly
                  required
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-combobox
                  v-model="selectedTarea.machineCode"
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
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  type="text"
                  label="Código de acceso"
                  v-model="selectedTarea.accessCode"
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
                  v-model="selectedTarea.student"
                  :rules="[(v) => !!v || 'Aun no se ha asignado alumno ']"
                  required
                  dense
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  type="text"
                  label="Password"
                  v-model="selectedTarea.password"
                  required
                  dense
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>

            <v-textarea
              v-model="selectedTarea.description"
              label="Descripción de la averia"
              auto-grow
              outlined
              rows="3"
              row-height="25"
              shaped
              readonly
            ></v-textarea>
            <v-textarea
              v-model="selectedTarea.descriptionSolution"
              label="Descripción de la solución"
              auto-grow
              outlined
              rows="3"
              row-height="25"
              shaped
              readonly
            ></v-textarea>
          </v-form>
        </v-container>
      </v-card>
    </v-card>
  </v-app>
</template>

<script>
import eventBus from "@/config/eventBus";
import FaultDetail from "@/components/averiasComponents/FaultDetail.vue";
import faultRepository from "@/repository/faultRepository";
import Constants from "@/assets/Constants";

export default {
  /**
   * Component data
   */
  data() {
    return {
      search: "",
      machines: [],
      selectedTarea: [],
      prevents: [],
      headers: [
        {
          text: Constants.CODIGO_ACCESO,
          align: "start",
          filterable: false,
          value: Constants.VALUE_ACCESS_CODE,
        },
        { text: Constants.MACHINE_CODE, value: Constants.VALUE_MACHINE_CODE },
        { text: Constants.ALUMNO, value: Constants.VALUE_STUDENT },
        {
          text: Constants.FECHA_INICIO,
          align: "center",
          value: Constants.VALUE_START_DATE,
        },
        {
          text: Constants.ESTADO,
          align: "center",
          value: Constants.VALUE_STATE,
        },
      ],
    };
  },

  /**
   * Lifecycle hook: Created
   */
  created() {
    eventBus.$on("item-selected", this.procesarItem);
  },

  /**
   * Computed properties
   */
  computed: {
    /**
     * Filtered tasks based on the search term
     */
    filteredTareas() {
      return this.tareas.filter((tareas) => {
        const searchTerm = this.search.toLowerCase();
        return (
          tareas.nameTarea.toLowerCase().includes(searchTerm) ||
          tareas.category.toLowerCase().includes(searchTerm) ||
          tareas.selectedFrencunce.toLowerCase().includes(searchTerm)
        );
      });
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
        if (this.selectedTarea && this.selectedTarea.start) {
          const dateObj = new Date(this.selectedTarea.start.seconds * 1000);
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

    /**
     * Error message for machine code validation
     */
    getMachineCodeError() {
      if (this.machineCode && !this.machines.includes(this.machineCode)) {
        return Constants.OPCION_NO_DISPONIBLE;
      } else {
        return Constants.DEFAULT;
      }
    },
  },

  components: {
    FaultDetail,
  },

  /**
   * Component methods
   */
  methods: {
    /**
     * Formats a timestamp to the format 'yyyy-mm-dd'.
     *
     * @param {Object} timestamp - The timestamp object.
     * @returns {string} The formatted date string in 'yyyy-mm-dd' format.
     */
    formatDateToTable(timestamp) {
      const date = new Date(timestamp.seconds * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    /**
     * Find faults by machine code
     */
    async findByMachineCode() {
      const machineCode = this.itemRecibido.machineCode;
      try {
        this.prevents = await faultRepository.findByMachineCode(machineCode);
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Process the selected item
     * @param {Object} item - Selected item
     */
    procesarItem(item) {
      this.itemRecibido = item;
      this.originalItem = JSON.parse(JSON.stringify(item));
      this.isReadOnly = true;
      this.hasChanges = false;
      this.findByMachineCode();
    },

    /**
     * Toggle the edit mode for a property
     * @param {string} prop - Property name
     */
    toggleEdit(prop) {
      if (this.itemRecibido.state !== "Finished") {
        this.isReadOnly = !this.isReadOnly;
        if (!this.isReadOnly) {
          this.originalItem = JSON.parse(JSON.stringify(this.itemRecibido));
        } else {
          this.itemRecibido = JSON.parse(JSON.stringify(this.originalItem));
        }
        this.hasChanges = false;
      }
    },
  },
};
</script>

<style scoped>
.disabled {
  opacity: 0.5;
}
</style>
