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
    style.color = "#5bc7fa";
  } else {
    style.color = "#fff";
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
  background-image: url("@/assets/footer_bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 170px;
    height: 50px;
    font-family: Douyu;
    color: #fff;
    cursor: pointer;
    background-image: url("@/assets/footer_item_bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
</style>
