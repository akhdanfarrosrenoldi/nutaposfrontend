<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card class="rounded-xl" style="height: 90vh; background-color: white;">
      <v-card-title class="d-flex justify-space-between align-center pa-4" style="padding-left: 24px; padding-right: 24px;">
        <span class="text-h6 font-weight-bold">Pilih Outlet</span>
        <v-btn icon variant="text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-0" style="padding-left: 24px; padding-right: 24px; overflow-x: auto; overflow-x-color: #4CAF50;">
        <!-- Search Bar -->
        <div class="pa-4">
          <v-text-field
            v-model="searchQuery"
            placeholder="Cari nama outlet di sini"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
          ></v-text-field>
        </div>

        <!-- Outlet List -->
        <div class="outlet-list">
          <!-- Loading State -->
          <div v-if="loading" class="text-center pa-8">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <div class="mt-3 text-body-2 text-grey-600">Memuat data outlet...</div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center pa-8">
            <v-icon color="error" size="48" class="mb-3">mdi-alert-circle</v-icon>
            <div class="text-body-2 text-error mb-3">{{ error }}</div>
            <v-btn color="primary" variant="outlined" @click="loadOutlets"> Coba Lagi </v-btn>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredOutlets.length === 0" class="text-center pa-8">
            <div v-if="searchQuery" class="empty-search-state">
               <!-- No Result Found Illustration -->
               <div class="illustration-container mb-4">
                 <img 
                   src="../../../assets/no-result-found.svg" 
                   alt="Tidak ada hasil ditemukan"
                   class="no-result-illustration"
                 />
               </div>
             </div>
            <div v-else class="empty-data-state">
              <v-icon color="grey" size="48" class="mb-3">mdi-store-outline</v-icon>
              <div class="text-body-2 text-grey-600">Belum ada data outlet</div>
            </div>
          </div>

          <!-- Outlet List -->
          <v-list v-else density="compact">
            <v-list-item
              v-for="outlet in filteredOutlets"
              :key="outlet._id || outlet.id"
              @click="selectOutlet(outlet)"
              :class="{
                'selected-outlet':
                  selectedOutlet?._id === outlet._id || selectedOutlet?.id === outlet.id,
              }"
            >
              <template v-slot:prepend>
                <v-icon color="#E0E0E0" size="24" class="mr-3">
                  mdi-store
                </v-icon>
              </template>

              <v-list-item-title class="font-weight-medium">
                {{ outlet.name }}
              </v-list-item-title>

              <v-list-item-subtitle class="text-grey-600">
                {{ outlet.address }}
              </v-list-item-subtitle>

              <template v-slot:append>
                <v-icon
                  v-if="selectedOutlet?._id === outlet._id || selectedOutlet?.id === outlet.id"
                  color="success"
                  class="ml-2"
                >
                  mdi-check
                </v-icon>
              </template>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import ApiService from "../../../services/api.js";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "outlet-selected"]);

const dialog = ref(false);
const searchQuery = ref("");
const selectedOutlet = ref(null);
const outlets = ref([]);
const loading = ref(false);
const error = ref(null);

// Load outlets from API
const loadOutlets = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Initialize sample data if needed
    await ApiService.initializeSampleData();

    // Fetch outlets from API
    const data = await ApiService.getOutlets();
    outlets.value = data || [];
  } catch (err) {
    error.value = "Gagal memuat data outlet";
    console.error("Error loading outlets:", err);
  } finally {
    loading.value = false;
  }
};

// Load outlets when component mounts
onMounted(() => {
  loadOutlets();
});

// Computed untuk filter outlet berdasarkan search
const filteredOutlets = computed(() => {
  if (!searchQuery.value) {
    return outlets.value;
  }
  return outlets.value.filter(
    (outlet) =>
      outlet.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      outlet.address.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Watch untuk sinkronisasi dengan prop modelValue
watch(
  () => props.modelValue,
  (newVal) => {
    dialog.value = newVal;
  }
);

watch(dialog, (newVal) => {
  emit("update:modelValue", newVal);
});

// Methods
const closeModal = () => {
  dialog.value = false;
};

const selectOutlet = (outlet) => {
  selectedOutlet.value = outlet;
  emit("outlet-selected", outlet);
  closeModal();
};
</script>

<style scoped>
.outlet-list {
  max-height: 400px;
  overflow-y: auto;
}

.v-list-item.selected-outlet {
  /* No special styling for selected outlet */
}

.v-list-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.v-list-item-title {
  font-size: 14px;
}

.v-list-item-subtitle {
  font-size: 12px;
}

.v-list-item.selected-outlet:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.illustration-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-result-illustration {
  max-width: 240px;
  max-height: 135px;
  width: auto;
  height: auto;
}

.empty-search-state {
  max-width: 300px;
  margin: 0 auto;
}

.empty-data-state {
  max-width: 200px;
  margin: 0 auto;
}

/* Custom scrollbar styling for overflow-x */
::-webkit-scrollbar {
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #4CAF50;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #45a049;
}
</style>
