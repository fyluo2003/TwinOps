<template>
  <div class="layout-footer">
    <div class="item" :style="warmingStyle" @click="warmingHandle">
      {{ state.isWarming ? "取消告警" : "设备告警" }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, computed, inject } from "vue";

interface EventsType {
  startWarming: () => void;
  stopWarming: () => void;
}

const state = reactive({
  isWarming: false,
});

const events = inject<EventsType | undefined>("events");

const warmingHandle = async () => {
  state.isWarming = !state.isWarming;
  if (state.isWarming && events) {
    events.startWarming();
  } else if (events) {
    events.stopWarming();
  }
};

const warmingStyle = computed(() => {
  const style: Record<string, string> = {};
  style.cursor = "pointer";

  if (state.isWarming) {
    style.color = "#3b82f6";
  } else {
    style.color = "#1e293b";
  }
  return style;
});
</script>
<style lang="scss" scoped>
.layout-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 170px;
    height: 50px;
    font-family: Douyu;
    color: #1e293b;
    cursor: pointer;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }
  }
}
</style>
