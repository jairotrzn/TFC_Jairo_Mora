/**
 * Component for displaying and managing faults.
 */
<template>
  <v-app>
    <v-card>
      <v-card-title>
        <!-- Search input field -->
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <div class="text-center">
          <!-- Button to create a new fault -->
          <v-btn
            class="mx-2"
            fab
            dark
            color="indigo"
            @click="(dialogCreateFault = true), getMachines()"
          >
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <!-- Faults table -->
      <v-data-table
        :headers="headers"
        :items="faults"
        :search="search"
      >
        <template v-slot:item.actions="{ item }">
          <!-- Delete button for each fault -->
          <v-icon
            small
            class="mr-2"
            color="red"
            @click="confirmDelete(item)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>

      <!-- Preventivs detail component -->
      <PreventivsDetail />

      <!-- Modal dialog to create a new fault -->
      <v-dialog v-model="dialogCreateFault">
        <CreateFault @dialogCreateFault="handlePreventivCreated" />
      </v-dialog>

    </v-card>
  </v-app>
</template>

<script>

import CreateFault from "@/components/averiasComponents/CreateFault.vue";
import PreventivsDetail from "@/components/preventivsComponents/PreventivsDetail.vue";
import faultRepository from "@/repository/faultRepository";
export default {
  components: {
    CreateFault,
    PreventivsDetail,
  },
  data() {
    return {
      search: "", // Search input value
      dialogCreateFault: false, // Dialog flag to create a new fault
      faults: [], // List of faults
      headers: [ // Table headers for faults
        { text: "Access Code", align: "start", filterable: false, value: "accessCode" },
        { text: "Machine Code", value: "machineCode.machineCode" },
        { text: "Start Date", align: "center", value: "startDate" },
        { text: "Status", align: "center", value: "state" },
        { text: "Actions", align: "center", value: "actions" },
      ],
    };
  },

  created() {
    this.getAll();
  },

  methods: {
    /**
     * Confirms the deletion of a fault.
     * @param {Object} item - The fault item to delete.
     */
    confirmDelete(item) {
      if (confirm("Are you sure you want to delete?")) {
        this.deleteFault(item);
        this.getAll();
      }
    },
    /**
     * Handles the event when a new fault is created.
     */
    handlePreventivCreated() {
      this.dialogCreateFault = false;
      this.getAll();
    },
    /**
     * Deletes a fault from the database.
     * @param {Object} item - The fault item to delete.
     */
    async deleteFault(item) {

      try {
        await faultRepository.delete(item)
      } catch (error) {
        console.log(error);
      }
 
    },
    /**
     * Retrieves all faults from the database.
     */
    async getAll() {

      try {
        
        this.faults = await faultRepository.getAll()
      } catch (error) {
        console.log(error);
      }
    }
  },
};
</script>

<style scoped>
.disabled {
  opacity: 0.5;
}
</style>