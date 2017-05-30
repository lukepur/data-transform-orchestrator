<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-12">
        <div class="form-group row">
          <label for="orchestration-selector" class="col-3 col-form-label">Select Orchestration</label>
          <div class="col-9">
            <select class="form-control" id="orchestration-selector">
              <option selected disabled value="">Select an item</option>
              <option v-for="(orchestration, index) in orchestrations" :value="index">{{ orchestration.meta().name }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orchestrations from '../../orchestrations/orchestrations';

export default {
  name: 'orchestration-runner',
  data () {
    return {
      orchestrations,
      selectedOrchestrationIndex: null
    };
  }
}
</script>
