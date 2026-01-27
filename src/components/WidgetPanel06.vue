<template>
  <LayoutPanel title="预警情况">
    <div class="wrap">
      <div class="item-list" ref="container">
        <div
          class="item"
          v-for="(item, index) in list"
          :key="index"
          :style="{ background: generateTypeColor(item.type, true) }"
        >
          <div
            class="item-circle"
            :style="{ background: generateTypeColor(item.type) }"
          ></div>

          <div class="item-name">{{ item.name }}</div>
          <div class="item-type">{{ item.event }}</div>
          <div class="item-time">{{ item.time }}</div>
        </div>
      </div>
    </div>
  </LayoutPanel>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, inject } from "vue";
import LayoutPanel from "./LayoutPanel.vue";
import AlarmDeviceList from "./AlarmDeviceList.vue";

interface EventsType {
  startWarming: () => void;
  stopWarming: () => void;
  enableControls: () => void;
  disableControls: () => void;
}

const { disableControls, enableControls } = inject<EventsType>("events") as EventsType;
interface MaskType {
  show: () => void;
  hide: () => void;
}

const mask = inject<MaskType>("mask") as MaskType;

interface AlarmItem {
  name: string;
  event: string;
  type: 1 | 2 | 3;
  time: string;
}

const showAlarmList = ref(false);

// 监听弹窗显示/隐藏，禁用/启用3D视图控制并显示/隐藏遮罩层
watch(showAlarmList, (newVal) => {
  if (newVal) {
    disableControls();
    mask.show();
  } else {
    enableControls();
    mask.hide();
  }
});

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

const container = ref();

const generateTypeColor = (type: 1 | 2 | 3, gradual = false) => {
  const colors = {
    1: "#10b981", // 绿色 - 低风险
    2: "#3b82f6", // 蓝色 - 中等风险
    3: "#f59e0b", // 橙色 - 高风险
  };
  if (gradual) {
    return `linear-gradient(90deg, ${colors[type]}20 , transparent )`;
  }
  return colors[type];
};

let timer: number | null = null;
onMounted(() => {
  if (timer) window.clearInterval(timer);
  timer = setInterval(() => {
    container.value.classList.add("scroll");
    setTimeout(() => {
      if (!timer) return;
      container.value.classList.remove("scroll");
      const item = list.value.shift();
      if (item) {
        list.value.push(item);
      }
    }, 2000);
  }, 3000);
});

// 组件卸载时清理定时器
onUnmounted(() => {
  if (timer) {
    window.clearInterval(timer);
    timer = null;
  }
});
</script>

<style lang="scss" scoped>
@keyframes row-out {
  from {
    top: 0;
  }
  to {
    top: -36px;
  }
}
.wrap {
  height: 100%;
  overflow: hidden;
}
.item-list {
  display: flex;
  flex-direction: column;
  grid-gap: 8px;
  height: 670px;

  // overflow: hidden;
  &.scroll {
    position: relative;
    animation: row-out 1s linear forwards;
    .row:first-child {
      opacity: 0;
      transition: opacity 1s;
    }
  }
  .item {
    position: relative;
    display: flex;
    align-items: center;
    padding: 5px;
    font-size: 16px;
    background: rgba(15, 23, 42, 0.6);
    border-radius: 6px;
    border: 1px solid rgba(148, 163, 184, 0.3);
    transition: all 0.2s ease;

    &:hover {
      background: rgba(30, 41, 59, 0.8);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
      border-color: rgba(96, 165, 250, 0.5);
    }

    .item-circle {
      position: absolute;
      left: 10px;
      width: 5px;
      height: 10px;
      border-radius: 2px;
    }
    .item-name {
      width: 50%;
      padding-left: 15px;
      color: #e2e8f0;
    }
    .item-type {
      width: 30%;
      color: #94a3b8;
    }
    .item-time {
      width: 20%;
      text-align: end;
      color: #64748b;
    }
  }
}
</style>
