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
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="prevents"
        :search="search"
        @click:row="selectedPreventiv = $event"
      >
        <template v-slot:item.start="{ item }">
          {{ formatDateToTable(item.start) }}
        </template>
      </v-data-table>

      <v-card class="custom-card">
        <v-card-title class="headline">Detalle del Preventivo</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-card class="mb-3">
                  <v-card-title class="subtitle-1"
                    >INFORMACIÓN GENERAL</v-card-title
                  >
                  <v-card-text>
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          label="Nombre del Responsable"
                          v-model="selectedPreventiv.namePersonInCharge"
                          readonly
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          label="Código de acceso"
                          v-model="selectedPreventiv.accessCode"
                          readonly
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          label="Alumno"
                          v-model="selectedPreventiv.student"
                          :class="{ 'error-input': !itemRecibido.student }"
                          readonly
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          label="Password"
                          v-model="selectedPreventiv.password"
                          readonly
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          type="date"
                          label="Fecha de inicio"
                          v-model="formattedDateTextField"
                          readonly
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          label="Estado"
                          v-model="selectedPreventiv.state"
                          :readonly="isReadOnly"
                          :class="estadoClase"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-col cols="12">
                  <v-card class="mb-3">
                    <v-card-title class="subtitle-1"
                      >TAREAS DE PREVENTIVO</v-card-title
                    >
                    <v-list>
                      <v-list-group
                        no-action
                        v-for="(tarea, index) in selectedPreventiv.tareas"
                        :key="index"
                      >
                        <template v-slot:activator>
                          <v-list-item-content class="headline">
                            {{ tarea.name }}
                          </v-list-item-content>
                        </template>
                        <v-list-item-subtitle class="text-center"
                          >Procesos de la tarea</v-list-item-subtitle
                        >
                        <v-list>
                          <v-list-item
                            v-for="(dato, repuestoIndex) in tarea.datos"
                            :key="repuestoIndex"
                          >
                            <v-list-item-content class="text-right">
                              {{ repuestoIndex + 1 + ". " + dato }}
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                        <v-list-item-subtitle class="text-center"
                          >Repuestos necesarios:</v-list-item-subtitle
                        >
                        <v-list>
                          <v-list-item
                            v-for="(repuesto, repuestoIndex) in tarea.repuestos"
                            :key="repuestoIndex"
                          >
                            <v-list-item-content class="text-right">
                              - {{ repuesto.idRepuesto + "  " + repuesto.name }}
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-list-group>
                    </v-list>
                  </v-card>
                </v-col>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-card>
  </v-app>
</template>

<script>
import eventBus from "@/config/eventBus";
import PreventivsDetail from "@/components/preventivsComponents/PreventivsDetail.vue";
import preventivRepository from "@/repository/preventivRepository";
import Constants from "@/assets/Constants";

export default {
  data() {
    return {
      search: "", // The search term for filtering tasks
      machines: [], // List of machines
      selectedPreventiv: [], // The selected preventiv object
      prevents: [], // List of prevents
      headers: [
        // Table headers
        {
          text: Constants.CODIGO_ACCESO, // Header text for access code
          align: "start",
          filterable: false,
          value: Constants.VALUE_ACCESS_CODE,
        },
        { text: Constants.MACHINE_CODE, value: Constants.VALUE_MACHINE_CODE }, // Header text for machine code
        { text: Constants.ALUMNO, value: Constants.VALUE_STUDENT }, // Header text for student
        {
          text: Constants.FECHA_INICIO,
          align: "center",
          value: Constants.VALUE_START_DATE,
        }, // Header text for start date
        {
          text: Constants.ESTADO,
          align: "center",
          value: Constants.VALUE_STATE,
        }, // Header text for status
      ],
    };
  },

  created() {
    eventBus.$on("item-selected", this.processItem); // Event listener for item selection
  },

  computed: {
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
        if (this.selectedPreventiv && this.selectedPreventiv.start) {
          const dateObj = new Date(this.selectedPreventiv.start.seconds * 1000);
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
     * Filter the tasks based on the search term.
     * @returns {Array} - Filtered tasks
     */
    filteredTasks() {
      return this.tasks.filter((task) => {
        const searchTerm = this.search.toLowerCase();
        return (
          task.taskName.toLowerCase().includes(searchTerm) ||
          task.category.toLowerCase().includes(searchTerm) ||
          task.selectedFrequency.toLowerCase().includes(searchTerm)
        );
      });
    },

    /**
     * Get the machine code error message.
     * @returns {string} - Machine code error message
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
    PreventivsDetail,
  },

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
     * Find prevents by machine code.
     * @returns {void}
     */
    async findByMachineCode() {
      const machineCode = this.itemRecibido.machineCode;

      try {
        this.prevents = await preventivRepository.findByMachineCode(
          machineCode
        );
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Process the selected item.
     * @param {Object} item - The selected item object
     * @returns {void}
     */
    processItem(item) {
      this.itemRecibido = item;
      this.originalItem = JSON.parse(JSON.stringify(item));
      this.isReadOnly = true;
      this.hasChanges = false;
      this.findByMachineCode();
    },

    /**
     * Toggle the edit mode.
     * @param {string} prop - The property to toggle
     * @returns {void}
     */
    toggleEdit(prop) {
      if (this.itemRecibido.state !== "Acabado") {
        this.isReadOnly = !this.isReadOnly;
        if (!this.isReadOnly) {
          this.originalItem = JSON.parse(JSON.stringify(this.itemRecibido));
        } else {
          this.itemRecibido = JSON.parse(JSON.stringify(this.originalItem));
        }
        this.hasChanges = false;
      }
    },

    /**
     * Send the selected item.
     * @param {Object} item - The selected item object
     * @returns {void}
     */
    sendItem(item) {
      eventBus.$emit("item-selected", item);
    },

    /**
     * Delete a preventiv item.
     * @param {Object} item - The preventiv item to delete
     * @returns {void}
     */
    async deletePreventivo(item) {
      try {
        await preventivRepository.delete(item);
      } catch (error) {
        console.log(error);
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
