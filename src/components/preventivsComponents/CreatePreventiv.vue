<template>
  <v-card>
    <v-container>
      <v-form ref="form" @submit.prevent="addPreventivo">
        <p><b>CREAR NUEVO PREVENTIVO</b></p>

        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              type="text"
              label="Agregar nombre de responsable"
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
              label="Código Máquina"
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
        <v-data-table
          v-model="selectedTask"
          :headers="headersTablaTareas"
          :items="filteredTareas"
          :single-select="singleSelectTarea"
          item-key="name"
          show-select
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Tareas</v-toolbar-title>
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

        <br />
        <v-btn
          type="submit"
          color="primary"
          class="mr-4"
          @click.stop="validateForm"
          >Crear Nuevo Preventivo</v-btn
        >
        <br />
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import machineRepository from "@/repository/machineRepository";
import preventivRepository from "@/repository/preventivRepository";
import taskRepository from "@/repository/taskRepository";
import Constants from '@/assets/Constants';

export default {
  data() {
    /**
     * Vue data properties
     * @returns {Object}
     */
    return {
      startDate:"", // Start date for the preventive
      machineCode: "", // Selected machine code
      machines: [], // List of machines
      tareas: [], // List of tasks
      namePersonInCharge: "", // Name of the responsible person
      selectedTask: [], // Selected preventive tasks
      search: "", // Search term for task filtering
      headersTablaTareas: [
        // Headers for the task data table
        { text: "Name", value: "name" },
        {
          text: "Category",
          align: "start",
          filterable: false,
          value: "category",
        },
        { text: "Frequency", align: "center", value: "selectedFrencunce" },
      ],
    };
  },

  created() {
    /**
     * Vue lifecycle hook: created
     * Called when the component is created
     */
    this.getMachines();
    this.getTareas();
  },

  computed: {
    /**
     * Computed properties for the component
     * @returns {Object}
     */
    filteredTareas() {
      /**
       * Filtered tasks based on the search term
       * @returns {Array} - Filtered tasks
       */
      const searchTerm = this.search.toLowerCase();
      return this.tareas.filter(
        (tarea) =>
          tarea.name.toLowerCase().includes(searchTerm) ||
          tarea.category.toLowerCase().includes(searchTerm) ||
          tarea.selectedFrencunce.toLowerCase().includes(searchTerm)
      );
    },
    getMachineCodeError() {
      /**
       * Error message for the machine code combobox
       * @returns {String} - Error message
       */
      return this.machineCode && !this.machines.includes(this.machineCode)
        ? Constants.OPCION_NO_DISPONIBLE
        : "";
    },
    isFormIncomplete() {
      /**
       * Checks if the form is incomplete
       * @returns {Boolean} - True if the form is incomplete, False otherwise
       */
      return (
        !this.namePersonInCharge ||
        !this.machineCode ||
        !this.startDate ||
        this.selectedPreventiv.length === 0
      );
    },
  },

  methods: {
    /**
     * Fetches the list of tasks
     * @returns {void}
     */
     async getTareas() {
      try {
        const callback = (snapshot) => {
          const tastksList = [];
          snapshot.forEach((doc) => {
            const task = doc.data();
            task.id = doc.id;
            tastksList.push(task);
          });
          this.tareas = tastksList;
        };
        const collectionRef = taskRepository.getCollectionRef();
        this.unsubscribe = taskRepository.subscribeToCollection(
          collectionRef,
          callback
        );
      } catch (error) {
        console.log(error);
        this.tareas = [];
      }
    },

    /**
     * Validates the form
     * @returns {void}
     */
    validateForm() {
      this.$refs.form.validate();
    },

    /**
     * Fetches the list of machines
     * @returns {void}
     */
     async getMachines(){

try{
  const callback = (snapshot) => {
    const machineList = []; 
    snapshot.forEach((doc) => {
      const machine = doc.data(); 
      machine.id = doc.id;
      machineList.push(machine); 
    });
    this.machines = machineList; 
  };
  const collectionRef = machineRepository.getCollectionRef();
  this.unsubscribe = machineRepository.subscribeToCollection(collectionRef,callback);
}catch (error) {
  console.log(error);
  this.machines = [];
}
},

    /**
     * Adds a new preventive
     * @returns {void}
     */
    async addPreventivo() {
      const preventivData = {
        name: (this.machineCode.machineCode + " " + this.machineCode.type),
        namePersonInCharge: this.namePersonInCharge,
        machineCode: this.machineCode,
        tareas: this.selectedTask,
        start: new Date(this.formatDate(this.startDate)),
        end: new Date(this.formatDate(this.startDate)),
        accessCode: this.generateUniqueId(),
        state: Constants.PENDIENTE,
        password: Constants.DEFAULT,
        student: Constants.DEFAULT,
        color: "#ecab0f",
        finish: false,
      };

      try {
        await preventivRepository.save(preventivData);
        this.$emit("preventivCreated");
      } catch (error) {
        console.log(error);
      }
      this.getPreventivos();
      this.initializeForm();
    },

    /**
     * Generates a unique ID
     * @returns {String} - Unique ID
     */
    generateUniqueId() {
      const uniqueId = uuidv4();
      return uniqueId.substr(0, 6);
    },

    /**
     * Initializes the form
     * @returns {void}
     */
    initializeForm() {
      this.namePersonInCharge = Constants.DEFAULT;
      this.machineCode = Constants.DEFAULT;
      this.startDate = new Date();
      this.selectedPreventiv = [];
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