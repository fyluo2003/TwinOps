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
  color: #333;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .panel-header {
    display: flex;
    align-items: center;
    height: 65px;
    font-family: Douyu;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 8px 8px 0 0;
    .panel-header-title {
      position: relative;
      top: -12px;
      left: 70px;
      font-size: 15px;
      font-weight: bold;
      letter-spacing: 1px;
      color: #2c3e50;
    }
  }
  .panel-body {
    height: 220px;
    padding: 0 10px 10px;
  }
}
</style>
