<script setup lang="ts">
// Generic form for one document of a section, driven by SectionDef.fields.
import { ref, watch } from "vue";
import { fromForm, toForm, type Doc, type SectionDef } from "./sections";

const props = defineProps<{
  def: SectionDef;
  doc: Doc | null;
  saving?: boolean;
  submitLabel?: string;
}>();

const emit = defineEmits<{ submit: [doc: Doc]; cancel: [] }>();

const form = ref(toForm(props.def, props.doc));
watch(() => [props.def, props.doc], () => (form.value = toForm(props.def, props.doc)), { deep: true });

function onSubmit() {
  emit("submit", fromForm(props.def, form.value));
}
</script>

<template>
  <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="onSubmit">
    <label
      v-for="f in def.fields"
      :key="f.key"
      class="flex flex-col gap-1.5 text-sm"
      :class="{ 'sm:col-span-2': f.type !== 'text' }"
    >
      <span class="font-medium text-ink/80">
        {{ f.label }}
        <span v-if="f.required" class="text-rose-500">*</span>
      </span>
      <input
        v-if="f.type === 'text'"
        v-model="form[f.key]"
        type="text"
        :required="f.required"
        :placeholder="f.hint"
        class="field"
      />
      <textarea
        v-else
        v-model="form[f.key]"
        :rows="f.type === 'list' ? 4 : 3"
        :required="f.required"
        :placeholder="f.type === 'list' ? 'One item per line' : f.hint"
        class="field font-mono text-[0.85rem]"
      ></textarea>
    </label>

    <div class="flex items-center gap-3 sm:col-span-2">
      <button type="submit" class="btn btn-dark py-2.5! text-sm" :disabled="saving">
        {{ saving ? "Saving…" : submitLabel || "Save" }}
      </button>
      <button
        v-if="doc"
        type="button"
        class="btn btn-light py-2.5! text-sm"
        :disabled="saving"
        @click="emit('cancel')"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<style scoped>
.field {
  border-radius: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  padding: 0.6rem 0.8rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field:focus {
  border-color: var(--color-ink);
  box-shadow: 0 0 0 3px rgba(13, 13, 15, 0.08);
}
</style>
