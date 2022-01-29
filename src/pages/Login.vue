<template>
  <div class="col-6 form-widget">
    <h1 class="header">Bem vindo à Shoppist</h1>
    <p class="ballon nes-balloon from-right">Sua lista de compras na web!</p>
    <div class="foot">
      <div class="wavy">
        <span style="--i: 1">E</span>
        <span style="--i: 2">n</span>
        <span style="--i: 3">t</span>
        <span style="--i: 4">r</span>
        <span style="--i: 5">a</span>
        <span style="--i: 6">r</span>
        <span style="--i: 7">_</span>
        <span style="--i: 8">c</span>
        <span style="--i: 9">o</span>
        <span style="--i: 10">m</span>
        <span style="--i: 11">:</span>
      </div>
      <button
        v-for="button in buttons"
        :key="button.name"
        type="submit"
        class="nes-btn block flex items-center flex-center mb-4"
        :style="`--shadow: ${button.shadow_color};
        --bg: ${button.bg_color};
        --text: ${button.text_color};`"
        @click="signIn(button.provider)"
        :disabled="loading"
      >
        {{ button.name }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../supabase";

export default {
  setup() {
    const loading = ref(false);
    const router = useRouter();
    const buttons = ref([
      {
        name: "Discord",
        provider: "discord",
        text_color: "#f6f6f6",
        bg_color: "#5865f2",
        shadow_color: "#1d0bba",
      },
      /* {
        name: "Google",
        provider: "google",
        text_color: "#ffffff",
        bg_color: "#d44538",
        shadow_color: "#b23121",
      },
      {
        name: "Twitch",
        provider: "twitch",
        text_color: "#ffffff",
        bg_color: "#9146FF",
        shadow_color: "#664cda;",
      },
      {
        name: "Twitter",
        provider: "twitter",
        text_color: "#E1E8ED",
        bg_color: "#1DA1F2",
        shadow_color: "#187cce",
      }, */
    ]);
    const isUserSignedIn = computed(() => Boolean(supabase.auth.user()));

    async function signIn(provider) {
      loading.value = true;
      const { user, session, error } = await supabase.auth.signIn({
        provider: provider,
      });
      loading.value = false;
    }

    onMounted(() => {
      setTimeout(() => {
        if (isUserSignedIn.value) {
          router.push("/");
        }
      }, 500);
    });

    return {
      loading,
      isUserSignedIn,
      buttons,
      signIn,
    };
  },
};
</script>
<style scoped>
.foot {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
}
.wavy {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}
.wavy span {
  position: relative;
  display: inline-block;
  animation: wave 2s ease-in-out infinite;
  animation-delay: calc(0.1s * var(--i));
}
@keyframes wave {
  0% {
    transform: translateY(0px);
  }
  20% {
    transform: translateY(-20px);
  }
  40%,
  100% {
    transform: translateY(0px);
    color: black;
  }
}
.ballon {
  position: relative;
  animation: bob 3s ease-in-out infinite;
}
@keyframes bob {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(0px);
  }
}
.nes-btn {
  color: var(--text);
  background-color: var(--bg);
}
.nes-btn::after {
  box-shadow: inset -4px -4px var(--shadow) !important;
}
</style>
