<<<<<<< HEAD
=======
<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="searchRepuestos"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <template>
        <div class="text-center">
          <v-btn class="mx-2" fab dark color="indigo" @click="dialogAddRepuesto = true">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </div>
      </template>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="repuestos"
      :search="searchRepuestos"
      @click="selectedRepuesto = item"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" color="red" @click="deleteRepuesto(item)">mdi-delete</v-icon>
        <v-icon
          small
          color="blue"
          @click="
            selectedRepuesto = item;
            dialogUpdateRepuesto = true;
          "
          >mdi-pencil</v-icon
        >
      </template>
    </v-data-table>

    <!-- Modal Modificar Repuesto -->
    <v-dialog v-model="dialogUpdateRepuesto">
      <v-card>
        <v-container>
          <v-form @submit.prevent="updateRepuesto(selectedRepuesto)">
            <p><b>DATOS DE REPUESTO</b></p>

            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="ID de Repuesto"
                  v-model="selectedRepuesto.idRepuesto"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Nombre de Repuesto"
                  v-model="selectedRepuesto.name"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Precio €"
                  v-model="selectedRepuesto.price"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Proveedor"
                  v-model="selectedRepuesto.supplier"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-btn
              type="submit"
              color="primary"
              class="mr-4"
              @click.stop="dialogUpdateRepuesto = false"
            >Guardar Cambios</v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Modal Agregar Repuesto -->
    <v-dialog v-model="dialogAddRepuesto">
      <v-card>
        <v-container>
          <v-form @submit.prevent="addRepuesto">
            <p><b>DATOS DE REPUESTO</b></p>

            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="ID de Repuesto"
                  v-model="newRepuesto.idRepuesto"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Nombre de Repuesto"
                  v-model="newRepuesto.name"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Precio €"
                  v-model="newRepuesto.price"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Proveedor"
                  v-model="newRepuesto.supplier"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-btn
              type="submit"
              color="primary"
              class="mr-4"
              :disabled="isAnyFieldEmpty(newRepuesto)"
              @click.stop="dialogAddRepuesto = false"
            >Agregar</v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-card>
</template>

/**
 * Component representing a form for managing repuestos.
 * @module RepuestosForm
 */
<script>

import { updateDoc } from "firebase/firestore";
import { db, collection, getDocs, addDoc, deleteDoc, doc } from "../main";

export default {
  /**
   * Data properties of the component.
   * @property {string} search - The search query for filtering repuestos.
   * @property {boolean} dialogAddRepuesto - Flag indicating whether the "Add Repuesto" dialog is open or not.
   * @property {boolean} dialogUpdateRepuesto - Flag indicating whether the "Update Repuesto" dialog is open or not.
   * @property {Object} selectedRepuesto - The currently selected repuesto.
   * @property {Array} repuestos - The list of repuestos.
   * @property {Object} newRepuesto - The new repuesto being added.
   * @property {string} newRepuesto.id - The ID of the new repuesto.
   * @property {string} newRepuesto.name - The name of the new repuesto.
   * @property {number|null} newRepuesto.price - The price of the new repuesto.
   * @property {string} newRepuesto.supplier - The supplier of the new repuesto.
   * @property {Array} headers - The table headers for displaying repuestos.
   */
  data() {
    return {
      searchRepuestos: "",
      dialogAddRepuesto: false,
      dialogUpdateRepuesto: false,
      selectedRepuesto: {},
      repuestos: [],
      newRepuesto: {
        idRepuesto: "",
        name: "",
        price: null,
        supplier: "",
      },
      headers: [
        { text: "ID de Repuesto", value: "idRepuesto" },
        { text: "Nombre de Repuesto", value: "name" },
        { text: "Precio €", value: "price" },
        { text: "Proveedor", value: "supplier" },
        { text: "Acciones", value: "actions" },
      ],
    };
  },
  created() {
    this.getRepuestos();
  },
  computed: {
    filteredRepuestos() {
      return this.repuestos.filter((repuesto) => {
        const searchTerm = this.search.toLowerCase();
        return (
          repuesto.nameRepuesto.toLowerCase().includes(searchTerm) ||
          repuesto.idRepuesto.toLowerCase().includes(searchTerm)
        );
      });
    },
  },
  methods: {
    /**
     * Updates the selected repuesto.
     * @param {Object} selectedRepuesto - The repuesto to be updated.
     * @returns {Promise<void>}
     */
    async updateRepuesto(selectedRepuesto) {
      try {
        const docRef = doc(db, "repuestos", selectedRepuesto.id);
        await updateDoc(docRef, {
          idRepuesto: selectedRepuesto.idRepuesto,
          name: selectedRepuesto.name,
          price: selectedRepuesto.price,
          supplier: selectedRepuesto.supplier,
        });
        this.getRepuestos();
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * Deletes a repuesto.
     * @param {Object} item - The repuesto to be deleted.
     * @returns {Promise<void>}
     */
    async deleteRepuesto(item) {
      try {
        const docRef = doc(db, "repuestos", item.id);
        await deleteDoc(docRef);
        this.getRepuestos();
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * Retrieves the list of repuestos from the database.
     * @returns {Promise<void>}
     */
    async getRepuestos() {
      try {
        const snapshot = await getDocs(collection(db, "repuestos"));
        const repuestos = [];

        snapshot.forEach((doc) => {
          let repuesto = doc.data();
          repuesto.id = doc.id;
          repuestos.push(repuesto);
        });

        this.repuestos = repuestos;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * Adds a new repuesto to the database.
     * @returns {Promise<void>}
     */
    async addRepuesto() {
      try {
        await addDoc(collection(db, "repuestos"), {
          idRepuesto: this.newRepuesto.idRepuesto,
          name: this.newRepuesto.name,
          price: this.newRepuesto.price,
          supplier: this.newRepuesto.supplier,
        });
        this.getRepuestos();
        this.clearForm();
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * Clears the new repuesto form.
     */
    clearForm() {
      this.newRepuesto.idRepuesto = "";
      this.newRepuesto.name = "";
      this.newRepuesto.price = null;
      this.newRepuesto.supplier = "";
    },
    /**
     * Checks if any field in the repuesto object is empty.
     * @param {Object} repuesto - The repuesto object to check.
     * @returns {boolean} - Returns true if any field is empty, false otherwise.
     */
    isAnyFieldEmpty(repuesto) {
      return (
        !repuesto.idRepuesto ||
        !repuesto.name ||
        repuesto.price === null ||
        !repuesto.supplier
      );
    },
  },
};
</script>

<style scoped>
.v-data-table__wrapper {
  max-height: 400px;
}
</style>
>>>>>>> e5fa00939dd858cbbeb0ed8fe120c9fc07a716f9
