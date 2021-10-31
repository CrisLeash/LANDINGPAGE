<template>
  <q-page class="q-pa-lg">
    <div class="column items-center">
      <q-avatar class="shadow-5" size="300px">
        <img src="~assets/cv-foto.jpg">
      </q-avatar>
      <div class="text-h1 text-weight-medium q-mt-xl">Hi, I'm Cris.</div>
      <div class="text-h5 text-weight-medium q-mt-sm">Welcome to my first Landing Page, built from scratch.</div>
      <div class="text-body1 text-italic q-mt-sm">(I'm still learning)</div>
      <q-btn class="q-mt-md" color="primary"  href="https://crodrigues.portfoliobox.net/" label="Click me" icon="touch_app" size="lg" target="_blank" type="a" />
      <q-img
      class="rounded-borders q-mt-lg"
      src="~assets/background-image.jpg"
      spinner-color="white"
      style="max-width: 800px"
    >
      <div class="absolute-bottom text-subtitle1 text-center">
        Thanks <a id="foto credits" href="https://www.instagram.com/nace.grg/" target="_blank">Nace</a> for the photo.
      </div>
    </q-img>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  methods: {
    shittyCris(cris) {
      if (cris === true) {
        return true;
      } else {
        return false;
      }
    },
    betterCris(cris) {
      return cris;
    }
  }
})
</script>
