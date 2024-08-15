# Binance WebSocket Monitor

Este proyecto es una aplicación para monitorear precios en tiempo real desde el
WebSocket de Binance utilizando TypeScript.

## Requisitos Previos

Asegúrate de tener instalados los siguientes software:

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [npm](https://www.npmjs.com/) (versión 6 o superior)

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://gitlab.com/AbrahamOsco/tp2-tdd.git
   cd tp2-tdd
   ```

2. Instala las dependencias:

   ```bash

   npm install
   ```

## Construcción del Proyecto

Para construir el proyecto, ejecuta:

```bash
npm run build
```

Este comando compilará los archivos TypeScript y copiará el archivo de
configuración `currencies.json` al directorio de distribución `dist`.

```bash
npm run dev
```

## Ejecución de Pruebas

Para ejecutar las pruebas, utiliza el siguiente comando:

```bash
npm test
```

Esto ejecutará las pruebas definidas en la carpeta `tests` utilizando Jest.

## Ejecución del Proyecto

Después de construir el proyecto, puedes ejecutar la aplicación utilizando
Node.js:

```bash
node dist/index.js
```

## DataService

`DataService` es una clase en TypeScript que permite almacenar y gestionar
datos de precios de criptomonedas. También implementa el patrón Observer,
permitiendo notificar a los observadores cuando ocurre un cambio significativo
en los precios.

## Características

- Almacena datos de precios de criptomonedas en memoria.
- Limpia automáticamente datos antiguos fuera de un intervalo de tiempo definido.
- Notifica a los observadores cuando se detectan cambios significativos en los
  precios.
- Solo almacena cambios de precios significativos en el historial.

## Configuración

### Configuración de constantes

Asegúrate de tener un archivo `constants.ts` en tu carpeta de configuración
(`src/config/constants.ts`) que defina las constantes necesarias:

```typescript
export const HISTORY_INTERVAL = 60 * 60 * 1000; // 1 hora en milisegundos
export const SIGNIFICANT_CHANGE_THRESHOLD = 0.001; // 0.1%
```

Asegúrate de que el archivo `currencies.json` está configurado con
las monedas que deseas monitorear. Ejemplo:

```json
{
  "currencies": ["btcusdt", "ethusdt"]
}
```
