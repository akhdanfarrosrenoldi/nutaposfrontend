<template>
  <v-dialog v-model="show" max-width="400">
    <v-card class="rounded-lg">
      <v-card-title class="text-h6 font-weight-bold pa-6 pb-2"> Hapus Diskon </v-card-title>

      <v-card-text class="pa-6 pt-2">
        <p class="text-body-1 mb-0">
          Apakah Anda yakin ingin menghapus diskon
          <span v-if="selectedItems.length === 1">[{{ selectedItems[0].name }}]</span>
          <span v-else>yang dipilih</span>?
        </p>
        <ul v-if="selectedItems.length > 1" class="mt-2 text-body-2">
          <li v-for="item in selectedItems" :key="item._id || item.id">
            {{ item.name }}
          </li>
        </ul>
        <p class="text-body-2 mt-2 mb-0">
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
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  selectedItems: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

// Computed
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Methods
const cancelDelete = () => {
  emit('cancel')
  show.value = false
}

const confirmDelete = () => {
  emit('confirm')
  show.value = false
}
</script>

<style scoped>
/* Add any specific styling if needed */
</style>