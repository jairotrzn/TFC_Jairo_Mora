<template>
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
                  val >= 0 || 'Lavelocidad máxima debe ser igual o mayor que 0',
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
</template>

<script>
/**
 * @fileoverview Machines Component
 * @module Machines
 */

import eventBus from "@/config/eventBus";
import MachineDetail from "@/components/machineComponents/machineDetails.vue";
import tablePreventivMachineDetail from "@/components/machineComponents/tablePreventivMachineDetail.vue";
import machineRepository from "@/repository/machineRepository";
import Constants from '@/assets/Constants'
export default {
  /**
   * Component data.
   * @returns {Object} Machines component data object.
   */
  data() {
    return {
      dialogMachineDetail: false,
      dialogDelete: false,
      dialogoConfirmUpdate: false,
      search: "",
      dialog: false,
      machines: [],
      dialogUpdate: false,
      typeErrors: [],

      binaryData: "",

      selectedMachine: [],
      item: null,
      formulario: false,
      image: "",
      type: "",
      location: "",
      machineCode: "",
      department: "",
      mainMotorPower: "",
      feedMotorPower: "",
      pumpMotorPower: "",
      current: "",
      maximumSpeed: "",
      minimumSpeed: "",
      numberOfSpeeds: "",
      maximumLongitudinalFeed: "",
      numberOfLongitudinalFeeds: "",
      maximumTransversalFeed: "",
      numberOfTransversalFeeds: "",
      maximumVerticalFeed: "",
      numberOfVerticalFeeds: "",
      minimumLongitudinalFeed: "",
      minimumTransversalFeed: "",
      minimumVerticalFeed: "",


      

      headers: [
        {
          text: Constants.MACHINE_CODE,
          align: "start",
          filterable: false,
          value: Constants.VALUE_MACHINE_CODE,
        },
        { text:  Constants.TIPO, value:  Constants.VALUE_TYPE },
        { text:  Constants.LOCALIZACION, align: "center", value:  Constants.VALUE_LOCATION },
        {
          text:  Constants.POTENCIA_MOTOR_PRINCIPAL,
          align: "center",
          value: Constants.VALUE_MAIN_MOTOR_POWER,
        },
        { text:  Constants.VELOCIDAD_MAXIMA, align: "center", value:  Constants.VALUE_MAXIMUM_SPEED },
        { text:  Constants.ACCIONES, value:  Constants.VALUE_ACTIONS },
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
  components: {
    MachineDetail,
    tablePreventivMachineDetail,
  },
  methods: {
    sendItem(item) {
      eventBus.$emit("item-selected", item);
    },
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
        const machineData = {
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
        };
        await machineRepository.upDate(machineData);
        this.dialogConfirmUpdate = false;
        this.dialogUpdate = false;
        this.selectedMachine = [];
        this.getMachines();
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * Delete a machine.
     * @param {Object} item - The machine object to delete.
     * @returns {void}
     */
    async deleteMachine(item) {
      await machineRepository.delete(item);
    },
    /**
     * Retrieve the list of machines from the database.
     * @returns {void}
     */
    async getMachines() {
      try {
        this.machines = await machineRepository.getAll();
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
      try {
        const machineData = {
          image: this.binaryData,
          type: this.type,
          location: this.location,
          machineCode: this.machineCode,
          department: this.department,
          mainMotorPower: +this.mainMotorPower,
          feedMotorPower: +this.feedMotorPower,
          pumpMotorPower: +this.pumpMotorPower,
          current: +this.current,
          maximumSpeed: +this.maximumSpeed,
          minimumSpeed: +this.minimumSpeed,
          numberOfSpeeds: +this.numberOfSpeeds,
          maximumLongitudinalFeed: +this.maximumLongitudinalFeed,
          numberOfLongitudinalFeeds: +this.numberOfLongitudinalFeeds,
          maximumTransversalFeed: +this.maximumTransversalFeed,
          numberOfTransversalFeeds: +this.numberOfTransversalFeeds,
          maximumVerticalFeed: +this.maximumVerticalFeed,
          numberOfVerticalFeeds: +this.numberOfVerticalFeeds,
          minimumLongitudinalFeed: +this.minimumLongitudinalFeed,
          minimumTransversalFeed: +this.minimumTransversalFeed,
          minimumVerticalFeed: +this.minimumVerticalFeed,
        };

        await machineRepository.save(machineData);
        this.inizialite();
        this.$emit("machineCreated");

      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
