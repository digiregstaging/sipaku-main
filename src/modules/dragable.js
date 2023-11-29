import { reactive } from "vue";

export const positionCorrectionPopup = reactive({ x: 0, y: 0 });

export function draggableCorrectionPopup(htmlId) {
  interact(htmlId).draggable({
    ignoreFrom: "input, textarea",
    inertia: true,
    restrict: {
      restriction: "parent",
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
    },
    listeners: {
      move(event) {
        positionCorrectionPopup.x += event.dx;
        positionCorrectionPopup.y += event.dy;
        event.target.style.transform = `translate(${positionCorrectionPopup.x}px, ${positionCorrectionPopup.y}px)`;
      },
    },
  });
}
