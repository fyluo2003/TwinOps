<template>
  <div class="device-detail-panel" @click.stop>
    <div class="header">
      <div class="title">{{ device.name }}</div>
      <div class="close-btn" @click.stop="onClose">×</div>
    </div>
    <div class="content">
      <div class="info-section">
        <div class="info-title">设备基本信息</div>
        <div class="info-item">
          <div class="info-label">设备类型</div>
          <div class="info-value">{{ device.type }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">设备状态</div>
          <div class="info-value" :class="getStatusClass(device.status)">
            {{ getStatusText(device.status) }}
          </div>
        </div>
        <div class="info-item">
          <div class="info-label">设备编号</div>
          <div class="info-value">{{ device.serialNumber }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">安装位置</div>
          <div class="info-value">{{ device.location }}</div>
        </div>
      </div>
      <div class="info-section">
        <div class="info-title">实时参数</div>
        <div class="info-item">
          <div class="info-label">温度</div>
          <div class="info-value">{{ device.temperature }}°C</div>
        </div>
        <div class="info-item">
          <div class="info-label">湿度</div>
          <div class="info-value">{{ device.humidity }}%</div>
        </div>
        <div class="info-item">
          <div class="info-label">电压</div>
          <div class="info-value">{{ device.voltage }}V</div>
        </div>
        <div class="info-item">
          <div class="info-label">电流</div>
          <div class="info-value">{{ device.current }}A</div>
        </div>
        <div class="info-item">
          <div class="info-label">功率</div>
          <div class="info-value">{{ device.power }}W</div>
        </div>
      </div>
      <div class="info-section">
        <div class="info-title">运行状态</div>
        <div class="info-item">
          <div class="info-label">CPU 负载</div>
          <div class="info-value">{{ device.cpuLoad }}%</div>
        </div>
        <div class="info-item">
          <div class="info-label">内存使用</div>
          <div class="info-value">{{ device.memoryUsage }}%</div>
        </div>
        <div class="info-item">
          <div class="info-label">磁盘使用</div>
          <div class="info-value">{{ device.diskUsage }}%</div>
        </div>
        <div class="info-item">
          <div class="info-label">网络流量</div>
          <div class="info-value">{{ device.networkTraffic }} Mbps</div>
        </div>
      </div>
      <div class="info-section">
        <div class="info-title">告警信息</div>
        <div class="alarm-list">
          <div
            class="alarm-item"
            v-for="alarm in device.alarms"
            :key="alarm.id"
          >
            <div
              class="alarm-icon"
              :style="{ background: getAlarmTypeColor(alarm.type) }"
            >
              {{ getAlarmTypeIcon(alarm.type) }}
            </div>
            <div class="alarm-info">
              <div class="alarm-name">{{ alarm.name }}</div>
              <div class="alarm-time">{{ alarm.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from "vue";

interface DeviceAlarm {
  id: number;
  name: string;
  type: "warning" | "error" | "info";
  time: string;
}

interface DeviceData {
  name: string;
  type: string;
  status: "normal" | "warning" | "error";
  serialNumber: string;
  location: string;
  temperature: number;
  humidity: number;
  voltage: number;
  current: number;
  power: number;
  cpuLoad: number;
  memoryUsage: number;
  diskUsage: number;
  networkTraffic: number;
  alarms: DeviceAlarm[];
}

const props = defineProps<{
  deviceData: DeviceData;
}>();

const emit = defineEmits<{
  close: [];
}>();

const device = computed(() => props.deviceData);

const getStatusClass = (status: string) => {
  const classes = {
    normal: "status-normal",
    warning: "status-warning",
    error: "status-error",
  };
  return classes[status as keyof typeof classes] || "status-normal";
};

const getStatusText = (status: string) => {
  const texts = {
    normal: "正常",
    warning: "警告",
    error: "故障",
  };
  return texts[status as keyof typeof texts] || "正常";
};

const getAlarmTypeColor = (type: string) => {
  const colors = {
    warning: "#f1bd49",
    error: "#ff0000",
    info: "#5bc7fa",
  };
  return colors[type as keyof typeof colors] || "#5bc7fa";
};

const getAlarmTypeIcon = (type: string) => {
  const icons = {
    warning: "⚠",
    error: "❌",
    info: "ℹ",
  };
  return icons[type as keyof typeof icons] || "ℹ";
};

const onClose = () => {
  emit("close");
};
</script>

<style lang="scss" scoped>
.device-detail-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  max-height: 80vh;
  background-color: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  z-index: 99999;
  backdrop-filter: blur(10px);
  user-select: text;

  * {
    user-select: text;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .title {
      font-size: 18px;
      font-weight: bold;
      color: #fff;
    }

    .close-btn {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 24px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
      }
    }
  }

  .content {
    padding: 20px;
    max-height: calc(80vh - 60px);
    overflow-y: auto;

    .info-section {
      margin-bottom: 20px;

      .info-title {
        font-size: 16px;
        font-weight: bold;
        color: #fff;
        margin-bottom: 15px;
        padding-bottom: 5px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        margin-bottom: 8px;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 8px;

        .info-label {
          font-size: 14px;
          color: #999;
          min-width: 100px;
        }

        .info-value {
          font-size: 14px;
          color: #fff;
          text-align: right;
          flex: 1;

          &.status-normal {
            color: #74fabd;
          }

          &.status-warning {
            color: #f1bd49;
          }

          &.status-error {
            color: #ff0000;
          }
        }
      }

      .alarm-list {
        .alarm-item {
          display: flex;
          align-items: center;
          padding: 10px;
          margin-bottom: 8px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 8px;

          .alarm-icon {
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 14px;
            margin-right: 15px;
          }

          .alarm-info {
            flex: 1;

            .alarm-name {
              font-size: 14px;
              color: #fff;
              margin-bottom: 3px;
            }

            .alarm-time {
              font-size: 12px;
              color: #666;
            }
          }
        }
      }
    }
  }
}

// 滚动条样式
.content::-webkit-scrollbar {
  width: 6px;
}

.content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
