<template>
  <div class="pa-6">
    <!-- Header Section -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">Daftar Diskon</h1>
        <p class="text-body-2 text-grey-600">
          <span v-if="selectedItems.length === 0">Total jumlah diskon: {{ totalDiscounts }}</span>
          <span v-else>{{ selectedItems.length }} item dipilih</span>
        </p>
      </div>
      
      <!-- Default state: Show Tambah diskon button -->
      <v-btn
        v-if="selectedItems.length === 0"
        color="success"
        variant="flat"
        prepend-icon="mdi-plus"
        class="text-none font-weight-medium"
        @click="openTambahDiskonModal"
      >
        Tambah diskon
      </v-btn>
      
      <!-- Selection state: Show Batalkan and Hapus buttons -->
      <div v-else class="d-flex gap-2">
        <v-btn
          color="grey-lighten-1"
          variant="outlined"
          class="text-none font-weight-medium"
          @click="cancelSelection"
        >
          Batalkan
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          class="text-none font-weight-medium"
          @click="openDeleteConfirmModal"
        >
          Hapus
        </v-btn>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="d-flex gap-4 mb-6">
      <v-text-field
        v-model="searchQuery"
        placeholder="Cari diskon"
        variant="outlined"
        density="comfortable"
        prepend-inner-icon="mdi-magnify"
        hide-details
        class="flex-grow-1"
        style="max-width: 300px;"
      ></v-text-field>
      
      <v-select
        v-model="selectedOutlet"
        :items="outlets"
        item-title="name"
        item-value="id"
        placeholder="Kopi Anak Bangsa"
        variant="outlined"
        density="comfortable"
        prepend-inner-icon="mdi-store"
        hide-details
        style="min-width: 200px;"
      ></v-select>
    </div>

    <!-- Data Table -->
    <v-card class="rounded-lg" elevation="1">
      <v-data-table
        v-model="selectedItems"
        :headers="headers"
        :items="filteredDiscounts"
        :items-per-page="itemsPerPage"
        :page="currentPage"
        show-select
        class="elevation-0"
        hide-default-footer
      >
        <!-- Custom header for Nama Diskon -->
        <template v-slot:header.name>
          <div class="d-flex align-center">
            Nama Diskon
            <v-icon size="small" class="ml-1">mdi-arrow-up</v-icon>
          </div>
        </template>

        <!-- Custom header for Nilai Diskon -->
        <template v-slot:header.value>
          <div class="d-flex align-center">
            Nilai Diskon
            <v-icon size="small" class="ml-1">mdi-arrow-down</v-icon>
          </div>
        </template>

        <!-- Custom name column with badge -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center">
            <span>{{ item.name }}</span>
            <v-chip
              v-if="item.isNew"
              color="primary"
              size="x-small"
              class="ml-2"
            >
              baru
            </v-chip>
          </div>
        </template>

        <!-- Custom value column -->
        <template v-slot:item.value="{ item }">
          <span>{{ formatDiscountValue(item) }}</span>
        </template>

        <!-- Custom actions column -->
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            size="small"
            @click="editDiscount(item)"
          ></v-btn>
        </template>
      </v-data-table>

      <!-- Custom Footer with Pagination -->
      <v-divider></v-divider>
      <div class="d-flex justify-space-between align-center pa-4">
        <div class="d-flex align-center">
          <v-select
            v-model="itemsPerPage"
            :items="[10, 25, 50, 100]"
            variant="outlined"
            density="compact"
            hide-details
            style="width: 80px;"
            class="mr-2"
          ></v-select>
          <span class="text-body-2">data per halaman</span>
        </div>
        
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
          density="comfortable"
        ></v-pagination>
      </div>
    </v-card>

    <!-- Footer -->
    <div class="text-center mt-6">
      <p class="text-body-2 text-grey-600">
        2024 © PT Nusantara Berkah Digital
      </p>
    </div>

    <!-- Ubah Diskon Modal -->
    <UbahDiskonModal
      v-model="showUbahDiskonModal"
      :discount-data="selectedDiscount"
      @submit="onUbahDiskonSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <v-dialog v-model="showDeleteConfirmModal" max-width="400">
      <v-card class="rounded-lg">
        <v-card-title class="text-h6 font-weight-bold pa-6 pb-2">
          Hapus Diskon
        </v-card-title>
        
        <v-card-text class="pa-6 pt-2">
          <p class="text-body-1 mb-0">
            Apakah Anda yakin ingin menghapus diskon 
            <span v-if="selectedItems.length === 1">[{{ selectedItems[0].name }}]</span>
            <span v-else>yang dipilih</span>?
          </p>
          <ul v-if="selectedItems.length > 1" class="mt-2 text-body-2">
            <li v-for="item in selectedItems" :key="item.id">
              Diskon yang dihapus tidak bisa dikembalikan lagi.
            </li>
          </ul>
          <p v-else class="text-body-2 mt-2 mb-0">
            • Diskon yang dihapus tidak bisa dikembalikan lagi.
          </p>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-lighten-1"
            variant="outlined"
            class="text-none font-weight-medium mr-2"
            @click="cancelDelete"
          >
            Batalkan
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            class="text-none font-weight-medium"
            @click="confirmDelete"
          >
            Hapus
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Notification Snackbar -->
    <v-snackbar
      v-model="showNotification"
      :timeout="3000"
      color="success"
      location="top"
      class="mt-12"
    >
      {{ notificationMessage }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showNotification = false"
        >
          Tutup
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import UbahDiskonModal from './modal/UbahDiskonModal.vue'

// Props
const props = defineProps({
  discountList: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['back', 'add-discount', 'update-discount', 'delete-discounts'])

// Reactive data
const searchQuery = ref('')
const selectedOutlet = ref(null)
const selectedItems = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showUbahDiskonModal = ref(false)
const selectedDiscount = ref({})
const showNotification = ref(false)
const notificationMessage = ref('')
const showDeleteConfirmModal = ref(false)

// Sample data
const outlets = ref([
  { id: 1, name: 'Kopi Anak Bangsa' },
  { id: 2, name: 'Outlet Kedua' },
  { id: 3, name: 'Outlet Ketiga' }
])

// Use only real-time data from props
const discounts = computed(() => {
  return props.discountList || []
})

// Table headers
const headers = [
  { title: 'Nama Diskon', key: 'name', sortable: true },
  { title: 'Nilai Diskon', key: 'value', sortable: true },
  { title: '', key: 'actions', sortable: false, width: '50px' }
]

// Computed properties
const totalDiscounts = computed(() => discounts.value.length)

const filteredDiscounts = computed(() => {
  let filtered = discounts.value
  
  if (searchQuery.value) {
    filtered = filtered.filter(discount => 
      discount.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredDiscounts.value.length / itemsPerPage.value)
})

// Methods
const formatDiscountValue = (item) => {
  if (item.type === 'rupiah') {
    return `Rp ${item.value.toLocaleString('id-ID')}`
  } else {
    return `${item.value}%`
  }
}

const openTambahDiskonModal = () => {
  emit('add-discount')
}

const editDiscount = (item) => {
  selectedDiscount.value = item
  showUbahDiskonModal.value = true
}

const onUbahDiskonSubmit = (updatedData) => {
  emit('update-discount', updatedData)
  showUbahDiskonModal.value = false
  
  // Show notification
  notificationMessage.value = `[${updatedData.nama}] berhasil diubah.`
  showNotification.value = true
}

const cancelSelection = () => {
  selectedItems.value = []
}

const openDeleteConfirmModal = () => {
  showDeleteConfirmModal.value = true
}

const confirmDelete = () => {
  const selectedIds = selectedItems.value.map(item => item.id)
  emit('delete-discounts', selectedIds)
  
  // Show notification
  notificationMessage.value = `Diskon berhasil dihapus.`
  showNotification.value = true
  
  // Reset selection and close modal
  selectedItems.value = []
  showDeleteConfirmModal.value = false
}

const cancelDelete = () => {
  showDeleteConfirmModal.value = false
}

// Initialize
onMounted(() => {
  selectedOutlet.value = outlets.value[0].id
})
</script>

<style scoped>
/* Custom styling for the data table */
:deep(.v-data-table-header) {
  background-color: #fafafa;
}

:deep(.v-data-table-header th) {
  font-weight: 600;
  color: #424242;
}

:deep(.v-data-table__td) {
  border-bottom: 1px solid #e0e0e0;
}

:deep(.v-pagination__item) {
  min-width: 32px;
  height: 32px;
}

:deep(.v-pagination__item--is-active) {
  background-color: #4caf50 !important;
  color: white !important;
}

/* Custom chip styling */
.v-chip.v-chip--size-x-small {
  font-size: 10px;
  height: 18px;
  padding: 0 6px;
}
</style>