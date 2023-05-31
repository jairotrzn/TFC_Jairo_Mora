<template>
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
          >Agregar</v-btn
        >
      </v-form>
    </v-container>
  </v-card>
</template>

/** * Component representing a form for managing repuestos. * @module
RepuestosForm */
<script>
import repuestosRepository from "@/repository/repuestosRepository";
import Constants from '@/assets/Constants';
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
        { text: Constants.ID_REPUESTO, value: Constants.VALUE_ID_REPUESTO },
        { text: Constants.NOMBRE_REPUESTO, value: Constants.VALUE_NOMBRE_REPUESTO },
        { text: Constants.PRECIO, value: Constants.VALUE_PRECIO },
        { text: Constants.PROVEEDOR, value: Constants.VALUE_PROVEEDOR },
        { text: Constants.ACCIONES, value: Constants.VALUE_ACTIONS },
      ],
    };
  },

  computed: {
    /**
     * Filter the spare parts based on the search term.
     * @returns {Array} - Filtered spare parts
     */
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
     * Adds a new repuesto to the database.
     * @returns {Promise<void>}
     */
    async addRepuesto() {
      const spareDate = {
        idRepuesto: this.newRepuesto.idRepuesto,
        name: this.newRepuesto.name,
        price: this.newRepuesto.price,
        supplier: this.newRepuesto.supplier,
      };

      try {
        await repuestosRepository.save(spareDate);
        this.clearForm();
        this.$emit("spareCreated");
      } catch (error) {
        console.error(error);
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
