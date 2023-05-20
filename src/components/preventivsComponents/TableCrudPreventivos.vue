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
import { db, collection, getDocs, addDoc, deleteDoc, doc } from "@/main";
import eventBus from "@/config/eventBus";
import { v4 as uuidv4 } from "uuid";
import PreventivsDetail from "@/components/preventivsComponents/PreventivsDetail.vue";
import CreatePreventiv from "./CreatePreventiv.vue";
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
          text: "Cod.Acceso",
          align: "start",
          filterable: false,
          value: "accessCode",
        },
        { text: "Cod.Máquina", value: "machineCode.machineCode" },
        { text: "Fecha Inicio", align: "center", value: "startDate" },
        { text: "Estado", align: "center", value: "state" },
        { text: "Acciones", align: "center", value: "actions" },
      ],
    };
  },

  created() {
    this.getPreventivos();
    this.getTareas();
  },
  computed: {
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
    getMachineCodeError() {
      if (this.machineCode && !this.machines.includes(this.machineCode)) {
        return "Opción no disponible";
      } else {
        return "";
      }
    },
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
    confirmDelete(item) {
      if (confirm("¿Estás seguro de que deseas eliminar?")) {
        this.deletePreventivo(item);
        this.getPreventivos();
      }
    },
    handlePreventivCreated() {
      this.dialogCreatPreventivo = false;
      this.getPreventivos();
    },
    async getTareas() {
      try {
        const snapshot = await getDocs(collection(db, "tareas"));
        const tareasDb = [];

        snapshot.forEach((doc) => {
          let tareasData = doc.data();
          tareasData.id = doc.id;
          tareasDb.push(tareasData);
        });

        this.tareas = tareasDb;
      } catch (error) {
        console.log(error);
      }
    },
    validateForm() {
      this.$refs.form.validate();
    },
    sendItem(item) {
      eventBus.$emit("item-selected", item);
    },
    async deletePreventivo(item) {
      try {
        const docRef = doc(db, "preventivos", item.id);
        await deleteDoc(docRef);
        this.getPreventivos();
      } catch (error) {
        console.log(error);
      }
    },
    async getMachines() {
      try {
        const snapshot = await getDocs(collection(db, "machines"));
        const machines = [];

        snapshot.forEach((doc) => {
          let machinesData = doc.data();
          machinesData.id = doc.id;
          machines.push(machinesData);
        });

        this.machines = machines;
      } catch (error) {
        console.log(error);
      }
    },
    async getPreventivos() {
      try {
        const snapshot = await getDocs(collection(db, "preventivos"));
        const preventivsDb = [];

        snapshot.forEach((doc) => {
          let preventivData = doc.data();
          preventivData.id = doc.id;
          preventivsDb.push(preventivData);
        });

        this.prevents = preventivsDb;
      } catch (error) {
        console.log(error);
      }
    },
    async addPreventivo() {
      try {
        await addDoc(collection(db, "preventivos"), {
          namePersonInCharge: this.namePersonInCharge,
          accessCode: this.generateUniqueId(),
          machineCode: this.machineCode,
          tareas: this.selectedPreventiv,
          startDate: this.startDate,
          state: "Pendiente",
        });
      } catch (error) {
        console.log(error);
      }
      this.getPreventivos();
      this.inizialite();
    },
    generateUniqueId() {
      const uniqueId = uuidv4();
      const truncatedId = uniqueId.substr(0, 6);
      return truncatedId;
    },
    inizialite() {
      this.nameTarea = "";
      this.category = "";
      this.selectedFrencunce = "";
      this.datos = "";
      this.selectedRepuesto = [];
    },
  },
};
</script>

<style scoped>
.disabled {
  opacity: 0.5;
}
</style>