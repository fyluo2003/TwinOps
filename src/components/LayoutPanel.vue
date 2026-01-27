<template>
  <div class="layout-panel">
    <div class="panel-header">
      <div class="panel-header-title">{{ title }}</div>
    </div>
    <div class="panel-body">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
interface PropsType {
  title: string | number;
}
const { title } = defineProps<PropsType>();
</script>
<style lang="scss" scoped>
.layout-panel {
  position: relative;
  color: #fff;
  background-image: url("@/assets/panel_body_bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 254, 169, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 30px rgba(0, 254, 169, 0.2);
    transform: translateY(-2px);
  }

  .panel-header {
    display: flex;
    align-items: center;
    height: 65px;
    font-family: Douyu;
    background-image: url("@/assets/panel_title_bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .panel-header-title {
      position: relative;
      top: -12px;
      left: 70px;
      font-size: 15px;
      font-weight: bold;
      letter-spacing: 1px;
      text-shadow: 0 0 10px rgba(0, 254, 169, 0.5);
    }
  }
  .panel-body {
    height: 220px;
    padding: 0 10px 10px;
  }
}
</style>
