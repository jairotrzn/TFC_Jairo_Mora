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
      @click="selectedTarea = item, enviarItem(selectedTarea)"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          color="red"
          @click="(selectedTarea = item), (dialogDelete = true)"
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
          <v-form @submit.prevent="dialogoConfirmDlete=true">
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
                    :headers="tableHeaders"
                    :items="selectedTarea.datos"
                    hide-default-footer
                    class="elevation-1"
                  >
                    <template v-slot:item="{ item }">
                      <tr>
                        <td>{{ item }}</td>
                        <td>
                          <v-icon small color="red" @click="deleteDato(item)"
                            >mdi-delete</v-icon
                          >
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
            <v-btn
              type="submit"
              color="primary"
              class="mr-4"
              @click.stop="dialog = false"
              >Guardar cambios</v-btn
            >
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Modal Agregar Repuesto -->
    <v-dialog v-model="dialogCreatTarea">
      <v-card>
        <v-container>
          <v-form @submit.prevent="addTarea">
            <p><b>CREAR NUEVA TAREA</b></p>

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
                    <h5>Operaciones de la tarea</h5>
                  </v-card-title>

                  <v-data-table
                    :headers="tableHeaders"
                    :items="datos"
                    hide-default-footer
                    class="elevation-1"
                  >
                    <template v-slot:item="{ item }">
                      <tr>
                        <td>{{ item }}</td>
                        <td>
                          <v-icon small color="red" @click="deleteDato(item)"
                            >mdi-delete</v-icon
                          >
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
            <v-btn
              type="submit"
              color="primary"
              class="mr-4"
              @click.stop="dialogCreatTarea = false"
              >Crear Nueva Tarea</v-btn
            >
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Modal Confirmar Eliminar -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Eliminación</v-card-title>
        <v-card-text
          >¿Estás seguro de que deseas eliminar este elemento?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialogDelete = false"
            >Cancelar</v-btn
          >
          <v-btn
            color="green darken-1"
            text
            @click="deleteTarea(selectedTarea), (dialogDelete = false)"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

     <!-- Modal Confirmar upDate -->
    <v-dialog v-model="dialogoConfirmDlete" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Modificación</v-card-title>
        <v-card-text
          >¿Estás seguro de que deseas modificar este elemento?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialogoConfirmDlete = false"
            >Cancelar</v-btn
          >
          <v-btn
            color="green darken-1"
            text
            @click="updateTare(selectedTarea), (dialogoConfirmDlete = false),dialogUpDateTarea=false"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>
</template>

<script>
import { updateDoc } from "firebase/firestore";
import { db, collection, getDocs, addDoc, deleteDoc, doc } from "../main";

export default {
  data() {
    return {
      search: "",
      dialogCreatTarea: false,
      machines: [],
      dialogUpDateTarea: false,
      dialogoConfirmDlete:false,
      typeErrors: [],
      dialogDelete: false,
      datos: [],
      item: null,
      nuevoDato: "",
      selectedTarea: [],
      tareas: [],
      operaciones: null,
      nameTarea: null,
      category: null,
      priceRepuesto: null,
      provaiderRepuesto: null,
      selectedFrencunce: "",
      frecuencias: ["Diaria", "Semanal", "Quincenal", "Mensual"],

      //Atributo para enviar informacion de un componente a otro
      
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
  methods: {
    enviarItem(item){
      console.log("Voy a enviar el item " + item)
      this.$emit('item-selected',item)
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
        this.getTareas();
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
          tareasDb.push(tareasData); // Corrección aquí
        });

        console.log(tareasDb);
        this.tareas = tareasDb;
      } catch (error) {
        console.log(error);
      }
    },
    async addTarea() {
      try {
        if (
          !camposVacios(
            this.nameTarea,
            this.category,
            this.selectedFrencunce,
            this.datos
          )
        ) {
          await addDoc(collection(db, "tareas"), {
            nameTarea: this.nameTarea,
            category: this.category,
            selectedFrencunce: this.selectedFrencunce,
            datos: this.datos,
          });
          this.getTareas();
          inizialite();
        } else {
          console.log("los campos estan vacios");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};

function inizialite() {
  nameTarea: null;
  category: null;
  selectedFrencunce: null;
  datos: null;
}
function camposVacios(nameTarea, category, selectedFrencunce, datos) {
  if (
    nameTarea.value === "" ||
    category.value === "" ||
    selectedFrencunce.value === "" ||
    datos === ""
  ) {
    return true;
  } else {
    return false;
  }
}
</script>
