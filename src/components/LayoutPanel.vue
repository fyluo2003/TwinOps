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
  color: #e2e8f0;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    transform: translateY(-2px);
    border-color: rgba(148, 163, 184, 0.4);
  }

  .panel-header {
    display: flex;
    align-items: center;
    height: 65px;
    font-family: Douyu;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(147, 197, 253, 0.2) 100%);
    border-radius: 12px 12px 0 0;
    border-bottom: 1px solid rgba(148, 163, 184, 0.3);
    .panel-header-title {
      position: relative;
      top: -12px;
      left: 70px;
      font-size: 15px;
      font-weight: bold;
      letter-spacing: 1px;
      color: #60a5fa;
    }
  }
  .panel-body {
    height: 220px;
    padding: 0 10px 10px;
  }
}
</style>
