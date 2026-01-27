import {
  onMounted,
  onUnmounted,
  createVNode,
  defineComponent,
  h,
  render,
  nextTick,
  shallowRef,
  ref,
  reactive,
  type Ref,
} from "vue";
import { CSS2DObject } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { sample } from "lodash";
import WidgetLabel from "@/components/WidgetLabel.vue";
import useThree from "./useThree";

// 模型路径信息
const Sources = {
  BuildingModel: "/models/base.glb",
  DeviceModel: "/models/devices.glb",
  LineModel: "/models/lines.gltf",
};

// 设备名称点位信息
const LabelPositions = [
  {
    name: "1# 服务器机柜",
    position: [-32, 8, -22],
  },
  {
    name: "2# 服务器机柜",
    position: [-20.2, 8, -22],
  },
  {
    name: "3# 服务器机柜",
    position: [-8.4, 8, -22],
  },
  {
    name: "4# 服务器机柜",
    position: [3.4, 8, -22],
  },
  {
    name: "5# 服务器机柜",
    position: [15.2, 8, -22],
  },
  {
    name: "6# 服务器机柜",
    position: [27, 8, -22],
  },
  {
    name: "1# 网络设备",
    position: [-32, 8, -6],
  },
  {
    name: "2# 网络设备",
    position: [-20.2, 8, -6],
  },
  {
    name: "3# 网络设备",
    position: [-8.4, 8, -6],
  },
  {
    name: "4# 网络设备",
    position: [3.4, 8, -6],
  },
  {
    name: "5# 网络设备",
    position: [15.2, 8, -6],
  },
  {
    name: "6# 网络设备",
    position: [27, 8, -6],
  },
  {
    name: "1# 电源柜",
    position: [-33, 6, 14],
  },
  {
    name: "2# 电源柜",
    position: [-21.2, 6, 14],
  },
  {
    name: "3# 电源柜",
    position: [-9.4, 6, 14],
  },
  {
    name: "4# 电源柜",
    position: [2.4, 6, 14],
  },
  {
    name: "5# 电源柜",
    position: [14.2, 6, 14],
  },
  {
    name: "6# 电源柜",
    position: [26, 6, 14],
  },
];

