<template>
  <v-dialog v-model="show" max-width="500px" persistent>
    <v-card class="rounded-xl">
      <!-- Header -->
      <v-card-title class="d-flex justify-space-between align-center pa-6 pb-4">
        <span class="text-h6 font-weight-bold">Ubah Diskon</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="closeModal"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Form Content -->
      <v-card-text class="pa-6">
        <v-form ref="form" v-model="valid">
          <!-- Nama Diskon -->
          <div class="mb-4">
            <label class="text-body-2 font-weight-medium mb-2 d-block">Nama Diskon</label>
            <v-text-field
              v-model="formData.nama"
              :rules="namaDiskonRules"
              :error="namaDiskonError"
              :class="{ 'error-field': namaDiskonError }"
              variant="outlined"
              density="comfortable"
              placeholder="Masukkan nama diskon"
              hide-details="auto"
            ></v-text-field>
          </div>

          <!-- Diskon -->
          <div class="mb-4">
            <label class="text-body-2 font-weight-medium mb-2 d-block">Diskon</label>
            <div class="d-flex gap-2">
              <v-text-field
                v-model="formData.nilai"
                :rules="diskonRules"
                :error="diskonError"
                :class="{ 'error-field': diskonError }"
                variant="outlined"
                density="comfortable"
                placeholder="Masukkan nilai diskon"
                hide-details="auto"
                class="flex-grow-1"
              ></v-text-field>
              <v-btn-toggle
                v-model="formData.tipe"
                variant="outlined"
                density="comfortable"
                mandatory
                class="flex-shrink-0"
              >
                <v-btn value="rupiah" size="small" class="px-3">
                  Rp
                </v-btn>
                <v-btn value="persen" size="small" class="px-3">
                  %
                </v-btn>
              </v-btn-toggle>
            </div>
          </div>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <!-- Actions -->
      <v-card-actions class="pa-6 pt-4">
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          color="grey"
          class="text-none mr-3"
          @click="closeModal"
        >
          Batal
        </v-btn>
        <v-btn
          color="success"
          variant="flat"
          class="text-none"
          :loading="isSubmitting"
          @click="submitForm"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  discountData: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'submit'])

// Reactive data
const formData = ref({
  nama: '',
  nilai: '',
  tipe: 'rupiah'
})

const valid = ref(false)
const isSubmitting = ref(false)
const hasSubmitted = ref(false)

// Computed
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const namaDiskonError = computed(() => {
  return hasSubmitted.value && (!formData.value.nama || formData.value.nama.trim() === '')
})

const diskonError = computed(() => {
  return hasSubmitted.value && (!formData.value.nilai || formData.value.nilai.toString().trim() === '')
})

// Validation rules
const namaDiskonRules = [
  v => !!v || 'Nama diskon harus diisi',
  v => (v && v.trim().length > 0) || 'Nama diskon tidak boleh kosong'
]

const diskonRules = [
  v => !!v || 'Nilai diskon harus diisi',
  v => (v && v.toString().trim().length > 0) || 'Nilai diskon tidak boleh kosong',
  v => !isNaN(v) || 'Nilai diskon harus berupa angka',
  v => parseFloat(v) > 0 || 'Nilai diskon harus lebih dari 0'
]

// Watch for discount data changes
watch(() => props.discountData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    formData.value = {
      nama: newData.name || '',
      nilai: newData.value || '',
      tipe: newData.type || 'rupiah'
    }
  }
}, { immediate: true, deep: true })

// Methods
const closeModal = () => {
  show.value = false
  resetForm()
}

const resetForm = () => {
  formData.value = {
    nama: '',
    nilai: '',
    tipe: 'rupiah'
  }
  hasSubmitted.value = false
  if (props.discountData && Object.keys(props.discountData).length > 0) {
    formData.value = {
      nama: props.discountData.name || '',
      nilai: props.discountData.value || '',
      tipe: props.discountData.type || 'rupiah'
    }
  }
}

const submitForm = async () => {
  hasSubmitted.value = true
  
  // Check if required fields are empty
  if (!formData.value.nama || formData.value.nama.trim() === '' || 
      !formData.value.nilai || formData.value.nilai.toString().trim() === '') {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Emit the form data
    emit('submit', {
      id: props.discountData.id,
      nama: formData.value.nama.trim(),
      nilai: parseFloat(formData.value.nilai),
      tipe: formData.value.tipe
    })
    
    // Close modal after successful submission
    closeModal()
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.error-field :deep(.v-field__outline) {
  border-color: #f44336 !important;
}

.error-field :deep(.v-messages__message) {
  color: #f44336 !important;
}
</style>