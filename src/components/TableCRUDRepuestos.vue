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
          <v-btn class="mx-2" fab dark color="indigo" @click="dialogoCreateRepuesto = true">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </div>
      </template>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="repuestos"
      :search="search"
      @click="selectedRepuesto = item"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" color="red" @click="deleteRepuesto(item)"
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
                  label="Agregar Id de repuesto"
                  v-model="selectedRepuesto.idRepuesto"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Nombre de Repuesto"
                  v-model="selectedRepuesto.nameRepuesto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Precio €"
                  v-model="selectedRepuesto.priceRepuesto"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Proveedor"
                  v-model="selectedRepuesto.provaiderRepuesto"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-btn
              type="submit"
              color="primary"
              class="mr-4"
              @click.stop="dialogUpdateRepuesto = false"
              >Guardar Cambios</v-btn
            >
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

        <!-- Modal Agregar Repuesto -->
    <v-dialog v-model="dialogoCreateRepuesto">
      <v-card>
        <v-container>
          <v-form @submit.prevent="addRepuesto">
            <p><b>DATOS DE REPUESTO</b></p>

            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Agregar Id de repuesto"
                  v-model="idRepuesto"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Nombre de Repuesto"
                  v-model="nameRepuesto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Precio €"
                  v-model="priceRepuesto"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Proveedor"
                  v-model="provaiderRepuesto"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-btn
              type="submit"
              color="primary"
              class="mr-4"
              @click.stop="dialog = false"
              >Agregar</v-btn
            >
          </v-form>
        </v-container>
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
      dialogoCreateRepuesto: false,
      machines: [],
      dialogUpdateRepuesto: false,
      typeErrors: [],

      item: null,

      selectedRepuesto: [],
      repuestos: [],

      idRepuesto: null,
      nameRepuesto: null,
      priceRepuesto: null,
      provaiderRepuesto: null,

      headers: [
        {
          text: "Identificador",
          align: "start",
          filterable: false,
          value: "idRepuesto",
        },
        { text: "Nombre", value: "nameRepuesto" },
        { text: "Precio €", align: "center", value: "priceRepuesto" },
        {
          text: "Proveedor",
          align: "center",
          value: "provaiderRepuesto",
        },
        { text: "Acciones", value: "actions" },
      ],
    };
  }, 
  created() {
    this.getMachines();
  },
  methods: {
    async updateRepuesto(selectedRepuesto) {
      try {
        const docRef = doc(db, "repuestos", selectedRepuesto.id);
        await updateDoc(docRef, {
            idRepuesto: selectedRepuesto.idRepuesto,
            nameRepuesto: selectedRepuesto.nameRepuesto,
            priceRepuesto:selectedRepuesto.priceRepuesto,
            provaiderRepuesto:selectedRepuesto.provaiderRepuesto,
        });
        this.getMachines();
      } catch (error) {
        console.log(error);
      }
    },

    async deleteRepuesto(item) {
      try {
        const docRef = doc(db, "repuestos", item.id);
        await deleteDoc(docRef);
        this.getMachines();
      } catch (error) {
        console.log(error);
      }
    },
    async getMachines() {
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

    async addRepuesto() {
      try {
        if (
          !camposVacios(
            this.idRepuesto,
            this.nameRepuesto,
            this.priceRepuesto,
            this.provaiderRepuesto,
          )
        ) {
          await addDoc(collection(db, "repuestos"), {
            idRepuesto: this.idRepuesto,
            nameRepuesto: this.nameRepuesto,
            priceRepuesto:this.priceRepuesto,
            provaiderRepuesto:this.provaiderRepuesto,

          });
          this.getMachines();
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
      idRepuesto: null;
      nameRepuesto: null;
      priceRepuesto: null;
      provaiderRepuesto: null;
}
function camposVacios(
      idRepuesto,
      nameRepuesto,
      priceRepuesto,
      provaiderRepuesto
) {
  if (
 idRepuesto.value === "" ||
      nameRepuesto.value === "" ||
      priceRepuesto.value === "" ||
      provaiderRepuesto.value === "" 

  ) {
    return true;
  } else {
    return false;
  }
}
</script>
