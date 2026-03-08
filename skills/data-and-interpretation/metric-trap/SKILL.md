---
name: metric-trap
description: Desmonta un KPI o métrica mostrando todas las formas en que puede ser manipulada, malinterpretada o generar incentivos perversos. Úsalo antes de proponer una métrica, al revisar un dashboard o cuando sospechas que un número no cuenta toda la historia.
argument-hint: "[KPI o métrica a analizar]"
disable-model-invocation: true
---

Desmonta la siguiente métrica o KPI mostrando sus trampas, sesgos e incentivos perversos:

$ARGUMENTS

Una métrica bien elegida alinea comportamiento con objetivo. Una mal elegida hace lo contrario sin que nadie lo note hasta que es tarde. Tu trabajo es encontrar todas las formas en que esta métrica puede fallar — antes de que lo haga en producción.

---

## Análisis

### 1. Qué mide realmente (vs. qué parece medir)

Describe con precisión qué captura la métrica en términos operacionales. Luego sepáralo de lo que se asume que representa. ¿Qué distancia hay entre ambos?

---

### 2. Formas de gaming

¿Cómo puede alguien mejorar el número sin mejorar lo que el número debería representar?

Para cada forma de gaming identifica:
- **La maniobra**: qué hace exactamente el actor para mover la métrica
- **El coste oculto**: qué se deteriora mientras el número mejora
- **La señal de alerta**: cómo detectarías que está pasando

---

### 3. Incentivos perversos

¿Qué comportamientos racionales para el individuo son dañinos para el sistema?

Aplica la Ley de Goodhart: *cuando una medida se convierte en objetivo, deja de ser una buena medida.* ¿En qué momento ocurre eso aquí y qué forma toma?

---

### 4. Sesgos de medición

¿Qué distorsiona el valor de la métrica antes de que nadie la manipule activamente?

Considera:
- **Sesgo de selección**: ¿qué casos no entran en el cálculo?
- **Sesgo de supervivencia**: ¿qué se excluye implícitamente por cómo se define?
- **Efecto de observación**: ¿el hecho de medir cambia lo que se mide?
- **Ventana temporal**: ¿el periodo de medición distorsiona el resultado?

---

### 5. Lo que la métrica no ve

¿Qué aspectos importantes del fenómeno quedan completamente fuera de esta medición? Nombra al menos tres cosas relevantes que la métrica es estructuralmente incapaz de capturar.

---

### 6. Métricas complementarias

¿Qué otras métricas, medidas conjuntamente, limitarían las trampas identificadas?

Para cada complemento propuesto explica qué trampa específica contrarresta y qué trampa nueva podría introducir.

---

## Veredicto

Clasifica la métrica:

| Dimensión | Valoración |
|-----------|-----------|
| **Alineación con el objetivo real** | Alta / Media / Baja |
| **Resistencia al gaming** | Alta / Media / Baja |
| **Facilidad de malinterpretación** | Alta / Media / Baja |
| **Utilidad como señal de alerta** | Alta / Media / Baja |

Termina con una recomendación concreta: ¿usar tal cual, modificar (cómo), complementar (con qué) o descartar (por qué)?
