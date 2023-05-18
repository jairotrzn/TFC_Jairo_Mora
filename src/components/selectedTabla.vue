<template>
  <v-data-table
    v-model="selected"
    :headers="headersTablaRepuestos"
    :items="filteredRepuestos"
    :single-select="singleSelect"
    item-key="idRepuesto"
    show-select
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Repuestos</v-toolbar-title>
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
</template>

<script>
import { db, collection, getDocs } from "../main";

export default {
  data() {
    return {
      singleSelect: false,
      selected: [],
      repuestos: [],
      search: "",
      headersTablaRepuestos: [
        {
          text: "Identificador",
          align: "start",
          filterable: false,
          value: "id",
        },
        { text: "Nombre", value: "name" },
        { text: "Precio €", align: "center", value: "price" },
        { text: "Proveedor", align: "center", value: "supplier" },
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
  
    async getRepuestos() {
      try {
        const snapshot = await getDocs(collection(db, "repuestos"));
        const repuestos = [];

        snapshot.forEach((doc) => {
          let repuestosData = doc.data();
          repuestosData.id = doc.id;
          repuestos.push(repuestosData);
        });

        this.repuestos = repuestos;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
