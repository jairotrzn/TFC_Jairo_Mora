<template>
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
      <template>
        <div class="text-center">
          <v-btn
            class="mx-2"
            fab
            dark
            color="indigo"
            @click="dialogCreatTarea = true"
          >
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </div>
      </template>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="tareas"
      :search="search"
      @click:row="
        selectedTarea = $event;
        sendItem(selectedTarea);
      "
    >
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          color="red"
          @click="
            selectedTarea = item;
            confirmDelete(selectedTarea);
          "
          >mdi-delete</v-icon
        >
        <v-icon
          small
          color="blue"
          @click="
            selectedTarea = item;
            dialogUpDateTarea = true;
          "
          >mdi-pencil</v-icon
        >
      </template>
    </v-data-table>

    <!-- Modal Modificar tarea -->
    <v-dialog v-model="dialogUpDateTarea">
      <v-card>
        <v-container>
          <v-form @submit.prevent="dialogoConfirmDelete = true">
            <p><b>MODIFICAR TAREA</b></p>

            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Agregar nombre de tarea"
                  v-model="selectedTarea.nameTarea"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Categoria"
                  v-model="selectedTarea.category"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-combobox
                  v-model="selectedTarea.selectedFrencunce"
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
                      >Agregar</v-btn
                    >
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
                    :items="selectedTarea.datos"
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
                          @click="deleteDatos(item)"
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
                v-model="selectedTarea.selectedRepuesto"
                :headers="headersTablaRepuestos"
                :items="selectedTarea.repuestos"
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

            <v-btn
              color="primary"
              class="mr-4"
              text
              @click="confirmUpDate(selectedTarea); dialogUpDateTarea = false"
              >Actualizar</v-btn
            >
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Modal Crear tarea -->
    <v-dialog v-model="dialogCreatTarea">
      <CreateTask @taskCreated="handlTaskCreated()" />
    </v-dialog>
  </v-card>
</template>

<script>
import eventBus from "@/config/eventBus";
import CreateTask from "@/components/tareasComponents/CreateTask.vue";
import taskRepository from "@/repository/taskRepository";
import Constants from '@/assets/Constants';
export default {
  data() {
    return {
      singleSelect: false,
      repuestos: [],
      repuestosDB: [],
      searchRepuestos: "",
      selectedRepuesto: [],
      search: "",
      dialogCreatTarea: false,
      machines: [],
      dialogUpDateTarea: false,
      dialogoConfirmDelete: false,

      typeErrors: [],
      dialogDelete: false,
      datos: [],
      item: null,
      nuevoDato: "",
      selectedTarea: {},
      tareas: [],
      operaciones: null,
      nameTarea: "",
      category: "",
      priceRepuesto: "",
      provaiderRepuesto: "",
      selectedFrencunce: "",
      frecuencias:Constants.FRECUENCIAS,

      selected: [],
      repuestos: [],
      headersTablaRepuestos: [
        {
          text: Constants.ID_REPUESTO,
          align: "start",
          filterable: false,
          value: Constants.VALUE_ID_REPUESTO,
        },
        { text: Constants.NOMBRE_REPUESTO, value: "name" },
        { text: Constants.PRECIO, align: "center", value: Constants.VALUE_PRECIO },
        { text: Constants.PROVEEDOR, align: "center", value: Constants.VALUE_PROVEEDOR },
      ],
      headers: [
        {
          text: Constants.NOMBRE,
          align: "start",
          filterable: false,
          value: Constants.VALUE_NAME_TAREA,
        },
        { text: Constants.CATEGORIA, value: Constants.VALUE_CATEGORIA },
        { text: Constants.FRECUENCIA, align: "center", value: Constants.VALUE_FRECUENCIA },
        { text: Constants.ACCIONES, value: Constants.VALUE_ACTIONS },
      ],
    };
  },
  created() {
    /**
     * Retrieves the list of tareas from the database.
     * @returns {void}
     */
    this.getTareas();
},

computed: {
    /**
     * Checks if the form is valid.
     * @returns {boolean} - Returns true if the form is valid, otherwise false.
     */
    isFormValid() {
        return (
            this.nameTarea !== "" && this.category !== "" && this.nuevoDato !== ""
        );
    },

    /**
     * Filters the repuestos based on the search term.
     * @returns {Array} - Filtered repuestos.
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

components: {
    CreateTask,
},

methods: {
    /**
     * Handles the task creation event.
     * @returns {void}
     */
    handlTaskCreated() {
        this.dialogCreatTarea = false;
        this.getTareas();
    },

    /**
     * Deletes a dato from the selectedTarea object.
     * @param {Object} item - The dato object to be deleted.
     * @returns {void}
     */
    deleteDatos(item) {
        const index = this.selectedTarea.datos.indexOf(item);
        if (index !== -1) {
            this.selectedTarea.datos.splice(index, 1);
        }
    },

    /**
     * Asks for confirmation before deleting a tarea.
     * @param {Object} item - The tarea object to be deleted.
     * @returns {void}
     */
    confirmDelete(item) {
        if (confirm(Constants.CONFIRM_DELETE)) {
            this.deleteTarea(item);
            this.getAll();
        }
    },

    /**
     * Asks for confirmation before updating a tarea.
     * @param {Object} item - The tarea object to be updated.
     * @returns {void}
     */
    confirmUpDate(item) {
        if (confirm(Constants.CONFIRM_UP_DATE)) {
            this.updateTare(item);
            this.getAll();
        }
    },

    /**
     * Displays the names of the selected repuestos.
     * @returns {void}
     */
    mostrarDatosRepuestos() {
        const nombresSeleccionados = [];
        this.selectedRepuesto.forEach((item) => {
            nombresSeleccionados.push(item.nameRepuesto);
        });
        console.log("Nombres seleccionados:", nombresSeleccionados);
    },

    /**
     * Updates the selectedRepuesto array based on the selection state of repuestosDB items.
     * @returns {void}
     */
    updateSelectedItems() {
        this.selectedRepuestos = this.repuestosDB.filter(
            (item) => item.isSelected
        );
    },

    /**
     * Sends an item through the event bus.
     * @param {Object} item - The item to be sent.
     * @returns {void}
     */
    sendItem(item) {
        eventBus.$emit("item-selected", item);
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
        this.datos.push({ dato: this.nuevoDato });
        this.nuevoDato = "";
    },

    /**
     * Updates a tarea in the database.
     * @param {Object} selectedTarea - The tarea object to be updated.
     * @returns {void}
     */
    async updateTare(selectedTarea) {
      const tastkDate = {
                nameTarea: selectedTarea.nameTarea,
                category: selectedTarea.category,
                selectedFrencunce: selectedTarea.selectedFrencunce,
                provaiderRepuesto: selectedTarea.provaiderRepuesto,
      }
        try {
      await taskRepository.upDate(tastkDate)
            this.getRepuestos();
        } catch (error) {
            console.log(error);
        }
    },

    /**
     * Deletes a tarea from the database.
     * @param {Object} item - The tarea object to be deleted.
     * @returns {void}
     */
    async deleteTarea(item) {

        try {
         await taskRepository.delete(item)
         this.getTareas()
        } catch (error) {
            console.log(error);
        }
    },

    /**
     * Retrieves the list of tareas from the database.
     * @returns {void}
     */
    async getTareas() {
        try {
            this.tareas = await taskRepository.getAll()
        } catch (error) {
            console.log(error);
        }
    },
},
};
</script>