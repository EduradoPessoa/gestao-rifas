<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">
          {{ raffle ? 'Editar Rifa' : 'Nova Rifa' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Product Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Nome do Produto*</label>
          <input 
            type="text"
            v-model="form.product_name"
            :class="[
              'input mt-1',
              { 'border-red-300 ring-red-500': v$.product_name.$error }
            ]"
            @blur="v$.product_name.$touch"
          >
          <p v-if="v$.product_name.$error" class="mt-1 text-sm text-red-600">
            {{ v$.product_name.$errors[0].$message }}
          </p>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Descrição*</label>
          <textarea
            v-model="form.description"
            rows="4"
            :class="[
              'input mt-1',
              { 'border-red-300 ring-red-500': v$.description.$error }
            ]"
            @blur="v$.description.$touch"
          ></textarea>
          <p v-if="v$.description.$error" class="mt-1 text-sm text-red-600">
            {{ v$.description.$errors[0].$message }}
          </p>
        </div>

        <!-- Price and Numbers -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Preço por Número*</label>
            <div class="relative mt-1">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500">R$</span>
              </div>
              <input
                type="number"
                v-model="form.price"
                step="0.01"
                min="0"
                :class="[
                  'input pl-10',
                  { 'border-red-300 ring-red-500': v$.price.$error }
                ]"
                @blur="v$.price.$touch"
              >
            </div>
            <p v-if="v$.price.$error" class="mt-1 text-sm text-red-600">
              {{ v$.price.$errors[0].$message }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Total de Números*</label>
            <input
              type="number"
              v-model="form.total_numbers"
              min="1"
              :class="[
                'input mt-1',
                { 'border-red-300 ring-red-500': v$.total_numbers.$error }
              ]"
              @blur="v$.total_numbers.$touch"
            >
            <p v-if="v$.total_numbers.$error" class="mt-1 text-sm text-red-600">
              {{ v$.total_numbers.$errors[0].$message }}
            </p>
          </div>
        </div>

        <!-- Draw Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Data do Sorteio*</label>
          <input
            type="datetime-local"
            v-model="form.draw_date"
            :min="minDrawDate"
            :class="[
              'input mt-1',
              { 'border-red-300 ring-red-500': v$.draw_date.$error }
            ]"
            @blur="v$.draw_date.$touch"
          >
          <p v-if="v$.draw_date.$error" class="mt-1 text-sm text-red-600">
            {{ v$.draw_date.$errors[0].$message }}
          </p>
        </div>

        <!-- Image Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Imagem do Produto{{ raffle ? '' : '*' }}
          </label>
          <div class="mt-1 flex items-center gap-4">
            <button
              type="button"
              @click="$refs.fileInput.click()"
              class="btn btn-outline"
            >
              <i class="fas fa-upload mr-2"></i>
              Escolher Imagem
            </button>
            <span v-if="selectedFileName" class="text-sm text-gray-500">
              {{ selectedFileName }}
            </span>
            <input
              type="file"
              ref="fileInput"
              @change="handleImageUpload"
              accept="image/*"
              class="hidden"
              :required="!raffle"
            >
          </div>
          <p v-if="imageError" class="mt-1 text-sm text-red-600">
            {{ imageError }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="btn btn-outline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="saving || v$.$invalid"
          >
            <i class="fas" :class="saving ? 'fa-spinner fa-spin' : 'fa-save'"></i>
            {{ saving ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minValue, minLength } from '@vuelidate/validators'

const props = defineProps({
  raffle: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

// Form state
const form = ref({
  product_name: props.raffle?.product_name || '',
  description: props.raffle?.description || '',
  price: props.raffle?.price || '',
  total_numbers: props.raffle?.total_numbers || '',
  draw_date: props.raffle?.draw_date ? new Date(props.raffle.draw_date).toISOString().slice(0, 16) : '',
  image: null
})

const saving = ref(false)
const imageError = ref('')
const selectedFileName = ref(props.raffle?.image_url ? props.raffle.image_url.split('/').pop() : '')

// Validation rules
const rules = {
  product_name: { required, minLength: minLength(3) },
  description: { required, minLength: minLength(10) },
  price: { required, minValue: minValue(0.01) },
  total_numbers: { required, minValue: minValue(1) },
  draw_date: { required }
}

const v$ = useVuelidate(rules, form)

// Computed
const minDrawDate = computed(() => {
  const now = new Date()
  now.setHours(now.getHours() + 24) // Mínimo 24h no futuro
  return now.toISOString().slice(0, 16)
})

// Methods
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      imageError.value = 'A imagem deve ter no máximo 5MB'
      event.target.value = ''
      selectedFileName.value = ''
      return
    }
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      imageError.value = 'Formato de imagem inválido. Use JPEG, PNG ou WEBP'
      event.target.value = ''
      selectedFileName.value = ''
      return
    }
    
    imageError.value = ''
    selectedFileName.value = file.name
    form.value.image = file
  }
}

const handleSubmit = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  saving.value = true
  try {
    await emit('save', {
      ...form.value,
      id: props.raffle?.id
    })
  } finally {
    saving.value = false
  }
}
</script>
