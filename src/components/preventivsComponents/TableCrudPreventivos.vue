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
            @click="(dialogCreatPreventivo = true), getpreventivs()"
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
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            color="red"
            @click="confirmDelete(item)"
            >mdi-delete</v-icon
          >
        </template>
        <template v-slot:item.start="{ item }">
          <span>{{ formatDateToTable(item.start) }}</span>
        </template>
        <template v-slot:item.state="{ item }">
          <span :class="{'alert': item.finish && item.state === 'Pendiente'}">{{ item.state }}</span>
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
import Constants from "@/assets/Constants";

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
      preventivs: [],
      selectedPreventiv: [],
      prevents: [],
      headers: [
        {
          text: Constants.CODIGO_ACCESO,
          align: "start",
          filterable: false,
          value: Constants.VALUE_ACCESS_CODE,
        },
        { text: Constants.CODIGO_MAQUINA, value: Constants.VALUE_preventiv_CODE },
        { text: Constants.FECHA_INICIO, align: "center", value: Constants.VALUE_START_DATE },
        { text: Constants.ESTADO, align: "center", value: Constants.VALUE_STATE },
        { text: Constants.ACCIONES, align: "center", value: Constants.VALUE_ACTIONS },
      ],
    };
  },

  created() {
    this.getPreventivos();
    eventBus.$on("changes-saved", this.getPreventivos);
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
     * Checks if the preventiv code is invalid.
     * @returns {string} - Error message if the preventiv code is invalid, empty string otherwise.
     */
    getpreventivCodeError() {
      if (this.preventivCode && !this.preventivs.includes(this.preventivCode)) {
        return Constants.OPCION_NO_DISPONIBLE;
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
        !this.preventivCode ||
        !this.startDate ||
        this.selectedPreventiv.length === 0
      );
    },
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
     * Confirms the deletion of a preventive.
     * @param {Object} item - The preventive item to be deleted.
     */
    confirmDelete(item) {
      if (confirm(Constants.CONFIRM_DELETE)) {
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
        await preventivRepository.delete(item);
      } catch (error) {
        console.error(error);
      }
    },
    /**
     * Retrieves all preventives.
     */
    async getPreventivos() {
      try{
        const callback = (snapshot) => {
          const preventvsList = []; 
          snapshot.forEach((doc) => {
            const preventiv = doc.data(); 
            preventiv.id = doc.id;
            preventvsList.push(preventiv); 
          });
          this.prevents = preventvsList; 
        };
        const collectionRef = preventivRepository.getCollectionRef();
        this.unsubscribe = preventivRepository.subscribeToCollection(collectionRef,callback);
      }catch (error) {
        console.log(error);
        this.prevents = [];
      }
    }
  }
};
</script>

<style scoped>
.alert {
  animation: blink 2s linear infinite;
}

@keyframes blink {
  0% { background-color: inherit; }
  50% { background-color: yellow; }
  100% { background-color: inherit; }
}
</style>