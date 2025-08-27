<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-0">
        <!-- Header -->
        <v-row v-if="discountList.length === 0" class="ma-0 pl-8 mt-8">
          <v-col cols="12" class="pa-4">
            <h1 class="text-h5 font-weight-bold text-black mb-3">Daftar Diskon</h1>
            <v-btn
              variant="outlined"
              size="small"
              class="text-none px-4"
              rounded="lg"
              style="border: 1px solid #e0e0e0; min-width: 20px; justify-content: flex-start"
              @click="openOutletModal"
            >
              <template v-slot:prepend>
                <v-img
                  src="/src/assets/outlet-icon.svg"
                  width="15"
                  height="15"
                  class="mr-2"
                ></v-img>
              </template>
              <span class="flex-grow-1 text-left">{{
                selectedOutlet ? selectedOutlet.name : "Pilih Outlet"
              }}</span>
              <v-icon class="ml-2" size="16" style="color: #666">mdi-chevron-down</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <!-- Content Area -->
        <div v-if="discountList.length === 0">
          <v-row
            class="ma-0 fill-height"
            justify="center"
            align="center"
            style="min-height: calc(100vh - 200px)"
          >
            <v-col cols="12" class="text-center">
              <div
                class="mx-9 my-4 py-18 rounded-xl"
                style="
                  border: 1px solid #e0e0e0;
                  min-height: calc(100vh - 230px);
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                "
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
                <h2 class="text-h6 mb-3 text-black" style="font-weight: 600">Belum Ada Diskon</h2>

                <!-- Subtitle -->
                <p class="text-body-2 text-black mb-2">
                  Silahkan tambah diskon untuk menarik pelanggan dan
                </p>
                <p class="text-body-2 text-black mb-8">meningkatkan penjualan.</p>

                <!-- Action Button -->
                <div style="display: flex; justify-content: center">
                  <v-btn
                    color="#3dae2f"
                    variant="elevated"
                    size="default"
                    rounded="xl"
                    class="px-3 py-2 text-none"
                    style="
                      font-weight: 500;
                      box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                        0 1px 5px 0 rgba(0, 0, 0, 0.12);
                    "
                    prepend-icon="mdi-plus"
                    @click="openTambahDiskonModal"
                  >
                    Tambah diskon
                  </v-btn>
                </div>
              </div>
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
        <PilihOutletModal v-model="showOutletModal" @outlet-selected="onOutletSelected" />

        <!-- Tambah Diskon Modal -->
        <TambahDiskonModal 
          v-model="showTambahDiskonModal" 
          :discount-list="discountList"
          @submit="onDiskonSubmit" 
        />

        <!-- Footer -->
        <v-row v-if="discountList.length === 0" class="ma-0 mt-auto">
          <v-col cols="12" class="pa-4">
            <div class="text-caption text-start">
              <span class="text-grey">2024 </span>
              <span class="text-black">© PT Nusantara Berkah Digital</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import PilihOutletModal from "./modal/PilihOutletModal.vue";
import TambahDiskonModal from "./modal/TambahDiskonModal.vue";
import Daftar from "./Daftar.vue";
import ApiService from "@/services/api.js";

// Reactive state
const showOutletModal = ref(false);
const showTambahDiskonModal = ref(false);
const selectedOutlet = ref(null);
const discountList = ref([]);

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

    // Save discount to API
    const newDiscount = await ApiService.createDiscount({
      name: diskonData.nama,
      value: diskonData.nilai,
      type: diskonData.tipe,
      isNew: true,
    });

    // Add new discount to the list
    discountList.value.push(newDiscount);

    showTambahDiskonModal.value = false;
  } catch (error) {
    console.error("Error saving discount:", error);
  }
};

const backToEmptyState = () => {
  discountList.value = [];
};

const onDiskonUpdate = async (updatedData) => {
  try {
    // Update discount in API
    await ApiService.updateDiscount(updatedData.id, {
      name: updatedData.nama,
      value: updatedData.nilai,
      type: updatedData.tipe,
    });

    // Update local list
    const index = discountList.value.findIndex((item) => item._id === updatedData.id);
    if (index !== -1) {
      discountList.value[index] = {
        ...discountList.value[index],
        name: updatedData.nama,
        value: updatedData.nilai,
        type: updatedData.tipe,
      };
    }
  } catch (error) {
    console.error("Error updating discount:", error);
  }
};

const onDiskonDelete = async (selectedIds) => {
  try {
    // Delete discounts from API
    for (const id of selectedIds) {
      await ApiService.deleteDiscount(id);
    }

    // Remove selected discounts from the list
    discountList.value = discountList.value.filter((item) => !selectedIds.includes(item._id));

    console.log("Deleted discount IDs:", selectedIds);
  } catch (error) {
    console.error("Error deleting discounts:", error);
  }
};

// Load discounts from API
const loadDiscounts = async () => {
  try {
    if (ApiService.isConfigured()) {
      const discounts = await ApiService.getDiscounts();
      discountList.value = discounts || [];
    }
  } catch (error) {
    console.error("Error loading discounts:", error);
  }
};

// Load discounts when component mounts
onMounted(() => {
  loadDiscounts();
});
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
