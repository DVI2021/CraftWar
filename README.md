# WarCraft

## Descripción
Juego desarrollado para la asignatura "Desarrollo de Videojuegos mediante tecnologías Web", optativa de la Facultad de Informática de la Universidad Complutense de Madrid.
   
Juego basado en el Warcraft I de 1994 para pc, preparado para jugar en pc y en una pantalla con resolución 1080p.
     
Programado enteramente en JavaScrpit, con el uso del motor visto en clase, Quintus.
   
Podemos jugar a una misión luchando contra el portal de los orcos, destruye todos sus campamentos antes que se acabe el tiempo o todo Acelot será arrasada por la horda. Construye tu campamento, extrae los recursos y crea tu ejercito para destruir el portal de los orcos. 
     
Se ha realizado un juego basado en los RTS del momento, tales como el Age of Empire o el Warcraft, aun que de manera simplificada buscamos tener todos los elementos propios de lo que se puede esperar en un juego así, gestión de recursos, construcción de una base, movimiento de las unidades y una interfaz que permita su visualización detallada. 
  
# Diseño del juego
## Victoria y Derrota
Se ganará la misión al destruir todos los campamentos de los orcos.
    
Se perderá al terminar el tiempo limite.
  
## Mecánicas principales
* Movimiento por el mapa arrastrando el ratón por los bordes de la pantalla de juego.
* Selección de distintos elementos visualizando sus parámetros, mediante el click izquierdo.
* Selección de acción de cada elemento seleccionado en función del elemento destino, mediante el click derecho.
* Gestión de la obtención de recursos, oro o madera, de forma continuada y automatizada una vez ordenada la acción de obtención.
* Movimiento por el mapa optimo mediante la aplicación del algoritmo A* para el pathfinding.
* Gestión de los enemigos de forma que ataquen de forma dispersa a los enemigos que se acerquen a sus campamentos.
* GUI adaptativa en función de la unidad seleccionada.
* Construcción de los edificios, en función de la existencia suficiente de recursos, mediante la interfaz.
* Colisiones entre elementos del mapa y elementos del juego
* Comportamientos inteligentes de lucha 
* Control del limite de la población
  
## Personajes
Utilizamos un conjunto reducido de los elementos del juego de Warcraft II, escogiendo un numero reducido de elementos acorde al tiempo del proyecto que incluyan variedad.  
Además, y ya que buscamos una primera aproximación, tan solo utilizamos los edificios de gestión humanos.
  
### Humanos
Unidades : [campesino, guerrero, arquero]
  
![Un campesino un arquero y un soldado](/images/readme/humanos.png)
   
Campesino: Base para la gestión de los recursos del juego. Seleccionándolo y enviándolo a por un arbol, recolectará madera con el árbol seleccionado y al terminar de tarlarlo continuará con otro árbol cercano, de forma analoga, si se le envía a una mina recolectará oro hasta que la mina se quede sin reservas del mineral. También podemos moverlo por el mapa, pero no podrá atacar a enemigos.
  
Guerrero: Soldado principal del ejercito de los humanos, esta unidad es un soldado cuerpo a cuerpo equipado con una espada, con el seleccionado y ordenando le avanzar a un enemigo, se acercará y lo atacará.
  
Arquero: Similar al guerrero, puede atacar a unidades enemigas a cierta distancia, por lo que si seleccionas a un enemigo, el arquero se acercará hasta estar a una distancia limite y lanzará flechas hasta hasta acabar con su enemigo.
  
Edificios : [castillo, cuartel, granja, serrería]
  
![Granjas, castilo, cuartel y serrería](/images/readme/edificioshumanos.png)
  
Castillo: Edificio principal de un asentamiento humano, en el podrás reclutar nuevos campesinos y estos podrán depositar sus recursos en él, almacenando los recursos para su posterior uso en la construcción de nuevos edificios o el reclutamiento de nuevas unidades.
  
Cuartel: Edificio que nos permite el reclutamiento de nuevas unidades bélicas de los humanos, guerreros y arqueros, por sus respectivos costos.
  
Granja: Para limitar el numero de unidades humanas, simulamos la necesidad de alimentar a las unidades, permitiendo reclutar más unidades teniendo más granjas.
  
Serrería: En este edificio se construyen los arcos, lo que nos permite habilitar el reclutamiento de los arqueros.
  
### Orcos
Unidades : [guerrero orco, lanzador de hacha]
  
![Un Orco y varios Lanzadores de hachas](/images/readme/orcos.png)
  
Guerrero orco: unidad principal del ejercito orco, soldado cuerpo a cuerpo que, determinado su objetivo y definido su estado, se acercará cuerpo a cuerpo y atacará a cualquier humano cercano a su campamento.
  
Lanzador de hacha: Estos soldados se mantienen a cierta distancia del enemigo para lanzar sus hachas en un ataque a distancia, como el guerrero orco, determinado su objetivo y definido su estado, se acercará lo suficiente y atacará a cualquier humano que se acerque al campamento.
  
Edificios : [fortaleza]
  
![Edificios Orcos](/images/readme/fortalezas.png)
  
Fortaleza: Para controlar la IA de los orcos y organizar las unidades de los orcos, estas se agrupan en estos edificios y su lógica la gestiona el edificio en sí. De este modo, cuando las unidades humanas se acercan a estos puestos avanzados, los orcos destinados en estos se despliegan para atacar a los humanos en su rango de actuación. Cuando sus orcos mueren, al cabo de un tiempo se genera un nuevo orco.
  
