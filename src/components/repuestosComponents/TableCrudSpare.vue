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
            <v-btn
              class="mx-2"
              fab
              dark
              color="indigo"
              @click="dialogAddRepuesto = true"
            >
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
          <v-icon small class="mr-2" color="red" @click="confirmDelete(item)"
            >mdi-delete</v-icon
          >
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
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    type="text"
                    label="Nombre de Repuesto"
                    v-model="selectedRepuesto.name"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    type="number"
                    label="Precio €"
                    v-model="selectedRepuesto.price"
                    :rules="[positivePriceRule]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    type="text"
                    label="Proveedor"
                    v-model="selectedRepuesto.supplier"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
  
              <v-btn
                type="submit"
                color="primary"
                class="mr-4"
                @click.stop="confirmUpDate(selectedRepuesto), (dialogUpdateRepuesto = false)"
                >Guardar Cambios</v-btn
              >
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>
  
      <!-- Modal Agregar Repuesto -->
      <v-dialog v-model="dialogAddRepuesto">
        <CreateSpare />
      </v-dialog>
    </v-card>
  </template>
  
  <script>
  import {
    db,
    collection,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
  } from "@/repository/dataBase";
  import CreateSpare from "@/components/repuestosComponents/CreateSpare.vue";
  import repuestosRepository from "@/repository/repuestosRepository";
  export default {
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
        positivePriceRule: (value) => {
          return value > 0 || "El precio debe ser mayor que 0";
        },
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
    components: {
      CreateSpare,
    },
    methods: {
      confirmDelete(item) {
        if (confirm("¿Estás seguro de que deseas eliminar?")) {
          this.deleteRepuesto(item);
          this.getRepuestos();
        }
      },
      confirmUpDate(item) {
        if (confirm("¿Estás seguro de que deseas modificar?")) {
          this.updateRepuesto(item);
          this.getRepuestos();
        }
      },
      async updateRepuesto(selectedRepuesto) {
        const spareData = {
          idRepuesto: selectedRepuesto.idRepuesto,
            name: selectedRepuesto.name,
            price: selectedRepuesto.price,
            supplier: selectedRepuesto.supplier,
        }
        try {
          await repuestosRepository.upDate()
          this.getRepuestos();
        } catch (error) {
          console.log(error);
        }
      },
      async deleteRepuesto(item) {

        try {
          await repuestosRepository.delete();
        } catch (error) {
          console.log(error);
        }
      },
      async getRepuestos() {
        try {
          this.repuestos = await repuestosRepository.getAll();
        } catch (error) {
          console.log(error);
        }
      },
  
      clearForm() {
        this.newRepuesto.idRepuesto = "";
        this.newRepuesto.name = "";
        this.newRepuesto.price = null;
        this.newRepuesto.supplier = "";
      },
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