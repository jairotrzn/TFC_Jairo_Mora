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
              @click.stop="
                confirmUpDate(selectedRepuesto), (dialogUpdateRepuesto = false)
              "
              >Guardar Cambios</v-btn
            >
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Modal Agregar Repuesto -->
    <v-dialog v-model="dialogAddRepuesto">
      <CreateSpare @spareCreated="handleSpareCreated" />
    </v-dialog>
  </v-card>
</template>

<script>
import CreateSpare from "@/components/repuestosComponents/CreateSpare.vue";
import repuestosRepository from "@/repository/repuestosRepository";
import Constants from "@/assets/Constants";
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
      /**
       * Filter the repuestos based on the search term.
       * @returns {Array} - Filtered repuestos
       */
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
    /**
     * Handles the event when a new spare part is created.
     * @returns {void}
     */
    handleSpareCreated() {
      this.dialogAddRepuesto = false;
      this.getRepuestos();
    },

    /**
     * Confirms the deletion of a repuesto.
     * @param {Object} item - The repuesto object to be deleted.
     * @returns {void}
     */
    confirmDelete(item) {
      if (confirm(Constants.CONFIRM_DELETE)) {
        this.deleteRepuesto(item);
        this.getRepuestos();
      }
    },

    /**
     * Confirms the update of a repuesto.
     * @param {Object} item - The repuesto object to be updated.
     * @returns {void}
     */
    confirmUpDate(item) {
      if (confirm(Constants.CONFIRM_UP_DATE)) {
        this.updateRepuesto(item);
        this.getRepuestos();
      }
    },

    /**
     * Updates a repuesto.
     * @param {Object} selectedRepuesto - The selected repuesto object.
     * @returns {void}
     */
    async updateRepuesto(selectedRepuesto) {
      const spareData = {
        idRepuesto: selectedRepuesto.idRepuesto,
        name: selectedRepuesto.name,
        price: selectedRepuesto.price,
        supplier: selectedRepuesto.supplier,
      };
      try {
        await repuestosRepository.upDate(spareData);
        this.getRepuestos();
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Deletes a repuesto.
     * @param {Object} item - The repuesto object to be deleted.
     * @returns {void}
     */
    async deleteRepuesto(item) {
      try {
        await repuestosRepository.delete(item);
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Retrieves the list of repuestos.
     * @returns {void}
     */
    async getRepuestos() {
      try {
        this.repuestos = await repuestosRepository.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Clears the form fields for creating a new repuesto.
     * @returns {void}
     */
    clearForm() {
      this.newRepuesto.idRepuesto = Constants.DEFAULT;
      this.newRepuesto.name = Constants.DEFAULT;
      this.newRepuesto.price = null;
      this.newRepuesto.supplier = Constants.DEFAULT;
    },

    /**
     * Checks if any field in the repuesto object is empty.
     * @param {Object} repuesto - The repuesto object.
     * @returns {boolean} - Returns true if any field is empty, otherwise false.
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
