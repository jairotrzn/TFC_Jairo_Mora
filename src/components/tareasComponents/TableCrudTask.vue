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
              :disabled="!hayCambios"
              >Actualizar</v-btn
            >
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Modal Crear tarea -->
    <v-dialog v-model="dialogCreatTarea">
      <CreateTask />
    </v-dialog>
  </v-card>
</template>

<script>
import {
  db,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "@/repository/dataBase";
import eventBus from "@/config/eventBus";
import CreateTask from "@/components/tareasComponents/CreateTask.vue";
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
      frecuencias: ["Diaria", "Semanal", "Quincenal", "Mensual"],

      selected: [],
      repuestos: [],
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
      headers: [
        {
          text: "Nombre",
          align: "start",
          filterable: false,
          value: "nameTarea",
        },
        { text: "Categoria", value: "category" },
        { text: "Frecuencia", align: "center", value: "selectedFrencunce" },
        { text: "Acciones", value: "actions" },
      ],
    };
  },
  created() {
    this.getTareas();
  },
  computed: {
    isFormValid() {
      return (
        this.nameTarea !== "" && this.category !== "" && this.nuevoDato !== ""
      );
    },
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
    deleteDatos(item) {
    const index = this.selectedTarea.datos.indexOf(item);
    if (index !== -1) {
      this.selectedTarea.datos.splice(index, 1);
    }
  },
    confirmDelete(item) {
      if (confirm("¿Estás seguro de que deseas eliminar?")) {
        this.deleteTarea(item);
        this.getAll();
      }
    },
    confirmUpDate(item) {
      if (confirm("¿Estás seguro de que deseas modificar?")) {
        this.updateTare(item);
        this.getAll();
      }
    },

    mostrarDatosRepuestos() {
      const nombresSeleccionados = [];
      this.selectedRepuesto.forEach((item) => {
        nombresSeleccionados.push(item.nameRepuesto);
      });
      console.log("Nombres seleccionados:", nombresSeleccionados);
    },

    updateSelectedItems() {
      this.selectedRepuestos = this.repuestosDB.filter(
        (item) => item.isSelected
      );
    },
    sendItem(item) {
      eventBus.$emit("item-selected", item);
    },
    deleteDato(item) {
      const index = this.datos.indexOf(item);
      if (index !== -1) {
        this.datos.splice(index, 1);
      }
    },
    agregarDato() {
      this.datos.push({ dato: this.nuevoDato });
      this.nuevoDato = "";
    },
    async updateTare(selectedTarea) {
      try {
        const docRef = doc(db, "tareas", selectedTarea.id);
        await updateDoc(docRef, {
          nameTarea: selectedTarea.nameTarea,
          category: selectedTarea.category,
          selectedFrencunce: selectedTarea.selectedFrencunce,
          provaiderRepuesto: selectedTarea.provaiderRepuesto,
        });
        this.getRepuestos();
      } catch (error) {
        console.log(error);
      }
    },

    async deleteTarea(item) {
      try {
        const docRef = doc(db, "tareas", item.id);
        await deleteDoc(docRef);
        this.getTareas();
      } catch (error) {
        console.log(error);
      }
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
  },
};
</script>