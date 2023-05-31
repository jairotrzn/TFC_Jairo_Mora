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
          <div class="text-center">
            <v-btn
              class="mx-2"
              fab
              dark
              color="indigo"
              @click="(dialogCreatPreventivo = true), getMachines()"
            >
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
          </div>
        </v-card-title>
  
        <v-data-table
          :headers="headers"
          :items="prevents"
          :search="search"
          @click:row="(selectedTarea = $event), sendItem(selectedTarea)((dialogPreventivDetail = true))"
        >

        </v-data-table>
<PreventivsDetail/>
      </v-card>
    </v-app>
  </template>
  
  <script>
  import eventBus from "@/config/eventBus";
  import PreventivsDetail from '@/components/preventivsComponents/PreventivsDetail.vue';
  import preventivRepository from '@/repository/preventivRepository';
  import Constants from '@/assets/Constants'

  export default {
    data() {
      return {
        search: "", // The search term for filtering tasks
        machines: [], // List of machines
        selectedPreventiv: [], // The selected preventiv object
        prevents: [], // List of prevents
        headers: [ // Table headers
          {
            text: Constants.CODIGO_ACCESO, // Header text for access code
            align: "start",
            filterable: false,
            value: Constants.VALUE_ACCESS_CODE,
          },
          { text: Constants.MACHINE_CODE, value: Constants.VALUE_MACHINE_CODE }, // Header text for machine code
          { text: Constants.ALUMNO, value: Constants.VALUE_STUDENT }, // Header text for student
          { text: Constants.FECHA_INICIO, align: "center", value: Constants.VALUE_START_DATE }, // Header text for start date
          { text: Constants.ESTADO, align: "center", value:Constants.VALUE_STATE }, // Header text for status
        ],
      };
    },
  
    created() {
      eventBus.$on("item-selected", this.processItem); // Event listener for item selection
    },
  
    computed: {
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
      PreventivsDetail
    },
  
    methods: {
      /**
       * Find prevents by machine code.
       * @returns {void}
       */
      async findByMachineCode() {
        const machineCode = this.itemRecibido.machineCode;

        try {
          this.prevents = await preventivRepository.findByMachineCode(machineCode);
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