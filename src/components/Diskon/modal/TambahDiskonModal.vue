<template>
  <v-dialog v-model="show" max-width="400px" persistent>
    <v-card class="rounded-lg">
      <!-- Header -->
      <v-card-title class="d-flex justify-space-between align-center pa-4">
        <span class="text-h6 font-weight-bold">Tambah Diskon</span>
        <v-btn icon variant="text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Form Content -->
      <v-card-text class="pa-4">
        <v-form ref="form" v-model="valid">
          <!-- Nama Diskon Field -->
          <div class="mb-4">
            <label class="text-body-2 font-weight-medium mb-2 d-block" style="color: #e91e63;">
              Nama Diskon
            </label>
            <v-text-field
              v-model="formData.namaDiskon"
              placeholder="Misal: Diskon opening, diskon akhir tahun"
              variant="outlined"
              density="comfortable"
              :rules="namaDiskonRules"
              :error="!!namaDiskonError"
              :error-messages="namaDiskonError"
              hide-details="auto"
              :class="{ 'error-field': !!namaDiskonError }"
            ></v-text-field>
          </div>

          <!-- Diskon Field -->
          <div class="mb-4">
            <label class="text-body-2 font-weight-medium mb-2 d-block" style="color: #e91e63;">
              Diskon
            </label>
            <div class="d-flex align-center gap-2">
              <v-text-field
                v-model="formData.nilaiDiskon"
                placeholder="0"
                variant="outlined"
                density="comfortable"
                type="number"
                :rules="diskonRules"
                :error="!!diskonError"
                :error-messages="diskonError"
                hide-details="auto"
                class="flex-grow-1"
                :class="{ 'error-field': !!diskonError }"
              ></v-text-field>
              
              <!-- Toggle Buttons -->
              <v-btn-toggle
                v-model="formData.tipeDiskon"
                mandatory
                variant="outlined"
                density="comfortable"
                class="ml-2"
              >
                <v-btn value="persen" size="small" class="px-3">
                  %
                </v-btn>
                <v-btn value="rupiah" size="small" class="px-3">
                  Rp
                </v-btn>
              </v-btn-toggle>
            </div>
          </div>
        </v-form>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="pa-4 pt-0">
        <v-btn
          color="success"
          variant="flat"
          block
          size="large"
          class="text-none font-weight-medium"
          :disabled="!valid || isSubmitting"
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
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'submit'])

// Reactive data
const valid = ref(false)
const isSubmitting = ref(false)
const form = ref(null)
const hasSubmitted = ref(false)

const formData = ref({
  namaDiskon: '',
  nilaiDiskon: '',
  tipeDiskon: 'persen'
})

// Computed
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Validation rules
const namaDiskonRules = [
  v => !!v || 'Nama diskon tidak boleh kosong.'
]

const diskonRules = [
  v => !!v || 'Diskon tidak boleh kosong.',
  v => v > 0 || 'Diskon harus lebih dari 0',
  v => {
    if (formData.value.tipeDiskon === 'persen') {
      return v <= 100 || 'Diskon persen tidak boleh lebih dari 100%'
    }
    return true
  }
]

// Error messages
const namaDiskonError = computed(() => {
  if (hasSubmitted.value && !formData.value.namaDiskon) {
    return 'Nama diskon tidak boleh kosong.'
  }
  return ''
})

const diskonError = computed(() => {
  if (hasSubmitted.value && !formData.value.nilaiDiskon) {
    return 'Diskon tidak boleh kosong.'
  }
  return ''
})

// Methods
const closeModal = () => {
  show.value = false
  resetForm()
}

const resetForm = () => {
  formData.value = {
    namaDiskon: '',
    nilaiDiskon: '',
    tipeDiskon: 'persen'
  }
  hasSubmitted.value = false
  if (form.value) {
    form.value.resetValidation()
  }
}

const submitForm = async () => {
  hasSubmitted.value = true
  
  // Validate form
  if (!formData.value.namaDiskon || !formData.value.nilaiDiskon) {
    return
  }
  
  if (!valid.value) return
  
  isSubmitting.value = true
  
  try {
    // Emit data to parent
    emit('submit', {
      nama: formData.value.namaDiskon,
      nilai: parseFloat(formData.value.nilaiDiskon),
      tipe: formData.value.tipeDiskon
    })
    
    // Close modal after successful submission
    closeModal()
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Watch for modal close to reset form
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})
</script>

<style scoped>
.v-btn-toggle {
  height: 40px;
}

.v-btn-toggle .v-btn {
  min-width: 40px;
}

/* Error styling */
.error-field :deep(.v-field__outline) {
  border-color: #f44336 !important;
}

.error-field :deep(.v-field--error .v-field__outline) {
  border-color: #f44336 !important;
}

:deep(.v-messages__message) {
  color: #f44336 !important;
  font-weight: 500;
}
</style>