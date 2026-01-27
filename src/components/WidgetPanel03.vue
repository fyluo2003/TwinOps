<template>
  <LayoutPanel title="资源利用率监测">
    <div class="container" ref="container"></div>
  </LayoutPanel>
</template>
<script setup lang="ts">
import { nextTick, onMounted } from "vue";
import useEcharts from "@/hooks/useEcharts";
import LayoutPanel from "./LayoutPanel.vue";

const { container, echarts, setOption } = useEcharts();

const generateOptions = () => ({
  legend: {
    show: true,
    right: 0,
    textStyle: {
      color: "#666",
    },
  },
  tooltip: {
    trigger: "axis" as const,
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
    textStyle: {
      color: "#333",
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
    },
    data: [...Array(30).keys()],
  },
  yAxis: {
    type: "value" as const,
    axisLabel: {
      color: "#666",
    },
    splitLine: {
      lineStyle: {
        color: "#e0e0e0",
        type: "dashed" as const,
      },
    },
  },
  series: [
    {
      smooth: true,
      showSymbol: false,
      data: Array.from({ length: 30 }).map(() => Math.random() * 90 + 10),
      type: "bar" as const,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(59, 130, 246, 1)" },
          { offset: 1, color: "rgba(59, 130, 246, 0.2)" },
        ]),
      },
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