export function useDataCenter(externalContainer?: Ref<HTMLElement | null>) {
  const {
    container,
    scene,
    loadGltf,
    renderMixins,
    enableControls,
    disableControls,
    boostrapPromise,
  } = useThree(externalContainer);

  interface ModelsType {
    building: THREE.Group | null;
    devices: THREE.Group | null;
    lines: THREE.Group | null;
  }

  const models: ModelsType = {
    building: null,
    devices: null,
    lines: null,
  };
  const loading = reactive({
    total: 3, // 全部
    loaded: 0, // 已加载
    isLoading: true, // 执行状态
  });

  const devices = shallowRef<THREE.Mesh[]>([]);
  const warmingTimer = ref<number | null>(null);
  const warmingCurrent = shallowRef<THREE.Mesh | null>(null);

  // 加载模型
  const loadModel = async () => {
    const loadBuildingModel = async () => {
      try {
        console.log("开始加载建筑模型:", Sources.BuildingModel);
        const gltf = await loadGltf(Sources.BuildingModel);
        loading.loaded += 1;
        models.building = gltf.scene;
        scene.value!.add(gltf.scene);
        console.log("建筑模型加载成功");
      } catch (error) {
        console.error("建筑模型加载失败:", error);
        loading.loaded += 1; // 即使失败，也要增加加载计数，避免界面卡死
      }
    };
    const loadDeviceModel = async () => {
      try {
        console.log("开始加载设备模型:", Sources.DeviceModel);
        const gltf: { scene: THREE.Group } = await loadGltf(
          Sources.DeviceModel
        );
        // 安全地访问子对象
        if (gltf.scene.children[4] && gltf.scene.children[4].children) {
          devices.value.push(
            ...(gltf.scene.children[4].children as unknown as THREE.Mesh[])
          );
        } else {
          console.warn("设备模型结构不符合预期");
        }
        loading.loaded += 1;
        models.devices = gltf.scene;
        scene.value!.add(gltf.scene);
        console.log("设备模型加载成功");
      } catch (error) {
        console.error("设备模型加载失败:", error);
        loading.loaded += 1; // 即使失败，也要增加加载计数，避免界面卡死
      }
    };
    const loadLineModel = async () => {
      try {
        console.log("开始加载线路模型:", Sources.LineModel);
        const gltf = await loadGltf(Sources.LineModel);
        loading.loaded += 1;
        models.lines = gltf.scene;
        scene.value!.add(gltf.scene);
        console.log("线路模型加载成功");
      } catch (error) {
        console.error("线路模型加载失败:", error);
        loading.loaded += 1; // 即使失败，也要增加加载计数，避免界面卡死
      }
    };
    await Promise.all([
      loadBuildingModel(),
      loadDeviceModel(),
      loadLineModel(),
    ]);
    loading.isLoading = false;
    loading.loaded = 3;
  };
  // 添加道路箭头动画
  const addRoadArrowAnimation = () => {
    if (!models.building) return;
    const textures: THREE.Texture[] = [];
    models.building.traverse((mesh: THREE.Object3D) => {
      if ("name" in mesh && mesh.name.includes("道路箭头")) {
        const meshWithMaterial = mesh as unknown as {
          material: { map: THREE.Texture };
        };
        textures.push(meshWithMaterial.material.map);
      }
    });
    const animation = () => {
      textures.forEach((texture) => {
        const mutableTexture = texture as unknown as { offset: { y: number } };
        mutableTexture.offset.y = (mutableTexture.offset.y + 0.02) % 10000;
      });
    };
    renderMixins.set("road-arrow", animation);
  };

  // 添加设备名称标识
  const addDeviceLabels = () => {
    console.log("addDeviceLabels 函数被调用");
    if (!scene.value) {
      console.warn("场景未初始化，无法添加设备标签");
      return;
    }

    const cRender = <T extends object>(
      component: any,
      props: T
    ): HTMLElement | null => {
      const newComponent = defineComponent({
        render() {
          return h(component, props);
        },
      });
      const instance = createVNode(newComponent);
      render(instance, document.createElement("div"));
      return instance.el as HTMLElement;
    };
    console.log("LabelPositions 数组长度:", LabelPositions.length);
    LabelPositions.forEach((item, index) => {
      console.log(`正在添加第 ${index + 1} 个设备标签:`, item);
      const element = cRender(WidgetLabel, item);
      if (element) {
        console.log("成功创建 DOM 元素:", element.outerHTML);
        const label = new CSS2DObject(element);
        label.position.set(
          item.position[0],
          item.position[1],
          item.position[2]
        );
        scene.value!.add(label);
        console.log("成功添加到场景");
      } else {
        console.warn("无法创建 DOM 元素");
      }
    });
  };

  // 开始模拟告警
  const startWarming = () => {
    const handle = () => {
      if (warmingCurrent.value) {
        warmingCurrent.value.traverse((mesh: THREE.Object3D) => {
          if (!(mesh instanceof THREE.Mesh)) return;
          const meshWithCurrentHex = mesh as unknown as THREE.Mesh & {
            currentHex: number;
          };
          if (Array.isArray(meshWithCurrentHex.material)) {
            meshWithCurrentHex.material.forEach((m) => {
              if (m && "emissive" in m) {
                const emissiveMaterial = m as unknown as {
                  emissive: { setHex: (hex: number) => void };
                };
                emissiveMaterial.emissive.setHex(meshWithCurrentHex.currentHex);
              }
            });
          } else if (
            meshWithCurrentHex.material &&
            "emissive" in meshWithCurrentHex.material
          ) {
            const emissiveMaterial = meshWithCurrentHex.material as unknown as {
              emissive: { setHex: (hex: number) => void };
            };
            emissiveMaterial.emissive.setHex(meshWithCurrentHex.currentHex);
          }
        });
      }
      const index = sample([0, 1, 2, 3, 4, 5]);
      warmingCurrent.value = devices.value[index];

      warmingCurrent.value.traverse((originalMesh: THREE.Object3D) => {
        if (!(originalMesh instanceof THREE.Mesh)) return;
        const mesh = originalMesh as unknown as THREE.Mesh & {
          currentHex?: number;
        };
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone());
        } else {
          mesh.material = mesh.material.clone();
        }
        const material = Array.isArray(mesh.material)
          ? mesh.material[0]
          : mesh.material;
        if (material && "emissive" in material) {
          const emissiveMaterial = material as unknown as {
            emissive: { getHex: () => number; setHex: (hex: number) => void };
          };
          mesh.currentHex =
            mesh.currentHex ?? emissiveMaterial.emissive.getHex();
          emissiveMaterial.emissive.setHex(0xff0000);
        }
      });
    };
    handle();
    warmingTimer.value = setInterval(handle, 1000 * 2);
  };

  // 停止模拟告警
  const stopWarming = () => {
    if (warmingCurrent.value) {
      warmingCurrent.value.traverse((mesh: THREE.Object3D) => {
        if (!(mesh instanceof THREE.Mesh)) return;
        const meshWithCurrentHex = mesh as unknown as { currentHex: number };
        mesh.material.emissive.setHex(meshWithCurrentHex.currentHex);
      });
    }
    if (warmingTimer.value) {
      window.clearInterval(warmingTimer.value);
      warmingTimer.value = null;
    }
  };

  onMounted(() => {
    console.log("useDataCenter onMounted 钩子被调用");
    nextTick(async () => {
      try {
        console.log("开始等待 boostrapPromise 解析");
        await boostrapPromise;
        console.log("boostrapPromise 已解析");
        // 确保场景已初始化
        if (scene.value) {
          console.log("场景已初始化，开始加载模型");
          await loadModel();
          addRoadArrowAnimation();
          addDeviceLabels();
        } else {
          console.error("场景初始化失败，无法继续加载模型");
        }
      } catch (error) {
        console.error("初始化过程中发生错误：", error);
      }
    });
  });

  // 组件卸载时清理定时器
  onUnmounted(() => {
    stopWarming();
  });
  return {
    container,
    loadModel,
    loading,
    startWarming,
    stopWarming,
    enableControls,
    disableControls,
  };
}

export default useDataCenter;
