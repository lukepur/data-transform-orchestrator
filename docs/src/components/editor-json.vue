<template>
  <div class="control-group">
    <label>{{ label }}</label>
    <textarea :value="stringifyValue" @change="updateJson" class="form-control"></textarea>
  </div>
</template>

<script>
export default {
  name: 'json-editor',
  props: {
    label: String,
    value: [Object, String, Number],
    update: Function
  },
  computed: {
    stringifyValue () {
      if (typeof this.value === 'object') return JSON.stringify(this.value, null, 2);
      return this.value;
    }
  },
  methods: {
    updateJson (evt) {
      let json;
      try {
        json = JSON.parse(evt.target.value);
      } catch (error) {
        // don't update
        return;
      }
      this.update(json);
    }
  }
}
</script>
