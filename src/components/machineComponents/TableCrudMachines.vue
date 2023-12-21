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
      @click:row="
        selectedMachine = $event;
        sendItem(selectedMachine);
        dialogMachineDetail = true;
      "
    >
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          color="red"
          @click=" confirmDelete(item)"
          >mdi-delete</v-icon
        >
        <v-icon
          small
          color="blue"
          @click="
            dialogUpdate = true;
          "
          >mdi-pencil</v-icon
        >
      </template>
    </v-data-table>

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header
          ><b>Características técnicas</b></v-expansion-panel-header
        >
        <v-expansion-panel-content>
          <MachineDetail />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header
          ><b>Detalle preventivos</b></v-expansion-panel-header
        >
        <v-expansion-panel-content>
          <tablePreventivMachineDetail />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header
          ><b>Detalle averías</b></v-expansion-panel-header
        >
        <v-expansion-panel-content>
          <tableFaultMachineDetailVue />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

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
            <v-btn
              color="primary"
              class="mr-4"
              @click="confirmUpDate(selectedMachine)"
              >Guardar Cambios</v-btn
            >
   
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Modal Agregar Maquina -->
    <v-dialog v-model="dialog">
      <createMachine @machineCreated="handlePreventivCreated()" />
    </v-dialog>
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
import createMachine from "@/components/machineComponents/createMachin.vue";
import machineRepository from "@/repository/machineRepository";
import tableFaultMachineDetailVue from "../averiasComponents/tableFaultMachineDetail.vue";
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
          text: Constants.MACHINE_CODE,
          align: "start",
          filterable: false,
          value: "machineCode",
        },
        { text: Constants.TIPO, value: "type" },
        { text: "Location", align: "center", value: "location" },
        {
          text: Constants.POTENCIA_MOTOR_PRINCIPAL,
          align: "center",
          value: "mainMotorPower",
        },
        { text: Constants.VELOCIDAD_MAXIMA, align: "center", value: "maximumSpeed" },
        { text: Constants.ACCIONES, value: "actions" },
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
    tableFaultMachineDetailVue,
    MachineDetail,
    tablePreventivMachineDetail,
    createMachine,
  },

  methods: {
    /**
     * Handles the event when a new fault is created.
     */
    handlePreventivCreated() {
      this.dialog = false;
      this.getMachines();
    },
    /**
     * Confirms the deletion of a machine item.
     * @param {Object} item - The machine object to delete.
     */
    confirmDelete(item) {
      if (confirm(Constants.CONFIRM_DELETE)) {
        this.deleteMachine(item);
        this.getMachines();
      }
    },
    /**
     * Confirms the modification of a machine item.
     * @param {Object} item - The machine object to modify.
     */
    confirmUpDate(item) {
      if (confirm(Constants.CONFIRM_UP_DATE)) {
        this.updateMachine(item);
        this.getMachines();
      }
    },
    /**
     * Sends the selected machine item to another component.
     * @param {Object} item - The selected machine object.
     */
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
      console.log(selectedMachine)
      try {
        const machineData = {
          id:selectedMachine.id,
          image: selectedMachine.image,
          type: selectedMachine.type,
          location: selectedMachine.location,
          machineCode: selectedMachine.machineCode,
          department: selectedMachine.department,
          mainMotorPower: +selectedMachine.mainMotorPower,
          feedMotorPower: +selectedMachine.feedMotorPower,
          pumpMotorPower: +selectedMachine.pumpMotorPower,
          current: +selectedMachine.current,
          maximumSpeed: +selectedMachine.maximumSpeed,
          minimumSpeed: +selectedMachine.minimumSpeed,
          numberOfSpeeds: +selectedMachine.numberOfSpeeds,
          maximumLongitudinalFeed: +selectedMachine.maximumLongitudinalFeed,
          numberOfLongitudinalFeeds: +selectedMachine.numberOfLongitudinalFeeds,
          maximumTransversalFeed: +selectedMachine.maximumTransversalFeed,
          numberOfTransversalFeeds: +selectedMachine.numberOfTransversalFeeds,
          maximumVerticalFeed: +selectedMachine.maximumVerticalFeed,
          numberOfVerticalFeeds: +selectedMachine.numberOfVerticalFeeds,
          minimumLongitudinalFeed: +selectedMachine.minimumLongitudinalFeed,
          minimumTransversalFeed: +selectedMachine.minimumTransversalFeed,
          minimumVerticalFeed: +selectedMachine.minimumVerticalFeed,
        };
        await machineRepository.upDate(machineData);
        this.dialogConfirmUpdate = false;
        this.dialogUpdate = false;
        this.selectedMachine = [];
      } catch (error) {
        this.getMachines();
      }
    },
    /**
     * Delete a machine.
     * @param {Object} item - The machine object to delete.
     * @returns {void}
     */
    async deleteMachine(item) {
      try {
        await machineRepository.delete(item);
        this.getMachines();
      } catch (error) {
        console.log(error);
      }
    },

    async getMachines(){

      try{
        const callback = (snapshot) => {
          const machineList = []; 
          snapshot.forEach((doc) => {
            const machine = doc.data(); 
            machine.id = doc.id;
            machineList.push(machine); 
          });
          this.machines = machineList; 
        };
        const collectionRef = machineRepository.getCollectionRef();
        this.unsubscribe = machineRepository.subscribeToCollection(collectionRef,callback);
      }catch (error) {
        console.log(error);
        this.machines = [];
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
  },
};
</script>
