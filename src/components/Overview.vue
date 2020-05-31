<template>
  <div>
    <router-link :to="{ name: 'Detail' }">Go to detail</router-link>
    <div v-if="error">{{ error }}</div>
    <div class="grid">
      <div class="log">
        <h2>Log</h2>
        <div class="grid">
          <div>
            <h3>Buildings</h3>
            <pre v-for="(line, i) in buildingLog" :key="i">{{ line }}</pre>
          </div>
          <div>
            <h3>Locations</h3>
            <pre v-for="(line, i) in locationLog" :key="i">{{ line }}</pre>
          </div>
        </div>
      </div>
      <div>
        <h2>Data <button @click="reset">Reset all</button></h2>
        <div class="grid">
          <div>
            <h2>
              Buildings <button @click="addBuilding">Add</button> <button @click="removeBuilding">Remove last</button>
            </h2>
            <pre>{{ buildings }}</pre>
          </div>
          <div>
            <h2>
              Locations <button @click="addLocation">Add</button> <button @click="removeLocation">Remove last</button>
            </h2>
            <pre>{{ locations }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from 'firebase/app';
import Vue from 'vue';

interface Location {
  id: string;
  name: string;
  building: Building;
}

interface Building {
  id: string;
  name: string;
}

const db = firebase.firestore();

export default Vue.extend({
  name: 'Overview',
  data: (): {
    error?: Error;
    locations: Location[];
    buildings: Building[];
    buildingLog: string[];
    locationLog: string[];
  } => ({
    error: undefined,
    locations: [],
    buildings: [],
    locationLog: [],
    buildingLog: [],
  }),
  async created() {
    try {
      await this.$bind('buildings', db.collection('buildings').orderBy('name', 'asc'), { wait: true });
      await this.$bind('locations', db.collection('locations').orderBy('name', 'asc'), { wait: true });
    } catch (e) {
      console.log('err', e);
      this.error = e;
    }
  },
  watch: {
    locations: {
      immediate: true,
      deep: true,
      handler(locations: Location[]) {
        this.locationLog.unshift(JSON.stringify(locations, null, 2));
      },
    },
    buildings: {
      immediate: true,
      deep: true,
      handler(buildings: Building[]) {
        this.buildingLog.unshift(JSON.stringify(buildings, null, 2));
      },
    },
  },
  methods: {
    async reset() {
      await Promise.all([
        ...((await this.$firestoreRefs.buildings.get()) as firebase.firestore.QuerySnapshot<
          firebase.firestore.DocumentData
        >).docs.map(doc => doc.ref.delete()),
        ...((await this.$firestoreRefs.locations.get()) as firebase.firestore.QuerySnapshot<
          firebase.firestore.DocumentData
        >).docs.map(doc => doc.ref.delete()),
      ]);
      await this.addBuilding();
      await this.addLocation();
      this.$router.go(0);
    },
    async addBuilding() {
      try {
        await db.collection('buildings').add({ name: `Building ${this.buildings.length + 1}` });
      } catch (e) {
        this.error = e;
      }
    },
    async addLocation() {
      try {
        const index = this.locations.length + 1;
        const building = this.buildings[Math.min(this.locations.length, this.buildings.length - 1)];
        await db.collection('locations').add({
          name: `Location ${index}`,
          building: db.collection('buildings').doc(building.id),
        });
      } catch (e) {
        this.error = e;
      }
    },
    async removeBuilding() {
      try {
        const docs = ((await this.$firestoreRefs.buildings.get()) as firebase.firestore.QuerySnapshot<
          firebase.firestore.DocumentData
        >).docs;
        docs[docs.length - 1].ref.delete();
      } catch (e) {
        this.error = e;
      }
    },
    async removeLocation() {
      try {
        const docs = ((await this.$firestoreRefs.locations.get()) as firebase.firestore.QuerySnapshot<
          firebase.firestore.DocumentData
        >).docs;
        docs[docs.length - 1].ref.delete();
      } catch (e) {
        this.error = e;
      }
    },
  },
});
</script>

<style scoped>
.log {
  border-right: 2px gray solid;
  padding-right: 20px;
}
pre {
  padding: 10px;
  background: rgba(0, 0, 0, 0.05);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
}
</style>
