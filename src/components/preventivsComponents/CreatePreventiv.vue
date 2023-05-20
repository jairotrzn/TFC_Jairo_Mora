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
        v-model="selectedPreventiv"
        :headers="headersTablaTareas"
        :items="filteredTareas"
        :single-select="singleSelectTarea"
        item-key="nameTarea"
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
        :disabled="isFormIncomplete"
        >Crear Nuevo Preventivo</v-btn
      >
      <br />
    </v-form>
  </v-container>
</v-card>
</template>

<script>
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/main";
import { v4 as uuidv4 } from "uuid";

export default {
data() {
  return {
    startDate: "",
    machineCode: "",
    machines: [],
    tareas: [],
    namePersonInCharge: "",
    selectedPreventiv: [],
    search: "",
    headersTablaTareas: [
      { text: "Nombre", value: "nameTarea" },
      {
        text: "Categoria",
        align: "start",
        filterable: false,
        value: "category",
      },
      { text: "Frecuencia", align: "center", value: "selectedFrencunce" },
    ],
  };
},

created() {
  this.getMachines();
  this.getTareas();
},

computed: {
  filteredTareas() {
    const searchTerm = this.search.toLowerCase();
    return this.tareas.filter(
      (tarea) =>
        tarea.nameTarea.toLowerCase().includes(searchTerm) ||
        tarea.category.toLowerCase().includes(searchTerm) ||
        tarea.selectedFrencunce.toLowerCase().includes(searchTerm)
    );
  },
  getMachineCodeError() {
    return this.machineCode && !this.machines.includes(this.machineCode)
      ? "Opción no disponible"
      : "";
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
  async getTareas() {
    try {
      const snapshot = await getDocs(collection(db, "tareas"));
      this.tareas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.log(error);
    }
  },

  validateForm() {
    this.$refs.form.validate();
  },

  async getMachines() {
    try {
      const snapshot = await getDocs(collection(db, "machines"));
      this.machines = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.log(error);
    }
  },

  async addPreventivo() {
    try {
      await addDoc(collection(db, "preventivos"), {
        namePersonInCharge: this.namePersonInCharge,
        machineCode: this.machineCode,
        tareas: this.selectedPreventiv,
        startDate: this.startDate,
        accessCode: this.generateUniqueId(),
        state: "Pendiente",
        password:"",
      });
      this.$emit('preventivCreated');
    } catch (error) {
      console.log(error);
    }

    this.initializeForm();
  },

  generateUniqueId() {
    const uniqueId = uuidv4();
    return uniqueId.substr(0, 6);
  },

  initializeForm() {
    this.namePersonInCharge = "";
    this.machineCode = "";
    this.startDate = "";
    this.selectedPreventiv = [];
  },

  async getPreventivos() {
    try {
      const snapshot = await getDocs(collection(db, "preventivos"));
      this.prevents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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