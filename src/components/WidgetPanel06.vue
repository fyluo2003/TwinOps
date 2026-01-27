<template>
  <LayoutPanel title="预警情况">
    <div class="wrap" @click="showAlarmList = true">
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
    <AlarmDeviceList
      v-if="showAlarmList"
      :devices="alarmDevices"
      @close="showAlarmList = false"
      @click.stop
    />
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
    name: "1#服务器机柜",
    event: "温度过高",
    type: 1,
    time: "08:21",
  },
  {
    name: "23#网络设备",
    event: "网络异常",
    type: 3,
    time: "08:32",
  },
  {
    name: "9#电源柜",
    event: "电压波动",
    type: 2,
    time: "09:44",
  },
  {
    name: "2#服务器机柜",
    event: "内存过载",
    type: 3,
    time: "12:53",
  },
  {
    name: "18#空调系统",
    event: "制冷异常",
    type: 3,
    time: "14:15",
  },
  {
    name: "7#UPS设备",
    event: "电池低电压",
    type: 2,
    time: "14:45",
  },
  {
    name: "26#交换机",
    event: "端口故障",
    type: 2,
    time: "14:59",
  },
  {
    name: "3#服务器机柜",
    event: "硬盘故障",
    type: 1,
    time: "16:42",
  },
  {
    name: "6#网络设备",
    event: "丢包率过高",
    type: 2,
    time: "17:43",
  },
  {
    name: "1#服务器机柜",
    event: "CPU过载",
    type: 1,
    time: "08:21",
  },
  {
    name: "23#温湿度传感器",
    event: "湿度超标",
    type: 3,
    time: "08:32",
  },
  {
    name: "9#防火墙",
    event: "流量异常",
    type: 2,
    time: "09:44",
  },
  {
    name: "2#电源柜",
    event: "电流过高",
    type: 3,
    time: "12:53",
  },
  {
    name: "18#服务器机柜",
    event: "风扇故障",
    type: 3,
    time: "14:15",
  },
  {
    name: "7#路由器",
    event: "连接中断",
    type: 2,
    time: "14:45",
  },
  {
    name: "26#负载均衡器",
    event: "性能下降",
    type: 2,
    time: "14:59",
  },
  {
    name: "7#服务器机柜",
    event: "内存泄漏",
    type: 2,
    time: "14:45",
  },
  {
    name: "26#存储设备",
    event: "读写错误",
    type: 2,
    time: "14:59",
  },
  {
    name: "7#备份系统",
    event: "备份失败",
    type: 2,
    time: "14:45",
  },
  {
    name: "26#监控设备",
    event: "信号丢失",
    type: 2,
    time: "14:59",
  },
  {
    name: "7#安全设备",
    event: "入侵检测",
    type: 2,
    time: "14:45",
  },
  {
    name: "26#门禁系统",
    event: "权限异常",
    type: 2,
    time: "14:59",
  },
  {
    name: "7#消防设备",
    event: "烟雾报警",
    type: 2,
    time: "14:45",
  },
  {
    name: "26#环境传感器",
    event: "温度异常",
    type: 2,
    time: "14:59",
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
    background-color: #f8fafc;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;

    &:hover {
      background-color: #f1f5f9;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
      color: #1e293b;
    }
    .item-type {
      width: 30%;
      color: #475569;
    }
    .item-time {
      width: 20%;
      text-align: end;
      color: #64748b;
    }
  }
}
</style>
