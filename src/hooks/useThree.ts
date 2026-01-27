import { onMounted, onUnmounted, ref, shallowRef, nextTick, type Ref } from "vue";
import {
  OrbitControls,
  CSS2DRenderer,
  GLTFLoader,
  type GLTF,
  DRACOLoader,
} from "three/examples/jsm/Addons.js";
import { isFunction } from "lodash";
import TWEEN from "three/examples/jsm/libs/tween.module.js";
import * as THREE from "three";

export function useThree(externalContainer?: Ref<HTMLElement | null>) {
  const container = externalContainer || ref<HTMLElement | null>(null);
  const scene = shallowRef<THREE.Scene | null>(null);
  const camera = shallowRef<THREE.Camera | null>(null);
  const renderer = shallowRef<THREE.WebGLRenderer | null>(null);
  const cssRenderer = shallowRef<CSS2DRenderer | null>(null);
  const controls = shallowRef<OrbitControls | null>(null);
  const composers = new Map<string, any>();
  const mixers: THREE.AnimationMixer[] = [];
  const clock = new THREE.Clock();
  const renderMixins = new Map<string, (delta: number) => void>();

  const animate = (): void => {
    const delta = clock.getDelta();
    if (renderer.value && scene.value && camera.value) {
      renderer.value.render(scene.value, camera.value);
      const mixerUpdateDelta = clock.getDelta();
      mixers.forEach((mixer: THREE.AnimationMixer) =>
        mixer.update(mixerUpdateDelta)
      );
      composers.forEach((composer) => composer.render(delta));
      renderMixins.forEach((mixin) => isFunction(mixin) && mixin(delta));
      if (cssRenderer.value) {
        cssRenderer.value.render(scene.value, camera.value);
      }
      TWEEN.update();
    }
    requestAnimationFrame(animate);
  };

  const boostrap = (): void => {
    if (!container.value) return;
    const { clientWidth, clientHeight } = container.value;

    // Scene
    scene.value = new THREE.Scene();

    // Camera
    camera.value = new THREE.PerspectiveCamera(
      45,
      clientWidth / clientHeight,
      1,
      10000
    );
    camera.value.position.set(20, 15, 20);

    // Renderer
    renderer.value = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.value.shadowMap.enabled = false;
    renderer.value.setSize(clientWidth, clientHeight);
    renderer.value.setClearAlpha(0.5);
    container.value.appendChild(renderer.value.domElement);

    // CssRenderer
    cssRenderer.value = new CSS2DRenderer();
    cssRenderer.value.setSize(clientWidth, clientHeight);
    cssRenderer.value.domElement.className = "css2d-renderer";
    cssRenderer.value.domElement.style.position = "absolute";
    cssRenderer.value.domElement.style.top = "0px";
    cssRenderer.value.domElement.style.pointerEvents = "none";
    cssRenderer.value.domElement.style.zIndex = "100";
    container.value.appendChild(cssRenderer.value.domElement);

    // Controls
    if (camera.value && renderer.value) {
      controls.value = new OrbitControls(
        camera.value,
        renderer.value.domElement
      );
      controls.value.minPolarAngle = 0;
      controls.value.enableDamping = true;
      controls.value.dampingFactor = 0.1;
      controls.value.target.set(0, 5, 0);
      controls.value.maxPolarAngle = Math.PI / 2;
      controls.value.minDistance = 10;
      controls.value.maxDistance = 100;
      controls.value.update();
    }

    // Lights
    if (scene.value) {
      const ambientLight = new THREE.AmbientLight(0x999999, 10);
      scene.value.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(20, 20, 20);
      directionalLight.position.multiplyScalar(1);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
      scene.value.add(directionalLight);
    }
  };

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/js/draco/gltf/");
  dracoLoader.setDecoderConfig({ type: "js" });

  const loadGltf = (url: string): Promise<GLTF> => {
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    const onCompleted = (object: GLTF, resolve: (value: GLTF) => void) =>
      resolve(object);
    const onError = (error: unknown, reject: (reason?: unknown) => void) => {
      console.error("模型加载失败:", url, error);
      reject(error);
    };

    return new Promise<GLTF>((resolve, reject) => {
      loader.load(
        url,
        (object: GLTF) => onCompleted(object, resolve),
        undefined,
        (error: unknown) => onError(error, reject)
      );
    });
  };

  const boostrapPromise = new Promise<void>((resolve, reject) => {
    onMounted(() => {
      const init = () => {
        console.log("boostrap 调用时 container.value:", container.value);
        try {
          // 确保容器有正确的尺寸
          if (!container.value || container.value.clientHeight === 0) {
            console.log("容器尺寸为0，等待DOM更新");
            setTimeout(init, 100);
            return;
          }

          boostrap();
          if (scene.value && camera.value && renderer.value) {
            console.log("Three.js 场景初始化成功");
            // 添加窗口大小变化监听
            window.addEventListener("resize", handleResize);
            animate();
            resolve();
          } else {
            console.error("Three.js 场景初始化失败：缺少必要组件", {
              scene: !!scene.value,
              camera: !!camera.value,
              renderer: !!renderer.value,
              container: !!container.value
            });
            reject(new Error("Three.js 场景初始化失败"));
          }
        } catch (error) {
          console.error("Three.js 场景初始化过程中发生错误：", error);
          reject(error);
        }
      };

      // 检查容器是否已经准备好，否则等待更长时间
      if (container.value) {
        console.log("容器已经准备好，立即初始化");
        init();
      } else {
        console.log("容器尚未准备好，等待 500ms 后重试");
        setTimeout(init, 500);
      }
    });

    onUnmounted(() => {
      window.removeEventListener("resize", handleResize);
    });
  });

  // 窗口大小变化处理
  const handleResize = () => {
    if (!container.value || !camera.value || !renderer.value || !cssRenderer.value) return;

    const { clientWidth, clientHeight } = container.value;

    // 确保是透视相机
    if (camera.value instanceof THREE.PerspectiveCamera) {
      camera.value.aspect = clientWidth / clientHeight;
      camera.value.updateProjectionMatrix();
    }

    renderer.value.setSize(clientWidth, clientHeight);
    cssRenderer.value.setSize(clientWidth, clientHeight);
  };

  // 启用/禁用轨道控制
  const enableControls = () => {
    if (controls.value) {
      controls.value.enabled = true;
    }
  };

  const disableControls = () => {
    if (controls.value) {
      controls.value.enabled = false;
    }
  };

  return {
    container,
    scene,
    camera,
    renderer,
    cssRenderer,
    controls,
    mixers,
    renderMixins,
    composers,
    loadGltf,
    enableControls,
    disableControls,
    boostrapPromise,
  };
}

export default useThree;
