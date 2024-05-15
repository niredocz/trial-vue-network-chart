<template lang="pug">
component(:is="$route.meta.layout || 'div'")
  router-view
</template>