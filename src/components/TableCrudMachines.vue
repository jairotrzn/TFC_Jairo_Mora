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
        <v-icon
          small
          class="mr-2"
          color="red"
          @click="(dialogDelete = true), (selectedMachine = item)"
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
          <v-form>
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
              color="primary"
              class="mr-4"
              @click="dialogoConfirmUpdate = true"
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
              @change="convertToBinary"
            ></v-file-input>
            <v-btn
              type="submit"
              color="primary"
              class="mr-4"
              @click.stop="dialog = false"
              :disabled="!areAllFieldsFilled"
              >Agregar</v-btn
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
            @click="deleteMachine(selectedMachine), (dialogDelete = false)"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Confirmar upDate -->
    <v-dialog v-model="dialogoConfirmUpdate" max-width="500px">
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
            @click="
              updateMachine(selectedMachine);
              (dialogoConfirmUpdate = false), (dialogUpdate = false);
            "
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
/**
 * @fileoverview Machines Component
 * @module Machines
 */

import { updateDoc } from "firebase/firestore";
import {
  db,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "../main";

export default {
  /**
   * Component data.
   * @returns {Object} Machines component data object.
   */
  data() {
    return {
      dialogDelete: false,
      dialogoConfirmUpdate: false,
      search: "",
      dialog: false,
      machines: [],
      dialogUpdate: false,
      typeErrors: [],

      binaryData: null,

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
          text: "Machine Code",
          align: "start",
          filterable: false,
          value: "machineCode",
        },
        { text: "Type", value: "type" },
        { text: "Location", align: "center", value: "location" },
        {
          text: "Main Motor Power",
          align: "center",
          value: "mainMotorPower",
        },
        { text: "Maximum Speed", align: "center", value: "maximumSpeed" },
        { text: "Actions", value: "actions" },
      ],
    };
  },
  /**
   * Method called when the component is created.
   * @returns {void}
   */
  created() {
    this.getMachines();
  },
  computed: {
    areAllFieldsFilled() {
      return (
        this.type &&
        this.location &&
        this.machineCode &&
        this.department &&
        this.mainMotorPower >= 0 &&
        this.feedMotorPower >= 0 &&
        this.pumpMotorPower >= 0 &&
        this.current >= 0 &&
        this.maximumSpeed >= 0 &&
        this.minimumSpeed >= 0 &&
        this.numberOfSpeeds >= 0 &&
        this.maximumLongitudinalFeed >= 0 &&
        this.numberOfLongitudinalFeeds >= 0 &&
        this.maximumTransversalFeed >= 0 &&
        this.numberOfTransversalFeeds >= 0 &&
        this.maximumVerticalFeed >= 0 &&
        this.numberOfVerticalFeeds >= 0 &&
        this.minimumLongitudinalFeed >= 0 &&
        this.minimumTransversalFeed >= 0 &&
        this.minimumVerticalFeed >= 0
      );
    },
  },
  methods: {
    /**
     * Convert the selected image to binary.
     * @returns {void}
     */
    convertToBinary() {
      const file = this.image;

      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const binary = reader.result;
          const binaryString = btoa(
            String.fromCharCode(...new Uint8Array(binary))
          );
          this.binaryData = binaryString;
        };
        reader.readAsArrayBuffer(file);
      }
    },
    /**
     * Update a machine.
     * @param {Object} selectedMachine - The selected machine object.
     * @returns {void}
     */
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

        this.dialogConfirmUpdate = false;
        this.dialogUpdate = false;
        this.selectedMachine = [];
        this.getMachines();
      } catch (error) {
        console.error("Error updating machine: ", error);
      }
    },
    /**
     * Delete a machine.
     * @param {Object} item - The machine object to delete.
     * @returns {void}
     */
    async deleteMachine(item) {
      try {
        const docRef = doc(db, "machines", item.id);
        await deleteDoc(docRef);
        this.getMachines();
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * Retrieve the list of machines from the database.
     * @returns {void}
     */
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
    /**
     * Initialize form fields.
     * @returns {void}
     */
    inizialite() {
      this.image = null;
      this.type = null;
      this.location = null;
      this.machineCode = null;
      this.department = null;
      this.mainMotorPower = null;
      this.feedMotorPower = null;
      this.pumpMotorPower = null;
      this.current = null;
      this.maximumSpeed = null;
      this.minimumSpeed = null;
      this.numberOfSpeeds = null;
      this.maximumLongitudinalFeed = null;
      this.numberOfLongitudinalFeeds = null;
      this.maximumTransversalFeed = null;
      this.numberOfTransversalFeeds = null;
      this.maximumVerticalFeed = null;
      this.numberOfVerticalFeeds = null;
      this.minimumLongitudinalFeed = null;
      this.minimumTransversalFeed = null;
      this.minimumVerticalFeed = null;
    },
    /**
     * Add a new machine to the database.
     * @returns {void}
     */
    async addMachine() {
      console.log("voy a agregar maquina");
      try {

          const querySnapshot = await getDocs(
            query(
              collection(db, "machines"),
              where("machineCode", "==", this.machineCode)
            )
          );
          if (querySnapshot.size === 0) {
            await addDoc(collection(db, "machines"), {
              image: this.binaryData,
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
            this.inizialite();
            this.getMachines();
          } else {
            console.log("Ya existe una máquina con el mismo machineCode");
          }
      } catch (error) {
        console.log(error);
      }
    },
  },
};

</script>
