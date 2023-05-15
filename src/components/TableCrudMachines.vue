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
          <v-btn class="mx-2" fab dark color="indigo" @click="dialog = true">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </div>
      </template>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="machines"
      :search="search"
      @click="selectedMachine = item"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" color="red" @click="deleteMachine(item)"
          >mdi-delete</v-icon
        >
        <v-icon
          small
          color="blue"
          @click="
            selectedMachine = item;
            dialogUpdate = true;
          "
          >mdi-pencil</v-icon
        >
      </template>
    </v-data-table>

    <!-- Modal Modificar Maquina -->
    <v-dialog v-model="dialogUpdate">
      <v-card>
        <v-container>
          <v-form @submit.prevent="updateMachine(selectedMachine)">
            <p><b>CARACTERISTICAS TÉCNICAS</b></p>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Agregar Tipo de maquina"
                  v-model="selectedMachine.type"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Ubicacion"
                  v-model="selectedMachine.location"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Código Máquina"
                  v-model="selectedMachine.machineCode"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Departamento"
                  v-model="selectedMachine.department"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Potencia Motor Principal (CV)"
                  v-model="selectedMachine.mainMotorPower"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Potencia Motor Avances (CV)"
                  v-model="selectedMachine.feedMotorPower"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Potencia Motobomba(CV)"
                  v-model="selectedMachine.pumpMotorPower"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Corriente (V)"
                  v-model="selectedMachine.current"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Velocidad Máxima (RPM)"
                  v-model="selectedMachine.maximumSpeed"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Velocidad Mínima (RPM)"
                  v-model="selectedMachine.minimumSpeed"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Nº de Velocidades"
                  v-model="selectedMachine.numberOfSpeeds"
                ></v-text-field>
              </v-col>
            </v-row>
            <p><b>AVANCES MÁXIMOS</b></p>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Avance Máximo Longitudinal"
                  v-model="selectedMachine.maximumLongitudinalFeed"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Nº avances longitudinales"
                  v-model="selectedMachine.numberOfLongitudinalFeeds"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Avance Máximo Transversal"
                  v-model="selectedMachine.maximumTransversalFeed"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Nº avances Transversal"
                  v-model="selectedMachine.numberOfTransversalFeeds"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Avance Máximo Vertical"
                  v-model="selectedMachine.maximumVerticalFeed"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Nº avances Vertical"
                  v-model="selectedMachine.numberOfVerticalFeeds"
                ></v-text-field>
              </v-col>
            </v-row>
            <p><b>AVANCES MÍNIMOS</b></p>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Avance Mínimo Longitudinal"
                  v-model="selectedMachine.minimumLongitudinalFeed"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Avance Mínimo Transversal"
                  v-model="selectedMachine.minimumTransversalFeed"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Avance Mínimo vertical"
                  v-model="selectedMachine.minimumVerticalFeed"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-file-input
              v-model="image"
              accept="image/*"
              label="Agregar una imagen"
            ></v-file-input>
            <v-btn
              type="submit"
              color="primary"
              class="mr-4"
              @click.stop="dialogUpdate = false"
              >Guardar Cambios</v-btn
            >
            <v-btn color="primary" class="mr-4" @click="dialogUpdate = false"
              >Cancelar</v-btn
            >
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Modal Agregar Maquina -->
    <v-dialog v-model="dialog">
      <v-card>
        <v-container>
          <v-form @submit.prevent="addMachine">
            <p><b>CARACTERISTICAS TÉCNICAS</b></p>

            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Agregar Tipo de maquina"
                  v-model="type"
                  :error-messages="typeErrors"
                  required
                  @input="$v.type.$touch()"
                  @blur="$v.type.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Ubicacion"
                  v-model="location"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Código Máquina"
                  v-model="machineCode"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="text"
                  label="Departamento"
                  v-model="department"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Potencia Motor Principal (CV)"
                  v-model="mainMotorPower"
                  :rules="[
                    (val) =>
                      val >= 0 ||
                      'La potencia del motor principal debe ser igual o mayor que 0',
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Potencia Motor Avances (CV)"
                  v-model="feedMotorPower"
                  :rules="[
                    (val) =>
                      val >= 0 ||
                      'La potencia del motor de avances debe ser igual o mayor que 0',
                  ]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Potencia Motobomba(CV)"
                  v-model="pumpMotorPower"
                  :rules="[
                    (val) =>
                      val >= 0 ||
                      'La potencia del Motobomba debe ser igual o mayor que 0',
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Corriente (V)"
                  v-model="current"
                  :rules="[
                    (val) =>
                      val >= 0 || 'La corriente debe ser igual o mayor que 0',
                  ]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Velocidad Máxima (RPM)"
                  v-model="maximumSpeed"
                  :rules="[
                    (val) =>
                      val >= 0 ||
                      'Lavelocidad máxima debe ser igual o mayor que 0',
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Velocidad Mínima (RPM)"
                  v-model="minimumSpeed"
                  :rules="[
                    (val) =>
                      val >= 0 ||
                      'La velocidad minima debe ser igual o mayor que 0',
                  ]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Nº de Velocidades"
                  v-model="numberOfSpeeds"
                  :rules="[
                    (val) =>
                      val >= 0 ||
                      'El numero de velocidades debe ser igual o mayor que 0',
                  ]"
                ></v-text-field>
              </v-col>
            </v-row>
            <p><b>AVANCES MÁXIMOS</b></p>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Avance Máximo Longitudinal"
                  v-model="maximumLongitudinalFeed"
                  :rules="[
                    (val) =>
                      val >= 0 ||
                      'El avance máximo longitudinal debe ser igual o mayor que 0',
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Nº avances longitudinales"
                  v-model="numberOfLongitudinalFeeds"
                  :rules="[
                    (val) =>
                      val >= 0 ||
                      'El numero de avances debe ser igual o mayor que 0',
                  ]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Avance Máximo Transversal"
                  v-model="maximumTransversalFeed"
                  :rules="[
                    (val) =>
                      val >= 0 ||
                      'El avance máximo transversal debe ser igual o mayor que 0',
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Nº avances Transversal"
                  v-model="numberOfTransversalFeeds"
                  :rules="[
                    (val) =>
                      val >= 0 ||
                      'El Nº de avances transversal debe ser igual o mayor que 0',
                  ]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Avance Máximo Vertical"
                  v-model="maximumVerticalFeed"
                  :rules="[
                    (val) =>
                      val >= 0 ||
                      'El avance máximo vertical debe ser igual o mayor que 0',
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Nº avances Vertical"
                  v-model="numberOfVerticalFeeds"
                  :rules="[
                    (val) =>
                      val >= 0 ||
                      'EL Nº de avances vertical debe ser igual o mayor que 0',
                  ]"
                ></v-text-field>
              </v-col>
            </v-row>
            <p><b>AVANCES MÍNIMOS</b></p>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Avance Mínimo Longitudinal"
                  v-model="minimumLongitudinalFeed"
                  :rules="[
                    (val) =>
                      val >= 0 ||
                      'El avance minimo longitudinal debe ser igual o mayor que 0',
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Avance Mínimo Transversal"
                  v-model="minimumTransversalFeed"
                  :rules="[
                    (val) =>
                      val >= 0 ||
                      'El avance minimo transversal debe ser igual o mayor que 0',
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Avance Mínimo vertical"
                  v-model="minimumVerticalFeed"
                  :rules="[
                    (val) =>
                      val >= 0 ||
                      'El avance minimo vertical debe ser igual o mayor que 0',
                  ]"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-file-input
              v-model="image"
              accept="image/*"
              label="Agregar una imagen"
            ></v-file-input>
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
      dialog: false,
      machines: [],
      dialogUpdate: false,
      typeErrors: [],

      selectedMachine: [],
      item: null,
      formulario: false,
      image: null,
      type: null,
      location: null,
      machineCode: null,
      department: null,
      mainMotorPower: null,
      feedMotorPower: null,
      pumpMotorPower: null,
      current: null,
      maximumSpeed: null,
      minimumSpeed: null,
      numberOfSpeeds: null,
      maximumLongitudinalFeed: null,
      numberOfLongitudinalFeeds: null,
      maximumTransversalFeed: null,
      numberOfTransversalFeeds: null,
      maximumVerticalFeed: null,
      numberOfVerticalFeeds: null,
      minimumLongitudinalFeed: null,
      minimumTransversalFeed: null,
      minimumVerticalFeed: null,

      headers: [
        {
          text: "Cod.Maquina",
          align: "start",
          filterable: false,
          value: "machineCode",
        },
        { text: "Tipo", value: "type" },
        { text: "Ubicación", align: "center", value: "location" },
        {
          text: "Potencia Motor Principal",
          align: "center",
          value: "mainMotorPower",
        },
        { text: "Velocidad Máxima", align: "center", value: "maximumSpeed" },
        { text: "Acciones", value: "actions" },
      ],
    };
  },
  created() {
    this.getMachines();
  },
  methods: {
    async updateMachine(selectedMachine) {
      try {
        const docRef = doc(db, "machines", selectedMachine.id);
        await updateDoc(docRef, {
          type: selectedMachine.type,
          location: selectedMachine.location,
          machineCode: selectedMachine.machineCode,
          department: selectedMachine.department,
          mainMotorPower: selectedMachine.mainMotorPower,
          feedMotorPower: selectedMachine.feedMotorPower,
          pumpMotorPower: selectedMachine.pumpMotorPower,
          current: selectedMachine.current,
          maximumSpeed: selectedMachine.maximumSpeed,
          minimumSpeed: selectedMachine.minimumSpeed,
          numberOfSpeeds: selectedMachine.numberOfSpeeds,
          maximumLongitudinalFeed: selectedMachine.maximumLongitudinalFeed,
          numberOfLongitudinalFeeds: selectedMachine.numberOfLongitudinalFeeds,
          maximumTransversalFeed: selectedMachine.maximumTransversalFeed,
          numberOfTransversalFeeds: selectedMachine.numberOfTransversalFeeds,
          maximumVerticalFeed: selectedMachine.maximumVerticalFeed,
          numberOfVerticalFeeds: selectedMachine.numberOfVerticalFeeds,
          minimumLongitudinalFeed: selectedMachine.minimumLongitudinalFeed,
          minimumTransversalFeed: selectedMachine.minimumTransversalFeed,
          minimumVerticalFeed: selectedMachine.minimumVerticalFeed,
        });
        this.getMachines();
      } catch (error) {
        console.log(error);
      }
    },

    async deleteMachine(item) {
      try {
        const docRef = doc(db, "machines", item.id);
        await deleteDoc(docRef);
        this.getMachines();
      } catch (error) {
        console.log(error);
      }
    },
    async getMachines() {
      try {
        const snapshot = await getDocs(collection(db, "machines"));
        const machines = [];

        snapshot.forEach((doc) => {
          let machineData = doc.data();
          machineData.id = doc.id;
          machines.push(machineData);
        });

        this.machines = machines;
      } catch (error) {
        console.log(error);
      }
    },
    async addMachine() {
  try {
    if (
      !camposVacios(
        //this.image,
        this.type,
        this.location,
        this.machineCode,
        this.department,
        this.mainMotorPower,
        this.feedMotorPower,
        this.pumpMotorPower,
        this.current,
        this.maximumSpeed,
        this.minimumSpeed,
        this.numberOfSpeeds,
        this.maximumLongitudinalFeed,
        this.numberOfLongitudinalFeeds,
        this.maximumTransversalFeed,
        this.numberOfTransversalFeeds,
        this.maximumVerticalFeed,
        this.numberOfVerticalFeeds,
        this.minimumLongitudinalFeed,
        this.minimumTransversalFeed,
        this.minimumVerticalFeed
      )
    ) {
      const querySnapshot = await getDocs(
        query(collection(db, "machines"), where("machineCode", "==", this.machineCode))
      );
      if (querySnapshot.size === 0) {
        await addDoc(collection(db, "machines"), {
          // image: this.image,
          type: this.type,
          location: this.location,
          machineCode: this.machineCode,
          department: this.department,
          mainMotorPower: this.mainMotorPower,
          feedMotorPower: this.feedMotorPower,
          pumpMotorPower: this.pumpMotorPower,
          current: this.current,
          maximumSpeed: this.maximumSpeed,
          minimumSpeed: this.minimumSpeed,
          numberOfSpeeds: this.numberOfSpeeds,
          maximumLongitudinalFeed: this.maximumLongitudinalFeed,
          numberOfLongitudinalFeeds: this.numberOfLongitudinalFeeds,
          maximumTransversalFeed: this.maximumTransversalFeed,
          numberOfTransversalFeeds: this.numberOfTransversalFeeds,
          maximumVerticalFeed: this.maximumVerticalFeed,
          numberOfVerticalFeeds: this.numberOfVerticalFeeds,
          minimumLongitudinalFeed: this.minimumLongitudinalFeed,
          minimumTransversalFeed: this.minimumTransversalFeed,
          minimumVerticalFeed: this.minimumVerticalFeed,
        });
        this.getMachines();
      } else {
        console.log("Ya existe una máquina con el mismo machineCode");
      }
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
  image: null;
  type: null;
  location: null;
  machineCode: null;
  department: null;
  mainMotorPower: null;
  feedMotorPower: null;
  pumpMotorPower: null;
  current: null;
  maximumSpeed: null;
  minimumSpeed: null;
  numberOfSpeeds: null;
  maximumLongitudinalFeed: null;
  numberOfLongitudinalFeeds: null;
  maximumTransversalFeed: null;
  numberOfTransversalFeeds: null;
  maximumVerticalFeed: null;
  numberOfVerticalFeeds: null;
  minimumLongitudinalFeed: null;
  minimumTransversalFeed: null;
  minimumVerticalFeed: null;
}
function camposVacios(
  //image,
  type,
  location,
  machineCode,
  department,
  mainMotorPower,
  feedMotorPower,
  pumpMotorPower,
  current,
  maximumSpeed,
  minimumSpeed,
  numberOfSpeeds,
  maximumLongitudinalFeed,
  numberOfLongitudinalFeeds,
  maximumTransversalFeed,
  numberOfTransversalFeeds,
  maximumVerticalFeed,
  numberOfVerticalFeeds,
  minimumLongitudinalFeed,
  minimumTransversalFeed,
  minimumVerticalFeed
) {
  if (
    // image === "" ||
    type.value === "" ||
    location.value === "" ||
    machineCode.value === "" ||
    department.value === "" ||
    mainMotorPower.value === "" ||
    feedMotorPower.value === "" ||
    pumpMotorPower.value === "" ||
    current.value === "" ||
    maximumSpeed.value === "" ||
    minimumSpeed.value === "" ||
    numberOfSpeeds.value === "" ||
    maximumLongitudinalFeed.value === "" ||
    numberOfLongitudinalFeeds.value === "" ||
    maximumTransversalFeed.value === "" ||
    numberOfTransversalFeeds.value === "" ||
    maximumVerticalFeed.value === "" ||
    numberOfVerticalFeeds.value === "" ||
    minimumLongitudinalFeed.value === "" ||
    minimumTransversalFeed.value === "" ||
    minimumVerticalFeed.value === ""
  ) {
    return true;
  } else {
    return false;
  }
}
</script>
