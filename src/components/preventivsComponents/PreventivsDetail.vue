<template>
  <v-card class="custom-card">
    <v-card-title class="headline">Detalle del Preventivo</v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-card class="mb-3">
              <v-card-title class="subtitle-1"
                >Información General</v-card-title
              >
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      label="Nombre del Responsable"
                      v-model="itemRecibido.namePersonInCharge"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Código de acceso"
                      v-model="itemRecibido.accessCode"
                      readonly
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      label="Alumno"
                      v-model="itemRecibido.student"
                      :class="{ 'error-input': !itemRecibido.student }"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Password"
                      v-model="itemRecibido.password"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      type="date"
                      label="Fecha de inicio"
                      v-model="formattedDateTextField"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Estado"
                      v-model="itemRecibido.state"
                      :readonly="isReadOnly"
                      :class="estadoClase"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-col cols="12">
              <v-card class="mb-3">
                <v-card-title class="subtitle-1"
                  >Información de la Máquina</v-card-title
                >
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Código de Máquina"
                        v-model="itemRecibido.machineCode.machineCode"
                        :readonly="isReadOnly"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Nombre de la Máquina"
                        v-model="itemRecibido.machineCode.type"
                        :readonly="isReadOnly"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        label="Ubicación"
                        v-model="itemRecibido.machineCode.location"
                        :readonly="isReadOnly"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Departamento"
                        v-model="itemRecibido.machineCode.department"
                        :readonly="isReadOnly"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-col>
        </v-row>
        <v-card class="mb-3">
          <v-card-title class="subtitle-1">Tareas Pendientes</v-card-title>
          <v-list>
            <v-list-group
              no-action
              v-for="(tarea, index) in itemRecibido.tareas"
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
              <v-btn icon small color="red" @click="eliminarTarea(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-group>
          </v-list>
        </v-card>
        <div class="d-flex justify-space-between">
          <v-btn @click="confirmFinisPreventiv" color="primary" :disabled="itemRecibido.state === 'Finalizado'">
  Finalizar Preventivo
</v-btn>
          <v-btn @click="confirmUpdate" color="primary">Actualizar</v-btn>
        </div>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import eventBus from "@/config/eventBus";
import preventivRepository from "@/repository/preventivRepository";
import Constants from "@/assets/Constants";