# Diseño de la implemenetación

## Esquema de la arquitectura del proyecto
  
![Clases](/images/readme/clases.png)
  
## Descripción de las principales clases
Units: Clase que gestiona las variables y métodos comunes que se pueden llevar acabo desde alguna unidad, se añade el componente CW2D común a todos los elementos del juego. Dentro de las variables más relevantes tenemos la vida, la lista de nodos hasta el objetivo (camino), el objeto objetivo etc..., por otra parte, los métodos comunes serían la gestión del click derecho, obtener el camino optimo o el método para moverse.
  
HumanBuildings: Clase en donde encontramos principalmente los métodos de los edificios, en este caso, los edificios humanos. Incluimos el componente CW2D. Adicionalmente tenemos el método necesario para moverlo por el mapa en el periodo de construcción. Los métodos son sencillos ya que su principal función es mostrarse en el mapa.
  
HumanUnit: Para la definición de parámetros comunes entre las unidades humanas, como por ejemplo, el tipo o el tipo del enemigo y que todas las unidades humanas posean este ancestro común.
  
Clases extienden HumanUnit: Tenemos las clases de los campesinos, soldados y arqueros, que extiende a HumanUnit y cumplimentan características propias.
  
Clases extienden OrcUnit: De forma análoga a las unidades humanas, en este caso tenemos las clases de Grunt y Axethrower.
  
BattlePoint: Ya que no tenemos varios edificios de los orcos,tan solo implementamos una única clase que gestiona el edificio de los campamentos de batalla.En esta clase tendremos todos los elementos base de los HumanBuildings y los propios.Para la gestión de los enemigos en cada step se ejecuta dicha lógica, primero se generan los orcos que hayan sido eliminados,se obtienen los enemigos, se comprueban los enemigos ya seleccionados y por ultimo asigna los enemigos a cada orco en el campamento.

Proyectil: Pequeña clase para la gestión de las saetas, flechas y hachas que son lanzadas por los orcos. Gestiona el step y cada clase configura e implementa la función de hit.
  
Resource: Otra implementación reducida para los recursos, al no tener una interacción en el mapa tan solo se encarga de mostrar un sprite y las clases que lo extienden asignan el sprite y definen los distintos recursos.
  
## Descripción de los principales componentes
CW2D: Componente principal del juego, ya que la clase original sprite realiza distintas comprobaciones y ejecuta conceptos como la gravedad, la implementación de una clase propia que sustituya a una clase general de la que todo elemento del juego tenga que añadir. Destaca la configuración de la malla, una malla de colisión que comprime el mapa original en casillas de 10x10 con valor true o false, necesaria para la obtención de los caminos óptimos en el algoritmo A*.
  
Seleccionable: Para ejecutar la lógica de selección y para evitar complejidades, se crea este componente para ejecutar dicha lógica de control para ver si dicho elemento es el mismo elemento que el elemento global seleccionado, entonces es que está selecionado. De igual forma controlar la deseleccionado del mismo.
  
Nothing: Componente que realiza la lógica para trasladar a los elementos a un punto determinado y mantenerse quito en dicho punto.
  
Wooding/Mining: Ambos componentes realizan la misma lógica  para sus respectivos recursos. Primero se acerca al recurso en cuestión, durante un periodo de tiempo se dedican a extraer dicho recurso, alcanzado el máximo del recurso que pueden llevar procede a ir al castillo, una vez en el castillo descarga el recurso y vuelve a calcular el camino al destino volviendo a ejecutar el mismo procedimiento.
  
Atacking: Componente para la lucha de las unidades cuerpo a cuerpo, para ello primero se acercan al objetivo, una vez a melee procede a atacar hasta quitarle todos los puntos de vida, cuando se eliminaría el componente y se les añade el componente nothing para mantener la posición.
  
AtackingDistance: De forma análoga a Atacking, con la diferencia que, al acercarse se mantienen a una distancia desde la cual pueda alcanzar al objetivo. 
  
# Equipo de trabajo

## Miembros del grupo
Ignacio Corrales Agustín  
Gerardo Meiro Mendoza  
Christhian Jesús Ripa  
  
## Trabajos realizados
Ignacio: [Movimiento del mapa con ratón, Componentes de lógica recursos, Presentación y documentación, lógica de la IA]
  
Gerardo: [Adaptación e incorporación graficos, Componentes de lógica de combate, Movimiento de unidades]
  
Christhian: [Gestión de recursos, Interfaz adaptativa, Creación de edificios, Reclutamiento dinamico]

# Fuentes y referencias
## Sprites 
  
[Sprites del Warcraft II](https://www.spriters-resource.com/pc_computer/warcraft2/)
  
## Música

[Música del Warcraft II](https://www.sounds-resource.com/pc_computer/warcraft2/)

# Trabajo pendiente y bugs
## Solucion de bugs
Listaremos una serie de bugs conocidos, que no pudimos solucionar, por falta de tiempo.
* Flecha de los arqueros no daña a los orcos soldados.
* Hay que acercar el soldado cerca de los enemigos a causa del A*.

## Trabajo pendiente
* Ampliar el número de edificios y de unidades.
* Añadir funcionalidades de los edificio y unidades en la UI.
* La producción y creación tenga un tiempo de generación.
* Añadir un minimapa
* Crear una IA que gestione rescursos, cree edificios y tropas para construir un campamento y atacar al usuario.
* Añadir banda sonora dinámica y efectos de sonido.
