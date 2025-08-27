<template>
  <v-dialog v-model="show" max-width="400px" persistent>
    <v-card class="rounded-lg" style="background-color: #ffffff">
      <!-- Header -->
      <v-card-title class="d-flex justify-space-between align-center pa-4 pb-2">
        <span class="text-h6 font-weight-bold">Tambah Diskon</span>
        <v-btn icon variant="text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Form Content -->
      <v-card-text class="pa-4 pt-2">
        <v-form ref="form" v-model="valid">
          <!-- Nama Diskon Field -->
          <div class="mb-4 position-relative">
            <label
              class="floating-label text-small-2 font-weight-medium px-1"
              :class="namaDiskonError ? 'text-red' : 'text-grey'"
            >
              Nama Diskon
            </label>
            <div class="position-relative">
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
              <v-icon v-if="namaDiskonError" class="error-icon" color="#ff3553" size="20">
                mdi-alert-circle
              </v-icon>
            </div>
          </div>

          <!-- Diskon Field -->
          <div class="mb-4 position-relative">
            <label
              class="floating-label text-small-2 font-weight-medium px-1"
              :class="diskonError ? 'text-red' : 'text-grey'"
            >
              Diskon
            </label>
            <div class="d-flex align-center" style="gap: 16px">
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
                rounded
                class="toggle-buttons-inline"
              >
                <v-btn value="persen" size="small" class="px-3 toggle-btn" rounded>
                  <v-icon
                    v-if="formData.tipeDiskon === 'persen'"
                    size="16"
                    class="mr-1"
                    color="#3dae2f"
                    >mdi-check</v-icon
                  >
                  <span
                    :class="formData.tipeDiskon === 'persen' ? 'text-selected' : 'text-unselected'"
                    >%</span
                  >
                </v-btn>
                <v-btn value="rupiah" size="small" class="px-3 toggle-btn" rounded>
                  <v-icon
                    v-if="formData.tipeDiskon === 'rupiah'"
                    size="16"
                    class="mr-1"
                    color="#3dae2f"
                    >mdi-check</v-icon
                  >
                  <span
                    :class="formData.tipeDiskon === 'rupiah' ? 'text-selected' : 'text-unselected'"
                    >Rp</span
                  >
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
          rounded
          class="text-none font-weight-medium"
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
import { ref, computed, watch } from "vue";

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(["update:modelValue", "submit"]);

// Reactive data
const valid = ref(false);
const isSubmitting = ref(false);
const form = ref(null);
const hasSubmitted = ref(false);

const formData = ref({
  namaDiskon: "",
  nilaiDiskon: "",
  tipeDiskon: "persen",
});

// Computed
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Validation rules
const namaDiskonRules = [(v) => !!v || "Nama diskon tidak boleh kosong."];

const diskonRules = [
  (v) => !!v || "Diskon tidak boleh kosong.",
  (v) => v > 0 || "Diskon harus lebih dari 0",
  (v) => {
    if (formData.value.tipeDiskon === "persen") {
      return v <= 100 || "Diskon persen tidak boleh lebih dari 100%";
    }
    return true;
  },
];

// Error messages
const namaDiskonError = computed(() => {
  if (hasSubmitted.value && !formData.value.namaDiskon) {
    return "Nama diskon tidak boleh kosong";
  }
  return "";
});

const diskonError = computed(() => {
  if (hasSubmitted.value && !formData.value.nilaiDiskon) {
    return "Diskon tidak boleh kosong";
  }
  return "";
});

// Methods
const closeModal = () => {
  show.value = false;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    namaDiskon: "",
    nilaiDiskon: "",
    tipeDiskon: "persen",
  };
  hasSubmitted.value = false;
  if (form.value) {
    form.value.resetValidation();
  }
};

const submitForm = async () => {
  hasSubmitted.value = true;

  // Validate form
  if (!formData.value.namaDiskon || !formData.value.nilaiDiskon) {
    return;
  }

  if (!valid.value) return;

  isSubmitting.value = true;

  try {
    // Emit data to parent
    emit("submit", {
      nama: formData.value.namaDiskon,
      nilai: parseFloat(formData.value.nilaiDiskon),
      tipe: formData.value.tipeDiskon,
    });

    // Close modal after successful submission
    closeModal();
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Watch for modal close to reset form
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      resetForm();
    }
  }
);
</script>

<style scoped>
.v-btn-toggle {
  height: 40px;
}

.v-btn-toggle .v-btn {
  min-width: 40px;
}

/* Floating label styling */
.floating-label {
  position: absolute;
  top: -8px;
  left: 12px;
  background: white;
  padding: 0 4px;
  z-index: 1;
  font-size: 10px;
}

/* Placeholder styling */
:deep(.v-field__input) {
  font-size: 12px;
  padding: 12px 16px !important;
}

:deep(.v-field__input input::placeholder) {
  font-size: 11px;
  color: #9e9e9e;
}

/* Additional padding for text field */
:deep(.v-text-field .v-field__field) {
  padding: 8px 12px;
}

:deep(.v-text-field .v-field__input) {
  min-height: 48px;
  padding: 12px 16px !important;
}

/* Error styling */
.error-field :deep(.v-field__outline) {
  border-color: #ff3553 !important;
}

.error-field :deep(.v-field--error .v-field__outline) {
  border-color: #ff3553 !important;
}

.error-field :deep(.v-field__outline__start),
.error-field :deep(.v-field__outline__notch),
.error-field :deep(.v-field__outline__end) {
  border-color: #ff3553 !important;
}

.error-field :deep(.v-field--error .v-field__outline__start),
.error-field :deep(.v-field--error .v-field__outline__notch),
.error-field :deep(.v-field--error .v-field__outline__end) {
  border-color: #ff3553 !important;
}

:deep(.v-messages__message) {
  color: #ff3553 !important;
  font-weight: 400;
  font-size: 11px !important;
}

/* Text color utilities */
.text-red {
  color: #ff3553 !important;
}

.text-grey {
  color: #9e9e9e !important;
}

/* Error icon positioning */
.error-icon {
  position: absolute;
  right: 12px;
  top: 35%;
  transform: translateY(-50%);
  z-index: 2;
  pointer-events: none;
}

/* Toggle button styling */
.toggle-buttons-inline {
  min-width: auto;
}

.toggle-btn {
  min-width: 50px;
}

/* Selected toggle button */
:deep(.v-btn-toggle .v-btn--active) {
  background-color: #f0fbef !important;
  border-color: #e0e0e0 !important;
}

/* Unselected toggle button */
:deep(.v-btn-toggle .v-btn:not(.v-btn--active)) {
  background-color: white !important;
  border-color: #e0e0e0 !important;
}

/* Rounded toggle buttons */
:deep(.v-btn-toggle.v-btn-toggle--rounded) {
  border-radius: 24px !important;
}

:deep(.v-btn-toggle.v-btn-toggle--rounded .v-btn) {
  border-radius: 24px !important;
}

.text-selected {
  color: #3dae2f !important;
}

.text-unselected {
  color: black !important;
}
</style>
