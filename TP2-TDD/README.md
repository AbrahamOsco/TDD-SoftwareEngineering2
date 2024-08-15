# TP2-TDD
## Importante (Parseo de json)
En los json para trabajar el tp no se permite el campo "from" como clave dentro del arguments de tipo DATA, 
este debe ser cambiado por since, por ejemplo la sgt estructura es la correcta : 
```
{
	"type": "CALL",
	"name": "LAST",
	"arguments": {
		"type": "DATA",
		"since": 3600,
		"until": 0,
		"symbol": "BTC/USDT"
	}
}
```
### Docker

Crear la imagen de Docker mediante:

`docker build -t crypto-monitor .`

Correr una instancia de la imagen en modo de desarrollo, con el json de reglas deseado:
`docker run crypto-monitor`

#### Plus: 
Para correr múltiples instancias paralelas, con Compose, ejecutar:
`docker compose up`

En el archivo `compose.yaml` se pueden configurar todas las intancias deseadas del bot, cada una en su propio contenedor. Para ello, agregar o quitar servicios a voluntad, editando el campo `source` de cada uno, con el archivo de configuración deseado.


## Informe (PDF + Link):
<a href="./Trabajo Práctico N°_ 2  Crypto Monitor.pdf"> Informe del TP2 </a>
