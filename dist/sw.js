const CACHE_NAME = 'sisunic-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/utils/formatter.ts',
  '/utils/reverseCalculations.ts',
  '/components/ColorBandSelector.tsx',
  '/components/SmdResistorView.tsx',
  '/components/ElectrolyticCapacitorInfo.tsx',
  '/components/CeramicCapacitorView.tsx',
  '/components/CodeResultDisplay.tsx',
  '/components/ResultResistorView.tsx',
  '/components/InfoModal.tsx',
  '/components/InfoContent.tsx',
  '/components/PotentiometerView.tsx',
  '/components/SensorInfoView.tsx',
  '/components/ThermistorCalculator.tsx',
  '/components/LdrSimulator.tsx',
  '/components/CameraIdentifier.tsx',
  '/components/IdentificationResultModal.tsx',
  '/components/CameraErrorModal.tsx',
  '/components/SkeletonLoader.tsx',
  '/context/TranslationContext.tsx',
  '/hooks/useTranslation.tsx',
  '/locales/en.json',
  '/locales/fa.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap',
  'https://fonts.gstatic.com/s/vazirmatn/v11/Dxx78-e_8Y_r_ecS9z4h_JL2lVpO-D4a_g.woff2', // font pre-caching
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});