<template>
  <LayoutPanel title="服务器负载变化">
    <div class="container" ref="container"></div>
  </LayoutPanel>
</template>
<script setup lang="ts">
import { nextTick, onMounted } from "vue";
import { sampleSize, range } from "lodash";
import useEcharts from "@/hooks/useEcharts";
import LayoutPanel from "./LayoutPanel.vue";

const { container, setOption } = useEcharts();

const generateOptions = (sources: number[][]) => ({
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
    left: "1%",
    right: "6%",
    bottom: "0%",
    top: "20%",
    containLabel: true,
  },
  xAxis: {
    type: "category" as const,
    boundaryGap: false,
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: "#666",
      margin: 20,
    },
    data: ["11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
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
      name: "1#",
      type: "line" as const,
      symbol: "none",
      smooth: true,
      lineStyle: {
        width: 2,
        color: "rgba(59, 130, 246, 1)",
      },
      itemStyle: {
        color: "rgba(59, 130, 246, 0.5)",
      },
      // areaStyle: {},
      data: sources[0],
    },
    {
      name: "2#",
      type: "line" as const,
      symbol: "none",
      smooth: true,
      lineStyle: {
        normal: {
          width: 2,
          color: "rgba(16, 185, 129, 1)",
        },
      },
      itemStyle: {
        color: "rgba(16, 185, 129, 0.5)",
      },
      // areaStyle: {},
      data: sources[1],
    },
    {
      name: "3#",
      type: "line" as const,
      symbol: "none",
      smooth: true,
      lineStyle: {
        normal: {
          width: 2,
          color: "rgba(245, 158, 11, 1)",
        },
      },
      itemStyle: {
        color: "rgba(245, 158, 11, 0.5)",
      },
      // areaStyle: {},
      data: sources[2],
    },
  ],
});

onMounted(() => {
  nextTick(() => {
    const sources = [
      sampleSize(range(1000, 200), 7),
      sampleSize(range(1000, 200), 7),
      sampleSize(range(1000, 200), 7),
    ];
    const options = generateOptions(sources);
    setOption(options);
  });
});
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>
