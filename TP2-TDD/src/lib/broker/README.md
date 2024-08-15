# TP2-TDD

## Broker
El Broker es un intermediario entre el bot y la API de Binance. Se encarga de realizar las peticiones necesarias para poder comprar, vender y obtener la cantidad disponible de las distintas criptodivisas.

### Dependencias
```bash
npm install @binance/connector
```

### Estructura
![broker](broker.png "Title")

Para implementarlo se utiliza el patrón de diseño *Singleton*, el cual garantiza que solo habrá una única instancia de la clase. Esto se logra de la siguiente forma:
- Con un atributo de clase privado que contenga a la instancia de Broker
- Con un método de clase público que retorne la instancia de Broker
- Haciendo privado el constructor, para que no pueda ser invocado desde afuera de la clase y crear nuevas instancias

Inicialmente el atributo de clase **instance** no posee ningún valor. La primera vez que es invocado el método de clase **getInstance()** llama (por única vez) al constructor de Broker para crear la instancia del mismo y lo almacena en **instance**. Las siguientes llamadas al método retornan el valor de dicho atributo, es decir, la instancia de Broker.
```
public static getInstance(): Broker {
    if (!Broker.instance) {
        Broker.instance = new Broker();
    }

    return Broker.instance;
}
```
### API
Como se ilustra en el diagrama de clases más arriba, la interfaz de Broker expone tres métodos:
- buy
- sell
- getBalance
#### buy
Recibe como parámetro un string **symbol** que es un par de criptomonedas. La primera indica la que deseo comprar, mientras que la segunda indica cómo pago dicha compra. El parámetro **quantity** indica la cantidad que deseo comprar.

Ejemplo
```
const broker = Broker.getInstance();
broker.buy("bnbusdt", 0.1)
    .then(console.log)
    .catch(error => console.log(error))
```
Indica que quiero comprar 0.1 Binance Coin, y a cambio voy a pagar USDT. ¿Cuánto USDT voy a pagar? Depende de la cotización del BNB en dolares al momento de realizar la compra. Asumiendo que en dicho momento 1 BNB vale 602 dolares, como estoy comprando 0.1 BNB voy a pagar 60.2 USDT.\
El resultado es una **Promesa** con la siguiente estructura:
```
{
    symbol: 'bnbusdt',
    side: 'BUY',
    type: 'MARKET',
    transactTime: 1716840209228,
    quantity: 0.1,
    price: 602,
    commissionAsset: 'BNB'
} 
```
El contenido de transactTime se puede hacer más legible de la siguiente forma:
```
const date = new Date(1716840209228)
console.log(date)

Mon May 27 2024 17:03:29 GMT-0300 (Argentina Standard Time)
```
Si al intentar comprar una criptomoneda no se dispone de los fondos necesarios para realizar la transacción, se lanza una excepción.
```bash
Error: Account has insufficient balance for requested action. ❌
```
Lo mismo ocurre si se intenta comprar una criptomoneda que no existe.
```bash
Error: Invalid symbol. ❌
```
#### sell
Recibe los mismos parámetros que **buy**. La diferencia es que ahora en **symbol**, la primera criptomoneda indica la que deseo vender, mientras que la segunda indica la criptomoneda que recibo por dicha venta. El parámetro **quantity** indica la cantidad que deseo vender.

Ejemplo
```
const broker = Broker.getInstance();
broker.sell("ethusdt", 0.1)
    .then(console.log)
    .catch(error => console.log(error))
```
Indica que quiero vender 0.1 Ethereum, y a cambio voy a recibir **x** USDT. El valor de **x** depende de la cotización del ETH en dolares al momento de realizar la venta. Asumiendo que en dicho momento 1 ETH vale 3900 dolares, como estoy vendiendo 0.1 ETH el valor de **x** es 390.\
El resultado es una **Promesa** con la siguiente estructura:
```
{
    symbol: 'ethusdt',
    side: 'SELL',
    type: 'MARKET',
    transactTime: 1716839137101,
    quantity: 0.1,
    price: 3900,
    commissionAsset: 'USDT'
} 
```
Al igual que **buy**, si no se dispone de fondos suficientes para realizar la operación o se intenta vender una criptomoneda que no existe se lanza una excepción.
#### getBalance
Recibe como parámetro un string **asset** que indica la criptomoneda sobre la cual quiero saber la cantidad disponible.
Algunos posibles valores de **asset** son:
- "ETH" Ethereum
- "BTC" Bitcoin
- "LTC" Litecoin
- "BNB" Binance coin
- "USDT" Tether USDT (dolares)

Ejemplo
```
const broker = Broker.getInstance();
broker.getBalance("ETH")
    .then(console.log)
    .catch(error => console.log(error))
```
Indica que quiero saber cuánto Ethereum tengo disponible.

El resultado es una **Promesa** con la siguiente estructura:
```
{
    asset: 'ETH',
    available: 3.1638
}
```
Si se consulta el saldo de una criptomoneda que no existe se lanza una excepción.
```bash
Error: Trying to fetch balance of a nonexistent cryptocurrency ❌: TDD
```