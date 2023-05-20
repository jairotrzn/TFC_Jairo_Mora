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
            @click="(dialogCreateFault = true), getMachines()"
          >
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="faults"
        :search="search"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            color="red"
            @click=" confirmDelete(item)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>

      <PreventivsDetail />

      <!--Modal dialogo crear Preventivo -->
      <v-dialog v-model="dialogCreateFault">
        <CreateFault @dialogCreateFault="handlePreventivCreated" />
      </v-dialog>

    </v-card>
  </v-app>
</template>

<script>
import { db, collection, getDocs, deleteDoc, doc } from "@/main";

import CreateFault from "@/components/averiasComponents/CreateFault.vue";
import PreventivsDetail from "@/components/preventivsComponents/PreventivsDetail.vue";

export default {
  components: {
    CreateFault,
    PreventivsDetail,
  },
  data() {
    return {
      dialogDeleteFault: false,
      dialogPreventivFault: false,
      search: "",
      dialogCreateFault: false,
      machines: [],
      selectedFault: [],
      faults:[],
      headers: [
        { text: "Cod.Acceso", align: "start", filterable: false, value: "accessCode" },
        { text: "Cod.Máquina", value: "machineCode.machineCode" },
        { text: "Fecha Inicio", align: "center", value: "startDate" },
        { text: "Estado", align: "center", value: "state" },
        { text: "Acciones", align: "center", value: "actions" },
      ],
    };
  },

  created() {
    this.getAll();
  },

  methods: {
    confirmDelete(item) {
      if (confirm("¿Estás seguro de que deseas eliminar?")) {
        this.deleteFault(item);
        this.getAll();
      }
    },
    handlePreventivCreated() {
      this.dialogCreateFault = false;
      this.getAll();
    },
    async deleteFault(item) {
      try {
        const docRef = doc(db, "averias", item.id);
        await deleteDoc(docRef);
        this.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    async getAll() {
      try {
        const snapshot = await getDocs(collection(db, "averias"));
        const faultsDb = [];

        snapshot.forEach((doc) => {
          let faultData = doc.data();
          faultData.id = doc.id;
          faultsDb.push(faultData);
        });

        this.faults = faultsDb;
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