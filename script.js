// Configuración
const STAR_COUNT = 100; // Número de estrellas que quieres generar
const CONTAINER = document.getElementById("star-container");

/**
 * 1. Generación Inicial de Estrellas
 */
function createStars() {
  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    // Posición aleatoria
    const x = Math.random() * 100; // % del ancho
    const y = Math.random() * 100; // % del alto
    star.style.left = `${x}vw`; // Usamos vw (viewport width)
    star.style.top = `${y}vh`; // Usamos vh (viewport height)

    // Tamaño aleatorio (para profundidad visual)
    const size = Math.random() * 2 + 1; // Entre 1px y 3px
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    // Guardamos el factor de "profundidad" de la estrella en un atributo.
    // Las estrellas más grandes (más cercanas) se moverán más.
    // Normalizamos el tamaño para usarlo como factor de movimiento.
    star.dataset.depth = size / 3;

    CONTAINER.appendChild(star);
  }
}

/**
 * 2. Manejo del Evento de Movimiento del Ratón
 */
function handleMouseMove(event) {
  // Obtenemos el ancho y alto del contenedor
  const containerRect = CONTAINER.getBoundingClientRect();

  // Posición X e Y del ratón dentro del contenedor (de 0 a ancho/alto)
  const mouseX = event.clientX - containerRect.left;
  const mouseY = event.clientY - containerRect.top;

  // Calculamos el "offset" del ratón desde el centro del contenedor.
  // Esto nos da un valor entre -1 y 1.
  // offsetX es -1 (izquierda) a 1 (derecha)
  const offsetX = (mouseX / containerRect.width) * 2 - 1;
  // offsetY es -1 (arriba) a 1 (abajo)
  const offsetY = (mouseY / containerRect.height) * 2 - 1;

  // Seleccionamos todas las estrellas
  const stars = document.querySelectorAll(".star");

  stars.forEach((star) => {
    // Obtenemos el factor de profundidad que guardamos antes
    const depth = parseFloat(star.dataset.depth);

    // Calculamos el desplazamiento del movimiento.
    // Multiplicamos el offset del ratón por un valor base (por ejemplo, 15)
    // y por el factor de profundidad (depth).
    // Estrellas más cercanas (mayor depth) se mueven más (efecto parallax).
    const moveX = offsetX * 15 * depth;
    const moveY = offsetY * 15 * depth;

    // Aplicamos el movimiento usando la transformación CSS.
    // 'translate3d' es más eficiente y permite usar 'px' para el movimiento.
    star.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  });
}

// 3. Inicialización
createStars();

// Añadimos el oyente de evento al contenedor
CONTAINER.addEventListener("mousemove", handleMouseMove);

const IMAGE = document.getElementById("float-container");
const ELEMENTS = document.querySelectorAll(".float-element");
const REPULSION_RADIUS = 150; // Distancia máxima en píxeles para que el elemento reaccione
const REPULSION_STRENGTH = 30; // Máximo de píxeles que se moverá el elemento

/**
 * Función que se ejecuta en cada movimiento del ratón.
 */
function handleMouseMove2(event) {
  // Posición del ratón en la ventana
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  ELEMENTS.forEach((element) => {
    // Obtenemos la posición inicial de las variables CSS
    const initialX = parseFloat(
      element.style.getPropertyValue("--initial-x").replace("px", "")
    );
    const initialY = parseFloat(
      element.style.getPropertyValue("--initial-y").replace("px", "")
    );

    // Posición actual del centro del elemento (sumamos la mitad del ancho/alto)
    // Esto asume que el PNG tiene un tamaño (e.g., 100x100), ajusta si es necesario.
    const rect = element.getBoundingClientRect();
    const elementCenterX = rect.left + rect.width / 2;
    const elementCenterY = rect.top + rect.height / 2;

    // --- CÁLCULO VECTORIAL DE DISTANCIA ---

    // Distancia en X e Y entre el ratón y el centro del elemento
    const distX = mouseX - elementCenterX;
    const distY = mouseY - elementCenterY;

    // Distancia total (magnitud del vector) usando el Teorema de Pitágoras
    const distance = Math.sqrt(distX * distX + distY * distY);

    let finalTranslateX = 0;
    let finalTranslateY = 0;

    // Solo reacciona si está dentro del radio de repulsión
    if (distance < REPULSION_RADIUS) {
      // Calculamos el factor de fuerza: 1 (cerca) a 0 (lejos)
      const forceFactor = 1 - distance / REPULSION_RADIUS;

      // Aplicamos la fuerza de repulsión:
      // Normalize (distX/distance) para obtener la dirección unitaria.
      // Multiplicamos por la fuerza y la intensidad.

      // Queremos que se mueva en dirección OPUESTA al ratón
      finalTranslateX = -(distX / distance) * REPULSION_STRENGTH * forceFactor;
      finalTranslateY = -(distY / distance) * REPULSION_STRENGTH * forceFactor;
    }

    // Aplicamos la nueva transformación.
    // Mantenemos la posición inicial (--initial-x/y) y aplicamos el desplazamiento final.
    element.style.transform = `translate(
            calc(${initialX}px + ${finalTranslateX}px), 
            calc(${initialY}px + ${finalTranslateY}px)
        )`;
  });
}

// Inicialización: Añadir el listener de movimiento al contenedor
CONTAINER.addEventListener("mousemove", handleMouseMove);
CONTAINER.addEventListener("mousemove", handleMouseMove2);
