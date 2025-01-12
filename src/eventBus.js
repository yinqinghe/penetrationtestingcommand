// src/eventBus.js
// import { createApp } from 'vue'; // Vue 3 的导入方式
// export const EventBus = createApp({});

import mitt from 'mitt';
const EventBus = mitt();
export default EventBus;
