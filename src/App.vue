<template>
  <div class="layout">
    <LayoutHeader />
    <LayoutFooter />
    <LayoutLoading :loading="loading" />
    <div class="layout-main">
      <!-- 左侧看板区域 -->
      <div class="main-left">
        <WidgetPanel04 />
        <WidgetPanel01 />
        <WidgetPanel06 />
      </div>
      <!-- 右侧3D视图区域 -->
      <div class="main-right" ref="threeContainer"></div>
      <div class="mask" v-if="showMask"></div>
    </div>
    <!-- 设备详情面板 -->
    <DeviceDetailPanel
      v-if="selectedDeviceData"
      :device-data="selectedDeviceData"
      @close="selectedDeviceData = null"
      @click.stop
    />
  </div>
</template>
<script setup lang="ts">
import { provide, ref, watchEffect, onMounted } from "vue";
import LayoutHeader from "@/components/LayoutHeader.vue";
import LayoutFooter from "@/components/LayoutFooter.vue";
import LayoutLoading from "@/components/LayoutLoading.vue";

import WidgetPanel01 from "@/components/WidgetPanel01.vue";
import WidgetPanel04 from "@/components/WidgetPanel04.vue";
import WidgetPanel06 from "@/components/WidgetPanel06.vue";
import DeviceDetailPanel from "@/components/DeviceDetailPanel.vue";
import { eventBus } from "@/utils/eventBus";

import { useDataCenter } from "@/hooks/useDataCenter";

const threeContainer = ref<HTMLElement | null>(null);
const {
  container: threeContainerRef,
  loading,
  startWarming,
  stopWarming,
  enableControls,
  disableControls,
} = useDataCenter(threeContainer);

// 同步 ref
watchEffect(() => {
  // 这里 threeContainer 已经通过 ref 属性绑定到 DOM 上，
  // useDataCenter 内部已经通过 useThree 的 container 处理了 Three.js 的挂载
});
const showMask = ref(false);
const selectedDeviceData = ref<any>(null);

// 监听显示设备详情事件
onMounted(() => {
  eventBus.on("showDeviceDetail", (deviceData) => {
    selectedDeviceData.value = deviceData;
  });
});

// 提供显示/隐藏遮罩层的方法
provide("mask", {
  show: () => {
    showMask.value = true;
  },
  hide: () => {
    showMask.value = false;
  },
});

provide("events", { startWarming, stopWarming, enableControls, disableControls });
</script>
<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  .layout-main {
    position: relative;
    width: 100%;
    height: calc(100% - 80px);
    .main-left {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 999;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      grid-gap: 20px;
      width: 420px;
      height: calc(100% - 40px);
    }
    .main-right {
      position: absolute;
      top: 0;
      left: 460px;
      z-index: 2;
      width: calc(100% - 460px);
      height: 100%;
      &::before {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        z-index: 99;
        width: 100%;
        height: 100%;
        pointer-events: none;
        content: "";
        background-image: radial-gradient(circle, transparent 30%, rgba(15, 23, 42, 0.4) 60%);
      }
    }
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9998;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      pointer-events: none;
    }
  }
}
</style>
