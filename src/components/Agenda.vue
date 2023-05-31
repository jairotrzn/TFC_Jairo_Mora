<template>
  <v-row class="fill-height">
    <v-col cols="9">
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn color="primary" dark class="mr-4" @click="dialog = true">
            Agregar
          </v-btn>
          <v-btn outlined class="mr-4" @click="setToday">
            Hoy
          </v-btn>
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
  @change="updateRange"
  :weekdays="[1, 2, 3, 4, 5, 6, 0]"
  locale="es"
  :short-weekdays="false"
>
</v-calendar>
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
    </v-col>
  </v-row>
</template>

<script>
import { db, collection, getDocs, deleteDoc, doc, updateDoc } from "@/config/firebaseConfig";

export default {
  data: () => ({
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: 'month',
    typeToLabel: {
      month: 'Mes',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days',
    },
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    name: null,
    details: null,
    color: '#1976D2',
    dialog: false,
    currentlyEditing: null
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
      const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));

      return this.events.filter((event) => {
        const eventEnd = new Date(event.end);
        return eventEnd >= startOfWeek && eventEnd <= endOfWeek;
      }).length;
    },
    filteredEvents() {
  const today = new Date().toISOString().substr(0, 10);
  return this.events.filter((event) => {
    return event.end >= today && event.startDate !== undefined && event.startDate !== ""; // Filtrar por fecha de finalización y existencia de fecha de inicio
  });
},
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return '';
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? '' : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? '' : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case 'month':
          return `${startMonth} ${startYear}`;
        case 'week':
        case '4day':
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case 'day':
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return '';
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC',
        month: 'long',
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
    async updateEvent(ev) {
      try {
        const docRef = doc(db, 'eventos', ev.id);
        await updateDoc(docRef, {
          name: ev.name,
          details: ev.details
        });

        this.selectedOpen = false;
        this.currentlyEditing = null;


      } catch (error) {
        console.log(error);
      }
    },
    editEvent(id) {
      this.currentlyEditing = id;
    },
    async deleteEvent(ev) {
      try {
        const docRef = doc(db, 'eventos', ev.id);
        await deleteDoc(docRef);

        this.selectedOpen = false;
        this.getEvents();

      } catch (error) {
        console.log(error);
      }
    },
    async addEvent() {
      try {

        if (this.name && this.start && this.end) {
          await addDoc(collection(db, "eventos"), {
            name: this.name,
            details: this.details,
            startDate: this.start,
            endDate: this.end,
            color: this.color
          });

          this.getEvents();

          this.name = null;
          this.details = null;
          this.start = null;
          this.end = null;
          this.color = '#1976D2';

        } else {
          console.log('Campos obligatorios');
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getEvents() {
      try {
        const snapshot = await getDocs(collection(db, "preventivos"));
        const events = [];

        snapshot.forEach(doc => {
          let eventoData = doc.data();
          eventoData.id = doc.id;
          events.push(eventoData);
        });

        this.events = events;

      } catch (error) {

        console.log(error);
      }
    },
    viewDay({
      date
    }) {
      this.focus = date;
      this.type = 'day';
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
    showEvent({
      nativeEvent,
      event
    }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => this.selectedOpen = true, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({
      start,
      end
    }) {

      this.start = start;
      this.end = end;
    },
    nth(d) {
      return d > 3 && d < 21 ?
        'th' :
        ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10];
    },
  },
}
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