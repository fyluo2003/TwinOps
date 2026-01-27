<template>
  <div class="label-wrapper">
    <div class="label" @click.stop="handleLabelClick">{{ name }}</div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import DeviceDetailPanel from "./DeviceDetailPanel.vue";
import { eventBus } from "@/utils/eventBus";

interface PropsType {
  name: string;
  position?: number[];
}
const props = defineProps<PropsType>();

const handleLabelClick = () => {
  // 发送事件显示设备详情面板
  eventBus.emit("showDeviceDetail", getDeviceData());
};

// 生成设备详细数据
const getDeviceData = () => {
  // 根据设备名称生成对应的设备数据
  const baseData = {
    name: props.name,
    type: "未知设备",
    status: "normal" as "normal" | "warning" | "error",
    serialNumber: `1000${Math.floor(Math.random() * 9000)}`,
    location: "数据中心 A 区",
    temperature: Math.floor(Math.random() * 30) + 20,
    humidity: Math.floor(Math.random() * 40) + 40,
    voltage: Math.floor(Math.random() * 20) + 220,
    current: Math.floor(Math.random() * 10) + 5,
    power: Math.floor(Math.random() * 2000) + 1000,
    cpuLoad: Math.floor(Math.random() * 60) + 20,
    memoryUsage: Math.floor(Math.random() * 50) + 30,
    diskUsage: Math.floor(Math.random() * 40) + 40,
    networkTraffic: Math.floor(Math.random() * 1000) + 500,
    alarms: [] as {
      id: number;
      name: string;
      type: "warning" | "error" | "info";
      time: string;
    }[],
  };

  // 根据设备名称判断设备类型
  if (props.name.includes("服务器机柜")) {
    baseData.type = "服务器机柜";
    baseData.status = "normal";
    baseData.alarms = [
      { id: 1, name: "温度过高", type: "warning", time: "10:23" },
      { id: 2, name: "内存过载", type: "error", time: "09:15" },
    ];
  } else if (props.name.includes("网络设备")) {
    baseData.type = "网络设备";
    baseData.status = "warning";
    baseData.alarms = [
      { id: 1, name: "网络延迟过高", type: "warning", time: "11:05" },
    ];
  } else if (props.name.includes("电源柜")) {
    baseData.type = "电源柜";
    baseData.status = "normal";
    baseData.alarms = [];
  } else {
    baseData.type = "其他设备";
    baseData.status = "normal";
    baseData.alarms = [];
  }

  return baseData;
};
</script>
<style lang="scss" scoped>
.label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 135px;
  height: 40px;
  font-weight: bolder;
  color: #fff;
  pointer-events: all;
  cursor: pointer;
  background-image: url(@/assets/label_bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