export default {
  data() {
    /**
     * Vue data properties
     * @returns {Object}
     */
    return {
      itemRecibido: null, // Received item
      isReadOnly: true, // Flag indicating if the item is in read-only mode
      originalItem: null, // Copy of the original item
      hasChanges: false, // Flag indicating if there are any changes
    };
  },
  computed: {
    /**
     * Computed properties for the component
     * @returns {Object}
     */
    estadoClase() {
      /**
       * CSS class based on the state of the item
       * @returns {String} - CSS class
       */
      const estado = this.itemRecibido.state;
      if (estado === "Completed") {
        return "green--text"; // Class for green text
      } else if (estado === "In Progress") {
        return "orange--text"; // Class for orange text
      } else if (estado === "Pending") {
        return "red--text"; // Class for red text
      }
      return ""; // No additional class
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
  created() {
    /**
     * Vue lifecycle hook: created
     * Called when the component is created
     */
    eventBus.$on("item-selected", this.procesarItem);
  },
  methods: {
    /**
     * Confirms the finish of the preventiv
     * @returns {void}
     */
    confirmFinisPreventiv() {
      if (
        confirm(
          "Deseas finalizar el preventivo? Se calcularan las próximas fechas de las tareas realizadas"
        )
      ) {
        this.updatePreventivTask(this.itemRecibido);
      }
    },
    /**
     * Confirms the update of the item
     * @returns {void}
     */
    confirmUpdate() {
      if (confirm(Constants.CONFIRM_UP_DATE)) {
        this.upDate(this.itemRecibido);
      }
    },
    /**
     * Processes the received item
     * @param {Object} item - Received item
     * @returns {void}
     */
    procesarItem(item) {
      this.itemRecibido = item;
      this.originalItem = JSON.parse(JSON.stringify(item));
      this.isReadOnly = true;
      this.hasChanges = false;
    },

/**
 * Calculates the start date based on the frequency.
 * @param {string} frequency - The frequency of the task ("Diaria", "Semanal", "Quincenal", "Mensual").
 * @returns {Date} - The calculated start date.
 */
 calculateStartDate(frequency) {
  const currentDate = new Date();
  
  if (frequency === "Diaria") {
    return currentDate;
  } else if (frequency === "Semanal") {
    currentDate.setDate(currentDate.getDate() + 7);
    return currentDate;
  } else if (frequency === "Quincenal") {
    currentDate.setDate(currentDate.getDate() + 14);
    return currentDate;
  } else if (frequency === "Mensual") {
    currentDate.setMonth(currentDate.getMonth() + 1);
    return currentDate;
  }
  
  // If the frequency doesn't match any of the options above, return the current date
  return currentDate;
},

/**
 * Updates the preventive task.
 * @returns {Promise<void>}
 */
async updatePreventivTask() {
  const tareas = this.itemRecibido.tareas;

  tareas.forEach((tarea) => {
    const frequency = tarea.selectedFrencunce;
    tarea.start = this.calculateStartDate(frequency);
    tarea.end = this.calculateStartDate(frequency);
    tarea.description = this.itemRecibido.machineCode.machineCode;
  });

  try {
    const preventData = {
      namePersonInCharge: this.itemRecibido.namePersonInCharge,
      accessCode: this.itemRecibido.accessCode,
      student: this.itemRecibido.student,
      password: this.itemRecibido.password,
      start: new Date(this.formattedDateTextField),
      state: "Finalizado",
      machineCode: this.itemRecibido.machineCode,
      tareas: tareas,
    };

    await preventivRepository.upDate(preventData);
  } catch (error) {
    console.error(error);
  }

  eventBus.$emit("changes-saved");
  this.isReadOnly = true;
  this.hasChanges = false;
},

    /**
     * Updates the item
     * @param {Object} itemRecibido - Item to update
     * @returns {void}
     */
    async upDate() {
      try {
        const preventData = {
          namePersonInCharge: this.itemRecibido.namePersonInCharge,
          accessCode: this.itemRecibido.accessCode,
          student: this.itemRecibido.student,
          password: this.itemRecibido.password,
          start: new Date(this.formattedDateTextField),
          state: this.itemRecibido.state,
          machineCode: this.itemRecibido.machineCode,
          tareas: this.itemRecibido.tareas,
        };
        await preventivRepository.upDate(preventData);
      } catch (error) {
        console.error(error);
      }

      //eventBus.$emit("changes-saved");
      this.isReadOnly = true;
      this.hasChanges = false;
    },
    /**
     * Removes a task from the item
     * @param {Number} index - Index of the task to remove
     * @returns {void}
     */
    eliminarTarea(index) {
      this.itemRecibido.tareas.splice(index, 1);
    },
  },
  watch: {
    itemRecibido: {
      deep: true,
      /**
       * Watcher for the itemRecibido property
       * Called when the itemRecibido property changes
       * @returns {void}
       */
      handler() {
        if (
          JSON.stringify(this.itemRecibido) !==
          JSON.stringify(this.originalItem)
        ) {
          this.hasChanges = true;
        } else {
          this.hasChanges = false;
        }
      },
    },
  },
};
</script>

<style scoped>
.custom-card {
  border: 2px solid #acf3db; /* Color de borde #E1EA1F */
  border-radius: 4px; /* Opcional: agrega esquinas redondeadas */
}
.subtitle-1 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.green--text {
  color: green;
}

.orange--text {
  color: orange;
}

.red--text {
  color: red;
}
</style>
