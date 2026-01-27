<template>
  <LayoutPanel title="设备故障变化率">
    <div class="container" ref="container"></div>
  </LayoutPanel>
</template>
<script setup lang="ts">
import { nextTick, onMounted } from "vue";
import useEcharts from "@/hooks/useEcharts";
import LayoutPanel from "./LayoutPanel.vue";

const { container, echarts, setOption } = useEcharts();

// 生成分钟级时间数据
const generateMinuteData = () => {
  const data = [];
  const now = new Date();
  // 生成过去 60 分钟的时间数据
  for (let i = 60; i >= 0; i -= 1) {
    const time = new Date(now.getTime() - i * 60 * 1000);
    const minutes = String(time.getMinutes()).padStart(2, "0");
    data.push(`${time.getHours()}:${minutes}`);
  }
  return data;
};

// 生成故障变化率数据（0-100%）
const generateRateData = () => {
  const data = [];
  const baseRate = 5; // 基础故障率
  // 生成过去 60 分钟的故障变化率数据
  for (let i = 60; i >= 0; i -= 1) {
    // 模拟故障变化率，带有一定随机性
    const randomVariation = Math.random() * 10 - 5;
    const rate = Math.max(
      0,
      Math.min(100, baseRate + randomVariation + Math.sin(i / 10) * 5)
    );
    data.push(rate.toFixed(1));
  }
  return data;
};

const generateOptions = () => ({
  legend: {
    show: false,
  },
  tooltip: {
    trigger: "axis" as const,
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
    textStyle: {
      color: "#333",
    },
    formatter(params: any) {
      const data = params[0];
      return `<div style="padding: 5px 0;">
          <div style="color: #333; font-size: 14px;">${data.name}</div>
          <div style="color: #3b82f6; font-size: 16px; margin-top: 5px;">故障变化率: ${data.value}%</div>
        </div>`;
    },
  },
  grid: {
    left: "4%",
    right: "4%",
    bottom: "0%",
    top: "20%",
    containLabel: true,
  },
  xAxis: {
    type: "category" as const,
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: "#666",
      margin: 10,
      fontSize: 12,
      interval: 9, // 每隔 10 个数据点显示一个标签，避免重叠
    },
    data: generateMinuteData(),
  },
  yAxis: {
    type: "value" as const,
    name: "故障变化率(%)",
    nameTextStyle: {
      color: "#666",
      fontSize: 12,
    },
    axisLabel: {
      color: "#666",
    },
    splitLine: {
      lineStyle: {
        color: "#e0e0e0",
        type: "dashed" as const,
      },
    },
    min: 0,
    max: 100,
  },
  series: [
    {
      name: "故障变化率",
      type: "line" as const,
      smooth: true,
      symbol: "none",
      lineStyle: {
        color: "rgba(59, 130, 246, 1)",
        width: 2,
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(59, 130, 246, 0.3)" },
          { offset: 1, color: "rgba(59, 130, 246, 0.01)" },
        ]),
      },
      data: generateRateData(),
    },
  ],
});

onMounted(() => {
  nextTick(() => {
    const options = generateOptions();
    setOption(options);
  });
});
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>
