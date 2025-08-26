<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-0">
        <!-- Header -->
        <v-row class="ma-0">
          <v-col cols="12" class="pa-4">
            <h1 class="text-h5 font-weight-bold text-black">Daftar Diskon</h1>
          </v-col>
        </v-row>

        <!-- Content Area -->
        <v-row class="ma-0 fill-height" justify="center" align="center" style="min-height: 70vh">
          <v-col cols="12" class="text-center">
            <v-card
              variant="outlined"
              class="mx-12 py-16 rounded-xl content-border"
              style="border-color: #ecedef"
            >
              <!-- Illustration Placeholder -->
              <div class="illustration-container mb-8">
                <div class="illustration-box">
                  <div class="illustration-content">
                    <div class="illustration-text">
                      <div class="text-caption text-black font-weight-bold mb-1">Illustration</div>
                      <div class="text-caption text-grey">Size 240 x 135</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Main Message -->
              <h2
                class="text-h6 font-weight-medium text-grey-darken-2 mb-3"
                :class="{ 'outlet-selected': selectedOutlet }"
              >
                {{ outletDisplayText }}
              </h2>

              <!-- Subtitle -->
              <p v-if="!selectedOutlet" class="text-body-2 text-grey mb-8">
                Silahkan pilih outlet terlebih dahulu.
              </p>

              <!-- Action Button -->
              <v-btn
                color="success"
                variant="tonal"
                size="large"
                rounded="lg"
                class="px-8 py-3"
                style="text-transform: none; font-weight: 500"
                @click="openOutletModal"
              >
                {{ selectedOutlet ? "Ganti outlet" : "Pilih outlet" }}
              </v-btn>

              <!-- Selected Outlet Info -->
              <div v-if="selectedOutlet" class="outlet-info mt-4">
                <v-card variant="outlined" class="pa-4">
                  <div class="d-flex align-center">
                    <v-icon color="success" class="mr-3">mdi-store</v-icon>
                    <div>
                      <div class="font-weight-bold">{{ selectedOutlet.name }}</div>
                      <div class="text-body-2 text-grey-600">{{ selectedOutlet.address }}</div>
                    </div>
                  </div>
                </v-card>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Pilih Outlet Modal -->
        <PilihOutletModal v-model="showOutletModal" @outlet-selected="onOutletSelected" />

        <!-- Footer -->
        <v-row class="ma-0 mt-auto">
          <v-col cols="12" class="pa-4">
            <div class="text-caption text-grey text-start">2024 © PT Nusantara Berkah Digital</div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from "vue";
import PilihOutletModal from "./modal/PilihOutletModal.vue";
import ApiService from "../../services/api.js";

// Reactive state
const showOutletModal = ref(false);
const selectedOutlet = ref(null);

// Computed untuk menampilkan nama outlet atau pesan default
const outletDisplayText = computed(() => {
  if (selectedOutlet.value) {
    return `${selectedOutlet.value.name} - ${selectedOutlet.value.address}`;
  }
  return "Belum ada outlet yang dipilih";
});

// Methods
const openOutletModal = () => {
  showOutletModal.value = true;
};

const onOutletSelected = (outlet) => {
  selectedOutlet.value = outlet;
  showOutletModal.value = false;
  console.log("Outlet selected:", outlet);
};
</script>

<style>
/* Global reset untuk memastikan full screen */
* {
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
}

html,
body {
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  background-color: #ffffff !important;
  overflow-x: hidden !important;
}

#app {
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
}

.v-application {
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
}

.v-app {
  margin: 0 !important;
  padding: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
}

.v-main {
  background-color: #ffffff !important;
  min-height: 100vh !important;
  width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
}

.v-container {
  max-width: 100% !important;
  width: 100vw !important;
  height: 100vh !important;
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  padding: 0 !important;
}

.illustration-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.illustration-box {
  width: 240px;
  height: 135px;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.illustration-content {
  text-align: center;
}

.illustration-text {
  color: #9e9e9e;
}

.fill-height {
  min-height: calc(100vh - 120px);
}

.v-btn {
  letter-spacing: 0;
}

.selected-outlet {
  background-color: rgba(76, 175, 80, 0.1) !important;
  border-left: 4px solid #4caf50 !important;
}

.selected-outlet:hover {
  background-color: rgba(76, 175, 80, 0.15) !important;
}

.outlet-selected {
  color: #4caf50 !important;
}

.outlet-info {
  max-width: 400px;
  margin: 0 auto;
}

.outlet-info .v-card {
  border-color: #4caf50 !important;
  background-color: rgba(76, 175, 80, 0.05) !important;
}
</style>
