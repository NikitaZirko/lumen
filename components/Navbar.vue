<template>
  <div>
    <v-app-bar app color="#2f2f2f" flat fixed tile>
      <v-card tile color="white" class="nav mx-auto d-flex align-center py-1">
        <v-item-group class="nav__block d-flex justify-center">
          <v-item>
            <v-btn
              min-width="120px"
              text
              class="text-capitalize"
              :class="[ (isYellow === 1) ? 'bt-yellow' : '' ]"
              @click="today"
            >Сегодня</v-btn>
          </v-item>
          <v-item>
            <v-btn
              min-width="120px"
              text
              class="text-capitalize"
              :class="[ (isYellow === 2) ? 'bt-yellow' : '' ]"
              @click="tomorrow"
            >Завтра</v-btn>
          </v-item>
        </v-item-group>

        <v-menu
          v-model="calendar"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="calendarPreviewText"
              append-icon="mdi-calendar"
              readonly
              hide-details
              v-on="on"
              class="cust-input"
              solo
              flat
              dense
              single-line
            ></v-text-field>
          </template>

          <v-date-picker
            @change="addQueryDate($event)"
            v-model="calendarPreview"
            :date-format="date => new Date(date).valueOf()"
            :allowed-dates="allowedDates"
            :min="limit[0]"
            :max="limit[1]"
            :show-current="currentDate"
            no-title
            color="black"
            locale="ru"
            @input="calendar = false; calendarPreviewText = calendarPreview"
          ></v-date-picker>
        </v-menu>

        <v-divider vertical></v-divider>

        <v-select
          :items="times"
          item-text="name"
          item-value="id"
          @change="addQueryTime($event)"
          label="Время сеанса "
          v-model="labelTime"
          hide-details
          solo
          flat
          class="cust-drop-item"
          :menu-props="{ bottom: true, offsetY: true }"
        ></v-select>

        <v-divider vertical></v-divider>

        <v-select
          :items="filters.genres"
          @change="addQueryGenre($event)"
          :label="labelGenre"
          v-model="labelGenre"
          hide-details
          solo
          flat
          item-text="title"
          class="cust-drop-item"
          :menu-props="{ bottom: true, offsetY: true }"
        ></v-select>

        <v-divider vertical></v-divider>

        <v-select
          :items="filterAgeRatings"
          @change="addQueryRating($event)"
          :label="labelAge"
          v-model="labelAge"
          hide-details
          solo
          flat
          class="cust-drop-item"
          :menu-props="{ bottom: true, offsetY: true }"
        ></v-select>

        <v-btn class="reset text-capitalize" depressed @click="resetQuery">
          Сбросить
          <v-icon right>mdi-window-close</v-icon>
        </v-btn>
      </v-card>
    </v-app-bar>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    calendar: false,
    calendarPreviewText: "Другая дата",
    calendarPreview: new Date().toISOString().substr(0, 10),
    currentDate: new Date().toISOString().substr(0, 10),
    labelAge: "Возраст",
    labelGenre: "Жанр",
    labelTime: "Время сеанса ",
    isYellow: 1,
    queryDate: new Date().toISOString().substr(0, 10),
    times: [
      {
        id: 1,
        name: "утренний",
        time_from: "T06:00:00",
        time_to: "T12:00:00"
      },
      {
        id: 2,
        name: "дневной",
        time_from: "T12:00:00",
        time_to: "T17:00:00"
      },
      {
        id: 3,
        name: "вечерний",
        time_from: "T17:00:00",
        time_to: "T22:00:00"
      },
      {
        id: 4,
        name: "ночной",
        time_from: "T22:00:00",
        time_to: "T06:00:00"
      }
    ],
    query: {
      age_rating: "",
      genre: "",
      from_time: "",
      to_time: "",
      from_date: "",
      to_date: "",
      time: ""
    }
  }),
  mounted() {
    this.$store.dispatch("films/allFilms", this.query);
    this.$store.dispatch("films/filterFilms");
  },
  computed: {
    filters() {
      return this.$store.getters["films/filters"];
    },
    filterAgeRatings() {
      return this.$store.getters["films/filterAgeRatings"];
    },
    convertTimestamp() {
      return this.$store.getters["films/convertTimestamp"];
    },
    limit() {
      return this.$store.getters["films/limit"];
    },
    calendarDatesGet() {
      return this.$store.getters["films/convertTimestamp"];
    }
  },
  methods: {
    allowedDates: function(val, store) {
      return this.calendarDatesGet.indexOf(val.slice(-2)) == -1;
    },
    addQueryRating: function(value, store) {
      this.query.age_rating = "&age_rating=" + value.slice(0, -1) + "%2B";
      this.$store.dispatch("films/allFilms", this.query);
    },
    addQueryGenre: function(value, store) {
      let id,
        gen = this.$store.getters["films/filters"].genres;
      for (let i = 0; i < gen.length; i++) {
        if (value == gen[i].title) {
          id = gen[i].id;
        }
      }
      this.query.genre = "&genre=" + id;
      this.$store.dispatch("films/allFilms", this.query);
    },
    addQueryDate: function(value, store) {
      this.isYellow = true;
      this.query.from_date = "&from_date_formatted=" + value + "T06:00:00";
      this.query.to_date = "&to_date_formatted=" + value + "T24:00:00";
      this.$store.dispatch("films/allFilms", this.query);
      this.queryDate = value;
    },
    addQueryTime: function(value, store) {
      this.query.from_date =
        "&from_date_formatted=" +
        this.queryDate +
        this.times[value - 1].time_from;
      this.query.to_date =
        "&to_date_formatted=" + this.queryDate + this.times[value - 1].time_to;
      this.$store.dispatch("films/allFilms", this.query);
    },
    today: function(store) {
      this.isYellow = 1;
      this.calendarPreviewText = "Другая дата";
      this.query.from_date = "";
      this.query.to_date = "";
      this.$store.dispatch("films/allFilms", this.query);
      this.queryDate = new Date().toISOString().substr(0, 10);
    },
    tomorrow: function(date, store) {
      this.isYellow = 2;
      this.calendarPreviewText = "Другая дата";
      let dt = new Date();
      let day = new Date(dt);
      day.setDate(dt.getDate() + 1);
      let nextDay = day.toISOString().split("T")[0];
      this.query.from_date = "&from_date_formatted=" + nextDay + "T06:00:00";
      this.query.to_date = "&to_date_formatted=" + nextDay + "T24:00:00";
      this.$store.dispatch("films/allFilms", this.query);
      this.queryDate = nextDay;
    },
    resetQuery: function() {
      this.isYellow = 1;
      this.query.from_date = "";
      this.query.to_date = "";
      Object.keys(this.query).forEach(key => {
        this.query[key] = "";
      });
      this.$store.dispatch("films/allFilms", this.query);
      this.labelAge = "Возраст";
      this.labelGenre = "Жанр";
      this.labelTime = "Время сеанса ";
      this.calendarPreviewText = "Другая дата";
      this.queryDate = new Date().toISOString().substr(0, 10);
    }
  }
};
</script>

<style scoped>
.nav {
  padding: 0 8px;
  border-radius: 10px;
  transform: translate(0, 50%);
}

.cust-drop-item {
  display: block;
  height: 46px;
  width: 170px;
  color: black;
}

.cust-input {
  height: 38px;
  width: 154px;
  padding-left: 6px;
  cursor: pointer;
}

.bt-yellow {
  background: rgb(255, 235, 59);
}


@media (max-width: 767px) {
.nav {
  display: flex !important;
  flex-flow: column;
  padding: 20px 10px !important;
}
.nav__block {
  width: 100%;
  flex-flow: column;
}
.cust-input {
  width: 170px;
  padding-left: 0;
}
.reset {
  width: 100%;
}
}

@media (min-width: 768px) and (max-width: 991px) {
  /* стили для sm-устройств */
}
@media (min-width: 991px) and (max-width: 1199px) {
  /* стили для md-устройств */
}
@media (min-width: 1200px) {
  /* стили для lg-устройств */
}
</style>
