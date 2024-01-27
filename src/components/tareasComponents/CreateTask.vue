<template>
  <v-card>
    <v-container>
      <v-form @submit.prevent="addTarea">
        <p><b>AGREGAR TAREA</b></p>

        <v-row>
          <v-col cols="6">
            <v-text-field
              type="text"
              label="Agregar nombre de tarea"
              v-model="nameTarea"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              type="text"
              label="Categoria"
              v-model="category"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-combobox
              v-model="selectedFrencunce"
              :items="frecuencias"
              label="Selecciona una frecuencia"
            ></v-combobox>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-col cols="9">
                <v-text-field
                  type="text"
                  label="Describe una operación"
                  v-model="nuevoDato"
                ></v-text-field>
              </v-col>
              <v-col cols="3" class="align-self-center">
                <v-btn
                  color="primary"
                  @click="agregarDato"
                  :disabled="nuevoDato === ''"
                >Agregar</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <h5>Pasos de tarea</h5>
              </v-card-title>

              <v-data-table
                :items="datos"
                hide-default-footer
                class="elevation-1"
              >
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{ item }}</td>
                    <v-icon
                      small
                      class="mr-2"
                      color="red"
                      @click="
                        selectedTarea = item;
                        deleteDato(selectedTarea)
                      "
                    >mdi-delete</v-icon>
                  </tr>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card>
              <h4>Lista de repuestos necesarios</h4>
              <v-data-table
                v-model="selectedRepuesto"
                :headers="headersTablaRepuestos"
                :items="repuestosDB"
                :single-select="singleSelect"
                item-key="id"
                show-select
                class="elevation-1"
                @input="updateSelectedItems"
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
            </v-card>
          </v-col>
        </v-row>
        <br />
        <v-btn color="primary" class="mr-4" type="submit" :disabled="!isFormValid">
          Agregar Tarea
        </v-btn>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
 import taskRepository from '@/repository/taskRepository';
import  repuestosRepository from '@/repository/repuestosRepository'
export default {
  data() {
    return {
      singleSelect: false,
      searchRepuestos: "",
      selectedRepuesto: [],
      datos: [],
      nuevoDato: "",
      selectedTarea: [],
      nameTarea: "",
      category: "",
      selectedFrencunce: "",
      frecuencias: ["Diaria", "Semanal", "Quincenal", "Mensual"],
      repuestosDB: [],
      search: "",
      headersTablaRepuestos: [
        {
          text: "Identificador",
          align: "start",
          filterable: false,
          value: "idRepuesto",
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
    /**
     * Checks if the form is valid.
     * @returns {boolean} - Returns true if the form is valid, otherwise false.
     */
    isFormValid() {
      return (
        this.nameTarea !== "" &&
        this.category !== "" &&
        this.nuevoDato.length === 0
      );
    },

    /**
     * Filters the repuestos based on the search term.
     * @returns {Array} - Filtered repuestos
     */
    filteredRepuestos() {
      return this.repuestosDB.filter((repuesto) => {
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
     * Updates the selectedRepuesto array based on the selection state of repuestosDB items.
     * @returns {void}
     */
    updateSelectedItems() {
      this.selectedRepuestos = this.repuestosDB.filter((item) => item.isSelected);
    },

    /**
     * Deletes a dato from the datos array.
     * @param {Object} item - The dato object to be deleted.
     * @returns {void}
     */
    deleteDato(item) {
      const index = this.datos.indexOf(item);
      if (index !== -1) {
        this.datos.splice(index, 1);
      }
    },

    /**
     * Adds a new dato to the datos array.
     * @returns {void}
     */
    agregarDato() {
      this.datos.push( this.nuevoDato );
      this.nuevoDato = "";
    },

    /**
     * Retrieves the list of repuestos from the database.
     * @returns {void}
     */
    async getRepuestos() {

      try {
        this.repuestosDB = await repuestosRepository.getAll()
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * Adds a new tarea to the database.
     * @returns {void}
     */
    async addTarea() {

      const tastkDate = {
          name: this.nameTarea,
          category: this.category,
          selectedFrencunce: this.selectedFrencunce,
          datos: this.datos,
          repuestos: this.selectedRepuesto,
          state: "Pendiente",
          start: null,
          end: null,
          lastDate: "",
          color:"#90ffbb"

      } 
      try {
      await taskRepository.save(tastkDate)
      this.resetForm();

        this.$emit("taskCreated");
      } catch (error) {
        console.log(error);
      }
    },
    resetForm() {
      this.nameTarea = "";
      this.category = "";
      this.selectedFrencunce = "";
      this.datos = [];
      this.selectedRepuesto = [];
    },
  },
};
</script>