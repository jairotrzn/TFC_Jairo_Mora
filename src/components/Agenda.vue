<template>
  <v-row class="fill-height">
    <v-col cols="9">
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" @click="setToday"> Hoy </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Día</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Semana</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Mes</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 días</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :event-margin-bottom="3"
          :now="today"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          :weekdays="[1, 2, 3, 4, 5, 6, 0]"
          locale="es"
          :short-weekdays="false"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-toolbar-title v-if="selectedEvent.color === '#ff4040'">
                <span v-html="selectedEvent.name"></span>
              </v-toolbar-title>
              <v-toolbar-title v-else-if="selectedEvent.color === '#ecab0f'">
                <span v-html="selectedEvent.name"></span>
              </v-toolbar-title>
              <v-toolbar-title v-else-if="selectedEvent.color === '#90ffbb'">
                <span v-html="selectedEvent.name"></span>
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <p><b>Responsable</b></p>
              <span v-html="selectedEvent.namePersonInCharge"></span>
              <template v-if="selectedEvent.color === '#ff4040'">
                <p><b>Descripcion de la averia</b></p>
                <span v-html="selectedEvent.description"></span>
              </template>
              <template v-else-if="selectedEvent.color === '#ecab0f'">
                <p><b>Lista de tareas</b></p>
                <span v-html="selectedEvent.tareas.name"></span>
              </template>
              <template v-else-if="selectedEvent.color === '#90ffbb'">
                <p><b>Información de Máquina</b></p>

              </template>
              <template v-else>
                <p><b>Otro color</b></p>
                <span
                  >Esta es información para eventos con colores distintos a
                  rojo, azul y verde.</span
                >
              </template>
            </v-card-text>

          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
    <v-col cols="3">
      <v-card class="mt-4">
        <v-card-text>
          <div class="text-center">
            <h3>{{ getEventCountThisWeek }}</h3>
            <span>Eventos esta semana</span>
          </div>
        </v-card-text>
      </v-card>

      <v-alert
        v-if="getPastDueEventsCount > 0"
        type="error"
        class="mt-4 blinking"
      >
        Tienes {{ getPastDueEventsCount }} evento(s) atrasado(s).
      </v-alert>

      <v-alert v-else type="success" class="mt-4" color="green">
        Enhorabuena, tienes todas las tareas al día.
        <v-icon>mdi-thumb-up</v-icon>
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import preventivRepository from "@/repository/preventivRepository";
import faultRepository from "@/repository/faultRepository";

export default {
  data: () => ({
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: "month",
    typeToLabel: {
      month: "Mes",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
    },
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    name: null,
    details: null,
    color: "#1976D2",
    currentlyEditing: null,
    showCard: false,
  }),

  computed: {
    getPastDueEventsCount() {
      const today = new Date();
      return this.events.filter((event) => {
        const eventEnd = new Date(event.end);
        return eventEnd < today;
      }).length;
    },
    getEventCountThisWeek() {
      const today = new Date();
      const startOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay()
      );
      const endOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + (6 - today.getDay())
      );

      return this.events.filter((event) => {
        const eventEnd = new Date(event.end);
        return eventEnd >= startOfWeek && eventEnd <= endOfWeek;
      }).length;
    },
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long",
      });
    },
  },

  mounted() {
    this.$refs.calendar.checkChange();
  },

  created() {
    this.getEvents();
  },

  methods: {
    async getEvents() {
      try {
        const preventivs = await preventivRepository.getAll();
        const faults = await faultRepository.getAll();
        const futureTask = await preventivRepository.getPrevntivTask();

        this.events = [...faults, ...preventivs, ...futureTask].filter(
          (event) => event.state === "Pendiente"
        );

        this.transformEventsDateFormat();
      } catch (error) {
        console.log(error);
      }
    },

    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },

    getEventColor(event) {
      return event.color;
    },

    setToday() {
      this.focus = new Date().toISOString().substr(0, 10);
    },

    prev() {
      this.$refs.calendar.prev();
    },

    next() {
      this.$refs.calendar.next();
    },

    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    formatDateToTable(timestamp) {
      const date = new Date(timestamp.seconds * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },

    formatDateToYYYYMMDD(timestamp) {
      const date = new Date(timestamp.seconds * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    transformEventsDateFormat() {
      this.events.forEach((event) => {
        event.start = this.formatDateToYYYYMMDD(event.start);
        event.end = this.formatDateToYYYYMMDD(event.end);
      });
    },
  },
};
</script>

<style>
@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.blinking {
  animation: blink 2s infinite;
}
</style>
