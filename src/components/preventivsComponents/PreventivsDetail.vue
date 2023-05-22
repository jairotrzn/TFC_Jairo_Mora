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
                      :readonly="isReadOnly"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Código de acceso"
                      v-model="itemRecibido.accessCode"
                      :readonly="isReadOnly"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      label="Alumno"
                      v-model="itemRecibido.student"
                      :readonly="isReadOnly"
                    >
                      <template v-slot:append>
                        <v-btn icon small @click="toggleEdit('student')">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Password"
                      v-model="itemRecibido.password"
                      :readonly="isReadOnly"
                    >
                      <template v-slot:append>
                        <v-btn icon small @click="toggleEdit('password')">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      type="date"
                      label="Fecha de inicio"
                      v-model="itemRecibido.startDate"
                      :readonly="isReadOnly"
                    >
                      <template v-slot:append>
                        <v-btn icon small @click="toggleEdit('startDate')">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Estado"
                      v-model="itemRecibido.state"
                      :readonly="isReadOnly"
                      :class="estadoClase"
                    >
                      <template v-slot:append>
                        <v-btn icon small @click="toggleEdit('state')">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
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
                  >Información de la Máquina</v-card-title
                >
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Código de Máquina"
                        v-model="itemRecibido.machineCode.machineCode"
                        :readonly="isReadOnly"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Nombre de la Máquina"
                        v-model="itemRecibido.machineCode.type"
                        :readonly="isReadOnly"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        label="Ubicación"
                        v-model="itemRecibido.machineCode.location"
                        :readonly="isReadOnly"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Departamento"
                        v-model="itemRecibido.machineCode.department"
                        :readonly="isReadOnly"
                      >
                      </v-text-field>
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
                  {{ tarea.nameTarea | uppercase }}
                </v-list-item-content>
              </template>
              <v-list-item-subtitle class="text-center"
                >Procesos de la tarea</v-list-item-subtitle
              >
              <v-list>
                <v-list-item
                  v-for="(datos, repuestoIndex) in tarea.datos"
                  :key="repuestoIndex"
                >
                  <v-list-item-content class="text-right">
                    {{ repuestoIndex + 1 + ". " + datos.dato }}
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
                    - {{ repuesto.nameRepuesto }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-btn icon small color="red" @click="eliminarTarea(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-group>
          </v-list>
        </v-card>
        <v-btn v-if="!isReadOnly" @click="confirmUpdate" :disabled="!hasChanges"
          >Actualizar</v-btn
        >
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import eventBus from "@/config/eventBus";
import preventivRepository from "@/repository/preventivRepository";

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
     * Confirms the update of the item
     * @returns {void}
     */
    confirmUpdate() {
      if (confirm("Are you sure you want to update?")) {
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
     * Toggles the edit mode for a property
     * @param {String} prop - Property to toggle
     * @returns {void}
     */
    toggleEdit(prop) {
      if (this.itemRecibido.state !== "Completed") {
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
     * Updates the item
     * @param {Object} itemRecibido - Item to update
     * @returns {void}
     */
    async upDate(itemRecibido) {
      try {
        const preventData = {
          namePersonInCharge: this.itemRecibido.namePersonInCharge,
          accessCode: this.itemRecibido.accessCode,
          student: this.itemRecibido.student,
          password: this.itemRecibido.password,
          startDate: this.itemRecibido.startDate,
          state: this.itemRecibido.state,
          machineCode: this.itemRecibido.machineCode,
          tareas: this.itemRecibido.tareas,
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
