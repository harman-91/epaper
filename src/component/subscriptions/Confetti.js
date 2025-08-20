import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/checkout.module.css";

const confettiCount = 30;
const gravityConfetti = 0.3;
const dragConfetti = 0.075;
const terminalVelocity = 3;

const colors = [
  { front: "#e74c3c", back: "#c0392b" }, // Red
  { front: "#3498db", back: "#2980b9" }, // Blue
  { front: "#2ecc71", back: "#27ae60" }, // Green
  { front: "#f39c12", back: "#e67e22" }, // Orange
  { front: "#9b59b6", back: "#8e44ad" }, // Purple
  { front: "#1abc9c", back: "#16a085" }, // Turquoise
  { front: "#e91e63", back: "#ad1457" }, // Pink
  { front: "#34495e", back: "#2c3e50" }, // Dark Blue Gray
];

const randomRange = (min, max) => Math.random() * (max - min) + min;

const initConfettoVelocity = (xRange, yRange) => {
  const x = randomRange(xRange[0], xRange[1]);
  const range = yRange[1] - yRange[0] + 1;
  let y =
    yRange[1] - Math.abs(randomRange(0, range) + randomRange(0, range) - range);
  if (y >= yRange[1] - 1) {
    y += Math.random() < 0.25 ? randomRange(1, 3) : 0;
  }
  return { x, y: -y };
};

function Confetto(triggerElement) {
  this.randomModifier = randomRange(0, 99);
  this.color = colors[Math.floor(randomRange(0, colors.length))];
  this.dimensions = {
    x: randomRange(6, 12),
    y: randomRange(8, 16),
  };
  const rect = triggerElement.getBoundingClientRect();
  this.position = {
    x: randomRange(
      rect.left + rect.width / 4,
      rect.left + (3 * rect.width) / 4
    ),
    y: randomRange(
      rect.top + rect.height / 2 + 8,
      rect.top + 1.5 * rect.height - 8
    ),
  };
  this.rotation = randomRange(0, 2 * Math.PI);
  this.scale = { x: 1, y: 1 };
  this.velocity = initConfettoVelocity([-12, 12], [6, 15]);
}

Confetto.prototype.update = function () {
  this.velocity.x -= this.velocity.x * dragConfetti;
  this.velocity.y = Math.min(
    this.velocity.y + gravityConfetti,
    terminalVelocity
  );
  this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09);
};

const Confetti = ({ isActive, triggerElement }) => {
  const [confetti, setConfetti] = useState([]);
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (
      !isActive ||
      !triggerElement ||
      !canvasRef.current ||
      !triggerElement.isConnected
    ) {
      setConfetti([]);
      return;
    }

    const initBurst = () => {
      const newConfetti = [];
      for (let i = 0; i < confettiCount; i++) {
        newConfetti.push(new Confetto(triggerElement));
      }
      setConfetti(newConfetti);
    };

    initBurst();

    // Set timeout to clear confetti after 4 seconds
    const timeout = setTimeout(() => {
      setConfetti([]);
    }, 4000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isActive, triggerElement]);

  useEffect(() => {
    if (!confetti.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((confetto) => {
        const width = confetto.dimensions.x * confetto.scale.x;
        const height = confetto.dimensions.y * confetto.scale.y;

        ctx.translate(confetto.position.x, confetto.position.y);
        ctx.rotate(confetto.rotation);
        confetto.update();
        ctx.fillStyle =
          confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;
        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      });

      setConfetti((prev) =>
        prev.filter((confetto) => confetto.position.y < canvas.height)
      );

      if (confetti.length > 0) {
        animationIdRef.current = requestAnimationFrame(render);
      }
    };

    animationIdRef.current = requestAnimationFrame(render);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [confetti]);

  if (!isActive) return null;

  return <canvas ref={canvasRef} className={styles.confettiContainer} aria-hidden="true" />;
};

export default Confetti;