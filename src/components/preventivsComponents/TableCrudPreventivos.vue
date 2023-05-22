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
        @click:row="
          (selectedTarea = $event),
            sendItem(selectedTarea)((dialogPreventivDetail = true))
        "
      >
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            color="red"
            @click="confirmDelete(item)"            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>

      <PreventivsDetail />

      <!--Modal dialogo crear Preventivo -->
      <v-dialog v-model="dialogCreatPreventivo">
        <CreatePreventiv @preventivCreated="handlePreventivCreated" />
      </v-dialog>

    </v-card>
  </v-app>
</template>

<script>
/**
 * Vue component for managing preventives.
 */
 import eventBus from "@/config/eventBus";
import PreventivsDetail from "@/components/preventivsComponents/PreventivsDetail.vue";
import CreatePreventiv from "./CreatePreventiv.vue";
import preventivRepository from "@/repository/preventivRepository";

export default {
  components: {
    PreventivsDetail,
    CreatePreventiv,
  },
  data() {
    return {
      dialogDeletePreventiv: false,
      dialogPreventivDetail: false,
      search: "",
      dialogCreatPreventivo: false,
      machines: [],
      selectedPreventiv: [],
      prevents: [],
      headers: [
        {
          text: "Access Code",
          align: "start",
          filterable: false,
          value: "accessCode",
        },
        { text: "Machine Code", value: "machineCode.machineCode" },
        { text: "Start Date", align: "center", value: "startDate" },
        { text: "Status", align: "center", value: "state" },
        { text: "Actions", align: "center", value: "actions" },
      ],
    };
  },

  created() {
    this.getPreventivos();
    this.getTareas();
  },
  computed: {
    /**
     * Filters the tasks based on the search term.
     * @returns {Array} - Filtered tasks.
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
     * Checks if the machine code is invalid.
     * @returns {string} - Error message if the machine code is invalid, empty string otherwise.
     */
    getMachineCodeError() {
      if (this.machineCode && !this.machines.includes(this.machineCode)) {
        return "Option not available";
      } else {
        return "";
      }
    },
    /**
     * Checks if the form is incomplete.
     * @returns {boolean} - True if the form is incomplete, false otherwise.
     */
    isFormIncomplete() {
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
     * Confirms the deletion of a preventive.
     * @param {Object} item - The preventive item to be deleted.
     */
    confirmDelete(item) {
      if (confirm("Are you sure you want to delete?")) {
        this.deletePreventivo(item);
        this.getPreventivos();
      }
    },
    /**
     * Handles the event when a preventive is created.
     */
    handlePreventivCreated() {
      this.dialogCreatPreventivo = false;
      this.getPreventivos();
    },
  
    /**
     * Sends the selected item through the event bus.
     * @param {Object} item - The selected item.
     */
    sendItem(item) {
      eventBus.$emit("item-selected", item);
    },
    /**
     * Deletes a preventive item.
     * @param {Object} item - The item to be deleted.
     */
    async deletePreventivo(item) {
      try {
        await preventivRepository.delete(item)
      } catch (error) {
        console.error(error)
      }
    },
    /**
     * Retrieves all preventives.
     */
    async getPreventivos() {
      try {
        this.prevents = await preventivRepository.getAll()
      } catch (error) {
        console.error(error)
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