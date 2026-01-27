<template>
  <LayoutPanel title="设备规模">
    <div class="weather-monitor">
      <div
        v-for="(item, index) in source"
        :key="index"
        class="widget-weather-item"
      >
        <div class="weather-icon" :class="item.icon"></div>
        <div class="weather-label">{{ item.label }}</div>
        <div class="weather-value">
          <span class="value">{{ item.value }}</span>
          <span class="unit">{{ item.unit }}</span>
        </div>
      </div>
    </div>
  </LayoutPanel>
</template>
<script setup lang="ts">
import LayoutPanel from "./LayoutPanel.vue";

const source = [
  {
    icon: "fa-solid fa-server",
    label: "服务器机柜",
    value: "23",
    unit: "个",
  },
  {
    icon: "fa-solid fa-network-wired",
    label: "网络设备",
    value: "23",
    unit: "个",
  },
  {
    icon: "fa-solid fa-bolt",
    label: "电源柜",
    value: "23",
    unit: "个",
  },
  {
    icon: "fa-solid fa-temperature-three-quarters",
    label: "温湿度传感器",
    value: "11",
    unit: "个",
  },
  {
    icon: "fa-solid fa-snowflake",
    label: "空调系统",
    value: "63",
    unit: "个",
  },
  {
    icon: "fa-solid fa-shield-alt",
    label: "防火墙",
    value: "23",
    unit: "个",
  },
  {
    icon: "fa-solid fa-ethernet",
    label: "交换机",
    value: "12",
    unit: "个",
  },
  {
    icon: "fa-solid fa-database",
    label: "存储设备",
    value: "12",
    unit: "个",
  },
  {
    icon: "fa-solid fa-video",
    label: "监控设备",
    value: "13",
    unit: "个",
  },
];
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
.weather-monitor {
  box-sizing: border-box;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  height: 100%;
  padding-top: 10px;

  $icon-size: 34px;
  .widget-weather-item {
    box-sizing: border-box;
    display: flex;
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: $icon-size auto;
    grid-column-gap: 10px;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0 8px;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(148, 163, 184, 0.3);
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      transform: translateY(-1px);
      border-color: rgba(96, 165, 250, 0.5);
    }

    .weather-icon {
      display: flex;
      grid-row: 1 /3;
      align-items: center;
      justify-content: center;
      width: $icon-size;
      height: $icon-size;
      border: 1px solid #60a5fa;
      border-radius: 50%;
      color: #60a5fa;
    }
    .weather-label {
      margin-top: 10px;
      font-size: 13px;
      color: #94a3b8;
    }
    .weather-value {
      margin-bottom: 6px;
      font-size: 14px;
      color: #e2e8f0;
    }
  }
}
</style>
