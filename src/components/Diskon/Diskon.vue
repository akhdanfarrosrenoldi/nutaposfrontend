<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-0">
        <!-- Header -->
        <v-row class="ma-0">
          <v-col cols="12" class="pa-4">
            <h1 class="text-h5 font-weight-bold text-black mb-3">Daftar Diskon</h1>
            <v-btn
              variant="outlined"
              size="small"
              class="text-none"
              prepend-icon="mdi-store"
              @click="openOutletModal"
            >
              {{ selectedOutlet ? selectedOutlet.name : 'Pilih Outlet' }}
              <v-icon class="ml-1">mdi-chevron-down</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <!-- Content Area -->
        <div v-if="discountList.length === 0">
          <v-row class="ma-0 fill-height" justify="center" align="center" style="min-height: 70vh">
            <v-col cols="12" class="text-center">
              <v-card
                variant="outlined"
                class="mx-12 py-16 rounded-xl content-border"
                style="border-color: #ecedef"
              >
                <!-- Illustration -->
                <div class="illustration-container mb-8">
                  <div class="empty-state-illustration">
                    <img
                      src="@/assets/il_empty_state_discount_not_available.svg"
                      alt="No Discount Available"
                      style="width: 240px; height: 135px"
                    />
                  </div>
                </div>

                <!-- Main Message -->
                <h2
                  class="text-h6 font-weight-medium text-grey-darken-2 mb-3"
                  :class="{ 'outlet-selected': selectedOutlet }"
                >
                  {{ selectedOutlet ? "Belum Ada Diskon" : outletDisplayText }}
                </h2>

                <!-- Subtitle -->
                <p class="text-body-2 text-grey mb-8">
                Silahkan tambah diskon untuk menarik pelanggan dan meningkatkan penjualan.
              </p>

              <!-- Action Button -->
              <v-btn
                color="success"
                variant="flat"
                size="large"
                rounded="lg"
                class="px-8 py-3"
                style="text-transform: none; font-weight: 500"
                prepend-icon="mdi-plus"
                @click="openTambahDiskonModal"
              >
                Tambah diskon
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
        </div>

        <!-- Daftar Diskon Component -->
        <div v-if="discountList.length > 0">
          <Daftar 
            :discount-list="discountList" 
            @back="backToEmptyState"
            @add-discount="openTambahDiskonModal"
            @update-discount="onDiskonUpdate"
            @delete-discounts="onDiskonDelete"
          />
        </div>

        <!-- Pilih Outlet Modal -->
    <PilihOutletModal
      v-model="showOutletModal"
      @outlet-selected="onOutletSelected"
    />

    <!-- Tambah Diskon Modal -->
    <TambahDiskonModal
      v-model="showTambahDiskonModal"
      @submit="onDiskonSubmit"
    />

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
import TambahDiskonModal from "./modal/TambahDiskonModal.vue";
import Daftar from "./Daftar.vue";
import ApiService from "../../services/api.js";

// Reactive state
const showOutletModal = ref(false);
const showTambahDiskonModal = ref(false);
const selectedOutlet = ref(null);
const discountList = ref([]);

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

const openTambahDiskonModal = () => {
  showTambahDiskonModal.value = true;
};

const onDiskonSubmit = async (diskonData) => {
  try {
    console.log("Diskon data:", diskonData);
    
    // Add new discount to the list
    const newDiscount = {
      id: Date.now(), // Simple ID generation
      name: diskonData.nama,
      value: diskonData.nilai,
      type: diskonData.tipe,
      isNew: true
    };
    
    discountList.value.push(newDiscount);
    
    // TODO: Implement API call to save discount
    // await ApiService.post('/diskon', diskonData);
    
    showTambahDiskonModal.value = false;
  } catch (error) {
    console.error("Error saving discount:", error);
  }
};

const backToEmptyState = () => {
  discountList.value = [];
};

const onDiskonUpdate = (updatedData) => {
  const index = discountList.value.findIndex(item => item.id === updatedData.id);
  if (index !== -1) {
    discountList.value[index] = {
      ...discountList.value[index],
      name: updatedData.nama,
      value: updatedData.nilai,
      type: updatedData.tipe
    };
  }
};

const onDiskonDelete = (selectedIds) => {
  // Remove selected discounts from the list
  discountList.value = discountList.value.filter(item => !selectedIds.includes(item.id));
  
  // TODO: Implement API call to delete discounts
  // await ApiService.delete('/diskon', { ids: selectedIds });
  
  console.log('Deleted discount IDs:', selectedIds);
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
