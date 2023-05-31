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
import PreventivsDetail from '@/components/averiasComponents/FaultDetail.vue'
import faultRepository from '@/repository/faultRepository';
import Constants from '@/assets/Constants';

export default {
  /**
   * Component data
   */
  data() {
    return {
      search: "",
      machines: [],
      selectedPreventiv: [],
      prevents: [],
      headers: [
        {
          text: Constants.CODIGO_ACCESO,
          align: "start",
          filterable: false,
          value: Constants.VALUE_ACCESS_CODE,
        },
        { text: Constants.MACHINE_CODE, value:Constants.VALUE_MACHINE_CODE },
        { text: Constants.ALUMNO, value: Constants.VALUE_STUDENT },
        { text: Constants.FECHA_INICIO, align: "center", value:Constants.VALUE_START_DATE },
        { text: Constants.ESTADO, align: "center", value: Constants.VALUE_STATE },
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
    PreventivsDetail
  },

  /**
   * Component methods
   */
  methods: {
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

    /**
     * Send the selected item
     * @param {Object} item - Selected item
     */
    sendItem(item) {
      eventBus.$emit("item-selected", item);
    },
  }
};
</script>

<style scoped>
.disabled {
  opacity: 0.5;
}
</style>