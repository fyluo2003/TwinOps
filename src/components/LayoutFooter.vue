<template>
  <div class="layout-footer">
    <div class="item" :style="warmingStyle" @click="showAlarmList = true">
      设备告警
    </div>
    <AlarmDeviceList
      v-if="showAlarmList"
      :devices="alarmDevices"
      @close="showAlarmList = false"
      @click.stop
    />
  </div>
</template>
<script setup lang="ts">
import { reactive, computed, inject, ref, onMounted } from "vue";
import AlarmDeviceList from "./AlarmDeviceList.vue";

interface EventsType {
  startWarming: () => void;
  stopWarming: () => void;
}

const state = reactive({
  isWarming: true, // 默认开启告警
});

const events = inject<EventsType | undefined>("events");
const showAlarmList = ref(false);

// 初始化时自动开启告警
onMounted(() => {
  if (events) {
    events.startWarming();
  }
});

interface AlarmItem {
  name: string;
  event: string;
  type: 1 | 2 | 3;
  time: string;
}

const list = ref<AlarmItem[]>([
  {
    name: "1# 服务器机柜",
    event: "温度过高",
    type: 1,
    time: "08:21",
  },
  {
    name: "2# 服务器机柜",
    event: "内存过载",
    type: 3,
    time: "12:53",
  },
  {
    name: "3# 服务器机柜",
    event: "硬盘故障",
    type: 1,
    time: "16:42",
  },
  {
    name: "1# 网络设备",
    event: "网络异常",
    type: 3,
    time: "08:32",
  },
  {
    name: "6# 网络设备",
    event: "丢包率过高",
    type: 2,
    time: "17:43",
  },
  {
    name: "1# 电源柜",
    event: "电压波动",
    type: 2,
    time: "09:44",
  },
  {
    name: "2# 电源柜",
    event: "电流过高",
    type: 3,
    time: "12:53",
  },
  {
    name: "3# 电源柜",
    event: "电压波动",
    type: 2,
    time: "09:44",
  },
  {
    name: "4# 电源柜",
    event: "电流过高",
    type: 3,
    time: "12:53",
  },
  {
    name: "5# 电源柜",
    event: "电压波动",
    type: 2,
    time: "09:44",
  },
  {
    name: "6# 电源柜",
    event: "电流过高",
    type: 3,
    time: "12:53",
  },
]);

const alarmDevices = computed(() =>
  list.value.map((item, index) => ({
    id: index,
    name: item.name,
    event: item.event,
    type: item.type,
    time: item.time,
  }))
);

const warmingStyle = computed(() => {
  const style: Record<string, string> = {};
  style.cursor = "pointer";
  style.color = state.isWarming ? "#38bdf8" : "#e2e8f0";
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
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 170px;
    height: 50px;
    font-family: Douyu;
    color: #e2e8f0;
    cursor: pointer;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.3) 100%);
    border: 1px solid rgba(96, 165, 250, 0.3);
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.4) 100%);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      transform: translateY(-1px);
      border-color: rgba(96, 165, 250, 0.5);
    }
  }
}
</style>
